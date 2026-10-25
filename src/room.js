import {define, docUrl, tag} from './shared/define.js';
import {esc, dom, setIcon} from './shared/utils.js';
import {isOn, fmtState, areaOf} from './shared/state.js';
import {moreInfo, hassAction} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {CARD_CSS, SECTION_EDITOR_CSS, MAPROW_CSS} from './shared/styles.js';
import {hassChanged, entityIds} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {cleanHash, togglePopup, popupOptions} from './shared/popup-hub.js';

/* ---------- Editor Raum Card ---------- */
const GEN = [{type: 'grid', name: '', schema: [{name: 'name', required: true, selector: {text: {}}}, {name: 'icon', selector: {icon: {}}}]}];
// Suffix/Runden nur mit Info-Entität, Fenster-Icon nur mit Fenstern
const VALUES = c => [
  {name: 'temperature', selector: {entity: {domain: ['sensor', 'climate']}}},
  {name: 'info', selector: {entity: {}}},
  ...(c.info ? [{type: 'grid', name: '', schema: [{name: 'info_suffix', selector: {text: {}}}, {name: 'info_round', selector: {boolean: {}}}]}] : []),
  {name: 'windows', selector: {entity: {multiple: true, domain: 'binary_sensor'}}},
  ...([].concat(c.windows || []).length ? [{name: 'window_icon', selector: {icon: {}}}] : []),
];
const LOOK = [{name: 'image', selector: {text: {}}}];
const ACTIONS = [
  {name: 'popup', selector: {select: {mode: 'dropdown', custom_value: true, options: []}}},
  {name: 'tap_action', selector: {ui_action: {}}},
];
const vis = c => `${!!c.info}|${!![].concat(c.windows || []).length}`;
const B_MAIN = [
  {name: 'entity', required: true, selector: {entity: {}}},
  {type: 'grid', name: '', schema: [{name: 'icon', selector: {icon: {}}, context: {icon_entity: 'entity'}}, {name: 'name', selector: {text: {}}}]},
];
const B_ACT = [{name: 'tap_action', selector: {ui_action: {}}}, {name: 'hold_action', selector: {ui_action: {}}}];
const B_ADV = [{name: 'state_entity', selector: {entity: {}}}, {name: 'icon_entity', selector: {entity: {}}}];
const ICON_MAP_ROW = [{type: 'grid', name: '', schema: [{name: 'state', selector: {text: {}}}, {name: 'value', selector: {text: {}}}]}];

