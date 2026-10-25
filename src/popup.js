import {define, docUrl, tag} from './shared/define.js';
import {esc, setIcon, list} from './shared/utils.js';
import {iconOf, nameOf, valueOf, alertHit} from './shared/state.js';
import {moreInfo} from './shared/actions.js';
import {NOVA_VARS, roleVars, EDITOR_CSS, EDITOR_ICON_CSS, EDITOR_LIST_CSS} from './shared/styles.js';
import {hassChanged, entityIds} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, ENT, NUM, sel, ROLE, NAMEICON} from './shared/editor-schema.js';
import {register, unregister, curHash, cleanHash, clearHash, cameByNav, lockScroll, hasPopup} from './shared/popup-hub.js';

/* ---------- Datenmodell ----------
   rows: [{cells: [{width: '1/2', card: {...}}, {card: null}]}]
   Jede Zeile ist eine Reihe von Spalten nebeneinander, jede Spalte enthält genau eine Karte (null = leerer Platz).
   width = Anteil an der Zeilenbreite (1/4 … voll), ohne Angabe teilen sich die Spalten den restlichen Platz. */
const DEF = {width: 1180, stack_below: 500, info_layout: 'wrap'};
export const WIDTHS = [['auto', 'Auto'], ['1/4', '1/4'], ['1/3', '1/3'], ['1/2', '1/2'], ['2/3', '2/3'], ['3/4', '3/4'], ['1', 'Voll']];
const FR = {'1/4': 1 / 4, '1/3': 1 / 3, '1/2': 1 / 2, '2/3': 2 / 3, '3/4': 3 / 4, '1': 1};
// Ältere Konfigurationen mit span/columns: nächstliegenden Anteil nehmen
const fracOf = v => Object.keys(FR).reduce((a, k) => Math.abs(FR[k] - v) < Math.abs(FR[a] - v) ? k : a, '1');
const toCell = (x, cols) => {
  if (!x || typeof x !== 'object') return {width: 'auto', card: null};
  if (!('card' in x || 'span' in x || 'width' in x)) return {width: 'auto', card: x};
  const old = +x.span > 1 ? fracOf(+x.span / cols) : 'auto';
  const width = FR[x.width] ? String(x.width) : old === '1' ? 'auto' : old;
  return {width, card: x.card && typeof x.card === 'object' ? x.card : null};
};
export const normRows = c => {
  const cols = Math.max(1, +c.columns || 2);
  if (Array.isArray(c.rows)) return c.rows.map(r => ({cells: (Array.isArray(r) ? r : r?.cells || []).map(x => toCell(x, cols))})).filter(r => r.cells.length);
  if (Array.isArray(c.cards)) return c.cards.map(k => ({cells: [{width: 'auto', card: k}]}));
  return [];
};
const serRows = rows => rows.filter(r => r.cells.length).map(r => ({cells: r.cells.map(x => FR[x.width] ? {width: x.width, card: x.card ?? null} : {card: x.card ?? null})}));
// Spaltenbreite als flex-Angabe (gap = Abstand zwischen den Spalten in px)
export const flexOf = (w, gap) => FR[w] ? `0 0 calc(${FR[w]} * (100% + ${gap}px) - ${gap + 0.1}px)` : '1 1 0';

// HA-INTERN: window.loadCardHelpers() → createCardElement. Fehlt es, zeigt jede Zelle einen Fehler statt zu crashen.
let helpersP;
const helpers = () => helpersP ||= Promise.resolve()
  .then(() => { if (typeof window.loadCardHelpers !== 'function') throw new Error('loadCardHelpers nicht verfügbar'); return window.loadCardHelpers(); })
  .catch(e => { helpersP = null; throw e; });
