import {define, docUrl, tag} from './shared/define.js';
import {esc, isImg} from './shared/utils.js';
import {isOn} from './shared/state.js';
import {moreInfo, hassAction, navigate} from './shared/actions.js';
import {DOCK_VARS, EDITOR_CSS, EDITOR_ICON_CSS} from './shared/styles.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {cleanHash, curHash, openPopup, closePopup, hasPopup, findPopup, dashPopups} from './shared/popup-hub.js';

// Wie viele Mitglieder einer Gruppe sind an (ohne ex)
const countOn = (h, group, ex) => ((h.states[group]?.attributes.entity_id) || []).filter(id => !(ex || []).includes(id) && isOn(h.states[id])).length;

/* ---------- Popup mit beliebigen Karten ---------- */
const PCSS = `
:host{position:fixed;inset:0;z-index:6;display:flex;align-items:center;justify-content:center;background:rgba(8,12,22,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:fi .2s}
.root{width:min(var(--nova-popup-width,1180px),96vw);max-height:84vh;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;box-sizing:border-box;padding:14px;border-radius:28px;
background:linear-gradient(160deg,rgba(92,110,148,.8),rgba(22,27,42,.9));border:1px solid var(--nv-border);box-shadow:0 20px 60px rgba(0,0,0,.45);color:var(--nv-fg);font-family:var(--ha-font-family-body,Roboto,sans-serif);animation:up .28s cubic-bezier(.2,.8,.2,1)}
.hd{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;margin-bottom:14px;padding:6px 6px 6px 14px;border-radius:999px;background:rgba(60,72,100,.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
.tt{flex:1;min-width:0;font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.x{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.14);cursor:pointer;flex:none}
ha-icon{--mdc-icon-size:20px;display:flex}
.body{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--nova-popup-min-col,300px),1fr));gap:12px;align-items:start}
.body.one{grid-template-columns:1fr}
.empty{opacity:.6;font-size:13px;padding:8px}
@media(max-width:600px){:host{align-items:flex-end}.root{width:100vw;max-height:86vh;border-radius:28px 28px 0 0;padding:12px 12px calc(90px + env(safe-area-inset-bottom))}.body{grid-template-columns:1fr}}
@keyframes up{from{transform:translateY(40px);opacity:0}}@keyframes fi{from{opacity:0}}`;

