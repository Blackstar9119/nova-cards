import {define, docUrl, tag} from './shared/define.js';
import {esc, dom, setIcon, list, NUMRE, toObj, stamp, mapIcon} from './shared/utils.js';
import {isOn, TOGGLE, fmtState, nameOf, iconOf, valueOf, hasF} from './shared/state.js';
import {moreInfo, runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {BLOCKS} from './modular.js';
import {NOVA_VARS, PANEL_CSS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {hassChanged, entityIds, inPicker} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, A, ENT, NUM, sel, NAMEICON, BASE_LABELS} from './shared/editor-schema.js';

/* ---------- Nova Saugroboter Card ---------- */
const VCSS = `
.g.vc.run{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-accent) 40%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.vc.run .hd .ic ha-icon{animation:nv-vc 2.4s ease-in-out infinite}
@keyframes nv-vc{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
.vc .hd small.er{color:var(--nv-error);opacity:1}
.erb .pill{background:color-mix(in srgb,var(--nv-error) 30%,transparent);border-color:color-mix(in srgb,var(--nv-error) 50%,transparent)}
.bat{display:inline-flex;align-items:center;gap:4px;padding:6px 10px;border-radius:999px;background:var(--nv-chip);font-size:12.5px;font-weight:600;flex:none}
.bat ha-icon{--mdc-icon-size:17px}
.bat.low{background:color-mix(in srgb,var(--nv-error) 30%,transparent)}
.bat.chg ha-icon{color:var(--nv-accent)}
.vc>.main{display:contents}.vc .hd{order:0}.vc .mpnl{order:1}.vc>.main>:not(.hd){order:2}
.mpnl{display:flex;flex-direction:column;gap:8px;min-width:0}
.mpnl .bt{margin:0}
.map{position:relative;border-radius:calc(var(--nv-radius) - 8px);overflow:hidden;background:rgba(0,0,0,.25)}
.map.ar{aspect-ratio:var(--ar)}.map{max-height:var(--nv-map-max,280px)}
.map img{display:block;width:100%;height:auto;max-height:var(--nv-map-max,280px);object-fit:contain}
.map.ar img{height:100%;object-fit:contain}
.ctl{display:flex;align-items:center;justify-content:center;gap:14px}
.ctl .cb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);transition:background-color .2s,color .2s,border-color .2s,box-shadow .2s,transform .2s,opacity .2s}
.ctl .cb ha-icon{--mdc-icon-size:24px}
.ctl .cb.pp{width:56px;height:56px;background:var(--nv-accent);color:var(--nv-accent-fg);border-color:transparent;box-shadow:0 0 16px color-mix(in srgb,var(--nv-accent) 45%,transparent)}
.ctl .cb.pp ha-icon{--mdc-icon-size:30px}
.cb:active{transform:scale(.9)}
.ctl.pl{justify-content:flex-start;gap:7px;flex-wrap:wrap}
.fs .pill,.ctl.pl .pill{flex:none}
.rooms .pill{background:color-mix(in srgb,var(--nv-active) 45%,transparent);border-color:color-mix(in srgb,var(--nv-active) 60%,transparent)}
.rooms .pill.on{background:var(--nv-active);box-shadow:0 0 14px color-mix(in srgb,var(--nv-active) 50%,transparent)}
.rooms .pill.go{order:99;background:var(--nv-accent);color:var(--nv-accent-fg);border-color:transparent;box-shadow:none}
.vc .sws .list{row-gap:2px}
.rooms .pill.cur{box-shadow:0 0 0 2px var(--nv-accent),0 0 14px color-mix(in srgb,var(--nv-accent) 50%,transparent)}
.hd .all{flex:none}
.hd .all.on{background:var(--nv-active);color:var(--nv-active-fg);border-color:transparent}
.cons .kv{flex-wrap:wrap;row-gap:4px}
.cons .kv .cbar{flex-basis:100%;height:4px;border-radius:2px;background:rgba(255,255,255,.12);overflow:hidden}
.cons .kv .cbar i{display:block;height:100%;background:var(--nv-active);border-radius:2px}
.cons .warn .cbar i{background:var(--nv-warn)}.cons .warn .v{color:var(--nv-warn);opacity:1}
.cons .pill.warn{background:color-mix(in srgb,var(--nv-warn) 25%,transparent)}
.vc.narrow .ctl{gap:8px}.vc.narrow .ctl .cb{width:38px;height:38px}.vc.narrow .ctl .cb.pp{width:48px;height:48px}
:host{height:auto;container-type:normal}.g.vc{height:auto}
.g.vc.side{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:14px;align-items:stretch}
.vc.side>.main{display:flex;flex-direction:column;gap:12px;min-width:0;padding:12px;border-radius:calc(var(--nv-radius) - 6px);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.vc.side .mpnl{padding:12px;border-radius:calc(var(--nv-radius) - 6px);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.vc.side .map{flex:1;min-height:var(--nova-vacuum-map-min-height,240px);max-height:none;aspect-ratio:auto}
.vc.side .map img{position:absolute;inset:0;width:100%;height:100%;max-height:none;object-fit:contain}
.g.vc.auto.wide{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:14px;align-items:stretch}
.vc.auto.wide>.main{display:flex;flex-direction:column;gap:12px;min-width:0;padding:12px;border-radius:calc(var(--nv-radius) - 6px);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.vc.auto.wide .mpnl{padding:12px;border-radius:calc(var(--nv-radius) - 6px);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.vc.auto.wide .map{flex:1;min-height:var(--nova-vacuum-map-min-height,240px);max-height:none;aspect-ratio:auto}
.vc.auto.wide .map img{position:absolute;inset:0;width:100%;height:100%;max-height:none;object-fit:contain}
.scene{--rc:var(--nova-vacuum-robot-color,#3d4452);--sc:var(--nova-vacuum-station-color,#2f3542);--wc:var(--nova-vacuum-water-color,#6fb6f2);
position:relative;order:0;height:var(--nova-vacuum-scene-height,100px)}
.scene svg{display:block;width:100%;height:100%;overflow:visible}
.scene .cap{position:absolute;left:0;top:0;padding:4px 10px;border-radius:999px;background:var(--nv-chip);font-size:11px;font-weight:500;letter-spacing:.02em;opacity:.85}
.scene .cap:empty{display:none}
.sc .floor{fill:currentColor;opacity:.1}
.sc .trail{fill:var(--wc);opacity:0;transform-box:fill-box;transform-origin:left center}
.sc .shd{fill:#000;opacity:.3}
.sc .body{fill:url(#vgr);stroke:rgba(255,255,255,.14);stroke-width:.6}.sc .top{fill:rgba(255,255,255,.1)}.sc .bump{fill:rgba(0,0,0,.35)}
.sc .lid{fill:color-mix(in srgb,var(--rc) 55%,#000);stroke:rgba(255,255,255,.12);stroke-width:.5}.sc .lidl{fill:rgba(255,255,255,.25)}
.sc .mop{fill:var(--wc);opacity:0;transition:opacity .4s}
.sc .br line{stroke:rgba(255,255,255,.35);stroke-width:1;stroke-linecap:round}
.sc .br{transform-box:fill-box;transform-origin:center}
.sc .led{fill:var(--nv-active);opacity:.9}
.sc .bolt{fill:none;stroke:var(--nv-accent);stroke-width:1;stroke-linejoin:round;opacity:0}
.sc .err{opacity:0}.sc .err circle{fill:none;stroke:var(--nv-error);stroke-width:1.2}.sc .err rect,.sc .err .dot{fill:var(--nv-error);stroke:none}
.sc .dust circle{fill:currentColor;opacity:0}
.sc .ramp{fill:color-mix(in srgb,var(--sc) 80%,#000)}.sc .tower{fill:url(#vgs);stroke:rgba(255,255,255,.12);stroke-width:.6}.sc .seam{fill:rgba(0,0,0,.35)}
.sc .sled{fill:var(--nv-active);opacity:.35}
.sc .tank{fill:rgba(0,0,0,.4)}.sc .tkc{fill:var(--wc)}.sc .tkd{fill:#9a7a52}.sc .tkc,.sc .tkd{transition:all .6s}
.sc .tkc.low,.sc .tkd.low{fill:var(--nv-error);animation:vc-blink 1.6s infinite}
.sc .parts circle{fill:#b8a993;opacity:0}
.sc .duct,.sc .pipe{fill:rgba(0,0,0,.35);transition:fill .4s}.sc.empty .duct{fill:rgba(184,169,147,.6)}
.sc .bin{fill:rgba(0,0,0,.3)}.sc .bag{fill:#b8a993;opacity:.35;transform-box:fill-box;transform-origin:center bottom;transition:opacity .4s}
.sc.empty .bag{opacity:.75;animation:vc-bag .6s ease-in-out infinite alternate}
.sc.wash .pipe{fill:color-mix(in srgb,var(--wc) 45%,transparent)}.sc.wash .pipe:last-of-type{fill:rgba(154,122,82,.55)}
.sc .water ellipse,.sc .water circle{fill:var(--wc);opacity:0;transform-box:fill-box;transform-origin:center}
.sc .bubl circle{fill:none;stroke:color-mix(in srgb,var(--wc) 60%,#fff);stroke-width:.5}
.sc .heat path{fill:none;stroke:color-mix(in srgb,var(--nv-accent) 70%,#fff);stroke-width:1;stroke-linecap:round;opacity:0}
.sc .rob{transform:translateX(110px);transition:transform 1.4s ease-in-out}
.sc.docked .rob{transform:translateX(240px)}
.sc.cleaning .rob{animation:vc-drive 16s ease-in-out infinite}
.sc.returning .rob{animation:vc-home 6s ease-in-out infinite}
.sc.cleaning .br,.sc.returning .br{animation:vc-spin .35s linear infinite}
.sc.cleaning:not(.mopping) .dust circle{animation:vc-dust 1.2s linear infinite}
.sc .dust circle:nth-child(2),.sc .parts circle:nth-child(2),.sc .water ellipse:nth-child(2),.sc .heat path:nth-child(2){animation-delay:.4s}
.sc .dust circle:nth-child(3),.sc .parts circle:nth-child(3),.sc .water ellipse:nth-child(3),.sc .heat path:nth-child(3){animation-delay:.8s}
.sc.paused .led{animation:vc-blink 1.6s infinite}
.sc.error .rb{transform:rotate(-3deg);transform-box:fill-box;transform-origin:center bottom}
.sc.error .err{opacity:1;animation:vc-blink 1.6s infinite}.sc.error .led{fill:var(--nv-error);animation:vc-blink 1.6s infinite}
.sc.mop .mop{opacity:.9}
.sc.cleaning.mopping .trail{animation:vc-trail 16s ease-in-out infinite}
.sc.chg .bolt{animation:vc-pulse 3s ease-in-out infinite}.sc.chg .led{animation:vc-pulse 3s ease-in-out infinite}
.sc.empty .parts circle{animation:vc-suck .9s cubic-bezier(.5,0,1,1) infinite}
.sc .parts circle:nth-child(4){animation-delay:.2s}.sc .parts circle:nth-child(5){animation-delay:.6s}
.sc .parts circle:nth-child(2){--dx:-8px}.sc .parts circle:nth-child(3){--dx:10px}.sc .parts circle:nth-child(4){--dx:-14px}.sc .parts circle:nth-child(5){--dx:14px}
.sc.empty .stn,.sc.empty .rb{animation:vc-jit .09s linear infinite}
.sc.wash .water ellipse{animation:vc-wave 1.4s ease-in-out infinite}
.sc.wash .drops circle{animation:vc-drop 1.1s ease-in infinite}
.sc .dirt circle{fill:#9a7a52;opacity:0}.sc.wash .dirt circle{animation:vc-rise 1.1s ease-in infinite}
.sc .dirt circle:nth-child(2){animation-delay:.35s}.sc .dirt circle:nth-child(3){animation-delay:.7s}
.sc.wash .bubl circle{animation:vc-bubl 2s ease-out infinite}
.sc.wash .spl circle{animation:vc-spl .9s ease-out infinite}
.sc.wash .mop{opacity:1;animation:vc-scrub .35s ease-in-out infinite alternate}
.sc .drops circle:nth-child(2),.sc .bubl circle:nth-child(2),.sc .spl circle:nth-child(2){animation-delay:.35s}
.sc .drops circle:nth-child(3),.sc .bubl circle:nth-child(3),.sc .spl circle:nth-child(3){animation-delay:.7s}
.sc.dry .heat path{animation:vc-heat 2.4s ease-in-out infinite}
.sc.empty .sled,.sc.wash .sled,.sc.dry .sled{opacity:1;animation:vc-pulse 2s ease-in-out infinite}
.sc.empty .sled{fill:#b8a993}.sc.wash .sled{fill:var(--wc)}.sc.dry .sled{fill:var(--nv-accent)}
.sc:not(.has-tanks) :is(.tank,.tkc,.tkd,.pipe,.drops,.dirt,.bubl),.sc:not(.has-bag) :is(.bin,.bag,.duct,.parts){display:none}
.scene.still *,.vc.still .hd .ic ha-icon{animation-play-state:paused!important}
/* Eigene Ebene nur für die Szene, solange sie läuft: WebKit malt dann nur die Szene neu, nicht die ganze Karte */
.scene:not(.still)>svg{will-change:transform}
@media (prefers-reduced-motion:reduce){.scene *{animation:none!important}}
@keyframes vc-drive{0%,100%{transform:translateX(20px)}45%,50%{transform:translateX(150px)}}
@keyframes vc-home{0%{transform:translateX(90px)}85%,100%{transform:translateX(240px)}}
@keyframes vc-spin{to{transform:rotate(360deg)}}
@keyframes vc-blink{50%{opacity:.25}}
@keyframes vc-pulse{0%,100%{opacity:.3}50%{opacity:.95}}
@keyframes vc-dust{0%{opacity:0;transform:translateX(0)}30%{opacity:.35}100%{opacity:0;transform:translateX(12px)}}
@keyframes vc-suck{0%{opacity:0;transform:translate(0,0)}15%{opacity:.95}80%{opacity:.8;transform:translate(0,-18px)}100%{opacity:0;transform:translate(var(--dx,4px),-22px)}}
@keyframes vc-bag{from{transform:scale(1,.9)}to{transform:scale(1.03,1.08)}}
@keyframes vc-rise{0%{opacity:0;transform:translateY(0)}15%{opacity:.9}100%{opacity:.3;transform:translateY(-38px)}}
@keyframes vc-jit{0%,100%{transform:translateX(0)}50%{transform:translateX(.35px)}}
@keyframes vc-drop{0%{opacity:0;transform:translateY(0)}15%{opacity:.95}100%{opacity:.3;transform:translateY(38px)}}
@keyframes vc-bubl{0%{opacity:0;transform:translateY(0)}20%{opacity:.9}100%{opacity:0;transform:translateY(-30px)}}
@keyframes vc-spl{0%{opacity:0;transform:translate(0,0)}30%{opacity:.9}100%{opacity:0;transform:translate(2px,-7px)}}
@keyframes vc-scrub{from{transform:translateX(-1.5px)}to{transform:translateX(1.5px)}}
@keyframes vc-wave{0%,100%{opacity:0;transform:scaleX(.4)}50%{opacity:.8;transform:scaleX(1)}}
@keyframes vc-heat{0%{opacity:0;transform:translateY(6px)}40%{opacity:.75}100%{opacity:0;transform:translateY(-16px)}}
@keyframes vc-trail{0%{transform:scaleX(.2);opacity:.4}45%,90%{transform:scaleX(.76);opacity:.4}100%{transform:scaleX(.2);opacity:0}}`;

// supported_features von vacuum
const VF = {PAUSE: 4, STOP: 8, RETURN: 16, FAN: 32, LOCATE: 512, SPOT: 1024, START: 8192, AREA: 16384};
const VDEF = {map_max_height: 280, scene: true, scene_auto: true, station_type: 'auto', layout: 'auto', controls: 'pills', battery_display: 'status', rooms_title: 'Raum reinigen', map_title: 'Karte', glow: true, show_stop: true, show_return: true, show_locate: true, show_spot: false, show_fan_speed: true, show_error_reset: true,
  map_aspect_ratio: 'auto', map_refresh: 5, map_action: 'more-info', segment_mode: 'roborock', segment_repeat: 1, consumables_layout: 'rows'};
const VRUN = ['cleaning', 'returning'];
// Steuer-Pillen: Schlüssel → [Icon, Text, Feature, Service]
const VCTL = {start: ['mdi:play', 'Start', 8192, 'start'], pause: ['mdi:pause', 'Pause', 4, 'pause'], stop: ['mdi:stop', 'Stopp', 8, 'stop'],
  home: ['mdi:home-import-outline', 'Zur Station', 16, 'return_to_base'], locate: ['mdi:map-marker-question-outline', 'Suchen', 512, 'locate'], spot: ['mdi:target-variant', 'Spot', 1024, 'clean_spot']};
const vtitle = t => t === '-' || t === '' || t === false ? '' : t;
const segId = x => NUMRE.test(x) ? +x : x;
// Saugstärke übersetzt (falls die Integration das kann), sonst smart_mode → Smart mode
const fanName = (h, s, x) => { try { const t = h.formatEntityAttributeValue?.(s, 'fan_speed', x); if (t && t !== x) return t; } catch {} const v = String(x).replace(/_/g, ' '); return v.charAt(0).toUpperCase() + v.slice(1); };
// Raumreinigung je Integration: [domain, service, data]
const SEG = {
  roborock: (id, s, n) => ['vacuum', 'send_command', {entity_id: id, command: 'app_segment_clean', params: [{segments: s.map(segId), repeat: n}]}],
  valetudo: (id, s, n) => ['vacuum', 'send_command', {entity_id: id, command: 'segment_cleanup', params: {segment_ids: s.map(String), iterations: n, customOrder: true}}],
  dreame: (id, s, n) => ['dreame_vacuum', 'vacuum_clean_segment', {entity_id: id, segments: s.map(segId), repeats: n}],
  xiaomi: (id, s) => ['xiaomi_miio', 'vacuum_clean_segment', {entity_id: id, segments: s.map(segId)}],
};
const batIcon = (v, chg) => {
  if (v == null || isNaN(v)) return 'mdi:battery-unknown';
  const t = Math.round(v / 10) * 10;
  if (chg) return t >= 100 ? 'mdi:battery-charging-100' : t < 10 ? 'mdi:battery-charging-outline' : `mdi:battery-charging-${t}`;
  return t >= 100 ? 'mdi:battery' : t < 10 ? 'mdi:battery-outline' : `mdi:battery-${t}`;
};
// Akku-Sensor am selben Gerät (battery_level-Attribut ist bei neueren HA-Versionen weg)
const batOf = (h, id) => {
  const dev = h.entities?.[id]?.device_id;
  if (!dev) return null;
  return Object.values(h.entities).find(e => e.device_id === dev && dom(e.entity_id) === 'sensor' && h.states[e.entity_id]?.attributes.device_class === 'battery')?.entity_id || null;
};

// Fehlercodes (Roborock: Sensor „Staubsauger-Fehler“ bzw. „Ladestation-Fehler“) → deutsche Meldung
const VERR = {
  lidar_blocked: 'Lasersensor blockiert', bumper_stuck: 'Stoßfänger klemmt', wheels_suspended: 'Räder hängen in der Luft',
  cliff_sensor_error: 'Absturzsensor verschmutzt', main_brush_jammed: 'Hauptbürste blockiert', side_brush_jammed: 'Seitenbürste blockiert',
  wheels_jammed: 'Räder blockiert', robot_trapped: 'Roboter steckt fest', no_dustbin: 'Staubbehälter fehlt', strainer_error: 'Filter verschmutzt oder nass',
  compass_error: 'Magnetfeld erkannt', low_battery: 'Akku fast leer', charging_error: 'Ladefehler', battery_error: 'Akkufehler',
  wall_sensor_dirty: 'Wandsensor verschmutzt', robot_tilted: 'Roboter steht schräg', side_brush_error: 'Seitenbürste defekt', fan_error: 'Gebläsefehler',
  dock: 'Problem mit der Station', optical_flow_sensor_dirt: 'Bodensensor verschmutzt', vertical_bumper_pressed: 'Oberer Stoßfänger gedrückt',
  dock_locator_error: 'Station nicht gefunden', return_to_dock_fail: 'Rückkehr zur Station fehlgeschlagen', nogo_zone_detected: 'In Sperrzone',
  visual_sensor: 'Kamera verschmutzt', light_touch: 'Wandsensor gestört', vibrarise_jammed: 'Wischmodul blockiert', robot_on_carpet: 'Roboter steht auf Teppich',
  filter_blocked: 'Filter verstopft', invisible_wall_detected: 'Unsichtbare Wand erkannt', cannot_cross_carpet: 'Kommt nicht über den Teppich',
  internal_error: 'Interner Fehler', collect_dust_error_3: 'Absaugen fehlgeschlagen', collect_dust_error_4: 'Absaugen fehlgeschlagen',
  mopping_roller_1: 'Wischrolle blockiert', mopping_roller_error_2: 'Wischrolle defekt', clear_water_box_hoare: 'Frischwassertank prüfen',
  dirty_water_box_hoare: 'Schmutzwassertank prüfen', sink_strainer_hoare: 'Sieb der Station reinigen', clear_water_box_exception: 'Frischwassertank fehlt oder leer',
  clear_brush_exception: 'Reinigungsbürste prüfen', clear_brush_exception_2: 'Reinigungsbürste prüfen', filter_screen_exception: 'Filtersieb prüfen',
  up_water_exception: 'Wasserzufuhr gestört', drain_water_exception: 'Wasserablauf gestört', temperature_protection: 'Temperaturschutz aktiv',
  clean_carousel_exception: 'Waschwanne prüfen', clean_carousel_water_full: 'Waschwanne voll', water_carriage_drop: 'Wischmodul abgefallen',
  check_clean_carouse: 'Waschwanne prüfen', audio_error: 'Lautsprecherfehler',
  // Station
  no_dustbin_or_filter: 'Staubbehälter oder Filter fehlt', auto_empty_dock_fan_error: 'Absauggebläse der Station defekt', duct_blockage: 'Absaugkanal verstopft',
  auto_empty_dock_voltage_error: 'Spannungsfehler der Station', water_empty: 'Frischwassertank leer', waste_water_tank_full: 'Schmutzwassertank voll',
  maintenance_brush_jammed: 'Wartungsbürste blockiert', dirty_tank_latch_open: 'Schmutzwassertank nicht eingerastet', cleaning_tank_full_or_blocked: 'Reinigungstank voll oder verstopft',
};
const VNOERR = ['', 'ok', 'none', 'no_error', 'unknown', 'unavailable', '0'];
// Meldung zum Fehlersensor: Tabelle, sonst HA-Übersetzung, sonst Code lesbar (main_brush_jammed → Main brush jammed); null = kein Fehler
const verrText = (h, s) => {
  const v = String(s?.state ?? '').trim();
  if (VNOERR.includes(v.toLowerCase())) return null;
  if (VERR[v]) return VERR[v];
  const t = fmtState(h, s);
  if (t && t !== v) return t;
  const r = v.replace(/_/g, ' ');
  return r.charAt(0).toUpperCase() + r.slice(1);
};

// Animation: Station hinten, Roboter davor, Effekte obendrauf (Seitenansicht, viewBox 320×120)
const VSCENE = `<div class="scene sc"><svg viewBox="0 8 320 102" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
<defs><linearGradient id="vgr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:color-mix(in srgb,var(--rc) 75%,#fff)"/><stop offset="1" style="stop-color:color-mix(in srgb,var(--rc) 70%,#000)"/></linearGradient>
<linearGradient id="vgs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:color-mix(in srgb,var(--sc) 85%,#fff)"/><stop offset="1" style="stop-color:color-mix(in srgb,var(--sc) 80%,#000)"/></linearGradient>
<clipPath id="vtc"><rect x="293" y="22" width="22" height="30" rx="3"/></clipPath><clipPath id="vtd"><rect x="267" y="22" width="22" height="30" rx="3"/></clipPath></defs>
<rect class="floor" x="0" y="104" width="320" height="1"/><rect class="trail" x="10" y="104" width="230" height="1.6" rx=".8"/>
<g class="stn"><path class="ramp" d="M236 104 L246 98 L320 98 L320 104 Z"/><rect class="tower" x="262" y="12" width="58" height="86" rx="6"/>
<rect class="sled" x="282" y="15.5" width="18" height="1.4" rx=".7"/>
<rect class="tank" x="267" y="22" width="22" height="30" rx="3"/><rect class="tank" x="293" y="22" width="22" height="30" rx="3"/>
<rect class="tkd" clip-path="url(#vtd)" x="267" y="22" width="22" height="30"/><rect class="tkc" clip-path="url(#vtc)" x="293" y="22" width="22" height="30"/>
<rect class="bin" x="267" y="56" width="48" height="20" rx="3"/><rect class="bag" x="271" y="59" width="40" height="14" rx="5"/>
<rect class="duct" x="289.8" y="74" width="2.4" height="12" rx="1.2"/><rect class="pipe" x="316.2" y="50" width="1.6" height="40" rx=".8"/><rect class="pipe" x="264.2" y="50" width="1.6" height="40" rx=".8"/></g>
<g class="rob"><ellipse class="shd" cx="35" cy="104" rx="34" ry="2.4"/><g class="rb"><rect class="mop" x="8" y="99.5" width="54" height="2.5" rx="1.2"/>
<g transform="translate(5 101)"><g class="br"><line x1="-5" y1="0" x2="5" y2="0"/><line x1="0" y1="-1.6" x2="0" y2="1.6"/></g></g>
<rect class="body" x="0" y="86" width="70" height="14" rx="7"/><rect class="top" x="4" y="85" width="62" height="2.2" rx="1.1"/><rect class="bump" x="1" y="93" width="68" height=".8"/>
<rect class="lid" x="28" y="79" width="14" height="6.5" rx="2"/><rect class="lidl" x="30" y="81.2" width="10" height="1"/>
<rect class="led" x="56" y="89.5" width="9" height="1.4" rx=".7"/><g class="dust"><circle cx="-5" cy="102" r="1"/><circle cx="-10" cy="101" r=".8"/><circle cx="-15" cy="102.5" r=".9"/></g>
<path class="bolt" d="M13 66 l-4 7 h4 l-2 6 l6 -8 h-4 l2 -5 z"/><g class="err"><circle cx="35" cy="68" r="5.5"/><rect x="34.3" y="64.8" width="1.4" height="4" rx=".7"/><circle class="dot" cx="35" cy="70.9" r=".8"/></g></g></g>
<g class="parts"><circle cx="291" cy="88" r="1.4"/><circle cx="291" cy="88" r="1.1"/><circle cx="291" cy="88" r="1.3"/><circle cx="291" cy="88" r="1"/><circle cx="291" cy="88" r="1.2"/></g>
<g class="water"><ellipse cx="256" cy="104" rx="11" ry="1.6"/><ellipse cx="280" cy="104" rx="11" ry="1.6"/><ellipse cx="304" cy="104" rx="11" ry="1.6"/>
<g class="drops"><circle cx="317" cy="52" r="1.1"/><circle cx="317" cy="52" r="1"/><circle cx="317" cy="52" r="1.1"/></g>
<g class="dirt"><circle cx="265" cy="90" r="1.1"/><circle cx="265" cy="90" r="1"/><circle cx="265" cy="90" r="1.1"/></g>
<g class="bubl"><circle cx="274" cy="50" r=".9"/><circle cx="281" cy="50" r=".7"/><circle cx="277" cy="50" r=".8"/></g>
<g class="spl"><circle cx="250" cy="100" r=".9"/><circle cx="270" cy="99" r="1"/><circle cx="296" cy="100" r=".8"/></g></g>
<g class="heat"><path d="M249 84 q2 -4 0 -8 q-2 -4 0 -8"/><path d="M257 84 q2 -4 0 -8 q-2 -4 0 -8"/><path d="M304 86 q2 -4 0 -8 q-2 -4 0 -8"/></g>
</svg><div class="cap"></div></div>`;
// Muster für Status-Texte (Roh-Zustand und übersetzt), z. B. emptying_the_bin, washing_the_mop, Trocknen
const VPAT = {empty: /empty|evacuat|dust_?collect|collect_?dust|absaug|entleer/i, wash: /wash|wasch|wäsch|self_?clean|rinse/i, dry: /dry|trock/i, mop: /mop|wisch|wipe/i, chg: /charg|lädt/i};
const VSTATES = ['docked', 'cleaning', 'returning', 'paused', 'error', 'idle'];
// aktiv: Zahl > 0 (z. B. Rest-Trocknungszeit), sonst an/aus
const vact = s => !!s && !['unavailable', 'unknown'].includes(s.state) && (NUMRE.test(s.state) ? +s.state > 0 : isOn(s));
// Gerät des Roboters plus zugehörige Geräte (z. B. eigene „Dock“-Station bei Roborock): via_device in beide Richtungen,
// oder gleicher Integrationseintrag und Name/Kennung beginnt gleich – so bleiben zwei Roboter im selben Konto getrennt
function vdevs(h, id) {
  const dev = h?.entities?.[id]?.device_id, D = h?.devices || {}, me = D[dev];
  if (!dev) return [];
  if (!me) return [dev];
  const idf = d => (d.identifiers || []).map(x => String(Array.isArray(x) ? x[1] : x));
  const mine = idf(me), ce = me.config_entries || [];
  return Object.values(D).filter(d => d.id === dev || d.via_device_id === dev || me.via_device_id === d.id ||
    ((d.config_entries || []).some(e => ce.includes(e)) && (idf(d).some(x => mine.some(m => x !== m && x.startsWith(m))) || (!!d.name && !!me.name && d.name.startsWith(me.name) && /^\s*(dock|station|base|ladestation|basis)\b/i.test(d.name.slice(me.name.length))))))
    .map(d => d.id);
}
const vents = (h, id) => { const ds = vdevs(h, id); return ds.length ? Object.values(h.entities).filter(e => ds.includes(e.device_id) && e.entity_id !== id) : []; };
// Passende Entitäten am Roboter und seiner Station finden (Entity-ID + translation_key, Deutsch/Englisch)
function vauto(h, id) {
  const out = {};
  const ents = vents(h, id).filter(e => !e.hidden);
  if (!ents.length) return out;
  const txt = e => `${e.translation_key || ''} ${e.entity_id}`;
  const find = (doms, re, not) => ents.find(e => doms.includes(dom(e.entity_id)) && re.test(txt(e)) && !(not && not.test(txt(e))))?.entity_id;
  const ERR = /error|fehler|fault/;
  out.status = find(['sensor'], /^(vacuum_)?(status|state) |_(status|state)$/, /dock|station|base|error|fehler|fault/);
  out.station = find(['sensor'], /(dock|station|base)\w*_(status|state)|(status|state)\w*_(dock|station)/, ERR);
  out.mop_attached = find(['binary_sensor'], /mop\w*(attach|install)|(attach|install)\w*mop|mopp?_angebracht/);
  out.mop_mode = ents.find(e => {
    if (dom(e.entity_id) !== 'select') return false;
    const o = (h.states[e.entity_id]?.attributes.options || []).map(String);
    return o.some(x => VPAT.mop.test(x)) && o.some(x => !VPAT.mop.test(x));
  })?.entity_id;
  out.clean_water = find(['binary_sensor', 'sensor'], /clean_?(water|box|tank)|fresh_?water|frischwasser/);
  out.dirty_water = find(['binary_sensor', 'sensor'], /dirty_?(water|box|tank)|waste_?water|schmutzwasser/);
  out.drying = find(['sensor', 'binary_sensor'], /dry|trockn/, ERR);
  out.charging = find(['binary_sensor'], /charg|ladestatus/);
  out.emptying = find(['binary_sensor'], /empty|entleer|absaug/);
  out.washing = find(['binary_sensor'], /wash|wasch|wäsch/);
  // Fehlersensoren: Roboter (z. B. vacuum_error / …_staubsauger_fehler) und Station (dock_error / …_dock_fehler)
  out.dock_error_entity = find(['sensor'], /(dock|station|base)\w*_(error|fehler)|(error|fehler)\w*_(dock|station)/);
  out.error_entity = find(['sensor'], /(^|_)(error|fehler|fault)(_?code)?( |$)|^error /, /dock|station|base/);
  out.error_reset_entity = ents.find(e => ['button', 'input_button', 'script'].includes(dom(e.entity_id)) && /(reset|clear|quittier|zur(ü|ue)cksetz|behebe?n?)\w*_(error|fehler)|(error|fehler)\w*_(reset|clear|quittier|zur(ü|ue)cksetz)/.test(txt(e)))?.entity_id;
  return Object.fromEntries(Object.entries(out).filter(([, v]) => v));
}

// Stationstyp: dock (nur Laden), empty (Absaugen), wash (Wassertanks/Moppwäsche), full (beides)
const VBAG = /empty|entleer|absaug|evacuat|dust_?(bag|bin|collect)|staubbeutel/;
const VTANK = /mop_?wash|wash_?mop|moppw|wäsch|wash|self_?clean|clean_?(water|box|tank)|dirty_?(water|box|tank)|frischwasser|schmutzwasser|dry|trockn/;
function vstation(h, id, c, auto) {
  if (['dock', 'empty', 'wash', 'full'].includes(c.station_type)) return c.station_type;
  const t = h?.entities ? vents(h, id).map(e => `${e.translation_key || ''} ${e.entity_id}`) : [];
  const has = k => c[k] !== false && !!(c[k] || (c.scene_auto !== false && auto[k]));
  const bag = has('emptying') || (c.scene_auto !== false && t.some(x => VBAG.test(x)));
  const tank = ['clean_water', 'dirty_water', 'washing', 'drying'].some(has) || (c.scene_auto !== false && t.some(x => VTANK.test(x)));
  return bag && tank ? 'full' : bag ? 'empty' : tank ? 'wash' : 'dock';
}
// Turm und LED je Stationstyp: [x, y, Breite, Höhe], LED [x, y, Breite]
const VTOWER = {full: [262, 12, 58, 86, 282, 15.5, 18], wash: [262, 12, 58, 86, 282, 15.5, 18], empty: [262, 50, 58, 48, 282, 53, 18], dock: [292, 76, 28, 22, 299, 79.5, 14]};

class NovaVacuumCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('vacuum-card-editor')); }
  static getStubConfig(h) {
    const ids = Object.keys(h.states).filter(i => i.startsWith('vacuum.'));
    return {entity: ids[0] || 'vacuum.'};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (!c.entity || dom(c.entity) !== 'vacuum') throw new Error('entity muss eine vacuum.* Entität sein');
    if (c.map && !['camera', 'image'].includes(dom(c.map))) throw new Error('map muss eine camera.* oder image.* Entität sein');
    this._c = {...VDEF, ...c, rooms: [].concat(c.rooms || []).map(toObj).filter(o => o.name || o.icon || o.entity || o.segments != null || o.tap_action),
      consumables: [].concat(c.consumables || []).map(toObj).filter(o => o.entity), switches: [].concat(c.switches || []).map(toObj).filter(o => o.entity)};
    this._ids = entityIds(this._c);
    this._built = false;
    if (this._h) { this._build(); this._update(); }
  }
  // Neu zeichnen nur, wenn sich eine Entität der Karte (auch Akku und automatisch gefundene Station) geändert hat
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    if (!this._built) this._build();
    else if (!hassChanged(old, h, [...this._ids, this._bat, ...Object.values(this._auto || {})])) return;
    this._update();
  }
  getCardSize() { return 3 + (this._c?.map ? 4 : 0) + Math.ceil(((this._c?.consumables.length || 0) + (this._c?.switches.length || 0)) / 2); }
  getGridOptions() { return {columns: 12, rows: 'auto', min_columns: 4}; }
  connectedCallback() {
    // In der Kartenauswahl: Animation angehalten, Karte nicht im Takt nachladen
    this._quiet = inPicker(this);
    if (this._quiet) this._vis = false;
    if ('IntersectionObserver' in window) {
      this._io ||= new IntersectionObserver(es => { this._vis = es[es.length - 1].isIntersecting && !this._quiet; this._tick(); }, {rootMargin: '100px'});
      this._io.observe(this);
    } else this._vis = !this._quiet;
    if ('ResizeObserver' in window) {
      this._ro ||= new ResizeObserver(es => this._width(Math.round(es[es.length - 1].contentRect.width)));
      this._ro.observe(this);
    }
    this._tick();
  }
  disconnectedCallback() { this._io?.disconnect(); this._ro?.disconnect(); this._vis = false; this._tick(); }
  // Layout nach Kartenbreite – mit Puffer (ab 640 px daneben, erst unter 600 px wieder darunter), damit es nie hin- und herkippt
  _width(w) {
    const g = this._e?.g;
    if (!g || !w) return;
    const wide = g.classList.contains('wide') ? w >= 600 : w >= 640;
    g.classList.toggle('wide', wide);
    g.classList.toggle('narrow', w <= 300);
  }
  _build() {
    this._built = true;
    const c = this._c, r = this.shadowRoot || this.attachShadow({mode: 'open'});
    this._bat = c.battery || batOf(this._h, c.entity);
    const ar = String(c.map_aspect_ratio || 'auto').replace(':', '/');
    const pills = c.controls !== 'round', rt = vtitle(c.rooms_title), mt = vtitle(c.map_title);
    const lay = c.map ? (['side', 'stack'].includes(c.layout) ? c.layout : 'auto') : 'stack';
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${VCSS}</style><div class="g vc ${lay}"><div class="main">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${c.all ? '<div class="pill all"><span class="i"></span><span class="t"></span></div>' : ''}<div class="bat" hidden><ha-icon></ha-icon><span></span></div></div>
${c.scene !== false ? VSCENE : ''}
<div class="pills erb" hidden><div class="pill"><ha-icon icon="mdi:wrench-check-outline"></ha-icon><span class="t"></span></div></div>
${pills ? `<div class="ctl pl pills">${Object.entries(VCTL).map(([k, [ic, t]]) => `<div class="pill c-${k}"><ha-icon icon="${ic}"></ha-icon><span>${t}</span></div>`).join('')}</div>`
    : '<div class="ctl"><div class="cb sp" title="Spot"><ha-icon icon="mdi:target-variant"></ha-icon></div><div class="cb st" title="Stopp"><ha-icon icon="mdi:stop"></ha-icon></div><div class="cb pp" title="Start/Pause"><ha-icon icon="mdi:play"></ha-icon></div><div class="cb hm" title="Zur Station"><ha-icon icon="mdi:home-import-outline"></ha-icon></div><div class="cb lo" title="Suchen"><ha-icon icon="mdi:map-marker-question-outline"></ha-icon></div></div>'}
${c.show_fan_speed !== false ? '<div class="pills fs"></div>' : ''}
${c.rooms.length ? `<div class="blk rooms">${rt ? `<div class="bt">${esc(rt)}</div>` : ''}<div class="pills"></div></div>` : ''}
${c.switches.length ? '<div class="blk sws"></div>' : ''}
${c.consumables.length ? `<div class="blk cons"><div class="${c.consumables_layout === 'chips' ? 'pills' : 'list'}"></div></div>` : ''}</div>
${c.map ? `<div class="mpnl">${mt ? `<div class="bt">${esc(mt)}</div>` : ''}<div class="map${ar !== 'auto' ? ' ar' : ''}" style="--ar:${esc(ar)};--nv-map-max:${c.map_max_height > 0 ? +c.map_max_height + 'px' : 'none'}"><img alt=""></div></div>` : ''}</div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), bat: q('.bat'), map: q('.map'), img: q('.map img'),
      pp: q('.pp'), st: q('.st'), hm: q('.hm'), lo: q('.lo'), sp: q('.sp'), fs: q('.fs'), rooms: q('.rooms .pills'), cons: q('.cons > div')};
    const e = this._e, svc = (s, d = {}) => this._h.callService('vacuum', s, {entity_id: c.entity, ...d});
    press(e.ic, {tap: () => this._act({entity: c.entity, tap_action: c.tap_action}, 'tap', true), hold: () => this._act({entity: c.entity, hold_action: c.hold_action}, 'hold')});
    this._allEl = q('.hd .all');
    if (this._allEl) press(this._allEl, {tap: () => this._act({entity: c.all, confirm: c.all_confirm}, 'tap'), hold: () => this._act({entity: c.all}, 'hold')});
    press(e.bat, {tap: () => this._bat && moreInfo(this, this._bat)});
    // Fehler beheben/zurücksetzen: Button/Skript auslösen, lange drücken = Details des Fehlersensors
    e.erb = q('.erb');
    press(e.erb.firstChild, {tap: () => this._act({entity: this._ek('error_reset_entity'), confirm: c.error_reset_confirm}, 'tap'),
      hold: () => { const id = this._ek('error_entity') || this._ek('dock_error_entity'); id && moreInfo(this, id); }});
    // Start: eingeplante Räume reinigen; nichts eingeplant, „Überall“ an oder Pause = normal starten bzw. fortsetzen
    const start = () => { const p = this._picked(); p.length && this._st()?.state !== 'paused' ? this._clean(p) : svc('start'); };
    if (pills) this._ctl = Object.entries(VCTL).map(([k, d]) => { const el = q(`.c-${k}`); press(el, {tap: () => k === 'start' ? start() : svc(d[3])}); return [k, el, d]; });
    else {
      press(e.pp, {tap: () => { const s = this._st(); s?.state === 'cleaning' ? svc(hasF(s, VF.PAUSE) ? 'pause' : 'stop') : start(); }});
      press(e.st, {tap: () => svc('stop')});
      press(e.hm, {tap: () => svc('return_to_base')});
      press(e.lo, {tap: () => svc('locate')});
      press(e.sp, {tap: () => svc('clean_spot')});
    }
    // Schalter wie der Baustein „Schalter & Entitäten“ der Modular Card
    const sw = q('.sws');
    this._swUp = sw ? BLOCKS.entities.call(this, {entities: c.switches, columns: c.switches_columns}, sw) : null;
    if (e.map) {
      press(e.map, {tap: () => this._mapTap(), hold: () => moreInfo(this, c.map)});
      // Feste Höhe nach dem ersten Bild: neue Kartenbilder beim Reinigen verschieben das Layout nicht (Safari kennt keinen Scroll-Anker)
      e.img.addEventListener('load', () => {
        if (e.map.classList.contains('ar') || !e.img.naturalWidth) return;
        e.map.style.setProperty('--ar', `${e.img.naturalWidth}/${e.img.naturalHeight}`);
        e.map.classList.add('ar');
      });
    }
    // Räume: mit Segmenten = auswählen und gesammelt reinigen, sonst Aktion/Entität direkt
    this._sel = new Set();
    if (e.rooms) {
      this._rooms = c.rooms.map((o, i) => {
        const el = document.createElement('div');
        el.className = 'pill';
        el.innerHTML = '<span class="i"></span><span class="t"></span>';
        press(el, {tap: () => {
          if (o.tap_action?.action || o.entity || (!o.area && !list(o.segments).length)) return this._act(o, 'tap');
          this._sel.has(i) ? this._sel.delete(i) : this._sel.add(i);
          this._update();
        }, hold: () => this._act(o, 'hold')});
        e.rooms.append(el);
        return el;
      });
      this._go = document.createElement('div');
      this._go.className = 'pill go';
      this._go.innerHTML = '<ha-icon icon="mdi:play"></ha-icon><span class="t"></span>';
      press(this._go, {tap: () => this._clean(this._picked())});
      e.rooms.append(this._go);
    }
    if (e.cons) {
      const chips = c.consumables_layout === 'chips';
      this._cons = c.consumables.map(o => {
        const el = document.createElement('div');
        el.className = chips ? 'pill' : 'kv';
        el.innerHTML = chips ? '<span class="i"></span><span class="t"></span>' : '<span class="i"></span><span class="k"></span><span class="v"></span><div class="cbar"><i></i></div>';
        press(el, {tap: () => this._act(o, 'tap', true), hold: () => this._act(o, 'hold')});
        e.cons.append(el);
        return [el, o];
      });
    }
    this._auto = vauto(this._h, c.entity);
    e.sc = q('.scene');
    if (e.sc) {
      Object.assign(e, {cap: q('.scene .cap'), tkc: q('.tkc'), tkd: q('.tkd')});
      this._stType = vstation(this._h, c.entity, c, this._auto);
      const [x, y, w, hh, lx, ly, lw] = VTOWER[this._stType], tw = q('.tower'), led = q('.sled');
      Object.entries({x, y, width: w, height: hh}).forEach(([k, v]) => tw.setAttribute(k, v));
      Object.entries({x: lx, y: ly, width: lw}).forEach(([k, v]) => led.setAttribute(k, v));
    }
    this._fsKey = this._mapKey = null;
    this._width(Math.round(this.getBoundingClientRect().width));
    this._tick();
  }
  _st() { return this._h?.states[this._c.entity]; }
  // Fehler-Entitäten: konfiguriert, sonst am Gerät gefunden; false = aus
  _ek(k) { const v = this._c[k]; return v === false ? null : v || this._auto?.[k] || null; }
  // Eingeplant: angetippt oder Raum-Entität an – nur Räume mit Bereich oder Segmenten; „Überall“ an = nichts (alles)
  _picked() {
    const c = this._c, h = this._h;
    if (c.all && isOn(h?.states[c.all])) return [];
    return c.rooms.map((o, i) => i).filter(i => {
      const o = c.rooms[i], os = o.entity && h?.states[o.entity];
      return (o.area || list(o.segments).length) && (this._sel.has(i) || (!!os && TOGGLE.includes(dom(o.entity)) && isOn(os)));
    });
  }
  // Bereiche über vacuum.clean_area (HA-Bereiche, herstellerunabhängig), sonst Segmente je Integration
  _clean(idx) {
    const c = this._c, rooms = idx.map(i => c.rooms[i]), ok = hasF(this._st(), VF.AREA);
    const byArea = o => ok && o.area;
    const areas = [...new Set(rooms.filter(byArea).map(o => o.area))];
    const seg = rooms.filter(o => !byArea(o)).flatMap(o => list(o.segments)), fn = SEG[c.segment_mode];
    if (areas.length) this._h.callService('vacuum', 'clean_area', {cleaning_area_id: areas}, {entity_id: c.entity});
    if (seg.length && fn) { const [d, s, data] = fn(c.entity, seg, Math.max(1, +c.segment_repeat || 1)); this._h.callService(d, s, data); }
    this._sel.clear(); this._update();
  }
  // Animation: liefert true bei Tank-Warnung
  _scene() {
    const e = this._e, h = this._h, c = this._c;
    if (!e.sc) return false;
    const s = this._st(), st = s?.state, a = s?.attributes || {}, bv = this._bv;
    const pick = k => c[k] === false ? null : c[k] || (c.scene_auto !== false ? this._auto[k] : null);
    const S = k => { const id = pick(k); return id ? h.states[id] : null; };
    const txt = [S('status'), S('station')].flatMap(x => x ? [x.state, fmtState(h, x)] : []).concat(a.status || [], st || []).join(' ');
    const mm = S('mop_mode'), ma = S('mop_attached'), only = list(c.mop_states);
    const mopping = mm ? (only.length ? only.includes(mm.state) : VPAT.mop.test(mm.state) && !/^(off|none|vacuum|aus)$/i.test(mm.state)) : null;
    const attached = ma ? vact(ma) : !!(a.mop_attached ?? a.water_box_attached ?? mopping);
    // Absaugen, Waschen, Trocknen und Laden nur in der Station – Sensoren der Station hinken nach dem Losfahren oft hinterher
    const home = !['cleaning', 'returning', 'error'].includes(st);
    const empty = home && (vact(S('emptying')) || VPAT.empty.test(txt));
    const wash = home && !empty && (vact(S('washing')) || VPAT.wash.test(txt));
    const dry = home && !empty && !wash && (vact(S('drying')) || VPAT.dry.test(txt));
    const chg = home && !empty && !wash && !dry && (vact(S('charging')) || VPAT.chg.test(txt) || (st === 'docked' && bv < 100));
    const wet = attached && (mopping ?? true);
    // Tanks: binary_sensor an = Problem, Zahl = Füllstand in %, Text mit leer/voll = Problem
    const tank = (el, x, ok, bad) => {
      let p = .55, low = false;
      if (x && NUMRE.test(x.state)) p = Math.max(0, Math.min(100, +x.state)) / 100;
      else if (x && !['unavailable', 'unknown'].includes(x.state)) { low = dom(x.entity_id) === 'binary_sensor' ? x.state === 'on' : /low|empty|leer|full|voll|lack|short|knapp|problem/i.test(x.state); p = low ? bad : ok; }
      el.setAttribute('y', 22 + 30 * (1 - p)); el.setAttribute('height', 30 * p);
      el.classList.toggle('low', low);
      el.style.opacity = x ? '' : '.35';
      return low;
    };
    const tk = this._stType === 'full' || this._stType === 'wash';
    const lowC = tk && tank(e.tkc, S('clean_water'), .75, .08), lowD = tk && tank(e.tkd, S('dirty_water'), .3, .95);
    const ty = this._stType;
    e.sc.className = ['scene', 'sc', VSTATES.includes(st) ? st : 'idle', (ty === 'full' || ty === 'empty') && 'has-bag', (ty === 'full' || ty === 'wash') && 'has-tanks', attached && 'mop', wet && 'mopping', empty && 'empty', wash && 'wash', dry && 'dry', chg && 'chg', this._vis === false && 'still'].filter(Boolean).join(' ');
    e.cap.textContent = empty ? 'Absaugen' : wash ? 'Mopp wird gewaschen' : dry ? 'Mopp trocknet' : st === 'cleaning' ? (wet ? 'Saugt & wischt' : 'Saugt')
      : lowC ? 'Frischwasser leer' : lowD ? 'Schmutzwasser voll' : chg ? (bv >= 100 ? 'Voll geladen' : 'Lädt') : '';
    return lowC || lowD;
  }
  _mapTap() {
    const a = this._c.map_action;
    if (a === 'none') return;
    if (a === 'vacuum') return moreInfo(this, this._c.entity);
    moreInfo(this, this._c.map);
  }
  _update() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !e) return;
    const s = this._st(), a = s?.attributes || {}, st = s?.state;
    const run = VRUN.includes(st), err = st === 'error';
    e.g.classList.toggle('na', !s || st === 'unavailable');
    this.classList.toggle('nv-na', !s || st === 'unavailable');
    e.g.classList.toggle('run', run && c.glow !== false);
    e.name.textContent = c.name ?? a.friendly_name ?? c.entity;
    const ss = c.status && h.states[c.status];
    const bs = this._bat && h.states[this._bat], bv = parseFloat(bs ? bs.state : a.battery_level), chg = st === 'docked' && bv < 100;
    const bd = c.battery_display, btxt = bd === 'status' && !isNaN(bv) ? `Akku ${Math.round(bv)} %` : null;
    // Konkreter Fehler aus dem Fehlersensor statt nur „Fehler“; Fehler der Station kommt dazu
    const es = this._ek('error_entity'), ds = this._ek('dock_error_entity');
    const et = es ? verrText(h, h.states[es]) : null, dt = ds ? verrText(h, h.states[ds]) : null;
    const stxt = et || (ss ? fmtState(h, ss) : fmtState(h, s));
    e.sub.textContent = !s ? 'nicht gefunden' : [stxt, !ss && !et && a.fan_speed && run ? fanName(h, s, a.fan_speed) : null, dt && dt !== et ? `Station: ${dt}` : null, btxt].filter(Boolean).join(' · ');
    e.sub.classList.toggle('er', err || !!et || !!dt);
    const rid = (et || dt || err) && this._ek('error_reset_entity');
    e.erb.hidden = !rid || c.show_error_reset === false;
    if (!e.erb.hidden) e.erb.querySelector('.t').textContent = c.error_reset_name ?? 'Fehler beheben';
    setIcon(e.ic, c.icon || a.icon || 'mdi:robot-vacuum');
    e.ic.parentElement.classList.toggle('on', run);
    // Akku: eigener Sensor, sonst Sensor am Gerät, sonst Attribut
    e.bat.hidden = isNaN(bv) || bd !== 'chip';
    if (!e.bat.hidden) {
      setIcon(e.bat.firstChild, batIcon(bv, chg));
      e.bat.lastChild.textContent = `${Math.round(bv)} %`;
      e.bat.classList.toggle('chg', chg);
      e.bat.classList.toggle('low', bv <= (c.battery_low ?? 20) && !chg);
    }
    if (this._ctl) {
      // Pillen: alle, die der Roboter kann; die gerade aktive leuchtet
      const show = {stop: c.show_stop !== false, home: c.show_return !== false, locate: c.show_locate !== false, spot: !!c.show_spot};
      const act = {cleaning: 'start', paused: 'pause', returning: 'home', docked: 'home'}[st];
      this._ctl.forEach(([k, el, d]) => { el.hidden = show[k] === false || !hasF(s, d[2]); el.classList.toggle('on', k === act && k !== 'home' || k === 'home' && st === 'returning'); });
    } else {
      setIcon(e.pp, st === 'cleaning' ? (hasF(s, VF.PAUSE) ? 'mdi:pause' : 'mdi:stop') : 'mdi:play');
      e.pp.title = st === 'cleaning' ? 'Pause' : 'Start';
      e.pp.hidden = !!s && !hasF(s, VF.START) && !hasF(s, VF.PAUSE);
      e.st.hidden = c.show_stop === false || !hasF(s, VF.STOP) || !(run || st === 'paused');
      e.hm.hidden = c.show_return === false || !hasF(s, VF.RETURN) || st === 'docked';
      e.lo.hidden = c.show_locate === false || !hasF(s, VF.LOCATE);
      e.sp.hidden = !c.show_spot || !hasF(s, VF.SPOT);
    }
    this._swUp?.(h);
    if (e.fs) this._fans(s);
    const rs = c.room_sensor && h.states[c.room_sensor], cur = rs && !['unknown', 'unavailable', ''].includes(rs.state) ? rs.state.toLowerCase() : null;
    if (this._allEl) {
      const as = h.states[c.all];
      this._allEl.classList.toggle('on', isOn(as));
      this._allEl.classList.toggle('na', !as || as.state === 'unavailable');
      setIcon(this._allEl.firstChild, c.all_icon || as?.attributes.icon || 'mdi:check-all');
      this._allEl.lastChild.textContent = c.all_name ?? 'Überall';
    }
    this._rooms?.forEach((el, i) => {
      const o = c.rooms[i], os = o.entity && h.states[o.entity];
      // Raum-Entität (z. B. input_boolean „Raum einplanen“) leuchtet, wenn an
      el.classList.toggle('on', this._sel.has(i) || (!!os && TOGGLE.includes(dom(o.entity)) && isOn(os)));
      el.classList.toggle('cur', !!cur && [o.name, o.area, o.area && h.areas?.[o.area]?.name, ...list(o.segments)].some(x => x != null && String(x).toLowerCase() === cur));
      el.classList.toggle('na', !!o.entity && (!os || os.state === 'unavailable'));
      setIcon(el.firstChild, o.icon || os?.attributes.icon || 'mdi:floor-plan');
      el.lastChild.textContent = o.name ?? os?.attributes.friendly_name ?? (list(o.segments).join(', ') || '');
    });
    if (this._go) {
      const n = this._picked().length;
      this._go.hidden = !n;
      this._go.lastChild.textContent = `${n} ${n === 1 ? 'Raum' : 'Räume'} reinigen`;
    }
    let warn = false;
    this._cons?.forEach(([el, o]) => {
      const cs = h.states[o.entity], n = cs ? parseFloat(cs.state) : NaN;
      const low = o.below != null && !isNaN(n) && n < o.below;
      warn ||= low;
      el.classList.toggle('na', !cs || cs.state === 'unavailable');
      el.classList.toggle('warn', low);
      setIcon(el.firstChild, iconOf(h, o, 'mdi:wrench-clock'));
      const v = valueOf(h, cs, o);
      if (el.classList.contains('pill')) { el.lastChild.textContent = o.name === '' ? v : `${nameOf(h, o)} · ${v}`; return; }
      el.children[1].textContent = nameOf(h, o);
      el.children[2].textContent = v;
      // Balken bei Prozent oder gesetztem Maximum
      const mx = o.max ?? ((o.unit ?? cs?.attributes.unit_of_measurement) === '%' ? 100 : null);
      el.lastChild.hidden = !mx || isNaN(n);
      if (mx && !isNaN(n)) el.lastChild.firstChild.style.width = `${Math.max(0, Math.min(100, n / mx * 100))}%`;
    });
    e.g.classList.toggle('err', err && c.glow !== false);
    this._bv = bv;
    if (this._scene()) warn = true;
    e.g.classList.toggle('warn', !err && (warn || !!et || !!dt) && c.glow !== false);
    this._mapSync();
    this._tick();
  }
  _fans(s) {
    const c = this._c, a = s?.attributes || {}, e = this._e;
    const only = list(c.fan_speeds), all = hasF(s, VF.FAN) ? a.fan_speed_list || [] : [];
    const fs = only.length ? all.filter(x => only.includes(x)) : all;
    const key = fs.join('\n');
    if (key !== this._fsKey) {
      this._fsKey = key;
      e.fs.replaceChildren(...fs.map(x => {
        const el = document.createElement('div');
        el.className = 'pill'; el.dataset.s = x;
        el.innerHTML = '<span class="i"></span><span class="t"></span>';
        setIcon(el.firstChild, mapIcon(c.fan_speed_icons, x) || 'mdi:fan');
        el.lastChild.textContent = fanName(this._h, s, x);
        press(el, {tap: () => this._h.callService('vacuum', 'set_fan_speed', {entity_id: c.entity, fan_speed: x})});
        return el;
      }));
    }
    e.fs.hidden = !fs.length;
    [...e.fs.children].forEach(el => el.classList.toggle('on', el.dataset.s === a.fan_speed));
  }
  // image.* bei Zustandswechsel neu laden, camera.* im Takt, solange der Roboter fährt
  _mapSync(force) {
    const e = this._e, id = this._c.map, ms = id && this._h?.states[id], p = ms?.attributes.entity_picture;
    if (!e?.map) return;
    if (!this._mapKey) e.map.parentElement.hidden = !p;
    if (!p) return;
    const key = dom(id) === 'image' ? `${p}|${ms.state}` : p;
    if (!force && key === this._mapKey) return;
    if (!this._vis && this._mapKey) return;
    this._mapKey = key;
    e.img.src = stamp(p, dom(id) === 'image' ? ms.state : Date.now());
  }
  _tick() {
    this._e?.sc?.classList.toggle('still', this._vis === false);
    this._e?.g?.classList.toggle('still', this._vis === false);
    const c = this._c, run = this._vis && c?.map && dom(c.map) === 'camera' && c.map_refresh > 0 && VRUN.includes(this._st()?.state);
    if (run && !this._tm) this._tm = setInterval(() => this._mapSync(true), c.map_refresh * 1000);
    if (!run && this._tm) { clearInterval(this._tm); this._tm = null; }
    if (this._vis) this._mapSync();
  }
  _act(o, kind, info) { return runAction(this, o, kind, info); }
}
define('vacuum-card', NovaVacuumCard, {name: 'Nova Saugroboter Card', description: 'Saugroboter mit Status, Akku, Start/Pause/Stopp/Zur Station, Saugstärke, Karte daneben, Raumreinigung, Schaltern und Verbrauchsteilen.', documentationURL: docUrl('nova-saugroboter-card')});

