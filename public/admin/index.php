<?php
/**
 * Vini Oli Sud — Pannello segreteria (/admin)
 *
 * Login a password. Editor dei testi del sito: modifica content/settings/site.json
 * (generale + home) e content/pages.json (tutte le pagine). Salva su GitHub via
 * API → il commit fa partire la pubblicazione automatica su Aruba.
 *
 * Mostra solo TESTI: le chiavi strutturali (link, slug, icone, tipo blocco)
 * sono protette e mai modificabili dalla segretaria.
 *
 * Credenziali in config.php (fuori dal repo, escluso dal deploy).
 */

declare(strict_types=1);
session_start();

$configPath = __DIR__ . '/config.php';
if (!is_readable($configPath)) {
    http_response_code(500);
    exit('Pannello non configurato: manca config.php sul server.');
}
$cfg = require $configPath;

$REPO   = $cfg['GITHUB_REPO']   ?? '';
$BRANCH = $cfg['GITHUB_BRANCH'] ?? 'main';
$TOKEN  = $cfg['GITHUB_TOKEN']  ?? '';
$PASS   = $cfg['ADMIN_PASSWORD'] ?? '';

// Aree modificabili: chiave => [etichetta, file, sottochiave|null]
//
// NOTA: dal rebranding del 28/07/2026 il sito è una single-page (le vecchie
// pagine interne evento/espositori/buyer/visitatori/grand-prix/diario-del-
// sud/media/contatti sono state rimosse, sostituite da ancore nella home).
// Le vecchie aree "page:*" che scrivevano su content/pages.json sono state
// rimosse qui perché quel file non è più letto da nessun componente del
// sito: salvare lì non aveva più alcun effetto sul sito pubblicato.
// I testi delle sezioni home (filosofia, Grand Prix, territorio, regioni,
// sponsor, evento, albo d'oro) sono ora nell'area "home-sections" qui sotto.
$AREAS = [
    'site'          => ['Generale & Home',  'content/settings/site.json', null],
    'home-layout'   => ['Ordine e visibilità delle sezioni Home', 'content/settings/home-layout.json', null],
    'home-sections' => ['Sezioni Home (Filosofia, Grand Prix, Territorio, Regioni, Sponsor, Evento, Albo d\'Oro)', 'content/settings/home-sections.json', null],
];

// Sezioni della home in ordine canonico di default: nome tecnico (chiave in
// home-sections.json / home-layout.json) => nome leggibile per la segretaria.
// L'ordine di questo array è anche l'ordine di fallback usato se il file
// content/settings/home-layout.json non esiste ancora. Deve restare allineato
// alla registry e a CANONICAL_SECTION_ORDER in src/data/homeLayout.ts.
$SECTION_NAMES = [
    'hero'                  => 'Copertina (Hero)',
    'philosophy'            => 'Filosofia',
    'grandPrixHighlight'    => 'Grand Prix',
    'territory'             => 'Territorio',
    'regions'               => 'Regioni',
    'sponsor'               => 'Sponsor & Espositori',
    'eventDetails'          => 'Dettagli dell\'Evento',
    'institutionalPartners' => 'Partner Istituzionali',
    'alboDoro'              => 'Albo d\'Oro',
];

// URL del sito pubblicato (per l'anteprima in iframe nel pannello).
$PUBLIC_SITE_URL = 'https://www.vinisud.it/';

// Chiavi strutturali: mai mostrate né modificabili (preservate al salvataggio).
$BLOCKLIST = ['ctaHref', 'href', 'url', 'icon', 'kind', 'slug', 'id', 'logo'];

// Etichette italiane per i campi.
$LABELS = [
    'siteName' => 'Nome del sito', 'siteDescription' => 'Descrizione del sito (SEO)',
    'contactEmail' => 'Email di contatto',
    'eyebrow' => 'Occhiello', 'title' => 'Titolo', 'description' => 'Descrizione',
    'ctaLabel' => 'Etichetta pulsante', 'ctaNote' => 'Nota sotto il pulsante',
    'summary' => 'Riassunto', 'focusTitle' => 'Titolo sezione focus', 'focusIntro' => 'Introduzione sezione focus',
    'pillars' => 'Pilastri', 'sections' => 'Sezioni', 'verifyNotes' => 'Note di verifica',
    'richSections' => 'Sezioni estese', 'metadataDescription' => 'Descrizione SEO della pagina',
    'externalReference' => 'Riferimento esterno', 'intro' => 'Introduzione',
    'blocks' => 'Blocchi', 'items' => 'Voci', 'lines' => 'Righe', 'text' => 'Testo', 'label' => 'Etichetta',
    // Sezioni Home (content/settings/home-sections.json)
    'paragraph' => 'Paragrafo', 'paragraphs' => 'Paragrafi', 'name' => 'Nome', 'body' => 'Testo',
    'titlePrefix' => 'Titolo — inizio', 'titleEmphasis' => 'Titolo — parola in evidenza', 'titleSuffix' => 'Titolo — fine',
    'featuredAwards' => 'Premi in evidenza', 'expandLabel' => 'Etichetta "espandi"', 'collapseLabel' => 'Etichetta "comprimi"',
    'dates' => 'Date', 'admission' => 'Ingresso', 'venueName' => 'Luogo — nome', 'venueDescription' => 'Luogo — descrizione',
    'collaboration' => 'Collaborazione', 'externalLink' => 'Link esterno', 'programDownload' => 'Download programma',
    'organizzazioneLabel' => 'Etichetta gruppo "organizzazione"', 'supervisionLabel' => 'Etichetta gruppo "supervisione"', 'partnerLabel' => 'Etichetta gruppo "partner"',
    'organizzazione' => 'Enti — organizzazione', 'supervision' => 'Enti — supervisione', 'partners' => 'Enti — partner istituzionale',
    'registrationsNote' => 'Nota iscrizioni concorso (data)', 'registrationsDetail' => 'Nota iscrizioni concorso (dettaglio)',
    'villageAccessNote' => 'Nota accesso villaggio', 'pass' => 'Pass Giuria Popolare',
    'availabilityNote' => 'Nota disponibilità (data)', 'benefits' => 'Cosa include',
    'themePrimaryColor' => 'Colore primario (bottoni e accenti)',
    'themeBackgroundColor' => 'Colore di sfondo generale del sito',
    'backgroundColor' => 'Colore di sfondo di questa pagina',
    'backgroundImage' => 'Immagine di sfondo di questa pagina (sostituisce il colore)',
    'heroBackgroundImage' => 'Home — immagine di sfondo',
    'heroOverlayOpacity' => 'Home — intensità ombreggiatura sull’immagine',
    'fontPreset' => 'Stile carattere del sito',
    'faviconImage' => 'Icona del sito (favicon)',
    'editionBackgroundColor' => 'Home — Edizione: colore di sfondo',
    'editionBackgroundImage' => 'Home — Edizione: immagine di sfondo',
    'audienceBackgroundColor' => 'Home — Percorsi: colore di sfondo',
    'audienceBackgroundImage' => 'Home — Percorsi: immagine di sfondo',
    'conceptBackgroundColor' => 'Home — Profezia Liquida: colore di sfondo',
    'conceptBackgroundImage' => 'Home — Profezia Liquida: immagine di sfondo',
    'grandPrixBackgroundColor' => 'Home — Grand Prix: colore di sfondo',
    'grandPrixBackgroundImage' => 'Home — Grand Prix: immagine di sfondo',
    'ctaBackgroundColor' => 'Home — CTA finale: colore di sfondo',
    'ctaBackgroundImage' => 'Home — CTA finale: immagine di sfondo',
];

