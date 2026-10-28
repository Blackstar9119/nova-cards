import {define, docUrl, tag} from './shared/define.js';
import {esc, dom, setIcon, NUMRE} from './shared/utils.js';
import {fmtState, langOf, tzOf, isOn, TOGGLE, SLIDE, nameOf, iconOf, valueOf} from './shared/state.js';
import {runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, SECTION_EDITOR_CSS, roleVars} from './shared/styles.js';
import {hassChanged, entityIds, inPicker} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, A, sel, ROLE, BASE_LABELS} from './shared/editor-schema.js';
import {MSG, STAGES, PAUSE_STAGES, QUIET_STAGES, parseErrors} from './printer-messages.js';

/* ---------- Nova 3D-Drucker Card ---------- */
// Entitäten der Bambu-Lab-Integration: Schlüssel → [Domain, Kennungen]. Gesucht wird am Gerät über translation_key,
// sonst über das Ende der Entity-ID (englisch und deutsch). Reihenfolge zählt: Ziel-Temperaturen vor den Ist-Werten.
const ENTS = {
  status: ['sensor', ['print_status', 'druckstatus']],
  stage: ['sensor', ['stage', 'current_stage', 'aktueller_arbeitsschritt']],
  progress: ['sensor', ['print_progress', 'druckfortschritt']],
  remaining: ['sensor', ['remaining_time', 'verbleibende_zeit']],
  end_time: ['sensor', ['end_time', 'endzeit']],
  layer: ['sensor', ['current_layer', 'aktuelle_schicht']],
  layers: ['sensor', ['total_layers', 'gesamtzahl_der_schichten']],
  nozzle_target: ['sensor', ['target_nozzle_temp', 'target_nozzle_temperature', 'zieltemperatur_der_duse']],
  nozzle: ['sensor', ['nozzle_temp', 'nozzle_temperature', 'temperatur_der_duse']],
  bed_target: ['sensor', ['target_bed_temp', 'target_bed_temperature', 'zieltemperatur_vom_druckbett']],
  bed: ['sensor', ['bed_temp', 'bed_temperature', 'druckbetttemperatur']],
  file: ['sensor', ['subtask_name', 'task_name', 'name_der_aufgabe', 'gcode_file', 'gcode_dateiname']],
  hms: ['binary_sensor', ['hms', 'hms_errors', 'hms_fehler']],
  print_error: ['binary_sensor', ['print_error', 'druckfehler']],
  door: ['binary_sensor', ['door_open', 'door', 'tur_offen', 'tuer_offen']],
  online: ['binary_sensor', ['online']],
  light: ['light', ['chamber_light', 'druckraumbeleuchtung']],
  pause: ['button', ['pause', 'druckvorgang_anhalten']],
  resume: ['button', ['resume', 'druckvorgang_fortsetzen']],
  stop: ['button', ['stop', 'druckvorgang_beenden']],
};
const EKEYS = Object.keys(ENTS);
// Spulen-Sensoren (AMS-Slots, externe Spule) erkennt man an ihren Attributen
const isTray = s => !!s && s.attributes && 'color' in s.attributes && 'type' in s.attributes && 'remain' in s.attributes;
const isExt = (h, id) => /external|extern/i.test(`${id} ${h.devices?.[h.entities?.[id]?.device_id]?.name || ''}`);

// Gerät des Druckers: aus der Konfig, sonst von der ersten eingetragenen Entität
export const printerDev = (h, c) => c.device || EKEYS.map(k => h?.entities?.[c[k]]?.device_id).find(Boolean) || null;
// Entitäten am Drucker automatisch finden
export function detect(h, dev) {
  const out = {};
  if (!h?.entities || !dev) return out;
  const ents = Object.values(h.entities).filter(e => e.device_id === dev), used = new Set();
  for (const k of EKEYS) {
    const [d, keys] = ENTS[k];
    const cand = ents.filter(e => dom(e.entity_id) === d && !used.has(e.entity_id));
    let hit = null;
    for (const key of keys) {
      hit = cand.find(e => e.translation_key === key) || cand.find(e => { const o = e.entity_id.split('.')[1]; return o === key || o.endsWith(`_${key}`); });
      if (hit) break;
    }
    if (hit) { out[k] = hit.entity_id; used.add(hit.entity_id); }
  }
  const fans = ents.filter(e => dom(e.entity_id) === 'fan').map(e => e.entity_id).sort();
  if (fans.length) out.fans = fans;
  const cam = ents.find(e => ['image', 'camera'].includes(dom(e.entity_id)) && (/(kamera|camera)$/.test(e.entity_id) || /camera/.test(e.translation_key || '')));
  if (cam) out.camera = cam.entity_id;
  return out;
}
// AMS-Einheiten (Geräte, die über den Drucker angebunden sind) mit ihren Slots, plus externe Spule
function trays(h, c, dev) {
  const units = new Map();
  let ext = c.external_spool || null;
  const add = id => {
    const s = h.states[id];
    if (!isTray(s)) return;
    if (isExt(h, id)) { ext ||= id; return; }
    const d = h.entities?.[id]?.device_id || 'x';
    if (!units.has(d)) units.set(d, []);
    units.get(d).push(id);
  };
  if (c.ams_trays?.length) c.ams_trays.forEach(add);
  else if (dev && h.devices && h.entities) {
    const subs = new Set(Object.values(h.devices).filter(d => d.via_device_id === dev).map(d => d.id));
    Object.values(h.entities).filter(e => subs.has(e.device_id) && dom(e.entity_id) === 'sensor').map(e => e.entity_id).sort().forEach(add);
  }
  const nm = d => { const x = h.devices?.[d]; return x?.name_by_user || x?.name || 'AMS'; };
  return {units: [...units].map(([d, ids]) => ({name: nm(d), slots: ids.slice(0, 4).map(id => slotOf(h.states[id], id))})).sort((a, b) => a.name.localeCompare(b.name)), ext: ext && h.states[ext] ? slotOf(h.states[ext], ext) : null};
}
function slotOf(s, id) {
  const a = s?.attributes || {}, col = typeof a.color === 'string' && /^#[0-9a-f]{6}/i.test(a.color) ? a.color.slice(0, 7) : null;
  const r = Number(a.remain);
  return {id, c: col, mat: a.type || '', name: a.name || s?.state || '', rem: isNaN(r) || r < 0 ? null : Math.min(100, r), act: !!a.active, empty: !!a.empty || s?.state === 'empty'};
}

const PDEF = {ams: 'auto', animation: true, glow: true, color: 'accent-1', show_progress: true, show_remaining: true, show_end_time: true, show_layer: true,
  show_nozzle: true, show_bed: true, show_file: true, show_stage: true, show_message: true, show_ams_list: true, show_controls: true, show_light: true, show_fans: true, camera_mode: 'always', show_switches: true,
  stop_confirm: 'Druck wirklich abbrechen?'};
// Anzeigen, die einzeln abschaltbar sind
const SHOW = ['progress', 'remaining', 'end_time', 'layer', 'nozzle', 'bed', 'file', 'stage', 'message', 'ams_list', 'controls', 'light'];
// Grundzustände der Zeichnung
const CLS = ['off', 'idle', 'heat', 'prep', 'print', 'pause', 'done', 'error', 'cool'];
const CTXT = {off: 'Aus', idle: 'Bereit', heat: 'Heizt auf', prep: 'Bereitet vor', print: 'Druckt', pause: 'Pausiert', done: 'Fertig', error: 'Fehler', cool: 'Kühlt ab'};
const BAD = new Set(['unavailable', 'unknown', 'none', '']);
const ok = s => !!s && !BAD.has(s.state);
const num = s => ok(s) && NUMRE.test(s.state) ? +s.state : null;
const SECS = {s: 1, sec: 1, min: 60, m: 60, h: 3600, d: 86400};
const fmtDur = sec => { const m = Math.max(0, Math.round(sec / 60)); return m < 1 ? '< 1 min' : m < 60 ? `${m} min` : `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')} h`; };

