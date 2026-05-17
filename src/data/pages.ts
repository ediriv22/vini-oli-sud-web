export type StaticPagePillar = {
  title: string;
  description: string;
};

export type StaticPageExternalReference = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  url: string;
};

export type StaticPageContent = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaNote?: string;
  summary: string;
  pillars: StaticPagePillar[];
  focusTitle: string;
  focusIntro: string;
  sections: Array<{
    eyebrow: string;
    title: string;
    description: string;
  }>;
  verifyNotes?: string[];
  externalReference?: StaticPageExternalReference;
  metadataDescription: string;
};

const generalPositioningPillars: StaticPagePillar[] = [
  {
    title: "Napoli come palcoscenico mediterraneo",
    description:
      "Il progetto valorizza mare, città e immaginario del Mezzogiorno come cornice riconoscibile per vino, olio e relazioni commerciali.",
  },
  {
    title: "Vino e olio come cultura viva",
    description:
      "Il prodotto non è trattato come semplice esposizione, ma come racconto di territorio, filiere, memoria e valore.",
  },
  {
    title: "Business con anima territoriale",
    description:
      "Il format orienta produttori, buyer, visitatori, media e partner verso percorsi chiari, concreti e distintivi.",
  },
];

const buyerPositioningPillars: StaticPagePillar[] = [
  {
    title: "Selezione più leggibile",
    description:
      "Un percorso pensato per aiutare operatori, distributori, ristoratori e buyer a orientarsi tra prodotti, territori e opportunità.",
  },
  {
    title: "Contatti qualificati",
    description:
      "Il valore non è nella quantità indistinta, ma nella qualità delle relazioni e nella chiarezza dei percorsi di accesso.",
  },
  {
    title: "Materiali e agenda",
    description:
      "Le informazioni operative devono accompagnare il buyer verso contatto, richiesta pass e approfondimenti commerciali.",
  },
];

