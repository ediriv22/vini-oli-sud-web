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

require __DIR__ . '/lib/vos-sfide.php';

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

/**
 * Valida e salva un file caricato ($_FILES[$field]) sotto
 * $dataDir/uploads/$requestId/. Ritorna il path assoluto salvato, o null se
 * il campo non è stato inviato (consentito solo quando $required = false).
 * In caso di errore di validazione, chiama $onError e termina la richiesta
 * (stessa forma di $respond, passata dal chiamante per evitare una
 * dipendenza circolare sulla closure definita più in basso nel file).
 */
function vos_save_upload(
    string $dataDir,
    string $requestId,
    string $field,
    bool $required,
    callable $onError
): ?string {
    $file = $_FILES[$field] ?? null;
    $hasFile = is_array($file) && ($file['error'] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_NO_FILE;

    if (!$hasFile) {
        if ($required) {
            $onError('Il file richiesto "' . $field . '" non è stato ricevuto.');
        }
        return null;
    }
    if ($file['error'] !== UPLOAD_ERR_OK) {
        $onError('Caricamento file non riuscito (' . $field . ').');
    }

    $maxBytes = 15 * 1024 * 1024; // 15MB per file
    if (($file['size'] ?? 0) > $maxBytes) {
        $onError('Il file "' . $field . '" supera i 15MB consentiti.');
    }

    $allowed = [
        'application/pdf'  => 'pdf',
        'image/png'        => 'png',
        'image/jpeg'       => 'jpg',
    ];
    $finfo = new finfo(FILEINFO_MIME_TYPE);
    $mime = (string) $finfo->file($file['tmp_name']);
    if (!isset($allowed[$mime])) {
        $onError('Formato non consentito per "' . $field . '" (solo PDF, PNG, JPG).');
    }

    $dir = $dataDir . '/uploads/' . $requestId;
    if (!is_dir($dir) && !@mkdir($dir, 0750, true) && !is_dir($dir)) {
        $onError('Impossibile salvare il file "' . $field . '" sul server.');
    }
    $dest = $dir . '/' . preg_replace('/[^a-z0-9_-]/', '', strtolower($field)) . '.' . $allowed[$mime];
    if (!@move_uploaded_file($file['tmp_name'], $dest)) {
        $onError('Impossibile salvare il file "' . $field . '" sul server.');
    }
    return $dest;
}

/**
 * Aggiunge una riga a un CSV in $dataDir/$filename, scrivendo l'intestazione
 * alla prima creazione. Best-effort: un errore di scrittura finisce nei log
 * PHP ma non blocca mai la risposta (l'email resta il canale garantito).
 */
function vos_append_csv(string $dataDir, string $filename, array $headers, array $row): void {
    $path = $dataDir . '/' . $filename;
    $isNew = !file_exists($path);
    $fh = @fopen($path, 'a');
    if (!$fh) {
        error_log("vos_append_csv: impossibile aprire $filename");
        return;
    }
    if (flock($fh, LOCK_EX)) {
        if ($isNew) {
            fputcsv($fh, $headers, ',', '"', '\\');
        }
        fputcsv($fh, $row, ',', '"', '\\');
        flock($fh, LOCK_UN);
    }
    fclose($fh);
}

/**
 * Inoltra $data a un Google Apps Script Web App (doPost) configurato in
 * config.php sotto la chiave $configKey (una per modulo, ognuno può avere
 * il suo Sheet — vedi GOOGLE_SHEET_WEBAPP_URL_GIURATO/_PRODOTTO in
 * config.example.php) — se assente, non fa nulla: il Google Sheet è un
 * canale opzionale in più, il CSV locale e l'email restano garantiti a
 * prescindere. Best-effort, non blocca mai la risposta.
 */
function vos_push_google_sheet(array $config, string $configKey, array $data): void {
    $url = trim((string) ($config[$configKey] ?? ''));
    if ($url === '' || !function_exists('curl_init')) {
        return;
    }
    try {
        $ch = curl_init($url);
        curl_setopt_array($ch, [
            CURLOPT_POST           => true,
            CURLOPT_POSTFIELDS     => json_encode($data, JSON_UNESCAPED_UNICODE),
            CURLOPT_HTTPHEADER     => ['Content-Type: application/json'],
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_TIMEOUT        => 8,
            CURLOPT_FOLLOWLOCATION => true, // Apps Script Web App risponde con un redirect
            CURLOPT_SSL_VERIFYPEER => true,
        ]);
        curl_exec($ch);
        if (curl_errno($ch)) {
            error_log('vos_push_google_sheet: ' . curl_error($ch));
        }
        curl_close($ch);
    } catch (\Throwable $e) {
        error_log('vos_push_google_sheet exception: ' . $e->getMessage());
    }
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

// Generato qui (anziché nella sezione 7 originale) perché le due richieste
// con upload file (iscrizione-prodotto, richiesta-sponsor più sotto) hanno
// bisogno del requestId già pronto per nominare la cartella di salvataggio.
$requestId = vos_make_request_id();
$onFileError = function (string $message) use ($respond): void {
    $respond(false, $message);
};

$payload = [];
$subject = '';
$kind    = '';
$record  = [];
// Destinatario forzato (bypassa il routing MAIL_TO_* di config.php): usato
// solo dalle richieste per cui il destinatario è fisso per requisito
// esplicito di prodotto, non configurabile lato server. Vedi §6bis/6ter.
$forcedTo = null;
// Allegati email (path assoluti locali) per le richieste con upload file.
$attachments = [];

if ($requestType === 'iscrizione-giurato') {
    $kind = 'iscrizione-giurato';
    $forcedTo = 'napoliracingshow@gmail.com';

    $nome = vos_clean_line($_POST['nome'] ?? '');
    $cognome = vos_clean_line($_POST['cognome'] ?? '');
    $dataNascita = vos_clean_line($_POST['data_nascita'] ?? '');
    $tipoPass = vos_clean_line($_POST['tipo_pass'] ?? '');
    $metodoPagamento = strtolower(vos_clean_line($_POST['metodo_pagamento'] ?? ''));

    if ($nome === '' || $cognome === '') {
        $respond(false, 'Nome e cognome sono obbligatori.');
    }

    $nascita = DateTime::createFromFormat('Y-m-d', $dataNascita);
    if (!$nascita || $nascita->format('Y-m-d') !== $dataNascita) {
        $respond(false, 'Data di nascita non valida.');
    }
    $età = (new DateTime())->diff($nascita)->y;
    if ($età < 18) {
        $respond(false, 'Il Pass Giuria Popolare è riservato ai maggiorenni (18 anni compiuti).');
    }

    $tierValida = [
        '1 Sfida a scelta'                        => 1,
        '3 Sfide a scelta'                         => 3,
        'Pass Gran Giurato — Tutte le 9 Sfide'     => 9,
    ];
    if (!isset($tierValida[$tipoPass])) {
        $respond(false, 'Seleziona un Pass valido.');
    }
    $sfideAttese = $tierValida[$tipoPass];

    if ($sfideAttese === 9) {
        $sfideScelte = VOS_CONCORSI_VALIDI; // Gran Giurato: tutte le 9, nessuna selezione richiesta.
    } else {
        $sfideScelte = array_values(array_filter(array_map(
            'vos_clean_line',
            (array) ($_POST['sfide'] ?? [])
        )));
        $sfideScelte = array_values(array_unique($sfideScelte));
        foreach ($sfideScelte as $s) {
            if (!in_array($s, VOS_CONCORSI_VALIDI, true)) {
                $respond(false, 'Una delle Sfide selezionate non è valida.');
            }
        }
        if (count($sfideScelte) !== $sfideAttese) {
            $respond(false, "Seleziona esattamente $sfideAttese Sfid" . ($sfideAttese === 1 ? 'a' : 'e') . " per questo Pass.");
        }
    }

    // Limite 200 Giurati Popolari per Sfida (richiesta esplicita): il CSV
    // locale è la fonte di verità, stessa lettura usata da
    // pass-giurato-counts.php per disattivare la scelta in pagina. Controllo
    // server-side qui per non fidarsi solo del blocco lato client.
    $sfideCounts = vos_count_sfide_from_csv($dataDir);
    foreach ($sfideScelte as $s) {
        if (($sfideCounts[$s] ?? 0) >= VOS_LIMITE_GIURATI_PER_SFIDA) {
            $respond(false, "La Sfida \"$s\" ha raggiunto i " . VOS_LIMITE_GIURATI_PER_SFIDA . " posti disponibili. Scegline un'altra.");
        }
    }

    if (!in_array($metodoPagamento, ['bonifico', 'paypal'], true)) {
        $respond(false, 'Seleziona un metodo di pagamento.');
    }
    if ($metodoPagamento === 'bonifico') {
        $attachments[] = vos_save_upload($dataDir, $requestId, 'ricevuta_file', true, $onFileError);
        $attachments = array_values(array_filter($attachments));
    }

    // Add-on "bicchiere + portabicchiere in omaggio" (+€10, richiesta esplicita
    // 1/9/2026): esclusivo del Pass Gran Giurato — Tutte le 9 Sfide. Controllo
    // server-side (non ci si fida del solo checkbox lato client, stesso
    // principio delle altre validazioni qui sopra): un addon selezionato con
    // un Pass diverso viene silenziosamente ignorato, mai un errore che
    // blocca l'iscrizione per un dettaglio non essenziale come questo.
    $addonBicchiere = !empty($_POST['addon_bicchiere']) && $tipoPass === 'Pass Gran Giurato — Tutte le 9 Sfide';
    $prezziBase = ['1 Sfida a scelta' => 25, '3 Sfide a scelta' => 50, 'Pass Gran Giurato — Tutte le 9 Sfide' => 70];
    $totale = ($prezziBase[$tipoPass] ?? 0) + ($addonBicchiere ? 10 : 0);

    $payload = [
        'Nome e cognome'      => "$nome $cognome",
        'Email'               => $email,
        'Data di nascita'     => $dataNascita . " (età $età)",
        'Tipo di Pass'        => $tipoPass,
        'Sfide scelte'        => implode(', ', $sfideScelte),
        'Add-on bicchiere+portabicchiere (+€10)' => $addonBicchiere ? 'Sì' : 'No',
        'Totale dovuto'       => "€$totale",
        'Metodo di pagamento' => ucfirst($metodoPagamento),
        'Ricevuta allegata'   => $metodoPagamento === 'bonifico' ? (count($attachments) ? 'Sì' : 'No') : '—',
    ];
    $subject = 'Iscrizione Pass Giuria Popolare — ' . $nome . ' ' . $cognome . ' — ' . $tipoPass
             . ($addonBicchiere ? ' (+add-on bicchiere)' : '');

    // Canali extra oltre all'email (richiesta esplicita): CSV locale sempre
    // scritto (garantito, nessuna dipendenza esterna); Google Sheet in più
    // se GOOGLE_SHEET_WEBAPP_URL è configurato in config.php (altrimenti
    // no-op silenzioso). Nessuno dei due blocca l'invio se fallisce.
    $ricevutaAllegataStr = $metodoPagamento === 'bonifico' ? (count($attachments) ? 'sì' : 'no') : '—';
    vos_append_csv(
        $dataDir,
        'pass-giurato-iscrizioni.csv',
        ['request_id', 'data_ora', 'nome', 'cognome', 'email', 'data_nascita', 'eta',
            'tipo_pass', 'sfide', 'addon_bicchiere', 'totale', 'metodo_pagamento', 'ricevuta_allegata'],
        [$requestId, date('c'), $nome, $cognome, $email, $dataNascita, $età,
            $tipoPass, implode('; ', $sfideScelte), $addonBicchiere ? 'si' : 'no', $totale,
            $metodoPagamento, $ricevutaAllegataStr],
    );
    vos_push_google_sheet($config, 'GOOGLE_SHEET_WEBAPP_URL_GIURATO', [
        'requestId'       => $requestId,
        'timestamp'       => date('c'),
        'nome'            => $nome,
        'cognome'         => $cognome,
        'email'           => $email,
        'dataNascita'     => $dataNascita,
        'eta'             => $età,
        'tipoPass'        => $tipoPass,
        'sfide'           => implode('; ', $sfideScelte),
        'addonBicchiere'  => $addonBicchiere ? 'si' : 'no',
        'totale'          => $totale,
        'metodoPagamento' => $metodoPagamento,
        'ricevutaAllegata' => $ricevutaAllegataStr,
    ]);
} elseif ($requestType === 'iscrizione-prodotto') {
    $kind = 'iscrizione-prodotto';
    $forcedTo = 'napoliracingshow@gmail.com';

    $fields = [
        'ragione_sociale'        => 'Ragione sociale',
        'piva'                   => 'Partita IVA / Codice Fiscale',
        'indirizzo'              => 'Sede legale',
        'cap'                    => 'CAP',
        'citta'                  => 'Città',
        'provincia'              => 'Provincia',
        'email_azienda'          => 'Email aziendale',
        'telefono_azienda'       => 'Telefono azienda',
        'referente_nome'         => 'Referente — Nome e cognome',
        'referente_cellulare'    => 'Referente — Cellulare',
        'concorso'               => 'Concorso scelto',
        'prodotto_nome'          => 'Nome del prodotto',
        'prodotto_tipologia'     => 'Tipologia / Categoria',
        'territorio_produzione'  => 'Territorio di produzione',
        'descrizione_prodotto'   => 'Descrizione del prodotto',
        'presentatore_nome'      => 'Nome di chi presenta il prodotto',
        'legale_rappresentante'  => 'Legale rappresentante',
        'luogo_data'             => 'Luogo e data',
    ];
    $values = [];
    foreach ($fields as $key => $label) {
        $isMultiline = $key === 'descrizione_prodotto';
        $value = $isMultiline
            ? vos_clean_multiline($_POST[$key] ?? '', 3000)
            : vos_clean_line($_POST[$key] ?? '');
        if ($value === '') {
            $respond(false, "Campo obbligatorio mancante: $label.");
        }
        $values[$key] = $value;
    }

    if (!filter_var($values['email_azienda'], FILTER_VALIDATE_EMAIL)) {
        $respond(false, 'Inserisci un indirizzo email aziendale valido.');
    }

    if (!in_array($values['concorso'], VOS_CONCORSI_VALIDI, true)) {
        $respond(false, 'Seleziona un Concorso valido tra i 9 disponibili.');
    }

    for ($i = 1; $i <= 7; $i++) {
        if (empty($_POST["dich_$i"])) {
            $respond(false, 'Devi accettare tutte le dichiarazioni dell\'azienda (sezione 8).');
        }
    }

    $optional = [
        'nome_commerciale'   => 'Nome commerciale / Brand',
        'sito_web'           => 'Sito web',
        'pec'                => 'PEC',
        'referente_ruolo'    => 'Referente — Ruolo',
        'denominazione'      => 'Denominazione / Indicazione geografica',
        'annata'             => 'Annata',
        'gradazione'         => 'Gradazione alcolica',
        'formato'            => 'Formato confezione',
        'presentatore_ruolo' => 'Ruolo di chi presenta il prodotto',
    ];
    foreach ($optional as $key => $label) {
        $v = vos_clean_line($_POST[$key] ?? '');
        if ($v !== '') {
            $values[$key] = $v;
        }
    }
    $storia = vos_clean_multiline($_POST['storia_azienda'] ?? '', 3000);

    $attachments[] = vos_save_upload($dataDir, $requestId, 'logo_file', true, $onFileError);
    $attachments[] = vos_save_upload($dataDir, $requestId, 'foto_prodotto_file', true, $onFileError);
    $attachments[] = vos_save_upload($dataDir, $requestId, 'brochure_file', false, $onFileError);
    $attachments[] = vos_save_upload($dataDir, $requestId, 'ricevuta_file', true, $onFileError);
    $attachments = array_values(array_filter($attachments));

    $payload = [
        '— AZIENDA —'          => '',
        'Ragione sociale'      => $values['ragione_sociale'],
        'Nome commerciale'     => $values['nome_commerciale'] ?? '—',
        'P.IVA/CF'             => $values['piva'],
        'Sede legale'          => $values['indirizzo'] . ', ' . $values['cap'] . ' ' . $values['citta'] . ' (' . $values['provincia'] . ')',
        'Sito web'             => $values['sito_web'] ?? '—',
        'Email azienda'        => $values['email_azienda'],
        'PEC'                  => $values['pec'] ?? '—',
        'Telefono azienda'     => $values['telefono_azienda'],
        '— REFERENTE —'        => '',
        'Nome referente'       => $values['referente_nome'],
        'Ruolo referente'      => $values['referente_ruolo'] ?? '—',
        'Cellulare referente'  => $values['referente_cellulare'],
        'Email referente'      => $email,
        '— CONCORSO —'         => '',
        'Sfida scelta'         => $values['concorso'],
        '— PRODOTTO —'         => '',
        'Nome prodotto'        => $values['prodotto_nome'],
        'Tipologia'            => $values['prodotto_tipologia'],
        'Denominazione'        => $values['denominazione'] ?? '—',
        'Annata'               => $values['annata'] ?? '—',
        'Gradazione alcolica'  => $values['gradazione'] ?? '—',
        'Formato confezione'   => $values['formato'] ?? '—',
        'Territorio produzione'=> $values['territorio_produzione'],
        'Descrizione prodotto' => $values['descrizione_prodotto'],
        '— PRESENTAZIONE —'    => '',
        'Storia azienda'       => $storia !== '' ? $storia : '—',
        'Chi presenta'         => $values['presentatore_nome'] . ($values['presentatore_ruolo'] ?? '' ? ' (' . $values['presentatore_ruolo'] . ')' : ''),
        '— DICHIARAZIONI —'    => '',
        'Dichiarazioni azienda (1-7)' => 'Tutte accettate',
        'Legale rappresentante'       => $values['legale_rappresentante'],
        'Luogo e data'                => $values['luogo_data'],
        'Allegati'             => count($attachments) . ' file (vedi allegati email)',
    ];
    $subject = 'Iscrizione Prodotto — Gran Premio del Gusto 2026 — ' . $values['ragione_sociale'];

    // Stessi due canali extra del Pass Giurato (CSV sempre, Sheet se
    // configurato) — vedi vos_append_csv/vos_push_google_sheet più sopra.
    $csvHeaders = [
        'request_id', 'data_ora', 'ragione_sociale', 'nome_commerciale', 'piva',
        'indirizzo', 'cap', 'citta', 'provincia', 'sito_web', 'email_azienda', 'pec',
        'telefono_azienda', 'referente_nome', 'referente_ruolo', 'referente_cellulare',
        'referente_email', 'concorso', 'prodotto_nome', 'prodotto_tipologia',
        'denominazione', 'annata', 'gradazione', 'formato', 'territorio_produzione',
        'presentatore_nome', 'presentatore_ruolo', 'legale_rappresentante', 'luogo_data',
        'n_allegati',
    ];
    $csvRow = [
        $requestId, date('c'), $values['ragione_sociale'], $values['nome_commerciale'] ?? '',
        $values['piva'], $values['indirizzo'], $values['cap'], $values['citta'],
        $values['provincia'], $values['sito_web'] ?? '', $values['email_azienda'],
        $values['pec'] ?? '', $values['telefono_azienda'], $values['referente_nome'],
        $values['referente_ruolo'] ?? '', $values['referente_cellulare'], $email,
        $values['concorso'], $values['prodotto_nome'], $values['prodotto_tipologia'],
        $values['denominazione'] ?? '', $values['annata'] ?? '', $values['gradazione'] ?? '',
        $values['formato'] ?? '', $values['territorio_produzione'], $values['presentatore_nome'],
        $values['presentatore_ruolo'] ?? '', $values['legale_rappresentante'], $values['luogo_data'],
        count($attachments),
    ];
    vos_append_csv($dataDir, 'iscrizioni-prodotto.csv', $csvHeaders, $csvRow);
    vos_push_google_sheet($config, 'GOOGLE_SHEET_WEBAPP_URL_PRODOTTO', array_combine(
        ['requestId', 'timestamp', ...array_slice($csvHeaders, 2)],
        [$requestId, date('c'), ...array_slice($csvRow, 2)],
    ));
} elseif ($requestType === 'richiesta-sponsor') {
    $kind = 'richiesta-sponsor';
    $forcedTo = 'napoliracingshow@gmail.com';

    $nome = vos_clean_line($_POST['nome'] ?? '');
    $telefono = vos_clean_line($_POST['telefono'] ?? '');
    $messaggio = vos_clean_multiline($_POST['messaggio'] ?? '', 2000);
    if ($nome === '') {
        $respond(false, 'Il nome è obbligatorio.');
    }
    if ($messaggio === '') {
        $respond(false, 'Il messaggio è obbligatorio.');
    }
    $payload = [
        'Nome'      => $nome,
        'Email'     => $email,
        'Telefono'  => $telefono !== '' ? $telefono : '—',
        'Messaggio' => $messaggio,
    ];
    $subject = 'Richiesta Sponsorizzazione — Vini & OliSud — ' . $nome;
} elseif ($requestType === 'carnet-degustazione' || $audience === 'visitatori') {
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

// $requestId generato più in alto (serve già alla sezione 6 per gli upload).
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

// iscrizione-prodotto / richiesta-sponsor non hanno colonne dedicate nello
// schema vos_form_leads (campi troppo specifici/con allegati): per questi
// due tipi l'email è il canale primario (vedi sezione 8, invio bloccante),
// niente insert DB.
$dbBacked = !in_array($kind, ['iscrizione-prodotto', 'richiesta-sponsor', 'iscrizione-giurato'], true);

if ($dbBacked) {
    try {
        vos_db_insert($config, $record);
    } catch (\Throwable $e) {
        // Il salvataggio è la garanzia primaria: se fallisce, fermiamo qui.
        error_log('lead.php DB error: ' . $e->getMessage());
        vos_log_request($dataDir, $requestId, $kind, false);
        http_response_code(500);
        $respond(false, 'Salvataggio non riuscito. Riprova più tardi o scrivi a info@vinisud.it.');
    }
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
    if (!$dbBacked) {
        // Niente DB per questi tipi: l'email è l'unica prova della richiesta.
        // Senza PHPMailer non c'è nulla da salvare, quindi è un fallimento vero.
        error_log('lead.php: PHPMailer non trovato (richiesta ' . $requestId . ' NON salvata: nessun DB per ' . $kind . ').');
        vos_log_request($dataDir, $requestId, $kind, false);
        http_response_code(500);
        $respond(false, 'Invio non riuscito. Scrivi direttamente a napoliracingshow@gmail.com.');
    }
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
    // $forcedTo bypassa il routing MAIL_TO_* di config.php per le richieste
    // con destinatario fisso di prodotto (vedi sezione 6).
    $mailer->addAddress($forcedTo ?? $to);
    $mailer->addReplyTo($email);

    // Copia conoscenza nascosta su tutte le notifiche (se configurata e valida).
    $mailBcc = trim((string)($config['MAIL_BCC'] ?? ''));
    if ($mailBcc !== '' && filter_var($mailBcc, FILTER_VALIDATE_EMAIL)) {
        $mailer->addBCC($mailBcc);
    }

    $mailer->Subject = $subject;
    $mailer->isHTML(false);
    $mailer->Body    = $body;

    foreach ($attachments as $attachmentPath) {
        if (is_string($attachmentPath) && is_readable($attachmentPath)) {
            $mailer->addAttachment($attachmentPath);
        }
    }

    $mailer->send();
    vos_log_request($dataDir, $requestId, $kind, true);
} catch (\Throwable $e) {
    if (!$dbBacked) {
        // Niente DB per questi tipi: se l'email non parte, la richiesta è persa.
        error_log('lead.php SMTP error (richiesta ' . $requestId . ' NON salvata, nessun DB per ' . $kind . '): ' . $e->getMessage());
        vos_log_request($dataDir, $requestId, $kind, false);
        http_response_code(500);
        $respond(false, 'Invio non riuscito. Scrivi direttamente a napoliracingshow@gmail.com.');
    }
    // Il lead è salvato su DB: la notifica email è secondaria. Logghiamo e
    // proseguiamo, così l'utente non riprova un invio già andato a buon fine.
    error_log('lead.php SMTP error notifica (lead ' . $requestId . ' salvato su DB): ' . $e->getMessage());
    vos_log_request($dataDir, $requestId, $kind, true);
}

// --- 8b. Email di conferma all'utente (best-effort, non blocca la risposta) ---
// Testo e oggetto sono ad hoc per tipo di candidatura (richiesta esplicita):
// per iscrizione-giurato/iscrizione-prodotto il $requestId è presentato come
// "codice" da conservare e mostrare alla Segreteria Organizzativa — è lo
// stesso identificativo che compare nella notifica interna (sezione 8a),
// quindi segreteria e utente parlano sempre dello stesso codice.
if (!empty($config['SEND_USER_CONFIRMATION'])) {
    try {
        $confSubject = $config['CONFIRM_SUBJECT'] ?? 'Abbiamo ricevuto la tua richiesta — Vini Oli Sud';
        $confLines = [];

        if ($kind === 'iscrizione-giurato') {
            $confSubject = "Iscrizione Pass Giuria Popolare ricevuta — Codice $requestId";
            $confLines[] = 'Ciao,';
            $confLines[] = '';
            $confLines[] = 'grazie per la tua iscrizione come Giurato Popolare al Gran Premio del '
                         . 'Gusto 2026.';
            $confLines[] = '';
            $confLines[] = "IL TUO CODICE ISCRIZIONE: $requestId";
            $confLines[] = '';
            if ($addonBicchiere) {
                $confLines[] = 'Hai incluso l\'extra bicchiere + portabicchiere ufficiali in omaggio (+€10) — '
                             . "totale dovuto: €$totale.";
                $confLines[] = '';
            }
            $confLines[] = 'Conserva questo codice (basta mostrare questa email dal telefono): '
                         . 'dovrai presentarlo allo stand della Segreteria Organizzativa per il '
                         . 'ritiro del kit giurato, disponibile dalle ore 9.00 alle 20.00 di '
                         . 'venerdì 27, sabato 28 e domenica 29 novembre 2026.';
            $confLines[] = '';
            $confLines[] = 'La Segreteria Organizzativa verificherà il pagamento e ti confermerà '
                         . 'definitivamente la partecipazione.';
            $confLines[] = '';
            $confLines[] = 'Il Pass Giurato è personale, non cedibile né sostituibile: va '
                         . 'conservato dal titolare per tutta la durata della manifestazione.';
        } elseif ($kind === 'iscrizione-prodotto') {
            $confSubject = "Iscrizione Prodotto ricevuta — Codice $requestId — Gran Premio del Gusto 2026";
            $confLines[] = 'Ciao,';
            $confLines[] = '';
            $confLines[] = 'grazie per aver iscritto il tuo prodotto a una Sfida del Gran Premio '
                         . 'del Gusto 2026.';
            $confLines[] = '';
            $confLines[] = "IL TUO CODICE ISCRIZIONE: $requestId";
            $confLines[] = '';
            $confLines[] = 'Conserva questo codice: usalo in ogni comunicazione con la Segreteria '
                         . 'Organizzativa relativa a questa iscrizione.';
            $confLines[] = '';
            $confLines[] = "L'invio del modulo non garantisce automaticamente l'ammissione al "
                         . 'Concorso. La Segreteria Organizzativa verificherà la disponibilità dei '
                         . 'posti nella Sfida prescelta, la completezza della documentazione e '
                         . "l'avvenuto pagamento. A iscrizione accettata, riceverai una conferma "
                         . 'ufficiale dalla Segreteria Organizzativa.';
        } else {
            $kindLabel = [
                'manifestazione-interesse' => 'manifestazione di interesse',
                'carnet-degustazione'      => 'richiesta Carnet Degustazione',
                'segnalazione-editoriale'  => 'segnalazione per il Diario del Sud',
                'richiesta-sponsor'        => 'richiesta di sponsorizzazione',
            ][$kind] ?? 'richiesta';
            $confLines[] = 'Ciao,';
            $confLines[] = '';
            $confLines[] = 'grazie per averci scritto. Abbiamo ricevuto la tua ' . $kindLabel . '.';
            $confLines[] = 'Ti risponderemo al più presto.';
            $confLines[] = '';
            $confLines[] = 'Riferimento richiesta: ' . $requestId;
        }

        $confLines[] = '';
        $confLines[] = 'Questo è un messaggio automatico di conferma: non occorre rispondere.';
        $confLines[] = '';
        $confLines[] = '— A.S.D. Napoli Racing Show';

        $confMailer = $makeMailer();
        $confFrom     = $config['CONFIRM_FROM'] ?? ($config['MAIL_FROM'] ?? 'info@vinisud.it');
        $confFromName = $config['CONFIRM_FROM_NAME'] ?? ($config['MAIL_FROM_NAME'] ?? 'Vini Oli Sud');
        $confMailer->setFrom($confFrom, $confFromName);
        $confMailer->addAddress($email);
        // Se l'utente risponde, la mail arriva alla segreteria, non al noreply.
        $confMailer->addReplyTo($config['MAIL_TO_INFO'] ?? $confFrom, $confFromName);
        $confMailer->Subject = $confSubject;
        $confMailer->isHTML(false);
        $confMailer->Body    = implode("\n", $confLines);
        $confMailer->send();
    } catch (\Throwable $e) {
        // La conferma all'utente è un di più: se fallisce, lo logghiamo soltanto.
        error_log('lead.php SMTP error conferma utente (lead ' . $requestId . '): ' . $e->getMessage());
    }
}

$respond(true, null, $requestId);
