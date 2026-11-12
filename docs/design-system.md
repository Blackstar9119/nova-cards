# Nova Design-System

Alle Maße und Farben der Nova Cards stehen als Design-Tokens an einer Stelle: `src/shared/theme.js`. Karten verwenden nur
diese Tokens, nie feste Werte. `npm run check` schlägt an, sobald im Karten-CSS wieder eine feste Farbe steht.

Die Gestaltungsregeln (Glas-Karte, Bewegung, Stil der Zeichnungen) stehen in [DESIGN.md](DESIGN.md).

## So funktionieren die Tokens

- **Name:** Jedes Token hat einen öffentlichen Namen `--nova-…` (Spalte „Token“) und eine Kurzform `--nv-…`, die im Karten-CSS
  steht. Die Kurzform nimmt zuerst die gleichnamige Theme-Variable von Home Assistant und sonst den Wert des Nova-Themes:
  `--nv-chip: var(--nova-chip-color, rgba(255,255,255,.13))`.
- **Übersteuern:** Wer im HA-Theme `nova-chip-color: …` setzt, überschreibt den Wert für alle Karten. Das ist für Bastler gedacht
  und wird nicht als Farbwähler beworben.
- **Farb-Grundtöne** (`tint`, `shade`, `scrim`, `device-light`, `device-dark`) sind als `R,G,B` gespeichert. Im CSS steht
  `rgba(var(--nv-tint),.12)`: die Deckkraft gehört zur Stelle, der Ton zum Theme. In einem hellen Theme wird aus dem weißen
  Aufheller eine dunkle Tinte, ohne dass eine Karte geändert wird.
- **Glow und Ringe** haben je einen Stärke-Wert in Prozent. Jede Stelle behält ihre gezeichnete Stärke und wird damit
  multipliziert: `color-mix(in srgb, <Glow-Farbe> var(--nv-glow), transparent)`. 100 % = wie gezeichnet, 0 % = aus.
- **Nova Navi** nutzt dieselben Tokens mit vier Abweichungen (Rand, Chip-Fläche, Blur, Warnfarbe), siehe `NAVI` in `theme.js`.
- **Editoren** verwenden keine Nova-Tokens. Sie sehen aus wie Home Assistant und nutzen dessen Variablen.

## Tokens (Werte = Nova Blau)

### Flächen und Text

| Token | Kurzform | Wert | Wofür |
| --- | --- | --- | --- |
| `--nova-background` | `--nv-bg` | `linear-gradient(160deg,rgba(80,96,128,.55),rgba(22,27,42,.62))` | Kartenfläche |
| `--nova-border-color` | `--nv-border` | `rgba(255,255,255,.14)` | Kartenrand (Navi: Weiß 16 %) |
| `--nova-text-color` | `--nv-fg` | `#fff` | Text und Icons |
| `--nova-chip-color` | `--nv-chip` | `rgba(255,255,255,.13)` | Icon-Kreise, Pillen, Knöpfe (Navi: Weiß 10 %) |
| `--nova-box-background` | `--nv-box` | `rgba(255,255,255,.09)` | Kacheln in der Karte |
| `--nova-box-border-color` | `--nv-box-border` | `rgba(255,255,255,.1)` | Rand der Kacheln |
| `--nova-tint` | `--nv-tint` | `255,255,255` | Aufheller der Oberfläche: Linien, Schienen, Flächen (helle Themes: dunkle Tinte) |
| `--nova-shade` | `--nv-shade` | `0,0,0` | Schattenfarbe der Oberfläche |
| `--nova-scrim` | `--nv-scrim` | `10,14,24` | Abdunklung über Bildern (Kamera, Media) |
| `--nova-device-light` | `--nv-hi` | `255,255,255` | Licht in Zeichnungen (Kanten, Glanz) – kippt in keinem Theme |
| `--nova-device-dark` | `--nv-lo` | `0,0,0` | Schatten in Zeichnungen |
| `--nova-knob-color` | `--nv-knob` | `#fff` | Griff von Regler und Schalter |
| `--nova-stage-color` | `--nv-stage` | `#000` | Fläche hinter Vollbild-Video |
| `--nova-cutout-color` | `--nv-cut` | `rgba(20,24,38,.6)` | Rand um Icons, die auf einer Farbfläche sitzen (Müllkalender) |

