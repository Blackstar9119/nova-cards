// Minimaler Ersatz für <ha-icon>/<ha-svg-icon> (Home Assistant fehlt in der Vorschau): mdi:name → Pfad aus @mdi/js
import * as mdi from '@mdi/js';
const camel = n => 'mdi' + n.replace(/(^|-)(\w)/g, (_, __, c) => c.toUpperCase());
class HaIcon extends HTMLElement {
  static get observedAttributes() { return ['icon']; }
  connectedCallback() { this._r(); }
  attributeChangedCallback() { this._r(); }
  set icon(v) { this.setAttribute('icon', v); }
  _r() {
    const n = (this.getAttribute('icon') || '').replace(/^mdi:/, '');
    const d = mdi[camel(n)] || '';
    this.style.cssText = 'display:inline-flex;width:24px;height:24px;vertical-align:middle;fill:currentColor';
    this.innerHTML = `<svg viewBox="0 0 24 24" width="100%" height="100%" style="fill:currentColor"><path d="${d}"/></svg>`;
  }
}
if (!customElements.get('ha-icon')) customElements.define('ha-icon', HaIcon);
