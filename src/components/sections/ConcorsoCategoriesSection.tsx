import { siteConfig } from "@/data/site";

/**
 * Categorie del concorso (Grand Prix della Magna Grecia). Elenco delle
 * categorie in gara, richiamato dalla card "Iscriviti alla Gara".
 * Contenuto modificabile dal pannello /admin, area "Sezioni Home".
 */
export default function ConcorsoCategoriesSection() {
  const { concorsoCategorie } = siteConfig;

  return (
    <section
      id="concorso"
      aria-labelledby="concorso-title"
      className="section-space bg-[#fff3cc]"
      data-content-key="sec:concorsoCategorie"
    >
      <div className="section-shell">
        <div className="mx-auto max-w-[52rem] text-center">
          <p className="eyebrow text-center" data-content-key="field:concorsoCategorie.eyebrow">
            {concorsoCategorie.eyebrow}
          </p>
          <h2
            id="concorso-title"
            className="display-balance mx-auto mt-4 max-w-[24ch] font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]"
            data-content-key="field:concorsoCategorie.title"
          >
            {concorsoCategorie.title}
          </h2>
          <p
            className="mx-auto mt-5 max-w-[60ch] text-[0.98rem] leading-[1.65] text-[var(--color-muted)]"
            data-content-key="field:concorsoCategorie.intro"
          >
            {concorsoCategorie.intro}
          </p>
        </div>

        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {concorsoCategorie.categories.map((category, index) => (
            <li
              key={category.name}
              className="flex items-start gap-3 rounded-[1.1rem] border border-[rgba(47,91,70,0.22)] bg-[var(--color-ivory)] px-5 py-5 shadow-[0_6px_16px_rgba(26,53,40,0.05)]"
            >
              <span aria-hidden="true" className="text-[1.6rem] leading-none">
                {category.icon}
              </span>
              <p
                className="font-display text-[0.98rem] leading-[1.35] text-[var(--color-ink-strong)]"
                data-content-key={`field:concorsoCategorie.categories.${index}.name`}
              >
                {category.name}
              </p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
