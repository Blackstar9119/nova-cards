import {define, docUrl} from './shared/define.js';
import {dom, setIcon} from './shared/utils.js';
import {isOn, TOGGLE, PRESS, fmtState, unitJoin, decOf, nameOf, iconOf, valueOf, alertHit} from './shared/state.js';
import {runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, EDITOR_CSS, EDITOR_ICON_CSS, EDITOR_LIST_CSS} from './shared/styles.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, A, ENT, TITLE, COLS, NUM, sel, NAMEICON, BASE_LABELS} from './shared/editor-schema.js';

/* ---------- Nova Modular Card ---------- */

// Schieberegler je Domain: v = aktueller Wert, r = [min, max, step], u = Einheit, set = Service
const SLIDE = {
  number: {v: s => +s.state, r: a => [a.min ?? 0, a.max ?? 100, a.step ?? 1], set: (h, id, v) => h.callService('number', 'set_value', {entity_id: id, value: v})},
  input_number: {v: s => +s.state, r: a => [a.min ?? 0, a.max ?? 100, a.step ?? 1], set: (h, id, v) => h.callService('input_number', 'set_value', {entity_id: id, value: v})},
  light: {v: s => s.state === 'on' ? Math.max(1, Math.round((s.attributes.brightness || 0) / 2.55)) : 0, r: () => [0, 100, 1], u: '%',
    set: (h, id, v) => v > 0 ? h.callService('light', 'turn_on', {entity_id: id, brightness_pct: v}) : h.callService('light', 'turn_off', {entity_id: id})},
  fan: {v: s => s.state === 'on' ? s.attributes.percentage ?? 0 : 0, r: a => [0, 100, a.percentage_step || 1], u: '%', set: (h, id, v) => h.callService('fan', 'set_percentage', {entity_id: id, percentage: Math.round(v)})},
  cover: {v: s => s.attributes.current_position ?? 0, r: () => [0, 100, 1], u: '%', set: (h, id, v) => h.callService('cover', 'set_cover_position', {entity_id: id, position: v})},
  media_player: {v: s => Math.round((s.attributes.volume_level ?? 0) * 100), r: () => [0, 100, 1], u: '%', set: (h, id, v) => h.callService('media_player', 'volume_set', {entity_id: id, volume_level: v / 100})},
  climate: {v: s => s.attributes.temperature ?? 0, r: a => [a.min_temp ?? 7, a.max_temp ?? 35, a.target_temp_step ?? .5], u: '°', set: (h, id, v) => h.callService('climate', 'set_temperature', {entity_id: id, temperature: v})},
  water_heater: {v: s => s.attributes.temperature ?? 0, r: a => [a.min_temp ?? 30, a.max_temp ?? 70, a.target_temp_step ?? 1], u: '°', set: (h, id, v) => h.callService('water_heater', 'set_temperature', {entity_id: id, temperature: v})},
};
const duration = m => m >= 60 ? `${Math.floor(m / 60)}:${String(Math.round(m % 60)).padStart(2, '0')} h` : `${m} min`;

const ITEMS = {info: 'entities', entities: 'entities', sliders: 'entities', buttons: 'buttons', alerts: 'alerts'};
const normBlock = b => {
  const k = ITEMS[b.type];
  if (!k) return {...b};
  const it = (b[k] || []).map(x => typeof x === 'string' ? {entity: x} : {...x});
  return {...b, [k]: it.filter(x => k === 'buttons' ? x.entity || x.tap_action : x.entity)};
};

