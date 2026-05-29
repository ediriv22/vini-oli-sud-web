# Review Demo VINISUD

> **Aggiornamento 2026-05-15 — Sprint conversione applicato.** Le criticità #1, #5, #6, #7, #8 (parziale) e gli interventi su CTA non oneste sono state affrontate. In particolare: mini form unico `LeadMiniForm` in `/contatti#richiesta-informazioni` con query `?interesse=`, fascia `EditionStrip` (Edizione 2026 · Napoli · Napoli Racing Show / Gran Premio di Napoli), `GrandPrixHighlight` con 10 riconoscimenti / 236 vini / 70+ aziende, header CTA visibile da `md:` con label compatta, tagline consolidate a `primary` + `institutional`, menu "Grand Prix Prima Edizione" → "Grand Prix" (pagina interna eyebrow "Grand Prix · Prima Edizione"). Restano aperte le criticità #2 (date/venue), #3 (evento in attivazione), #4 (proof aggiuntivi), #9 (benefit operativi), #10 (limature di tono).

Review condotta su `main` (commit `fdd324f`) il 2026-05-15.
Build e lint eseguiti con esito positivo:
- `npm run lint` → 0 errori
- `npm run build` → 14 pagine statiche generate, compilazione OK

Analisi basata su: `src/app/*`, `src/components/*`, `src/data/{site,pages,navigation,winners,videos}.ts`, `src/app/globals.css`, `public/*`, `docs/*`.

---

## 1. Valutazione sintetica

| Area | Voto | Note rapide |
| --- | :---: | --- |
| Brand positioning | **7.0** | Lessico premium, palette mediterranea coerente, ma identità diluita su 5 tagline. |
| Homepage | **5.5** | Quattro sezioni ben fatte, mancano prove, date, luogo, Grand Prix e regioni. |
| UX / navigation | **6.0** | Header solido e accessibile, ma hamburger sotto 1280px e CTA primaria nascosta su mobile. |
| Copywriting | **6.5** | Italiano alto, evocativo. Manca asse benefit/proof; alcune formule scivolano nel folklore. |
| Conversione Espositori | **4.0** | Tre clic per arrivare a una mail. Nessun form, nessuna brochure scaricabile, zero proof. |
| Conversione Buyer | **3.5** | Stesso problema, aggravato dall'assenza di criteri di accesso, deadline e benefit operativi. |
| Mobile | **6.5** | Layout fluido, ma hero pesante, CTA in header invisibile, tagline dell'eyebrow troncata. |
| SEO | **5.0** | Metadata base e static export ottimi, ma nessuno JSON-LD, no sitemap.xml/robots.txt, H1 brand-centrici. |
| Credibilità premium | **6.0** | Estetica c'è, ma manca tutto ciò che la regge: date, venue, edizione, partner, numeri, foto reali. |

**Voto medio: 5.6 / 10** — Demo elegante ma ancora in modalità "brand statement", non in modalità "evento che vende".

---

## 2. Cosa funziona bene

- **Identità visiva**. Palette (aglianico, oliva, mare, avorio), texture parchment/linen, gradienti caldi e tipografia Cormorant + Montserrat costruiscono un look genuinamente boutique mediterraneo, lontano dal SaaS e dalla fiera generica.
- **Sistema di design coerente**. `card-shell`, `card-theme-*`, `section-shell`, `panel`, `eyebrow`, `display-balance`: l'architettura CSS è ordinata, riutilizzabile e già pronta per crescere.
- **Data layer centralizzato**. Tutti i contenuti sono in `src/data/*` con tipi (`StaticPageContent`), pronto per migrazione CMS senza riscrivere componenti.
- **Accessibilità di base curata**. Skip link, `aria-expanded`/`aria-controls` sull'hamburger, `inert` quando il menu è chiuso, focus visibili, supporto `prefers-reduced-motion`.
- **Header sticky con micro-interazioni**. Logica di apertura/chiusura del menu mobile robusta (pointerdown, escape, breakpoint change). Codice di qualità.
- **Build pulita**. Lint 0 errori, 14 pagine statiche prerenderizzate, Turbopack < 2s. Niente JS lato client se non sull'header e su tre componenti puntuali.
- **Onestà sui dati**. Le note "in fase di attivazione" e i blocchi "Da verificare" su evento e Grand Prix tutelano il progetto da promesse infondate. Approccio corretto.
- **Grand Prix Albo d'Oro**. È l'unico vero asset di credibilità della demo: 10 vincitori reali, con fonte (NapoliVillage) e bollini ufficiali. Va valorizzato molto di più.
- **Footer informativo e legalmente solido**. Email progetto, segreteria, PEC, P.IVA, C.F., privacy e cookie: trasparenza completa.
- **Hero video + poster fallback**. Pattern corretto (poster, `preload="metadata"`, `motion-reduce:hidden`).

