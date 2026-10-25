import {define, docUrl, tag} from './shared/define.js';
import {esc, setIcon, ymdIn} from './shared/utils.js';
import {runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {fmtState, unitJoin, nameOf, hasF, langOf, tzOf} from './shared/state.js';
import {sparkline} from './shared/sparkline.js';
import {NOVA_VARS, PANEL_CSS, EDITOR_CSS, EDITOR_ICON_CSS, roleVars} from './shared/styles.js';
import {hassChanged, entityIds, inPicker} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, A, sel, BASE_LABELS} from './shared/editor-schema.js';

/* ---------- Nova Wetter Card ---------- */
const WCSS = `
.g.wt{gap:14px}
.clk{text-align:center;padding:2px 0 12px;border-bottom:1px solid rgba(255,255,255,.1)}
.clk .dt{font-size:14px;opacity:.75;margin-top:2px}
.clk .tm{font-size:64px;font-weight:300;letter-spacing:-.04em;line-height:1.05;font-variant-numeric:tabular-nums}
.cur{display:flex;align-items:center;gap:14px;min-width:0;border-radius:18px}
.cur .ic{width:64px;height:64px;background:var(--c);color:var(--cf);box-shadow:0 0 22px color-mix(in srgb,var(--c) 45%,transparent)}
.cur .ic ha-icon{--mdc-icon-size:36px}.cur .ic img{width:40px;height:40px}
.cur:active .ic{transform:scale(.94)}
.tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.tx .t{font-size:38px;font-weight:600;line-height:1;letter-spacing:-.02em;white-space:nowrap}
.tx b,.tx small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tx b{font-weight:500;font-size:14.5px}.tx small{font-size:12px;opacity:.65}
.pills.det .pill{cursor:default}
.pill .lb{opacity:.65}
.fc{display:flex;flex-direction:column;gap:14px}
.sec{display:flex;flex-direction:column;gap:2px;padding-top:12px;border-top:1px solid rgba(255,255,255,.1)}
.sec>.bt{margin-bottom:6px}
.wi{--c:var(--nv-neutral);color:var(--c)}
.day{display:grid;grid-template-columns:minmax(42px,auto) 22px 34px minmax(30px,1fr) 34px;align-items:center;gap:8px;font-size:13px;padding:5px 0}
.day.pp{grid-template-columns:minmax(42px,auto) 22px 34px minmax(30px,1fr) 34px 54px}
.day.nb{grid-template-columns:minmax(42px,1fr) 22px 34px 34px}
.day.nb.pp{grid-template-columns:minmax(42px,1fr) 22px 34px 34px 54px}
.day .wi{--mdc-icon-size:20px}
.day .d{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.day .lo{opacity:.6}.day .lo,.day .hi{text-align:right}.day .hi{font-weight:600}
.day .p{text-align:right;font-size:12px;opacity:.7;white-space:nowrap}
.rb{height:6px;border-radius:3px;background:rgba(255,255,255,.12);position:relative}
.rb i{position:absolute;top:0;bottom:0;border-radius:3px;background:linear-gradient(90deg,var(--nv-a1),var(--nv-a2))}
.spk{width:100%;height:48px;display:block;margin-bottom:6px}
.hcols{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));text-align:center}
.hcols>div{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;min-width:0}
.hcols .wi{--mdc-icon-size:20px}.hcols b{font-size:13px}.hcols small{opacity:.6;white-space:nowrap}
.hr{display:grid;grid-template-columns:44px 20px 36px 1fr 40px;align-items:center;gap:8px;font-size:12.5px;padding:4px 0}
.hr .wi{--mdc-icon-size:18px}.hr .p{text-align:right;opacity:.7}
.hr .rb{height:8px;border-radius:4px}
.hr .dot{position:absolute;top:-3px;width:14px;height:14px;border-radius:50%;background:#fff;transform:translateX(-50%);box-shadow:0 1px 4px rgba(0,0,0,.4)}
.fmsg{display:flex;align-items:center;gap:8px;font-size:12.5px;opacity:.7;padding:4px 0}
.fmsg.err{color:var(--nv-error);opacity:1}
.fmsg ha-icon{--mdc-icon-size:18px}
@container (max-width:280px){.clk .tm{font-size:48px}.tx .t{font-size:32px}.cur .ic{width:54px;height:54px}.cur .ic ha-icon{--mdc-icon-size:30px}
.day,.day.pp{grid-template-columns:minmax(36px,auto) 20px 30px minmax(20px,1fr) 30px}.day .p{display:none}}`;

