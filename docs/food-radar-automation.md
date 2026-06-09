# Automazione Diario del Sud

- Il Food Radar Sud Italia deve produrre un JSON con gli item selezionati.
- Lo script `import-food-radar.mjs` valida il JSON.
- Il file generato finale è `src/data/foodRadar.generated.json`.
- La pagina `/diario-del-sud` si aggiorna automaticamente quando il JSON cambia.
- Non si pubblicano articoli completi.
- Ogni card rimanda alla fonte originale.
- Le note editoriali devono essere brevi e scritte da Vini Oli Sud.

## Pipeline

1. **Food Radar esterno** raccoglie le notizie e prepara una rassegna.
2. Un curator esporta le voci selezionate in un file JSON locale (esempio:
   `docs/food-radar-latest.json`).
3. Lo script di import valida, normalizza, deduplica, ordina e scrive il file
   pubblicabile su `src/data/foodRadar.generated.json`.
4. Commit del JSON generato → deploy → la pagina si aggiorna.

## Comandi

Importare un batch JSON già pronto:

```bash
npm run radar:import -- docs/food-radar-latest.json
```

Importare direttamente un export CSV del foglio Google "Food Radar Sud Italia"
(File → Scarica → Valori separati da virgola):

```bash
npm run radar:import:csv -- docs/food-radar-sheet-snapshot.csv
# soglia di rilevanza personalizzata (default 6):
npm run radar:import:csv -- docs/food-radar-sheet-snapshot.csv --min-relevance 7
```

Validare il JSON attualmente pubblicato senza riscrivere nulla:

```bash
npm run radar:validate
```

Dopo l'import, costruire il sito:

```bash
npm run build
```

### Mappatura categorie del foglio → categorie del Diario

| Categoria foglio    | Categoria Diario        |
| ------------------- | ----------------------- |
| Vino                | Calici di Magna Grecia  |
| Olio                | Oro Verde               |
| Business/Export     | Business con Anima      |
| Territorio/Eventi   | Territori               |
| Food                | Radar del Sud           |
| Gastro Sud          | Radar del Sud           |
| Test (o vuota)      | scartata                |

### Note sulle "Note Editoriali" del foglio

La colonna `Note Editoriali` / `Spunto Social` del foglio contiene
prompt operativi (es. *"Spunto: partire dal tema 'Vino' e raccontare
perché questa notizia conta per Sicilia…"*), non note editoriali finite.

Lo script CSV genera quindi una nota neutra deterministica:

```
Segnalazione dal radar editoriale Vini Oli Sud · tema: vino · focus: Sicilia.
```

Per la versione pubblica, sostituire le `note` dei singoli item direttamente in
`src/data/foodRadar.generated.json` con frasi editoriali brevi scritte a mano
(una riga, max 220 caratteri, sempre attribuibili a Vini Oli Sud).

## Formato JSON di input

Array di item con i campi seguenti. `id` è opzionale: se manca, lo script lo
genera come hash stabile dell'URL.

```json
[
  {
    "category": "Oro Verde",
    "title": "Titolo della notizia",
    "source": "Nome fonte",
    "date": "2026-05-16",
    "url": "https://...",
    "note": "Perché questa notizia è rilevante per Vini Oli Sud."
  }
]
```

Esempio completo (placeholder, non pubblicabile): `docs/food-radar-latest.example.json`.

## Regole di validazione

Lo script scarta gli item non conformi e stampa un warning chiaro per ognuno;
gli altri item del batch continuano a essere processati. Il batch si interrompe
solo se il file JSON è illeggibile o non è un array.

- `title` obbligatorio, massimo 160 caratteri.
- `source` obbligatorio.
- `url` obbligatorio, deve iniziare con `http://` o `https://`.
- `note` obbligatoria, massimo 220 caratteri.
- `category` deve essere una tra: `Oro Verde`, `Calici di Magna Grecia`,
  `Radar del Sud`, `Business con Anima`, `Territori`.
- `date` opzionale; se presente deve essere ISO o `YYYY-MM-DD`.
- Dedup per `url` (case-insensitive): si conserva la prima occorrenza.
- Ordinamento per `date` discendente (gli item senza data finiscono in coda).
- Massimo 30 item pubblicati: gli eccedenti più vecchi vengono scartati.
- Nessun body articolo, nessun contenuto lungo copiato dalla fonte.

## Regole editoriali

- Il Diario del Sud pubblica solo titolo, fonte, data se disponibile,
  categoria, link e nota editoriale "Perché ci interessa".
- Le note sono scritte da Vini Oli Sud, sintetiche e di contesto.
- Mai presentare le notizie come contenuti propri: il link rimanda alla fonte.
- Mai inventare date, fonti o categorie.

## Note di sicurezza

- Nessuna credenziale Gmail nel repository.
- Nessun fetch a Gmail dal browser.
- Nessuna API route Gmail nel sito.
- L'automazione corretta è: Food Radar esterno → JSON → script di import →
  commit/deploy.

## Modalità "auto-commit" da Apps Script (opzione 1)

Per chiudere il loop end-to-end (Apps Script genera la rassegna e committa
direttamente il JSON pubblicato) c'è un bridge dedicato:
`docs/apps-script/diario-del-sud-github-bridge.gs`.

Pipeline risultante:

```
Food Radar Sud Italia (Apps Script · trigger giornaliero)
  → scrive nel Google Sheet + manda email
  → filtra/normalizza/dedup gli stessi item per il Diario
  → commit GitHub Contents API su src/data/foodRadar.generated.json
  → deploy parte da solo (Vercel/Netlify/altro)
```

### Setup PAT (una sola volta)

1. GitHub → Settings → Developer settings → Personal access tokens →
   Fine-grained tokens → **Generate new token**.
2. Resource owner: `ediriv22`.
3. Repository access: **Only select repositories** → `vini-oli-sud-web`.
4. Repository permissions → **Contents: Read and write**.
5. Scadenza ≤ 90 giorni (poi va rinnovato).
6. Copia il token (GitHub lo mostra una sola volta).
7. In Apps Script: **Impostazioni progetto → Proprietà script →
   Aggiungi proprietà** · Nome `GITHUB_PAT` · Valore `<token>`.

Il token non viene mai stampato nei log e non finisce mai nel foglio.

### Cosa fa il bridge

- Legge `src/data/foodRadar.generated.json` dal branch `main`.
- Converte i record del run in item del Diario applicando gli stessi filtri
  dello script Node: rilevanza ≥ 6, mapping categoria foglio → categoria
  Diario, URL `http(s)` non `example.com`, titolo ≤ 200, nota neutra.
- Merge per `id` (hash stabile dell'URL): se un item è già pubblicato non
  viene toccato, quindi eventuali `note` riscritte a mano nel JSON
  sopravvivono al run successivo.
- Dedup per URL, sort per data discendente, limite **30 item più recenti**
  (gli eccedenti cadono fuori dal Diario; restano nel foglio).
- Commit solo se il JSON è davvero cambiato (idempotente).

### Cosa rinunci con l'opzione 1

- Niente revisione umana prima del deploy: quello che lo script considera
  "rilevante" entra in produzione automaticamente.
- Una nota generata in modo deterministico non è una nota editoriale curata:
  se vuoi rifinirle, modifichi il campo `note` direttamente nel JSON sul
  repo; il bridge non sovrascrive gli item esistenti per `id`.
- Se cambi la struttura di `FoodRadarItem` o le 5 categorie, devi aggiornare
  in parallelo `scripts/import-food-radar-csv.mjs`, `src/data/foodRadar.ts`
  e `docs/apps-script/diario-del-sud-github-bridge.gs`.
