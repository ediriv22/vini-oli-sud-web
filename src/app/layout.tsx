import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Montserrat,
  Lato,
  Playfair_Display,
  Raleway,
  Fraunces,
  Jost,
  EB_Garamond,
  Inter,
} from "next/font/google";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { siteConfig } from "@/data/site";
import { resolveFontPreset } from "@/data/fontPresets";
import "./globals.css";

const metadataBaseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinisud.it";

// Tutti i font dei preset selezionabili dal pannello /admin sono sempre
// caricati qui (next/font/google richiede argomenti statici); solo quello
// scelto in fontPreset viene collegato alle variabili --font-display-stack /
// --font-ui-stack usate dal resto del sito. Vedi src/data/fontPresets.ts.
const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-cormorant",
});
const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-montserrat",
});
const playfairDisplay = Playfair_Display({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-playfair",
});
const raleway = Raleway({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-raleway",
});
const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-fraunces",
});
const jost = Jost({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-jost",
});
const ebGaramond = EB_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-eb-garamond",
});
const inter = Inter({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-inter",
});

// Font corpo/UI del sito (allineato al demo cliente: Lato, sans-serif).
// Caricato sempre, indipendentemente dal preset display/UI selezionabile
// dal pannello /admin (vedi src/data/fontPresets.ts).
const lato = Lato({
  subsets: ["latin"],
  weight: ["400", "700", "900"],
  variable: "--font-lato",
});

const fontVariables = [
  cormorantGaramond,
  montserrat,
  playfairDisplay,
  raleway,
  fraunces,
  jost,
  ebGaramond,
  inter,
  lato,
]
  .map((font) => font.variable)
  .join(" ");

const activeFontPreset = resolveFontPreset(siteConfig.fontPreset);

const faviconMime = siteConfig.faviconImage.endsWith(".svg")
  ? "image/svg+xml"
  : "image/png";

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  appleWebApp: {
    title: siteConfig.name,
  },
  manifest: "/manifest.json",
  keywords: [
    "ViniSud",
    "Napoli Racing Show",
    "vini del Sud Italia",
    "oli del Sud Italia",
    "salone boutique mediterraneo",
    "buyer vino olio",
  ],
  openGraph: {
    siteName: siteConfig.name,
    title: siteConfig.name,
    description: siteConfig.description,
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
  icons: {
    icon: [
      // Favicon caricabile dal pannello /admin: sostituisce il monogramma
      // di default se la segreteria carica un'altra icona ViniSud.
      { url: siteConfig.faviconImage, type: faviconMime },
      { url: siteConfig.brand.assets.favicon16, sizes: "16x16", type: "image/png" },
      { url: siteConfig.brand.assets.favicon32, sizes: "32x32", type: "image/png" },
      { url: siteConfig.brand.assets.favicon64, sizes: "64x64", type: "image/png" },
      { url: siteConfig.brand.assets.favicon256, sizes: "256x256", type: "image/png" },
      { url: siteConfig.brand.assets.favicon512, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: siteConfig.brand.assets.favicon256, sizes: "256x256" }],
  },
  twitter: {
    card: "summary_large_image",
    title: siteConfig.name,
    description: siteConfig.description,
    images: [siteConfig.brand.assets.ogImage],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="it"
      className={`${fontVariables} h-full scroll-smooth antialiased`}
      style={
        {
          // Tema globale modificabile dal pannello /admin (content/settings/site.json).
          "--color-wine": siteConfig.theme.primaryColor,
          "--color-ivory": siteConfig.theme.backgroundColor,
          // Preset di font modificabile dal pannello /admin (fontPreset).
          "--font-display-stack": activeFontPreset.display,
          "--font-ui-stack": activeFontPreset.ui,
        } as React.CSSProperties
      }
    >
      <body
        suppressHydrationWarning
        className="min-h-full bg-[var(--color-ivory)] font-sans text-[var(--color-ink)]"
      >
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-[2px] focus:bg-[var(--color-wine)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-[var(--color-ivory)] focus:shadow-[0_8px_20px_rgba(107,30,30,0.25)]"
        >
          Vai al contenuto
        </a>
        <div className="flex min-h-screen flex-col">
          <Header />
          <main id="content" className="flex-1">
            {children}
          </main>
          <Footer />
        </div>
      </body>
    </html>
  );
}
