import {define, docUrl, tag} from './shared/define.js';
import {dom, esc, setIcon, toObj} from './shared/utils.js';
import {isOn, PRESS, nameOf, iconOf, valueOf} from './shared/state.js';
import {moreInfo, runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, SECTION_EDITOR_CSS, roleVars} from './shared/styles.js';
import {hassChanged, entityIds} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, ENT, sel, ROLE, NAMEICON} from './shared/editor-schema.js';

/* ---------- Nova Info Card ----------
   Überschrift + Zeilen. Zeile „value“: Name links, Wert rechts. Zeile „toggle“: Icon, Name, Zustand – Tippen schaltet. */
const ICSS = `
.g.box{background:var(--nv-box);backdrop-filter:none;-webkit-backdrop-filter:none;border-color:var(--nv-box-border);box-shadow:none;border-radius:20px;padding:12px 14px}
.g{gap:6px}
.ht{display:flex;align-items:center;gap:6px;font-size:13px;font-weight:600;opacity:.8;margin-bottom:2px}
.ht ha-icon{--mdc-icon-size:17px}.ht:empty{display:none}
.rows{display:flex;flex-direction:column}
.kv{cursor:pointer}.kv .ki:empty{display:none}
.row{padding:5px 0}
.row .ic{width:38px;height:38px;cursor:pointer;--c:var(--nv-accent);--cf:var(--nv-accent-fg)}
.row.on .ic{background:var(--c);color:var(--cf);box-shadow:0 0 14px color-mix(in srgb,var(--c) 50%,transparent)}
.row .nm{cursor:pointer}
.row:active .ic{transform:none}.row .ic:active{transform:scale(.92)}
.empty{font-size:13px;opacity:.6;padding:4px 0}`;

// Standardfarbe „an“: Licht/Schalter warm (Akzent 2), alles andere Akzent 1
const WARM = ['light', 'switch', 'input_boolean'];
const rowsOf = c => [].concat(c.entities || []).filter(Boolean).map(toObj).filter(o => o.entity);

class NovaInfoCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('info-card-editor')); }
  static getStubConfig(h) {
    const ids = Object.keys(h?.states || {}).filter(id => h.states[id].attributes.device_class === 'temperature' && id.startsWith('sensor.')).slice(0, 3);
    return {title: 'Temperaturen', icon: 'mdi:thermometer', entities: ids};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._c = {style: 'box', ...c};
    this._rows = rowsOf(c);
    this._ids = entityIds(c);
    this._built = false;
    if (this._h) this.hass = this._h;
  }
  // Neu zeichnen nur, wenn sich eine Entität der Karte geändert hat
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    if (!this._built) this._build();
    else if (!hassChanged(old, h, this._ids)) return;
    this._update();
  }
  getCardSize() { return 1 + this._rows?.length || 1; }
  getGridOptions() { return {columns: 6, rows: 'auto', min_columns: 3}; }

  _build() {
    this._built = true;
    const c = this._c, r = this.shadowRoot || this.attachShadow({mode: 'open'});
    this.classList.toggle('nv-flat', c.style !== 'glass');
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${ICSS}</style><div class="g ${c.style === 'glass' ? '' : 'box'}"><div class="ht"></div><div class="rows"></div></div>`;
    const ht = r.querySelector('.ht');
    if (c.title || c.icon) ht.innerHTML = `${c.icon ? `<ha-icon icon="${esc(c.icon)}"></ha-icon>` : ''}<span></span>`;
    if (c.title) ht.querySelector('span').textContent = c.title;
    const box = r.querySelector('.rows');
    if (!this._rows.length) { box.innerHTML = '<div class="empty">Noch keine Zeilen – im Editor Entitäten hinzufügen.</div>'; this._els = []; return; }
    this._els = this._rows.map(o => {
      const el = document.createElement('div');
      if (o.display === 'toggle') {
        el.className = 'row';
        el.innerHTML = '<div class="ic"></div><div class="nm"><b></b><small></small></div>';
        if (o.color || !WARM.includes(dom(o.entity))) {
          const v = roleVars(o.color || 'accent-1');
          el.style.setProperty('--c', v.c); el.style.setProperty('--cf', v.fg);
        }
        press(el.querySelector('.ic'), {tap: () => runAction(this, o, 'tap'), hold: () => moreInfo(this, o.entity), isolate: true});
        press(el.querySelector('.nm'), {tap: () => moreInfo(this, o.entity), isolate: true});
      } else {
        el.className = 'kv';
        el.innerHTML = '<span class="ki"></span><span class="k"></span><span class="v"></span>';
        press(el, {tap: () => moreInfo(this, o.entity), isolate: true});
      }
      box.appendChild(el);
      return el;
    });
  }
  _update() {
    const h = this._h;
    this._rows.forEach((o, i) => {
      const el = this._els[i]; if (!el) return;
      const s = h.states[o.entity], name = nameOf(h, o);
      el.classList.toggle('na', !s || s.state === 'unavailable');
      if (o.display === 'toggle') {
        const pr = !!PRESS[dom(o.entity)];
        el.classList.toggle('on', !pr && isOn(s));
        setIcon(el.querySelector('.ic'), iconOf(h, o, 'mdi:toggle-switch'));
        el.querySelector('b').textContent = name;
        el.querySelector('small').textContent = !s ? 'Nicht gefunden' : pr ? 'Antippen zum Auslösen' : valueOf(h, s, o);
      } else {
        const ki = el.querySelector('.ki');
        if (o.icon) setIcon(ki, o.icon); else { ki.innerHTML = ''; ki._ic = null; }
        el.querySelector('.k').textContent = name;
        el.querySelector('.v').textContent = s ? valueOf(h, s, o) : 'Nicht gefunden';
      }
    });
  }
}
define('info-card', NovaInfoCard, {name: 'Nova Info Card', description: 'Überschrift mit Zeilen: Name und Wert von Entitäten, optional als Schalter mit Icon und Zustand.', documentationURL: docUrl('nova-info-card')});

/* ---------- Editor ---------- */
const GEN = [g2({name: 'title', selector: T}, {name: 'icon', selector: I})];
const LOOK = [sel('style', [['box', 'Block (wie im Pop-up)'], ['glass', 'Glas (wie andere Nova-Karten)']])];
// Felder je Zeile: Nachkommastellen nur bei „Wert“, Farbe nur bei „Tippen schaltet“
const ROW = it => [
  ENT, NAMEICON,
  sel('display', [['value', 'Name links, Wert rechts'], ['toggle', 'Icon, Name, Zustand (Tippen schaltet)']]),
  it.display === 'toggle' ? ROLE('color') : {name: 'decimals', selector: {number: {min: 0, max: 4, mode: 'box'}}},
];
const LABELS = {
  title: 'Überschrift', icon: 'Icon', style: 'Aussehen', entity: 'Entität', name: 'Eigener Name (optional)',
  display: 'Darstellung', decimals: 'Nachkommastellen', color: 'Farbe, wenn an',
};
const HELPERS = {
  icon: 'Optional. Bei „Name links, Wert rechts“ erscheint das Icon nur, wenn es hier gesetzt ist.',
  color: 'Nur für „Tippen schaltet“. Leer = Akzent 2 für Licht/Schalter, sonst Akzent 1.',
};

class NovaInfoCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static helpers = HELPERS;
  static openSections = ['general', 'rows'];
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), data = {style: 'box', ...this._config};
    const form = schema => this._form(schema, data, v => {
      const c = merge(this._config, names(schema), v);
      if (c.style === 'box') delete c.style;
      this._emit(c);
    });
    w.append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => b.append(form(GEN))),
      this._section('rows', 'mdi:format-list-bulleted', 'Zeilen', b => {
        b.append(this._hint('Werte werden wie in HA formatiert (Einheit, Rundung, „Offen“, „Ein“ …). Antippen öffnet die Details.'));
        this._itemList(b, 'entities', it => ROW({display: 'value', ...it}), {item: 'Zeile', icon: 'mdi:format-list-bulleted'}, 'Zeile hinzufügen', it => ({display: 'value', ...it}));
      }),
      this._section('look', 'mdi:palette-outline', 'Aussehen', b => b.append(form(LOOK))));
  }
}
define('info-card-editor', NovaInfoCardEditor);
