import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function ConceptSection() {
  const pillarThemes = ["parchment", "linen", "press", "olive"] as const;

  return (
    <section className="border-y border-[rgba(19,41,61,0.08)] bg-[linear-gradient(180deg,rgba(255,251,245,0.76),rgba(250,244,234,0.56))] py-14 sm:py-16 lg:py-20">
      <div className="section-shell grid gap-8 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <SectionHeader
          eyebrow="Profezia Liquida"
          title={siteConfig.concept.title}
          intro="Quattro coordinate per leggere il progetto: origine, materia, memoria e adrenalina."
        />

        <div className="grid gap-4 sm:grid-cols-2">
          {siteConfig.concept.pillars.map((pillar, index) => (
            <Card
              key={pillar.title}
              eyebrow="Pilastro"
              title={pillar.eyebrow}
              description={pillar.title}
              theme={pillarThemes[index]}
              className="h-full p-5 sm:p-5"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
