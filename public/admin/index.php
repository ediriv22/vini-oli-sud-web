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
function render_fields($data, string $name, array $blocklist, array $labels): void {
    foreach ($data as $key => $val) {
        if (in_array((string) $key, $blocklist, true)) continue;
        $fname = $name . '[' . h((string) $key) . ']';
        if (is_array($val)) {
            $isList = array_keys($val) === range(0, count($val) - 1);
            echo '<fieldset class="grp"><legend>' . h(label_for($key, $labels)) . '</legend>';
            render_fields($val, $fname, $blocklist, $labels);
            echo '</fieldset>';
        } elseif (is_string($val)) {
            $id = 'f_' . md5($fname);
            echo '<label for="' . $id . '">' . h(label_for($key, $labels)) . '</label>';
            if (mb_strlen($val) > 70 || strpos($val, "\n") !== false) {
                echo '<textarea id="' . $id . '" name="' . $fname . '">' . h($val) . '</textarea>';
            } else {
                echo '<input id="' . $id . '" type="text" name="' . $fname . '" value="' . h($val) . '">';
            }
        }
        // numeri/booleani: non modificabili, ignorati
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
if ($loggedIn && $validArea && ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && isset($_POST['save'])) {
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
            if ($subkey === null) {
                $full = apply_edits($full, $posted, $BLOCKLIST);
            } else {
                $full[$subkey] = apply_edits($full[$subkey] ?? [], $posted, $BLOCKLIST);
            }
            $newJson = json_encode($full, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
            $put = gh_api('PUT', "https://api.github.com/repos/{$REPO}/contents/{$file}", $TOKEN, [
                'message' => 'cms: aggiornamento testi (' . $area . ') da pannello segreteria',
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
    <form method="post" action="?area=<?= h(urlencode($area)) ?>">
      <input type="hidden" name="save" value="1">
      <input type="hidden" name="area" value="<?= h($area) ?>">
      <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf'] ?? '') ?>">
      <?php
        if (is_array($areaData)) {
            render_fields($areaData, 'd', $BLOCKLIST, $LABELS);
        }
      ?>
      <button type="submit">Pubblica le modifiche</button>
    </form>
  </div>
<?php endif; ?>
</div>
</body>
</html>
