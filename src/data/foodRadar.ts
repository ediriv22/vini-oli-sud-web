import generated from "./foodRadar.generated.json";

export type FoodRadarCategory =
  | "Oro Verde"
  | "Calici di Magna Grecia"
  | "Radar del Sud"
  | "Business con Anima"
  | "Territori";

export type FoodRadarItem = {
  id: string;
  category: FoodRadarCategory;
  title: string;
  source: string;
  date?: string;
  url: string;
  note: string;
  /**
   * Origine della nota editoriale.
   * - "auto"   → generata dallo script/bridge dal solo set categoria+area;
   * - "editor" → riscritta a mano da Vini Oli Sud;
   * - assente  → equivalente a "editor" (compatibilità con item legacy).
   *
   * Il bridge GitHub e il CSV importer NON sovrascrivono il campo `note`
   * di un item già presente per `id`: editare la nota a mano la rende
   * automaticamente persistente.
   */
  noteSource?: "auto" | "editor";
};

/**
 * Voci pubblicate nel Diario del Sud.
 *
 * NON modificare a mano: il file è generato da `scripts/import-food-radar.mjs`
 * leggendo un JSON validato del Food Radar Sud Italia.
 *
 * Per popolare/aggiornare:
 *   npm run radar:import -- docs/food-radar-latest.json
 */
export const foodRadarItems: FoodRadarItem[] = generated as FoodRadarItem[];
