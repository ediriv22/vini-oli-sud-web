import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import Button from "@/components/ui/Button";
import { footerActions, footerNavigation } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="section-divider border-t border-[rgba(200,167,111,0.16)] bg-[linear-gradient(180deg,rgba(18,52,35,0.98),rgba(12,35,47,0.98))] text-[rgba(255,248,238,0.84)]">
      <div className="section-shell grid gap-10 py-12 lg:grid-cols-[1.1fr_0.72fr_0.98fr]">
        <div>
          <BrandLogo
            variant="horizontal"
            theme="light"
            className="max-w-[13.5rem] sm:max-w-[16.5rem] lg:max-w-[18.5rem]"
          />
          <p className="font-ui mt-5 text-[0.7rem] font-semibold uppercase tracking-[0.22em] text-[rgba(248,243,232,0.68)]">
            {siteConfig.brand.taglines.institutional}
          </p>
          <h2 className="mt-5 max-w-lg font-display text-[2.45rem] leading-[0.95] text-[var(--color-ivory)] sm:text-[2.8rem]">
            {siteConfig.brand.taglines.secondary}
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[rgba(255,248,238,0.72)]">
            {siteConfig.footerDescription}
          </p>
        </div>

        <div>
          <h3 className="font-ui text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)]">
            Menu rapido
          </h3>
          <ul className="mt-5 space-y-3 text-sm">
            {footerNavigation.map((item) => (
              <li key={item.href}>
                <Link href={item.href} className="hover:text-[var(--color-ivory)]">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        <div>
          <h3 className="font-ui text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)]">
            Azioni chiave
          </h3>
          <div className="mt-5 flex flex-col gap-3">
            {footerActions.map((action) => (
              <Button
                key={action.href}
                href={action.href}
                variant="ivory"
                className="justify-between bg-[rgba(248,243,232,0.96)]"
              >
                {action.label}
              </Button>
            ))}
          </div>
          <div className="mt-6 max-w-sm space-y-4 text-sm leading-7 text-[rgba(255,248,238,0.78)]">
            <div>
              <h4 className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[rgba(248,243,232,0.88)]">
                Contatto progetto
              </h4>
              <p className="mt-2">
                <Link
                  href={`mailto:${siteConfig.contact.projectEmail}`}
                  className="break-all text-[rgba(255,248,238,0.9)] underline decoration-[rgba(200,167,111,0.45)] underline-offset-2 hover:text-[var(--color-ivory)]"
                >
                  {siteConfig.contact.projectEmail}
                </Link>
              </p>
            </div>
            <div>
              <h4 className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[rgba(248,243,232,0.88)]">
                Organizzazione
              </h4>
              <p className="mt-2 text-[rgba(255,248,238,0.82)]">
                Vini Oli Sud — progetto a cura di{" "}
                <span className="text-[rgba(255,248,238,0.92)]">{siteConfig.organizer.legalName}</span>
              </p>
              <p className="mt-2 flex flex-wrap gap-x-2 gap-y-1">
                {siteConfig.organizer.phones.map((num) => (
                  <Link
                    key={num}
                    href={`tel:+39${num}`}
                    className="text-[rgba(255,248,238,0.88)] underline decoration-[rgba(200,167,111,0.4)] underline-offset-2 hover:text-[var(--color-ivory)]"
                  >
                    {num}
                  </Link>
                ))}
              </p>
              <p className="mt-2">
                <Link
                  href={`mailto:${siteConfig.organizer.email}`}
                  className="break-all text-[rgba(255,248,238,0.88)] underline decoration-[rgba(200,167,111,0.4)] underline-offset-2 hover:text-[var(--color-ivory)]"
                >
                  {siteConfig.organizer.email}
                </Link>
              </p>
              <p className="mt-2">
                <span className="font-ui text-[0.62rem] uppercase tracking-[0.12em] text-[rgba(248,243,232,0.55)]">
                  PEC{" "}
                </span>
                <Link
                  href={`mailto:${siteConfig.organizer.pec}`}
                  className="break-all text-[rgba(255,248,238,0.88)] underline decoration-[rgba(200,167,111,0.4)] underline-offset-2 hover:text-[var(--color-ivory)]"
                >
                  {siteConfig.organizer.pec}
                </Link>
              </p>
              <p className="mt-3 text-[0.8rem] leading-6 text-[rgba(255,248,238,0.65)]">
                P.IVA {siteConfig.organizer.vatId} · C.F. {siteConfig.organizer.fiscalCode}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="section-shell flex flex-col gap-3 border-t border-white/10 py-5 text-xs uppercase tracking-[0.12em] text-[rgba(255,248,238,0.58)] sm:flex-row sm:items-center sm:justify-between">
        <p>{siteConfig.legalLine}</p>
        <div className="flex gap-5">
          <Link href="/privacy" className="hover:text-[var(--color-ivory)]">
            Privacy
          </Link>
          <Link href="/cookie" className="hover:text-[var(--color-ivory)]">
            Cookie
          </Link>
        </div>
      </div>
    </footer>
  );
}
