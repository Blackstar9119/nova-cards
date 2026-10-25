# Nova Müllkalender Card

[← Zurück zur Übersicht](../README.md)

Nächste Müllabholungen aus einem oder mehreren Kalendern (z. B. iCal-Abfallkalender) – mit Müllart, Icon, Farbe, Datum und
„heute / morgen / in X Tagen“. Abholungen heute und morgen werden hervorgehoben, der Rahmen leuchtet in der Farbe der Müllart.
Farben werden nicht frei gewählt, sondern als Farbrolle – so färbt ein Theme alle Karten einheitlich um.
Die Termine kommen über die Kalender-API von Home Assistant: beim Laden der Karte, danach stündlich und direkt nach Mitternacht.

```yaml
type: custom:nova-waste-card
entities:
  - calendar.abfallkalender
title: Müllkalender
layout: list                # list | compact
count: 5
days: 30
types:                      # erste passende Regel gewinnt
  - match: Papier, PPK      # Stichwort(e) im Termintitel, Groß/Klein egal
    name: Papiertonne
    icon: mdi:newspaper-variant-outline
    color: accent-1         # Farbrolle: neutral | accent-1 … accent-4
  - match: Gelb, Wertstoff
    name: Gelber Sack
    icon: mdi:recycle
    color: accent-2
```

| Option | Standard | Bedeutung |
|---|---|---|
| `entities` | – | Ein oder mehrere `calendar.*` (Pflicht; einzeln auch als `entity`) |
| `title`, `icon` | `Müllkalender`, `mdi:trash-can-outline` | Kopfzeile; `icon` ist auch das Icon für Termine ohne eigene Regel |
| `show_header` | `true` | Kopfzeile mit „Nächste Abholung …“ |
| `layout` | `list` | `list` = nächste Termine untereinander, `compact` = nur der nächste Abholtag (mehrere Müllarten an dem Tag nebeneinander) |
| `count` | `5` | Anzahl Termine in der Liste |
| `days` | `30` | Zeitraum in Tagen ab heute |
| `types[]` | – | Regeln: `match` (Stichwort, mehrere mit Komma), `name` (leer = Termintitel), `icon`, `color` (Farbrolle; Standard `neutral`) |
| `hide_unmatched` | `false` | Termine ohne passende Regel ausblenden |
| `glow` | `true` | Rahmen leuchtet bei einer Abholung heute oder morgen |

Ganztägige Termine zählen für ihren Kalendertag, mehrtägige ab heute bis zu ihrem letzten Tag. Termine mit Uhrzeit zeigen die
Uhrzeit mit an und richten sich nach der Zeitzone aus dem HA-Profil (Browser oder Server). Die gleiche Müllart am gleichen Tag
aus mehreren Kalendern erscheint nur einmal. Antippen öffnet die Details des Kalenders.
Im Editor fügt **„Standard-Müllarten einfügen“** Restmüll, Papier, Gelber Sack, Bio und Glas als Vorlage ein.
