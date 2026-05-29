<?php
/**
 * Vini Oli Sud — config.example.php
 *
 * Modello di configurazione per /htdocs/forms/config.php sul server Aruba.
 *
 * NON committare il file reale `config.php` nel repo: rinominare questo file
 * in `config.php` SOLO sul server, sostituire i placeholder con le credenziali
 * Google Workspace e con le caselle destinatarie.
 *
 * 2FA va attiva sulla casella mittente (Workspace) PRIMA di generare la App
 * Password in https://myaccount.google.com/apppasswords.
 */

return [
    // SMTP Google Workspace
    'SMTP_HOST'   => 'smtp.gmail.com',
    'SMTP_USER'   => 'noreply@vinisud.it',
    'SMTP_PASS'   => 'INSERIRE_APP_PASSWORD_GOOGLE',
    'SMTP_PORT'   => 465,        // 465 con ssl, oppure 587 con tls
    'SMTP_SECURE' => 'ssl',      // 'ssl' (con 465) oppure 'tls' (con 587)

    // Identità mittente
    'MAIL_FROM'      => 'noreply@vinisud.it',
    'MAIL_FROM_NAME' => 'Vini Oli Sud',

    // Caselle destinatarie per routing (tutte ospitate su Google Workspace)
    'MAIL_TO_INFO'        => 'info@vinisud.it',
    'MAIL_TO_BUYER'       => 'buyer@vinisud.it',
    'MAIL_TO_ESPOSITORI'  => 'espositori@vinisud.it',
    'MAIL_TO_MEDIA'       => 'media@vinisud.it',
    'MAIL_TO_VISITATORI'  => 'visitatori@vinisud.it',
    'MAIL_TO_DIARIO'      => 'diario@vinisud.it',
    'MAIL_TO_PARTNERSHIP' => 'partnership@vinisud.it',
    'MAIL_TO_GRAND_PRIX'  => 'grandprix@vinisud.it',
];
