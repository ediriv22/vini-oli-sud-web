# Vini Oli Sud — Resoconto sito web e obiettivi

## 1. Stato attuale del progetto

### Stack tecnico

- Framework: Next.js 16.2.6 con App Router
- Linguaggi: TypeScript, React 19.2.4
- Styling: Tailwind CSS 4 con variabili CSS custom in `src/app/globals.css`
- Linting: ESLint 9 con `eslint-config-next`
- Architettura contenuti: data layer centralizzato in `src/data`
- Stato deploy: locale/demo, con target futuro indicato in README come Vercel

### Struttura cartelle

- `src/app`: routing applicativo e metadata pagina
- `src/components/layout`: header e footer
- `src/components/sections`: sezioni homepage e template pagine interne
- `src/components/ui`: button, card, logo, section header
- `src/data`: brand, navigazione, pagine statiche, catalogo video locale
- `public/brand`: asset di marca e file di supporto
- `public/images`: placeholder visuali
- `public/downloads`: predisposizione per brochure, media kit e deck
- `public/videos`: solo README operativo, nessun asset video versionato
- `docs`: blueprint strategico e documentazione operativa

### Pagine presenti

- `/`
- `/evento`
- `/espositori`
- `/buyer`
- `/visitatori`
- `/grand-prix`
- `/diario-del-sud`
- `/media`
- `/contatti`
- `/privacy`
- `/cookie`

### Componenti principali

- `Header` con navigazione principale e CTA primaria
- `Footer` con quick links, azioni chiave e contatti placeholder
- `HeroSection`
- `AudienceGateway`
- `ConceptSection`
- `RegionsSection`
- `EditorialPreview`
- `CtaBand`
- `InternalPageTemplate`
- `BrandLogo`, `Button`, `Card`, `SectionHeader`

### Data layer esistente

- `src/data/site.ts`: brand, hero, CTA, gateway audience, concept, regioni, preview editoriale, CTA finale
- `src/data/navigation.ts`: menu principale, CTA header, azioni footer
- `src/data/pages.ts`: contenuti strutturati per pagine interne
- `src/data/videos.ts`: catalogo tecnico dei video locali, senza import o versionamento asset

### Asset presenti

- Brand:
  - favicon PNG
  - `logo-square.png`
  - `logo-square.webp`
  - `original-logo.webp`
  - `og-image.jpg`
- Immagini:
  - `hero-placeholder.svg`
  - `texture-placeholder.svg`
- Download:
  - solo `README.md`, nessuna brochure o media kit pubblicato
- Video:
  - nessun file video nel repo
  - catalogo locale documentato in `src/data/videos.ts`

### Asset mancanti

- Logo orizzontale definitivo per header/footer
- Varianti `logo.svg`, `logo-dark.svg`, `logo-light.svg` previste dal progetto
- Hero visual reale o video hero ottimizzato
- Poster immagine per video hero
- Brochure espositori
- Brochure buyer
- Media kit
- Sponsor deck
- Immagini ufficiali Napoli/Lungomare/Vesuvio, vino, olio e motorsport approvate

### Stato video locali/catalogo video

- Esiste un catalogo leggero in `src/data/videos.ts`
- I video restano in percorsi locali esterni al repository
- Nessun video è collegato attualmente alla homepage o ad altre pagine
- È già presente una shortlist hero:
  - `drone-vigneto-vulcano-sfondo`
  - `drone-orbita-castello-vigneti`
  - `drone-vigneto-controluce-sole`
- Naming consigliato per integrazione futura:
  - `public/videos/hero-vigneti.mp4`
  - `public/videos/hero-vino.mp4`
  - `public/videos/hero-poster.jpg`

### Stato brochure/download

- `public/downloads` è predisposta ma vuota
- Le CTA brochure e media kit esistono nel sito come percorsi narrativi/commerciali
- I file reali non sono ancora presenti
- Stato attuale: demo corretta come intenzione, non ancora operativa come download

## 2. Posizionamento del sito

Il sito di Vini Oli Sud non è impostato come semplice vetrina istituzionale. L’architettura e il data layer mostrano già un intento più ambizioso: costruire una piattaforma commerciale e narrativa capace di presentare il progetto come hub premium del gusto mediterraneo.

