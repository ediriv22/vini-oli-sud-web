import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function EditorialPreview() {
  const editorialThemes = ["parchment", "press", "linen", "olive"] as const;

  return (
    <section className="section-space">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start">
        <div>
          <SectionHeader
            eyebrow="Magazine proprietario"
            title={siteConfig.editorial.title}
            intro={siteConfig.editorial.description}
          />

          <div className="card-shell card-theme-press texture-parchment mt-7 rounded-[2rem] p-6 sm:p-7">
            <div className="relative z-10">
              <p className="eyebrow text-[var(--card-eyebrow)]">
                Rubriche fondative
              </p>
              <ul className="mt-5 grid gap-3 text-sm font-medium text-[var(--card-body)]">
                {siteConfig.editorial.columns.map((column) => (
                  <li
                    key={column}
                    className="rounded-[1rem] border border-[rgba(51,36,31,0.08)] bg-[rgba(255,255,255,0.55)] px-4 py-3"
                  >
                    {column}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>

        <div className="grid gap-5 md:grid-cols-2">
          {siteConfig.editorial.previewCards.map((card, index) => (
            <Card
              key={card.title}
              eyebrow={card.eyebrow}
              title={card.title}
              description={card.description}
              theme={editorialThemes[index]}
              className="h-full"
            />
          ))}
        </div>
      </div>
    </section>
  );
}