---

## 3. Problemi critici da correggere subito

Ordinati per impatto su conversione e credibilità.

1. **Nessun form di contatto. Da nessuna parte.** Ogni CTA ("Richiedi la Brochure Espositori", "Richiedi il Pass Buyer") porta a una pagina di copy che a sua volta rimanda a `/contatti`, che è una scheda con tre `mailto:`. Tre clic prima di poter scrivere. Conversione attesa: catastrofica.
2. **Nessuna data, nessun venue, nessuna edizione.** Il sito non risponde a "quando?" né "dove?". Per un evento, è disqualificante. Su mobile uno scroll della homepage non incontra mai una data.
3. **L'evento sembra non esistere ancora.** Tutto è "in fase di attivazione", "format da raccontare", "verrà inserito". Letto da un buyer o espositore, il messaggio è: "non siete pronti, tornate più avanti". Il Grand Prix 2025 invece esiste già: l'incoerenza è disorientante.
4. **Homepage senza proof.** Niente numeri, niente loghi partner, niente patrocini, nessuna foto reale, nessun nome di produttore o buyer, nessun riferimento a edizioni precedenti. Solo concept astratto. Una landing premium senza prove non converte.
5. **Grand Prix Magna Grecia sepolto.** L'unico vero asset di credibilità (Casa Setaro, Marisa Cuomo, Tenuta Cavalier Pepe, Leone De Castris, ecc.) è raggiungibile solo cliccando una voce di menu chiamata "Grand Prix Prima Edizione". Andrebbe in homepage come prova sociale dell'autorevolezza editoriale.
6. **Tagline confusa: cinque varianti contemporanee.** `taglines.primary/secondary/institutional/commercial/agora`. Hero usa una, footer un'altra, header una terza. Identità diluita e dissonante.
7. **CTA primaria invisibile su mobile.** Il bottone "Richiedi la Brochure Espositori" è `hidden ... lg:flex`: sotto i 1024px sparisce dall'header. Il visitatore mobile deve aprire l'hamburger per trovarla. Su un sito eventi (mobile-first per definizione) è un errore grave.
8. **Pagine interne tutte uguali.** `InternalPageTemplate` è applicato identico a Espositori, Buyer, Visitatori, Evento, Media, Grand Prix, Diario del Sud: stesso hero, stesso side-panel "Posizionamento", stessa CTA in centro, stesse 3 card "Evoluzione contenutistica". A colpo d'occhio sembrano clonate. Il buyer non legge nulla di diverso dall'espositore.
9. **Copy senza benefit chiari per chi paga.** Pagina Espositori parla di "vetrina premium", "racconto online", "presenza riconoscibile": tutte qualità vaghe. Manca: cosa contiene il pacchetto, chi sono i buyer presenti, quanto traffico portate, tariffe (o range), deadline iscrizione. Stesso problema sulla pagina Buyer.
10. **Tono che scivola nel folklore in più punti.** "L'Adrenalina del Futuro", "Scende in Pista", "L'Agorà del Sud da Gustare e Vivere", "Profezia Liquida", "Memoria Liquida": al limite del kitsch. Funziona in piccole dosi, ma ripetuto cinque volte indebolisce la promessa premium.

---

## 4. Migliorie consigliate

