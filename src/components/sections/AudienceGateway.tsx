import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

/**
 * "Scegli il tuo percorso" — atrio editoriale per i 4 target.
 *
 * Direzione (post-audit):
 *  - Niente più griglia 2x2 (effetto "cella" / "tabella"): su tablet le
 *    voci sono in colonna singola, su desktop diventano 4 colonne
 *    affiancate con gap ampio (atrio premium, non dashboard).
 *  - Le card sono colonne editoriali: hairline oro come unico segnale
 *    grafico in alto, niente bordo continuo, niente shadow.
 *  - Solo la prima CTA è "primary" (Brochure Espositori). Le altre sono
 *    "ghost" (link editoriale con freccia), per evitare la sensazione di
 *    "4 pulsantoni rossi" che gridano dalla pagina.
 *  - Respiro generoso prima e dopo la sezione (vincolo brief: almeno
 *    96px desktop, 56px mobile dopo l'ultima card).
 */
export default function AudienceGateway() {
  const audienceRoutes = siteConfig.audiences;

  return (
    <section
      id="percorsi"
      aria-labelledby="audience-gateway-title"
      className="section-flow pt-16 pb-24 sm:pt-20 sm:pb-28 lg:pt-28 lg:pb-32"
    >
      <div className="section-shell">
        <SectionHeader
          eyebrow="Percorsi dedicati"
          title="Scegli il tuo percorso."
          titleId="audience-gateway-title"
          intro="Quattro accessi diversi, un'unica esperienza mediterranea. Entra dal varco più vicino al tuo obiettivo."
        />

        <ul className="mt-12 grid gap-12 sm:mt-14 sm:gap-14 lg:mt-16 lg:grid-cols-4 lg:gap-10 xl:gap-12">
          {audienceRoutes.map((audience, index) => {
            const isPrimary = index === 0;

            return (
              <li
                key={audience.href}
                className="group relative flex h-full flex-col pt-6"
              >
                {/* Hairline oro come rifinitura, non bordo card */}
                <span
                  aria-hidden="true"
                  className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-[rgba(176,141,87,0.65)] via-[rgba(176,141,87,0.32)] to-transparent transition-opacity duration-500 ease-out"
                />

                <div className="flex items-baseline gap-3">
                  <span
                    aria-hidden="true"
                    className="font-ui text-[0.72rem] font-semibold leading-none tracking-[0.22em] text-[var(--color-sand-strong)]"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="font-ui text-[0.74rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                    {audience.eyebrow}
                  </p>
                </div>

                <h3 className="display-balance mt-5 max-w-[14ch] font-display text-[1.55rem] leading-[1.05] tracking-[0.005em] text-[var(--color-ink-strong)] sm:text-[1.75rem]">
                  {audience.title}
                </h3>

                <p className="mt-4 flex-1 text-[0.96rem] leading-[1.65] text-[var(--color-muted)]">
                  {audience.description}
                </p>

                <div className="mt-8">
                  {isPrimary ? (
                    <Button
                      href={audience.href}
                      size="md"
                      variant="primary"
                      className="w-full justify-center sm:w-auto"
                    >
                      {audience.ctaLabel}
                    </Button>
                  ) : (
                    <a
                      href={audience.href}
                      className="group/cta font-ui inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-wine)] transition-colors duration-300 ease-out hover:text-[var(--color-wine-strong)] focus-visible:outline-2 focus-visible:outline-offset-3 focus-visible:outline-[rgba(107,30,30,0.5)]"
                    >
                      {audience.ctaLabel}
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-300 ease-out motion-reduce:transition-none motion-safe:group-hover/cta:translate-x-1"
                      >
                        →
                      </span>
                    </a>
                  )}
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
