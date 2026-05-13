import { siteConfig } from "@/data/site";

export default function ConceptSection() {
  return (
    <section className="border-y border-[rgba(51,36,31,0.1)] bg-[linear-gradient(180deg,rgba(255,251,245,0.58),rgba(252,248,241,0.24))] py-12 sm:py-16 lg:py-20">
      <div className="section-shell">
        <div className="border-t border-[rgba(200,167,111,0.36)] py-6 sm:py-10">
          <div className="grid gap-8 lg:grid-cols-[minmax(0,1.12fr)_minmax(0,0.88fr)] lg:items-start">
            <div>
              <p className="eyebrow text-[var(--color-wine)]">Profezia Liquida</p>
              <h2 className="display-balance mt-3.5 max-w-[10ch] font-display text-[clamp(3rem,10vw,4.8rem)] leading-[0.96] tracking-[0.01em] text-[var(--color-grove)] sm:mt-4">
                {siteConfig.concept.title}
              </h2>
            </div>

            <p className="max-w-none text-[1rem] leading-[1.62] text-[var(--color-muted)] lg:max-w-[38ch] lg:justify-self-end lg:pt-5">
              {siteConfig.concept.description}
            </p>
          </div>
        </div>

        <div className="mt-8 border-t border-[rgba(51,36,31,0.12)] sm:mt-12">
          {siteConfig.concept.pillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className={`grid gap-3.5 py-7 sm:py-7 lg:grid-cols-[auto_minmax(0,0.34fr)_minmax(0,0.66fr)] lg:gap-8 ${
                index > 0 ? "border-t border-[rgba(51,36,31,0.1)]" : ""
              } ${index % 2 === 1 ? "xl:pl-14" : ""} ${
                index === 3 ? "border-l border-[rgba(122,38,52,0.24)] pl-4 sm:pl-5 lg:border-l-0 lg:pl-0" : ""
              }`}
            >
              <div className="flex items-center gap-4 lg:items-start">
                <span
                  className={`font-ui text-[0.84rem] font-semibold leading-none tracking-[0.2em] ${
                    index === 3 ? "text-[var(--color-wine)]" : "text-[rgba(200,167,111,0.96)]"
                  } opacity-80`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`mt-0.5 hidden h-px w-10 lg:block ${
                    index === 3
                      ? "bg-[rgba(122,38,52,0.52)]"
                      : "bg-[rgba(200,167,111,0.42)]"
                  }`}
                  aria-hidden="true"
                />
              </div>

              <p
                className={`eyebrow lg:pt-0.5 ${
                  index === 3 ? "text-[var(--color-wine)]" : "text-[var(--color-olive)]"
                }`}
              >
                {pillar.eyebrow}
              </p>

              <div className="min-w-0">
                <h3 className="max-w-none font-display text-[1.44rem] leading-[1.03] tracking-[0.01em] text-[var(--color-grove)] sm:text-[1.78rem] lg:max-w-[24ch]">
                  {pillar.title}
                </h3>
                <p className="mt-3.5 max-w-none text-[1rem] leading-[1.62] text-[var(--color-muted)] lg:max-w-[46ch]">
                  {pillar.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
