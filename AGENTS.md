# AGENTS.md

Regole operative per agenti futuri che lavorano su `vini-oli-sud-web`.

## Contenuti

- Non inventare dati, date, partner, sponsor, numeri, regolamenti o informazioni logistiche non confermate.
- Quando i dati non sono validati, usare placeholder espliciti e dichiararli chiaramente.
- Mantenere tono premium mediterraneo, concreto e autorevole.
- Per le CTA usare copy orientato al beneficio. Evitare formule deboli come `clicca qui`.

## Design e UX

- Evitare qualsiasi look da fiera generica, template anonimo o linguaggio da sagra.
- Preservare una direzione visiva elegante, calda, territoriale e business-oriented.
- Preferire componenti riutilizzabili e data layer centralizzato in `src/data`.

## Implementazione

- Prima di introdurre nuove sezioni, verificare se il pattern può essere assorbito da componenti esistenti.
- Tenere contenuti e struttura pronti a futura integrazione con CMS, senza introdurlo ora.
- Non rompere accessibilità base, responsive mobile-first e metadata SEO essenziali.
- Gli asset finali devono essere collocati nelle cartelle `public/brand`, `public/images` e `public/downloads` senza cambiare naming arbitrariamente.

## Qualità

- Verificare `npm run lint` e `npm run build` prima di chiudere il task.
- Se un dato non è confermato, documentarlo anche in `docs/WEBSITE_BLUEPRINT.md`.
