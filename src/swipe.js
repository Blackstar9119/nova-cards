import {define, docUrl, tag, DEV} from './shared/define.js';
import {NOVA_VARS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {inPicker} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I} from './shared/editor-schema.js';
import {normRows, serRows, PREV, EDIT, GRID_CSS, GridCard} from './shared/card-grid.js';
import {GridEditor, GRID_ED_CSS, GRID_LABELS, GRID_HELPERS} from './shared/card-grid-editor.js';

/* ---------- Nova Swipe Card ----------
   Mehrere Seiten in einer Karte, zum Wischen nach links/rechts. Jede Seite ist ein Raster aus beliebigen Karten wie in der
   Pop-up Card (rows). Gewischt wird nativ (scroll-snap) – das läuft auch auf schwachen Geräten flüssig. Beginnt eine Berührung
   auf einem Schieberegler, ist das Wischen für diese Berührung aus. */
const DEF = {dots: true, reset_after: 0, fill: false, fit_screen: false, margin: 0, stack_below: 500};

const SCSS = `${NOVA_VARS}${GRID_CSS}
:host{display:block;box-sizing:border-box}
:host(.fill){height:100%}
.w{display:flex;flex-direction:column;gap:var(--nv-s3);min-height:0;color:var(--nv-fg);font-family:var(--nv-font)}
.w.fill{height:100%}
.sc{display:flex;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;overscroll-behavior-x:contain;scrollbar-width:none;
-webkit-overflow-scrolling:touch;flex:1 1 auto;min-height:0;border-radius:var(--nv-radius)}
.sc::-webkit-scrollbar{display:none}
.sc.lock{overflow-x:hidden}
.pg{flex:0 0 100%;min-width:0;scroll-snap-align:start;scroll-snap-stop:always;display:flex;flex-direction:column;gap:var(--nv-s6);box-sizing:border-box}
.fill .pg{overflow-y:auto;scrollbar-width:none}.fill .pg::-webkit-scrollbar{display:none}
.fill .pg:not(.stack)>.rw{flex:1 1 auto;min-height:0;align-items:stretch}
.fill .pg:not(.stack)>.rw>.cell{display:grid;min-height:0}
.rw{gap:var(--nova-swipe-gap,8px)}
.cell>*{min-width:0}
.prev .cell.empty{min-height:72px;border:2px dashed var(--nv-box-border);border-radius:var(--nv-r-lg);display:flex;align-items:center;justify-content:center;font-size:var(--nv-fs-5);opacity:.7}
.prev .cell.empty::after{content:'Leerer Platz'}
.dots{display:flex;justify-content:center;align-items:center;gap:var(--nv-s1);flex:none;height:14px}
.dots[hidden]{display:none}
.dot{border:none;background:none;padding:var(--nv-s2) 3px;margin:0;cursor:pointer;display:flex;-webkit-tap-highlight-color:transparent}
.dot i{display:block;width:6px;height:6px;border-radius:3px;background:var(--nv-fg);opacity:.35;transition:width var(--nv-d3),opacity var(--nv-d3),background-color var(--nv-d3)}
.dot.on i{width:16px;opacity:1;background:var(--nv-active)}
.dot:focus-visible{outline:none}.dot:focus-visible i{box-shadow:var(--nv-focus)}
@media (prefers-reduced-motion:reduce){.dot i{transition:none}}`;

// Seite = ein Raster (GridCard) mit eigenem Container; Karte, hass und Optionen kommen von der Swipe Card
class Page extends GridCard(Object) {
  static gridKind = 'swipe';
  constructor(card, rows) { super(); this._card = card; this._rows = rows; this._body = document.createElement('div'); this._body.className = 'pg'; }
  get _cfg() { return this._card._cfg; }
  get _h() { return this._card._h; }
  _handoff() { return this._card._prev; }
}

// Liegt unter dem Finger ein Schieberegler o. Ä.? Dann bekommt er die Geste, nicht das Wischen.
// HA-INTERN: ha-slider / ha-control-slider sind Regler der HA-Oberfläche; fehlen sie, greift die Prüfung auf touch-action.
const SLIDERS = new Set(['HA-SLIDER', 'HA-CONTROL-SLIDER', 'MWC-SLIDER', 'HA-SELECTOR-NUMBER']);
const grabsSwipe = path => {
  for (const n of path) {
    if (!(n instanceof Element)) continue;
    if (n.classList?.contains('sc')) return false;
    if ((n.tagName === 'INPUT' && n.type === 'range') || n.getAttribute('role') === 'slider' || SLIDERS.has(n.tagName)) return true;
    const ta = getComputedStyle(n).touchAction;
    if (ta === 'none' || ta === 'pan-y') return true;
  }
  return false;
};

class NovaSwipeCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('swipe-card-editor')); }
  static getStubConfig() { return {pages: [{rows: [{cells: [{card: null}]}]}, {rows: [{cells: [{card: null}]}]}]}; }
  constructor() {
    super();
    const r = this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${SCSS}</style><div class="w"><div class="sc"></div><div class="dots" role="tablist"></div></div>`;
    this._w = r.querySelector('.w'); this._sc = r.querySelector('.sc'); this._dots = r.querySelector('.dots');
    this._i = 0; this._pages = [];
    // Aktuelle Seite aus der Scrollposition (höchstens einmal pro Bild)
    this._sc.addEventListener('scroll', () => {
      this._poke();
      if (this._raf) return;
      this._raf = requestAnimationFrame(() => { this._raf = 0; const w = this._sc.clientWidth; if (w) this._mark(Math.round(this._sc.scrollLeft / w)); });
    }, {passive: true});
    const lock = e => {
      this._poke();
      if (!grabsSwipe(e.composedPath())) return;
      this._sc.classList.add('lock');
      const off = () => { this._sc.classList.remove('lock'); ['pointerup', 'pointercancel', 'touchend', 'touchcancel'].forEach(t => window.removeEventListener(t, off, true)); };
      ['pointerup', 'pointercancel', 'touchend', 'touchcancel'].forEach(t => window.addEventListener(t, off, true));
    };
    this._sc.addEventListener('pointerdown', lock, true);
    this._sc.addEventListener('touchstart', lock, {capture: true, passive: true});
    this._sc.addEventListener('keydown', () => this._poke());
    // Tippen in Eingabefeldern (z. B. Einkaufsliste): input-Events kommen auch dann an, wenn die Karte keydown abfängt
    this._sc.addEventListener('input', () => this._poke());
    this._sc.addEventListener('focusin', () => this._poke());
    // Größe ändert sich (Drehen, Seitenleiste) → auf der aktuellen Seite bleiben, Stapeln prüfen
    this._ro = new ResizeObserver(() => { this._fit(); this._pages.forEach(p => p._stack()); this.go(this._i, false); });
    this._onResize = () => this._fit();
    // Editor wählt eine Seite → Vorschau springt dorthin
    this._onGoto = e => { if (this._prev) this.go(e.detail?.page ?? 0, false); };
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (c.pages != null && !Array.isArray(c.pages)) throw new Error('pages muss eine Liste von Seiten sein');
    this._cfg = {...DEF, ...c};
    this._dirty = true;
    if (this.isConnected) this._render();
  }
  set hass(h) {
    this._h = h;
    if (!this._cfg) return;
    // Nur im Dev-Build: Fenstergröße einmal ins HA-Protokoll schreiben (zum Abstimmen auf Wand-Displays)
    if (DEV && !window.__novaVp && h.callService) {
      window.__novaVp = 1;
      setTimeout(() => h.callService('system_log', 'write', {message: `Nova Dev Swipe: Fenster ${innerWidth}×${innerHeight} px, DPR ${devicePixelRatio}, Karte ${Math.round(this.getBoundingClientRect().height)} px hoch`, level: 'warning', logger: 'nova_cards.dev'})?.catch?.(() => {}), 3000);
    }
    if (this._dirty && this.isConnected) this._render();
    this._pages.forEach(p => p._cells().forEach(el => p._setHass(el)));
  }
  getCardSize() { return Math.max(1, ...this._pages.map(p => 3 * (p._rows.length || 1))); }
  getGridOptions() { return {columns: 'full', rows: 'auto'}; }

  connectedCallback() {
    this._quiet = inPicker(this);
    this._detect();
    requestAnimationFrame(() => this._detect());
    this._ro.observe(this._sc);
    window.addEventListener('resize', this._onResize);
    window.addEventListener('nova-swipe-goto', this._onGoto);
    if (this._dirty && this._cfg) this._render();
    this._poke();
  }
  disconnectedCallback() {
    this._ro.disconnect();
    window.removeEventListener('resize', this._onResize);
    window.removeEventListener('nova-swipe-goto', this._onGoto);
    clearTimeout(this._rt); this._rt = null;
    cancelAnimationFrame(this._raf); this._raf = 0;
    if (this._prev) this._pages.forEach(p => p._handOffCells());
  }
  // Editor-Vorschau (Zellen übernehmen, Seite folgt dem Editor) bzw. Bearbeitungsmodus (leere Plätze zeigen)
  _detect() {
    let prev = false, edit = !!(this.preview || this.editMode);
    for (let n = this, i = 0; n && i < 80; i++) {
      if (PREV.has(n.tagName) || n.tagName?.includes('DIALOG')) { prev = true; break; }
      if (EDIT.has(n.tagName)) edit = true;
      n = n.parentElement || n.getRootNode?.().host;
    }
    this._prev = prev;
    this._w.classList.toggle('prev', prev || edit);
  }

  _render() {
    this._dirty = false;
    const c = this._cfg, list = Array.isArray(c.pages) && c.pages.length ? c.pages : [{rows: []}];
    const fill = !!c.fill || !!c.fit_screen;
    this.classList.toggle('fill', fill);
    this._w.classList.toggle('fill', fill);
    // Rand: Luft rundherum, z. B. in einer Panel-Ansicht, die Karten sonst bis an den Fensterrand zieht
    const m = Math.max(0, +c.margin || 0);
    if (m) this.style.padding = `${m}px`; else this.style.removeProperty('padding');
    this._fit();
    // Seiten mit unveränderter Konfiguration behalten – ihre Karten müssen dann nicht neu entstehen
    // Seiten-Objekte weiterverwenden: _grid() übernimmt Zellen mit unveränderter Karte, statt sie neu zu erzeugen
    const old = this._pages;
    if (this._prev) old.slice(list.length).forEach(p => p._handOffCells());
    this._pages = list.map((pg, i) => {
      const rows = normRows(pg || {}), p = old[i] || new Page(this, rows);
      if (p._built && JSON.stringify(p._rows) === JSON.stringify(rows)) return p;
      p._rows = rows; p._built = true;
      p._grid();
      return p;
    });
    this._pages.forEach((p, i) => {
      p._body.setAttribute('aria-label', list[i]?.name || `Seite ${i + 1}`);
      p._body.classList.toggle('eqh', !!c.equal_height);
    });
    this._sc.replaceChildren(...this._pages.map(p => p._body));
    // Punkte
    const n = this._pages.length;
    this._dots.hidden = c.dots === false || n < 2;
    this._dots.replaceChildren(...this._pages.map((_, i) => {
      const b = document.createElement('button');
      b.type = 'button'; b.className = 'dot'; b.setAttribute('role', 'tab');
      b.title = list[i]?.name || `Seite ${i + 1}`;
      b.innerHTML = '<i></i>';
      b.addEventListener('click', () => this.go(i));
      b.addEventListener('keydown', e => { if (e.key === 'ArrowRight') this.go(this._i + 1); if (e.key === 'ArrowLeft') this.go(this._i - 1); });
      return b;
    }));
    this._i = Math.min(this._i, n - 1);
    this._mark(this._i, true);
    requestAnimationFrame(() => { this._pages.forEach(p => p._stack()); this.go(this._i, false); });
  }
  // Bis zum unteren Bildschirmrand: Höhe = sichtbares Fenster minus Abstand oben, minus 8 px unten
  // (mit Rand steckt der Abstand unten schon im Rand).
  // Unabhängig davon, ob der Browser 100vh/100dvh richtig kennt (z. B. Silk auf dem Echo Show) – innerHeight stimmt immer.
  _fit() {
    if (!this._cfg?.fit_screen) { if (this._fitH) { this._fitH = 0; this.style.removeProperty('height'); } return; }
    const top = this.getBoundingClientRect().top + (window.scrollY || 0);
    const hgt = Math.max(160, Math.floor(window.innerHeight - Math.max(0, top) - (+this._cfg.margin > 0 ? 0 : 8)));
    if (hgt !== this._fitH) { this._fitH = hgt; this.style.height = `${hgt}px`; }
  }
  // Zu Seite i wischen (smooth = mit Animation, außer bei „Bewegung reduzieren“)
  go(i, smooth = true) {
    const n = this._pages.length;
    if (!n) return;
    i = Math.max(0, Math.min(n - 1, i));
    const w = this._sc.clientWidth;
    const calm = !smooth || matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (w) this._sc.scrollTo({left: i * w, behavior: calm ? 'auto' : 'smooth'});
    this._mark(i);
  }
  _mark(i, force) {
    if (i === this._i && !force) return;
    this._i = i;
    [...this._dots.children].forEach((d, k) => { d.classList.toggle('on', k === i); d.setAttribute('aria-selected', k === i); });
    this._pages.forEach((p, k) => p._body.setAttribute('aria-hidden', k !== i));
    this._poke();
  }
  // Nach X Sekunden ohne Bedienung zurück zur ersten Seite (ein einziger Zeitgeber, nicht in Vorschau/Kartenauswahl)
  _poke() {
    clearTimeout(this._rt); this._rt = null;
    const s = +this._cfg?.reset_after;
    if (!(s > 0) || this._i === 0 || this._quiet || this._prev || !this.isConnected) return;
    // Nicht zurückspringen, solange ein Feld auf der Seite den Fokus hat (Bildschirmtastatur offen)
    this._rt = setTimeout(() => { this._rt = null; if (this.matches(':focus-within')) this._poke(); else this.go(0); }, s * 1000);
  }
}
define('swipe-card', NovaSwipeCard, {name: 'Nova Swipe Card', description: 'Mehrere Seiten mit beliebigen Karten in einer Karte – zum Wischen, mit Seiten-Punkten. Ideal für kleine Displays.', documentationURL: docUrl('swipe')});

/* ---------- Editor ---------- */
const S_PAGE = [g2({name: 'name', selector: T}, {name: 'icon', selector: I})];
const S_SWIPE = [
  g2({name: 'dots', selector: {boolean: {}}}, {name: 'fill', selector: {boolean: {}}}),
  g2({name: 'fit_screen', selector: {boolean: {}}}, {name: 'margin', selector: {number: {min: 0, max: 48, step: 2, mode: 'box', unit_of_measurement: 'px'}}}),
  g2({name: 'reset_after', selector: {number: {min: 0, max: 600, step: 5, mode: 'box', unit_of_measurement: 's'}}},
    {name: 'stack_below', selector: {number: {min: 0, max: 1200, step: 10, mode: 'box', unit_of_measurement: 'px'}}}),
];
const LABELS = {
  ...GRID_LABELS,
  name: 'Name der Seite (optional)', icon: 'Icon (optional)', dots: 'Seiten-Punkte', fill: 'Ganze Höhe ausfüllen', fit_screen: 'Bis zum unteren Bildschirmrand', margin: 'Rand',
  reset_after: 'Zurück zu Seite 1 nach', stack_below: 'Untereinander unter Breite',
};
const HELPERS = {
  ...GRID_HELPERS,
  name: 'Nur für dich im Editor und als Hinweis an den Punkten.',
  fit_screen: 'Für Wand-Displays wie den Echo Show: Die Karte endet genau am unteren Rand des sichtbaren Fensters, auch wenn der Browser die Höhe falsch meldet. Schließt „Ganze Höhe ausfüllen“ ein.',
  margin: 'Luft rundherum. In einer Panel-Ansicht reichen 8 px, damit die Karten nicht am Fensterrand kleben.',
  fill: 'Für Wand-Displays: Die Karte ist so hoch wie ihr Platz, die Karten einer Seite teilen sich die Höhe.',
  reset_after: 'Sekunden ohne Bedienung, danach springt die Karte zur ersten Seite. 0 = aus.',
  stack_below: 'Ist die Karte schmaler als dieser Wert, stehen die Karten einer Seite untereinander (0 = nie).',
};
const PCSS = `
.pgs{display:flex;flex-direction:column;gap:8px}
.pgb{display:flex;align-items:center;gap:6px;padding:8px 8px 8px 2px;border-radius:12px;border:1px solid var(--divider-color,#444);background:var(--secondary-background-color);cursor:pointer;user-select:none;-webkit-user-select:none;position:relative;outline:none}
.pgb:focus-visible{box-shadow:0 0 0 2px var(--primary-color)}
.pgb.sel{border-color:var(--primary-color);box-shadow:0 0 0 1px var(--primary-color)}
.pgb.lift{z-index:5;box-shadow:0 8px 24px rgba(0,0,0,.35);opacity:.92;cursor:grabbing}
.pgb.before{box-shadow:inset 0 4px 0 var(--primary-color)}.pgb.after{box-shadow:inset 0 -4px 0 var(--primary-color)}
.pgb .num{flex:none;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;background:var(--primary-color);color:var(--text-primary-color,#fff)}
.pgb .pi{flex:none;color:var(--primary-color);display:flex}.pgb .pi:empty{display:none}`;
const strip = c => { Object.keys(DEF).forEach(k => { if (c[k] === DEF[k]) delete c[k]; }); return c; };

class NovaSwipeCardEditor extends GridEditor(NovaEditorBase) {
  static gridWhere = 'auf dieser Seite';
  static labels = LABELS;
  static helpers = HELPERS;
  static openSections = ['pages', 'content'];
  _list() { const p = this._config.pages; return Array.isArray(p) && p.length ? p.map(x => ({...(x || {})})) : [{rows: []}]; }
  _cur() { const n = this._list().length; this._page = Math.max(0, Math.min(n - 1, this._page || 0)); return this._page; }
  // Raster-Teil (GridEditor) arbeitet immer auf der gewählten Seite
  _rows() { return normRows(this._list()[this._cur()] || {}); }
  _emitRows(rows, keep) {
    if (keep !== undefined) {
      this._sel = null;
      rows.forEach((r, ri) => r.cells.forEach((x, ci) => { if (x === keep) this._sel = [ri, ci]; }));
    }
    const pages = this._list(), i = this._cur();
    pages[i] = {...pages[i], rows: serRows(rows)};
    delete pages[i].cards; delete pages[i].columns;
    this._emit({...this._config, pages});
  }
  _setPages(pages, sel) {
    if (sel != null) this._page = sel;
    this._sel = null;
    this._emit({...this._config, pages});
    this._rebuild();
  }
  _show(i) { this._page = i; this._sel = null; window.dispatchEvent(new CustomEvent('nova-swipe-goto', {detail: {page: i}})); this._rebuild(); }
  _onTemplate() { this._openSecs?.add('content'); }

  _build() {
    const r = this.shadowRoot, i = this._cur(), pages = this._list();
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}${GRID_ED_CSS}${PCSS}</style><div class="wrap"></div>`;
    this._gridReset();
    const data = {...DEF, ...this._config};
    // Vorschau auf die gewählte Seite stellen
    requestAnimationFrame(() => window.dispatchEvent(new CustomEvent('nova-swipe-goto', {detail: {page: i}})));
    const label = (p, k) => p.name || `Seite ${k + 1}`;
    r.querySelector('.wrap').append(
      this._section('pages', 'mdi:book-open-page-variant-outline', 'Seiten', b => this._pagesBody(b, pages, i)),
      this._section('layout', 'mdi:view-grid-outline', `Aufteilung: ${label(pages[i], i)}`, b => this._layoutBody(b)),
      this._section('content', 'mdi:view-dashboard-edit-outline', `Karten: ${label(pages[i], i)}`, b => {
        b.append(this._form(S_PAGE, pages[i], v => {
          const ps = this._list(), k = this._cur();
          ps[k] = merge(ps[k], names(S_PAGE), v);
          this._emit({...this._config, pages: ps});
        }));
        this._contentBody(b);
      }),
      this._section('swipe', 'mdi:gesture-swipe-horizontal', 'Wischen und Anzeige', b => b.append(this._form(S_SWIPE, data, v => this._emit(strip(merge(this._config, names(S_SWIPE), v)))))));
  }
  _pagesBody(b, pages, cur) {
    b.append(this._hint('Jede Seite ist ein eigenes Raster aus Karten. Antippen wählt die Seite zum Bearbeiten (die Vorschau springt mit), am Griff ziehen sortiert.'));
    const box = document.createElement('div');
    box.className = 'pgs';
    this._pgEls = pages.map((p, k) => {
      const e = document.createElement('div');
      e.className = `pgb${k === cur ? ' sel' : ''}`;
      e.tabIndex = 0; e.setAttribute('role', 'button');
      e.innerHTML = '<span class="drag"><ha-icon icon="mdi:drag"></ha-icon></span><span class="num"></span><span class="pi"></span><span class="bl"><b></b><small></small></span>';
      e.querySelector('.num').textContent = k + 1;
      if (p.icon) e.querySelector('.pi').innerHTML = `<ha-icon icon="${p.icon.replace(/"/g, '')}"></ha-icon>`;
      const cards = normRows(p).flatMap(r => r.cells).filter(x => x.card);
      e.querySelector('b').textContent = p.name || `Seite ${k + 1}`;
      e.querySelector('small').textContent = cards.length ? `${cards.length} ${cards.length === 1 ? 'Karte' : 'Karten'}` : 'Noch leer';
      const mv = d => { const ps = this._list(); ps.splice(k + d, 0, ...ps.splice(k, 1)); this._setPages(ps, cur === k ? k + d : cur === k + d ? k : cur); };
      e.append(
        this._btn('mdi:plus-box-outline', 'Karte hinzufügen', () => this._addCard(k)),
        this._btn('mdi:arrow-up', 'Nach vorne', () => mv(-1), k === 0),
        this._btn('mdi:arrow-down', 'Nach hinten', () => mv(1), k === pages.length - 1),
        this._btn('mdi:content-copy', 'Seite duplizieren', () => { const ps = this._list(); ps.splice(k + 1, 0, JSON.parse(JSON.stringify(ps[k]))); this._setPages(ps, k + 1); }),
        this._btn('mdi:delete-outline', 'Seite löschen', () => { const ps = this._list(); ps.splice(k, 1); this._setPages(ps.length ? ps : [{rows: []}], Math.min(cur, ps.length - 1)); }, pages.length < 2));
      const pick = () => { if (Date.now() - (this._pgDragged || 0) < 200) return; this._openSecs?.add('content'); this._show(k); };
      e.addEventListener('click', ev => { ev.preventDefault(); pick(); });
      e.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); pick(); } });
      this._pgDrag(e, e.querySelector('.drag'), k);
      box.append(e);
      return e;
    });
    b.append(box, this._add('Seite hinzufügen', () => { const ps = this._list(); ps.push({rows: []}); this._openSecs?.add('content'); this._setPages(ps, ps.length - 1); }));
  }
  // „Karte hinzufügen“ an einer Seite: Kartenauswahl öffnen, die Karte kommt als neue Zeile unten auf die Seite
  _addCard(k) {
    this._page = k; this._sel = null;
    this._openSecs?.add('content');
    window.dispatchEvent(new CustomEvent('nova-swipe-goto', {detail: {page: k}}));
    const put = card => { const rs = this._rows(), x = {width: 'auto', card: card ?? null}; rs.push({cells: [x]}); this._picking = !card; this._yaml = false; this._emitRows(rs, x); this._rebuild(); };
    if (!this._openPicker(c => put(c))) put();
  }
  // Seiten per Ziehen sortieren (Maus und Touch, über Pointer Events)
  _pgDrag(e, grip, k) {
    e.addEventListener('pointerdown', ev => {
      if (ev.button !== 0) return;
      if (ev.pointerType !== 'mouse' && !ev.composedPath().includes(grip)) return;
      const y0 = ev.clientY, x0 = ev.clientX;
      let on = false, to = null;
      const move = m => {
        if (!on) { if (Math.hypot(m.clientX - x0, m.clientY - y0) < 6) return; on = true; e.classList.add('lift'); }
        m.preventDefault();
        e.style.transform = `translateY(${m.clientY - y0}px)`;
        this._pgEls.forEach(n => n.classList.remove('before', 'after'));
        to = null;
        this._pgEls.forEach((n, j) => {
          if (n === e) return;
          const rc = n.getBoundingClientRect();
          if (m.clientY >= rc.top && m.clientY <= rc.bottom) { const after = m.clientY > rc.top + rc.height / 2; n.classList.add(after ? 'after' : 'before'); to = after ? j + 1 : j; }
        });
      };
      const stop = drop => {
        window.removeEventListener('pointermove', move);
        window.removeEventListener('pointerup', up);
        window.removeEventListener('pointercancel', cancel);
        if (!on) return;
        this._pgDragged = Date.now();
        if (!drop || to == null || to === k || to === k + 1) return this._rebuild();
        const ps = this._list(), cur = this._cur(), x = ps[k], selPage = ps[cur];
        ps.splice(k, 1);
        ps.splice(to > k ? to - 1 : to, 0, x);
        this._setPages(ps, ps.indexOf(selPage));
      };
      const up = () => stop(true), cancel = () => stop(false);
      window.addEventListener('pointermove', move, {passive: false});
      window.addEventListener('pointerup', up);
      window.addEventListener('pointercancel', cancel);
    });
  }
}
define('swipe-card-editor', NovaSwipeCardEditor);
