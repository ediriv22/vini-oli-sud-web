"use client";

import { useState } from "react";
import GrandPrixWinnerBadge from "@/components/sections/GrandPrixWinnerBadge";
import { siteConfig } from "@/data/site";
import { grandPrixWinners2025 } from "@/data/winners";
import { getSectionBackgroundStyle } from "@/lib/sectionBackground";

export default function GrandPrixHighlight() {
  const {
    eyebrow,
    title,
    subtitle,
    registrationsNote,
    registrationsDetail,
    featuredAwards,
    expandLabel,
    collapseLabel,
  } = siteConfig.grandPrixHighlight;
  const [expanded, setExpanded] = useState(false);

  const featured = featuredAwards
    .map((award) => grandPrixWinners2025.find((winner) => winner.award === award))
    .filter((winner): winner is (typeof grandPrixWinners2025)[number] => Boolean(winner));

  const remaining = grandPrixWinners2025.filter(
    (winner) => !featuredAwards.includes(winner.award as (typeof featuredAwards)[number]),
  );

  return (
    <section
      id="grand-prix"
      aria-labelledby="grand-prix-highlight-title"
      className="section-space bg-[var(--color-grove)]"
      style={getSectionBackgroundStyle(siteConfig.sectionBackgrounds.grandPrix)}
      data-content-key="sec:grandPrixHighlight"
    >
      <div className="section-shell">
        <div className="mx-auto max-w-[46rem] text-center">
          <p
            className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.22em] text-[var(--color-sand)]"
            data-content-key="field:grandPrixHighlight.eyebrow"
          >
            {eyebrow}
          </p>
          <h2
            id="grand-prix-highlight-title"
            className="display-balance mx-auto mt-4 max-w-[24ch] font-display text-[clamp(2.1rem,4.6vw,3rem)] leading-[1.05] tracking-[0.005em] text-[var(--color-ivory)]"
            data-content-key="field:grandPrixHighlight.title"
          >
            {title}
          </h2>
          <p
            className="mt-6 text-[1.02rem] leading-[1.7] text-[rgba(255,253,245,0.82)]"
            data-content-key="field:grandPrixHighlight.subtitle"
          >
            {subtitle}
          </p>

          <div className="mt-8 inline-flex flex-col items-center gap-2 rounded-[1.1rem] border border-[rgba(255,215,87,0.35)] bg-[rgba(255,253,245,0.06)] px-6 py-5">
            <p
              className="font-ui text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand)]"
              data-content-key="field:grandPrixHighlight.registrationsNote"
            >
              {registrationsNote}
            </p>
            <p
              className="text-[0.88rem] leading-[1.6] text-[rgba(255,253,245,0.78)]"
              data-content-key="field:grandPrixHighlight.registrationsDetail"
            >
              {registrationsDetail}
            </p>
          </div>
        </div>

        <ul className="mt-14 grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4">
          {featured.map((winner) => (
            <li
              key={winner.award}
              className="group relative flex flex-col items-center justify-center rounded-[1.1rem] border border-[rgba(255,215,87,0.25)] bg-[rgba(255,253,245,0.06)] px-4 py-6 text-center transition-[border-color,background-color] duration-300 ease-out hover:border-[rgba(255,215,87,0.5)] hover:bg-[rgba(255,253,245,0.1)] motion-reduce:transition-none sm:px-5 sm:py-7"
            >
              <GrandPrixWinnerBadge
                src={winner.badgeSrc}
                alt={winner.badgeAlt}
                award={winner.award}
              />
              <p className="font-ui mt-3 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-sand)]">
                {winner.award}
              </p>
              <p className="mt-2 font-display text-[1.02rem] leading-snug text-[var(--color-ivory)] sm:text-[1.08rem]">
                {winner.product}
              </p>
              <p className="mt-1 text-[0.84rem] leading-relaxed text-[rgba(255,253,245,0.75)]">
                {winner.producer}
              </p>
            </li>
          ))}
        </ul>

        {remaining.length ? (
          <div className="mt-10 text-center">
            <button
              type="button"
              onClick={() => setExpanded((v) => !v)}
              aria-expanded={expanded}
              aria-controls="grand-prix-remaining"
              className="font-ui inline-flex items-center gap-2 rounded-full border border-[rgba(255,215,87,0.55)] px-6 py-3 text-[0.82rem] font-semibold uppercase tracking-[0.12em] text-[var(--color-sand)] transition-colors duration-300 ease-out hover:bg-[rgba(255,215,87,0.14)]"
            >
              {expanded ? collapseLabel : expandLabel}
              <span
                aria-hidden="true"
                className={`inline-block transition-transform duration-300 ${expanded ? "-rotate-90" : "rotate-90"}`}
              >
                →
              </span>
            </button>

            <ul
              id="grand-prix-remaining"
              className={`mt-8 grid grid-cols-2 gap-5 overflow-hidden transition-[max-height,opacity] duration-500 ease-out sm:gap-6 lg:grid-cols-4 ${
                expanded ? "max-h-[2000px] opacity-100" : "max-h-0 opacity-0"
              }`}
            >
              {remaining.map((winner) => (
                <li
                  key={winner.award}
                  className="group relative flex flex-col items-center justify-center rounded-[1.1rem] border border-[rgba(255,215,87,0.25)] bg-[rgba(255,253,245,0.06)] px-4 py-6 text-center sm:px-5 sm:py-7"
                >
                  <GrandPrixWinnerBadge
                    src={winner.badgeSrc}
                    alt={winner.badgeAlt}
                    award={winner.award}
                  />
                  <p className="font-ui mt-3 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-sand)]">
                    {winner.award}
                  </p>
                  <p className="mt-2 font-display text-[1.02rem] leading-snug text-[var(--color-ivory)] sm:text-[1.08rem]">
                    {winner.product}
                  </p>
                  <p className="mt-1 text-[0.84rem] leading-relaxed text-[rgba(255,253,245,0.75)]">
                    {winner.producer}
                  </p>
                </li>
              ))}
            </ul>
          </div>
        ) : null}
      </div>
    </section>
  );
}
