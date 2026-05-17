import GrandPrixWinnerBadge from "@/components/sections/GrandPrixWinnerBadge";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  grandPrixWinners2025,
  type GrandPrixWinnerTheme,
} from "@/data/winners";

function categoryTone(theme: GrandPrixWinnerTheme | undefined) {
  return theme === "wine"
    ? "text-[var(--color-wine)]"
    : "text-[var(--color-sand-strong)]";
}

function markerTone(theme: GrandPrixWinnerTheme | undefined) {
  return theme === "wine"
    ? "bg-[rgba(107,30,30,0.32)]"
    : "bg-[rgba(176,141,87,0.45)]";
}

export default function GrandPrixWinners() {
  return (
    <section className="section-flow section-space">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Grand Prix Magna Grecia"
          title="Albo d’Oro 2025"
          intro="Dieci riconoscimenti per raccontare la geografia del vino della Magna Grecia."
        />

        <div className="mt-12 grid grid-cols-1 gap-6 sm:mt-14 sm:grid-cols-2 lg:grid-cols-3 lg:gap-7">
          {grandPrixWinners2025.map((winner) => (
            <article
              key={`${winner.award}-${winner.product}`}
              className="relative flex flex-col rounded-[1.25rem] border border-[rgba(176,141,87,0.16)] bg-[rgba(255,251,244,0.55)] px-6 pb-7 pt-6 transition-[border-color,background-color] duration-300 ease-out hover:border-[rgba(176,141,87,0.32)] hover:bg-[rgba(255,251,244,0.7)] motion-reduce:transition-none"
            >
              <div
                className="pointer-events-none absolute inset-x-6 top-5 h-px bg-gradient-to-r from-transparent via-[rgba(176,141,87,0.38)] to-transparent"
                aria-hidden="true"
              />

              <div className="relative pt-3">
                <GrandPrixWinnerBadge
                  src={winner.badgeSrc}
                  alt={winner.badgeAlt}
                  award={winner.award}
                />
              </div>

              <div className="relative z-10 mt-5 flex flex-col gap-3 text-left">
                <div className="flex items-center gap-2">
                  <span
                    className={`h-1 w-5 shrink-0 rounded-full ${markerTone(winner.theme)}`}
                    aria-hidden="true"
                  />
                  <p
                    className={`font-ui text-[0.7rem] font-semibold uppercase tracking-[0.16em] ${categoryTone(winner.theme)}`}
                  >
                    {winner.award}
                  </p>
                </div>

                <h3 className="display-balance font-display text-[1.25rem] leading-[1.18] tracking-[0.005em] text-[var(--color-ink-strong)] sm:text-[1.3rem]">
                  {winner.product}
                </h3>
                <p className="text-[0.92rem] leading-relaxed text-[var(--color-muted)]">
                  {winner.producer}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