export const staticPages: Record<string, StaticPageContent> = {
  evento: {
    eyebrow: "L'evento",
    title: "L’evento",
    description:
      "Nel cuore di Napoli, tra mare, Vesuvio, motorsport e hospitality, Vini Oli Sud costruisce una scena dove il racconto del gusto mediterraneo dialoga con l’energia del Napoli Racing Show.",
    ctaLabel: "Richiedi informazioni evento",
    ctaHref: "/contatti?interesse=visitatori#richiesta-informazioni",
    ctaNote: "Per manifestare interesse e ricevere aggiornamenti, scrivi alla segreteria dalla pagina contatti.",
    summary:
      "Vini Oli Sud unisce il racconto del gusto mediterraneo, la cultura del vino e dell'olio del Sud Italia con l'energia e la visibilità del Napoli Racing Show. Un palcoscenico unico dove produttori, buyer e visitatori si incontrano in un contesto premium e distintivo.",
    pillars: generalPositioningPillars,
    externalReference: {
      eyebrow: "Approfondimento istituzionale",
      title: "I prodotti campani al Napoli Racing Show",
      description:
        "Un riferimento esterno utile per inquadrare il dialogo tra produzioni agroalimentari, territorio e Napoli Racing Show.",
      ctaLabel: "Leggi sul sito Regione Campania",
      url: "https://www.agricoltura.regione.campania.it/eventi/evento-06-12-25.html",
    },
    focusTitle: "Tre pillar di posizionamento.",
    focusIntro:
      "Vini Oli Sud costruisce il suo racconto su tre fondamenta: il territorio napoletano, il dialogo tra vino/olio e velocità, la capacità di trasformare degustazione in relazione commerciale.",
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
        eyebrow: "Cultura e Connessione",
        title: "Degustazioni, talk e incontri B2B.",
        description:
          "Un programma progettato per coniugare l'esperienza sensoriale della degustazione con opportunità concrete di relazioni commerciali e racconto editoriale.",
      },
    ],
    verifyNotes: [],
    metadataDescription:
      "Vini Oli Sud: scenario, identità e edizione 2026 del salone boutique dei terroir del Mezzogiorno, in dialogo con Napoli Racing Show.",
  },
  espositori: {
    eyebrow: "Espositori",
    title: "Porta la tua azienda in pole position sul mercato mediterraneo.",
    description:
      "Una piattaforma progettata per dare visibilità commerciale, incontri utili e posizionamento distintivo a produttori, consorzi e marchi del gusto del Sud Italia.",
    ctaLabel: "Richiedi la Brochure Espositori",
    ctaHref: "/contatti?interesse=espositori#richiesta-informazioni",
    ctaNote:
      "Richiedi la brochure per dettagli su pacchetti, visibilità e opportunità commerciali.",
    summary:
      "Esporre significa accedere a un ecosistema dove il valore è nel matching qualitativo: buyer selezionati, pubblico premium, visibilità editoriale oltre il semplice evento fisico. Un contesto che amplifica la reputazione e consolida le relazioni commerciali nel mercato mediterraneo.",
    pillars: generalPositioningPillars,
    focusTitle: "Tre ragioni per esporre qui.",
    focusIntro:
      "Vini Oli Sud è costruito per offrire ai produttori visibilità qualitativa, incontri rilevanti e un contesto narrativo che consolida il posizionamento nel mercato mediterraneo.",
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
      "Vini Oli Sud espositori: visibilità commerciale, matching con buyer selezionati e posizionamento premium per le eccellenze del Sud Italia.",
  },
  buyer: {
    eyebrow: "Buyer e operatori",
    title: "Il tuo accesso ai migliori terroir del Sud Italia.",
    description:
      "Un hub selettivo pensato per chi cerca scouting, relazioni dirette e una lettura ordinata dell’offerta mediterranea tra vino, olio e cultura produttiva.",
    ctaLabel: "Richiedi il Pass Buyer",
    ctaHref: "/contatti?interesse=buyer#richiesta-informazioni",
    ctaNote:
      "Richiedi il pass buyer per accesso facilitato, agenda di incontri e materiali esclusivi.",
    summary:
      "Per buyer, Ho.Re.Ca., distributori e importatori: Vini Oli Sud offre una piattaforma dove la qualità non è nel volume, ma nella densità narrativa, nella rilevanza dei contatti e nella capacità di navigare velocemente i migliori terroir del Sud Italia.",
    pillars: buyerPositioningPillars,
    focusTitle: "Un hub di selezione, non dispersione.",
    focusIntro:
      "Vini Oli Sud è progettato per semplificare lo scouting: facilita l’accesso a produttori selezionati, supporta l’agenda di incontri e mette a disposizione materiali che accelerano la comprensione dei terroir mediterranei.",
    sections: [
      {
        eyebrow: "Selezione",
        title: "Terroir leggibili e ordinati.",
        description:
          "Il percorso buyer aiuta a capire rapidamente dove si concentra il valore e quali aree esplorare.",
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
      "Vini Oli Sud buyer e operatori Ho.Re.Ca.: selezione, agenda di incontri e accesso ai terroir del Mezzogiorno.",
  },
  visitatori: {
    eyebrow: "Visitatori",
    title: "Assapora il Sud, vista mare.",
    description:
      "Degustazioni, show cooking e cultura mediterranea prendono forma in un’esperienza capace di tenere insieme piacere, scoperta e qualità estetica.",
    ctaLabel: "Richiedi aggiornamenti visitatori",
    ctaHref: "/contatti?interesse=visitatori#richiesta-informazioni",
    ctaNote:
      "Iscriviti per ricevere aggiornamenti sulla programmazione e sulle modalità di accesso.",
    summary:
      "Vini Oli Sud offre ai visitatori un’esperienza che coniuga il piacere della degustazione, la scoperta del territorio mediterraneo e la bellezza scenica del lungomare napoletano. Non semplice intrattenimento, ma una forma di storytelling sensoriale e culturale.",
    pillars: generalPositioningPillars,
    focusTitle: "Un invito a vivere il Mezzogiorno contemporaneo.",
    focusIntro:
      "Degustazioni, show cooking, incontri con produttori e momenti culturali costruiscono un’esperienza coerente dove il gusto diventa accesso al territorio.",
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
        eyebrow: "Esperienza",
        title: "Carnet degustazione e accesso.",
        description:
          "Il carnet apre il percorso vino, olio e show cooking del salone. La prenotazione passa dal modulo dedicato in questa pagina.",
      },
    ],
    metadataDescription:
      "Vini Oli Sud visitatori: degustazioni, show cooking e cultura mediterranea sul lungomare di Napoli.",
  },
  "grand-prix": {
    eyebrow: "Grand Prix · Prima Edizione",
    title: "Grand Prix Magna Grecia",
    description:
      "Uno spazio dedicato a valorizzare prodotti, territori e riconoscibilità, con una narrazione capace di unire autorevolezza e desiderabilità. L’Albo d’Oro 2025 raccoglie i primi dieci riconoscimenti del progetto.",
    ctaLabel: "Richiedi informazioni Grand Prix",
    ctaHref: "/contatti?interesse=grand-prix#richiesta-informazioni",
    summary:
      "L’Albo d’Oro 2025 raccoglie dieci riconoscimenti che presentano vino e olio del Mezzogiorno con tono autorevole e misurato.",
    pillars: generalPositioningPillars,
    focusTitle: "Un riconoscimento dedicato al Mezzogiorno.",
    focusIntro:
      "Il Grand Prix Magna Grecia valorizza i terroir del Sud con un linguaggio editoriale rigoroso e una selezione concreta di etichette e produttori.",
    sections: [
      {
        eyebrow: "Autorevolezza",
        title: "Un riconoscimento misurato.",
        description:
          "Premi e selezioni funzionano solo se linguaggio, criteri e presentazione restano credibili e coerenti con il valore dei prodotti raccontati.",
      },
      {
        eyebrow: "Visibilità",
        title: "Vetrina per prodotti e territori.",
        description:
          "Il Grand Prix diventa contenuto editoriale, leva PR e motore di attenzione qualificata sui terroir del Sud.",
      },
      {
        eyebrow: "Governance",
        title: "Categorie, criteri, racconto.",
        description:
          "La governance del premio mantiene insieme rigore della selezione, categorie chiare e un racconto coerente con la reputazione del progetto.",
      },
    ],
    metadataDescription:
      "Scopri il Grand Prix Magna Grecia di Vini Oli Sud: posizionamento, Albo d’Oro 2025 e percorso di valorizzazione delle eccellenze del Mezzogiorno.",
  },
  "diario-del-sud": {
    eyebrow: "Diario del Sud",
    title: "Diario del Sud",
    description:
      "Radar editoriale di Vini Oli Sud: titoli, fonti e segnali dal vino, dall’olio e dall’agroalimentare mediterraneo.",
    ctaLabel: "Proponi una segnalazione",
    ctaHref: "/diario-del-sud#proponi-segnalazione",
    summary:
      "Il Diario del Sud è un radar editoriale, non un magazine autoreferenziale: ogni voce rimanda alla fonte originale, con una breve nota di contesto firmata Vini Oli Sud.",
    pillars: generalPositioningPillars,
    focusTitle: "Una rassegna editoriale del Mezzogiorno.",
    focusIntro:
      "Il Diario del Sud raccoglie titoli, fonti e link sul vino, l’olio e l’agroalimentare mediterraneo, con una breve nota editoriale di contesto firmata Vini Oli Sud.",
    sections: [
      {
        eyebrow: "SEO",
        title: "Indicizzazione con senso.",
        description:
          "I contenuti intercettano interesse reale su territori, prodotti e business mediterraneo del Sud.",
      },
      {
        eyebrow: "Marca",
        title: "Una voce che differenzia.",
        description:
          "Il tone of voice evita burocratese, folklore e imitazioni di fiere generaliste.",
      },
      {
        eyebrow: "Rubriche",
        title: "Cinque chiavi per leggere il Sud.",
        description:
          "Oro Verde, Calici di Magna Grecia, Radar del Sud, Territori, Business con Anima: cinque rubriche per organizzare la rassegna editoriale.",
      },
    ],
    metadataDescription:
      "Diario del Sud: il radar editoriale di Vini Oli Sud raccoglie titoli, fonti e segnali dal vino, dall’olio e dall’agroalimentare mediterraneo.",
  },
  media: {
    eyebrow: "Media",
    title: "Press Room Vini Oli Sud",
    description:
      "Un’area pensata per giornalisti, redazioni, uffici stampa e stakeholder che hanno bisogno di materiali affidabili, rapidi da consultare e pronti alla pubblicazione.",
    ctaLabel: "Richiedi informazioni media",
    ctaHref: "/contatti?interesse=media#richiesta-informazioni",
    ctaNote:
      "La segreteria gestisce richieste di media kit, accrediti e materiali stampa.",
    summary:
      "La press room di Vini Oli Sud raccoglie materiali, recapiti e riferimenti utili a giornalisti, redazioni e uffici stampa che raccontano il progetto.",
    pillars: generalPositioningPillars,
    focusTitle: "Materiali editoriali per la stampa.",
    focusIntro:
      "L’area press di Vini Oli Sud raccoglie i contenuti utili a media, redazioni e uffici stampa che vogliono raccontare il progetto in modo coerente.",
    sections: [
      {
        eyebrow: "Stampa",
        title: "Comunicati e note ufficiali.",
        description:
          "L’area raccoglie comunicati e note ufficiali del progetto, sempre coerenti con i dati validati.",
      },
      {
        eyebrow: "Asset",
        title: "Immagini e materiali scaricabili.",
        description:
          "Kit media, logo pack e fotografie approvate del progetto Vini Oli Sud.",
      },
      {
        eyebrow: "Accrediti",
        title: "Percorso dedicato ai media.",
        description:
          "Le richieste accredito e i contatti stampa operativi passano dai recapiti della segreteria.",
      },
    ],
    metadataDescription:
      "Press room Vini Oli Sud: materiali, accrediti e percorso dedicato a giornalisti, redazioni e uffici stampa.",
  },
  contatti: {
    eyebrow: "Contatti",
    title: "Contatti",
    description:
      "Recapiti ufficiali per richieste commerciali, accrediti, partnership e comunicazioni stampa relative a Vini Oli Sud.",
    ctaLabel: "Richiedi la Brochure Espositori",
    ctaHref: "/contatti?interesse=espositori#richiesta-informazioni",
    summary:
      "Il progetto è curato da A.S.D. Napoli Racing Show. Il contatto principale del progetto è info@vinisud.it; la segreteria organizzativa gestisce telefono, email e PEC.",
    pillars: generalPositioningPillars,
    focusTitle: "Percorsi dedicati per audience.",
    focusIntro:
      "Brochure espositori, pass buyer e partnership restano sui rispettivi percorsi; questa scheda concentra i recapiti ufficiali.",
    sections: [
      {
        eyebrow: "Commerciale",
        title: "Espositori, sponsor e partnership.",
        description:
          "Le richieste business possono partire dalla brochure espositori o dalla pagina contatti, con risposta coordinata dalla segreteria.",
      },
      {
        eyebrow: "Operativo",
        title: "Buyer, media e accreditamenti.",
        description:
          "Pass buyer, programma visitatori e percorso media rimandano a sezioni dedicate; per esigenze trasversali usare i recapiti pubblicati in questa area.",
      },
      {
        eyebrow: "Trasparenza",
        title: "Recapiti verificati.",
        description:
          "Email progetto, PEC e dati fiscali sono quelli ufficialmente associati all’organizzazione indicata.",
      },
    ],
    metadataDescription:
      "Contatti ufficiali di Vini Oli Sud: informazioni commerciali, accrediti, partnership e comunicazioni stampa.",
  },
};
