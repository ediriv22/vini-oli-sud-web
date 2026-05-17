"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type CSSProperties } from "react";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

/**
 * Hero scroll-bound (direzione creativa originale).
 *
 * Migliorie introdotte in questa iterazione:
 *  - H1 più concreto sulla scena di apertura ("Il Sud si incontra sul
 *    Lungomare di Napoli."), come richiesto dal brief CRO.
 *  - Sottotitolo informativo presente in tutte le scene narrative
 *    (non solo decorativo).
 *  - 2 CTA primarie visibili in ogni scena narrativa (non più solo
 *    scena 1).
 *  - Micro-routing 4 chip per Espositori/Buyer/Visitatori/Media sempre
 *    accessibili sotto le CTA.
 *  - Parallax disabilitato con `prefers-reduced-motion`.
 *  - Gateway finale invariato (4 card audience).
 */

const scrollScenes = [
  {
    eyebrow: "Mediterraneo",
    title: "Il Sud si incontra sul Lungomare di Napoli.",
    subtitle:
      "Vini, oli, buyer, cultura mediterranea e motorsport si incontrano in un salone premium dedicato alle eccellenze del Mezzogiorno.",
  },
  {
    eyebrow: "Origine",
    title: "Vino, olio, pane, territorio.",
    subtitle:
      "Una boutique verticale che mette in dialogo cantine, frantoi e operatori del Sud Italia.",
  },
  {
    eyebrow: "Materia",
    title: "La materia del Mediterraneo.",
    subtitle:
      "Anfore, olive, vendemmie, mare: la materia del Sud diventa scena commerciale per chi seleziona.",
  },
  {
    eyebrow: "Napoli",
    title: "Napoli accoglie il Sud.",
    subtitle:
      "Tra Lungomare e Vesuvio, produttori e buyer incontrano un pubblico premium nel palcoscenico del Napoli Racing Show.",
  },
  {
    eyebrow: "Percorsi",
    title: "Scegli il tuo percorso.",
    subtitle:
      "Quattro accessi, quattro obiettivi: Espositori, Buyer, Visitatori, Media.",
  },
] as const;

const gatewayCards = [
  {
    eyebrow: "Espositori",
    title: "Produci eccellenza",
    ctaLabel: "Visita l’area Espositori",
    href: "/espositori",
  },
  {
    eyebrow: "Buyer",
    title: "Seleziona il Sud",
    ctaLabel: "Visita l’area Buyer",
    href: "/buyer",
  },
  {
    eyebrow: "Visitatori",
    title: "Vivi l’esperienza",
    ctaLabel: "Visita l’area Visitatori",
    href: "/visitatori",
  },
  {
    eyebrow: "Media e Partner",
    title: "Racconta il progetto",
    ctaLabel: "Visita l’area Media",
    href: "/media",
  },
] as const;

