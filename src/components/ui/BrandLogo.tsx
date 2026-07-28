"use client";

import Image from "next/image";
import Link from "next/link";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/cn";

type BrandLogoVariant = "horizontal" | "wordmark" | "monogram" | "default";
type BrandLogoTheme = "default" | "light";

type BrandLogoProps = {
  href?: string;
  variant?: BrandLogoVariant;
  theme?: BrandLogoTheme;
  className?: string;
  imageClassName?: string;
  /** Hint LCP per il logo principale dell'header. */
  priority?: boolean;
};

const ASSETS = siteConfig.brand.assets;

const MONOGRAM_DIM = { width: 1000, height: 1000 };

export default function BrandLogo({
  href = "/",
  variant = "horizontal",
  theme = "default",
  className,
  imageClassName,
  priority,
}: BrandLogoProps) {
  const resolvedVariant: Exclude<BrandLogoVariant, "default"> =
    variant === "default" ? "horizontal" : variant;
  const alt = siteConfig.brand.wordmark;

  // Il nome pubblico del brand deve apparire ESATTAMENTE come "ViniSud"
  // (vincolo TikTok Developer review: app name = titolo sito = brand
  // visibile). Per questo il wordmark è testo HTML, non più l'SVG
  // orizzontale "VINI SUD · DAL MEDITERRANEO".
  const monogramSrc = theme === "light" ? ASSETS.vsMarkIvory : ASSETS.vsMark;

  const monogramSizeClasses =
    resolvedVariant === "monogram"
      ? "h-9 w-9 sm:h-10 sm:w-10"
      : "h-9 w-9 sm:h-10 sm:w-10 lg:h-11 lg:w-11";

  const monogram = (
    <Image
      src={monogramSrc}
      alt={alt}
      width={MONOGRAM_DIM.width}
      height={MONOGRAM_DIM.height}
      priority={priority}
      unoptimized
      className={cn(
        "select-none object-contain",
        monogramSizeClasses,
        imageClassName,
      )}
    />
  );

  const wordmarkText = (
    <span
      className={cn(
        "font-display leading-none tracking-[0.04em]",
        theme === "light"
          ? "text-[var(--color-ivory)]"
          : "text-[var(--color-ink-strong)]",
        resolvedVariant === "wordmark"
          ? "text-[1.3rem] sm:text-[1.5rem]"
          : "text-[1.45rem] sm:text-[1.65rem] lg:text-[1.85rem]",
      )}
    >
      {siteConfig.brand.wordmark}
    </span>
  );

  const block = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {monogram}
      {resolvedVariant !== "monogram" && wordmarkText}
    </span>
  );

  if (href) {
    return (
      <Link href={href} aria-label={siteConfig.brand.ariaLabel}>
        {block}
      </Link>
    );
  }
  return <span aria-label={siteConfig.brand.ariaLabel}>{block}</span>;
}
