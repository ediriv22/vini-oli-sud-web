import Image from "next/image";
import Button from "@/components/ui/Button";
import { siteConfig } from "@/data/site";

export default function HeroSection() {
  const { hero } = siteConfig;

  return (
    <section className="section-space-lg">
      <div className="section-shell grid gap-12 lg:grid-cols-[1.04fr_0.96fr] lg:items-center">
        <div>
          <p className="eyebrow">{hero.eyebrow}</p>
          <h1 className="display-balance mt-5 max-w-3xl font-display text-[3.45rem] leading-[0.9] text-[var(--color-sea)] sm:text-[4.9rem]">
            {hero.title}
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-[var(--color-muted)] sm:text-xl">
            {hero.subtitle}
          </p>

          <div className="mt-9 flex flex-col gap-3 sm:flex-row sm:flex-wrap">
            {hero.actions.map((action, index) => (
              <Button
                key={action.href}
                href={action.href}
                size="lg"
                className="w-full sm:w-auto"
                variant={index === 0 ? "primary" : index === 1 ? "secondary" : "ghost"}
              >
                {action.label}
              </Button>
            ))}
          </div>

          <div className="mt-12 grid gap-4 sm:grid-cols-3">
            {hero.signals.map((signal) => (
              <div key={signal.label} className="panel rounded-[1.6rem] p-4 sm:p-5">
                <p className="text-xs font-semibold uppercase tracking-[0.16em] text-[var(--color-wine)]">
                  {signal.label}
                </p>
                <p className="mt-3 text-sm leading-6 text-[var(--color-muted)]">
                  {signal.value}
                </p>
              </div>
            ))}
          </div>
        </div>

        <figure
          className="panel relative overflow-hidden rounded-[2.2rem] border-[rgba(19,41,61,0.08)] p-6 sm:p-8"
          role="img"
          aria-label="Placeholder editoriale elegante con luce dorata mediterranea, calici, ulivi e silhouette della pista"
        >
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_left,rgba(200,167,111,0.28),transparent_30%),linear-gradient(135deg,rgba(19,41,61,0.96),rgba(34,57,79,0.9)_38%,rgba(122,38,52,0.88)_100%)]" />
          <div className="absolute inset-y-6 left-8 w-px bg-white/20" />
          <div className="absolute -right-10 top-10 h-44 w-44 rounded-full bg-[rgba(200,167,111,0.22)] blur-2xl" />
          <div className="absolute bottom-12 left-10 h-24 w-24 rounded-full border border-white/15 bg-[rgba(255,255,255,0.04)]" />
          <Image
            src="/images/hero-placeholder.svg"
            alt=""
            width={960}
            height={760}
            unoptimized
            className="absolute bottom-0 right-0 h-auto w-[72%] max-w-[26rem] opacity-55"
          />

          <div className="relative z-10 flex min-h-[30rem] flex-col justify-between text-[var(--color-ivory)]">
            <div className="max-w-sm">
              <p className="text-xs font-semibold uppercase tracking-[0.18em] text-[rgba(248,243,232,0.72)]">
                Placeholder Visual
              </p>
              <p className="mt-4 font-display text-4xl leading-none sm:text-[2.9rem]">
                Luce dorata, terra viva, adrenalina sul mare.
              </p>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.16em] text-[rgba(248,243,232,0.72)]">
                  Atmosfera
                </p>
                <p className="mt-2 text-sm leading-6">
                  Un linguaggio visivo caldo, mediterraneo e non fieristico.
                </p>
              </div>
              <div className="rounded-[1.5rem] border border-white/10 bg-white/6 p-4 backdrop-blur-sm">
                <p className="text-xs uppercase tracking-[0.16em] text-[rgba(248,243,232,0.72)]">
                  Intento
                </p>
                <p className="mt-2 text-sm leading-6">
                  Convertire pubblico e operatori in lead, relazioni e reputazione.
                </p>
              </div>
            </div>
          </div>
        </figure>
      </div>
    </section>
  );
}
