# Nova Gerät Card

[← Zurück zur Übersicht](../README.md)

Eine Karte für Haushaltsgeräte: Waschmaschine, Spülmaschine, Airfryer, Kaffeemaschine, Futterautomat, Trinkbrunnen oder ein
beliebiges anderes Gerät. Sie zeigt Status, Programm, Fortschritt, Restzeit und Endzeit, dazu Regler (Programm, Temperatur …),
Start/Pause/Stopp und ein animiertes Gerätebild. Der Gerätetyp schaltet nur Symbol, Texte, Standardfarbe und Animation um, die
Optionen sind für alle Geräte gleich. Alles ist im grafischen Editor einstellbar.

## Wenn du einfach nur ein Gerät zeigen willst, dann so

Gerätetyp und Status-Entität reichen. Fortschritt, Restzeit und Endzeit kommen dazu, sobald du sie einträgst.

```yaml
type: custom:nova-geraet-card
device_type: dishwasher
name: Spülmaschine
entity: sensor.spulmaschine_state
progress: sensor.spulmaschine_progress
remaining: sensor.spulmaschine_time_remaining
```

## Wenn du das Gerät auch starten willst, dann so (Home Connect)

`start` darf ein Button, Skript oder Schalter sein, bei Home Connect auch das Select „Aktives Programm“. Dann setzt die Karte beim
Start den Wert von `start_option`. Mit `start_at: home_connect` wählst du in der Karte eine Startzeit, die Karte rechnet sie in
„Fertig in“ um (braucht `duration`).

```yaml
type: custom:nova-geraet-card
device_type: washer
name: Waschmaschine
entity: sensor.waschmaschine_betriebszustand
power: switch.waschmaschine_einschalter
program: select.waschmaschine_aktives_programm
progress: sensor.waschmaschine_programm_fortschritt
end_time: sensor.waschmaschine_programm_endzeit
duration: number.waschmaschine_beenden_in_relativ
controls:
  - entity: select.waschmaschine_ausgewahltes_programm
    name: Programm
    show: idle
  - entity: select.waschmaschine_temperatur
    name: Temperatur
    show: idle
start: select.waschmaschine_aktives_programm
start_option: select.waschmaschine_ausgewahltes_programm
start_at: home_connect
pause: button.waschmaschine_programm_pausieren
resume: button.waschmaschine_programm_fortsetzen
stop: button.waschmaschine_programm_stoppen
stop_confirm: Waschgang wirklich abbrechen?
remote_start: binary_sensor.waschmaschine_fernstart
door: sensor.waschmaschine_tur
```

## Wenn die Karte nur auf der Startseite erscheinen soll, solange etwas läuft, dann so

```yaml
type: custom:nova-geraet-card
device_type: airfryer
entity: sensor.airfryer_kochstatus
layout: compact
hide_when_off: true
```

## Wenn du Hinweise im Gerätebild willst, dann so

Jeder Hinweis erscheint als Meldung und kann im Bild etwas zeigen, z. B. leeren Wassertank, Bohnen, Entkalken, Waschmittel,
Weichspüler, Futter, Wasser oder Filter (je nach Gerätetyp).

```yaml
type: custom:nova-geraet-card
device_type: fountain
entity: binary_sensor.trinkbrunnen_power
mode: select.trinkbrunnen_modus
filter: sensor.trinkbrunnen_filter_percent
filter_days: sensor.trinkbrunnen_filter_days_remaining
hints:
  - entity: binary_sensor.trinkbrunnen_water_missing
    anim: water
    level: error
  - entity: binary_sensor.trinkbrunnen_warning_filter
    anim: filter
    reset: button.trinkbrunnen_reset_filter
```

## Alle Optionen

### Allgemein

| Option | Bedeutung |
|---|---|
| `device_type` | `washer`, `dishwasher`, `airfryer`, `coffee`, `feeder`, `fountain` oder `generic` (Allgemein). Bestimmt nur Symbol, Texte, Standardfarbe und Animation |
| `name`, `icon` | Name und Icon |
| `entity` | Betriebszustand, z. B. `sensor.waschmaschine_betriebszustand`, auch `binary_sensor` (an = läuft) |
| `power` | Optional: Schalter für den runden Knopf oben rechts |

### Programm und Fortschritt

