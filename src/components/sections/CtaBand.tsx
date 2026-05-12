import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function CtaBand() {
  return (
    <section className="section-space">
      <div className="section-shell">
        <div className="overflow-hidden rounded-[2rem] bg-[linear-gradient(135deg,rgba(19,41,61,1),rgba(42,62,43,0.92)_45%,rgba(122,38,52,0.95)_100%)] px-6 py-10 text-[var(--color-ivory)] shadow-[0_24px_60px_rgba(19,41,61,0.2)] sm:px-10 sm:py-14">
          <SectionHeader
            eyebrow="Call to action"
            title={siteConfig.finalCta.title}
            align="center"
          />

          <div className="mt-8 flex flex-col justify-center gap-3 sm:flex-row">
            {siteConfig.finalCta.actions.map((action) => (
              <Button
                key={action.href}
                href={action.href}
                variant="ivory"
                size="lg"
                className="w-full sm:w-auto"
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
