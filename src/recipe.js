import {define, docUrl, tag} from './shared/define.js';
import {setIcon} from './shared/utils.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, FIELD_CSS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {hassChanged} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, sel, BASE_LABELS} from './shared/editor-schema.js';
import {PRINT_CSS, PRINT_DEF, printButton, paintBtn, runPrint, runFeedback, stopFeedback, printSchema, PRINT_LABELS, PRINT_HELPERS} from './shared/print-button.js';
import {watch, recipes as api, storeHint, imageUrl} from './shared/nova-store.js';
import {RICH_CSS, richEditor, richView, toPlain} from './shared/rich-text.js';
import {amount, mins} from './shared/recipe-util.js';
import {VIEW_CSS, roundBtn, armButton, setBtnIcon} from './shared/stack-view.js';
import {PICK_MEDIA_CSS, mediaPicker} from './shared/media-picker.js';

/* ---------- Nova Rezept Card ---------- */
// Rezeptbuch aus der Nova-Integration: Liste (Suche, Schlagwörter, Favoriten) ↔ Rezept (Bild, Zutaten, Zubereitung).
// Portionen lassen sich umrechnen, gewählte Zutaten gehen mit einem Tipp auf die Einkaufsliste (Nova Einkauf).
// Der Druck-Knopf gibt das Rezept als Klartext an ein Skript (Feld text) – z. B. für einen Bondrucker.
const RCSS = `
.g.rc{gap:var(--nv-s5)}
.hd .rb{margin-left:auto}
.srch{height:44px;border-radius:var(--nv-r-pill);padding:0 var(--nv-s8);flex:none}
.tags{display:flex;gap:var(--nv-s3);overflow-x:auto;flex:none;scrollbar-width:none;margin:0 calc(var(--nv-s2) * -1);padding:var(--nv-s1) var(--nv-s2);
-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 24px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 24px),transparent)}
.tags::-webkit-scrollbar{display:none}
.tags:empty{display:none}
.chip{display:inline-flex;align-items:center;gap:var(--nv-s2);height:38px;padding:0 var(--nv-s6);border-radius:var(--nv-r-pill);flex:none;cursor:pointer;
border:1px solid rgba(var(--nv-tint),.1);background:var(--nv-chip);color:inherit;font:inherit;font-size:var(--nv-fs-6);white-space:nowrap;-webkit-tap-highlight-color:transparent;
transition:transform var(--nv-d2) var(--nv-ease),background-color var(--nv-d2),border-color var(--nv-d2),box-shadow var(--nv-d2)}
.chip:active{transform:scale(var(--nv-press))}
.chip ha-icon{--mdc-icon-size:17px}
.chip.on{background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));border-color:transparent;color:color-mix(in srgb,var(--nv-active-fg) var(--nv-fill-ink),var(--nv-fg));
box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
.chip.ro{cursor:default;height:30px;font-size:var(--nv-fs-4);padding:0 var(--nv-s5)}
.rl{display:flex;flex-direction:column;gap:var(--nv-s3)}
.rc.grid .rl{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:var(--nv-s4)}
.rr{display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s3);padding-right:var(--nv-s6);border-radius:var(--nv-r-md);min-width:0;position:relative;overflow:hidden;
background:rgba(var(--nv-tint),.05);border:1px solid rgba(var(--nv-tint),.07);transition:transform var(--nv-d2) var(--nv-ease),border-color var(--nv-d3)}
.rr.new{animation:rb-in var(--nv-d5) var(--nv-ease) both;animation-delay:calc(var(--i,0) * 40ms)}
.rr:active{transform:scale(.98)}
.rr .im{width:56px;height:56px;border-radius:var(--nv-r-sm);flex:none;display:flex;align-items:center;justify-content:center;background:rgba(var(--nv-tint),.08);overflow:hidden}
.rr .im img{width:100%;height:100%;object-fit:cover;transition:transform var(--nv-d6) var(--nv-ease)}
.rr .im ha-icon{--mdc-icon-size:26px;opacity:.5}
.rr .tx{flex:1;min-width:0}
.rr b{display:block;font-weight:var(--nv-fw-medium);font-size:var(--nv-fs-8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rr small{display:flex;gap:var(--nv-s4);align-items:center;font-size:var(--nv-fs-3);opacity:.6;margin-top:var(--nv-s1);white-space:nowrap;overflow:hidden}
.rr small ha-icon{--mdc-icon-size:13px}
.rr small span{display:inline-flex;gap:var(--nv-s1);align-items:center}
.rr .fav{--mdc-icon-size:18px;color:var(--nv-error);flex:none}
.rc.grid .rr{flex-direction:column;align-items:stretch;padding:0;gap:0}
.rc.grid .rr .im{width:auto;height:auto;aspect-ratio:4/3;border-radius:0}
.rc.grid .rr .tx{padding:var(--nv-s4) var(--nv-s5) var(--nv-s5)}
.rc.grid .rr .fav{position:absolute;top:var(--nv-s4);right:var(--nv-s4);filter:drop-shadow(0 1px 2px rgba(var(--nv-shade),.6))}
.rd{display:flex;flex-direction:column;gap:var(--nv-s6);padding-bottom:var(--nv-s6)}
.hero{border-radius:var(--nv-r-md);overflow:hidden;aspect-ratio:16/9;flex:none;background:rgba(var(--nv-tint),.08);animation:rc-hero var(--nv-d6) var(--nv-ease)}
.hero img{width:100%;height:100%;object-fit:cover;display:block}
.rd h2{margin:0;font-size:var(--nv-fd-1);font-weight:var(--nv-fw-heavy);line-height:1.2;overflow-wrap:anywhere}
.meta{display:flex;gap:var(--nv-s3);flex-wrap:wrap}
.lb{font-size:var(--nv-fs-3);font-weight:var(--nv-fw-bold);opacity:.6;text-transform:uppercase;letter-spacing:var(--nv-caps);display:flex;align-items:center;gap:var(--nv-s4)}
.lb .sp{flex:1}
.qt{display:flex;align-items:center;flex:none;border-radius:var(--nv-r-pill);background:var(--nv-chip);border:1px solid rgba(var(--nv-tint),.08);text-transform:none;letter-spacing:0;opacity:1}
.qt button{width:44px;height:40px;border:0;background:transparent;color:inherit;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;border-radius:var(--nv-r-pill);
-webkit-tap-highlight-color:transparent;outline:none;transition:transform var(--nv-d2) var(--nv-ease)}
.qt button:active{transform:scale(.8)}
.qt button:focus-visible{box-shadow:var(--nv-focus)}
.qt button ha-icon{--mdc-icon-size:18px}
.qt span{min-width:74px;text-align:center;font-size:var(--nv-fs-6);font-weight:var(--nv-fw-bold);white-space:nowrap}
.ing{display:flex;flex-direction:column}
.ig{display:flex;align-items:center;gap:var(--nv-s5);min-height:44px;border-top:1px solid rgba(var(--nv-tint),.08);cursor:pointer;-webkit-tap-highlight-color:transparent;outline:none}
.ig:first-child{border-top:0}
.ig:focus-visible{box-shadow:var(--nv-focus)}
.ig .ck{width:22px;height:22px;border-radius:50%;box-sizing:border-box;border:2px solid rgba(var(--nv-tint),.45);flex:none;display:flex;align-items:center;justify-content:center;
transition:background-color var(--nv-d3),border-color var(--nv-d3),transform var(--nv-d2) var(--nv-ease)}
.ig .ck ha-icon{--mdc-icon-size:15px;opacity:0;transform:scale(.3);transition:opacity var(--nv-d2),transform var(--nv-d4) var(--nv-ease)}
.ig.on .ck{background:var(--nv-active);border-color:var(--nv-active);color:var(--nv-active-fg)}
.ig.on .ck ha-icon{opacity:1;transform:none}
.ig .q{min-width:68px;font-weight:var(--nv-fw-bold);font-size:var(--nv-fs-7);font-variant-numeric:tabular-nums;white-space:nowrap}
.ig .q.bump{animation:rc-bump var(--nv-d4) var(--nv-ease)}
.ig .n{flex:1;min-width:0;font-size:var(--nv-fs-8);overflow-wrap:anywhere}
.ig:not(.on) .n,.ig:not(.on) .q{opacity:.5}
.tolist{align-self:stretch}
.tolist.pb.pill{flex:none;width:100%}
.form{display:flex;flex-direction:column;gap:var(--nv-s5);padding-bottom:var(--nv-s6)}
.form .fld{height:44px;border-radius:var(--nv-r-md);padding:0 var(--nv-s6)}
.form .ti{font-weight:var(--nv-fw-bold)}
.form .two{display:grid;grid-template-columns:1fr 1fr;gap:var(--nv-s4)}
.form label{display:flex;flex-direction:column;gap:var(--nv-s2);font-size:var(--nv-fs-3);opacity:.9;min-width:0}
.form label span{opacity:.65;font-weight:var(--nv-fw-bold);text-transform:uppercase;letter-spacing:var(--nv-caps)}
.ie{display:grid;grid-template-columns:64px 84px minmax(0,1fr) 40px;gap:var(--nv-s3);align-items:center}
.ie .fld{padding:0 var(--nv-s4);text-overflow:ellipsis}
.ie select.fld{padding-right:var(--nv-s1)}
.ie select option{color:initial}
.addi{align-self:flex-start}
.form .rte{min-height:120px;border-radius:var(--nv-r-md);padding:var(--nv-s5) var(--nv-s7);border:1px solid var(--nv-box-border);background:var(--nv-box);margin-top:var(--nv-s3);
transition:border-color var(--nv-d2),box-shadow var(--nv-d2)}
.form .rte:focus{border-color:color-mix(in srgb,var(--nv-active) 75%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 22%,transparent) var(--nv-glow),transparent)}
.rb.favb.on{background:color-mix(in srgb,var(--nv-error) 22%,var(--nv-chip));color:var(--nv-error);border-color:color-mix(in srgb,var(--nv-error) 55%,transparent);box-shadow:none}
.rb.favb.on ha-icon{animation:rb-pop var(--nv-d5) var(--nv-ease)}
.bar .pb{width:44px;padding:0}
@keyframes rc-hero{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:none}}
@keyframes rc-bump{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.rr.new,.hero,.ig .q.bump,.rb.favb.on ha-icon{animation:none}}`;

