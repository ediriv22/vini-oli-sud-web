import Button from "@/components/ui/Button";
import { ticketsSection } from "@/data/homePrices";
import { siteConfig } from "@/data/site";

/**
 * "Biglietti e iscrizioni" — sezione home subito dopo l'hero: rende
 * immediatamente visibili i prezzi già pubblicati su /pass-giurato/ e sulla
 * pagina di iscrizione prodotto, così l'utente non deve cercarli in un
 * sotto-menu. Dati in src/data/homePrices.ts (nessun prezzo hard-coded qui).
 */
export default function HomeTicketsSection() {
  const { organizer } = siteConfig;

  return (
    <section
      id="biglietti"
      aria-labelledby="biglietti-title"
      className="section-flow section-space-sm"
      data-content-key="sec:tickets"
    >
      <div className="section-shell max-w-[64rem] text-center">
        <span className="font-ui inline-block rounded-full border border-[rgba(255,215,87,0.5)] bg-[rgba(255,215,87,0.12)] px-5 py-2 text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-sand-strong)]">
          {ticketsSection.badge}
        </span>

        <h2
          id="biglietti-title"
          className="display-balance mx-auto mt-5 max-w-[32ch] font-display text-[clamp(1.7rem,3.6vw,2.4rem)] leading-[1.08] text-[var(--color-ink-strong)]"
        >
          Biglietti e iscrizioni
        </h2>

        <p className="mx-auto mt-4 max-w-[52ch] text-[0.98rem] leading-[1.7] text-[var(--color-muted)]">
          {ticketsSection.intro}
        </p>

        <div className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {ticketsSection.cards.map((card) => (
            <div
              key={`${card.name}-${card.subtitle}`}
              className={`flex flex-col items-center gap-2 rounded-[1.2rem] border px-5 py-7 text-center ${
                card.featured
                  ? "border-[var(--color-sand)] bg-[rgba(255,215,87,0.1)] shadow-[0_14px_32px_rgba(255,215,87,0.22)]"
                  : "border-[rgba(47,91,70,0.22)] bg-[rgba(255,253,245,0.6)]"
              }`}
            >
              <p className="font-display text-[1.05rem] leading-[1.2] text-[var(--color-ink-strong)]">
                {card.name}
              </p>
              <p className="font-ui text-[0.8rem] font-semibold uppercase tracking-[0.06em] text-[var(--color-wine)]">
                {card.subtitle}
              </p>
              <p className="mt-2 font-display text-[1.8rem] leading-[1] text-[var(--color-ink-strong)]">
                {card.price}
              </p>
              {"priceNote" in card && card.priceNote ? (
                <p className="text-[0.82rem] text-[var(--color-muted)]">{card.priceNote}</p>
              ) : null}
              {"note" in card && card.note ? (
                <p className="mt-1 text-[0.78rem] leading-[1.4] text-[var(--color-muted)]">{card.note}</p>
              ) : null}
              <Button
                href={card.ctaHref}
                variant={card.featured ? "primary" : "soft"}
                size="sm"
                className="mt-4"
              >
                {card.ctaLabel}
              </Button>
            </div>
          ))}
        </div>

        <p className="mx-auto mt-8 max-w-[56ch] text-[0.82rem] leading-[1.6] text-[var(--color-muted)]">
          {ticketsSection.footnote}
        </p>

        <p className="font-ui mt-4 text-[0.8rem] text-[var(--color-muted)]">
          Info: <a className="underline underline-offset-2" href={`mailto:${organizer.email}`}>{organizer.email}</a>
        </p>
      </div>
    </section>
  );
}
