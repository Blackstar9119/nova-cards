import {define, docUrl, tag} from './shared/define.js';
import {esc, setIcon} from './shared/utils.js';
import {runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {fmtState, unitJoin, nameOf} from './shared/state.js';
import {NOVA_VARS, PANEL_CSS, EDITOR_CSS, EDITOR_ICON_CSS, roleVars} from './shared/styles.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, A, sel, BASE_LABELS} from './shared/editor-schema.js';

/* ---------- Nova Wetter Card ---------- */
const WCSS = `
.g.wt{gap:14px}
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
@container (max-width:280px){.tx .t{font-size:32px}.cur .ic{width:54px;height:54px}.cur .ic ha-icon{--mdc-icon-size:30px}}`;

// Wetterzustände von HA → Icon (Nacht-Variante, wenn die Sonne unter dem Horizont ist)
const CICON = {
  'clear-night': 'mdi:weather-night', cloudy: 'mdi:weather-cloudy', exceptional: 'mdi:alert-circle-outline', fog: 'mdi:weather-fog',
  hail: 'mdi:weather-hail', lightning: 'mdi:weather-lightning', 'lightning-rainy': 'mdi:weather-lightning-rainy',
  partlycloudy: 'mdi:weather-partly-cloudy', pouring: 'mdi:weather-pouring', rainy: 'mdi:weather-rainy', snowy: 'mdi:weather-snowy',
  'snowy-rainy': 'mdi:weather-snowy-rainy', sunny: 'mdi:weather-sunny', windy: 'mdi:weather-windy', 'windy-variant': 'mdi:weather-windy-variant',
};
const NIGHT = {partlycloudy: 'mdi:weather-night-partly-cloudy', sunny: 'mdi:weather-night'};
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

const WDEF = {show_name: true, show_feels_like: true, show_details: true, details: ['humidity', 'wind', 'pressure'], color: 'auto', label_details: false};
const langOf = h => h.locale?.language || h.language || 'de';
const isNum = v => v !== '' && v != null && Number.isFinite(+v);

class NovaWeatherCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('weather-card-editor')); }
  static getStubConfig(h) {
    const w = Object.keys(h.states).find(id => id.startsWith('weather.'));
    return w ? {entity: w} : {};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._c = {...WDEF, ...c, details: [].concat(c.details ?? WDEF.details).filter(k => DETAILS[k])};
    this._key = null;
    if (this._h) this._render();
  }
  set hass(h) {
    this._h = h;
    if (!this._c) return;
    if (!this._e) this._build();
    this._render();
  }
  getCardSize() { return this._c?.show_details === false ? 2 : 3; }
  getGridOptions() { return {columns: 6, rows: 'auto', min_columns: 3}; }
  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${WCSS}</style><div class="g wt">
<div class="bt"></div>
<div class="cur"><div class="ic"></div><div class="tx"><span class="t"></span><b></b><small></small></div></div>
<div class="pills det"></div><div class="msg"></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), bt: q('.bt'), cur: q('.cur'), ic: q('.cur .ic'), t: q('.t'), cd: q('.tx b'), fl: q('.tx small'), det: q('.det'), msg: q('.msg')};
    const c = () => ({entity: this._c.entity, tap_action: this._c.tap_action, hold_action: this._c.hold_action});
    press(this._e.cur, {tap: () => runAction(this, c(), 'tap', true), hold: () => runAction(this, c(), 'hold')});
    this._key = null;
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
  _icon(s) {
    if (this._c.icon) return this._c.icon;
    const night = this._h.states['sun.sun']?.state === 'below_horizon';
    return (night && NIGHT[s.state]) || CICON[s.state] || 'mdi:weather-cloudy';
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
  _render() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !e) return;
    const s = c.entity && h.states[c.entity];
    let msg = null;
    if (!c.entity) msg = ['info', 'mdi:weather-cloudy-alert', 'Keine Wetter-Entität gewählt – im Editor eine weather.*-Entität auswählen.'];
    else if (!s) msg = ['error', 'mdi:alert-circle-outline', `Entität nicht gefunden: ${c.entity}`];
    const na = !!s && ['unavailable', 'unknown'].includes(s.state);
    const view = msg ? {msg} : {
      name: nameOf(h, c), icon: this._icon(s), cond: na ? 'Nicht verfügbar' : fmtState(h, s),
      t: this._temp(c.temperature_entity, s, 'temperature'),
      fl: c.show_feels_like !== false ? this._temp(c.feels_like_entity, s, 'apparent_temperature') : null,
      det: c.show_details !== false && !na ? this._details(s) : [],
      role: c.color === 'auto' || !c.color ? CROLE[s.state] || 'neutral' : c.color, na,
    };
    const key = JSON.stringify([view, c.show_name, c.label_details, langOf(h)]);
    if (key === this._key) return;
    this._key = key;

    e.msg.hidden = !msg; e.cur.hidden = !!msg; e.det.hidden = true; e.bt.hidden = true;
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
    e.fl.textContent = view.fl ? `Gefühlt ${view.fl}` : '';
    e.fl.hidden = !view.fl;
    e.det.hidden = !view.det.length;
    e.det.replaceChildren(...view.det.map(d => {
      const p = document.createElement('div');
      p.className = 'pill'; p.title = d.label;
      p.innerHTML = `<ha-icon icon="${esc(d.icon)}"></ha-icon>${c.label_details ? '<span class="lb"></span>' : ''}<span class="v"></span>`;
      if (c.label_details) p.querySelector('.lb').textContent = d.label;
      p.querySelector('.v').textContent = d.val;
      return p;
    }));
  }
}
define('weather-card', NovaWeatherCard, {name: 'Nova Wetter Card', description: 'Aktuelles Wetter einer weather.*-Entität – Icon, Temperatur, Zustand, gefühlte Temperatur und Werte wie Luftfeuchte, Wind und Luftdruck.', documentationURL: docUrl('nova-wetter-card')});

