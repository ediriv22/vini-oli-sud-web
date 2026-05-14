import { siteConfig } from "@/data/site";

export default function ConceptSection() {
  return (
    <section className="bg-[linear-gradient(180deg,rgba(255,251,245,0.72),rgba(252,248,241,0.3))] py-14 sm:py-16 lg:py-20">
      <div className="section-shell">
        <div className="py-2 sm:py-4">
          <div className="grid gap-7 lg:grid-cols-[minmax(0,1.14fr)_minmax(0,0.86fr)] lg:items-start lg:gap-10">
            <div>
              <div className="flex items-center gap-3">
                <span
                  className="h-px w-8 bg-[rgba(200,167,111,0.48)]"
                  aria-hidden="true"
                />
                <p className="eyebrow text-[var(--color-wine)]">Profezia Liquida</p>
              </div>
              <h2 className="display-balance mt-4 max-w-[18ch] font-display text-[clamp(2.1rem,7vw,4.8rem)] leading-[0.96] tracking-[0.01em] text-[var(--color-grove)] sm:text-[clamp(2.6rem,6vw,4.8rem)] lg:max-w-[20ch] xl:max-w-[22ch]">
                {siteConfig.concept.title}
              </h2>
            </div>

            <p className="max-w-none text-[1rem] leading-[1.64] text-[var(--color-muted)] lg:max-w-[34ch] lg:justify-self-end lg:pt-6">
              {siteConfig.concept.description}
            </p>
          </div>
        </div>

        <div className="mt-8 grid gap-4 sm:mt-10 sm:gap-5 lg:mt-12 lg:gap-6">
          {siteConfig.concept.pillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className={`rounded-[1.8rem] bg-[linear-gradient(180deg,rgba(255,252,246,0.9),rgba(247,239,229,0.7))] px-5 py-6 shadow-[0_14px_30px_rgba(38,25,17,0.04)] sm:px-6 sm:py-7 lg:grid lg:grid-cols-[auto_minmax(0,0.3fr)_minmax(0,0.7fr)] lg:items-start lg:gap-8 ${
                index % 2 === 1 ? "xl:ml-12" : "xl:mr-12"
              }`}
            >
              <div className="flex items-center gap-3.5 lg:items-start">
                <span
                  className={`font-ui text-[0.84rem] font-semibold leading-none tracking-[0.2em] ${
                    index === 3 ? "text-[var(--color-wine)]" : "text-[rgba(200,167,111,0.96)]"
                  } opacity-80`}
                >
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span
                  className={`h-px w-7 lg:mt-0.5 lg:w-9 ${
                    index === 3
                      ? "bg-[rgba(122,38,52,0.52)]"
                      : "bg-[rgba(200,167,111,0.42)]"
                  }`}
                  aria-hidden="true"
                />
              </div>

              <p
                className={`eyebrow mt-3 lg:mt-0 lg:pt-0.5 ${
                  index === 3 ? "text-[var(--color-wine)]" : "text-[var(--color-olive)]"
                }`}
              >
                {pillar.eyebrow}
              </p>

              <div className="mt-3 min-w-0 lg:mt-0">
                <h3 className="max-w-none font-display text-[1.42rem] leading-[1.03] tracking-[0.01em] text-[var(--color-grove)] sm:text-[1.72rem] lg:max-w-[24ch]">
                  {pillar.title}
                </h3>
                <p className="mt-3 max-w-none text-[1rem] leading-[1.62] text-[var(--color-muted)] lg:max-w-[46ch]">
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
