import type { Metadata } from "next";
// Contenuti modificabili dalla segretaria via /admin. Questo file JSON viene
// aggiornato dal pannello e letto qui in fase di build. Vedi public/admin/.
import editable from "../../content/settings/site.json";

export const siteConfig = {
  // Modificabili dal pannello /admin (content/settings/site.json).
  name: editable.siteName,
  description: editable.siteDescription,
  brand: {
    wordmark: "Vini & OliSud",
    subtitle: "Magna Grecia",
    ariaLabel: "Vini & OliSud, sito ufficiale",
    taglines: {
      primary: "Dove il Sole incontra il Mito.",
      institutional: "Magna Grecia.",
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
      // Glifo VS puro su fondo trasparente: stesso identico segno della
      // favicon e dell'icona app TikTok (vincolo: logo sito = icona app).
      vsMark: "/brand/vs-mark.svg",
      vsMarkIvory: "/brand/vs-mark-ivory.svg",
      // Avatar social pronto (monogramma + piccolo wordmark sotto).
      avatarSocial: "/brand/avatar-social-vs.svg",
      // Badge logo quadrato (fondo verde scuro, colonna dorica oro,
      // "VINI OLI SUD" in serif oro): stesso file usato dalla demo cliente
      // in header (granpremiodinapoli.it/img/logo.jpg). Priorità di
      // fedeltà visiva su header/footer rispetto al monogramma VS.
      logoBadge: "/brand/logo-badge-verde.jpg",
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
    "La rassegna che celebra l'eccellenza enogastronomica della Magna Grecia. Dove il sole incontra il mito, la storia e il sapore autentico del Sud Italia.",
  legalLine: "© 2026 Vini & OliSud. Tutti i diritti riservati.",
  contact: {
    /** Contatto principale — modificabile dal pannello /admin */
    projectEmail: editable.contactEmail,
  },
  organizer: {
    legalName: "A.S.D. Napoli Racing Show",
    phones: ["3295535164", "3276616294", "081 5753432"] as const,
    email: "napoliracingshow@gmail.com",
    emailAlt: "napoliracingshow@libero.it",
    pec: "asdnapoliracingshow@pec.it",
    vatId: "10430641216",
    fiscalCode: "95334510633",
  },
  // Colori globali modificabili dal pannello /admin (content/settings/site.json).
  theme: {
    primaryColor: editable.themePrimaryColor,
    backgroundColor: editable.themeBackgroundColor,
  },
  // Preset di font selezionabile dal pannello /admin. Vedi src/app/layout.tsx
  // per l'elenco completo dei preset caricati e come viene applicato.
  fontPreset: editable.fontPreset,
  // Icona favicon caricabile dal pannello /admin (upload immagine).
  faviconImage: editable.faviconImage,
  // Sfondo (colore o immagine) della sezione Grand Prix, modificabile dal
  // pannello /admin. Se è presente un'immagine ha sempre priorità sul colore
  // (vedi src/lib/sectionBackground.ts).
  sectionBackgrounds: {
    grandPrix: {
      backgroundColor: editable.grandPrixBackgroundColor,
      backgroundImage: editable.grandPrixBackgroundImage,
    },
  },
  // Hero carosello a 3 scene — replica quasi identica del demo cliente
  // granpremiodinapoli.it/anteprima. Il testo della scena 1 resta
  // modificabile dal pannello /admin (hero.eyebrow/title/subtitle);
  // le scene 2 e 3 sono adattate dal transcript del demo (non verbatim
  // al 100%: vedi nota in coda al file / report di consegna).
  hero: {
    backgroundImage: editable.heroBackgroundImage,
    // Crop verticale dedicato per viewport mobile (< 768px), stessa foto
    // sorgente della demo cliente (Unsplash photo-1506377247377). Non
    // esposto nel pannello /admin: variante tecnica del background hero.
    backgroundImageMobile: "/images/home/hero-magna-grecia-mobile.jpg",
    overlayOpacity: editable.heroOverlayOpacity,
    institutionalNote:
      "In collaborazione con l'Assessorato all'Agricoltura della Regione Campania",
    slides: [
      {
        eyebrow: "Magna Grecia",
        titlePrefix: "Dove il Sole incontra il ",
        titleEmphasis: "Mito",
        titleSuffix: "",
        paragraph:
          "Un viaggio al Sud è un'esperienza totale: è storia, gusto, paesaggio e passione. Benvenuti nella terra dell'eccellenza.",
        ctaLabel: "Scopri la Rassegna 2026",
        ctaHref: "#evento",
      },
      {
        eyebrow: "Oro Verde e Fuoco",
        titlePrefix: "Oro Verde e ",
        titleEmphasis: "Fuoco",
        titleSuffix: "",
        paragraph:
          "Vigne eroiche e ulivi secolari custodiscono un sapere che nasce dalla terra, non dai laboratori: gesti antichi che raccontano il Sud contro l'omologazione industriale.",
        ctaLabel: "Esplora il Territorio",
        ctaHref: "#territorio",
      },
      {
        eyebrow: "27 · 28 · 29 Novembre 2026",
        titlePrefix: "La Rassegna torna sul ",
        titleEmphasis: "Lungomare",
        titleSuffix: " di Napoli",
        paragraph:
          "Tre giorni di degustazioni e cultura mediterranea sul Lungomare Caracciolo, a ingresso libero per il pubblico, in collaborazione con l'Assessorato all'Agricoltura della Regione Campania.",
        ctaLabel: "Tutte le Info",
        ctaHref: "#evento",
      },
    ],
  },
  philosophy: {
    eyebrow: "La nostra filosofia",
    paragraphs: [
      "Questa rassegna è orgoglio, visione, resistenza culturale. Non vuole copiare, ma mostrare al mondo cosa significa eccellenza vera, radicata, meridionale. Qui ogni premio è un atto di giustizia verso chi ha saputo trasformare il sole in vino, la pietra in olio, la storia in sapore.",
      "Un viaggio al Sud è un'esperienza totale: è storia, gusto, paesaggio e passione. Benvenuti nella Magna Grecia!",
    ],
  },
  grandPrixHighlight: {
    eyebrow: "Premiazione",
    title: "Riconoscimento di Eccellenza — Grand Prix della Magna Grecia",
    subtitle:
      "I migliori produttori premiati per la qualità straordinaria dei loro vini e oli. Un riconoscimento che celebra l'eccellenza del Sud Italia.",
    expandLabel: "Scopri tutti i vincitori",
    collapseLabel: "Mostra meno categorie",
    featuredAwards: [
      "Miglior Spumante",
      "Miglior Vino Bianco",
      "Miglior Vino Rosso",
      "Miglior Vino Rosato",
    ],
  },
  territory: {
    eyebrow: "Il territorio",
    title: "Dove il Sole incontra il Mito e la Storia",
    intro:
      "Nel cuore del Sud Italia, dove il sole splende più a lungo, la Magna Grecia non è mai tramontata. Oggi è il tempo del riscatto. Oggi il Sud si affaccia al mondo con prodotti ineguagliabili e una potenza narrativa unica.",
    pillars: [
      {
        title: "Un territorio benedetto",
        description:
          "Sole, mare, vento, luce, pietra e storia. Microclimi irripetibili, terreni vulcanici e calcarei che scolpiscono i grappoli e profumano le drupe.",
      },
      {
        title: "Vitigni e radici",
        description:
          "Aglianico, Primitivo, Nerello Mascalese, Fiano, Greco di Tufo. Nomi che suonano come poesie scritte dalla terra stessa. Ogni sorso è un ritorno a casa.",
      },
      {
        title: "Oli: spirito della terra",
        description:
          "Nocellara, Ravece, Coratina. Gli uliveti del Sud sono templi aperti, e ogni goccia di extravergine è memoria liquida di un popolo che trasforma la roccia in vita.",
      },
      {
        title: "Natura, non laboratorio",
        description:
          "Non nascono da additivi o sofisticazioni, ma dalla terra viva, dal vento del mare e dalle mani dei nostri contadini. Genuinità, verità, rispetto.",
      },
    ],
  },
  regions: {
    eyebrow: "Le terre dell'eccellenza",
    title: "Le Regioni della Magna Grecia: un'unica anima",
    description:
      "Ogni territorio racconta un volto diverso del Sud. Insieme, formano l'identità agricola più ricca, vera e promettente d'Europa.",
    items: [
      {
        name: "Calabria",
        description:
          "Fortemente greca nel midollo. Intensa nei profumi con il Greco di Bianco e l'Olio della Locride. Una regione di estremi affascinanti e fiera stirpe mediterranea.",
      },
      {
        name: "Abruzzo",
        description:
          "Dove il mare incontra la montagna. La Passerina danza con il Montepulciano. Oli robusti e sinceri raccontano terre antiche e contadini tenaci.",
      },
      {
        name: "Molise",
        description:
          "La genuinità della biodiversità. Piccolo scrigno dove la Tintilia si fa voce autentica di una terra segreta. Oli fragranti e naturali, respiro lento di autenticità.",
      },
      {
        name: "Campania",
        description:
          "Cuore del Mediterraneo. Terra di vulcani e vitigni: Fiano di Avellino, Greco di Tufo, Falanghina, Aglianico. E l'olio Ravece Irpina, uno dei monocultivar più eleganti del mondo.",
      },
      {
        name: "Puglia",
        description:
          "Profumi bizantini e genuinità. Terra di ulivi millenari, Primitivo e Negroamaro. L'oro verde e rosso del Mediterraneo, tra le Murge e il Salento.",
      },
      {
        name: "Lucania",
        description:
          "Austera e nobile. Patria dell'Aglianico del Vulture, uno dei rossi più importanti d'Europa. Minerali, veri, profondi, forgiati dal vulcano e dal silenzio.",
      },
    ],
  },
  // Sezione richiesta dalla navigazione del demo cliente ("SPONSOR,
  // ESPOSITORI E SPAZI DISPONIBILI") ma per cui il transcript non
  // includeva copy dedicata: contenuto placeholder esplicito, in attesa
  // di materiale confermato (pacchetti sponsor, planimetria spazi, prezzi).
  sponsor: {
    eyebrow: "Sponsor & Espositori",
    title: "Sponsor, Espositori e Spazi Disponibili",
    body: "[PLACEHOLDER — contenuto da confermare] Dettagli su pacchetti sponsor, spazi espositivi e disponibilità saranno pubblicati non appena confermati. Per informazioni immediate su spazi e opportunità di partnership, contatta la segreteria organizzativa.",
    ctaLabel: "Richiedi Informazioni",
    ctaHref: "#contatti",
  },
  eventDetails: {
    eyebrow: "L'evento",
    title: "II° Rassegna Vini e Oli della Magna Grecia",
    dates: "27 - 28 - 29 Novembre 2026",
    admission: "Ingresso gratuito al pubblico",
    venueName: "Lungomare Caracciolo, Napoli",
    venueDescription: "Nel cuore della città, tra il mare e la storia",
    collaboration:
      "In collaborazione con Assessorato all'Agricoltura della Regione Campania",
    externalLink: {
      label: "NAPOLIRACINGSHOW.IT",
      // Dominio non confermato altrove nel repo (solo email/PEC
      // dell'organizzatore risultano verificate). URL indicato dal
      // brief di consegna: da validare con il cliente prima della
      // pubblicazione definitiva.
      url: "https://www.napoliracingshow.it",
    },
    // Programma ufficiale ricevuto dal cliente (31 luglio 2026), pubblicato
    // in public/downloads/.
    programDownload: {
      label: "Scarica il Programma",
      url: "/downloads/programma-vinisud-2026.pdf",
    },
  },
  alboDoro: {
    eyebrow: "Albo d'oro",
    title: "Il successo della I° Edizione",
    paragraphs: [
      "La prima edizione della Rassegna si è svolta con grande successo di pubblico e critica sul Lungomare Caracciolo di Napoli il 6-7-8 Dicembre 2025.",
      "Un evento aperto gratuitamente al pubblico, che ha sancito la nascita di un nuovo punto di riferimento per l'enogastronomia di qualità del Mezzogiorno, confermando che il Sud è pronto a raccontare la propria eccellenza al mondo.",
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
