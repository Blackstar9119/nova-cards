import {define, docUrl, tag} from './shared/define.js';
import {setIcon} from './shared/utils.js';
import {NOVA_VARS, PANEL_CSS, FIELD_CSS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {hassChanged} from './shared/lifecycle.js';
import {TodoFeed} from './shared/todo.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, BASE_LABELS} from './shared/editor-schema.js';
import {PRINT_CSS, PRINT_DEF, printButton, printPaint, paintBtn, runPrint, runFeedback, stopFeedback, printSchema, PRINT_LABELS, PRINT_HELPERS} from './shared/print-button.js';

/* ---------- Nova Notiz Card ---------- */
// Mehrzeiliges Notizfeld; der Druck-Knopf gibt den Text an ein Skript weiter (Feld print_field, Standard „text“).
// Der Entwurf bleibt im Browser gespeichert, bis er gedruckt, gespeichert oder geleert wird.
// Mit notes_entity (todo-Liste) gibt es „Speichern“ und darunter die gespeicherten Notizen (neueste oben), je mit
// Drucken und Löschen. Eine Notiz = Eintrag mit Kurzfassung (erste Zeile) als summary und ganzem Text als description.
const NCSS = `
.g.nt{gap:var(--nv-s5)}
.fld.ta{flex:1 1 0;min-height:var(--th,180px);resize:none;border-radius:18px;padding:var(--nv-pad);line-height:1.5;
overflow-y:auto;overscroll-behavior:auto contain;scrollbar-width:thin;white-space:pre-wrap}
.ft{display:flex;align-items:center;justify-content:flex-end;gap:var(--nv-s4);flex:none;container-type:inline-size;width:100%}
.ft[hidden]{display:none}
.cnt{flex:1;min-width:0;font-size:var(--nv-fs-4);opacity:.55;white-space:nowrap;overflow:hidden}
.ft .pb.pill{flex:0 1 auto;min-width:44px}
.ft.wide .cnt{display:none}.ft.wide .pb.pill{flex:1 1 0}
.cl,.nb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;
border:1px solid var(--nv-box-border);background:var(--nv-chip);color:inherit;outline:none;-webkit-tap-highlight-color:transparent;
transition:opacity var(--nv-d2),transform var(--nv-d2),background-color var(--nv-d2),border-color var(--nv-d2),color var(--nv-d2)}
.cl ha-icon{--mdc-icon-size:var(--nv-icon-lg)}
.cl[disabled]{opacity:.35;cursor:default}
.cl:active:not([disabled]),.nb:active{transform:scale(var(--nv-press))}
.cl:focus-visible,.nb:focus-visible{box-shadow:var(--nv-focus)}
@container (max-width:420px){.cnt{display:none}}
@container (max-width:330px){.ft .pb.pill .pl{display:none}.ft .pb.pill{padding:0;flex:0 0 44px}}
.ns{flex:1 1 0;min-height:var(--nh,180px);display:flex;flex-direction:column;gap:var(--nv-s3)}
.ns[hidden]{display:none}
.ns .bt{margin:var(--nv-s1) var(--nv-s1) 0}
.nl{flex:1 1 0;min-height:0;overflow-y:auto;overscroll-behavior:auto contain;display:flex;flex-direction:column;gap:var(--nv-s3);scrollbar-width:thin;
margin:0 -4px;padding:0 var(--nv-s2) var(--nv-s5);-webkit-mask-image:linear-gradient(#000 calc(100% - 14px),transparent);mask-image:linear-gradient(#000 calc(100% - 14px),transparent)}
.nr{display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s4) var(--nv-s4) var(--nv-s4) var(--nv-s7);border-radius:var(--nv-r-md);flex:none;min-width:0;
background:rgba(var(--nv-tint),.05);border:1px solid rgba(var(--nv-tint),.07)}
.nr .tx{flex:1;min-width:0}
.nr b{display:block;font-weight:var(--nv-fw-medium);font-size:var(--nv-fs-8);overflow-wrap:anywhere}
.nr small{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:var(--nv-fs-4);opacity:.6;margin-top:var(--nv-s1);white-space:pre-line;overflow-wrap:anywhere}
.nr .pb,.nr .nb{width:38px;height:38px;min-width:38px}
.nr .pb ha-icon,.nr .nb ha-icon{--mdc-icon-size:19px}
.nb.arm{border-color:color-mix(in srgb,var(--nv-error) 70%,transparent);background:color-mix(in srgb,var(--nv-error) 22%,transparent);color:var(--nv-error)}
.msg{display:flex;align-items:center;gap:var(--nv-s4);font-size:var(--nv-fs-6);opacity:.6;padding:var(--nv-s4) var(--nv-s2)}
.msg ha-icon{--mdc-icon-size:var(--nv-icon-md)}`;

const NDEF = {name: 'Notiz', icon: 'mdi:note-edit-outline', placeholder: 'Notiz schreiben …', show_header: true, show_clear: true, clear_after_print: true,
  clear_after_save: true, height: 180, notes_height: 180, print_field: 'text', ...PRINT_DEF};
const STORE = 'nova-note:';
const SHORT = 60, ARM = 3000;

// Kurzfassung: erste nichtleere Zeile, lange Zeilen an einer Wortgrenze gekürzt
const shortOf = txt => {
  const line = txt.split('\n').map(s => s.trim()).find(Boolean) || '';
  if (line.length <= SHORT) return line;
  const cut = line.slice(0, SHORT), sp = cut.lastIndexOf(' ');
  return `${(sp > SHORT / 2 ? cut.slice(0, sp) : cut).trimEnd()} …`;
};
// Ganzer Text einer gespeicherten Notiz
const textOf = it => (it.description || it.summary || '').replace(/\s+$/, '');

class NovaNoteCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('note-card-editor')); }
  static getStubConfig(h) {
    const ids = Object.keys(h.states);
    const script = ids.find(id => /^script\..*notiz.*druck/.test(id)), notes = ids.find(id => /^todo\..*notiz/.test(id));
    return {...(script ? {print_script: script} : {}), ...(notes ? {notes_entity: notes} : {})};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._c = {...NDEF, ...c};
    (this._feed ||= new TodoFeed(this, () => this._render())).setEntity(this._c.notes_entity);
    this._ids = [this._c.print_script, this._c.notes_entity].filter(Boolean);
    if (this._e) this._apply();
    if (this._h) this._feed.update(this._h);
  }
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    if (!this._e) this._build();
    this._feed.update(h, old);
    if (hassChanged(old, h, this._ids)) this._render();
  }
  getCardSize() { return this._c?.notes_entity ? 8 : 4; }
  getGridOptions() { return {columns: 6, rows: 'auto', min_columns: 3}; }
  connectedCallback() { if (this._h && this._c) this._feed.update(this._h); }
  disconnectedCallback() { this._feed?.stop(); stopFeedback(this); clearTimeout(this._st); clearTimeout(this._armT); this._armed = null; this._save(); }

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
<div class="ft"><span class="cnt"></span><button class="cl" type="button" title="Leeren" aria-label="Leeren"><ha-icon icon="mdi:eraser"></ha-icon></button></div>
<div class="ns"><div class="bt">Gespeichert</div><div class="nl"></div></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), hd: q('.hd'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), ta: q('textarea'), ft: q('.ft'), cnt: q('.cnt'), cl: q('.cl'),
      ns: q('.ns'), nt: q('.ns .bt'), nl: q('.nl')};
    const e = this._e;
    this._pstate = 'idle'; this._sstate = 'idle'; this._nstate = {};
    e.ta.value = this._load();
    e.ta.addEventListener('input', () => { this._render(); clearTimeout(this._st); this._st = setTimeout(() => this._save(), 400); });
    e.ta.addEventListener('keydown', ev => {
      ev.stopPropagation();
      // Strg/Cmd + Enter druckt
      if (ev.key === 'Enter' && (ev.ctrlKey || ev.metaKey)) { ev.preventDefault(); this._print(); }
    });
    e.cl.addEventListener('click', () => { e.ta.value = ''; this._save(); this._render(); e.ta.focus(); });
    this._sb = printButton(() => this._store());
    this._pb = printButton(() => this._print());
    e.ft.append(this._sb, this._pb);
    this._apply();
  }
  _apply() {
    const c = this._c, e = this._e;
    e.hd.hidden = c.show_header === false;
    e.ta.placeholder = c.placeholder || '';
    e.g.style.setProperty('--th', `${Math.max(60, +c.height || NDEF.height)}px`);
    e.g.style.setProperty('--nh', `${Math.max(60, +c.notes_height || NDEF.notes_height)}px`);
    // Gespeicherter Entwurf zum (evtl. geänderten) Schlüssel
    if (!e.ta.value) e.ta.value = this._load();
    this._key2 = null;
    this._render();
  }
  _render() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !c || !e) return;
    setIcon(e.ic, c.icon);
    e.name.textContent = c.name || NDEF.name;
    const txt = e.ta.value, n = txt.trim().length, lines = txt ? txt.split('\n').length : 0;
    const missing = c.print_script && !h.states[c.print_script];
    const notes = c.notes_entity && h.states[c.notes_entity];
    const saved = this._feed.items?.filter(i => i.status !== 'completed') || [];
    e.sub.textContent = missing ? `Skript nicht gefunden: ${c.print_script}` : n ? 'Bereit' : notes ? `${saved.length} gespeichert` : 'Leer';
    e.cnt.textContent = n ? `${txt.length} Zeichen · ${lines} ${lines === 1 ? 'Zeile' : 'Zeilen'}` : '';
    e.cl.hidden = c.show_clear === false;
    e.cl.disabled = !txt;
    const pill = c.print_style !== 'round';
    this._pb.hidden = !c.print_script;
    this._sb.hidden = !c.notes_entity;
    e.ft.hidden = !c.print_script && !c.notes_entity && c.show_clear === false;
    printPaint(this._pb, c, this._pstate, n > 0 && !missing);
    paintBtn(this._sb, {icon: 'mdi:content-save-outline', label: 'Speichern', pill, busy: 'Speichert …', ok: 'Gespeichert', err: 'Fehler'}, this._sstate, n > 0 && !!notes);
    e.ft.classList.toggle('wide', pill && c.show_clear === false);
    this._renderNotes(saved, notes, missing);
  }
  // Gespeicherte Notizen, neueste oben (todo.add_item hängt hinten an)
  _renderNotes(saved, notes, missing) {
    const c = this._c, e = this._e;
    e.ns.hidden = !c.notes_entity;
    if (!c.notes_entity) return;
    let msg = null;
    if (!notes) msg = ['mdi:alert-circle-outline', `Liste nicht gefunden: ${c.notes_entity}`];
    else if (this._feed.err && !this._feed.items) msg = ['mdi:alert-circle-outline', this._feed.err];
    else if (!this._feed.items) msg = ['mdi:timer-sand', 'Wird geladen …'];
    else if (!saved.length) msg = ['mdi:note-outline', 'Noch keine Notizen gespeichert'];
    const rows = [...saved].reverse();
    e.nt.textContent = rows.length ? `Gespeichert · ${rows.length}` : 'Gespeichert';
    const key = JSON.stringify([msg, rows.map(r => [r.uid, r.summary, r.description, this._nstate[r.uid], this._armed === r.uid]), !!c.print_script, missing, c.print_icon]);
    if (key === this._key2) return;
    this._key2 = key;
    if (msg) {
      const m = document.createElement('div');
      m.className = 'msg';
      m.innerHTML = '<ha-icon></ha-icon><span></span>';
      m.firstChild.setAttribute('icon', msg[0]);
      m.lastChild.textContent = msg[1];
      e.nl.replaceChildren(m);
      return;
    }
    e.nl.replaceChildren(...rows.map(it => this._noteRow(it, missing)));
  }
  _noteRow(it, missing) {
    const c = this._c, el = document.createElement('div');
    el.className = 'nr';
    el.innerHTML = '<div class="tx"><b></b><small></small></div>';
    el.querySelector('b').textContent = it.summary;
    const sm = el.querySelector('small'), full = textOf(it), rest = full.startsWith(it.summary.replace(/ …$/, '')) ? full.slice(it.summary.replace(/ …$/, '').length).trim() : full;
    sm.textContent = it.description ? rest : '';
    sm.hidden = !sm.textContent;
    if (c.print_script) {
      const pb = printButton(() => this._printNote(it));
      paintBtn(pb, {icon: c.print_icon || PRINT_DEF.print_icon, label: 'Drucken', pill: false, busy: 'Druckt …', ok: 'Gedruckt', err: 'Fehler'}, this._nstate[it.uid], !missing);
      el.append(pb);
    }
    const del = document.createElement('button');
    del.type = 'button';
    const armed = this._armed === it.uid;
    del.className = `nb${armed ? ' arm' : ''}`;
    del.title = armed ? 'Nochmal tippen zum Löschen' : 'Löschen';
    del.setAttribute('aria-label', del.title);
    del.innerHTML = `<ha-icon icon="${armed ? 'mdi:delete-alert-outline' : 'mdi:delete-outline'}"></ha-icon>`;
    del.addEventListener('click', ev => { ev.stopPropagation(); this._delete(it); });
    el.append(del);
    return el;
  }
  async _print() {
    const c = this._c, e = this._e, txt = e.ta.value.replace(/\s+$/, '');
    if (!txt.trim() || this._pstate === 'busy') return;
    const ok = await runPrint(this, this._h, c.print_script, {[c.print_field || 'text']: txt}, st => { this._pstate = st; this._render(); });
    if (ok && c.clear_after_print !== false && e.ta.value.replace(/\s+$/, '') === txt) { e.ta.value = ''; this._save(); this._render(); }
  }
  _printNote(it) {
    const c = this._c, txt = textOf(it);
    if (!txt || this._nstate[it.uid] === 'busy') return;
    runPrint(this, this._h, c.print_script, {[c.print_field || 'text']: txt}, st => {
      if (st === 'idle') delete this._nstate[it.uid]; else this._nstate[it.uid] = st;
      this._render();
    }, it.uid);
  }
  async _store() {
    const c = this._c, e = this._e, h = this._h, txt = e.ta.value.replace(/\s+$/, '').replace(/^\s*\n/, '');
    if (!txt.trim() || !c.notes_entity || this._sstate === 'busy') return;
    const summary = shortOf(txt), data = {item: summary, ...(txt !== summary ? {description: txt} : {})};
    const ok = await runFeedback(this, 'save', () => this._feed.call(h, 'add_item', data), st => { this._sstate = st; this._render(); });
    if (ok && c.clear_after_save !== false && e.ta.value.replace(/\s+$/, '').replace(/^\s*\n/, '') === txt) { e.ta.value = ''; this._save(); this._render(); }
  }
  // Löschen in zwei Schritten: erstes Antippen färbt den Knopf rot, zweites (innerhalb von 3 s) löscht
  _delete(it) {
    clearTimeout(this._armT);
    if (this._armed !== it.uid) {
      this._armed = it.uid;
      this._armT = setTimeout(() => { this._armed = null; this._render(); }, ARM);
      this._render();
      return;
    }
    this._armed = null;
    this._feed.call(this._h, 'remove_item', {item: [it.uid]}).catch(err => console.warn('[nova-cards] Notiz: Löschen fehlgeschlagen', err));
    this._render();
  }
}
define('note-card', NovaNoteCard, {name: 'Nova Notiz Card', description: 'Mehrzeiliges Notizfeld mit Druck-Knopf (z. B. für einen Bondrucker); Notizen lassen sich in einer todo-Liste speichern und später wieder drucken oder löschen.', documentationURL: docUrl('nova-notiz-card')});

