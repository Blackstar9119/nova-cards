import {define, docUrl, tag} from './shared/define.js';
import {dom, setIcon, toObj, stamp} from './shared/utils.js';
import {isOn, TOGGLE, fmtState, nameOf, iconOf, valueOf, alertHit} from './shared/state.js';
import {moreInfo, runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {hassChanged, entityIds, inPicker} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, A, ENT, NUM, sel, NAMEICON, BASE_LABELS} from './shared/editor-schema.js';

/* ---------- Nova Kamera Card ---------- */
const CCSS = `
.g.cam{padding:12px;gap:10px}
.media{position:relative;border-radius:calc(var(--nv-radius) - 8px);overflow:hidden;background:rgba(0,0,0,.35);aspect-ratio:var(--ar,16/9);cursor:pointer;-webkit-tap-highlight-color:transparent}
.media>img,.media .live,.media .live>*{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:var(--fit,cover);border:none}
.media .live>*{--video-max-height:100%;--ha-card-border-radius:0;--ha-card-background:transparent}
.media .live:empty{display:none}
.media .ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:.45}
.media .ph ha-icon{--mdc-icon-size:40px}
.ovl{position:absolute;display:flex;gap:6px;flex-wrap:wrap;z-index:2;pointer-events:none}
.ovl>*{pointer-events:auto}
.ovl.tl{top:8px;left:8px;right:40%}.ovl.tr{top:8px;right:8px;justify-content:flex-end;max-width:58%}
.ovl.bot{left:8px;right:8px;bottom:8px;justify-content:center}
.ovl .pill,.ovl .al{background:rgba(10,14,24,.55);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-color:rgba(255,255,255,.14)}
.ovl .pill{padding:5px 10px;font-size:12px}
.ovl .pill.on{background:var(--nv-accent);color:var(--nv-accent-fg);box-shadow:none}
.ovl .al{background:color-mix(in srgb,var(--c) 55%,rgba(10,14,24,.6))}
.ovl .al ha-icon{color:inherit}
.cb{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(10,14,24,.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.16)}
.cb.on{background:var(--nv-active);color:var(--nv-active-fg)}
.cb:active,.pill:active{transform:scale(.92)}
.dot{position:absolute;left:10px;bottom:10px;z-index:1;display:flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;letter-spacing:.06em;padding:3px 8px;border-radius:999px;background:rgba(10,14,24,.55)}
.dot::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--nv-error)}
.has-ov .dot{display:none}
.x{display:none;position:absolute;top:10px;right:10px;z-index:3}
.media.fs{position:fixed;inset:0;z-index:9;border-radius:0;aspect-ratio:auto;background:#000}
.media.fs>img,.media.fs .live>*,.media:fullscreen>img,.media:fullscreen .live>*{object-fit:contain}
.media.fs .x,.media:fullscreen .x{display:flex}
.ptz{display:flex;align-items:center;gap:8px;z-index:2}
.ovl-ptz{position:absolute;right:10px;bottom:10px}
.ptz.below{justify-content:center}
.pad{width:var(--nova-camera-ptz-size,108px);aspect-ratio:1;border-radius:50%;display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);box-sizing:border-box;padding:4px;
background:rgba(10,14,24,.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.16)}
.below .pad{background:var(--nv-chip)}
.pad>i,.zm>i{font-style:normal;display:flex;align-items:center;justify-content:center;border-radius:50%;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:none;transition:background .15s}
.pad>i ha-icon{--mdc-icon-size:26px}
.pad>[data-k=up]{grid-area:1/2}.pad>[data-k=left]{grid-area:2/1}.pad>[data-k=right]{grid-area:2/3}.pad>[data-k=down]{grid-area:3/2}
.pad>[data-k=home]{grid-area:2/2;background:rgba(255,255,255,.12);margin:4px}.pad>[data-k=home] ha-icon{--mdc-icon-size:18px}
.zm{display:flex;flex-direction:column;gap:8px}
.zm>i{width:36px;height:36px;background:rgba(10,14,24,.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.16)}
.below .zm>i{background:var(--nv-chip)}
.pad>i.act,.zm>i.act{background:var(--nv-active);color:var(--nv-active-fg)}
.has-ptz .ovl.bot{right:calc(var(--nova-camera-ptz-size,108px) + 64px);justify-content:flex-start}
@container (max-width:320px){.pad{--nova-camera-ptz-size:88px}}
.split{display:grid;gap:8px;grid-template-columns:repeat(2,minmax(0,1fr));--nova-camera-ptz-size:84px}
.split.row{grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:minmax(0,1fr)}
.split.column{grid-template-columns:1fr}
.split>${tag('camera-card')}{display:block;min-width:0}
@container (max-width:420px){.split{grid-template-columns:1fr;grid-auto-flow:row}}
.g.bare{padding:0;background:none;border:none;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none;border-radius:0;overflow:visible}
.pill.lbl{font-weight:600}`;

