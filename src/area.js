import {define, docUrl, tag} from './shared/define.js';
import {setIcon} from './shared/utils.js';
import {areaEntities, areaSensor} from './shared/state.js';
import {hassAction} from './shared/actions.js';
import {CARD_CSS, roleVars, SECTION_EDITOR_CSS} from './shared/styles.js';
import {hassChanged, entityIds} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, A, sel, ROLE} from './shared/editor-schema.js';
import {normRows, PREV, EDIT, GRID_CSS, CHIP_CSS, renderChips, GridCard} from './shared/card-grid.js';
import {GridEditor, GRID_ED_CSS, INFO, INFO_LABELS, INFO_HELPERS} from './shared/card-grid-editor.js';

/* ---------- Nova Bereich Card ----------
   Raumansicht als Glasrahmen: Kopfzeile (Zurück, Icon, Name der Area, „Licht aus“), Werte-Chips (Temperatur und
   Luftfeuchte der Area, eigene Chips) und darunter ein Raster aus beliebigen Karten wie in der Pop-up Card (rows). */
const DEF = {stack_below: 500, info_layout: 'wrap', lights_off: true, show_temperature: true, show_humidity: true};
const AUTO = [['temperature', 'mdi:thermometer'], ['humidity', 'mdi:water-percent']];

const ACSS = `${CARD_CSS}${GRID_CSS}${CHIP_CSS}
:host{height:auto}
:host(.tint)::before{background:linear-gradient(160deg,color-mix(in srgb,var(--tc) 45%,transparent),transparent 75%),var(--nv-bg)}
.g{height:auto;display:flex;flex-direction:column;gap:12px;padding:14px}
.hd{display:flex;align-items:center;gap:10px;padding:6px;border-radius:999px;background:var(--nv-chip)}
.hd.nb{padding-left:14px}
.hi{display:flex}.hi:empty{display:none}
.tt{flex:1 1 auto;min-width:0;font-weight:600;font-size:15px;overflow-wrap:anywhere}
.x{width:36px;height:36px;border-radius:50%;border:none;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:inherit;cursor:pointer;padding:0}
.lo{display:inline-flex;align-items:center;gap:6px;flex:none;padding:8px 12px;border-radius:999px;border:none;background:var(--nv-chip);color:inherit;font:inherit;font-size:12.5px;cursor:pointer}
.lo ha-icon{--mdc-icon-size:16px}
.x:active,.lo:active{transform:scale(.92)}
.x:focus-visible,.lo:focus-visible{outline:none;box-shadow:0 0 0 2px var(--nv-active)}
.x[hidden],.lo[hidden]{display:none}
.body{display:flex;flex-direction:column;gap:12px}
.cell{display:grid}
.cell>*{min-width:0}
.prev .cell.empty{min-height:72px;border:2px dashed var(--nv-box-border);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:12.5px;opacity:.7}
.prev .cell.empty::after{content:'Leerer Platz'}
@media(max-width:600px){.g{padding:12px}}`;

