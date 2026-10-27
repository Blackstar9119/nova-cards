import {define, docUrl, tag} from './shared/define.js';
import {dom, setIcon, list} from './shared/utils.js';
import {fmtState} from './shared/state.js';
import {fire, runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {hassChanged, entityIds} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, A, sel, BASE_LABELS} from './shared/editor-schema.js';

/* ---------- Nova Fernbedienung ---------- */
const RCSS = `
.g.rc{gap:14px;align-items:stretch}
.rc .ic img{border-radius:6px}
.hb.on{background:var(--nv-accent);color:var(--nv-accent-fg)}
.cb{width:46px;height:46px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);transition:background-color .15s,transform .15s}
.cb ha-icon{--mdc-icon-size:22px}
.cb:active,.cb.hit{transform:scale(.9);background:color-mix(in srgb,var(--nv-active) 40%,var(--nv-chip))}
.row3{display:flex;justify-content:space-around;align-items:center;gap:10px}
.pad{position:relative;width:min(230px,72cqw);aspect-ratio:1;margin:2px auto;border-radius:50%;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 6px 18px rgba(0,0,0,.18)}
.pad .k{position:absolute;width:32%;height:32%;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background-color .15s,transform .15s}
.pad .k ha-icon{--mdc-icon-size:30px;opacity:.85}
.pad .k:active,.pad .k.hit{background:rgba(255,255,255,.12)}
.pad .up{top:2%;left:34%}.pad .down{bottom:2%;left:34%}.pad .left{left:2%;top:34%}.pad .right{right:2%;top:34%}
.pad .ok{left:29%;top:29%;width:42%;height:42%;background:var(--nv-accent);color:var(--nv-accent-fg);font-weight:700;font-size:15px;letter-spacing:.04em;box-shadow:0 0 18px color-mix(in srgb,var(--nv-accent) 45%,transparent)}
.pad .ok:active,.pad .ok.hit{transform:scale(.93);background:var(--nv-accent)}
.tp{position:relative;height:min(230px,62cqw);border-radius:22px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);touch-action:none;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;-webkit-user-select:none;overflow:hidden}
.tp>ha-icon{--mdc-icon-size:42px;opacity:.25;transition:opacity .2s,transform .2s}
.tp.hit>ha-icon{opacity:.6;transform:scale(1.15)}
.tp .ok{position:absolute;inset:0;background:radial-gradient(circle,color-mix(in srgb,var(--nv-accent) 35%,transparent),transparent 60%);opacity:0;transition:opacity .25s;pointer-events:none}
.tp.ok-hit .ok{opacity:1}
.apps .pill.on{background:var(--nv-accent);color:var(--nv-accent-fg);border-color:transparent;box-shadow:0 0 14px color-mix(in srgb,var(--nv-accent) 45%,transparent)}
.rc.off .pad,.rc.off .tp{opacity:.55}
.vol{display:flex;align-items:center;gap:12px}
.vol input{flex:1;height:30px;border-radius:15px;touch-action:none}
.vol input::-webkit-slider-thumb{width:30px;height:30px}.vol input::-moz-range-thumb{width:30px;height:30px}
.vol .v{min-width:40px;text-align:right;font-size:13px;font-weight:600;font-variant-numeric:tabular-nums}
.vol .cb.on{background:var(--nv-error);color:#fff}
.vs{position:relative;height:64px;border-radius:20px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);touch-action:none;display:flex;align-items:center;justify-content:space-between;padding:0 18px;cursor:pointer;user-select:none;-webkit-user-select:none;overflow:hidden}
.vs ha-icon{--mdc-icon-size:24px;opacity:.6;transition:opacity .15s,transform .15s}
.vs .mid{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:12px;opacity:.7}
.vs .mid b{font-size:15px;font-variant-numeric:tabular-nums}
.vs.up .pl,.vs.down .mi{opacity:1;transform:scale(1.25)}
.vs.muted .mid{color:var(--nv-error);opacity:1}
@container (max-width:280px){.cb{width:40px;height:40px}}`;

// Logische Tasten der Karte
const KEYS = ['up', 'down', 'left', 'right', 'ok', 'back', 'home', 'menu', 'play_pause', 'rewind', 'forward', 'vol_down', 'mute', 'vol_up', 'ch_down', 'input', 'ch_up', 'power'];
const KEYLABELS = {up: 'Hoch', down: 'Runter', left: 'Links', right: 'Rechts', ok: 'OK', back: 'Zurück', home: 'Home', menu: 'Menü',
  play_pause: 'Play/Pause', rewind: 'Zurückspulen', forward: 'Vorspulen', vol_down: 'Leiser', mute: 'Stumm', vol_up: 'Lauter',
  ch_down: 'Kanal runter', input: 'Eingang', ch_up: 'Kanal hoch', power: 'Ein/Aus'};
