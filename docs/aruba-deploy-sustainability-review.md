# Vini Oli Sud — Aruba deploy & sustainability review

Audit tecnico-operativo per portare il sito Vini Oli Sud in produzione su
hosting Aruba e verificarne la sostenibilità nel tempo. Nessun codice è
stato modificato. Per il dettaglio del comportamento dei form, vedere
`docs/forms-backend-audit.md`.

---

## 1. Executive summary

- **Sito Next.js 16.2.6** App Router, React 19.2.4, Tailwind v4.
  `next.config.ts` praticamente vuoto, `tsconfig.json` `strict`
  + `bundler` resolution + `resolveJsonModule`. Codebase pulita,
  manutenibile e già strutturata su livelli dati/componenti/pagine.
- **Scenario di deploy consigliato: ibrido**. Frontend esportato come
  statico (`output: 'export'` di Next) caricato su Aruba Hosting Linux via
  FTP; form serviti dall'endpoint PHP esistente (`public/forms/lead.php`)
  che gira nativamente sullo stesso piano Linux con PHP+`mail()`.
- **Aruba VPS/Cloud con Node** è tecnicamente possibile (build con
  `npm run build` + `npm run start` dietro reverse proxy nginx) ma è
  sovradimensionato per il traffico previsto e introduce manutenzione
  (Node versioning, pm2, log rotation) che il team non è strutturato per
  sostenere.
- **Criticità form**: 2 dei 3 form attivi (visitatori, Diario del Sud)
  oggi **non inviano nulla davvero**: il PHP non gestisce i loro payload,
  la fetch ignora l'errore e mostra success. Vedere
  `docs/forms-backend-audit.md` §1 e §4 per dettaglio. Da fixare prima del
  go-live, non è una "rifinitura".
- **Performance**: dependency tree minimo (next, react, react-dom, tailwind,
  typescript). L'immagine hero è il rischio principale: due jpg
  (`tavola-scroll-master.jpg` e `tavola-scroll-mobile.jpg`) caricate con
  `<img>` non lazy, non responsive via `next/image`, e mosse con
  `transform` JS scroll-bound. Da pesare prima del lancio.
- **SEO**: metadata centralizzata in `createPageMetadata()` di
  `src/data/site.ts`, OpenGraph + Twitter configurati a livello root.
  Mancano `sitemap.xml` e `robots.txt` (assenti in `public/`).

---

## 2. Stato tecnico attuale

### 2.1 Stack

| Componente | Versione | Note |
|---|---|---|
| Next.js | 16.2.6 | App Router (`src/app/**`), SSR/SSG per default |
| React | 19.2.4 | RSC + client components dove necessari |
| TypeScript | ^5 | `strict`, `noEmit`, `resolveJsonModule` |
| Tailwind CSS | ^4 (`@tailwindcss/postcss`) | configurazione in `globals.css` con `@theme inline` |
| ESLint | ^9 | `eslint-config-next` (core-web-vitals + typescript) |
| Node (runtime) | non dichiarato in `engines`/`.nvmrc` | rischio drift |

### 2.2 Configurazioni chiave

- **`next.config.ts`**: praticamente vuoto. Nessun `output`, nessun
  `images.domains`, nessun `experimental`.
- **`tsconfig.json`**: `target: ES2017`, `lib: dom + esnext`, `allowJs`,
  `strict`, `noEmit`, `module: esnext`, `moduleResolution: bundler`,
  `resolveJsonModule: true`, `isolatedModules`, plugin next.
- **`postcss.config.mjs`**: solo `@tailwindcss/postcss`.
- **`eslint.config.mjs`**: vitals + typescript, ignore `.next/`, `out/`,
  `build/`, `next-env.d.ts`.
- **`package.json` scripts**: `dev`, `build`, `start`, `lint`,
  `radar:import`, `radar:import:csv`, `radar:validate`.
- **Asset path conventions**: brand assets `/brand/`, hero images
  `/images/home/`, video hero `/videos/hero-vigneto.mp4` (non in uso),
  badge Grand Prix `/grand-prix/badges/*.webp`.

### 2.3 Componenti & dati

- 12 pagine routing: `evento`, `espositori`, `buyer`, `visitatori`,
  `grand-prix`, `media`, `diario-del-sud`, `contatti`, `privacy`,
  `cookie`, `page.tsx` (home).
