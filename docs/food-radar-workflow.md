# Workflow Diario del Sud

- Il Food Radar raccoglie notizie esterne.
- Le notizie selezionate vengono trasformate in item con titolo, fonte, link e nota editoriale.
- Il sito pubblica solo titolo, fonte, link e nota breve.
- Non vengono copiati articoli.
- Il link rimanda sempre alla fonte originale.
- Per aggiornare la pagina, aggiungere gli item verificati in `src/data/foodRadar.ts`.

## Formato dati

Schema TypeScript di riferimento: `src/data/foodRadar.ts`.

Esempio di formato (NON di contenuto): `docs/food-radar-example.json`. Le URL `example.com` presenti nell'esempio sono placeholder e non vanno pubblicate.

Campi attesi per ogni `FoodRadarItem`:

- `id`: identificativo stabile della segnalazione.
- `category`: una tra `Oro Verde`, `Calici di Magna Grecia`, `Radar del Sud`, `Business con Anima`, `Territori`.
- `title`: titolo della segnalazione, sintetico.
- `source`: nome leggibile della fonte (testata, sito istituzionale, consorzio, azienda).
- `date`: opzionale, formato testuale già leggibile.
- `url`: link diretto alla fonte originale, da aprire in nuova scheda.
- `note`: nota editoriale breve "Perché ci interessa". Non è il contenuto dell'articolo.

## Regole editoriali

- Niente articoli originali generati dal sito.
- Niente date, premi o numeri inventati.
- Una segnalazione entra nel Diario del Sud solo dopo verifica della fonte originale.
- La nota editoriale è una riga: contesto, non riassunto integrale.
