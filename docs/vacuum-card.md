# Nova Saugroboter Card

[← Zurück zur Übersicht](../README.md)

Saugroboter mit Status, Akku und Steuer-Pillen (Start, Pause, Stopp, Zur Station) – leuchtet beim Reinigen. Buttons erscheinen nur, wenn der Roboter sie kann (`supported_features`).
Mit Animation von Roboter und Station: fährt beim Reinigen, wischt (nasse Spur), fährt zurück, lädt, saugt ab, wäscht und trocknet den Mopp, zeigt Frisch-/Schmutzwassertank. Die nötigen Entitäten sucht die Karte selbst am Gerät des Roboters und seiner Station (auch wenn die Station ein eigenes Gerät ist, wie bei Roborock) – ohne sie läuft die Animation nur mit dem `vacuum`-Zustand, den jeder Roboter hat.
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
  - name: Küche                # HA-Bereich → vacuum.clean_area (empfohlen)
    icon: mdi:countertop
    area: kuche
  - name: Wohnzimmer           # per input_boolean einplanen (leuchtet, wenn an)
    icon: mdi:sofa
    entity: input_boolean.saugroboter_wohnzimmer
    area: wohnzimmer
  - name: Bad                  # Integration ohne Bereiche: Segment-IDs
    segments: 17, 18
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
| `map_max_height` | `280` | Max. Höhe der Karte in px, wenn sie über den Bedienelementen steht (`0` = ohne Grenze). Die Höhe bleibt nach dem ersten Bild fest, neue Kartenbilder verschieben das Layout nicht |
| `map_refresh` | `5` | Nur `camera.*`: Aktualisieren alle x s, solange der Roboter fährt und die Karte sichtbar ist (`0` = aus) |
| `map_action` | `more-info` | Karte antippen: `more-info` (Karte groß), `vacuum` (Roboter-Details), `none` |
| `rooms[]` | – | `name`, `icon`, `area` (HA-Bereich). Antippen plant den Raum ein (bzw. schaltet die `entity`, z. B. `input_boolean`, die dann das Einplanen übernimmt). **Start** reinigt alle eingeplanten Räume per `vacuum.clean_area` – herstellerunabhängig, dafür in den Einstellungen der Roboter-Entität die Segmente den Bereichen zuordnen (HA 2026.3+). Nichts eingeplant, „Überall“ an oder Pause = normal starten bzw. fortsetzen. Kann der Roboter keine Bereiche: `segments` (Komma-Liste) über `segment_mode`. `entity` als Skript/Button bzw. `tap_action` (+ `confirm`) = direkt auslösen |
| `room_sensor` | – | Sensor mit dem aktuellen Raum – passender Raum (Name, Bereich oder Segment) bekommt einen Ring |
| `all` (+ `all_name`, `all_icon`, `all_confirm`) | – / `Überall` | Pille oben rechts, z. B. `input_boolean.saugroboter_alles` oder ein Skript |
| `segment_mode` | `roborock` | Nur für Räume mit `segments` statt Bereich: `roborock` (`vacuum.send_command` → `app_segment_clean`), `valetudo` (`segment_cleanup`), `dreame` (`dreame_vacuum.vacuum_clean_segment`), `xiaomi` (`xiaomi_miio.vacuum_clean_segment`). Andere Integrationen: Raum per `tap_action` |
| `segment_repeat` | `1` | Durchgänge je Raum |
| `rooms_title` | `Raum reinigen` | Überschrift über den Räumen, `-` = ohne |
| `switches[]` / `switches_columns` | – / `1` | Schalter wie bei der Modular Card: `entity`, `name`, `icon`, `tap_action`, `confirm`. Antippen schaltet, Buttons/Skripte werden ausgelöst |
| `consumables[]` | – | Infos & Verbrauchsteile (z. B. Modus, Wassertank, Filter): `entity`, `name`, `icon`, `unit`, `decimals`, `below` (darunter Warnung + Rahmen), `max` (Balken; bei `%` automatisch 100) |
| `consumables_layout` | `rows` | `rows` = Liste mit Balken, `chips` |
