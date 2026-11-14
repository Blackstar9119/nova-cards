/* Was „npm run screenshots“ aufnimmt – alles aus dem Dashboard „Nova Showcase“ in HA Dev.
   Je Karte: Ordner/Dateiname (Englisch), Ansicht im Showcase und die Zustände.
   Ein Zustand zeigt auf eine Karte im Showcase: Abschnitt `sec` (0-basiert, wie in der Ansicht) und `idx`
   (n-te Nova-Karte im Abschnitt). `set` stellt vorher Demo-Entitäten ein (wird am Ende zurückgestellt),
   `hash` öffnet ein Pop-up über die URL, `area: 'view'` nimmt den Inhaltsbereich statt nur die Karte auf,
   `fixed` nimmt die fest positionierte Leiste der Karte auf (Nova Navi). `editor` wählt die Karte für das Editor-Bild,
   `gif.click` tippt während der GIF-Aufnahme auf ein Element in der Karte.
   Der erste Zustand ist das Hauptbild (README-Galerie, Kopf der Anleitung). */

export const DASHBOARD = 'nova-showcase';

// Themes: Schlüssel in Nova → Name im Dateinamen
export const THEMES = {blau: 'blue', midnight: 'midnight', hell: 'light', velvet: 'velvet'};

const sel = (entity, option) => ({service: 'input_select.select_option', entity, data: {option}});
const on = entity => ({service: 'homeassistant.turn_on', entity});
const off = entity => ({service: 'homeassistant.turn_off', entity});

export const CARDS = [
  {card: 'room', type: 'room-card', doc: 'room-card.md', view: 'raum', states: [
    {state: 'default', sec: 1},
    {state: 'minimal', sec: 3},
  ]},
  {card: 'thermostat', type: 'thermostat-card', doc: 'thermostat-card.md', view: 'thermostat', states: [
    {state: 'compact', sec: 1},
    {state: 'large', sec: 2},
  ]},
  {card: 'light', type: 'light-card', doc: 'light-card.md', view: 'licht', states: [
    {state: 'group', sec: 1},
    {state: 'on', sec: 2, set: [on('light.nova_demo_wohnzimmer_stehlampe')]},
    {state: 'off', sec: 2, set: [off('light.nova_demo_wohnzimmer_stehlampe')]},
  ]},
  {card: 'navi', type: 'navi-card', doc: 'navi-card.md', view: 'navi', states: [
    {state: 'default', sec: 1, fixed: true},
    {state: 'compact', sec: 2, type: 'dock-card', fixed: true},
  ], gif: {state: 'default', area: 'view', click: '.d.bn'}},   // GIF: Tipp auf „Licht“ öffnet das Navi-Pop-up
  {card: 'modular', type: 'modular-card', doc: 'modular-card.md', view: 'modular', states: [
    {state: 'default', sec: 1},
    {state: 'info', sec: 5},
  ]},
  {card: 'camera', type: 'camera-card', doc: 'camera-card.md', view: 'kamera', states: [
    {state: 'default', sec: 1},
    {state: 'split', sec: 3},
  ]},
  {card: 'media', type: 'media-card', doc: 'media-card.md', view: 'media', states: [
    {state: 'playing', sec: 1, set: [sel('input_select.nova_demo_media_wohnzimmer_zustand', 'playing')]},
    {state: 'paused', sec: 1, set: [sel('input_select.nova_demo_media_wohnzimmer_zustand', 'paused')]},
  ]},
  {card: 'vacuum', type: 'vacuum-card', doc: 'vacuum-card.md', view: 'saugroboter', states: [
    {state: 'cleaning', sec: 1, set: [sel('input_select.nova_demo_saugroboter_szenario', 'Saugt und wischt'),
      sel('input_select.nova_demo_saugroboter_zustand', 'cleaning')]},
    {state: 'docked', sec: 1, set: [sel('input_select.nova_demo_saugroboter_szenario', 'Lädt in der Station'),
      sel('input_select.nova_demo_saugroboter_zustand', 'docked')]},
  ], gif: {state: 'cleaning'}},
  {card: 'waste', type: 'waste-card', doc: 'waste-card.md', view: 'muell', states: [
    {state: 'default', sec: 1},
    {state: 'compact', sec: 2},
  ]},
  {card: 'weather', type: 'weather-card', doc: 'weather-card.md', view: 'wetter', states: [
    {state: 'default', sec: 1},
    {state: 'current', sec: 4},
  ]},
  {card: 'popup', type: 'popup-card', doc: 'popup-card.md', view: 'popup', states: [
    {state: 'open', hash: 'nova-demo', area: 'view'},
    {state: 'minimal', hash: 'nova-mini', area: 'view'},
  ], editor: {sec: 3}, gif: {state: 'open'}},
  {card: 'area', type: 'area-card', doc: 'area-card.md', view: 'bereich', states: [
    {state: 'default', sec: 1},
    {state: 'stacked', sec: 3},
  ]},
  {card: 'swipe', type: 'swipe-card', doc: 'swipe-card.md', view: 'swipe', states: [
    {state: 'default', sec: 1},
  ]},
  {card: 'chips', type: 'chips-card', doc: 'chips-card.md', view: 'chips', states: [
    {state: 'default', sec: 1},
    {state: 'colors', sec: 5},
  ]},
  {card: 'appliance', type: 'geraet-card', doc: 'geraet-card.md', view: 'geraet', states: [
    {state: 'washer-running', sec: 1, set: [sel('input_select.nova_demo_waschmaschine_status', 'run')]},
    {state: 'washer-finished', sec: 1, set: [sel('input_select.nova_demo_waschmaschine_status', 'finished')]},
    {state: 'dishwasher', sec: 3, set: [sel('input_select.nova_demo_spuelmaschine_status', 'running')]},
    {state: 'airfryer', sec: 4, set: [sel('input_select.nova_demo_airfryer_status', 'cooking')]},
    {state: 'coffee', sec: 5, set: [sel('input_select.nova_demo_kaffee_status', 'brewing')]},
    {state: 'feeder', sec: 7},
    {state: 'fountain', sec: 8},
  ], gif: [{state: 'washer-running'}, {state: 'feeder'}, {state: 'fountain'}]},
  {card: 'printer', type: 'drucker-card', doc: 'drucker-card.md', view: 'drucker', states: [
    {state: 'printing', sec: 1},
    {state: 'heating', sec: 3},
    {state: 'error', sec: 6},
    {state: 'finished', sec: 7},
    {state: 'off', sec: 10},
  ], gif: {state: 'printing'}},
  {card: 'remote', type: 'remote-card', doc: 'remote-card.md', view: 'fernbedienung', states: [
    {state: 'default', sec: 1},
    {state: 'touchpad', sec: 2},
  ]},
  {card: 'timer', type: 'timer-card', doc: 'timer-card.md', view: 'timer', states: [
    {state: 'idle', sec: 1, set: [{service: 'timer.cancel', entity: 'timer.nova_demo_kuche_timer'}]},
    {state: 'running', sec: 1, set: [{service: 'timer.start', entity: 'timer.nova_demo_kuche_timer', data: {duration: '00:07:30'}}]},
  ]},
  {card: 'clock', type: 'clock-card', doc: 'clock-card.md', view: 'uhr', states: [
    {state: 'digital', sec: 1},
    {state: 'flip', sec: 2},
    {state: 'analog', sec: 3},
    {state: 'glow', sec: 6},
  ]},
  {card: 'shopping', type: 'shopping-card', doc: 'einkauf-card.md', view: 'einkauf', states: [
    {state: 'default', sec: 1},
  ]},
  {card: 'note', type: 'note-card', doc: 'notiz-card.md', view: 'notiz', states: [
    {state: 'default', sec: 1},
  ]},
  {card: 'recipe', type: 'recipe-card', doc: 'rezept-card.md', view: 'rezept', states: [
    {state: 'list', sec: 1},
    {state: 'tiles', sec: 2},
  ]},
  {card: 'recipe-book', type: 'recipe-book-card', doc: 'rezeptbuch-card.md', view: 'rezeptbuch', states: [
    {state: 'old', sec: 0},
    {state: 'modern', sec: 1},
    {state: 'fantasy', sec: 2},
  ]},
  {card: 'theme-switch', type: 'theme-card', doc: 'theme-card.md', view: 'theme', states: [
    {state: 'button', sec: 0},
    {state: 'chip', sec: 1},
    {state: 'dropdown', sec: 2},
  ]},
];

