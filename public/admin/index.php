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
$AREAS = [
    'site'                => ['Generale & Home',  'content/settings/site.json', null],
    'page:evento'         => ['Pagina Evento',        'content/pages.json', 'evento'],
    'page:espositori'     => ['Pagina Espositori',    'content/pages.json', 'espositori'],
    'page:buyer'          => ['Pagina Buyer',         'content/pages.json', 'buyer'],
    'page:visitatori'     => ['Pagina Visitatori',    'content/pages.json', 'visitatori'],
    'page:grand-prix'     => ['Pagina Grand Prix',    'content/pages.json', 'grand-prix'],
    'page:diario-del-sud' => ['Pagina Diario del Sud','content/pages.json', 'diario-del-sud'],
    'page:media'          => ['Pagina Media / Stampa','content/pages.json', 'media'],
    'page:contatti'       => ['Pagina Contatti',      'content/pages.json', 'contatti'],
];

// Chiavi strutturali: mai mostrate né modificabili (preservate al salvataggio).
$BLOCKLIST = ['ctaHref', 'href', 'url', 'icon', 'kind', 'slug', 'id'];

// Etichette italiane per i campi.
$LABELS = [
    'siteName' => 'Nome del sito', 'siteDescription' => 'Descrizione del sito (SEO)',
    'contactEmail' => 'Email di contatto',
    'heroEyebrow' => 'Home — occhiello', 'heroTitle' => 'Home — titolo', 'heroSubtitle' => 'Home — sottotitolo',
    'eyebrow' => 'Occhiello', 'title' => 'Titolo', 'description' => 'Descrizione',
    'ctaLabel' => 'Etichetta pulsante', 'ctaNote' => 'Nota sotto il pulsante',
    'summary' => 'Riassunto', 'focusTitle' => 'Titolo sezione focus', 'focusIntro' => 'Introduzione sezione focus',
    'pillars' => 'Pilastri', 'sections' => 'Sezioni', 'verifyNotes' => 'Note di verifica',
    'richSections' => 'Sezioni estese', 'metadataDescription' => 'Descrizione SEO della pagina',
    'externalReference' => 'Riferimento esterno', 'intro' => 'Introduzione',
    'blocks' => 'Blocchi', 'items' => 'Voci', 'lines' => 'Righe', 'text' => 'Testo', 'label' => 'Etichetta',
    'themePrimaryColor' => 'Colore primario (bottoni e accenti)',
    'themeBackgroundColor' => 'Colore di sfondo generale del sito',
    'backgroundColor' => 'Colore di sfondo di questa pagina',
    'heroBackgroundImage' => 'Home — immagine di sfondo',
    'heroOverlayOpacity' => 'Home — intensità ombreggiatura sull’immagine',
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

// $listPath: se non null, $data è la LISTA i cui elementi stiamo iterando
// (quindi $key è l'indice numerico) — usato per mostrare i controlli ↑/↓.
function render_fields($data, string $name, array $blocklist, array $labels, ?string $listPath = null): void {
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
            echo '<fieldset class="grp"><legend>' . h(label_for($key, $labels)) . '</legend>';
            render_fields($val, $fname, $blocklist, $labels, $isList ? (string) $key : null);
            echo '</fieldset>';
        } elseif (is_string($val)) {
            $id = 'f_' . md5($fname);
            echo '<label for="' . $id . '">' . h(label_for($key, $labels)) . '</label>';
            if (is_image_field($key)) {
                echo '<div class="imagefield">';
                echo '<img id="' . $id . '_preview" src="' . h($val) . '" alt="" class="preview-img">';
                echo '<input type="hidden" name="' . $fname . '" value="' . h($val) . '">';
                echo '<input type="file" name="upload[' . h((string) $key) . ']" accept="image/jpeg,image/png,image/webp" class="js-image-upload" data-preview="' . $id . '_preview">';
                echo '<p class="field-hint">Carica una nuova foto per sostituirla (JPG/PNG/WebP, max 6MB). Se non selezioni nulla resta quella attuale.</p>';
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
        $get = gh_get_file($REPO, $file, $BRANCH, $TOKEN);
        if ($get['code'] !== 200 || !isset($get['data']['sha'])) {
            $error = 'Impossibile leggere i contenuti da GitHub (codice ' . $get['code'] . ').';
        } else {
            $full = json_decode(base64_decode($get['data']['content']), true) ?: [];
            $posted = $_POST['d'] ?? [];

            // Upload immagini: ogni file caricato in $_FILES['upload'][...]
            // sostituisce il path testuale corrispondente in $posted, prima
            // di apply_edits. Supporta solo campi *Image di primo livello
            // (unico caso oggi: heroBackgroundImage in site.json).
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
                    $newPath = 'public/images/home/hero-bg-' . substr(sha1($bytes), 0, 10) . '.' . $ext;
                    $existingImg = gh_get_file($REPO, $newPath, $BRANCH, $TOKEN);
                    $imgBody = [
                        'message' => 'cms: nuova immagine di sfondo (' . $area . ') da pannello segreteria',
                        'content' => base64_encode($bytes),
                        'branch'  => $BRANCH,
                    ];
                    if ($existingImg['code'] === 200 && isset($existingImg['data']['sha'])) {
                        $imgBody['sha'] = $existingImg['data']['sha'];
                    }
                    $putImg = gh_api('PUT', "https://api.github.com/repos/{$REPO}/contents/{$newPath}", $TOKEN, $imgBody);
                    if ($putImg['code'] === 200 || $putImg['code'] === 201) {
                        $posted[$fieldKey] = '/' . preg_replace('#^public/#', '', $newPath);
                    } else {
                        $error = 'Caricamento immagine non riuscito (codice ' . $putImg['code'] . ').';
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
            $newJson = json_encode($full, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
            $commitMsg = isset($_POST['move'])
                ? 'cms: riordino sezioni (' . $area . ') da pannello segreteria'
                : 'cms: aggiornamento testi (' . $area . ') da pannello segreteria';
            $put = gh_api('PUT', "https://api.github.com/repos/{$REPO}/contents/{$file}", $TOKEN, [
                'message' => $commitMsg,
                'content' => base64_encode($newJson),
                'sha'     => $get['data']['sha'],
                'branch'  => $BRANCH,
            ]);
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
        <p class="sub" style="margin:0">Modifica i testi e clicca <strong>Pubblica</strong>.</p>
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
        if (is_array($areaData)) {
            render_fields($areaData, 'd', $BLOCKLIST, $LABELS);
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
      ?>
      <button type="submit">Pubblica le modifiche</button>
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
</script>
</body>
</html>