| Option | Bedeutung |
|---|---|
| `program` | Laufendes Programm (Select oder Sensor) |
| `drink` | Nur Kaffeemaschine: Getränk. Leer = Programm. Erkennt Espresso, Kaffee, Cappuccino, Latte (Macchiato), Milch, Heißwasser |
| `fill_level` | Futterautomat/Trinkbrunnen: Prozent-Sensor oder `binary_sensor` „niedrig“ (an = niedrig) |
| `filter`, `filter_days` | Trinkbrunnen: Filter in % und Resttage für den Hinweis „Filter wechseln“ |
| `mode` | Futterautomat/Trinkbrunnen: Modus für die LED. Smart grün, aus grau, sonst blau |
| `feed_count`, `feed_done_minutes` | Futterautomat ohne Zustand „füttert“: Zähler der Fütterungen, und wie lange danach „Fertig“ stehen bleibt (Standard 10 min) |
| `progress` | Fortschritt in %. Leer = aus Restzeit und Gesamtdauer berechnet |
| `duration` | Gesamtdauer, für den Fortschritt und für „Starten um“ |
| `remaining` | Restzeit (s/min/h oder H:MM), die Endzeit wird daraus berechnet |
| `end_time` | Endzeit als Zeitpunkt-Sensor, die Restzeit wird daraus berechnet |
| `phase` | Optional: Phase, steuert die Sonder-Animation (z. B. Schleudern, Trocknen) |
| `phase_states` | Zustände der Sonder-Animation. Leer = Vorschlag zum Gerätetyp |

### Regler (`controls`)

Liste von Entitäten (`select`, `number`, `switch`, `sensor` …), je mit `entity`, `name`, `icon`, `display`
(Select: `auto`, `pills`, `list`; Zahl: `buttons`, `slider`), `step` und `show` (`always`, `idle` = nur vor dem Start,
`running` = nur während des Laufs).

### Steuerung

| Option | Bedeutung |
|---|---|
| `start`, `start_name` | Start (Button, Skript, Schalter oder Select) und Text auf dem Knopf (Standard „Start“) |
| `start_option`, `start_option_name` | Bei Start über ein Select: dessen Wert wird gesetzt. Ohne `start_option` wählt man in der Karte aus |
| `pause`, `resume`, `stop` | Knöpfe für Pause, Fortsetzen und Stopp |
| `resume_with_start` | Bei Pause erscheint „Fortsetzen“ und drückt den Start-Knopf (z. B. Philips Airfryer) |
| `start_confirm`, `stop_confirm` | Rückfrage vor Start bzw. Stopp |
| `start_at` | `home_connect`: Startzeit in der Karte wählen, wird in „Fertig in“ umgerechnet |

### Hinweise

| Option | Bedeutung |
|---|---|
| `remote_start`, `remote_start_text` | Fernstart erlaubt? Aus = Start ausgegraut mit Hinweis |
| `door`, `door_text`, `door_anim` | Tür/Schublade offen als Hinweis, auf Wunsch auch im Bild |
| `connection`, `connection_text` | Hinweis, wenn das Gerät nicht verbunden ist |
| `hints` | Liste eigener Hinweise: `entity`, `anim` (Bild), `message`, `icon`, `state`/`state_not`, `above`/`below`, `level` (`warning`, `error`, `info`), `reset`/`reset_name` (Knopf im Hinweis) |

### Zustände und Texte

`running_states`, `paused_states`, `waiting_states`, `finished_states`, `error_states`, `prep_states`, `ready_states`,
`heat_states`, `warm_states` legen fest, welche Rohzustände wozu gehören. Leer = übliche Zustände (z. B. `run`, `running`,
`cooking`). Mit `text_running`, `text_paused`, `text_waiting`, `text_finished`, `text_error`, `text_off`, `text_prep`,
`text_ready`, `text_heat`, `text_warm` überschreibst du die angezeigten Texte.

### Aussehen und Aktionen

| Option | Bedeutung |
|---|---|
| `layout` | `full` (Standard) oder `compact` |
| `hide_when_off` | Karte nur zeigen, solange etwas läuft (im Bearbeitungsmodus bleibt sie sichtbar) |
| `animation` | Aus = Standbild |
| `color` | Farbrolle (`neutral`, `accent-1` … `accent-4`) |
| `glow` | Rahmen leuchtet beim Laufen |
| `window`, `heat_color` | Nur Airfryer: Sichtfenster an/aus und Glühfarbe der Heizspirale |
| `tap_action`, `hold_action` | Aktionen beim Antippen und langen Drücken |
