import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

export default function AudienceGateway() {
  const audienceRoutes = siteConfig.audiences.map((audience, index) => ({
    ...audience,
    href: index === 3 ? "/contatti" : audience.href,
    ctaLabel:
      index === 3 ? "Proponi una Partnership" : audience.ctaLabel,
  }));

  const audienceAccents = [
    {
      line: "bg-[rgba(122,38,52,0.86)]",
      number: "text-[var(--color-wine)]",
    },
    {
      line: "bg-[rgba(95,107,51,0.82)]",
      number: "text-[var(--color-olive)]",
    },
    {
      line: "bg-[rgba(19,41,61,0.42)]",
      number: "text-[var(--color-sea)]",
    },
    {
      line: "bg-[rgba(200,167,111,0.84)]",
      number: "text-[var(--color-sand)]",
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

        <div className="mt-10 border-y border-[rgba(51,36,31,0.12)]">
          {audienceRoutes.map((audience, index) => (
            <article
              key={audience.title}
              className={`grid gap-6 py-7 sm:gap-8 sm:py-8 lg:grid-cols-[minmax(0,0.72fr)_minmax(0,1fr)_auto] lg:items-start ${
                index > 0 ? "border-t border-[rgba(51,36,31,0.1)]" : ""
              }`}
            >
              <div className="pr-0 lg:pr-6">
                <span
                  className={`mb-5 block h-px w-12 ${audienceAccents[index]?.line ?? "bg-[rgba(51,36,31,0.2)]"}`}
                  aria-hidden="true"
                />
                <div className="flex items-end gap-4">
                  <span
                    className={`font-display text-[2rem] leading-none sm:text-[2.35rem] ${audienceAccents[index]?.number ?? "text-[var(--color-grove)]"}`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <p className="eyebrow pb-1 text-[var(--color-muted)]">
                    {audience.eyebrow}
                  </p>
                </div>
              </div>

              <div className="max-w-[40rem]">
                <h3 className="font-display text-[1.75rem] leading-[0.98] text-[var(--color-grove)] sm:text-[2.05rem]">
                  {audience.title}
                </h3>
                <p className="mt-4 max-w-[55ch] text-[0.98rem] leading-7 text-[var(--color-muted)]">
                  {audience.description}
                </p>
              </div>

              <div className="lg:justify-self-end lg:pt-2">
                <Link
                  href={audience.href}
                  className="font-ui inline-flex items-center gap-2 text-[0.84rem] font-semibold tracking-[0.06em] text-[var(--color-grove)] uppercase transition-transform hover:translate-x-0.5 hover:text-[var(--color-wine)]"
                >
                  {audience.ctaLabel}
                  <span aria-hidden="true">→</span>
                </Link>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
