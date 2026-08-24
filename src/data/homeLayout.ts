// Ordine e visibilità delle sezioni della home, modificabili dalla segretaria
// via /admin (area "Ordine sezioni"). Il pannello aggiorna
// content/settings/home-layout.json e questo file lo legge in fase di build.
// Vedi public/admin/index.php e src/app/page.tsx.
import layout from "../../content/settings/home-layout.json";

// Ordine canonico di default: fonte di verità delle chiavi sezione valide.
// Deve restare allineato alla registry in src/app/page.tsx (che, essendo
// tipizzata come Record<SectionKey, ...>, dà errore di build se una chiave
// manca) e alle chiavi di content/settings/home-sections.json.
export const CANONICAL_SECTION_ORDER = [
  "hero",
  "sfideAccordion",
  "granPremioIntro",
  "philosophy",
  "grandPrixHighlight",
  "territory",
  "regions",
  "sponsor",
  "eventDetails",
  "institutionalPartners",
  "alboDoro",
] as const;

export type SectionKey = (typeof CANONICAL_SECTION_ORDER)[number];

export interface SectionLayoutEntry {
  key: SectionKey;
  enabled: boolean;
}

function isSectionKey(value: unknown): value is SectionKey {
  return (
    typeof value === "string" &&
    (CANONICAL_SECTION_ORDER as readonly string[]).includes(value)
  );
}

/**
 * Ordine effettivo delle sezioni da renderizzare.
 *
 * Fonde il JSON del pannello con l'ordine canonico in modo resiliente:
 * - mantiene l'ordine e il flag `enabled` del file per le chiavi note;
 * - scarta chiavi sconosciute o duplicate (non rompono il build);
 * - appende (attive) le eventuali chiavi canoniche assenti dal file, così
 *   una sezione nuova non ancora inserita nel layout compare comunque.
 */
export function resolveHomeLayout(): SectionLayoutEntry[] {
  const rawSections = Array.isArray(layout?.sections) ? layout.sections : [];
  const resolved: SectionLayoutEntry[] = [];
  const seen = new Set<SectionKey>();

  for (const entry of rawSections) {
    const key = (entry as { key?: unknown })?.key;
    if (!isSectionKey(key) || seen.has(key)) continue;
    seen.add(key);
    resolved.push({
      key,
      enabled: (entry as { enabled?: unknown })?.enabled !== false,
    });
  }

  for (const key of CANONICAL_SECTION_ORDER) {
    if (!seen.has(key)) resolved.push({ key, enabled: true });
  }

  return resolved;
}
