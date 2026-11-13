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

// Sichtbarkeit beobachten: cb(true/false), sobald die Karte ins Bild kommt bzw. verschwindet oder der Tab wechselt.
// Liefert eine Funktion zum Beenden (in disconnectedCallback aufrufen). Ohne IntersectionObserver gilt die Karte als sichtbar.
export const watchVisible = (el, cb) => {
  let inView = !('IntersectionObserver' in window), last;
  const upd = () => { const v = inView && !document.hidden && el.isConnected; if (v !== last) { last = v; cb(v); } };
  const io = 'IntersectionObserver' in window ? new IntersectionObserver(es => { inView = es[es.length - 1].isIntersecting; upd(); }, {rootMargin: '100px'}) : null;
  io?.observe(el);
  document.addEventListener('visibilitychange', upd);
  upd();
  return () => { io?.disconnect(); document.removeEventListener('visibilitychange', upd); if (last) { last = false; cb(false); } };
};

// Schwaches Gerät (z. B. Echo Show mit Kiosk-WebView, alte Tablets): wenig Speicher oder wenige Kerne.
// Karten nehmen dann einfachere Animationen. deviceMemory gibt es nur in Chromium (auch in Android-WebViews).
export const weakDevice = () => {
  const n = globalThis.navigator || {}, mem = n.deviceMemory, cpu = n.hardwareConcurrency;
  if (mem && mem <= 2) return true;
  if (cpu && cpu <= 2) return true;
  return /Android/.test(n.userAgent || '') && /; wv\)/.test(n.userAgent || '') && (!cpu || cpu <= 4);
};
