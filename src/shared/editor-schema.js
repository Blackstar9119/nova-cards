// Bausteine für ha-form-Schemas
export const g2 = (...schema) => ({type: 'grid', name: '', schema});
export const T = {text: {}}, I = {icon: {}}, A = {ui_action: {}};
export const ENT = {name: 'entity', required: true, selector: {entity: {}}};
export const TITLE = {name: 'title', selector: T};
export const COLS = {name: 'columns', selector: {number: {min: 1, max: 4, mode: 'slider'}}};
export const NUM = n => ({name: n, selector: {number: {mode: 'box', step: 'any'}}});
export const sel = (n, opts) => ({name: n, selector: {select: {mode: 'dropdown', options: opts.map(([value, label]) => ({value, label}))}}});
// Auswahl der Farbrollen (siehe ROLES in styles.js)
export const ROLE = n => sel(n, [['neutral', 'Neutral'], ['accent-1', 'Akzent 1'], ['accent-2', 'Akzent 2'], ['accent-3', 'Akzent 3'], ['accent-4', 'Akzent 4']]);
export const NAMEICON = g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}});

// Beschriftungen, die Modular, Kamera, Media und Saugroboter teilen
export const BASE_LABELS = {
  name: 'Name', icon: 'Icon', status: 'Status-Entität', active: 'Aktiv-Entität', progress: 'Fortschritt (%)',
  tap_action: 'Aktion beim Antippen', hold_action: 'Aktion bei langem Drücken', button_icon: 'Touch-Button oben: Icon', button_action: 'Touch-Button oben: Aktion',
  title: 'Überschrift (optional)', layout: 'Darstellung', columns: 'Spalten', entity: 'Entität', unit: 'Einheit', decimals: 'Nachkommastellen',
  min: 'Min', max: 'Max', step: 'Schritt', format: 'Anzeige', confirm: 'Sicherheitsabfrage', state: 'Warnen bei Zustand', state_not: 'Warnen außer bei',
  above: 'Warnen über', below: 'Warnen unter', message: 'Meldung', level: 'Stufe', glow: 'Kartenrahmen einfärben',
};