### Homepage
- Aggiungere subito sotto l'hero una **fascia "Edizione 2026"** (o anno corrente) con: data, città, venue, audience attesa, patrocini. Anche con placeholder espliciti "Date in conferma".
- Inserire in homepage **due sezioni già esistenti ma non collegate**: `RegionsSection` (le 8 regioni rendono concreta la geografia) e una sintesi del **Grand Prix Albo d'Oro** (3-4 vincitori top come prova).
- Inserire un blocco **"Chi era presente / chi ha vinto"** con i nomi reali dei 10 produttori 2025, sotto forma di muro tipografico (no badge, troppo cluster).
- Aggiungere una **fascia "Patrocinato / In collaborazione con"** anche se in placeholder ("Sponsor in conferma — partner istituzionali in fase di accordo").
- Il `ConceptSection` è bello ma ipertrofico: ridurre i 4 pillar a 3, e spostarlo dopo la fascia proof.
- Aggiungere micro-FAQ "Cos'è Vini Oli Sud" / "Per chi" / "Quando" in formato testuale: utili sia per UX che per AEO (citazioni LLM).

### Espositori
- Sostituire il template generico con una **pagina di lead generation vera**: H1 orientato al beneficio, 3 motivi misurabili per esporre, 3 formati di partecipazione (anche placeholder: Boutique / Standard / Featured), una preview del kit visivo, FAQ, **form on-page** con campi minimi (Azienda, Referente, Email, Telefono, Categoria — vino / olio / consorzio / altro).
- Aggiungere **deadline di iscrizione** anche generica ("Iscrizioni aperte fino a Q3 2026 — Da verificare").
- Mostrare un **estratto della brochure** (3-4 slide statiche in PDF) anche prima di lasciare la mail. Lead magnet leggero.
- Aggiungere blocchi **"Chi cerchiamo"** (cantine, frantoi, consorzi, distillerie...) e **"Cosa non cerchiamo"** (criterio di selezione = posizionamento premium).

### Buyer
- Definire l'**ICP buyer** in modo esplicito: Ho.Re.Ca. fine dining, importatori UE, retail premium, e-commerce specializzato, sommelier.
- Aggiungere **benefit operativi concreti**: incontri 1:1 prenotabili, agenda personalizzata, accreditamento gratuito, transfer/ospitalità (se previsti), accesso area degustazione riservata, area B2B.
- Mostrare **chi ci sarà**: anche solo "8 regioni, 60+ produttori in selezione" (range a placeholder, dichiarare "Da verificare").
- Form Pass Buyer on-page con: Azienda, Ruolo, Canale, Paesi di operatività, Tipologia di prodotti cercati, Note. Riduce friction e qualifica già il lead.

### Visitatori
- Inserire **call to action ticketing** (anche solo "Iscriviti per essere avvisato all'apertura dei carnet"), per costruire una lista email anticipata.
- Suggerire **3 esperienze tipo** (es. degustazione guidata olio, masterclass vino, percorso show cooking) in card distinte — anche con copy placeholder.
- Mantenere il tono caldo della pagina ma ridurre il registro lirico in favore di "cosa farai".

### Media
- Aggiungere una **press room reale**: anche solo 1 PDF cartella stampa, 3 immagini hi-res scaricabili (logo pack), un comunicato annuncio.
- Form accredito stampa on-page.
- Sezione **"Hanno parlato di noi"** con l'articolo NapoliVillage del Grand Prix 2025 e ogni altra menzione (anche locale): è una prova reale.

### Header / Footer
- **CTA primaria visibile da `sm:` in su**, non solo `lg:`. Su tablet/mobile va mostrata almeno l'icona compatta.
- Voce di menu "Grand Prix Prima Edizione" è troppo lunga e ambigua: rinominare in "Grand Prix" e gestire "Prima Edizione 2026" come eyebrow nella pagina, oppure "Albo d'Oro".
- Footer: ridurre i 3 pulsanti CTA a 2 (Brochure + Pass Buyer), spostare "Scopri il percorso media" tra i link testuali del menu rapido.
- Aggiungere al footer: **social** (almeno Instagram), eventuale **newsletter** ("Iscriviti al Diario del Sud").
- Aggiungere una mini-mappa o l'indirizzo del venue, anche placeholder.

