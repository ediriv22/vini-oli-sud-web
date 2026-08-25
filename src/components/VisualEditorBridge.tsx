"use client";

import { useEffect } from "react";
import { initVisualEditor } from "./visualEditor";

/**
 * Ponte per l'editor visuale del pannello /admin. Inerte sul sito pubblico:
 * la logica (in ./visualEditor) si attiva SOLO con `?editor=1` nell'URL.
 * Vedi initVisualEditor per le due modalità (click-to-focus e canva/build).
 */
export default function VisualEditorBridge() {
  useEffect(() => initVisualEditor(window), []);
  return null;
}
