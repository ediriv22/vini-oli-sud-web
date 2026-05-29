# Vini Oli Sud — Brand Assets Map

Mappa "asset → uso reale nel sito". Sorgente di verità nel codice: chiavi di
`siteConfig.brand.assets` in `src/data/site.ts`. Cartella sorgente:
`public/brand/`. Brand kit vettoriale di riferimento:
`ViniSud_Brand_Kit_Vettoriale/` (esterna al repo, vedi nota in §5).

---

## 1. Asset logo usati a runtime (brand kit v1.0, maggio 2026)

Tutti SVG vettoriali (~5 KB ciascuno).

| Chiave `siteConfig.brand.assets` | File | viewBox | Usato in |
|---|---|---|---|
| `logoHorizontal` | `public/brand/logo-orizzontale.svg` | 1600 × 400 | `BrandLogo` (variant `horizontal`, theme `default`) → `Header` |
| `logoHorizontalDark` | `public/brand/logo-orizzontale-scuro.svg` | 1600 × 400 | disponibile per cover scure; non usato dal sito |
| `logoHorizontalIvory` | `public/brand/logo-orizzontale-avorio.svg` | 1600 × 400 | disponibile per fondi medi |
| `logoHorizontalMonoWhite` | `public/brand/logo-orizzontale-mono-bianco.svg` | 1600 × 400 | `BrandLogo` (theme `light`) → `Footer` |
| `logoWordmark` | `public/brand/logo-wordmark.svg` | 1600 × 280 | `BrandLogo` (variant `wordmark`) — spazi compressi |
| `monogrammaVS` | `public/brand/monogramma-vs.svg` | 1000 × 1000 | `BrandLogo` (variant `monogram`, theme `default`) |
| `monogrammaVSIvory` | `public/brand/monogramma-vs-avorio.svg` | 1000 × 1000 | `BrandLogo` (variant `monogram`, theme `light`) |
| `avatarSocial` | `public/brand/avatar-social-vs.svg` | 1000 × 1000 | non usato dal sito; disponibile per avatar Instagram/LinkedIn |
| `faviconSvg` | `public/brand/favicon.svg` | 1000 × 1000 | `metadata.icons.icon[0]` (SVG vettoriale) |
| `favicon16` | `public/brand/favicon-16.png` | 16 × 16 | `metadata.icons.icon` |
| `favicon32` | `public/brand/favicon-32.png` | 32 × 32 | `metadata.icons.icon` |
| `favicon64` | `public/brand/favicon-64.png` | 64 × 64 | `metadata.icons.icon` |
| `favicon256` | `public/brand/favicon-256.png` | 256 × 256 | `metadata.icons.icon` + `metadata.icons.apple` |
| `favicon512` | `public/brand/favicon-512.png` | 512 × 512 | `metadata.icons.icon` |
| `ogImage` | `public/brand/og-image.jpg` | 1200 × 630 | `metadata.openGraph.images` + `metadata.twitter.images` (asset legacy, da rigenerare) |

---

## 2. Punti d'uso nel codice

### Componenti
- `src/components/ui/BrandLogo.tsx`
  - Varianti: `horizontal` (default), `wordmark`, `monogram`.
  - Temi: `default` (fondo chiaro) / `light` (fondo scuro).
  - Mappa interna `resolveSrc()` sceglie l'asset corretto in base alla
    combinazione variant + theme.
  - `priority` per LCP hint (header).
  - Fallback testuale `onError` con `siteConfig.brand.wordmark`.

### Layout
- `src/components/layout/Header.tsx` → `<BrandLogo variant="horizontal" priority />`
- `src/components/layout/Footer.tsx` → `<BrandLogo variant="horizontal" theme="light" />`
  → usa `logo-orizzontale-mono-bianco.svg` (bianco trasparente, massimo
    contrasto sul gradient scuro).

### Metadata (`src/app/layout.tsx`)
- Favicon: catena `faviconSvg` + 16/32/64/256/512 PNG + Apple touch 256.
- OpenGraph + Twitter card: `ogImage` (legacy).

### Pagine
- `createPageMetadata()` in `src/data/site.ts` riusa lo stesso `ogImage`
  per ogni pagina.

---

## 3. Asset legacy non più usati a runtime

Restano in `public/brand/` per backward-compat ma **non sono referenziati**:

- `logo-horizontal.png` (5000 × 1250, ~1.5 MB) — vecchio logo full
- `logo-horizontal-cropped.png` (3727 × 991, ~1.5 MB) — vecchio crop
- `logo-square.png` (1024 × 1024, ~1.4 MB) — vecchio badge
- `logo-square.webp` (1024 × 1024, ~144 KB) — vecchio badge WebP
- `original-logo.webp` (1024 × 1024, ~391 KB) — duplicato di square
- `favicon-192.png` — sostituito dalla coppia `favicon.svg` + `favicon-256.png`
- `cover-facebook.png` (~1.5 MB)
- `symbol-column-olive-grape.png` (~4 MB)
- `logo-placeholder.svg`, `favicon-placeholder.svg` — vecchi placeholder

