"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState } from "react";
import BrandLogo from "@/components/ui/BrandLogo";
import Button from "@/components/ui/Button";
import { headerPrimaryCta, mainNavigation } from "@/data/navigation";
import { cn } from "@/lib/cn";

const MOUSE_LEAVE_CLOSE_MS = 220;
const XL_MIN_WIDTH = 1280;

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finePointerRef = useRef(false);

  // Solo la homepage ha sopra l'header una hero scroll-bound con immagine
  // scura: lì l'header parte trasparente e usa il logo chiaro finché il
  // visitatore non scrolla oltre la prima viewport.
  const isHome = pathname === "/";
  const overDarkHero = isHome && !scrolled;

  useEffect(() => {
    if (!isHome) return;
    const onScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, [isHome]);

  const clearCloseTimer = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current);
      closeTimerRef.current = null;
    }
  }, []);

  const scheduleClose = useCallback(() => {
    clearCloseTimer();
    if (!finePointerRef.current || !isOpen) {
      return;
    }
    closeTimerRef.current = setTimeout(() => {
      closeTimerRef.current = null;
      setIsOpen(false);
    }, MOUSE_LEAVE_CLOSE_MS);
  }, [clearCloseTimer, isOpen]);

  useEffect(() => {
    const mq = window.matchMedia("(hover: hover) and (pointer: fine)");
    const sync = () => {
      finePointerRef.current = mq.matches;
    };
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    const id = requestAnimationFrame(() => {
      setIsOpen(false);
    });
    return () => cancelAnimationFrame(id);
  }, [pathname]);

  useEffect(() => {
    if (!isOpen) {
      return;
    }
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
    if (!isOpen) {
      return;
    }
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
    const mq = window.matchMedia(`(min-width: ${XL_MIN_WIDTH}px)`);
    const onBp = () => {
      if (mq.matches) {
        setIsOpen(false);
      }
    };
    mq.addEventListener("change", onBp);
    return () => mq.removeEventListener("change", onBp);
  }, []);

  useEffect(() => () => clearCloseTimer(), [clearCloseTimer]);

  useEffect(() => {
    if (!isOpen) {
      clearCloseTimer();
    }
  }, [isOpen, clearCloseTimer]);

  const closeMenu = useCallback(() => {
    clearCloseTimer();
    setIsOpen(false);
  }, [clearCloseTimer]);

  const toggleMenu = useCallback(() => {
    clearCloseTimer();
    setIsOpen((open) => !open);
  }, [clearCloseTimer]);

  return (
    <header
      ref={headerRef}
      onMouseEnter={clearCloseTimer}
      onMouseLeave={scheduleClose}
      className={cn(
        /* Header: trasparente sopra hero scura, semi-trasparente avorio
         * altrove. Niente border-bottom, niente shadow colorata, niente
         * pseudo-elementi colorati. Il logo è l'unico segnale visivo
         * sotto cui non deve apparire nessuna linea/sottolineatura. */
        "sticky top-0 z-50 transition-[background-color,backdrop-filter] duration-500 ease-out motion-reduce:transition-none",
        overDarkHero
          ? "bg-transparent"
          : "bg-[rgba(244,237,224,0.72)] backdrop-blur-xl supports-[backdrop-filter]:bg-[rgba(244,237,224,0.6)]",
      )}
    >
      <div className="section-shell grid min-h-[var(--site-header-height)] grid-cols-[1fr_auto_1fr] items-center gap-3 py-2 sm:py-2.5 lg:gap-6 lg:py-3">
        {/* Colonna sinistra: spacer per mantenere il logo centrato. */}
        <div aria-hidden="true" />

        {/* Colonna centrale: logo orizzontale (wordmark editoriale).
            Su home in cima → variante mono-bianco per leggibilità sopra hero scura. */}
        <div className="flex justify-center">
          <BrandLogo
            variant="horizontal"
            theme={overDarkHero ? "light" : "default"}
            priority
          />
        </div>

        {/* Colonna destra: hamburger del menu. */}
        <div className="flex items-center justify-end">
          <button
            ref={menuButtonRef}
            type="button"
            aria-expanded={isOpen}
            aria-controls="site-mobile-nav"
            aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
            className={cn(
              "inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-transparent bg-transparent p-0 transition-colors duration-200 ease-out motion-reduce:transition-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(107,30,30,0.55)]",
              overDarkHero
                ? "text-[var(--color-ivory)] hover:bg-white/15"
                : "text-[var(--color-ink-strong)] hover:bg-[rgba(176,141,87,0.18)]",
            )}
            onClick={toggleMenu}
          >
          <span className="sr-only">Menu</span>
          <div className="flex w-[1.38rem] flex-col justify-center gap-[5px]">
            <span
              className={cn(
                "block h-0.5 w-full origin-center rounded-full bg-current transition duration-300 ease-out motion-reduce:transition-none",
                isOpen && "translate-y-[7px] rotate-45",
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "block h-0.5 w-full rounded-full bg-current transition duration-200 ease-out motion-reduce:transition-none",
                isOpen && "scale-x-0 opacity-0",
              )}
              aria-hidden="true"
            />
            <span
              className={cn(
                "block h-0.5 w-full origin-center rounded-full bg-current transition duration-300 ease-out motion-reduce:transition-none",
                isOpen && "-translate-y-[7px] -rotate-45",
              )}
              aria-hidden="true"
            />
          </div>
        </button>
        </div>
      </div>

      {/* Pannello menu mobile / desktop.
       * NIENTE border-t blu (era rgba(18,52,35,0.12) = "grove" blu profondo,
       * tipica "sottolineatura blu" sotto logo/nav).
       * Sostituito con un hairline oro tenue come unico segnale di confine
       * tra header e contenuto del menu. */}
      <div
        className={cn(
          "relative grid overflow-hidden bg-[rgba(252,247,238,0.98)] backdrop-blur-xl",
          "transition-[grid-template-rows,opacity] duration-300 ease-out motion-reduce:transition-none",
          isOpen
            ? "grid-rows-[1fr] opacity-100"
            : "pointer-events-none grid-rows-[0fr] opacity-0",
        )}
      >
        {isOpen ? (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute inset-x-[8%] top-0 h-px bg-gradient-to-r from-transparent via-[rgba(176,141,87,0.45)] to-transparent"
          />
        ) : null}
        <div className="min-h-0 overflow-hidden">
          <nav
            id="site-mobile-nav"
            aria-label="Navigazione principale"
            className="section-shell flex flex-col gap-1.5 py-4 sm:py-5"
            {...(!isOpen ? { inert: true } : {})}
          >
            {mainNavigation.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  aria-current={active ? "page" : undefined}
                  className={cn(
                    "font-ui rounded-[2px] border-l-2 px-4 py-3 text-[0.86rem] font-semibold uppercase tracking-[0.10em] transition-[color,background-color,border-color] duration-300 ease-out motion-reduce:duration-150 min-h-11",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(107,30,30,0.5)]",
                    active
                      ? "border-[rgba(176,141,87,0.7)] bg-white/70 text-[var(--color-ink-strong)]"
                      : "border-transparent bg-transparent text-[var(--color-muted)] hover:border-[rgba(176,141,87,0.4)] hover:bg-white/60 hover:text-[var(--color-ink-strong)]",
                  )}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button
              href={headerPrimaryCta.href}
              size="md"
              className="mt-4 self-start"
              onClick={closeMenu}
            >
              {headerPrimaryCta.label}
            </Button>
          </nav>
        </div>
      </div>
    </header>
  );
}
