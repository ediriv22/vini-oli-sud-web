import { siteConfig } from "@/data/site";

/**
 * Sezione "Profezia Liquida" — manifesto editoriale del progetto.
 *
 * Direzione (post-audit):
 *  - I 4 pillar non sono più 4 card con gradient e shadow (sembravano
 *    riquadri colorati allineati). Diventano voci editoriali separate
 *    da hairline oro: un articolo a 4 paragrafi, non una griglia.
 *  - Niente più offset alternato xl:ml-12 / xl:mr-12 che creava un
 *    "ziggurat" disordinato a desktop.
 *  - L'unico accento cromatico è il numero progressivo in oro;
 *    l'ultimo (Adrenalina) tiene il rosso aglianico come segnale.
 *  - Verde olive ridotto a un solo eyebrow micro-istituzionale.
 */
export default function ConceptSection() {
  return (
    <section
      aria-labelledby="concept-title"
      className="section-flow section-soft-enter section-space"
    >
      <div className="section-shell">
        <div className="grid gap-8 lg:grid-cols-[minmax(0,1.05fr)_minmax(0,0.95fr)] lg:items-start lg:gap-14">
          <div>
            <div className="flex items-center gap-3">
              <span
                className="h-px w-8 bg-[rgba(176,141,87,0.6)]"
                aria-hidden="true"
              />
              <p className="eyebrow text-[var(--color-wine)]">Profezia Liquida</p>
            </div>
            <h2
              id="concept-title"
              className="display-balance mt-5 max-w-[20ch] font-display text-[clamp(2.1rem,5vw,3.85rem)] leading-[0.98] tracking-[0.005em] text-[var(--color-ink-strong)]"
            >
              {siteConfig.concept.title}
            </h2>
          </div>

          <p className="max-w-none text-[1.02rem] leading-[1.7] text-[var(--color-muted)] lg:max-w-[42ch] lg:pt-3">
            {siteConfig.concept.description}
          </p>
        </div>

        <ol className="mt-14 grid gap-0 sm:mt-16 lg:mt-20">
          {siteConfig.concept.pillars.map((pillar, index) => {
            const isAccent = index === 3; // "Adrenalina" — accento rosso

            return (
              <li
                key={pillar.title}
                className="relative grid grid-cols-[auto_1fr] gap-x-5 gap-y-1 border-t border-[rgba(176,141,87,0.22)] py-8 sm:gap-x-7 sm:py-10 lg:grid-cols-[6rem_minmax(0,0.34fr)_minmax(0,0.66fr)] lg:gap-x-8 lg:py-12"
              >
                <span
                  aria-hidden="true"
                  className={`font-ui text-[0.86rem] font-semibold leading-none tracking-[0.22em] ${
                    isAccent
                      ? "text-[var(--color-wine)]"
                      : "text-[var(--color-sand-strong)]"
                  }`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                <p
                  className={`font-ui text-[0.74rem] font-semibold uppercase tracking-[0.18em] lg:col-start-2 lg:row-start-1 lg:pt-0 ${
                    isAccent
                      ? "text-[var(--color-wine)]"
                      : "text-[var(--color-muted)]"
                  }`}
                >
                  {pillar.eyebrow}
                </p>

                <div className="col-span-2 lg:col-span-1 lg:col-start-3 lg:row-start-1">
                  <h3 className="font-display text-[1.4rem] leading-[1.08] tracking-[0.005em] text-[var(--color-ink-strong)] sm:text-[1.65rem] lg:text-[1.75rem]">
                    {pillar.title}
                  </h3>
                  <p className="mt-3 max-w-[58ch] text-[1rem] leading-[1.66] text-[var(--color-muted)]">
                    {pillar.description}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}
