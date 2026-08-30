import EventDetailsSection from "@/components/sections/EventDetailsSection";
import RegionsSection from "@/components/sections/RegionsSection";
import TerritorySection from "@/components/sections/TerritorySection";
import { createPageMetadata } from "@/data/site";

export const metadata = createPageMetadata(
  "2ª Rassegna Vini e Oli della Magna Grecia",
  "Ingresso libero e gratuito a stand espositivi, convegni, aree istituzionali e Masterclass AIS. 27, 28 e 29 novembre 2026, Rotonda Diaz, Napoli.",
);

/**
 * Pagina dedicata "2ª Rassegna Vini e Oli della Magna Grecia" (Format).
 * Riusa EventDetailsSection (hero/date/luogo — condivisa con /programma/,
 * i dati sono gli stessi evento) più Territorio e Regioni, disattivate
 * dalla home per non duplicare i blocchi (vedi home-layout.json).
 */
export default function RassegnaPage() {
  return (
    <>
      <EventDetailsSection />

      <section className="section-flow section-space-sm">
        <div className="section-shell mx-auto max-w-[52rem] text-center">
          <p className="eyebrow">In collaborazione con</p>
          <p className="mt-4 font-display text-[1.3rem] leading-[1.3] text-[var(--color-ink-strong)]">
            Assessorato all&rsquo;Agricoltura della Regione Campania
          </p>
          <p className="mt-3 text-[0.96rem] leading-[1.65] text-[var(--color-muted)]">
            E con la collaborazione di AIS &ndash; Associazione Italiana Sommelier per le
            Masterclass.
          </p>
          <p className="mt-6 font-ui text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-wine)]">
            Il relativo Regolamento sarà pubblicato prossimamente.
          </p>
        </div>
      </section>

      <TerritorySection />
      <RegionsSection />
    </>
  );
}
