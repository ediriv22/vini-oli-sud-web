import { siteConfig } from "@/data/site";

export default function AlboDoroSection() {
  const { alboDoro } = siteConfig;

  return (
    <section
      id="albo-doro"
      aria-labelledby="albo-doro-title"
      className="section-flow section-space-sm hairline-gold"
      data-content-key="sec:alboDoro"
    >
      <div className="section-shell max-w-[48rem] text-center">
        <p className="eyebrow" data-content-key="field:alboDoro.eyebrow">
          {alboDoro.eyebrow}
        </p>
        <h2
          id="albo-doro-title"
          className="display-balance mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]"
          data-content-key="field:alboDoro.title"
        >
          {alboDoro.title}
        </h2>
        <div className="mt-6 flex flex-col gap-4">
          {alboDoro.paragraphs.map((paragraph, index) => (
            <p
              key={paragraph}
              className="text-[0.98rem] leading-[1.7] text-[var(--color-muted)]"
              data-content-key={`field:alboDoro.paragraphs.${index}`}
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
