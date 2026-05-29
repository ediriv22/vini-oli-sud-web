# Vini Oli Sud — Forms backend audit

Audit dei moduli del sito: dove vivono, cosa raccolgono, dove finiscono
i dati. Nessun codice è stato modificato.

Endpoint analizzati: `public/forms/lead.php`.
Componenti analizzati: `src/components/sections/LeadMiniForm.tsx`,
`src/components/forms/VisitorCarnetForm.tsx`,
`src/components/forms/FoodRadarSuggestionForm.tsx`.

---

## 1. Executive summary form

- **C'è un unico endpoint**: `public/forms/lead.php`. Funziona solo se il
  sito è ospitato su un server con PHP e con `mail()` abilitato (Aruba
  Hosting Linux lo supporta nativamente; un export statico puro su CDN no).
- **I form attivi sul sito sono 3**: `LeadMiniForm` (contatti),
  `VisitorCarnetForm` (visitatori), `FoodRadarSuggestionForm` (Diario del
  Sud). Tutti puntano allo stesso `/forms/lead.php`.
- **Solo `LeadMiniForm` è compatibile con l'endpoint attuale**: invia i
  campi `fullname`, `company`, `email`, `privacy_consent` che il PHP esige.
- **`VisitorCarnetForm` e `FoodRadarSuggestionForm` NON inviano nulla
  realmente**. La PHP risponde "errore" perché mancano `fullname`,
  `company`, `privacy_consent`; la fetch JS ignora l'errore con
  `.catch(() => undefined)` e mostra comunque il pannello di successo.
  **L'utente vede "ricevuto", l'email non parte.** Questa è la criticità
  più importante prima del deploy.
- **Destinatario hardcoded**: tutte le richieste vanno a `info@vinisud.it`,
  indipendentemente da `requestType`/`audience` (che la PHP non legge).
- **Sicurezza**: niente honeypot, niente rate limit, niente CAPTCHA, niente
  CSRF. Validazione e sanitizzazione minime. Reply-To = email utente:
  rischio di header injection contenuto dal `FILTER_VALIDATE_EMAIL` di PHP,
  ma il body è solo `htmlspecialchars` (utile per HTML, irrilevante per
  email plain text). Da rivedere prima del lancio.

---

## 2. Mappa form

| Form | Pagina | Componente | Endpoint | Metodo | Destinazione dati | Stato | Priorità |
|---|---|---|---|---|---|---|---|
| Manifestazione interesse B2B | `/contatti` | `src/components/sections/LeadMiniForm.tsx` | `/forms/lead.php` | `POST` form HTML (native submit) | Email plain text → `info@vinisud.it` via `mail()` PHP; risposta HTML a tutta pagina | **funzionante** (in produzione con PHP+`mail()` attivo) | media — pulire validazione e protezioni spam |
| Carnet degustazione visitatori | `/visitatori` | `src/components/forms/VisitorCarnetForm.tsx` | `/forms/lead.php` | `POST` `FormData` via `fetch()` | NULLA (PHP risponde 200 con errore HTML, JS lo ignora) | **CRITICO — solo frontend** | alta — endpoint non gestisce questo payload |
| Segnalazione Diario del Sud | `/diario-del-sud#proponi-segnalazione` | `src/components/forms/FoodRadarSuggestionForm.tsx` | `/forms/lead.php` | `POST` `FormData` via `fetch()` | NULLA (stesso problema) | **CRITICO — solo frontend** | alta — endpoint non gestisce questo payload |

---

## 3. Campi per form

### 3.1 `LeadMiniForm` (manifestazione interesse B2B)

| `name` | Label visibile | `type` | Required | Note |
|---|---|---|---|---|
| `fullname` | Nome e cognome | text | sì | autocomplete=name |
| `company` | Ragione sociale | text | sì | autocomplete=organization |
| `email` | Email | email | sì | autocomplete=email |
| `website` | Sito web | url | no | placeholder `https://` |
| `interest` | Area di interesse | select | sì | valori: `espositori`, `buyer`, `visitatori`, `media`, `partnership`, `grand-prix` — precompilato via querystring `?interesse=` |
| `message` | Note | textarea | no | rows=4 |
| `privacy_consent` | Checkbox privacy | checkbox | sì | richiesto |

