# Nova Cards 0.8.1

Kostenlose Kartenfamilie für Home Assistant – Glas-Look, grafischer Editor, nichts hartkodiert.
Jede Karte ist einzeln unter **„Karte hinzufügen“** auswählbar.

| Karte | Typ |
|---|---|
| [Nova Raum Card](#nova-raum-card) | `custom:nova-room-card` |
| [Nova Thermostat Card](#nova-thermostat-card) | `custom:nova-thermostat-card` |
| [Nova Licht Card](#nova-licht-card) | `custom:nova-light-card` |
| [Nova Dock Card](#nova-dock-card) | `custom:nova-dock-card` |
| [Nova Modular Card](#nova-modular-card) | `custom:nova-modular-card` |
| [Nova Kamera Card](#nova-kamera-card) | `custom:nova-camera-card` |
| [Nova Media Card](#nova-media-card) | `custom:nova-media-card` |
| [Nova Saugroboter Card](#nova-saugroboter-card) | `custom:nova-vacuum-card` |

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

## Nova Modular Card

Gerätekarte aus frei kombinierbaren Bausteinen – z. B. Futterautomat, Airfryer, Katzenklo. Im Editor Bausteine hinzufügen, sortieren und löschen.

```yaml
type: custom:nova-modular-card
blocks:
  - type: header
    name: Airfryer
    icon: mdi:chef-hat
    status: sensor.airfryer_kochstatus
    progress: sensor.airfryer_fortschritt
    button_icon: mdi:cog
    button_action:
      action: more-info
  - type: alerts
    alerts:
      - entity: binary_sensor.futterautomat_food_level
        message: Futterstand niedrig
      - entity: sensor.airfryer_fehlercode
        state_not: "0"
        level: error
  - type: info
    entities:
      - entity: sensor.airfryer_verbleibende_zeit
        name: Verbleibend
      - entity: sensor.futterautomat_dispensed
        decimals: 0
        unit: g
  - type: entities
    columns: 2
    entities:
      - switch.airfryer_stromversorgung
  - type: sliders
    entities:
      - entity: number.airfryer_temperatur
      - entity: number.airfryer_kochzeit
        format: duration
  - type: buttons
    layout: grid
    buttons:
      - entity: button.airfryer_start
        name: Start
        icon: mdi:play
      - name: Reinigung erledigt
        icon: mdi:check-circle
        confirm: Wirklich erledigt?
        tap_action:
          action: perform-action
          perform_action: script.turn_on
          target:
            entity_id: script.katzenklo_reinigung_bestaetigen
```

| Baustein | Optionen |
|---|---|
| `header` | `name`, `icon`, `status` (Text + an/aus), `active` (statt `status` für an/aus), `progress` (%-Balken), `tap_action`, `button_icon` + `button_action` (Touch-Button oben rechts) |
| `info` | `entities[]`: `entity`, `name`, `icon`, `unit`, `decimals`, `tap_action` · `layout: rows\|chips`, `columns` |
| `entities` | `entities[]`: `entity`, `name`, `icon`, `tap_action`, `hold_action`, `confirm` · `columns`. Standard: schalten, sonst more-info |
| `sliders` | `entities[]`: `entity` (number, input_number, light, fan, cover, media_player, climate, water_heater), `name`, `icon`, `min`/`max`/`step`, `unit`, `format: duration` (Minuten → Std:Min) |
| `buttons` | `buttons[]`: `name`, `icon`, `entity` (button/script/scene werden ausgelöst) oder `tap_action`, `confirm` · `layout: pills\|grid` |
| `alerts` | `alerts[]`: `entity`, `state` / `state_not` (Komma-Liste), `above` / `below`, `message` (`{state}` wird ersetzt), `icon`, `level: warning\|error\|info` · `layout: list\|chips`, `glow` (Kartenrahmen, Standard `true`) |

Alle Bausteine außer `header` haben optional `title`. Einträge dürfen auch als Kurzform `- sensor.xyz` angegeben werden.

## Nova Kamera Card

Live-Bild von `camera.*` (Stream) oder `image.*` (z. B. 3D-Drucker) mit Kopfzeile, rundem Steuerkreuz zum Schwenken/Neigen, Splitscreen, frei belegbaren Buttons, Info-Chips und Warn-Badges. Der Stream läuft nur, solange die Karte sichtbar ist – sonst Standbild (schont das Wandpanel).

```yaml
type: custom:nova-camera-card
entity: camera.wohnzimmer_cam_live_ansicht
name: Wohnzimmer
status: binary_sensor.wohnzimmer_bewegung
aspect_ratio: "16:9"        # 4:3, 1:1
image_action: fullscreen    # more-info | fullscreen | none
ptz: auto                   # Steuerkreuz, findet Schwenk-/Neige-Buttons der Kamera selbst
buttons_position: overlay   # oder below
buttons:
  - entity: light.wohnzimmer_decke
    name: Licht
chips:
  - entity: binary_sensor.wohnzimmer_bewegung
    name: Bewegung
    icon: mdi:motion-sensor
    state: "on"             # nur anzeigen, wenn Bewegung
  - entity: sensor.cam_akku
alerts:
  - entity: sensor.cam_akku
    below: 20
    message: Akku {state}
    level: error
split:                      # optional: Splitscreen mit weiteren Kameras
  - entity: image.katzenhohle_p1s_01p09c542801466_kamera
    name: 3D-Drucker
split_layout: grid          # grid | row | column
```

| Option | Standard | Bedeutung |
|---|---|---|
| `entity` | – | `camera.*` oder `image.*` (Pflicht) |
| `name`, `icon`, `status` | Entität | Kopfzeile; `status` = Text unter dem Namen |
| `tap_action`, `button_icon` + `button_action` | more-info | Icon antippen / Touch-Button oben rechts |
| `show_header` | `true` | Kopfzeile anzeigen |
| `aspect_ratio` / `fit` | `16:9` / `cover` | Seitenverhältnis, `contain` = ganzes Bild |
| `image_action` | `more-info` | Bild antippen: `more-info`, `fullscreen`, `none` |
| `stream` | `auto` | `auto` (HA-Stream, sonst MJPEG), `mjpeg`, `webrtc` (braucht webrtc-camera, Optionen unter `webrtc:`), `snapshot` |
| `refresh` | `10` | Standbild-Intervall in s ohne Stream (`0` = aus) |
| `buttons[]` | – | `entity` (button/script/scene werden ausgelöst, Licht/Schalter umgeschaltet) oder `tap_action`, `name`, `icon`, `hold_action`, `confirm` |
| `ptz` | `auto` | Rundes Steuerkreuz: `auto` (Schwenk-/Neige-/Zoom-Buttons am Gerät der Kamera), `onvif` (Dienst `onvif.ptz`, Extras unter `ptz_onvif:`), `false` = aus, oder manuell: `up`, `down`, `left`, `right`, `home`, `zoom_in`, `zoom_out` je eine Button-/Skript-Entität oder Aktion. Gedrückt halten = weiterfahren |
| `ptz_position` | `overlay` | `overlay` = unten rechts im Bild, `below` = darunter |
| `buttons_position` | `overlay` | `overlay` = runde Buttons im Bild, `below` = Pillen darunter |
| `chips[]` | – | `entity`, `name`, `icon`, `unit`, `decimals`; optional `state` / `state_not` / `above` / `below` = nur dann zeigen |
| `split[]` | – | Splitscreen: weitere Kameras als Kacheln, je `entity`, `name`, `ptz` (`auto`/`onvif`/`off`), `image_action`. Jede Kachel streamt nur, wenn sichtbar |
| `split_layout` | `grid` | `grid` (2 Spalten), `row` (nebeneinander), `column` (untereinander); schmale Karten stapeln automatisch |
| `alerts[]` | – | wie bei der Modular Card; Badge oben rechts, `glow: false` = Rahmen nicht einfärben |

---

## Nova Media Card

Media-Player-Karte im Look der Modular Card: Cover als Hintergrund, Titel, Interpret, App-Logo – leuchtet beim Abspielen.
Buttons erscheinen nur, wenn der Player sie kann (`supported_features`). Music Assistant wird automatisch erkannt.

```yaml
type: custom:nova-media-card
entity: media_player.wohnzimmer_tv
name: Wohnzimmer
artwork: cover              # background | cover | none
show_source: true
sources: [HDMI 1, Netflix]  # optional: nur diese Quellen
players:                    # optional: weitere Player, oben umschaltbar
  - entity: media_player.kueche
    name: Küche
  - media_player.bad
icon_map:                   # App/Quelle → Logo (Groß/Klein egal)
  netflix: /local/logos/netflix.svg
  youtube: mdi:youtube
  HDMI 1: mdi:video-input-hdmi
```

| Option | Standard | Bedeutung |
|---|---|---|
| `entity` | – | `media_player.*` (Pflicht) |
| `name`, `icon` | Entität | Kopfzeile |
| `tap_action`, `hold_action` | more-info | Icon antippen / lange drücken |
| `artwork` | `background` | `background` = Cover als Hintergrund, `cover` = Cover-Bild + unscharfer Hintergrund, `none` |
| `glow` | `true` | Rahmen leuchtet beim Abspielen |
| `show_progress` | `true` | Fortschrittsbalken mit Zeit, antippen = springen (wenn der Player Seek kann) |
| `show_volume`, `show_mute` | `true` | Lautstärke-Regler (bzw. −/+ bei Playern ohne `volume_set`) und Stumm-Button |
| `show_power` | `true` | Ein/Aus-Button oben rechts |
| `show_source` / `sources` | `false` / alle | Quellen als Pillen; `sources` = nur diese anzeigen |
| `players[]` | – | Weitere Player: `entity`, `name`, `icon`. Antippen = umschalten, lange drücken = Details |
| `show_players` | `true` | Umschalter anzeigen |
| `auto_switch` | `true` | Wechselt zum Player, der gerade spielt – bis man selbst umschaltet |
| `music_assistant` | automatisch | Findet den Music-Assistant-Player mit gleichem Namen. Spielt der, kommen Titel, Cover und Vor/Zurück von dort (das nackte Gerät, z. B. ESPHome, kennt die nicht). Fest: Entität angeben, `false` = aus. Auch je Eintrag in `players[]` |
| `icon_map` + `icon_entity` | – | Logo statt Icon: Schlüssel = App-Name, Quelle oder Kanal des Players; mit `icon_entity` zählt deren Zustand (wie bei der Raum Card). Gilt auch für die Quellen-Pillen |

## Nova Saugroboter Card

Saugroboter mit Status, Akku und Steuer-Pillen (Start, Pause, Stopp, Zur Station) – leuchtet beim Reinigen. Buttons erscheinen nur, wenn der Roboter sie kann (`supported_features`).
Mit Animation von Roboter und Station: fährt beim Reinigen, wischt (nasse Spur), fährt zurück, lädt, saugt ab, wäscht und trocknet den Mopp, zeigt Frisch-/Schmutzwassertank. Die nötigen Entitäten sucht die Karte selbst am Gerät des Roboters – ohne sie läuft die Animation nur mit dem `vacuum`-Zustand, den jeder Roboter hat.
Optional: Karte/Kamera-Bild (bei breiter Karte, z. B. im Popup, automatisch daneben), Saugstärke, Raumreinigung per Segment, Schalter (Staubentleerung, Moppwäsche …) sowie Infos und Verbrauchsteile. Alles im grafischen Editor einstellbar.

```yaml
type: custom:nova-vacuum-card
entity: vacuum.robbi
name: Robbi
battery: sensor.robbi_akku     # optional, sonst automatisch vom Gerät
status: sensor.robbi_status    # optional: genauerer Statustext
map: image.robbi_karte         # oder camera.*
layout: auto                   # side = Karte immer daneben, stack = darüber
map_aspect_ratio: auto         # 1:1, 4:3, 16:9, 3:4
fan_speeds: [Leise, Standard, Turbo]   # optional: nur diese Stufen
segment_mode: roborock         # valetudo | dreame | xiaomi
segment_repeat: 1
room_sensor: sensor.robbi_aktueller_raum
all: input_boolean.saugroboter_alles
rooms:
  - name: Küche
    icon: mdi:countertop
    segments: 16
  - name: Bad
    segments: 17, 18
  - name: Wohnzimmer           # oder per input_boolean einplanen (leuchtet, wenn an)
    icon: mdi:sofa
    entity: input_boolean.saugroboter_wohnzimmer
    area: wohnzimmer
  - name: Wischen Flur         # alles andere per Skript/Aktion
    icon: mdi:water
    entity: script.robbi_flur_wischen
    confirm: Flur wischen?
switches:
  - switch.robbi_staubentleerung
  - switch.robbi_moppwaesche
consumables:                   # Infos & Verbrauchsteile
  - entity: select.robbi_modus
    name: Modus
  - entity: sensor.robbi_filter_verbleibend
    name: Filter
    below: 10
  - entity: sensor.robbi_hauptbuerste_stunden
    name: Hauptbürste
    max: 300
```

| Option | Standard | Bedeutung |
|---|---|---|
| `entity` | – | `vacuum.*` (Pflicht) |
| `name`, `icon` | Entität | Kopfzeile |
| `tap_action`, `hold_action` | more-info | Icon antippen / lange drücken |
| `battery` / `battery_low` | automatisch / `20` | Akku-Sensor (leer = Akku-Sensor am selben Gerät, sonst Attribut `battery_level`); darunter rot. Beim Laden auf der Station: Lade-Icon |
| `battery_display` | `status` | Akku `status` (im Text unter dem Namen), `chip` (Pille rechts), `none` |
| `status` | – | Entität für den Text unter dem Namen statt des Roboter-Zustands |
| `controls` | `pills` | `pills` = Pillen mit Text (aktive leuchtet), `round` = runde Buttons mit großem Start/Pause |
| `layout` | `auto` | `auto` = Karte daneben ab 640 px Kartenbreite, sonst darüber; `side` = immer daneben; `stack` = immer darüber |
| `glow` | `true` | Rahmen leuchtet beim Reinigen, gelb/rot bei Warnung bzw. Fehler |
| `show_stop`, `show_return`, `show_locate` | `true` | Stopp (nur während der Fahrt), Zur Station, Suchen |
| `show_spot` | `false` | Spot-Reinigung |
| `show_fan_speed` / `fan_speeds` | `true` / alle | Saugstärke als Pillen aus `fan_speed_list`; `fan_speeds` = nur diese. Icons per `fan_speed_icons` (wie `icon_map`) |
| `scene` | `true` | Animation von Roboter und Station |
| `station_type` | `auto` | Station: `dock` (nur Laden), `empty` (Absaugstation mit Staubbeutel), `wash` (Waschstation mit Tanks), `full` (beides). `auto` = nach den Entitäten des Roboters |
| `scene_auto` | `true` | Entitäten für die Animation automatisch am Gerät suchen (Entity-ID bzw. `translation_key`, deutsch/englisch). Der Editor zeigt, was gefunden wurde |
| `mop_attached` | auto | Mopp angebracht (`binary_sensor` o. ä.) – Mopp-Pad am Roboter |
| `mop_mode` / `mop_states` | auto / – | Reinigungsmodus: Zustand mit `mop`/`wisch` (z. B. `vac_and_mop`) = wischt → nasse Spur. `mop_states` = genaue Zustände, falls die Erkennung nicht passt |
| `clean_water`, `dirty_water` | auto | Tanks in der Station (Schmutzwasser oben links, Frischwasser oben rechts, darunter der Staubbeutel): `binary_sensor` an = leer bzw. voll (blinkt rot, Rahmen gelb), Zahl = Füllstand in %, Text mit leer/voll |
| `emptying`, `washing`, `drying`, `charging` | auto | Aktiv bei an bzw. Zahl > 0 (z. B. Rest-Trocknungszeit). Zusätzlich werden `status` und `station` nach Absaugen/Waschen/Trocknen/Laden durchsucht (z. B. `emptying_the_bin`, `washing_the_mop`) |
| `station` | auto | Status-Sensor der Station |
| | | Jede dieser Entitäten mit `false` abschalten |
| `map` / `map_title` | – / `Karte` | `image.*` (lädt bei Änderung neu) oder `camera.*`; Überschrift, `-` = ohne |
| `map_aspect_ratio` | `auto` | Seitenverhältnis der Karte, sonst Bildgröße |
| `map_refresh` | `5` | Nur `camera.*`: Aktualisieren alle x s, solange der Roboter fährt und die Karte sichtbar ist (`0` = aus) |
| `map_action` | `more-info` | Karte antippen: `more-info` (Karte groß), `vacuum` (Roboter-Details), `none` |
| `rooms[]` | – | `name`, `icon` und `segments` (Komma-Liste) – antippen wählt aus, dann „Räume reinigen“. Oder `entity` (Skript/Button = auslösen, `input_boolean`/Schalter = umschalten und leuchten, wenn an) bzw. `tap_action` (+ `confirm`). Optional `area` für den Abgleich mit `room_sensor` |
| `room_sensor` | – | Sensor mit dem aktuellen Raum – passender Raum (Name, Bereich oder Segment) bekommt einen Ring |
| `all` (+ `all_name`, `all_icon`, `all_confirm`) | – / `Überall` | Pille oben rechts, z. B. `input_boolean.saugroboter_alles` oder ein Skript |
| `segment_mode` | `roborock` | Wie Segmente gereinigt werden: `roborock` (`vacuum.send_command` → `app_segment_clean`), `valetudo` (`segment_cleanup`), `dreame` (`dreame_vacuum.vacuum_clean_segment`), `xiaomi` (`xiaomi_miio.vacuum_clean_segment`). Andere Integrationen: Raum per `tap_action` |
| `segment_repeat` | `1` | Durchgänge je Raum |
| `rooms_title` | `Raum reinigen` | Überschrift über den Räumen, `-` = ohne |
| `switches[]` / `switches_columns` | – / `1` | Schalter wie bei der Modular Card: `entity`, `name`, `icon`, `tap_action`, `confirm`. Antippen schaltet, Buttons/Skripte werden ausgelöst |
| `consumables[]` | – | Infos & Verbrauchsteile (z. B. Modus, Wassertank, Filter): `entity`, `name`, `icon`, `unit`, `decimals`, `below` (darunter Warnung + Rahmen), `max` (Balken; bei `%` automatisch 100) |
| `consumables_layout` | `rows` | `rows` = Liste mit Balken, `chips` |

---

## Theming

Alle Karten lesen diese Variablen (z. B. im Theme oder per card-mod):

`--nova-background`, `--nova-border-color`, `--nova-text-color`, `--nova-accent-color`, `--nova-accent-text-color`, `--nova-active-color`, `--nova-active-text-color`, `--nova-warning-color`, `--nova-error-color`, `--nova-chip-color`, `--nova-radius`, `--nova-blur`, `--nova-room-min-height`, `--nova-light-min-width`, `--nova-modular-button-width`, `--nova-camera-ptz-size`, `--nova-media-min-height`, `--nova-media-artwork-opacity`, `--nova-vacuum-map-min-height`, `--nova-vacuum-scene-height`, `--nova-vacuum-robot-color`, `--nova-vacuum-station-color`, `--nova-vacuum-water-color`

## Lizenz

[MIT](LICENSE)
