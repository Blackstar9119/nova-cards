/* Theme am Kartenelement setzen. Reihenfolge: theme der Karte → Theme-Variable nova-theme (vom HA-Theme des Geräts
   oder von einer umgebenden Nova-Karte mit eigenem Theme) → globaler Speicher (theme-store.js) → Nova Blau.
   Das Ergebnis steht als Attribut nova-theme am Element (Blau = kein Attribut); die Werte setzt theme.js per CSS. */
import {THEMES} from './theme.js';
import {readTheme, STORE_ENTITY, THEME_EVENT} from './theme-store.js';
import {settingsOf, SETTINGS_EVENT} from './settings-store.js';
import {applyBackdrop} from './backdrop.js';

// Eingehängte Karten – wechselt das Theme in der Nova-Integration, bekommen alle das neue
const cards = new Set();
window.addEventListener(THEME_EVENT, () => cards.forEach(apply));
window.addEventListener(SETTINGS_EVENT, () => cards.forEach(apply));

// Nova-Einstellungen allgemein.animationen / schriftgroesse → Attribute nova-motion / nova-size (CSS in theme.js).
// Normal = kein Attribut, damit sich ohne Einstellung nichts ändert.
const MOTION = {vereinfacht: 'reduced', aus: 'off'};
const SIZE = {klein: 'klein', gross: 'gross'};
const attr = (el, name, v) => { if (!v) { if (el.hasAttribute(name)) el.removeAttribute(name); } else if (el.getAttribute(name) !== v) el.setAttribute(name, v); };

const valid = v => { const k = String(v || '').trim().toLowerCase(); return k && k !== 'global' && THEMES[k] ? k : undefined; };

function apply(el) {
  const own = valid(el._nvTheme);
  // Ein eigenes Theme gilt auch für Karten darin (Pop-up, Bereich, Swipe, Navi-Pop-up)
  if (own) el.style.setProperty('--nova-theme', own); else el.style.removeProperty('--nova-theme');
  const g = settingsOf(el._nvHass)?.allgemein;
  attr(el, 'nova-motion', MOTION[g?.animationen]);
  attr(el, 'nova-size', SIZE[g?.schriftgroesse]);
  applyBackdrop(el._nvHass, cards.size);
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
    if (!o || o.states?.[STORE_ENTITY] !== h?.states?.[STORE_ENTITY]) apply(this);
    if (o && (o.themes !== h?.themes || o.selectedTheme !== h?.selectedTheme)) inherit(this);
    hd.set.call(this, h);
  }});
  const cc = p.connectedCallback;
  p.connectedCallback = function () { cards.add(this); inherit(this); return cc?.call(this); };
  const dc = p.disconnectedCallback;
  p.disconnectedCallback = function () { cards.delete(this); if (!cards.size) applyBackdrop(null, 0); return dc?.call(this); };
}
