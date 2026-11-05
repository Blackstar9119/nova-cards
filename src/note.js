import {define, docUrl, tag} from './shared/define.js';
import {setIcon} from './shared/utils.js';
import {NOVA_VARS, PANEL_CSS, FIELD_CSS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {hassChanged} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, BASE_LABELS} from './shared/editor-schema.js';
import {PRINT_CSS, PRINT_DEF, printButton, printPaint, runPrint, printSchema, PRINT_LABELS, PRINT_HELPERS} from './shared/print-button.js';

/* ---------- Nova Notiz Card ---------- */
// Mehrzeiliges Notizfeld; der Druck-Knopf gibt den Text an ein Skript weiter (Feld print_field, Standard „text“).
// Der Entwurf bleibt im Browser gespeichert, bis er gedruckt oder geleert wird.
const NCSS = `
.g.nt{gap:10px}
.fld.ta{flex:1 1 0;min-height:var(--th,180px);resize:none;border-radius:18px;padding:14px 16px;line-height:1.5;font-size:15px;
overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;white-space:pre-wrap}
.ft{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex:none}
.cnt{flex:1;min-width:0;font-size:12px;opacity:.55;white-space:nowrap;overflow:hidden}
.ft .pb.pill{flex:0 1 auto;min-width:44px}
.ft.wide .cnt{display:none}.ft.wide .pb.pill{flex:1 1 auto}
.cl{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;
border:1px solid var(--nv-box-border);background:var(--nv-chip);color:inherit;outline:none;-webkit-tap-highlight-color:transparent;transition:opacity .2s,transform .2s}
.cl ha-icon{--mdc-icon-size:20px}
.cl[disabled]{opacity:.35;cursor:default}
.cl:active:not([disabled]){transform:scale(.92)}
.cl:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
@container (max-width:260px){.cnt{display:none}}`;

const NDEF = {name: 'Notiz', icon: 'mdi:note-edit-outline', placeholder: 'Notiz schreiben …', show_header: true, show_clear: true, clear_after_print: true,
  height: 180, print_field: 'text', ...PRINT_DEF};
const STORE = 'nova-note:';

class NovaNoteCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('note-card-editor')); }
  static getStubConfig(h) {
    const script = Object.keys(h.states).find(id => /^script\..*notiz.*druck/.test(id));
    return script ? {print_script: script} : {};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._c = {...NDEF, ...c};
    this._ids = [this._c.print_script].filter(Boolean);
    if (this._e) this._apply();
  }
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    if (!this._e) this._build();
    if (hassChanged(old, h, this._ids)) this._render();
  }
  getCardSize() { return 4; }
  getGridOptions() { return {columns: 6, rows: 'auto', min_columns: 3}; }
  disconnectedCallback() { clearTimeout(this._pbT); clearTimeout(this._st); this._save(); }

  // Entwurf je Karte (Name + Skript), nur in diesem Browser
  _key() { return `${STORE}${this._c.storage_key || `${this._c.print_script || ''}|${this._c.name || ''}`}`; }
  _load() { try { return localStorage.getItem(this._key()) || ''; } catch { return ''; } }
  _save() {
    if (!this._e) return;
    const v = this._e.ta.value;
    try { if (v) localStorage.setItem(this._key(), v); else localStorage.removeItem(this._key()); } catch { /* ohne Speicher */ }
  }

  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${FIELD_CSS}${PRINT_CSS}${NCSS}</style><div class="g nt">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<textarea class="fld ta" spellcheck="true"></textarea>
