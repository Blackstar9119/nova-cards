# Nova Media Card

[← Zurück zur Übersicht](../README.md)

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
