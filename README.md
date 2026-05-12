# Vini Oli Sud Web

Sito ufficiale e portale editoriale di Vini Oli Sud, concepito come piattaforma di conversione per espositori, buyer, visitatori, media e partner.

## Stack

- Next.js 16 con App Router
- TypeScript
- Tailwind CSS 4
- React 19
- Contenuti hardcoded in `src/data`

## Installazione

```bash
npm install
```

## Sviluppo locale

```bash
npm run dev
```

Apri `http://localhost:3000`.

## Comandi utili

```bash
npm run lint
npm run build
npm run start
```

## Struttura cartelle

```text
src/
  app/
  components/
    layout/
    sections/
    ui/
  data/
  lib/
docs/
  WEBSITE_BLUEPRINT.md
public/
  brand/
  images/
  downloads/
```

## Note architetturali

- Le principali informazioni di brand, navigazione e pagine sono centralizzate in `src/data`.
- Le pagine editoriali e istituzionali usano componenti riutilizzabili e contenuti placeholder espliciti quando i dati non sono confermati.
- Il design system usa variabili CSS per la palette `wine`, `olive`, `sand`, `sea`, `ivory`.
- `BrandLogo` usa fallback tipografico e può adottare automaticamente `public/brand/logo.svg` quando sarà disponibile.
- Gli asset scaricabili futuri devono vivere in `public/downloads`.

## Asset finali

- Logo e favicon: `public/brand/`
- Immagini di scena e texture: `public/images/`
- Brochure, media kit e deck: `public/downloads/`

Consulta anche:

- [public/brand/README.md](/Users/edvigerivellini/vini-oli-sud-web/public/brand/README.md)
- [public/images/README.md](/Users/edvigerivellini/vini-oli-sud-web/public/images/README.md)
- [public/downloads/README.md](/Users/edvigerivellini/vini-oli-sud-web/public/downloads/README.md)

## Deployment futuro

- Target previsto: Vercel.
- Prima del deploy andranno confermati dominio, metadata canonici, asset OG, contatti ufficiali e integrazioni form.
