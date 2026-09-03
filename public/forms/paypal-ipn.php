<?php
/**
 * Vini Oli Sud — paypal-ipn.php
 *
 * Riceve le notifiche IPN (Instant Payment Notification) che PayPal manda
 * ad ogni pagamento sull'account business (attivato in PayPal > Impostazioni
 * conto > Notifiche > IPN, URL puntato qui). Canale di AUDIT/backup, non
 * primario: il canale primario che conferma il pagamento e sblocca la mail
 * utente è paypal-confirm.php (chiamato dal browser via onApprove, verifica
 * sincrona su Orders API v2 — vedi quel file).
 *
 * Perché backup e non primario: i pulsanti Hosted Buttons SDK non
 * permettono di allegare in modo affidabile il nostro request_id
 * all'evento IPN (nessun campo "custom" impostabile da un pulsante creato
 * via NCP no-code) — quindi qui possiamo solo loggare ogni pagamento
 * ricevuto per riscontro manuale, non correlarlo automaticamente a
 * un'iscrizione specifica.
 *
 * Scrive ogni notifica verificata in forms/data/paypal-ipn-log.csv, utile
 * alla Segreteria per un controllo incrociato manuale (importo, data,
 * txn_id) contro pass-giurato-iscrizioni.csv se qualcosa non torna.
 *
 * PayPal richiede risposta HTTP 200 rapida: nessuna elaborazione pesante
 * qui, solo verifica autenticità + log.
 */

declare(strict_types=1);

require __DIR__ . '/lib/vos-sfide.php';

// PayPal non aspetta un body di risposta significativo, ma chiudiamo comunque
// con 200 esplicito per essere certi non venga letto come errore/retry.
http_response_code(200);

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    exit;
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0750, true);
}

$configPath = __DIR__ . '/config.php';
$config = is_readable($configPath) ? require $configPath : [];
$live = is_array($config) ? ($config['PAYPAL_LIVE'] ?? true) : true;
$verifyUrl = $live
    ? 'https://ipnpb.paypal.com/cgi-bin/webscr'
    : 'https://ipnpb.sandbox.paypal.com/cgi-bin/webscr';

// -----------------------------------------------------------------------
// 1. Verifica autenticità: reinvia lo stesso body a PayPal con cmd
//    aggiunto in testa, deve rispondere "VERIFIED" — altrimenti scartiamo
//    (potrebbe essere un finto IPN mandato da chiunque a questo URL).
// -----------------------------------------------------------------------

$raw = file_get_contents('php://input');
if ($raw === false || $raw === '') {
    exit;
}

$verifyBody = 'cmd=_notify-validate&' . $raw;

$ch = curl_init($verifyUrl);
curl_setopt_array($ch, [
    CURLOPT_POST           => true,
    CURLOPT_POSTFIELDS     => $verifyBody,
    CURLOPT_RETURNTRANSFER => true,
    CURLOPT_TIMEOUT        => 15,
    CURLOPT_SSL_VERIFYPEER => true,
    CURLOPT_HTTPHEADER     => ['Connection: Close'],
]);
$verifyResponse = curl_exec($ch);
curl_close($ch);

if (trim((string) $verifyResponse) !== 'VERIFIED') {
    error_log('paypal-ipn.php: IPN non verificato da PayPal (scartato).');
    exit;
}

// -----------------------------------------------------------------------
// 2. Parsa i campi utili e logga — nessuna azione oltre al log (vedi
//    intestazione file: correlazione automatica non disponibile qui).
// -----------------------------------------------------------------------

parse_str($raw, $fields);

$paymentStatus = (string) ($fields['payment_status'] ?? '');
$txnId         = (string) ($fields['txn_id'] ?? '');
$mcGross       = (string) ($fields['mc_gross'] ?? '');
$mcCurrency    = (string) ($fields['mc_currency'] ?? '');
$payerEmail    = (string) ($fields['payer_email'] ?? '');
$receiverEmail = (string) ($fields['receiver_email'] ?? '');
$custom        = (string) ($fields['custom'] ?? '');

$fh = @fopen($dataDir . '/paypal-ipn-log.csv', 'a');
if ($fh) {
    if (flock($fh, LOCK_EX)) {
        if (filesize($dataDir . '/paypal-ipn-log.csv') === 0) {
            fputcsv($fh, ['data_ora', 'payment_status', 'txn_id', 'mc_gross', 'mc_currency',
                'payer_email', 'receiver_email', 'custom'], ',', '"', '\\');
        }
        fputcsv($fh, [date('c'), $paymentStatus, $txnId, $mcGross, $mcCurrency,
            $payerEmail, $receiverEmail, $custom], ',', '"', '\\');
        flock($fh, LOCK_UN);
    }
    fclose($fh);
}
