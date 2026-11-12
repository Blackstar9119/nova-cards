import {define, docUrl, tag} from './shared/define.js';
import {setIcon} from './shared/utils.js';
import {moreInfo} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, FIELD_CSS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {hassChanged} from './shared/lifecycle.js';
import {TodoFeed} from './shared/todo.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, BASE_LABELS} from './shared/editor-schema.js';
import {PRINT_CSS, PRINT_DEF, printButton, printPaint, runPrint, stopFeedback, printSchema, PRINT_LABELS, PRINT_HELPERS} from './shared/print-button.js';

/* ---------- Nova Einkauf Card ---------- */
// Einkaufsliste aus einer todo-Entität: neue Einträge direkt in der Karte, offene Punkte abhaken, Liste per Skript drucken.
const SCSS = `
.g.sh{gap:var(--nv-s5)}
.add{display:flex;gap:var(--nv-s4);align-items:center;flex:none}
.add .fld{height:44px;border-radius:var(--nv-r-pill);padding:0 var(--nv-s8)}
.ab{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;
border:1px solid var(--nv-box-border);background:var(--nv-chip);color:inherit;outline:none;-webkit-tap-highlight-color:transparent;
transition:background-color var(--nv-d2),color var(--nv-d2),border-color var(--nv-d2),transform var(--nv-d2),opacity var(--nv-d2)}
.ab ha-icon{--mdc-icon-size:22px}
.ab:not([disabled]){color:var(--nv-active);border-color:color-mix(in srgb,var(--nv-active) 45%,transparent)}
.ab[disabled]{opacity:.4;cursor:default}
.ab:active:not([disabled]){transform:scale(var(--nv-press))}
.ab:focus-visible{box-shadow:var(--nv-focus)}
.items{flex:1 1 0;min-height:var(--lh,200px);overflow-y:auto;overscroll-behavior:auto contain;display:flex;flex-direction:column;gap:var(--nv-s3);
scrollbar-width:thin;margin:0 -4px;padding:0 var(--nv-s2);-webkit-mask-image:linear-gradient(#000 calc(100% - 14px),transparent);mask-image:linear-gradient(#000 calc(100% - 14px),transparent);padding-bottom:var(--nv-s5)}
.it{display:flex;align-items:center;gap:var(--nv-s6);padding:var(--nv-s5) var(--nv-s6);border-radius:var(--nv-r-md);min-width:0;flex:none;
background:rgba(var(--nv-tint),.05);border:1px solid rgba(var(--nv-tint),.07);transition:background-color var(--nv-d3),border-color var(--nv-d3),opacity var(--nv-d5)}
.it:active{transform:scale(.985)}
.ck{width:22px;height:22px;border-radius:50%;flex:none;box-sizing:border-box;border:2px solid rgba(var(--nv-tint),.45);display:flex;align-items:center;justify-content:center;
transition:background-color var(--nv-d3),border-color var(--nv-d3),box-shadow var(--nv-d3)}
.ck ha-icon{--mdc-icon-size:15px;opacity:0;transform:scale(.4);transition:opacity var(--nv-d2),transform var(--nv-d3)}
.it .tx{flex:1;min-width:0;font-size:var(--nv-fs-8);overflow-wrap:anywhere;transition:opacity var(--nv-d3)}
.it .tx small{display:block;font-size:var(--nv-fs-3);opacity:.6;margin-top:var(--nv-s1)}
.it.done .ck{background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));border-color:var(--nv-active);color:color-mix(in srgb,var(--nv-active-fg) var(--nv-fill-ink),var(--nv-fg));box-shadow:0 0 12px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
.it.done .ck ha-icon{opacity:1;transform:scale(1)}
.it.done .tx{text-decoration:line-through;opacity:.5}
.it.leave{opacity:.35}
.msg{display:flex;align-items:center;gap:var(--nv-s4);font-size:var(--nv-fs-6);opacity:.6;padding:var(--nv-s5) var(--nv-s2)}
.msg ha-icon{--mdc-icon-size:var(--nv-icon-md)}
.ft{display:flex;justify-content:flex-end;gap:var(--nv-s4);flex:none}
.ft[hidden]{display:none}
@media (prefers-reduced-motion:reduce){.it,.ck,.ck ha-icon,.it .tx{transition:none}}`;

const SDEF = {icon: 'mdi:cart-outline', placeholder: 'Neuer Eintrag …', show_header: true, show_completed: false, height: 200, ...PRINT_DEF};
const LEAVE = 900;

