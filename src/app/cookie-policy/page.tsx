import { createPageMetadata, siteConfig } from "@/data/site";

export const metadata = createPageMetadata(
  "Cookie policy",
  "Quali cookie usa vinisud.it, a cosa servono e come cambiare la tua scelta in qualsiasi momento.",
);

// Data di ultimo aggiornamento = giorno del deploy: va aggiornata se il testo cambia.
const LAST_UPDATE = "21 ottobre 2026";

export default function CookiePolicyPage() {
  const { organizer } = siteConfig;

  return (
    <section className="section-flow section-space">
      <div className="section-shell mx-auto max-w-[44rem]">
        <p className="eyebrow">Informativa</p>
        <h1 className="display-balance mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]">
          Cookie policy
        </h1>
        <p className="mt-3 text-[0.84rem] italic text-[var(--color-muted)]">
          Ultimo aggiornamento: {LAST_UPDATE}
        </p>

        <div className="mt-8 flex flex-col gap-8 text-[0.98rem] leading-[1.7] text-[var(--color-ink)]">
          <div>
            <h2 className="font-display text-[1.3rem] text-[var(--color-ink-strong)]">
              Chi è il titolare
            </h2>
            <p className="mt-2">
              Il titolare del trattamento è {organizer.legalName} (P.IVA {organizer.vatId}).
              Per qualsiasi richiesta scrivi a{" "}
              <a className="underline" href={`mailto:${organizer.email}`}>
                {organizer.email}
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-[1.3rem] text-[var(--color-ink-strong)]">
              Cookie tecnici
            </h2>
            <p className="mt-2">
              Salviamo nel tuo browser la scelta che fai sul banner (chiave{" "}
              <code>vos_consent_v1</code>), così non ti richiediamo il consenso a ogni visita. È
              sempre attivo e non richiede consenso.
            </p>
          </div>

          <div>
            <h2 className="font-display text-[1.3rem] text-[var(--color-ink-strong)]">
              Cookie di marketing: TikTok Pixel
            </h2>
            <p className="mt-2">
              Usiamo il TikTok Pixel (TikTok Technology Limited / TikTok Pte. Ltd.) per misurare
              quante persone arrivano dai nostri annunci alla pagina Pass Giurato e per ottimizzare
              gli annunci. Si attiva solo dopo il tuo consenso: se rifiuti, non viene inviato alcun
              dato a TikTok. Maggiori informazioni nell&rsquo;
              <a
                className="underline"
                href="https://www.tiktok.com/legal/page/eea/privacy-policy/it"
                target="_blank"
                rel="noopener noreferrer"
              >
                informativa privacy di TikTok
              </a>
              .
            </p>
          </div>

          <div>
            <h2 className="font-display text-[1.3rem] text-[var(--color-ink-strong)]">
              Come cambiare la tua scelta
            </h2>
            <p className="mt-2">
              Puoi cambiare idea in qualsiasi momento con il link &ldquo;Preferenze cookie&rdquo; in
              fondo a ogni pagina del sito.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
