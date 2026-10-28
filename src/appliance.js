import {define, docUrl, tag} from './shared/define.js';
import {esc, dom, setIcon, list, NUMRE, toObj} from './shared/utils.js';
import {fmtState, iconOf, valueOf, alertHit, langOf, tzOf} from './shared/state.js';
import {runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, SECTION_EDITOR_CSS, roleVars} from './shared/styles.js';
import {hassChanged, entityIds, inPicker} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, A, NUM, sel, ROLE, NAMEICON, BASE_LABELS} from './shared/editor-schema.js';
import {sceneDefs, SCENE_CSS, frameGlow, sweep} from './shared/scene.js';

/* ---------- Nova Gerät Card ---------- */
// Gerätetypen: bestimmen nur Symbol, Standardtexte, Standardfarbe und Animation – die Entitäten wählt der Nutzer
const TYPES = {
  washer: {label: 'Waschmaschine', icon: 'mdi:washing-machine', color: 'accent-1', run: 'Wäscht', alt: 'Schleudert', door: 'Tür offen', phase: ['spin', 'spinning', 'schleudern'], anims: ['detergent', 'softener'], dview: true},
  dishwasher: {label: 'Spülmaschine', icon: 'mdi:dishwasher', color: 'accent-1', run: 'Spült', door: 'Tür offen', phase: [], dview: true},
  airfryer: {label: 'Airfryer', icon: 'mdi:toaster-oven', color: 'accent-2', run: 'Gart', heat: 'Heizt vor', door: 'Schublade offen', phase: [], dview: true},
  coffee: {label: 'Kaffeemaschine', icon: 'mdi:coffee-maker-outline', color: 'accent-3', run: 'Läuft', alt: 'Brüht', door: 'Tür offen', phase: ['brew', 'brewing', 'brühen'], anims: ['tank', 'beans', 'descale']},
  generic: {label: 'Gerät', icon: 'mdi:power-plug-outline', color: 'accent-1', run: 'Läuft', door: 'Tür offen', phase: []},
};
const typeOf = c => TYPES[c.device_type] ? c.device_type : 'generic';
// Hinweis-Animationen im Bild; Standardtext, falls der Hinweis keinen eigenen hat
const HANIM = {tank: ['Wassertank', 'Wassertank leer', 'mdi:cup-water'], beans: ['Bohnen', 'Bohnen nachfüllen', 'mdi:coffee-outline'], descale: ['Entkalken', 'Entkalken', 'mdi:water-alert-outline'],
  detergent: ['Waschmittel', 'Waschmittel leer', 'mdi:bottle-tonic-outline'], softener: ['Weichspüler', 'Weichspüler leer', 'mdi:bottle-tonic-plus-outline'], warning: ['Allgemeine Warnung', '', 'mdi:alert-outline']};