/* ---------- Editor Wetter Card ---------- */
const TSENS = {entity: {domain: 'sensor', device_class: 'temperature'}};
const WMAIN = [
  {name: 'entity', required: true, selector: {entity: {domain: 'weather'}}},
  g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}}),
  g2({name: 'temperature_entity', selector: TSENS}, {name: 'feels_like_entity', selector: TSENS}),
  g2({name: 'show_name', selector: {boolean: {}}}, {name: 'show_feels_like', selector: {boolean: {}}}),
  g2(sel('color', [['auto', 'Automatisch (nach Wetter)'], ['neutral', 'Neutral'], ['accent-1', 'Akzent 1'], ['accent-2', 'Akzent 2'], ['accent-3', 'Akzent 3'], ['accent-4', 'Akzent 4']]),
    {name: 'decimals', selector: {number: {min: 0, max: 2, mode: 'box'}}}),
  g2({name: 'show_details', selector: {boolean: {}}}, {name: 'label_details', selector: {boolean: {}}}),
  {name: 'details', selector: {select: {multiple: true, mode: 'list', options: Object.entries(DETAILS).map(([value, d]) => ({value, label: d.label}))}}},
  g2({name: 'tap_action', selector: A}, {name: 'hold_action', selector: A}),
];
const WLABELS = {...BASE_LABELS, entity: 'Wetter-Entität', name: 'Name', temperature_entity: 'Temperatur-Sensor (optional)',
  feels_like_entity: 'Sensor gefühlte Temperatur (optional)', show_name: 'Name anzeigen', show_feels_like: 'Gefühlte Temperatur anzeigen',
  color: 'Farbrolle Icon', decimals: 'Nachkommastellen Temperatur', show_details: 'Zusatzwerte anzeigen', label_details: 'Zusatzwerte beschriften',
  details: 'Zusatzwerte'};
const WHELPERS = {
  icon: 'Leer = Icon passend zum Wetter',
  temperature_entity: 'Leer = Temperatur der Wetter-Entität',
  feels_like_entity: 'Leer = Attribut „apparent_temperature“, falls die Wetter-Entität es liefert',
  color: 'Farben kommen aus dem Theme (--nova-accent-1 … 4, --nova-neutral)',
  decimals: 'Leer = bis zu 1 Nachkommastelle',
  details: 'Werte, die die Wetter-Entität nicht liefert, werden ausgelassen',
  tap_action: 'Standard: Details der Wetter-Entität',
};

class NovaWeatherCardEditor extends NovaEditorBase {
  static labels = WLABELS;
  static helpers = WHELPERS;
  _build() {
    const r = this.shadowRoot, c0 = this._config;
    r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}</style><div class="wrap"></div>`;
    const strip = c => { Object.entries(WDEF).forEach(([k, x]) => JSON.stringify(c[k]) === JSON.stringify(x) && delete c[k]); return c; };
    r.querySelector('.wrap').append(this._form(WMAIN, {...WDEF, ...c0}, v => this._emit(strip(merge(this._config, names(WMAIN), v)))));
  }
}
define('weather-card-editor', NovaWeatherCardEditor);
