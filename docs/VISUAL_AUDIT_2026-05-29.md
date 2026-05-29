# VISUAL AUDIT — Vini Oli Sud Demo (29 Maggio 2026)

**Stato**: Audit completato  
**Scope**: Layout, spacing, responsive, header, hero, card, bottoni, tipografia, colori  
**Non-scope**: Architettura, contenuti, backend, form, hosting  

---

## SINTESI DEI PROBLEMI IDENTIFICATI

### 🔴 CRITICI (impatto immediato su esperienza)

1. **Hero scroll-bound: mancanza visual fallback su mobile**
   - Sezione hero usa scroll-bound con immagine di sfondo scura
   - Su mobile (<640px), la parallax e il rendering dell'immagine potrebbero causare:
     - Testo illeggibile se contrasto insufficiente
     - Immagine tagliata in modo sgradevole
     - Movimento parallax disabilitato ma transizione visiva non morbida
   - **Fix proposto**: Aggiungere overlay scuro semi-trasparente sopra hero per garantire leggibilità testo anche con immagini scure

2. **AudienceGateway (4 card percorsi): gap verticale incoerente su mobile**
   - Grid `gap-10 sm:gap-12 md:gap-10 lg:gap-8 xl:gap-10` comporta:
     - Mobile: 40px gap (ampio)
     - Tablet: 48px gap (troppo ampio, spazi bianchi)
     - Desktop: 32-40px (varia)
   - Effetto: card lunghe che sembrano "disperse" sulla pagina
   - **Fix proposto**: Unificare gap con clamp() per fluibilità: `gap-[clamp(1.5rem, 4vw, 2.5rem)]`

3. **Bottoni: altezza non coerente tra varianti e breakpoint**
   - `md: h-12` vs `sm:h-[3.25rem]` = 48px vs 52px (jump visibile)
   - Su mobile, bottoni potrebbero sembrare "schiacciati" o "gonfi" a seconda della viewport
   - Touch target potrebbe scendere sotto 44-48px su dispositivi specifici
   - **Fix proposto**: Semplificare a altezze consistenti: sm-up = 48px, md-up = 52px

4. **Spacing verticale sezioni: non sempre coerente con tema "editoriale"**
   - Classi: `.section-space` (clamp 3.5rem–8.75rem), `.section-space-lg` (clamp 4rem–10rem)
   - Problema: sezioni alte differiscono molto (es. 56px mobile vs 140px desktop)
   - Effetto su pagina: "respiro" che varia troppo durante scroll, creando sensazione di incoerenza
   - **Fix proposto**: Affinare clamp() per range più stretto e coerente tra breakpoint

### 🟡 MAGGIORI (degradano qualità percepita)

5. **Header: logo potrebbe essere troppo piccolo su mobile**
   - `h-12 max-h-12 w-auto sm:h-14 sm:max-h-14 lg:h-[4.25rem]`
   - Mobile: 48px (legibile ma compact)
   - Su dispositivi molto piccoli (<320px), logo potrebbe essere poco visibile
   - **Suggestion**: Se logo è vettoriale (SVG), minsize = 52px mobile per migliore presence

6. **Footer: layout 3 colonne non responsive su tablet**
   - `lg:grid-cols-[1.15fr_0.7fr_1.05fr]` applica solo su lg (≥1024px)
   - Su tablet (640-1023px), fallback a colonna singola con gap-12
   - Effetto: footer "spargato" verticalmente su tablet con spazi bianchi enormi
   - **Fix proposto**: Aggiungere breakpoint intermedio `md:grid-cols-2` per tablet

7. **ConceptSection: larghezza testo potrebbe eccedere 60-70ch (leggibilità)**
   - Pillar description usa `max-w-[58ch]` (buono)
   - Ma sezione intro usa `max-w-none` su tablet/desktop
   - Effetto: riga testo lunga 80-90ch, più difficile da leggere
   - **Fix proposto**: Aggiungere `max-w-[70ch]` al paragrafo intro su desktop

