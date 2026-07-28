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

const BADGE_DIM = { width: 867, height: 857 };

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
  // visibile). Per questo il wordmark resta testo HTML separato, anche
  // se il badge qui sotto contiene già una propria scritta incisa
  // nell'immagine ("VINI OLI SUD").
  //
  // Badge quadrato (fondo verde scuro, colonna dorica oro, scritta oro):
  // stesso identico file logo usato dalla demo cliente in header/footer
  // (granpremiodinapoli.it/img/logo.jpg). Ha già un bordo e uno sfondo
  // verde propri, per cui non serve una variante "light"/"dark" distinta.
  // Dimensioni in px fissi (non rem) per restare fedeli alla dimensione
  // reale del badge nella demo cliente (~75x75px misurati via
  // getBoundingClientRect su granpremiodinapoli.it/anteprima), invece di
  // scalare con i breakpoint tipografici del sito.
  const badgeSizeClasses =
    resolvedVariant === "monogram"
      ? "h-[44px] w-[44px] sm:h-[48px] sm:w-[48px]"
      : "h-[56px] w-[56px] sm:h-[64px] sm:w-[64px] lg:h-[72px] lg:w-[72px]";

  const monogram = (
    <Image
      src={ASSETS.logoBadge}
      alt={alt}
      width={BADGE_DIM.width}
      height={BADGE_DIM.height}
      priority={priority}
      unoptimized
      className={cn(
        "select-none rounded-[0.3rem] object-contain",
        badgeSizeClasses,
        imageClassName,
      )}
    />
  );

  const wordmarkText = (
    <span
      className={cn(
        "font-display leading-none tracking-[0.04em] whitespace-nowrap",
        theme === "light"
          ? "text-[var(--color-ivory)]"
          : "text-[var(--color-ink-strong)]",
        resolvedVariant === "wordmark"
          ? "text-[1rem] sm:text-[1.1rem]"
          : "text-[1rem] sm:text-[1.1rem] lg:text-[1.15rem]",
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
