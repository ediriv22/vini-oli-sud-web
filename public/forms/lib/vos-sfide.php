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