// Demo: Zustände und Daten zum Durchklicken im Editor
const DEMO_STATES = [['print', 'Druckt'], ['heat', 'Heizt auf'], ['prep', 'Bereitet vor'], ['pause', 'Pausiert'], ['done', 'Fertig'], ['error', 'Fehler'], ['cool', 'Kühlt ab'], ['idle', 'Leerlauf'], ['off', 'Aus']];
const DEMO_AMS = [{name: 'AMS A', slots: [{c: '#3d8bf5', mat: 'PLA', name: 'PLA Basic Blau', rem: 82, act: true}, {c: '#f5f5f0', mat: 'PETG', name: 'PETG Weiß', rem: 55},
  {c: '#4caf6a', mat: 'PLA', name: 'PLA Matt Grün', rem: 23}, {c: '#e5533d', mat: 'TPU', name: 'TPU Rot', rem: 8}]},
{name: 'AMS B', slots: [{c: '#222428', mat: 'PLA', name: 'PLA Schwarz', rem: 90}, {c: '#f5b83d', mat: 'PLA', name: 'PLA Gelb', rem: 40}, {c: null, mat: '', name: '', rem: null, empty: true}, {c: '#9b6bd6', mat: 'PETG', name: 'PETG Lila', rem: 67}]}];

/* Zeichnung im Stil der Nova Gerät Card: flach von vorne, Umrisse in Textfarbe, graue Flächen, Akzente in der Gerätefarbe.
   viewBox 0 0 100 100 mit AMS oben; ohne AMS wird oben abgeschnitten und die Spule hängt rechts hinten. Bewegung nur per transform/opacity. */
const SLOTX = [20, 36, 52, 68];
// AMS-Slots: Fenster mit Spule (Höhe = Restmenge), darunter die Slot-LED
const SPOOL = SLOTX.map((x, i) => `<g class="sl s${i}"><rect class="sw0" x="${x}" y="10" width="12" height="10" rx="3"/><rect class="fl" x="${x + 2}" y="11.5" width="8" height="7" rx="1.5"/>
<rect class="sled" x="${x + 3}" y="22" width="6" height="1.4" rx=".7"/></g>`).join('');
const OBJ = 'M43 78 V64 a7 7 0 0 1 14 0 V78 Z';
const SCENE = `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="poc"><rect class="ocr" x="40" y="56" width="20" height="22"/></clipPath>
<clipPath id="pwc"><rect x="17" y="35" width="66" height="52" rx="3"/></clipPath></defs>
<ellipse class="ash" cx="50" cy="96.5" rx="40" ry="2.4"/>
<g class="xsp"><rect class="ft" x="74" y="24" width="4" height="5" rx="1"/><circle class="bd" cx="76" cy="18" r="9"/><circle class="xw" cx="76" cy="18" r="6.4"/><circle class="xh" cx="76" cy="18" r="2"/></g>
<g class="ams"><path class="tb" d="M86 17 C 95 17, 95 33, 86 33"/><path class="fil" d="M86 17 C 95 17, 95 33, 86 33"/></g>
<rect class="bd" x="10" y="28" width="80" height="66" rx="7"/>
<rect class="ft" x="16" y="94" width="10" height="2" rx="1"/><rect class="ft" x="74" y="94" width="10" height="2" rx="1"/>
<g class="door"><rect class="gl" x="17" y="35" width="66" height="52" rx="3"/></g>
<g clip-path="url(#pwc)"><rect class="lgt" x="17" y="35" width="66" height="52"/>
<rect class="pl" x="24" y="78" width="52" height="2.2" rx="1.1"/><rect class="ph2" x="24" y="78" width="52" height="2.2" rx="1.1"/>
<g class="obj"><g clip-path="url(#poc)"><path class="ob" d="${OBJ}"/></g></g>
<g class="cal"><rect x="27" y="76.6" width="8" height="1.2" rx=".6"/><rect x="38" y="76.6" width="8" height="1.2" rx=".6"/><rect x="49" y="76.6" width="8" height="1.2" rx=".6"/><rect x="60" y="76.6" width="8" height="1.2" rx=".6"/></g>
<g class="dots"><circle cx="30" cy="77.2" r="1.1"/><circle cx="40" cy="77.2" r="1.1"/><circle cx="50" cy="77.2" r="1.1"/><circle cx="60" cy="77.2" r="1.1"/><circle cx="70" cy="77.2" r="1.1"/></g>
<path class="spag" d="M38 77 c2 -7 5 3 7 -4 s-6 -5 -2 -8 s7 6 9 1 s-3 -9 3 -6 s2 8 6 3 M41 76 c3 -3 1 -8 6 -6 s5 5 8 0"/>
<rect class="rl" x="18" y="45" width="64" height="2" rx="1"/>
<g class="head"><rect class="hd2" x="44.5" y="41" width="11" height="10" rx="2"/><path class="nz" d="M48.4 51 h3.2 l-1 2.4 h-1.2 Z"/>
<circle class="glow" cx="50" cy="54.2" r="2.2"/><rect class="beam" x="49.6" y="54" width=".8" height="23"/></g>
<g class="wisp"><path d="M32 74 q2 -3 0 -6 q-2 -3 0 -6"/><path d="M50 62 q2 -3 0 -6 q-2 -3 0 -6"/><path d="M68 74 q2 -3 0 -6 q-2 -3 0 -6"/></g></g>
<rect class="dedge" x="17" y="35" width="2" height="52" rx="1"/>
<g class="top"><g class="ams"><rect class="bd" x="12" y="6" width="76" height="20" rx="5"/>${SPOOL}</g></g>
<g class="wn" transform="translate(66 37) scale(.55)"><path class="wt3" d="M14 3 l10 17 h-20 Z"/><line class="wx" x1="14" y1="9" x2="14" y2="14"/><circle class="wx2" cx="14" cy="17" r="1.1"/></g>
</svg>`;

