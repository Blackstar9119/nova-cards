# Nova Info Card

[← Zurück zur Übersicht](../README.md)

Überschrift mit Zeilen: links der Name, rechts der Wert, formatiert wie in Home Assistant (Einheit, Rundung, „Offen“, „Ein“ …).
Eine Zeile kann auch ein Schalter sein: dann zeigt sie Icon, Name und Zustand, und Antippen schaltet die Entität.
Antippen einer Wert-Zeile öffnet die Details.

```yaml
type: custom:nova-info-card
title: Wohnzimmer
icon: mdi:sofa
entities:
  - entity: sensor.wohnzimmer_temperatur
    name: Temperatur
    decimals: 1
  - entity: binary_sensor.wohnzimmer_fenster
  - entity: switch.stehlampe
    display: toggle
    color: accent-2
```

| Option | Standard | Bedeutung |
|---|---|---|
| `title`, `icon` | – | Überschrift und Icon |
| `style` | `box` | `box` (Block wie im Pop-up) oder `glass` (Glas wie andere Nova-Karten) |
| `entities[]` | – | Zeilen, siehe unten |

Je Zeile:

| Option | Standard | Bedeutung |
|---|---|---|
| `entity` | – | Entität (Pflicht) |
| `name` | Name der Entität | Eigener Name |
| `icon` | – | Bei Wert-Zeilen nur sichtbar, wenn gesetzt |
| `display` | `value` | `value` (Name links, Wert rechts) oder `toggle` (Icon, Name, Zustand; Tippen schaltet) |
| `decimals` | wie in HA | Nachkommastellen (nur `value`) |
| `color` | Akzent 2 für Licht/Schalter, sonst Akzent 1 | Farbrolle, wenn an (nur `toggle`) |