/* ---------- Editor Saugroboter Card ---------- */
const VGEN = [
  {name: 'entity', required: true, selector: {entity: {domain: ['vacuum']}}},
  g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}}),
  {name: 'status', selector: {entity: {}}},
];
const VBAT = [
  {name: 'battery', selector: {entity: {domain: ['sensor'], device_class: 'battery'}}},
  g2({name: 'battery_low', selector: {number: {min: 0, max: 100, mode: 'box', unit_of_measurement: '%'}}}, sel('battery_display', [['status', 'Im Statustext'], ['chip', 'Als Pille rechts'], ['none', 'Aus']])),
];
const VCTRL = [
  sel('controls', [['pills', 'Pillen mit Text'], ['round', 'Runde Buttons']]),
  g2({name: 'show_stop', selector: {boolean: {}}}, {name: 'show_return', selector: {boolean: {}}}),
  g2({name: 'show_locate', selector: {boolean: {}}}, {name: 'show_spot', selector: {boolean: {}}}),
];
const VERRF = [
  g2({name: 'error_entity', selector: {entity: {domain: ['sensor']}}}, {name: 'dock_error_entity', selector: {entity: {domain: ['sensor']}}}),
  g2({name: 'error_reset_entity', selector: {entity: {domain: ['button', 'input_button', 'script']}}}, {name: 'show_error_reset', selector: {boolean: {}}}),
  g2({name: 'error_reset_name', selector: T}, {name: 'error_reset_confirm', selector: T}),
];
const VERRK = ['error_entity', 'dock_error_entity', 'error_reset_entity'];
const VLOOK = [sel('layout', [['auto', 'Automatisch'], ['side', 'Karte daneben'], ['stack', 'Karte darüber']]), {name: 'glow', selector: {boolean: {}}}];
const VACT = [g2({name: 'tap_action', selector: A}, {name: 'hold_action', selector: A})];
// Felder der Animation nur, wenn sie angezeigt wird
const VSCN = c => c.scene === false ? [{name: 'scene', selector: {boolean: {}}}] : [
  g2({name: 'scene', selector: {boolean: {}}}, {name: 'scene_auto', selector: {boolean: {}}}),
  sel('station_type', [['auto', 'Automatisch'], ['dock', 'Nur Ladestation'], ['empty', 'Absaugstation'], ['wash', 'Waschstation (Tanks)'], ['full', 'Komplett (Tanks + Staubbeutel)']]),
  g2({name: 'mop_attached', selector: {entity: {}}}, {name: 'mop_mode', selector: {entity: {}}}),
  {name: 'mop_states', selector: {text: {multiple: true}}},
  g2({name: 'clean_water', selector: {entity: {}}}, {name: 'dirty_water', selector: {entity: {}}}),
  g2({name: 'emptying', selector: {entity: {}}}, {name: 'washing', selector: {entity: {}}}),
  g2({name: 'drying', selector: {entity: {}}}, {name: 'charging', selector: {entity: {}}}),
  {name: 'station', selector: {entity: {}}},
];
const VFAN = c => [{name: 'show_fan_speed', selector: {boolean: {}}}, ...(c.show_fan_speed === false ? [] : [{name: 'fan_speeds', selector: {text: {multiple: true}}}])];
// Einstellungen der Karte erst, wenn eine Karte gewählt ist
const VMAP = c => [
  g2({name: 'map', selector: {entity: {domain: ['camera', 'image']}}}, {name: 'map_title', selector: T}),
  ...(c.map ? VMAPX : []),
];
const VMAPX = [
  g2(sel('map_aspect_ratio', [['auto', 'Automatisch'], ['1:1', '1:1'], ['4:3', '4:3'], ['16:9', '16:9'], ['3:4', '3:4']]),
    {name: 'map_refresh', selector: {number: {min: 0, max: 60, mode: 'box', unit_of_measurement: 's'}}}),
  g2(sel('map_action', [['more-info', 'Karte groß öffnen'], ['vacuum', 'Details des Roboters'], ['none', 'Nichts']]),
    {name: 'map_max_height', selector: {number: {min: 0, max: 800, step: 10, mode: 'box', unit_of_measurement: 'px'}}}),
];
const vvis = c => `${c.scene === false}|${c.show_fan_speed === false}|${!!c.map}|${c.entity}`;
const VSEG = [{name: 'rooms_title', selector: T}, g2({name: 'room_sensor', selector: {entity: {domain: ['sensor', 'select', 'input_select']}}}, {name: 'all', selector: {entity: {}}}),
  g2({name: 'all_name', selector: T}, {name: 'all_icon', selector: I}), g2(sel('segment_mode', [['roborock', 'Roborock'], ['valetudo', 'Valetudo (MQTT)'], ['dreame', 'Dreame (HACS)'], ['xiaomi', 'Xiaomi Miio']]),
  {name: 'segment_repeat', selector: {number: {min: 1, max: 3, mode: 'slider'}}})];
