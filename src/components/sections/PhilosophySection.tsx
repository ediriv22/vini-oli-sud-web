import { siteConfig } from "@/data/site";

/**
 * "La nostra filosofia" — manifesto editoriale, replica del demo cliente.
 */
export default function PhilosophySection() {
  const { philosophy } = siteConfig;

  return (
    <section aria-labelledby="filosofia-title" className="section-flow section-space">
      <div className="section-shell max-w-[52rem]">
        <p id="filosofia-title" className="eyebrow text-center">
          {philosophy.eyebrow}
        </p>
        <div className="mt-6 flex flex-col gap-6">
          {philosophy.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="display-balance text-center font-display text-[clamp(1.35rem,2.6vw,1.85rem)] leading-[1.35] text-[var(--color-ink-strong)]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
