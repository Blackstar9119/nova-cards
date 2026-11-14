/* Einstellungen der Nova-Integration (nova_homeverse/settings/subscribe) – ein Abo je Verbindung für alle Karten, bleibt für die
   Sitzung offen. Ohne Integration oder mit einer älteren Version ohne Einstellungen bleibt alles beim bisherigen Standard.
   Reihenfolge überall: Option in der Karte → Nova-Einstellung → Standard der Karte. Geheimnisse kommen hier nie an. */

const live = new WeakMap(); // connection → {data}
export const SETTINGS_EVENT = 'nova-settings';

// Aktueller Stand (oder null) – startet beim ersten Aufruf das Abo
export function settingsOf(h) {
  const conn = h?.connection;
  if (!conn?.subscribeMessage) return null;
  let s = live.get(conn);
  if (!s) {
    live.set(conn, s = {data: null});
    conn.subscribeMessage(d => {
      s.data = d && typeof d === 'object' ? d : null;
      window.dispatchEvent(new CustomEvent(SETTINGS_EVENT));
    }, {type: 'nova_homeverse/settings/subscribe'}).catch(() => { /* Integration fehlt oder ist älter → Standardwerte */ });
  }
  return s.data;
}

// Ein Wert, z. B. setting(hass, 'rezepte', 'buch_variante'); undefined ohne Einstellungen
export const setting = (h, sec, key) => settingsOf(h)?.[sec]?.[key];

// Auf Änderungen hören; liefert die Abmeldefunktion
export function onSettings(fn) {
  window.addEventListener(SETTINGS_EVENT, fn);
  return () => window.removeEventListener(SETTINGS_EVENT, fn);
}

// Karten-Optionen aus den Einstellungen: map = {option: [bereich, feld, umwandeln?]}. Nur Werte, die es gibt.
export function fromSettings(h, map) {
  const s = settingsOf(h), out = {};
  if (!s) return out;
  for (const [opt, [sec, key, fn]] of Object.entries(map)) {
    const v = s[sec]?.[key];
    if (v !== undefined) out[opt] = fn ? fn(v) : v;
  }
  return out;
}
