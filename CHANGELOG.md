# Changelog

Alle nennenswerten Änderungen an Nova Cards. Format nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionsnummern nach [Semantic Versioning](https://semver.org/lang/de/).

## [0.12.0] – unveröffentlicht

### Hinzugefügt
- Nova Recipe Book (`custom:nova-recipe-book-card`): Rezeptbuch im Stil eines alten Kochbuchs mit Ledereinband,
  Aufklapp- und Umblätter-Animation, Inhaltsverzeichnis, Rezeptseiten mit eingeklebtem Foto, Formular für neue Rezepte,
  Bearbeiten, Löschen und „Zutaten auf Einkaufsliste“. Schriften (Caveat, EB Garamond, SIL OFL) als Latin-Subset über die
  Nova-Integration (`/nova/static/fonts`), geladen erst, wenn das Buch zu sehen ist – nicht im Haupt-Bundle.
- Nova-Integration `custom_components/nova` 0.1.0 (Domain `nova`, modular) mit Modul Rezepte: `.storage/nova_recipes`,
  Bilder unter `/config/www/nova-recipes`, WebSocket `nova/recipes/list|subscribe|save|delete|upload`, HTTP-Upload
  `POST /api/nova/recipes/image`; Modul Static liefert `/nova/static/` aus. Mit Tests (pytest).
- Nova Uhr Card: Option `style` mit vier neuen Stilen neben `default` – `flip` (Klappzahlen, nur Stunden und Minuten, nur geänderte
  Ziffern klappen in 600 ms um), `analog` (Zifferblatt, Sekundenzeiger per `second_hand`: `sweep`, `tick`, `none`), `glow` (Leuchtziffern,
  Farbe folgt dem Sonnenstand aus `sun.sun`) und `retro` (Radiowecker mit Sieben-Segment-Ziffern als SVG, ausgeschaltete Segmente mit 8 %,
  Doppelpunkt blinkt im Sekundentakt, `retro_color`: `red`,
  `green`, `blue`, `amber`). Stil im Editor wählbar.
- Theme-Variablen `--nova-clock-morning`, `--nova-clock-noon`, `--nova-clock-night` und `--nova-led-red|green|blue|amber`.
- Nova Uhr, Timer und Swipe Card sowie Nova Einkauf und Notiz Card aus den Feature-Branches zusammengeführt.
- `docs/DESIGN.md` als feste Design-Referenz, dieses Changelog.
- Pop-up Card: Info-Chips per `info_position` in der Kopfzeile; Pop-up und Bereich: zu lange Titel laufen langsam hin und her.
- Nova Navi: Mini-Player nur bei laufender Wiedergabe, Lautsprecher-Auswahl, Rückmeldung bei Play.
- Chips: Nachkommastellen (`decimals`) im Editor, Einheit wie in HA (21,9 °C, 62 %).

### Behoben
- Nova Uhr Card: Inhalt auf breiten Karten (ab 420 px) vertikal zentriert statt oben; Radiowecker ohne PM-Punkt bei 24 Stunden.
- Nova Uhr Card: Uhrzeit immer in der Zeitzone von Home Assistant (`hass.config.time_zone`), nicht in der des Browsers.
- Zahlen nach dem Zahlenformat des HA-Profils (`language`, `comma_decimal`, `decimal_comma`, `space_comma`, `none`), auch
  ohne `formatEntityState` und mit `decimals`: `21,5 °C` statt `21.5 °C`.
- Nova Swipe Card: Tippen in einem Eingabefeld (z. B. Einkaufsliste) hält „Zurück zu Seite 1 nach“ auf; solange ein Feld den
  Fokus hat, springt die Karte nicht zurück.

### Geändert
- Nova Uhr Card: `mode: analog` gilt als ältere Schreibweise von `style: analog` und funktioniert unverändert weiter.

## [0.11.1] – 2026-10-30

### Geändert
- Pop-up nur über dem Inhaltsbereich, nicht mehr über der Seitenleiste.

## [0.11.0] – 2026-10-30

### Hinzugefügt
- Nova Navi (früher Dock) mit Seitenleiste, Untermenüs, Aktionen, Sichtbarkeit, Badges und Media-Leiste.
- Nova Gerät Card und Nova 3D-Drucker Card in README und Doku.

Ältere Versionen: siehe Git-Verlauf.

[0.12.0]: https://github.com/Blackstar9119/nova-cards/compare/v0.11.0...HEAD
[0.11.1]: https://github.com/Blackstar9119/nova-cards/compare/v0.11.0...v0.11.1
[0.11.0]: https://github.com/Blackstar9119/nova-cards/releases/tag/v0.11.0
