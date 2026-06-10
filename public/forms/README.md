# Endpoint form Vini Oli Sud — note di deploy

## Cosa contiene questa cartella

- `lead.php` — endpoint unico per i 3 form del sito (LeadMiniForm,
  VisitorCarnetForm, FoodRadarSuggestionForm). Risponde sempre JSON.
  **Salva ogni lead nel database (DB #1 Aruba) e poi invia la notifica
  email.** Il database è la fonte primaria: se l'email fallisce, il lead
  è comunque salvato e l'utente vede successo (l'errore SMTP resta nel log).
- `config.example.php` — modello di configurazione (DB + SMTP + caselle).
  **Non rinominare in `config.php` nel repo**: la rinomina avviene solo
  sul server.
- `schema.sql` — DDL della tabella `vos_form_leads`. Da eseguire una
  volta in phpMyAdmin sul database `Sql1943124_1`.

## Database (DB #1 — Sql1943124_1)

Tutti e 3 i form salvano nella stessa tabella `vos_form_leads`, distinti
dalla colonna `form_type` (`manifestazione-interesse`, `carnet-degustazione`,
`segnalazione-editoriale`). Gli altri 4 database Aruba restano di riserva.

**Una tantum, in phpMyAdmin → `Sql1943124_1` → SQL:**

1. Se esiste già la tabella di test (schema vecchio con `nome`/`cognome`/
   `azienda`), eliminala: `DROP TABLE vos_form_leads;` — il nuovo schema è
   diverso e copre tutti i form.
2. Incolla ed esegui il contenuto di `schema.sql`.
3. Verifica che la tabella abbia le colonne `fullname`, `quantity`,
   `seg_title`, ecc.

Le credenziali DB vanno in `config.php` (chiavi `DB_HOST`, `DB_NAME`,
`DB_USER`, `DB_PASS`, `DB_TABLE`). La password è nel pannello Aruba >
Database; **non committarla**.

## Email (Aruba Mail)

Invio via **Aruba Mail** (`smtps.aruba.it:465`, SSL). Il mittente deve
essere una **casella reale e autenticata**: si parte con `info@vinisud.it`
(da creare nel pannello Aruba > Caselle), usata sia come mittente sia come
destinatario di tutti i form.

Tre tipi di email per ogni submit:

1. **Notifica allo staff** → casella di routing (`MAIL_TO_*`, oggi tutte
   `info@vinisud.it`), `From: info@vinisud.it`, `Reply-To` = email utente.
2. **Ccn nascosta** → `MAIL_BCC` (default `napoliracingshow@libero.it`),
   su ogni notifica staff, invisibile ai destinatari. Vuoto = disattivata.
3. **Conferma all'utente** → autoresponder "Abbiamo ricevuto la tua
   richiesta" verso l'email di chi compila. Attiva con
   `SEND_USER_CONFIRMATION => true`; mittente `CONFIRM_FROM` (oggi
   `info@vinisud.it`). Se l'utente risponde, la mail torna a `MAIL_TO_INFO`.

Quando creerai le caselle dedicate (`buyer@`, `espositori@`, …) basta
aggiornare le `MAIL_TO_*` in `config.php`, senza toccare il codice. Se
crei una casella reale `noreply@vinisud.it`, puoi metterla in `CONFIRM_FROM`.

## Setup sul server Aruba (passi una tantum)

1. Carica via SFTP tutta la cartella `forms/` in `htdocs/forms/`.
2. Crea la casella `info@vinisud.it` nel pannello Aruba > Caselle.
3. Sul server, **copia** `config.example.php` → `config.php` e sostituisci
   i placeholder con i dati reali (password DB, password casella
   `info@vinisud.it`, eventuali caselle di routing). `config.php` non va
   mai committato.
