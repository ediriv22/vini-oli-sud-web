"use client";

import Link from "next/link";
import { useId, useState, type FormEvent } from "react";
import Button from "@/components/ui/Button";
import type { FoodRadarCategory } from "@/data/foodRadar";

const CATEGORY_OPTIONS: FoodRadarCategory[] = [
  "Radar del Sud",
  "Oro Verde",
  "Calici di Magna Grecia",
  "Territori",
  "Business con Anima",
];

type SubmitStatus = "idle" | "submitting" | "success";

type LeadResponse = {
  ok?: boolean;
  error?: string;
  requestId?: string;
};

export default function FoodRadarSuggestionForm() {
  const formId = useId();
  const [title, setTitle] = useState("");
  const [url, setUrl] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState<FoodRadarCategory>(
    CATEGORY_OPTIONS[0],
  );
  const [email, setEmail] = useState("");
  const [note, setNote] = useState("");
  const [privacy, setPrivacy] = useState(false);
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

  const inputBase =
    "mt-2 w-full min-h-[3rem] rounded-[0.6rem] border border-[rgba(176,141,87,0.42)] bg-[rgba(255,251,244,0.88)] px-4 py-3 text-[0.98rem] leading-[1.4] text-[var(--color-ink)] shadow-[inset_0_1px_0_rgba(255,255,255,0.55)] transition-[border-color,box-shadow,background-color] duration-200 ease-out placeholder:text-[rgba(112,97,92,0.6)] motion-reduce:transition-none focus:border-[rgba(107,30,30,0.55)] focus:bg-white focus:outline-none focus:shadow-[inset_0_1px_0_rgba(255,255,255,0.85),0_0_0_3px_rgba(107,30,30,0.14)] focus:ring-0";

  const labelBase =
    "font-ui block text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-[var(--color-ink-strong)]";

  const helperBase =
    "mt-1 text-[0.82rem] leading-relaxed text-[var(--color-muted)]";

  if (status === "success") {
    return (
      <div
        role="status"
        aria-live="polite"
        className="rounded-[1.1rem] border border-[rgba(176,141,87,0.32)] bg-[rgba(252,247,238,0.95)] px-6 py-8 text-center shadow-[0_8px_22px_rgba(42,32,23,0.05)]"
      >
        <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.2em] text-[var(--color-sand-strong)]">
          Segnalazione ricevuta
        </p>
        <h3 className="mt-3 font-display text-[1.7rem] leading-[1.12] tracking-[0.005em] text-[var(--color-ink-strong)] sm:text-[1.95rem]">
          Grazie, è entrata nel radar.
        </h3>
        <p className="mx-auto mt-4 max-w-[48ch] text-[0.98rem] leading-relaxed text-[var(--color-muted)]">
          Abbiamo ricevuto la segnalazione. La valuteremo prima di pubblicarla nel
          Diario del Sud.
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
      <input type="hidden" name="audience" value="diario-del-sud" />
      <input type="hidden" name="requestType" value="segnalazione-editoriale" />
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

      <div className="grid gap-5 sm:grid-cols-2">
        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-title`} className={labelBase}>
            Titolo o tema della segnalazione
          </label>
          <input
            id={`${formId}-title`}
            name="title"
            type="text"
            required
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Es. nuovo premio, territorio, azienda, evento, olio, vino…"
            className={inputBase}
          />
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-url`} className={labelBase}>
            Link alla fonte
          </label>
          <input
            id={`${formId}-url`}
            name="url"
            type="url"
            required
            value={url}
            onChange={(event) => setUrl(event.target.value)}
            placeholder="https://…"
            className={inputBase}
          />
        </div>

        <div>
          <label htmlFor={`${formId}-source`} className={labelBase}>
            Nome della fonte
          </label>
          <input
            id={`${formId}-source`}
            name="source"
            type="text"
            required
            value={source}
            onChange={(event) => setSource(event.target.value)}
            placeholder="Testata, sito istituzionale, consorzio, azienda…"
            className={inputBase}
          />
        </div>

        <div>
          <label htmlFor={`${formId}-category`} className={labelBase}>
            Categoria
          </label>
          <select
            id={`${formId}-category`}
            name="category"
            value={category}
            onChange={(event) =>
              setCategory(event.target.value as FoodRadarCategory)
            }
            required
            className={`${inputBase} appearance-none bg-[length:1rem] bg-[right_1rem_center] bg-no-repeat pr-10`}
            style={{
              backgroundImage:
                "url(\"data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'><path d='M1 1.5L6 6.5L11 1.5' stroke='%235f6b33' stroke-width='1.5' stroke-linecap='round' stroke-linejoin='round'/></svg>\")",
            }}
          >
            {CATEGORY_OPTIONS.map((option) => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-email`} className={labelBase}>
            La tua email
          </label>
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
          <p className={helperBase}>
            Useremo l’email solo per eventuali chiarimenti editoriali sulla
            segnalazione.
          </p>
        </div>

        <div className="sm:col-span-2">
          <label htmlFor={`${formId}-note`} className={labelBase}>
            Perché segnalarla?{" "}
            <span className="font-ui ml-1 text-[0.7rem] font-medium normal-case tracking-normal text-[var(--color-muted)]">
              (facoltativo)
            </span>
          </label>
          <textarea
            id={`${formId}-note`}
            name="note"
            rows={3}
            value={note}
            onChange={(event) => setNote(event.target.value)}
            placeholder="Una riga per aiutarci a capire il contesto."
            className={`${inputBase} resize-y`}
          />
        </div>
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

      <div className="flex flex-col gap-3 border-t border-[rgba(200,167,111,0.28)] pt-5 sm:flex-row sm:items-center sm:justify-between">
        <p
          id={`${formId}-microcopy`}
          className="font-ui text-[0.78rem] leading-relaxed text-[var(--color-muted)]"
        >
          Le segnalazioni vengono valutate editorialmente prima della pubblicazione.
          Il Diario del Sud rimanda sempre alle fonti originali.
        </p>
        <Button
          type="submit"
          size="lg"
          variant="soft"
          className="w-full sm:w-auto"
          disabled={status === "submitting"}
          aria-disabled={status === "submitting"}
        >
          {status === "submitting" ? "Invio in corso…" : "Invia segnalazione"}
        </Button>
      </div>
    </form>
  );
}