- Componenti homepage: `HeroSection`, `EditionStrip`, `AudienceGateway`,
  `ConceptSection`, `GrandPrixHighlight`, `CtaBand`.
- Componenti pagina-specifici: `GrandPrixWinners`, `VisitorCarnetForm`,
  `FoodRadarSuggestionForm`, `LeadMiniForm`, `InternalPageTemplate`.
- Dead code in `src/components/sections/`: `EditorialPreview.tsx`,
  `RegionsSection.tsx` (non importati da nessuna pagina).
- Dead data: `src/data/videos.ts` (non importato da nessun file `src/`).
- Data layer: `site.ts` (config globale), `pages.ts` (template pagine
  interne), `navigation.ts`, `winners.ts`, `foodRadar.ts` +
  `foodRadar.generated.json`.

### 2.4 Endpoint server-side esistenti

- **`public/forms/lead.php`**: unico endpoint backend. PHP nativo +
  `mail()`. Solo per `LeadMiniForm`.

Nessuna API route Next, nessun webhook, nessun database, nessun servizio
esterno chiamato a runtime.

---

## 3. Audit sostenibilità

### 3.1 Architettura

- Separazione **dati / pagine / componenti** ben definita. Aggiungere un
  vincitore Grand Prix, un'audience, una pagina nuova è chirurgico.
- Schema dati tipizzato (TypeScript strict) → bassa probabilità di
  regressioni silenti.
- Asset editoriali Diario del Sud governati da pipeline esterna (CSV →
  script → JSON committato) — vedere `docs/food-radar-automation.md`.
- **Effetto fotocopia** delle 5 pagine interne (vedi
  `docs/editorial-design-accessibility-review.md`): manutenibilità
  ottima, identità più povera. Trade-off accettabile, da rivedere in
  iterazione 2.

### 3.2 Dipendenze (`package.json`)

Runtime: `next@16.2.6`, `react@19.2.4`, `react-dom@19.2.4`.
Dev: `@tailwindcss/postcss@^4`, `@types/node@^20`, `@types/react@^19`,
`@types/react-dom@^19`, `eslint@^9`, `eslint-config-next@16.2.6`,
`tailwindcss@^4`, `typescript@^5`.

- **Dipendenze inutili**: nessuna. La lista è già minimale.
- **Rischio versioni nuove**: Next 16 e React 19 sono molto recenti. Le
  major su Next storicamente introducono breaking change ogni ~12 mesi;
  Tailwind v4 ha cambiato pipeline (postcss) rispetto a v3 ed è in
  stabilizzazione. Pianificare un piano di aggiornamento ogni 6 mesi.
- **`engines`/`.nvmrc` mancanti**: aggiungere prima del go-live per
  ancorare la versione Node a quella che gira su Aruba/locale.
- **Compatibilità static export**: nessuna feature dynamic dichiarata.
  Tecnicamente esportabile con `output: 'export'`. Da verificare che
  l'`<img>` del hero scroll-bound non rompa il build (usa `<img>` nativa
  non `next/image`, quindi sicuro per export). Le route legacy
  (`InternalPageTemplate`) sono tutte statiche.

### 3.3 Performance

- **Asset hero**: `public/images/home/tavola-scroll-master.jpg` e
  `tavola-scroll-mobile.jpg`. Da pesare con `du -h`: se superano 400–500
  KB cad. su mobile è troppo. Servirebbero WebP/AVIF (BrandLogo lo fa già
  con `.webp`). Considerare anche `priority` per LCP.
- **Video hero**: `public/videos/hero-vigneto.mp4` esiste ma il
  `HeroSection` attuale **NON lo usa** (utilizza l'immagine
  scroll-bound). Decidere se rimuoverlo o se ha un futuro.
- **Font**: `Cormorant Garamond`, `Montserrat`, `Source Sans 3` via
  `next/font/google`. Buona pratica: subset latin, weight limitati a
  quelli effettivamente usati. Auto-host garantito da `next/font` →
  zero richieste a Google a runtime.
