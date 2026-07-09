import type { CSSProperties } from "react";

type SectionBackgroundInput = {
  backgroundColor?: string;
  backgroundImage?: string;
};

/**
 * Sfondo di sezione modificabile dal pannello /admin: se è stata caricata
 * un'immagine questa ha sempre priorità sul colore (comportamento "Canva":
 * un solo sfondo attivo per volta, mai sovrapposti).
 */
export function getSectionBackgroundStyle(
  section: SectionBackgroundInput,
): CSSProperties {
  if (section.backgroundImage) {
    return {
      backgroundImage: `url(${section.backgroundImage})`,
      backgroundSize: "cover",
      backgroundPosition: "center",
    };
  }
  if (section.backgroundColor) {
    return { backgroundColor: section.backgroundColor };
  }
  return {};
}
