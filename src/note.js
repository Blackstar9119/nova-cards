import {define, docUrl, tag} from './shared/define.js';
import {setIcon} from './shared/utils.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, FIELD_CSS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {hassChanged} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, sel, BASE_LABELS} from './shared/editor-schema.js';
import {PRINT_CSS, PRINT_DEF, printButton, paintBtn, runPrint, stopFeedback, printSchema, PRINT_LABELS, PRINT_HELPERS} from './shared/print-button.js';
import {watch, notes as api, storeHint} from './shared/nova-store.js';
import {RICH_CSS, richEditor, toPlain, firstLine, isEmpty} from './shared/rich-text.js';
import {VIEW_CSS, roundBtn, armButton, setBtnIcon, ago} from './shared/stack-view.js';

/* ---------- Nova Notiz Card ---------- */
// Mehrere Notizen mit Titel und formatiertem Text. Liste (angepinnte oben) ↔ Detail zum Schreiben; gespeichert wird
// in der Nova-Integration (auf allen Geräten gleich), automatisch kurz nach dem Tippen. Der Druck-Knopf gibt Titel und
// Text als Klartext an ein Skript (Feld print_field, Standard „text“), z. B. für einen Bondrucker.
const NCSS = `
.g.nt{gap:var(--nv-s5)}
.hd .rb{margin-left:auto}
.nl{display:flex;flex-direction:column;gap:var(--nv-s3)}
.nr{display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s5) var(--nv-s6) var(--nv-s5) var(--nv-s7);border-radius:var(--nv-r-md);flex:none;min-width:0;position:relative;
background:rgba(var(--nv-tint),.05);border:1px solid rgba(var(--nv-tint),.07);transition:background-color var(--nv-d3),border-color var(--nv-d3),transform var(--nv-d2) var(--nv-ease)}
.nr.new{animation:rb-in var(--nv-d5) var(--nv-ease) both;animation-delay:calc(var(--i,0) * 40ms)}
.nr:active{transform:scale(.985)}
.nr.pin{border-color:color-mix(in srgb,var(--nv-accent) 38%,transparent);background:color-mix(in srgb,var(--nv-accent) 9%,rgba(var(--nv-tint),.05))}
.nr .tx{flex:1;min-width:0}
.nr b{display:block;font-weight:var(--nv-fw-medium);font-size:var(--nv-fs-8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nr .pv{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:var(--nv-fs-4);opacity:.6;margin-top:var(--nv-s1);overflow-wrap:anywhere}
.nr time{font-size:var(--nv-fs-2);opacity:.5;white-space:nowrap;flex:none}
.nr .pi{--mdc-icon-size:16px;color:var(--nv-accent-ink);flex:none;transform:rotate(35deg)}
.nt.compact .nr{padding-top:var(--nv-s4);padding-bottom:var(--nv-s4)}
.nt.compact .nr .pv{display:none}
.more{align-self:center;border:0;background:transparent;color:inherit;font:inherit;font-size:var(--nv-fs-5);opacity:.7;padding:var(--nv-s4) var(--nv-s6);cursor:pointer;border-radius:var(--nv-r-pill);
display:inline-flex;align-items:center;gap:var(--nv-s2);-webkit-tap-highlight-color:transparent}
.more ha-icon{--mdc-icon-size:18px}
.more:focus-visible{box-shadow:var(--nv-focus);outline:none}
.ti{height:44px;border-radius:var(--nv-r-md);padding:0 var(--nv-s7);font-weight:var(--nv-fw-bold);flex:none}
.ed{flex:1 1 0;min-height:0;display:flex;flex-direction:column;gap:var(--nv-s4)}
.ed .rtw{flex:1 1 0;min-height:0;display:flex;flex-direction:column;gap:var(--nv-s4)}
.ed .rte{flex:1 1 0;min-height:0;overflow-y:auto;overscroll-behavior:auto contain;scrollbar-width:thin;border-radius:var(--nv-r-md);padding:var(--nv-s6) var(--nv-s7);
border:1px solid var(--nv-box-border);background:var(--nv-box);transition:border-color var(--nv-d2),box-shadow var(--nv-d2)}
.ed .rte:focus{border-color:color-mix(in srgb,var(--nv-active) 75%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 22%,transparent) var(--nv-glow),transparent)}
.bar .pb{width:44px;padding:0}
.rb.pinb.on ha-icon{transform:rotate(35deg)}
@media (prefers-reduced-motion:reduce){.nr.new{animation:none}}`;

