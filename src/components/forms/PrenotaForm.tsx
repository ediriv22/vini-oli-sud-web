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
import { SCALETTA } from "@/data/prenota";
import { track } from "@/lib/track";

/**
 * Modulo di prenotazione gratuita alle degustazioni. Invia a
 * napoliracingshow@gmail.com via /forms/lead.php (requestType=prenotazione-degustazione).
 * Le degustazioni partono come testo ("Venerdì 27 novembre, 13:00 — Pasta Cuomo"),
 * cosi' la mail alla segreteria e' leggibile senza decodifiche.
 */
export default function PrenotaForm() {
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = e.currentTarget;
    if (form.querySelectorAll('input[name="degustazioni[]"]:checked').length === 0) {
      setStatus("error");
      setErrorMessage("Scegli almeno una degustazione.");
      return;
    }
    setStatus("submitting");
    setErrorMessage(undefined);
    const result = await submitLeadForm(form);
    if (result.ok) {
      setStatus("success");
      track("SubmitForm", { content_name: "Prenotazione degustazione" });
      form.reset();
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="section-shell mx-auto mt-10 flex max-w-[40rem] flex-col gap-6 rounded-[1.2rem] border border-[rgba(47,91,70,0.22)] bg-[var(--color-ivory)] p-6 shadow-[0_10px_28px_rgba(26,53,40,0.06)] sm:p-8"
    >
      <input type="hidden" name="requestType" value="prenotazione-degustazione" />
      <Honeypot />

      <fieldset className="flex flex-col gap-5 border-0 p-0">
        <legend className="font-ui mb-1 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]">
          1. Scegli le degustazioni
        </legend>
        {SCALETTA.map(({ giorno, slot }) => (
          <div key={giorno} className="flex flex-col gap-2">
            <p className="font-ui text-[0.82rem] font-semibold text-[var(--color-ink-strong)]">{giorno}</p>
            {slot.map((s) => (
              <label
                key={giorno + s.ora}
                className="flex cursor-pointer items-start gap-3 rounded-[0.8rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.7)] px-4 py-3 text-left transition-colors duration-200 has-[:checked]:border-[var(--color-wine)] has-[:checked]:bg-[rgba(255,215,87,0.18)]"
              >
                <input
                  type="checkbox"
                  name="degustazioni[]"
                  value={`${giorno}, ${s.ora} — ${s.nome}`}
                  className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-wine)]"
                />
                <span className="text-[0.94rem] leading-[1.45] text-[var(--color-ink-strong)]">
                  <span className="font-ui mr-2 font-semibold text-[var(--color-wine)]">{s.ora}</span>
                  {s.nome}
                </span>
              </label>
            ))}
          </div>
        ))}
      </fieldset>

      <fieldset className="flex flex-col gap-5 border-0 p-0">
        <legend className="font-ui mb-3 text-[0.78rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]">
          2. I tuoi dati
        </legend>
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Nome" name="nome" required autoComplete="given-name" />
          <TextField label="Cognome" name="cognome" required autoComplete="family-name" />
        </div>
        <TextField label="Email" name="email" type="email" required autoComplete="email" />
        <div className="grid gap-5 sm:grid-cols-2">
          <TextField label="Telefono" name="telefono" type="tel" placeholder="333 1234567" autoComplete="tel" />
          <TextField
            label="Numero di persone"
            name="persone"
            type="number"
            min={1}
            max={10}
            defaultValue={1}
            required
            hint="Te compreso, da 1 a 10."
          />
        </div>
        <TextareaField label="Note" name="note" rows={3} hint="Allergie, intolleranze o richieste per la Segreteria (facoltativo)." />
      </fieldset>

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
        className="font-ui inline-flex h-12 items-center justify-center rounded-full bg-[var(--color-wine)] px-6 text-[0.92rem] font-semibold text-[var(--color-ivory)] transition-all duration-300 ease-out hover:bg-[var(--color-wine-strong)] active:scale-[0.98] disabled:cursor-not-allowed disabled:opacity-60"
      >
        {status === "submitting" ? "Invio in corso…" : "Prenota gratis"}
      </button>

      <FormStatusBanner
        status={status}
        errorMessage={errorMessage}
        successMessage="Prenotazione ricevuta: ti abbiamo scritto una mail con il tuo codice. La Segreteria verifica i posti e ti conferma via email."
      />
    </form>
  );
}
