#!/usr/bin/env node
/**
 * import-food-radar.mjs
 *
 * Valida un JSON di item del Food Radar Sud Italia e scrive
 * src/data/foodRadar.generated.json, che alimenta la pagina /diario-del-sud.
 *
 * Uso:
 *   node scripts/import-food-radar.mjs <input.json>
 *   npm run radar:import -- docs/food-radar-latest.json
 *
 *   node scripts/import-food-radar.mjs --check <file.json>
 *   npm run radar:validate
 *     → valida il file senza riscrivere il JSON generato.
 *
 * Regole:
 *   - dedup per URL;
 *   - id stabile (sha1 del URL) se mancante;
 *   - ordina per date discendente quando presente;
 *   - limita a 30 item;
 *   - scarta gli item invalidi con warning, non interrompe il batch.
 */

import { createHash } from "node:crypto";
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const projectRoot = resolve(__dirname, "..");
const OUTPUT_PATH = resolve(projectRoot, "src/data/foodRadar.generated.json");
const MAX_ITEMS = 30;
const MAX_TITLE = 160;
const MAX_NOTE = 220;

const ALLOWED_CATEGORIES = new Set([
  "Oro Verde",
  "Calici di Magna Grecia",
  "Radar del Sud",
  "Business con Anima",
  "Territori",
]);

const ISO_DATE = /^\d{4}-\d{2}-\d{2}(?:[T ]\d{2}:\d{2}(?::\d{2}(?:\.\d+)?)?(?:Z|[+-]\d{2}:?\d{2})?)?$/;

function parseArgs(argv) {
  const args = argv.slice(2);
  let checkOnly = false;
  const positional = [];
  for (const arg of args) {
    if (arg === "--check") {
      checkOnly = true;
    } else if (arg.startsWith("--")) {
      console.warn(`! Flag ignorato: ${arg}`);
    } else {
      positional.push(arg);
    }
  }
  return { checkOnly, inputPath: positional[0] };
}

function fail(message) {
  console.error(`✗ ${message}`);
  process.exit(1);
}

function warn(message) {
  console.warn(`! ${message}`);
}

function readJson(path) {
  let raw;
  try {
    raw = readFileSync(path, "utf8");
  } catch (error) {
    fail(`Impossibile leggere "${path}": ${error.message}`);
  }
  try {
    return JSON.parse(raw);
  } catch (error) {
    fail(`JSON non valido in "${path}": ${error.message}`);
  }
  return undefined;
}

function asString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function stableId(url) {
  return createHash("sha1").update(url).digest("hex").slice(0, 12);
}

function validateAndNormalize(rawItem, index) {
  if (!rawItem || typeof rawItem !== "object" || Array.isArray(rawItem)) {
    warn(`Item #${index}: scartato (non è un oggetto).`);
    return null;
  }

  const title = asString(rawItem.title);
  const source = asString(rawItem.source);
  const url = asString(rawItem.url);
  const note = asString(rawItem.note);
  const category = asString(rawItem.category);
  const date = asString(rawItem.date);
  const providedId = asString(rawItem.id);

  if (!title) {
    warn(`Item #${index}: scartato (title mancante).`);
    return null;
  }
  if (title.length > MAX_TITLE) {
    warn(
      `Item #${index} "${title.slice(0, 40)}…": scartato (title oltre ${MAX_TITLE} caratteri).`,
    );
    return null;
  }
  if (!source) {
    warn(`Item #${index} "${title}": scartato (source mancante).`);
    return null;
  }
  if (!url || !/^https?:\/\//i.test(url)) {
    warn(
      `Item #${index} "${title}": scartato (url mancante o non http(s)).`,
    );
    return null;
  }
  if (!note) {
    warn(`Item #${index} "${title}": scartato (note mancante).`);
    return null;
  }
  if (note.length > MAX_NOTE) {
    warn(
      `Item #${index} "${title}": scartato (note oltre ${MAX_NOTE} caratteri).`,
    );
    return null;
  }
  if (!ALLOWED_CATEGORIES.has(category)) {
    warn(
      `Item #${index} "${title}": scartato (category "${category}" non consentita).`,
    );
    return null;
  }
  if (date && !ISO_DATE.test(date)) {
    warn(
      `Item #${index} "${title}": scartato (date "${date}" non in formato ISO / YYYY-MM-DD).`,
    );
    return null;
  }

  const normalized = {
    id: providedId || stableId(url),
    category,
    title,
    source,
    url,
    note,
  };
  if (date) {
    normalized.date = date;
  }
  return normalized;
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
  const { checkOnly, inputPath } = parseArgs(process.argv);
  if (!inputPath) {
    fail(
      "Percorso JSON di input mancante.\nUso: node scripts/import-food-radar.mjs <file.json>",
    );
  }

  const resolvedInput = resolve(process.cwd(), inputPath);
  const raw = readJson(resolvedInput);
  if (!Array.isArray(raw)) {
    fail(
      `Il file "${inputPath}" deve contenere un array JSON di item Food Radar.`,
    );
  }

  console.log(`→ Lettura ${inputPath} (${raw.length} item grezzi)`);

  const normalized = raw
    .map((item, index) => validateAndNormalize(item, index))
    .filter((item) => item !== null);

  const deduped = dedupeByUrl(normalized);
  const sorted = sortByDateDesc(deduped);
  const limited = sorted.slice(0, MAX_ITEMS);

  if (sorted.length > MAX_ITEMS) {
    warn(
      `Limitati a ${MAX_ITEMS} item (scartati ${sorted.length - MAX_ITEMS} più vecchi).`,
    );
  }

  console.log(
    `→ Validi: ${normalized.length} · Unici: ${deduped.length} · Pubblicati: ${limited.length}`,
  );

  if (checkOnly) {
    console.log("✓ Validazione completata (nessun file scritto).");
    return;
  }

  writeOutput(limited);
  console.log(`✓ Scritto ${OUTPUT_PATH} (${limited.length} item).`);
}

main();
