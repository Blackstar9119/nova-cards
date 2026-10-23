import {define, docUrl} from './shared/define.js';
import {dom, setIcon, list, toObj, mapIcon} from './shared/utils.js';
import {fmtState, hasF} from './shared/state.js';
import {moreInfo, runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, EDITOR_CSS, EDITOR_ICON_CSS, EDITOR_LIST_CSS, MAPROW_CSS} from './shared/styles.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, A, sel, NAMEICON, BASE_LABELS} from './shared/editor-schema.js';

/* ---------- Nova Media Card ---------- */
const MPCSS = `
.g.mp{gap:12px;min-height:var(--nova-media-min-height,0)}
.g.mp.play{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-accent) 40%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.mp>*{position:relative;z-index:1}
.mp>.art{position:absolute;inset:0;z-index:0;background:center/cover no-repeat;opacity:0;transition:opacity .6s,filter .6s;pointer-events:none}
.mp.has-art>.art{opacity:var(--nova-media-artwork-opacity,.5)}
.mp.cover>.art{filter:blur(22px) saturate(140%);transform:scale(1.2)}
.mp:not(.play)>.art{filter:grayscale(.6)}.mp.cover:not(.play)>.art{filter:blur(22px) grayscale(.6)}
.mp>.shade{position:absolute;inset:0;z-index:0;background:linear-gradient(180deg,rgba(10,14,24,.05),rgba(10,14,24,.55));opacity:0;transition:opacity .6s;pointer-events:none}
.mp.has-art>.shade{opacity:1}
.mp .hd .ic img{width:26px;height:26px;border-radius:6px}
.hb.on{background:var(--nv-accent);color:var(--nv-accent-fg)}
.now{display:flex;align-items:center;gap:12px;min-width:0}
.thumb{width:72px;height:72px;flex:none;border-radius:14px;background:var(--nv-chip) center/cover no-repeat;box-shadow:0 4px 14px rgba(0,0,0,.35);display:none}
.mp.cover.has-art .thumb{display:block}
.tt{flex:1;min-width:0}.tt b,.tt span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 4px rgba(0,0,0,.35)}
.tt b{font-size:17px;font-weight:600}.tt span{font-size:13px;opacity:.75;margin-top:2px}
.bar{display:flex;align-items:center;gap:8px;font-size:11px;opacity:.85;font-variant-numeric:tabular-nums}
.bar .tr{flex:1;height:6px;border-radius:3px;background:rgba(255,255,255,.14);overflow:hidden}
.bar.seek .tr{cursor:pointer}
.bar .tr i{display:block;height:100%;width:0;background:var(--nv-accent);border-radius:3px;transition:width 1s linear}
.ctl{display:flex;align-items:center;justify-content:center;gap:14px}
.ctl .cb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);transition:all .2s}
.ctl .cb ha-icon{--mdc-icon-size:24px}
.ctl .cb.pp{width:56px;height:56px;background:var(--nv-accent);color:var(--nv-accent-fg);border-color:transparent;box-shadow:0 0 16px color-mix(in srgb,var(--nv-accent) 45%,transparent)}
.ctl .cb.pp ha-icon{--mdc-icon-size:30px}
.cb:active{transform:scale(.9)}
.vol{display:flex;align-items:center;gap:10px}
.vol .cb{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip)}
.vol .cb ha-icon{--mdc-icon-size:18px}
.vol .cb.on{background:var(--nv-error);color:#fff}
.vol .v{min-width:38px;text-align:right;font-size:13px;font-weight:600}
.vol input{flex:1}
.vol .step{flex:1;display:flex;justify-content:center;gap:10px}
.src,.pls{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:0 -2px;padding:2px}
.src::-webkit-scrollbar,.pls::-webkit-scrollbar{display:none}
.pls .pill.on{background:var(--nv-accent);color:var(--nv-accent-fg);box-shadow:none}
.pls .pill .eq{display:none;--mdc-icon-size:14px}.pls .pill.pl .eq{display:flex}
.mp.off .now,.mp.off .bar,.mp.off .ctl,.mp.off .vol,.mp.off .src{display:none}
@container (max-width:300px){.ctl{gap:8px}.ctl .cb{width:38px;height:38px}.ctl .cb.pp{width:48px;height:48px}.thumb{width:56px;height:56px}.tt b{font-size:15px}}`;

