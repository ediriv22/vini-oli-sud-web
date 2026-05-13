"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/cn";

type BrandLogoVariant = "horizontal" | "square" | "default";
type BrandLogoTheme = "default" | "light";

type BrandLogoProps = {
  href?: string;
  variant?: BrandLogoVariant;
  theme?: BrandLogoTheme;
  className?: string;
  imageClassName?: string;
};

export default function BrandLogo({
  href = "/",
  variant = "default",
  theme = "default",
  className,
  imageClassName,
}: BrandLogoProps) {
  const [hasImageError, setHasImageError] = useState(false);
  const resolvedVariant = variant === "default" ? "horizontal" : variant;
  const displayWordmark = siteConfig.brand.wordmark.toUpperCase();

  const tone =
    theme === "light"
      ? {
          title: "text-[var(--color-ivory)]",
          subtitle: "text-[rgba(248,243,232,0.7)]",
          frame: "border-white/12 bg-white/6",
          logoSurface: "drop-shadow-[0_12px_26px_rgba(7,24,16,0.2)]",
        }
      : {
          title: "text-[var(--color-sea)]",
          subtitle: "text-[rgba(95,107,51,0.78)]",
          frame: "border-[rgba(19,41,61,0.12)] bg-white/75",
          logoSurface: "",
        };

  const showSubtitle = resolvedVariant !== "square";
  const imageSrc =
    resolvedVariant === "square"
      ? siteConfig.brand.assets.logoSquare
      : siteConfig.brand.assets.logoHorizontalCropped;
  const imageAlt =
    resolvedVariant === "square"
      ? "Simbolo Vini Oli Sud"
      : "Logo orizzontale Vini Oli Sud";

  const fallbackText = (
    <span className="inline-flex min-w-0 flex-col gap-0.5">
      <span
        className={cn(
          "font-display leading-none tracking-[0.01em]",
          tone.title,
          resolvedVariant === "square" ? "text-[1.55rem]" : "text-[1.85rem]",
        )}
      >
        {displayWordmark}
      </span>
        <span
          className={cn(
            "font-ui text-[0.66rem] font-semibold uppercase tracking-[0.24em]",
            tone.subtitle,
            showSubtitle ? "block" : "hidden",
          )}
      >
        {siteConfig.brand.subtitle}
      </span>
    </span>
  );

  if (resolvedVariant === "horizontal") {
    const horizontalContent = (
      <span
        className={cn("inline-flex min-w-0 flex-col gap-1", className)}
      >
        <span
          className={cn(
            "font-display text-[1.32rem] leading-none tracking-[0.04em] sm:text-[1.7rem] lg:text-[2rem]",
            tone.title,
          )}
        >
          {displayWordmark}
        </span>
        <span className="hidden items-center gap-2 whitespace-nowrap sm:flex">
          <span className="h-px w-6 bg-[rgba(200,167,111,0.65)]" aria-hidden="true" />
          <span
            className={cn(
              "font-ui text-[0.62rem] font-medium uppercase leading-none tracking-[0.15em] lg:text-[0.68rem]",
              tone.subtitle,
            )}
          >
            {siteConfig.brand.subtitle}
          </span>
        </span>
      </span>
    );

    return href ? (
      <Link href={href} aria-label={siteConfig.brand.ariaLabel}>
        {horizontalContent}
      </Link>
    ) : (
      <span aria-label={siteConfig.brand.ariaLabel}>{horizontalContent}</span>
    );
  }

  const content = (
    <span
      className={cn(
        "inline-flex min-w-0 items-center",
        resolvedVariant === "square" ? "gap-3" : "gap-0",
        className,
      )}
    >
      {!hasImageError ? (
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center overflow-hidden",
            resolvedVariant === "square"
              ? cn(
                  "h-11 w-11 rounded-xl border shadow-[0_12px_28px_rgba(19,41,61,0.14)] sm:h-12 sm:w-12",
                  tone.frame,
                )
              : cn("rounded-none", tone.logoSurface),
          )}
        >
          <Image
            src={imageSrc}
            alt={imageAlt}
            width={resolvedVariant === "square" ? 1024 : 5000}
            height={resolvedVariant === "square" ? 1024 : 1250}
            unoptimized
            className={cn(
              "w-auto object-contain",
              resolvedVariant === "square"
                ? "h-full"
                : "h-9 max-h-9 sm:h-10 sm:max-h-10 lg:h-11 lg:max-h-11",
              imageClassName,
            )}
            onError={() => setHasImageError(true)}
          />
        </span>
      ) : null}

      {hasImageError ? null : <span className="sr-only">{siteConfig.brand.wordmark}</span>}
    </span>
  );

  const wrappedContent = hasImageError ? fallbackText : content;

  return href ? (
    <Link href={href} aria-label={siteConfig.brand.ariaLabel}>
      {wrappedContent}
    </Link>
  ) : (
    <span aria-label={siteConfig.brand.ariaLabel}>{wrappedContent}</span>
  );
}
