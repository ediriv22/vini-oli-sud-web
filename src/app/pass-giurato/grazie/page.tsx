import Link from "next/link";
import { createPageMetadata } from "@/data/site";

export const metadata = createPageMetadata(
  "Prenotazione ricevuta",
  "Conferma di prenotazione per il Pass Giuria Popolare del Gran Premio del Gusto 2026.",
);

/**
 * 7/10/2026 (richiesta Edvige, regola cambiata): il Pass Giurato non è più
 * a pagamento, quindi questa pagina non è più un ritorno da PayPal — resta
 * solo come conferma visiva dopo l'invio del modulo di prenotazione in
 * /pass-giurato/. Testo ancora prudente ("riceverai a breve"): la mail di
 * conferma reale parte dalla Segreteria Organizzativa, non da questa pagina.
 */
export default function PassGiuratoGraziePage() {
  return (
    <section className="section-flow section-space">
      <div className="section-shell mx-auto max-w-[36rem] text-center">
        <p className="eyebrow text-center">Il Gran Premio del Gusto</p>
        <h1 className="display-balance mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]">
          Prenotazione ricevuta
        </h1>
        <p className="mx-auto mt-4 max-w-[42ch] text-[0.94rem] leading-[1.6] text-[var(--color-muted)]">
          Grazie! La tua prenotazione è stata inviata. Riceverai a breve un&rsquo;email di
          conferma con il codice della tua prenotazione come Giurato Popolare.
        </p>
        <p className="mx-auto mt-3 max-w-[42ch] text-[0.88rem] leading-[1.6] text-[var(--color-muted)]">
          Se l&rsquo;email non arriva entro qualche ora, scrivi a{" "}
          <a href="mailto:napoliracingshow@gmail.com" className="underline">
            napoliracingshow@gmail.com
          </a>{" "}
          indicando nome, cognome e Pass prenotato.
        </p>
        <div className="mt-8">
          <Link
            href="/pass-giurato/"
            className="font-ui inline-flex h-11 items-center justify-center rounded-full border border-[rgba(255,215,87,0.6)] bg-[rgba(255,253,245,1)] px-6 text-[0.86rem] font-semibold text-[var(--color-ink-strong)] transition-colors duration-200 hover:bg-[rgba(255,247,214,1)]"
          >
            Torna alla pagina Pass Giurato
          </Link>
        </div>
      </div>
    </section>
  );
}