// Wetterzustände von HA → Icon (Nacht-Variante, wenn die Sonne unter dem Horizont ist)
const CICON = {
  'clear-night': 'mdi:weather-night', cloudy: 'mdi:weather-cloudy', exceptional: 'mdi:alert-circle-outline', fog: 'mdi:weather-fog',
  hail: 'mdi:weather-hail', lightning: 'mdi:weather-lightning', 'lightning-rainy': 'mdi:weather-lightning-rainy',
  partlycloudy: 'mdi:weather-partly-cloudy', pouring: 'mdi:weather-pouring', rainy: 'mdi:weather-rainy', snowy: 'mdi:weather-snowy',
  'snowy-rainy': 'mdi:weather-snowy-rainy', sunny: 'mdi:weather-sunny', windy: 'mdi:weather-windy', 'windy-variant': 'mdi:weather-windy-variant',
};
const NIGHT = {partlycloudy: 'mdi:weather-night-partly-cloudy', sunny: 'mdi:weather-night'};
const condIcon = (cond, night) => (night && NIGHT[cond]) || CICON[cond] || 'mdi:weather-cloudy';
// Farbrolle bei „Automatisch“ – die Farben selbst kommen aus dem Theme
const CROLE = {
  sunny: 'accent-2', partlycloudy: 'accent-2', 'clear-night': 'accent-1', rainy: 'accent-1', pouring: 'accent-1', snowy: 'accent-1',
  'snowy-rainy': 'accent-1', hail: 'accent-1', lightning: 'accent-2', 'lightning-rainy': 'accent-2', exceptional: 'accent-3',
};
// Zusatzwerte als Chips; fehlt das Attribut an der Entität, entfällt der Chip
const DETAILS = {
  humidity: {label: 'Luftfeuchte', icon: 'mdi:water-percent', attr: 'humidity', unit: '%', dec: 0},
  wind: {label: 'Wind', icon: 'mdi:weather-windy', attr: 'wind_speed', unitAttr: 'wind_speed_unit', dec: 0, dir: true},
  wind_gust: {label: 'Böen', icon: 'mdi:weather-windy-variant', attr: 'wind_gust_speed', unitAttr: 'wind_speed_unit', dec: 0},
  pressure: {label: 'Luftdruck', icon: 'mdi:gauge', attr: 'pressure', unitAttr: 'pressure_unit', dec: 0},
  uv_index: {label: 'UV-Index', icon: 'mdi:white-balance-sunny', attr: 'uv_index', dec: 1},
  cloud_coverage: {label: 'Bewölkung', icon: 'mdi:cloud-percent-outline', attr: 'cloud_coverage', unit: '%', dec: 0},
  dew_point: {label: 'Taupunkt', icon: 'mdi:thermometer-water', attr: 'dew_point', unitAttr: 'temperature_unit', dec: 1},
  visibility: {label: 'Sichtweite', icon: 'mdi:eye-outline', attr: 'visibility', unitAttr: 'visibility_unit', dec: 1},
  ozone: {label: 'Ozon', icon: 'mdi:molecule', attr: 'ozone', dec: 0},
};
const DIRS = ['N', 'NNO', 'NO', 'ONO', 'O', 'OSO', 'SO', 'SSO', 'S', 'SSW', 'SW', 'WSW', 'W', 'WNW', 'NW', 'NNW'];
const dirOf = b => { const n = parseFloat(b); return Number.isFinite(n) ? DIRS[Math.round((((n % 360) + 360) % 360) / 22.5) % 16] : (typeof b === 'string' ? b : ''); };
// supported_features der Wetter-Entität: welche Vorhersage sie liefert
const FC = {daily: 1, hourly: 2};
const FC_NAME = {daily: 'Tagesvorhersage', hourly: 'Stundenvorhersage'};