// Gesamtansicht je Theme (Hero im README)
// README-Ansicht „readme“: Abschnitt 0 = Hero (vier Raumkarten 2 × 2), 1–4 = Theme-Vergleich (Bereich-Karte mit
// Licht, Heizung und Uhr, festes Theme je Karte)
export const HERO = {view: 'readme', sec: 0, vw: 820, w: 700, h: 400};
export const COMPARE = {view: 'readme', sections: {blau: 1, hell: 2, midnight: 3, velvet: 4},
  // Lichter für die Aufnahme neutralweiß: warmweiße Lampen färben Midnight sonst bräunlich
  lights: ['light.nova_demo_wohnzimmer_decke', 'light.nova_demo_wohnzimmer_stehlampe'], kelvin: 5200};

/* README-Galerie (npm run screenshots:gallery): jede Karte genau einmal, Reihenfolge = Gruppen im README.
   state: Zustand aus CARDS; mode: 'fit' (mittig, ganz) oder 'top' (hohe Karte, oben angeschnitten);
   parts: mehrere Aufnahmen untereinander (flache Karten mit Nachbarkarten als Kontext). */
export const GALLERY_GROUPS = [
  ['Räume & Navigation', ['room', 'area', 'popup', 'navi', 'swipe', 'chips']],
  ['Licht & Klima', ['light', 'thermostat', 'weather']],
  ['Geräte', ['appliance', 'vacuum', 'printer', 'modular']],
  ['Medien', ['media', 'remote', 'camera']],
  ['Alltag', ['clock', 'timer', 'waste', 'note', 'theme-switch']],
  ['Küche', ['shopping', 'recipe', 'recipe-book']],
];
const G = {
  popup: {state: 'open'},
  navi: {state: 'default'},
  chips: {state: 'default', vw: 640, over: {inner: '.nchip'}},
  vacuum: {state: 'cleaning', over: {sec: 4}},
  shopping: {state: 'default', demoItems: [
    {name: 'Milch', qty: 2, unit: 'l', icon: 'mdi:cup'}, {name: 'Äpfel', qty: 1, unit: 'kg', icon: 'mdi:food-apple'},
    {name: 'Vollkornbrot', icon: 'mdi:baguette'}, {name: 'Kaffeebohnen', qty: 500, unit: 'g', icon: 'mdi:coffee'},
    {name: 'Tomaten', qty: 6, unit: 'Stk', icon: 'mdi:fruit-cherries'}, {name: 'Butter', icon: 'mdi:cheese', done: true}]},
  weather: {state: 'default', mode: 'top'},
  modular: {state: 'default', mode: 'top'},
  remote: {state: 'default', mode: 'top'},
  'theme-switch': {parts: [{state: 'button'}, {state: 'chip'}, {state: 'dropdown'}]},
};
export const GALLERY = GALLERY_GROUPS.flatMap(([, cards]) => cards).map(card => {
  const first = CARDS.find(c => c.card === card).states[0].state;
  return {card, state: first, ...G[card]};
});