Il form ha `noValidate` HTML: la validazione è demandata al PHP, l'utente
non vede messaggi di errore inline.

### 3.2 `VisitorCarnetForm` (visitatori)

| `name` | Label visibile | `type` | Required | Note |
|---|---|---|---|---|
| `quantity` | Quanti ingressi desideri? | select | sì | opzioni `1`, `2`, `3`, `4`, `5+` |
| `email` | La tua email | email | sì | autocomplete=email |
| `audience` | (hidden) | hidden | n/a | costante `"visitatori"` |
| `requestType` | (hidden) | hidden | n/a | costante `"carnet-degustazione"` |

Submit: `event.preventDefault()` → `FormData` con i 4 campi → `fetch("/forms/lead.php", {method:"POST", body:payload}).catch(() => undefined)` → `finally { setStatus("success") }`.

Lo stato di successo è **garantito a prescindere dalla risposta**.

### 3.3 `FoodRadarSuggestionForm` (Diario del Sud)

| `name` | Label visibile | `type` | Required | Note |
|---|---|---|---|---|
| `title` | Titolo o tema della segnalazione | text | sì |  |
| `url` | Link alla fonte | url | sì |  |
| `source` | Nome della fonte | text | sì |  |
| `category` | Categoria | select | sì | `Radar del Sud`, `Oro Verde`, `Calici di Magna Grecia`, `Territori`, `Business con Anima` |
| `email` | La tua email | email | sì | autocomplete=email |
| `note` | Perché segnalarla? | textarea | no | facoltativo |
| `audience` | (hidden) | hidden | n/a | costante `"diario-del-sud"` |
| `requestType` | (hidden) | hidden | n/a | costante `"segnalazione-editoriale"` |

Stesso pattern submit del `VisitorCarnetForm`.

---

## 4. Flusso dati

### 4.1 `LeadMiniForm` (oggi, in produzione con PHP attivo)

```
Browser
  └─ <form method="POST" action="/forms/lead.php">
       └─ native submit (page reload)
            └─ /forms/lead.php (Aruba/PHP)
                 ├─ valida fullname, company, email, privacy_consent
                 ├─ sanitizza con htmlspecialchars / FILTER_SANITIZE_EMAIL
                 ├─ costruisce body plain text
                 ├─ chiama mail($to="info@vinisud.it", $subject, $body, $headers)
                 │       Headers: From: noreply@vinisud.it · Reply-To: $email
                 └─ render HTML "Richiesta ricevuta" o "Errore"
```

Stato finale dati: **email plain text a `info@vinisud.it`** se `mail()` è
configurato sul server. Nessun database, nessun log, nessuna copia.

### 4.2 `VisitorCarnetForm`

```
Browser
  └─ onSubmit → event.preventDefault()
       └─ FormData {email, quantity, audience="visitatori",
                    requestType="carnet-degustazione"}
            └─ fetch("/forms/lead.php", {method:"POST", body:FormData})
                 ├─ PHP: $name vuoto → response 200 con HTML "Errore: Nome e
                 │        cognome è obbligatorio"
                 ├─ fetch().catch(() => undefined) → ignora qualunque errore
                 └─ finally { setStatus("success") }
                      └─ render pannello "Grazie, ti abbiamo segnato."
```

Stato finale dati: **nessuna email parte**. L'utente è convinto del
contrario.

### 4.3 `FoodRadarSuggestionForm`

Identico al precedente, con campi diversi. Stesso esito: **nessuna email**.

---

## 5. Endpoint e destinazioni

### 5.1 Endpoint

| Endpoint | Path nel repo | Esiste? | Tipo |
|---|---|---|---|
| `/forms/lead.php` | `public/forms/lead.php` | sì (4503 byte) | PHP CGI/FPM (mail+HTML) |