const WDEF = {show_clock: false, show_date: false, show_name: true, show_feels_like: true, show_high_low: true, show_details: true, details: ['humidity', 'wind', 'pressure'],
  color: 'auto', label_details: false, show_daily: true, days: 7, daily_bar: true, show_hourly: false, hours: 24, hour_step: 3,
  hourly_layout: 'columns', hourly_graph: true, hourly_first: false, show_probability: true, show_precipitation: true, show_titles: true};
// Abo der Vorhersage beenden (nur einmal)
const off = p => { if (p._off) return; p._off = true; p.then(u => typeof u === 'function' && u()).catch(() => {}); };
const isNum = v => v !== '' && v != null && Number.isFinite(+v);
const clamp = (v, d, min, max) => isNum(v) ? Math.min(max, Math.max(min, Math.round(+v))) : d;

class NovaWeatherCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('weather-card-editor')); }
  static getStubConfig(h) {
    const w = Object.keys(h.states).find(id => id.startsWith('weather.'));
    return w ? {entity: w} : {};
  }
  constructor() { super(); this._subs = []; this._fc = {}; this._fcErr = {}; }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._c = {...WDEF, ...c, details: [].concat(c.details ?? WDEF.details).filter(k => DETAILS[k]),
      days: clamp(c.days, WDEF.days, 1, 14), hours: clamp(c.hours, WDEF.hours, 1, 72), hour_step: clamp(c.hour_step, WDEF.hour_step, 1, 12)};
    this._ids = [...entityIds(c), 'sun.sun'];
    this._key = null;
    if (this._h) { this._sub(); this._render(); }
  }
  // Neu zeichnen nur, wenn sich die Wetter-Entität, ein Sensor der Karte oder die Sonne geändert hat
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    if (!this._e) this._build();
    else if (this._key != null && !hassChanged(old, h, this._ids)) return;
    this._sub();
    this._render();
  }
  // In der Kartenauswahl: Uhr ohne Takt, Vorhersage nur einmal holen
  connectedCallback() { this._quiet = inPicker(this); if (this._h && this._c) { if (!this._e) this._build(); this._sub(); this._render(); } }
  disconnectedCallback() { this._unsub(); clearInterval(this._tm); this._tm = null; }
  getCardSize() {
    const c = this._c || WDEF;
    return 2 + (c.show_clock || c.show_date ? 2 : 0) + (c.show_details !== false ? 1 : 0) + (c.show_daily !== false ? Math.ceil(c.days * 0.7) : 0) + (c.show_hourly ? 3 : 0);
  }
  getGridOptions() { return {columns: 6, rows: 'auto', min_columns: 3}; }
  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${WCSS}</style><div class="g wt">