const RATIO = {'16:9': '16/9', '4:3': '4/3', '1:1': '1/1', '21:9': '21/9', '9:16': '9/16'};
const CDEF = {aspect_ratio: '16:9', fit: 'cover', image_action: 'more-info', stream: 'auto', refresh: 10, buttons_position: 'overlay', show_header: true, ptz: 'auto', ptz_position: 'overlay', split_layout: 'grid'};
const CLISTS = ['buttons', 'chips', 'alerts', 'split'];

const hasCond = o => o.state != null || o.state_not != null || o.above != null || o.below != null;

// Steuerkreuz: Richtung → Button-Entität, Aktion oder ONVIF
const PTZ_KEYS = ['up', 'left', 'right', 'down', 'home', 'zoom_in', 'zoom_out'];
const PTZ_ICON = {up: 'mdi:chevron-up', down: 'mdi:chevron-down', left: 'mdi:chevron-left', right: 'mdi:chevron-right', home: 'mdi:crosshairs-gps', zoom_in: 'mdi:magnify-plus-outline', zoom_out: 'mdi:magnify-minus-outline'};
const PTZ_NAME = {up: 'Hoch', down: 'Runter', left: 'Links', right: 'Rechts', home: 'Ausgangsposition', zoom_in: 'Zoom +', zoom_out: 'Zoom −'};
const PTZ_ONVIF = {up: {tilt: 'UP'}, down: {tilt: 'DOWN'}, left: {pan: 'LEFT'}, right: {pan: 'RIGHT'}, zoom_in: {zoom: 'ZOOM_IN'}, zoom_out: {zoom: 'ZOOM_OUT'}};
const PTZ_RE = [['zoom_in', /zoom.?(in|rein|\+|nah)/], ['zoom_out', /zoom.?(out|raus|-|weg)/], ['left', /left|links/], ['right', /right|rechts/],
  ['down', /down|abw|runter|unten/], ['up', /up|aufw|hoch|oben/], ['home', /home|ausgang|zentr|center|mitte/]];
// Schwenk-/Neige-Buttons am selben Gerät wie die Kamera finden (z. B. tplink pan_left, tilt_up)
function ptzAuto(h, cam) {
  const dev = h?.entities?.[cam]?.device_id, m = {};
  if (!dev) return m;
  Object.values(h.entities).filter(e => e.device_id === dev && dom(e.entity_id) === 'button').forEach(e => {
    const s = `${e.entity_id} ${e.translation_key || ''} ${h.states[e.entity_id]?.attributes.friendly_name || ''}`.toLowerCase();
    if (!/pan|tilt|zoom|ptz|schwenk|neig|move|beweg|dreh|home|ausgang/.test(s)) return;
    const hit = PTZ_RE.find(([, re]) => re.test(s));
    if (hit && !m[hit[0]]) m[hit[0]] = e.entity_id;
  });
  return m;
}
function ptzMap(h, c) {
  const p = c.ptz;
  if (p === 'onvif') return dom(c.entity) === 'camera' ? {...PTZ_ONVIF, home: undefined} : {};
  const m = p === 'auto' || p === true ? ptzAuto(h, c.entity) : p && typeof p === 'object' ? p : {};
  return Object.fromEntries(PTZ_KEYS.filter(k => m[k]).map(k => [k, m[k]]));
}
// Gedrückt halten = weiterfahren
function repeat(el, fn, ms = 450) {
  let t;
  const stop = () => { clearInterval(t); el.classList.remove('act'); };
  el.classList.add('tap'); el.tabIndex = 0; el.setAttribute('role', 'button');
  el.addEventListener('pointerdown', e => { e.preventDefault(); e.stopPropagation(); stop(); el.classList.add('act'); fn(); t = setInterval(fn, ms); });
  ['pointerup', 'pointerleave', 'pointercancel'].forEach(n => el.addEventListener(n, stop));
  el.addEventListener('click', e => e.stopPropagation());
  el.addEventListener('contextmenu', e => e.preventDefault());
  el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); fn(); } });
}

