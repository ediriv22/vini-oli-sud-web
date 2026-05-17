import Link from "next/link";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

/**
 * Fascia CTA finale "Espositori & Buyer".
 *
 * Direzione (post-audit):
 *  - Nessuna superficie colorata: il blocco è una pausa editoriale,
 *    non una "banda" che cambia colore (per evitare il look "collage").
 *  - Hairline oro in alto e in basso come unica rifinitura.
 *  - 2 CTA primarie (rosso + soft oro) con gap ≥ 16px e larghezza
 *    misurata (no più `lg:min-w-[16rem]` che le faceva sembrare
 *    pulsantoni giganti).
 *  - Link "Proponi una Partnership" sotto, come terza opzione editoriale.
 */
export default function CtaBand() {
  const primaryActions = siteConfig.hero.actions.slice(0, 2);

  return (
    <section
      aria-labelledby="final-cta-title"
      className="section-flow section-space-lg"
    >
      <div className="section-shell">
        <div className="relative mx-auto max-w-[68rem] py-12 sm:py-14 lg:py-16">
          {/* Hairline oro sopra e sotto: rifinitura editoriale */}
          <span
            aria-hidden="true"
            className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(176,141,87,0.55)] to-transparent"
          />
          <span
            aria-hidden="true"
            className="absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-[rgba(176,141,87,0.32)] to-transparent"
          />

          <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_minmax(0,1fr)] lg:items-end lg:gap-16">
            <div>
              <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-sand-strong)]">
                Espositori e Buyer
              </p>
              <h2
                id="final-cta-title"
                className="display-balance mt-4 max-w-[22ch] font-display text-[clamp(2rem,4.4vw,3rem)] leading-[1.02] tracking-[0.005em] text-[var(--color-ink-strong)]"
              >
                {siteConfig.finalCta.title}
              </h2>
              <p className="mt-5 max-w-[46ch] text-[1rem] leading-[1.7] text-[var(--color-muted)]">
                Due percorsi prioritari per entrare nel progetto con obiettivi
                chiari, relazioni rilevanti e un contesto mediterraneo ad alto
                valore percepito.
              </p>
            </div>

            <div className="lg:justify-self-end">
              <div className="flex flex-col gap-4 sm:flex-row sm:gap-4">
                {primaryActions.map((action, index) => (
                  <Button
                    key={action.href}
                    href={action.href}
                    variant={index === 0 ? "primary" : "soft"}
                    size="md"
                    className="w-full sm:w-auto"
                  >
                    {action.label}
                  </Button>
                ))}
              </div>

              <div className="mt-6 flex justify-start lg:justify-end">
                <Link
                  href="/contatti?interesse=partnership#richiesta-informazioni"
                  className="group font-ui inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-wine)] transition-colors duration-300 ease-out hover:text-[var(--color-wine-strong)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[rgba(107,30,30,0.5)]"
                >
                  Proponi una Partnership
                  <span
                    aria-hidden="true"
                    className="inline-block transition-transform duration-300 ease-out motion-reduce:transition-none motion-safe:group-hover:translate-x-1"
                  >
                    →
                  </span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