const RDEF = {name: 'Rezepte', icon: 'mdi:chef-hat', show_header: true, view: 'list', show_search: true, height: 420, print_field: 'text', ...PRINT_DEF};
const SAVE_MS = 800;

class NovaRecipeCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('recipe-card-editor')); }
  static getStubConfig() { return {}; }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._c = {...RDEF, ...c};
    this._ids = [this._c.print_script].filter(Boolean);
    if (this._e) this._apply();
  }
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    if (!this._e) this._build();
    this._watch();
    this._picker?.setHass(h);
    if (hassChanged(old, h, this._ids)) this._render();
  }
  getCardSize() { return 8; }
  getGridOptions() { return {columns: 6, rows: 'auto', min_columns: 3}; }
  connectedCallback() { this._watch(); }
  disconnectedCallback() { this._flush(); this._off?.(); this._off = null; stopFeedback(this); clearTimeout(this._st); clearTimeout(this._okT); this._del?.reset(); }
  _watch() {
    if (this._off || !this._h || !this.isConnected) return;
    this._off = watch(this._h, 'recipes', this, (d, err) => { this._data = d; this._err = err; this._onData(); });
  }

  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${FIELD_CSS}${PRINT_CSS}${VIEW_CSS}${RICH_CSS}${PICK_MEDIA_CSS}${RCSS}</style><div class="g rc">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<div class="stage"><div class="view main"><input class="fld srch" type="search" placeholder="Rezept suchen …" autocomplete="off" enterkeyhint="search">
