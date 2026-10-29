import {define, docUrl, tag} from './shared/define.js';
import {esc, dom, setIcon, list, NUMRE, toObj} from './shared/utils.js';
import {fmtState, iconOf, valueOf, alertHit, langOf, tzOf} from './shared/state.js';
import {runAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, SECTION_EDITOR_CSS, roleVars} from './shared/styles.js';
import {hassChanged, entityIds, inPicker} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, A, NUM, sel, ROLE, NAMEICON, BASE_LABELS} from './shared/editor-schema.js';
import {PAL, sceneDefs, SCENE_CSS, frameGlow, sweep, badgeAt} from './shared/scene.js';

/* ---------- Nova Gerät Card ---------- */
// Gerätetypen: bestimmen nur Symbol, Standardtexte, Standardfarbe und Animation – die Entitäten wählt der Nutzer
const TYPES = {
  washer: {label: 'Waschmaschine', icon: 'mdi:washing-machine', color: 'accent-1', run: 'Wäscht', alt: 'Schleudert', door: 'Tür offen', phase: ['spin', 'spinning', 'schleudern'], anims: ['detergent', 'softener'], dview: true},
  dishwasher: {label: 'Spülmaschine', icon: 'mdi:dishwasher', color: 'accent-1', run: 'Spült', alt: 'Trocknet', door: 'Tür offen', phase: ['drying', 'dry', 'trocknen', 'ending'], dview: true},
  airfryer: {label: 'Airfryer', icon: 'mdi:toaster-oven', color: 'accent-1', run: 'Gart', heat: 'Heizt vor', door: 'Schublade offen', phase: [], dview: true},
  coffee: {label: 'Kaffeemaschine', icon: 'mdi:coffee-maker-outline', color: 'accent-1', run: 'Brüht', door: 'Tür offen', phase: [], anims: ['tank', 'beans', 'descale'], drink: true},
  feeder: {label: 'Futterautomat', icon: 'mdi:bowl-mix-outline', color: 'accent-1', run: 'Füttert', door: 'Deckel offen', phase: [], anims: ['food'], level: true, feed: true, mode: true, lvl: ['Füllstand', 'Futter ausreichend', 'Wenig Futter'], pick: 'Portion'},
  fountain: {label: 'Trinkbrunnen', icon: 'mdi:fountain', color: 'accent-1', run: 'Läuft', door: 'Deckel offen', phase: [], anims: ['water', 'filter'], level: true, nodone: true, mode: true, lvl: ['Wasserstand', 'Wasser ok', 'Wasser fehlt'], binEmpty: true, filter: true},
  generic: {label: 'Gerät', icon: 'mdi:power-plug-outline', color: 'accent-1', run: 'Läuft', door: 'Tür offen', phase: []},
};
const typeOf = c => TYPES[c.device_type] ? c.device_type : 'generic';
// Hinweis-Animationen im Bild; Standardtext, falls der Hinweis keinen eigenen hat
const HANIM = {tank: ['Wassertank', 'Wassertank leer', 'mdi:cup-water'], beans: ['Bohnen', 'Bohnen nachfüllen', 'mdi:coffee-outline'], descale: ['Entkalken', 'Entkalken', 'mdi:water-alert-outline'],
  detergent: ['Waschmittel', 'Waschmittel leer', 'mdi:bottle-tonic-outline'], softener: ['Weichspüler', 'Weichspüler leer', 'mdi:bottle-tonic-plus-outline'],
  food: ['Futter leer', 'Futter nachfüllen', 'mdi:food-off'], water: ['Wasser niedrig', 'Wasser nachfüllen', 'mdi:water-alert-outline'], filter: ['Filter', 'Filter wechseln', 'mdi:air-filter'], warning: ['Allgemeine Warnung', '', 'mdi:alert-outline']};
const animsOf = t => [...(TYPES[t].anims || []), 'warning'];
// Zustandsgruppen; Rohzustände der gängigen Integrationen (Home Connect, WashData, Philips, Miele …), im Editor überschreibbar
const STATES = {
  run: ['run', 'running', 'on', 'cooking', 'brewing', 'feeding', 'dispensing', 'starting', 'ending', 'anti_wrinkle', 'washing', 'rinsing', 'spinning', 'drying', 'aborting', 'in_use', 'programmed_running'],
  pause: ['pause', 'paused', 'user_paused'],
  wait: ['delayedstart', 'delayed_start', 'delay_wait', 'scheduled', 'waiting_to_start'],
  done: ['finished', 'finish', 'done', 'complete', 'completed', 'clean', 'end', 'programme_ended'],
  err: ['error', 'fault', 'failure', 'actionrequired', 'action_required', 'interrupted'],
  prep: ['setting', 'programming', 'selecting', 'adjusting'],
  heat: ['heating', 'preheating', 'preheat', 'heat_up'],
  warm: ['maintain', 'keep_warm', 'keepwarm', 'warming'],
  ready: ['ready', 'idle', 'standby', 'mainmenu', 'online'],
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
// Auswahl für den Start direkt in der Karte (Start-Select ohne Programm-Quelle, z. B. Portion beim Futterautomaten)
const PICK = '<div class="ct pk"><div class="kv"><ha-icon icon="mdi:tune-variant"></ha-icon><span class="k"></span><div class="stp"><div class="hb mi"><ha-icon icon="mdi:minus"></ha-icon></div><span class="v"></span><div class="hb pl"><ha-icon icon="mdi:plus"></ha-icon></div></div></div></div>';
const IC = {start: 'mdi:play', pause: 'mdi:pause', resume: 'mdi:play-pause', stop: 'mdi:stop'};
// Füllstand 0…1 aus Prozent-Sensor oder binary_sensor bzw. Text (an/low = niedrig, empty = leer); null = unbekannt bzw. genug
// empty = „an“ heißt leer statt niedrig (z. B. Wasser fehlt beim Trinkbrunnen)
function levelOf(s, empty) {
  if (!ok(s)) return null;
  const v = String(s.state).toLowerCase();
  if (NUMRE.test(v)) return Math.max(0, Math.min(1, +v / 100));
  return ['on', 'low', 'niedrig'].includes(v) ? (empty ? 0 : .12) : ['empty', 'leer'].includes(v) ? 0 : null;
}
// Füllstand als Hauptinfo: Prozent, sonst Text für ausreichend/niedrig (binary_sensor); null = keine Angabe
function levelText(s, L) {
  if (!ok(s)) return null;
  const v = String(s.state).toLowerCase();
  if (NUMRE.test(v)) return `${Math.round(+v)} %`;
  return ['on', 'low', 'niedrig', 'empty', 'leer'].includes(v) ? L[2] : ['off', 'ok', 'normal', 'full', 'voll'].includes(v) ? L[1] : null;
}
// Kaffee: Getränk am Programmnamen erkennen (Rohwert und Übersetzung) → Art, Text im Display, Farben (Kaffee, Crema, Milch/Schaum)
const DRINKS = [
  ['water', /hot water|hei(ß|ss)wasser|\btee\b|\btea\b/, 'Wasser'], ['lm', /latte macchiato/, 'Latte M.'],
  ['latte', /latte|milchkaffee|caf(e|é) au lait|con leche/, 'Latte'], ['cappu', /cappuccino|flat white|cortado|macchiato/, 'Cappuccino'],
  ['milk', /milk|milch/, 'Milch'], ['espresso', /espresso|ristretto|doppio/, 'Espresso'], ['coffee', /^/, 'Kaffee']];
const drinkOf = txt => DRINKS.find(d => d[1].test(txt.toLowerCase().replace(/_/g, ' ')));
const MILK = new Set(['cappu', 'latte', 'lm', 'milk']);
// Feste Materialfarben der Getränke (wie Chrom oder Glas, keine Farbrolle)
const CK = {espresso: ['#2e1a10', '#9a6436', '#d9c4a4'], coffee: ['#4a2c19', '#b07a48', '#e8dccb'], cappu: ['#6b4329', '#b07a48', '#efe6d8'],
  latte: ['#9a6c47', '#c49a6c', '#f1e9dd'], lm: ['#7a4e2e', '#c49a6c', '#f3ece2'], milk: ['#ece3d4', '#f3ece2', '#f6f1ea'], water: ['#a9c6e8', '#a9c6e8', '#a9c6e8']};
// Futterautomat: Dauer der Fütterungs-Animation nach einem neuen Zählerstand
const FEED_MS = 8000;

// Fertig-Haken, in allen Zeichnungen unten rechts
// Warnung/Störung: rundes Ausrufezeichen oben links, gleiche Größe wie der Fertig-Badge (Radius 11,5)
const WARN = '<g class="wn"><circle class="wt3" cx="22" cy="20" r="11.5"/><rect class="wx" x="20.5" y="12.6" width="3" height="9.6" rx="1.5"/><circle class="wx2" cx="22" cy="26.4" r="1.8"/></g>';
const DONE = '<g class="done"><circle class="dr" cx="80" cy="82" r="10"/><circle class="dc" cx="80" cy="82" r="10"/><path class="dk" d="M75.5 82 l3 3 l6 -6.5"/></g>';
// Fertig-Badge der Zeichnungen im Nova-Stil an der gemeinsamen Stelle (badgeAt): Ecke unten rechts des Gehäuses
const doneAt = (right, bottom) => { const b = badgeAt(right, bottom), s = b.r / 10; return `<g transform="translate(${+(b.x - 80 * s).toFixed(2)} ${+(b.y - 82 * s).toFixed(2)}) scale(${s})">${DONE}</g>`; };
// Airfryer: Gehäuse (unten breiter), linke Kante bei Höhe y, Schublade zwischen Fuge und Sockel, Heizspirale
const AX = y => 47.5 - (y - 27) / 127 * 9;
const ABODY = 'M55 20 H145 Q152 20 152.5 27 L161.5 154 Q163 172 143 172 H57 Q37 172 38.5 154 L47.5 27 Q48 20 55 20 Z';
const ADRW = `M${AX(93).toFixed(2)} 93 H${(200 - AX(93)).toFixed(2)} L${(200 - AX(158)).toFixed(2)} 158 Q${(200 - AX(158)).toFixed(2)} 162 157 162 H43 Q${AX(158).toFixed(2)} 162 ${AX(158).toFixed(2)} 158 Z`;
const ACOIL = `M66 104.5 ${Array.from({length: 11}, () => 'q1.6 -2.6 3.2 0 t3.2 0').join(' ')}`;
// Bullauge der Waschmaschine
const WDOOR = `<circle class="rng" cx="100" cy="114" r="44" stroke="url(#w-cr)"/><circle class="rgo" cx="100" cy="114" r="46"/><circle class="blk" cx="100" cy="114" r="39"/>
<circle class="s-glass" cx="100" cy="114" r="36" fill="url(#w-gl)"/>
<g clip-path="url(#w-ci)"><path class="s-refl" d="M80 78 h22 l-40 62 v-32 z"/><path class="s-refl" d="M112 78 h6 l-56 86 v-12 z"/>
<g transform="rotate(22 100 114)"><rect class="s-gls" x="38" y="56" width="16" height="116" fill="url(#w-gs)"/></g></g>
<path class="sh" d="M71 102 a30 30 0 0 1 17 -18"/><rect class="hdl" x="140.6" y="106" width="3.6" height="16" rx="1.8"/>`;
// Spülmaschine: Tür als Fläche mit Fensterausschnitt, Innenraum (oberer Korb mit Gläsern und Tassen, unterer Korb mit
// Tellern und Besteckkorb, Sprüharme mit Wasserstrahl, Dampf beim Trocknen) und Beschlag auf dem Glas
// Tür offen: um ca. 18° nach vorn gekippt, oben breiter (näher), Fenster verkürzt
const QTILT = 'M31 64 H169 L166 176.4 H34 Z M44 84 H156 L154 166 H46 Z';
const QDOOR = 'M34 40 H166 V176.4 H34 Z M50 64 H150 a4 4 0 0 1 4 4 V160 a4 4 0 0 1 -4 4 H50 a4 4 0 0 1 -4 -4 V68 a4 4 0 0 1 4 -4 Z';
const qWine = x => `<path class="qgl" d="M${x - 5} 104 Q${x - 5.4} 94 ${x - .8} 91.5 V85.4 h1.6 V91.5 Q${x + 5.4} 94 ${x + 5} 104 Z"/><rect class="qgl" x="${x - 4.4}" y="84.4" width="8.8" height="1.2" rx=".6"/><path class="qgh" d="M${x - 3.6} 101.6 Q${x - 3.9} 96 ${x - 1.8} 93.6"/>`;
const qTumb = x => `<path class="qgl" d="M${x - 4} 104 L${x - 3.2} 91 h6.4 L${x + 4} 104 Z"/><path class="qgh" d="M${x - 2.6} 102 L${x - 2} 93"/>`;
const qCup = (x, c) => `<path class="qcup${c ? ' c2' : ''}" d="M${x - 5} 104 v-9.5 a2 2 0 0 1 2 -2 h6 a2 2 0 0 1 2 2 v9.5 Z"/><path class="qcuh" d="M${x + 5} 95.6 h1.4 a2.5 2.5 0 0 1 0 5 h-1.4"/><path class="qgh" d="M${x - 3.4} 102 v-7"/>`;
const qWire = (y1, y2) => `<path class="qwire" d="${Array.from({length: 19}, (_, i) => `M${46 + i * 6} ${y1} V${y2}`).join(' ')}"/><rect class="qrl" x="45" y="${y2 - .6}" width="110" height="1.4" rx=".7"/><rect class="qrl t" x="45" y="${y1 - .4}" width="110" height=".9" rx=".45"/><circle class="qrol" cx="47" cy="${y2 + 1.6}" r="1.6"/><circle class="qrol" cx="153" cy="${y2 + 1.6}" r="1.6"/>`;
const qArm = (y, w) => `<g class="qarm" style="transform-origin:100px ${y + 1.1}px"><rect x="${100 - w}" y="${y}" width="${w * 2}" height="2.2" rx="1.1" fill="url(#d-cr)"/>${[-.8, -.45, .45, .8].map(f => `<circle class="qnz" cx="${100 + f * w}" cy="${y + 1.1}" r=".55"/>`).join('')}</g><circle class="qhub" cx="100" cy="${y + 1.1}" r="2.8" fill="url(#d-cr)"/>`;
const qJets = (y, xs) => `<g class="qjet">${xs.map((x, i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 1 : 1.3}" style="--dx:${x < 100 ? -4 : 4}px;animation-delay:${(i * .27).toFixed(2)}s"/>`).join('')}</g>`;
const QIN = `<g class="qtop"><path class="qcut" d="M58 37.4 h18 M82 36.6 h16 M118 37.4 h20"/><ellipse class="qcuts" cx="76.6" cy="37.4" rx="2.2" ry="1.2"/><path class="qcutk" d="M98 36.6 h6 q-1 1.4 -6 1.2 Z"/>${qWire(33, 40.5)}</g>
<g class="qup">${[58, 70].map(qWine).join('')}${qTumb(82)}${qCup(96)}${qCup(110, 1)}${qTumb(124)}${[136, 146].map(qWine).join('')}${qWire(88, 104.5)}</g>
${qJets(108, [74, 84, 92, 108, 116, 126])}${qArm(109, 30)}
<g class="qlo">${[56, 61.5, 67, 72.5, 78, 83.5].map((x, i) => `<ellipse class="qpl${i === 2 ? ' c2' : ''}" cx="${x}" cy="140" rx="2.4" ry="${i % 3 === 1 ? 16 : 15}" transform="rotate(-9 ${x} 140)"/><path class="qph" d="M${x - .9} 128 v9" transform="rotate(-9 ${x} 140)"/>`).join('')}
${[94, 100.5].map(x => `<ellipse class="qpl" cx="${x}" cy="138" rx="2.8" ry="18" transform="rotate(-6 ${x} 138)"/><path class="qph" d="M${x - 1} 124 v10" transform="rotate(-6 ${x} 138)"/>`).join('')}
<path class="qcut" d="M127 125 v13 M130.5 124 v14 M134 126 v12 M140 125 v13 M143.5 123.6 v14.4 M147 125 v13"/>
<ellipse class="qcuts" cx="127" cy="124" rx="1.4" ry="2.2"/><ellipse class="qcuts" cx="140" cy="124" rx="1.4" ry="2.2"/><path class="qcutf" d="M129.6 121 v3 M130.5 120.6 v3.4 M131.4 121 v3 M142.6 120.4 v3.2 M143.5 120 v3.6 M144.4 120.4 v3.2"/>
<path class="qcutk" d="M134 126 v-6.4 q1.4 1.6 1.2 6.4 Z M147 125 v-6.4 q1.4 1.6 1.2 6.4 Z"/>
<rect class="s-part" x="122" y="134" width="30" height="21" rx="1.6" fill="url(#d-pt)"/><rect x="123" y="135" width="28" height="19" rx="1.2" fill="url(#d-pf)"/>
${qWire(138, 156.5)}</g>
${qJets(161, [70, 80, 90, 110, 120, 130])}${qArm(162, 34)}<ellipse class="qsmp" cx="100" cy="171" rx="9" ry="2"/>
<g class="qstm">${[66, 90, 112, 136].map((x, i) => `<path d="M${x} 150 q3 -6 0 -12 q-3 -6 0 -12 q3 -6 0 -12" style="animation-delay:${(i * .8).toFixed(1)}s"/>`).join('')}</g>`;
// Beschlag: feine Tropfen auf der Scheibe (laufen/trocknen)
const QFOG = Array.from({length: 46}, (_, i) => { const x = 49 + ((i * 37) % 103), y = 67 + ((i * 53) % 94); return `<circle cx="${x}" cy="${y}" r="${(.35 + (i % 4) * .18).toFixed(2)}"/>`; }).join('');
// Trockenfutter: lose, unregelmäßige Brocken (fester Zufall, damit das Bild immer gleich aussieht). Reihen von oben nach unten,
// damit untere Brocken die oberen leicht überdecken; ab und zu fehlt einer (Lücke). top(x) = Oberkante des Haufens
function kibble(x0, x1, y1, top, rMin, rMax, seed) {
  let q = seed;
  const rnd = () => (q = q * 16807 % 2147483647) / 2147483647, out = [];
  for (let y = Math.min(...[x0, (x0 + x1) / 2, x1].map(top)) - 2; y < y1 + 3; y += 2.6 + rMax * .55) {
    for (let x = x0 - 1 + rnd() * 2.5; x < x1 + 2; x += rMax * 1.25 + rnd() * rMax * .6) {
      const r = rMin + rnd() * (rMax - rMin), cx = x + (rnd() - .5) * 1.6, cy = y + (rnd() - .5) * 1.8;
      if (cy < top(cx) + r * .2 || rnd() < .1) continue;
      const k = 1 + Math.floor(rnd() * 5), a = Array.from({length: 4}, () => r * (.82 + rnd() * .36)), f = n => n.toFixed(1);
      out.push(`<g class="kbl k${k}" transform="rotate(${Math.round(rnd() * 180)} ${f(cx)} ${f(cy)})"><path d="M${f(cx - a[0])} ${f(cy)}Q${f(cx - a[0])} ${f(cy - a[1])} ${f(cx)} ${f(cy - a[1])}Q${f(cx + a[2])} ${f(cy - a[1])} ${f(cx + a[2])} ${f(cy)}Q${f(cx + a[2])} ${f(cy + a[3])} ${f(cx)} ${f(cy + a[3])}Q${f(cx - a[0])} ${f(cy + a[3])} ${f(cx - a[0])} ${f(cy)}Z"/><ellipse cx="${f(cx - r * .3)}" cy="${f(cy - r * .38)}" rx="${f(r * .38)}" ry="${f(r * .24)}"/></g>`);
    }
  }
  return out.join('');
}
const KIB_BIN = kibble(64, 136, 124, x => 45 + 2.4 * Math.sin((x - 64) / 9), 2.2, 3.6, 7);
const KIB_BOWL = kibble(62, 138, 178, x => 174.5 - 15 * Math.max(0, 1 - ((x - 100) / 38) ** 2), 1.7, 2.7, 11);
/* Animationen: reines SVG + CSS, laufen nur bei .st-run (bzw. Fertig-Effekt einmalig), stehen bei .still */
const SV = {
  washer: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${sceneDefs('w')}
<radialGradient id="w-dr" cx=".42" cy=".35" r=".75"><stop offset="0" stop-color="#5a6479"/><stop offset=".6" stop-color="#2c3342"/><stop offset="1" stop-color="#141821"/></radialGradient>
<linearGradient id="w-pd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8d98ac"/><stop offset="1" stop-color="#3a4252"/></linearGradient>
<radialGradient id="w-vg"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
<radialGradient id="w-lt" cx=".5" cy="0" r=".9"><stop offset="0" class="w-lc" stop-opacity=".5"/><stop offset="1" class="w-lc" stop-opacity="0"/></radialGradient>
<linearGradient id="w-wa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="w-lc" stop-opacity=".6"/><stop offset="1" class="w-lc" stop-opacity=".25"/></linearGradient>
<pattern id="w-pf" width="4.5" height="4.5" patternUnits="userSpaceOnUse"><circle cx="2.25" cy="2.25" r=".7" fill="#000" fill-opacity=".35"/></pattern>
<radialGradient id="w-gb" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity=".03"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></radialGradient>
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
<circle class="gsk" cx="100" cy="114" r="41"/><circle class="gsm" cx="100" cy="114" r="38.6"/><circle class="gsf" cx="100" cy="114" r="37.4"/><circle class="gsh" cx="100" cy="114" r="40.2"/>
<g clip-path="url(#w-ci)"><circle cx="100" cy="114" r="36" fill="url(#w-dr)"/>
<g class="drum"><circle cx="100" cy="114" r="34" fill="url(#w-pf)"/><circle class="drm" cx="100" cy="114" r="22"/>
${[0, 120, 240].map(a => `<g class="pdl" transform="rotate(${a} 100 114)"><path d="M93 78.6 Q100 77.6 107 78.6 L103.2 93 Q100 94.6 96.8 93 Z" fill="url(#w-pd)"/><path class="pdh" d="M94.6 79.4 L97.6 92 h-.9 L93.6 79.6 Z"/></g>`).join('')}
<path class="cl" d="M76 128 q8 -10 18 -3 q8 5 16 -2 q5 10 -8 14 q-14 4 -26 -9 Z"/><path class="cl c2" d="M90 100 q8 -5 15 1 q-3 7 -10 6 q-6 -1 -5 -7 Z"/>
<circle class="hub" cx="100" cy="114" r="6" fill="url(#w-cr)"/><circle class="hbc" cx="100" cy="114" r="2.4"/><circle class="spn" cx="100" cy="114" r="27"/></g>
<rect class="dlt" x="64" y="78" width="72" height="50" fill="url(#w-lt)"/>
<g class="wl"><g class="wv2"><path d="M25 121 q6.25 -2.5 12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 V160 H25 Z" fill="url(#w-wa)" opacity=".5"/></g>
<g class="wv"><path d="M50 124 q6.25 -3.5 12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 V160 H50 Z" fill="url(#w-wa)"/></g></g>
<circle cx="100" cy="114" r="36" fill="url(#w-vg)"/></g>
<rect class="hng s-part" x="45" y="101" width="13" height="26" rx="3" fill="url(#w-pt)"/><g class="pd"><circle class="pdt" cx="105" cy="114" r="44"/>${WDOOR}<circle class="pgb" cx="100" cy="114" r="36" fill="url(#w-gb)"/></g>

${doneAt(170, 189)}${WARN}</svg>`,
  // Spülmaschine (Vorbild Siemens Unterbau): Bedienleiste mit Display, Edelstahlfront mit Rauchglas-Fenster, Körbe mit
  // Gläsern, Tassen, Tellern und Besteck, zwei Sprüharme; Tür offen = Klappe nach unten, Körbe frei
  dishwasher: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${sceneDefs('d')}
