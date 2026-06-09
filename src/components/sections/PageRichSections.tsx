import Button from "@/components/ui/Button";
import SectionHeader from "@/components/ui/SectionHeader";
import type { StaticPageBlock, StaticPageRichSection } from "@/data/pages";

type PageRichSectionsProps = {
  sections: StaticPageRichSection[];
};

function Block({ block }: { block: StaticPageBlock }) {
  switch (block.kind) {
    case "paragraph":
      return (
        <p className="max-w-[68ch] text-[1.02rem] leading-[1.72] text-[var(--color-muted)]">
          {block.text}
        </p>
      );
    case "list":
      return (
        <div className="max-w-[68ch]">
          {block.intro ? (
            <p className="text-[1.02rem] leading-[1.72] text-[var(--color-muted)]">
              {block.intro}
            </p>
          ) : null}
          <ul className="mt-4 grid gap-3">
            {block.items.map((item) => (
              <li
                key={item}
                className="flex gap-3 text-[1rem] leading-[1.65] text-[var(--color-ink)]"
              >
                <span
                  aria-hidden="true"
                  className="mt-[0.55em] h-[6px] w-[6px] flex-shrink-0 rounded-full bg-[var(--color-wine)]"
                />
                <span>{item}</span>
              </li>
            ))}
          </ul>
        </div>
      );
    case "cta":
      return (
        <Button href={block.href} size="md" className="w-full sm:w-auto">
          {block.label}
        </Button>
      );
    case "note":
      return (
        <p className="max-w-[68ch] rounded-[1.1rem] border border-[rgba(176,141,87,0.3)] bg-[rgba(255,251,245,0.7)] px-5 py-4 text-[0.94rem] leading-[1.65] text-[var(--color-muted)]">
          {block.text}
        </p>
      );
    case "highlight":
      return (
        <div className="rounded-[1.25rem] border border-[rgba(122,38,52,0.22)] bg-[linear-gradient(180deg,rgba(255,251,244,0.96),rgba(247,243,232,0.92))] px-6 py-7 text-center shadow-[0_10px_28px_rgba(42,32,23,0.07)]">
          <p className="font-display text-[1.6rem] uppercase tracking-[0.04em] text-[var(--color-wine)] sm:text-[1.9rem]">
            {block.title}
          </p>
          {block.lines.map((line) => (
            <p
              key={line}
              className="font-ui mt-3 text-[0.86rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-sand-strong)]"
            >
              {line}
            </p>
          ))}
        </div>
      );
    case "cards":
      return (
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {block.items.map((card) => (
            <article
              key={card.title}
              className="card-shell rounded-[1.1rem] p-6 sm:p-7 card-theme-parchment texture-parchment"
            >
              <div className="relative z-10">
                {card.icon ? (
                  <span
                    aria-hidden="true"
                    className="text-[1.6rem] leading-none"
                  >
                    {card.icon}
                  </span>
                ) : null}
                <h3 className="mt-3 font-display text-[1.25rem] leading-[1.14] tracking-[0.005em] text-[var(--card-title)]">
                  {card.title}
                </h3>
                <p className="mt-3 text-[0.94rem] leading-[1.62] text-[var(--card-body)]">
                  {card.description}
                </p>
              </div>
            </article>
          ))}
        </div>
      );
    default:
      return null;
  }
}

export default function PageRichSections({ sections }: PageRichSectionsProps) {
  if (!sections.length) return null;

  return (
    <>
      {sections.map((section) => (
        <section key={section.title} className="section-flow section-space">
          <div className="section-shell">
            <SectionHeader
              eyebrow={section.eyebrow}
              title={section.title}
              intro={section.intro}
            />
            <div className="mt-10 grid gap-7">
              {section.blocks.map((block, index) => (
                <Block key={`${section.title}-${index}`} block={block} />
              ))}
            </div>
          </div>
        </section>
      ))}
    </>
  );
}
