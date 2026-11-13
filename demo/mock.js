import {novaSubscribe, novaCall} from './nova-mock.js';
/* Nova Demo – Testdaten statt Home Assistant. Liefert ein hass-Objekt mit festen Zuständen und die Liste der Demo-Karten.
   Gehört nicht zu nova-cards.js; wird nur von demo/index.html geladen (Vorschau aller Karten in allen Themes, Bildvergleich). */
const S = (id, state, attributes = {}) => ({entity_id: id, state, attributes: {friendly_name: attributes.friendly_name || id.split('.')[1].replace(/_/g, ' ').replace(/^./, c => c.toUpperCase()), ...attributes},
  last_changed: '2026-11-11T08:00:00Z', last_updated: '2026-11-11T08:00:00Z', context: {id: '1'}});
const list = [
  S('light.wohnzimmer_decke', 'on', {friendly_name: 'Decke', brightness: 204, color_mode: 'color_temp', color_temp_kelvin: 3000, min_color_temp_kelvin: 2200, max_color_temp_kelvin: 6500, supported_color_modes: ['color_temp', 'hs'], rgb_color: [255, 190, 120], area: 'wohnzimmer'}),
  S('light.wohnzimmer_stehlampe', 'on', {friendly_name: 'Stehlampe', brightness: 128, color_mode: 'hs', hs_color: [210, 80], rgb_color: [61, 139, 245], supported_color_modes: ['hs']}),
  S('light.wohnzimmer_sofa', 'off', {friendly_name: 'Sofa', supported_color_modes: ['brightness']}),
  S('light.wohnzimmer_regal', 'off', {friendly_name: 'Regal', supported_color_modes: ['onoff']}),
  S('switch.kaffeemaschine', 'on', {friendly_name: 'Kaffeemaschine'}),
  S('sensor.wohnzimmer_temperatur', '21.9', {friendly_name: 'Temperatur', unit_of_measurement: '°C', device_class: 'temperature'}),
  S('sensor.wohnzimmer_luftfeuchte', '48', {friendly_name: 'Luftfeuchte', unit_of_measurement: '%', device_class: 'humidity'}),
  S('binary_sensor.fenster', 'on', {friendly_name: 'Fenster', device_class: 'window'}),
  S('climate.wohnzimmer', 'heat', {friendly_name: 'Heizung', temperature: 22, current_temperature: 21.4, current_humidity: 48, hvac_modes: ['off', 'heat', 'auto'], hvac_action: 'heating', min_temp: 5, max_temp: 30, target_temp_step: 0.5, preset_modes: ['comfort', 'eco'], preset_mode: 'comfort', supported_features: 17}),
  S('media_player.wohnzimmer', 'playing', {friendly_name: 'Wohnzimmer', media_title: 'Nachtfahrt', media_artist: 'Nova Ensemble', media_album_name: 'Blaue Stunde', volume_level: 0.4, is_volume_muted: false, media_duration: 240, media_position: 60, media_position_updated_at: '2026-11-11T08:00:00Z', source: 'Spotify', source_list: ['Spotify', 'Radio'], supported_features: 152463}),
  S('vacuum.robi', 'cleaning', {friendly_name: 'Robi', battery_level: 76, fan_speed: 'standard', fan_speed_list: ['quiet', 'standard', 'turbo'], supported_features: 14204}),
  S('sensor.robi_batterie', '76', {unit_of_measurement: '%', device_class: 'battery'}),
  S('camera.einfahrt', 'idle', {friendly_name: 'Einfahrt'}),
  S('weather.forecast_home', 'partlycloudy', {friendly_name: 'Zuhause', temperature: 12.3, temperature_unit: '°C', humidity: 71, wind_speed: 14, wind_speed_unit: 'km/h', wind_bearing: 230, pressure: 1014, pressure_unit: 'hPa', supported_features: 3}),
  S('calendar.abfall', 'off', {friendly_name: 'Abfall', message: 'Restmüll', start_time: '2026-11-12 00:00:00', end_time: '2026-11-13 00:00:00', all_day: true}),
  S('todo.einkauf', '3', {friendly_name: 'Einkauf', supported_features: 15}),
  S('todo.notizen', '1', {friendly_name: 'Notizen', supported_features: 15}),
  S('timer.kueche', 'active', {friendly_name: 'Küche', duration: '0:10:00', remaining: '0:06:30', finishes_at: '2026-11-11T08:06:30Z'}),
  S('sun.sun', 'above_horizon', {elevation: 24, azimuth: 160, next_rising: '2026-11-12T06:30:00Z', next_setting: '2026-11-11T16:00:00Z'}),
  S('sensor.waschmaschine_status', 'run', {friendly_name: 'Waschmaschine'}),
  S('sensor.waschmaschine_fortschritt', '62', {unit_of_measurement: '%'}),
  S('sensor.waschmaschine_rest', '34', {unit_of_measurement: 'min', device_class: 'duration'}),
  S('remote.fernseher', 'on', {friendly_name: 'Fernseher', current_activity: 'Netflix'}),
  S('script.drucken', 'off', {friendly_name: 'Drucken'}),
  S('scene.filmabend', '2026-11-10T20:00:00Z', {friendly_name: 'Filmabend'}),
];
const states = Object.fromEntries(list.map(s => [s.entity_id, s]));
const forecast = type => ({type, forecast: Array.from({length: type === 'hourly' ? 12 : 6}, (_, i) => ({
  datetime: new Date(Date.UTC(2026, 10, 11, 9) + i * (type === 'hourly' ? 3600e3 : 864e5)).toISOString(),
  condition: ['partlycloudy', 'sunny', 'rainy', 'cloudy', 'pouring', 'clear-night'][i % 6], temperature: 12 + (i * 3) % 7, templow: 4 + i % 4, precipitation: i % 3, precipitation_probability: (i * 17) % 90, wind_speed: 10 + i}))});
