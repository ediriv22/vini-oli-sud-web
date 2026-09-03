<?php
/**
 * Vini Oli Sud — paypal-confirm.php
 *
 * Chiamato dal browser (fetch) subito dopo che l'utente approva il
 * pagamento su un pulsante PayPal Hosted Buttons in /pass-giurato/ (evento
 * onApprove lato JS, vedi src/app/pass-giurato/page.tsx). Riceve solo
 * request_id + orderID: NON si fida di nessun altro dato mandato dal
 * browser (importo, tipo pass, ecc. vengono riletti dal CSV scritto da
 * lead.php al momento del submit, non dal client).
 *
 * Verifica reale: interroga PayPal Orders API v2 con le credenziali server
 * (PAYPAL_CLIENT_ID/SECRET in config.php) e controlla che l'ordine sia
 * davvero COMPLETED, per l'importo/valuta attesi. Solo allora:
 *   1. aggiorna la riga CSV/Sheet a stato_pagamento=pagato;
 *   2. invia la mail di conferma utente (mai inviata da lead.php per
 *      paypal — vedi §8bis lì).
 *
 * Idempotente: se la riga risulta già "pagato", risponde ok senza rifare
 * nulla (evita doppie mail se il browser richiama per errore/refresh).
 *
 * Setup richiesto sul server (stesso schema di lead.php, vedi quel file):
 *   config.php deve avere PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET,
 *   PAYPAL_LIVE, PAYPAL_RECEIVER_EMAIL.
 */

declare(strict_types=1);

require __DIR__ . '/lib/vos-sfide.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$respond = function (bool $ok, ?string $error = null): void {
    $payload = ['ok' => $ok];
    if ($error !== null) {
        $payload['error'] = $error;
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
};

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    $respond(false, 'Metodo non consentito.');
}

$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    error_log('paypal-confirm.php: config.php mancante.');
    http_response_code(500);
    $respond(false, 'Configurazione assente.');
}
$config = require $configPath;
if (!is_array($config)) {
    http_response_code(500);
    $respond(false, 'Configurazione non valida.');
}

$dataDir = __DIR__ . '/data';

// -----------------------------------------------------------------------
// 1. Input — solo request_id e orderID, tutto il resto viene dal CSV.
// -----------------------------------------------------------------------

$raw = file_get_contents('php://input');
$body = json_decode((string) $raw, true);
if (!is_array($body)) {
    $respond(false, 'Payload non valido.');
}

$requestId = trim((string) ($body['request_id'] ?? ''));
$orderId   = trim((string) ($body['orderID'] ?? ''));
if ($requestId === '' || !preg_match('/^[a-f0-9]+$/', $requestId)) {
    $respond(false, 'request_id non valido.');
}
if ($orderId === '') {
    $respond(false, 'orderID mancante.');
}

// -----------------------------------------------------------------------
// 2. Riga CSV corrispondente — fonte di verità per importo/email attesi.
// -----------------------------------------------------------------------

$row = vos_read_csv_row($dataDir, 'pass-giurato-iscrizioni.csv', $requestId);
if ($row === null) {
    error_log("paypal-confirm.php: request_id $requestId non trovato nel CSV.");
    $respond(false, 'Iscrizione non trovata.');
}
if (($row['metodo_pagamento'] ?? '') !== 'paypal') {
    $respond(false, 'Questa iscrizione non è a pagamento PayPal.');
}
if (($row['stato_pagamento'] ?? '') === 'pagato') {
    // Già confermato in una chiamata precedente: idempotente, nessuna
    // doppia mail, nessuna doppia chiamata a PayPal.
    $respond(true);
}
$importoAtteso = (float) ($row['importo_atteso'] ?? 0);
$emailUtente   = (string) ($row['email'] ?? '');
if ($importoAtteso <= 0 || $emailUtente === '') {
    error_log("paypal-confirm.php: dati riga incompleti per request_id $requestId.");
    $respond(false, 'Dati iscrizione incompleti.');
}

// -----------------------------------------------------------------------
// 3. OAuth2 client_credentials — token PayPal per chiamare Orders API.
// -----------------------------------------------------------------------

$clientId     = (string) ($config['PAYPAL_CLIENT_ID'] ?? '');
$clientSecret = (string) ($config['PAYPAL_CLIENT_SECRET'] ?? '');
$live         = $config['PAYPAL_LIVE'] ?? true;
$apiBase      = $live ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

if ($clientId === '' || $clientSecret === '') {
    error_log('paypal-confirm.php: PAYPAL_CLIENT_ID/SECRET mancanti in config.php.');
    http_response_code(500);
    $respond(false, 'Configurazione PayPal assente.');
}

function vos_paypal_curl(string $url, array $opts): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, $opts + [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_SSL_VERIFYPEER => true,
    ]);
    $body = curl_exec($ch);
    $status = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err = curl_error($ch);
    curl_close($ch);
    if ($body === false) {
        return [0, null, $err];
    }
    $decoded = json_decode((string) $body, true);
    return [$status, is_array($decoded) ? $decoded : null, $err];
}