### Akzente und Farbrollen

| Token | Kurzform | Wert | Wofür |
| --- | --- | --- | --- |
| `--nova-accent-color` | `--nv-accent` | `#f5b83d` | Akzent („an“, Fortschritt) |
| `--nova-accent-text-color` | `--nv-accent-fg` | `#3a2a00` | Schrift auf Akzent |
| `--nova-accent-ink-color` | `--nv-accent-ink` | `#f5b83d` | Akzent als Schrift-/Icon-Farbe direkt auf der Fläche (in hellen Themes dunkler) |
| `--nova-active-color` | `--nv-active` | `#3d8bf5` | aktiv/gewählt (Schalter, Pillen) |
| `--nova-active-text-color` | `--nv-active-fg` | `#fff` | Schrift auf Aktiv |
| `--nova-warning-color` | `--nv-warn` | `#7cc4ff` | Warnung (Navi: Gelb) |
| `--nova-error-color` | `--nv-error` | `#ff6b6b` | Fehler |
| `--nova-error-text-color` | `--nv-error-fg` | `#fff` | Schrift auf Fehler |
| `--nova-accent-1` | `--nv-a1` | `#3d8bf5` | Farbrolle Akzent 1 |
| `--nova-accent-1-text` | `--nv-a1-fg` | `#fff` | Farbrolle Akzent 1 – Schrift darauf |
| `--nova-accent-2` | `--nv-a2` | `#f5b83d` | Farbrolle Akzent 2 |
| `--nova-accent-2-text` | `--nv-a2-fg` | `#3a2a00` | Farbrolle Akzent 2 – Schrift darauf |
| `--nova-accent-3` | `--nv-a3` | `#b5794a` | Farbrolle Akzent 3 |
| `--nova-accent-3-text` | `--nv-a3-fg` | `#fff` | Farbrolle Akzent 3 – Schrift darauf |
| `--nova-accent-4` | `--nv-a4` | `#4caf6a` | Farbrolle Akzent 4 |
| `--nova-accent-4-text` | `--nv-a4-fg` | `#fff` | Farbrolle Akzent 4 – Schrift darauf |
| `--nova-neutral` | `--nv-neutral` | `#7b8794` | Farbrolle Neutral |
| `--nova-neutral-text` | `--nv-neutral-fg` | `#fff` | Farbrolle Neutral – Schrift darauf |

### Uhr

| Token | Kurzform | Wert | Wofür |
| --- | --- | --- | --- |
| `--nova-clock-night` | `--nv-clock-night` | `#4d6bff` | Uhr, Leuchtziffern nachts |
| `--nova-clock-morning` | `--nv-clock-morning` | `#ffb36b` | Uhr, Leuchtziffern morgens/abends |
| `--nova-clock-noon` | `--nv-clock-noon` | `#f4f7ff` | Uhr, Leuchtziffern mittags |
| `--nova-led-red` | `--nv-led-red` | `#ff2414` | Radiowecker Rot |
| `--nova-led-green` | `--nv-led-green` | `#39ff7a` | Radiowecker Grün |
| `--nova-led-blue` | `--nv-led-blue` | `#3fa9ff` | Radiowecker Blau |
| `--nova-led-amber` | `--nv-led-amber` | `#ffb000` | Radiowecker Bernstein |

### Pop-up

| Token | Kurzform | Wert | Wofür |
| --- | --- | --- | --- |
| `--nova-popup-background` | `--nv-popup-bg` | `linear-gradient(160deg,rgba(92,110,148,.78),rgba(22,27,42,.88))` | Fläche der Pop-up Card |
| `--nova-popup-base-color` | `--nv-popup-base` | `rgba(22,27,42,.88)` | Grundton hinter Kacheln im Pop-up |
| `--nova-popup-header-color` | `--nv-popup-head` | `rgba(60,72,100,.85)` | Kopfzeile von Pop-up und Navi-Pop-up |
| `--nova-popup-backdrop` | `--nv-popup-backdrop` | `rgba(8,12,22,.5)` | Abdunklung hinter dem Pop-up |
| `--nova-navi-popup-background` | `--nv-navi-popup-bg` | `linear-gradient(160deg,rgba(92,110,148,.8),rgba(22,27,42,.9))` | Fläche des Navi-Pop-ups |

