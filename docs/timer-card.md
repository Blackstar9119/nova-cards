# Nova Timer Card

[← Zurück zur Übersicht](../README.md)

Ein Küchen-Timer fürs Dashboard: antippen, Zeit wählen, läuft. Gezeichnet als Stoppuhr im Nova-Stil, der leuchtende Ring
zeigt die Restzeit. Ist die Zeit um, klingelt die Karte sichtbar (Rahmen pulsiert, Stoppuhr wackelt, Glocke), bis jemand
„OK“ drückt.

Die Karte zählt nicht selbst, sondern steuert einen **Timer-Helfer** in Home Assistant. Darum zeigen alle Geräte
(Echo Show, Handy, Tablet) dieselbe Zeit, und ein Neuladen der Seite ändert nichts.

## Wenn du zum ersten Mal einen Timer willst, dann so

1. **Helfer anlegen:** Einstellungen → Geräte & Dienste → Helfer → „Helfer erstellen“ → **Timer**.
   Name z. B. „Küche Timer“, Dauer z. B. 5 Minuten. Haken bei **„Zustand wiederherstellen“** setzen – dann läuft der Timer
   auch nach einem Neustart von Home Assistant weiter.
2. **Karte hinzufügen:** Dashboard bearbeiten → Karte hinzufügen → „Nova Timer Card“ → oben den Timer auswählen. Fertig.

```yaml
type: custom:nova-timer-card
entity: timer.kuche_timer
```

## Wenn du andere Schnellwahl-Knöpfe willst, dann so

Im Editor unter „Schnellwahl und Knöpfe“ die Minuten mit Komma eintragen. `30s` sind Sekunden, `1h` eine Stunde.

```yaml
type: custom:nova-timer-card
entity: timer.kuche_timer
presets: [3, 8, 12, 20]
```

## Wenn der Platz knapp ist (z. B. Echo Show), dann so

`layout: compact` zeigt eine kleine Stoppuhr mit großer Zeit daneben, die Knöpfe bleiben groß genug für den Finger.
„Eigene Zeit“ hat hier Minuten (bis 180) und Sekunden nebeneinander und ersetzt solange Start und Schnellwahl – die Karte
wird dadurch nicht höher.

```yaml
type: custom:nova-timer-card
entity: timer.kuche_timer
name: Timer
layout: compact
```

## Wenn es beim Ablauf auch klingeln oder eine Ansage geben soll, dann so

Die Karte zeigt den Ablauf nur an. Für Ton oder Ansage (Echo, Lautsprecher, Handy) eine Automation anlegen:
Auslöser **„Ereignis“** mit dem Ereignistyp `timer.finished` und den Ereignisdaten `entity_id: timer.kuche_timer`,
Aktion z. B. eine Benachrichtigung oder Ansage. So kommt der Ton genau einmal, egal wie viele Geräte die Karte zeigen.

## So bedienst du die Karte

| Was | Wie |
|---|---|
| Starten mit eingestellter Dauer | „Start“ oder die Stoppuhr antippen |
| Starten mit anderer Zeit | Schnellwahl-Knopf, oder „Eigene Zeit“ → Stunden/Minuten/Sekunden mit + und − (gedrückt halten = schnell) → „Starten“ |
| Pause / Weiter | „Pause“ bzw. „Weiter“, oder die Stoppuhr antippen |
| Eine Minute dazu | „1 Min“ (nur während der Timer läuft) |
| Abbrechen | „Abbrechen“ |
| Hinweis „Zeit ist um“ wegdrücken | „OK“ oder die Stoppuhr antippen. „Nochmal“ startet dieselbe Zeit neu |

„OK“ gilt nur für das Gerät, auf dem du es drückst. Andere Geräte hören nach der eingestellten Hinweisdauer von selbst auf.

## Alle Optionen

| Option | Standard | Bedeutung |
|---|---|---|
| `entity` | – | Timer-Helfer (`timer.*`), Pflicht |
| `name`, `icon` | Name/Icon des Helfers | Eigener Name und eigenes Icon |
| `show_presets` | `true` | Schnellwahl-Knöpfe zeigen |
| `presets` | `[1, 5, 10, 15]` | Schnellwahl in Minuten (`30s`, `1h` gehen auch), höchstens 8 |
| `show_custom` | `true` | Knopf „Eigene Zeit“ |
| `show_add` | `true` | Knopf „+1 Min“, solange der Timer läuft |
| `alarm_text` | „Zeit ist um!“ | Text beim Ablauf |
| `alarm_color` | `accent-2` | Farbrolle beim Ablauf (`neutral`, `accent-1` … `accent-4`) |
| `alarm_minutes` | `10` | So lange zeigt die Karte den Ablauf, wenn niemand „OK“ drückt. `0` = bis jemand bestätigt |
| `layout` | `full` | `full` (große Stoppuhr) oder `compact` |
| `color` | `accent-1` | Farbrolle für Ring und Knöpfe |
| `animation` | `true` | Aus = Standbild, nur die Zahlen ändern sich |
| `glow` | `true` | Kartenrahmen leuchtet, solange der Timer läuft |
| `tap_action`, `hold_action` | Details | Kopfzeile antippen bzw. lange drücken. Die Stoppuhr selbst startet/pausiert |

Theme-Variablen: `--nova-timer-size` (größte Breite der Stoppuhr, Standard 240px), `--nova-timer-button-height`
(Knopfhöhe, Standard 52px).

## Gut zu wissen

- „+1 Min“ nutzt den Dienst `timer.change`. Klappt das nicht (z. B. weil der Timer dann länger liefe als seine eingestellte
  Dauer), startet die Karte den Timer mit der neuen Restzeit neu.
- Läuft der Timer, tickt die Karte einmal pro Sekunde – aber nur, solange sie zu sehen ist. In der Kartenauswahl steht sie still.
