// Lebenszyklus von Karten und Editoren: relevante hass-Änderungen erkennen und die Vorschau in der Kartenauswahl erkennen.

// Teile von hass, deren Wechsel immer neu zeichnen lässt (Registries, Sprache, Theme, Verbindung …).
// HA ersetzt bei jedem Update nur, was sich geändert hat – alles andere behält dieselbe Referenz.
const GLOBAL = ['entities', 'devices', 'areas', 'floors', 'localize', 'locale', 'language', 'themes', 'selectedTheme', 'config', 'user', 'connected'];
const ID = /^[a-z_]+\.[a-z0-9_]+$/;

// Alle Entitäts-IDs in einer Konfiguration (beliebig verschachtelt)
export const entityIds = (o, out = new Set()) => {
  if (typeof o === 'string') { if (ID.test(o)) out.add(o); }
  else if (o && typeof o === 'object') Object.values(o).forEach(v => entityIds(v, out));
  return out;
};

// Betrifft das Update von prev auf next eine der Entitäten ids (oder etwas Globales)?
// Ein neues hass-Objekt kommt mehrmals pro Sekunde, meist nur mit fremden Zustandsänderungen.
export const hassChanged = (prev, next, ids) => {
  if (prev === next) return false;
  if (!prev || !next) return true;
  if (GLOBAL.some(k => prev[k] !== next[k])) return true;
  const a = prev.states, b = next.states;
  if (a === b) return false;
  for (const id of ids || []) if (a?.[id] !== b?.[id]) return true;
  return false;
};

// HA-INTERN: Die Vorschaubilder der Kartenauswahl liegen in hui-card-picker. Dort zeigen die Karten eine ruhige
// Version (keine Dauer-Animationen, Streams, Intervalle). Fehlt das Element, gilt die Karte als normal eingebunden.
export const inPicker = el => {
  for (let n = el, i = 0; n && i < 80; i++) {
    if (n.localName === 'hui-card-picker') return true;
    n = n.parentElement || n.getRootNode?.().host;
  }
  return false;
};