const VROOM = [NAMEICON, g2({name: 'segments', selector: T}, {name: 'area', selector: {area: {}}}), {name: 'entity', selector: {entity: {}}}, {name: 'tap_action', selector: A}, {name: 'confirm', selector: T}];
const VSWL = [{name: 'switches_columns', selector: {number: {min: 1, max: 3, mode: 'slider'}}}];
const VSW = [ENT, NAMEICON, {name: 'tap_action', selector: A}, {name: 'confirm', selector: T}];
const VCONSL = [sel('consumables_layout', [['rows', 'Liste'], ['chips', 'Chips']])];
const VCONS = [ENT, NAMEICON, g2({name: 'unit', selector: T}, {name: 'decimals', selector: {number: {min: 0, max: 4, mode: 'box'}}}), g2(NUM('below'), NUM('max'))];
const VLABELS = {...BASE_LABELS, station_type: 'Station', scene: 'Animation anzeigen', scene_auto: 'Entitäten automatisch suchen', mop_attached: 'Mopp angebracht', mop_mode: 'Reinigungsmodus (Wischen?)',
  mop_states: 'Zustände, die „wischt“ bedeuten', clean_water: 'Frischwassertank', dirty_water: 'Schmutzwassertank', emptying: 'Absaugen aktiv', washing: 'Moppwäsche aktiv',
  drying: 'Trocknung aktiv', error_entity: 'Fehler-Sensor Roboter', dock_error_entity: 'Fehler-Sensor Station', error_reset_entity: 'Fehler beheben: Entität',
  show_error_reset: 'Fehler-beheben-Button', error_reset_name: 'Fehler beheben: Text', error_reset_confirm: 'Fehler beheben: Rückfrage', charging: 'Lädt', station: 'Stations-Status', battery: 'Akku-Sensor', battery_display: 'Akku anzeigen', controls: 'Steuerung', layout: 'Layout',
  map_title: 'Überschrift Karte', rooms_title: 'Überschrift Räume', room_sensor: 'Aktueller Raum (Sensor)', all: '„Überall“-Button: Entität',
  all_name: '„Überall“-Button: Text', all_icon: '„Überall“-Button: Icon', area: 'Bereich', switches_columns: 'Spalten', battery_low: 'Akku niedrig ab', status: 'Status-Entität (optional)', glow: 'Leuchten beim Reinigen / bei Warnung',
  show_stop: 'Stopp-Button', show_return: 'Zur-Station-Button', show_locate: 'Suchen-Button', show_spot: 'Spot-Reinigung',
  show_fan_speed: 'Saugstärke anzeigen', fan_speeds: 'Nur diese Stufen zeigen', map: 'Karte / Kamera', map_aspect_ratio: 'Seitenverhältnis',
  map_max_height: 'Max. Höhe (untereinander)', map_refresh: 'Aktualisieren alle', map_action: 'Karte antippen', segment_mode: 'Integration', segment_repeat: 'Durchgänge', segments: 'Segment-IDs',
  consumables_layout: 'Darstellung', below: 'Warnen unter', max: 'Maximum (für Balken)', tap_action: 'Aktion beim Antippen', hold_action: 'Aktion bei langem Drücken'};
