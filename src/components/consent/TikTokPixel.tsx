"use client";

import Script from "next/script";
import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";
import { CONSENT_EVENT, CONSENT_KEY, type ConsentValue } from "@/lib/consent";
import { captureUtm, flushPendingTracks } from "@/lib/track";

const PIXEL_ID = "DBCGCIBC77U4SEFNFL80";
const PIXEL_READY_EVENT = "vos:pixel-ready";

type TtqApi = {
  grantConsent?: () => void;
  revokeConsent?: () => void;
  page?: () => void;
};

function ttq(): TtqApi | undefined {
  return (window as unknown as { ttq?: TtqApi }).ttq;
}

function applyConsent(value: ConsentValue) {
  try {
    if (value === "granted") ttq()?.grantConsent?.();
    else ttq()?.revokeConsent?.();
  } catch {
    // il pixel non e' ancora pronto o e' stato bloccato dal browser
  }
}

/**
 * TikTok Pixel in modalita' "consenso sospeso": lo snippet si carica con
 * holdConsent() prima di page(), gli eventi partono solo dopo l'Accetta.
 */
export default function TikTokPixel() {
  const pathname = usePathname();
  const firstPage = useRef(true);

  useEffect(() => {
    captureUtm();
  }, []);

  useEffect(() => {
    const onChange = (event: Event) => applyConsent((event as CustomEvent<ConsentValue>).detail);
    window.addEventListener(CONSENT_EVENT, onChange);
    // Lo snippet segnala "pixel pronto" a fine esecuzione: svuota gli eventi
    // emessi prima (es. ViewContent all'idratazione). Se e' gia' partito, subito.
    window.addEventListener(PIXEL_READY_EVENT, flushPendingTracks);
    flushPendingTracks();
    return () => {
      window.removeEventListener(CONSENT_EVENT, onChange);
      window.removeEventListener(PIXEL_READY_EVENT, flushPendingTracks);
    };
  }, []);

  // Con export statico il cambio pagina e' lato client: page() a ogni route.
  // La prima page() parte dallo snippet; qui solo le successive.
  useEffect(() => {
    if (firstPage.current) {
      firstPage.current = false;
      return;
    }
    try {
      ttq()?.page?.();
    } catch {
      // ignorato
    }
  }, [pathname]);

  return (
    <Script
      id="tiktok-pixel"
      strategy="afterInteractive"
    >
      {`
!function (w, d, t) {
  w.TiktokAnalyticsObject=t;var ttq=w[t]=w[t]||[];ttq.methods=["page","track","identify","instances","debug","on","off","once","ready","alias","group","enableCookie","disableCookie","holdConsent","revokeConsent","grantConsent"],ttq.setAndDefer=function(t,e){t[e]=function(){t.push([e].concat(Array.prototype.slice.call(arguments,0)))}};for(var i=0;i<ttq.methods.length;i++)ttq.setAndDefer(ttq,ttq.methods[i]);ttq.instance=function(t){for(var e=ttq._i[t]||[],n=0;n<ttq.methods.length;n++)ttq.setAndDefer(e,ttq.methods[n]);return e},ttq.load=function(e,n){var r="https://analytics.tiktok.com/i18n/pixel/events.js",o=n&&n.partner;ttq._i=ttq._i||{},ttq._i[e]=[],ttq._i[e]._u=r,ttq._t=ttq._t||{},ttq._t[e]=+new Date,ttq._o=ttq._o||{},ttq._o[e]=n||{};n=document.createElement("script");n.type="text/javascript",n.async=!0,n.src=r+"?sdkid="+e+"&lib="+t;e=document.getElementsByTagName("script")[0];e.parentNode.insertBefore(n,e)};
  ttq.load('${PIXEL_ID}');
  ttq.holdConsent();
  try {
    var saved = JSON.parse(localStorage.getItem('${CONSENT_KEY}') || 'null');
    if (saved && saved.value === 'granted') ttq.grantConsent();
    else if (saved && saved.value === 'denied') ttq.revokeConsent();
  } catch (e) {}
  ttq.page();
  window.dispatchEvent(new Event('${PIXEL_READY_EVENT}'));
}(window, document, 'ttq');
      `}
    </Script>
  );
}
