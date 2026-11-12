/* Nova Design-Tokens – die EINZIGE Stelle für Farben, Radien, Schatten, Blur, Schrift, Abstände und Zeiten aller Karten.
   Karten-CSS verwendet nur die Kurzform var(--nv-…). Jede Kurzform nimmt zuerst die gleichnamige Theme-Variable von
   Home Assistant (--nova-…, zweite Spalte) und sonst den Wert des Nova-Themes (dritte Spalte = Nova Blau).
   Beschreibung aller Tokens: docs/design-system.md. Neue Werte immer hier eintragen, nie in einer Karte. */

// [Kurzname, Theme-Variable, Wert in Nova Blau]
export const TOKENS = [
  // Flächen und Text
  ['bg', 'background', 'linear-gradient(160deg,rgba(80,96,128,.55),rgba(22,27,42,.62))'],
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
  // Akzente und Farbrollen
  ['accent', 'accent-color', '#f5b83d'], ['accent-fg', 'accent-text-color', '#3a2a00'],
  ['accent-ink', 'accent-ink-color', '#f5b83d'], // Akzent als Schrift- oder Icon-Farbe direkt auf der Fläche (helle Themes: dunkler)
  ['active', 'active-color', '#3d8bf5'], ['active-fg', 'active-text-color', '#fff'],
  ['warn', 'warning-color', '#7cc4ff'], ['error', 'error-color', '#ff6b6b'], ['error-fg', 'error-text-color', '#fff'],
  ['a1', 'accent-1', '#3d8bf5'], ['a1-fg', 'accent-1-text', '#fff'],
  ['a2', 'accent-2', '#f5b83d'], ['a2-fg', 'accent-2-text', '#3a2a00'],
  ['a3', 'accent-3', '#b5794a'], ['a3-fg', 'accent-3-text', '#fff'],
  ['a4', 'accent-4', '#4caf6a'], ['a4-fg', 'accent-4-text', '#fff'],
  ['neutral', 'neutral', '#7b8794'], ['neutral-fg', 'neutral-text', '#fff'],
  // Uhr: Leuchtziffern nach Tageszeit, Radiowecker-Farben
  ['clock-night', 'clock-night', '#4d6bff'], ['clock-morning', 'clock-morning', '#ffb36b'], ['clock-noon', 'clock-noon', '#f4f7ff'],
  ['led-red', 'led-red', '#ff2414'], ['led-green', 'led-green', '#39ff7a'], ['led-blue', 'led-blue', '#3fa9ff'], ['led-amber', 'led-amber', '#ffb000'],
  // Pop-up
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
  ['ring', 'ring', '100%'],            // Stärke der Zustandsringe (Warnung, Fehler, aktiv)
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
const MOKKA = '74,48,28'; // Grundton von Nova Velvet: Mokka
export const THEMES = {
  blau: {name: 'Nova Blau', vars: {}},
  hell: {name: 'Nova Hell', vars: {
    bg: 'linear-gradient(160deg,rgba(236,238,242,.94),rgba(225,228,233,.94))',
    border: `rgba(${INK},.1)`, fg: '#0e121a', chip: `rgba(${INK},.07)`,
    box: `rgba(${INK},.04)`, 'box-border': `rgba(${INK},.08)`,
    tint: INK, shade: INK, scrim: '236,238,242', knob: '#fff', cut: 'rgba(236,238,242,.9)',
    accent: '#f0b02e', 'accent-fg': '#3a2a00', 'accent-ink': '#8a5a00',
    active: '#1a66cc', 'active-fg': '#fff', warn: '#0f65b8', error: '#c62f2f', 'error-fg': '#fff',
    a1: '#1a66cc', a2: '#f0b02e', 'a2-fg': '#3a2a00', a3: '#9a5f33', a4: '#2a7a46', neutral: '#5b6673',
    'clock-night': '#2f4fd6', 'clock-morning': '#c4621a', 'clock-noon': '#0e121a',
    'popup-bg': 'linear-gradient(160deg,rgba(243,245,248,.97),rgba(232,235,240,.97))',
    'popup-base': 'rgba(236,239,243,.97)', 'popup-head': 'rgba(226,230,236,.97)', 'popup-backdrop': 'rgba(30,38,55,.28)',
    'navi-popup-bg': 'linear-gradient(160deg,rgba(243,245,248,.97),rgba(232,235,240,.97))',
    shadow: `0 1px 2px rgba(${INK},.06),0 6px 18px rgba(${INK},.08)`, edge: 'inset 0 1px 0 rgba(255,255,255,.7)',
    'shadow-popup': `0 20px 60px rgba(${INK},.2)`, 'shadow-knob': `0 1px 4px rgba(${INK},.3)`,
    glow: '0%', 'text-shadow': '0%', blur: '12px', sat: '120%', 'sat-2': '120%',
  }, navi: {border: `rgba(${INK},.12)`, chip: `rgba(${INK},.06)`, blur: '14px', warn: '#8a5a00'}},
  midnight: {name: 'Nova Midnight', vars: {
    // Für OLED und Nachtbetrieb: reines Schwarz ohne Glas, gedimmte Schrift, schwacher Glow
    bg: '#000', border: 'rgba(255,255,255,.09)', fg: '#d5d9e0', chip: 'rgba(255,255,255,.07)',
    box: 'rgba(255,255,255,.05)', 'box-border': 'rgba(255,255,255,.08)', knob: '#d5d9e0', cut: 'rgba(0,0,0,.7)',
    accent: '#c08f30', 'accent-fg': '#1a1200', 'accent-ink': '#d6a548',
    active: '#3676ca', 'active-fg': '#fff', warn: '#5f9fd4', error: '#c84a4a', 'error-fg': '#fff',
    a1: '#3676ca', a2: '#c08f30', 'a2-fg': '#1a1200', a3: '#8f6040', a4: '#3a8352', neutral: '#5d6773',
    'clock-night': '#3a4fb8', 'clock-morning': '#c98a4e', 'clock-noon': '#b9c2d4',
    'popup-bg': '#000', 'popup-base': '#000', 'popup-head': '#0b0d12', 'popup-backdrop': 'rgba(0,0,0,.72)', 'navi-popup-bg': '#000',
    shadow: '0 0 0 transparent', edge: 'inset 0 1px 0 rgba(255,255,255,.06)', 'shadow-popup': '0 0 0 1px rgba(255,255,255,.08)',
    glow: '30%', ring: '70%', blur: '0px', sat: '100%', 'sat-2': '100%',
  }, navi: {border: 'rgba(255,255,255,.1)', chip: 'rgba(255,255,255,.06)', blur: '0px', warn: '#d6a548'}},
  velvet: {name: 'Nova Velvet', vars: {
    // Warm und edel: cremiges Beige, Espresso-Schrift, Gold und Cognac, weiche warme Schatten statt Glow
    bg: `linear-gradient(160deg,rgba(239,230,214,.94),rgba(230,218,198,.94))`,
    border: 'rgba(90,62,40,.14)', fg: '#1a0f09', chip: `rgba(${MOKKA},.08)`, box: `rgba(${MOKKA},.05)`, 'box-border': `rgba(${MOKKA},.1)`,
    tint: MOKKA, shade: MOKKA, scrim: '239,230,214', knob: '#fbf6ec', cut: 'rgba(239,230,214,.9)',
    accent: '#b8935a', 'accent-fg': '#1a0f09', 'accent-ink': '#7a5a1e',
    active: '#7d4f24', 'active-fg': '#fbf6ec', warn: '#7a4f00', error: '#a3322b', 'error-fg': '#fbf6ec',
    a1: '#2f5d6b', 'a1-fg': '#fbf6ec', a2: '#b8935a', 'a2-fg': '#1a0f09', a3: '#7a2f3a', 'a3-fg': '#fbf6ec',
    a4: '#4f5f2a', 'a4-fg': '#fbf6ec', neutral: '#62554c', 'neutral-fg': '#fbf6ec',
    'clock-night': '#2f5d6b', 'clock-morning': '#9a5a1e', 'clock-noon': '#1a0f09',
    'popup-bg': 'linear-gradient(160deg,rgba(243,236,223,.97),rgba(233,223,205,.97))',
    'popup-base': 'rgba(243,236,223,.97)', 'popup-head': 'rgba(233,223,205,.97)', 'popup-backdrop': 'rgba(40,26,16,.32)',
    'navi-popup-bg': 'linear-gradient(160deg,rgba(243,236,223,.97),rgba(233,223,205,.97))',
    shadow: `0 1px 2px rgba(${MOKKA},.08),0 8px 22px rgba(${MOKKA},.12)`, edge: 'inset 0 1px 0 rgba(255,255,255,.6)',
    'shadow-popup': `0 20px 60px rgba(${MOKKA},.22)`, 'shadow-knob': `0 1px 4px rgba(${MOKKA},.35)`,
    glow: '0%', 'text-shadow': '0%', blur: '12px', sat: '115%', 'sat-2': '115%',
  }, navi: {border: 'rgba(90,62,40,.16)', chip: `rgba(${MOKKA},.06)`, blur: '14px', warn: '#7a5a1e'}},
};
export const THEME_KEYS = Object.keys(THEMES);

// Abweichungen der Nova Navi gegenüber den Karten (etwas kräftigerer Rand, ruhigere Chips, mehr Blur, Warnung in Gelb)
const NAVI = {border: 'rgba(255,255,255,.16)', chip: 'rgba(255,255,255,.1)', blur: '22px', warn: '#f5b83d'};

const block = (sel, over) => `${sel}{${TOKENS.filter(([k]) => !over || k in over)
  .map(([k, pub, v]) => `--nv-${k}:var(--nova-${pub},${over?.[k] ?? v})`).join(';')}}`;
// Ein Block je Theme; :host([nova-theme=…]) wiegt schwerer als :host, Blau braucht keinen eigenen Block
const themed = navi => Object.entries(THEMES).filter(([, t]) => Object.keys(t.vars).length)
  .map(([k, t]) => block(`:host([nova-theme=${k}])`, navi ? {...t.vars, ...t.navi} : t.vars)).join('');

// Variablen-Block für das Stylesheet einer Karte
export const NOVA_VARS = block(':host') + themed(false);
export const NAVI_VARS = block(':host', {...Object.fromEntries(TOKENS.map(([k, , v]) => [k, v])), ...NAVI}) + themed(true);
