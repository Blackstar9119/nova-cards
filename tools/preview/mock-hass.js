// Gefaktes hass-Objekt für die lokale Kartenvorschau – keine Verbindung zu Home Assistant nötig.
const now = Date.now();
const iso = ms => new Date(ms).toISOString();

const st = (state, attributes = {}) => ({state, attributes, last_changed: iso(now - 3600e3), last_updated: iso(now - 600e3), context: {}});
const fc = (n, step, mk) => Array.from({length: n}, (_, i) => mk(i, new Date(now + i * step).toISOString()));
const COND = ['sunny', 'partlycloudy', 'cloudy', 'rainy', 'partlycloudy', 'sunny', 'cloudy'];

export const baseStates = () => ({
  'light.wohnzimmer_decke': st('on', {friendly_name: 'Deckenlicht', brightness: 200, color_mode: 'color_temp', supported_color_modes: ['color_temp', 'xy'], min_color_temp_kelvin: 2000, max_color_temp_kelvin: 6500, color_temp_kelvin: 2700, rgb_color: [255, 197, 110], supported_features: 40}),
  'light.stehlampe': st('on', {friendly_name: 'Stehlampe', brightness: 120, color_mode: 'xy', supported_color_modes: ['xy'], rgb_color: [120, 160, 255], hs_color: [220, 53], supported_features: 40}),
  'light.sofa': st('off', {friendly_name: 'Sofa', supported_color_modes: ['brightness'], supported_features: 40}),
  'light.fernseher': st('on', {friendly_name: 'Fernseher-Ambilight', brightness: 255, color_mode: 'xy', supported_color_modes: ['xy'], rgb_color: [200, 90, 255], hs_color: [280, 65], supported_features: 40}),
  'climate.wohnzimmer': st('heat', {friendly_name: 'Wohnzimmer', current_temperature: 21.4, temperature: 22, target_temp_step: 0.5, min_temp: 5, max_temp: 30, hvac_modes: ['off', 'heat', 'auto'], hvac_action: 'heating', current_humidity: 46, supported_features: 1}),
  'sensor.wohnzimmer_temperatur': st('21.4', {friendly_name: 'Wohnzimmer Temperatur', device_class: 'temperature', unit_of_measurement: '°C'}),
  'sensor.wohnzimmer_luftfeuchte': st('46', {friendly_name: 'Wohnzimmer Luftfeuchte', device_class: 'humidity', unit_of_measurement: '%'}),
  'binary_sensor.fenster_wohnzimmer': st('on', {friendly_name: 'Fenster Wohnzimmer', device_class: 'window'}),
  'weather.zuhause': st('partlycloudy', {friendly_name: 'Zuhause', temperature: 17.6, apparent_temperature: 16.1, humidity: 62, pressure: 1016, wind_speed: 14, wind_bearing: 240, uv_index: 3, temperature_unit: '°C', wind_speed_unit: 'km/h', pressure_unit: 'hPa', precipitation_unit: 'mm', supported_features: 7}),
  'media_player.wohnzimmer': st('playing', {friendly_name: 'Wohnzimmer', media_title: 'Midnight City', media_artist: 'M83', media_album_name: "Hurry Up, We're Dreaming", media_duration: 244, media_position: 96, media_position_updated_at: iso(now), volume_level: 0.35, is_volume_muted: false, source: 'Spotify', source_list: ['Spotify', 'HDMI 1', 'Netflix'], app_name: 'Spotify', entity_picture: '/tools/preview/assets/cover.svg', supported_features: 152461}),
  'media_player.kueche': st('paused', {friendly_name: 'Küche', media_title: 'Tagesschau', volume_level: 0.2, supported_features: 152461}),
  'remote.tv': st('on', {friendly_name: 'Fernseher', current_activity: 'Netflix', supported_features: 4}),
  'camera.eingang': st('streaming', {friendly_name: 'Eingang', entity_picture: '/tools/preview/assets/camera.svg', supported_features: 0}),
  'switch.kaffee': st('on', {friendly_name: 'Kaffeemaschine'}),
  'calendar.muell': st('off', {friendly_name: 'Müllkalender'}),
  'timer.kueche': st('idle', {friendly_name: 'Küchentimer', duration: '0:05:00'}),
  'todo.einkauf': st('4', {friendly_name: 'Einkauf'}),
  'todo.notizen': st('0', {friendly_name: 'Notizen'}),
  'script.einkauf_drucken': st('off', {friendly_name: 'Einkauf drucken'}),
  'script.notiz_drucken': st('off', {friendly_name: 'Notiz drucken'}),
  // Saugroboter
  'vacuum.robbi': st('cleaning', {friendly_name: 'Robbi', battery_level: 72, fan_speed: 'Standard', fan_speed_list: ['Leise', 'Standard', 'Turbo', 'Max'], supported_features: 12924}),
  'sensor.robbi_akku': st('72', {friendly_name: 'Robbi Akku', device_class: 'battery', unit_of_measurement: '%'}),
  'sensor.robbi_status': st('Saugt Küche', {friendly_name: 'Robbi Status'}),
  'image.robbi_karte': st('2026-01-01T00:00:00', {friendly_name: 'Robbi Karte', entity_picture: '/tools/preview/assets/map.svg'}),
  'input_boolean.raum_kueche': st('on', {friendly_name: 'Küche'}),
  'input_boolean.raum_wohnzimmer': st('off', {friendly_name: 'Wohnzimmer'}),
  'input_boolean.raum_bad': st('off', {friendly_name: 'Bad'}),
  // Geräte
  'sensor.spuelmaschine_status': st('run', {friendly_name: 'Spülmaschine Status', options: ['ready', 'run', 'finished']}),
  'sensor.spuelmaschine_fortschritt': st('62', {friendly_name: 'Fortschritt', unit_of_measurement: '%'}),
  'sensor.spuelmaschine_restzeit': st('48', {friendly_name: 'Restzeit', unit_of_measurement: 'min', device_class: 'duration'}),
  'sensor.futter_status': st('run', {friendly_name: 'Futterautomat Status'}),
  'sensor.futter_fuellstand': st('68', {friendly_name: 'Futter Füllstand', unit_of_measurement: '%'}),
  'sensor.brunnen_status': st('run', {friendly_name: 'Trinkbrunnen Status'}),
  'sensor.brunnen_wasserstand': st('80', {friendly_name: 'Wasserstand', unit_of_measurement: '%'}),
});

