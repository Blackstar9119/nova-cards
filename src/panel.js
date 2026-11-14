/* Nova-Panel – Einstellungen von Nova Homeverse in der Seitenleiste von Home Assistant.
   Wird NICHT in nova-cards.js gebaut, sondern mit „npm run panel“ zu panel/nova-panel.js. Diese Datei kommt in die
   Integration (custom_components/nova_homeverse/static/nova-panel.js), die sie als Panel „Nova Homeverse“ anmeldet (nur Admins).
   Aufbau: links eine schmale Navigation, rechts immer genau ein Abschnitt in einer ruhigen Spalte. Optik wie die Karten
   (Tokens aus theme.js, gewähltes globales Theme und Hintergrund). Jede Änderung speichert sofort; das Abo
   nova_homeverse/settings/subscribe hält die Seite auf allen Geräten aktuell. Das Mealie-Token kommt nie hierher, nur token_gesetzt. */
import {BACKGROUNDS, NOVA_VARS, THEMES, THEME_KEYS, TOKENS} from './shared/theme.js';
import {FIELD_CSS} from './shared/styles.js';
import {esc} from './shared/utils.js';

const DEFAULT = Object.fromEntries(TOKENS.map(([k, , v]) => [k, v]));
const tv = (t, k) => THEMES[t]?.vars[k] ?? DEFAULT[k];
const bgOf = k => BACKGROUNDS[k].replaceAll(' fixed', '');
// Kurzname in den Kacheln (nie abschneiden): „Nova Midnight“ → „Midnight“
const short = k => THEMES[k].name.replace(/^Nova /, '');

const SIZES = [['klein', 'Klein'], ['normal', 'Normal'], ['gross', 'Groß']];
const SECTIONS = [
  ['allgemein', 'mdi:tune-variant', 'Allgemein'],
  ['einkauf', 'mdi:cart-outline', 'Einkauf'],
  ['notizen', 'mdi:note-multiple-outline', 'Notizen'],
  ['rezepte', 'mdi:chef-hat', 'Rezepte'],
  ['mealie', 'mdi:silverware-fork-knife', 'Mealie'],
];
// Abschnitt → Modul, ohne das er nichts tut
const NEEDS = {einkauf: ['shopping', 'Einkauf'], notizen: ['notes', 'Notizen'], rezepte: ['recipes', 'Rezepte']};
const MODULES = [
  ['theme', 'mdi:palette-outline', 'Theme', 'Globales Theme für alle Geräte'],
  ['notes', 'mdi:note-multiple-outline', 'Notizen', 'Nova Notiz'],
  ['shopping', 'mdi:cart-outline', 'Einkauf', 'Nova Einkauf'],
  ['recipes', 'mdi:chef-hat', 'Rezepte', 'Nova Rezeptliste und Rezeptbuch'],
];