// ha-camera-stream ist lazy – einmal über eine Bildkarte nachladen
let camPre;
const camStream = () => customElements.get('ha-camera-stream') ? Promise.resolve(true) : (camPre ||= (async () => {
  try { (await window.loadCardHelpers()).createCardElement({type: 'picture-entity', entity: 'camera.nova', camera_view: 'live'}); } catch {}
  return Promise.race([customElements.whenDefined('ha-camera-stream').then(() => true), new Promise(r => setTimeout(() => r(false), 3000))]);
})());

class NovaCameraCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('camera-card-editor')); }
  static getStubConfig(h) {
    const ids = Object.keys(h.states);
    return {entity: ids.find(i => i.startsWith('camera.')) || ids.find(i => i.startsWith('image.')) || 'camera.'};
  }
  constructor() {
    super();
    this._vis = false;
    this._onVis = () => this._sync();
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (!c.entity || !['camera', 'image'].includes(dom(c.entity))) throw new Error('entity muss eine camera.* oder image.* Entität sein');
    this._c = {...CDEF, ...c};
    CLISTS.forEach(k => { this._c[k] = [].concat(c[k] || []).map(toObj).filter(o => o.entity || o.tap_action); });
    this._ids = entityIds(this._c);
    this._built = false;
    this._stopLive();
    if (this._h) { this._build(); this._update(); }
  }
  // Neu zeichnen nur, wenn sich eine Entität der Karte (auch die gefundenen PTZ-Buttons) geändert hat
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    this._kids?.forEach(k => { k.hass = h; });
    if (!this._built) this._build();
    else if (!hassChanged(old, h, [...this._ids, ...Object.values(this._ptz || {}).filter(v => typeof v === 'string')])) return;
    this._update();
  }
  getCardSize() { return 5 + (this._c?.split.length ? 3 : 0); }
  getGridOptions() { return {columns: 12, rows: 'auto', min_columns: 4}; }
  connectedCallback() {
    // In der Kartenauswahl nur ein Standbild: kein Stream, kein Nachladen im Takt
    this._quiet = inPicker(this);
    document.addEventListener('visibilitychange', this._onVis);
    if ('IntersectionObserver' in window) {
      this._io ||= new IntersectionObserver(es => { this._vis = es[es.length - 1].isIntersecting; this._sync(); }, {rootMargin: '100px'});
      this._io.observe(this);
    } else { this._vis = true; this._sync(); }
  }
  disconnectedCallback() {
    document.removeEventListener('visibilitychange', this._onVis);
    this._io?.disconnect();
    this._vis = false;
    this._sync();
  }
  _build() {
    this._built = true;
    const c = this._c, r = this.shadowRoot || this.attachShadow({mode: 'open'});
    const hb = c.button_icon || (c.button_action?.action && c.button_action.action !== 'none');
    const ov = c.buttons_position !== 'below';
    this._ptz = ptzMap(this._h, c);
    const pk = Object.keys(this._ptz), pov = c.ptz_position !== 'below';
    this.classList.toggle('nv-flat', !!c.bare);
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${CCSS}</style><div class="g cam${c.bare ? ' bare' : ''}">
${c.show_header !== false ? `<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${hb ? '<div class="hb"></div>' : ''}</div>` : ''}
<div class="media${ov && c.buttons.length ? ' has-ov' : ''}${pk.length && pov ? ' has-ptz' : ''}"><div class="ph"><ha-icon icon="mdi:cctv-off"></ha-icon></div><img class="still" alt=""><div class="live"></div>
<span class="dot" hidden>LIVE</span><div class="ovl tl"></div><div class="ovl tr"></div>${ov ? '<div class="ovl bot"></div>' : ''}<div class="cb x" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></div>${pk.length && pov ? '<div class="ptz ovl-ptz"></div>' : ''}</div>
${pk.length && !pov ? '<div class="ptz below"></div>' : ''}${!ov && c.buttons.length ? '<div class="pills below"></div>' : ''}</div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), hd: q('.hd'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), media: q('.media'), still: q('.still'), live: q('.live'), ph: q('.ph'), dot: q('.dot')};
    const m = this._e.media;
    m.style.setProperty('--ar', RATIO[c.aspect_ratio] || String(c.aspect_ratio).replace(':', '/'));
    m.style.setProperty('--fit', c.fit === 'contain' ? 'contain' : 'cover');
    this._e.still.addEventListener('load', () => { this._e.ph.hidden = true; });
    this._e.still.addEventListener('error', () => { this._e.ph.hidden = false; });
    if (this._e.hd) {
      press(this._e.ic, {tap: () => this._act({entity: c.entity, tap_action: c.tap_action}, 'tap', true), hold: () => this._act({entity: c.entity, hold_action: c.hold_action}, 'hold')});
      if (hb) { setIcon(q('.hb'), c.button_icon || 'mdi:dots-horizontal'); press(q('.hb'), {tap: () => this._act({entity: c.status || c.entity, tap_action: c.button_action}, 'tap', true)}); }
    }
    m.addEventListener('click', e => { if (!e.composedPath().some(x => x.classList?.contains('tap'))) this._tapImage(); });
    press(q('.x'), {tap: () => this._fullscreen(false)});
    this._btns = c.buttons.map(o => {
      const el = document.createElement('div');
      el.className = ov ? 'cb' : 'pill';
      el.innerHTML = ov ? '<span class="i"></span>' : '<span class="i"></span><span class="t"></span>';
      press(el, {tap: () => this._act(o, 'tap'), hold: () => this._act(o, 'hold')});
      q(ov ? '.ovl.bot' : '.below').append(el);
      return [el, o];
    });
    this._chips = c.chips.map(o => { const el = document.createElement('div'); el.className = 'pill'; el.innerHTML = '<span class="i"></span><span class="t"></span>'; press(el, {tap: () => this._act(o, 'tap', true)}); q('.ovl.tl').append(el); return [el, o]; });
    this._alerts = c.alerts.map(o => { const el = document.createElement('div'); el.className = `al ${o.level || 'warning'}`; el.innerHTML = '<span class="i"></span><span class="t"></span>'; press(el, {tap: () => this._act(o, 'tap', true)}); q('.ovl.tr').append(el); return [el, o]; });
    if (pk.length) {
      const box = q('.ptz'), dirs = pk.filter(k => !k.startsWith('zoom')), zm = pk.filter(k => k.startsWith('zoom'));
      const mk = k => { const el = document.createElement('i'); el.dataset.k = k; el.title = PTZ_NAME[k]; el.innerHTML = `<ha-icon icon="${PTZ_ICON[k]}"></ha-icon>`; repeat(el, () => this._ptzGo(k)); return el; };
      if (dirs.length) { const pad = document.createElement('div'); pad.className = 'pad'; pad.append(...dirs.map(mk)); box.append(pad); }
      if (zm.length) { const z = document.createElement('div'); z.className = 'zm'; z.append(...zm.map(mk)); box.append(z); }
      this._ptzEls = [...box.querySelectorAll('[data-k]')];
    } else this._ptzEls = [];
    const lbl = c.label ?? (c.split.length ? this._h.states[c.entity]?.attributes.friendly_name : null);
    if (lbl) { const l = document.createElement('div'); l.className = 'pill lbl'; l.textContent = lbl; q('.ovl.tl').prepend(l); }
    // Splitscreen: weitere Kameras als schlanke Kacheln neben dem Hauptbild
    this._kids = [];
    if (c.split.length) {
      const sp = document.createElement('div');
      sp.className = `split ${c.split_layout}`;
      m.before(sp); sp.append(m);
      this._kids = c.split.map(o => {
        const k = document.createElement(tag('camera-card'));
        try {
          k.setConfig({entity: o.entity, bare: true, show_header: false, label: o.name ?? this._h.states[o.entity]?.attributes.friendly_name ?? o.entity,
            aspect_ratio: c.aspect_ratio, fit: c.fit, stream: c.stream, refresh: c.refresh, image_action: o.image_action || c.image_action,
            ptz: o.ptz === 'off' ? false : o.ptz ?? 'auto', ...(o.ptz_onvif ? {ptz_onvif: o.ptz_onvif} : {})});
        } catch (e) { console.warn('[nova-cards] Splitscreen', o.entity, e.message); return null; }
        k.hass = this._h;
        sp.append(k);
        return k;
      }).filter(Boolean);
    }
    this._stillKey = null;
    this._sync();
  }
  _update() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !e) return;
    const s = h.states[c.entity], st = c.status && h.states[c.status];
    e.g.classList.toggle('na', !s || s.state === 'unavailable');
    this.classList.toggle('nv-na', !s || s.state === 'unavailable');
    if (e.hd) {
      e.name.textContent = c.name ?? s?.attributes.friendly_name ?? c.entity;
      setIcon(e.ic, c.icon || st?.attributes.icon || s?.attributes.icon || (dom(c.entity) === 'image' ? 'mdi:image' : 'mdi:cctv'));
      e.sub.textContent = st ? fmtState(h, st) : !s ? 'nicht gefunden' : this._mode ? 'Live' : '';
      e.hd.classList.toggle('on', st ? isOn(st) : !!this._mode);
    }
    this._btns.forEach(([el, o]) => {
      const bs = o.entity && h.states[o.entity];
      el.classList.toggle('na', !!o.entity && (!bs || bs.state === 'unavailable'));
      el.classList.toggle('on', !!bs && TOGGLE.includes(dom(o.entity)) && isOn(bs));
      setIcon(el.firstChild, iconOf(h, o, 'mdi:gesture-tap-button'));
      el.title = nameOf(h, o);
      if (el.children[1]) el.children[1].textContent = o.name ?? (bs?.attributes.friendly_name || '');
    });
    this._chips.forEach(([el, o]) => {
      const cs = h.states[o.entity];
      el.hidden = !cs || (hasCond(o) && !alertHit(o, cs));
      if (el.hidden) return;
      el.classList.toggle('on', dom(o.entity) === 'binary_sensor' && cs.state === 'on');
      setIcon(el.firstChild, iconOf(h, o, 'mdi:information-outline'));
      const v = valueOf(h, cs, o);
      el.lastChild.textContent = o.name ? `${o.name} · ${v}` : v;
    });
    let lvl = 0;
    this._alerts.forEach(([el, o]) => {
      const as = h.states[o.entity], hit = alertHit(o, as);
      el.hidden = !hit;
      if (!hit) return;
      lvl = Math.max(lvl, o.level === 'error' ? 2 : o.level === 'info' ? 0 : 1);
      setIcon(el.firstChild, o.icon || (o.level === 'error' ? 'mdi:alert-octagon' : o.level === 'info' ? 'mdi:information' : 'mdi:alert'));
      el.lastChild.textContent = o.message ? o.message.replace('{state}', fmtState(h, as)) : `${nameOf(h, o)}: ${fmtState(h, as)}`;
    });
    this._ptzEls.forEach(el => { const v = this._ptz[el.dataset.k]; el.classList.toggle('na', typeof v === 'string' && (!h.states[v] || h.states[v].state === 'unavailable')); });
    if (c.glow === false) lvl = 0;
    e.g.classList.toggle('warn', lvl === 1);
    e.g.classList.toggle('err', lvl === 2);
    // image.* bekommt ein neues Bild, wenn sich der Zustand ändert
    if (dom(c.entity) === 'image' && s && this._stillKey !== s.state) this._still();
    if (this._liveEl && 'hass' in this._liveEl) this._liveEl.hass = h;
  }
  _ptzGo(k) {
    const v = this._ptz[k], c = this._c;
    if (this._c.ptz === 'onvif') return this._h.callService('onvif', 'ptz', {entity_id: c.entity, ...v, ...(c.ptz_onvif || {})}).catch(e => console.warn('[nova-cards] onvif.ptz', e));
    if (typeof v === 'string') return this._act({entity: v}, 'tap');
    if (v?.action) return this._act({entity: c.entity, tap_action: v}, 'tap');
  }
  _still() {
    const s = this._h?.states[this._c.entity], p = s?.attributes.entity_picture;
    if (!p) return;
    this._stillKey = s.state;
    this._e.still.src = stamp(p, dom(this._c.entity) === 'image' ? s.state : Date.now());
  }
  // Stream nur, wenn Karte sichtbar und Tab aktiv – sonst Standbild
  _sync() {
    if (!this._e || !this._h) return;
    const show = this._vis && !document.hidden && this.isConnected;
    const live = show && !this._quiet && dom(this._c.entity) === 'camera' && this._c.stream !== 'snapshot';
    if (live && !this._mode && !this._starting) this._startLive();
    if (!live) this._stopLive();
    clearInterval(this._tm); this._tm = null;
    if (show && dom(this._c.entity) === 'camera' && !this._mode) {
      if (!this._e.still.src) this._still();
      if (this._c.refresh > 0 && !this._quiet) this._tm = setInterval(() => !this._mode && this._still(), this._c.refresh * 1000);
    }
  }
  async _startLive() {
    const c = this._c, id = this._lid = (this._lid || 0) + 1;
    this._starting = true;
    let mode = c.stream;
    if (mode === 'webrtc' && !customElements.get('webrtc-camera')) mode = 'auto';
    if (mode === 'auto') mode = await camStream() ? 'ha' : 'mjpeg';
    this._starting = false;
    if (id !== this._lid || !this._vis || document.hidden) return;
    const s = this._h.states[c.entity];
    if (!s) return;
    let el;
    if (mode === 'webrtc') {
      el = document.createElement('webrtc-camera');
      try { el.setConfig({entity: c.entity, ui: false, muted: true, ...(c.webrtc || {})}); } catch (e) { console.warn('[nova-cards] webrtc-camera', e); }
      el.hass = this._h;
    } else if (mode === 'ha') {
      el = document.createElement('ha-camera-stream');
      Object.assign(el, {hass: this._h, stateObj: s, muted: true, controls: false, fitMode: c.fit === 'contain' ? 'contain' : 'cover'});
    } else {
      const p = s.attributes.entity_picture;
      if (!p) return;
      el = document.createElement('img');
      el.alt = '';
      el.src = p.replace('/api/camera_proxy/', '/api/camera_proxy_stream/');
      el.addEventListener('error', () => { if (this._liveEl !== el) return; this._stopLive(); this._retry = setTimeout(() => this._sync(), 10000); });
    }
    this._mode = mode;
    this._liveEl = el;
    this._e.live.replaceChildren(el);
    this._e.dot.hidden = false;
    this._e.ph.hidden = true;
    this._sync(); this._update();
  }
  _stopLive() {
    this._lid = (this._lid || 0) + 1;
    this._starting = false;
    clearTimeout(this._retry);
    if (!this._mode) return;
    if (this._liveEl?.tagName === 'IMG') this._liveEl.src = ''; // MJPEG-Verbindung wirklich schließen
    this._liveEl = null; this._mode = null;
    if (this._e) { this._e.live.replaceChildren(); this._e.dot.hidden = true; this._still(); this._update(); }
  }
  _tapImage() {
    const a = this._c.image_action;
    if (a === 'none') return;
    if (a === 'fullscreen') return this._fullscreen(!this._isFs());
    moreInfo(this, this._c.entity);
  }
  _isFs() { return this._e.media.classList.contains('fs') || this.shadowRoot.fullscreenElement === this._e.media; }
  _fullscreen(on) {
    const m = this._e.media;
    if (!on) { m.classList.remove('fs'); if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {}); return; }
    // iOS/ältere WebViews: Fallback auf festes Overlay
    const p = m.requestFullscreen?.();
    if (p?.catch) p.catch(() => m.classList.add('fs')); else if (!p) m.classList.add('fs');
  }
  _act(o, kind, info) { return runAction(this, o, kind, info); }
}
define('camera-card', NovaCameraCard, {name: 'Nova Kamera Card', description: 'Live-Bild von camera.* oder image.* mit Kopfzeile, rundem PTZ-Steuerkreuz, Splitscreen, frei belegbaren Buttons (Licht, Sirene …), Info-Chips und Warnungen.', documentationURL: docUrl('nova-kamera-card')});

