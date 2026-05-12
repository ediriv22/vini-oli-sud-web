export type StaticPageContent = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  summary: string;
  pillars: string[];
  focusTitle: string;
  focusIntro: string;
  sections: Array<{
    eyebrow: string;
    title: string;
    description: string;
  }>;
  verifyNotes?: string[];
  metadataDescription: string;
};

export const staticPages: Record<string, StaticPageContent> = {
  evento: {
    eyebrow: "L'evento",
    title: "L’evento",
    description:
      "Nel cuore di Napoli, tra mare, Vesuvio, motorsport e hospitality, Vini Oli Sud costruisce una scena dove il racconto del gusto mediterraneo dialoga con l’energia del Napoli Racing Show.",
    ctaLabel: "Esplora il Programma",
    ctaHref: "/contatti",
    summary:
      "La pagina evento dovrà diventare il punto di sintesi tra concept, atmosfera e logistica narrativa: cosa succede, dove succede e perché vale esserci.",
    pillars: [
      "Napoli come scenario iconico e contemporaneo",
      "Motorsport come acceleratore di attenzione e posizionamento",
      "Vino e olio come esperienza culturale e business platform",
    ],
    focusTitle: "Un format da raccontare come esperienza.",
    focusIntro:
      "Per ora la pagina imposta il tono: premium, emozionale ma leggibile, pronta ad accogliere in Sprint successivi programma, venue details e format experience.",
    sections: [
      {
        eyebrow: "Scenario",
        title: "Napoli, mare e Vesuvio.",
        description:
          "L’identità visiva e testuale parte da una città che ha forza scenica e riconoscibilità internazionale.",
      },
      {
        eyebrow: "Connessione",
        title: "Pista e terroir nello stesso racconto.",
        description:
          "Il contrasto tra velocità e lentezza diventa asset narrativo, non semplice contesto accessorio.",
      },
      {
        eyebrow: "Sviluppo",
        title: "Programma e format da dettagliare.",
        description:
          "Sessioni, degustazioni, incontri e show moment saranno integrati quando dati e calendario saranno confermati.",
      },
    ],
    verifyNotes: [
      "Date, venue details e programma ufficiale del format devono essere confermati.",
      "Ogni riferimento operativo collegato al Napoli Racing Show va pubblicato solo dopo validazione.",
    ],
    metadataDescription:
      "Scopri il concept di Vini Oli Sud tra Napoli, mare, motorsport e cultura mediterranea.",
  },
  espositori: {
    eyebrow: "Espositori",
    title: "Porta la tua azienda in pole position sul mercato mediterraneo.",
    description:
      "Una piattaforma progettata per dare visibilità commerciale, incontri utili e posizionamento distintivo a produttori, consorzi e marchi del gusto del Sud Italia.",
    ctaLabel: "Richiedi la Brochure Espositori",
    ctaHref: "/contatti",
    summary:
      "Il percorso espositori deve chiarire ROI, audience, formula e vantaggi competitivi: niente vaghezza fieristica, ma argomenti orientati a lead e business presence.",
    pillars: [
      "Buyer, operatori e pubblico premium nello stesso ecosistema",
      "Visibilità editoriale e narrativa oltre la sola presenza fisica",
      "Contesto distintivo legato al Napoli Racing Show",
    ],
    focusTitle: "Perché esporre qui.",
    focusIntro:
      "Questa pagina prepara il terreno per brochure, form di lead generation, pacchetti e proof points da inserire negli sprint successivi.",
    sections: [
      {
        eyebrow: "Lead",
        title: "Accesso a buyer e operatori.",
        description:
          "Il focus non è il volume indistinto, ma la qualità delle connessioni e delle conversazioni attivabili.",
      },
      {
        eyebrow: "Brand",
        title: "Presenza premium e riconoscibile.",
        description:
          "Il contesto valorizza chi produce con identità, aiutando a evitare l’effetto catalogo o padiglione anonimo.",
      },
      {
        eyebrow: "Storytelling",
        title: "Un racconto che continua online.",
        description:
          "Il portale diventa anche leva editoriale per estendere attenzione e reputazione oltre i giorni dell’evento.",
      },
    ],
    metadataDescription:
      "Scopri perché esporre a Vini Oli Sud e richiedi la brochure espositori.",
  },
  buyer: {
    eyebrow: "Buyer e operatori",
    title: "Il tuo accesso ai migliori terroir del Sud Italia.",
    description:
      "Un hub selettivo pensato per chi cerca scouting, relazioni dirette e una lettura ordinata dell’offerta mediterranea tra vino, olio e cultura produttiva.",
    ctaLabel: "Richiedi il Pass Buyer",
    ctaHref: "/contatti",
    summary:
      "La pagina buyer deve rassicurare su qualità dell’esperienza, accesso facilitato e rilevanza dei contatti. Il tono resta business-first, non turistico.",
    pillars: [
      "Scouting produttivo in un contesto ad alta densità narrativa",
      "Accredito e accesso pensati per operatori qualificati",
      "Percorso chiaro verso contatto, agenda e materiali utili",
    ],
    focusTitle: "Un hub di selezione, non dispersione.",
    focusIntro:
      "In futuro questa area potrà integrare form di richiesta, criteri di accesso e vantaggi per buyer nazionali e internazionali.",
    sections: [
      {
        eyebrow: "Selezione",
        title: "Terroir leggibili e ordinati.",
        description:
          "Il sito deve aiutare a capire rapidamente dove si concentra il valore e quali aree esplorare.",
      },
      {
        eyebrow: "Operatività",
        title: "Contatti e accrediti senza frizione.",
        description:
          "Meno barriere informative, più chiarezza su come ottenere accesso e materiali di supporto.",
      },
      {
        eyebrow: "Relazione",
        title: "Networking con contesto.",
        description:
          "Non solo incontri: anche un racconto coerente che valorizza origine, prodotto e posizionamento.",
      },
    ],
    metadataDescription:
      "Richiedi il pass buyer e accedi ai migliori terroir del Sud Italia.",
  },
  visitatori: {
    eyebrow: "Visitatori",
    title: "Assapora il Sud, vista mare.",
    description:
      "Degustazioni, show cooking e cultura mediterranea prendono forma in un’esperienza capace di tenere insieme piacere, scoperta e qualità estetica.",
    ctaLabel: "Acquista il Carnet Degustazione",
    ctaHref: "/contatti",
    summary:
      "Questa area deve parlare al pubblico con un registro sensoriale e caldo, ma sempre ordinato: far desiderare l’esperienza senza sembrare generico intrattenimento.",
    pillars: [
      "Percorso emozionale tra vini, oli e cucina mediterranea",
      "Scenario iconico sul lungomare di Napoli",
      "Informazioni pronte per ticketing e experience design futuri",
    ],
    focusTitle: "Un invito a vivere il Mezzogiorno contemporaneo.",
    focusIntro:
      "La struttura è pronta a ospitare programma pubblico, esperienze speciali, ticket e contenuti pratici quando disponibili.",
    sections: [
      {
        eyebrow: "Degustazione",
        title: "Calici, oli e sapori in sequenza.",
        description:
          "Il tono racconta il piacere della scoperta, non l’accumulo indistinto di proposte.",
      },
      {
        eyebrow: "Scenario",
        title: "Vista mare, identità urbana, atmosfera.",
        description:
          "Napoli entra come cornice attiva dell’esperienza, non solo come indicazione geografica.",
      },
      {
        eyebrow: "Evoluzione",
        title: "Ticketing e programma da integrare.",
        description:
          "I prossimi sprint potranno attivare call to action più operative per visitatori e degustatori.",
      },
    ],
    metadataDescription:
      "Scopri l’esperienza visitatori di Vini Oli Sud sul lungomare di Napoli.",
  },
  "grand-prix": {
    eyebrow: "Grand Prix",
    title: "Grand Prix Magna Grecia",
    description:
      "Uno spazio dedicato a valorizzare prodotti, territori e riconoscibilità, con una narrazione capace di unire autorevolezza e desiderabilità.",
    ctaLabel: "Iscrivi il tuo prodotto al Grand Prix",
    ctaHref: "/contatti",
    summary:
      "Finché regolamento, categorie e criteri non sono confermati, la pagina deve posizionare il Grand Prix senza inventare dettagli né creare aspettative scorrette.",
    pillars: [
      "Premialità come leva di reputazione",
      "Narrazione coerente con la visione mediterranea premium",
      "Struttura pronta per regolamento, categorie e iscrizioni",
    ],
    focusTitle: "Un asset da attivare con rigore.",
    focusIntro:
      "La pagina imposta tono e spazio strategico. I dettagli operativi saranno inseriti solo dopo conferma ufficiale.",
    sections: [
      {
        eyebrow: "Autorevolezza",
        title: "Un riconoscimento da costruire bene.",
        description:
          "Premi e selezioni funzionano solo se linguaggio, criteri e presentazione risultano credibili e misurati.",
      },
      {
        eyebrow: "Visibilità",
        title: "Vetrina per prodotti e territori.",
        description:
          "Il Grand Prix può diventare contenuto editoriale, leva PR e motore di attenzione qualificata.",
      },
      {
        eyebrow: "Governance",
        title: "Regole da pubblicare solo se validate.",
        description:
          "Questa sprint evita ogni dato non confermato e prepara una base pronta per la fase successiva.",
      },
    ],
    verifyNotes: [
      "Il regolamento ufficiale, le categorie e i criteri di valutazione non sono ancora confermati.",
      "La meccanica di iscrizione va definita solo dopo approvazione organizzativa.",
    ],
    metadataDescription:
      "Scopri il Grand Prix Magna Grecia di Vini Oli Sud.",
  },
  "diario-del-sud": {
    eyebrow: "Diario del Sud",
    title: "Diario del Sud",
    description:
      "Un magazine proprietario che racconta territori, produttori, oli, vini e immaginari mediterranei con una voce autorevole e contemporanea.",
    ctaLabel: "Esplora le rubriche",
    ctaHref: "/contatti",
    summary:
      "Il Diario del Sud non è un blog riempitivo: deve diventare motore editoriale, asset SEO e strumento di reputazione per l’intero ecosistema del progetto.",
    pillars: [
      "Linea editoriale chiara e riconoscibile",
      "Rubriche capaci di tenere insieme cultura e business",
      "Base pronta per una futura architettura contenutistica più profonda",
    ],
    focusTitle: "Contenuti con valore di marca.",
    focusIntro:
      "Questa pagina prepara la futura sezione editoriale e ne definisce il ruolo strategico nel posizionamento del brand.",
    sections: [
      {
        eyebrow: "SEO",
        title: "Indicizzazione con senso.",
        description:
          "I contenuti devono intercettare interesse reale su territori, prodotti e business mediterraneo.",
      },
      {
        eyebrow: "Marca",
        title: "Una voce che differenzia.",
        description:
          "Il tone of voice evita burocratese, folklore e imitazioni di fiere generaliste.",
      },
      {
        eyebrow: "Pipeline",
        title: "Base per rubriche e longform futuri.",
        description:
          "La struttura è pronta per evolvere verso articoli, dossier e serie proprietarie.",
      },
    ],
    metadataDescription:
      "Scopri il Diario del Sud, magazine editoriale di Vini Oli Sud.",
  },
  media: {
    eyebrow: "Media",
    title: "Press Room Vini Oli Sud",
    description:
      "Un’area pensata per giornalisti, redazioni, uffici stampa e stakeholder che hanno bisogno di materiali affidabili, rapidi da consultare e pronti alla pubblicazione.",
    ctaLabel: "Scarica il Media Kit",
    ctaHref: "/contatti",
    summary:
      "La press room deve essere sobria, credibile e immediata: niente iperbole promozionale, sì a chiarezza, asset scaricabili e riferimenti stampa verificati.",
    pillars: [
      "Comunicati, immagini e accrediti ben organizzati",
      "Tono chiaro e pronto per utilizzo editoriale",
      "Base per futura media room con download e kit ufficiali",
    ],
    focusTitle: "Materiali pronti alla pubblicazione.",
    focusIntro:
      "In questa sprint creiamo il tono e il contenitore. I file ufficiali entreranno solo quando confermati dall’organizzazione.",
    sections: [
      {
        eyebrow: "Stampa",
        title: "Comunicati e note ufficiali.",
        description:
          "L’area sarà predisposta per aggiornamenti chiari, facilmente citabili e sempre coerenti con i dati validati.",
      },
      {
        eyebrow: "Asset",
        title: "Immagini e materiali scaricabili.",
        description:
          "La sezione è pronta per ospitare kit media, logo pack e fotografie approvate.",
      },
      {
        eyebrow: "Accrediti",
        title: "Percorso dedicato ai media.",
        description:
          "Nelle fasi successive potrà integrare richieste accredito e contatti stampa operativi.",
      },
    ],
    verifyNotes: [
      "I file scaricabili e i contatti stampa ufficiali dovranno essere inseriti dopo validazione.",
    ],
    metadataDescription:
      "Accedi alla press room di Vini Oli Sud con materiali e informazioni per i media.",
  },
  contatti: {
    eyebrow: "Contatti",
    title: "Contatti",
    description:
      "Una pagina di raccordo per richieste commerciali, accrediti, partnership e informazioni organizzative, con spazio per trasformarsi in hub operativo nei prossimi sprint.",
    ctaLabel: "Scrivi alla Segreteria",
    ctaHref: "mailto:segreteria@placeholder.viniolisud.it",
    summary:
      "In assenza di dati confermati, questa pagina usa riferimenti placeholder espliciti e mantiene il tono istituzionale senza fingere informazioni non validate.",
    pillars: [
      "Contatti separabili per area in sprint futuri",
      "Placeholder dichiarati per evitare dati inventati",
      "Punto di conversione per brochure, pass e partnership",
    ],
    focusTitle: "Base pronta per la segreteria operativa.",
    focusIntro:
      "Qui potranno confluire form, recapiti ufficiali e percorsi dedicati per ogni audience del progetto.",
    sections: [
      {
        eyebrow: "Commerciale",
        title: "Espositori, sponsor e partnership.",
        description:
          "La pagina dovrà distinguere le richieste business da quelle informative, migliorando qualità e instradamento dei lead.",
      },
      {
        eyebrow: "Operativo",
        title: "Buyer, media e accreditamenti.",
        description:
          "Ogni audience avrà bisogno di un percorso di contatto più preciso, da attivare quando processi e dati saranno confermati.",
      },
      {
        eyebrow: "Trasparenza",
        title: "Placeholder chiari fino a conferma.",
        description:
          "Meglio un dato dichiarato come provvisorio che un recapito inventato o ambiguo.",
      },
    ],
    verifyNotes: [
      "Email, telefono, sede e eventuali referenti di area sono placeholder finché non confermati.",
    ],
    metadataDescription:
      "Contatta la segreteria di Vini Oli Sud per informazioni, brochure e partnership.",
  },
};
