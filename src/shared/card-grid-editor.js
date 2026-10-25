// Editor-Teil für Raster aus beliebigen Karten – gemeinsam für Pop-up Card und Bereich Card:
// Vorlagen, Miniatur des Rasters mit Blöcken, Breiten und Ziehen, Kartenauswahl von HA, Karteneditor, YAML.
import {iconOf} from './state.js';
import {hassChanged} from './lifecycle.js';
import {g2, NUM, ROLE, NAMEICON, ENT, T} from './editor-schema.js';
import {WIDTHS, FR, normRows, serRows, flexOf, helpers} from './card-grid.js';

const wait = ms => new Promise(r => setTimeout(r, ms));
// HA-INTERN: hui-card-picker und hui-card-element-editor lädt HA erst bei Bedarf nach. Der Editor der Stapel-Karte
// (vertical-stack) bringt beide mit – deshalb einmal dessen Editor anfordern und kurz auf die Elemente warten.
let haEdP;
const HA_ED = ['hui-card-picker', 'hui-card-element-editor'];
export const loadHaEditors = () => HA_ED.every(n => customElements.get(n)) ? Promise.resolve() : (haEdP ||= (async () => {
  try {
    (await helpers()).createCardElement({type: 'vertical-stack', cards: []});
    await Promise.race([customElements.whenDefined('hui-vertical-stack-card'), wait(3000)]);
    await customElements.get('hui-vertical-stack-card')?.getConfigElement?.();
  } catch (e) { console.warn('[nova-cards] Kartenauswahl von HA nicht vorgeladen', e); }
  await Promise.race([Promise.all(HA_ED.map(n => customElements.whenDefined(n))), wait(3000)]);
})());

/* ---------- Nova Pop-up Card ---------- */

const A = 'auto';
const TEMPLATES = [
  {label: 'Eine Karte groß', rows: [[A]]},
  {label: 'Groß oben, zwei klein darunter', rows: [[A], [A, A]]},
  {label: 'Zwei nebeneinander', rows: [[A, A]]},
  {label: 'Raster 2×2', rows: [[A, A], [A, A]]},
  {label: 'Drei nebeneinander', rows: [[A, A, A]]},
  {label: 'Breit und schmal', rows: [['2/3', '1/3']]},
];
// Bekannte HA-Karten: Name + Icon für die Blöcke und die einfache Kartenauswahl
const HA_CARDS = {
  tile: ['Kachel', 'mdi:card-outline'], entities: ['Entitäten', 'mdi:format-list-bulleted'], button: ['Button', 'mdi:gesture-tap-button'],
  markdown: ['Text', 'mdi:text'], 'weather-forecast': ['Wetter', 'mdi:weather-partly-cloudy'], thermostat: ['Thermostat', 'mdi:thermostat'],
  light: ['Licht', 'mdi:lightbulb'], glance: ['Überblick', 'mdi:eye'], 'history-graph': ['Verlauf', 'mdi:chart-line'],
  'statistics-graph': ['Statistik', 'mdi:chart-bar'], sensor: ['Sensor', 'mdi:eye'], gauge: ['Anzeige', 'mdi:gauge'],
  'media-control': ['Medien', 'mdi:play-circle-outline'], 'picture-entity': ['Bild (Entität)', 'mdi:image'], 'picture-glance': ['Bild mit Symbolen', 'mdi:image-area'],
  area: ['Bereich', 'mdi:sofa'], map: ['Karte', 'mdi:map'], calendar: ['Kalender', 'mdi:calendar'], 'alarm-panel': ['Alarm', 'mdi:shield-home'],
  humidifier: ['Luftbefeuchter', 'mdi:air-humidifier'], heading: ['Überschrift', 'mdi:format-header-1'], iframe: ['Webseite', 'mdi:web'],
  'vertical-stack': ['Stapel vertikal', 'mdi:view-sequential'], 'horizontal-stack': ['Stapel horizontal', 'mdi:view-column'], grid: ['Raster', 'mdi:view-grid'],
};
const customs = () => (window.customCards || []).filter(c => c?.type);
const typeName = type => {
  if (!type) return 'Unbekannt';
  if (type.startsWith('custom:')) { const t = type.slice(7), m = customs().find(c => c.type === t); return m?.name?.replace(/ \(Dev\)$/, '') || t; }
  return HA_CARDS[type]?.[0] || type;
};
const cardTitle = (h, c) => c.title || c.name || c.heading || (c.entity && (h?.states[c.entity]?.attributes.friendly_name || c.entity)) || '';
const cardIcon = (h, c) => c.icon || (c.entity && h ? iconOf(h, {entity: c.entity}, '') : '') || HA_CARDS[c.type]?.[1] || 'mdi:card-outline';