// Bausteine: bekommen Block-Konfig + Container, liefern update(hass) → optional Warnstufe
export const BLOCKS = {
  header(b, w) {
    const ent = b.status || b.active;
    const btn = b.button_icon || (b.button_action?.action && b.button_action.action !== 'none');
    w.innerHTML = `<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div><span class="pct"></span>${btn ? '<div class="hb"></div>' : ''}</div><div class="prog" hidden><i></i></div>`;
    const q = s => w.querySelector(s), hd = q('.hd'), ic = q('.ic'), sm = q('small'), pct = q('.pct'), pg = q('.prog'), pi = q('.prog i');
    q('b').textContent = b.name ?? '';
    press(ic, {tap: () => this._act({entity: ent, tap_action: b.tap_action}, 'tap', true), hold: () => this._act({entity: ent, hold_action: b.hold_action}, 'hold')});
    if (btn) { setIcon(q('.hb'), b.button_icon || 'mdi:dots-horizontal'); press(q('.hb'), {tap: () => this._act({entity: ent, tap_action: b.button_action}, 'tap', true)}); }
    return h => {
      const s = b.status && h.states[b.status];
      const on = b.active ? isOn(h.states[b.active]) : isOn(s);
      if (!b.name && ent) q('b').textContent = h.states[ent]?.attributes.friendly_name || '';
      setIcon(ic, b.icon || s?.attributes.icon || 'mdi:devices');
      hd.classList.toggle('on', on);
      sm.textContent = s ? fmtState(h, s) : b.active ? (on ? 'an' : 'aus') : '';
      const pr = b.progress && h.states[b.progress], p = pr ? parseFloat(pr.state) : NaN;
      const show = !isNaN(p) && p > 0 && (on || p < 100);
      pg.hidden = !show; pct.textContent = show ? `${Math.round(p)} %` : '';
      if (show) pi.style.width = `${Math.min(100, p)}%`;
    };
  },
  info(b, w) {
    const chips = b.layout === 'chips';
    const box = document.createElement('div');
    box.className = chips ? 'pills' : 'list';
    if (b.columns > 1) box.style.setProperty('--cols', b.columns);
    const els = b.entities.map(o => {
      const el = document.createElement('div');
      el.className = chips ? 'pill' : 'kv';
      el.innerHTML = chips ? '<span class="i"></span><span class="t"></span>' : '<span class="i"></span><span class="k"></span><span class="v"></span>';
      press(el, {tap: () => this._act(o, 'tap', true), hold: () => this._act(o, 'hold')});
      box.append(el);
      return [el, o];
    });
    w.append(box);
    return h => els.forEach(([el, o]) => {
      const s = h.states[o.entity];
      el.classList.toggle('na', !s || s.state === 'unavailable');
      setIcon(el.firstChild, iconOf(h, o, 'mdi:information-outline'));
      const v = valueOf(h, s, o);
      if (chips) el.lastChild.textContent = o.name === '' ? v : `${nameOf(h, o)} · ${v}`;
      else { el.children[1].textContent = nameOf(h, o); el.children[2].textContent = v; }
    });
  },
  entities(b, w) {
    const box = document.createElement('div');
    box.className = 'list';
    if (b.columns > 1) box.style.setProperty('--cols', b.columns);
    const els = b.entities.map(o => {
      const el = document.createElement('div');
      el.className = 'row';
      el.innerHTML = `<div class="ic"></div><div class="nm"><b></b><small></small></div>${TOGGLE.includes(dom(o.entity)) ? '<div class="sw"></div>' : ''}`;
      press(el, {tap: () => this._act(o, 'tap'), hold: () => this._act(o, 'hold')});
      box.append(el);
      return [el, o];
    });
    w.append(box);
    return h => els.forEach(([el, o]) => {
      const s = h.states[o.entity];
      el.classList.toggle('na', !s || s.state === 'unavailable');
      el.classList.toggle('on', isOn(s) && !PRESS[dom(o.entity)]);
      setIcon(el.firstChild, iconOf(h, o, 'mdi:power'));
      el.querySelector('b').textContent = nameOf(h, o);
      el.querySelector('small').textContent = s ? valueOf(h, s, o) : 'nicht gefunden';
    });
  },
  sliders(b, w) {
    const els = b.entities.map(o => {
      const el = document.createElement('div');
      el.className = 'sl';
      el.innerHTML = '<div class="kv"><span class="i"></span><span class="k"></span><span class="v"></span></div><input type="range">';
      const top = el.firstChild, inp = el.lastChild, v = el.querySelector('.v');
      press(top, {tap: () => this._act(o, 'tap', true), hold: () => this._act(o, 'hold')});
      const paint = () => {
        const mn = +inp.min, mx = +inp.max, n = +inp.value;
        inp.style.setProperty('--p', `${mx > mn ? (n - mn) / (mx - mn) * 100 : 0}%`);
        v.textContent = o.format === 'duration' ? duration(n) : unitJoin(n.toFixed(decOf(inp.step)), el._u);
      };
      inp.addEventListener('pointerdown', () => { el._drag = true; });
      inp.addEventListener('input', () => { el._drag = true; paint(); });
      inp.addEventListener('change', () => {
        SLIDE[dom(o.entity)]?.set(this._h, o.entity, +inp.value);
        clearTimeout(el._t); el._t = setTimeout(() => { el._drag = false; }, 1500);
      });
      w.append(el);
      return {el, o, inp, paint};
    });
    return h => els.forEach(({el, o, inp, paint}) => {
      const s = h.states[o.entity], D = SLIDE[dom(o.entity)];
      el.classList.toggle('na', !s || !D || s.state === 'unavailable');
      setIcon(el.querySelector('.i'), iconOf(h, o, 'mdi:tune-variant'));
      el.querySelector('.k').textContent = nameOf(h, o);
      inp.disabled = !s || !D || s.state === 'unavailable';
      if (!s || !D) { el.querySelector('.v').textContent = s ? fmtState(h, s) : '–'; return; }
      const [mn, mx, st] = D.r(s.attributes);
      inp.min = o.min ?? mn; inp.max = o.max ?? mx; inp.step = o.step ?? st;
      el._u = o.unit ?? D.u ?? s.attributes.unit_of_measurement;
      if (!el._drag) inp.value = D.v(s);
      paint();
    });
  },
  buttons(b, w) {
    const box = document.createElement('div');
    box.className = `pills${b.layout === 'grid' ? ' grid' : ''}`;
    const els = b.buttons.map(o => {
      const el = document.createElement('div');
      el.className = 'pill';
      el.innerHTML = '<span class="i"></span><span class="t"></span>';
      press(el, {tap: () => this._act(o, 'tap'), hold: () => this._act(o, 'hold')});
      box.append(el);
      return [el, o];
    });
    w.append(box);
    return h => els.forEach(([el, o]) => {
      const s = o.entity && h.states[o.entity];
      el.classList.toggle('na', !!o.entity && (!s || s.state === 'unavailable'));
      el.classList.toggle('on', !!s && TOGGLE.includes(dom(o.entity)) && isOn(s));
      setIcon(el.firstChild, iconOf(h, o, 'mdi:gesture-tap-button'));
      el.lastChild.textContent = o.name ?? (s?.attributes.friendly_name || '');
    });
  },
  alerts(b, w) {
    const box = document.createElement('div');
    box.className = `als${b.layout === 'chips' ? ' chips' : ''}`;
    const els = b.alerts.map(o => {
      const el = document.createElement('div');
      el.className = `al ${o.level || 'warning'}`;
      el.innerHTML = '<span class="i"></span><span class="t"></span>';
      press(el, {tap: () => this._act(o, 'tap', true), hold: () => this._act(o, 'hold')});
      box.append(el);
      return [el, o];
    });
    w.append(box);
    return h => {
      let lvl = 0;
      els.forEach(([el, o]) => {
        const s = h.states[o.entity], hit = alertHit(o, s);
        el.hidden = !hit;
        if (!hit) return;
        lvl = Math.max(lvl, o.level === 'error' ? 2 : o.level === 'info' ? 0 : 1);
        setIcon(el.firstChild, o.icon || (o.level === 'error' ? 'mdi:alert-octagon' : o.level === 'info' ? 'mdi:information' : 'mdi:alert'));
        el.lastChild.textContent = o.message ? o.message.replace('{state}', fmtState(h, s)) : `${nameOf(h, o)}: ${fmtState(h, s)}`;
      });
      w.hidden = !els.some(([el]) => !el.hidden);
      return b.glow === false ? 0 : lvl;
    };
  },
};

