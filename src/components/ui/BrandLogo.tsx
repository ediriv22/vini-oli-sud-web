"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
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

// viewBox naturali dei nuovi SVG (brand kit v1.0)
const DIM = {
  horizontal: { width: 1600, height: 400 }, // logo orizzontale completo
  wordmark: { width: 1600, height: 280 }, // wordmark only (rapporto stimato)
  monogram: { width: 1000, height: 1000 },
};

function resolveSrc(
  variant: Exclude<BrandLogoVariant, "default">,
  theme: BrandLogoTheme,
): string {
  if (variant === "monogram") {
    return theme === "light" ? ASSETS.monogrammaVSIvory : ASSETS.monogrammaVS;
  }
  if (variant === "wordmark") {
    return ASSETS.logoWordmark;
  }
  // horizontal: su fondo chiaro uso la versione trasparente (inchiostro
  // mediterraneo); su fondo scuro uso la versione mono-bianco (bianco
  // trasparente, massimo contrasto sul gradient scuro del footer senza
  // portare con sé un proprio fondo rettangolare).
  return theme === "light"
    ? ASSETS.logoHorizontalMonoWhite
    : ASSETS.logoHorizontal;
}

export default function BrandLogo({
  href = "/",
  variant = "horizontal",
  theme = "default",
  className,
  imageClassName,
  priority,
}: BrandLogoProps) {
  const [failed, setFailed] = useState(false);
  const resolvedVariant: Exclude<BrandLogoVariant, "default"> =
    variant === "default" ? "horizontal" : variant;
  const dims = DIM[resolvedVariant];
  const src = resolveSrc(resolvedVariant, theme);
  const alt = "Vini Sud — Dal Mediterraneo";

  /* Dimensioni logo:
   * il logo è il centro dell'header. Lo manteniamo importante ma non
   * sovrastante: l'header v.precedente arrivava a 7rem di altezza con
   * un logo h-20 (80px) che lo faceva sembrare pesante. Ora 56→64→72
   * px in funzione del breakpoint, in accordo con --site-header-height. */
  const sizeClasses =
    resolvedVariant === "monogram"
      ? "h-9 w-9 sm:h-10 sm:w-10"
      : resolvedVariant === "wordmark"
        ? "h-8 max-h-8 w-auto sm:h-10 sm:max-h-10"
        : // horizontal: wordmark editoriale, dimensione misurata.
          "h-12 max-h-12 w-auto sm:h-14 sm:max-h-14 lg:h-[4.25rem] lg:max-h-[4.25rem]";

  /* Fallback testuale: in tema chiaro usiamo carbone caldo (non più
   * il blu --color-sea). Il logo, come segnale brand, non deve mai
   * portare blu sotto/intorno a sé. */
  const fallbackText = (
    <span
      className={cn(
        "inline-flex flex-col leading-none",
        theme === "light"
          ? "text-[var(--color-ivory)]"
          : "text-[var(--color-ink-strong)]",
      )}
    >
      <span className="font-display text-[1.25rem] tracking-[0.08em] sm:text-[1.45rem] lg:text-[1.65rem]">
        {siteConfig.brand.wordmark.toUpperCase()}
      </span>
    </span>
  );

  const imageContent = (
    <Image
      src={src}
      alt={alt}
      width={dims.width}
      height={dims.height}
      priority={priority}
      unoptimized
      onError={() => setFailed(true)}
      className={cn(
        "select-none object-contain",
        sizeClasses,
        imageClassName,
      )}
    />
  );

  const block = (
    <span className={cn("inline-flex items-center gap-3", className)}>
      {failed ? fallbackText : imageContent}
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
