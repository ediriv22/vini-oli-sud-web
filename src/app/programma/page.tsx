import EventDetailsSection from "@/components/sections/EventDetailsSection";
import ProgrammaHubSection from "@/components/sections/ProgrammaHubSection";
import { createPageMetadata } from "@/data/site";

export const metadata = createPageMetadata(
  "Programma",
  "Il programma 2026: Masterclass, le 9 Sfide del Gran Premio del Gusto con giorni e orari, Pass Giurato e bando. 27, 28 e 29 novembre a Rotonda Diaz, Lungomare Caracciolo, Napoli.",
);

/**
 * Pagina "Programma". Dal 15/10/2026 (richiesta Edvige) e' il punto da cui si
 * raggiunge tutto: oltre a date, luogo e ingresso, porta le Masterclass con il
 * logo della Regione Campania, il programma delle 9 Sfide con giorno e ora, e i
 * collegamenti alle altre sezioni (Giurato, bando, regolamenti, format,
 * vincitori, sponsor). Vedi ProgrammaHubSection.
 */
export default function ProgrammaPage() {
  return (
    <>
      <EventDetailsSection />
      <ProgrammaHubSection />
    </>
  );
}