- **JS client-side**: `"use client"` presente in `HeroSection`,
  `Header`, `BrandLogo`, `GrandPrixWinnerBadge`, `LeadMiniForm`,
  `VisitorCarnetForm`, `FoodRadarSuggestionForm`. È un uso giustificato
  (stateful, scroll listener, fetch submit, image error fallback).
  La quantità di JS spedito è limitata; il bundle Next App Router
  splitta per route.
- **Backdrop-filter** e gradient layer multipli nelle card costano su
  mobile low-end: documentato in `editorial-design-accessibility-review.md`.

### 3.4 SEO

- Metadata: ogni pagina chiama `createPageMetadata(title, description)`
  che genera title + description + OpenGraph + Twitter card. ✅
- `metadataBase`: letto da `NEXT_PUBLIC_SITE_URL` con default
  `https://vinisud.it`. Va impostata l'env in produzione se cambia
  dominio.
- **`sitemap.xml`**: assente da `public/`. Da generare manualmente o con
  un piccolo script (10 URL totali, è breve).
- **`robots.txt`**: assente. Da aggiungere (almeno `User-agent: * /
  Allow: /` + `Sitemap:` quando esiste).
- **Heading hierarchy**: corretta (un solo `h1` per pagina, gerarchia
  `h2`/`h3`). Vedi audit accessibilità.
- **`hreflang`/i18n**: non necessari per ora (sito mono-lingua IT).

---

## 4. Compatibilità Aruba

Aruba commercializza, semplificando: **Hosting Linux** (PHP + MySQL),
**Hosting Windows**, **Cloud VPS**, **Server Dedicati**. Nessun piano
Hosting Linux supporta Node.js managed: per Node serve un piano cloud o
VPS.

### 4.1 Cosa serve a Vini Oli Sud

- File statici (HTML/CSS/JS) → qualunque hosting li serve.
- Form (`/forms/lead.php`) → richiede PHP attivo.
- Nessun database in lettura/scrittura runtime (la pagina
  `/diario-del-sud` legge un JSON committato).
- Nessuna API route Next.
- Nessun task background.

→ Profilo perfetto per **Hosting Linux Aruba con PHP**.

---

## 5. Scenari deploy

### SCENARIO A — Aruba Hosting statico (HTML+CSS+JS via FTP)

**Approccio**: `output: 'export'` di Next, build genera `out/`, contenuto
caricato via FTP/SFTP sulla root del piano hosting.

**Pro**
- Bassissima superficie di attacco (niente Node, niente DB).
- Zero costi runtime extra (hosting Linux base).
- Aggiornamenti banali: nuovo `npm run build`, sync FTP.
- Compatibile col piano Aruba più economico.

**Contro**
- I form serviti via JS fetch non hanno backend lato Next. **Devono**
  appoggiarsi al PHP, altrimenti zero dati ricevuti.
- Niente Image Optimization di Next (le immagini servite "as is").
- Cambiare contenuto = ricostruire e ricaricare.

**Passaggi tecnici**
1. Aggiungere `output: 'export'` in `next.config.ts`.
2. Rimuovere/sostituire qualunque uso di Next runtime feature non
   esportabile (oggi non ce ne sono).
3. `npm run build` → `out/` pronto.
4. FTP/SFTP della cartella `out/` nella `htdocs/` Aruba.
5. Caricare separatamente `public/forms/lead.php` se non già incluso in
   `out/` (di default `out/forms/lead.php` ci finisce perché `public/`
   viene copiata).
6. Configurare in cPanel/pannello Aruba SPF/DKIM per `vinisud.it`.

**Rischi**
- Se `output: 'export'` rivela una pagina dynamic non compatibile, il
  build fallisce. Da provare prima.
- Ogni nuovo articolo Diario del Sud richiede build+upload (oppure, con
  pipeline GitHub Action proposta, automazione).

**Quando consigliarlo**: piano minimo, tempistiche corte, manutenzione
non tecnica. → **default per Vini Oli Sud**.

### SCENARIO B — Aruba VPS/Cloud/Node (Next in modalità server)

**Approccio**: VPS Linux, Node 20+, `git clone`, `npm install`,
`npm run build`, `npm run start` dietro nginx come reverse proxy, pm2
come process manager, Let's Encrypt per SSL.

**Pro**
- Tutte le feature Next disponibili (image optimization, ISR, API
  routes, middleware).
- Possibilità di future API server-side senza dover migrare.
- Logging applicativo strutturato.

