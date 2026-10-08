// Sezione home "Prenotazioni e selezione" + "Pacchetti sponsor".
// 7/10/2026 (richiesta Edvige): il Pass Giurato non è più in vendita ma si
// prenota gratuitamente (solo i primi 50) e i prodotti in gara sono scelti
// da un bando della Regione Campania: niente prezzi né quote nella sezione
// biglietti. I pacchetti sponsor restano quelli del flyer (src/app/sponsor/page.tsx),
// riportati esatti, senza aggiunte non confermate (regola AGENTS.md).

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
    "Per degustare e votare nelle 9 Sfide serve il Pass Giurato: il voto della Giuria Popolare vale il 70% del risultato finale. Si prenota compilando il modulo e inviandolo, via mail, alla nostra segreteria: saranno accettati solo i primi 50 prenotati.",
  cards: [
    {
      name: "Pass Giurato",
      subtitle: "1 Sfida",
      featured: false,
      ctaLabel: "Prenota il tuo Pass",
      ctaHref: "/pass-giurato/",
    },
    {
      name: "Pass Giurato",
      subtitle: "3 Sfide",
      featured: false,
      ctaLabel: "Prenota il tuo Pass",
      ctaHref: "/pass-giurato/",
    },
    {
      name: "Pass Gran Giurato",
      subtitle: "Tutte le 9 Sfide",
      featured: true,
      ctaLabel: "Prenota il tuo Pass",
      ctaHref: "/pass-giurato/",
      note: "Saranno accettati solo i primi 50 prenotati.",
    },
    {
      name: "Selezione prodotti",
      subtitle: "Bando Regione Campania",
      featured: false,
      ctaLabel: "Come funziona",
      ctaHref: "/format/gran-premio-del-gusto/iscrizione/",
      note: "Le aziende saranno selezionate dall'Assessorato all'Agricoltura della Regione Campania con un bando apposito.",
    },
  ] as readonly TicketCard[],
  footnote:
    "Pass personale e non cedibile, riservato ai maggiorenni.",
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