/* ---------- Editor Kamera Card ---------- */
const C_GEN = [
  {name: 'entity', required: true, selector: {entity: {domain: ['camera', 'image']}}},
  g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}}),
  {name: 'status', selector: {entity: {}}},
  {name: 'show_header', selector: {boolean: {}}},
];
const C_IMG = [
  g2(sel('aspect_ratio', [['16:9', '16:9'], ['4:3', '4:3'], ['1:1', '1:1']]), sel('fit', [['cover', 'Füllen'], ['contain', 'Ganzes Bild']])),
  g2(sel('stream', [['auto', 'Automatisch'], ['mjpeg', 'MJPEG'], ['webrtc', 'WebRTC-Karte'], ['snapshot', 'Nur Standbild']]),
     {name: 'refresh', selector: {number: {min: 0, max: 300, mode: 'box', unit_of_measurement: 's'}}}),
];
const C_BTN = [sel('buttons_position', [['overlay', 'Über dem Bild'], ['below', 'Darunter']])];
const C_WARN = [{name: 'glow', selector: {boolean: {}}}];
const C_SPLIT = [sel('split_layout', [['grid', 'Raster (2 Spalten)'], ['row', 'Nebeneinander'], ['column', 'Untereinander']])];
const C_ACT = [
  {name: 'tap_action', selector: A},
  sel('image_action', [['more-info', 'Details (more-info)'], ['fullscreen', 'Vollbild'], ['none', 'Nichts']]),
];
const C_HBTN = [g2({name: 'button_icon', selector: I}, {name: 'button_action', selector: A})];
const CPTZ = [g2(sel('ptz', [['auto', 'Automatisch (Geräte-Buttons)'], ['manual', 'Manuell'], ['onvif', 'ONVIF'], ['off', 'Aus']]), sel('ptz_position', [['overlay', 'Über dem Bild'], ['below', 'Darunter']]))];
const PBTN = {entity: {domain: ['button', 'input_button', 'script', 'scene']}};
const CPTZM = [g2({name: 'up', selector: PBTN}, {name: 'down', selector: PBTN}), g2({name: 'left', selector: PBTN}, {name: 'right', selector: PBTN}),
  {name: 'home', selector: PBTN}, g2({name: 'zoom_in', selector: PBTN}, {name: 'zoom_out', selector: PBTN})];