### Mobile
- Hero attuale: H1 in `clamp(2.4rem, 11vw, 3.6rem)` + paragrafo lungo + figura `min-h-[24rem]` → fold mobile saturato. Ridurre min-h della figure a 18-20rem sotto `sm:`.
- L'eyebrow del logo ("Le eccellenze della Magna Grecia") è `hidden ... sm:flex`: ok, ma considerare di mostrare almeno un puntino ornamentale per coerenza.
- Le card del gateway sono già responsive ma il "01 — Espositori" si perde sopra il titolo: aumentare il contrasto del numero.
- Hamburger compare sotto 1280px (`xl:hidden`). Sotto laptop 13" / 14" il sito apre l'hamburger anche su desktop. Spostare a `lg:hidden` (1024px).

### SEO
- Aggiungere **`sitemap.xml`** (route `app/sitemap.ts`) e **`robots.txt`** (`app/robots.ts`).
- Aggiungere **JSON-LD Event** sulla homepage e sulla pagina `/evento` (con `eventStatus: EventScheduled`, `location`, `organizer`, `offers`) anche con valori placeholder marcati "Da verificare".
- Aggiungere **Organization** schema con `legalName`, `email`, `telephone`, `address`, `vatID`.
- Ottimizzare i titoli: l'attuale `default: siteConfig.name` = "Vini Oli Sud" è poco SEO-friendly. Usare "Vini Oli Sud — Salone Boutique dei Vini e Oli del Sud Italia | Napoli 2026".
- Sostituire alcuni H1 brand-centrici ("L'evento", "Diario del Sud") con varianti che includono parole chiave reali ("L'evento dei vini e oli del Sud Italia — Edizione 2026").
- Aggiungere `<link rel="canonical">` esplicito su tutte le pagine.
- Aggiungere **BreadcrumbList** schema sulle pagine interne (anche se in URL piatti).

### Performance
- Tre web font caricati (Cormorant, Montserrat, Source Sans 3) = ~3 famiglie. Valutare se Source Sans 3 sia necessario o se Montserrat possa coprire ui + body.
- Convertire `hero-vigneto.mp4` (peso non noto) in `.webm` AV1/VP9 + fallback `.mp4`, e generare versione mobile più leggera (`media="(max-width: 640px)"`).
- Aggiungere `loading="lazy"` esplicito alle immagini sotto la fold (`Image` lo fa di default su Next, ma verificare i badge Grand Prix).
- Aggiungere `Cache-Control` long-lived sui media statici (gestito da Netlify, ma documentare).

### Copy
- Scegliere **una sola tagline** istituzionale (suggerita: *"Le eccellenze del Sud Italia, in un salone boutique mediterraneo"*) e usarla coerentemente. Le altre quattro vanno archiviate.
- Sostituire "L'Adrenalina del Futuro" con qualcosa di meno SaaS-pubblicitario (es. *"Vino, olio e cultura del Mezzogiorno in un palcoscenico contemporaneo"*).
- "Profezia Liquida" / "Memoria Liquida": eliminare le formule barocche. Tono premium ≠ tono profetico.
- Standardizzare la nomenclatura: "Magna Grecia" oppure "Mezzogiorno" oppure "Sud Italia". Oggi compaiono tutti e tre, spesso nella stessa pagina.
- "Buyer e operatori" come eyebrow funziona, ma il titolo "Il tuo accesso ai migliori terroir del Sud Italia" sa di brochure 2008. Più diretto: *"L'accesso curato ai produttori del Sud, in un solo luogo, in tre giorni"*.
- Trasformare la CTA terziaria "Esplora il Programma" in CTA visibile (bottone secondario) appena ci sarà un programma reale.

---

## 5. Quick wins

Modifiche semplici (≤ 1 giornata di lavoro) ad alto impatto.