8. **CTA Band: bottoni potrebbero avere spaziatura incoerente su mobile**
   - `gap-4 sm:gap-4` = 16px su mobile
   - Due bottoni di fila su mobile con solo 16px di gap potrebbero apparire "attaccati"
   - **Fix proposto**: Aumentare gap su mobile: `gap-3.5 sm:gap-4` o stack verticale su dispositivi <480px

9. **Hairline oro (divisori): troppo tenue su alcuni sfondi**
   - Gradient `rgba(176,141,87,0.18)` – molto tenue
   - Su avorio chiaro, potrebbe essere quasi invisibile
   - **Fix proposto**: Aumentare opacità a `0.22-0.28` su divisori principali

10. **Animazioni hover su card: transizione di 260ms potrebbe sembrare "lenta"**
    - `.card-shell transition duration-260ms` 
    - Su card piccole (mobile), effetto hover potrebbe risultare "muscoloso"
    - **Suggestion**: Ridurre a 200-220ms per sensazione più responsiva

### 🟢 MINORI (perfezionamenti)

11. **EditionStrip: distribuzione colonne non ottimale su tablet**
    - `md:grid-cols-[auto_1fr] md:items-baseline md:gap-10`
    - Su tablet mediocri, "Edizione 2026" e "Napoli" potrebbero non allinearsi bene
    - **Suggestion**: Aggiungere `md:items-center` per allineamento migliore

12. **SectionHeader: titolo potrebbe diventare troppo grande su desktop ampio**
    - `text-[clamp(2rem, 4.6vw, 3.25rem)]`
    - Su viewport >1600px, titolo = 3.25rem = 52px (buono)
    - **Status**: OK, ma monitorare su desktop extra-large

13. **BrandLogo: immagine SVG potrebbe non centra nella space verticale**
    - `object-contain` + `items-center` dovrebbe allineare, ma su header mobile potrebbe esserci micro-disallineamento
    - **Suggestion**: Verificare visivamente e potenzialmente aggiungere `flex items-center` al wrapper

14. **Form input (se presente): nessun CSS specifico visibile**
    - Se LeadMiniForm ha input, potrebbero mancare stili di focus/invalid
    - **Suggestion**: Aggiungere stili espliciti per form visibility

15. **GrandPrixHighlight: badge layout potrebbe non essere uniforme**
    - `grid grid-cols-2 gap-5 sm:gap-6 lg:grid-cols-4`
    - Su tablet, badge potrebbero avere altezze diverse se immagini non sono quadrate
    - **Fix proposto**: Aggiungere `aspect-square` al contenitore badge

---

## SEZIONI DETTAGLIATE

### A. HEADER

**Dimensioni logo**:
- Mobile (< 640px): h-12 = 48px ✓ accettabile
- Tablet (640-1024px): h-14 = 56px ✓ buono
- Desktop (≥1024px): h-[4.25rem] = 68px ✓ importante ma non dominante

**Problemi**:
- [ ] Logo potrebbe perdere nitidezza se SVG non è ottimizzato per scaling
- [ ] Menu mobile potrebbe avere touch target troppo piccolo se non >44px
- [ ] Navigazione non sovrappone hero in modo pulito su mobile

**Azioni richieste**:
1. Verificare che i link menu abbiano min-height ≥44px
2. Testare colore logo con parallax hero scuro per contrasto

---

### B. HERO SECTION

**Elemento scroll-bound con parallax**:
- Immagine scura (asset locale, non specificato ma presumibile)
- Parallax disabilitato con `prefers-reduced-motion` ✓ corretto
- Scene narrative (5 scene con testo rotante)

**Problemi**:
- [ ] Su mobile, parallax disabilitato ma visuale hero potrebbe essere compresso
- [ ] Sottotitolo potrebbe diventare illeggibile su mobile con contrasto immagine scura
- [ ] 5 scene potrebbero richiedere scroll eccessivo su mobile (altezza hero?)
- [ ] Testo potrebbe non essere centrato verticalmente se immagine è tagliata male

