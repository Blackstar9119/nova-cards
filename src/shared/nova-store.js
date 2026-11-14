// Zugriff auf die Nova-Integration (custom_components/nova_homeverse) – die EINZIGE Stelle, die ihre WebSocket-API kennt.
// Daten (Notizen, Einkaufsliste, Bilder) liegen in Home Assistant, damit alle Geräte dasselbe sehen.
// Ein Abo je Modul (theme, notes, shopping, recipes) und Verbindung, egal wie viele Karten es nutzen.

const subs = new WeakMap(); // connection → {kind: {data, err, cards:Set, unsub, timer}}
const STOP_DELAY = 5000;    // Abo kurz offen halten (Ansicht wechseln, Pop-up schließen …)

// Fehlercodes: missing = Integration nicht installiert/eingerichtet, disabled = Modul in den Optionen aus
const reason = err => err?.code === 'unknown_command' || err?.code === 'not_ready' ? 'missing' : err?.code === 'module_disabled' ? 'disabled' : 'failed';
const MODULE_NAMES = {notes: 'Notizen', shopping: 'Einkauf', recipes: 'Rezeptbuch', theme: 'Theme'};
// Hinweistext zu einem Fehlercode: [icon, text]
export const storeHint = (err, kind) => err === 'missing'
  ? ['mdi:puzzle-plus-outline', 'Die Integration Nova Homeverse fehlt. Im Marketplace „Nova Homeverse“ installieren und unter Einstellungen → Geräte & Dienste hinzufügen.']
  : err === 'disabled' ? ['mdi:toggle-switch-off-outline', `Das Modul „${MODULE_NAMES[kind] || kind}“ ist in den Optionen von Nova Homeverse abgeschaltet.`]
    : ['mdi:alert-circle-outline', 'Die Daten konnten nicht geladen werden.'];

// Karte meldet sich an: onChange(data, err) bei jeder Änderung. Liefert eine Abmeldefunktion.
export function watch(hass, kind, card, onChange) {
  const conn = hass?.connection;
  if (!conn) return () => {};
  const all = subs.get(conn) || subs.set(conn, {}).get(conn);
  const s = all[kind] ||= {data: null, err: null, cards: new Map(), unsub: null};
  clearTimeout(s.timer);
  s.cards.set(card, onChange);
  if (s.data || s.err) queueMicrotask(() => s.cards.get(card)?.(s.data, s.err));
  if (!s.unsub) {
    s.unsub = conn.subscribeMessage(d => {
      s.data = d; s.err = null;
      s.cards.forEach(fn => fn(d, null));
    }, {type: `nova_homeverse/${kind}/subscribe`}).catch(err => {
      s.err = reason(err); s.unsub = null;
      if (s.err !== 'missing') console.warn(`[nova-cards] Nova-Integration: Abo ${kind} fehlgeschlagen`, err);
      s.cards.forEach(fn => fn(s.data, s.err));
      return null;
    });
  }
  return () => {
    s.cards.delete(card);
    if (s.cards.size) return;
    clearTimeout(s.timer);
    s.timer = setTimeout(() => {
      if (s.cards.size) return;
      const u = s.unsub;
      s.unsub = null; s.data = null; s.err = null;
      u?.then(f => typeof f === 'function' && f()).catch(() => {});
    }, STOP_DELAY);
  };
}

const ws = (hass, type, data = {}) => hass.callWS({type, ...data});

export const notes = {
  save: (hass, note) => ws(hass, 'nova_homeverse/notes/save', {note}).then(r => r.note),
  remove: (hass, id) => ws(hass, 'nova_homeverse/notes/delete', {note_id: id}),
};

export const shop = {
  save: (hass, item) => ws(hass, 'nova_homeverse/shopping/item_save', {item}).then(r => r.item),
  remove: (hass, id) => ws(hass, 'nova_homeverse/shopping/item_delete', {item_id: id}),
  clearDone: hass => ws(hass, 'nova_homeverse/shopping/clear_done'),
  reorder: (hass, ids) => ws(hass, 'nova_homeverse/shopping/reorder', {ids}),
  forget: (hass, key) => ws(hass, 'nova_homeverse/shopping/history_delete', {key}),
  saveStore: (hass, store) => ws(hass, 'nova_homeverse/shopping/store_save', {store}).then(r => r.store),
  removeStore: (hass, id) => ws(hass, 'nova_homeverse/shopping/store_delete', {store_id: id}),
  setSync: (hass, entityId) => ws(hass, 'nova_homeverse/shopping/set_sync', {entity_id: entityId || null}),
};

export const recipes = {
  save: (hass, recipe) => ws(hass, 'nova_homeverse/recipes/save', {recipe}).then(r => r.recipe),
  remove: (hass, id) => ws(hass, 'nova_homeverse/recipes/delete', {recipe_id: id}),
  // Zutaten auf die Einkaufsliste; servings rechnet um, only = Positionen der Zutaten
  // Rezeptseite lesen → {recipe: Entwurf (mit image_data, source), duplicates}; speichert nichts
  importUrl: (hass, url) => ws(hass, 'nova_homeverse/recipes/import', {url}),
  toShopping: (hass, id, servings, only) => ws(hass, 'nova_homeverse/recipes/to_shopping', {recipe_id: id, ...(servings ? {servings} : {}), ...(only ? {only} : {})}).then(r => r.added),
};

export const theme = {set: (hass, key) => ws(hass, 'nova_homeverse/theme/set', {theme: key})};

// Bild hochladen (data-URL, schon verkleinert); module = shopping | recipes. Liefert {image, url}
export const uploadImage = (hass, module, data) => ws(hass, 'nova_homeverse/image/upload', {module, data});
// Adresse eines gespeicherten Bilds (liegt in /config/www/nova_homeverse/<modul>/)
export const imageUrl = (hass, module, name) => {
  if (!name || !/^[a-f0-9]{32}\.(webp|jpg|png)$/.test(name)) return '';
  const path = `/local/nova_homeverse/${module}/${name}`;
  return hass?.hassUrl ? hass.hassUrl(path) : path;
};