<linearGradient id="d-pn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c212b"/><stop offset="1" stop-color="#0a0d12"/></linearGradient>
<linearGradient id="d-bb" x1="0" y1="0" x2="1" y2="0"><stop offset=".18" stop-color="#fff" stop-opacity="0"/><stop offset=".34" stop-color="#fff" stop-opacity=".05"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".03"/><stop offset=".86" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="d-vg" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
<radialGradient id="d-lt" cx=".5" cy="0" r="1"><stop offset="0" class="q-lc" stop-opacity=".36"/><stop offset="1" class="q-lc" stop-opacity="0"/></radialGradient>
<pattern id="d-pf" width="3.4" height="3.4" patternUnits="userSpaceOnUse"><circle cx="1.7" cy="1.7" r=".75" fill="#000" fill-opacity=".45"/></pattern>
<clipPath id="d-tc"><rect x="40" y="18" width="120" height="158"/></clipPath><clipPath id="d-tw"><path d="M44 84 H156 L154 166 H46 Z"/></clipPath><filter id="d-bl" x="-60%" y="-120%" width="220%" height="340%"><feGaussianBlur stdDeviation="2.4"/></filter><clipPath id="d-wc"><rect x="46" y="64" width="108" height="100" rx="4"/></clipPath></defs>
<ellipse class="s-shd" cx="100" cy="192" rx="72" ry="4.5"/>
<rect class="s-body" x="34" y="14" width="132" height="175" rx="9" fill="url(#d-bd)"/><rect class="s-sheen" x="34" y="14" width="132" height="175" rx="9" fill="url(#d-sh)"/>
<rect class="qplin" x="38" y="177" width="124" height="11" rx="1.5"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map(i => `<rect class="qvent" x="${70 + i * 7}" y="181" width="4" height="3" rx="1"/>`).join('')}
<g clip-path="url(#d-tc)"><rect x="40" y="18" width="120" height="158" fill="url(#d-in)"/>
<path class="qrail" d="M44.5 20 V172 M155.5 20 V172"/><rect class="s-part" x="95" y="19" width="10" height="3.6" rx="1.2" fill="url(#d-pt)"/>
${QIN}<rect class="qdlt" x="40" y="18" width="120" height="158" fill="url(#d-lt)"/><rect x="40" y="18" width="120" height="158" fill="url(#d-vg)"/></g>
<g class="qgap"><rect x="40" y="40" width="120" height="24" fill="url(#d-lt)" opacity=".55"/><path class="qwire" d="${Array.from({length: 19}, (_, i) => `M${46 + i * 6} 50 V56.6`).join(' ')}"/><rect class="qrl" x="45" y="56" width="110" height="1.4" rx=".7"/>
<rect class="qgl" x="54" y="51.6" width="8.8" height="1.2" rx=".6"/><rect class="qgl" x="66" y="51.6" width="8.8" height="1.2" rx=".6"/><path class="qcup" d="M92 60 v-6 a2 2 0 0 1 2 -2 h6 a2 2 0 0 1 2 2 v6 Z"/><path class="qcup c2" d="M106 60 v-6 a2 2 0 0 1 2 -2 h6 a2 2 0 0 1 2 2 v6 Z"/><rect class="qgl" x="132" y="51.6" width="8.8" height="1.2" rx=".6"/></g>
<g class="qfront"><path class="s-body" fill-rule="evenodd" fill="url(#d-bd)" d="${QDOOR}"/><path class="s-sheen" fill-rule="evenodd" fill="url(#d-sh)" d="${QDOOR}"/><path fill-rule="evenodd" fill="url(#d-bb)" d="${QDOOR}"/>
<rect class="s-part" x="66" y="46" width="4" height="5" rx="1" fill="url(#d-pt)"/><rect class="s-part" x="130" y="46" width="4" height="5" rx="1" fill="url(#d-pt)"/>
<rect class="qhdl" x="62" y="48" width="76" height="3.4" rx="1.7" fill="url(#d-cr)"/><rect class="qhdh" x="64" y="48.4" width="72" height=".8" rx=".4"/>
<rect class="qwin" x="44.6" y="62.6" width="110.8" height="102.8" rx="5"/>
<rect class="qtint" x="46" y="64" width="108" height="100" rx="4"/>
<g clip-path="url(#d-wc)"><rect class="qmist" x="46" y="64" width="108" height="100"/><g class="qfog">${QFOG}</g>
<path class="s-refl" d="M60 64 h26 l-40 70 v-38 z"/><path class="s-refl" d="M98 64 h7 l-59 100 v-12 z"/>
<g transform="rotate(18 100 114)"><rect class="s-gls" x="20" y="40" width="18" height="150" fill="url(#d-gs)"/></g></g>
<rect class="s-glass" x="46" y="64" width="108" height="100" rx="4" fill="url(#d-gl)"/></g>
<g class="qtilt"><path class="qtop" d="M32.6 61.2 H167.4 L169 64 H31 Z"/><path class="s-body" fill-rule="evenodd" fill="url(#d-bd)" d="${QTILT}"/><path class="s-sheen" fill-rule="evenodd" fill="url(#d-sh)" d="${QTILT}"/><path fill-rule="evenodd" fill="url(#d-bb)" d="${QTILT}"/>
<rect class="s-part" x="65.6" y="67" width="4" height="4.2" rx="1" fill="url(#d-pt)"/><rect class="s-part" x="130.4" y="67" width="4" height="4.2" rx="1" fill="url(#d-pt)"/>
<rect class="qhdl" x="61.4" y="68.6" width="77.2" height="3" rx="1.5" fill="url(#d-cr)"/><rect class="qhdh" x="63.4" y="69" width="73.2" height=".7" rx=".35"/>
<path class="qwin" d="M42.6 82.6 H157.4 L155.4 167.4 H44.6 Z"/><path class="qtint" d="M44 84 H156 L154 166 H46 Z"/>
<g clip-path="url(#d-tw)"><path class="s-refl" d="M58 84 h26 l-38 62 v-34 z"/><path class="s-refl" d="M96 84 h7 l-57 82 v-11 z"/></g>
<path class="s-glass" d="M44 84 H156 L154 166 H46 Z" fill="url(#d-gl)"/></g>
<g class="qsteam" filter="url(#d-bl)"><ellipse cx="44" cy="60" rx="7" ry="3.6" style="--sx:-18px;--sy:-16px"/><ellipse cx="100" cy="61" rx="9" ry="3.4" style="--sx:4px;--sy:-9px;animation-delay:.9s"/><ellipse cx="156" cy="60" rx="7" ry="3.6" style="--sx:18px;--sy:-16px;animation-delay:1.8s"/></g>
<g class="qpanel"><path class="qpan" d="M43 14 H157 a9 9 0 0 1 9 9 V40 H34 V23 a9 9 0 0 1 9 -9 Z" fill="url(#d-pn)"/><rect class="s-edge" x="40" y="15" width="120" height="1.2" rx=".6"/>
<rect class="qsep" x="34" y="40" width="132" height=".8"/><rect class="qsh" x="34" y="40.8" width="132" height=".6"/>
<circle class="qpw" cx="44" cy="25" r="2.2"/><path class="qpwl" d="M44 21.8 v2.4"/>
${[52, 59, 66, 73].map((x, i) => `<rect class="qlbl" x="${x}" y="24.2" width="${i % 2 ? 4 : 5}" height="1.2" rx=".6"/><rect class="qsel${i === 0 ? ' on' : ''}" x="${x - .5}" y="31" width="6" height="1.1" rx=".55"/>`).join('')}
${[124, 131, 138, 145].map((x, i) => `<rect class="qlbl" x="${x}" y="24.2" width="${i % 2 ? 5 : 4}" height="1.2" rx=".6"/><rect class="qsel" x="${x - .5}" y="31" width="6" height="1.1" rx=".55"/>`).join('')}
<circle class="led" cx="157" cy="25" r="1.4"/>
<rect class="s-part" x="80" y="16.5" width="40" height="28" rx="2.5" fill="url(#d-pt)"/><rect class="s-scr" x="83.5" y="19.5" width="33" height="13" rx="1.6"/>
<text class="wdt" x="102.6" y="29.2"></text><g class="lk"><rect x="86.2" y="25.2" width="4.2" height="3.4" rx=".7"/><path d="M87.2 25.2 v-1 a1.1 1.1 0 0 1 2.2 0 v1"/></g>
<path class="s-tgl" d="M85 20 h8 l-4 12 h-5 z"/><g class="qtb"><rect x="85" y="36.5" width="6" height="1.6" rx=".8"/><rect x="94" y="36.5" width="6" height="1.6" rx=".8"/><rect x="103" y="36.5" width="6" height="1.6" rx=".8"/><rect x="112" y="36.5" width="4" height="1.6" rx=".8"/></g></g>
${doneAt(170, 189)}${WARN}</svg>`,
  // Airfryer im Nova-Zeichenstil (Vorbild Philips Essential): nach unten breiter werdendes Gehäuse, oben Touchfeld mit rundem
  // Display (Restzeit-Ring wie eine Eieruhr, Haken bei fertig), Fuge, Schublade mit Rauchglas-Fenster (Heizspirale, Korb,
  // Pommes) und senkrechtem Griff
  airfryer: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${sceneDefs('a')}
<radialGradient id="a-vg" cx=".5" cy=".4" r=".8"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
<radialGradient id="a-lt" cx=".5" cy="0" r="1"><stop offset="0" class="a-lc" stop-opacity=".7"/><stop offset="1" class="a-lc" stop-opacity="0"/></radialGradient>
<filter id="a-bl" x="-60%" y="-120%" width="220%" height="340%"><feGaussianBlur stdDeviation="2.4"/></filter>
<filter id="a-hb" x="-100%" y="-40%" width="300%" height="180%"><feGaussianBlur stdDeviation="1.3"/></filter>
<filter id="a-cb" x="-20%" y="-300%" width="140%" height="700%"><feGaussianBlur stdDeviation="1.6"/></filter>
<clipPath id="a-wc"><rect x="64" y="99" width="72" height="32" rx="6"/></clipPath><clipPath id="a-pc"><rect x="68" y="32" width="64" height="44" rx="5"/></clipPath><clipPath id="a-bc"><path d="${ABODY}"/></clipPath>
<linearGradient id="a-gb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".09"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<g class="ahz" filter="url(#a-hb)"><path d="M84 19 c-3 -4 3 -7 0 -11 c-2 -3 1 -5 0 -8"/><path d="M100 19 c3 -4 -3 -7 0 -11 c2 -3 -1 -5 0 -8"/><path d="M116 19 c-3 -4 3 -7 0 -11 c-2 -3 1 -5 0 -8"/></g>
<g class="afb"><ellipse class="s-shd" cx="100" cy="177" rx="66" ry="4.5"/><rect class="aft" x="52" y="171" width="14" height="5" rx="1.5"/><rect class="aft" x="134" y="171" width="14" height="5" rx="1.5"/>
<path class="s-body" d="${ABODY}" fill="url(#a-bd)"/><path class="s-sheen" d="${ABODY}" fill="url(#a-sh)"/>
<g clip-path="url(#a-bc)"><rect class="agb" x="52" y="20" width="14" height="152" fill="url(#a-gb)" transform="skewX(-4)"/><path class="s-refl" d="M118 20 h12 l-34 72 h-12 z"/><path class="s-refl" d="M136 20 h5 l-34 72 h-5 z"/></g>
<rect class="s-edge" x="58" y="21" width="84" height="1.2" rx=".6"/><rect class="abase" x="40" y="162" width="120" height=".8"/><rect class="ahl" x="41" y="162.8" width="118" height=".6"/>
<rect class="apn" x="68" y="32" width="64" height="44" rx="5"/><rect x="68" y="32" width="64" height="44" rx="5" fill="url(#a-gl)"/>
<g class="atc"><path d="M76.6 42.2 a3.2 3.2 0 1 0 2.8 0 M78 40.6 v3"/><path d="M75 64 h6"/><path d="M119 64 h6 M122 61 v6"/><path d="M122 40.4 v4.6 M120.7 45.6 a1.8 1.8 0 1 0 2.6 0"/></g>
<circle class="adr" cx="100" cy="54" r="15"/><circle class="kr" cx="100" cy="54" r="11.5"/><circle class="kp" cx="100" cy="54" r="11.5" pathLength="100" transform="rotate(-90 100 54)"/>
<text class="kt" x="100" y="57.4"></text><path class="akc" d="M94.6 54.4 l3.6 3.6 l7 -7.4"/>
<g clip-path="url(#a-pc)"><path class="s-tgl" d="M70 32 h30 l-14 44 h-16 z"/><path class="s-refl" d="M106 32 h6 l-14 44 h-6 z"/><rect class="apnh" x="70" y="32.6" width="60" height=".7" rx=".35"/></g>
<rect class="psep" x="${AX(92) + .5}" y="91.6" width="${200 - 2 * AX(92) - 1}" height=".8"/>
<path class="aop" d="${ADRW}"/><path class="aol" d="${ADRW}" fill="url(#a-lt)"/>
<rect class="asg" x="${AX(92) + 4}" y="91" width="${200 - 2 * AX(92) - 8}" height="2" rx="1"/></g>
<g class="drw"><ellipse class="adsh" cx="100" cy="167" rx="58" ry="3.4"/>
<path class="s-body" d="${ADRW}" fill="url(#a-bd)"/><path class="s-sheen" d="${ADRW}" fill="url(#a-sh)"/>
<rect class="ade" x="${AX(93) + 3}" y="93.6" width="${200 - 2 * AX(93) - 6}" height=".8" rx=".4"/>
<g class="awin"><rect class="awf" x="61.6" y="96.6" width="76.8" height="36.8" rx="8"/>
<g clip-path="url(#a-wc)"><rect x="64" y="99" width="72" height="32" fill="url(#a-in)"/><rect class="aglo" x="64" y="99" width="72" height="32" fill="url(#a-lt)"/>
<path class="acl" d="${ACOIL}"/><path class="acg" filter="url(#a-cb)" d="${ACOIL}"/>
<rect class="abr" x="65" y="114" width="70" height="1.6" rx=".8"/><path class="amsh" d="${Array.from({length: 17}, (_, i) => `M${68 + i * 4} 116 V131`).join(' ')}"/>
<g class="fr"><line x1="70" y1="129" x2="79" y2="122"/><line x1="81" y1="130" x2="92" y2="124"/><line x1="96" y1="128.5" x2="103" y2="120.5"/><line x1="107" y1="130" x2="119" y2="125"/><line x1="121" y1="129" x2="129" y2="122.5"/><line x1="86" y1="123" x2="95" y2="118.5"/></g>
<rect x="64" y="99" width="72" height="32" fill="url(#a-vg)"/>
<path class="s-refl" d="M74 99 h16 l-22 32 h-5 v-12 z"/><path class="s-refl" d="M98 99 h5 l-22 32 h-5 z"/>
<g transform="rotate(18 100 115)"><rect class="s-gls" x="44" y="80" width="16" height="70" fill="url(#a-gs)"/></g></g>
<rect class="s-glass" x="64" y="99" width="72" height="32" rx="6" fill="url(#a-gl)"/></g>
<rect class="ahr" x="92.5" y="140" width="17" height="22" rx="6"/><rect class="s-part" x="91" y="138" width="18" height="22" rx="6" fill="url(#a-pt)"/><rect class="ahh" x="92.6" y="140" width="1.2" height="18" rx=".6"/></g>
<g class="apuff" filter="url(#a-bl)"><ellipse cx="72" cy="94" rx="8" ry="3.6" style="--sx:-10px;--sy:-22px"/><ellipse cx="100" cy="92" rx="10" ry="3.8" style="--sx:2px;--sy:-26px;animation-delay:.25s"/><ellipse cx="128" cy="94" rx="8" ry="3.6" style="--sx:10px;--sy:-22px;animation-delay:.5s"/></g>
${doneAt(162, 172)}${WARN}</svg>`,
  // Kaffeevollautomat im Nova-Zeichenstil: oben Bohnenbehälter-Deckel, Bedienfeld mit Display und Status-LED, Nische mit
  // Chrom-Auslauf, Glastasse (bei Latte Macchiato hohes Glas) auf der Tropfschale, Wassertank aus Glas seitlich rechts
  coffee: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${sceneDefs('c')}