// Campi a scelta multipla (dropdown): chiave => [valore => etichetta].
$SELECT_FIELDS = [
    'fontPreset' => [
        'classico'   => 'Classico (Cormorant + Montserrat)',
        'editoriale' => 'Editoriale (Playfair Display + Raleway)',
        'naturale'   => 'Naturale (Fraunces + Jost)',
        'moderno'    => 'Moderno (EB Garamond + Inter)',
    ],
];

function h(?string $s): string { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }
function label_for($key, array $labels): string {
    if (is_int($key)) return 'Elemento ' . ($key + 1);
    return $labels[$key] ?? ucfirst((string) $key);
}

// ---------------------------------------------------------------------------
// GitHub API
// ---------------------------------------------------------------------------
function gh_api(string $method, string $url, string $token, ?array $body = null): array {
    $ch = curl_init($url);
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => [
            'Authorization: Bearer ' . $token,
            'Accept: application/vnd.github+json',
            'User-Agent: vinisud-admin',
            'X-GitHub-Api-Version: 2022-11-28',
        ],
        CURLOPT_TIMEOUT => 20,
    ]);
    if ($body !== null) curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    $raw = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    curl_close($ch);
    return ['code' => $code, 'data' => $raw ? json_decode($raw, true) : null];
}
function gh_get_file(string $repo, string $path, string $branch, string $token): array {
    $url = "https://api.github.com/repos/{$repo}/contents/{$path}?ref=" . rawurlencode($branch);
    return gh_api('GET', $url, $token);
}

// ---------------------------------------------------------------------------
// Editor ricorsivo: render + applicazione modifiche
// ---------------------------------------------------------------------------
function is_color_field($key): bool {
    return is_string($key) && (bool) preg_match('/color$/i', $key);
}
function is_opacity_field($key): bool {
    return is_string($key) && (bool) preg_match('/opacity$/i', $key);
}
function is_image_field($key): bool {
    return is_string($key) && (bool) preg_match('/image$/i', $key);
}
// Anteprima neutra per i campi immagine ancora vuoti (evita src="" rotto).
function image_preview_src(string $val): string {
    if ($val !== '') return $val;
    $svg = '<svg xmlns="http://www.w3.org/2000/svg" width="360" height="120">'
         . '<rect width="100%" height="100%" fill="#ece2cf"/>'
         . '<text x="50%" y="50%" font-family="sans-serif" font-size="14" fill="#7a2634" text-anchor="middle" dominant-baseline="middle">Nessuna immagine caricata</text>'
         . '</svg>';
    return 'data:image/svg+xml,' . rawurlencode($svg);
}

