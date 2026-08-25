# Guida al pannello /admin — Vini & OliSud

Guida pratica per chi aggiorna il sito dalla segreteria. Non serve saper
programmare: si modifica il sito **vedendolo**, poi si clicca **Pubblica**.

> Come funziona in breve: il pannello salva le modifiche e le manda online da
> solo. Le modifiche **non** compaiono subito sul sito pubblico: appaiono dopo
> la pubblicazione, di solito in **1–2 minuti**. Tutto è salvato in modo
> versionato: se qualcosa va storto, si può sempre tornare indietro.

---

## 1. Entrare nel pannello

1. Vai su **`https://www.vinisud.it/admin`**
2. Inserisci la **password** della segreteria e clicca **Entra**.

Non condividere la password. Se la dimentichi o va cambiata, la imposta il
responsabile del sito (è nel file `config.php` sul server, non nel pannello).

Dopo l'accesso si apre la **Canva**: la home del sito, modificabile direttamente.

---

## 2. La Canva (schermata principale)

La Canva mostra la home vera dentro un riquadro. In alto c'è la barra con il
pulsante **Pubblica**; sotto, una **legenda** che ricorda le 4 azioni.

### ✎ Modificare un testo
1. **Clicca sul testo** che vuoi cambiare (titolo, paragrafo, ecc.): appare un
   bordo e puoi scrivere direttamente.
2. Scrivi la modifica. Premi **Invio** (o clicca fuori) per confermare.
3. In alto vedrai il contatore aggiornarsi (“1 modifica non pubblicata”, ecc.).

### ⠿ / ▲▼ Spostare una sezione
Ogni sezione ha in alto a destra una piccola barra di strumenti (compare
passandoci sopra).
- **Trascina la maniglia ⠿** per spostare la sezione dove vuoi, **oppure**
- usa le **frecce ▲▼** per spostarla su/giù di un posto.

### 👁 Nascondere o mostrare una sezione
Clicca l'**occhio 👁** nella barra della sezione per nasconderla (il contenuto
**non** si perde: resta salvato e potrai rimostrarla quando vuoi). Una sezione
nascosta appare in grigio con l'etichetta “Sezione nascosta”.

### ⚙ Immagini e colori
Clicca l'**ingranaggio ⚙** di una sezione: si apre a lato il pannello
**Proprietà**. Da qui, per le sezioni che lo prevedono (oggi **Copertina** e
**Grand Prix**), puoi:
- **caricare un'immagine di sfondo** (JPG/PNG/WebP, max 6MB) — vedi subito
  l'anteprima;
- **scegliere un colore** di sfondo;
- regolare l'**intensità dell'ombreggiatura** (Copertina).

Le sezioni senza queste opzioni mostrano un messaggio: per quelle si modificano
solo i testi (direttamente sulla Canva).

### Pubblicare
Quando sei soddisfatta, clicca **Pubblica** in alto. Il pannello salva tutto e
il sito si aggiorna da solo in 1–2 minuti. Se non hai fatto modifiche, il
pulsante resta spento.

### Annullare
**Annulla** scarta le modifiche non ancora pubblicate e ricarica la Canva com'è
online adesso. (Se provi a uscire con modifiche non pubblicate, il browser ti
avvisa.)

---

## 3. Modifica avanzata (le aree classiche)

Dalla Canva, in alto, il link **“Modifica avanzata →”** apre il menu con le aree
tradizionali (a moduli). Servono per i casi che la Canva non copre ancora:

- **Generale & Home** — nome del sito, descrizione (per Google), email di
  contatto, **font** del sito, **favicon** (l'iconcina della scheda), immagine e
  ombreggiatura della copertina, sfondo della sezione Grand Prix.
- **Ordine e visibilità delle sezioni Home** — riordino con frecce ▲▼ e
  interruttori mostra/nascondi (la stessa cosa della Canva, in versione lista).
- **Sezioni Home** — tutti i testi di ogni sezione in un unico modulo lungo:
  utile per modifiche estese o per campi non raggiungibili dalla Canva (es.
  aggiungere/togliere una voce da un elenco, i testi dei pulsanti).

In ogni area: modifichi, clicchi **Pubblica**, e il sito si aggiorna in pochi
minuti — esattamente come nella Canva.

---

## 4. Cosa **non** si fa (per ora) dalla Canva

Queste operazioni si fanno da **Modifica avanzata** (o le chiede al
responsabile):
- Aggiungere, rimuovere o duplicare intere sezioni.
- Aggiungere/togliere voci dentro un elenco (es. una regione, una categoria).
- Cambiare i **link** dei pulsanti (sono protetti apposta, per non romperli).

---

## 5. Domande frequenti

**Ho sbagliato, ho già pubblicato. Si recupera?**
Sì. Ogni pubblicazione è salvata come versione su GitHub: il responsabile del
sito può ripristinare la versione precedente.

**Quanto ci mette ad andare online?**
In genere 1–2 minuti dopo “Pubblica”. Ricarica la pagina pubblica per vedere il
risultato.

**Le persone vedono le mie modifiche mentre lavoro?**
No. Vedono solo ciò che è **pubblicato**. Finché non clicchi Pubblica, stai
lavorando su una bozza visibile solo a te nel pannello.

**Il testo che scrivo può “rompere” il sito?**
No: dalla Canva puoi cambiare solo i testi già esistenti (non la struttura), e
il testo viene inserito in modo sicuro (niente codice).

**Posso caricare qualsiasi immagine?**
Formati JPG, PNG o WebP, fino a 6MB. Meglio immagini già ottimizzate per il web.

---

Per i dettagli tecnici (come è fatto, come si estende) vedi
[`EDITOR-VISUALE.md`](EDITOR-VISUALE.md).