const VHELPERS = {
  station_type: 'Automatisch = nach den Entitäten des Roboters (Absaugen → Staubbeutel, Wasser/Moppwäsche → Tanks)',
  scene_auto: 'Sucht Mopp, Tanks, Absaugen, Waschen, Trocknen und Laden am Gerät des Roboters. Felder unten überschreiben das',
  mop_mode: 'Select o. ä.: Zustand mit mop/wisch = wischt (z. B. vac_and_mop)',
  mop_states: 'Optional, wenn die Erkennung nicht passt: genaue Zustände, z. B. vac_and_mop, mop',
  clean_water: 'binary_sensor (an = leer), Füllstand in % oder Text',
  dirty_water: 'binary_sensor (an = voll), Füllstand in % oder Text',
  drying: 'An oder Zahl > 0 (z. B. Rest-Trocknungszeit) = trocknet',
  station: 'Text-Sensor der Station; wird wie der Status nach Absaugen/Waschen/Trocknen durchsucht',
  battery: 'Leer = Akku-Sensor am Gerät des Roboters automatisch',
  error_entity: 'Leer = automatisch am Gerät (z. B. sensor.robbi_staubsauger_fehler). Zeigt z. B. „Hauptbürste blockiert“ statt „Fehler“',
  dock_error_entity: 'Leer = automatisch an der Station (z. B. sensor.robbi_dock_fehler)',
  error_reset_entity: 'Button/Skript, das den Fehler quittiert. Leer = automatisch, falls es so einen Button gibt. Erscheint nur bei einem Fehler',
  error_reset_name: 'Standard: Fehler beheben',
  status: 'Text unter dem Namen, z. B. sensor.robbi_status. Leer = Zustand des Roboters',
  tap_action: 'Standard: Details des Roboters',
  fan_speeds: 'Leer = alle Stufen des Roboters. Genaue Namen wie in fan_speed_list',
  map: 'z. B. image.robbi_karte oder camera.robbi_map',
  layout: 'Automatisch = Karte daneben, sobald die Karte breit genug ist (z. B. im Popup)',
  map_title: '„-“ = ohne Überschrift',
  rooms_title: '„-“ = ohne Überschrift',
  room_sensor: 'Raum, in dem der Roboter gerade ist, bekommt einen gelben Ring (Vergleich mit Name, Bereich oder Segment)',
  all: 'Optional, z. B. input_boolean.saugroboter_alles oder ein Skript – erscheint oben rechts',
  area: 'Empfohlen: Reinigung über vacuum.clean_area (in den Roboter-Einstellungen Segmente den Bereichen zuordnen). Auch für „Aktueller Raum“',
  map_max_height: 'Nur wenn die Karte über den Bedienelementen steht. 0 = ohne Grenze',
  map_refresh: 'Nur camera.*: Takt beim Reinigen, 0 = aus. image.* lädt bei Änderung selbst neu',
  segment_mode: 'Nur für Räume mit Segment-IDs statt Bereich',
  segments: 'Nur, wenn die Integration keine Bereiche kann: Komma-Liste, z. B. 16, 17',
  entity: 'Optional: input_boolean/Schalter = Raum einplanen (an = Start reinigt ihn), Skript/Button = direkt auslösen',
  confirm: 'Optional: Rückfrage vor dem Auslösen (Aktion/Entität)',
  below: 'Eintrag und Rahmen färben sich, wenn der Wert darunter liegt',
  max: 'Leer = 100 bei %, sonst kein Balken',
};

