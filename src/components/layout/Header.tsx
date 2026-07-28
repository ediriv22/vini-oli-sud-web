"use client";

import Link from "next/link";
import { useCallback, useEffect, useRef, useState } from "react";
import BrandLogo from "@/components/ui/BrandLogo";
import Button from "@/components/ui/Button";
import { headerPrimaryCta, mainNavigation } from "@/data/navigation";
import { cn } from "@/lib/cn";

/**
 * Header orizzontale stile demo cliente: barra verde scuro, wordmark a
 * sinistra, nav a destra, CTA pill oro "Contatti". Sito a singola pagina:
 * tutte le voci sono ancore interne (vedi src/data/navigation.ts).
 */
export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);

  const closeMenu = useCallback(() => setIsOpen(false), []);
  const toggleMenu = useCallback(() => setIsOpen((open) => !open), []);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        e.preventDefault();
        setIsOpen(false);
        queueMicrotask(() => menuButtonRef.current?.focus());
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [isOpen]);

  useEffect(() => {
    if (!isOpen) return;
    const onPointerDown = (e: PointerEvent) => {
      const root = headerRef.current;
      if (!root?.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("pointerdown", onPointerDown, true);
    return () => document.removeEventListener("pointerdown", onPointerDown, true);
  }, [isOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const onBp = () => {
      if (mq.matches) setIsOpen(false);
    };
    mq.addEventListener("change", onBp);
    return () => mq.removeEventListener("change", onBp);
  }, []);

  return (
    <header
      ref={headerRef}
      className="sticky top-0 z-50 bg-[var(--color-grove)]"
    >
      <div className="section-shell flex min-h-[var(--site-header-height)] items-center justify-between gap-4 py-2">
        <BrandLogo variant="horizontal" theme="light" priority />

        <nav
          aria-label="Navigazione principale"
          className="hidden items-center gap-7 lg:flex"
        >
          {mainNavigation.map((item) => (
            <a
              key={item.href}
              href={item.href}
              className="font-ui text-[0.78rem] font-semibold uppercase tracking-[0.1em] text-[rgba(255,253,245,0.9)] transition-colors duration-200 ease-out hover:text-[var(--color-sand)]"
            >
              {item.label}
            </a>
          ))}
        </nav>

        <div className="hidden lg:block">
          <Button href={headerPrimaryCta.href} size="sm" variant="primary">
            {headerPrimaryCta.label}
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls="site-mobile-nav"
          aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-transparent text-[var(--color-ivory)] transition-colors duration-200 ease-out hover:bg-[rgba(255,215,87,0.16)] lg:hidden"
          onClick={toggleMenu}
        >
          <span className="sr-only">Menu</span>
          <div className="flex w-[1.38rem] flex-col justify-center gap-[5px]">
            <span
              className={cn(
                "block h-0.5 w-full origin-center rounded-full bg-current transition duration-300 ease-out",
                isOpen && "translate-y-[7px] rotate-45",
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "block h-0.5 w-full rounded-full bg-current transition duration-200 ease-out",
                isOpen && "scale-x-0 opacity-0",
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "block h-0.5 w-full origin-center rounded-full bg-current transition duration-300 ease-out",
                isOpen && "-translate-y-[7px] -rotate-45",
              )}
              aria-hidden="true"
            />
          </div>
        </button>
      </div>

      <div
        className={cn(
          "relative grid overflow-hidden bg-[var(--color-grove)]",
          "transition-[grid-template-rows,opacity] duration-300 ease-out",
          isOpen ? "grid-rows-[1fr] opacity-100" : "pointer-events-none grid-rows-[0fr] opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden border-t border-[rgba(255,215,87,0.22)]">
          <nav
            id="site-mobile-nav"
            aria-label="Navigazione principale mobile"
            className="section-shell flex flex-col gap-1 py-4"
            {...(!isOpen ? { inert: true } : {})}
          >
            {mainNavigation.map((item) => (
              <a
                key={item.href}
                href={item.href}
                className="font-ui min-h-11 rounded-[0.4rem] px-3 py-3 text-[0.86rem] font-semibold uppercase tracking-[0.1em] text-[rgba(255,253,245,0.9)] transition-colors duration-200 ease-out hover:bg-[rgba(255,215,87,0.14)] hover:text-[var(--color-sand)]"
                onClick={closeMenu}
              >
                {item.label}
              </a>
            ))}
            <Link
              href={headerPrimaryCta.href}
              className="font-ui mt-3 inline-flex min-h-12 items-center justify-center rounded-full bg-[var(--color-sand)] px-6 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-ink-strong)] transition-colors duration-200 ease-out hover:bg-[var(--color-sand-strong)]"
              onClick={closeMenu}
            >
              {headerPrimaryCta.label}
            </Link>
          </nav>
        </div>
      </div>
    </header>
  );
}
