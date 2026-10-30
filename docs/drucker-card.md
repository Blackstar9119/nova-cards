# Nova 3D-Drucker Card

[← Zurück zur Übersicht](../README.md)

3D-Drucker der [Bambu-Lab-Integration](https://github.com/greghesp/ha-bambulab) mit animierter Druckerzeichnung (geschlossener
CoreXY-Drucker mit Glastür, Touch-Display und AMS), Kamerabild, Fortschritt, Restzeit, Endzeit, Schicht, Temperaturen, Dateiname, Druckphase,
Meldungen, AMS-Slots und den Knöpfen Pause, Fortsetzen, Stopp und Kammerlicht. Alles ist im grafischen Editor einstellbar.

## Wenn du einfach nur deinen Drucker zeigen willst, dann so

Wähle im Editor unter **Allgemein → Drucker** dein Bambu-Lab-Gerät aus. Die Karte trägt alle Entitäten selbst ein, findet das AMS
(auch mehrere Einheiten) und die externe Spule.

```yaml
type: custom:nova-drucker-card
device: 0123456789abcdef0123456789abcdef
```

## Wenn eine Entität falsch erkannt wird, dann so

Unter **Entitäten** die richtige eintragen. Leere Felder sucht die Karte weiter selbst am Gerät.

```yaml
type: custom:nova-drucker-card
device: 0123456789abcdef0123456789abcdef
file: sensor.p1s_gcode_dateiname     # statt „Name der Aufgabe“
stage: sensor.p1s_aktueller_arbeitsschritt
```

## Wenn du kein AMS hast (oder es nicht sehen willst), dann so

Ohne AMS blendet die Karte es von selbst aus und zeigt stattdessen die Spule am Drucker. Erzwingen kannst du es unter **AMS und Spulen**:

```yaml
ams: hide        # auto = nur wenn eines gefunden wird, show = immer mit AMS
```

Nur bestimmte Slots zeigen:

```yaml
ams_trays:
  - sensor.ams_1_slot_1
  - sensor.ams_1_slot_2
```

## Wenn du das Kamerabild sehen willst, dann so

Unter **Kamera** eine `camera.*`- oder `image.*`-Entität wählen (beim Wählen des Druckers wird sie vorbelegt). Das Bild steht in voller
Kartenbreite unter der Zeichnung, antippen öffnet es groß. Ist das Bild nicht verfügbar, verschwindet der Bereich.

```yaml
camera: image.p1s_kamera
camera_mode: printing   # always = immer, printing = nur während eines Drucks
```

## Wenn du Lüfter regeln und weitere Schalter zeigen willst, dann so

Unter der Zeichnung stehen alle Lüfter des Druckers als Regler. Zusätzliche Schalter oder Werte (Kamera, Zeitraffer, WLAN-Signal …)
trägst du unter **Lüfter und Schalter** ein. Schalter lassen sich antippen, andere Werte öffnen die Details.

```yaml
fans:                 # leer = alle Lüfter des Druckers
  - fan.p1s_bauteillufter
  - fan.p1s_druckraumlufter
switches:
  - switch.p1s_kamera_aktivieren
  - sensor.p1s_wi_fi_signalqualitat
```

## Wenn du Anzeigen weglassen willst, dann so

Unter **Anzeigen** jede Anzeige einzeln aus- und einschalten:

```yaml
show_file: false        # Dateiname
show_end_time: false    # „fertig um …“
show_ams_list: false    # AMS-Slots unter der Zeichnung
show_controls: false    # Pause/Fortsetzen/Stopp
show_light: false       # Licht-Knopf oben rechts
show_display: false     # Touch-Display an der Zeichnung
show_fans: false        # Lüfter-Regler
show_switches: false    # weitere Schalter
```

Weitere: `show_progress`, `show_remaining`, `show_layer`, `show_nozzle`, `show_bed`, `show_stage`, `show_message`.

## Wenn dich bestimmte Meldungen nerven, dann so

Unter **Meldungen** einzeln abschalten. Abgeschaltete Meldungen erscheinen weder als Hinweis noch als Animation.

```yaml
hide_messages: [door, calib]
```