### Radien

| Token | Kurzform | Wert | Wofür |
| --- | --- | --- | --- |
| `--nova-radius` | `--nv-radius` | `24px` | Karte |
| `--nova-popup-radius` | `--nv-popup-r` | `28px` | Pop-up |
| `--nova-radius-lg` | `--nv-r-lg` | `20px` | große Innenflächen |
| `--nova-radius-md` | `--nv-r-md` | `16px` | Kacheln, Raster-Knöpfe |
| `--nova-radius-sm` | `--nv-r-sm` | `12px` | kleine Flächen |
| `--nova-radius-xs` | `--nv-r-xs` | `4px` | Fortschritt, Marken |
| `--nova-radius-pill` | `--nv-r-pill` | `999px` | Pillen, Chips |

### Schatten, Glow, Ringe

| Token | Kurzform | Wert | Wofür |
| --- | --- | --- | --- |
| `--nova-shadow-card` | `--nv-shadow` | `0 10px 30px rgba(0,0,0,.25)` | Schatten jeder Karte |
| `--nova-edge` | `--nv-edge` | `inset 0 1px 0 rgba(255,255,255,.12)` | Lichtkante oben |
| `--nova-shadow-popup` | `--nv-shadow-popup` | `0 20px 60px rgba(0,0,0,.45)` | Schatten des Pop-ups |
| `--nova-shadow-knob` | `--nv-shadow-knob` | `0 1px 4px rgba(0,0,0,.4)` | Schatten am Regler-Griff |
| `--nova-focus-ring` | `--nv-focus` | `0 0 0 2px var(--nv-active)` | Tastatur-Fokus |
| `--nova-glow` | `--nv-glow` | `100%` | Stärke aller Glows: 100 % = wie gezeichnet, 0 % = aus |
| `--nova-ring` | `--nv-ring` | `100%` | Stärke der Zustandsringe (Warnung, Fehler, aktiv) |
| `--nova-text-shadow` | `--nv-text-shadow` | `100%` | Stärke der Schrift-Schatten (Raumname, Media-Titel) |

### Blur

| Token | Kurzform | Wert | Wofür |
| --- | --- | --- | --- |
| `--nova-blur` | `--nv-blur` | `20px` | Unschärfe der Kartenfläche (Navi: 22px) |
| `--nova-blur-xs` | `--nv-blur-xs` | `8px` | kleine Marken |
| `--nova-blur-sm` | `--nv-blur-sm` | `10px` | Knöpfe über Bildern |
| `--nova-blur-lg` | `--nv-blur-lg` | `16px` | Leisten über Bildern |
| `--nova-saturate` | `--nv-sat` | `150%` | Sättigung hinter dem Glas |
| `--nova-saturate-strong` | `--nv-sat-2` | `160%` | Sättigung bei Navi und Pop-up |

### Schrift und Icons

| Token | Kurzform | Wert | Wofür |
| --- | --- | --- | --- |
| `--nova-font` | `--nv-font` | `var(--ha-font-family-body,Roboto,sans-serif)` | Schriftfamilie (Schrift von Home Assistant) |
| `--nova-font-size-1` | `--nv-fs-1` | `10.5px` | Schriftgröße |
| `--nova-font-size-2` | `--nv-fs-2` | `11px` | Schriftgröße |
| `--nova-font-size-3` | `--nv-fs-3` | `11.5px` | Schriftgröße |
| `--nova-font-size-4` | `--nv-fs-4` | `12px` | Schriftgröße |
| `--nova-font-size-5` | `--nv-fs-5` | `12.5px` | Schriftgröße |
| `--nova-font-size-6` | `--nv-fs-6` | `13px` | Schriftgröße |
| `--nova-font-size-7` | `--nv-fs-7` | `13.5px` | Schriftgröße |
| `--nova-font-size-8` | `--nv-fs-8` | `14px` | Schriftgröße |
| `--nova-font-size-9` | `--nv-fs-9` | `15px` | Schriftgröße |
| `--nova-font-size-10` | `--nv-fs-10` | `16px` | Schriftgröße |
| `--nova-font-display-1` | `--nv-fd-1` | `24px` | große Werte (Temperatur, Uhrzeit) |
| `--nova-font-display-2` | `--nv-fd-2` | `28px` | große Werte (Temperatur, Uhrzeit) |
| `--nova-font-display-3` | `--nv-fd-3` | `32px` | große Werte (Temperatur, Uhrzeit) |
| `--nova-font-display-4` | `--nv-fd-4` | `40px` | große Werte (Temperatur, Uhrzeit) |
| `--nova-font-display-5` | `--nv-fd-5` | `48px` | große Werte (Temperatur, Uhrzeit) |
| `--nova-font-weight-light` | `--nv-fw-light` | `300` | Schriftgewicht |
| `--nova-font-weight-medium` | `--nv-fw-medium` | `500` | Schriftgewicht |
| `--nova-font-weight-bold` | `--nv-fw-bold` | `600` | Schriftgewicht |
| `--nova-font-weight-heavy` | `--nv-fw-heavy` | `700` | Schriftgewicht |
| `--nova-tracking-caps` | `--nv-caps` | `.05em` | Sperrung von Überschriften in Großbuchstaben |
| `--nova-icon-sm` | `--nv-icon-sm` | `16px` | Icon-Größe |
| `--nova-icon-md` | `--nv-icon-md` | `18px` | Icon-Größe |
| `--nova-icon-lg` | `--nv-icon-lg` | `20px` | Icon-Größe |
| `--nova-icon-xl` | `--nv-icon-xl` | `24px` | Icon-Größe |

