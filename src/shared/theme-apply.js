/* Theme am Kartenelement setzen. Reihenfolge: theme der Karte → Theme-Variable nova-theme (vom HA-Theme des Geräts
   oder von einer umgebenden Nova-Karte mit eigenem Theme) → globaler Speicher (theme-store.js) → Nova Blau.
   Das Ergebnis steht als Attribut nova-theme am Element (Blau = kein Attribut); die Werte setzt theme.js per CSS. */
import {THEMES} from './theme.js';
import {readTheme, STORE_ENTITY} from './theme-store.js';

const valid = v => { const k = String(v || '').trim().toLowerCase(); return k && k !== 'global' && THEMES[k] ? k : undefined; };

function apply(el) {
  const own = valid(el._nvTheme);
  // Ein eigenes Theme gilt auch für Karten darin (Pop-up, Bereich, Swipe, Navi-Pop-up)
  if (own) el.style.setProperty('--nova-theme', own); else el.style.removeProperty('--nova-theme');
  const t = own || el._nvInh || readTheme(el._nvHass) || 'blau';
  if (t === 'blau') { if (el.hasAttribute('nova-theme')) el.removeAttribute('nova-theme'); }
  else if (el.getAttribute('nova-theme') !== t) el.setAttribute('nova-theme', t);
}
// Geerbte Theme-Variable lesen (am Elternelement, damit die eigene nicht mitzählt) – erst nach dem Einhängen,
// und einen Frame später, weil HA das Theme des Geräts nach dem hass-Update setzt
function inherit(el) {
  cancelAnimationFrame(el._nvRaf);
  el._nvRaf = requestAnimationFrame(() => {
    const p = el.parentElement || el.getRootNode?.().host;
    el._nvInh = p && el.isConnected ? valid(getComputedStyle(p).getPropertyValue('--nova-theme')) : undefined;
    apply(el);
  });
}

// Kartenklasse theme-fähig machen (ruft define() für jede Karte auf): setConfig, hass und connectedCallback umhüllen
export function themeable(cls) {
  const p = cls.prototype;
  if (p._nvThemed) return;
  p._nvThemed = true;
  const sc = p.setConfig;
  if (sc) p.setConfig = function (c) { this._nvTheme = c?.theme; apply(this); return sc.call(this, c); };
  const hd = Object.getOwnPropertyDescriptor(p, 'hass');
  if (hd?.set) Object.defineProperty(p, 'hass', {...hd, set(h) {
    const o = this._nvHass;
    this._nvHass = h;
    if (o?.states?.[STORE_ENTITY] !== h?.states?.[STORE_ENTITY]) apply(this);
    if (o && (o.themes !== h?.themes || o.selectedTheme !== h?.selectedTheme)) inherit(this);
    hd.set.call(this, h);
  }});
  const cc = p.connectedCallback;
  p.connectedCallback = function () { inherit(this); return cc?.call(this); };
}
