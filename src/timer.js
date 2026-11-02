import {define, docUrl, tag} from './shared/define.js';
import {esc, list, fitLabels} from './shared/utils.js';
import {nameOf, langOf, tzOf} from './shared/state.js';
import {runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, SECTION_EDITOR_CSS, roleVars} from './shared/styles.js';
import {hassChanged, inPicker, watchVisible} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, A, sel, ROLE} from './shared/editor-schema.js';
import {frameGlow, sweep} from './shared/scene.js';
import {dialDefs, dialBody, dialGlass, crown, bellBadge, DIAL_CSS} from './shared/dial.js';

/* ---------- Nova Timer Card ----------
   Steuert einen Timer-Helfer (timer.*): Starten mit Schnellwahl oder eigener Zeit, Pause, Weiter, +1 Minute, Abbrechen.
   Der Timer läuft in Home Assistant – alle Geräte zeigen denselben Stand, ein Neuladen ändert nichts.
   Zeichnung: Stoppuhr im Nova-Stil, der Ring zeigt die Restzeit. Abgelaufen = Klingel-Animation und Hinweis, bis man ihn bestätigt. */
const DEF = {presets: [1, 5, 10, 15], show_presets: true, show_custom: true, custom_units: 'auto', custom_picker: 'scale', scale_max: 180, click_sound: true, custom_input: true, show_add: true, color: 'accent-1', alarm_color: 'accent-2',
  alarm_minutes: 10, layout: 'full', animation: true, glow: true};
const CX = 100, CY = 112, R = 80, RING = 58;
const SP = 14; // Abstand der Skalenstriche in px
// Eingabe im Zahlenfeld: „5“ = 5 Min, „5:30“ = 5 Min 30 s, „1:05:00“ = 1 Std 5 Min
const parseIn = x => {
  const p = String(x).trim().replace(',', ':').split(/[:.\s]+/).filter(Boolean).map(Number);
  if (!p.length || p.some(n => !Number.isFinite(n) || n < 0)) return 0;
  return Math.round(p.length === 1 ? p[0] * 60 : p.length === 2 ? p[0] * 60 + p[1] : p[0] * 3600 + p[1] * 60 + p[2]);
};

