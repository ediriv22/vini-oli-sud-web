<?php
/**
 * Vini Oli Sud — lead.php v2
 *
 * Endpoint unico per i moduli del sito:
 *   - LeadMiniForm            (/contatti)
 *   - VisitorCarnetForm       (/visitatori)
 *   - FoodRadarSuggestionForm (/diario-del-sud)
 *
 * Caratteristiche:
 *   - accetta POST application/x-www-form-urlencoded o multipart/form-data;
 *   - risponde sempre JSON { ok: bool, error?: string, requestId?: string };
 *   - routing destinatario per requestType / audience / interest;
 *   - PHPMailer + SMTP Google Workspace (smtp.gmail.com);
 *   - honeypot anti-bot (campo nascosto "website_url");
 *   - rate limit soft (max 5 submit / 5 min per IP, su file flat);
 *   - log non sensibile (id, timestamp, type, ip-hash) + prova consenso.
 *
 * Setup richiesto sul server Aruba (NIENTE di tutto questo nel repo):
 *   1. /htdocs/forms/config.php — con SMTP_HOST, SMTP_USER, SMTP_PASS,
 *      SMTP_PORT, SMTP_SECURE, MAIL_FROM, MAIL_FROM_NAME, MAIL_TO_*.
 *      Esempio nel template config.example.php (questo repo).
 *   2. /htdocs/forms/PHPMailer/ — cartella con src/PHPMailer.php,
 *      src/SMTP.php, src/Exception.php (scaricabile da
 *      https://github.com/PHPMailer/PHPMailer/releases). Se preferisci
 *      composer, esegui `composer require phpmailer/phpmailer` nella
 *      stessa cartella forms/.
 *   3. /htdocs/forms/data/ — cartella scrivibile (chmod 750) per i log
 *      anonimizzati e per il file di rate-limit.
 *   4. DNS: SPF v=spf1 include:_spf.google.com ~all + DKIM Workspace +
 *      DMARC iniziale p=none.
 */

declare(strict_types=1);

// -----------------------------------------------------------------------------
// 0. Bootstrap
// -----------------------------------------------------------------------------

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

$respond = function (bool $ok, ?string $error = null, ?string $requestId = null): void {
    $payload = ['ok' => $ok];
    if ($error !== null) {
        $payload['error'] = $error;
    }
    if ($requestId !== null) {
        $payload['requestId'] = $requestId;
    }
    echo json_encode($payload, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
    exit;
};

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') !== 'POST') {
    http_response_code(405);
    $respond(false, 'Metodo non consentito.');
}

// -----------------------------------------------------------------------------
// 1. Config (fuori dal repo, accanto a lead.php)
// -----------------------------------------------------------------------------

$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    error_log('lead.php: config.php mancante.');
    http_response_code(500);
    $respond(false, 'Configurazione assente. Contatta info@vinisud.it.');
}
$config = require $configPath;
if (!is_array($config)) {
    http_response_code(500);
    $respond(false, 'Configurazione non valida.');
}

$dataDir = __DIR__ . '/data';
if (!is_dir($dataDir)) {
    @mkdir($dataDir, 0750, true);
}

// -----------------------------------------------------------------------------
// 2. Helpers
// -----------------------------------------------------------------------------

function vos_clean_line(?string $value): string {
    if ($value === null) {
        return '';
    }
    $value = preg_replace("/[\r\n\t]+/", ' ', $value) ?? '';
    return trim(mb_substr($value, 0, 500));
}

function vos_clean_multiline(?string $value, int $max = 2000): string {
    if ($value === null) {
        return '';
    }
    $value = str_replace(["\r\n", "\r"], "\n", $value);
    return trim(mb_substr($value, 0, $max));
}

function vos_ip_hash(): string {
    $ip = $_SERVER['HTTP_X_FORWARDED_FOR'] ?? $_SERVER['REMOTE_ADDR'] ?? '';
    if (strpos($ip, ',') !== false) {
        $ip = trim(explode(',', $ip)[0]);
    }
    return hash('sha256', $ip . '|vinisud');
}

