<?php

declare(strict_types=1);

/**
 * Vini Oli Sud — pass-giurato-counts.php
 *
 * Endpoint pubblico di sola lettura: quante iscrizioni Pass Giurato esistono
 * già per ciascuna delle 9 Sfide, per disattivare in pagina (/pass-giurato/)
 * la selezione di una Sfida che ha già raggiunto i 200 posti. Nessun dato
 * personale esposto: solo nome Sfida + conteggio.
 */

header('Content-Type: application/json; charset=utf-8');
header('Cache-Control: no-store');

require __DIR__ . '/lib/vos-sfide.php';

$dataDir = __DIR__ . '/data';
$counts = vos_count_sfide_from_csv($dataDir);

echo json_encode([
    'limit'  => VOS_LIMITE_GIURATI_PER_SFIDA,
    'counts' => $counts,
], JSON_UNESCAPED_UNICODE);
