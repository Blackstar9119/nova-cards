/* Speicher des globalen Nova-Themes – die EINZIGE Stelle, die weiß, wo das Theme liegt.
   Mit der Nova-Integration (Modul „Theme“) liegt es dort und kommt per Abo. Ohne sie bleibt es beim Helfer
   input_select.nova_theme, den der Themes Schalter beim ersten Umschalten selbst anlegt. */
import {THEMES, THEME_KEYS} from './theme.js';
import {theme as novaTheme} from './nova-store.js';

// Stand je Verbindung: {key, ok} – ok = Integration antwortet. Ein Abo für alle Karten, bleibt für die Sitzung offen.
const live = new WeakMap();
export const THEME_EVENT = 'nova-theme-store';
function integration(h) {
  const conn = h?.connection;
  if (!conn?.subscribeMessage) return null;
  let s = live.get(conn);
  if (!s) {
    live.set(conn, s = {key: undefined, ok: false});
    conn.subscribeMessage(m => {
      s.ok = true; s.key = THEMES[m?.theme] ? m.theme : undefined;
      window.dispatchEvent(new CustomEvent(THEME_EVENT));
    }, {type: 'nova/theme/subscribe'}).catch(() => { /* Integration fehlt oder Modul aus → Helfer */ });
  }
  return s;
}

export const STORE_ENTITY = 'input_select.nova_theme';
const ID = 'nova_theme', NAME = 'Nova Theme', ICON = 'mdi:palette-outline';
const options = () => THEME_KEYS.map(k => THEMES[k].name);
const keyOf = v => THEME_KEYS.find(k => THEMES[k].name === v || k === v);

// Entitäten, deren Änderung das globale Theme betrifft (für hassChanged)
export const storeIds = () => [STORE_ENTITY];
// Globales Theme als Schlüssel (blau, hell …); undefined, solange es noch keinen Speicher gibt
export const readTheme = h => { const s = integration(h); return (s?.ok && s.key) || keyOf(h?.states?.[STORE_ENTITY]?.state); };
export const hasStore = h => !!integration(h)?.ok || !!h?.states?.[STORE_ENTITY];
// Anlegen und Ändern von Helfern darf in Home Assistant nur ein Administrator; mit der Integration darf es jeder
export const canSetup = h => !!integration(h)?.ok || !!h?.user?.is_admin;

// Fehler mit code: 'admin' (Speicher fehlt, Nutzer ist kein Admin) oder 'failed'
const fail = (code, msg) => Object.assign(new Error(msg), {code});

// Speicher anlegen bzw. neue Themes als Optionen nachtragen
async function setup(h) {
  if (!canSetup(h)) throw fail('admin', 'Das Theme kann erst ein Administrator einrichten.');
  const items = await h.callWS({type: 'input_select/list'}).catch(() => []);
  const it = items.find(i => i.id === ID);
  if (!it) await h.callWS({type: 'input_select/create', name: NAME, icon: ICON, options: options()});
  else await h.callWS({type: 'input_select/update', input_select_id: ID, name: it.name || NAME, icon: it.icon || ICON,
    options: [...new Set([...(it.options || []), ...options()])]});
}

// Theme global setzen – alle Geräte zeigen danach dasselbe Theme
export async function setTheme(h, key) {
  const name = THEMES[key]?.name;
  if (!name) throw fail('failed', `Unbekanntes Theme: ${key}`);
  if (integration(h)?.ok) {
    try { await novaTheme.set(h, key); return; } catch (e) { throw fail('failed', e?.message || 'Theme konnte nicht gespeichert werden.'); }
  }
  const st = h.states[STORE_ENTITY];
  if (!st || !st.attributes.options?.includes(name)) await setup(h);
  try { await h.callService('input_select', 'select_option', {option: name}, {entity_id: STORE_ENTITY}); }
  catch (e) { throw fail('failed', e?.message || 'Theme konnte nicht gespeichert werden.'); }
}
