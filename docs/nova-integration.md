# Nova-Integration

[← Zurück zur Übersicht](../README.md)

Eine kleine Hilfsintegration für die Nova Cards (`custom_components/nova`, Domain `nova`). Sie speichert Dinge, die nicht
in den Browser gehören, dauerhaft in Home Assistant. Aufgebaut aus Modulen – das erste ist **Rezepte** für die
[Nova Recipe Book](recipe-book-card.md), dazu **Static** für die Schriften. Weitere Module (z. B. Kartenauswahl, Benachrichtigungsleiste) kommen später dazu.

## Einrichten (vorerst von Hand)

1. Den Ordner `custom_components/nova` aus diesem Repository nach `/config/custom_components/nova` kopieren
   (z. B. mit der App „File editor“ oder „Samba share“). Danach liegt dort u. a. `/config/custom_components/nova/manifest.json`.
2. Home Assistant neu starten.
3. Einstellungen → Geräte & Dienste → Integration hinzufügen → „Nova“ → Absenden.

Update: Ordner erneut kopieren (überschreiben) und HA neu starten. Die Rezepte bleiben erhalten.

## Modul Rezepte

- Rezepte: `/config/.storage/nova_recipes` (kommt mit ins Backup)
- Bilder: `/config/www/nova-recipes/`, geladen über `/local/nova-recipes/…`. Bilder, die keinem Rezept gehören
  (z. B. Formular abgebrochen), werden beim Start nach 24 Stunden entfernt.
- WebSocket-Befehle: `nova/recipes/list`, `nova/recipes/subscribe`, `nova/recipes/save` (`recipe`),
  `nova/recipes/delete` (`recipe_id`), `nova/recipes/upload` (`data` als Base64, `content_type`)
- HTTP: `POST /api/nova/recipes/image` mit dem Bild als Body (JPEG, PNG oder WebP, höchstens 8 MB), nur angemeldet

## Modul Static

Liefert `custom_components/nova/static/` unter `/nova/static/` aus – zurzeit die Schriften des Rezeptbuchs
(`fonts/`, Caveat und EB Garamond, SIL Open Font License, Lizenztexte daneben). Erzeugt aus `@fontsource/caveat` und
`@fontsource/eb-garamond` (npm) mit fonttools:

```bash
pyftsubset node_modules/@fontsource/caveat/files/caveat-latin-400-normal.woff2 \
  --unicodes="U+0020-007E,U+00A0-00FF,U+2013-2014,U+2018-201E,U+2022,U+2026,U+20AC,U+2153-2155,U+215B" \
  --flavor=woff2 --output-file=custom_components/nova/static/fonts/nova-hand-400.woff2
```

## Tests

```bash
pip install pytest-homeassistant-custom-component
pytest
```
