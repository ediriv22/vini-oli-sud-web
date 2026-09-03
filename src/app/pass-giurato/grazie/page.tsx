import Link from "next/link";
import { createPageMetadata } from "@/data/site";

export const metadata = createPageMetadata(
  "Pagamento ricevuto",
  "Conferma di pagamento per il Pass Giuria Popolare del Gran Premio del Gusto 2026.",
);

/**
 * Pagina di ritorno dopo pagamento PayPal (URL di ritorno impostato sui 4
 * pulsanti PayPal del Pass Giurato, vedi /pass-giurato/). Puramente
 * cosmetica: conferma visiva per l'utente. La mail di conferma reale parte
 * solo dopo verifica webhook IPN (vedi public/forms/paypal-ipn.php), non da
 * questa pagina — un utente potrebbe atterrare qui e chiudere la scheda
 * prima che l'IPN arrivi, quindi il testo resta prudente ("riceverai a
 * breve") e non promette la mail come già inviata.
 */
export default function PassGiuratoGraziePage() {
  return (
    <section className="section-flow section-space">
      <div className="section-shell mx-auto max-w-[36rem] text-center">
        <p className="eyebrow text-center">Il Gran Premio del Gusto</p>
        <h1 className="display-balance mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]">
          Pagamento ricevuto
        </h1>
        <p className="mx-auto mt-4 max-w-[42ch] text-[0.94rem] leading-[1.6] text-[var(--color-muted)]">
          Grazie! Il tuo pagamento su PayPal è andato a buon fine. Riceverai a breve un&rsquo;email
          di conferma con il codice della tua iscrizione come Giurato Popolare.
        </p>
        <p className="mx-auto mt-3 max-w-[42ch] text-[0.88rem] leading-[1.6] text-[var(--color-muted)]">
          Se l&rsquo;email non arriva entro qualche ora, scrivi a{" "}
          <a href="mailto:napoliracingshow@gmail.com" className="underline">
            napoliracingshow@gmail.com
          </a>{" "}
          indicando nome, cognome e Pass acquistato.
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
