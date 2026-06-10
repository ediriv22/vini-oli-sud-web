<?php
/**
 * Vini Oli Sud — Pannello segreteria (/admin)
 *
 * Login a password. Mostra un form coi testi modificabili, salva le modifiche
 * su GitHub (content/settings/site.json) tramite API: il commit fa partire la
 * pubblicazione automatica su Aruba (GitHub Action). La segretaria non usa
 * GitHub: solo utente fittizio + password, scrive nel form, clicca Pubblica.
 *
 * Le credenziali (password pannello + token GitHub) stanno in config.php,
 * fuori dal repo e NON sincronizzato dal deploy. Vedi config.example.php.
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
$PATH   = $cfg['CONTENT_PATH']  ?? 'content/settings/site.json';
$TOKEN  = $cfg['GITHUB_TOKEN']  ?? '';
$PASS   = $cfg['ADMIN_PASSWORD'] ?? '';

// Campi modificabili: chiave nel JSON => [etichetta, tipo, aiuto]
$FIELDS = [
    'siteName'        => ['Nome del sito', 'text', 'Compare nel titolo delle schede del browser e nei risultati Google.'],
    'siteDescription' => ['Descrizione del sito', 'textarea', 'Usata da Google e nelle anteprime social.'],
    'contactEmail'    => ['Email di contatto', 'text', 'Mostrata su contatti, footer, privacy e cookie.'],
    'heroEyebrow'     => ['Home — occhiello (riga piccola sopra il titolo)', 'text', ''],
    'heroTitle'       => ['Home — titolo grande', 'text', ''],
    'heroSubtitle'    => ['Home — sottotitolo', 'textarea', ''],
];

// ---------------------------------------------------------------------------
// Helper GitHub API
// ---------------------------------------------------------------------------
function gh_api(string $method, string $url, string $token, ?array $body = null): array {
    $ch = curl_init($url);
    $headers = [
        'Authorization: Bearer ' . $token,
        'Accept: application/vnd.github+json',
        'User-Agent: vinisud-admin',
        'X-GitHub-Api-Version: 2022-11-28',
    ];
    curl_setopt_array($ch, [
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_TIMEOUT        => 20,
    ]);
    if ($body !== null) {
        curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($body));
    }
    $raw  = curl_exec($ch);
    $code = (int) curl_getinfo($ch, CURLINFO_HTTP_CODE);
    $err  = curl_error($ch);
    curl_close($ch);
    return ['code' => $code, 'data' => $raw ? json_decode($raw, true) : null, 'err' => $err];
}

function content_url(string $repo, string $path, string $branch): string {
    return "https://api.github.com/repos/{$repo}/contents/{$path}?ref=" . rawurlencode($branch);
}

// ---------------------------------------------------------------------------
// Login / logout
// ---------------------------------------------------------------------------
$error = '';
$notice = '';

if (($_GET['logout'] ?? '') === '1') {
    session_destroy();
    header('Location: index.php');
    exit;
}

if (($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && isset($_POST['login_password'])) {
    if (hash_equals($PASS, (string) $_POST['login_password']) && $PASS !== '') {
        $_SESSION['vos_admin'] = true;
        $_SESSION['csrf'] = bin2hex(random_bytes(16));
        header('Location: index.php');
        exit;
    }
    $error = 'Password errata.';
}

$loggedIn = !empty($_SESSION['vos_admin']);

// ---------------------------------------------------------------------------
// Salvataggio (solo se loggato)
// ---------------------------------------------------------------------------
if ($loggedIn && ($_SERVER['REQUEST_METHOD'] ?? 'GET') === 'POST' && isset($_POST['save'])) {
    if (!hash_equals($_SESSION['csrf'] ?? '', (string) ($_POST['csrf'] ?? ''))) {
        $error = 'Sessione scaduta, ricarica la pagina e riprova.';
    } else {
        // Legge il file attuale per ottenere lo sha
        $get = gh_api('GET', content_url($REPO, $PATH, $BRANCH), $TOKEN);
        if ($get['code'] !== 200 || !isset($get['data']['sha'])) {
            $error = 'Impossibile leggere i contenuti da GitHub (codice ' . $get['code'] . ').';
        } else {
            $current = json_decode(base64_decode($get['data']['content']), true) ?: [];
            foreach ($FIELDS as $key => $_meta) {
                $current[$key] = trim((string) ($_POST[$key] ?? ''));
            }
            $newJson = json_encode($current, JSON_PRETTY_PRINT | JSON_UNESCAPED_UNICODE | JSON_UNESCAPED_SLASHES) . "\n";
            $put = gh_api('PUT', "https://api.github.com/repos/{$REPO}/contents/{$PATH}", $TOKEN, [
                'message' => 'cms: aggiornamento contenuti da pannello segreteria',
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

// ---------------------------------------------------------------------------
// Carica i valori attuali per il form
// ---------------------------------------------------------------------------
$values = [];
if ($loggedIn) {
    $get = gh_api('GET', content_url($REPO, $PATH, $BRANCH), $TOKEN);
    if ($get['code'] === 200 && isset($get['data']['content'])) {
        $values = json_decode(base64_decode($get['data']['content']), true) ?: [];
    } else {
        $error = $error ?: 'Impossibile contattare GitHub (codice ' . $get['code'] . '). Controlla il token in config.php.';
    }
}

function h(?string $s): string { return htmlspecialchars((string) $s, ENT_QUOTES, 'UTF-8'); }
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
  body { font-family: -apple-system, Segoe UI, Roboto, Arial, sans-serif; background:var(--bg); color:var(--ink); margin:0; padding:32px 16px; line-height:1.5; }
  .wrap { max-width:760px; margin:0 auto; }
  .card { background:#fff; border:1px solid rgba(176,141,87,.35); border-radius:16px; padding:28px 26px; box-shadow:0 10px 30px rgba(42,32,23,.06); }
  h1 { font-size:1.5rem; margin:0 0 4px; color:var(--wine); }
  .sub { color:#6b605c; margin:0 0 24px; font-size:.95rem; }
  label { display:block; font-weight:600; font-size:.82rem; text-transform:uppercase; letter-spacing:.04em; margin:18px 0 6px; }
  .help { font-weight:400; text-transform:none; letter-spacing:0; color:#8a7f7a; font-size:.8rem; margin:2px 0 6px; }
  input[type=text], input[type=password], textarea { width:100%; padding:12px 14px; border:1px solid rgba(176,141,87,.5); border-radius:9px; font-size:1rem; font-family:inherit; background:#fffdf9; }
  textarea { min-height:96px; resize:vertical; }
  input:focus, textarea:focus { outline:none; border-color:var(--wine); box-shadow:0 0 0 3px rgba(122,38,52,.12); }
  button { margin-top:24px; background:var(--wine); color:#fff; border:0; padding:14px 22px; border-radius:9px; font-size:1.02rem; font-weight:700; cursor:pointer; }
  button:hover { filter:brightness(1.08); }
  .msg { padding:12px 16px; border-radius:10px; margin-bottom:18px; font-size:.95rem; }
  .ok { background:#eaf6ee; border:1px solid #9ed3b0; color:#1c5b34; }
  .err { background:#fcebec; border:1px solid #e2a3ab; color:var(--wine); }
  .top { display:flex; justify-content:space-between; align-items:center; margin-bottom:18px; }
  .logout { font-size:.85rem; color:#8a7f7a; text-decoration:none; }
  .logout:hover { color:var(--wine); }
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
      <label for="pw">Password</label>
      <input id="pw" type="password" name="login_password" autocomplete="current-password" autofocus required>
      <button type="submit">Entra</button>
    </form>
  </div>
<?php else: ?>
  <div class="card">
    <div class="top">
      <div>
        <h1>Modifica testi del sito</h1>
        <p class="sub" style="margin:0">Cambia i testi, poi clicca <strong>Pubblica</strong>. Il sito si aggiorna da solo in pochi minuti.</p>
      </div>
      <a class="logout" href="?logout=1">Esci</a>
    </div>
    <form method="post">
      <input type="hidden" name="save" value="1">
      <input type="hidden" name="csrf" value="<?= h($_SESSION['csrf'] ?? '') ?>">
      <?php foreach ($FIELDS as $key => [$label, $type, $help]): ?>
        <label for="f_<?= h($key) ?>"><?= h($label) ?></label>
        <?php if ($help): ?><div class="help"><?= h($help) ?></div><?php endif; ?>
        <?php if ($type === 'textarea'): ?>
          <textarea id="f_<?= h($key) ?>" name="<?= h($key) ?>"><?= h($values[$key] ?? '') ?></textarea>
        <?php else: ?>
          <input id="f_<?= h($key) ?>" type="text" name="<?= h($key) ?>" value="<?= h($values[$key] ?? '') ?>">
        <?php endif; ?>
      <?php endforeach; ?>
      <button type="submit">Pubblica le modifiche</button>
    </form>
  </div>
<?php endif; ?>
</div>
</body>
</html>
