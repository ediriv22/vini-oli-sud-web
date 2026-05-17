# Brand Assets — Vini Oli Sud

Asset reali della marca usati dal sito. Sorgente di verità per i path:
`siteConfig.brand.assets` in `src/data/site.ts`. Per la mappa completa
"asset → punti d'uso", vedere `docs/brand-assets-map.md`.

## Brand kit vettoriale (v1.0, maggio 2026) — asset attivi

Tutti SVG: ~5 KB ciascuno, scalabili a qualunque risoluzione.

| File | Uso |
|---|---|
| `logo-orizzontale.svg` | Logo orizzontale "VINI SUD · DAL MEDITERRANEO" — versione trasparente (testo inchiostro). Default header. |
| `logo-orizzontale-scuro.svg` | Stessa cosa con sfondo blu inchiostro pieno. Per video / social notturni. |
| `logo-orizzontale-avorio.svg` | Testo avorio su trasparente. Per fondi medi. |
| `logo-orizzontale-mono-bianco.svg` | Mono bianco su trasparente. Usato dal Footer (massimo contrasto su gradient scuro). |
| `logo-wordmark.svg` | Wordmark "VINI SUD" essenziale, senza filetto né tagline. Per spazi compressi. |
| `monogramma-vs.svg` | Monogramma "VS" in cerchio oro su blu profondo. Avatar / sigilli. |
| `monogramma-vs-avorio.svg` | Stesso monogramma con palette avorio. |
| `avatar-social-vs.svg` | Monogramma + piccolo wordmark sotto. Avatar Instagram / LinkedIn. |
| `favicon.svg` | Favicon SVG vettoriale (monogramma senza cerchio). Browser moderni. |
| `favicon-16.png` | Fallback raster 16 × 16. |
| `favicon-32.png` | 32 × 32. |
| `favicon-64.png` | 64 × 64. |
| `favicon-256.png` | 256 × 256 (Android, Apple touch). |
| `favicon-512.png` | 512 × 512 (PWA). |

## OpenGraph

| File | Uso |
|---|---|
| `og-image.jpg` | 1200 × 630 JPEG. Asset **legacy**: mostra ancora il vecchio badge "VINI SUD / OLI SUD / LE ECCELLENZE DELLA MAGNA GRECIA". Da rigenerare con il nuovo monogramma per coerenza. |

## Asset legacy / non più usati a runtime

Restano in cartella per backward-compat, **non sono referenziati dal sito**:

- `logo-horizontal.png`, `logo-horizontal-cropped.png` (vecchio logo full, 1.5 MB)
- `logo-square.png`, `logo-square.webp`, `original-logo.webp` (vecchi badge quadrati)
- `favicon-192.png` (sostituito da favicon-256.png + favicon.svg)
- `cover-facebook.png` (1.5 MB)
- `symbol-column-olive-grape.png` (4 MB)
- `logo-placeholder.svg`, `favicon-placeholder.svg` (placeholder iniziali)
- `dati-ufficiali-vinisud.txt` (note di lavoro)

Si possono rimuovere via `git rm` quando si fa pulizia del repo. La cartella
sorgente dei nuovi asset resta `ViniSud_Brand_Kit_Vettoriale/` accanto al
repo (fuori dal deploy).

## Convenzione di naming

- Nuovi asset: kebab-case in italiano (`logo-orizzontale`, `monogramma-vs`).
- Suffissi di variante: `-scuro`, `-avorio`, `-mono-bianco`, `-mono-nero`,
  `-trasparente`, `-oro`.
- Favicon: sempre `favicon-<size>.png` per i raster; `favicon.svg` per il
  vettoriale.
- Niente più `-cropped` / `-new` / `-v2`: il sito usa solo i nomi canonici.

## Quando aggiornare un asset

1. Aggiungere/aggiornare il file in `public/brand/`.
2. Registrare/aggiornare la chiave in `siteConfig.brand.assets`.
3. Aggiornare `docs/brand-assets-map.md` e questo README nello stesso PR.
4. Mai path hardcoded nei componenti: solo via `siteConfig.brand.assets`.
