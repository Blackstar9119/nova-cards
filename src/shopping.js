import {define, docUrl, tag} from './shared/define.js';
import {setIcon} from './shared/utils.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, FIELD_CSS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {hassChanged} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, sel, BASE_LABELS} from './shared/editor-schema.js';
import {PRINT_CSS, PRINT_DEF, printButton, printPaint, runPrint, stopFeedback, printSchema, PRINT_LABELS, PRINT_HELPERS} from './shared/print-button.js';
import {watch, shop as api, storeHint, imageUrl} from './shared/nova-store.js';
import {RICH_CSS, richEditor, toPlain, firstLine} from './shared/rich-text.js';
import {VIEW_CSS, roundBtn, armButton} from './shared/stack-view.js';
import {PICK_MEDIA_CSS, mediaPicker, STORE_ICONS} from './shared/media-picker.js';

/* ---------- Nova Einkauf Card ---------- */
// Einkaufsliste aus der Nova-Integration (auf allen Geräten gleich): Artikel mit Menge, Einheit, Geschäft, Icon oder Bild
// und Notiz. Liste (nach Geschäft gruppiert, Erledigtes unten) ↔ Detail zum Bearbeiten. Zuletzt Gekauftes als Schnellauswahl.
// Optional gleicht die Integration die Liste mit einer todo-Entität ab (Option entity) – für Assist.
// Der Druck-Knopf ruft ein Skript auf und gibt die offene Liste als Klartext mit (Feld text) – z. B. für einen Bondrucker.
const SCSS = `
.g.sh{gap:var(--nv-s5)}
.add{display:flex;gap:var(--nv-s4);align-items:center;flex:none}
.add .fld{height:44px;border-radius:var(--nv-r-pill);padding:0 var(--nv-s8)}
.sug{display:flex;gap:var(--nv-s3);overflow-x:auto;flex:none;scrollbar-width:none;margin:0 calc(var(--nv-s2) * -1);padding:var(--nv-s1) var(--nv-s2);
-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 24px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 24px),transparent)}
.sug::-webkit-scrollbar{display:none}
.sug:empty{display:none}
.chip{display:inline-flex;align-items:center;gap:var(--nv-s3);height:38px;padding:0 var(--nv-s6) 0 var(--nv-s2);border-radius:var(--nv-r-pill);flex:none;cursor:pointer;
border:1px solid rgba(var(--nv-tint),.1);background:var(--nv-chip);color:inherit;font:inherit;font-size:var(--nv-fs-6);white-space:nowrap;-webkit-tap-highlight-color:transparent;
transition:transform var(--nv-d2) var(--nv-ease),background-color var(--nv-d2),border-color var(--nv-d2),opacity var(--nv-d3);animation:rb-in var(--nv-d4) var(--nv-ease) both;animation-delay:calc(var(--i,0) * 30ms)}
.chip:active{transform:scale(var(--nv-press))}
.chip.go{transform:translateY(14px) scale(.8);opacity:0}
.chip .th{width:30px;height:30px}
.chip.plain{padding:0 var(--nv-s6)}
.chip.on{background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));border-color:transparent;color:color-mix(in srgb,var(--nv-active-fg) var(--nv-fill-ink),var(--nv-fg));
box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
.chip ha-icon{--mdc-icon-size:18px}
.th{width:40px;height:40px;border-radius:var(--nv-r-sm);flex:none;display:flex;align-items:center;justify-content:center;background:rgba(var(--nv-tint),.08);overflow:hidden}
.th img{width:100%;height:100%;object-fit:cover}
.th ha-icon{--mdc-icon-size:22px}
.th.none ha-icon{opacity:.4}
.items{display:flex;flex-direction:column;gap:var(--nv-s3)}
.gh{display:flex;align-items:center;gap:var(--nv-s3);font-size:var(--nv-fs-3);font-weight:var(--nv-fw-bold);text-transform:uppercase;letter-spacing:var(--nv-caps);opacity:.7;
padding:var(--nv-s4) var(--nv-s2) 0;flex:none;min-height:24px}
.gh:first-child{padding-top:0}
.gh ha-icon{--mdc-icon-size:16px}
.gh .n{opacity:.7;font-weight:var(--nv-fw-medium)}
.gh.tap{cursor:pointer;-webkit-tap-highlight-color:transparent}
.gh .sp{flex:1}
.gh .chev{transition:transform var(--nv-d3) var(--nv-ease)}
.gh.open .chev{transform:rotate(180deg)}
.gh .rb{text-transform:none}
.it{display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s3) var(--nv-s3) var(--nv-s3) var(--nv-s5);border-radius:var(--nv-r-md);min-width:0;flex:none;min-height:52px;box-sizing:border-box;
background:rgba(var(--nv-tint),.05);border:1px solid rgba(var(--nv-tint),.07);transition:background-color var(--nv-d3),border-color var(--nv-d3),opacity var(--nv-d5),transform var(--nv-d5) var(--nv-ease)}
.it.new{animation:rb-in var(--nv-d5) var(--nv-ease) both}
.ckb{width:44px;height:44px;margin:-4px -8px -4px -10px;flex:none;display:flex;align-items:center;justify-content:center;border:0;background:transparent;color:inherit;padding:0;cursor:pointer;
border-radius:50%;-webkit-tap-highlight-color:transparent;outline:none}
.ckb:focus-visible .ck{box-shadow:var(--nv-focus)}
.ck{width:24px;height:24px;border-radius:50%;box-sizing:border-box;border:2px solid rgba(var(--nv-tint),.45);display:flex;align-items:center;justify-content:center;position:relative;
transition:background-color var(--nv-d3),border-color var(--nv-d3),box-shadow var(--nv-d3),transform var(--nv-d2) var(--nv-ease)}
.ckb:active .ck{transform:scale(.85)}
.ck ha-icon{--mdc-icon-size:16px;opacity:0;transform:scale(.3) rotate(-30deg);transition:opacity var(--nv-d2),transform var(--nv-d4) var(--nv-ease)}
.ck::after{content:'';position:absolute;inset:-2px;border-radius:50%;border:2px solid var(--nv-active);opacity:0;pointer-events:none}
.it.done .ck{background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));border-color:var(--nv-active);color:color-mix(in srgb,var(--nv-active-fg) var(--nv-fill-ink),var(--nv-fg));
box-shadow:0 0 12px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
.it.done .ck ha-icon{opacity:1;transform:none}
.it.tick .ck::after{animation:sh-ring var(--nv-d6) var(--nv-ease)}
.it.tick .ck{animation:rb-pop var(--nv-d5) var(--nv-ease)}
.it .tx{flex:1;min-width:0;cursor:pointer;align-self:stretch;display:flex;flex-direction:column;justify-content:center;-webkit-tap-highlight-color:transparent;outline:none;border-radius:var(--nv-r-xs)}
.it .tx:focus-visible{box-shadow:var(--nv-focus)}
.it .tx b{font-weight:var(--nv-fw-medium);font-size:var(--nv-fs-8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;position:relative;align-self:flex-start;max-width:100%}
.it .tx b::after{content:'';position:absolute;left:0;top:52%;height:1.5px;width:100%;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform var(--nv-d5) var(--nv-ease)}
.it.done .tx b::after{transform:scaleX(1)}
.it .tx small{font-size:var(--nv-fs-3);opacity:.6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.it.done .tx,.it.done .th{opacity:.5;transition:opacity var(--nv-d5)}
.it.leave{opacity:0;transform:translateY(8px) scale(.97)}
.qt{display:flex;align-items:center;flex:none;border-radius:var(--nv-r-pill);background:var(--nv-chip);border:1px solid rgba(var(--nv-tint),.08)}
.qt button{width:36px;height:40px;border:0;background:transparent;color:inherit;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;border-radius:var(--nv-r-pill);
-webkit-tap-highlight-color:transparent;outline:none;transition:transform var(--nv-d2) var(--nv-ease),background-color var(--nv-d2)}
.qt button:active{transform:scale(.8);background:rgba(var(--nv-tint),.12)}
.qt button:focus-visible{box-shadow:var(--nv-focus)}
.qt button ha-icon{--mdc-icon-size:18px}
.qt span{min-width:34px;text-align:center;font-size:var(--nv-fs-6);font-weight:var(--nv-fw-bold);white-space:nowrap;font-variant-numeric:tabular-nums}
.qt span.bump{animation:sh-bump var(--nv-d4) var(--nv-ease)}
.qt.lg button{width:48px;height:48px}.qt.lg span{min-width:64px;font-size:var(--nv-fs-10)}
.qv{flex:none;font-size:var(--nv-fs-5);opacity:.6;white-space:nowrap;padding-right:var(--nv-s4)}
.ft{display:flex;justify-content:flex-end;gap:var(--nv-s4);flex:none}
.form{display:flex;flex-direction:column;gap:var(--nv-s6);padding-bottom:var(--nv-s6)}
.form .ti{height:44px;border-radius:var(--nv-r-md);padding:0 var(--nv-s7);font-weight:var(--nv-fw-bold)}
.form .lb{font-size:var(--nv-fs-3);font-weight:var(--nv-fw-bold);opacity:.6;text-transform:uppercase;letter-spacing:var(--nv-caps);margin-bottom:calc(var(--nv-s3) * -1)}
.form .rowq{display:flex;align-items:center;gap:var(--nv-s4);flex-wrap:wrap}
.chips{display:flex;gap:var(--nv-s3);flex-wrap:wrap}
.chips .chip{animation:none;height:44px}
.sf{display:flex;flex-direction:column;gap:var(--nv-s4);padding:var(--nv-s5);border-radius:var(--nv-r-md);background:rgba(var(--nv-tint),.05);border:1px solid rgba(var(--nv-tint),.08);animation:rb-in var(--nv-d4) var(--nv-ease)}
.sf .fld{height:44px;border-radius:var(--nv-r-pill);padding:0 var(--nv-s8)}
.sf .bar{justify-content:flex-end}
.form .rte{min-height:72px;border-radius:var(--nv-r-md);padding:var(--nv-s5) var(--nv-s7);border:1px solid var(--nv-box-border);background:var(--nv-box);margin-top:var(--nv-s3);
transition:border-color var(--nv-d2),box-shadow var(--nv-d2)}
.form .rte:focus{border-color:color-mix(in srgb,var(--nv-active) 75%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 22%,transparent) var(--nv-glow),transparent)}
@keyframes sh-ring{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(2.1)}}
@keyframes sh-bump{0%{transform:scale(1)}40%{transform:scale(1.3)}100%{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.chip,.it.new,.sf,.it.tick .ck,.it.tick .ck::after,.qt span.bump{animation:none}.it,.ck,.ck ha-icon,.it .tx b::after{transition:none}}`;

