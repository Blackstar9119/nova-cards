import {define, docUrl, tag} from './shared/define.js';
import {setIcon, list} from './shared/utils.js';
import {iconOf, nameOf, valueOf} from './shared/state.js';
import {moreInfo} from './shared/actions.js';
import {NOVA_VARS, roleVars, EDITOR_CSS, EDITOR_ICON_CSS, EDITOR_LIST_CSS} from './shared/styles.js';
import {hassChanged, entityIds} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, ENT, sel, ROLE, NAMEICON} from './shared/editor-schema.js';
import {register, unregister, curHash, cleanHash, clearHash, cameByNav, lockScroll, hasPopup} from './shared/popup-hub.js';
import {normRows, PREV, EDIT, GRID_CSS, CHIP_CSS, renderChips, GridCard} from './shared/card-grid.js';
import {GridEditor, GRID_ED_CSS, GRID_LABELS, GRID_HELPERS, INFO} from './shared/card-grid-editor.js';

// Raster (rows) und Info-Chips liegen in shared/card-grid.js bzw. shared/card-grid-editor.js
const DEF = {width: 1180, stack_below: 500, info_layout: 'wrap'};

/* ---------- Nova Pop-up Card ---------- */
const PCSS = `${NOVA_VARS}${GRID_CSS}${CHIP_CSS}
:host{display:block;font-family:var(--ha-font-family-body,Roboto,sans-serif)}
:host(.live){display:contents}
ha-icon{--mdc-icon-size:20px;display:flex}
.ph{display:none;align-items:center;gap:10px;padding:10px 12px;border-radius:16px;border:1px dashed var(--divider-color,#666);color:var(--primary-text-color);font-size:13px}
:host(.edit) .ph{display:flex}
.ph .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pop{position:fixed;inset:0;z-index:var(--nova-popup-z-index,6);display:flex;align-items:center;justify-content:center}
.pop[hidden]{display:none}
.ov{position:absolute;inset:0;background:var(--nv-popup-backdrop);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;transition:opacity .22s}
.sh{position:relative;display:flex;flex-direction:column;box-sizing:border-box;width:min(var(--pw,1180px),96vw);max-height:88vh;
background:var(--nv-popup-bg);color:var(--nv-fg);border-radius:var(--nv-popup-r);border:1px solid var(--nv-border);
box-shadow:0 20px 60px rgba(0,0,0,.45);overflow:hidden;opacity:0;transform:translateY(40px);transition:transform .26s cubic-bezier(.2,.8,.2,1),opacity .2s}
.sh.tint{background:linear-gradient(160deg,color-mix(in srgb,var(--tc) 55%,var(--nv-popup-base)),var(--nv-popup-base))}
.pop.in .ov{opacity:1}.pop.in .sh{opacity:1;transform:none}
.grip{display:none;justify-content:center;padding:8px 0 0;flex:none;touch-action:none}.grip i{width:40px;height:5px;border-radius:3px;background:currentColor;opacity:.35}
.hd{display:flex;align-items:center;gap:10px;margin:14px 14px 10px;padding:6px 6px 6px 14px;border-radius:999px;flex:none;touch-action:pan-x;
background:var(--nv-popup-head);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
.hi:empty{display:none}
.tt{flex:1 1 auto;min-width:min(30%,120px);font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bdg{display:flex;gap:6px;flex:0 1 auto;min-width:0;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.bdg::-webkit-scrollbar{display:none}.bdg:empty{display:none}
.bd{display:inline-flex;align-items:center;gap:5px;flex:none;padding:5px 10px;border-radius:999px;background:var(--c,var(--nv-chip));color:var(--cf,inherit);font-size:12px;white-space:nowrap;cursor:pointer;outline:none}
.bd ha-icon{--mdc-icon-size:15px}.bd img{width:15px;height:15px}.bd:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}.bd:active{transform:scale(.95)}
.bd .bn:empty,.bd .bv:empty{display:none}.bd .bn:not(:empty)+.bv:not(:empty)::before{content:'· '}
.bd[hidden]{display:none}
.x{width:36px;height:36px;border-radius:50%;border:none;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:inherit;cursor:pointer;padding:0}
.x:active{transform:scale(.92)}
.info{padding:0 14px 12px}
.body{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;box-sizing:border-box;
padding:0 14px calc(16px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:12px}
.pop.inline .cell.empty{min-height:72px;border:2px dashed var(--nv-box-border);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:12.5px;opacity:.7}
.pop.inline .cell.empty::after{content:'Leerer Platz'}
@media(max-width:600px){
.pop{align-items:flex-end}
.bd .bn{display:none}.bd .bv::before{content:none!important}.bd{padding:5px 8px}
.sh{width:100vw;height:88vh;max-height:none;border-radius:var(--nv-popup-r) var(--nv-popup-r) 0 0;border-bottom:none;opacity:1;transform:translateY(100%)}
.grip{display:flex}.hd{margin:8px 12px 10px}.info{padding:0 12px 10px}
.body{padding:0 12px calc(88px + env(safe-area-inset-bottom))}}
.pop.inline{position:static;display:block}.pop.inline .ov,.pop.inline .grip{display:none}
.pop.inline .sh{width:auto;height:auto;max-height:none;opacity:1;transform:none;border-radius:var(--nv-popup-r);box-shadow:none;border-bottom:1px solid var(--nv-border)}
.pop.inline .body{overflow:visible;padding-bottom:14px}
@media(prefers-reduced-motion:reduce){.ov,.sh{transition:none}}`;

