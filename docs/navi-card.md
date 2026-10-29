# Nova Navi

[← Zurück zur Übersicht](../README.md)

Navigationsleiste mit runden Buttons, schwebend am unteren oder oberen Rand, auf breiten Bildschirmen auf Wunsch als
Seitenleiste. Ein Button kann navigieren, eine Aktion auslösen, ein kleines Untermenü oder ein Pop-up öffnen. Badges
zeigen Punkte oder Zahlen, eine Media-Leiste über der Navigation den laufenden Player. Alles ist im grafischen Editor
einstellbar.

> Früher hieß die Karte **Nova Dock Card** (`custom:nova-dock-card`). Der alte Typ funktioniert weiter, im Editor steht
> sie jetzt als **Nova Navi**. Zum Umstellen in der Konfiguration nur `type` ändern.

```yaml
type: custom:nova-navi-card
position: bottom          # oder top (Handy, schmale Bildschirme)
sidebar: left             # optional: ab sidebar_min_width als Seitenleiste links/rechts
sidebar_min_width: 1024
button_size: 48
haptic: true
media_players:
  - media_player.wohnzimmer
items:
  - icon: mdi:home
    label: Übersicht
    tap_action:
      action: navigate
      navigation_path: /wandpanel/home
    double_tap_action:
      action: perform-action
      perform_action: script.alles_aus
  - icon: mdi:dots-horizontal
    label: Mehr
    menu:
      - icon: mdi:cat
        label: Katzen
        tap_action:
          action: navigate
          navigation_path: /wandpanel/katzen
      - icon: mdi:fishbowl-outline
        label: Aquarien
        tap_action:
          action: navigate
          navigation_path: /wandpanel/aquarium
  - icon: mdi:lightbulb-group
    popup_title: Licht
    badge_count_of: light.alle_lampen
    badge_show_number: true
    cards:
      - type: custom:nova-light-card
        area: wohnzimmer
  - icon: mdi:shield-account
    label: Admin
    visible_users: [abc123]           # Benutzer-ID, im Editor per Liste
  - icon: mdi:window-open-variant
    label: Fenster
    badge: sensor.offene_fenster_anzahl
    badge_show_number: true
    badge_alert_color: accent-1
    badge_alert_above: 2
```

## Leiste

| Option | Standard | Bedeutung |
|---|---|---|
| `position` | `bottom` | `bottom` oder `top` – gilt auf dem Handy und überall, wo keine Seitenleiste gezeigt wird |
| `sidebar` | – | `left` oder `right`: auf breiten Bildschirmen senkrecht am Rand |
| `sidebar_min_width` | `1024` | Ab dieser Fensterbreite (px) gilt die Seitenleiste |
| `button_size` | `48` | Größe der Buttons in px |
| `active_color` | `accent-2` | Farbrolle des aktiven Buttons (Standard gelb) |
| `active_label` | an | Aktiver Button wird breiter und zeigt rechts neben dem Icon seinen Namen (nicht in der Seitenleiste) |
| `haptic` | aus | Kurzes Vibrieren beim Antippen (HA-App, Android-Browser, Fully Kiosk) |
| `source` | – | Einträge aus einem anderen Dashboard übernehmen (URL-Pfad), z. B. für mehrere Ansichten mit gleicher Leiste |

## Media-Leiste

| Option | Standard | Bedeutung |
|---|---|---|
| `media_players` | – | Liste von Media-Playern. Gezeigt wird der, der gerade spielt, sonst ein pausierter. Antippen des Titels öffnet den Player, rechts Play/Pause |
| `media_always` | aus | Auch zeigen, wenn nichts läuft (dann der erste Player) |

In der Seitenleiste ist die Media-Leiste ein kompakter Knopf mit Cover und Play/Pause.

## Einträge (`items[]`)

| Option | Bedeutung |
|---|---|
| `icon`, `label` | Icon (MDI oder Bild-URL) und Name (Tooltip) |
| `tap_action`, `hold_action`, `double_tap_action` | Aktionen wie bei HA-Karten. Mit Doppeltippen wartet ein einfaches Antippen kurz auf den zweiten Tipp |
| `popup_hash` | Öffnet die [Nova Pop-up Card](popup-card.md) mit diesem Hash. Hat Vorrang vor allem anderen |
| `menu[]` | Untermenü: Antippen öffnet ein kleines Menü mit diesen Einträgen (`icon`, `label`, `tap_action`, `popup_hash`, `hold_action`, `double_tap_action`, Sichtbarkeit) |
| `cards` + `popup_title` | Einfaches Pop-up mit diesen Karten |
| `visible_users` | Nur für diese Benutzer (IDs). Leer = alle |
| `visible_entity` | Nur zeigen abhängig von dieser Entität. Ohne Bedingung: wenn sie an ist |
| `visible_state`, `visible_state_not`, `visible_above`, `visible_below` | Bedingung dazu (Zustand ist / ist nicht, Wert über / unter) |
| `badge` | Punkt, wenn die Entität an ist; mit `badge_show_number` ihr Zahlenwert |
| `badge_count_of` (+ `badge_show_number`, `badge_exclude`) | Zähler für eingeschaltete Gruppenmitglieder |
| `badge_color` | Farbrolle des Badges (`neutral`, `accent-1` … `accent-4`), leer = Akzentfarbe |
| `badge_alert_color` + `badge_alert_state` / `_state_not` / `_above` / `_below` | Andere Farbrolle, wenn die Bedingung auf die Badge-Entität zutrifft |

## Aktiver Eintrag

Markiert ist der Eintrag, dessen `navigation_path` genau dem aktuellen Pfad entspricht (ein `/` am Ende ist egal).
Liegt der Pfad in einem Untermenü, ist dessen Button markiert und zeigt den Namen des Menü-Eintrags.
Der aktive Button ist gelb (`active_color`) und zeigt rechts neben dem Icon seinen Namen (`active_label`). Die Markierung wird bei jedem Wechsel der Ansicht neu
berechnet.
