# Nova Rezeptbuch

[← Zurück zur Übersicht](../README.md)

Ein Kochbuch zum Blättern. Zugeklappt sieht man den Einband, Antippen schlägt das Buch auf, gewischt wird wie in einem echten
Buch – nach links blättert vor, nach rechts zurück (oder Pfeiltasten). Das Lesebändchen unten klappt es wieder zu.
Die Rezepte kommen aus der [Nova-Integration](https://github.com/Blackstar9119/nova-integration) (Modul „Rezeptbuch“) –
dieselben wie in der [Nova Rezeptliste](rezept-card.md).

- **Erste Seite:** Inhaltsverzeichnis (nach dem Alphabet), jedes Rezept lässt sich antippen.
- **Rezeptseite:** Titel, Zeit und Schlagwörter, Foto, Zutaten, Zubereitung in nummerierten Schritten (jeder Absatz bzw.
  Listenpunkt ist ein Schritt, Fett/Farben bleiben).
- **Portionen umrechnen:** + / – neben „Zutaten“. Gilt, bis das Buch zugeklappt wird, das Rezept selbst ändert sich nicht.
- **Zutaten auf die Einkaufsliste:** setzt alle Zutaten für die gewählten Portionen auf die Nova-Einkaufsliste; was dort
  schon offen steht, wird in der Menge erhöht.
- **Rezepte einpflegen** direkt im Buch: „Neues Rezept“ im Inhaltsverzeichnis, unter jedem Rezept „Bearbeiten“ und
  „Löschen“ (fragt einmal nach). Zutaten eine pro Zeile, Menge und Einheit vorn („250 g Mehl“).

Auf breitem Platz (ab 560 px) zeigt das Buch Doppelseiten: links Titel, Foto und Zutaten, rechts die Zubereitung.
Schmaler gibt es eine Seite pro Rezept.

## Stile

| `style` | Aussehen |
|---|---|
| `old` (Standard) | Altes, abgegriffenes Kochbuch: Ledereinband mit Goldprägung, vergilbte Seiten mit Flecken, Handschrift, eingeklebte Fotos |
| `modern` | Schlicht und grau: Leineneinband, glattes Papier, klare Schrift, ohne Gebrauchsspuren |
| `fantasy` | Zauberbuch: dunkles Leder mit Goldbeschlägen und glimmendem Siegel, Pergament, Kapitälchen, römische Schrittnummern |

`cover_color` (`brown`, `red`, `green`, `blue`) tönt den Einband passend zum Stil.

```yaml
type: custom:nova-recipe-book-card
style: fantasy
cover_color: red
subtitle: Tränke & Speisen
```

## Alle Optionen

| Option | Standard | Bedeutung |
|---|---|---|
| `title` | `Rezepte` | Titel auf dem Einband und im Vorsatz |
| `subtitle` | – | Untertitel, z. B. „von Oma Erna“ |
| `style` | `old` | `old`, `modern` oder `fantasy` |
| `cover_color` | `brown` | `brown`, `red`, `green`, `blue` |
| `layout` | `auto` | `auto`, `double` (immer Doppelseite) oder `single` (immer Einzelseite) |
| `start_open` | `false` | Buch beim Laden gleich aufschlagen |
| `close_after` | `0` | Nach so vielen Sekunden ohne Bedienung zuklappen (0 = bleibt offen) |

Wer am Wandpanel hängt (z. B. Echo Show): als eigene Seite in der [Nova Swipe Card](swipe-card.md) mit „Bis zum unteren
Bildschirmrand“ und `close_after: 300`.

## Gut zu wissen

- Schriften (Caveat, EB Garamond) liefert die Nova-Integration aus Home Assistant selbst aus, erst wenn das Buch zu sehen
  ist – nichts wird aus dem Internet geladen. Ältere Integrationen ohne Schriften: dann nimmt das Buch Ersatzschriften.
- Bilder werden vor dem Hochladen verkleinert (längste Seite 960 px).
- Theme-Variablen für das Old Book: `--nova-book-paper`, `--nova-book-ink`, `--nova-book-gold`, `--nova-book-brown`,
  `--nova-book-red`, `--nova-book-green`, `--nova-book-blue`.
- Umstieg vom ersten Rezeptbuch (`shopping_list` mit todo-Liste): die Option entfällt, die Zutaten gehen jetzt in die
  Nova-Einkaufsliste. Rezepte aus der alten Integration werden nicht übernommen.
