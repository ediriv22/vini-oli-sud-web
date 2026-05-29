# Endpoint form Vini Oli Sud — note di deploy

## Cosa contiene questa cartella

- `lead.php` — endpoint unico per i 3 form del sito (LeadMiniForm,
  VisitorCarnetForm, FoodRadarSuggestionForm). Risponde sempre JSON.
- `config.example.php` — modello di configurazione. **Non rinominare in
  `config.php` nel repo**: la rinomina avviene solo sul server.

## Setup sul server Aruba (passi una tantum)

1. Carica via SFTP tutta la cartella `forms/` in `htdocs/forms/`.
2. Sul server, **copia** `config.example.php` → `config.php` e sostituisci
   i placeholder con i dati reali (App Password Google Workspace,
   caselle destinatarie). `config.php` non va mai committato.
3. Scarica PHPMailer (https://github.com/PHPMailer/PHPMailer/releases) e
   carica in `htdocs/forms/PHPMailer/src/` i 3 file:
   - `Exception.php`
   - `PHPMailer.php`
   - `SMTP.php`
   In alternativa, se Composer è abilitato sul piano: `composer require
   phpmailer/phpmailer` dentro `htdocs/forms/` (creerà `vendor/`).
4. Crea la cartella `htdocs/forms/data/` con permessi `750` (scrivibile
   da www-data ma non leggibile via web). Conterrà
   `ratelimit.json`, `requests.log`, `consent.log`.
5. Aggiungi/aggiorna `.htaccess` nella `htdocs/forms/` per:
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
RedirectMatch 404 "/forms/data/?$"
RedirectMatch 404 "/forms/PHPMailer/?$"
```

## DNS minimo su `vinisud.it` (pannello Aruba)

```
MX  @  1  ASPMX.L.GOOGLE.COM
MX  @  5  ALT1.ASPMX.L.GOOGLE.COM
MX  @  5  ALT2.ASPMX.L.GOOGLE.COM
MX  @  10 ALT3.ASPMX.L.GOOGLE.COM
MX  @  10 ALT4.ASPMX.L.GOOGLE.COM
TXT @  v=spf1 include:_spf.google.com ~all
TXT google._domainkey  <chiave DKIM da Workspace Admin>
TXT _dmarc  v=DMARC1; p=none; rua=mailto:postmaster@vinisud.it; pct=100
```

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
