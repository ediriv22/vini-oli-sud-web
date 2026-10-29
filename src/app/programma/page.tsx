import EventDetailsSection from "@/components/sections/EventDetailsSection";
import ProgrammaHubSection from "@/components/sections/ProgrammaHubSection";
import { createPageMetadata } from "@/data/site";

export const metadata = createPageMetadata(
  "Programma",
  "Il programma 2026: Masterclass e degustazioni delle aziende enogastronomiche, gratuite su prenotazione. 27, 28 e 29 novembre a Rotonda Diaz, Lungomare Caracciolo, Napoli.",
);

/**
 * Pagina "Programma". Dal 29/10/2026 niente Sfide: scaletta delle degustazioni con prenotazione
 * gratuita. Vedi ProgrammaHubSection e src/data/prenota.ts.
 */
export default function ProgrammaPage() {
  return (
    <>
      <EventDetailsSection />
      <ProgrammaHubSection />
    </>
  );
}
