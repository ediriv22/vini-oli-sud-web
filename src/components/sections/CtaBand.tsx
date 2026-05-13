import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

export default function CtaBand() {
  return (
    <section className="section-space">
      <div className="section-shell">
        <div className="overflow-hidden rounded-[1.5rem] border border-[rgba(200,167,111,0.18)] bg-[var(--color-grove)] px-6 py-10 text-[var(--color-ivory)] shadow-[0_18px_36px_rgba(18,52,35,0.16)] sm:px-10 sm:py-12">
          <div className="mx-auto max-w-[760px] text-center">
            <div className="flex items-center justify-center gap-4">
              <span className="h-px w-8 bg-[rgba(227,199,140,0.82)]" aria-hidden="true" />
              <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgba(227,199,140,0.92)] sm:text-[0.8rem]">
                Prossimo passo
              </p>
              <span className="h-px w-8 bg-[rgba(227,199,140,0.82)]" aria-hidden="true" />
            </div>
            <h2 className="display-balance mt-4 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-none text-[var(--color-ivory)]">
              {siteConfig.finalCta.title}
            </h2>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {siteConfig.finalCta.actions.map((action, index) => (
              <Button
                key={action.href}
                href={action.href}
                variant={index === 0 ? "ivory" : "ghost"}
                size="lg"
                className={`w-full sm:w-auto sm:px-8 lg:px-9 ${
                  index === 0
                    ? ""
                    : "border-[rgba(248,243,232,0.24)] text-[var(--color-ivory)] hover:bg-white/8 hover:text-[var(--color-ivory)]"
                }`}
              >
                {action.label}
              </Button>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