**Azioni richieste**:
1. Aggiungere `background-color` scuro come fallback
2. Verificare overlay scuro sui testi per contrasto garantito
3. Limitare altezza hero su mobile per non occupare >70% viewport

---

### C. EDITION STRIP

**Layout a 3 colonne (desktop)**:
- `md:grid-cols-[auto_1fr_auto] md:items-baseline` 
- Su tablet: fallback a colonna singola con wrap

**Problemi**:
- [ ] Su tablet, "Edizione 2026" e "Napoli" potrebbero non alignarsi verticalmente
- [ ] Responsive font-size per "Napoli" potrebbe essere troppo grande su mobile: `text-[1.7rem] sm:text-[2rem]`

**Azioni richieste**:
1. Aggiungere `md:items-center` al grid
2. Monitorare font-size su mobile <320px

---

### D. AUDIENCE GATEWAY

**Layout 4 card**:
- Mobile: colonna singola con `gap-10`
- Desktop: `lg:grid-cols-4 lg:gap-8`

**Problemi** (critici):
- [ ] Gap incoerente: 40px mobile, 48px tablet, 32-40px desktop
- [ ] Card potrebbero avere altezze diverse se descrizioni variano (problema: `min-h-[300px]` potrebbe essere troppo alto)
- [ ] Su mobile piccoli (<375px), card potrebbero sembrare "spaventosamente vuote" con `min-h-[300px]`
- [ ] Hover effects (border, shadow) potrebbero non visualizzarsi bene se card è già in ombra

**Azioni richieste**:
1. Unificare gap con clamp(): `gap-[clamp(1.5rem, 4vw, 2.5rem)]`
2. Ridurre `min-h-[300px]` a `min-h-[280px]` o renderla relativa a viewport
3. Testare hover su tablet (no touch, no visual feedback)

---

### E. CONCEPT SECTION

**Layout 2 colonne (desktop)**:
- `lg:grid-cols-[1.05fr_0.95fr]` — colonna sinistra titolo/descrizione, destra pillar list

**Problemi**:
- [ ] Descrizione intro usa `max-w-none` su desktop: potrebbe eccedere 70ch di larghezza
- [ ] Pillar description usa `max-w-[58ch]` (buono) ma numero e eyebrow potrebbero non allinearsi se spazi variano
- [ ] Border-top su pillar items potrebbe avere altezza incoerente

**Azioni richieste**:
1. Aggiungere `max-w-[70ch]` alla descrizione intro
2. Monitorare allineamento numero/eyebrow/titolo pillar

---

### F. GRAND PRIX HIGHLIGHT

**Layout 2 colonne + grid badges**:
- Sinistra: titolo, descrizione, link
- Destra: processo (3 step con hairline) + featured badges (2x2 mobile, 4x1 desktop)

**Problemi**:
- [ ] Badges potrebbero avere altezze diverse se immagini non sono quadrate
- [ ] Su tablet, layout 2 colonne potrebbe diventare single-column con spazi bianchi
- [ ] Hover effect su badge (border change) potrebbe non essere visibile su background chiaro

**Azioni richieste**:
1. Aggiungere `aspect-square` ai badge
2. Testare responsive badge layout su tablet
3. Aumentare opacità border hover su badge

---

### G. CTA BAND

**Layout 2 colonne + bottoni**:
- Sinistra: titolo, descrizione
- Destra: 2 bottoni primari + link partnership

**Problemi**:
- [ ] Due bottoni di fila su mobile: gap-4 (16px) potrebbe sembrare "attaccato"
- [ ] Bottoni potrebbero diventare full-width su mobile rendendo il layout confuso
- [ ] Link "Proponi Partnership" potrebbe non avere touch target ≥44px

**Azioni richieste**:
1. Su mobile, stack bottoni verticalmente: `flex flex-col sm:flex-row`
2. Aumentare gap su mobile: `gap-3.5`
3. Aggiungere `min-h-[2.75rem]` al link partnership

---

### H. FOOTER

