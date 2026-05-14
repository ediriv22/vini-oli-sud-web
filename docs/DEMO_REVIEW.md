# Demo Review

Review svolta su codice e struttura attuale della demo Next.js/Tailwind/TypeScript, senza modificare componenti o contenuti di produzione.

Verifiche eseguite:
- lettura di homepage, layout condivisi, data layer e pagine interne
- controllo di accessibilità e SEO evidenti da codice
- verifica asset principali del hero
- `npm run lint` OK
- `npm run build` OK con accesso rete; in sandbox falliva solo per fetch dei Google Fonts via `next/font`

## A. Cosa funziona

- La homepage è breve e ordinata: `HeroSection`, `AudienceGateway`, `ConceptSection`, `CtaBand` costruiscono un percorso compatto e coerente con l’obiettivo di non sembrare una fiera generalista ([src/app/page.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/app/page.tsx:1)).
- Above the fold: il hero mette subito in evidenza le due CTA prioritarie corrette, con “Richiedi la Brochure Espositori” e “Richiedi il Pass Buyer” prima di “Esplora il Programma” ([src/components/sections/HeroSection.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/components/sections/HeroSection.tsx:35)).
- La direzione visiva è già coerente con il brand richiesto: palette verde, oro, avorio, vino; typography editoriale; superfici leggere e calde ([src/app/globals.css](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/app/globals.css:1)).
- Il data layer è centralizzato e pronto a futura integrazione CMS: navigazione, homepage e pagine statiche sono governate da `src/data` ([src/data/site.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/site.ts:3), [src/data/pages.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/pages.ts:20), [src/data/navigation.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/navigation.ts:1)).
- Le pagine interne hanno una buona base di coerenza strutturale grazie a un template unico, con H1 chiaro, summary laterale e blocco “Da verificare” dove serve ([src/components/sections/InternalPageTemplate.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/components/sections/InternalPageTemplate.tsx:15)).
- Accessibilità di base presente: skip link, `lang="it"`, pulsante menu con `aria-expanded`, focus ring esplicito sui button component ([src/app/layout.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/app/layout.tsx:84), [src/components/layout/Header.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/components/layout/Header.tsx:61), [src/components/ui/Button.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/components/ui/Button.tsx:52)).
- Il hero evita layout shift grave: poster immagine prioritario, video con `poster` e `preload="metadata"`, figure con altezza minima definita ([src/components/sections/HeroSection.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/components/sections/HeroSection.tsx:58)).
- Metadata globali presenti e corretti come base: title template, description, favicon, OG e Twitter image globale ([src/app/layout.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/app/layout.tsx:32)).

## B. Problemi da correggere subito

- Le CTA delle pagine interne rompono la logica dei percorsi: quasi tutte puntano a `/contatti`, anche quando il label promette un’azione specifica. Esempi: “Esplora il Programma” dalla pagina evento, “Richiedi la Brochure Espositori”, “Richiedi il Pass Buyer”, “Scarica il Media Kit” ([src/data/pages.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/pages.ts:21), [src/data/pages.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/pages.ts:65), [src/data/pages.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/pages.ts:105), [src/data/pages.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/pages.ts:269)). Per una demo commerciale questo crea frizione e percezione di incompiutezza.
- Alcune CTA promettono funzioni non confermate. “Acquista il Carnet Degustazione” su Visitatori e “Iscrivi il tuo prodotto al Grand Prix” implicano ticketing o iscrizioni attive che il sito stesso dichiara non ancora definiti ([src/data/pages.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/pages.ts:145), [src/data/pages.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/pages.ts:185)). Questo è il punto più delicato lato credibilità.
- Il percorso Media/Partner è incoerente. In homepage la quarta card viene forzata a “Proponi una Partnership” con link `/contatti`, mentre nei dati sorgente l’audience è “Media e Partner” con CTA “Scarica il Media Kit” e la pagina media usa ancora quel registro ([src/components/sections/AudienceGateway.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/components/sections/AudienceGateway.tsx:7), [src/data/site.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/site.ts:81)). Oggi il messaggio cambia a seconda del punto d’ingresso.
- Header: la CTA principale scompare fino a breakpoint `xl`. Su tablet e laptop medi resta solo il menu hamburger, quindi il percorso commerciale prioritario perde visibilità persistente proprio nei viewport più frequenti ([src/components/layout/Header.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/components/layout/Header.tsx:31), [src/components/layout/Header.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/components/layout/Header.tsx:55)).
- SEO social delle pagine interne: `createPageMetadata()` ridefinisce `openGraph` e `twitter` senza immagini. In Next questo rischia di sostituire l’oggetto ereditato dal layout, lasciando le pagine interne senza immagine Open Graph/Twitter condivisibile ([src/data/site.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/site.ts:183)).
- Il hero video è ancora pesante per la prima impressione: `public/videos/hero-vigneto.mp4` pesa circa 5.2 MB per 8 secondi a 1920x1080. Per una demo elegante è accettabile solo se il video resta davvero secondario al poster e non condiziona mobile/data saver ([public/videos/hero-vigneto.mp4](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/public/videos/hero-vigneto.mp4)).
- Rischio di coerenza narrativa: alcune parti del sito presentano l’aggancio al Napoli Racing Show come fatto acquisito, mentre altre sezioni lo trattano come elemento ancora da validare. Questa doppia postura indebolisce l’autorevolezza complessiva ([src/data/site.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/site.ts:6), [src/data/pages.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/pages.ts:58)).

