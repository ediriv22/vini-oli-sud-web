import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function EditorialPreview() {
  return (
    <section className="section-space">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div>
          <SectionHeader
            eyebrow="Magazine proprietario"
            title={siteConfig.editorial.title}
            intro={siteConfig.editorial.description}
          />

          <div className="panel mt-7 rounded-[2rem] p-6 sm:p-7">
            <p className="eyebrow">Rubriche fondative</p>
            <ul className="mt-5 grid gap-3 text-sm font-medium text-[var(--color-muted)]">
              {siteConfig.editorial.columns.map((column) => (
                <li
                  key={column}
                  className="rounded-[1rem] border border-[var(--color-line)] bg-white/60 px-4 py-3"
                >
                  {column}
                </li>
              ))}
            </ul>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {siteConfig.editorial.previewCards.map((card) => (
            <Card
              key={card.title}
              eyebrow={card.eyebrow}
              title={card.title}
              description={card.description}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
