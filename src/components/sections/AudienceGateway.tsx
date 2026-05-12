import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function AudienceGateway() {
  return (
    <section className="section-divider section-space soft-wash">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Percorsi dedicati"
          title="Un portale, sei porte di ingresso operative."
          intro="Ogni audience entra nel sito con un obiettivo diverso. La homepage mette ordine, accelera la scelta e indirizza subito verso il percorso più utile."
        />

        <div className="mt-10 grid gap-5 md:grid-cols-2 xl:grid-cols-4">
          {siteConfig.audiences.map((audience) => (
            <Card
              key={audience.href}
              eyebrow={audience.eyebrow}
              title={audience.title}
              description={audience.description}
              href={audience.href}
              ctaLabel={audience.ctaLabel}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
