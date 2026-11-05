# Nova Notiz Card

[← Zurück zur Übersicht](../README.md)

Ein großes, mehrzeiliges Notizfeld mit Druck-Knopf. Der Knopf gibt den Text an ein Skript weiter (z. B. für einen
Bondrucker), zeigt kurz grün mit Häkchen bzw. rot bei einem Fehler und leert das Feld nach erfolgreichem Druck.
Strg/Cmd + Enter druckt ebenfalls. Der Entwurf bleibt im Browser gespeichert, bis er gedruckt oder geleert wird – ein
Neuladen der Seite verliert also nichts.

Die Karte ist in allen Zuständen gleich hoch; in einem Raster füllt das Textfeld den verfügbaren Platz aus.

```yaml
type: custom:nova-note-card
print_script: script.notiz_drucken
print_field: text            # unter diesem Namen bekommt das Skript den Text
```

| Option | Standard | Bedeutung |
|---|---|---|
| `name`, `icon` | `Notiz`, `mdi:note-edit-outline` | Kopfzeile |
| `show_header` | `true` | Kopfzeile anzeigen |
| `placeholder` | `Notiz schreiben …` | Platzhalter im Textfeld |
| `height` | `180` | Mindesthöhe des Textfelds in px |
| `show_clear` | `true` | Knopf „Leeren“ (Radiergummi) |
| `print_script` | – | Skript für den Druck-Knopf (leer = kein Knopf) |
| `print_field` | `text` | Feldname, unter dem das Skript den Text bekommt |
| `clear_after_print` | `true` | Feld nach erfolgreichem Druck leeren |
| `print_label`, `print_icon` | `Drucken`, `mdi:printer-pos` | Beschriftung und Icon des Knopfs |
| `print_style` | `pill` | `pill` = länglich mit Text, `round` = klein und rund |
| `storage_key` | Skript + Name | Eigener Schlüssel für den gespeicherten Entwurf, falls mehrere Notizkarten dasselbe Skript nutzen |

## Druck-Skript

Beispiel für einen ESC/POS-Bondrucker (80 mm) mit der Integration „ESC/POS Thermal Printer“: Überschrift „NOTIZ“ groß und
fett, Strichlinie mit 32 Zeichen, der Text linksbündig, unten Datum und Uhrzeit, dann Teilschnitt.

```yaml
alias: Notiz drucken
mode: queued
fields:
  text:
    name: Text
    required: true
    selector: {text: {multiline: true}}
sequence:
  - if:
      - condition: template
        value_template: "{{ (text | default('') | string | trim) == '' }}"
    then:
      - stop: Notiz ist leer
  - action: escpos_printer.print_text_utf8
    target: {entity_id: notify.mein_bondrucker}
    data: {text: "NOTIZ\n", align: center, bold: true, width: double, height: double, cut: none}
  - action: escpos_printer.print_text_utf8
    target: {entity_id: notify.mein_bondrucker}
    data: {text: "--------------------------------\n", align: center, cut: none}
  - action: escpos_printer.print_text_utf8
    target: {entity_id: notify.mein_bondrucker}
    data: {text: "{{ text | string | trim }}", align: left, cut: none, feed: 2}
  - action: escpos_printer.print_text_utf8
    target: {entity_id: notify.mein_bondrucker}
    data: {text: "{{ now().strftime('%d.%m.%Y %H:%M') }}", align: center, feed: 2, cut: partial}
```

Jeder Druckaufruf braucht ein `\n` am Ende; bei Template-Text schneidet HA das ab, dort deshalb `feed` nutzen. Nur der
letzte Aufruf schneidet (`cut: partial`).
