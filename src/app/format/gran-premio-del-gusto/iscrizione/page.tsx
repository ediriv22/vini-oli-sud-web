import { TrackClick } from "@/components/consent/TrackEvents";
import { createPageMetadata, siteConfig } from "@/data/site";

export const metadata = createPageMetadata(
  "Selezione aziende per il Gran Premio del Gusto",
  "Le aziende che desiderano concorrere alle Sfide del Gran Premio del Gusto saranno selezionate dall'Assessorato all'Agricoltura della Regione Campania, che ha pubblicato un bando apposito.",
);

/**
 * 7/10/2026 (richiesta Edvige, regola cambiata): i prodotti in gara NON
 * sono più scelti dai produttori tramite autocandidatura a pagamento — qui
 * prima c'era il modulo "Iscrizione Prodotto" con quota di € 1.100 + IVA e
 * bonifico. Ora la selezione passa da un bando della Regione Campania.
 *
 * Rotta lasciata viva (stesso URL /format/gran-premio-del-gusto/iscrizione/,
 * linkato da hooks_cta_vinisud.json e da post già pubblicati) ma il modulo
 * e la quota sono stati rimossi: non c'è più nulla da inviare qui.
 *
 * 15/10/2026: il bando è uscito, link mandato da Edvige. I dati qui sotto
 * (requisiti, e-mail per la domanda, quote, scadenza 31/10/2026) sono letti
 * dalla pagina ufficiale della Regione Campania:
 * https://agricoltura.regione.campania.it/fiere/racing-show-2026.html
 * Niente più segnaposto.
 */
export default function SelezioneProdottoPage() {
  const concorsi = siteConfig.sfideAccordion.items.find((i) => i.kind === "iscrivi")?.concorsi ?? [];

  return (
    <section className="section-flow section-space">
      <div className="section-shell mx-auto max-w-[46rem] text-center">
        <p className="eyebrow text-center">Gran Premio del Gusto 2026</p>
        <h1 className="display-balance mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]">
          Selezione aziende per il Gran Premio del Gusto
        </h1>
        <p className="mt-3 font-display text-[1.1rem] text-[var(--color-wine)]">
          Le Sfide della Magna Grecia
        </p>
        <p className="mt-2 text-[0.94rem] leading-[1.6] text-[var(--color-muted)]">
          27 · 28 · 29 novembre 2026 · Rotonda Diaz – Lungomare Caracciolo – Napoli
        </p>
        <p className="mx-auto mt-6 max-w-[42ch] text-[0.96rem] leading-[1.65] text-[var(--color-muted)]">
          Le aziende che desiderano concorrere alle Sfide del Gran Premio del Gusto saranno
          selezionate dall&rsquo;Assessorato all&rsquo;Agricoltura della Regione Campania, che ha
          pubblicato un bando apposito.
        </p>
        <p className="mx-auto mt-4 max-w-[42ch] text-[0.96rem] leading-[1.65] text-[var(--color-ink-strong)]">
          <strong>Le domande si chiudono il 31 ottobre 2026.</strong>
        </p>
        {/* 15/10/2026 (Edvige): niente requisiti, niente e-mail, niente quote e niente
            rimando alla segreteria. Solo il pulsante: i requisiti e il modo di
            presentare la domanda stanno nel bando, che e' la fonte ufficiale e puo'
            cambiare senza che ce ne accorgiamo. */}
        <p className="mt-7">
          <TrackClick event="ClickButton" params={{ content_name: "Bando Regione Campania" }}>
            <a
              href="https://agricoltura.regione.campania.it/fiere/racing-show-2026.html"
              target="_blank"
              rel="noreferrer"
              className="font-ui inline-flex h-11 items-center justify-center rounded-full bg-[var(--color-wine)] px-6 text-[0.86rem] font-semibold text-[rgba(255,253,245,1)] transition-colors duration-300 ease-out hover:bg-[var(--color-wine-strong)]"
            >
              Leggi il bando della Regione Campania
            </a>
          </TrackClick>
        </p>
      </div>

      {concorsi.length ? (
        <div className="section-shell mx-auto mt-12 max-w-[46rem]">
          <h2 className="font-display text-center text-[1.2rem] text-[var(--color-ink-strong)]">
            I 9 Concorsi
          </h2>
          <ul className="mt-5 grid gap-3 sm:grid-cols-2">
            {concorsi.map((c) => (
              <li
                key={c.name}
                className="flex items-center gap-3 rounded-[0.9rem] border border-[rgba(47,91,70,0.22)] bg-[rgba(255,253,245,0.6)] px-4 py-3 text-[0.92rem] text-[var(--color-ink-strong)]"
              >
                <span aria-hidden="true">{c.icon}</span>
                {c.name}
              </li>
            ))}
          </ul>
        </div>
      ) : null}

    </section>
  );
}