const KEYICONS = {up: 'mdi:chevron-up', down: 'mdi:chevron-down', left: 'mdi:chevron-left', right: 'mdi:chevron-right',
  back: 'mdi:arrow-left', home: 'mdi:home-outline', menu: 'mdi:menu', play_pause: 'mdi:play-pause', rewind: 'mdi:rewind', forward: 'mdi:fast-forward',
  vol_down: 'mdi:volume-minus', mute: 'mdi:volume-off', vol_up: 'mdi:volume-plus', ch_down: 'mdi:minus', input: 'mdi:import', ch_up: 'mdi:plus'};
// Diese Tasten wiederholen sich beim Festhalten
const REPEAT = new Set(['up', 'down', 'left', 'right', 'vol_down', 'vol_up', 'ch_down', 'ch_up', 'rewind', 'forward']);

// Tastenbefehle je Integration (remote.send_command bzw. androidtv.adb_command); fehlt eine Taste, wird sie ausgeblendet
const KEYMAPS = {
  androidtv_remote: {up: 'DPAD_UP', down: 'DPAD_DOWN', left: 'DPAD_LEFT', right: 'DPAD_RIGHT', ok: 'DPAD_CENTER', back: 'BACK', home: 'HOME', menu: 'MENU',
    play_pause: 'MEDIA_PLAY_PAUSE', rewind: 'MEDIA_REWIND', forward: 'MEDIA_FAST_FORWARD', vol_up: 'VOLUME_UP', vol_down: 'VOLUME_DOWN', mute: 'VOLUME_MUTE',
    ch_up: 'CHANNEL_UP', ch_down: 'CHANNEL_DOWN', input: 'TV_INPUT'},
  androidtv: {up: 'UP', down: 'DOWN', left: 'LEFT', right: 'RIGHT', ok: 'CENTER', back: 'BACK', home: 'HOME', menu: 'MENU',
    play_pause: 'input keyevent 85', rewind: 'input keyevent 89', forward: 'input keyevent 90', vol_up: 'input keyevent 24', vol_down: 'input keyevent 25',
    mute: 'input keyevent 164', ch_up: 'input keyevent 166', ch_down: 'input keyevent 167', input: 'input keyevent 178'},
  philips_js: {up: 'CursorUp', down: 'CursorDown', left: 'CursorLeft', right: 'CursorRight', ok: 'Confirm', back: 'Back', home: 'Home', menu: 'Options',
    play_pause: 'Pause|Play', rewind: 'Rewind', forward: 'FastForward', vol_up: 'VolumeUp', vol_down: 'VolumeDown', mute: 'Mute',
    ch_up: 'ChannelStepUp', ch_down: 'ChannelStepDown', input: 'Source'},
  apple_tv: {up: 'up', down: 'down', left: 'left', right: 'right', ok: 'select', back: 'menu', home: 'home', menu: 'top_menu',
    play_pause: 'play_pause', rewind: 'skip_backward', forward: 'skip_forward', vol_up: 'volume_up', vol_down: 'volume_down'},
  roku: {up: 'up', down: 'down', left: 'left', right: 'right', ok: 'select', back: 'back', home: 'home', menu: 'info',
    play_pause: 'play', rewind: 'reverse', forward: 'forward', vol_up: 'volume_up', vol_down: 'volume_down', mute: 'volume_mute',
    ch_up: 'channel_up', ch_down: 'channel_down'},
  samsungtv: {up: 'KEY_UP', down: 'KEY_DOWN', left: 'KEY_LEFT', right: 'KEY_RIGHT', ok: 'KEY_ENTER', back: 'KEY_RETURN', home: 'KEY_HOME', menu: 'KEY_MENU',
    play_pause: 'KEY_PLAY', rewind: 'KEY_REWIND', forward: 'KEY_FF', vol_up: 'KEY_VOLUP', vol_down: 'KEY_VOLDOWN', mute: 'KEY_MUTE',
    ch_up: 'KEY_CHUP', ch_down: 'KEY_CHDOWN', input: 'KEY_SOURCE'},
};
const PLATFORMS = [['androidtv_remote', 'Android TV / Google TV (Android TV Remote)'], ['androidtv', 'Fire TV / Android TV (ADB)'],
  ['philips_js', 'Philips TV'], ['apple_tv', 'Apple TV'], ['roku', 'Roku'], ['samsungtv', 'Samsung TV']];

