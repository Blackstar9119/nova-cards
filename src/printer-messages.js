// Nova 3D-Drucker Card – Meldungen der Bambu-Lab-Integration zentral an einer Stelle.
// Neue Meldung ergänzen: Schlüssel in MSG anlegen (Text, Icon, Stufe, Animation) und dann
//  – Druckphase (stg_cur):        in STAGES eintragen
//  – HMS-/Druckfehler-Code:        in CODES eintragen (ganzer Code oder Anfang, z. B. '0700' = alle AMS-Codes von AMS A)
//  – Meldungstext (ohne Code):     in WORDS ein Suchmuster ergänzen (Deutsch und Englisch)
// Unbekannte Meldungen bekommen die allgemeine Warnung „warn“ mit dem Text der Integration.

// fx = Animation in der Druckerzeichnung (Klasse m-<fx>), lvl = info | warning | error.
// Die Stufe der Druckphasen ist „info“ (läuft normal), außer bei pausierten Phasen.
export const MSG = {
  heat: {label: 'Aufheizen', icon: 'mdi:fire', lvl: 'info', text: 'Heizt auf', fx: 'heat'},
  cool: {label: 'Abkühlen', icon: 'mdi:snowflake-thermometer', lvl: 'info', text: 'Kühlt ab', fx: 'cool'},
  level: {label: 'Bett leveln', icon: 'mdi:grid', lvl: 'info', text: 'Bett wird vermessen', fx: 'level'},
  wipe: {label: 'Düse reinigen / wischen', icon: 'mdi:broom', lvl: 'info', text: 'Düse wird gereinigt', fx: 'wipe'},
  calib: {label: 'Kalibrieren (Extrusion, Flow, Genauigkeit)', icon: 'mdi:tune-vertical', lvl: 'info', text: 'Kalibriert', fx: 'calib'},
  scan: {label: 'Prüfen / Scannen (Erste Schicht, Druckplatte, Kamera)', icon: 'mdi:radar', lvl: 'info', text: 'Prüft', fx: 'scan'},
  home: {label: 'Referenzfahrt / Achsen', icon: 'mdi:axis-arrow', lvl: 'info', text: 'Referenzfahrt', fx: 'home'},
  change: {label: 'Filament- und AMS-Wechsel', icon: 'mdi:swap-horizontal', lvl: 'info', text: 'Filament wird gewechselt', fx: 'change'},
  empty: {label: 'Filament leer', icon: 'mdi:printer-3d-nozzle-alert-outline', lvl: 'warning', text: 'Filament ist leer', fx: 'empty'},
  tangle: {label: 'Filament verheddert / klemmt', icon: 'mdi:printer-3d-nozzle-alert-outline', lvl: 'warning', text: 'Filament klemmt oder ist verheddert', fx: 'tangle'},
  ams: {label: 'AMS-Fehler', icon: 'mdi:tray-alert', lvl: 'warning', text: 'Problem mit dem AMS', fx: 'ams'},
  spaghetti: {label: 'Spaghetti / Erste Schicht fehlerhaft', icon: 'mdi:alert-octagon-outline', lvl: 'error', text: 'Spaghetti erkannt', fx: 'spaghetti'},
  shift: {label: 'Objekt verrutscht / Schritte verloren', icon: 'mdi:arrow-left-right-bold-outline', lvl: 'error', text: 'Objekt verrutscht', fx: 'shift'},
  clog: {label: 'Düse verstopft', icon: 'mdi:printer-3d-nozzle-alert', lvl: 'error', text: 'Düse verstopft', fx: 'clog'},
  door: {label: 'Tür offen', icon: 'mdi:door-open', lvl: 'warning', text: 'Tür ist offen', fx: 'door'},
  lid: {label: 'Deckel offen', icon: 'mdi:arrow-collapse-up', lvl: 'warning', text: 'Deckel ist offen', fx: 'lid'},
  fan: {label: 'Lüfterfehler', icon: 'mdi:fan-alert', lvl: 'error', text: 'Lüfter dreht nicht richtig', fx: 'fan'},
  temp: {label: 'Temperaturfehler', icon: 'mdi:thermometer-alert', lvl: 'error', text: 'Temperatur außerhalb des Bereichs', fx: 'temp'},
  warn: {label: 'Unbekannte Meldungen', icon: 'mdi:alert-outline', lvl: 'warning', text: 'Meldung vom Drucker', fx: 'warn'},
};

