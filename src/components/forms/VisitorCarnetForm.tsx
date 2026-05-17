"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";

const QUANTITY_OPTIONS = [
  { value: "1", label: "1 ingresso" },
  { value: "2", label: "2 ingressi" },
  { value: "3", label: "3 ingressi" },
  { value: "4", label: "4 ingressi" },
  { value: "5+", label: "5 o più" },
] as const;

type SubmitStatus = "idle" | "submitting" | "success";

type LeadResponse = {
  ok?: boolean;
  error?: string;
  requestId?: string;
};

export default function VisitorCarnetForm() {
  const formId = useId();
  const [quantity, setQuantity] = useState<string>(QUANTITY_OPTIONS[0].value);
  const [email, setEmail] = useState<string>("");
  const [privacy, setPrivacy] = useState<boolean>(false);
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string>("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (status === "submitting") return;
    setErrorMessage("");
    setStatus("submitting");

    const payload = new FormData(event.currentTarget);

    try {
      const response = await fetch("/forms/lead.php", {
        method: "POST",
        body: payload,
      });
      let data: LeadResponse = {};
      try {
        data = (await response.json()) as LeadResponse;
      } catch {
        data = {};
      }
      if (response.ok && data.ok) {
        setStatus("success");
        return;
      }
      setStatus("idle");
      setErrorMessage(
        data.error ?? "Invio non riuscito. Riprova più tardi.",
      );
    } catch {
      setStatus("idle");
      setErrorMessage(
        "Impossibile contattare il server. Controlla la connessione e riprova.",
      );
    }
  }

  const inputBase =
    "mt-2 w-full min-h-[3rem] rounded-[0.6rem] border border-[rgba(176,141,87,0.5)] bg-white/90 px-4 py-3 text-[1rem] leading-[1.4] text-[var(--color-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-[rgba(112,97,92,0.6)] motion-reduce:transition-none focus:border-[rgba(107,30,30,0.6)] focus:bg-white focus:outline-none focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_0_0_3px_rgba(107,30,30,0.14)] focus:ring-0";

  const labelBase =
    "font-ui block text-[0.78rem] font-semibold uppercase tracking-[0.14em] leading-tight text-[var(--color-ink-strong)]";

  const helperBase =
    "mt-1.5 text-[0.86rem] leading-[1.55] text-[var(--color-muted)]";

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[1.1rem] border border-[rgba(176,141,87,0.32)] bg-[rgba(252,247,238,0.95)] px-6 py-8 text-center shadow-[0_8px_22px_rgba(42,32,23,0.05)]"
      >
        <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-sand-strong)]">
          Richiesta ricevuta
        </p>
        <h3 className="mt-3 font-display text-[1.75rem] leading-[1.12] tracking-[0.005em] text-[var(--color-ink-strong)] sm:text-[2rem]">
          Grazie, ti abbiamo segnato.
        </h3>
        <p className="mx-auto mt-4 max-w-[46ch] text-[0.98rem] leading-[1.65] text-[var(--color-muted)]">
          Abbiamo ricevuto la tua richiesta. Ti aggiorneremo via email su
          disponibilità, carnet degustazione e modalità di accesso.
        </p>
      </div>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      aria-describedby={`${formId}-microcopy`}
      className="grid gap-6"
    >
      <input type="hidden" name="audience" value="visitatori" />
      <input type="hidden" name="requestType" value="carnet-degustazione" />
      {/* Honeypot anti-bot: invisibile, non focusabile, ignorato dal PHP se compilato. */}
      <div aria-hidden="true" className="absolute left-[-9999px] h-0 w-0 overflow-hidden">
        <label htmlFor={`${formId}-website-url`}>Lascia vuoto</label>
        <input
          id={`${formId}-website-url`}
          type="text"
          name="website_url"
          tabIndex={-1}
          autoComplete="off"
        />
      </div>

      <div>
        <label htmlFor={`${formId}-quantity`} className={labelBase}>
          Quanti ingressi desideri?
        </label>
        <p className={helperBase}>
          Scegli quanti carnet degustazione vuoi prenotare.
        </p>
        <select
          id={`${formId}-quantity`}
          name="quantity"
          value={quantity}
          onChange={(event) => setQuantity(event.target.value)}
          required
          className={`${inputBase} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
          style={{
            backgroundImage:
              "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%237a2634' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
          }}
        >
          {QUANTITY_OPTIONS.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label htmlFor={`${formId}-email`} className={labelBase}>
          La tua email
        </label>
        <p className={helperBase}>
          Useremo questa email solo per aggiornarti sull’accesso all’esperienza.
        </p>
        <input
          id={`${formId}-email`}
          name="email"
          type="email"
          autoComplete="email"
          required
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="nome@email.it"
          className={inputBase}
        />
      </div>

      <label className="flex items-start gap-3 text-[0.94rem] leading-[1.6] text-[var(--color-muted)]">
        <input
          type="checkbox"
          name="privacy_consent"
          required
          checked={privacy}
          onChange={(event) => setPrivacy(event.target.checked)}
          className="mt-1 h-[1.1rem] w-[1.1rem] flex-shrink-0 cursor-pointer rounded-[0.25rem] border-2 border-[rgba(176,141,87,0.45)] bg-white accent-[var(--color-wine)] checked:border-[var(--color-wine)] checked:bg-[var(--color-wine)] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[rgba(107,30,30,0.5)]"
        />
        <span>
          Accetto il trattamento dei dati come descritto nella{" "}
          <Link
            href="/privacy"
            className="text-[var(--color-ink-strong)] underline decoration-[rgba(176,141,87,0.45)] underline-offset-[3px] hover:decoration-[var(--color-wine)]"
          >
            privacy policy
          </Link>
          .
        </span>
      </label>

      {errorMessage ? (
        <p
          role="alert"
          className="font-ui rounded-[0.8rem] border border-[rgba(122,38,52,0.3)] bg-[rgba(252,243,243,0.9)] px-4 py-2 text-[0.88rem] text-[var(--color-wine)]"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="flex flex-col gap-3 pt-1 sm:flex-row sm:items-center sm:justify-between">
        <p
          id={`${formId}-microcopy`}
          className="font-ui text-[0.78rem] leading-relaxed text-[var(--color-muted)]"
        >
          Nessun pagamento viene richiesto in questa fase.
        </p>
        <Button
          type="submit"
          size="lg"
          className="w-full sm:w-auto"
          disabled={status === "submitting"}
          aria-disabled={status === "submitting"}
        >
          {status === "submitting" ? "Invio in corso…" : "Richiedi il Carnet Degustazione"}
        </Button>
      </div>
    </form>
  );
}
