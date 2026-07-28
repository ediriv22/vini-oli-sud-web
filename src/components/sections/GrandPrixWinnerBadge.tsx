"use client";

import Image from "next/image";
import { useCallback, useState } from "react";

type GrandPrixWinnerBadgeProps = {
  src: string;
  alt: string;
  award: string;
};

export default function GrandPrixWinnerBadge({
  src,
  alt,
  award,
}: GrandPrixWinnerBadgeProps) {
  const [failed, setFailed] = useState(false);

  const handleError = useCallback(() => {
    setFailed(true);
  }, []);

  if (failed) {
    return (
      <div
        className="relative z-10 mx-auto flex aspect-square w-[5.5rem] max-w-full flex-col items-center justify-center gap-1 rounded-full border border-[rgba(255,215,87,0.5)] bg-[rgba(255,253,245,0.92)] px-3 py-2 text-center shadow-[inset_0_1px_0_rgba(255,255,255,0.65)] sm:w-[6.875rem] lg:w-[7.875rem]"
        role="img"
        aria-label={alt}
      >
        <span className="font-ui text-[0.58rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]">
          Grand Prix
        </span>
        <span className="line-clamp-4 font-display text-[0.82rem] leading-snug text-[var(--color-wine)]">
          {award}
        </span>
      </div>
    );
  }

  return (
    <div className="relative z-10 mx-auto flex h-[5.5rem] w-[5.5rem] items-center justify-center sm:h-[6.875rem] sm:w-[6.875rem] lg:h-[7.875rem] lg:w-[7.875rem]">
      <Image
        src={src}
        alt={alt}
        width={280}
        height={280}
        sizes="(max-width: 640px) 120px, 140px"
        className="h-full w-full object-contain object-center"
        onError={handleError}
      />
    </div>
  );
}
