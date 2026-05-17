export const mainNavigation = [
  { label: "L’Evento", href: "/evento" },
  { label: "Espositori", href: "/espositori" },
  { label: "Buyer", href: "/buyer" },
  { label: "Visitatori", href: "/visitatori" },
  { label: "Grand Prix", href: "/grand-prix" },
  { label: "Media", href: "/media" },
];

export const headerPrimaryCta = {
  label: "Richiedi la Brochure Espositori",
  shortLabel: "Brochure Espositori",
  href: "/contatti?interesse=espositori#richiesta-informazioni",
};

export const footerNavigation = [
  ...mainNavigation,
  { label: "Diario del Sud", href: "/diario-del-sud" },
  { label: "Contatti", href: "/contatti" },
];

export const footerActions = [
  { label: "Richiedi la Brochure Espositori", href: "/contatti?interesse=espositori#richiesta-informazioni" },
  { label: "Richiedi il Pass Buyer", href: "/contatti?interesse=buyer#richiesta-informazioni" },
  { label: "Richiedi informazioni media", href: "/contatti?interesse=media#richiesta-informazioni" },
];
