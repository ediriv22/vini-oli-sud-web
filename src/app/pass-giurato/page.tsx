"use client";

import { useMemo, useState, type FormEvent } from "react";
import {
  CheckboxField,
  FileField,
  FormSectionTitle,
  FormStatusBanner,
  Honeypot,
  TextField,
  submitLeadForm,
  type SubmitStatus,
} from "@/components/forms/FormFields";
import { siteConfig } from "@/data/site";

/**
 * Modulo "Diventa Giurato Popolare" — iscrizione + pagamento (bonifico con
 * upload ricevuta, o PayPal). Invia a napoliracingshow@gmail.com via
 * /forms/lead.php (requestType=iscrizione-giurato). Riusa i 3 Pass e i 9
 * Concorsi già definiti in siteConfig (nessun dato duplicato).
 *
 * Nota maggiore età: il modulo richiede la data di nascita e blocca lato
 * server chi ha meno di 18 anni (vedi lead.php).
 */
export default function PassGiuratoPage() {
  const biglietti = siteConfig.sfideAccordion.items.find((i) => i.kind === "biglietti");
  const tiers = biglietti?.tiers ?? [];
  const concorsi = siteConfig.sfideAccordion.items.find((i) => i.kind === "iscrivi")?.concorsi ?? [];
  const paypalLink = (biglietti as { paypalLink?: string } | undefined)?.paypalLink ?? "";

  const [tipoPass, setTipoPass] = useState<string>("");
  const [sfideScelte, setSfideScelte] = useState<string[]>([]);
  const [metodoPagamento, setMetodoPagamento] = useState<"" | "bonifico" | "paypal">("");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();

  const sfideAttese = tipoPass === "1 Sfida a scelta" ? 1 : tipoPass.startsWith("3 Sfide") ? 3 : tipoPass ? 9 : 0;
  const richiedeSelezione = sfideAttese === 1 || sfideAttese === 3;

  const oggi = useMemo(() => new Date(), []);
  const maxNascita = useMemo(() => {
    const d = new Date(oggi);
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().slice(0, 10);
  }, [oggi]);

  function toggleSfida(name: string) {
    setSfideScelte((prev) => {
      if (prev.includes(name)) return prev.filter((s) => s !== name);
      if (prev.length >= sfideAttese) return prev; // limite raggiunto
      return [...prev, name];
    });
  }

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (richiedeSelezione && sfideScelte.length !== sfideAttese) {
      setStatus("error");
      setErrorMessage(`Seleziona esattamente ${sfideAttese} Sfid${sfideAttese === 1 ? "a" : "e"}.`);
      return;
    }
    setStatus("submitting");
    setErrorMessage(undefined);
    const result = await submitLeadForm(e.currentTarget);
    if (result.ok) {
      setStatus("success");
      e.currentTarget.reset();
      setTipoPass("");
      setSfideScelte([]);
      setMetodoPagamento("");
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  }

  return (
    <section className="section-flow section-space">
      <div className="section-shell mx-auto max-w-[46rem] text-center">
        <p className="eyebrow text-center">Il Gran Premio del Gusto</p>
        <h1 className="display-balance mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]">
          Diventa Giurato Popolare
        </h1>
        <p className="mx-auto mt-3 max-w-[42ch] text-[0.94rem] leading-[1.6] text-[var(--color-muted)]">
          Solo 200 Giurati Popolari per ciascuna Sfida. Compila il modulo e completa il pagamento
          per riservare il tuo posto.
        </p>
        <p className="mx-auto mt-3 max-w-[46ch] text-[0.88rem] leading-[1.6] text-[var(--color-muted)]">
          Il kit giurato sarà disponibile per il ritiro dalle ore 9 del 27 Novembre 2026 presso lo
          stand della Segreteria Organizzativa.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="section-shell mx-auto mt-12 flex max-w-[42rem] flex-col gap-12"
      >
        <input type="hidden" name="requestType" value="iscrizione-giurato" />
        <Honeypot />

        <fieldset className="flex flex-col gap-5">
          <FormSectionTitle>1. I tuoi dati</FormSectionTitle>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Nome" name="nome" required />
            <TextField label="Cognome" name="cognome" required />
          </div>
          <TextField label="Email" name="email" type="email" required />
          <TextField
            label="Data di nascita"
            name="data_nascita"
            type="date"
            required
            max={maxNascita}
            hint="Il Pass Giuria Popolare è riservato ai maggiorenni (18 anni compiuti)."
          />
        </fieldset>

        <fieldset className="flex flex-col gap-5">
          <FormSectionTitle>2. Il calendario delle Sfide</FormSectionTitle>
          <p className="text-[0.88rem] leading-[1.6] text-[var(--color-muted)]">
            Le 9 Sfide del Gran Premio del Gusto si svolgono su 3 giornate. Scegli il Pass e le
            Sfide tenendo conto di quando puoi essere presente — ogni Sfida qui sotto mostra
            giorno e orario.
          </p>
          <div className="grid gap-4 sm:grid-cols-3">
            {(["Venerdì 27 Novembre", "Sabato 28 Novembre", "Domenica 29 Novembre"] as const).map(
              (giorno) => (
                <div
                  key={giorno}
                  className="rounded-[1rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.6)] p-4"
                >
                  <p className="font-ui text-[0.76rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-wine)]">
                    {giorno}
                  </p>
                  <ul className="mt-2.5 flex flex-col gap-1.5">
                    {concorsi
                      .filter((c) => c.giorno === giorno)
                      .map((c) => (
                        <li key={c.name} className="text-[0.82rem] leading-[1.4] text-[var(--color-muted)]">
                          <span aria-hidden="true">{c.icon}</span> {c.ora} — {c.name}
                        </li>
                      ))}
                  </ul>
                </div>
              ),
            )}
          </div>
          <p className="text-center text-[0.8rem] italic text-[var(--color-muted)]">
            200 Giudici Popolari Ufficiali per ciascuna Sfida. Dettaglio di come si svolge ogni
            Sfida:{" "}
            <a href="/format/gran-premio-del-gusto/" className="underline">
              vai alla pagina Gran Premio del Gusto
            </a>
            .
          </p>
        </fieldset>

        <fieldset className="flex flex-col gap-5">
          <FormSectionTitle>3. Scegli il tuo Pass</FormSectionTitle>
          <div className="grid gap-4 sm:grid-cols-3">
            {tiers.map((tier) => {
              const selected = tipoPass === tier.name;
              return (
                <label
                  key={tier.name}
                  className={`flex cursor-pointer flex-col items-center gap-1 rounded-[1rem] border p-4 text-center transition-colors duration-200 ${
                    selected
                      ? "border-[var(--color-wine)] bg-[rgba(47,91,70,0.08)]"
                      : "border-[rgba(47,91,70,0.25)] bg-[rgba(255,253,245,0.6)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipo_pass"
                    value={tier.name}
                    required
                    checked={selected}
                    onChange={() => {
                      setTipoPass(tier.name);
                      setSfideScelte([]);
                    }}
                    className="sr-only"
                  />
                  <span className="font-display text-[1rem] leading-tight text-[var(--color-ink-strong)]">
                    {tier.name}
                  </span>
                  <span className="font-display text-[1.6rem] text-[var(--color-wine)]">{tier.price}</span>
                </label>
              );
            })}
          </div>

          {richiedeSelezione ? (
            <div>
              <p className="text-[0.88rem] text-[var(--color-muted)]">
                Scegli {sfideAttese} Sfid{sfideAttese === 1 ? "a" : "e"} ({sfideScelte.length}/{sfideAttese}{" "}
                selezionat{sfideAttese === 1 ? "a" : "e"})
              </p>
              <div className="mt-3 grid gap-2.5 sm:grid-cols-2">
                {concorsi.map((c) => {
                  const checked = sfideScelte.includes(c.name);
                  return (
                    <label
                      key={c.name}
                      className={`flex items-center gap-3 rounded-[0.8rem] border px-3 py-2.5 text-[0.88rem] transition-colors duration-200 ${
                        checked
                          ? "border-[var(--color-wine)] bg-[rgba(47,91,70,0.08)]"
                          : "border-[rgba(47,91,70,0.22)] bg-[rgba(255,253,245,0.6)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="sfide"
                        value={c.name}
                        checked={checked}
                        onChange={() => toggleSfida(c.name)}
                        className="h-4 w-4 accent-[var(--color-wine)]"
                      />
                      <span aria-hidden="true">{c.icon}</span>
                      <span>
                        {c.name}
                        <span className="block text-[0.74rem] text-[var(--color-muted)]">
                          {c.giorno} · ore {c.ora}
                        </span>
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          ) : tipoPass ? (
            <p className="text-center text-[0.86rem] italic text-[var(--color-muted)]">
              Pass Gran Giurato: partecipi a tutte le 9 Sfide, nessuna selezione necessaria.
            </p>
          ) : null}
        </fieldset>

        <fieldset className="flex flex-col gap-5">
          <FormSectionTitle>4. Pagamento</FormSectionTitle>
          <div className="grid gap-4 sm:grid-cols-2">
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-[1rem] border px-4 py-3 ${
                metodoPagamento === "bonifico"
                  ? "border-[var(--color-wine)] bg-[rgba(47,91,70,0.08)]"
                  : "border-[rgba(47,91,70,0.25)] bg-[rgba(255,253,245,0.6)]"
              }`}
            >
              <input
                type="radio"
                name="metodo_pagamento"
                value="bonifico"
                required
                checked={metodoPagamento === "bonifico"}
                onChange={() => setMetodoPagamento("bonifico")}
                className="h-4 w-4 accent-[var(--color-wine)]"
              />
              🏦 Bonifico bancario
            </label>
            <label
              className={`flex cursor-pointer items-center gap-3 rounded-[1rem] border px-4 py-3 ${
                metodoPagamento === "paypal"
                  ? "border-[var(--color-wine)] bg-[rgba(47,91,70,0.08)]"
                  : "border-[rgba(47,91,70,0.25)] bg-[rgba(255,253,245,0.6)]"
              }`}
            >
              <input
                type="radio"
                name="metodo_pagamento"
                value="paypal"
                required
                checked={metodoPagamento === "paypal"}
                onChange={() => setMetodoPagamento("paypal")}
                className="h-4 w-4 accent-[var(--color-wine)]"
              />
              💳 PayPal
            </label>
          </div>

          {metodoPagamento === "bonifico" ? (
            <div className="rounded-[0.9rem] border border-[rgba(47,91,70,0.25)] bg-[rgba(255,253,245,0.6)] p-4">
              <p className="font-ui text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-wine)]">
                Dati per il bonifico
              </p>
              <p className="mt-2 text-[0.88rem] leading-[1.6] text-[var(--color-muted)]">
                Intestato a <strong>A.S.D. Napoli Racing Show</strong>
                <br />
                IBAN: <strong>IT51 X062 3003 5470 0003 5710 069</strong>
                <br />
                Causale: Pass Giuria Popolare – [Nome Cognome] – [Tipo di Pass]
              </p>
              <div className="mt-4">
                <FileField label="Ricevuta del bonifico" name="ricevuta_file" required />
              </div>
            </div>
          ) : null}

          {metodoPagamento === "paypal" ? (
            <div className="rounded-[0.9rem] border border-[rgba(47,91,70,0.25)] bg-[rgba(255,253,245,0.6)] p-4 text-center">
              {paypalLink ? (
                <a
                  href={paypalLink}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="font-ui inline-flex h-11 items-center justify-center rounded-full bg-[#ffc439] px-6 text-[0.88rem] font-bold text-[#003087] transition-transform duration-200 hover:-translate-y-px"
                >
                  Paga con PayPal
                </a>
              ) : (
                <p className="font-ui text-[0.82rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-wine)]">
                  Pagamento PayPal in attivazione — invia comunque il modulo, la Segreteria ti
                  contatterà per completare il pagamento.
                </p>
              )}
              <p className="mt-3 text-[0.82rem] leading-[1.55] text-[var(--color-muted)]">
                Dopo il pagamento riceverai una conferma da PayPal. La Segreteria Organizzativa
                verificherà il pagamento e ti confermerà la partecipazione.
              </p>
            </div>
          ) : null}
        </fieldset>

        <fieldset className="flex flex-col gap-4">
          <CheckboxField name="privacy_consent" required>
            Ho letto e accetto la{" "}
            <a href="/social/privacy.html" className="underline">
              privacy policy
            </a>
            .
          </CheckboxField>
        </fieldset>

        <div className="flex flex-col items-center gap-4 border-t border-[rgba(255,215,87,0.3)] pt-8 text-center">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="font-ui inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--color-sand)] px-10 text-[1rem] font-bold uppercase tracking-[0.06em] text-[var(--color-ink-strong)] shadow-[0_14px_32px_rgba(255,215,87,0.32)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-px hover:shadow-[0_18px_38px_rgba(255,215,87,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Invio in corso…" : "🎟️ Invia Iscrizione"}
          </button>

          <FormStatusBanner
            status={status}
            errorMessage={errorMessage}
            successMessage="Iscrizione ricevuta dalla Segreteria Organizzativa. Riceverai una conferma via email."
          />
        </div>
      </form>

      {biglietti?.extraTitle ? (
        <div className="section-shell mx-auto mt-14 max-w-[42rem] rounded-[1.1rem] border border-[rgba(47,91,70,0.2)] bg-[rgba(255,253,245,0.6)] p-6 text-center">
          <p className="font-display text-[1.1rem] text-[var(--color-ink-strong)]">
            {biglietti.extraTitle}
          </p>
          {biglietti.extraBody ? (
            <p className="mt-2 text-[0.9rem] leading-[1.6] text-[var(--color-muted)]">
              {biglietti.extraBody}
            </p>
          ) : null}
          {biglietti.extraCtaLabel ? (
            <div className="mt-4">
              <a
                href={biglietti.extraCtaHref || "mailto:napoliracingshow@gmail.com"}
                className="font-ui inline-flex h-11 items-center justify-center rounded-full border border-[rgba(255,215,87,0.6)] bg-[rgba(255,253,245,1)] px-6 text-[0.86rem] font-semibold text-[var(--color-ink-strong)] transition-colors duration-200 hover:bg-[rgba(255,247,214,1)]"
              >
                {biglietti.extraCtaLabel}
              </a>
            </div>
          ) : null}
        </div>
      ) : null}
    </section>
  );
}