function vos_rate_limit_check(string $dataDir): bool {
    $file = $dataDir . '/ratelimit.json';
    $hash = vos_ip_hash();
    $now = time();
    $window = 300;     // 5 minuti
    $limit  = 5;       // 5 submit / IP / 5min

    $state = [];
    if (is_readable($file)) {
        $raw = @file_get_contents($file);
        if ($raw !== false) {
            $decoded = json_decode($raw, true);
            if (is_array($decoded)) {
                $state = $decoded;
            }
        }
    }

    foreach ($state as $key => $entry) {
        if (!is_array($entry) || ($entry['last'] ?? 0) < ($now - $window)) {
            unset($state[$key]);
        }
    }

    $entry = $state[$hash] ?? ['count' => 0, 'last' => 0];
    if ($entry['last'] >= ($now - $window) && $entry['count'] >= $limit) {
        return false;
    }
    $state[$hash] = [
        'count' => ($entry['last'] >= ($now - $window) ? $entry['count'] : 0) + 1,
        'last'  => $now,
    ];
    @file_put_contents($file, json_encode($state), LOCK_EX);
    return true;
}

function vos_make_request_id(): string {
    return strtolower(bin2hex(random_bytes(6)));
}

function vos_log_request(string $dataDir, string $requestId, string $type, bool $ok): void {
    $line = sprintf(
        "%s\t%s\t%s\t%s\t%s\n",
        date('c'),
        $requestId,
        $type,
        $ok ? 'ok' : 'fail',
        vos_ip_hash()
    );
    @file_put_contents($dataDir . '/requests.log', $line, FILE_APPEND | LOCK_EX);
}

function vos_log_consent(string $dataDir, string $requestId, string $policyVersion): void {
    $line = sprintf(
        "%s\t%s\t%s\t%s\n",
        date('c'),
        $requestId,
        $policyVersion,
        vos_ip_hash()
    );
    @file_put_contents($dataDir . '/consent.log', $line, FILE_APPEND | LOCK_EX);
}

/**
 * Inserisce il lead nel database Aruba (DB #1). Lancia un'eccezione se la
 * config è incompleta o la query fallisce: il chiamante decide come reagire.
 * Le chiavi di $record devono corrispondere alle colonne di vos_form_leads.
 */
function vos_db_insert(array $config, array $record): void {
    $host  = (string)($config['DB_HOST'] ?? '');
    $name  = (string)($config['DB_NAME'] ?? '');
    $user  = (string)($config['DB_USER'] ?? '');
    $pass  = (string)($config['DB_PASS'] ?? '');
    $table = (string)($config['DB_TABLE'] ?? 'vos_form_leads');

    if ($host === '' || $name === '' || $user === '') {
        throw new RuntimeException('Config DB incompleta.');
    }
    if (!preg_match('/^[A-Za-z0-9_]+$/', $table)) {
        throw new RuntimeException('Nome tabella non valido.');
    }

    $dsn = "mysql:host={$host};dbname={$name};charset=utf8mb4";
    $pdo = new PDO($dsn, $user, $pass, [
        PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
        PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        PDO::ATTR_EMULATE_PREPARES   => false,
    ]);

    $cols = array_keys($record);
    $placeholders = [];
    foreach ($cols as $c) {
        $placeholders[] = ':' . $c;
    }
    $sql = 'INSERT INTO `' . $table . '` (`' . implode('`,`', $cols) . '`) '
         . 'VALUES (' . implode(',', $placeholders) . ')';

    $stmt = $pdo->prepare($sql);
    foreach ($record as $k => $v) {
        $stmt->bindValue(':' . $k, $v);
    }
    $stmt->execute();
}

// -----------------------------------------------------------------------------
// 3. Honeypot — silent success per i bot
// -----------------------------------------------------------------------------

if (!empty($_POST['website_url'])) {
    $respond(true, null, vos_make_request_id());
}

// -----------------------------------------------------------------------------
// 4. Rate limit
// -----------------------------------------------------------------------------

if (!vos_rate_limit_check($dataDir)) {
    http_response_code(429);
    $respond(false, 'Troppe richieste. Riprova fra qualche minuto.');
}

// -----------------------------------------------------------------------------
// 5. Routing per requestType / audience / interest
// -----------------------------------------------------------------------------

$requestType = strtolower(vos_clean_line($_POST['requestType'] ?? ''));
$audience    = strtolower(vos_clean_line($_POST['audience'] ?? ''));
$interest    = strtolower(vos_clean_line($_POST['interest'] ?? ''));

