import {define, docUrl, tag} from './shared/define.js';
import {NOVA_VARS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {hassChanged, entityIds} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {sel} from './shared/editor-schema.js';
import {normChips, renderNovaChips, NOVA_CHIPS_CSS, chipSchema, chipView, CHIP_LABELS, CHIP_HELPERS} from './shared/chips.js';

/* ---------- Nova Chips Card ----------
   Eine Reihe frei belegbarer Wert- und Knopf-Chips (Baustein aus shared/chips.js), umbrechend oder waagrecht scrollend.
   area wird nur für die Schnellauswahl „Alle Lichter im Raum aus“ gebraucht. */
const DEF = {layout: 'wrap', size: 'normal'};
const CSS = `${NOVA_VARS}${NOVA_CHIPS_CSS}
:host{display:block;color:var(--nv-fg);font-family:var(--nv-font)}
.nchips:empty{display:flex;min-height:34px}
.hint{font-size:var(--nv-fs-6);opacity:.7;padding:var(--nv-s4) var(--nv-s1)}
/* Groß: für kleine Touch-Displays (z. B. Echo Show) – höhere Chips, die die Zeile gleichmäßig füllen */
.nchips.lg{gap:var(--nv-s4)}.nchips.lg .nchip{min-height:var(--nova-chip-large-height,50px);padding:0 var(--nv-s8);font-size:var(--nv-fs-9);border-radius:var(--nv-r-md);flex:1 1 auto;justify-content:center}
.nchips.lg .nchip ha-icon{--mdc-icon-size:21px}.nchips.lg .nchip img{width:21px;height:21px}`;

class NovaChipsCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('chips-card-editor')); }
  static getStubConfig(h) {
    const t = Object.keys(h?.states || {}).find(id => h.states[id].attributes.device_class === 'temperature');
    return {chips: t ? [{type: 'value', entity: t}] : []};
  }
  constructor() {
    super();
    const r = this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${CSS}</style><div class="nchips"></div>`;
    this._box = r.querySelector('.nchips');
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._cfg = {...DEF, ...c, chips: normChips(c.chips)};
    this._ids = entityIds(this._cfg.chips);
    this._box.classList.toggle('scroll', this._cfg.layout === 'scroll');
    this._box.classList.toggle('lg', this._cfg.size === 'large');
    if (this._h) this._render();
  }
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (this._cfg && hassChanged(old, h, this._ids)) this._render();
  }
  getCardSize() { return 1; }
  getGridOptions() { return {columns: 'full', rows: 'auto'}; }
  _render() { renderNovaChips(this, this._box, this._cfg.chips, this._h, {area: this._cfg.area}); }
}
define('chips-card', NovaChipsCard, {name: 'Nova Chips Card', description: 'Eine Reihe frei belegbarer Chips: Werte von Entitäten oder Knöpfe mit Aktion, z. B. „Alle Lichter im Raum aus“.', documentationURL: docUrl('nova-chips-card')});

/* ---------- Editor ---------- */
const S_GEN = [
  {name: 'area', selector: {area: {}}},
  sel('layout', [['wrap', 'Umbrechen'], ['scroll', 'Waagrecht scrollen']]),
  sel('size', [['normal', 'Normal'], ['large', 'Groß (für kleine Touch-Displays)']]),
];
const LABELS = {...CHIP_LABELS, area: 'Area (für „Alle Lichter im Raum aus“)', layout: 'Bei vielen Chips', size: 'Größe'};
const HELPERS = {...CHIP_HELPERS, area: 'Nur nötig für die Schnellauswahl „Alle Lichter im Raum aus“.'};

class NovaChipsCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static helpers = HELPERS;
  static openSections = ['chips'];
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    r.querySelector('.wrap').append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => b.append(this._form(S_GEN, {...DEF, ...this._config}, v => {
        const c = merge(this._config, names(S_GEN), v);
        if (c.layout === DEF.layout) delete c.layout;
        if (c.size === DEF.size) delete c.size;
        this._emit(c);
        // Schnellauswahl hängt an der Area
        if (!!c.area !== !!this._built) this._rebuild();
      }))),
      this._section('chips', 'mdi:label-multiple-outline', 'Chips', b => {
        b.append(this._hint('Wert-Chips zeigen den Zustand einer Entität, Knopf-Chips führen eine Aktion aus (Szene, Skript, Dienst …). „Alle Lichter im Raum aus“ gibt es, sobald unter „Allgemein“ eine Area gewählt ist.'));
        this._itemList(b, 'chips', o => chipSchema(o, {area: !!this._config.area}), {item: 'Chip', icon: 'mdi:label-outline'}, 'Chip hinzufügen', chipView);
      }));
    this._built = !!this._config.area;
  }
}
define('chips-card-editor', NovaChipsCardEditor);
