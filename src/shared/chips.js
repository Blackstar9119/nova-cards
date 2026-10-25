// Nova Chips – frei belegbare Wert- und Knopf-Chips, gemeinsam für die Chips Card und später weitere Karten (z. B. Pop-up).
// Konfig je Chip:
//   type: value  → zeigt den Zustand von entity; Antippen = tap_action, sonst Details
//   type: button → führt tap_action aus oder die Schnellauswahl preset (z. B. lights_off = alle Lichter der Area aus)
//   name, icon, color (Farbrolle), state = nur anzeigen, wenn entity diesen Zustand hat
import {setIcon, list} from './utils.js';
import {iconOf, valueOf} from './state.js';
import {moreInfo, hassAction} from './actions.js';
import {roleVars} from './styles.js';
import {g2, T, A, ENT, sel, ROLE, NAMEICON} from './editor-schema.js';

export const CHIP_TYPES = [['value', 'Wert (zeigt den Zustand)'], ['button', 'Knopf (führt eine Aktion aus)']];
// Schnellauswahl für Knopf-Chips; need = was die Karte dafür liefern muss
export const CHIP_PRESETS = {
  lights_off: {label: 'Alle Lichter im Raum aus', icon: 'mdi:lightbulb-off-outline', need: 'area',
    run: (card, ctx) => card._h.callService('light', 'turn_off', {}, {area_id: ctx.area})},
};

// Chips normalisieren: Kurzform „- sensor.x“, Standardtyp value, ungültige raus
export const normChips = arr => [].concat(arr || []).map(x => typeof x === 'string' ? {entity: x} : x)
  .filter(x => x && typeof x === 'object').map(x => ({type: 'value', ...x}))
  .filter(x => x.type === 'button' ? (CHIP_PRESETS[x.preset] || x.tap_action?.action) : x.entity);

export const NOVA_CHIPS_CSS = `
.nchips{display:flex;flex-wrap:wrap;gap:7px;min-width:0}.nchips:empty{display:none}
.nchips.scroll{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.nchips.scroll::-webkit-scrollbar{display:none}
.nchip{display:inline-flex;align-items:center;gap:6px;min-height:34px;box-sizing:border-box;padding:0 12px;border-radius:999px;flex:none;
background:var(--c,var(--nv-chip));color:var(--cf,inherit);border:1px solid var(--nv-box-border);font-size:12.5px;white-space:nowrap;
cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent;user-select:none;transition:background-color .2s,color .2s,transform .2s,opacity .2s}
.nchip.col{border-color:transparent}
.nchip ha-icon{--mdc-icon-size:16px;display:flex}.nchip img{width:16px;height:16px}
.nchip .ci:empty,.nchip .cn:empty,.nchip .cv:empty{display:none}
.nchip .cn:not(:empty)+.cv:not(:empty)::before{content:'· '}
.nchip:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}.nchip:active{transform:scale(.95)}
.nchip.na{opacity:.45}.nchip[hidden]{display:none}`;

// Chips in box anzeigen. ctx = Angaben der Karte für die Schnellauswahl (z. B. {area}).
// Die Elemente werden nur neu angelegt, wenn sich die Einträge ändern; sonst nur Werte und Sichtbarkeit.
export function renderNovaChips(card, box, items, h, ctx = {}) {
  const key = JSON.stringify(items);
  if (box._key !== key) {
    box._key = key;
    box._els = items.map(o => {
      const d = document.createElement('div');
      d.className = 'nchip'; d.tabIndex = 0; d.setAttribute('role', 'button');
      d.innerHTML = '<span class="ci"></span><span class="cn"></span><span class="cv"></span>';
      if (o.color) { const v = roleVars(o.color); d.style.setProperty('--c', v.c); d.style.setProperty('--cf', v.fg); d.classList.add('col'); }
      const run = () => chipTap(card, o, ctx);
      d.addEventListener('click', e => { e.stopPropagation(); run(); });
      d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); run(); } });
      return d;
    });
    box.replaceChildren(...box._els);
  }
  items.forEach((o, i) => {
    const d = box._els[i], s = o.entity && h.states[o.entity], pre = CHIP_PRESETS[o.preset];
    d.hidden = !!o.state && o.state !== '' && !(s && list(o.state).includes(s.state));
    if (d.hidden) return;
    const val = o.type !== 'button';
    setIcon(d.querySelector('.ci'), o.icon || (val ? (o.entity ? iconOf(h, o, 'mdi:information-outline') : '') : pre?.icon || ''));
    d.querySelector('.cn').textContent = o.name ?? (val ? '' : pre?.label || '');
    d.querySelector('.cv').textContent = val ? (s ? valueOf(h, s, o) : 'Nicht gefunden') : '';
    d.classList.toggle('na', val && (!s || s.state === 'unavailable'));
    d.title = o.name || (val && s ? s.attributes.friendly_name || o.entity : pre?.label || '');
  });
}

function chipTap(card, o, ctx) {
  const pre = o.type === 'button' && CHIP_PRESETS[o.preset];
  if (pre) { if (!pre.need || ctx[pre.need]) pre.run(card, ctx); return; }
  if (o.tap_action?.action) return hassAction(card, {entity: o.entity, tap_action: o.tap_action}, 'tap');
  if (o.type !== 'button' && o.entity) moreInfo(card, o.entity);
}

/* ---------- Editor ---------- */
// Formular eines Chips, je nach Typ; ctx sagt, welche Schnellauswahl die Karte anbietet (z. B. {area: true})
export const chipSchema = (o, ctx = {}) => {
  const btn = o.type === 'button';
  const presets = Object.entries(CHIP_PRESETS).filter(([, p]) => !p.need || ctx[p.need]);
  return [
    sel('type', CHIP_TYPES),
    ...(btn ? [] : [ENT]),
    NAMEICON, ROLE('color'),
    ...(btn && presets.length ? [sel('preset', [['custom', 'Eigene Aktion'], ...presets.map(([k, p]) => [k, p.label])])] : []),
    ...(btn && CHIP_PRESETS[o.preset] ? [] : [{name: 'tap_action', selector: A}]),
    ...(btn ? [{name: 'entity', selector: {entity: {}}}] : []),
    {name: 'state', selector: T},
  ];
};
// Formularwerte mit Standards (preset custom = eigene Aktion über tap_action)
export const chipView = o => ({type: 'value', ...o, ...(o.type === 'button' ? {preset: o.preset || 'custom'} : {})});
export const CHIP_LABELS = {
  type: 'Art', entity: 'Entität', name: 'Name', icon: 'Icon', color: 'Farbe', preset: 'Aktion', tap_action: 'Aktion beim Antippen',
  state: 'Nur anzeigen bei Zustand',
};
export const CHIP_HELPERS = {
  color: 'Leer = neutral.',
  state: 'z. B. on, mehrere mit Komma. Leer = immer anzeigen. Bei Knöpfen bezieht es sich auf die gewählte Entität.',
  tap_action: 'Bei Wert-Chips: leer = Details öffnen.',
};
