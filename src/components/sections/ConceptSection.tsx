import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function ConceptSection() {
  return (
    <section className="section-space">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.95fr_1.05fr] lg:items-start">
        <SectionHeader
          eyebrow="Concept"
          title={siteConfig.concept.title}
          intro={siteConfig.concept.description}
        />

        <div className="grid gap-5 sm:grid-cols-3 lg:grid-cols-1">
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
