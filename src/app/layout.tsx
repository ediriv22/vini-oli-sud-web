import type { Metadata } from "next";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import { siteConfig } from "@/data/site";
import "./globals.css";

const metadataBaseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

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
      { url: siteConfig.brand.assets.favicon32, sizes: "32x32", type: "image/png" },
      { url: siteConfig.brand.assets.favicon64, sizes: "64x64", type: "image/png" },
      { url: siteConfig.brand.assets.favicon192, sizes: "192x192", type: "image/png" },
      { url: siteConfig.brand.assets.favicon512, sizes: "512x512", type: "image/png" },
    ],
    apple: [{ url: siteConfig.brand.assets.favicon192, sizes: "192x192" }],
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
    <html lang="it" className="h-full scroll-smooth antialiased">
      <body className="min-h-full bg-[var(--color-ivory)] font-sans text-[var(--color-ink)]">
        <a
          href="#content"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-full focus:bg-[var(--color-sea)] focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-white"
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
