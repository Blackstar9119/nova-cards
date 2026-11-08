# Nova Cards

**Schöne Home-Assistant-Dashboards, ganz ohne YAML.**

Nova Cards ist eine Kartenfamilie für das Home-Assistant-Dashboard: sechzehn Karten mit Glas-Look, die zusammenpassen und sich
gemeinsam ans Theme anpassen. Gedacht für alle, die ein aufgeräumtes, modernes Dashboard wollen, ohne Code zu schreiben oder
YAML zu pflegen.

> **Alles über den grafischen Editor.** Jede Karte hat einen eigenen Editor mit aufklappbaren Bereichen und Live-Vorschau.
> Entitäten, Texte, Icons und Farben stellst du dort ein, vieles erkennt die Karte auch selbst. YAML ist nicht nötig.

<!-- Screenshot: Übersicht aller Karten -->

---

## Installation über HACS

Nova Cards wird als benutzerdefiniertes Repository in [HACS](https://hacs.xyz) eingebunden.

1. In Home Assistant **HACS** öffnen.
2. Oben rechts auf **⋮** tippen und **Benutzerdefinierte Repositories** wählen.
3. Als Repository `https://github.com/Blackstar9119/nova-cards` eintragen und als Typ **Dashboard** auswählen.
4. Auf **Hinzufügen** tippen und das Fenster schließen.
5. In HACS nach **Nova Cards** suchen, öffnen und **Herunterladen** wählen.
6. Die Seite hart neu laden (Strg/Cmd + Umschalt + R), in der App den Cache leeren.

HACS legt die Dashboard-Ressource automatisch an. Danach findest du alle Karten unter **Karte hinzufügen**, wenn du nach
„Nova“ suchst.

---

## Die Karten

### Nova Wetter Card
Zeigt das aktuelle Wetter einer Wetter-Entität mit Icon, Temperatur, Max/Min und Zusatzwerten wie Luftfeuchte, Wind oder
UV-Index. Darunter folgen Tages- und Stundenvorhersage mit Temperaturbalken bzw. -kurve und Regen. Uhr, Datum und ein eigener
Temperatursensor lassen sich dazuschalten.

➜ [Alle Optionen der Wetter Card](docs/weather-card.md)

<!-- Screenshot/GIF: Wetter Card -->

### Nova Müllkalender Card
Liest die nächsten Abholtermine aus einem oder mehreren Kalendern und zeigt sie mit Müllart, Icon, Farbe und „heute“,
„morgen“ oder „in X Tagen“. Steht eine Abholung kurz bevor, leuchtet der Rahmen. Standard-Müllarten lassen sich mit einem
Klick einfügen.

➜ [Alle Optionen der Müllkalender Card](docs/waste-card.md)

<!-- Screenshot: Müllkalender Card -->

### Nova Thermostat Card
Ist- und Solltemperatur mit Plus/Minus, Heizmodi und Presets als Tasten und einem Verlauf der letzten Stunden. Ein eigener
Raumsensor und ein Luftfeuchte-Sensor lassen sich einbinden. Ist ein Fenster offen, warnt die Karte mit einem farbigen Rahmen.

➜ [Alle Optionen der Thermostat Card](docs/thermostat-card.md)

<!-- Screenshot/GIF: Thermostat Card -->

### Nova Raum Card
Eine Raumkachel mit Temperatur oder einem anderen Wert, Fenster-Warnung und frei belegbaren runden Buttons für Licht, TV und
mehr. Sie leuchtet, wenn im Raum etwas an ist, und öffnet auf Wunsch direkt ein Nova Pop-up.

➜ [Alle Optionen der Raum Card](docs/room-card.md)

<!-- Screenshot/GIF: Raum Card -->

### Nova Licht Card
Alle Lampen eines Bereichs oder eine eigene Auswahl als Kacheln. Antippen schaltet, Schieben dimmt, und jede Kachel leuchtet
in der Farbe ihrer Lampe. Farbknöpfe für Lieblingsfarben und ein „Alle aus“-Knopf sind mit dabei.

➜ [Alle Optionen der Licht Card](docs/light-card.md)

<!-- Screenshot/GIF: Licht Card -->

### Nova Navi
Eine schwebende Navigationsleiste am unteren oder oberen Rand, auf breiten Bildschirmen auf Wunsch als Seitenleiste.
Ein Button kann navigieren, eine Aktion auslösen (Antippen, lange drücken, Doppeltippen), ein Untermenü oder ein
Pop-up öffnen. Badges zeigen Punkte oder Zahlen in wählbarer Farbe, Einträge lassen sich je Benutzer oder Zustand
ausblenden, und eine kleine Media-Leiste zeigt den laufenden Player. Früher hieß sie Nova Dock Card – der alte Typ
`custom:nova-dock-card` läuft weiter.

Der Mini-Player erscheint nur, solange etwas läuft, zeigt den spielenden Player und wechselt per Lautsprecher-Knopf das Gerät:

```yaml
type: custom:nova-navi-card
media_players:
  - entity: media_player.wohnzimmer_echo
    name: Wohnzimmer
  - entity: media_player.kuche_echo
    name: Küche
paused_timeout: 10   # Minuten, die ein pausierter Player noch sichtbar bleibt
items:
  - icon: mdi:home
    label: Start
    tap_action:
      action: navigate
      navigation_path: /zuhause/home
```

➜ [Alle Optionen von Nova Navi](docs/navi-card.md)

<!-- Screenshot/GIF: Nova Navi -->

### Nova Modular Card
Eine Gerätekarte zum Selbst-Zusammenbauen aus Bausteinen: Kopfzeile mit Fortschritt, Infos, Schalter, Schieberegler,
Aktionsbuttons und Warnungen. Passt für fast jedes Gerät, vom 3D-Drucker bis zur Waschmaschine.

➜ [Alle Optionen der Modular Card](docs/modular-card.md)

<!-- Screenshot: Modular Card -->

### Nova Kamera Card
Live-Bild einer Kamera oder eines Bildes mit Kopfzeile, rundem Steuerkreuz für schwenkbare Kameras und Splitscreen für
weitere Kameras. Dazu kommen frei belegbare Buttons, Info-Chips und Warnungen direkt im Bild.

➜ [Alle Optionen der Kamera Card](docs/camera-card.md)

<!-- Screenshot/GIF: Kamera Card -->

### Nova Media Card
Ein Media-Player mit dem Cover als Hintergrund, Titel, Interpret und App-Logo. Play/Pause, Vor/Zurück, Lautstärke, Stumm,
Ein/Aus und Quellen sind mit an Bord. Mehrere Player lassen sich umschalten, und die Karte springt auf Wunsch zum Player,
der gerade spielt.

➜ [Alle Optionen der Media Card](docs/media-card.md)

<!-- Screenshot/GIF: Media Card -->

### Nova Saugroboter Card
Status, Akku und Steuerung deines Saugroboters mit einer kleinen Animation von Roboter und Station. Daneben die Raumkarte,
darunter Raumreinigung, Schalter der Station und Verbrauchsteile mit Restlaufzeit. Bei einer Störung steht der konkrete Fehler da,
z. B. „Hauptbürste blockiert“, auch für die Station. Vieles findet die Karte am Gerät selbst.

➜ [Alle Optionen der Saugroboter Card](docs/vacuum-card.md)

<!-- Screenshot/GIF: Saugroboter Card -->

### Nova Pop-up Card
Ein Pop-up mit beliebigen Karten in Zeilen und Spalten, geöffnet über eine Adresse wie `#wohnzimmer`, zum Beispiel von Nova Navi
oder von der Raum Card. Kopfzeile mit Badges und Info-Leiste, auf dem Handy per Wischen schließbar.

Temperatur, Luftfeuchte & Co. stehen als Info-Chips direkt in der Kopfzeile neben dem Titel (oder mit
`info_position: below` in einer eigenen Zeile darunter):

```yaml
type: custom:nova-popup-card
hash: wohnzimmer
title: Wohnzimmer
icon: mdi:sofa
info_position: header
info:
  - entity: sensor.wohnzimmer_temperatur
  - entity: sensor.wohnzimmer_luftfeuchtigkeit
```

➜ [Alle Optionen der Pop-up Card](docs/popup-card.md)

<!-- Screenshot/GIF: Pop-up Card -->

### Nova Bereich Card
Eine Raumansicht als großer Glasrahmen, fest im Dashboard: Kopfzeile mit Zurück-Knopf, Icon und Raumname aus der Area,
rechts daneben auf Wunsch Chips. Darunter beliebige Karten in Zeilen und Spalten wie in der Pop-up Card, auf dem Handy
untereinander. Ideal für Raum-Unteransichten.

➜ [Alle Optionen der Bereich Card](docs/area-card.md)

<!-- Screenshot: Bereich Card -->

### Nova Chips Card
Eine Reihe frei belegbarer Chips: Wert-Chips zeigen den Zustand einer Entität, Knopf-Chips führen eine Aktion aus, zum
Beispiel „Alle Lichter im Raum aus“, eine Szene oder ein Skript. Farbe, Icon und Sichtbarkeit je nach Zustand stellst du
pro Chip ein.

➜ [Alle Optionen der Chips Card](docs/chips-card.md)

<!-- Screenshot: Chips Card -->

### Nova Gerät Card
Eine Karte für Haushaltsgeräte: Waschmaschine, Spülmaschine, Airfryer, Kaffeemaschine, Futterautomat, Trinkbrunnen oder ein
beliebiges anderes Gerät. Status, Programm, Fortschritt, Restzeit und Endzeit, dazu Regler, Start/Pause/Stopp und ein animiertes
Gerätebild, das zeigt, was gerade passiert, samt Hinweisen wie „Wassertank leer“ oder „Filter wechseln“. Kompakt auf Wunsch nur,
solange etwas läuft.

➜ [Alle Optionen der Gerät Card](docs/geraet-card.md)

<!-- Screenshot/GIF: Gerät Card -->

### Nova 3D-Drucker Card
Dein Bambu-Lab-Drucker als animierte Zeichnung mit AMS, Kamerabild, Fortschritt, Restzeit, Temperaturen, Druckphase und
Meldungen, dazu Pause, Fortsetzen, Stopp und Kammerlicht. Gerät auswählen, den Rest findet die Karte selbst.

➜ [Alle Optionen der 3D-Drucker Card](docs/drucker-card.md)

<!-- Screenshot/GIF: 3D-Drucker Card -->

### Nova Fernbedienung
Eine Fernbedienung für Fernseher und Streaming-Boxen: Steuerkreuz oder Touchpad, Zurück/Home/Menü, Medientasten,
Lautstärke und Ein/Aus, dazu App-Kacheln, die die App direkt öffnen und leuchten, solange sie läuft. Erkennt Android TV /
Google TV (z. B. Xiaomi TV Box, Chromecast), Fire TV per ADB, Philips, Apple TV, Roku und Samsung automatisch.

➜ [Alle Optionen der Fernbedienung](docs/remote-card.md)

<!-- Screenshot: Fernbedienung -->

### Nova Uhr Card
Die Uhrzeit in fünf Stilen: schlicht digital, als Klappzahl-Uhr wie am Bahnhof, als Zifferblatt mit gleitendem oder
springendem Sekundenzeiger, als große Leuchtziffern, deren Farbe dem Sonnenstand folgt (morgens warm, mittags weiß,
abends tiefblau), oder als Radiowecker mit LED-Ziffern in Rot, Grün, Blau oder Bernstein. Wochentag, Datum und Werte wie
Temperatur stehen auf Wunsch darunter.

➜ [Alle Optionen der Uhr Card](docs/clock-card.md)

<!-- Screenshot: Uhr Card in allen Stilen -->

### Nova Timer Card
Ein Küchen-Timer als Stoppuhr im Nova-Stil: antippen, Zeit wählen, läuft – gesteuert über einen `timer.*`-Helfer.

➜ [Alle Optionen der Timer Card](docs/timer-card.md)

### Nova Swipe Card
Mehrere Seiten in einer Karte zum Wischen, auf jeder Seite beliebige Karten – ideal für Wandtablets.

➜ [Alle Optionen der Swipe Card](docs/swipe-card.md)

### Nova Einkauf Card
Einkaufsliste aus einer `todo.*`-Entität: eintippen, abhaken, auf Wunsch per Knopf drucken.

➜ [Alle Optionen der Einkauf Card](docs/einkauf-card.md)

### Nova Notiz Card
Ein großes Notizfeld mit Druck-Knopf, Notizen werden in einer todo-Liste gespeichert.

➜ [Alle Optionen der Notiz Card](docs/notiz-card.md)

### Nova Recipe Book
Ein Rezeptbuch wie ein altes, abgegriffenes Kochbuch: Ledereinband, vergilbte Seiten, Handschrift. Antippen schlägt es
auf, Wischen blättert um. Inhaltsverzeichnis, Rezepte mit eingeklebtem Foto, Zutaten und Anleitung, neue Rezepte direkt
in der Karte eintragen – und alle Zutaten mit einem Tipp auf die Einkaufsliste. Die Rezepte speichert die kleine
[Nova-Integration](docs/nova-integration.md) in Home Assistant, damit sie auf allen Geräten gleich sind.

➜ [Alle Optionen des Recipe Book](docs/recipe-book-card.md)

<!-- Screenshot: Recipe Book zugeklappt und aufgeschlagen -->

---

## Lizenz

Nova Cards steht unter der [MIT-Lizenz](LICENSE).
