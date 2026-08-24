import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

type CtaCard = {
  kind: string;
  title: string;
  body: string;
  note?: string;
  ctaLabel: string;
  ctaHref: string;
};

// Destinazione di fallback quando il link esterno non è ancora disponibile
// (es. form di iscrizione / biglietteria non ancora pronti): si resta sulla
// pagina invece di puntare a un link vuoto. Quando l'URL definitivo esiste,
// va inserito nel ctaHref della card in home-sections.json (chiave protetta).
const FALLBACK_HREF: Record<string, string> = {
  sponsor: "#sponsor",
  concorso: "#concorso",
  carnet: "#evento",
};

// Accento cromatico per card (barra superiore + icona), coerente col brand.
const ACCENT: Record<string, string> = {
  sponsor: "var(--color-sand)",
  concorso: "var(--color-wine)",
  carnet: "var(--color-grove)",
};

function CardIcon({ kind }: { kind: string }) {
  const common = {
    viewBox: "0 0 24 24",
    fill: "none",
    stroke: "currentColor",
    strokeWidth: 1.5,
    className: "h-8 w-8",
  } as const;
  if (kind === "sponsor") {
    // Stella / riconoscimento
    return (
      <svg {...common}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 3.2l2.5 5.1 5.6.8-4.1 4 1 5.6L12 16.9l-5 2.7 1-5.6-4.1-4 5.6-.8L12 3.2Z"
        />
      </svg>
    );
  }
  if (kind === "concorso") {
    // Coppa / gara
    return (
      <svg {...common}>
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M7 4h10v3.5a5 5 0 0 1-10 0V4Z M7 5H4.5v1.5A2.5 2.5 0 0 0 7 9M17 5h2.5v1.5A2.5 2.5 0 0 1 17 9M9.5 13h5v3.5h-5z M8 20h8"
        />
      </svg>
    );
  }
  // carnet: calice
  return (
    <svg {...common}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7 3h10l-1.2 9.2a3.8 3.8 0 0 1-7.6 0L7 3Z" />
      <path strokeLinecap="round" d="M12 15.5V21M8.5 21h7" />
    </svg>
  );
}

export default function CtaCardsSection() {
  const { ctaCards } = siteConfig;
  const cards = ctaCards.cards as readonly CtaCard[];

  return (
    <section
      id="partecipa"
      aria-labelledby="partecipa-title"
      className="section-flow section-space"
      data-content-key="sec:ctaCards"
    >
      <div className="section-shell">
        <div className="mx-auto max-w-[46rem] text-center">
          <p className="eyebrow text-center" data-content-key="field:ctaCards.eyebrow">
            {ctaCards.eyebrow}
          </p>
          <h2
            id="partecipa-title"
            className="display-balance mx-auto mt-4 max-w-[24ch] font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]"
            data-content-key="field:ctaCards.title"
          >
            {ctaCards.title}
          </h2>
        </div>

        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {cards.map((card, index) => {
            const href = card.ctaHref || FALLBACK_HREF[card.kind] || "#";
            const external = href.startsWith("http");
            const accent = ACCENT[card.kind] ?? "var(--color-sand)";
            return (
              <article
                key={card.kind}
                className="flex flex-col overflow-hidden rounded-[1.4rem] border border-[rgba(47,91,70,0.22)] bg-[var(--color-ivory)] shadow-[0_10px_28px_rgba(26,53,40,0.07)]"
              >
                <div className="h-1.5 w-full" style={{ backgroundColor: accent }} />
                <div className="flex flex-1 flex-col p-7">
                  <span style={{ color: accent }}>
                    <CardIcon kind={card.kind} />
                  </span>
                  <h3
                    className="mt-4 font-display text-[1.35rem] leading-[1.15] text-[var(--color-ink-strong)]"
                    data-content-key={`field:ctaCards.cards.${index}.title`}
                  >
                    {card.title}
                  </h3>
                  <p
                    className="mt-3 flex-1 text-[0.95rem] leading-[1.6] text-[var(--color-muted)]"
                    data-content-key={`field:ctaCards.cards.${index}.body`}
                  >
                    {card.body}
                  </p>
                  {card.note ? (
                    <p
                      className="font-ui mt-4 text-[0.78rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-wine)]"
                      data-content-key={`field:ctaCards.cards.${index}.note`}
                    >
                      {card.note}
                    </p>
                  ) : null}
                  <div className="mt-6">
                    <Button
                      href={href}
                      variant={card.kind === "sponsor" ? "primary" : "soft"}
                      size="md"
                      className="w-full"
                      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                    >
                      {card.ctaLabel}
                    </Button>
                  </div>
                </div>
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
}
