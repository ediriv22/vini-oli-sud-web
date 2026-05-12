import type { Metadata } from "next";

export const siteConfig = {
  name: "Vini Oli Sud",
  miniTagline: "Boutique mediterranea premium",
  description:
    "Sito ufficiale di Vini Oli Sud, salone boutique dedicato a vini, oli e cultura mediterranea nel cuore del Napoli Racing Show.",
  brand: {
    wordmark: "Vini Oli Sud",
    subtitle: "Magna Grecia · Vino · Olio",
    ariaLabel: "Vini Oli Sud, sito ufficiale",
    assets: {
      logo: "/brand/logo.svg",
      logoDark: "/brand/logo-dark.svg",
      logoLight: "/brand/logo-light.svg",
      logoSquare: "/brand/logo-square.png",
      logoOriginal: "/brand/original-logo.webp",
      favicon32: "/brand/favicon-32.png",
      favicon64: "/brand/favicon-64.png",
      favicon192: "/brand/favicon-192.png",
      favicon512: "/brand/favicon-512.png",
      ogImage: "/brand/og-image.jpg",
    },
  },
  footerDescription:
    "Vini Oli Sud è il punto di incontro tra terroir del Mezzogiorno, business hospitality e immaginario mediterraneo. Un format da costruire come piattaforma editoriale e commerciale, non come semplice vetrina.",
  legalLine: "Placeholder legale e societario da confermare",
  contact: {
    email: "segreteria@placeholder.viniolisud.it",
    phone: "+39 000 000 0000",
    address: "Napoli, sede organizzativa da confermare",
  },
  hero: {
    eyebrow: "Vini, oli e cultura mediterranea",
    title: "Le radici del gusto. L’adrenalina del futuro.",
    subtitle:
      "Vini Oli Sud porta vini, oli e cultura mediterranea nel cuore del Napoli Racing Show: un salone boutique dove la lentezza della terra incontra la velocità della pista.",
    actions: [
      { label: "Richiedi la Brochure Espositori", href: "/espositori" },
      { label: "Richiedi il Pass Buyer", href: "/buyer" },
      { label: "Esplora il Programma", href: "/evento" },
    ],
    signals: [
      {
        label: "Posizionamento",
        value: "Premium mediterraneo, territoriale e business-oriented.",
      },
      {
        label: "Scenario",
        value: "Napoli, lungomare, motorsport e cultura del gusto in dialogo.",
      },
      {
        label: "Obiettivo",
        value: "Generare lead, reputazione e relazioni tra brand e operatori.",
      },
    ],
  },
  audiences: [
    {
      eyebrow: "Espositori",
      title: "Espositori",
      description:
        "Porta la tua azienda davanti a buyer, operatori e pubblico premium.",
      ctaLabel: "Area Espositori",
      href: "/espositori",
    },
    {
      eyebrow: "Buyer",
      title: "Buyer",
      description:
        "Scopri in un unico hub i terroir, i vini e gli oli del Sud Italia.",
      ctaLabel: "Richiedi il Pass Buyer",
      href: "/buyer",
    },
    {
      eyebrow: "Visitatori",
      title: "Visitatori",
      description:
        "Vivi degustazioni, show cooking e cultura mediterranea sul Lungomare di Napoli.",
      ctaLabel: "Esplora l’Esperienza",
      href: "/visitatori",
    },
    {
      eyebrow: "Media",
      title: "Media",
      description:
        "Accedi a comunicati, immagini, accrediti e materiali pronti alla pubblicazione.",
      ctaLabel: "Press Room",
      href: "/media",
    },
  ],
  concept: {
    title: "La lentezza della terra incontra la velocità della pista.",
    description:
      "Mentre il Napoli Racing Show celebra l’ingegneria, la potenza e il movimento, Vini Oli Sud porta in scena l’altra velocità del Mediterraneo: quella lenta, profonda e precisa della terra. Vino e olio diventano cultura, business e racconto del Mezzogiorno.",
    pillars: [
      {
        eyebrow: "Business",
        title: "Relazioni utili, non traffico indistinto.",
        description:
          "Il sito deve accompagnare espositori, buyer e partner verso azioni chiare: brochure, accredito, contatto commerciale, partnership.",
      },
      {
        eyebrow: "Territorio",
        title: "Otto regioni come una sola narrazione strategica.",
        description:
          "Non un elenco di stand ma una piattaforma mediterranea riconoscibile, autorevole e coerente nel tono.",
      },
      {
        eyebrow: "Esperienza",
        title: "Emozione concreta, non folklore.",
        description:
          "La componente sensoriale deve restare calda e aspirazionale, senza scadere nel cliché della fiera generalista.",
      },
    ],
  },
  regions: {
    title: "Otto regioni, una piattaforma mediterranea.",
    description:
      "Campania, Abruzzo, Molise, Puglia, Basilicata, Calabria, Sicilia e Sardegna entrano in un racconto comune che unisce terroir, identità produttive e valore commerciale.",
    items: [
      "Campania",
      "Abruzzo",
      "Molise",
      "Puglia",
      "Basilicata",
      "Calabria",
      "Sicilia",
      "Sardegna",
    ],
  },
  editorial: {
    title: "Diario del Sud",
    description:
      "Storie, territori, vini, oli e visioni mediterranee dal cuore del Mezzogiorno.",
    columns: [
      "Radar del Sud",
      "Oro Verde",
      "Calici di Magna Grecia",
      "Business con Anima",
      "Motori & Terroir",
    ],
    previewCards: [
      {
        eyebrow: "Territori",
        title: "Le geografie che fanno mercato.",
        description:
          "Dalle coste alle aree interne, il Diario del Sud mette ordine nelle mappe produttive e nelle opportunità di racconto.",
      },
      {
        eyebrow: "Prodotti",
        title: "Vino e olio come cultura viva.",
        description:
          "Una linea editoriale capace di tenere insieme tecnica, fascino sensoriale e concretezza commerciale.",
      },
      {
        eyebrow: "Business",
        title: "Contenuti che aiutano anche la conversione.",
        description:
          "Il magazine deve alimentare SEO, autorevolezza e percorsi per buyer, sponsor e operatori.",
      },
      {
        eyebrow: "Scenario",
        title: "Mediterraneo contemporaneo, non nostalgia.",
        description:
          "Voce, immagini e rubriche devono costruire una marca culturale distintiva e pronta a crescere.",
      },
    ],
  },
  finalCta: {
    title: "Costruiamo il nuovo palcoscenico del gusto mediterraneo.",
    actions: [
      { label: "Richiedi la Brochure Espositori", href: "/espositori" },
      { label: "Proponi una Partnership", href: "/contatti" },
    ],
  },
} as const;

export function createPageMetadata(
  title: string,
  description: string,
): Metadata {
  return {
    title,
    description,
    openGraph: {
      title: `${title} | ${siteConfig.name}`,
      description,
      type: "website",
      locale: "it_IT",
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
    },
  };
}
