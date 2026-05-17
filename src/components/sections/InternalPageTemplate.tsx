import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import SectionHeader from "@/components/ui/SectionHeader";
import type { StaticPageContent } from "@/data/pages";

type InternalPageTemplateProps = {
  page: StaticPageContent;
};

export default function InternalPageTemplate({
  page,
}: InternalPageTemplateProps) {
  return (
    <>
      <section className="section-space-lg">
        <div className="section-shell grid gap-12 lg:grid-cols-[1.05fr_0.95fr] lg:items-start lg:gap-16">
          <div>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1 className="display-balance mt-5 max-w-[18ch] font-display text-[clamp(2.4rem,6vw,4.25rem)] leading-[0.98] tracking-[0.005em] text-[var(--color-ink-strong)]">
              {page.title}
            </h1>
            <p className="mt-6 max-w-[58ch] text-[1.04rem] leading-[1.7] text-[var(--color-muted)]">
              {page.description}
            </p>
            <Button href={page.ctaHref} size="md" className="mt-9 w-full sm:w-auto">
              {page.ctaLabel}
            </Button>
            {page.ctaNote ? (
              <p className="mt-3 max-w-[52ch] text-[0.88rem] leading-[1.65] text-[var(--color-muted)]">
                {page.ctaNote}
              </p>
            ) : null}
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

            {page.externalReference ? (
              <div className="mt-8 border-t border-[rgba(176,141,87,0.28)] pt-6">
                <p className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-sand-strong)]">
                  {page.externalReference.eyebrow}
                </p>
                <h3 className="mt-2 font-display text-[1.16rem] leading-[1.22] tracking-[0.005em] text-[var(--color-ink-strong)] sm:text-[1.24rem]">
                  {page.externalReference.title}
                </h3>
                <p className="mt-2 text-[0.94rem] leading-[1.65] text-[var(--color-muted)]">
                  {page.externalReference.description}
                </p>
                <a
                  href={page.externalReference.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group font-ui mt-4 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-wine)] transition-colors duration-300 ease-out hover:text-[var(--color-wine-strong)] focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[rgba(107,30,30,0.5)]"
                >
                  {page.externalReference.ctaLabel}
                  <span
                    className="inline-block transition-transform duration-300 ease-out motion-reduce:transition-none motion-safe:group-hover:translate-x-1"
                    aria-hidden="true"
                  >
                    ↗
                  </span>
                </a>
              </div>
            ) : null}
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
        <section className="section-space-sm">
          <div className="section-shell">
            <div className="rounded-[1.2rem] border border-[rgba(107,30,30,0.18)] bg-[rgba(255,250,244,0.84)] p-6 shadow-[0_6px_18px_rgba(42,32,23,0.05)] sm:p-8">
              <p className="eyebrow">Da verificare</p>
              <ul className="mt-5 grid gap-3 text-[0.92rem] leading-[1.65] text-[var(--color-muted)]">
                {page.verifyNotes.map((note) => (
                  <li
                    key={note}
                    className="rounded-[0.9rem] border border-[rgba(176,141,87,0.2)] bg-white/70 px-4 py-3"
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