const PCSS = `
.g.pr{--dc:var(--nv-a1);--dc-fg:var(--nv-a1-fg);--fc:var(--dc);
}
.g.pr.glow.on{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--dc) 45%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.pr .hd .ic.on{background:var(--dc);color:var(--dc-fg);box-shadow:0 0 14px color-mix(in srgb,var(--dc) 55%,transparent)}
.pr .hd small.er{color:var(--nv-error);opacity:1}
.pr .hb.li.on{background:var(--nv-accent);color:var(--nv-accent-fg);box-shadow:0 0 14px color-mix(in srgb,var(--nv-accent) 50%,transparent)}
.pr .demo{font-size:10.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;padding:3px 8px;border-radius:999px;background:var(--nv-chip);opacity:.75}
.mid{display:flex;gap:14px;align-items:center;min-width:0}
.scene{flex:none;width:40%;max-width:210px;min-width:130px;color:var(--nv-fg)}
.scene svg{display:block;width:100%;height:auto;overflow:visible}
.inf{flex:1;min-width:0;display:flex;flex-direction:column;gap:7px}
.big{display:flex;align-items:baseline;gap:8px;min-width:0}
.pc{font-size:28px;font-weight:600;line-height:1;letter-spacing:-.01em}.pc small{font-size:15px;font-weight:500;opacity:.7;margin-left:2px}
.ph{font-size:12.5px;opacity:.7;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bar{height:8px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden}
.bar i{display:block;height:100%;width:0;background:var(--dc);border-radius:4px;transition:width 1s}
.tm{display:flex;justify-content:space-between;gap:8px;font-size:12.5px;flex-wrap:wrap}.tm .rm{font-weight:600}.tm .en{opacity:.7}.tm:empty{display:none}
.kvs .kv{padding:6px 0}.kvs .kv:first-child{border-top:none}
.kvs .v b{font-weight:600;opacity:1}
.kvs .fi .k{flex:none}.kvs .fi .v{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}
.xtra{display:flex;flex-direction:column;gap:10px}.xtra:empty{display:none}
.xtra .fans{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:14px}
.xtra .row{cursor:pointer}.xtra .row .ic{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);flex:none}
.xtra .row.on .ic{background:var(--dc);color:var(--dc-fg)}.xtra .row .nm{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.25}
.xtra .row b,.xtra .row small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.xtra .row b{font-weight:600;font-size:13px}.xtra .row small{opacity:.65;font-size:11.5px}
.xtra .na{opacity:.45}
@container (max-width:340px){.xtra .fans{grid-template-columns:1fr}}
.cam{position:relative;border-radius:16px;overflow:hidden;background:rgba(0,0,0,.3);aspect-ratio:16/9;cursor:pointer}.cam[hidden]{display:none}
.cam img{display:block;width:100%;height:100%;object-fit:cover}
.amsl{display:flex;flex-direction:column;gap:8px}.amsl:empty{display:none}
.au{display:flex;align-items:center;gap:8px;min-width:0}
.au .an{font-size:11px;font-weight:600;opacity:.6;text-transform:uppercase;letter-spacing:.05em;width:54px;flex:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.au .ss{flex:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;min-width:0}
.au.x .ss{grid-template-columns:minmax(0,1fr)}
.slot{display:flex;align-items:center;gap:7px;padding:5px 7px;border-radius:12px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.06);min-width:0;font-size:11.5px}
.slot .sc{--r:0%;width:20px;height:20px;border-radius:50%;flex:none;position:relative;background:conic-gradient(var(--c,#777) var(--r),rgba(255,255,255,.15) 0)}
.slot .sc::after{content:'';position:absolute;inset:4px;border-radius:50%;background:var(--c,#777);box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}
.slot.emp .sc{background:repeating-linear-gradient(45deg,rgba(255,255,255,.18) 0 2px,transparent 2px 5px)}.slot.emp .sc::after{display:none}
.slot .st{min-width:0;display:flex;flex-direction:column;line-height:1.2}.slot b,.slot small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.slot b{font-weight:600}.slot small{opacity:.65;font-size:10.5px}
.slot.act{border-color:color-mix(in srgb,var(--dc) 70%,transparent);background:color-mix(in srgb,var(--dc) 20%,transparent)}
.slot.wn{border-color:color-mix(in srgb,var(--nv-warn) 70%,transparent)}
.als:empty{display:none}.pr .al[data-e]{cursor:pointer}.pr .al small{opacity:.7;margin-left:auto;font-size:11px;white-space:nowrap}
.acts{display:flex;gap:8px}.acts:empty,.acts[hidden]{display:none}
.ab{flex:1;min-width:0;height:44px;border-radius:16px;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);font-size:14px;font-weight:600;transition:background-color .2s,opacity .2s,transform .2s}
.ab ha-icon{--mdc-icon-size:22px}.ab.pri{background:var(--dc);color:var(--dc-fg);border-color:transparent;box-shadow:0 0 16px color-mix(in srgb,var(--dc) 40%,transparent)}
.ab.na{opacity:.4;pointer-events:none}.ab:active{transform:scale(.95)}
@container (max-width:380px){.mid{flex-direction:column;align-items:stretch}.scene{width:60%;max-width:200px;align-self:center}.au .ss{grid-template-columns:repeat(2,minmax(0,1fr))}}
/* Zeichnung: Gehäuse in Textfarbe, Filament in Spulenfarbe, Hitze und LEDs in der Gerätefarbe (wie Nova Gerät) */
.scene .bd{fill:currentColor;fill-opacity:.1;stroke:currentColor;stroke-opacity:.28;stroke-width:1.2}
.scene .gl,.scene .sw0{fill:rgba(0,0,0,.28);stroke:currentColor;stroke-opacity:.2;stroke-width:1}
.scene .ash{fill:rgba(0,0,0,.3)}.scene .ft{fill:currentColor;fill-opacity:.22}
.scene .lgt{fill:#fff;opacity:0;transition:opacity .5s}.lit .scene .lgt{opacity:.06}
.scene .pl,.scene .rl{fill:currentColor;fill-opacity:.24}.scene .ph2{fill:var(--dc);opacity:0}
.scene .hd2{fill:currentColor;fill-opacity:.16;stroke:currentColor;stroke-opacity:.32;stroke-width:1}
.scene .nz{fill:currentColor;fill-opacity:.4;transition:fill .3s}
.scene .glow{fill:var(--dc);opacity:0;transition:opacity .6s}
.scene .beam{fill:var(--dc);opacity:0}
.scene .ob{fill:var(--fc);fill-opacity:.8}
.scene .obj{display:none;transform-box:fill-box;transform-origin:center bottom;transition:transform .6s}.has-obj .scene .obj{display:inline}
.scene .cal rect{fill:var(--fc);opacity:0;transform-box:fill-box;transform-origin:left center}
.scene .dots circle{fill:var(--dc);opacity:0}
.scene .spag{fill:none;stroke:var(--fc);stroke-width:.9;stroke-linecap:round;opacity:0;stroke-dasharray:120;stroke-dashoffset:120}
.scene .tb{fill:none;stroke:currentColor;stroke-opacity:.28;stroke-width:1.6;stroke-linecap:round}
.scene .fil{fill:none;stroke:var(--fc);stroke-width:.9;stroke-linecap:round;stroke-dasharray:3 2.5;opacity:0}
.scene .head{transform-box:view-box;transition:transform 1s ease}
.scene .wisp path{fill:none;stroke:currentColor;stroke-opacity:.5;stroke-width:1;stroke-linecap:round;opacity:0}
.scene .door{transform-box:view-box;transform-origin:17px 61px;transition:transform .8s ease}.scene .dedge{fill:currentColor;fill-opacity:.4;opacity:0}
.scene .top{transform-box:view-box;transform-origin:88px 26px;transition:transform .8s ease}
.scene .fl{fill:var(--sc,#777);fill-opacity:.85;transition:opacity .4s}.scene .sl.emp .fl{opacity:0}
.scene .sled{fill:currentColor;fill-opacity:.2}.scene .sl.act .sled{fill:var(--dc);fill-opacity:1}
.scene .sl.wn .sw0{stroke:var(--nv-warn);stroke-opacity:1}.scene .sl{transform-box:fill-box}
.scene .xw{fill:var(--fc);fill-opacity:.8}.scene .xh{fill:rgba(0,0,0,.35)}
.scene .wn{display:none;--wc:var(--nv-warn)}.bad .scene .wn{--wc:var(--nv-error)}
.scene .wt3{fill:var(--wc);fill-opacity:.25;stroke:var(--wc);stroke-width:1.8;stroke-linejoin:round}.scene .wx{stroke:var(--wc);stroke-width:2.2;stroke-linecap:round}.scene .wx2{fill:var(--wc)}
.warn .scene .wn{display:inline}
.noams .scene .ams{display:none}.scene .xsp{display:none}.noams.xs .scene .xsp{display:inline}
/* Grundzustände */
.st-off .scene>svg{opacity:.55;transition:opacity .4s}
.st-print .scene .fil,.st-prep .scene .fil,.st-heat .scene .fil{opacity:.9}
.st-print .scene .glow,.st-prep .scene .glow{opacity:.2}
.st-heat .scene .glow{opacity:.7}.st-heat .scene .ph2{opacity:.4}.st-heat .scene .nz{fill:var(--dc);fill-opacity:1}
.st-pause .scene .glow{opacity:.15}
.st-idle .scene .head,.st-done .scene .head,.st-off .scene .head,.st-error .scene .head,.st-cool .scene .head{transform:translateX(20px)}
/* Bewegung nur mit .anim und sichtbar, dezent wie bei den Gerätekarten */
.anim.st-print .scene .head{animation:pr-x 3.2s ease-in-out infinite alternate}
.anim:is(.st-print,.st-prep,.st-heat) .scene .fil{animation:pr-flow 1.2s linear infinite}
.anim.st-heat .scene .glow,.anim.st-heat .scene .ph2{animation:pr-pulse 2.4s ease-in-out infinite}
.anim.st-pause .scene .sl.act .sled{animation:pr-blink 2s ease-in-out infinite}
.anim.st-cool .scene .wisp path{animation:pr-wisp 3s ease-out infinite}
.scene .wisp path:nth-child(2){animation-delay:.8s}.scene .wisp path:nth-child(3){animation-delay:1.6s}
.anim.warn .scene .wn{animation:pr-pop 1.6s ease-in-out infinite;transform-box:fill-box;transform-origin:center}
/* Meldungen */
.anim.m-level .scene .head{animation:pr-lvl 6s ease-in-out infinite}
.m-level .scene .dots circle{opacity:.9}.anim.m-level .scene .dots circle{animation:pr-dot 6s steps(1) infinite}
.anim.m-level .scene .dots circle:nth-child(2){animation-delay:1.2s}.anim.m-level .scene .dots circle:nth-child(3){animation-delay:2.4s}.anim.m-level .scene .dots circle:nth-child(4){animation-delay:3.6s}.anim.m-level .scene .dots circle:nth-child(5){animation-delay:4.8s}
.m-wipe .scene .head{transform:translateX(-24px)}.anim.m-wipe .scene .head{animation:pr-wipe .6s ease-in-out infinite alternate}
.m-calib .scene .cal rect{opacity:.9}.anim.m-calib .scene .cal rect{animation:pr-line 4s ease-out infinite}
.anim.m-calib .scene .cal rect:nth-child(2){animation-delay:1s}.anim.m-calib .scene .cal rect:nth-child(3){animation-delay:2s}.anim.m-calib .scene .cal rect:nth-child(4){animation-delay:3s}
.anim.m-calib .scene .head{animation:pr-cal 4s linear infinite}
.m-scan .scene .beam{opacity:.5}.anim.m-scan .scene .head{animation:pr-scan 3.2s ease-in-out infinite alternate}
.anim.m-home .scene .head{animation:pr-home 3s ease-in-out infinite}
.anim.m-change .scene .fil{animation:pr-chg 3s ease-in-out infinite}.anim.m-change .scene .sl.act .sled{animation:pr-blink .8s ease-in-out infinite}
.m-empty .scene .sl.act .fl{opacity:.15}.m-empty .scene .fil{animation:none!important;opacity:.2}
.anim:is(.m-empty,.m-tangle) .scene .sl.wn .sw0{animation:pr-blinks 1s ease-in-out infinite}
.anim.m-tangle .scene .sl.act .fl{animation:pr-jit .14s linear infinite}.m-tangle .scene .fil{animation:none!important}
.m-ams .scene .sled{fill:var(--nv-warn);fill-opacity:1}.anim.m-ams .scene .sled{animation:pr-blink 1s ease-in-out infinite}
.m-spaghetti .scene .spag{opacity:1;stroke-dashoffset:0}.anim.m-spaghetti .scene .spag{animation:pr-draw 3s ease-out infinite}
.m-shift .scene .obj{transform:translateX(4px) skewX(-8deg)}
.m-clog .scene .nz{fill:var(--nv-error);fill-opacity:1}.anim.m-clog .scene .nz{animation:pr-blink .8s ease-in-out infinite}.m-clog .scene .fil{animation:none!important}
.m-door .scene .door{transform:scaleX(.12)}.m-door .scene .dedge{opacity:1}
.m-lid .scene .top{transform:translateY(-4px) rotate(-4deg)}
.m-temp .scene .glow,.m-temp .scene .ph2{fill:var(--nv-error);opacity:.6}.anim.m-temp .scene .glow,.anim.m-temp .scene .ph2{animation:pr-pulse 1.2s ease-in-out infinite}
.still .scene *{animation-play-state:paused!important}
@media (prefers-reduced-motion:reduce){.scene *{animation:none!important;transition:none!important}}
@keyframes pr-x{from{transform:translateX(-12px)}to{transform:translateX(12px)}}
@keyframes pr-flow{to{stroke-dashoffset:-5.5}}
@keyframes pr-chg{0%,40%{stroke-dashoffset:0}20%{stroke-dashoffset:16}60%,100%{stroke-dashoffset:-16}}
@keyframes pr-pulse{0%,100%{opacity:.2}50%{opacity:.75}}
@keyframes pr-blink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes pr-blinks{0%,100%{stroke-opacity:1}50%{stroke-opacity:.2}}
@keyframes pr-wisp{0%{opacity:0;transform:translateY(3px)}40%{opacity:.6}100%{opacity:0;transform:translateY(-8px)}}
@keyframes pr-pop{0%,100%{transform:translate(66px,37px) scale(.55)}50%{transform:translate(66px,37px) scale(.63)}}
@keyframes pr-lvl{0%,100%{transform:translateX(-20px)}20%{transform:translateX(-10px)}40%{transform:translateX(0)}60%{transform:translateX(10px)}80%{transform:translateX(20px)}}
@keyframes pr-dot{0%{opacity:.15}100%{opacity:.9}}
@keyframes pr-wipe{from{transform:translateX(-26px)}to{transform:translateX(-22px)}}
@keyframes pr-line{0%{opacity:0;transform:scaleX(0)}20%{opacity:.9;transform:scaleX(1)}90%{opacity:.9}100%{opacity:0}}
@keyframes pr-cal{0%{transform:translateX(-19px)}100%{transform:translateX(14px)}}
@keyframes pr-scan{from{transform:translateX(-22px)}to{transform:translateX(22px)}}
@keyframes pr-home{0%,100%{transform:translateX(0)}35%,55%{transform:translateX(-24px)}}
@keyframes pr-jit{0%,100%{transform:translateX(0)}50%{transform:translateX(.5px)}}
@keyframes pr-draw{0%{stroke-dashoffset:120}60%,100%{stroke-dashoffset:0}}`;