### Abstände

| Token | Kurzform | Wert | Wofür |
| --- | --- | --- | --- |
| `--nova-space-1` | `--nv-s1` | `2px` | Abstand (gap, padding, margin) |
| `--nova-space-2` | `--nv-s2` | `4px` | Abstand (gap, padding, margin) |
| `--nova-space-3` | `--nv-s3` | `6px` | Abstand (gap, padding, margin) |
| `--nova-space-4` | `--nv-s4` | `8px` | Abstand (gap, padding, margin) |
| `--nova-space-5` | `--nv-s5` | `10px` | Abstand (gap, padding, margin) |
| `--nova-space-6` | `--nv-s6` | `12px` | Abstand (gap, padding, margin) |
| `--nova-space-7` | `--nv-s7` | `14px` | Abstand (gap, padding, margin) |
| `--nova-space-8` | `--nv-s8` | `16px` | Abstand (gap, padding, margin) |
| `--nova-card-padding` | `--nv-pad` | `14px 16px` | Innenabstand der Karte |

### Zeiten und Bewegung

| Token | Kurzform | Wert | Wofür |
| --- | --- | --- | --- |
| `--nova-dur-1` | `--nv-d1` | `.15s` | Dauer von Übergängen |
| `--nova-dur-2` | `--nv-d2` | `.2s` | Dauer von Übergängen |
| `--nova-dur-3` | `--nv-d3` | `.25s` | Dauer von Übergängen |
| `--nova-dur-4` | `--nv-d4` | `.3s` | Dauer von Übergängen |
| `--nova-dur-5` | `--nv-d5` | `.4s` | Dauer von Übergängen |
| `--nova-dur-6` | `--nv-d6` | `.6s` | Dauer von Übergängen |
| `--nova-dur-7` | `--nv-d7` | `1s` | Dauer von Übergängen |
| `--nova-ease` | `--nv-ease` | `cubic-bezier(.2,.8,.2,1)` | Standardkurve (federnd) |
| `--nova-ease-soft` | `--nv-ease-soft` | `cubic-bezier(.3,.7,.3,1)` | weiche Kurve |
| `--nova-press-scale` | `--nv-press` | `.92` | Verkleinerung beim Drücken |
| `--nova-sweep-dur` | `--nv-sweep` | `.9s` | Dauer des Lichtstreifens |

## Was bewusst kein Token ist

- **Choreografie der Zeichnungen:** Dauer und Ablauf der Animationen (Trommel, Druckkopf, Dampf, Klappzahlen) gehören zur
  jeweiligen Szene. Tokens gibt es nur für die Übergänge der Oberfläche.
