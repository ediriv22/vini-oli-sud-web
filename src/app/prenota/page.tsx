import PrenotaForm from "@/components/forms/PrenotaForm";
import { createPageMetadata } from "@/data/site";

export const metadata = createPageMetadata(
  "Prenota la tua degustazione",
  "Scegli le presentazioni con degustazione del Villaggio Vini e Oli della Magna Grecia e prenota gratis il tuo posto (27-29 novembre 2026, Rotonda Diaz, Napoli).",
);

export default function PrenotaPage() {
  return (
    <section className="section-flow section-space">
      <div className="section-shell mx-auto max-w-[42rem] text-center">
        <p className="eyebrow text-center">27 · 28 · 29 Novembre 2026 · Rotonda Diaz, Napoli</p>
        <h1 className="display-balance mt-4 font-display text-[clamp(2rem,4.4vw,2.9rem)] leading-[1.05] text-[var(--color-ink-strong)]">
          Prenota la tua degustazione
        </h1>
        <p className="mx-auto mt-5 max-w-[48ch] text-[0.98rem] leading-[1.7] text-[var(--color-muted)]">
          L&rsquo;ingresso al Villaggio è gratuito. Scegli una o più presentazioni con degustazione:
          la partecipazione è gratuita per i primi 60 iscritti. Riceverai una mail di conferma dalla
          Segreteria Organizzativa.
        </p>
      </div>
      <PrenotaForm />
    </section>
  );
}
