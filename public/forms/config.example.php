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

    // Pass Giuria Popolare e Iscrizione Prodotto: oltre all'email, ogni
    // invio viene sempre scritto in forms/data/pass-giurato-iscrizioni.csv
    // / forms/data/iscrizioni-prodotto.csv (nessuna config necessaria). Se
    // qui sotto imposti l'URL di un Google Apps Script Web App
    // (Estensioni > Apps Script > funzione doPost > Distribuisci > App
    // web, accesso "Chiunque"), l'invio arriva anche su un Google Sheet in
    // tempo reale — uno per modulo, chiave separata. Lascia vuoto per
    // usare solo email + CSV.
    'GOOGLE_SHEET_WEBAPP_URL_GIURATO'  => '',
    'GOOGLE_SHEET_WEBAPP_URL_PRODOTTO' => '',

    // --- PayPal (Pass Giurato) — verifica server-side degli ordini ---
    // Usato SOLO da forms/paypal-confirm.php (chiamato dal sito dopo che
    // l'utente approva il pagamento sui pulsanti Hosted Buttons) per
    // interrogare PayPal Orders API v2 e confermare che il pagamento è
    // reale prima di segnare l'iscrizione come "pagato" e inviare la mail
    // di conferma. Client ID/Secret: developer.paypal.com > Dashboard >
    // Apps & Credentials (app live "Pass Giurato Gran Premio del Gusto").
    // NON è lo stesso client-id usato nello script dei pulsanti in pagina
    // (quello è pubblico, va bene esposto lato client): questo Secret
    // resta SOLO qui, mai nel repo, mai lato client.
    'PAYPAL_CLIENT_ID'     => 'INSERIRE_PAYPAL_CLIENT_ID',
    'PAYPAL_CLIENT_SECRET' => 'INSERIRE_PAYPAL_CLIENT_SECRET',
    // true = ambiente live (api-m.paypal.com), false = sandbox.
    'PAYPAL_LIVE' => true,
    // Email dell'account PayPal business che riceve i pagamenti — usata
    // come controllo anti-frode extra quando l'ordine la espone (mai
    // mostrata da nessuna parte lato pubblico, solo confronto server-side).
    'PAYPAL_RECEIVER_EMAIL' => 'INSERIRE_EMAIL_ACCOUNT_PAYPAL',
];
