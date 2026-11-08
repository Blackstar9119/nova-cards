# Changelog

Alle nennenswerten Änderungen an Nova Cards. Format nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionsnummern nach [Semantic Versioning](https://semver.org/lang/de/).

## [0.12.0] – unveröffentlicht

### Hinzugefügt
- Nova Uhr Card: Option `style` mit vier neuen Stilen neben `default` – `flip` (Klappzahlen, nur Stunden und Minuten, nur geänderte
  Ziffern klappen in 600 ms um), `analog` (Zifferblatt, Sekundenzeiger per `second_hand`: `sweep`, `tick`, `none`), `glow` (Leuchtziffern,
  Farbe folgt dem Sonnenstand aus `sun.sun`) und `retro` (Radiowecker mit Sieben-Segment-Ziffern als SVG, ausgeschaltete Segmente mit 8 %,
  Doppelpunkt blinkt im Sekundentakt, `retro_color`: `red`,
  `green`, `blue`, `amber`). Stil im Editor wählbar.
- Theme-Variablen `--nova-clock-morning`, `--nova-clock-noon`, `--nova-clock-night` und `--nova-led-red|green|blue|amber`.
- Nova Uhr, Timer und Swipe Card sowie Nova Einkauf und Notiz Card aus den Feature-Branches zusammengeführt.
- `docs/DESIGN.md` als feste Design-Referenz, dieses Changelog.

### Behoben
- Nova Uhr Card: Inhalt auf breiten Karten (ab 420 px) vertikal zentriert statt oben; Radiowecker ohne PM-Punkt bei 24 Stunden.
- Nova Uhr Card: Uhrzeit immer in der Zeitzone von Home Assistant (`hass.config.time_zone`), nicht in der des Browsers.
- Zahlen ohne Formatierung durch HA (z. B. Werte unter der Uhr) nach dem Zahlenformat des HA-Profils: `21,5 °C` statt `21.5 °C`.
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