class NovaModularCard extends HTMLElement {
  static getConfigElement() { return document.createElement('nova-modular-card-editor'); }
  static getStubConfig(h) {
    const ids = Object.keys(h.states);
    const sensor = ids.find(i => i.startsWith('sensor.')), sw = ids.find(i => i.startsWith('switch.'));
    return {blocks: [
      {type: 'header', name: 'Gerät', icon: 'mdi:devices', ...(sensor ? {status: sensor} : {})},
      ...(sw ? [{type: 'entities', entities: [{entity: sw}]}] : []),
    ]};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (!Array.isArray(c.blocks)) throw new Error('blocks (Liste der Bausteine) fehlt');
    this._c = {...c, blocks: c.blocks.filter(b => b && BLOCKS[b.type]).map(normBlock)};
    this._built = false;
    if (this._h) { this._build(); this._update(); }
  }
  set hass(h) {
    this._h = h;
    if (!this._c) return;
    if (!this._built) this._build();
    this._update();
  }
  getCardSize() { return 1 + (this._c?.blocks.length || 1); }
  getGridOptions() { return {columns: 12, rows: 'auto', min_columns: 4}; }
  _build() {
    this._built = true;
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}</style><div class="g"></div>`;
    this._g = r.querySelector('.g');
    this._ups = this._c.blocks.map(b => {
      const w = document.createElement('div');
      w.className = `blk ${b.type}`;
      if (b.title) { const t = document.createElement('div'); t.className = 'bt'; t.textContent = b.title; w.append(t); }
      const up = BLOCKS[b.type].call(this, b, w);
      this._g.append(w);
      return up;
    });
  }
  _update() {
    if (!this._h || !this._ups) return;
    const lvl = Math.max(0, ...this._ups.map(up => up(this._h) || 0));
    this._g.classList.toggle('warn', lvl === 1);
    this._g.classList.toggle('err', lvl === 2);
  }
  _act(o, kind, info) { return runAction(this, o, kind, info); }
}
define('nova-modular-card', NovaModularCard, {name: 'Nova Modular Card', description: 'Frei zusammensetzbare Gerätekarte: Kopfzeile, Infos, Schalter, Regler, Aktionsbuttons und Warnungen.', documentationURL: docUrl('nova-modular-card')});

/* ---------- Editor Modular Card ---------- */

const BM = {
  header: {label: 'Kopfzeile', icon: 'mdi:page-layout-header', schema: [
    g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'status'}}),
    {name: 'status', selector: {entity: {}}},
    g2({name: 'active', selector: {entity: {}}}, {name: 'progress', selector: {entity: {domain: ['sensor', 'number', 'input_number']}}}),
    {name: 'tap_action', selector: A},
    {name: 'button_icon', selector: I},
    {name: 'button_action', selector: A},
  ]},
  info: {label: 'Info-Entitäten', icon: 'mdi:information-outline', item: 'Entität', plural: 'Entitäten', defaults: {layout: 'rows', columns: 1},
    schema: [TITLE, g2(sel('layout', [['rows', 'Liste'], ['chips', 'Chips']]), COLS)],
    items: [ENT, NAMEICON, g2({name: 'unit', selector: T}, {name: 'decimals', selector: {number: {min: 0, max: 4, mode: 'box'}}}), {name: 'tap_action', selector: A}]},
  entities: {label: 'Schalter & Entitäten', icon: 'mdi:toggle-switch-outline', item: 'Entität', plural: 'Entitäten', defaults: {columns: 1},
    schema: [TITLE, COLS],
    items: [ENT, NAMEICON, {name: 'tap_action', selector: A}, {name: 'hold_action', selector: A}, {name: 'confirm', selector: T}]},
  sliders: {label: 'Schieberegler', icon: 'mdi:tune-variant', item: 'Regler', plural: 'Regler',
    schema: [TITLE],
    items: [{...ENT, selector: {entity: {domain: Object.keys(SLIDE)}}}, NAMEICON, g2(NUM('min'), NUM('max'), NUM('step')),
      g2({name: 'unit', selector: T}, sel('format', [['value', 'Zahl'], ['duration', 'Minuten → Std:Min']]))]},
  buttons: {label: 'Aktionsbuttons', icon: 'mdi:gesture-tap-button', item: 'Button', plural: 'Buttons', key: 'buttons', defaults: {layout: 'pills'},
    schema: [TITLE, sel('layout', [['pills', 'Pillen'], ['grid', 'Kacheln']])],
    items: [NAMEICON, {name: 'entity', selector: {entity: {}}}, {name: 'tap_action', selector: A}, {name: 'confirm', selector: T}]},
  alerts: {label: 'Warnungen', icon: 'mdi:alert-outline', item: 'Warnung', plural: 'Warnungen', key: 'alerts', defaults: {layout: 'list', glow: true},
    schema: [TITLE, g2(sel('layout', [['list', 'Balken'], ['chips', 'Badges']]), {name: 'glow', selector: {boolean: {}}})],
    items: [ENT, g2({name: 'state', selector: T}, {name: 'state_not', selector: T}), g2(NUM('above'), NUM('below')),
      {name: 'message', selector: T}, g2({name: 'icon', selector: I}, sel('level', [['warning', 'Warnung'], ['error', 'Fehler'], ['info', 'Hinweis']]))]},
};

const MHELPERS = {
  status: 'Text unter dem Namen. Aus/Standby/Idle = inaktiv',
  active: 'Optional: bestimmt, ob das Icon leuchtet (statt Status-Entität)',
  button_icon: 'Button erscheint, sobald Icon oder Aktion gesetzt ist',
  unit: 'Überschreibt die Einheit der Entität',
  confirm: 'Optional: Text der Rückfrage vor dem Auslösen',
  state: 'Mehrere mit Komma trennen. Ohne Bedingung: Warnung bei „on“ bzw. „problem“',
  message: 'Leer = Name: Zustand. {state} wird ersetzt',
  min: 'Leer = Werte der Entität',
};

// Kurzschreibweise "- sensor.x" im Editor als Objekt behandeln
const normItems = b => { const k = ITEMS[b.type]; return k && Array.isArray(b[k]) ? {...b, [k]: b[k].map(x => typeof x === 'string' ? {entity: x} : x)} : {...b}; };

class NovaModularCardEditor extends NovaEditorBase {
  static labels = BASE_LABELS;
  static helpers = MHELPERS;
  _blocks() { return (this._config.blocks || []).map(normItems); }
  _set(bl) { this._emit({...this._config, blocks: bl}); }
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), bl = this._blocks();
    w.append(this._h3('Bausteine'), this._hint('Frei kombinierbar – die Reihenfolge hier ist die Reihenfolge auf der Karte.'));
    bl.forEach((b, i) => w.append(this._block(b, i, bl.length)));
    const adds = document.createElement('div'); adds.className = 'adds';
    Object.entries(BM).forEach(([type, m]) => {
      adds.append(this._add(m.label, () => {
        const k = BM[type].items && (m.key || 'entities');
        const n = [...bl, {type, ...(k ? {[k]: [{}]} : {})}];
        this._open = new Set([`${n.length - 1}`, `${n.length - 1}.0`]);
        this._set(n); this._rebuild();
      }));
    });
    w.append(adds);
  }
  _blabel(b, i) { const m = BM[b.type]; return `${i + 1}. ${m ? m.label : b.type}${b.title || b.name ? ' · ' + (b.title || b.name) : ''}`; }
  _block(b, i, n) {
    const m = BM[b.type];
    const [d, s, body] = this._details(`${i}`, m?.icon || 'mdi:help-circle-outline', this._blabel(b, i),
      this._itemBtns(i, n, dir => this._move(null, i, dir), () => this._del(null, i)));
    if (!m) { body.append(this._hint(`Unbekannter Baustein „${b.type}“ – nur per YAML bearbeitbar.`)); return d; }
    const keys = names(m.schema), def = m.defaults || {};
    body.append(this._form(m.schema, {...def, ...b}, v => {
      const bl = this._blocks(), nb = merge(bl[i], keys, v);
      Object.entries(def).forEach(([k, x]) => nb[k] === x && delete nb[k]);
      bl[i] = nb; this._set(bl);
      s.querySelector('.lbl').textContent = this._blabel(nb, i);
    }));
    if (m.items) {
      const k = m.key || 'entities', items = b[k] || [];
      const h = document.createElement('h4'); h.textContent = m.plural;
      body.append(h);
      items.forEach((it, j) => body.append(this._sub(i, j, it, items.length, m, k)));
      body.append(this._add(`${m.item} hinzufügen`, () => {
        const bl = this._blocks();
        bl[i] = {...bl[i], [k]: [...(bl[i][k] || []), {}]};
        this._open = new Set([`${i}`, `${i}.${bl[i][k].length - 1}`]);
        this._set(bl); this._rebuild();
      }));
    }
    return d;
  }
  _sub(i, j, it, n, m, k) {
    const [d, s, body] = this._details(`${i}.${j}`, it.icon || m.icon, this._ilabel(it, j, m),
      this._itemBtns(j, n, dir => this._move(i, j, dir), () => this._del(i, j)));
    const keys = names(m.items);
    body.append(this._form(m.items, it, v => {
      const bl = this._blocks(), arr = [...bl[i][k]];
      arr[j] = merge(arr[j], keys, v);
      bl[i] = {...bl[i], [k]: arr}; this._set(bl);
      s.querySelector('.lbl').textContent = this._ilabel(arr[j], j, m);
    }));
    return d;
  }
  // i = null: Block verschieben/löschen, sonst Eintrag j in Block i
  _move(i, j, dir) {
    const bl = this._blocks(), t = j + dir;
    if (i === null) { [bl[j], bl[t]] = [bl[t], bl[j]]; this._open = new Set([`${t}`]); }
    else {
      const k = BM[bl[i].type].key || 'entities', arr = [...bl[i][k]];
      [arr[j], arr[t]] = [arr[t], arr[j]];
      bl[i] = {...bl[i], [k]: arr}; this._open = new Set([`${i}`, `${i}.${t}`]);
    }
    this._set(bl); this._rebuild();
  }
  _del(i, j) {
    const bl = this._blocks();
    if (i === null) { bl.splice(j, 1); this._open = new Set(); }
    else { const k = BM[bl[i].type].key || 'entities'; bl[i] = {...bl[i], [k]: bl[i][k].filter((_, x) => x !== j)}; this._open = new Set([`${i}`]); }
    this._set(bl); this._rebuild();
  }
}
define('nova-modular-card-editor', NovaModularCardEditor);