Il ruolo corretto del sito è:

- portale commerciale per generare contatti, brochure request, pass buyer e partnership
- piattaforma editoriale per dare autorevolezza al brand attraverso territori, cultura, vino e olio
- sistema di smistamento dei flussi tra Espositori, Buyer, Visitatori, Media e Partner
- ponte narrativo con il Napoli Racing Show, senza trasformare Vini Oli Sud in semplice appendice motoristica
- presenza digitale dal tono mediterraneo, premium, concreto e business-oriented

L’idea più forte oggi è già definita nel concept: la lentezza della terra incontra la velocità della pista. Questo posizionamento è coerente con la scrittura dei contenuti, con la palette cromatica e con l’impianto delle CTA.

Elementi da trattare come **Da verificare**:

- date ufficiali
- location ufficiale
- contatti definitivi
- rapporto operativo e comunicativo con Napoli Racing Show
- sponsor, partner e buyer confermati
- regolamento Grand Prix

## 3. Obiettivi funzionali

### Espositori

- Generare lead qualificati tramite un percorso chiaro e business-first
- Spingere la richiesta della brochure espositori come CTA primaria
- Valorizzare ROI, visibilità, buyer presenti, networking e posizionamento premium
- Preparare un funnel commerciale che in futuro includa form, invio materiali e contatto dedicato
- Ridurre il linguaggio generico da fiera e sostituirlo con argomenti di utilità commerciale

### Buyer e Operatori

- Raccogliere richieste di Pass Buyer con una promessa chiara di selezione e utilità
- Spiegare chi può candidarsi e con quali criteri, quando questi dati saranno confermati
- Valorizzare scouting, incontri B2B, eccellenze del Sud e lettura ordinata dell’offerta
- Preparare una futura area di business matching o agenda incontri
- Distinguere il tono buyer da quello visitor: più essenziale, più selettivo, meno emozionale

### Visitatori

- Raccontare l’esperienza di degustazione, programma e atmosfera
- Mantenere un tono caldo, sensoriale e mediterraneo
- Evitare confusione con il funnel B2B di buyer ed espositori
- Preparare spazio per ticketing, carnet o experience package quando disponibili
- Rafforzare la dimensione esperienziale senza scivolare nel tono turistico generico

### Media

- Rendere facile scaricare media kit, comunicati, loghi e materiali stampa
- Predisporre una press room chiara, sobria e pronta alla pubblicazione
- Ridurre l’attrito nel reperimento di asset approvati
- Preparare un futuro flusso accrediti media
- Separare sempre materiali confermati da materiali ancora da validare

### Partner/Sponsor

- Comunicare valore premium, co-branding e contesto reputazionale
- Rendere più visibile la CTA `Proponi una Partnership`
- Preparare un percorso che trasformi il sito in strumento di raccolta partnership
- Chiarire il valore della connessione tra territorio, business hospitality e immaginario Racing Show

## 4. Obiettivi grafici e UX

### Mood visivo attuale

Il sito esprime già una direzione visiva calda, elegante e mediterranea. Il linguaggio è più vicino a una boutique editoriale-business che a una fiera generalista. Questo è un punto forte da preservare.

### Coerenza con palette VINISUD

La palette tecnica definita in `globals.css` è già molto coerente:

- Verde VINISUD: `--color-olive`, `--color-grove`
- Oro Magna Grecia: `--color-sand`
- Rosso Aglianico: `--color-wine`
- Avorio/Pietra: `--color-ivory`
- Blu Napoli/Azzurro Golfo: oggi rappresentato soprattutto da `--color-sea`

Direzione consigliata:

- usare verde, oro, avorio e rosso come base principale del brand
- usare il blu solo come contrappunto istituzionale o come richiamo calibrato al mondo Napoli Racing Show
- evitare che il blu diventi dominante nella percezione generale del brand Vini Oli Sud

### Uso logo attuale

- Il progetto usa `BrandLogo` con fallback raster e testo tipografico
- Il logo quadrato esiste e funziona come asset provvisorio
- Header e footer avrebbero beneficio da un wordmark orizzontale dedicato
- Il README di `public/brand` lo segnala già esplicitamente

### Necessità di logo orizzontale in header/footer

