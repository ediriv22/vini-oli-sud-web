import type { InputHTMLAttributes, ReactNode, TextareaHTMLAttributes } from "react";

/**
 * Primitivi UI condivisi dai moduli reali del sito (iscrizione prodotto,
 * richiesta sponsor). Nessuna libreria di form: markup nativo, submit via
 * fetch verso /forms/lead.php (vedi useFormSubmit in questo stesso file).
 */

const inputBase =
  "w-full rounded-[0.7rem] border border-[rgba(47,91,70,0.3)] bg-[rgba(255,253,245,0.9)] px-4 py-3 text-[0.94rem] text-[var(--color-ink-strong)] outline-none transition-colors duration-200 focus:border-[var(--color-wine)]";

type FieldProps = InputHTMLAttributes<HTMLInputElement> & {
  label: string;
  name: string;
  hint?: string;
};

export function TextField({ label, name, hint, required, ...props }: FieldProps) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="font-ui text-[0.82rem] font-semibold text-[var(--color-ink-strong)]">
        {label}
        {required ? <span className="text-[var(--color-wine)]"> *</span> : null}
      </span>
      <input id={name} name={name} required={required} className={inputBase} {...props} />
      {hint ? <span className="text-[0.76rem] text-[var(--color-muted)]">{hint}</span> : null}
    </label>
  );
}

type TextareaProps = TextareaHTMLAttributes<HTMLTextAreaElement> & {
  label: string;
  name: string;
  hint?: string;
};

export function TextareaField({ label, name, hint, required, rows = 4, ...props }: TextareaProps) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="font-ui text-[0.82rem] font-semibold text-[var(--color-ink-strong)]">
        {label}
        {required ? <span className="text-[var(--color-wine)]"> *</span> : null}
      </span>
      <textarea id={name} name={name} required={required} rows={rows} className={inputBase} {...props} />
      {hint ? <span className="text-[0.76rem] text-[var(--color-muted)]">{hint}</span> : null}
    </label>
  );
}

export function FileField({
  label,
  name,
  required,
  hint,
}: {
  label: string;
  name: string;
  required?: boolean;
  hint?: string;
}) {
  return (
    <label className="flex flex-col gap-1.5 text-left">
      <span className="font-ui text-[0.82rem] font-semibold text-[var(--color-ink-strong)]">
        📎 {label}
        {required ? <span className="text-[var(--color-wine)]"> *</span> : null}
      </span>
      <input
        id={name}
        name={name}
        type="file"
        required={required}
        accept=".pdf,.png,.jpg,.jpeg,application/pdf,image/png,image/jpeg"
        className="font-ui w-full rounded-[0.7rem] border border-dashed border-[rgba(47,91,70,0.4)] bg-[rgba(255,253,245,0.9)] px-4 py-3 text-[0.86rem] text-[var(--color-muted)] file:mr-3 file:rounded-full file:border-0 file:bg-[var(--color-wine)] file:px-4 file:py-2 file:text-[0.78rem] file:font-semibold file:text-[var(--color-ivory)]"
      />
      <span className="text-[0.76rem] text-[var(--color-muted)]">
        {hint ?? "Formati consigliati: PDF, PNG, JPG ad alta risoluzione (max 15MB)."}
      </span>
    </label>
  );
}

export function CheckboxField({
  name,
  required,
  children,
}: {
  name: string;
  required?: boolean;
  children: ReactNode;
}) {
  return (
    <label className="flex items-start gap-3 text-left text-[0.88rem] leading-[1.5] text-[var(--color-ink-strong)]">
      <input
        type="checkbox"
        name={name}
        required={required}
        value="1"
        className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-wine)]"
      />
      <span>{children}</span>
    </label>
  );
}

export function FormSectionTitle({ children }: { children: ReactNode }) {
  return (
    <h2 className="font-display text-[1.3rem] font-semibold leading-tight text-[var(--color-ink-strong)]">
      {children}
    </h2>
  );
}

export type SubmitStatus = "idle" | "submitting" | "success" | "error";

export function FormStatusBanner({
  status,
  errorMessage,
  successMessage,
}: {
  status: SubmitStatus;
  errorMessage?: string;
  successMessage: string;
}) {
  if (status === "success") {
    return (
      <div className="rounded-[1rem] border border-[rgba(47,91,70,0.35)] bg-[rgba(47,91,70,0.08)] px-6 py-5 text-center">
        <p className="font-display text-[1.1rem] text-[var(--color-ink-strong)]">✅ Inviato</p>
        <p className="mt-2 text-[0.92rem] leading-[1.6] text-[var(--color-muted)]">{successMessage}</p>
      </div>
    );
  }
  if (status === "error") {
    return (
      <div className="rounded-[1rem] border border-[rgba(191,60,60,0.4)] bg-[rgba(191,60,60,0.06)] px-6 py-4 text-center">
        <p className="text-[0.9rem] font-semibold text-[rgb(153,42,42)]">
          {errorMessage ?? "Invio non riuscito. Riprova o scrivi a napoliracingshow@gmail.com."}
        </p>
      </div>
    );
  }
  return null;
}

/**
 * Invia un <form> a /forms/lead.php come multipart/form-data e restituisce
 * la risposta tipizzata { ok, error?, requestId? }. Il campo honeypot
 * "website_url" è aggiunto qui: deve restare vuoto/nascosto nel form.
 */
export async function submitLeadForm(
  form: HTMLFormElement,
): Promise<{ ok: boolean; error?: string; requestId?: string }> {
  const formData = new FormData(form);
  try {
    const res = await fetch("/forms/lead.php", {
      method: "POST",
      body: formData,
    });
    const data = (await res.json()) as { ok: boolean; error?: string; requestId?: string };
    return data;
  } catch {
    return { ok: false, error: "Errore di rete. Controlla la connessione e riprova." };
  }
}

/** Campo honeypot anti-bot, nascosto via CSS (non display:none: alcuni bot lo ignorano). */
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden">
      <label>
        Non compilare questo campo
        <input type="text" name="website_url" tabIndex={-1} autoComplete="off" />
      </label>
    </div>
  );
}