class NovaDockPopup extends HTMLElement {
  constructor() {
    super();
    const r = this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${DOCK_VARS}${PCSS}</style><div class="root"><div class="hd"><ha-icon class="hi"></ha-icon><span class="tt"></span><div class="x" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></div></div><div class="body"></div></div>`;
    this._body = r.querySelector('.body');
    this._cards = [];
    r.querySelector('.x').addEventListener('click', () => this.onclose?.());
    this.addEventListener('click', e => { if (e.composedPath()[0] === this) this.onclose?.(); });
  }
  set cfg(c) {
    this._cfg = c;
    const r = this.shadowRoot;
    r.querySelector('.tt').textContent = c.title || '';
    r.querySelector('.hi').setAttribute('icon', c.icon || 'mdi:dots-horizontal');
    this._body.classList.toggle('one', (c.cards || []).length === 1);
    this._load();
  }
  async _load() {
    const helpers = await window.loadCardHelpers();
    this._body.innerHTML = '';
    this._cards = (this._cfg.cards || []).map(cc => {
      const el = helpers.createCardElement(cc);
      if (this._h) el.hass = this._h;
      this._body.appendChild(el);
      return el;
    });
    if (!this._cards.length) this._body.innerHTML = '<div class="empty">Noch keine Karten in diesem Popup – im Editor unter „Popup-Karten“ eintragen.</div>';
  }
  set hass(h) { this._h = h; this._cards.forEach(c => { c.hass = h; }); }
}
define('dock-popup', NovaDockPopup);

/* ---------- Dock ---------- */
const DCSS = `
:host{display:block;height:var(--nova-dock-space,64px)}
.dock.inline{max-width:100%}
ha-icon{--mdc-icon-size:22px;display:flex}
.dock{position:fixed;left:50%;transform:translateX(-50%);display:flex;gap:8px;padding:8px;border-radius:999px;background:var(--nv-bg);
backdrop-filter:blur(var(--nv-blur)) saturate(160%);-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(160%);border:1px solid var(--nv-border);
box-shadow:0 12px 36px rgba(0,0,0,.4);z-index:7;max-width:calc(100vw - 24px);overflow-x:auto;scrollbar-width:none;box-sizing:border-box}
.dock.bottom{bottom:calc(14px + env(safe-area-inset-bottom))}.dock.top{top:14px}
.dock::-webkit-scrollbar{display:none}
.dock.inline{position:static;transform:none;margin:0 auto;width:max-content}
.d{width:var(--sz);height:var(--sz);border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:var(--nv-fg);cursor:pointer;position:relative;transition:all .2s;-webkit-tap-highlight-color:transparent;outline:none}
.d:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
.d:active{transform:scale(.9)}
.d.act{background:var(--nv-active);box-shadow:0 0 16px color-mix(in srgb,var(--nv-active) 60%,transparent)}
.d.here{outline:2px solid rgba(255,255,255,.5)}
.d img{width:60%;height:60%;object-fit:contain}
.dot{position:absolute;top:14%;right:14%;width:8px;height:8px;border-radius:50%;background:var(--nv-accent);box-shadow:0 0 6px var(--nv-accent);display:none}
.d.bd .dot{display:block}
.num{position:absolute;top:2px;right:0;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:8px;background:var(--nv-accent);color:#3a2a00;font:700 10px/16px var(--ha-font-family-body,Roboto,sans-serif);text-align:center;display:none}
.d.bn .num{display:block}.d.bn .dot{display:none}
.empty{color:var(--nv-fg);opacity:.7;font-size:13px;padding:6px 12px}
@media(max-width:600px){.d{width:calc(var(--sz) * .875);height:calc(var(--sz) * .875)}.dock{gap:5px;padding:6px}}`;

const SRC = {};
const findDock = o => {
  if (!o || typeof o !== 'object') return null;
  if ((o.type === `custom:${tag('dock-card')}` || o.type === 'custom:nz-dock-card') && Array.isArray(o.items) && o.items.length) return o;
  for (const v of Object.values(o)) { const r = findDock(v); if (r) return r; }
  return null;
};

class NovaDockCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('dock-card-editor')); }
  static getStubConfig() {
    return {items: [
      {icon: 'mdi:home', label: 'Start', tap_action: {action: 'navigate', navigation_path: location.pathname}},
      {icon: 'mdi:lightbulb-group', label: 'Licht', popup_title: 'Licht', cards: [{type: 'markdown', content: 'Hier deine Licht-Karten eintragen'}]},
    ]};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (!c.items && !c.source) throw new Error('items oder source angeben');
    this._cfg = {position: 'bottom', button_size: 48, ...c};
    this._close();
    this._items = null; this._btns = null; this._built = false; this._cur = -1;
    if (this._h) this.hass = this._h;
  }
  set hass(h) {
    this._h = h;
    if (!this._cfg) return;
    if (!this._items) {
      if (this._cfg.items) this._items = this._cfg.items;
      else { this._loadSource(); return; }
    }
    if (!this._built) this._build();
    if (this._pop) this._pop.hass = h;
    if (this._hp) this._hp.hass = h;
    this._update();
  }
  async _loadSource() {
    if (this._loading) return;
    this._loading = true;
    const k = this._cfg.source;
    SRC[k] = SRC[k] || this._h.callWS({type: 'lovelace/config', url_path: k === 'default' ? null : k}).then(findDock).catch(() => null);
    const d = await SRC[k];
    this._loading = false;
    this._items = d ? d.items : [];
    this._srcCfg = d || {};
    this.hass = this._h;
  }
  connectedCallback() {
    this._applyInline();
    requestAnimationFrame(() => this._applyInline());
    this._loc = () => this._update();
    window.addEventListener('location-changed', this._loc);
    window.addEventListener('popstate', this._loc);
    window.addEventListener('hashchange', this._loc);
  }
  disconnectedCallback() {
    window.removeEventListener('location-changed', this._loc);
    window.removeEventListener('popstate', this._loc);
    window.removeEventListener('hashchange', this._loc);
    this._close();
    if (this._hp) { this._hp.remove(); this._hp = null; }
  }
  getCardSize() { return 1; }
  getGridOptions() { return {columns: 'full', rows: 1}; }
  get _inline() {
    if (this.preview || this.editMode || this.hasAttribute('preview') || this._cfg?.inline) return true;
    // In Kartenauswahl & Editor-Vorschau nicht schweben, sondern als normale Leiste zeigen
    const PREV = new Set(['HUI-CARD-PICKER', 'HUI-CARD-PREVIEW', 'HUI-DIALOG-EDIT-CARD', 'HUI-DIALOG-CREATE-CARD', 'HUI-CARD-ELEMENT-EDITOR']);
    let n = this;
    for (let i = 0; i < 40 && n; i++) {
      if (PREV.has(n.tagName)) return true;
      n = n.parentElement || n.getRootNode?.().host;
    }
    return false;
  }
  _applyInline() { this.shadowRoot?.querySelector('.dock')?.classList.toggle('inline', this._inline); }

  _build() {
    this._built = true;
    const c = this._cfg, r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${DOCK_VARS}${DCSS}</style><div class="dock ${esc(c.position)} ${this._inline ? 'inline' : ''}" style="--sz:${+c.button_size || 48}px"></div>`;
    const dock = r.querySelector('.dock');
    if (!this._items.length) { dock.innerHTML = `<span class="empty">${c.source ? `Kein Dock in „${esc(c.source)}“ gefunden` : 'Noch keine Einträge'}</span>`; this._btns = []; return; }
    this._btns = this._items.map((it, i) => {
      const d = document.createElement('div');
      d.className = 'd'; d.tabIndex = 0; d.setAttribute('role', 'button');
      d.title = it.label || it.popup_title || '';
      const ic = it.icon || 'mdi:circle-outline';
      d.innerHTML = `${isImg(ic) ? `<img src="${esc(ic)}" alt="">` : `<ha-icon icon="${esc(ic)}"></ha-icon>`}<span class="dot"></span><span class="num"></span>`;
      d.addEventListener('click', () => this._tap(i));
      d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._tap(i); } });
      if (it.hold_action) {
        let t; d.addEventListener('pointerdown', () => { t = setTimeout(() => { d._held = true; hassAction(this, {entity: it.entity, hold_action: it.hold_action}, 'hold'); }, 500); });
        ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => d.addEventListener(ev, () => clearTimeout(t)));
      }
      dock.appendChild(d);
      return d;
    });
  }

  _path(it) { return it.tap_action?.action === 'navigate' ? it.tap_action.navigation_path : it.navigation_path; }

  _update() {
    if (!this._btns || !this._h) return;
    const h = this._h;
    this._items.forEach((it, i) => {
      const d = this._btns[i]; if (!d) return;
      const p = this._path(it);
      d.classList.toggle('act', i === this._cur || (!!it.popup_hash && curHash() === cleanHash(it.popup_hash)));
      d.classList.toggle('here', !!p && location.pathname === p);
      let n = 0, dot = false;
      if (it.badge_count_of) n = countOn(h, it.badge_count_of, it.badge_exclude);
      else if (it.badge) dot = isOn(h.states[it.badge]);
      const showNum = n > 0 && it.badge_show_number;
      d.classList.toggle('bd', dot || (n > 0 && !showNum));
      d.classList.toggle('bn', showNum);
      if (showNum) d.querySelector('.num').textContent = n > 99 ? '99+' : n;
    });
  }

  _tap(i) {
    const it = this._items[i];
    if (this._btns[i]?._held) { this._btns[i]._held = false; return; }
    if (it.popup_hash) { const h = cleanHash(it.popup_hash); this._close(); return curHash() === h ? closePopup(h) : this._openHash(h); }
    if (this._cur === i) return this._close();
    this._close();
    if (Array.isArray(it.cards)) return this._openCards(i, it);
    if (typeof it.popup === 'string' && customElements.get('nz-popup')) return this._openLegacy(i, it);
    if (it.tap_action && it.tap_action.action !== 'none') return hassAction(this, {entity: it.entity, tap_action: it.tap_action}, 'tap');
    if (it.navigation_path) return navigate(it.navigation_path);
    if (it.entity) moreInfo(this, it.entity);
  }

  _openCards(i, it) {
    const p = document.createElement(tag('dock-popup'));
    p.onclose = () => this._close();
    p.cfg = {title: it.popup_title || it.label || '', icon: it.icon, cards: it.cards};
    p.hass = this._h;
    this.shadowRoot.appendChild(p); // im eigenen Shadow-DOM, damit more-info & Aktionen der Karten bei HA ankommen
    this._opened(i, p);
  }

  // Nova Pop-up Card per Hash öffnen. Liegt sie nicht in der aktuellen Ansicht, holt das Dock ihre
  // Konfiguration aus dem Dashboard und zeigt sie selbst an – so geht es in jeder Ansicht.
  async _openHash(h) {
    openPopup(h);
    if (hasPopup(h) || !this._h) return;
    const cfg = await findPopup(this._h, h, this._cfg.source);
    if (!cfg || curHash() !== h || hasPopup(h) || !customElements.get(tag('popup-card'))) return;
    const key = JSON.stringify(cfg);
    if (this._hp?._cfgKey !== key) {
      this._hp?.remove();
      const p = document.createElement(tag('popup-card'));
      p._fallback = true; p._cfgKey = key;
      p.setConfig(cfg);
      this._hp = p;
    }
    this._hp.hass = this._h;
    if (!this._hp.isConnected) this.shadowRoot.appendChild(this._hp); // im eigenen Shadow-DOM, damit Aktionen der Karten bei HA ankommen
  }

  _openLegacy(i, it) { // Kompatibilität mit alten nz-Dock-Einträgen (popup: lights|heating|…)
    const p = document.createElement('nz-popup');
    p.host = this; p.onclose = () => this._close();
    p.cfg = {weather: this._srcCfg?.weather || this._cfg.weather, ...it, title: it.title || it.label};
    document.body.appendChild(p);
    p.hass = this._h;
    this._opened(i, p);
  }

  _opened(i, p) {
    this._pop = p; this._cur = i; this._update();
    this._esc = e => { if (e.key === 'Escape') this._close(); };
    window.addEventListener('keydown', this._esc);
  }

  _close() {
    if (this._pop) { this._pop.remove(); this._pop = null; }
    this._cur = -1;
    if (this._esc) window.removeEventListener('keydown', this._esc);
    this._update();
  }
}
define('dock-card', NovaDockCard, {name: 'Nova Dock Card', description: 'Schwebende Leiste unten mit Buttons: navigieren, Aktion auslösen oder Popup mit beliebigen Karten öffnen.', documentationURL: docUrl('nova-dock-card')});