Niente API route Next (`src/app/api/**` non esiste). Niente webhook esterni.
Niente mailto:.

### 5.2 Destinazione

- **Tutti i form** → email a `info@vinisud.it` (hardcoded nel PHP, riga
  `$to = 'info@vinisud.it';`).
- Header `From: noreply@vinisud.it` (hardcoded): se sul dominio non c'è
  SPF/DMARC che autorizzi l'envelope sender del server hosting, l'email può
  finire in SPAM o essere rifiutata dai destinatari (Gmail, Outlook).
- Header `Reply-To: <email_utente>`: permette al destinatario di rispondere
  direttamente all'utente.
- **`requestType` e `audience` sono ignorati**: anche se i form li
  inviano, il PHP non li legge, quindi tutte le richieste finiscono nella
  stessa casella `info@vinisud.it`, senza distinzione.

### 5.3 Cosa NON c'è

- Nessuna persistenza (DB, file, log).
- Nessuna conferma all'utente via email.
- Nessun CC/BCC.
- Nessun supporto per audience-routing.
- Nessun honeypot, niente token CSRF.
- Nessun rate-limit, nessuna protezione anti-spam.

---

## 6. Backend attuale — analisi `public/forms/lead.php`

| Aspetto | Stato | Note |
|---|---|---|
| Metodo HTTP | solo `POST` testato; altri metodi ricadono nel template di errore generico | Manca un `405 Method Not Allowed` esplicito |
| Validazione | minima: presenza `fullname`, `company`, `email`, `privacy_consent`; `FILTER_VALIDATE_EMAIL` su email | Nessuna lunghezza massima, niente regex sull'URL, niente sul `message` |
| Sanitizzazione | `htmlspecialchars` su nome/azienda/website/interest/message | Buono per output HTML; superfluo per body email; resta `FILTER_SANITIZE_EMAIL` solo su email |
| Email injection | parzialmente protetta: `FILTER_VALIDATE_EMAIL` blocca CRLF nel To/From; Reply-To prende l'email validata | Buona base ma il body include valori htmlspecialchars-encoded — niente CRLF stripping esplicito |
| Funzione invio | `@mail()` nativa PHP | Dipende dalla configurazione `sendmail` del server. **Su Aruba Hosting Linux funziona solo se l'host mittente coincide col dominio** o se SPF è impostato correttamente |
| SMTP / PHPMailer | assente | Per consegnabilità seria su Gmail/Outlook serve SMTP autenticato (Aruba mette a disposizione `smtps.aruba.it` 465) |
| Output | HTML a tutta pagina (text/html) | Non è un'API JSON: incompatibile con submit fetch silenziosi che si aspettano JSON |
| CORS | non gestito | Same-origin va bene; cross-origin no |
| Honeypot | assente | Aspettatevi bot |
| Rate limit | assente | Spam batch possibile |
| CAPTCHA | assente | Niente Turnstile, hCaptcha, reCAPTCHA |
| Routing per audience | assente | `requestType` e `audience` ignorati |
| Header `From` | `noreply@vinisud.it` hardcoded | Da configurare SPF/DKIM su `vinisud.it` o l'email verrà flaggata |
| Privacy consent | letto, ma non loggato | Nessuna prova GDPR del consenso prestato |
| Logging | nessuno | Nessuna prova della richiesta ricevuta |

**Verdetto**: l'endpoint **funziona per il `LeadMiniForm`** ma è incompatibile
con gli altri due form e ha gap di sicurezza/consegnabilità da chiudere
prima del lancio.

---

## 7. Backend consigliato per Aruba

### 7.1 Strategia

Mantenere la separazione frontend statico + endpoint PHP. Aruba Hosting
Linux è il caso perfetto: Next può fare `output: 'export'` (HTML statico
caricato via FTP) e `/forms/lead.php` resta sul filesystem e gestisce le
submit. Niente Node.js richiesto.

Per coprire tutti e tre i form serve una **`lead.php` v2** che:

1. accetti `POST` + `Content-Type: application/x-www-form-urlencoded` o
   `multipart/form-data` (compatibile con `FormData`);
2. legga `requestType` e `audience` come campi primi;
3. **commuti i campi richiesti in funzione del `requestType`**:
   - `manifestazione-interesse` (default LeadMiniForm) → fullname, company,
     email, privacy_consent;
   - `carnet-degustazione` (VisitorCarnetForm) → email, quantity;
   - `segnalazione-editoriale` (FoodRadarSuggestionForm) → email, title,
     url, source, category;
4. **commuti il destinatario** in base ad `audience`/`requestType`:
   - tabella `MAIL_TO_*` (vedi 7.3);
5. usi **PHPMailer + SMTP autenticato Google Workspace** (`smtp.gmail.com:465`
   con App Password) invece di `mail()`. Google ospita le caselle del
   dominio: ottima deliverability e firma DKIM nativa.
6. risponda **JSON** `{ "ok": true }` / `{ "ok": false, "error": "..." }`
   con header `Content-Type: application/json` (e adatti i 3 componenti a
   usare la risposta vera invece del `.catch(() => undefined)`);
7. abbia **honeypot** (campo `website_url` nascosto che, se compilato,
   scarta in silenzio con risposta 200);
8. abbia **rate limit** semplice basato su IP + timestamp salvati in un
   file SQLite o tabella MySQL (Aruba include un MySQL nei piani Linux);
9. **logghi** ID richiesta + timestamp + tipo (no PII) per audit;
10. **registri prova del consenso**: timestamp, IP hash, testo della
    privacy policy versionata.

### 7.2 Honeypot semplice (esempio concettuale, NON implementato)

Aggiungere ai form un campo hidden:

```html
<input type="text" name="website_url" tabindex="-1" autocomplete="off"
       style="position:absolute; left:-9999px;" aria-hidden="true" />
```

Il PHP, se vede `$_POST['website_url']` non vuoto, restituisce 200 con
`{ok:true}` finto e ignora la richiesta. Il bot pensa di avercela fatta,
nessuno spam reale arriva.

### 7.3 Configurazione email — placeholder (nessuna credenziale stampata)

Scelta del progetto: caselle ospitate su **Google Workspace**, PHP del
form parla con **Gmail SMTP** (App Password). Variabili in
`/htdocs/forms/config.php` **fuori dalla webroot** (NON nel repo):

```
SMTP_HOST=smtp.gmail.com
SMTP_USER=[casella mittente Workspace, es. noreply@vinisud.it]
SMTP_PASS=[App Password Google, generata in myaccount.google.com/apppasswords]
SMTP_PORT=465                # SMTPS; in alternativa 587 con STARTTLS
SMTP_SECURE=ssl              # con 465; "tls" se usi 587

MAIL_FROM=noreply@vinisud.it
MAIL_FROM_NAME=Vini Oli Sud

MAIL_TO_INFO=[email destinataria generica, es. info@vinisud.it]
MAIL_TO_BUYER=[email destinataria buyer/operatori]
MAIL_TO_ESPOSITORI=[email destinataria espositori]
MAIL_TO_MEDIA=[email destinataria ufficio stampa]
MAIL_TO_VISITATORI=[email destinataria visitatori/segreteria]
MAIL_TO_DIARIO=[email destinataria redazione Diario del Sud]
MAIL_TO_PARTNERSHIP=[email destinataria partnership/sponsor]
MAIL_TO_GRAND_PRIX=[email destinataria Grand Prix]
```

> 2FA deve essere attiva sulla casella mittente prima di generare la
> App Password. La password applicativa non è recuperabile dopo la
> creazione: salvala subito nel gestore password.

Nessuna di queste va committata: vanno popolate in fase di provisioning su
Aruba.

### 7.4 Routing richieste consigliato

