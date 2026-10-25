# Nova Thermostat Card

[← Zurück zur Übersicht](../README.md)

Ist-/Solltemperatur, ± Stepper, Verlauf, Modi und Presets.

```yaml
type: custom:nova-thermostat-card
entity: climate.wohnzimmer
sensor: sensor.wohnzimmer_temperatur
windows:
  - binary_sensor.wohnzimmer_fenster
show_graph: true
graph_hours: 24
modes: [heat, auto, off]
```

| Option | Standard | Bedeutung |
|---|---|---|
| `entity` | – | Thermostat (Pflicht) |
| `sensor` | – | Genauerer Raumsensor für Anzeige & Verlauf |
| `humidity` | – | Luftfeuchte-Sensor |
| `show_graph` / `graph_hours` | `true` / `24` | Verlauf |
| `show_modes` / `modes` | `true` / alle | Modus-Knöpfe |
| `show_presets` | `false` | Preset-Knöpfe |
| `compact` | `true` | Kompaktes Layout |
| `step` | vom Gerät | Schrittweite ± |
