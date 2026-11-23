/**
 * Prenotazione gratuita alle degustazioni (29/10/2026, "1_0 MODIFICHE SITO"):
 * le Sfide non ci sono piu'. Le aziende presentano il prodotto con degustazione, il pubblico
 * sceglie a quale partecipare, gratis per i primi 60 iscritti per ogni degustazione.
 *
 * 31/10/2026: niente piu' link esterno (Metooo). La prenotazione e' il modulo /prenota/,
 * che invia a napoliracingshow@gmail.com tramite /forms/lead.php (requestType=prenotazione-degustazione).
 */
export const PRENOTA_URL = "/prenota/";
export const PRENOTA_LABEL = "Prenota la tua degustazione";

export const DISCLAIMER_DEGUSTAZIONI =
  "Le degustazioni, i giorni e gli orari possono subire variazioni per esigenze organizzative.";

export type Degustazione = { ora: string; nome: string };
/** `slot` = degustazioni prenotabili (modulo /prenota/); `altri` = appuntamenti non prenotabili (solo programma). */
export type GiornoProgramma = { giorno: string; slot: Degustazione[]; altri?: Degustazione[] };

// Programma ufficiale ricevuto il 23/11/2026 (locandina "Programma ufficiale").
export const SCALETTA: GiornoProgramma[] = [
  {
    giorno: "Venerdì 27 novembre",
    altri: [{ ora: "12:00", nome: "Masterclass dei vini migliori della Magna Grecia (Regione Campania, in collaborazione con AIS)" }],
    slot: [
      { ora: "13:00", nome: "Caseificio Cioffi | Prodotti caseari di Campania Felix" },
      { ora: "14:00", nome: "Azienda Olivicola Ragozzino / De Marco" },
      { ora: "15:00", nome: "Amaro Basiliano dell’Azienda Delizie del Sole" },
      { ora: "16:00", nome: "Antica Forneria Molettieri" },
      { ora: "17:00", nome: "Caffè espresso e panettoni artigianali" },
    ],
  },
  {
    giorno: "Sabato 28 novembre",
    altri: [
      { ora: "10:30", nome: "“Il gusto della salute”: la ASL Napoli 1 Centro incontra la cittadinanza (Area congressi, ingresso da viale Dohrn)" },
      { ora: "10:00–17:00", nome: "Camper della Prevenzione ASL Napoli 1 Centro: vaccinazioni e screening oncologici" },
      { ora: "17:00", nome: "Masterclass dei vini migliori della Magna Grecia (Regione Campania, in collaborazione con AIS)" },
    ],
    slot: [
      { ora: "12:00", nome: "Caseificio Flori | Tradizione Casearia di Agerola, con filatura del fiordilatte" },
      { ora: "13:00", nome: "Birrificio Artigianale Napoletano N’Artigiana" },
      { ora: "14:00", nome: "Sua Maestà il Maialino — Baita del Re Resort" },
      { ora: "15:00", nome: "Pastificio Cuomo" },
    ],
  },
  {
    giorno: "Domenica 29 novembre",
    altri: [
      { ora: "10:00–14:00", nome: "Camper della Prevenzione ASL Napoli 1 Centro: vaccinazioni e screening oncologici" },
      { ora: "11:00", nome: "Masterclass dei vini migliori della Magna Grecia (Regione Campania, in collaborazione con AIS)" },
      { ora: "A seguire", nome: "Premiazioni e interviste" },
    ],
    slot: [
      { ora: "12:00", nome: "A’ Scarpetta: Pasta e Pomodoro Nolano" },
      { ora: "13:00", nome: "Sua Maestà La Pizza — Enzo Cocozza" },
      { ora: "14:00", nome: "Il divino baccalà — Baita del Re Resort" },
      { ora: "15:00", nome: "Spumante “Luca Paparelli”" },
    ],
  },
];

/** Degustazioni selezionabili per ogni prenotazione. */
export const MAX_DEGUSTAZIONI = 2;
