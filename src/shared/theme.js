/* Nova Design-Tokens – die EINZIGE Stelle für Farben, Radien, Schatten, Blur, Schrift, Abstände und Zeiten aller Karten.
   Karten-CSS verwendet nur die Kurzform var(--nv-…). Jede Kurzform nimmt zuerst die gleichnamige Theme-Variable von
   Home Assistant (--nova-…, zweite Spalte) und sonst den Wert des Nova-Themes (dritte Spalte = Nova Blau).
   Beschreibung aller Tokens: docs/design-system.md. Neue Werte immer hier eintragen, nie in einer Karte. */

// [Kurzname, Theme-Variable, Wert in Nova Blau]
export const TOKENS = [
  // Flächen und Text
  ['bg', 'background', 'linear-gradient(160deg,rgba(80,96,128,.55),rgba(22,27,42,.62))'],
  ['page', 'page-background', 'linear-gradient(160deg,#2b3650,#111624 70%)'], // Seite hinter den Karten – nur im Nova-Panel
  ['border', 'border-color', 'rgba(255,255,255,.14)'],
  ['fg', 'text-color', '#fff'],
  ['chip', 'chip-color', 'rgba(255,255,255,.13)'],
  ['box', 'box-background', 'rgba(255,255,255,.09)'],
  ['box-border', 'box-border-color', 'rgba(255,255,255,.1)'],
  // Farb-Grundtöne als R,G,B – verwendet als rgba(var(--nv-tint),.12): Deckkraft steht an der Stelle, der Ton kommt vom Theme
  ['tint', 'tint', '255,255,255'],     // Aufheller der Oberfläche: Linien, Schienen, Flächen (helle Themes: dunkle Tinte)
  ['shade', 'shade', '0,0,0'],         // Schattenfarbe der Oberfläche
  ['scrim', 'scrim', '10,14,24'],      // Abdunklung über Bildern (Kamera, Media)
  ['hi', 'device-light', '255,255,255'], // Licht in Zeichnungen (Kanten, Glanz) – kippt in keinem Theme
  ['lo', 'device-dark', '0,0,0'],        // Schatten in Zeichnungen
  ['knob', 'knob-color', '#fff'],      // Griff von Regler und Schalter
  ['stage', 'stage-color', '#000'],    // Fläche hinter Vollbild-Video
  ['cut', 'cutout-color', 'rgba(20,24,38,.6)'], // Rand um Icons, die auf einer Farbfläche sitzen (Müllkalender)
  // Glanz über jeder Kartenfläche (oberste Ebene, Bild oder none): weiches Licht von oben links und ein schräger Spiegelstreifen.
  // Nova Blau hat ihn schon im Glas selbst, darum none.
  ['sheen', 'sheen', 'none'],
  // Farbton der Fläche als Bild-Ebene: setzen Bereich und Pop-up mit Farbton für alles darin (Nova-Karten und fremde Karten,
  // siehe TONE_SCOPE in styles.js), sonst none. tone-mix = Anteil des Farbtons oben links, er läuft nach unten rechts aus
  ['tone-layer', 'tone-layer', 'none'], ['tone-mix', 'tone-mix', '22%'],
  // Fremde Karten (Home-Assistant-Karten in Bereich, Pop-up, Swipe): einfarbige Kartenfarbe, wo HA keine Verläufe nimmt
  ['card-solid', 'card-color', '#1e2638'],
  // Akzente und Farbrollen
  ['accent', 'accent-color', '#f5b83d'], ['accent-fg', 'accent-text-color', '#3a2a00'],
  ['accent-ink', 'accent-ink-color', '#f5b83d'], // Akzent als Schrift- oder Icon-Farbe direkt auf der Fläche (helle Themes: dunkler)
  ['active', 'active-color', '#3d8bf5'], ['active-fg', 'active-text-color', '#fff'],
  ['warn', 'warning-color', '#7cc4ff'], ['error', 'error-color', '#ff6b6b'], ['error-fg', 'error-text-color', '#fff'],
  // Textfarben im formatierten Text (Notiz, Einkauf): Akzent und Wichtig – folgen den Theme-Farben
  ['text-accent', 'text-accent-color', 'var(--nv-accent-ink)'], ['text-warn', 'text-warning-color', 'var(--nv-error)'],
  ['a1', 'accent-1', '#3d8bf5'], ['a1-fg', 'accent-1-text', '#fff'],
  ['a2', 'accent-2', '#f5b83d'], ['a2-fg', 'accent-2-text', '#3a2a00'],
  ['a3', 'accent-3', '#b5794a'], ['a3-fg', 'accent-3-text', '#fff'],
  ['a4', 'accent-4', '#4caf6a'], ['a4-fg', 'accent-4-text', '#fff'],
  ['neutral', 'neutral', '#7b8794'], ['neutral-fg', 'neutral-text', '#fff'],
  // Farbtöne der Flächen (Farbton von Bereich und Pop-up, Unterkarten darin) – die zentrale Palette für Hintergründe.
  // Standard = die Rolle selbst, ein Theme kann sie für Flächen weicher oder wärmer stimmen
  ['a1-tone', 'accent-1-tone', 'var(--nv-a1)'], ['a2-tone', 'accent-2-tone', 'var(--nv-a2)'], ['a3-tone', 'accent-3-tone', 'var(--nv-a3)'],
  ['a4-tone', 'accent-4-tone', 'var(--nv-a4)'], ['neutral-tone', 'neutral-tone', 'var(--nv-neutral)'],
  // Farbrolle in Gerätezeichnungen (Leuchten auf dunklem Gehäuse) – Standard = die Rolle selbst, ein Theme kann sie aufhellen
  ['a1-dev', 'accent-1-device', 'var(--nv-a1)'], ['a2-dev', 'accent-2-device', 'var(--nv-a2)'], ['a3-dev', 'accent-3-device', 'var(--nv-a3)'],
  ['a4-dev', 'accent-4-device', 'var(--nv-a4)'], ['neutral-dev', 'neutral-device', 'var(--nv-neutral)'],
  // Standardfarbe der Kaffeemaschine (nur dort, nicht im Editor wählbar): Kupfer aus Akzent 3, Velvet eigenes Braun
  ['coffee', 'coffee-color', 'var(--nv-a3)'], ['coffee-fg', 'coffee-color-text', 'var(--nv-a3-fg)'], ['coffee-dev', 'coffee-color-device', 'var(--nv-a3-dev)'],
  // Uhr: Leuchtziffern nach Tageszeit, Radiowecker-Farben
  ['clock-night', 'clock-night', '#4d6bff'], ['clock-morning', 'clock-morning', '#ffb36b'], ['clock-noon', 'clock-noon', '#f4f7ff'],
  ['led-red', 'led-red', '#ff2414'], ['led-green', 'led-green', '#39ff7a'], ['led-blue', 'led-blue', '#3fa9ff'], ['led-amber', 'led-amber', '#ffb000'],
  // Pop-up
  ['area-bg', 'area-background', 'var(--nv-bg)'], // Rahmen der Bereich Card (Midnight: schwarz, Karten darin grau)
  ['popup-bg', 'popup-background', 'linear-gradient(160deg,rgba(92,110,148,.78),rgba(22,27,42,.88))'],
  ['popup-base', 'popup-base-color', 'rgba(22,27,42,.88)'],
  ['popup-head', 'popup-header-color', 'rgba(60,72,100,.85)'],
  ['popup-backdrop', 'popup-backdrop', 'rgba(8,12,22,.5)'],
  ['navi-popup-bg', 'navi-popup-background', 'linear-gradient(160deg,rgba(92,110,148,.8),rgba(22,27,42,.9))'],
  // Radien
  ['radius', 'radius', '24px'], ['popup-r', 'popup-radius', '28px'],
  ['r-lg', 'radius-lg', '20px'], ['r-md', 'radius-md', '16px'], ['r-sm', 'radius-sm', '12px'], ['r-xs', 'radius-xs', '4px'],
  ['r-pill', 'radius-pill', '999px'],
  // Schatten, Glow, Ringe
  ['shadow', 'shadow-card', '0 10px 30px rgba(0,0,0,.25)'],
  ['edge', 'edge', 'inset 0 1px 0 rgba(255,255,255,.12)'],
  ['shadow-popup', 'shadow-popup', '0 20px 60px rgba(0,0,0,.45)'],
  ['shadow-knob', 'shadow-knob', '0 1px 4px rgba(0,0,0,.4)'],
  ['focus', 'focus-ring', '0 0 0 2px var(--nv-active)'],
  ['glow', 'glow', '100%'],            // Stärke aller Glows: 100 % = wie gezeichnet, 0 % = aus
  ['ring', 'ring', '100%'],
  // Gefüllte Knöpfe (aktiv, primär): Anteil der Farbe an der Fläche (Rest = Chip-Glas), Anteil der Farbschrift (Rest = --nv-fg),
  // Lichtkante/Rand obendrauf; tint-ink = Anteil der Farbe an farbigen Icons auf Glasknöpfen
  ['fill', 'button-fill', '100%'], ['fill-ink', 'button-fill-text', '100%'], ['fill-edge', 'button-edge', '0 0 0 transparent'],
  ['tint-ink', 'button-tint-text', '100%'],            // Stärke der Zustandsringe (Warnung, Fehler, aktiv)
  ['text-shadow', 'text-shadow', '100%'], // Stärke der Schrift-Schatten über Bildern (Raumname, Media-Titel)
  // Blur
  ['blur', 'blur', '20px'], ['blur-xs', 'blur-xs', '8px'], ['blur-sm', 'blur-sm', '10px'], ['blur-lg', 'blur-lg', '16px'],
  ['sat', 'saturate', '150%'], ['sat-2', 'saturate-strong', '160%'],
  // Schrift
  ['font', 'font', 'var(--ha-font-family-body,Roboto,sans-serif)'],
  ['fs-1', 'font-size-1', '10.5px'], ['fs-2', 'font-size-2', '11px'], ['fs-3', 'font-size-3', '11.5px'], ['fs-4', 'font-size-4', '12px'],
  ['fs-5', 'font-size-5', '12.5px'], ['fs-6', 'font-size-6', '13px'], ['fs-7', 'font-size-7', '13.5px'], ['fs-8', 'font-size-8', '14px'],
  ['fs-9', 'font-size-9', '15px'], ['fs-10', 'font-size-10', '16px'],
  ['fd-1', 'font-display-1', '24px'], ['fd-2', 'font-display-2', '28px'], ['fd-3', 'font-display-3', '32px'],
  ['fd-4', 'font-display-4', '40px'], ['fd-5', 'font-display-5', '48px'],
  ['fw-light', 'font-weight-light', '300'], ['fw-medium', 'font-weight-medium', '500'], ['fw-bold', 'font-weight-bold', '600'],
  ['fw-heavy', 'font-weight-heavy', '700'],
  ['caps', 'tracking-caps', '.05em'],
  ['icon-sm', 'icon-sm', '16px'], ['icon-md', 'icon-md', '18px'], ['icon-lg', 'icon-lg', '20px'], ['icon-xl', 'icon-xl', '24px'],
  // Abstände
  ['s1', 'space-1', '2px'], ['s2', 'space-2', '4px'], ['s3', 'space-3', '6px'], ['s4', 'space-4', '8px'],
  ['s5', 'space-5', '10px'], ['s6', 'space-6', '12px'], ['s7', 'space-7', '14px'], ['s8', 'space-8', '16px'],
  ['pad', 'card-padding', '14px 16px'],
  // Zeiten (nur Übergänge der Oberfläche – die Choreografie der Zeichnungen bleibt in der jeweiligen Szene)
  ['d1', 'dur-1', '.15s'], ['d2', 'dur-2', '.2s'], ['d3', 'dur-3', '.25s'], ['d4', 'dur-4', '.3s'], ['d5', 'dur-5', '.4s'],
  ['d6', 'dur-6', '.6s'], ['d7', 'dur-7', '1s'],
  ['ease', 'ease', 'cubic-bezier(.2,.8,.2,1)'], ['ease-soft', 'ease-soft', 'cubic-bezier(.3,.7,.3,1)'],
  ['press', 'press-scale', '.92'],
  ['sweep', 'sweep-dur', '.9s'],
];

