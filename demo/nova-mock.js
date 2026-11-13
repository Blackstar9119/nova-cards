// Nova-Integration für die Demo: Notizen, Einkauf, Rezeptbuch und Theme im Speicher des Browsers (ohne Home Assistant).
// Bildet die WebSocket-API nach, die src/shared/nova-store.js benutzt.
const id = () => Math.random().toString(16).slice(2).padEnd(12, '0');
const now = () => Date.now() / 1000;
const T0 = now();
const stores = [{id: 's1', name: 'Lidl', icon: 'mdi:cart-outline'}, {id: 's2', name: 'dm', icon: 'mdi:lipstick'}];
// Einstellungen wie nova/settings/get; in der Demo per ?settings={"allgemein":{"animationen":"aus"}} vorbelegbar
const SETTINGS = {allgemein: {theme: null, animationen: 'normal', schriftgroesse: 'normal'}, module: {theme: true, notes: true, shopping: true, recipes: true},
  einkauf: {standard_geschaeft: null, gruppierung: 'geschaeft', todo_entity: null, bilder: true}, notizen: {standard_schriftgroesse: 'normal', kompakt: false},
  rezepte: {buch_variante: 'old', standard_portionen: 2}, mealie: {url: null, token_gesetzt: false}};
try { for (const [k, v] of Object.entries(JSON.parse(new URLSearchParams(location.search).get('settings') || '{}'))) Object.assign(SETTINGS[k], v); } catch { /* ungültig → Standard */ }
const db = {
  settings: SETTINGS,
  theme: {theme: null, themes: ['blau', 'hell', 'midnight', 'velvet']},
  notes: {notes: [
    {id: 'n1', title: 'Wochenende', body: '<h3>Samstag</h3><ul class="check"><li class="done">Auto waschen</li><li>Rasen mähen</li><li>Getränke holen</li></ul><p><span class="c-warn">Nicht vergessen:</span> Geschenk für <b>Oma</b></p>', pinned: true, created: T0 - 9e4, updated: T0 - 1800},
    {id: 'n2', title: 'WLAN Gäste', body: '<p>Name: <b>Nova-Gast</b></p><p><span class="c-muted">Passwort hängt am Kühlschrank</span></p>', pinned: false, created: T0 - 3e5, updated: T0 - 9e4},
    {id: 'n3', title: 'Ideen Garten', body: '<ul><li>Hochbeet</li><li><i>Lichterkette</i> am Zaun</li></ul>', pinned: false, created: T0 - 9e5, updated: T0 - 6e5}]},
  shopping: {stores, units: ['Stk', 'g', 'kg', 'ml', 'l', 'Packung'], sync_entity: null,
    items: [
      {id: 'i1', name: 'Hafermilch', qty: 2, unit: 'l', store: 's1', icon: 'mdi:cup-water', image: null, note: '<i>ungesüßt</i>', done: false},
      {id: 'i2', name: 'Äpfel', qty: 6, unit: 'Stk', store: 's1', icon: 'mdi:food-apple', image: null, note: '', done: false},
      {id: 'i3', name: 'Mehl', qty: 500, unit: 'g', store: 's1', icon: 'mdi:barley', image: null, note: '', done: false},
      {id: 'i4', name: 'Zahnpasta', qty: 1, unit: 'Stk', store: 's2', icon: 'mdi:toothbrush-paste', image: null, note: '', done: false},
      {id: 'i5', name: 'Batterien AA', qty: 1, unit: 'Packung', store: null, icon: 'mdi:battery-outline', image: null, note: '', done: false},
      {id: 'i6', name: 'Brot', qty: 1, unit: 'Stk', store: 's1', icon: 'mdi:bread-slice', image: null, note: '', done: true}],
    history: [['Kaffeebohnen', 'mdi:coffee'], ['Butter', 'mdi:cheese'], ['Eier', 'mdi:egg-outline'], ['Nudeln', 'mdi:pasta'], ['Bananen', 'mdi:nutrition']]
      .map(([name, icon], i) => ({key: name.toLowerCase(), name, icon, image: null, unit: 'Stk', store: 's1', count: 5 - i, last: T0 - i}))},
  recipes: {units: ['Stk', 'g', 'kg', 'ml', 'l', 'Packung', 'TL', 'EL', 'Prise', 'Msp.', 'Tasse', 'Cup', 'Becher', 'cl', 'Bund', 'Dose', 'Glas', 'Zehe', 'Scheibe', 'Blatt', 'Handvoll', ''], recipes: [
    {id: 'r1', title: 'Pfannkuchen', image: null, servings: 2, time: 20, tags: ['süß', 'schnell'], favorite: true, updated: T0,
      ingredients: [{name: 'Mehl', qty: 250, unit: 'g'}, {name: 'Milch', qty: 500, unit: 'ml'}, {name: 'Eier', qty: 3, unit: 'Stk'}, {name: 'Salz', qty: 1, unit: 'Prise'}, {name: 'Butter zum Braten', qty: null, unit: ''}],
      steps: '<ul class="check"><li>Mehl, Milch, Eier und Salz <b>glatt rühren</b></li><li>20 Minuten ruhen lassen</li><li>In Butter goldbraun backen</li></ul>'},
    {id: 'r2', title: 'Tomatensoße', image: null, servings: 4, time: 35, tags: ['vegetarisch'], favorite: false, updated: T0,
      ingredients: [{name: 'Tomaten', qty: 2, unit: 'Dose'}, {name: 'Knoblauch', qty: 2, unit: 'Zehe'}, {name: 'Basilikum', qty: 1, unit: 'Bund'}], steps: '<p>Alles köcheln lassen.</p>'},
    {id: 'r3', title: 'Linsensuppe mit Würstchen', image: null, servings: 4, time: 75, tags: ['herzhaft'], favorite: false, updated: T0, ingredients: [], steps: ''}]},
};
const subs = {settings: new Set(), theme: new Set(), notes: new Set(), shopping: new Set(), recipes: new Set()};
const push = k => subs[k].forEach(cb => cb(JSON.parse(JSON.stringify(db[k]))));
const upsert = (arr, data, fresh) => {
  let x = arr.find(y => y.id === data.id);
  if (!x) { x = {id: id(), created: now(), ...fresh}; arr.unshift(x); }
  Object.assign(x, data, {id: x.id, updated: now()});
  return x;
};

