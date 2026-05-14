/**
 * Vincitori Grand Prix Magna Grecia 2025.
 * Fonte: NapoliVillage — articolo «Napoli, grande successo per la rassegna Vini e Oli della Magna Grecia».
 */

export type GrandPrixWinnerTheme = "grove" | "wine";

export type GrandPrixWinner = {
  year: number;
  award: string;
  product: string;
  producer: string;
  badgeSrc: string;
  badgeAlt: string;
  theme?: GrandPrixWinnerTheme;
};

export const grandPrixWinners2025: GrandPrixWinner[] = [
  {
    year: 2025,
    award: "Miglior Spumante",
    product: "Pietrafumante VSQ Millesimato Brut 2022",
    producer: "Casa Setaro",
    badgeSrc: "/grand-prix/badges/spumante.webp",
    badgeAlt: "Bollino ufficiale Grand Prix — Miglior Spumante",
    theme: "grove",
  },
  {
    year: 2025,
    award: "Miglior Vino Bianco",
    product: "Fiorduva Costa d’Amalfi DOC Furore Bianco 2023",
    producer: "Marisa Cuomo",
    badgeSrc: "/grand-prix/badges/bianco.webp",
    badgeAlt: "Bollino ufficiale Grand Prix — Miglior Vino Bianco",
    theme: "wine",
  },
  {
    year: 2025,
    award: "Miglior Vino Rosso",
    product: "Opera Mia Taurasi DOCG 2017",
    producer: "Tenuta Cavalier Pepe",
    badgeSrc: "/grand-prix/badges/rosso.webp",
    badgeAlt: "Bollino ufficiale Grand Prix — Miglior Vino Rosso",
    theme: "grove",
  },
  {
    year: 2025,
    award: "Miglior Vino Rosato",
    product: "Rosaspina Calabria IGP Greco Nero di Calabria 2024",
    producer: "Spadafora",
    badgeSrc: "/grand-prix/badges/rosato.webp",
    badgeAlt: "Bollino ufficiale Grand Prix — Miglior Vino Rosato",
    theme: "wine",
  },
  {
    year: 2025,
    award: "Miglior Passito",
    product: "Irpinia DOC Aglianico Passito 2019",
    producer: "La Molara",
    badgeSrc: "/grand-prix/badges/passito.webp",
    badgeAlt: "Bollino ufficiale Grand Prix — Miglior Passito",
    theme: "grove",
  },
  {
    year: 2025,
    award: "Miglior Vino Campania",
    product: "Fiano di Avellino DOCG Alessandra 2015",
    producer: "Di Meo",
    badgeSrc: "/grand-prix/badges/campania.webp",
    badgeAlt: "Bollino ufficiale Grand Prix — Miglior Vino Campania",
    theme: "wine",
  },
  {
    year: 2025,
    award: "Miglior Vino Puglia",
    product: "Salice Salentino DOC Negroamaro Riserva 2021",
    producer: "Leone De Castris",
    badgeSrc: "/grand-prix/badges/puglia.webp",
    badgeAlt: "Bollino ufficiale Grand Prix — Miglior Vino Puglia",
    theme: "grove",
  },
  {
    year: 2025,
    award: "Miglior Vino Basilicata",
    product: "Carato Venusio Aglianico del Vulture DOCG Superiore 2017",
    producer: "Cantina di Venosa",
    badgeSrc: "/grand-prix/badges/basilicata.webp",
    badgeAlt: "Bollino ufficiale Grand Prix — Miglior Vino Basilicata",
    theme: "wine",
  },
  {
    year: 2025,
    award: "Miglior Vino Calabria",
    product: "Calabria IGT Bianco Pecorello 2024",
    producer: "Caparra & Siciliani",
    badgeSrc: "/grand-prix/badges/calabria.webp",
    badgeAlt: "Bollino ufficiale Grand Prix — Miglior Vino Calabria",
    theme: "grove",
  },
  {
    year: 2025,
    award: "Miglior Vino Sicilia",
    product: "De Rerum Aetna Etna DOC Rosso Riserva 2019",
    producer: "Oro d’Etna",
    badgeSrc: "/grand-prix/badges/sicilia.webp",
    badgeAlt: "Bollino ufficiale Grand Prix — Miglior Vino Sicilia",
    theme: "wine",
  },
];
