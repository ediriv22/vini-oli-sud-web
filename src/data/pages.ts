// Contenuti delle pagine: vivono in content/pages.json e sono modificabili
// dal pannello /admin. Qui li importiamo tipizzandoli. Vedi public/admin/.
import staticPagesJson from "../../content/pages.json";

export type StaticPagePillar = {
  title: string;
  description: string;
};

export type StaticPageExternalReference = {
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  url: string;
};

/**
 * Blocchi di contenuto ricco per le sezioni estese (es. Espositori, Sponsor,
 * Visitatori, Eventi Collaterali). Pensati per testi lunghi, liste puntate,
 * CTA verso moduli e griglie di sotto-eventi, senza rompere lo schema base.
 */
export type StaticPageBlock =
  | { kind: "paragraph"; text: string }
  | { kind: "list"; intro?: string; items: string[] }
  | { kind: "cta"; label: string; href: string }
  | { kind: "note"; text: string }
  | { kind: "highlight"; title: string; lines: string[] }
  | {
      kind: "cards";
      items: Array<{ icon?: string; title: string; description: string }>;
    };

export type StaticPageRichSection = {
  eyebrow: string;
  title: string;
  intro?: string;
  blocks: StaticPageBlock[];
};

export type StaticPageContent = {
  /** Colore di sfondo della pagina, modificabile dal pannello /admin. */
  backgroundColor?: string;
  eyebrow: string;
  title: string;
  description: string;
  ctaLabel: string;
  ctaHref: string;
  ctaNote?: string;
  summary: string;
  pillars: StaticPagePillar[];
  focusTitle: string;
  focusIntro: string;
  sections: Array<{
    eyebrow: string;
    title: string;
    description: string;
  }>;
  verifyNotes?: string[];
  externalReference?: StaticPageExternalReference;
  /** Sezioni estese con contenuto ricco, rese sotto le card di focus. */
  richSections?: StaticPageRichSection[];
  metadataDescription: string;
};

export const staticPages =
  staticPagesJson as unknown as Record<string, StaticPageContent>;
