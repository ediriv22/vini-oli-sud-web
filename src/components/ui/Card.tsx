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
      <h3 className="mt-3 max-w-[20ch] font-display text-[1.35rem] leading-[1.12] tracking-[0.005em] text-[var(--card-title)] sm:text-[1.5rem]">
        {title}
      </h3>
      {description ? (
        <p className="mt-4 text-[0.96rem] leading-[1.65] text-[var(--card-body)]">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
      {href && ctaLabel ? (
        <span className="font-ui mt-6 inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-[var(--card-cta)]">
          {ctaLabel}
          <span
            className="inline-block transition-transform duration-300 ease-out motion-reduce:transition-none motion-safe:group-hover:translate-x-1"
            aria-hidden="true"
          >
            →
          </span>
        </span>
      ) : null}
    </div>
  );

  const classes = cn(
    "card-shell group rounded-[1.1rem] p-6 sm:p-7",
    "transition-[transform,box-shadow,border-color] duration-300 ease-out motion-reduce:duration-150 motion-reduce:transition-[border-color,box-shadow]",
    themeClasses[theme],
    href
      ? "block focus-visible:outline-2 focus-visible:outline-offset-[3px] focus-visible:outline-[#6b1e1e] motion-safe:hover:-translate-y-[2px] motion-reduce:hover:translate-y-0"
      : undefined,
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
