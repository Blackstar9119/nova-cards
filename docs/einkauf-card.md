# Nova Einkauf Card

[← Zurück zur Übersicht](../README.md)

Einkaufsliste aus einer `todo.*`-Entität (z. B. die Einkaufsliste von Home Assistant). Neue Sachen tippt man direkt in
die Karte – Enter oder der Plus-Knopf fügt sie hinzu. Darunter stehen die offenen Punkte; Antippen hakt sie ab (kurz
durchgestrichen, dann verschwinden sie). Unten sitzt ein Druck-Knopf, der ein Skript aufruft, z. B. um die Liste auf einem
Bondrucker auszugeben. Der Knopf zeigt, ob der Druck geklappt hat: kurz grün mit Häkchen, bei einem Fehler rot.

Die Karte ist in allen Zuständen gleich hoch: Die Liste hat eine feste Mindesthöhe und scrollt bei vielen Einträgen. In
einem Raster (Bereich, Pop-up, Abschnitte) füllt sie den verfügbaren Platz aus.

```yaml
type: custom:nova-shopping-card
entity: todo.einkaufsliste
print_script: script.einkaufsliste_drucken
print_style: pill            # pill (länglich mit Text) | round (klein und rund)
```

| Option | Standard | Bedeutung |
|---|---|---|
| `entity` | – | Die Liste (`todo.*`, Pflicht) |
| `name`, `icon` | Name der Liste, `mdi:cart-outline` | Kopfzeile; Antippen des Icons öffnet die Details der Liste |
| `show_header` | `true` | Kopfzeile mit „N offen“ |
| `placeholder` | `Neuer Eintrag …` | Platzhalter im Eingabefeld |
| `show_completed` | `false` | Erledigte Einträge durchgestrichen unten zeigen; Antippen holt sie zurück |
| `height` | `200` | Mindesthöhe der Liste in px |
| `print_script` | – | Skript für den Druck-Knopf (leer = kein Knopf). Der Knopf ist aus, solange die Liste leer ist |
| `print_label`, `print_icon` | `Drucken`, `mdi:printer-pos` | Beschriftung und Icon des Knopfs |
| `print_style` | `pill` | `pill` = länglich mit Text, `round` = klein und rund |

Die Erfolgsfarbe kommt aus dem Theme: `--nova-success-color`, sonst `--nova-accent-4`.

## Druck-Skript

Die Karte ruft das Skript als Dienst `script.<name>` auf und wartet, bis es fertig ist – ein Fehler im Skript (Drucker aus,
Papier leer) wird deshalb als roter Knopf angezeigt. Beispiel für einen ESC/POS-Bondrucker mit der Integration
„ESC/POS Thermal Printer“:

```yaml
alias: Einkaufsliste drucken
mode: single
sequence:
  - if:
      - condition: numeric_state
        entity_id: todo.einkaufsliste
        below: 1
    then:
      - stop: Einkaufsliste ist leer
  - action: todo.get_items
    target: {entity_id: todo.einkaufsliste}
    data: {status: needs_action}
    response_variable: liste
  - action: escpos_printer.print_text_utf8
    target: {entity_id: notify.mein_bondrucker}
    data: {text: "EINKAUFSLISTE\n", align: center, bold: true, width: double, height: double, cut: none}
  - action: escpos_printer.print_text_utf8
    target: {entity_id: notify.mein_bondrucker}
    data: {text: "--------------------------------\n", align: center, cut: none}
  - action: escpos_printer.print_text_utf8
    target: {entity_id: notify.mein_bondrucker}
    data:
      text: "{% for i in liste['todo.einkaufsliste']['items'] %}[ ] {{ i.summary }}\n{% endfor %}"
      align: left
      cut: none
      feed: 2                # Templates schneiden das \n am Ende ab
  - action: escpos_printer.print_text_utf8
    target: {entity_id: notify.mein_bondrucker}
    data: {text: "{{ now().strftime('%d.%m.%Y %H:%M') }}", align: center, feed: 2, cut: partial}
```
