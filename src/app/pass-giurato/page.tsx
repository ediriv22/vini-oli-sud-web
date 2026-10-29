import { PRENOTA_LABEL, PRENOTA_URL, SCALETTA } from "@/data/prenota";
import { createPageMetadata } from "@/data/site";

export const metadata = createPageMetadata(
  PRENOTA_LABEL,
  "Degustazioni gratuite per i primi 60 iscritti al Villaggio Vini e Oli della Magna Grecia, 27-28-29 novembre 2026, Rotonda Diaz, Napoli.",
);

/**
 * 29/10/2026: il Pass Giurato non esiste piu' (niente Sfide, voto, acquisto). L'URL resta vivo
 * perche' linkato da post gia' pubblicati: spiega le degustazioni e rimanda al link di prenotazione.
 */
export default function PrenotaDegustazionePage() {
  return (
    <section className="section-flow section-space">
      <div className="section-shell mx-auto max-w-[46rem] text-center">
        <p className="eyebrow text-center">Villaggio Vini e Oli della Magna Grecia</p>
        <h1 className="display-balance mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]">
          {PRENOTA_LABEL}
        </h1>
        <p className="mx-auto mt-4 max-w-[42ch] text-[1rem] leading-[1.65] text-[var(--color-muted)]">
          Le aziende dell&rsquo;eccellenza enogastronomica della nostra terra presentano i loro
          prodotti. Scegli a quale degustazione partecipare: la partecipazione è{" "}
          <strong>gratuita per i primi 60 iscritti</strong>.
        </p>
        <div className="mt-8">
          <a
            href={PRENOTA_URL}
            className="font-ui inline-flex h-14 items-center justify-center rounded-full bg-[var(--color-sand)] px-10 text-[1rem] font-bold uppercase tracking-[0.06em] text-[var(--color-ink-strong)] shadow-[0_14px_32px_rgba(255,215,87,0.32)]"
          >
            {PRENOTA_LABEL}
          </a>
        </div>
        <div className="mt-12 flex flex-col gap-8 text-left">
          {SCALETTA.map(({ giorno, slot }) => (
            <div key={giorno}>
              <p className="font-ui text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]">
                {giorno}
              </p>
              <ul className="mt-3 flex flex-col gap-2">
                {slot.map((s) => (
                  <li
                    key={s.ora + s.nome}
                    className="flex flex-wrap items-baseline gap-x-4 rounded-[0.9rem] border border-[rgba(47,91,70,0.18)] bg-[rgba(255,253,245,0.6)] px-4 py-3"
                  >
                    <span className="font-ui text-[0.9rem] font-semibold text-[var(--color-wine)]">{s.ora}</span>
                    <span className="text-[0.98rem] text-[var(--color-ink-strong)]">{s.nome}</span>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
