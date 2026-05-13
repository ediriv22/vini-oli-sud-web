"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";
import BrandLogo from "@/components/ui/BrandLogo";
import Button from "@/components/ui/Button";
import { headerPrimaryCta, mainNavigation } from "@/data/navigation";

function isActive(pathname: string, href: string) {
  if (href === "/") {
    return pathname === "/";
  }

  return pathname === href || pathname.startsWith(`${href}/`);
}

export default function Header() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 border-b border-[rgba(18,52,35,0.1)] bg-[rgba(252,247,238,0.88)] backdrop-blur-xl">
      <div className="section-shell flex min-h-[4.15rem] items-center justify-between gap-4 py-2 sm:min-h-[4.45rem] sm:py-2.5 lg:min-h-[4.8rem] lg:gap-6 lg:py-3">
        <div className="flex min-w-0 items-center gap-5 lg:gap-7">
          <BrandLogo
            variant="horizontal"
            className="max-w-[10.5rem] sm:max-w-[13rem] lg:max-w-[15.5rem]"
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
                  className={`font-ui rounded-[0.9rem] px-3 py-2 text-[0.92rem] font-semibold ${
                    active
                      ? "bg-[rgba(95,107,51,0.06)] text-[var(--color-grove)]"
                      : "text-[var(--color-muted)] hover:bg-[rgba(95,107,51,0.04)] hover:text-[var(--color-grove)]"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="hidden items-center gap-3 xl:flex">
          <Button href={headerPrimaryCta.href} size="md">
            {headerPrimaryCta.label}
          </Button>
        </div>

        <button
          type="button"
          aria-expanded={isOpen}
          aria-label={isOpen ? "Chiudi menu" : "Apri menu"}
          className="inline-flex h-10 w-10 items-center justify-center rounded-[0.9rem] border border-[rgba(18,52,35,0.12)] bg-transparent text-[var(--color-grove)] hover:bg-white/55 sm:h-11 sm:w-11 xl:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1">
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
            <span className="block h-0.5 w-5 rounded-full bg-current" />
          </div>
        </button>
      </div>

      {isOpen ? (
        <div className="border-t border-[rgba(18,52,35,0.12)] bg-[rgba(255,251,245,0.98)] xl:hidden">
          <div className="section-shell flex flex-col gap-2 py-4">
            {mainNavigation.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`font-ui rounded-[0.95rem] px-4 py-3 text-sm font-semibold ${
                    active
                      ? "bg-[rgba(95,107,51,0.08)] text-[var(--color-grove)]"
                      : "bg-white/55 text-[var(--color-muted)]"
                  }`}
                  onClick={() => setIsOpen(false)}
                >
                  {item.label}
                </Link>
              );
            })}
            <Button
              href={headerPrimaryCta.href}
              className="mt-3 w-full"
              onClick={() => setIsOpen(false)}
            >
              {headerPrimaryCta.label}
            </Button>
          </div>
        </div>
      ) : null}
    </header>
  );
}
