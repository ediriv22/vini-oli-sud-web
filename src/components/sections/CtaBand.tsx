import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

export default function CtaBand() {
  return (
    <section className="section-space">
      <div className="section-shell">
        <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(18,52,35,0.98),rgba(27,44,41,0.95)_48%,rgba(122,38,52,0.9)_100%)] px-6 py-10 text-[var(--color-ivory)] shadow-[0_24px_60px_rgba(19,41,61,0.2)] sm:px-10 sm:py-12">
          <div className="mx-auto max-w-[760px] text-center">
            <p className="text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[rgba(227,199,140,0.92)] sm:text-[0.8rem]">
              Prossimo passo
            </p>
            <h2 className="display-balance mt-4 font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-none text-[var(--color-ivory)]">
              {siteConfig.finalCta.title}
            </h2>
          </div>

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {siteConfig.finalCta.actions.map((action) => (
              <Button
                key={action.href}
                href={action.href}
                variant="ivory"
                size="lg"
                className="w-full sm:w-auto sm:px-8 lg:px-9"
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