class NovaPopupCard extends GridCard(HTMLElement) {
  static gridKind = 'popup';
  static getConfigElement() { return document.createElement(tag('popup-card-editor')); }
  static getStubConfig() {
    return {hash: 'neu', rows: [{cells: [{card: null}]}, {cells: [{card: null}, {card: null}]}]};
  }
  constructor() {
    super();
    const r = this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${PCSS}</style>
<div class="ph"><ha-icon icon="mdi:card-multiple-outline"></ha-icon><span class="t"></span></div>
<div class="pop" hidden><div class="ov"></div><div class="sh" role="dialog" aria-modal="true">
<div class="grip"><i></i></div>
<div class="hd"><span class="hi"></span><span class="tt"></span><div class="bdg"></div><button type="button" class="x" aria-label="Schließen" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></button></div>
<div class="info" hidden></div><div class="body"></div></div></div>`;
    this._pop = r.querySelector('.pop'); this._sh = r.querySelector('.sh'); this._body = r.querySelector('.body'); this._infoEl = r.querySelector('.info'); this._bdgEl = r.querySelector('.bdg');
    this._mode = 'live';
    r.querySelector('.x').addEventListener('click', () => this.close());
    r.querySelector('.ov').addEventListener('click', () => this.close());
    r.querySelector('.ov').addEventListener('touchmove', e => e.preventDefault(), {passive: false});
    this._sync = () => this._syncOpen();
    this._key = e => {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      // Esc in einem HA-Dialog (z. B. more-info über dem Pop-up) schließt nur den Dialog
      if (e.composedPath().some(n => n.localName?.includes('dialog'))) return;
      this.close();
    };
    this._swipe();
    this._ro = new ResizeObserver(() => this._stack());
  }

  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    const old = this._cfg?.hash;
    this._cfg = {...DEF, ...c, hash: cleanHash(c.hash), info: [].concat(c.info || []).map(x => typeof x === 'string' ? {entity: x} : x),
      badges: [].concat(c.badges || []).map(x => typeof x === 'string' ? {entity: x} : x).filter(x => x?.entity)};
    this._rows = normRows(c);
    this._ids = entityIds([this._cfg.info, this._cfg.badges]);
    if (this.isConnected && old !== this._cfg.hash) { this._unreg(old); this._reg(); }
    this._head();
    this._dirty = true;
    if (this._isOpen || this._mode === 'preview') this._grid();
    this._syncOpen();
  }
  // Die eingebetteten Karten bekommen jedes Update (sie filtern selbst), Kopfzeile und Info-Leiste nur bei eigenen Änderungen
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._isOpen && this._mode !== 'preview') return;
    if (old === h || hassChanged(old, h, this._ids)) this._info();
    this._cells().forEach(el => this._setHass(el));
  }
  getCardSize() { return this._mode === 'live' ? 0 : 1; }
  getGridOptions() { return {columns: 'full', rows: 'auto'}; }

  connectedCallback() {
    this._ro.observe(this._body);
    ['hashchange', 'popstate', 'location-changed'].forEach(ev => window.addEventListener(ev, this._sync));
    this._detect();
    requestAnimationFrame(() => this._detect());
  }
  disconnectedCallback() {
    ['hashchange', 'popstate', 'location-changed'].forEach(ev => window.removeEventListener(ev, this._sync));
    this._ro.disconnect();
    this._unreg(this._cfg?.hash);
    if (this._isOpen) this._hide(true);
    // Vorschau: Zellen an die Nachfolgerin weitergeben
    if (this._mode === 'preview') this._handOffCells();
  }
  _reg() { if (this._cfg?.hash && this._mode !== 'preview') register(this._cfg.hash, this); }
  _unreg(h) { if (h) unregister(h, this); }

  _detect() {
    if (!this.isConnected) return;
    // Im Karteneditor (Dialog) immer live geöffnet zeigen, im Bearbeitungsmodus des Dashboards nur den Platzhalter
    let inDialog = false, inEdit = !!(this.preview || this.hasAttribute('preview') || this.editMode);
    for (let n = this, i = 0; n && i < 80; i++) {
      if (PREV.has(n.tagName) || n.tagName?.includes('DIALOG')) { inDialog = true; break; }
      if (EDIT.has(n.tagName)) inEdit = true;
      n = n.parentElement || n.getRootNode?.().host;
    }
    let m = inDialog ? 'preview' : inEdit ? 'edit' : 'live';
    if (this._fallback) m = 'live';
    const was = this._mode;
    this._mode = m;
    ['live', 'edit', 'preview'].forEach(k => this.classList.toggle(k, k === m));
    this._pop.classList.toggle('inline', m === 'preview');
    this._unreg(this._cfg?.hash); this._reg();
    if (m === 'preview') {
      if (this._isOpen) this._hide(true);
      this._pop.hidden = false;
      if (this._dirty) this._grid();
      if (this._h) this.hass = this._h;
    } else if (was === 'preview') this._pop.hidden = true;
    this._syncOpen();
  }

  /* --- Öffnen & Schließen --- */
  _syncOpen() {
    if (!this._cfg || this._mode === 'preview') return;
    const want = this.isConnected && !!this._cfg.hash && curHash() === this._cfg.hash;
    if (want && !this._isOpen) this._show();
    else if (!want && this._isOpen) this._hide();
  }
  _show() {
    // Die Ersatzkarte des Docks hält sich zurück, wenn die echte Karte in dieser Ansicht liegt
    if (this._fallback && hasPopup(this._cfg.hash)) return;
    this._isOpen = true;
    this._back = cameByNav();
    clearTimeout(this._ht);
    this._pop.hidden = false;
    this._sh.style.transform = '';
    lockScroll(true);
    if (this._dirty) this._grid();
    if (this._h) this.hass = this._h;
    this._body.scrollTop = 0;
    window.addEventListener('keydown', this._key);
    requestAnimationFrame(() => requestAnimationFrame(() => { if (this._isOpen) this._pop.classList.add('in'); }));
  }
  _hide(now) {
    this._isOpen = false;
    this._pop.classList.remove('in');
    this._sh.style.transform = '';
    lockScroll(false);
    window.removeEventListener('keydown', this._key);
    clearTimeout(this._ht);
    if (now) this._pop.hidden = this._mode !== 'preview';
    else this._ht = setTimeout(() => { if (!this._isOpen && this._mode !== 'preview') this._pop.hidden = true; }, 260);
  }
  // Schließen = Hash entfernen; das eigentliche Ausblenden folgt über _syncOpen
  close() {
    if (!this._isOpen) return;
    if (curHash() === this._cfg.hash) clearHash(this._back); else this._hide();
  }

  // Nach unten wischen (Handy): auf Griff/Kopfzeile immer, im Inhalt nur, wenn er ganz oben steht
  _swipe() {
    const sh = this._sh;
    let y0 = 0, x0 = 0, dy = 0, t0 = 0, ok = false, drag = false;
    const mobile = () => matchMedia('(max-width:600px)').matches;
    sh.addEventListener('touchstart', e => {
      ok = this._isOpen && mobile() && e.touches.length === 1 && (!e.composedPath().includes(this._body) || this._body.scrollTop <= 0);
      if (!ok) return;
      y0 = e.touches[0].clientY; x0 = e.touches[0].clientX; dy = 0; t0 = Date.now(); drag = false;
    }, {passive: true});
    sh.addEventListener('touchmove', e => {
      if (!ok) return;
      const d = e.touches[0].clientY - y0, dx = e.touches[0].clientX - x0;
      if (!drag) {
        if (Math.abs(d) < 8 && Math.abs(dx) < 8) return;
        if (d <= 0 || Math.abs(dx) > d) { ok = false; return; }
        drag = true; sh.style.transition = 'none';
      }
      dy = Math.max(0, d);
      e.preventDefault();
      sh.style.transform = `translateY(${dy}px)`;
    }, {passive: false});
    const end = () => {
      if (!drag) { ok = false; return; }
      drag = false; ok = false;
      sh.style.transition = '';
      if (dy > 120 || dy / Math.max(1, Date.now() - t0) > 0.6) this.close();
      else sh.style.transform = '';
    };
    sh.addEventListener('touchend', end);
    sh.addEventListener('touchcancel', end);
  }

  /* --- Kopfzeile --- */
  _head() {
    const c = this._cfg, r = this.shadowRoot;
    r.querySelector('.tt').textContent = c.title || '';
    const hi = r.querySelector('.hi');
    if (c.icon) setIcon(hi, c.icon); else { hi.innerHTML = ''; hi._ic = null; }
    r.querySelector('.ph .t').textContent = c.title || (c.hash ? `#${c.hash}` : 'Kein Hash eingestellt');
    r.querySelector('.ph ha-icon').setAttribute('icon', c.icon || 'mdi:card-multiple-outline');
    this._sh.style.setProperty('--pw', `${+c.width || DEF.width}px`);
    const tint = c.tint || c.color;
    this._sh.classList.toggle('tint', !!tint);
    if (tint) this._sh.style.setProperty('--tc', roleVars(tint).c);
    if (c.title || c.hash) this._sh.setAttribute('aria-label', c.title || c.hash); else this._sh.removeAttribute('aria-label');
    this._infoEl.classList.toggle('scroll', c.info_layout === 'scroll');
    this._bds = null;
    if (this._h) this._info();
  }
  // Badges in der Kopfzeile: optional nur bei bestimmtem Zustand, Farbe aus den Farbrollen
  _badges() {
    const items = this._cfg.badges, h = this._h, bar = this._bdgEl;
    if (!this._bds || this._bds.length !== items.length) {
      bar.innerHTML = '';
      this._bds = items.map(o => {
        const d = document.createElement('div');
        d.className = 'bd'; d.tabIndex = 0; d.setAttribute('role', 'button');
        d.innerHTML = '<span class="ci"></span><span class="bn"></span><span class="bv"></span>';
        if (o.color) { const v = roleVars(o.color); d.style.setProperty('--c', v.c); d.style.setProperty('--cf', v.fg); }
        const open = () => moreInfo(this, o.entity);
        d.addEventListener('click', e => { e.stopPropagation(); open(); });
        d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        bar.appendChild(d);
        return d;
      });
    }
    items.forEach((o, i) => {
      const d = this._bds[i], s = h.states[o.entity];
      d.hidden = !s || (o.state != null && o.state !== '' && !list(o.state).includes(s.state));
      if (d.hidden) return;
      setIcon(d.querySelector('.ci'), iconOf(h, o, 'mdi:information-outline'));
      d.querySelector('.bn').textContent = o.name || '';
      d.querySelector('.bv').textContent = o.show_state === false ? '' : valueOf(h, s, o);
      d.title = `${nameOf(h, o)}: ${valueOf(h, s, o)}`;
    });
  }
  _info() {
    this._badges();
    renderChips(this, this._infoEl, this._cfg.info, this._h);
  }