const STYLE = `${NOVA_VARS}${FIELD_CSS}
:host{display:block;min-height:100%;background:var(--nova-panel-bg,var(--nv-page));background-attachment:fixed;color:var(--nv-fg);font-family:var(--nv-font);-webkit-font-smoothing:antialiased}
*{box-sizing:border-box}
ha-icon{display:flex;--mdc-icon-size:var(--nv-icon-md)}
button{font:inherit;color:inherit}
button:focus-visible{outline:none;box-shadow:var(--nv-focus)}
.top{position:sticky;top:0;z-index:3;display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s5) var(--nv-s8);
padding-top:max(var(--nv-s5),env(safe-area-inset-top));backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat));-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat));
background:color-mix(in srgb,var(--nv-popup-base) 55%,transparent)}
.top h1{margin:0;font-size:var(--nv-fs-10);font-weight:var(--nv-fw-bold);flex:1;min-width:0;letter-spacing:.01em}
.menu{display:none}
.st{display:flex;align-items:center;gap:var(--nv-s2);font-size:var(--nv-fs-4);opacity:0;transition:opacity var(--nv-d4)}
.st.show{opacity:.85}.st.err{color:var(--nv-error);opacity:1}.st ha-icon{--mdc-icon-size:var(--nv-icon-sm)}
.wrap{display:grid;grid-template-columns:200px minmax(0,640px);justify-content:center;gap:var(--nv-s8);padding:var(--nv-s8);align-items:start}
nav{position:sticky;top:76px;display:flex;flex-direction:column;gap:var(--nv-s1)}
nav button{display:flex;align-items:center;gap:var(--nv-s5);padding:10px var(--nv-s5);border:none;border-radius:var(--nv-r-pill);background:none;cursor:pointer;
text-align:left;font-size:var(--nv-fs-6);opacity:.72;transition:background-color var(--nv-d2),opacity var(--nv-d2)}
nav button:hover{opacity:1;background:rgba(var(--nv-tint),.06)}
nav button.on{opacity:1;background:var(--nv-chip);font-weight:var(--nv-fw-medium)}
nav button.on ha-icon{color:var(--nv-active)}
nav .off{margin-left:auto;font-size:var(--nv-fs-2);opacity:.6}
.ver{padding:var(--nv-s6) var(--nv-s5) 0;font-size:var(--nv-fs-2);opacity:.4}
.pane{position:relative;border-radius:var(--nv-radius);box-shadow:var(--nv-shadow),var(--nv-edge);padding:var(--nv-s8) calc(var(--nv-s8) + 4px);min-width:0}
.pane::before{content:'';position:absolute;inset:0;border-radius:inherit;background:var(--nv-bg);z-index:-1;
backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat));-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat))}
h2{display:flex;align-items:center;gap:var(--nv-s4);margin:0 0 var(--nv-s4);font-size:var(--nv-fd-1);font-weight:var(--nv-fw-bold)}
h2 ha-icon{--mdc-icon-size:var(--nv-icon-lg);opacity:.8}
.f{display:flex;flex-direction:column;gap:var(--nv-s3);margin-top:var(--nv-s8)}
.lb{font-size:var(--nv-fs-6);font-weight:var(--nv-fw-medium)}
.hint{font-size:var(--nv-fs-3);opacity:.6;line-height:1.4}
.seg{display:flex;flex-wrap:wrap;gap:var(--nv-s3)}
.seg button,.btn{display:inline-flex;align-items:center;gap:var(--nv-s3);padding:7px var(--nv-s6);border-radius:var(--nv-r-pill);background:var(--nv-chip);
border:none;font-size:var(--nv-fs-5);cursor:pointer;transition:background-color var(--nv-d2),color var(--nv-d2),box-shadow var(--nv-d2),transform var(--nv-d2)}
.seg button ha-icon,.btn ha-icon{--mdc-icon-size:var(--nv-icon-sm)}
.seg button:active,.btn:active{transform:scale(var(--nv-press))}
.seg button.on,.btn.pri{background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));color:color-mix(in srgb,var(--nv-active-fg) var(--nv-fill-ink),var(--nv-fg));
box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
.btn.danger{color:var(--nv-error)}
.btn.arm{background:color-mix(in srgb,var(--nv-error) 18%,transparent);color:var(--nv-error)}
.btn[disabled]{opacity:.4;cursor:default}
.ib{width:34px;height:34px;border-radius:50%;border:none;background:none;cursor:pointer;display:flex;align-items:center;justify-content:center;opacity:.6;flex:none;
transition:opacity var(--nv-d2),background-color var(--nv-d2)}
.ib:hover{opacity:1;background:rgba(var(--nv-tint),.08)}
.ib.arm{opacity:1;color:var(--nv-error);background:color-mix(in srgb,var(--nv-error) 16%,transparent)}
.tgs{display:flex;flex-direction:column;gap:var(--nv-s1);margin-top:var(--nv-s2)}
.tg{display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s3) 0;border:none;background:none;text-align:left;cursor:pointer;width:100%;border-radius:var(--nv-r-sm)}
.tg>ha-icon{opacity:.7}
.tg .nm{flex:1;min-width:0;display:flex;flex-direction:column;gap:2px}.tg .nm b{display:block;font-size:var(--nv-fs-6);font-weight:var(--nv-fw-medium)}
.tg .nm small{display:block;font-size:var(--nv-fs-3);opacity:.6}
.sw{width:38px;height:22px;border-radius:11px;background:rgba(var(--nv-tint),.18);position:relative;flex:none;transition:background var(--nv-d3)}
.sw::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--nv-knob);box-shadow:var(--nv-shadow-knob);transition:transform var(--nv-d3) var(--nv-ease)}
.tg.on .sw{background:var(--nv-active)}.tg.on .sw::after{transform:translateX(16px)}
.tiles{display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:var(--nv-s4)}.tiles.six{grid-template-columns:repeat(6,minmax(0,1fr))}
.th{position:relative;height:76px;border-radius:var(--nv-r-md);border:1px solid var(--tb);background:var(--tp);color:var(--tf);cursor:pointer;padding:0;overflow:hidden;
text-align:left;transition:transform var(--nv-d2),box-shadow var(--nv-d3)}
.th:active{transform:scale(var(--nv-press))}
.th i{position:absolute;inset:9px 9px 30px;border-radius:9px;background:var(--tc);border:1px solid var(--tb);display:flex;align-items:center;gap:6px;padding:0 8px}
.th i::before,.th i::after{content:'';width:12px;height:12px;border-radius:50%;background:var(--ta)}
.th i::after{background:var(--t2);width:26px;border-radius:6px}
.th span{position:absolute;left:10px;bottom:8px;font-size:var(--nv-fs-3);font-weight:var(--nv-fw-medium);white-space:nowrap}
.th>ha-icon{position:absolute;inset:0 0 22px;align-items:center;justify-content:center;opacity:.55}
.th.none{background:rgba(var(--nv-tint),.06);border-color:var(--nv-box-border);color:var(--nv-fg)}
.th.on{box-shadow:0 0 0 2px var(--nv-active),0 0 18px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 45%,transparent) var(--nv-glow),transparent)}
.th.on::after{content:'✓';position:absolute;right:8px;bottom:6px;width:18px;height:18px;border-radius:50%;background:var(--nv-active);color:var(--nv-active-fg);
font-size:var(--nv-fs-2);display:flex;align-items:center;justify-content:center}
.fld{border-radius:var(--nv-r-sm);padding:9px var(--nv-s6);font-size:var(--nv-fs-8)}
select.fld{cursor:pointer;background-image:linear-gradient(45deg,transparent 50%,currentColor 50%),linear-gradient(135deg,currentColor 50%,transparent 50%);
background-position:calc(100% - 18px) 50%,calc(100% - 13px) 50%;background-size:5px 5px;background-repeat:no-repeat;padding-right:34px}
select.fld option{background:var(--nv-popup-base);color:var(--nv-fg)}
.line{display:flex;gap:var(--nv-s4);align-items:center;flex-wrap:wrap}.line .fld{flex:1;min-width:180px}
.list{display:flex;flex-direction:column}
.row{display:flex;align-items:center;gap:var(--nv-s4);min-height:44px;padding:0 var(--nv-s2) 0 var(--nv-s3);border-radius:var(--nv-r-sm)}
.row:hover{background:rgba(var(--nv-tint),.04)}
.row>ha-icon{opacity:.6}
.row .nm{flex:1;min-width:0;font-size:var(--nv-fs-6);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.row .fld{flex:1;padding:6px var(--nv-s4);font-size:var(--nv-fs-6)}
.row .tag{font-size:var(--nv-fs-2);opacity:.55}
.empty{font-size:var(--nv-fs-4);opacity:.55;padding:var(--nv-s2) var(--nv-s3)}
.step{display:inline-flex;align-items:center;gap:var(--nv-s4)}
.step button{width:36px;height:36px;border-radius:50%;border:none;background:var(--nv-chip);font-size:18px;cursor:pointer;
display:flex;align-items:center;justify-content:center;transition:transform var(--nv-d2)}
.step button:active{transform:scale(var(--nv-press))}
.step output{min-width:2.2em;text-align:center;font-size:var(--nv-fs-10);font-weight:var(--nv-fw-bold);font-variant-numeric:tabular-nums}
.ok{display:inline-flex;align-items:center;gap:var(--nv-s2);font-size:var(--nv-fs-5);color:var(--nv-accent-ink)}
.ok ha-icon{--mdc-icon-size:var(--nv-icon-sm)}
.note{display:flex;align-items:center;gap:var(--nv-s4);margin-top:var(--nv-s6);font-size:var(--nv-fs-4)}
.note span{flex:1;opacity:.75}
.rs{display:block;margin-top:calc(var(--nv-s8) * 1.5);padding:var(--nv-s2) 0;border:none;background:none;cursor:pointer;font-size:var(--nv-fs-3);opacity:.5;
text-decoration:underline;text-underline-offset:3px;text-decoration-color:rgba(var(--nv-tint),.3);transition:opacity var(--nv-d2),color var(--nv-d2)}
.rs:hover{opacity:.9}.rs.arm{opacity:1;color:var(--nv-error);text-decoration-color:currentColor}
nav .rs{margin:var(--nv-s6) 0 0;padding:0 var(--nv-s5);text-align:left}
.msg{display:flex;gap:var(--nv-s5);align-items:center}
@media (max-width:760px){
.menu{display:flex;width:40px;height:40px;border-radius:50%;border:none;background:none;align-items:center;justify-content:center;cursor:pointer;margin-left:calc(var(--nv-s4) * -1)}
.wrap{grid-template-columns:minmax(0,1fr);padding:0 var(--nv-s6) var(--nv-s8);gap:var(--nv-s5)}
nav{top:56px;z-index:2;flex-direction:row;overflow-x:auto;scrollbar-width:none;margin:0 calc(var(--nv-s6) * -1);padding:var(--nv-s3) var(--nv-s6);
backdrop-filter:blur(var(--nv-blur));-webkit-backdrop-filter:blur(var(--nv-blur));background:color-mix(in srgb,var(--nv-popup-base) 55%,transparent)}
nav::-webkit-scrollbar{display:none}
nav button{flex:none;padding:7px var(--nv-s5)}
nav .ver,nav .rs,nav .off{display:none}
.tiles.six{grid-template-columns:repeat(3,minmax(0,1fr))}
.pane{padding:var(--nv-s7) var(--nv-s6)}}
@media (prefers-reduced-motion:reduce){*{transition:none!important;animation:none!important}}`;

