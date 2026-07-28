import { siteConfig } from "@/data/site";

export default function AlboDoroSection() {
  const { alboDoro } = siteConfig;

  return (
    <section
      id="albo-doro"
      aria-labelledby="albo-doro-title"
      className="section-flow section-space-sm hairline-gold"
    >
      <div className="section-shell max-w-[48rem] text-center">
        <p className="eyebrow">{alboDoro.eyebrow}</p>
        <h2
          id="albo-doro-title"
          className="display-balance mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]"
        >
          {alboDoro.title}
        </h2>
        <div className="mt-6 flex flex-col gap-4">
          {alboDoro.paragraphs.map((paragraph) => (
            <p
              key={paragraph}
              className="text-[0.98rem] leading-[1.7] text-[var(--color-muted)]"
            >
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