- Priorità alta
- Il marchio quadrato attuale è ricco di dettaglio e può risultare piccolo in navbar
- Serve una versione orizzontale leggibile, più pulita e più performante su desktop e mobile

### Uso video hero

- Oggi assente
- La hero usa un placeholder statico elegante ma dichiaratamente provvisorio
- La prossima fase deve sostituire il placeholder con un video hero reale, preferibilmente vigneti/vino/olio
- L’integrazione dovrà restare leggera e ottimizzata

### Overlay e leggibilità

- La hero attuale usa già gradienti e contrasto ragionato
- La logica di overlay è corretta e va mantenuta anche con il video
- Il rischio principale futuro sarà perdere leggibilità dell’H1 e delle CTA sopra footage troppo luminoso o mosso

### Tipografia

- Sistema coerente: sans per leggibilità, serif display per titoli
- La scelta produce un tono autorevole e non anonimo
- Non è una tipografia proprietaria, ma sostiene bene il posizionamento attuale

### Ritmo delle sezioni

- La homepage ha una scansione chiara: hero, gateway, concept, regioni, editoriale, CTA finale
- Il ritmo è ordinato e non eccessivo
- Manca ancora una sezione esplicita su Grand Prix e una presenza più forte dei contenuti commerciali

### Mobile-first

- Approccio mobile-first presente
- Header con menu mobile e CTA dedicata
- Grid e spacing reattivi su homepage e pagine interne
- Da validare in fase demo con hero video reale e logo finale

### Accessibilità base

- Presente skip link nel layout
- Menu mobile con `aria-expanded` e label
- Hero placeholder con `aria-label`
- Resta da monitorare:
  - contrasto effettivo su video hero
  - leggibilità CTA su overlay
  - qualità dei focus state lungo tutti i percorsi

### CTA e gerarchia visiva

- Le CTA principali sono corrette come impostazione
- `Richiedi la Brochure Espositori` è ben posizionata nel sistema
- `Richiedi il Pass Buyer` e `Esplora il Programma` sono già presenti
- Serve rendere più netta la differenza tra CTA commerciali, informative e media

## 5. Homepage ideale

La homepage target della prossima fase dovrebbe essere:

1. Header chiaro con logo leggibile, navigazione essenziale e CTA primaria visibile
2. Hero con video reale ottimizzato legato a vino, vigneti o olio
3. H1 forte, mediterraneo e orientato al posizionamento
4. CTA principali:
   - `Richiedi la Brochure Espositori`
   - `Richiedi il Pass Buyer`
5. CTA secondaria:
   - `Esplora il Programma`
6. Gateway per Espositori, Buyer, Visitatori, Media
7. Sezione concept centrata sulla tensione tra lentezza della terra e velocità della pista
8. Sezione regioni del Sud / Magna Grecia con taglio più strategico che turistico
9. Blocco Grand Prix con ruolo reputazionale e narrativa chiara, senza dettagli non confermati
10. Blocco Diario del Sud come leva editoriale e SEO
11. CTA finale commerciale chiara, con uscita per partnership o brochure

Osservazione sullo stato attuale:

- i punti 1, 3, 4, 5, 6, 7, 8 e 11 sono già parzialmente presenti
- il punto 2 è ancora placeholder
- i punti 9 e 10 sono presenti più come promessa di architettura che come sviluppo pieno in homepage

## 6. Gap analysis