// supported_features von media_player
const MF = {PAUSE: 1, SEEK: 2, VOL_SET: 4, MUTE: 8, PREV: 16, NEXT: 32, ON: 128, OFF: 256, VOL_STEP: 1024, SOURCE: 2048, STOP: 4096, PLAY: 16384};
const MDEF = {artwork: 'background', show_progress: true, show_volume: true, show_mute: true, show_power: true, show_source: false, show_players: true, auto_switch: true};

const clock = t => { t = Math.max(0, Math.floor(t || 0)); const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), x = String(t % 60).padStart(2, '0'); return h ? `${h}:${String(m).padStart(2, '0')}:${x}` : `${m}:${x}`; };
const posOf = s => {
  const a = s.attributes;
  if (a.media_position == null) return null;
  const upd = a.media_position_updated_at ? Date.parse(a.media_position_updated_at) : NaN;
  return a.media_position + (s.state === 'playing' && !isNaN(upd) ? (Date.now() - upd) / 1000 : 0);
};

// Music Assistant legt je Gerät einen eigenen Player an – nur der kennt Titel, Cover und Vor/Zurück
const MA_ON = ['playing', 'paused', 'buffering'];
function maOf(h, id, ma) {
  if (ma === false || !id) return null;
  if (typeof ma === 'string') return ma;
  if (h.entities?.[id]?.platform === 'music_assistant') return null;
  const n = h.states[id]?.attributes.friendly_name;
  const hits = Object.values(h.entities || {}).map(e => e.entity_id)
    .filter(x => x !== id && dom(x) === 'media_player' && h.entities[x].platform === 'music_assistant' && h.states[x]?.attributes.friendly_name === n);
  return hits.find(x => x.startsWith(id)) || hits.find(x => MA_ON.includes(h.states[x].state)) || hits[0] || null;
}
const cssUrl = u => `url("${String(u).replace(/["\\\n]/g, encodeURIComponent)}")`;

