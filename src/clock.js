import {define, docUrl, tag, DEV} from './shared/define.js';
import {esc, setIcon} from './shared/utils.js';
import {langOf, tzOf, iconOf, valueOf} from './shared/state.js';
import {runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, SECTION_EDITOR_CSS, roleVars} from './shared/styles.js';
import {inPicker, watchVisible, hassChanged} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, A, sel, ROLE} from './shared/editor-schema.js';
import {sweep} from './shared/scene.js';
import {dialDefs, dialBody, dialGlass, DIAL_CSS} from './shared/dial.js';
import {flipDigit, flipSet, FLIP_CSS, glowColor, sunGuess, GLOW_CSS, retroSvg, retroSet, RETRO_COLORS, RETRO_CSS, K} from './clock-styles.js';
// Wochentag und Datum: zusätzlich mal date_size (--kd), damit sie sich unabhängig von der Uhrzeit einstellen lassen
const KD = v => K(`${v}*var(--kd,1)`);

/* ---------- Nova Uhr Card ----------
   Uhrzeit in fünf Stilen (Standard, Klappzahlen, Analog, Leuchtziffern, Radiowecker), optional mit Sekunden, Wochentag, Datum und einer dezenten Werte-Zeile (z. B. Temperatur, Feuchte). Sprache, 12/24 h und Zeitzone wie im HA-Profil.
   Ein einziger Zeitgeber, der genau zum nächsten Sekunden- bzw. Minutenwechsel feuert – und nur, solange die Karte zu sehen ist. */
const DEF = {style: 'default', second_hand: 'sweep', retro_color: 'red', sun_entity: 'sun.sun', mode: 'digital', show_seconds: false, show_weekday: true, show_date: true, date_format: 'long', time_format: 'auto', color: 'accent-1', glass: true, size: 'medium', date_size: 'medium', layout: 'auto'};
const SIZES = {small: .75, medium: 1, large: 1.3};
// Freie Schriftgröße: Zahl = px, sonst Text mit px, rem oder em
const fontSize = v => typeof v === 'number' && v > 0 ? `${v}px` : typeof v === 'string' && /^\s*\d+(\.\d+)?\s*(px|rem|em)?\s*$/.test(v) ? (/[a-z]/.test(v) ? v.trim().replace(/\s+/g, '') : `${v.trim()}px`) : null;
const C = 100, R = 92;
const STYLES = ['default', 'flip', 'analog', 'glow', 'retro'];
// Wirksamer Stil: style hat Vorrang; ältere Konfigurationen mit mode: analog bleiben analog
const styleOf = c => STYLES.includes(c.style) && c.style !== 'default' ? c.style : c.mode === 'analog' ? 'analog' : 'default';
// Sekundenzeiger: beim Stil „analog“ aus second_hand, bei mode: analog wie bisher über show_seconds
const handOf = c => c.style === 'analog' ? (['sweep', 'tick', 'none'].includes(c.second_hand) ? c.second_hand : 'sweep') : c.show_seconds ? 'tick' : 'none';
const reduced = () => window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;

