import Image from "next/image";
import Link from "next/link";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

export default function HeroSection() {
  const { hero } = siteConfig;

  return (
    <section className="pt-12 pb-14 sm:pt-14 sm:pb-16 lg:pt-[72px] lg:pb-20">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.96fr_1.04fr] lg:items-center">
        <div>
          <p className="font-ui max-w-[780px] text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-wine)] sm:text-[0.8rem] lg:text-[0.9rem]">
            {hero.eyebrow}
          </p>
          <h1 className="display-balance mt-4 max-w-[780px] font-display text-[clamp(2.25rem,11vw,3.4rem)] leading-[1.02] tracking-[0.01em] text-[var(--color-grove)] sm:text-[clamp(2.8rem,6vw,4.8rem)] sm:leading-[0.98] lg:text-[clamp(3rem,5vw,5.75rem)] lg:leading-[0.96]">
            {hero.title}
          </h1>
          <p className="mt-5 max-w-[760px] text-[1rem] leading-[1.6] text-[var(--color-muted)] sm:text-[1.06rem] lg:text-[1.16rem]">
            {hero.subtitle}
          </p>

          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {hero.actions.slice(0, 2).map((action, index) => (
              <Button
                key={action.href}
                href={action.href}
                size="lg"
                className="w-auto"
                variant={index === 0 ? "primary" : "secondary"}
              >
                {action.label}
              </Button>
            ))}
          </div>
          <Link
            href={hero.actions[2]?.href ?? "/evento"}
            className="font-ui mt-4 inline-flex items-center gap-2 text-[0.82rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-grove)] transition-transform hover:translate-x-0.5 hover:text-[var(--color-wine)]"
          >
            {hero.actions[2]?.label}
            <span aria-hidden="true">→</span>
          </Link>
        </div>

        <figure
          className="panel relative min-h-[24rem] overflow-hidden rounded-[2.2rem] border-[rgba(19,41,61,0.08)] sm:min-h-[27rem] lg:min-h-[28rem]"
          aria-label="Video hero con vigneto mediterraneo e sfondo vulcanico"
        >
          <Image
            src="/videos/hero-vigneto-poster.jpg"
            alt=""
            fill
            sizes="(min-width: 1024px) 50vw, 100vw"
            className="absolute inset-0 h-full w-full object-cover"
          />
          <video
            className="absolute inset-0 h-full w-full object-cover motion-reduce:hidden"
            src="/videos/hero-vigneto.mp4"
            poster="/videos/hero-vigneto-poster.jpg"
            autoPlay
            muted
            loop
            playsInline
            preload="metadata"
            aria-hidden="true"
          />
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,167,111,0.14),transparent_26%),linear-gradient(140deg,rgba(11,31,21,0.16),rgba(17,35,26,0.3)_34%,rgba(20,27,26,0.44)_58%,rgba(43,20,24,0.5)_100%)]" />
          <div className="absolute inset-y-6 left-8 w-px bg-white/20" />
          <div className="absolute -right-10 top-10 h-44 w-44 rounded-full bg-[rgba(200,167,111,0.22)] blur-2xl" />
          <div className="absolute bottom-12 left-10 h-24 w-24 rounded-full border border-white/15 bg-[rgba(255,255,255,0.04)]" />
        </figure>
      </div>
    </section>
  );
}
