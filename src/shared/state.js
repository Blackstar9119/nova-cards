import {dom, list, NUMRE} from './utils.js';

const OFF = new Set(['off', 'unavailable', 'unknown', 'idle', 'docked', 'standby', 'closed', 'paused', 'not_home', 'none', 'ready']);
export const isOn = s => !!s && !OFF.has(s.state);

export const DICON = {light: 'mdi:lightbulb', switch: 'mdi:power-socket-eu', fan: 'mdi:fan', input_boolean: 'mdi:toggle-switch-outline', button: 'mdi:gesture-tap-button', input_button: 'mdi:gesture-tap-button', script: 'mdi:script-text-outline', scene: 'mdi:palette', automation: 'mdi:robot', climate: 'mdi:thermostat', cover: 'mdi:window-shutter', media_player: 'mdi:speaker', number: 'mdi:ray-vertex', input_number: 'mdi:ray-vertex', select: 'mdi:format-list-bulleted', binary_sensor: 'mdi:checkbox-blank-circle-outline', sensor: 'mdi:eye'};
export const TOGGLE = ['light', 'switch', 'input_boolean', 'fan', 'cover', 'group', 'siren', 'humidifier', 'automation', 'media_player', 'valve'];
export const PRESS = {button: ['button', 'press'], input_button: ['input_button', 'press'], script: ['script', 'turn_on'], scene: ['scene', 'turn_on']};

export const fmtState = (h, s) => { try { return h.formatEntityState ? h.formatEntityState(s) : s.state + (s.attributes.unit_of_measurement ? ' ' + s.attributes.unit_of_measurement : ''); } catch { return s.state; } };
export const unitJoin = (v, u) => !u ? `${v}` : u.startsWith('°') ? `${v}${u}` : `${v} ${u}`;
export const decOf = st => (String(st).split('.')[1] || '').length;
export const nameOf = (h, o) => o.name ?? h.states[o.entity]?.attributes.friendly_name ?? o.entity ?? '';
export const iconOf = (h, o, fb) => o.icon || h.states[o.entity]?.attributes.icon || DICON[dom(o.entity)] || fb;
// Sprache und Zeitzone wie im HA-Profil: „Server“ = Zeitzone von HA, sonst die des Browsers
export const langOf = h => h.locale?.language || h.language || 'de';
export const tzOf = h => h.locale?.time_zone === 'server' ? h.config?.time_zone : undefined;
// Bereich einer Entität (direkt oder über ihr Gerät)
export const areaOf = (h, id) => { const e = h.entities?.[id]; return (e && (e.area_id || h.devices?.[e.device_id]?.area_id)) || null; };
// supported_features prüfen
export const hasF = (s, f) => ((s?.attributes.supported_features || 0) & f) === f;

// Zahl mit fester Anzahl Nachkommastellen im Zahlenformat des HA-Profils (z. B. 21,9 statt 21.9)
const NUM_LOCALE = {comma_decimal: 'en-US', decimal_comma: 'de', space_comma: 'fr', system: undefined};
export const fmtNum = (h, v, d) => {
  const f = h?.locale?.number_format;
  if (f === 'none') return v.toFixed(d);
  const loc = f && f in NUM_LOCALE ? NUM_LOCALE[f] : h?.locale?.language || h?.language;
  try { return new Intl.NumberFormat(loc, {minimumFractionDigits: d, maximumFractionDigits: d}).format(v); } catch { return v.toFixed(d); }
};

// Einheit anhängen wie HA: kein Leerzeichen bei „°“ allein, bei „%“ je nach Sprache, sonst immer (21,9 °C, 62 %)
const PCT_BLANK = ['cs', 'de', 'fi', 'fr', 'sk', 'sv'];
export const haUnitJoin = (h, v, u) => {
  if (!u) return `${v}`;
  if (u === '°') return `${v}${u}`;
  if (u === '%') return PCT_BLANK.includes(String(h?.locale?.language || h?.language || '').split('-')[0]) ? `${v} %` : `${v}%`;
  return `${v} ${u}`;
};

export function valueOf(h, s, o) {
  if (!s) return '–';
  if ((o.decimals != null || o.unit != null) && NUMRE.test(s.state)) {
    const n = o.decimals != null ? fmtNum(h, +s.state, +o.decimals) : s.state;
    return o.decimals != null ? haUnitJoin(h, n, o.unit ?? s.attributes.unit_of_measurement) : unitJoin(n, o.unit ?? s.attributes.unit_of_measurement);
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
