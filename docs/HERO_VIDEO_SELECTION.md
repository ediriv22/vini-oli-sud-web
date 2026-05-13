# Hero Video Selection

Selezione locale per il video hero della homepage di Vini Oli Sud.

Nota operativa: i file richiesti non si trovano nella root di `~/Desktop/VINISUD/VOS_video_ordinati`, ma nelle sottocartelle `orizzontale/short`, `orizzontale/reel` e `verticale/short`. La verifica e i metadati sotto usano i percorsi reali individuati localmente.

## Candidati verificati

| ID | Percorso reale | Durata | Risoluzione | FPS | Codec | Dimensione |
| --- | --- | ---: | --- | ---: | --- | ---: |
| 016 | `orizzontale/short/016_drone-vigneto_vulcano-sfondo.mp4` | 12.14s | 3840x2160 | 23.98 | h264 | 35,914,932 B |
| 015 | `orizzontale/short/015_drone-vigneto_controluce-sole.mp4` | 13.22s | 1920x1080 | 23.98 | h264 | 9,093,828 B |
| 013 | `orizzontale/reel/013_drone-vigneti_uhd-panoramica.mp4` | 9.18s | 3840x2160 | 29.97 | h264 | 24,580,359 B |
| 005 | `verticale/short/005_drone-costa_lago-vigneti.mp4` | 12.00s | 2160x3840 | 59.94 | h264 | 106,565,994 B |
| 003 | `verticale/short/003_drone-vigneti_invernali.mp4` | 11.49s | 2160x3840 | 59.94 | h264 | 64,876,963 B |

Correzione percorso:
Il file `016` è in `orizzontale/short`.
Il file `015` è in `orizzontale/short`.
Il file `013_drone-vigneti_uhd-panoramica.mp4` è in `orizzontale/reel`.
I file `005` e `003` sono in `verticale/short`.

## Video consigliato per hero

### Primario

`016_drone-vigneto_vulcano-sfondo.mp4`

Percorso:
`/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/short/016_drone-vigneto_vulcano-sfondo.mp4`

Motivazione creativa:
Ha la composizione più iconica e “boutique editoriale mediterranea” tra i candidati: vigneto leggibile in primo piano, profondità territoriale, sfondo vulcanico riconoscibile, aria e orizzonte che danno respiro al titolo hero.
Trasmette terroir, paesaggio e autorevolezza più di un semplice drone descrittivo.
Risulta il più adatto a una homepage premium, meno social-first e più istituzionale.

Motivazione tecnica:
È orizzontale 16:9 nativo, quindi non richiede crop distruttivi per la hero desktop.
Parte da sorgente 4K H.264 a 23.98 fps, utile per una conversione pulita in un master web 1080p con buon dettaglio.
La durata di 12.14s consente di estrarre facilmente un loop operativo da 7-9 secondi senza fretta.

## Alternative

### Alternativa 1

`015_drone-vigneto_controluce-sole.mp4`

Percorso:
`/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/short/015_drone-vigneto_controluce-sole.mp4`

Perché tenerlo come seconda scelta:
È il più leggero da trattare e il più semplice da ottimizzare per performance.
Ha un tono caldo e naturale coerente con il concept.

Perché non come prima scelta:
L’inquadratura è più ravvicinata e meno “manifesto”.
Offre meno profondità scenica e meno spazio narrativo rispetto a `016`.

### Alternativa 2

`013_drone-vigneti_uhd-panoramica.mp4`

Percorso:
`/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/reel/013_drone-vigneti_uhd-panoramica.mp4`

Perché tenerlo come alternativa:
È orizzontale, 4K e ha una buona qualità sorgente.
Può funzionare se si cerca una hero più dinamica e meno iconica.

Perché non come prima scelta:
Il taglio “reel” lo rende più vicino a un contenuto social che a una cover istituzionale.
Nel frame campionato la composizione è meno leggibile per una hero con overlay tipografico.
La durata più corta e il ritmo più rapido riducono il margine per un loop elegante.

## Cosa escludere dalla hero

### Da escludere dalla hero desktop principale

`005_drone-costa_lago-vigneti.mp4`
`003_drone-vigneti_invernali.mp4`

Motivo:
Sono verticali 9:16, quindi non adatti a una hero orizzontale senza crop pesante.
Hanno FPS alti e peso sorgente molto elevato per un uso homepage.
Il loro linguaggio è più vicino a reel/social o a un eventuale supporto mobile-first dedicato.

### Da tenere per reel, social o usi secondari

`005_drone-costa_lago-vigneti.mp4`
Funziona bene per storytelling verticale ad alto impatto, soprattutto se si vuole valorizzare costa, acqua e movimento.

`003_drone-vigneti_invernali.mp4`
Più adatto a clip editoriali, sezioni magazine, teaser stagionali o supporti secondari dove il ritmo contemplativo è un valore e non un limite.

## Rischi di performance

Il candidato migliore `016` parte da un file da circa 34 MB: non va mai usato direttamente nel sito.
Un export web mal calibrato può produrre un hero troppo pesante su mobile e LCP peggiore.
Un poster troppo grande o non compresso bene può vanificare parte del risparmio del video.
I sorgenti verticali `003` e `005` sono particolarmente inefficienti per una hero desktop e vanno evitati per questo caso d’uso.

## Comandi ffmpeg suggeriti

### Video web

Comando consigliato per generare `public/videos/hero-vigneto.mp4` partendo da `016`:

```bash
ffmpeg -y \
  -ss 00:00:00.60 \
  -t 00:00:08.00 \
  -i "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/short/016_drone-vigneto_vulcano-sfondo.mp4" \
  -an \
  -vf "scale=1920:-2:flags=lanczos,fps=24,format=yuv420p" \
  -c:v libx264 \
  -preset slow \
  -crf 23 \
  -profile:v high \
  -level 4.1 \
  -movflags +faststart \
  "public/videos/hero-vigneto.mp4"
```

Note:
Trim iniziale consigliato a 8 secondi per migliorare peso e loop.
`1920px` di larghezza è un buon compromesso tra resa premium e performance.
Audio rimosso con `-an` perché inutile per hero autoplay/muted.

### Poster

Comando consigliato per generare `public/videos/hero-vigneto-poster.jpg`:

```bash
ffmpeg -y \
  -ss 00:00:02.80 \
  -i "/Users/edvigerivellini/Desktop/VINISUD/VOS_video_ordinati/orizzontale/short/016_drone-vigneto_vulcano-sfondo.mp4" \
  -frames:v 1 \
  -vf "scale=1920:-2:flags=lanczos" \
  -q:v 2 \
  "public/videos/hero-vigneto-poster.jpg"
```

## Prossimo passo consigliato

Generare in locale il master ottimizzato da `016` con i comandi sopra, misurare il peso finale di `hero-vigneto.mp4` e verificare la leggibilità del titolo sopra il poster e sopra il primo secondo di loop.
