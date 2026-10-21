import { TrackClick, TrackOnView } from "@/components/consent/TrackEvents";
import { siteConfig } from "@/data/site";

/**
 * Pagina "Diventa Giurato Popolare".
 *
 * 16/10/2026 (ordine di Edvige, con il link della biglietteria in mano): al
 * posto del modulo di prenotazione c'e' l'acquisto vero sulla biglietteria
 * ufficiale Metooo. Il sito non raccoglie piu' dati personali per il Pass e
 * non incassa pagamenti: scelta del Pass, scelta delle Sfide, limite di 60
 * posti per Sfida e incasso stanno tutti sulla biglietteria.
 *
 * Storia breve, per non rifare giri gia' fatti: 7/10 il Pass era gratis (primi
 * 50); 14/10 torna a pagamento con i link Azzurro Service/Vivaticket; 15/10
 * Edvige toglie la biglietteria esterna e lascia solo il modulo per la
 * segreteria; 16/10 arriva la biglietteria Metooo e il modulo esce.
 *
 * Il modulo lato server (/forms/lead.php, requestType=iscrizione-giurato) NON
 * e' stato toccato: resta in piedi, semplicemente non lo chiama piu' nessuno
 * da qui. Stessa cosa per pass-giurato-counts.php, che contava le iscrizioni
 * nel CSV: quei numeri non valgono piu' niente ora che le iscrizioni passano
 * dalla biglietteria, quindi la pagina non li legge e non mostra piu'
 * "Esaurito" per Sfida.
 */

const BIGLIETTERIA_URL = "https://napoli-racing-show.metooo.com/pages/il-gran-premio-del-gusto";

