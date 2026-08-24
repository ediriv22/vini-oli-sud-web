# Editor visuale del pannello segreteria (`/admin`)

Questo documento descrive l'editor visuale aggiunto all'admin, come funziona
e come usarlo. Nessun database, nessun backend nuovo: tutto passa per i file
JSON in `content/settings/`, il commit via GitHub Contents API e il deploy FTP
esistente.

## Cosa fa

1. **Ordine e visibilità delle sezioni Home** — l'ordine delle 9 sezioni della
   home non è più fisso nel codice: è in `content/settings/home-layout.json`.
   Dall'area admin *"Ordine e visibilità delle sezioni Home"* la segretaria le
   riordina (frecce ▲▼) e le mostra/nasconde (interruttore) senza perderne il
   contenuto.
2. **Anteprima del sito pubblicato** — un iframe della home online, con banner
   che ricorda che le modifiche compaiono dopo la pubblicazione (~1–2 minuti).
3. **Modifica visuale (click-to-edit)** — nell'area *"Sezioni Home"*, attivando
   l'interruttore *"Modifica visuale"*, si clicca un testo nell'anteprima e il
   pannello salta ed evidenzia il campo corrispondente nel modulo.

## Come funziona (architettura)

Il sito resta **export statico**. L'editing NON avviene sul sito pubblico: è un
livello che si attiva solo dentro il pannello.

- **Annotazioni** — i componenti in `src/components/sections/*` marcano gli
  elementi editabili con `data-content-key`:
  - `sec:<chiave>` sul `<section>` (es. `sec:sponsor`);
  - `field:<path>` sui testi legati al JSON (es. `field:philosophy.eyebrow`),
    dove `<path>` rispecchia la struttura di `home-sections.json`.
  Sono attributi **inerti**: nessun effetto sul sito pubblico.
- **Ponte lato sito** — `src/components/VisualEditorBridge.tsx` si attiva SOLO
  se la home è aperta con `?editor=1`. Evidenzia gli elementi annotati e, al
  click, invia al frame genitore un `postMessage { source:"vos-editor", key }`.
- **Lato admin** (`public/admin/index.php`) — l'iframe di anteprima viene
  ricaricato con `?editor=1`; un listener accetta i messaggi provenienti solo
  da quell'iframe (`ev.source === iframe.contentWindow`) e:
  - `field:<path>` → trova il controllo con `data-content-path="<path>"`
    (derivato dal name del campo via `path_from_name()`), ci salta e lo
    evidenzia;
  - `sec:<chiave>` → salta al gruppo `#sec-<chiave>` del modulo.

### Requisito: stessa origine
In produzione `/admin` e `/` vivono entrambi sotto `www.vinisud.it`, quindi il
`postMessage` tra anteprima e pannello funziona. La modifica visuale opera sul
**sito già pubblicato**: dopo il deploy di questa versione, l'anteprima con
`?editor=1` include il ponte e il click-to-edit è attivo.

## Note per lo sviluppo / rollout

- `content/settings/home-layout.json` deve stare nel repo: è letto a build-time
  da `src/data/homeLayout.ts` (`resolveHomeLayout()` fonde l'ordine del file con
  quello canonico ed è resiliente a chiavi mancanti/sconosciute).
- Aggiungere una nuova sezione: creare il componente, registrarlo in
  `SECTION_REGISTRY` (`src/app/page.tsx`), aggiungere la chiave a
  `CANONICAL_SECTION_ORDER` (`src/data/homeLayout.ts`) e a `$SECTION_NAMES`
  (`public/admin/index.php`); annotarne gli elementi con `data-content-key`.
- Il primo salvataggio dall'area "Ordine sezioni" crea `home-layout.json` se non
  esiste ancora (l'admin mostra intanto il default: tutte le sezioni attive).

## Limiti attuali (possibili estensioni)

- Il click-to-edit apre/evidenzia il campo nel modulo; non è ancora editing
  inline (WYSIWYG) direttamente sull'anteprima.
- Il riordino via drag *dentro* l'anteprima non c'è: si usa ▲▼ nell'area
  "Ordine sezioni".
- Immagini/colori delle sezioni sono annotati solo a livello di sezione, non
  campo per campo.
