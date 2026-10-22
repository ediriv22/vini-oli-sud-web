type TikTokQueue = {
  track: (event: string, params?: Record<string, unknown>) => void;
};

declare global {
  interface Window {
    ttq?: TikTokQueue;
  }
}

// Eventi emessi prima che lo snippet TikTok (afterInteractive) abbia creato
// window.ttq, ad esempio ViewContent all'idratazione: restano in coda.
const pending: Array<[string, Record<string, unknown> | undefined]> = [];

/** Invia un evento al TikTok Pixel solo se esiste; non lancia mai errori. */
export function track(event: string, params?: Record<string, unknown>) {
  try {
    if (window.ttq) window.ttq.track(event, params);
    else pending.push([event, params]);
  } catch {
    // il tracciamento non deve mai rompere la pagina
  }
}

/** Invia gli eventi rimasti in coda; chiamata quando il pixel e' pronto. */
export function flushPendingTracks() {
  if (!window.ttq) return;
  const queued = pending.splice(0);
  queued.forEach(([event, params]) => track(event, params));
}

const UTM_STORAGE_KEY = "vos_utm";

/** Salva i parametri utm_* dell'URL corrente in sessionStorage. */
export function captureUtm() {
  try {
    const found = new URLSearchParams(window.location.search);
    const utm: Record<string, string> = {};
    found.forEach((value, key) => {
      if (key.startsWith("utm_")) utm[key] = value;
    });
    if (Object.keys(utm).length > 0) {
      window.sessionStorage.setItem(UTM_STORAGE_KEY, JSON.stringify(utm));
    }
  } catch {
    // sessionStorage non disponibile
  }
}

/** Aggiunge gli utm_* salvati all'URL indicato (es. biglietteria Metooo). */
export function withUtm(url: string): string {
  try {
    const raw = window.sessionStorage.getItem(UTM_STORAGE_KEY);
    if (!raw) return url;
    const target = new URL(url);
    Object.entries(JSON.parse(raw) as Record<string, string>).forEach(([key, value]) => {
      target.searchParams.set(key, value);
    });
    return target.toString();
  } catch {
    return url;
  }
}