const CCSS = `${DIAL_CSS}${FLIP_CSS}${GLOW_CSS}${RETRO_CSS}
:host{container-type:inline-size}
.g.ck{--dc:var(--kc);padding:var(--nv-pad);gap:var(--nv-s3);justify-content:center;align-items:center;text-align:center}
.g.ck.flat{background:none;border-color:transparent;box-shadow:none}
.nm{font-size:${K('12.5px')};font-weight:var(--nv-fw-bold);opacity:.6;text-transform:uppercase;letter-spacing:.06em}
.tm{font-weight:var(--nv-fw-light);font-variant-numeric:tabular-nums;line-height:1.05;letter-spacing:-.04em;white-space:nowrap;font-size:${K('clamp(34px,var(--nova-clock-size,24cqw),160px)')}}
.tm .sc{font-size:.42em;opacity:.6;margin-left:.08em;font-weight:400}
.tm .ap{font-size:.3em;opacity:.65;margin-left:.15em;font-weight:var(--nv-fw-medium);letter-spacing:0}
.dt{font-size:${KD('clamp(13px,5cqw,22px)')};opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.ana{width:100%;max-width:${K('var(--nova-clock-size,240px)')};aspect-ratio:1}
.ana svg{display:block;width:100%;height:100%}
.scene .hd,.scene .md{fill:url(#k-cr);stroke:rgba(var(--nv-lo),.35);stroke-width:.5}
.scene{--dc:var(--kg);--kc:var(--kg)}
.scene .sd{fill:var(--kc);filter:drop-shadow(0 0 2px var(--kc))}
.scene .cap{fill:url(#k-cr);stroke:rgba(var(--nv-hi),.25);stroke-width:.4}.scene .cap2{fill:var(--kc)}
.scene .hsh{fill:rgb(var(--nv-lo));opacity:.25}
.scene .sw{transform-box:view-box;transform-origin:100px 100px}.anim .scene .sw.on{animation:k-spin 60s linear infinite}
@keyframes k-spin{to{transform:rotate(360deg)}}
[hidden]{display:none!important}
@container (min-width:420px){.g.ck.row{flex-direction:row;gap:20px;text-align:left}.row .ana{width:45%}
.txt{display:flex;flex-direction:column;gap:var(--nv-s3);align-items:flex-start;flex:1}.row .tm{font-size:${K('clamp(28px,var(--nova-clock-size,12cqw),100px)')}}.row .dt{font-size:${KD('clamp(12px,3.6cqw,22px)')}}.row .inf{font-size:${K('clamp(14px,var(--nova-clock-info-size,4.4cqw),26px)')}}}
.inf{display:flex;flex-wrap:wrap;justify-content:center;gap:var(--nv-s2) var(--nv-s8);font-size:${K('clamp(14px,var(--nova-clock-info-size,7.5cqw),26px)')};opacity:.85;font-variant-numeric:tabular-nums;white-space:nowrap}
.inf span{display:inline-flex;align-items:center;gap:var(--nv-s2)}.inf i{display:inline-flex;opacity:.8}.inf ha-icon{--mdc-icon-size:1.1em}.inf img{width:1.1em;height:1.1em}.inf b{font-weight:400}
.row .inf{justify-content:flex-start}
.txt{display:flex;flex-direction:column;gap:var(--nv-s3);align-items:center;justify-content:center;min-width:0;max-width:100%}
.sub{display:contents}
.probe>*{position:absolute!important;visibility:hidden}
/* Feste Kartenhöhe (--kfix): Zifferblatt nie höher als die Karte */
.ana{max-height:var(--kfix,none)}
/* Breit und flach (layout: row bzw. automatisch, wenn untereinander nicht passt): Uhrzeit links, Überschrift, Datum und Werte rechts.
   Die Größen folgen der Kartenhöhe (--kh, von _fit() gesetzt). */
.g.ck.wide .txt{display:grid;grid-template-columns:auto auto;column-gap:calc(var(--kh,100px)*.22);row-gap:0;align-items:center;justify-content:center;text-align:left}
.wide .tm,.wide .flp,.wide .rt{grid-area:1/1/3/2}
.wide .nm{grid-area:1/2;align-self:end;font-size:${K('var(--kh,100px)*.12')}}
.wide .sub{grid-area:2/2;display:flex;flex-direction:column;align-items:flex-start;gap:.15em;align-self:start;min-width:0}
.wide.nn .sub{grid-area:1/2/3/3;align-self:center}
.wide .tm{font-size:${K('var(--kh,100px)*.82')}}.wide .tm.glow{font-size:${K('var(--kh,100px)*.82')}}
.wide .flp{font-size:${K('var(--kh,100px)*.74')}}
.wide .rt{width:auto;max-width:none}.wide .rt svg{width:auto;height:${K('var(--kh,100px)*.88')}}
.wide .dt{font-size:${KD('var(--kh,100px)*.24')}}.wide .inf{font-size:${K('var(--kh,100px)*.26')};justify-content:flex-start}
/* Feste Schriftgröße (font_size → --kf): Datum und Werte wachsen mit */
.fs .tm,.fs .tm.glow{font-size:calc(var(--kf)*var(--ks,1))}.fs .flp{font-size:calc(var(--kf)*.8*var(--ks,1))}
.fs .rt{max-width:none;width:calc(var(--kf)*3.25*var(--ks,1))}.fs.wide .rt svg{width:100%;height:auto}
.fs .ana{max-width:calc(var(--kf)*1.5*var(--ks,1))}
.fs .dt{font-size:calc(var(--kf)*.3*var(--kd,1)*var(--ks,1))}.fs .inf{font-size:calc(var(--kf)*.34*var(--ks,1))}.fs .nm{font-size:calc(var(--kf)*.16*var(--ks,1))}
/* Feste Schriftgröße für Wochentag und Datum (date_size als px/rem → --kdf), schrumpft beim Einpassen mit */
.g.dfs .dt{font-size:calc(var(--kdf)*var(--ks,1))}`;