class NovaMediaCard extends HTMLElement {
  static getConfigElement() { return document.createElement('nova-media-card-editor'); }
  static getStubConfig(h) {
    const ids = Object.keys(h.states).filter(i => i.startsWith('media_player.'));
    return {entity: ids.find(i => h.states[i].state === 'playing') || ids[0] || 'media_player.'};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (!c.entity || dom(c.entity) !== 'media_player') throw new Error('entity muss eine media_player.* Entität sein');
    this._c = {...MDEF, ...c, players: [].concat(c.players || []).map(toObj).filter(o => dom(o.entity) === 'media_player')};
    this._all = [{entity: c.entity, name: c.name, icon: c.icon}, ...this._c.players];
    this._idx = 0; this._manual = false;
    this._built = false;
    if (this._h) { this._build(); this._update(); }
  }
  set hass(h) {
    this._h = h;
    if (!this._c) return;
    if (!this._built) this._build();
    this._update();
  }
  getCardSize() { return 4; }
  getGridOptions() { return {columns: 12, rows: 'auto', min_columns: 4}; }
  connectedCallback() { if (this._built) this._tick(); }
  disconnectedCallback() { clearInterval(this._tm); this._tm = null; }
  get _p() { return this._all[this._idx]; }
  // Spielt der Music-Assistant-Zwilling, kommen Anzeige und Steuerung von dort
  _eidOf(i) { const ma = this._ma?.[i], s = ma && this._h?.states[ma]; return s && MA_ON.includes(s.state) ? ma : this._all[i].entity; }
  get _eid() { return this._eidOf(this._idx); }
  _build() {
    this._built = true;
    const c = this._c, r = this.shadowRoot || this.attachShadow({mode: 'open'});
    this._ma = this._all.map(o => maOf(this._h, o.entity, o.music_assistant ?? c.music_assistant));
    const multi = this._all.length > 1 && c.show_players !== false;
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${MPCSS}</style><div class="g mp${c.artwork === 'cover' ? ' cover' : ''}">
${c.artwork !== 'none' ? '<div class="art"></div><div class="shade"></div>' : ''}
${multi ? '<div class="pills pls"></div>' : ''}
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${c.show_power !== false ? '<div class="hb pw" title="Ein/Aus"><ha-icon icon="mdi:power"></ha-icon></div>' : ''}</div>
<div class="now"><div class="thumb"></div><div class="tt"><b></b><span></span></div></div>
${c.show_progress !== false ? '<div class="bar"><span class="a">0:00</span><div class="tr"><i></i></div><span class="b">0:00</span></div>' : ''}
<div class="ctl"><div class="cb pv" title="Zurück"><ha-icon icon="mdi:skip-previous"></ha-icon></div><div class="cb pp" title="Play/Pause"><ha-icon icon="mdi:play"></ha-icon></div><div class="cb nx" title="Weiter"><ha-icon icon="mdi:skip-next"></ha-icon></div></div>
${c.show_volume !== false || c.show_mute !== false ? `<div class="vol">${c.show_mute !== false ? '<div class="cb mu" title="Stumm"><ha-icon icon="mdi:volume-high"></ha-icon></div>' : ''}${c.show_volume !== false ? '<input type="range" min="0" max="100" step="1"><div class="step"><div class="cb vd" title="Leiser"><ha-icon icon="mdi:volume-minus"></ha-icon></div><div class="cb vu" title="Lauter"><ha-icon icon="mdi:volume-plus"></ha-icon></div></div><span class="v"></span>' : ''}</div>` : ''}
${c.show_source ? '<div class="pills src"></div>' : ''}</div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), art: q('.art'), thumb: q('.thumb'), pls: q('.pls'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), pw: q('.pw'),
      title: q('.tt b'), artist: q('.tt span'), bar: q('.bar'), fill: q('.bar i'), ta: q('.bar .a'), tb: q('.bar .b'),
      pv: q('.pv'), pp: q('.pp'), nx: q('.nx'), mu: q('.mu'), vol: q('.vol input'), step: q('.vol .step'), vv: q('.vol .v'), src: q('.src')};
    const e = this._e, svc = (s, d = {}, id = this._eid) => this._h.callService('media_player', s, {entity_id: id, ...d});
    press(e.ic, {tap: () => this._act({entity: this._eid, tap_action: c.tap_action}, 'tap', true), hold: () => this._act({entity: this._eid, hold_action: c.hold_action}, 'hold')});
    if (e.pw) press(e.pw, {tap: () => { const id = this._p.entity, s = this._h.states[id], on = s && !['off', 'standby'].includes(s.state); svc(!on ? 'turn_on' : hasF(s, MF.OFF) ? 'turn_off' : 'toggle', {}, id); }});
    press(e.pp, {tap: () => svc(this._st()?.state === 'playing' && !hasF(this._st(), MF.PAUSE) ? 'media_stop' : 'media_play_pause')});
    press(e.pv, {tap: () => svc('media_previous_track')});
    press(e.nx, {tap: () => svc('media_next_track')});
    if (e.mu) press(e.mu, {tap: () => svc('volume_mute', {is_volume_muted: !this._st()?.attributes.is_volume_muted})});
    if (e.step) { press(e.step.children[0], {tap: () => svc('volume_down')}); press(e.step.children[1], {tap: () => svc('volume_up')}); }
    if (e.vol) {
      const show = () => { e.vol.style.setProperty('--p', `${e.vol.value}%`); e.vv.textContent = `${e.vol.value} %`; };
      e.vol.addEventListener('pointerdown', () => { this._drag = true; });
      e.vol.addEventListener('input', () => { this._drag = true; show(); });
      e.vol.addEventListener('change', () => { this._drag = false; show(); svc('volume_set', {volume_level: +e.vol.value / 100}); });
    }
    if (e.bar) e.bar.querySelector('.tr').addEventListener('click', ev => {
      const s = this._st(), d = s?.attributes.media_duration;
      if (!d || !hasF(s, MF.SEEK)) return;
      const b = ev.currentTarget.getBoundingClientRect();
      svc('media_seek', {seek_position: Math.round(Math.min(1, Math.max(0, (ev.clientX - b.left) / b.width)) * d)});
    });
    if (e.pls) this._chips = this._all.map((o, i) => {
      const el = document.createElement('div');
      el.className = 'pill';
      el.innerHTML = '<span class="i"></span><span class="t"></span><ha-icon class="eq" icon="mdi:equalizer"></ha-icon>';
      press(el, {tap: () => { this._idx = i; this._manual = true; this._srcKey = null; this._update(); }, hold: () => moreInfo(this, o.entity)});
      e.pls.append(el);
      return el;
    });
    this._srcKey = null;
    this._tick();
  }
  _st() { return this._h?.states[this._eid]; }
  _update() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !e) return;
    // Automatisch zum Player wechseln, der gerade spielt – bis man selbst umschaltet
    if (c.auto_switch !== false && !this._manual && this._all.length > 1 && h.states[this._eid]?.state !== 'playing') {
      const i = this._all.findIndex((o, j) => h.states[this._eidOf(j)]?.state === 'playing');
      if (i >= 0 && i !== this._idx) { this._idx = i; this._srcKey = null; }
    }
    const p = this._p, n = h.states[p.entity], s = h.states[this._eid], a = s?.attributes || {};
    const off = !s || ['off', 'unavailable', 'unknown', 'standby'].includes(s.state), play = s?.state === 'playing';
    e.g.classList.toggle('na', !s || s.state === 'unavailable');
    e.g.classList.toggle('off', off);
    e.g.classList.toggle('play', play && c.glow !== false);
    const app = a.app_name || (a.app_id === 'music_assistant' ? 'Music Assistant' : a.source);
    const logo = mapIcon(c.icon_map, c.icon_entity && h.states[c.icon_entity]?.state, a.app_name, a.app_id, a.source, a.media_channel);
    e.name.textContent = p.name ?? n?.attributes.friendly_name ?? a.friendly_name ?? p.entity;
    e.sub.textContent = !s ? 'nicht gefunden' : off ? fmtState(h, s) : [app, play ? null : fmtState(h, s)].filter(Boolean).join(' · ') || fmtState(h, s);
    setIcon(e.ic, logo || p.icon || a.icon || (a.device_class === 'tv' ? 'mdi:television' : a.device_class === 'speaker' ? 'mdi:speaker' : 'mdi:cast'));
    e.ic.parentElement.classList.toggle('on', !off);
    if (e.pw) { e.pw.classList.toggle('on', !off); e.pw.hidden = !!n && !hasF(n, MF.ON) && !hasF(n, MF.OFF); }
    e.title.textContent = a.media_title || (off ? '' : app || fmtState(h, s));
    e.artist.textContent = [a.media_artist || a.media_series_title, a.media_album_name].filter(Boolean).join(' · ') || (a.media_title ? '' : a.media_channel || '');
    // Cover: nur neu laden, wenn sich das Bild ändert
    const pic = !off && c.artwork !== 'none' ? a.entity_picture_local || a.entity_picture : null;
    if (pic !== this._pic) {
      this._pic = pic;
      if (e.art) e.art.style.backgroundImage = pic ? cssUrl(pic) : '';
      e.thumb.style.backgroundImage = pic ? cssUrl(pic) : '';
    }
    e.g.classList.toggle('has-art', !!pic);
    setIcon(e.pp, play ? (hasF(s, MF.PAUSE) ? 'mdi:pause' : 'mdi:stop') : 'mdi:play');
    e.pp.hidden = !!s && !hasF(s, MF.PAUSE) && !hasF(s, MF.PLAY) && !hasF(s, MF.STOP);
    e.pv.hidden = !hasF(s, MF.PREV);
    e.nx.hidden = !hasF(s, MF.NEXT);
    if (e.mu) {
      e.mu.hidden = !hasF(s, MF.MUTE);
      e.mu.classList.toggle('on', !!a.is_volume_muted);
      setIcon(e.mu, a.is_volume_muted ? 'mdi:volume-off' : 'mdi:volume-high');
    }
    if (e.vol) {
      const set = hasF(s, MF.VOL_SET) && a.volume_level != null;
      e.vol.hidden = e.vv.hidden = !set;
      e.step.hidden = set || !hasF(s, MF.VOL_STEP);
      if (set && !this._drag) {
        const v = Math.round(a.volume_level * 100);
        e.vol.value = v; e.vol.style.setProperty('--p', `${v}%`); e.vv.textContent = `${v} %`;
      }
    }
    const vb = e.vol?.parentElement;
    if (vb) vb.hidden = [...vb.children].every(x => x.hidden);
    if (e.src) this._sources(n);
    this._chips?.forEach((el, i) => {
      const o = this._all[i], ps = h.states[o.entity], pa = ps?.attributes || {};
      el.classList.toggle('on', i === this._idx);
      el.classList.toggle('pl', h.states[this._eidOf(i)]?.state === 'playing');
      el.classList.toggle('na', !ps || ps.state === 'unavailable');
      setIcon(el.firstChild, o.icon || pa.icon || (pa.device_class === 'tv' ? 'mdi:television' : 'mdi:speaker'));
      el.children[1].textContent = o.name ?? pa.friendly_name ?? o.entity;
    });
    this._progress();
    this._tick();
  }
  _sources(s) {
    const c = this._c, a = s?.attributes || {}, e = this._e;
    const only = list(c.sources), all = hasF(s, MF.SOURCE) ? a.source_list || [] : [];
    const srcs = only.length ? all.filter(x => only.includes(x)) : all;
    const key = `${this._idx}|${srcs.join('\n')}`;
    if (key !== this._srcKey) {
      this._srcKey = key;
      e.src.replaceChildren(...srcs.map(x => {
        const el = document.createElement('div');
        el.className = 'pill'; el.dataset.s = x;
        el.innerHTML = '<span class="i"></span><span class="t"></span>';
        setIcon(el.firstChild, mapIcon(c.icon_map, x) || 'mdi:import');
        el.lastChild.textContent = x;
        press(el, {tap: () => this._h.callService('media_player', 'select_source', {entity_id: this._p.entity, source: x})});
        return el;
      }));
    }
    e.src.hidden = !srcs.length;
    [...e.src.children].forEach(el => el.classList.toggle('on', el.dataset.s === a.source));
  }
  _progress() {
    const e = this._e, s = this._st();
    if (!e?.bar || !s) return;
    const d = s.attributes.media_duration, p = posOf(s);
    e.bar.hidden = !(d > 0) || p == null;
    if (e.bar.hidden) return;
    e.bar.classList.toggle('seek', hasF(s, MF.SEEK));
    e.fill.style.width = `${Math.min(100, p / d * 100)}%`;
    e.ta.textContent = clock(Math.min(p, d));
    e.tb.textContent = clock(d);
  }
  // Sekundentakt nur, solange etwas läuft und der Balken sichtbar ist
  _tick() {
    const run = this.isConnected && this._e?.bar && this._st()?.state === 'playing';
    if (run && !this._tm) this._tm = setInterval(() => this._progress(), 1000);
    if (!run && this._tm) { clearInterval(this._tm); this._tm = null; }
  }
  _act(o, kind, info) { return runAction(this, o, kind, info); }
}
define('nova-media-card', NovaMediaCard, {name: 'Nova Media Card', description: 'Media-Player mit Cover als Hintergrund, Titel, Interpret, App-Logo, Play/Pause, Vor/Zurück, Lautstärke, Stumm, Ein/Aus, Quellen und mehreren umschaltbaren Playern.', documentationURL: docUrl('nova-media-card')});