<div class="clk"><div class="tm"></div><div class="dt"></div></div>
<div class="bt"></div>
<div class="cur"><div class="ic"></div><div class="tx"><span class="t"></span><b></b><small></small></div></div>
<div class="pills det"></div><div class="fc"></div><div class="msg"></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), clk: q('.clk'), dt: q('.clk .dt'), tm: q('.clk .tm'), bt: q('.bt'), cur: q('.cur'), ic: q('.cur .ic'), t: q('.t'), cd: q('.tx b'), fl: q('.tx small'), det: q('.det'), fc: q('.fc'), msg: q('.msg')};
    const c = () => ({entity: this._c.entity, tap_action: this._c.tap_action, hold_action: this._c.hold_action});
    press(this._e.cur, {tap: () => runAction(this, c(), 'tap', true), hold: () => runAction(this, c(), 'hold')});
    this._key = null;
  }

  // Uhr und Datum wie im HA-Profil (Sprache, Zeitzone); läuft nur, solange die Karte angezeigt wird
  _clock() {
    const c = this._c, e = this._e, h = this._h;
    if (!e || !h) return;
    const on = !!(c.show_clock || c.show_date) && this.isConnected && !this._quiet;
    if (on && !this._tm) this._tm = setInterval(() => this._clock(), 10000);
    if (!on && this._tm) { clearInterval(this._tm); this._tm = null; }
    e.clk.hidden = !(c.show_clock || c.show_date);
    if (e.clk.hidden) return;
    const now = new Date(), lang = langOf(h), tz = tzOf(h);
    const fmt = o => { try { return new Intl.DateTimeFormat(lang, {...o, timeZone: tz}).format(now); } catch { return new Intl.DateTimeFormat(lang, o).format(now); } };
    e.dt.hidden = !c.show_date; e.tm.hidden = !c.show_clock;
    if (c.show_date) e.dt.textContent = fmt({weekday: 'long', day: 'numeric', month: 'long'});
    if (c.show_clock) e.tm.textContent = fmt({hour: '2-digit', minute: '2-digit'});
  }

  /* Vorhersage: weather/subscribe_forecast, je Art (täglich/stündlich) ein Abo, nur solange die Karte angezeigt wird */
  _needs() {
    const c = this._c;
    return [c.show_daily !== false || c.show_high_low !== false ? 'daily' : null, c.show_hourly ? 'hourly' : null].filter(Boolean);
  }
  _sub() {
    const h = this._h, c = this._c;
    if (!h?.connection || !c || !this.isConnected) return;
    const s = c.entity && h.states[c.entity];
    const types = s ? this._needs().filter(t => hasF(s, FC[t])) : [];
    const key = JSON.stringify([c.entity, types]);
    if (key === this._subKey) return;
    this._unsub();
    this._subKey = key;
    types.forEach(t => {
      const p = h.connection.subscribeMessage(ev => {
        if (this._subKey !== key) return;
        this._fc[t] = ev?.forecast || [];
        this._render();
        if (this._quiet) off(p);
      }, {type: 'weather/subscribe_forecast', forecast_type: t, entity_id: c.entity});
      p.catch(err => {
        if (this._subKey !== key) return;
        this._fcErr[t] = err?.message || err?.code || 'unbekannter Fehler';
        console.warn('[nova-cards] Wetter: Vorhersage nicht geladen', c.entity, t, err);
        this._render();
      });
      this._subs.push(p);
    });
  }
  _unsub() {
    this._subs.forEach(off);
    this._subs = []; this._fc = {}; this._fcErr = {}; this._subKey = null;
  }

  // Zahl mit Komma nach Sprache aus dem HA-Profil; dec = max. Nachkommastellen, fixed = immer genau dec
  _num(v, dec, fixed) {
    try { return new Intl.NumberFormat(langOf(this._h), {maximumFractionDigits: dec, minimumFractionDigits: fixed ? dec : 0, useGrouping: false}).format(+v); } catch { return String(v); }
  }
  // Temperatur: eigener Sensor (optional), sonst Attribut der Wetter-Entität
  _temp(ent, s, attr) {
    const h = this._h, c = this._c, dec = c.decimals ?? 1, fx = c.decimals != null, o = ent && h.states[ent];
    if (ent) return o && isNum(o.state) ? unitJoin(this._num(o.state, dec, fx), o.attributes.unit_of_measurement || s?.attributes.temperature_unit) : null;
    const v = s?.attributes[attr];
    return isNum(v) ? unitJoin(this._num(v, dec, fx), s.attributes.temperature_unit) : null;
  }
  _deg(v) { return isNum(v) ? `${this._num(v, 0)}°` : '–'; }
  _role(cond) { const c = this._c.color; return c === 'auto' || !c ? CROLE[cond] || 'neutral' : c; }
  _icon(s) {
    if (this._c.icon) return this._c.icon;
    return condIcon(s.state, this._h.states['sun.sun']?.state === 'below_horizon');
  }
  _details(s) {
    return this._c.details.map(k => {
      const d = DETAILS[k], v = s.attributes[d.attr];
      if (!isNum(v)) return null;
      let val = unitJoin(this._num(v, d.dec), d.unit ?? s.attributes[d.unitAttr]);
      if (d.dir && s.attributes.wind_bearing != null) val += ` ${dirOf(s.attributes.wind_bearing)}`;
      return {k, icon: d.icon, label: d.label, val};
    }).filter(Boolean);
  }
  // Regenwahrscheinlichkeit / Niederschlag eines Vorhersage-Eintrags, je nach Einstellung
  _rain(x, s) {
    const c = this._c, out = [];
    if (c.show_probability !== false && isNum(x.precipitation_probability)) out.push(`${this._num(x.precipitation_probability, 0)} %`);
    if (c.show_precipitation !== false && isNum(x.precipitation) && +x.precipitation > 0) out.push(unitJoin(this._num(x.precipitation, 1), s.attributes.precipitation_unit || 'mm'));
    return out.join(' · ');
  }
  // Zustand einer Vorhersage-Art: {list} oder {msg: [Icon, Text], err}
  _fcState(t, s) {
    if (!hasF(s, FC[t])) return {msg: ['mdi:weather-cloudy-alert', `${s.attributes.friendly_name || this._c.entity} liefert keine ${FC_NAME[t]}`]};
    if (this._fcErr[t]) return {msg: ['mdi:alert-circle-outline', `${FC_NAME[t]} konnte nicht geladen werden: ${this._fcErr[t]}`], err: true};
    if (!this._fc[t]) return {msg: ['mdi:timer-sand', `${FC_NAME[t]} wird geladen …`]};
    if (!this._fc[t].length) return {msg: ['mdi:weather-cloudy-alert', `Keine ${FC_NAME[t]} vorhanden`]};
    return {list: this._fc[t]};
  }
  _dailyView(s, tz, lang) {
    const st = this._fcState('daily', s);
    if (!st.list) return st;
    const today = ymdIn(new Date(), tz);
    const days = st.list.slice(0, this._c.days).map(x => {
      const d = new Date(x.datetime);
      let label;
      if (ymdIn(d, tz) === today) label = 'Heute';
      else try { label = new Intl.DateTimeFormat(lang, {weekday: 'short', timeZone: tz}).format(d); } catch { label = String(x.datetime).slice(5, 10); }
      const hi = isNum(x.temperature) ? +x.temperature : null, lo = isNum(x.templow) ? +x.templow : hi;
      return {label, icon: condIcon(x.condition), role: this._role(x.condition), hi, lo, rain: this._rain(x, s)};
    });
    const vals = days.flatMap(x => [x.lo, x.hi]).filter(v => v != null);
    return {days, min: Math.min(...vals), max: Math.max(...vals)};
  }
  _hourlyView(s, tz, lang) {
    const st = this._fcState('hourly', s);
    if (!st.list) return st;
    const c = this._c, list = st.list.slice(0, c.hours);
    const hours = list.filter((_, i) => i % c.hour_step === 0).map(x => {
      let label;
      try { label = new Intl.DateTimeFormat(lang, {hour: '2-digit', minute: '2-digit', timeZone: tz}).format(new Date(x.datetime)); } catch { label = String(x.datetime).slice(11, 16); }
      return {label, icon: condIcon(x.condition, x.is_daytime === false), role: this._role(x.condition), t: isNum(x.temperature) ? +x.temperature : null, rain: this._rain(x, s)};
    });
    const pts = c.hourly_graph !== false ? list.filter(x => isNum(x.temperature)).map(x => [new Date(x.datetime).getTime(), +x.temperature]) : null;
    const ts = hours.map(x => x.t).filter(v => v != null);
    return {hours, pts, min: Math.min(...ts), max: Math.max(...ts)};
  }
  _render() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !e) return;
    this._clock();
    const s = c.entity && h.states[c.entity];
    let msg = null;
    if (!c.entity) msg = ['info', 'mdi:weather-cloudy-alert', 'Keine Wetter-Entität gewählt – im Editor eine weather.*-Entität auswählen.'];
    else if (!s) msg = ['error', 'mdi:alert-circle-outline', `Entität nicht gefunden: ${c.entity}`];
    const na = !!s && ['unavailable', 'unknown'].includes(s.state);
    const lang = langOf(h), tz = tzOf(h);
    let view = {msg};
    if (!msg) {
      const daily = (c.show_daily !== false || c.show_high_low !== false) && !na ? this._dailyView(s, tz, lang) : null;
      const today = daily?.days?.[0]?.label === 'Heute' ? daily.days[0] : null;
      view = {
        name: nameOf(h, c), icon: this._icon(s), cond: na ? 'Nicht verfügbar' : fmtState(h, s),
        t: this._temp(c.temperature_entity, s, 'temperature'),
        fl: c.show_feels_like !== false ? this._temp(c.feels_like_entity, s, 'apparent_temperature') : null,
        hl: c.show_high_low !== false && today ? `↑ ${this._deg(today.hi)}  ↓ ${this._deg(today.lo)}` : null,
        det: c.show_details !== false && !na ? this._details(s) : [],
        role: this._role(s.state), na,
        daily: c.show_daily !== false ? daily : null,
        hourly: c.show_hourly && !na ? this._hourlyView(s, tz, lang) : null,
      };
    }
    const key = JSON.stringify([view, c.show_name, c.label_details, c.daily_bar, c.hourly_layout, c.hourly_first, c.show_titles, c.hours]);
    if (key === this._key) return;
    this._key = key;

    e.msg.hidden = !msg; e.cur.hidden = !!msg; e.det.hidden = true; e.bt.hidden = true; e.fc.hidden = true;
    if (msg) {
      e.msg.className = `al ${msg[0]}`;
      e.msg.innerHTML = `<ha-icon icon="${esc(msg[1])}"></ha-icon><span></span>`;
      e.msg.lastChild.textContent = msg[2];
      return;
    }
    e.bt.hidden = c.show_name === false || !view.name;
    e.bt.textContent = view.name;
    const rv = roleVars(view.role);
    e.cur.style.setProperty('--c', rv.c); e.cur.style.setProperty('--cf', rv.fg);
    e.cur.classList.toggle('na', view.na);
    setIcon(e.ic, view.icon);
    e.t.textContent = view.t ?? '–';
    e.cd.textContent = view.cond;
    const sub = [view.fl && `Gefühlt ${view.fl}`, view.hl].filter(Boolean).join('  ·  ');
    e.fl.textContent = sub;
    e.fl.hidden = !sub;
    e.det.hidden = !view.det.length;
    e.det.replaceChildren(...view.det.map(d => {
      const p = document.createElement('div');
      p.className = 'pill'; p.title = d.label;
      p.innerHTML = `<ha-icon icon="${esc(d.icon)}"></ha-icon>${c.label_details ? '<span class="lb"></span>' : ''}<span class="v"></span>`;
      if (c.label_details) p.querySelector('.lb').textContent = d.label;
      p.querySelector('.v').textContent = d.val;
      return p;
    }));
    const secs = [view.daily && this._dailyHtml(view.daily), view.hourly && this._hourlyHtml(view.hourly)];
    if (c.hourly_first) secs.reverse();
    e.fc.innerHTML = secs.filter(Boolean).join('');
    e.fc.hidden = !e.fc.innerHTML;
  }
  _title(t) { return this._c.show_titles !== false ? `<div class="bt">${esc(t)}</div>` : ''; }
  _fmsg(m) { return `<div class="fmsg${m.err ? ' err' : ''}"><ha-icon icon="${esc(m.msg[0])}"></ha-icon><span>${esc(m.msg[1])}</span></div>`; }
  _wi(icon, role) { return `<ha-icon class="wi" icon="${esc(icon)}" style="--c:${roleVars(role).c}"></ha-icon>`; }
  _dailyHtml(v) {
    const c = this._c;
    if (!v.days) return `<div class="sec">${this._title(FC_NAME.daily)}${this._fmsg(v)}</div>`;
    const bar = c.daily_bar !== false, rain = v.days.some(x => x.rain), rg = v.max - v.min || 1;
    const rows = v.days.map(x => {
      const l = ((x.lo ?? v.min) - v.min) / rg * 100, w = Math.max(4, ((x.hi ?? v.max) - (x.lo ?? v.min)) / rg * 100);
      return `<div class="day${bar ? '' : ' nb'}${rain ? ' pp' : ''}"><span class="d">${esc(x.label)}</span>${this._wi(x.icon, x.role)}`
        + `<span class="lo">${this._deg(x.lo)}</span>${bar ? `<div class="rb"><i style="left:${Math.min(96, l).toFixed(1)}%;width:${Math.min(100 - Math.min(96, l), w).toFixed(1)}%"></i></div>` : ''}`
        + `<span class="hi">${this._deg(x.hi)}</span>${rain ? `<span class="p">${esc(x.rain)}</span>` : ''}</div>`;
    }).join('');
    return `<div class="sec">${this._title(v.days.length === 1 ? 'Heute' : `Nächste ${v.days.length} Tage`)}${rows}</div>`;
  }
  _hourlyHtml(v) {
    const c = this._c;
    if (!v.hours) return `<div class="sec">${this._title(FC_NAME.hourly)}${this._fmsg(v)}</div>`;
    const title = this._title(`Nächste ${c.hours} Stunden`), graph = v.pts ? sparkline(v.pts, {h: 48}) : '';
    if (c.hourly_layout === 'list') {
      const rg = v.max - v.min || 1;
      const rows = v.hours.map(x => `<div class="hr"><span>${esc(x.label)}</span>${this._wi(x.icon, x.role)}<span>${this._deg(x.t)}</span>`
        + `<div class="rb">${x.t != null ? `<div class="dot" style="left:${(8 + (x.t - v.min) / rg * 84).toFixed(1)}%"></div>` : ''}</div><span class="p">${esc(x.rain)}</span></div>`).join('');
      return `<div class="sec">${title}${graph}${rows}</div>`;
    }
    const cols = v.hours.map(x => `<div><small>${esc(x.label)}</small>${this._wi(x.icon, x.role)}<b>${this._deg(x.t)}</b>${x.rain ? `<small>${esc(x.rain)}</small>` : ''}</div>`).join('');
    return `<div class="sec">${title}${graph}<div class="hcols" style="--n:${v.hours.length}">${cols}</div></div>`;
  }
}
define('weather-card', NovaWeatherCard, {name: 'Nova Wetter Card', description: 'Aktuelles Wetter einer weather.*-Entität mit Tages- und Stundenvorhersage – Icon, Temperatur, Zustand, Max/Min, Regen und Werte wie Luftfeuchte, Wind und Luftdruck.', documentationURL: docUrl('nova-wetter-card')});

