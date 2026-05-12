"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import { siteConfig } from "@/data/site";
import { cn } from "@/lib/cn";

type BrandLogoVariant = "header" | "footer" | "default";
type BrandLogoTheme = "default" | "light";

type BrandLogoProps = {
  href?: string;
  variant?: BrandLogoVariant;
  theme?: BrandLogoTheme;
  className?: string;
};

export default function BrandLogo({
  href = "/",
  variant = "default",
  theme = "default",
  className,
}: BrandLogoProps) {
  const [hasImageError, setHasImageError] = useState(false);

  const tone =
    theme === "light"
      ? {
          title: "text-[var(--color-ivory)]",
          subtitle: "text-[rgba(248,243,232,0.7)]",
          frame: "border-white/12 bg-white/6",
        }
      : {
          title: "text-[var(--color-sea)]",
          subtitle: "text-[var(--color-wine)]",
          frame: "border-[rgba(19,41,61,0.12)] bg-white/75",
        };

  const imageSize =
    variant === "footer" ? "h-18 w-18 rounded-[1.4rem]" : "h-11 w-11 rounded-xl";
  const showSubtitle = variant === "footer";

  const fallbackText = (
    <span className="inline-flex min-w-0 flex-col gap-0.5">
      <span
        className={cn(
          "font-display leading-none tracking-[0.01em]",
          tone.title,
          variant === "footer" ? "text-[2rem]" : "text-[1.6rem]",
        )}
      >
        {siteConfig.brand.wordmark}
      </span>
      <span
        className={cn(
          "text-[0.66rem] font-semibold uppercase tracking-[0.24em]",
          tone.subtitle,
          showSubtitle ? "block" : "hidden lg:block",
        )}
      >
        {siteConfig.brand.subtitle}
      </span>
    </span>
  );

  const content = (
    <span
      className={cn(
        "inline-flex min-w-0 items-center",
        variant === "footer" ? "gap-4" : "gap-3",
        className,
      )}
    >
      {!hasImageError ? (
        <span
          className={cn(
            "inline-flex shrink-0 items-center justify-center overflow-hidden border shadow-[0_12px_28px_rgba(19,41,61,0.14)]",
            imageSize,
            tone.frame,
          )}
        >
          <Image
            src={siteConfig.brand.assets.logoSquare}
            alt="Logo Vini Oli Sud"
            width={1024}
            height={1024}
            unoptimized
            className="h-full w-full object-cover"
            onError={() => setHasImageError(true)}
          />
        </span>
      ) : null}

      <span className="inline-flex min-w-0 flex-col gap-0.5">
        <span
          className={cn(
            "font-display leading-none tracking-[0.01em]",
            tone.title,
            variant === "footer" ? "text-[2rem]" : "text-[1.6rem]",
          )}
        >
          {siteConfig.brand.wordmark}
        </span>
        <span
          className={cn(
            "text-[0.66rem] font-semibold uppercase tracking-[0.24em]",
            tone.subtitle,
            showSubtitle ? "block" : "hidden min-[1120px]:block",
          )}
        >
          {siteConfig.brand.subtitle}
        </span>
      </span>

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
