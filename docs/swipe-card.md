# Nova Swipe Card

[← Zurück zur Übersicht](../README.md)

Mehrere Seiten in einer Karte – zum Wischen nach links und rechts. Auf jeder Seite liegen beliebige Karten (Nova Cards oder
Karten von Home Assistant) in Zeilen und Spalten, genau wie in der Pop-up Card. Unten zeigen kleine Punkte, auf welcher Seite
du bist; antippen springt direkt hin.

Gedacht für kleine Displays wie den Echo Show 5: statt alles auf eine Seite zu quetschen, verteilst du es auf zwei oder drei.

## Wenn du zum ersten Mal Seiten zum Wischen willst, dann so

1. Dashboard bearbeiten → Karte hinzufügen → „Nova Swipe Card“. Es sind schon zwei leere Seiten da.
2. Im Editor unter **Seiten** eine Seite antippen. Die Vorschau springt mit.
3. Unter **Aufteilung** eine Vorlage wählen (z. B. „Zwei nebeneinander“) und unter **Karten** die leeren Plätze antippen –
   es öffnet sich die normale Kartenauswahl von Home Assistant.
4. Weitere Seiten mit „Seite hinzufügen“. Sortieren geht am Griff links oder mit den Pfeilen.

```yaml
type: custom:nova-swipe-card
pages:
  - name: Küche
    rows:
      - cells:
          - card:
              type: custom:nova-clock-card
          - card:
              type: custom:nova-light-card
  - name: Timer
    rows:
      - cells:
          - card:
              type: custom:nova-timer-card
              entity: timer.kuche_timer
```

## Wenn die Karte ein Wand-Display ganz ausfüllen soll, dann so

„Ganze Höhe ausfüllen“ (`fill: true`) macht die Karte so hoch wie ihren Platz, und die Karten einer Seite strecken sich auf
diese Höhe. Damit das klappt, braucht die Karte einen Platz mit fester Höhe – z. B. eine Ansicht vom Typ „Panel“ oder ein
Raster-Layout mit `height: 100dvh`. Passt der Inhalt einer Seite trotzdem nicht, scrollt nur diese Seite.

```yaml
type: custom:nova-swipe-card
fill: true
stack_below: 600
pages: …
```

## Wenn unten etwas abgeschnitten wird (z. B. Echo Show), dann so

Manche Browser melden die Bildschirmhöhe falsch, dann ist „100vh“ höher als das, was man sieht. „Bis zum unteren
Bildschirmrand“ (`fit_screen: true`) misst das sichtbare Fenster direkt und lässt die Karte genau dort enden. Das schließt
„Ganze Höhe ausfüllen“ mit ein.

```yaml
type: custom:nova-swipe-card
fit_screen: true
pages: …
```

## Wenn das Display nach einer Weile wieder die erste Seite zeigen soll, dann so

„Zurück zu Seite 1 nach“ auf z. B. 120 Sekunden stellen. Jede Berührung startet die Zeit neu. 0 = aus (Standard).

```yaml
type: custom:nova-swipe-card
reset_after: 120
pages: …
```

## So bedienst du die Karte

| Was | Wie |
|---|---|
| Nächste / vorige Seite | Wischen nach links bzw. rechts |
| Direkt zu einer Seite | Punkt unten antippen (am PC auch Pfeiltasten auf den Punkten) |
| Schieberegler bedienen | Einfach ziehen – beginnt die Berührung auf einem Regler, wischt die Karte nicht mit |

## Alle Optionen

| Option | Standard | Bedeutung |
|---|---|---|
| `pages` | zwei leere Seiten | Liste der Seiten, jede mit `rows` (wie in der Pop-up Card), optional `name` und `icon` |
| `pages[].rows[].cells[]` | – | `card` (beliebige Karte) und optional `width`: `1/4`, `1/3`, `1/2`, `2/3`, `3/4`, `1` |
| `dots` | `true` | Seiten-Punkte unten (bei nur einer Seite immer aus) |
| `fill` | `false` | Ganze Höhe des Platzes ausfüllen, Karten einer Seite teilen sich die Höhe |
| `fit_screen` | `false` | Karte endet am unteren Rand des sichtbaren Fensters (für Wand-Displays, gegen Abschneiden) |
| `reset_after` | `0` | Sekunden ohne Bedienung, danach zurück zu Seite 1. `0` = aus |
| `stack_below` | `500` | Schmaler als so viele Pixel → Karten einer Seite untereinander (z. B. am Handy). `0` = nie |
| `equal_height` | `false` | Karten einer Zeile gleich hoch |

Theme-Variable: `--nova-swipe-gap` – Abstand zwischen den Karten einer Seite (Standard 8px). Die Farbe des aktiven Punkts
kommt aus dem Theme (`--nova-active-color`, Standard Nova-Blau).

## Gut zu wissen

- Gewischt wird mit dem eingebauten Scrollen des Browsers. Das läuft auch auf schwachen Geräten (Echo Show, ältere Tablets) flüssig
  und braucht keinen Zeitgeber.
- Alle Seiten sind geladen, auch die gerade nicht sichtbaren. Viele Kamera-Streams auf versteckten Seiten kosten also trotzdem Leistung.