/* ---------- Editor Wetter Card ---------- */
const TSENS = {entity: {domain: 'sensor', device_class: 'temperature'}};
const BOOL = n => ({name: n, selector: {boolean: {}}});
const NUMB = (n, min, max, unit) => ({name: n, selector: {number: {min, max, mode: 'box', ...(unit ? {unit_of_measurement: unit} : {})}}});
const S_CUR = [
  {name: 'entity', required: true, selector: {entity: {domain: 'weather'}}},
  g2(BOOL('show_clock'), BOOL('show_date')),
  g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}}),
  g2({name: 'temperature_entity', selector: TSENS}, {name: 'feels_like_entity', selector: TSENS}),
  g2(BOOL('show_name'), BOOL('show_feels_like')),
  g2(BOOL('show_high_low'), NUMB('decimals', 0, 2)),
  sel('color', [['auto', 'Automatisch (nach Wetter)'], ['neutral', 'Neutral'], ['accent-1', 'Akzent 1'], ['accent-2', 'Akzent 2'], ['accent-3', 'Akzent 3'], ['accent-4', 'Akzent 4']]),
];
const S_DET = [
  g2(BOOL('show_details'), BOOL('label_details')),
  {name: 'details', selector: {select: {multiple: true, mode: 'list', options: Object.entries(DETAILS).map(([value, d]) => ({value, label: d.label}))}}},
];
const S_DAY = [g2(BOOL('show_daily'), NUMB('days', 1, 14, 'Tage')), BOOL('daily_bar')];
const S_HOUR = [
  g2(BOOL('show_hourly'), sel('hourly_layout', [['columns', 'Spalten'], ['list', 'Liste mit Balken']])),
  g2(NUMB('hours', 1, 72, 'h'), NUMB('hour_step', 1, 12, 'h')),
  BOOL('hourly_graph'),
];
const S_ALL = [g2(BOOL('show_probability'), BOOL('show_precipitation')), g2(BOOL('show_titles'), BOOL('hourly_first'))];
const S_ACT = [g2({name: 'tap_action', selector: A}, {name: 'hold_action', selector: A})];
const WLABELS = {...BASE_LABELS, entity: 'Wetter-Entität', show_clock: 'Uhr anzeigen', show_date: 'Datum anzeigen', name: 'Name', temperature_entity: 'Temperatur-Sensor (optional)',
  feels_like_entity: 'Sensor gefühlte Temperatur (optional)', show_name: 'Name anzeigen', show_feels_like: 'Gefühlte Temperatur anzeigen',
  show_high_low: 'Max/Min von heute anzeigen', color: 'Farbrolle Icons', decimals: 'Nachkommastellen Temperatur',
  show_details: 'Zusatzwerte anzeigen', label_details: 'Zusatzwerte beschriften', details: 'Zusatzwerte',
  show_daily: 'Tagesvorhersage anzeigen', days: 'Anzahl Tage', daily_bar: 'Temperatur-Balken',
  show_hourly: 'Stundenvorhersage anzeigen', hourly_layout: 'Darstellung', hours: 'Zeitraum', hour_step: 'Abstand',
  hourly_graph: 'Temperaturkurve', show_probability: 'Regenwahrscheinlichkeit', show_precipitation: 'Niederschlagsmenge',
  show_titles: 'Überschriften', hourly_first: 'Stunden vor Tagen'};