const todo = [{uid: '1', summary: 'Hafermilch', status: 'needs_action'}, {uid: '2', summary: 'Kaffeebohnen', status: 'needs_action'}, {uid: '3', summary: 'Zitronen', status: 'needs_action'}, {uid: '4', summary: 'Brot', status: 'completed'}];
const events = [{start: {date: '2026-11-12'}, end: {date: '2026-11-13'}, summary: 'Restmüll'}, {start: {date: '2026-11-14'}, end: {date: '2026-11-15'}, summary: 'Biotonne'},
  {start: {date: '2026-11-18'}, end: {date: '2026-11-19'}, summary: 'Papier'}, {start: {date: '2026-11-25'}, end: {date: '2026-11-26'}, summary: 'Gelber Sack'}];

export const hass = {
  states, language: 'de', locale: {language: 'de', number_format: 'decimal_comma', time_format: '24', date_format: 'DMY', first_weekday: 'monday'},
  config: {time_zone: 'Europe/Berlin', unit_system: {temperature: '°C', length: 'km', wind_speed: 'km/h'}, components: [], language: 'de'},
  user: {id: 'u1', name: 'Demo', is_admin: true}, themes: {darkMode: true, themes: {}},
  areas: {wohnzimmer: {area_id: 'wohnzimmer', name: 'Wohnzimmer', icon: 'mdi:sofa'}},
  devices: {}, floors: {},
  entities: Object.fromEntries(list.map(s => [s.entity_id, {entity_id: s.entity_id, area_id: /wohnzimmer/.test(s.entity_id) ? 'wohnzimmer' : null, device_id: null, platform: 'demo', labels: []}])),
  services: {light: {turn_on: {}, turn_off: {}, toggle: {}}, vacuum: {start: {}, pause: {}, return_to_base: {}}},
  localize: k => k.split('.').pop(), formatEntityState: s => s.state, formatEntityAttributeValue: (s, a) => String(s.attributes[a] ?? ''),
  formatEntityAttributeName: (s, a) => a, hassUrl: p => window.__novaImages?.[p.split('/').pop()] || p, callService: async () => ({response: {'todo.einkauf': {items: todo}, 'todo.notizen': {items: todo.slice(0, 1)}}}),
  callApi: async (m, p) => /calendars/.test(p) ? events : [],
  callWS: async m => m.type.startsWith('nova/') ? novaCall(m) : m.type === 'todo/item/list' ? {items: todo} : m.type === 'lovelace/config' ? {views: []} : m.type === 'config/auth/list' ? [] : m.type === 'history/history_during_period'
    ? Object.fromEntries((m.entity_ids || []).map(id => [id, Array.from({length: 24}, (_, i) => ({s: String(20 + Math.sin(i / 3) * 1.5), lu: 1762848000 + i * 3600}))])) : {},
  connection: {subscribeMessage: async (cb, m) => { if (m.type.startsWith('nova/')) return novaSubscribe(cb, m); if (m.type === 'weather/subscribe_forecast') cb(forecast(m.forecast_type)); if (m.type === 'todo/item/subscribe') cb({items: todo}); return () => {}; },
    subscribeEvents: async () => () => {}, sendMessagePromise: async () => ({})},
};