<radialGradient id="c-lt" cx=".5" cy="0" r="1"><stop offset="0" class="c-lc" stop-opacity=".55"/><stop offset="1" class="c-lc" stop-opacity="0"/></radialGradient>
<radialGradient id="c-vg" cx=".5" cy=".4" r=".8"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
<linearGradient id="c-wa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="c-lc" stop-opacity=".55"/><stop offset="1" class="c-lc" stop-opacity=".28"/></linearGradient>
<linearGradient id="c-lm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="c-f"/><stop offset=".18" class="c-f"/><stop offset=".26" class="c-c"/><stop offset=".4" class="c-c"/><stop offset=".56" class="c-m"/><stop offset="1" class="c-m"/></linearGradient>
<filter id="c-bl" x="-100%" y="-40%" width="300%" height="180%"><feGaussianBlur stdDeviation="1.2"/></filter>
<clipPath id="c-cc"><path d="M78.5 124 h31 v25 a8.5 8.5 0 0 1 -8.5 8.5 h-14 a8.5 8.5 0 0 1 -8.5 -8.5 Z"/></clipPath>
<clipPath id="c-gc"><path d="M85 97 h22 l-1.5 57.5 a3 3 0 0 1 -3 3 h-13 a3 3 0 0 1 -3 -3 Z"/></clipPath>
<clipPath id="c-tc"><rect x="151" y="44" width="16" height="131" rx="3"/></clipPath><clipPath id="c-nc"><path d="M58 76 q0 -8 8 -8 h56 q8 0 8 8 V178 H58 Z"/></clipPath></defs>
<ellipse class="s-shd" cx="102" cy="193" rx="70" ry="4.5"/><rect class="cft" x="46" y="186" width="14" height="5" rx="1.5"/><rect class="cft" x="128" y="186" width="14" height="5" rx="1.5"/>
<rect class="s-part" x="149" y="36" width="20" height="9" rx="3" fill="url(#c-pt)"/>
<g clip-path="url(#c-tc)"><rect x="151" y="44" width="16" height="131" fill="url(#c-in)"/><g class="ctw"><rect x="151" y="84" width="16" height="96" fill="url(#c-wa)"/><rect class="ctws" x="151" y="84" width="16" height="1"/></g>
<path class="s-refl" d="M152.5 44 h3 v131 h-3 z"/><g transform="rotate(12 159 110)"><rect class="s-gls" x="128" y="30" width="10" height="160" fill="url(#c-gs)"/></g></g>
<rect class="tk s-glass" x="151" y="44" width="16" height="131" rx="3" fill="url(#c-gl)"/><path class="ctm" d="M163 70 h2.6 M163 100 h2.6 M163 130 h2.6 M163 160 h2.6"/>
<rect class="s-part" x="149" y="173" width="20" height="7" rx="2.5" fill="url(#c-pt)"/>
<path class="bn s-part" d="M50 23 v-5 a5 5 0 0 1 5 -5 h40 a5 5 0 0 1 5 5 v5 Z" fill="url(#c-pt)"/><rect class="cbh" x="54" y="14" width="42" height=".8" rx=".4"/>
<rect class="s-body" x="36" y="22" width="114" height="166" rx="10" fill="url(#c-bd)"/><rect class="s-sheen" x="36" y="22" width="114" height="166" rx="10" fill="url(#c-sh)"/>
<rect class="s-edge" x="42" y="23" width="102" height="1.2" rx=".6"/>
<rect class="s-part" x="46" y="31" width="96" height="28" rx="4" fill="url(#c-pt)"/><rect class="s-scr cscr" x="50" y="35" width="68" height="16" rx="2"/>
<text class="ctx" x="84" y="46"></text><path class="s-tgl" d="M52 35.5 h12 l-5 15 h-7 z"/>
<g class="ctb"><rect x="52" y="54" width="7" height="1.8" rx=".9"/><rect x="62" y="54" width="7" height="1.8" rx=".9"/><rect x="72" y="54" width="7" height="1.8" rx=".9"/><rect x="82" y="54" width="7" height="1.8" rx=".9"/></g>
<circle class="led" cx="130" cy="40" r="1.8"/><path class="dp" d="M130 45.6 c1.6 2.4 2.4 3.6 2.4 4.8 a2.4 2.4 0 0 1 -4.8 0 c0 -1.2 .8 -2.4 2.4 -4.8 Z"/>
<path d="M58 76 q0 -8 8 -8 h56 q8 0 8 8 V178 H58 Z" fill="url(#c-in)"/><g clip-path="url(#c-nc)"><rect class="cnl" x="58" y="68" width="72" height="70" fill="url(#c-lt)"/><rect x="58" y="68" width="72" height="110" fill="url(#c-vg)"/></g>
<path class="cnr" d="M58 76 q0 -8 8 -8 h56 q8 0 8 8 V178 H58 Z"/>
<rect class="cspb" x="78" y="64" width="32" height="14" rx="3.5" fill="url(#c-cr)"/><rect class="csph" x="81" y="65" width="26" height=".8" rx=".4"/>
<rect class="cnz" x="85" y="77" width="6" height="5" rx="1.6" fill="url(#c-cr)"/><rect class="cnz" x="97" y="77" width="6" height="5" rx="1.6" fill="url(#c-cr)"/>
<rect class="s-part" x="56" y="160" width="76" height="20" rx="3.5" fill="url(#c-pt)"/><rect class="cgr" x="58" y="157.6" width="72" height="3.4" rx="1.2" fill="url(#c-cr)"/>
<path class="cgs" d="M61 159.3 h66"/><rect class="cth" x="60" y="163.4" width="68" height=".7"/><rect class="ctf" x="88" y="171" width="12" height="3" rx="1.5"/>
<g class="flow"><line x1="88" y1="82" x2="88" y2="157"/><line x1="100" y1="82" x2="100" y2="157"/></g>
<g class="ccup"><g clip-path="url(#c-cc)"><g class="cfl"><rect class="cfc" x="76" y="124" width="36" height="36"/><rect class="cfr" x="76" y="124" width="36" height="2.2"/><rect class="cff" x="76" y="124" width="36" height="9"/></g></g>
<path class="s-glass" d="M76 124 h36 v26 a10 10 0 0 1 -10 10 h-16 a10 10 0 0 1 -10 -10 Z" fill="url(#c-gl)"/><path class="chd" d="M112 130 h3 a6.5 6.5 0 0 1 0 13 h-3.4"/>
<path class="s-refl" d="M79 126 h4 v23 h-4 z"/><ellipse class="crim" cx="94" cy="124" rx="18" ry="1.5"/></g>
<g class="cgls"><g clip-path="url(#c-gc)"><g class="cfl g"><rect x="83" y="97" width="26" height="61" fill="url(#c-lm)"/><rect class="cff" x="83" y="97" width="26" height="11"/></g></g>
<path class="s-glass" d="M83 96 h26 l-1.6 60 a4 4 0 0 1 -4 4 h-14.8 a4 4 0 0 1 -4 -4 Z" fill="url(#c-gl)"/><path class="s-refl" d="M86 98 h3 l-1 56 h-3 z"/><ellipse class="crim" cx="96" cy="96" rx="13" ry="1.2"/></g>
<g class="csteam" filter="url(#c-bl)"><path d="M87 120 c-3 -5 3 -8 0 -13 c-2 -3 1 -6 0 -9"/><path d="M95 120 c3 -5 -3 -8 0 -13 c2 -3 -1 -6 0 -9"/><path d="M103 120 c-3 -5 3 -8 0 -13 c-2 -3 1 -6 0 -9"/></g>
${doneAt(150, 188)}${WARN}</svg>`,
  // Futterautomat im Nova-Zeichenstil: Säule mit Deckel, Sichtfenster mit Trockenfutter (Füllstand), Status-LED, Ausgabeschacht
  // mit Chromlippe, davor ein Edelstahlnapf
  feeder: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${sceneDefs('f')}

<linearGradient id="f-ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".2" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>
<radialGradient id="f-vg" cx=".5" cy=".4" r=".8"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>
<radialGradient id="f-lt" cx=".5" cy="0" r="1"><stop offset="0" class="f-lc" stop-opacity=".8"/><stop offset="1" class="f-lc" stop-opacity="0"/></radialGradient>
<clipPath id="f-wc"><rect x="66" y="40" width="68" height="74" rx="8"/></clipPath><clipPath id="f-bc"><path d="M61 172 a39 5.2 0 0 0 78 0 V150 H61 Z"/></clipPath></defs>
<ellipse class="s-shd" cx="100" cy="193" rx="66" ry="4.5"/><rect class="fft" x="62" y="176" width="12" height="4" rx="1.5"/><rect class="fft" x="126" y="176" width="12" height="4" rx="1.5"/>
<rect class="s-body" x="54" y="24" width="92" height="154" rx="14" fill="url(#f-bd)"/><rect class="s-sheen" x="54" y="24" width="92" height="154" rx="14" fill="url(#f-sh)"/>
<path class="s-part" d="M50 32 v-6 q0 -12 14 -12 h72 q14 0 14 12 v6 Z" fill="url(#f-pt)"/><rect class="s-edge" x="62" y="15" width="76" height="1.2" rx=".6"/><rect class="fsep" x="50" y="31.6" width="100" height=".8"/>
<rect class="fwf" x="63.6" y="37.6" width="72.8" height="78.8" rx="10"/>
<g clip-path="url(#f-wc)"><rect x="66" y="40" width="68" height="74" fill="url(#f-in)"/>
<g class="fpl"><path class="fk0" d="M64 58 q9 -3 18 0 t18 0 t18 0 t18 0 V126 H64 Z"/>${KIB_BIN}</g>
<rect x="66" y="40" width="68" height="74" fill="url(#f-vg)"/><path class="s-refl" d="M76 40 h16 l-26 50 v-24 z"/><path class="s-refl" d="M102 40 h5 l-41 74 v-10 z"/>
<g transform="rotate(18 100 77)"><rect class="s-gls" x="40" y="20" width="14" height="120" fill="url(#f-gs)"/></g></g>
<rect class="s-glass" x="66" y="40" width="68" height="74" rx="8" fill="url(#f-gl)"/><path class="fmk" d="M128 52 h3.6 M128 70 h3.6 M128 88 h3.6 M128 104 h3.6"/>
<circle class="fring" cx="100" cy="128" r="5.4"/><circle class="led fled" cx="100" cy="128" r="2.4"/>
<rect class="ftb" x="76" y="127" width="10" height="2" rx="1"/><rect class="ftb" x="114" y="127" width="10" height="2" rx="1"/>
<path class="fch" d="M84 142 q0 -4 4 -4 h24 q4 0 4 4 v14 h-32 Z"/><rect class="fchl" x="86" y="139" width="28" height="16" fill="url(#f-lt)"/>
<g class="fdrop">${[[97, 1, 0], [102.4, 2, .3], [99.2, 3, .55], [103.6, 1, .8], [96, 2, 1.05]].map(([x, k, d]) => `<ellipse class="fk${k}" cx="${x}" cy="160" rx="1.9" ry="1.7" style="animation-delay:${d}s"/>`).join('')}</g>
<rect class="flip" x="80" y="155" width="40" height="4.4" rx="2" fill="url(#f-cr)"/>
<path class="fbo" d="M58 172 L65 186 Q66.5 189 70 189 H130 Q133.5 189 135 186 L142 172 Z" fill="url(#f-cr)"/><ellipse class="fbi" cx="100" cy="172" rx="39.4" ry="5.4"/>
<g clip-path="url(#f-bc)"><g class="fbw"><path class="fk0" d="M66 177 q6 -12 22 -14 q12 -1.4 24 0 q16 2 22 14 Z"/>${KIB_BOWL}</g></g>
<ellipse class="fbr" cx="100" cy="172" rx="42" ry="6.5"/><path class="fbh" d="M64.5 178 l3.6 7.4"/>
${doneAt(146, 189)}${WARN}</svg>`,
  // Trinkbrunnen im Nova-Zeichenstil (Vorbild Petkit Eversweet): flacher runder Zylinder, oben breite Trinkschale mit kleinem
  // Sprudel in der Mitte, vorne Sichtfenster für den Wasserstand (MAX/MIN), Sockel mit Status-LED und kleinem Filter-Symbol
  fountain: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${sceneDefs('b')}
