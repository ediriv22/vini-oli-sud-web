import { createPageMetadata, siteConfig } from "@/data/site";

export const metadata = createPageMetadata(
  "Selezione prodotti",
  "I prodotti in gara al Gran Premio del Gusto 2026 sono selezionati tramite bando della Regione Campania.",
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
 * Nome del bando, link ufficiale e scadenze: Edvige li manda appena
 * escono (confermato 7/10/2026). Segnaposto sotto ([BANDO_LINK],
 * [BANDO_SCADENZA]) pronti per un find&replace — non riempiti con dati
 * inventati, non vanno pubblicati così com'è.
 */
export default function SelezioneProdottoPage() {
  const concorsi = siteConfig.sfideAccordion.items.find((i) => i.kind === "iscrivi")?.concorsi ?? [];

  return (
    <section className="section-flow section-space">
      <div className="section-shell mx-auto max-w-[46rem] text-center">
        <p className="eyebrow text-center">Gran Premio del Gusto 2026</p>
        <h1 className="display-balance mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]">
          Selezione dei prodotti in gara
        </h1>
        <p className="mt-3 font-display text-[1.1rem] text-[var(--color-wine)]">
          Le Sfide della Magna Grecia
        </p>
        <p className="mt-2 text-[0.94rem] leading-[1.6] text-[var(--color-muted)]">
          27 · 28 · 29 novembre 2026 · Rotonda Diaz – Lungomare Caracciolo – Napoli
        </p>
        <p className="mx-auto mt-6 max-w-[42ch] text-[0.96rem] leading-[1.65] text-[var(--color-muted)]">
          I prodotti ammessi ai 9 Concorsi del Gran Premio del Gusto 2026 sono selezionati
          tramite bando della Regione Campania: non è più possibile candidare un prodotto
          direttamente tramite questo sito.
        </p>
        <p className="mx-auto mt-3 max-w-[42ch] text-[0.86rem] leading-[1.6] text-[var(--color-muted)]">
          Modalità di partecipazione al bando, scadenze e documentazione richiesta saranno
          comunicate dalla Regione Campania.
        </p>
        {/* TODO(bando): quando escono nome, link e scadenza del bando Regione Campania, aggiungere qui un paragrafo con link e data. Nessun segnaposto visibile in pagina. */}
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

      <div className="section-shell mx-auto mt-14 max-w-[42rem] border-t border-[rgba(255,215,87,0.3)] pt-8 text-center">
        <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]">
          Hai bisogno di informazioni?
        </p>
        <p className="mt-3 text-[0.92rem] leading-[1.6] text-[var(--color-muted)]">
          Segreteria Organizzativa – Gran Premio del Gusto 2026 · Napoli Racing Show
          <br />
          E-mail:{" "}
          <a href="mailto:napoliracingshow@gmail.com" className="font-semibold text-[var(--color-wine)]">
            napoliracingshow@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
