# Nova Dock Card

[← Zurück zur Übersicht](../README.md)

Schwebende Leiste mit runden Buttons: navigieren, Aktion auslösen oder ein Popup mit beliebigen Karten öffnen.

```yaml
type: custom:nova-dock-card
position: bottom          # oder top
button_size: 48
items:
  - icon: mdi:home
    label: Start
    tap_action:
      action: navigate
      navigation_path: /lovelace/0
  - icon: mdi:lightbulb-group
    popup_title: Licht
    badge_count_of: light.alle_lampen
    badge_show_number: true
    cards:
      - type: custom:nova-light-card
        area: wohnzimmer
```

| Option | Bedeutung |
|---|---|
| `items[]` | `icon` (MDI oder Bild-URL), `label`, `tap_action`, `hold_action`, `cards` + `popup_title` |
| `badge` | Punkt, wenn Entität an |
| `badge_count_of` (+ `badge_show_number`, `badge_exclude`) | Zähler für eingeschaltete Gruppenmitglieder |
| `source` | Dock aus einem anderen Dashboard übernehmen (URL-Pfad) |
