# Nova Cards – Hinweise für Entwickler und Agenten

## Projekt

Nova Cards ist eine Kartenfamilie für das Home-Assistant-Dashboard (Lovelace): Raum, Thermostat, Licht, Navi,
Modular, Kamera, Media, Saugroboter, Müllkalender, Wetter, Pop-up, Bereich, Chips, Gerät, 3D-Drucker und Fernbedienung – alle als `custom:nova-*`, jede mit grafischem Editor.
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
  popup.js            Nova Pop-up Card + Editor (Pop-up per URL-Hash, Raster aus beliebigen Karten)
  area.js             Nova Bereich Card + Editor (Raumansicht: Kopfzeile, Raster aus beliebigen Karten)
  chips.js            Nova Chips Card + Editor (Reihe aus Wert- und Knopf-Chips)
  appliance.js        Nova Gerät Card + Editor (Waschmaschine, Spülmaschine, Airfryer, Kaffeemaschine, Allgemein)
  printer.js          Nova 3D-Drucker Card + Editor (Bambu Lab: Druckerzeichnung im P2S-Stil, AMS, Kamera, Meldungen, Demo-Modus)
  printer-messages.js Meldungen der 3D-Drucker Card: Druckphasen (stg_cur), HMS-/Druckfehler-Codes, Textmuster → Animation
  remote.js           Nova Fernbedienung + Editor (Tastenbelegung je Integration, App-Vorlagen)
  shared/
    define.js         define() – EINZIGE Stelle für customElements.define + Kartenauswahl, docUrl(),
                      tag() für Elementnamen (nova- bzw. im Dev-Build nova-dev-), DEV
    utils.js          Escaping (esc), Domain, Icons/Bilder, Listen, Hilfsfunktionen
    state.js          Zustände: isOn, Formatierung, Werte, Warnbedingungen, Domain-Listen
    actions.js        Events (more-info, hass-action), Navigation, tap/hold-Aktionen
    long-press.js     press(): Antippen / lange drücken / Tastatur
    sparkline.js      Flächen-Sparkline als SVG (Thermostat-Verlauf, Wetter-Stundenvorhersage)
    styles.js         Gemeinsame CSS-Bausteine (Variablen, Glas-Hintergrund, Editor-Styles)
    scene.js          Zeichenstil der Gerätezeichnungen: Farbpalette, Verläufe (Gehäuse, Glas, Chrom), Glas-Spiegelung,
                      Lichtstreifen beim Reinscrollen (sweep), Rahmen-Glow, Badge-Stelle (badgeAt) – siehe „Stil der Zeichnungen“
    editor-base.js    NovaEditorBase – Basisklasse ALLER Editoren
    editor-schema.js  Bausteine für ha-form-Schemas + gemeinsame Beschriftungen
    lifecycle.js      Relevante hass-Änderungen erkennen (hassChanged, entityIds), Vorschau in der Kartenauswahl (inPicker)
    card-grid.js      Raster aus beliebigen Karten (rows/cells, Karten erzeugen, Übergabe in der Vorschau) und Info-Chips –
                      Kartenseite von Pop-up und Bereich
    card-grid-editor.js  Editorseite dazu: Vorlagen, Miniatur-Raster, Kartenauswahl, Karteneditor, YAML (Mixin GridEditor)
    chips.js          Nova Chips: Wert- und Knopf-Chips (Darstellung, Schnellauswahl wie „Alle Lichter im Raum aus“,
                      Editor-Schema) – für die Chips Card, später auch Pop-up
    popup-hub.js      Gemeinsamer Stand der Pop-ups (Hash, Verlauf, Scroll-Sperre, Pop-ups im Dashboard finden),
                      Pop-up öffnen/Auswahllisten – genutzt von Pop-up Card, Nova Navi und Raum-Karte
docs/
  <karte>.md          Alle Optionen je Karte (z. B. room-card.md, popup-card.md)
dev/
  nova-dev-cards.js   ERZEUGT von „npm run dev“ – gitignored, nur Zwischenablage
