import {dom} from './utils.js';
import {PRESS, TOGGLE} from './state.js';

export const fire = (el, type, detail) => el.dispatchEvent(new CustomEvent(type, {detail, bubbles: true, composed: true}));
export const moreInfo = (el, entityId) => fire(el, 'hass-more-info', {entityId});
export const hassAction = (el, config, action) => fire(el, 'hass-action', {config, action});
export const navigate = p => { history.pushState(null, '', p); window.dispatchEvent(new CustomEvent('location-changed', {detail: {replace: false}})); };

// tap_action/hold_action eines Eintrags ausführen. info = Standard ist more-info statt Schalten
export function runAction(card, o, kind, info) {
  const a = o[`${kind}_action`], id = o.entity;
  if (a?.action === 'none') return;
  const custom = a?.action && a.action !== 'default';
  const d = dom(id), canRun = !!(PRESS[d] || TOGGLE.includes(d));
  if (kind === 'tap' && o.confirm && (custom || (!info && canRun)) && !window.confirm(o.confirm)) return;
  if (custom) return hassAction(card, {entity: id, [`${kind}_action`]: a}, kind);
  if (!id) return;
  if (kind === 'hold' || info || !canRun) return moreInfo(card, id);
  if (PRESS[d]) return card._h.callService(...PRESS[d], {entity_id: id});
  card._h.callService('homeassistant', 'toggle', {entity_id: id});
}