// $listPath: se non null, $data è la LISTA i cui elementi stiamo iterando
// (quindi $key è l'indice numerico) — usato per mostrare i controlli ↑/↓.
// $anchorTopLevel: se true, i fieldset di PRIMO livello ricevono id="sec-<key>"
// (usato nell'area "home-sections" per il deep-link dal riordino sezioni).
function render_fields($data, string $name, array $blocklist, array $labels, ?string $listPath = null, bool $anchorTopLevel = false): void {
    global $SELECT_FIELDS;
    $total = count($data);
    foreach ($data as $key => $val) {
        if (in_array((string) $key, $blocklist, true)) continue;
        $fname = $name . '[' . h((string) $key) . ']';
        if ($listPath !== null && is_array($val)) {
            echo '<div class="reorder">';
            echo '<button type="submit" name="move" value="' . h($listPath . '|' . $key . '|up') . '"'
                . ($key === 0 ? ' disabled' : '') . ' title="Sposta su">▲</button>';
            echo '<button type="submit" name="move" value="' . h($listPath . '|' . $key . '|down') . '"'
                . ($key === $total - 1 ? ' disabled' : '') . ' title="Sposta giù">▼</button>';
            echo '</div>';
        }
        if (is_array($val)) {
            $isList = array_keys($val) === range(0, count($val) - 1);
            $anchorAttr = ($anchorTopLevel && is_string($key)) ? ' id="sec-' . h($key) . '"' : '';
            echo '<fieldset class="grp"' . $anchorAttr . '><legend>' . h(label_for($key, $labels)) . '</legend>';
            render_fields($val, $fname, $blocklist, $labels, $isList ? (string) $key : null);
            echo '</fieldset>';
        } elseif (is_string($val)) {
            $id = 'f_' . md5($fname);
            echo '<label for="' . $id . '">' . h(label_for($key, $labels)) . '</label>';
            if (isset($SELECT_FIELDS[$key])) {
                echo '<select id="' . $id . '" name="' . $fname . '">';
                foreach ($SELECT_FIELDS[$key] as $optVal => $optLabel) {
                    $sel = ((string) $optVal === $val) ? ' selected' : '';
                    echo '<option value="' . h((string) $optVal) . '"' . $sel . '>' . h($optLabel) . '</option>';
                }
                echo '</select>';
            } elseif (is_image_field($key)) {
                echo '<div class="imagefield">';
                echo '<img id="' . $id . '_preview" src="' . h(image_preview_src($val)) . '" alt="" class="preview-img">';
                echo '<input type="hidden" name="' . $fname . '" value="' . h($val) . '">';
                echo '<input type="file" name="upload[' . h((string) $key) . ']" accept="image/jpeg,image/png,image/webp" class="js-image-upload" data-preview="' . $id . '_preview">';
                echo '<p class="field-hint">Carica una nuova foto per sostituirla (JPG/PNG/WebP, max 6MB). Se non selezioni nulla resta quella attuale.</p>';
                if ($val !== '') {
                    echo '<label class="clear-image-label"><input type="checkbox" name="clear[' . h((string) $key) . ']" value="1"> Rimuovi immagine e torna al colore di sfondo</label>';
                }
                echo '</div>';
            } elseif (is_color_field($key)) {
                $safeVal = preg_match('/^#[0-9a-fA-F]{3,8}$/', $val) ? $val : '#000000';
                echo '<div class="colorfield">';
                echo '<input id="' . $id . '" type="color" name="' . $fname . '" value="' . h($safeVal) . '" class="js-contrast">';
                echo '<span class="contrast-note" data-for="' . $id . '"></span>';
                echo '</div>';
            } elseif (mb_strlen($val) > 70 || strpos($val, "\n") !== false) {
                echo '<textarea id="' . $id . '" name="' . $fname . '">' . h($val) . '</textarea>';
            } else {
                echo '<input id="' . $id . '" type="text" name="' . $fname . '" value="' . h($val) . '">';
            }
        } elseif ((is_float($val) || is_int($val)) && is_opacity_field($key)) {
            $id = 'f_' . md5($fname);
            $safeVal = max(0, min(1, (float) $val));
            echo '<label for="' . $id . '">' . h(label_for($key, $labels)) . '</label>';
            echo '<div class="rangefield">';
            echo '<input id="' . $id . '" type="range" min="0" max="1" step="0.01" name="' . $fname . '" value="' . h((string) $safeVal) . '" class="js-range" data-output="' . $id . '_out">';
            echo '<output id="' . $id . '_out">' . h((string) $safeVal) . '</output>';
            echo '</div>';
        }
        // altri numeri/booleani: non modificabili, ignorati
    }
}
// Applica i valori postati sui SOLI testi, preservando struttura, tipi e chiavi protette.
function apply_edits($orig, $posted, array $blocklist) {
    if (!is_array($orig)) return $orig;
    foreach ($orig as $key => $val) {
        if (in_array((string) $key, $blocklist, true)) continue;
        $p = is_array($posted) ? ($posted[$key] ?? null) : null;
        if (is_array($val)) {
            $orig[$key] = apply_edits($val, is_array($p) ? $p : [], $blocklist);
        } elseif (is_string($val) && is_string($p)) {
            $orig[$key] = $p;
        } elseif ((is_float($val) || is_int($val)) && is_opacity_field($key) && is_string($p) && is_numeric($p)) {
            $orig[$key] = max(0.0, min(1.0, (float) $p));
        }
    }
    return $orig;
}

