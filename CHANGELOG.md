# Changelog

Alle nennenswerten Änderungen an Nova Cards. Format nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionsnummern nach [Semantic Versioning](https://semver.org/lang/de/).

## [0.12.0] – unveröffentlicht

### Hinzugefügt
- Design-Tokens: alle Farben, Radien, Schatten, Blur-Werte, Schriftgrößen, Abstände und Übergangszeiten der Karten stehen zentral in
  `src/shared/theme.js` (rund 110 Tokens, Liste in `docs/design-system.md`). Nova Blau sieht aus wie vorher; Grundlage für weitere Themes.
  Neue Theme-Variablen u. a. `--nova-tint`, `--nova-shade`, `--nova-glow`, `--nova-ring`, `--nova-radius-*`, `--nova-font-size-*`, `--nova-space-*`,
  `--nova-dur-*`. Das Navi-Pop-up folgt jetzt `--nova-popup-header-color` und `--nova-popup-backdrop`.
- Demo-Seite `demo/index.html` mit allen Karten und Testdaten (ohne Home Assistant), `npm run check` gegen feste Farben im Karten-CSS.
- Nova Uhr Card: Option `style` mit vier neuen Stilen neben `default` – `flip` (Klappzahlen, nur Stunden und Minuten, nur geänderte
  Ziffern klappen in 600 ms um), `analog` (Zifferblatt, Sekundenzeiger per `second_hand`: `sweep`, `tick`, `none`), `glow` (Leuchtziffern,
  Farbe folgt dem Sonnenstand aus `sun.sun`) und `retro` (Radiowecker mit Sieben-Segment-Ziffern als SVG, ausgeschaltete Segmente mit 8 %,
  Doppelpunkt blinkt im Sekundentakt, `retro_color`: `red`,
  `green`, `blue`, `amber`). Stil im Editor wählbar.
- Nova Uhr Card: Optionen `size` (`small`, `medium`, `large`), `font_size` (feste Schriftgröße, z. B. `48px` oder `3rem`) und `layout`
  (`auto`, `stacked`, `row`). Bei fester Kartenhöhe passt sich die Uhr automatisch an und läuft nie über; in breiten, flachen Karten
  stehen Uhrzeit und Datum nebeneinander. Datum, Wochentag und Werte skalieren mit.
- Nova Uhr Card: Option `date_size` (`small`, `medium`, `large` oder `px`/`rem`) für Wochentag und Datum unabhängig von der Uhrzeit;
  Datumsformat `long_year` (8. November 2026). Datumsformat und Datumsgröße im Editor unter „Aussehen“. Die Einpassung bei fester
  Kartenhöhe berücksichtigt beides, auch bei `flip` und `layout: row`.
- Theme-Variablen `--nova-clock-morning`, `--nova-clock-noon`, `--nova-clock-night` und `--nova-led-red|green|blue|amber`.
- Nova Uhr, Timer und Swipe Card sowie Nova Einkauf und Notiz Card aus den Feature-Branches zusammengeführt.
- `docs/DESIGN.md` als feste Design-Referenz, dieses Changelog.
- Pop-up Card: Info-Chips per `info_position` in der Kopfzeile; Pop-up und Bereich: zu lange Titel laufen langsam hin und her.
- Nova Navi: Mini-Player nur bei laufender Wiedergabe, Lautsprecher-Auswahl, Rückmeldung bei Play.
- Chips: Nachkommastellen (`decimals`) im Editor, Einheit wie in HA (21,9 °C, 62 %).

### Behoben
- Nova Timer Card: ab einer Stunde zeigt das Zifferblatt nur noch Std:Min (z. B. „2:02“) statt „2:02:30“ – die Zeit lief über den Ring.
- Nova Timer Card: „+1 Min“ über die eingestellte Dauer des Timer-Helfers hinaus startet den Timer direkt mit Rest + 1 Minute neu
  (pausiert bleibt pausiert) und zeigt keine Fehlermeldung „kann nicht über seine Dauer hinaus geändert werden“ mehr.
- Einkauf und Notiz Card: In der Nova Swipe Card lässt sich auf der Liste wieder seitlich wischen
  (`overscroll-behavior` nur noch senkrecht, vorher blockierte es auch die Wischgeste zur nächsten Seite).
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
