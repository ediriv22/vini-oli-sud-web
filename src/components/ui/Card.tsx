import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

export type CardTheme =
  | "parchment"
  | "linen"
  | "wine"
  | "olive"
  | "sea"
  | "press";

type CardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  href?: string;
  ctaLabel?: string;
  theme?: CardTheme;
  className?: string;
};

export default function Card({
  eyebrow,
  title,
  description,
  children,
  href,
  ctaLabel,
  theme = "parchment",
  className,
}: CardProps) {
  const themeClasses: Record<CardTheme, string> = {
    parchment: "card-theme-parchment texture-parchment",
    linen: "card-theme-linen texture-linen",
    wine: "card-theme-wine",
    olive: "card-theme-olive",
    sea: "card-theme-sea",
    press: "card-theme-press texture-parchment",
  };

  const content = (
    <div className="relative z-10">
      {eyebrow ? (
        <p className="eyebrow text-[var(--card-eyebrow)]">{eyebrow}</p>
      ) : null}
      <h3 className="mt-3.5 max-w-[18ch] font-display text-[1.48rem] leading-[1] text-[var(--card-title)] sm:text-[1.62rem]">
        {title}
      </h3>
      {description ? (
        <p className="mt-4 text-[0.95rem] leading-7 text-[var(--card-body)]">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
      {href && ctaLabel ? (
        <span className="font-ui mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--card-cta)]">
          {ctaLabel}
          <span aria-hidden="true">→</span>
        </span>
      ) : null}
    </div>
  );

  const classes = cn(
    "card-shell group rounded-[2rem] p-6 sm:p-7",
    themeClasses[theme],
    href ? "block hover:-translate-y-1" : undefined,
    className,
  );

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    );
  }

  return <article className={classes}>{content}</article>;
}
