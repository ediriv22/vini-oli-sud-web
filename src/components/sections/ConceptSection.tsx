import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function ConceptSection() {
  return (
    <section className="section-space">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.88fr_1.12fr] lg:items-start">
        <SectionHeader
          eyebrow="Profezia Liquida"
          title={siteConfig.concept.title}
          intro={siteConfig.concept.description}
        />

        <div className="grid gap-5 sm:grid-cols-2">
          {siteConfig.concept.pillars.map((pillar) => (
            <Card
              key={pillar.title}
              eyebrow={pillar.eyebrow}
              title={pillar.title}
              description={pillar.description}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