**Contro**
- Più infrastruttura: pm2, nginx, ssl renew, log rotation, system
  updates → richiede competenza sistemistica.
- Costi cloud minimi più alti del piano hosting condiviso.
- Sovradimensionato: il sito **non ha** feature dynamic che lo
  giustifichino oggi.

**Passaggi tecnici**
1. VPS Aruba con Ubuntu LTS, Node 20+, nginx, pm2.
2. Repo clonato in `/var/www/vini-oli-sud-web/`.
3. `npm install --omit=dev && npm run build`.
4. pm2: `pm2 start "npm run start" --name vini-oli-sud --time`.
5. nginx server block: `proxy_pass http://127.0.0.1:3000`.
6. Certbot per `vinisud.it` e `www.vinisud.it`.
7. Form: la `/forms/lead.php` non gira su Node! O si riscrive
   l'endpoint come API route Next (sostituendo PHP), o si predispone un
   secondo container/servizio per PHP.

**Rischi**
- pm2/process unsupervised → memory leak nel tempo.
- Aruba VPS non ha SLA come AWS/GCP per restart automatici.
- Costi mensili ricorrenti.

**Quando consigliarlo**: solo se nascono requisiti dynamic (es. login
buyer, area riservata, sondaggi). Oggi no.

### SCENARIO C — Ibrido consigliato (statico + PHP)

**Approccio**: scenario A + PHP endpoint potenziato.

- Frontend: `output: 'export'`, FTP su Aruba Hosting Linux.
- Form: `/forms/lead.php` v2 (vedi `forms-backend-audit.md` §7), gestita
  da PHP nativo del piano, **PHPMailer + SMTP autenticato Aruba**,
  routing per `requestType`/`audience`, honeypot e rate limit.
- Pipeline Diario del Sud: GitHub Action giornaliera che esegue
  `npm run radar:import:csv` da uno snapshot CSV del Sheet pubblicato e
  apre un PR; il deploy parte da merge.

**Pro**
- Tutti i vantaggi di A (costi, semplicità, sicurezza).
- Backend form serio (consegnabilità, routing, anti-spam).
- Aggiornamenti editoriali Diario semi-automatici senza toccare il
  server.
- Gestibile anche da non-developer.

**Contro**
- Richiede l'unica cosa che oggi non è pronta: la `lead.php` v2.

**Quando consigliarlo**: sempre, per questo progetto. **È la
raccomandazione.**

---

## 6. Checklist trasferimento Aruba

### 6.1 Preparazione locale

- `git status` pulito; tag `release/yyyy-mm-dd` creato.
- `npm install` (locale macOS) → `node_modules` aggiornato.
- `npm run lint` → 0 errori, 0 warning.
- `npx tsc --noEmit` → pulito.
- Aggiungere in `next.config.ts`: `output: 'export'`,
  `images: { unoptimized: true }`.
- `npm run build` → `out/` generato senza errori.
- Verifica visiva `npx serve out` o `python3 -m http.server -d out`.
- Controllo dimensione cartella `out/` e in particolare
  `out/images/home/tavola-scroll-*.jpg`.
- Verifica link interni: cliccare ogni voce nav, ogni CTA.
- Verifica `out/forms/lead.php` presente.
- Verifica `out/sitemap.xml` e `out/robots.txt` (da creare se assenti).

### 6.2 Dominio / DNS

- Dominio `vinisud.it` registrato su Aruba.
- Record A/AAAA → IP del piano Hosting Linux Aruba.
- `www.vinisud.it` con record CNAME → `vinisud.it`.
- Redirect 301 `www → non-www` (o viceversa, scelta editoriale) gestito
  via `.htaccess`.
- HTTPS: certificato Let's Encrypt incluso in tutti i piani Aruba,
  attivabile dal pannello.
- Record **SPF** su `vinisud.it`: `v=spf1 include:_spf.aruba.it ~all`.
- Record **DKIM**: chiave generata dal pannello Aruba Mail.
- Record **DMARC**: `v=DMARC1; p=none; rua=mailto:postmaster@vinisud.it`
  iniziale, dopo 30 giorni passare a `p=quarantine`.
- Set `NEXT_PUBLIC_SITE_URL=https://vinisud.it` se cambia dominio.

### 6.3 Upload

