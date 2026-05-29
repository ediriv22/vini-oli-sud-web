/****************************************************
 * DIARIO DEL SUD — GITHUB BRIDGE
 * Addendum allo script Apps Script "Food Radar Sud Italia".
 *
 * COPIA QUESTO FILE NELL'EDITOR APPS SCRIPT (Estensioni → Apps Script,
 * Nuovo file → "GitHubBridge.gs") e INCOLLA IL CONTENUTO INTERO.
 *
 * Poi nello script principale, dentro `recuperaNotizieFoodSudItalia`,
 * subito DOPO la riga:
 *
 *     sendSummaryEmail_(emailItems, spreadsheet.getUrl());
 *
 * aggiungi UNA RIGA:
 *
 *     commitToDiarioDelSud_(newsRecords);
 *
 * Setup credenziali (una sola volta):
 *   1. Crea un PAT GitHub fine-grained → Settings → Developer settings →
 *      Personal access tokens → Fine-grained tokens → Generate new token.
 *      Resource owner: edivigerivellini.
 *      Repository access: Only select repositories → vini-oli-sud-web.
 *      Permissions → Contents: Read and write.
 *      Scadenza: max 90 giorni (poi rinnovi). Salva il token in una nota
 *      sicura: GitHub te lo mostra una sola volta.
 *   2. In Apps Script: Impostazioni progetto → Proprietà script →
 *      Aggiungi proprietà → Nome: GITHUB_PAT  · Valore: <incolla il token>.
 *   3. Esegui una volta `recuperaNotizieFoodSudItalia` dal menu Food Radar
 *      e autorizza il nuovo permesso "Connessione a un servizio esterno"
 *      (richiesto da UrlFetchApp verso api.github.com).
 ****************************************************/

const GITHUB_OWNER = 'edivigerivellini';
const GITHUB_REPO = 'vini-oli-sud-web';
const GITHUB_BRANCH = 'main';
const GITHUB_FILE_PATH = 'src/data/foodRadar.generated.json';
const GITHUB_PAT_PROPERTY = 'GITHUB_PAT';

// Soglia minima di rilevanza per essere pubblicati sul sito (≠ MIN_RELEVANCE_TO_SAVE,
// che invece governa il salvataggio nel foglio). La pagina pubblica solo notizie
// con rilevanza ≥ DIARIO_MIN_RELEVANCE.
const DIARIO_MIN_RELEVANCE = 6;

// Massimo numero di voci pubblicate nel Diario del Sud.
const DIARIO_MAX_ITEMS = 30;

// Mappa tra categorie del foglio e categorie editoriali del Diario del Sud.
const DIARIO_CATEGORY_MAP = {
  'Vino': 'Calici di Magna Grecia',
  'Olio': 'Oro Verde',
  'Business/Export': 'Business con Anima',
  'Territorio/Eventi': 'Territori',
  'Food': 'Radar del Sud',
  'Gastro Sud': 'Radar del Sud'
};

const DIARIO_ALLOWED_CATEGORIES = {
  'Oro Verde': true,
  'Calici di Magna Grecia': true,
  'Radar del Sud': true,
  'Business con Anima': true,
  'Territori': true
};

/****************************************************
 * Entry point: chiamato dallo script principale.
 *  - legge il JSON pubblicato dal repo;
 *  - converte i nuovi record del run in item Diario;
 *  - applica filtri editoriali (rilevanza, mapping categoria,
 *    URL valido, lunghezza titolo, dedup per URL);
 *  - merge: gli item già presenti per `id` non vengono toccati,
 *    quindi eventuali `note` riscritte a mano nel JSON sopravvivono;
 *  - sort per date desc, limite 30;
 *  - commit via GitHub Contents API solo se il JSON cambia davvero.
 ****************************************************/
function commitToDiarioDelSud_(newsRecords) {
  if (!newsRecords || !newsRecords.length) {
    Logger.log('Diario del Sud: nessun nuovo record dal run, niente da committare.');
    return;
  }

  const pat = PropertiesService.getScriptProperties().getProperty(GITHUB_PAT_PROPERTY);
  if (!pat) {
    Logger.log('Diario del Sud: GITHUB_PAT non configurato in Script Properties. Skip commit.');
    return;
  }

  const current = readDiarioJsonFromGitHub_(pat);
  const existingIds = {};
  for (let i = 0; i < current.items.length; i += 1) {
    existingIds[current.items[i].id] = true;
  }

  const candidates = buildDiarioCandidatesFromRecords_(newsRecords);
  const merged = current.items.slice();
  let added = 0;
  for (let i = 0; i < candidates.length; i += 1) {
    const candidate = candidates[i];
    if (existingIds[candidate.id]) {
      continue;
    }
    merged.push(candidate);
    existingIds[candidate.id] = true;
    added += 1;
  }

  const deduped = dedupeDiarioByUrl_(merged);
  const sorted = sortDiarioByDateDesc_(deduped);
  const limited = sorted.slice(0, DIARIO_MAX_ITEMS);

  const newJson = JSON.stringify(limited, null, 2) + '\n';
  if (newJson === current.raw) {
    Logger.log('Diario del Sud: nessuna modifica netta al JSON, commit non necessario.');
    return;
  }

  const ok = writeDiarioJsonToGitHub_(pat, newJson, current.sha, added, limited.length);
  if (ok) {
    Logger.log('Diario del Sud: commit GitHub riuscito · nuovi: ' + added + ' · pubblicati: ' + limited.length + '.');
  }
}