// Themes: Schlüssel → Name und abweichende Werte je Kurzname. Nova Blau ist die Tabelle oben (keine Abweichungen).
// Gewählt wird ein Theme über das Attribut nova-theme am Kartenelement (setzt theme-apply.js); Blau = kein Attribut.
// Zeichnungen (hi/lo, PAL in scene.js) bleiben in allen Themes dunkle Geräte.
const INK = '20,28,45'; // Grundton von Nova Hell: Schiefer
// Glanz der Flächen: Licht von oben links, darüber ein schräger, sehr weicher Spiegelstreifen (wie Glas unter einer Lampe)
const sheen = (rgb, a, b) => `linear-gradient(165deg,rgba(${rgb},${a}),rgba(${rgb},0) 42%),linear-gradient(118deg,rgba(${rgb},0) 30%,rgba(${rgb},${b}) 46%,rgba(${rgb},0) 62%)`;
const SHEEN_LIGHT = sheen('255,255,255', .6, .22);
const SHEEN_WARM = sheen('255,250,240', .55, .2);
const SHEEN_DARK = sheen('255,255,255', .07, .025);
const MOKKA = '74,48,28'; // Grundton von Nova Velvet: Mokka
export const THEMES = {
  blau: {name: 'Nova Blau', vars: {}},
  hell: {name: 'Nova Hell', vars: {
    page: 'linear-gradient(160deg,#dde2ea,#c4cbd6)',
    bg: 'linear-gradient(160deg,rgba(246,248,251,.95),rgba(222,227,234,.94))', sheen: SHEEN_LIGHT, 'card-solid': '#eceef2',
    'area-bg': 'linear-gradient(160deg,rgba(231,235,241,.94),rgba(207,214,224,.94))',
    border: `rgba(${INK},.1)`, fg: '#0e121a', chip: `rgba(${INK},.07)`,
    box: `rgba(${INK},.04)`, 'box-border': `rgba(${INK},.08)`,
    tint: INK, shade: INK, scrim: '236,238,242', knob: '#fff', cut: 'rgba(236,238,242,.9)',
    accent: '#f0b02e', 'accent-fg': '#3a2a00', 'accent-ink': '#8a5a00',
    active: '#1a66cc', 'active-fg': '#fff', warn: '#0f65b8', error: '#c62f2f', 'error-fg': '#fff',
    a1: '#1a66cc', a2: '#f0b02e', 'a2-fg': '#3a2a00', a3: '#9a5f33', a4: '#2a7a46', neutral: '#5b6673',
    'a1-tone': '#4f8fe0', 'a4-tone': '#4f9a68', // Flächen hell und klar statt dunkler Schriftfarben
    'clock-night': '#2f4fd6', 'clock-morning': '#c4621a', 'clock-noon': '#0e121a',
    'popup-bg': 'linear-gradient(160deg,rgba(246,248,251,.97),rgba(224,229,236,.97))',
    'popup-base': 'rgba(236,239,243,.97)', 'popup-head': 'rgba(226,230,236,.97)', 'popup-backdrop': 'rgba(30,38,55,.28)',
    'navi-popup-bg': 'linear-gradient(160deg,rgba(243,245,248,.97),rgba(232,235,240,.97))',
    shadow: `0 1px 2px rgba(${INK},.06),0 6px 18px rgba(${INK},.08)`, edge: 'inset 0 1px 0 rgba(255,255,255,.7)',
    'shadow-popup': `0 20px 60px rgba(${INK},.2)`, 'shadow-knob': `0 1px 4px rgba(${INK},.3)`,
    glow: '0%', 'text-shadow': '0%', blur: '12px', sat: '120%', 'sat-2': '120%',
  }, navi: {border: `rgba(${INK},.12)`, chip: `rgba(${INK},.06)`, blur: '14px', warn: '#8a5a00'}},
  midnight: {name: 'Nova Midnight', vars: {
    page: 'linear-gradient(180deg,#0e0e10,#000 70%)',
    // Wie der Dark Mode von Apple: Seite schwarz, Karten um #1c1c1e (weicher Verlauf mit feinem Glanz), Kacheln #2c2c2e,
    // feine Linien, kein Glow, kein Blur. Aktive Knöpfe sind getöntes Glas (Farbe 22 % über der Kachel, Rand und Lichtkante).
    bg: 'linear-gradient(160deg,#252528,#19191b)', sheen: SHEEN_DARK, 'card-solid': '#1c1c1e', 'tone-mix': '26%', border: 'rgba(255,255,255,.06)', fg: '#e5e5ea', chip: '#2c2c2e',
    box: '#2c2c2e', 'box-border': 'rgba(255,255,255,.06)', knob: '#e5e5ea', cut: 'rgba(28,28,30,.85)',
    accent: '#b08d57', 'accent-fg': '#121214', 'accent-ink': '#b08d57',
    active: '#6b8db5', 'active-fg': '#121214', warn: '#7fa6c9', error: '#c86a6a', 'error-fg': '#121214',
    a1: '#6b8db5', 'a1-fg': '#121214', a2: '#b08d57', 'a2-fg': '#121214', a3: '#ad805c', 'a3-fg': '#121214',
    a4: '#5f9a72', 'a4-fg': '#121214', neutral: '#8a929c', 'neutral-fg': '#121214',
    'clock-night': '#5a6fb8', 'clock-morning': '#c98a4e', 'clock-noon': '#c7ccd6',
    'area-bg': 'linear-gradient(160deg,#141416,#030303 70%)', 'popup-bg': 'linear-gradient(160deg,#141416,#030303 70%)', 'popup-base': '#1c1c1e',
    'popup-head': '#2c2c2e', 'popup-backdrop': 'rgba(0,0,0,.72)', 'navi-popup-bg': 'linear-gradient(160deg,#252528,#19191b)',
    shadow: '0 0 0 transparent', edge: 'inset 0 1px 0 rgba(255,255,255,.05)', 'shadow-popup': '0 0 0 1px rgba(255,255,255,.08)',
    glow: '0%', ring: '70%', blur: '0px', sat: '100%', 'sat-2': '100%',
    fill: '22%', 'fill-ink': '0%', 'tint-ink': '0%', 'fill-edge': 'inset 0 1px 0 rgba(255,255,255,.12),inset 0 0 0 1px rgba(255,255,255,.1)',
  }, navi: {border: 'rgba(255,255,255,.08)', chip: '#2c2c2e', blur: '0px', warn: '#b08d57'}},
  velvet: {name: 'Nova Velvet', vars: {
    page: 'linear-gradient(160deg,#e0d2b6,#bfac88)',
    // Warm und edel: cremiges Beige, Espresso-Schrift, Gold und Cognac, weiche warme Schatten statt Glow
    bg: 'linear-gradient(160deg,rgba(247,240,228,.95),rgba(226,212,189,.94))', sheen: SHEEN_WARM, 'card-solid': '#efe6d6',
    'area-bg': 'linear-gradient(160deg,rgba(236,226,207,.94),rgba(212,195,166,.94))',
    border: 'rgba(90,62,40,.14)', fg: '#1a0f09', chip: `rgba(${MOKKA},.08)`, box: `rgba(${MOKKA},.05)`, 'box-border': `rgba(${MOKKA},.1)`,
    tint: MOKKA, shade: MOKKA, scrim: '239,230,214', knob: '#fbf6ec', cut: 'rgba(239,230,214,.9)',
    accent: '#b8935a', 'accent-fg': '#1a0f09', 'accent-ink': '#7a5a1e',
    active: '#7d4f24', 'active-fg': '#fbf6ec', warn: '#7a4f00', error: '#a3322b', 'error-fg': '#fbf6ec',
    a1: '#4a3226', 'a1-fg': '#fbf6ec', 'a1-dev': '#b8935a', // Espresso auf der Fläche, Gold auf den Geräten
    a2: '#b8935a', 'a2-fg': '#1a0f09', a3: '#7a2f3a', 'a3-fg': '#fbf6ec',
    coffee: '#8a5a33', 'coffee-fg': '#fbf6ec', 'coffee-dev': '#b07a48', // Kaffee warmes Braun statt Bordeaux
    a4: '#4f5f2a', 'a4-fg': '#fbf6ec', neutral: '#62554c', 'neutral-fg': '#fbf6ec',
    'a1-tone': '#8a5a33', 'a2-tone': '#b8935a', 'a3-tone': '#8a3a45', 'a4-tone': '#6b7a3a', // Flächen: Cognac, Gold, Bordeaux, Oliv
    'clock-night': '#6b3a2a', 'clock-morning': '#9a5a1e', 'clock-noon': '#1a0f09',
    'popup-bg': 'linear-gradient(160deg,rgba(247,240,228,.97),rgba(228,215,192,.97))',
    'popup-base': 'rgba(243,236,223,.97)', 'popup-head': 'rgba(233,223,205,.97)', 'popup-backdrop': 'rgba(40,26,16,.32)',
    'navi-popup-bg': 'linear-gradient(160deg,rgba(243,236,223,.97),rgba(233,223,205,.97))',
    shadow: `0 1px 2px rgba(${MOKKA},.08),0 8px 22px rgba(${MOKKA},.12)`, edge: 'inset 0 1px 0 rgba(255,255,255,.6)',
    'shadow-popup': `0 20px 60px rgba(${MOKKA},.22)`, 'shadow-knob': `0 1px 4px rgba(${MOKKA},.35)`,
    glow: '0%', 'text-shadow': '0%', blur: '12px', sat: '115%', 'sat-2': '115%',
  }, navi: {border: 'rgba(90,62,40,.16)', chip: `rgba(${MOKKA},.06)`, blur: '14px', warn: '#7a5a1e'}},
};
export const THEME_KEYS = Object.keys(THEMES);

