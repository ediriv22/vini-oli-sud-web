# Vini Oli Sud — Brief per valutazione design esterna

## 1. Obiettivo della valutazione

Questo documento serve a richiedere una valutazione esterna della demo attuale del sito Vini Oli Sud.

La valutazione deve concentrarsi su:
- qualità premium percepita
- coerenza brand
- UX e conversione
- leggibilità
- resa mobile
- equilibrio tra contenuto editoriale e obiettivo commerciale

L’obiettivo non è una review tecnica del codice, ma una lettura critica della direzione visiva e dell’efficacia della homepage come strumento di posizionamento e conversione.

## 2. Posizionamento del progetto

Vini Oli Sud è pensato come:
- salone boutique dedicato a vini e oli del Sud Italia
- piattaforma business-oriented per espositori, buyer, visitatori, media e partner
- progetto connesso al Napoli Racing Show
- identità mediterranea, premium, territoriale

Punti chiave da tenere presenti:
- non deve sembrare una copia di Vinitaly
- non deve sembrare una fiera generalista
- deve trasmettere autorevolezza, desiderabilità, selezione e carattere contemporaneo

## 3. Stato attuale della homepage

La homepage attuale è stata volutamente ridotta a una landing corta composta da:

1. Header con wordmark testuale
2. Hero con video vigneto/vulcano
3. Quattro accessi principali:
   - Espositori
   - Buyer
   - Visitatori
   - Media/Partner
4. Concept “Dove la terra incontra la pista”
5. Quattro pilastri:
   - Origine Classica
   - Natura Pura
   - Memoria Liquida
   - Adrenalina
6. CTA finale

Asset hero attuali:
- `public/videos/hero-vigneto.mp4`
- `public/videos/hero-vigneto-poster.jpg`

## 4. Cosa è già stato migliorato

Interventi già eseguiti sulla demo:
- home accorciata
- rimozione di sezioni troppo editoriali o magazine dalla homepage
- riduzione di card pesanti e blocchi troppo “dashboard”
- riduzione del blu come massa cromatica
- rimozione di gradienti troppo fangosi o decorativi
- font riallineati al brand kit
- video hero leggero integrato
- poster hero creato
- warning di hydration gestito in modo mirato
- pilastri ordinati in un layout più editoriale

## 5. Cosa vogliamo far valutare

Checklist di valutazione:

- Header: proporzioni, logo testuale, burger, pulizia generale
- Hero: impatto del video, qualità overlay, leggibilità H1, efficacia CTA
- Accessi: chiarezza dei percorsi e capacità di conversione
- Concept: qualità editoriale, ordine e leggibilità dei pilastri
- CTA finale: forza commerciale e raffinatezza visiva
- Mobile: leggibilità, ritmo verticale, ingombri e priorità
- Performance percepita
- Coerenza complessiva con un brand premium mediterraneo

## 6. Criticità ancora aperte

Elementi non ancora consolidati o da verificare:
- contatti e dati legali ancora da verificare
- brochure e media kit non ancora collegati in modo definitivo
- form lead non ancora definitivi
- repo da rendere pubblica o deploy da condividere al reviewer
- possibile ulteriore accorciamento della home
- necessità di valutare se alcune informazioni debbano vivere solo nelle pagine interne
- verifica finale di accessibilità e contrasti sul video hero

## 7. Domande precise per il reviewer

1. La homepage comunica subito un salone premium vino/olio del Sud?
2. Il collegamento con Napoli Racing Show è chiaro ma non invadente?
3. Il video hero migliora davvero il posizionamento?
4. La home è ancora troppo lunga?
5. Gli accessi Espositori/Buyer/Visitatori/Media sono abbastanza chiari?
6. La palette sembra raffinata o ancora troppo “template”?
7. La tipografia comunica autorevolezza?
8. La CTA finale spinge abbastanza alla conversione?
9. Cosa toglieresti?
10. Quali sono le prime 5 correzioni da fare?

## 8. Prompt pronto per AI reviewer

Copiare il prompt qui sotto in un’altra AI insieme agli screenshot della demo.

```text
Sto lavorando alla homepage di un sito chiamato Vini Oli Sud.

Contesto:
- È un progetto premium mediterraneo dedicato a vini e oli del Sud Italia
- È business-oriented: deve parlare a espositori, buyer, visitatori, media e partner
- È collegato al Napoli Racing Show, ma non deve sembrare un sito motorsport
- Non deve sembrare una copia di Vinitaly o una fiera generalista
- La direzione visiva richiesta è: Boutique Editoriale Mediterranea

Brand kit:
- Titoli/wordmark: Cormorant Garamond SemiBold
- Navigazione/label/CTA: Montserrat SemiBold
- Corpo testo: Source Sans 3
- Palette: verde profondo, oro Magna Grecia, rosso Aglianico, avorio/pietra, blu Napoli solo come micro-accento

Struttura homepage:
1. Header con wordmark testuale
2. Hero con video vigneto/vulcano
3. Quattro accessi principali: Espositori, Buyer, Visitatori, Media/Partner
4. Concept “Dove la terra incontra la pista”
5. Quattro pilastri: Origine Classica, Natura Pura, Memoria Liquida, Adrenalina
6. CTA finale

Ti chiedo una valutazione UX/UI molto concreta della homepage basata sugli screenshot allegati.

Voglio che la tua risposta includa:
- una valutazione generale del posizionamento visivo
- punti forti
- debolezze
- problemi di UX
- problemi di gerarchia visiva
- problemi di conversione
- lettura mobile presumibile se visibile dagli screenshot
- una lista di priorità High / Medium / Low
- suggerimenti specifici su layout, colore, font, CTA e ritmo delle sezioni
- cosa non cambiare
- cosa togliere
- come aumentare la percezione premium
- come rendere la home più commerciale senza perdere anima editoriale

Per favore evita consigli vaghi.
Voglio indicazioni molto pratiche, con esempi di cosa semplificare, cosa accorciare, cosa ridurre e cosa enfatizzare.

Non inventare dati di business, sponsor, partner, date o prezzi.
Concentrati solo su design, UX, conversione e coerenza brand.
```

## 9. Materiali da allegare

Materiali consigliati da allegare al reviewer:
- screenshot desktop hero
- screenshot desktop accessi
- screenshot desktop concept
- screenshot desktop CTA finale
- screenshot mobile hero
- screenshot mobile accessi
- link repo se pubblica
- eventuale link deploy
- `docs/SITE_REVIEW_AND_GOALS.md`
- `docs/HERO_VIDEO_SELECTION.md`

## 10. Nota “Da verificare”

La valutazione esterna non deve usare dati non confermati.

In particolare:
- non inventare sponsor
- non inventare date
- non inventare prezzi
- non inventare buyer
- non inventare partner

La valutazione deve concentrarsi su:
- design
- UX
- conversione
- coerenza brand