$INTEREST_TO_KEY = [
    'visitatori'  => 'MAIL_TO_VISITATORI',
    'espositori'  => 'MAIL_TO_ESPOSITORI',
    'buyer'       => 'MAIL_TO_BUYER',
    'media'       => 'MAIL_TO_MEDIA',
    'partnership' => 'MAIL_TO_PARTNERSHIP',
    'grand-prix'  => 'MAIL_TO_GRAND_PRIX',
];

$routingKey = null;
if ($requestType === 'carnet-degustazione' || $audience === 'visitatori') {
    $routingKey = 'MAIL_TO_VISITATORI';
} elseif ($requestType === 'segnalazione-editoriale' || $audience === 'diario-del-sud') {
    $routingKey = 'MAIL_TO_DIARIO';
} elseif (isset($INTEREST_TO_KEY[$interest])) {
    $routingKey = $INTEREST_TO_KEY[$interest];
} elseif (isset($INTEREST_TO_KEY[$audience])) {
    $routingKey = $INTEREST_TO_KEY[$audience];
}
$routingKey = $routingKey ?? 'MAIL_TO_INFO';

$to = $config[$routingKey] ?? ($config['MAIL_TO_INFO'] ?? '');
if (!filter_var($to, FILTER_VALIDATE_EMAIL)) {
    error_log("lead.php: destinatario non valido per chiave $routingKey");
    http_response_code(500);
    $respond(false, 'Configurazione destinatario assente.');
}

// -----------------------------------------------------------------------------
// 6. Validazione campi per tipo richiesta
// -----------------------------------------------------------------------------

$email = vos_clean_line($_POST['email'] ?? '');
if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
    $respond(false, 'Inserisci un indirizzo email valido.');
}

$privacy = $_POST['privacy_consent'] ?? '';
if (empty($privacy)) {
    $respond(false, 'Devi accettare la privacy policy per inviare la richiesta.');
}

$payload = [];
$subject = '';
$kind    = '';
$record  = [];

if ($requestType === 'carnet-degustazione' || $audience === 'visitatori') {
    $kind = 'carnet-degustazione';
    $qty = vos_clean_line($_POST['quantity'] ?? '');
    if ($qty === '') {
        $respond(false, 'Indica quanti ingressi desideri.');
    }
    $payload = [
        'Quantità ingressi' => $qty,
        'Email visitatore'  => $email,
    ];
    $record = [
        'form_type' => $kind,
        'email'     => $email,
        'quantity'  => $qty,
    ];
    $subject = 'Nuova richiesta Carnet Degustazione — Vini Oli Sud';
} elseif ($requestType === 'segnalazione-editoriale' || $audience === 'diario-del-sud') {
    $kind = 'segnalazione-editoriale';
    $title    = vos_clean_line($_POST['title'] ?? '');
    $url      = vos_clean_line($_POST['url'] ?? '');
    $source   = vos_clean_line($_POST['source'] ?? '');
    $category = vos_clean_line($_POST['category'] ?? '');
    $note     = vos_clean_multiline($_POST['note'] ?? '', 500);
    if ($title === '' || $source === '' || $category === '') {
        $respond(false, 'Compila titolo, fonte e categoria della segnalazione.');
    }
    if (!preg_match('#^https?://#i', $url)) {
        $respond(false, 'Inserisci un link valido (http/https).');
    }
    $payload = [
        'Categoria' => $category,
        'Titolo'    => $title,
        'Fonte'     => $source,
        'Link'      => $url,
        'Email'     => $email,
        'Nota'      => $note !== '' ? $note : '—',
    ];
    $record = [
        'form_type'    => $kind,
        'email'        => $email,
        'seg_title'    => $title,
        'seg_url'      => $url,
        'seg_source'   => $source,
        'seg_category' => $category,
        'message'      => $note !== '' ? $note : null,
    ];
    $subject = 'Nuova segnalazione Diario del Sud — Vini Oli Sud';
} else {
    $kind = 'manifestazione-interesse';
    $name    = vos_clean_line($_POST['fullname'] ?? '');
    $company = vos_clean_line($_POST['company'] ?? '');
    $website = vos_clean_line($_POST['website'] ?? '');
    $message = vos_clean_multiline($_POST['message'] ?? '', 2000);
    if ($name === '') {
        $respond(false, 'Nome e cognome è obbligatorio.');
    }
    if ($company === '') {
        $respond(false, 'Ragione sociale è obbligatoria.');
    }
    $payload = [
        'Nome e cognome'    => $name,
        'Ragione sociale'   => $company,
        'Email'             => $email,
        'Sito web'          => $website !== '' ? $website : '—',
        'Area di interesse' => $interest !== '' ? $interest : '—',
        'Note'              => $message !== '' ? $message : '—',
    ];
    $record = [
        'form_type' => $kind,
        'email'     => $email,
        'fullname'  => $name,
        'company'   => $company,
        'website'   => $website !== '' ? $website : null,
        'message'   => $message !== '' ? $message : null,
    ];
    $subject = 'Nuova richiesta Vini Oli Sud — ' . ($interest !== '' ? ucfirst($interest) : 'generica');
}

