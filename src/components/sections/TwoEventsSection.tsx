import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

/**
 * "Due eventi. Un'unica grande festa del gusto." — blocco esplicativo in
 * alto nella home: distingue subito Rassegna (ingresso libero, stand,
 * masterclass) e Gran Premio del Gusto (le 9 Sfide a concorso), ciascuno
 * con link alla propria pagina Format dedicata. Vedi src/app/format/.
 */
export default function TwoEventsSection() {
  const { twoEvents } = siteConfig;

  return (
    <section
      aria-labelledby="due-eventi-title"
      className="section-flow section-space-sm"
      data-content-key="sec:twoEvents"
    >
      <div className="section-shell max-w-[64rem] text-center">
        <h2
          id="due-eventi-title"
          className="display-balance mx-auto max-w-[26ch] font-display text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.08] text-[var(--color-ink-strong)]"
          data-content-key="field:twoEvents.title"
        >
          {twoEvents.title}
        </h2>

        <div className="mt-10 grid gap-5 sm:grid-cols-2">
          {twoEvents.cards.map((card, index) => (
            <div
              key={card.title}
              className="flex flex-col items-center gap-3 rounded-[1.2rem] border border-[rgba(47,91,70,0.28)] bg-[rgba(255,253,245,0.6)] px-6 py-8 text-center"
            >
              <p
                className="font-display text-[1.2rem] leading-[1.2] text-[var(--color-ink-strong)]"
                data-content-key={`field:twoEvents.cards.${index}.title`}
              >
                {card.title}
              </p>
              <p
                className="font-ui text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-wine)]"
                data-content-key={`field:twoEvents.cards.${index}.tagline`}
              >
                {card.tagline}
              </p>
              <div className="mt-2 flex flex-wrap justify-center gap-3">
                <Button href={card.ctaHref} variant="soft" size="sm">
                  {card.ctaLabel}
                </Button>
                {/* Secondario opzionale (oggi solo sulla card Gran Premio del
                    Gusto: "Diventa Giurato" → /pass-giurato/, richiesta
                    esplicita di riportarlo visibile in home). */}
                {"secondaryCtaHref" in card && card.secondaryCtaHref ? (
                  <Button href={card.secondaryCtaHref} variant="primary" size="sm">
                    {"secondaryCtaLabel" in card ? card.secondaryCtaLabel : ""}
                  </Button>
                ) : null}
              </div>
            </div>
          ))}
        </div>

        <p className="font-ui mt-10 text-[0.9rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-sand-strong)]">
          <span data-content-key="field:twoEvents.dateLine">{twoEvents.dateLine}</span>
          {" · "}
          <span data-content-key="field:twoEvents.venueLine">{twoEvents.venueLine}</span>
        </p>
      </div>
    </section>
  );
}
