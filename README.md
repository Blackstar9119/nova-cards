# Nova Cards

**Schöne Home-Assistant-Dashboards, ganz ohne YAML.**

Nova Cards ist eine Kartenfamilie für das Home-Assistant-Dashboard: zwölf Karten mit Glas-Look, die zusammenpassen und sich
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

> **Beta:** Solange Nova Cards in der Beta ist, in HACS bei Nova Cards über **⋮ → Neu herunterladen** den Schalter
> **Beta-Versionen anzeigen** aktivieren und dann die neueste Version wählen.

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

### Nova Info Card
Eine Überschrift mit beliebig vielen Zeilen: links der Name, rechts der Wert, so wie Home Assistant ihn formatiert.
Zeilen können auch Schalter sein, dann schaltet Antippen die Entität. Ideal für kleine Übersichten im Pop-up.

➜ [Alle Optionen der Info Card](docs/info-card.md)

<!-- Screenshot: Info Card -->

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

### Nova Dock Card
Eine schwebende Leiste mit Buttons am unteren oder oberen Rand. Ein Button kann navigieren, eine Aktion auslösen oder ein
Pop-up öffnen. Punkte oder Zahlen zeigen an, ob zum Beispiel noch Lampen an sind.

➜ [Alle Optionen der Dock Card](docs/dock-card.md)

<!-- Screenshot/GIF: Dock Card -->

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
darunter Raumreinigung, Schalter der Station und Verbrauchsteile mit Restlaufzeit. Vieles findet die Karte am Gerät selbst.

➜ [Alle Optionen der Saugroboter Card](docs/vacuum-card.md)

<!-- Screenshot/GIF: Saugroboter Card -->

### Nova Pop-up Card
Ein Pop-up mit beliebigen Karten in Zeilen und Spalten, geöffnet über eine Adresse wie `#wohnzimmer`, zum Beispiel vom Dock
oder von der Raum Card. Kopfzeile mit Badges und Info-Leiste, auf dem Handy per Wischen schließbar.

➜ [Alle Optionen der Pop-up Card](docs/popup-card.md)

<!-- Screenshot/GIF: Pop-up Card -->

---

## Lizenz

Nova Cards steht unter der [MIT-Lizenz](LICENSE).
