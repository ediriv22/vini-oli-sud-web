import type { Metadata } from "next";
import { createPageMetadata } from "@/data/site";

export const metadata: Metadata = createPageMetadata(
  "Cookie",
  "Cookie policy di Vini Oli Sud in aggiornamento.",
);

export default function CookiePage() {
  return (
    <section className="section-shell py-20">
      <div className="panel rounded-[2rem] p-8 sm:p-10">
        <p className="eyebrow">Informativa legale</p>
        <h1 className="mt-4 font-display text-5xl leading-none text-[var(--color-sea)]">
          Cookie
        </h1>
        <p className="mt-6 max-w-3xl text-base leading-8 text-[var(--color-muted)]">
          La cookie policy ufficiale è in aggiornamento. La pagina evita link
          rotti durante la fase demo pubblica e sarà completata con i testi
          validati non appena disponibili.
        </p>
      </div>
    </section>
  );
}