// Hintergründe der Dashboards (Nova-Einstellung allgemein.hintergrund, setzt backdrop.js): je Theme ein ruhiger Verlauf
// mit weichem Licht. „fixed“, damit der Verlauf beim Scrollen stehen bleibt.
export const BACKGROUNDS = {
  blau: 'radial-gradient(90vmax 70vmax at 12% -10%,rgba(92,128,204,.38),transparent 60%) fixed,'
    + 'radial-gradient(80vmax 60vmax at 110% 110%,rgba(56,84,150,.32),transparent 60%) fixed,linear-gradient(160deg,#26324c,#0f1422 75%) fixed',
  hell: 'radial-gradient(90vmax 70vmax at 10% -10%,rgba(255,255,255,.85),transparent 60%) fixed,'
    + 'radial-gradient(80vmax 60vmax at 110% 110%,rgba(170,186,214,.45),transparent 60%) fixed,linear-gradient(160deg,#e3e7ee,#c9d0db) fixed',
  midnight: 'radial-gradient(90vmax 70vmax at 50% -20%,rgba(255,255,255,.07),transparent 60%) fixed,'
    + 'radial-gradient(70vmax 50vmax at 100% 120%,rgba(120,124,132,.12),transparent 60%) fixed,linear-gradient(180deg,#0b0b0d,#000 70%) fixed',
  velvet: 'radial-gradient(90vmax 70vmax at 12% -10%,rgba(255,244,222,.75),transparent 60%) fixed,'
    + 'radial-gradient(80vmax 60vmax at 110% 110%,rgba(184,147,90,.35),transparent 60%) fixed,linear-gradient(160deg,#e2d4b8,#c2ae8a) fixed',
};

