# Nova Pop-up Card

[← Zurück zur Übersicht](../README.md)

Ein Pop-up mit beliebigen Karten (Nova-Karten, HA-Karten, andere Custom Cards). Es öffnet sich, wenn die Adresse auf
`#hash` endet, z. B. `#wohnzimmer`. Alles lässt sich im grafischen Editor einstellen.

## Pop-up anlegen

1. Dashboard bearbeiten → **Karte hinzufügen** → **Nova Pop-up Card**.
2. Unter **Allgemein** einen **Hash** vergeben, z. B. `wohnzimmer` (ohne `#`), dazu Titel und Icon. Der Titel steht
   oben im Pop-up und in den Auswahllisten. Ohne Titel bleibt die Kopfzeile leer, in Listen erscheint dann der Hash.
3. Die Karte selbst ist im Dashboard unsichtbar. Im Bearbeitungsmodus zeigt sie nur einen kleinen Platzhalter mit
   dem Titel, im Karteneditor erscheint das Pop-up live in der Vorschau. Am besten ganz ans Ende der Ansicht legen.

## Öffnen

- **Über das Dock:** Im Dock-Editor beim Button unter **Nova Pop-up öffnen** das Pop-up aus der Liste wählen
  (angezeigt mit seinem Titel). Das Dock findet Pop-ups im ganzen Dashboard und öffnet sie in jeder Ansicht.
  „Einfaches Pop-up“ im Dock ist das alte, schlichte Pop-up mit einer YAML-Kartenliste.
- **Über die Raum-Karte:** Im Editor der Nova Room Card unter **Beim Antippen Nova Pop-up öffnen** das Pop-up wählen.
- **Über jede andere Karte:** Aktion „Navigieren“ mit dem Pfad `#wohnzimmer`. Dafür muss die Pop-up Card in
  derselben Ansicht liegen.

Schließen: X oben rechts, Tipp auf den dunklen Hintergrund, nach unten wischen (Handy), Zurück-Taste oder Esc.

## Kopfzeile & Info-Leiste

**Badges** sitzen in der Kopfzeile rechts neben dem Titel. Pro Badge: Entität, eigener Name, Icon, Zustand anzeigen
ja/nein, Farbe (Nova-Farbrolle) und optional „Nur anzeigen bei Zustand“ (z. B. `on` für ein offenes Fenster).
Auf schmalen Bildschirmen zeigen Badges nur Icon und Zustand und scrollen bei Platzmangel, Titel und X bleiben frei.

Unter **Kopfzeile & Info-Leiste** Entitäten hinzufügen, z. B. Temperatur, Luftfeuchtigkeit, Fenster, Tür.
Pro Eintrag: Icon (Standard: Icon der Entität), eigener Name, Nachkommastellen. Mit **Bei Achtung hervorheben**
wird der Chip farbig, z. B. wenn ein Fenster offen ist (ohne weitere Angabe bei „an“ bzw. „Problem“).

## Vorlage wählen und Karten einfügen

1. Unter **Layout & Vorlage** eine Vorlage wählen, z. B. „Groß oben, zwei klein darunter“. Sie legt leere Plätze an.
2. Unter **Inhalt** steht jede Zeile als eigener Block („Zeile 1“, „Zeile 2“ …). **Spalte hinzufügen** setzt eine
   weitere Karte neben die vorhandenen in dieselbe Zeile, **Zeile hinzufügen** ganz unten legt eine neue Zeile an.
3. Einen leeren Platz (**Karte wählen**) antippen: Die Kartenauswahl von HA öffnet sich in einem eigenen Fenster
   (mit Suche und Vorschaubildern). Nach der Auswahl schließt es sich und die Karte sitzt im Platz. Auch
   **Spalte hinzufügen** und **Zeile hinzufügen** öffnen das Fenster; Schließen oder **Abbrechen** ändert nichts.
4. Einen Block antippen öffnet darunter seine Einstellungen: **Breite** (Auto, 1/4, 1/3, 1/2, 2/3, 3/4, Voll),
   nach links/rechts verschieben, Karte bearbeiten (grafisch oder YAML), andere Karte wählen, duplizieren, löschen.
   „Auto“ teilt sich den freien Platz mit den anderen Spalten der Zeile.
5. Zeilen lassen sich über die Pfeile neben „Zeile N“ verschieben oder löschen. Blöcke am Griff ziehen, um sie zu
   verschieben (am PC geht auch der ganze Block). Zwischen zwei Zeilen abgelegt, entsteht eine neue Zeile.

Auf schmalen Bildschirmen stehen alle Karten untereinander (einstellbar unter **Allgemein** →
„Untereinander unter Breite“). Wird eine Zeile sonst zu eng, rutschen Spalten von selbst in die nächste Reihe.

## Beispiel-YAML

```yaml
type: custom:nova-popup-card
hash: wohnzimmer
title: Wohnzimmer
icon: mdi:sofa
info:
  - entity: sensor.wohnzimmer_temperatur
  - entity: binary_sensor.wohnzimmer_fenster
    name: Fenster
    alert: true
    alert_color: accent-2
rows:
  - cells:
      - card: {type: weather-forecast, entity: weather.forecast_home}
  - cells:
      - width: 2/3
        card: {type: custom:nova-light-card, entity: light.wohnzimmer}
      - card: null
```

## Farben

Standard ist der bläuliche Nova-Glas-Look. Unter **Allgemein** → **Farbton** lässt er sich mit einer Nova-Farbrolle
einfärben. Per Theme-Variablen anpassbar: `nova-popup-background`, `nova-popup-base-color`, `nova-popup-header-color`,
`nova-popup-backdrop`, `nova-popup-radius`, `nova-popup-z-index`, Textfarbe über `nova-text-color`.

Passend für Blöcke im Pop-up: die **Nova Info Card** (Überschrift + Zeilen mit Name und Wert oder Schaltern).