// Einträge kommen über TodoFeed (shared/todo.js, live per Abo)
class NovaShoppingCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('shopping-card-editor')); }
  static getStubConfig(h) {
    const ids = Object.keys(h.states);
    const todo = ids.find(id => /^todo\..*einkauf/.test(id)) || ids.find(id => id === 'todo.shopping_list') || ids.find(id => id.startsWith('todo.'));
    const script = ids.find(id => /^script\..*einkauf.*druck/.test(id));
    return {...(todo ? {entity: todo} : {}), ...(script ? {print_script: script} : {})};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._c = {...SDEF, ...c};
    (this._feed ||= new TodoFeed(this, () => this._render())).setEntity(this._c.entity);
    this._ids = [this._c.entity, this._c.print_script].filter(Boolean);
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
  getCardSize() { return 5; }
  getGridOptions() { return {columns: 6, rows: 'auto', min_columns: 3}; }
  connectedCallback() { if (this._h && this._c) this._feed.update(this._h); }
  disconnectedCallback() { this._feed?.stop(); stopFeedback(this); this._leaving?.forEach(x => clearTimeout(x.t)); this._leaving = new Map(); }

  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${FIELD_CSS}${PRINT_CSS}${SCSS}</style><div class="g sh">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<form class="add"><input class="fld" type="text" enterkeyhint="done" autocomplete="off"><button class="ab" type="submit" title="Hinzufügen" aria-label="Hinzufügen"><ha-icon icon="mdi:plus"></ha-icon></button></form>
<div class="items"></div><div class="ft"></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), hd: q('.hd'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), form: q('form'), inp: q('input'), ab: q('.ab'), items: q('.items'), ft: q('.ft')};
    this._leaving = new Map();
    this._pstate = 'idle';
    const e = this._e;
    e.form.addEventListener('submit', ev => { ev.preventDefault(); this._add(); });
    e.inp.addEventListener('input', () => { e.ab.disabled = !e.inp.value.trim(); });
    // Tippen in der Karte soll keine Tastenkürzel von HA auslösen (z. B. „e“ für Suche)
    e.inp.addEventListener('keydown', ev => ev.stopPropagation());
    press(e.ic, {tap: () => this._c.entity && moreInfo(this, this._c.entity)});
    this._pb = printButton(() => this._print());
    e.ft.append(this._pb);
    this._apply();
  }
  _apply() {
    const c = this._c, e = this._e;
    e.hd.hidden = c.show_header === false;
    e.inp.placeholder = c.placeholder || '';
    e.ab.disabled = !e.inp.value.trim();
    e.g.style.setProperty('--lh', `${Math.max(60, +c.height || SDEF.height)}px`);
    this._render();
  }

  _open() { return (this._feed.items || []).filter(i => i.status === 'needs_action'); }
  _render() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !c || !e) return;
    const s = c.entity && h.states[c.entity];
    setIcon(e.ic, c.icon);
    e.name.textContent = c.name || s?.attributes.friendly_name || 'Einkaufsliste';
    const open = this._open(), n = open.filter(i => !this._leaving.has(i.uid)).length;
    e.sub.textContent = !s ? '' : this._feed.items ? (n ? `${n} offen` : 'Alles erledigt') : 'Wird geladen …';
    e.inp.disabled = !s;

    let msg = null;
    if (!c.entity) msg = ['mdi:format-list-checks', 'Keine Liste gewählt – im Editor eine todo-Entität auswählen.'];
    else if (!s) msg = ['mdi:alert-circle-outline', `Liste nicht gefunden: ${c.entity}`];
    else if (this._feed.err && !this._feed.items) msg = ['mdi:alert-circle-outline', this._feed.err];
    else if (!this._feed.items) msg = ['mdi:timer-sand', 'Wird geladen …'];

    // Gerade abgehakte Einträge bleiben kurz durchgestrichen stehen
    const rows = [...open.map(i => ({...i, done: this._leaving.has(i.uid)}))];
    this._leaving.forEach((x, uid) => { if (!rows.some(r => r.uid === uid)) rows.push({...x.item, done: true, leave: true}); });
    if (c.show_completed) rows.push(...(this._feed.items || []).filter(i => i.status === 'completed' && !this._leaving.has(i.uid)).map(i => ({...i, done: true})));
    if (!msg && !rows.length) msg = ['mdi:cart-check', 'Nichts auf der Liste'];

    const key = JSON.stringify([msg, rows.map(r => [r.uid, r.summary, r.description, r.done, r.leave])]);
    if (key !== this._key) {
      this._key = key;
      if (msg) {
        const m = document.createElement('div');
        m.className = 'msg';
        m.innerHTML = `<ha-icon></ha-icon><span></span>`;
        m.firstChild.setAttribute('icon', msg[0]);
        m.lastChild.textContent = msg[1];
        e.items.replaceChildren(m);
      } else e.items.replaceChildren(...rows.map(r => this._row(r)));
    }
    e.ft.hidden = !c.print_script;
    printPaint(this._pb, c, this._pstate, !!s && n > 0 && !!h.states[c.print_script]);
  }
  _row(it) {
    const el = document.createElement('div');
    el.className = `it${it.done ? ' done' : ''}${it.leave ? ' leave' : ''}`;
    el.innerHTML = '<span class="ck"><ha-icon icon="mdi:check-bold"></ha-icon></span><span class="tx"></span>';
    const tx = el.lastChild;
    tx.textContent = it.summary;
    if (it.description) { const sm = document.createElement('small'); sm.textContent = it.description; tx.append(sm); }
    el.setAttribute('aria-checked', it.done ? 'true' : 'false');
    press(el, {tap: () => this._toggle(it, el)});
    el.setAttribute('role', 'checkbox');
    return el;
  }
  _toggle(it, el) {
    const h = this._h, id = this._c.entity;
    if (!h || !id || it.leave) return;
    if (it.status === 'needs_action' && !this._leaving.has(it.uid)) {
      el.classList.add('done');
      const t = setTimeout(() => { this._leaving.delete(it.uid); this._render(); }, LEAVE);
      this._leaving.set(it.uid, {item: it, t});
      h.callService('todo', 'update_item', {item: it.uid, status: 'completed'}, {entity_id: id}).catch(err => {
        console.warn('[nova-cards] Einkauf: Abhaken fehlgeschlagen', err);
        clearTimeout(t); this._leaving.delete(it.uid); this._render();
      });
      this._render();
    } else if (it.status === 'completed') {
      h.callService('todo', 'update_item', {item: it.uid, status: 'needs_action'}, {entity_id: id});
    }
  }
  _add() {
    const h = this._h, id = this._c.entity, e = this._e, v = e.inp.value.trim();
    if (!h || !id || !v) return;
    e.inp.value = ''; e.ab.disabled = true;
    h.callService('todo', 'add_item', {item: v}, {entity_id: id}).catch(err => {
      console.warn('[nova-cards] Einkauf: Hinzufügen fehlgeschlagen', err);
      if (!e.inp.value) { e.inp.value = v; e.ab.disabled = false; }
    });
    e.inp.focus();
  }
  _print() {
    runPrint(this, this._h, this._c.print_script, {}, st => { this._pstate = st; this._render(); });
  }
}
define('shopping-card', NovaShoppingCard, {name: 'Nova Einkauf Card', description: 'Einkaufsliste aus einer todo-Liste: Einträge direkt in der Karte hinzufügen, offene Punkte abhaken und die Liste per Skript drucken (z. B. auf einem Bondrucker).', documentationURL: docUrl('nova-einkauf-card')});

