import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function ConceptSection() {
  return (
    <section className="border-y border-[rgba(51,36,31,0.1)] bg-[linear-gradient(180deg,rgba(255,251,245,0.58),rgba(252,248,241,0.24))] py-14 sm:py-16 lg:py-20">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Profezia Liquida"
          title={siteConfig.concept.title}
          intro={siteConfig.concept.description}
        />

        <div className="mt-10 grid gap-x-8 gap-y-8 border-t border-[rgba(200,167,111,0.42)] sm:mt-12 sm:gap-x-10 sm:gap-y-10 lg:grid-cols-2">
          {siteConfig.concept.pillars.map((pillar, index) => (
            <article
              key={pillar.title}
              className="flex h-full flex-col border-t border-[rgba(51,36,31,0.1)] pt-5 sm:pt-6"
            >
              <div className="flex items-baseline justify-between gap-4">
                <span className="font-ui text-[0.78rem] font-semibold leading-none tracking-[0.22em] text-[rgba(200,167,111,0.96)] sm:text-[0.82rem]">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <p className="eyebrow text-[var(--color-olive)]">
                  {pillar.eyebrow}
                </p>
              </div>

              <div className="mt-4 flex flex-1 flex-col">
                <h3 className="max-w-[24ch] font-display text-[1.52rem] leading-[1.02] text-[var(--color-grove)] sm:text-[1.72rem]">
                  {pillar.title}
                </h3>
                <p className="mt-4 max-w-[44ch] text-[0.98rem] leading-7 text-[var(--color-muted)]">
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