/****************************************************
 * Conversione record del run → item del Diario.
 ****************************************************/
function buildDiarioCandidatesFromRecords_(newsRecords) {
  const out = [];
  for (let i = 0; i < newsRecords.length; i += 1) {
    const record = newsRecords[i];
    const email = record.emailItem || {};
    const row = record.row || [];

    const relevance = Number(email.relevance);
    if (!isFinite(relevance) || relevance < DIARIO_MIN_RELEVANCE) {
      continue;
    }

    const mapped = DIARIO_CATEGORY_MAP[email.category];
    if (!mapped || !DIARIO_ALLOWED_CATEGORIES[mapped]) {
      continue;
    }

    const url = String(email.link || '').trim();
    if (!url || !/^https?:\/\//i.test(url) || /example\.com/i.test(url)) {
      continue;
    }

    const title = cleanDiarioText_(email.title);
    if (!title || title.length > 200) {
      continue;
    }
    if (diarioBrokenReason_(title)) {
      Logger.log('Diario del Sud: scartato titolo sospetto (' + diarioBrokenReason_(title) + '): ' + title);
      continue;
    }

    const source = cleanDiarioText_(email.source) || 'Fonte non indicata';
    const area = cleanDiarioText_(email.area) || 'Sud Italia / Mediterraneo';
    const note = autoEditorialNote_(email.category, area);
    if (note.length > 220) {
      continue;
    }

    const item = {
      id: stableShortId_(url),
      category: mapped,
      title: title,
      source: source,
      url: url,
      note: note,
      noteSource: 'auto'
    };

    const rawDate = row[0];
    if (rawDate instanceof Date && !isNaN(rawDate.getTime())) {
      item.date = Utilities.formatDate(rawDate, TIMEZONE, 'yyyy-MM-dd');
    }

    out.push(item);
  }
  return out;
}

function dedupeDiarioByUrl_(items) {
  const seen = {};
  const out = [];
  for (let i = 0; i < items.length; i += 1) {
    const key = String(items[i].url || '').toLowerCase();
    if (!seen[key]) {
      seen[key] = true;
      out.push(items[i]);
    }
  }
  return out;
}

function sortDiarioByDateDesc_(items) {
  return items.slice().sort(function (a, b) {
    if (a.date && b.date) {
      return a.date < b.date ? 1 : (a.date > b.date ? -1 : 0);
    }
    if (a.date) return -1;
    if (b.date) return 1;
    return 0;
  });
}

/****************************************************
 * Pulizia testo + heuristics sui titoli sospetti.
 * Stessa logica di scripts/import-food-radar-csv.mjs (mantenere allineato).
 ****************************************************/
function cleanDiarioText_(value) {
  if (value == null) return '';
  let out = String(value);
  out = out
    .replace(/&nbsp;/gi, ' ')
    .replace(/&amp;/gi, '&')
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/g, "'")
    .replace(/&apos;/gi, "'")
    .replace(/&lt;/gi, '<')
    .replace(/&gt;/gi, '>')
    .replace(/&hellip;/gi, '…')
    .replace(/&mdash;/gi, '—')
    .replace(/&ndash;/gi, '–')
    .replace(/<[^>]+>/g, ' ')
    .replace(/[“”]/g, '"')
    .replace(/[‘’]/g, "'")
    .replace(/\s+/g, ' ')
    .trim();
  return out;
}

function diarioBrokenReason_(value) {
  if (!value) return 'vuoto';
  if (/[<>]/.test(value)) return 'tag/entity HTML residuo';
  if (/(.)\1{4,}/.test(value)) return 'carattere ripetuto 5+ volte';
  if (/[A-Z0-9]{40,}/.test(value)) return 'blocco maiuscole/numeri molto lungo';
  return '';
}

