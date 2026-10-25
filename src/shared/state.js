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
// Sichtbare Entitäten einer Area (ohne versteckte und Konfig-/Diagnose-Entitäten), optional nur einer Domain
export const areaEntities = (h, area, d) => !area || !h?.entities ? [] : Object.keys(h.entities).filter(id => {
  const e = h.entities[id];
  return (!d || dom(id) === d) && !!h.states[id] && !e.hidden && !e.entity_category && areaOf(h, id) === area;
});
// Messwert-Sensor einer Area: der in der Area hinterlegte (temperature_entity_id / humidity_entity_id), sonst der erste passende
export const areaSensor = (h, area, dc) => {
  const id = h?.areas?.[area]?.[`${dc}_entity_id`];
  return id && h.states[id] ? id : areaEntities(h, area, 'sensor').find(x => h.states[x].attributes.device_class === dc) || null;
};
// supported_features prüfen
export const hasF = (s, f) => ((s?.attributes.supported_features || 0) & f) === f;

export function valueOf(h, s, o) {
  if (!s) return '–';
  if ((o.decimals != null || o.unit != null) && NUMRE.test(s.state)) {
    const n = o.decimals != null ? (+s.state).toFixed(o.decimals) : s.state;
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
