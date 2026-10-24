import {tag} from './define.js';
import {navigate} from './actions.js';

// Gemeinsamer Stand aller Nova Pop-ups (genutzt von Pop-up Card und Dock):
// welche Karte zu welchem Hash gehört, Hash lesen/setzen/entfernen, Scroll-Sperre, Pop-ups im Dashboard finden.
// Dev- und HACS-Build bleiben über tag() getrennt.

const KEY = `__${tag('popups')}`;
// Hash → Set der verbundenen Pop-up-Karten
export const popups = () => (window[KEY] ||= new Map());
export const register = (h, card) => { const m = popups(); (m.get(h) || m.set(h, new Set()).get(h)).add(card); };
export const unregister = (h, card) => { const s = popups().get(h); if (s) { s.delete(card); if (!s.size) popups().delete(h); } };
// Gibt es für den Hash eine echte Karte in der aktuellen Ansicht (nicht die Ersatzkarte des Docks)?
export const hasPopup = h => [...(popups().get(h) || [])].some(p => !p._fallback && p.isConnected);

// „#Wohn zimmer“ → „Wohn-zimmer“
export const cleanHash = h => String(h ?? '').trim().replace(/^#+/, '').replace(/\s+/g, '-');
export const curHash = () => { const s = location.hash.slice(1); try { return decodeURIComponent(s); } catch { return s; } };
export const openPopup = h => { if (h && curHash() !== h) navigate(`#${encodeURIComponent(h)}`); };

// Verlauf mitschreiben: Kam der Hash per Navigation auf derselben Seite dazu, schließt „Zurück“ das Pop-up,
// ohne die Seite zu verlassen. Wurde die Seite direkt mit #hash geöffnet, wird der Hash nur ersetzt.
let prev = null, cur = location.href;
const track = () => { if (location.href !== cur) { prev = cur; cur = location.href; } };
['popstate', 'hashchange', 'location-changed'].forEach(ev => window.addEventListener(ev, track));
const base = u => { try { const x = new URL(u); return x.origin + x.pathname + x.search; } catch { return ''; } };
export const cameByNav = () => { track(); return !!prev && base(prev) === base(location.href) && !new URL(prev).hash; };
export const clearHash = back => {
  if (back) return history.back();
  history.replaceState(history.state, '', location.pathname + location.search);
  window.dispatchEvent(new CustomEvent('location-changed', {detail: {replace: true}}));
};
// Offenes Pop-up zum Hash schließen (vom Dock beim zweiten Antippen)
export const closePopup = h => { const p = [...(popups().get(h) || [])].find(x => x._isOpen); if (p) p.close(); else if (curHash() === h) clearHash(false); };

// Seite hinter dem Pop-up nicht mitscrollen lassen (Zähler, falls mehrere offen sind)
let locks = 0, saved = null;
export const lockScroll = on => {
  const els = [document.documentElement, document.body];
  if (on && locks++ === 0) { saved = els.map(e => e.style.overflow); els.forEach(e => { e.style.overflow = 'hidden'; }); }
  if (!on && locks > 0 && --locks === 0) els.forEach((e, i) => { e.style.overflow = saved?.[i] || ''; });
};

// Pop-up-Konfigurationen im Dashboard suchen (für Dock und Dock-Editor)
export const findPopups = (o, out = []) => {
  if (!o || typeof o !== 'object') return out;
  if (o.type === `custom:${tag('popup-card')}` && o.hash) out.push(o);
  else Object.values(o).forEach(v => findPopups(v, out));
  return out;
};
// URL-Pfad des aktuellen Dashboards (null = Standard-Dashboard)
export const dashPath = () => { const p = location.pathname.split('/')[1]; return !p || p === 'lovelace' ? null : p; };
const CACHE = {};
// HA-INTERN: WebSocket „lovelace/config“ liefert die Dashboard-Konfiguration (wie beim Dock mit „source“)
export const dashPopups = (hass, path = dashPath(), fresh) => {
  const k = path ?? '', c = CACHE[k];
  if (c && !fresh && Date.now() - c.t < 15000) return c.p;
  const p = Promise.resolve().then(() => hass.callWS({type: 'lovelace/config', url_path: path})).then(cfg => findPopups(cfg)).catch(() => []);
  CACHE[k] = {t: Date.now(), p};
  return p;
};
export const findPopup = async (hass, h, alt) => {
  const paths = [dashPath()];
  if (alt) paths.push(alt === 'default' ? null : alt);
  for (const p of paths) {
    const hit = (await dashPopups(hass, p)).find(c => cleanHash(c.hash) === h);
    if (hit) return hit;
  }
  return null;
};
