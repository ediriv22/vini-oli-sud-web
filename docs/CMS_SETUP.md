# CMS Setup — Vini Oli Sud

## Come usare il CMS (per la Segretaria)

### 1. **Accedi al CMS**
- Vai su: `https://vinisud.vercel.app/admin`
- Clicca **Login with GitHub**
- Accedi con le credenziali GitHub

### 2. **Modifica Contenuti**

#### **Sezioni Homepage**
- Vai a **Sezioni Homepage**
- Seleziona una sezione (es. "Hero", "Highlights")
- Modifica titolo, sottotitolo, descrizione
- Salva → Auto-commit su GitHub → Auto-deploy su Vercel

#### **Pagine**
- Vai a **Pagine**
- Crea nuova pagina o modifica esistente
- Scrivi contenuto in Markdown
- Salva e pubblica

#### **Navigazione**
- Vai a **Navigazione** → **Menu Principale**
- Aggiungi/modifica voci menu
- Salva

#### **Impostazioni Sito**
- Vai a **Impostazioni Sito**
- Modifica nome, email, telefono, indirizzo
- Salva

---

## Setup per Sviluppatori

### Installazione

```bash
npm install decap-cms-app@latest
```

### Configurazione GitHub OAuth (Production)

1. Vai a GitHub Settings → Developer settings → OAuth Apps
2. Crea nuova OAuth App:
   - Application name: "Vini Oli Sud CMS"
   - Homepage URL: `https://vinisud.vercel.app`
   - Authorization callback URL: `https://api.decapcms.org/v1/github/callback`

3. Copia `Client ID` e `Client Secret`

4. Aggiungi a `public/admin/config.yml`:
```yaml
backend:
  name: github
  repo: ediriv22/vini-oli-sud-web
  branch: main
  auth_endpoint: api/auth
  app_id: YOUR_CLIENT_ID
  secret: YOUR_CLIENT_SECRET
```

5. Crea API endpoint: `src/app/api/auth/route.ts`

### File Structure

```
content/
├── pages/           # Pagine interne
├── sections/        # Sezioni homepage
├── navigation/      # Menu
└── settings/        # Config sito

public/admin/
├── config.yml       # Config CMS
└── index.html       # Admin UI
```

### Deploy

- Push automatico su main → Vercel redeploya
- CMS salva i file in `content/` folder
- Rebuild necessario per i contenuti (ca. 30 sec)

---

## Limitazioni Attuali

- CMS modifica file, ma il frontend deve leggere questi file
- Richiede rebuild per visualizzare i cambi
- Non è real-time come un backend separato

## Prossimi Step

Per rendere i contenuti **dinamici senza rebuild**:
- Aggiungere Strapi backend (separato)
- O usare Postgres + API semplice

