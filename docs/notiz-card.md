# Nova Notiz Card

[← Zurück zur Übersicht](../README.md)

Notizen, die auf allen Geräten gleich sind. Die Daten liegen in der
[Nova-Integration](https://github.com/Blackstar9119/nova-integration) (Modul „Notizen“) – ohne sie zeigt die Karte nur einen Hinweis.

- **Liste:** angepinnte Notizen oben, darunter die zuletzt geänderten; je Notiz Titel, Vorschau und „zuletzt geändert“.
- **Notiz öffnen:** antippen. Titel und Text lassen sich direkt bearbeiten, gespeichert wird automatisch kurz nach dem Tippen.
  Oben: Zurück, Stand („Gespeichert“, „Geändert vor 5 Min.“), Anpinnen, Drucken, Löschen (zweimal tippen).
- **Formatierung** über die Leiste (seitlich wischbar): Fett, Kursiv, Unterstrichen, Durchgestrichen, Schriftgröße (klein,
  normal, groß, Überschrift), Aufzählung, Checkliste (Kästchen antippen = abhaken) und drei Textfarben aus dem Theme
  (Akzent, Wichtig, Gedämpft). Ohne Markierung gilt Größe und Farbe für das Wort unter dem Cursor.
- **Neue Notiz:** Plus oben rechts. Leere Notizen werden nicht angelegt.

Die Karte ist in allen Zuständen gleich hoch; Liste und Notiz scrollen in sich.

```yaml
type: custom:nova-note-card
view: full                    # full | compact
max_notes: 5
print_script: script.notiz_drucken
```

| Option | Standard | Bedeutung |
|---|---|---|
| `name`, `icon` | `Notizen`, `mdi:note-multiple-outline` | Kopfzeile |
| `show_header` | `true` | Kopfzeile mit Anzahl und Plus-Knopf |
| `view` | `full` | `full` = Titel, Vorschau, Datum · `compact` = nur Titel und Datum. Ohne Angabe gilt die Nova-Einstellung „Kompakte Liste“ |
| `text_size` | `normal` | Schriftgröße der Notiz: `klein`, `normal`, `gross`. Ohne Angabe gilt die Nova-Einstellung |
| `max_notes` | `0` | Höchstens so viele Notizen zeigen, der Rest lässt sich aufklappen (0 = alle) |
| `height` | `380` | Mindesthöhe in px; im Raster füllt die Karte den Platz aus |
| `print_script` | – | Skript für den Druck-Knopf in der geöffneten Notiz (leer = kein Knopf) |
| `print_field` | `text` | Feldname, unter dem das Skript Titel und Text bekommt |
| `print_label`, `print_icon` | `Drucken`, `mdi:printer-pos` | Titel und Icon des Knopfs |

## Drucken

Bondrucker können kein HTML – die Karte gibt deshalb Klartext weiter: Titel, Leerzeile, Text. Überschriften stehen in
GROSSBUCHSTABEN, Aufzählungen mit `•`, Checklisten mit `[ ]` und `[x]`. Farben und Schriftgrößen fallen weg.

```yaml
alias: Notiz drucken
mode: queued
fields:
  text:
    selector: {text: {multiline: true}}
sequence:
  - action: escpos_printer.print_text_utf8
    target: {entity_id: notify.mein_bondrucker}
    data: {text: "{{ text }}", align: left, feed: 3, cut: partial}
```

## Sicherheit

Gespeichert wird bereinigtes HTML aus einer festen Liste von Elementen (`b`, `i`, `u`, `s`, `p`, `br`, `h3`, `ul`, `li`,
`span` mit festen Klassen). Alles andere – Skripte, Links, Bilder, Attribute – wird in der Karte **und** in der Integration
entfernt. Eingefügter Text kommt immer als reiner Text an.

## Umstieg von der alten Karte

Bis 0.11 war die Karte ein einzelnes Textfeld, gespeicherte Notizen lagen in einer todo-Liste (`notes_entity`). Diese
Optionen gibt es nicht mehr: `placeholder`, `show_clear`, `clear_after_print`, `clear_after_save`, `notes_entity`,
`notes_height`, `storage_key`, `print_style`. Notizen aus der todo-Liste werden nicht automatisch übernommen.
