<?php
// DEBUG TEMPORANEO — riparazione una tantum, da cancellare subito dopo l'uso.
// Sostituisce SOLO la prima riga (header) del CSV pass-giurato-iscrizioni.csv
// con lo schema reale scritto da lead.php (14 colonne) — l'header fisico
// era rimasto fermo a una versione vecchia da 11 colonne, mai riscritto
// perché vos_append_csv scrive l'header solo alla creazione del file.
// Non tocca nessuna riga dati, nessun contenuto oltre alla riga 1.
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');

$path = __DIR__ . '/data/pass-giurato-iscrizioni.csv';
if (!is_readable($path) || !is_writable($path)) {
    echo json_encode(['ok' => false, 'error' => 'file non leggibile/scrivibile']);
    exit;
}

$correctHeader = ['request_id', 'data_ora', 'nome', 'cognome', 'email', 'data_nascita', 'eta',
    'tipo_pass', 'addon_bicchiere', 'importo_atteso', 'sfide', 'metodo_pagamento',
    'ricevuta_allegata', 'stato_pagamento'];

$lines = file($path, FILE_IGNORE_NEW_LINES);
if ($lines === false || count($lines) < 1) {
    echo json_encode(['ok' => false, 'error' => 'file vuoto o illeggibile']);
    exit;
}

$oldHeaderLine = $lines[0];

// Backup prima di toccare qualunque cosa.
copy($path, $path . '.bak-header-fix-' . date('Ymd-His'));

$fh = fopen('php://temp', 'r+');
fputcsv($fh, $correctHeader, ',', '"', '\\');
rewind($fh);
$newHeaderLine = rtrim((string) stream_get_contents($fh), "\r\n");
fclose($fh);

$lines[0] = $newHeaderLine;
file_put_contents($path, implode("\n", $lines) . "\n");

echo json_encode([
    'ok' => true,
    'old_header' => $oldHeaderLine,
    'new_header' => $newHeaderLine,
    'total_lines' => count($lines),
], JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES);