// Dauer „H:MM:SS“ bzw. „1 day, 0:05:00“ → Sekunden
export const parseDur = v => {
  if (v == null) return null;
  if (typeof v === 'number') return v;
  const m = String(v).match(/^(?:(\d+)\s*days?,\s*)?(\d+):(\d{1,2})(?::(\d{1,2})(?:\.\d+)?)?$/);
  if (!m) return null;
  return (+m[1] || 0) * 86400 + +m[2] * 3600 + +m[3] * 60 + (+m[4] || 0);
};
// Sekunden → „H:MM:SS“ für den Dienst timer.start
const hms = s => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;
// Sekunden → Anzeige „4:59“ bzw. „1:04:59“
export const fmtLeft = s => {
  s = Math.max(0, Math.ceil(s));
  const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${x}` : `${m}:${x}`;
};
// Schnellwahl: „1, 5, 10“ oder [1, 5, 10] in Minuten; „30s“ = Sekunden, „1h“ = Stunden
const presetSecs = v => list(v).map(x => { const m = String(x).match(/^(\d+(?:[.,]\d+)?)\s*(s|sek|min|m|h|std)?$/i); if (!m) return null; const n = +m[1].replace(',', '.'); const u = (m[2] || 'min').toLowerCase(); return Math.round(n * (u[0] === 's' ? 1 : u[0] === 'h' ? 3600 : 60)); }).filter(n => n > 0).slice(0, 8);
// Schnellwahl: volle Minuten nur als Zahl (Platz!), sonst mit Einheit
const presetLbl = s => s % 3600 === 0 ? `${s / 3600} h` : s % 60 === 0 ? `${s / 60}` : s > 60 ? fmtLeft(s) : `${s} s`;

const ICON = {play: 'mdi:play', pause: 'mdi:pause', stop: 'mdi:stop', plus: 'mdi:plus', tune: 'mdi:timer-edit-outline', ok: 'mdi:check', again: 'mdi:restart'};

const TCSS = `${DIAL_CSS}
.g.tm{--dc:var(--tc);--dcfg:var(--tcfg);padding:14px;gap:10px;transition:box-shadow .4s}
${frameGlow('.g.tm.glow.st-active')}
.g.tm.alm{--dc:var(--ac);--dcfg:var(--acfg)}
.g.tm.glow.alm{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 2px var(--ac),0 0 24px color-mix(in srgb,var(--ac) 55%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.anim.glow.alm{animation:tm-frame 1.2s ease-in-out infinite}
.still{animation-play-state:paused!important}.still *{animation-play-state:paused!important}
.hd .nm small{font-variant-numeric:tabular-nums}
.bd{display:flex;flex-direction:column;gap:12px;align-items:stretch;flex:1;min-height:0}
.dial{position:relative;align-self:center;width:100%;max-width:var(--nova-timer-size,240px);aspect-ratio:1;flex:none}
.dial svg{display:block;width:100%;height:100%;overflow:visible}
.ro{position:absolute;left:50%;top:56%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;width:60%}
.ro .t{display:block;font-size:clamp(22px,calc(var(--dw,240px) * .16),46px);font-weight:600;letter-spacing:.01em;font-variant-numeric:tabular-nums;line-height:1.05;white-space:nowrap}
.ro .s{display:block;font-size:clamp(11px,calc(var(--dw,240px) * .05),14px);opacity:.65;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.st-idle .scene{opacity:.55}.st-idle .ro .t{opacity:.7}
.alm .scene{opacity:1}
.anim.st-paused .ro .t{animation:tm-blink 1.4s ease-in-out infinite}
.ctl{display:flex;flex-direction:column;gap:10px;justify-content:center;min-width:0}
.row2{display:flex;gap:8px;flex-wrap:wrap}
.bt2{flex:1 1 0;min-width:0;box-sizing:border-box;min-height:var(--nova-timer-button-height,52px);padding:0 8px;border-radius:16px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);
display:flex;align-items:center;justify-content:center;gap:6px;font-size:15px;font-weight:500;color:inherit;white-space:nowrap;overflow:hidden;transition:background-color .2s,transform .15s,box-shadow .2s}
.bt2 span{min-width:0;overflow:hidden;text-overflow:ellipsis}
.bt2 ha-icon{--mdc-icon-size:21px;flex:none}
.bt2:active{transform:scale(.95)}
/* Hauptknopf im Glas-Stil: nur leicht in der Kartenfarbe getönt, Icon in der Farbe – keine Vollfarbfläche */
.bt2.pri{background:color-mix(in srgb,var(--dc) 22%,var(--nv-chip));border-color:color-mix(in srgb,var(--dc) 55%,transparent)}
.bt2.pri ha-icon{color:var(--dc)}
.bt2.sel{border-color:color-mix(in srgb,var(--dc) 70%,transparent);background:color-mix(in srgb,var(--dc) 14%,var(--nv-chip))}
.pre{display:grid;grid-template-columns:repeat(var(--n,4),minmax(0,1fr));gap:8px}
.pre .bt2{font-size:16px;font-weight:600}
.zone{position:relative;display:flex;flex-direction:column;gap:10px;justify-content:center;min-width:0}
/* Eigene Zeit liegt über Start/Schnellwahl (die bleiben unsichtbar stehen) – die Karte wird nie höher oder niedriger */
.zone.op>.main,.zone.op>.pre{visibility:hidden}
.cust{position:absolute;inset:0;display:flex;flex-direction:column;gap:10px;justify-content:center;min-height:0}
.cust.sc{display:grid;grid-template-columns:minmax(0,1fr) minmax(84px,40%);grid-template-rows:minmax(0,1fr) auto;gap:10px}
.cust:not(.sc) .scl,.cust:not(.sc) .rd,.cust.sc .stps{display:none}
.cust.sc .rd{grid-column:1;grid-row:1}.cust.sc .row2{grid-column:1;grid-row:2;flex-wrap:nowrap}.cust.sc .scl{grid-column:2;grid-row:1/3}
/* Tuner-Skala: Striche wandern beim Ziehen (nur transform), die Marke in der Mitte zeigt die Zeit */
.rd{display:flex;align-items:center;justify-content:center;min-width:0;min-height:0}
.rd b{font-size:clamp(26px,10cqw,52px);font-weight:600;font-variant-numeric:tabular-nums;line-height:1;white-space:nowrap}
.rd.in b{cursor:text}
.rd input{width:100%;max-width:6.5em;box-sizing:border-box;font:inherit;font-size:clamp(20px,7cqw,36px);font-weight:600;text-align:center;color:inherit;background:var(--nv-chip);border:1px solid color-mix(in srgb,var(--dc) 60%,transparent);border-radius:12px;padding:6px;outline:none}
.scl{position:relative;overflow:hidden;min-height:0;border-radius:16px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);touch-action:none;cursor:grab;outline:none;user-select:none;-webkit-user-select:none;
-webkit-mask-image:linear-gradient(transparent,#000 24%,#000 76%,transparent);mask-image:linear-gradient(transparent,#000 24%,#000 76%,transparent)}
.scl:focus-visible{border-color:color-mix(in srgb,var(--dc) 70%,transparent)}
.scl .str{position:absolute;left:0;right:0;top:0;height:0;will-change:transform}
.scl .str.snap{transition:transform .22s cubic-bezier(.2,.8,.3,1)}
.scl i{position:absolute;left:10px;width:16%;height:1.5px;margin-top:-.75px;background:rgba(255,255,255,.2)}
.scl i.m{width:34%;background:rgba(255,255,255,.5)}
.scl b{position:absolute;left:calc(10px + 34% + 8px);height:16px;margin-top:-8px;line-height:16px;font-size:13px;font-weight:600;opacity:.7;font-variant-numeric:tabular-nums;white-space:nowrap}
.scl .mk{position:absolute;left:0;right:0;top:50%;height:2px;margin-top:-1px;background:var(--dc);box-shadow:0 0 8px color-mix(in srgb,var(--dc) 60%,transparent);pointer-events:none}
.scl .mk::before{content:'';position:absolute;left:0;top:-5px;border:6px solid transparent;border-left:7px solid var(--dc);border-right:0}
/* Eigene Zeit: je Einheit [−] 05 Min [+] nebeneinander, so hoch wie Schnellwahl + Knöpfe – die Karte wächst nicht */
.stps{display:flex;gap:8px}
.stp{flex:1 1 0;display:flex;align-items:center;justify-content:space-between;gap:2px;padding:0 3px;min-width:0;border-radius:16px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);height:var(--nova-timer-button-height,52px);box-sizing:border-box}
.stp .mi{order:0}.stp .v{order:1;flex:1;text-align:right;font-size:19px;font-weight:600;font-variant-numeric:tabular-nums}.stp small{order:2;flex:1;text-align:left;font-size:11px;opacity:.6;margin-left:4px}.stp .pl{order:3}
.stp .hb{width:34px;height:42px;flex:none;border-radius:12px}
.stp .hb ha-icon{--mdc-icon-size:22px}
.msg{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:16px;font-size:16px;font-weight:600;
background:color-mix(in srgb,var(--ac) 18%,var(--nv-chip));border:1px solid color-mix(in srgb,var(--ac) 50%,transparent)}
.msg ha-icon{color:var(--ac);--mdc-icon-size:26px}
.anim .msg ha-icon{animation:tm-ring 1.2s ease-in-out infinite;transform-origin:50% 10%}
.alm .dl-bell{opacity:1}
.anim.alm.fx .dl-bell{animation:tm-pop .45s ease-out both}
.anim.alm .dl-crown,.anim.alm .dl-push{animation:tm-press 1.2s ease-in-out infinite}
.anim.alm .rot{animation:tm-shake 1.2s ease-in-out infinite;transform-box:view-box;transform-origin:100px 112px}
.scene .snd path{fill:none;stroke:var(--ac);stroke-width:2;stroke-linecap:round;opacity:0}
.anim.alm .snd path{animation:tm-snd 1.2s ease-out infinite}.anim.alm .snd path:nth-child(2n){animation-delay:.25s}
.alm:not(.anim) .snd path{opacity:.7}
.st-active .dl-push.r{animation:none}
.prs .dl-push.r,.prs .dl-crown{animation:tm-press .35s ease-out}
.scene .tip{fill:#fff;filter:drop-shadow(0 0 3px var(--dc));opacity:0;transition:opacity .4s}
.st-active .scene .tip,.st-paused .scene .tip{opacity:1}
.scene .tipg{transition:transform 1s linear;transform-box:view-box;transform-origin:100px 112px}
.st-idle .scene .dl-arc{opacity:.35}
[hidden]{display:none!important}
/* Kompakt: kleine Stoppuhr links, Zeit daneben, Knöpfe rechts; Schnellwahl und eigene Zeit darunter über die ganze Breite */
.cmp .hd{display:none}
.cmp .bd{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;align-content:center;column-gap:14px;row-gap:10px}
.cmp .ctl{display:contents}
.cmp .dial{grid-column:1;grid-row:1;width:84px;max-width:84px}.cmp .ro{display:none}
.cmp .ct2{grid-column:2;grid-row:1;min-width:0}
.cmp .main{flex-wrap:nowrap}
.cmp .zone,.cmp .msg{grid-column:1/-1}
.cmp .zone{min-height:calc(2 * var(--nova-timer-button-height,52px) + 10px)}
.cmp .msg{display:none}
.ct2 .tt b{display:block;font-size:42px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.1}
.ct2 .tt small{display:block;font-size:12.5px;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ct2 .tt i{font-style:normal;opacity:.75}
.full .ct2{display:none}
.cmp.alm .tt b{color:var(--ac)}
@container (max-width:340px){.main.n3 .bt2 ha-icon{display:none}.bt2{font-size:14px}}
@container (max-width:260px){.main .bt2 span{display:none}.main .bt2 ha-icon{display:flex!important}}
@container (min-width:400px){.full .bd{flex-direction:row;align-items:center}.full .dial{width:46%;max-width:var(--nova-timer-size,260px)}.full .ctl{flex:1;align-self:stretch}.full .zone{flex:1}}
/* Stoppuhr neben den Knöpfen, aber wenig Platz rechts: Hauptknöpfe untereinander, damit kein Text abgeschnitten wird */
@container (min-width:400px) and (max-width:560px){.full .main{flex-direction:column}.full .main .bt2{flex:none;width:100%}}
@keyframes tm-blink{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes tm-ring{0%,60%,100%{transform:rotate(0)}10%,30%,50%{transform:rotate(-14deg)}20%,40%{transform:rotate(14deg)}}
@keyframes tm-shake{0%,60%,100%{transform:rotate(0)}10%,30%,50%{transform:rotate(-3deg)}20%,40%{transform:rotate(3deg)}}
@keyframes tm-press{0%,100%{transform:translateY(0)}20%{transform:translateY(3px)}}
@keyframes tm-snd{0%{opacity:0;transform:scale(.8)}30%{opacity:.85}100%{opacity:0;transform:scale(1.25)}}
@keyframes tm-pop{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes tm-frame{0%,100%{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 2px var(--ac),0 0 10px color-mix(in srgb,var(--ac) 30%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}50%{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 2px var(--ac),0 0 30px color-mix(in srgb,var(--ac) 75%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}}
@media (prefers-reduced-motion:reduce){.anim *,.anim{animation:none!important}}`;

// Schallbögen links und rechts der Krone (nur beim Klingeln sichtbar)
const SND = `<g class="snd" style="transform-box:view-box;transform-origin:100px 18px"><path d="M78 20a16 16 0 0 1 6-12"/><path d="M70 24a26 26 0 0 1 9-20"/><path d="M122 20a16 16 0 0 0-6-12"/><path d="M130 24a26 26 0 0 0-9-20"/></g>`;
const SVG = `<svg viewBox="0 0 200 200" aria-hidden="true" class="scene"><defs>${dialDefs('t', CX, CY, R)}</defs>${SND}
<g class="rot">${crown('t', CX, CY, R)}${dialBody('t', CX, CY, R, RING)}
<g class="tipg"><circle class="tip" cx="${CX}" cy="${CY - RING}" r="3.2"/></g>
${dialGlass('t', CX, CY, R)}</g>${bellBadge(CX + R, CY + R)}</svg>`;

class NovaTimerCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('timer-card-editor')); }
  static getStubConfig(h) {
    const t = Object.keys(h?.states || {}).find(id => id.startsWith('timer.'));
    return t ? {entity: t} : {};
  }
  constructor() { super(); this._cust = {h: 0, m: 5, s: 0}; this._showCust = false; }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (c.entity && !String(c.entity).startsWith('timer.')) throw new Error('Bitte einen Timer-Helfer (timer.*) wählen');
    this._c = {...DEF, ...c};
    this._pre = presetSecs(this._c.presets);
    this._ids = [c.entity].filter(Boolean);
    this._key = null;
    if (this._e) this._layout();
    if (this._h) this._render();
  }
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    if (!this._e) this._build();
    else if (this._key != null && !hassChanged(old, h, this._ids)) return;
    this._render();
  }
  connectedCallback() {
    this._quiet = inPicker(this);
    if (!this._e && this._c && this._h) this._build();
    else if (this._ro && this._e) { this._ro.observe(this._e.dial); this._ro.observe(this._e.g); }
    this._stopVis?.();
    this._stopVis = watchVisible(this, v => { this._vis = v && !this._quiet; this._tick(true); });
  }
  disconnectedCallback() {
    this._stopVis?.(); this._stopVis = null;
    this._vis = false; this._tick();
    this._ro?.disconnect();
    this._stopRep();
    this._stopFling();
    this._ac?.close?.().catch(() => {}); this._ac = null;
  }
  getCardSize() { return this._c?.layout === 'compact' ? 2 : 5; }
  getGridOptions() { return this._c?.layout === 'compact' ? {columns: 6, rows: 'auto', min_columns: 4} : {columns: 6, rows: 'auto', min_columns: 4}; }

  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${TCSS}</style><div class="g tm">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<div class="bd"><div class="dial">${SVG}<div class="ro"><span class="t"></span><span class="s"></span></div></div>
<div class="ctl"><div class="ct2"><div class="tt"><b></b><small></small></div></div>
<div class="msg" hidden><ha-icon icon="mdi:bell-ring"></ha-icon><span>Zeit ist um!</span></div>
<div class="zone"><div class="row2 main"></div><div class="pre"></div>
<div class="cust" hidden><div class="rd"><b></b></div><div class="scl" tabindex="0" role="slider" aria-label="Eigene Zeit"><div class="str"></div><div class="mk"></div></div><div class="stps">${['h|Std', 'm|Min', 's|Sek'].map(x => { const [k, l] = x.split('|'); return `<div class="stp" data-k="${k}"><small>${l}</small><div class="hb pl"><ha-icon icon="mdi:plus"></ha-icon></div><span class="v"></span><div class="hb mi"><ha-icon icon="mdi:minus"></ha-icon></div></div>`; }).join('')}</div>
<div class="row2"><div class="bt2 cbk"><ha-icon icon="mdi:close"></ha-icon><span>Zurück</span></div><div class="bt2 pri cgo"><ha-icon icon="mdi:check"></ha-icon><span>Übernehmen</span></div></div></div></div>
</div></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), hd: q('.hd'), ic: q('.hd .ic'), nm: q('.hd b'), sub: q('.hd small'), dial: q('.dial'), svg: q('svg'), t: q('.ro .t'), s: q('.ro .s'),
      tt: q('.ct2 b'), ts: q('.ct2 small'), msg: q('.msg'), main: q('.main'), pre: q('.pre'), cust: q('.cust'), zone: q('.zone'), rd: q('.rd'), scl: q('.scl'), str: q('.str'), tip: q('.tipg')};
    this._scaleInit();
    // Kopfzeile: Antippen/lang drücken = Details (bzw. eigene Aktion)
    const act = () => ({entity: this._c.entity, tap_action: this._c.tap_action, hold_action: this._c.hold_action});
    press(this._e.hd, {tap: () => runAction(this, act(), 'tap', true), hold: () => runAction(this, act(), 'hold')});
    // Uhr antippen = Start/Pause/Weiter bzw. Hinweis bestätigen
    press(this._e.dial, {tap: () => this._dialTap(), hold: () => runAction(this, act(), 'hold')});
    // Eigene Zeit: Stepper mit Wiederholen beim Gedrückthalten
    r.querySelectorAll('.stp').forEach(st => {
      const k = st.dataset.k;
      [['.pl', 1], ['.mi', -1]].forEach(([s, d]) => this._rep(st.querySelector(s), () => this._step(k, d)));
    });
    press(q('.cbk'), {tap: () => { this._showCust = false; this._key = null; this._render(); }});
    // Übernehmen: Zeit vormerken (Uhr zeigt sie), gestartet wird mit „Start“ bzw. Antippen der Stoppuhr
    press(q('.cgo'), {tap: () => { const {h, m, s} = this._cust, u = this._units(), sec = this._scale() ? this._sec : (u.includes('h') ? h : 0) * 3600 + m * 60 + (u.includes('s') ? s : 0); if (sec > 0) { this._armed = sec; this._showCust = false; this._key = null; this._render(); } }});
    // Größe der Zeitanzeige an die Uhr anpassen
    if ('ResizeObserver' in window) {
      this._ro = new ResizeObserver(es => { es.forEach(x => { if (x.target === this._e.dial && x.contentRect.width) this._e.dial.style.setProperty('--dw', `${x.contentRect.width}px`); }); this._fitBtn(); if (this._scale() && !this._e.cust.hidden) this._scaleTo(this._sec, false); });
      this._ro.observe(this._e.dial); this._ro.observe(this._e.g);
    }
    this._layout();
    this._key = null;
  }
  _layout() {
    const c = this._c, e = this._e, rv = roleVars(c.color), av = roleVars(c.alarm_color);
    e.g.style.cssText = `--tc:${rv.c};--tcfg:${rv.fg};--ac:${av.c};--acfg:${av.fg}`;
    e.g.classList.toggle('cmp', c.layout === 'compact');
    e.g.classList.toggle('full', c.layout !== 'compact');
    e.g.classList.toggle('glow', c.glow !== false);
    this._presetsKey = null;
  }
  _S() { return this._c.entity ? this._h?.states[this._c.entity] : null; }

  // Restzeit und Gesamtdauer aus dem Zustand des Helfers
  _calc() {
    const s = this._S();
    if (!s) return null;
    const a = s.attributes, total = parseDur(a.duration) || 0;
    let left = total;
    if (s.state === 'idle' && this._armed > 0) return {st: s.state, total: this._armed, left: this._armed, fin: a.finishes_at};
    if (s.state === 'active') left = a.finishes_at ? (Date.parse(a.finishes_at) - Date.now()) / 1000 : parseDur(a.remaining) ?? total;
    else if (s.state === 'paused') left = parseDur(a.remaining) ?? total;
    return {st: s.state, total, left: Math.max(0, left), fin: a.finishes_at};
  }
  // Abgelaufen? HA setzt nach dem Ablauf last_transition = finished; ohne das Attribut zählt der beobachtete Wechsel aktiv → bereit
  _alarm(s) {
    if (!s || s.state !== 'idle') return false;
    const fin = s.attributes.last_transition ? s.attributes.last_transition === 'finished' : this._sawFinish === s.last_changed;
    const age = (Date.now() - Date.parse(s.last_changed)) / 60000, max = +this._c.alarm_minutes;
    return fin && this._dismissed !== s.last_changed && (!(max > 0) || age < max);
  }

  _render() {
    const c = this._c, e = this._e, h = this._h;
    if (!e || !h) return;
    const s = this._S();
    // Wechsel aktiv → bereit mit abgelaufener Zeit merken (Fallback ohne last_transition)
    if (s && this._prevSt === 'active' && s.state === 'idle' && this._prevFin && Date.parse(this._prevFin) <= Date.now() + 2000) this._sawFinish = s.last_changed;
    const fresh = s && this._prevSt && this._prevSt !== 'idle' && s.state === 'idle';
    this._prevSt = s?.state; this._prevFin = s?.attributes.finishes_at;
    const v = this._calc(), al = this._alarm(s), st = v?.st || 'na';
    const key = JSON.stringify([s?.state, s?.last_changed, s?.attributes, al, this._showCust, c]);
    const changed = key !== this._key;
    this._key = key;
    if (changed) {
      e.g.classList.remove('st-active', 'st-paused', 'st-idle', 'st-na');
      e.g.classList.add(`st-${st}`);
      if (al && !e.g.classList.contains('alm')) { e.g.classList.add('fx'); if (c.animation !== false && this._vis) sweep(e.g); }
      if (!al) e.g.classList.remove('fx');
      e.g.classList.toggle('alm', al);
      e.g.classList.toggle('na', !s);
      const nm = s ? nameOf(h, {entity: c.entity, name: c.name}) : (c.name || 'Timer');
      e.nm.textContent = nm; this._nm = nm;
      e.ic.innerHTML = `<ha-icon icon="${esc(c.icon || s?.attributes.icon || 'mdi:timer-outline')}"></ha-icon>`;
      e.ic.classList.toggle('on', st === 'active' || al);
      e.hd.classList.toggle('on', st === 'active' || al);
      e.msg.hidden = !al;
      e.msg.querySelector('span').textContent = c.alarm_text || 'Zeit ist um!';
      this._buttons(st, al, v);
      if (fresh && !al) e.cust.hidden = !this._showCust;
    }
    this._time();
    this._tick();
  }
  // Zeit, Ring und Untertitel – läuft jede Sekunde, solange der Timer läuft
  _time() {
    const e = this._e, v = this._calc(), s = this._S(), al = this._alarm(s);
    if (!v) {
      e.t.textContent = '–:––'; e.s.textContent = this._c.entity ? 'Timer nicht gefunden' : 'Timer-Helfer wählen';
      e.tt.textContent = '–:––'; e.ts.textContent = e.s.textContent; e.sub.textContent = e.s.textContent;
      e.svg.style.setProperty('--p', 0);
      return;
    }
    const p = v.total ? v.left / v.total : 0, txt = al ? '0:00' : fmtLeft(v.st === 'idle' ? v.total : v.left);
    let sub = '';
    if (al) sub = this._c.alarm_text || 'Zeit ist um!';
    else if (v.st === 'active') sub = `bis ${this._clock(v.fin ? new Date(v.fin) : new Date(Date.now() + v.left * 1000))}`;
    else if (v.st === 'paused') sub = 'Pausiert';
    else sub = 'Bereit';
    if (e.t.textContent !== txt) { e.t.textContent = txt; e.tt.textContent = txt; }
    // Kopfzeile: Zustand in Worten; die Endzeit steht schon in der Uhr (bzw. im Kompakt-Layout neben der Zeit)
    const hs = al ? sub : {active: 'Läuft', paused: 'Pausiert'}[v.st] || 'Bereit';
    if (e.s.textContent !== sub) e.s.textContent = sub;
    const ts = `${this._nm ? `${this._nm} · ` : ''}${sub}`;
    if (e.ts.textContent !== ts) e.ts.textContent = ts;
    if (e.sub.textContent !== hs) e.sub.textContent = hs;
    const pp = v.st === 'idle' ? (al ? 0 : 1) : p;
    e.svg.style.setProperty('--p', pp.toFixed(4));
    e.tip.style.transform = `rotate(${(pp * 360).toFixed(2)}deg)`;
  }
  _clock(d) {
    const h = this._h, o = {hour: '2-digit', minute: '2-digit', timeZone: tzOf(h)};
    try { return new Intl.DateTimeFormat(langOf(h), o).format(d); } catch { delete o.timeZone; return new Intl.DateTimeFormat(langOf(h), o).format(d); }
  }
  _buttons(st, al, v) {
    const c = this._c, e = this._e, b = [];
    const B = (cls, icon, label, fn) => b.push([cls, icon, label, fn]);
    if (!this._S()) { /* keine Knöpfe ohne Timer */ }
    else if (al) {
      B('pri', ICON.ok, 'OK', () => this._dismiss());
      if (v?.total) B('', ICON.again, 'Nochmal', () => { this._dismiss(); this._start(v.total); });
    } else if (st === 'active') {
      B('', ICON.pause, 'Pause', () => this._svc('pause'));
      if (c.show_add !== false) B('', ICON.plus, '+1 Min', () => this._add(60));
      B('', ICON.stop, 'Abbrechen', () => this._svc('cancel'));
    } else if (st === 'paused') {
      B('pri', ICON.play, 'Weiter', () => this._svc('start'));
      B('', ICON.stop, 'Abbrechen', () => this._svc('cancel'));
    } else {
      B('pri', ICON.play, 'Start', () => this._start(v?.total || 0));
      if (c.show_custom !== false) B(this._showCust ? 'sel' : '', ICON.tune, 'Eigene Zeit', () => { this._showCust = !this._showCust; if (this._showCust) this._custFrom(v?.total || 0); this._key = null; this._render(); });
    }
    e.main.innerHTML = '';
    e.main.classList.toggle('n3', b.length > 2);
    b.forEach(([cls, icon, label, fn]) => {
      const d = document.createElement('div');
      d.className = `bt2 ${cls}`; d.title = label;
      d.innerHTML = `<ha-icon icon="${icon}"></ha-icon><span>${esc(label)}</span>`;
      press(d, {tap: fn});
      e.main.append(d);
    });
    const idle = st === 'idle' && !al && !!this._S();
    e.pre.hidden = !idle || this._showCust || c.show_presets === false || !this._pre.length;
    if (!e.pre.hidden) {
      const pk = JSON.stringify(this._pre);
      if (this._presetsKey !== pk) {
        this._presetsKey = pk;
        e.pre.style.setProperty('--n', Math.min(4, this._pre.length));
        e.pre.innerHTML = '';
        this._pre.forEach(sec => {
          const d = document.createElement('div');
          d.className = 'bt2'; d.textContent = presetLbl(sec); d.title = `${sec % 60 ? presetLbl(sec) : sec / 60 + ' Minuten'} starten`;
          press(d, {tap: () => this._start(sec)});
          e.pre.append(d);
        });
      }
    }
    e.cust.hidden = !(idle && this._showCust && c.show_custom !== false);
    // Eigene Zeit ersetzt Start/Eigene Zeit und Schnellwahl, damit die Karte nicht wächst
    e.zone.classList.toggle('op', !e.cust.hidden);
    if (!e.cust.hidden) this._custShow();
    this._fitBtn();
  }
  _dialTap() {
    const s = this._S();
    if (!s) return;
    if (this._alarm(s)) return this._dismiss();
    if (s.state === 'active') return this._svc('pause');
    if (s.state === 'paused') return this._svc('start');
    this._start(this._calc()?.total || 0);
  }
  _dismiss() { this._dismissed = this._S()?.last_changed; this._key = null; this._render(); }
  _press() { const g = this._e.g; g.classList.remove('prs'); void g.offsetWidth; g.classList.add('prs'); }
  _svc(svc, data = {}) {
    if (!this._c.entity) return;
    this._press();
    return this._h.callService('timer', svc, {entity_id: this._c.entity, ...data});
  }
  _start(sec) { this._armed = 0; return sec > 0 ? this._svc('start', {duration: hms(Math.round(sec))}) : this._svc('start'); }
  // +1 Minute: timer.change (ab HA 2024.x); geht nicht über die eingestellte Dauer hinaus → dann neu starten mit Rest + 60 s
  async _add(sec) {
    const v = this._calc();
    try { await this._svc('change', {duration: hms(sec)}); }
    catch (err) { console.warn('[nova-cards] Timer: +1 Min per Neustart', err); if (v) this._start(Math.round(v.left + sec)); }
  }
  // Stepper: läuft am Ende rundherum (59 → 0); Sekunden in 5er-Schritten, kompakt ohne Stunden bis 180 Minuten
  // Einheiten der eigenen Zeit: auto = groß Std/Min/Sek, kompakt Min/Sek; sonst jede Kombination aus h, m, s (z. B. „hm“, „s“)
  _units() {
    const u = String(this._c.custom_units || 'auto'), l = u === 'auto' ? '' : ['h', 'm', 's'].filter(k => u.includes(k)).join('');
    return [...(l || (this._c.layout === 'compact' ? 'ms' : 'hms'))];
  }
  // Größter Wert je Feld: die kleinste gewählte Einheit nimmt den Rest auf (nur Minuten → bis 180, nur Sekunden → bis 59:55)
  _max(k) {
    const u = this._units();
    if (k === 'h') return u.length === 1 ? 24 : 23;
    if (k === 'm') return u.includes('h') ? 59 : 180;
    return u.includes('m') ? 55 : 3595;
  }
  _step(k, d) {
    const c = this._cust, st = k === 's' ? 5 : 1, n = this._max(k) + st;
    c[k] = ((Math.round(c[k] / st) * st + d * st) % n + n) % n;
    this._custShow();
  }
  // Auswahl beginnt mit der eingestellten Zeit (5:00 → 0 Std, 5 Min, 0 Sek); fehlt eine größere Einheit, zählt ihr Teil in der nächstkleineren
  _custFrom(sec) {
    if (this._scale()) { this._sec = sec > 0 ? Math.min(sec, this._vals.at(-1)) : 300; return; }
    const t = Math.max(0, Math.round(sec)), u = this._units(), H = u.includes('h'), M = u.includes('m'), S = u.includes('s');
    const c = {h: 0, m: 0, s: 0};
    if (H) c.h = Math.min(this._max('h'), M || S ? Math.floor(t / 3600) : Math.round(t / 3600));
    if (M) c.m = Math.min(this._max('m'), Math.floor((H ? t % 3600 : t) / 60) + (S ? 0 : Math.round(t % 60 / 60)));
    if (S) c.s = Math.min(this._max('s'), Math.round((M ? t % 60 : H ? t % 3600 : t) / 5) * 5);
    if (!c.h && !c.m && !c.s) { if (M) c.m = 5; else if (H) c.h = 1; else c.s = 30; }
    this._cust = c;
  }
  // Knopf-Texte, die nicht passen, weglassen – der Knopf zeigt dann nur sein Icon (nie „Überne…“)
  _fitBtn() { if (this._e) fitLabels(this.shadowRoot, '.bt2 > span', true); }
  _custShow() {
    const e = this._e, sc = this._scale();
    e.cust.classList.toggle('sc', sc);
    if (sc) { this._scaleBuild(); e.rd.classList.toggle('in', this._c.custom_input !== false); requestAnimationFrame(() => this._scaleTo(this._sec, false)); return; }
    const u = this._units(); this._e.cust.querySelectorAll('.stp').forEach(st => { st.hidden = !u.includes(st.dataset.k); st.querySelector('.v').textContent = String(this._cust[st.dataset.k]).padStart(2, '0'); }); }
  // Taste mit Wiederholung beim Gedrückthalten (Stepper)
  _rep(el, fn) {
    el.tabIndex = 0; el.setAttribute('role', 'button'); el.classList.add('tap');
    el.addEventListener('pointerdown', ev => { ev.preventDefault(); fn(); this._stopRep(); this._rt = setTimeout(() => { this._ri = setInterval(fn, 110); }, 450); });
    ['pointerup', 'pointerleave', 'pointercancel'].forEach(t => el.addEventListener(t, () => this._stopRep()));
    el.addEventListener('contextmenu', ev => ev.preventDefault());
    el.addEventListener('keydown', ev => { if (ev.key === 'Enter' || ev.key === ' ') { ev.preventDefault(); fn(); } });
  }
  _stopRep() { clearTimeout(this._rt); clearInterval(this._ri); this._rt = this._ri = null; }
  /* ---------- Eigene Zeit als Tuner-Skala ----------
     Senkrechte Skala, mit dem Finger hoch/runter ziehen. Raster: bis 5 Min 15 s, bis 60 Min 1 Min, darüber 5 Min.
     Schnelles Wischen läuft mit Schwung aus und rastet dann ein. Pro Raster ein leiser Klick (und Vibration, wo es geht).
     Pro Bild wird nur transform gesetzt – nichts wird neu gezeichnet. */
  _scale() { return this._c?.custom_picker !== 'buttons'; }
  get _vals() {
    const max = Math.max(5, Math.min(1440, +this._c?.scale_max || 180)) * 60;
    if (this._valsFor === max) return this._valsC;
    const v = [];
    for (let t = 15; t <= Math.min(300, max); t += 15) v.push(t);
    for (let t = 360; t <= Math.min(3600, max); t += 60) v.push(t);
    for (let t = 3900; t <= max; t += 300) v.push(t);
    this._valsFor = max; this._valsC = v;
    return v;
  }
  _scaleBuild() {
    const vals = this._vals, key = vals.length + '|' + vals.at(-1);
    if (this._strKey === key) return;
    this._strKey = key;
    // Lange Striche: volle Minuten bis 5, alle 5 Min bis 60, darüber alle 15 Min; Zahlen (Minuten) an ausgewählten Stellen
    const LBL = new Set([1, 2, 3, 4, 5, 10, 15, 20, 30, 45, 60, 90, 120, 150, 180, 240, 300, 360, 480, 600, 720, 900, 1080, 1260, 1440]);
    this._e.str.innerHTML = vals.map((t, i) => {
      const y = i * SP, maj = t <= 300 ? t % 60 === 0 : t <= 3600 ? t % 300 === 0 : t % 900 === 0, min = t / 60;
      return `<i${maj ? ' class="m"' : ''} style="top:${y}px"></i>${maj && LBL.has(min) ? `<b style="top:${y}px">${min}</b>` : ''}`;
    }).join('');
  }
  _fmt(t) { const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60, p = n => String(n).padStart(2, '0'); return h ? `${h}:${p(m)}:${p(s)}` : `${m}:${p(s)}`; }
  _idxOf(t) { const v = this._vals; let b = 0; v.forEach((x, i) => { if (Math.abs(x - t) < Math.abs(v[b] - t)) b = i; }); return b; }
  _mid() { return (this._e.scl.clientHeight || 0) / 2; }
  _offOf(i) { return this._mid() - i * SP; }
  _clampOff(o) { return Math.max(this._offOf(this._vals.length - 1), Math.min(this._offOf(0), o)); }
  _move(o, snap) {
    this._off = o;
    const s = this._e.str;
    s.classList.toggle('snap', !!snap);
    s.style.transform = `translate3d(0,${o}px,0)`;
  }
  // Raster unter der Marke prüfen: neue Zeit, Klick
  _hit(o) {
    const i = Math.max(0, Math.min(this._vals.length - 1, Math.round((this._mid() - o) / SP)));
    if (i === this._idx) return;
    this._idx = i; this._sec = this._vals[i];
    this._showSec(); this._click();
  }
  _showSec() {
    const e = this._e, txt = this._fmt(this._sec);
    const b = e.rd.querySelector('b');
    if (b) b.textContent = txt;
    e.scl.setAttribute('aria-valuetext', txt);
    if (this._c.layout === 'compact') e.tt.textContent = txt;
  }
  // Zeit setzen und Skala dorthin stellen (exakte Werte aus dem Zahlenfeld bleiben exakt, die Skala zeigt das nächste Raster)
  _scaleTo(t, snap) {
    if (!this._e) return;
    this._sec = t; this._idx = this._idxOf(t);
    this._move(this._offOf(this._idx), snap);
    this._showSec();
  }
  _snap() { this._stopFling(); const i = Math.max(0, Math.min(this._vals.length - 1, Math.round((this._mid() - this._off) / SP))); this._idx = -1; this._move(this._offOf(i), true); this._hit(this._offOf(i)); }
  _stopFling() { if (this._raf) cancelAnimationFrame(this._raf); this._raf = 0; }
  // Leiser Klick: sehr kurzer Ton über Web Audio (der Echo kann nicht vibrieren), dazu Vibration, wo vorhanden
  _click() {
    if (this._c.click_sound === false || !this._drag) return;
    const now = performance.now();
    if (now - (this._lastClick || 0) < 28) return;
    this._lastClick = now;
    try { navigator.vibrate?.(6); } catch (e) { /* nicht unterstützt */ }
    const ac = this._ac;
    if (!ac || ac.state === 'closed') return;
    try {
      const o = ac.createOscillator(), g = ac.createGain(), t = ac.currentTime;
      o.type = 'triangle'; o.frequency.value = 2100;
      g.gain.setValueAtTime(0.07, t); g.gain.exponentialRampToValueAtTime(0.0001, t + 0.025);
      o.connect(g).connect(ac.destination); o.start(t); o.stop(t + 0.03);
    } catch (e) { /* ohne Ton weiter */ }
  }
  _scaleInit() {
    const e = this._e, sc = e.scl;
    let y0 = 0, o0 = 0, moved = false, pts = [];
    sc.addEventListener('pointerdown', ev => {
      if (ev.button > 0) return;
      ev.preventDefault(); ev.stopPropagation();
      // Ton erst nach einer Berührung möglich (Autoplay-Regeln der Browser)
      if (this._c.click_sound !== false && !this._ac) { const A = window.AudioContext || window.webkitAudioContext; if (A) try { this._ac = new A(); } catch (x) { this._ac = null; } }
      this._ac?.resume?.().catch(() => {});
      this._stopFling();
      sc.setPointerCapture?.(ev.pointerId);
      this._drag = true; moved = false; y0 = ev.clientY; o0 = this._off ?? this._offOf(this._idx || 0); pts = [[ev.timeStamp, ev.clientY]];
      this._move(o0, false);
      sc.focus({preventScroll: true});
    });
    sc.addEventListener('pointermove', ev => {
      if (!this._drag || this._fling) return;
      const dy = ev.clientY - y0;
      if (Math.abs(dy) > 4) moved = true;
      if (!moved) return;
      const o = this._clampOff(o0 + dy);
      this._move(o, false); this._hit(o);
      pts.push([ev.timeStamp, ev.clientY]); if (pts.length > 6) pts.shift();
    });
    const up = ev => {
      if (!this._drag) return;
      if (!moved) {
        // Antippen: oberhalb der Marke = kürzer, unterhalb = länger
        const r = sc.getBoundingClientRect(), i = Math.max(0, Math.min(this._vals.length - 1, this._idx + (ev.clientY < r.top + r.height / 2 ? -1 : 1)));
        this._move(this._offOf(i), true); this._hit(this._offOf(i)); this._drag = false; return;
      }
      // Schwung: Geschwindigkeit der letzten ~100 ms, läuft mit Reibung aus, dann einrasten
      const last = pts.at(-1), first = pts.find(p => last[0] - p[0] <= 100) || pts[0];
      let v = last[0] > first[0] ? (last[1] - first[1]) / (last[0] - first[0]) : 0;
      const calm = matchMedia('(prefers-reduced-motion: reduce)').matches;
      if (calm || Math.abs(v) < 0.25 || ev.type === 'pointercancel') { this._snap(); this._drag = false; return; }
      let t0 = performance.now();
      this._fling = true;
      const step = now => {
        const dt = Math.min(40, now - t0); t0 = now;
        let o = this._off + v * dt;
        const c = this._clampOff(o);
        if (c !== o) { o = c; v = 0; }
        v *= Math.pow(0.94, dt / 16);
        this._move(o, false); this._hit(o);
        if (Math.abs(v) > 0.03) this._raf = requestAnimationFrame(step);
        else { this._raf = 0; this._fling = false; this._snap(); this._drag = false; }
      };
      this._raf = requestAnimationFrame(step);
    };
    sc.addEventListener('pointerup', up);
    sc.addEventListener('pointercancel', up);
    // Swipe Card & Co. nicht mitwischen lassen
    ['touchstart', 'touchmove'].forEach(t => sc.addEventListener(t, ev => ev.stopPropagation(), {passive: true}));
    sc.addEventListener('wheel', ev => { ev.preventDefault(); this._drag = true; this._nudge(ev.deltaY > 0 ? 1 : -1); this._drag = false; }, {passive: false});
    sc.addEventListener('keydown', ev => {
      const d = {ArrowDown: 1, ArrowUp: -1, PageDown: 5, PageUp: -5}[ev.key];
      if (d) { ev.preventDefault(); this._drag = true; this._nudge(d); this._drag = false; }
    });
    // Zeit antippen = Zahlenfeld für exakte Eingabe (5 → 5 Min, 5:30, 1:05:00)
    press(e.rd, {tap: () => this._typeIn()});
  }
  _nudge(d) { this._stopFling(); const i = Math.max(0, Math.min(this._vals.length - 1, this._idx + d)); this._move(this._offOf(i), true); this._hit(this._offOf(i)); }
  _typeIn() {
    const rd = this._e.rd;
    if (this._c.custom_input === false || rd.querySelector('input')) return;
    const inp = document.createElement('input');
    inp.type = 'text'; inp.inputMode = 'numeric'; inp.value = this._fmt(this._sec); inp.setAttribute('aria-label', 'Zeit eintippen (Minuten oder m:ss)');
    rd.replaceChildren(inp);
    inp.focus(); inp.select();
    let done = false;
    const fin = ok => {
      if (done) return; done = true;
      const t = ok ? parseIn(inp.value) : 0;
      rd.replaceChildren(document.createElement('b'));
      if (t > 0) this._scaleTo(Math.min(t, 86399), true); else this._showSec();
    };
    inp.addEventListener('keydown', ev => { if (ev.key === 'Enter') fin(true); if (ev.key === 'Escape') fin(false); });
    inp.addEventListener('blur', () => fin(true));
  }
  // Ein Takt pro Sekunde, nur wenn der Timer läuft (oder klingelt) und die Karte zu sehen ist
  _tick(cameIn) {
    const e = this._e;
    if (!e) return;
    const vis = !!this._vis, s = this._S(), al = this._alarm(s);
    e.g.classList.toggle('anim', vis && this._c.animation !== false);
    e.g.classList.toggle('still', !vis);
    if (cameIn && vis && !this._wasVis && this._c.animation !== false) sweep(e.g);
    this._wasVis = vis;
    const run = vis && (s?.state === 'active' || al);
    if (run && !this._tm) this._tm = setInterval(() => {
      const s2 = this._S();
      if (s2?.state === 'active') this._time();
      else if (!this._alarm(s2)) { this._key = null; this._render(); }
    }, 1000);
    if (!run && this._tm) { clearInterval(this._tm); this._tm = null; }
  }
}
define('timer-card', NovaTimerCard, {name: 'Nova Timer Card', description: 'Küchen-Timer über einen Timer-Helfer: Schnellwahl, eigene Zeit, Pause, +1 Minute, Abbrechen – auf allen Geräten synchron, mit Hinweis beim Ablauf.', documentationURL: docUrl('nova-timer-card')});

/* ---------- Editor ---------- */
const S_GEN = [
  {name: 'entity', required: true, selector: {entity: {domain: 'timer'}}},
  g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}}),
];
const S_START = [
  {name: 'show_presets', selector: {boolean: {}}},
  {name: 'presets', selector: T},
  g2({name: 'show_custom', selector: {boolean: {}}}, sel('custom_picker', [['scale', 'Skala zum Ziehen'], ['buttons', 'Plus / Minus']])),
  g2({name: 'scale_max', selector: {number: {min: 5, max: 1440, step: 5, mode: 'box', unit_of_measurement: 'min'}}}, {name: 'click_sound', selector: {boolean: {}}}),
  {name: 'custom_input', selector: {boolean: {}}},
  sel('custom_units', [['auto', 'Automatisch'], ['h', 'Nur Stunden'], ['m', 'Nur Minuten'], ['s', 'Nur Sekunden'], ['hm', 'Stunden und Minuten'], ['ms', 'Minuten und Sekunden'], ['hms', 'Stunden, Minuten, Sekunden']]),
  {name: 'show_add', selector: {boolean: {}}},
];
const S_ALARM = [
  {name: 'alarm_text', selector: T},
  g2(ROLE('alarm_color'), {name: 'alarm_minutes', selector: {number: {min: 0, max: 120, mode: 'box', unit_of_measurement: 'min'}}}),
];
const S_LOOK = [
  g2(sel('layout', [['full', 'Groß (mit Stoppuhr)'], ['compact', 'Kompakt']]), ROLE('color')),
  g2({name: 'animation', selector: {boolean: {}}}, {name: 'glow', selector: {boolean: {}}}),
];
const S_ACT = [{name: 'tap_action', selector: A}, {name: 'hold_action', selector: A}];
const LABELS = {
  entity: 'Timer-Helfer', name: 'Name', icon: 'Icon', show_presets: 'Schnellwahl-Knöpfe zeigen', presets: 'Schnellwahl (Minuten, mit Komma)',
  show_custom: 'Knopf „Eigene Zeit“ zeigen', custom_picker: 'Eigene Zeit einstellen mit', scale_max: 'Skala bis', click_sound: 'Klick-Geräusch beim Drehen', custom_input: 'Zeit antippen = eintippen', custom_units: 'Plus / Minus in', show_add: 'Knopf „+1 Min“ während der Timer läuft', alarm_text: 'Text beim Ablauf',
  alarm_color: 'Farbe beim Ablauf', alarm_minutes: 'Hinweis anzeigen für', layout: 'Darstellung', color: 'Farbe',
  animation: 'Animationen', glow: 'Rahmen leuchtet, solange der Timer läuft', tap_action: 'Kopfzeile antippen', hold_action: 'Lange drücken',
};
const HELPERS = {
  entity: 'Ein Timer-Helfer läuft in Home Assistant – alle Geräte zeigen dieselbe Zeit. Anlegen unter Einstellungen → Geräte & Dienste → Helfer → Timer.',
  presets: 'z. B. „1, 5, 10, 15“. Auch „30s“ oder „1h“ geht. Höchstens 8.',
  custom_picker: 'Skala: wie ein Radio-Tuner hoch und runter ziehen, schnelles Wischen läuft mit Schwung aus. Raster bis 5 Min 15 Sekunden, bis 60 Min 1 Minute, darüber 5 Minuten.',
  click_sound: 'Leiser Klick pro Raster (und Vibration, wo das Gerät es kann).',
  custom_input: 'Antippen der großen Zeit öffnet ein Zahlenfeld: „5“ = 5 Minuten, „5:30“, „1:05:00“.',
  custom_units: 'Nur für Plus / Minus. Automatisch = groß Stunden/Minuten/Sekunden, kompakt Minuten/Sekunden. Gibt es keine größere Einheit, geht die kleinere weiter: „Nur Minuten“ bis 180, „Nur Sekunden“ bis 59:55.',
  alarm_text: 'Leer = „Zeit ist um!“',
  alarm_minutes: 'So lange klingelt die Karte nach dem Ablauf, wenn niemand „OK“ drückt. 0 = bis jemand bestätigt.',
  tap_action: 'Leer = Details des Timers öffnen. Die Stoppuhr selbst startet, pausiert und setzt fort.',
};

class NovaTimerCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static helpers = HELPERS;
  static openSections = ['general'];
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    const data = () => {
      const d = {...DEF, ...this._config};
      if (Array.isArray(d.presets)) d.presets = d.presets.join(', ');
      return d;
    };
    const form = s => this._form(s, data(), v => {
      const c = merge(this._config, names(s), v);
      if ('presets' in v) {
        const arr = list(v.presets).map(x => (/^\d+$/.test(x) ? +x : x));
        if (!arr.length || JSON.stringify(arr) === JSON.stringify(DEF.presets)) delete c.presets; else c.presets = arr;
      }
      // Standardwerte nicht in die Konfig schreiben
      Object.keys(DEF).forEach(k => { if (k !== 'presets' && c[k] === DEF[k]) delete c[k]; });
      this._emit(c);
    });
    const w = r.querySelector('.wrap');
    if (!Object.keys(this._hass?.states || {}).some(id => id.startsWith('timer.'))) w.append(this._hint('Noch kein Timer-Helfer vorhanden: Einstellungen → Geräte & Dienste → Helfer → „Helfer erstellen“ → Timer. Tipp: „Zustand wiederherstellen“ anhaken, dann übersteht der Timer auch einen Neustart von Home Assistant.'));
    w.append(
      this._section('general', 'mdi:timer-outline', 'Timer', b => b.append(form(S_GEN))),
      this._section('start', 'mdi:gesture-tap-button', 'Schnellwahl und Knöpfe', b => b.append(form(S_START))),
      this._section('alarm', 'mdi:bell-ring-outline', 'Wenn die Zeit um ist', b => {
        b.append(form(S_ALARM), this._hint('Ton oder Ansage (z. B. auf dem Echo) per Automation: Auslöser „Ereignis“ timer.finished mit diesem Timer.'));
      }),
      this._section('look', 'mdi:palette-outline', 'Aussehen', b => b.append(form(S_LOOK))),
      this._section('actions', 'mdi:gesture-tap', 'Aktionen', b => b.append(form(S_ACT))));
  }
}
define('timer-card-editor', NovaTimerCardEditor);