| Form | `requestType` inviato oggi | `audience` inviato oggi | Casella consigliata |
|---|---|---|---|
| `LeadMiniForm` (`interest=espositori`) | non inviato — solo `interest` | `interest=espositori` | `MAIL_TO_ESPOSITORI` |
| `LeadMiniForm` (`interest=buyer`) | non inviato | `interest=buyer` | `MAIL_TO_BUYER` |
| `LeadMiniForm` (`interest=visitatori`) | non inviato | `interest=visitatori` | `MAIL_TO_VISITATORI` |
| `LeadMiniForm` (`interest=media`) | non inviato | `interest=media` | `MAIL_TO_MEDIA` |
| `LeadMiniForm` (`interest=partnership`) | non inviato | `interest=partnership` | `MAIL_TO_PARTNERSHIP` |
| `LeadMiniForm` (`interest=grand-prix`) | non inviato | `interest=grand-prix` | `MAIL_TO_GRAND_PRIX` |
| `VisitorCarnetForm` | `"carnet-degustazione"` | `"visitatori"` | `MAIL_TO_VISITATORI` |
| `FoodRadarSuggestionForm` | `"segnalazione-editoriale"` | `"diario-del-sud"` | `MAIL_TO_DIARIO` |
| fallback / requestType assente | — | — | `MAIL_TO_INFO` |

La logica di routing va dentro `lead.php` v2, leggendo prima `requestType`,
poi `audience`, poi `interest`, poi fallback su `MAIL_TO_INFO`.

---

## 8. Test plan form-by-form

### 8.1 `LeadMiniForm` — `/contatti`

**Locale (dev)**: `next dev` non esegue PHP — la submit fa POST a
`/forms/lead.php` che ritorna 404. Non è testabile in locale senza un
server PHP affiancato (es. `php -S 127.0.0.1:8081 -t public`).

**Dopo deploy Aruba**:
1. Aprire `/contatti`, compilare nome + ragione sociale + email + privacy.
2. Submit → la pagina si ricarica su `/forms/lead.php`.
3. **Attendere**: pagina di conferma "✓ Richiesta ricevuta".
4. **Network tab**: status 200, response HTML.
5. **Email attesa**: a `info@vinisud.it`, subject "Nuova richiesta Vini Oli
   Sud - <area_interesse>", From `noreply@vinisud.it`, Reply-To = email
   utente.
6. **Se non arriva**: controllare (a) cartella spam destinatario; (b)
   abilitazione `mail()` su Aruba; (c) record SPF su `vinisud.it`
   (`v=spf1 include:_spf.aruba.it ~all`); (d) log mail Aruba (Pannello →
   Mail → Log invii).

### 8.2 `VisitorCarnetForm` — `/visitatori`

**Stato attuale**: non funzionante (vedi §4.2). Test attuale: l'utente
vede sempre success.

**Test post-aggiornamento `lead.php`**:
1. Aprire `/visitatori`, scegliere quantità, inserire email valida.
2. **Network tab**: POST a `/forms/lead.php`, payload multipart con
   `email`, `quantity`, `audience=visitatori`,
   `requestType=carnet-degustazione`.
3. **Response attesa**: `{"ok":true}` JSON.
4. **Email attesa**: a `MAIL_TO_VISITATORI`, subject ad esempio "Nuova
   richiesta carnet degustazione", body con email utente + quantità.
5. **Se la response è 200 ma email non arriva**: SMTP configurato male;
   controllare PHPMailer debug o log Aruba.

### 8.3 `FoodRadarSuggestionForm` — `/diario-del-sud#proponi-segnalazione`

**Stato attuale**: non funzionante.

**Test post-aggiornamento `lead.php`**:
1. Compilare titolo, URL valido, fonte, categoria, email; nota
   facoltativa.
2. **Network tab**: POST con tutti i campi + hidden
   `audience=diario-del-sud`, `requestType=segnalazione-editoriale`.
3. **Response attesa**: `{"ok":true}`.
4. **Email attesa**: a `MAIL_TO_DIARIO`, subject "Nuova segnalazione
   Diario del Sud", body con tutti i campi.
5. **Verifica anti-spam**: testare anche compilando il campo honeypot
   `website_url`: la risposta deve restare 200 ma l'email non deve partire.