<linearGradient id="b-wa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="b-wc" stop-opacity=".85"/><stop offset="1" class="b-wc" stop-opacity=".5"/></linearGradient>
<radialGradient id="b-ds" cx=".5" cy=".45" r=".55"><stop offset="0" class="b-wc" stop-opacity=".7"/><stop offset=".7" class="b-wc" stop-opacity=".38"/><stop offset="1" class="b-wc" stop-opacity=".2"/></radialGradient>
<linearGradient id="b-cy" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".22" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
<filter id="b-bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".6"/></filter>
<clipPath id="b-dc"><ellipse cx="100" cy="75" rx="51" ry="8"/></clipPath><clipPath id="b-wc"><rect x="95.5" y="100" width="9" height="42" rx="4.5"/></clipPath></defs>
<ellipse class="s-shd" cx="100" cy="190" rx="72" ry="5"/><rect class="bft" x="56" y="181" width="14" height="5" rx="2"/><rect class="bft" x="130" y="181" width="14" height="5" rx="2"/>
<path class="s-body" d="M34 72 V172 a66 11 0 0 0 132 0 V72 Z" fill="url(#b-bd)"/><path d="M34 72 V172 a66 11 0 0 0 132 0 V72 Z" fill="url(#b-cy)"/>
<path class="s-part" d="M34 160 a66 11 0 0 0 132 0 V172 a66 11 0 0 1 -132 0 Z" fill="url(#b-pt)"/><path class="bsep" d="M34 160 a66 11 0 0 0 132 0"/><path class="bsh" d="M35 161.4 a65 11 0 0 0 130 0"/>
<rect class="bwf" x="93.6" y="98" width="12.8" height="46" rx="6.4"/>
<g clip-path="url(#b-wc)"><rect x="95.5" y="100" width="9" height="42" fill="url(#b-in)"/><g class="bwl"><rect x="95.5" y="100" width="9" height="44" fill="url(#b-wa)"/><rect class="bws" x="95.5" y="100" width="9" height=".9"/></g>
<rect class="s-refl" x="96.4" y="100" width="2" height="42"/><g transform="rotate(14 100 127)"><rect class="s-gls" x="70" y="88" width="8" height="80" fill="url(#b-gs)"/></g></g>
<rect class="s-glass" x="95.5" y="100" width="9" height="42" rx="4.5" fill="url(#b-gl)"/><path class="bmk" d="M106.8 104 h2.4 M106.8 138 h2.4"/>
<ellipse class="btop" cx="100" cy="72" rx="66" ry="12" fill="url(#b-pt)"/><path class="s-edge" d="M44 66 a62 9 0 0 1 112 0 a62 10.4 0 0 0 -112 0 Z"/>
<ellipse class="brec" cx="100" cy="74" rx="57" ry="9.6"/><ellipse class="bdish" cx="100" cy="75" rx="51" ry="8" fill="url(#b-ds)"/>
<g clip-path="url(#b-dc)"><g class="brip"><ellipse cx="100" cy="75" rx="9" ry="1.4"/><ellipse cx="100" cy="75" rx="9" ry="1.4" style="animation-delay:1.1s"/><ellipse cx="100" cy="75" rx="9" ry="1.4" style="animation-delay:2.2s"/></g>
<path class="s-refl" d="M62 70 q20 -3 34 -2 l-6 4 q-14 0 -28 3 z"/></g>
<ellipse class="bflow" cx="100" cy="75" rx="51" ry="8"/><ellipse class="bdr" cx="100" cy="74" rx="57" ry="9.6"/>
<rect class="s-part" x="146" y="64.6" width="9" height="3.4" rx="1.2" fill="url(#b-pt)"/>
<ellipse class="bnz" cx="100" cy="75" rx="5" ry="1.8" fill="url(#b-cr)"/><path class="bdome" d="M95 75 q5 -6 10 0 Z"/><g class="bjet"><path d="M98.4 74 Q99.2 62 99.5 55 h1 Q100.8 62 101.6 74 Z"/><ellipse cx="100" cy="55" rx="2.2" ry="1.3"/></g><path class="bdhl" d="M99.4 72 q.2 -8 .5 -14"/>
<g class="bdrop">${[[-9, 18, 0], [8, 18, .3], [-5, 19, .6], [11, 17, .9], [-12, 17, 1.2], [4, 19, 1.5]].map(([dx, dy, d]) => `<circle cx="100" cy="55.5" r="${dx % 2 ? .8 : 1}" style="--dx:${dx}px;--dy:${dy}px;animation-delay:${d}s"/>`).join('')}</g>
<g class="bfi"><rect x="98.3" y="148.4" width="3.4" height="1.4" rx=".5"/><rect x="97.2" y="149.8" width="5.6" height="7.6" rx="1.4"/><path d="M97.2 152.3 h5.6 M97.2 154.9 h5.6"/></g><circle class="led" cx="100" cy="163.6" r="1.5"/>
${WARN}</svg>`,
  generic: `<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="pulse" cx="50" cy="50" r="30"/><circle class="bd" cx="50" cy="50" r="26"/>