nova-dev-cards.js     Kopie des Dev-Builds für jsDelivr – nur auf Feature-Branches, nie nach main mergen
build.mjs             esbuild-Build → nova-cards.js („npm run dev“ → dev/nova-dev-cards.js)
package.json          Versionsnummer (einzige Stelle), „npm run build“ und „npm run dev [-- <karte>]“
nova-cards.js         ERZEUGT – nicht von Hand bearbeiten
README.md             Doku für Nutzer (ein Abschnitt pro Karte)
hacs.json             HACS-Metadaten
```

## Regeln

- **Nur in `src/` arbeiten.** Danach `npm install` (einmalig) und `npm run build`. Die erzeugte `nova-cards.js`
  wird mit committet, weil HACS sie im Repo-Root braucht.
- **`nova-cards.js` nie direkt ändern** – sie wird bei jedem Build überschrieben.
- **Version** nur in `package.json` ändern; der Build setzt sie in Banner und Konsolen-Ausgabe ein.
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
- **Keine festen Farben in Karten:** wählbare Farben sind Farbrollen (`neutral`, `accent-1` … `accent-4`), im Editor
  per `ROLE()` aus `editor-schema.js`, in der Karte per `roleVars()` aus `styles.js`. Die Standardfarben stehen nur
  zentral in `NOVA_VARS` (`--nova-accent-1` …) und werden vom Theme überschrieben.
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

Maßstab für alle animierten Gerätezeichnungen (Gerät, Saugroboter, künftige Karten) ist die Zeichnung der
3D-Drucker Card. Gemeinsame Teile kommen aus `src/shared/scene.js` (`sceneDefs()`, `SCENE_CSS`, `frameGlow()`, `sweep()`,
Palette `PAL`), nicht neu anlegen. Die Drucker-Card selbst bleibt unverändert und hat ihre eigene Kopie.

- **Perspektive:** gerade Frontansicht, keine Schrägsicht und keine Fluchtpunkte. Tiefe nur über Verläufe: Gehäuse
  oben hell → unten dunkel, Seitenglanz links hell → rechts dunkel (`s-sheen`), Lichtkante oben (`s-edge`), weicher
  Bodenschatten als flache Ellipse (`s-shd`). Innenräume dunkler mit Vignette zum Rand.
- **Detailgrad:** echte Bauteile statt Symbole – Schublade mit Griffmulde, Drehknopf mit Chromring und Markierungen,
  Display mit Rahmen, Bildschirm und Touch-Tasten, Scharniere, Serviceklappe, Füße. Kleine Details (Beschriftungen,
  Tasten) nur als dezente Striche (`#fff` mit 0,14–0,25 Deckkraft), keine Logos, keine Schrift außer Display-Werten.
- **Raster:** `viewBox` mit 200–300 Einheiten Kantenlänge (Drucker 260 × 300, Waschmaschine 200 × 200), Gehäuse
  `rx` 8–9, Anbauteile `rx` 1,5–3.
- **Strichstärken:** Kanten 0,4–0,7 in `rgba(255,255,255,.12–.25)`, Trennfugen als 0,8 hohe Fläche in Schwarz
  (0,25–0,3) mit 0,6 hoher Lichtfuge darunter (Weiß 0,06). Keine dicken Konturen, kein `currentColor` für Gehäuse.
- **Farben:** Materialfarben nur aus `PAL` (Gehäuse dunkel `#3a4252`→`#191d26`, Theme: `--nova-device-color-light` /
  `--nova-device-color`; Anbauteile `#3b4252`→`#20252f`; Display `#0a0e14`; Chrom `#a3adbf`→`#232833`).
  Alles, was „lebt“ (Wasser, LEDs, Fortschritt, Haken, Innenlicht), nimmt die Farbrolle der Karte (`--dc`).
  Warnungen/Fehler: `--nv-warn` / `--nv-error`.
- **Glas:** Scheibe mit Verlauf `…-gl` (oben links bläulich 0,11 → unten rechts dunkel 0,38), Kante 0,7 in Weiß 0,22.
  Spiegelung dezent: zwei schräge Streifen (`s-refl`, Weiß 0,035) im Glas-Clip, bei runden Scheiben zusätzlich ein
  kurzer Lichtbogen oben links (Weiß ≤ 0,18). Nicht stärker – Marwin hat die kräftige Spiegelung verworfen.
- **Lichtstreifen:** heller Verlaufsstreifen (`s-gls`, Verlauf `…-gs`, max. 0,45 × 0,7 Deckkraft), leicht schräg,
  läuft einmal in 0,9 s durchs Glas – beim Reinscrollen (Übergang unsichtbar → sichtbar in `_tick()`, `sweep()`)
  und beim Wechsel auf „fertig“. Weg per `--gx`. Nie in Dauerschleife.