- **Caricare via SFTP** dentro `htdocs/`:
  - tutto il contenuto di `out/` (HTML, JS, CSS, immagini, fonts).
  - `out/forms/lead.php` (incluso da `public/forms/`).
  - `out/sitemap.xml`, `out/robots.txt`, `out/favicon.ico`.
- **NON caricare**:
  - `node_modules/`
  - `.next/`
  - `.git/`
  - `scripts/`
  - `docs/`
  - file `.env*`
  - `package.json`/`package-lock.json` (non servono al runtime statico)
  - `src/`
  - `docs/apps-script/diario-del-sud-github-bridge.gs`
- Caricare anche file `.htaccess` con:
  - redirect HTTPS,
  - rewrite per pretty URL (Next export genera già directory con
    `index.html`, ma a seconda della config Aruba serve un rewrite),
  - cache headers per asset statici (`Cache-Control: public, max-age=31536000, immutable`).

### 6.4 Form / backend

- Verifica che PHP sia attivo nel piano Aruba selezionato (PHP 8.x
  consigliato).
- Configurare account email del dominio:
  - `noreply@vinisud.it` (mittente form).
  - `info@vinisud.it`, `buyer@…`, `espositori@…`, `media@…`,
    `visitatori@…`, `diario@…`, `partnership@…`, `grandprix@…`
    (destinatari per audience).
- Installare **PHPMailer** caricando `PHPMailer/src/*.php` sul server
  oppure usare `composer require phpmailer/phpmailer` se Composer è
  abilitato.
- Creare `/htdocs/forms/config.php` (fuori dal repo) con le variabili
  `SMTP_*` e `MAIL_TO_*` (placeholder in `forms-backend-audit.md` §7.3).
- Sostituire `lead.php` v1 con la v2 che:
  - legge `requestType`/`audience`,
  - routa al `MAIL_TO_*` corretto,
  - usa PHPMailer + SMTP autenticato,
  - implementa honeypot e rate limit,
  - risponde JSON.
- Aggiornare `VisitorCarnetForm` e `FoodRadarSuggestionForm` per leggere
  la response JSON e distinguere success vero da errore (rimuovere
  `.catch(() => undefined)`).
- Test invio reale verso 2 destinatari (Gmail + Outlook) prima del
  go-live pubblico.
- Privacy: pagine `/privacy` e `/cookie` allineate al backend reale
  (parlate di `mail()` ricevuta? consenso registrato?). Già ripulite
  nello sprint editoriale precedente.

### 6.5 Test post-deploy

- Homepage caricata, hero scroll-bound visibile, CTA cliccabili.
- 11 pagine interne aprono senza 404.
- Header sticky e mobile menu OK su iPhone reale.
- Footer link Privacy/Cookie funzionanti, link telefonici tappabili.
- LeadMiniForm: submit reale → email ricevuta + Reply-To corretto.
- VisitorCarnetForm: submit reale → email a casella visitatori.
- FoodRadarSuggestionForm: submit reale → email a casella diario.
- Pagina Diario del Sud renderizza i 30 item con immagine/badge mancanti
  se applicabili.
- Lighthouse desktop ≥ 90/95/95/95.
- Lighthouse mobile ≥ 80/90/90/90.
- 404 custom (Next export crea automaticamente `out/404.html`).
- OG image preview su Slack, WhatsApp, Twitter (test con
  `metatags.io`).

### 6.6 Backup e rollback

- Prima dell'upload: **scaricare** via SFTP la `htdocs/` esistente in
  `backup/htdocs-YYYY-MM-DD.zip`.
- Mantenere su Git tag `release/YYYY-MM-DD` per ogni deploy.
- Per rollback: ripristinare cartella di backup via SFTP, sovrascrivendo.
- Conservare ultime 3 release in `backup/`.
- Backup mailbox Aruba: attivare backup automatico dal pannello, non
  perdere il primo follow-up con un lead.

---

## 6-bis. Email su Google Workspace (scelta del progetto)

Decisione: le caselle `info@vinisud.it`, `buyer@vinisud.it`,
`espositori@vinisud.it`, `media@vinisud.it`, `visitatori@vinisud.it`,
`diario@vinisud.it`, `partnership@vinisud.it`, `grandprix@vinisud.it`
sono ospitate su **Google Workspace**, non su mail Aruba. Aruba serve
solo come hosting dei file statici e dell'endpoint PHP.