// Zeiger: Stunde, Minute (Chrom), Sekunde (Farbrolle) mit Gegengewicht; Schatten leicht versetzt
const hand = (cls, w, len, back) => `<path class="${cls}" d="M${C - w / 2} ${C + back} L${C - w / 2 + .4} ${C - len} Q${C} ${C - len - w / 2} ${C + w / 2 - .4} ${C - len} L${C + w / 2} ${C + back} Z"/>`;
const SVG = `<svg viewBox="0 0 200 200" aria-hidden="true" class="scene"><defs>${dialDefs('k', C, C, R)}</defs>${dialBody('k', C, C, R)}
<g class="hh"><g transform="translate(1.2 1.6)" class="hsh">${hand('', 6, 44, 10)}</g>${hand('hd', 6, 44, 10)}</g>
<g class="mh"><g transform="translate(1.2 1.6)" class="hsh">${hand('', 4.2, 64, 12)}</g>${hand('md', 4.2, 64, 12)}</g>
<g class="sh"><g class="sw">${hand('sd', 1.6, 70, 18)}<circle class="sd" cx="${C}" cy="${C + 14}" r="3"/></g></g>
<circle class="cap" cx="${C}" cy="${C}" r="5"/><circle class="cap2" cx="${C}" cy="${C}" r="1.8"/>
${dialGlass('k', C, C, R)}</svg>`;

class NovaClockCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('clock-card-editor')); }
  static getStubConfig() { return {}; }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._c = {...DEF, ...c};
    // Werte-Zeile: Liste aus Entitäten (Text oder {entity, name, icon})
    this._ents = (Array.isArray(c.entities) ? c.entities : []).map(x => typeof x === 'string' ? {entity: x} : {...x}).filter(x => x.entity);
    this._ids = this._ents.map(x => x.entity);
    this._st = styleOf(this._c);
    this._sun = this._st === 'glow' ? this._c.sun_entity || DEF.sun_entity : null;
    this._fmtKey = null;
    if (this._e) { this._layout(); this._sync(); this._draw(); this._vals(); this._plan(); }
  }
  // Nur Sprache, Zeitformat und Zeitzone aus hass sind wichtig – Zustände nicht
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    if (!this._e) { this._build(); this._draw(); this._vals(); this._plan(); return; }
    if (!old || old.locale !== h.locale || old.config !== h.config || old.language !== h.language) { this._fmtKey = null; this._draw(); }
    if (this._ents.length && hassChanged(old, h, this._ids)) this._vals();
    if (this._sun && old?.states[this._sun] !== h.states[this._sun]) this._glow();
  }
  connectedCallback() {
    this._quiet = inPicker(this);
    if (!this._e && this._c && this._h) this._build();
    this._observe();
    this._stopVis?.();
    this._stopVis = watchVisible(this, v => {
      const was = this._vis;
      this._vis = v && !this._quiet;
      if (this._vis && !was && ['analog', 'retro'].includes(this._st) && this._c.animation !== false) sweep(this._e?.g);
      this._e?.g.classList.toggle('anim', !!this._vis);
      this._sync(); this._draw(); this._plan();
    });
  }
  disconnectedCallback() {
    this._stopVis?.(); this._stopVis = null; this._vis = false; clearTimeout(this._t); this._t = null;
    this._ro?.disconnect(); this._ro = null; cancelAnimationFrame(this._fr); this._fr = null;
  }
  getCardSize() { return this._st === 'analog' ? 4 : this._st === 'retro' || this._st === 'flip' ? 3 : 2; }
  getGridOptions() { return {columns: 6, rows: 'auto', min_columns: 3}; }

  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${CCSS}</style><div class="g ck"><div class="ana">${SVG}</div>
