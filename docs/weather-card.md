# Nova Wetter Card

[← Zurück zur Übersicht](../README.md)

Aktuelles Wetter einer `weather.*`-Entität mit Tages- und Stundenvorhersage: Icon, Temperatur, Zustand, Max/Min, Regen und
Zusatzwerte wie Luftfeuchte, Wind und Luftdruck. Die Vorhersage kommt direkt von der Wetter-Entität.

```yaml
type: custom:nova-weather-card
entity: weather.forecast_home
temperature_entity: sensor.balkon_temperatur
show_clock: true
show_date: true
details: [humidity, wind, pressure, uv_index]
show_hourly: true
hours: 24
hour_step: 3
```

| Option | Standard | Bedeutung |
|---|---|---|
| `entity` | – | Wetter-Entität (Pflicht) |
| `name`, `icon` | Name der Entität, Icon passend zum Wetter | Name und Icon |
| `show_name` | `true` | Name anzeigen |
| `show_clock`, `show_date` | `false` | Große Uhr bzw. Datum über dem Wetter |
| `temperature_entity` | – | Eigener Temperatursensor statt der Temperatur der Wetter-Entität |
| `show_feels_like` | `true` | Gefühlte Temperatur anzeigen |
| `feels_like_entity` | – | Sensor für die gefühlte Temperatur. Leer = Attribut `apparent_temperature`, falls vorhanden |
| `show_high_low` | `true` | Max/Min von heute (aus der Tagesvorhersage) |
| `decimals` | bis zu 1 | Nachkommastellen der Temperatur |
| `show_details` | `true` | Zusatzwerte als Chips anzeigen |
| `label_details` | `false` | Zusatzwerte beschriften |
| `details` | `humidity`, `wind`, `pressure` | Auswahl aus `humidity`, `wind`, `wind_gust`, `pressure`, `uv_index`, `cloud_coverage`, `dew_point`, `visibility`, `ozone`. Werte, die die Entität nicht liefert, fallen weg |
| `show_daily` | `true` | Tagesvorhersage anzeigen |
| `days` | `7` | Anzahl Tage (1–14) |
| `daily_bar` | `true` | Temperatur-Balken in der Tagesvorhersage |
| `show_hourly` | `false` | Stundenvorhersage anzeigen |
| `hourly_layout` | `columns` | `columns` (Spalten) oder `list` (Liste mit Balken) |
| `hourly_graph` | `true` | Temperaturkurve in der Stundenvorhersage |
| `hours` | `24` | Zeitraum in Stunden (1–72) |
| `hour_step` | `3` | Jede wievielte Stunde angezeigt wird |
| `show_probability` | `true` | Regenwahrscheinlichkeit, wenn die Vorhersage sie liefert |
| `show_precipitation` | `true` | Niederschlagsmenge |
| `show_titles` | `true` | Überschriften über den Vorhersagen |
| `hourly_first` | `false` | Stunden vor Tagen zeigen |
| `color` | `auto` | Farbrolle der Icons: `auto` (nach Wetter), `neutral`, `accent-1` … `accent-4` |
| `tap_action`, `hold_action` | Details der Wetter-Entität | Aktionen beim Antippen / langen Drücken |
