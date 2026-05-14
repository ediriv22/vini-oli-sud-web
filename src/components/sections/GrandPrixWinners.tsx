import GrandPrixWinnerBadge from "@/components/sections/GrandPrixWinnerBadge";
import SectionHeader from "@/components/ui/SectionHeader";
import {
  grandPrixWinners2025,
  type GrandPrixWinnerTheme,
} from "@/data/winners";

function categoryTone(theme: GrandPrixWinnerTheme | undefined) {
  return theme === "wine"
    ? "text-[rgba(122,38,52,0.9)]"
    : "text-[rgba(18,52,35,0.88)]";
}

function markerTone(theme: GrandPrixWinnerTheme | undefined) {
  return theme === "wine"
    ? "bg-[rgba(122,38,52,0.22)]"
    : "bg-[rgba(18,52,35,0.2)]";
}

export default function GrandPrixWinners() {
  return (
    <section className="section-divider section-space bg-[rgba(252,249,242,0.96)] texture-parchment">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Grand Prix Magna Grecia"
          title="Albo d’Oro 2025"
          intro="Dieci riconoscimenti per raccontare la geografia del vino della Magna Grecia."
        />

        <div className="mt-10 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {grandPrixWinners2025.map((winner) => (
            <article
              key={`${winner.award}-${winner.product}`}
              className="card-shell card-theme-parchment texture-parchment relative flex flex-col rounded-[1.55rem] px-5 pb-6 pt-5"
            >
              <div
                className="pointer-events-none absolute inset-x-5 top-5 h-px bg-gradient-to-r from-transparent via-[rgba(200,167,111,0.38)] to-transparent"
                aria-hidden="true"
              />

              <div className="relative pt-2">
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
                    className={`font-ui text-[0.68rem] font-semibold uppercase tracking-[0.16em] ${categoryTone(winner.theme)}`}
                  >
                    {winner.award}
                  </p>
                </div>

                <h3 className="display-balance font-display text-[1.22rem] leading-snug text-[var(--color-grove)] sm:text-[1.28rem]">
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
