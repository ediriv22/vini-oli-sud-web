"use client";

import { useEffect, useRef, useState } from "react";
import { CONSENT_OPEN_EVENT, readConsent, writeConsent, type ConsentValue } from "@/lib/consent";

const buttonClass =
  "font-ui inline-flex h-11 min-h-11 min-w-[7.5rem] flex-1 items-center justify-center rounded-full border border-[var(--color-ink-strong)] bg-[var(--color-ivory)] px-6 text-[0.86rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-ink-strong)] transition-colors duration-200 hover:bg-[rgba(255,215,87,0.35)] focus:outline-none focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[var(--color-ink-strong)] sm:flex-none";

export default function CookieBanner() {
  const [open, setOpen] = useState(false);
  const bannerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Alla prima visita (nessuna scelta salvata) il banner compare.
    const first = window.setTimeout(() => {
      if (!readConsent()) setOpen(true);
    }, 0);
    const reopen = () => setOpen(true);
    window.addEventListener(CONSENT_OPEN_EVENT, reopen);
    return () => {
      window.clearTimeout(first);
      window.removeEventListener(CONSENT_OPEN_EVENT, reopen);
    };
  }, []);

  // Finche' il banner e' visibile aggiunge in fondo alla pagina uno spazio pari
  // alla sua altezza, cosi' non copre il contenuto (footer compreso).
  useEffect(() => {
    const el = bannerRef.current;
    if (!open || !el) return;
    const apply = () => {
      document.body.style.paddingBottom = `${el.offsetHeight}px`;
    };
    apply();
    const observer = new ResizeObserver(apply);
    observer.observe(el);
    return () => {
      observer.disconnect();
      document.body.style.paddingBottom = "";
    };
  }, [open]);

  if (!open) return null;

  function choose(value: ConsentValue) {
    writeConsent(value);
    setOpen(false);
  }

  return (
    <div
      ref={bannerRef}
      role="dialog"
      aria-modal="false"
      aria-labelledby="cookie-banner-title"
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-[var(--color-line-strong)] bg-[var(--color-ivory)] shadow-[0_-10px_28px_rgba(20,32,25,0.14)]"
    >
      <div className="section-shell flex flex-col gap-2 py-2.5 sm:flex-row sm:items-center sm:gap-6 sm:py-4">
        <div className="text-[0.8rem] leading-[1.4] sm:text-[0.84rem] sm:leading-[1.55] text-[var(--color-ink)]">
          <p id="cookie-banner-title" className="sr-only">
            Cookie e consenso
          </p>
          <p className="sm:hidden">
            Usiamo cookie tecnici e, solo se accetti, cookie di marketing di TikTok per misurare i
            nostri annunci.{" "}
            <a href="/cookie-policy/" className="underline underline-offset-2">
              Cookie policy
            </a>
          </p>
          <p className="hidden sm:block">
            Usiamo cookie tecnici per far funzionare il sito e, solo con il tuo consenso, cookie di
            marketing di TikTok per misurare l&rsquo;efficacia dei nostri annunci. Puoi cambiare idea
            in qualsiasi momento dal link &ldquo;Preferenze cookie&rdquo; in fondo alla pagina.{" "}
            <a href="/cookie-policy/" className="underline underline-offset-2">
              Cookie policy
            </a>
          </p>
        </div>
        <div className="flex shrink-0 gap-3">
          <button type="button" className={buttonClass} onClick={() => choose("denied")}>
            Rifiuta
          </button>
          <button type="button" className={buttonClass} onClick={() => choose("granted")}>
            Accetta
          </button>
        </div>
      </div>
    </div>
  );
}
