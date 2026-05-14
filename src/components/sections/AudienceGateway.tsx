import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function AudienceGateway() {
  const audienceRoutes = siteConfig.audiences;

  const audienceAccents = [
    {
      line: "bg-[rgba(122,38,52,0.76)]",
      number: "text-[var(--color-wine)]",
    },
    {
      line: "bg-[rgba(95,107,51,0.82)]",
      number: "text-[var(--color-olive)]",
    },
    {
      line: "bg-[rgba(19,41,61,0.22)]",
      number: "text-[var(--color-sea)]",
    },
    {
      line: "bg-[rgba(200,167,111,0.56)]",
      number: "text-[var(--color-grove)]",
    },
  ] as const;

  return (
    <section className="section-space pt-14 sm:pt-16 lg:pt-20">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Percorsi dedicati"
          title="Un portale, quattro accessi ad alto valore."
          intro="Ogni audience entra nel sito con un obiettivo preciso. La homepage mette ordine, qualifica il racconto e indirizza subito verso il percorso più utile."
        />

        <div className="mt-7 grid gap-4 sm:mt-8 sm:grid-cols-2 sm:gap-5 lg:mt-9 xl:grid-cols-4">
          {audienceRoutes.map((audience, index) => {
            const accent = audienceAccents[index];
            const isPrimary = index < 2;
            const ctaVariant = index === 0 ? ("gatewayPrimary" as const) : ("soft" as const);

            return (
              <article
                key={audience.title}
                className="flex h-full flex-col rounded-[1.75rem] border border-[rgba(200,167,111,0.14)] bg-[linear-gradient(180deg,rgba(255,252,246,0.94),rgba(247,240,230,0.82))] px-5 py-6 shadow-[0_10px_24px_rgba(38,25,17,0.035)] sm:px-6 sm:py-7"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`font-ui text-[0.82rem] font-semibold leading-none tracking-[0.2em] ${accent.number} opacity-80`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`h-px w-8 ${accent.line}`}
                    aria-hidden="true"
                  />
                </div>

                <p className="eyebrow mt-3 text-[var(--color-muted)]">
                  {audience.eyebrow}
                </p>
                <h3
                  className={`mt-2.5 font-display leading-[1.02] tracking-[0.01em] text-[var(--color-grove)] ${
                    isPrimary
                      ? "text-[1.62rem] sm:text-[1.78rem]"
                      : "text-[1.5rem] sm:text-[1.64rem]"
                  }`}
                >
                  {audience.title}
                </h3>
                <p className="mt-3 max-w-none flex-1 text-[1rem] leading-[1.62] text-[var(--color-muted)]">
                  {audience.description}
                </p>

                <div className="mt-5">
                  <Button
                    href={audience.href}
                    size="lg"
                    variant={ctaVariant}
                    className="w-full justify-center"
                  >
                    {audience.ctaLabel}
                  </Button>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
