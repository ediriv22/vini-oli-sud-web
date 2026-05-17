import { siteConfig } from "@/data/site";

/**
 * Striscia editoriale "Edizione 2026 · Napoli".
 *
 * Direzione (post-audit): la versione precedente era un "pannello"
 * con cornice 1.6rem e padding generoso → sembrava una scheda inserita.
 * Ora è un hairline editoriale senza box, con i contenuti distribuiti
 * orizzontalmente. Il sito perde un'altra "fascia colorata" e guadagna
 * continuità con l'avorio dominante.
 */
export default function EditionStrip() {
  const { edition } = siteConfig;

  /*
   * Padding-top alto: la hero scroll-bound precedente finisce con una
   * dissolvenza verso l'avorio; questo padding garantisce che la prima
   * informazione editoriale ("EDIZIONE 2026") non parta incollata al
   * bordo della scena ma respiri come l'apertura di un nuovo capitolo.
   * Non aggiungiamo l'hairline oro top: la dissolvenza della hero fa
   * già il lavoro di separazione, e l'hairline doppio era ridondante.
   */
  return (
    <section
      aria-label="Coordinate dell’edizione"
      className="section-flow relative pt-20 pb-12 sm:pt-24 sm:pb-14 lg:pt-28 lg:pb-16"
    >
      <div className="section-shell">
        <div className="grid gap-6 sm:gap-8 lg:grid-cols-[auto_1fr_auto] lg:items-baseline lg:gap-12">
          <div className="flex items-center gap-3">
            <span
              className="h-px w-8 bg-[rgba(176,141,87,0.65)]"
              aria-hidden="true"
            />
            <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-wine)]">
              {edition.label}
            </p>
          </div>

          <div className="flex flex-wrap items-baseline gap-x-6 gap-y-1.5 lg:justify-self-start">
            <p className="font-display text-[1.7rem] leading-none text-[var(--color-ink-strong)] sm:text-[2rem]">
              {edition.city}
            </p>
            <p className="font-ui text-[0.92rem] font-medium leading-relaxed text-[var(--color-muted)] sm:text-[1rem]">
              {edition.context}
            </p>
          </div>

          <p className="text-[0.94rem] leading-[1.6] text-[var(--color-muted)] lg:max-w-[30ch] lg:text-right">
            Un salone boutique dedicato a vino, olio, cultura mediterranea
            e relazioni commerciali.
          </p>
        </div>
      </div>
    </section>
  );
}