// App-Vorlagen: Name, Icon, Paketname, App-Link. Android TV Remote öffnet über den Link – manche Geräte (z. B. Xiaomi TV Box)
// lehnen reine Paketnamen ab. ADB öffnet über den Paketnamen, andere Geräte über die gleichnamige Quelle
export const APPS = {
  netflix: ['Netflix', 'mdi:netflix', 'com.netflix.ninja', 'https://www.netflix.com/title'],
  youtube: ['YouTube', 'mdi:youtube', 'com.google.android.youtube.tv', 'https://www.youtube.com'],
  prime: ['Prime Video', 'mdi:filmstrip-box-multiple', 'com.amazon.amazonvideo.livingroom', 'https://app.primevideo.com'],
  disney: ['Disney+', 'mdi:castle', 'com.disney.disneyplus', 'https://www.disneyplus.com'],
  appletv: ['Apple TV', 'mdi:apple', 'com.apple.atve.androidtv.appletv', 'https://tv.apple.com'],
  spotify: ['Spotify', 'mdi:spotify', 'com.spotify.tv.android', 'spotify://'],
  ytmusic: ['YouTube Music', 'mdi:music-circle', 'com.google.android.youtube.tvmusic', 'https://music.youtube.com'],
  plex: ['Plex', 'mdi:plex', 'com.plexapp.android', 'plex://'],
  kodi: ['Kodi', 'mdi:kodi', 'org.xbmc.kodi'],
  twitch: ['Twitch', 'mdi:twitch', 'tv.twitch.android.app', 'twitch://home'],
  dazn: ['DAZN', 'mdi:soccer', 'com.dazn', 'https://www.dazn.com'],
  playstore: ['Play Store', 'mdi:google-play', 'com.android.vending'],
  settings: ['Einstellungen', 'mdi:cog-outline', 'com.android.tv.settings'],
};
// pkg = Paketname (Erkennen der laufenden App, ADB), link = App-Link der Vorlage
const appOf = a => { const p = APPS[a.preset] || []; return {...a, name: a.name ?? p[0], icon: a.icon || p[1] || 'mdi:application-outline', pkg: a.package || p[2], link: p[3]}; };
const isApp = (a, cur) => same(a.app, cur) || same(a.pkg, cur) || same(a.name, cur);

const RDEF = {layout: 'dpad', show_power: true, show_nav: true, show_media: true, show_volume: true, volume_mode: 'buttons', show_channels: false};

// Plattform der Entität (Integration), ohne Treffer: remote.* → Android TV Remote, media_player.* → ADB
const platformOf = (h, c) => c.platform && c.platform !== 'auto' ? c.platform : h?.entities?.[c.entity]?.platform in KEYMAPS ? h.entities[c.entity].platform : dom(c.entity) === 'media_player' ? 'androidtv' : 'androidtv_remote';
// Media-Player für Zustand und App: fest eingestellt, die Entität selbst oder einer am selben Gerät
const playerOf = (h, c) => {
  if (c.media_player) return c.media_player;
  if (dom(c.entity) === 'media_player') return c.entity;
  const dev = h?.entities?.[c.entity]?.device_id;
  return (dev && Object.values(h.entities).find(e => e.device_id === dev && dom(e.entity_id) === 'media_player' && h.states[e.entity_id])?.entity_id) || null;
};
// Player für den Lautstärkeregler: eigener Lautstärke-Player, sonst der Media-Player – nur wenn er volume_set kann
const volOf = (h, c, mp) => [c.volume_entity, mp].find(id => id && (h?.states[id]?.attributes.supported_features & 4)) || null;
// Laufende App: Paketname der Fernbedienung, sonst App bzw. Quelle des Players
const currentApp = (h, c, mp) => { const r = h.states[c.entity]?.attributes || {}, m = (mp && h.states[mp]?.attributes) || {}; return r.current_activity || m.app_id || m.app_name || m.source || null; };
const same = (a, b) => !!a && !!b && String(a).toLowerCase() === String(b).toLowerCase();

class NovaRemoteCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('remote-card-editor')); }
  static getStubConfig(h) {
    const ids = Object.keys(h.states).filter(i => dom(i) === 'remote');
    const id = ids.find(i => h.entities?.[i]?.platform === 'androidtv_remote' && h.states[i].state === 'on') || ids.find(i => h.entities?.[i]?.platform === 'androidtv_remote') || ids[0]
      || Object.keys(h.states).find(i => h.entities?.[i]?.platform === 'androidtv') || 'remote.';
    return {entity: id, apps: [{preset: 'netflix'}, {preset: 'youtube'}, {preset: 'prime'}, {preset: 'disney'}]};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (!['remote', 'media_player'].includes(dom(c.entity))) throw new Error('entity muss eine remote.* oder media_player.* Entität sein');
    this._c = {...RDEF, ...c};
    this._ids = entityIds(this._c);
    this._built = false;
    if (this._h) { this._build(); this._update(); }
  }
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    // Registry kommt evtl. erst später: dann Gerätetyp und Player neu bestimmen
    if (!this._built || (old?.entities !== h.entities && (platformOf(h, this._c) !== this._plat || playerOf(h, this._c) !== this._mp)) || (this._c.volume_mode === 'slider' && !this._vp && volOf(h, this._c, this._mp))) this._build();
    else if (!hassChanged(old, h, [...this._ids, this._mp].filter(Boolean))) return;
    this._update();
  }
  getCardSize() { return 7; }
  getGridOptions() { return {columns: 6, rows: 'auto', min_columns: 4}; }
  disconnectedCallback() { this._stops?.forEach(f => f()); }
  _build() {
    this._built = true;
    this._stops?.forEach(f => f());
    const c = this._c, r = this.shadowRoot || this.attachShadow({mode: 'open'});
    this._plat = platformOf(this._h, c);
    this._mp = playerOf(this._h, c);
    this._stops = new Set();
    this._vp = c.volume_mode === 'slider' ? volOf(this._h, c, this._mp) : null;
    this._vi = c.volume_entity || this._mp;
    const k = id => this._has(id) ? `<div class="cb" data-k="${id}" title="${KEYLABELS[id]}"><ha-icon icon="${KEYICONS[id]}"></ha-icon></div>` : '';
    const row = ids => { const h = ids.map(k).join(''); return h ? `<div class="row3">${h}</div>` : ''; };
    const pad = c.layout === 'touchpad'
      ? '<div class="tp" title="Wischen = Richtung, Tippen = OK"><span class="ok"></span><ha-icon icon="mdi:gesture-swipe"></ha-icon></div>'
      : `<div class="pad">${['up', 'left', 'right', 'down'].map(x => `<div class="k ${x}" data-k="${x}" title="${KEYLABELS[x]}"><ha-icon icon="${KEYICONS[x]}"></ha-icon></div>`).join('')}<div class="k ok" data-k="ok" title="OK">OK</div></div>`;
    this._apps = [].concat(c.apps || []).map(appOf);
    const btns = [].concat(c.buttons || []);
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${RCSS}</style><div class="g rc">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${c.show_power !== false ? '<div class="hb pw" title="Ein/Aus"><ha-icon icon="mdi:power"></ha-icon></div>' : ''}</div>
${pad}
${c.show_nav !== false ? row(['back', 'home', 'menu']) : ''}
${c.show_media !== false ? row(['rewind', 'play_pause', 'forward']) : ''}
${c.show_volume === false ? '' : c.volume_mode === 'swipe' ? '<div class="vs" title="Wischen: rechts/oben lauter, links/unten leiser · Tippen: stumm"><ha-icon class="mi" icon="mdi:volume-minus"></ha-icon><div class="mid"><b></b><span>Lautstärke</span></div><ha-icon class="pl" icon="mdi:volume-plus"></ha-icon></div>' : this._vp ? `<div class="vol">${k('mute')}<input type="range" min="0" max="100" step="1" aria-label="Lautstärke"><span class="v"></span></div>` : row(['vol_down', 'mute', 'vol_up'])}
${c.show_channels ? row(['ch_down', 'input', 'ch_up']) : ''}
${btns.length ? '<div class="pills grid btns"></div>' : ''}
${this._apps.length ? '<div class="pills grid apps"></div>' : ''}</div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), pw: q('.pw')};
    press(this._e.ic, {tap: () => runAction(this, {entity: c.entity, tap_action: c.tap_action}, 'tap', true), hold: () => runAction(this, {entity: c.entity, hold_action: c.hold_action}, 'hold')});
    if (this._e.pw) press(this._e.pw, {tap: () => this._key('power')});
    r.querySelectorAll('[data-k]').forEach(el => this._rep(el, el.dataset.k));
    const vol = q('.vol input');
    if (vol) {
      const show = () => { vol.style.setProperty('--p', `${vol.value}%`); q('.vol .v').textContent = `${vol.value} %`; };
      vol.addEventListener('pointerdown', () => { this._drag = true; });
      vol.addEventListener('input', () => { this._drag = true; show(); });
      vol.addEventListener('change', () => { this._drag = false; show(); this._h.callService('media_player', 'volume_set', {entity_id: this._vp, volume_level: +vol.value / 100}); });
      this._e.vol = vol; this._e.vv = q('.vol .v'); this._e.mu = q('.vol [data-k=mute]');
    }
    const vs = q('.vs');
    if (vs) this._swipeVol(vs);
    const tp = q('.tp');
    if (tp) this._touch(tp);
    const pill = (o, fn) => {
      const el = document.createElement('div');
      el.className = 'pill';
      el.innerHTML = '<span class="i"></span><span class="t"></span>';
      setIcon(el.firstChild, o.icon || 'mdi:gesture-tap-button');
      el.lastChild.textContent = o.name ?? '';
      press(el, {tap: fn});
      return el;
    };
    q('.btns')?.append(...btns.map(b => pill(b, () => this._button(b))));
    this._pills = this._apps.map(a => pill(a, () => this._launch(a)));
    q('.apps')?.append(...this._pills);
  }
  // Befehl einer Taste: eigene Belegung vor Standard der Integration
  _cmd(k) { return this._c.keys?.[k] || KEYMAPS[this._plat]?.[k]; }
  _has(k) { return !!this._cmd(k) || (this._c.volume_entity && ['vol_up', 'vol_down', 'mute'].includes(k)); }
  // Taste sofort beim Drücken senden, beim Festhalten wiederholen
  _rep(el, k) {
    let t, iv;
    const stop = () => { clearTimeout(t); clearInterval(iv); t = iv = null; el.classList.remove('hit'); };
    this._stops.add(stop);
    el.tabIndex = 0; el.setAttribute('role', 'button'); el.classList.add('tap');
    el.addEventListener('pointerdown', e => {
      e.preventDefault(); stop(); el.classList.add('hit'); this._key(k);
      if (REPEAT.has(k)) t = setTimeout(() => { iv = setInterval(() => this._key(k, true), 160); }, 450);
    });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(x => el.addEventListener(x, stop));
    el.addEventListener('contextmenu', e => e.preventDefault());
    el.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); this._key(k); } });
  }
  // Touchpad: Wischen = Richtung (alle 40 px ein Schritt), Tippen = OK
  _touch(tp) {
    let sx = null, sy, moved, ft;
    const flash = cls => { tp.classList.add(cls); clearTimeout(ft); ft = setTimeout(() => tp.classList.remove('hit', 'ok-hit'), 180); };
    this._stops.add(() => clearTimeout(ft));
    tp.tabIndex = 0;
    tp.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; moved = false; tp.setPointerCapture?.(e.pointerId); });
    tp.addEventListener('pointermove', e => {
      if (sx == null) return;
      const dx = e.clientX - sx, dy = e.clientY - sy;
      if (Math.hypot(dx, dy) < 40) return;
      this._key(Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 'right' : 'left') : (dy > 0 ? 'down' : 'up'));
      flash('hit'); sx = e.clientX; sy = e.clientY; moved = true;
    });
    tp.addEventListener('pointerup', () => { if (sx != null && !moved) { this._key('ok'); flash('ok-hit'); } sx = null; });
    tp.addEventListener('pointercancel', () => { sx = null; });
    tp.addEventListener('keydown', e => {
      const k = {ArrowUp: 'up', ArrowDown: 'down', ArrowLeft: 'left', ArrowRight: 'right', Enter: 'ok', ' ': 'ok'}[e.key];
      if (k) { e.preventDefault(); this._key(k); }
    });
  }
  // Wischfläche Lautstärke: alle 22 px ein Schritt (rechts/oben lauter), Tippen = stumm
  _swipeVol(el) {
    let sx = null, sy, moved, ft;
    this._stops.add(() => clearTimeout(ft));
    this._e.vs = el; this._e.vsv = el.querySelector('.mid b');
    el.tabIndex = 0;
    el.addEventListener('pointerdown', e => { sx = e.clientX; sy = e.clientY; moved = false; el.setPointerCapture?.(e.pointerId); });
    el.addEventListener('pointermove', e => {
      if (sx == null) return;
      const d = (e.clientX - sx) - (e.clientY - sy);
      if (Math.abs(d) < 22) return;
      const up = d > 0;
      this._key(up ? 'vol_up' : 'vol_down', moved);
      el.classList.remove('up', 'down'); el.classList.add(up ? 'up' : 'down');
      clearTimeout(ft); ft = setTimeout(() => el.classList.remove('up', 'down'), 200);
      sx = e.clientX; sy = e.clientY; moved = true;
    });
    el.addEventListener('pointerup', () => { if (sx != null && !moved) this._key('mute'); sx = null; });
    el.addEventListener('pointercancel', () => { sx = null; });
    el.addEventListener('contextmenu', e => e.preventDefault());
    el.addEventListener('keydown', e => {
      const k = {ArrowUp: 'vol_up', ArrowRight: 'vol_up', ArrowDown: 'vol_down', ArrowLeft: 'vol_down', Enter: 'mute', ' ': 'mute'}[e.key];
      if (k) { e.preventDefault(); this._key(k); }
    });
  }
  _send(cmd) {
    const c = this._c, cmds = list(cmd);
    if (!cmds.length) return;
    if (this._plat === 'androidtv' && dom(c.entity) === 'media_player') cmds.forEach(x => this._h.callService('androidtv', 'adb_command', {entity_id: c.entity, command: x}));
    else this._h.callService('remote', 'send_command', {entity_id: c.entity, command: cmds});
  }
  _key(k, quiet) {
    const c = this._c, h = this._h;
    if (!h) return;
    if (!quiet) fire(this, 'haptic', 'light');
    if (k === 'power' && !c.keys?.power) {
      const s = h.states[c.entity], on = s && !['off', 'standby', 'unavailable', 'unknown'].includes(s.state);
      return h.callService(dom(c.entity), on ? 'turn_off' : 'turn_on', {entity_id: c.entity});
    }
    // Lautstärke über einen anderen Player (z. B. Fernseher oder AV-Receiver)
    const v = c.volume_entity;
    if (v && !c.keys?.[k] && ['vol_up', 'vol_down', 'mute'].includes(k)) {
      return k === 'mute' ? h.callService('media_player', 'volume_mute', {entity_id: v, is_volume_muted: !h.states[v]?.attributes.is_volume_muted})
        : h.callService('media_player', k === 'vol_up' ? 'volume_up' : 'volume_down', {entity_id: v});
    }
    this._send(this._alt(k, this._cmd(k)));
  }
  // „A|B“: abwechselnd A und B senden (z. B. Philips kennt kein PlayPause, nur Pause und Play)
  _alt(k, cmd) {
    const p = String(cmd || '').split('|');
    if (p.length < 2) return cmd;
    const alt = this._altIdx ||= {}, i = alt[k] || 0;
    alt[k] = (i + 1) % p.length;
    return p[i].trim();
  }
  _button(b) {
    fire(this, 'haptic', 'light');
    if (b.tap_action?.action && b.tap_action.action !== 'default') return runAction(this, {tap_action: b.tap_action}, 'tap');
    this._send(this._alt(`b:${b.name}:${b.command}`, b.command));
  }
  // App öffnen: Android TV Remote über Paketname/Deep-Link, sonst über die Quelle des Players
  _launch(a) {
    const c = this._c, h = this._h;
    fire(this, 'haptic', 'light');
    if (a.tap_action?.action && a.tap_action.action !== 'default') return runAction(this, {tap_action: a.tap_action}, 'tap');
    if (dom(c.entity) === 'remote' && (this._plat === 'androidtv_remote' || !this._mp)) {
      const id = a.app || a.link || a.pkg;
      return id && h.callService('remote', 'turn_on', {entity_id: c.entity, activity: id});
    }
    const id = a.app || (this._plat === 'androidtv' ? a.pkg : null) || a.name;
    if (id) h.callService('media_player', 'select_source', {entity_id: this._mp || c.entity, source: id});
  }
  _update() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !e) return;
    const s = h.states[c.entity], m = this._mp && h.states[this._mp];
    const na = !s || s.state === 'unavailable';
    const off = na || ['off', 'standby'].includes(s.state) || (m && ['off', 'standby'].includes(m.state));
    this.classList.toggle('nv-na', na);
    e.g.classList.toggle('na', na);
    e.g.classList.toggle('off', !!off);
    const cur = currentApp(h, c, this._mp), hit = this._apps.find(a => isApp(a, cur) || same(a.name, m?.attributes.app_name));
    e.name.textContent = c.name ?? s?.attributes.friendly_name ?? m?.attributes.friendly_name ?? c.entity;
    e.sub.textContent = !s ? 'nicht gefunden' : off ? fmtState(h, m && !na ? m : s) : hit?.name || m?.attributes.app_name || cur || fmtState(h, s);
    setIcon(e.ic, c.icon || (!off && hit?.icon) || (m?.attributes.device_class === 'tv' ? 'mdi:television' : 'mdi:remote-tv'));
    e.ic.parentElement.classList.toggle('on', !off);
    e.pw?.classList.toggle('on', !off);
    this._pills.forEach((el, i) => el.classList.toggle('on', !off && this._apps[i] === hit));
    if (e.vs) {
      const a = (this._vi && h.states[this._vi]?.attributes) || {};
      e.vsv.textContent = a.volume_level != null ? `${Math.round(a.volume_level * 100)} %` : '';
      e.vs.classList.toggle('muted', !!a.is_volume_muted);
    }
    const va = this._vp && h.states[this._vp]?.attributes;
    if (e.vol && va) {
      if (!this._drag && va.volume_level != null) {
        const v = Math.round(va.volume_level * 100);
        e.vol.value = v; e.vol.style.setProperty('--p', `${v}%`); e.vv.textContent = `${v} %`;
      }
      e.mu?.classList.toggle('on', !!va.is_volume_muted);
    }
  }
}
define('remote-card', NovaRemoteCard, {name: 'Nova Fernbedienung', description: 'Fernbedienung für Fernseher und Streaming-Boxen (Android TV/Google TV, Fire TV, Philips, Apple TV, Roku, Samsung): Steuerkreuz oder Touchpad, Medien, Lautstärke und Apps.', documentationURL: docUrl('nova-fernbedienung')});