export const novaSubscribe = (cb, m) => {
  const k = /^nova\/(\w+)\/subscribe$/.exec(m.type)?.[1];
  if (!subs[k]) return null;
  subs[k].add(cb);
  queueMicrotask(() => cb(JSON.parse(JSON.stringify(db[k]))));
  return () => subs[k].delete(cb);
};
export const novaCall = m => {
  const [, mod, cmd] = /^nova\/(\w+)\/(\w+)$/.exec(m.type) || [];
  if (!mod) return undefined;
  const s = db.shopping;
  let res = {};
  if (mod === 'theme') db.theme.theme = m.theme;
  else if (mod === 'settings' && cmd === 'set') { for (const [k, v] of Object.entries(m.settings)) Object.assign(db.settings[k], v); res = db.settings; }
  else if (mod === 'notes' && cmd === 'save') res = {note: upsert(db.notes.notes, m.note, {title: '', body: '', pinned: false})};
  else if (mod === 'notes') db.notes.notes = db.notes.notes.filter(n => n.id !== m.note_id);
  else if (cmd === 'item_save') {
    const was = s.items.find(i => i.id === m.item.id), h = s.history.find(x => x.key === String(m.item.name || '').toLowerCase());
    const it = upsert(s.items, m.item, {qty: 1, unit: h?.unit || 'Stk', store: h?.store || null, icon: h?.icon || null, image: h?.image || null, note: '', done: false});
    if (it.done && !was?.done) { s.history = s.history.filter(x => x.key !== it.name.toLowerCase()); s.history.unshift({key: it.name.toLowerCase(), name: it.name, icon: it.icon, image: it.image, unit: it.unit, store: it.store, count: 1, last: now()}); }
    res = {item: it};
  } else if (cmd === 'item_delete') s.items = s.items.filter(i => i.id !== m.item_id);
  else if (cmd === 'clear_done') s.items = s.items.filter(i => !i.done);
  else if (cmd === 'history_delete') s.history = s.history.filter(x => x.key !== m.key);
  else if (cmd === 'store_save') res = {store: upsert(s.stores, m.store, {icon: 'mdi:store-outline'})};
  else if (cmd === 'store_delete') { s.stores = s.stores.filter(x => x.id !== m.store_id); s.items.forEach(i => { if (i.store === m.store_id) i.store = null; }); }
  else if (cmd === 'set_sync') s.sync_entity = m.entity_id;
  else if (mod === 'recipes' && cmd === 'save') res = {recipe: upsert(db.recipes.recipes, m.recipe, {image: null, servings: 2, time: null, tags: [], ingredients: [], steps: '', favorite: false})};
  else if (mod === 'recipes' && cmd === 'import') {
    // Demo: „kein“ im Link = Seite ohne Rezept, „pfannkuchen“ = schon im Buch, sonst eine Lasagne
    if (/kein/i.test(m.url)) throw {code: 'no_recipe', message: 'Mein Kochblog'};
    const pk = /pfannkuchen/i.test(m.url);
    const recipe = {title: pk ? 'Pfannkuchen' : 'Lasagne von Oma', servings: 4, time: 75, tags: ['Pasta', 'Auflauf'], source: m.url, image_data: null,
      ingredients: [{qty: 500, unit: 'g', name: 'Hackfleisch'}, {qty: 1, unit: '', name: 'Zwiebel'}, {qty: 2, unit: 'EL', name: 'Olivenöl'}, {qty: 1.5, unit: 'Tasse', name: 'Milch'}, {qty: 1, unit: 'Packung', name: 'Lasagneplatten'}, {qty: null, unit: '', name: 'Salz und Pfeffer'}],
      steps: '<ol><li>Zwiebel würfeln und anbraten.</li><li>Hack dazu und würzen.</li><li>Schichten und 45 Minuten backen.</li></ol>'};
    const key = t => t.toLowerCase().replace(/[^a-z0-9äöüß]+/g, '');
    res = {recipe, duplicates: db.recipes.recipes.filter(r => r.source === m.url || key(r.title) === key(recipe.title)).map(r => ({id: r.id, title: r.title}))};
  }
  else if (mod === 'recipes' && cmd === 'delete') db.recipes.recipes = db.recipes.recipes.filter(r => r.id !== m.recipe_id);
  else if (cmd === 'to_shopping') {
    const r = db.recipes.recipes.find(x => x.id === m.recipe_id), k = (m.servings || r.servings) / r.servings;
    r.ingredients.forEach((g, i) => { if (!m.only || m.only.includes(i)) upsert(s.items, {name: g.name, qty: g.qty == null ? 1 : Math.round(g.qty * k * 100) / 100, unit: s.units.includes(g.unit) ? g.unit : 'Stk'}, {store: null, icon: null, image: null, note: '', done: false}); });
    push('shopping'); res = {added: r.ingredients.length};
  } else if (mod === 'image') {
    // Demo: Bild bleibt als data-URL im Speicher (echte Integration: Datei in /config/www/nova/)
    const name = `${id()}${id()}${id().slice(0, 8)}.webp`;
    (window.__novaImages ||= {})[name] = m.data;
    res = {image: name, url: m.data};
  }
  if (subs[mod]) push(mod);
  return res;
};
