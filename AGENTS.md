# Nova Cards – Hinweise für Entwickler und Agenten

## Projekt

Nova Cards ist eine Kartenfamilie für das Home-Assistant-Dashboard (Lovelace): Raum, Thermostat, Licht, Navi,
Modular, Kamera, Media, Saugroboter, Müllkalender, Wetter, Pop-up, Bereich, Swipe, Chips, Gerät, 3D-Drucker, Fernbedienung, Timer, Uhr, Einkauf, Notiz und Themes Schalter – alle als `custom:nova-*`, jede mit grafischem Editor.
Installiert wird per **HACS** (Benutzerdefiniertes Repository, Typ „Dashboard“). HACS lädt die fertige Datei
`nova-cards.js` aus dem Repo-Root; die Doku für Nutzer steht in `README.md`.

## Ordnerstruktur

```
src/
  index.js            Einstieg: importiert alle Karten (Reihenfolge = Reihenfolge in der Kartenauswahl)
  room.js             Nova Raum Card + Editor
  thermostat.js       Nova Thermostat Card + Editor
  light.js            Nova Licht Card + Editor (+ Farbscheibe nova-color-input)
  navi.js             Nova Navi + Popup + Editor (früher Dock; custom:nova-dock-card bleibt als Alias registriert)
  modular.js          Nova Modular Card + Editor (Bausteine, auch vom Saugroboter genutzt)
  camera.js           Nova Kamera Card + Editor
  media.js            Nova Media Card + Editor
  vacuum.js           Nova Saugroboter Card + Editor
  waste.js            Nova Müllkalender Card + Editor (Termine aus calendar.*-Entitäten)
  weather.js          Nova Wetter Card + Editor (aktuelles Wetter + Vorhersage per weather/subscribe_forecast)
  popup.js            Nova Pop-up Card + Editor (Pop-up per URL-Hash, Raster aus beliebigen Karten; Info-Chips per
                      info_position in der Kopfzeile wie bei der Bereich Card oder als Zeile darunter)
  area.js             Nova Bereich Card + Editor (Raumansicht: Kopfzeile, Raster aus beliebigen Karten)
  swipe.js            Nova Swipe Card + Editor (Seiten zum Wischen, je Seite ein Raster aus beliebigen Karten, Seiten-Punkte)
  chips.js            Nova Chips Card + Editor (Reihe aus Wert- und Knopf-Chips)
  appliance.js        Nova Gerät Card + Editor (Waschmaschine, Spülmaschine, Airfryer, Kaffeemaschine, Allgemein)
  printer.js          Nova 3D-Drucker Card + Editor (Bambu Lab: Druckerzeichnung im P2S-Stil, AMS, Kamera, Meldungen, Demo-Modus)
  printer-messages.js Meldungen der 3D-Drucker Card: Druckphasen (stg_cur), HMS-/Druckfehler-Codes, Textmuster → Animation
  remote.js           Nova Fernbedienung + Editor (Tastenbelegung je Integration, App-Vorlagen)
  timer.js            Nova Timer Card + Editor (steuert einen timer.*-Helfer, Stoppuhr-Zeichnung, Hinweis beim Ablauf)
  clock.js            Nova Uhr Card + Editor (Stile default/flip/analog/glow/retro, ein einziger Zeitgeber)
  clock-styles.js     Stile der Uhr: Klappzahlen, Leuchtziffern (Farbe nach Sonnenstand), Radiowecker (Sieben-Segment-SVG)
  shopping.js         Nova Einkauf Card + Editor (todo-Liste: Eingabefeld, abhaken, Druck-Knopf)
  note.js             Nova Notiz Card + Editor (mehrzeiliges Notizfeld, Entwurf im Browser, Druck-Knopf)
  theme-switch.js     Nova Themes Schalter + Editor (globales Theme wählen: Chip, Button oder Dropdown)
  shared/
    define.js         define() – EINZIGE Stelle für customElements.define + Kartenauswahl, docUrl(),
                      tag() für Elementnamen (nova- bzw. im Dev-Build nova-dev-), DEV
    utils.js          Escaping (esc), Domain, Icons/Bilder, Listen, Hilfsfunktionen
    state.js          Zustände: isOn, Formatierung, Werte, Warnbedingungen, Domain-Listen
    actions.js        Events (more-info, hass-action), Navigation, tap/hold-Aktionen
    long-press.js     press(): Antippen / lange drücken / Tastatur
    sparkline.js      Flächen-Sparkline als SVG (Thermostat-Verlauf, Wetter-Stundenvorhersage)
    theme.js          Design-Tokens und Themes: EINZIGE Stelle für Farben, Radien, Schatten, Blur, Schrift, Abstände, Zeiten
                      (TOKENS, THEMES, NOVA_VARS, NAVI_VARS) – siehe docs/design-system.md
    theme-apply.js    Theme am Kartenelement setzen (Attribut nova-theme): Option theme → Theme-Variable nova-theme → global → Blau;
                      läuft zentral über define(), Karten müssen nichts tun
    theme-store.js    Speicher des globalen Themes (input_select.nova_theme, legt ihn selbst an) – EINZIGE Stelle, zieht später
                      in die Nova-Integration um
    styles.js         Gemeinsame CSS-Bausteine (Glas-Hintergrund, Karten- und Panel-CSS, Farbrollen, Editor-Styles)
    scene.js          Zeichenstil der Gerätezeichnungen: Farbpalette, Verläufe (Gehäuse, Glas, Chrom), Glas-Spiegelung,
                      Lichtstreifen beim Reinscrollen (sweep), Rahmen-Glow, Badge-Stelle (badgeAt) – siehe „Stil der Zeichnungen“
    editor-base.js    NovaEditorBase – Basisklasse ALLER Editoren
    editor-schema.js  Bausteine für ha-form-Schemas + gemeinsame Beschriftungen
    lifecycle.js      Relevante hass-Änderungen erkennen (hassChanged, entityIds), Vorschau in der Kartenauswahl (inPicker),
                      Sichtbarkeit beobachten (watchVisible: IntersectionObserver + Tab)
    dial.js           Runde Zeichnungen im Nova-Stil: Gehäuse, Chromring, Zifferblatt, Fortschrittsring, Glas, Stoppuhr-Krone,
                      Glocken-Badge – genutzt von Timer und Uhr
    card-grid.js      Raster aus beliebigen Karten (rows/cells, Karten erzeugen, Übergabe in der Vorschau) und Info-Chips –
                      Kartenseite von Pop-up, Bereich und Swipe
    card-grid-editor.js  Editorseite dazu: Vorlagen, Miniatur-Raster, Kartenauswahl, Karteneditor, YAML (Mixin GridEditor)
    chips.js          Nova Chips: Wert- und Knopf-Chips (Darstellung, Schnellauswahl wie „Alle Lichter im Raum aus“,
                      Editor-Schema) – für die Chips Card, später auch Pop-up
    print-button.js   Druck-Knopf von Einkauf und Notiz: ruft ein Skript auf und zeigt Erfolg/Fehler (runPrint, printPaint)
    marquee.js        Laufschrift für zu lange Namen (Titel von Pop-up und Bereich): läuft hin und her, sonst „…“
    popup-hub.js      Gemeinsamer Stand der Pop-ups (Hash, Verlauf, Scroll-Sperre, Pop-ups im Dashboard finden),
                      Pop-up öffnen/Auswahllisten – genutzt von Pop-up Card, Nova Navi und Raum-Karte
docs/
  <karte>.md          Alle Optionen je Karte (z. B. room-card.md, popup-card.md)
  DESIGN.md           Design-Referenz: Grundlagen, Stil der Zeichnungen
  design-system.md    Alle Design-Tokens (--nova-…) mit Wert und Zweck, Themes
demo/
  index.html, mock.js Alle Karten mit Testdaten ohne Home Assistant – Vorschau und Bildvergleich bei Umbauten
tools/
  check-tokens.mjs    „npm run check“: keine festen Farben im Karten-CSS
dev/
  nova-dev-cards.js   ERZEUGT von „npm run dev“ – gitignored, nur Zwischenablage
nova-dev-cards.js     Kopie des Dev-Builds für jsDelivr – nur auf Feature-Branches, nie nach main mergen
build.mjs             esbuild-Build → nova-cards.js („npm run dev“ → dev/nova-dev-cards.js)
package.json          Versionsnummer (einzige Stelle), „npm run build“ und „npm run dev [-- <karte>]“
nova-cards.js         ERZEUGT – nicht von Hand bearbeiten
README.md             Doku für Nutzer (ein Abschnitt pro Karte)
CHANGELOG.md          Änderungen je Version (Keep a Changelog, SemVer)
hacs.json             HACS-Metadaten
```

