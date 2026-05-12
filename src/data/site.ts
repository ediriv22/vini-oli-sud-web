import type { Metadata } from "next";

export const siteConfig = {
  name: "Vini Oli Sud",
  miniTagline: "Le eccellenze della Magna Grecia.",
  description:
    "Sito ufficiale di Vini Oli Sud, salone boutique dedicato a vini, oli e cultura mediterranea nel cuore del Napoli Racing Show.",
  brand: {
    wordmark: "Vini Oli Sud",
    subtitle: "Le eccellenze della Magna Grecia.",
    ariaLabel: "Vini Oli Sud, sito ufficiale",
    taglines: {
      primary: "Le Radici del Gusto. L’Adrenalina del Futuro.",
      secondary: "Motori, Terroir e Passione Mediterranea.",
      institutional: "Le eccellenze della Magna Grecia.",
      commercial: "L’Eccellenza del Mezzogiorno Scende in Pista.",
      agora: "L’Agorà del Sud da Gustare e Vivere.",
    },
    assets: {
      logo: "/brand/logo.svg",
      logoDark: "/brand/logo-dark.svg",
      logoLight: "/brand/logo-light.svg",
      logoHorizontal: "/brand/logo-horizontal.png",
      logoHorizontalCropped: "/brand/logo-horizontal-cropped.png",
      logoSquare: "/brand/logo-square.png",
      logoOriginal: "/brand/original-logo.webp",
      symbolColumnOliveGrape: "/brand/symbol-column-olive-grape.png",
      coverFacebook: "/brand/cover-facebook.png",
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
    eyebrow: "L’Eccellenza del Mezzogiorno Scende in Pista.",
    title: "Le Radici del Gusto. L’Adrenalina del Futuro.",
    subtitle:
      "Vini Oli Sud unisce vino, olio, cultura mediterranea e business matching nel palcoscenico del Napoli Racing Show. Una piattaforma boutique per produttori, buyer, visitatori e brand premium.",
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
      title: "Per chi produce eccellenza",
      description:
        "Cantine, frantoi e consorzi trovano una vetrina premium per incontrare buyer, operatori e un pubblico ad alto valore.",
      ctaLabel: "Richiedi la Brochure Espositori",
      href: "/espositori",
    },
    {
      eyebrow: "Buyer",
      title: "Per chi seleziona il Sud",
      description:
        "Un percorso pensato per Ho.Re.Ca., distributori, importatori e operatori alla ricerca di nuove etichette, oli e territori da portare sul mercato.",
      ctaLabel: "Richiedi il Pass Buyer",
      href: "/buyer",
    },
    {
      eyebrow: "Visitatori",
      title: "Per chi vive l’esperienza",
      description:
        "Degustazioni, cultura mediterranea, talk e show cooking nel dialogo unico tra gusto, mare e motori.",
      ctaLabel: "Esplora il Programma",
      href: "/visitatori",
    },
    {
      eyebrow: "Media e Partner",
      title: "Per chi racconta e valorizza il progetto",
      description:
        "Materiali stampa, asset di brand e opportunità di co-branding per media, PR e partner che vogliono presidiare il racconto del Mezzogiorno contemporaneo.",
      ctaLabel: "Scarica il Media Kit",
      href: "/media",
    },
  ],
  concept: {
    title: "Dove la terra incontra la pista.",
    description:
      "Nel villaggio Vini Oli Sud la precisione del vigneto dialoga con l’adrenalina del motorsport. Due mondi diversi, uniti dalla stessa ossessione: cura, tempo, tecnica e identità.",
    pillars: [
      {
        eyebrow: "Origine Classica",
        title: "Il Mezzogiorno come matrice, non come derivazione.",
        description:
          "Napoli, il mare e la Magna Grecia entrano nel progetto come grammatica culturale e segno di autorevolezza contemporanea.",
      },
      {
        eyebrow: "Natura Pura",
        title: "Vino e olio come espressioni vive del territorio.",
        description:
          "Le produzioni raccontano il Sud attraverso vigne, uliveti, stagioni e materia, senza folklore e senza artificio fieristico.",
      },
      {
        eyebrow: "Memoria Liquida",
        title: "Ogni bottiglia custodisce cultura, rito e visione.",
        description:
          "Il racconto non tratta il prodotto come merce isolata, ma come archivio sensoriale di paesaggi, lavoro e identità.",
      },
      {
        eyebrow: "Adrenalina",
        title: "Business con anima nel palcoscenico del Racing Show.",
        description:
          "La velocità della pista porta attenzione, energia e desiderabilità; la lentezza della terra porta profondità, selezione e reputazione.",
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
      "Storie, territori, vini, oli e visioni mediterranee dal cuore del Mezzogiorno, con una voce editoriale pensata per rafforzare marca, reputazione e desiderabilità.",
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
    title: "Porta il tuo brand nel nuovo palcoscenico del gusto mediterraneo.",
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
