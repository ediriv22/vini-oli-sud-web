<?php
/**
 * Vini Oli Sud — paypal-create-order.php
 *
 * Sostituisce i vecchi PayPal Hosted Buttons (6 bottoni a importo fisso,
 * creabili solo da dashboard PayPal — vedi commit precedenti) con Smart
 * Payment Buttons a importo dinamico: il client chiama questo endpoint
 * per creare l'ordine, PayPal.Buttons({createOrder}) lo usa, poi
 * onApprove chiama paypal-confirm.php come prima (invariato).
 *
 * Riceve solo request_id: l'importo NON arriva mai dal browser, viene
 * riletto dalla riga CSV scritta da lead.php al submit — stessa fonte di
 * verità già usata da paypal-confirm.php, stesso schema di sicurezza.
 *
 * Setup richiesto sul server (stesso config.php di lead.php/paypal-confirm.php):
 *   PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, PAYPAL_LIVE, PAYPAL_RECEIVER_EMAIL.
 */

declare(strict_types=1);

require __DIR__ . '/lib/vos-sfide.php';

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$respond = function (bool $ok, array $extra = []): void {
    echo json_encode(['ok' => $ok] + $extra, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
};

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    $respond(false, ['error' => 'Metodo non consentito.']);
}

$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    error_log('paypal-create-order.php: config.php mancante.');
    http_response_code(500);
    $respond(false, ['error' => 'Configurazione assente.']);
}
$config = require $configPath;
if (!is_array($config)) {
    http_response_code(500);
    $respond(false, ['error' => 'Configurazione non valida.']);
}

$dataDir = __DIR__ . '/data';

// -----------------------------------------------------------------------
// 1. Input — solo request_id, stesso pattern di paypal-confirm.php.
// -----------------------------------------------------------------------

$raw = file_get_contents('php://input');
$body = json_decode((string) $raw, true);
if (!is_array($body)) {
    $respond(false, ['error' => 'Payload non valido.']);
}

$requestId = trim((string) ($body['request_id'] ?? ''));
if ($requestId === '' || !preg_match('/^[a-f0-9]+$/', $requestId)) {
    $respond(false, ['error' => 'request_id non valido.']);
}

// -----------------------------------------------------------------------
// 2. Riga CSV corrispondente — fonte di verità per l'importo.
// -----------------------------------------------------------------------

$row = vos_read_csv_row($dataDir, 'pass-giurato-iscrizioni.csv', $requestId);
if ($row === null) {
    error_log("paypal-create-order.php: request_id $requestId non trovato nel CSV.");
    $respond(false, ['error' => 'Iscrizione non trovata.']);
}
if (($row['metodo_pagamento'] ?? '') !== 'paypal') {
    $respond(false, ['error' => 'Questa iscrizione non è a pagamento PayPal.']);
}
if (($row['stato_pagamento'] ?? '') === 'pagato') {
    $respond(false, ['error' => 'Questa iscrizione risulta già pagata.']);
}
$importoAtteso = (float) ($row['importo_atteso'] ?? 0);
if ($importoAtteso <= 0) {
    error_log("paypal-create-order.php: importo_atteso mancante/invalido per request_id $requestId.");
    $respond(false, ['error' => 'Dati iscrizione incompleti.']);
}

// -----------------------------------------------------------------------
// 3. OAuth2 client_credentials — stesso schema di paypal-confirm.php.
// -----------------------------------------------------------------------

$clientId     = (string) ($config['PAYPAL_CLIENT_ID'] ?? '');
$clientSecret = (string) ($config['PAYPAL_CLIENT_SECRET'] ?? '');
$live         = $config['PAYPAL_LIVE'] ?? true;
$apiBase      = $live ? 'https://api-m.paypal.com' : 'https://api-m.sandbox.paypal.com';

if ($clientId === '' || $clientSecret === '') {
    error_log('paypal-create-order.php: PAYPAL_CLIENT_ID/SECRET mancanti in config.php.');
    http_response_code(500);
    $respond(false, ['error' => 'Configurazione PayPal assente.']);
}

function vpco_curl(string $url, array $opts): array {
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

[$tokenStatus, $tokenBody] = vpco_curl("$apiBase/v1/oauth2/token", [
    CURLOPT_POST       => true,
    CURLOPT_POSTFIELDS => 'grant_type=client_credentials',
    CURLOPT_HTTPHEADER => ['Accept: application/json', 'Accept-Language: en_US'],
    CURLOPT_USERPWD    => $clientId . ':' . $clientSecret,
]);

$accessToken = $tokenBody['access_token'] ?? null;
if ($tokenStatus !== 200 || !$accessToken) {
    error_log("paypal-create-order.php: OAuth token fallito (status $tokenStatus) per request_id $requestId.");
    http_response_code(502);
    $respond(false, ['error' => 'Impossibile contattare PayPal. Riprova tra poco.']);
}

// -----------------------------------------------------------------------
// 4. Crea l'ordine — importo/valuta solo dal CSV, mai dal client.
// -----------------------------------------------------------------------

$amountStr = number_format($importoAtteso, 2, '.', '');

$orderPayload = [
    'intent' => 'CAPTURE',
    'purchase_units' => [[
        'reference_id' => $requestId,
        'description'  => 'Pass Giurato Popolare — Gran Premio del Gusto',
        'amount' => [
            'currency_code' => 'EUR',
            'value'         => $amountStr,
        ],
    ]],
];

[$createStatus, $created] = vpco_curl("$apiBase/v2/checkout/orders", [
    CURLOPT_POST       => true,
    CURLOPT_POSTFIELDS => json_encode($orderPayload, JSON_UNESCAPED_SLASHES),
    CURLOPT_HTTPHEADER => ["Authorization: Bearer $accessToken", 'Content-Type: application/json'],
]);

$orderId = $created['id'] ?? null;
if (($createStatus !== 200 && $createStatus !== 201) || !$orderId) {
    error_log("paypal-create-order.php: creazione ordine fallita (status $createStatus) per request_id $requestId — " . json_encode($created));
    http_response_code(502);
    $respond(false, ['error' => 'Impossibile creare l\'ordine PayPal. Riprova o scrivi a napoliracingshow@gmail.com.']);
}

$respond(true, ['id' => $orderId]);
