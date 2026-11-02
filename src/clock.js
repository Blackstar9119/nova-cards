import {define, docUrl, tag} from './shared/define.js';
import {esc} from './shared/utils.js';
import {langOf, tzOf} from './shared/state.js';
import {runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, SECTION_EDITOR_CSS, roleVars} from './shared/styles.js';
import {inPicker, watchVisible} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, A, sel, ROLE} from './shared/editor-schema.js';
import {sweep} from './shared/scene.js';
import {dialDefs, dialBody, dialGlass, DIAL_CSS} from './shared/dial.js';

/* ---------- Nova Uhr Card ----------
   Uhrzeit digital oder analog, optional mit Sekunden, Wochentag und Datum. Sprache, 12/24 h und Zeitzone wie im HA-Profil.
   Ein einziger Zeitgeber, der genau zum nächsten Sekunden- bzw. Minutenwechsel feuert – und nur, solange die Karte zu sehen ist. */
const DEF = {mode: 'digital', show_seconds: false, show_weekday: true, show_date: true, date_format: 'long', time_format: 'auto', color: 'accent-1', glass: true};
const C = 100, R = 92;

const CCSS = `${DIAL_CSS}
:host{container-type:inline-size}
.g.ck{--dc:var(--kc);padding:14px 16px;gap:6px;justify-content:center;align-items:center;text-align:center}
.g.ck.flat{background:none;border-color:transparent;box-shadow:none}
.nm{font-size:12.5px;font-weight:600;opacity:.6;text-transform:uppercase;letter-spacing:.06em}
.tm{font-weight:300;font-variant-numeric:tabular-nums;line-height:1;letter-spacing:-.02em;white-space:nowrap;font-size:clamp(34px,var(--nova-clock-size,24cqw),160px)}
.tm .sc{font-size:.42em;opacity:.6;margin-left:.08em;font-weight:400}
.tm .ap{font-size:.3em;opacity:.65;margin-left:.15em;font-weight:500;letter-spacing:0}
.tm .cl{color:var(--kc)}
.dt{font-size:clamp(13px,6cqw,26px);opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.dt b{font-weight:600;opacity:1}
.ana{width:100%;max-width:var(--nova-clock-size,240px);aspect-ratio:1}
.ana svg{display:block;width:100%;height:100%}
.scene .hd,.scene .md{fill:url(#k-cr);stroke:rgba(0,0,0,.35);stroke-width:.5}
.scene .sd{fill:var(--kc);filter:drop-shadow(0 0 2px var(--kc))}
.scene .cap{fill:url(#k-cr);stroke:rgba(255,255,255,.25);stroke-width:.4}.scene .cap2{fill:var(--kc)}
.scene .hsh{fill:#000;opacity:.25}
[hidden]{display:none!important}
@container (min-width:420px){.g.ck.row{flex-direction:row;gap:20px;text-align:left}.row .ana{width:45%}.row .txt{display:flex;flex-direction:column;gap:6px;align-items:flex-start;flex:1}.row .tm{font-size:clamp(28px,var(--nova-clock-size,12cqw),100px)}.row .dt{font-size:clamp(12px,3.6cqw,22px)}}
.txt{display:flex;flex-direction:column;gap:6px;align-items:center;min-width:0;max-width:100%}`;

// Zeiger: Stunde, Minute (Chrom), Sekunde (Farbrolle) mit Gegengewicht; Schatten leicht versetzt
const hand = (cls, w, len, back) => `<path class="${cls}" d="M${C - w / 2} ${C + back} L${C - w / 2 + .4} ${C - len} Q${C} ${C - len - w / 2} ${C + w / 2 - .4} ${C - len} L${C + w / 2} ${C + back} Z"/>`;
const SVG = `<svg viewBox="0 0 200 200" aria-hidden="true" class="scene"><defs>${dialDefs('k', C, C, R)}</defs>${dialBody('k', C, C, R)}
<g class="hh"><g transform="translate(1.2 1.6)" class="hsh">${hand('', 6, 44, 10)}</g>${hand('hd', 6, 44, 10)}</g>
<g class="mh"><g transform="translate(1.2 1.6)" class="hsh">${hand('', 4.2, 64, 12)}</g>${hand('md', 4.2, 64, 12)}</g>
<g class="sh">${hand('sd', 1.6, 70, 18)}<circle class="sd" cx="${C}" cy="${C + 14}" r="3"/></g>
<circle class="cap" cx="${C}" cy="${C}" r="5"/><circle class="cap2" cx="${C}" cy="${C}" r="1.8"/>
${dialGlass('k', C, C, R)}</svg>`;

class NovaClockCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('clock-card-editor')); }
  static getStubConfig() { return {}; }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._c = {...DEF, ...c};
    this._fmtKey = null;
    if (this._e) { this._layout(); this._draw(); this._plan(); }
  }
  // Nur Sprache, Zeitformat und Zeitzone aus hass sind wichtig – Zustände nicht
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    if (!this._e) { this._build(); this._draw(); this._plan(); return; }
    if (!old || old.locale !== h.locale || old.config !== h.config || old.language !== h.language) { this._fmtKey = null; this._draw(); }
  }
  connectedCallback() {
    this._quiet = inPicker(this);
    if (!this._e && this._c && this._h) this._build();
    this._stopVis?.();
    this._stopVis = watchVisible(this, v => {
      const was = this._vis;
      this._vis = v && !this._quiet;
      if (this._vis && !was && this._c?.mode === 'analog' && this._c.animation !== false) sweep(this._e?.g);
      this._draw(); this._plan();
    });
  }
  disconnectedCallback() { this._stopVis?.(); this._stopVis = null; this._vis = false; clearTimeout(this._t); this._t = null; }
  getCardSize() { return this._c?.mode === 'analog' ? 4 : 2; }
  getGridOptions() { return {columns: 6, rows: 'auto', min_columns: 3}; }

  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${CCSS}</style><div class="g ck"><div class="ana">${SVG}</div>
<div class="txt"><div class="nm"></div><div class="tm"></div><div class="dt"></div></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), ana: q('.ana'), nm: q('.nm'), tm: q('.tm'), dt: q('.dt'), hh: q('.hh'), mh: q('.mh'), sh: q('.sh')};
    const act = () => ({tap_action: this._c.tap_action, hold_action: this._c.hold_action});
    press(this._e.g, {tap: () => runAction(this, act(), 'tap', true), hold: () => runAction(this, act(), 'hold')});
    this._layout();
  }
  _layout() {
    const c = this._c, e = this._e, rv = roleVars(c.color), an = c.mode === 'analog';
    e.g.style.setProperty('--kc', rv.c);
    e.ana.hidden = !an;
    e.tm.hidden = an && !c.analog_digital;
    e.g.classList.toggle('row', an && !!(c.show_date || c.show_weekday || c.analog_digital || c.name));
    e.g.classList.toggle('flat', c.glass === false);
    this.classList.toggle('nv-flat', c.glass === false);
    e.nm.hidden = !c.name;
    e.nm.textContent = c.name || '';
  }
  // Formatierer nur neu bauen, wenn sich Sprache/Zeitzone/Optionen ändern
  _fmts() {
    const h = this._h, c = this._c, lang = langOf(h), tz = tzOf(h), tf = c.time_format === 'auto' ? h?.locale?.time_format : c.time_format;
    const key = JSON.stringify([lang, tz, tf, c.date_format, c.show_seconds]);
    if (key === this._fmtKey) return this._f;
    this._fmtKey = key;
    const mk = o => { try { return new Intl.DateTimeFormat(lang, {...o, timeZone: tz}); } catch { return new Intl.DateTimeFormat(lang, o); } };
    const h12 = tf === '12' ? true : tf === '24' ? false : undefined;
    const time = mk({hour: '2-digit', minute: '2-digit', second: '2-digit', ...(h12 != null ? {hour12: h12} : {})});
    const DF = {long: {day: 'numeric', month: 'long'}, short: {day: 'numeric', month: 'short'}, numeric: {day: '2-digit', month: '2-digit', year: 'numeric'}};
    this._f = {time, wd: mk({weekday: 'long'}), date: mk(DF[c.date_format] || DF.long)};
    return this._f;
  }
  _draw() {
    const e = this._e, c = this._c;
    if (!e || !this._h) return;
    const f = this._fmts(), now = new Date();
    const p = Object.fromEntries(f.time.formatToParts(now).map(x => [x.type, x.value]));
    if (!e.tm.hidden) {
      const html = `${esc(p.hour)}<span class="cl">:</span>${esc(p.minute)}${c.show_seconds ? `<span class="sc">${esc(p.second)}</span>` : ''}${p.dayPeriod ? `<span class="ap">${esc(p.dayPeriod)}</span>` : ''}`;
      if (this._tmH !== html) { this._tmH = html; e.tm.innerHTML = html; }
    }
    const wd = c.show_weekday ? f.wd.format(now) : '', dt = c.show_date ? f.date.format(now) : '';
    const dh = [wd && `<b>${esc(wd)}</b>`, dt && esc(dt)].filter(Boolean).join(', ');
    e.dt.hidden = !dh;
    if (this._dtH !== dh) { this._dtH = dh; e.dt.innerHTML = dh; }
    if (!e.ana.hidden) {
      // Stunde/Minute/Sekunde in der gewählten Zeitzone (aus den formatierten Teilen; 12 und 24 h ergeben modulo 12 dasselbe)
      const h24 = +p.hour % 12, mm = +p.minute, ss = +p.second;
      e.hh.setAttribute('transform', `rotate(${((h24 + mm / 60) * 30).toFixed(2)} ${C} ${C})`);
      e.mh.setAttribute('transform', `rotate(${((mm + (c.show_seconds ? ss / 60 : 0)) * 6).toFixed(2)} ${C} ${C})`);
      e.sh.style.display = c.show_seconds ? '' : 'none';
      if (c.show_seconds) e.sh.setAttribute('transform', `rotate(${ss * 6} ${C} ${C})`);
    }
  }
  // Ein Zeitgeber: zum nächsten Sekunden- (mit Sekunden) bzw. Minutenwechsel; nur sichtbar und nicht in der Kartenauswahl
  _plan() {
    clearTimeout(this._t); this._t = null;
    if (!this._vis || !this._e) return;
    const step = this._c.show_seconds ? 1000 : 60000, now = Date.now();
    this._t = setTimeout(() => { this._t = null; this._draw(); this._plan(); }, step - (now % step) + 15);
  }
}
define('clock-card', NovaClockCard, {name: 'Nova Uhr Card', description: 'Uhrzeit digital oder analog im Nova-Stil, wahlweise mit Sekunden, Wochentag und Datum.', documentationURL: docUrl('nova-uhr-card')});