const WHELPERS = {
  icon: 'Leer = Icon passend zum Wetter',
  show_clock: 'Große Uhr über dem Wetter',
  temperature_entity: 'Leer = Temperatur der Wetter-Entität',
  feels_like_entity: 'Leer = Attribut „apparent_temperature“, falls die Wetter-Entität es liefert',
  color: 'Farben kommen aus dem Theme (--nova-accent-1 … 4, --nova-neutral); „Automatisch“ färbt jedes Icon nach seinem Wetter',
  decimals: 'Leer = bis zu 1 Nachkommastelle',
  details: 'Werte, die die Wetter-Entität nicht liefert, werden ausgelassen',
  show_high_low: 'Aus der Tagesvorhersage',
  hour_step: 'Jede wievielte Stunde angezeigt wird',
  show_probability: 'Nur wenn die Vorhersage sie liefert',
  tap_action: 'Standard: Details der Wetter-Entität',
};

class NovaWeatherCardEditor extends NovaEditorBase {
  static labels = WLABELS;
  static helpers = WHELPERS;
  _build() {
    const r = this.shadowRoot, c0 = this._config;
    r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), data = {...WDEF, ...c0};
    const strip = c => { Object.entries(WDEF).forEach(([k, x]) => JSON.stringify(c[k]) === JSON.stringify(x) && delete c[k]); return c; };
    const form = schema => this._form(schema, data, v => this._emit(strip(merge(this._config, names(schema), v))));
    // Hinweis, wenn die gewählte Entität eine Vorhersage-Art nicht liefert
    const s = this._hass?.states[c0.entity];
    const none = t => s && !hasF(s, FC[t]) ? [this._hint(`Diese Entität liefert keine ${FC_NAME[t]}.`)] : [];
    w.append(this._h3('Aktuelles Wetter'), form(S_CUR), this._h3('Zusatzwerte'), form(S_DET),
      this._h3('Tagesvorhersage'), ...none('daily'), form(S_DAY),
      this._h3('Stundenvorhersage'), ...none('hourly'), form(S_HOUR),
      this._h3('Vorhersage allgemein'), form(S_ALL), this._h3('Aktionen'), form(S_ACT));
  }
  // Entität gewechselt → Hinweise zur Vorhersage neu aufbauen
  _emit(c) { const was = this._config?.entity; super._emit(c); if (c.entity !== was) this._rebuild(); }
}
define('weather-card-editor', NovaWeatherCardEditor);