// Info-Chips (Pop-up: Info-Leiste, Bereich: Werte-Chips)
export const INFO = [
  ENT, NAMEICON,
  g2({name: 'decimals', selector: {number: {min: 0, max: 4, mode: 'box'}}}, {name: 'alert', selector: {boolean: {}}}),
  g2({name: 'alert_state', selector: T}, ROLE('alert_color')),
  g2(NUM('alert_above'), NUM('alert_below')),
];
export const INFO_LABELS = {entity: 'Entität', name: 'Eigener Name (optional)', icon: 'Icon', decimals: 'Nachkommastellen', alert: 'Bei Achtung hervorheben', alert_state: 'Achtung bei Zustand', alert_color: 'Farbe', alert_above: 'Achtung über', alert_below: 'Achtung unter'};
export const INFO_HELPERS = {alert_state: 'z. B. on oder open, mehrere mit Komma. Leer = an bzw. Problem (z. B. Fenster offen).'};

export const GRID_ED_CSS = `
details.item>.body{gap:12px}
.mini{display:flex;flex-direction:column}
.gap{height:10px;border-radius:4px}.gap.hot{background:var(--primary-color);opacity:.7}
.rowb{display:flex;flex-direction:column;gap:6px}
.rh{display:flex;align-items:center;gap:2px;font-size:12px;font-weight:500;opacity:.8}.rh .fill{flex:1}
.row{display:flex;flex-wrap:wrap;gap:8px;border-radius:12px}
.row.hot{outline:2px dashed var(--primary-color);outline-offset:3px}
.blk{min-height:56px;box-sizing:border-box;border-radius:12px;border:1px solid var(--divider-color,#444);background:var(--secondary-background-color);
display:flex;align-items:center;gap:6px;padding:8px 10px 8px 2px;cursor:pointer;user-select:none;-webkit-user-select:none;min-width:0;position:relative;outline:none}
.blk:focus-visible{box-shadow:0 0 0 2px var(--primary-color)}
.blk.sel{border-color:var(--primary-color);box-shadow:0 0 0 1px var(--primary-color)}
.blk.lift{z-index:5;box-shadow:0 8px 24px rgba(0,0,0,.35);opacity:.92;cursor:grabbing}
.blk.before{box-shadow:inset 4px 0 0 var(--primary-color)}.blk.after{box-shadow:inset -4px 0 0 var(--primary-color)}
.drag{touch-action:none;cursor:grab;opacity:.5;padding:6px 2px;display:flex;flex:none}
.blk .bi{flex:none;color:var(--primary-color)}
.bl{flex:1;min-width:0}.bl b,.bl small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bl b{font-weight:500;font-size:13px}.bl small{font-size:11px;opacity:.65}
.sp{font-size:10.5px;opacity:.55;flex:none}
.blk.slot{border-style:dashed;justify-content:center;color:var(--primary-color);flex-direction:column;gap:2px;padding:10px;min-height:72px;font-size:12.5px;background:none}
.blk.slot ha-icon{--mdc-icon-size:30px}
.blk.slot .drag{position:absolute;left:2px;top:50%;transform:translateY(-50%)}
.blk.slot.hot{background:color-mix(in srgb,var(--primary-color) 14%,transparent)}
.rowb>.add{align-self:flex-start;margin:0}
.wd{display:flex;flex-wrap:wrap;gap:4px;align-items:center}.wd>span{font-size:12px;opacity:.75;margin-right:4px}
.wd button{border:1px solid var(--divider-color,#444);border-radius:999px;background:none;color:inherit;font:inherit;font-size:12px;padding:4px 10px;cursor:pointer}
.wd button.on{border-color:var(--primary-color);background:var(--primary-color);color:var(--text-primary-color,#fff)}
.panel{border:1px solid var(--primary-color);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:10px;margin-top:8px}
.tools{display:flex;align-items:center;gap:2px;flex-wrap:wrap}.tools .w{font-size:12px;opacity:.75;padding:0 2px;min-width:52px;text-align:center}.tools .fill{flex:1}
.tpls{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px}
.tpl{display:flex;flex-direction:column;gap:6px;align-items:center;padding:8px 6px;border-radius:12px;border:1px solid var(--divider-color,#444);background:none;color:inherit;cursor:pointer;font:inherit;font-size:11.5px;text-align:center}
.tpl:hover{border-color:var(--primary-color)}
.tp{display:flex;flex-direction:column;gap:3px;width:56px}.tp>span{display:flex;gap:3px}.tp i{display:block;height:13px;border-radius:3px;background:var(--primary-color);opacity:.55}
textarea.json{width:100%;box-sizing:border-box;background:var(--card-background-color,transparent);color:inherit;border:1px solid var(--divider-color,#444);border-radius:8px;padding:8px;font:inherit}
textarea.json{min-height:200px;font-family:monospace;font-size:12px}
textarea.bad{border-color:var(--error-color,#db4437)}
.lnk{background:none;border:none;color:var(--primary-color);cursor:pointer;font:inherit;font-size:12px;padding:0;align-self:flex-start}`;