class NovaRoomCardEditor extends NovaEditorBase {
  static labels = {
    name: 'Name', icon: 'Icon', temperature: 'Temperatur (Sensor oder Thermostat)', windows: 'Fenster & Türen',
    tap_action: 'Aktion beim Antippen', popup: 'Beim Antippen Nova Pop-up öffnen', hold_action: 'Aktion bei langem Drücken', info: 'Info-Entität (ersetzt Temperatur)',
    info_suffix: 'Info-Suffix', info_round: 'Info runden', image: 'Hintergrundbild (URL)', window_icon: 'Icon für offenes Fenster',
    entity: 'Entität', state_entity: 'Status-Entität', icon_entity: 'Icon-Entität', state: 'Zustand', value: 'Icon oder Bild-URL',
  };
  static helpers = {
    windows: 'Offenes Fenster = farbiger Rahmen + Icon',
    popup: 'Öffnet die gewählte Nova Pop-up Card (Liste = Pop-ups in diesem Dashboard). Hat Vorrang vor der Aktion beim Antippen.',
    state_entity: 'Optional: bestimmt An/Aus-Anzeige statt der Entität selbst (z. B. TV-Bildschirmstatus)',
    icon_entity: 'Optional: Icon wechselt je nach Zustand dieser Entität (z. B. aktuelle TV-App)',
    image: 'z. B. /local/raeume/wohnzimmer.jpg',
  };
  // icon_map je Button als bearbeitbare Zeilen (bleiben auch leer stehen)
  // Pop-ups des Dashboards für die Auswahlliste einmal laden
  set hass(h) {
    super.hass = h;
    if (h && !this._pops) { this._pops = []; popupOptions(h).then(o => { this._pops = o; this._rebuild(); }); }
  }
  _actions() {
    const opts = this._pops?.length ? this._pops : [{value: '', label: '– keins –'}];
    return ACTIONS.map(x => x.name === 'popup' ? {...x, selector: {select: {...x.selector.select, options: opts}}} : x);
  }
  _onExternalConfig() { this._maps = (this._config.buttons || []).map(b => Object.entries(b.icon_map || {})); }
  static openSections = ['general'];
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}${MAPROW_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap'), c0 = this._config;
    const form = schema => this._form(schema, c0, v => {
      const c = merge(this._config, names(schema), v);
      if (c.popup) c.popup = cleanHash(c.popup); if (!c.popup) delete c.popup;
      this._emit(c);
      // Info-Entität oder Fenster dazu/weg → abhängige Felder ein-/ausblenden
      if (vis(c) !== vis(c0)) this._rebuild();
    });
    w.append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => b.append(form(GEN))),
      this._section('values', 'mdi:thermometer', 'Anzeige', b => b.append(form(VALUES(c0)))),
      this._section('buttons', 'mdi:gesture-tap-button', 'Buttons', b => {
        (this._config.buttons || []).forEach((x, i) => b.append(this._button(x, i)));
        b.append(this._add('Button hinzufügen', () => {
          const buttons = [...(this._config.buttons || []), {}];
          this._maps.push([]);
          this._open.add(buttons.length - 1);
          this._emit({...this._config, buttons});
          this._rebuild();
        }));
      }),
      this._section('look', 'mdi:palette-outline', 'Aussehen', b => b.append(form(LOOK))),
      this._section('actions', 'mdi:gesture-tap', 'Aktionen', b => b.append(form(this._actions()))));
  }
  _label(b, i) {
    const s = b.entity ? this._hass?.states[b.entity] : null;
    return `${i + 1}. ${b.name || s?.attributes.friendly_name || b.entity || 'Neuer Button'}`;
  }
  _button(b, i) {
    const n = (this._config.buttons || []).length;
    const [d, s] = this._details(i, b.icon || 'mdi:gesture-tap-button', this._label(b, i), this._itemBtns(i, n, dir => this._move(i, dir), () => this._remove(i)), body => {
      const form = schema => this._form(schema, b, v => {
        const buttons = [...this._config.buttons], old = buttons[i];
        buttons[i] = merge(old, names(schema), v);
        this._emit({...this._config, buttons});
        s.querySelector('.lbl').textContent = this._label(buttons[i], i);
        // Icon-Entität dazu oder weg → Zeilen für icon_map ein-/ausblenden
        if (!!old.icon_entity !== !!buttons[i].icon_entity) this._rebuild();
      });
      body.append(form(B_MAIN), this._h4('Aktionen'), form(B_ACT), this._h4('Status und Icon'), form(B_ADV));
      if (b.icon_entity) body.append(this._mapEditor(i));
    });
    return d;
  }
  _mapEditor(i) {
    const box = document.createElement('div');
    box.innerHTML = '<p class="hint">Icon je Zustand der Icon-Entität. Wert: <code>mdi:…</code> oder Bild-URL (z. B. <code>/local/logos/netflix.svg</code>).</p>';
    const rows = this._maps[i] ||= [];
    rows.forEach(([state, value], j) => {
      const row = document.createElement('div');
      row.className = 'maprow';
      row.append(
        this._form(ICON_MAP_ROW, {state, value}, v => { rows[j] = [v.state ?? '', v.value ?? '']; this._writeMap(i); }),
        this._btn('mdi:close', 'Entfernen', () => { rows.splice(j, 1); this._writeMap(i); this._rebuild(); }));
      box.append(row);
    });
    box.append(this._add('Zustand hinzufügen', () => { rows.push(['', '']); this._rebuild(); }));
    return box;
  }
  _writeMap(i) {
    const map = Object.fromEntries(this._maps[i].filter(([k, v]) => k && v)), buttons = [...this._config.buttons], b = {...buttons[i]};
    if (Object.keys(map).length) b.icon_map = map; else delete b.icon_map;
    buttons[i] = b;
    this._emit({...this._config, buttons});
  }
  _move(i, dir) {
    const j = i + dir, buttons = [...this._config.buttons];
    [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
    [this._maps[i], this._maps[j]] = [this._maps[j], this._maps[i]];
    this._open = new Set([j]);
    this._emit({...this._config, buttons});
    this._rebuild();
  }
  _remove(i) {
    const buttons = this._config.buttons.filter((_, k) => k !== i);
    this._maps.splice(i, 1);
    this._open = new Set();
    this._emit({...this._config, buttons});
    this._rebuild();
  }
}
define('room-card-editor', NovaRoomCardEditor);