/* ---------- Editor Dock Card ---------- */

const MAIN = [
  {type: 'grid', name: '', schema: [
    {name: 'position', selector: {select: {mode: 'dropdown', options: [{value: 'bottom', label: 'Unten'}, {value: 'top', label: 'Oben'}]}}},
    {name: 'button_size', selector: {number: {min: 32, max: 72, step: 2, mode: 'box', unit_of_measurement: 'px'}}},
  ]},
  {name: 'source', selector: {text: {}}},
];
const ITEM = [
  {type: 'grid', name: '', schema: [
    {name: 'icon', required: true, selector: {icon: {}}},
    {name: 'label', selector: {text: {}}},
  ]},
  {name: 'tap_action', selector: {ui_action: {}}},
  {name: 'popup_hash', selector: {select: {mode: 'dropdown', custom_value: true, options: []}}},
  {name: 'popup_title', selector: {text: {}}},
  {name: 'cards', selector: {object: {}}},
  {name: 'badge', selector: {entity: {}}},
  {type: 'grid', name: '', schema: [
    {name: 'badge_count_of', selector: {entity: {}}},
    {name: 'badge_show_number', selector: {boolean: {}}},
  ]},
  {name: 'badge_exclude', selector: {entity: {multiple: true}}},
];
const LABELS = {
  position: 'Position', button_size: 'Button-Größe', source: 'Einträge aus anderem Dashboard übernehmen',
  icon: 'Icon', label: 'Name', tap_action: 'Aktion beim Antippen', popup_title: 'Popup-Titel',
  popup_hash: 'Nova Pop-up öffnen', cards: 'Popup-Karten (YAML-Liste)', badge: 'Punkt, wenn diese Entität an ist',
  badge_count_of: 'Zähler: Gruppe', badge_show_number: 'Zahl statt Punkt', badge_exclude: 'Beim Zählen ignorieren',
};
const HELPERS = {
  source: 'Optional: URL-Pfad eines Dashboards (z. B. neues-zuhause). Dann gilt dessen Dock – praktisch für mehrere Dashboards mit gleicher Leiste.',
  popup_hash: 'Öffnet die Nova Pop-up Card mit diesem Hash (Liste = Pop-ups in diesem Dashboard). Hat Vorrang vor Aktion und Popup-Karten.',
  cards: 'Wenn gesetzt, öffnet der Button ein Popup mit diesen Karten (statt der Aktion). Beispiel: - type: tile, entity: light.flur',
  badge_count_of: 'Zeigt Punkt/Zahl, wenn Mitglieder der Gruppe an sind (z. B. light.alle_lampen)',
};

class NovaDockCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static helpers = HELPERS;
  // Pop-ups des Dashboards für die Auswahlliste einmal laden
  set hass(h) {
    super.hass = h;
    if (h && !this._hashes) {
      this._hashes = [];
      dashPopups(h, undefined, true).then(list => { this._hashes = list; this._rebuild(); });
    }
  }
  _schema() {
    const opts = [{value: '', label: '– keins –'}, ...(this._hashes || []).map(p => { const h = cleanHash(p.hash); return {value: h, label: `${p.title || h} (#${h})`}; })];
    return ITEM.map(x => x.name === 'popup_hash' ? {...x, selector: {select: {...x.selector.select, options: opts}}} : x);
  }
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap');
    const main = {position: 'bottom', button_size: 48, ...this._config};
    w.append(this._form(MAIN, main, v => {
      const c = merge(this._config, names(MAIN), v);
      if (c.position === 'bottom') delete c.position;
      if (c.button_size === 48) delete c.button_size;
      const hadSrc = !!this._config.source;
      this._emit(c);
      if (hadSrc !== !!c.source) this._rebuild();
    }));
    if (this._config.source && !(this._config.items || []).length) w.append(this._hint('Einträge kommen aus dem anderen Dashboard. Eigene Einträge unten überschreiben das.'));
    w.append(this._h3('Buttons'));
    const items = this._config.items || [];
    items.forEach((it, i) => w.append(this._item(it, i, items.length)));
    w.append(this._add('Button hinzufügen', () => {
      const n = [...items, {icon: 'mdi:circle-outline'}];
      this._open = new Set([n.length - 1]);
      this._emit({...this._config, items: n});
      this._rebuild();
    }));
  }
  _label(it, i) { return `${i + 1}. ${it.label || it.popup_title || (it.popup_hash ? `#${cleanHash(it.popup_hash)}` : '') || (Array.isArray(it.cards) ? 'Popup' : it.tap_action?.navigation_path) || 'Neuer Button'}`; }
  _item(it, i, n) {
    const [d, s, b] = this._details(i, it.icon || 'mdi:circle-outline', this._label(it, i), this._itemBtns(i, n, dir => this._move(i, dir), () => this._remove(i)));
    const schema = this._schema();
    b.append(this._form(schema, it, v => {
      const list = [...this._config.items];
      const nx = merge(list[i], names(schema), v);
      if (nx.popup_hash) nx.popup_hash = cleanHash(nx.popup_hash); if (!nx.popup_hash) delete nx.popup_hash;
      if (nx.cards && !Array.isArray(nx.cards)) nx.cards = [nx.cards];
      if (!nx.badge_show_number) delete nx.badge_show_number;
      list[i] = nx;
      this._emit({...this._config, items: list});
      s.querySelector('.lbl').textContent = this._label(nx, i);
      s.querySelector('ha-icon').setAttribute('icon', nx.icon || 'mdi:circle-outline');
    }));
    return d;
  }
  _move(i, dir) {
    const j = i + dir, list = [...this._config.items];
    [list[i], list[j]] = [list[j], list[i]];
    this._open = new Set([j]);
    this._emit({...this._config, items: list}); this._rebuild();
  }
  _remove(i) {
    this._open = new Set();
    const list = this._config.items.filter((_, k) => k !== i);
    const c = {...this._config};
    if (list.length) c.items = list; else delete c.items;
    if (!c.items && !c.source) c.items = [];
    this._emit(c); this._rebuild();
  }
}
define('dock-card-editor', NovaDockCardEditor);