export default function PassGiuratoPage() {
  const biglietti = siteConfig.sfideAccordion.items.find((i) => i.kind === "biglietti");
  const tiers = biglietti?.tiers ?? [];
  const concorsi = siteConfig.sfideAccordion.items.find((i) => i.kind === "iscrivi")?.concorsi ?? [];

  return (
    <section className="section-flow section-space">
      <TrackOnView event="ViewContent" params={{ content_name: "Pass Giurato" }} />
      <div className="section-shell mx-auto max-w-[46rem] text-center">
        <p className="eyebrow text-center">Il Gran Premio del Gusto</p>
        <h1 className="display-balance mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]">
          Diventa Giurato Popolare
        </h1>
        {/* 15/10/2026 (Edvige: "ci sono troppe scritte", "il layout e' un casino"):
            ordine voluto da lei. Prima cosa fai, poi il riquadro giallo con i 60
            posti, poi i prezzi, poi la nota sul Pass personale. I prezzi sono usciti
            dal primo paragrafo, che ne conteneva troppa roba in una frase sola. */}
        <p className="mx-auto mt-4 max-w-[42ch] text-[1rem] leading-[1.65] text-[var(--color-muted)]">
          9 Gran Premi del Gusto, 9 Sfide da assaggiare e votare. Con il Pass Giurato degusti le
          eccellenze in gara, esprimi il tuo voto e contribuisci a decretare i vincitori.
        </p>

        <div className="mx-auto mt-8 max-w-[42rem] rounded-[0.9rem] border border-[rgba(255,215,87,0.5)] bg-[rgba(255,247,214,0.5)] px-5 py-5 text-center">
          <p className="font-ui text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]">
            Solo 60 posti per ogni Sfida
          </p>
          <p className="mt-3 font-display text-[1.25rem] text-[var(--color-ink-strong)]">
            Con il Pass il tuo posto in giuria è assicurato.
          </p>
          <p className="mt-3 text-[0.92rem] leading-[1.65] text-[var(--color-muted)]">
            Il Pass Giurato garantisce la partecipazione alle degustazioni e alle votazioni
            delle Sfide che hai scelto. I posti riservati a chi ha il Pass sono soltanto 60
            per ciascun Gran Premio del Gusto.
          </p>
          <p className="mt-3 text-[0.92rem] leading-[1.65] text-[var(--color-muted)]">
            Chi non ha il Pass può essere ammesso alla Giuria Popolare solo a discrezione
            dell&rsquo;Organizzazione, e soltanto se restano posti liberi.
          </p>
          <p className="mt-3 text-[0.92rem] leading-[1.65] text-[var(--color-ink-strong)]">
            Non lasciarlo al caso: scegli le tue Sfide e prendi il Pass.
          </p>
        </div>

        <p className="mx-auto mt-8 max-w-[42ch] font-display text-[1.15rem] leading-[1.5] text-[var(--color-ink-strong)]">
          €35 per una Sfida, €60 per tre Sfide, €80 per tutte e nove. Bicchiere e portabicchiere
          serigrafati compresi in tutti i Pass.
        </p>
        <p className="mx-auto mt-5 max-w-[46ch] text-[0.84rem] leading-[1.6] text-[var(--color-muted)]">
          Il Pass Giurato è strettamente personale e non cedibile: va conservato dal titolare per
          tutta la durata della manifestazione (27-28-29 novembre 2026). In caso di smarrimento non
          sarà possibile richiedere una sostituzione né l&rsquo;accesso alle Sfide.
        </p>
      </div>

      <div className="section-shell mx-auto mt-12 flex max-w-[42rem] flex-col gap-10">
        <div className="flex flex-col gap-5">
          <h2 className="text-center font-display text-[1.35rem] leading-tight text-[var(--color-ink-strong)]">
            Scegli il tuo Pass
          </h2>
          <div className="grid gap-4 sm:grid-cols-3">
            {tiers.map((tier) => (
              <div
                key={tier.name}
                className={`flex flex-col items-center gap-2 rounded-[1rem] border p-4 text-center ${
                  tier.featured
                    ? "border-[var(--color-wine)] bg-[rgba(47,91,70,0.08)]"
                    : "border-[rgba(47,91,70,0.25)] bg-[rgba(255,253,245,0.6)]"
                }`}
              >
                <span className="font-display text-[1rem] leading-tight text-[var(--color-ink-strong)]">
                  {tier.name}
                </span>
                <span className="font-display text-[1.5rem] leading-none text-[var(--color-ink-strong)]">
                  {tier.price}
                </span>
                {tier.priceDetail ? (
                  <span className="text-[0.76rem] leading-[1.45] text-[var(--color-muted)]">
                    {tier.priceDetail}
                  </span>
                ) : null}
              </div>
            ))}
          </div>

          <div className="flex flex-col items-center gap-3 text-center">
            <TrackClick
              event="InitiateCheckout"
              params={{ content_name: "Pass Giurato" }}
              appendUtm
            >
              <a
                href={BIGLIETTERIA_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="font-ui inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--color-sand)] px-10 text-[1rem] font-bold uppercase tracking-[0.06em] text-[var(--color-ink-strong)] shadow-[0_14px_32px_rgba(255,215,87,0.32)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-px hover:shadow-[0_18px_38px_rgba(255,215,87,0.4)]"
              >
                🎟️ Acquista il tuo Pass Giurato
              </a>
            </TrackClick>
            <p className="max-w-[44ch] text-[0.84rem] leading-[1.6] text-[var(--color-muted)]">
              L&rsquo;acquisto si completa sulla biglietteria ufficiale, dove scegli il Pass e le
              Sfide a cui vuoi partecipare. Ai prezzi si aggiungono le commissioni della
              biglietteria.
            </p>
          </div>
        </div>

        <div className="flex flex-col gap-5">
          <h2 className="text-center font-display text-[1.35rem] leading-tight text-[var(--color-ink-strong)]">
            Il calendario delle Sfide
          </h2>
          <p className="text-[0.88rem] leading-[1.6] text-[var(--color-muted)]">
            Le 9 Sfide del Gran Premio del Gusto si svolgono su 3 giornate. Scegli il Pass e le
            Sfide tenendo conto di quando puoi essere presente — ogni Sfida qui sotto mostra
            giorno e orario.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {(["Venerdì 27 Novembre", "Sabato 28 Novembre", "Domenica 29 Novembre"] as const).map(
              (giorno) => (
                <div
                  key={giorno}
                  className="rounded-[1rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.6)] p-4"
                >
                  <p className="font-ui text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-wine)]">
                    {giorno}
                  </p>
                  <ul className="mt-2.5 flex flex-col gap-1.5">
                    {concorsi
                      .filter((c) => c.giorno === giorno)
                      .map((c) => (
                        <li key={c.name} className="text-[0.82rem] leading-[1.4] text-[var(--color-muted)]">
                          <span aria-hidden="true">{c.icon}</span> {c.ora} — {c.name}
                        </li>
                      ))}
                  </ul>
                </div>
              ),
            )}
          </div>
          <p className="text-center text-[0.8rem] italic text-[var(--color-muted)]">
            Dettaglio di come si svolge ogni Sfida:{" "}
            <a href="/format/gran-premio-del-gusto/" className="underline">
              vai alla pagina Gran Premio del Gusto
            </a>
            .
          </p>
        </div>
      </div>

      {biglietti?.extraTitle ? (
        <div className="section-shell mx-auto mt-14 max-w-[42rem] rounded-[1.1rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.6)] p-6 text-center">
          <p className="font-display text-[1.1rem] text-[var(--color-ink-strong)]">
            {biglietti.extraTitle}
          </p>
          {biglietti.extraBody ? (
            <p className="mt-2 text-[0.9rem] leading-[1.6] text-[var(--color-muted)]">
              {biglietti.extraBody}
            </p>
          ) : null}
          {biglietti.extraCtaLabel ? (
            <div className="mt-4">
              <a
                href={biglietti.extraCtaHref || "mailto:napoliracingshow@gmail.com"}
                className="font-ui inline-flex h-11 items-center justify-center rounded-full border border-[rgba(255,215,87,0.6)] bg-[rgba(255,253,245,1)] px-6 text-[0.86rem] font-semibold text-[var(--color-ink-strong)] transition-colors duration-200 hover:bg-[rgba(255,247,214,1)]"
              >
                {biglietti.extraCtaLabel}
              </a>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
