# Nova Kamera Card

[← Zurück zur Übersicht](../README.md)

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
