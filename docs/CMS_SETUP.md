# CMS / Pannello segreteria — setup

> **Nota:** la versione precedente di questo file descriveva un CMS basato su
> Decap CMS + login GitHub + Vercel. Quell'approccio **non è più in uso**. Il
> pannello reale è in **PHP** (`public/admin/`), con login a password, salvataggi
> via **GitHub Contents API** e deploy su **Aruba via FTP** (GitHub Actions).

## Per chi usa il pannello (segreteria)
Guida d'uso passo-passo: [`GUIDA-SEGRETERIA.md`](GUIDA-SEGRETERIA.md).

## Per chi sviluppa/mantiene
Architettura, editor visuale/canva, come estendere:
[`EDITOR-VISUALE.md`](EDITOR-VISUALE.md).

## Come funziona (in breve)

- **URL**: `https://www.vinisud.it/admin` → `public/admin/index.php`.
- **Accesso**: password in `public/admin/config.php` (`ADMIN_PASSWORD`).
- **Salvataggio**: ogni "Pubblica" è un commit sul repo via GitHub Contents API
  (token in `config.php`, `GITHUB_TOKEN`, permesso *Contents: Read and write*).
- **Pubblicazione**: il commit su `main` fa partire il workflow
  `.github/workflows/deploy.yml` → build statica (`out/`) → FTP su Aruba.
- **Contenuti**: file JSON in `content/settings/`
  - `site.json` — generale, tema, favicon, sfondi (hero, Grand Prix);
  - `home-sections.json` — testi di tutte le sezioni home;
  - `home-layout.json` — ordine e visibilità delle sezioni.

## Setup sul server (una tantum)

1. Copiare `public/admin/config.example.php` in `public/admin/config.php` sul
   server Aruba (il file è in `.gitignore` ed escluso dal deploy: non finisce mai
   nel repo).
2. Compilare i valori reali:
   - `GITHUB_TOKEN` — fine-grained token, permesso *Contents R/W* solo su questo
     repo;
   - `ADMIN_PASSWORD` — la password che userà la segreteria.
3. Non serve altro: nessun database, nessun backend aggiuntivo.

## Sviluppo in locale

- `npm install && npm run dev` per il sito Next.js.
- Per l'admin serve PHP (`php -S localhost:8080 -t public`) con un `config.php`
  finto; con token vuoto la lettura da GitHub (repo pubblico) funziona, il
  salvataggio fallisce in auth — l'interfaccia resta testabile.
- `npm run lint` e `npm run build` devono passare; il workflow di deploy esegue
  anche `php -l` su tutti i file PHP.
