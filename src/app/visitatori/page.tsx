import type { Metadata } from "next";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import VisitorCarnetForm from "@/components/forms/VisitorCarnetForm";
import { staticPages } from "@/data/pages";
import { createPageMetadata } from "@/data/site";

const page = staticPages.visitatori;

export const metadata: Metadata = createPageMetadata(
  "Visitatori: degustazioni e cultura mediterranea",
  page.metadataDescription,
);

export default function VisitatoriPage() {
  return (
    <>
      <section className="section-space-lg">
        <div className="section-shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
          <div>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1 className="display-balance mt-5 max-w-[18ch] font-display text-[clamp(2.4rem,6vw,4.25rem)] leading-[0.98] tracking-[0.005em] text-[var(--color-ink-strong)]">
              {page.title}
            </h1>
            <p className="mt-6 max-w-[58ch] text-[1.02rem] leading-[1.7] text-[var(--color-muted)] sm:text-[1.06rem]">
              {page.description}
            </p>

            <div
              id="richiesta-carnet"
              className="mt-10 scroll-mt-28 rounded-[1.25rem] border border-[rgba(176,141,87,0.4)] bg-[linear-gradient(180deg,rgba(255,251,244,0.96),rgba(247,243,232,0.92))] p-6 shadow-[0_14px_36px_rgba(42,32,23,0.07)] sm:p-9"
            >
              <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-wine)]">
                Esperienza visitatori
              </p>
              <h2 className="mt-3 font-display text-[1.7rem] leading-[1.1] tracking-[0.005em] text-[var(--color-ink-strong)] sm:text-[2rem]">
                Prenota il tuo accesso all’esperienza
              </h2>
              <p className="mt-3 max-w-[54ch] text-[0.98rem] leading-[1.65] text-[var(--color-muted)]">
                Scegli quanti ingressi desideri e lascia la tua email: ti aggiorneremo su
                disponibilità, carnet degustazione e modalità di accesso.
              </p>
              <div className="mt-7">
                <VisitorCarnetForm />
              </div>
            </div>
          </div>

          <aside className="rounded-[1.2rem] border border-[rgba(176,141,87,0.18)] bg-[rgba(255,251,244,0.7)] p-6 shadow-[0_6px_22px_rgba(42,32,23,0.05)] backdrop-blur-md sm:p-8">
            <p className="eyebrow">Posizionamento</p>
            <p className="mt-4 text-[1rem] leading-[1.7] text-[var(--color-muted)]">
              {page.summary}
            </p>

            <div className="mt-8 grid gap-6">
              {page.pillars.map((pillar, index) => (
                <article
                  key={pillar.title}
                  className="border-t border-[rgba(176,141,87,0.28)] pt-5"
                >
                  <span
                    className="font-ui text-[0.7rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-sand-strong)]"
                    aria-hidden="true"
                  >
                    {String(index + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-2 font-display text-[1.2rem] leading-[1.18] tracking-[0.005em] text-[var(--color-ink-strong)] sm:text-[1.3rem]">
                    {pillar.title}
                  </h3>
                  <p className="mt-2 text-[0.96rem] leading-[1.65] text-[var(--color-muted)]">
                    {pillar.description}
                  </p>
                </article>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-flow section-space">
        <div className="section-shell">
          <SectionHeader
            eyebrow="Evoluzione contenutistica"
            title={page.focusTitle}
            intro={page.focusIntro}
          />

          <div className="mt-12 grid gap-6 lg:grid-cols-3 lg:gap-7">
            {page.sections.map((section) => (
              <Card
                key={section.title}
                eyebrow={section.eyebrow}
                title={section.title}
                description={section.description}
                className="h-full"
              />
            ))}
          </div>
        </div>
      </section>

      {page.verifyNotes?.length ? (
        <section className="section-space">
          <div className="section-shell">
            <div className="panel rounded-[2rem] border-[rgba(122,38,52,0.16)] bg-[rgba(255,250,244,0.84)] p-6 sm:p-8">
              <p className="eyebrow">Da verificare</p>
              <ul className="mt-5 grid gap-3 text-sm leading-7 text-[var(--color-muted)]">
                {page.verifyNotes.map((note) => (
                  <li
                    key={note}
                    className="rounded-[1.15rem] border border-[rgba(122,38,52,0.12)] bg-white/70 px-4 py-3"
                  >
                    {note}
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </section>
      ) : null}
    </>
  );
}