| Area | Stato attuale | Problema | Priorità | Azione consigliata |
| --- | --- | --- | --- | --- |
| Hero video | Assente, hero con placeholder statico | La homepage comunica bene il tono ma non mostra ancora materia reale | Alta | Selezionare video hero dal catalogo locale, ottimizzarlo e prevedere poster |
| Brochure espositori | CTA presente ma nessun file in `public/downloads` | Conversione commerciale incompleta | Alta | Pubblicare brochure reale o placeholder controllato con percorso chiaro |
| Pass buyer | CTA presente ma senza form o criteri | Funnel buyer non ancora operativo | Alta | Definire microcopy, criteri di richiesta e form dedicato |
| Logo orizzontale | Assente | Header/footer basati su logo quadrato e fallback tipografico | Alta | Preparare wordmark orizzontale per navbar e footer |
| Form lead | Assenti | Il sito orienta alla conversione ma non la completa | Alta | Introdurre form espositori e buyer o soluzione transitoria tracciabile |
| Media kit | Sezione media presente, file assenti | Press room ancora non operativa | Media | Preparare kit, loghi e materiali stampa con naming stabile |
| Tracking conversioni | Non rilevato | Nessuna misura chiara delle CTA e dei funnel | Media | Pianificare analytics, eventi CTA e misurazione form |
| Contenuti legali | Privacy e cookie placeholder | Rischio reputazionale e legale in go-live | Alta | Sostituire placeholder con testi approvati prima di pubblicare |
| Performance | Base buona, pochi asset pesanti versionati | Rischio futuro con video hero e asset reali | Media | Ottimizzare video, poster, immagini e controllare LCP/CLS |
| SEO | Metadata base presenti | Mancano architettura editoriale profonda, schema e contenuti avanzati | Media | Rafforzare Diario del Sud, metadata per pagina, OG e struttura contenuti |
| Video catalogati | Catalogo presente in `src/data/videos.ts` | I video non sono ancora integrati e restano esterni al repo | Media | Usare il catalogo come base di selezione senza duplicare file |
| Download buyer | Cartella predisposta, file assenti | Percorso buyer non supportato da materiali scaricabili | Media | Preparare brochure buyer o scheda sintetica |
| Grand Prix | Pagina presente, dettagli non confermati | Rischio di ambiguità se la pagina viene resa troppo operativa | Media | Tenere il posizionamento, aggiungere dettagli solo dopo validazione |
| Contatti | Placeholder espliciti in footer e pagina contatti | Mancano recapiti ufficiali pubblicabili | Alta | Verificare email, telefono, sede e ownership dei contatti |

## 7. Obiettivi della prossima sessione di lavoro

### Priorità 1 — demo visiva

- scegliere il video hero dal catalogo locale
- ottimizzare il video per web e produrre poster statico
- aggiornare la hero senza appesantire il progetto
- rafforzare le CTA principali in apertura

### Priorità 2 — conversione B2B

- collegare la brochure espositori o un placeholder controllato
- creare o raffinare un form espositori
- creare o raffinare un form buyer
- differenziare meglio i percorsi commerciali da quelli editoriali

### Priorità 3 — credibilità

- aggiornare header e footer con asset logo finali
- preparare media kit scaricabile
- verificare i contatti pubblicabili
- completare privacy e cookie con testi approvati

### Priorità 4 — contenuto

- strutturare il Diario del Sud come asse editoriale reale
- chiarire il ruolo del Grand Prix
- sviluppare meglio la pagina programma/evento
- dare più spessore ai percorsi per partner e media

## 8. Regole editoriali e operative

- Non inventare dati, date, numeri, sponsor, partner, buyer confermati o regolamenti
- Usare placeholder espliciti quando un’informazione non è validata
- Distinguere sempre tra fatti confermati, ipotesi operative e idee creative
- Mantenere CTA orientate al beneficio e all’azione utile
- Evitare `clicca qui`, `scopri di più` deboli o formule generiche senza valore
- Usare tono B2B diretto per espositori, buyer, partner e media
- Usare tono B2C caldo e sensoriale per visitatori ed esperienza
- Non trasformare il sito in fiera generalista o in racconto folkloristico
- Tenere i contenuti pronti a futura integrazione CMS, senza introdurla ora
- Non pubblicare come fatto nessun dato segnato nel progetto come **Da verificare**

## 9. Checklist finale

- [ ] Homepage coerente con il posizionamento premium mediterraneo
- [ ] Hero reale con video o visual definitivo, non placeholder
- [ ] CTA principali funzionanti e instradate correttamente
- [ ] Brochure espositori disponibile oppure placeholder controllato e dichiarato
- [ ] Form attivi oppure soluzione provvisoria tracciabile
- [ ] Logo leggibile e adatto a header/footer
- [ ] Mobile verificato con asset finali
- [ ] `npm run build` e `npm run lint` ok
- [ ] Nessun dato non verificato pubblicato come fatto
- [ ] Privacy e cookie non più placeholder
- [ ] Contatti footer e pagina contatti verificati