// ---------------------------------------------------------------------------
// Area "Ordine sezioni" (content/settings/home-layout.json)
// ---------------------------------------------------------------------------
// Layout di default (tutte le sezioni note, in ordine canonico, attive): usato
// quando il file non esiste ancora sul repo (prima del primo salvataggio).
function default_section_layout(array $sectionNames): array {
    $out = [];
    foreach (array_keys($sectionNames) as $key) {
        $out[] = ['key' => $key, 'enabled' => true];
    }
    return $out;
}
// Righe della vista "Ordine sezioni": nome leggibile + ↑/↓ (stesso meccanismo
// "move" delle liste) + interruttore mostra/nascondi + link modifica contenuto.
function render_section_layout(array $sections, array $sectionNames): void {
    $total = count($sections);
    if ($total === 0) {
        echo '<p class="sub">Nessuna sezione configurata.</p>';
        return;
    }
    echo '<p class="sub">Trascina l\'ordine con le frecce, spegni l\'interruttore per nascondere una sezione (il contenuto resta salvato).</p>';
    foreach ($sections as $i => $sec) {
        $key = is_array($sec) ? (string) ($sec['key'] ?? '') : '';
        if ($key === '') continue;
        $enabled = !is_array($sec) || ($sec['enabled'] ?? true) !== false;
        $name = $sectionNames[$key] ?? ucfirst($key);
        echo '<div class="layout-row' . ($enabled ? '' : ' is-disabled') . '">';
        echo '<div class="layout-move">';
        echo '<button type="submit" name="move" value="' . h('sections|' . $i . '|up') . '"'
            . ($i === 0 ? ' disabled' : '') . ' title="Sposta su">▲</button>';
        echo '<button type="submit" name="move" value="' . h('sections|' . $i . '|down') . '"'
            . ($i === $total - 1 ? ' disabled' : '') . ' title="Sposta giù">▼</button>';
        echo '</div>';
        echo '<div class="layout-name">' . h($name) . '</div>';
        echo '<a class="layout-edit" href="?area=home-sections#sec-' . h($key) . '">Modifica contenuto →</a>';
        echo '<label class="layout-toggle" title="Mostra o nascondi questa sezione">';
        echo '<input type="checkbox" name="enabled[' . h($key) . ']" value="1"' . ($enabled ? ' checked' : '') . '>';
        echo '<span>' . ($enabled ? 'Visibile' : 'Nascosta') . '</span>';
        echo '</label>';
        echo '</div>';
    }
}
// Applica al layout i dati postati: interruttori visibilità + riordino ↑/↓.
// Ricostruisce ogni voce come {key, enabled} preservando l'ordine corrente,
// poi applica lo spostamento richiesto. Le chiavi con `key` vuota sono scartate.
function apply_layout_edits(array $sections, array $postedEnabled, ?string $move): array {
    $clean = [];
    foreach ($sections as $sec) {
        $key = is_array($sec) ? (string) ($sec['key'] ?? '') : '';
        if ($key === '') continue;
        $clean[] = ['key' => $key, 'enabled' => isset($postedEnabled[$key])];
    }
    $full = ['sections' => array_values($clean)];
    $full = apply_move($full, $move);
    return $full;
}
// Anteprima del sito pubblicato in iframe (non è editing diretto): il sito è
// export statico, quindi le modifiche appaiono solo dopo la pubblicazione.
function render_site_preview(string $url): void {
    echo '<div class="preview-block">';
    echo '<div class="preview-head">';
    echo '<strong>Anteprima del sito pubblicato</strong>';
    echo '<button type="button" class="js-reload-preview" title="Ricarica anteprima">↻ Ricarica</button>';
    echo '</div>';
    echo '<p class="preview-note">Le modifiche compaiono qui <strong>dopo la pubblicazione</strong> (circa 1–2 minuti). Questa è la home online, non un\'anteprima istantanea.</p>';
    echo '<iframe class="site-preview" src="' . h($url) . '" loading="lazy" title="Anteprima del sito pubblicato" referrerpolicy="no-referrer"></iframe>';
    echo '<p class="field-hint"><a href="' . h($url) . '" target="_blank" rel="noopener">Apri il sito in una nuova scheda ↗</a></p>';
    echo '</div>';
}

// ---------------------------------------------------------------------------
// Login / logout
// ---------------------------------------------------------------------------
$error = ''; $notice = '';
if (($_GET['logout'] ?? '') === '1') { session_destroy(); header('Location: index.php'); exit; }
if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && isset($_POST['login_password'])) {
    if ($PASS !== '' && hash_equals($PASS, (string) $_POST['login_password'])) {
        $_SESSION['vos_admin'] = true;
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
        header('Location: index.php' . (isset($_POST['area']) ? '?area=' . urlencode((string)$_POST['area']) : ''));
        exit;
    }
    $error = 'Password errata.';
}
$loggedIn = !empty($_SESSION['vos_admin']);

// Area corrente
$area = $_GET['area'] ?? ($_POST['area'] ?? '');
$validArea = isset($AREAS[$area]);

// ---------------------------------------------------------------------------
// Salvataggio
// ---------------------------------------------------------------------------
// Sposta un elemento di una lista (per i controlli ↑/↓ delle sezioni).
function apply_move(array $target, ?string $move): array {
    if ($move === null) return $target;
    $parts = explode('|', $move, 3);
    if (count($parts) !== 3) return $target;
    [$listKey, $idx, $dir] = $parts;
    $idx = (int) $idx;
    if (!isset($target[$listKey]) || !is_array($target[$listKey])) return $target;
    $list = $target[$listKey];
    $swapWith = $dir === 'up' ? $idx - 1 : $idx + 1;
    if ($idx < 0 || $swapWith < 0 || $idx >= count($list) || $swapWith >= count($list)) return $target;
    [$list[$idx], $list[$swapWith]] = [$list[$swapWith], $list[$idx]];
    $target[$listKey] = array_values($list);
    return $target;
}

