// Navigazione principale — architettura 2026: 5 voci di primo livello +
// CTA "Contatti" separata (vedi headerPrimaryCta). Sponsor resta un'ancora
// nella home (SponsorSection, id="sponsor"): da qualunque pagina si apra
// il menu, il link è root-relative ("/#sponsor") così la navigazione
// funziona anche fuori dalla home. Le altre voci aprono pagine dedicate
// sotto src/app/.
export const mainNavigation = [
  { label: "Programma", href: "/programma/" },
  { label: "Format", href: "/format/" },
  { label: "Regolamenti e Premi", href: "/regolamenti-e-premi/" },
  { label: "Vincitori 2025", href: "/vincitori-2025/" },
  { label: "Sponsor", href: "/#sponsor" },
];

export const headerPrimaryCta = {
  label: "Contatti",
  shortLabel: "Contatti",
  href: "#contatti",
};

export const footerNavigation = [
  { label: "Programma", href: "/programma/" },
  { label: "Format", href: "/format/" },
  { label: "Regolamenti e Premi", href: "/regolamenti-e-premi/" },
  { label: "Vincitori 2025", href: "/vincitori-2025/" },
  { label: "Sponsor", href: "/#sponsor" },
  { label: "Contatti", href: "#contatti" },
];
