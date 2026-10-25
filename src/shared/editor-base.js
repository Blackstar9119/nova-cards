import {esc, toObj} from './utils.js';
import {fire} from './actions.js';
import {hassChanged, entityIds} from './lifecycle.js';

// ha-form ist lazy – einmal über den Editor einer Standardkarte nachladen
let preload;
export const loadForm = () => customElements.get('ha-form') ? Promise.resolve() : (preload ||= (async () => {
  try { await (await (await window.loadCardHelpers()).createCardElement({type: 'button', entity: 'sun.sun'}))?.constructor?.getConfigElement?.(); } catch (e) { console.warn('[nova-cards] Editor nicht vorgeladen', e); }
  await Promise.race([customElements.whenDefined('ha-form'), new Promise(r => setTimeout(r, 3000))]);
})());

// Alle Feldnamen eines ha-form-Schemas (auch in grids)
export const names = s => s.flatMap(x => x.schema ? names(x.schema) : x.name ? [x.name] : []);
const empty = v => v == null || v === '' || (Array.isArray(v) && !v.length);
// Formularwerte übernehmen, leere Felder aus der Konfig entfernen
export const merge = (base, keys, val) => { const o = {...base}; keys.forEach(k => empty(val[k]) ? delete o[k] : o[k] = val[k]); return o; };

// Änderungen werden gesammelt und erst nach dieser Pause gemeldet – sonst baut HA die Vorschau bei jedem Tastendruck neu
const DEBOUNCE = 300;