**Layout 3 colonne (desktop)**:
- `lg:grid-cols-[1.15fr_0.7fr_1.05fr]` con gap-16
- Su tablet: fallback a colonna singola con gap-12

**Problemi** (critici):
- [ ] Nessun layout intermedio per tablet: footer verticale con spazi bianchi enormi
- [ ] Logo + description sul lato sinistro potrebbe occupare troppo spazio
- [ ] Menu rapido (centro) potrebbe non allinearsi bene
- [ ] Azioni chiave (destra) potrebbe diventare full-width

**Azioni richieste**:
1. Aggiungere `md:grid-cols-2` con gap-14
2. Riorganizzare elementi footer su tablet per migliore distribuzione

---

## PROBLEMI DI TIPOGRAFIA

1. **Font-size titoli H2**: usa `clamp(2rem, 4.6vw, 3.25rem)`
   - Range: 32px–52px
   - Su mobile <375px, potrebbe scendere a 28px
   - **Status**: Accettabile ma monitorare

2. **Font-size H3 (card titles)**: `text-[1.55rem] leading-[1.05] tracking-[0.005em]`
   - Potrebbe essere troppo grande se card è stretta
   - **Suggestion**: Aggiungere `sm:text-[1.65rem]` per scaling graduale

3. **Body text**: `text-[0.96rem]` mobile, `text-[1rem]` desktop
   - Gap di solo 0.04rem: potrebbe essere imperceptibile
   - **Suggestion**: Considerare `text-[0.92rem]` mobile, `text-[1.02rem]` desktop per contrasto più chiaro

4. **Line-height**: mix di 1.6, 1.65, 1.7
   - Incoerente ma entro range accettabile (1.5–1.7)
   - **Suggestion**: Standardizzare a 1.65 per corpo, 1.7 per intro

---

## PROBLEMI DI COLORE E CONTRASTO

1. **Hairline oro** (`rgba(176,141,87,0.18)`): molto tenue
   - Su avorio chiaro, quasi invisibile
   - **Fix**: Aumentare a `0.22–0.28` per divisori principali

2. **Testo secondario** (`--color-muted`): `#6a5b56`
   - Contrasto vs avorio: ~5.6:1 (AA)
   - **Status**: Accettabile per WCAG AA

3. **Hero: contrasto testo su immagine scura**
   - Non visibile da codice: dipende dall'immagine reale
   - **Action**: Verificare overlay scuro per garantire ≥7:1 su H1/CTA

---

## PROBLEMI DI SPACING E PADDING

1. **Section padding fluido**: `.section-space { padding-block: clamp(3.5rem, 8vw, 8.75rem) }`
   - Range: 56px–140px (gap enorme)
   - **Suggestion**: Range più stretto `clamp(3.5rem, 5vw, 6.5rem)` = 56px–104px per coerenza

2. **Card padding**: non visibile da componente (usare class-based utilities)
   - **Action**: Standardizzare `p-6 sm:p-7 lg:p-8`

3. **Gap tra elementi**: mix di 3, 4, 5, 6, 8, 10, 12
   - Incoerente
   - **Suggestion**: Usare scale regolare: 2 (8px), 3 (12px), 4 (16px), 5 (20px), 6 (24px), 8 (32px)

---

## PROBLEMI DI RESPONSIVE E BREAKPOINT

1. **Breakpoint Tailwind**: sm (640px), md (768px), lg (1024px), xl (1280px), 2xl (1536px)
   - Layout a volte usa `sm`, a volte `md` per stesso concetto
   - **Suggestion**: Standardizzare su `md` per breakpoint "tablet-like"

2. **Mobile-first vs Desktop-first**: misto
   - Alcuni componenti partono da mobile (buono), altri no
   - **Suggestion**: Standardizzare mobile-first sempre

3. **Touch target su mobile**: difficile da verificare da codice
   - **Action**: Assicurare ≥44-48px su tutti i pulsanti/link

---

## PROBLEMI DI PERFORMANCE (layout-related)

1. **Librerie CSS**: usa Tailwind 4 + CSS custom properties
   - **Status**: Buono, no dipendenze pesanti

