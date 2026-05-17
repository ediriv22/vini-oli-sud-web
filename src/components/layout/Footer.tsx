import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import Button from "@/components/ui/Button";
import { footerActions, footerNavigation } from "@/data/navigation";
import { siteConfig } from "@/data/site";

/**
 * Footer editoriale su fondo avorio caldo.
 *
 * Direzione (post-audit):
 *  - Niente più h3/h4 in blu profondo (--color-grove): tutti i titoli
 *    sezione sono carbone caldo intenso (--color-ink-strong) con
 *    eyebrow oro per la gerarchia.
 *  - Hairline oro come unico segnale di "fine pagina".
 *  - Layout a 3 colonne larghe con respiro generoso, CTA secondaria
 *    "soft" anziché due primarie consecutive (era visivamente forte).
 *  - Touch target ≥ 44px sui link inline mobile.
 */
export default function Footer() {
  return (
    <footer className="relative bg-[var(--color-ivory)] text-[var(--color-ink)]">
      {/* Hairline oro: l'unico segnale di "fine pagina". */}
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(176,141,87,0.55)] to-transparent"
      />

      <div className="section-shell grid gap-14 py-16 sm:gap-16 sm:py-20 lg:grid-cols-[1.15fr_0.7fr_1.05fr] lg:gap-16 lg:py-24">
        <div>
          <BrandLogo variant="horizontal" />
          <p className="font-ui mt-8 text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-sand-strong)]">
            {siteConfig.brand.taglines.institutional}
          </p>
          <h2 className="mt-3 max-w-[22ch] font-display text-[clamp(1.85rem,3.2vw,2.4rem)] leading-[1.04] tracking-[0.005em] text-[var(--color-ink-strong)]">
            {siteConfig.brand.taglines.primary}
          </h2>
          <p className="mt-5 max-w-[44ch] text-[0.96rem] leading-[1.7] text-[var(--color-muted)]">
            {siteConfig.footerDescription}
          </p>
        </div>

        <div>
          <h3 className="font-ui text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-sand-strong)]">
            Menu rapido
          </h3>
          <ul className="mt-6 space-y-3.5 text-[0.96rem]">
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className="inline-flex min-h-[1.75rem] items-center text-[var(--color-ink-strong)] transition-colors duration-200 ease-out hover:text-[var(--color-wine)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(107,30,30,0.5)]"
                >
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-ui text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-sand-strong)]">
            Azioni chiave
          </h3>
          <div className="mt-6 flex flex-col gap-4">
            {footerActions.map((action, index) => (
              <Button
                key={action.href}
                href={action.href}
                size="md"
                variant={index === 0 ? "primary" : "soft"}
                className="w-full justify-center sm:w-auto sm:justify-start"
              >
                {action.label}
              </Button>
            ))}
          </div>

          <div className="mt-10 space-y-6 text-[0.94rem] leading-[1.7] text-[var(--color-muted)]">
            <div>
              <h4 className="font-ui text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-strong)]">
                Contatto progetto
              </h4>
              <p className="mt-2">
                <Link
                  href={`mailto:${siteConfig.contact.projectEmail}`}
                  className="break-all text-[var(--color-ink-strong)] underline decoration-[rgba(176,141,87,0.5)] decoration-1 underline-offset-[3px] transition-colors hover:text-[var(--color-wine)] hover:decoration-[var(--color-wine)]"
                >
                  {siteConfig.contact.projectEmail}
                </Link>
              </p>
            </div>
            <div>
              <h4 className="font-ui text-[0.66rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-ink-strong)]">
                Organizzazione
              </h4>
              <p className="mt-2 text-[var(--color-ink)]">
                Vini Oli Sud — progetto a cura di{" "}
                <span>{siteConfig.organizer.legalName}</span>
              </p>
              <p className="mt-2 flex flex-wrap gap-x-3 gap-y-1.5">
                {siteConfig.organizer.phones.map((num) => (
                  <Link
                    key={num}
                    href={`tel:+39${num}`}
                    className="text-[var(--color-ink)] underline decoration-[rgba(176,141,87,0.45)] decoration-1 underline-offset-[3px] transition-colors hover:text-[var(--color-wine)] hover:decoration-[var(--color-wine)]"
                  >
                    {num}
                  </Link>
                ))}
              </p>
              <p className="mt-2">
                <Link
                  href={`mailto:${siteConfig.organizer.email}`}
                  className="break-all text-[var(--color-ink)] underline decoration-[rgba(176,141,87,0.45)] decoration-1 underline-offset-[3px] transition-colors hover:text-[var(--color-wine)] hover:decoration-[var(--color-wine)]"
                >
                  {siteConfig.organizer.email}
                </Link>
              </p>
              <p className="mt-2">
                <span className="font-ui mr-1 text-[0.62rem] uppercase tracking-[0.14em] text-[var(--color-muted)]">
                  PEC
                </span>
                <Link
                  href={`mailto:${siteConfig.organizer.pec}`}
                  className="break-all text-[var(--color-ink)] underline decoration-[rgba(176,141,87,0.45)] decoration-1 underline-offset-[3px] transition-colors hover:text-[var(--color-wine)] hover:decoration-[var(--color-wine)]"
                >
                  {siteConfig.organizer.pec}
                </Link>
              </p>
              <p className="mt-4 text-[0.8rem] leading-[1.7] text-[var(--color-muted)]">
                P.IVA {siteConfig.organizer.vatId} · C.F.{" "}
                {siteConfig.organizer.fiscalCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-shell flex flex-col gap-3 border-t border-[rgba(176,141,87,0.22)] py-6 text-[0.74rem] uppercase tracking-[0.12em] text-[var(--color-muted)] sm:flex-row sm:items-center sm:justify-between">
        <p>{siteConfig.legalLine}</p>
        <div className="flex gap-6">
          <Link
            href="/privacy"
            className="min-h-[1.75rem] hover:text-[var(--color-wine)]"
          >
            Privacy
          </Link>
          <Link
            href="/cookie"
            className="min-h-[1.75rem] hover:text-[var(--color-wine)]"
          >
            Cookie
          </Link>
        </div>
      </div>
    </footer>
  );
}
