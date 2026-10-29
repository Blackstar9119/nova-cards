import {define, docUrl, tag} from './shared/define.js';
import {esc, isImg, list, NUMRE} from './shared/utils.js';
import {isOn, alertHit, fmtState} from './shared/state.js';
import {moreInfo, hassAction, navigate} from './shared/actions.js';
import {NAVI_VARS, SECTION_EDITOR_CSS, roleVars} from './shared/styles.js';
import {hassChanged, entityIds, inPicker} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, sel, ROLE} from './shared/editor-schema.js';
import {cleanHash, curHash, togglePopup, popupOptions} from './shared/popup-hub.js';

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

class NovaNaviPopup extends HTMLElement {
  constructor() {
    super();
    const r = this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NAVI_VARS}${PCSS}</style><div class="root"><div class="hd"><ha-icon class="hi"></ha-icon><span class="tt"></span><div class="x" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></div></div><div class="body"></div></div>`;
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
    if (!this._cards.length) this._body.innerHTML = '<div class="empty">Noch keine Karten in diesem Pop-up – im Navi-Editor unter „Einfaches Pop-up: Karten“ eintragen.</div>';
  }
  set hass(h) { this._h = h; this._cards.forEach(c => { c.hass = h; }); }
}
define('navi-popup', NovaNaviPopup);

/* ---------- Nova Navi ---------- */
// .wrap ist die schwebende Hülle (Position), darin optional die Media-Leiste .mb und die Leiste .dock mit den Buttons
const DCSS = `
:host{display:block;height:var(--nova-navi-space,var(--nova-dock-space,64px))}
:host([media]){height:calc(var(--nova-navi-space,var(--nova-dock-space,64px)) + 62px)}
:host([side]){height:0}
ha-icon{--mdc-icon-size:22px;display:flex}
.wrap{position:fixed;left:50%;transform:translateX(-50%);z-index:7;display:flex;flex-direction:column;align-items:stretch;gap:8px;max-width:calc(100vw - 24px)}
.wrap.bottom{bottom:calc(14px + env(safe-area-inset-bottom))}.wrap.top{top:14px;flex-direction:column-reverse}
.wrap.side{top:50%;bottom:auto;left:14px;right:auto;transform:translateY(-50%);max-width:none;max-height:calc(100vh - 28px);flex-direction:column}
.wrap.side.right{left:auto;right:14px}
.wrap.inline{position:static;transform:none;margin:0 auto;width:max-content;max-width:100%}
.glass{background:var(--nv-bg);backdrop-filter:blur(var(--nv-blur)) saturate(160%);-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(160%);border:1px solid var(--nv-border);box-shadow:0 12px 36px rgba(0,0,0,.4)}
.dock{--g:8px;position:relative;display:flex;align-items:center;gap:var(--g);padding:8px;border-radius:999px;overflow-x:auto;scrollbar-width:none;box-sizing:border-box;max-width:100%}
.side .dock{flex-direction:column;overflow-x:hidden;overflow-y:auto}
.dock::-webkit-scrollbar{display:none}
.d{--s:var(--sz);z-index:1;width:var(--s);height:var(--s);box-sizing:border-box;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:var(--nv-fg);cursor:pointer;position:relative;transition:background-color .2s,color .2s,border-color .2s,box-shadow .2s,transform .2s,opacity .2s;-webkit-tap-highlight-color:transparent;outline:none;user-select:none;-webkit-user-select:none}
.d[hidden]{display:none}
.d:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
.d:active{transform:scale(.9)}
.d.act{background:var(--nv-active);box-shadow:0 0 16px color-mix(in srgb,var(--nv-active) 60%,transparent)}
/* Aktiver Eintrag: runde Markierung .hl gleitet unter die Buttons; Farbe nur übers Theme (--nova-navi-active-color), Standard Akzent 2.
   Animiert werden nur transform, opacity und max-width – schont schwache Tablets. */
.dock{--hc:var(--nova-navi-active-color,var(--nv-a2))}
.hl{position:absolute;left:0;top:0;width:var(--sz);height:var(--sz);border-radius:50%;background:var(--hc);box-shadow:0 0 14px color-mix(in srgb,var(--hc) 50%,transparent);pointer-events:none;opacity:0;transition:transform var(--dur) ease-out,opacity var(--dur) ease-out}
.hl.on{opacity:1}
.d.here{background:transparent;color:var(--nova-navi-active-text-color,var(--nv-a2-fg));transition:color var(--dur) ease-out,transform .2s}
.d img{width:calc(var(--s) * .6);height:calc(var(--s) * .6);object-fit:contain}
.nm{flex:none;max-width:0;overflow:hidden;white-space:nowrap;opacity:0;margin-left:calc(-1 * var(--g));color:var(--nv-fg);font:600 14px/1.2 var(--ha-font-family-body,Roboto,sans-serif);transition:max-width var(--dur) ease-out,opacity var(--dur) ease-out,margin var(--dur) ease-out,padding var(--dur) ease-out}
.nm.on{max-width:180px;opacity:1;margin-left:0;padding-right:6px}
.nm[hidden],.side .nm{display:none}
.still,.still *{transition:none!important}
@media(prefers-reduced-motion:reduce){.dock,.dock *{transition:none!important}}
.dot{position:absolute;top:14%;right:14%;width:8px;height:8px;border-radius:50%;background:var(--bc,var(--nv-accent));box-shadow:0 0 6px var(--bc,var(--nv-accent));display:none}
.d.bd .dot{display:block}
.num{position:absolute;top:2px;right:0;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:8px;background:var(--bc,var(--nv-accent));color:var(--bfg,#3a2a00);font:700 10px/16px var(--ha-font-family-body,Roboto,sans-serif);text-align:center;display:none}
.d.bn .num{display:block}.d.bn .dot{display:none}
.empty{color:var(--nv-fg);opacity:.7;font-size:13px;padding:6px 12px}
.mb{display:flex;align-items:center;gap:10px;padding:6px 6px 6px 6px;border-radius:999px;min-width:260px;box-sizing:border-box;color:var(--nv-fg);font-family:var(--ha-font-family-body,Roboto,sans-serif)}
.mb[hidden]{display:none}
.mb .art{width:40px;height:40px;flex:none;border-radius:50%;background:var(--nv-chip) center/cover no-repeat;display:flex;align-items:center;justify-content:center}
.mb .art.pic ha-icon{display:none}
.mb .tx{flex:1;min-width:0;cursor:pointer}
.mb .tx b,.mb .tx span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mb .tx b{font-size:13px;font-weight:600}.mb .tx span{font-size:11px;opacity:.7}
.mb .pp{width:40px;height:40px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nv-active);color:var(--nv-active-fg);cursor:pointer;-webkit-tap-highlight-color:transparent}
.mb .pp:active{transform:scale(.9)}
.side .mb{min-width:0;flex-direction:column;padding:6px;border-radius:28px}
.side .mb .tx{display:none}
.menu{position:fixed;z-index:8;display:flex;flex-direction:column;gap:4px;padding:6px;border-radius:22px;min-width:180px;max-width:calc(100vw - 16px);max-height:60vh;overflow-y:auto;box-sizing:border-box;color:var(--nv-fg);font-family:var(--ha-font-family-body,Roboto,sans-serif);animation:mi .16s ease-out}
.mi{display:flex;align-items:center;gap:10px;padding:8px 14px 8px 8px;border-radius:999px;cursor:pointer;font-size:14px;white-space:nowrap;-webkit-tap-highlight-color:transparent;outline:none}
.mi[hidden]{display:none}
.mi:hover,.mi:focus-visible{background:var(--nv-chip)}
.mi.here{background:var(--nv-chip);box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)}
.mi .ic{width:32px;height:32px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nv-chip)}
.mi .ic img{width:60%;height:60%;object-fit:contain}
.mi ha-icon{--mdc-icon-size:18px}
@keyframes mi{from{opacity:0;transform:scale(.96)}}
@media(max-width:600px){.d,.hl{--s:calc(var(--sz) * .875)}.hl{width:var(--s);height:var(--s)}.dock{--g:5px;padding:6px}}`;

const SRC = {};
// Navi-Konfiguration in einem Dashboard finden (für „source“); alte Typen zählen mit, damit nichts kaputtgeht
const TYPES = ['navi-card', 'dock-card'];
const findNavi = o => {
  if (!o || typeof o !== 'object') return null;
  if ((TYPES.some(t => o.type === `custom:${tag(t)}`) || o.type === 'custom:nz-dock-card') && Array.isArray(o.items) && o.items.length) return o;
  for (const v of Object.values(o)) { const r = findNavi(v); if (r) return r; }
  return null;
};
// Exakter Pfadvergleich: ohne Query/Hash, Schrägstrich am Ende egal
const normPath = p => {
  p = String(p || '').split(/[?#]/)[0].replace(/\/+$/, '') || '/';
  try { return decodeURI(p); } catch { return p; }
};
const pathOf = it => it.tap_action?.action === 'navigate' ? it.tap_action.navigation_path : it.navigation_path;
const icon = ic => isImg(ic) ? `<img src="${esc(ic)}" alt="">` : `<ha-icon icon="${esc(ic)}"></ha-icon>`;
// Haptisches Feedback: HA-App über das Event „haptic“, sonst (z. B. Fully Kiosk) über die Vibration des Browsers
const haptic = () => {
  window.dispatchEvent(new CustomEvent('haptic', {detail: 'light'}));
  if (!window.externalApp && !window.webkit?.messageHandlers?.externalBus) try { navigator.vibrate?.(12); } catch { /* nicht unterstützt */ }
};
// Sichtbarkeit eines Eintrags: Benutzer und/oder Bedingung an einer Entität
const visible = (h, it) => {
  if (list(it.visible_users).length && !list(it.visible_users).includes(h.user?.id)) return false;
  if (!it.visible_entity) return true;
  const s = h.states[it.visible_entity];
  const cond = {state: it.visible_state, state_not: it.visible_state_not, above: it.visible_above, below: it.visible_below};
  return Object.values(cond).some(v => v != null) ? alertHit(cond, s) : isOn(s);
};
const MEDIA_ON = ['playing', 'paused'];
// Zuletzt aktiver Eintrag je Leiste (Schlüssel = Navigationsziele): {i, from, t}. HA erzeugt die Karte bei jedem
// Viewwechsel neu – die neue Karte startet dann im alten Zustand und gleitet zum neuen
const LAST = new Map();
const REDUCED = window.matchMedia?.('(prefers-reduced-motion: reduce)');

class NovaNaviCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('navi-card-editor')); }
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
    this._ids = entityIds(c);
    this._close();
    this._items = null; this._btns = null; this._built = false; this._cur = -1;
    this._watchSide();
    if (this._h) this.hass = this._h;
  }
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._cfg) return;
    if (this._pop) this._pop.hass = h;
    if (this._hp) this._hp.hass = h;
    if (!this._items) {
      if (this._cfg.items) this._items = this._cfg.items;
      else { this._loadSource(); return; }
    }
    if (!this._built) this._build();
    else if (!hassChanged(old, h, this._watch(old))) return;
    this._update();
  }
  // Entitäten der Einträge (auch im Untermenü) und Media-Player, bei Zählern auch die Mitglieder der Gruppe
  _watch(h) {
    if (this._srcIds?.items !== this._items) this._srcIds = {items: this._items, ids: entityIds([this._items, this._srcCfg?.media_players])};
    const ids = [...this._ids, ...this._srcIds.ids];
    (this._items || []).forEach(it => { if (it.badge_count_of) ids.push(...(h?.states[it.badge_count_of]?.attributes.entity_id || [])); });
    return ids;
  }
  async _loadSource() {
    if (this._loading) return;
    this._loading = true;
    const k = this._cfg.source;
    SRC[k] = SRC[k] || this._h.callWS({type: 'lovelace/config', url_path: k === 'default' ? null : k}).then(findNavi).catch(() => null);
    const d = await SRC[k];
    this._loading = false;
    this._items = d ? d.items : [];
    this._srcCfg = d || {};
    this.hass = this._h;
  }
  connectedCallback() {
    this._applyInline();
    requestAnimationFrame(() => this._applyInline());
    this._loc = () => { if (this._menu) this._close(); this._update(); };
    window.addEventListener('location-changed', this._loc);
    window.addEventListener('popstate', this._loc);
    window.addEventListener('hashchange', this._loc);
    this._watchSide();
    // HA hängt zwischengespeicherte Ansichten wieder ein – Markierung dann neu berechnen (gleitet vom zuletzt aktiven Eintrag)
    this._shown = null;
    this._update();
  }
  disconnectedCallback() {
    window.removeEventListener('location-changed', this._loc);
    window.removeEventListener('popstate', this._loc);
    window.removeEventListener('hashchange', this._loc);
    this._mq?.removeEventListener('change', this._mqf); this._mq = null;
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
  _applyInline() { this.shadowRoot?.querySelector('.wrap')?.classList.toggle('inline', this._inline); }

  // Seitenleiste ab einer Mindestbreite (z. B. Tablet quer, PC), darunter Leiste unten bzw. oben
  _watchSide() {
    this._mq?.removeEventListener('change', this._mqf); this._mq = null;
    const c = this._cfg;
    if (!c || !this.isConnected || !['left', 'right'].includes(c.sidebar)) return this._applySide();
    this._mq = window.matchMedia(`(min-width: ${+c.sidebar_min_width || 1024}px)`);
    this._mqf = () => this._applySide();
    this._mq.addEventListener('change', this._mqf);
    this._applySide();
  }
  get _side() { return this._mq?.matches ? this._cfg.sidebar : null; }
  _applySide() {
    const w = this.shadowRoot?.querySelector('.wrap'), s = this._side;
    this.toggleAttribute('side', !!s && !this._inline);
    if (!w) return;
    w.classList.toggle('side', !!s);
    w.classList.toggle('right', s === 'right');
    w.classList.toggle(this._cfg.position === 'top' ? 'top' : 'bottom', !s);
    if (this._menu) this._close();
    if (this._shown) this._shown = `${this._shown.split('|')[0]}|neu`;
    this._update();
  }

  _build() {
    this._built = true;
    const c = this._cfg, r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NAVI_VARS}${DCSS}</style><div class="wrap ${this._inline ? 'inline' : ''}" style="--sz:${+c.button_size || 48}px;--dur:${this._dur}ms">`
      + `<div class="mb glass" hidden><div class="art"><ha-icon icon="mdi:music"></ha-icon></div><div class="tx"><b></b><span></span></div><div class="pp" role="button" tabindex="0"><ha-icon></ha-icon></div></div>`
      + `<div class="dock glass"><div class="hl"></div></div></div>`;
    const dock = r.querySelector('.dock');
    this._dock = dock; this._hl = dock.firstChild; this._shown = null;
    this._mb = r.querySelector('.mb');
    this._mb.querySelector('.tx').addEventListener('click', () => this._mp && moreInfo(this, this._mp));
    const pp = this._mb.querySelector('.pp');
    const play = () => { if (!this._mp) return; if (this._haptic) haptic(); this._h.callService('media_player', 'media_play_pause', {entity_id: this._mp}); };
    pp.addEventListener('click', play);
    pp.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); play(); } });
    this._applySide();
    if (this._hp) r.appendChild(this._hp);
    if (!this._items.length) { this._dock = null; dock.innerHTML = `<span class="empty">${c.source ? `Kein Navi in „${esc(c.source)}“ gefunden` : 'Noch keine Einträge'}</span>`; this._btns = []; return; }
    this._btns = this._items.map((it, i) => {
      const d = document.createElement('div');
      d.className = 'd'; d.tabIndex = 0; d.setAttribute('role', 'button');
      d.title = it.label || it.popup_title || '';
      d.innerHTML = `${icon(it.icon || 'mdi:circle-outline')}<span class="dot"></span><span class="num"></span>`;
      this._bind(d, it, kind => this._run(i, kind));
      // Name des aktiven Eintrags steht weiß neben dem runden Button
      d._nm = document.createElement('span'); d._nm.className = 'nm';
      dock.append(d, d._nm);
      return d;
    });
  }
  get _haptic() { return !!(this._cfg.haptic ?? this._srcCfg?.haptic); }

  // Antippen, doppelt antippen (wartet kurz auf den zweiten Tipp) und lange drücken
  _bind(el, it, run) {
    let t, wait;
    const hold = it.hold_action && it.hold_action.action !== 'none', dbl = it.double_tap_action && it.double_tap_action.action !== 'none';
    if (hold) {
      el.addEventListener('pointerdown', () => { el._held = false; clearTimeout(t); t = setTimeout(() => { el._held = true; run('hold'); }, 500); });
      ['pointerup', 'pointerleave', 'pointercancel'].forEach(ev => el.addEventListener(ev, () => clearTimeout(t)));
      el.addEventListener('contextmenu', e => e.preventDefault());
    }
    el.addEventListener('click', () => {
      if (el._held) { el._held = false; return; }
      if (!dbl) return run('tap');
      if (wait) { clearTimeout(wait); wait = null; return run('double_tap'); }
      wait = setTimeout(() => { wait = null; run('tap'); }, 250);
    });
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); run('tap'); } });
  }

  _update() {
    if (!this._btns || !this._h) return;
    const h = this._h, here = normPath(location.pathname);
    const isHere = it => { const p = pathOf(it); return !!p && normPath(p) === here; };
    let cur = -1;
    this._items.forEach((it, i) => {
      const d = this._btns[i]; if (!d) return;
      d.hidden = d._nm.hidden = !visible(h, it);
      d.classList.toggle('act', i === this._cur || (!!it.popup_hash && curHash() === cleanHash(it.popup_hash)));
      // Aktiver Eintrag; liegt der Pfad im Untermenü, ist dessen Button aktiv und zeigt den Namen des Menü-Eintrags
      const hit = isHere(it) ? it : (Array.isArray(it.menu) && it.menu.find(isHere)) || null;
      if (hit && cur < 0 && !d.hidden) cur = i;
      d._nm.textContent = (hit && hit.label) || it.label || '';
      this._badge(d, it);
    });
    this._setActive(cur);
    this._menu?.querySelectorAll('.mi').forEach(m => { m.hidden = !visible(h, m._it); m.classList.toggle('here', isHere(m._it)); });
    this._media();
  }

  _opt(k) { return this._cfg[k] ?? this._srcCfg?.[k]; }
  get _dur() { const v = +this._opt('animation_duration'); return v > 0 ? v : 280; }
  get _key() { return (this._items || []).map(pathOf).join('|'); }

  // Aktiven Eintrag zeigen: Markierung und Name. Wechselt er, gleitet alles vom alten Zustand (auch aus der
  // vorherigen Karte, siehe LAST) zum neuen – erst Endlage messen, dann im Ausgangszustand starten (FLIP)
  _setActive(cur) {
    const dock = this._dock; if (!dock) return;
    // Alles, was die Lage der Buttons ändert, gehört in die Signatur – dann wird die Markierung neu gesetzt
    const lbl = this._opt('active_label') !== false && !this._side, lay = this._btns.map(d => (d.hidden ? 0 : 1) + d._nm.textContent).join(',');
    const sig = `${cur}|${lbl}|${this._side}|${this._dur}|${lay}`;
    if (this._shown === sig) return;
    // Die alte Karte bekommt den Viewwechsel oft noch mit, bevor HA sie entfernt – dann gilt ihr Ausgangszustand
    const rec = LAST.get(this._key), fresh = rec && Date.now() - rec.t < 1500;
    const from = this._shown != null ? +this._shown.split('|')[0] : !rec ? -1 : rec.i !== cur ? rec.i : fresh ? rec.from : cur;
    this._shown = sig;
    if (!rec || rec.i !== cur) LAST.set(this._key, {i: cur, from, t: Date.now()});
    const apply = i => this._btns.forEach((d, k) => { d.classList.toggle('here', k === i); d._nm.classList.toggle('on', k === i && lbl && !!d._nm.textContent); });
    const pos = i => { const d = this._btns[i]; return d ? `translate(${d.offsetLeft}px,${d.offsetTop}px)` : null; };
    const pill = (i, show) => { const t = pos(i); if (t) this._hl.style.transform = t; this._hl.classList.toggle('on', show && i >= 0); };
    const anim = this._opt('animation') !== false && !REDUCED?.matches && this.isConnected && !inPicker(this) && from !== cur;
    dock.classList.add('still');
    apply(cur);
    const end = pos(cur);
    if (anim) {
      // Ausgangszustand: alter Eintrag aktiv; ohne alten Eintrag blendet die Markierung am Ziel ein
      apply(from);
      pill(from >= 0 ? from : cur, from >= 0);
      void dock.offsetWidth;
      dock.classList.remove('still');
      requestAnimationFrame(() => { apply(cur); if (end) this._hl.style.transform = end; this._hl.classList.toggle('on', cur >= 0); });
    } else {
      pill(cur, true);
      void dock.offsetWidth;
      dock.classList.remove('still');
    }
  }

  // Punkt oder Zahl; Farbe als Farbrolle, bei erfüllter Bedingung eine zweite Farbrolle
  _badge(d, it) {
    const h = this._h, s = it.badge && h.states[it.badge];
    let n = 0, dot = false;
    if (it.badge_count_of) n = countOn(h, it.badge_count_of, it.badge_exclude);
    else if (s && it.badge_show_number && NUMRE.test(s.state)) n = Math.round(+s.state);
    else if (s) dot = isOn(s);
    const showNum = n > 0 && it.badge_show_number;
    d.classList.toggle('bd', dot || (n > 0 && !showNum));
    d.classList.toggle('bn', showNum);
    if (showNum) d.querySelector('.num').textContent = n > 99 ? '99+' : n;
    const cond = {state: it.badge_alert_state, state_not: it.badge_alert_state_not, above: it.badge_alert_above, below: it.badge_alert_below};
    const alert = it.badge_alert_color && Object.values(cond).some(v => v != null) && alertHit(cond, h.states[it.badge || it.badge_count_of]);
    const role = alert ? it.badge_alert_color : it.badge_color;
    if (role) { const v = roleVars(role); d.style.setProperty('--bc', v.c); d.style.setProperty('--bfg', v.fg); }
    else { d.style.removeProperty('--bc'); d.style.removeProperty('--bfg'); }
  }

  // Media-Leiste: spielt ein Player, wird er gezeigt, sonst ein pausierter (oder auf Wunsch immer der erste)
  _media() {
    const mb = this._mb, ids = list(this._cfg.media_players ?? this._srcCfg?.media_players);
    if (!mb) return;
    const ss = ids.map(id => this._h.states[id]).filter(Boolean);
    const s = ss.find(x => x.state === 'playing') || ss.find(x => MEDIA_ON.includes(x.state)) || ((this._cfg.media_always ?? this._srcCfg?.media_always) ? ss[0] : null);
    mb.hidden = !s;
    this.toggleAttribute('media', !!s && !this._side && !this._inline);
    this._mp = s?.entity_id || null;
    if (!s) return;
    const a = s.attributes, pic = a.entity_picture_local || a.entity_picture, art = mb.querySelector('.art');
    if (art._pic !== pic) { art._pic = pic; art.style.backgroundImage = pic ? `url(${JSON.stringify(pic)})` : ''; art.classList.toggle('pic', !!pic); }
    mb.querySelector('b').textContent = a.media_title || a.friendly_name || s.entity_id;
    mb.querySelector('.tx span').textContent = a.media_artist || a.app_name || (MEDIA_ON.includes(s.state) ? a.friendly_name || '' : fmtState(this._h, s));
    mb.querySelector('.pp ha-icon').setAttribute('icon', s.state === 'playing' ? 'mdi:pause' : 'mdi:play');
  }

  _run(i, kind) {
    const it = this._items[i];
    if (this._haptic) haptic();
    if (kind !== 'tap') return hassAction(this, {entity: it.entity, [`${kind}_action`]: it[`${kind}_action`]}, kind);
    if (it.popup_hash) { this._close(); return togglePopup(this, this._h, cleanHash(it.popup_hash), this._cfg.source); }
    if (this._cur === i) return this._close();
    this._close();
    if (Array.isArray(it.menu) && it.menu.length) return this._openMenu(i, it);
    if (Array.isArray(it.cards)) return this._openCards(i, it);
    if (typeof it.popup === 'string' && customElements.get('nz-popup')) return this._openLegacy(i, it);
    this._act(it);
  }
  // Aktion eines Eintrags ohne eigenes Pop-up (auch für Einträge im Untermenü)
  _act(it) {
    if (it.popup_hash) return togglePopup(this, this._h, cleanHash(it.popup_hash), this._cfg.source);
    if (it.tap_action && it.tap_action.action !== 'none') return hassAction(this, {entity: it.entity, tap_action: it.tap_action}, 'tap');
    if (it.navigation_path) return navigate(it.navigation_path);
    if (it.entity) moreInfo(this, it.entity);
  }

  // Kleines Menü am Button mit weiteren Einträgen
  _openMenu(i, it) {
    const m = document.createElement('div');
    m.className = 'menu glass'; m.setAttribute('role', 'menu');
    it.menu.forEach(sub => {
      const e = document.createElement('div');
      e.className = 'mi'; e.tabIndex = 0; e.setAttribute('role', 'menuitem'); e._it = sub;
      e.innerHTML = `<span class="ic">${icon(sub.icon || 'mdi:circle-outline')}</span><span class="lb"></span>`;
      e.querySelector('.lb').textContent = sub.label || pathOf(sub) || sub.popup_hash || sub.entity || '';
      this._bind(e, sub, kind => {
        if (this._haptic) haptic();
        this._close();
        if (kind === 'tap') this._act(sub);
        else hassAction(this, {entity: sub.entity, [`${kind}_action`]: sub[`${kind}_action`]}, kind);
      });
      m.appendChild(e);
    });
    this.shadowRoot.appendChild(m);
    this._menu = m;
    this._place(m, this._btns[i]);
    this._opened(i, m);
    this._out = e => { const p = e.composedPath(); if (!p.includes(m) && !p.includes(this._btns[i])) this._close(); };
    window.addEventListener('pointerdown', this._out, true);
    m.querySelector('.mi:not([hidden])')?.focus({preventScroll: true});
  }
  // Menü neben dem Button: über der Leiste unten, darunter oben, daneben als Seitenleiste
  _place(m, b) {
    const r = b.getBoundingClientRect(), W = innerWidth, H = innerHeight, g = 10, side = this._side;
    const w = m.offsetWidth, ht = m.offsetHeight, clamp = (v, max) => Math.max(8, Math.min(v, max - 8));
    if (side) {
      m.style.left = `${side === 'right' ? r.left - g - w : r.right + g}px`;
      m.style.top = `${clamp(r.top + r.height / 2 - ht / 2, H - ht)}px`;
    } else {
      m.style.left = `${clamp(r.left + r.width / 2 - w / 2, W - w)}px`;
      m.style.top = `${this._cfg.position === 'top' ? r.bottom + g : r.top - g - ht}px`;
    }
  }

  _openCards(i, it) {
    const p = document.createElement(tag('navi-popup'));
    p.onclose = () => this._close();
    p.cfg = {title: it.popup_title || it.label || '', icon: it.icon, cards: it.cards};
    p.hass = this._h;
    this.shadowRoot.appendChild(p); // im eigenen Shadow-DOM, damit more-info & Aktionen der Karten bei HA ankommen
    this._opened(i, p);
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
    this._menu = null;
    this._cur = -1;
    if (this._esc) window.removeEventListener('keydown', this._esc);
    if (this._out) { window.removeEventListener('pointerdown', this._out, true); this._out = null; }
    this._update();
  }
}
define('navi-card', NovaNaviCard, {name: 'Nova Navi', description: 'Navigationsleiste unten, oben oder als Seitenleiste: navigieren, Aktionen, Untermenüs, Pop-ups, Badges und eine kleine Media-Leiste.', documentationURL: docUrl('nova-navi')});
// Alter Kartentyp custom:nova-dock-card läuft weiter (nicht mehr in der Kartenauswahl)
define('dock-card', class NovaDockCard extends NovaNaviCard {});