/* ---------- Editor Einkauf Card ---------- */
const GEN = [
  {name: 'entity', required: true, selector: {entity: {domain: 'todo'}}},
  g2({name: 'name', selector: T}, {name: 'icon', selector: I}),
  {name: 'show_header', selector: {boolean: {}}},
];
const LIST = [
  {name: 'placeholder', selector: T},
  {name: 'show_completed', selector: {boolean: {}}},
  {name: 'height', selector: {number: {min: 60, max: 1000, step: 10, mode: 'box', unit_of_measurement: 'px'}}},
];
const PRINT = printSchema();
const LABELS = {...BASE_LABELS, ...PRINT_LABELS, entity: 'Einkaufsliste (todo)', name: 'Name', show_header: 'Kopfzeile anzeigen',
  placeholder: 'Platzhalter im Eingabefeld', show_completed: 'Erledigte Einträge anzeigen', height: 'Mindesthöhe der Liste'};
const HELPERS = {...PRINT_HELPERS, name: 'Leer = Name der Liste',
  show_completed: 'Erledigte stehen durchgestrichen unten, Antippen holt sie zurück.',
  height: 'So hoch ist die Liste mindestens; mehr Einträge lassen sich scrollen. Im Raster füllt die Liste den Platz aus.'};

class NovaShoppingCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static helpers = HELPERS;
  static openSections = ['general'];
  _build() {
    const r = this.shadowRoot, c0 = this._config;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), data = {...SDEF, ...c0};
    const strip = c => { Object.entries(SDEF).forEach(([k, x]) => c[k] === x && delete c[k]); return c; };
    const form = schema => this._form(schema, data, v => this._emit(strip(merge(this._config, names(schema), v))));
    w.append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => b.append(form(GEN))),
      this._section('list', 'mdi:format-list-checks', 'Liste', b => b.append(form(LIST))),
      this._section('print', 'mdi:printer-pos', 'Drucken', b => b.append(form(PRINT))));
  }
}
define('shopping-card-editor', NovaShoppingCardEditor);
