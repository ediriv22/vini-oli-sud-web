<?php
/**
 * Vini Oli Sud — config.example.php
 *
 * Modello di configurazione per /htdocs/forms/config.php sul server Aruba.
 *
 * NON committare il file reale `config.php` nel repo: rinominare questo file
 * in `config.php` SOLO sul server e sostituire i placeholder con le
 * credenziali reali (password DB, password casella Aruba, caselle).
 *
 * Invio email via Aruba Mail: il mittente DEVE essere una casella reale e
 * autenticata (qui info@vinisud.it). Non si può inviare da una casella
 * inesistente, altrimenti l'invio viene rifiutato o finisce in spam.
 */

return [
    // Database Aruba (DB #1 — Sql1943124_1). Gli altri 4 restano di riserva.
    // La password è nel pannello Aruba > Database; NON committarla nel repo.
    'DB_HOST'  => '31.11.39.208',
    'DB_NAME'  => 'Sql1943124_1',
    'DB_USER'  => 'Sql1943124',
    'DB_PASS'  => 'INSERIRE_PASSWORD_DATABASE_ARUBA',
    'DB_TABLE' => 'vos_form_leads',

    // SMTP Aruba Mail — autenticazione con la casella reale info@vinisud.it.
    'SMTP_HOST'   => 'smtps.aruba.it',
    'SMTP_USER'   => 'info@vinisud.it',
    'SMTP_PASS'   => 'INSERIRE_PASSWORD_CASELLA_INFO_ARUBA',
    'SMTP_PORT'   => 465,        // 465 con ssl (consigliato Aruba)
    'SMTP_SECURE' => 'ssl',      // 'ssl' (con 465) oppure 'tls' (con 587)

    // Identità mittente delle NOTIFICHE allo staff (= casella autenticata).
    'MAIL_FROM'      => 'info@vinisud.it',
    'MAIL_FROM_NAME' => 'Vini Oli Sud',

    // Copia conoscenza nascosta: riceve in Ccn TUTTE le notifiche allo staff,
    // qualunque sia il destinatario di routing. Lasciare vuoto per disattivare.
    'MAIL_BCC'       => 'napoliracingshow@libero.it',

    // --- Email di conferma automatica all'utente che compila il form ---
    // Mittente = stessa casella autenticata (info@). Se in futuro crei una
    // casella noreply@vinisud.it reale, puoi metterla qui.
    'SEND_USER_CONFIRMATION' => true,
    'CONFIRM_FROM'           => 'info@vinisud.it',
    'CONFIRM_FROM_NAME'      => 'Vini Oli Sud',
    'CONFIRM_SUBJECT'        => 'Abbiamo ricevuto la tua richiesta — Vini Oli Sud',

    // Caselle destinatarie per routing.
    // Per partire: TUTTE puntano a info@vinisud.it. Quando creerai le caselle
    // dedicate (buyer@, espositori@, ...), basta aggiornarle qui senza toccare
    // il codice.
    'MAIL_TO_INFO'        => 'info@vinisud.it',
    'MAIL_TO_BUYER'       => 'info@vinisud.it',
    'MAIL_TO_ESPOSITORI'  => 'info@vinisud.it',
    'MAIL_TO_MEDIA'       => 'info@vinisud.it',
    'MAIL_TO_VISITATORI'  => 'info@vinisud.it',
    'MAIL_TO_DIARIO'      => 'info@vinisud.it',
    'MAIL_TO_PARTNERSHIP' => 'info@vinisud.it',
    'MAIL_TO_GRAND_PRIX'  => 'info@vinisud.it',
];