/* ---------- Editor ---------- */
const S_GEN = [
  sel('mode', [['digital', 'Digital'], ['analog', 'Analog (Zifferblatt)']]),
  {name: 'name', selector: T},
];
const S_SHOW = c => [
  g2({name: 'show_seconds', selector: {boolean: {}}}, ...(c.mode === 'analog' ? [{name: 'analog_digital', selector: {boolean: {}}}] : [])),
  g2({name: 'show_weekday', selector: {boolean: {}}}, {name: 'show_date', selector: {boolean: {}}}),
  g2(sel('date_format', [['long', '2. November'], ['short', '2. Nov.'], ['numeric', '02.11.2026']]), sel('time_format', [['auto', 'Wie im Profil'], ['24', '24 Stunden'], ['12', '12 Stunden (AM/PM)']])),
];
const S_LOOK = [g2(ROLE('color'), {name: 'glass', selector: {boolean: {}}})];
const S_ACT = [{name: 'tap_action', selector: A}, {name: 'hold_action', selector: A}];
const LABELS = {
  mode: 'Art der Uhr', name: 'Überschrift (optional)', show_seconds: 'Sekunden', analog_digital: 'Zusätzlich digitale Zeit', show_weekday: 'Wochentag',
  show_date: 'Datum', date_format: 'Datumsformat', time_format: 'Zeitformat', color: 'Akzentfarbe', glass: 'Glas-Hintergrund',
  tap_action: 'Aktion beim Antippen', hold_action: 'Aktion bei langem Drücken',
};
const HELPERS = {
  show_seconds: 'Sekunden kosten etwas mehr Akku/Leistung – auf alten Tablets lieber aus.',
  color: 'Doppelpunkt bzw. Sekundenzeiger. Die Farben selbst kommen aus dem Theme.',
  glass: 'Aus = Uhr ohne Kartenhintergrund, z. B. direkt auf dem Dashboard-Bild.',
};

class NovaClockCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static helpers = HELPERS;
  static openSections = ['general', 'show'];
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    const data = () => ({...DEF, ...this._config});
    const form = s => this._form(s, data(), v => {
      const was = this._config.mode, c = merge(this._config, names(s), v);
      Object.keys(DEF).forEach(k => { if (c[k] === DEF[k]) delete c[k]; });
      this._emit(c);
      if ((c.mode || DEF.mode) !== (was || DEF.mode)) this._rebuild();
    });
    r.querySelector('.wrap').append(
      this._section('general', 'mdi:clock-outline', 'Uhr', b => b.append(form(S_GEN))),
      this._section('show', 'mdi:calendar-today', 'Anzeige', b => b.append(form(S_SHOW(data())))),
      this._section('look', 'mdi:palette-outline', 'Aussehen', b => b.append(form(S_LOOK))),
      this._section('actions', 'mdi:gesture-tap', 'Aktionen', b => b.append(form(S_ACT))));
  }
}
define('clock-card-editor', NovaClockCardEditor);