class NovaAreaCard extends GridCard(HTMLElement) {
  static gridKind = 'area';
  static getConfigElement() { return document.createElement(tag('area-card-editor')); }
  static getStubConfig(h) {
    const area = Object.keys(h?.areas || {})[0];
    return {...(area ? {area} : {}), rows: [{cells: [{card: null}, {card: null}]}]};
  }
  constructor() {
    super();
    const r = this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${ACSS}</style>
<div class="g"><div class="hd"><button type="button" class="x bk" aria-label="Zurück" title="Zurück"><ha-icon icon="mdi:arrow-left"></ha-icon></button>
<span class="hi"></span><span class="tt"></span>
<button type="button" class="lo" hidden><ha-icon icon="mdi:lightbulb-off-outline"></ha-icon><span>Licht aus</span></button></div>
<div class="info" hidden></div><div class="body"></div></div>`;
    const q = s => r.querySelector(s);
    this._g = q('.g'); this._hd = q('.hd'); this._bk = q('.bk'); this._lo = q('.lo'); this._infoEl = q('.info'); this._body = q('.body');
    this._bk.addEventListener('click', () => this._back());
    this._lo.addEventListener('click', () => { if (this._h && this._lights?.length) this._h.callService('light', 'turn_off', {entity_id: this._lights}); });
    this._ro = new ResizeObserver(() => this._stack());
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._cfg = {...DEF, ...c, info: [].concat(c.info || []).map(x => typeof x === 'string' ? {entity: x} : x).filter(x => x?.entity)};
    this._rows = normRows(c);
    this._reg = null;
    this._dirty = true;
    if (this.isConnected) this._grid();
    if (this._h) { this._scan(); this._render(); }
  }
  // Die eingebetteten Karten bekommen jedes Update (sie filtern selbst), Kopfzeile und Chips nur bei eigenen Änderungen
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._cfg) return;
    const fresh = this._scan();
    if (fresh || hassChanged(old, h, this._ids)) this._render();
    this._cells().forEach(el => this._setHass(el));
  }
  getCardSize() { return 2 + 3 * (this._rows?.length || 0); }
  getGridOptions() { return {columns: 'full', rows: 'auto'}; }

  connectedCallback() {
    this._ro.observe(this._body);
    this._detect();
    requestAnimationFrame(() => this._detect());
    if (this._dirty && this._cfg) this._grid();
  }
  disconnectedCallback() {
    this._ro.disconnect();
    // Vorschau im Karteneditor: Zellen an die Nachfolgerin weitergeben
    if (this._prev) this._handOffCells();
  }
  // Editor-Vorschau (Zellen übernehmen) bzw. Bearbeitungsmodus (leere Plätze zeigen)
  _detect() {
    let prev = false, edit = !!(this.preview || this.editMode);
    for (let n = this, i = 0; n && i < 80; i++) {
      if (PREV.has(n.tagName) || n.tagName?.includes('DIALOG')) { prev = true; break; }
      if (EDIT.has(n.tagName)) edit = true;
      n = n.parentElement || n.getRootNode?.().host;
    }
    this._prev = prev;
    this._g.classList.toggle('prev', prev || edit);
  }
  _handoff() { return this._prev; }

  // Lampen und Sensoren der Area – nur neu bestimmen, wenn sich Konfig oder Registries ändern
  _scan() {
    const h = this._h, c = this._cfg, reg = [h.entities, h.devices, h.areas, c];
    if (this._reg && reg.every((x, i) => x === this._reg[i])) return false;
    this._reg = reg;
    const ex = new Set([].concat(c.lights_off_exclude || []));
    // Lichtgruppen mit ausgeschlossenen Mitgliedern auslassen, sonst gingen diese über die Gruppe mit aus
    this._lights = areaEntities(h, c.area, 'light').filter(id => !ex.has(id) && ![].concat(h.states[id].attributes.entity_id || []).some(m => ex.has(m)));
    this._auto = AUTO.filter(([dc]) => c[`show_${dc}`] !== false)
      .map(([dc, icon]) => ({entity: c[`${dc}_entity`] || areaSensor(h, c.area, dc), icon})).filter(o => o.entity);
    this._ids = new Set([...entityIds(c.info), ...this._lights, ...this._auto.map(o => o.entity)]);
    return true;
  }
  _back() {
    const a = this._cfg.back_action;
    if (!a?.action) return history.back();
    hassAction(this, {tap_action: a}, 'tap');
  }
  _render() {
    const h = this._h, c = this._cfg, ar = h.areas?.[c.area];
    const r = this.shadowRoot, noBack = c.back_action?.action === 'none';
    this._bk.hidden = noBack;
    this._hd.classList.toggle('nb', noBack);
    r.querySelector('.tt').textContent = c.name || ar?.name || (c.area ? c.area : 'Keine Area gewählt');
    setIcon(r.querySelector('.hi'), c.icon || ar?.icon || 'mdi:texture-box');
    this._lo.hidden = c.lights_off === false || !this._lights.some(id => h.states[id]?.state === 'on');
    const tint = c.tint;
    this.classList.toggle('tint', !!tint);
    if (tint) this.style.setProperty('--tc', roleVars(tint).c); else this.style.removeProperty('--tc');
    this._infoEl.classList.toggle('scroll', c.info_layout === 'scroll');
    renderChips(this, this._infoEl, [...this._auto, ...c.info], h);
  }
}
define('area-card', NovaAreaCard, {name: 'Nova Bereich Card', description: 'Raumansicht als Glasrahmen: Kopfzeile mit Zurück und „Licht aus“, Temperatur und Luftfeuchte der Area, darunter beliebige Karten in Zeilen und Spalten.', documentationURL: docUrl('nova-bereich-card')});

/* ---------- Editor ---------- */
const SENSOR = dc => ({entity: {domain: 'sensor', device_class: dc}});
const S_GEN = icon => [
  {name: 'area', selector: {area: {}}},
  g2({name: 'name', selector: T}, {name: 'icon', selector: {icon: icon ? {placeholder: icon} : {}}}),
  {name: 'back_action', selector: A},
  g2(ROLE('tint'), {name: 'stack_below', selector: {number: {min: 0, max: 1200, step: 10, mode: 'box', unit_of_measurement: 'px'}}}),
];
const S_LIGHT = lights => [
  {name: 'lights_off', selector: {boolean: {}}},
  {name: 'lights_off_exclude', selector: {entity: lights?.length ? {multiple: true, include_entities: lights} : {multiple: true, domain: 'light'}}},
];
const S_CHIPS = [
  g2({name: 'show_temperature', selector: {boolean: {}}}, {name: 'temperature_entity', selector: SENSOR('temperature')}),
  g2({name: 'show_humidity', selector: {boolean: {}}}, {name: 'humidity_entity', selector: SENSOR('humidity')}),
  sel('info_layout', [['wrap', 'Umbrechen'], ['scroll', 'Waagrecht scrollen']]),
];
const LABELS = {
  ...INFO_LABELS,
  area: 'Area', name: 'Name', icon: 'Icon', back_action: 'Zurück-Knopf: Aktion',
  tint: 'Farbton (leer = Nova-Glas)', stack_below: 'Untereinander unter Breite',
  lights_off: '„Licht aus“-Knopf anzeigen', lights_off_exclude: 'Diese Lampen nicht ausschalten',
  show_temperature: 'Temperatur anzeigen', temperature_entity: 'Temperatursensor (leer = aus der Area)',
  show_humidity: 'Luftfeuchte anzeigen', humidity_entity: 'Feuchtesensor (leer = aus der Area)', info_layout: 'Chips bei vielen Einträgen',
};
const HELPERS = {
  ...INFO_HELPERS,
  back_action: 'Ohne Angabe geht es eine Seite zurück. „Keine Aktion“ blendet den Knopf aus.',
  stack_below: 'Ist die Karte schmaler als dieser Wert, stehen alle Karten untereinander (0 = nie).',
  lights_off: 'Erscheint, sobald eine Lampe der Area an ist, und schaltet alle Lampen der Area aus.',
  lights_off_exclude: 'Lichtgruppen, in denen eine dieser Lampen steckt, bleiben ebenfalls an.',
};
// Standardwerte nicht in die Konfig schreiben
const strip = c => { Object.keys(DEF).forEach(k => { if (c[k] === DEF[k]) delete c[k]; }); return c; };

class NovaAreaCardEditor extends GridEditor(NovaEditorBase) {
  static gridWhere = 'in der Karte';
  static labels = LABELS;
  static helpers = HELPERS;
  static openSections = ['general'];
  // Lampenliste und Area-Icon hängen an hass – beim ersten hass einmal neu aufbauen
  set hass(h) {
    const first = !this._hass;
    super.hass = h;
    if (first && h && this._config) this._rebuild();
  }
  _onTemplate() { this._openSecs?.add('content'); }
  _build() {
    const r = this.shadowRoot, c = this._config, h = this._hass;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}${GRID_ED_CSS}</style><div class="wrap"></div>`;
    this._gridReset();
    const data = {...DEF, ...c};
    const form = sch => this._form(sch, data, v => this._emit(strip(merge(this._config, names(sch), v))));
    const lights = h ? areaEntities(h, c.area, 'light') : null;
    r.querySelector('.wrap').append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => b.append(form(S_GEN(h?.areas?.[c.area]?.icon)), this._hint('Name und Icon leer = wie in der Area.'))),
      this._section('lights', 'mdi:lightbulb-off-outline', '„Licht aus“', b => b.append(form(S_LIGHT(lights)))),
      this._section('chips', 'mdi:information-outline', 'Werte-Chips', b => {
        b.append(this._hint('Temperatur und Luftfeuchte kommen automatisch aus der Area (in HA unter Bereich → Einstellungen hinterlegt). Antippen öffnet die Details.'));
        b.append(form(S_CHIPS), this._h4('Weitere Chips'));
        this._itemList(b, 'info', INFO, {item: 'Chip', icon: 'mdi:information-outline'}, 'Chip hinzufügen');
      }),
      this._section('layout', 'mdi:view-grid-outline', 'Layout & Vorlage', b => this._layoutBody(b)),
      this._section('content', 'mdi:view-dashboard-edit-outline', 'Inhalt', b => this._contentBody(b)));
  }
}
define('area-card-editor', NovaAreaCardEditor);
