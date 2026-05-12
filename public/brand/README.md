# Brand Assets

Questa cartella è il punto di ingresso per gli asset reali di marca di Vini Oli Sud.

## Asset attualmente presenti

- `logo-horizontal.png`
- `logo-horizontal-cropped.png`
- `logo-square.webp`
- `logo-square.png`
- `original-logo.webp`
- `symbol-column-olive-grape.png`
- `cover-facebook.png`
- `favicon-512.png`
- `favicon-192.png`
- `favicon-64.png`
- `favicon-32.png`
- `og-image.jpg`

## File finali consigliati

- `public/brand/logo.svg`
- `public/brand/logo-dark.svg` se necessario
- `public/brand/logo-light.svg` se necessario
- `public/brand/favicon.svg`
- `public/brand/og-image.jpg`

## Comportamento del progetto

- `BrandLogo` usa `logo-horizontal-cropped.png` per header e footer, mantenendo `logo-horizontal.png` come sorgente non ritagliata.
- `BrandLogo` mantiene `logo-square.*` per favicon, social/usi compatti e fallback di marca quadrato.
- I metadata del sito usano ora favicon PNG e `og-image.jpg`.

## Nota pratica

- `logo-horizontal.png`: logo orizzontale per header e footer.
- `logo-horizontal-cropped.png`: versione ritagliata del logo orizzontale per la UI del sito.
- `symbol-column-olive-grape.png`: simbolo decorativo da usare con misura.
- `cover-facebook.png`: cover/social preview di brand.
- `logo-square.png` e `logo-square.webp`: usi compatti, favicon, riferimenti di marca quadrati.