/* ---------- Editor Media Card ---------- */
const MP = {domain: ['media_player']};
const MPMAIN = [
  {name: 'entity', required: true, selector: {entity: MP}},
  g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}}),
  g2({name: 'tap_action', selector: A}, {name: 'hold_action', selector: A}),
  g2(sel('artwork', [['background', 'Hintergrund'], ['cover', 'Cover + unscharfer Hintergrund'], ['none', 'Kein Cover']]), {name: 'glow', selector: {boolean: {}}}),
  g2({name: 'show_progress', selector: {boolean: {}}}, {name: 'show_power', selector: {boolean: {}}}),
  g2({name: 'show_volume', selector: {boolean: {}}}, {name: 'show_mute', selector: {boolean: {}}}),
  {name: 'show_source', selector: {boolean: {}}},
  {name: 'sources', selector: {text: {multiple: true}}},
];
const MPMA = [g2({name: 'ma_auto', selector: {boolean: {}}}, {name: 'ma_entity', selector: {entity: {domain: 'media_player', integration: 'music_assistant'}}})];
const MPPLAY = [g2({name: 'show_players', selector: {boolean: {}}}, {name: 'auto_switch', selector: {boolean: {}}})];
const MPITEM = [{name: 'entity', required: true, selector: {entity: MP}}, NAMEICON, {name: 'music_assistant', selector: {entity: {domain: 'media_player', integration: 'music_assistant'}}}];
const MPLOGO = [{name: 'icon_entity', selector: {entity: {}}}];
const MPMAP = [g2({name: 'key', selector: T}, {name: 'value', selector: T})];
const MPLABELS = {...BASE_LABELS, artwork: 'Cover', glow: 'Leuchten beim Abspielen', show_progress: 'Fortschrittsbalken', show_power: 'Ein/Aus-Button',
  show_volume: 'Lautstärke-Regler', show_mute: 'Stumm-Button', show_source: 'Quellenauswahl', sources: 'Nur diese Quellen zeigen',
  show_players: 'Player-Umschalter anzeigen', auto_switch: 'Automatisch zum spielenden Player', icon_entity: 'Icon-Entität (optional)',
  ma_auto: 'Automatisch suchen', ma_entity: 'Oder fest: Music-Assistant-Player', music_assistant: 'Music-Assistant-Player (optional)',
  key: 'App / Quelle / Zustand', value: 'Icon oder Bild-URL', tap_action: 'Icon antippen', hold_action: 'Icon lange drücken'};
