import {define, docUrl, tag} from './shared/define.js';
import {esc} from './shared/utils.js';
import {moreInfo, hassAction} from './shared/actions.js';
import {CARD_CSS, EDITOR_CSS, MAPROW_CSS} from './shared/styles.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {sparkline} from './shared/sparkline.js';

const TAG = 'thermostat-card';
const MODE_NAMES = {off: 'Aus', heat: 'Heizen', auto: 'Auto', cool: 'Kühlen', heat_cool: 'Heizen/Kühlen', dry: 'Trocknen', fan_only: 'Lüften'};
const ACTION_NAMES = {heating: 'heizt', cooling: 'kühlt', idle: 'Ziel erreicht', off: 'aus', drying: 'trocknet', fan: 'lüftet', preheating: 'heizt vor'};
const MODE_ICONS = {off: 'mdi:power', heat: 'mdi:fire', auto: 'mdi:thermostat-auto', cool: 'mdi:snowflake', heat_cool: 'mdi:sun-snowflake-variant', dry: 'mdi:water-percent', fan_only: 'mdi:fan'};

/* ---------- Verlauf ---------- */
// Verlauf je Entität+Zeitraum, 10 Minuten zwischengespeichert. Liefert [[Zeit, Wert], …] oder null, solange noch geladen wird
const HISTORY = {};
function history(h, id, hours, onLoad) {
  const key = `${id}|${hours}`, hit = HISTORY[key];
  if (hit && (hit.loading || Date.now() - hit.t < 600000)) return hit.data;
  HISTORY[key] = {t: Date.now(), data: hit?.data || null, loading: true};
  const start = new Date(Date.now() - hours * 3600000).toISOString();
  h.callApi('GET', `history/period/${start}?filter_entity_id=${id}&minimal_response&no_attributes`).then(res => {
    const pts = (res[0] || []).map(x => [new Date(x.last_changed).getTime(), parseFloat(x.state)]).filter(p => !isNaN(p[1]));
    HISTORY[key] = {t: Date.now(), data: pts};
    onLoad && onLoad();
  }).catch(() => { HISTORY[key] = {t: Date.now(), data: []}; });
  return HISTORY[key].data;
}

/* ---------- Editor Thermostat Card ---------- */
// Modi-Auswahl richtet sich nach dem gewählten Thermostat
const schema = (h, entity) => {
  const modes = h?.states[entity]?.attributes.hvac_modes || Object.keys(MODE_NAMES);
  return [
    {name: 'entity', required: true, selector: {entity: {domain: 'climate'}}},
    {type: 'grid', name: '', schema: [{name: 'name', selector: {text: {}}}, {name: 'icon', selector: {icon: {}}, context: {icon_entity: 'entity'}}]},
    {name: 'sensor', selector: {entity: {domain: 'sensor', device_class: 'temperature'}}},
    {name: 'windows', selector: {entity: {multiple: true, domain: 'binary_sensor'}}},
    {type: 'grid', name: '', schema: [{name: 'show_graph', selector: {boolean: {}}}, {name: 'graph_hours', selector: {number: {min: 1, max: 168, mode: 'box', unit_of_measurement: 'h'}}}]},
    {type: 'grid', name: '', schema: [{name: 'show_modes', selector: {boolean: {}}}, {name: 'show_presets', selector: {boolean: {}}}]},
    {name: 'compact', selector: {boolean: {}}},
    {name: 'modes', selector: {select: {multiple: true, options: modes.map(m => ({value: m, label: MODE_NAMES[m] || m}))}}},
    {type: 'grid', name: '', schema: [{name: 'step', selector: {number: {min: 0.1, max: 5, step: 0.1, mode: 'box', unit_of_measurement: '°'}}}, {name: 'humidity', selector: {entity: {domain: 'sensor', device_class: 'humidity'}}}]},
    {name: 'tap_action', selector: {ui_action: {}}},
  ];
};
const EDITOR_DEFAULTS = {show_graph: true, graph_hours: 24, show_modes: true, show_presets: false, compact: true};