const animsOf = t => [...(TYPES[t].anims || []), 'warning'];
// Zustandsgruppen; Rohzustände der gängigen Integrationen (Home Connect, WashData, Philips, Miele …), im Editor überschreibbar
const STATES = {
  run: ['run', 'running', 'on', 'cooking', 'brewing', 'starting', 'ending', 'anti_wrinkle', 'washing', 'rinsing', 'spinning', 'drying', 'aborting', 'in_use', 'programmed_running'],
  pause: ['pause', 'paused', 'user_paused'],
  wait: ['delayedstart', 'delayed_start', 'delay_wait', 'scheduled', 'waiting_to_start'],
  done: ['finished', 'finish', 'done', 'complete', 'completed', 'clean', 'end', 'programme_ended'],
  err: ['error', 'fault', 'failure', 'actionrequired', 'action_required', 'interrupted'],
  prep: ['setting', 'programming', 'selecting', 'adjusting'],
  heat: ['heating', 'preheating', 'preheat', 'heat_up'],
  warm: ['maintain', 'keep_warm', 'keepwarm', 'warming'],
  ready: ['ready', 'idle', 'standby', 'mainmenu'],
};
// Reihenfolge der Prüfung; alles andere = aus
const SORDER = ['err', 'pause', 'wait', 'done', 'prep', 'heat', 'warm', 'run', 'ready'];
// Gerät arbeitet (Pause/Stopp statt Start)
const ACT = ['run', 'pause', 'wait', 'heat', 'warm'];
const isAct = cls => ACT.includes(cls);
const SKEY = {run: 'running_states', pause: 'paused_states', wait: 'waiting_states', done: 'finished_states', err: 'error_states', prep: 'prep_states', heat: 'heat_states', warm: 'warm_states', ready: 'ready_states'};
const TKEY = {run: 'text_running', pause: 'text_paused', wait: 'text_waiting', done: 'text_finished', err: 'text_error', prep: 'text_prep', heat: 'text_heat', warm: 'text_warm', ready: 'text_ready', off: 'text_off'};
const TXT = {pause: 'Pausiert', wait: 'Startet später', done: 'Fertig', err: 'Störung', prep: 'Wird eingestellt', heat: 'Heizt auf', warm: 'Hält warm', ready: 'Bereit', off: 'Aus'};
const BAD = new Set(['unavailable', 'unknown', 'none', '']);
const ok = s => !!s && !BAD.has(s.state);
const GDEF = {layout: 'full', animation: true, glow: true, hide_when_off: false, start_at: 'none', window: true, door_anim: true};
// Rohwert ohne Übersetzung (z. B. fresh_fries) lesbar machen
const nice = (raw, t) => t === raw && /_/.test(raw) ? raw.replace(/_/g, ' ').replace(/^./, x => x.toUpperCase()) : t;
const fmtOpt = (h, s, o) => { let t = o; try { if (h.formatEntityState) t = h.formatEntityState(s, o); } catch { /* Rohwert */ } return nice(o, t); };
const SECS = {s: 1, sec: 1, min: 60, m: 60, h: 3600, d: 86400};
const isDur = s => !!s && (SECS[s.attributes.unit_of_measurement] != null || s.attributes.device_class === 'duration');
// Dauer in Sekunden: Zahl mit Einheit (s/min/h), „H:MM(:SS)“ oder Zeitpunkt
function secsOf(s) {
  if (!ok(s)) return null;
  const v = String(s.state);
  if (/^\d+:\d{2}(:\d{2})?$/.test(v)) { const p = v.split(':').map(Number); return p[0] * 3600 + p[1] * 60 + (p[2] || 0); }
  if (NUMRE.test(v)) { const u = s.attributes.unit_of_measurement; return +v * (SECS[u] ?? (s.attributes.device_class === 'duration' ? 1 : 60)); }
  const t = Date.parse(v);
  return isNaN(t) ? null : Math.max(0, (t - Date.now()) / 1000);
}
// Kurzform fürs Display: 45" · 12' · 1:05
const fmtDisp = sec => sec < 60 ? `${Math.ceil(sec)}"` : sec < 3600 ? `${Math.ceil(sec / 60)}'` : (m => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')}`)(Math.ceil(sec / 60));
const fmtDur = sec => { const m = Math.max(0, Math.round(sec / 60)); return m < 1 ? '< 1 min' : m < 60 ? `${m} min` : `${Math.floor(m / 60)}:${String(m % 60).padStart(2, '0')} h`; };
const SA = '<div class="ct sa"><div class="kv"><ha-icon icon="mdi:clock-start"></ha-icon><span class="k">Starten um</span><input type="time" aria-label="Startzeit"><div class="pill now">Sofort</div></div><div class="sah"></div></div>';
const IC = {start: 'mdi:play', pause: 'mdi:pause', resume: 'mdi:play-pause', stop: 'mdi:stop'};

// Fertig-Haken, in allen Zeichnungen unten rechts
const WARN = '<g class="wn"><path class="wt3" d="M14 3 l10 17 h-20 Z"/><line class="wx" x1="14" y1="9" x2="14" y2="14"/><circle class="wx2" cx="14" cy="17" r="1.1"/></g>';
const DONE = '<g class="done"><circle class="dr" cx="80" cy="82" r="10"/><circle class="dc" cx="80" cy="82" r="10"/><path class="dk" d="M75.5 82 l3 3 l6 -6.5"/></g>';
// Bullauge der Waschmaschine (geschlossen frontal, offen als nach links aufgeschwenkte, verkürzte Kopie)
const WDOOR = `<circle class="rng" cx="100" cy="114" r="44" stroke="url(#w-cr)"/><circle class="rgo" cx="100" cy="114" r="46"/><circle class="blk" cx="100" cy="114" r="39"/>
<circle class="s-glass" cx="100" cy="114" r="36" fill="url(#w-gl)"/>
<g clip-path="url(#w-ci)"><path class="s-refl" d="M80 78 h22 l-40 62 v-32 z"/><path class="s-refl" d="M112 78 h6 l-56 86 v-12 z"/>
<g transform="rotate(22 100 114)"><rect class="s-gls" x="38" y="56" width="16" height="116" fill="url(#w-gs)"/></g></g>
<path class="sh" d="M71 102 a30 30 0 0 1 17 -18"/><rect class="hdl" x="140.6" y="106" width="3.6" height="16" rx="1.8"/>`;
/* Animationen: reines SVG + CSS, laufen nur bei .st-run (bzw. Fertig-Effekt einmalig), stehen bei .still */
const SV = {
  washer: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${sceneDefs('w')}
<radialGradient id="w-dr" cx=".42" cy=".35" r=".75"><stop offset="0" stop-color="#5a6479"/><stop offset=".6" stop-color="#2c3342"/><stop offset="1" stop-color="#141821"/></radialGradient>
<linearGradient id="w-pd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8d98ac"/><stop offset="1" stop-color="#3a4252"/></linearGradient>
<radialGradient id="w-vg"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
<radialGradient id="w-lt" cx=".5" cy="0" r=".9"><stop offset="0" class="w-lc" stop-opacity=".5"/><stop offset="1" class="w-lc" stop-opacity="0"/></radialGradient>
<linearGradient id="w-wa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="w-lc" stop-opacity=".6"/><stop offset="1" class="w-lc" stop-opacity=".25"/></linearGradient>
<pattern id="w-pf" width="4.5" height="4.5" patternUnits="userSpaceOnUse"><circle cx="2.25" cy="2.25" r=".7" fill="#000" fill-opacity=".35"/></pattern>
<clipPath id="w-ci"><circle cx="100" cy="114" r="36"/></clipPath></defs>
<ellipse class="s-shd" cx="100" cy="193" rx="74" ry="4.5"/><rect class="ft" x="40" y="186" width="14" height="5" rx="1.5"/><rect class="ft" x="146" y="186" width="14" height="5" rx="1.5"/>
<rect class="s-body" x="30" y="12" width="140" height="177" rx="9" fill="url(#w-bd)"/><rect class="s-sheen" x="30" y="12" width="140" height="177" rx="9" fill="url(#w-sh)"/>
<rect class="s-edge" x="35" y="13" width="130" height="1.2" rx=".6"/>
<rect class="psep" x="30" y="47.5" width="140" height=".8"/><rect class="psh" x="30" y="48.3" width="140" height=".6"/><rect class="psep" x="30" y="181" width="140" height=".8"/>
<rect class="dw s-part" x="37" y="19" width="40" height="22" rx="3" fill="url(#w-pt)"/><rect class="dwh" x="39" y="19.8" width="36" height=".9" rx=".45"/>
<rect class="lbl" x="42" y="23.5" width="8" height="1.3" rx=".65"/><rect class="lbl" x="53" y="23.5" width="8" height="1.3" rx=".65"/><rect class="lbl" x="64" y="23.5" width="6" height="1.3" rx=".65"/><rect class="dwg" x="43" y="34.5" width="28" height="2.6" rx="1.3"/>
<g class="pdots">${[-135, -108, -81, -54, -27, 0, 27, 54, 81, 108, 135].map(a => `<circle${a === -54 ? ' class="on"' : ''} cx="${(99 + 13 * Math.sin(a * Math.PI / 180)).toFixed(2)}" cy="${(30 - 13 * Math.cos(a * Math.PI / 180)).toFixed(2)}" r=".95"/>`).join('')}</g>
<circle class="kr" cx="99" cy="30" r="9" fill="url(#w-cr)"/><circle class="s-part" cx="99" cy="30" r="7.2" fill="url(#w-pt)"/><rect class="ki" x="98.4" y="23.6" width="1.2" height="4.2" rx=".6" transform="rotate(-54 99 30)"/>
<rect class="s-part" x="121" y="19" width="41" height="22" rx="3" fill="url(#w-pt)"/><rect class="s-scr" x="123.5" y="21.5" width="36" height="13" rx="1.8"/>
<text class="wdt" x="144" y="31.4"></text><g class="lk"><rect x="126.6" y="26.6" width="4.6" height="3.8" rx=".8"/><path d="M127.7 26.6 v-1.1 a1.2 1.2 0 0 1 2.4 0 v1.1"/></g>
<path class="s-tgl" d="M125 22 h9 l-4 12 h-6 z"/><g class="tb"><rect x="124" y="37" width="6" height="1.8" rx=".9"/><rect x="133" y="37" width="6" height="1.8" rx=".9"/><rect x="142" y="37" width="6" height="1.8" rx=".9"/><rect x="151" y="37" width="8" height="1.8" rx=".9"/></g>
<circle class="led" cx="166" cy="30" r="1.3"/>
<rect class="s-part" x="49" y="96" width="7" height="9" rx="1.5" fill="url(#w-pt)"/><rect class="s-part" x="49" y="123" width="7" height="9" rx="1.5" fill="url(#w-pt)"/>
<circle class="fl" cx="148" cy="168" r="9.5"/><path class="flh" d="M139.6 163.5 a9.5 9.5 0 0 1 8.4 -5"/><rect class="dwg" x="145" y="160.5" width="6" height="1.4" rx=".7"/>
<circle class="gsk" cx="100" cy="114" r="41"/>
<g clip-path="url(#w-ci)"><circle cx="100" cy="114" r="36" fill="url(#w-dr)"/>
<g class="drum"><circle cx="100" cy="114" r="34" fill="url(#w-pf)"/><circle class="drm" cx="100" cy="114" r="22"/>
${[0, 120, 240].map(a => `<g class="pdl" transform="rotate(${a} 100 114)"><path d="M93 78.6 Q100 77.6 107 78.6 L103.2 93 Q100 94.6 96.8 93 Z" fill="url(#w-pd)"/><path class="pdh" d="M94.6 79.4 L97.6 92 h-.9 L93.6 79.6 Z"/></g>`).join('')}
<path class="cl" d="M76 128 q8 -10 18 -3 q8 5 16 -2 q5 10 -8 14 q-14 4 -26 -9 Z"/><path class="cl c2" d="M90 100 q8 -5 15 1 q-3 7 -10 6 q-6 -1 -5 -7 Z"/>
<circle class="hub" cx="100" cy="114" r="6" fill="url(#w-cr)"/><circle class="hbc" cx="100" cy="114" r="2.4"/><circle class="spn" cx="100" cy="114" r="27"/></g>
<rect class="dlt" x="64" y="78" width="72" height="50" fill="url(#w-lt)"/>
<g class="wl"><g class="wv2"><path d="M25 121 q6.25 -2.5 12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 V160 H25 Z" fill="url(#w-wa)" opacity=".5"/></g>
<g class="wv"><path d="M50 124 q6.25 -3.5 12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 V160 H50 Z" fill="url(#w-wa)"/></g></g>
<circle cx="100" cy="114" r="36" fill="url(#w-vg)"/></g>
<g class="pd">${WDOOR}</g>
<g class="pdo"><circle class="pde" cx="100" cy="114" r="46" transform="matrix(-.38 0 0 1.03 77.5 -3.42)"/><g transform="matrix(-.38 0 0 1.03 74.52 -3.42)">${WDOOR}</g>
<rect class="s-part" x="48" y="96.5" width="10" height="5" rx="1.5" fill="url(#w-pt)"/><rect class="s-part" x="48" y="125.5" width="10" height="5" rx="1.5" fill="url(#w-pt)"/></g>
<g transform="translate(58 57) scale(1.15)">${DONE}</g><g transform="translate(4 2) scale(1.3)">${WARN}</g></svg>`,
  dishwasher: `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="nvd"><rect x="22" y="26" width="56" height="60" rx="5"/></clipPath></defs>
<rect class="bd" x="14" y="6" width="72" height="88" rx="9"/><line class="sep" x1="14" y1="20" x2="86" y2="20"/>
<rect class="hd2" x="38" y="11" width="24" height="3.5" rx="1.75"/><circle class="led" cx="78" cy="13" r="2"/>
<rect class="gl" x="22" y="26" width="56" height="60" rx="5"/>
<g class="dd"><g clip-path="url(#nvd)"><rect class="mist" x="22" y="26" width="56" height="60"/>
<line class="rk" x1="24" y1="50" x2="76" y2="50"/><line class="rk" x1="24" y1="76" x2="76" y2="76"/>
<rect class="pl" x="30" y="36" width="5" height="14" rx="2.5"/><rect class="pl" x="38" y="34" width="5" height="16" rx="2.5"/><rect class="pl" x="46" y="36" width="5" height="14" rx="2.5"/><rect class="pl" x="58" y="40" width="12" height="10" rx="3"/>
<rect class="pl" x="30" y="60" width="5" height="16" rx="2.5"/><rect class="pl" x="38" y="58" width="5" height="18" rx="2.5"/><rect class="pl" x="56" y="62" width="14" height="14" rx="3"/>
<g class="drops"><circle cx="34" cy="80" r="1.3"/><circle cx="44" cy="80" r="1.1"/><circle cx="50" cy="80" r="1.4"/><circle cx="57" cy="80" r="1.1"/><circle cx="66" cy="80" r="1.3"/><circle cx="40" cy="80" r="1"/></g>
<g class="arm"><rect x="30" y="81" width="40" height="2.4" rx="1.2"/><circle cx="50" cy="82.2" r="2.4"/></g></g></g>${DONE}${WARN}</svg>`,
  // Airfryer: weiches Gehäuse, rundes Display mit Restzeit und Ring (Eieruhr), Schublade mit Fuge, Griff und Sichtfenster (abschaltbar)
  airfryer: `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="nva"><path d="M39 55 h22 a5 5 0 0 1 5 5 a7 7 0 0 1 -7 7 h-18 a7 7 0 0 1 -7 -7 a5 5 0 0 1 5 -5 Z"/></clipPath></defs>
<g class="heat"><path d="M38 8 q3 -4 0 -7"/><path d="M50 8 q3 -4 0 -7"/><path d="M62 8 q3 -4 0 -7"/></g>
<g class="puff"><path d="M38 9 q3 -4 0 -8 q-3 -4 0 -8"/><path d="M50 9 q3 -4 0 -8 q-3 -4 0 -8"/><path d="M62 9 q3 -4 0 -8 q-3 -4 0 -8"/></g>
<g class="afb"><ellipse class="ash" cx="50" cy="96.5" rx="32" ry="2.6"/><rect class="bd" x="17" y="10" width="66" height="85" rx="24"/>
<rect class="pnl" x="25" y="16" width="50" height="26" rx="13"/><circle class="kbn" cx="33" cy="29" r="2.6"/><circle class="kbn" cx="67" cy="29" r="2.6"/>
<circle class="kr" cx="50" cy="29" r="10"/><circle class="kp" cx="50" cy="29" r="10" pathLength="100" transform="rotate(-90 50 29)"/>
<circle class="kd" cx="50" cy="29" r="7.5"/><text class="kt" x="50" y="31.2"></text>
<rect class="opn" x="23" y="49" width="54" height="42" rx="17"/></g>
<g class="drw"><ellipse class="ash dsh" cx="50" cy="94" rx="30" ry="3.5"/><rect class="gap" x="22" y="48" width="56" height="44" rx="18"/>
<rect class="dw" x="23.5" y="49" width="53" height="41" rx="16.5"/><path class="dhl" d="M34 50.5 h32"/>
<g class="win"><path class="wg" d="M39 55 h22 a5 5 0 0 1 5 5 a7 7 0 0 1 -7 7 h-18 a7 7 0 0 1 -7 -7 a5 5 0 0 1 5 -5 Z"/><g clip-path="url(#nva)"><rect class="glo" x="34" y="55" width="32" height="12"/>
<g class="fr"><line x1="39" y1="64.5" x2="45" y2="60"/><line x1="48.5" y1="65" x2="56" y2="61.5"/><line x1="59.5" y1="64.5" x2="62" y2="60.5"/></g></g></g>
<path class="ahs" d="M36 84 q14 6 28 0 v-2 h-28 Z"/><path class="ahd" d="M36 74 h28 a4 4 0 0 1 4 4 a5 5 0 0 1 -5 5 h-26 a5 5 0 0 1 -5 -5 a4 4 0 0 1 4 -4 Z"/></g>${DONE}${WARN}</svg>`,
  // Kaffeevollautomat (Vorbild Siemens EQ): Bohnenfach oben, Bedienfeld, mittiger Auslauf mit Tasse, Wassertank seitlich
  coffee: `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="nvc"><path d="M41 66 h18 v10 a6 6 0 0 1 -6 6 h-6 a6 6 0 0 1 -6 -6 Z"/></clipPath><clipPath id="nvt"><rect x="80" y="26" width="7" height="50" rx="2.5"/></clipPath></defs>
<path class="bn" d="M28 12.5 q11 -9 22 0 Z"/>
<rect class="bd" x="16" y="12" width="64" height="82" rx="9"/>
<rect class="tk" x="80" y="26" width="7" height="50" rx="2.5"/><g clip-path="url(#nvt)"><rect class="tw" x="80" y="38" width="7" height="40"/></g>
<rect class="pnl" x="23" y="18" width="50" height="11" rx="3"/><circle class="led" cx="29" cy="23.5" r="1.8"/><rect class="kx" x="34" y="21.5" width="18" height="4" rx="2"/>
<path class="dp" d="M65 19.5 c2 3 3 4.5 3 6 a3 3 0 0 1 -6 0 c0 -1.5 1 -3 3 -6 Z"/>
<rect class="sp" x="38" y="34" width="24" height="7" rx="2.5"/><rect class="sp" x="43.5" y="41" width="4" height="3" rx="1"/><rect class="sp" x="52.5" y="41" width="4" height="3" rx="1"/>
<line class="flow" x1="45.5" y1="44" x2="45.5" y2="80"/><line class="flow" x1="54.5" y1="44" x2="54.5" y2="80"/>
<g clip-path="url(#nvc)"><rect class="cf" x="39" y="66" width="22" height="18"/></g>
<path class="cup" d="M41 66 h18 v10 a6 6 0 0 1 -6 6 h-6 a6 6 0 0 1 -6 -6 Z"/><path class="cup" d="M59 69 h2.5 a3.5 3.5 0 0 1 0 7 h-2.5"/>
<rect class="tray" x="28" y="85" width="44" height="4" rx="2"/>
<g class="steam"><path d="M45 63 q3 -4 0 -8 q-3 -4 0 -8"/><path d="M50 63 q3 -4 0 -8 q-3 -4 0 -8"/><path d="M55 63 q3 -4 0 -8 q-3 -4 0 -8"/></g>${DONE}${WARN}</svg>`,
  generic: `<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="pulse" cx="50" cy="50" r="30"/><circle class="bd" cx="50" cy="50" r="26"/>
<path class="pw" d="M41 40 a14 14 0 1 0 18 0"/><line class="pw" x1="50" y1="33" x2="50" y2="48"/>${DONE}${WARN}</svg>`,
};
const scene = t => `<div class="scene">${SV[t]}</div>`;

const DCSS = `
.g.dv{--dc:var(--nv-a1);--dc-fg:var(--nv-a1-fg)}
${frameGlow('.g.dv.glow.st-run,.g.dv.glow.st-heat')}
.dv .on>.ic,.dv .hd .ic.on{background:var(--dc);color:var(--dc-fg);box-shadow:0 0 14px color-mix(in srgb,var(--dc) 55%,transparent)}
.dv .hd small.er{color:var(--nv-error);opacity:1}
.dv .hb.pw.on{background:var(--dc);color:var(--dc-fg)}
.mid{display:flex;gap:14px;align-items:center;min-width:0}
.scene{flex:none;width:144px;height:144px;color:var(--nv-fg)}
.scene svg{display:block;width:100%;height:100%;overflow:visible}
.inf{flex:1;min-width:0;display:flex;flex-direction:column;gap:6px}
.pg{font-size:18px;font-weight:600;line-height:1.2;overflow:hidden;text-overflow:ellipsis;display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical}
.ph{font-size:12px;opacity:.65}
.bar{height:8px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden}
.bar i{display:block;height:100%;width:0;background:var(--dc);border-radius:4px;transition:width 1s}
.tm{display:flex;justify-content:space-between;gap:8px;font-size:12.5px;flex-wrap:wrap}.tm .rm{font-weight:600}.tm .en{opacity:.7}
.ctls{display:flex;flex-direction:column;gap:2px}
.ct{border-top:1px solid rgba(255,255,255,.08);padding:8px 0 6px;min-width:0}
.ct .kv{border:none;padding:0}.ct .kv .v{font-weight:600;opacity:1}
.ct .pills{margin-top:8px}.ct .pill.on{background:var(--dc);color:var(--dc-fg);box-shadow:0 0 14px color-mix(in srgb,var(--dc) 45%,transparent)}
.ct .cv{transition:transform .2s}.ct.open .cv{transform:rotate(180deg)}
.stp{display:flex;align-items:center;gap:8px;flex:none}.stp .hb{width:32px;height:32px}.stp .v{min-width:64px;text-align:center}
.ct input[type=range]{margin-top:8px;background:linear-gradient(90deg,var(--dc) 0 var(--p,0%),rgba(255,255,255,.14) var(--p,0%) 100%)}
.ct .row{padding:0;font-size:13px}.ct .row.on .sw{background:var(--dc)}
.ct.na,.ab.dis{opacity:.4;pointer-events:none}
.acts{display:flex;gap:8px}
.sa .kv{gap:8px}.sa input{flex:none;background:var(--nv-chip);color:inherit;border:1px solid rgba(255,255,255,.08);border-radius:12px;padding:6px 10px;font:inherit;font-size:13.5px;font-weight:600;color-scheme:dark;min-width:0}
.sa .pill.on{background:var(--dc);color:var(--dc-fg);border-color:transparent}
.sa .sah{font-size:12px;opacity:.7;margin-top:6px}.sa .sah:empty{display:none}
.ab{flex:1;min-width:0;height:46px;border-radius:16px;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);font-size:14px;font-weight:600;transition:background-color .2s,opacity .2s,transform .2s}
.ab ha-icon{--mdc-icon-size:22px}
.ab.pri{background:var(--dc);color:var(--dc-fg);border-color:transparent;box-shadow:0 0 16px color-mix(in srgb,var(--dc) 40%,transparent)}
.ab.dis{box-shadow:none}
.ab:active{transform:scale(.95)}
.als:empty{display:none}
.dv .al[data-e]{cursor:pointer}.dv .al.hit{background:color-mix(in srgb,var(--c) 32%,transparent);font-weight:600}
/* Kompakt: eine Zeile */
.g.dv.cmp{gap:8px;padding:10px 14px}
.cmp .hd .ic{width:40px;height:40px;position:relative}
.cmp .hd .ic::before{content:'';position:absolute;inset:0;border-radius:50%;background:conic-gradient(var(--dc) var(--p,0%),transparent 0);
-webkit-mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2.5px));mask:radial-gradient(farthest-side,transparent calc(100% - 3px),#000 calc(100% - 2.5px))}
.cmp .hd .ic.on{background:color-mix(in srgb,var(--dc) 25%,transparent);color:var(--nv-fg);box-shadow:none}
.cmp .rmc{font-size:13px;font-weight:600;white-space:nowrap}
.cmp .bar{height:4px}
/* Zeichnungen: Gehäuse in Textfarbe, Wasser/Hitze/LEDs in der Gerätefarbe */
.scene .bd{fill:currentColor;fill-opacity:.1;stroke:currentColor;stroke-opacity:.28;stroke-width:1.2}
.scene .sep,.scene .rk{stroke:currentColor;stroke-opacity:.22;stroke-width:1}
.scene .dw,.scene .hd2,.scene .kn{fill:currentColor;fill-opacity:.16}
.scene .led{fill:currentColor;fill-opacity:.25}
.st-run .scene .led,.st-pause .scene .led,.st-wait .scene .led,.st-heat .scene .led,.st-warm .scene .led{fill:var(--dc);fill-opacity:1}
.st-ready .scene .led{fill:var(--dc);fill-opacity:.45}
.st-off .scene>svg{opacity:.55;transition:opacity .4s}
.scene .door{fill:currentColor;fill-opacity:.08;stroke:currentColor;stroke-opacity:.35;stroke-width:2}
.scene .gl{fill:rgba(0,0,0,.28);stroke:currentColor;stroke-opacity:.2;stroke-width:1}
.scene .wt{fill:var(--dc);fill-opacity:.45}
.scene .wl{transition:transform .8s}
.scene .dm{fill:none;stroke:currentColor;stroke-opacity:.3;stroke-width:1.2;stroke-dasharray:3 3}
.scene .lf{fill:currentColor;fill-opacity:.35}.scene .cl{fill:currentColor;fill-opacity:.32}.scene .cl.c2{fill-opacity:.22}
.scene .mist{fill:var(--dc);opacity:0}
.scene .pl{fill:currentColor;fill-opacity:.22}
.scene .drops circle{fill:var(--dc);opacity:0}
.scene .arm{fill:currentColor;fill-opacity:.4;transform-box:view-box;transform-origin:50px 82px}
.scene .drum{transform-box:view-box;transform-origin:50px 58px}
.scene .heat path,.scene .steam path{fill:none;stroke:var(--dc);stroke-width:1.6;stroke-linecap:round;opacity:0}
.scene .steam path{stroke:currentColor;stroke-opacity:.6}
.scene .cup{fill:none;stroke:currentColor;stroke-opacity:.55;stroke-width:1.6;stroke-linejoin:round}
.scene .cf{fill:var(--dc);fill-opacity:.75;transform-box:fill-box;transform-origin:center bottom;transform:scaleY(.15)}
.scene .flow{stroke:var(--dc);stroke-width:2.4;stroke-linecap:round;stroke-dasharray:4 3;opacity:0}
.scene .pulse{fill:none;stroke:var(--dc);stroke-width:2;opacity:0;transform-box:view-box;transform-origin:50px 50px}
.scene .pw{fill:none;stroke:currentColor;stroke-opacity:.55;stroke-width:3;stroke-linecap:round}
.st-run .scene .pw{stroke:var(--dc);stroke-opacity:1}
.scene .done{opacity:0}.scene .dc{fill:var(--dc)}.scene .dr{fill:none;stroke:var(--dc);stroke-width:1.5;opacity:0;transform-box:fill-box;transform-origin:center}
.scene .dk{fill:none;stroke:var(--dc-fg);stroke-width:2.2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:16;stroke-dashoffset:0}
.st-done .scene .done{opacity:1}
.st-done.fx .scene .done{animation:dv-pop .5s ease-out both}
.st-done.fx .scene .dk{animation:dv-check .5s .25s ease-out both}
.st-done.fx .scene .dr{animation:dv-ring 1.2s .3s ease-out both}
/* Laufen */
.anim.st-run .w-washer .drum{animation:dv-tumble 4s ease-in-out infinite}
.anim.st-run .w-washer .wv{animation:dv-wave 2.4s linear infinite}
.anim.st-run .w-washer .wv2{animation:dv-wave 3.4s linear infinite reverse}
.anim.st-run.alt .w-washer .drum{animation:dv-spin .55s linear infinite}
.st-run.alt .w-washer .wl{transform:translateY(22px)}
.st-run.alt .w-washer .spn{stroke-opacity:.1}.st-run.alt .w-washer .pdl{opacity:.55}
.st-run .w-washer .dlt,.st-pause .w-washer .dlt{opacity:1}
.anim.st-pause .w-washer .wdt{animation:dv-blinko 1.4s ease-in-out infinite}
.anim.st-run .w-dishwasher .arm{animation:dv-arm 1.6s ease-in-out infinite alternate}
.anim.st-run .w-dishwasher .drops circle{animation:dv-drop 1.4s ease-out infinite}
.anim.st-run .w-dishwasher .mist{animation:dv-mist 3.2s ease-in-out infinite}
.scene .fr line{stroke:color-mix(in srgb,var(--dc) var(--pp,0%),currentColor);stroke-opacity:calc(.35 + var(--pf,0) * .5);stroke-width:3.2;stroke-linecap:round}
.scene .puff path{fill:none;stroke:currentColor;stroke-opacity:.6;stroke-width:1.6;stroke-linecap:round;opacity:0}
/* Airfryer */
.scene .kr{fill:none;stroke:currentColor;stroke-opacity:.18;stroke-width:2.2}
.scene .kp{fill:none;stroke:var(--dc);stroke-width:2.2;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:100;opacity:0;transition:stroke-dashoffset 1s}
.kring .w-airfryer .kp{opacity:1}
.scene .kt{fill:var(--dc);font:700 6px system-ui,sans-serif;text-anchor:middle}
.scene .kbn{fill:currentColor;fill-opacity:.3}
.scene .ash{fill:rgba(0,0,0,.3)}.scene .dsh{opacity:0;transition:opacity .6s}.dopen .w-airfryer .dsh{opacity:1}
.scene .gap{fill:rgba(0,0,0,.42)}.scene .ahs{fill:rgba(0,0,0,.35)}
.scene .dhl{fill:none;stroke:currentColor;stroke-opacity:.35;stroke-width:1.2;stroke-linecap:round}
.scene .ahd{fill:currentColor;fill-opacity:.5;stroke:currentColor;stroke-opacity:.7;stroke-width:1}
.scene .kd,.scene .pnl{fill:rgba(0,0,0,.3);stroke:currentColor;stroke-opacity:.18;stroke-width:1}
.scene .kb{fill:currentColor;fill-opacity:.14;stroke:currentColor;stroke-opacity:.32;stroke-width:1}
.scene .opn{fill:rgba(0,0,0,.55);stroke:currentColor;stroke-opacity:.2;stroke-width:1}
.w-airfryer .dw{fill:currentColor;fill-opacity:.2;stroke:currentColor;stroke-opacity:.45;stroke-width:1.2}
.scene .afb{transform-box:view-box;transform-origin:0 0;transition:transform .6s ease}
.scene .kx{fill:currentColor;fill-opacity:.15}
.st-ready .scene .kx{fill:var(--dc);fill-opacity:.45}
.st-run .scene .kx,.st-prep .scene .kx,.st-heat .scene .kx,.st-warm .scene .kx,.st-pause .scene .kx,.st-wait .scene .kx{fill:var(--dc);fill-opacity:.85}
.scene .wg{fill:rgba(0,0,0,.28);stroke:currentColor;stroke-opacity:.2;stroke-width:1}
.scene .glo{fill:var(--dc);opacity:0;transition:opacity .6s}
.scene .drw{transform-box:view-box;transform-origin:0 0;transition:transform .6s ease}
/* Schublade offen: herausgenommen und verkleinert neben dem Gerät, im Gehäuse bleibt die leere Öffnung */
.dopen .w-airfryer .afb{transform:translate(-5px,8px) scale(.82)}
.dopen .w-airfryer .drw{transform:translate(50px,34px) scale(.66)}
.nowin .w-airfryer .win{display:none}
.st-heat .w-airfryer .kr{stroke:var(--dc);stroke-opacity:.8}
.anim.st-heat .w-airfryer .kr{animation:dv-stk 2.6s ease-in-out infinite}
.st-run .w-airfryer .glo{opacity:.32}.st-warm .w-airfryer .glo{opacity:.13}
.anim.st-run .w-airfryer .glo{animation:dv-glo 3s ease-in-out infinite}
.anim.st-run.last .w-airfryer .glo,.anim.st-run.last .w-airfryer .kp{animation:dv-glo .8s ease-in-out infinite}
.anim.st-run.nowin .w-airfryer .heat path{animation:dv-heat 2.2s ease-out infinite}
.st-warm.nowin .w-airfryer .kr{stroke:var(--dc);stroke-opacity:.35}
.anim.st-prep .scene .kx,.anim.st-prep .w-airfryer .kt,.anim.st-pause .w-airfryer .kp,.anim.st-pause .w-airfryer .kt{animation:dv-blinko 1.4s ease-in-out infinite}
.anim.st-done.fx .w-airfryer .puff path{animation:dv-steam 1.8s ease-out 2 both}
.anim.st-done.fx .w-airfryer .drw{animation:dv-jolt .6s .1s ease-out}
/* Waschmaschine im Nova-Zeichenstil (Maßstab 3D-Drucker, Grundteile aus shared/scene.js) */
.w-washer{--gx:100px}
.w-washer .ft,.w-washer .dwg{fill:#0d1016}
.w-washer .psep{fill:#000;opacity:.3}.w-washer .psh{fill:#fff;opacity:.06}
.w-washer .dwh{fill:#fff;opacity:.14}.w-washer .lbl{fill:#fff;opacity:.18}
.w-washer .pdots circle{fill:#fff;opacity:.25}.w-washer .pdots .on{fill:var(--dc);opacity:1}
.w-washer .kr{stroke:rgba(0,0,0,.4);stroke-width:.5}.w-washer .ki{fill:#fff;opacity:.85}
.w-washer .wdt{font:600 9px Roboto,system-ui,sans-serif;fill:#fff;text-anchor:middle}
.w-washer .tb rect{fill:#fff;opacity:.14}
.w-washer .gsk{fill:#07090d;stroke:rgba(255,255,255,.08);stroke-width:.6}
.w-washer .drum{transform-origin:100px 114px}
.w-washer .drm{fill:none;stroke:#000;stroke-opacity:.25;stroke-width:1}
.w-washer .pdl path{stroke:rgba(0,0,0,.35);stroke-width:.4}.w-washer .pdl .pdh{fill:#fff;opacity:.2;stroke:none}
.w-washer .cl{fill:#8f99ad;fill-opacity:.55}.w-washer .cl.c2{fill:color-mix(in srgb,var(--dc) 55%,#c9d1de);fill-opacity:.5}
.w-washer .hub{stroke:rgba(0,0,0,.4);stroke-width:.4}.w-washer .hbc{fill:#141821}
.w-washer .spn{fill:none;stroke:#cfd8e8;stroke-opacity:0;stroke-width:12;transition:stroke-opacity .4s}
.w-washer .w-lc{stop-color:var(--dc)}.w-washer .dlt{opacity:0;transition:opacity .6s}
.w-washer .rng{fill:none;stroke-width:4}.w-washer .rgo{fill:none;stroke:rgba(255,255,255,.25);stroke-width:.6}
.w-washer .blk{fill:none;stroke:#0b0e13;stroke-width:6}
.w-washer .sh{fill:none;stroke:#fff;stroke-opacity:.16;stroke-width:1.6;stroke-linecap:round}
.w-washer .hdl{fill:#0b0e13;opacity:.7}
.w-washer .fl{fill:none;stroke:#000;stroke-opacity:.35;stroke-width:.8}.w-washer .flh{fill:none;stroke:#fff;stroke-opacity:.08;stroke-width:.8}
.w-washer .pd{transform-box:view-box;transform-origin:54px 114px;transition:transform .45s .3s ease-out}
.w-washer .scene .lk{stroke:#fff;stroke-opacity:.85;stroke-width:.7}.w-washer .scene .lk rect{fill:#fff}
.st-off .w-washer .wdt,.st-off .w-washer .pdots .on{display:none}
/* Hinweise im Bild (Farben aus dem Theme: --nova-warning-color / --nova-error-color) */
.scene .wn{display:none;transform-box:fill-box;transform-origin:center}
.scene .wn{--wc:var(--nv-warn)}.st-err .scene .wn{--wc:var(--nv-error)}
.scene .wt3{fill:var(--wc);fill-opacity:.25;stroke:var(--wc);stroke-width:1.8;stroke-linejoin:round}.scene .wx{stroke:var(--wc);stroke-width:2.2;stroke-linecap:round}.scene .wx2{fill:var(--wc)}
.h-warning .scene .wn,.st-err .scene .wn{display:inline}
.anim.h-warning .scene .wn,.anim.st-err .scene .wn{animation:dv-pop2 1.6s ease-in-out infinite}
/* Tür offen: Bullauge klappt zum Scharnier zu und schwenkt links auf, Trommel offen ohne Wasser */
.w-washer .pdo{transform-box:view-box;transform-origin:54px 114px;transform:scaleX(0);transition:transform .35s ease-in}
.w-washer .pde{fill:#1a1e27;stroke:rgba(255,255,255,.12);stroke-width:.6}
.dopen .w-washer .pd{transform:scaleX(0);transition:transform .35s ease-in}
.dopen .w-washer .pdo{transform:none;transition:transform .45s .35s ease-out}
.dopen .w-washer .wl,.dopen .w-washer .dlt{opacity:0}
.w-washer .wl{transition:transform .8s,opacity .5s}
.scene .lk{display:none;fill:none;stroke:currentColor;stroke-opacity:.8;stroke-width:1.4}.scene .lk rect{fill:currentColor;fill-opacity:.8;stroke:none}
.dlock .w-washer .lk{display:inline}
.scene .dd{transform-box:view-box;transition:transform .5s ease}
.dopen .w-dishwasher .dd{transform:translateY(8px)}
.h-detergent .w-washer .dw,.h-softener .w-washer .dw,.h-beans .w-coffee .bn,.h-descale .w-coffee .dp{fill:var(--nv-warn);fill-opacity:.95}
.h-tank .w-coffee .tw{transform:translateY(40px)}.h-tank .w-coffee .tk{stroke:var(--nv-warn);stroke-opacity:1;stroke-width:1.4}
.anim.h-detergent .w-washer .dw,.anim.h-softener .w-washer .dw,.anim.h-tank .w-coffee .tk,.anim.h-beans .w-coffee .bn,.anim.h-descale .w-coffee .dp{animation:dv-blinko 1.3s ease-in-out infinite}
/* Kaffeevollautomat */
.scene .bn{fill:currentColor;fill-opacity:.16;stroke:currentColor;stroke-opacity:.28;stroke-width:1.2}
.scene .tk{fill:rgba(0,0,0,.22);stroke:currentColor;stroke-opacity:.3;stroke-width:1}
.scene .tw{fill:currentColor;fill-opacity:.3;transform-box:view-box;transition:transform .8s}
.scene .dp{fill:currentColor;fill-opacity:.15}
.scene .sp,.scene .tray{fill:currentColor;fill-opacity:.24}
.st-heat .w-coffee .pnl{stroke:var(--dc);stroke-opacity:.8}
.anim.st-heat .w-coffee .pnl{animation:dv-stk 2.6s ease-in-out infinite}
.anim.st-run .w-coffee .steam path,.anim.st-done.fx .w-coffee .steam path{animation:dv-steam 3s ease-out infinite}
.anim.st-done.fx .w-coffee .steam path{animation-iteration-count:2}
.st-run.alt .w-coffee .flow{opacity:.9}
.anim.st-run.alt .w-coffee .flow{animation:dv-flow .5s linear infinite}
.anim.st-run.alt .w-coffee .cf{animation:dv-fill 9s ease-out both}
.st-run:not(.alt) .w-coffee .cf,.st-done .w-coffee .cf{transform:none}
.anim.st-run .w-generic .pulse{animation:dv-pulse 2.6s ease-out infinite}
.scene .drops circle:nth-child(2),.scene .heat path:nth-child(2),.scene .steam path:nth-child(2),.scene .puff path:nth-child(2){animation-delay:.5s}
.scene .drops circle:nth-child(3),.scene .heat path:nth-child(3),.scene .steam path:nth-child(3),.scene .puff path:nth-child(3){animation-delay:1s}
.scene .drops circle:nth-child(4){animation-delay:.25s}.scene .drops circle:nth-child(5){animation-delay:.75s}.scene .drops circle:nth-child(6){animation-delay:1.15s}
.scene .drops circle:nth-child(odd){--dx:-6px}.scene .drops circle:nth-child(even){--dx:6px}
/* Unsichtbar (außerhalb des Bildschirms, Tab im Hintergrund, Kartenauswahl): alles steht */
.still .scene *{animation-play-state:paused!important}
.anim.st-run:not(.still) .scene>svg{will-change:transform}
@media (prefers-reduced-motion:reduce){.scene *{animation:none!important}}
@keyframes dv-tumble{0%{transform:rotate(0)}40%{transform:rotate(220deg)}50%{transform:rotate(220deg)}90%,100%{transform:rotate(0)}}
@keyframes dv-spin{to{transform:rotate(360deg)}}
@keyframes dv-wave{to{transform:translateX(-25px)}}
@keyframes dv-arm{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}
@keyframes dv-drop{0%{opacity:0;transform:translate(0,0)}20%{opacity:.9}100%{opacity:0;transform:translate(var(--dx,0),-46px)}}
@keyframes dv-mist{0%,100%{opacity:.04}50%{opacity:.16}}
@keyframes dv-heat{0%{opacity:0;transform:translateY(4px)}40%{opacity:.85}100%{opacity:0;transform:translateY(-8px)}}
@keyframes dv-glow{0%,100%{opacity:.25}50%{opacity:.8}}
@keyframes dv-stk{0%,100%{stroke-opacity:.25}50%{stroke-opacity:.95}}
@keyframes dv-glo{0%,100%{opacity:.18}50%{opacity:.5}}
@keyframes dv-blinko{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes dv-pop2{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
@keyframes dv-blink{0%,100%{fill-opacity:.7}50%{fill-opacity:.15}}
@keyframes dv-jolt{0%,100%{transform:translateY(0)}35%{transform:translateY(6px)}65%{transform:translateY(-1px)}}
@keyframes dv-steam{0%{opacity:0;transform:translateY(4px)}35%{opacity:.6}100%{opacity:0;transform:translateY(-12px)}}
@keyframes dv-flow{to{stroke-dashoffset:-7}}
@keyframes dv-fill{from{transform:scaleY(.15)}to{transform:scaleY(1)}}
@keyframes dv-pulse{0%{opacity:.7;transform:scale(.85)}100%{opacity:0;transform:scale(1.25)}}
@keyframes dv-pop{0%{opacity:0;transform:scale(.4)}70%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
@keyframes dv-check{from{stroke-dashoffset:16}to{stroke-dashoffset:0}}
@keyframes dv-ring{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
.scene .done{transform-box:fill-box;transform-origin:center}
@container (max-width:300px){.scene{width:72px;height:72px}.pg{font-size:16px}.ab span{display:none}}`;

class NovaApplianceCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('geraet-card-editor')); }
  static getStubConfig() { return {device_type: 'washer'}; }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (c.device_type && !TYPES[c.device_type]) throw new Error('device_type muss washer, dishwasher, airfryer, coffee oder generic sein');
    this._c = {...GDEF, ...c, controls: [].concat(c.controls || []).map(toObj).filter(o => o.entity), hints: [].concat(c.hints || []).map(toObj).filter(o => o.entity)};
    this._ids = entityIds(this._c);
    this._built = false;
    this._pend = {};
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
  // Bearbeitungsmodus: ausgeblendete Karte trotzdem zeigen, sonst findet man sie nicht wieder
  set preview(v) { this._pv = v; this._update(); }
  get preview() { return this._pv; }
  set editMode(v) { this._em = v; this._update(); }
  get editMode() { return this._em; }
  getCardSize() { return this._c?.layout === 'compact' ? 1 : 3 + Math.ceil((this._c?.controls.length || 0) / 2); }
  getGridOptions() { return this._c?.layout === 'compact' ? {columns: 6, rows: 'auto', min_columns: 3} : {columns: 12, rows: 'auto', min_columns: 4}; }
  connectedCallback() {
    // In der Kartenauswahl: Standbild, kein Takt
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
    Object.values(this._pend || {}).forEach(p => clearTimeout(p.t));
    clearTimeout(this._ft);
  }
  _S(id) { return id ? this._h?.states[id] : null; }
  // Zustandsgruppe (SORDER) oder off
  _cls() {
    const c = this._c, s = this._S(c.entity);
    if (!s) return 'off';
    const v = String(s.state).toLowerCase();
    if (['binary_sensor', 'switch', 'input_boolean'].includes(dom(c.entity)) && !c.running_states) return v === 'on' ? 'run' : 'off';
    for (const k of SORDER) {
      const own = c[SKEY[k]] != null ? list(c[SKEY[k]]).map(x => x.toLowerCase()) : STATES[k];
      if (own.includes(v)) return k;
    }
    return 'off';
  }
  _build() {
    this._built = true;
    const c = this._c, t = typeOf(c), r = this.shadowRoot || this.attachShadow({mode: 'open'}), cmp = c.layout === 'compact';
    const rv = roleVars(c.color || TYPES[t].color);
    const anim = c.animation !== false && !cmp;
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${SCENE_CSS}${DCSS}:host([hidden]){display:none}</style>
<div class="g dv t-${t}${c.window === false ? ' nowin' : ''}${cmp ? ' cmp' : ''}${anim ? ' anim' : ''}${c.glow !== false ? ' glow' : ''}" style="--dc:${rv.c};--dc-fg:${rv.fg}">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${cmp ? '<span class="rmc"></span>' : ''}${c.power ? '<div class="hb pw" title="Ein/Aus"><ha-icon icon="mdi:power"></ha-icon></div>' : ''}</div>
${cmp ? '<div class="bar" hidden><i></i></div>' : `<div class="mid"><div class="w-${t}">${scene(t)}</div><div class="inf"><div class="pg"></div><div class="ph" hidden></div><div class="bar" hidden><i></i></div><div class="tm"><span class="rm"></span><span class="en"></span></div></div></div>
<div class="ctls"></div>${c.start_at === 'home_connect' && c.start ? SA : ''}<div class="acts"></div>`}<div class="als"></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), pw: q('.pw'), pg: q('.pg'), ph: q('.ph'), bar: q('.bar'), bari: q('.bar i'),
      rm: q('.rm') || q('.rmc'), kp: q('.kp'), kt: q('.kt'), wd: q('.wdt'), en: q('.en'), ctls: q('.ctls'), acts: q('.acts'), als: q('.als'), sa: q('.sa'), sat: q('.sa input'), san: q('.sa .now'), sah: q('.sa .sah')};
    const e = this._e;
    press(e.ic, {tap: () => this._act({entity: c.entity, tap_action: c.tap_action}, 'tap', true), hold: () => this._act({entity: c.entity, hold_action: c.hold_action}, 'hold')});
    if (cmp) press(e.name.parentElement, {tap: () => this._act({entity: c.entity, tap_action: c.tap_action}, 'tap', true), hold: () => this._act({entity: c.entity, hold_action: c.hold_action}, 'hold')});
    e.als.addEventListener('click', ev => { const el = ev.target.closest?.('.al[data-e]'); if (el) this._act({entity: el.dataset.e}, 'tap', true); });
    if (e.pw) press(e.pw, {tap: () => this._call(dom(c.power) === 'input_boolean' ? 'input_boolean' : 'switch', 'toggle', c.power, {}, 'Ein/Aus')});
    if (e.ctls) this._ctl = c.controls.map(o => this._mkCtl(o));
    // Startzeit: nur in der Karte vorgemerkt, wird erst beim Druck auf Start umgerechnet und mitgeschickt
    if (e.sa) {
      e.sat.addEventListener('change', () => { this._at = e.sat.value || null; this._update(); });
      press(e.san, {tap: () => { this._at = null; this._update(); }, isolate: true});
    }
    if (e.acts) {
      this._ab = {};
      ['start', 'pause', 'resume', 'stop'].forEach(k => {
        const el = document.createElement('div');
        el.className = `ab a-${k}${k === 'start' ? ' pri' : ''}`;
        el.innerHTML = `<ha-icon icon="${IC[k]}"></ha-icon><span></span>`;
        el.hidden = true;
        press(el, {tap: () => this._do(k), hold: () => c[k] && this._act({entity: c[k]}, 'hold')});
        e.acts.append(el);
        this._ab[k] = el;
      });
    }
    this._prev = null;
    this._tick();
  }
  // Regler: select = Pillen bzw. aufklappbar, number = Plus/Minus oder Schieber, Schalter = Kippschalter
  _mkCtl(o) {
    const el = document.createElement('div'), d = dom(o.entity);
    el.className = 'ct';
    const S = () => this._S(o.entity), up = {o, el};
    if (d === 'select' || d === 'input_select') {
      el.innerHTML = '<div class="kv"><span class="i"></span><span class="k"></span><span class="v"></span><ha-icon class="cv" icon="mdi:chevron-down"></ha-icon></div><div class="pills"></div>';
      up.kind = 'sel'; up.pills = el.querySelector('.pills');
      press(el.firstChild, {tap: () => { if (up.mode !== 'list') return; el.classList.toggle('open'); up.pills.hidden = !el.classList.contains('open'); }, hold: () => this._act(o, 'hold')});
    } else if (d === 'number' || d === 'input_number') {
      const sl = o.display === 'slider';
      el.innerHTML = `<div class="kv"><span class="i"></span><span class="k"></span>${sl ? '<span class="v"></span>' : '<div class="stp"><div class="hb mi"><ha-icon icon="mdi:minus"></ha-icon></div><span class="v"></span><div class="hb pl"><ha-icon icon="mdi:plus"></ha-icon></div></div>'}</div>${sl ? '<input type="range">' : ''}`;
      up.kind = 'num';
      const step = dir => { const s = S(); if (!ok(s)) return; const a = s.attributes, st = +o.step || +a.step || 1, cur = this._pend[o.entity]?.v ?? +s.state;
        const mn = a.min != null ? +a.min : -Infinity, mx = a.max != null ? +a.max : Infinity;
        // Wert außerhalb von min/max (wird als „–“ gezeigt): erster Druck setzt aufs Minimum
        if (cur < mn || cur > mx) return this._setNum(o, isFinite(mn) ? mn : mx);
        this._setNum(o, Math.min(mx, Math.max(mn, Math.round((cur + dir * st) / st) * st))); };
      if (sl) { up.rng = el.querySelector('input'); up.rng.addEventListener('input', () => this._setNum(o, +up.rng.value)); }
      else { press(el.querySelector('.mi'), {tap: () => step(-1), isolate: true}); press(el.querySelector('.pl'), {tap: () => step(1), isolate: true}); }
      press(el.querySelector('.k'), {tap: () => this._act(o, 'tap', true), hold: () => this._act(o, 'hold')});
    } else if (['switch', 'input_boolean'].includes(d)) {
      el.innerHTML = '<div class="row"><span class="i"></span><span class="k" style="flex:1"></span><div class="sw"></div></div>';
      up.kind = 'sw';
      press(el.firstChild, {tap: () => this._call(d, 'toggle', o.entity, {}, o.name || 'Schalter'), hold: () => this._act(o, 'hold')});
    } else {
      el.innerHTML = '<div class="kv"><span class="i"></span><span class="k"></span><span class="v"></span></div>';
      up.kind = 'val';
      press(el.firstChild, {tap: () => this._act(o, 'tap', true), hold: () => this._act(o, 'hold')});
    }
    this._e.ctls.append(el);
    return up;
  }
  // Zahlen gesammelt setzen: erst nach kurzer Pause wird der Dienst aufgerufen
  _setNum(o, v) {
    const p = this._pend[o.entity] ||= {};
    p.v = v; clearTimeout(p.t);
    p.t = setTimeout(() => { delete this._pend[o.entity]; this._call(dom(o.entity), 'set_value', o.entity, {value: v}, o.name || 'Wert'); }, 700);
    this._update();
  }
  _call(d, s, id, data, what) {
    return Promise.resolve(this._h.callService(d, s, {entity_id: id, ...data})).catch(err => this._flash(`${what}: ${err?.message || err}`));
  }
  // Fehler beim Auslösen sichtbar in der Karte zeigen (8 s)
  _flash(msg) {
    this._msg = msg; clearTimeout(this._ft);
    this._ft = setTimeout(() => { this._msg = null; this._update(); }, 8000);
    this._update();
  }
  // Start über ein Select (Home Connect: „Aktives Programm“ setzen) – taugt nicht zum Fortsetzen
  _selStart() { return ['select', 'input_select'].includes(dom(this._c.start)); }
  // Fortsetzen über den Start-Knopf (z. B. Philips) – nur wenn im Editor eingeschaltet und keine eigene Fortsetzen-Entität
  _resStart() { const c = this._c; return !!c.resume_with_start && !c.resume && !!c.start && !this._selStart(); }
  // „Starten um“ → Startzeitpunkt und „Fertig in“ (s) = Zeit bis zum Start + Programmdauer, auf volle Minuten
  _atCalc() {
    const c = this._c;
    if (!this._at || c.start_at !== 'home_connect') return null;
    const [H, M] = this._at.split(':').map(Number), now = new Date(), start = new Date(now);
    start.setHours(H, M, 0, 0);
    if (start <= now) start.setDate(start.getDate() + 1);
    const ds = this._S(c.duration), dur = secsOf(ds);
    if (!dur) return {start, err: 'Programmdauer unbekannt (Editor → Programm und Zeit → Gesamtdauer)'};
    const fin = Math.ceil((start - now) / 60000) * 60 + Math.round(dur / 60) * 60, max = dom(c.duration) === 'number' && ds.attributes.max ? +ds.attributes.max : 86400;
    if (fin > max) return {start, err: `Start zu spät: die Maschine erlaubt höchstens ${fmtDur(max)} bis zum Programmende`};
    return {start, fin, end: now.getTime() + fin * 1000};
  }
  _startBlock() {
    const c = this._c, s = this._S(c.start), rs = this._S(c.remote_start);
    if (!c.start) return null;
    const at = this._atCalc();
    if (at?.err) return at.err;
    if (at && !this._h.entities?.[c.start]?.device_id) return 'Starten um: Gerät der Start-Entität nicht gefunden';
    if (c.remote_start && rs && rs.state !== 'on') return c.remote_start_text || 'Fernstart ist aus – an der Maschine aktivieren';
    if (!s || s.state === 'unavailable') return 'Start gerade nicht möglich (Entität nicht verfügbar)';
    if (this._selStart()) {
      if (!c.start_option) return 'Start: Programm-Quelle fehlt (Editor → Bedienung)';
      const o = this._S(c.start_option);
      if (!ok(o)) return 'Erst ein Programm wählen';
      if (!(s.attributes.options || []).includes(o.state)) return `Programm „${fmtOpt(this._h, o, o.state)}“ kann nicht gestartet werden`;
    }
    return null;
  }
  _do(k) {
    const c = this._c, id = c[k] || (k === 'resume' && this._resStart() ? c.start : null), d = dom(id);
    if (!id) return;
    if (k === 'start' && this._startBlock()) return;
    const conf = k === 'start' ? c.start_confirm : k === 'stop' ? c.stop_confirm : null;
    if (conf && !window.confirm(conf)) return;
    const what = {start: c.start_name || 'Start', pause: 'Pause', resume: 'Fortsetzen', stop: 'Stopp'}[k];
    const at = k === 'start' && this._atCalc();
    if (at) {
      // Home Connect kennt nur „Fertig in“: gewähltes Programm mit berechnetem Wert starten
      const fin = at.fin;
      this._at = null;
      return Promise.resolve(this._h.callService('home_connect', 'start_selected_program', {device_id: this._h.entities[c.start].device_id, b_s_h_common_option_finish_in_relative: fin}))
        .catch(err => this._flash(`${what}: ${err?.message || err}`)).finally(() => this._update());
    }
    if (d === 'select' || d === 'input_select') return this._call(d, 'select_option', id, {option: this._S(c.start_option)?.state}, what);
    if (d === 'button' || d === 'input_button') return this._call(d, 'press', id, {}, what);
    if (d === 'script' || d === 'scene') return this._call(d, 'turn_on', id, {}, what);
    if (d === 'switch' || d === 'input_boolean') return this._call(d, k === 'stop' || k === 'pause' ? 'turn_off' : 'turn_on', id, {}, what);
    this._flash(`${what}: ${id} kann nicht ausgelöst werden`);
  }
  // Restzeit in s und Endzeitpunkt (ms)
  _time(cls) {
    const c = this._c, es = this._S(c.end_time), rs = this._S(c.remaining);
    let end = null, rem = null;
    if (ok(es)) { const t = Date.parse(es.state); if (!isNaN(t)) end = t; }
    const r0 = secsOf(rs);
    if (r0 != null) {
      if (cls === 'pause') rem = r0;
      else if (end == null) end = Date.parse(rs.last_changed) + r0 * 1000;
    }
    if (end != null && rem == null) rem = Math.max(0, (end - Date.now()) / 1000);
    if (cls === 'pause' && rem != null && end != null) end = Date.now() + rem * 1000;
    return {rem, end};
  }
  _progress(cls, rem) {
    const c = this._c, ps = this._S(c.progress);
    if (cls === 'done') return 100;
    if (ok(ps) && NUMRE.test(ps.state)) return Math.max(0, Math.min(100, +ps.state));
    const tot = secsOf(this._S(c.duration));
    if (tot > 0 && rem != null) return Math.max(0, Math.min(100, (1 - rem / tot) * 100));
    return null;
  }
  _update() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !e) return;
    const t = typeOf(c), TY = TYPES[t], s = this._S(c.entity), cls = this._cls(), act = isAct(cls);
    const na = !!c.entity && (!s || s.state === 'unavailable');
    // Fertig-Effekt nur beim Wechsel in „fertig“, nicht beim Laden
    if (this._prev && this._prev !== cls) this._fx = cls === 'done';
    if (cls !== 'done') this._fx = false;
    this._prev = cls;
    const ph = this._S(c.phase || c.entity), phs = c.phase_states != null ? list(c.phase_states) : TY.phase;
    const alt = cls === 'run' && !!ph && phs.map(x => x.toLowerCase()).includes(String(ph.state).toLowerCase());
    [...SORDER, 'off'].forEach(k => e.g.classList.toggle(`st-${k}`, k === cls));
    e.g.classList.toggle('alt', alt);
    e.g.classList.toggle('fx', !!this._fx);
    e.g.classList.toggle('na', na);
    this.classList.toggle('nv-na', na);
    // Ausblenden, wenn aus/fertig – im Bearbeitungsmodus sichtbar
    const hide = !!c.hide_when_off && ['off', 'done', 'ready'].includes(cls) && !this._pv && !this._em && !this.hasAttribute('preview');
    if (this.hidden !== hide) {
      this.hidden = hide;
      // HA-INTERN: hui-card wertet element.hidden aus, sobald card-visibility-changed kommt (ohne: Karte ist nur leer)
      this.dispatchEvent(new CustomEvent('card-visibility-changed', {bubbles: true, composed: true, detail: {value: !hide}}));
    }
    e.name.textContent = c.name ?? s?.attributes.friendly_name ?? TY.label;
    setIcon(e.ic, c.icon || TY.icon);
    e.ic.classList.toggle('on', act);
    // Status: übersetzter Zustand von HA; fehlt die Übersetzung, der Text zum Gerätetyp
    const raw = s ? fmtState(h, s) : '';
    const own = c[TKEY[cls]];
    const def = cls === 'run' ? (alt && TY.alt) || TY.run : TY[cls] || TXT[cls];
    const stx = !c.entity ? 'Status-Entität im Editor wählen' : na ? 'Nicht verfügbar' : own || (['ready', 'heat', 'warm'].includes(cls) || (raw === s.state && def) ? def : nice(s.state, raw));
    e.sub.textContent = stx;
    e.sub.classList.toggle('er', cls === 'err');
    if (e.pw) { const p = this._S(c.power); e.pw.classList.toggle('on', p?.state === 'on'); e.pw.classList.toggle('na', !p || p.state === 'unavailable'); }
    // Programm: laufendes Programm, sonst das gewählte (Quelle für den Start)
    const pgS = [this._S(c.program), this._S(c.start_option)].find(x => ok(x) && x.state !== 'off');
    const pg = pgS ? nice(pgS.state, fmtState(h, pgS)) : '';
    const {rem, end} = act ? this._time(cls) : {rem: null, end: null};
    const p = act || cls === 'done' ? this._progress(cls, rem) : null;
    e.bar.hidden = p == null;
    // Bräunung (Airfryer) und schnelleres Glühen in der letzten Minute
    const pf = cls === 'done' ? 1 : act && p != null ? p / 100 : 0;
    e.g.style.setProperty('--pf', pf.toFixed(2)); e.g.style.setProperty('--pp', `${Math.round(pf * 70)}%`);
    e.g.classList.toggle('last', cls === 'run' && rem != null && rem <= 60);
    // Airfryer-Display: Restzeit roh vom Sensor, Ring = Restzeit / Gesamtdauer (schrumpft wie eine Eieruhr); fehlt etwas, bleibt es leer
    if (e.kp) {
      const r = secsOf(this._S(c.remaining)), tot = secsOf(this._S(c.duration));
      const f = r > 0 && tot > 0 ? Math.min(1, r / tot) : null;
      e.g.classList.toggle('kring', f != null);
      e.kp.style.strokeDashoffset = String(100 - (f ?? 0) * 100);
      if (e.kt) e.kt.textContent = r > 0 ? fmtDisp(r) : '';
    }
    // Waschmaschinen-Display: Restzeit, „End“ wenn fertig, sonst Striche
    if (e.wd) e.wd.textContent = cls === 'done' ? 'End' : cls === 'off' ? '' : rem != null ? fmtDisp(rem) : '– –';
    if (this._fx && !this._sw) { this._sw = true; sweep(e.g); }
    if (!this._fx) this._sw = false;
    if (p != null) e.bari.style.width = `${p}%`;
    if (c.layout === 'compact') {
      e.ic.style.setProperty('--p', `${p ?? 0}%`);
      e.sub.textContent = [pg && act ? pg : stx, p != null && act ? `${Math.round(p)} %` : ''].filter(Boolean).join(' · ');
      e.rm.textContent = rem != null ? fmtDur(rem) : '';
    } else {
      e.pg.textContent = pg || stx;
      const phx = c.phase && ok(ph) ? nice(ph.state, fmtState(h, ph)) : '';
      e.ph.hidden = !phx; e.ph.textContent = phx;
      e.rm.textContent = rem != null && cls !== 'wait' ? `noch ${fmtDur(rem)}` : p != null && act ? `${Math.round(p)} %` : '';
      e.en.textContent = end != null ? `fertig um ${this._clock(end)}` : '';
      this._ctlUp(act);
      this._actUp(cls);
    }
    this._alerts(cls, stx);
    this._tick();
  }
  _clock(ms) {
    const h = this._h, d = new Date(ms), far = ms - Date.now() > 20 * 3600e3;
    try { return new Intl.DateTimeFormat(langOf(h), {hour: '2-digit', minute: '2-digit', ...(far ? {weekday: 'short'} : {}), timeZone: tzOf(h)}).format(d); } catch { return d.toLocaleTimeString().slice(0, 5); }
  }
  _ctlUp(act) {
    const h = this._h;
    (this._ctl || []).forEach(u => {
      const {o, el} = u, s = this._S(o.entity), a = s?.attributes || {};
      el.hidden = o.show === 'idle' ? act : o.show === 'running' ? !act : false;
      el.classList.toggle('na', !s || s.state === 'unavailable');
      const ic = el.querySelector('.i'); if (ic) setIcon(ic, iconOf(h, o, 'mdi:tune'));
      el.querySelector('.k').textContent = o.name ?? a.friendly_name ?? o.entity;
      const v = el.querySelector('.v');
      if (u.kind === 'sel') {
        const opts = (a.options || []).map(String), cur = ok(s) ? s.state : null;
        u.mode = o.display === 'pills' || o.display === 'list' ? o.display : opts.length <= 5 ? 'pills' : 'list';
        el.querySelector('.cv').hidden = u.mode !== 'list';
        if (u.mode === 'pills') u.pills.hidden = false; else u.pills.hidden = !el.classList.contains('open');
        v.textContent = cur != null ? fmtOpt(h, s, cur) : '–';
        v.hidden = u.mode === 'pills';
        const key = opts.join('|');
        if (u.key !== key) {
          u.key = key;
          u.pills.replaceChildren(...opts.map(x => { const p = document.createElement('div'); p.className = 'pill'; p.dataset.o = x;
            press(p, {tap: () => { this._call(dom(o.entity), 'select_option', o.entity, {option: x}, o.name || 'Auswahl'); if (u.mode === 'list') { el.classList.remove('open'); u.pills.hidden = true; } }, isolate: true});
            return p; }));
        }
        [...u.pills.children].forEach(p => { p.textContent = fmtOpt(h, s, p.dataset.o); p.classList.toggle('on', p.dataset.o === cur); });
      } else if (u.kind === 'num') {
        // Wert außerhalb von min/max (z. B. Airfryer im Standby: 0 °C) ist kein echter Wert → „–“, Regler bleibt bedienbar
        const pv = this._pend[o.entity]?.v, raw = pv ?? (ok(s) ? +s.state : null), bad = raw != null && pv == null && ((a.min != null && raw < a.min) || (a.max != null && raw > a.max));
        const n = bad ? null : raw;
        v.textContent = n == null ? '–' : isDur(s) ? fmtDur(n * (SECS[a.unit_of_measurement] || 1)) : valueOf(h, {...s, state: String(n)}, o);
        if (u.rng) { Object.assign(u.rng, {min: a.min ?? 0, max: a.max ?? 100, step: o.step || a.step || 1}); if (n != null && pv == null) u.rng.value = n;
          u.rng.style.setProperty('--p', `${((n ?? 0) - (a.min ?? 0)) / (((a.max ?? 100) - (a.min ?? 0)) || 1) * 100}%`); }
      } else if (u.kind === 'sw') el.firstChild.classList.toggle('on', s?.state === 'on');
      else v.textContent = valueOf(h, s, o);
    });
  }
  // Knöpfe nur mit eingetragener, verfügbarer Entität; Start vor dem Lauf, Pause/Fortsetzen/Stopp währenddessen
  _actUp(cls) {
    const c = this._c, b = this._ab, av = k => !!c[k] && this._S(c[k]) && this._S(c[k]).state !== 'unavailable';
    if (!b) return;
    const act = isAct(cls), blk = this._startBlock();
    b.start.hidden = act || !c.start;
    b.start.classList.toggle('dis', !!blk);
    const at = this._atCalc();
    b.start.lastChild.textContent = at && !at.err ? `${c.start_name || 'Start'} um ${this._clock(at.start.getTime())}` : c.start_name || 'Start';
    const e = this._e;
    if (e.sa) {
      e.sa.hidden = act;
      if (e.sat !== this.shadowRoot.activeElement) e.sat.value = this._at || '';
      e.san.classList.toggle('on', !this._at);
      e.sah.textContent = at && !at.err ? `Fertig ca. ${this._clock(at.end)} · „Fertig in“ ${fmtDur(at.fin)}` : '';
    }
    b.pause.hidden = cls !== 'run' || !av('pause');
    b.resume.hidden = cls !== 'pause' || !(av('resume') || (this._resStart() && av('start')));
    b.stop.hidden = !act || !av('stop');
    ['pause', 'resume', 'stop'].forEach(k => { b[k].lastChild.textContent = {pause: 'Pause', resume: 'Fortsetzen', stop: 'Stopp'}[k]; });
    this._e.acts.hidden = Object.values(b).every(x => x.hidden);
  }
  _alerts(cls, stx) {
    const c = this._c, h = this._h, t = typeOf(c), TY = TYPES[t], g = this._e.g, out = [], on = new Set();
    // e = Entität: Hinweis antippen öffnet sie; hit = Hinweis mit Animation im Bild
    const add = (lvl, ic, msg, e, hit) => out.push(`<div class="al ${lvl}${hit ? ' hit' : ''}"${e ? ` data-e="${esc(e)}"` : ''}><ha-icon icon="${esc(ic)}"></ha-icon><span>${esc(msg)}</span></div>`);
    if (this._msg) add('error', 'mdi:alert-circle-outline', this._msg);
    if (cls === 'err') add('error', 'mdi:alert-circle-outline', stx, c.entity, true);
    const cn = this._S(c.connection);
    if (c.connection && (!cn || ['off', 'unavailable', 'disconnected'].includes(cn.state))) add('error', 'mdi:wifi-off', c.connection_text || 'Keine Verbindung zum Gerät', c.connection);
    const blk = c.layout !== 'compact' && !isAct(cls) ? this._startBlock() : null;
    if (blk) add('warning', 'mdi:play-circle-outline', blk);
    const dr = this._S(c.door), dv = c.door_anim !== false && TY.dview;
    const open = !!dr && ['on', 'open', 'opened'].includes(dr.state);
    if (open) add('info', 'mdi:door-open', c.door_text || TY.door, c.door, dv);
    g.classList.toggle('dopen', open && dv);
    g.classList.toggle('dlock', !!dr && dr.state === 'locked' && dv);
    const can = animsOf(t);
    c.hints.forEach(a => {
      const s = this._S(a.entity);
      if (!alertHit(a, s)) return;
      const an = can.includes(a.anim) ? a.anim : null, H = HANIM[an];
      if (an) on.add(an);
      add(['error', 'info'].includes(a.level) ? a.level : 'warning', a.icon || (H && an !== 'warning' ? H[2] : s?.attributes.icon) || 'mdi:information-outline',
        a.message || (H && H[1]) || `${a.name ?? s.attributes.friendly_name ?? a.entity}: ${fmtState(h, s)}`, a.entity, !!an);
    });
    Object.keys(HANIM).forEach(k => g.classList.toggle(`h-${k}`, on.has(k)));
    const html = out.join('');
    if (this._alKey !== html) { this._alKey = html; this._e.als.innerHTML = html; }
    g.classList.toggle('err', cls === 'err' && c.glow !== false);
  }
  // Sichtbarkeit: Animation und Countdown nur, wenn die Karte zu sehen und der Tab offen ist
  _tick() {
    const vis = !!this._inView && !document.hidden && !this._quiet && this.isConnected;
    this._e?.g.classList.toggle('still', !vis);
    // Lichtstreifen übers Glas, sobald die Karte ins Bild kommt
    if (vis && !this._vis && this._c.animation !== false) sweep(this._e?.g);
    this._vis = vis;
    const run = vis && this._e && ['run', 'wait'].includes(this._prev) && (this._c.end_time || this._c.remaining);
    if (run && !this._tm) this._tm = setInterval(() => this._update(), 30000);
    if (!run && this._tm) { clearInterval(this._tm); this._tm = null; }
  }
  _act(o, kind, info) { return runAction(this, o, kind, info); }
}
define('geraet-card', NovaApplianceCard, {name: 'Nova Gerät Card', description: 'Haushaltsgerät (Waschmaschine, Spülmaschine, Airfryer, Kaffeemaschine …) mit Status, Programm, Fortschritt, Restzeit, Reglern und Start/Pause/Stopp.', documentationURL: docUrl('nova-gerät-card')});

/* ---------- Editor Gerät Card ---------- */
const ST = {entity: {}};
const BTN = {entity: {domain: ['button', 'input_button', 'script', 'scene', 'switch', 'input_boolean']}};
const GGEN = [
  sel('device_type', Object.entries(TYPES).map(([k, v]) => [k, k === 'generic' ? 'Allgemein' : v.label])),
  g2({name: 'name', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}}),
  {name: 'entity', selector: ST},
  {name: 'power', selector: {entity: {domain: ['switch', 'input_boolean']}}},
];
const GPROG = t => [
  {name: 'program', selector: ST},
  g2({name: 'progress', selector: {entity: {domain: ['sensor', 'number', 'input_number']}}}, {name: 'duration', selector: ST}),
  g2({name: 'remaining', selector: ST}, {name: 'end_time', selector: ST}),
  {name: 'phase', selector: ST},
  ...(TYPES[t].alt ? [{name: 'phase_states', selector: {text: {multiple: true}}, context: {t}}] : []),
];
const GCTL = it => {
  const d = dom(it.entity);
  return [
    {name: 'entity', required: true, selector: {entity: {domain: ['select', 'input_select', 'number', 'input_number', 'switch', 'input_boolean', 'sensor']}}},
    NAMEICON,
    ...(d === 'select' || d === 'input_select' ? [sel('display', [['auto', 'Automatisch'], ['pills', 'Alle Optionen als Pillen'], ['list', 'Aufklappen']])] : []),
    ...(d === 'number' || d === 'input_number' ? [g2(sel('display', [['buttons', 'Plus / Minus'], ['slider', 'Schieber']]), NUM('step'))] : []),
    sel('show', [['always', 'Immer'], ['idle', 'Nur vor dem Start'], ['running', 'Nur während des Laufs']]),
  ];
};
const GACT = c => [
  g2({name: 'start', selector: {entity: {domain: [...BTN.entity.domain, 'select', 'input_select']}}}, {name: 'start_name', selector: T}),
  ...(['select', 'input_select'].includes(dom(c.start)) ? [{name: 'start_option', selector: {entity: {domain: ['select', 'input_select', 'sensor', 'input_text']}}}] : []),
  g2({name: 'pause', selector: BTN}, {name: 'resume', selector: BTN}),
  ...(!c.resume && !['select', 'input_select'].includes(dom(c.start)) ? [{name: 'resume_with_start', selector: {boolean: {}}}] : []),
  {name: 'stop', selector: BTN},
  g2({name: 'start_confirm', selector: T}, {name: 'stop_confirm', selector: T}),
  sel('start_at', [['none', 'Aus'], ['home_connect', 'Home Connect (rechnet in „Fertig in“ um)']]),
];
const GINFO = t => [
  g2({name: 'remote_start', selector: ST}, {name: 'remote_start_text', selector: T}),
  g2({name: 'door', selector: ST}, {name: 'door_text', selector: T}),
  ...(TYPES[t].dview ? [{name: 'door_anim', selector: {boolean: {}}}] : []),
  g2({name: 'connection', selector: ST}, {name: 'connection_text', selector: T}),
];
const GHINT = t => [{name: 'entity', required: true, selector: ST}, sel('anim', [['none', 'Keine'], ...animsOf(t).map(k => [k, HANIM[k][0]])]), g2({name: 'message', selector: T}, {name: 'icon', selector: I, context: {icon_entity: 'entity'}}),
  g2({name: 'state', selector: T}, {name: 'state_not', selector: T}), g2(NUM('above'), NUM('below')), sel('level', [['warning', 'Warnung'], ['error', 'Fehler'], ['info', 'Info']])];
const GSTATE = [
  {name: 'running_states', selector: {text: {multiple: true}}}, g2({name: 'paused_states', selector: {text: {multiple: true}}}, {name: 'waiting_states', selector: {text: {multiple: true}}}),
  g2({name: 'finished_states', selector: {text: {multiple: true}}}, {name: 'error_states', selector: {text: {multiple: true}}}),
  g2({name: 'prep_states', selector: {text: {multiple: true}}}, {name: 'ready_states', selector: {text: {multiple: true}}}),
  g2({name: 'heat_states', selector: {text: {multiple: true}}}, {name: 'warm_states', selector: {text: {multiple: true}}}),
];
const GTEXT = [g2({name: 'text_running', selector: T}, {name: 'text_paused', selector: T}), g2({name: 'text_waiting', selector: T}, {name: 'text_finished', selector: T}),
  g2({name: 'text_error', selector: T}, {name: 'text_off', selector: T}), g2({name: 'text_prep', selector: T}, {name: 'text_ready', selector: T}),
  g2({name: 'text_heat', selector: T}, {name: 'text_warm', selector: T})];
const GLOOK = t => [sel('layout', [['full', 'Voll'], ['compact', 'Kompakt (läuft gerade)']]), g2({name: 'hide_when_off', selector: {boolean: {}}}, {name: 'animation', selector: {boolean: {}}}),
  g2(ROLE('color'), {name: 'glow', selector: {boolean: {}}}), ...(t === 'airfryer' ? [{name: 'window', selector: {boolean: {}}}] : [])];
const GACTS = [g2({name: 'tap_action', selector: A}, {name: 'hold_action', selector: A})];
const PHASE_LBL = {washer: 'Zustände „schleudert“ (schnelle Trommel)', coffee: 'Zustände „brüht“ (Kaffee läuft in die Tasse)'};
const GLABELS = {...BASE_LABELS, device_type: 'Gerätetyp', entity: 'Status', power: 'Ein/Aus-Schalter', program: 'Programm', progress: 'Fortschritt (%)', duration: 'Gesamtdauer',
  remaining: 'Restzeit', end_time: 'Endzeit', phase: 'Phase (optional)', phase_states: 'Sonder-Zustände', display: 'Darstellung', step: 'Schrittweite', show: 'Anzeigen',
  start: 'Start', start_name: 'Text auf dem Start-Knopf', start_option: 'Programm für den Start', pause: 'Pause', resume: 'Fortsetzen', resume_with_start: 'Fortsetzen nutzt Start-Knopf', stop: 'Stopp',
  start_confirm: 'Rückfrage vor dem Start', start_at: '„Starten um“ (Uhrzeit wählen)', stop_confirm: 'Rückfrage vor dem Stopp', remote_start: 'Fernstart erlaubt', remote_start_text: 'Hinweis, wenn Fernstart aus',
  door: 'Tür / Schublade', door_anim: 'Tür im Bild zeigen', anim: 'Animation im Bild', door_text: 'Hinweis, wenn offen', connection: 'Verbindung', connection_text: 'Hinweis ohne Verbindung', message: 'Meldung', level: 'Stufe',
  running_states: 'Zustände „läuft“', paused_states: 'Zustände „pausiert“', waiting_states: 'Zustände „startet später“', finished_states: 'Zustände „fertig“', error_states: 'Zustände „Störung“', prep_states: 'Zustände „wird eingestellt“', text_prep: 'Text „wird eingestellt“',
  ready_states: 'Zustände „bereit“', heat_states: 'Zustände „heizt auf“', warm_states: 'Zustände „hält warm“', text_ready: 'Text „bereit“', text_heat: 'Text „heizt auf“', text_warm: 'Text „hält warm“',
  text_running: 'Text „läuft“', text_paused: 'Text „pausiert“', text_waiting: 'Text „startet später“', text_finished: 'Text „fertig“', text_error: 'Text „Störung“', text_off: 'Text „aus“',
  layout: 'Darstellung', hide_when_off: 'Ausblenden, wenn aus, bereit oder fertig', animation: 'Animation (aus = Standbild)', color: 'Farbe', glow: 'Rahmen leuchtet beim Laufen', window: 'Sichtfenster'};
const GHELPERS = {
  device_type: 'Bestimmt nur Symbol, Texte, Standardfarbe und Animation',
  entity: 'Betriebszustand, z. B. sensor.waschmaschine_betriebszustand – auch binary_sensor (an = läuft)',
  power: 'Optional: runder Knopf oben rechts',
  program: 'Laufendes Programm (Select oder Sensor). Leer bzw. ohne Wert = Programm für den Start',
  progress: 'Leer = aus Restzeit und Gesamtdauer berechnet',
  duration: 'Für den Fortschritt ohne Fortschritts-Sensor und für „Starten um“ (Programmdauer vor dem Start)',
  remaining: 'Sensor mit s/min/h oder H:MM. Endzeit wird daraus berechnet',
  end_time: 'Zeitpunkt-Sensor. Restzeit wird daraus berechnet',
  phase: 'Leer = Status. Steuert die Sonder-Animation und wird unter dem Programm angezeigt',
  phase_states: 'Leer = Vorschlag zum Gerätetyp',
  show: 'z. B. Temperatur und Schleudern nur vor dem Start',
  step: 'Leer = Schritt der Entität (bei „Fertig in“ in Sekunden z. B. 1800 = 30 min)',
  start: 'Button, Skript, Schalter – oder ein Select wie „Aktives Programm“ bei Home Connect',
  start_at: 'Startzeit in der Karte wählen. Braucht die Gesamtdauer (Programm und Zeit), z. B. number.…_beenden_in_relativ – Home Connect meldet dort vor dem Start die Programmdauer',
  start_option: 'Dessen Wert wird beim Start gesetzt, z. B. select.waschmaschine_ausgewahltes_programm',
  start_name: 'Leer = „Start“',
  resume: 'Leer = kein Fortsetzen-Knopf, außer „Fortsetzen nutzt Start-Knopf“ ist an',
  resume_with_start: 'Bei Pause erscheint „Fortsetzen“ und drückt den Start-Knopf (z. B. Philips Airfryer). Nicht bei Start über ein Select',
  remote_start: 'z. B. binary_sensor.waschmaschine_fernstart – aus = Start ausgegraut mit Hinweis',
  door: 'Hinweis, wenn an bzw. open',
  door_anim: 'Offen = Tür bzw. Schublade im Bild offen, „locked“ = Schloss am Bullauge',
  anim: 'Was im Gerätebild passiert, solange der Hinweis aktiv ist. Ohne eigene Meldung erscheint ein passender Text',
  connection: 'Hinweis, wenn aus bzw. nicht verfügbar',
  running_states: 'Leer = übliche Rohzustände (run, running, cooking …). Genaue Zustände der Status-Entität',
  prep_states: 'Gerät wird gerade eingestellt (z. B. Airfryer „setting“). Leer = setting, programming …',
  ready_states: 'An, aber nichts läuft. Leer = ready, idle, standby, mainmenu. Alles Unbekannte gilt als „aus“',
  heat_states: 'Leer = heating, preheating, preheat. Ruhiges Glühen statt Lauf-Animation',
  warm_states: 'Leer = maintain (Philips), keep_warm, warming. Schwaches Glühen',
  text_running: 'Leer = Übersetzung von HA, sonst Text zum Gerätetyp',
  window: 'Aus = Gerät ohne Fenster: Hitze steigt oben auf, der Knopfring zeigt alles an',
  hide_when_off: 'Gut für die Startseite: Karte nur, solange etwas läuft. Im Bearbeitungsmodus bleibt sie sichtbar',
  color: 'Farbrolle aus dem Theme (Fortschritt, Start-Knopf, Animation)',
  message: 'Leer = Name: Zustand',
  state: 'Hinweis bei diesem Zustand (mehrere mit Komma)',
  state_not: 'Hinweis bei jedem Zustand außer diesem, z. B. 0 bei einem Fehlercode',
};
const gvis = c => `${typeOf(c)}|${['select', 'input_select'].includes(dom(c.start))}|${!c.resume}`;

class NovaApplianceCardEditor extends NovaEditorBase {
  static labels = GLABELS;
  static helpers = GHELPERS;
  static openSections = ['general'];
  _build() {
    const r = this.shadowRoot, c0 = this._config, t = typeOf(c0);
    GLABELS.phase_states = PHASE_LBL[t] || 'Sonder-Zustände';
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap');
    const strip = c => { Object.entries(GDEF).forEach(([k, x]) => c[k] === x && delete c[k]); if (c.color === TYPES[typeOf(c)].color) delete c.color; return c; };
    const data = {...GDEF, color: TYPES[t].color, ...c0};
    const form = schema => this._form(schema, data, v => {
      const c = strip(merge(this._config, names(schema), v));
      this._emit(c);
      // Gerätetyp oder Art des Starts geändert → passende Felder zeigen
      if (gvis(c) !== gvis(c0)) this._rebuild();
    });
    w.append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => b.append(form(GGEN))),
      this._section('program', 'mdi:progress-clock', 'Programm und Zeit', b => b.append(form(GPROG(t)))),
      this._section('controls', 'mdi:tune-variant', 'Regler', b => {
        b.append(this._hint('Einstellungen vor dem Start, z. B. Programm, Temperatur, Schleudern, „Fertig in“, Kochzeit. Select = Auswahl, Zahl = Plus/Minus, Schalter = Kippschalter.'));
        this._itemList(b, 'controls', GCTL, {item: 'Regler', icon: 'mdi:tune'}, 'Regler hinzufügen');
      }),
      this._section('buttons', 'mdi:play-pause', 'Bedienung', b => {
        b.append(this._hint('Knöpfe erscheinen nur, wenn eine Entität eingetragen und verfügbar ist: Start vor dem Lauf, Pause/Fortsetzen/Stopp währenddessen.'));
        b.append(form(GACT(data)));
      }),
      this._section('hints', 'mdi:alert-circle-outline', 'Hinweise', b => {
        b.append(form(GINFO(t)), this._h4('Weitere Hinweise'), this._hint('z. B. Fehlercode (Warnen außer bei 0), Wartung fällig, Nachfüllen.'));
        this._itemList(b, 'hints', GHINT(t), {item: 'Hinweis', icon: 'mdi:information-outline'}, 'Hinweis hinzufügen');
      }),
      this._section('states', 'mdi:state-machine', 'Zustände und Texte', b => {
        b.append(this._hint('Nur nötig, wenn die Karte den Zustand falsch einordnet. Zustände so eintragen, wie sie in den Entwicklerwerkzeugen stehen.'));
        b.append(form(GSTATE), this._h4('Texte'), form(GTEXT));
      }),
      this._section('look', 'mdi:palette-outline', 'Aussehen', b => b.append(form(GLOOK(t)))),
      this._section('actions', 'mdi:gesture-tap', 'Aktionen', b => b.append(form(GACTS))));
  }
}
define('geraet-card-editor', NovaApplianceCardEditor);
