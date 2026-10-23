import {esc, toObj} from './utils.js';
import {fire} from './actions.js';

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

// Basis aller Editoren: Konfig rein/raus, ha-form-Felder, Aufklapp-Einträge, Buttons.
// Unterklassen setzen static labels / helpers und bauen in _build() ihre Oberfläche.
export class NovaEditorBase extends HTMLElement {
  constructor() { super(); this.attachShadow({mode: 'open'}); this._forms = []; this._open = new Set(); }
  set hass(h) { this._hass = h; this._forms.forEach(f => { f.hass = h; }); }
  setConfig(c) {
    const s = JSON.stringify(c);
    if (s === this._emitted) { this._config = c; return; }
    this._config = JSON.parse(s);
    this._onExternalConfig?.();
    this._rebuild();
  }
  async _rebuild() { const id = this._bid = (this._bid || 0) + 1; await loadForm(); if (id === this._bid) { this._forms = []; this._build(); } }
  _emit(c) { this._config = c; this._emitted = JSON.stringify(c); fire(this, 'config-changed', {config: c}); }
  _form(schema, data, cb) {
    const f = document.createElement('ha-form');
    f.hass = this._hass; f.schema = schema; f.data = data;
    f.computeLabel = s => this.constructor.labels?.[s.name] ?? s.name;
    f.computeHelper = s => this.constructor.helpers?.[s.name];
    f.addEventListener('value-changed', e => { e.stopPropagation(); f.data = e.detail.value; cb(e.detail.value); });
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
  // Aufklapp-Eintrag; key merkt sich, ob er offen ist. Liefert [details, summary, body]
  _details(key, icon, label, btns) {
    const d = document.createElement('details');
    d.className = 'item'; d.open = this._open.has(key);
    d.addEventListener('toggle', e => { e.stopPropagation(); d.open ? this._open.add(key) : this._open.delete(key); });
    const s = document.createElement('summary');
    s.innerHTML = `<ha-icon icon="${esc(icon)}"></ha-icon><span class="lbl"></span>`;
    s.querySelector('.lbl').textContent = label;
    s.append(...btns);
    const body = document.createElement('div'); body.className = 'body';
    d.append(s, body);
    return [d, s, body];
  }
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
  _itemList(w, k, schema, m, addLabel, view = it => it) {
    const items = this._items(k), keys = names(schema);
    items.forEach((it, j) => {
      const [d, s, body] = this._details(`${k}.${j}`, it.icon || m.icon, this._ilabel(it, j, m), this._itemBtns(j, items.length,
        dir => this._moveItem(k, j, dir),
        () => { this._open = new Set(); this._setItems(k, this._items(k).filter((_, x) => x !== j)); this._rebuild(); }));
      body.append(this._form(schema, view(it), v => {
        const arr = this._items(k);
        arr[j] = merge(arr[j], keys, v);
        this._setItems(k, arr);
        s.querySelector('.lbl').textContent = this._ilabel(arr[j], j, m);
      }));
      w.append(d);
    });
    w.append(this._add(addLabel, () => { const n = [...this._items(k), {}]; this._open = new Set([`${k}.${n.length - 1}`]); this._setItems(k, n); this._rebuild(); }));
  }
  _moveItem(k, j, dir) {
    const arr = this._items(k), t = j + dir;
    [arr[j], arr[t]] = [arr[t], arr[j]];
    this._open = new Set([`${k}.${t}`]);
    this._setItems(k, arr); this._rebuild();
  }
  _ilabel(it, j, m) { return `${j + 1}. ${it.name || it.message || (it.entity && this._hass?.states[it.entity]?.attributes.friendly_name) || it.entity || `Neu: ${m.item}`}`; }
}