// -----------------------------------------------------------------------------
// 7. Corpo email plain text
// -----------------------------------------------------------------------------

$requestId = vos_make_request_id();
$lines = [];
$lines[] = "Nuova richiesta da vinisud.it (#$requestId)";
$lines[] = "Tipo: $kind";
$lines[] = 'Audience: ' . ($audience !== '' ? $audience : '—');
$lines[] = 'Data: ' . date('Y-m-d H:i:s P');
$lines[] = '';
foreach ($payload as $label => $value) {
    $lines[] = "$label: $value";
}
$lines[] = '';
$lines[] = '---';
$lines[] = 'Richiesta inoltrata dal form pubblico vinisud.it';
$lines[] = "ID: $requestId";
$body = implode("\n", $lines);

// -----------------------------------------------------------------------------
// 7.5 Salvataggio su database (DB #1 Aruba) — fonte primaria del lead
// -----------------------------------------------------------------------------

$record['request_id']         = $requestId;
$record['audience']           = $audience !== '' ? $audience : null;
$record['interest']           = $interest !== '' ? $interest : null;
$record['status']             = 'new';
$record['consenso_privacy']   = 1;
$record['consenso_marketing'] =
    (!empty($_POST['consenso_marketing']) || !empty($_POST['marketing_consent'])) ? 1 : 0;
$record['privacy_version']    = 'privacy-2026-05';
$record['source_url']         =
    vos_clean_line($_POST['source_url'] ?? ($_SERVER['HTTP_REFERER'] ?? '')) ?: null;
$record['utm_source']         = vos_clean_line($_POST['utm_source'] ?? '') ?: null;
$record['utm_medium']         = vos_clean_line($_POST['utm_medium'] ?? '') ?: null;
$record['utm_campaign']       = vos_clean_line($_POST['utm_campaign'] ?? '') ?: null;
$record['ip_hash']            = vos_ip_hash();
$record['user_agent']         = vos_clean_line($_SERVER['HTTP_USER_AGENT'] ?? '') ?: null;
$record['extra_json']         = json_encode($payload, JSON_UNESCAPED_UNICODE);

try {
    vos_db_insert($config, $record);
} catch (\Throwable $e) {
    // Il salvataggio è la garanzia primaria: se fallisce, fermiamo qui.
    error_log('lead.php DB error: ' . $e->getMessage());
    vos_log_request($dataDir, $requestId, $kind, false);
    http_response_code(500);
    $respond(false, 'Salvataggio non riuscito. Riprova più tardi o scrivi a info@vinisud.it.');
}

vos_log_consent($dataDir, $requestId, 'privacy-2026-05');

// -----------------------------------------------------------------------------
// 8. Invio via PHPMailer + SMTP (notifica secondaria: il lead è già salvato)
// -----------------------------------------------------------------------------

$phpmailerLoaded = false;
$phpmailerPaths = [
    __DIR__ . '/PHPMailer/src/PHPMailer.php',
    __DIR__ . '/vendor/phpmailer/phpmailer/src/PHPMailer.php',
];
foreach ($phpmailerPaths as $p) {
    if (is_readable($p)) {
        $base = dirname($p);
        require_once $base . '/Exception.php';
        require_once $base . '/PHPMailer.php';
        require_once $base . '/SMTP.php';
        $phpmailerLoaded = true;
        break;
    }
}
if (!$phpmailerLoaded) {
    // Lead già salvato su DB: la mancata notifica non deve far fallire l'utente.
    error_log('lead.php: PHPMailer non trovato (lead ' . $requestId . ' salvato su DB).');
    vos_log_request($dataDir, $requestId, $kind, true);
    $respond(true, null, $requestId);
}