<path class="pw" d="M41 40 a14 14 0 1 0 18 0"/><line class="pw" x1="50" y1="33" x2="50" y2="48"/>${DONE}<g transform="scale(.5)">${WARN}</g></svg>`,
};
const scene = t => `<div class="scene">${SV[t]}</div>`;

const DCSS = `
.g.dv{--dc:var(--nv-a1);--dc-fg:var(--nv-a1-fg);--fc:var(--nova-filter-color,var(--nv-a2))}
${frameGlow('.g.dv.glow.st-run,.g.dv.glow.st-heat')}
.g.dv.glow.t-feeder.st-ready{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--dc) 25%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.g.dv.glow.t-feeder.st-run{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--dc) 65%,transparent),0 0 22px color-mix(in srgb,var(--dc) 35%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
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
.dv .al[data-e]{cursor:pointer}.dv .al .alr{margin-left:auto;flex:none;padding:5px 12px;border-radius:12px;background:rgba(255,255,255,.16);font-weight:600;cursor:pointer}.dv .al .alr:active{transform:scale(.95)}
.pk .hb.dis{opacity:.35;pointer-events:none}.dv .al.hit{background:color-mix(in srgb,var(--c) 32%,transparent);font-weight:600}
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
.scene .heat path{fill:none;stroke:var(--dc);stroke-width:1.6;stroke-linecap:round;opacity:0}
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
.scene .kd{fill:rgba(0,0,0,.3);stroke:currentColor;stroke-opacity:.18;stroke-width:1}
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
/* Airfryer im Nova-Zeichenstil (Maßstab 3D-Drucker, Grundteile aus shared/scene.js) */
.w-airfryer{--gx:90px}
.w-airfryer .aft{fill:#0d1016}
.w-airfryer .ahl,.w-airfryer .ade{fill:#fff;opacity:.12}.w-airfryer .abase{fill:#000;opacity:.35}
.w-airfryer .apn{fill:#05070a;stroke:rgba(255,255,255,.14);stroke-width:.5}.w-airfryer .albl{fill:#fff;opacity:.16}
.w-airfryer .adr{fill:${PAL.screen};stroke:rgba(255,255,255,.18);stroke-width:.6}
.w-airfryer .kr{stroke:#fff;stroke-opacity:.1;stroke-width:1.8}.w-airfryer .kp{stroke-width:1.8}
.w-airfryer .kt{fill:#fff;font:600 8px Roboto,system-ui,sans-serif}
.w-airfryer .akc{fill:none;stroke:var(--dc);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:16;opacity:0}
.w-airfryer .atc path{fill:none;stroke:#fff;stroke-opacity:.12;stroke-width:1;stroke-linecap:round;transition:stroke .6s,stroke-opacity .6s}
.w-airfryer .apnh{fill:#fff;opacity:.14}.w-airfryer .agb{opacity:1}
.st-run .w-airfryer .atc path,.st-heat .w-airfryer .atc path,.st-warm .w-airfryer .atc path,.st-pause .w-airfryer .atc path,.st-prep .w-airfryer .atc path{stroke:var(--dc);stroke-opacity:.75;filter:drop-shadow(0 0 1.5px var(--dc))}
.st-ready .w-airfryer .atc path,.st-done .w-airfryer .atc path{stroke-opacity:.3}
.st-off .w-airfryer .atc path{stroke-opacity:.06}
.w-airfryer .psep{fill:#000;opacity:.3}.w-airfryer .psh{fill:#fff;opacity:.06}
.w-airfryer .aop{fill:#07090d}.w-airfryer .aol{opacity:0;transition:opacity .6s}.w-airfryer .a-lc{stop-color:var(--hc)}
.w-airfryer .asg{fill:var(--hc);opacity:0;filter:blur(1px);transition:opacity .6s}
.w-airfryer .drw,.w-airfryer .afb{transform-box:view-box;transform-origin:0 0;transition:transform .8s cubic-bezier(.3,.7,.3,1)}
.w-airfryer .adsh{fill:#000;opacity:0;transition:opacity .6s}
.w-airfryer .awf{fill:#0b0e13;stroke:rgba(255,255,255,.08);stroke-width:.5}
.w-airfryer .aglo{opacity:0;transition:opacity .6s}
.w-airfryer .acl{fill:none;stroke:#3a404c;stroke-width:1.4;stroke-linecap:round}
.w-airfryer .acg{fill:none;stroke:var(--hc);stroke-width:2.4;stroke-linecap:round;opacity:0;transition:opacity .8s}
.w-airfryer .abr{fill:#fff;opacity:.14}.w-airfryer .amsh{fill:none;stroke:#000;stroke-opacity:.3;stroke-width:.5}
.w-airfryer .fr line{stroke:color-mix(in srgb,var(--hc) var(--pp,0%),currentColor);stroke-width:3.4;stroke-opacity:calc(.55 + var(--pf,0) * .4)}
.w-airfryer .ahr{fill:#000;opacity:.35}.w-airfryer .ahh{fill:#fff;opacity:.16}
.w-airfryer .ahz path{fill:none;stroke:#d7dfec;stroke-width:2.2;stroke-linecap:round;opacity:0;transform-box:fill-box;transform-origin:center bottom}
.w-airfryer .apuff ellipse{fill:#c9d4e3;opacity:0;transform-box:fill-box;transform-origin:center}
/* Gart/heizt/hält warm: Heizspirale glüht in der Kartenfarbe, Fenster leicht beleuchtet, Hitzefahnen aus dem Luftauslass */
.st-run .w-airfryer .acg{opacity:.9}.st-run .w-airfryer .acl{stroke:color-mix(in srgb,var(--hc) 70%,#3a404c)}
.st-heat .w-airfryer .acg{opacity:.6}.st-warm .w-airfryer .acg{opacity:.3}.st-pause .w-airfryer .acg{opacity:.15}
.st-run .w-airfryer .aglo{opacity:.4}.st-heat .w-airfryer .aglo{opacity:.22}.st-warm .w-airfryer .aglo{opacity:.16}.st-pause .w-airfryer .aglo{opacity:.12}
.st-run .w-airfryer .asg{opacity:.65}.nowin.st-heat .w-airfryer .asg,.nowin.st-warm .w-airfryer .asg{opacity:.3}
.anim.st-run .w-airfryer .acg{animation:dv-coil 3.2s ease-in-out infinite}
.anim.st-run .w-airfryer .aglo{animation:dv-wglo 3.2s ease-in-out infinite}
.anim.st-heat .w-airfryer .acg{animation:dv-coil 2.6s ease-in-out infinite}
.anim.st-run .w-airfryer .ahz path{animation:dv-hz 3.6s ease-out infinite}
.anim.st-run .w-airfryer .ahz path:nth-child(2){animation-delay:1.2s}.anim.st-run .w-airfryer .ahz path:nth-child(3){animation-delay:2.4s}
.anim.st-run.last .w-airfryer .acg,.anim.st-run.last .w-airfryer .kp{animation:dv-glo .8s ease-in-out infinite}
.nowin .w-airfryer .awin{display:none}
.st-heat .w-airfryer .kr{stroke:var(--dc);stroke-opacity:.8}
.anim.st-heat .w-airfryer .kr{animation:dv-stk 2.6s ease-in-out infinite}
.anim.st-prep .scene .kx,.anim.st-prep .w-airfryer .kt,.anim.st-pause .w-airfryer .kp,.anim.st-pause .w-airfryer .kt{animation:dv-blinko 1.4s ease-in-out infinite}
/* Fertig: Schublade gleitet ein Stück nach vorne und bleibt dort, Haken im Display, beim Wechsel ein Dampfstoß aus dem Korb */
.st-done .w-airfryer .drw{transform:translate(-6px,-1px) scale(1.06)}
.st-done .w-airfryer .adsh{opacity:.35}.st-done .w-airfryer .aol{opacity:.25}
.st-off .w-airfryer .kt,.st-off .w-airfryer .kp{display:none}
.st-done .w-airfryer .kt{display:none}.st-done .w-airfryer .akc{opacity:1}
.anim.st-done.fx .w-airfryer .akc{animation:dv-check .5s .3s ease-out both}
.anim.st-done.fx .w-airfryer .apuff ellipse{animation:dv-apuff 2.4s .5s ease-out 1 both}
/* Schublade offen (Sensor): herausgenommen und verkleinert neben dem Gerät, im Gehäuse bleibt die leere Öffnung */
.dopen .w-airfryer .afb{transform:translate(-8px,32px) scale(.8)}
.dopen .w-airfryer .drw{transform:translate(92px,74px) scale(.62)}
.dopen .w-airfryer .adsh{opacity:.4}.dopen .w-airfryer .apuff,.dopen .w-airfryer .ahz{display:none}
@media (prefers-reduced-motion:reduce){.w-airfryer .drw,.w-airfryer .afb{transition:none}}
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
.w-washer .pd{transform-box:view-box;transform-origin:54px 114px;transition:transform .6s ease}
.w-washer .scene .lk{stroke:#fff;stroke-opacity:.85;stroke-width:.7}.w-washer .scene .lk rect{fill:#fff}
.st-off .w-washer .wdt,.st-off .w-washer .pdots .on{display:none}
/* Spülmaschine im Nova-Zeichenstil (Maßstab 3D-Drucker, Grundteile aus shared/scene.js) */
.w-dishwasher{--gx:150px}
.w-dishwasher .qplin{fill:#0d1016}.w-dishwasher .qvent{fill:#000;opacity:.45}
.w-dishwasher .qrail{fill:none;stroke:#fff;stroke-opacity:.07;stroke-width:1.2}
.w-dishwasher .qgl{fill:${PAL.glass};fill-opacity:.1;stroke:#fff;stroke-opacity:.38;stroke-width:.5}
.w-dishwasher .qgh{fill:none;stroke:#fff;stroke-opacity:.42;stroke-width:.6;stroke-linecap:round}
.w-dishwasher .qcup{fill:#8f99ad;fill-opacity:.55;stroke:rgba(0,0,0,.35);stroke-width:.4}
.w-dishwasher .qcup.c2,.w-dishwasher .qpl.c2{fill:color-mix(in srgb,var(--dc) 55%,#c9d1de);fill-opacity:.5}
.w-dishwasher .qcuh{fill:none;stroke:#8f99ad;stroke-opacity:.55;stroke-width:1}
.w-dishwasher .qpl{fill:#c9d1de;fill-opacity:.42;stroke:#fff;stroke-opacity:.22;stroke-width:.4}
.w-dishwasher .qph{fill:none;stroke:#fff;stroke-opacity:.3;stroke-width:.5;stroke-linecap:round}
.w-dishwasher .qcut{fill:none;stroke:${PAL.chrome};stroke-width:1;stroke-linecap:round}
.w-dishwasher .qcuts{fill:${PAL.chrome}}.w-dishwasher .qcutf{fill:none;stroke:${PAL.chrome};stroke-width:.45;stroke-linecap:round}.w-dishwasher .qcutk{fill:${PAL.chromeMid}}
.w-dishwasher .qwire{fill:none;stroke:#fff;stroke-opacity:.2;stroke-width:.45}
.w-dishwasher .qrl{fill:${PAL.chromeMid}}.w-dishwasher .qrl.t{opacity:.7}.w-dishwasher .qrol{fill:#0b0e13;stroke:#fff;stroke-opacity:.18;stroke-width:.4}
.w-dishwasher .qarm{transform-box:view-box}.w-dishwasher .qnz{fill:#0b0e13}.w-dishwasher .qhub{stroke:rgba(0,0,0,.4);stroke-width:.4}
.w-dishwasher .qsmp{fill:#0b0e13;stroke:#fff;stroke-opacity:.12;stroke-width:.4}
.w-dishwasher .qjet circle{fill:var(--dc);opacity:0}
.w-dishwasher .qstm path{fill:none;stroke:#fff;stroke-opacity:.5;stroke-width:1.4;stroke-linecap:round;opacity:0}
.w-dishwasher .q-lc{stop-color:var(--dc)}.w-dishwasher .qdlt{opacity:0;transition:opacity .6s}
.w-dishwasher .qmist{fill:var(--dc);opacity:0;transition:opacity .6s}
.w-dishwasher .qfog circle{fill:#fff;opacity:0;transition:opacity 1.2s}
.w-dishwasher .qtint{fill:#05070b;opacity:.42;transition:opacity .6s}
.w-dishwasher .qwin{fill:none;stroke:#07090d;stroke-width:2.4}
.w-dishwasher .qpan{stroke:rgba(255,255,255,.1);stroke-width:.5}
.w-dishwasher .qsep{fill:#000;opacity:.3}.w-dishwasher .qsh{fill:#fff;opacity:.06}
.w-dishwasher .qlbl{fill:#fff;opacity:.2}.w-dishwasher .qsel{fill:#fff;opacity:.12}.w-dishwasher .qsel.on{fill:var(--dc);opacity:.9}
.w-dishwasher .qpw{fill:none;stroke:#fff;stroke-opacity:.25;stroke-width:.6}.w-dishwasher .qpwl{stroke:#fff;stroke-opacity:.25;stroke-width:.6;stroke-linecap:round}
.w-dishwasher .qtb rect{fill:#fff;opacity:.14}
.w-dishwasher .qhdl{stroke:rgba(0,0,0,.4);stroke-width:.4}.w-dishwasher .qhdh{fill:#fff;opacity:.35}
.w-dishwasher .wdt{font:600 8.4px Roboto,system-ui,sans-serif;fill:#fff;text-anchor:middle}
.w-dishwasher .scene .lk{stroke:#fff;stroke-opacity:.85;stroke-width:.65}.w-dishwasher .scene .lk rect{fill:#fff}
.dlock .w-dishwasher .lk,.st-run .w-dishwasher .lk,.st-pause .w-dishwasher .lk{display:inline}
.st-off .w-dishwasher .wdt,.st-off .w-dishwasher .qsel.on{display:none}
.st-off .w-dishwasher .qtint{opacity:.62}
.w-dishwasher .qfront{transition:opacity .4s}.w-dishwasher .qtilt,.w-dishwasher .qgap,.w-dishwasher .qsteam{opacity:0;transition:opacity .4s}
.w-dishwasher .qtop{fill:#5d6779;opacity:.85}.w-dishwasher .qtilt path{stroke-linejoin:round}
.w-dishwasher .qsteam ellipse{fill:#c9d4e3;opacity:0;transform-box:fill-box;transform-origin:center}
/* Läuft: Innenlicht, Sprüharme drehen, Wasserstrahlen und Nebel hinter der Scheibe, Beschlag */
.st-run .w-dishwasher .qdlt,.st-pause .w-dishwasher .qdlt{opacity:1}
.st-run .w-dishwasher .qtint,.st-pause .w-dishwasher .qtint{opacity:.28}
.st-run .w-dishwasher .qfog circle{opacity:.22}.st-run.alt .w-dishwasher .qfog circle{opacity:.3}
.anim.st-run:not(.alt) .w-dishwasher .qarm{animation:dv-sarm 1.4s linear infinite}
.anim.st-run:not(.alt) .w-dishwasher .qjet circle{animation:dv-jet 1.1s ease-out infinite}
.anim.st-run:not(.alt) .w-dishwasher .qmist{animation:dv-mist 3.2s ease-in-out infinite}
.anim.st-pause .w-dishwasher .wdt{animation:dv-blinko 1.4s ease-in-out infinite}
/* Trocknet: Arme stehen, Dampf steigt langsam auf */
.st-run.alt .w-dishwasher .qdlt{opacity:.45}
.anim.st-run.alt .w-dishwasher .qstm path{animation:dv-steam 3.2s ease-out infinite}
/* Tür offen: nur angekippt, oben ein Spalt mit Korb und leichtem Innenlicht, Dampf steigt aus dem Spalt, Bedienleiste bleibt */
.dopen .w-dishwasher .qfront{opacity:0}
.dopen .w-dishwasher .qtilt,.dopen .w-dishwasher .qgap,.dopen .w-dishwasher .qsteam{opacity:1}
.dopen .w-dishwasher .qdlt{opacity:.35}.dopen .w-dishwasher .qjet,.dopen .w-dishwasher .qstm,.dopen .w-dishwasher .qmist{opacity:0}
.dopen .w-dishwasher .qarm{animation:none!important}
.dopen .w-dishwasher .wdt,.dopen .w-dishwasher .lk{display:none}
.anim.dopen .w-dishwasher .qsteam ellipse{animation:dv-puff 2.8s ease-in-out infinite}
/* Hinweise im Bild (Farben aus dem Theme: --nova-warning-color / --nova-error-color) */
.scene .wn{display:none;transform-box:fill-box;transform-origin:center}
.scene .wn{--wc:var(--nv-error)}
.scene .wt3{fill:var(--wc);stroke:rgba(0,0,0,.25);stroke-width:.5;filter:drop-shadow(0 0 4px color-mix(in srgb,var(--wc) 50%,transparent))}.scene .wx,.scene .wx2{fill:#fff}
.h-warning .scene .wn,.st-err .scene .wn{display:inline}
.anim.h-warning .scene .wn,.anim.st-err .scene .wn{animation:dv-pop2 1.6s ease-in-out infinite}
/* Tür offen: Bullauge ca. 30° angelehnt (verkürzt, Seitenkante, gewölbtes Glas), Scharnierblock, Manschette, Trommel ohne Wasser */
.w-washer .pdt{fill:none;stroke:#1a1e27;stroke-width:4.4;opacity:0;transition:opacity .3s}
.w-washer .pgb{opacity:0;transition:opacity .4s}.w-washer .hng{opacity:0;transition:opacity .3s}
.w-washer .gsm{fill:none;stroke:#5d6573;stroke-width:4.6}.w-washer .gsf{fill:none;stroke:#000;stroke-opacity:.35;stroke-width:.6}.w-washer .gsh{fill:none;stroke:#fff;stroke-opacity:.12;stroke-width:.6}
.dopen .w-washer .pd{transform:scale(.8,1.03)}
.dopen .w-washer .pdt,.dopen .w-washer .pgb,.dopen .w-washer .hng{opacity:1}
.dopen .w-washer .wl,.dopen .w-washer .dlt{opacity:0}
.w-washer .wl{transition:transform .8s,opacity .5s}
.scene .lk{display:none;fill:none;stroke:currentColor;stroke-opacity:.8;stroke-width:1.4}.scene .lk rect{fill:currentColor;fill-opacity:.8;stroke:none}
.dlock .w-washer .lk{display:inline}
.scene .dd{transform-box:view-box;transition:transform .5s ease}
.h-detergent .w-washer .dw,.h-softener .w-washer .dw{fill:var(--nv-warn);fill-opacity:.95}
.anim.h-detergent .w-washer .dw,.anim.h-softener .w-washer .dw{animation:dv-blinko 1.3s ease-in-out infinite}
/* Kaffeevollautomat im Nova-Zeichenstil (Maßstab 3D-Drucker, Grundteile aus shared/scene.js); Getränkefarben --cc/--cr/--cm aus der Karte */
.w-coffee{--gx:70px}
.w-coffee .cft{fill:#0d1016}.w-coffee .c-lc{stop-color:var(--dc)}
.w-coffee .c-f{stop-color:var(--cm,#f3ece2)}.w-coffee .c-c{stop-color:var(--cc,#7a4e2e)}.w-coffee .c-m{stop-color:color-mix(in srgb,var(--cm,#f3ece2) 82%,var(--cc,#7a4e2e))}
.w-coffee .ctw{transform-box:view-box;transition:transform .8s}.w-coffee .ctws{fill:#fff;opacity:.35}
.w-coffee .tk{transition:stroke .3s}.w-coffee .ctm{fill:none;stroke:#fff;stroke-opacity:.25;stroke-width:.6}
.w-coffee .cbh{fill:#fff;opacity:.14}.w-coffee .ctb rect{fill:#fff;opacity:.14}
.w-coffee .cscr{transition:fill .6s}
.w-coffee .ctx{font:600 8.4px Roboto,system-ui,sans-serif;fill:#fff;text-anchor:middle}
.w-coffee .dp{fill:#fff;opacity:.2}
.w-coffee .cnr{fill:none;stroke:#000;stroke-opacity:.45;stroke-width:1}.w-coffee .cnl{opacity:0;transition:opacity .6s}
.w-coffee .cspb,.w-coffee .cnz{stroke:rgba(0,0,0,.4);stroke-width:.4}.w-coffee .csph{fill:#fff;opacity:.35}
.w-coffee .cgr{stroke:rgba(0,0,0,.35);stroke-width:.4}.w-coffee .cgs{fill:none;stroke:#0b0e13;stroke-width:1.2;stroke-dasharray:3 1.6}
.w-coffee .cth{fill:#fff;opacity:.1}.w-coffee .ctf{fill:#0b0e13}
.w-coffee .flow line{stroke:var(--cc,#4a2c19);stroke-width:1.6;stroke-linecap:round;stroke-dasharray:5 2.5;opacity:0;transition:opacity .3s}
.w-coffee .cfc{fill:var(--cc,#4a2c19)}.w-coffee .cfr{fill:var(--cr,#b07a48)}
.w-coffee .cff{fill:var(--cm,#efe6d8);transform-box:fill-box;transform-origin:center top;transform:scaleY(var(--mf,0))}
.w-coffee .cfl{--ch:34px;transform:translateY(calc((1 - var(--cl,0)) * var(--ch)));transition:transform 1s}.w-coffee .cfl.g{--ch:61px}
.k-water .w-coffee .cfc{opacity:.45}.k-water .w-coffee .cfr{display:none}.k-milk .w-coffee .cfr{opacity:.4}
.w-coffee .chd{fill:none;stroke:#fff;stroke-opacity:.3;stroke-width:1.6}.w-coffee .crim{fill:none;stroke:#fff;stroke-opacity:.28;stroke-width:.6}
.w-coffee .cgls{display:none}.k-lm .w-coffee .cgls{display:inline}.k-lm .w-coffee .ccup,.k-lm .w-coffee .csteam{display:none}
.w-coffee .csteam path{fill:none;stroke:#d7dfec;stroke-width:2;stroke-linecap:round;opacity:0;transform-box:fill-box;transform-origin:center bottom}
.st-off .w-coffee .ctx{display:none}
.st-ready .w-coffee .cscr,.st-done .w-coffee .cscr,.st-prep .w-coffee .cscr{fill:color-mix(in srgb,var(--dc) 12%,${PAL.screen})}
.st-run .w-coffee .cscr,.st-heat .w-coffee .cscr,.st-pause .w-coffee .cscr,.st-warm .w-coffee .cscr{fill:color-mix(in srgb,var(--dc) 20%,${PAL.screen})}
.st-ready .w-coffee .cnl{opacity:.22}.st-run .w-coffee .cnl{opacity:.85}.st-done .w-coffee .cnl,.st-pause .w-coffee .cnl{opacity:.4}
.st-heat .w-coffee .cscr{stroke:var(--dc);stroke-opacity:.8}.anim.st-heat .w-coffee .cscr{animation:dv-stk 2.6s ease-in-out infinite}
.anim.st-pause .w-coffee .ctx{animation:dv-blinko 1.4s ease-in-out infinite}
/* Brüht: zwei Strahlen, Tasse füllt sich (nach Fortschritt, sonst in 9 s), bei Milchgetränken wächst der Schaum, Dampf steigt */
.st-run .w-coffee .flow line{opacity:.95}
.anim.st-run .w-coffee .flow line{animation:dv-flow .5s linear infinite}
.anim.st-run:not(.cprog) .w-coffee .cfl{animation:dv-cfill 9s ease-out both}
.anim.st-run.milk:not(.cprog) .w-coffee .cff{animation:dv-foam 9s ease-out both}
.anim.st-run .w-coffee .csteam path,.anim.st-done .w-coffee .csteam path{animation:dv-hz 3.6s ease-out infinite}
.anim.st-done .w-coffee .csteam path{animation-duration:4.4s}
.w-coffee .csteam path:nth-child(2){animation-delay:1.2s}.w-coffee .csteam path:nth-child(3){animation-delay:2.4s}
/* Störung: Display rot; Wassertank leer: Tank leer und blinkt rot; Bohnen/Entkalken: Deckel bzw. Tropfen in der Warnfarbe */
.st-err .w-coffee .cscr{stroke:var(--nv-error);stroke-opacity:.9}.st-err .w-coffee .ctx{fill:var(--nv-error)}
.h-tank .w-coffee .ctw{transform:translateY(86px)}.h-tank .w-coffee .tk{stroke:var(--nv-error);stroke-opacity:1;stroke-width:1.2}
.h-beans .w-coffee .bn{fill:var(--nv-warn)}.h-descale .w-coffee .dp{fill:var(--nv-warn);opacity:1}
.anim.h-tank .w-coffee .tk,.anim.h-beans .w-coffee .bn,.anim.h-descale .w-coffee .dp{animation:dv-blinko 1.3s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.st-run:not(.cprog) .w-coffee .cfl{--cl:.6}.st-run.milk:not(.cprog) .w-coffee .cff{--mf:.5}}
/* Futterautomat im Nova-Zeichenstil: Vorrat im Fenster --fl, Napf --fb */
.w-feeder{--gx:80px}
.w-feeder .fft{fill:#0d1016}.w-feeder .fsep{fill:#000;opacity:.3}
.w-feeder .fk0{fill:#1d120a;opacity:.6}
.w-feeder .kbl path{stroke:#000;stroke-opacity:.45;stroke-width:.45}.w-feeder .kbl ellipse{fill:#fff;opacity:.18}
.w-feeder .k1 path,.w-feeder .fk1{fill:#c4844a}.w-feeder .k2 path,.w-feeder .fk2{fill:#9c6232}.w-feeder .k3 path,.w-feeder .fk3{fill:#dba468}.w-feeder .k4 path{fill:#b0723e}.w-feeder .k5 path{fill:#7e4f28}
.w-feeder .fwf{fill:#0b0e13;stroke:rgba(255,255,255,.08);stroke-width:.5}
.w-feeder .fpl{transform:translateY(calc((1 - var(--fl,.7)) * 80px));transition:transform .8s}
.h-food .w-feeder .fpl,.empty .w-feeder .fpl{--fl:0}
.w-feeder .fmk{fill:none;stroke:#fff;stroke-opacity:.3;stroke-width:.7}
.w-feeder .fring{fill:#07090d;stroke:rgba(255,255,255,.15);stroke-width:.5}.w-feeder .ftb{fill:#fff;opacity:.14}
.w-feeder .fch{fill:#05070a;stroke:rgba(255,255,255,.08);stroke-width:.5}
.w-feeder .f-lc{stop-color:var(--dc)}.w-feeder .fchl{opacity:0;transition:opacity .6s}
.w-feeder .flip,.w-feeder .fbo{stroke:rgba(0,0,0,.4);stroke-width:.4}
.w-feeder .fdrop ellipse{opacity:0}
.w-feeder .fbi{fill:#151921}.w-feeder .fbr{fill:none;stroke:#fff;stroke-opacity:.35;stroke-width:.8}
.w-feeder .fbh{fill:none;stroke:#fff;stroke-opacity:.3;stroke-width:1.4;stroke-linecap:round}
.w-feeder .fbw{transform:translateY(calc((1 - var(--fb,.2)) * 15px));transition:transform 1s}
/* Füttert: Licht im Schacht, Brocken fallen in den Napf, der Napf füllt sich; fertig = voller Napf */
.st-run .w-feeder .fchl{opacity:.75}
.anim.st-run .w-feeder .fdrop ellipse{animation:dv-kib .9s ease-in infinite}
.st-run .w-feeder .fbw,.st-done .w-feeder .fbw{--fb:1}
.anim.st-run .w-feeder .fbw{animation:dv-fbowl 8s ease-out both}
.anim.st-run .w-feeder .fled{animation:dv-blinko 1.4s ease-in-out infinite}
/* Futter leer / Störung: Fenster leer, LED blinkt rot */
.g.dv.empty .w-feeder .fled,.g.dv.h-food .w-feeder .fled,.g.dv.st-err .w-feeder .fled{fill:var(--nv-error);fill-opacity:1}
.anim.empty .w-feeder .fled,.anim.h-food .w-feeder .fled,.anim.st-err .w-feeder .fled{animation:dv-blinko 1s ease-in-out infinite}
.empty .scene .wn,.low .scene .wn{display:inline}
/* Trinkbrunnen im Nova-Zeichenstil: Wasserstand im Sichtfenster --wl, läuft nie „fertig“ */
.w-fountain{--gx:40px}
.w-fountain .b-wc{stop-color:var(--dc)}
.w-fountain .bft{fill:#0d1016}.w-fountain .bsep{fill:none;stroke:#000;stroke-opacity:.45;stroke-width:.8}.w-fountain .bsh{fill:none;stroke:#fff;stroke-opacity:.08;stroke-width:.6}
.w-fountain .bwf{fill:#07090d;stroke:rgba(255,255,255,.1);stroke-width:.5}.w-fountain .bmk{fill:none;stroke:#fff;stroke-opacity:.35;stroke-width:.6}
.w-fountain .bwl{transform:translateY(calc((1 - var(--wl,.8)) * 40px));transition:transform .8s}.h-water .w-fountain .bwl{--wl:.12}
.w-fountain .bws{fill:#fff;opacity:.5}
.w-fountain .btop{stroke:rgba(255,255,255,.18);stroke-width:.5}.w-fountain .brec{fill:#0b0e13}
.w-fountain .bdr{fill:none;stroke:#fff;stroke-opacity:.14;stroke-width:.6}
.w-fountain .bdish{transition:opacity .6s}.st-off .w-fountain .bdish,.st-pause .w-fountain .bdish{opacity:.6}
.w-fountain .bnz{stroke:rgba(0,0,0,.4);stroke-width:.3}
.w-fountain .brip ellipse{fill:none;stroke:#fff;stroke-opacity:.45;stroke-width:.5;opacity:0;transform-box:fill-box;transform-origin:center}
.w-fountain .bflow{fill:none;stroke:#fff;stroke-opacity:0;stroke-width:.7;stroke-dasharray:3 5;transition:stroke-opacity .6s}
.w-fountain .bdome{fill:var(--dc);fill-opacity:.65;opacity:0;transform-box:fill-box;transform-origin:center bottom;transition:opacity .4s}
.w-fountain .bdhl{fill:none;stroke:#fff;stroke-opacity:.35;stroke-width:.6;stroke-linecap:round;opacity:0;transition:opacity .4s}
.w-fountain .bdrop circle{fill:var(--dc);opacity:0}
.w-fountain .bjet{fill:var(--dc);fill-opacity:.7;opacity:0;transform-box:fill-box;transform-origin:center bottom;transition:opacity .4s}
.w-fountain .bfi{transform-box:fill-box;transform-origin:center}
/* Modus-LED: ruhiges Leuchten in der Modusfarbe, kein Blinken */
.dv .w-fountain .led{fill:#5b6372;fill-opacity:.5;transition:fill .4s,fill-opacity .4s}
.m-normal.dv .w-fountain .led,.m-smart.dv .w-fountain .led{fill:var(--mc);fill-opacity:1;filter:drop-shadow(0 0 1.6px var(--mc))}
.m-normal{--mc:var(--nova-mode-normal-color,var(--nv-a1))}.m-smart{--mc:var(--nova-mode-smart-color,var(--nv-a4))}
.m-normal.dv .w-feeder .fled,.m-smart.dv .w-feeder .fled{fill:var(--mc);fill-opacity:1;filter:drop-shadow(0 0 1.6px var(--mc))}
.w-fountain .bfi rect,.w-fountain .bfi path{fill:none;stroke:#fff;stroke-opacity:.3;stroke-width:.8;stroke-linejoin:round}
/* Läuft: kleiner Sprudel wippt, Ringe laufen über die Schale, das Wasser fließt sanft über den Rand ab; aus/Pause = Wasser steht */
.st-run .w-fountain .bdome,.st-run .w-fountain .bdhl,.st-run .w-fountain .bjet{opacity:1}.st-run .w-fountain .bflow{stroke-opacity:.35}
.anim.st-run .w-fountain .bdome{animation:dv-bob 2.4s ease-in-out infinite}
.anim.st-run .w-fountain .bjet{animation:dv-jet2 1.8s ease-in-out infinite}
.anim.st-run .w-fountain .brip ellipse{animation:dv-rip 3.3s ease-out infinite}
.anim.st-run .w-fountain .bdrop circle{animation:dv-bdrop 1.8s cubic-bezier(.3,.1,.6,1) infinite}
.anim.st-run .w-fountain .bflow{animation:dv-bflow 6s linear infinite}
/* Wasser niedrig: Stand im Fenster sinkt, Ausrufezeichen; Filter wechseln: Filter-Symbol pulsiert (--nova-filter-color, Standard Akzent 2) */
.h-water .scene .wn{display:inline}
.st-err .w-fountain .bdome,.st-err .w-fountain .bdhl{opacity:0}
.h-filter .w-fountain .bfi rect,.h-filter .w-fountain .bfi path{stroke:var(--fc);stroke-opacity:1;stroke-width:1;filter:drop-shadow(0 0 1.5px var(--fc))}
.anim.h-filter .w-fountain .bfi{animation:dv-fpulse 1.6s ease-in-out infinite}
.anim.st-run .w-generic .pulse{animation:dv-pulse 2.6s ease-out infinite}
.scene .drops circle:nth-child(2),.scene .heat path:nth-child(2),.scene .puff path:nth-child(2){animation-delay:.5s}
.scene .drops circle:nth-child(3),.scene .heat path:nth-child(3),.scene .puff path:nth-child(3){animation-delay:1s}
.scene .drops circle:nth-child(4){animation-delay:.25s}.scene .drops circle:nth-child(5){animation-delay:.75s}.scene .drops circle:nth-child(6){animation-delay:1.15s}
.scene .drops circle:nth-child(odd){--dx:-6px}.scene .drops circle:nth-child(even){--dx:6px}
/* Unsichtbar (außerhalb des Bildschirms, Tab im Hintergrund, Kartenauswahl): alles steht */
.still .scene *{animation-play-state:paused!important}
.anim.st-run:not(.still) .scene>svg{will-change:transform}
@media (prefers-reduced-motion:reduce){.scene *{animation:none!important}}
@keyframes dv-tumble{0%{transform:rotate(0)}40%{transform:rotate(220deg)}50%{transform:rotate(220deg)}90%,100%{transform:rotate(0)}}
@keyframes dv-spin{to{transform:rotate(360deg)}}
@keyframes dv-sarm{0%{transform:scaleX(1)}25%{transform:scaleX(.08)}50%{transform:scaleX(-1)}75%{transform:scaleX(.08)}100%{transform:scaleX(1)}}
@keyframes dv-puff{0%{opacity:0;transform:translate(0,0) scale(.6) rotate(0)}30%{opacity:.32}70%{opacity:.18}100%{opacity:0;transform:translate(var(--sx),var(--sy)) scale(1.5) rotate(14deg)}}
@keyframes dv-jet{0%{opacity:0;transform:translate(0,0)}20%{opacity:.85}100%{opacity:0;transform:translate(var(--dx,0),-20px)}}
@keyframes dv-wave{to{transform:translateX(-25px)}}
@keyframes dv-arm{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}
@keyframes dv-drop{0%{opacity:0;transform:translate(0,0)}20%{opacity:.9}100%{opacity:0;transform:translate(var(--dx,0),-46px)}}
@keyframes dv-mist{0%,100%{opacity:.04}50%{opacity:.16}}
@keyframes dv-heat{0%{opacity:0;transform:translateY(4px)}40%{opacity:.85}100%{opacity:0;transform:translateY(-8px)}}
@keyframes dv-glow{0%,100%{opacity:.25}50%{opacity:.8}}
@keyframes dv-stk{0%,100%{stroke-opacity:.25}50%{stroke-opacity:.95}}
@keyframes dv-coil{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes dv-wglo{0%,100%{opacity:.3}50%{opacity:.5}}
@keyframes dv-hz{0%{opacity:0;transform:translateY(4px) scaleY(.6)}30%{opacity:.45}100%{opacity:0;transform:translateY(-10px) scaleY(1.2)}}
@keyframes dv-apuff{0%{opacity:0;transform:translate(0,0) scale(.6)}25%{opacity:.6}100%{opacity:0;transform:translate(var(--sx),var(--sy)) scale(1.8)}}
@keyframes dv-glo{0%,100%{opacity:.18}50%{opacity:.5}}
@keyframes dv-blinko{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes dv-pop2{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
@keyframes dv-blink{0%,100%{fill-opacity:.7}50%{fill-opacity:.15}}
@keyframes dv-jolt{0%,100%{transform:translateY(0)}35%{transform:translateY(6px)}65%{transform:translateY(-1px)}}
@keyframes dv-steam{0%{opacity:0;transform:translateY(4px)}35%{opacity:.6}100%{opacity:0;transform:translateY(-12px)}}
@keyframes dv-flow{to{stroke-dashoffset:-7}}
@keyframes dv-cfill{from{transform:translateY(var(--ch))}to{transform:translateY(0)}}
@keyframes dv-foam{0%,45%{transform:scaleY(0)}100%{transform:scaleY(1)}}
@keyframes dv-kib{0%{opacity:0;transform:translateY(-2px)}15%,80%{opacity:1}100%{opacity:0;transform:translateY(12px)}}
@keyframes dv-fbowl{from{transform:translateY(15px)}to{transform:translateY(0)}}
@keyframes dv-bob{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.2)}}
@keyframes dv-rip{0%{opacity:.6;transform:scale(.4)}100%{opacity:0;transform:scale(4.2)}}
@keyframes dv-bdrop{0%{opacity:0;transform:translate(0,0)}15%{opacity:.95}35%{transform:translate(calc(var(--dx,0) * .4),-4px)}90%{opacity:.8}100%{opacity:0;transform:translate(var(--dx,0),var(--dy,6px))}}
@keyframes dv-jet2{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.86)}}
@keyframes dv-bflow{to{stroke-dashoffset:-64}}
@keyframes dv-fpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.18)}}
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
    if (c.device_type && !TYPES[c.device_type]) throw new Error('device_type muss washer, dishwasher, airfryer, coffee, feeder, fountain oder generic sein');
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
    // Fütterung lief, während die Karte weg war: Zustand neu bestimmen
    if (this._fat && this._e) this._update();
  }
  disconnectedCallback() {
    document.removeEventListener('visibilitychange', this._onVis);
    this._io?.disconnect();
    this._inView = false;
    this._tick();
    Object.values(this._pend || {}).forEach(p => clearTimeout(p.t));
    clearTimeout(this._ft);
    clearTimeout(this._fdt);
  }
  _S(id) { return id ? this._h?.states[id] : null; }
  // Zustandsgruppe (SORDER) oder off
  _cls() {
    const k = this._cls0(), c = this._c, pw = this._S(c.power);
    // Trinkbrunnen: eingeschaltet = läuft (Fontäne), auch wenn die Pumpe gerade ruht (z. B. Smart-Modus oder Sensor hinkt)
    return k === 'off' && TYPES[typeOf(c)].nodone && pw?.state === 'on' ? 'run' : k;
  }
  _cls0() {
    const c = this._c, s = this._S(c.entity), fd = this._feed();
    if (fd) return fd;
    if (!s) return 'off';
    const v = String(s.state).toLowerCase();
    if (['binary_sensor', 'switch', 'input_boolean'].includes(dom(c.entity)) && !c.running_states) return v === 'on' ? 'run' : 'off';
    for (const k of SORDER) {
      const own = c[SKEY[k]] != null ? list(c[SKEY[k]]).map(x => x.toLowerCase()) : STATES[k];
      // Geräte ohne Ende (Trinkbrunnen): „fertig“ gilt als aus
      if (own.includes(v)) return k === 'done' && TYPES[typeOf(c)].nodone ? 'off' : k;
    }
    return 'off';
  }
  // Futterautomat ohne „füttert“-Zustand: steigt der Zähler „Fütterungen“, kurz „läuft“ (Animation), danach eine Weile „fertig“
  _feed() {
    const c = this._c;
    if (!TYPES[typeOf(c)].feed || !c.feed_count) return null;
    const s = this._S(c.feed_count), v = ok(s) && NUMRE.test(s.state) ? +s.state : null;
    if (v != null) { if (this._fc != null && v > this._fc) this._fat = Date.now(); this._fc = v; }
    if (!this._fat) return null;
    const dt = Date.now() - this._fat, end = FEED_MS + Math.max(0, +(c.feed_done_minutes ?? 10) || 0) * 60000;
    clearTimeout(this._fdt);
    if (dt >= end) { this._fat = 0; return null; }
    this._fdt = setTimeout(() => this._update(), (dt < FEED_MS ? FEED_MS : end) - dt + 50);
    return dt < FEED_MS ? 'run' : 'done';
  }
  _build() {
    this._built = true;
    const c = this._c, t = typeOf(c), r = this.shadowRoot || this.attachShadow({mode: 'open'}), cmp = c.layout === 'compact';
    const rv = roleVars(c.color || TYPES[t].color);
    const anim = c.animation !== false && !cmp;
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${SCENE_CSS}${DCSS}:host([hidden]){display:none}</style>
<div class="g dv t-${t}${c.window === false ? ' nowin' : ''}${cmp ? ' cmp' : ''}${anim ? ' anim' : ''}${c.glow !== false ? ' glow' : ''}" style="--dc:${rv.c};--dc-fg:${rv.fg};--hc:${roleVars(c.heat_color || 'accent-2').c}">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${cmp ? '<span class="rmc"></span>' : ''}${c.power ? '<div class="hb pw" title="Ein/Aus"><ha-icon icon="mdi:power"></ha-icon></div>' : ''}</div>
${cmp ? '<div class="bar" hidden><i></i></div>' : `<div class="mid"><div class="w-${t}">${scene(t)}</div><div class="inf"><div class="pg"></div><div class="ph" hidden></div><div class="bar" hidden><i></i></div><div class="tm"><span class="rm"></span><span class="en"></span></div></div></div>
<div class="ctls"></div>${c.start_at === 'home_connect' && c.start ? SA : ''}${['select', 'input_select'].includes(dom(c.start)) && !c.start_option ? PICK : ''}<div class="acts"></div>`}<div class="als"></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), pw: q('.pw'), pg: q('.pg'), ph: q('.ph'), bar: q('.bar'), bari: q('.bar i'),
      rm: q('.rm') || q('.rmc'), kp: q('.kp'), kt: q('.kt'), wd: q('.wdt'), cx: q('.ctx'), en: q('.en'), ctls: q('.ctls'), acts: q('.acts'), als: q('.als'), sa: q('.sa'), sat: q('.sa input'), san: q('.sa .now'), sah: q('.sa .sah'), pk: q('.pk'), pkv: q('.pk .v'), pkk: q('.pk .k')};
    const e = this._e;
    press(e.ic, {tap: () => this._act({entity: c.entity, tap_action: c.tap_action}, 'tap', true), hold: () => this._act({entity: c.entity, hold_action: c.hold_action}, 'hold')});
    if (cmp) press(e.name.parentElement, {tap: () => this._act({entity: c.entity, tap_action: c.tap_action}, 'tap', true), hold: () => this._act({entity: c.entity, hold_action: c.hold_action}, 'hold')});
    e.als.addEventListener('click', ev => {
      // Reset-Knopf im Hinweis (z. B. Filter zurücksetzen): Button drücken, Skript starten, Schalter ausschalten
      const r = ev.target.closest?.('.alr');
      if (r) { const id = r.dataset.r, d = dom(id); return this._call(d, ['button', 'input_button'].includes(d) ? 'press' : ['script', 'scene'].includes(d) ? 'turn_on' : 'turn_off', id, {}, r.textContent); }
      const el = ev.target.closest?.('.al[data-e]'); if (el) this._act({entity: el.dataset.e}, 'tap', true);
    });
    if (e.pw) press(e.pw, {tap: () => this._call(dom(c.power) === 'input_boolean' ? 'input_boolean' : 'switch', 'toggle', c.power, {}, 'Ein/Aus')});
    if (e.ctls) this._ctl = c.controls.map(o => this._mkCtl(o));
    // Startzeit: nur in der Karte vorgemerkt, wird erst beim Druck auf Start umgerechnet und mitgeschickt
    if (e.sa) {
      e.sat.addEventListener('change', () => { this._at = e.sat.value || null; this._update(); });
      press(e.san, {tap: () => { this._at = null; this._update(); }, isolate: true});
    }
    if (e.pk) {
      press(e.pk.querySelector('.mi'), {tap: () => this._pick(-1), isolate: true});
      press(e.pk.querySelector('.pl'), {tap: () => this._pick(1), isolate: true});
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
  // Optionen des Start-Selects ohne leere Einträge; gewählte Option (in der Karte gemerkt, sonst der aktuelle Wert bzw. die erste)
  _pickOpts() { return (this._S(this._c.start)?.attributes.options || []).filter(x => x !== '' && x != null); }
  _picked() { const o = this._pickOpts(), cur = this._S(this._c.start)?.state; return o.includes(this._pk) ? this._pk : o.includes(cur) ? cur : o[0]; }
  _pick(d) {
    const o = this._pickOpts(), i = o.indexOf(this._picked());
    if (!o.length) return;
    this._pk = o[Math.max(0, Math.min(o.length - 1, i + d))];
    this._update();
  }
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
    if (this._selStart() && !c.start_option) return this._picked() ? null : 'Start: keine Auswahl möglich';
    if (this._selStart()) {
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
    if (d === 'select' || d === 'input_select') return this._call(d, 'select_option', id, {option: c.start_option ? this._S(c.start_option)?.state : this._picked()}, what);
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
    if (TY.drink) this._coffee(cls, p, TY);
    // Füllstand: Futtervorrat im Fenster bzw. Wasser im Tank; leer = Fenster leer, niedrig = Warndreieck
    // Trinkbrunnen: Modus-LED (normal blau, smart grün, aus grau); ohne Modus-Entität folgt sie dem Zustand
    if (TY.mode) {
      const m = this._S(c.mode), v = ok(m) ? String(m.state).toLowerCase() : '';
      const md = cls === 'off' ? 'off' : !ok(m) ? (cls === 'run' ? 'normal' : 'off') : /smart|intelligen|auto|eco|spar/.test(v) ? 'smart' : ['off', 'aus', 'standby'].includes(v) ? 'off' : 'normal';
      ['normal', 'smart', 'off'].forEach(k => e.g.classList.toggle(`m-${k}`, k === md));
    }
    if (TY.level) {
      const lv = levelOf(this._S(c.fill_level), TY.binEmpty);
      e.g.style.setProperty(t === 'feeder' ? '--fl' : '--wl', lv == null ? '' : lv.toFixed(2));
      e.g.classList.toggle('empty', lv === 0);
      e.g.classList.toggle('low', lv != null && lv > 0 && lv <= .2);
    }
    if (this._fx && !this._sw) { this._sw = true; sweep(e.g); }
    if (!this._fx) this._sw = false;
    if (p != null) e.bari.style.width = `${p}%`;
    if (c.layout === 'compact') {
      e.ic.style.setProperty('--p', `${p ?? 0}%`);
      e.sub.textContent = [pg && act ? pg : stx, p != null && act ? `${Math.round(p)} %` : ''].filter(Boolean).join(' · ');
      e.rm.textContent = rem != null ? fmtDur(rem) : '';
    } else {
      // Futterautomat/Trinkbrunnen: groß der Füll- bzw. Wasserstand statt Programm/Status (der steht schon im Kopf)
      // Trinkbrunnen mit Modus: groß der Modus, darunter die Pumpe; sonst groß der Füll- bzw. Wasserstand
      const md = TY.filter ? this._S(c.mode) : null;
      const mt = ok(md) ? nice(md.state, fmtState(h, md)).replace(/^./, x => x.toUpperCase()) : null;
      const lt = mt ?? (TY.lvl ? levelText(this._S(c.fill_level), TY.lvl) : null);
      e.pg.textContent = TY.lvl ? lt ?? '' : pg || stx;
      const pu = this._S(c.entity), pon = ok(pu) && pu.state === 'on';
      const phx = mt ? (cls === 'off' ? '' : pon ? 'Pumpe läuft' : 'Pumpe pausiert') : lt ? TY.lvl[0] : c.phase && ok(ph) ? nice(ph.state, fmtState(h, ph)) : '';
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
    if (e.pk) {
      const v = this._picked(), o = this._pickOpts(), i = o.indexOf(v), s = this._S(c.start);
      e.pk.hidden = act || !v;
      e.pkk.textContent = c.start_option_name || TYPES[typeOf(c)].pick || 'Auswahl';
      // Portion: nur die Menge in Gramm zeigen (z. B. „1/10th Cup (10g)“ → „10 g“), sonst den Optionstext
      const g = v && /(\d+(?:[.,]\d+)?)\s*g\b/i.exec(v);
      e.pkv.textContent = g ? `${g[1]} g` : v && s ? fmtOpt(this._h, s, v) : '';
      e.pk.querySelector('.mi').classList.toggle('dis', i <= 0); e.pk.querySelector('.pl').classList.toggle('dis', i >= o.length - 1);
    }
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
  // Kaffee: Getränk aus „Getränk“, Programm oder Start-Programm → Farben, Tasse/Glas, Milchschaum, Füllung, Display-Text
  _coffee(cls, p, TY) {
    const c = this._c, g = this._e.g, src = [c.drink, c.program, c.start_option].map(x => this._S(x)).find(x => ok(x) && x.state !== 'off');
    const D = drinkOf(src ? `${src.state} ${fmtState(this._h, src)}` : ''), k = D[0], col = CK[k], milk = MILK.has(k);
    DRINKS.forEach(([x]) => g.classList.toggle(`k-${x}`, x === k));
    ['--cc', '--cr', '--cm'].forEach((v, i) => g.style.setProperty(v, col[i]));
    g.classList.toggle('milk', milk);
    const prog = cls === 'run' && p != null, f = cls === 'done' ? 1 : prog ? p / 100 : 0;
    g.classList.toggle('cprog', prog);
    g.style.setProperty('--cl', f.toFixed(2));
    g.style.setProperty('--mf', milk ? Math.max(0, Math.min(1, (f - .45) / .55)).toFixed(2) : '0');
    if (this._e.cx) this._e.cx.textContent = {off: '', err: 'Störung', done: 'Fertig', heat: 'Heizt auf', warm: 'Warm', wait: 'Später'}[cls] ?? (src ? D[2] : cls === 'run' ? TY.run : 'Bereit');
  }
  _alerts(cls, stx) {
    const c = this._c, h = this._h, t = typeOf(c), TY = TYPES[t], g = this._e.g, out = [], on = new Set();
    // e = Entität: Hinweis antippen öffnet sie; hit = Hinweis mit Animation im Bild
    const add = (lvl, ic, msg, e, hit, r) => out.push(`<div class="al ${lvl}${hit ? ' hit' : ''}"${e ? ` data-e="${esc(e)}"` : ''}><ha-icon icon="${esc(ic)}"></ha-icon><span>${esc(msg)}</span>${r && ok(this._S(r.id)) || r && dom(r.id) === 'button' ? `<span class="alr" data-r="${esc(r.id)}">${esc(r.name)}</span>` : ''}</div>`);
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
      // Filter-Hinweis: Resttage anhängen
      const fd = an === 'filter' ? this._S(c.filter_days) : null, fdn = ok(fd) && NUMRE.test(fd.state) ? Math.round(+fd.state) : null;
      const fx = fdn != null ? `noch ${fdn} ${fdn === 1 ? 'Tag' : 'Tage'}` : '';
      add(['error', 'info'].includes(a.level) ? a.level : 'warning', a.icon || (H && an !== 'warning' ? H[2] : s?.attributes.icon) || 'mdi:information-outline',
        [a.message || (H && H[1]) || `${a.name ?? s.attributes.friendly_name ?? a.entity}: ${fmtState(h, s)}`, fx].filter(Boolean).join(' · '), a.entity, !!an, a.reset && {id: a.reset, name: a.reset_name || 'Zurücksetzen'});
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
define('geraet-card', NovaApplianceCard, {name: 'Nova Gerät Card', description: 'Haushaltsgerät (Waschmaschine, Spülmaschine, Airfryer, Kaffeemaschine, Futterautomat, Trinkbrunnen …) mit Status, Programm, Fortschritt, Restzeit, Reglern und Start/Pause/Stopp.', documentationURL: docUrl('nova-gerät-card')});

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
  ...(TYPES[t].drink ? [{name: 'drink', selector: ST}] : []),
  ...(TYPES[t].level ? [{name: 'fill_level', selector: {entity: {domain: ['sensor', 'binary_sensor', 'number', 'input_number']}}}] : []),
  ...(TYPES[t].filter ? [g2({name: 'filter', selector: {entity: {domain: ['sensor', 'number', 'input_number']}}}, {name: 'filter_days', selector: {entity: {domain: ['sensor', 'number', 'input_number']}}})] : []),
  ...(TYPES[t].mode ? [{name: 'mode', selector: {entity: {domain: ['select', 'input_select', 'sensor', 'switch', 'input_boolean']}}}] : []),
  ...(TYPES[t].feed ? [g2({name: 'feed_count', selector: {entity: {domain: ['sensor', 'counter', 'number', 'input_number']}}}, NUM('feed_done_minutes'))] : []),
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
  g2({name: 'state', selector: T}, {name: 'state_not', selector: T}), g2(NUM('above'), NUM('below')), sel('level', [['warning', 'Warnung'], ['error', 'Fehler'], ['info', 'Info']]), g2({name: 'reset', selector: BTN}, {name: 'reset_name', selector: T})];
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
  g2(ROLE('color'), {name: 'glow', selector: {boolean: {}}}), ...(t === 'airfryer' ? [g2(ROLE('heat_color'), {name: 'window', selector: {boolean: {}}})] : [])];
const GACTS = [g2({name: 'tap_action', selector: A}, {name: 'hold_action', selector: A})];
const PHASE_LBL = {dishwasher: 'Zustände „trocknet“ (Dampf statt Sprüharm)', washer: 'Zustände „schleudert“ (schnelle Trommel)'};
const GLABELS = {...BASE_LABELS, device_type: 'Gerätetyp', entity: 'Status', power: 'Ein/Aus-Schalter', program: 'Programm', progress: 'Fortschritt (%)', duration: 'Gesamtdauer',
  remaining: 'Restzeit', end_time: 'Endzeit', drink: 'Getränk (optional)', fill_level: 'Füllstand', feed_count: 'Fütterungen (Zähler)', mode: 'Modus (LED)', filter: 'Filter (%)', filter_days: 'Filter: Resttage', feed_done_minutes: '„Fertig“ zeigen (Minuten)', phase: 'Phase (optional)', phase_states: 'Sonder-Zustände', display: 'Darstellung', step: 'Schrittweite', show: 'Anzeigen',
  start: 'Start', start_name: 'Text auf dem Start-Knopf', start_option: 'Programm für den Start', pause: 'Pause', resume: 'Fortsetzen', resume_with_start: 'Fortsetzen nutzt Start-Knopf', stop: 'Stopp',
  start_confirm: 'Rückfrage vor dem Start', start_at: '„Starten um“ (Uhrzeit wählen)', stop_confirm: 'Rückfrage vor dem Stopp', remote_start: 'Fernstart erlaubt', remote_start_text: 'Hinweis, wenn Fernstart aus',
  door: 'Tür / Schublade', door_anim: 'Tür im Bild zeigen', anim: 'Animation im Bild', door_text: 'Hinweis, wenn offen', connection: 'Verbindung', connection_text: 'Hinweis ohne Verbindung', message: 'Meldung', level: 'Stufe', reset: 'Reset-Knopf im Hinweis', reset_name: 'Text auf dem Reset-Knopf', start_option_name: 'Name der Auswahl',
  running_states: 'Zustände „läuft“', paused_states: 'Zustände „pausiert“', waiting_states: 'Zustände „startet später“', finished_states: 'Zustände „fertig“', error_states: 'Zustände „Störung“', prep_states: 'Zustände „wird eingestellt“', text_prep: 'Text „wird eingestellt“',
  ready_states: 'Zustände „bereit“', heat_states: 'Zustände „heizt auf“', warm_states: 'Zustände „hält warm“', text_ready: 'Text „bereit“', text_heat: 'Text „heizt auf“', text_warm: 'Text „hält warm“',
  text_running: 'Text „läuft“', text_paused: 'Text „pausiert“', text_waiting: 'Text „startet später“', text_finished: 'Text „fertig“', text_error: 'Text „Störung“', text_off: 'Text „aus“',
  layout: 'Darstellung', hide_when_off: 'Ausblenden, wenn aus, bereit oder fertig', animation: 'Animation (aus = Standbild)', color: 'Farbe', glow: 'Rahmen leuchtet beim Laufen', window: 'Sichtfenster', heat_color: 'Glühfarbe (Heizspirale)'};
const GHELPERS = {
  device_type: 'Bestimmt nur Symbol, Texte, Standardfarbe und Animation',
  entity: 'Betriebszustand, z. B. sensor.waschmaschine_betriebszustand – auch binary_sensor (an = läuft)',
  power: 'Optional: runder Knopf oben rechts',
  program: 'Laufendes Programm (Select oder Sensor). Leer bzw. ohne Wert = Programm für den Start',
  progress: 'Leer = aus Restzeit und Gesamtdauer berechnet',
  drink: 'Leer = Programm. Erkennt Espresso, Kaffee, Cappuccino, Latte (Macchiato), Milch, Heißwasser – Kaffeefarbe, Milchschaum und Glas passen sich an',
  fill_level: 'Prozent-Sensor (Vorrat bzw. Wasser im Bild) oder binary_sensor „niedrig“ (an = niedrig). 0 % = leer',
  filter: 'Erscheint im Hinweis „Filter wechseln“, z. B. sensor.…_filter_percent',
  filter_days: '„noch N Tage“ im Hinweis „Filter wechseln“, z. B. sensor.…_filter_days_remaining',
  mode: 'z. B. select.trinkbrunnen_modus. LED: Smart grün, aus grau, sonst (Normal) blau. Leer = LED folgt dem Zustand. Farben per Theme: --nova-mode-normal-color / --nova-mode-smart-color',
  feed_count: 'Für Geräte ohne Zustand „füttert“, z. B. sensor.futterautomat_times_dispensed: steigt der Wert, zeigt die Karte die Fütterung',
  feed_done_minutes: 'So lange bleibt nach einer Fütterung „Fertig“ mit vollem Napf stehen. Leer = 10',
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
  heat_color: 'Farbe von Heizspirale, Fenster-Licht und Fuge beim Garen (Standard: Akzent 2)',
  window: 'Aus = Gerät ohne Fenster: Hitze steigt oben auf, der Knopfring zeigt alles an',
  hide_when_off: 'Gut für die Startseite: Karte nur, solange etwas läuft. Im Bearbeitungsmodus bleibt sie sichtbar',
  color: 'Farbrolle aus dem Theme (Fortschritt, Start-Knopf, Animation)',
  message: 'Leer = Name: Zustand',
  state: 'Hinweis bei diesem Zustand (mehrere mit Komma)',
  reset: 'z. B. button.…_reset_filter – erscheint rechts im Hinweis. Schalter werden ausgeschaltet',
  start_option_name: 'Leer = „Portion“ (Futterautomat) bzw. „Auswahl“',
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