const NDEF = {name: 'Notizen', icon: 'mdi:note-multiple-outline', show_header: true, view: 'full', max_notes: 0, height: 320, print_field: 'text', ...PRINT_DEF};
const SAVE_MS = 800;

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
    this._watch();
    if (hassChanged(old, h, this._ids)) this._render();
  }
  getCardSize() { return 6; }
  getGridOptions() { return {columns: 6, rows: 'auto', min_columns: 3}; }
  connectedCallback() { this._watch(); }
  disconnectedCallback() { this._flush(); this._off?.(); this._off = null; stopFeedback(this); clearTimeout(this._st); clearTimeout(this._okT); this._del?.reset(); }

  _watch() {
    if (this._off || !this._h || !this.isConnected) return;
    this._off = watch(this._h, 'notes', this, (d, err) => { this._data = d; this._err = err; this._onData(); });
  }

  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${FIELD_CSS}${PRINT_CSS}${VIEW_CSS}${RICH_CSS}${NCSS}</style><div class="g nt">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<div class="stage"><div class="view main"><div class="scroll"><div class="nl"></div></div></div>
<div class="view side"><div class="bar"></div><input class="fld ti" type="text" placeholder="Titel" maxlength="200" enterkeyhint="next" autocomplete="off"><div class="ed"></div></div></div></div>`;
    const q = s => r.querySelector(s);
    const e = this._e = {g: q('.g'), hd: q('.hd'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), nl: q('.nl'), bar: q('.bar'), ti: q('.ti'), ed: q('.ed')};
    this._pstate = 'idle'; this._all = false; this._seen = new Set();
    e.add = roundBtn('mdi:plus', 'Neue Notiz', () => this._open(null), 'plus');
    e.hd.append(e.add);
    // Leiste der Detailansicht: Zurück · Stand · Anpinnen · Drucken · Löschen
    e.back = roundBtn('mdi:arrow-left', 'Zurück zur Liste', () => this._close());
    e.state = document.createElement('div'); e.state.className = 'state sp';
    e.pin = roundBtn('mdi:pin-outline', 'Anpinnen', () => this._togglePin(), 'pinb');
    this._pb = printButton(() => this._print());
    this._del = armButton('mdi:delete-outline', 'Löschen', () => this._remove());
    e.bar.append(e.back, e.state, e.pin, this._pb, this._del);
    this._rt = richEditor({placeholder: 'Notiz schreiben …', onInput: () => this._dirty()});
    e.ed.append(this._rt.el);
    e.ti.addEventListener('input', () => this._dirty());
    e.ti.addEventListener('keydown', ev => { ev.stopPropagation(); if (ev.key === 'Enter') { ev.preventDefault(); this._rt.focus(); } });
    this._apply();
  }
  _apply() {
    const c = this._c, e = this._e;
    e.hd.hidden = c.show_header === false;
    e.g.classList.toggle('compact', c.view === 'compact');
    e.g.style.setProperty('--vh', `${Math.max(160, +c.height || NDEF.height)}px`);
    this._key = null;
    this._render();
  }

  _list() {
    return [...(this._data?.notes || [])].sort((a, b) => (b.pinned - a.pinned) || (b.updated - a.updated));
  }
  _onData() {
    // Offene Notiz wurde auf einem anderen Gerät geändert: übernehmen, solange hier nichts Ungespeichertes steht
    const cur = this._cur && this._data?.notes.find(n => n.id === this._cur.id);
    if (this._cur?.id && this._data && !cur) { this._cur = null; this._e?.g.classList.remove('detail'); }
    else if (cur && !this._pending && !this._saving && cur.updated !== this._cur.updated) { this._cur = {...cur}; this._fill(); }
    this._render();
  }
  _render() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !c || !e) return;
    setIcon(e.ic, c.icon);
    e.name.textContent = c.name || NDEF.name;
    const list = this._list(), n = list.length;
    e.sub.textContent = this._err ? '' : !this._data ? 'Wird geladen …' : n ? `${n} ${n === 1 ? 'Notiz' : 'Notizen'}` : 'Noch leer';
    e.add.disabled = !this._data;
    const max = Math.max(0, +c.max_notes || 0), cut = max && !this._all && n > max ? list.slice(0, max) : list;
    let msg = null;
    if (this._err) msg = storeHint(this._err, 'notes');
    else if (!this._data) msg = ['mdi:timer-sand', 'Wird geladen …'];
    else if (!n) msg = ['mdi:note-plus-outline', 'Noch keine Notizen – mit + legst du die erste an.'];
    const key = JSON.stringify([msg, cut.map(x => [x.id, x.title, x.body, x.pinned, ago(x.updated)]), n, this._all, c.view]);
    if (key !== this._key) {
      this._key = key;
      if (msg) {
        const m = document.createElement('div');
        m.className = 'msg'; m.innerHTML = '<ha-icon></ha-icon><span></span>';
        m.firstChild.setAttribute('icon', msg[0]); m.lastChild.textContent = msg[1];
        e.nl.replaceChildren(m);
      } else {
        const rows = cut.map((x, i) => this._row(x, i));
        if (max && n > max) {
          const b = document.createElement('button');
          b.type = 'button'; b.className = 'more';
          b.innerHTML = `<ha-icon icon="${this._all ? 'mdi:chevron-up' : 'mdi:chevron-down'}"></ha-icon><span></span>`;
          b.lastChild.textContent = this._all ? 'Weniger anzeigen' : `${n - max} weitere anzeigen`;
          b.addEventListener('click', () => { this._all = !this._all; this._render(); });
          rows.push(b);
        }
        e.nl.replaceChildren(...rows);
      }
    }
    this._paintBar();
  }
  _row(x, i) {
    const el = document.createElement('div');
    // Einblenden nur für Zeilen, die neu dazukommen – nicht bei jedem Neuzeichnen
    el.className = `nr${x.pinned ? ' pin' : ''}${this._seen.has(x.id) ? '' : ' new'}`;
    this._seen.add(x.id);
    el.style.setProperty('--i', Math.min(i, 8));
    el.innerHTML = `${x.pinned ? '<ha-icon class="pi" icon="mdi:pin"></ha-icon>' : ''}<div class="tx"><b></b><div class="pv"></div></div><time></time>`;
    const pv = toPlain(x.body).replace(/\n+/g, ' · ');
    el.querySelector('b').textContent = x.title || firstLine(x.body) || 'Ohne Titel';
    el.querySelector('.pv').textContent = x.title ? pv : pv.slice(firstLine(x.body).length).replace(/^[\s·•\[\]x]+/, '');
    el.querySelector('time').textContent = ago(x.updated);
    press(el, {tap: () => this._open(x)});
    return el;
  }

  /* ----- Detail ----- */
  _open(note) {
    if (!this._data) return;
    this._flush();
    this._cur = note ? {...note} : {id: null, title: '', body: '', pinned: false, updated: 0};
    this._fill();
    this._e.g.classList.add('detail');
    this._del.reset();
    this._paintBar();
    // Neue Notiz: gleich losschreiben (nach dem Hineingleiten, sonst springt Safari)
    if (!note) setTimeout(() => this._e.ti.focus({preventScroll: true}), 320);
  }
  _fill() {
    const e = this._e, x = this._cur;
    if (e.ti.value !== x.title) e.ti.value = x.title || '';
    this._rt.set(x.body || '');
  }
  _close() {
    this._flush();
    this._e.g.classList.remove('detail');
    this._cur = null;
    this._render();
  }
  _dirty() {
    this._pending = true;
    clearTimeout(this._st);
    this._st = setTimeout(() => this._flush(), SAVE_MS);
    this._paintBar();
  }
  // Ausstehende Änderung jetzt speichern. Leere neue Notizen werden gar nicht erst angelegt.
  _flush(extra) {
    clearTimeout(this._st);
    const x = this._cur, h = this._h;
    if (!x || !h || (!this._pending && !extra)) return;
    this._pending = false;
    const title = this._e.ti.value.trim(), body = this._rt.get();
    if (!x.id && !title && isEmpty(body)) { this._paintBar(); return; }
    Object.assign(x, {title, body}, extra);
    const send = {...(x.id ? {id: x.id} : {}), title, body, pinned: !!x.pinned};
    this._saving = (this._saving || 0) + 1;
    // Neue Notiz: weitere Änderungen warten, bis die Kennung da ist (sonst entstehen zwei Notizen)
    const run = this._chain = (this._chain || Promise.resolve()).then(() => api.save(h, {...send, ...(x.id ? {id: x.id} : {})})).then(n => {
      x.id = n.id; x.updated = n.updated;
      this._saved = 'ok';
      clearTimeout(this._okT); this._okT = setTimeout(() => { this._saved = null; this._paintBar(); }, 2500);
    }).catch(err => {
      console.warn('[nova-cards] Notiz: Speichern fehlgeschlagen', err);
      this._saved = 'err';
    }).finally(() => { this._saving--; if (this._chain === run) this._chain = null; this._paintBar(); });
    this._paintBar();
  }
  _paintBar() {
    const e = this._e, x = this._cur, c = this._c, h = this._h;
    if (!e || !x) return;
    const st = this._pending || this._saving ? ['mdi:cloud-sync-outline', 'Speichert …', '']
      : this._saved === 'err' ? ['mdi:alert-circle-outline', 'Nicht gespeichert', 'err']
        : this._saved === 'ok' ? ['mdi:check-circle-outline', 'Gespeichert', 'ok']
          : x.updated ? ['mdi:clock-outline', `Geändert ${ago(x.updated)}`, ''] : ['mdi:pencil-outline', 'Neue Notiz', ''];
    const k = st.join('|');
    if (e.state._k !== k) {
      e.state._k = k;
      e.state.className = `state sp ${st[2]}`;
      e.state.innerHTML = `<ha-icon icon="${st[0]}"></ha-icon><span></span>`;
      e.state.lastChild.textContent = st[1];
    }
    e.pin.classList.toggle('on', !!x.pinned);
    setBtnIcon(e.pin, x.pinned ? 'mdi:pin' : 'mdi:pin-outline');
    e.pin.title = x.pinned ? 'Nicht mehr anpinnen' : 'Anpinnen';
    const has = !!this._e.ti.value.trim() || !isEmpty(this._rt.get());
    this._pb.hidden = !c.print_script;
    paintBtn(this._pb, {icon: c.print_icon || PRINT_DEF.print_icon, label: c.print_label || PRINT_DEF.print_label, pill: false, busy: 'Druckt …', ok: 'Gedruckt', err: 'Fehler'},
      this._pstate, has && !!h.states[c.print_script]);
    this._del.hidden = !x.id;
  }
  _togglePin() {
    const x = this._cur;
    if (!x) return;
    this._flush({pinned: !x.pinned});
  }
  _remove() {
    const x = this._cur, h = this._h;
    if (!x?.id) return;
    clearTimeout(this._st); this._pending = false;
    this._cur = null;
    this._e.g.classList.remove('detail');
    api.remove(h, x.id).catch(err => console.warn('[nova-cards] Notiz: Löschen fehlgeschlagen', err));
    this._render();
  }
  // Titel + Text als Klartext ans Druck-Skript
  _print() {
    const c = this._c;
    if (this._pstate === 'busy') return;
    const title = this._e.ti.value.trim(), body = toPlain(this._rt.get()), txt = [title, body].filter(Boolean).join('\n\n');
    if (!txt) return;
    runPrint(this, this._h, c.print_script, {[c.print_field || 'text']: txt}, st => { this._pstate = st; this._paintBar(); });
  }
}
define('note-card', NovaNoteCard, {name: 'Nova Notiz Card', description: 'Notizen mit Titel und formatiertem Text (Fett, Listen, Checklisten): Liste und Detailansicht, anpinnen, auf allen Geräten gleich (Nova-Integration), mit Druck-Knopf z. B. für einen Bondrucker.', documentationURL: docUrl('nova-notiz-card')});

/* ---------- Editor Notiz Card ---------- */
const GEN = [
  g2({name: 'name', selector: T}, {name: 'icon', selector: I}),
  {name: 'show_header', selector: {boolean: {}}},
];
const VIEW = [
  sel('view', [['full', 'Voll (Titel, Vorschau, Datum)'], ['compact', 'Kompakt (nur Titel und Datum)']]),
  g2({name: 'max_notes', selector: {number: {min: 0, max: 50, step: 1, mode: 'box'}}},
    {name: 'height', selector: {number: {min: 160, max: 1000, step: 10, mode: 'box', unit_of_measurement: 'px'}}}),
];
const PRINT = printSchema([{name: 'print_field', selector: T}]).filter(f => f.name !== 'print_style');
const LABELS = {...BASE_LABELS, ...PRINT_LABELS, name: 'Titel der Karte', show_header: 'Kopfzeile anzeigen', view: 'Ansicht der Liste',
  max_notes: 'Max. sichtbare Notizen', height: 'Mindesthöhe', print_field: 'Feldname im Skript'};
const HELPERS = {...PRINT_HELPERS, max_notes: '0 = alle. Weitere Notizen lassen sich in der Karte aufklappen.',
  height: 'Im Raster füllt die Karte den Platz aus.', print_field: 'Unter diesem Namen bekommt das Skript Titel und Text als Klartext (Standard: text).',
  print_script: 'Leer = kein Druck-Knopf. Der Knopf sitzt in der geöffneten Notiz.'};

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
      this._section('view', 'mdi:view-list-outline', 'Ansicht', b => b.append(form(VIEW))),
      this._section('print', 'mdi:printer-pos', 'Drucken', b => b.append(form(PRINT))));
  }
}
define('note-card-editor', NovaNoteCardEditor);
