import type { Metadata } from "next";
// Contenuti modificabili dalla segretaria via /admin. Questo file JSON viene
// aggiornato dal pannello e letto qui in fase di build. Vedi public/admin/.
import editable from "../../content/settings/site.json";
// Testi delle sezioni home (filosofia, Grand Prix, territorio, regioni,
// sponsor, evento, albo d'oro) modificabili dalla segretaria via /admin,
// area "Sezioni Home". Vedi public/admin/index.php.
import homeSections from "../../content/settings/home-sections.json";

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
    // Testi delle 3 scene modificabili dal pannello /admin, area "Sezioni
    // Home" (content/settings/home-sections.json).
    slides: homeSections.hero.slides,
  },
  // Sezioni home sotto: testi modificabili dal pannello /admin, area
  // "Sezioni Home" (content/settings/home-sections.json). Link/href/url
  // restano protetti e non modificabili dalla segreteria (vedi BLOCKLIST
  // in public/admin/index.php).
  philosophy: homeSections.philosophy,
  grandPrixHighlight: homeSections.grandPrixHighlight,
  institutionalPartners: homeSections.institutionalPartners,
  territory: homeSections.territory,
  regions: homeSections.regions,
  sponsor: homeSections.sponsor,
  eventDetails: homeSections.eventDetails,
  alboDoro: homeSections.alboDoro,
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
