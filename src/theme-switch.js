import {define, docUrl, tag} from './shared/define.js';
import {NOVA_VARS, PANEL_CSS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {NOVA_CHIPS_CSS} from './shared/chips.js';
import {hassChanged} from './shared/lifecycle.js';
import {press} from './shared/long-press.js';
import {esc, setIcon} from './shared/utils.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {sel, g2, T, I} from './shared/editor-schema.js';
import {THEMES, THEME_KEYS} from './shared/theme.js';
import {readTheme, setTheme, hasStore, canSetup, storeIds, THEME_EVENT} from './shared/theme-store.js';

/* ---------- Nova Themes Schalter ----------
   Wählt das Nova-Theme für alle Geräte (Speicher: theme-store.js). Darstellung: Chip (wie die Chips Card),
   Button (Antippen schaltet weiter) oder Dropdown. Den Speicher legt die Karte beim ersten Umschalten selbst an. */
const DEF = {display: 'button', name: 'Theme', icon: 'mdi:palette-outline'};
const MSG = {admin: 'Einmal als Admin umschalten', failed: 'Hat nicht geklappt'};
const CSS = `${NOVA_VARS}${PANEL_CSS}${NOVA_CHIPS_CSS}
:host([data-display=chip]){height:auto}:host([data-display=chip])::before{display:none}
.g.ts{flex-direction:row;align-items:center;justify-content:center}
.ts .hd{flex:1;min-width:0}
.ts .go{flex:none;opacity:.6}
.ts select{flex:none;max-width:55%;height:36px;box-sizing:border-box;padding:0 var(--nv-s7) 0 var(--nv-s6);border-radius:var(--nv-r-pill);
border:1px solid var(--nv-box-border);background:var(--nv-chip);color:var(--nv-fg);font:inherit;font-size:var(--nv-fs-6);cursor:pointer;outline:none}
.ts select:focus-visible{box-shadow:var(--nv-focus)}
.ts option{background:var(--nv-popup-base);color:var(--nv-fg)}
.ts.busy .ic,.nchip.busy{opacity:.6}
.nchips{display:flex}`;

class NovaThemeSwitchCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('theme-card-editor')); }
  static getStubConfig() { return {display: 'button'}; }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    if (c.display && !['chip', 'button', 'dropdown'].includes(c.display)) throw new Error('display: chip, button oder dropdown');
    this._c = {...DEF, ...c};
    this.dataset.display = this._c.display;
    this._built = false;
    if (this._h) this._render();
  }
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (this._c && (!this._built || hassChanged(old, h, storeIds()))) this._render();
  }
  getCardSize() { return 1; }
  getGridOptions() { return this._c?.display === 'chip' ? {columns: 3, rows: 'auto'} : {columns: 6, rows: 1, min_rows: 1}; }

  _cur() { return this._want || readTheme(this._h) || 'blau'; }
  _next() { const i = THEME_KEYS.indexOf(this._cur()); return THEME_KEYS[(i + 1) % THEME_KEYS.length]; }
  async _pick(k) {
    if (!k || k === this._cur() || this._busy) return;
    this._want = k; this._busy = true; this._msg = ''; this._render();
    try { await setTheme(this._h, k); }
    catch (e) {
      this._msg = MSG[e.code] || MSG.failed;
      console.warn('[nova-cards] Theme', e);
      clearTimeout(this._mt); this._mt = setTimeout(() => { this._msg = ''; this._render(); }, 5000);
    }
    this._want = null; this._busy = false; this._render();
  }
  connectedCallback() { window.addEventListener(THEME_EVENT, this._onStore ||= () => this._c && this._h && this._render()); }
  disconnectedCallback() { clearTimeout(this._mt); window.removeEventListener(THEME_EVENT, this._onStore); }

  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'}), c = this._c;
    const nm = `<div class="nm"><b>${esc(c.name)}</b><small></small></div>`;
    r.innerHTML = `<style>${CSS}</style>${c.display === 'chip'
      ? `<div class="nchips"><div class="nchip"><span class="ci"></span><span class="cn">${esc(c.name)}</span><span class="cv"></span></div></div>`
      : `<div class="g ts"><div class="hd"><div class="ic"></div>${nm}</div>${c.display === 'dropdown'
        ? `<select aria-label="${esc(c.name)}">${THEME_KEYS.map(k => `<option value="${k}">${esc(THEMES[k].name)}</option>`).join('')}</select>`
        : '<ha-icon class="go" icon="mdi:chevron-right"></ha-icon>'}</div>`}`;
    const hit = r.querySelector(c.display === 'chip' ? '.nchip' : '.g');
    if (c.display === 'dropdown') r.querySelector('select').addEventListener('change', e => this._pick(e.target.value));
    else press(hit, {tap: () => this._pick(this._next())});
    if (c.display === 'chip') hit.setAttribute('aria-label', `${c.name}: weiterschalten`);
    setIcon(r.querySelector(c.display === 'chip' ? '.ci' : '.ic'), c.icon);
    this._built = true;
  }
  _render() {
    if (!this._built) this._build();
    const r = this.shadowRoot, k = this._cur(), name = THEMES[k].name;
    // Ohne Speicher sieht ein Nicht-Admin gleich, dass erst ein Admin einmal umschalten muss
    const msg = this._msg || (this._h && !hasStore(this._h) && !canSetup(this._h) ? MSG.admin : '');
    const txt = msg || name;
    const v = r.querySelector('.cv, small');
    if (v.textContent !== txt) v.textContent = txt;
    const s = r.querySelector('select');
    if (s && s.value !== k) s.value = k;
    r.querySelector('.nchip, .g').classList.toggle('busy', !!this._busy);
  }
}
define('theme-card', NovaThemeSwitchCard, {name: 'Nova Themes Schalter', description: 'Wählt das Nova-Theme (Blau, Hell …) für alle Nova Cards auf allen Geräten – als Chip, Button oder Dropdown. Richtet sich beim ersten Umschalten selbst ein.', documentationURL: docUrl('nova-themes-schalter')});

/* ---------- Editor ---------- */
const S_GEN = [
  sel('display', [['button', 'Button (Antippen schaltet weiter)'], ['chip', 'Chip (wie die Chips Card)'], ['dropdown', 'Dropdown (Liste)']]),
  g2({name: 'name', selector: T}, {name: 'icon', selector: I}),
];
const LABELS = {display: 'Darstellung', name: 'Beschriftung', icon: 'Icon'};

class NovaThemeSwitchCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static openSections = ['general'];
  static noTheme = true; // der Schalter zeigt immer das globale Theme
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    r.querySelector('.wrap').append(
      this._section('general', 'mdi:cog-outline', 'Allgemein', b => {
        b.append(this._hint('Gilt für alle Nova Cards auf allen Geräten. Beim ersten Umschalten legt die Karte dafür selbst einen Helfer „Nova Theme“ an – das darf in Home Assistant nur ein Administrator, danach können alle umschalten.'));
        b.append(this._form(S_GEN, {...DEF, ...this._config}, v => {
          const c = merge(this._config, names(S_GEN), v);
          Object.entries(DEF).forEach(([k, x]) => { if (c[k] === x) delete c[k]; });
          this._emit(c);
        }));
      }));
  }
}
define('theme-card-editor', NovaThemeSwitchCardEditor);