export class NovaPrinterCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('drucker-card-editor')); }
  static getStubConfig(h) {
    const e = Object.values(h?.entities || {}).find(x => x.platform === 'bambu_lab' && x.device_id && /print_status|druckstatus/.test(`${x.translation_key} ${x.entity_id}`));
    return e ? {device: e.device_id} : {demo: 'print'};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    this._c = {...PDEF, ...c, ams_trays: [].concat(c.ams_trays || []).filter(Boolean), hide_messages: [].concat(c.hide_messages || [])};
    this._built = false;
    this._ids = new Set();
    if (this._h) { this._build(); this._update(); }
  }
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    if (!this._built) this._build();
    else if (!hassChanged(old, h, this._ids)) return;
    this._update();
  }
  getCardSize() { return 6; }
  getGridOptions() { return {columns: 12, rows: 'auto', min_columns: 6}; }
  connectedCallback() {
    this._quiet = inPicker(this);
    this._onVis ||= () => this._tick();
    document.addEventListener('visibilitychange', this._onVis);
    if ('IntersectionObserver' in window) {
      this._io ||= new IntersectionObserver(es => { this._inView = es[es.length - 1].isIntersecting; this._tick(); }, {rootMargin: '100px'});
      this._io.observe(this);
    } else this._inView = true;
    this._tick();
  }
  disconnectedCallback() {
    document.removeEventListener('visibilitychange', this._onVis);
    this._io?.disconnect();
    this._inView = false;
    this._tick();
    clearTimeout(this._ft);
  }
  _S(id) { return id ? this._h?.states[id] : null; }
  // Eingetragene Entitäten, fehlende vom Gerät
  _ents() {
    const h = this._h, c = this._c, dev = printerDev(h, c);
    if (this._detKey !== `${dev}|${Object.keys(h.entities || {}).length}`) { this._detKey = `${dev}|${Object.keys(h.entities || {}).length}`; this._det = detect(h, dev); }
    const out = {};
    EKEYS.forEach(k => { out[k] = c[k] || this._det[k] || null; });
    this._fans = c.show_fans === false ? [] : [].concat(c.fans?.length ? c.fans : this._det.fans || []);
    this._sws = c.show_switches === false ? [] : [].concat(c.switches || []);
    return {e: out, dev};
  }
  _build() {
    this._built = true;
    const c = this._c, r = this.shadowRoot || this.attachShadow({mode: 'open'}), rv = roleVars(c.color);
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${PCSS}</style>
<div class="g pr${c.animation !== false ? ' anim' : ''}${c.glow !== false ? ' glow' : ''}" style="--dc:${rv.c};--dc-fg:${rv.fg}">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div><span class="demo" hidden>Demo</span><div class="hb li" hidden title="Kammerlicht"><ha-icon icon="mdi:lightbulb-outline"></ha-icon></div></div>
<div class="mid"><div class="scene">${SCENE}</div><div class="inf"><div class="big"><span class="pc"></span><span class="ph"></span></div><div class="bar"><i></i></div>
<div class="tm"><span class="rm"></span><span class="en"></span></div><div class="kvs"></div></div></div>
<div class="cam" hidden><img alt=""></div><div class="amsl"></div><div class="als"></div><div class="acts"></div><div class="xtra"></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), demo: q('.demo'), li: q('.li'), pc: q('.pc'), ph: q('.ph'), bar: q('.bar'), bari: q('.bar i'),
      rm: q('.rm'), en: q('.en'), kvs: q('.kvs'), amsl: q('.amsl'), xtra: q('.xtra'), als: q('.als'), acts: q('.acts'), svg: q('.scene svg'),
      ocr: q('.ocr'), cam: q('.cam'), img: q('.cam img'), sl: [0, 1, 2, 3].map(i => ({g: q(`.sl.s${i}`), fl: q(`.s${i} .fl`)}))};
    const e = this._e;
    press(e.ic, {tap: () => this._act({entity: this._en?.status, tap_action: c.tap_action}, 'tap', true), hold: () => this._act({entity: this._en?.status, hold_action: c.hold_action}, 'hold')});
    press(e.li, {tap: () => this._light(), isolate: true});
    press(e.cam, {tap: () => this._act({entity: c.camera}, 'tap', true)});
    e.img.addEventListener('error', () => { e.cam.hidden = true; this._camErr = e.img.getAttribute('src'); });
    e.img.addEventListener('load', () => { if (this._camSrc === e.img.getAttribute('src')) e.cam.hidden = false; });
    e.als.addEventListener('click', ev => { const el = ev.target.closest?.('.al[data-e]'); if (el) this._act({entity: el.dataset.e}, 'tap', true); });
    this._ab = {};
    [['pause', 'mdi:pause', 'Pause'], ['resume', 'mdi:play', 'Fortsetzen'], ['stop', 'mdi:stop', 'Stopp']].forEach(([k, ic, t]) => {
      const el = document.createElement('div');
      el.className = `ab a-${k}${k === 'resume' ? ' pri' : ''}`;
      el.innerHTML = `<ha-icon icon="${ic}"></ha-icon><span>${t}</span>`;
      el.hidden = true;
      press(el, {tap: () => this._do(k)});
      e.acts.append(el);
      this._ab[k] = el;
    });
    this._prev = null;
    this._tick();
  }
  // Ansichtsmodell aus HA (oder Demo)
  _model() {
    const c = this._c, h = this._h;
    if (c.demo) return this._demo();
    const {e: en, dev} = this._ents();
    this._en = en;
    this._ids = new Set([...entityIds(c), ...Object.values(en).filter(Boolean), ...this._fans, ...this._sws, c.camera].filter(Boolean));
    const S = k => this._S(en[k]);
    const st = S('status'), raw = String(st?.state || '').toLowerCase(), stg = S('stage'), sv = ok(stg) ? stg.state : null;
    const on = S('online'), p0 = num(S('progress'));
    const hide = new Set(c.hide_messages);
    const smap = sv && STAGES[sv], skey = smap ? [].concat(smap)[0] : null, spause = Array.isArray(smap);
    let cls;
    if (!st || raw === 'unavailable' || raw === 'offline' || (on && on.state === 'off')) cls = 'off';
    else if (raw === 'failed') cls = 'error';
    else if (raw === 'pause' || PAUSE_STAGES.includes(sv) || spause) cls = 'pause';
    else if (raw === 'finish') cls = skey === 'cool' ? 'cool' : 'done';
    else if (raw === 'running' || raw === 'prepare' || raw === 'slicing' || raw === 'init') cls = skey === 'heat' ? 'heat' : skey === 'cool' ? 'cool' : sv === 'printing' || (raw === 'running' && !skey) ? 'print' : 'prep';
    else cls = skey === 'cool' ? 'cool' : 'idle';
    // Meldungen: Fehler-Sensoren, Pausengrund, Tür
    const msgs = [];
    const lvlOrd = {error: 0, warning: 1, info: 2};
    parseErrors(S('print_error'), 'error').forEach(m => msgs.push({...m, ent: en.print_error}));
    parseErrors(S('hms'), 'warning').forEach(m => msgs.push({...m, ent: en.hms}));
    if (spause) msgs.push({key: skey, text: fmtState(h, stg), lvl: MSG[skey].lvl === 'info' ? 'warning' : MSG[skey].lvl, ent: en.stage});
    const dr = S('door');
    if (dr && dr.state === 'on') msgs.push({key: 'door', text: MSG.door.text, lvl: 'warning', ent: en.door});
    const shown = msgs.filter(m => !hide.has(m.key)).sort((a, b) => lvlOrd[a.lvl] - lvlOrd[b.lvl]);
    let fx = shown.find(m => MSG[m.key])?.key || null;
    if (!fx && skey && !spause && !hide.has(skey) && cls !== 'off') fx = skey;
    const rs = S('remaining'), es = S('end_time');
    let rem = null, end = null;
    const r0 = num(rs);
    if (r0 != null) rem = r0 * (SECS[rs.attributes.unit_of_measurement] ?? 60);
    if (ok(es)) { const t = Date.parse(es.state); if (!isNaN(t)) end = t; }
    if (end == null && rem != null && cls !== 'pause') end = Date.now() + rem * 1000;
    const tr = trays(h, c, dev);
    const lt = S('light');
    const nT = num(S('nozzle_target')), bT = num(S('bed_target'));
    return {cls, fx, msgs: shown, p: cls === 'done' || cls === 'cool' && raw === 'finish' ? 100 : p0, rem, end, layer: num(S('layer')), layers: num(S('layers')),
      noz: num(S('nozzle')), nozT: nT, bed: num(S('bed')), bedT: bT, file: ok(S('file')) ? S('file').state : '',
      status: st ? (cls === 'off' && !ok(st) ? 'Nicht verfügbar' : fmtState(h, st)) : 'Drucker im Editor wählen', stage: sv && !QUIET_STAGES.includes(sv) ? fmtState(h, stg) : '',
      units: tr.units, ext: tr.ext, light: lt ? lt.state === 'on' : null, lightEnt: en.light, name: h.devices?.[dev]?.name_by_user || h.devices?.[dev]?.name || ''};
  }
  _demo() {
    const c = this._c, cls = CLS.includes(c.demo) ? c.demo : 'print', mk = MSG[c.demo_message] ? c.demo_message : null;
    this._ids = new Set();
    const act = ['print', 'pause', 'prep', 'heat'].includes(cls), p = cls === 'done' || cls === 'cool' ? 100 : ['print', 'pause', 'error'].includes(cls) ? 42 : act ? 0 : null;
    const msgs = mk && MSG[mk].lvl !== 'info' ? [{key: mk, text: MSG[mk].text, lvl: MSG[mk].lvl}] : [];
    if (cls === 'error' && !msgs.length) msgs.push({key: 'warn', text: 'Druck fehlgeschlagen', lvl: 'error'});
    const units = c.demo_ams === false ? [] : JSON.parse(JSON.stringify(DEMO_AMS));
    if (mk === 'change') { units[0].slots[0].act = false; units[0].slots[1].act = true; }
    if (['empty', 'tangle'].includes(mk) && units[0]) { units[0].slots[0].rem = mk === 'empty' ? 0 : 82; }
    return {cls, fx: mk, msgs, p, rem: act ? 4320 : null, end: act ? Date.now() + 4320e3 : null, layer: act ? 84 : null, layers: act ? 200 : null,
      noz: cls === 'heat' ? 187 : act ? 220 : cls === 'cool' ? 96 : 26, nozT: act ? 220 : 0, bed: cls === 'heat' ? 48 : act ? 60 : cls === 'cool' ? 41 : 24, bedT: act ? 60 : 0,
      file: cls === 'idle' || cls === 'off' ? '' : 'Benchy_0.2mm_PLA.3mf', status: CTXT[cls], stage: mk ? MSG[mk].text : '', units,
      ext: c.demo_ams === false ? {c: '#3d8bf5', mat: 'PLA', name: 'PLA Basic', rem: null, act: true} : null, light: this._dl ?? true, demo: true, name: '3D-Drucker'};
  }
  _update() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !e) return;
    const m = this._m = this._model(), g = e.g, cls = m.cls;
    if (this._prev && this._prev !== cls && cls === 'done') { g.classList.remove('st-done'); void g.offsetWidth; }
    this._prev = cls;
    CLS.forEach(k => g.classList.toggle(`st-${k}`, k === cls));
    Object.keys(MSG).forEach(k => g.classList.toggle(`m-${k}`, m.fx === k));
    const act = ['print', 'pause', 'prep', 'heat'].includes(cls);
    const bad = cls === 'error' || m.msgs.some(x => x.lvl === 'error');
    g.classList.toggle('bad', bad);
    g.classList.toggle('on', act && c.glow !== false);
    g.classList.toggle('lit', m.light !== false);
    this.classList.toggle('nv-na', cls === 'off' && !m.demo && !this._S(this._en?.status));
    // Warnsymbol in der Zeichnung bei Fehlern und Warnungen
    g.classList.toggle('warn', bad || !!(m.fx && MSG[m.fx].lvl !== 'info'));
    // Kopf
    e.name.textContent = c.name ?? m.name ?? '3D-Drucker';
    setIcon(e.ic, c.icon || 'mdi:printer-3d');
    e.ic.classList.toggle('on', act);
    e.sub.textContent = m.status;
    e.sub.classList.toggle('er', bad);
    e.demo.hidden = !m.demo;
    e.li.hidden = c.show_light === false || (m.light == null && !m.demo);
    e.li.classList.toggle('on', !!m.light);
    // AMS und Filamentfarbe
    const units = m.units || [], aU = units.find(u => u.slots.some(s => s.act)) || units[0];
    const actSlot = aU?.slots.find(s => s.act) || (m.ext?.act ? m.ext : null) || m.ext;
    const ams = c.ams === 'show' || (c.ams === 'auto' && units.length > 0);
    g.classList.toggle('noams', !ams);
    g.classList.toggle('xs', !ams && !!m.ext);
    g.style.setProperty('--fc', actSlot?.c || 'var(--dc)');
    e.svg.setAttribute('viewBox', ams ? '0 3 100 96' : (m.ext ? '0 7 100 92' : '0 24 100 75'));
    const wnSlot = ['empty', 'tangle'].includes(m.fx);
    e.sl.forEach((x, i) => {
      const s = aU?.slots[i], f = s ? (s.empty ? 0 : s.rem == null ? .8 : Math.max(.15, s.rem / 100)) : 0, hh = 7 * f;
      x.fl.setAttribute('y', (18.5 - hh).toFixed(2)); x.fl.setAttribute('height', hh.toFixed(2));
      x.g.classList.toggle('act', !!s?.act); x.g.classList.toggle('emp', !s || !!s.empty); x.g.classList.toggle('wn', !!s?.act && wnSlot);
      x.g.style.setProperty('--sc', s?.c || '#777');
    });
    // Objekt wächst mit dem Fortschritt von der Druckplatte nach oben
    const p = m.p != null ? Math.max(0, Math.min(100, m.p)) / 100 : 0;
    const showObj = ['print', 'pause', 'done', 'cool', 'error', 'prep', 'heat'].includes(cls) && (p > 0 || cls === 'done');
    const pp = cls === 'done' || cls === 'cool' ? Math.max(p, showObj ? 1 : 0) : p;
    g.classList.toggle('has-obj', showObj && pp > 0);
    e.ocr.setAttribute('y', (78 - 22 * pp).toFixed(2));
    e.ocr.setAttribute('height', (22 * pp).toFixed(2));
    this._cam(cls);
    // Infos
    const sp = c.show_progress !== false && m.p != null && (act || cls === 'done');
    e.pc.innerHTML = sp ? `${Math.round(m.p)}<small>%</small>` : '';
    e.pc.hidden = !sp;
    e.ph.textContent = c.show_stage !== false && m.stage ? m.stage : '';
    e.bar.hidden = !sp;
    if (sp) e.bari.style.width = `${m.p}%`;
    e.rm.textContent = c.show_remaining !== false && act && m.rem != null ? `noch ${fmtDur(m.rem)}` : '';
    e.en.textContent = c.show_end_time !== false && act && m.end != null && cls !== 'pause' ? `fertig um ${this._clock(m.end)}` : '';
    const rows = [];
    const row = (ic, k, v, x = '') => rows.push(`<div class="kv${x}"><ha-icon icon="${ic}"></ha-icon><span class="k">${esc(k)}</span><span class="v">${v}</span></div>`);
    const tmp = (v, t) => v == null ? '–' : `<b>${Math.round(v)}</b>${t ? ` / ${Math.round(t)}` : ''} °C`;
    if (c.show_layer !== false && m.layer != null && (act || cls === 'done')) row('mdi:layers-triple-outline', 'Schicht', `<b>${m.layer}</b> / ${m.layers ?? '?'}`);
    if (c.show_nozzle !== false && m.noz != null) row('mdi:printer-3d-nozzle-heat-outline', 'Düse', tmp(m.noz, m.nozT));
    if (c.show_bed !== false && m.bed != null) row('mdi:radiator', 'Bett', tmp(m.bed, m.bedT));
    if (c.show_file !== false && m.file) row('mdi:file-outline', 'Datei', esc(m.file), ' fi');
    const kh = rows.join('');
    if (this._kk !== kh) { this._kk = kh; e.kvs.innerHTML = kh; }
    this._amsList(m, ams);
    this._alerts(m);
    this._acts(m);
    this._xtra();
    this._tick();
  }
  // Kamerabild unter der Zeichnung: immer oder nur beim Drucken, nicht verfügbar = ausgeblendet
  _cam(cls) {
    const c = this._c, e = this._e, s = this._S(c.camera), pic = s?.attributes.entity_picture;
    const want = !!c.camera && !c.demo && ok(s) && !!pic && (c.camera_mode !== 'printing' || ['print', 'prep', 'heat', 'pause'].includes(cls));
    const live = want && dom(c.camera) === 'camera';
    if (!want) { e.cam.hidden = true; e.img.removeAttribute('src'); this._camSrc = null; }
    else {
      // Kamera: Standbild alle 10 s neu (über _tick), Bild-Entität: neu bei jeder Zustandsänderung
      const src = `${pic}${pic.includes('?') ? '&' : '?'}_=${live ? this._camT || 0 : encodeURIComponent(s.state)}`;
      if (src !== this._camSrc) { this._camSrc = src; e.img.src = src; }
      e.cam.hidden = this._camErr === src;
    }
    this._camLive = live;
  }
  _amsList(m, ams) {
    const c = this._c, us = [...(ams ? m.units : []), ...(m.ext ? [{name: 'Extern', slots: [m.ext], x: true}] : [])];
    const wn = ['empty', 'tangle'].includes(m.fx);
    const html = c.show_ams_list === false ? '' : us.map(u => `<div class="au${u.x ? ' x' : ''}"><span class="an">${esc(u.name)}</span><div class="ss">${u.slots.map(s => {
      const r = s.empty ? 0 : s.rem;
      return `<div class="slot${s.act ? ' act' : ''}${s.empty ? ' emp' : ''}${s.act && wn ? ' wn' : ''}" title="${esc(s.name)}" style="--c:${s.c || '#777'};--r:${r == null ? 100 : r}%"${s.id ? ` data-e="${esc(s.id)}"` : ''}>
<span class="sc"></span><span class="st"><b>${esc(s.empty ? 'Leer' : s.mat || '–')}</b><small>${s.empty ? '' : r == null ? esc(s.name !== s.mat ? s.name : '') : `${Math.round(r)} %`}</small></span></div>`;
    }).join('')}</div></div>`).join('');
    if (this._ak !== html) {
      this._ak = html;
      this._e.amsl.innerHTML = html;
      this._e.amsl.querySelectorAll('.slot[data-e]').forEach(el => press(el, {tap: () => this._act({entity: el.dataset.e}, 'tap', true)}));
    }
  }
  // Lüfter (Regler) und weitere Schalter unter der Zeichnung
  _xtra() {
    // Name ohne Gerätenamen davor („Büro 3D-Drucker Bauteillüfter“ → „Bauteillüfter“)
    const short = (h, id) => {
      const n = nameOf(h, {entity: id}), d = h.devices?.[h.entities?.[id]?.device_id], dn = d?.name_by_user || d?.name;
      return dn && n.startsWith(`${dn} `) ? n.slice(dn.length + 1) : n;
    };
    const h = this._h, fans = this._c.demo ? [] : this._fans || [], sws = this._c.demo ? [] : this._sws || [], key = `${fans}|${sws}`;
    if (this._xk !== key) {
      this._xk = key;
      const box = this._e.xtra;
      box.textContent = '';
      this._xu = [];
      if (fans.length) {
        const sec = document.createElement('div');
        sec.innerHTML = '<div class="bt">Lüfter</div><div class="fans"></div>';
        fans.forEach(id => {
          const el = document.createElement('div');
          el.className = 'sl';
          el.innerHTML = '<div class="kv"><ha-icon></ha-icon><span class="k"></span><span class="v"></span></div><input type="range" min="0" max="100">';
          const inp = el.lastChild, v = el.querySelector('.v'), D = SLIDE.fan;
          press(el.firstChild, {tap: () => this._act({entity: id}, 'tap', true)});
          const paint = () => { inp.style.setProperty('--p', `${+inp.value}%`); v.textContent = `${Math.round(+inp.value)} %`; };
          inp.addEventListener('input', () => { el._drag = true; paint(); });
          inp.addEventListener('change', () => { D.set(this._h, id, +inp.value); clearTimeout(el._t); el._t = setTimeout(() => { el._drag = false; }, 1500); });
          sec.lastChild.append(el);
          this._xu.push(h => {
            const s = h.states[id], na = !s || s.state === 'unavailable';
            el.classList.toggle('na', na); inp.disabled = na;
            el.querySelector('ha-icon').icon = iconOf(h, {entity: id}, 'mdi:fan');
            el.querySelector('.k').textContent = short(h, id);
            if (!s) { v.textContent = '–'; return; }
            inp.step = D.r(s.attributes)[2];
            if (!el._drag) inp.value = D.v(s);
            paint();
          });
        });
        box.append(sec);
      }
      if (sws.length) {
        const sec = document.createElement('div');
        sec.innerHTML = '<div class="bt">Schalter</div><div class="list" style="--cols:2"></div>';
        sws.forEach(id => {
          const el = document.createElement('div');
          el.className = 'row';
          el.innerHTML = `<div class="ic"><ha-icon></ha-icon></div><div class="nm"><b></b><small></small></div>${TOGGLE.includes(dom(id)) ? '<div class="sw"></div>' : ''}`;
          press(el, {tap: () => this._act({entity: id}, 'tap'), hold: () => this._act({entity: id}, 'hold')});
          sec.lastChild.append(el);
          this._xu.push(h => {
            const s = h.states[id];
            el.classList.toggle('na', !s || s.state === 'unavailable');
            el.classList.toggle('on', isOn(s));
            el.querySelector('ha-icon').icon = iconOf(h, {entity: id}, 'mdi:toggle-switch-outline');
            el.querySelector('b').textContent = short(h, id);
            el.querySelector('small').textContent = s ? valueOf(h, s, {entity: id}) : 'nicht gefunden';
          });
        });
        box.append(sec);
      }
    }
    this._xu.forEach(u => u(h));
  }
  _alerts(m) {
    const c = this._c;
    const html = c.show_message === false ? '' : m.msgs.map(x => {
      const M = MSG[x.key] || MSG.warn;
      return `<div class="al ${x.lvl}"${x.ent ? ` data-e="${esc(x.ent)}"` : ''}><ha-icon icon="${M.icon}"></ha-icon><span>${esc(x.text || M.text)}</span>${x.code ? `<small>${esc(x.code)}</small>` : ''}</div>`;
    }).join('');
    if (this._alk !== html) { this._alk = html; this._e.als.innerHTML = html; }
    this._e.g.classList.toggle('err', m.msgs.some(x => x.lvl === 'error') && c.glow !== false);
  }
  _acts(m) {
    const c = this._c, b = this._ab, en = this._en || {}, cls = m.cls;
    const av = k => m.demo || (!!en[k] && this._S(en[k]) && this._S(en[k]).state !== 'unavailable');
    const run = ['print', 'prep', 'heat'].includes(cls);
    b.pause.hidden = !run || !av('pause');
    b.resume.hidden = cls !== 'pause' || !av('resume');
    b.stop.hidden = !(run || cls === 'pause') || !av('stop');
    this._e.acts.hidden = c.show_controls === false || Object.values(b).every(x => x.hidden);
  }
  _do(k) {
    const c = this._c, id = this._en?.[k];
    if (k === 'stop' && c.stop_confirm && !window.confirm(c.stop_confirm)) return;
    if (this._m?.demo) return;
    if (!id) return;
    Promise.resolve(this._h.callService(dom(id) === 'button' ? 'button' : dom(id), dom(id) === 'button' ? 'press' : 'turn_on', {entity_id: id}))
      .catch(err => this._flash(`${{pause: 'Pause', resume: 'Fortsetzen', stop: 'Stopp'}[k]}: ${err?.message || err}`));
  }
  _light() {
    if (this._m?.demo) { this._dl = !(this._dl ?? true); this._update(); return; }
    const id = this._m?.lightEnt;
    if (id) Promise.resolve(this._h.callService('light', 'toggle', {entity_id: id})).catch(err => this._flash(`Licht: ${err?.message || err}`));
  }
  _flash(msg) {
    clearTimeout(this._ft);
    const el = document.createElement('div');
    el.className = 'al error'; el.innerHTML = `<ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${esc(msg)}</span>`;
    this._e.als.prepend(el); this._alk = null;
    this._ft = setTimeout(() => this._update(), 8000);
  }
  _clock(ms) {
    const h = this._h, d = new Date(ms), far = ms - Date.now() > 20 * 3600e3;
    try { return new Intl.DateTimeFormat(langOf(h), {hour: '2-digit', minute: '2-digit', ...(far ? {weekday: 'short'} : {}), timeZone: tzOf(h)}).format(d); } catch { return d.toLocaleTimeString().slice(0, 5); }
  }
  // Animation nur, wenn sichtbar; Restzeit/Endzeit jede Minute neu
  _tick() {
    const vis = !!this._inView && !document.hidden && !this._quiet && this.isConnected;
    this._e?.g.classList.toggle('still', !vis);
    const run = vis && this._e && ['print', 'prep', 'heat'].includes(this._prev);
    if (run && !this._tm) this._tm = setInterval(() => this._update(), 60000);
    if (!run && this._tm) { clearInterval(this._tm); this._tm = null; }
    const cam = vis && this._e && this._camLive;
    if (cam && !this._ct) this._ct = setInterval(() => { this._camT = Date.now(); this._cam(this._prev); }, 10000);
    if (!cam && this._ct) { clearInterval(this._ct); this._ct = null; }
  }
  _act(o, kind, info) { return runAction(this, o, kind, info); }
}
define('drucker-card', NovaPrinterCard, {name: 'Nova 3D-Drucker Card', description: '3D-Drucker (Bambu Lab) mit animierter Druckerzeichnung, AMS, Fortschritt, Temperaturen, Meldungen und Pause/Fortsetzen/Stopp.', documentationURL: docUrl('nova-3d-drucker-card')});

