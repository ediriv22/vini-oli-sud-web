// Sezione home "Prenotazioni e selezione" + "Pacchetti sponsor".
// 14/10/2026 (richiesta Edvige): il Pass Giurato torna A PAGAMENTO.
// Prezzi allineati alla biglietteria, che è ciò che il pubblico paga davvero:
// €25 + €10 bicchiere = €35, €50 + €10 = €60, €70 + €10 = €80, più commissioni.
// I €10 del bicchiere serigrafato NON sono facoltativi: sono dentro il totale
// di ogni Pass in vendita. Il testo della biglietteria parlava di bicchiere "in
// prestito, da restituire": Edvige ha chiarito il 14/10/2026 che si paga e si
// tiene, quindi quella frase e' stata tolta dal sito.
// Annulla la regola del 7/10/2026 (prenotazione gratuita, primi 50).
// Dal 15/10/2026 il sito non rimanda a una biglietteria esterna: vedi PASS_URLS.
// I prodotti in gara restano scelti da un bando della Regione Campania.
// I pacchetti sponsor restano quelli del flyer (src/app/sponsor/page.tsx),
// riportati esatti, senza aggiunte non confermate.

// 15/10/2026 (ordine di Edvige: "leva azzurro service subito"): tolti tutti i
// link alla biglietteria esterna. Il sito non manda piu' nessuno fuori: chi vuole
// il Pass compila il modulo qui e la segreteria conferma. Niente pagamento online
// finche' non si decide la nuova biglietteria. Gli URL vecchi non restano
// nemmeno commentati, per non rimetterli in pagina per sbaglio.
export const PASS_URLS = {
  unaSfida: "/pass-giurato/",
  treSfide: "/pass-giurato/",
  noveSfide: "/pass-giurato/",
  tutti: "/pass-giurato/",
} as const;

type TicketCard = {
  name: string;
  subtitle: string;
  featured: boolean;
  ctaLabel: string;
  ctaHref: string;
  price?: string;
  priceNote?: string;
  note?: string;
};

export const ticketsSection = {
  badge: "Ingresso al Villaggio gratuito",
  intro:
    "Per degustare e votare nelle 9 Sfide serve il Pass Giurato: il voto della Giuria Popolare vale il 70% del risultato finale. Assaggia le eccellenze in gara, esprimi il tuo voto e contribuisci a decretare i vincitori.",
  cards: [
    {
      name: "Pass Giurato",
      subtitle: "1 Sfida a scelta",
      price: "€35",
      priceNote: "€25 Pass + €10 bicchiere e portabicchiere serigrafati, più commissioni",
      featured: false,
      ctaLabel: "Richiedi il tuo Pass",
      ctaHref: PASS_URLS.unaSfida,
    },
    {
      name: "Pass Giurato",
      subtitle: "3 Sfide a scelta",
      price: "€60",
      priceNote: "€50 Pass + €10 bicchiere e portabicchiere serigrafati, più commissioni",
      featured: false,
      ctaLabel: "Richiedi il tuo Pass",
      ctaHref: PASS_URLS.treSfide,
    },
    {
      name: "Pass Gran Giurato",
      subtitle: "Tutte le 9 Sfide",
      price: "€80",
      priceNote: "€70 Pass + €10 bicchiere e portabicchiere serigrafati, più commissioni",
      featured: true,
      ctaLabel: "Richiedi il tuo Pass",
      ctaHref: PASS_URLS.noveSfide,
    },
    {
      name: "Selezione aziende",
      subtitle: "Bando Regione Campania",
      featured: false,
      ctaLabel: "Come funziona",
      ctaHref: "/programma/",
      note: "Le aziende saranno selezionate dall'Assessorato all'Agricoltura della Regione Campania con un bando apposito.",
    },
  ] as readonly TicketCard[],
  footnote:
    "Pass personale e non cedibile, riservato ai maggiorenni. Prezzi dei Pass Giurato, escluse eventuali commissioni e costi aggiuntivi indicati al momento dell'acquisto.",
} as const;

export const sponsorPackagesSection = {
  eyebrow: "Pacchetti sponsor",
  title: "Soluzioni su misura per il tuo brand",
  subtitle: "Visibilità · Valore · Territorio · Relazioni",
  packages: [
    {
      name: "Espositore",
      price: "€2.500",
      tagline: "Ideale per cantine, frantoi e produttori.",
      featured: false,
      features: [
        "Stand 4x4 m nel Villaggio",
        "Pulizia e vigilanza",
        "Allaccio elettrico",
        "Presenza nel sito e nel Programma Ufficiale",
        "5 Pass Giurati omaggio",
        "Logo su palco, area interviste e premiazioni",
      ],
    },
    {
      name: "Expo + Gara",
      price: "€3.000",
      tagline: "Esposizione e concorso in un unico pacchetto.",
      featured: false,
      features: [
        "Stand 4x4 m nel Villaggio",
        "Iscrizione di 1 prodotto al Gran Premio del Gusto (1 Concorso)",
        "Presentazione azienda durante la Sfida",
        "Comunicazione sul sito e social",
        "10 Pass Giurati omaggio",
        "Logo su palco, area interviste e premiazioni",
      ],
    },
    {
      name: "Partner del Gusto",
      price: "€5.000",
      tagline: "Valorizza i tuoi prodotti e il tuo territorio.",
      featured: false,
      features: [
        "Stand 4x4 m nel Villaggio",
        "Iscrizione di 1 prodotto al Gran Premio del Gusto",
        "Logo su materiali istituzionali",
        "Video su maxischermi (passaggi dedicati)",
        "Comunicazione social dedicata",
        "15 Pass Giurati omaggio",
        "Logo su palco, area interviste e premiazioni",
      ],
    },
    {
      name: "Official Partner",
      price: "€10.000",
      tagline: "Un ruolo da protagonista nella manifestazione.",
      featured: true,
      features: [
        "Tutti i benefit dei pacchetti precedenti",
        "Naming di una Sfida (salvo disponibilità)",
        "Video su maxischermi (passaggi aumentati)",
        "Maggiore presenza sui canali media",
        "Area hospitality dedicata",
        "30 Pass Giurati omaggio",
        "Logo su palco, area interviste e premiazioni",
      ],
    },
  ],
  bottomLine: "Per altre forme di sponsorizzazione e partnership contattare l'organizzatore",
  ctaLabel: "Diventa Sponsor",
  ctaHref: "/sponsor/",
  brochures: [
    { label: "Scarica Brochure Espositori (PDF)", href: "/downloads/brochure-vinisud-espositori.pdf" },
    { label: "Brochure Giurati (PDF)", href: "/downloads/brochure-vinisud-giurati.pdf" },
  ],
} as const;
