#!/usr/bin/env node
/**
 * import-food-radar-csv.mjs
 *
 * Legge il CSV esportato dal foglio "Food Radar Sud Italia" e scrive
 * src/data/foodRadar.generated.json. Mappa le categorie del foglio
 * sulla tassonomia editoriale di Vini Oli Sud.
 *
 * Uso:
 *   node scripts/import-food-radar-csv.mjs <file.csv> [--min-relevance N]
 *   npm run radar:import:csv -- docs/food-radar-sheet-snapshot.csv
 *
 * Filtri:
 *   - Stato vuoto o "Test" → scartato.
 *   - Categoria non mappata → scartata con warning.
 *   - URL non http(s) o su example.com → scartata.
 *   - Rilevanza < soglia (default 6) → scartata.
 *   - dedup per URL, sort per date desc, limit 30.
 *
 * Note editoriali:
 *   La colonna "Note Editoriali" / "Spunto Social" del foglio contiene
 *   prompt operativi (es. "Spunto: partire dal tema 'Vino' …"), non note
 *   editoriali finite. Per non pubblicarle così come sono, lo script genera
 *   una nota neutra deterministica del tipo:
 *
 *     "Segnalazione dal radar editoriale Vini Oli Sud · tema: vino · focus: Sicilia."
 *
 *   Sostituire le note una per una direttamente in src/data/foodRadar.generated.json
 *   (o riscrivere il foglio con note davvero editoriali) per la versione finale.
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const projectRoot = resolve(dirname(__filename), "..");
const OUTPUT_PATH = resolve(projectRoot, "src/data/foodRadar.generated.json");

const MAX_ITEMS = 30;
const MAX_TITLE = 200;
const MAX_NOTE = 220;

const ALLOWED_CATEGORIES = new Set([
  "Oro Verde",
  "Calici di Magna Grecia",
  "Radar del Sud",
  "Business con Anima",
  "Territori",
]);

const CATEGORY_MAP = {
  Vino: "Calici di Magna Grecia",
  Olio: "Oro Verde",
  "Business/Export": "Business con Anima",
  "Territorio/Eventi": "Territori",
  Food: "Radar del Sud",
  "Gastro Sud": "Radar del Sud",
};

function parseArgs(argv) {
  const args = argv.slice(2);
  let inputPath;
  let minRelevance = 6;
  for (let i = 0; i < args.length; i++) {
    const arg = args[i];
    if (arg === "--min-relevance") {
      const next = args[i + 1];
      const parsed = Number(next);
      if (Number.isFinite(parsed)) {
        minRelevance = parsed;
        i++;
      }
    } else if (!arg.startsWith("--")) {
      inputPath = inputPath ?? arg;
    }
  }
  return { inputPath, minRelevance };
}

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function warn(message) {
  console.warn(`! ${message}`);
}

function parseCsv(text) {
  const rows = [];
  let row = [];
  let field = "";
  let inQuotes = false;
  let i = 0;
  while (i < text.length) {
    const c = text[i];
    if (inQuotes) {
      if (c === '"') {
        if (text[i + 1] === '"') {
          field += '"';
          i += 2;
          continue;
        }
        inQuotes = false;
        i++;
        continue;
      }
      field += c;
      i++;
      continue;
    }
    if (c === '"') {
      inQuotes = true;
      i++;
      continue;
    }
    if (c === ",") {
      row.push(field);
      field = "";
      i++;
      continue;
    }
    if (c === "\n") {
      row.push(field);
      rows.push(row);
      row = [];
      field = "";
      i++;
      continue;
    }
    if (c === "\r") {
      i++;
      continue;
    }
    field += c;
    i++;
  }
  if (field !== "" || row.length > 0) {
    row.push(field);
    rows.push(row);
  }
  return rows;
}

// Pulizia "safe": decodifica entità HTML rimaste, normalizza spazi e
// virgolette, rimuove tag HTML residui. Non corregge errori semantici:
// quello richiede un editor umano.
function cleanText(value) {
  if (value == null) return "";
  let out = String(value);
  out = out
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, "<")
    .replace(/&gt;/gi, ">")
    .replace(/&hellip;/gi, "…")
    .replace(/&mdash;/gi, "—")
    .replace(/&ndash;/gi, "–")
    .replace(/<[^>]+>/g, " ")
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, " ")
    .trim();
  return out;
}

// Heuristics conservative: bloccano solo pattern quasi certamente errati.
function looksBroken(value) {
  if (!value) return true;
  if (/[<>]/.test(value)) return "tag/entity HTML residuo";
  if (/(.)\1{4,}/.test(value)) return "carattere ripetuto 5+ volte";
  if (/[A-Z0-9]{40,}/.test(value)) return "blocco maiuscole/numeri molto lungo";
  return false;
}

// Note editoriali per categoria del foglio. Niente "tema:/focus:" stile metadati.
// Restano frasi neutre, brevi, fattuali, attribuibili a Vini Oli Sud.
function autoEditorialNote(sheetCategory, area) {
  const focus = area && area !== "Sud Italia / Mediterraneo" ? area : null;
  const focusSuffix = focus ? `, focus ${focus}` : "";
  switch (sheetCategory) {
    case "Vino":
      return focus
        ? `Una voce dal mondo del vino${focusSuffix}.`
        : "Una voce dal mondo del vino del Sud.";
    case "Olio":
      return focus
        ? `Un segnale dall'olio del Sud${focusSuffix}.`
        : "Un segnale dall'olio del Sud.";
    case "Food":
      return focus
        ? `Una segnalazione di cucina${focusSuffix}.`
        : "Una segnalazione di cucina del Sud.";
    case "Gastro Sud":
      return focus
        ? `Una segnalazione gastronomica del Sud${focusSuffix}.`
        : "Una segnalazione gastronomica del Sud.";
    case "Business/Export":
      return focus
        ? `Un segnale di mercato per le eccellenze del Sud${focusSuffix}.`
        : "Un segnale di mercato per le eccellenze del Sud.";
    case "Territorio/Eventi":
      return focus
        ? `Una notizia dal calendario dei territori${focusSuffix}.`
        : "Una notizia dal calendario dei territori del Sud.";
    default:
      return focus
        ? `In rassegna nel radar di Vini Oli Sud${focusSuffix}.`
        : "In rassegna nel radar di Vini Oli Sud.";
  }
}

function parseSheetDate(value) {
  if (!value) return undefined;
  const trimmed = value.trim();
  const match = trimmed.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})/);
  if (!match) return undefined;
  const [, dd, mm, yyyy] = match;
  const day = dd.padStart(2, "0");
  const month = mm.padStart(2, "0");
  return `${yyyy}-${month}-${day}`;
}

function stableId(url) {
  return createHash("sha1").update(url).digest("hex").slice(0, 12);
}

function dedupeByUrl(items) {
  const seen = new Map();
  for (const item of items) {
    const key = item.url.toLowerCase();
    if (!seen.has(key)) {
      seen.set(key, item);
    } else {
      warn(`URL duplicato ignorato: ${item.url}`);
    }
  }
  return [...seen.values()];
}

function sortByDateDesc(items) {
  return items.slice().sort((a, b) => {
    if (a.date && b.date) {
      return a.date < b.date ? 1 : a.date > b.date ? -1 : 0;
    }
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });
}

function writeOutput(items) {
  mkdirSync(dirname(OUTPUT_PATH), { recursive: true });
  const json = `${JSON.stringify(items, null, 2)}\n`;
  writeFileSync(OUTPUT_PATH, json, "utf8");
}

function main() {
  const { inputPath, minRelevance } = parseArgs(process.argv);
  if (!inputPath) {
    fail(
      "Percorso CSV mancante.\nUso: node scripts/import-food-radar-csv.mjs <file.csv> [--min-relevance N]",
    );
  }

  const resolvedInput = resolve(process.cwd(), inputPath);
  let raw;
  try {
    raw = readFileSync(resolvedInput, "utf8");
  } catch (error) {
    fail(`Impossibile leggere "${inputPath}": ${error.message}`);
    return;
  }

  const rows = parseCsv(raw);
  if (rows.length < 2) {
    fail(`Il CSV "${inputPath}" non contiene righe dati.`);
  }

  const header = rows[0].map((h) => h.trim());
  const idx = (name) => header.indexOf(name);
  const col = {
    data: idx("Data"),
    titolo: idx("Titolo Notizia"),
    link: idx("Link"),
    fonte: idx("Fonte RSS"),
    categoria: idx("Categoria"),
    regione: idx("Regione/Area"),
    rilevanza: idx("Rilevanza"),
    stato: idx("Stato"),
  };
  for (const [key, value] of Object.entries(col)) {
    if (value === -1) {
      fail(`Colonna mancante nell'header del CSV: "${key}".`);
    }
  }

  let skipped = 0;
  const normalized = [];
  for (let r = 1; r < rows.length; r++) {
    const row = rows[r];
    if (row.length === 1 && row[0].trim() === "") continue;

    const title = cleanText(row[col.titolo]);
    const url = (row[col.link] ?? "").trim();
    const source = cleanText(row[col.fonte]);
    const rawCategory = cleanText(row[col.categoria]);
    const region = cleanText(row[col.regione]);
    const rilevanzaRaw = (row[col.rilevanza] ?? "").trim();
    const stato = cleanText(row[col.stato]);
    const date = parseSheetDate(row[col.data]);

    const titleBroken = looksBroken(title);
    if (titleBroken) {
      warn(`Riga ${r + 1} scartata (titolo sospetto: ${titleBroken}).`);
      skipped++;
      continue;
    }

    if (!title) {
      skipped++;
      continue;
    }
    if (!stato) {
      skipped++;
      continue;
    }
    if (rawCategory.toLowerCase() === "test") {
      skipped++;
      continue;
    }
    if (!url || !/^https?:\/\//i.test(url) || /example\.com/i.test(url)) {
      warn(`Riga ${r + 1} "${title.slice(0, 60)}": URL scartato (${url}).`);
      skipped++;
      continue;
    }
    if (title.length > MAX_TITLE) {
      warn(`Riga ${r + 1} scartata: titolo oltre ${MAX_TITLE} caratteri.`);
      skipped++;
      continue;
    }
    const rilevanza = Number(rilevanzaRaw);
    if (!Number.isFinite(rilevanza)) {
      warn(`Riga ${r + 1} "${title.slice(0, 60)}": rilevanza non numerica.`);
      skipped++;
      continue;
    }
    if (rilevanza < minRelevance) {
      skipped++;
      continue;
    }
    const mapped = CATEGORY_MAP[rawCategory];
    if (!mapped || !ALLOWED_CATEGORIES.has(mapped)) {
      warn(
        `Riga ${r + 1} "${title.slice(0, 60)}": categoria "${rawCategory}" non mappata.`,
      );
      skipped++;
      continue;
    }

    const note = autoEditorialNote(rawCategory, region);
    if (note.length > MAX_NOTE) {
      warn(`Riga ${r + 1}: nota generata oltre ${MAX_NOTE} caratteri.`);
      skipped++;
      continue;
    }

    const item = {
      id: stableId(url),
      category: mapped,
      title,
      source: source || "Fonte non indicata",
      url,
      note,
      noteSource: "auto",
    };
    if (date) item.date = date;
    normalized.push(item);
  }

  const deduped = dedupeByUrl(normalized);
  const sorted = sortByDateDesc(deduped);
  const limited = sorted.slice(0, MAX_ITEMS);

  if (sorted.length > MAX_ITEMS) {
    warn(
      `Limitati a ${MAX_ITEMS} item (scartati ${sorted.length - MAX_ITEMS} più vecchi).`,
    );
  }

  console.log(
    `→ Righe CSV: ${rows.length - 1} · Scartate (filtri/relevance<${minRelevance}): ${skipped} · Uniche valide: ${deduped.length} · Pubblicate: ${limited.length}`,
  );

  writeOutput(limited);
  console.log(`✓ Scritto ${OUTPUT_PATH} (${limited.length} item).`);
}

main();
