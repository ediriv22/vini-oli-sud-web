import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function RegionsSection() {
  const { regions } = siteConfig;

  return (
    <section
      id="regioni"
      aria-labelledby="regioni-title"
      className="section-flow section-space"
    >
      <div className="section-shell">
        <SectionHeader
          eyebrow={regions.eyebrow}
          title={regions.title}
          titleId="regioni-title"
          intro={regions.description}
          align="center"
        />

        <div className="mt-12 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {regions.items.map((region) => (
            <article
              key={region.name}
              className="rounded-[1.4rem] border border-[rgba(255,215,87,0.22)] bg-[rgba(255,253,245,0.6)] px-6 py-7 transition-colors duration-300 ease-out hover:border-[rgba(255,215,87,0.45)]"
            >
              <h3 className="font-display text-[1.35rem] leading-none text-[var(--color-ink-strong)]">
                {region.name}
              </h3>
              <p className="mt-3 text-[0.94rem] leading-[1.65] text-[var(--color-muted)]">
                {region.description}
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
