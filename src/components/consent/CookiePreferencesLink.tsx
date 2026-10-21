"use client";

import { CONSENT_OPEN_EVENT } from "@/lib/consent";

export default function CookiePreferencesLink({ className }: { className?: string }) {
  return (
    <button
      type="button"
      className={className}
      onClick={() => window.dispatchEvent(new Event(CONSENT_OPEN_EVENT))}
    >
      Preferenze cookie
    </button>
  );
}