const CM = {
  buttons: {label: 'Steuer-Buttons', item: 'Button', icon: 'mdi:gesture-tap-button',
    items: [NAMEICON, {name: 'entity', selector: {entity: {}}}, {name: 'tap_action', selector: A}, {name: 'hold_action', selector: A}, {name: 'confirm', selector: T}]},
  chips: {label: 'Info-Chips', item: 'Chip', icon: 'mdi:information-outline',
    items: [ENT, NAMEICON, g2({name: 'unit', selector: T}, {name: 'decimals', selector: {number: {min: 0, max: 4, mode: 'box'}}}),
      g2({name: 'state', selector: T}, {name: 'state_not', selector: T}), g2(NUM('above'), NUM('below'))]},
  split: {label: 'Splitscreen (weitere Kameras)', item: 'Kamera', icon: 'mdi:view-split-vertical',
    items: [{name: 'entity', required: true, selector: {entity: {domain: ['camera', 'image']}}},
      g2({name: 'name', selector: T}, sel('ptz', [['auto', 'Automatisch'], ['onvif', 'ONVIF'], ['off', 'Aus']]))]},
  alerts: {label: 'Warn-Badges', item: 'Warnung', icon: 'mdi:alert-outline',
    items: [ENT, g2({name: 'state', selector: T}, {name: 'state_not', selector: T}), g2(NUM('above'), NUM('below')),
      {name: 'message', selector: T}, g2({name: 'icon', selector: I}, sel('level', [['warning', 'Warnung'], ['error', 'Fehler'], ['info', 'Hinweis']]))]},
};
const CLABELS = {...BASE_LABELS, status: 'Status-Entität (optional)', show_header: 'Kopfzeile anzeigen', glow: 'Kartenrahmen bei Warnung einfärben',
  tap_action: 'Aktion beim Antippen', aspect_ratio: 'Seitenverhältnis', fit: 'Bild einpassen', image_action: 'Bild antippen',
  stream: 'Live-Stream', refresh: 'Standbild aktualisieren alle', buttons_position: 'Buttons', state: 'Bedingung: Zustand', state_not: 'Bedingung: außer Zustand',
  above: 'Bedingung: über', below: 'Bedingung: unter', ptz: 'Steuerkreuz', ptz_position: 'Steuerkreuz-Position', split_layout: 'Splitscreen-Anordnung',
  up: 'Hoch (neigen)', down: 'Runter (neigen)', left: 'Links (schwenken)', right: 'Rechts (schwenken)', home: 'Mitte / Ausgangsposition', zoom_in: 'Zoom +', zoom_out: 'Zoom −'};
