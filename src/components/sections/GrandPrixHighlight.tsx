import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { grandPrixWinners2025 } from "@/data/winners";

export default function GrandPrixHighlight() {
  const { eyebrow, title, subtitle, process, featuredAwards } =
    siteConfig.grandPrixHighlight;

  const featured = featuredAwards
    .map((award) => grandPrixWinners2025.find((winner) => winner.award === award))
    .filter((winner): winner is (typeof grandPrixWinners2025)[number] => Boolean(winner));

  return (
    <section
      aria-labelledby="grand-prix-highlight-title"
      className="section-flow section-space"
    >
      <span
        aria-hidden="true"
        className="pointer-events-none absolute inset-x-[10%] top-0 h-px bg-gradient-to-r from-transparent via-[rgba(176,141,87,0.4)] to-transparent"
      />
      <div className="section-shell">
        <div className="grid gap-12 lg:grid-cols-[minmax(0,1.1fr)_minmax(0,0.9fr)] lg:items-start lg:gap-16">
          <div>
            <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-wine)]">
              {eyebrow}
            </p>
            <h2
              id="grand-prix-highlight-title"
              className="display-balance mt-4 max-w-[20ch] font-display text-[clamp(2.1rem,4.6vw,3.2rem)] leading-[0.98] tracking-[0.005em] text-[var(--color-ink-strong)]"
            >
              {title}
            </h2>
            <p className="mt-6 max-w-[54ch] text-[1.02rem] leading-[1.7] text-[var(--color-muted)]">
              {subtitle}
            </p>

            <div className="mt-8">
              <Link
                href="/grand-prix"
                className="group font-ui inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-wine)] transition-colors duration-300 ease-out hover:text-[var(--color-wine-strong)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[rgba(107,30,30,0.5)]"
              >
                Esplora l’Albo d’Oro
                <span
                  className="inline-block transition-transform duration-300 ease-out motion-reduce:transition-none motion-safe:group-hover:translate-x-1"
                  aria-hidden="true"
                >
                  →
                </span>
              </Link>
            </div>
          </div>

          <div>
            <p className="font-ui text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-sand-strong)]">
              Metodo
            </p>
            <ol className="mt-6 grid gap-8 sm:grid-cols-3 sm:gap-6">
              {process.map((item) => (
                <li key={item.title} className="relative pt-5">
                  <span
                    className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[rgba(176,141,87,0.55)] via-[rgba(176,141,87,0.22)] to-transparent"
                    aria-hidden="true"
                  />
                  <span
                    className="font-ui text-[0.72rem] font-semibold tracking-[0.18em] text-[var(--color-sand-strong)]"
                    aria-hidden="true"
                  >
                    {item.number}
                  </span>
                  <h3 className="font-ui mt-2.5 text-[0.88rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-strong)]">
                    {item.title}
                  </h3>
                  <p className="mt-2 text-[0.92rem] leading-[1.65] text-[var(--color-muted)]">
                    {item.description}
                  </p>
                </li>
              ))}
            </ol>
          </div>
        </div>

        <div className="mt-16 sm:mt-20">
          <p className="font-ui text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-sand-strong)]">
            Categorie in evidenza · 2025
          </p>
          <ul className="mt-6 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
            {featured.map((winner) => (
              <li
                key={winner.award}
                className="group relative flex flex-col items-center rounded-[1.1rem] border border-[rgba(176,141,87,0.16)] bg-[rgba(255,251,244,0.55)] px-4 py-6 transition-[border-color,background-color,transform] duration-300 ease-out hover:border-[rgba(176,141,87,0.3)] hover:bg-[rgba(255,251,244,0.7)] motion-reduce:transition-none sm:px-5 sm:py-7"
              >
                <div className="relative z-10 h-16 w-16 sm:h-[4.5rem] sm:w-[4.5rem]">
                  <Image
                    src={winner.badgeSrc}
                    alt={winner.badgeAlt}
                    width={220}
                    height={220}
                    sizes="72px"
                    className="h-full w-full object-contain object-center"
                  />
                </div>

                <p
                  className={`font-ui mt-3 text-center text-[0.66rem] font-semibold uppercase tracking-[0.16em] ${
                    winner.theme === "wine"
                      ? "text-[var(--color-wine)]"
                      : "text-[var(--color-sand-strong)]"
                  }`}
                >
                  {winner.award}
                </p>
                <p className="mt-2 text-center font-display text-[1.02rem] leading-snug text-[var(--color-ink-strong)] sm:text-[1.08rem]">
                  {winner.product}
                </p>
                <p className="mt-1 text-center text-[0.84rem] leading-relaxed text-[var(--color-muted)]">
                  {winner.producer}
                </p>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
