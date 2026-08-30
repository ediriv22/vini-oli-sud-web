import EventDetailsSection from "@/components/sections/EventDetailsSection";
import { createPageMetadata } from "@/data/site";

export const metadata = createPageMetadata(
  "Programma",
  "Il programma 2026 della Rassegna Vini e Oli della Magna Grecia: 27, 28 e 29 novembre a Rotonda Diaz, Lungomare Caracciolo, Napoli.",
);

/**
 * Pagina dedicata "Programma" — solo il programma aggiornato 2026 (date,
 * luogo, ingresso, download). Nessun contenuto Format qui: quello vive
 * sotto /format/. Riusa EventDetailsSection, rimossa dalla home per
 * evitare il doppione (vedi content/settings/home-layout.json).
 */
export default function ProgrammaPage() {
  return <EventDetailsSection />;
}
