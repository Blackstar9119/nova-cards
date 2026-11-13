/* Nova-Panel – Einstellungen der Nova-Integration in der Seitenleiste von Home Assistant.
   Wird NICHT in nova-cards.js gebaut, sondern mit „npm run panel“ zu panel/nova-panel.js. Diese Datei kommt in die
   Integration (custom_components/nova/static/nova-panel.js), die sie als Panel „Nova“ anmeldet (nur Admins).
   Optik wie die Karten: Tokens aus theme.js, das Panel zeigt sich im gewählten globalen Theme. Jede Änderung speichert
   sofort; das Abo nova/settings/subscribe hält die Seite auf allen Geräten aktuell. Das Mealie-Token kommt nie hierher,
   nur token_gesetzt. */
import {NOVA_VARS, THEMES, THEME_KEYS, TOKENS} from './shared/theme.js';
import {FIELD_CSS} from './shared/styles.js';
import {esc} from './shared/utils.js';

const VERSION = __VERSION__;
const DEFAULT = Object.fromEntries(TOKENS.map(([k, , v]) => [k, v]));
const tv = (t, k) => THEMES[t]?.vars[k] ?? DEFAULT[k];

const SIZES = [['klein', 'Klein'], ['normal', 'Normal'], ['gross', 'Groß']];
const SECTIONS = {
  allgemein: ['mdi:tune-variant', 'Allgemein'],
  module: ['mdi:puzzle-outline', 'Module'],
  einkauf: ['mdi:cart-outline', 'Einkauf'],
  notizen: ['mdi:note-multiple-outline', 'Notizen'],
  rezepte: ['mdi:chef-hat', 'Rezepte'],
  mealie: ['mdi:silverware-fork-knife', 'Mealie'],
};
const MODULES = [
  ['theme', 'mdi:palette-outline', 'Theme', 'Globales Theme für alle Geräte'],
  ['notes', 'mdi:note-multiple-outline', 'Notizen', 'Nova Notiz'],
  ['shopping', 'mdi:cart-outline', 'Einkauf', 'Nova Einkauf, todo-Abgleich'],
  ['recipes', 'mdi:chef-hat', 'Rezepte', 'Nova Rezeptliste und Rezeptbuch'],
];

