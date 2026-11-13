/* Hintergrund der Dashboards aus der Nova-Einstellung allgemein.hintergrund (keiner, passend, blau, hell, midnight, velvet).
   Gilt nur, solange Nova Cards auf der Seite sind; theme-apply.js meldet jede eingehängte Karte. „keiner“ = nichts ändern.
   Ein eigener Hintergrund der Ansicht (background in der Ansicht) hat Vorrang, weil HA dort --view-background setzt. */
import {BACKGROUNDS} from './theme.js';
import {readTheme} from './theme-store.js';
import {settingsOf} from './settings-store.js';

// HA-INTERN: hui-view-background zeichnet var(--view-background, var(--lovelace-background, …)). Wir setzen
// --lovelace-background am Dokument – gibt es die Variable nicht mehr, bleibt einfach der HA-Hintergrund.
const VAR = '--lovelace-background';
let mine = null;   // was wir gesetzt haben (nur das räumen wir wieder weg)
let before = null; // Wert vorher (z. B. aus einem HA-Theme)
let offT = 0;

const root = () => document.documentElement;

function set(v) {
  const st = root().style;
  if (v === mine && st.getPropertyValue(VAR) === v) return;
  if (mine === null) before = st.getPropertyValue(VAR) || null;
  st.setProperty(VAR, v);
  mine = v;
}

function clear() {
  if (mine === null) return;
  const st = root().style;
  if (st.getPropertyValue(VAR) === mine) { if (before) st.setProperty(VAR, before); else st.removeProperty(VAR); }
  mine = before = null;
}

// Gewünschter Hintergrund für diese hass-Verbindung (oder null)
export function backdropFor(hass) {
  const k = settingsOf(hass)?.allgemein?.hintergrund;
  if (!k || k === 'keiner') return null;
  const t = k === 'passend' ? (readTheme(hass) || 'blau') : k;
  return BACKGROUNDS[t] || null;
}

// active = Anzahl eingehängter Nova-Karten. Ohne Karten kurz warten (Wechsel der Ansicht hängt neu ein), dann räumen.
export function applyBackdrop(hass, active) {
  clearTimeout(offT);
  if (!active) { offT = setTimeout(clear, 1500); return; }
  const v = backdropFor(hass);
  if (v) set(v); else clear();
}
