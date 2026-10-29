import SectionHeader from "@/components/ui/SectionHeader";
import { PRENOTA_LABEL, PRENOTA_URL } from "@/data/prenota";
import { createPageMetadata } from "@/data/site";

export const metadata = createPageMetadata(
  "Regolamenti e Premi",
  "Regolamento delle Masterclass Vini e Oli della Magna Grecia e come partecipare alle degustazioni gratuite del Villaggio.",
);

/**
 * "Regolamenti e Premi": Masterclass (Rassegna) e partecipazione alle degustazioni.
 * 29/10/2026: niente piu' Sfide, voto e premi; resta come si partecipa.
 */
export default function RegolamentiEPremiPage() {
  return (
    <>
      <section className="section-flow section-space">
        <div className="section-shell">
          <SectionHeader
            eyebrow="Masterclass — Vini e Oli della Magna Grecia"
            title="Regolamento e premi delle Masterclass"
            align="center"
          />
          <div className="mx-auto mt-8 max-w-[42rem] rounded-[1.1rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.6)] px-6 py-7 text-center">
            <p className="font-ui text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-wine)]">
              Il Regolamento sarà pubblicato prossimamente.
            </p>
            <p className="mt-3 text-[0.94rem] leading-[1.6] text-[var(--color-muted)]">
              Sarà redatto dall&rsquo;Assessorato all&rsquo;Agricoltura della Regione
              Campania in collaborazione con AIS &ndash; Associazione Italiana Sommelier.
            </p>
          </div>
        </div>
      </section>

      <section className="section-flow section-space hairline-gold">
        <div className="section-shell">
          <SectionHeader
            eyebrow="Presentazioni e degustazioni"
            title="Come partecipare"
            align="center"
          />
          <div className="mx-auto mt-10 flex max-w-[42rem] flex-col gap-5 text-center">
            <p className="text-[0.96rem] leading-[1.7] text-[var(--color-muted)]">
              L&rsquo;ingresso al Villaggio è gratuito. Per assistere a una presentazione con
              degustazione scegli quella che ti interessa dal programma e prenotati: la
              partecipazione è <strong>gratuita per i primi 60 iscritti</strong>.
            </p>
            <p className="text-[0.86rem] italic leading-[1.6] text-[var(--color-muted)]">
              Giorni e orari possono cambiare per esigenze organizzative.
            </p>
            <div className="mt-2 flex flex-wrap items-center justify-center gap-4">
              <a
                href={PRENOTA_URL}
                className="font-ui inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-wine)] px-6 text-[0.86rem] font-semibold text-[rgba(255,253,245,1)] transition-colors duration-300 ease-out hover:bg-[var(--color-wine-strong)]"
              >
                {PRENOTA_LABEL}
              </a>
              <a
                href="/programma/"
                className="font-semibold text-[var(--color-wine)] underline underline-offset-2"
              >
                Vedi il programma
              </a>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
