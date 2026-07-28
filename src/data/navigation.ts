// Navigazione a singola pagina: tutte le voci sono ancore interne alla
// home (nessuna route separata). Vedi src/app/page.tsx per gli id di
// sezione corrispondenti.
export const mainNavigation = [
  { label: "Home", href: "#top" },
  { label: "Format e Programma", href: "#evento" },
  { label: "Regolamento e Premi", href: "#grand-prix" },
  { label: "Sponsor, Espositori e Spazi Disponibili", href: "#sponsor" },
];

export const headerPrimaryCta = {
  label: "Contatti",
  shortLabel: "Contatti",
  href: "#contatti",
};

export const footerNavigation = [
  { label: "Format e Programma", href: "#evento" },
  { label: "Regolamento e Premi", href: "#grand-prix" },
  { label: "Sponsor, Espositori e Spazi Disponibili", href: "#sponsor" },
  { label: "Contatti", href: "#contatti" },
];