/* ---------- Editor 3D-Drucker Card ---------- */
const SE = d => ({entity: {domain: d}});
const PGEN = [{name: 'device', selector: {device: {filter: {integration: 'bambu_lab'}}}}, g2({name: 'name', selector: T}, {name: 'icon', selector: I})];
const PENT = [
  g2({name: 'status', selector: SE('sensor')}, {name: 'stage', selector: SE('sensor')}),
  g2({name: 'progress', selector: SE('sensor')}, {name: 'file', selector: SE('sensor')}),
  g2({name: 'remaining', selector: SE('sensor')}, {name: 'end_time', selector: SE('sensor')}),
  g2({name: 'layer', selector: SE('sensor')}, {name: 'layers', selector: SE('sensor')}),
  g2({name: 'nozzle', selector: SE('sensor')}, {name: 'nozzle_target', selector: SE('sensor')}),
  g2({name: 'bed', selector: SE('sensor')}, {name: 'bed_target', selector: SE('sensor')}),
  g2({name: 'hms', selector: SE('binary_sensor')}, {name: 'print_error', selector: SE('binary_sensor')}),
  g2({name: 'door', selector: SE('binary_sensor')}, {name: 'online', selector: SE('binary_sensor')}),
];
const PCTL = [
  g2({name: 'pause', selector: SE(['button', 'script'])}, {name: 'resume', selector: SE(['button', 'script'])}),
  g2({name: 'stop', selector: SE(['button', 'script'])}, {name: 'light', selector: SE(['light', 'switch'])}),
  {name: 'stop_confirm', selector: T},
];
const PAMS = [sel('ams', [['auto', 'Automatisch (nur wenn ein AMS gefunden wird)'], ['show', 'Mit AMS'], ['hide', 'Ohne AMS']]),
  {name: 'ams_trays', selector: {entity: {domain: 'sensor', multiple: true}}}, {name: 'external_spool', selector: SE('sensor')}];
