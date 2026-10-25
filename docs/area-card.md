# Nova Bereich Card

[← Zurück zur Übersicht](../README.md)

Eine Raumansicht als großer Glasrahmen: oben eine Kopfzeile mit Zurück-Knopf, Icon, Raumname und „Licht aus“,
darunter Werte-Chips (Temperatur, Luftfeuchte) und dann beliebige Karten in Zeilen und Spalten – genau wie in der
Nova Pop-up Card, nur fest im Dashboard. Gedacht für Raum-Unteransichten (z. B. `/zuhause/wohnzimmer`).

## Anlegen

1. Dashboard bearbeiten → **Karte hinzufügen** → **Nova Bereich Card**.
2. Unter **Allgemein** die **Area** wählen. Name und Icon kommen aus der Area, beides lässt sich überschreiben.
3. Unter **Layout & Vorlage** eine Vorlage wählen und unter **Inhalt** die Plätze mit Karten füllen
   (Kartenauswahl von Home Assistant, danach der normale Karteneditor der gewählten Karte).

Die Karte nimmt im Abschnitt immer die volle Breite ein. Am besten in einer Ansicht vom Typ „Abschnitte“ mit nur
einem Abschnitt bzw. in einer Panel-Ansicht verwenden.

## Kopfzeile

| Option | Bedeutung |
|---|---|
| `area` | Area, aus der Name, Icon, Lampen und Sensoren kommen |
| `name`, `icon` | Eigener Name / eigenes Icon (leer = wie in der Area) |
| `back_action` | Aktion des Zurück-Knopfs. Ohne Angabe eine Seite zurück, `action: none` blendet den Knopf aus |
| `tint` | Farbton des Rahmens als Nova-Farbrolle (`neutral`, `accent-1` … `accent-4`), leer = Nova-Glas |

## Licht aus

Der Knopf erscheint, sobald eine Lampe der Area an ist, und schaltet die Lampen der Area aus.

| Option | Bedeutung |
|---|---|
| `lights_off` | `false` blendet den Knopf aus (Standard `true`) |
| `lights_off_exclude` | Lampen, die nicht mit ausgeschaltet werden. Lichtgruppen, in denen eine davon steckt, bleiben ebenfalls an |

Versteckte Entitäten und Konfigurations-/Diagnose-Entitäten zählen nicht mit.

## Werte-Chips

Temperatur und Luftfeuchte kommen automatisch aus der Area: zuerst die Sensoren, die in Home Assistant bei der Area
hinterlegt sind, sonst der erste passende Sensor der Area. Antippen öffnet die Details.

| Option | Bedeutung |
|---|---|
| `show_temperature`, `show_humidity` | `false` blendet den Chip aus |
| `temperature_entity`, `humidity_entity` | Eigener Sensor statt des automatischen |
| `info` | Weitere Chips, gleiche Optionen wie die Info-Leiste der Pop-up Card (`entity`, `name`, `icon`, `decimals`, `alert`, `alert_state`, `alert_above`, `alert_below`, `alert_color`) |
| `info_layout` | `wrap` (umbrechen, Standard) oder `scroll` (waagrecht scrollen) |

## Raster

Wie bei der Pop-up Card: `rows` ist eine Liste von Zeilen, jede Zeile hat `cells` mit je einer Karte (`card`) und
optional einer Breite (`width`: `1/4`, `1/3`, `1/2`, `2/3`, `3/4`, `1`; ohne Angabe teilen sich die Spalten den Platz).
Alle Karten einer Zeile werden gleich hoch. Ist die Karte schmaler als `stack_below` (Standard 500 px, 0 = nie),
stehen alle Karten untereinander.

## Beispiel

```yaml
type: custom:nova-area-card
area: wohnzimmer
back_action:
  action: navigate
  navigation_path: /zuhause/home
lights_off_exclude:
  - light.vitrine
rows:
  - cells:
      - width: 1/2
        card:
          type: custom:nova-light-card
      - card:
          type: custom:nova-thermostat-card
          entity: climate.wohnzimmer_heizung
  - cells:
      - card:
          type: custom:nova-media-card
```
