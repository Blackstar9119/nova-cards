import {define, docUrl, tag} from './shared/define.js';
import {esc} from './shared/utils.js';
import {areaOf} from './shared/state.js';
import {moreInfo, hassAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {CARD_CSS, EDITOR_CSS, MAPROW_CSS} from './shared/styles.js';
import {hassChanged, entityIds} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';

/* ---------- Farben ---------- */
// Farbton (0–360°) + Sättigung (0–1) → [r, g, b] bei voller Helligkeit
function hsToRgb(hue, sat) {
  const f = n => { const k = (n + hue / 60) % 6; return Math.round(255 * (1 - sat * Math.max(0, Math.min(k, 4 - k, 1)))); };
  return [f(5), f(3), f(1)];
}
const rgbToHex = rgb => '#' + rgb.map(x => x.toString(16).padStart(2, '0')).join('');
const hexToRgb = hex => { const n = parseInt(hex.slice(1), 16); return [n >> 16 & 255, n >> 8 & 255, n & 255]; };
// Farbtemperatur in Kelvin → [r, g, b] (Näherung nach Tanner Helland)
function kelvinToRgb(k) {
  const t = k / 100;
  const r = t <= 66 ? 255 : 329.7 * Math.pow(t - 60, -0.1332);
  const g = t <= 66 ? 99.47 * Math.log(t) - 161.12 : 288.12 * Math.pow(t - 60, -0.0755);
  const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04;
  return [r, g, b].map(x => Math.max(0, Math.min(255, Math.round(x))));
}
const COLOR_MODES = ['hs', 'xy', 'rgb', 'rgbw', 'rgbww'];
const hasColor = a => (a.supported_color_modes || []).some(m => COLOR_MODES.includes(m));
const hasColorTemp = a => (a.supported_color_modes || []).includes('color_temp');
// Farbknopf-Wert: "#rrggbb" oder "k2700" (Weißton in Kelvin)
const swatchCss = v => v.startsWith('k') ? rgbToHex(kelvinToRgb(+v.slice(1))) : v;
const swatchService = v => v.startsWith('k') ? {color_temp_kelvin: +v.slice(1)} : {rgb_color: hexToRgb(v)};

/* ---------- Farbscheibe (für den Editor) ---------- */
const COLOR_INPUT_CSS = `
:host{display:block}
.w{display:flex;flex-direction:column;gap:12px;padding:12px;border-radius:12px;background:var(--secondary-background-color)}
.disc{position:relative;width:min(240px,100%);aspect-ratio:1;align-self:center;border-radius:50%;touch-action:none;cursor:crosshair;
background:radial-gradient(closest-side,#fff,rgba(255,255,255,0)),conic-gradient(from 90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00);
box-shadow:0 2px 10px rgba(0,0,0,.3)}
.mk{position:absolute;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;border:3px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.6);pointer-events:none;display:none}
.lbl{font-size:12px;opacity:.7}
.kt{-webkit-appearance:none;appearance:none;width:100%;height:24px;border-radius:12px;margin:0;outline:none;background:linear-gradient(90deg,#ffa94d,#fff1dc,#cfe3ff)}
.kt::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:#fff;border:3px solid rgba(0,0,0,.3)}
.kt::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:#fff;border:3px solid rgba(0,0,0,.3)}
.row{display:flex;align-items:center;gap:10px}
.sw{width:36px;height:36px;border-radius:50%;flex:none;border:2px solid var(--divider-color,#888);background:transparent}
button{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;border-radius:999px;border:none;background:var(--primary-color);color:var(--text-primary-color,#fff);font:inherit;font-weight:600;cursor:pointer}
button:disabled{opacity:.4;cursor:default}
ha-icon{--mdc-icon-size:18px;display:flex}`;

// <nova-color-input kmin kmax>: Farbe oder Weißton wählen, feuert „color-add“ mit {value}
class NovaColorInput extends HTMLElement {
  connectedCallback() {
    if (this._built) return;
    this._built = true;
    const kmin = +(this.getAttribute('kmin') || 2000), kmax = +(this.getAttribute('kmax') || 6500), r = this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${COLOR_INPUT_CSS}</style><div class="w">
<div class="disc"><div class="mk"></div></div>
<div class="lbl">oder Weißton</div><input class="kt" type="range" min="${kmin}" max="${kmax}" step="100" value="${Math.round((kmin + kmax) / 200) * 100}">
<div class="row"><div class="sw"></div><button disabled><ha-icon icon="mdi:plus"></ha-icon>Als Knopf hinzufügen</button></div></div>`;
    const disc = r.querySelector('.disc'), mark = r.querySelector('.mk'), swatch = r.querySelector('.sw'), add = r.querySelector('button'), kelvin = r.querySelector('.kt');
    const pick = v => { this._v = v; swatch.style.background = swatchCss(v); add.disabled = false; };
    const fromPointer = e => {
      const b = disc.getBoundingClientRect(), rad = b.width / 2, x = e.clientX - b.left - rad, y = e.clientY - b.top - rad;
      const hue = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360, sat = Math.min(1, Math.hypot(x, y) / rad), hex = rgbToHex(hsToRgb(hue, sat));
      Object.assign(mark.style, {display: 'block', left: `${50 + Math.cos(hue * Math.PI / 180) * sat * 50}%`, top: `${50 + Math.sin(hue * Math.PI / 180) * sat * 50}%`, background: hex});
      pick(hex);
    };
    disc.addEventListener('pointerdown', e => { disc.setPointerCapture?.(e.pointerId); this._drag = true; fromPointer(e); });
    disc.addEventListener('pointermove', e => this._drag && fromPointer(e));
    disc.addEventListener('pointerup', e => { this._drag = false; fromPointer(e); });
    kelvin.addEventListener('input', () => { mark.style.display = 'none'; pick(`k${kelvin.value}`); });
    add.addEventListener('click', e => { e.preventDefault(); if (this._v) this.dispatchEvent(new CustomEvent('color-add', {detail: {value: this._v}})); });
  }
}
define('color-input', NovaColorInput);

/* ---------- Editor Licht Card ---------- */
const MAIN = [
  {type: 'grid', name: '', schema: [{name: 'title', selector: {text: {}}}, {name: 'icon', selector: {icon: {}}}]},
  {name: 'area', selector: {area: {}}},
  {name: 'exclude', selector: {entity: {multiple: true, domain: 'light'}}},
  {type: 'grid', name: '', schema: [{name: 'show_header', selector: {boolean: {}}}, {name: 'show_all_off', selector: {boolean: {}}}, {name: 'use_light_color', selector: {boolean: {}}}, {name: 'show_colors', selector: {boolean: {}}}]},
];
const LAMP = [
  {name: 'entity', required: true, selector: {entity: {domain: 'light'}}},
  {type: 'grid', name: '', schema: [{name: 'name', selector: {text: {}}}, {name: 'icon', selector: {icon: {}}, context: {icon_entity: 'entity'}}]},
  {name: 'tap_action', selector: {ui_action: {}}},
  {name: 'hold_action', selector: {ui_action: {}}},
];
const EDITOR_DEFAULTS = {show_header: true, show_all_off: true, use_light_color: true, show_colors: true};
const toLamp = x => typeof x === 'string' ? {entity: x} : {...x};
const LIGHT_EDITOR_CSS = `
.dots{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.dot{position:relative;width:30px;height:30px;border-radius:50%;border:2px solid var(--divider-color,#888);box-sizing:border-box}
.dot button{position:absolute;top:-6px;right:-6px;width:18px;height:18px;padding:0;border-radius:50%;border:none;background:var(--error-color,#db4437);color:#fff;font:700 12px/18px sans-serif;cursor:pointer}
.sub{font-size:13px;font-weight:600;margin:4px 0 0}`;

// Intern sind Lampen immer Objekte in this._config.entities; gespeichert wird so knapp wie möglich ("- light.x")
class NovaLightCardEditor extends NovaEditorBase {
  static labels = {
    title: 'Titel', icon: 'Icon', area: 'Bereich (alle Lampen automatisch)', exclude: 'Ausblenden (bei Bereich)', show_header: 'Kopfzeile',
    show_all_off: '„Alle aus“-Knopf', use_light_color: 'In Lichtfarbe leuchten', show_colors: 'Farbknöpfe anzeigen',
    entity: 'Lampe', name: 'Name', tap_action: 'Aktion beim Antippen', hold_action: 'Aktion bei langem Drücken',
  };
  static helpers = {area: 'Optional. Neue Lampen im Bereich erscheinen von selbst'};
  setConfig(c) { if (JSON.stringify(c) !== this._emitted) super.setConfig(c); }
  _onExternalConfig() {
    const c = this._config;
    if (c.entity) { c.entities = [c.entity, ...(c.entities || [])]; delete c.entity; }
    c.entities = (c.entities || []).map(toLamp);
    this._pickerOpen ||= new Set();
  }
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${EDITOR_CSS}${MAPROW_CSS}${LIGHT_EDITOR_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), keys = names(MAIN);
    w.append(this._form(MAIN, {...EDITOR_DEFAULTS, ...this._config}, v => this._emit(this._clean(merge(this._config, keys, v)))));
    w.append(this._h3('Lampen'), this._hint('Genau eine Lampe (ohne Bereich) = Einzelkachel. Mehrere = Sammelkarte.'));
    this._config.entities.forEach((l, i) => w.append(this._lamp(l, i)));
    w.append(this._add('Lampe hinzufügen', () => {
      const lamps = [...this._config.entities, {entity: ''}];
      this._open.add(lamps.length - 1);
      this._set(lamps);
      this._rebuild();
    }));
    w.append(this._h3('Farbknöpfe für alle Lampen'), this._colors('all', this._config.colors || [], colors => {
      this._emit(this._clean({...this._config, colors}));
      this._config.entities = this._internal;
    }));
  }
  // Standardwerte und leere Farblisten weglassen, Lampen ohne Extras als reine Entity-ID
  _clean(c) {
    const out = {...c};
    this._internal = (c.entities || []).map(toLamp);
    Object.entries(EDITOR_DEFAULTS).forEach(([k, v]) => out[k] === v && delete out[k]);
    if (!out.colors?.length) delete out.colors;
    out.entities = this._internal.map(l => {
      const o = {...l};
      if (!o.colors?.length) delete o.colors;
      return Object.keys(o).length === 1 && o.entity ? o.entity : o;
    });
    return out;
  }
  _set(lamps) {
    this._emit(this._clean({...this._config, entities: lamps}));
    this._config.entities = this._internal;
  }
  _emit(c) {
    super._emit(c);
    this._config = {...c, entities: this._internal || (c.entities || []).map(toLamp)};
  }
  _label(l, i) {
    const s = l.entity ? this._hass?.states[l.entity] : null;
    return `${i + 1}. ${l.name || s?.attributes.friendly_name || l.entity || 'Neue Lampe'}`;
  }
  _lamp(l, i) {
    const n = this._config.entities.length;
    const keys = names(LAMP);
    const [d] = this._details(i, l.icon || 'mdi:lightbulb', this._label(l, i), this._itemBtns(i, n, dir => this._move(i, dir), () => this._removeLamp(i)), (body, s) => this._lampBody(body, s, l, i, keys));
    return d;
  }
  _lampBody(body, s, l, i, keys) {
    body.append(this._form(LAMP, l, v => {
      const lamps = [...this._config.entities], old = lamps[i];
      lamps[i] = merge(old, keys, v);
      this._set(lamps);
      s.querySelector('.lbl').textContent = this._label(lamps[i], i);
      // Andere Lampe → Kelvin-Bereich der Farbscheibe neu
      if (old.entity !== lamps[i].entity) this._rebuild();
    }));
    const sub = document.createElement('div');
    sub.className = 'sub';
    sub.textContent = 'Farbknöpfe dieser Lampe';
    body.append(sub, this._colors(`l${i}`, l.colors || [], colors => {
      const lamps = [...this._config.entities];
      lamps[i] = {...lamps[i], colors};
      this._set(lamps);
    }, l.entity));
  }
  // Farbknöpfe: Punkte mit ×, darunter die Farbscheibe zum Hinzufügen. key merkt sich, ob die Scheibe offen ist
  _colors(key, colors, onChange, entity) {
    const box = document.createElement('div');
    box.style.cssText = 'display:flex;flex-direction:column;gap:10px';
    const dots = document.createElement('div');
    dots.className = 'dots';
    colors.forEach((v, j) => {
      const dot = document.createElement('div');
      dot.className = 'dot'; dot.style.background = swatchCss(v); dot.title = v;
      const x = document.createElement('button');
      x.textContent = '×'; x.title = 'Entfernen';
      x.addEventListener('click', e => { e.preventDefault(); onChange(colors.filter((_, k) => k !== j)); this._rebuild(); });
      dot.append(x);
      dots.append(dot);
    });
    if (!colors.length) {
      const empty = document.createElement('span');
      empty.className = 'hint'; empty.textContent = 'Noch keine – Farbe wählen und hinzufügen.';
      dots.append(empty);
    }
    const open = this._pickerOpen.has(key);
    box.append(dots, this._add(open ? 'Farbscheibe schließen' : 'Farbe hinzufügen', () => {
      open ? this._pickerOpen.delete(key) : this._pickerOpen.add(key);
      this._rebuild();
    }));
    if (open) {
      const a = entity && this._hass?.states[entity]?.attributes, picker = document.createElement(tag('color-input'));
      if (a?.min_color_temp_kelvin) picker.setAttribute('kmin', a.min_color_temp_kelvin);
      if (a?.max_color_temp_kelvin) picker.setAttribute('kmax', a.max_color_temp_kelvin);
      picker.addEventListener('color-add', e => {
        if (!colors.includes(e.detail.value)) onChange([...colors, e.detail.value]);
        this._rebuild();
      });
      box.append(picker);
    }
    return box;
  }
  _move(i, dir) {
    const j = i + dir, lamps = [...this._config.entities];
    [lamps[i], lamps[j]] = [lamps[j], lamps[i]];
    this._open = new Set([j]);
    this._pickerOpen = new Set();
    this._set(lamps);
    this._rebuild();
  }
  _removeLamp(i) {
    this._open = new Set();
    this._pickerOpen = new Set();
    this._set(this._config.entities.filter((_, k) => k !== i));
    this._rebuild();
  }
}
define('light-card-editor', NovaLightCardEditor);

/* ---------- Nova Licht Card ---------- */
const TAG = 'light-card';
const LIGHT_CSS = `
:host{container-type:inline-size}
.lc{padding:12px;display:flex;flex-direction:column;gap:10px}
.hd{display:flex;align-items:center;gap:8px;font-weight:600;font-size:14px;padding:0 4px}
.hd ha-icon{--mdc-icon-size:18px;opacity:.8}.hd .cnt{opacity:.6;font-weight:500;font-size:12px}
.hd .all{margin-left:auto;padding:4px 10px;border-radius:999px;background:var(--nv-chip);font-size:11.5px;font-weight:500;cursor:pointer;display:none}
.hd .all.show{display:block}.hd .all:active{transform:scale(.94)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--nova-light-min-width,150px),1fr));gap:8px}
.t{position:relative;border-radius:16px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);padding:10px;display:flex;flex-direction:column;gap:8px;overflow:hidden;transition:background .3s,box-shadow .3s;min-width:0}
.t.on{background:color-mix(in srgb,var(--lc,var(--nv-accent)) 22%,rgba(255,255,255,.08));box-shadow:0 0 18px color-mix(in srgb,var(--lc,var(--nv-accent)) 30%,transparent);border-color:color-mix(in srgb,var(--lc,var(--nv-accent)) 45%,transparent)}
.t.na{opacity:.35}
.top{display:flex;align-items:center;gap:8px;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}
.ic{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.12);transition:background-color .3s,color .3s,border-color .3s,box-shadow .3s,transform .3s,opacity .3s}
.ic ha-icon{--mdc-icon-size:18px}
.t.on .ic{background:var(--lc,var(--nv-accent));color:var(--nv-accent-fg);box-shadow:0 0 12px color-mix(in srgb,var(--lc,var(--nv-accent)) 60%,transparent)}
.top:active .ic{transform:scale(.9)}
.nm{flex:1;min-width:0}.nm b{display:block;font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nm small{display:block;font-size:11px;opacity:.6}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:22px;border-radius:11px;margin:0;outline:none;
background:linear-gradient(90deg,var(--lc,var(--nv-accent)) 0 var(--p,0%),rgba(255,255,255,.14) var(--p,0%) 100%)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.4)}
input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#fff;border:none}
.t:not(.on) input[type=range]{opacity:.5}
.dots{display:flex;flex-wrap:wrap;gap:6px}.dots:empty{display:none}
.dot{width:24px;height:24px;border-radius:50%;cursor:pointer;border:2px solid rgba(255,255,255,.45);box-sizing:border-box;-webkit-tap-highlight-color:transparent}
.dot:active{transform:scale(.88)}
.single .lc,.lc.single{padding:0}.single .grid{display:block}
.single .t{border:none;border-radius:var(--nv-radius);background:transparent;padding:12px;height:100%;box-sizing:border-box}
@container (max-width:300px){.grid{grid-template-columns:1fr}}`;

const entityOf = x => typeof x === 'string' ? x : x?.entity;
function normalize(c) {
  if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
  const entities = [].concat(c.entity ? [c.entity] : [], c.entities || []).filter(entityOf).map(toLamp);
  if (!entities.length && !c.area) throw new Error('entities oder area angeben');
  return {show_all_off: true, show_header: true, ...c, entities};
}

class NovaLightCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag(`${TAG}-editor`)); }
  // Erster Bereich mit Lampen, sonst die ersten 4 Lampen
  static getStubConfig(h) {
    for (const area of Object.values(h.areas || {})) {
      if (Object.keys(h.states).filter(id => id.startsWith('light.') && areaOf(h, id) === area.area_id).length) return {title: area.name, area: area.area_id};
    }
    return {entities: Object.keys(h.states).filter(id => id.startsWith('light.')).slice(0, 4)};
  }
  setConfig(c) {
    this._c = normalize(c);
    this._ids = entityIds(this._c);
    this._built = false;
    if (this._h) { this._build(); this._update(); }
  }
  set hass(h) {
    const prev = this._list, old = this._h;
    this._h = h;
    if (!this._c) return;
    // Nichts zu tun, wenn sich weder eine Lampe noch der Bereich geändert hat
    if (this._built && !hassChanged(old, h, [...this._ids, ...(prev || [])])) return;
    // Neu aufbauen, wenn im Bereich Lampen dazukommen oder wegfallen
    const now = this._lights();
    if (!this._built || now.join() !== (prev || []).join()) this._build();
    this._update();
  }
  getCardSize() { return 1 + Math.ceil((this._list?.length || 2) / 2) * 2; }
  // Genau eine Lampe ohne Bereich = Einzelkachel
  get _single() { return this._c && !this._c.area && this._c.entities.length === 1; }
  getGridOptions() { return this._single ? {columns: 6, rows: 'auto', min_columns: 3} : {columns: 12, rows: 'auto', min_columns: 4}; }
  // Eingetragene Lampen, dann sichtbare Lampen des Bereichs alphabetisch
  _lights() {
    const c = this._c, h = this._h, ids = c.entities.map(l => l.entity);
    if (c.area && h) {
      const ex = new Set(c.exclude || []);
      Object.keys(h.states)
        .filter(id => id.startsWith('light.') && areaOf(h, id) === c.area && !ex.has(id) && !ids.includes(id))
        .filter(id => { const e = h.entities?.[id]; return !e || (!e.hidden && !e.entity_category); })
        .sort((a, b) => (h.states[a].attributes.friendly_name || a).localeCompare(h.states[b].attributes.friendly_name || b))
        .forEach(id => ids.push(id));
    }
    return ids;
  }
  _build() {
    if (!this._c || !this._h) return;
    this._built = true;
    const c = this._c, h = this._h;
    this._list = this._lights();
    const r = this.shadowRoot || this.attachShadow({mode: 'open'}), title = c.title ?? (c.area ? h.areas?.[c.area]?.name : '') ?? '';
    r.innerHTML = `<style>${CARD_CSS}${LIGHT_CSS}</style>
<div class="g lc ${this._single ? 'single' : ''}">
  ${!this._single && c.show_header && (title || c.show_all_off) ? `<div class="hd"><ha-icon icon="${esc(c.icon || 'mdi:lightbulb-group')}"></ha-icon><span>${esc(title)}</span><span class="cnt"></span><div class="all">Alle aus</div></div>` : ''}
  <div class="grid"></div>
</div>`;
    this._cnt = r.querySelector('.cnt');
    this._all = r.querySelector('.all');
    this._all?.addEventListener('click', () => {
      const on = this._list.filter(id => this._h.states[id]?.state === 'on');
      if (on.length) this._h.callService('light', 'turn_off', {entity_id: on});
    });
    const grid = r.querySelector('.grid'), byId = Object.fromEntries(c.entities.map(l => [l.entity, l]));
    this._tiles = this._list.map(id => {
      const o = byId[id] || {entity: id}, tile = document.createElement('div');
      tile.className = 't';
      tile.innerHTML = '<div class="top" tabindex="0" role="button"><div class="ic"><ha-icon></ha-icon></div><div class="nm"><b></b><small></small></div></div><input type="range" min="1" max="100"><div class="dots"></div>';
      const top = tile.querySelector('.top'), slider = tile.querySelector('input'), dots = tile.querySelector('.dots');
      dots.addEventListener('click', e => {
        const v = e.composedPath().find(x => x.dataset?.c)?.dataset.c;
        if (v) this._h.callService('light', 'turn_on', {entity_id: id, ...swatchService(v)});
      });
      press(top, {
        tap: () => o.tap_action?.action ? hassAction(this, {entity: id, tap_action: o.tap_action}, 'tap') : this._h.callService('light', 'toggle', {entity_id: id}),
        hold: () => o.hold_action?.action ? hassAction(this, {entity: id, hold_action: o.hold_action}, 'hold') : moreInfo(this, id),
        isolate: true,
      });
      // Beim Ziehen keine Updates von HA übernehmen
      slider.addEventListener('pointerdown', () => { tile._drag = true; });
      slider.addEventListener('input', () => tile.style.setProperty('--p', `${slider.value}%`));
      slider.addEventListener('change', () => {
        this._h.callService('light', 'turn_on', {entity_id: id, brightness_pct: +slider.value});
        setTimeout(() => { tile._drag = false; }, 800);
      });
      grid.appendChild(tile);
      return {id, o, t: tile, ic: tile.querySelector('ha-icon'), nm: tile.querySelector('b'), st: tile.querySelector('small'), sl: slider, dots};
    });
  }
  _update() {
    if (!this._h || !this._tiles) return;
    const h = this._h;
    let count = 0;
    for (const x of this._tiles) {
      const s = h.states[x.id], a = s?.attributes || {}, on = s?.state === 'on', na = !s || s.state === 'unavailable';
      if (on) count++;
      const dimmable = (a.supported_color_modes || []).some(m => m !== 'onoff'), pct = on ? Math.max(1, Math.round((a.brightness || 0) / 2.55)) : 0;
      x.t.classList.toggle('on', on);
      x.t.classList.toggle('na', na);
      x.ic.setAttribute('icon', x.o.icon || a.icon || (on ? 'mdi:lightbulb-on' : 'mdi:lightbulb-outline'));
      x.nm.textContent = x.o.name || this._strip(a.friendly_name || x.id);
      x.st.textContent = na ? 'nicht erreichbar' : on ? (dimmable ? `${pct} %` : 'an') : 'aus';
      const rgb = this._c.use_light_color !== false && on && a.rgb_color;
      if (rgb) x.t.style.setProperty('--lc', `rgb(${rgb.join(',')})`); else x.t.style.removeProperty('--lc');
      x.sl.style.display = dimmable && !na ? '' : 'none';
      if (!x.t._drag) { x.sl.value = pct || 1; x.t.style.setProperty('--p', `${pct}%`); }
      // Farbknöpfe: eigene + gemeinsame, ohne Doppelte
      const swatches = !na && (hasColor(a) || hasColorTemp(a)) && this._c.show_colors !== false
        ? [...(x.o.colors || []), ...(this._c.colors || [])].filter((v, i, arr) => arr.indexOf(v) === i) : [];
      const sig = swatches.join();
      if (x.dots._sig !== sig) {
        x.dots._sig = sig;
        x.dots.innerHTML = swatches.map(v => `<div class="dot" data-c="${esc(v)}" style="background:${esc(swatchCss(v))}"></div>`).join('');
      }
    }
    if (this._cnt) this._cnt.textContent = count ? `${count} an` : '';
    this._all?.classList.toggle('show', !!this._c.show_all_off && count > 0);
  }
  // Raumname vorne weglassen: „Küche Decke“ → „Decke“
  _strip(name) {
    const p = this._c.strip_prefix ?? this._c.title ?? (this._c.area ? this._h.areas?.[this._c.area]?.name : '');
    return p && name.toLowerCase().startsWith(p.toLowerCase() + ' ') ? name.slice(p.length + 1) : name;
  }
}
define(TAG, NovaLightCard, {name: 'Nova Licht Card', description: 'Lampen als Kacheln: Antippen schaltet, Regler dimmt, leuchtet in der Lichtfarbe.', documentationURL: docUrl('nova-licht-card')});
