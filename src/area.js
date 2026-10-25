import {define, docUrl, tag} from './shared/define.js';
import {setIcon} from './shared/utils.js';
import {hassAction} from './shared/actions.js';
import {hassChanged, entityIds} from './shared/lifecycle.js';
import {CARD_CSS, roleVars, SECTION_EDITOR_CSS} from './shared/styles.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, A, ROLE, sel} from './shared/editor-schema.js';
import {normRows, PREV, EDIT, GRID_CSS, GridCard} from './shared/card-grid.js';
import {GridEditor, GRID_ED_CSS} from './shared/card-grid-editor.js';
import {normChips, renderNovaChips, NOVA_CHIPS_CSS, chipSchema, chipView, CHIP_LABELS, CHIP_HELPERS} from './shared/chips.js';

/* ---------- Nova Bereich Card ----------
   Raumansicht als Glasrahmen: Kopfzeile (Zurück, Icon, Name der Area, rechts Chips aus shared/chips.js) und darunter ein Raster aus beliebigen Karten wie in der Pop-up Card (rows). */
const DEF = {stack_below: 500, chips_layout: 'wrap'};

const ACSS = `${CARD_CSS}${GRID_CSS}${NOVA_CHIPS_CSS}
:host{height:auto}
:host(.tint)::before{background:linear-gradient(160deg,color-mix(in srgb,var(--tc) 45%,transparent),transparent 75%),var(--nv-bg)}
.g{height:auto;display:flex;flex-direction:column;gap:12px;padding:14px}
.hd{display:flex;align-items:center;gap:10px;padding:6px;border-radius:999px;background:var(--nv-chip)}
.hd.nb{padding-left:14px}
.hi{display:flex}.hi:empty{display:none}
.tt{flex:1 1 auto;min-width:0;font-weight:600;font-size:15px;overflow-wrap:anywhere}
.x{width:36px;height:36px;border-radius:50%;border:none;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:inherit;cursor:pointer;padding:0}
.x:active{transform:scale(.92)}
.x:focus-visible{outline:none;box-shadow:0 0 0 2px var(--nv-active)}
.x[hidden]{display:none}
.hd .nchips{flex:0 1 auto;justify-content:flex-end}
.hd .nchip{min-height:36px}
.body{display:flex;flex-direction:column;gap:12px}
.cell{display:grid}
.cell>*{min-width:0}
.prev .cell.empty{min-height:72px;border:2px dashed var(--nv-box-border);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:12.5px;opacity:.7}
.prev .cell.empty::after{content:'Leerer Platz'}
@media(max-width:600px){.g{padding:12px}.hd .nchip .ci:not(:empty)~.cn{display:none}.hd .nchip .ci:not(:empty)~.cv::before{content:none}}`;

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
<span class="hi"></span><span class="tt"></span><div class="nchips"></div></div>
<div class="body"></div></div>`;
    const q = s => r.querySelector(s);
    this._g = q('.g'); this._hd = q('.hd'); this._bk = q('.bk'); this._body = q('.body'); this._chips = q('.nchips');
    this._bk.addEventListener('click', () => this._back());
    this._ro = new ResizeObserver(() => this._stack());
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._cfg = {...DEF, ...c, chips: normChips(c.chips)};
    this._ids = entityIds(this._cfg.chips);
    this._rows = normRows(c);
    this._dirty = true;
    if (this.isConnected) this._grid();
    if (this._h) this._render();
  }
  // Die eingebetteten Karten bekommen jedes Update (sie filtern selbst), die Kopfzeile nur bei eigenen Änderungen
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._cfg) return;
    if (hassChanged(old, h, this._ids)) this._render();
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
    const tint = c.tint;
    this.classList.toggle('tint', !!tint);
    if (tint) this.style.setProperty('--tc', roleVars(tint).c); else this.style.removeProperty('--tc');
    this._chips.classList.toggle('scroll', c.chips_layout === 'scroll');
    renderNovaChips(this, this._chips, c.chips, h, {area: c.area});
  }
}
define('area-card', NovaAreaCard, {name: 'Nova Bereich Card', description: 'Raumansicht als Glasrahmen: Kopfzeile mit Zurück, Icon, Raumname und Chips, darunter beliebige Karten in Zeilen und Spalten.', documentationURL: docUrl('nova-bereich-card')});

/* ---------- Editor ---------- */
const S_GEN = icon => [
  {name: 'area', selector: {area: {}}},
  g2({name: 'name', selector: T}, {name: 'icon', selector: {icon: icon ? {placeholder: icon} : {}}}),
  {name: 'back_action', selector: A},
  g2(ROLE('tint'), {name: 'stack_below', selector: {number: {min: 0, max: 1200, step: 10, mode: 'box', unit_of_measurement: 'px'}}}),
];
const S_CHIPS = [sel('chips_layout', [['wrap', 'Umbrechen'], ['scroll', 'Waagrecht scrollen']])];
const LABELS = {
  ...CHIP_LABELS,
  area: 'Area', name: 'Name', icon: 'Icon', back_action: 'Zurück-Knopf: Aktion',
  tint: 'Farbton (leer = Nova-Glas)', stack_below: 'Untereinander unter Breite', chips_layout: 'Bei vielen Chips',
};
const HELPERS = {
  ...CHIP_HELPERS,
  back_action: 'Ohne Angabe geht es eine Seite zurück. „Keine Aktion“ blendet den Knopf aus.',
  stack_below: 'Ist die Karte schmaler als dieser Wert, stehen alle Karten untereinander (0 = nie).',
};
// Standardwerte nicht in die Konfig schreiben
const strip = c => { Object.keys(DEF).forEach(k => { if (c[k] === DEF[k]) delete c[k]; }); return c; };

class NovaAreaCardEditor extends GridEditor(NovaEditorBase) {
  static gridWhere = 'in der Karte';
  static labels = LABELS;
  static helpers = HELPERS;
  static openSections = ['general'];
  // Area-Icon hängt an hass – beim ersten hass einmal neu aufbauen
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
    r.querySelector('.wrap').append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => {
        const sch = S_GEN(h?.areas?.[c.area]?.icon);
        // Andere Area → Icon-Vorschlag im Formular neu
        b.append(this._form(sch, data, v => { const n = strip(merge(this._config, names(sch), v)); const re = n.area !== this._config.area; this._emit(n); if (re) this._rebuild(); }),
          this._hint('Name und Icon leer = wie in der Area.'));
      }),
      this._section('chips', 'mdi:label-multiple-outline', 'Chips in der Kopfzeile', b => {
        b.append(this._hint('Rechts neben dem Raumnamen. Wert-Chips zeigen den Zustand einer Entität, Knopf-Chips führen eine Aktion aus (z. B. „Alle Lichter im Raum aus“, Szene, Skript). Auf dem Handy zeigen Chips mit Icon nur das Icon bzw. Icon und Wert.'));
        this._itemList(b, 'chips', o => chipSchema(o, {area: !!this._config.area}), {item: 'Chip', icon: 'mdi:label-outline'}, 'Chip hinzufügen', chipView);
        b.append(form(S_CHIPS));
      }),
      this._section('layout', 'mdi:view-grid-outline', 'Layout & Vorlage', b => this._layoutBody(b)),
      this._section('content', 'mdi:view-dashboard-edit-outline', 'Inhalt', b => this._contentBody(b)));
  }
}
define('area-card-editor', NovaAreaCardEditor);
