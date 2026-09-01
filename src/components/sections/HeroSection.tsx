"use client";

import { useCallback, useEffect, useState } from "react";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

/**
 * Hero carosello — replica quasi identica del demo cliente
 * (granpremiodinapoli.it/anteprima): immagine full-bleed con overlay
 * verde scuro, eyebrow, titolo serif con una parola in corsivo oro,
 * paragrafo, CTA pill, frecce prev/next circolari bordo oro.
 *
 * Nota: le 3 scene condividono la stessa immagine di sfondo (unica
 * foto confermata in public/images/home/); non sono state inventate
 * foto aggiuntive per le scene 2 e 3.
 */
export default function HeroSection() {
  const { hero } = siteConfig;
  const slides = hero.slides;
  const [index, setIndex] = useState(0);

  const goTo = useCallback(
    (next: number) => {
      setIndex(((next % slides.length) + slides.length) % slides.length);
    },
    [slides.length],
  );

  const goPrev = useCallback(() => goTo(index - 1), [goTo, index]);
  const goNext = useCallback(() => goTo(index + 1), [goTo, index]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft") goPrev();
      if (e.key === "ArrowRight") goNext();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [goPrev, goNext]);

  const slide = slides[index];

  return (
    <section
      id="top"
      aria-label="Vini & OliSud — Magna Grecia"
      className="relative"
      data-content-key="sec:hero"
    >
      <div className="relative -mt-[var(--site-header-height)] min-h-[calc(100svh)] overflow-hidden bg-[var(--color-grove)]">
        <picture>
          <source media="(max-width: 767px)" srcSet={hero.backgroundImageMobile} />
          <img
            src={hero.backgroundImage}
            alt=""
            aria-hidden="true"
            className="absolute inset-0 h-full w-full object-cover"
          />
        </picture>
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(26,53,40,0.72)_0%,rgba(26,53,40,0.58)_45%,rgba(26,53,40,0.82)_100%)]"
        />

        <div
          className="section-shell relative z-10 flex min-h-[calc(100svh)] flex-col justify-center pt-[var(--site-header-height)] pb-16"
        >
          <div className="flex max-w-[46rem] flex-col">
            <div className="flex items-center gap-3">
              <span aria-hidden="true" className="h-px w-8 bg-[rgba(255,215,87,0.65)]" />
              <p
                className="font-ui text-[0.74rem] font-semibold uppercase tracking-[0.24em] text-[rgba(255,253,245,0.85)]"
                data-content-key={`field:hero.slides.${index}.eyebrow`}
              >
                {slide.eyebrow}
              </p>
            </div>

            <h1 className="display-balance mt-5 font-display leading-[1.02] tracking-[0.005em] text-[var(--color-ivory)] text-[clamp(2.1rem,6vw,4rem)]">
              {slide.titlePrefix}
              <em
                className="font-display italic text-[var(--color-sand)]"
                data-content-key={`field:hero.slides.${index}.titleEmphasis`}
              >
                {slide.titleEmphasis}
              </em>
              {slide.titleSuffix}
            </h1>

            <p
              className="mt-6 max-w-[54ch] text-[1.02rem] leading-[1.7] text-[rgba(255,253,245,0.9)]"
              data-content-key={`field:hero.slides.${index}.paragraph`}
            >
              {slide.paragraph}
            </p>

            <div className="mt-8 flex items-center gap-5">
              <Button href={slide.ctaHref} variant="primary" size="md">
                {slide.ctaLabel}
              </Button>
            </div>
          </div>

          <div className="mt-14 flex items-center gap-4">
            <button
              type="button"
              onClick={goPrev}
              aria-label="Scena precedente"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,215,87,0.55)] text-[var(--color-sand)] transition-colors duration-300 hover:bg-[rgba(255,215,87,0.14)]"
            >
              <span aria-hidden="true">←</span>
            </button>
            <div className="flex items-center gap-2" role="tablist" aria-label="Scene hero">
              {slides.map((s, i) => (
                <button
                  key={s.eyebrow}
                  type="button"
                  role="tab"
                  aria-selected={i === index}
                  aria-label={`Vai alla scena ${i + 1}`}
                  onClick={() => goTo(i)}
                  className={`h-2 rounded-full transition-all duration-300 ${
                    i === index
                      ? "w-6 bg-[var(--color-sand)]"
                      : "w-2 bg-[rgba(255,253,245,0.4)] hover:bg-[rgba(255,253,245,0.65)]"
                  }`}
                />
              ))}
            </div>
            <button
              type="button"
              onClick={goNext}
              aria-label="Scena successiva"
              className="flex h-11 w-11 items-center justify-center rounded-full border border-[rgba(255,215,87,0.55)] text-[var(--color-sand)] transition-colors duration-300 hover:bg-[rgba(255,215,87,0.14)]"
            >
              <span aria-hidden="true">→</span>
            </button>
          </div>
        </div>
      </div>

      <div className="bg-[var(--color-ivory)] py-4 text-center">
        <p className="font-ui text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-muted)]">
          {hero.institutionalNote}
        </p>
      </div>
    </section>
  );
}
