<?php

declare(strict_types=1);

/**
 * Le 9 Sfide del Gran Premio del Gusto — lista canonica condivisa da
 * lead.php e pass-giurato-counts.php. Deve restare identica ai nomi in
 * content/settings/home-sections.json (sfideAccordion.items[iscrivi].concorsi).
 */
const VOS_CONCORSI_VALIDI = [
    'Birra & Street Food', 'Vino & Pizza', 'Vino & Pesce', 'Vino & Carne',
    'Vino & Pasta', 'Vino & Sigaro', 'Il Miglior Olio Extravergine',
    'Il Miglior Amaro', 'Il Miglior Liquore per il Miglior Dolce',
];

/**
 * Limite di Giurati Popolari per ciascuna Sfida (richiesta esplicita).
 */
const VOS_LIMITE_GIURATI_PER_SFIDA = 200;

/**
 * Conta quante iscrizioni Pass Giurato esistono per ciascuna delle 9 Sfide,
 * leggendo il CSV locale (fonte di verità unica per il limite posti — lo
 * stesso file scritto da lead.php, vedi vos_append_csv). File assente,
 * illeggibile o senza colonna "sfide": ritorna tutti i conteggi a 0 invece
 * di bloccare — il limite è una protezione in più, non deve mai impedire
 * l'uso del modulo per un problema di lettura file.
 */
function vos_count_sfide_from_csv(string $dataDir): array {
    $counts = array_fill_keys(VOS_CONCORSI_VALIDI, 0);
    $path = $dataDir . '/pass-giurato-iscrizioni.csv';
    if (!is_readable($path)) {
        return $counts;
    }
    $fh = @fopen($path, 'r');
    if (!$fh) {
        return $counts;
    }
    $header = fgetcsv($fh, 0, ',', '"', '\\');
    if (!is_array($header)) {
        fclose($fh);
        return $counts;
    }
    $sfideIndex = array_search('sfide', $header, true);
    if ($sfideIndex === false) {
        fclose($fh);
        return $counts;
    }
    while (($row = fgetcsv($fh, 0, ',', '"', '\\')) !== false) {
        $sfideValue = (string) ($row[$sfideIndex] ?? '');
        foreach (explode('; ', $sfideValue) as $sfida) {
            $sfida = trim($sfida);
            if ($sfida !== '' && isset($counts[$sfida])) {
                $counts[$sfida]++;
            }
        }
    }
    fclose($fh);
    return $counts;
}

/**
 * Inoltra $data a un Google Apps Script Web App (doPost) configurato in
 * config.php sotto la chiave $configKey (una per modulo, ognuno può avere
 * il suo Sheet — vedi GOOGLE_SHEET_WEBAPP_URL_GIURATO/_PRODOTTO in
 * config.example.php) — se assente, non fa nulla: il Google Sheet è un
 * canale opzionale in più, il CSV locale e l'email restano garantiti a
 * prescindere. Best-effort, non blocca mai la risposta. Condivisa da
 * lead.php (append iscrizione) e paypal-confirm.php (update stato
 * pagamento dopo verifica) — vedi campo "azione" nei dati passati da
 * ciascun chiamante per distinguerli lato Apps Script.
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

/**
 * Legge dal CSV la riga corrispondente a $requestId (chiave 'request_id'),
 * come array associativo header=>valore. Null se il file non esiste, non è
 * leggibile o non c'è nessuna riga con quel request_id.
 */
function vos_read_csv_row(string $dataDir, string $filename, string $requestId): ?array {
    $path = $dataDir . '/' . $filename;
    if (!is_readable($path)) {
        return null;
    }
    $fh = @fopen($path, 'r');
    if (!$fh) {
        return null;
    }
    $header = fgetcsv($fh, 0, ',', '"', '\\');
    if (!is_array($header)) {
        fclose($fh);
        return null;
    }
    $idIndex = array_search('request_id', $header, true);
    if ($idIndex === false) {
        fclose($fh);
        return null;
    }
    $found = null;
    while (($row = fgetcsv($fh, 0, ',', '"', '\\')) !== false) {
        if (($row[$idIndex] ?? null) === $requestId) {
            $found = array_combine($header, array_pad($row, count($header), ''));
            break;
        }
    }
    fclose($fh);
    return $found;
}

/**
 * Aggiorna, per la riga con quel request_id, le sole colonne passate in
 * $updates (header=>nuovo valore) e riscrive l'intero CSV con un file
 * temporaneo + rename atomico (evita file troncati/corrotti in caso di
 * scrittura concorrente). Ritorna true se una riga è stata trovata e
 * aggiornata, false altrimenti (file assente o request_id non trovato).
 */
