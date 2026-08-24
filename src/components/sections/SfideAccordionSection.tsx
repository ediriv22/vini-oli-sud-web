"use client";

import { useState } from "react";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

type Tier = { name: string; price: string; featured?: boolean; badge?: string; features: string[] };
type NamedIcon = { icon: string; name: string };
type Phase = { time: string; title: string; desc: string };
type Item = {
  kind: string;
  label: string;
  heading?: string;
  subheading?: string;
  sectionTitle?: string;
  tiers?: Tier[];
  ctaLabel?: string;
  ctaHref?: string;
  extraTitle?: string;
  extraBody?: string;
  extraCtaLabel?: string;
  extraCtaHref?: string;
  body?: string[];
  note?: string;
  concorsiTitle?: string;
  concorsi?: NamedIcon[];
  phasesTitle?: string;
  phasesIntro?: string;
  phases?: Phase[];
  phasesNote?: string;
  feeTitle?: string;
  feeSubtitle?: string;
  feeAmount?: string;
  feeTotal?: string;
  feeBody?: string[];
};

function ctaLink(href: string | undefined, email: string) {
  return href && href.length ? href : `mailto:${email}`;
}

function CtaButton({ href, email, children }: { href?: string; email: string; children: string }) {
  const target = ctaLink(href, email);
  const external = target.startsWith("http");
  return (
    <Button
      href={target}
      variant="primary"
      size="md"
      {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
    >
      {children}
    </Button>
  );
}

function Panel({ item, index, email }: { item: Item; index: number; email: string }) {
  const k = (f: string) => `field:sfideAccordion.items.${index}.${f}`;
  return (
    <div className="flex flex-col gap-5 text-[var(--color-muted)]">
      {item.heading ? (
        <h3 className="font-display text-[1.4rem] text-[var(--color-ink-strong)]" data-content-key={k("heading")}>
          {item.heading}
        </h3>
      ) : null}
      {item.subheading ? (
        <p className="text-[0.98rem] leading-[1.6]" data-content-key={k("subheading")}>
          {item.subheading}
        </p>
      ) : null}
      {item.body
        ? item.body.map((p, i) => (
            <p key={i} className="text-[0.95rem] leading-[1.6]" data-content-key={k(`body.${i}`)}>
              {p}
            </p>
          ))
        : null}
      {item.note ? (
        <p
          className="font-ui text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-wine)]"
          data-content-key={k("note")}
        >
          {item.note}
        </p>
      ) : null}

      {item.sectionTitle ? (
        <h4 className="font-display text-[1.2rem] text-[var(--color-ink-strong)]" data-content-key={k("sectionTitle")}>
          {item.sectionTitle}
        </h4>
      ) : null}
      {item.tiers ? (
        <div className="grid gap-4 sm:grid-cols-3">
          {item.tiers.map((t, i) => (
            <div
              key={i}
              className={`flex flex-col rounded-[1rem] border p-5 ${
                t.featured ? "border-[var(--color-sand-strong)] bg-[rgba(255,215,87,0.09)]" : "border-[rgba(47,91,70,0.25)]"
              }`}
            >
              <p className="font-display text-[1.05rem] leading-tight text-[var(--color-ink-strong)]">
                {t.badge ? <span aria-hidden="true">{t.badge} </span> : null}
                <span data-content-key={k(`tiers.${i}.name`)}>{t.name}</span>
              </p>
              <p className="mt-2 font-display text-[2rem] text-[var(--color-wine)]" data-content-key={k(`tiers.${i}.price`)}>
                {t.price}
              </p>
              <ul className="mt-3 space-y-1 text-[0.85rem] leading-snug">
                {t.features.map((f, j) => (
                  <li key={j}>• {f}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      ) : null}

      {item.concorsiTitle ? (
        <h4 className="font-display text-[1.2rem] text-[var(--color-ink-strong)]" data-content-key={k("concorsiTitle")}>
          {item.concorsiTitle}
        </h4>
      ) : null}
      {item.concorsi ? (
        <ul className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {item.concorsi.map((c, i) => (
            <li
              key={i}
              className="flex items-center gap-3 rounded-[0.9rem] border border-[rgba(47,91,70,0.22)] bg-[rgba(255,253,245,0.6)] px-4 py-3"
            >
              <span aria-hidden="true" className="text-[1.4rem] leading-none">
                {c.icon}
              </span>
              <span className="text-[0.92rem] font-medium text-[var(--color-ink-strong)]" data-content-key={k(`concorsi.${i}.name`)}>
                {c.name}
              </span>
            </li>
          ))}
        </ul>
      ) : null}

      {item.phasesTitle ? (
        <h4 className="font-display text-[1.2rem] text-[var(--color-ink-strong)]" data-content-key={k("phasesTitle")}>
          {item.phasesTitle}
        </h4>
      ) : null}
      {item.phasesIntro ? (
        <p className="text-[0.95rem] leading-[1.6]" data-content-key={k("phasesIntro")}>
          {item.phasesIntro}
        </p>
      ) : null}
      {item.phases ? (
        <ol className="flex flex-col gap-3">
          {item.phases.map((p, i) => (
            <li key={i} className="flex gap-4 rounded-[0.9rem] border border-[rgba(47,91,70,0.18)] px-4 py-3">
              <span className="font-ui shrink-0 text-[0.8rem] font-bold uppercase tracking-[0.08em] text-[var(--color-wine)]" data-content-key={k(`phases.${i}.time`)}>
                {p.time}
              </span>
              <span>
                <span className="block font-semibold text-[var(--color-ink-strong)]" data-content-key={k(`phases.${i}.title`)}>
                  {p.title}
                </span>
                {p.desc ? (
                  <span className="mt-1 block text-[0.88rem] leading-[1.5]" data-content-key={k(`phases.${i}.desc`)}>
                    {p.desc}
                  </span>
                ) : null}
              </span>
            </li>
          ))}
        </ol>
      ) : null}
      {item.phasesNote ? (
        <p className="text-[0.82rem] italic" data-content-key={k("phasesNote")}>
          {item.phasesNote}
        </p>
      ) : null}

      {item.feeTitle ? (
        <div className="rounded-[1rem] border border-[rgba(47,91,70,0.25)] bg-[rgba(255,253,245,0.6)] p-5 text-center">
          <p className="font-ui text-[0.8rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]" data-content-key={k("feeTitle")}>
            {item.feeTitle}
          </p>
          <p className="mt-1 text-[0.9rem]" data-content-key={k("feeSubtitle")}>
            {item.feeSubtitle}
          </p>
          <p className="mt-2 font-display text-[1.8rem] text-[var(--color-wine)]" data-content-key={k("feeAmount")}>
            {item.feeAmount}
          </p>
          <p className="font-ui text-[0.85rem] font-semibold text-[var(--color-ink-strong)]" data-content-key={k("feeTotal")}>
            {item.feeTotal}
          </p>
          {item.feeBody
            ? item.feeBody.map((p, i) => (
                <p key={i} className="mt-2 text-[0.85rem] leading-[1.5]" data-content-key={k(`feeBody.${i}`)}>
                  {p}
                </p>
              ))
            : null}
        </div>
      ) : null}

      {item.ctaLabel ? (
        <div>
          <CtaButton href={item.ctaHref} email={email}>
            {item.ctaLabel}
          </CtaButton>
        </div>
      ) : null}

      {item.extraTitle ? (
        <div className="mt-2 rounded-[1rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.6)] p-5">
          <p className="font-display text-[1.1rem] text-[var(--color-ink-strong)]" data-content-key={k("extraTitle")}>
            {item.extraTitle}
          </p>
          {item.extraBody ? (
            <p className="mt-2 text-[0.9rem] leading-[1.6]" data-content-key={k("extraBody")}>
              {item.extraBody}
            </p>
          ) : null}
          {item.extraCtaLabel ? (
            <div className="mt-4">
              <Button href={ctaLink(item.extraCtaHref, email)} variant="soft" size="md">
                {item.extraCtaLabel}
              </Button>
            </div>
          ) : null}
        </div>
      ) : null}
    </div>
  );
}

export default function SfideAccordionSection() {
  const data = siteConfig.sfideAccordion;
  const items = data.items as readonly Item[];
  const email = siteConfig.contact.projectEmail;
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section
      id="partecipa"
      aria-labelledby="partecipa-title"
      className="section-flow section-space"
      data-content-key="sec:sfideAccordion"
    >
      <div className="section-shell max-w-[60rem]">
        <div className="text-center">
          <p className="eyebrow text-center" data-content-key="field:sfideAccordion.eyebrow">
            {data.eyebrow}
          </p>
          <h2
            id="partecipa-title"
            className="display-balance mx-auto mt-4 max-w-[24ch] font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]"
            data-content-key="field:sfideAccordion.title"
          >
            {data.title}
          </h2>
        </div>

        <div className="mt-10 flex flex-col gap-3">
          {items.map((item, index) => {
            const isOpen = open === index;
            return (
              <div
                key={item.kind}
                className="overflow-hidden rounded-[1.1rem] border border-[rgba(47,91,70,0.28)] bg-[var(--color-ivory)]"
              >
                <button
                  type="button"
                  onClick={() => setOpen(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 px-6 py-5 text-left"
                >
                  <span
                    className="font-display text-[1.15rem] font-semibold text-[var(--color-ink-strong)]"
                    data-content-key={`field:sfideAccordion.items.${index}.label`}
                  >
                    {item.label}
                  </span>
                  <span
                    aria-hidden="true"
                    className={`text-[1.4rem] text-[var(--color-wine)] transition-transform duration-300 ${isOpen ? "rotate-45" : ""}`}
                  >
                    ＋
                  </span>
                </button>
                {isOpen ? (
                  <div className="border-t border-[rgba(47,91,70,0.18)] px-6 py-6">
                    <Panel item={item} index={index} email={email} />
                  </div>
                ) : null}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
