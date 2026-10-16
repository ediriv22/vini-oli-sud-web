import Image from "next/image";

import { siteConfig } from "@/data/site";

/**
 * 15/10/2026 (richiesta Edvige: "deve essere tutto raggiungibile dalla sezione
 * programma"): la pagina Programma diventa il punto da cui si arriva a tutto.
 * Tre blocchi: le Masterclass con il logo della Regione Campania, il programma
 * delle 9 Sfide con giorno e ora, e i collegamenti alle altre sezioni.
 *
 * Il programma delle Sfide non e' riscritto qui: viene letto dalla stessa
 * sorgente della fisarmonica "Partecipa" (content/settings/home-sections.json),
 * cosi' cambiando le categorie da pannello cambia anche questa pagina.
 */

type Concorso = {
  icon: string;
  name: string;
  numero: number;
  giorno: string;
  ora: string;
  descrizione?: string;
};

const COLLEGAMENTI = [
  {
    titolo: "Giurato",
    testo: "Scegli le tue Sfide e richiedi il Pass Giurato. I posti sono 60 per ciascuna Sfida.",
    href: "/pass-giurato/",
    cta: "Diventa Giurato",
  },
  {
    titolo: "Selezione aziende",
    testo:
      "Le aziende che desiderano concorrere alle Sfide saranno selezionate dall'Assessorato all'Agricoltura della Regione Campania, che ha pubblicato un bando apposito. Le domande si chiudono il 31 ottobre 2026.",
    href: "/format/gran-premio-del-gusto/iscrizione/",
    cta: "Vai al bando",
  },
  {
    titolo: "Regolamenti e premi",
    testo: "Come si vota, come si assegnano i premi, il regolamento delle Masterclass e delle Sfide.",
    href: "/regolamenti-e-premi/",
    cta: "Leggi i regolamenti",
  },
  {
    titolo: "Vincitori 2025",
    testo: "L'albo d'oro della prima edizione, Sfida per Sfida.",
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
  const partecipa = siteConfig.sfideAccordion.items;
  const sfide = ((partecipa.find((i) => i.kind === "iscrivi") as { concorsi?: Concorso[] } | undefined)
    ?.concorsi ?? []) as Concorso[];

  const giorni = sfide.reduce<Record<string, Concorso[]>>((acc, s) => {
    (acc[s.giorno] ??= []).push(s);
    return acc;
  }, {});

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

      {/* Programma delle 9 Sfide */}
      {sfide.length ? (
        <section
          id="sfide"
          aria-labelledby="sfide-title"
          className="section-flow section-space hairline-gold"
        >
          <div className="section-shell mx-auto max-w-[52rem]">
            <p className="eyebrow text-center">Gran Premio del Gusto</p>
            <h2
              id="sfide-title"
              className="display-balance mt-4 text-center font-display text-[clamp(1.8rem,3.8vw,2.5rem)] leading-[1.08] text-[var(--color-ink-strong)]"
            >
              Il programma delle 9 Sfide
            </h2>
            <p className="mx-auto mt-4 max-w-[44ch] text-center text-[0.94rem] leading-[1.65] text-[var(--color-muted)]">
              Ogni Sfida dura circa 60 minuti. Per assaggiare e votare serve il Pass Giurato:
              i posti sono <strong>60 per ciascuna Sfida</strong>.
            </p>

            <div className="mt-10 flex flex-col gap-8">
              {Object.entries(giorni).map(([giorno, elenco]) => (
                <div key={giorno}>
                  <p className="font-ui text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]">
                    {giorno}
                  </p>
                  <ul className="mt-4 flex flex-col gap-3">
                    {elenco.map((s) => (
                      <li
                        key={s.numero}
                        className="flex flex-wrap items-baseline gap-x-4 gap-y-1 rounded-[0.9rem] border border-[rgba(47,91,70,0.18)] bg-[rgba(255,253,245,0.6)] px-4 py-3"
                      >
                        <span className="font-ui text-[0.9rem] font-semibold text-[var(--color-wine)]">
                          {s.ora}
                        </span>
                        <span className="text-[0.98rem] text-[var(--color-ink-strong)]">
                          <span aria-hidden="true">{s.icon} </span>
                          {s.numero}. {s.name}
                        </span>
                        {s.descrizione ? (
                          <span className="basis-full text-[0.86rem] leading-[1.55] text-[var(--color-muted)]">
                            {s.descrizione}
                          </span>
                        ) : null}
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
                href="/pass-giurato/"
                className="font-ui inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-wine)] px-6 text-[0.86rem] font-semibold text-[rgba(255,253,245,1)] transition-colors duration-300 ease-out hover:bg-[var(--color-wine-strong)]"
              >
                Acquista il tuo Pass Giurato
              </a>
            </div>
          </div>
        </section>
      ) : null}

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
                key={c.href}
                className="flex flex-col gap-2 rounded-[1rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.6)] px-5 py-5"
              >
                <p className="font-display text-[1.15rem] text-[var(--color-ink-strong)]">{c.titolo}</p>
                <p className="text-[0.9rem] leading-[1.6] text-[var(--color-muted)]">{c.testo}</p>
                <a
                  href={c.href}
                  className="font-ui mt-1 inline-flex items-center gap-2 text-[0.8rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-wine)] transition-colors duration-300 ease-out hover:text-[var(--color-wine-strong)]"
                >
                  {c.cta}
                  <span aria-hidden="true">→</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      </section>
    </>
  );
}