<div class="ft"><span class="cnt"></span><button class="cl" type="button" title="Leeren" aria-label="Leeren"><ha-icon icon="mdi:eraser"></ha-icon></button></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), hd: q('.hd'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), ta: q('textarea'), ft: q('.ft'), cnt: q('.cnt'), cl: q('.cl')};
    const e = this._e;
    this._pstate = 'idle';
    e.ta.value = this._load();
    e.ta.addEventListener('input', () => { this._render(); clearTimeout(this._st); this._st = setTimeout(() => this._save(), 400); });
    e.ta.addEventListener('keydown', ev => {
      ev.stopPropagation();
      // Strg/Cmd + Enter druckt
      if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); this._print(); }
    });
    e.cl.addEventListener('click', () => { e.ta.value = ''; this._save(); this._render(); e.ta.focus(); });
    this._pb = printButton(() => this._print());
    e.ft.append(this._pb);
    this._apply();
  }
  _apply() {
    const c = this._c, e = this._e;
    e.hd.hidden = c.show_header === false;
    e.ta.placeholder = c.placeholder || '';
    e.g.style.setProperty('--th', `${Math.max(60, +c.height || NDEF.height)}px`);
    // Gespeicherter Entwurf zum (evtl. geänderten) Schlüssel
    if (!e.ta.value) e.ta.value = this._load();
    this._render();
  }
  _render() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !c || !e) return;
    setIcon(e.ic, c.icon);
    e.name.textContent = c.name || NDEF.name;
    const txt = e.ta.value, n = txt.trim().length, lines = txt ? txt.split('\n').length : 0;
    const missing = c.print_script && !h.states[c.print_script];
    e.sub.textContent = missing ? `Skript nicht gefunden: ${c.print_script}` : n ? 'Bereit zum Drucken' : 'Leer';
    e.cnt.textContent = n ? `${txt.length} Zeichen · ${lines} ${lines === 1 ? 'Zeile' : 'Zeilen'}` : '';
    e.cl.hidden = c.show_clear === false;
    e.cl.disabled = !txt;
    this._pb.hidden = !c.print_script;
    e.ft.hidden = !c.print_script && c.show_clear === false;
    printPaint(this._pb, c, this._pstate, n > 0 && !missing);
    e.ft.classList.toggle('wide', c.print_style !== 'round' && c.show_clear === false);
  }
  async _print() {
    const c = this._c, e = this._e, txt = e.ta.value.replace(/\s+$/, '');
    if (!txt.trim() || this._pstate === 'busy') return;
    const ok = await runPrint(this, this._h, c.print_script, {[c.print_field || 'text']: txt}, st => { this._pstate = st; this._render(); });
    if (ok && c.clear_after_print !== false && e.ta.value.replace(/\s+$/, '') === txt) { e.ta.value = ''; this._save(); this._render(); }
  }
}
define('note-card', NovaNoteCard, {name: 'Nova Notiz Card', description: 'Mehrzeiliges Notizfeld mit Druck-Knopf: gibt den Text an ein Skript weiter (z. B. für einen Bondrucker) und leert das Feld danach.', documentationURL: docUrl('nova-notiz-card')});

/* ---------- Editor Notiz Card ---------- */
const GEN = [
  g2({name: 'name', selector: T}, {name: 'icon', selector: I}),
  {name: 'show_header', selector: {boolean: {}}},
  {name: 'placeholder', selector: T},
  g2({name: 'show_clear', selector: {boolean: {}}}, {name: 'height', selector: {number: {min: 60, max: 1000, step: 10, mode: 'box', unit_of_measurement: 'px'}}}),
];
const PRINT = printSchema([g2({name: 'print_field', selector: T}, {name: 'clear_after_print', selector: {boolean: {}}})]);
const LABELS = {...BASE_LABELS, ...PRINT_LABELS, name: 'Name', show_header: 'Kopfzeile anzeigen', placeholder: 'Platzhalter im Textfeld',
  show_clear: 'Knopf „Leeren“', height: 'Mindesthöhe des Textfelds', print_field: 'Feldname im Skript', clear_after_print: 'Nach dem Druck leeren'};
const HELPERS = {...PRINT_HELPERS, print_field: 'Unter diesem Namen bekommt das Skript den Text (Standard: text).',
  height: 'Im Raster füllt das Textfeld den Platz aus.'};

class NovaNoteCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static helpers = HELPERS;
  static openSections = ['general'];
  _build() {
    const r = this.shadowRoot, c0 = this._config;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), data = {...NDEF, ...c0};
    const strip = c => { Object.entries(NDEF).forEach(([k, x]) => c[k] === x && delete c[k]); return c; };
    const form = schema => this._form(schema, data, v => this._emit(strip(merge(this._config, names(schema), v))));
    w.append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => b.append(form(GEN))),
      this._section('print', 'mdi:printer-pos', 'Drucken', b => b.append(form(PRINT))));
  }
}
define('note-card-editor', NovaNoteCardEditor);