| Schlüssel | Meldung | Animation |
|---|---|---|
| `heat` | Aufheizen | Düse und Bett glühen pulsierend |
| `cool` | Abkühlen | Lüfter drehen, kalte Luft steigt auf, Glühen klingt ab |
| `level` | Bett leveln | Druckkopf tippt Messpunkte auf dem Bett ab |
| `wipe` | Düse reinigen / wischen | Kopf fährt zur Wischkante und wischt |
| `calib` | Kalibrieren (Extrusion, Flow …) | Linien erscheinen auf dem Bett |
| `scan` | Prüfen / Scannen | Kopf fährt mit Laserlinie über das Bett |
| `home` | Referenzfahrt | Kopf fährt in die Ecke und zurück |
| `change` | Filament- und AMS-Wechsel | Filament fährt zurück, neue Farbe läuft ein, Slot leuchtet |
| `empty` | Filament leer | Spule leer, Warnsymbol am Slot, Filament steht |
| `tangle` | Filament verheddert / klemmt | Spule ruckelt, Warnsymbol am Slot |
| `ams` | AMS-Fehler | Slot-LEDs blinken |
| `spaghetti` | Spaghetti / erste Schicht fehlerhaft | Wirre Linien auf dem Bett, rote Warnung |
| `shift` | Objekt verrutscht | Objekt verschoben, Warnung |
| `clog` | Düse verstopft | Düse blinkt rot |
| `door` | Tür offen | Tür klappt auf |
| `lid` | Deckel offen | Deckel (mit AMS) hebt sich |
| `fan` | Lüfterfehler | Lüfter steht, Lüfter-Warnung |
| `temp` | Temperaturfehler | Thermometer-Warnung, Glühen in Rot |
| `warn` | Alles Unbekannte | Allgemeine Warnung mit dem Text des Druckers |

## Wenn eine Meldung nicht richtig erkannt wird, dann so

Alle Zuordnungen stehen an einer Stelle: `src/printer-messages.js`.

- Druckphase (Sensor „Aktueller Arbeitsschritt“): in `STAGES` eintragen, z. B. `cleaning_nozzle_tip: 'wipe'`.
- HMS- oder Druckfehler-Code: in `CODES` eintragen, z. B. `'0300_0100_0001_0001': 'temp'`. Ein kürzerer Code gilt für alle, die so beginnen.
- Nur der Text ist bekannt: in `WORDS` ein Suchmuster ergänzen.

Danach `npm run build`.

## Wenn du alles ausprobieren willst, ohne dass gerade gedruckt wird, dann so

Im Editor unter **Demo** einen Zustand und eine Meldung wählen oder mit „Zustand ›“ und „Meldung ›“ durchklicken. Die Vorschau
zeigt dann Beispielwerte mit zwei AMS-Einheiten (ausschaltbar mit „Demo mit AMS“). Vor dem Speichern **Demo-Zustand auf „Aus“**
stellen, sonst zeigt die Karte auch im Dashboard die Beispielwerte.

```yaml
demo: print            # heat, prep, pause, done, error, cool, idle, off
demo_message: spaghetti
demo_ams: true
```

## Wenn du die Farben ändern willst, dann so

`color` ist eine Farbrolle aus dem Theme (Fortschritt, Knöpfe, aktiver Slot). Das gedruckte Objekt hat automatisch die Farbe
des aktiven Filaments. Das Gehäuse lässt sich im Theme färben:

```yaml
nova-printer-color: "#191d26"         # Gehäuse unten
nova-printer-color-light: "#3a4252"   # Gehäuse oben
```

## Alle Optionen

| Option | Standard | Bedeutung |
|---|---|---|
| `device` | – | Bambu-Lab-Drucker; füllt alle Entitäten automatisch |
| `name`, `icon` | Gerätename, `mdi:printer-3d` | Kopfzeile |
| `status`, `stage`, `progress`, `remaining`, `end_time`, `layer`, `layers` | automatisch | Druckstatus, Druckphase, Fortschritt, Restzeit, Endzeit, Schichten |
| `nozzle`, `nozzle_target`, `bed`, `bed_target` | automatisch | Temperaturen mit Ziel |
| `file` | automatisch | Name der Aufgabe bzw. Datei |
| `hms`, `print_error` | automatisch | HMS-Fehler und Druckfehler (Meldungen mit Code) |
| `door`, `online` | automatisch | Türsensor (wenn vorhanden), Online-Status |
| `pause`, `resume`, `stop`, `light` | automatisch | Knöpfe und Kammerlicht |
| `stop_confirm` | `Druck wirklich abbrechen?` | Rückfrage vor Stopp, leer = ohne |
| `ams` | `auto` | `auto`, `show`, `hide` |
| `ams_trays`, `external_spool` | automatisch | AMS-Slots bzw. externe Spule |
| `camera`, `camera_mode` | –, `always` | Kamerabild unter der Zeichnung |
| `fans` | alle Lüfter des Druckers | Lüfter als Regler |
| `switches` | – | Weitere Schalter oder Werte |
| `show_*` | `true` | Anzeigen einzeln, siehe oben |
| `hide_messages` | – | Meldungen ausblenden, siehe oben |
| `color` | `accent-1` | Farbrolle |
| `glow` | `true` | Rahmen leuchtet beim Drucken |
| `animation` | `true` | `false` = Standbild |
| `demo`, `demo_message`, `demo_ams` | – | Demo-Modus, siehe oben |
| `tap_action`, `hold_action` | more-info | Icon antippen / lange drücken |

Animationen laufen nur, solange die Karte zu sehen ist, und stehen bei „Bewegung reduzieren“ im System still.
