# Nova Cards

Kostenlose Kartenfamilie für Home Assistant – Glas-Look, grafischer Editor, nichts hartkodiert.
Jede Karte ist einzeln unter **„Karte hinzufügen“** auswählbar.

| Karte | Typ |
|---|---|
| [Nova Raum Card](#nova-raum-card) | `custom:nova-room-card` |
| [Nova Thermostat Card](#nova-thermostat-card) | `custom:nova-thermostat-card` |
| [Nova Licht Card](#nova-licht-card) | `custom:nova-light-card` |
| [Nova Dock Card](#nova-dock-card) | `custom:nova-dock-card` |

## Installation (HACS)

1. HACS → ⋮ → **Benutzerdefinierte Repositories**
2. URL `https://github.com/Blackstar9119/nova-cards`, Typ **Dashboard** → Hinzufügen
3. „Nova Cards“ suchen → **Herunterladen**
4. Browser-Cache leeren / Seite neu laden

Die Ressource `/hacsfiles/nova-cards/nova-cards.js` legt HACS automatisch an.

---

## Nova Raum Card

Raumkachel mit Temperatur, Fenster-Warnung und frei belegbaren runden Buttons. Leuchtet, wenn Licht im Raum an ist.

```yaml
type: custom:nova-room-card
name: Wohnzimmer
icon: mdi:sofa
temperature: sensor.wohnzimmer_temperatur
windows:
  - binary_sensor.wohnzimmer_fenster
tap_action:
  action: navigate
  navigation_path: /dashboard/wohnzimmer
buttons:
  - entity: light.wohnzimmer_decke
  - entity: media_player.tv
    icon_entity: sensor.tv_app
    icon_map:
      netflix: /local/logos/netflix.svg
```

| Option | Bedeutung |
|---|---|
| `name`, `icon` | Titel und Hintergrund-Icon |
| `temperature` | Sensor oder Thermostat für die Anzeige oben rechts |
| `info` (+ `info_suffix`, `info_round`) | Andere Entität statt Temperatur |
| `windows` | Offen = farbiger Rahmen + Icon |
| `image` | Hintergrundbild, z. B. `/local/raeume/kueche.jpg` |
| `buttons[]` | `entity`, `icon`, `name`, `state_entity`, `tap_action`, `hold_action`, `icon_entity` + `icon_map` |

Antippen schaltet um (Szenen/Skripte/Buttons werden ausgelöst), lang drücken öffnet Details.

## Nova Thermostat Card

Ist-/Solltemperatur, ± Stepper, Verlauf, Modi und Presets.

```yaml
type: custom:nova-thermostat-card
entity: climate.wohnzimmer
sensor: sensor.wohnzimmer_temperatur
windows:
  - binary_sensor.wohnzimmer_fenster
show_graph: true
graph_hours: 24
modes: [heat, auto, off]
```

| Option | Standard | Bedeutung |
|---|---|---|
| `entity` | – | Thermostat (Pflicht) |
| `sensor` | – | Genauerer Raumsensor für Anzeige & Verlauf |
| `humidity` | – | Luftfeuchte-Sensor |
| `show_graph` / `graph_hours` | `true` / `24` | Verlauf |
| `show_modes` / `modes` | `true` / alle | Modus-Knöpfe |
| `show_presets` | `false` | Preset-Knöpfe |
| `compact` | `true` | Kompaktes Layout |
| `step` | vom Gerät | Schrittweite ± |

## Nova Licht Card

Lampen als Kacheln: Antippen schaltet, Regler dimmt, Kachel leuchtet in der Lichtfarbe. Eine Lampe = Einzelkachel, mehrere = Sammelkarte.

```yaml
type: custom:nova-light-card
title: Wohnzimmer
area: wohnzimmer          # alle Lampen im Bereich automatisch
exclude:
  - light.wohnzimmer_nachtlicht
colors: ['#ff8a3d', k2700] # Farbknöpfe für alle Lampen (kXXXX = Weißton in Kelvin)
entities:
  - entity: light.stehlampe
    name: Stehlampe
    colors: ['#3d8bf5']
```

| Option | Standard | Bedeutung |
|---|---|---|
| `entities` / `area` | – | Lampen (mindestens eins von beiden) |
| `exclude` | – | Ausblenden bei `area` |
| `show_header` / `show_all_off` | `true` | Kopfzeile, „Alle aus“ |
| `use_light_color` | `true` | In Lichtfarbe leuchten |
| `show_colors` / `colors` | `true` / – | Farbknöpfe (im Editor per Farbscheibe anlegen) |

## Nova Dock Card

Schwebende Leiste mit runden Buttons: navigieren, Aktion auslösen oder ein Popup mit beliebigen Karten öffnen.

```yaml
type: custom:nova-dock-card
position: bottom          # oder top
button_size: 48
items:
  - icon: mdi:home
    label: Start
    tap_action:
      action: navigate
      navigation_path: /lovelace/0
  - icon: mdi:lightbulb-group
    popup_title: Licht
    badge_count_of: light.alle_lampen
    badge_show_number: true
    cards:
      - type: custom:nova-light-card
        area: wohnzimmer
```

| Option | Bedeutung |
|---|---|
| `items[]` | `icon` (MDI oder Bild-URL), `label`, `tap_action`, `hold_action`, `cards` + `popup_title` |
| `badge` | Punkt, wenn Entität an |
| `badge_count_of` (+ `badge_show_number`, `badge_exclude`) | Zähler für eingeschaltete Gruppenmitglieder |
| `source` | Dock aus einem anderen Dashboard übernehmen (URL-Pfad) |

---

## Theming

Alle Karten lesen diese Variablen (z. B. im Theme oder per card-mod):

`--nova-background`, `--nova-border-color`, `--nova-text-color`, `--nova-accent-color`, `--nova-accent-text-color`, `--nova-active-color`, `--nova-active-text-color`, `--nova-warning-color`, `--nova-chip-color`, `--nova-radius`, `--nova-blur`, `--nova-room-min-height`, `--nova-light-min-width`

## Lizenz

[MIT](LICENSE)