class NovaVacuumCardEditor extends NovaEditorBase {
  static labels = VLABELS;
  static helpers = VHELPERS;
  static openSections = ['general'];
  _build() {
    const r = this.shadowRoot, c0 = this._config;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), strip = c => { Object.entries(VDEF).forEach(([k, x]) => c[k] === x && delete c[k]); return c; };
    const data = {...VDEF, ...c0};
    const form = schema => this._form(schema, data, v => {
      const c = strip(merge(this._config, names(schema), v));
      this._emit(c);
      // Animation, Saugstärke oder Karte an/aus → abhängige Felder ein-/ausblenden
      if (vvis(c) !== vvis(c0)) this._rebuild();
    });
    w.append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => b.append(form(VGEN))),
      this._section('battery', 'mdi:battery-60', 'Akku', b => b.append(form(VBAT))),
      this._section('controls', 'mdi:play-pause', 'Bedienung', b => b.append(form(VCTRL), this._h4('Saugstärke'), form(VFAN(data)))),
      this._section('map', 'mdi:map-outline', 'Karte', b => b.append(form(VMAP(data)))),
      this._section('scene', 'mdi:robot-vacuum', 'Animation', b => {
        b.append(form(VSCN(data)));
        if (c0.scene !== false && this._hass) {
          const auto = vauto(this._hass, c0.entity), au = Object.entries(auto).filter(([k]) => !VERRK.includes(k));
          const ST = {dock: 'Nur Ladestation', empty: 'Absaugstation', wash: 'Waschstation', full: 'Komplett'};
          b.append(this._hint(`Station: ${ST[vstation(this._hass, c0.entity, data, auto)]}` + (au.length && c0.scene_auto !== false ? ` · Automatisch gefunden: ${au.map(([k, v]) => `${VLABELS[k] || k} = ${v}`).join(', ')}` : '')));
        }
      }),
      this._section('errors', 'mdi:alert-circle-outline', 'Fehler', b => {
        b.append(form(VERRF));
        const auto = this._hass ? vauto(this._hass, c0.entity) : {}, au = VERRK.filter(k => !c0[k] && c0[k] !== false && auto[k]);
        b.append(this._hint(au.length ? `Automatisch gefunden: ${au.map(k => `${VLABELS[k]} = ${auto[k]}`).join(', ')}` : 'Nichts automatisch gefunden – Fehler-Sensoren oben wählen. In YAML mit false abschalten.'));
      }),
      this._section('rooms', 'mdi:floor-plan', 'Räume', b => {
        b.append(this._hint('Je Raum einen HA-Bereich wählen: antippen plant ein, Start reinigt die eingeplanten Räume (vacuum.clean_area). Nichts eingeplant = alles.'));
        if (this._items('rooms').length) b.append(form(VSEG));
        // Segmente aus YAML-Listen als Text zeigen
        this._itemList(b, 'rooms', VROOM, {item: 'Raum', icon: 'mdi:floor-plan'}, 'Raum hinzufügen', it => ({...it, ...(it.segments != null ? {segments: list(it.segments).join(', ')} : {})}));
      }),
      this._section('switches', 'mdi:toggle-switch-outline', 'Schalter', b => {
        b.append(this._hint('z. B. Staubentleerung, Moppwäsche, Mopp-Trocknung – Antippen schaltet bzw. löst aus.'));
        if (this._items('switches').length) b.append(form(VSWL));
        this._itemList(b, 'switches', VSW, {item: 'Schalter', icon: 'mdi:toggle-switch-outline'}, 'Schalter hinzufügen');
      }),
      this._section('consumables', 'mdi:wrench-clock', 'Infos und Verbrauchsteile', b => {
        if (this._items('consumables').length) b.append(form(VCONSL));
        this._itemList(b, 'consumables', VCONS, {item: 'Verbrauchsteil', icon: 'mdi:wrench-clock'}, 'Verbrauchsteil hinzufügen');
      }),
      this._section('look', 'mdi:palette-outline', 'Aussehen', b => b.append(form(VLOOK))),
      this._section('actions', 'mdi:gesture-tap', 'Aktionen', b => b.append(form(VACT))));
  }
}
define('vacuum-card-editor', NovaVacuumCardEditor);
