import type { Metadata } from "next";
import { createPageMetadata, siteConfig } from "@/data/site";

export const metadata: Metadata = createPageMetadata(
  "Privacy",
  "Informativa sul trattamento dei dati personali per il sito Vini Oli Sud.",
);

const { contact, organizer } = siteConfig;

export default function PrivacyPage() {
  return (
    <section className="section-shell max-w-3xl py-16 sm:py-20">
      <div className="panel rounded-[2rem] p-6 sm:p-9">
        <p className="eyebrow">Informativa legale</p>
        <h1 className="mt-4 font-display text-[2.6rem] leading-[0.98] text-[var(--color-grove)] sm:text-[3.1rem]">
          Privacy policy
        </h1>
        <p className="mt-6 text-[1.02rem] leading-[1.68] text-[var(--color-muted)]">
          Questa informativa descrive in modo sintetico come possono essere trattati i dati personali
          inviati attraverso i recapiti pubblicati sul sito di Vini Oli Sud.
        </p>

        <div className="mt-10 space-y-10 text-[0.98rem] leading-[1.72] text-[var(--color-muted)]">
          <section>
            <h2 className="font-display text-[1.55rem] text-[var(--color-grove)]">1. Titolare</h2>
            <p className="mt-3">
              Il titolare del trattamento è{" "}
              <strong className="font-medium text-[var(--color-ink)]">{organizer.legalName}</strong>.
            </p>
            <p className="mt-3">
              Contatti:{" "}
              <a
                className="text-[var(--color-grove)] underline decoration-[rgba(200,167,111,0.45)] underline-offset-2 hover:decoration-[var(--color-wine)]"
                href={`mailto:${contact.projectEmail}`}
              >
                {contact.projectEmail}
              </a>
              ,{" "}
              <a
                className="text-[var(--color-grove)] underline decoration-[rgba(200,167,111,0.45)] underline-offset-2 hover:decoration-[var(--color-wine)]"
                href={`mailto:${organizer.email}`}
              >
                {organizer.email}
              </a>
              , PEC{" "}
              <a
                className="text-[var(--color-grove)] underline decoration-[rgba(200,167,111,0.45)] underline-offset-2 hover:decoration-[var(--color-wine)]"
                href={`mailto:${organizer.pec}`}
              >
                {organizer.pec}
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="font-display text-[1.55rem] text-[var(--color-grove)]">2. Finalità</h2>
            <p className="mt-3">
              I dati conferiti volontariamente tramite email o altri canali di contatto possono essere
              trattati per: rispondere alle richieste ricevute; gestire comunicazioni commerciali,
              richieste di accrediti, partnership e relazioni con stampa e media in ambito Vini Oli Sud;
              svolgere le attività organizzative connesse al progetto.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[1.55rem] text-[var(--color-grove)]">3. Dati trattati</h2>
            <p className="mt-3">
              In relazione alle richieste, possono essere trattati, ove forniti: nome e cognome,
              indirizzo email, numero di telefono, ragione sociale o ente di appartenenza, ruolo e
              contenuto del messaggio.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[1.55rem] text-[var(--color-grove)]">4. Base giuridica</h2>
            <p className="mt-3">
              Il trattamento si basa sulla richiesta dell’interessato, sulle misure precontrattuali
              ove applicabili e, per comunicazioni strettamente connesse alla gestione del progetto,
              sul legittimo interesse organizzativo, nel rispetto dei bilanciamenti previsti dalla
              normativa.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[1.55rem] text-[var(--color-grove)]">5. Conservazione</h2>
            <p className="mt-3">
              I dati sono conservati per il tempo necessario a gestire la richiesta e per adempiere
              agli obblighi di legge applicabili, salvo ulteriori specifiche fornite in sede di
              contatto.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[1.55rem] text-[var(--color-grove)]">6. Diritti</h2>
            <p className="mt-3">
              Gli interessati possono esercitare i diritti di accesso, rettifica, cancellazione,
              limitazione del trattamento e opposizione nei limiti previsti dal Regolamento (UE)
              2016/679.
            </p>
          </section>

          <section>
            <h2 className="font-display text-[1.55rem] text-[var(--color-grove)]">
              7. Esercizio dei diritti
            </h2>
            <p className="mt-3">
              Per esercitare i diritti o per richieste connesse alla privacy è possibile scrivere ai
              contatti indicati nella sezione «Titolare».
            </p>
          </section>

          <p className="rounded-[1.25rem] border border-[rgba(200,167,111,0.22)] bg-[rgba(255,251,245,0.65)] px-4 py-3 text-[0.92rem] leading-relaxed text-[var(--color-muted)]">
            Informativa aggiornata. Modifiche e integrazioni saranno comunicate prima dell’attivazione
            di nuovi servizi che comportino trattamenti dati ulteriori.
          </p>
        </div>
      </div>
    </section>
  );
}
