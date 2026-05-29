# Review Completa: Vini Oli Sud Homepage

**Data review**: 2026-05-16  
**Focus**: Homepage, sezioni principali, layout visivo, contenuti  
**Criterio**: Completezza, coerenza, assenza di placeholder, premium feel

---

## 1. Executive Summary

### ✅ Cosa funziona bene

- **HeroSection**: Implementazione corretta dello scroll-bound video background (progress-based image parallasse)
- **Palette colori**: Coerente, mediterranea, premium (vino, oliva, mare, oro, avorio)
- **Typography scale**: Gerarchie chiare, font stack appropriati (Cormorant Garamond, Montserrat, Source Sans 3)
- **Responsive design**: Breakpoint e media query ben strutturati
- **ConceptSection**: Testo, pillar, layout coerente e visivamente bilanciato
- **AudienceGateway**: 4 card ben strutturate con routing chiaro
- **GrandPrixHighlight**: Sezione di valore con badge e stats
- **CtaBand**: Hero finale scuro con contrasto forte e CTA evidenti

### ⚠️ Cosa è incompleto

1. **Placeholder visibili**: EditionStrip contiene "Date e dettagli operativi saranno comunicati sui canali ufficiali" - rischia di sembrare non definitivo
2. **Numeri non verificati**: GrandPrixHighlight contiene stats (10, 236, 70+) non etichettati come DA VERIFICARE
3. **Sezioni mancanti**: RegionsSection e EditorialPreview non sono nella homepage, potrebbero essere necessarie
4. **Asset images**: Immagini `tavola-scroll-master.jpg` e `tavola-scroll-mobile.jpg` non ancora caricate
5. **CTA text**: Alcuni CTA (es. "Richiedi aggiornamenti visitatori") sono generici e non brand-specifici

### 🎨 Problemi visivi

1. **Divider tra Hero e EditionStrip**: Non c'è separazione netta, potrebbe sembrare attaccato
2. **EditionStrip**: Sfondo quasi bianco (rgba(255,251,245,0.6)) → difficile distinguerlo dal bg body
3. **Linee decorative**: Gradiente via-[rgba(200,167,111,0.25)] potrebbe essere troppo soft
4. **ConceptSection**: Riga top è gradevole ma inconsistente rispetto a altre linee
5. **Card border colori**: Border border-[rgba(200,167,111,0.14)] sono molto soft, quasi invisibili
6. **Transizione CtaBand**: Salto cromatico netto da ivory a grove (--color-grove) potrebbe sentirsi abrupt

### ❌ Cosa rischia di sembrare placeholder

- EditionStrip note field: "Date e dettagli operativi saranno comunicati..." (copy placeholder visibile)
- GrandPrixHighlight stats: Numeri 10/236/70+ senza contesto di quando/come verificati
- CtaBand descrizione: "Due percorsi prioritari..." è custom text, non nel siteConfig

---

## 2. Tabella: Sezioni da completare

| # | Sezione | File | Stato Contenuto | Problema | Proposta | Priorità |
|---|---------|------|---|---|---|---|
| 1 | Hero Scroll-Bound | `HeroSection.tsx` | ✅ Valido | Asset images mancanti (tavola-scroll*.jpg) | Caricare images verticali (230-250vh) | **ALTA** |
| 2 | Edition Strip | `EditionStrip.tsx` | ⚠️ Debole | Testo "Date saranno comunicati..." è placeholder visibile | Sostituire con data ufficiale o nascondere completamente | **ALTA** |
| 3 | Audience Gateway | `AudienceGateway.tsx` | ✅ Valido | CTA "Richiedi aggiornamenti visitatori" è generico | Abbassare visibility se non prioritario; usare copy più brand-driven | **MEDIA** |
| 4 | Concept Section | `ConceptSection.tsx` | ✅ Valido | Nessun problema rilevante | — | — |
| 5 | Grand Prix Highlight | `GrandPrixHighlight.tsx` | ⚠️ Da verificare | Stats (10, 236, 70+) non etichettati come definitivi | Etichettare con `[DA VERIFICARE]` oppure fonte; mancano badge images | **ALTA** |
| 6 | CTA Band finale | `CtaBand.tsx` | ⚠️ Debole | Descrizione è custom "Due percorsi prioritari..." (non in siteConfig) | Sincronizzare con siteConfig.finalCta o farlo esplicito nel componente | **MEDIA** |
| 7 | Regions Section | `RegionsSection.tsx` | ❓ Sconosciuto | Non presente in homepage; dovrebbe mostrare 8 regioni | Considerare se aggiungere tra ConceptSection e GrandPrix | **BASSA** |
| 8 | Editorial Preview | `EditorialPreview.tsx` | ❓ Sconosciuto | Non presente in homepage; "Diario del Sud" è menzionato ma non visible | Considerare se aggiungere come sezione "Ultime storie" | **BASSA** |