1. **Mostrare la CTA "Richiedi la Brochure Espositori" anche su mobile** (rimuovere `hidden ... lg:flex` dal Header). +1 settore conversioni.
2. **Inserire in homepage una fascia data/venue** anche placeholder, subito dopo l'hero. Risolve l'obiezione "non capisco quando/dove".
3. **Aggiungere un blocco Grand Prix in homepage** (3 vincitori top con badge), linkato a `/grand-prix`. Prova sociale gratuita.
4. **Consolidare le 5 tagline a 1**, sostituendo le occorrenze in `siteConfig.brand.taglines`.
5. **Rinominare "Grand Prix Prima Edizione"** in "Grand Prix" nel menu (`src/data/navigation.ts`).
6. **Aggiungere `sitemap.ts` e `robots.ts`** in `src/app/` (15 minuti, +SEO immediato).
7. **Migliorare il `<title>` di default** in `layout.tsx` includendo le keyword (vini, oli, Sud Italia, Napoli, 2026).
8. **Inserire l'articolo NapoliVillage** come unico riferimento "Hanno parlato di noi" in homepage o nel footer.
9. **Spostare l'hamburger da `xl:hidden` a `lg:hidden`** in Header, così il desktop 13" mostra la nav inline.
10. **Linkare al footer la sezione Diario del Sud** già a livello visivo (oggi è solo un link testuale).
11. **Sostituire "L'Adrenalina del Futuro"** nella tagline hero con un sottotesto più B2B ("Tre giorni di vino, olio e business hospitality sul lungomare di Napoli — Da verificare").
12. **Aggiungere un'unica `aside` con FAQ rapida in homepage** (3-4 risposte: cos'è, per chi, quando, dove). +AEO, +UX.

---

## 6. Piano operativo

### Fase 1 — Prima della presentazione demo (1-2 giornate)
Obiettivo: la demo non deve sembrare uno scheletro.

- Applicare tutti i **quick win 1, 2, 3, 4, 5, 7, 8, 9, 11, 12**.
- Aggiungere **placeholder "Edizione 2026 — date in conferma, Napoli" visibili in hero**.
- Aggiungere un **riferimento al Grand Prix 2025** ("Albo d'Oro 2025 già assegnato — Prima Edizione 2026 in costruzione"), per chiarire la timeline.
- Ridurre `ConceptSection` da 4 a 3 pillar e accorciare i body delle pagine interne del 25%.
- Rinominare le voci di menu lunghe.
- Allineare la palette di tagline a un'unica frase.

### Fase 2 — Prima del lancio pubblico (5-8 giornate)
Obiettivo: il sito deve poter generare lead reali.

- **Form di contatto on-page** su `/espositori`, `/buyer`, `/media` (con endpoint Netlify Forms o Formspree o equivalente).
- **Brochure espositori v1** in PDF leggero (anche minimal), scaricabile dopo email.
- **Pagine differenziate**: smettere di usare lo stesso `InternalPageTemplate` per tutte e cinque le audience; introdurre layout dedicati per Espositori, Buyer, Visitatori (rispettando il design system esistente).
- **Sitemap.xml, robots.txt, JSON-LD Event + Organization**.
- **Press room** con 1 PDF + 3 immagini scaricabili reali.
- **Sezione FAQ** dedicata in homepage e in fondo a ogni pagina audience.
- **Definire 3 pacchetti espositori** (anche solo "Boutique / Standard / Featured" con range di prezzo placeholder).
- **Privacy/Cookie**: rimuovere la riga "fase demo" quando si attivano i form.
- **Analytics** (Plausible o GA4) + event tracking sulle CTA principali.

### Fase 3 — Dopo il lancio (continuo)
Obiettivo: trasformare la presenza in piattaforma editoriale e commerciale.

- Attivare **Diario del Sud** come blog reale: 1 articolo a settimana sulle 5 rubriche dichiarate.
- Programmatic SEO leggero: una pagina per regione (es. `/territori/campania`, `/territori/puglia`) con dati produttivi e collegamenti a produttori 2026.
- Pagina **"Albo d'Oro"** indipendente dal Grand Prix, con archivio annuale (2025, 2026...).
- **Newsletter** "Diario del Sud" (Buttondown/Beehiiv) con doppio opt-in.
- **Caso studio**: dopo l'evento, pubblicare numeri reali (espositori, buyer, paesi, articoli stampa) per alimentare il sito dell'edizione successiva.
- **A/B test** sulle CTA primarie (Brochure vs Pass Buyer) per stabilire la gerarchia migliore.
- **Schema markup avanzato**: `EventSeries`, `Article`, `Review` (per i vincitori), `FAQPage`.
- **Sponsor wall** e patrocini reali quando confermati.
- Pianificare **directory submissions** ai principali portali wine/food italiani e europei (Civiltà del Bere, WineMag, Decanter Events, Gambero Rosso) per backlink e visibilità.