4. Scarica PHPMailer (https://github.com/PHPMailer/PHPMailer/releases) e
   carica in `htdocs/forms/PHPMailer/src/` i 3 file:
   - `Exception.php`
   - `PHPMailer.php`
   - `SMTP.php`
   In alternativa, se Composer è abilitato sul piano: `composer require
   phpmailer/phpmailer` dentro `htdocs/forms/` (creerà `vendor/`).
5. Esegui lo schema DB: phpMyAdmin → `Sql1943124_1` → SQL → contenuto di
   `schema.sql` (vedi sezione Database).
6. Crea la cartella `htdocs/forms/data/` con permessi `750` (scrivibile
   da www-data ma non leggibile via web). Conterrà
   `ratelimit.json`, `requests.log`, `consent.log`.
7. Aggiungi/aggiorna `.htaccess` nella `htdocs/forms/` per:
   - bloccare l'accesso pubblico a `config.php`, `data/`, `PHPMailer/`;
   - impedire indexing della cartella `data/`.

## .htaccess minimo per `htdocs/forms/`

```
<Files "config.php">
  Require all denied
</Files>
<Files "config.example.php">
  Require all denied
</Files>
<Files "README.md">
  Require all denied
</Files>
<Files "schema.sql">
  Require all denied
</Files>
RedirectMatch 404 "/forms/data/?$"
RedirectMatch 404 "/forms/PHPMailer/?$"
```

## DNS minimo su `vinisud.it` (pannello Aruba)

Con Aruba Mail i record MX/SPF/DKIM sono in genere già impostati da Aruba
quando il dominio usa la sua posta. Verifica che esista almeno l'SPF Aruba;
in caso contrario aggiungilo:

```
TXT @  v=spf1 include:_spf.aruba.it ~all
TXT _dmarc  v=DMARC1; p=none; rua=mailto:postmaster@vinisud.it; pct=100
```

Il DKIM per Aruba Mail si attiva dal pannello Aruba (sezione email/DKIM):
abilitalo per migliorare la consegna verso Gmail/Outlook. **Nota:** SPF/MX
vanno impostati per UN solo provider di posta. Non mischiare Aruba e Google
sullo stesso dominio.

Vedere `docs/aruba-deploy-sustainability-review.md` §6-bis per dettaglio.

## Test post-deploy

```bash
curl -i -X POST https://vinisud.it/forms/lead.php \
  -F "fullname=Mario Rossi" \
  -F "company=Test SRL" \
  -F "email=tuo@indirizzo.it" \
  -F "interest=buyer" \
  -F "privacy_consent=on"
```

Risposta attesa: `200` con `{"ok":true,"requestId":"..."}`. Verificare poi
in phpMyAdmin (`Sql1943124_1` → `vos_form_leads` → Sfoglia) che sia comparsa
una riga con `form_type = manifestazione-interesse` e che la notifica sia
arrivata a `buyer@vinisud.it`. Stessa logica per gli altri due form
(`form_type` = `carnet-degustazione` / `segnalazione-editoriale`).

Risposta attesa: `200 OK` con body `{"ok":true,"requestId":"..."}` e
email a `buyer@vinisud.it`.

Per il VisitorCarnetForm:
```bash
curl -i -X POST https://vinisud.it/forms/lead.php \
  -F "email=tuo@indirizzo.it" \
  -F "quantity=2" \
  -F "audience=visitatori" \
  -F "requestType=carnet-degustazione" \
  -F "privacy_consent=on"
```

Per il FoodRadarSuggestionForm:
```bash
curl -i -X POST https://vinisud.it/forms/lead.php \
  -F "title=Test segnalazione" \
  -F "url=https://example.com" \
  -F "source=Test Source" \
  -F "category=Radar del Sud" \
  -F "email=tuo@indirizzo.it" \
  -F "audience=diario-del-sud" \
  -F "requestType=segnalazione-editoriale" \
  -F "privacy_consent=on"
```

In caso di errore SMTP/configurazione, controllare i log del server
(`error_log`) per la riga `lead.php SMTP error: …`.
