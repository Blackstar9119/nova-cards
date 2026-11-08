# Nova Design

Feste Referenz für das Aussehen aller Nova Cards. Neue Karten und Zeichnungen richten sich danach.

## Grundlagen

- **Glas-Karte:** Kartenkasten mit Glas-Hintergrund (`PANEL_CSS` aus `src/shared/styles.js`), abschaltbar per `glass: false`.
- **Farben:** wählbare Farben sind Farbrollen (`neutral`, `accent-1` … `accent-4`), im Editor per `ROLE()`, in der Karte per
  `roleVars()`. Alle Standardfarben stehen nur zentral in `NOVA_VARS` und werden vom Theme überschrieben (`--nova-…`).
  Eigene Farbsätze einer Karte (z. B. LED- oder Tageszeit-Farben der Uhr) ebenfalls dort als `--nv-…` mit Theme-Variable.
- **Schrift:** Schrift des Themes; Zahlen mit `font-variant-numeric: tabular-nums`. Große Werte dünn (300), Beschriftungen
  klein und gedämpft (Deckkraft 0,6–0,75).
- **Größe:** Karten passen sich der Breite an (`container-type: inline-size`, Größen in `cqw` mit `clamp()`), keine festen Pixelhöhen.
- **Bewegung:** Animationen nur, solange die Karte sichtbar ist (`.anim`), stehen in der Kartenauswahl (`.still`, `inPicker()`)
  und respektieren `prefers-reduced-motion`. Keine Dauer-Zeitgeber, wenn eine CSS-Animation reicht.

## Stil der Zeichnungen

Maßstab für alle animierten Gerätezeichnungen (Gerät, Saugroboter, künftige Karten) ist die Zeichnung der
3D-Drucker Card. Gemeinsame Teile kommen aus `src/shared/scene.js` (`sceneDefs()`, `SCENE_CSS`, `frameGlow()`, `sweep()`,
Palette `PAL`), nicht neu anlegen. Die Drucker-Card selbst bleibt unverändert und hat ihre eigene Kopie.

- **Perspektive:** gerade Frontansicht, keine Schrägsicht und keine Fluchtpunkte. Tiefe nur über Verläufe: Gehäuse
  oben hell → unten dunkel, Seitenglanz links hell → rechts dunkel (`s-sheen`), Lichtkante oben (`s-edge`), weicher
  Bodenschatten als flache Ellipse (`s-shd`). Innenräume dunkler mit Vignette zum Rand.
- **Detailgrad:** echte Bauteile statt Symbole – Schublade mit Griffmulde, Drehknopf mit Chromring und Markierungen,
  Display mit Rahmen, Bildschirm und Touch-Tasten, Scharniere, Serviceklappe, Füße. Kleine Details (Beschriftungen,
  Tasten) nur als dezente Striche (`#fff` mit 0,14–0,25 Deckkraft), keine Logos, keine Schrift außer Display-Werten.
- **Raster:** `viewBox` mit 200–300 Einheiten Kantenlänge (Drucker 260 × 300, Waschmaschine 200 × 200), Gehäuse
  `rx` 8–9, Anbauteile `rx` 1,5–3.
- **Strichstärken:** Kanten 0,4–0,7 in `rgba(255,255,255,.12–.25)`, Trennfugen als 0,8 hohe Fläche in Schwarz
  (0,25–0,3) mit 0,6 hoher Lichtfuge darunter (Weiß 0,06). Keine dicken Konturen, kein `currentColor` für Gehäuse.
- **Farben:** Materialfarben nur aus `PAL` (Gehäuse dunkel `#3a4252`→`#191d26`, Theme: `--nova-device-color-light` /
  `--nova-device-color`; Anbauteile `#3b4252`→`#20252f`; Display `#0a0e14`; Chrom `#a3adbf`→`#232833`).
  Alles, was „lebt“ (Wasser, LEDs, Fortschritt, Haken, Innenlicht), nimmt die Farbrolle der Karte (`--dc`).
  Warnungen/Fehler: `--nv-warn` / `--nv-error`.
- **Glas:** Scheibe mit Verlauf `…-gl` (oben links bläulich 0,11 → unten rechts dunkel 0,38), Kante 0,7 in Weiß 0,22.
  Spiegelung dezent: zwei schräge Streifen (`s-refl`, Weiß 0,035) im Glas-Clip, bei runden Scheiben zusätzlich ein
  kurzer Lichtbogen oben links (Weiß ≤ 0,18). Nicht stärker – Marwin hat die kräftige Spiegelung verworfen.
- **Lichtstreifen:** heller Verlaufsstreifen (`s-gls`, Verlauf `…-gs`, max. 0,45 × 0,7 Deckkraft), leicht schräg,
  läuft einmal in 0,9 s durchs Glas – beim Reinscrollen (Übergang unsichtbar → sichtbar in `_tick()`, `sweep()`)
  und beim Wechsel auf „fertig“. Weg per `--gx`. Nie in Dauerschleife.
- **Glow:** Rahmen der Karte leuchtet in `--dc`, solange das Gerät arbeitet (`frameGlow()`); in der Zeichnung warmes
  bzw. farbiges Innenlicht nur im aktiven Zustand.
- **Zustände:** aus = ganze Zeichnung 0,55 Deckkraft, Display leer; fertig = Haken-Badge in `--dc` mit Pop-Animation, immer unten rechts an der Stelle aus `badgeAt()`;
  Animationen nur mit `.anim`, stehen bei `.still`, respektieren `prefers-reduced-motion`.

## Themenkarten

Karten mit eigenem Motiv (z. B. Nova Recipe Book als altes Kochbuch) dürfen vom Glas-Stil abweichen, folgen aber denselben
Regeln für Größe, Bewegung, Editor und Sprache. Texturen werden im Code erzeugt (SVG/CSS). Schriften kommen als Latin-Subset (woff2) von Home Assistant selbst
(Nova-Integration, `/nova/static/fonts`) und werden erst geladen, wenn die Karte zu sehen ist – nie von fremden Servern,
nie im Haupt-Bundle.
