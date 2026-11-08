import {dom, list, NUMRE} from './utils.js';

const OFF = new Set(['off', 'unavailable', 'unknown', 'idle', 'docked', 'standby', 'closed', 'paused', 'not_home', 'none', 'ready']);
export const isOn = s => !!s && !OFF.has(s.state);

export const DICON = {light: 'mdi:lightbulb', switch: 'mdi:power-socket-eu', fan: 'mdi:fan', input_boolean: 'mdi:toggle-switch-outline', button: 'mdi:gesture-tap-button', input_button: 'mdi:gesture-tap-button', script: 'mdi:script-text-outline', scene: 'mdi:palette', automation: 'mdi:robot', climate: 'mdi:thermostat', cover: 'mdi:window-shutter', media_player: 'mdi:speaker', number: 'mdi:ray-vertex', input_number: 'mdi:ray-vertex', select: 'mdi:format-list-bulleted', binary_sensor: 'mdi:checkbox-blank-circle-outline', sensor: 'mdi:eye'};
export const TOGGLE = ['light', 'switch', 'input_boolean', 'fan', 'cover', 'group', 'siren', 'humidifier', 'automation', 'media_player', 'valve'];
export const PRESS = {button: ['button', 'press'], input_button: ['input_button', 'press'], script: ['script', 'turn_on'], scene: ['scene', 'turn_on']};

// Zahl nach dem Zahlenformat aus dem HA-Profil (Komma/Punkt); dec = feste Nachkommastellen, sonst wie im Zustand
const NUMLOC = {comma_decimal: 'de', decimal_period: 'en-US', space_comma: 'fr', none: 'en-US'};
export const fmtNum = (h, v, dec) => {
  const nf = h?.locale?.number_format, loc = NUMLOC[nf] || (nf === 'system' ? undefined : h?.locale?.language || h?.language || 'de');
  const d = dec ?? decOf(v);
  try { return new Intl.NumberFormat(loc, {minimumFractionDigits: d, maximumFractionDigits: d, useGrouping: nf !== 'none'}).format(+v); } catch { return String(v); }
};
export const fmtState = (h, s) => {
  try {
    if (h.formatEntityState) return h.formatEntityState(s);
    const u = s.attributes.unit_of_measurement;
    return (NUMRE.test(s.state) ? fmtNum(h, s.state) : s.state) + (u ? ' ' + u : '');
  } catch { return s.state; }
};
export const unitJoin = (v, u) => !u ? `${v}` : u.startsWith('°') ? `${v}${u}` : `${v} ${u}`;
export const decOf = st => (String(st).split('.')[1] || '').length;
export const nameOf = (h, o) => o.name ?? h.states[o.entity]?.attributes.friendly_name ?? o.entity ?? '';
// Icons nach device_class (wie im HA-Frontend), sonst wäre jeder Sensor ohne eigenes Icon ein Auge. Binärsensoren: [aus, an]
const SCLASS = {temperature: 'mdi:thermometer', humidity: 'mdi:water-percent', battery: 'mdi:battery', power: 'mdi:flash', energy: 'mdi:lightning-bolt',
  illuminance: 'mdi:brightness-5', pressure: 'mdi:gauge', atmospheric_pressure: 'mdi:gauge', co2: 'mdi:molecule-co2', carbon_dioxide: 'mdi:molecule-co2',
  pm25: 'mdi:blur', pm10: 'mdi:blur', voltage: 'mdi:sine-wave', current: 'mdi:current-ac', duration: 'mdi:timer-outline', timestamp: 'mdi:clock-outline',
  date: 'mdi:calendar', moisture: 'mdi:water', precipitation: 'mdi:weather-rainy', wind_speed: 'mdi:weather-windy', gas: 'mdi:meter-gas',
  water: 'mdi:water', signal_strength: 'mdi:wifi', volatile_organic_compounds: 'mdi:air-filter', speed: 'mdi:speedometer', weight: 'mdi:weight'};
const BCLASS = {window: ['mdi:window-closed', 'mdi:window-open'], door: ['mdi:door-closed', 'mdi:door-open'], garage_door: ['mdi:garage', 'mdi:garage-open'],
  opening: ['mdi:square-outline', 'mdi:square-rounded-outline'], motion: ['mdi:motion-sensor-off', 'mdi:motion-sensor'], occupancy: ['mdi:home-outline', 'mdi:home'],
  presence: ['mdi:home-outline', 'mdi:home'], moisture: ['mdi:water-off', 'mdi:water'], smoke: ['mdi:smoke-detector', 'mdi:smoke-detector-alert'],
  battery: ['mdi:battery', 'mdi:battery-outline'], problem: ['mdi:check-circle-outline', 'mdi:alert-circle'], connectivity: ['mdi:close-network-outline', 'mdi:check-network-outline'],
  power: ['mdi:power-plug-off', 'mdi:power-plug'], plug: ['mdi:power-plug-off', 'mdi:power-plug'], running: ['mdi:stop', 'mdi:play'], lock: ['mdi:lock', 'mdi:lock-open']};
