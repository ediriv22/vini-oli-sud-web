import BrandLogo from "@/components/ui/BrandLogo";
import { footerNavigation } from "@/data/navigation";
import { siteConfig } from "@/data/site";

/**
 * Footer a 4 colonne su fondo verde scuro, replica esatta del demo cliente
 * (verificato via DOM sulla demo live: 4 heading colonna separati — Vini &
 * OliSud / Esplora / Contatti / Partner Istituzionale — non "Esplora" e
 * "Contatti" impilati nella stessa colonna). I link /social/*.html restano
 * invariati (compliance TikTok Developer review), i link /privacy e /cookie
 * sono rimossi con le relative pagine.
 */
export default function Footer() {
  return (
    <footer id="contatti" className="relative bg-[var(--color-grove)] text-[rgba(255,253,245,0.88)]">
      <span
        aria-hidden="true"
        className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-[rgba(255,215,87,0.45)] to-transparent"
      />

      <div className="section-shell grid gap-12 py-14 sm:gap-14 sm:py-18 md:grid-cols-2 md:gap-14 lg:grid-cols-[1fr_0.75fr_0.85fr_0.85fr] lg:gap-10 lg:py-20">
        <div>
          <BrandLogo variant="horizontal" theme="light" />
          <p className="mt-6 max-w-[42ch] text-[0.96rem] leading-[1.7] text-[rgba(255,253,245,0.78)]">
            {siteConfig.footerDescription}
          </p>
        </div>

        <div>
          <h3 className="font-ui text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-sand)]">
            Esplora
          </h3>
          <ul className="mt-6 space-y-3.5 text-[0.96rem]">
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <a
                  href={item.href}
                  className="inline-flex min-h-[1.75rem] items-center text-[rgba(255,253,245,0.9)] transition-colors duration-200 ease-out hover:text-[var(--color-sand)]"
                >
                  {item.label}
                </a>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-ui text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-sand)]">
            Contatti
          </h3>
          <div className="mt-6 space-y-3 text-[0.94rem] leading-[1.65] text-[rgba(255,253,245,0.85)]">
            <p>{siteConfig.organizer.legalName}</p>
            <p className="flex flex-wrap gap-x-3 gap-y-1.5">
              {siteConfig.organizer.phones.map((num) => (
                <a
                  key={num}
                  href={`tel:+39${num}`}
                  className="underline decoration-[rgba(255,215,87,0.5)] decoration-1 underline-offset-[3px] hover:text-[var(--color-sand)]"
                >
                  {num}
                </a>
              ))}
            </p>
            <p>
              <a
                href={`mailto:${siteConfig.organizer.email}`}
                className="break-all underline decoration-[rgba(255,215,87,0.5)] decoration-1 underline-offset-[3px] hover:text-[var(--color-sand)]"
              >
                {siteConfig.organizer.email}
              </a>
            </p>
            <p>
              <span className="font-ui mr-1 text-[0.62rem] uppercase tracking-[0.14em] text-[rgba(255,253,245,0.6)]">
                PEC
              </span>
              <a
                href={`mailto:${siteConfig.organizer.pec}`}
                className="break-all underline decoration-[rgba(255,215,87,0.5)] decoration-1 underline-offset-[3px] hover:text-[var(--color-sand)]"
              >
                {siteConfig.organizer.pec}
              </a>
            </p>
            <p className="text-[0.8rem] text-[rgba(255,253,245,0.6)]">
              P.IVA {siteConfig.organizer.vatId} · C.F. {siteConfig.organizer.fiscalCode}
            </p>
          </div>
        </div>

        <div>
          <h3 className="font-ui text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-sand)]">
            Partner Istituzionale
          </h3>
          <p className="mt-6 max-w-[36ch] text-[0.96rem] leading-[1.7] text-[rgba(255,253,245,0.85)]">
            Con il patrocinio e la collaborazione dell&rsquo;Assessorato
            all&rsquo;Agricoltura della Regione Campania.
          </p>
        </div>
      </div>

      <div className="section-shell flex flex-col gap-3 border-t border-[rgba(255,215,87,0.22)] py-6 text-[0.74rem] uppercase tracking-[0.12em] text-[rgba(255,253,245,0.65)] sm:flex-row sm:items-center sm:justify-between">
        <p>{siteConfig.legalLine}</p>
        <div className="flex flex-wrap gap-x-6 gap-y-2">
          {/* Link richiesti dalla TikTok Developer review: devono restare
              invariati e puntare alle pagine registrate nel portale TikTok. */}
          <a
            href="/social/privacy.html"
            className="min-h-[1.75rem] hover:text-[var(--color-sand)]"
          >
            Privacy Policy
          </a>
          <a
            href="/social/terms.html"
            className="min-h-[1.75rem] hover:text-[var(--color-sand)]"
          >
            Terms of Service
          </a>
        </div>
      </div>
    </footer>
  );
}