- **Materialfarben der Zeichnungen:** Gehäuse, Chrom, Glas und Display kommen aus der Palette `PAL` in `src/shared/scene.js`,
  die Farben von Dingen (Kaffee, Futter, Wäsche, Filament) stehen in der jeweiligen Zeichnung. Geräte bleiben in allen Themes
  dunkel. Per Theme färbbar sind die Gehäuse: `--nova-device-color-light` / `--nova-device-color`, beim Drucker
  `--nova-printer-color-light` / `--nova-printer-color`, beim Saugroboter `--nova-vacuum-robot-color`,
  `--nova-vacuum-station-color`, `--nova-vacuum-water-color`.
- **Bauteil-Maße:** Größen wie die Höhe eines Schalters (22px, Radius 11px) oder Kreise (`50%`) hängen am Bauteil.
- **Maß-Optionen einzelner Karten** wie `--nova-room-min-height`, `--nova-popup-width`, `--nova-modular-button-width`.
- **Masken:** In `mask-image` bedeutet Schwarz „sichtbar“, das ist keine Farbe.

## Themes

Ein Theme ist eine Liste abweichender Token-Werte (`THEMES` in `theme.js`). Nova Blau ist die Tabelle oben. Form, Schrift,
Abstände, Radien und Zeiten sind in allen Themes gleich, daran erkennt man Nova. Es ändern sich nur Fläche, Licht und Farbe.
Gerätezeichnungen (`hi`/`lo`, `PAL` in `scene.js`) bleiben in allen Themes dunkle Geräte.

| Theme | Schlüssel | Kurz |
| --- | --- | --- |
| Nova Blau | `blau` | Standard: blaues Glas, weiße Schrift, Glow |
| Nova Hell | `hell` | helles Glas, Schiefer-Schrift, ruhige Schatten statt Glow |
| Nova Midnight | `midnight` | reines Schwarz ohne Glas (OLED, Nachtbetrieb), gedimmte Schrift, Glow 30 % |

### Welches Theme eine Karte zeigt

1. Option `theme` der Karte (im Editor unter „Theme“, Standard „Global“ = steht nicht in der Konfiguration).
2. Theme-Variable `nova-theme` – aus dem HA-Theme des Geräts (z. B. `nova-theme: hell` im Theme des Wandtablets) oder von einer
   umgebenden Nova-Karte mit eigenem Theme (Pop-up, Bereich, Swipe, Navi-Pop-up geben ihr Theme an die Karten darin weiter).
3. Globales Theme aus dem Speicher (`src/shared/theme-store.js`) – gesetzt mit dem [Nova Themes Schalter](theme-card.md).
4. Nova Blau.

Technik: `theme-apply.js` setzt das Ergebnis als Attribut `nova-theme` an das Kartenelement (Blau = kein Attribut), `theme.js` liefert
dazu je Theme einen Block `:host([nova-theme=hell]){--nv-…}`. Das geschieht zentral in `define()` für jede Karte – Karten selbst
müssen nichts tun. Einzelne `--nova-…`-Variablen aus einem HA-Theme übersteuern weiterhin jedes Theme.

### Speicher

`src/shared/theme-store.js` ist die einzige Stelle, die weiß, wo das globale Theme liegt: vorerst der Helfer
`input_select.nova_theme` („Nova Theme“, Optionen = Theme-Namen). Der Themes Schalter legt ihn beim ersten Umschalten selbst an
(WebSocket `input_select/create`, darf nur ein Administrator) und trägt neue Themes später als Optionen nach. Zieht das Theme in eine
eigene Nova-Integration um, wird nur dieses Modul getauscht (`readTheme`, `setTheme`, `hasStore`, `canSetup`, `storeIds`).

### Nova Hell (Abweichungen von Blau)

