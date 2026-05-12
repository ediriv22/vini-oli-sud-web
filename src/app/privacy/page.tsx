import type { Metadata } from "next";
import { createPageMetadata } from "@/data/site";

export const metadata: Metadata = createPageMetadata(
  "Privacy",
  "Pagina placeholder privacy di Vini Oli Sud in attesa dei testi ufficiali.",
);

export default function PrivacyPage() {
  return (
    <section className="section-shell py-20">
      <div className="panel rounded-[2rem] p-8 sm:p-10">
        <p className="eyebrow">Placeholder legale</p>
        <h1 className="mt-4 font-display text-5xl leading-none text-[var(--color-sea)]">
          Privacy
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
          I contenuti privacy ufficiali non sono ancora stati confermati. Questa
          pagina è predisposta come placeholder e dovrà essere sostituita con i
          testi approvati prima della pubblicazione.
        </p>
      </div>
    </section>
  );
}
