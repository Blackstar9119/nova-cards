# Nova Pop-up Card

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

Unter **Kopfzeile & Info-Leiste** Entitäten hinzufügen, z. B. Temperatur, Luftfeuchtigkeit, Fenster, Tür.
Pro Eintrag: Icon (Standard: Icon der Entität), eigener Name, Nachkommastellen. Mit **Bei Achtung hervorheben**
wird der Chip farbig, z. B. wenn ein Fenster offen ist (ohne weitere Angabe bei „an“ bzw. „Problem“).

## Vorlage wählen und Karten einfügen

1. Unter **Layout & Vorlage** eine Vorlage wählen, z. B. „Groß oben, zwei klein darunter“. Sie legt leere Plätze an.
2. Unter **Inhalt** auf einen leeren Platz **Karte hinzufügen** tippen und eine Karte auswählen.
3. Einen Block antippen öffnet darunter seine Einstellungen: Karte bearbeiten (grafisch oder YAML), andere Karte
   wählen, duplizieren, löschen, Spaltenbreite ändern.
4. Blöcke am Griff ziehen, um sie zu verschieben (am PC geht auch der ganze Block). Zwischen zwei Zeilen
   abgelegt, entsteht eine neue Zeile.

Auf schmalen Bildschirmen stehen alle Karten untereinander (einstellbar unter **Allgemein** →
„Untereinander unter Breite“). Die Anordnung im Editor bleibt dabei erhalten.

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
columns: 2
rows:
  - cells:
      - span: 2
        card: {type: weather-forecast, entity: weather.forecast_home}
  - cells:
      - card: {type: custom:nova-light-card, entity: light.wohnzimmer}
      - card: null
```

## Farben

Standard ist der bläuliche Nova-Glas-Look. Unter **Allgemein** → **Farbton** lässt er sich mit einer Nova-Farbrolle
einfärben. Per Theme-Variablen anpassbar: `nova-popup-background`, `nova-popup-base-color`, `nova-popup-header-color`,
`nova-popup-backdrop`, `nova-popup-radius`, `nova-popup-z-index`, Textfarbe über `nova-text-color`.

Passend für Blöcke im Pop-up: die **Nova Info Card** (Überschrift + Zeilen mit Name und Wert oder Schaltern).
