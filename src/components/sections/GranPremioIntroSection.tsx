import { siteConfig } from "@/data/site";

/**
 * Blocco intro "Gran Premio del Gusto" mostrato sotto la fisarmonica
 * Partecipa: titolo/statistiche molto grandi + riquadro edizione (VINISUD.IT,
 * date, luogo, claim). Contenuto modificabile dal pannello /admin.
 */
export default function GranPremioIntroSection() {
  const g = siteConfig.granPremioIntro;

  return (
    <section
      id="gran-premio"
      aria-labelledby="gran-premio-title"
      className="section-space bg-[var(--color-grove)] text-[var(--color-ivory)]"
      data-content-key="sec:granPremioIntro"
    >
      <div className="section-shell text-center">
        <p
          className="font-ui text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-sand)]"
          data-content-key="field:granPremioIntro.kicker"
        >
          {g.kicker}
        </p>
        <p
          id="gran-premio-title"
          className="display-balance mx-auto mt-4 max-w-[18ch] font-display text-[clamp(2.4rem,7vw,4.5rem)] leading-[1.02] text-[var(--color-ivory)]"
          data-content-key="field:granPremioIntro.stat1"
        >
          {g.stat1}
        </p>
        <p
          className="mx-auto mt-3 font-display text-[clamp(1.2rem,3vw,1.9rem)] text-[var(--color-sand)]"
          data-content-key="field:granPremioIntro.stat2"
        >
          {g.stat2}
        </p>

        <div className="mx-auto mt-12 max-w-[52rem] border-t border-[rgba(255,215,87,0.3)] pt-10">
          <p
            className="font-ui text-[0.8rem] font-semibold uppercase tracking-[0.3em] text-[var(--color-sand)]"
            data-content-key="field:granPremioIntro.brand"
          >
            {g.brand}
          </p>
          <p className="mt-3 text-[1.02rem] text-[rgba(255,253,245,0.9)]" data-content-key="field:granPremioIntro.edition">
            {g.edition}
          </p>
          <p className="mt-1 font-display text-[1.4rem] text-[var(--color-ivory)]" data-content-key="field:granPremioIntro.dates">
            {g.dates}
          </p>
          <p className="mt-1 text-[0.95rem] text-[rgba(255,253,245,0.8)]" data-content-key="field:granPremioIntro.venue">
            {g.venue}
          </p>

          <h3
            className="mt-8 font-display text-[clamp(1.6rem,4vw,2.4rem)] text-[var(--color-ivory)]"
            data-content-key="field:granPremioIntro.title"
          >
            {g.title}
          </h3>
          <p className="mt-1 font-display text-[1.2rem] italic text-[var(--color-sand)]" data-content-key="field:granPremioIntro.subtitle">
            {g.subtitle}
          </p>

          <p className="mt-8 font-display text-[1.3rem] leading-tight text-[var(--color-ivory)]" data-content-key="field:granPremioIntro.claim1">
            {g.claim1}
          </p>
          <p className="font-display text-[1.3rem] leading-tight text-[var(--color-sand)]" data-content-key="field:granPremioIntro.claim2">
            {g.claim2}
          </p>

          <p className="mt-8 text-[0.9rem] tracking-wide text-[rgba(255,253,245,0.75)]" data-content-key="field:granPremioIntro.tags">
            {g.tags}
          </p>

          <p
            className="font-ui mt-8 inline-block rounded-full border border-[rgba(255,215,87,0.5)] bg-[rgba(255,215,87,0.12)] px-6 py-3 text-[0.85rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand)]"
            data-content-key="field:granPremioIntro.freeEntry"
          >
            {g.freeEntry}
          </p>
        </div>
      </div>
    </section>
  );
}
