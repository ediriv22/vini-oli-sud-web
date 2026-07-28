import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function TerritorySection() {
  const { territory } = siteConfig;

  return (
    <section
      id="territorio"
      aria-labelledby="territorio-title"
      className="section-flow section-space"
    >
      <div className="section-shell">
        <SectionHeader
          eyebrow={territory.eyebrow}
          title={territory.title}
          titleId="territorio-title"
          intro={territory.intro}
        />

        <ol className="mt-14 grid gap-0 sm:mt-16 lg:grid-cols-2 lg:gap-x-12">
          {territory.pillars.map((pillar) => (
            <li
              key={pillar.title}
              className="border-t border-[rgba(255,215,87,0.28)] py-8"
            >
              <h3 className="font-display text-[1.4rem] leading-[1.1] tracking-[0.005em] text-[var(--color-ink-strong)] sm:text-[1.6rem]">
                {pillar.title}
              </h3>
              <p className="mt-3 max-w-[54ch] text-[1rem] leading-[1.66] text-[var(--color-muted)]">
                {pillar.description}
              </p>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
