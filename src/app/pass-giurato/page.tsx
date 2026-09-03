"use client";

import { useCallback, useEffect, useMemo, useRef, useState, type FormEvent } from "react";
import {
  CheckboxField,
  FileField,
  FormSectionTitle,
  FormStatusBanner,
  Honeypot,
  IbanCopy,
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
 *
 * PayPal (Hosted Buttons SDK, uno per tier + uno per tier+addon, vedi
 * paypalHostedButtonId/paypalHostedButtonIdConAddon in siteConfig): dopo il
 * submit del form, che salva già l'iscrizione lato server con stato "in
 * attesa pagamento" (vedi lead.php), mostriamo il pulsante corrispondente.
 * onApprove chiama paypal-confirm.php che verifica l'ordine reale su
 * PayPal Orders API prima di segnare pagato e mandare la mail di conferma
 * — quella mail NON parte dal submit per il metodo paypal, solo da lì.
 */

type PaypalPhase = "idle" | "button" | "confirming" | "confirm-error";

export default function PassGiuratoPage() {
  const biglietti = siteConfig.sfideAccordion.items.find((i) => i.kind === "biglietti");
  const tiers = biglietti?.tiers ?? [];
  const addon = biglietti?.addon;
  const concorsi = siteConfig.sfideAccordion.items.find((i) => i.kind === "iscrivi")?.concorsi ?? [];
  const paypalClientId = biglietti?.paypalClientId ?? "";

  const [tipoPass, setTipoPass] = useState<string>("");
  const [sfideScelte, setSfideScelte] = useState<string[]>([]);
  // Add-on "bicchiere + portabicchiere in omaggio" (+€10, richiesta esplicita
  // 1/9/2026): esclusivo del Pass Gran Giurato — se l'utente lo seleziona e
  // poi cambia Pass, va spento di nuovo, non deve restare "appiccicato" a un
  // Pass che non lo prevede.
  const [addonScelto, setAddonScelto] = useState(false);
  const [metodoPagamento, setMetodoPagamento] = useState<"bonifico" | "paypal">("bonifico");
  const [status, setStatus] = useState<SubmitStatus>("idle");
  const [errorMessage, setErrorMessage] = useState<string | undefined>();
  // Posti rimasti per Sfida (200 a Sfida, richiesta esplicita): letti da
  // pass-giurato-counts.php, che conta le iscrizioni già salvate nel CSV
  // sul server. Una Sfida esaurita si disattiva da sola, senza bisogno di
  // toccare il codice quando si riempie.
  const [sfideCounts, setSfideCounts] = useState<Record<string, number>>({});
  const [countsLimit, setCountsLimit] = useState<number>(200);
  // Fase del pagamento PayPal successiva al submit (i dati sono già salvati
  // lato server a questo punto): mostriamo il pulsante ospitato giusto per
  // tier+addon, poi verifichiamo l'ordine reale prima di concludere.
  const [paypalPhase, setPaypalPhase] = useState<PaypalPhase>("idle");
  const [paypalRequestId, setPaypalRequestId] = useState<string | undefined>();
  const paypalContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/forms/pass-giurato-counts.php", { cache: "no-store" })
      .then((r) => r.json())
      .then((data: { limit?: number; counts?: Record<string, number> }) => {
        if (cancelled) return;
        if (data.counts) setSfideCounts(data.counts);
        if (data.limit) setCountsLimit(data.limit);
      })
      .catch(() => {
        // Endpoint non raggiungibile: nessuna Sfida viene disattivata per
        // errore di rete, il controllo definitivo resta comunque lato
        // server in lead.php.
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const isSfidaFull = (name: string) => (sfideCounts[name] ?? 0) >= countsLimit;
  const tutteEsaurite = concorsi.length > 0 && concorsi.every((c) => isSfidaFull(c.name));

  const sfideAttese = tipoPass === "1 Sfida a scelta" ? 1 : tipoPass.startsWith("3 Sfide") ? 3 : tipoPass ? 9 : 0;
  const richiedeSelezione = sfideAttese === 1 || sfideAttese === 3;
  const granGiuratoDisponibile = !concorsi.some((c) => isSfidaFull(c.name));

  const tierSelezionato = tiers.find((t) => t.name === tipoPass);
  const addonDisponibile = !!addon && tipoPass === addon.tierName;
  const totale = (tierSelezionato?.priceValue ?? 0) + (addonDisponibile && addonScelto ? (addon?.priceValue ?? 0) : 0);
  const hostedButtonId =
    addonDisponibile && addonScelto ? addon?.paypalHostedButtonIdConAddon : tierSelezionato?.paypalHostedButtonId;

  const oggi = useMemo(() => new Date(), []);
  const maxNascita = useMemo(() => {
    const d = new Date(oggi);
    d.setFullYear(d.getFullYear() - 18);
    return d.toISOString().slice(0, 10);
  }, [oggi]);

  function toggleSfida(name: string) {
    setSfideScelte((prev) => {
      if (prev.includes(name)) return prev.filter((s) => s !== name);
      if (prev.length >= sfideAttese) return prev; // limite Pass raggiunto
      if (isSfidaFull(name)) return prev; // 200 posti già occupati per questa Sfida
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
      if (metodoPagamento === "paypal") {
        // Dati già salvati lato server (stato "in attesa pagamento", vedi
        // lead.php) — non resettiamo il form: mostriamo qui il pulsante
        // PayPal del tier scelto. La mail di conferma NON parte da questo
        // submit, solo dopo verifica reale in handlePaypalApprove.
        setPaypalRequestId(result.requestId);
        setPaypalPhase("button");
        setStatus("idle");
      } else {
        setStatus("success");
        e.currentTarget.reset();
        setTipoPass("");
        setSfideScelte([]);
        setAddonScelto(false);
      }
    } else {
      setStatus("error");
      setErrorMessage(result.error);
    }
  }

  const handlePaypalApprove = useCallback(
    async (orderID: string) => {
      if (!paypalRequestId) return;
      setPaypalPhase("confirming");
      try {
        const res = await fetch("/forms/paypal-confirm.php", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ request_id: paypalRequestId, orderID }),
        });
        const data = (await res.json()) as { ok: boolean; error?: string };
        if (data.ok) {
          window.location.href = "/pass-giurato/grazie/";
          return;
        }
        setPaypalPhase("confirm-error");
        setErrorMessage(data.error);
      } catch {
        setPaypalPhase("confirm-error");
        setErrorMessage(
          "Errore di rete durante la verifica del pagamento. Se hai pagato, scrivi a napoliracingshow@gmail.com con il tuo codice iscrizione.",
        );
      }
    },
    [paypalRequestId],
  );

  // Carica l'SDK PayPal (Hosted Buttons) e monta il pulsante corretto per
  // tier+addon appena entriamo in fase "button".
  useEffect(() => {
    if (paypalPhase !== "button" || !hostedButtonId || !paypalClientId) return;
    let cancelled = false;

    function render() {
      if (cancelled || !paypalContainerRef.current) return;
      paypalContainerRef.current.innerHTML = "";
      const w = window as unknown as {
        paypal?: { HostedButtons: (opts: Record<string, unknown>) => { render: (sel: string) => void } };
      };
      if (!w.paypal?.HostedButtons) return;
      const containerId = "paypal-container-" + hostedButtonId;
      paypalContainerRef.current.id = containerId;
      w.paypal
        .HostedButtons({
          hostedButtonId,
          onApprove: (data: { orderID: string }) => handlePaypalApprove(data.orderID),
        })
        .render("#" + containerId);
    }

    const existing = document.getElementById("paypal-sdk-script") as HTMLScriptElement | null;
    if (existing && (window as unknown as { paypal?: unknown }).paypal) {
      render();
      return () => {
        cancelled = true;
      };
    }
    if (existing) {
      existing.addEventListener("load", render);
      return () => {
        cancelled = true;
        existing.removeEventListener("load", render);
      };
    }
    const script = document.createElement("script");
    script.id = "paypal-sdk-script";
    script.src = `https://www.paypal.com/sdk/js?client-id=${encodeURIComponent(paypalClientId)}&components=hosted-buttons&disable-funding=venmo&currency=EUR`;
    script.addEventListener("load", render);
    document.body.appendChild(script);
    return () => {
      cancelled = true;
      script.removeEventListener("load", render);
    };
  }, [paypalPhase, hostedButtonId, paypalClientId, handlePaypalApprove]);

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
        <p className="mx-auto mt-3 max-w-[46ch] text-[0.86rem] leading-[1.55] text-[var(--color-muted)]">
          I posti sono limitati e sarà possibile acquistarli fino ad esaurimento.
        </p>
        <p className="mx-auto mt-3 max-w-[46ch] text-[0.88rem] leading-[1.6] text-[var(--color-muted)]">
          Il Pass Giurato è strettamente personale e non cedibile: va conservato dal titolare per
          tutta la durata della manifestazione (27-28-29 novembre 2026). In caso di smarrimento non
          sarà possibile richiedere una sostituzione né l&rsquo;accesso alle Sfide.
        </p>
        <p className="mx-auto mt-3 max-w-[46ch] text-[0.88rem] leading-[1.6] text-[var(--color-muted)]">
          Il kit giurato sarà disponibile per il ritiro presso lo stand della Segreteria
          Organizzativa venerdì 27, sabato 28 e domenica 29 novembre 2026, dalle 9.00 alle 20.00,
          previa esibizione della conferma di iscrizione ricevuta via email.
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
                          {isSfidaFull(c.name) ? (
                            <span className="ml-1.5 font-ui text-[0.66rem] font-semibold uppercase tracking-[0.04em] text-[rgb(153,42,42)]">
                              Esaurito
                            </span>
                          ) : null}
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
              // Il Pass Gran Giurato copre tutte le 9 Sfide: se anche una
              // sola ha già raggiunto i 200 posti, questo Pass non è più
              // acquistabile per intero (le Sfide singole restano invece
              // scelte una per una più sotto, dove l'esclusione è puntuale).
              const isGranGiurato = tier.name.startsWith("Pass Gran Giurato");
              const disabled = isGranGiurato && !granGiuratoDisponibile;
              return (
                <label
                  key={tier.name}
                  className={`flex flex-col items-center gap-1 rounded-[1rem] border p-4 text-center transition-colors duration-200 ${
                    disabled
                      ? "cursor-not-allowed border-[rgba(47,91,70,0.15)] bg-[rgba(47,91,70,0.03)] opacity-60"
                      : "cursor-pointer"
                  } ${
                    selected
                      ? "border-[var(--color-wine)] bg-[rgba(47,91,70,0.08)]"
                      : disabled
                        ? ""
                        : "border-[rgba(47,91,70,0.25)] bg-[rgba(255,253,245,0.6)]"
                  }`}
                >
                  <input
                    type="radio"
                    name="tipo_pass"
                    value={tier.name}
                    required
                    disabled={disabled}
                    checked={selected}
                    onChange={() => {
                      setTipoPass(tier.name);
                      setSfideScelte([]);
                      if (tier.name !== addon?.tierName) setAddonScelto(false);
                    }}
                    className="sr-only"
                  />
                  <span className="font-display text-[1rem] leading-tight text-[var(--color-ink-strong)]">
                    {tier.name}
                  </span>
                  <span className="font-display text-[1.6rem] text-[var(--color-wine)]">{tier.price}</span>
                  {disabled ? (
                    <span className="font-ui text-[0.66rem] font-semibold uppercase tracking-[0.04em] text-[rgb(153,42,42)]">
                      Non disponibile: una o più Sfide esaurite
                    </span>
                  ) : null}
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
                  const full = isSfidaFull(c.name);
                  return (
                    <label
                      key={c.name}
                      className={`flex items-center gap-3 rounded-[0.8rem] border px-3 py-2.5 text-[0.88rem] transition-colors duration-200 ${
                        full
                          ? "cursor-not-allowed border-[rgba(47,91,70,0.12)] bg-[rgba(47,91,70,0.02)] opacity-60"
                          : checked
                            ? "border-[var(--color-wine)] bg-[rgba(47,91,70,0.08)]"
                            : "border-[rgba(47,91,70,0.22)] bg-[rgba(255,253,245,0.6)]"
                      }`}
                    >
                      <input
                        type="checkbox"
                        name="sfide"
                        value={c.name}
                        checked={checked}
                        disabled={full}
                        onChange={() => toggleSfida(c.name)}
                        className="h-4 w-4 accent-[var(--color-wine)]"
                      />
                      <span aria-hidden="true">{c.icon}</span>
                      <span>
                        {c.name}
                        <span className="block text-[0.74rem] text-[var(--color-muted)]">
                          {c.giorno} · ore {c.ora}
                          {full ? (
                            <span className="ml-1.5 font-ui font-semibold uppercase tracking-[0.04em] text-[rgb(153,42,42)]">
                              Esaurito
                            </span>
                          ) : null}
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

          {addon && tipoPass === addon.tierName ? (
            <label className="flex items-start gap-3 rounded-[0.9rem] border border-dashed border-[var(--color-sand-strong)] bg-[rgba(255,215,87,0.08)] px-4 py-3 text-left text-[0.88rem] leading-[1.5] text-[var(--color-ink-strong)]">
              <input
                type="checkbox"
                name="addon_bicchiere"
                value="1"
                checked={addonScelto}
                onChange={(e) => setAddonScelto(e.target.checked)}
                className="mt-1 h-4 w-4 shrink-0 accent-[var(--color-wine)]"
              />
              <span>
                🎁 <strong>+{addon.price}</strong> — {addon.label}
                {addon.note ? (
                  <span className="block text-[0.76rem] text-[var(--color-muted)]">{addon.note}</span>
                ) : null}
              </span>
            </label>
          ) : null}

          {tipoPass ? (
            <p className="text-center font-ui text-[0.9rem] font-semibold text-[var(--color-ink-strong)]">
              Totale: €{totale}
            </p>
          ) : null}
        </fieldset>

        <fieldset className="flex flex-col gap-5">
          <FormSectionTitle>4. Pagamento</FormSectionTitle>
          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                { value: "bonifico", label: "Bonifico bancario", hint: "Carichi la ricevuta, verifica manuale" },
                { value: "paypal", label: "PayPal", hint: "Paga subito online, conferma automatica" },
              ] as const
            ).map((opt) => (
              <label
                key={opt.value}
                className={`flex cursor-pointer flex-col gap-1 rounded-[0.9rem] border p-4 transition-colors duration-200 ${
                  metodoPagamento === opt.value
                    ? "border-[var(--color-wine)] bg-[rgba(47,91,70,0.08)]"
                    : "border-[rgba(47,91,70,0.25)] bg-[rgba(255,253,245,0.6)]"
                }`}
              >
                <span className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="metodo_pagamento"
                    value={opt.value}
                    checked={metodoPagamento === opt.value}
                    onChange={() => setMetodoPagamento(opt.value)}
                    className="h-4 w-4 accent-[var(--color-wine)]"
                  />
                  <span className="font-ui text-[0.9rem] font-semibold">{opt.label}</span>
                </span>
                <span className="pl-6 text-[0.78rem] text-[var(--color-muted)]">{opt.hint}</span>
              </label>
            ))}
          </div>

          {metodoPagamento === "bonifico" ? (
            <div className="rounded-[0.9rem] border border-[rgba(47,91,70,0.25)] bg-[rgba(255,253,245,0.6)] p-4">
              <p className="font-ui text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-wine)]">
                Dati per il bonifico
              </p>
              <p className="mt-2 text-[0.88rem] leading-[1.6] text-[var(--color-muted)]">
                Intestato a <strong>A.S.D. Napoli Racing Show</strong>
                <br />
                IBAN: <IbanCopy iban="IT51 X062 3003 5470 0003 5710 069" />
                <br />
                Causale: Pass Giuria Popolare – [Nome Cognome] – [Tipo di Pass]
                {addonDisponibile && addonScelto ? " + Kit Bicchiere" : ""}
                {tipoPass ? ` — Totale €${totale}` : ""}
              </p>
              <div className="mt-4">
                <FileField label="Ricevuta del bonifico" name="ricevuta_file" required />
              </div>
            </div>
          ) : (
            <div className="rounded-[0.9rem] border border-[rgba(47,91,70,0.25)] bg-[rgba(255,253,245,0.6)] p-4">
              <p className="text-[0.88rem] leading-[1.6] text-[var(--color-muted)]">
                Dopo aver inviato l&rsquo;iscrizione, apparirà qui sotto il pulsante PayPal per
                pagare {tipoPass ? `€${totale}` : "l'importo del Pass scelto"}. Il pagamento viene
                verificato automaticamente: riceverai la mail di conferma solo a pagamento
                confermato.
              </p>
            </div>
          )}
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
          {tutteEsaurite ? (
            <p className="font-ui text-[0.86rem] font-semibold uppercase tracking-[0.06em] text-[rgb(153,42,42)]">
              Tutti i posti Giuria Popolare per le 9 Sfide sono esauriti.
            </p>
          ) : null}

          {paypalPhase === "idle" ? (
            <>
              <button
                type="submit"
                disabled={status === "submitting" || tutteEsaurite}
                className="font-ui inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--color-sand)] px-10 text-[1rem] font-bold uppercase tracking-[0.06em] text-[var(--color-ink-strong)] shadow-[0_14px_32px_rgba(255,215,87,0.32)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-px hover:shadow-[0_18px_38px_rgba(255,215,87,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
              >
                {status === "submitting" ? "Invio in corso…" : "🎟️ Invia Iscrizione"}
              </button>

              <FormStatusBanner
                status={status}
                errorMessage={errorMessage}
                successMessage="Iscrizione ricevuta dalla Segreteria Organizzativa. Riceverai una conferma via email."
              />
            </>
          ) : (
            <div className="w-full max-w-[24rem]">
              <p className="font-display text-[1.1rem] text-[var(--color-ink-strong)]">
                Dati ricevuti — completa il pagamento
              </p>
              <p className="mt-1.5 text-[0.86rem] leading-[1.5] text-[var(--color-muted)]">
                Codice iscrizione: <strong>{paypalRequestId}</strong>. Paga con il pulsante qui
                sotto per ricevere la mail di conferma.
              </p>
              <div ref={paypalContainerRef} className="mt-5 min-h-[3rem]" />
              {paypalPhase === "confirming" ? (
                <p className="mt-3 text-[0.86rem] italic text-[var(--color-muted)]">
                  Verifica del pagamento in corso…
                </p>
              ) : null}
              {paypalPhase === "confirm-error" ? (
                <div className="mt-3 rounded-[1rem] border border-[rgba(191,60,60,0.4)] bg-[rgba(191,60,60,0.06)] px-4 py-3 text-center">
                  <p className="text-[0.86rem] font-semibold text-[rgb(153,42,42)]">
                    {errorMessage ?? "Verifica pagamento non riuscita."}
                  </p>
                </div>
              ) : null}
            </div>
          )}
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