export const baseEntities = () => ({
  'vacuum.robbi': {entity_id: 'vacuum.robbi', platform: 'roborock', device_id: 'dev_robbi'},
  'sensor.robbi_akku': {entity_id: 'sensor.robbi_akku', platform: 'roborock', device_id: 'dev_robbi'},
  'light.wohnzimmer_decke': {entity_id: 'light.wohnzimmer_decke', platform: 'hue', area_id: 'wohnzimmer'},
  'light.stehlampe': {entity_id: 'light.stehlampe', platform: 'hue', area_id: 'wohnzimmer'},
  'light.sofa': {entity_id: 'light.sofa', platform: 'hue', area_id: 'wohnzimmer'},
  'light.fernseher': {entity_id: 'light.fernseher', platform: 'hue', area_id: 'wohnzimmer'},
  'sensor.wohnzimmer_temperatur': {entity_id: 'sensor.wohnzimmer_temperatur', platform: 'zha', area_id: 'wohnzimmer'},
  'remote.tv': {entity_id: 'remote.tv', platform: 'androidtv_remote'},
});

const calEvents = () => {
  const d = n => { const t = new Date(); t.setDate(t.getDate() + n); return t.toISOString().slice(0, 10); };
  const ev = (n, summary) => ({summary, start: {date: d(n)}, end: {date: d(n + 1)}});
  return [ev(0, 'Restmüll'), ev(2, 'Gelber Sack'), ev(4, 'Papier (PPK)'), ev(7, 'Biotonne'), ev(9, 'Restmüll'), ev(13, 'Gelber Sack')];
};

// overrides: {entity_id: {state, attributes}} werden über die Basis gelegt
export function makeHass(overrides = {}) {
  const states = baseStates();
  for (const [id, o] of Object.entries(overrides)) states[id] = {...(states[id] || st('unknown')), ...o, attributes: {...(states[id]?.attributes || {}), ...(o.attributes || {})}};
  const forecast = type => type === 'hourly'
    ? fc(24, 3600e3, (i, datetime) => ({datetime, condition: i > 14 ? 'rainy' : COND[Math.floor(i / 4) % COND.length], temperature: Math.round(14 + 5 * Math.sin((i - 6) / 24 * 2 * Math.PI)), precipitation_probability: i > 14 ? 60 : 5}))
    : fc(7, 86400e3, (i, datetime) => ({datetime, condition: COND[i % COND.length], temperature: 19 - (i % 3), templow: 10 + (i % 2), precipitation: i % 3 === 0 ? 1.4 : 0}));
  return {
    states,
    entities: baseEntities(),
    devices: {dev_robbi: {id: 'dev_robbi', name: 'Robbi', area_id: 'wohnzimmer'}},
    areas: {wohnzimmer: {area_id: 'wohnzimmer', name: 'Wohnzimmer', icon: 'mdi:sofa'}},
    user: {id: 'u1', name: 'Demo', is_admin: true},
    language: 'de',
    locale: {language: 'de', number_format: 'comma_decimal', time_format: '24', time_zone: 'local', date_format: 'language', first_weekday: 'monday'},
    config: {unit_system: {temperature: '°C', length: 'km'}, time_zone: Intl.DateTimeFormat().resolvedOptions().timeZone, language: 'de'},
    themes: {darkMode: true, theme: 'default'},
    selectedTheme: null,
    panelUrl: 'lovelace',
    localize: k => k,
    callService: async () => {},
    callWS: async () => null,
    callApi: async (_m, path) => path.startsWith('calendars/') ? calEvents() : path.startsWith('history/') ? [[...Array.from({length: 24}, (_, i) => ({last_changed: iso(now - (24 - i) * 3600e3), state: String(20 + Math.sin(i / 3)).slice(0, 5)}))]] : [],
    connection: {subscribeMessage: async (cb, msg) => { setTimeout(() => cb({forecast: forecast(msg.forecast_type)}), 0); return () => {}; }},
  };
}