| Token | Wert | Hinweis |
| --- | --- | --- |
| `bg` | `linear-gradient(160deg,rgba(236,238,242,.94),rgba(225,228,233,.94))` | helles Glas |
| `border` / `chip` / `box` / `box-border` | Schiefer `20,28,45` mit 10 / 7 / 4 / 8 % | |
| `fg` | `#0e121a` | 16:1 auf der Fläche; auch mit 60 % Deckkraft noch 4,7:1 |
| `tint` / `shade` | `20,28,45` | Linien und Schienen werden dunkel |
| `scrim` | `236,238,242` | Pillen über Kamerabild und Cover hell statt dunkel |
| `accent` / `accent-fg` / `accent-ink` | `#f0b02e` / `#3a2a00` / `#8a5a00` | Schrift auf Gelb 7,3:1, Akzent als Schrift 5,1:1 |
| `active`, `a1` | `#1a66cc` | Weiß darauf 5,5:1, als Schrift 4,7:1 |
| `warn` / `error` | `#0f65b8` / `#c62f2f` | als Schrift 5,1:1 / 4,7:1 |
| `a2` / `a3` / `a4` / `neutral` | `#f0b02e` / `#9a5f33` / `#2a7a46` / `#5b6673` | Schrift darauf 7,3 / 5,2 / 5,3 / 5,8:1 |
| `clock-night` / `-morning` / `-noon` | `#2f4fd6` / `#c4621a` / `#0e121a` | Leuchtziffern auf hellem Grund |
| Pop-up | `popup-bg` hell 97 %, `popup-head` `rgba(226,230,236,.97)`, Abdunklung `rgba(30,38,55,.28)` | |
| `shadow` | `0 1px 2px` 6 % + `0 6px 18px` 8 % Schiefer | weich statt dunkel |
| `edge` | `inset 0 1px 0 rgba(255,255,255,.7)` | |
| `glow` / `text-shadow` | `0%` | keine Glows, keine Schrift-Schatten; Zustandsringe bleiben |
| `blur` / `sat` | `12px` / `120%` | |
| Navi | Rand 12 %, Chips 6 %, Blur `14px`, Warnung `#8a5a00` | |

Kontraste gerechnet auf der Kartenfläche über einem hellen Dashboard (`#ebeef2`), Ziel WCAG AA (4,5:1 für Schrift).

### Nova Midnight (Abweichungen von Blau)

| Token | Wert | Hinweis |
| --- | --- | --- |
| `bg` / `popup-bg` / `popup-base` / `navi-popup-bg` | `#000` | kein Glas, kein Verlauf |
| `blur` / `sat` | `0px` / `100%` | spart Rechenzeit auf schwachen Geräten (Echo Show) |
| `border` / `chip` / `box` / `box-border` | Weiß mit 9 / 7 / 5 / 8 % | |
| `fg` / `knob` | `#d5d9e0` | 14,8:1, mit 60 % Deckkraft 5,5:1 – blendet nachts nicht |
| `accent` / `accent-fg` / `accent-ink` | `#c08f30` / `#1a1200` / `#d6a548` | Schrift auf Gold 6,4:1, Akzent als Schrift 9,3:1 |
| `active`, `a1` | `#3676ca` | Weiß darauf 4,6:1, als Schrift 4,6:1 |
| `warn` / `error` | `#5f9fd4` / `#c84a4a` | als Schrift 7,4:1 / 4,5:1, Weiß auf Fehler 4,6:1 |
| `a2` / `a3` / `a4` / `neutral` | `#c08f30` / `#8f6040` / `#3a8352` / `#5d6773` | Schrift darauf 6,4 / 5,4 / 4,6 / 5,8:1 |
| `clock-night` / `-morning` / `-noon` | `#3a4fb8` / `#c98a4e` / `#b9c2d4` | Leuchtziffern gedimmt |
| `popup-head` / `popup-backdrop` | `#0b0d12` / `rgba(0,0,0,.72)` | |
| `shadow` / `shadow-popup` / `edge` | keiner / Ring Weiß 8 % / Kante Weiß 6 % | Schatten sieht man auf Schwarz nicht |
| `glow` / `ring` | `30%` / `70%` | Glows nur angedeutet |
| Navi | Rand 10 %, Chips 6 %, kein Blur, Warnung `#d6a548` | |

Kontraste gerechnet auf reinem Schwarz. Gerätezeichnungen bleiben unverändert (`PAL`); sehr dunkle Teile wie der Saugroboter
heben sich auf Schwarz nur schwach ab.

## Prüfen

- `npm run check` – keine festen Farben im Karten-CSS.
- `demo/index.html` – alle Karten mit Testdaten, ohne Home Assistant (über einen lokalen Webserver im Repo-Root öffnen,
  z. B. `npx serve .` und dann `/demo/`). Mit `?src=…` lässt sich ein anderer Build laden, mit `?theme=hell` bzw. `?theme=midnight` ein Theme setzen (wirkt wie die Theme-Variable `nova-theme`).
  Bei Umbauten an den Tokens vorher und nachher fotografieren und vergleichen: Nova Blau muss pixelgleich bleiben.