// Abweichungen der Nova Navi gegenüber den Karten (etwas kräftigerer Rand, ruhigere Chips, mehr Blur, Warnung in Gelb)
const NAVI = {border: 'rgba(255,255,255,.16)', chip: 'rgba(255,255,255,.1)', blur: '22px', warn: '#f5b83d'};

const block = (sel, over) => `${sel}{${TOKENS.filter(([k]) => !over || k in over)
  .map(([k, pub, v]) => `--nv-${k}:var(--nova-${pub},${over?.[k] ?? v})`).join(';')}}`;
// Ein Block je Theme; :host([nova-theme=…]) wiegt schwerer als :host, Blau braucht keinen eigenen Block
const themed = navi => Object.entries(THEMES).filter(([, t]) => Object.keys(t.vars).length)
  .map(([k, t]) => block(`:host([nova-theme=${k}])`, navi ? {...t.vars, ...t.navi} : t.vars)).join('');

// Nova-Einstellungen (Attribute setzt theme-apply.js, „normal“ = kein Attribut, also keine Änderung):
// Schriftgröße klein/groß skaliert alle Schrift-Tokens; Animationen „vereinfacht“ stoppt Animationen (Lauftitel, Leuchten,
// Lichtstreifen), „aus“ zusätzlich alle Übergänge.
const SIZE_FACTOR = {klein: .9, gross: 1.12};
const sized = Object.entries(SIZE_FACTOR).map(([k, f]) => `:host([nova-size=${k}]){${TOKENS.filter(([n]) => /^f[sd]-\d/.test(n))
  .map(([n, pub, v]) => `--nv-${n}:calc(var(--nova-${pub},${v}) * ${f})`).join(';')}}`).join('');