const MPHELPERS = {
  tap_action: 'Standard: Details des Players',
  sources: 'Leer = alle Quellen des Players. Genaue Namen wie in source_list',
  auto_switch: 'Bis man selbst einen Player antippt',
  icon_entity: 'Leer = App-Name bzw. Quelle des Players. Sonst zählt der Zustand dieser Entität (z. B. sensor.tv_app)',
  ma_auto: 'Findet den Music-Assistant-Player mit gleichem Namen. Spielt der, kommen Titel, Cover und Steuerung von dort',
  music_assistant: 'Leer = automatisch (wie oben eingestellt)',
  key: 'z. B. Netflix oder music_assistant – Groß/Klein egal',
  value: 'mdi:netflix oder /local/logos/netflix.svg',
};

class NovaMediaCardEditor extends NovaEditorBase {
  static labels = MPLABELS;
  static helpers = MPHELPERS;
  // Neue Konfig von außen: Logo-Zeilen neu einlesen
  _onExternalConfig() { this._map = null; }
  _build() {
    const r = this.shadowRoot, c0 = this._config;
    r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}${MAPROW_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), strip = c => { Object.entries(MDEF).forEach(([k, x]) => c[k] === x && delete c[k]); if (c.glow === true) delete c.glow; return c; };
    w.append(this._form(MPMAIN, {...MDEF, glow: true, ...c0}, v => this._emit(strip(merge(this._config, names(MPMAIN), v)))));