const PCAM = [{name: 'camera', selector: {entity: {domain: ['camera', 'image']}}}, sel('camera_mode', [['always', 'Kamera immer'], ['printing', 'Kamera nur beim Drucken']])];
const PXTRA = [{name: 'fans', selector: {entity: {domain: 'fan', multiple: true}}}, {name: 'switches', selector: {entity: {multiple: true}}}];
const PSHOW = [g2(...['progress', 'remaining'].map(k => ({name: `show_${k}`, selector: {boolean: {}}}))), g2(...['end_time', 'layer'].map(k => ({name: `show_${k}`, selector: {boolean: {}}}))),
  g2(...['nozzle', 'bed'].map(k => ({name: `show_${k}`, selector: {boolean: {}}}))), g2(...['file', 'stage'].map(k => ({name: `show_${k}`, selector: {boolean: {}}}))),
  g2(...['message', 'ams_list'].map(k => ({name: `show_${k}`, selector: {boolean: {}}}))), g2(...['controls', 'light'].map(k => ({name: `show_${k}`, selector: {boolean: {}}}))),
  g2(...['fans', 'switches'].map(k => ({name: `show_${k}`, selector: {boolean: {}}})))];
const MKEYS = Object.keys(MSG);
const PMSG = [];
for (let i = 0; i < MKEYS.length; i += 2) PMSG.push(g2(...MKEYS.slice(i, i + 2).map(k => ({name: `msg_${k}`, selector: {boolean: {}}}))));
const PLOOK = [g2(ROLE('color'), {name: 'glow', selector: {boolean: {}}}), {name: 'animation', selector: {boolean: {}}}];
const PDEMO = [sel('demo', [['', 'Aus'], ...DEMO_STATES]), sel('demo_message', [['', 'Keine'], ...MKEYS.map(k => [k, MSG[k].label])]), {name: 'demo_ams', selector: {boolean: {}}}];
const PACTS = [g2({name: 'tap_action', selector: A}, {name: 'hold_action', selector: A})];
const PLABELS = {...BASE_LABELS, device: 'Drucker (Bambu-Lab-Gerät)', status: 'Druckstatus', stage: 'Druckphase (Arbeitsschritt)', progress: 'Fortschritt (%)', file: 'Dateiname / Auftrag',
  remaining: 'Restzeit', end_time: 'Endzeit', layer: 'Aktuelle Schicht', layers: 'Schichten gesamt', nozzle: 'Düse', nozzle_target: 'Düse Ziel', bed: 'Bett', bed_target: 'Bett Ziel',
  hms: 'HMS-Fehler', print_error: 'Druckfehler', door: 'Tür (falls vorhanden)', online: 'Online', pause: 'Pause', resume: 'Fortsetzen', stop: 'Stopp', light: 'Kammerlicht',
  stop_confirm: 'Rückfrage vor dem Stopp', ams: 'AMS', ams_trays: 'AMS-Slots', external_spool: 'Externe Spule', color: 'Farbe', glow: 'Rahmen leuchtet beim Drucken',
  animation: 'Animation (aus = Standbild)', demo: 'Demo-Zustand', demo_message: 'Demo-Meldung', demo_ams: 'Demo mit AMS',
  show_progress: 'Fortschritt', show_remaining: 'Restzeit', show_end_time: 'Endzeit', show_layer: 'Schicht', show_nozzle: 'Düsentemperatur', show_bed: 'Betttemperatur',
  show_file: 'Dateiname', show_stage: 'Druckphase', show_message: 'Meldungen', show_ams_list: 'AMS-Slots als Liste', show_controls: 'Knöpfe', show_light: 'Licht-Knopf', show_fans: 'Lüfter', show_switches: 'Schalter',
  camera: 'Kamera', camera_mode: 'Kamerabild zeigen', fans: 'Lüfter (Regler)', switches: 'Weitere Schalter und Werte',
  ...Object.fromEntries(MKEYS.map(k => [`msg_${k}`, MSG[k].label]))};