## Regeln

- **Nur in `src/` arbeiten.** Danach `npm install` (einmalig) und `npm run build`. Die erzeugte `nova-cards.js`
  wird mit committet, weil HACS sie im Repo-Root braucht.
- **`nova-cards.js` nie direkt ändern** – sie wird bei jedem Build überschrieben.
- **Version** nur in `package.json` ändern; der Build setzt sie in Banner und Konsolen-Ausgabe ein. Jede Änderung kommt in `CHANGELOG.md`.
- **Neue Karte** = neue Datei in `src/` (Karte + Editor), Import in `src/index.js`, Registrierung über
  `define()` aus `src/shared/define.js` (mit Name, Beschreibung, `documentationURL: docUrl(...)`) und ein
  eigener Abschnitt in `README.md`.
- **Elementnamen nie hart als `'nova-…'` schreiben**, sonst kollidiert der Dev-Build mit der HACS-Version.
  Immer ohne Präfix: `define('x-card', …)` und `document.createElement(tag('x-card-editor'))` mit `tag()` aus
  `src/shared/define.js`.
- **Gemeinsames gehört nach `src/shared/`** – keine Hilfsfunktionen doppelt anlegen, nur die eine `define()`.
  Editoren erben von `NovaEditorBase`, nicht voneinander.