### 6-bis.1 DNS

Sul pannello Aruba (Domain → Gestione DNS), impostare:

| Tipo | Nome | Valore | TTL |
|---|---|---|---|
| MX | @ | `1 ASPMX.L.GOOGLE.COM` | 3600 |
| MX | @ | `5 ALT1.ASPMX.L.GOOGLE.COM` | 3600 |
| MX | @ | `5 ALT2.ASPMX.L.GOOGLE.COM` | 3600 |
| MX | @ | `10 ALT3.ASPMX.L.GOOGLE.COM` | 3600 |
| MX | @ | `10 ALT4.ASPMX.L.GOOGLE.COM` | 3600 |
| TXT (SPF) | @ | `v=spf1 include:_spf.google.com ~all` | 3600 |
| TXT (DKIM) | `google._domainkey` | (chiave generata da Workspace Admin → Apps → Google Workspace → Gmail → Authenticate email) | 3600 |
| TXT (DMARC) | `_dmarc` | `v=DMARC1; p=none; rua=mailto:postmaster@vinisud.it; pct=100` (poi dopo 30 giorni `p=quarantine`) | 3600 |

> Se decidi di tenere anche `mail()` PHP nativo Aruba come fallback,
> SPF diventa `v=spf1 include:_spf.google.com include:_spf.aruba.it ~all`.
> Con la scelta consigliata (PHP usa SMTP Google), la `include:_spf.aruba.it`
> non serve.

### 6-bis.2 SMTP per i form

Configurare PHPMailer per parlare con Gmail SMTP:

```
SMTP_HOST = smtp.gmail.com
SMTP_PORT = 465   (SMTPS) oppure 587 (STARTTLS)
SMTP_SECURE = ssl   (con 465) oppure tls (con 587)
SMTP_AUTH = true
SMTP_USER = noreply@vinisud.it   (casella dedicata su Workspace)
SMTP_PASS = (App Password generata in https://myaccount.google.com/apppasswords,
            richiede 2FA attivo sulla casella)
```

Tutte queste variabili **fuori dal repo**, in `/htdocs/forms/config.php` o
in variabili ambiente Apache (`SetEnv` via `.htaccess`).

### 6-bis.3 Limiti pratici Gmail SMTP

- ~2.000 email/giorno per casella (sufficiente con margine per Vini Oli Sud).
- Se in futuro servisse di più: passare a Google Workspace SMTP Relay
  Service (gratis, da abilitare in Admin → Apps → Google Workspace →
  Gmail → Routing → SMTP relay service; consente fino a 10.000/giorno/utente
  e supporta IP allow-list).
- Niente firma DKIM aggiuntiva: Google firma in uscita con la chiave del
  dominio impostata in §6-bis.1.

### 6-bis.4 Vantaggi rispetto a mail() Aruba

- Reputazione mittente: SMTP autenticato Google → tasso di consegna in
  inbox praticamente totale su Gmail/Outlook/Yahoo.
- Log e tracciamento: ogni invio è visibile in Postmaster Tools Google e
  nei log Workspace Admin.
- Sicurezza: 2FA + App Password limita il blast radius se la password
  venisse esposta (revocabile in 1 click).
- Niente più dipendenza dalla configurazione `sendmail` del piano Aruba.

---

## 7. Gestione form su Aruba

Riassunto operativo, dettaglio in `docs/forms-backend-audit.md`.

| Form | Endpoint | Trasporto | Destinatario consigliato | Stato attuale |
|---|---|---|---|---|
| `LeadMiniForm` (`/contatti`) | `/forms/lead.php` | POST HTML form | per ora `info@vinisud.it`; v2: routing per `interest` | **funzionante** (con PHP `mail()` attivo) |
| `VisitorCarnetForm` (`/visitatori`) | `/forms/lead.php` | POST FormData fetch | `MAIL_TO_VISITATORI` | **non invia nulla oggi** |
| `FoodRadarSuggestionForm` (`/diario-del-sud`) | `/forms/lead.php` | POST FormData fetch | `MAIL_TO_DIARIO` | **non invia nulla oggi** |

**Mossa minima per andare in produzione "onesti":**