class NovaThermostatCardEditor extends NovaEditorBase {
  static labels = {
    entity: 'Thermostat', name: 'Name', icon: 'Icon', sensor: 'Raumsensor (optional, genauer als Thermostat)', windows: 'Fenster & Türen',
    show_graph: 'Verlauf anzeigen', graph_hours: 'Verlauf (Stunden)', show_modes: 'Modi anzeigen', show_presets: 'Presets anzeigen',
    compact: 'Kompakt', modes: 'Nur diese Modi (leer = alle)', step: 'Schrittweite', humidity: 'Luftfeuchte-Sensor', tap_action: 'Aktion beim Antippen des Kopfes',
  };
  static helpers = {
    sensor: 'Für Anzeige und Verlauf. Ohne: Ist-Temperatur des Thermostats',
    step: 'Leer = Wert vom Thermostat (meist 0,5°)',
  };
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${EDITOR_CSS}${MAPROW_CSS}</style><div class="wrap"></div>`;
    const s = schema(this._hass, this._config.entity), keys = names(s);
    r.querySelector('.wrap').append(this._form(s, {...EDITOR_DEFAULTS, ...this._config}, v => {
      const prev = this._config.entity, c = merge(this._config, keys, v);
      Object.entries(EDITOR_DEFAULTS).forEach(([k, x]) => c[k] === x && delete c[k]);
      this._emit(c);
      // Anderes Thermostat → Modi-Liste neu aufbauen
      if (c.entity !== prev) this._rebuild();
    }));
  }
}
define('thermostat-card-editor', NovaThermostatCardEditor);

/* ---------- Nova Thermostat Card ---------- */
const THERMO_CSS = `
.th{padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.th.warn{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-warn) 60%,transparent)}
.hd{display:flex;align-items:center;gap:10px;cursor:pointer}
.ic{width:38px;height:38px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);transition:all .3s}
.ic.on{background:var(--nv-accent);color:var(--nv-accent-fg);box-shadow:0 0 14px color-mix(in srgb,var(--nv-accent) 50%,transparent)}
.ic.cool{background:var(--nv-active);color:var(--nv-active-fg)}
.nm{flex:1;min-width:0}.nm b{display:block;font-size:14px;font-weight:600;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nm small{display:block;font-size:12px;opacity:.65}
.w{display:none;--mdc-icon-size:18px;color:var(--nv-warn)}.th.warn .w{display:flex}
.main{display:flex;align-items:center;gap:10px}
.cur{font-size:40px;font-weight:300;line-height:1;letter-spacing:-1px}
.hum{font-size:12px;opacity:.65;margin-top:4px}
.stp{display:flex;align-items:center;gap:8px;margin-left:auto;background:rgba(0,0,0,.25);border-radius:999px;padding:5px;font-weight:600;font-size:16px}
.stp span{min-width:52px;text-align:center}
.sb{width:38px;height:38px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);cursor:pointer;user-select:none;-webkit-tap-highlight-color:transparent;touch-action:manipulation}
.sb:active{transform:scale(.9)}.sb ha-icon{--mdc-icon-size:18px}
.stp.pend span{color:var(--nv-accent)}
.spk{width:100%;height:56px;display:block}
.pills{display:flex;flex-wrap:wrap;gap:7px}
.pill{padding:7px 12px;border-radius:999px;background:var(--nv-chip);font-size:12.5px;cursor:pointer;display:inline-flex;gap:6px;align-items:center;border:1px solid rgba(255,255,255,.08);white-space:nowrap;-webkit-tap-highlight-color:transparent}
.pill:active{transform:scale(.94)}.pill ha-icon{--mdc-icon-size:16px}
.pill.on{background:var(--nv-accent);color:var(--nv-accent-fg)}.pill.on.off{background:var(--nv-active);color:var(--nv-active-fg)}
.na{opacity:.4;pointer-events:none}`;
// Kompakt (Standard): kleiner, Modi oben, Verlauf unten
const COMPACT_CSS = `:host{container-type:inline-size}
.th{padding:10px 12px;gap:6px;min-width:0}.ic{width:30px;height:30px}.ic ha-icon{--mdc-icon-size:17px}.nm b{font-size:13px}.nm small{font-size:11px}
.cur{font-size:28px;white-space:nowrap}.hum{font-size:11px;margin-top:2px;white-space:nowrap}
.main{flex-wrap:wrap;row-gap:6px;min-width:0}
.stp{padding:3px;gap:6px;font-size:14px;flex:none}.stp span{min-width:44px}
.sb{width:30px;height:30px}.sb ha-icon{--mdc-icon-size:15px}.spk{height:32px}
.pills{gap:5px}.pill{padding:4px 9px;font-size:11.5px}.pill ha-icon{--mdc-icon-size:14px}
.hd{order:0}.modes{order:1}.presets{order:2}.main{order:3}.graph{order:4}
@container (max-width:260px){.th{padding:8px 10px}.cur{font-size:24px}.stp{gap:3px;font-size:13px}.stp span{min-width:38px}.sb{width:26px;height:26px}.pill{padding:3px 7px;font-size:11px}.hum{display:none}}`;

function normalize(c) {
  if (!c || !c.entity) throw new Error('entity (Thermostat) fehlt');
  return {show_graph: true, graph_hours: 24, show_modes: true, show_presets: false, ...c, windows: [].concat(c.windows || []).filter(Boolean)};
}

class NovaThermostatCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag(`${TAG}-editor`)); }
  static getStubConfig(h) { return {entity: Object.keys(h.states).find(id => id.startsWith('climate.')) || 'climate.wohnzimmer'}; }
  setConfig(c) {
    this._c = normalize(c);
    this._built = false;
    this._pend = null;
    if (this._h) { this._build(); this._update(); }
  }
  set hass(h) {
    this._h = h;
    if (!this._built) this._build();
    this._update();
  }
  getCardSize() { return 4; }
  getGridOptions() { return {columns: 9, rows: 'auto', min_columns: 6}; }
  _build() {
    if (!this._c) return;
    this._built = true;
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${CARD_CSS}${THERMO_CSS}${this._c.compact === false ? '' : COMPACT_CSS}</style>
<div class="g th">
  <div class="hd"><div class="ic"><ha-icon></ha-icon></div><div class="nm"><b></b><small></small></div><ha-icon class="w" icon="mdi:window-open-variant"></ha-icon></div>
  <div class="main"><div><div class="cur">–</div><div class="hum"></div></div>
    <div class="stp"><div class="sb" data-v="-1"><ha-icon icon="mdi:minus"></ha-icon></div><span>–</span><div class="sb" data-v="1"><ha-icon icon="mdi:plus"></ha-icon></div></div></div>
  <div class="graph"></div>
  <div class="pills modes"></div>
  <div class="pills presets"></div>
</div>`;
    const q = s => r.querySelector(s);
    this._e = {card: q('.th'), ic: q('.ic'), icon: q('.ic ha-icon'), name: q('.nm b'), sub: q('.nm small'), cur: q('.cur'), hum: q('.hum'),
      stp: q('.stp'), tgt: q('.stp span'), graph: q('.graph'), modes: q('.modes'), presets: q('.presets')};
    this._sig = {};
    q('.hd').addEventListener('click', () => {
      const a = this._c.tap_action;
      if (a?.action && a.action !== 'default') return hassAction(this, {entity: this._c.entity, tap_action: a}, 'tap');
      moreInfo(this, this._c.entity);
    });
    r.querySelectorAll('.sb').forEach(b => b.addEventListener('pointerup', e => { e.preventDefault(); this._step(+b.dataset.v); }));
    q('.modes').addEventListener('click', e => {
      const m = e.composedPath().find(x => x.dataset?.m)?.dataset.m;
      if (m) this._h.callService('climate', 'set_hvac_mode', {entity_id: this._c.entity, hvac_mode: m});
    });
    q('.presets').addEventListener('click', e => {
      const p = e.composedPath().find(x => x.dataset?.p)?.dataset.p;
      if (p) this._h.callService('climate', 'set_preset_mode', {entity_id: this._c.entity, preset_mode: p});
    });
  }
  _stepSize(a) { return this._c.step || a.target_temp_step || 0.5; }
  // ± sammelt Klicks und sendet erst nach kurzer Pause (debounce)
  _step(dir) {
    const s = this._h.states[this._c.entity];
    if (!s) return;
    const a = s.attributes, st = this._stepSize(a), from = this._pend ?? (parseFloat(a.temperature) || 20);
    const t = Math.min(a.max_temp ?? 35, Math.max(a.min_temp ?? 5, Math.round((from + dir * st) / st) * st));
    this._pend = t;
    this._e.tgt.textContent = `${t.toFixed(1)}°`;
    this._e.stp.classList.add('pend');
    clearTimeout(this._tm);
    this._tm = setTimeout(() => {
      this._h.callService('climate', 'set_temperature', {entity_id: this._c.entity, temperature: t})
        .catch(e => console.warn('[nova-cards] Temperatur setzen fehlgeschlagen', e))
        .finally(() => setTimeout(() => { this._pend = null; this._e.stp.classList.remove('pend'); this._update(); }, 1500));
    }, this._c.debounce ?? 800);
  }
  _update() {
    if (!this._h || !this._e) return;
    const h = this._h, c = this._c, e = this._e, s = h.states[c.entity];
    e.card.classList.toggle('na', !s || s.state === 'unavailable');
    if (!s) { e.name.textContent = c.name || c.entity; e.sub.textContent = 'nicht gefunden'; return; }
    const a = s.attributes, act = a.hvac_action, heat = act === 'heating' || act === 'preheating', cool = act === 'cooling';
    e.ic.classList.toggle('on', heat);
    e.ic.classList.toggle('cool', cool);
    e.icon.setAttribute('icon', c.icon || (heat ? 'mdi:fire' : cool ? 'mdi:snowflake' : 'mdi:thermostat'));
    e.name.textContent = c.name || a.friendly_name || c.entity;
    e.sub.textContent = [MODE_NAMES[s.state] || s.state, act && act !== s.state ? ACTION_NAMES[act] || act : ''].filter(Boolean).join(' · ');
    e.card.classList.toggle('warn', c.windows.some(id => h.states[id]?.state === 'on'));

    // Ist-Temperatur: Raumsensor, sonst Thermostat
    const sensor = c.sensor && h.states[c.sensor];
    let cur = sensor ? parseFloat(sensor.state) : NaN;
    if (isNaN(cur)) cur = parseFloat(a.current_temperature);
    e.cur.textContent = isNaN(cur) ? '–' : `${cur.toFixed(1)}°`;
    const hum = c.humidity ? parseFloat(h.states[c.humidity]?.state) : parseFloat(a.current_humidity);
    e.hum.textContent = isNaN(hum) ? '' : `${Math.round(hum)} % Luftfeuchte`;

    // Stepper aus, wenn das Thermostat aus ist bzw. keine Solltemperatur hat
    const noTarget = s.state === 'off' || a.temperature == null;
    e.stp.style.display = noTarget && this._pend == null ? 'none' : '';
    if (this._pend == null) e.tgt.textContent = a.temperature != null ? `${Number(a.temperature).toFixed(1)}°` : '–';

    if (c.show_graph) {
      const id = c.sensor || c.graph_entity, pts = id ? history(h, id, c.graph_hours, () => this._update()) : null;
      const sig = pts ? `${pts.length}|${pts[pts.length - 1]?.[1]}` : '';
      if (this._sig.g !== sig) { this._sig.g = sig; e.graph.innerHTML = pts ? sparkline(pts) : ''; }
    } else e.graph.innerHTML = '';

    // Pillen nur neu zeichnen, wenn sich etwas geändert hat
    const modes = (c.show_modes ? (c.modes?.length ? c.modes.filter(m => (a.hvac_modes || []).includes(m)) : a.hvac_modes || []) : [])
      .map(m => `<div class="pill ${s.state === m ? 'on' : ''} ${m === 'off' ? 'off' : ''}" data-m="${esc(m)}"><ha-icon icon="${MODE_ICONS[m] || 'mdi:thermostat'}"></ha-icon>${esc((c.mode_names || {})[m] || MODE_NAMES[m] || m)}</div>`).join('');
    if (this._sig.m !== modes) { this._sig.m = modes; e.modes.innerHTML = modes; }
    const presets = (c.show_presets ? a.preset_modes || [] : [])
      .map(p => `<div class="pill ${a.preset_mode === p ? 'on' : ''}" data-p="${esc(p)}">${esc(p)}</div>`).join('');
    if (this._sig.p !== presets) { this._sig.p = presets; e.presets.innerHTML = presets; }
  }
}
define(TAG, NovaThermostatCard, {name: 'Nova Thermostat Card', description: 'Thermostat mit Ist-/Solltemperatur, ± Stepper, Verlauf und Modi.', documentationURL: docUrl('nova-thermostat-card')});