### 8.4 Test trasversali

- Header SPF e DKIM su `vinisud.it` configurati nel pannello Aruba.
- Spedire mail da `noreply@vinisud.it` a Gmail e Outlook personali per
  verifica consegnabilità.
- Stress test 30 submit consecutive → verificare rate-limit (se
  implementato) e che le mail non vengano marcate come bulk.
- Controllo CSP/Content-Type: la risposta JSON deve avere
  `Content-Type: application/json; charset=utf-8`.

---

## 9. Gap critici prima del deploy

Lista chiusa, ordinata per impatto sui dati degli utenti.

1. **`VisitorCarnetForm` non invia nulla**: l'utente prenota il Carnet e
   nessuno lo riceve. CRITICO.
2. **`FoodRadarSuggestionForm` non invia nulla**: stesso problema per le
   segnalazioni editoriali. CRITICO.
3. **`lead.php` ignora `requestType`/`audience`**: tutte le richieste
   ricadono nella stessa casella, nessuna possibilità di smistare a buyer,
   media, partner. ALTO.
4. **Email destinatario hardcoded a `info@vinisud.it`**: una sola casella
   per tutto il sito. Da spostare in variabili `MAIL_TO_*`. ALTO.
5. **`mail()` PHP nativo invece di SMTP autenticato**: probabilità reale
   che le email finiscano in spam su Gmail/Outlook. Configurare PHPMailer
   + SMTP Aruba. ALTO.
6. **Nessun honeypot / rate-limit / CAPTCHA**: una settimana dopo il
   lancio la casella `info@vinisud.it` sarà piena di spam di bot. ALTO.
7. **Privacy consent non registrato**: solo controllato. Per GDPR serve
   prova del consenso (timestamp, hash IP, versione testo policy).
   MEDIO-ALTO.
8. **`LeadMiniForm` ha `noValidate` ma zero messaggi inline**: se l'utente
   sbaglia un campo, vede la pagina HTML del PHP con "Errore: …" senza
   feedback inline sul form. MEDIO.
9. **`fetch().catch(() => undefined) + finally setStatus("success")` nei
   due form custom**: pattern volutamente ottimista che oggi maschera il
   fatto che non funzionano. Da rimuovere e gestire response reale.
   MEDIO.
10. **Nessun log delle submit**: nessun audit trail; se un utente
    contesta "ho compilato e nessuno mi ha risposto", non c'è prova nulla.
    MEDIO.
11. **Risposta HTML a tutta pagina invece di JSON**: `LeadMiniForm` fa
    page reload sull'errore (UX accettabile su mobile, perde lo stato
    form), gli altri due usano fetch e si aspettano implicitamente JSON
    (oggi ricevono HTML ma lo ignorano). BASSO ma da uniformare con la v2
    dell'endpoint.
12. **Header SPF/DKIM su `vinisud.it`**: deliverability. Da configurare
    nel pannello Aruba prima del lancio.

---

## Appendice — Estratto cruciale di `public/forms/lead.php`

Confermo per trasparenza i punti chiave letti dal file (4503 byte totali):

- Required server-side: `fullname`, `company`, `email`, `privacy_consent`.
- Validazione email: `filter_var($email, FILTER_VALIDATE_EMAIL)`.
- Subject email: `"Nuova richiesta Vini Oli Sud - " . $interest_safe`.
- Destinatario: `$to = 'info@vinisud.it';` (hardcoded).
- Headers: `From: noreply@vinisud.it`, `Reply-To: $email_safe`,
  `Content-Type: text/plain; charset=UTF-8`.
- Funzione invio: `@mail($to, $subject, $body, $headers)` (errore
  soppresso).
- Output: pagina HTML completa con `<div class="container">` e bottone
  "Torna alla homepage" o "Torna indietro".
- Pagina di successo recita "appena attivo il flusso operativo dedicato":
  da rivedere assieme alla pulizia editoriale già fatta sul sito (vedi
  `docs/editorial-design-accessibility-review.md`).
