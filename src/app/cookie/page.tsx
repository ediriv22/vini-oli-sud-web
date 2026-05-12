import type { Metadata } from "next";
import { createPageMetadata } from "@/data/site";

export const metadata: Metadata = createPageMetadata(
  "Cookie",
  "Pagina placeholder cookie policy di Vini Oli Sud in attesa dei testi ufficiali.",
);

export default function CookiePage() {
  return (
    <section className="section-shell py-20">
      <div className="panel rounded-[2rem] p-8 sm:p-10">
        <p className="eyebrow">Placeholder legale</p>
        <h1 className="mt-4 font-display text-5xl leading-none text-[var(--color-sea)]">
          Cookie
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
          La cookie policy ufficiale non è ancora disponibile. Questa pagina
          placeholder evita link rotti e segnala la necessità di inserire i testi
          validati prima del go-live.
        </p>
      </div>
    </section>
  );
}