const MOTION = `:host([nova-motion]) *,:host([nova-motion]) *::before,:host([nova-motion]) *::after{animation:none!important}
:host([nova-motion=off]) *,:host([nova-motion=off]) *::before,:host([nova-motion=off]) *::after{transition:none!important}
:host([nova-motion=off]){${TOKENS.filter(([n]) => /^d\d$|^sweep$/.test(n)).map(([n]) => `--nv-${n}:0s`).join(';')}}`;

// Kartenfläche: Glanz, Farbton, Grund. Gemeinsam für Nova-Karten (styles.js) und fremde Karten.
export const SURFACE = 'var(--nv-sheen),var(--nv-tone-layer),var(--nv-bg)';
// Farbton-Ebene aus einer Farbe (läuft nach unten rechts aus)
export const toneLayer = c => `linear-gradient(160deg,color-mix(in srgb,${c} var(--nv-tone-mix),transparent),transparent 85%)`;
// Fremde Karten in Nova-Karten (Bereich, Pop-up, Swipe …): dieselbe Fläche, dieselben Radien, Rahmen und Schriftfarben wie die
// Nova-Unterkarten – keine weißen Karten in dunklen Themes, Fehlerkarten (HA legt --error-color mit 12 % darüber) bleiben dezent
export const HA_VARS = `--ha-card-background:${SURFACE};--card-background-color:var(--nv-card-solid);--ha-card-border-radius:var(--nv-radius);
--ha-card-border-color:var(--nv-border);--ha-card-border-width:1px;--ha-card-box-shadow:var(--nv-shadow),var(--nv-edge);
--primary-text-color:var(--nv-fg);--secondary-text-color:color-mix(in srgb,var(--nv-fg) 62%,transparent);
--divider-color:rgba(var(--nv-tint),.12);--error-color:var(--nv-error)`;
const HA = `:host{${HA_VARS}}`;

// Variablen-Block für das Stylesheet einer Karte
export const NOVA_VARS = block(':host') + themed(false) + HA + sized + MOTION;
export const NAVI_VARS = block(':host', {...Object.fromEntries(TOKENS.map(([k, , v]) => [k, v])), ...NAVI}) + themed(true) + HA + sized + MOTION;