const CHELPERS = {
  entity: 'camera.* = Live-Stream, image.* = Bild (z. B. 3D-Drucker)',
  stream: 'Automatisch = HA-Stream (HLS/WebRTC), sonst MJPEG. Läuft nur, solange die Karte sichtbar ist',
  refresh: 'Nur ohne Live-Stream. 0 = aus',
  state: 'Komma-Liste. Chips: leer = immer sichtbar · Warnungen: leer = bei „on“/„problem“',
  tap_action: 'Gilt für das Icon oben. Standard: Details der Kamera',
  message: 'Leer = Name: Zustand. {state} wird ersetzt',
  split_layout: 'Schmale Karten stapeln automatisch',
  ptz: 'Automatisch sucht Schwenk-/Neige-Buttons am Gerät der Kamera. Gedrückt halten = weiterfahren',
};

class NovaCameraCardEditor extends NovaEditorBase {
  static labels = CLABELS;
  static helpers = CHELPERS;
  static openSections = ['general'];
  _build() {
    const r = this.shadowRoot, c0 = this._config;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), data = {...CDEF, glow: true, ...c0};
    const form = schema => this._form(schema, data, v => {
      const c = merge(this._config, names(schema), v);
      Object.entries(CDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
      if (c.glow === true) delete c.glow;
      this._emit(c);
    });
    const list = (b, k) => { const m = CM[k]; this._itemList(b, k, m.items, m, `${m.item} hinzufügen`); };
    w.append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => b.append(form(C_GEN))),
      this._section('image', 'mdi:image-outline', 'Bild und Stream', b => b.append(form(C_IMG))),
      this._section('ptz', 'mdi:arrow-all', 'Steuerkreuz', b => this._ptz(b)),
      this._section('buttons', CM.buttons.icon, CM.buttons.label, b => { b.append(form(C_BTN)); list(b, 'buttons'); }),
      this._section('info', 'mdi:information-outline', 'Infos und Warnungen', b => {
        b.append(this._h4(CM.chips.label)); list(b, 'chips');
        b.append(this._h4(CM.alerts.label), form(C_WARN)); list(b, 'alerts');
      }),
      this._section('split', CM.split.icon, CM.split.label, b => {
        if (this._items('split').length) b.append(form(C_SPLIT));
        list(b, 'split');
      }),
      this._section('actions', 'mdi:gesture-tap', 'Aktionen', b => b.append(form(C_ACT), this._h4('Button in der Kopfzeile'), form(C_HBTN))));
  }
  // Steuerkreuz: Modus, bei „Manuell“ die Buttons, bei „Automatisch“ was gefunden wurde
  _ptz(w) {
    const p = this._config.ptz, mode = p === undefined || p === true ? 'auto' : p === false ? 'off' : typeof p === 'object' ? 'manual' : p;
    w.append(this._form(CPTZ, {ptz: mode, ptz_position: this._config.ptz_position || 'overlay'}, v => {
      const c = {...this._config};
      if (v.ptz === 'auto') delete c.ptz; else if (v.ptz === 'off') c.ptz = false; else if (v.ptz === 'manual') c.ptz = typeof p === 'object' ? p : {}; else c.ptz = v.ptz;
      if (v.ptz_position === 'overlay') delete c.ptz_position; else c.ptz_position = v.ptz_position;
      this._emit(c);
      if (v.ptz !== mode) this._rebuild();
    }));
    if (mode === 'manual') {
      w.append(this._form(CPTZM, {...p}, v => {
        const o = Object.fromEntries(PTZ_KEYS.filter(k => v[k]).map(k => [k, v[k]]));
        this._emit({...this._config, ptz: o});
      }));
    } else if (mode === 'auto') {
      const found = Object.keys(ptzAuto(this._hass, this._config.entity));
      w.append(this._hint(found.length ? `Gefunden: ${found.map(k => PTZ_NAME[k]).join(', ')}` : 'Keine Schwenk-/Neige-Buttons am Gerät gefunden – dann „Manuell“ wählen.'));
    }
  }
}
define('camera-card-editor', NovaCameraCardEditor);