---

## 7. Prompt successivo consigliato

Da incollare a Claude/Code per implementare immediatamente le prime 5 correzioni prioritarie (quick win 1, 2, 3, 4, 5).

```text
Sto lavorando al progetto in ~/Desktop/VINISUD/vini-oli-sud-web.
Stack: Next.js App Router + React 19 + TS + Tailwind v4.
Hai già fatto una review completa in docs/DEMO_REVIEW.md.

Implementa le prime 5 correzioni prioritarie identificate nella review:

1. Rendi visibile la CTA primaria "Richiedi la Brochure Espositori" anche
   su mobile e tablet. In src/components/layout/Header.tsx, la classe
   "hidden items-center gap-3 lg:flex" sul wrapper del Button va sostituita
   con una versione che lo mostri da sm: in su (compatto su mobile, esteso
   su desktop). Adatta size/padding per mantenere allineamento con
   l'hamburger e il logo. Non rompere il layout flex esistente.

2. Aggiungi in homepage, subito sotto l'HeroSection, una fascia
   "Edizione 2026" con: edizione, città (Napoli), date (placeholder
   "Date in conferma — Da verificare"), venue (placeholder),
   patrocini (placeholder "Patrocini in fase di accordo").
   Crea un nuovo componente src/components/sections/EditionStrip.tsx,
   con dati estratti da src/data/site.ts (aggiungi una nuova chiave
   siteConfig.edition: { number, city, dates, venue, patronages }, tutti
   marcati con flag isPlaceholder dove serve, secondo le regole di AGENTS.md).
   Stilisticamente coerente con il design system (eyebrow, font-display,
   palette esistente). Importalo in src/app/page.tsx tra HeroSection e
   AudienceGateway.

3. Aggiungi in homepage, dopo ConceptSection e prima di CtaBand, una
   sezione "Albo d'Oro Grand Prix Magna Grecia 2025" con i primi 4
   vincitori da src/data/winners.ts (Spumante, Bianco, Rosso, Rosato).
   Crea src/components/sections/GrandPrixHighlight.tsx riutilizzando lo
   stile di GrandPrixWinnerBadge ma in formato più compatto e premium,
   con CTA "Scopri tutti i riconoscimenti" verso /grand-prix.
   Eyebrow: "Prova editoriale". Titolo: "Dieci riconoscimenti raccontano
   la geografia del vino della Magna Grecia."

4. Consolida le tagline. In src/data/site.ts oggi esistono
   taglines.primary/secondary/institutional/commercial/agora. Tieni solo
   institutional come riferimento ufficiale (mantieni il valore attuale
   "Le eccellenze della Magna Grecia.") e rimuovi le altre quattro.
   Aggiorna ogni occorrenza nei componenti che usavano le tagline
   rimosse (HeroSection, Footer, BrandLogo se necessario) sostituendo
   con un copy alternativo coerente, scritto direttamente nei componenti
   o derivato da hero.title/hero.subtitle. Non inventare nuove formule:
   se serve un sottotitolo, usa hero.subtitle.

5. In src/data/navigation.ts rinomina la voce
   { label: "Grand Prix Prima Edizione", href: "/grand-prix" }
   in
   { label: "Grand Prix", href: "/grand-prix" }.
   Verifica che la pagina /grand-prix abbia internamente un eyebrow
   "Prima Edizione 2026 — Albo d'Oro 2025" o equivalente, così
   l'informazione non si perde.

Vincoli operativi:
- Rispetta AGENTS.md: non inventare date, sponsor o numeri; usa
  esplicitamente "Da verificare" su tutto ciò che non è confermato.
- Mantieni TypeScript strict, niente any.
- Tieni tono premium mediterraneo, evita SaaS / sagra / fiera generica.
- Mobile-first, accessibilità preservata (aria-label, focus-visible).
- A fine task esegui npm run lint e npm run build, segnala risultato.
- Aggiorna docs/WEBSITE_BLUEPRINT.md con le 5 modifiche e i placeholder
  introdotti, in linea con la policy di tracciamento del progetto.
```
