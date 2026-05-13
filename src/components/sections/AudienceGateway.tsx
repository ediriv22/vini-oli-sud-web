import Link from "next/link";
import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function AudienceGateway() {
  const audienceRoutes = siteConfig.audiences.map((audience, index) => ({
    ...audience,
    href: index === 3 ? "/contatti" : audience.href,
    ctaLabel:
      index === 3 ? "Proponi una Partnership" : audience.ctaLabel,
  }));
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
    <section className="section-divider section-space">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Percorsi dedicati"
          title="Un portale, quattro accessi ad alto valore."
          intro="Ogni audience entra nel sito con un obiettivo preciso. La homepage mette ordine, qualifica il racconto e indirizza subito verso il percorso più utile."
        />

        <div className="mt-8 grid gap-6 xl:mt-10 xl:grid-cols-[minmax(0,1.08fr)_minmax(18rem,0.72fr)] xl:items-start">
          <div className="grid gap-0 border-t border-[rgba(51,36,31,0.12)]">
            {primaryRoutes.map((audience, index) => (
              <article
                key={audience.title}
                className={`relative py-10 sm:py-8 ${
                  index > 0 ? "border-t border-[rgba(51,36,31,0.1)] xl:ml-16" : ""
                }`}
              >
                <span
                  className={`mb-4 block h-px w-12 ${primaryAccents[index]?.line ?? "bg-[rgba(200,167,111,0.72)]"}`}
                  aria-hidden="true"
                />

                <div className="grid gap-4 md:grid-cols-[auto_minmax(0,1fr)] md:gap-8">
                  <div className="flex items-end gap-3.5 md:block md:pr-4">
                    <span
                      className={`font-ui text-[0.84rem] font-semibold leading-none tracking-[0.2em] ${primaryAccents[index]?.number ?? "text-[var(--color-grove)]"} opacity-80`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>
                    <p className="eyebrow pb-0.5 text-[var(--color-muted)] md:mt-4 md:pb-0">
                      {audience.eyebrow}
                    </p>
                  </div>

                  <div className="min-w-0">
                    <h3 className="font-display text-[1.78rem] leading-[0.97] tracking-[0.01em] text-[var(--color-grove)] sm:text-[2.55rem]">
                      {audience.title}
                    </h3>
                    <p className="mt-3.5 max-w-none text-[1rem] leading-[1.62] text-[var(--color-muted)] lg:max-w-[46ch]">
                      {audience.description}
                    </p>

                    <div className="mt-5">
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

          <aside className="border-t border-[rgba(51,36,31,0.12)] xl:border-t-0 xl:border-l xl:border-[rgba(51,36,31,0.08)] xl:pl-8">
            {secondaryRoutes.map((audience, index) => (
              <article
                key={audience.title}
                className={`py-8 sm:py-7 ${
                  index > 0 ? "border-t border-[rgba(51,36,31,0.1)]" : ""
                }`}
              >
                <div className="flex items-center justify-between gap-4">
                  <span className="font-ui text-[0.82rem] font-semibold leading-none tracking-[0.2em] text-[rgba(200,167,111,0.82)]">
                    {String(index + 3).padStart(2, "0")}
                  </span>
                  <span
                    className={`h-px flex-1 ${
                      index === 0
                        ? "bg-[rgba(19,41,61,0.18)]"
                        : "bg-[rgba(200,167,111,0.54)]"
                    }`}
                    aria-hidden="true"
                  />
                </div>

                <p className="eyebrow mt-4 text-[var(--color-muted)]">
                  {audience.eyebrow}
                </p>
                <h3 className="mt-3 max-w-none font-display text-[1.48rem] leading-[1.02] tracking-[0.01em] text-[var(--color-grove)] lg:max-w-[18ch]">
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