/* ---------- Editor Notiz Card ---------- */
const H = n => ({name: n, selector: {number: {min: 60, max: 1000, step: 10, mode: 'box', unit_of_measurement: 'px'}}});
const GEN = [
  g2({name: 'name', selector: T}, {name: 'icon', selector: I}),
  {name: 'show_header', selector: {boolean: {}}},
  {name: 'placeholder', selector: T},
  g2({name: 'show_clear', selector: {boolean: {}}}, H('height')),
];
const NOTES = [
  {name: 'notes_entity', selector: {entity: {domain: 'todo'}}},
  g2(H('notes_height'), {name: 'clear_after_save', selector: {boolean: {}}}),
];
const PRINT = printSchema([g2({name: 'print_field', selector: T}, {name: 'clear_after_print', selector: {boolean: {}}})]);
const LABELS = {...BASE_LABELS, ...PRINT_LABELS, name: 'Name', show_header: 'Kopfzeile anzeigen', placeholder: 'Platzhalter im Textfeld',
  show_clear: 'Knopf „Leeren“', height: 'Mindesthöhe des Textfelds', print_field: 'Feldname im Skript', clear_after_print: 'Nach dem Druck leeren',
  notes_entity: 'Liste für gespeicherte Notizen (todo)', notes_height: 'Mindesthöhe der Liste', clear_after_save: 'Nach dem Speichern leeren'};
const HELPERS = {...PRINT_HELPERS, print_field: 'Unter diesem Namen bekommt das Skript den Text (Standard: text).',
  height: 'Im Raster füllt das Textfeld den Platz aus.',
  notes_entity: 'Leer = ohne Speichern. Z. B. eine lokale To-do-Liste „Notizen“. Erste Zeile = Titel, ganzer Text in der Beschreibung.'};

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
      this._section('notes', 'mdi:note-multiple-outline', 'Gespeicherte Notizen', b => b.append(form(NOTES))),
      this._section('print', 'mdi:printer-pos', 'Drucken', b => b.append(form(PRINT))));
  }
}
define('note-card-editor', NovaNoteCardEditor);
