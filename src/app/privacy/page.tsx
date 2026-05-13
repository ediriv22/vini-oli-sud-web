import type { Metadata } from "next";
import { createPageMetadata } from "@/data/site";

export const metadata: Metadata = createPageMetadata(
  "Privacy",
  "Informativa privacy di Vini Oli Sud in aggiornamento.",
);

export default function PrivacyPage() {
  return (
    <section className="section-shell py-20">
      <div className="panel rounded-[2rem] p-8 sm:p-10">
        <p className="eyebrow">Informativa legale</p>
        <h1 className="mt-4 font-display text-5xl leading-none text-[var(--color-sea)]">
          Privacy
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
          I contenuti privacy ufficiali sono in aggiornamento. La pagina resta
          pubblicata per garantire continuità di navigazione e sarà completata
          con i testi approvati non appena disponibili.
        </p>
      </div>
    </section>
  );
}