/* ---------- Editor Nova Navi ---------- */

const GEN = [{name: 'source', selector: {text: {}}}];
const LOOK = c => [
  g2({name: 'position', selector: {select: {mode: 'dropdown', options: [{value: 'bottom', label: 'Unten'}, {value: 'top', label: 'Oben'}]}}},
    {name: 'button_size', selector: {number: {min: 32, max: 72, step: 2, mode: 'box', unit_of_measurement: 'px'}}}),
  g2(sel('sidebar', [['', 'Nie'], ['left', 'Links'], ['right', 'Rechts']]),
    ...(c.sidebar ? [{name: 'sidebar_min_width', selector: {number: {min: 480, max: 2560, step: 10, mode: 'box', unit_of_measurement: 'px'}}}] : [])),
  {name: 'active_label', selector: {boolean: {}}},
  g2({name: 'animation', selector: {boolean: {}}}, ...(c.animation !== false ? [{name: 'animation_duration', selector: {number: {min: 100, max: 1500, step: 10, mode: 'box', unit_of_measurement: 'ms'}}}] : [])),
  {name: 'haptic', selector: {boolean: {}}},
];
const MEDIA = [{name: 'media_players', selector: {entity: {multiple: true, filter: {domain: 'media_player'}}}}, {name: 'media_always', selector: {boolean: {}}}];
// Felder je Eintrag in Gruppen; was nur mit einer anderen Einstellung Sinn ergibt, erscheint erst dann
const I_MAIN = [g2({name: 'icon', required: true, selector: {icon: {}}}, {name: 'label', selector: {text: {}}})];
const I_TAP = opts => [
  {name: 'popup_hash', selector: {select: {mode: 'dropdown', custom_value: true, options: opts}}},
  {name: 'tap_action', selector: {ui_action: {}}},
];
const I_MORE = [{name: 'hold_action', selector: {ui_action: {}}}, {name: 'double_tap_action', selector: {ui_action: {}}}];
const I_POP = [{name: 'popup_title', selector: {text: {}}}, {name: 'cards', selector: {object: {}}}];
const COND = p => [g2({name: `${p}_state`, selector: {text: {}}}, {name: `${p}_state_not`, selector: {text: {}}}),
  g2({name: `${p}_above`, selector: {number: {mode: 'box', step: 'any'}}}, {name: `${p}_below`, selector: {number: {mode: 'box', step: 'any'}}})];
