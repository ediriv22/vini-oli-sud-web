import GrandPrixWinnerBadge from "@/components/sections/GrandPrixWinnerBadge";
import SectionHeader from "@/components/ui/SectionHeader";
import { createPageMetadata, siteConfig } from "@/data/site";
import { grandPrixWinners2025 } from "@/data/winners";

export const metadata = createPageMetadata(
  "Vincitori 2025",
  "Albo d'Oro 2025: tutti i vincitori del Grand Prix Vini e Oli della Magna Grecia, per categoria, prodotto, azienda e bollino ufficiale.",
);

/**
 * Pagina dedicata "Vincitori 2025" — Albo d'Oro completo, spostato qui
 * dalla home (dove restano solo 2 paragrafi di sintesi in AlboDoroSection,
 * vedi §9 riorganizzazione IA 2026). Dati da src/data/winners.ts: 9/9
 * categorie 2025 presenti, nessun record mancante.
 */
export default function Vincitori2025Page() {
  const { alboDoro } = siteConfig;

  return (
    <section className="section-flow section-space">
      <div className="section-shell">
        <SectionHeader eyebrow={alboDoro.eyebrow} title="Albo d'Oro 2025" align="center" />

        <div className="mx-auto mt-6 flex max-w-[46rem] flex-col gap-3 text-center">
          {alboDoro.paragraphs.map((paragraph) => (
            <p key={paragraph} className="text-[0.96rem] leading-[1.65] text-[var(--color-muted)]">
              {paragraph}
            </p>
          ))}
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-3">
          {grandPrixWinners2025.map((winner) => (
            <li
              key={winner.award}
              className="flex flex-col items-center justify-center rounded-[1.1rem] border border-[rgba(255,215,87,0.4)] bg-[var(--color-grove)] px-4 py-7 text-center"
            >
              <GrandPrixWinnerBadge src={winner.badgeSrc} alt={winner.badgeAlt} award={winner.award} />
              <p className="font-ui mt-3 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-sand)]">
                {winner.award}
              </p>
              <p className="mt-2 font-display text-[1.05rem] leading-snug text-[var(--color-ivory)]">
                {winner.product}
              </p>
              <p className="mt-1 text-[0.84rem] leading-relaxed text-[rgba(255,253,245,0.75)]">
                {winner.producer}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