const PHELPERS = {
  device: 'Füllt alle Entitäten unten automatisch aus. Leere Felder sucht die Karte selbst am Gerät',
  stage: 'Steuert die Animationen der Druckphasen (Leveln, Wischen, Kalibrieren …)',
  ams_trays: 'Leer = alle AMS-Einheiten am Drucker automatisch. Bis zu 4 Slots pro Einheit',
  ams: 'Ohne AMS zeigt die Zeichnung die Spule am Drucker (externe Spule)',
  external_spool: 'Leer = automatisch',
  camera: 'Kamera- oder Bild-Entität. Das Bild steht unter der Zeichnung, antippen öffnet es groß. Nicht verfügbar = ausgeblendet',
  fans: 'Leer = alle Lüfter des Druckers automatisch',
  switches: 'Z. B. Kamera, Zeitraffer oder WLAN-Signal. Schalter lassen sich antippen, andere Werte öffnen die Details',
  stop_confirm: 'Leer = ohne Rückfrage',
  door: 'Nur Drucker mit Türsensor. Offen = Tür klappt in der Zeichnung auf',
  color: 'Farbrolle aus dem Theme (Fortschritt, Knöpfe; das Objekt hat die Farbe des aktiven Filaments)',
  demo: 'Zeigt Beispielwerte statt der echten Daten – zum Ausprobieren. Vor dem Speichern wieder auf „Aus“',
};