[$tokenStatus, $tokenBody] = vos_paypal_curl("$apiBase/v1/oauth2/token", [
    CURLOPT_POST       => true,
    CURLOPT_POSTFIELDS => 'grant_type=client_credentials',
    CURLOPT_HTTPHEADER => ['Accept: application/json', 'Accept-Language: en_US'],
    CURLOPT_USERPWD    => $clientId . ':' . $clientSecret,
]);

$accessToken = $tokenBody['access_token'] ?? null;
if ($tokenStatus !== 200 || !$accessToken) {
    error_log("paypal-confirm.php: OAuth token fallito (status $tokenStatus) per request_id $requestId.");
    http_response_code(502);
    $respond(false, 'Verifica PayPal non riuscita. Riprova o scrivi a napoliracingshow@gmail.com.');
}

// -----------------------------------------------------------------------
// 4. Legge l'ordine. Se non ancora catturato (APPROVED), lo cattura.
// -----------------------------------------------------------------------

[$orderStatus, $order] = vos_paypal_curl("$apiBase/v2/checkout/orders/$orderId", [
    CURLOPT_HTTPHEADER => ["Authorization: Bearer $accessToken", 'Content-Type: application/json'],
]);

if ($orderStatus !== 200 || !$order) {
    error_log("paypal-confirm.php: GET order fallito (status $orderStatus) per orderID $orderId / request_id $requestId.");
    http_response_code(502);
    $respond(false, 'Ordine PayPal non trovato.');
}

if (($order['status'] ?? '') === 'APPROVED') {
    // I pulsanti Hosted Buttons di norma catturano in automatico, ma per
    // sicurezza se risultasse solo "approvato" lo catturiamo qui prima di
    // proseguire — senza cattura il denaro non è ancora incassato.
    [$captureStatus, $captured] = vos_paypal_curl("$apiBase/v2/checkout/orders/$orderId/capture", [
        CURLOPT_POST       => true,
        CURLOPT_POSTFIELDS => '{}',
        CURLOPT_HTTPHEADER => ["Authorization: Bearer $accessToken", 'Content-Type: application/json'],
    ]);
    if ($captureStatus === 200 || $captureStatus === 201) {
        $order = $captured;
    }
}

$orderPaid = ($order['status'] ?? '') === 'COMPLETED';
$purchaseUnit = $order['purchase_units'][0] ?? [];
$amount = $purchaseUnit['amount'] ?? ($purchaseUnit['payments']['captures'][0]['amount'] ?? []);
$amountValue    = (float) ($amount['value'] ?? 0);
$amountCurrency = (string) ($amount['currency_code'] ?? '');

// Tolleranza 0 centesimi: l'importo deve combaciare esatto con quanto
// calcolato server-side al submit del form (vedi lead.php).
$amountOk = $orderPaid && $amountCurrency === 'EUR' && abs($amountValue - $importoAtteso) < 0.005;

// Controllo extra facoltativo: se PayPal espone l'email del payee
// (venditore) sull'ordine, deve combaciare con l'account business
// configurato — protezione in più contro ordini manomessi/di altri account.
$payeeEmail = $purchaseUnit['payee']['email_address'] ?? null;
$receiverConfigured = trim((string) ($config['PAYPAL_RECEIVER_EMAIL'] ?? ''));
$payeeOk = ($payeeEmail === null || $receiverConfigured === '')
    || strtolower((string) $payeeEmail) === strtolower($receiverConfigured);

if (!$orderPaid || !$amountOk || !$payeeOk) {
    error_log(sprintf(
        'paypal-confirm.php: verifica fallita per request_id %s / orderID %s — status=%s importo=%s/%s atteso=%s payee=%s',
        $requestId,
        $orderId,
        (string) ($order['status'] ?? '?'),
        (string) $amountValue,
        $amountCurrency,
        (string) $importoAtteso,
        (string) ($payeeEmail ?? '—'),
    ));
    $respond(false, 'Pagamento non ancora confermato da PayPal. Se hai completato il pagamento, scrivi a napoliracingshow@gmail.com con il tuo codice iscrizione.');
}

// -----------------------------------------------------------------------
// 5. Pagamento verificato reale — aggiorna CSV/Sheet, manda mail conferma.
// -----------------------------------------------------------------------

vos_update_csv_row($dataDir, 'pass-giurato-iscrizioni.csv', $requestId, [
    'stato_pagamento' => 'pagato',
]);

vos_push_google_sheet($config, 'GOOGLE_SHEET_WEBAPP_URL_GIURATO', [
    'requestId'      => $requestId,
    'azione'         => 'aggiorna-stato-pagamento',
    'statoPagamento' => 'pagato',
    'orderId'        => $orderId,
]);

vos_send_giurato_confirmation($config, $emailUtente, $requestId);

$respond(true);
