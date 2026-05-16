"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

const scrollScenes = [
  {
    eyebrow: "Mediterraneo Premium",
    title: "Il Sud si incontra a tavola.",
    description:
      "Una tavola vera, lenta e luminosa: vino, olio, pane e territorio come ingresso sensoriale nel progetto Vini Oli Sud.",
  },
  {
    eyebrow: "Vino",
    title: "Vino, olio, pane, territorio.",
    description:
      "Il prodotto non è decorazione: è cultura materiale, memoria agricola e relazione commerciale.",
  },
  {
    eyebrow: "Olio",
    title: "La materia del Mediterraneo.",
    description:
      "Anfore, olive, pane e oro verde portano Oli Sud al centro della narrazione, insieme al vino.",
  },
  {
    eyebrow: "Napoli",
    title: "Napoli accoglie il Sud.",
    description:
      "La tavola diventa palcoscenico: produttori, buyer, visitatori, media e partner entrano nello stesso racconto.",
  },
  {
    eyebrow: "Percorsi",
    title: "Scegli il tuo percorso.",
    description:
      "Una home pensata per indirizzare subito ogni pubblico verso l’azione più utile.",
  },
] as const;

export default function HeroSection() {
  const { hero, audiences } = siteConfig;
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frameId = 0;

    const updateProgress = () => {
      if (!sectionRef.current) {
        return;
      }

      const rect = sectionRef.current.getBoundingClientRect();
      const scrollableDistance = Math.max(
        sectionRef.current.offsetHeight - window.innerHeight,
        1,
      );
      const nextProgress = Math.min(
        Math.max(-rect.top / scrollableDistance, 0),
        1,
      );

      setProgress(Number(nextProgress.toFixed(3)));
    };

    const requestUpdate = () => {
      window.cancelAnimationFrame(frameId);
      frameId = window.requestAnimationFrame(updateProgress);
    };

    updateProgress();
    window.addEventListener("scroll", requestUpdate, { passive: true });
    window.addEventListener("resize", requestUpdate);

    return () => {
      window.cancelAnimationFrame(frameId);
      window.removeEventListener("scroll", requestUpdate);
      window.removeEventListener("resize", requestUpdate);
    };
  }, []);

  const currentSceneIndex = Math.min(
    scrollScenes.length - 1,
    Math.floor(progress * scrollScenes.length),
  );
  const currentScene = scrollScenes[currentSceneIndex];
  const showGateway = progress >= 0.78;

  const imageStyle = {
    transform: `translate3d(0, ${progress * -56}%, 0) scale(${1.03 + progress * 0.05})`,
    willChange: "transform",
  } satisfies CSSProperties;

  return (
    <section
      ref={sectionRef}
      className="relative h-[420vh] bg-[var(--color-grove)]"
      aria-label="Hero scroll-bound Vini Oli Sud"
    >
      <div className="sticky top-[4rem] h-[calc(100vh-4rem)] overflow-hidden sm:top-[4.45rem] sm:h-[calc(100vh-4.45rem)] lg:top-[4.8rem] lg:h-[calc(100vh-4.8rem)]">
        <div className="absolute inset-0 bg-[var(--color-grove)]">
          <picture aria-hidden="true">
            <source
              media="(max-width: 767px)"
              srcSet="/images/home/tavola-scroll-mobile.jpg"
            />
            <img
              src="/images/home/tavola-scroll-master.jpg"
              alt=""
              className="h-[230vh] min-h-[1500px] w-full object-cover object-top md:h-[250vh]"
              style={imageStyle}
            />
          </picture>
        </div>

        <div
          className="absolute inset-0 bg-[linear-gradient(90deg,rgba(16,22,14,0.74)_0%,rgba(16,22,14,0.38)_42%,rgba(16,22,14,0.68)_100%),linear-gradient(180deg,rgba(0,0,0,0.16)_0%,rgba(0,0,0,0.06)_42%,rgba(0,0,0,0.44)_100%)]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_18%,rgba(200,167,111,0.18),transparent_28%),radial-gradient(circle_at_82%_74%,rgba(122,38,52,0.16),transparent_24%)]"
          aria-hidden="true"
        />

        <div className="section-shell relative z-10 flex h-full items-center py-8">
          <div className="max-w-[58rem]">
            <div className="flex items-center gap-3">
              <span
                className="h-px w-8 bg-[rgba(248,243,232,0.58)]"
                aria-hidden="true"
              />
              <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[rgba(248,243,232,0.78)] sm:text-[0.8rem]">
                {currentScene.eyebrow}
              </p>
            </div>

            <h1 className="display-balance mt-5 max-w-[12ch] font-display text-[clamp(3.4rem,14vw,5rem)] leading-[0.88] tracking-[0.01em] text-[var(--color-ivory)] drop-shadow-[0_16px_42px_rgba(0,0,0,0.32)] sm:text-[clamp(4.5rem,10vw,8.5rem)] lg:text-[clamp(5rem,8vw,9.4rem)]">
              {currentScene.title}
            </h1>

            <p className="mt-6 max-w-[42rem] text-[1rem] leading-[1.72] text-[rgba(248,243,232,0.82)] drop-shadow-[0_12px_28px_rgba(0,0,0,0.28)] sm:text-[1.12rem] lg:text-[1.22rem]">
              {currentScene.description}
            </p>

            <div
              className={[
                "mt-8 flex flex-col gap-3 transition-all duration-500 ease-out sm:flex-row sm:flex-wrap",
                showGateway
                  ? "pointer-events-none -translate-y-2 opacity-0"
                  : "translate-y-0 opacity-100",
              ].join(" ")}
            >
              {hero.actions.slice(0, 2).map((action, index) => (
                <Button
                  key={action.href}
                  href={action.href}
                  size="lg"
                  className="w-fit max-w-full border-[rgba(248,243,232,0.22)] sm:w-auto"
                  variant={index === 0 ? "primary" : "ivory"}
                >
                  {action.label}
                </Button>
              ))}
            </div>

            <div
              className={[
                "mt-10 grid max-w-[58rem] gap-3 transition-all duration-700 ease-out sm:grid-cols-2 lg:grid-cols-4",
                showGateway
                  ? "translate-y-0 opacity-100"
                  : "pointer-events-none translate-y-6 opacity-0",
              ].join(" ")}
            >
              {audiences.map((audience) => (
                <Link
                  key={audience.href}
                  href={audience.href}
                  className="group rounded-[1.4rem] border border-[rgba(248,243,232,0.2)] bg-[rgba(248,243,232,0.12)] p-5 text-[var(--color-ivory)] shadow-[0_18px_44px_rgba(0,0,0,0.16)] backdrop-blur-md transition duration-300 ease-out hover:-translate-y-1 hover:border-[rgba(200,167,111,0.55)] hover:bg-[rgba(248,243,232,0.18)] motion-reduce:hover:translate-y-0"
                >
                  <p className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-[rgba(200,167,111,0.86)]">
                    {audience.eyebrow}
                  </p>
                  <h2 className="mt-3 font-display text-[1.42rem] leading-[1.02]">
                    {audience.title}
                  </h2>
                  <p className="mt-4 font-ui text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-[rgba(248,243,232,0.72)] transition-colors duration-300 group-hover:text-[var(--color-sand)]">
                    {audience.ctaLabel}
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </div>

        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 text-[rgba(248,243,232,0.62)] md:flex">
          <span className="font-ui text-[0.64rem] font-semibold uppercase tracking-[0.2em]">
            Scorri la tavola
          </span>
          <span
            className="h-10 w-px bg-gradient-to-b from-[rgba(248,243,232,0.72)] to-transparent"
            aria-hidden="true"
          />
        </div>
      </div>
    </section>
  );
}
