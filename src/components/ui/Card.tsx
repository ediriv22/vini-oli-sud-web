import Link from "next/link";
import type { ReactNode } from "react";
import { cn } from "@/lib/cn";

type CardProps = {
  eyebrow?: string;
  title: string;
  description?: string;
  children?: ReactNode;
  href?: string;
  ctaLabel?: string;
  className?: string;
};

export default function Card({
  eyebrow,
  title,
  description,
  children,
  href,
  ctaLabel,
  className,
}: CardProps) {
  const content = (
    <>
      {eyebrow ? <p className="eyebrow">{eyebrow}</p> : null}
      <h3 className="mt-3.5 max-w-[18ch] font-display text-[1.48rem] leading-[1] text-[var(--color-grove)] sm:text-[1.62rem]">
        {title}
      </h3>
      {description ? (
        <p className="mt-4 text-[0.95rem] leading-7 text-[var(--color-muted)]">
          {description}
        </p>
      ) : null}
      {children ? <div className="mt-5">{children}</div> : null}
      {href && ctaLabel ? (
        <span className="font-ui mt-6 inline-flex items-center gap-2 text-sm font-semibold text-[var(--color-wine)]">
          {ctaLabel}
          <span aria-hidden="true">→</span>
        </span>
      ) : null}
    </>
  );

  const classes = cn(
    "panel group rounded-[2rem] p-6 sm:p-7",
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
