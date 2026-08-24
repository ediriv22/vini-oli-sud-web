import { siteConfig } from "@/data/site";

/* Icone lineari minime (sole, calice, goccia, fiore) — stessa famiglia
 * visiva di Bootstrap Icons usata nel demo cliente, riprodotte come SVG
 * inline per non aggiungere una dipendenza solo per 4 glifi. */
function SunIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <circle cx="12" cy="12" r="4.5" />
      <path
        strokeLinecap="round"
        d="M12 2.5v2.2M12 19.3v2.2M4.2 4.2l1.6 1.6M18.2 18.2l1.6 1.6M2.5 12h2.2M19.3 12h2.2M4.2 19.8l1.6-1.6M18.2 5.8l1.6-1.6"
      />
    </svg>
  );
}

function GlassIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10l-1.2 9.2a3.8 3.8 0 0 1-7.6 0L7 3Z" />
      <path strokeLinecap="round" d="M12 15.5V21M8.5 21h7" />
    </svg>
  );
}

function DropIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        d="M12 3s6 6.8 6 11a6 6 0 1 1-12 0c0-4.2 6-11 6-11Z"
      />
    </svg>
  );
}

function FlowerIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="h-8 w-8">
      <circle cx="12" cy="12" r="2.4" />
      <path d="M12 9.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2ZM12 19.6a2.6 2.6 0 1 1 0-5.2 2.6 2.6 0 0 1 0 5.2ZM14.4 12a2.6 2.6 0 1 1 5.2 0 2.6 2.6 0 0 1-5.2 0ZM4.4 12a2.6 2.6 0 1 1 5.2 0 2.6 2.6 0 0 1-5.2 0Z" />
    </svg>
  );
}

const PILLAR_ICONS = [SunIcon, GlassIcon, DropIcon, FlowerIcon];

export default function TerritorySection() {
  const { territory } = siteConfig;

  return (
    <section
      id="territorio"
      aria-labelledby="territorio-title"
      className="section-space bg-[#fff3cc]"
      data-content-key="sec:territory"
    >
      <div className="section-shell">
        <div className="mx-auto max-w-[68rem] text-center">
          <p className="eyebrow text-center" data-content-key="field:territory.eyebrow">
            {territory.eyebrow}
          </p>
          <h2
            id="territorio-title"
            className="display-balance mx-auto mt-4 max-w-[26ch] font-display text-[clamp(2rem,4.6vw,3.25rem)] leading-[0.98] tracking-[0.005em] text-[var(--color-ink-strong)]"
          >
            Dove il Sole incontra il <em className="font-display italic text-[var(--color-sand-strong)]">Mito</em> e la{" "}
            <em className="font-display italic text-[var(--color-sand-strong)]">Storia</em>
          </h2>
          <p
            className="mx-auto mt-5 max-w-[64ch] text-[0.98rem] leading-[1.65] text-[var(--color-muted)] sm:text-[1.02rem] sm:leading-[1.7]"
            data-content-key="field:territory.intro"
          >
            {territory.intro}
          </p>
        </div>

        <ul className="mt-12 grid gap-5 sm:mt-14 sm:grid-cols-2 lg:grid-cols-4">
          {territory.pillars.map((pillar, index) => {
            const Icon = PILLAR_ICONS[index] ?? SunIcon;
            return (
              <li
                key={pillar.title}
                className="rounded-[1.2rem] border border-[rgba(255,215,87,0.55)] bg-[var(--color-ivory)] px-6 py-7 shadow-[0_8px_20px_rgba(26,53,40,0.06)]"
              >
                <span className="text-[var(--color-sand-strong)]">
                  <Icon />
                </span>
                <h3
                  className="mt-4 font-display text-[1.15rem] font-semibold leading-[1.15] text-[var(--color-ink-strong)]"
                  data-content-key={`field:territory.pillars.${index}.title`}
                >
                  {pillar.title}
                </h3>
                <p
                  className="mt-3 text-[0.92rem] leading-[1.6] text-[var(--color-muted)]"
                  data-content-key={`field:territory.pillars.${index}.description`}
                >
                  {pillar.description}
                </p>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
