import Link from "next/link";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function AudienceGateway() {
  const audienceRoutes = siteConfig.audiences;
  const primaryRoutes = audienceRoutes.slice(0, 2);
  const secondaryRoutes = audienceRoutes.slice(2);

  const primaryAccents = [
    {
      line: "bg-[rgba(122,38,52,0.76)]",
      number: "text-[var(--color-wine)]",
      button: "primary" as const,
    },
    {
      line: "bg-[rgba(95,107,51,0.82)]",
      number: "text-[var(--color-olive)]",
      button: "secondary" as const,
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

        <div className="mt-7 grid gap-4 sm:mt-8 sm:gap-5 xl:mt-9 xl:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.72fr)] xl:gap-6 xl:items-start">
          <div className="grid gap-4 sm:gap-5">
            {primaryRoutes.map((audience, index) => (
              <article
                key={audience.title}
                className={`relative overflow-hidden rounded-[1.9rem] bg-[linear-gradient(180deg,rgba(255,251,245,0.94),rgba(248,241,231,0.8))] px-5 py-7 shadow-[0_16px_34px_rgba(38,25,17,0.05)] sm:px-7 sm:py-8 ${
                  index > 0 ? "xl:ml-12" : ""
                }`}
              >
                <div className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)] md:gap-7 lg:gap-8">
                  <div className="flex items-center gap-3.5 md:block md:pr-4">
                    <span
                      className={`font-ui text-[0.84rem] font-semibold leading-none tracking-[0.2em] ${primaryAccents[index]?.number ?? "text-[var(--color-grove)]"} opacity-80`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <span
                      className={`h-px w-7 ${primaryAccents[index]?.line ?? "bg-[rgba(200,167,111,0.72)]"} md:mt-4 md:block md:w-9`}
                      aria-hidden="true"
                    />
                    <p className="eyebrow pb-0.5 text-[var(--color-muted)] md:mt-4 md:pb-0">
                      {audience.eyebrow}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-display text-[1.78rem] leading-[0.97] tracking-[0.01em] text-[var(--color-grove)] sm:text-[2.35rem] lg:text-[2.55rem]">
                      {audience.title}
                    </h3>
                    <p className="mt-3 max-w-none text-[1rem] leading-[1.62] text-[var(--color-muted)] lg:max-w-[46ch]">
                      {audience.description}
                    </p>

                    <div className="mt-4 sm:mt-5">
                      <Button
                        href={audience.href}
                        size="lg"
                        variant={primaryAccents[index]?.button ?? "secondary"}
                        className="w-auto"
                      >
                        {audience.ctaLabel}
                      </Button>
                    </div>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <aside className="grid gap-4 sm:gap-5 xl:gap-4">
            {secondaryRoutes.map((audience, index) => (
              <article
                key={audience.title}
                className="rounded-[1.7rem] bg-[linear-gradient(180deg,rgba(255,252,246,0.9),rgba(248,243,234,0.72))] px-5 py-6 shadow-[0_14px_28px_rgba(38,25,17,0.04)] sm:px-6 sm:py-7"
              >
                <div className="flex items-center gap-3">
                  <span className="font-ui text-[0.82rem] font-semibold leading-none tracking-[0.2em] text-[rgba(200,167,111,0.82)]">
                    {String(index + 3).padStart(2, "0")}
                  </span>
                  <span
                    className={`h-px w-8 ${
                      index === 0
                        ? "bg-[rgba(19,41,61,0.18)]"
                        : "bg-[rgba(200,167,111,0.54)]"
                    }`}
                    aria-hidden="true"
                  />
                </div>

                <p className="eyebrow mt-3 text-[var(--color-muted)]">
                  {audience.eyebrow}
                </p>
                <h3 className="mt-2.5 max-w-none font-display text-[1.48rem] leading-[1.02] tracking-[0.01em] text-[var(--color-grove)] lg:max-w-[18ch]">
                  {audience.title}
                </h3>
                <p className="mt-3 max-w-none text-[1rem] leading-[1.62] text-[var(--color-muted)] lg:max-w-[34ch]">
                  {audience.description}
                </p>
                <Link
                  href={audience.href}
                  className="font-ui mt-4 inline-flex items-center gap-2 text-[0.82rem] font-semibold tracking-[0.1em] text-[var(--color-grove)] uppercase transition-transform hover:translate-x-0.5 hover:text-[var(--color-wine)]"
                >
                  {audience.ctaLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              </article>
            ))}
          </aside>
        </div>
      </div>
    </section>
  );
}
