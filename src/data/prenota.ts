/**
 * Prenotazione gratuita alle degustazioni (29/10/2026, "1_0 MODIFICHE SITO"):
 * le Sfide non ci sono piu'. Le aziende presentano il prodotto con degustazione, il pubblico
 * sceglie a quale partecipare, gratis per i primi 60 iscritti.
 *
 * 31/10/2026: niente piu' link esterno (Metooo). La prenotazione e' il modulo /prenota/,
 * che invia a napoliracingshow@gmail.com tramite /forms/lead.php (requestType=prenotazione-degustazione).
 */
export const PRENOTA_URL = "/prenota/";
export const PRENOTA_LABEL = "Prenota la tua degustazione";

export type Degustazione = { ora: string; nome: string };
export type GiornoProgramma = { giorno: string; slot: Degustazione[] };

// Orari ancora vuoti nel documento (sabato 15:00, domenica 14:00 e 15:00 senza azienda): non inventati.
export const SCALETTA: GiornoProgramma[] = [
  {
    giorno: "Venerdì 27 novembre",
    slot: [
      { ora: "13:00", nome: "Pasta “Cuomo”" },
      { ora: "14:00", nome: "Azienda Olivicola Ragozzino / De Marco" },
      { ora: "15:00", nome: "Birrificio Artigianale Agricolo Serrocroce" },
      { ora: "16:00", nome: "Antica forneria Molettieri" },
      { ora: "17:00", nome: "Caffè “Espresso Italiano”" },
    ],
  },
  {
    giorno: "Sabato 28 novembre",
    slot: [
      { ora: "12:00", nome: "Caseificio Ruocco | Tradizione Casearia di Agerola" },
      { ora: "13:00", nome: "Birrificio Artigianale Napoletano N’Artigiana" },
      { ora: "14:00", nome: "Liquori e Torroni di Benevento" },
    ],
  },
  {
    giorno: "Domenica 29 novembre",
    slot: [
      { ora: "12:00", nome: "Pasta e Pomodoro Nolano" },
      { ora: "13:00", nome: "Sua Maestà La Pizza — Enzo Cocozza" },
    ],
  },
];