// Factory: restituisce un mailer SMTP già configurato (connessione Aruba).
$makeMailer = function () use ($config) {
    $mailer = new \PHPMailer\PHPMailer\PHPMailer(true);
    $mailer->isSMTP();
    $mailer->Host       = $config['SMTP_HOST'] ?? 'smtps.aruba.it';
    $mailer->SMTPAuth   = true;
    $mailer->Username   = $config['SMTP_USER'] ?? '';
    $mailer->Password   = $config['SMTP_PASS'] ?? '';
    $mailer->Port       = (int)($config['SMTP_PORT'] ?? 465);
    $secure = strtolower((string)($config['SMTP_SECURE'] ?? 'ssl'));
    if ($secure === 'tls') {
        $mailer->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS;
    } else {
        $mailer->SMTPSecure = \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
    }
    $mailer->CharSet = 'UTF-8';
    $mailer->Timeout = 15;
    return $mailer;
};

// --- 8a. Notifica allo staff (con Ccn) ---
try {
    $mailer = $makeMailer();

    $mailFrom     = $config['MAIL_FROM'] ?? ($config['SMTP_USER'] ?? 'info@vinisud.it');
    $mailFromName = $config['MAIL_FROM_NAME'] ?? 'Vini Oli Sud';

    $mailer->setFrom($mailFrom, $mailFromName);
    $mailer->addAddress($to);
    $mailer->addReplyTo($email);

    // Copia conoscenza nascosta su tutte le notifiche (se configurata e valida).
    $mailBcc = trim((string)($config['MAIL_BCC'] ?? ''));
    if ($mailBcc !== '' && filter_var($mailBcc, FILTER_VALIDATE_EMAIL)) {
        $mailer->addBCC($mailBcc);
    }

    $mailer->Subject = $subject;
    $mailer->isHTML(false);
    $mailer->Body    = $body;

    $mailer->send();
    vos_log_request($dataDir, $requestId, $kind, true);
} catch (\Throwable $e) {
    // Il lead è salvato su DB: la notifica email è secondaria. Logghiamo e
    // proseguiamo, così l'utente non riprova un invio già andato a buon fine.
    error_log('lead.php SMTP error notifica (lead ' . $requestId . ' salvato su DB): ' . $e->getMessage());
    vos_log_request($dataDir, $requestId, $kind, true);
}

// --- 8b. Email di conferma all'utente (best-effort, non blocca la risposta) ---
if (!empty($config['SEND_USER_CONFIRMATION'])) {
    try {
        $kindLabel = [
            'manifestazione-interesse' => 'manifestazione di interesse',
            'carnet-degustazione'      => 'richiesta Carnet Degustazione',
            'segnalazione-editoriale'  => 'segnalazione per il Diario del Sud',
        ][$kind] ?? 'richiesta';

        $confLines = [];
        $confLines[] = 'Ciao,';
        $confLines[] = '';
        $confLines[] = 'grazie per averci scritto. Abbiamo ricevuto la tua ' . $kindLabel
                     . ' e ti risponderemo al più presto.';
        $confLines[] = '';
        $confLines[] = 'Riferimento richiesta: ' . $requestId;
        $confLines[] = '';
        $confLines[] = 'Questo è un messaggio automatico di conferma: non occorre rispondere.';
        $confLines[] = '';
        $confLines[] = '— Vini Oli Sud';

        $confMailer = $makeMailer();
        $confFrom     = $config['CONFIRM_FROM'] ?? ($config['MAIL_FROM'] ?? 'info@vinisud.it');
        $confFromName = $config['CONFIRM_FROM_NAME'] ?? ($config['MAIL_FROM_NAME'] ?? 'Vini Oli Sud');
        $confMailer->setFrom($confFrom, $confFromName);
        $confMailer->addAddress($email);
        // Se l'utente risponde, la mail arriva alla segreteria, non al noreply.
        $confMailer->addReplyTo($config['MAIL_TO_INFO'] ?? $confFrom, $confFromName);
        $confMailer->Subject = $config['CONFIRM_SUBJECT'] ?? 'Abbiamo ricevuto la tua richiesta — Vini Oli Sud';
        $confMailer->isHTML(false);
        $confMailer->Body    = implode("\n", $confLines);
        $confMailer->send();
    } catch (\Throwable $e) {
        // La conferma all'utente è un di più: se fallisce, lo logghiamo soltanto.
        error_log('lead.php SMTP error conferma utente (lead ' . $requestId . '): ' . $e->getMessage());
    }
}

$respond(true, null, $requestId);