Chiavi rimosse da `siteConfig.brand.assets`:
- `logo: "/brand/logo.svg"` (file non esistente)
- `logoDark`, `logoLight` (file non esistenti)
- `logoOriginal`, `logoSquare`, `logoSquareWebp` (sostituiti dal nuovo brand kit)
- `logoHorizontalCropped`, `logoHorizontalFull` (sostituiti dai nuovi SVG)
- `symbolColumnOliveGrape`, `coverFacebook` (asset legacy)
- `favicon192` (sostituito da `favicon256` + `faviconSvg`)

---

## 4. Note su formato / dimensione

- Tutti gli asset logo sono ora **SVG vettoriali**. Peso totale del logo
  set: ~30 KB (vs ~10 MB del set legacy). Scalabilità perfetta, nessuna
  perdita di qualità su retina/4K.
- I favicon raster restano PNG per compatibilità con browser/launcher
  legacy che non supportano SVG (Safari iOS < 17, Edge legacy, alcuni
  client mail).
- Il logo nuovo dice **"VINI SUD · DAL MEDITERRANEO"**: è il nome
  visivo del brand kit. Il sito mantiene **`siteConfig.name = "Vini Oli
  Sud"`** come nome del progetto (compresivo di vino + olio). Le due cose
  convivono volutamente:
  - Sito / dominio / nome progetto: Vini Oli Sud.
  - Logo / wordmark visivo: Vini Sud · Dal Mediterraneo.
- Palette ufficiale del kit (vedi `ViniSud_Brand_Kit_Vettoriale/README.md`):
  Inchiostro Mediterraneo `#1B2A3A`, Avorio Caldo `#F4EDE0`, Verde Oliva
  `#5B6C3E`, Rosso Vino `#6B1E1E`, Oro Caldo `#B08D57`.
- La palette CSS in `globals.css` usa valori leggermente diversi
  (`--color-sea: #13293D`, `--color-ivory: #F8F3E8`, `--color-olive:
  #5F6B33`, `--color-wine: #7A2634`, `--color-sand: #C8A76F`). Allineabili
  in una fase di brand polish, ma non necessario per la coerenza del logo.

---

## 5. Sorgente esterna del brand kit

Cartella `ViniSud_Brand_Kit_Vettoriale/` accanto al repo
(`/Users/.../VINISUD/`) contiene:

- Sorgenti `.svg` (testo già convertito in tracciati, zero dipendenze
  font).
- `.pdf` vettoriali per stampa / Office.
- `.eps` Level 3 per tipografie tradizionali.
- `_preview.png` (2× raster) per controllo veloce.
- `README.md` con regole d'uso, dimensioni minime, safe area, palette.
- `ViniSud_Vector_Kit_ContactSheet.pdf` (A3, 4 pagine).

Il sito copia solo gli SVG necessari in `public/brand/`. Le esportazioni
PDF/EPS restano nel kit per uso stampa e materiali editoriali esterni.

---

## 6. File mancanti consigliati (da produrre)

1. **`og-image.jpg` nuovo** (1200 × 630) — rigenerare con il nuovo
   monogramma + wordmark. L'asset attuale mostra ancora il vecchio
   badge "VINI SUD / OLI SUD / LE ECCELLENZE DELLA MAGNA GRECIA" e va
   sostituito prima di iniziare a condividere link sui social.
2. **`apple-touch-icon-180.png`** — Apple consiglia 180 × 180. Oggi
   serviamo 256 × 256 (Safari ridimensiona).
3. (Opzionale) **Variante "DAL MEDITERRANEO" con accent rosso vino** per
   la linea vino, e **"VERDE OLIVA"** per la linea olio: il brand kit
   include già le varianti `_Rosso_Vino` e `_Verde_Oliva` ma non sono
   ancora copiate in `public/brand/`.

---

## 7. Convenzione di riferimento

- **Mai più path hardcoded**: usare sempre
  `siteConfig.brand.assets.<chiave>`. BrandLogo lo fa già.
- **Aggiungere nuovi asset**: prima file in `public/brand/`, poi chiave
  in `siteConfig.brand.assets`, poi referenziare dai componenti, poi
  aggiornare questa mappa nello stesso PR.
- **Naming**: kebab-case in italiano (`logo-orizzontale`, `monogramma-vs`).
  Niente più suffissi `-v2` / `-new` / `-final`.
- **Asset removal**: rimuovere prima il file da `public/brand/`, poi
  togliere la chiave da `siteConfig`. Verificare con
  `rg -n "<chiave>" src` che nessuno la usi più.
