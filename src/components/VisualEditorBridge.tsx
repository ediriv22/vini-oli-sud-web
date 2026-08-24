"use client";

import { useEffect } from "react";

/**
 * Ponte per l'editor visuale del pannello /admin.
 *
 * Si attiva SOLO quando la home è aperta con `?editor=1` (cioè dentro
 * l'iframe di anteprima dell'admin in "modalità modifica"). Sul sito
 * pubblico normale non fa assolutamente nulla: nessun overlay, nessun
 * listener, JS inerte.
 *
 * Quando attivo: evidenzia gli elementi annotati con `data-content-key`
 * (vedi src/components/sections/*), e al click invia al frame genitore
 * (l'admin) un postMessage con la chiave del campo/sezione cliccato.
 * L'admin apre allora il campo corrispondente. Nessun contenuto sensibile
 * transita: solo la chiave (es. "field:philosophy.eyebrow" / "sec:sponsor").
 */
export default function VisualEditorBridge() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("editor") !== "1") return;

    const style = document.createElement("style");
    style.textContent = `
      [data-content-key] { cursor: pointer; transition: outline-color .12s ease, background-color .12s ease; }
      [data-content-key]:hover { outline: 2px dashed #7a2634; outline-offset: 3px; background: rgba(122,38,52,0.07); }
      .vos-editor-badge { position: fixed; z-index: 2147483647; left: 50%; bottom: 18px; transform: translateX(-50%);
        background: #1f2a24; color: #fff; font: 600 13px/1.4 -apple-system,Segoe UI,Roboto,Arial,sans-serif;
        padding: 9px 18px; border-radius: 999px; box-shadow: 0 8px 24px rgba(0,0,0,.32); pointer-events: none; }
    `;
    document.head.appendChild(style);

    const badge = document.createElement("div");
    badge.className = "vos-editor-badge";
    badge.textContent = "Modalità modifica — clicca un testo per aprirne l'editor";
    document.body.appendChild(badge);

    const onClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const el = target?.closest?.("[data-content-key]");
      if (!el) return;
      // In modalità editor i click aprono l'editor, non navigano/attivano.
      event.preventDefault();
      event.stopPropagation();
      const key = el.getAttribute("data-content-key");
      if (key) window.parent.postMessage({ source: "vos-editor", key }, "*");
    };
    // Fase di cattura: intercetta prima di link/bottoni.
    document.addEventListener("click", onClick, true);

    // Segnala all'admin che l'anteprima editabile è pronta.
    window.parent.postMessage({ source: "vos-editor", ready: true }, "*");

    return () => {
      document.removeEventListener("click", onClick, true);
      style.remove();
      badge.remove();
    };
  }, []);

  return null;
}
