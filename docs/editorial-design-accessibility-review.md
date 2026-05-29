# Vini Oli Sud — Editorial, Design, Accessibility Review

Audit del sito Vini Oli Sud (Next.js, App Router, Tailwind v4). La revisione
non modifica codice: documenta problemi, gravità e proposte di intervento.

Fonti analizzate: `src/app/**`, `src/components/**`, `src/data/**`,
`src/app/globals.css`, asset in `public/`.

---

## 1. Executive summary

### Cosa funziona molto bene

- **Identità cromatica e lessicale coerente**: palette mediterranea (vino,
  oliva, grove, avorio, oro, mare) usata in modo controllato; tono editoriale
  in italiano colto, lontano dal generico "tour gastronomico".
- **Sistema di componenti maturo**: `Button` con sei varianti, `Card` con sei
  temi, `SectionHeader` riusato, helper `cn()`. La codebase non è ad hoc.
- **Hero scroll-bound** (dopo la pulizia fatta nello sprint precedente):
  comunica scenario, ritmo e profondità senza spiegare l'immagine, con CTA
  visibili nella prima scena e gateway a 4 card alla fine.
- **Form differenziati per audience**: `LeadMiniForm` (B2B contatti),
  `VisitorCarnetForm` (visitatori, leggero), `FoodRadarSuggestionForm`
  (editoriale). Sono visivamente distinti e non vengono confusi tra loro.
- **Diario del Sud** ben separato dalla homepage, con pipeline dati,
  empty state elegante e form dedicato — l'asset editoriale è pronto a
  scalare senza inquinare il resto del sito.
- **Accessibilità di base presidiata**: skip link, `aria-expanded` /
  `aria-controls` / `inert` sul menu mobile, `motion-reduce` capillarmente
  applicato sulle transition, focus-visible esplicito sui link nav,
  `target="_blank"` sempre accompagnato da `rel="noopener noreferrer"`.

### Cosa rischia di indebolire il brand

- **Percezione "sito non finito"**: cinque pagine ripetono in varia forma
  "saranno comunicati", "in fase di attivazione", "non ancora confermato",
  "fase demo pubblica". Singolarmente sono prudenze legittime; sommate, il
  visitatore percepisce un progetto in costruzione, non un salone boutique
  premium.
- **Pagine interne fotocopia**: buyer, espositori, media, grand-prix ed evento
  usano lo stesso `InternalPageTemplate`. Cambia il copy, non il sistema
  visivo. Per un'audience B2B abituata a leggere differenze sottili, sembrano
  varianti dello stesso modulo.
- **Identità professionale dell'organizzazione**: l'email pubblica della
  segreteria è `napoliracingshow@gmail.com`. Un sito che si presenta
  "boutique e premium" con contatto su Gmail libero abbassa la percezione
  di autorevolezza.
- **Mismatch CTA → form**: i CTA su Visitatori e Media portano comunque al
  `LeadMiniForm` B2B (campi `Ragione sociale` e `Sito web` required-style).
  Un visitatore privato o un giornalista freelance non hanno una "ragione
  sociale".
- **Eccesso di rounded grandi**: card con `rounded-[1.4rem]`–`[1.8rem]`
  ovunque. Il sito acquisisce un'aria "dashboard SaaS" che contraddice la
  promessa editoriale/cartacea/mediterranea.

### Cosa correggere prima del lancio

Ordine d'impatto (top 5):

1. Riscrivere Privacy e Cookie senza la parola "demo".
2. Concentrare i "Da verificare" in un solo posto, sparirli dalle pagine
   marketing.
3. Sostituire `napoliracingshow@gmail.com` con un indirizzo `@vinisud.it`
   (segreteria@, info@, partnership@).
4. Rimuovere il CTA hero "Esplora il Programma" (oggi porta a una pagina
   senza programma reale) o sostituirlo con uno più onesto.