<div class="txt"><div class="nm"></div><div class="tm"></div><div class="flp"></div><div class="rt"></div><div class="sub"><div class="dt"></div><div class="inf"></div></div></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), ana: q('.ana'), nm: q('.nm'), tm: q('.tm'), dt: q('.dt'), inf: q('.inf'), flp: q('.flp'), rt: q('.rt'), sw: q('.sw'), hh: q('.hh'), mh: q('.mh'), sh: q('.sh')};
    const act = () => ({tap_action: this._c.tap_action, hold_action: this._c.hold_action});
    press(this._e.g, {tap: () => runAction(this, act(), 'tap', true), hold: () => runAction(this, act(), 'hold')});
    this._layout();
    this._observe();
  }
  _layout() {
    const c = this._c, e = this._e, rv = roleVars(c.color), st = this._st, an = st === 'analog';
    e.g.style.setProperty('--kc', rv.c);
    e.g.style.setProperty('--kg', rv.dev);
    e.g.classList.toggle('still', !!this._quiet);
    e.ana.hidden = !an;
    e.tm.hidden = (an && !c.analog_digital) || st === 'flip' || st === 'retro';
    e.tm.classList.toggle('glow', st === 'glow');
    this._tmH = null;
    // Klappzahlen: zwei Gruppen (+ Sekunden), Trenner als zwei Punkte
    e.flp.hidden = st !== 'flip';
    e.flp.innerHTML = st === 'flip' ? `<div class="grp">${flipDigit()}${flipDigit()}</div><div class="sep"><i></i><i></i></div><div class="grp">${flipDigit()}${flipDigit()}</div><div class="ap"></div>` : '';
    // Radiowecker: SVG nur neu bauen, wenn er gebraucht wird
    e.rt.hidden = st !== 'retro';
    e.rt.className = `rt ${RETRO_COLORS.includes(c.retro_color) ? c.retro_color : 'red'}`;
    e.rt.innerHTML = st === 'retro' ? retroSvg(!!c.show_seconds) : '';
    e.sh.style.display = an && handOf(c) !== 'none' ? '' : 'none';
    this._glow();
    e.g.classList.toggle('flat', c.glass === false);
    this.classList.toggle('nv-flat', c.glass === false);
    e.nm.hidden = !c.name;
    e.nm.textContent = c.name || '';
    e.inf.hidden = !this._ents.length;
    e.inf.replaceChildren(...this._ents.map(() => { const sp = document.createElement('span'); sp.innerHTML = '<i></i><b></b>'; return sp; }));
    e.g.classList.toggle('row', an && !!(c.show_date || c.show_weekday || c.analog_digital || c.name || this._ents.length));
    // Größe: size als Faktor, font_size als feste Schriftgröße der Uhrzeit (Datum und Werte wachsen mit)
    e.g.style.setProperty('--kz', SIZES[c.size] || 1);
    const fs = fontSize(c.font_size);
    e.g.classList.toggle('fs', !!fs);
    if (fs) e.g.style.setProperty('--kf', fs); else e.g.style.removeProperty('--kf');
    // Wochentag und Datum: date_size als Stufe (Faktor --kd) oder fester Wert (--kdf)
    const ds = SIZES[c.date_size] ? null : fontSize(c.date_size);
    e.g.style.setProperty('--kd', SIZES[c.date_size] || 1);
    e.g.classList.toggle('dfs', !!ds);
    if (ds) e.g.style.setProperty('--kdf', ds); else e.g.style.removeProperty('--kdf');
    e.g.classList.toggle('nn', !c.name);
    this._sync();
    this._fitSoon();
  }
  // Kartengröße beobachten: bei jeder Änderung die Uhr neu einpassen
  _observe() {
    if (this._ro || !this._e || !window.ResizeObserver) return;
    this._ro = new ResizeObserver(() => this._fitSoon());
    this._ro.observe(this);
  }
  _fitSoon() {
    if (!this._e || this._fr) return;
    this._fr = requestAnimationFrame(() => { this._fr = null; this._fit(); });
  }
  // Einpassen: nichts darf über die Karte laufen. Passt der Inhalt untereinander nicht in eine breite, flache Karte,
  // stehen Uhrzeit und Datum nebeneinander (layout: auto). Danach wird alles gemeinsam (--ks) verkleinert, bis es passt.
  // Karten mit automatischer Höhe passen immer – dort bleibt alles wie gehabt.
  _fit() {
    const e = this._e, c = this._c;
    if (!e || !this.isConnected) return;
    const g = e.g, cs = getComputedStyle(g), can = this._st !== 'analog', lay = c.layout;
    // Verfügbare Höhe ohne Inhalt messen: bleibt die Karte ohne Inhalt hoch, gibt das Raster die Höhe vor.
    // Fällt sie zusammen, wächst die Karte mit dem Inhalt (automatische Höhe) – dann gibt es nichts einzupassen.
    g.classList.add('probe');
    const H = g.clientHeight - parseFloat(cs.paddingTop) - parseFloat(cs.paddingBottom);
    const W = g.clientWidth - parseFloat(cs.paddingLeft) - parseFloat(cs.paddingRight);
    g.classList.remove('probe');
    g.style.setProperty('--ks', 1);
    g.classList.toggle('wide', can && lay === 'row');
    if (!(W > 0)) return;
    g.style.removeProperty('--kfix');
    if (!(H > 24)) { g.style.setProperty('--kh', `${Math.round(Math.min(160, W / 6))}px`); return; }
    g.style.setProperty('--kh', `${Math.round(H)}px`);
    g.style.setProperty('--kfix', `${Math.round(H)}px`);
    // Platzbedarf: Umriss aller sichtbaren Teile (der Inhalt ist zentriert und kann nach oben und unten herausragen)
    const need = () => {
      let t = Infinity, b = -Infinity, w = 0, rw = 1;
      for (const k of g.children) {
        if (k.hidden) continue;
        const r = k.getBoundingClientRect();
        if (!r.height) continue;
        t = Math.min(t, r.top); b = Math.max(b, r.bottom); w = Math.max(w, k.scrollWidth, r.width);
      }
      const tx = e.tm.parentElement;
      // auch Datum und Werte in .sub: abgeschnittener Text (scrollWidth > Breite) zählt als zu breit
      for (const k of [...tx.children, ...e.dt.parentElement.children]) {
        if (k.hidden) continue;
        w = Math.max(w, k.scrollWidth);
        // abgeschnittener Text (z. B. Datum mit „…“): Verhältnis sichtbar/benötigt
        if (k.clientWidth && k.scrollWidth > k.clientWidth + 1) rw = Math.min(rw, k.clientWidth / k.scrollWidth);
      }
      return [w, b > t ? b - t : 0, rw];
    };
    let [w, h, rw] = need();
    if (can && lay !== 'row' && lay !== 'stacked' && h > H + 1 && W / H >= 2.2 && !(e.dt.hidden && e.inf.hidden && e.nm.hidden)) {
      g.classList.add('wide');
      [w, h, rw] = need();
    }
    let s = 1;
    for (let i = 0; i < 4 && h; i++) {
      const r = Math.min(H / h, W / (w || W), rw);
      if (r >= .995) break;
      s = Math.max(.15, s * r * .98);
      g.style.setProperty('--ks', +s.toFixed(3));
      [w, h, rw] = need();
    }
  }
  // Leuchtziffern: Farbe aus dem Sonnenstand (sun.sun → elevation, rising); ohne Sonne grob aus der Uhrzeit
  _glow() {
    const e = this._e;
    if (!e || this._st !== 'glow') { e?.tm.style.removeProperty('--gc'); return; }
    const s = this._h?.states[this._sun], a = s?.attributes;
    const g = a && a.elevation != null ? {elev: +a.elevation, rising: !!a.rising} : sunGuess(this._hour());
    const col = glowColor(g.elev, g.rising) || roleVars(this._c.color).c;
    if (col !== this._gc) { this._gc = col; e.tm.style.setProperty('--gc', col); }
  }
  // Nur Dev-Build: Bildrate der ersten drei echten Klapp-Animationen messen und ins HA-Log schreiben (Test auf echten Geräten)
  _measure() {
    if ((this._ms = (this._ms || 0) + 1) > 3 || !this._h?.callService) return;
    const t = [];
    const step = ts => { t.push(ts); if (ts - t[0] < 650) requestAnimationFrame(step); else done(); };
    const done = () => {
      const gaps = t.slice(1).map((x, i) => x - t[i]), fps = Math.round((t.length - 1) / ((t[t.length - 1] - t[0]) / 1000));
      const msg = `Nova Dev Uhr (flip, echte Klappe): ${fps} Bilder/s, längste Pause ${Math.round(Math.max(...gaps))} ms, Fenster ${innerWidth}×${innerHeight}`;
      this._h.callService('system_log', 'write', {message: msg, level: 'warning', logger: 'nova_cards.dev'})?.catch?.(() => {});
    };
    requestAnimationFrame(step);
  }
  // Stunde (mit Bruchteil) in der Zeitzone von HA – für die geschätzte Sonne ohne sun.sun
  _hour() {
    try {
      const p = Object.fromEntries(new Intl.DateTimeFormat('en-GB', {hour: 'numeric', minute: 'numeric', hourCycle: 'h23', timeZone: this._h?.config?.time_zone}).formatToParts(new Date()).map(x => [x.type, x.value]));
      return +p.hour + p.minute / 60;
    } catch { const d = new Date(); return d.getHours() + d.getMinutes() / 60; }
  }
  // Laufende Animationen (Sekundenzeiger „sweep“, blinkender Doppelpunkt) auf die echte Sekunde setzen
  _sync() {
    const e = this._e;
    if (!e) return;
    const now = new Date(), off = `-${now.getSeconds() + now.getMilliseconds() / 1000}s`;
    const sw = this._st === 'analog' && handOf(this._c) === 'sweep' && !this._quiet && !reduced();
    e.sw.classList.toggle('on', sw);
    if (sw) e.sw.style.animationDelay = off;
    const col = e.rt.querySelector('.rt-on .rt-col');
    if (col) col.style.animationDelay = `-${now.getMilliseconds() / 1000}s`;
  }
  // Werte-Zeile: nur neu schreiben, wenn sich eine der Entitäten ändert
  _vals() {
    const e = this._e, h = this._h;
    if (!e || !h || !this._ents.length) return;
    this._ents.forEach((o, i) => {
      const sp = e.inf.children[i], s = h.states[o.entity];
      if (!sp) return;
      setIcon(sp.firstChild, iconOf(h, o, 'mdi:information-outline'));
      sp.lastChild.textContent = valueOf(h, s, o);
      sp.title = o.name ?? s?.attributes.friendly_name ?? o.entity;
    });
    const n = e.inf.textContent.length;
    if (n !== this._infN) { this._infN = n; this._fitSoon(); }
  }
  // Formatierer nur neu bauen, wenn sich Sprache/Zeitzone/Optionen ändern
  _fmts() {
    const h = this._h, c = this._c, lang = langOf(h), tz = h?.config?.time_zone || tzOf(h), tf = c.time_format === 'auto' ? h?.locale?.time_format : c.time_format;
    const key = JSON.stringify([lang, tz, tf, c.date_format, c.show_seconds]);
    if (key === this._fmtKey) return this._f;
    this._fmtKey = key;
    const mk = o => { try { return new Intl.DateTimeFormat(lang, {...o, timeZone: tz}); } catch { return new Intl.DateTimeFormat(lang, o); } };
    const h12 = tf === '12' ? true : tf === '24' ? false : undefined;
    const time = mk({hour: '2-digit', minute: '2-digit', second: '2-digit', ...(h12 != null ? {hour12: h12} : {})});
    const DF = {long: {day: 'numeric', month: 'long'}, long_year: {day: 'numeric', month: 'long', year: 'numeric'}, short: {day: 'numeric', month: 'short'}, numeric: {day: '2-digit', month: '2-digit', year: 'numeric'}};
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
      if (this._tmH !== html) { if (this._tmH?.length !== html.length) this._fitSoon(); this._tmH = html; e.tm.innerHTML = html; }
    }
    const wd = c.show_weekday ? f.wd.format(now) : '', dt = c.show_date ? f.date.format(now) : '';
    const dh = [wd && esc(wd), dt && esc(dt)].filter(Boolean).join(', ');
    e.dt.hidden = !dh;
    if (this._dtH !== dh) { this._dtH = dh; e.dt.innerHTML = dh; this._fitSoon(); }
    if (!e.ana.hidden) {
      // Stunde/Minute/Sekunde in der gewählten Zeitzone (aus den formatierten Teilen; 12 und 24 h ergeben modulo 12 dasselbe)
      const h24 = +p.hour % 12, mm = +p.minute, ss = +p.second;
      e.hh.setAttribute('transform', `rotate(${((h24 + mm / 60) * 30).toFixed(2)} ${C} ${C})`);
      const hd = handOf(c), tick = hd === 'tick' || (hd === 'sweep' && !e.sw.classList.contains('on'));
      e.mh.setAttribute('transform', `rotate(${((mm + (hd !== 'none' ? ss / 60 : 0)) * 6).toFixed(2)} ${C} ${C})`);
      if (tick) e.sh.setAttribute('transform', `rotate(${ss * 6} ${C} ${C})`); else e.sh.removeAttribute('transform');
    }
    const st = this._st, ap = p.dayPeriod || '';
    // 12 h: führende Null der Stunde weglassen (wie bei echten Klapp- und Radioweckern)
    const hr = ap && p.hour.length === 2 && p.hour[0] === '0' ? ' ' + p.hour[1] : p.hour.padStart(2, ' ');
    if (st === 'flip') {
      const ch = [...hr, ...p.minute], anim = !!this._vis && !this._quiet;
      let flipped = false;
      e.flp.querySelectorAll('.fd').forEach((d, i) => { if (flipSet(d, ch[i] ?? '', anim)) flipped = true; });
      if (DEV && flipped) this._measure();
      e.flp.querySelector('.ap').textContent = ap;
    } else if (st === 'retro') {
      const svg = e.rt.firstElementChild;
      if (svg) retroSet(svg, [...hr, ...p.minute, ...(c.show_seconds ? p.second : '')], /pm|nachm/i.test(ap), !!ap);
    }
    if (st === 'glow' && !(this._sun && this._h.states[this._sun])) this._glow();
  }
  // Ein Zeitgeber: zum nächsten Sekunden- (mit Sekunden) bzw. Minutenwechsel; nur sichtbar und nicht in der Kartenauswahl
  _plan() {
    clearTimeout(this._t); this._t = null;
    if (!this._vis || !this._e) return;
    const c = this._c, an = this._st === 'analog', step = (an ? handOf(c) === 'tick' || (handOf(c) === 'sweep' && !this._e.sw.classList.contains('on')) : c.show_seconds && this._st !== 'flip') ? 1000 : 60000, now = Date.now();
    this._t = setTimeout(() => { this._t = null; this._draw(); this._plan(); }, step - (now % step) + 15);
  }
}
define('clock-card', NovaClockCard, {name: 'Nova Uhr Card', description: 'Uhrzeit im Nova-Stil: digital, Klappzahlen, analog, Leuchtziffern oder Radiowecker, wahlweise mit Sekunden, Wochentag und Datum.', documentationURL: docUrl('nova-uhr-card')});

