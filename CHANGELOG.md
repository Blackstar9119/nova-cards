# Changelog

Alle nennenswerten Änderungen an Nova Cards. Format nach [Keep a Changelog](https://keepachangelog.com/de/1.1.0/),
Versionsnummern nach [Semantic Versioning](https://semver.org/lang/de/).

## [0.1.0b6] – unveröffentlicht

Ab hier tragen Nova Cards die Versionsnummer der Nova-Integration, mit der sie ausgeliefert werden.

### Geändert (Design vereinheitlicht)
- Nova Bereich Card: Kopfzeile mit fester Höhe, Chips immer einzeilig in der Leiste. Höchstens drei Chips sichtbar (weniger, wenn der Platz nicht reicht), der Rest hinter einem „+X“-Chip, der sie beim Antippen aufklappt. Kein halb abgeschnittener Chip mehr; der Name nimmt den übrigen Platz und läuft nur dort durch. `chips_layout` entfällt.
- Fremde HA-Karten in Nova-Karten (Bereich, Pop-up, Swipe …) bekommen in allen Themes die Nova-Fläche, Radien, Rahmen und Schriftfarben – keine weißen Karten mehr in dunklen Themes. Fehlerkarten sind dezent im Farbton des Themes statt Rosa.
- Hintergründe: alle Kartenflächen in Hell, Midnight und Velvet als weicher Verlauf mit Glanz und Spiegelstreifen (`--nova-sheen`), auch Rahmen von Bereich und Pop-up, Navi und Seiten-Hintergrund in Midnight. Unterkarten in einem Bereich oder Pop-up mit Farbton übernehmen den Ton abgestuft. Farbtöne der Flächen als zentrale Palette je Theme (`--nova-accent-1-tone` …). Nova Blau bleibt unverändert.
- Lichtnamen trennen keine Silben mehr („De-cke“), sondern brechen an Wortgrenzen um (höchstens zwei Zeilen).
- Licht Card verteilt die Lampen gleichmäßig auf die Reihen (4 Lampen = 2 × 2 statt 3 + 1 mit Loch).
- Zahlen im Format des HA-Profils mit Einheit: Thermostat (Ist- und Solltemperatur, `21,0 °C`), Raum Card (Temperatur), Regler der Modular Card.

### Hinzugefügt
- Nova Cards kommen mit der Nova-Integration: Sie liefert die Karten selbst aus und meldet sie im Frontend an, ein eigener Marketplace-Eintrag und ein Eintrag unter Ressourcen sind nicht mehr nötig. Karten und Integration haben eine gemeinsame Version; nach einem Update lädt der Browser die neue Datei von selbst. Ist die alte Ressource `nova-cards.js` noch eingetragen, laufen die Karten trotzdem nur einmal, und die Integration zeigt unter Reparaturen, wie man den alten Eintrag entfernt.
- Nova-Einstellungen (ab Nova-Integration 0.1.0b4): Die Karten lesen die zentralen Einstellungen der Integration und schalten offene Dashboards sofort um. Reihenfolge: Option in der Karte → Nova-Einstellung → Standard. Animationen „vereinfacht“ (keine Dauer-Animationen) und „aus“ (auch keine Übergänge), Schriftgröße klein/groß für alle Karten; Einkauf: Gruppierung, Bilder, Standard-Geschäft; Notiz: kompakte Liste und Schriftgröße (neue Option `text_size`); Rezeptbuch: Stil für Bücher ohne eigenen `style`; neue Rezepte starten mit den Standard-Portionen.
- Nova-Panel: Einstellungsseite „Nova“ in der Seitenleiste im Nova-Look (alle vier Themes), gebaut mit `npm run panel` aus `src/panel.js` und ausgeliefert von der Nova-Integration. Links eine schmale Navigation (Allgemein, Einkauf, Notizen, Rezepte, Mealie), rechts immer ein Abschnitt in einer ruhigen Spalte; „Zurücksetzen“ dezent unten im Abschnitt. Module an/aus unter Allgemein, Geschäfte anlegen, umbenennen und löschen, Standard-Geschäft wählen, „Liste für den Sprachassistenten“ für Einkauf und Notizen.
- Hintergründe (Nova-Einstellung „Hintergrund“, ab Nova-Integration 0.1.0b5): passende Verläufe für Nova Blau, Hell, Midnight und Velvet, oder „Passend“ zum gewählten Theme. Gilt auf Dashboards, auf denen Nova Cards sind; ein eigener Hintergrund der Ansicht hat Vorrang. Standard „Keiner“ ändert nichts.
- Nova Rezeptbuch (`custom:nova-recipe-book-card`): Kochbuch zum Blättern mit Inhaltsverzeichnis, Doppelseiten und Lesebändchen, in drei Stilen (`style`: Old Book, Modern Book, Fantasy Book als Hardcover mit Goldfolie und Farbschnitt). Portionen umrechnen, Zutaten auf die Einkaufsliste, Rezepte im Buch anlegen und bearbeiten. Knöpfe Zurück/Inhalt/Weiter unter dem Buch, Wischen blättert; auf schwachen Geräten (Echo Show) automatisch flaches Blättern (`turn`). Beim Aufklappen sind Seiten, Schriften und Bilder schon fertig, der Deckel klappt in einem Zug auf. Passt eine Seite nicht, wird das Foto kleiner, und Pfeile unten und oben zeigen, dass es weiter- bzw. zurückgeht. Zutaten im Formular als Zeilen mit Menge, Einheit (auch Tasse, Cup, Becher, Msp., cl …) und Name; mehrere Zeilen lassen sich einfügen. Rezepte per Link importieren (z. B. Chefkoch) mit Vorschau, Nachfrage bei Doppelten und Quelle im Rezept.
- Nova Rezeptliste (`custom:nova-recipe-card`): kompakte Rezeptliste mit Bild, Zutaten und formatierter Zubereitung, Suche, Schlagwörtern und Favoriten. Portionen umrechnen, gewählte Zutaten auf die Einkaufsliste setzen, Rezept als Klartext drucken. Rezepte per Link importieren mit Vorschau (erst „Übernehmen“ speichert).
- Nova Einkauf Card neu aufgebaut: Artikel mit Menge und Einheit (+ / – direkt in der Liste), Geschäft (frei anlegbar, mit Icon), Icon oder eigenem Bild (wird verkleinert) und formatierter Notiz. Gruppiert nach Geschäft, Abhaken mit Animation, Erledigtes unten zum Auf- und Zuklappen, „Erledigte löschen“, zuletzt Gekauftes als Schnellauswahl. Das Textfeld setzt Artikel mit Enter direkt auf die Liste, das Plus öffnet ein Hinzufügen-Fenster mit allen Feldern (gespeichert wird dort erst mit „Hinzufügen“); bekannte Artikel werden beim Tippen vorgeschlagen. Neue Optionen `group`, `show_images`, `show_suggestions`, `default_store`, `print_field`.
- Nova Notiz Card neu aufgebaut: mehrere Notizen mit Titel, Liste und Detailansicht, anpinnen, „zuletzt geändert“, automatisches Speichern. Neue Optionen `view` (voll/kompakt) und `max_notes`.
- Formatierter Text in Notiz, Einkauf und Rezept: Leiste mit Fett, Kursiv, Unterstrichen, Durchgestrichen, Schriftgröße, Aufzählung, Checkliste und drei Textfarben aus dem Theme (`--nova-text-accent-color`, `--nova-text-warning-color`). Gespeichert als bereinigtes HTML aus einer festen Liste von Elementen.
- Daten von Einkauf, Notiz, Rezeptliste und Rezeptbuch liegen in der neuen [Nova-Integration](https://github.com/Blackstar9119/nova-integration) und sind auf allen Geräten gleich. Die Einkaufsliste lässt sich dort mit einer `todo.*`-Liste abgleichen (Option `entity`), damit Assist weiter funktioniert.
- Theme: Mit der Nova-Integration (Modul „Theme“) liegt das globale Theme dort; jeder Benutzer darf es umschalten. Ohne Integration bleibt es beim Helfer `input_select.nova_theme`.
- Nova Gerät Card: neuer Gerätetyp Trockner (`device_type: dryer`) mit eigener Zeichnung (Bullauge mit Wäsche, warme Luft, Kondensbehälter, Flusensieb) und Hinweis-Animationen `condensate` und `lint`.
- Theme Nova Velvet: cremiges Beige, Espresso-Schrift, Gold, Cognac und Espresso als Akzente (keine Blautöne), weiche warme Schatten statt Glow, Kontraste nach WCAG AA.
- Theme Nova Midnight im Stil des Apple Dark Mode: Karten `#1c1c1e`, Kacheln `#2c2c2e`, feine Linien, kein Glow und kein Blur (schnell auf dem Echo Show), gedämpfte Akzente. Rahmen von Bereich und Pop-up schwarz (`--nova-area-background`), Karten darin grau. Aktive und primäre Knöpfe aller Karten als getöntes Glas wie der Start-Knopf der Timer Card, Schrift darauf hell. Kontraste nach WCAG AA.
- Gemeinsamer Knopf-Stil über Tokens (`--nova-button-fill`, `-fill-text`, `-edge`, `-tint-text`); in Nova Blau unverändert. Glows in Gerätezeichnungen folgen jetzt `--nova-glow`.
- Theme Nova Hell: helles Glas, dunkle Schiefer-Schrift, weiche Schatten statt Glow, Kontraste nach WCAG AA. Gerätezeichnungen bleiben dunkel.
- Nova Themes Schalter (`custom:nova-theme-card`): wählt das Theme für alle Nova Cards auf allen Geräten, als Chip, Button oder Dropdown.
  Legt beim ersten Umschalten selbst den Helfer „Nova Theme“ (`input_select.nova_theme`) an – einmal als Administrator, danach können alle umschalten.
- Option `theme` in jeder Karte (Editor: Bereich „Theme“): „Global“ (Standard) oder ein festes Theme nur für diese Karte und Karten darin.
  Je Gerät geht es über die Theme-Variable `nova-theme` im HA-Theme (z. B. `nova-theme: hell`).
- Theme-Variablen `--nova-accent-ink-color`, `--nova-text-shadow` und `--nova-accent-1-device` … `--nova-neutral-device` (Farbrolle in Gerätezeichnungen).
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
- **Einkauf und Notiz Card brauchen jetzt die Nova-Integration.** Einkauf: `entity` ist nicht mehr die angezeigte Liste, sondern die todo-Liste für den Abgleich (offene Einträge werden übernommen). Notiz: das einzelne Textfeld und die Optionen `placeholder`, `show_clear`, `clear_after_print`, `clear_after_save`, `notes_entity`, `notes_height`, `storage_key`, `print_style` entfallen; Notizen aus der todo-Liste werden nicht automatisch übernommen.
- Druck-Skripte bekommen den Inhalt als Klartext im Feld `text` (Einkauf zusätzlich `items`), Checklisten als `[ ]`/`[x]`.
- Farbrollen: Ohne Auswahl im Editor nutzt jede Karte die Primärfarbe des Themes (Akzent 1). Einzige Ausnahme: die Kaffeemaschine behält ihr Kaffeebraun (Nova Blau Kupfer, Velvet eigenes warmes Braun `#8a5a33`, Token `--nova-coffee-color`).
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