5. Differenziare visivamente almeno 2 pagine interne (badge audience,
   accent color) per uscire dall'effetto fotocopia.

---

## 2. Problemi editoriali

| Pagina / componente | Problema | Gravità | Testo attuale (estratto) | Proposta di correzione |
|---|---|---|---|---|
| `src/app/cookie/page.tsx` | "Demo pubblica" visibile a chiunque, in pagina legale | alta | "Testo redatto per la fase demo pubblica; potrà essere integrato prima dell'introduzione di nuovi strumenti di misurazione o pubblicità." | "Informativa cookie corrente. Verrà aggiornata in caso di attivazione di nuovi strumenti di analytics o profilazione, con le modalità di consenso previste." |
| `src/app/privacy/page.tsx` | Stessa parola "demo" su pagina legale | alta | "Informativa redatta per la fase demo pubblica; il testo legale definitivo potrà essere aggiornato prima dell'apertura operativa dei servizi." | "Informativa privacy aggiornata. Modifiche e integrazioni saranno comunicate prima dell'attivazione di nuovi servizi che comportino trattamenti dati ulteriori." |
| `src/data/site.ts` (`edition.note`) | "Saranno comunicati" sulla coordinata principale dell'edizione | alta | "Date e dettagli operativi saranno comunicati sui canali ufficiali." | Toglierlo dalla pagina edizione/strip. Spostare la nota su una pagina o sezione "Aggiornamenti" dedicata. |
| `src/data/pages.ts` (visitatori sections[2]) | "Saranno comunicati" davanti a "modalità di accesso" | media | "Esperienze, calendario e modalità di accesso saranno comunicati sui canali ufficiali. È già possibile manifestare interesse alla segreteria." | "Le esperienze del 2026 si stanno definendo. Ti aggiorniamo via email appena il carnet degustazione apre." |
| `src/data/pages.ts` (grand-prix `verifyNotes`) | Box "Da verificare" pubblicato in pagina | alta | "Il regolamento ufficiale, le categorie e i criteri di valutazione non sono ancora confermati." + "La meccanica di iscrizione va definita solo dopo approvazione organizzativa." | Rimuovere il box pubblico. Spostare in un changelog interno fuori dal sito. La pagina Grand Prix mostra già l'Albo d'Oro 2025 verificato, non serve disclaimer. |
| `src/data/pages.ts` (media `verifyNotes`) | "File scaricabili e contatti stampa ufficiali dovranno essere inseriti dopo validazione" | alta | come sopra | Idem: rimuovere dal pubblico. La pagina Media può dire "Media kit in arrivo" senza il sapore burocratico. |
| `src/data/pages.ts` (espositori `ctaNote`) | "Brochure espositori in fase di attivazione" e simili | media | "Richiedi la brochure per dettagli su pacchetti, visibilità e opportunità commerciali." (OK) — ma `metadataDescription` dice "in fase di attivazione" | Sostituire `metadataDescription` con frase commerciale, non amministrativa. |
| `src/data/pages.ts` (`pages["diario-del-sud"]`) | Vecchia descrizione "magazine proprietario" non più allineata alla pagina (oggi è radar editoriale) | media | "Un magazine proprietario che racconta territori…" | "Radar editoriale di Vini Oli Sud. Titoli, fonti e segnali dal vino, olio e agroalimentare mediterraneo." |
| `src/data/site.ts` (`hero.actions`) | CTA "Esplora il Programma" → `/evento` che non ha un programma reale | media | "Esplora il Programma" | Rimuoverlo o sostituirlo con "Scopri il Concept" o "Vedi l'Edizione 2026". |
| `src/data/site.ts` (`audiences[2]` visitatori CTA) | "Richiedi aggiornamenti visitatori" è generico | media | "Richiedi aggiornamenti visitatori" | "Prenota il Carnet Degustazione" + linkare direttamente a `/visitatori#richiesta-carnet` (anchor già esistente). |
| `src/data/site.ts` (`audiences[3]` media) | "Richiedi informazioni media" è generico | media | "Richiedi informazioni media" | "Richiedi il Media Kit" — coerente con la lista CTA del brief. |
| `src/components/sections/CtaBand.tsx` | "Proponi una Partnership" come link testuale sotto due CTA: gerarchia debole | bassa | "Proponi una Partnership →" | Promuoverla a vero `Button variant="ghost"` accanto agli altri due o spostarla in una sezione dedicata; oggi sembra un afterthought. |
| `src/data/site.ts` (`regions.title`) | "Otto regioni, una piattaforma mediterranea": include Abruzzo/Molise/Sardegna che non sono Magna Grecia, ma il Grand Prix si chiama "Magna Grecia" | bassa | "Otto regioni, una piattaforma mediterranea." + premio "Grand Prix Magna Grecia" | Allineare: o usare sempre "Mezzogiorno"/"Sud" come perimetro (8 regioni), o restringere "Magna Grecia" a Campania/Basilicata/Puglia/Calabria/Sicilia coerentemente. |
| `src/data/site.ts` (concept ripetizioni) | "boutique" appare in EditionStrip + Footer + AudienceGateway + ConceptSection; "premium" idem | bassa | molteplici occorrenze | Ridurre a 2 occorrenze totali nel fold visibile per evitare effetto incantesimo pubblicitario. |
| `src/data/pages.ts` (`evento.title`) | Curly quote tipografica "L'evento" usata bene (`L'evento`); ma `metadataDescription` dice "Programma dettagliato in fase di conferma" | media | "Scopri il concept di Vini Oli Sud tra Napoli, gusto mediterraneo e racing show. Programma dettagliato in fase di conferma." | "Vini Oli Sud: scenario, identità, edizione 2026. Il concept del salone boutique dei terroir del Mezzogiorno." |
| `src/components/sections/LeadMiniForm.tsx` | Modulo con "Ragione sociale" e "Sito web" appare anche a visitatori e media che arrivano da CTA dedicati | alta | campi `company` required, `website` opzionale | Differenziare in base al param `?interesse=`: per visitatori usare `VisitorCarnetForm`, per media togliere "Ragione sociale" required e aggiungere "Testata/redazione". |
| `src/components/sections/EditorialPreview.tsx`, `RegionsSection.tsx` | Componenti non importati da nessuna pagina (dead code) | bassa | esistono in repo, non in rendering | Rimuovere oppure documentare l'intento futuro in un commento di testa. |
| `src/data/site.ts` (`editorial.columns`) | "Motori & Terroir" presente nelle rubriche Diario ma il Diario reale non ha questa colonna nel nuovo schema `FoodRadarCategory` | bassa | "Motori & Terroir" elenco rubriche | Allineare le rubriche editoriali del data layer alle 5 categorie reali del radar oppure togliere il blocco. |