const CSS = `${NOVA_VARS}${FIELD_CSS}
:host{display:block;min-height:100%;background:var(--nv-page);color:var(--nv-fg);font-family:var(--nv-font);-webkit-font-smoothing:antialiased}
*{box-sizing:border-box}
ha-icon{display:flex;--mdc-icon-size:var(--nv-icon-lg)}
.top{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s6) var(--nv-s8);
padding-top:max(var(--nv-s6),env(safe-area-inset-top));backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat));-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat));
background:color-mix(in srgb,var(--nv-popup-base) 70%,transparent);border-bottom:1px solid var(--nv-border)}
.top h1{margin:0;font-size:var(--nv-fs-10);font-weight:var(--nv-fw-bold);flex:1;min-width:0;letter-spacing:.01em}
.top small{font-size:var(--nv-fs-3);opacity:.55;font-weight:var(--nv-fw-medium)}
.menu{display:none}
.st{display:flex;align-items:center;gap:var(--nv-s2);font-size:var(--nv-fs-4);opacity:0;transition:opacity var(--nv-d4)}
.st.show{opacity:.85}.st.err{color:var(--nv-error);opacity:1}.st ha-icon{--mdc-icon-size:var(--nv-icon-sm)}
main{max-width:980px;margin:0 auto;padding:var(--nv-s8);display:grid;grid-template-columns:repeat(auto-fill,minmax(min(100%,420px),1fr));gap:var(--nv-s8);align-items:start}
.c{position:relative;border-radius:var(--nv-radius);border:1px solid var(--nv-border);box-shadow:var(--nv-shadow),var(--nv-edge);padding:var(--nv-pad);
display:flex;flex-direction:column;gap:var(--nv-s4);min-width:0}
.c::before{content:'';position:absolute;inset:0;border-radius:inherit;background:var(--nv-bg);z-index:-1;
backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat));-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat))}
.c.wide{grid-column:1/-1}
.hd{display:flex;align-items:center;gap:var(--nv-s5);margin-bottom:var(--nv-s2)}
.hd .ic{width:40px;height:40px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip)}
.hd b{flex:1;font-size:var(--nv-fs-9);font-weight:var(--nv-fw-bold)}
.rs{border:1px solid var(--nv-box-border);background:none;color:inherit;font:inherit;font-size:var(--nv-fs-3);padding:var(--nv-s2) var(--nv-s5);
border-radius:var(--nv-r-pill);cursor:pointer;opacity:.6;transition:opacity var(--nv-d2),background-color var(--nv-d2),color var(--nv-d2),border-color var(--nv-d2)}
.rs:hover{opacity:1}.rs.arm{opacity:1;color:var(--nv-error);border-color:color-mix(in srgb,var(--nv-error) 70%,transparent);background:color-mix(in srgb,var(--nv-error) 16%,transparent)}
.f{display:flex;flex-direction:column;gap:var(--nv-s3);padding:var(--nv-s4) 0;border-top:1px solid rgba(var(--nv-tint),.08)}
.f:first-of-type{border-top:none}
.f>label,.f .lb{font-size:var(--nv-fs-6);font-weight:var(--nv-fw-medium)}
.hint{font-size:var(--nv-fs-3);opacity:.6;line-height:1.35}
.seg{display:flex;flex-wrap:wrap;gap:var(--nv-s3)}
.seg button,.btn{display:inline-flex;align-items:center;gap:var(--nv-s3);padding:7px var(--nv-s6);border-radius:var(--nv-r-pill);background:var(--nv-chip);
border:1px solid rgba(var(--nv-tint),.08);color:inherit;font:inherit;font-size:var(--nv-fs-5);cursor:pointer;
transition:background-color var(--nv-d2),color var(--nv-d2),border-color var(--nv-d2),box-shadow var(--nv-d2),transform var(--nv-d2)}
.seg button:active,.btn:active{transform:scale(var(--nv-press))}
.seg button:focus-visible,.btn:focus-visible,.tg:focus-visible,.th:focus-visible{outline:none;box-shadow:var(--nv-focus)}
.seg button.on{background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));color:color-mix(in srgb,var(--nv-active-fg) var(--nv-fill-ink),var(--nv-fg));
border-color:transparent;box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
.btn.danger{color:var(--nv-error)}
.btn[disabled]{opacity:.4;cursor:default}
.tg{display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s4) 0;border:none;border-top:1px solid rgba(var(--nv-tint),.08);background:none;color:inherit;
font:inherit;text-align:left;cursor:pointer;width:100%}
.tg .ic{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip)}
.tg .ic ha-icon{--mdc-icon-size:var(--nv-icon-md)}
.tg .nm{flex:1;min-width:0}.tg .nm b{display:block;font-size:var(--nv-fs-6);font-weight:var(--nv-fw-medium)}
.tg .nm small{display:block;font-size:var(--nv-fs-3);opacity:.6}
.sw{width:38px;height:22px;border-radius:11px;background:rgba(var(--nv-tint),.18);position:relative;flex:none;transition:background var(--nv-d3)}
.sw::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--nv-knob);box-shadow:var(--nv-shadow-knob);transition:transform var(--nv-d3) var(--nv-ease)}
.tg.on .sw{background:var(--nv-active)}.tg.on .sw::after{transform:translateX(16px)}
.themes{display:grid;grid-template-columns:repeat(auto-fit,minmax(110px,1fr));gap:var(--nv-s4)}
.th{position:relative;height:84px;border-radius:var(--nv-r-md);border:1px solid var(--tb);background:var(--tp);color:var(--tf);cursor:pointer;padding:0;overflow:hidden;
font:inherit;text-align:left;transition:transform var(--nv-d2),box-shadow var(--nv-d3)}
.th:active{transform:scale(var(--nv-press))}
.th i{position:absolute;inset:10px 10px 30px;border-radius:10px;background:var(--tc);border:1px solid var(--tb);display:flex;align-items:center;gap:6px;padding:0 8px}
.th i::before,.th i::after{content:'';width:14px;height:14px;border-radius:50%;background:var(--ta)}
.th i::after{background:var(--t2);width:30px;border-radius:7px}
.th span{position:absolute;left:10px;bottom:8px;font-size:var(--nv-fs-4);font-weight:var(--nv-fw-medium)}
.th.on{box-shadow:0 0 0 2px var(--nv-active),0 0 18px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 45%,transparent) var(--nv-glow),transparent)}
.th.on::after{content:'✓';position:absolute;right:8px;bottom:6px;width:20px;height:20px;border-radius:50%;background:var(--nv-active);color:var(--nv-active-fg);
font-size:12px;display:flex;align-items:center;justify-content:center}
.fld{border-radius:var(--nv-r-sm);padding:9px var(--nv-s6);font-size:var(--nv-fs-8)}
select.fld{cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 18px) 50%,calc(100% - 13px) 50%;background-size:5px 5px;background-repeat:no-repeat;padding-right:34px}
select.fld option{background:var(--nv-popup-base);color:var(--nv-fg)}
.line{display:flex;gap:var(--nv-s4);align-items:center;flex-wrap:wrap}.line .fld{flex:1;min-width:180px}
.step{display:inline-flex;align-items:center;gap:var(--nv-s4)}
.step button{width:36px;height:36px;border-radius:50%;border:1px solid var(--nv-box-border);background:var(--nv-chip);color:inherit;font:inherit;font-size:18px;cursor:pointer;
display:flex;align-items:center;justify-content:center;transition:transform var(--nv-d2)}
.step button:active{transform:scale(var(--nv-press))}
.step output{min-width:2.2em;text-align:center;font-size:var(--nv-fs-10);font-weight:var(--nv-fw-bold);font-variant-numeric:tabular-nums}
.ok{display:inline-flex;align-items:center;gap:var(--nv-s2);font-size:var(--nv-fs-5);color:var(--nv-accent-ink)}
.ok ha-icon{--mdc-icon-size:var(--nv-icon-sm)}
.msg{grid-column:1/-1;display:flex;gap:var(--nv-s5);align-items:center}
.foot{grid-column:1/-1;display:flex;justify-content:center;padding:var(--nv-s4) 0 var(--nv-s8)}
@media (max-width:870px){.menu{display:flex;width:40px;height:40px;border-radius:50%;border:none;background:none;color:inherit;align-items:center;justify-content:center;cursor:pointer;margin-left:calc(var(--nv-s4) * -1)}}
@media (max-width:520px){main{padding:var(--nv-s6);gap:var(--nv-s6)}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}`;

class NovaPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this._s = null;      // Einstellungen (ohne Geheimnisse)
    this._stores = [];   // Geschäfte aus dem Einkauf (für Standard-Geschäft)
    this._err = '';
    this._arm = null;    // Zurücksetzen: scharf geschalteter Bereich
  }

  set hass(h) {
    const first = !this._h;
    this._h = h;
    if (first || h?.connection !== this._conn) this._subscribe();
    // todo-Listen können dazukommen – nur die Auswahl neu füllen, nicht die ganze Seite
    const todos = Object.keys(h?.states || {}).filter(e => e.startsWith('todo.')).sort().join();
    if (todos !== this._todos) { this._todos = todos; this._render(); }
  }

  set narrow(v) { this._narrow = v; }
  set panel(_p) {}

  connectedCallback() { if (this._h && !this._unsub) this._subscribe(); this._render(); }
  disconnectedCallback() { this._stop(); }

  _stop() {
    for (const k of ['_unsub', '_unsubShop']) { const u = this[k]; this[k] = null; u?.then(f => typeof f === 'function' && f()).catch(() => {}); }
    this._conn = null;
  }

  _subscribe() {
    this._stop();
    const conn = this._h?.connection;
    if (!conn || !this.isConnected) return;
    this._conn = conn;
    this._unsub = conn.subscribeMessage(s => { this._s = s; this._err = ''; this._shop(); this._render(); }, {type: 'nova/settings/subscribe'})
      .catch(e => { this._err = e?.code === 'unknown_command' ? 'Diese Version der Nova-Integration kennt noch keine Einstellungen.' : (e?.message || 'Einstellungen konnten nicht geladen werden.'); this._render(); return null; });
  }

  // Geschäfte nur bei aktivem Einkauf abonnieren
  _shop() {
    const on = !!this._s?.module?.shopping;
    if (on && !this._unsubShop && this._conn) {
      this._unsubShop = this._conn.subscribeMessage(d => {
        const st = (d?.stores || []).map(s => [s.id, s.name]);
        if (JSON.stringify(st) !== JSON.stringify(this._stores)) { this._stores = st; this._render(); }
      }, {type: 'nova/shopping/subscribe'}).catch(() => null);
    } else if (!on && this._unsubShop) {
      const u = this._unsubShop; this._unsubShop = null; this._stores = [];
      u.then(f => typeof f === 'function' && f()).catch(() => {});
    }
  }

  async _set(section, values) {
    this._status('busy');
    try {
      await this._h.callWS({type: 'nova/settings/set', settings: {[section]: values}});
      this._status('ok');
    } catch (e) { this._status('err', e?.message || 'Nicht gespeichert'); }
  }

  async _reset(section) {
    this._status('busy');
    try {
      await this._h.callWS({type: 'nova/settings/reset', ...(section ? {bereich: section} : {})});
      this._status('ok', 'Zurückgesetzt');
    } catch (e) { this._status('err', e?.message || 'Nicht zurückgesetzt'); }
  }

  _status(kind, text) {
    const el = this.shadowRoot.querySelector('.st');
    if (!el) return;
    clearTimeout(this._stT);
    el.className = `st show ${kind === 'err' ? 'err' : ''}`;
    el.innerHTML = kind === 'busy' ? '<span>Speichere …</span>'
      : kind === 'ok' ? `<ha-icon icon="mdi:check"></ha-icon><span>${esc(text || 'Gespeichert')}</span>`
        : `<ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${esc(text)}</span>`;
    if (kind !== 'busy') this._stT = setTimeout(() => el.classList.remove('show'), kind === 'err' ? 6000 : 1600);
  }

  // ---------- Bausteine ----------
  _seg(sec, key, opts) {
    const v = this._s[sec][key];
    return `<div class="seg" role="radiogroup">${opts.map(([val, label, icon]) =>
      `<button role="radio" aria-checked="${v === val}" class="${v === val ? 'on' : ''}" data-set="${sec}.${key}" data-v="${esc(JSON.stringify(val))}">${icon ? `<ha-icon icon="${icon}"></ha-icon>` : ''}${esc(label)}</button>`).join('')}</div>`;
  }

  _toggle(sec, key, icon, label, hint) {
    const on = !!this._s[sec][key];
    return `<button class="tg ${on ? 'on' : ''}" role="switch" aria-checked="${on}" data-set="${sec}.${key}" data-v="${!on}">
<span class="ic"><ha-icon icon="${icon}"></ha-icon></span><span class="nm"><b>${esc(label)}</b>${hint ? `<small>${esc(hint)}</small>` : ''}</span><span class="sw"></span></button>`;
  }

  _card(sec, body, wide) {
    const [icon, name] = SECTIONS[sec];
    const arm = this._arm === sec;
    return `<section class="c ${wide ? 'wide' : ''}"><div class="hd"><span class="ic"><ha-icon icon="${icon}"></ha-icon></span><b>${name}</b>
<button class="rs ${arm ? 'arm' : ''}" data-reset="${sec}">${arm ? 'Wirklich zurücksetzen?' : 'Zurücksetzen'}</button></div>${body}</section>`;
  }

  _field(label, inner, hint) {
    return `<div class="f"><span class="lb">${esc(label)}</span>${inner}${hint ? `<span class="hint">${esc(hint)}</span>` : ''}</div>`;
  }

  _themes() {
    const cur = this._s.allgemein.theme || 'blau';
    return `<div class="themes">${THEME_KEYS.map(k => {
      const st = `--tp:${tv(k, 'page')};--tc:${tv(k, 'bg')};--tf:${tv(k, 'fg')};--tb:${tv(k, 'border')};--ta:${tv(k, 'a1')};--t2:${tv(k, 'a2')}`;
      return `<button class="th ${k === cur ? 'on' : ''}" style="${esc(st)}" data-set="allgemein.theme" data-v="${esc(JSON.stringify(k))}" aria-pressed="${k === cur}"><i></i><span>${esc(THEMES[k].name)}</span></button>`;
    }).join('')}</div>`;
  }

  _select(sec, key, opts, empty) {
    const v = this._s[sec][key];
    const known = v == null || opts.some(([o]) => o === v);
    return `<select class="fld" data-sel="${sec}.${key}"><option value="">${esc(empty)}</option>${known ? '' : `<option value="${esc(v)}" selected>${esc(v)} (fehlt)</option>`}
${opts.map(([o, l]) => `<option value="${esc(o)}" ${o === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  }

  // ---------- Seite ----------
  _render() {
    const r = this.shadowRoot;
    if (!r.firstChild) {
      r.innerHTML = `<style>${CSS}</style><div class="top"><button class="menu" aria-label="Seitenleiste"><ha-icon icon="mdi:menu"></ha-icon></button>
<h1>Nova <small>Einstellungen</small></h1><div class="st" aria-live="polite"></div></div><main></main>`;
      r.querySelector('.menu').addEventListener('click', () => this.dispatchEvent(new Event('hass-toggle-menu', {bubbles: true, composed: true})));
      r.addEventListener('click', e => this._click(e));
      r.addEventListener('change', e => this._change(e));
      // Fokus verlassen → aufgeschobenen Neuaufbau nachholen
      r.addEventListener('focusout', () => { if (this._dirty) setTimeout(() => this._render(), 0); });
    }
    const t = this._s?.allgemein?.theme;
    if (t && t !== 'blau' && THEMES[t]) this.setAttribute('nova-theme', t); else this.removeAttribute('nova-theme');
    const main = r.querySelector('main');
    // Während jemand tippt, die Seite nicht neu aufbauen (Feld würde den Fokus verlieren)
    const a = r.activeElement;
    if (a && a.matches?.('input')) { this._dirty = true; return; }
    this._dirty = false;
    if (this._err) { main.innerHTML = `<section class="c wide msg"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${esc(this._err)}</span></section>`; return; }
    if (!this._s) { main.innerHTML = `<section class="c wide msg"><span>Lade Einstellungen …</span></section>`; return; }
    const s = this._s;
    const todos = (this._todos || '').split(',').filter(Boolean).map(e => [e, this._h?.states?.[e]?.attributes?.friendly_name || e]);
    main.innerHTML = [
      this._card('allgemein', [
        this._field('Theme', this._themes(), 'Gilt für alle Nova Cards auf allen Geräten, außer eine Karte hat ein eigenes Theme.'),
        this._field('Animationen', this._seg('allgemein', 'animationen', [['normal', 'Normal', 'mdi:motion-play-outline'], ['vereinfacht', 'Vereinfacht', 'mdi:motion-pause-outline'], ['aus', 'Aus', 'mdi:motion-outline']]),
          'Vereinfacht: keine Dauer-Animationen (Lauftitel, Leuchten, Lichtstreifen). Aus: auch keine Übergänge – gut für schwache Wandpanels.'),
        this._field('Schriftgröße', this._seg('allgemein', 'schriftgroesse', SIZES)),
      ].join(''), true),
      this._card('module', `${MODULES.map(([k, ic, name, hint]) => this._toggle('module', k, ic, name, hint)).join('')}
<span class="hint">Abgeschaltete Module behalten ihre Daten, die Karten dazu zeigen nur einen Hinweis.</span>`),
      this._card('einkauf', [
        this._field('Standard-Geschäft', this._select('einkauf', 'standard_geschaeft', this._stores, 'Keins'), 'Neue Artikel ohne Geschäft landen hier.'),
        this._field('Gruppierung', this._seg('einkauf', 'gruppierung', [['geschaeft', 'Nach Geschäft', 'mdi:store-outline'], ['keine', 'Keine', 'mdi:format-list-bulleted']])),
        this._field('todo-Liste', this._select('einkauf', 'todo_entity', todos, 'Kein Abgleich'), 'Wird mit der Einkaufsliste abgeglichen, damit Sprachbefehle wie „Setz Milch auf die Einkaufsliste“ funktionieren.'),
        this._toggle('einkauf', 'bilder', 'mdi:image-outline', 'Bilder zeigen', 'Icons und eigene Bilder der Artikel'),
      ].join('')),
      this._card('notizen', [
        this._field('Schriftgröße', this._seg('notizen', 'standard_schriftgroesse', SIZES)),
        this._toggle('notizen', 'kompakt', 'mdi:view-agenda-outline', 'Kompakte Liste', 'Nur Titel und Datum, ohne Vorschau'),
      ].join('')),
      this._card('rezepte', [
        this._field('Rezeptbuch', this._seg('rezepte', 'buch_variante', [['old', 'Alt', 'mdi:book-open-page-variant-outline'], ['modern', 'Modern', 'mdi:book-open-outline'], ['fantasy', 'Fantasy', 'mdi:book-open-variant']]),
          'Stil für Rezeptbücher, die keinen eigenen Stil haben.'),
        this._field('Standard-Portionen', `<div class="step"><button data-step="-1" aria-label="weniger">−</button><output>${s.rezepte.standard_portionen}</output><button data-step="1" aria-label="mehr">+</button></div>`,
          'Für neue Rezepte und beim Umrechnen.'),
      ].join('')),
      this._card('mealie', [
        this._field('Adresse', `<div class="line"><input class="fld" type="url" inputmode="url" placeholder="http://mealie.local:9000" data-in="mealie.url" value="${esc(s.mealie.url || '')}">
<button class="btn" data-save="mealie.url">Speichern</button></div>`),
        this._field('Zugangsschlüssel (API-Token)', s.mealie.token_gesetzt
          ? `<div class="line"><span class="ok"><ha-icon icon="mdi:lock-check-outline"></ha-icon>gesetzt</span><input class="fld" type="password" autocomplete="off" placeholder="Neuer Schlüssel" data-in="mealie.token">
<button class="btn" data-save="mealie.token">Ändern</button><button class="btn danger" data-clear="mealie.token">Löschen</button></div>`
          : `<div class="line"><input class="fld" type="password" autocomplete="off" placeholder="Schlüssel einfügen" data-in="mealie.token"><button class="btn" data-save="mealie.token">Speichern</button></div>`,
        'Bleibt in Home Assistant. Karten und diese Seite sehen ihn nie, nur ob er gesetzt ist.'),
      ].join('')),
      `<div class="foot"><button class="rs ${this._arm === '*' ? 'arm' : ''}" data-reset="*">${this._arm === '*' ? 'Wirklich ALLES zurücksetzen?' : 'Alles zurücksetzen'}</button></div>`,
      `<div class="foot"><span class="hint" style="opacity:.45;font-size:var(--nv-fs-2)">Nova-Panel ${esc(VERSION)}</span></div>`,
    ].join('');
  }

  _click(e) {
    const b = e.target.closest('button');
    if (!b || !this._s) return;
    if (b.dataset.set) {
      const [sec, key] = b.dataset.set.split('.');
      this._set(sec, {[key]: JSON.parse(b.dataset.v)});
    } else if (b.dataset.step) {
      const n = Math.min(50, Math.max(1, this._s.rezepte.standard_portionen + Number(b.dataset.step)));
      if (n !== this._s.rezepte.standard_portionen) this._set('rezepte', {standard_portionen: n});
    } else if (b.dataset.save) {
      const [sec, key] = b.dataset.save.split('.');
      const inp = this.shadowRoot.querySelector(`[data-in="${b.dataset.save}"]`);
      const v = inp?.value.trim() || null;
      if (key === 'token' && !v) return;
      inp?.blur();
      this._set(sec, {[key]: v});
    } else if (b.dataset.clear) {
      const [sec, key] = b.dataset.clear.split('.');
      this._set(sec, {[key]: null});
    } else if (b.dataset.reset) {
      const sec = b.dataset.reset;
      clearTimeout(this._armT);
      if (this._arm === sec) { this._arm = null; this._reset(sec === '*' ? null : sec); }
      else { this._arm = sec; this._armT = setTimeout(() => { this._arm = null; this._render(); }, 3500); }
      this._render();
    }
  }

  _change(e) {
    const sel = e.target.closest('select[data-sel]');
    if (sel) { const [sec, key] = sel.dataset.sel.split('.'); this._set(sec, {[key]: sel.value || null}); }
  }
}

if (!customElements.get('nova-settings-panel')) customElements.define('nova-settings-panel', NovaPanel);