    w.append(this._h3('Music Assistant'));
    const ma = c0.music_assistant;
    w.append(this._form(MPMA, {ma_auto: ma !== false, ma_entity: typeof ma === 'string' ? ma : undefined}, v => {
      const c = {...this._config};
      if (v.ma_entity) c.music_assistant = v.ma_entity; else if (v.ma_auto === false) c.music_assistant = false; else delete c.music_assistant;
      this._emit(c);
    }));

    w.append(this._h3('Weitere Player (umschaltbar)'));
    if (this._items('players').length) w.append(this._form(MPPLAY, {...MDEF, ...c0}, v => this._emit(strip({...this._config, ...v}))));
    this._itemList(w, 'players', MPITEM, {item: 'Player', icon: 'mdi:speaker'}, 'Player hinzufügen');

    // App-Logos: Zeilen bleiben im Editor, auch solange sie noch leer sind
    w.append(this._h3('App-Logos (icon_map)'));
    w.append(this._hint('Ersetzt das Icon oben und bei den Quellen durch ein Logo, passend zu App oder Quelle.'), this._form(MPLOGO, c0, v => this._emit(merge(this._config, ['icon_entity'], v))));
    const map = this._map ||= Object.entries(c0.icon_map || {});
    const write = () => {
      const o = Object.fromEntries(map.filter(([k, v]) => k && v)), c = {...this._config};
      if (Object.keys(o).length) c.icon_map = o; else delete c.icon_map;
      this._emit(c);
    };
    map.forEach(([k, v], j) => {
      const row = document.createElement('div'); row.className = 'maprow';
      row.append(this._form(MPMAP, {key: k, value: v}, x => { map[j] = [x.key ?? '', x.value ?? '']; write(); }),
        this._btn('mdi:close', 'Entfernen', () => { map.splice(j, 1); write(); this._rebuild(); }));
      w.append(row);
    });
    w.append(this._add('Logo hinzufügen', () => { map.push(['', '']); this._rebuild(); }));
  }
}
define('nova-media-card-editor', NovaMediaCardEditor);