---

## 3. Tabella: Problemi Visivi

| # | Sezione | Descrizione | Causa | Correzione consigliata | Priorità |
|---|---------|---|---|---|---|
| 1 | EditionStrip | Sfondo quasi invisibile: rgba(255,251,245,0.6) si mescola col body bg | Opacity troppo bassa + colore simile body gradient | Aumentare opacity a 0.8-0.85 oppure usare colore più contrastato (es. verde leggero) | **MEDIA** |
| 2 | Separazione Hero-EditionStrip | Nessuna linea/bordo netto tra Hero e EditionStrip | Assenza di divider o contrast change | Aggiungere border-top soft oppure aumentare bg opacity di EditionStrip | **BASSA** |
| 3 | Card border in AudienceGateway | Border border-[rgba(200,167,111,0.14)] è quasi invisibile | Opacity 0.14 è troppo soft | Aumentare a 0.22-0.28 per visibilità | **BASSA** |
| 4 | Linee decorative | Gradient linee via-[rgba(200,167,111,0.25)] sono molto soft, poco impatto | Opacity bassa per via-point | Considerare opacity 0.35-0.45 su via-point | **BASSA** |
| 5 | Salto colore CtaBand | Transizione da ivory (body) a grove (CtaBand dark) sembra abrupt | Nessun gradiente/transizione soft | Aggiungere sezione "bridge" o gradiente pre-CtaBand | **MEDIA** |
| 6 | Z-index/layering | Card in AudienceGateway non hanno shadow significativa | Box-shadow troppo soft (0.035) | Aumentare shadow opacity per profondità (es. 0.06-0.08) | **BASSA** |
| 7 | GrandPrixHighlight separazione | Stats/featured list layout ha linee verticali sottili | Gradient linee opacity 0.2 è bassa | Aumentare opacity su linee decorative | **BASSA** |

---

## 4. Dati da Verificare Prima della Pubblicazione

### Stats (GrandPrixHighlight.tsx)

```
value: "10" → label: "riconoscimenti"  [DA VERIFICARE: Da quale anno? Quali award?]
value: "236" → label: "vini valutati"  [DA VERIFICARE: Edizione 2025 o precedenti?]
value: "70+" → label: "aziende partecipanti"  [DA VERIFICARE: Numero preciso o stima?]
```

### Award categories (GrandPrixHighlight)

```
- "Miglior Spumante"
- "Miglior Vino Bianco"
- "Miglior Vino Rosso"
```

**Domande**: 
- Sono ufficiali per 2026?
- Ci sono altri award oltre questi 3 Featured?
- Ci sono badge/immagini per ogni award?

### Edition info (EditionStrip.tsx)

```
label: "Edizione 2026"
city: "Napoli"
context: "In dialogo con Napoli Racing Show / Gran Premio di Napoli"
note: "Date e dettagli operativi saranno comunicati sui canali ufficiali."
```

**Domande**:
- Date ufficiali della Edizione 2026?
- Location precisa in Napoli?
- Integration con Napoli Racing Show confermata?

### Contact info (site.ts)

```
projectEmail: "info@vinisud.it"
organizer emails: "napoliracingshow@gmail.com" + PEC
phones: "3295535164", "3276616294"
VAT: "10430641216"
Fiscal Code: "95334510633"
```

**Status**: ✅ Sembra verificato, ma controllare se email è monitorata attivamente

### CTA text (CtaBand.tsx)

```
"Due percorsi prioritari per entrare nel progetto con obiettivi chiari, 
relazioni rilevanti e un contesto mediterraneo ad alto valore percepito."
```

**Domanda**: È copy ufficiale o draft custom nel componente? Se custom, dovrebbe sincronizzarsi con `siteConfig.finalCta` in `site.ts`.

### Grand Prix winners data

