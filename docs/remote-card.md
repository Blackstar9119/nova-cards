# Nova Fernbedienung

[← Zurück zur Übersicht](../README.md)

Fernbedienung für Fernseher und Streaming-Boxen. Die Tastenbefehle passen sich der Integration der Entität an, Tasten,
die das Gerät nicht kennt, werden ausgeblendet. Pfeile, Lautstärke, Kanäle und Spulen wiederholen sich beim Festhalten.

| Gerätetyp (`platform`) | Integration | Entität | Apps öffnen über |
|---|---|---|---|
| `androidtv_remote` | Android TV Remote (Xiaomi TV Box, Chromecast mit Google TV, Sony, Philips mit Google TV …) | `remote.*` | App-Link (`remote.turn_on` mit `activity`), notfalls Paketname |
| `androidtv` | Android Debug Bridge (Fire TV, Android TV) | `media_player.*` | Paketname (`select_source`) |
| `philips_js` | Philips TV | `remote.*` | Quelle des Players |
| `apple_tv` | Apple TV | `remote.*` | Quelle des Players |
| `roku` | Roku | `remote.*` | Quelle des Players |
| `samsungtv` | Samsung Smart TV | `remote.*` | Quelle des Players |

```yaml
type: custom:nova-remote-card
entity: remote.wohnzimmer_tv_box
layout: dpad                 # dpad | touchpad
volume_entity: media_player.wohnzimmer_fernseher   # optional: Lautstärke am Fernseher regeln
apps:
  - preset: netflix
  - preset: youtube
  - name: ARD
    icon: mdi:numeric-1-box
    app: https://www.ardmediathek.de
    package: de.swr.avp.ard.tv
buttons:
  - name: Einstellungen
    icon: mdi:cog
    command: SETTINGS
keys:                        # optional: eigene Belegung
  menu: SETTINGS
```

## Optionen

| Option | Standard | Bedeutung |
|---|---|---|
| `entity` | – | `remote.*` oder bei ADB `media_player.*` (Pflicht) |
| `name`, `icon` | Entität | Kopfzeile; ohne Icon zeigt sie das Icon der laufenden App |
| `platform` | automatisch | Gerätetyp (siehe oben), bestimmt die Tastenbefehle |
| `media_player` | automatisch | Player für Zustand und laufende App; leer = Player am selben Gerät |
| `layout` | `dpad` | `dpad` = Steuerkreuz mit OK, `touchpad` = wischen für Richtung, tippen für OK |
| `show_power` | `true` | Ein/Aus-Button oben rechts |
| `show_nav` | `true` | Zurück, Home, Menü |
| `show_media` | `true` | Zurückspulen, Play/Pause, Vorspulen |
| `show_volume` | `true` | Leiser, Stumm, Lauter |
| `show_channels` | `false` | Kanal runter, Eingang, Kanal hoch |
| `volume_entity` | – | Lautstärke über einen anderen `media_player` (Fernseher, AV-Receiver) |
| `apps[]` | – | App-Kacheln, siehe unten. Die laufende App leuchtet |
| `buttons[]` | – | Eigene Tasten: `name`, `icon`, `command` (mehrere mit Komma) oder `tap_action` |
| `keys` | – | Eigene Befehle je Taste: `up`, `down`, `left`, `right`, `ok`, `back`, `home`, `menu`, `play_pause`, `rewind`, `forward`, `vol_down`, `mute`, `vol_up`, `ch_down`, `input`, `ch_up`, `power` |
| `tap_action`, `hold_action` | more-info | Icon oben antippen / lange drücken |

## Apps

| Option | Bedeutung |
|---|---|
| `preset` | Vorlage: `netflix`, `youtube`, `prime`, `disney`, `appletv`, `spotify`, `ytmusic`, `plex`, `kodi`, `twitch`, `dazn`, `playstore`, `settings` |
| `name`, `icon` | Eigener Name / eigenes Icon (sonst aus der Vorlage) |
| `app` | Android TV Remote: App-Link, mit dem die App startet (`https://www.youtube.com`, `spotify://`). Andere Geräte: Name der Quelle |
| `package` | Paketname (`com.netflix.ninja`): erkennt die laufende App. Ohne `app` wird damit gestartet – über ADB klappt das immer, über Android TV Remote lehnen manche Boxen (z. B. Xiaomi TV Box) reine Paketnamen ab |
| `tap_action` | Optional statt App öffnen, z. B. ein Skript |

Den Paketnamen einer App muss man nicht suchen: App am Gerät öffnen, dann im Editor unter **Apps** auf
**Laufende App übernehmen** tippen. Startet die App über die Karte danach nicht, braucht sie zusätzlich einen App-Link
(meist die Webadresse des Anbieters).