/* ---------- Nova Raum Card ---------- */
const TAG = 'room-card';
const TOGGLE_DOMAINS = ['light', 'switch', 'input_boolean', 'fan', 'cover', 'group', 'siren', 'humidifier', 'automation'];
const PRESS_SERVICE = {scene: ['scene', 'turn_on'], script: ['script', 'turn_on'], button: ['button', 'press'], input_button: ['input_button', 'press']};
// Diese Domains haben keinen An-Zustand – Button leuchtet nie
const STATELESS = ['button', 'input_button', 'script', 'scene'];
const DOMAIN_ICONS = {light: 'mdi:lightbulb', switch: 'mdi:power-socket-eu', fan: 'mdi:fan', vacuum: 'mdi:robot-vacuum', input_boolean: 'mdi:toggle-switch-outline', media_player: 'mdi:speaker', button: 'mdi:gesture-tap-button', input_button: 'mdi:gesture-tap-button', script: 'mdi:script-text-outline', scene: 'mdi:palette', climate: 'mdi:thermostat', cover: 'mdi:window-shutter', lock: 'mdi:lock', sensor: 'mdi:eye'};

const ROOM_CSS = `
.room{display:flex;flex-direction:column;justify-content:space-between;padding:14px 16px;min-height:var(--nova-room-min-height,168px);transition:box-shadow .4s}
.room.click{cursor:pointer}
.bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.45;filter:grayscale(.7);transition:opacity .5s,filter .5s}
.bgi{position:absolute;right:-14px;top:4px;--mdc-icon-size:130px;opacity:.07;transition:opacity .5s,color .5s}
.room.lit .bgi{opacity:.18;color:var(--nv-accent)}.room.lit .bg{opacity:.85;filter:none}
.room.lit{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-accent) 40%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.room.warn{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-warn) 60%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.head{display:flex;align-items:center;gap:2px;position:relative;font-weight:600;font-size:15px;text-shadow:0 1px 4px rgba(0,0,0,.4)}
.head .chev{--mdc-icon-size:18px;opacity:.6}
.t{margin-left:auto;font-weight:500;font-size:13px;opacity:.85;display:flex;gap:8px;align-items:center}
.w{display:none;--mdc-icon-size:16px;color:var(--nv-warn)}.room.warn .w{display:flex}
.btns{display:flex;gap:9px;flex-wrap:wrap;position:relative}
.b{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);border:1px solid rgba(255,255,255,.1);transition:background-color .25s,color .25s,border-color .25s,box-shadow .25s,transform .25s,opacity .25s;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}
.b:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
.b:active{transform:scale(.9)}
.b img{width:24px;height:24px;object-fit:contain}
.b.on{background:var(--nv-accent);color:var(--nv-accent-fg);border-color:transparent;box-shadow:0 0 16px color-mix(in srgb,var(--nv-accent) 55%,transparent)}
.b.on.alt{background:var(--nv-active);color:var(--nv-active-fg);box-shadow:0 0 16px color-mix(in srgb,var(--nv-active) 55%,transparent)}
.b.na{opacity:.3}`;

function normalize(c) {
  if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
  const cfg = {glow_domains: ['light', 'switch'], temperature_decimals: 1, ...c};
  // Alte Schreibweisen: navigation_path bzw. action: more-info
  if (!cfg.tap_action && cfg.navigation_path) cfg.tap_action = {action: 'navigate', navigation_path: cfg.navigation_path};
  cfg.windows = [].concat(cfg.windows || []).filter(Boolean);
  cfg.buttons = (cfg.buttons || []).filter(b => b && b.entity).map(b => {
    const o = {...b};
    if (!o.tap_action && o.action === 'more-info') o.tap_action = {action: 'more-info'};
    return o;
  });
  return cfg;
}

class NovaRoomCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag(`${TAG}-editor`)); }
  // Erster Bereich mit Lampen: bis zu 4 Lampen + Temperatursensor
  static getStubConfig(h) {
    const ids = Object.keys(h.states);
    for (const area of Object.values(h.areas || {})) {
      const lights = ids.filter(id => id.startsWith('light.') && areaOf(h, id) === area.area_id).slice(0, 4);
      if (!lights.length) continue;
      const temp = ids.find(id => id.startsWith('sensor.') && areaOf(h, id) === area.area_id && h.states[id].attributes.device_class === 'temperature');
      return {name: area.name, icon: area.icon || 'mdi:home', ...(temp ? {temperature: temp} : {}), buttons: lights.map(entity => ({entity}))};
    }
    return {name: 'Wohnzimmer', icon: 'mdi:sofa', buttons: []};
  }
  setConfig(c) {
    this._c = normalize(c);
    this._ids = entityIds(this._c);
    this._built = false;
    if (this._h) { this._build(); this._update(); }
  }
  // Neu zeichnen nur, wenn sich eine Entität der Karte geändert hat
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (this._hp) this._hp.hass = h;
    if (!this._built) this._build();
    else if (!hassChanged(old, h, this._ids)) return;
    this._update();
  }
  getCardSize() { return 3; }
  getGridOptions() { return {columns: 12, rows: 3, min_rows: 2, min_columns: 6}; }
  _build() {
    if (!this._c) return;
    this._built = true;
    const c = this._c, r = this.shadowRoot || this.attachShadow({mode: 'open'}), tap = c.popup ? 'popup' : c.tap_action?.action;
    r.innerHTML = `<style>${CARD_CSS}${ROOM_CSS}</style>
<div class="g room ${tap && tap !== 'none' ? 'click' : ''}">
  ${c.image ? `<div class="bg" style="background-image:url('${esc(c.image)}')"></div>` : ''}
  <ha-icon class="bgi" icon="${esc(c.icon || 'mdi:home')}"></ha-icon>
  <div class="head"><span>${esc(c.name || '')}</span>${tap === 'navigate' ? '<ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>' : ''}
    <span class="t"><ha-icon class="w" icon="${esc(c.window_icon || 'mdi:window-open-variant')}"></ha-icon><span class="tv"></span></span></div>
  <div class="btns"></div>
</div>`;
    this._room = r.querySelector('.room');
    if (this._hp) r.appendChild(this._hp);
    this._tv = r.querySelector('.tv');
    const box = r.querySelector('.btns');
    this._room.addEventListener('click', () => {
      if (!tap || tap === 'none') return;
      if (c.popup) return togglePopup(this, this._h, cleanHash(c.popup));
      hassAction(this, {entity: c.temperature || c.info, tap_action: c.tap_action}, 'tap');
    });
    this._btns = c.buttons.map(b => {
      const el = document.createElement('div');
      el.className = 'b';
      // isolate: Antippen eines Buttons löst nicht zusätzlich die Aktion der Raumkachel aus
      press(el, {tap: () => this._tap(b), hold: () => this._hold(b), isolate: true});
      box.appendChild(el);
      return [el, b];
    });
  }
  _tap(b) {
    const a = b.tap_action;
    if (a && a.action && a.action !== 'default') return hassAction(this, {entity: b.entity, tap_action: a}, 'tap');
    const h = this._h, d = dom(b.entity), data = {entity_id: b.entity};
    if (PRESS_SERVICE[d]) return h.callService(...PRESS_SERVICE[d], data);
    if (d === 'media_player') return h.callService('media_player', 'toggle', data);
    if (TOGGLE_DOMAINS.includes(d)) return h.callService('homeassistant', 'toggle', data);
    moreInfo(this, b.entity);
  }
  _hold(b) {
    if (b.hold_action?.action) return hassAction(this, {entity: b.entity, hold_action: b.hold_action}, 'hold');
    moreInfo(this, b.entity);
  }
  _icon(b) {
    const h = this._h;
    if (b.icon_entity && b.icon_map) {
      const s = h.states[b.icon_entity], ic = s && b.icon_map[s.state];
      if (ic) return ic;
    }
    return b.icon || h.states[b.entity]?.attributes.icon || DOMAIN_ICONS[dom(b.entity)] || 'mdi:power';
  }
  // Text oben rechts: Info-Entität oder Temperatur
  _info() {
    const h = this._h, c = this._c;
    if (c.info) {
      const s = h.states[c.info];
      if (!s) return '';
      const n = parseFloat(s.state);
      return (c.info_round && !isNaN(n) ? Math.round(n) : fmtState(h, s)) + (c.info_suffix || '');
    }
    const t = c.temperature && h.states[c.temperature], v = t ? t.attributes.current_temperature ?? t.state : null;
    return v !== null && !isNaN(parseFloat(v)) ? `${parseFloat(v).toFixed(c.temperature_decimals)}°` : '';
  }
  _update() {
    if (!this._h || !this._btns) return;
    const h = this._h, c = this._c;
    this._tv.textContent = this._info();
    this._room.classList.toggle('warn', c.windows.some(id => h.states[id]?.state === 'on'));
    let lit = false;
    for (const [el, b] of this._btns) {
      const s = h.states[b.entity], d = dom(b.entity);
      const on = b.state_entity ? isOn(h.states[b.state_entity]) : isOn(s), glow = c.glow_domains.includes(d);
      el.classList.toggle('na', !s || s.state === 'unavailable');
      el.classList.toggle('on', on && !STATELESS.includes(d));
      // Leuchtende Domains (Licht, Steckdose) in Akzentfarbe und lassen den Raum leuchten, sonst blau
      el.classList.toggle('alt', !glow);
      if (on && glow) lit = true;
      setIcon(el, this._icon(b));
      el.title = b.name || s?.attributes.friendly_name || b.entity;
    }
    this._room.classList.toggle('lit', lit);
  }
}
define(TAG, NovaRoomCard, {name: 'Nova Raum Card', description: 'Raumkachel mit Temperatur, Fenster-Warnung und frei belegbaren Buttons.', documentationURL: docUrl('nova-raum-card')});