1. Sostituire `lead.php` con versione v2 (PHPMailer + SMTP + routing).
2. Aggiornare i 3 form per leggere JSON di risposta.
3. Configurare SPF/DKIM/DMARC su `vinisud.it`.
4. Caricare credenziali SMTP in `htdocs/forms/config.php` (fuori repo).
5. Smoke test su tutti e 3 i form prima di pubblicizzare il dominio.

---

## 8. Rischi e mitigazioni

| Rischio | Probabilità | Impatto | Mitigazione |
|---|---|---|---|
| Form visitatori/diario continuano a non inviare dopo go-live | alta se nulla viene fatto | alto (perdita lead, danno reputazionale) | implementare `lead.php` v2 e rimuovere `.catch(() => undefined)` |
| Email finite in spam (SPF/DKIM assenti) | alta | alto | configurare SPF, DKIM, DMARC sul dominio prima del lancio |
| Spam massivo sui form (no honeypot/rate limit) | alta entro 30 giorni dal lancio | medio | honeypot + rate limit + opzionale Turnstile su submit ripetute |
| Hero image troppo pesante su 4G | media | medio (LCP) | comprimere a WebP/AVIF, servire mobile.jpg davvero ridotto |
| Aggiornamento Next 17 introduce breaking change | media (12+ mesi) | medio | pianificare ciclo upgrade ogni 6 mesi; tenere `engines.node` ancorato |
| Aruba SLA per `mail()` non garantito | bassa-media | alto | usare SMTP autenticato Aruba con PHPMailer (non `mail()`) |
| Dead code (`videos.ts`, `EditorialPreview`, `RegionsSection`) confonde futuri contributor | bassa | basso | rimuoverlo o documentarlo in un commento di testa |
| Manca `engines`/`.nvmrc` → drift di versione Node tra dev e CI | media | basso-medio | aggiungere `"engines": { "node": ">=20 <23" }` e `.nvmrc` con `20` |
| Manca `sitemap.xml`/`robots.txt` | certa | medio (SEO) | generare prima del deploy |
| Niente prova di consenso GDPR sui form | media | medio-alto (richieste interessati) | loggare timestamp + IP hash + versione policy |
| `BrandLogo` carica `Image` con `unoptimized` ma `width=5000` → byte serviti grandi | bassa | medio | ridimensionare la `logo-horizontal-cropped.png` a 2x dimensione massima reale (es. 1024px) |

---

## 9. Raccomandazione finale

**Scenario consigliato: SCENARIO C — Ibrido statico + PHP**.

**Motivazione**:
- Aruba Hosting Linux è incluso nei piani entry-level e supporta tutto
  ciò che serve (HTTP statico + PHP + mail). Costo minimo, complessità
  minima.
- Il sito è nativamente esportabile come statico: nessuna feature
  dinamica giustificherebbe Node.
- L'endpoint PHP esiste già: serve solo "completarlo" (v2 con
  PHPMailer + routing + protezioni), non sostituirlo con un'API route
  Next che richiederebbe il VPS.
- La gestione operativa è alla portata di personale non sviluppatore una
  volta che la pipeline è in piedi: aggiungere un nuovo contenuto al
  Diario è un commit; aggiornare copy è un edit in `src/data/*.ts`; il
  resto è un FTP sync di `out/`.

**Cosa va preparato prima di migrare**:
1. Sostituire `public/forms/lead.php` con versione v2 + caricare
   PHPMailer.
2. Configurare SPF + DKIM + DMARC sul dominio.
3. Creare le 6–8 caselle email destinatarie (`info@`, `buyer@`,
   `espositori@`, `media@`, `visitatori@`, `diario@`,
   `partnership@`, `grandprix@`) e popolare `config.php` su server.
4. Aggiornare i 3 form per leggere JSON e gestire errori reali.
5. Generare `sitemap.xml` + `robots.txt` da posare in `public/`.
6. Aggiungere `output: 'export'` e `images.unoptimized: true` in
   `next.config.ts`.
7. Test completo locale + smoke test 3 form post-deploy.

**Cosa è rischioso**:
- Mettere online il sito senza fixare i 2 form attualmente "muti": è il
  rischio reputazionale numero uno.
- Lasciare email mittente `noreply@vinisud.it` senza DKIM: tasso di
  spam-folder altissimo.
