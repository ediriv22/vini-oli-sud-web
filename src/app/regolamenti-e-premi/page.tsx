import SectionHeader from "@/components/ui/SectionHeader";
import { createPageMetadata, siteConfig } from "@/data/site";

export const metadata = createPageMetadata(
  "Regolamenti e Premi",
  "Regolamento delle Masterclass Vini e Oli della Magna Grecia e del Gran Premio del Gusto: partecipazione, votazione e premi.",
);

/**
 * Pagina dedicata "Regolamenti e Premi" — due aree distinte:
 * Masterclass (Rassegna) e Gran Premio del Gusto. Qui vivono le regole di
 * partecipazione/votazione/premi, non la presentazione completa del
 * Format (quella sta in /format/gran-premio-del-gusto/, non ripetuta qui
 * per evitare doppioni).
 */
export default function RegolamentiEPremiPage() {
  const iscrivi = siteConfig.sfideAccordion.items.find((item) => item.kind === "iscrivi");

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
              Sarà redatto, come per l&rsquo;edizione 2025, dall&rsquo;Assessorato
              all&rsquo;Agricoltura della Regione Campania in collaborazione con AIS &ndash;
              Associazione Italiana Sommelier.
            </p>
          </div>
        </div>
      </section>

      <section className="section-flow section-space hairline-gold">
        <div className="section-shell">
          <SectionHeader
            eyebrow="Gran Premio del Gusto"
            title="Regolamento, partecipazione, votazione e premi"
            align="center"
          />

          <div className="mx-auto mt-10 flex max-w-[46rem] flex-col gap-6 text-center">
            <p className="text-[0.96rem] leading-[1.7] text-[var(--color-muted)]">
              {iscrivi?.note}
            </p>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
              <div className="rounded-[1rem] border border-[rgba(255,215,87,0.45)] px-3 py-5">
                <p className="font-display text-[1.5rem] text-[var(--color-wine)]">9</p>
                <p className="font-ui mt-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Sfide
                </p>
              </div>
              <div className="rounded-[1rem] border border-[rgba(255,215,87,0.45)] px-3 py-5">
                <p className="font-display text-[1.5rem] text-[var(--color-wine)]">9</p>
                <p className="font-ui mt-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Vincitori (1 per Sfida)
                </p>
              </div>
              <div className="rounded-[1rem] border border-[rgba(255,215,87,0.45)] px-3 py-5">
                <p className="font-display text-[1.5rem] text-[var(--color-wine)]">70%</p>
                <p className="font-ui mt-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Giuria Popolare
                </p>
              </div>
              <div className="rounded-[1rem] border border-[rgba(255,215,87,0.45)] px-3 py-5">
                <p className="font-display text-[1.5rem] text-[var(--color-wine)]">30%</p>
                <p className="font-ui mt-1 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
                  Giuria Tecnica
                </p>
              </div>
            </div>

            {iscrivi?.phasesTitle ? (
              <div className="text-left">
                <p className="eyebrow text-center">{iscrivi.phasesTitle}</p>
                {iscrivi.phasesIntro ? (
                  <p className="mt-3 text-center text-[0.9rem] leading-[1.6] text-[var(--color-muted)]">
                    {iscrivi.phasesIntro}
                  </p>
                ) : null}
                <ol className="mt-7 flex flex-col gap-3">
                  {iscrivi.phases?.map((phase, i) => (
                    <li
                      key={i}
                      className="flex gap-4 rounded-[1rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.5)] px-4 py-4"
                    >
                      <span className="font-ui shrink-0 text-[0.8rem] font-bold uppercase tracking-[0.08em] text-[var(--color-wine)]">
                        {phase.time}
                      </span>
                      <span>
                        <span className="block font-semibold text-[var(--color-ink-strong)]">
                          {phase.title}
                        </span>
                        {phase.desc ? (
                          <span className="mt-1 block text-[0.86rem] leading-[1.5] text-[var(--color-muted)]">
                            {phase.desc}
                          </span>
                        ) : null}
                      </span>
                    </li>
                  ))}
                </ol>
                {iscrivi.phasesNote ? (
                  <p className="mt-5 text-center text-[0.78rem] italic leading-[1.5] text-[var(--color-muted)]">
                    {iscrivi.phasesNote}
                  </p>
                ) : null}
              </div>
            ) : null}

            <p className="text-[0.86rem] leading-[1.6] text-[var(--color-muted)]">
              Elenco completo delle 9 Sfide e modalità di iscrizione:{" "}
              <a
                href="/format/gran-premio-del-gusto/"
                className="font-semibold text-[var(--color-wine)] underline underline-offset-2"
              >
                vai alla pagina Gran Premio del Gusto
              </a>
              .
            </p>
          </div>
        </div>
      </section>
    </>
  );
}
