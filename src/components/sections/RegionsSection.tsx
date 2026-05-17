import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function RegionsSection() {
  const regionThemes = [
    "card-theme-parchment texture-parchment",
    "card-theme-linen texture-linen",
    "card-theme-olive",
    "card-theme-sea",
    "card-theme-press texture-parchment",
    "card-theme-parchment texture-linen",
    "card-theme-wine",
    "card-theme-olive",
  ];

  return (
    <section className="section-flow section-space premium-divider">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Geografia del gusto"
          title={siteConfig.regions.title}
          intro={siteConfig.regions.description}
          align="center"
        />

        <div className="mt-9 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {siteConfig.regions.items.map((region, index) => (
            <div
              key={region}
              className={`card-shell ${regionThemes[index]} rounded-[1.6rem] px-5 py-5 text-center font-display text-[1.75rem] leading-none text-[var(--card-title)] sm:text-[1.85rem]`}
            >
              <span className="relative z-10 block">{region}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