<div class="tags"></div><div class="scroll"><div class="rl"></div></div></div>
<div class="view side"><div class="bar"></div><div class="scroll"><div class="body"></div></div></div></div></div>`;
    const q = s => r.querySelector(s);
    const e = this._e = {g: q('.g'), hd: q('.hd'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), srch: q('.srch'), tags: q('.tags'), rl: q('.rl'), bar: q('.bar'), body: q('.body')};
    this._seen = new Set(); this._pstate = 'idle'; this._lstate = 'idle'; this._tag = null; this._favOnly = false;
    e.add = roundBtn('mdi:plus', 'Neues Rezept', () => this._edit(null), 'plus');
    e.hd.append(e.add);
    e.srch.addEventListener('input', () => this._render());
    e.srch.addEventListener('keydown', ev => ev.stopPropagation());
    e.back = roundBtn('mdi:arrow-left', 'Zurück', () => this._back());
    e.state = document.createElement('div'); e.state.className = 'state sp';
    e.fav = roundBtn('mdi:heart-outline', 'Favorit', () => this._toggleFav(), 'favb');
    e.edit = roundBtn('mdi:pencil-outline', 'Bearbeiten', () => this._edit(this._cur));
    this._pb = printButton(() => this._print());
    this._del = armButton('mdi:delete-outline', 'Rezept löschen', () => this._remove());
    e.bar.append(e.back, e.state, e.fav, e.edit, this._pb, this._del);
    this._apply();
  }
  _apply() {
    const c = this._c, e = this._e;
    e.hd.hidden = c.show_header === false;
    e.srch.hidden = c.show_search === false;
    e.g.classList.toggle('grid', c.view === 'grid');
    e.g.style.setProperty('--vh', `${Math.max(240, +c.height || RDEF.height)}px`);
    this._key = null;
    this._render();
  }
  _onData() {
    const d = this._data, cur = this._cur?.id && d?.recipes.find(x => x.id === this._cur.id);
    if (this._cur?.id && d && !cur) { this._cur = null; this._mode = null; this._e?.g.classList.remove('detail'); }
    else if (cur && this._mode === 'read' && cur.updated !== this._cur.updated) { this._cur = cur; this._read(); }
    this._render();
  }
  _img(x) { return x.image ? imageUrl(this._h, 'recipes', x.image) : ''; }

  /* ----- Liste ----- */
  _render() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !c || !e) return;
    setIcon(e.ic, c.icon);
    e.name.textContent = c.name || RDEF.name;
    const all = this._data?.recipes || [], n = all.length;
    e.sub.textContent = this._err ? '' : !this._data ? 'Wird geladen …' : n ? `${n} ${n === 1 ? 'Rezept' : 'Rezepte'}` : 'Noch leer';
    e.add.disabled = !this._data;
    const tags = [...new Set(all.flatMap(x => x.tags || []))].sort((a, b) => a.localeCompare(b, 'de'));
    if (this._tag && !tags.includes(this._tag)) this._tag = null;
    const q = e.srch.value.trim().toLowerCase();
    const list = all.filter(x => (!this._favOnly || x.favorite) && (!this._tag || x.tags?.includes(this._tag))
      && (!q || x.title.toLowerCase().includes(q) || x.tags?.some(t => t.toLowerCase().includes(q)) || x.ingredients?.some(i => i.name.toLowerCase().includes(q))))
      .sort((a, b) => (b.favorite - a.favorite) || a.title.localeCompare(b.title, 'de'));
    let msg = null;
    if (this._err) msg = storeHint(this._err, 'recipes');
    else if (!this._data) msg = ['mdi:timer-sand', 'Wird geladen …'];
    else if (!n) msg = ['mdi:book-plus-outline', 'Noch keine Rezepte – mit + legst du das erste an.'];
    else if (!list.length) msg = ['mdi:magnify-close', 'Kein Rezept gefunden'];
    const key = JSON.stringify([msg, list.map(x => [x.id, x.title, x.image, x.time, x.servings, x.favorite]), tags, this._tag, this._favOnly, c.view]);
    if (key !== this._key) {
      this._key = key;
      const chip = (label, on, fn, icon) => {
        const b = document.createElement('button');
        b.type = 'button'; b.className = `chip${on ? ' on' : ''}`;
        if (icon) { const i = document.createElement('ha-icon'); i.setAttribute('icon', icon); b.append(i); }
        b.append(document.createTextNode(label));
        b.addEventListener('click', fn);
        return b;
      };
      e.tags.replaceChildren(...(n && (tags.length || all.some(x => x.favorite)) ? [
        ...(all.some(x => x.favorite) ? [chip('Favoriten', this._favOnly, () => { this._favOnly = !this._favOnly; this._render(); }, this._favOnly ? 'mdi:heart' : 'mdi:heart-outline')] : []),
        ...tags.map(t => chip(t, this._tag === t, () => { this._tag = this._tag === t ? null : t; this._render(); }))] : []));
      if (msg) {
        const m = document.createElement('div');
        m.className = 'msg'; m.innerHTML = '<ha-icon></ha-icon><span></span>';
        m.firstChild.setAttribute('icon', msg[0]); m.lastChild.textContent = msg[1];
        e.rl.replaceChildren(m);
      } else e.rl.replaceChildren(...list.map((x, i) => this._row(x, i)));
    }
    this._paintBar();
  }
  _row(x, i) {
    const el = document.createElement('div');
    el.className = `rr${this._seen.has(x.id) ? '' : ' new'}`;
    this._seen.add(x.id);
    el.style.setProperty('--i', Math.min(i, 8));
    el.innerHTML = `<div class="im"></div><div class="tx"><b></b><small></small></div>${x.favorite ? '<ha-icon class="fav" icon="mdi:heart"></ha-icon>' : ''}`;
    const im = el.firstChild, src = this._img(x);
    if (src) { const g = document.createElement('img'); g.alt = ''; g.loading = 'lazy'; g.src = src; im.append(g); }
    else im.innerHTML = '<ha-icon icon="mdi:silverware-fork-knife"></ha-icon>';
    el.querySelector('b').textContent = x.title;
    const sm = el.querySelector('small');
    const meta = (icon, t) => { const s = document.createElement('span'); s.innerHTML = `<ha-icon icon="${icon}"></ha-icon>`; s.append(document.createTextNode(t)); sm.append(s); };
    if (x.time) meta('mdi:clock-outline', mins(x.time));
    meta('mdi:account-multiple-outline', `${x.servings}`);
    if (x.ingredients?.length) meta('mdi:format-list-bulleted', `${x.ingredients.length}`);
    press(el, {tap: () => this._show(x)});
    return el;
  }

  /* ----- Rezept lesen ----- */
  _show(x) {
    this._cur = x; this._servings = x.servings; this._pick = new Set((x.ingredients || []).map((_, i) => i));
    this._read();
    this._e.g.classList.add('detail');
  }
  _read() {
    const e = this._e, x = this._cur;
    this._mode = 'read'; this._picker = null;
    const body = document.createElement('div'); body.className = 'rd';
    const src = this._img(x);
    if (src) { const hero = document.createElement('div'); hero.className = 'hero'; const g = document.createElement('img'); g.alt = ''; g.src = src; hero.append(g); body.append(hero); }
    const h2 = document.createElement('h2'); h2.textContent = x.title; body.append(h2);
    const meta = document.createElement('div'); meta.className = 'meta';
    const ro = (t, icon) => { const s = document.createElement('span'); s.className = 'chip ro'; if (icon) s.innerHTML = `<ha-icon icon="${icon}"></ha-icon>`; s.append(document.createTextNode(t)); meta.append(s); };
    if (x.time) ro(mins(x.time), 'mdi:clock-outline');
    (x.tags || []).forEach(t => ro(t));
    if (meta.childNodes.length) body.append(meta);
    if (x.ingredients?.length) {
      const lb = document.createElement('div'); lb.className = 'lb';
      lb.innerHTML = '<span>Zutaten</span><span class="sp"></span><div class="qt"><button type="button" aria-label="Weniger Portionen"><ha-icon icon="mdi:minus"></ha-icon></button><span></span><button type="button" aria-label="Mehr Portionen"><ha-icon icon="mdi:plus"></ha-icon></button></div>';
      const qt = lb.querySelector('.qt');
      this._sv = qt.children[1];
      qt.children[0].addEventListener('click', () => this._setServings(this._servings - 1));
      qt.children[2].addEventListener('click', () => this._setServings(this._servings + 1));
      this._ing = document.createElement('div'); this._ing.className = 'ing';
      this._lb = printButton(() => this._toList());
      this._lb.classList.add('tolist');
      body.append(lb, this._ing, this._lb);
      this._paintIng();
    }
    if (x.steps) {
      const lb = document.createElement('div'); lb.className = 'lb'; lb.textContent = 'Zubereitung';
      const st = document.createElement('div');
      // Checklisten in der Zubereitung lassen sich beim Kochen abhaken – nur hier, das Rezept bleibt unverändert
      richView(st, x.steps, () => {});
      body.append(lb, st);
    }
    e.body.replaceChildren(body);
    e.body.parentElement.scrollTop = 0;
    this._del.reset();
    this._paintBar();
  }
  _setServings(n) {
    n = Math.max(1, Math.min(99, n));
    if (n === this._servings) return;
    this._servings = n;
    this._paintIng(true);
  }
  _paintIng(bump) {
    const x = this._cur, k = this._servings / (x.servings || 1);
    this._sv.textContent = `${this._servings} ${this._servings === 1 ? 'Portion' : 'Portionen'}`;
    this._ing.replaceChildren(...x.ingredients.map((ing, i) => {
      const el = document.createElement('div');
      el.className = `ig${this._pick.has(i) ? ' on' : ''}`;
      el.tabIndex = 0; el.setAttribute('role', 'checkbox'); el.setAttribute('aria-checked', this._pick.has(i));
      el.innerHTML = `<span class="ck"><ha-icon icon="mdi:check-bold"></ha-icon></span><span class="q${bump && ing.qty != null ? ' bump' : ''}"></span><span class="n"></span>`;
      el.children[1].textContent = amount(ing, k); el.children[2].textContent = ing.name;
      const tog = () => { if (this._pick.has(i)) this._pick.delete(i); else this._pick.add(i); el.classList.toggle('on'); el.setAttribute('aria-checked', this._pick.has(i)); this._paintList(); };
      el.addEventListener('click', tog);
      el.addEventListener('keydown', ev => { if (ev.key === ' ' || ev.key === 'Enter') { ev.preventDefault(); tog(); } });
      return el;
    }));
    this._paintList();
  }
  _paintList() {
    const n = this._pick.size;
    paintBtn(this._lb, {icon: 'mdi:cart-plus', label: n ? `${n} ${n === 1 ? 'Zutat' : 'Zutaten'} auf die Einkaufsliste` : 'Keine Zutat gewählt', pill: true,
      busy: 'Wird eingetragen …', ok: 'Steht auf der Liste', err: 'Einkauf nicht erreichbar'}, this._lstate, n > 0);
    this._lb.classList.add('tolist');
  }
  _toList() {
    const x = this._cur;
    if (!x || !this._pick.size || this._lstate === 'busy') return;
    const only = this._pick.size === x.ingredients.length ? null : [...this._pick].sort((a, b) => a - b);
    runFeedback(this, 'list', () => api.toShopping(this._h, x.id, this._servings, only), st => { this._lstate = st; if (this._mode === 'read' && this._lb?.isConnected) this._paintList(); });
  }
  _toggleFav() {
    const x = this._cur;
    if (!x?.id) return;
    this._cur = {...x, favorite: !x.favorite};
    this._paintBar();
    api.save(this._h, {id: x.id, favorite: !x.favorite}).catch(err => console.warn('[nova-cards] Rezept: Favorit nicht gespeichert', err));
  }
  _back() {
    if (this._mode === 'edit') {
      this._flush();
      // Aus dem Bearbeiten zurück zum Rezept (neues, leeres Rezept: zurück zur Liste)
      const saved = this._draft?.id && (this._data?.recipes.find(r => r.id === this._draft.id) || this._draft);
      this._draft = null;
      if (saved) { this._cur = saved; this._servings = saved.servings; this._pick = new Set((saved.ingredients || []).map((_, i) => i)); this._read(); return; }
    }
    this._e.g.classList.remove('detail');
    this._cur = null; this._mode = null; this._key = null;
    this._render();
  }

  /* ----- Rezept bearbeiten ----- */
  _edit(x) {
    if (!this._data) return;
    const e = this._e, d = this._draft = x ? JSON.parse(JSON.stringify(x)) : {id: null, title: '', image: null, servings: 2, time: null, tags: [], ingredients: [], steps: '', favorite: false};
    this._mode = 'edit'; this._cur = d;
    const f = document.createElement('div'); f.className = 'form';
    const field = (label, el) => { const l = document.createElement('label'); const s = document.createElement('span'); s.textContent = label; l.append(s, el); return l; };
    const inp = (v, attrs = {}) => {
      const i = document.createElement('input');
      i.className = 'fld'; Object.assign(i, {type: 'text', autocomplete: 'off', ...attrs}); i.value = v ?? '';
      i.addEventListener('keydown', ev => ev.stopPropagation());
      return i;
    };
    const ti = inp(d.title, {maxLength: 200, placeholder: 'Name des Rezepts'});
    ti.classList.add('ti');
    ti.addEventListener('input', () => { d.title = ti.value; this._dirty(); });
    const sv = inp(d.servings, {type: 'number', min: 1, max: 99, inputMode: 'numeric'});
    sv.addEventListener('input', () => { d.servings = Math.max(1, Math.min(99, Math.round(+sv.value) || 1)); this._dirty(); });
    const tm = inp(d.time, {type: 'number', min: 0, max: 6000, inputMode: 'numeric', placeholder: '–'});
    tm.addEventListener('input', () => { d.time = tm.value === '' ? null : Math.max(0, Math.round(+tm.value) || 0); this._dirty(); });
    const two = document.createElement('div'); two.className = 'two';
    two.append(field('Portionen', sv), field('Zeit in Minuten', tm));
    const tg = inp((d.tags || []).join(', '), {placeholder: 'z. B. schnell, vegetarisch'});
    tg.addEventListener('input', () => { d.tags = tg.value.split(',').map(s => s.trim()).filter(Boolean); this._dirty(); });
    const lb = t => { const l = document.createElement('div'); l.className = 'lb'; l.textContent = t; return l; };
    const ings = document.createElement('div'); ings.className = 'form';
    const units = this._data.units || [''];
    const row = ing => {
      const el = document.createElement('div'); el.className = 'ie';
      const q = inp(ing.qty == null ? '' : String(ing.qty).replace('.', ','), {inputMode: 'decimal', placeholder: 'Menge'});
      q.setAttribute('aria-label', 'Menge');
      q.addEventListener('input', () => { const v = parseFloat(q.value.replace(',', '.')); ing.qty = Number.isFinite(v) ? v : null; this._dirty(); });
      const u = document.createElement('select'); u.className = 'fld'; u.setAttribute('aria-label', 'Einheit');
      units.forEach(x => { const o = document.createElement('option'); o.value = x; o.textContent = x || '–'; u.append(o); });
      u.value = ing.unit || '';
      u.addEventListener('change', () => { ing.unit = u.value; this._dirty(); });
      const n = inp(ing.name, {maxLength: 120, placeholder: 'Zutat'});
      n.setAttribute('aria-label', 'Zutat');
      n.addEventListener('input', () => { ing.name = n.value; this._dirty(); });
      // Enter in der letzten Zeile legt die nächste Zutat an
      n.addEventListener('keydown', ev => { if (ev.key === 'Enter') { ev.preventDefault(); if (el === ings.lastChild) addIng(); else el.nextSibling?.children[2].focus(); } });
      const rm = roundBtn('mdi:close', 'Zutat entfernen', () => { d.ingredients.splice(d.ingredients.indexOf(ing), 1); el.remove(); this._dirty(); }, 'sm');
      el.append(q, u, n, rm);
      return el;
    };
    const addIng = () => { const ing = {name: '', qty: null, unit: ''}; d.ingredients.push(ing); const el = row(ing); ings.append(el); el.children[0].focus({preventScroll: true}); el.scrollIntoView({block: 'nearest'}); };
    d.ingredients.forEach(ing => ings.append(row(ing)));
    const add = document.createElement('button');
    add.type = 'button'; add.className = 'chip addi'; add.innerHTML = '<ha-icon icon="mdi:plus"></ha-icon>Zutat';
    add.addEventListener('click', addIng);
    this._picker = mediaPicker({hass: this._h, module: 'recipes', value: {image: d.image}, icons: [], search: false, fallback: 'mdi:image-outline', onChange: v => { d.image = v.image; this._dirty(); }});
    this._rt = richEditor({placeholder: 'Schritt für Schritt …', onInput: () => { d.steps = this._rt.get(); this._dirty(); }});
    this._rt.set(d.steps || '');
    f.append(ti, two, field('Schlagwörter (mit Komma getrennt)', tg), lb('Bild'), this._picker, lb('Zutaten'), ings, add, lb('Zubereitung'), this._rt.el);
    e.body.replaceChildren(f);
    e.body.parentElement.scrollTop = 0;
    e.g.classList.add('detail');
    this._del.reset();
    this._paintBar();
    if (!x) setTimeout(() => ti.focus({preventScroll: true}), 320);
  }
  _dirty() {
    this._pending = true;
    clearTimeout(this._st);
    this._st = setTimeout(() => this._flush(), SAVE_MS);
    this._paintBar();
  }
  // Speichern; ein neues Rezept wird erst angelegt, wenn es einen Namen hat
  _flush() {
    clearTimeout(this._st);
    const d = this._draft, h = this._h;
    if (!d || !h || !this._pending) return;
    if (!d.title.trim()) { this._paintBar(); return; }
    this._pending = false;
    this._saving = (this._saving || 0) + 1;
    const run = this._chain = (this._chain || Promise.resolve()).then(() => api.save(h, {...(d.id ? {id: d.id} : {}), title: d.title.trim(), image: d.image || null, servings: d.servings,
      time: d.time, tags: d.tags, ingredients: d.ingredients.filter(i => i.name.trim()).map(i => ({name: i.name.trim(), qty: i.qty, unit: i.unit || ''})), steps: d.steps})).then(rec => {
      d.id = rec.id; d.updated = rec.updated;
      this._saved = 'ok';
      clearTimeout(this._okT); this._okT = setTimeout(() => { this._saved = null; this._paintBar(); }, 2500);
    }).catch(err => { console.warn('[nova-cards] Rezept: Speichern fehlgeschlagen', err); this._saved = 'err'; })
      .finally(() => { this._saving--; if (this._chain === run) this._chain = null; this._paintBar(); });
    this._paintBar();
  }
  _remove() {
    const x = this._cur;
    if (!x?.id) return;
    clearTimeout(this._st); this._pending = false; this._draft = null;
    this._cur = null; this._mode = null;
    this._e.g.classList.remove('detail');
    api.remove(this._h, x.id).catch(err => console.warn('[nova-cards] Rezept: Löschen fehlgeschlagen', err));
    this._render();
  }
  _paintBar() {
    const e = this._e, x = this._cur, c = this._c, h = this._h;
    if (!e || !x) return;
    const edit = this._mode === 'edit';
    const st = !edit ? ['', '', ''] : this._pending && !x.title.trim() ? ['mdi:form-textbox', 'Name fehlt noch', '']
      : this._pending || this._saving ? ['mdi:cloud-sync-outline', 'Speichert …', '']
        : this._saved === 'err' ? ['mdi:alert-circle-outline', 'Nicht gespeichert', 'err']
          : this._saved === 'ok' ? ['mdi:check-circle-outline', 'Gespeichert', 'ok'] : ['mdi:pencil-outline', x.id ? 'Rezept bearbeiten' : 'Neues Rezept', ''];
    const k = st.join('|');
    if (e.state._k !== k) {
      e.state._k = k;
      e.state.className = `state sp ${st[2]}`;
      e.state.innerHTML = st[0] ? `<ha-icon icon="${st[0]}"></ha-icon><span></span>` : '';
      if (st[0]) e.state.lastChild.textContent = st[1];
    }
    e.fav.hidden = edit; e.edit.hidden = edit; this._del.hidden = !edit || !x.id;
    e.back.title = edit && x.id ? 'Fertig' : 'Zurück zur Liste';
    setBtnIcon(e.back, edit && x.id ? 'mdi:check' : 'mdi:arrow-left');
    e.fav.classList.toggle('on', !!x.favorite);
    setBtnIcon(e.fav, x.favorite ? 'mdi:heart' : 'mdi:heart-outline');
    this._pb.hidden = edit || !c.print_script;
    paintBtn(this._pb, {icon: c.print_icon || PRINT_DEF.print_icon, label: c.print_label || PRINT_DEF.print_label, pill: false, busy: 'Druckt …', ok: 'Gedruckt', err: 'Fehler'},
      this._pstate, !!h.states[c.print_script]);
  }
  // Rezept als Klartext: Titel, Portionen/Zeit, Zutaten (umgerechnet), Zubereitung
  _print() {
    const c = this._c, x = this._cur;
    if (!x || this._pstate === 'busy') return;
    const k = this._servings / (x.servings || 1), out = [x.title.toUpperCase(), [`${this._servings} ${this._servings === 1 ? 'Portion' : 'Portionen'}`, x.time ? mins(x.time) : ''].filter(Boolean).join(' · ')];
    if (x.ingredients?.length) out.push('', 'ZUTATEN', ...x.ingredients.map(i => `[ ] ${[amount(i, k), i.name].filter(Boolean).join(' ')}`));
    const steps = toPlain(x.steps);
    if (steps) out.push('', 'ZUBEREITUNG', steps);
    runPrint(this, this._h, c.print_script, {[c.print_field || 'text']: out.join('\n')}, st => { this._pstate = st; this._paintBar(); });
  }
}
define('recipe-card', NovaRecipeCard, {name: 'Nova Rezeptliste', description: 'Kompakte Rezeptliste mit Bild, Zutaten und Zubereitung: suchen, Schlagwörter, Favoriten, Portionen umrechnen und Zutaten mit einem Tipp auf die Einkaufsliste setzen. Auf allen Geräten gleich (Nova-Integration), mit Druck-Knopf.', documentationURL: docUrl('nova-rezeptliste')});

/* ---------- Editor Rezept Card ---------- */
const GEN = [
  g2({name: 'name', selector: T}, {name: 'icon', selector: I}),
  {name: 'show_header', selector: {boolean: {}}},
];
const VIEW = [
  sel('view', [['list', 'Liste (kleines Bild, eine Zeile je Rezept)'], ['grid', 'Kacheln (großes Bild)']]),
  g2({name: 'show_search', selector: {boolean: {}}}, {name: 'height', selector: {number: {min: 240, max: 1200, step: 10, mode: 'box', unit_of_measurement: 'px'}}}),
];
const PRINT = printSchema([{name: 'print_field', selector: T}]).filter(f => f.name !== 'print_style');
const LABELS = {...BASE_LABELS, ...PRINT_LABELS, name: 'Titel der Karte', show_header: 'Kopfzeile anzeigen', view: 'Ansicht der Liste', show_search: 'Suchfeld anzeigen',
  height: 'Mindesthöhe', print_field: 'Feldname im Skript'};
const HELPERS = {...PRINT_HELPERS, height: 'Im Raster füllt die Karte den Platz aus.',
  print_script: 'Leer = kein Druck-Knopf. Der Knopf sitzt im geöffneten Rezept.',
  print_field: 'Unter diesem Namen bekommt das Skript das Rezept als Klartext (Standard: text).'};

class NovaRecipeCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static helpers = HELPERS;
  static openSections = ['general'];
  _build() {
    const r = this.shadowRoot, c0 = this._config;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), data = {...RDEF, ...c0};
    const strip = c => { Object.entries(RDEF).forEach(([k, x]) => c[k] === x && delete c[k]); return c; };
    const form = schema => this._form(schema, data, v => this._emit(strip(merge(this._config, names(schema), v))));
    w.append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => b.append(form(GEN))),
      this._section('view', 'mdi:view-grid-outline', 'Ansicht', b => b.append(form(VIEW))),
      this._section('print', 'mdi:printer-pos', 'Drucken', b => b.append(form(PRINT))));
  }
}
define('recipe-card-editor', NovaRecipeCardEditor);