Manca verifica su:
- Produttori/wineries sono definitivi?
- Badge images (.badgeSrc) sono caricate in `/brand/`?
- File `src/data/winners.ts` contiene dati verificati?

---

## 5. Raccomandazioni Operative

### 🚀 Quick Fix (da fare SUBITO)

1. **EditionStrip**: Mascherare o sostituire placeholder "Date saranno comunicati..."
   - Opzione A: Nascondere la nota con `hidden` class se non ufficiale
   - Opzione B: Sostituire con data effettiva (es. "Giugno 2026, Napoli")

2. **Asset images**: Caricare `tavola-scroll-master.jpg` + `tavola-scroll-mobile.jpg`
   - Senza, Hero mostra solo fallback scuro
   - Priorità: essenziale per hero

3. **GrandPrix stats**: Aggiungere label "DA VERIFICARE" oppure verificare numeri
   - Se numeri sono 2025, rendere esplicito
   - Se stime, aggiungere disclaimer

### 📝 Miglioramenti Editoriali

1. **CtaBand.tsx**: Sincronizzare descrizione con siteConfig
   - Testo "Due percorsi prioritari..." è custom
   - Proposta: Aggiungere field `finalCta.description` in site.ts

2. **AudienceGateway CTA**: Valutare se "Richiedi aggiornamenti visitatori" è definitivo
   - Se no, proporre copy più coerente (es. "Scopri l'esperienza")

3. **Grand Prix**: Aggiungere source/note sui dati
   - Esempio: "(Edizione 2025, fonte [collegamento all'albo d'oro])"

4. **RegionsSection / EditorialPreview**: Decidere se aggiungere alla homepage
   - RegionsSection: menziona 8 regioni ma non è visible. Potrebbe essere sezione dopo Concept
   - EditorialPreview: "Diario del Sud" è strategico; considerare placement prima di CtaBand

### 🎨 Miglioramenti Layout/Design

1. **EditionStrip**: Aumentare contrasto
   - Cambiare bg da `rgba(255,251,245,0.6)` a `0.85` oppure colore più scuro (es. gold light)
   - Oppure aggiungere border-top soft per separazione

2. **Linee decorative**: Aumentare visibility
   - Via-point delle linee gradient: da `0.25` a `0.35-0.45`
   - Card border: da `0.14` a `0.22-0.28`

3. **CtaBand transition**: Ammorbidire salto colore
   - Aggiungere sezione "bridge" (1-2rem) con background intermediario
   - Oppure gradient background pre-CtaBand

4. **Hero-EditionStrip separation**: Aggiungere divider
   - Thin border-top gradient oppure aumentare padding/spacing

5. **Grand Prix shadow**: Aumentare visibilità card
   - Shadow da `0.035` a `0.06-0.08` per profondità

### ✅ Cose da NON toccare (già funzionano)

- **HeroSection architettura**: Scroll-bound, progress calc, transform parallasse ✅
- **ConceptSection**: Testo, pillar, layout ✅
- **Palette colori**: Coerente e mediterranea ✅
- **Typography scale**: Gerarchie appropriate ✅
- **Responsive breakpoint**: Funzionano correttamente ✅
- **AudienceGateway routing**: Link a `/contatti` con query param ✅

---

## 6. Piano di Intervento

### Step 1: Pulizia Layout e Transizioni Sezioni (30 min)

**Obiettivo**: Rendere le sezioni visivamente separate e coerenti

1. EditionStrip: aumentare opacity bg da 0.6 a 0.85
2. Aggiungere border-top soft a EditionStrip per separazione da Hero
3. Aumentare opacity linee decorative (via-point) da 0.25 a 0.35
4. Aumentare card border opacity da 0.14 a 0.22
5. Aggiungere sezione "bridge" soft tra ivory e CtaBand oppure gradient
6. Aumentare shadow sui card GrandPrix da 0.035 a 0.06

**File**: `globals.css` + componenti sezione

---

### Step 2: Sostituzione Placeholder (1 ora)

**Obiettivo**: Nessun testo placeholder visibile

1. EditionStrip: Nascondere oppure sostituire "Date saranno comunicati..."
   - Se non confermato: `className="hidden"` su `<p>` note
   - Se confermato: aggiornare con data reale
2. Verificare stats GrandPrix: aggiungere note "Source: [anno, link]" oppure `[DA VERIFICARE]`
3. CtaBand descrizione: Sincronizzare con siteConfig oppure commentare come custom