2. **Immagini**: Next.js `<Image>` con `sizes` props
   - **Status**: Buono per optimizzazione

3. **SVG**: logo vettoriale, no raster
   - **Status**: Buono per scaling

4. **Animazioni**: use CSS transitions + motion-reduce
   - **Status**: Buono per accessibility

---

## PROPOSTE ALTERNATIVE (3D / VISUAL)

### Idea 1: Hero scroll-bound con variante 3D (opzionale, basso peso)

**Descrizione**: Sostituire immagine parallax con WebGL leggero (Three.js Lite o Babylon.js)
- Oggetto 3D: goccia d'olio astratta che ruota lentamente durante scroll
- Fallback: immagine SVG se WebGL non disponibile
- Peso stimato: +40-60KB per bundle (accettabile)
- Performance: 60fps su mobile moderni con caveat su device vecchi

**Pros**:
- Effetto premium, differenziante
- Leggero e vettoriale
- Fallback statico affidabile

**Cons**:
- Richiede setup WebGL (non banale)
- Potrebbe degradare su browser old/mobile
- Non essenziale: il design attuale funziona

**Raccomandazione**: ⏸️ **In hold** — proporre solo se approvato, non implementare ora

### Idea 2: Bottiglia stilizzata 3D in GrandPrix badge

**Descrizione**: Al posto di immagine PNG, badge Grand Prix potrebbe mostrare piccolo modello 3D di bottiglia
- Peso: +20-30KB per modello GLTF compressed
- Rendering: headless via Canvas 2D o lightweight WebGL

**Pros**:
- Effetto di lusso
- Differenzia category badge

**Cons**:
- Aggiunge complessità
- Difficile da mantenere
- Non allineato con brief (solito design, non redesign)

**Raccomandazione**: ❌ **Skip** — non allineato con scope, rimanere con immagini

### Idea 3: Linea racing 3D sotto hero

**Descrizione**: Piccola linea 3D astratta che scende dal hero verso le sezioni, metafora della "strada" del viaggio
- Rendering: SVG animated + eventuale 3D fallback
- Peso: <10KB

**Pros**:
- Sottile, elegante
- Metaforicamente appropriato
- Peso negligibile

**Cons**:
- Potrebbe sembrare "troppo" se male eseguita
- Non migliora user engagement

**Raccomandazione**: ⏸️ **In hold** — proposta interessante ma non critica

---

## LISTA AZIONI (Priority-ordered)

### Tier 0: CRITICAL (fix immediato)
- [ ] Hero: garantire contrasto testo ≥7:1 con overlay
- [ ] AudienceGateway: unificare gap con clamp()
- [ ] Footer: aggiungere layout md:grid-cols-2

### Tier 1: MAJOR (fix desiderabile)
- [ ] Bottoni: semplificare altezze (48px / 52px)
- [ ] CTA Band: stack bottoni vertically su mobile
- [ ] ConceptSection: aggiungere max-width intro
- [ ] GrandPrixHighlight: aggiungere aspect-square badge

### Tier 2: MINOR (perfect-at-your-leisure)
- [ ] Hairline: aumentare opacità
- [ ] Transizioni: ridurre card hover da 260ms a 200ms
- [ ] Spacing: unificare scale padding/gap

### Tier 3: MONITOR (verificare visivamente)
- [ ] SectionHeader: font-size titoli su desktop ampio
- [ ] BrandLogo: allineamento verticale
- [ ] Form input: stili focus/invalid

---

## PROSSIMO STEP

1. **Approvazione audit**: confermare priorità e scope
2. **Correzioni**: implementare Tier 0 + Tier 1
3. **Verifica visuale**: screenshot + manual test desktop/tablet/mobile
4. **Build + deploy**: `npm run build` e test su Aruba hosting
5. **Final checklist**: form backend, DNS, performance

---

**Compiled by**: Claude (Audit automatico)  
**Date**: 29 May 2026, 21:15 UTC  
**Status**: ✅ READY FOR IMPLEMENTATION