- **Grafischer Editor für alles:** jede Option ist im Editor einstellbar, nichts hartkodiert (Entitäten,
  Texte, Icons, Farben kommen aus der Konfiguration oder werden automatisch erkannt).
- **Keine festen Werte in Karten:** Farben, Radien, Schatten, Blur, Schriftgrößen, Abstände und Übergangszeiten kommen als
  `var(--nv-…)` aus den Tokens in `src/shared/theme.js` (Liste: `docs/design-system.md`). Fehlt ein Wert, kommt ein neues
  Token in `theme.js`, nicht ein fester Wert in die Karte. Wählbare Farben sind Farbrollen (`neutral`, `accent-1` … `accent-4`),
  im Editor per `ROLE()` aus `editor-schema.js`, in der Karte per `roleVars()` aus `styles.js`. Vor dem Commit `npm run check`.
  Ausnahmen: Materialfarben der Zeichnungen (`PAL` in `scene.js` bzw. in der Zeichnung) und Editoren (HA-Variablen).
- **Nova Blau bleibt pixelgleich:** nach Änderungen an Tokens oder gemeinsamem CSS die Demo-Seite (`demo/index.html`) vorher
  und nachher fotografieren und vergleichen.
- **Alles auf Deutsch:** Beschriftungen, Hilfetexte, Fehlermeldungen, Kommentare, README.
- **Sparsam mit hass:** Karten und Editoren zeichnen nur neu, wenn `hassChanged()` aus `lifecycle.js` für ihre Entitäten
  anschlägt. Editoren melden Änderungen gesammelt (`_emit` mit 300 ms Pause) und verwenden ha-form-Felder beim Neuaufbau weiter
  (`_form`/`_reuse` in `editor-base.js`). Timer, Abos und Observer in `disconnectedCallback` beenden; in der Kartenauswahl
  (`inPicker()`) keine Dauer-Animationen, Streams oder Intervalle.
- **Für Nutzer darf sich bei Umbauten nichts ändern:** gleiche Kartentypen, Optionen, Optik und Editoren.
- **Commits, Branches und PRs:** keine `Co-Authored-By`-Zeilen und keine Erwähnung von KI-Tools
  (auch nicht in Branch-Namen; Branches heißen `feature/...`).
- **Commits immer als Blackstar9119 mit 209100092+Blackstar9119@users.noreply.github.com, nie mit privater Mail.**
- **Pushen und PRs immer über `git` und `gh`** (`git push`, `gh pr create`), nie über den Browser.

## Stil der Zeichnungen

Steht in **`docs/DESIGN.md`** (feste Design-Referenz für alle Karten). Kurz: Maßstab ist die 3D-Drucker-Zeichnung, gemeinsame
Teile aus `src/shared/scene.js`, gerade Frontansicht, Materialfarben aus `PAL`, „Lebendiges“ in `--dc`, Lichtstreifen nur
einmal beim Reinscrollen.

## Abhängigkeiten von HA-Interna

Alles, was nicht zur dokumentierten Custom-Card-API gehört, ist im Code mit `// HA-INTERN:` markiert. Jede Stelle prüft
vorher, ob es das Element bzw. die Funktion gibt, und hat einen Fallback. Nach HA-Updates diese Stellen zuerst prüfen:

| Stelle | Datei | Fallback |
|---|---|---|
| `window.loadCardHelpers()` → `createCardElement` | `card-grid.js` (Karten in Zellen, auch Swipe), `editor-base.js` | Fehler nur in der betroffenen Zelle |
| `hui-card-picker` (Kartenauswahl) | `card-grid-editor.js` | neue Karte als YAML eintragen |
| `ha-dialog` (Fenster für die Kartenauswahl, Slots `footer`, Attribut `header-title`, Event `closed`) und `ha-dialog-footer` | `card-grid-editor.js` (`_openPicker`) | neue Karte als YAML eintragen |
| Nachladen von Picker/Karteneditor über `getConfigElement()` der `vertical-stack`-Karte | `card-grid-editor.js` (`loadHaEditors`) | nach 3 s ohne, dann greifen die Fallbacks |
| `hui-card-element-editor` (Karteneditor) | `card-grid-editor.js` | YAML-Feld |
| `ha-yaml-editor` | `card-grid-editor.js` | Textfeld im JSON-Format |
| Elementnamen `ha-slider`, `ha-control-slider` (Regler erkennen, damit Wischen sie nicht stört) | `swipe.js` | Erkennung über `input[type=range]`, `role=slider` und `touch-action` |
| `getStubConfig()` der Kartenklassen (`hui-<typ>-card`) | `popup.js` | nur `{type}` |
| Elementnamen `hui-card-preview`, `hui-dialog-edit-card`, `hui-card-options`, `hui-card-edit-mode` … | `card-grid.js` (Pop-up, Bereich), `navi.js` | Karte gilt als normal eingebunden |
| WebSocket `lovelace/config` | `popup-hub.js` (Pop-ups für Nova Navi und Raum-Karte), `navi.js` | keine Pop-ups/Einträge aus dem Dashboard |
| Event `ll-rebuild` | `card-grid.js` | Zelle wird neu aufgebaut, sonst nichts |
| Elementname `hui-card-picker` (Vorschau in der Kartenauswahl erkennen) | `lifecycle.js` (`inPicker`) | Karte läuft wie normal eingebunden |
| WebSocket `config/auth/list` (Benutzerliste, nur Admins) | `navi.js` (Editor, Sichtbarkeit) | nur der eigene Benutzer in der Auswahl |
| Event `card-visibility-changed` + `element.hidden` (Karte ausblenden) | `appliance.js` | Karte ist leer (`:host([hidden])`), Platz im Raster bleibt |
| WebSocket `todo/item/subscribe` (Einträge einer todo-Liste) | `shopping.js` | Dienst `todo.get_items` bei jeder Zustandsänderung der Liste |
| `home-assistant` → `home-assistant-main` → `partial-panel-resolver` (Inhaltsbereich neben der Seitenleiste) | `popup-hub.js` (`followContent`, Pop-up Card und Navi-Pop-up) | Pop-up deckt das ganze Fenster ab |

## Dev-Workflow

- **Dev-Build „dev“:** alle Karten mit Präfix `nova-dev-` statt `nova-`, damit sie sich nicht mit der HACS-Version
  beißen. `npm run dev` baut alle Karten nach `dev/nova-dev-cards.js`, `npm run dev -- <karte>` bzw. mehrere mit Komma wie `popup,navi` (Dateiname in `src/`
  ohne `.js`, z. B. `waste`) nur diese eine. In der Kartenauswahl tragen die Karten „ (Dev)“ im Namen.
- **Nach jeder Änderung, die der Nutzer testen soll:** Dev-Build erstellen, als `nova-dev-cards.js` in den Repo-Root
  des Feature-Branches kopieren, committen und pushen. Dann die Dev-Ressource über den HA-MCP mit
  `ha_config_set_dashboard_resource` (`url` = `https://cdn.jsdelivr.net/gh/Blackstar9119/nova-cards@<commit>/nova-dev-cards.js`,
  `resource_type` = `module`) auf den neuen Commit-Hash umstellen. **Immer dieselbe Ressource aktualisieren**
  (`resource_id`), nie eine neue anlegen. Laufen mehrere Feature-Branches parallel, alle getesteten Karten in einen
  Build packen (z. B. `npm run dev -- weather,popup,navi,info,room`), damit kein Test verloren geht.
- **resource_id der Dev-Ressource:** `5c4e80a5870942189b61f27d4c6b2bbd`
  Fehlt sie oder ist sie ungültig, zuerst per `ha_config_list_dashboard_resources` nach einer bestehenden
  Ressource suchen, die auf `nova-dev-cards.js` zeigt (oder inline mit `/* Nova Cards v… DEV` beginnt), und deren ID
  hier eintragen. Nur wenn es keine gibt, eine neue anlegen.
- **Größe:** Über jsDelivr gibt es keine 128-KB-Grenze mehr. Trotzdem nur die Karten bauen, die gerade getestet werden.
- **Danach dem Nutzer sagen,** welche Karte (`custom:nova-dev-…`) er testen soll und dass er hart neu laden muss
  (Strg/Cmd+Shift+R bzw. App-Cache leeren).
- **Keine Releases dafür.** Releases (Versionssprung, Tag, GitHub-Release) nur, wenn der Nutzer es ausdrücklich sagt.
- **Offen nach dem nächsten Release:** Die Dashboards `nova-iphone` und `nova-macbook` laufen zum Testen mit Dev-Karten
  (`custom:nova-dev-navi-card`, `-popup-card`, `-area-card`, `-shopping-card`, `-note-card`). Nach dem Release alle wieder
  auf die normalen `custom:nova-*`-Typen zurückstellen (Einkauf/Notiz erst, wenn sie im Release enthalten sind).