  /* --- Raster (GridCard) --- */
  _handoff() { return this._mode === 'preview'; }
}
define('popup-card', NovaPopupCard, {name: 'Nova Pop-up Card', description: 'Pop-up mit beliebigen Karten, geöffnet per URL-Hash (z. B. #wohnzimmer) – vom Dock oder jeder Karte mit Navigations-Aktion.', documentationURL: docUrl('nova-pop-up-card')});

/* ---------- Editor ---------- */
const GENERAL = [
  {name: 'hash', required: true, selector: T},
  g2({name: 'title', selector: T}, {name: 'icon', selector: I}),
  ROLE('tint'),
  g2({name: 'width', selector: {number: {min: 320, max: 1600, step: 10, mode: 'box', unit_of_measurement: 'px'}}},
    {name: 'stack_below', selector: {number: {min: 0, max: 1200, step: 10, mode: 'box', unit_of_measurement: 'px'}}}),
];
const BADGE = [
  ENT, NAMEICON,
  g2({name: 'show_state', selector: {boolean: {}}}, ROLE('color')),
  {name: 'state', selector: T},
];
const HEAD = [sel('info_layout', [['wrap', 'Umbrechen'], ['scroll', 'Waagrecht scrollen']])];
const LABELS = {
  ...GRID_LABELS,
  hash: 'Hash (ohne #)', title: 'Titel', icon: 'Icon', tint: 'Farbton (leer = Nova-Glas)', color: 'Farbe', show_state: 'Zustand anzeigen', state: 'Nur anzeigen bei Zustand', width: 'Max. Breite (Desktop)', stack_below: 'Untereinander unter Breite',
  info_layout: 'Info-Leiste bei vielen Einträgen', entity: 'Entität', name: 'Eigener Name (optional)', decimals: 'Nachkommastellen',
  alert: 'Bei Achtung hervorheben', alert_state: 'Achtung bei Zustand', alert_color: 'Farbe', alert_above: 'Achtung über', alert_below: 'Achtung unter',
};
const HELPERS = {
  ...GRID_HELPERS,
  hash: 'Öffnet das Pop-up, wenn die Adresse auf #… endet. Beispiel: wohnzimmer → Navigations-Aktion auf #wohnzimmer.',
  title: 'Steht mit dem Icon oben im Pop-up und in den Auswahllisten von Dock und Raum-Karte.',
  stack_below: 'Ist das Pop-up schmaler als dieser Wert, stehen alle Karten untereinander (0 = nie).',
  state: 'Optional, z. B. on (Fenster offen). Mehrere mit Komma. Leer = immer anzeigen.',
  color: 'Leer = neutral.',
  alert_state: 'z. B. on oder open, mehrere mit Komma. Leer = an bzw. Problem (z. B. Fenster offen).',
};