// Druckphasen (Sensor „Aktueller Arbeitsschritt“, stg_cur) → Meldung. Nicht gelistet = keine Animation (Text trotzdem sichtbar).
// p: true = Phase gehört zu einer Pause (Stufe Warnung bzw. Fehler)
export const STAGES = {
  heatbed_preheating: 'heat', heating_hotend: 'heat', waiting_for_heatbed_temperature: 'heat', heating_chamber: 'heat', preparing_hotend: 'heat',
  thermal_preconditioning: 'heat', checking_extruder_temperature: 'heat', waiting_chamber_temperature_equalize: 'heat', bed_level_high_temperature: 'level',
  cooling_chamber: 'cool', heated_bedcooling: 'cool', cooling_nozzle: 'cool',
  auto_bed_leveling: 'level', bed_level_phase_1: 'level', bed_level_phase_2: 'level', measuring_surface: 'level', scanning_bed_surface: 'scan',
  cleaning_nozzle_tip: 'wipe', moving_toolhead_above_purge_chute: 'wipe', pre_extrusion_before_printing: 'wipe',
  calibrating_extrusion: 'calib', calibrating_extrusion_flow: 'calib', print_calibration_lines: 'calib', calibrate_nozzle_offset: 'calib',
  absolute_accuracy_calibration: 'calib', check_absolute_accuracy_before_calibration: 'calib', check_absolute_accuracy_after_calibration: 'calib',
  calibrating_motor_noise: 'home', motor_noise_showoff: 'home', sweeping_xy_mech_mode: 'home', homing_toolhead: 'home', moving_toolhead_to_center_of_heatbed: 'home',
  calibrating_cutter_model_offset: 'calib', homing_blade_holder: 'home', calibrating_blade_holder_position: 'calib', hotend_pick_place_test: 'home',
  inspecting_first_layer: 'scan', identifying_build_plate_type: 'scan', calibrating_micro_lidar: 'scan', calibrating_live_view_camera: 'scan',
  calibrate_birdeye_camera: 'scan', check_birdeye_camera_position: 'scan', calibrating_camera_offset: 'scan', build_plate_alignment_detection: 'scan',
  heatbed_surface_foreign_object_detection: 'scan', heatbed_underside_foreign_object_detection: 'scan', check_plaform: 'scan', hotend_type_detection: 'scan',
  calibrating_detection_nozzle_clumping: 'scan', check_quick_release: 'scan', measuring_rotary_attachment: 'scan', laser_calibration: 'calib',
  changing_filament: 'change', filament_loading: 'change', filament_unloading: 'change', preparing_ams: 'change', check_material: 'change', check_material_position: 'change',
  check_door_and_cover: 'door',
  // Pausen mit Grund
  paused_filament_runout: ['empty', 1], paused_ams_lost: ['ams', 1], paused_skipped_step: ['shift', 1], paused_first_layer_error: ['spaghetti', 1],
  paused_nozzle_clog: ['clog', 1], paused_nozzle_filament_covered_detected: ['clog', 1], paused_low_fan_speed_heat_break: ['fan', 1],
  paused_nozzle_temperature_malfunction: ['temp', 1], paused_heat_bed_temperature_malfunction: ['temp', 1], paused_chamber_temperature_control_error: ['temp', 1],
  paused_front_cover_falling: ['warn', 1], paused_cutter_error: ['warn', 1],
};
// Phasen, die nur „pausiert“ bedeuten (vom Nutzer oder per G-Code)
export const PAUSE_STAGES = ['paused_user', 'paused_user_gcode', 'm400_pause'];
// Phasen ohne eigenen Hinweis (normaler Druck bzw. kein Auftrag)
export const QUIET_STAGES = ['printing', 'idle', 'offline', 'unknown', 'active_arc_fitting', 'purifying_chamber_air'];

// HMS- und Druckfehler-Codes → Meldung. Schlüssel ohne „HMS_“ in Großbuchstaben mit „_“, z. B. '0300_0100_0001_0001'.
// Ein kürzerer Schlüssel gilt für alle Codes, die so beginnen. Der längste passende Schlüssel gewinnt.
// Bambu-Lab-Module: 0300 Bewegung/Heizung, 0500 Hauptplatine, 07xx AMS (xx = Einheit), 0C00 Kamera/KI, 12xx AMS lite, 18xx AMS HT.
// Passt kein Code, entscheidet der Text (WORDS).
export const CODES = {
  '0700': 'ams', '0701': 'ams', '0702': 'ams', '0703': 'ams', '1200': 'ams', '1201': 'ams', '1800': 'ams', '1801': 'ams',
};