## C. Migliorie consigliate

- Homepage mobile: il hero è concettualmente corretto, ma la combinazione di titolo molto ampio, video affiancato e doppia CTA lunga può diventare densa su schermi piccoli. Serve una rifinitura di spaziature e gerarchie, non una riscrittura ([src/components/sections/HeroSection.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/components/sections/HeroSection.tsx:10)).
- Header mobile: aggiungere in futuro `aria-controls` e uno stato focus più leggibile sui link di navigazione migliorerebbe l’accessibilità. Oggi i button hanno focus forte, i link testuali molto meno esplicito ([src/components/layout/Header.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/components/layout/Header.tsx:61), [src/components/ui/Button.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/components/ui/Button.tsx:52)).
- Footer: la struttura è solida, ma il blocco contatti resta molto generico. Per una demo business-oriented conviene arrivare presto a placeholder più strutturati per email commerciale, ufficio buyer e media desk, chiaramente marcati come “in aggiornamento” ([src/components/layout/Footer.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/components/layout/Footer.tsx:59), [src/data/site.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/site.ts:39)).
- Copy: la direzione è giusta, ma alcune formule restano astratte o autocelebrative. Le pagine Espositori e Buyer funzionano meglio quando parlano di accesso, selezione, lead, accredito; Visitatori rende bene quando resta sensoriale e non transazionale ([src/data/pages.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/pages.ts:65), [src/data/pages.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/pages.ts:105), [src/data/pages.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/pages.ts:145)).
- SEO: aggiungere in uno sprint successivo canonical, OG image esplicita per ogni pagina e metadata più distintivi per le audience principali migliorerebbe la resa editoriale senza cambiare architettura ([src/app/layout.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/app/layout.tsx:32), [src/app/espositori/page.tsx](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/app/espositori/page.tsx:8)).
- Brand asset: in `siteConfig` esistono riferimenti a file logo non presenti (`/brand/logo.svg`, `/brand/logo-dark.svg`, `/brand/logo-light.svg`). Oggi non bloccano perché il componente usa altri asset, ma sono un rischio silente per future estensioni ([src/data/site.ts](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/src/data/site.ts:19)).
- Performance: il logo orizzontale PNG usato nel fallback pesa oltre 1.5 MB. Non è il percorso renderizzato principale dell’header attuale, ma va considerato se il componente tornerà a usare asset raster veri ([public/brand/logo-horizontal-cropped.png](/Users/edvigerivellini/Desktop/VINISUD/vini-oli-sud-web/public/brand/logo-horizontal-cropped.png)).

## D. Modifiche da NON fare ora

- Non allungare la homepage reinserendo subito tutte le sezioni disponibili. La brevità attuale è un vantaggio; aggiungere `RegionsSection` o `EditorialPreview` ora rischia di riportare il sito verso una logica da portale generalista.
- Non introdurre date, programma dettagliato, ticketing, prezzi, regolamenti, giurie o numeri non validati solo per “riempire” le pagine.
- Non caricare nuovi video pesanti o clip locali fuori repo. La demo deve restare leggera e credibile con poster, asset esistenti e placeholder controllati.
- Non aprire ora un CMS o una struttura dati più complessa. L’attuale centralizzazione in `src/data` è sufficiente per il prossimo sprint.
- Non cambiare drasticamente palette, tipografia o impianto editoriale: il linguaggio visivo è già abbastanza vicino alla boutique mediterranea premium richiesta.

## E. Sprint successivo proposto

1. Riallineare tutte le CTA ai percorsi reali della demo: Espositori su `/espositori`, Buyer su `/buyer`, Programma su `/evento`, Media su `/media`, Partnership su `/contatti`.
2. Eliminare o riformulare le promesse non ancora attive: ticketing visitatori, iscrizione Grand Prix, download media kit se il file non esiste.
3. Rendere la CTA principale del header sempre visibile almeno da `lg`, lasciando il menu mobile solo dove serve davvero.
4. Correggere metadata per pagine interne con OG/Twitter image esplicita e verificare eventuale canonical.
5. Rifinire accessibilità e mobile polish: focus state dei link, `aria-controls` del menu, controllo contrasto delle CTA secondarie testuali.
6. Valutare una compressione ulteriore del hero video o una strategia più conservativa su mobile, mantenendo il poster come primo frame forte.

