import Link from "next/link";
import SectionHeader from "@/components/ui/SectionHeader";
import { siteConfig } from "@/data/site";

// Accenti cromatici per ciascuno dei 4 percorsi — stesso peso visivo, colore distinto
const accents = [
  { line: "bg-[rgba(122,38,52,0.72)]", number: "text-[var(--color-wine)]",  eyebrow: "text-[var(--color-wine)]"  },
  { line: "bg-[rgba(95,107,51,0.72)]", number: "text-[var(--color-olive)]", eyebrow: "text-[var(--color-olive)]" },
  { line: "bg-[rgba(19,41,61,0.55)]",  number: "text-[var(--color-sea)]",   eyebrow: "text-[var(--color-sea)]"   },
  { line: "bg-[rgba(200,167,111,0.9)]",number: "text-[rgba(160,130,80,0.9)]", eyebrow: "text-[rgba(160,130,80,0.96)]" },
] as const;

export default function AudienceGateway() {
  const audienceRoutes = siteConfig.audiences.map((audience, index) => ({
    ...audience,
    href: index === 3 ? "/contatti" : audience.href,
    ctaLabel: index === 3 ? "Proponi una Partnership" : audience.ctaLabel,
  }));

  return (
    <section className="section-divider section-space">
      <div className="section-shell">
        <SectionHeader
          eyebrow="Percorsi dedicati"
          title="Un portale, quattro accessi ad alto valore."
          intro="Ogni audience entra nel sito con un obiettivo preciso. La homepage mette ordine, qualifica il racconto e indirizza subito verso il percorso più utile."
        />

        <div className="mt-8 border-t border-[rgba(51,36,31,0.12)] xl:mt-10">
          {audienceRoutes.map((audience, index) => {
            const accent = accents[index];
            return (
              <article
                key={audience.title}
                className={`grid gap-4 py-8 sm:py-9 lg:grid-cols-[auto_minmax(0,0.28fr)_minmax(0,0.72fr)] lg:gap-8 ${
                  index > 0 ? "border-t border-[rgba(51,36,31,0.09)]" : ""
                }`}
              >
                {/* Numero + linea */}
                <div className="flex items-center gap-4 lg:items-start lg:pt-0.5">
                  <span
                    className={`font-ui text-[0.84rem] font-semibold leading-none tracking-[0.2em] ${accent.number} opacity-80`}
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <span
                    className={`h-px w-8 ${accent.line} lg:hidden`}
                    aria-hidden="true"
                  />
                  <span
                    className={`mt-0.5 hidden h-px w-10 lg:block ${accent.line}`}
                    aria-hidden="true"
                  />
                </div>

                {/* Eyebrow */}
                <p className={`eyebrow lg:pt-0.5 ${accent.eyebrow}`}>
                  {audience.eyebrow}
                </p>

                {/* Contenuto */}
                <div className="min-w-0">
                  <h3 className="font-display text-[1.52rem] leading-[1.02] tracking-[0.01em] text-[var(--color-grove)] sm:text-[1.9rem] lg:text-[2rem]">
                    {audience.title}
                  </h3>
                  <p className="mt-3 max-w-none text-[1rem] leading-[1.65] text-[var(--color-muted)] lg:max-w-[46ch]">
                    {audience.description}
                  </p>
                  <Link
                    href={audience.href}
                    className="font-ui mt-4 inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-grove)] transition-transform hover:translate-x-0.5 hover:text-[var(--color-wine)]"
                  >
                    {audience.ctaLabel}
                    <span aria-hidden="true">→</span>
                  </Link>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
