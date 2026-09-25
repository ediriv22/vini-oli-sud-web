import Button from "@/components/ui/Button";
import { sponsorPackagesSection } from "@/data/homePrices";

/**
 * "Pacchetti sponsor" — sezione home subito dopo "Biglietti e iscrizioni":
 * i 4 pacchetti del flyer sponsor, resi visibili direttamente in home
 * invece che solo su /sponsor/. Dati in src/data/homePrices.ts, prezzi
 * riportati esattamente come sul flyer (IVA non specificata alla fonte).
 */
export default function HomeSponsorPackagesSection() {
  return (
    <section
      id="pacchetti-sponsor"
      aria-labelledby="pacchetti-sponsor-title"
      className="section-flow section-space-sm"
      data-content-key="sec:sponsorPackages"
    >
      <div className="section-shell max-w-[76rem] text-center">
        <p className="eyebrow">{sponsorPackagesSection.eyebrow}</p>
        <h2
          id="pacchetti-sponsor-title"
          className="display-balance mx-auto mt-4 max-w-[34ch] font-display text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.08] text-[var(--color-ink-strong)]"
        >
          {sponsorPackagesSection.title}
        </h2>
        <p className="font-ui mt-3 text-[0.85rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-wine)]">
          {sponsorPackagesSection.subtitle}
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {sponsorPackagesSection.packages.map((pack) => (
            <div
              key={pack.name}
              className={`flex flex-col items-center gap-3 rounded-[1.2rem] border px-5 py-7 text-center ${
                pack.featured
                  ? "border-[var(--color-sand)] bg-[rgba(255,215,87,0.1)] shadow-[0_14px_32px_rgba(255,215,87,0.22)]"
                  : "border-[rgba(47,91,70,0.22)] bg-[rgba(255,253,245,0.6)]"
              }`}
            >
              <p className="font-display text-[1.1rem] leading-[1.2] text-[var(--color-ink-strong)]">
                {pack.name}
              </p>
              <p className="font-display text-[1.7rem] leading-[1] text-[var(--color-ink-strong)]">
                {pack.price}
              </p>
              <p className="text-[0.82rem] italic leading-[1.4] text-[var(--color-muted)]">
                {pack.tagline}
              </p>
              <ul className="mt-2 flex flex-col gap-1.5 text-left text-[0.82rem] leading-[1.45] text-[var(--color-muted)]">
                {pack.features.map((feature) => (
                  <li key={feature} className="flex gap-2">
                    <span aria-hidden="true" className="text-[var(--color-wine)]">
                      •
                    </span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-10 max-w-[56ch] text-[0.95rem] leading-[1.6] text-[var(--color-ink-strong)]">
          {sponsorPackagesSection.bottomLine}
        </p>
        <div className="mt-5 flex flex-wrap justify-center gap-3">
          <Button href={sponsorPackagesSection.ctaHref} variant="soft" size="md">
            {sponsorPackagesSection.ctaLabel}
          </Button>
          {sponsorPackagesSection.brochures.map((brochure) => (
            <Button key={brochure.href} href={brochure.href} variant="ghost" size="md">
              {brochure.label}
            </Button>
          ))}
        </div>
      </div>
    </section>
  );
}
