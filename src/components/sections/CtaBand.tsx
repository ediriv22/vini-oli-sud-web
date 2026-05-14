import Link from "next/link";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

export default function CtaBand() {
  const primaryActions = siteConfig.hero.actions.slice(0, 2);

  return (
    <section className="section-space">
      <div className="section-shell">
        <div className="overflow-hidden rounded-[2px] border border-[rgba(200,167,111,0.2)] bg-[var(--color-grove)] px-5 py-8 text-[var(--color-ivory)] shadow-[0_14px_28px_rgba(18,52,35,0.12)] sm:px-10 sm:py-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,0.96fr)_minmax(0,1.04fr)] lg:items-end">
            <div>
              <div className="flex items-center gap-4">
                <span className="h-px w-8 bg-[rgba(227,199,140,0.82)]" aria-hidden="true" />
                <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgba(227,199,140,0.92)] sm:text-[0.8rem]">
                  Espositori e Buyer
                </p>
              </div>
              <h2 className="display-balance mt-4 max-w-[18ch] sm:max-w-[20ch] lg:max-w-[24ch] font-display text-[clamp(2.15rem,8vw,4.7rem)] leading-[0.96] tracking-[0.01em] text-[var(--color-ivory)]">
                {siteConfig.finalCta.title}
              </h2>
              <p className="mt-4 max-w-none text-[1rem] leading-[1.62] text-[rgba(248,243,232,0.78)] lg:max-w-[36ch]">
                Due percorsi prioritari per entrare nel progetto con obiettivi chiari, relazioni rilevanti e un contesto mediterraneo ad alto valore percepito.
              </p>
            </div>

            <div className="lg:justify-self-end">
              <div className="grid gap-3 sm:grid-cols-2">
                {primaryActions.map((action, index) => (
                  <Button
                    key={action.href}
                    href={action.href}
                    variant={index === 0 ? "ivory" : "ghost"}
                    size="lg"
                    className={`w-auto justify-self-start sm:px-8 lg:min-w-[17rem] ${
                      index === 0
                        ? ""
                        : "border-[rgba(248,243,232,0.24)] text-[var(--color-ivory)] hover:bg-white/8 hover:text-[var(--color-ivory)]"
                    }`}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>

              <div className="mt-4 flex justify-start lg:justify-end">
                <Link
                  href="/contatti"
                  className="group font-ui inline-flex items-center gap-2 text-[0.82rem] font-semibold tracking-[0.1em] text-[rgba(248,243,232,0.82)] uppercase transition-colors duration-300 ease-out hover:text-[var(--color-ivory)]"
                >
                  Proponi una Partnership
                  <span
                    className="inline-block transition-transform duration-300 ease-out motion-reduce:transition-none motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
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
