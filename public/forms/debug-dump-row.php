<?php
// DEBUG TEMPORANEO — da cancellare subito dopo l'uso.
declare(strict_types=1);
header('Content-Type: application/json; charset=utf-8');
$path = __DIR__ . '/data/pass-giurato-iscrizioni.csv';
$fh = fopen($path, 'r');
$header = fgetcsv($fh, 0, ',', '"', '\\');
$out = ['header' => $header, 'header_count' => count($header), 'rows' => []];
while (($row = fgetcsv($fh, 0, ',', '"', '\\')) !== false) {
    $idIdx = array_search('request_id', $header, true);
    if (($row[$idIdx] ?? null) === ($_GET['id'] ?? 'a5c79aed6b16')) {
        $out['rows'][] = ['count' => count($row), 'raw' => $row];
    }
}
fclose($fh);
echo json_encode($out, JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT);
