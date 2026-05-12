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
        <div className="section-shell grid gap-8 lg:grid-cols-[1.02fr_0.98fr] lg:items-center">
          <div>
            <p className="eyebrow">{page.eyebrow}</p>
            <h1 className="display-balance mt-5 max-w-4xl font-display text-[3.15rem] leading-[0.92] text-[var(--color-sea)] sm:text-[4.5rem]">
              {page.title}
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)]">
              {page.description}
            </p>
            <Button href={page.ctaHref} size="lg" className="mt-8 w-full sm:w-auto">
              {page.ctaLabel}
            </Button>
          </div>

          <aside className="panel rounded-[2rem] p-6 sm:p-8">
            <p className="eyebrow">Posizionamento</p>
            <p className="mt-4 text-base leading-8 text-[var(--color-muted)]">
              {page.summary}
            </p>
            <div className="mt-6 grid gap-3">
              {page.pillars.map((pillar) => (
                <div
                  key={pillar}
                  className="rounded-[1.25rem] border border-[var(--color-line)] bg-white/75 px-4 py-3 text-sm font-medium text-[var(--color-sea)]"
                >
                  {pillar}
                </div>
              ))}
            </div>
          </aside>
        </div>
      </section>

      <section className="section-divider section-space soft-wash">
        <div className="section-shell">
          <SectionHeader
            eyebrow="Evoluzione contenutistica"
            title={page.focusTitle}
            intro={page.focusIntro}
          />

          <div className="mt-10 grid gap-5 lg:grid-cols-3">
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
