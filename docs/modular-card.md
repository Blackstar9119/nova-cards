# Nova Modular Card

[← Zurück zur Übersicht](../README.md)

Gerätekarte aus frei kombinierbaren Bausteinen – z. B. Futterautomat, Airfryer, Katzenklo. Im Editor Bausteine hinzufügen, sortieren und löschen.

```yaml
type: custom:nova-modular-card
blocks:
  - type: header
    name: Airfryer
    icon: mdi:chef-hat
    status: sensor.airfryer_kochstatus
    progress: sensor.airfryer_fortschritt
    button_icon: mdi:cog
    button_action:
      action: more-info
  - type: alerts
    alerts:
      - entity: binary_sensor.futterautomat_food_level
        message: Futterstand niedrig
      - entity: sensor.airfryer_fehlercode
        state_not: "0"
        level: error
  - type: info
    entities:
      - entity: sensor.airfryer_verbleibende_zeit
        name: Verbleibend
      - entity: sensor.futterautomat_dispensed
        decimals: 0
        unit: g
  - type: entities
    columns: 2
    entities:
      - switch.airfryer_stromversorgung
  - type: sliders
    entities:
      - entity: number.airfryer_temperatur
      - entity: number.airfryer_kochzeit
        format: duration
  - type: buttons
    layout: grid
    buttons:
      - entity: button.airfryer_start
        name: Start
        icon: mdi:play
      - name: Reinigung erledigt
        icon: mdi:check-circle
        confirm: Wirklich erledigt?
        tap_action:
          action: perform-action
          perform_action: script.turn_on
          target:
            entity_id: script.katzenklo_reinigung_bestaetigen
```

| Baustein | Optionen |
|---|---|
| `header` | `name`, `icon`, `status` (Text + an/aus), `active` (statt `status` für an/aus), `progress` (%-Balken), `tap_action`, `button_icon` + `button_action` (Touch-Button oben rechts) |
| `info` | `entities[]`: `entity`, `name`, `icon`, `unit`, `decimals`, `tap_action` · `layout: rows\|chips`, `columns` |
| `entities` | `entities[]`: `entity`, `name`, `icon`, `tap_action`, `hold_action`, `confirm` · `columns`. Standard: schalten, sonst more-info |
| `sliders` | `entities[]`: `entity` (number, input_number, light, fan, cover, media_player, climate, water_heater), `name`, `icon`, `min`/`max`/`step`, `unit`, `format: duration` (Minuten → Std:Min) |
| `buttons` | `buttons[]`: `name`, `icon`, `entity` (button/script/scene werden ausgelöst) oder `tap_action`, `confirm` · `layout: pills\|grid` |
| `alerts` | `alerts[]`: `entity`, `state` / `state_not` (Komma-Liste), `above` / `below`, `message` (`{state}` wird ersetzt), `icon`, `level: warning\|error\|info` · `layout: list\|chips`, `glow` (Kartenrahmen, Standard `true`) |

Alle Bausteine außer `header` haben optional `title`. Einträge dürfen auch als Kurzform `- sensor.xyz` angegeben werden.
