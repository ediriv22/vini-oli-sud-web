// Sezione home "Biglietti e iscrizioni" + "Pacchetti sponsor". Dati
// confermati dal cliente (pass-giurato in vigore, flyer sponsor): vedi
// src/app/pass-giurato/page.tsx (biglietti.tiers in
// content/settings/home-sections.json) e src/app/sponsor/page.tsx per i
// pass e le quote già pubblicati altrove sul sito. Prezzi riportati esatti,
// senza aggiunte non confermate (regola AGENTS.md).

export const ticketsSection = {
  badge: "Ingresso al Villaggio gratuito",
  intro:
    "Per degustare e votare nelle 9 Sfide serve il Pass Giurato: il voto della Giuria Popolare vale il 70% del risultato finale. Solo 200 Giurati Popolari per ciascuna Sfida.",
  cards: [
    {
      name: "Pass Giurato",
      subtitle: "1 Sfida",
      price: "€25",
      featured: false,
      ctaLabel: "Diventa Giurato",
      ctaHref: "/pass-giurato/",
    },
    {
      name: "Pass Giurato",
      subtitle: "3 Sfide",
      price: "€50",
      featured: false,
      ctaLabel: "Diventa Giurato",
      ctaHref: "/pass-giurato/",
    },
    {
      name: "Pass Gran Giurato",
      subtitle: "Tutte le 9 Sfide",
      price: "€70",
      featured: true,
      ctaLabel: "Diventa Giurato",
      ctaHref: "/pass-giurato/",
    },
    {
      name: "Iscrizione prodotto",
      subtitle: "Un prodotto, un concorso",
      price: "€1.100 + IVA",
      priceNote: "Totale € 1.342",
      featured: false,
      ctaLabel: "Iscrivi il tuo Prodotto",
      ctaHref: "/format/gran-premio-del-gusto/iscrizione/",
      note: "Posti limitati in ordine di arrivo.",
    },
  ],
  footnote:
    "+ €10,00 + IVA (tot. €12,20) per tenere il bicchiere e portabicchiere ufficiali serigrafati, opzionale su ogni Pass. Pass personale e non cedibile, riservato ai maggiorenni.",
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