const wait = ms => new Promise(r => setTimeout(r, ms));
// HA-INTERN: hui-card-picker und hui-card-element-editor lädt HA erst bei Bedarf nach. Der Editor der Stapel-Karte
// (vertical-stack) bringt beide mit – deshalb einmal dessen Editor anfordern und kurz auf die Elemente warten.
let haEdP;
const HA_ED = ['hui-card-picker', 'hui-card-element-editor'];
const loadHaEditors = () => HA_ED.every(n => customElements.get(n)) ? Promise.resolve() : (haEdP ||= (async () => {
  try {
    (await helpers()).createCardElement({type: 'vertical-stack', cards: []});
    await Promise.race([customElements.whenDefined('hui-vertical-stack-card'), wait(3000)]);
    await customElements.get('hui-vertical-stack-card')?.getConfigElement?.();
  } catch (e) { console.warn('[nova-cards] Kartenauswahl von HA nicht vorgeladen', e); }
  await Promise.race([Promise.all(HA_ED.map(n => customElements.whenDefined(n))), wait(3000)]);
})());

/* ---------- Nova Pop-up Card ---------- */
const PCSS = `${NOVA_VARS}
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
.info{display:flex;flex-wrap:wrap;gap:7px;padding:0 14px 12px;flex:none}
.info.scroll{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.info.scroll::-webkit-scrollbar{display:none}
.info[hidden]{display:none}
.chip{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;background:var(--nv-chip);border:1px solid var(--nv-box-border);font-size:12.5px;white-space:nowrap;cursor:pointer;flex:none;outline:none;transition:all .2s}
.chip ha-icon{--mdc-icon-size:16px}.chip img{width:16px;height:16px}.chip:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}.chip:active{transform:scale(.95)}
.chip .cn:empty{display:none}.chip .cn:not(:empty)::after{content:' ·'}
.chip.al{background:var(--c);color:var(--cf);border-color:transparent;box-shadow:0 0 14px color-mix(in srgb,var(--c) 45%,transparent)}
.body{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;box-sizing:border-box;
padding:0 14px calc(16px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:12px}
.rw{display:flex;flex-wrap:wrap;gap:12px;flex:none}
.rw>.cell.auto{min-width:min(100%,140px)}
.body.stack .rw>.cell{flex:1 1 100%!important}
.cell{min-width:0}
.cell.empty{min-height:0}
.pop.inline .cell.empty{min-height:72px;border:2px dashed var(--nv-box-border);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:12.5px;opacity:.7}
.pop.inline .cell.empty::after{content:'Leerer Platz'}
.err{display:flex;gap:8px;align-items:flex-start;padding:12px 14px;border-radius:20px;font-size:13px;
background:color-mix(in srgb,var(--nv-error) 18%,transparent);border:1px solid color-mix(in srgb,var(--nv-error) 50%,transparent)}
.err ha-icon{color:var(--nv-error);flex:none}
.hint{font-size:13px;opacity:.7;padding:8px 2px}
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

// Vorschau im Karteneditor: HA erzeugt die Pop-up Card bei jeder Änderung neu. Die fertigen Zellen der alten Karte
// wandern kurz hierher und werden von der neuen übernommen, statt jede eingebettete Karte neu zu erzeugen.
const HANDOFF = new Map();
let handoffT;
const handOff = pool => {
  pool.forEach((ws, k) => (HANDOFF.get(k) || HANDOFF.set(k, []).get(k)).push(...ws));
  clearTimeout(handoffT);
  handoffT = setTimeout(() => HANDOFF.clear(), 3000);
};

// Wo liegt die Karte? Kartenauswahl/Editor-Vorschau → Pop-up direkt anzeigen, Bearbeitungsmodus → Platzhalter
// HA-INTERN: Elementnamen der HA-Oberfläche, nur zum Erkennen – fehlen sie, gilt die Karte als normal eingebunden
const PREV = new Set(['HUI-CARD-PREVIEW', 'HUI-DIALOG-EDIT-CARD', 'HUI-DIALOG-CREATE-CARD', 'HUI-CARD-ELEMENT-EDITOR', 'HUI-CARD-PICKER']);
const EDIT = new Set(['HUI-CARD-OPTIONS', 'HUI-CARD-EDIT-MODE']);

class NovaPopupCard extends HTMLElement {
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
    if (this._mode === 'preview' && this._pool) { handOff(this._pool); this._pool = null; this._dirty = true; }
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
    this._chips = null; this._bds = null;
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
    const items = this._cfg.info, h = this._h, bar = this._infoEl;
    bar.hidden = !items.length;
    if (!this._chips || this._chips.length !== items.length) {
      bar.innerHTML = '';
      this._chips = items.map(o => {
        const d = document.createElement('div');
        d.className = 'chip'; d.tabIndex = 0; d.setAttribute('role', 'button');
        d.innerHTML = '<span class="ci"></span><span class="cn"></span><span class="cv"></span>';
        const open = () => o.entity && moreInfo(this, o.entity);
        d.addEventListener('click', open);
        d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
        bar.appendChild(d);
        return d;
      });
    }
    items.forEach((o, i) => {
      const d = this._chips[i], s = h.states[o.entity];
      setIcon(d.querySelector('.ci'), iconOf(h, o, 'mdi:information-outline'));
      d.querySelector('.cn').textContent = o.name || '';
      d.querySelector('.cv').textContent = s ? valueOf(h, s, o) : 'Nicht gefunden';
      d.title = nameOf(h, o);
      const al = !!o.alert && alertHit({state: o.alert_state, above: o.alert_above, below: o.alert_below}, s);
      d.classList.toggle('al', al);
      if (al) { const v = roleVars(o.alert_color || 'accent-2'); d.style.setProperty('--c', v.c); d.style.setProperty('--cf', v.fg); }
    });
  }

  /* --- Raster --- */
  _cells() { return [...this._body.querySelectorAll(':scope>.cell>*')].filter(el => !el.classList.contains('err')); }
  _setHass(el) { if (!this._h) return; try { el.hass = this._h; } catch (e) { console.warn('[nova-cards] Karte im Pop-up:', e); } }
  _stack() { this._body.classList.toggle('stack', this._body.clientWidth > 0 && this._body.clientWidth < (+this._cfg?.stack_below || 0)); }
  _grid() {
    this._dirty = false;
    // Zellen mit unveränderter Karte weiterverwenden – die Vorschau flackert dann nicht bei jeder Eingabe
    const old = this._pool || new Map(), pool = new Map(), list = [];
    this._rows.forEach(row => { const rw = document.createElement('div'); rw.className = 'rw'; list.push(rw); row.cells.forEach(cell => {
      const key = JSON.stringify(cell.card);
      let w = old.get(key)?.shift() || (this._mode === 'preview' ? HANDOFF.get(key)?.shift() : null);
      if (!w) {
        w = document.createElement('div');
        w.className = 'cell';
        w._card = cell.card;
        w._owner = this;
        if (cell.card) { this._mount(w, cell.card); w.addEventListener('ll-rebuild', e => { e.stopPropagation(); w._owner._mount(w, w._card); }); }
        else w.classList.add('empty');
      } else if (w._owner !== this) { w._owner = this; w.querySelectorAll(':scope>*').forEach(el => this._setHass(el)); }
      w.style.flex = flexOf(cell.width, 12);
      w.classList.toggle('auto', !FR[cell.width]);
      (pool.get(key) || pool.set(key, []).get(key)).push(w);
      rw.append(w);
    }); });
    this._pool = pool;
    if (!list.length) {
      const p = document.createElement('div');
      p.className = 'hint';
      p.textContent = 'Noch keine Karten – im Editor eine Vorlage wählen und Karten einfügen.';
      list.push(p);
    }
    this._body.replaceChildren(...list);
    this._stack();
  }
  // Fehler einer Karte bleiben in ihrer Zelle
  async _mount(w, cfg) {
    const id = w._id = (w._id || 0) + 1;
    let el;
    try {
      if (!cfg.type) throw new Error('Kartentyp (type) fehlt');
      el = (await helpers()).createCardElement(cfg);
    } catch (e) {
      el = document.createElement('div');
      el.className = 'err';
      el.innerHTML = `<ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>Karte konnte nicht geladen werden: ${esc(e?.message || e)}</span>`;
    }
    if (id !== w._id) return;
    this._setHass(el);
    w.replaceChildren(el);
  }
}
define('popup-card', NovaPopupCard, {name: 'Nova Pop-up Card', description: 'Pop-up mit beliebigen Karten, geöffnet per URL-Hash (z. B. #wohnzimmer) – vom Dock oder jeder Karte mit Navigations-Aktion.', documentationURL: docUrl('nova-pop-up-card')});

/* ---------- Editor ---------- */
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
const INFO = [
  ENT, NAMEICON,
  g2({name: 'decimals', selector: {number: {min: 0, max: 4, mode: 'box'}}}, {name: 'alert', selector: {boolean: {}}}),
  g2({name: 'alert_state', selector: T}, ROLE('alert_color')),
  g2(NUM('alert_above'), NUM('alert_below')),
];
const LABELS = {
  hash: 'Hash (ohne #)', title: 'Titel', icon: 'Icon', tint: 'Farbton (leer = Nova-Glas)', color: 'Farbe', show_state: 'Zustand anzeigen', state: 'Nur anzeigen bei Zustand', width: 'Max. Breite (Desktop)', stack_below: 'Untereinander unter Breite',
  info_layout: 'Info-Leiste bei vielen Einträgen', entity: 'Entität', name: 'Eigener Name (optional)', decimals: 'Nachkommastellen',
  alert: 'Bei Achtung hervorheben', alert_state: 'Achtung bei Zustand', alert_color: 'Farbe', alert_above: 'Achtung über', alert_below: 'Achtung unter',
};
const HELPERS = {
  hash: 'Öffnet das Pop-up, wenn die Adresse auf #… endet. Beispiel: wohnzimmer → Navigations-Aktion auf #wohnzimmer.',
  title: 'Steht mit dem Icon oben im Pop-up und in den Auswahllisten von Dock und Raum-Karte.',
  stack_below: 'Ist das Pop-up schmaler als dieser Wert, stehen alle Karten untereinander (0 = nie).',
  state: 'Optional, z. B. on (Fenster offen). Mehrere mit Komma. Leer = immer anzeigen.',
  color: 'Leer = neutral.',
  alert_state: 'z. B. on oder open, mehrere mit Komma. Leer = an bzw. Problem (z. B. Fenster offen).',
};

const ED_CSS = `
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

class NovaPopupCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static helpers = HELPERS;
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

  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}${ED_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap');
    this._sub = this._pick = null; this._blocks = {};
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
    return d;
  }
  _template(t) {
    const left = this._rows().flatMap(r => r.cells).filter(x => x.card);
    const rows = t.rows.map(row => ({cells: row.map(width => ({width, card: left.shift()?.card ?? null}))}));
    left.forEach(x => rows.push({cells: [{width: 'auto', card: x.card}]}));
    this._sel = null;
    this._secs.add('sec.content');
    this._emitRows(rows);
    this._rebuild();
  }

  /* --- Inhalt: Miniatur des Rasters --- */
  _secContent() {
    const [d, b] = this._sec('sec.content', 'mdi:view-dashboard-edit-outline', 'Inhalt');
    const rows = this._rows();
    if (this._sel && !rows[this._sel[0]]?.cells[this._sel[1]]) this._sel = null;
    b.append(this._hint('So sieht das Raster im Pop-up aus. Spalten einer Zeile stehen nebeneinander. Antippen zum Bearbeiten, am Griff ziehen zum Verschieben (am PC geht auch der ganze Block).'));
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
    return d;
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
}
define('popup-card-editor', NovaPopupCardEditor);
