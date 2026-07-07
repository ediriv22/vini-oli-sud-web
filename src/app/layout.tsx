import type { Metadata } from "next";
import {
  Cormorant_Garamond,
  Montserrat,
  Source_Sans_3,
} from "next/font/google";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { siteConfig } from "@/data/site";
import "./globals.css";

const metadataBaseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://vinisud.it";

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-display-stack",
});

const montserrat = Montserrat({
  subsets: ["latin"],
  weight: ["600"],
  variable: "--font-ui-stack",
});

const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-sans-stack",
});

export const metadata: Metadata = {
  metadataBase: new URL(metadataBaseUrl),
  title: {
    default: siteConfig.name,
    template: `%s | ${siteConfig.name}`,
  },
  description: siteConfig.description,
  applicationName: siteConfig.name,
  keywords: [
    "Vini Oli Sud",
    "Napoli Racing Show",
    "vini del Sud Italia",
    "oli del Sud Italia",
    "salone boutique mediterraneo",
    "buyer vino olio",
  ],
  openGraph: {
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
      { url: siteConfig.brand.assets.faviconSvg, type: "image/svg+xml" },
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
      className={`${cormorantGaramond.variable} ${montserrat.variable} ${sourceSans3.variable} h-full scroll-smooth antialiased`}
      style={
        {
          // Tema globale modificabile dal pannello /admin (content/settings/site.json).
          "--color-wine": siteConfig.theme.primaryColor,
          "--color-ivory": siteConfig.theme.backgroundColor,
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