// Demo-Karten: [Kartentyp ohne Präfix, Konfiguration (null = Vorschlag der Karte), Breite in px]
const dev = t => ['washer', 'dishwasher', 'airfryer', 'coffee', 'feeder', 'fountain', 'generic', 'dryer'].map(d => ['geraet-card', {device_type: d, entity: 'sensor.waschmaschine_status', progress: 'sensor.waschmaschine_fortschritt', name: d, ...t}]);
export const cards = [
  ['room-card', null], ['room-card', {name: 'Wohnzimmer', icon: 'mdi:sofa', temperature: 'sensor.wohnzimmer_temperatur', humidity: 'sensor.wohnzimmer_luftfeuchte', buttons: [{entity: 'light.wohnzimmer_decke'}, {entity: 'light.wohnzimmer_sofa'}, {entity: 'switch.kaffeemaschine'}]}],
  ['thermostat-card', null], ['thermostat-card', {entity: 'climate.wohnzimmer', compact: false}],
  ['light-card', null], ['light-card', {entity: 'light.wohnzimmer_stehlampe'}],
  ['navi-card', null, 900],
  ['modular-card', null], ['camera-card', null], ['media-card', null], ['vacuum-card', null], ['waste-card', null], ['weather-card', null],
  ['popup-card', null, 900], ['area-card', null, 900],
  // Bereich mit Farbton, vielen Chips, Unterkarten und fremden Karten (demo-ha-card ahmt eine HA-Karte nach, error = Fehlerkarte)
  ...[[900, 'accent-4'], [900, 'accent-1'], [900, 'accent-2'], [460, 'accent-3']].map(([w, tint]) => ['area-card', {area: 'wohnzimmer', tint, chips: [
    {entity: 'sensor.wohnzimmer_temperatur'}, {entity: 'sensor.wohnzimmer_luftfeuchte'}, {entity: 'light.wohnzimmer_decke', name: 'Decke'},
    {type: 'button', preset: 'lights_off'}, {type: 'button', name: 'Gemütlich', icon: 'mdi:sofa', tap_action: {action: 'none'}}],
  rows: [{cells: [{card: {type: 'custom:nova-light-card', area: 'wohnzimmer'}}, {card: {type: 'custom:nova-thermostat-card', entity: 'climate.wohnzimmer'}}]},
    {cells: [{card: {type: 'demo-ha-card', title: 'Nova Demo Energie', text: '1.234,50 kWh'}}, {card: {type: 'demo-ha-card', title: 'Konfigurationsfehler', error: true}}]}]}, w]), ['swipe-card', null], ['chips-card', null],
  ...dev({}),
  ...['print', 'heat', 'pause', 'done', 'error', 'off'].map(d => ['drucker-card', {demo: d}]), ['drucker-card', {demo: 'print', demo_ams: false}],
  ['remote-card', null], ['timer-card', null],
  ...['default', 'flip', 'analog', 'glow', 'retro'].map(s => ['clock-card', {style: s}]),
  ['shopping-card', null], ['note-card', null], ['note-card', {view: 'compact', max_notes: 2}], ['recipe-card', null], ['recipe-card', {view: 'grid'}], ['recipe-book-card', {start_open: true, subtitle: 'von Oma Erna'}], ['recipe-book-card', {style: 'modern', cover_color: 'blue', start_open: true}], ['recipe-book-card', {style: 'fantasy', subtitle: 'Tränke & Speisen', start_open: true}],
  ...['button', 'chip', 'dropdown'].map(d => ['theme-card', {display: d}]),
];
