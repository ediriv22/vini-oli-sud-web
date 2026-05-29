# WEBSITE_BLUEPRINT

## Posizionamento

Vini Oli Sud deve presentarsi come boutique mediterranea premium dedicata a vini, oli e cultura del Sud Italia, in connessione strategica con il Napoli Racing Show / Gran Premio di Napoli. Non una fiera generalista e non una replica di eventi esistenti: il posizionamento unisce territorio, business hospitality, desiderabilità e autorevolezza editoriale.

## Target

- Espositori: produttori, consorzi, brand e aziende che cercano visibilità commerciale e lead qualificati.
- Buyer e operatori: professionisti interessati a scouting, relazioni e accesso ordinato all’offerta del Sud Italia.
- Visitatori: pubblico interessato a degustazione, esperienza e narrazione mediterranea.
- Media: giornalisti, redazioni, PR e stakeholder che hanno bisogno di materiali pronti e affidabili.
- Sponsor / Partner: soggetti interessati a visibilità, co-branding e relazioni di posizionamento.
- Grand Prix Magna Grecia: area dedicata alla valorizzazione di prodotti e riconoscimenti (Albo d’Oro 2025 già validato).
- Diario del Sud: asse editoriale e SEO del progetto.

## Sitemap

- `/`
- `/evento`
- `/espositori`
- `/buyer`
- `/visitatori`
- `/grand-prix`
- `/diario-del-sud`
- `/media`
- `/contatti` (ospita il form unico `#richiesta-informazioni`)
- `/privacy`
- `/cookie`

## Tono di voce

- B2B: diretto, orientato a ROI, lead, networking e visibilità commerciale.
- B2C: sensoriale, evocativo, mediterraneo ma non folkloristico.
- Media/Istituzioni: chiaro, credibile, pronto alla pubblicazione.

## CTA principali (post sprint conversione)

Tutte le CTA operative atterrano sul mini form unico in `/contatti#richiesta-informazioni`, con query string `?interesse=` per pre-selezionare l’area:

- `Richiedi la Brochure Espositori` → `/contatti?interesse=espositori#richiesta-informazioni`
- `Richiedi il Pass Buyer` → `/contatti?interesse=buyer#richiesta-informazioni`
- `Richiedi aggiornamenti visitatori` → `/contatti?interesse=visitatori#richiesta-informazioni`
- `Richiedi informazioni media` → `/contatti?interesse=media#richiesta-informazioni`
- `Proponi una Partnership` → `/contatti?interesse=partnership#richiesta-informazioni`
- `Richiedi informazioni Grand Prix` → `/contatti?interesse=grand-prix#richiesta-informazioni`
- `Esplora il Programma` → `/evento` (link informativo, non operativo)
- `Esplora l’Albo d’Oro` → `/grand-prix`

CTA esplicitamente rimosse o riformulate per non promettere flussi inesistenti:
- “Scarica il Media Kit” → diventa “Richiedi informazioni media”.
- “Iscrivi il tuo prodotto al Grand Prix” → diventa “Richiedi informazioni Grand Prix”.
- “Acquista il Carnet” / “Ticket” → non presenti finché il programma pubblico non sarà confermato.

## Componenti creati

- `Header`
- `Footer`
- `BrandLogo`
- `HeroSection`
- `EditionStrip` (nuovo — fascia coordinate edizione 2026 in homepage)
- `AudienceGateway`
- `ConceptSection`
- `RegionsSection`
- `EditorialPreview`
- `GrandPrixHighlight` (nuovo — sintesi Albo d’Oro 2025 in homepage)
- `GrandPrixWinners` (pagina `/grand-prix`)
- `CtaBand`
- `InternalPageTemplate`
- `LeadMiniForm` (nuovo — form dimostrativo unico per tutte le aree di interesse)
- `Button`
- `Card`
- `SectionHeader`

## Stato form lead

- `LeadMiniForm` è fully operativo e invia dati reali via HTTP POST a `/forms/lead.php`.
- Endpoint PHP: `public/forms/lead.php` — validazione, sanitizzazione, invio email a `info@vinisud.it` con Reply-To header.
- Campi form: `fullname`, `company`, `email`, `website` (opt), `interest`, `message` (opt), `privacy_consent` (required).
- Validazione backend: nome, ragione sociale, email (obbligatori e validi), privacy checkbox (obbligatorio).
- Sanitizzazione: `htmlspecialchars()` per XSS protection, `filter_var()` per email validation, `@mail()` con headers sicuri.
- Risposta utente: pagina HTML con messaggio di successo ("Richiesta ricevuta...") o errore ("Controlla i campi obbligatori...") + link back.
- Microcopy form: «Compila il modulo: la segreteria di Vini Oli Sud ricontatterà i profili interessati per eventuali approfondimenti.»
- Routing query param: `/contatti?interesse=espositori` pre-popola select (valore di default: "espositori").

