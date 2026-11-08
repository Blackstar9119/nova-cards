# Nova Recipe Book

[← Zurück zur Übersicht](../README.md)

Ein Rezeptbuch im Stil eines alten, abgegriffenen Kochbuchs: Ledereinband mit Gebrauchsspuren, vergilbte Seiten mit
Flecken, Handschrift. Zugeklappt sieht man den Einband, Antippen schlägt das Buch auf. Gewischt wird wie in einem echten
Buch – nach links blättert vor, nach rechts zurück.

- **Erste Seite:** Inhaltsverzeichnis, jedes Rezept lässt sich antippen.
- **Rezeptseite:** Titel, Foto wie eingeklebt (mit Fotoecken), Zutaten, Anleitung mit nummerierten Schritten.
- **Rezepte einpflegen** direkt in der Karte: „Neues Rezept“ im Inhaltsverzeichnis, unter jedem Rezept „Bearbeiten“ und
  „Löschen“ (fragt einmal nach).
- **Zutaten auf Einkaufsliste:** schreibt alle Zutaten in eine todo-Liste – was dort schon offen steht, nicht doppelt.

Die Rezepte liegen in Home Assistant, nicht im Browser – auf allen Geräten gleich und im Backup. Dafür braucht die Karte
die [Nova-Integration](nova-integration.md). Fehlt sie, steht im Buch, wie man sie einrichtet.

Auf einem breiten Platz (ab 560 px) zeigt das Buch Doppelseiten: links Titel, Foto und Zutaten, rechts die Anleitung.
Schmaler gibt es eine Seite pro Rezept. Schriften und Papier sind in der Karte enthalten – nichts wird aus dem Internet geladen.

## Wenn du einfach nur ein Rezeptbuch willst, dann so

Nova-Integration einrichten, dann Dashboard bearbeiten → Karte hinzufügen → „Nova Recipe Book“.

```yaml
type: custom:nova-recipe-book-card
```

## Wenn die Zutaten auf die Einkaufsliste sollen, dann so

Im Editor unter „Einkaufsliste“ die todo-Liste wählen. Unter jedem Rezept erscheint dann „Zutaten auf Einkaufsliste“.

```yaml
type: custom:nova-recipe-book-card
shopping_list: todo.einkaufsliste
```

## Wenn das Buch an der Wand hängt (z. B. Echo Show), dann so

Als eigene Seite in der [Nova Swipe Card](swipe-card.md) mit „Bis zum unteren Bildschirmrand“. Das Buch füllt den Platz
aus. Mit „Zuklappen nach“ klappt es nach einer Weile ohne Bedienung von selbst wieder zu.

```yaml
type: custom:nova-recipe-book-card
title: Rezepte
subtitle: aus unserer Küche
shopping_list: todo.einkaufsliste
close_after: 300
```

## Alle Optionen

| Option | Standard | Bedeutung |
|---|---|---|
| `title` | `Rezepte` | Titel auf dem Einband (Goldprägung) und im Vorsatz |
| `subtitle` | – | Untertitel in Handschrift, z. B. „von Oma Erna“ |
| `cover_color` | `brown` | Einband: `brown` (Leder), `red` (Bordeaux), `green` (Dunkelgrün), `blue` (Nachtblau) |
| `layout` | `auto` | `auto`, `double` (immer Doppelseite) oder `single` (immer Einzelseite) |
| `start_open` | `false` | Buch beim Laden gleich aufschlagen |
| `close_after` | `0` | Nach so vielen Sekunden ohne Bedienung zuklappen (0 = bleibt offen) |
| `shopping_list` | – | todo-Liste für „Zutaten auf Einkaufsliste“ |

Theme-Variablen: `--nova-book-paper`, `--nova-book-ink`, `--nova-book-gold`, `--nova-book-brown`, `--nova-book-red`,
`--nova-book-green`, `--nova-book-blue`.

## Gut zu wissen

- Bilder werden vor dem Hochladen verkleinert (längste Seite 1600 px) und unter `/config/www/nova-recipes/` abgelegt.
  Wer die Adresse eines Bildes kennt, kann es ohne Anmeldung abrufen – wie alles unter `/local/`.
- Rezepte ändern sich auf allen Geräten sofort mit.
- Blättern geht auch mit den Pfeiltasten. Das rote Lesebändchen unten klappt das Buch zu.
