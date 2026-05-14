import type { Metadata } from "next";
import Link from "next/link";
import { createPageMetadata, siteConfig } from "@/data/site";

export const metadata: Metadata = createPageMetadata(
  "Cookie",
  "Informativa sui cookie per il sito Vini Oli Sud.",
);

const { contact, organizer } = siteConfig;

export default function CookiePage() {
  return (
    <section className="section-shell max-w-3xl py-16 sm:py-20">
      <div className="panel rounded-[2rem] p-6 sm:p-9">
        <p className="eyebrow">Informativa legale</p>
        <h1 className="mt-4 font-display text-[2.6rem] leading-[0.98] text-[var(--color-grove)] sm:text-[3.1rem]">
          Cookie policy
        </h1>
        <p className="mt-6 text-[1.02rem] leading-[1.68] text-[var(--color-muted)]">
          Questa pagina descrive l’uso dei cookie sul sito dedicato al progetto Vini Oli Sud, in forma
          chiara e non tecnica.
        </p>

        <div className="mt-10 space-y-8 text-[0.98rem] leading-[1.72] text-[var(--color-muted)]">
          <section>
            <h2 className="font-display text-[1.55rem] text-[var(--color-grove)]">Cookie tecnici</h2>
            <p className="mt-3">
              Il sito può utilizzare cookie tecnici necessari al funzionamento (ad esempio per
              preferenze di sessione o sicurezza). Questi strumenti non richiedono consenso ai sensi
              della normativa applicabile quando sono strettamente necessari alla prestazione del
              servizio richiesto.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[1.55rem] text-[var(--color-grove)]">
              Profilazione e marketing
            </h2>
            <p className="mt-3">
              Al momento non risultano configurati cookie di profilazione o marketing nel sito demo.
            </p>
            <p className="mt-3">
              Eventuali strumenti di analytics, pixel di social network o altri servizi di terze
              parti saranno indicati in questa informativa prima della loro attivazione, con le
              modalità di consenso previste dalla legge.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[1.55rem] text-[var(--color-grove)]">Contatti</h2>
            <p className="mt-3">
              Per richieste relative ai cookie è possibile scrivere a{" "}
              <Link
                href={`mailto:${contact.projectEmail}`}
                className="text-[var(--color-grove)] underline decoration-[rgba(200,167,111,0.45)] underline-offset-2 hover:decoration-[var(--color-wine)]"
              >
                {contact.projectEmail}
              </Link>{" "}
              o utilizzare la PEC{" "}
              <Link
                href={`mailto:${organizer.pec}`}
                className="text-[var(--color-grove)] underline decoration-[rgba(200,167,111,0.45)] underline-offset-2 hover:decoration-[var(--color-wine)]"
              >
                {organizer.pec}
              </Link>
              .
            </p>
          </section>

          <p className="rounded-[1.25rem] border border-[rgba(200,167,111,0.22)] bg-[rgba(255,251,245,0.65)] px-4 py-3 text-[0.92rem] leading-relaxed text-[var(--color-muted)]">
            Testo redatto per la fase demo pubblica; potrà essere integrato prima dell’introduzione
            di nuovi strumenti di misurazione o pubblicità.
          </p>
        </div>
      </div>
    </section>
  );
}
