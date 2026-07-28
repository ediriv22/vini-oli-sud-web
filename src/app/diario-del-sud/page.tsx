import type { Metadata } from "next";
import Link from "next/link";
import FoodRadarSuggestionForm from "@/components/forms/FoodRadarSuggestionForm";
import { foodRadarItems } from "@/data/foodRadar";
import { createPageMetadata } from "@/data/site";

export const metadata: Metadata = createPageMetadata(
  "Diario del Sud",
  "Radar editoriale di ViniSud: rassegna ragionata di titoli, fonti e segnali dal mondo del vino, dell’olio e dell’agroalimentare mediterraneo.",
);

export default function DiarioDelSudPage() {
  const hasItems = foodRadarItems.length > 0;

  return (
    <>
      <section className="section-space-lg">
        <div className="section-shell max-w-4xl">
          <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-wine)]">
            Radar editoriale
          </p>
          <h1 className="display-balance mt-4 font-display text-[2.85rem] leading-[0.96] text-[var(--color-grove)] sm:text-[3.45rem] lg:text-[3.95rem]">
            Diario del Sud
          </h1>
          <p className="mt-5 max-w-[58ch] text-[1.05rem] leading-[1.7] text-[var(--color-muted)] sm:text-[1.12rem]">
            Una rassegna ragionata di titoli, fonti e segnali dal mondo del vino,
            dell’olio e dell’agroalimentare mediterraneo.
          </p>
        </div>
      </section>

      <section
        aria-labelledby="diario-radar-title"
        className="section-flow section-space premium-divider"
      >
        <div className="section-shell">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="font-ui text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-olive)]">
                Rassegna
              </p>
              <h2
                id="diario-radar-title"
                className="mt-2 font-display text-[1.9rem] leading-[1.05] text-[var(--color-grove)] sm:text-[2.1rem]"
              >
                Segnali e fonti
              </h2>
            </div>
            {hasItems ? (
              <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
                {foodRadarItems.length}{" "}
                {foodRadarItems.length === 1 ? "voce" : "voci"} in rassegna
              </p>
            ) : null}
          </div>

          {hasItems ? (
            <ul className="mt-9 grid gap-5 sm:gap-6 md:grid-cols-2">
              {foodRadarItems.map((item) => (
                <li
                  key={item.id}
                  className="relative flex h-full flex-col rounded-[1.4rem] border border-[rgba(200,167,111,0.22)] bg-[rgba(255,251,244,0.6)] px-6 py-6 transition-[border-color,background-color] duration-300 ease-out hover:border-[rgba(95,107,51,0.32)] hover:bg-[rgba(255,251,244,0.78)] motion-reduce:transition-none sm:px-7 sm:py-7"
                >
                  <span
                    className="pointer-events-none absolute inset-x-6 top-0 h-px bg-gradient-to-r from-[rgba(200,167,111,0.55)] via-[rgba(95,107,51,0.22)] to-transparent sm:inset-x-7"
                    aria-hidden="true"
                  />

                  <p className="font-ui text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-wine)]">
                    {item.category}
                  </p>

                  <h3 className="display-balance mt-3 font-display text-[1.32rem] leading-[1.18] text-[var(--color-grove)] sm:text-[1.42rem]">
                    {item.title}
                  </h3>

                  <p className="mt-3 font-ui text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-muted)]">
                    {item.source}
                    {item.date ? (
                      <>
                        <span
                          aria-hidden="true"
                          className="mx-2 text-[var(--color-sand)]"
                        >
                          ·
                        </span>
                        <time className="font-ui normal-case tracking-[0.08em] text-[var(--color-muted)]">
                          {item.date}
                        </time>
                      </>
                    ) : null}
                  </p>

                  <div className="mt-5 border-t border-[rgba(200,167,111,0.22)] pt-4">
                    <p className="font-ui text-[0.66rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-olive)]">
                      Perché ci interessa
                    </p>
                    <p className="mt-2 text-[0.95rem] leading-[1.62] text-[var(--color-ink)]">
                      {item.note}
                    </p>
                  </div>

                  <div className="mt-6">
                    <a
                      href={item.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group font-ui inline-flex items-center gap-2 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-wine)] transition-colors duration-300 ease-out hover:text-[var(--color-grove)]"
                    >
                      Leggi alla fonte
                      <span
                        aria-hidden="true"
                        className="inline-block transition-transform duration-300 ease-out motion-reduce:transition-none motion-safe:group-hover:translate-x-1"
                      >
                        ↗
                      </span>
                    </a>
                  </div>
                </li>
              ))}
            </ul>
          ) : (
            <div className="mt-9 grid gap-5 lg:grid-cols-[1.35fr_1fr] lg:items-stretch">
              <div className="relative rounded-[1.6rem] border border-[rgba(200,167,111,0.26)] bg-[rgba(255,251,244,0.66)] px-6 py-9 sm:px-9 sm:py-12">
                <span
                  className="pointer-events-none absolute inset-x-9 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(200,167,111,0.45)] to-transparent"
                  aria-hidden="true"
                />
                <p className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-olive)]">
                  Radar in ascolto
                </p>
                <h3 className="mt-4 max-w-[26ch] font-display text-[1.6rem] leading-[1.12] text-[var(--color-grove)] sm:text-[1.85rem]">
                  Le prime segnalazioni sono in preparazione.
                </h3>
                <p className="mt-4 max-w-[56ch] text-[0.98rem] leading-[1.68] text-[var(--color-muted)] sm:text-[1.02rem]">
                  Il Diario del Sud raccoglierà titoli, fonti e link selezionati
                  dal radar editoriale ViniSud. Ogni segnalazione sarà
                  pubblicata solo dopo verifica della fonte originale.
                </p>
              </div>

              <aside className="relative flex flex-col justify-between rounded-[1.6rem] border border-[rgba(95,107,51,0.24)] bg-[rgba(247,249,241,0.7)] px-6 py-8 sm:px-8 sm:py-10">
                <div>
                  <p className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-wine)]">
                    Contribuisci
                  </p>
                  <p className="mt-3 max-w-[34ch] font-display text-[1.25rem] leading-[1.18] text-[var(--color-grove)] sm:text-[1.35rem]">
                    Vuoi segnalarci una notizia, un territorio o una storia da
                    monitorare?
                  </p>
                </div>
                <div className="mt-6">
                  <Link
                    href="#proponi-segnalazione"
                    className="group font-ui inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-wine)] transition-colors duration-300 ease-out hover:text-[var(--color-grove)]"
                  >
                    Proponi una segnalazione
                    <span
                      aria-hidden="true"
                      className="inline-block transition-transform duration-300 ease-out motion-reduce:transition-none motion-safe:group-hover:translate-y-0.5"
                    >
                      ↓
                    </span>
                  </Link>
                </div>
              </aside>
            </div>
          )}
        </div>
      </section>

      <section
        id="proponi-segnalazione"
        aria-labelledby="diario-suggestion-title"
        className="section-space scroll-mt-28"
      >
        <div className="section-shell">
          <div className="grid gap-10 lg:grid-cols-[0.92fr_1.08fr] lg:items-start lg:gap-14">
            <div>
              <p className="font-ui text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-olive)]">
                Contribuisci al radar
              </p>
              <h2
                id="diario-suggestion-title"
                className="mt-3 max-w-[20ch] font-display text-[2.15rem] leading-[1.02] text-[var(--color-grove)] sm:text-[2.5rem] lg:text-[2.85rem]"
              >
                Proponi una segnalazione
              </h2>
              <p className="mt-5 max-w-[52ch] text-[1rem] leading-[1.7] text-[var(--color-muted)] sm:text-[1.04rem]">
                Hai trovato una notizia, una fonte o una storia coerente con vino,
                olio e territori del Sud? Inviaci il link: la valuteremo per il
                radar editoriale.
              </p>
              <ul className="mt-7 grid gap-3 text-[0.92rem] leading-[1.6] text-[var(--color-muted)]">
                <li className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-px w-6 shrink-0 bg-[rgba(200,167,111,0.55)]"
                  />
                  Pubblichiamo titolo, fonte, link e nota breve. Mai l’articolo
                  intero.
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-px w-6 shrink-0 bg-[rgba(200,167,111,0.55)]"
                  />
                  Ogni voce viene verificata prima di entrare nel Diario.
                </li>
                <li className="flex gap-3">
                  <span
                    aria-hidden="true"
                    className="mt-2 h-px w-6 shrink-0 bg-[rgba(200,167,111,0.55)]"
                  />
                  Il link rimanda sempre alla fonte originale.
                </li>
              </ul>
            </div>

            <div className="relative rounded-[1.8rem] border border-[rgba(200,167,111,0.32)] bg-gradient-to-br from-[rgba(255,251,244,0.92)] via-[rgba(252,247,238,0.88)] to-[rgba(247,243,232,0.82)] p-6 shadow-[0_12px_30px_rgba(38,25,17,0.06)] sm:p-8">
              <span
                className="pointer-events-none absolute inset-x-8 top-0 h-px bg-gradient-to-r from-[rgba(200,167,111,0.55)] via-[rgba(95,107,51,0.28)] to-transparent"
                aria-hidden="true"
              />
              <p className="font-ui text-[0.66rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-wine)]">
                Modulo editoriale
              </p>
              <h3 className="mt-2 font-display text-[1.5rem] leading-[1.1] text-[var(--color-grove)] sm:text-[1.65rem]">
                Una segnalazione, un link, un contesto.
              </h3>
              <div className="mt-6">
                <FoodRadarSuggestionForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