**File**: `site.ts`, `EditionStrip.tsx`, `CtaBand.tsx`, `GrandPrixHighlight.tsx`

---

### Step 3: Revisione CTA (30 min)

**Obiettivo**: Coerenza e clarity nei call-to-action

1. AudienceGateway: Verificare se tutti 4 CTA sono appropriati
   - "Richiedi aggiornamenti visitatori" è generico?
   - Proposta alternativa: "Scopri l'esperienza"

2. CtaBand: Sincronizzare descrizione con siteConfig.finalCta
   - Aggiungere `finalCta.description` in site.ts oppure marcare come custom nel commento

3. Verificare che tutti i link in `href` puntano a `/contatti` con query param corretti

**File**: `site.ts`, `AudienceGateway.tsx`, `CtaBand.tsx`

---

### Step 4: Controllo Responsive (20 min)

**Viewport test**:
- [ ] Desktop 1536x864: Nessun testo/gateway tagliato
- [ ] Tablet 768x1024: Colonne stack correttamente
- [ ] Mobile 375x667: CTA non overflow, card responsive

**File**: Verificare breakpoint in componenti

---

### Step 5: Asset e Build Finale (45 min)

**Obiettivo**: Sito pronto per il build

1. Caricare `tavola-scroll-master.jpg` in `public/images/home/`
2. Caricare `tavola-scroll-mobile.jpg` in `public/images/home/`
3. Verificare badge images per GrandPrix in `public/brand/`
4. `npm run lint` → nessun errore
5. `npm run build` → success
6. Controllare console per warning/error

**File**: `public/images/home/`, `public/brand/`

---

### Timeline stimato

| Step | Tempo | Owner |
|------|-------|-------|
| 1. Pulizia layout | 30 min | Design/Frontend |
| 2. Placeholder | 1 h | Content/Frontend |
| 3. CTA review | 30 min | Content/UX |
| 4. Responsive test | 20 min | QA |
| 5. Asset + build | 45 min | Frontend |
| **TOTALE** | **~3 ore** | — |

---

## 7. Checklist Pre-Pubblicazione

### Content
- [ ] EditionStrip: Date ufficiali 2026 confermate o placeholder rimosso
- [ ] GrandPrix stats: Verificati e labellati
- [ ] Tutti i CTA hanno target corretto (`/contatti`, `/evento`, `/grand-prix`)
- [ ] Nessun testo "placeholder", "TODO", "Da riempire", "DA VERIFICARE" visibile

### Visivo
- [ ] Hero scroll-bound: Asset images caricate
- [ ] Linee decorative: Opacity aumentata per visibilità
- [ ] EditionStrip: Separazione netta dalla Hero
- [ ] CtaBand: Transizione smooth da ivory a grove
- [ ] Card shadow: Aumentate per profondità
- [ ] Border card: Visibility adeguata

### Responsive
- [ ] Desktop 1536x864: ✅ Tutto visibile
- [ ] Tablet 768x1024: ✅ Layout corretto
- [ ] Mobile 375x667: ✅ Testo leggibile, no overflow

### Technical
- [ ] `npm run lint`: 0 errori
- [ ] `npm run build`: Success
- [ ] Browser DevTools console: Nessun errore JS
- [ ] Accessibility: ARIA label, semantic HTML OK

---

## 8. Note Finali

### Forza del Sito

Il sito ha una **base solida e coerente**:
- Architettura responsabile (HeroSection, ConceptSection, routing chiaro)
- Design language premium e documentato
- Palette colori e typography ben pensate
- Layout responsive funzionante

### Rischi principali

1. **Placeholder visibile** (EditionStrip) che fa sembrare il sito incompleto
2. **Asset images mancanti** per hero (fallback solo scuro)
3. **Stats senza fonte** nel GrandPrix (affidabilità)
4. **Divider insufficienti** tra sezioni (potrebbe sembrare "pagine attaccate")

### Prossimi step strategici

Dopo il lancio della homepage:
1. Implementare RegionsSection come sezione indipendente
2. Aggiungere EditorialPreview (Diario del Sud) come hub di contenuti
3. Popolare `/grand-prix` con albo d'oro completo e verificato
4. Implementare form `/contatti` con validazione email
5. Pianificare content strategy per SEO (Diario del Sud + location/product pages)

---

**Fine Review**