/* ---------- Editor ---------- */
const S_GEN = [
  sel('style', [['default', 'Standard (digital)'], ['flip', 'Klappzahlen'], ['analog', 'Analog (Zifferblatt)'], ['glow', 'Leuchtziffern (Farbe nach Sonnenstand)'], ['retro', 'Radiowecker (Sieben-Segment)']]),
  {name: 'name', selector: T},
];
// Stil-abhängige Felder: Sekundenzeiger (analog), Sonne (glow), LED-Farbe (retro)
const S_STYLE = st => st === 'analog' ? [g2(sel('second_hand', [['sweep', 'Gleitend'], ['tick', 'Springend'], ['none', 'Keiner']]), {name: 'analog_digital', selector: {boolean: {}}})]
  : st === 'glow' ? [{name: 'sun_entity', selector: {entity: {domain: 'sun'}}}]
  : st === 'retro' ? [sel('retro_color', [['red', 'Rot'], ['green', 'Grün'], ['blue', 'Blau'], ['amber', 'Bernstein']])] : [];
const S_SHOW = c => [
  ...(['analog', 'flip'].includes(styleOf(c)) ? [] : [{name: 'show_seconds', selector: {boolean: {}}}]),
  g2({name: 'show_weekday', selector: {boolean: {}}}, {name: 'show_date', selector: {boolean: {}}}),
  {name: 'entities', selector: {entity: {multiple: true, domain: ['sensor', 'binary_sensor', 'input_number', 'number', 'input_text', 'input_select']}}},
  sel('time_format', [['auto', 'Wie im Profil'], ['24', '24 Stunden'], ['12', '12 Stunden (AM/PM)']]),
];
const S_LOOK = [
  g2(sel('size', [['small', 'Klein'], ['medium', 'Mittel'], ['large', 'Groß']]), {name: 'font_size', selector: T}),
  g2(sel('date_format', [['long', '2. November'], ['long_year', '2. November 2026'], ['short', '2. Nov.'], ['numeric', '02.11.2026']]),
  {name: 'date_size', selector: {select: {mode: 'dropdown', custom_value: true, options: [{value: 'small', label: 'Klein'}, {value: 'medium', label: 'Mittel'}, {value: 'large', label: 'Groß'}]}}}),
  sel('layout', [['auto', 'Automatisch'], ['stacked', 'Untereinander'], ['row', 'Nebeneinander']]),
  g2(ROLE('color'), {name: 'glass', selector: {boolean: {}}}),
];
const S_ACT = [{name: 'tap_action', selector: A}, {name: 'hold_action', selector: A}];
const LABELS = {
  style: 'Stil', second_hand: 'Sekundenzeiger', sun_entity: 'Sonne', retro_color: 'Farbe der Ziffern', name: 'Überschrift (optional)', show_seconds: 'Sekunden', analog_digital: 'Zusätzlich digitale Zeit', show_weekday: 'Wochentag',
  show_date: 'Datum', date_format: 'Datumsformat', time_format: 'Zeitformat', color: 'Akzentfarbe', glass: 'Glas-Hintergrund', size: 'Größe', font_size: 'Schriftgröße (optional)', date_size: 'Größe von Wochentag und Datum', layout: 'Anordnung',
  tap_action: 'Aktion beim Antippen', hold_action: 'Aktion bei langem Drücken', entities: 'Werte unter der Uhr',
};
const HELPERS = {
  style: 'Klappzahlen klappen bei jedem Wechsel um, Leuchtziffern färben sich nach dem Sonnenstand, der Radiowecker zeigt LED-Ziffern.',
  second_hand: 'Gleitend läuft ohne Zeitgeber per Animation, springend tickt jede Sekunde.',
  sun_entity: 'Standard sun.sun. Ohne Sonne wird der Sonnenstand aus der Uhrzeit geschätzt.',
  show_seconds: 'Sekunden kosten etwas mehr Akku/Leistung – auf alten Tablets lieber aus.',
  color: 'Sekundenzeiger der analogen Uhr. Die Farben selbst kommen aus dem Theme.',
  glass: 'Aus = Uhr ohne Kartenhintergrund, z. B. direkt auf dem Dashboard-Bild.',
  entities: 'Optional: z. B. Temperatur und Luftfeuchte – erscheinen in einer Zeile unter der Uhrzeit.',
  size: 'Datum, Wochentag und Werte wachsen mit. Ist die Karte zu klein, wird die Uhr automatisch kleiner – sie läuft nie über.',
  font_size: 'Feste Größe der Uhrzeit, z. B. 48px oder 3rem. Hat Vorrang vor der Größe.',
  date_size: 'Klein, Mittel, Groß oder ein eigener Wert wie 18px oder 1.2rem – unabhängig von der Uhrzeit. Bei fester Kartenhöhe wird trotzdem alles so eingepasst, dass nichts übersteht.',
  layout: 'Automatisch: in breiten, flachen Karten steht das Datum neben der Uhrzeit, wenn es untereinander nicht passt.',
};

class NovaClockCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static helpers = HELPERS;
  static openSections = ['general', 'show'];
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    // Ältere Konfigurationen mit mode: analog erscheinen als Stil „Analog“
    const data = () => ({...DEF, ...this._config, style: styleOf(this._config)});
    const form = s => this._form(s, data(), v => {
      const was = styleOf(this._config);
      let c = merge(this._config, names(s), v);
      if (c.style && c.style !== was && c.mode) {
        // Umstieg von mode auf style: bisherigen Sekundenzeiger übernehmen
        if (c.style === 'analog' && c.mode === 'analog' && c.second_hand == null) c.second_hand = c.show_seconds ? 'tick' : 'none';
        delete c.mode;
      }
      Object.keys(DEF).forEach(k => { if (c[k] === DEF[k]) delete c[k]; });
      this._emit(c);
      if (styleOf(c) !== was) this._rebuild();
    });
    const st = styleOf(this._config);
    r.querySelector('.wrap').append(
      this._section('general', 'mdi:clock-outline', 'Uhr', b => { b.append(form(S_GEN)); if (S_STYLE(st).length) b.append(form(S_STYLE(st))); }),
      this._section('show', 'mdi:calendar-today', 'Anzeige', b => b.append(form(S_SHOW(data())))),
      this._section('look', 'mdi:palette-outline', 'Aussehen', b => b.append(form(S_LOOK))),
      this._section('actions', 'mdi:gesture-tap', 'Aktionen', b => b.append(form(S_ACT))));
  }
}
define('clock-card-editor', NovaClockCardEditor);
