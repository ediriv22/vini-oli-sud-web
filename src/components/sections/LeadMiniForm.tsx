"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { useId, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";

const INTEREST_OPTIONS = [
  { value: "espositori", label: "Espositori" },
  { value: "buyer", label: "Buyer" },
  { value: "visitatori", label: "Visitatori" },
  { value: "media", label: "Media" },
  { value: "sponsor", label: "Sponsor" },
  { value: "partnership", label: "Partnership" },
  { value: "grand-prix", label: "Grand Prix" },
] as const;

type InterestValue = (typeof INTEREST_OPTIONS)[number]["value"];

const DEFAULT_INTEREST: InterestValue = "espositori";

type SubmitStatus = "idle" | "submitting" | "success";

type LeadResponse = {
  ok?: boolean;
  error?: string;
  requestId?: string;
};

function resolveInterest(raw: string | null | undefined): InterestValue {
  const match = INTEREST_OPTIONS.find((option) => option.value === raw);
  return match ? match.value : DEFAULT_INTEREST;
}

export default function LeadMiniForm() {
  const formId = useId();
  const searchParams = useSearchParams();
  const initialInterest = resolveInterest(searchParams?.get("interesse"));
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState("");

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

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[1.1rem] border border-[rgba(176,141,87,0.32)] bg-[rgba(252,247,238,0.95)] px-6 py-7 text-center shadow-[0_8px_22px_rgba(42,32,23,0.05)]"
      >
        <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-sand-strong)]">
          Richiesta ricevuta
        </p>
        <h3 className="mt-3 font-display text-[1.7rem] leading-[1.12] tracking-[0.005em] text-[var(--color-ink-strong)] sm:text-[1.95rem]">
          Grazie, la segreteria ti ricontatterà.
        </h3>
        <p className="mx-auto mt-4 max-w-[44ch] text-[0.98rem] leading-relaxed text-[var(--color-muted)]">
          Abbiamo registrato la tua richiesta. Per esigenze prioritarie scrivi
          a info@vinisud.it.
        </p>
      </div>
    );
  }

  const inputBase =
    "mt-2 w-full rounded-[1.1rem] border border-[var(--color-line)] bg-white/85 px-4 py-3 text-[0.98rem] leading-relaxed text-[var(--color-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.6)] transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-[rgba(112,97,92,0.55)] motion-reduce:transition-none focus:border-[rgba(122,38,52,0.45)] focus:bg-[rgba(255,255,255,0.95)] focus:outline-none focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.8),0_0_0_3px_rgba(122,38,52,0.12)] focus:ring-0";

  const labelBase =
    "font-ui block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-wine)] transition-colors duration-200 ease-out motion-reduce:transition-none";

  return (
    <form
      method="POST"
      action="/forms/lead.php"
      onSubmit={handleSubmit}
      aria-describedby={`${formId}-disclaimer`}
      className="space-y-5"
    >
      {/* Honeypot anti-bot. */}
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

      <p
        id={`${formId}-disclaimer`}
        className="rounded-[1.1rem] border border-[rgba(200,167,111,0.35)] bg-gradient-to-br from-[rgba(255,251,245,0.85)] to-[rgba(252,248,241,0.7)] px-4 py-3 text-[0.92rem] leading-relaxed text-[var(--color-muted)] shadow-[0_2px_8px_rgba(122,38,52,0.04)]"
      >
        Compila il modulo: la segreteria di Vini Oli Sud ricontatta i profili
        in linea con il progetto.
      </p>

      {errorMessage ? (
        <p
          role="alert"
          className="font-ui rounded-[0.8rem] border border-[rgba(122,38,52,0.3)] bg-[rgba(252,243,243,0.9)] px-4 py-2 text-[0.88rem] text-[var(--color-wine)]"
        >
          {errorMessage}
        </p>
      ) : null}

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="group">
          <label htmlFor={`${formId}-fullname`} className={labelBase}>
            Nome e cognome
          </label>
          <input
            id={`${formId}-fullname`}
            name="fullname"
            type="text"
            autoComplete="name"
            required
            placeholder="Mario Rossi"
            className={inputBase}
          />
        </div>

        <div className="group">
          <label htmlFor={`${formId}-company`} className={labelBase}>
            Ragione sociale
          </label>
          <input
            id={`${formId}-company`}
            name="company"
            type="text"
            autoComplete="organization"
            required
            placeholder="Cantina, frantoio, distributore…"
            className={inputBase}
          />
        </div>

        <div className="group">
          <label htmlFor={`${formId}-email`} className={labelBase}>
            Email
          </label>
          <input
            id={`${formId}-email`}
            name="email"
            type="email"
            autoComplete="email"
            required
            placeholder="nome@azienda.it"
            className={inputBase}
          />
        </div>

        <div className="group">
          <label htmlFor={`${formId}-website`} className={labelBase}>
            Sito web <span className="text-[rgba(112,97,92,0.6)]">(facoltativo)</span>
          </label>
          <input
            id={`${formId}-website`}
            name="website"
            type="url"
            autoComplete="url"
            placeholder="https://"
            className={inputBase}
          />
        </div>

        <div className="group sm:col-span-2">
          <label htmlFor={`${formId}-interest`} className={labelBase}>
            Area di interesse
          </label>
          <select
            id={`${formId}-interest`}
            name="interest"
            required
            defaultValue={initialInterest}
            className={`${inputBase} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%237a2634' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
            }}
          >
            {INTEREST_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </div>

        <div className="group sm:col-span-2">
          <label htmlFor={`${formId}-message`} className={labelBase}>
            Note <span className="text-[rgba(112,97,92,0.6)]">(facoltativo)</span>
          </label>
          <textarea
            id={`${formId}-message`}
            name="message"
            rows={4}
            placeholder="Descrivi brevemente il tuo profilo o la tua richiesta."
            className={`${inputBase} resize-y`}
          />
        </div>

        <div className="sm:col-span-2">
          <label className="group flex items-start gap-3 text-[0.92rem] leading-relaxed text-[var(--color-muted)] transition-colors duration-200 ease-out motion-reduce:transition-none">
            <input
              type="checkbox"
              name="privacy_consent"
              required
              className="mt-1.5 h-4 w-4 flex-shrink-0 cursor-pointer rounded-[0.4rem] border-2 border-[rgba(200,167,111,0.4)] bg-white transition-all duration-200 ease-out motion-reduce:transition-none checked:border-[var(--color-wine)] checked:bg-[var(--color-wine)] checked:shadow-[inset_0_1px_3px_rgba(255,255,255,0.3)] focus:outline-none focus:ring-2 focus:ring-[rgba(122,38,52,0.15)] focus:ring-offset-2 focus:ring-offset-white accent-[var(--color-wine)]"
              aria-label="Accetto il trattamento dei dati come descritto nella privacy policy"
            />
            <span className="pt-0.5 transition-colors duration-200 ease-out group-hover:text-[rgba(112,97,92,0.95)]">
              Accetto il trattamento dei dati come descritto nella{" "}
              <Link
                href="/privacy"
                className="text-[var(--color-grove)] underline decoration-[rgba(200,167,111,0.4)] decoration-1 underline-offset-2 transition-colors duration-200 ease-out hover:text-[var(--color-wine)] hover:decoration-[var(--color-wine)]"
              >
                privacy policy
              </Link>
              .
            </span>
          </label>
        </div>
      </div>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end">
        <Button type="submit" size="lg" className="w-full sm:w-auto">
          Manifesta interesse
        </Button>
      </div>
    </form>
  );
}
