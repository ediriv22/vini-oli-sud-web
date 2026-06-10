<?php
/**
 * Vini Oli Sud — config.example.php del pannello /admin
 *
 * Sul server Aruba: copiare in config.php e inserire i valori reali.
 * NON committare config.php (contiene token e password) — è in .gitignore
 * e viene escluso dalla pubblicazione automatica.
 */

return [
    // Repository GitHub dei contenuti (non cambia)
    'GITHUB_REPO'   => 'ediriv22/vini-oli-sud-web',
    'GITHUB_BRANCH' => 'main',
    'CONTENT_PATH'  => 'content/settings/site.json',

    // Token GitHub con permesso "Contents: Read and write" SOLO su questo repo.
    // Generato in: GitHub > Settings > Developer settings > Fine-grained tokens.
    'GITHUB_TOKEN'  => 'INSERIRE_TOKEN_GITHUB',

    // Password che la segretaria userà per entrare nel pannello /admin.
    'ADMIN_PASSWORD' => 'INSERIRE_PASSWORD_PANNELLO',
];