## Asset checklist

- logo, favicon
- hero images / video (asset video tenuti in locale, non versionati finché non c’è una selezione ottimizzata)
- wine imagery
- olive oil imagery
- motorsport imagery
- media kit files — non ancora disponibili
- brochure espositori — non ancora disponibile
- brochure buyer — non ancora disponibile
- sponsor deck — non ancora disponibile

> Riferimenti a “Lungomare” esclusi dai contenuti pubblici fino a conferma della venue.

## Arura Deployment Checklist

Prima di deplomare su Arura hosting (vinisud.it):

1. **PHP Mail Configuration**
   - Verificare che PHP `mail()` function sia abilitata nel server (contact Arura support se necessario)
   - Configurare SPF/DKIM/DMARC records per evitare spam filtering (consultare Arura documentation)
   - Test: submitire form da localhost verso endpoint remoto per verificare email delivery

2. **Static File Serving**
   - `public/forms/lead.php` sarà servito da Arura come file PHP statico
   - Ensure Arura web server (Apache/Nginx) è configurato per eseguire PHP in `public/` directory
   - Se necessario, creare `.htaccess` per routing (non solitamente necessario per static PHP)

3. **Form Testing**
   - Test form submission con dati validi → verificare email ricevuta in `info@vinisud.it`
   - Test form submission con dati incompleti → verificare messaggio d'errore
   - Verificare that success/error pages rendono correttamente su tutti i browser
   - Verificare that links to homepage/back navigation funzionano

4. **Email Headers**
   - Verificare che `Reply-To` header sia correttamente impostato su email dell'utente
   - Verificare che `From` header sia impostato a `noreply@vinisud.it`
   - Verificare che Subject line includa area di interesse (es. “Nuova richiesta Vini Oli Sud - espositori”)

5. **Credentials & Security**
   - No credentials are hardcoded in `public/forms/lead.php` (email address is not a credential)
   - All user inputs are sanitized (`htmlspecialchars()`, `filter_var()`)
   - CSRF protection: HTML form uses standard POST (browser provides CSRF protection via same-origin policy)

## Roadmap sprint successivi

- Sprint 2 (completato): collegare `LeadMiniForm` a un endpoint reale PHP (`public/forms/lead.php`) con validazione, sanitizzazione, invio email a `info@vinisud.it`.
- Sprint 2 (futuro): architettura dettagliata della pagina `/evento` (programma, format, esperienze) una volta confermati gli elementi operativi.
- Sprint 3: sezione editoriale `/diario-del-sud` con listing articoli, categorie e template article page.
- Sprint 3: kit media scaricabile reale, gallery ufficiale e press room aggiornata.
- Sprint 4: integrazione CRM / marketing automation / tracking conversioni (event tracking sulle 6 aree di interesse).
- Sprint 4: SEO avanzata (`sitemap.ts`, `robots.ts`, JSON-LD Event + Organization), OG image dedicate, performance tuning.

## Da verificare

- Date ufficiali dell’evento (non pubblicare in homepage finché non confermate).
- Venue (non citare “Lungomare” o località specifiche fino a conferma).
- Patrocini e sponsor (non inserire placeholder generici nelle pagine pubbliche).
- Regolamento, categorie e criteri delle edizioni successive del Grand Prix Magna Grecia.
- Buyer program, materiali stampa ufficiali, deck partnership.
- Programma pubblico per visitatori (carnet, ticketing, esperienze).

## Dati validati e già pubblicati

- Grand Prix Magna Grecia 2025 — Albo d’Oro: 10 riconoscimenti, 236 vini valutati, oltre 70 aziende partecipanti. Fonte: NapoliVillage. Vincitori in `src/data/winners.ts`, bollini in `public/grand-prix/badges/`.
- Recapiti segreteria organizzativa A.S.D. Napoli Racing Show: email `napoliracingshow@gmail.com`, PEC `asdnapoliracingshow@pec.it`, telefoni `3295535164` e `3276616294`, P.IVA `10430641216`, C.F. `95334510633`.
- Contatto progetto: `info@vinisud.it`.

## Nota asset video

- Catalogo tecnico disponibile in `src/data/videos.ts`.
- I file video sorgente restano in percorsi locali esterni al repository e non vengono versionati in questa fase.
- I naming placeholder previsti per una futura integrazione ottimizzata sono `public/videos/hero-vigneti.mp4`, `public/videos/hero-vino.mp4` e `public/videos/hero-poster.jpg`.
