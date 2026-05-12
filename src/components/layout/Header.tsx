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
    <header className="sticky top-0 z-50 border-b border-[rgba(18,52,35,0.12)] bg-[rgba(251,246,236,0.9)] backdrop-blur-xl">
      <div className="section-shell flex items-center justify-between gap-4 py-4 lg:gap-6 lg:py-5">
        <div className="flex min-w-0 items-center gap-4 lg:gap-7">
          <BrandLogo variant="header" />

          <nav
            className="hidden items-center gap-1 xl:flex"
            aria-label="Navigazione principale"
          >
            {mainNavigation.map((item) => {
              const active = isActive(pathname, item.href);

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`rounded-full px-4 py-2 text-sm font-medium ${
                    active
                      ? "bg-[rgba(95,107,51,0.08)] text-[var(--color-sea)]"
                      : "text-[var(--color-muted)] hover:bg-[rgba(95,107,51,0.06)] hover:text-[var(--color-sea)]"
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
          className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(18,52,35,0.12)] bg-white/82 text-[var(--color-sea)] xl:hidden"
          onClick={() => setIsOpen((current) => !current)}
        >
          <span className="sr-only">Menu</span>
          <div className="flex flex-col gap-1.5">
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
            <span className="block h-0.5 w-5 bg-current" />
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
                  className={`rounded-[1.35rem] px-4 py-3 text-sm font-semibold ${
                    active
                      ? "bg-[rgba(95,107,51,0.08)] text-[var(--color-sea)]"
                      : "bg-white/70 text-[var(--color-muted)]"
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
