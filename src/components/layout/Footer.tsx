import BrandLogo from "@/components/ui/BrandLogo";
import { footerNavigation } from "@/data/navigation";
import { siteConfig } from "@/data/site";

/**
 * Footer a 3 colonne su fondo oro, coerente con l'accento oro usato altrove
 * (CTA pill, hairline): 1) wordmark + tagline, 2) "Esplora" (ancore) +
 * "Contatti" (recapiti reali dell'organizzatore, non il placeholder del
 * demo), 3) partner istituzionale. I link /social/*.html restano invariati
 * (compliance TikTok Developer review), i link /privacy e /cookie sono
 * rimossi con le relative pagine.
 */
export default function Footer() {
  return (
    <footer id="contatti" className="relative bg-[var(--color-sand)] text-[var(--color-ink)]">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(26,53,40,0.35)] to-transparent"
      />

      <div className="section-shell grid gap-12 py-14 sm:gap-14 sm:py-18 md:grid-cols-2 md:gap-14 lg:grid-cols-[1.1fr_0.8fr_1fr] lg:gap-16 lg:py-20">
        <div>
          <BrandLogo variant="horizontal" theme="default" />
          <p className="mt-6 max-w-[42ch] text-[0.96rem] leading-[1.7] text-[rgba(26,53,40,0.8)]">
            {siteConfig.footerDescription}
          </p>
        </div>

        <div>
          <h3 className="font-ui text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-grove)]">
            Esplora
          </h3>
          <ul className="mt-6 space-y-3.5 text-[0.96rem]">
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-[1.75rem] items-center text-[var(--color-ink-strong)] transition-colors duration-200 ease-out hover:text-[var(--color-wine)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>

          <h3 className="mt-9 font-ui text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-grove)]">
            Contatti
          </h3>
          <div className="mt-5 space-y-3 text-[0.94rem] leading-[1.65] text-[rgba(26,53,40,0.85)]">
            <p>{siteConfig.organizer.legalName}</p>
            <p className="flex flex-wrap gap-x-3 gap-y-1.5">
              {siteConfig.organizer.phones.map((num) => (
                <a
                  key={num}
                  href={`tel:+39${num}`}
                  className="underline decoration-[rgba(26,53,40,0.4)] decoration-1 underline-offset-[3px] hover:text-[var(--color-wine)]"
                >
                  {num}
                </a>
              ))}
            </p>
            <p>
              <a
                href={`mailto:${siteConfig.organizer.email}`}
                className="break-all underline decoration-[rgba(26,53,40,0.4)] decoration-1 underline-offset-[3px] hover:text-[var(--color-wine)]"
              >
                {siteConfig.organizer.email}
              </a>
            </p>
            <p>
              <span className="font-ui mr-1 text-[0.62rem] uppercase tracking-[0.14em] text-[rgba(26,53,40,0.65)]">
                PEC
              </span>
              <a
                href={`mailto:${siteConfig.organizer.pec}`}
                className="break-all underline decoration-[rgba(26,53,40,0.4)] decoration-1 underline-offset-[3px] hover:text-[var(--color-wine)]"
              >
                {siteConfig.organizer.pec}
              </a>
            </p>
            <p className="text-[0.8rem] text-[rgba(26,53,40,0.65)]">
              P.IVA {siteConfig.organizer.vatId} · C.F. {siteConfig.organizer.fiscalCode}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-ui text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-grove)]">
            Partner Istituzionale
          </h3>
          <p className="mt-6 max-w-[36ch] text-[0.96rem] leading-[1.7] text-[rgba(26,53,40,0.85)]">
            Con il patrocinio e la collaborazione dell&rsquo;Assessorato
            all&rsquo;Agricoltura della Regione Campania.
          </p>
        </div>
      </div>

      <div className="section-shell flex flex-col gap-3 border-t border-[rgba(26,53,40,0.22)] py-6 text-[0.74rem] uppercase tracking-[0.12em] text-[rgba(26,53,40,0.7)] sm:flex-row sm:items-center sm:justify-between">
        <p>{siteConfig.legalLine}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {/* Link richiesti dalla TikTok Developer review: devono restare
              invariati e puntare alle pagine registrate nel portale TikTok. */}
          <a
            href="/social/privacy.html"
            className="min-h-[1.75rem] hover:text-[var(--color-wine)]"
          >
            Privacy Policy
          </a>
          <a
            href="/social/terms.html"
            className="min-h-[1.75rem] hover:text-[var(--color-wine)]"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
