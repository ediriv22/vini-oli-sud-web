import Image from "next/image";
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

      {/* La riga "In collaborazione con Assessorato all'Agricoltura" è già
          nell'Hero sopra (EventDetailsSection.collaboration): qui solo il
          logo e le info che non sono altrove (AIS, regolamento). */}
      <section className="section-flow section-space-sm">
        <div className="section-shell mx-auto max-w-[52rem] text-center">
          <div className="flex flex-wrap justify-center gap-6">
            <Image
              src="/brand/partners/regione-campania-v2.png"
              alt="Regione Campania — Assessorato all'Agricoltura"
              width={280}
              height={280}
              unoptimized
              className="h-[92px] w-[110px] rounded-[1rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.85)] object-contain p-3"
            />
            <Image
              src="/brand/partners/ais-associazione-italiana-sommelier.jpg"
              alt="AIS — Associazione Italiana Sommelier"
              width={280}
              height={158}
              unoptimized
              className="h-[92px] w-[110px] rounded-[1rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.85)] object-contain p-3"
            />
          </div>
          <p className="mt-5 text-[0.96rem] leading-[1.65] text-[var(--color-muted)]">
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