const I_VIS = (it, users) => [
  {name: 'visible_users', selector: {select: {multiple: true, mode: 'list', options: users}}},
  {name: 'visible_entity', selector: {entity: {}}},
  ...(it.visible_entity ? COND('visible') : []),
];
const I_BADGE = it => [
  g2({name: 'badge', selector: {entity: {}}}, {name: 'badge_count_of', selector: {entity: {}}}),
  ...(it.badge || it.badge_count_of ? [{name: 'badge_show_number', selector: {boolean: {}}}] : []),
  ...(it.badge_count_of ? [{name: 'badge_exclude', selector: {entity: {multiple: true}}}] : []),
  g2(ROLE('badge_color'), ROLE('badge_alert_color')),
  ...(it.badge_alert_color && (it.badge || it.badge_count_of) ? COND('badge_alert') : []),
];
const S_MAIN = opts => [...I_MAIN, ...I_TAP(opts)];
const LABELS = {
  position: 'Position (Handy, schmale Bildschirme)', button_size: 'Button-Größe', source: 'Einträge aus anderem Dashboard übernehmen',
  sidebar: 'Seitenleiste auf breiten Bildschirmen', sidebar_min_width: 'Seitenleiste ab Breite', haptic: 'Haptisches Feedback', active_label: 'Namen neben dem aktiven Icon zeigen', animation: 'Wechsel animieren', animation_duration: 'Dauer der Animation',
  media_players: 'Media-Player', media_always: 'Auch zeigen, wenn nichts läuft',
  icon: 'Icon', label: 'Name', tap_action: 'Aktion beim Antippen', hold_action: 'Aktion bei langem Drücken', double_tap_action: 'Aktion bei Doppeltippen',
  popup_title: 'Titel', popup_hash: 'Nova Pop-up öffnen', cards: 'Karten (YAML-Liste)',
  visible_users: 'Nur für diese Benutzer', visible_entity: 'Nur zeigen abhängig von Entität',
  visible_state: 'Zustand ist', visible_state_not: 'Zustand ist nicht', visible_above: 'Wert über', visible_below: 'Wert unter',
  badge: 'Badge-Entität', badge_count_of: 'Zähler: Gruppe', badge_show_number: 'Zahl statt Punkt', badge_exclude: 'Beim Zählen ignorieren',
  badge_color: 'Badge-Farbe', badge_alert_color: 'Farbe bei Bedingung',
  badge_alert_state: 'Zustand ist', badge_alert_state_not: 'Zustand ist nicht', badge_alert_above: 'Wert über', badge_alert_below: 'Wert unter',
};
const HELPERS = {
  source: 'Optional: URL-Pfad eines Dashboards (z. B. neues-zuhause). Dann gilt dessen Navi – praktisch für mehrere Ansichten oder Dashboards mit gleicher Leiste.',
  sidebar: 'Ab der eingestellten Breite steht die Leiste senkrecht am Rand, darunter unten bzw. oben.',
  animation: 'Markierung und Name gleiten beim Viewwechsel vom alten zum neuen Eintrag. Bei „Bewegung reduzieren“ im System immer aus.',
  active_label: 'Rechts neben dem runden Button der aktuellen Ansicht steht sein Name (nicht in der Seitenleiste).',
  haptic: 'Kurzes Vibrieren beim Antippen (HA-App, Android-Browser, Fully Kiosk).',
  media_players: 'Zeigt über der Leiste den laufenden Player mit Play/Pause. Leer = keine Media-Leiste.',
  popup_hash: 'Öffnet die Nova Pop-up Card mit diesem Hash (Liste = Pop-ups in diesem Dashboard). Hat Vorrang vor der Aktion, dem Untermenü und dem einfachen Pop-up.',
  cards: 'Wenn gesetzt, öffnet der Button ein Pop-up mit diesen Karten (statt der Aktion). Beispiel: - type: tile, entity: light.flur',
  visible_users: 'Leer = für alle sichtbar.',
  visible_entity: 'Ohne Bedingung: sichtbar, wenn die Entität an ist.',
  badge: 'Punkt, wenn die Entität an ist; mit „Zahl statt Punkt“ ihr Zahlenwert (z. B. Anzahl offener Fenster).',
  badge_count_of: 'Zeigt Punkt/Zahl, wenn Mitglieder der Gruppe an sind (z. B. light.alle_lampen)',
  badge_color: 'Leer = Akzentfarbe des Themes.',
  badge_alert_color: 'Gilt, wenn die Bedingung darunter auf die Badge-Entität zutrifft.',
};

class NovaNaviCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static helpers = HELPERS;
  // Pop-ups des Dashboards und Benutzer für die Auswahllisten einmal laden
  set hass(h) {
    super.hass = h;
    if (h && !this._hashes) {
      this._hashes = [];
      popupOptions(h).then(o => { this._hashes = o; this._rebuild(); });
    }
    if (h && !this._users) {
      const me = h.user ? [{value: h.user.id, label: h.user.name}] : [];
      this._users = me;
      // HA-INTERN: WebSocket „config/auth/list“ (nur für Admins) liefert alle Benutzer; sonst nur der eigene
      h.callWS({type: 'config/auth/list'})
        .then(us => { const l = us.filter(u => !u.system_generated).map(u => ({value: u.id, label: u.name || u.username || u.id})); if (l.length) { this._users = l; this._rebuild(); } })
        .catch(() => {});
    }
  }
  static openSections = ['buttons'];
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap');
    const data = {position: 'bottom', button_size: 48, sidebar: '', active_label: true, animation: true, animation_duration: 280, ...this._config};
    const form = schema => this._form(schema, data, v => {
      const c = merge(this._config, names(schema), v);
      if (c.position === 'bottom') delete c.position;
      if (c.button_size === 48) delete c.button_size;
      if (!c.sidebar) { delete c.sidebar; delete c.sidebar_min_width; }
      if (!c.haptic) delete c.haptic;
      if (c.active_label !== false) delete c.active_label;
      if (c.animation !== false) delete c.animation;
      if (c.animation === false || c.animation_duration === 280) delete c.animation_duration;
      if (!c.media_always) delete c.media_always;
      const re = !!this._config.source !== !!c.source || !!this._config.sidebar !== !!c.sidebar || (this._config.animation !== false) !== (c.animation !== false);
      this._emit(c);
      if (re) this._rebuild();
    });
    const items = this._config.items || [];
    w.append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => {
        b.append(form(GEN));
        if (this._config.source && !items.length) b.append(this._hint('Einträge kommen aus dem anderen Dashboard. Eigene Buttons überschreiben das.'));
      }),
      this._section('buttons', 'mdi:dock-bottom', 'Buttons', b => {
        items.forEach((it, i) => b.append(this._item(it, i, items.length)));
        b.append(this._add('Button hinzufügen', () => {
          const n = [...items, {icon: 'mdi:circle-outline'}];
          this._open = new Set([n.length - 1]);
          this._emit({...this._config, items: n});
          this._rebuild();
        }));
      }),
      this._section('look', 'mdi:palette-outline', 'Layout und Aussehen', b => b.append(form(LOOK(data)))),
      this._section('media', 'mdi:music-circle-outline', 'Media-Leiste', b => b.append(form(MEDIA))));
  }
  get _opts() { return this._hashes?.length ? this._hashes : [{value: '', label: '– keins –'}]; }
  _popName(h) { h = cleanHash(h); return this._hashes?.find(o => o.value === h)?.label || `#${h}`; }
  _label(it, i) { return `${i + 1}. ${it.label || it.popup_title || (it.popup_hash ? this._popName(it.popup_hash) : '') || (it.menu?.length ? 'Untermenü' : '') || (Array.isArray(it.cards) ? 'Einfaches Pop-up' : pathOf(it)) || 'Neuer Button'}`; }
  // Formular für einen Teil eines Eintrags; ändert sich dadurch das Schema (Felder ein-/ausblenden), wird neu aufgebaut
  _part(get, set, schema, onChange) {
    const cur = get();
    return this._form(schema(cur), cur, v => {
      const old = get(), was = JSON.stringify(schema(old));
      const nx = merge(old, names(schema(old)), v);
      if (nx.popup_hash) nx.popup_hash = cleanHash(nx.popup_hash); if (!nx.popup_hash) delete nx.popup_hash;
      if (nx.cards && !Array.isArray(nx.cards)) nx.cards = [nx.cards];
      if (!nx.badge_show_number) delete nx.badge_show_number;
      set(nx);
      onChange?.(nx);
      if (JSON.stringify(schema(nx)) !== was) this._rebuild();
    });
  }
  _setItem(i, nx) { const list = [...this._config.items]; list[i] = nx; this._emit({...this._config, items: list}); }
  _item(it, i, n) {
    const [d, s] = this._details(i, it.icon || 'mdi:circle-outline', this._label(it, i), this._itemBtns(i, n, dir => this._move(i, dir), () => this._remove(i)), b => {
      const get = () => this._config.items[i], set = nx => this._setItem(i, nx);
      const part = sch => this._part(get, set, typeof sch === 'function' ? sch : () => sch, nx => {
        s.querySelector('.lbl').textContent = this._label(nx, i);
        s.querySelector('ha-icon').setAttribute('icon', nx.icon || 'mdi:circle-outline');
      });
      b.append(part(I_MAIN), this._h4('Beim Antippen'), part(I_TAP(this._opts)), this._h4('Lange drücken und Doppeltippen'), part(I_MORE),
        this._h4('Untermenü'), ...this._menuList(i), this._h4('Einfaches Pop-up'), part(I_POP),
        this._h4('Sichtbarkeit'), part(cur => I_VIS(cur, this._users || [])), this._h4('Badge'), part(I_BADGE));
    });
    return d;
  }
  // Einträge des Untermenüs: Antippen des Buttons öffnet dann das Menü statt der Aktion
  _menuList(i) {
    const subs = this._config.items[i].menu || [], out = [];
    const setSubs = arr => { const it = {...this._config.items[i]}; if (arr.length) it.menu = arr; else delete it.menu; this._setItem(i, it); };
    if (!subs.length) out.push(this._hint('Mit Einträgen öffnet der Button beim Antippen ein kleines Menü.'));
    subs.forEach((sub, j) => {
      const key = `m${i}.${j}`, lbl = x => `${j + 1}. ${x.label || pathOf(x) || x.popup_hash || 'Neuer Eintrag'}`;
      const [d] = this._details(key, sub.icon || 'mdi:circle-outline', lbl(sub), this._itemBtns(j, subs.length, dir => {
        const arr = [...this._config.items[i].menu], t = j + dir;
        [arr[j], arr[t]] = [arr[t], arr[j]];
        this._open = new Set([i, `m${i}.${t}`]);
        setSubs(arr); this._rebuild();
      }, () => { this._open = new Set([i]); setSubs(this._config.items[i].menu.filter((_, x) => x !== j)); this._rebuild(); }), (b, s) => {
        const get = () => this._config.items[i].menu[j];
        const set = nx => { const arr = [...this._config.items[i].menu]; arr[j] = nx; setSubs(arr); };
        const part = sch => this._part(get, set, sch, nx => {
          s.querySelector('.lbl').textContent = lbl(nx);
          s.querySelector('ha-icon').setAttribute('icon', nx.icon || 'mdi:circle-outline');
        });
        b.append(part(() => S_MAIN(this._opts)), part(() => I_MORE), part(cur => I_VIS(cur, this._users || [])));
      });
      out.push(d);
    });
    out.push(this._add('Menü-Eintrag hinzufügen', () => {
      const arr = [...(this._config.items[i].menu || []), {icon: 'mdi:circle-outline'}];
      this._open = new Set([i, `m${i}.${arr.length - 1}`]);
      setSubs(arr); this._rebuild();
    }));
    return out;
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
define('navi-card-editor', NovaNaviCardEditor);