function autoEditorialNote_(sheetCategory, area) {
  const focus = area && area !== 'Sud Italia / Mediterraneo' ? area : '';
  const focusSuffix = focus ? ', focus ' + focus : '';
  switch (sheetCategory) {
    case 'Vino':
      return focus
        ? 'Una voce dal mondo del vino' + focusSuffix + '.'
        : 'Una voce dal mondo del vino del Sud.';
    case 'Olio':
      return focus
        ? 'Un segnale dall\'olio del Sud' + focusSuffix + '.'
        : 'Un segnale dall\'olio del Sud.';
    case 'Food':
      return focus
        ? 'Una segnalazione di cucina' + focusSuffix + '.'
        : 'Una segnalazione di cucina del Sud.';
    case 'Gastro Sud':
      return focus
        ? 'Una segnalazione gastronomica del Sud' + focusSuffix + '.'
        : 'Una segnalazione gastronomica del Sud.';
    case 'Business/Export':
      return focus
        ? 'Un segnale di mercato per le eccellenze del Sud' + focusSuffix + '.'
        : 'Un segnale di mercato per le eccellenze del Sud.';
    case 'Territorio/Eventi':
      return focus
        ? 'Una notizia dal calendario dei territori' + focusSuffix + '.'
        : 'Una notizia dal calendario dei territori del Sud.';
    default:
      return focus
        ? 'In rassegna nel radar di Vini Oli Sud' + focusSuffix + '.'
        : 'In rassegna nel radar di Vini Oli Sud.';
  }
}

function stableShortId_(text) {
  const bytes = Utilities.computeDigest(Utilities.DigestAlgorithm.SHA_1, String(text || ''));
  let hex = '';
  for (let i = 0; i < bytes.length; i += 1) {
    const byte = bytes[i] & 0xff;
    hex += (byte < 16 ? '0' : '') + byte.toString(16);
  }
  return hex.substring(0, 12);
}

/****************************************************
 * GitHub Contents API: GET + PUT.
 ****************************************************/
function readDiarioJsonFromGitHub_(pat) {
  const url = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO +
    '/contents/' + encodeURIComponent(GITHUB_FILE_PATH) + '?ref=' + encodeURIComponent(GITHUB_BRANCH);

  const resp = UrlFetchApp.fetch(url, {
    method: 'get',
    headers: githubHeaders_(pat),
    muteHttpExceptions: true
  });

  const code = resp.getResponseCode();
  if (code === 404) {
    return { items: [], sha: null, raw: '' };
  }
  if (code < 200 || code >= 300) {
    Logger.log('Diario del Sud: GET GitHub fallita (' + code + '): ' + resp.getContentText());
    throw new Error('GitHub GET ' + code);
  }

  const data = JSON.parse(resp.getContentText());
  const decoded = Utilities.newBlob(Utilities.base64Decode(data.content || '')).getDataAsString('UTF-8');
  let items = [];
  try {
    items = JSON.parse(decoded);
    if (!Array.isArray(items)) items = [];
  } catch (error) {
    Logger.log('Diario del Sud: JSON corrente non parsabile, riparto da [].');
    items = [];
  }
  return { items: items, sha: data.sha, raw: decoded };
}

function writeDiarioJsonToGitHub_(pat, newJson, currentSha, added, total) {
  const url = 'https://api.github.com/repos/' + GITHUB_OWNER + '/' + GITHUB_REPO +
    '/contents/' + encodeURIComponent(GITHUB_FILE_PATH);

  const today = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd');
  const message = 'chore(food-radar): aggiornamento Diario del Sud ' + today +
    ' (+' + added + ' nuovi · ' + total + ' totali)';

  const payload = {
    message: message,
    content: Utilities.base64Encode(newJson, Utilities.Charset.UTF_8),
    branch: GITHUB_BRANCH
  };
  if (currentSha) {
    payload.sha = currentSha;
  }

  const resp = UrlFetchApp.fetch(url, {
    method: 'put',
    headers: githubHeaders_(pat),
    contentType: 'application/json',
    payload: JSON.stringify(payload),
    muteHttpExceptions: true
  });

  const code = resp.getResponseCode();
  if (code >= 200 && code < 300) {
    return true;
  }
  Logger.log('Diario del Sud: PUT GitHub fallita (' + code + '): ' + resp.getContentText());
  return false;
}

function githubHeaders_(pat) {
  return {
    'Authorization': 'Bearer ' + pat,
    'Accept': 'application/vnd.github+json',
    'X-GitHub-Api-Version': '2022-11-28',
    'User-Agent': 'FoodRadarSudItalia/1.0'
  };
}

/****************************************************
 * Diagnostica: esegui da menu per verificare la connessione GitHub
 * senza scrivere niente.
 ****************************************************/
function testGitHubConnection() {
  const pat = PropertiesService.getScriptProperties().getProperty(GITHUB_PAT_PROPERTY);
  if (!pat) {
    Logger.log('GITHUB_PAT non trovato nelle Script Properties.');
    return;
  }
  try {
    const current = readDiarioJsonFromGitHub_(pat);
    Logger.log('GitHub OK · item correnti nel Diario: ' + current.items.length + ' · sha: ' + current.sha);
  } catch (error) {
    Logger.log('GitHub KO: ' + error);
  }
}