class NovaPopupCardEditor extends GridEditor(NovaEditorBase) {
  static gridWhere = 'im Pop-up';
  static labels = LABELS;
  static helpers = HELPERS;
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}${GRID_ED_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap');
    this._gridReset();
    if (!this._init) { this._init = true; this._secs = new Set([this._config.hash ? 'sec.content' : 'sec.general']); }
    // Die Listen der Basisklasse setzen _open neu – offene Abschnitte merken wir uns deshalb selbst
    this._secs.forEach(k => this._open.add(k));
    w.append(this._secGeneral(), this._secHead(), this._secLayout(), this._secContent());
  }
  _sec(key, icon, label) {
    const [d, , b] = this._details(key, icon, label, []);
    d.addEventListener('toggle', () => { if (d.open) this._secs.add(key); else this._secs.delete(key); });
    return [d, b];
  }

  _secGeneral() {
    const [d, b] = this._sec('sec.general', 'mdi:cog-outline', 'Allgemein');
    const data = {...this._config};
    delete data.rows; delete data.info; delete data.badges;
    if (data.color && !data.tint) data.tint = data.color;
    const f = this._form(GENERAL, data, v => {
      const c = merge(this._config, names(GENERAL), v);
      delete c.color;
      if (v.hash != null) { const h = cleanHash(v.hash); if (h !== v.hash) f.data = {...v, hash: h}; if (h) c.hash = h; else delete c.hash; }
      this._emit(c);
    });
    b.append(f);
    if (!this._config.hash) b.append(this._hint('Ohne Hash lässt sich das Pop-up nicht öffnen.'));
    return d;
  }
  _secHead() {
    const [d, b] = this._sec('sec.header', 'mdi:information-outline', 'Kopfzeile & Info-Leiste');
    b.append(this._hint('Titel und Icon stehen unter „Allgemein“. Badges sitzen in der Kopfzeile, Info-Entitäten als Chips darunter. Antippen öffnet die Details.'));
    b.append(this._form(HEAD, {info_layout: DEF.info_layout, ...this._config}, v => {
      const c = merge(this._config, names(HEAD), v);
      if (c.info_layout === DEF.info_layout) delete c.info_layout;
      this._emit(c);
    }));
    b.append(Object.assign(document.createElement('h4'), {textContent: 'Badges'}));
    b.append(this._hint('Kleine Anzeigen rechts neben dem Titel. Auf schmalen Bildschirmen nur Icon und Zustand, bei Platzmangel waagrecht scrollbar.'));
    this._itemList(b, 'badges', BADGE, {item: 'Badge', icon: 'mdi:label-outline'}, 'Badge hinzufügen', it => ({show_state: true, ...it}));
    b.append(Object.assign(document.createElement('h4'), {textContent: 'Info-Leiste'}));
    this._itemList(b, 'info', INFO, {item: 'Info', icon: 'mdi:information-outline'}, 'Info-Entität hinzufügen');
    return d;
  }
  _secLayout() {
    const [d, b] = this._sec('sec.layout', 'mdi:view-grid-outline', 'Layout & Vorlage');
    this._layoutBody(b);
    return d;
  }
  _onTemplate() { this._secs.add('sec.content'); }
  _secContent() {
    const [d, b] = this._sec('sec.content', 'mdi:view-dashboard-edit-outline', 'Inhalt');
    this._contentBody(b);
    return d;
  }
}
define('popup-card-editor', NovaPopupCardEditor);
