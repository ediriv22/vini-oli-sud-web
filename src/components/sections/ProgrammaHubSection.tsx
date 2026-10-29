import Image from "next/image";

import { PRENOTA_LABEL, PRENOTA_URL, SCALETTA } from "@/data/prenota";

/**
 * Pagina Programma: Masterclass con il logo della Regione Campania, la scaletta delle
 * presentazioni e degustazioni (dati in src/data/prenota.ts) e i collegamenti alle altre sezioni.
 * 29/10/2026: le Sfide non ci sono piu', al loro posto degustazioni gratuite su prenotazione.
 */

const COLLEGAMENTI = [
  {
    titolo: "Regolamenti e premi",
    testo: "Il regolamento delle Masterclass e le informazioni sulla partecipazione.",
    href: "/regolamenti-e-premi/",
    cta: "Leggi i regolamenti",
  },
  {
    titolo: "Vincitori 2025",
    testo: "L'albo d'oro della prima edizione.",
    href: "/vincitori-2025/",
    cta: "Vedi i vincitori",
  },
  {
    titolo: "Diventa sponsor",
    testo: "Porta il tuo marchio sul Lungomare Caracciolo, davanti al pubblico della Rassegna.",
    href: "/sponsor/",
    cta: "Pacchetti sponsor",
  },
];

export default function ProgrammaHubSection() {
  return (
    <>
      {/* Masterclass + Regione Campania */}
      <section
        id="masterclass"
        aria-labelledby="masterclass-title"
        className="section-flow section-space hairline-gold"
      >
        <div className="section-shell mx-auto max-w-[46rem] text-center">
          <p className="eyebrow">Masterclass</p>
          <h2
            id="masterclass-title"
            className="display-balance mt-4 font-display text-[clamp(1.8rem,3.8vw,2.5rem)] leading-[1.08] text-[var(--color-ink-strong)]"
          >
            Le Masterclass della Magna Grecia
          </h2>
          <p className="mx-auto mt-5 max-w-[42ch] text-[0.96rem] leading-[1.7] text-[var(--color-muted)]">
            Degustazioni guidate dentro la Rassegna, ad accesso libero come tutto il Villaggio.
            <strong> A cura dell&rsquo;AIS &ndash; Associazione Italiana Sommelier</strong>, con
            l&rsquo;Assessorato all&rsquo;Agricoltura della Regione Campania.
          </p>

          <div className="mx-auto mt-8 flex max-w-[34rem] flex-col items-center gap-5 rounded-[1.1rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.6)] px-6 py-7">
            <div className="flex flex-wrap items-center justify-center gap-x-8 gap-y-5">
              <Image
                src="/brand/partners/ais-associazione-italiana-sommelier.jpg"
                alt="AIS — Associazione Italiana Sommelier"
                width={220}
                height={110}
                className="h-auto w-[150px] object-contain"
              />
              <Image
                src="/brand/partners/regione-campania-v2.png"
                alt="Regione Campania — Assessorato all'Agricoltura"
                width={220}
                height={110}
                className="h-auto w-[180px] object-contain"
              />
            </div>
            <p className="text-[0.92rem] leading-[1.6] text-[var(--color-muted)]">
              Masterclass a cura dell&rsquo;AIS &ndash; Associazione Italiana Sommelier, in
              collaborazione con l&rsquo;Assessorato all&rsquo;Agricoltura della Regione Campania.
            </p>
          </div>

          <a
            href="/regolamenti-e-premi/"
            className="font-ui mt-6 inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-wine)] transition-colors duration-300 ease-out hover:text-[var(--color-wine-strong)]"
          >
            Regolamento delle Masterclass
            <span aria-hidden="true">→</span>
          </a>
        </div>
      </section>

      {/* Presentazioni e degustazioni (dal 29/10/2026: niente piu' Sfide) */}
      <section
        id="degustazioni"
        aria-labelledby="degustazioni-title"
        className="section-flow section-space hairline-gold"
      >
        <div className="section-shell mx-auto max-w-[52rem]">
          <p className="eyebrow text-center">Presentazioni e degustazioni</p>
          <h2
            id="degustazioni-title"
            className="display-balance mt-4 text-center font-display text-[clamp(1.8rem,3.8vw,2.5rem)] leading-[1.08] text-[var(--color-ink-strong)]"
          >
            Il programma delle degustazioni
          </h2>
          <p className="mx-auto mt-4 max-w-[46ch] text-center text-[0.94rem] leading-[1.65] text-[var(--color-muted)]">
            Le aziende dell&rsquo;eccellenza enogastronomica della nostra terra presentano i loro
            prodotti. Scegli a quale degustazione partecipare: la partecipazione è{" "}
            <strong>gratuita per i primi 60 iscritti</strong>.
          </p>

          <div className="mt-10 flex flex-col gap-8">
            {SCALETTA.map(({ giorno, slot }) => (
              <div key={giorno}>
                <p className="font-ui text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]">
                  {giorno}
                </p>
                <ul className="mt-4 flex flex-col gap-3">
                  {slot.map((s) => (
                    <li
                      key={s.ora + s.nome}
                      className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-[0.9rem] border border-[rgba(47,91,70,0.18)] bg-[rgba(255,253,245,0.6)] px-4 py-3"
                    >
                      <span className="font-ui text-[0.9rem] font-semibold text-[var(--color-wine)]">
                        {s.ora}
                      </span>
                      <span className="text-[0.98rem] text-[var(--color-ink-strong)]">{s.nome}</span>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <p className="mt-6 text-center text-[0.82rem] italic text-[var(--color-muted)]">
            Giorni e orari possono cambiare per esigenze organizzative.
          </p>

          <div className="mt-8 text-center">
            <a
              href={PRENOTA_URL}
              className="font-ui inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-wine)] px-6 text-[0.86rem] font-semibold text-[rgba(255,253,245,1)] transition-colors duration-300 ease-out hover:bg-[var(--color-wine-strong)]"
            >
              {PRENOTA_LABEL}
            </a>
          </div>
        </div>
      </section>

      {/* Tutte le altre sezioni */}
      <section
        id="tutto-il-programma"
        aria-labelledby="tutto-title"
        className="section-flow section-space hairline-gold"
      >
        <div className="section-shell mx-auto max-w-[52rem]">
          <h2
            id="tutto-title"
            className="display-balance text-center font-display text-[clamp(1.7rem,3.4vw,2.2rem)] leading-[1.1] text-[var(--color-ink-strong)]"
          >
            Tutto il resto, da qui
          </h2>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2">
            {COLLEGAMENTI.map((c) => (
              <li
                key={c.titolo}
                className="flex flex-col gap-2 rounded-[1rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.6)] px-5 py-5"
              >
                <p className="font-display text-[1.15rem] text-[var(--color-ink-strong)]">{c.titolo}</p>
                <p className="text-[0.9rem] leading-[1.6] text-[var(--color-muted)]">{c.testo}</p>
                {c.href ? (
                  <a
                    href={c.href}
                    className="font-ui mt-1 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-wine)] transition-colors duration-300 ease-out hover:text-[var(--color-wine-strong)]"
                  >
                    {c.cta}
                    <span aria-hidden="true">→</span>
                  </a>
                ) : null}
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