const el = (t, cls, html) => { const e = document.createElement(t); if (cls) e.className = cls; if (html != null) e.innerHTML = html; return e; };
const clone = o => o == null ? o : JSON.parse(JSON.stringify(o));
const canPick = () => !!(customElements.get('ha-dialog') && customElements.get('hui-card-picker'));
// Kartenauswahl-Fenster: Maße wie beim Dialog „Karte hinzufügen“ von HA, gescrollt wird nur in der Kartenauswahl
const PICK_CSS = `
ha-dialog{--dialog-content-padding:0}
@media(min-width:451px) and (min-height:501px){ha-dialog{--ha-dialog-min-height:min(900px,80vh);--ha-dialog-max-height:var(--ha-dialog-min-height)}}
ha-dialog::part(body){overflow:hidden}
.body{display:flex;flex-direction:column;flex:1;min-height:0;height:100%}
hui-card-picker{flex:1;min-height:0}`;


// Raster-Teil eines Editors (Konfig-Schlüssel rows). Der Editor ruft _gridReset() am Anfang von _build() auf und hängt
// _layoutBody(body) und _contentBody(body) in seine Bereiche; _onTemplate() klappt nach einer Vorlage den Inhalt auf.
export const GridEditor = Base => class extends Base {
  set hass(h) {
    const old = this._hass;
    super.hass = h;
    if (hassChanged(old, h, this._ids)) [this._sub, this._pick, this._dlgPick].forEach(x => { if (x) try { x.hass = h; } catch { /* egal */ } });
  }
  // HA reicht dem Editor die Dashboard-Konfiguration (für Kartenauswahl und Karteneditor)
  set lovelace(l) { this._ll = l; }
  get lovelace() { return this._ll; }

  async _rebuild() { await loadHaEditors(); return super._rebuild(); }
  disconnectedCallback() { super.disconnectedCallback(); this._dlg?.close(); }
  _rows() { return normRows(this._config); }
  _emitRows(rows, keep) {
    const c = {...this._config, rows: serRows(rows)};
    delete c.cards; delete c.columns;
    if (keep !== undefined) {
      this._sel = null;
      rows.forEach((r, ri) => r.cells.forEach((x, ci) => { if (x === keep) this._sel = [ri, ci]; }));
    }
    this._emit(c);
  }

  _gridReset() { this._sub = this._pick = null; this._blocks = {}; }

  _layoutBody(b) {
    b.append(this._hint('Vorlage legt leere Plätze an. Vorhandene Karten wandern der Reihe nach hinein, übrige bleiben unten erhalten.'));
    const g = el('div', 'tpls');
    TEMPLATES.forEach(t => {
      const btn = el('button', 'tpl');
      btn.type = 'button';
      btn.innerHTML = `<span class="tp">${t.rows.map(row => `<span>${row.map(w => `<i style="flex:${flexOf(w, 3)}"></i>`).join('')}</span>`).join('')}</span><span></span>`;
      btn.lastChild.textContent = t.label;
      btn.addEventListener('click', e => { e.preventDefault(); this._template(t); });
      g.append(btn);
    });
    b.append(g);
  }
  _template(t) {
    const left = this._rows().flatMap(r => r.cells).filter(x => x.card);
    const rows = t.rows.map(row => ({cells: row.map(width => ({width, card: left.shift()?.card ?? null}))}));
    left.forEach(x => rows.push({cells: [{width: 'auto', card: x.card}]}));
    this._sel = null;
    this._onTemplate?.();
    this._emitRows(rows);
    this._rebuild();
  }

  /* --- Inhalt: Miniatur des Rasters --- */
  _contentBody(b) {
    const rows = this._rows();
    if (this._sel && !rows[this._sel[0]]?.cells[this._sel[1]]) this._sel = null;
    b.append(this._hint(`So sieht das Raster ${this.constructor.gridWhere || 'in der Karte'} aus. Spalten einer Zeile stehen nebeneinander. Antippen zum Bearbeiten, am Griff ziehen zum Verschieben (am PC geht auch der ganze Block).`));
    const mini = this._mini = el('div', 'mini');
    // Neue Spalte/Zeile entsteht erst, wenn im Fenster eine Karte gewählt wurde (Abbrechen ändert nichts).
    // Ohne Kartenauswahl von HA: leerer Platz, der im Block per YAML gefüllt wird.
    const insert = (fn, card) => { const rs = this._rows(), x = {width: 'auto', card: card ?? null}; fn(rs, x); this._picking = !card; this._yaml = false; this._emitRows(rs, x); this._rebuild(); };
    const add = fn => { if (!this._openPicker(c => insert(fn, c))) insert(fn); };
    const addCell = ri => add((rs, x) => { rs[ri].cells.forEach(k => { if (k.width === '1') k.width = 'auto'; }); rs[ri].cells.push(x); });
    const rowOp = fn => { const rs = this._rows(), keep = this._sel ? rs[this._sel[0]]?.cells[this._sel[1]] : undefined; fn(rs); this._emitRows(rs, keep ?? null); this._rebuild(); };
    rows.forEach((row, ri) => {
      mini.append(Object.assign(el('div', 'gap'), {_i: ri}));
      const rb = el('div', 'rowb');
      rb._r = ri;
      const rh = el('div', 'rh');
      rh.append(Object.assign(el('span'), {textContent: `Zeile ${ri + 1}`}), el('span', 'fill'),
        this._btn('mdi:arrow-up', 'Zeile nach oben', () => rowOp(rs => rs.splice(ri - 1, 0, ...rs.splice(ri, 1))), ri === 0),
        this._btn('mdi:arrow-down', 'Zeile nach unten', () => rowOp(rs => rs.splice(ri + 1, 0, ...rs.splice(ri, 1))), ri === rows.length - 1),
        this._btn('mdi:delete-outline', 'Zeile löschen', () => rowOp(rs => rs.splice(ri, 1))));
      const re = el('div', 'row');
      re._r = ri;
      row.cells.forEach((cell, ci) => re.append(this._block(cell, ri, ci)));
      rb.append(rh, re);
      if (this._sel?.[0] === ri) rb.append(this._panel(rows));
      rb.append(this._add('Spalte hinzufügen', () => addCell(ri)));
      mini.append(rb);
    });
    mini.append(Object.assign(el('div', 'gap'), {_i: rows.length}));
    b.append(mini);
    b.append(this._add('Zeile hinzufügen', () => add((rs, x) => rs.push({cells: [x]}))));
  }
  _block(cell, ri, ci) {
    const b = el('div', 'blk');
    b.tabIndex = 0; b.setAttribute('role', 'button');
    b.style.flex = flexOf(cell.width, 8);
    if (!FR[cell.width]) b.style.minWidth = 'min(100%,110px)';
    b._r = ri; b._c = ci;
    const sel = this._sel?.[0] === ri && this._sel?.[1] === ci;
    b.classList.toggle('sel', sel);
    const grip = el('span', 'drag', '<ha-icon icon="mdi:drag"></ha-icon>');
    grip.title = 'Ziehen zum Verschieben';
    if (!cell.card) {
      b.classList.add('slot');
      b.innerHTML = '<ha-icon icon="mdi:plus"></ha-icon><span>Karte wählen</span>';
    } else {
      b.innerHTML = '<ha-icon class="bi"></ha-icon><span class="bl"><b></b><small></small></span><span class="sp"></span>';
      this._label(b, cell);
    }
    b.prepend(grip);
    const toggle = () => {
      if (Date.now() - (this._dragged || 0) < 200) return;
      this._picking = !cell.card; this._yaml = false;
      this._sel = sel && cell.card ? null : [ri, ci];
      this._rebuild();
      if (!cell.card) this._pickFor(ri, ci);
    };
    b.addEventListener('click', e => { e.preventDefault(); toggle(); });
    b.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle(); } });
    this._dragInit(b, grip);
    this._blocks[`${ri}.${ci}`] = b;
    return b;
  }
  _label(b, cell) {
    const c = cell.card, t = cardTitle(this._hass, c), n = typeName(c.type);
    b.querySelector('.bi').setAttribute('icon', cardIcon(this._hass, c));
    b.querySelector('b').textContent = t || n;
    b.querySelector('small').textContent = t ? n : '';
    b.querySelector('.sp').textContent = FR[cell.width] && cell.width !== '1' ? cell.width : '';
  }

  /* --- Einstellungen des gewählten Blocks --- */
  _panel(rows) {
    const [ri, ci] = this._sel, cell = rows[ri].cells[ci], n = rows[ri].cells.length, p = el('div', 'panel');
    const set = fn => { const rs = this._rows(), x = rs[ri].cells[ci]; fn(rs, x); };
    const wd = el('div', 'wd');
    wd.append(Object.assign(el('span'), {textContent: 'Breite:'}));
    WIDTHS.forEach(([v, l]) => {
      const bt = el('button', v === (FR[cell.width] ? cell.width : 'auto') ? 'on' : '');
      bt.type = 'button'; bt.textContent = l;
      bt.title = v === 'auto' ? 'Teilt sich den freien Platz mit den anderen Spalten' : v === '1' ? 'Ganze Zeilenbreite' : `${l} der Zeilenbreite`;
      bt.addEventListener('click', e => { e.preventDefault(); set((rs, x) => { x.width = v; this._emitRows(rs, x); this._rebuild(); }); });
      wd.append(bt);
    });
    p.append(wd);
    const tools = el('div', 'tools');
    const mv = dir => set((rs, x) => { rs[ri].cells.splice(ci, 1); rs[ri].cells.splice(ci + dir, 0, x); this._emitRows(rs, x); this._rebuild(); });
    tools.append(
      this._btn('mdi:arrow-left', 'Nach links', () => mv(-1), ci === 0),
      this._btn('mdi:arrow-right', 'Nach rechts', () => mv(1), ci >= n - 1),
      el('span', 'fill'));
    if (cell.card) tools.append(
      this._btn('mdi:pencil-outline', this._yaml ? 'Grafischer Editor' : 'Als YAML bearbeiten', () => { this._yaml = !this._yaml; this._picking = false; this._rebuild(); }),
      this._btn('mdi:swap-horizontal', 'Andere Karte wählen', () => { if (!this._pickFor(ri, ci)) { this._picking = !this._picking; this._rebuild(); } }),
      this._btn('mdi:content-copy', 'Duplizieren', () => set((rs, x) => { const k = {width: x.width, card: clone(x.card)}; rs[ri].cells.splice(ci + 1, 0, k); this._emitRows(rs, k); this._rebuild(); })));
    tools.append(
      this._btn('mdi:delete-outline', 'Löschen', () => set(rs => { rs[ri].cells.splice(ci, 1); this._sel = null; this._emitRows(rs); this._rebuild(); })),
      this._btn('mdi:chevron-up', 'Zuklappen', () => { this._sel = null; this._rebuild(); }));
    p.append(tools);
    const box = el('div', 'body');
    box.style.padding = '0';
    p.append(box);
    if (!cell.card || this._picking) this._picker(box, ri, ci);
    else if (this._yaml || !customElements.get('hui-card-element-editor')) this._yamlEd(box, ri, ci, !this._yaml);
    else this._cardEditor(box, ri, ci);
    return p;
  }
  _setCard(ri, ci, card, rebuild) {
    const rs = this._rows(), x = rs[ri]?.cells[ci];
    if (!x) return;
    x.card = card;
    this._emitRows(rs, x);
    if (rebuild) { this._picking = false; this._yaml = false; this._rebuild(); return; }
    const b = this._blocks[`${ri}.${ci}`];
    if (b && !b.classList.contains('slot')) this._label(b, x);
  }

  // Leerer Platz: Kartenauswahl im eigenen Fenster öffnen. Ohne Kartenauswahl von HA die Karte als YAML eintragen.
  _picker(box, ri, ci) {
    if (canPick()) {
      box.append(this._hint('Die Kartenauswahl öffnet sich in einem eigenen Fenster. Die gewählte Karte kommt in diesen Platz.'));
      box.append(this._add('Karte wählen', () => this._pickFor(ri, ci)));
      return;
    }
    box.append(this._hint('Die Kartenauswahl von Home Assistant ist hier nicht verfügbar. Karte als YAML eintragen (z. B. type: tile) und übernehmen.'));
    let pending = null;
    this._yamlField(box, null, v => { pending = v; });
    box.append(this._add('Übernehmen', () => { if (pending) this._setCard(ri, ci, pending, true); }));
  }
  _pickFor(ri, ci) { return this._openPicker(c => this._setCard(ri, ci, c, true)); }

  // HA-INTERN: ha-dialog (Dialogfenster von HA, aufgebaut wie „Karte hinzufügen“ in einer Ansicht) mit hui-card-picker
  // (Kartenauswahl mit Suche und Vorschaubildern, geladen über loadHaEditors()). done(karte) nur bei Auswahl,
  // Schließen/Abbrechen ändert nichts. Fehlt eins der Elemente → false, dann bleibt der YAML-Weg im Block.
  _openPicker(done) {
    if (!canPick()) return false;
    this._dlg?.close();
    // Eigener Host am Dokument: das Fenster liegt so über dem Karteneditor und bekommt eigene Styles
    const host = document.createElement('div');
    try {
      const r = host.attachShadow({mode: 'open'});
      r.innerHTML = `<style>${PICK_CSS}</style><ha-dialog width="large" flexcontent header-title="Karte wählen"><div class="body"></div>
<ha-dialog-footer slot="footer"></ha-dialog-footer></ha-dialog>`;
      const d = r.querySelector('ha-dialog'), p = document.createElement('hui-card-picker');
      const cancel = document.createElement(customElements.get('ha-button') ? 'ha-button' : 'button');
      cancel.slot = 'secondaryAction';
      cancel.setAttribute('appearance', 'plain');
      cancel.textContent = 'Abbrechen';
      r.querySelector('ha-dialog-footer').append(cancel);
      p.hass = this._hass;
      if (this._ll) p.lovelace = this._ll;
      p.setAttribute('hide-clipboard', '');
      r.querySelector('.body').append(p);
      let taken = false, gone = false;
      const shut = () => { d.open = false; };
      const end = () => { if (gone) return; gone = true; host.remove(); if (this._dlg?.host === host) this._dlg = this._dlgPick = null; };
      cancel.addEventListener('click', shut);
      p.addEventListener('config-changed', e => {
        e.stopPropagation();
        const c = e.detail?.config;
        if (!c?.type || taken) return;
        taken = true;
        shut();
        done(c);
      });
      d.addEventListener('closed', e => { if (e.target === d) end(); });
      // Tasten nicht an Dashboard/Editor weiterreichen (wie beim Dialog von HA)
      host.addEventListener('keydown', e => e.stopPropagation());
      document.body.append(host);
      this._dlg = {host, close: () => { shut(); setTimeout(end, 400); }};
      this._dlgPick = p;
      d.open = true;
      return true;
    } catch (e) {
      console.warn('[nova-cards] Kartenauswahl-Fenster von HA nicht nutzbar', e);
      host.remove(); this._dlg = this._dlgPick = null;
      return false;
    }
  }

  // HA-INTERN: hui-card-element-editor (Karteneditor von HA mit eigenem GUI/YAML-Umschalter). Fehler → YAML-Feld.
  _cardEditor(box, ri, ci) {
    const cfg = this._rows()[ri].cells[ci].card;
    try {
      // Beim Neuaufbau für dieselbe Zelle den vorhandenen Karteneditor weiterverwenden
      const ed = this._reuse(`card-editor:${ri}.${ci}`, () => {
        const ed = document.createElement('hui-card-element-editor');
        ed.addEventListener('config-changed', e => {
          e.stopPropagation();
          const c = e.detail?.config;
          if (!e.detail?.error && c && typeof c === 'object' && c.type) ed._cb(c);
        });
        ed.addEventListener('GUImode-changed', e => e.stopPropagation());
        return ed;
      });
      ed._cb = c => this._setCard(ri, ci, c, false);
      ed.hass = this._hass;
      if (this._ll) ed.lovelace = this._ll;
      ed.value = cfg;
      box.append(ed);
      this._sub = ed;
    } catch (e) {
      console.warn('[nova-cards] Karteneditor von HA nicht nutzbar', e);
      box.innerHTML = '';
      this._yamlEd(box, ri, ci, true);
    }
  }
  // HA-INTERN: ha-yaml-editor. Fehlt er, ein Textfeld im JSON-Format (JSON ist auch gültiges YAML).
  _yamlEd(box, ri, ci, auto) {
    if (auto) box.append(this._hint('Der grafische Editor ist hier nicht verfügbar – Karte direkt als YAML bearbeiten.'));
    this._yamlField(box, this._rows()[ri].cells[ci].card, v => this._setCard(ri, ci, v, false));
  }
  // YAML-Feld für eine Kartenkonfiguration; cb bekommt nur gültige Karten (mit type)
  _yamlField(box, cfg, cb) {
    const take = v => { if (v && typeof v === 'object' && !Array.isArray(v) && v.type) { cb(v); return true; } return false; };
    if (customElements.get('ha-yaml-editor')) {
      try {
        const y = document.createElement('ha-yaml-editor');
        y.hass = this._hass;
        y.defaultValue = cfg;
        y.addEventListener('value-changed', e => { e.stopPropagation(); if (e.detail?.isValid !== false) take(e.detail?.value); });
        box.append(y);
        this._sub = y;
        return;
      } catch (e) { console.warn('[nova-cards] YAML-Editor von HA nicht nutzbar', e); }
    }
    const ta = el('textarea', 'json');
    ta.value = JSON.stringify(cfg || {type: ''}, null, 2);
    ta.spellcheck = false;
    ta.addEventListener('input', () => { let ok = false; try { ok = take(JSON.parse(ta.value)); } catch { /* ungültig */ } ta.classList.toggle('bad', !ok); });
    box.append(this._hint('JSON-Format, „type“ ist Pflicht.'), ta);
  }

  /* --- Drag-and-drop (Maus und Touch, über Pointer Events) --- */
  _dragInit(b, grip) {
    b.addEventListener('pointerdown', e => {
      if (e.button !== 0) return;
      if (e.pointerType !== 'mouse' && !e.composedPath().includes(grip)) return;
      const x0 = e.clientX, y0 = e.clientY;
      let on = false;
      const move = ev => {
        if (!on) {
          if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 6) return;
          on = true; b.classList.add('lift');
        }
        ev.preventDefault();
        b.style.transform = `translate(${ev.clientX - x0}px,${ev.clientY - y0}px)`;
        this._over(ev.clientX, ev.clientY, b);
      };
      const stop = drop => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', cancel);
        if (!on) return;
        this._dragged = Date.now();
        const t = drop ? this._drop : null;
        this._drop = null;
        if (t) this._move(b._r, b._c, t); else this._rebuild();
      };
      const up = () => stop(true), cancel = () => stop(false);
      window.addEventListener('pointermove', move, {passive: false});
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', cancel);
    });
  }
  // Ziel unter dem Zeiger: Lücke zwischen Zeilen (neue Zeile), leerer Platz oder vor/hinter einem Block
  _over(x, y, src) {
    const m = this._mini;
    m.querySelectorAll('.hot,.before,.after').forEach(n => n.classList.remove('hot', 'before', 'after'));
    const inR = (r, pad = 0) => x >= r.left && x <= r.right && y >= r.top - pad && y <= r.bottom + pad;
    let t = null;
    for (const g of m.querySelectorAll(':scope>.gap')) if (inR(g.getBoundingClientRect(), 4)) { t = {kind: 'row', i: g._i, el: g}; break; }
    if (!t) for (const rb of m.querySelectorAll(':scope>.rowb')) {
      if (!inR(rb.getBoundingClientRect())) continue;
      const re = rb.querySelector(':scope>.row');
      const blks = [...re.querySelectorAll(':scope>.blk')].filter(n => n !== src);
      const hit = blks.find(n => inR(n.getBoundingClientRect()));
      if (hit?.classList.contains('slot')) t = {kind: 'slot', r: hit._r, c: hit._c, el: hit, cls: 'hot'};
      else if (hit) { const rc = hit.getBoundingClientRect(), after = x > rc.left + rc.width / 2; t = {kind: 'cell', r: hit._r, c: hit._c + (after ? 1 : 0), el: hit, cls: after ? 'after' : 'before'}; }
      else t = {kind: 'cell', r: re._r, c: re.querySelectorAll(':scope>.blk').length, el: re};
      break;
    }
    if (!t) {
      const rows = m.querySelectorAll(':scope>.rowb');
      if (rows.length && y < rows[0].getBoundingClientRect().top) t = {kind: 'row', i: 0};
      else if (rows.length && y > rows[rows.length - 1].getBoundingClientRect().bottom) t = {kind: 'row', i: rows.length};
    }
    if (t?.el) t.el.classList.add(t.cls || 'hot');
    this._drop = t;
  }
  _move(r, c, t) {
    const rs = this._rows(), x = rs[r]?.cells[c], selCell = this._sel ? rs[this._sel[0]]?.cells[this._sel[1]] : null;
    if (!x) return this._rebuild();
    const GONE = {};
    if (t.kind === 'slot') { if (t.r === r && t.c === c) return this._rebuild(); rs[t.r].cells[t.c] = x; rs[r].cells[c] = GONE; }
    else if (t.kind === 'cell') { if (t.r === r && (t.c === c || t.c === c + 1)) return this._rebuild(); rs[r].cells[c] = GONE; rs[t.r].cells.splice(t.c, 0, x); }
    else { rs[r].cells[c] = GONE; rs.splice(t.i, 0, {cells: [x]}); }
    rs.forEach(row => { row.cells = row.cells.filter(k => k !== GONE); });
    this._emitRows(rs.filter(row => row.cells.length), selCell ?? null);
    this._rebuild();
  }
};