- Caricare `node_modules` o `src/` sul server per errore: aumenta
  superficie di attacco e tempi di sync.

---

## 10. Piano operativo (5 step per andare online)

### Step 1 — Backend form v2 (1 giorno)
- Riscrivere `lead.php` con PHPMailer + SMTP Aruba + routing per
  `requestType`/`audience`/`interest` + honeypot + rate-limit + JSON
  response.
- Aggiornare `VisitorCarnetForm` e `FoodRadarSuggestionForm` per
  parsare `{ok, error}` e mostrare errori reali.
- Test in locale con `php -S 127.0.0.1:8081 -t public` + un account
  SMTP di staging.

### Step 2 — Hardening editoriale & SEO (mezza giornata)
- Rimuovere dead code (`videos.ts`, `EditorialPreview`,
  `RegionsSection`) o documentarlo.
- Generare `public/sitemap.xml` + `public/robots.txt`.
- Aggiungere `engines.node` e `.nvmrc` in repo.
- Verificare e comprimere `public/images/home/tavola-scroll-*.jpg`
  (target ≤ 250 KB mobile, ≤ 500 KB desktop).

### Step 3 — Provisioning Aruba (mezza giornata)
- Acquistare/attivare piano Hosting Linux Aruba con PHP 8.x.
- Configurare dominio `vinisud.it` + `www` + SSL.
- Configurare SPF + DKIM + DMARC.
- Creare le caselle destinatarie elencate sopra.
- Posare `config.php` con SMTP + MAIL_TO fuori dalla webroot.
- Installare PHPMailer (composer o upload diretto).

### Step 4 — Build statico & deploy (2 ore)
- `output: 'export'` + `images.unoptimized: true` in
  `next.config.ts`.
- `npm run build` → verifica `out/`.
- Smoke test locale (`npx serve out`).
- Sync SFTP di `out/` in `htdocs/` Aruba.
- Caricare `.htaccess` con redirect HTTPS + cache headers.
- Tag Git `release/YYYY-MM-DD`.

### Step 5 — Smoke test produzione & monitoring (2 ore)
- Tutte le pagine aperte da incognito.
- Submit reale su tutti e 3 i form, verifica email arrivata.
- Lighthouse desktop + mobile sulle 3 pagine chiave (home, /grand-prix,
  /diario-del-sud).
- OG preview tools (`metatags.io`).
- Backup `htdocs/` post-deploy.
- Annunciare il dominio quando i form sono confermati funzionanti.

---

## 11. Sintesi backend form

- **Endpoint**: `/forms/lead.php` (PHP nativo, `mail()`).
- **Destinatario unico oggi**: `info@vinisud.it`, hardcoded.
- **Form OGGI funzionante**: `LeadMiniForm` su `/contatti`.
- **Form OGGI non funzionanti**: `VisitorCarnetForm` (visitatori),
  `FoodRadarSuggestionForm` (Diario del Sud). L'utente vede success ma
  l'email non parte.
- **Causa tecnica**: il PHP esige `fullname`/`company`/`privacy_consent`
  che i due form custom non inviano; risponde "errore", la fetch ignora
  con `.catch(() => undefined)`, il `finally` setta `success`.
- **Soluzione**: `lead.php` v2 che accetta payload diversi in base a
  `requestType`, instrada al `MAIL_TO_*` corretto, usa PHPMailer + SMTP
  autenticato Aruba, restituisce JSON.
- **Prima di andare online**: questi due form vanno fatti funzionare
  davvero, oppure rimossi temporaneamente per non perdere lead silenziosamente.

---

## Appendice — Note operative minori

- **`.gitignore`**: già esclude `node_modules`, `.next`, `out`, `.env*`
  (default Next). OK.
- **Build cache**: `.next/cache/` può essere grande, non va caricato su
  Aruba. Vedere `.gitignore`.
- **Credenziali**: nessun segreto è presente nel repo al momento. Tutte
  le variabili future (`SMTP_*`, `MAIL_TO_*`, `GITHUB_PAT` per il
  bridge Apps Script) vanno gestite fuori dal repository.
- **CI**: nessuna pipeline CI configurata oggi. Per la fase di lancio
  non è critica; può venire dopo, in un'iterazione 2 con GitHub
  Actions.