const SDEF = {name: 'Einkaufsliste', icon: 'mdi:cart-outline', placeholder: 'Artikel hinzufügen …', show_header: true, group: true, show_images: true, show_completed: false,
  show_suggestions: true, height: 420, print_field: 'text', ...PRINT_DEF};
const HOLD = 750, SAVE_MS = 700, QTY_MS = 350;
const STEP = {g: 50, ml: 50, kg: 0.5, l: 0.5};
const hkey = s => String(s || '').toLowerCase().split(/\s+/).filter(Boolean).join(' ');
const num = q => String(Math.round((+q || 0) * 1000) / 1000).replace('.', ',');
export const qtyText = it => `${num(it.qty ?? 1)}${it.unit && it.unit !== 'Stk' ? ` ${it.unit}` : ''}`;

class NovaShoppingCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('shopping-card-editor')); }
  static getStubConfig(h) {
    const script = Object.keys(h.states).find(id => /^script\..*einkauf.*druck/.test(id));
    return script ? {print_script: script} : {};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._c = {...SDEF, ...c};
    this._ids = [this._c.print_script].filter(Boolean);
    this._doneOpen = !!this._c.show_completed;
    if (this._e) this._apply();
  }
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    if (!this._e) this._build();
    this._watch();
    this._picker?.setHass(h); this._spicker?.setHass(h);
    if (hassChanged(old, h, this._ids)) this._render();
  }
  getCardSize() { return 7; }
  getGridOptions() { return {columns: 6, rows: 'auto', min_columns: 3}; }
  connectedCallback() { this._watch(); }
  disconnectedCallback() {
    this._flush(); this._flushQty();
    this._off?.(); this._off = null;
    stopFeedback(this);
    clearTimeout(this._st); clearTimeout(this._okT);
    this._hold?.forEach(t => clearTimeout(t)); this._hold = new Map();
    this._del?.reset();
  }
  _watch() {
    if (this._off || !this._h || !this.isConnected) return;
    this._off = watch(this._h, 'shopping', this, (d, err) => { this._data = d; this._err = err; this._onData(); });
  }

  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${FIELD_CSS}${PRINT_CSS}${VIEW_CSS}${RICH_CSS}${PICK_MEDIA_CSS}${SCSS}</style><div class="g sh">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<div class="stage"><div class="view main">