class NovaPrinterCardEditor extends NovaEditorBase {
  static labels = PLABELS;
  static helpers = PHELPERS;
  static openSections = ['general'];
  _build() {
    const r = this.shadowRoot, c0 = this._config;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}.demo-btns{display:flex;gap:8px;flex-wrap:wrap}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap');
    const strip = c => { Object.entries(PDEF).forEach(([k, x]) => c[k] === x && delete c[k]); ['demo', 'demo_message'].forEach(k => !c[k] && delete c[k]); if (c.demo_ams === true) delete c.demo_ams; return c; };
    const hide = new Set([].concat(c0.hide_messages || []));
    const data = {...PDEF, demo_ams: true, ...c0, ...Object.fromEntries(MKEYS.map(k => [`msg_${k}`, !hide.has(k)]))};
    const form = schema => this._form(schema, data, v => {
      let c = merge(this._config, names(schema).filter(n => !n.startsWith('msg_')), v);
      if (names(schema).some(n => n.startsWith('msg_'))) {
        const hm = MKEYS.filter(k => v[`msg_${k}`] === false);
        if (hm.length) c.hide_messages = hm; else delete c.hide_messages;
      }
      // Neues Gerät → Entitäten vom Gerät vorbelegen
      if (v.device !== undefined && v.device !== this._config.device) {
        [...EKEYS, 'fans', 'camera'].forEach(k => delete c[k]);
        Object.assign(c, detect(this._hass, v.device));
        c = strip(c); this._emit(c); this._rebuild(); return;
      }
      this._emit(strip(c));
    });
    const step = (k, list, dir) => {
      const cur = this._config[k] || '', i = list.indexOf(cur), n = list[(i + dir + list.length) % list.length];
      const c = {...this._config}; if (n) c[k] = n; else delete c[k];
      if (k === 'demo_message' && n && !c.demo) c.demo = 'print';
      this._emit(c); this._rebuild();
    };
    const btn = (t, fn) => { const b = this._add(t, fn); b.querySelector('ha-icon').remove(); return b; };
    w.append(
      this._section('general', 'mdi:printer-3d', 'Allgemein', b => b.append(form(PGEN))),
      this._section('entities', 'mdi:format-list-bulleted', 'Entitäten', b => {
        b.append(this._hint('Leer = automatisch vom gewählten Drucker. Nur ändern, wenn etwas falsch erkannt wird.'), form(PENT), this._h4('Bedienung'), form(PCTL));
      }),
      this._section('ams', 'mdi:tray-full', 'AMS und Spulen', b => b.append(form(PAMS))),
      this._section('cam', 'mdi:cctv', 'Kamera', b => b.append(form(PCAM))),
      this._section('xtra', 'mdi:fan', 'Lüfter und Schalter', b => b.append(form(PXTRA))),
      this._section('show', 'mdi:eye-outline', 'Anzeigen', b => b.append(form(PSHOW))),
      this._section('messages', 'mdi:alert-circle-outline', 'Meldungen', b => {
        b.append(this._hint('Ausgeschaltete Meldungen erscheinen weder als Hinweis noch als Animation. HMS-Fehler, Druckfehler und Druckphasen werden über die Liste in printer-messages.js zugeordnet; Unbekanntes landet bei „Unbekannte Meldungen“.'), form(PMSG));
      }),
      this._section('look', 'mdi:palette-outline', 'Aussehen', b => b.append(form(PLOOK))),
      this._section('demo', 'mdi:play-box-outline', 'Demo', b => {
        b.append(this._hint('Zum Durchklicken aller Zustände und Meldungen in der Vorschau. Vor dem Speichern wieder auf „Aus“ stellen.'), form(PDEMO));
        const row = document.createElement('div'); row.className = 'demo-btns';
        const S = ['', ...DEMO_STATES.map(x => x[0])], M = ['', ...MKEYS];
        row.append(btn('‹ Zustand', () => step('demo', S, -1)), btn('Zustand ›', () => step('demo', S, 1)), btn('‹ Meldung', () => step('demo_message', M, -1)), btn('Meldung ›', () => step('demo_message', M, 1)));
        b.append(row);
      }),
      this._section('actions', 'mdi:gesture-tap', 'Aktionen', b => b.append(form(PACTS))));
  }
}
define('drucker-card-editor', NovaPrinterCardEditor);