---

## 3. Problemi design / brand

| Pagina / componente | Problema visivo | Causa probabile | Correzione consigliata | Priorità |
|---|---|---|---|---|
| Sistema globale | Tre scale tipografiche distinte per h2 (`SectionHeader` 2.1→2.95rem; `ConceptSection` clamp(2.1, 7vw, 4.8); `CtaBand` clamp(2.15, 8vw, 4.7); `GrandPrixHighlight` 2.4→3.4) | Ogni sezione ha cresciuto la propria scala in autonomia | Centralizzare in `globals.css` 3 classi: `.display-xl`, `.display-lg`, `.display-md`. Applicarle ovunque. | alta |
| `AudienceGateway`, `ConceptSection`, `Card`, `GrandPrixHighlight` | Effetto "dashboard": rounded grandi (1.4–1.8rem), bordi multipli, shadow, backdrop-blur | Ogni componente porta la propria card-shell | Ridurre rounded a 0.5–0.8rem sulle card meno gerarchiche; lasciare il rounded grande solo al pannello narrativo principale per pagina. | media |
| `Footer.tsx` | Footer molto denso (4 colonne, P.IVA, CF, PEC, telefoni multipli, tagline) | Tutto messo per scrupolo legale | Sintetizzare: una colonna "Contatti" essenziale, una "Menu", una "Azioni". Spostare CF/P.IVA in microriga sotto. | media |
| `CtaBand.tsx` | Pannello quasi rettangolare (`rounded-[2px]`) accanto a card molto rounded → stacco visivo | Scelta "rotaia/bandiera" più squadrata | O allineare a `rounded-[1.2rem]` per coerenza, o tenere il rettangolo e applicarlo anche ad altre sezioni di valore commerciale (es. CTA finale grand-prix). | media |
| `RegionsSection.tsx` (se riattivato) | 8 tile center-aligned, font-display molto grande, sembrano "category chips" gaming | Tutte uguali, alternanza temi cromatici a caso | Ridurre dimensioni titolo, eyebrow piccolo per ogni regione, layout asimmetrico o lista verticale. | bassa (sezione non in uso) |
| `ConceptSection.tsx` | 4 card pillar con hover gradient che cambia colore + shadow che si gonfia; quarto pillar con accent vino diverso dagli altri 3 | Tentativo di evidenziare il 4° elemento | Trattenere il hover (solo border-color), uniformare accent oro per tutti i 4 pillar. | media |
| `HeroSection.tsx` | Sezione lunga `h-[420vh]`: serve scrollare 4× viewport prima del gateway | Volutamente "cinematic" | Verificare su mobile (su iPhone si traduce in 4 swipe lenti); valutare riduzione a `h-[320vh]`. | media |
| `EditionStrip.tsx` | "Un salone boutique dedicato a vino, olio, cultura mediterranea e relazioni commerciali" appare già qui e identico in footer | Ripetizione testuale | Sostituire con un dato concreto ("Napoli · Edizione 2026 · in dialogo con Napoli Racing Show") o eliminare la frase di destra. | bassa |
| `BrandLogo.tsx` | In modalità `horizontal` il subtitle è nascosto sotto sm: tra mobile e desktop varia la quantità di brand-info | Comportamento responsive ad hoc | Documentare/normalizzare: o subtitle visibile sempre dal sm+, o mai. | bassa |
| `GrandPrixHighlight.tsx` (riga awards `lg:grid-cols-4`) | Su desktop le 4 card "Categorie in evidenza" sono piccole, scollegate dal titolo principale | Spostate in riga separata per non competere con header | Stringere il margine top o riconnetterle al pannello "Metodo" con un divider continuo. | bassa |
| Sistema colori | `var(--color-wine)` usato per eyebrow + CTA primaria + accent vari | Wine fa troppi lavori | Tenere wine solo come accento di azione (CTA primary). Eyebrow su `--color-olive` per sezioni narrative, su `--color-wine` solo dove c'è transazione. | bassa |
| Hero scroll-bound | Le 2 CTA sono visibili solo in scena 1: se l'utente atterra da link interno a metà dello scroll, vede titolo senza CTA per 3 scene | progress-bound rendering | Mantenere le CTA visibili in tutte le scene narrative, nascondere solo in gateway finale. | media |
| `Card.tsx` | `card-shell::before` + `::after` + 3 layer di background + backdrop-blur → costoso e visivamente carico | Volontà di "premium" | Su mobile: disattivare `backdrop-filter` per performance; su desktop ridurre opacità degli strati. | bassa |