// Suchmuster im Meldungstext (Deutsch/Englisch), Reihenfolge = Vorrang. Gilt auch für AMS-Codes (z. B. „leer“ statt allgemeinem AMS-Fehler)
export const WORDS = [
  ['spaghetti', /spaghetti|first layer|erste[nr]? schicht|foreign object|fremdkörper|fremdobjekt/i],
  ['shift', /layer shift|verschoben|verrutscht|skipped step|schritte? (verloren|übersprungen)|step loss|position.*(lost|verloren)/i],
  ['clog', /clog|verstopf|nozzle.*(wrapped|covered|clump)|düse.*(umwickelt|bedeckt|verklumpt)|extrusion.*(abnormal|anomal)/i],
  ['empty', /run(s)? out|runout|aufgebraucht|ist leer|\bleer\b|no filament|kein filament/i],
  ['tangle', /tangl|verheddert|verwickelt|klemmt|feed.*(fail|resistance)|zuführ.*(fehl|widerstand)|fehler beim einziehen|failed to (feed|pull|extrude)/i],
  ['door', /\bdoor\b|\btür\b/i],
  ['lid', /\blid\b|top cover|deckel/i],
  ['fan', /\bfan\b|lüfter|luefter/i],
  ['temp', /temperat|thermistor|heater|heizung|overheat|überhitz/i],
  ['ams', /\bams\b/i],
  ['level', /level|nivellier/i],
  ['wipe', /purge|wipe|abstreif|nozzle.*clean|düse.*reinig/i],
  ['calib', /calibrat|kalibr/i],
  ['home', /homing|referenzfahrt/i],
];

// Code in Kurzform (0300_0100_0001_0001) aus Text oder Attribut, sonst null
const CRE = /(?:HMS_)?([0-9A-F]{4})[_-]?([0-9A-F]{4})(?:[_-]?([0-9A-F]{4})[_-]?([0-9A-F]{4}))?/i;
export const codeOf = v => {
  const m = String(v ?? '').match(CRE);
  return m ? [m[1], m[2], m[3], m[4]].filter(Boolean).join('_').toUpperCase() : null;
};

// Meldung (Schlüssel aus MSG) zu Code und Text
export function classify(code, text) {
  let hit = null;
  if (code) for (const k of Object.keys(CODES)) if (code.startsWith(k) && (!hit || k.length > hit.length)) hit = k;
  const w = text ? WORDS.find(([, re]) => re.test(text)) : null;
  // Text hat Vorrang vor groben Modul-Codes (z. B. AMS-Code mit „leer“ im Text)
  if (hit && (hit.length > 4 || !w)) return CODES[hit];
  return w ? w[0] : hit ? CODES[hit] : 'warn';
}

// Meldungen aus HMS- bzw. Druckfehler-Sensor: Attribute „1-Error“, „1-Code“, „1-Severity“ … oder „code“/„error“.
// Liefert [{key, text, code, lvl}]
export function parseErrors(s, lvl) {
  if (!s || !['on', 'problem'].includes(s.state)) return [];
  const a = s.attributes || {}, groups = {};
  for (const [k, v] of Object.entries(a)) {
    if (['friendly_name', 'device_class', 'icon', 'Count', 'count'].includes(k) || v == null || typeof v === 'object') continue;
    const m = k.match(/^(\d+)[-_ ](.+)$/), n = m ? m[1] : '0', f = (m ? m[2] : k).toLowerCase();
    (groups[n] ||= {})[f] = String(v);
  }
  const out = Object.values(groups).map(g => {
    const raw = g.error || g.message || g.text || g.description || g.desc || '';
    const code = codeOf(g.code || g.hms_code || g.error_code || raw);
    const text = raw.replace(/^\s*(?:HMS_)?[0-9A-F_-]{9,}\s*[:–-]?\s*/i, '').trim();
    const sev = String(g.severity || '').toLowerCase();
    const l = /fatal|serious|error/.test(sev) ? 'error' : /info|common|warn/.test(sev) ? 'warning' : lvl;
    return {key: classify(code, text), text, code, lvl: l};
  }).filter(x => x.text || x.code);
  return out.length ? out : [{key: 'warn', text: '', code: null, lvl}];
}
