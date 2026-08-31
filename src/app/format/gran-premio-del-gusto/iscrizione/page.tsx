"use client";

import { useState, type FormEvent } from "react";
import {
  CheckboxField,
  FileField,
  FormSectionTitle,
  FormStatusBanner,
  Honeypot,
  TextField,
  TextareaField,
  submitLeadForm,
  type SubmitStatus,
} from "@/components/forms/FormFields";
import { siteConfig } from "@/data/site";

/**
 * Modulo di iscrizione prodotto — Gran Premio del Gusto 2026. Invia i dati
 * (con i 4 allegati) a /forms/lead.php (requestType=iscrizione-prodotto),
 * che li inoltra via email a napoliracingshow@gmail.com (destinatario
 * fisso: richiesta esplicita, non passa dal routing MAIL_TO_* di
 * config.php — vedi commenti in public/forms/lead.php).
 *
 * Nota importante (richiesta esplicita): l'invio del modulo NON garantisce
 * l'ammissione al Concorso — i posti per Sfida sono limitati. Vedi il testo
 * sotto il pulsante di invio.
 */
export default function IscrizioneProdottoPage() {
  const concorsi = siteConfig.sfideAccordion.items.find((i) => i.kind === "iscrivi")?.concorsi ?? [];
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
        <p className="eyebrow text-center">Gran Premio del Gusto 2026</p>
        <h1 className="display-balance mt-4 font-display text-[clamp(1.9rem,4vw,2.6rem)] leading-[1.05] text-[var(--color-ink-strong)]">
          Modulo di Iscrizione Prodotto
        </h1>
        <p className="mt-3 font-display text-[1.1rem] text-[var(--color-wine)]">
          Le Sfide della Magna Grecia
        </p>
        <p className="mt-2 text-[0.94rem] leading-[1.6] text-[var(--color-muted)]">
          27 · 28 · 29 novembre 2026 · Rotonda Diaz – Lungomare Caracciolo – Napoli
        </p>
        <p className="mx-auto mt-6 max-w-[42ch] text-[0.96rem] leading-[1.65] text-[var(--color-muted)]">
          Compila il modulo per candidare il tuo prodotto a uno dei 9 Concorsi del Gran Premio
          del Gusto 2026.
        </p>
        <p className="mx-auto mt-3 max-w-[42ch] text-[0.86rem] leading-[1.6] text-[var(--color-muted)]">
          Le iscrizioni saranno accettate in ordine di arrivo e fino a esaurimento dei posti
          disponibili per ciascuna Sfida.
        </p>
      </div>

      <form
        onSubmit={handleSubmit}
        className="section-shell mx-auto mt-12 flex max-w-[46rem] flex-col gap-14"
      >
        <input type="hidden" name="requestType" value="iscrizione-prodotto" />
        <Honeypot />

        {/* 1. DATI DELL'AZIENDA */}
        <fieldset className="flex flex-col gap-5">
          <FormSectionTitle>1. Dati dell&rsquo;Azienda</FormSectionTitle>
          <TextField label="Ragione sociale" name="ragione_sociale" required />
          <TextField label="Nome commerciale / Brand" name="nome_commerciale" />
          <TextField label="Partita IVA / Codice Fiscale" name="piva" required />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Sede legale — Via/Piazza" name="indirizzo" required />
            <TextField label="Sito web" name="sito_web" type="url" placeholder="https://" />
          </div>
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField label="CAP" name="cap" required />
            <TextField label="Città" name="citta" required />
            <TextField label="Provincia" name="provincia" required maxLength={2} />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="E-mail aziendale" name="email_azienda" type="email" required />
            <TextField label="PEC" name="pec" type="email" />
          </div>
          <TextField label="Telefono" name="telefono_azienda" type="tel" required />
        </fieldset>

        {/* 2. REFERENTE */}
        <fieldset className="flex flex-col gap-5">
          <FormSectionTitle>2. Referente per il Gran Premio del Gusto</FormSectionTitle>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Nome e cognome" name="referente_nome" required />
            <TextField label="Ruolo in azienda" name="referente_ruolo" />
          </div>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Telefono cellulare" name="referente_cellulare" type="tel" required />
            {/* name="email": è anche il campo email globale usato da lead.php per validazione/risposta */}
            <TextField label="E-mail" name="email" type="email" required />
          </div>
        </fieldset>

        {/* 3. CONCORSO */}
        <fieldset className="flex flex-col gap-5">
          <FormSectionTitle>3. Scegli il Concorso</FormSectionTitle>
          <p className="text-[0.88rem] text-[var(--color-muted)]">
            Seleziona una sola Sfida per questa iscrizione: <span className="text-[var(--color-wine)]">*</span>
          </p>
          <div className="grid gap-3 sm:grid-cols-2">
            {concorsi.map((c) => (
              <label
                key={c.name}
                className="flex items-center gap-3 rounded-[0.9rem] border border-[rgba(47,91,70,0.25)] bg-[rgba(255,253,245,0.6)] px-4 py-3 text-[0.92rem] text-[var(--color-ink-strong)]"
              >
                <input
                  type="radio"
                  name="concorso"
                  value={c.name}
                  required
                  className="h-4 w-4 accent-[var(--color-wine)]"
                />
                <span aria-hidden="true">{c.icon}</span>
                {c.name}
              </label>
            ))}
          </div>
          <p className="text-[0.8rem] italic text-[var(--color-muted)]">
            Per partecipare a più Concorsi o iscrivere più prodotti è necessario compilare una
            distinta iscrizione per ciascun prodotto.
          </p>
        </fieldset>

        {/* 4. PRODOTTO */}
        <fieldset className="flex flex-col gap-5">
          <FormSectionTitle>4. Prodotto Presentato</FormSectionTitle>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField label="Nome del prodotto in gara" name="prodotto_nome" required />
            <TextField label="Tipologia / Categoria" name="prodotto_tipologia" required />
          </div>
          <TextField
            label="Denominazione / Indicazione geografica, se prevista"
            name="denominazione"
          />
          <div className="grid gap-5 sm:grid-cols-3">
            <TextField label="Annata, se prevista" name="annata" />
            <TextField label="Gradazione alcolica, se prevista" name="gradazione" />
            <TextField label="Formato confezione / bottiglia" name="formato" />
          </div>
          <TextField label="Territorio / Luogo di produzione" name="territorio_produzione" required />
          <TextareaField
            label="Breve descrizione del prodotto"
            name="descrizione_prodotto"
            required
            rows={4}
            hint="Indicare caratteristiche principali, materie prime, territorio, metodo di produzione ed eventuali elementi distintivi."
          />
        </fieldset>

        {/* 5. PRESENTAZIONE AZIENDA */}
        <fieldset className="flex flex-col gap-5">
          <FormSectionTitle>5. Presentazione dell&rsquo;Azienda</FormSectionTitle>
          <TextareaField
            label="Breve storia dell'azienda"
            name="storia_azienda"
            rows={4}
            hint="Testo che potrà essere utilizzato dall'organizzazione per la presentazione del concorrente durante la Sfida e per la comunicazione dell'evento."
          />
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Nome della persona che presenterà il prodotto durante il Concorso"
              name="presentatore_nome"
              required
            />
            <TextField label="Ruolo / Qualifica" name="presentatore_ruolo" />
          </div>
        </fieldset>

        {/* 6. MATERIALE COMUNICAZIONE */}
        <fieldset className="flex flex-col gap-5">
          <FormSectionTitle>6. Materiale per la Comunicazione</FormSectionTitle>
          <FileField label="Logo aziendale" name="logo_file" required />
          <FileField label="Foto del prodotto" name="foto_prodotto_file" required />
          <FileField label="Eventuale brochure / scheda tecnica del prodotto" name="brochure_file" />
        </fieldset>

        {/* 7. QUOTA */}
        <fieldset className="flex flex-col gap-5 rounded-[1.1rem] border border-[rgba(255,215,87,0.45)] bg-[rgba(255,253,245,0.7)] p-6 text-center">
          <FormSectionTitle>7. Quota di Iscrizione</FormSectionTitle>
          <p className="font-ui text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-[var(--color-sand-strong)]">
            Un prodotto · Un Concorso
          </p>
          <p className="font-display text-[2.2rem] text-[var(--color-wine)]">€ 1.100 + IVA 22%</p>
          <p className="font-ui text-[0.9rem] font-semibold text-[var(--color-ink-strong)]">
            Totale da versare: € 1.342
          </p>
          <p className="text-[0.86rem] leading-[1.55] text-[var(--color-muted)]">
            La quota comprende l&rsquo;iscrizione di un singolo prodotto a un singolo Concorso del
            Gran Premio del Gusto 2026. Per iscrivere più prodotti e/o partecipare a più Concorsi
            dovrà essere effettuata una distinta iscrizione per ciascun prodotto.
          </p>
          <div className="mt-2 rounded-[0.9rem] border border-[rgba(47,91,70,0.25)] bg-[var(--color-ivory)] p-4 text-left">
            <p className="font-ui text-[0.78rem] font-semibold uppercase tracking-[0.08em] text-[var(--color-wine)]">
              Pagamento
            </p>
            <p className="mt-2 text-[0.88rem] leading-[1.6] text-[var(--color-muted)]">
              Bonifico bancario intestato a <strong>A.S.D. Napoli Racing Show</strong>
              <br />
              IBAN: <strong>IT51 X062 3003 5470 0003 5710 069</strong>
              <br />
              Causale: Gran Premio del Gusto 2026 – [Nome Azienda] – [Nome Prodotto] – [Concorso]
            </p>
          </div>
          <FileField label="Ricevuta del bonifico" name="ricevuta_file" required />
          <p className="text-[0.8rem] italic text-[var(--color-muted)]">
            L&rsquo;iscrizione sarà considerata perfezionata solo dopo la ricezione del presente
            modulo correttamente compilato e della relativa quota di iscrizione.
          </p>
        </fieldset>

        {/* 8. DICHIARAZIONI */}
        <fieldset className="flex flex-col gap-4">
          <FormSectionTitle>8. Dichiarazioni dell&rsquo;Azienda</FormSectionTitle>
          <p className="text-[0.86rem] leading-[1.55] text-[var(--color-muted)]">
            Il sottoscritto, in qualità di legale rappresentante o soggetto autorizzato
            dall&rsquo;azienda partecipante:
          </p>
          <CheckboxField name="dich_1" required>
            dichiara che le informazioni inserite nel presente modulo sono veritiere e corrette;
          </CheckboxField>
          <CheckboxField name="dich_2" required>
            dichiara che il prodotto iscritto è conforme alla normativa vigente applicabile alla
            relativa categoria merceologica;
          </CheckboxField>
          <CheckboxField name="dich_3" required>
            dichiara di essere autorizzato a iscrivere il prodotto e a utilizzare il nome, il
            marchio, il logo, le immagini e il materiale fornito;
          </CheckboxField>
          <CheckboxField name="dich_4" required>
            autorizza l&rsquo;organizzazione a utilizzare gratuitamente nome dell&rsquo;azienda,
            marchio, logo, immagini e informazioni relative al prodotto ai fini della promozione e
            comunicazione del Gran Premio del Gusto 2026;
          </CheckboxField>
          <CheckboxField name="dich_5" required>
            dichiara di aver preso visione e di accettare il Regolamento del Gran Premio del Gusto
            2026 e le modalità di svolgimento della manifestazione;
          </CheckboxField>
          <CheckboxField name="dich_6" required>
            prende atto che programmi, orari e modalità organizzative potranno subire variazioni
            per esigenze tecniche, organizzative, di sicurezza o per cause di forza maggiore;
          </CheckboxField>
          <CheckboxField name="dich_7" required>
            si impegna a fornire nei tempi e nelle quantità comunicate dall&rsquo;organizzazione i
            prodotti necessari allo svolgimento della degustazione e della competizione.
          </CheckboxField>
        </fieldset>

        {/* 9. PRIVACY */}
        <fieldset className="flex flex-col gap-4">
          <FormSectionTitle>9. Privacy</FormSectionTitle>
          <CheckboxField name="privacy_consent" required>
            Ho letto l&rsquo;<a href="/social/privacy.html" className="underline">Informativa Privacy</a>{" "}
            e autorizzo il trattamento dei dati personali forniti ai fini della gestione
            dell&rsquo;iscrizione e della partecipazione al Gran Premio del Gusto 2026, secondo la
            normativa vigente.
          </CheckboxField>
          <CheckboxField name="marketing_consent">
            Acconsento a ricevere comunicazioni relative alle attività e alle future iniziative
            del Gran Premio del Gusto e del Napoli Racing Show.
          </CheckboxField>
          <div className="grid gap-5 sm:grid-cols-2">
            <TextField
              label="Nome e cognome del Legale Rappresentante / soggetto autorizzato"
              name="legale_rappresentante"
              required
            />
            <TextField label="Luogo e data" name="luogo_data" required />
          </div>
        </fieldset>

        <div className="flex flex-col items-center gap-4 border-t border-[rgba(255,215,87,0.3)] pt-10 text-center">
          <button
            type="submit"
            disabled={status === "submitting"}
            className="font-ui inline-flex h-14 items-center justify-center gap-2 rounded-full bg-[var(--color-sand)] px-10 text-[1rem] font-bold uppercase tracking-[0.06em] text-[var(--color-ink-strong)] shadow-[0_14px_32px_rgba(255,215,87,0.32)] transition-[transform,box-shadow] duration-300 ease-out hover:-translate-y-px hover:shadow-[0_18px_38px_rgba(255,215,87,0.4)] disabled:cursor-not-allowed disabled:opacity-60"
          >
            {status === "submitting" ? "Invio in corso…" : "🏆 Invia Iscrizione Prodotto"}
          </button>

          <FormStatusBanner
            status={status}
            errorMessage={errorMessage}
            successMessage="La tua iscrizione è stata inviata alla Segreteria Organizzativa. Riceverai una conferma via email."
          />

          <p className="mx-auto max-w-[46ch] text-[0.82rem] italic leading-[1.6] text-[var(--color-muted)]">
            L&rsquo;invio del modulo non garantisce automaticamente l&rsquo;ammissione al
            Concorso. La Segreteria Organizzativa verificherà la disponibilità dei posti nella
            Sfida prescelta, la completezza della documentazione e l&rsquo;avvenuto pagamento. A
            iscrizione accettata, l&rsquo;azienda riceverà una conferma ufficiale dalla Segreteria
            Organizzativa.
          </p>
        </div>
      </form>

      <div className="section-shell mx-auto mt-14 max-w-[42rem] border-t border-[rgba(255,215,87,0.3)] pt-8 text-center">
        <p className="font-ui text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-[var(--color-sand-strong)]">
          Hai bisogno di informazioni?
        </p>
        <p className="mt-3 text-[0.92rem] leading-[1.6] text-[var(--color-muted)]">
          Segreteria Organizzativa – Gran Premio del Gusto 2026 · Napoli Racing Show
          <br />
          E-mail:{" "}
          <a href="mailto:napoliracingshow@gmail.com" className="font-semibold text-[var(--color-wine)]">
            napoliracingshow@gmail.com
          </a>
        </p>
      </div>
    </section>
  );
}
