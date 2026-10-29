import ScalettaDegustazioni from "@/components/sections/ScalettaDegustazioni";
import { PRENOTA_LABEL, PRENOTA_URL } from "@/data/prenota";
import { createPageMetadata, siteConfig } from "@/data/site";

export const metadata = createPageMetadata(
  "Presentazioni e degustazioni",
  "Le aziende dell'eccellenza enogastronomica presentano i loro prodotti al Villaggio Vini e Oli della Magna Grecia: degustazioni gratuite per i primi 60 iscritti. 27-28-29 novembre 2026, Rotonda Diaz, Napoli.",
);

/**
 * 29/10/2026: le Sfide e il Gran Premio come concorso non ci sono piu'. La pagina (stesso URL, gia'
 * linkato da post pubblicati) presenta le degustazioni e rimanda alla prenotazione.
 */
export default function PresentazioniDegustazioniPage() {
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
        <div className="section-shell mx-auto max-w-[46rem] text-center">
          <p className="mx-auto max-w-[46ch] text-[0.98rem] leading-[1.7] text-[var(--color-muted)]">
            Le aziende dell&rsquo;eccellenza enogastronomica della nostra terra presentano i loro
            prodotti. Scegli a quale degustazione partecipare: la partecipazione è{" "}
            <strong>gratuita per i primi 60 iscritti</strong>.
          </p>
          <div className="mt-8">
            <a
              href={PRENOTA_URL}
              className="font-ui inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-wine)] px-7 text-[0.9rem] font-semibold text-[rgba(255,253,245,1)] transition-colors duration-300 ease-out hover:bg-[var(--color-wine-strong)]"
            >
              {PRENOTA_LABEL}
            </a>
          </div>
          <div className="mt-12">
            <ScalettaDegustazioni />
          </div>
          <p className="mt-6 text-[0.82rem] italic text-[var(--color-muted)]">
            Giorni e orari possono cambiare per esigenze organizzative.
          </p>
        </div>
      </section>
    </>
  );
}