function vos_update_csv_row(string $dataDir, string $filename, string $requestId, array $updates): bool {
    $path = $dataDir . '/' . $filename;
    if (!is_readable($path)) {
        return false;
    }
    $fh = @fopen($path, 'r');
    if (!$fh) {
        return false;
    }
    if (!flock($fh, LOCK_SH)) {
        fclose($fh);
        return false;
    }
    $header = fgetcsv($fh, 0, ',', '"', '\\');
    if (!is_array($header)) {
        fclose($fh);
        return false;
    }
    $idIndex = array_search('request_id', $header, true);
    $rows = [];
    $updated = false;
    if ($idIndex !== false) {
        while (($row = fgetcsv($fh, 0, ',', '"', '\\')) !== false) {
            if (($row[$idIndex] ?? null) === $requestId) {
                $assoc = array_combine($header, array_pad($row, count($header), ''));
                foreach ($updates as $col => $val) {
                    if (array_key_exists($col, $assoc)) {
                        $assoc[$col] = $val;
                    }
                }
                $row = array_values($assoc);
                $updated = true;
            }
            $rows[] = $row;
        }
    }
    flock($fh, LOCK_UN);
    fclose($fh);

    if (!$updated) {
        return false;
    }

    $tmpPath = $path . '.tmp' . bin2hex(random_bytes(4));
    $tmpFh = @fopen($tmpPath, 'w');
    if (!$tmpFh) {
        return false;
    }
    if (flock($tmpFh, LOCK_EX)) {
        fputcsv($tmpFh, $header, ',', '"', '\\');
        foreach ($rows as $row) {
            fputcsv($tmpFh, $row, ',', '"', '\\');
        }
        flock($tmpFh, LOCK_UN);
    }
    fclose($tmpFh);
    return @rename($tmpPath, $path);
}

/**
 * Invia la mail di conferma "Pass Giuria Popolare" all'utente, stesso testo
 * usato in lead.php §8b per il bonifico — ma chiamata da paypal-confirm.php
 * DOPO che il pagamento è stato verificato reale su PayPal Orders API.
 * Best-effort: un errore SMTP finisce nei log ma non deve mai far fallire
 * la risposta al browser (il pagamento è comunque già confermato e
 * registrato — la mail è una notifica in più, non la prova del pagamento).
 */
function vos_send_giurato_confirmation(array $config, string $email, string $requestId): void {
    $phpmailerPaths = [
        __DIR__ . '/../PHPMailer/src/PHPMailer.php',
        __DIR__ . '/../vendor/phpmailer/phpmailer/src/PHPMailer.php',
    ];
    $loaded = false;
    foreach ($phpmailerPaths as $p) {
        if (is_readable($p)) {
            $base = dirname($p);
            require_once $base . '/Exception.php';
            require_once $base . '/PHPMailer.php';
            require_once $base . '/SMTP.php';
            $loaded = true;
            break;
        }
    }
    if (!$loaded) {
        error_log('vos_send_giurato_confirmation: PHPMailer non trovato (lead ' . $requestId . ').');
        return;
    }

    try {
        $mailer = new \PHPMailer\PHPMailer\PHPMailer(true);
        $mailer->isSMTP();
        $mailer->Host       = $config['SMTP_HOST'] ?? 'smtps.aruba.it';
        $mailer->SMTPAuth   = true;
        $mailer->Username   = $config['SMTP_USER'] ?? '';
        $mailer->Password   = $config['SMTP_PASS'] ?? '';
        $mailer->Port       = (int)($config['SMTP_PORT'] ?? 465);
        $secure = strtolower((string)($config['SMTP_SECURE'] ?? 'ssl'));
        $mailer->SMTPSecure = $secure === 'tls'
            ? \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_STARTTLS
            : \PHPMailer\PHPMailer\PHPMailer::ENCRYPTION_SMTPS;
        $mailer->CharSet = 'UTF-8';
        $mailer->Timeout = 15;

        $confFrom     = $config['CONFIRM_FROM'] ?? ($config['MAIL_FROM'] ?? 'info@vinisud.it');
        $confFromName = $config['CONFIRM_FROM_NAME'] ?? ($config['MAIL_FROM_NAME'] ?? 'Vini Oli Sud');
        $mailer->setFrom($confFrom, $confFromName);
        $mailer->addAddress($email);
        $mailer->addReplyTo($config['MAIL_TO_INFO'] ?? $confFrom, $confFromName);
        $mailer->Subject = "Pagamento confermato — Pass Giuria Popolare — Codice $requestId";
        $mailer->isHTML(false);
        $mailer->Body = implode("\n", [
            'Ciao,',
            '',
            'il tuo pagamento PayPal per il Pass Giuria Popolare al Gran Premio del Gusto 2026 '
                . 'è stato ricevuto e confermato.',
            '',
            "IL TUO CODICE ISCRIZIONE: $requestId",
            '',
            'Conserva questo codice (basta mostrare questa email dal telefono): dovrai presentarlo '
                . 'allo stand della Segreteria Organizzativa per il ritiro del kit giurato, disponibile '
                . 'dalle ore 9.00 alle 20.00 di venerdì 27, sabato 28 e domenica 29 novembre 2026.',
            '',
            'Il Pass Giurato è personale, non cedibile né sostituibile: va conservato dal titolare '
                . 'per tutta la durata della manifestazione.',
            '',
            'Questo è un messaggio automatico di conferma: non occorre rispondere.',
            '',
            '— A.S.D. Napoli Racing Show',
        ]);
        $mailer->send();
    } catch (\Throwable $e) {
        error_log('vos_send_giurato_confirmation SMTP error (lead ' . $requestId . '): ' . $e->getMessage());
    }
}