const classIcon = (s, id) => {
  const dc = s?.attributes.device_class, d = dom(id);
  if (!dc) return null;
  if (d === 'binary_sensor') return BCLASS[dc]?.[s.state === 'on' ? 1 : 0] || null;
  return (d === 'sensor' || d === 'number' || d === 'input_number') ? SCLASS[dc] || null : null;
};
export const iconOf = (h, o, fb) => { const s = h.states[o.entity]; return o.icon || s?.attributes.icon || classIcon(s, o.entity) || DICON[dom(o.entity)] || fb; };
// Sprache und Zeitzone wie im HA-Profil: „Server“ = Zeitzone von HA, sonst die des Browsers
export const langOf = h => h.locale?.language || h.language || 'de';
export const tzOf = h => h.locale?.time_zone === 'server' ? h.config?.time_zone : undefined;
// Bereich einer Entität (direkt oder über ihr Gerät)
export const areaOf = (h, id) => { const e = h.entities?.[id]; return (e && (e.area_id || h.devices?.[e.device_id]?.area_id)) || null; };
// supported_features prüfen
export const hasF = (s, f) => ((s?.attributes.supported_features || 0) & f) === f;

// Dauer in Sekunden umrechnen (Einheit der Entität: s, min, h, d, ms)
const DUR_U = {ms: .001, s: 1, min: 60, h: 3600, d: 86400};
export const clockOf = sec => {
  const t = Math.max(0, Math.round(sec)), hh = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), ss = String(t % 60).padStart(2, '0');
  return hh ? `${hh}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
};
// Ruhezustand: 0, aus, nicht verfügbar – für „bei 0 / aus ausblenden“
export const idleState = s => !s || ['off', 'unavailable', 'unknown', ''].includes(s.state) || (NUMRE.test(s.state) && +s.state <= 0);

export function valueOf(h, s, o) {
  if (!s) return '–';
  if (o.format === 'clock' && NUMRE.test(s.state)) return clockOf(+s.state * (DUR_U[o.unit ?? s.attributes.unit_of_measurement] ?? 1));
  if ((o.decimals != null || o.unit != null) && NUMRE.test(s.state)) {
    const n = fmtNum(h, s.state, o.decimals ?? undefined);
    return unitJoin(n, o.unit ?? s.attributes.unit_of_measurement);
  }
  return fmtState(h, s);
}

// Warnbedingung: state / state_not / above / below, sonst „on“ bzw. „problem“
export function alertHit(a, s) {
  if (!s) return false;
  const v = s.state, n = parseFloat(v);
  if (a.state != null) return list(a.state).includes(v);
  if (a.state_not != null) return !['unavailable', 'unknown'].includes(v) && !list(a.state_not).includes(v);
  if (a.above != null || a.below != null) return NUMRE.test(v) && (a.above == null || n > a.above) && (a.below == null || n < a.below);
  return ['on', 'problem'].includes(v);
}

// Schieberegler je Domain: v = aktueller Wert, r = [min, max, step], u = Einheit, set = Service
export const SLIDE = {
  number: {v: s => +s.state, r: a => [a.min ?? 0, a.max ?? 100, a.step ?? 1], set: (h, id, v) => h.callService('number', 'set_value', {entity_id: id, value: v})},
  input_number: {v: s => +s.state, r: a => [a.min ?? 0, a.max ?? 100, a.step ?? 1], set: (h, id, v) => h.callService('input_number', 'set_value', {entity_id: id, value: v})},
  light: {v: s => s.state === 'on' ? Math.max(1, Math.round((s.attributes.brightness || 0) / 2.55)) : 0, r: () => [0, 100, 1], u: '%',
    set: (h, id, v) => v > 0 ? h.callService('light', 'turn_on', {entity_id: id, brightness_pct: v}) : h.callService('light', 'turn_off', {entity_id: id})},
  fan: {v: s => s.state === 'on' ? s.attributes.percentage ?? 0 : 0, r: a => [0, 100, a.percentage_step || 1], u: '%', set: (h, id, v) => h.callService('fan', 'set_percentage', {entity_id: id, percentage: Math.round(v)})},
  cover: {v: s => s.attributes.current_position ?? 0, r: () => [0, 100, 1], u: '%', set: (h, id, v) => h.callService('cover', 'set_cover_position', {entity_id: id, position: v})},
  media_player: {v: s => Math.round((s.attributes.volume_level ?? 0) * 100), r: () => [0, 100, 1], u: '%', set: (h, id, v) => h.callService('media_player', 'volume_set', {entity_id: id, volume_level: v / 100})},
  climate: {v: s => s.attributes.temperature ?? 0, r: a => [a.min_temp ?? 7, a.max_temp ?? 35, a.target_temp_step ?? .5], u: '°', set: (h, id, v) => h.callService('climate', 'set_temperature', {entity_id: id, temperature: v})},
  water_heater: {v: s => s.attributes.temperature ?? 0, r: a => [a.min_temp ?? 30, a.max_temp ?? 70, a.target_temp_step ?? 1], u: '°', set: (h, id, v) => h.callService('water_heater', 'set_temperature', {entity_id: id, temperature: v})},
};
