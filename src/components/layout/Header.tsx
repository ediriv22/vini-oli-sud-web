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
  const headerRef = useRef<HTMLElement>(null);
  const menuButtonRef = useRef<HTMLButtonElement>(null);
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const finePointerRef = useRef(false);

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
      className="sticky top-0 z-50 border-b border-[rgba(18,52,35,0.1)] bg-[rgba(252,247,238,0.88)] backdrop-blur-xl"
    >
      <div className="section-shell flex min-h-[4rem] items-center justify-between gap-3 py-2 sm:min-h-[4.45rem] sm:py-2.5 lg:min-h-[4.8rem] lg:gap-6 lg:py-3">
        <div className="flex min-w-0 items-center gap-4 lg:gap-7">
          <BrandLogo
            variant="horizontal"
            className="max-w-[10.25rem] sm:max-w-[13rem] lg:max-w-[15.5rem]"
          />

          <nav
            className="hidden items-center gap-1.5 xl:flex"
            aria-label="Navigazione principale"
          >
            {mainNavigation.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-ui rounded-[0.9rem] border-b-2 px-3 py-2 text-[0.92rem] font-semibold transition-[color,border-color,background-color] duration-300 ease-out motion-reduce:duration-150",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(19,41,61,0.35)]",
                    active
                      ? "border-[rgba(200,167,111,0.72)] text-[var(--color-grove)]"
                      : "border-transparent text-[var(--color-muted)] hover:border-[rgba(200,167,111,0.38)] hover:text-[var(--color-grove)]",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-3 lg:flex">
          <Button
            href={headerPrimaryCta.href}
            size="md"
            className="px-5 text-[0.76rem] xl:px-6 xl:text-[0.82rem]"
          >
            {headerPrimaryCta.label}
          </Button>
        </div>

        <button
          ref={menuButtonRef}
          type="button"
          aria-expanded={isOpen}
          aria-controls="site-mobile-nav"
          aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
          className="inline-flex h-11 w-11 items-center justify-center rounded-[2px] border border-transparent bg-transparent p-0 text-[var(--color-grove)] transition-colors duration-200 ease-out hover:bg-white/35 motion-reduce:transition-none sm:h-11 sm:w-11 xl:hidden"
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

      <div
        className={cn(
          "grid overflow-hidden bg-[rgba(255,251,245,0.98)] xl:hidden",
          "transition-[grid-template-rows,opacity,border-color] duration-300 ease-out motion-reduce:transition-none",
          isOpen
            ? "grid-rows-[1fr] border-t border-[rgba(18,52,35,0.12)] opacity-100"
            : "pointer-events-none grid-rows-[0fr] border-t border-transparent opacity-0",
        )}
      >
        <div className="min-h-0 overflow-hidden">
          <nav
            id="site-mobile-nav"
            aria-label="Navigazione principale"
            className="section-shell flex flex-col gap-2 py-3.5"
            {...(!isOpen ? { inert: true } : {})}
          >
            {mainNavigation.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    "font-ui rounded-[2px] border-l-2 px-3.5 py-2.5 text-[0.84rem] font-semibold uppercase tracking-[0.08em] transition-[color,background-color,border-color] duration-300 ease-out motion-reduce:duration-150",
                    "focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(19,41,61,0.35)]",
                    active
                      ? "border-[rgba(200,167,111,0.75)] bg-white/75 text-[var(--color-grove)]"
                      : "border-transparent bg-white/55 text-[var(--color-muted)] hover:border-[rgba(200,167,111,0.42)] hover:bg-white/80 hover:text-[var(--color-grove)]",
                  )}
                  onClick={closeMenu}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button
              href={headerPrimaryCta.href}
              className="mt-2.5 self-start"
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
