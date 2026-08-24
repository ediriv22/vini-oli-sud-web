"use client";

import { useEffect } from "react";

/**
 * Ponte per l'editor visuale del pannello /admin. Inerte sul sito pubblico:
 * si attiva SOLO con `?editor=1` nell'URL (cioè dentro l'iframe dell'admin).
 *
 * Due modalità:
 * - `?editor=1`          → "click-to-focus": al click su un elemento annotato
 *   (`data-content-key`) invia la chiave all'admin, che apre il campo nel form.
 * - `?editor=1&build=1`  → "canva/builder": testo `field:*` editabile in place
 *   (contenteditable), ogni sezione (`sec:*`) con toolbar per spostarla
 *   (drag / ▲▼), mostrarla/nasconderla e aprirne le proprietà. Le modifiche
 *   sono inviate all'admin via postMessage; l'admin le raccoglie e pubblica.
 *
 * Non transita nulla di sensibile: solo chiavi e testi già pubblici.
 */
export default function VisualEditorBridge() {
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("editor") !== "1") return;
    const build = params.get("build") === "1";

    const post = (msg: Record<string, unknown>) =>
      window.parent.postMessage({ source: "vos-editor", ...msg }, "*");

    const style = document.createElement("style");
    style.textContent = `
      .vos-badge { position: fixed; z-index: 2147483647; left: 50%; bottom: 18px; transform: translateX(-50%);
        background: #1f2a24; color: #fff; font: 600 13px/1.4 -apple-system,Segoe UI,Roboto,Arial,sans-serif;
        padding: 9px 18px; border-radius: 999px; box-shadow: 0 8px 24px rgba(0,0,0,.32); pointer-events: none; }
      [data-content-key] { cursor: pointer; }
      [data-content-key]:not([contenteditable="true"]):hover { outline: 2px dashed #7a2634; outline-offset: 3px; background: rgba(122,38,52,0.06); }
      [contenteditable="true"] { cursor: text; outline: 1px dashed rgba(122,38,52,.5); outline-offset: 2px; border-radius: 3px; }
      [contenteditable="true"]:focus { outline: 2px solid #7a2634; background: rgba(255,247,214,.5); }
      [data-content-key^="sec:"] { position: relative; }
      .vos-sec-toolbar { position: absolute; top: 8px; right: 8px; z-index: 2147483000; display: flex; gap: 4px;
        background: rgba(31,42,36,.92); border-radius: 8px; padding: 4px; box-shadow: 0 6px 16px rgba(0,0,0,.3); }
      .vos-sec-toolbar button { all: unset; box-sizing: border-box; width: 26px; height: 26px; display: inline-flex;
        align-items: center; justify-content: center; color: #fff; font: 600 13px/1 sans-serif; border-radius: 6px; cursor: pointer; }
      .vos-sec-toolbar button:hover { background: rgba(255,255,255,.18); }
      .vos-sec-toolbar .vos-handle { cursor: grab; }
      .vos-hidden { opacity: .45; }
      .vos-hidden::after { content: "Sezione nascosta"; position: absolute; top: 8px; left: 8px; z-index: 2147483000;
        background: #7a2634; color: #fff; font: 600 11px/1 sans-serif; padding: 5px 9px; border-radius: 6px; }
      .vos-dragging { opacity: .5; }
    `;
    document.head.appendChild(style);

    const badge = document.createElement("div");
    badge.className = "vos-badge";
    badge.textContent = build
      ? "Canva — sposta le sezioni, clicca un testo per modificarlo"
      : "Modalità modifica — clicca un testo per aprirne l'editor";
    document.body.appendChild(badge);

    const cleanups: Array<() => void> = [];
    const on = (
      target: EventTarget,
      type: string,
      handler: EventListener,
      opts?: boolean | AddEventListenerOptions,
    ) => {
      target.addEventListener(type, handler, opts);
      cleanups.push(() => target.removeEventListener(type, handler, opts));
    };

    const sections = () =>
      Array.from(document.querySelectorAll<HTMLElement>('[data-content-key^="sec:"]'));
    const sectionKey = (el: HTMLElement) =>
      (el.getAttribute("data-content-key") || "").slice(4);
    const emitOrder = () =>
      post({
        type: "reorder",
        order: sections().map((el) => ({
          key: sectionKey(el),
          enabled: el.dataset.vosHidden !== "1",
        })),
      });

    if (!build) {
      // ---- Modalità click-to-focus (invariata) ----
      const onClick = (event: Event) => {
        const el = (event.target as HTMLElement | null)?.closest?.("[data-content-key]");
        if (!el) return;
        event.preventDefault();
        event.stopPropagation();
        const key = el.getAttribute("data-content-key");
        if (key) post({ key });
      };
      on(document, "click", onClick, true);
      post({ ready: true, build: false });
      return () => {
        cleanups.forEach((fn) => fn());
        style.remove();
        badge.remove();
      };
    }

    // ---- Modalità build (canva) ----

    // 1) Testo editabile in place: elementi field:* che sono foglie (senza
    //    altri elementi annotati dentro).
    const editableEls = Array.from(
      document.querySelectorAll<HTMLElement>('[data-content-key^="field:"]'),
    ).filter((el) => !el.querySelector("[data-content-key]"));
    for (const el of editableEls) {
      const path = (el.getAttribute("data-content-key") || "").slice(6);
      el.setAttribute("contenteditable", "true");
      el.setAttribute("spellcheck", "false");
      on(el, "input", () => post({ type: "edit", path, value: el.textContent ?? "" }));
      // Evita che link/pulsanti interni navighino mentre si edita.
      on(el, "click", (e) => e.preventDefault());
      on(el, "keydown", (e) => {
        // Invio = conferma (esce), niente <br> in campi mono-riga.
        const ke = e as KeyboardEvent;
        if (ke.key === "Enter" && !ke.shiftKey) {
          e.preventDefault();
          (el as HTMLElement).blur();
        }
      });
    }

    // 2) Blocca navigazione dei link durante il build (tranne dentro editable).
    on(
      document,
      "click",
      (e) => {
        const t = e.target as HTMLElement | null;
        if (t?.closest('[contenteditable="true"]')) return;
        if (t?.closest("a,button")) {
          e.preventDefault();
          e.stopPropagation();
        }
      },
      true,
    );

    // 3) Toolbar per sezione (sposta / mostra-nascondi / proprietà) + drag.
    let dragged: HTMLElement | null = null;
    const btn = (label: string, title: string, cls = "") => {
      const b = document.createElement("button");
      b.type = "button";
      b.textContent = label;
      b.title = title;
      if (cls) b.className = cls;
      return b;
    };

    const moveSection = (sec: HTMLElement, dir: "up" | "down") => {
      const list = sections();
      const i = list.indexOf(sec);
      const j = dir === "up" ? i - 1 : i + 1;
      if (j < 0 || j >= list.length) return;
      const parent = sec.parentNode;
      if (!parent) return;
      if (dir === "up") parent.insertBefore(sec, list[j]);
      else parent.insertBefore(sec, list[j].nextSibling);
      emitOrder();
    };

    for (const sec of sections()) {
      const key = sectionKey(sec);
      const bar = document.createElement("div");
      bar.className = "vos-sec-toolbar";
      bar.setAttribute("contenteditable", "false");

      const handle = btn("⠿", "Trascina per spostare", "vos-handle");
      handle.setAttribute("draggable", "true");
      on(handle, "dragstart", (e) => {
        dragged = sec;
        sec.classList.add("vos-dragging");
        (e as DragEvent).dataTransfer?.setData("text/plain", key);
      });
      on(handle, "dragend", () => {
        sec.classList.remove("vos-dragging");
        dragged = null;
        emitOrder();
      });

      const up = btn("▲", "Sposta su");
      on(up, "click", () => moveSection(sec, "up"));
      const down = btn("▼", "Sposta giù");
      on(down, "click", () => moveSection(sec, "down"));

      const eye = btn("🙈", "Mostra/Nascondi sezione");
      const syncEye = () => {
        const hidden = sec.dataset.vosHidden === "1";
        sec.classList.toggle("vos-hidden", hidden);
        eye.textContent = hidden ? "🙈" : "👁";
      };
      on(eye, "click", () => {
        sec.dataset.vosHidden = sec.dataset.vosHidden === "1" ? "0" : "1";
        syncEye();
        emitOrder();
      });
      syncEye();

      const props = btn("⚙", "Proprietà (immagini, colori)");
      on(props, "click", () => post({ type: "select", key }));

      bar.append(handle, up, down, eye, props);
      sec.appendChild(bar);
    }

    // Drag: sposta live la sezione trascinata sopra le altre.
    on(document, "dragover", (e) => {
      if (!dragged) return;
      e.preventDefault();
      const over = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-content-key^="sec:"]');
      if (!over || over === dragged) return;
      const rect = over.getBoundingClientRect();
      const after = (e as DragEvent).clientY > rect.top + rect.height / 2;
      const parent = over.parentNode;
      if (!parent) return;
      if (after) parent.insertBefore(dragged, over.nextSibling);
      else parent.insertBefore(dragged, over);
    });

    post({ ready: true, build: true });
    emitOrder();

    return () => {
      cleanups.forEach((fn) => fn());
      document.querySelectorAll(".vos-sec-toolbar").forEach((n) => n.remove());
      editableEls.forEach((el) => el.removeAttribute("contenteditable"));
      style.remove();
      badge.remove();
    };
  }, []);

  return null;
}
