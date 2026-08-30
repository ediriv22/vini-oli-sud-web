import { Panel } from "@/components/sections/SfideAccordionSection";
import { createPageMetadata, siteConfig } from "@/data/site";

export const metadata = createPageMetadata(
  "1ª Edizione del Gran Premio del Gusto",
  "9 Sfide, 9 Vincitori: 70% Giuria Popolare, 30% Giuria Tecnica. Iscrivi la tua azienda al Gran Premio del Gusto 2026.",
);

/**
 * Pagina dedicata "1ª Edizione del Gran Premio del Gusto" (Format). Riusa
 * i dati e il renderer già esistenti per la scheda "Iscrivi la tua
 * Azienda" (concorsi, fasi, quota) invece di duplicare il markup: stessa
 * fonte, stesso pannello /admin. Vedi SfideAccordionSection.
 */
export default function GranPremioDelGustoPage() {
  const items = siteConfig.sfideAccordion.items;
  const index = items.findIndex((item) => item.kind === "iscrivi");
  const item = items[index];
  const g = siteConfig.granPremioIntro;

  return (
    <>
      <section className="section-space bg-[var(--color-grove)] text-[var(--color-ivory)]">
        <div className="section-shell text-center">
          <p className="font-ui text-[0.8rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-sand)]">
            {g.kicker}
          </p>
          <p className="display-balance mx-auto mt-4 max-w-[18ch] font-display text-[clamp(2rem,5.5vw,3.4rem)] leading-[1.05] text-[var(--color-ivory)]">
            {g.stat1}
          </p>
          <p className="mx-auto mt-3 font-display text-[clamp(1.1rem,2.6vw,1.6rem)] text-[var(--color-sand)]">
            {g.stat2}
          </p>
        </div>
      </section>

      <section className="section-flow section-space">
        <div className="section-shell">
          {item ? <Panel item={item} index={index} email={siteConfig.contact.projectEmail} /> : null}
        </div>
      </section>
    </>
  );
}
