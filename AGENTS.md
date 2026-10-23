# Nova Cards – Hinweise für Entwickler und Agenten

## Projekt

Nova Cards ist eine Kartenfamilie für das Home-Assistant-Dashboard (Lovelace): Raum, Thermostat, Licht, Dock,
Modular, Kamera, Media und Saugroboter – alle als `custom:nova-*`, jede mit grafischem Editor.
Installiert wird per **HACS** (Benutzerdefiniertes Repository, Typ „Dashboard“). HACS lädt die fertige Datei
`nova-cards.js` aus dem Repo-Root; die Doku für Nutzer steht in `README.md`.

## Ordnerstruktur

```
src/
  index.js            Einstieg: importiert alle Karten (Reihenfolge = Reihenfolge in der Kartenauswahl)
  room.js             Nova Raum Card + Editor
  thermostat.js       Nova Thermostat Card + Editor
  light.js            Nova Licht Card + Editor (+ Farbscheibe nova-color-input)
  dock.js             Nova Dock Card + Popup + Editor
  modular.js          Nova Modular Card + Editor (Bausteine, auch vom Saugroboter genutzt)
  camera.js           Nova Kamera Card + Editor
  media.js            Nova Media Card + Editor
  vacuum.js           Nova Saugroboter Card + Editor
  shared/
    define.js         define() – EINZIGE Stelle für customElements.define + Kartenauswahl, docUrl()
    utils.js          Escaping (esc), Domain, Icons/Bilder, Listen, Hilfsfunktionen
    state.js          Zustände: isOn, Formatierung, Werte, Warnbedingungen, Domain-Listen
    actions.js        Events (more-info, hass-action), Navigation, tap/hold-Aktionen
    long-press.js     press(): Antippen / lange drücken / Tastatur
    styles.js         Gemeinsame CSS-Bausteine (Variablen, Glas-Hintergrund, Editor-Styles)
    editor-base.js    NovaEditorBase – Basisklasse ALLER Editoren
    editor-schema.js  Bausteine für ha-form-Schemas + gemeinsame Beschriftungen
build.mjs             esbuild-Build → nova-cards.js
package.json          Versionsnummer (einzige Stelle) und „npm run build“
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
- **Gemeinsames gehört nach `src/shared/`** – keine Hilfsfunktionen doppelt anlegen, nur die eine `define()`.
  Editoren erben von `NovaEditorBase`, nicht voneinander.
- **Grafischer Editor für alles:** jede Option ist im Editor einstellbar, nichts hartkodiert (Entitäten,
  Texte, Icons, Farben kommen aus der Konfiguration oder werden automatisch erkannt).
- **Alles auf Deutsch:** Beschriftungen, Hilfetexte, Fehlermeldungen, Kommentare, README.
- **Für Nutzer darf sich bei Umbauten nichts ändern:** gleiche Kartentypen, Optionen, Optik und Editoren.
- **Commits, Branches und PRs:** keine `Co-Authored-By`-Zeilen und keine Erwähnung von KI-Tools
  (auch nicht in Branch-Namen; Branches heißen `feature/...`).
- **Commits immer als Blackstar9119 mit 209100092+Blackstar9119@users.noreply.github.com, nie mit privater Mail.**
