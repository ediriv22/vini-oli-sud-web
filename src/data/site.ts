import type { Metadata } from "next";

export const siteConfig = {
  name: "Vini Oli Sud",
  description:
    "Sito ufficiale di Vini Oli Sud, salone boutique dedicato a vini, oli e cultura mediterranea nel cuore del Napoli Racing Show.",
  brand: {
    wordmark: "Vini Sud",
    subtitle: "Dal Mediterraneo",
    ariaLabel: "Vini Oli Sud, sito ufficiale",
    taglines: {
      primary: "Le Radici del Gusto. L’Adrenalina del Futuro.",
      institutional: "Dal Mediterraneo.",
    },
    /**
     * Brand kit vettoriale (v1.0, maggio 2026). Tutti SVG: peso ~5KB ciascuno,
     * scalabili a qualunque dimensione. Sorgente in
     * /Users/.../VINISUD/ViniSud_Brand_Kit_Vettoriale/ (vedi
     * docs/brand-assets-map.md).
     *
     * Aggiungere path qui solo se il file esiste già in public/brand/.
     */
    assets: {
      // Logo orizzontale "VINI SUD · DAL MEDITERRANEO" — versione
      // trasparente (testo inchiostro mediterraneo). Adatta a sfondi chiari
      // come l'header avorio.
      logoHorizontal: "/brand/logo-orizzontale.svg",
      // Versione "scuro" — testo avorio su sfondo inchiostro: pensata per
      // footer / sezioni notturne.
      logoHorizontalDark: "/brand/logo-orizzontale-scuro.svg",
      // Variante avorio su sfondo trasparente.
      logoHorizontalIvory: "/brand/logo-orizzontale-avorio.svg",
      // Variante mono bianco (overlay su foto scure / watermark).
      logoHorizontalMonoWhite: "/brand/logo-orizzontale-mono-bianco.svg",
      // Wordmark essenziale senza filetto né tagline, per spazi compressi.
      logoWordmark: "/brand/logo-wordmark.svg",
      // Monogramma "VS" in cerchio oro su blu profondo — usi compatti.
      monogrammaVS: "/brand/monogramma-vs.svg",
      // Variante avorio del monogramma.
      monogrammaVSIvory: "/brand/monogramma-vs-avorio.svg",
      // Avatar social pronto (monogramma + piccolo wordmark sotto).
      avatarSocial: "/brand/avatar-social-vs.svg",
      // Favicon SVG vettoriale (monogramma senza cornice).
      faviconSvg: "/brand/favicon.svg",
      // Favicon raster pre-renderizzati dal brand kit.
      favicon16: "/brand/favicon-16.png",
      favicon32: "/brand/favicon-32.png",
      favicon64: "/brand/favicon-64.png",
      favicon256: "/brand/favicon-256.png",
      favicon512: "/brand/favicon-512.png",
      // OpenGraph / Twitter card (1200x630). Asset legacy: idealmente da
      // rigenerare con il nuovo monogramma.
      ogImage: "/brand/og-image.jpg",
    },
  },
  footerDescription:
    "Vini Oli Sud è il punto di incontro tra terroir del Mezzogiorno, business hospitality e immaginario mediterraneo. Un format da costruire come piattaforma editoriale e commerciale, non come semplice vetrina.",
  legalLine:
    "Vini Oli Sud · progetto a cura di A.S.D. Napoli Racing Show · P.IVA 10430641216 · C.F. 95334510633",
  contact: {
    /** Contatto principale del progetto Vini Oli Sud */
    projectEmail: "info@vinisud.it",
  },
  organizer: {
    legalName: "A.S.D. Napoli Racing Show",
    phones: ["3295535164", "3276616294"] as const,
    email: "napoliracingshow@gmail.com",
    pec: "asdnapoliracingshow@pec.it",
    vatId: "10430641216",
    fiscalCode: "95334510633",
  },
  hero: {
    eyebrow: "L’Eccellenza del Mezzogiorno Scende in Pista.",
    title: "Le Radici del Gusto. L’Adrenalina del Futuro.",
    subtitle:
      "Vini Oli Sud unisce vino, olio, cultura mediterranea e business matching nel palcoscenico del Napoli Racing Show. Una piattaforma boutique per produttori, buyer, visitatori e brand premium.",
    actions: [
      { label: "Richiedi la Brochure Espositori", href: "/contatti?interesse=espositori#richiesta-informazioni" },
      { label: "Richiedi il Pass Buyer", href: "/contatti?interesse=buyer#richiesta-informazioni" },
    ],
    signals: [],
  },
  audiences: [
    {
      eyebrow: "Espositori",
      shortLabel: "Espositori",
      title: "Per chi produce eccellenza",
      description:
        "Porta la tua azienda in un contesto premium tra degustazioni, networking e visibilità.",
      ctaLabel: "Richiedi la Brochure Espositori",
      href: "/contatti?interesse=espositori#richiesta-informazioni",
    },
    {
      eyebrow: "Buyer / Operatori",
      shortLabel: "Buyer",
      title: "Per chi seleziona il Sud",
      description:
        "Accedi a produttori selezionati, incontri B2B e percorsi dedicati agli operatori.",
      ctaLabel: "Richiedi il Pass Buyer",
      href: "/contatti?interesse=buyer#richiesta-informazioni",
    },
    {
      eyebrow: "Visitatori",
      shortLabel: "Visitatori",
      title: "Per chi vive l’esperienza",
      description:
        "Vivi degustazioni, show cooking e cultura del Sud nel cuore di Napoli.",
      ctaLabel: "Acquista il Carnet Degustazione",
      href: "/visitatori#richiesta-carnet",
    },
    {
      eyebrow: "Media e Partner",
      shortLabel: "Media",
      title: "Per chi racconta e valorizza il progetto",
      description:
        "Scarica materiali, comunicati e asset ufficiali pronti per la pubblicazione.",
      ctaLabel: "Scarica il Media Kit",
      href: "/contatti?interesse=media#richiesta-informazioni",
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
      { label: "Richiedi la Brochure Espositori", href: "/contatti?interesse=espositori#richiesta-informazioni" },
      { label: "Proponi una Partnership", href: "/contatti?interesse=partnership#richiesta-informazioni" },
    ],
  },
  edition: {
    label: "Edizione 2026",
    city: "Napoli",
    context: "In dialogo con Napoli Racing Show / Gran Premio di Napoli",
  },
  grandPrixHighlight: {
    eyebrow: "Grand Prix",
    title: "Albo d’Oro 2025",
    subtitle:
      "Un percorso di valorizzazione dedicato alle eccellenze del vino e dell’olio del Mezzogiorno.",
    process: [
      {
        number: "01",
        title: "Selezione",
        description:
          "Le etichette e i prodotti vengono presentati come espressione di territorio, filiera e identità.",
      },
      {
        number: "02",
        title: "Degustazione",
        description:
          "Il percorso valorizza la lettura sensoriale e culturale delle eccellenze del Mezzogiorno.",
      },
      {
        number: "03",
        title: "Riconoscimento",
        description:
          "Il Grand Prix offre visibilità e racconto alle produzioni che interpretano meglio lo spirito del Sud.",
      },
    ],
    featuredAwards: [
      "Miglior Spumante",
      "Miglior Vino Bianco",
      "Miglior Vino Rosso",
      "Miglior Vino Rosato",
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
      images: [
        {
          url: siteConfig.brand.assets.ogImage,
          width: 1200,
          height: 630,
        },
      ],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} | ${siteConfig.name}`,
      description,
      images: [siteConfig.brand.assets.ogImage],
    },
  };
}
