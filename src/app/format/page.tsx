import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { createPageMetadata } from "@/data/site";

export const metadata = createPageMetadata(
  "Format",
  "Il Format 2026 di Vini & OliSud: la Rassegna Vini e Oli della Magna Grecia e il Gran Premio del Gusto, due eventi distinti nella stessa manifestazione.",
);

const OPTIONS = [
  {
    title: "2ª Rassegna Vini e Oli della Magna Grecia",
    description:
      "Ingresso libero e gratuito: stand espositivi, masterclass, territorio ed eccellenze del Sud Italia.",
    href: "/format/rassegna-vini-e-oli-della-magna-grecia/",
  },
  {
    title: "1ª Edizione del Gran Premio del Gusto",
    description: "9 Sfide, 9 Vincitori: 70% Giuria Popolare, 30% Giuria Tecnica.",
    href: "/format/gran-premio-del-gusto/",
  },
];

/**
 * Hub "Format" — le due anime della manifestazione, ciascuna con la
 * propria pagina dedicata (nessun contenuto misto qui). Vedi §2 della
 * richiesta di riorganizzazione IA 2026.
 */
export default function FormatPage() {
  return (
    <section className="section-flow section-space">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Format"
          title="Due eventi, un'unica manifestazione"
          align="center"
        />

        <div className="mx-auto mt-12 grid max-w-[56rem] gap-6 sm:grid-cols-2">
          {OPTIONS.map((option) => (
            <Link
              key={option.href}
              href={option.href}
              className="flex flex-col gap-3 rounded-[1.2rem] border border-[rgba(47,91,70,0.28)] bg-[rgba(255,253,245,0.6)] px-6 py-8 text-center transition-colors duration-300 ease-out hover:border-[var(--color-wine)] hover:bg-[rgba(255,253,245,0.9)]"
            >
              <p className="font-display text-[1.35rem] leading-[1.15] text-[var(--color-ink-strong)]">
                {option.title}
              </p>
              <p className="text-[0.92rem] leading-[1.55] text-[var(--color-muted)]">
                {option.description}
              </p>
              <span className="font-ui mt-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-wine)]">
                Scopri di più →
              </span>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
}