/* ---------- Editor Fernbedienung ---------- */
const RGEN = [
  {name: 'entity', required: true, selector: {entity: {domain: ['remote', 'media_player']}}},
  g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}}),
  g2(sel('platform', [['auto', 'Automatisch'], ...PLATFORMS]), {name: 'media_player', selector: {entity: {domain: 'media_player'}}}),
];
const RCTRL = [
  sel('layout', [['dpad', 'Steuerkreuz'], ['touchpad', 'Touchpad (wischen)']]),
  g2({name: 'show_power', selector: {boolean: {}}}, {name: 'show_nav', selector: {boolean: {}}}),
  g2({name: 'show_media', selector: {boolean: {}}}, {name: 'show_volume', selector: {boolean: {}}}),
  sel('volume_mode', [['buttons', 'Tasten (− / +)'], ['swipe', 'Wischen (in Schritten)'], ['slider', 'Schieberegler']]),
  {name: 'show_channels', selector: {boolean: {}}},
  {name: 'volume_entity', selector: {entity: {domain: 'media_player'}}},
];
const RACT = [g2({name: 'tap_action', selector: A}, {name: 'hold_action', selector: A})];
const RAPP = [
  sel('preset', [['', 'Eigene App'], ...Object.entries(APPS).map(([k, [n]]) => [k, n])]),
  g2({name: 'name', selector: T}, {name: 'icon', selector: I}),
  {name: 'app', selector: T},
  {name: 'package', selector: T},
  {name: 'tap_action', selector: A},
];
const RBTN = [g2({name: 'name', selector: T}, {name: 'icon', selector: I}), {name: 'command', selector: T}, {name: 'tap_action', selector: A}];
const RKEYS = [g2(...KEYS.map(k => ({name: k, selector: T})))];
const RLABELS = {...BASE_LABELS, ...KEYLABELS, entity: 'Fernbedienung (remote.* oder ADB-Player)', platform: 'Gerätetyp', media_player: 'Media-Player (optional)',
  layout: 'Bedienfeld', show_power: 'Ein/Aus-Button', show_nav: 'Zurück / Home / Menü', show_media: 'Medientasten', show_volume: 'Lautstärke', volume_mode: 'Lautstärke als',
  show_channels: 'Kanäle und Eingang', volume_entity: 'Lautstärke über anderen Player (optional)', preset: 'Vorlage', app: 'App-Link oder Quelle', package: 'Paketname',
  command: 'Befehl', tap_action: 'Aktion beim Antippen', hold_action: 'Aktion bei langem Drücken'};