---

## 4. Problemi accessibilità

| Pagina / componente | Problema | Criterio WCAG coinvolto | Correzione consigliata | Priorità |
|---|---|---|---|---|
| `HeroSection.tsx` | L'animazione scroll-bound del transform non rispetta `prefers-reduced-motion` (il parallax è guidato da `scroll`, non da CSS transition) | 2.3.3 Animation from Interactions | In `useEffect`, leggere `window.matchMedia("(prefers-reduced-motion: reduce)")` e in caso impostare `imageStyle` statico (transform: none). | alta |
| `LeadMiniForm.tsx` | `noValidate` attivo ma nessun messaggio di errore inline custom: l'utente non sa cosa manca al submit | 3.3.1 Error Identification | Aggiungere stato di validazione (almeno su `email` e `privacy_consent`) con messaggi visibili e `aria-describedby`. | alta |
| `Footer.tsx` | Link telefonici e email senza `focus-visible` esplicito → ereditano default browser, basso contrasto in alcuni browser | 2.4.7 Focus Visible | Aggiungere `focus-visible:outline-2 focus-visible:outline-[rgba(248,243,232,0.9)]`. | media |
| `Footer.tsx` | Testo legale `text-[rgba(255,248,238,0.65)]` su gradient verde scuro: contrasto stimato ~3.8:1 | 1.4.3 Contrast (Minimum) | Portare opacità ≥ 0.78 (~4.5:1) per legal line e tagline secondaria. | media |
| Globale (`text-[var(--color-muted)]` su avorio) | Body muted = `#70615c` su `#f8f3e8`, contrasto ~4.8:1: AA appena passato per testo small | 1.4.3 Contrast (Minimum) | Per testi sotto `text-sm` usare `text-[var(--color-ink)]` (#33241f, ~9:1) o scurire muted a `#60524e`. | media |
| `Header.tsx` (mobile) | Il bottone hamburger ha `aria-label` dinamico ma il chevron/X visivo cambia istantaneamente: per screen reader OK, ma il toggle può essere invocato 2x velocemente | 4.1.2 Name, Role, Value | Aggiungere `aria-pressed` o mantenere lo stato come è (già corretto, lo segnalo come buona pratica). | bassa |
| `HeroSection.tsx` | `<picture>`/`<img>` con `aria-hidden="true"` su immagine decorativa + il testo a fianco descrive la scena: ok. Ma se utente è solo vocale, perde completamente l'atmosfera | 1.1.1 Non-text Content | Considerare un `alt` descrittivo breve ("Tavola mediterranea con vino, olio, pane e olive") invece di vuoto; oppure mantenere `alt=""` e aggiungere una `figcaption sr-only` con quella stringa. | bassa |
| `VisitorCarnetForm.tsx` | Select "Quanti ingressi" senza messaggi di errore esplicito; `email` con browser-validate. Funziona, ma non c'è feedback se la submit fallisce silenziosamente | 3.3.1 / 3.3.3 | Mostrare errore "Email non valida" sotto il campo, non solo affidarsi al tooltip nativo. | media |
| `FoodRadarSuggestionForm.tsx` | Stesso pattern: niente messaggi di errore custom | 3.3.1 | Idem. | media |
| `GrandPrixWinnerBadge.tsx` | Fallback testuale ha `role="img"` con `aria-label` = `alt` originale ("Bollino ufficiale Grand Prix — Miglior Spumante"): corretto. | — | OK, segnalato come buon esempio. | n/a |
| `Header.tsx` nav desktop | I link nav hanno border-bottom oro come "underline" attivo: percepibile, ma per chi vede in scala di grigi può sparire | 1.4.1 Use of Color | Aggiungere un `aria-current="page"` sul Link attivo (oggi assente: nel render manca `aria-current`). | media |
| `Header.tsx` | Sticky header `top-0 z-50`: con focus su nav, ci si trova navigando link sotto un header che li copre se l'utente scrolla con tab | 2.4.3 Focus Order | Aggiungere `scroll-margin-top: var(--site-header-height)` ai target anchor delle pagine (es. `#richiesta-informazioni`). Già presente su alcuni (`scroll-mt-28`), generalizzare. | bassa |
| `InternalPageTemplate.tsx` (link esterno `externalReference`) | Link `target="_blank"` con `rel="noopener noreferrer"` OK, ma manca indicazione visiva/sr-only che apre in nuova scheda | 3.2.5 Change on Request | Aggiungere `<span class="sr-only"> (apre in nuova scheda)</span>` dentro il Link. | bassa |
| `LeadMiniForm.tsx`, `VisitorCarnetForm.tsx`, `FoodRadarSuggestionForm.tsx` | Submit `fetch` POST: se fallisce, l'utente vede comunque lo stato di successo. Per screen reader OK (`role="status"` `aria-live="polite"`), ma è informazione falsa | 3.3.3 Error Suggestion + Honest UX | Distinguere stato `error` da `success` quando la fetch fallisce davvero e mostrare retry. Oggi è scelta di prodotto (frontend-only) ma da rivedere se/quando c'è backend reale. | media |
| Globale | `BrandLogo` square ha `<span class="sr-only">Vini Oli Sud</span>` quando immagine ok; in fallback testuale il wordmark viene mostrato visibilmente con `alt`-like role. Coerente. | — | OK. | n/a |

---

## 5. Dati da verificare

Lista di tutti i dati pubblicati sul sito che non risultano confermati da
fonte ufficiale interna o documentazione condivisa in repo:

- **`siteConfig.organizer.email = "napoliracingshow@gmail.com"`**: indirizzo
  Gmail come email pubblica della segreteria di un progetto premium. Da
  sostituire con `@vinisud.it`.
- **`siteConfig.organizer.phones = ["3295535164", "3276616294"]`**: confermati?
- **`siteConfig.organizer.vatId = "10430641216"`** e
  **`fiscalCode = "95334510633"`**: presenti in `public/brand/dati-ufficiali-vinisud.txt`,
  ma da incrociare con visura camerale.
- **`siteConfig.organizer.pec = "asdnapoliracingshow@pec.it"`**: PEC ASD,
  non PEC del progetto Vini Oli Sud.
- **`siteConfig.contact.projectEmail = "info@vinisud.it"`**: attivo? Riceve?
  Inoltro funzionante?
- **`siteConfig.edition.context = "In dialogo con Napoli Racing Show / Gran Premio di Napoli"`**:
  esiste accordo formale documentato? Il claim è centrale (compare in homepage
  hero, EditionStrip, footer, evento, audienceGateway).
- **`siteConfig.regions`**: claim "8 regioni" (Campania, Abruzzo, Molise,
  Puglia, Basilicata, Calabria, Sicilia, Sardegna). Tutte 8 confermate come
  perimetro? Ci sono espositori da Molise/Sardegna confermati per il 2026?
- **`grandPrixWinners2025[]` (10 vincitori in `src/data/winners.ts`)**: fonte
  dichiarata "NapoliVillage". Esiste atto ufficiale dell'organizzazione che
  certifica nominativi + annate? Pubblicare nominativi senza atto ufficiale
  espone a contestazioni dei produttori esclusi.
- **`grandPrixHighlight.featuredAwards`** (Miglior Spumante/Bianco/Rosso/Rosato):
  4 categorie sottostanti; il numero totale categorie premio è confermato? Il
  Diario menziona anche Passito, Campania, Puglia, Basilicata, Calabria,
  Sicilia.
- **`hero.subtitle`** parla di "buyer, visitatori, brand premium": sono già
  attivi onboarding/iscrizioni? Se non ancora, evitare il presente
  indicativo "unisce".
- **`pages.evento.metadataDescription`** "Programma dettagliato in fase di
  conferma": vedere editorial table sopra.
- **`pages["diario-del-sud"]`** descrizione legacy "magazine proprietario":
  non più allineata con la pagina effettiva (radar).
- **`siteConfig.editorial.columns`** include "Motori & Terroir" che non esiste
  come `FoodRadarCategory` reale.
- **`siteConfig.audiences[2].description`**: parla di "show cooking nel
  dialogo unico tra gusto, mare e motori": show cooking confermato come
  attività del format?
- **`siteConfig.brand.taglines.primary`** "Le Radici del Gusto. L'Adrenalina
  del Futuro." — claim brand registrato? Compare nel footer come h2.
- **`hero.actions[2]` "Esplora il Programma"** → `/evento`: la pagina non
  contiene programma effettivo, solo concept.
- **`LeadMiniForm.tsx` action="/forms/lead.php"**: lo script PHP esiste in
  `public/forms/lead.php` ma manda email a chi? Va verificato a fondo prima
  del lancio (anti-spam, destinatario, GDPR consent stored?).

---

## 6. Quick fix consigliati (max 10)

1. **Privacy + Cookie**: rimuovere parola "demo" e qualunque riferimento a
   "fase pre-operativa". 30 minuti.
2. **`siteConfig.edition.note`**: rimuovere completamente o spostare in
   pagina interna `/evento`. 10 minuti.
3. **`verifyNotes` su `grand-prix` e `media`**: rimuovere il rendering
   pubblico in `InternalPageTemplate` o azzerare le note nei dati. 15 minuti.
4. **`hero.actions[2]`**: rimuovere "Esplora il Programma" (resta una CTA
   buyer + una espositore in hero). 5 minuti.
5. **`audiences[2].ctaLabel`** = "Prenota il Carnet Degustazione" e
   `href` = `/visitatori#richiesta-carnet`. 5 minuti.
6. **`audiences[3].ctaLabel`** = "Richiedi il Media Kit". 5 minuti.
7. **`pages["diario-del-sud"].description`**: riallineare alla nuova
   identità "radar editoriale". 5 minuti.
8. **Sostituire `napoliracingshow@gmail.com`** in footer e form con
   `segreteria@vinisud.it` (o equivalente). 5 minuti se l'indirizzo esiste.
9. **`prefers-reduced-motion` nel hero scroll-bound**: 8 righe in
   `HeroSection.useEffect`. 20 minuti.
10. **Aggiungere `aria-current="page"`** sui Link nav attivi in `Header.tsx`
    (un solo `aria-current` extra nel map). 10 minuti.

---

## 7. Interventi da NON fare ora

- **Rifare il Card system con un nuovo design token globale**: tentazione
  forte, ma richiede settimane e tocca ogni sezione. Aspettare un'iterazione
  dedicata al design system.
- **Sostituire l'hero scroll-bound con un video o un'altra meccanica**:
  funziona ed è distintivo; rifarlo prima del lancio è rischio puro.
- **Implementare i form con backend reale + database**: non urgente finché
  i flussi B2B sono pochi; rimanere su `/forms/lead.php` (POST email) + JSON
  generated è coerente con la scala attuale.
- **Live-fetch del Diario del Sud dal Google Sheet a runtime**: la pipeline
  Apps Script → GitHub commit (opzione 1) è già pronta e rispetta il filtro
  editoriale. Non aggiungere altre superfici di rischio.
- **Tradurre il sito in EN**: l'audience è italiana e mediterranea; un
  bilingue richiede sistema di routing e copy doppio. Posticipare.
- **Riscrivere `LeadMiniForm` come multi-step**: oggi è ok come single form;
  multi-step ridurrebbe il completion rate per richiesta info di basso
  attrito.
- **Espandere `RegionsSection` o `EditorialPreview`** prima di decidere se
  servono in produzione. Marcare come dead code o rimuovere.

---

## 8. Piano operativo

### Step 1 — Quick fix editoriali (mezza giornata)

Eseguire i 10 quick fix della sezione 6. Output: copia
sito allineata, niente parola "demo", niente "saranno comunicati" nel fold
visitatore.

### Step 2 — Armonizzazione design (1–2 giorni)

- Centralizzare 3 classi `.display-xl/.lg/.md` in `globals.css`, sostituire le
  scale hardcoded h2 di Section/Concept/CtaBand/GrandPrixHighlight.
- Ridurre rounded delle card secondarie (AudienceGateway, ConceptSection
  pillars, Diario card) da 1.4–1.8 a 0.8–1.0rem.
- Differenziare almeno 2 pagine interne con accent color per audience
  (buyer = sea, espositori = wine, media = sand, grand-prix = olive).
- Verificare e ridurre opacità testi muted scuri.

### Step 3 — Accessibilità form/navigazione (1 giorno)

- `prefers-reduced-motion` nel hero scroll-bound.
- Messaggi di errore inline custom nei 3 form (`LeadMiniForm`,
  `VisitorCarnetForm`, `FoodRadarSuggestionForm`).
- `aria-current="page"` nel nav.
- `scroll-margin-top` generalizzato sugli anchor target sotto sticky header.
- Focus-visible esplicito su tutti i link del footer.

### Step 4 — Controllo responsive (mezza giornata)

- Verificare hero scroll-bound su iPhone reale (touchscreen, scroll
  momentum, dimensione testi).
- Verificare footer 3 colonne su tablet portrait.
- Verificare card AudienceGateway in viewport 360×640.
- Verificare Diario del Sud griglia 1col/2col su mobile.

### Step 5 — Lint / build / SEO finale (2 ore)

- `npm run lint` 0 errori, 0 warning.
- `npx tsc --noEmit` 0 errori.
- `npm run build` su macOS, controllo bundle size e warning.
- Audit Lighthouse (Performance / Accessibility / SEO / Best Practices) su
  homepage, /diario-del-sud, /grand-prix, /contatti.
- Validazione metadata: ogni pagina ha title + description coerenti con la
  nuova copy editoriale.

---

## Appendix A — Mappa file e usi

- **Pagine attive in routing**: `evento`, `espositori`, `buyer`,
  `visitatori`, `grand-prix`, `media`, `diario-del-sud`, `contatti`,
  `privacy`, `cookie`, `page.tsx` (home).
- **Componenti usati dalla homepage**: `HeroSection`, `EditionStrip`,
  `AudienceGateway`, `ConceptSection`, `GrandPrixHighlight`, `CtaBand`.
- **Componenti pagina-specifici**: `GrandPrixWinners` (solo `/grand-prix`),
  `InternalPageTemplate` (evento/espositori/buyer/media/grand-prix),
  `VisitorCarnetForm` (solo `/visitatori`),
  `FoodRadarSuggestionForm` (solo `/diario-del-sud`),
  `LeadMiniForm` (solo `/contatti`).
- **Dead code in `src/components/sections`**: `RegionsSection`,
  `EditorialPreview` non sono importati da nessuna pagina.
- **Asset chiave**: `public/images/home/tavola-scroll-*.jpg`,
  `public/grand-prix/badges/*.webp`, `public/brand/logo-horizontal-cropped.png`,
  `public/brand/og-image.jpg`.
- **Pipeline dati Diario del Sud**: `src/data/foodRadar.generated.json`
  (output), `src/data/foodRadar.ts` (layer tipizzato), generata da
  `scripts/import-food-radar.mjs` / `scripts/import-food-radar-csv.mjs` /
  `docs/apps-script/diario-del-sud-github-bridge.gs`.

---

## Appendix B — Note metodologiche

- L'audit è documentale: nessun rendering visivo è stato eseguito; le note
  su contrasto sono stime calcolate sulle dichiarazioni dei colori. Per i
  contrasti su immagini (hero scroll-bound) servirebbe un controllo Lighthouse
  o axe su istanza renderizzata.
- Nessun browser test è stato eseguito su touch reale; le considerazioni
  responsive si basano sulle classi Tailwind dichiarate.
- L'audit non include un'analisi SEO tecnica (sitemap, robots, structured
  data): andrebbe condotta in parallelo allo step 5.
