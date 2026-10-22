export const CONSENT_KEY = "vos_consent_v1";
export const CONSENT_EVENT = "vos:consent-change";
export const CONSENT_OPEN_EVENT = "vos:consent-open";

export type ConsentValue = "granted" | "denied";

export function readConsent(): ConsentValue | null {
  try {
    const raw = window.localStorage.getItem(CONSENT_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as { value?: string };
    return parsed.value === "granted" || parsed.value === "denied" ? parsed.value : null;
  } catch {
    return null;
  }
}

export function writeConsent(value: ConsentValue) {
  try {
    window.localStorage.setItem(
      CONSENT_KEY,
      JSON.stringify({ value, date: new Date().toISOString() }),
    );
  } catch {
    // localStorage non disponibile: la scelta vale solo per questa sessione.
  }
  window.dispatchEvent(new CustomEvent<ConsentValue>(CONSENT_EVENT, { detail: value }));
}
