import Link from "next/link";
import BrandLogo from "@/components/ui/BrandLogo";
import Button from "@/components/ui/Button";
import { footerActions, footerNavigation } from "@/data/navigation";
import { siteConfig } from "@/data/site";

export default function Footer() {
  return (
    <footer className="section-divider border-t border-[rgba(200,167,111,0.16)] bg-[linear-gradient(180deg,rgba(18,52,35,0.98),rgba(12,35,47,0.98))] text-[rgba(255,248,238,0.84)]">
      <div className="section-shell grid gap-12 py-14 lg:grid-cols-[1.1fr_0.7fr_1fr]">
        <div>
          <BrandLogo variant="footer" theme="light" />
          <h2 className="mt-6 font-display text-4xl leading-none text-[var(--color-ivory)]">
            Boutique mediterranea tra terroir, business e racconto.
          </h2>
          <p className="mt-5 max-w-xl text-sm leading-7 text-[rgba(255,248,238,0.72)]">
            {siteConfig.footerDescription}
          </p>
        </div>

        <div>
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)]">
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
          <h3 className="text-sm font-semibold uppercase tracking-[0.14em] text-[var(--color-ivory)]">
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
          <div className="mt-6 space-y-2 text-sm text-[rgba(255,248,238,0.72)]">
            <p>Email: {siteConfig.contact.email}</p>
            <p>Telefono: {siteConfig.contact.phone}</p>
            <p>Sede operativa: {siteConfig.contact.address}</p>
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
