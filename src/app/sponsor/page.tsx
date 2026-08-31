"use client";

import { useState, type FormEvent } from "react";
import {
  CheckboxField,
  FormStatusBanner,
  Honeypot,
  TextField,
  TextareaField,
  submitLeadForm,
  type SubmitStatus,
} from "@/components/forms/FormFields";

/**
 * Pagina dedicata "Diventa Sponsor" — numeri di affluenza + modulo di
 * richiesta informazioni reale (invia a napoliracingshow@gmail.com via
 * /forms/lead.php, requestType=richiesta-sponsor). Prima il CTA "Richiedi
 * Informazioni" puntava solo a #contatti (nessun modulo): richiesta
 * esplicita di aprire un modulo compilabile, come su napoliracingshow.it.
 */
export default function SponsorPage() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setStatus("submitting");
    setErrorMessage(undefined);
    const result = await submitLeadForm(e.currentTarget);
    if (result.ok) {
      setStatus("success");
      e.currentTarget.reset();
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  }

  return (
    <section className="section-flow section-space">
      <div className="section-shell mx-auto max-w-[46rem] text-center">
        <p className="eyebrow text-center">Sponsor & Espositori</p>
        <h1 className="display-balance mt-4 font-display text-[clamp(2rem,4.4vw,2.9rem)] leading-[1.05] text-[var(--color-ink-strong)]">
          Diventa Sponsor
        </h1>

        <div className="mx-auto mt-8 grid max-w-[34rem] grid-cols-2 gap-5">
          <div className="rounded-[1.1rem] border border-[rgba(255,215,87,0.45)] bg-[rgba(255,253,245,0.7)] px-4 py-6">
            <p className="font-display text-[2rem] text-[var(--color-wine)]">65.000</p>
            <p className="font-ui mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Presenze nel 2024
            </p>
          </div>
          <div className="rounded-[1.1rem] border border-[rgba(255,215,87,0.45)] bg-[rgba(255,253,245,0.7)] px-4 py-6">
            <p className="font-display text-[2rem] text-[var(--color-wine)]">150.000</p>
            <p className="font-ui mt-1 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-muted)]">
              Presenze nel 2025
            </p>
          </div>
        </div>

        <p className="mx-auto mt-8 max-w-[52ch] text-[0.98rem] leading-[1.7] text-[var(--color-muted)]">
          Anche nel Villaggio &ldquo;Vini e Oli della Magna Grecia&rdquo;, accanto alla
          tendostruttura della Regione Campania – Assessorato all&rsquo;Agricoltura, è possibile
          prenotare stand espositivi, spazi promozionali, striscioni e altre opportunità di
          visibilità, con le stesse modalità e condizioni indicate nella Brochure Sponsorizzazioni
          del Napoli Racing Show.
        </p>
      </div>

      <form
        id="modulo"
        onSubmit={handleSubmit}
        className="section-shell mx-auto mt-14 flex max-w-[36rem] flex-col gap-5 rounded-[1.2rem] border border-[rgba(47,91,70,0.22)] bg-[var(--color-ivory)] p-6 shadow-[0_10px_28px_rgba(26,53,40,0.06)] sm:p-8"
      >
        <input type="hidden" name="requestType" value="richiesta-sponsor" />
        <Honeypot />

        <p className="font-ui text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]">
          Richiedi Informazioni
        </p>

        <TextField label="Nome" name="nome" required />
        <TextField label="Email" name="email" type="email" required />
        <TextField label="Telefono" name="telefono" type="tel" placeholder="333 1234567" />
        <TextareaField label="Messaggio" name="messaggio" required rows={5} />
        <CheckboxField name="privacy_consent" required>
          Ho letto e accetto la{" "}
          <a href="/social/privacy.html" className="underline">
            privacy policy
          </a>
          .
        </CheckboxField>

        <button
          type="submit"
          disabled={status === "submitting"}
          className="font-ui mt-2 inline-flex h-12 items-center justify-center gap-2 rounded-full bg-[var(--color-wine)] px-6 text-[0.92rem] font-semibold text-[var(--color-ivory)] transition-colors duration-300 ease-out hover:bg-[var(--color-wine-strong)] disabled:cursor-not-allowed disabled:opacity-60"
        >
          {status === "submitting" ? "Invio in corso…" : "✉️ Invia Messaggio"}
        </button>

        <FormStatusBanner
          status={status}
          errorMessage={errorMessage}
          successMessage="Richiesta inviata alla Segreteria Organizzativa. Ti risponderemo al più presto."
        />
      </form>
    </section>
  );
}
