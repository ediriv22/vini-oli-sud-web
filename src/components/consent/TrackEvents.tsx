"use client";

import { useEffect, type ReactNode } from "react";
import { track, withUtm } from "@/lib/track";

type Params = Record<string, unknown>;

/** Invia un evento all'apertura della pagina. */
export function TrackOnView({ event, params }: { event: string; params?: Params }) {
  useEffect(() => {
    track(event, params);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);
  return null;
}

/**
 * Avvolge un link/pulsante renderizzato lato server e invia un evento al click.
 * Con `appendUtm` aggiunge gli utm_* salvati al link esterno al momento del click.
 */
export function TrackClick({
  event,
  params,
  appendUtm = false,
  children,
}: {
  event: string;
  params?: Params;
  appendUtm?: boolean;
  children: ReactNode;
}) {
  return (
    <span
      className="contents"
      onClickCapture={(e) => {
        track(event, params);
        if (!appendUtm) return;
        const anchor = (e.target as HTMLElement).closest("a");
        if (anchor?.href) anchor.href = withUtm(anchor.href);
      }}
    >
      {children}
    </span>
  );
}