const RHELPERS = {
  platform: 'Bestimmt die Tastenbefehle. Automatisch = nach Integration der Entität',
  media_player: 'Leer = automatisch (Player am selben Gerät). Liefert Zustand und laufende App',
  volume_mode: 'Schieberegler braucht einen Player mit einstellbarer Lautstärke (hier oder unter „Lautstärke über anderen Player“), sonst bleibt es bei den Tasten',
  volume_entity: 'z. B. Fernseher oder AV-Receiver, wenn die Box die Lautstärke nicht selbst regelt',
  app: 'Android TV: Link, mit dem die App startet (z. B. https://www.youtube.com). Andere Geräte: Name der Quelle. Leer = aus der Vorlage',
  package: 'Erkennt die laufende App (z. B. com.netflix.ninja). Ohne Link wird damit gestartet – das lehnen manche Boxen ab',
  command: 'Befehl für remote.send_command, mehrere nacheinander mit Komma (z. B. DPAD_DOWN, DPAD_CENTER), abwechselnd mit | (z. B. Pause|Play)',
  tap_action: 'Optional statt App bzw. Befehl, z. B. ein Skript',
};

class NovaRemoteCardEditor extends NovaEditorBase {
  static labels = RLABELS;
  static helpers = RHELPERS;
  static openSections = ['general'];
  _ilabel(it, j, m) { return `${j + 1}. ${it.name || APPS[it.preset]?.[0] || it.app || it.package || it.command || `Neu: ${m.item}`}`; }
  _build() {
    const r = this.shadowRoot, c0 = this._config;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), strip = c => { Object.entries(RDEF).forEach(([k, x]) => c[k] === x && delete c[k]); if (c.platform === 'auto') delete c.platform; return c; };
    const data = {...RDEF, platform: 'auto', ...c0};
    const form = schema => this._form(schema, data, v => this._emit(strip(merge(this._config, names(schema), v))));
    w.append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => b.append(form(RGEN))),
      this._section('controls', 'mdi:remote-tv', 'Bedienung', b => b.append(form(RCTRL))),
      this._section('apps', 'mdi:apps', 'Apps', b => this._appList(b)),
      this._section('buttons', 'mdi:gesture-tap-button', 'Eigene Tasten', b => this._itemList(b, 'buttons', RBTN, {item: 'Taste', icon: 'mdi:gesture-tap-button'}, 'Taste hinzufügen')),
      this._section('keys', 'mdi:keyboard-outline', 'Tastenbelegung', b => this._keys(b)),
      this._section('actions', 'mdi:gesture-tap', 'Aktionen', b => b.append(form(RACT))));
  }
  _appList(b) {
    const h = this._hass, c = this._config, cur = h && c.entity && currentApp(h, c, playerOf(h, c));
    const apps = this._items('apps').map(appOf);
    if (cur && cur.includes('.') && !apps.some(a => isApp(a, cur))) {
      b.append(this._hint(`Gerade läuft: ${cur}. Startet die App danach nicht, unter „App-Link“ einen Link eintragen.`), this._add('Laufende App übernehmen', () => {
        const preset = Object.keys(APPS).find(k => same(APPS[k][2], cur) || same(APPS[k][0], cur));
        const n = [...this._items('apps'), preset ? {preset} : {name: cur.split('.').pop(), package: cur}];
        this._open = new Set([...this._open].filter(x => x.startsWith('sec.')).concat(`apps.${n.length - 1}`));
        this._setItems('apps', n); this._rebuild();
      }));
    }
    this._itemList(b, 'apps', RAPP, {item: 'App', icon: 'mdi:application-outline'}, 'App hinzufügen', it => ({preset: '', ...it}));
  }
  // Eigene Tastenbelegung: leer = Standard der Integration (steht als Hilfetext darunter)
  _keys(b) {
    const plat = platformOf(this._hass, this._config), map = KEYMAPS[plat] || {};
    b.append(this._hint('Nur ausfüllen, wenn eine Taste anders belegt sein soll. Mehrere Befehle nacheinander mit Komma, abwechselnd bei jedem Druck mit | (z. B. Pause|Play).'));
    const f = this._form(RKEYS, {...this._config.keys}, v => {
      const keys = Object.fromEntries(KEYS.filter(k => v[k]).map(k => [k, v[k]])), c = {...this._config};
      if (Object.keys(keys).length) c.keys = keys; else delete c.keys;
      this._emit(c);
    });
    f.computeHelper = s => s.name === 'power' ? 'Standard: Ein/Aus der Entität' : `Standard: ${map[s.name] || '– (ausgeblendet)'}`;
    b.append(f);
  }
}
define('remote-card-editor', NovaRemoteCardEditor);
