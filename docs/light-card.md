# Nova Licht Card

[← Zurück zur Übersicht](../README.md)

Lampen als Kacheln: Antippen schaltet, Regler dimmt, Kachel leuchtet in der Lichtfarbe. Eine Lampe = Einzelkachel, mehrere = Sammelkarte.

```yaml
type: custom:nova-light-card
title: Wohnzimmer
area: wohnzimmer          # alle Lampen im Bereich automatisch
exclude:
  - light.wohnzimmer_nachtlicht
colors: ['#ff8a3d', k2700] # Farbknöpfe für alle Lampen (kXXXX = Weißton in Kelvin)
entities:
  - entity: light.stehlampe
    name: Stehlampe
    colors: ['#3d8bf5']
```

| Option | Standard | Bedeutung |
|---|---|---|
| `entities` / `area` | – | Lampen (mindestens eins von beiden) |
| `exclude` | – | Ausblenden bei `area` |
| `show_header` / `show_all_off` | `true` | Kopfzeile, „Alle aus“ |
| `use_light_color` | `true` | In Lichtfarbe leuchten |
| `show_colors` / `colors` | `true` / – | Farbknöpfe (im Editor per Farbscheibe anlegen) |
