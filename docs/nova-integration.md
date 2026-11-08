# Nova-Integration

[← Zurück zur Übersicht](../README.md)

Eine kleine Hilfsintegration für die Nova Cards (`custom_components/nova`, Domain `nova`). Sie speichert Dinge, die nicht
in den Browser gehören, dauerhaft in Home Assistant. Aufgebaut aus Modulen – das erste ist **Rezepte** für die
[Nova Recipe Book](recipe-book-card.md). Weitere Module (z. B. Kartenauswahl, Benachrichtigungsleiste) kommen später dazu.

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

## Tests

```bash
pip install pytest-homeassistant-custom-component
pytest
```