if ($loggedIn && $validArea && ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && (isset($_POST['save']) || isset($_POST['move']))) {
    if (!hash_equals($_SESSION['csrf'] ?? '', (string) ($_POST['csrf'] ?? ''))) {
        $error = 'Sessione scaduta, ricarica la pagina e riprova.';
    } else {
        [$_lbl, $file, $subkey] = $AREAS[$area];
        $isLayout = ($area === 'home-layout');
        $get = gh_get_file($REPO, $file, $BRANCH, $TOKEN);
        $fileExists = ($get['code'] === 200 && isset($get['data']['sha']));
        // Il file del layout può non esistere ancora: il primo salvataggio lo
        // crea, quindi per quest'area un 404 in lettura è accettabile.
        if (!$fileExists && !($isLayout && $get['code'] === 404)) {
            $error = 'Impossibile leggere i contenuti da GitHub (codice ' . $get['code'] . ').';
        } else {
            $full = $fileExists ? (json_decode(base64_decode($get['data']['content']), true) ?: []) : [];

            if ($isLayout) {
                // Area "Ordine sezioni": interruttori visibilità + riordino ↑/↓.
                $sections = (isset($full['sections']) && is_array($full['sections']))
                    ? $full['sections']
                    : default_section_layout($SECTION_NAMES);
                $postedEnabled = (isset($_POST['enabled']) && is_array($_POST['enabled'])) ? $_POST['enabled'] : [];
                $full = apply_layout_edits($sections, $postedEnabled, $_POST['move'] ?? null);
            } else {
            $posted = $_POST['d'] ?? [];

            // Upload immagini: ogni file caricato in $_FILES['upload'][...]
            // sostituisce il path testuale corrispondente in $posted, prima
            // di apply_edits. Supporta solo campi *Image di primo livello
            // (tutti i casi oggi: heroBackgroundImage, faviconImage,
            // *BackgroundImage delle sezioni home, backgroundImage pagine).
            $uploadedFields = [];
            if (!empty($_FILES['upload']['name']) && is_array($_FILES['upload']['name'])) {
                foreach ($_FILES['upload']['name'] as $fieldKey => $originalName) {
                    if ($originalName === '' || ($_FILES['upload']['error'][$fieldKey] ?? UPLOAD_ERR_NO_FILE) !== UPLOAD_ERR_OK) {
                        continue;
                    }
                    $tmpPath = $_FILES['upload']['tmp_name'][$fieldKey];
                    $size = (int) $_FILES['upload']['size'][$fieldKey];
                    if ($size > 6 * 1024 * 1024) {
                        $error = 'Immagine troppo grande (max 6MB): ' . h($originalName);
                        continue;
                    }
                    $imgInfo = @getimagesize($tmpPath);
                    $extByMime = ['image/jpeg' => 'jpg', 'image/png' => 'png', 'image/webp' => 'webp'];
                    if ($imgInfo === false || !isset($extByMime[$imgInfo['mime']])) {
                        $error = 'File non valido, deve essere una JPG/PNG/WebP: ' . h($originalName);
                        continue;
                    }
                    $bytes = file_get_contents($tmpPath);
                    $ext = $extByMime[$imgInfo['mime']];
                    $slug = strtolower(preg_replace('/[^a-zA-Z0-9]+/', '-', (string) $fieldKey));
                    $newPath = 'public/images/uploads/' . trim($slug, '-') . '-' . substr(sha1($bytes), 0, 10) . '.' . $ext;
                    $existingImg = gh_get_file($REPO, $newPath, $BRANCH, $TOKEN);
                    $imgBody = [
                        'message' => 'cms: nuova immagine (' . $area . ' · ' . $fieldKey . ') da pannello segreteria',
                        'content' => base64_encode($bytes),
                        'branch'  => $BRANCH,
                    ];
                    if ($existingImg['code'] === 200 && isset($existingImg['data']['sha'])) {
                        $imgBody['sha'] = $existingImg['data']['sha'];
                    }
                    $putImg = gh_api('PUT', "https://api.github.com/repos/{$REPO}/contents/{$newPath}", $TOKEN, $imgBody);
                    if ($putImg['code'] === 200 || $putImg['code'] === 201) {
                        $posted[$fieldKey] = '/' . preg_replace('#^public/#', '', $newPath);
                        $uploadedFields[$fieldKey] = true;
                    } else {
                        $error = 'Caricamento immagine non riuscito (codice ' . $putImg['code'] . ').';
                    }
                }
            }

            // "Rimuovi immagine": riporta il campo a stringa vuota (torna al
            // colore di sfondo), a meno che in questa stessa richiesta non
            // sia stata appena caricata una nuova immagine per lo stesso campo.
            if (!empty($_POST['clear']) && is_array($_POST['clear'])) {
                foreach ($_POST['clear'] as $fieldKey => $flag) {
                    if ($flag === '1' && empty($uploadedFields[$fieldKey])) {
                        $posted[$fieldKey] = '';
                    }
                }
            }

            $target = $subkey === null ? $full : ($full[$subkey] ?? []);
            $target = apply_edits($target, $posted, $BLOCKLIST);
            $target = apply_move($target, $_POST['move'] ?? null);
            if ($subkey === null) {
                $full = $target;
            } else {
                $full[$subkey] = $target;
            }
            } // fine ramo aree testuali (non-layout)

            $newJson = json_encode($full, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
            $commitMsg = isset($_POST['move'])
                ? 'cms: riordino sezioni (' . $area . ') da pannello segreteria'
                : ($isLayout
                    ? 'cms: visibilità sezioni (' . $area . ') da pannello segreteria'
                    : 'cms: aggiornamento testi (' . $area . ') da pannello segreteria');
            $putBody = [
                'message' => $commitMsg,
                'content' => base64_encode($newJson),
                'branch'  => $BRANCH,
            ];
            // sha solo se il file esiste già (in creazione GitHub non lo vuole).
            if ($fileExists) $putBody['sha'] = $get['data']['sha'];
            $put = gh_api('PUT', "https://api.github.com/repos/{$REPO}/contents/{$file}", $TOKEN, $putBody);
            if ($put['code'] === 200 || $put['code'] === 201) {
                $notice = 'Modifiche pubblicate! Il sito si aggiorna automaticamente entro pochi minuti.';
            } else {
                $error = 'Salvataggio non riuscito (codice ' . $put['code'] . '). Riprova.';
            }
        }
    }
}

// Carica i dati dell'area corrente per il form
$areaData = null;
if ($loggedIn && $validArea) {
    [$_lbl, $file, $subkey] = $AREAS[$area];
    $get = gh_get_file($REPO, $file, $BRANCH, $TOKEN);
    if ($get['code'] === 200 && isset($get['data']['content'])) {
        $decoded = json_decode(base64_decode($get['data']['content']), true) ?: [];
        $areaData = $subkey === null ? $decoded : ($decoded[$subkey] ?? []);
    } elseif ($area === 'home-layout' && $get['code'] === 404) {
        // File del layout non ancora creato: mostra il default (tutte le
        // sezioni, ordine canonico). Il primo salvataggio creerà il file.
        $areaData = ['sections' => default_section_layout($SECTION_NAMES)];
    } else {
        $error = $error ?: 'Impossibile contattare GitHub (codice ' . $get['code'] . '). Controlla il token in config.php.';
    }
}
?><!doctype html>
<html lang="it">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<meta name="robots" content="noindex, nofollow">
<title>Pannello Segreteria — Vini Oli Sud</title>
<style>
  :root { --wine:#7a2634; --ink:#1f2a24; --sand:#b08d57; --bg:#f8f5ec; }
  * { box-sizing:border-box; }
  body { font-family:-apple-system,Segoe UI,Roboto,Arial,sans-serif; background:var(--bg); color:var(--ink); margin:0; padding:28px 16px; line-height:1.5; }
  .wrap { max-width:780px; margin:0 auto; }
  .card { background:#fff; border:1px solid rgba(176,141,87,.35); border-radius:16px; padding:26px 24px; box-shadow:0 10px 30px rgba(42,32,23,.06); }
  h1 { font-size:1.5rem; margin:0 0 4px; color:var(--wine); }
  .sub { color:#6b605c; margin:0 0 22px; font-size:.95rem; }
  label { display:block; font-weight:600; font-size:.8rem; text-transform:uppercase; letter-spacing:.03em; margin:16px 0 6px; }
  input[type=text],input[type=password],textarea { width:100%; padding:11px 13px; border:1px solid rgba(176,141,87,.5); border-radius:9px; font-size:1rem; font-family:inherit; background:#fffdf9; }
  textarea { min-height:84px; resize:vertical; }
  input:focus,textarea:focus { outline:none; border-color:var(--wine); box-shadow:0 0 0 3px rgba(122,38,52,.12); }
  fieldset.grp { border:1px solid rgba(176,141,87,.3); border-radius:10px; padding:6px 16px 16px; margin:18px 0; }
  fieldset.grp legend { padding:0 8px; font-weight:700; color:var(--wine); font-size:.92rem; }
  button { margin-top:22px; background:var(--wine); color:#fff; border:0; padding:14px 22px; border-radius:9px; font-size:1.02rem; font-weight:700; cursor:pointer; }
  button:hover { filter:brightness(1.08); }
  .msg { padding:12px 16px; border-radius:10px; margin-bottom:18px; font-size:.95rem; }
  .ok { background:#eaf6ee; border:1px solid #9ed3b0; color:#1c5b34; }
  .err { background:#fcebec; border:1px solid #e2a3ab; color:var(--wine); }
  .top { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; gap:12px; }
  .logout,.back { font-size:.85rem; color:#8a7f7a; text-decoration:none; }
  .logout:hover,.back:hover { color:var(--wine); }
  .areas { list-style:none; padding:0; margin:0; display:grid; gap:10px; }
  .areas a { display:block; padding:14px 16px; border:1px solid rgba(176,141,87,.4); border-radius:10px; text-decoration:none; color:var(--ink); font-weight:600; background:#fffdf9; }
  .areas a:hover { border-color:var(--wine); color:var(--wine); }
  .reorder { display:flex; gap:6px; justify-content:flex-end; margin-top:10px; }
  .reorder button { margin-top:0; padding:4px 10px; font-size:.85rem; background:#fffdf9; color:var(--wine); border:1px solid rgba(176,141,87,.5); }
  .reorder button:disabled { opacity:.3; cursor:default; }
  /* Vista "Ordine sezioni" */
  .layout-row { display:flex; align-items:center; gap:12px; padding:12px 14px; margin:10px 0; border:1px solid rgba(176,141,87,.4); border-radius:10px; background:#fffdf9; flex-wrap:wrap; }
  .layout-row.is-disabled { opacity:.62; background:#f3efe6; }
  .layout-move { display:flex; flex-direction:column; gap:4px; }
  .layout-move button { margin-top:0; padding:2px 9px; font-size:.8rem; line-height:1.1; background:#fff; color:var(--wine); border:1px solid rgba(176,141,87,.5); border-radius:6px; }
  .layout-move button:disabled { opacity:.3; cursor:default; }
  .layout-name { font-weight:700; color:var(--ink); flex:1 1 auto; min-width:8rem; }
  .layout-edit { font-size:.82rem; color:var(--wine); text-decoration:none; font-weight:600; white-space:nowrap; }
  .layout-edit:hover { text-decoration:underline; }
  .layout-toggle { display:flex; align-items:center; gap:7px; margin:0; text-transform:none; letter-spacing:normal; font-size:.82rem; font-weight:600; color:#6b605c; cursor:pointer; white-space:nowrap; }
  .layout-toggle input { width:auto; }
  /* Anteprima sito pubblicato */
  .preview-block { margin:0 0 22px; border:1px solid rgba(176,141,87,.35); border-radius:12px; overflow:hidden; background:#fffdf9; }
  .preview-head { display:flex; align-items:center; justify-content:space-between; gap:10px; padding:12px 14px; background:#f3efe6; }
  .preview-head strong { color:var(--wine); font-size:.95rem; }
  .preview-head button { margin-top:0; padding:5px 12px; font-size:.82rem; background:#fff; color:var(--wine); border:1px solid rgba(176,141,87,.5); }
  .preview-note { margin:12px 14px 0; font-size:.82rem; color:#6b605c; }
  .site-preview { display:block; width:100%; height:520px; border:0; margin-top:10px; background:#fff; }
  .colorfield { display:flex; align-items:center; gap:12px; }
  .colorfield input[type=color] { width:56px; height:40px; padding:2px; border:1px solid rgba(176,141,87,.5); border-radius:8px; background:#fffdf9; cursor:pointer; }
  .contrast-note { font-size:.82rem; }
  .contrast-note.warn { color:#a33; font-weight:600; }
  .contrast-note.ok { color:#1c5b34; }
  .imagefield { margin-bottom:6px; }
  .preview-img { display:block; width:100%; max-width:360px; height:auto; border-radius:10px; border:1px solid rgba(176,141,87,.35); margin-bottom:10px; }
  .field-hint { font-size:.78rem; color:#8a7f7a; margin:6px 0 0; font-weight:400; text-transform:none; letter-spacing:normal; }
  .rangefield { display:flex; align-items:center; gap:14px; }
  .rangefield input[type=range] { flex:1; accent-color:var(--wine); }
  .rangefield output { font-weight:700; color:var(--wine); min-width:2.6em; text-align:right; }
  .hero-preview { position:relative; margin:22px 0; border-radius:12px; overflow:hidden; border:1px solid rgba(176,141,87,.35); }
  .hero-preview img { display:block; width:100%; height:220px; object-fit:cover; }
  .hero-preview .shade { position:absolute; inset:0; background:#0f1821; }
  .hero-preview .caption { position:absolute; left:12px; bottom:10px; color:#f4ede0; font-size:.78rem; font-weight:600; text-shadow:0 2px 6px rgba(0,0,0,.6); }
  .clear-image-label { display:flex; align-items:center; gap:8px; margin-top:10px; font-size:.82rem; font-weight:400; text-transform:none; letter-spacing:normal; color:#6b605c; }
  .clear-image-label input { width:auto; }
  select { width:100%; padding:11px 13px; border:1px solid rgba(176,141,87,.5); border-radius:9px; font-size:1rem; font-family:inherit; background:#fffdf9; }
  .emoji-trigger { margin-left:8px; background:#fffdf9; border:1px solid rgba(176,141,87,.5); border-radius:6px; padding:2px 9px; font-size:1rem; line-height:1.6; cursor:pointer; vertical-align:middle; }
  .emoji-trigger:hover { border-color:var(--wine); }
  .emoji-panel { position:absolute; z-index:80; display:grid; grid-template-columns:repeat(8,1fr); gap:2px; background:#fff; border:1px solid rgba(176,141,87,.4); border-radius:10px; padding:8px; box-shadow:0 10px 28px rgba(42,32,23,.18); }
  .emoji-panel button { border:none; background:transparent; font-size:1.15rem; cursor:pointer; padding:5px; border-radius:6px; margin:0; }
  .emoji-panel button:hover { background:rgba(176,141,87,.18); }
</style>
</head>
<body>
<div class="wrap">
<?php if ($notice): ?><div class="msg ok"><?= h($notice) ?></div><?php endif; ?>
<?php if ($error): ?><div class="msg err"><?= h($error) ?></div><?php endif; ?>

<?php if (!$loggedIn): ?>
  <div class="card">
    <h1>Pannello Segreteria</h1>
    <p class="sub">Vini Oli Sud — accesso riservato.</p>
    <form method="post">
      <?php if ($area): ?><input type="hidden" name="area" value="<?= h($area) ?>"><?php endif; ?>
      <label for="pw">Password</label>
      <input id="pw" type="password" name="login_password" autocomplete="current-password" autofocus required>
      <button type="submit">Entra</button>
    </form>
  </div>

<?php elseif (!$validArea): ?>
  <div class="card">
    <div class="top">
      <h1>Cosa vuoi modificare?</h1>
      <a class="logout" href="?logout=1">Esci</a>
    </div>
    <p class="sub">Scegli una sezione. Cambi i testi, clicchi Pubblica e il sito si aggiorna da solo in pochi minuti.</p>
    <ul class="areas">
      <?php foreach ($AREAS as $key => [$label, $_f, $_s]): ?>
        <li><a href="?area=<?= h(urlencode($key)) ?>"><?= h($label) ?> →</a></li>
      <?php endforeach; ?>
    </ul>
  </div>

<?php else: ?>
  <div class="card">
    <div class="top">
      <div>
        <h1><?= h($AREAS[$area][0]) ?></h1>
        <p class="sub" style="margin:0"><?= $area === 'home-layout' ? 'Riordina e mostra/nascondi le sezioni, poi clicca <strong>Pubblica</strong>.' : 'Modifica i testi e clicca <strong>Pubblica</strong>.' ?></p>
      </div>
      <div style="text-align:right; white-space:nowrap">
        <a class="back" href="index.php">← Tutte le sezioni</a><br>
        <a class="logout" href="?logout=1">Esci</a>
      </div>
    </div>
    <form method="post" action="?area=<?= h(urlencode($area)) ?>" enctype="multipart/form-data">
      <input type="hidden" name="save" value="1">
      <input type="hidden" name="area" value="<?= h($area) ?>">
      <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf'] ?? '') ?>">
      <?php
        if ($area === 'home-layout') {
            // Vista "Ordine sezioni": righe con ↑/↓, visibilità e link modifica,
            // più l'anteprima del sito pubblicato.
            render_site_preview($PUBLIC_SITE_URL);
            $layoutSections = (is_array($areaData) && isset($areaData['sections']) && is_array($areaData['sections']))
                ? $areaData['sections'] : [];
            render_section_layout($layoutSections, $SECTION_NAMES);
        } else {
        // Anteprima del sito pubblicato accanto al form dei testi delle sezioni.
        if ($area === 'home-sections') {
            render_site_preview($PUBLIC_SITE_URL);
        }
        if (is_array($areaData)) {
            render_fields($areaData, 'd', $BLOCKLIST, $LABELS, null, $area === 'home-sections');
        }
        // Anteprima combinata immagine + ombreggiatura: mostrata solo
        // nell'area "site", l'unica con entrambi i campi collegati.
        if ($area === 'site') {
            $imgId = 'f_' . md5('d[heroBackgroundImage]') . '_preview';
            $rangeId = 'f_' . md5('d[heroOverlayOpacity]');
            $previewImg = h((string) ($areaData['heroBackgroundImage'] ?? ''));
            $previewOpacity = h((string) max(0, min(1, (float) ($areaData['heroOverlayOpacity'] ?? 0.78))));
            echo '<div class="hero-preview" data-image-source="' . $imgId . '" data-opacity-source="' . $rangeId . '">';
            echo '<img src="' . $previewImg . '" alt="">';
            echo '<div class="shade" style="opacity:' . $previewOpacity . '"></div>';
            echo '<span class="caption">Anteprima ombreggiatura (indicativa)</span>';
            echo '</div>';
        }
        } // fine ramo aree con form testuale
      ?>
      <button type="submit"><?= $area === 'home-layout' ? 'Pubblica ordine e visibilità' : 'Pubblica le modifiche' ?></button>
    </form>
  </div>
<?php endif; ?>
</div>
<script>
// Avviso di leggibilità: confronta il colore scelto (di solito uno sfondo)
// con il testo scuro standard del sito, secondo la formula di luminanza WCAG.
// Non blocca il salvataggio: è solo un suggerimento per la segreteria.
(function () {
  var DARK_TEXT = [20, 16, 12]; // --color-ink-strong

  function luminance(r, g, b) {
    var a = [r, g, b].map(function (v) {
      v /= 255;
      return v <= 0.03928 ? v / 12.92 : Math.pow((v + 0.055) / 1.055, 2.4);
    });
    return 0.2126 * a[0] + 0.7152 * a[1] + 0.0722 * a[2];
  }

  function contrastRatio(hex) {
    var m = hex.replace('#', '');
    if (m.length === 3) m = m.split('').map(function (c) { return c + c; }).join('');
    var r = parseInt(m.substr(0, 2), 16), g = parseInt(m.substr(2, 2), 16), b = parseInt(m.substr(4, 2), 16);
    var l1 = luminance(r, g, b) + 0.05;
    var l2 = luminance(DARK_TEXT[0], DARK_TEXT[1], DARK_TEXT[2]) + 0.05;
    return l1 > l2 ? l1 / l2 : l2 / l1;
  }

  document.querySelectorAll('.js-contrast').forEach(function (input) {
    var note = document.querySelector('.contrast-note[data-for="' + input.id + '"]');
    if (!note) return;
    function update() {
      var ratio = contrastRatio(input.value);
      if (ratio < 4.5) {
        note.textContent = 'Attenzione: con testo scuro il contrasto è basso (' + ratio.toFixed(1) + ':1), potrebbe essere poco leggibile.';
        note.className = 'contrast-note warn';
      } else {
        note.textContent = 'Contrasto con testo scuro: ' + ratio.toFixed(1) + ':1 — ok.';
        note.className = 'contrast-note ok';
      }
    }
    input.addEventListener('input', update);
    update();
  });
})();

// Anteprima live dell'immagine di sfondo + slider ombreggiatura, senza
// dover pubblicare per vedere il risultato.
(function () {
  function syncHeroPreview() {
    var box = document.querySelector('.hero-preview');
    if (!box) return;
    var img = box.querySelector('img');
    var shade = box.querySelector('.shade');
    var sourceImg = document.getElementById(box.dataset.imageSource);
    var rangeInput = document.getElementById(box.dataset.opacitySource);
    if (img && sourceImg) img.src = sourceImg.src;
    if (shade && rangeInput) shade.style.opacity = rangeInput.value;
  }

  document.querySelectorAll('.js-image-upload').forEach(function (input) {
    input.addEventListener('change', function () {
      var file = input.files && input.files[0];
      var preview = document.getElementById(input.dataset.preview);
      if (!file || !preview) return;
      var reader = new FileReader();
      reader.onload = function (e) { preview.src = e.target.result; syncHeroPreview(); };
      reader.readAsDataURL(file);
    });
  });

  document.querySelectorAll('.js-range').forEach(function (input) {
    var output = document.getElementById(input.dataset.output);
    input.addEventListener('input', function () {
      if (output) output.textContent = input.value;
      syncHeroPreview();
    });
  });

  syncHeroPreview();
})();

// Picker emoji: aggiunge un pulsante 🙂 accanto a ogni campo di testo per
// inserire emoji senza dover usare la tastiera emoji del sistema operativo.
(function () {
  var EMOJI = ['🍷','🫒','🍇','🌊','🏛️','🚗','🏆','✨','☀️','🌿','📍','🎉','💬','📌','🔥','⭐','🎊','🍽️','🥂','🌅'];
  var activeField = null;
  var panel = document.createElement('div');
  panel.className = 'emoji-panel';
  panel.style.display = 'none';
  EMOJI.forEach(function (emoji) {
    var btn = document.createElement('button');
    btn.type = 'button';
    btn.textContent = emoji;
    btn.addEventListener('click', function () {
      if (!activeField) return;
      var start = activeField.selectionStart ?? activeField.value.length;
      var end = activeField.selectionEnd ?? activeField.value.length;
      activeField.value = activeField.value.slice(0, start) + emoji + activeField.value.slice(end);
      activeField.focus();
      activeField.selectionStart = activeField.selectionEnd = start + emoji.length;
      panel.style.display = 'none';
    });
    panel.appendChild(btn);
  });
  document.body.appendChild(panel);

  document.querySelectorAll('input[type=text], textarea').forEach(function (field) {
    var trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'emoji-trigger';
    trigger.textContent = '🙂';
    trigger.title = 'Inserisci emoji';
    trigger.addEventListener('click', function () {
      activeField = field;
      var rect = trigger.getBoundingClientRect();
      panel.style.top = (window.scrollY + rect.bottom + 4) + 'px';
      panel.style.left = (window.scrollX + rect.left) + 'px';
      panel.style.display = panel.style.display === 'none' ? 'grid' : 'none';
    });
    field.insertAdjacentElement('afterend', trigger);
  });

  document.addEventListener('click', function (ev) {
    if (panel.contains(ev.target) || ev.target.classList.contains('emoji-trigger')) return;
    panel.style.display = 'none';
  });
})();

// Ricarica l'anteprima del sito pubblicato (forza il refresh dell'iframe).
(function () {
  document.querySelectorAll('.js-reload-preview').forEach(function (btn) {
    btn.addEventListener('click', function () {
      var iframe = document.querySelector('.site-preview');
      if (iframe) iframe.src = iframe.src;
    });
  });
})();
</script>
</body>
</html>