// Basis aller Editoren: Konfig rein/raus, ha-form-Felder, Aufklapp-Einträge, Buttons.
// Unterklassen setzen static labels / helpers und bauen in _build() ihre Oberfläche.
// Beim Neuaufbau werden vorhandene ha-form-Felder (mit Entitäts-, Icon- und Aktionsauswahl) weiterverwendet,
// nur ihre Werte werden aktualisiert.
export class NovaEditorBase extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this._forms = []; this._open = new Set(); this._keep = new Map(); this._ids = new Set();
    // Feld verlassen (z. B. Klick auf „Speichern“) → ausstehende Änderung sofort melden
    this.addEventListener('focusout', () => this._flush());
  }
  // hass kommt mehrmals pro Sekunde – an die Felder nur weitergeben, wenn es den Editor betrifft
  set hass(h) {
    const old = this._hass;
    this._hass = h;
    if (hassChanged(old, h, this._ids)) this._forms.forEach(f => { f.hass = h; });
  }
  setConfig(c) {
    const s = JSON.stringify(c);
    if (s === this._emitted || (this._pending && s === JSON.stringify(this._pending))) { this._config = c; return; }
    // Neue Konfig von außen (YAML, Rückgängig) hat Vorrang vor einer noch nicht gemeldeten Änderung
    clearTimeout(this._dt); this._pending = null;
    this._config = JSON.parse(s);
    this._ids = entityIds(this._config);
    this._onExternalConfig?.();
    this._rebuild();
  }
  disconnectedCallback() { this._flush(); }
  async _rebuild() {
    const id = this._bid = (this._bid || 0) + 1;
    await loadForm();
    if (id !== this._bid) return;
    this._forms = [];
    this._pool = this._keep; this._keep = new Map();
    try { this._build(); } finally { this._pool = null; }
  }
  _emit(c) {
    this._config = c;
    this._ids = entityIds(c);
    this._pending = c;
    clearTimeout(this._dt);
    this._dt = setTimeout(() => this._flush(), DEBOUNCE);
  }
  _flush() {
    clearTimeout(this._dt);
    const c = this._pending;
    if (!c) return;
    this._pending = null;
    this._emitted = JSON.stringify(c);
    fire(this, 'config-changed', {config: c});
  }
  // Element vom letzten Aufbau weiterverwenden (gleicher Typ, gleiche Reihenfolge), sonst mit create() neu erzeugen
  _reuse(type, create) {
    const el = this._pool?.get(type)?.shift() || create();
    (this._keep.get(type) || this._keep.set(type, []).get(type)).push(el);
    return el;
  }
  _form(schema, data, cb) {
    const f = this._reuse(`form:${JSON.stringify(schema)}`, () => {
      const f = document.createElement('ha-form');
      f.schema = schema;
      f.computeLabel = s => this.constructor.labels?.[s.name] ?? s.name;
      f.computeHelper = s => this.constructor.helpers?.[s.name];
      f.addEventListener('value-changed', e => { e.stopPropagation(); f.data = e.detail.value; f._dk = JSON.stringify(f.data); f._cb(e.detail.value); });
      return f;
    });
    if (f.hass !== this._hass) f.hass = this._hass;
    const dk = JSON.stringify(data);
    if (f._dk !== dk) { f.data = data; f._dk = dk; }
    f._cb = cb;
    this._forms.push(f);
    return f;
  }
  // Runder Icon-Button (Verschieben, Löschen …)
  _btn(icon, title, fn, dis) {
    const b = document.createElement('button');
    b.className = 'ib'; b.title = title; b.disabled = !!dis;
    b.innerHTML = `<ha-icon icon="${icon}"></ha-icon>`;
    b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); fn(); });
    return b;
  }
  // „+ … hinzufügen“
  _add(label, fn) {
    const a = document.createElement('button');
    a.className = 'add';
    a.innerHTML = `<ha-icon icon="mdi:plus"></ha-icon>${esc(label)}`;
    a.addEventListener('click', e => { e.preventDefault(); fn(); });
    return a;
  }
  _h3(t) { const h = document.createElement('h3'); h.textContent = t; return h; }
  _hint(t) { const p = document.createElement('p'); p.className = 'hint'; p.textContent = t; return p; }
  // Aufklapp-Eintrag; key merkt sich, ob er offen ist. Liefert [details, summary, body].
  // Mit fill(body, summary) wird der Inhalt erst beim ersten Aufklappen gebaut – zugeklappte Einträge kosten dann nichts
  _details(key, icon, label, btns, fill) {
    const d = document.createElement('details');
    d.className = 'item'; d.open = this._open.has(key);
    d.addEventListener('toggle', e => { e.stopPropagation(); d.open ? this._open.add(key) : this._open.delete(key); });
    const s = document.createElement('summary');
    s.innerHTML = `<ha-icon icon="${esc(icon)}"></ha-icon><span class="lbl"></span>`;
    s.querySelector('.lbl').textContent = label;
    s.append(...btns);
    const body = document.createElement('div'); body.className = 'body';
    d.append(s, body);
    if (fill) {
      let done = false;
      const go = () => { if (!done && d.open) { done = true; fill(body, s); } };
      d.addEventListener('toggle', go);
      go();
    }
    return [d, s, body];
  }
  // Aufklappbarer Bereich im Stil des Pop-up-Editors (Icon + Überschrift, Inhalt erst beim Aufklappen).
  // Welche Bereiche offen sind, bleibt beim Neuaufbau erhalten; anfangs offen: static openSections der Unterklasse.
  _section(key, icon, label, fill) {
    const open = this._openSecs ||= new Set(this.constructor.openSections || []), k = `sec.${key}`;
    if (open.has(key)) this._open.add(k); else this._open.delete(k);
    const [d] = this._details(k, icon, label, [], fill);
    d.classList.add('sec');
    d.addEventListener('toggle', () => { if (d.open) open.add(key); else open.delete(key); });
    return d;
  }
  // Zwischenüberschrift innerhalb eines Bereichs
  _h4(t) { const h = document.createElement('h4'); h.textContent = t; return h; }
  // Hoch / Runter / Löschen für Eintrag i von n
  _itemBtns(i, n, move, del) {
    return [
      this._btn('mdi:arrow-up', 'Nach oben', () => move(-1), i === 0),
      this._btn('mdi:arrow-down', 'Nach unten', () => move(1), i === n - 1),
      this._btn('mdi:delete-outline', 'Löschen', del)];
  }
  // Liste unter Konfig-Schlüssel k (z. B. buttons, rooms): Aufklapp-Einträge + „hinzufügen“.
  // m = {item, icon}; view bereitet einen Eintrag fürs Formular auf
  _items(k) { return [].concat(this._config[k] || []).map(toObj); }
  _setItems(k, arr) { const c = {...this._config}; if (arr.length) c[k] = arr; else delete c[k]; this._emit(c); }
  // schema darf eine Funktion des Eintrags sein (Felder je nach Einstellung); ändert sich dadurch das Schema, wird neu aufgebaut
  _itemList(w, k, schema, m, addLabel, view = it => it) {
    const items = this._items(k), sch = typeof schema === 'function' ? schema : () => schema;
    items.forEach((it, j) => {
      const [d, s] = this._details(`${k}.${j}`, it.icon || m.icon, this._ilabel(it, j, m), this._itemBtns(j, items.length,
        dir => this._moveItem(k, j, dir),
        () => { this._open = new Set(); this._setItems(k, this._items(k).filter((_, x) => x !== j)); this._rebuild(); }),
        body => { const cur = this._items(k)[j] || it; body.append(this._form(sch(cur), view(cur), v => {
          const arr = this._items(k), was = JSON.stringify(sch(arr[j]));
          arr[j] = merge(arr[j], names(sch(arr[j])), v);
          this._setItems(k, arr);
          s.querySelector('.lbl').textContent = this._ilabel(arr[j], j, m);
          if (JSON.stringify(sch(arr[j])) !== was) this._rebuild();
        })); });
      w.append(d);
    });
    w.append(this._add(addLabel, () => { const n = [...this._items(k), {}]; this._open = new Set([...this._open].filter(x => x.startsWith('sec.')).concat(`${k}.${n.length - 1}`)); this._setItems(k, n); this._rebuild(); }));
  }
  _moveItem(k, j, dir) {
    const arr = this._items(k), t = j + dir;
    [arr[j], arr[t]] = [arr[t], arr[j]];
    this._open = new Set([`${k}.${t}`]);
    this._setItems(k, arr); this._rebuild();
  }
  _ilabel(it, j, m) { return `${j + 1}. ${it.name || it.message || (it.entity && this._hass?.states[it.entity]?.attributes.friendly_name) || it.entity || `Neu: ${m.item}`}`; }
}
