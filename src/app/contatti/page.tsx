import type { Metadata } from "next";
import { Suspense, type ReactNode } from "react";
import Link from "next/link";
import LeadMiniForm from "@/components/sections/LeadMiniForm";
import { createPageMetadata, siteConfig } from "@/data/site";

const { contact, organizer } = siteConfig;

export const metadata: Metadata = createPageMetadata(
  "Contatti",
  "Contatti ufficiali di Vini Oli Sud: richieste commerciali, accrediti, partnership e comunicazioni stampa.",
);

function ContactRow({
  label,
  children,
}: {
  label: string;
  children: ReactNode;
}) {
  return (
    <div className="border-b border-[var(--color-line)] py-3 last:border-b-0">
      <p className="font-ui text-[0.68rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-wine)]">
        {label}
      </p>
      <div className="mt-1.5 text-[0.98rem] leading-relaxed text-[var(--color-ink)]">{children}</div>
    </div>
  );
}

export default function ContattiPage() {
  return (
    <section className="section-space-lg">
      <div className="section-shell max-w-3xl">
        <p className="eyebrow">Contatti</p>
        <h1 className="mt-4 font-display text-[2.75rem] leading-[0.98] text-[var(--color-grove)] sm:text-[3.35rem]">
          Contatti
        </h1>
        <p className="mt-6 max-w-[52ch] text-[1.05rem] leading-[1.68] text-[var(--color-muted)]">
          Per informazioni commerciali, accrediti, partnership e richieste stampa, puoi compilare il
          modulo qui sotto o scrivere direttamente alla segreteria del progetto.
        </p>

        <div className="mt-10 grid gap-6">
          <div
            id="richiesta-informazioni"
            className="panel rounded-[2rem] p-6 sm:p-8 scroll-mt-28"
          >
            <p className="eyebrow">Richiedi informazioni</p>
            <h2 className="mt-3 font-display text-[1.85rem] leading-[1.05] text-[var(--color-grove)] sm:text-[2.15rem]">
              Manifesta interesse al progetto Vini Oli Sud.
            </h2>
            <p className="mt-3 text-[0.98rem] leading-relaxed text-[var(--color-muted)]">
              Indica l’area di interesse e raccontaci brevemente il tuo profilo. La segreteria
              ricontatta i profili in linea con il progetto.
            </p>
            <div className="mt-6">
              <Suspense fallback={null}>
                <LeadMiniForm />
              </Suspense>
            </div>
          </div>

          <div className="panel rounded-[2rem] p-6 sm:p-8">
            <h2 className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-wine)]">
              Contatto principale Vini Oli Sud
            </h2>
            <p className="mt-4 font-display text-[1.65rem] text-[var(--color-grove)] sm:text-[1.85rem]">
              <Link
                href={`mailto:${contact.projectEmail}`}
                className="text-[var(--color-grove)] underline decoration-[rgba(200,167,111,0.45)] decoration-1 underline-offset-[0.22em] transition-colors hover:decoration-[var(--color-wine)]"
              >
                {contact.projectEmail}
              </Link>
            </p>
          </div>

          <div className="panel rounded-[2rem] p-6 sm:p-8">
            <h2 className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-wine)]">
              Segreteria organizzativa
            </h2>
            <div className="mt-5">
              <ContactRow label="Organizzazione">{organizer.legalName}</ContactRow>
              <ContactRow label="Telefono">
                <span className="flex flex-wrap gap-x-3 gap-y-1">
                  {organizer.phones.map((num) => (
                    <Link
                      key={num}
                      href={`tel:+39${num.replace(/\s/g, "")}`}
                      className="text-[var(--color-grove)] underline decoration-[rgba(200,167,111,0.4)] underline-offset-[0.2em] hover:decoration-[var(--color-wine)]"
                    >
                      {num}
                    </Link>
                  ))}
                </span>
              </ContactRow>
              <ContactRow label="Email">
                <Link
                  href={`mailto:${organizer.email}`}
                  className="text-[var(--color-grove)] underline decoration-[rgba(200,167,111,0.4)] underline-offset-[0.2em] hover:decoration-[var(--color-wine)]"
                >
                  {organizer.email}
                </Link>
              </ContactRow>
              <ContactRow label="PEC">
                <Link
                  href={`mailto:${organizer.pec}`}
                  className="text-[var(--color-grove)] underline decoration-[rgba(200,167,111,0.4)] underline-offset-[0.2em] hover:decoration-[var(--color-wine)]"
                >
                  {organizer.pec}
                </Link>
              </ContactRow>
            </div>
          </div>

          <div className="panel rounded-[2rem] p-6 sm:p-8">
            <h2 className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.18em] text-[var(--color-wine)]">
              Dati societari
            </h2>
            <div className="mt-5">
              <ContactRow label="Partita IVA">{organizer.vatId}</ContactRow>
              <ContactRow label="Codice fiscale">{organizer.fiscalCode}</ContactRow>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
