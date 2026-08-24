import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

/**
 * Sezione richiamata dalla navigazione ("Sponsor, Espositori e Spazi
 * Disponibili") ma senza copy dedicata confermata nel transcript del demo
 * cliente. Contenuto dichiaratamente placeholder (vedi src/data/site.ts
 * → sponsor), in attesa di materiale definitivo da parte del cliente.
 */
export default function SponsorSection() {
  const { sponsor } = siteConfig;

  return (
    <section
      id="sponsor"
      aria-labelledby="sponsor-title"
      className="section-flow section-space-sm"
      data-content-key="sec:sponsor"
    >
      <div className="section-shell max-w-[46rem] text-center">
        <p className="eyebrow" data-content-key="field:sponsor.eyebrow">
          {sponsor.eyebrow}
        </p>
        <h2
          id="sponsor-title"
          className="display-balance mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]"
          data-content-key="field:sponsor.title"
        >
          {sponsor.title}
        </h2>
        <p
          className="mt-5 text-[0.98rem] leading-[1.7] text-[var(--color-muted)]"
          data-content-key="field:sponsor.body"
        >
          {sponsor.body}
        </p>
        <div className="mt-7 flex justify-center">
          <Button href={sponsor.ctaHref} variant="soft" size="md">
            {sponsor.ctaLabel}
          </Button>
        </div>
      </div>
    </section>
  );
}