export default function HeroSection() {
  const { hero, audiences } = siteConfig;
  const sectionRef = useRef<HTMLElement | null>(null);
  const [progress, setProgress] = useState(0);
  const [reducedMotion, setReducedMotion] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setReducedMotion(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    let frameId = 0;
    const updateProgress = () => {
      if (!sectionRef.current) return;
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

  const imageStyle: CSSProperties = reducedMotion
    ? { transform: "translate3d(0, -18%, 0) scale(1.04)" }
    : {
        transform: `translate3d(0, ${progress * -56}%, 0) scale(${1.03 + progress * 0.05})`,
        willChange: "transform",
      };

  return (
    <section
      ref={sectionRef}
      className="relative -mt-[var(--site-header-height)] h-[420vh]"
      aria-label="Hero scroll-bound Vini Oli Sud"
    >
      <div
        className="sticky overflow-hidden"
        style={{
          top: "var(--site-header-height)",
          height: "calc(100svh - var(--site-header-height))",
        }}
      >
        <div className="absolute inset-0 bg-[var(--color-grove)]">
          <picture>
            <source
              media="(max-width: 767px)"
              srcSet="/images/home/tavola-scroll-mobile.jpg"
            />
            <img
              src="/images/home/tavola-scroll-master.jpg"
              alt=""
              aria-hidden="true"
              className="h-[230vh] min-h-[1500px] w-full object-cover object-top md:h-[250vh]"
              style={imageStyle}
            />
          </picture>
        </div>

        {/* Overlay scuro per garantire AA su tutti i testi sopra. */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[linear-gradient(180deg,rgba(15,24,33,0.78)_0%,rgba(15,24,33,0.5)_42%,rgba(15,24,33,0.84)_100%)]"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-[radial-gradient(circle_at_18%_22%,rgba(176,141,87,0.22),transparent_34%),radial-gradient(circle_at_82%_72%,rgba(107,30,30,0.22),transparent_30%)]"
        />
        {/*
         * Dissolvenza editoriale verso l'avorio della sezione successiva.
         * Senza questo gradient il passaggio dalla hero scura al beige
         * dell'EditionStrip è una "ghigliottina" orizzontale. La fascia
         * occupa la parte bassa dello sticky viewport e fa sembrare che
         * l'immagine sfumi naturalmente nel colore del body.
         */}
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[24vh] bg-[linear-gradient(180deg,rgba(244,237,224,0)_0%,rgba(244,237,224,0.35)_45%,rgba(244,237,224,0.85)_82%,var(--color-ivory)_100%)]"
        />

        <div
          className="section-shell relative z-10 flex h-full flex-col py-8"
          style={{
            paddingTop: "clamp(1.25rem, 8vh, 3rem)",
            paddingBottom: "clamp(1.25rem, 6vh, 2.5rem)",
          }}
        >
          {!showGateway ? (
            <div className="flex w-full max-w-[60rem] flex-col justify-start">
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="h-px w-8 bg-[rgba(244,237,224,0.6)]"
                />
                <p className="font-ui text-[0.74rem] font-semibold uppercase tracking-[0.22em] text-[rgba(244,237,224,0.82)] sm:text-[0.8rem]">
                  {currentScene.eyebrow}
                </p>
              </div>

              <h1 className="display-balance mt-6 max-w-[18ch] font-display leading-[0.96] tracking-[0.005em] text-[var(--color-ivory)] drop-shadow-[0_16px_42px_rgba(0,0,0,0.32)] text-[clamp(2.35rem,8vw,3.6rem)] sm:text-[clamp(3rem,6.5vw,5rem)] lg:text-[clamp(3.4rem,5vw,5.6rem)]">
                {currentScene.title}
              </h1>

              <p className="mt-6 max-w-[56ch] text-[1.02rem] leading-[1.65] text-[rgba(244,237,224,0.9)] drop-shadow-[0_10px_24px_rgba(0,0,0,0.32)] sm:text-[1.1rem]">
                {currentScene.subtitle}
              </p>

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:gap-4">
                {hero.actions.slice(0, 2).map((action, index) => (
                  <Button
                    key={action.href}
                    href={action.href}
                    size="md"
                    className="w-full sm:w-auto"
                    variant={index === 0 ? "primary" : "ivory"}
                  >
                    {action.label}
                  </Button>
                ))}
              </div>

              {/* Micro-routing: 4 chip sempre presenti sopra l'immagine
                  scroll-bound, accessibili anche se l'utente non vuole
                  scrollare fino al gateway finale. */}
              <nav
                aria-label="Percorsi rapidi per audience"
                className="mt-10 sm:mt-12"
              >
                <p className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.22em] text-[rgba(244,237,224,0.65)]">
                  Percorsi rapidi
                </p>
                <ul className="mt-4 grid gap-2.5 sm:grid-cols-2 sm:gap-3 lg:grid-cols-4">
                  {audiences.map((audience) => (
                    <li key={audience.href}>
                      <Link
                        href={audience.href}
                        className="group flex min-h-[3rem] items-center justify-between gap-3 rounded-[0.55rem] border border-[rgba(244,237,224,0.22)] bg-[rgba(15,24,33,0.32)] px-4 py-3 text-[var(--color-ivory)] backdrop-blur-md transition-[border-color,background-color] duration-300 ease-out hover:border-[rgba(176,141,87,0.6)] hover:bg-[rgba(15,24,33,0.52)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(176,141,87,0.6)] motion-reduce:transition-none"
                      >
                        <span className="min-w-0">
                          <span className="font-ui block text-[0.62rem] font-semibold uppercase tracking-[0.2em] text-[rgba(176,141,87,0.95)]">
                            {audience.eyebrow}
                          </span>
                          <span className="font-display mt-0.5 block text-[1.02rem] leading-[1.15] text-[var(--color-ivory)]">
                            {audience.shortLabel}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className="font-ui text-[0.82rem] text-[rgba(244,237,224,0.6)] transition-[color,transform] duration-300 ease-out group-hover:text-[var(--color-sand)] motion-safe:group-hover:translate-x-0.5"
                        >
                          →
                        </span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            </div>
          ) : (
            /*
             * Scena finale: layout a due colonne con sinistra (titolo +
             * sottotitolo) e destra (4 card). Niente più max-h calcolato
             * a partire dalla viewport (causava il taglio delle card
             * inferiori quando la sezione successiva entrava in scena).
             * Il margin-bottom alto serve a tenere la griglia sopra la
             * fascia di dissolvenza verso l'avorio.
             */
            <div className="grid h-full min-h-0 w-full content-center gap-6 pb-[clamp(3rem,10vh,6rem)] lg:grid-cols-[0.68fr_1.32fr] lg:gap-10">
              <div className="min-w-0">
                <div className="flex items-center gap-3">
                  <span
                    aria-hidden="true"
                    className="h-px w-8 bg-[rgba(244,237,224,0.6)]"
                  />
                  <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[rgba(244,237,224,0.82)]">
                    {currentScene.eyebrow}
                  </p>
                </div>

                <h1 className="display-balance mt-4 font-display leading-[0.98] tracking-[0.005em] text-[var(--color-ivory)] drop-shadow-[0_12px_32px_rgba(0,0,0,0.32)] text-[clamp(2rem,4vw,3.4rem)]">
                  {currentScene.title}
                </h1>

                <p className="mt-4 max-w-[36ch] text-[0.96rem] leading-[1.55] text-[rgba(244,237,224,0.86)] drop-shadow-[0_8px_20px_rgba(0,0,0,0.28)]">
                  {currentScene.subtitle}
                </p>
              </div>

              <ul className="grid w-full gap-3 sm:grid-cols-2 sm:gap-3.5">
                {gatewayCards.map((card) => (
                  <li key={card.href}>
                    <Link
                      href={card.href}
                      className="group flex h-full flex-col rounded-[0.75rem] border border-[rgba(244,237,224,0.22)] bg-[rgba(244,237,224,0.12)] px-4 py-4 text-[var(--color-ivory)] backdrop-blur-md transition duration-300 ease-out hover:border-[rgba(176,141,87,0.55)] hover:bg-[rgba(244,237,224,0.18)] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(176,141,87,0.6)] motion-reduce:transition-none motion-reduce:hover:translate-y-0 sm:px-5 sm:py-5"
                    >
                      <p className="font-ui text-[0.64rem] font-semibold uppercase tracking-[0.2em] text-[rgba(176,141,87,0.95)]">
                        {card.eyebrow}
                      </p>
                      <h2 className="mt-2 font-display text-[1.08rem] leading-[1.15] tracking-[0.005em] sm:text-[1.16rem]">
                        {card.title}
                      </h2>
                      <p className="font-ui mt-2.5 inline-flex items-center gap-1.5 text-[0.66rem] font-semibold uppercase tracking-[0.1em] text-[rgba(244,237,224,0.82)] transition-colors duration-300 group-hover:text-[var(--color-sand)]">
                        {card.ctaLabel}
                        <span aria-hidden="true">→</span>
                      </p>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        <div className="pointer-events-none absolute bottom-6 left-1/2 z-10 hidden -translate-x-1/2 items-center gap-3 text-[rgba(244,237,224,0.62)] md:flex">
          <span className="font-ui text-[0.64rem] font-semibold uppercase tracking-[0.2em]">
            Scorri la tavola
          </span>
          <span
            aria-hidden="true"
            className="h-10 w-px bg-gradient-to-b from-[rgba(244,237,224,0.72)] to-transparent"
          />
        </div>
      </div>
    </section>
  );
}
