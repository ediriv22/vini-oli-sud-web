/**
 * Preset di font selezionabili dal pannello /admin (content/settings/site.json
 * → fontPreset). Ogni preset abbina un font titoli (display) e un font
 * interfaccia (eyebrow/UI); il font testo corpo resta Source Sans 3 per
 * mantenere leggibilità e coerenza tipografica in ogni combinazione.
 *
 * Le variabili CSS referenziate qui sono generate da next/font/google in
 * src/app/layout.tsx — tutti i font dei preset vengono sempre caricati,
 * poi solo quello selezionato viene collegato a --font-display-stack /
 * --font-ui-stack (vedi globals.css).
 */
export const FONT_PRESETS = {
  classico: {
    label: "Classico (Cormorant + Montserrat)",
    display: "var(--font-cormorant)",
    ui: "var(--font-montserrat)",
  },
  editoriale: {
    label: "Editoriale (Playfair Display + Lato)",
    display: "var(--font-playfair)",
    ui: "var(--font-lato)",
  },
  naturale: {
    label: "Naturale (Fraunces + Jost)",
    display: "var(--font-fraunces)",
    ui: "var(--font-jost)",
  },
  moderno: {
    label: "Moderno (EB Garamond + Inter)",
    display: "var(--font-eb-garamond)",
    ui: "var(--font-inter)",
  },
} as const;

export type FontPresetKey = keyof typeof FONT_PRESETS;

export function resolveFontPreset(key: string) {
  return FONT_PRESETS[key as FontPresetKey] ?? FONT_PRESETS.classico;
}
