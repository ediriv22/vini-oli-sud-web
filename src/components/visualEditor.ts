/**
 * Logica dell'editor visuale (usata da VisualEditorBridge). Estratta come
 * funzione pura su `Window` così da essere testabile in isolamento (jsdom),
 * senza React. Inerte se l'URL non contiene `?editor=1`.
 *
 * - `?editor=1`         → click-to-focus (l'admin apre il campo nel form).
 * - `?editor=1&build=1` → canva: testo `field:*` editabile in place, ogni
 *   sezione (`sec:*`) con toolbar (sposta/nascondi/proprietà), selezione al
 *   click. Le modifiche viaggiano verso l'admin via postMessage.
 */
export function initVisualEditor(win: Window): (() => void) | undefined {
  const doc = win.document;
  const params = new URLSearchParams(win.location.search);
  if (params.get("editor") !== "1") return undefined;
  const build = params.get("build") === "1";

  const post = (msg: Record<string, unknown>) =>
    win.parent.postMessage({ source: "vos-editor", ...msg }, "*");

  const style = doc.createElement("style");
  style.textContent = `
    .vos-badge { position: fixed; z-index: 2147483647; left: 50%; bottom: 18px; transform: translateX(-50%);
      background: #1f2a24; color: #fff; font: 600 13px/1.4 -apple-system,Segoe UI,Roboto,Arial,sans-serif;
      padding: 9px 18px; border-radius: 999px; box-shadow: 0 8px 24px rgba(0,0,0,.32); pointer-events: none; }
    [data-content-key] { cursor: pointer; }
    [data-content-key]:not([contenteditable="true"]):hover { outline: 2px dashed #7a2634; outline-offset: 3px; background: rgba(122,38,52,0.06); }
    [contenteditable="true"] { cursor: text; outline: 1px dashed rgba(122,38,52,.5); outline-offset: 2px; border-radius: 3px; transition: outline-color .1s, background-color .1s; }
    [contenteditable="true"]:hover { outline-color: #7a2634; background: rgba(255,247,214,.4); }
    [contenteditable="true"]:focus { outline: 2px solid #7a2634; background: rgba(255,247,214,.6); }
    [data-content-key^="sec:"] { position: relative; }
    [data-content-key^="sec:"].vos-selected { outline: 3px solid #b08d57; outline-offset: -3px; }
    .vos-sec-toolbar { position: absolute; top: 8px; right: 8px; z-index: 2147483000; display: flex; gap: 4px;
      background: rgba(31,42,36,.92); border-radius: 8px; padding: 4px; box-shadow: 0 6px 16px rgba(0,0,0,.3);
      opacity: .5; transition: opacity .12s ease; }
    [data-content-key^="sec:"]:hover .vos-sec-toolbar, [data-content-key^="sec:"].vos-selected .vos-sec-toolbar { opacity: 1; }
    .vos-sec-toolbar button { all: unset; box-sizing: border-box; height: 26px; min-width: 26px; padding: 0 6px; display: inline-flex;
      align-items: center; justify-content: center; gap: 4px; color: #fff; font: 600 12px/1 -apple-system,Segoe UI,sans-serif; border-radius: 6px; cursor: pointer; }
    .vos-sec-toolbar button:hover { background: rgba(255,255,255,.18); }
    .vos-sec-toolbar .vos-handle { cursor: grab; }
    .vos-hidden { opacity: .4; }
    .vos-hidden::after { content: "Sezione nascosta — clicca 👁 per mostrarla"; position: absolute; top: 8px; left: 8px; z-index: 2147483000;
      background: #7a2634; color: #fff; font: 600 11px/1 sans-serif; padding: 6px 10px; border-radius: 6px; }
    .vos-dragging { opacity: .5; }
  `;
  doc.head.appendChild(style);

  const badge = doc.createElement("div");
  badge.className = "vos-badge";
  badge.textContent = build
    ? "Canva — clicca un testo per modificarlo · trascina ⠿ per spostare"
    : "Modalità modifica — clicca un testo per aprirne l'editor";
  doc.body.appendChild(badge);

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
    Array.from(doc.querySelectorAll<HTMLElement>('[data-content-key^="sec:"]'));
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
    const onClick = (event: Event) => {
      const el = (event.target as HTMLElement | null)?.closest?.("[data-content-key]");
      if (!el) return;
      event.preventDefault();
      event.stopPropagation();
      const key = el.getAttribute("data-content-key");
      if (key) post({ key });
    };
    on(doc, "click", onClick, true);
    post({ ready: true, build: false });
    return () => {
      cleanups.forEach((fn) => fn());
      style.remove();
      badge.remove();
    };
  }

  // ---- Canva (build) ----

  // 1) Testo editabile in place (foglie field:*).
  const editableEls = Array.from(
    doc.querySelectorAll<HTMLElement>('[data-content-key^="field:"]'),
  ).filter((el) => !el.querySelector("[data-content-key]"));
  for (const el of editableEls) {
    const path = (el.getAttribute("data-content-key") || "").slice(6);
    el.setAttribute("contenteditable", "true");
    el.setAttribute("spellcheck", "false");
    el.setAttribute("title", "Clicca per modificare questo testo");
    on(el, "input", () => post({ type: "edit", path, value: el.textContent ?? "" }));
    on(el, "click", (e) => e.stopPropagation());
    on(el, "keydown", (e) => {
      const ke = e as KeyboardEvent;
      if (ke.key === "Enter" && !ke.shiftKey) {
        e.preventDefault();
        el.blur();
      }
    });
  }

  // 2) Blocca la navigazione dei link fuori dagli editabili.
  on(
    doc,
    "click",
    (e) => {
      const t = e.target as HTMLElement | null;
      if (t?.closest('[contenteditable="true"]')) return;
      if (t?.closest("a,button.vos-x-link")) {
        e.preventDefault();
      }
    },
    true,
  );

  // 3) Selezione della sezione al click (apre l'inspector nell'admin).
  let selected: HTMLElement | null = null;
  const select = (sec: HTMLElement | null) => {
    if (selected) selected.classList.remove("vos-selected");
    selected = sec;
    if (sec) {
      sec.classList.add("vos-selected");
      post({ type: "select", key: sectionKey(sec) });
    }
  };
  on(doc, "click", (e) => {
    const t = e.target as HTMLElement | null;
    if (!t) return;
    if (t.closest('[contenteditable="true"]') || t.closest(".vos-sec-toolbar")) return;
    const sec = t.closest<HTMLElement>('[data-content-key^="sec:"]');
    if (sec) select(sec);
  });

  // 4) Toolbar per sezione + drag.
  let dragged: HTMLElement | null = null;
  const mkBtn = (label: string, title: string, cls = "") => {
    const b = doc.createElement("button");
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
    const bar = doc.createElement("div");
    bar.className = "vos-sec-toolbar";
    bar.setAttribute("contenteditable", "false");

    const handle = mkBtn("⠿", "Trascina per spostare la sezione", "vos-handle");
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

    const up = mkBtn("▲", "Sposta su");
    on(up, "click", () => moveSection(sec, "up"));
    const down = mkBtn("▼", "Sposta giù");
    on(down, "click", () => moveSection(sec, "down"));

    const eye = mkBtn("👁", "Mostra o nascondi la sezione");
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

    const props = mkBtn("⚙", "Immagini e colori di questa sezione");
    on(props, "click", () => {
      select(sec);
      post({ type: "inspect", key });
    });

    bar.append(handle, up, down, eye, props);
    sec.appendChild(bar);
  }

  on(doc, "dragover", (e) => {
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
    doc.querySelectorAll(".vos-sec-toolbar").forEach((n) => n.remove());
    editableEls.forEach((el) => el.removeAttribute("contenteditable"));
    style.remove();
    badge.remove();
  };
}
