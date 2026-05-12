import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function RegionsSection() {
  return (
    <section className="section-divider section-space soft-wash">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Geografia del gusto"
          title={siteConfig.regions.title}
          intro={siteConfig.regions.description}
          align="center"
        />

        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.regions.items.map((region) => (
            <div
              key={region}
              className="panel rounded-[1.6rem] px-5 py-6 text-center font-display text-[2rem] text-[var(--color-sea)]"
            >
              {region}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
