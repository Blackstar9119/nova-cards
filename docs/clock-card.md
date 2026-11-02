# Nova Uhr Card

[← Zurück zur Übersicht](../README.md)

Uhrzeit im Nova-Stil – digital mit großen, schlanken Ziffern wie die Uhr der Wetter Card oder analog als Zifferblatt mit Chromring und Glas. Wochentag und Datum
auf Wunsch darunter. Sprache, 12/24 Stunden und Zeitzone kommen aus deinem Home-Assistant-Profil.

## Wenn du einfach nur eine Uhr willst, dann so

Dashboard bearbeiten → Karte hinzufügen → „Nova Uhr Card“. Mehr braucht es nicht, es gibt nichts auszuwählen.

```yaml
type: custom:nova-clock-card
```

## Wenn du ein Zifferblatt willst, dann so

Im Editor „Art der Uhr“ auf „Analog“ stellen. Mit „Sekunden“ läuft der Sekundenzeiger in deiner Akzentfarbe mit.

```yaml
type: custom:nova-clock-card
mode: analog
show_seconds: true
```

## Wenn du nur die Uhrzeit ohne Datum willst, dann so

```yaml
type: custom:nova-clock-card
show_weekday: false
show_date: false
```

## Wenn die Uhr ohne Kartenhintergrund auf dem Dashboard stehen soll, dann so

```yaml
type: custom:nova-clock-card
glass: false
```

## Alle Optionen

| Option | Standard | Bedeutung |
|---|---|---|
| `mode` | `digital` | `digital` oder `analog` |
| `name` | – | Kleine Überschrift über der Uhr, z. B. „Küche“ |
| `show_seconds` | `false` | Sekunden anzeigen (digital klein hinter der Zeit, analog als Sekundenzeiger) |
| `analog_digital` | `false` | Nur analog: zusätzlich die digitale Zeit neben dem Zifferblatt |
| `show_weekday` | `true` | Wochentag |
| `show_date` | `true` | Datum |
| `date_format` | `long` | `long` (2. November), `short` (2. Nov.) oder `numeric` (02.11.2026) |
| `time_format` | `auto` | `auto` (wie im Profil), `24` oder `12` |
| `color` | `accent-1` | Farbrolle für den Sekundenzeiger der analogen Uhr |
| `glass` | `true` | Glas-Hintergrund der Karte |
| `tap_action`, `hold_action` | – | Aktion beim Antippen bzw. langen Drücken |

Theme-Variable: `--nova-clock-size` – Schriftgröße der digitalen Zeit bzw. größte Breite des Zifferblatts.

## Gut zu wissen

- Die Uhr hat genau einen Zeitgeber. Er feuert nur zum nächsten Minutenwechsel (mit Sekunden: Sekundenwechsel) und nur,
  solange die Karte zu sehen ist. Wird die Karte entfernt oder der Tab versteckt, läuft nichts weiter.
- Die Zeit kommt vom Gerät, auf dem das Dashboard läuft. Geht dessen Uhr falsch, geht auch die Karte falsch.