- **Glow:** Rahmen der Karte leuchtet in `--dc`, solange das Gerät arbeitet (`frameGlow()`); in der Zeichnung warmes
  bzw. farbiges Innenlicht nur im aktiven Zustand.
- **Zustände:** aus = ganze Zeichnung 0,55 Deckkraft, Display leer; fertig = Haken-Badge in `--dc` mit Pop-Animation, immer unten rechts an der Stelle aus `badgeAt()`;
  Animationen nur mit `.anim`, stehen bei `.still`, respektieren `prefers-reduced-motion`.

## Abhängigkeiten von HA-Interna

Alles, was nicht zur dokumentierten Custom-Card-API gehört, ist im Code mit `// HA-INTERN:` markiert. Jede Stelle prüft
vorher, ob es das Element bzw. die Funktion gibt, und hat einen Fallback. Nach HA-Updates diese Stellen zuerst prüfen:

| Stelle | Datei | Fallback |
|---|---|---|
| `window.loadCardHelpers()` → `createCardElement` | `card-grid.js` (Karten in Zellen), `editor-base.js` | Fehler nur in der betroffenen Zelle |
| `hui-card-picker` (Kartenauswahl) | `card-grid-editor.js` | neue Karte als YAML eintragen |
| `ha-dialog` (Fenster für die Kartenauswahl, Slots `footer`, Attribut `header-title`, Event `closed`) und `ha-dialog-footer` | `card-grid-editor.js` (`_openPicker`) | neue Karte als YAML eintragen |
| Nachladen von Picker/Karteneditor über `getConfigElement()` der `vertical-stack`-Karte | `card-grid-editor.js` (`loadHaEditors`) | nach 3 s ohne, dann greifen die Fallbacks |
| `hui-card-element-editor` (Karteneditor) | `card-grid-editor.js` | YAML-Feld |
| `ha-yaml-editor` | `card-grid-editor.js` | Textfeld im JSON-Format |
| `getStubConfig()` der Kartenklassen (`hui-<typ>-card`) | `popup.js` | nur `{type}` |
| Elementnamen `hui-card-preview`, `hui-dialog-edit-card`, `hui-card-options`, `hui-card-edit-mode` … | `card-grid.js` (Pop-up, Bereich), `navi.js` | Karte gilt als normal eingebunden |
| WebSocket `lovelace/config` | `popup-hub.js` (Pop-ups für Nova Navi und Raum-Karte), `navi.js` | keine Pop-ups/Einträge aus dem Dashboard |
| Event `ll-rebuild` | `card-grid.js` | Zelle wird neu aufgebaut, sonst nichts |
| Elementname `hui-card-picker` (Vorschau in der Kartenauswahl erkennen) | `lifecycle.js` (`inPicker`) | Karte läuft wie normal eingebunden |
| WebSocket `config/auth/list` (Benutzerliste, nur Admins) | `navi.js` (Editor, Sichtbarkeit) | nur der eigene Benutzer in der Auswahl |
| Event `card-visibility-changed` + `element.hidden` (Karte ausblenden) | `appliance.js` | Karte ist leer (`:host([hidden])`), Platz im Raster bleibt |

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
- **resource_id der Dev-Ressource:** `4cc06e00074c416590e298ace68fe3a7`
  Fehlt sie oder ist sie ungültig, zuerst per `ha_config_list_dashboard_resources` nach einer bestehenden
  Ressource suchen, die auf `nova-dev-cards.js` zeigt (oder inline mit `/* Nova Cards v… DEV` beginnt), und deren ID
  hier eintragen. Nur wenn es keine gibt, eine neue anlegen.
- **Größe:** Über jsDelivr gibt es keine 128-KB-Grenze mehr. Trotzdem nur die Karten bauen, die gerade getestet werden.
- **Danach dem Nutzer sagen,** welche Karte (`custom:nova-dev-…`) er testen soll und dass er hart neu laden muss
  (Strg/Cmd+Shift+R bzw. App-Cache leeren).
- **Keine Releases dafür.** Releases (Versionssprung, Tag, GitHub-Release) nur, wenn der Nutzer es ausdrücklich sagt.