<form class="add"><input class="fld" type="text" enterkeyhint="done" autocomplete="off" maxlength="120"></form>
<div class="sug"></div><div class="scroll"><div class="items"></div></div><div class="ft"></div></div>
<div class="view side"><div class="bar"></div><div class="scroll"><div class="form"></div></div></div></div></div>`;
    const q = s => r.querySelector(s);
    const e = this._e = {g: q('.g'), hd: q('.hd'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), form: q('form.add'), inp: q('.add input'), sug: q('.sug'),
      items: q('.items'), ft: q('.ft'), bar: q('.bar'), dform: q('.form')};
    this._hold = new Map(); this._seen = new Set(); this._qty = new Map(); this._pstate = 'idle';
    e.ab = roundBtn('mdi:plus', 'Hinzufügen', () => this._add(), 'plus');
    e.form.append(e.ab);
    e.form.addEventListener('submit', ev => { ev.preventDefault(); this._add(); });
    e.inp.addEventListener('input', () => { e.ab.disabled = !e.inp.value.trim(); this._renderSug(); });
    // Tippen in der Karte soll keine Tastenkürzel von HA auslösen (z. B. „e“ für Suche)
    e.inp.addEventListener('keydown', ev => ev.stopPropagation());
    this._pb = printButton(() => this._print());
    e.ft.append(this._pb);
    // Detail: Zurück · Stand · Löschen
    e.back = roundBtn('mdi:arrow-left', 'Zurück zur Liste', () => this._close());
    e.state = document.createElement('div'); e.state.className = 'state sp';
    this._del = armButton('mdi:delete-outline', 'Artikel löschen', () => this._remove());
    e.bar.append(e.back, e.state, this._del);
    this._apply();
  }
  _apply() {
    const c = this._c, e = this._e;
    e.hd.hidden = c.show_header === false;
    e.inp.placeholder = c.placeholder || '';
    e.ab.disabled = !e.inp.value.trim();
    e.g.style.setProperty('--vh', `${Math.max(200, +c.height || SDEF.height)}px`);
    this._key = this._skey = null;
    this._render();
  }

  /* ----- Daten ----- */
  _items() {
    // Menge, die gerade per +/– geändert wird, gilt sofort (gesendet wird gesammelt)
    return (this._data?.items || []).map(i => this._qty.has(i.id) ? {...i, qty: this._qty.get(i.id).qty} : i);
  }
  _store(id) { return this._data?.stores.find(s => s.id === id); }
  _onData() {
    const d = this._data;
    // Abgleich mit der todo-Liste aus der Kartenkonfig übernehmen, solange in der Integration noch keine eingestellt ist
    if (d && this._c.entity && !d.sync_entity && !this._syncSet && this._h.states[this._c.entity]) {
      this._syncSet = true;
      api.setSync(this._h, this._c.entity).catch(err => console.warn('[nova-cards] Einkauf: todo-Abgleich nicht eingestellt', err));
    }
    if (this._cur?.id && d && !d.items.some(i => i.id === this._cur.id)) { this._cur = null; this._e?.g.classList.remove('detail'); }
    if (this._cur && this._e) this._paintStores();
    this._render();
  }
  _thumb(x, cls = 'th') {
    const c = this._c, el = document.createElement('span');
    const img = c.show_images !== false && x.image ? imageUrl(this._h, 'shopping', x.image) : '';
    el.className = `${cls}${!img && !x.icon ? ' none' : ''}`;
    if (img) { const i = document.createElement('img'); i.alt = ''; i.loading = 'lazy'; i.src = img; el.append(i); }
    else { const i = document.createElement('ha-icon'); i.setAttribute('icon', x.icon || 'mdi:shopping-outline'); el.append(i); }
    return el;
  }

  /* ----- Liste ----- */
  _render() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !c || !e) return;
    setIcon(e.ic, c.icon);
    e.name.textContent = c.name || SDEF.name;
    const all = this._items(), open = all.filter(i => !i.done || this._hold.has(i.id)), done = all.filter(i => i.done && !this._hold.has(i.id));
    const nOpen = all.filter(i => !i.done).length;
    e.sub.textContent = this._err ? '' : !this._data ? 'Wird geladen …' : nOpen ? `${nOpen} offen${done.length ? ` · ${done.length} erledigt` : ''}` : all.length ? 'Alles erledigt' : 'Liste ist leer';
    e.inp.disabled = !this._data;
    let msg = null;
    if (this._err) msg = storeHint(this._err, 'shopping');
    else if (!this._data) msg = ['mdi:timer-sand', 'Wird geladen …'];
    else if (!all.length) msg = ['mdi:cart-check', 'Nichts auf der Liste'];

    // Gruppen: Geschäfte in ihrer Reihenfolge, „Ohne Geschäft“ zuletzt
    const groups = [];
    if (c.group !== false && this._data?.stores.length) {
      [...this._data.stores, null].forEach(s => {
        const rows = open.filter(i => s ? i.store === s.id : !this._store(i.store));
        if (rows.length) groups.push({store: s, rows});
      });
    } else if (open.length) groups.push({store: undefined, rows: open});
    const key = JSON.stringify([msg, groups.map(g => [g.store?.id, g.store?.name, g.store?.icon, g.rows.map(r => this._rk(r))]), done.map(r => this._rk(r)), this._doneOpen, c.show_images, c.group,
      this._data?.stores.map(s => [s.id, s.name])]);
    if (key !== this._key) {
      this._key = key;
      const out = [];
      if (msg) {
        const m = document.createElement('div');
        m.className = 'msg'; m.innerHTML = '<ha-icon></ha-icon><span></span>';
        m.firstChild.setAttribute('icon', msg[0]); m.lastChild.textContent = msg[1];
        out.push(m);
      }
      groups.forEach(g => {
        if (g.store !== undefined) out.push(this._head(g.store?.icon || 'mdi:help-circle-outline', g.store?.name || 'Ohne Geschäft', g.rows.filter(r => !r.done).length));
        g.rows.forEach(r => out.push(this._row(r, g.store === undefined)));
      });
      if (done.length) {
        const hd = this._head('mdi:check-all', 'Erledigt', done.length);
        hd.classList.add('tap'); hd.classList.toggle('open', this._doneOpen);
        hd.tabIndex = 0; hd.setAttribute('role', 'button'); hd.setAttribute('aria-expanded', this._doneOpen);
        const sp = document.createElement('span'); sp.className = 'sp';
        const chev = document.createElement('ha-icon'); chev.className = 'chev'; chev.setAttribute('icon', 'mdi:chevron-down');
        hd.append(sp);
        if (this._doneOpen) hd.append(armButton('mdi:delete-sweep-outline', 'Erledigte löschen', () => api.clearDone(this._h).catch(err => console.warn('[nova-cards] Einkauf: Erledigte löschen fehlgeschlagen', err)), 'sm'));
        hd.append(chev);
        const tog = () => { this._doneOpen = !this._doneOpen; this._render(); };
        hd.addEventListener('click', tog);
        hd.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); tog(); } });
        out.push(hd);
        if (this._doneOpen) done.forEach(r => out.push(this._row(r, true)));
      }
      e.items.replaceChildren(...out);
      this._bump = null;
    }
    e.ft.hidden = !c.print_script;
    printPaint(this._pb, c, this._pstate, nOpen > 0 && !!h.states[c.print_script]);
    this._renderSug();
    this._paintBar();
  }
  _rk(r) { return [r.id, r.name, r.qty, r.unit, r.store, r.icon, r.image, r.note, r.done, this._hold.has(r.id)]; }
  _head(icon, label, n) {
    const el = document.createElement('div');
    el.className = 'gh';
    el.innerHTML = '<ha-icon></ha-icon><span></span><span class="n"></span>';
    el.firstChild.setAttribute('icon', icon);
    el.children[1].textContent = label; el.children[2].textContent = n;
    return el;
  }
  _row(it, showStore) {
    const el = document.createElement('div'), held = this._hold.has(it.id);
    el.className = `it${it.done ? ' done' : ''}${held ? ' tick' : ''}${this._seen.has(it.id) ? '' : ' new'}`;
    this._seen.add(it.id);
    const ck = document.createElement('button');
    ck.type = 'button'; ck.className = 'ckb'; ck.setAttribute('role', 'checkbox'); ck.setAttribute('aria-checked', !!it.done);
    ck.setAttribute('aria-label', `${it.name} ${it.done ? 'zurück auf die Liste' : 'abhaken'}`);
    ck.innerHTML = '<span class="ck"><ha-icon icon="mdi:check-bold"></ha-icon></span>';
    ck.addEventListener('click', ev => { ev.stopPropagation(); this._toggle(it, el); });
    const tx = document.createElement('div');
    tx.className = 'tx';
    const b = document.createElement('b'); b.textContent = it.name;
    tx.append(b);
    const sub = [showStore && this._store(it.store)?.name, firstLine(it.note)].filter(Boolean).join(' · ');
    if (sub) { const sm = document.createElement('small'); sm.textContent = sub; tx.append(sm); }
    press(tx, {tap: () => this._open(it)});
    tx.setAttribute('aria-label', `${it.name} bearbeiten`);
    el.append(ck, this._thumb(it), tx);
    if (it.done) { const q = document.createElement('span'); q.className = 'qv'; q.textContent = qtyText(it); el.append(q); }
    else el.append(this._stepper(it));
    return el;
  }
  // Menge mit +/–; Schrittweite je Einheit
  _stepper(it, lg) {
    const el = document.createElement('div');
    el.className = `qt${lg ? ' lg' : ''}`;
    el.innerHTML = '<button type="button" aria-label="Weniger"><ha-icon icon="mdi:minus"></ha-icon></button><span></span><button type="button" aria-label="Mehr"><ha-icon icon="mdi:plus"></ha-icon></button>';
    const sp = el.children[1];
    sp.textContent = qtyText(it);
    if (this._bump === it.id) sp.classList.add('bump');
    [-1, 0, 1].forEach((dir, i) => dir && el.children[i].addEventListener('click', ev => { ev.stopPropagation(); this._step(it.id, dir, sp); }));
    return el;
  }
  _step(id, dir, sp) {
    const detail = this._cur?.id === id, cur = detail ? this._cur : this._items().find(i => i.id === id);
    if (!cur) return;
    const st = STEP[cur.unit] || 1, q = Math.max(st, Math.round(((+cur.qty || 0) + dir * st) * 1000) / 1000);
    if (q === cur.qty) return;
    // In der Detailansicht geht die Menge mit dem Rest des Artikels raus
    if (detail) { cur.qty = q; this._dirty(); this._paintQty(); return; }
    clearTimeout(this._qty.get(id)?.t);
    this._qty.set(id, {qty: q, t: setTimeout(() => this._flushQty(id), QTY_MS)});
    this._bump = id; this._key = null;
    sp.textContent = qtyText({...cur, qty: q});
    sp.classList.remove('bump'); void sp.offsetWidth; sp.classList.add('bump');
  }
  _flushQty(id) {
    (id ? [id] : [...(this._qty?.keys() || [])]).forEach(k => {
      const x = this._qty.get(k);
      if (!x) return;
      clearTimeout(x.t);
      api.save(this._h, {id: k, qty: x.qty}).catch(err => console.warn('[nova-cards] Einkauf: Menge nicht gespeichert', err))
        .finally(() => { if (this._qty.get(k) === x) { this._qty.delete(k); this._render(); } });
    });
  }
  // Abhaken: Häkchen springt auf, Name wird durchgestrichen, kurz danach wandert die Zeile zu „Erledigt“
  _toggle(it, el) {
    const h = this._h;
    if (!h || this._hold.has(it.id)) return;
    const done = !it.done;
    if (done) {
      el.classList.add('done', 'tick');
      this._hold.set(it.id, setTimeout(() => {
        el.classList.add('leave');
        setTimeout(() => { this._hold.delete(it.id); this._render(); }, 280);
      }, HOLD));
    }
    api.save(h, {id: it.id, done}).catch(err => {
      console.warn('[nova-cards] Einkauf: Abhaken fehlgeschlagen', err);
      clearTimeout(this._hold.get(it.id)); this._hold.delete(it.id); this._key = null; this._render();
    });
  }

  /* ----- Hinzufügen + Schnellauswahl ----- */
  _add(name) {
    const h = this._h, e = this._e, v = (name ?? e.inp.value).trim();
    if (!h || !v || !this._data) return;
    const typed = name == null;
    if (typed) { e.inp.value = ''; e.ab.disabled = true; }
    // Steht der Artikel schon offen auf der Liste, wird die Menge erhöht statt doppelt eingetragen
    const twin = this._items().find(i => !i.done && hkey(i.name) === hkey(v));
    const known = this._data.history.some(x => x.key === hkey(v));
    const def = this._c.default_store && this._store(this._c.default_store) ? this._c.default_store : null;
    const item = twin ? {id: twin.id, qty: Math.round(((+twin.qty || 0) + (STEP[twin.unit] || 1)) * 1000) / 1000} : {name: v, ...(!known && def ? {store: def} : {})};
    if (twin) this._bump = twin.id;
    api.save(h, item).catch(err => {
      console.warn('[nova-cards] Einkauf: Hinzufügen fehlgeschlagen', err);
      if (typed && !e.inp.value) { e.inp.value = v; e.ab.disabled = false; }
    });
    if (typed) e.inp.focus();
    this._renderSug();
  }
  _renderSug() {
    const c = this._c, e = this._e, d = this._data;
    if (!e) return;
    const q = hkey(e.inp.value), onList = new Set(this._items().filter(i => !i.done).map(i => hkey(i.name)));
    const list = !d || c.show_suggestions === false ? [] : d.history.filter(x => !onList.has(x.key) && (!q || x.key.includes(q)))
      .sort((a, b) => q ? (b.key.startsWith(q) - a.key.startsWith(q)) || (b.count - a.count) : 0).slice(0, 12);
    const key = JSON.stringify([list.map(x => [x.key, x.icon, x.image]), c.show_images]);
    if (key === this._skey) return;
    this._skey = key;
    e.sug.replaceChildren(...list.map((x, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'chip'; b.style.setProperty('--i', i);
      b.title = `${x.name} auf die Liste (lange drücken: aus den Vorschlägen entfernen)`;
      b.append(this._thumb(x), document.createTextNode(x.name));
      press(b, {tap: () => { b.classList.add('go'); if (e.inp.value) { e.inp.value = ''; e.ab.disabled = true; } this._add(x.name); },
        hold: () => { b.classList.add('go'); api.forget(this._h, x.key).catch(() => {}); }});
      return b;
    }));
  }

  /* ----- Detail ----- */
  _open(it) {
    this._flush();
    this._cur = {...it};
    this._buildForm();
    this._e.g.classList.add('detail');
    this._del.reset();
    this._paintBar();
  }
  _close() {
    this._flush(); this._flushQty();
    this._e.g.classList.remove('detail');
    this._cur = null; this._key = null;
    this._render();
  }
  _buildForm() {
    const e = this._e, x = this._cur, f = e.dform;
    const lb = t => { const l = document.createElement('div'); l.className = 'lb'; l.textContent = t; return l; };
    const ti = this._ti = document.createElement('input');
    ti.className = 'fld ti'; ti.type = 'text'; ti.maxLength = 120; ti.placeholder = 'Name'; ti.value = x.name || ''; ti.autocomplete = 'off';
    ti.addEventListener('input', () => this._dirty());
    ti.addEventListener('keydown', ev => { ev.stopPropagation(); if (ev.key === 'Enter') ti.blur(); });
    const rowq = document.createElement('div'); rowq.className = 'rowq';
    this._qbox = document.createElement('div');
    this._units = document.createElement('div'); this._units.className = 'chips';
    rowq.append(this._qbox, this._units);
    this._stores = document.createElement('div'); this._stores.className = 'chips';
    this._sform = document.createElement('div');
    this._picker = mediaPicker({hass: this._h, module: 'shopping', value: {icon: x.icon, image: x.image}, fallback: 'mdi:shopping-outline',
      onChange: v => { x.icon = v.icon; x.image = v.image; this._dirty(); }});
    this._rt = richEditor({placeholder: 'Notiz zum Artikel …', onInput: () => this._dirty()});
    this._rt.set(x.note || '');
    f.replaceChildren(ti, lb('Menge'), rowq, lb('Geschäft'), this._stores, this._sform, lb('Icon oder Bild'), this._picker, lb('Notiz'), this._rt.el);
    this._paintQty(); this._paintStores();
    f.parentElement.scrollTop = 0;
  }
  _paintQty() {
    const x = this._cur;
    if (!x || !this._qbox) return;
    this._qbox.replaceChildren(this._stepper(x, true));
    this._units.replaceChildren(...(this._data?.units || ['Stk']).map(u => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = `chip plain${x.unit === u ? ' on' : ''}`; b.textContent = u;
      b.addEventListener('click', () => {
        if (x.unit === u) return;
        // sinnvolle Startmenge beim Wechsel (1 Stk → 500 g statt 1 g)
        const was = STEP[x.unit] || 1, now = STEP[u] || 1;
        if (x.qty === was || x.qty === 1) x.qty = now === 50 ? 500 : 1;
        x.unit = u; this._dirty(); this._paintQty();
      });
      return b;
    }));
  }
  _paintStores() {
    const x = this._cur;
    if (!x || !this._stores) return;
    const chip = (s, label, icon) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = `chip${icon ? '' : ' plain'}${(s ? x.store === s.id : !this._store(x.store)) && s !== 'new' ? ' on' : ''}`;
      if (icon) { const i = document.createElement('ha-icon'); i.setAttribute('icon', icon); i.style.marginLeft = 'var(--nv-s4)'; b.append(i); }
      b.append(document.createTextNode(label));
      return b;
    };
    const none = chip(null, 'Keins');
    none.addEventListener('click', () => { x.store = null; this._dirty(); this._paintStores(); });
    const add = chip('new', 'Neu', 'mdi:plus');
    add.addEventListener('click', () => this._storeForm(null));
    this._stores.replaceChildren(none, ...(this._data?.stores || []).map(s => {
      const b = chip(s, s.name, s.icon);
      b.title = `${s.name} (lange drücken: bearbeiten)`;
      press(b, {tap: () => { x.store = s.id; this._dirty(); this._paintStores(); }, hold: () => this._storeForm(s)});
      return b;
    }), add);
  }
  // Geschäft anlegen oder bearbeiten (Name + Icon), Löschen in zwei Schritten
  _storeForm(s) {
    const box = document.createElement('div'); box.className = 'sf';
    const inp = document.createElement('input');
    inp.className = 'fld'; inp.type = 'text'; inp.maxLength = 60; inp.placeholder = 'Name des Geschäfts, z. B. Lidl'; inp.value = s?.name || '';
    inp.addEventListener('keydown', ev => { ev.stopPropagation(); if (ev.key === 'Enter') { ev.preventDefault(); save(); } });
    let icon = s?.icon || 'mdi:store-outline';
    this._spicker = mediaPicker({hass: this._h, value: {icon}, icons: STORE_ICONS, upload: false, fallback: 'mdi:store-outline', onChange: v => { icon = v.icon || 'mdi:store-outline'; }});
    const bar = document.createElement('div'); bar.className = 'bar';
    const close = () => { this._sform.replaceChildren(); this._spicker = null; };
    const save = () => {
      const name = inp.value.trim();
      if (!name) { inp.focus(); return; }
      api.saveStore(this._h, {...(s ? {id: s.id} : {}), name, icon}).then(st => {
        if (!s && this._cur) { this._cur.store = st.id; this._dirty(); }
        this._paintStores();
      }).catch(err => console.warn('[nova-cards] Einkauf: Geschäft nicht gespeichert', err));
      close();
    };
    if (s) bar.append(armButton('mdi:delete-outline', 'Geschäft löschen', () => { api.removeStore(this._h, s.id).catch(() => {}); close(); }));
    const sp = document.createElement('span'); sp.className = 'sp';
    bar.append(sp, roundBtn('mdi:close', 'Abbrechen', close), roundBtn('mdi:check', 'Speichern', save, 'on'));
    box.append(inp, this._spicker, bar);
    this._sform.replaceChildren(box);
    inp.focus({preventScroll: true});
    box.scrollIntoView({block: 'nearest', behavior: 'smooth'});
  }
  _dirty() {
    this._pending = true;
    clearTimeout(this._st);
    this._st = setTimeout(() => this._flush(), SAVE_MS);
    this._paintBar();
  }
  _flush() {
    clearTimeout(this._st);
    const x = this._cur, h = this._h;
    if (!x || !h || !this._pending) return;
    this._pending = false;
    const name = this._ti.value.trim() || x.name;
    x.name = name; x.note = this._rt.get();
    clearTimeout(this._qty.get(x.id)?.t); this._qty.delete(x.id);
    this._saving = (this._saving || 0) + 1;
    api.save(h, {id: x.id, name, qty: x.qty, unit: x.unit, store: x.store || null, icon: x.icon || null, image: x.image || null, note: x.note})
      .then(() => { this._saved = 'ok'; clearTimeout(this._okT); this._okT = setTimeout(() => { this._saved = null; this._paintBar(); }, 2500); })
      .catch(err => { console.warn('[nova-cards] Einkauf: Speichern fehlgeschlagen', err); this._saved = 'err'; })
      .finally(() => { this._saving--; this._paintBar(); });
    this._paintBar();
  }
  _paintBar() {
    const e = this._e;
    if (!e || !this._cur) return;
    const st = this._pending || this._saving ? ['mdi:cloud-sync-outline', 'Speichert …', '']
      : this._saved === 'err' ? ['mdi:alert-circle-outline', 'Nicht gespeichert', 'err']
        : this._saved === 'ok' ? ['mdi:check-circle-outline', 'Gespeichert', 'ok'] : ['mdi:pencil-outline', 'Artikel bearbeiten', ''];
    const k = st.join('|');
    if (e.state._k === k) return;
    e.state._k = k;
    e.state.className = `state sp ${st[2]}`;
    e.state.innerHTML = `<ha-icon icon="${st[0]}"></ha-icon><span></span>`;
    e.state.lastChild.textContent = st[1];
  }
  _remove() {
    const x = this._cur;
    if (!x) return;
    clearTimeout(this._st); this._pending = false;
    this._cur = null;
    this._e.g.classList.remove('detail');
    api.remove(this._h, x.id).catch(err => console.warn('[nova-cards] Einkauf: Löschen fehlgeschlagen', err));
    this._render();
  }

  /* ----- Drucken ----- */
  // Offene Artikel als Klartext, nach Geschäft gruppiert: „[ ] 2 l Milch“, Notiz eingerückt darunter
  _text() {
    const open = this._items().filter(i => !i.done), stores = this._data?.stores || [], out = [];
    const line = i => { out.push(`[ ] ${i.qty === 1 && (!i.unit || i.unit === 'Stk') ? '' : `${qtyText(i)} `}${i.name}`); toPlain(i.note).split('\n').filter(Boolean).forEach(l => out.push(`    ${l}`)); };
    if (this._c.group !== false && stores.length) {
      [...stores, null].forEach(s => {
        const rows = open.filter(i => s ? i.store === s.id : !this._store(i.store));
        if (!rows.length) return;
        if (out.length) out.push('');
        out.push((s?.name || 'Sonstiges').toUpperCase());
        rows.forEach(line);
      });
    } else open.forEach(line);
    return out.join('\n');
  }
  _print() {
    const c = this._c;
    if (this._pstate === 'busy') return;
    const open = this._items().filter(i => !i.done);
    runPrint(this, this._h, c.print_script, {[c.print_field || 'text']: this._text(),
      items: open.map(i => ({name: i.name, qty: i.qty, unit: i.unit, store: this._store(i.store)?.name || '', note: toPlain(i.note)}))},
    st => { this._pstate = st; this._render(); });
  }
}
define('shopping-card', NovaShoppingCard, {name: 'Nova Einkauf Card', description: 'Einkaufsliste mit Menge, Einheit, Geschäft, Icon oder eigenem Bild und Notiz: nach Geschäft gruppiert, abhaken, zuletzt Gekauftes als Schnellauswahl, auf allen Geräten gleich (Nova-Integration), optional mit todo-Liste für Assist und Druck-Knopf.', documentationURL: docUrl('nova-einkauf-card')});

/* ---------- Editor Einkauf Card ---------- */
const GEN = [
  g2({name: 'name', selector: T}, {name: 'icon', selector: I}),
  {name: 'show_header', selector: {boolean: {}}},
  {name: 'placeholder', selector: T},
];
const LIST = stores => [
  g2({name: 'group', selector: {boolean: {}}}, {name: 'show_images', selector: {boolean: {}}}),
  g2({name: 'show_completed', selector: {boolean: {}}}, {name: 'show_suggestions', selector: {boolean: {}}}),
  ...(stores.length ? [sel('default_store', [['', 'Keins'], ...stores.map(s => [s.id, s.name])])] : []),
  {name: 'height', selector: {number: {min: 200, max: 1000, step: 10, mode: 'box', unit_of_measurement: 'px'}}},
];
const SYNC = [{name: 'entity', selector: {entity: {domain: 'todo'}}}];
const PRINT = printSchema([{name: 'print_field', selector: T}]);
const LABELS = {...BASE_LABELS, ...PRINT_LABELS, name: 'Titel der Karte', show_header: 'Kopfzeile anzeigen', placeholder: 'Platzhalter im Eingabefeld',
  group: 'Nach Geschäft gruppieren', show_images: 'Bilder anzeigen', show_completed: 'Erledigte aufgeklappt', show_suggestions: 'Schnellauswahl anzeigen',
  default_store: 'Standard-Geschäft', height: 'Mindesthöhe', entity: 'todo-Liste zum Abgleichen', print_field: 'Feldname im Skript'};
const HELPERS = {...PRINT_HELPERS, show_images: 'Aus = statt eigener Bilder nur Icons.', show_completed: 'Erledigte stehen unten und lassen sich in der Karte auf- und zuklappen.',
  show_suggestions: 'Zuletzt gekaufte Artikel als Chips unter dem Eingabefeld.', default_store: 'Für neue Artikel, die noch nie gekauft wurden.',
  height: 'Im Raster füllt die Karte den Platz aus.',
  entity: 'Optional, z. B. todo.shopping_list. Die Nova-Integration hält beide Listen gleich – so funktioniert „Setz Milch auf die Einkaufsliste“ weiter. Gilt für alle Einkauf-Karten.',
  print_field: 'Unter diesem Namen bekommt das Skript die offene Liste als Klartext (Standard: text), zusätzlich „items“ als Liste.'};

class NovaShoppingCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static helpers = HELPERS;
  static openSections = ['general'];
  set hass(h) {
    super.hass = h;
    // Geschäfte und eingestellte todo-Liste kommen aus der Integration
    if (!this._off && h && this.isConnected) this._off = watch(h, 'shopping', this, d => {
      const k = JSON.stringify([d?.stores, d?.sync_entity]);
      if (k === this._sk) return;
      this._sk = k; this._shop = d;
      if (this._config) this._rebuild();
    });
  }
  disconnectedCallback() { super.disconnectedCallback(); this._off?.(); this._off = null; }
  _build() {
    const r = this.shadowRoot, c0 = this._config, d = this._shop;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), data = {...SDEF, default_store: '', ...c0, ...(d?.sync_entity ? {entity: d.sync_entity} : {})};
    const strip = c => { Object.entries(SDEF).forEach(([k, x]) => c[k] === x && delete c[k]); return c; };
    const form = schema => this._form(schema, data, v => this._emit(strip(merge(this._config, names(schema), v))));
    w.append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => b.append(form(GEN))),
      this._section('list', 'mdi:format-list-checks', 'Liste', b => {
        if (d && !d.stores.length) b.append(this._hint('Geschäfte legst du in der Karte an: Artikel antippen → Geschäft → „Neu“. Danach lässt sich hier ein Standard-Geschäft wählen.'));
        b.append(form(LIST(d?.stores || [])));
      }),
      this._section('sync', 'mdi:sync', 'Abgleich mit todo-Liste (Assist)', b => b.append(this._form(SYNC, data, v => {
        // Der Abgleich läuft in der Integration – dort sofort umstellen, in der Konfig nur merken
        const id = v.entity || null;
        if (this._hass && (d?.sync_entity || null) !== id) api.setSync(this._hass, id).catch(err => console.warn('[nova-cards] Einkauf: todo-Abgleich nicht eingestellt', err));
        this._emit(strip(merge(this._config, ['entity'], v)));
      }))),
      this._section('print', 'mdi:printer-pos', 'Drucken', b => b.append(form(PRINT))));
  }
}
define('shopping-card-editor', NovaShoppingCardEditor);