class NovaPanel extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({mode: 'open'});
    this._s = null;      // Einstellungen (ohne Geheimnisse)
    this._stores = [];   // Geschäfte aus dem Einkauf [{id, name, icon}]
    this._err = '';
    this._arm = null;    // Zwei-Schritt-Bestätigung: Schlüssel des scharf geschalteten Knopfs
    this._edit = null;   // Geschäft, das gerade umbenannt wird
    this._tab = 'allgemein';
    try { const t = localStorage.getItem('nova-panel-tab'); if (SECTIONS.some(([k]) => k === t)) this._tab = t; } catch { /* egal */ }
  }

  set hass(h) {
    const first = !this._h;
    this._h = h;
    if (first || h?.connection !== this._conn) this._subscribe();
    // todo-Listen können dazukommen – nur dann neu zeichnen
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
    // Version der Integration (ältere kennen das Feld nicht → keine Angabe)
    conn.sendMessagePromise({type: 'nova_homeverse/info'}).then(i => { this._ver = i?.version || ''; this._render(); }).catch(() => {});
    this._unsub = conn.subscribeMessage(s => { this._s = s; this._err = ''; this._shop(); this._render(); }, {type: 'nova_homeverse/settings/subscribe'})
      .catch(e => { this._err = e?.code === 'unknown_command' ? 'Diese Version von Nova Homeverse kennt noch keine Einstellungen.' : (e?.message || 'Einstellungen konnten nicht geladen werden.'); this._render(); return null; });
  }

  // Geschäfte nur bei aktivem Einkauf abonnieren
  _shop() {
    const on = !!this._s?.module?.shopping;
    if (on && !this._unsubShop && this._conn) {
      this._unsubShop = this._conn.subscribeMessage(d => {
        const st = (d?.stores || []).map(s => ({id: s.id, name: s.name, icon: s.icon}));
        if (JSON.stringify(st) !== JSON.stringify(this._stores)) { this._stores = st; this._render(); }
      }, {type: 'nova_homeverse/shopping/subscribe'}).catch(() => null);
    } else if (!on && this._unsubShop) {
      const u = this._unsubShop; this._unsubShop = null; this._stores = [];
      u.then(f => typeof f === 'function' && f()).catch(() => {});
    }
  }

  async _ws(msg, ok) {
    this._status('busy');
    try { const r = await this._h.callWS(msg); this._status('ok', ok); return r; } catch (e) { this._status('err', e?.message || 'Nicht gespeichert'); return null; }
  }

  _set(section, values) { return this._ws({type: 'nova_homeverse/settings/set', settings: {[section]: values}}); }
  _reset(section) { return this._ws({type: 'nova_homeverse/settings/reset', ...(section ? {bereich: section} : {})}, 'Zurückgesetzt'); }

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

  // Zwei-Schritt-Knöpfe (Zurücksetzen, Löschen): erster Klick schaltet scharf, nach 3,5 s wieder aus
  _armed(key) {
    clearTimeout(this._armT);
    if (this._arm === key) { this._arm = null; return true; }
    this._arm = key;
    this._armT = setTimeout(() => { this._arm = null; this._render(); }, 3500);
    this._render();
    return false;
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
<ha-icon icon="${icon}"></ha-icon><span class="nm"><b>${esc(label)}</b>${hint ? `<small>${esc(hint)}</small>` : ''}</span><span class="sw"></span></button>`;
  }

  _field(label, inner, hint) {
    return `<div class="f">${label ? `<span class="lb">${esc(label)}</span>` : ''}${inner}${hint ? `<span class="hint">${hint}</span>` : ''}</div>`;
  }

  _select(sec, key, opts, empty) {
    const v = this._s[sec][key];
    const known = v == null || opts.some(([o]) => o === v);
    return `<select class="fld" data-sel="${sec}.${key}"><option value="">${esc(empty)}</option>${known ? '' : `<option value="${esc(v)}" selected>${esc(v)} (fehlt)</option>`}
${opts.map(([o, l]) => `<option value="${esc(o)}" ${o === v ? 'selected' : ''}>${esc(l)}</option>`).join('')}</select>`;
  }

  get _theme() { const t = this._s?.allgemein?.theme; return THEMES[t] ? t : 'blau'; }

  _themes() {
    const cur = this._theme;
    return `<div class="tiles">${THEME_KEYS.map(k => {
      const st = `--tp:${tv(k, 'page')};--tc:${tv(k, 'bg')};--tf:${tv(k, 'fg')};--tb:${tv(k, 'border')};--ta:${tv(k, 'a1')};--t2:${tv(k, 'a2')}`;
      return `<button class="th ${k === cur ? 'on' : ''}" style="${esc(st)}" data-set="allgemein.theme" data-v="${esc(JSON.stringify(k))}" aria-pressed="${k === cur}"><i></i><span>${esc(short(k))}</span></button>`;
    }).join('')}</div>`;
  }

  // Hintergründe: Vorschau = Hintergrund mit einer Karte im aktuellen Theme darauf
  _backgrounds() {
    const cur = this._s.allgemein.hintergrund || 'keiner', t = this._theme;
    // Vorschau: Hintergrund mit einer Karte im passenden Theme darauf
    const card = k => `--tc:${tv(k, 'bg')};--tb:${tv(k, 'border')};--ta:${tv(k, 'a1')};--t2:${tv(k, 'a2')}`;
    const tile = (k, label, th, extra = '') => `<button class="th ${extra} ${k === cur ? 'on' : ''}" style="${esc(`${card(th)};${extra ? '' : `--tp:${bgOf(th)};--tf:${tv(th, 'fg')}`}`)}"
data-set="allgemein.hintergrund" data-v="${esc(JSON.stringify(k))}" aria-pressed="${k === cur}" title="${esc(label)}">${extra === 'none' ? '<ha-icon icon="mdi:cancel"></ha-icon>' : '<i></i>'}<span>${esc(label)}</span></button>`;
    return `<div class="tiles six">${[
      tile('keiner', 'Keiner', t, 'none'),
      tile('passend', 'Passend', t),
      ...THEME_KEYS.map(k => tile(k, short(k), k)),
    ].join('')}</div>`;
  }

  _off(sec) {
    const need = NEEDS[sec];
    if (!need || this._s.module[need[0]]) return '';
    return `<div class="note"><ha-icon icon="mdi:power-plug-off-outline"></ha-icon><span>Das Modul ${esc(need[1])} ist aus. Die Einstellungen bleiben gespeichert, wirken aber erst, wenn es wieder an ist.</span>
<button class="btn" data-set="module.${need[0]}" data-v="true">Einschalten</button></div>`;
  }

  _storesList() {
    if (!this._s.module.shopping) return '<span class="empty">Geschäfte gibt es nur mit eingeschaltetem Modul Einkauf.</span>';
    const def = this._s.einkauf.standard_geschaeft;
    const rows = this._stores.map(st => {
      if (this._edit === st.id) {
        return `<div class="row"><ha-icon icon="${esc(st.icon || 'mdi:store-outline')}"></ha-icon><input class="fld" data-rename="${esc(st.id)}" value="${esc(st.name)}" maxlength="60" aria-label="Name">
<button class="ib" data-rsave="${esc(st.id)}" aria-label="Speichern"><ha-icon icon="mdi:check"></ha-icon></button><button class="ib" data-rcancel aria-label="Abbrechen"><ha-icon icon="mdi:close"></ha-icon></button></div>`;
      }
      const arm = this._arm === `del:${st.id}`;
      return `<div class="row"><ha-icon icon="${esc(st.icon || 'mdi:store-outline')}"></ha-icon><span class="nm">${esc(st.name)}</span>${st.id === def ? '<span class="tag">Standard</span>' : ''}
<button class="ib" data-edit="${esc(st.id)}" aria-label="Umbenennen"><ha-icon icon="mdi:pencil-outline"></ha-icon></button>
<button class="ib ${arm ? 'arm' : ''}" data-del="${esc(st.id)}" aria-label="${arm ? 'Wirklich löschen?' : 'Löschen'}" title="${arm ? 'Nochmal tippen zum Löschen' : 'Löschen'}"><ha-icon icon="${arm ? 'mdi:delete-alert-outline' : 'mdi:delete-outline'}"></ha-icon></button></div>`;
    }).join('');
    return `<div class="list">${rows || '<span class="empty">Noch keine Geschäfte.</span>'}</div>
<div class="line"><input class="fld" data-in="newstore" placeholder="Neues Geschäft, z. B. Bäcker" maxlength="60"><button class="btn" data-add><ha-icon icon="mdi:plus"></ha-icon>Hinzufügen</button></div>`;
  }

  _resetBtn(sec) {
    const arm = this._arm === `reset:${sec}`;
    const name = SECTIONS.find(([k]) => k === sec)[2];
    return `<button class="rs ${arm ? 'arm' : ''}" data-reset="${sec}">${arm ? `Wirklich „${esc(name)}“ zurücksetzen?` : `„${esc(name)}“ auf Standard zurücksetzen`}</button>`;
  }

  // ---------- Abschnitte ----------
  _pane(sec) {
    const s = this._s;
    const todos = (this._todos || '').split(',').filter(Boolean).map(e => [e, this._h?.states?.[e]?.attributes?.friendly_name || e]);
    const voice = 'Liste für den Sprachassistenten';
    switch (sec) {
      case 'allgemein': return [
        this._field('Theme', this._themes(), 'Gilt für alle Nova Cards auf allen Geräten, außer eine Karte hat ein eigenes Theme.'),
        this._field('Hintergrund', this._backgrounds(), 'Hintergrund der Dashboards mit Nova Cards. „Passend“ folgt dem Theme. Hat eine Ansicht einen eigenen Hintergrund, bleibt der.'),
        this._field('Animationen', this._seg('allgemein', 'animationen', [['normal', 'Normal', 'mdi:motion-play-outline'], ['vereinfacht', 'Vereinfacht', 'mdi:motion-pause-outline'], ['aus', 'Aus', 'mdi:motion-outline']]),
          'Vereinfacht: keine Dauer-Animationen (Lauftitel, Leuchten, Lichtstreifen). Aus: auch keine Übergänge, gut für schwache Wandpanels.'),
        this._field('Schriftgröße', this._seg('allgemein', 'schriftgroesse', SIZES)),
        this._field('Module', `<div class="tgs">${MODULES.map(([k, ic, name, hint]) => this._toggle('module', k, ic, name, hint)).join('')}</div>`,
          'Abgeschaltete Module behalten ihre Daten, die Karten dazu zeigen nur einen Hinweis.'),
      ].join('');
      case 'einkauf': return [
        this._off('einkauf'),
        this._field('Geschäfte', this._storesList()),
        this._field('Standard-Geschäft', this._select('einkauf', 'standard_geschaeft', this._stores.map(x => [x.id, x.name]), 'Keins'), 'Neue Artikel ohne Geschäft landen hier.'),
        this._field('Gruppierung', this._seg('einkauf', 'gruppierung', [['geschaeft', 'Nach Geschäft', 'mdi:store-outline'], ['keine', 'Keine', 'mdi:format-list-bulleted']])),
        this._field(voice, this._select('einkauf', 'todo_entity', todos, 'Keine'),
          'Nova Homeverse hält diese todo-Liste mit der Einkaufsliste gleich. So klappt „Setz Milch auf die Einkaufsliste“ mit Assist, Alexa oder Google, und was dort landet, steht auch in Nova Homeverse. Am besten eine eigene Liste nehmen.'),
        `<div class="tgs" style="margin-top:var(--nv-s6)">${this._toggle('einkauf', 'bilder', 'mdi:image-outline', 'Bilder zeigen', 'Icons und eigene Bilder der Artikel')}</div>`,
      ].join('');
      case 'notizen': return [
        this._off('notizen'),
        this._field('Schriftgröße', this._seg('notizen', 'standard_schriftgroesse', SIZES), 'Für Notiz-Karten ohne eigene Schriftgröße.'),
        `<div class="tgs" style="margin-top:var(--nv-s6)">${this._toggle('notizen', 'kompakt', 'mdi:view-agenda-outline', 'Kompakte Liste', 'Nur Titel und Datum, ohne Vorschau')}</div>`,
        this._field(voice, this._select('notizen', 'todo_entity', todos, 'Keine'),
          'Jede Notiz erscheint als Eintrag in dieser todo-Liste, mit Titel und Text. Was du dort per Sprache anlegst, wird zur Notiz. Bitte eine eigene Liste nehmen, nicht die vom Einkauf.'),
      ].join('');
      case 'rezepte': return [
        this._off('rezepte'),
        this._field('Rezeptbuch', this._seg('rezepte', 'buch_variante', [['old', 'Alt', 'mdi:book-open-page-variant-outline'], ['modern', 'Modern', 'mdi:book-open-outline'], ['fantasy', 'Fantasy', 'mdi:book-open-variant']]),
          'Stil für Rezeptbücher, die keinen eigenen Stil haben.'),
        this._field('Standard-Portionen', `<div class="step"><button data-step="-1" aria-label="weniger">−</button><output>${s.rezepte.standard_portionen}</output><button data-step="1" aria-label="mehr">+</button></div>`,
          'Für neue Rezepte und beim Umrechnen.'),
      ].join('');
      case 'mealie': return [
        this._field('Adresse', `<div class="line"><input class="fld" type="url" inputmode="url" placeholder="http://mealie.local:9000" data-in="mealie.url" value="${esc(s.mealie.url || '')}">
<button class="btn" data-save="mealie.url">Speichern</button></div>`),
        this._field('Zugangsschlüssel (API-Token)', s.mealie.token_gesetzt
          ? `<div class="line"><span class="ok"><ha-icon icon="mdi:lock-check-outline"></ha-icon>gesetzt</span><input class="fld" type="password" autocomplete="off" placeholder="Neuer Schlüssel" data-in="mealie.token">
<button class="btn" data-save="mealie.token">Ändern</button><button class="btn danger" data-clear="mealie.token">Löschen</button></div>`
          : `<div class="line"><input class="fld" type="password" autocomplete="off" placeholder="Schlüssel einfügen" data-in="mealie.token"><button class="btn" data-save="mealie.token">Speichern</button></div>`,
        'Bleibt in Home Assistant. Karten und diese Seite sehen ihn nie, nur ob er gesetzt ist.'),
      ].join('');
    }
    return '';
  }

  // ---------- Seite ----------
  _render() {
    const r = this.shadowRoot;
    if (!r.firstChild) {
      r.innerHTML = `<style>${STYLE}</style><div class="top"><button class="menu" aria-label="Seitenleiste"><ha-icon icon="mdi:menu"></ha-icon></button>
<h1>Nova Homeverse</h1><div class="st" aria-live="polite"></div></div><div class="wrap"><nav></nav><main></main></div>`;
      r.querySelector('.menu').addEventListener('click', () => this.dispatchEvent(new Event('hass-toggle-menu', {bubbles: true, composed: true})));
      r.addEventListener('click', e => this._click(e));
      r.addEventListener('change', e => this._change(e));
      r.addEventListener('keydown', e => this._key(e));
      // Fokus verlassen → aufgeschobenen Neuaufbau nachholen
      r.addEventListener('focusout', () => { if (this._dirty) setTimeout(() => this._render(), 0); });
    }
    const s = this._s, t = this._theme;
    if (t !== 'blau') this.setAttribute('nova-theme', t); else this.removeAttribute('nova-theme');
    const hg = s?.allgemein?.hintergrund;
    const bg = hg && hg !== 'keiner' ? bgOf(hg === 'passend' ? t : hg) : null;
    if (bg) this.style.setProperty('--nova-panel-bg', bg); else this.style.removeProperty('--nova-panel-bg');
    const nav = r.querySelector('nav'), main = r.querySelector('main');
    // Während jemand tippt, die Seite nicht neu aufbauen (Feld würde den Fokus verlieren)
    const a = r.activeElement;
    if (a && a.matches?.('input')) { this._dirty = true; return; }
    this._dirty = false;
    nav.innerHTML = `${SECTIONS.map(([k, ic, name]) => {
      const off = s && NEEDS[k] && !s.module[NEEDS[k][0]];
      return `<button class="${k === this._tab ? 'on' : ''}" data-tab="${k}" aria-current="${k === this._tab ? 'page' : 'false'}"><ha-icon icon="${ic}"></ha-icon>${esc(name)}${off ? '<span class="off">aus</span>' : ''}</button>`;
    }).join('')}${s ? `<button class="rs ${this._arm === 'reset:*' ? 'arm' : ''}" data-reset="*">${this._arm === 'reset:*' ? 'Wirklich alles zurücksetzen?' : 'Alles zurücksetzen'}</button>` : ''}
${this._ver ? `<div class="ver">Nova Homeverse ${esc(this._ver)}</div>` : ''}`;
    if (this._err) { main.innerHTML = `<section class="pane msg"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${esc(this._err)}</span></section>`; return; }
    if (!s) { main.innerHTML = '<section class="pane msg"><span>Lade Einstellungen …</span></section>'; return; }
    const [, icon, name] = SECTIONS.find(([k]) => k === this._tab);
    main.innerHTML = `<section class="pane"><h2><ha-icon icon="${icon}"></ha-icon>${esc(name)}</h2>${this._pane(this._tab)}${this._resetBtn(this._tab)}</section>`;
  }

  async _addStore() {
    const inp = this.shadowRoot.querySelector('[data-in="newstore"]');
    const name = inp?.value.trim();
    if (!name) { inp?.focus(); return; }
    inp.value = '';
    inp.blur();
    await this._ws({type: 'nova_homeverse/shopping/store_save', store: {name}}, 'Geschäft angelegt');
  }

  async _renameStore(id) {
    const name = this.shadowRoot.querySelector(`[data-rename="${CSS.escape(id)}"]`)?.value.trim();
    this._edit = null;
    if (name && name !== this._stores.find(x => x.id === id)?.name) await this._ws({type: 'nova_homeverse/shopping/store_save', store: {id, name}}, 'Umbenannt');
    this._render();
  }

  _click(e) {
    const b = e.target.closest('button');
    if (!b) return;
    const d = b.dataset;
    if (d.tab) {
      this._tab = d.tab; this._edit = null; this._arm = null;
      try { localStorage.setItem('nova-panel-tab', d.tab); } catch { /* egal */ }
      this._render();
      this.shadowRoot.querySelector('main')?.scrollIntoView?.({block: 'nearest'});
      return;
    }
    if (!this._s) return;
    if (d.set) {
      const [sec, key] = d.set.split('.');
      this._set(sec, {[key]: JSON.parse(d.v)});
    } else if (d.step) {
      const n = Math.min(50, Math.max(1, this._s.rezepte.standard_portionen + Number(d.step)));
      if (n !== this._s.rezepte.standard_portionen) this._set('rezepte', {standard_portionen: n});
    } else if (d.save) {
      const [sec, key] = d.save.split('.');
      const inp = this.shadowRoot.querySelector(`[data-in="${d.save}"]`);
      const v = inp?.value.trim() || null;
      if (key === 'token' && !v) return;
      inp?.blur();
      this._set(sec, {[key]: v});
    } else if (d.clear) {
      const [sec, key] = d.clear.split('.');
      this._set(sec, {[key]: null});
    } else if (d.reset) {
      if (this._armed(`reset:${d.reset}`)) { this._reset(d.reset === '*' ? null : d.reset); this._render(); }
    } else if ('add' in d) {
      this._addStore();
    } else if (d.edit) {
      this._edit = d.edit; this._arm = null; this._render();
      const inp = this.shadowRoot.querySelector(`[data-rename="${CSS.escape(d.edit)}"]`);
      inp?.focus(); inp?.select();
    } else if (d.rsave) {
      this._renameStore(d.rsave);
    } else if ('rcancel' in d) {
      this._edit = null; this._render();
    } else if (d.del) {
      if (this._armed(`del:${d.del}`)) { this._ws({type: 'nova_homeverse/shopping/store_delete', store_id: d.del}, 'Geschäft gelöscht'); this._render(); }
    }
  }

  _key(e) {
    if (e.key !== 'Enter' && e.key !== 'Escape') return;
    const t = e.target;
    if (t.dataset?.rename) {
      e.preventDefault();
      if (e.key === 'Enter') this._renameStore(t.dataset.rename); else { this._edit = null; t.blur(); this._render(); }
    } else if (t.dataset?.in === 'newstore' && e.key === 'Enter') {
      e.preventDefault(); this._addStore();
    } else if (t.dataset?.in && e.key === 'Enter') {
      e.preventDefault(); this.shadowRoot.querySelector(`[data-save="${t.dataset.in}"]`)?.click();
    }
  }

  _change(e) {
    const sel = e.target.closest('select[data-sel]');
    if (sel) { const [sec, key] = sel.dataset.sel.split('.'); this._set(sec, {[key]: sel.value || null}); }
  }
}

if (!customElements.get('nova-homeverse-panel')) customElements.define('nova-homeverse-panel', NovaPanel);
