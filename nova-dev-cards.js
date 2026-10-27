/* Nova Cards v0.10.1b1 DEV (nur printer) – Testbuild, alle Karten als custom:nova-dev-*. Nicht veröffentlichen. */
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/shared/define.js
  var DEV = true;
  var tag = (name) => `${DEV ? "nova-dev-" : "nova-"}${name}`;
  var define = (name, cls, meta) => {
    const t = tag(name);
    if (!customElements.get(t)) customElements.define(t, cls);
    if (meta) {
      window.customCards = window.customCards || [];
      if (DEV) meta = { ...meta, name: `${meta.name} (Dev)` };
      if (!window.customCards.some((c) => c.type === t)) window.customCards.push({ type: t, preview: true, ...meta });
    }
  };
  var REPO = "https://github.com/Blackstar9119/nova-cards";
  var docUrl = (anchor) => `${REPO}#${anchor}`;

  // src/shared/utils.js
  var esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]);
  var dom = (id) => String(id || "").split(".")[0];
  var isImg = (s) => typeof s === "string" && /^(\/|https?:|data:image)/.test(s);
  var NUMRE = /^-?\d+(\.\d+)?$/;
  var toObj = (x) => typeof x === "string" ? { entity: x } : { ...x };
  var setIcon = (el, ic) => {
    if (el._ic === ic) return;
    el._ic = ic;
    el.innerHTML = isImg(ic) ? `<img src="${esc(ic)}" alt="">` : `<ha-icon icon="${esc(ic)}"></ha-icon>`;
  };

  // src/shared/state.js
  var TOGGLE = ["light", "switch", "input_boolean", "fan", "cover", "group", "siren", "humidifier", "automation", "media_player", "valve"];
  var PRESS = { button: ["button", "press"], input_button: ["input_button", "press"], script: ["script", "turn_on"], scene: ["scene", "turn_on"] };
  var fmtState = (h, s) => {
    try {
      return h.formatEntityState ? h.formatEntityState(s) : s.state + (s.attributes.unit_of_measurement ? " " + s.attributes.unit_of_measurement : "");
    } catch {
      return s.state;
    }
  };
  var langOf = (h) => h.locale?.language || h.language || "de";
  var tzOf = (h) => h.locale?.time_zone === "server" ? h.config?.time_zone : void 0;

  // src/shared/actions.js
  var fire = (el, type, detail) => el.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  var moreInfo = (el, entityId) => fire(el, "hass-more-info", { entityId });
  var hassAction = (el, config, action) => fire(el, "hass-action", { config, action });
  function runAction(card, o, kind, info) {
    const a = o[`${kind}_action`], id = o.entity;
    if (a?.action === "none") return;
    const custom = a?.action && a.action !== "default";
    const d = dom(id), canRun = !!(PRESS[d] || TOGGLE.includes(d));
    if (kind === "tap" && o.confirm && (custom || !info && canRun) && !window.confirm(o.confirm)) return;
    if (custom) return hassAction(card, { entity: id, [`${kind}_action`]: a }, kind);
    if (!id) return;
    if (kind === "hold" || info || !canRun) return moreInfo(card, id);
    if (PRESS[d]) return card._h.callService(...PRESS[d], { entity_id: id });
    card._h.callService("homeassistant", "toggle", { entity_id: id });
  }

  // src/shared/long-press.js
  function press(el, { tap, hold, holdMs = 500, isolate = false }) {
    let t, held = false;
    const clr = () => clearTimeout(t);
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.classList.add("tap");
    el.addEventListener("pointerdown", () => {
      held = false;
      t = setTimeout(() => {
        held = true;
        hold && hold();
      }, holdMs);
    });
    el.addEventListener("pointerup", (e) => {
      clr();
      if (!held && tap) tap();
      e.stopPropagation();
    });
    el.addEventListener("pointerleave", clr);
    el.addEventListener("pointercancel", clr);
    el.addEventListener("contextmenu", (e) => e.preventDefault());
    if (isolate) el.addEventListener("click", (e) => e.stopPropagation());
    el.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      if (isolate) e.stopPropagation();
      tap && tap();
    });
  }

  // src/shared/styles.js
  var NOVA_VARS = `:host{
--nv-bg:var(--nova-background,linear-gradient(160deg,rgba(80,96,128,.55),rgba(22,27,42,.62)));
--nv-border:var(--nova-border-color,rgba(255,255,255,.14));
--nv-fg:var(--nova-text-color,#fff);
--nv-accent:var(--nova-accent-color,#f5b83d);
--nv-accent-fg:var(--nova-accent-text-color,#3a2a00);
--nv-active:var(--nova-active-color,#3d8bf5);
--nv-active-fg:var(--nova-active-text-color,#fff);
--nv-warn:var(--nova-warning-color,#7cc4ff);
--nv-error:var(--nova-error-color,#ff6b6b);
--nv-chip:var(--nova-chip-color,rgba(255,255,255,.13));
--nv-radius:var(--nova-radius,24px);
--nv-blur:var(--nova-blur,20px);
--nv-a1:var(--nova-accent-1,#3d8bf5);--nv-a1-fg:var(--nova-accent-1-text,#fff);
--nv-a2:var(--nova-accent-2,#f5b83d);--nv-a2-fg:var(--nova-accent-2-text,#3a2a00);
--nv-a3:var(--nova-accent-3,#b5794a);--nv-a3-fg:var(--nova-accent-3-text,#fff);
--nv-a4:var(--nova-accent-4,#4caf6a);--nv-a4-fg:var(--nova-accent-4-text,#fff);
--nv-neutral:var(--nova-neutral,#7b8794);--nv-neutral-fg:var(--nova-neutral-text,#fff);
--nv-box:var(--nova-box-background,rgba(255,255,255,.09));--nv-box-border:var(--nova-box-border-color,rgba(255,255,255,.1));
--nv-popup-bg:var(--nova-popup-background,linear-gradient(160deg,rgba(92,110,148,.78),rgba(22,27,42,.88)));
--nv-popup-base:var(--nova-popup-base-color,rgba(22,27,42,.88));
--nv-popup-head:var(--nova-popup-header-color,rgba(60,72,100,.85));
--nv-popup-backdrop:var(--nova-popup-backdrop,rgba(8,12,22,.5));
--nv-popup-r:var(--nova-popup-radius,28px)}`;
  var ROLES = { neutral: "neutral", "accent-1": "a1", "accent-2": "a2", "accent-3": "a3", "accent-4": "a4" };
  var roleVars = (r) => {
    const k = ROLES[r] || ROLES.neutral;
    return { c: `var(--nv-${k})`, fg: `var(--nv-${k}-fg)` };
  };
  var GLASS = `:host{position:relative}
:host::before{content:'';position:absolute;inset:0;border-radius:var(--nv-radius);background:var(--nv-bg);pointer-events:none;
backdrop-filter:blur(var(--nv-blur)) saturate(150%);-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(150%)}
:host(.nv-flat)::before{display:none}
:host(.nv-na)::before{opacity:.4}`;
  var CARD_CSS = `${NOVA_VARS}
:host{display:block;height:100%}
${GLASS}
.g{height:100%;box-sizing:border-box;border-radius:var(--nv-radius);
border:1px solid var(--nv-border);box-shadow:0 10px 30px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.12);
color:var(--nv-fg);overflow:hidden;position:relative;font-family:var(--ha-font-family-body,Roboto,sans-serif)}
ha-icon{--mdc-icon-size:20px;display:flex}`;
  var PANEL_CSS = `
:host{display:block;height:100%;container-type:inline-size}
${GLASS}
.g{height:100%;box-sizing:border-box;border-radius:var(--nv-radius);
border:1px solid var(--nv-border);box-shadow:0 10px 30px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.12);
color:var(--nv-fg);overflow:hidden;position:relative;font-family:var(--ha-font-family-body,Roboto,sans-serif);
padding:14px 16px;display:flex;flex-direction:column;gap:12px;transition:box-shadow .4s}
.g.warn{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-warn) 60%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.g.err{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-error) 70%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
ha-icon{--mdc-icon-size:20px;display:flex}
img{object-fit:contain}
.blk[hidden],[hidden]{display:none!important}
.bt{font-size:11.5px;font-weight:600;opacity:.6;text-transform:uppercase;letter-spacing:.05em;margin-bottom:4px}
.tap{cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}
.tap:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
.na{opacity:.4}
.ic{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);transition:background-color .25s,color .25s,border-color .25s,box-shadow .25s,transform .25s,opacity .25s}
.ic ha-icon{--mdc-icon-size:18px}.ic img{width:20px;height:20px}
.on>.ic{background:var(--nv-accent);color:var(--nv-accent-fg);box-shadow:0 0 14px color-mix(in srgb,var(--nv-accent) 55%,transparent)}
.nm{flex:1;min-width:0}.nm b,.nm small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nm b{font-weight:500;font-size:13.5px}.nm small{font-size:11.5px;opacity:.6}
.hd{display:flex;align-items:center;gap:10px}
.hd .ic{width:44px;height:44px}.hd .ic ha-icon{--mdc-icon-size:24px}.hd .ic img{width:26px;height:26px}
.hd .nm b{font-weight:600;font-size:15px}.hd .nm small{font-size:12px;opacity:.65}
.pct{font-weight:600;font-size:14px}
.hb{width:36px;height:36px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip)}
.hb:active,.hd .ic:active,.pill:active,.row:active .ic{transform:scale(.92)}
.prog{height:6px;border-radius:3px;background:rgba(255,255,255,.12);overflow:hidden;margin-top:10px}
.prog i{display:block;height:100%;width:0;background:var(--nv-accent);border-radius:3px;transition:width 1s}
.list{display:grid;grid-template-columns:repeat(var(--cols,1),minmax(0,1fr));column-gap:14px}
.kv{display:flex;align-items:center;gap:8px;font-size:13px;padding:7px 0;border-top:1px solid rgba(255,255,255,.08);min-width:0}
.kv ha-icon{--mdc-icon-size:17px;opacity:.7}.kv img{width:17px;height:17px}
.kv .k{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kv .v{opacity:.8;text-align:right;white-space:nowrap}
.pills{display:flex;flex-wrap:wrap;gap:7px}
.pill{padding:7px 12px;border-radius:999px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);font-size:12.5px;display:inline-flex;gap:6px;align-items:center;white-space:nowrap;transition:background-color .2s,color .2s,border-color .2s,box-shadow .2s,transform .2s,opacity .2s;min-width:0}
.pill ha-icon{--mdc-icon-size:16px}.pill img{width:16px;height:16px}
.pill.on{background:var(--nv-active);color:var(--nv-active-fg);border-color:transparent;box-shadow:0 0 14px color-mix(in srgb,var(--nv-active) 50%,transparent)}
.pills.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--nova-modular-button-width,104px),1fr));gap:8px}
.pills.grid .pill{flex-direction:column;justify-content:center;border-radius:16px;padding:10px 8px;white-space:normal;text-align:center}
.pills.grid .pill ha-icon{--mdc-icon-size:22px}.pills.grid .pill img{width:22px;height:22px}
.row{display:flex;align-items:center;gap:10px;padding:5px 0;min-width:0}
.sw{width:38px;height:22px;border-radius:11px;background:rgba(255,255,255,.18);position:relative;flex:none;transition:background .25s}
.sw::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:#fff;transition:transform .25s}
.row.on .sw{background:var(--nv-active)}.row.on .sw::after{transform:translateX(16px)}
.sl{display:flex;flex-direction:column;gap:6px;padding:6px 0}
.sl .kv{border:none;padding:0}
.sl .v{font-weight:600;opacity:1}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:22px;border-radius:11px;margin:0;outline:none;
background:linear-gradient(90deg,var(--nv-accent) 0 var(--p,0%),rgba(255,255,255,.14) var(--p,0%) 100%)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.4)}
input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#fff;border:none}
.als{display:flex;flex-direction:column;gap:6px}.als.chips{flex-direction:row;flex-wrap:wrap}
.al{--c:var(--nv-warn);display:flex;align-items:center;gap:8px;padding:8px 12px;border-radius:14px;font-size:13px;
background:color-mix(in srgb,var(--c) 18%,transparent);border:1px solid color-mix(in srgb,var(--c) 45%,transparent)}
.al.error{--c:var(--nv-error)}.al.info{--c:var(--nv-active)}
.al ha-icon{color:var(--c);--mdc-icon-size:18px}
.chips .al{border-radius:999px;padding:5px 10px;font-size:12px}
@container (max-width:280px){.list{grid-template-columns:1fr}.g{padding:12px}}`;
  var EDITOR_CSS = `
.wrap{display:flex;flex-direction:column;gap:16px}
h3{margin:8px 0 0;font-size:15px;font-weight:600}
details.item{border:1px solid var(--divider-color,#444);border-radius:12px;overflow:hidden}
details.item>summary{display:flex;align-items:center;gap:10px;padding:10px 12px;cursor:pointer;list-style:none;background:var(--secondary-background-color)}
details.item>summary::-webkit-details-marker{display:none}
summary .lbl{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.body{padding:12px;display:flex;flex-direction:column;gap:12px}
.ib{background:none;border:none;color:var(--primary-text-color);cursor:pointer;padding:4px;border-radius:50%;display:flex}
.ib:hover{background:var(--secondary-background-color)}.ib[disabled]{opacity:.3;pointer-events:none}
.add{align-self:flex-start;display:flex;gap:6px;align-items:center;padding:8px 14px;border-radius:999px;border:1px solid var(--primary-color);background:none;color:var(--primary-color);cursor:pointer;font:inherit}
.hint{font-size:12px;opacity:.7;margin:0}
`;
  var EDITOR_ICON_CSS = `ha-icon{display:flex}`;
  var EDITOR_LIST_CSS = `
.adds{display:flex;flex-wrap:wrap;gap:8px}
details.item details.item>summary{background:none}
h4{margin:4px 0 0;font-size:13px;font-weight:600;opacity:.8}`;
  var SECTION_EDITOR_CSS = `${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}`;

  // src/shared/lifecycle.js
  var GLOBAL = ["entities", "devices", "areas", "floors", "localize", "locale", "language", "themes", "selectedTheme", "config", "user", "connected"];
  var ID = /^[a-z_]+\.[a-z0-9_]+$/;
  var entityIds = (o, out = /* @__PURE__ */ new Set()) => {
    if (typeof o === "string") {
      if (ID.test(o)) out.add(o);
    } else if (o && typeof o === "object") Object.values(o).forEach((v) => entityIds(v, out));
    return out;
  };
  var hassChanged = (prev, next, ids) => {
    if (prev === next) return false;
    if (!prev || !next) return true;
    if (GLOBAL.some((k) => prev[k] !== next[k])) return true;
    const a = prev.states, b = next.states;
    if (a === b) return false;
    for (const id of ids || []) if (a?.[id] !== b?.[id]) return true;
    return false;
  };
  var inPicker = (el) => {
    for (let n = el, i = 0; n && i < 80; i++) {
      if (n.localName === "hui-card-picker") return true;
      n = n.parentElement || n.getRootNode?.().host;
    }
    return false;
  };

  // src/shared/editor-base.js
  var preload;
  var loadForm = () => customElements.get("ha-form") ? Promise.resolve() : preload ||= (async () => {
    try {
      await (await (await window.loadCardHelpers()).createCardElement({ type: "button", entity: "sun.sun" }))?.constructor?.getConfigElement?.();
    } catch (e) {
      console.warn("[nova-cards] Editor nicht vorgeladen", e);
    }
    await Promise.race([customElements.whenDefined("ha-form"), new Promise((r) => setTimeout(r, 3e3))]);
  })();
  var names = (s) => s.flatMap((x) => x.schema ? names(x.schema) : x.name ? [x.name] : []);
  var empty = (v) => v == null || v === "" || Array.isArray(v) && !v.length;
  var merge = (base, keys, val) => {
    const o = { ...base };
    keys.forEach((k) => empty(val[k]) ? delete o[k] : o[k] = val[k]);
    return o;
  };
  var DEBOUNCE = 300;
  var NovaEditorBase = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._forms = [];
      this._open = /* @__PURE__ */ new Set();
      this._keep = /* @__PURE__ */ new Map();
      this._ids = /* @__PURE__ */ new Set();
      this.addEventListener("focusout", () => this._flush());
    }
    // hass kommt mehrmals pro Sekunde – an die Felder nur weitergeben, wenn es den Editor betrifft
    set hass(h) {
      const old = this._hass;
      this._hass = h;
      if (hassChanged(old, h, this._ids)) this._forms.forEach((f) => {
        f.hass = h;
      });
    }
    setConfig(c) {
      const s = JSON.stringify(c);
      if (s === this._emitted || this._pending && s === JSON.stringify(this._pending)) {
        this._config = c;
        return;
      }
      clearTimeout(this._dt);
      this._pending = null;
      this._config = JSON.parse(s);
      this._ids = entityIds(this._config);
      this._onExternalConfig?.();
      this._rebuild();
    }
    disconnectedCallback() {
      this._flush();
    }
    async _rebuild() {
      const id = this._bid = (this._bid || 0) + 1;
      await loadForm();
      if (id !== this._bid) return;
      this._forms = [];
      this._pool = this._keep;
      this._keep = /* @__PURE__ */ new Map();
      try {
        this._build();
      } finally {
        this._pool = null;
      }
    }
    _emit(c) {
      this._config = c;
      this._ids = entityIds(c);
      this._pending = c;
      clearTimeout(this._dt);
      this._dt = setTimeout(() => this._flush(), DEBOUNCE);
    }
    _flush() {
      clearTimeout(this._dt);
      const c = this._pending;
      if (!c) return;
      this._pending = null;
      this._emitted = JSON.stringify(c);
      fire(this, "config-changed", { config: c });
    }
    // Element vom letzten Aufbau weiterverwenden (gleicher Typ, gleiche Reihenfolge), sonst mit create() neu erzeugen
    _reuse(type, create) {
      const el = this._pool?.get(type)?.shift() || create();
      (this._keep.get(type) || this._keep.set(type, []).get(type)).push(el);
      return el;
    }
    _form(schema, data, cb) {
      const f = this._reuse(`form:${JSON.stringify(schema)}`, () => {
        const f2 = document.createElement("ha-form");
        f2.schema = schema;
        f2.computeLabel = (s) => this.constructor.labels?.[s.name] ?? s.name;
        f2.computeHelper = (s) => this.constructor.helpers?.[s.name];
        f2.addEventListener("value-changed", (e) => {
          e.stopPropagation();
          f2.data = e.detail.value;
          f2._dk = JSON.stringify(f2.data);
          f2._cb(e.detail.value);
        });
        return f2;
      });
      if (f.hass !== this._hass) f.hass = this._hass;
      const dk = JSON.stringify(data);
      if (f._dk !== dk) {
        f.data = data;
        f._dk = dk;
      }
      f._cb = cb;
      this._forms.push(f);
      return f;
    }
    // Runder Icon-Button (Verschieben, Löschen …)
    _btn(icon, title, fn, dis) {
      const b = document.createElement("button");
      b.className = "ib";
      b.title = title;
      b.disabled = !!dis;
      b.innerHTML = `<ha-icon icon="${icon}"></ha-icon>`;
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        fn();
      });
      return b;
    }
    // „+ … hinzufügen“
    _add(label, fn) {
      const a = document.createElement("button");
      a.className = "add";
      a.innerHTML = `<ha-icon icon="mdi:plus"></ha-icon>${esc(label)}`;
      a.addEventListener("click", (e) => {
        e.preventDefault();
        fn();
      });
      return a;
    }
    _h3(t) {
      const h = document.createElement("h3");
      h.textContent = t;
      return h;
    }
    _hint(t) {
      const p = document.createElement("p");
      p.className = "hint";
      p.textContent = t;
      return p;
    }
    // Aufklapp-Eintrag; key merkt sich, ob er offen ist. Liefert [details, summary, body].
    // Mit fill(body, summary) wird der Inhalt erst beim ersten Aufklappen gebaut – zugeklappte Einträge kosten dann nichts
    _details(key, icon, label, btns, fill) {
      const d = document.createElement("details");
      d.className = "item";
      d.open = this._open.has(key);
      d.addEventListener("toggle", (e) => {
        e.stopPropagation();
        d.open ? this._open.add(key) : this._open.delete(key);
      });
      const s = document.createElement("summary");
      s.innerHTML = `<ha-icon icon="${esc(icon)}"></ha-icon><span class="lbl"></span>`;
      s.querySelector(".lbl").textContent = label;
      s.append(...btns);
      const body = document.createElement("div");
      body.className = "body";
      d.append(s, body);
      if (fill) {
        let done = false;
        const go = () => {
          if (!done && d.open) {
            done = true;
            fill(body, s);
          }
        };
        d.addEventListener("toggle", go);
        go();
      }
      return [d, s, body];
    }
    // Aufklappbarer Bereich im Stil des Pop-up-Editors (Icon + Überschrift, Inhalt erst beim Aufklappen).
    // Welche Bereiche offen sind, bleibt beim Neuaufbau erhalten; anfangs offen: static openSections der Unterklasse.
    _section(key, icon, label, fill) {
      const open = this._openSecs ||= new Set(this.constructor.openSections || []), k = `sec.${key}`;
      if (open.has(key)) this._open.add(k);
      else this._open.delete(k);
      const [d] = this._details(k, icon, label, [], fill);
      d.classList.add("sec");
      d.addEventListener("toggle", () => {
        if (d.open) open.add(key);
        else open.delete(key);
      });
      return d;
    }
    // Zwischenüberschrift innerhalb eines Bereichs
    _h4(t) {
      const h = document.createElement("h4");
      h.textContent = t;
      return h;
    }
    // Hoch / Runter / Löschen für Eintrag i von n
    _itemBtns(i, n, move, del) {
      return [
        this._btn("mdi:arrow-up", "Nach oben", () => move(-1), i === 0),
        this._btn("mdi:arrow-down", "Nach unten", () => move(1), i === n - 1),
        this._btn("mdi:delete-outline", "Löschen", del)
      ];
    }
    // Liste unter Konfig-Schlüssel k (z. B. buttons, rooms): Aufklapp-Einträge + „hinzufügen“.
    // m = {item, icon}; view bereitet einen Eintrag fürs Formular auf
    _items(k) {
      return [].concat(this._config[k] || []).map(toObj);
    }
    _setItems(k, arr) {
      const c = { ...this._config };
      if (arr.length) c[k] = arr;
      else delete c[k];
      this._emit(c);
    }
    // schema darf eine Funktion des Eintrags sein (Felder je nach Einstellung); ändert sich dadurch das Schema, wird neu aufgebaut
    _itemList(w, k, schema, m, addLabel, view = (it) => it) {
      const items = this._items(k), sch = typeof schema === "function" ? schema : () => schema;
      items.forEach((it, j) => {
        const [d, s] = this._details(
          `${k}.${j}`,
          it.icon || m.icon,
          this._ilabel(it, j, m),
          this._itemBtns(
            j,
            items.length,
            (dir) => this._moveItem(k, j, dir),
            () => {
              this._open = /* @__PURE__ */ new Set();
              this._setItems(k, this._items(k).filter((_, x) => x !== j));
              this._rebuild();
            }
          ),
          (body) => {
            const cur = this._items(k)[j] || it;
            body.append(this._form(sch(cur), view(cur), (v) => {
              const arr = this._items(k), was = JSON.stringify(sch(arr[j]));
              arr[j] = merge(arr[j], names(sch(arr[j])), v);
              this._setItems(k, arr);
              s.querySelector(".lbl").textContent = this._ilabel(arr[j], j, m);
              if (JSON.stringify(sch(arr[j])) !== was) this._rebuild();
            }));
          }
        );
        w.append(d);
      });
      w.append(this._add(addLabel, () => {
        const n = [...this._items(k), {}];
        this._open = new Set([...this._open].filter((x) => x.startsWith("sec.")).concat(`${k}.${n.length - 1}`));
        this._setItems(k, n);
        this._rebuild();
      }));
    }
    _moveItem(k, j, dir) {
      const arr = this._items(k), t = j + dir;
      [arr[j], arr[t]] = [arr[t], arr[j]];
      this._open = /* @__PURE__ */ new Set([`${k}.${t}`]);
      this._setItems(k, arr);
      this._rebuild();
    }
    _ilabel(it, j, m) {
      return `${j + 1}. ${it.name || it.message || it.entity && this._hass?.states[it.entity]?.attributes.friendly_name || it.entity || `Neu: ${m.item}`}`;
    }
  };

  // src/shared/editor-schema.js
  var g2 = (...schema) => ({ type: "grid", name: "", schema });
  var T = { text: {} };
  var I = { icon: {} };
  var A = { ui_action: {} };
  var sel = (n, opts) => ({ name: n, selector: { select: { mode: "dropdown", options: opts.map(([value, label]) => ({ value, label })) } } });
  var ROLE = (n) => sel(n, [["neutral", "Neutral"], ["accent-1", "Akzent 1"], ["accent-2", "Akzent 2"], ["accent-3", "Akzent 3"], ["accent-4", "Akzent 4"]]);
  var NAMEICON = g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } });
  var BASE_LABELS = {
    name: "Name",
    icon: "Icon",
    status: "Status-Entität",
    active: "Aktiv-Entität",
    progress: "Fortschritt (%)",
    tap_action: "Aktion beim Antippen",
    hold_action: "Aktion bei langem Drücken",
    button_icon: "Touch-Button oben: Icon",
    button_action: "Touch-Button oben: Aktion",
    title: "Überschrift (optional)",
    layout: "Darstellung",
    columns: "Spalten",
    entity: "Entität",
    unit: "Einheit",
    decimals: "Nachkommastellen",
    min: "Min",
    max: "Max",
    step: "Schritt",
    format: "Anzeige",
    confirm: "Sicherheitsabfrage",
    state: "Warnen bei Zustand",
    state_not: "Warnen außer bei",
    above: "Warnen über",
    below: "Warnen unter",
    message: "Meldung",
    level: "Stufe",
    glow: "Kartenrahmen einfärben"
  };

  // src/printer-messages.js
  var MSG = {
    heat: { label: "Aufheizen", icon: "mdi:fire", lvl: "info", text: "Heizt auf", fx: "heat" },
    cool: { label: "Abkühlen", icon: "mdi:snowflake-thermometer", lvl: "info", text: "Kühlt ab", fx: "cool" },
    level: { label: "Bett leveln", icon: "mdi:grid", lvl: "info", text: "Bett wird vermessen", fx: "level" },
    wipe: { label: "Düse reinigen / wischen", icon: "mdi:broom", lvl: "info", text: "Düse wird gereinigt", fx: "wipe" },
    calib: { label: "Kalibrieren (Extrusion, Flow, Genauigkeit)", icon: "mdi:tune-vertical", lvl: "info", text: "Kalibriert", fx: "calib" },
    scan: { label: "Prüfen / Scannen (Erste Schicht, Druckplatte, Kamera)", icon: "mdi:radar", lvl: "info", text: "Prüft", fx: "scan" },
    home: { label: "Referenzfahrt / Achsen", icon: "mdi:axis-arrow", lvl: "info", text: "Referenzfahrt", fx: "home" },
    change: { label: "Filament- und AMS-Wechsel", icon: "mdi:swap-horizontal", lvl: "info", text: "Filament wird gewechselt", fx: "change" },
    empty: { label: "Filament leer", icon: "mdi:printer-3d-nozzle-alert-outline", lvl: "warning", text: "Filament ist leer", fx: "empty" },
    tangle: { label: "Filament verheddert / klemmt", icon: "mdi:printer-3d-nozzle-alert-outline", lvl: "warning", text: "Filament klemmt oder ist verheddert", fx: "tangle" },
    ams: { label: "AMS-Fehler", icon: "mdi:tray-alert", lvl: "warning", text: "Problem mit dem AMS", fx: "ams" },
    spaghetti: { label: "Spaghetti / Erste Schicht fehlerhaft", icon: "mdi:alert-octagon-outline", lvl: "error", text: "Spaghetti erkannt", fx: "spaghetti" },
    shift: { label: "Objekt verrutscht / Schritte verloren", icon: "mdi:arrow-left-right-bold-outline", lvl: "error", text: "Objekt verrutscht", fx: "shift" },
    clog: { label: "Düse verstopft", icon: "mdi:printer-3d-nozzle-alert", lvl: "error", text: "Düse verstopft", fx: "clog" },
    door: { label: "Tür offen", icon: "mdi:door-open", lvl: "warning", text: "Tür ist offen", fx: "door" },
    lid: { label: "Deckel offen", icon: "mdi:arrow-collapse-up", lvl: "warning", text: "Deckel ist offen", fx: "lid" },
    fan: { label: "Lüfterfehler", icon: "mdi:fan-alert", lvl: "error", text: "Lüfter dreht nicht richtig", fx: "fan" },
    temp: { label: "Temperaturfehler", icon: "mdi:thermometer-alert", lvl: "error", text: "Temperatur außerhalb des Bereichs", fx: "temp" },
    warn: { label: "Unbekannte Meldungen", icon: "mdi:alert-outline", lvl: "warning", text: "Meldung vom Drucker", fx: "warn" }
  };
  var STAGES = {
    heatbed_preheating: "heat",
    heating_hotend: "heat",
    waiting_for_heatbed_temperature: "heat",
    heating_chamber: "heat",
    preparing_hotend: "heat",
    thermal_preconditioning: "heat",
    checking_extruder_temperature: "heat",
    waiting_chamber_temperature_equalize: "heat",
    bed_level_high_temperature: "level",
    cooling_chamber: "cool",
    heated_bedcooling: "cool",
    cooling_nozzle: "cool",
    auto_bed_leveling: "level",
    bed_level_phase_1: "level",
    bed_level_phase_2: "level",
    measuring_surface: "level",
    scanning_bed_surface: "scan",
    cleaning_nozzle_tip: "wipe",
    moving_toolhead_above_purge_chute: "wipe",
    pre_extrusion_before_printing: "wipe",
    calibrating_extrusion: "calib",
    calibrating_extrusion_flow: "calib",
    print_calibration_lines: "calib",
    calibrate_nozzle_offset: "calib",
    absolute_accuracy_calibration: "calib",
    check_absolute_accuracy_before_calibration: "calib",
    check_absolute_accuracy_after_calibration: "calib",
    calibrating_motor_noise: "home",
    motor_noise_showoff: "home",
    sweeping_xy_mech_mode: "home",
    homing_toolhead: "home",
    moving_toolhead_to_center_of_heatbed: "home",
    calibrating_cutter_model_offset: "calib",
    homing_blade_holder: "home",
    calibrating_blade_holder_position: "calib",
    hotend_pick_place_test: "home",
    inspecting_first_layer: "scan",
    identifying_build_plate_type: "scan",
    calibrating_micro_lidar: "scan",
    calibrating_live_view_camera: "scan",
    calibrate_birdeye_camera: "scan",
    check_birdeye_camera_position: "scan",
    calibrating_camera_offset: "scan",
    build_plate_alignment_detection: "scan",
    heatbed_surface_foreign_object_detection: "scan",
    heatbed_underside_foreign_object_detection: "scan",
    check_plaform: "scan",
    hotend_type_detection: "scan",
    calibrating_detection_nozzle_clumping: "scan",
    check_quick_release: "scan",
    measuring_rotary_attachment: "scan",
    laser_calibration: "calib",
    changing_filament: "change",
    filament_loading: "change",
    filament_unloading: "change",
    preparing_ams: "change",
    check_material: "change",
    check_material_position: "change",
    check_door_and_cover: "door",
    // Pausen mit Grund
    paused_filament_runout: ["empty", 1],
    paused_ams_lost: ["ams", 1],
    paused_skipped_step: ["shift", 1],
    paused_first_layer_error: ["spaghetti", 1],
    paused_nozzle_clog: ["clog", 1],
    paused_nozzle_filament_covered_detected: ["clog", 1],
    paused_low_fan_speed_heat_break: ["fan", 1],
    paused_nozzle_temperature_malfunction: ["temp", 1],
    paused_heat_bed_temperature_malfunction: ["temp", 1],
    paused_chamber_temperature_control_error: ["temp", 1],
    paused_front_cover_falling: ["warn", 1],
    paused_cutter_error: ["warn", 1]
  };
  var PAUSE_STAGES = ["paused_user", "paused_user_gcode", "m400_pause"];
  var QUIET_STAGES = ["printing", "idle", "offline", "unknown", "active_arc_fitting", "purifying_chamber_air"];
  var CODES = {
    "0700": "ams",
    "0701": "ams",
    "0702": "ams",
    "0703": "ams",
    "1200": "ams",
    "1201": "ams",
    "1800": "ams",
    "1801": "ams"
  };
  var WORDS = [
    ["spaghetti", /spaghetti|first layer|erste[nr]? schicht|foreign object|fremdkörper|fremdobjekt/i],
    ["shift", /layer shift|verschoben|verrutscht|skipped step|schritte? (verloren|übersprungen)|step loss|position.*(lost|verloren)/i],
    ["clog", /clog|verstopf|nozzle.*(wrapped|covered|clump)|düse.*(umwickelt|bedeckt|verklumpt)|extrusion.*(abnormal|anomal)/i],
    ["empty", /run(s)? out|runout|aufgebraucht|ist leer|\bleer\b|no filament|kein filament/i],
    ["tangle", /tangl|verheddert|verwickelt|klemmt|feed.*(fail|resistance)|zuführ.*(fehl|widerstand)|fehler beim einziehen|failed to (feed|pull|extrude)/i],
    ["door", /\bdoor\b|\btür\b/i],
    ["lid", /\blid\b|top cover|deckel/i],
    ["fan", /\bfan\b|lüfter|luefter/i],
    ["temp", /temperat|thermistor|heater|heizung|overheat|überhitz/i],
    ["ams", /\bams\b/i],
    ["level", /level|nivellier/i],
    ["wipe", /purge|wipe|abstreif|nozzle.*clean|düse.*reinig/i],
    ["calib", /calibrat|kalibr/i],
    ["home", /homing|referenzfahrt/i]
  ];
  var CRE = /(?:HMS_)?([0-9A-F]{4})[_-]?([0-9A-F]{4})(?:[_-]?([0-9A-F]{4})[_-]?([0-9A-F]{4}))?/i;
  var codeOf = (v) => {
    const m = String(v ?? "").match(CRE);
    return m ? [m[1], m[2], m[3], m[4]].filter(Boolean).join("_").toUpperCase() : null;
  };
  function classify(code, text) {
    let hit = null;
    if (code) {
      for (const k of Object.keys(CODES)) if (code.startsWith(k) && (!hit || k.length > hit.length)) hit = k;
    }
    const w = text ? WORDS.find(([, re]) => re.test(text)) : null;
    if (hit && (hit.length > 4 || !w)) return CODES[hit];
    return w ? w[0] : hit ? CODES[hit] : "warn";
  }
  function parseErrors(s, lvl) {
    if (!s || !["on", "problem"].includes(s.state)) return [];
    const a = s.attributes || {}, groups = {};
    for (const [k, v] of Object.entries(a)) {
      if (["friendly_name", "device_class", "icon", "Count", "count"].includes(k) || v == null || typeof v === "object") continue;
      const m = k.match(/^(\d+)[-_ ](.+)$/), n = m ? m[1] : "0", f = (m ? m[2] : k).toLowerCase();
      (groups[n] ||= {})[f] = String(v);
    }
    const out = Object.values(groups).map((g) => {
      const raw = g.error || g.message || g.text || g.description || g.desc || "";
      const code = codeOf(g.code || g.hms_code || g.error_code || raw);
      const text = raw.replace(/^\s*(?:HMS_)?[0-9A-F_-]{9,}\s*[:–-]?\s*/i, "").trim();
      const sev = String(g.severity || "").toLowerCase();
      const l = /fatal|serious|error/.test(sev) ? "error" : /info|common|warn/.test(sev) ? "warning" : lvl;
      return { key: classify(code, text), text, code, lvl: l };
    }).filter((x) => x.text || x.code);
    return out.length ? out : [{ key: "warn", text: "", code: null, lvl }];
  }

  // src/printer.js
  var ENTS = {
    status: ["sensor", ["print_status", "druckstatus"]],
    stage: ["sensor", ["stage", "current_stage", "aktueller_arbeitsschritt"]],
    progress: ["sensor", ["print_progress", "druckfortschritt"]],
    remaining: ["sensor", ["remaining_time", "verbleibende_zeit"]],
    end_time: ["sensor", ["end_time", "endzeit"]],
    layer: ["sensor", ["current_layer", "aktuelle_schicht"]],
    layers: ["sensor", ["total_layers", "gesamtzahl_der_schichten"]],
    nozzle_target: ["sensor", ["target_nozzle_temp", "target_nozzle_temperature", "zieltemperatur_der_duse"]],
    nozzle: ["sensor", ["nozzle_temp", "nozzle_temperature", "temperatur_der_duse"]],
    bed_target: ["sensor", ["target_bed_temp", "target_bed_temperature", "zieltemperatur_vom_druckbett"]],
    bed: ["sensor", ["bed_temp", "bed_temperature", "druckbetttemperatur"]],
    file: ["sensor", ["subtask_name", "task_name", "name_der_aufgabe", "gcode_file", "gcode_dateiname"]],
    hms: ["binary_sensor", ["hms", "hms_errors", "hms_fehler"]],
    print_error: ["binary_sensor", ["print_error", "druckfehler"]],
    door: ["binary_sensor", ["door_open", "door", "tur_offen", "tuer_offen"]],
    online: ["binary_sensor", ["online"]],
    light: ["light", ["chamber_light", "druckraumbeleuchtung"]],
    pause: ["button", ["pause", "druckvorgang_anhalten"]],
    resume: ["button", ["resume", "druckvorgang_fortsetzen"]],
    stop: ["button", ["stop", "druckvorgang_beenden"]],
    fan: ["fan", ["cooling_fan", "druckkopflufter"]]
  };
  var EKEYS = Object.keys(ENTS);
  var isTray = (s) => !!s && s.attributes && "color" in s.attributes && "type" in s.attributes && "remain" in s.attributes;
  var isExt = (h, id) => /external|extern/i.test(`${id} ${h.devices?.[h.entities?.[id]?.device_id]?.name || ""}`);
  var printerDev = (h, c) => c.device || EKEYS.map((k) => h?.entities?.[c[k]]?.device_id).find(Boolean) || null;
  function detect(h, dev) {
    const out = {};
    if (!h?.entities || !dev) return out;
    const ents = Object.values(h.entities).filter((e) => e.device_id === dev), used = /* @__PURE__ */ new Set();
    for (const k of EKEYS) {
      const [d, keys] = ENTS[k];
      const cand = ents.filter((e) => dom(e.entity_id) === d && !used.has(e.entity_id));
      let hit = null;
      for (const key of keys) {
        hit = cand.find((e) => e.translation_key === key) || cand.find((e) => {
          const o = e.entity_id.split(".")[1];
          return o === key || o.endsWith(`_${key}`);
        });
        if (hit) break;
      }
      if (hit) {
        out[k] = hit.entity_id;
        used.add(hit.entity_id);
      }
    }
    return out;
  }
  function trays(h, c, dev) {
    const units = /* @__PURE__ */ new Map();
    let ext = c.external_spool || null;
    const add = (id) => {
      const s = h.states[id];
      if (!isTray(s)) return;
      if (isExt(h, id)) {
        ext ||= id;
        return;
      }
      const d = h.entities?.[id]?.device_id || "x";
      if (!units.has(d)) units.set(d, []);
      units.get(d).push(id);
    };
    if (c.ams_trays?.length) c.ams_trays.forEach(add);
    else if (dev && h.devices && h.entities) {
      const subs = new Set(Object.values(h.devices).filter((d) => d.via_device_id === dev).map((d) => d.id));
      Object.values(h.entities).filter((e) => subs.has(e.device_id) && dom(e.entity_id) === "sensor").map((e) => e.entity_id).sort().forEach(add);
    }
    const nm = (d) => {
      const x = h.devices?.[d];
      return x?.name_by_user || x?.name || "AMS";
    };
    return { units: [...units].map(([d, ids]) => ({ name: nm(d), slots: ids.slice(0, 4).map((id) => slotOf(h.states[id], id)) })).sort((a, b) => a.name.localeCompare(b.name)), ext: ext && h.states[ext] ? slotOf(h.states[ext], ext) : null };
  }
  function slotOf(s, id) {
    const a = s?.attributes || {}, col = typeof a.color === "string" && /^#[0-9a-f]{6}/i.test(a.color) ? a.color.slice(0, 7) : null;
    const r = Number(a.remain);
    return { id, c: col, mat: a.type || "", name: a.name || s?.state || "", rem: isNaN(r) || r < 0 ? null : Math.min(100, r), act: !!a.active, empty: !!a.empty || s?.state === "empty" };
  }
  var PDEF = {
    ams: "auto",
    animation: true,
    glow: true,
    color: "accent-1",
    show_progress: true,
    show_remaining: true,
    show_end_time: true,
    show_layer: true,
    show_nozzle: true,
    show_bed: true,
    show_file: true,
    show_stage: true,
    show_message: true,
    show_ams_list: true,
    show_controls: true,
    show_light: true,
    show_display: true,
    stop_confirm: "Druck wirklich abbrechen?"
  };
  var CLS = ["off", "idle", "heat", "prep", "print", "pause", "done", "error", "cool"];
  var CTXT = { off: "Aus", idle: "Bereit", heat: "Heizt auf", prep: "Bereitet vor", print: "Druckt", pause: "Pausiert", done: "Fertig", error: "Fehler", cool: "Kühlt ab" };
  var BAD = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", ""]);
  var ok = (s) => !!s && !BAD.has(s.state);
  var num = (s) => ok(s) && NUMRE.test(s.state) ? +s.state : null;
  var SECS = { s: 1, sec: 1, min: 60, m: 60, h: 3600, d: 86400 };
  var fmtDur = (sec) => {
    const m = Math.max(0, Math.round(sec / 60));
    return m < 1 ? "< 1 min" : m < 60 ? `${m} min` : `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")} h`;
  };
  var fmtShort = (sec) => {
    const m = Math.max(0, Math.round(sec / 60));
    return `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`;
  };
  var OBJ_H = 44;
  var PLATE = 232;
  var DEMO_STATES = [["print", "Druckt"], ["heat", "Heizt auf"], ["prep", "Bereitet vor"], ["pause", "Pausiert"], ["done", "Fertig"], ["error", "Fehler"], ["cool", "Kühlt ab"], ["idle", "Leerlauf"], ["off", "Aus"]];
  var DEMO_AMS = [
    { name: "AMS A", slots: [
      { c: "#3d8bf5", mat: "PLA", name: "PLA Basic Blau", rem: 82, act: true },
      { c: "#f5f5f0", mat: "PETG", name: "PETG Weiß", rem: 55 },
      { c: "#4caf6a", mat: "PLA", name: "PLA Matt Grün", rem: 23 },
      { c: "#e5533d", mat: "TPU", name: "TPU Rot", rem: 8 }
    ] },
    { name: "AMS B", slots: [{ c: "#222428", mat: "PLA", name: "PLA Schwarz", rem: 90 }, { c: "#f5b83d", mat: "PLA", name: "PLA Gelb", rem: 40 }, { c: null, mat: "", name: "", rem: null, empty: true }, { c: "#9b6bd6", mat: "PETG", name: "PETG Lila", rem: 67 }] }
  ];
  var SLOTX = [64, 104, 144, 184];
  var SPOOL = SLOTX.map((x, i) => `<g class="sl s${i}"><clipPath id="psc${i}"><rect class="fcl" x="${x - 13.5}" y="22" width="27" height="48" rx="7"/></clipPath>
<rect class="hubc" x="${x - 13.5}" y="38" width="27" height="16" rx="3"/><rect class="fl" x="${x - 13.5}" y="22" width="27" height="48" rx="7"/>
<g clip-path="url(#psc${i})"><rect class="cy" x="${x - 14}" y="14" width="28" height="60"/><rect class="wnd" x="${x - 14}" y="14" width="28" height="60"/><rect class="rot" x="${x - 14}" y="14" width="28" height="7"/></g>
<rect class="fg" x="${x - 17.5}" y="18" width="4" height="56" rx="2"/><rect class="fg" x="${x + 13.5}" y="18" width="4" height="56" rx="2"/>
<g class="sw"><path d="M${x} 31 l6 10.5 h-12 z"/><rect x="${x - 0.6}" y="34.5" width="1.2" height="3.6" rx=".6"/><circle cx="${x}" cy="39.4" r=".7"/></g></g>`).join("");
  var FEED = SLOTX.map((x, i) => `<g class="sl s${i}"><text class="mt" x="${x}" y="81.5"></text><rect class="sled" x="${x - 6}" y="84" width="12" height="1.8" rx=".9"/>
<rect class="fd" x="${x - 11}" y="88" width="22" height="24" rx="6"/><ellipse class="fgl" cx="${x}" cy="91" rx="6.5" ry="1.8"/></g>`).join("");
  var SCENE = `<svg viewBox="0 0 260 300" aria-hidden="true"><defs>
<linearGradient id="pbd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sb1"/><stop offset="1" class="sb2"/></linearGradient>
<linearGradient id="psh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
<linearGradient id="pgl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#2e333b" stop-opacity=".9"/><stop offset=".6" stop-color="#1a1d23" stop-opacity=".93"/><stop offset="1" stop-color="#101216" stop-opacity=".96"/></linearGradient>
<linearGradient id="pin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2a2e36"/><stop offset="1" stop-color="#0e1013"/></linearGradient>
<radialGradient id="plt" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="#fff6e4" stop-opacity=".5"/><stop offset="1" stop-color="#fff6e4" stop-opacity="0"/></radialGradient>
<radialGradient id="pgw"><stop offset="0" stop-color="#ffc061" stop-opacity=".95"/><stop offset=".4" stop-color="#ff8a2a" stop-opacity=".5"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>
<linearGradient id="pdm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#5a616d" stop-opacity=".5"/><stop offset=".7" stop-color="#2a2e35" stop-opacity=".55"/><stop offset="1" stop-color="#16181c" stop-opacity=".7"/></linearGradient>
<linearGradient id="pab" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c3036" stop-opacity=".92"/><stop offset="1" stop-color="#14161a" stop-opacity=".96"/></linearGradient>
<linearGradient id="pcy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".75" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>
<linearGradient id="prt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="pob" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".38" stop-color="#fff" stop-opacity=".28"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>
<linearGradient id="pgs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".75"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="phd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#d4d7dc"/><stop offset="1" stop-color="#9da2a9"/></linearGradient>
<pattern id="pwn" width="3" height="60" patternUnits="userSpaceOnUse"><rect width=".6" height="60" fill="#000" fill-opacity=".12"/></pattern><pattern id="ply" width="6" height="2" patternUnits="userSpaceOnUse"><rect width="6" height=".9" fill="#000" fill-opacity=".2"/></pattern>
<clipPath id="pci"><rect x="46" y="136" width="160" height="146" rx="4"/></clipPath>
<clipPath id="poc"><rect class="ocr" x="90" y="${PLATE - OBJ_H}" width="70" height="${OBJ_H}"/></clipPath>
<clipPath id="pvs"><path d="M107 232 C 103 218, 116 208, 113 198 L113 188 L133 188 L133 198 C 130 208, 143 218, 139 232 Z"/></clipPath>
</defs>
<ellipse class="shd" cx="128" cy="294" rx="104" ry="5"/>
<g class="xsp"><path class="tube" d="M196 116 C 210 104, 228 128, 228 152"/><path class="fil" d="M196 116 C 210 104, 228 128, 228 152"/>
<circle class="xf" cx="228" cy="190" r="32"/><circle class="xw" cx="228" cy="190" r="26"/><circle class="xc" cx="228" cy="190" r="26"/><circle class="xh" cx="228" cy="190" r="9"/></g>
<rect class="body" x="36" y="116" width="180" height="176" rx="8"/><rect class="sheen" x="36" y="116" width="180" height="176" rx="8"/>
<rect class="edge" x="40" y="117" width="172" height="1.2" rx=".6"/>
<g class="vents"><rect x="182" y="285" width="2.4" height="4" rx="1"/><rect x="187" y="285" width="2.4" height="4" rx="1"/><rect x="192" y="285" width="2.4" height="4" rx="1"/><rect x="197" y="285" width="2.4" height="4" rx="1"/></g>
<g clip-path="url(#pci)">
<rect class="inner" x="46" y="136" width="160" height="146"/><rect class="lightc" x="46" y="136" width="160" height="120"/>
<rect class="zrod" x="56" y="138" width="2.6" height="144"/><rect class="zrod" x="193.4" y="138" width="2.6" height="144"/>
<rect class="chute" x="48" y="194" width="9" height="20" rx="1.5"/>
<g class="bed"><rect class="carr" x="66" y="236" width="120" height="7" rx="2"/><rect class="plate" x="60" y="232" width="132" height="4.5" rx="1.2"/>
<rect class="pheat" x="60" y="232" width="132" height="4.5" rx="1.2"/><rect class="plateh" x="60" y="232" width="132" height=".9"/>
<g class="obj"><g clip-path="url(#poc)"><path class="ob" d="M107 232 C 103 218, 116 208, 113 198 L113 188 L133 188 L133 198 C 130 208, 143 218, 139 232 Z"/>
<path class="oly" d="M107 232 C 103 218, 116 208, 113 198 L113 188 L133 188 L133 198 C 130 208, 143 218, 139 232 Z"/>
<path class="osh" d="M107 232 C 103 218, 116 208, 113 198 L113 188 L133 188 L133 198 C 130 208, 143 218, 139 232 Z"/>
<g clip-path="url(#pvs)"><rect class="gls" x="88" y="184" width="14" height="52"/></g></g></g>
<g class="cal"><rect x="70" y="230.4" width="16" height="1.6" rx=".8"/><rect x="90" y="230.4" width="16" height="1.6" rx=".8"/><rect x="110" y="230.4" width="16" height="1.6" rx=".8"/><rect x="130" y="230.4" width="16" height="1.6" rx=".8"/><rect x="150" y="230.4" width="16" height="1.6" rx=".8"/></g>
<g class="dots"><circle cx="72" cy="231" r="1.7"/><circle cx="96" cy="231" r="1.7"/><circle cx="120" cy="231" r="1.7"/><circle cx="144" cy="231" r="1.7"/><circle cx="168" cy="231" r="1.7"/></g>
<path class="spag" d="M96 231 c4 -14 10 6 14 -8 s-12 -10 -4 -16 s14 12 18 2 s-6 -18 6 -12 s4 16 12 6 s-2 -14 8 -8 M104 228 c6 -6 2 -16 12 -12 s10 10 16 0 s4 -12 10 -4"/></g>
<rect class="fresh" x="113" y="187.3" width="20" height="1.4" rx=".7"/>
<rect class="rail" x="48" y="155" width="156" height="5" rx="2"/><rect class="railh" x="48" y="155" width="156" height="1"/>
<rect class="blk" x="47" y="151" width="9" height="13" rx="2"/><rect class="blk" x="196" y="151" width="9" height="13" rx="2"/>
<g class="head"><g class="hz"><path class="tube" d="M131 148 C 131 138, 110 140, 100 128"/><path class="fil" d="M131 148 C 131 138, 110 140, 100 128"/>
<rect class="hd" x="106" y="147" width="34" height="33" rx="4"/><rect class="hdt" x="108.5" y="148.6" width="29" height="1.3" rx=".65"/>
<circle class="fan" cx="123" cy="163" r="9.5"/><g class="bl"><ellipse cx="123" cy="158.6" rx="2.1" ry="4"/><ellipse cx="123" cy="158.6" rx="2.1" ry="4" transform="rotate(72 123 163)"/><ellipse cx="123" cy="158.6" rx="2.1" ry="4" transform="rotate(144 123 163)"/><ellipse cx="123" cy="158.6" rx="2.1" ry="4" transform="rotate(216 123 163)"/><ellipse cx="123" cy="158.6" rx="2.1" ry="4" transform="rotate(288 123 163)"/></g>
<circle class="hub" cx="123" cy="163" r="2.2"/>
<rect class="heater" x="118" y="180" width="10" height="4.5" rx="1"/><path class="nz" d="M120 184.5 h6 l-2 3.4 h-2 z"/>
<circle class="glow" cx="123" cy="189" r="7.5"/><rect class="beam" x="122.4" y="189" width="1.2" height="43"/></g></g>
<g class="wisp"><path d="M78 226 q4 -6 0 -12 q-4 -6 0 -12"/><path d="M123 216 q4 -6 0 -12 q-4 -6 0 -12"/><path d="M168 226 q4 -6 0 -12 q-4 -6 0 -12"/></g>
<rect class="led" x="64" y="137.6" width="124" height="1.8" rx=".9"/>
<rect class="tint" x="46" y="136" width="160" height="146"/><rect class="dim" x="46" y="136" width="160" height="146"/></g>
<g class="door"><rect class="dedge" x="46" y="136" width="4" height="146" rx="1.5"/><rect class="glass" x="46" y="136" width="160" height="146" rx="4"/>
<g clip-path="url(#pci)"><path class="refl" d="M70 136 h26 l-50 104 v-52 z"/><path class="refl" d="M104 136 h7 l-65 135 v-14 z"/></g>
<rect class="handle" x="201" y="201" width="6" height="17" rx="3"/></g>
<circle class="stled" cx="203" cy="126" r="1.5"/>
<g class="top"><rect class="lid" x="38" y="113" width="176" height="4" rx="2"/><rect class="fit" x="94" y="111" width="10" height="5" rx="1.5"/>
<g class="ams"><path class="tube" d="M100 112 C 100 104, 110 104, 118 102"/>
<path class="dome0" d="M30 76 V46 A30 30 0 0 1 60 16 H192 A30 30 0 0 1 222 46 V76 Z"/>${SPOOL}
<path class="dome" d="M30 76 V46 A30 30 0 0 1 60 16 H192 A30 30 0 0 1 222 46 V76 Z"/><path class="dhl" d="M44 30 Q60 18 92 18 H170 Q120 22 52 40 Z"/>
<g class="grill"><circle cx="212" cy="34" r=".8"/><circle cx="216" cy="38" r=".8"/><circle cx="212" cy="42" r=".8"/><circle cx="216" cy="46" r=".8"/><circle cx="212" cy="50" r=".8"/><circle cx="216" cy="54" r=".8"/><circle cx="212" cy="58" r=".8"/><circle cx="216" cy="62" r=".8"/></g>
<rect class="abase" x="26" y="72" width="200" height="42" rx="5"/><rect class="alip" x="28" y="72.5" width="196" height="1.6" rx=".8"/>${FEED}
<text class="unit" x="218" y="110"></text></g></g>
<g class="tab"><rect class="tst" x="44" y="126" width="9" height="10" rx="2"/><rect class="tbz" x="16" y="94" width="66" height="40" rx="5"/><rect class="tsc" x="19.5" y="97.5" width="59" height="33" rx="3"/>
<rect class="tside" x="22" y="101" width="5" height="25" rx="1.5"/><text class="tt" x="31" y="113"></text><text class="ts" x="31" y="122"></text>
<rect class="tbar" x="31" y="125.5" width="26" height="1.8" rx=".9"/><rect class="tfill" x="31" y="125.5" width="0" height="1.8" rx=".9"/>
<path class="tgl" d="M21 99 h16 l-8 30 h-8 z"/></g>
<g class="bdg" transform="translate(70 154)"><circle class="bc" r="9.5"/>
<path class="b-ok" d="M-4.2 0.2 l2.9 2.9 l5.6 -6"/>
<g class="b-wn"><path d="M0 -5.6 l5.6 9.7 h-11.2 z"/><rect x="-.65" y="-2.4" width="1.3" height="3.6" rx=".65"/><circle cx="0" cy="2.6" r=".8"/></g>
<g class="b-tp"><rect x="-1.6" y="-6" width="3.2" height="8" rx="1.6"/><circle cx="0" cy="3.4" r="2.8"/></g>
<g class="b-fn"><circle r="1.6"/><path d="M0 -1.6 C -1 -5 3 -6.5 3.2 -3.6 Z M1.4 .8 C 4.8 1.6 4.2 5.6 1.6 4.6 Z M-1.4 .8 C -4.6 2 -6.4 -1.6 -3.8 -2.8 Z"/></g></g>
</svg>`;
  var PCSS = `
.g.pr{--dc:var(--nv-a1);--dc-fg:var(--nv-a1-fg);--fc:var(--dc);
--sb1:var(--nova-printer-color-light,#b6bac0);--sb2:var(--nova-printer-color,#868b92)}
.g.pr.glow.on{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--dc) 45%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.pr .hd .ic.on{background:var(--dc);color:var(--dc-fg);box-shadow:0 0 14px color-mix(in srgb,var(--dc) 55%,transparent)}
.pr .hd small.er{color:var(--nv-error);opacity:1}
.pr .hb.li.on{background:var(--nv-accent);color:var(--nv-accent-fg);box-shadow:0 0 14px color-mix(in srgb,var(--nv-accent) 50%,transparent)}
.pr .demo{font-size:10.5px;font-weight:600;letter-spacing:.05em;text-transform:uppercase;padding:3px 8px;border-radius:999px;background:var(--nv-chip);opacity:.75}
.mid{display:flex;gap:14px;align-items:center;min-width:0}
.scene{flex:none;width:48%;max-width:300px;min-width:150px;color:var(--nv-fg)}
.scene svg{display:block;width:100%;height:auto;overflow:visible}
.inf{flex:1;min-width:0;display:flex;flex-direction:column;gap:7px}
.big{display:flex;align-items:baseline;gap:8px;min-width:0}
.pc{font-size:28px;font-weight:600;line-height:1;letter-spacing:-.01em}.pc small{font-size:15px;font-weight:500;opacity:.7;margin-left:2px}
.ph{font-size:12.5px;opacity:.7;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bar{height:8px;border-radius:4px;background:rgba(255,255,255,.12);overflow:hidden}
.bar i{display:block;height:100%;width:0;background:var(--dc);border-radius:4px;transition:width 1s}
.tm{display:flex;justify-content:space-between;gap:8px;font-size:12.5px;flex-wrap:wrap}.tm .rm{font-weight:600}.tm .en{opacity:.7}.tm:empty{display:none}
.kvs .kv{padding:6px 0}.kvs .kv:first-child{border-top:none}
.kvs .v b{font-weight:600;opacity:1}
.amsl{display:flex;flex-direction:column;gap:8px}.amsl:empty{display:none}
.au{display:flex;align-items:center;gap:8px;min-width:0}
.au .an{font-size:11px;font-weight:600;opacity:.6;text-transform:uppercase;letter-spacing:.05em;width:54px;flex:none;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.au .ss{flex:1;display:grid;grid-template-columns:repeat(4,minmax(0,1fr));gap:6px;min-width:0}
.au.x .ss{grid-template-columns:minmax(0,1fr)}
.slot{display:flex;align-items:center;gap:7px;padding:5px 7px;border-radius:12px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.06);min-width:0;font-size:11.5px}
.slot .sc{--r:0%;width:20px;height:20px;border-radius:50%;flex:none;position:relative;background:conic-gradient(var(--c,#777) var(--r),rgba(255,255,255,.15) 0)}
.slot .sc::after{content:'';position:absolute;inset:4px;border-radius:50%;background:var(--c,#777);box-shadow:inset 0 0 0 1px rgba(0,0,0,.25)}
.slot.emp .sc{background:repeating-linear-gradient(45deg,rgba(255,255,255,.18) 0 2px,transparent 2px 5px)}.slot.emp .sc::after{display:none}
.slot .st{min-width:0;display:flex;flex-direction:column;line-height:1.2}.slot b,.slot small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.slot b{font-weight:600}.slot small{opacity:.65;font-size:10.5px}
.slot.act{border-color:color-mix(in srgb,var(--dc) 70%,transparent);background:color-mix(in srgb,var(--dc) 20%,transparent)}
.slot.wn{border-color:color-mix(in srgb,var(--nv-warn) 70%,transparent)}
.als:empty{display:none}.pr .al[data-e]{cursor:pointer}.pr .al small{opacity:.7;margin-left:auto;font-size:11px;white-space:nowrap}
.acts{display:flex;gap:8px}.acts:empty,.acts[hidden]{display:none}
.ab{flex:1;min-width:0;height:44px;border-radius:16px;display:flex;align-items:center;justify-content:center;gap:8px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);font-size:14px;font-weight:600;transition:background-color .2s,opacity .2s,transform .2s}
.ab ha-icon{--mdc-icon-size:22px}.ab.pri{background:var(--dc);color:var(--dc-fg);border-color:transparent;box-shadow:0 0 16px color-mix(in srgb,var(--dc) 40%,transparent)}
.ab.na{opacity:.4;pointer-events:none}.ab:active{transform:scale(.95)}
@container (max-width:380px){.mid{flex-direction:column;align-items:stretch}.scene{width:100%;max-width:240px;align-self:center}.au .ss{grid-template-columns:repeat(2,minmax(0,1fr))}}
/* Zeichnung */
.scene .sb1{stop-color:var(--sb1)}.scene .sb2{stop-color:var(--sb2)}
.scene .shd{fill:#000;opacity:.35}
.scene .body{fill:url(#pbd);stroke:rgba(255,255,255,.18);stroke-width:.6;transition:stroke .4s}.scene .sheen{fill:url(#psh)}.scene .edge{fill:#fff;opacity:.35}
.scene .vents rect{fill:rgba(0,0,0,.35)}
.scene .inner{fill:url(#pin)}.scene .lightc{fill:url(#plt);opacity:0;transition:opacity .5s}.scene .led{fill:#fff6e4;opacity:0;transition:opacity .5s}
.scene .dim{fill:#05070a;opacity:.4;transition:opacity .5s}
.lit .scene .lightc,.lit .scene .led{opacity:1}.lit .scene .dim{opacity:0}
.scene .zrod{fill:#3d424b}.scene .chute{fill:#2c3037}
.scene .carr{fill:#23262c}.scene .plate{fill:#3b3f46}.scene .plateh{fill:#8d929a}
.scene .pheat{fill:#ff7a1a;opacity:0}
.scene .ob{fill:var(--fc)}.scene .oly{fill:url(#ply)}.scene .osh{fill:url(#pob)}.scene .gls{fill:url(#pgs);opacity:0}
.scene .obj{display:none;transform-box:view-box;transform-origin:123px 232px;transition:transform .6s}.has-obj .scene .obj{display:inline}
.scene .bed{transition:transform 1.2s ease}
.scene .fresh{fill:color-mix(in srgb,var(--fc) 50%,#fff);opacity:0}
.scene .cal rect{fill:var(--fc);opacity:0;transform-box:fill-box;transform-origin:left center}
.scene .dots circle{fill:var(--dc);opacity:0}
.scene .spag{fill:none;stroke:var(--fc);stroke-width:1.3;stroke-linecap:round;opacity:0;stroke-dasharray:240;stroke-dashoffset:240}
.scene .rail{fill:#4f555f}.scene .railh{fill:rgba(255,255,255,.22)}.scene .blk{fill:#2f333a}
.scene .tube{fill:none;stroke:rgba(235,240,250,.4);stroke-width:2.6;stroke-linecap:round}
.scene .fil{fill:none;stroke:var(--fc);stroke-width:1.1;stroke-linecap:round;stroke-dasharray:4 3;opacity:.9}
.scene .head{transform-box:view-box;transition:transform 1s ease}.scene .hz{transform-box:view-box}
.scene .hd{fill:url(#phd);stroke:rgba(0,0,0,.3);stroke-width:.5}.scene .hdt{fill:rgba(255,255,255,.6)}
.scene .fan{fill:#1a1d22;stroke:rgba(0,0,0,.4);stroke-width:.5}.scene .bl ellipse{fill:#4a505a}.scene .hub{fill:#6b717b}
.scene .bl{transform-box:view-box;transform-origin:123px 163px}
.scene .heater{fill:#8e949c}.scene .nz{fill:#d0a24f;transition:fill .3s}
.scene .glow{fill:url(#pgw);opacity:0;transition:opacity .6s}
.scene .beam{fill:var(--nv-error);opacity:0}
.scene .wisp path{fill:none;stroke:#bfe3ff;stroke-width:1.3;stroke-linecap:round;opacity:0}
.scene .tint{fill:var(--nv-error);opacity:0;transition:opacity .5s}
.scene .door{transform-box:view-box;transform-origin:46px 209px;transition:transform .8s ease}
.scene .glass{fill:url(#pgl);fill-opacity:.62;stroke:rgba(255,255,255,.22);stroke-width:.7}.scene .refl{fill:#fff;opacity:.06}
.scene .dedge{fill:#5a5f67;opacity:0}
.scene .handle{fill:#f2f3f5;stroke:rgba(0,0,0,.2);stroke-width:.4}
.scene .stled{fill:#4caf6a;opacity:.3}
.scene .top{transform-box:view-box;transform-origin:216px 116px;transition:transform .8s ease}
.scene .lid{fill:#2d3137;stroke:rgba(255,255,255,.18);stroke-width:.5}.scene .fit{fill:#c9ccd1}
.scene .dome0{fill:#1c1f24;fill-opacity:.55}.scene .dome{fill:url(#pdm);stroke:rgba(255,255,255,.2);stroke-width:.6}.scene .dhl{fill:#fff;opacity:.08}
.scene .grill circle{fill:rgba(255,255,255,.25)}
.scene .abase{fill:url(#pab);stroke:rgba(255,255,255,.14);stroke-width:.6}.scene .alip{fill:rgba(255,255,255,.18)}
.scene .fg{fill:#454a52;fill-opacity:.9;stroke:rgba(255,255,255,.28);stroke-width:.5}
.scene .hubc{fill:#5b5248}
.scene .fl{fill:var(--sc,#777);transition:opacity .4s}.scene .wnd{fill:url(#pwn)}.scene .cy{fill:url(#pcy)}.scene .rot{fill:url(#prt);opacity:0;transform-box:view-box}
.scene .sl.emp .fl,.scene .sl.emp .cy{opacity:0}
.scene .sw{display:none}.scene .sw path{fill:var(--nv-warn);stroke:#000;stroke-opacity:.3;stroke-width:.4}.scene .sw rect,.scene .sw circle{fill:#1b1d20}
.scene .sl.wn .sw{display:inline}
.scene .mt{font:600 5.6px Roboto,system-ui,sans-serif;fill:rgba(255,255,255,.75);text-anchor:middle}
.scene .sled{fill:rgba(255,255,255,.18)}.scene .sl.act .sled{fill:var(--dc)}
.scene .fd{fill:#0d0f12;stroke:rgba(255,255,255,.08);stroke-width:.4}.scene .fgl{fill:#ff8a3a;opacity:.45}
.scene .unit{font:600 6px Roboto,system-ui,sans-serif;fill:rgba(255,255,255,.55);text-anchor:end}
.scene .xf{fill:#1d2025}.scene .xw{fill:var(--fc)}.scene .xc{fill:url(#pcy);opacity:.6}.scene .xh{fill:#3a3f47}
.scene .tbz{fill:#0c0d10;stroke:rgba(255,255,255,.2);stroke-width:.6}.scene .tsc{fill:#14171c}.scene .tst{fill:#6d7279}
.scene .tside{fill:rgba(255,255,255,.08)}
.scene .tt{font:700 11px Roboto,system-ui,sans-serif;fill:#fff}.scene .ts{font:500 5.4px Roboto,system-ui,sans-serif;fill:rgba(255,255,255,.65)}
.scene .tbar{fill:rgba(255,255,255,.15)}.scene .tfill{fill:var(--dc)}.scene .tgl{fill:#fff;opacity:.05}
.nodisp .scene .tab{display:none}
.scene .bdg{opacity:0;transition:opacity .3s}.scene .bdg>*{display:none}
.scene .bc{fill:var(--bc,var(--dc));stroke:rgba(0,0,0,.25);stroke-width:.5}
.scene .b-ok{fill:none;stroke:var(--dc-fg);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:14}
.scene .b-wn path{fill:#fff}.scene .b-wn rect,.scene .b-wn circle{fill:var(--bc)}
.scene .b-tp,.scene .b-fn{fill:#fff}
.scene .bdg{transform-box:fill-box}
.b-ok .scene .bdg,.b-wn .scene .bdg,.b-tp .scene .bdg,.b-fn .scene .bdg{opacity:1}
.b-ok .scene .bc,.b-ok .scene .b-ok,.b-wn .scene .bc,.b-wn .scene .b-wn,.b-tp .scene .bc,.b-tp .scene .b-tp,.b-fn .scene .bc,.b-fn .scene .b-fn{display:inline}
.b-wn .scene,.b-tp .scene,.b-fn .scene{--bc:var(--nv-warn)}.bad .scene{--bc:var(--nv-error)}
.noams .scene .ams{display:none}.scene .xsp{display:none}.noams.xs .scene .xsp{display:inline}
/* Grundzustände */
.st-off .scene>svg{opacity:.55;transition:opacity .4s}.st-off .scene .tab .tsc{fill:#08090b}.st-off .scene .tab text,.st-off .scene .tbar,.st-off .scene .tfill,.st-off .scene .tside{display:none}
.st-off .scene .stled{opacity:0}
.st-print .scene .stled,.st-prep .scene .stled,.st-heat .scene .stled,.st-pause .scene .stled,.st-cool .scene .stled{opacity:1}
.st-print .scene .glow,.st-prep .scene .glow{opacity:.65}
.st-heat .scene .glow{opacity:.8}.st-heat .scene .pheat{opacity:.5}
.st-print .scene .fresh{opacity:.9}
.st-idle .scene .head,.st-done .scene .head,.st-off .scene .head,.st-error .scene .head,.st-cool .scene .head{transform:translateX(56px)}
.bad .scene .tint{opacity:.16}.bad .scene .body{stroke:var(--nv-error)}
/* Bewegung nur mit .anim und sichtbar */
.anim.st-print .scene .head{animation:pr-x 2.4s ease-in-out infinite alternate}
.anim.st-print .scene .hz{animation:pr-buzz .32s linear infinite}
.anim:is(.st-print,.st-prep,.st-heat) .scene .fil{animation:pr-flow .9s linear infinite}
.anim:is(.st-print,.st-cool,.st-prep) .scene .bl{animation:pr-spin .45s linear infinite}
.anim:is(.st-print,.st-prep) .scene .sl.act .rot{opacity:1;animation:pr-rot 1.4s linear infinite}
.anim.st-heat .scene .glow,.anim.st-heat .scene .pheat{animation:pr-pulse 1.8s ease-in-out infinite}
.anim.st-pause .scene .stled,.anim.st-pause .scene .tt,.anim.st-pause .scene .sl.act .sled{animation:pr-blink 2s ease-in-out infinite}
.st-pause .scene .glow{opacity:.25}
.anim.st-cool .scene .wisp path{animation:pr-wisp 2.6s ease-out infinite}
.anim.st-cool .scene .glow{animation:pr-fade 8s ease-out both}
.st-done .scene .gls{opacity:1}.anim.st-done .scene .gls{animation:pr-glare 1.6s .3s ease-in-out both}
.st-done .scene .gls{transform:translateX(70px)}
.anim.st-done .scene .b-ok{animation:pr-check .5s .2s ease-out both}.anim.st-done .scene .bdg{animation:pr-pop .5s ease-out both}
.anim.bad .scene .bdg,.anim.b-wn .scene .bdg{animation:pr-throb 1.6s ease-in-out infinite}
/* Meldungen */
.anim.m-level .scene .head{animation:pr-lvl 6s ease-in-out infinite}
.anim.m-level .scene .hz{animation:pr-tap 1.2s ease-in-out infinite}
.m-level .scene .dots circle{opacity:.9}.anim.m-level .scene .dots circle{animation:pr-dot 6s steps(1) infinite}
.anim.m-level .scene .dots circle:nth-child(2){animation-delay:1.2s}.anim.m-level .scene .dots circle:nth-child(3){animation-delay:2.4s}.anim.m-level .scene .dots circle:nth-child(4){animation-delay:3.6s}.anim.m-level .scene .dots circle:nth-child(5){animation-delay:4.8s}
.m-wipe .scene .head{transform:translateX(-62px)}.anim.m-wipe .scene .head{animation:pr-wipe .5s ease-in-out infinite alternate}
.m-calib .scene .cal rect{opacity:.9}.anim.m-calib .scene .cal rect{animation:pr-line 5s ease-out infinite}
.anim.m-calib .scene .cal rect:nth-child(2){animation-delay:1s}.anim.m-calib .scene .cal rect:nth-child(3){animation-delay:2s}.anim.m-calib .scene .cal rect:nth-child(4){animation-delay:3s}.anim.m-calib .scene .cal rect:nth-child(5){animation-delay:4s}
.anim.m-calib .scene .head{animation:pr-cal 5s linear infinite}
.m-scan .scene .beam{opacity:.6}.anim.m-scan .scene .head{animation:pr-scan 3.2s ease-in-out infinite alternate}.anim.m-scan .scene .beam{animation:pr-pulse 1s ease-in-out infinite}
.anim.m-home .scene .head{animation:pr-home 3s ease-in-out infinite}
.m-change .scene .head{transform:translateX(-62px)}
.anim.m-change .scene .fil{animation:pr-chg 3s ease-in-out infinite}.anim.m-change .scene .sl.act .sled{animation:pr-blink .8s ease-in-out infinite}
.anim.m-change .scene .sl.act .rot{opacity:1;animation:pr-rot .6s linear infinite reverse}
.m-empty .scene .sl.act .fl,.m-empty .scene .sl.act .cy{opacity:.12}.m-empty .scene .fil{animation:none!important;opacity:.25}
.anim:is(.m-empty,.m-tangle,.m-ams) .scene .sl.wn .sw{animation:pr-blink 1s ease-in-out infinite}
.anim.m-tangle .scene .sl.act{animation:pr-jit .12s linear infinite}.m-tangle .scene .fil{animation:none!important}
.m-ams .scene .sled{fill:var(--nv-warn)}.anim.m-ams .scene .sled{animation:pr-blink 1s ease-in-out infinite}
.m-spaghetti .scene .spag{opacity:1;stroke-dashoffset:0}.anim.m-spaghetti .scene .spag{animation:pr-draw 3s ease-out infinite}
.m-shift .scene .obj{transform:translateX(7px) skewX(-8deg)}
.m-clog .scene .nz{fill:var(--nv-error)}.anim.m-clog .scene .nz{animation:pr-blink .7s ease-in-out infinite}.m-clog .scene .fil{animation:none!important}
.m-door .scene .door{transform:scaleX(.1)}.m-door .scene .dedge{opacity:1}
.m-lid .scene .top{transform:translateY(-9px) rotate(-5deg)}
.m-fan .scene .bl{animation:none!important}.m-fan .scene .fan{stroke:var(--nv-error);stroke-width:1.2}
.m-temp .scene .glow{opacity:.9}.m-temp .scene .pheat{fill:var(--nv-error);opacity:.6}.anim.m-temp .scene .pheat,.anim.m-temp .scene .glow{animation:pr-pulse 1s ease-in-out infinite}
.still .scene *{animation-play-state:paused!important}
.anim:not(.still) .scene>svg{will-change:transform}
@media (prefers-reduced-motion:reduce){.scene *{animation:none!important;transition:none!important}}
@keyframes pr-x{from{transform:translateX(-11px)}to{transform:translateX(11px)}}
@keyframes pr-buzz{0%,100%{transform:translateY(0)}50%{transform:translateY(-.3px)}}
@keyframes pr-flow{to{stroke-dashoffset:-7}}
@keyframes pr-chg{0%,40%{stroke-dashoffset:0}20%{stroke-dashoffset:21}60%,100%{stroke-dashoffset:-21}}
@keyframes pr-spin{to{transform:rotate(360deg)}}
@keyframes pr-rot{from{transform:translateY(0)}to{transform:translateY(56px)}}
@keyframes pr-pulse{0%,100%{opacity:.2}50%{opacity:.85}}
@keyframes pr-blink{0%,100%{opacity:1}50%{opacity:.25}}
@keyframes pr-fade{from{opacity:.8}to{opacity:0}}
@keyframes pr-wisp{0%{opacity:0;transform:translateY(6px)}40%{opacity:.7}100%{opacity:0;transform:translateY(-14px)}}
@keyframes pr-glare{from{transform:translateX(0)}to{transform:translateX(70px)}}
@keyframes pr-check{from{stroke-dashoffset:14}to{stroke-dashoffset:0}}
@keyframes pr-pop{0%{transform:translate(70px,154px) scale(.3)}70%{transform:translate(70px,154px) scale(1.15)}100%{transform:translate(70px,154px) scale(1)}}
@keyframes pr-throb{0%,100%{opacity:1}50%{opacity:.45}}
@keyframes pr-lvl{0%,100%{transform:translateX(-51px)}20%{transform:translateX(-27px)}40%{transform:translateX(-3px)}60%{transform:translateX(21px)}80%{transform:translateX(45px)}}
@keyframes pr-tap{0%,60%,100%{transform:translateY(0)}75%{transform:translateY(4px)}}
@keyframes pr-dot{0%{opacity:.15}100%{opacity:.9}}
@keyframes pr-wipe{from{transform:translateX(-66px)}to{transform:translateX(-58px)}}
@keyframes pr-line{0%{opacity:0;transform:scaleX(0)}20%{opacity:.9;transform:scaleX(1)}90%{opacity:.9}100%{opacity:0}}
@keyframes pr-cal{0%{transform:translateX(-45px)}100%{transform:translateX(43px)}}
@keyframes pr-scan{from{transform:translateX(-56px)}to{transform:translateX(56px)}}
@keyframes pr-home{0%,100%{transform:translateX(0)}35%,55%{transform:translateX(-62px)}}
@keyframes pr-jit{0%,100%{transform:translateX(0)}50%{transform:translateX(.8px)}}
@keyframes pr-draw{0%{stroke-dashoffset:240}60%,100%{stroke-dashoffset:0}}`;
  var NovaPrinterCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("drucker-card-editor"));
    }
    static getStubConfig(h) {
      const e = Object.values(h?.entities || {}).find((x) => x.platform === "bambu_lab" && x.device_id && /print_status|druckstatus/.test(`${x.translation_key} ${x.entity_id}`));
      return e ? { device: e.device_id } : { demo: "print" };
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      this._c = { ...PDEF, ...c, ams_trays: [].concat(c.ams_trays || []).filter(Boolean), hide_messages: [].concat(c.hide_messages || []) };
      this._built = false;
      this._ids = /* @__PURE__ */ new Set();
      if (this._h) {
        this._build();
        this._update();
      }
    }
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._built) this._build();
      else if (!hassChanged(old, h, this._ids)) return;
      this._update();
    }
    getCardSize() {
      return 6;
    }
    getGridOptions() {
      return { columns: 12, rows: "auto", min_columns: 6 };
    }
    connectedCallback() {
      this._quiet = inPicker(this);
      this._onVis ||= () => this._tick();
      document.addEventListener("visibilitychange", this._onVis);
      if ("IntersectionObserver" in window) {
        this._io ||= new IntersectionObserver((es) => {
          this._inView = es[es.length - 1].isIntersecting;
          this._tick();
        }, { rootMargin: "100px" });
        this._io.observe(this);
      } else this._inView = true;
      this._tick();
    }
    disconnectedCallback() {
      document.removeEventListener("visibilitychange", this._onVis);
      this._io?.disconnect();
      this._inView = false;
      this._tick();
      clearTimeout(this._ft);
    }
    _S(id) {
      return id ? this._h?.states[id] : null;
    }
    // Eingetragene Entitäten, fehlende vom Gerät
    _ents() {
      const h = this._h, c = this._c, dev = printerDev(h, c);
      if (this._detKey !== `${dev}|${Object.keys(h.entities || {}).length}`) {
        this._detKey = `${dev}|${Object.keys(h.entities || {}).length}`;
        this._det = detect(h, dev);
      }
      const out = {};
      EKEYS.forEach((k) => {
        out[k] = c[k] || this._det[k] || null;
      });
      return { e: out, dev };
    }
    _build() {
      this._built = true;
      const c = this._c, r = this.shadowRoot || this.attachShadow({ mode: "open" }), rv = roleVars(c.color);
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${PCSS}</style>
<div class="g pr${c.animation !== false ? " anim" : ""}${c.glow !== false ? " glow" : ""}${c.show_display === false ? " nodisp" : ""}" style="--dc:${rv.c};--dc-fg:${rv.fg}">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div><span class="demo" hidden>Demo</span><div class="hb li" hidden title="Kammerlicht"><ha-icon icon="mdi:lightbulb-outline"></ha-icon></div></div>
<div class="mid"><div class="scene">${SCENE}</div><div class="inf"><div class="big"><span class="pc"></span><span class="ph"></span></div><div class="bar"><i></i></div>
<div class="tm"><span class="rm"></span><span class="en"></span></div><div class="kvs"></div></div></div>
<div class="amsl"></div><div class="als"></div><div class="acts"></div></div>`;
      const q = (s) => r.querySelector(s);
      this._e = {
        g: q(".g"),
        ic: q(".hd .ic"),
        name: q(".hd b"),
        sub: q(".hd small"),
        demo: q(".demo"),
        li: q(".li"),
        pc: q(".pc"),
        ph: q(".ph"),
        bar: q(".bar"),
        bari: q(".bar i"),
        rm: q(".rm"),
        en: q(".en"),
        kvs: q(".kvs"),
        amsl: q(".amsl"),
        als: q(".als"),
        acts: q(".acts"),
        svg: q(".scene svg"),
        bed: q(".bed"),
        ocr: q(".ocr"),
        tt: q(".tt"),
        ts: q(".ts"),
        tfill: q(".tfill"),
        unit: q(".unit"),
        sl: [0, 1, 2, 3].map((i) => ({ g: r.querySelectorAll(`.sl.s${i}`), fl: q(`.s${i} .fl`), fcl: q(`.s${i} .fcl`), mt: q(`.s${i} .mt`) }))
      };
      const e = this._e;
      press(e.ic, { tap: () => this._act({ entity: this._en?.status, tap_action: c.tap_action }, "tap", true), hold: () => this._act({ entity: this._en?.status, hold_action: c.hold_action }, "hold") });
      press(e.li, { tap: () => this._light(), isolate: true });
      e.als.addEventListener("click", (ev) => {
        const el = ev.target.closest?.(".al[data-e]");
        if (el) this._act({ entity: el.dataset.e }, "tap", true);
      });
      this._ab = {};
      [["pause", "mdi:pause", "Pause"], ["resume", "mdi:play", "Fortsetzen"], ["stop", "mdi:stop", "Stopp"]].forEach(([k, ic, t]) => {
        const el = document.createElement("div");
        el.className = `ab a-${k}${k === "resume" ? " pri" : ""}`;
        el.innerHTML = `<ha-icon icon="${ic}"></ha-icon><span>${t}</span>`;
        el.hidden = true;
        press(el, { tap: () => this._do(k) });
        e.acts.append(el);
        this._ab[k] = el;
      });
      this._prev = null;
      this._tick();
    }
    // Ansichtsmodell aus HA (oder Demo)
    _model() {
      const c = this._c, h = this._h;
      if (c.demo) return this._demo();
      const { e: en, dev } = this._ents();
      this._en = en;
      this._ids = /* @__PURE__ */ new Set([...entityIds(c), ...Object.values(en).filter(Boolean)]);
      const S = (k) => this._S(en[k]);
      const st = S("status"), raw = String(st?.state || "").toLowerCase(), stg = S("stage"), sv = ok(stg) ? stg.state : null;
      const on = S("online"), p0 = num(S("progress"));
      const hide = new Set(c.hide_messages);
      const smap = sv && STAGES[sv], skey = smap ? [].concat(smap)[0] : null, spause = Array.isArray(smap);
      let cls;
      if (!st || raw === "unavailable" || raw === "offline" || on && on.state === "off") cls = "off";
      else if (raw === "failed") cls = "error";
      else if (raw === "pause" || PAUSE_STAGES.includes(sv) || spause) cls = "pause";
      else if (raw === "finish") cls = skey === "cool" ? "cool" : "done";
      else if (raw === "running" || raw === "prepare" || raw === "slicing" || raw === "init") cls = skey === "heat" ? "heat" : skey === "cool" ? "cool" : sv === "printing" || raw === "running" && !skey ? "print" : "prep";
      else cls = skey === "cool" ? "cool" : "idle";
      const msgs = [];
      const lvlOrd = { error: 0, warning: 1, info: 2 };
      parseErrors(S("print_error"), "error").forEach((m) => msgs.push({ ...m, ent: en.print_error }));
      parseErrors(S("hms"), "warning").forEach((m) => msgs.push({ ...m, ent: en.hms }));
      if (spause) msgs.push({ key: skey, text: fmtState(h, stg), lvl: MSG[skey].lvl === "info" ? "warning" : MSG[skey].lvl, ent: en.stage });
      const dr = S("door");
      if (dr && dr.state === "on") msgs.push({ key: "door", text: MSG.door.text, lvl: "warning", ent: en.door });
      const shown = msgs.filter((m) => !hide.has(m.key)).sort((a, b) => lvlOrd[a.lvl] - lvlOrd[b.lvl]);
      let fx = shown.find((m) => MSG[m.key])?.key || null;
      if (!fx && skey && !spause && !hide.has(skey) && cls !== "off") fx = skey;
      const rs = S("remaining"), es = S("end_time");
      let rem = null, end = null;
      const r0 = num(rs);
      if (r0 != null) rem = r0 * (SECS[rs.attributes.unit_of_measurement] ?? 60);
      if (ok(es)) {
        const t = Date.parse(es.state);
        if (!isNaN(t)) end = t;
      }
      if (end == null && rem != null && cls !== "pause") end = Date.now() + rem * 1e3;
      const tr = trays(h, c, dev);
      const lt = S("light");
      const nT = num(S("nozzle_target")), bT = num(S("bed_target"));
      return {
        cls,
        fx,
        msgs: shown,
        p: cls === "done" || cls === "cool" && raw === "finish" ? 100 : p0,
        rem,
        end,
        layer: num(S("layer")),
        layers: num(S("layers")),
        noz: num(S("nozzle")),
        nozT: nT,
        bed: num(S("bed")),
        bedT: bT,
        file: ok(S("file")) ? S("file").state : "",
        status: st ? cls === "off" && !ok(st) ? "Nicht verfügbar" : fmtState(h, st) : "Drucker im Editor wählen",
        stage: sv && !QUIET_STAGES.includes(sv) ? fmtState(h, stg) : "",
        units: tr.units,
        ext: tr.ext,
        light: lt ? lt.state === "on" : null,
        lightEnt: en.light,
        name: h.devices?.[dev]?.name_by_user || h.devices?.[dev]?.name || ""
      };
    }
    _demo() {
      const c = this._c, cls = CLS.includes(c.demo) ? c.demo : "print", mk = MSG[c.demo_message] ? c.demo_message : null;
      this._ids = /* @__PURE__ */ new Set();
      const act = ["print", "pause", "prep", "heat"].includes(cls), p = cls === "done" || cls === "cool" ? 100 : ["print", "pause", "error"].includes(cls) ? 42 : act ? 0 : null;
      const msgs = mk && MSG[mk].lvl !== "info" ? [{ key: mk, text: MSG[mk].text, lvl: MSG[mk].lvl }] : [];
      if (cls === "error" && !msgs.length) msgs.push({ key: "warn", text: "Druck fehlgeschlagen", lvl: "error" });
      const units = c.demo_ams === false ? [] : JSON.parse(JSON.stringify(DEMO_AMS));
      if (mk === "change") {
        units[0].slots[0].act = false;
        units[0].slots[1].act = true;
      }
      if (["empty", "tangle"].includes(mk) && units[0]) {
        units[0].slots[0].rem = mk === "empty" ? 0 : 82;
      }
      return {
        cls,
        fx: mk,
        msgs,
        p,
        rem: act ? 4320 : null,
        end: act ? Date.now() + 432e4 : null,
        layer: act ? 84 : null,
        layers: act ? 200 : null,
        noz: cls === "heat" ? 187 : act ? 220 : cls === "cool" ? 96 : 26,
        nozT: act ? 220 : 0,
        bed: cls === "heat" ? 48 : act ? 60 : cls === "cool" ? 41 : 24,
        bedT: act ? 60 : 0,
        file: cls === "idle" || cls === "off" ? "" : "Benchy_0.2mm_PLA.3mf",
        status: CTXT[cls],
        stage: mk ? MSG[mk].text : "",
        units,
        ext: c.demo_ams === false ? { c: "#3d8bf5", mat: "PLA", name: "PLA Basic", rem: null, act: true } : null,
        light: this._dl ?? true,
        demo: true,
        name: "3D-Drucker"
      };
    }
    _update() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !e) return;
      const m = this._m = this._model(), g = e.g, cls = m.cls;
      if (this._prev && this._prev !== cls && cls === "done") {
        g.classList.remove("st-done");
        void g.offsetWidth;
      }
      this._prev = cls;
      CLS.forEach((k) => g.classList.toggle(`st-${k}`, k === cls));
      Object.keys(MSG).forEach((k) => g.classList.toggle(`m-${k}`, m.fx === k));
      const act = ["print", "pause", "prep", "heat"].includes(cls);
      const bad = cls === "error" || m.msgs.some((x) => x.lvl === "error");
      g.classList.toggle("bad", bad);
      g.classList.toggle("on", act && c.glow !== false);
      g.classList.toggle("lit", m.light !== false);
      this.classList.toggle("nv-na", cls === "off" && !m.demo && !this._S(this._en?.status));
      const badge = m.fx === "temp" ? "tp" : m.fx === "fan" ? "fn" : bad || m.fx && MSG[m.fx].lvl !== "info" ? "wn" : cls === "done" ? "ok" : null;
      ["ok", "wn", "tp", "fn"].forEach((k) => g.classList.toggle(`b-${k}`, badge === k));
      e.name.textContent = c.name ?? m.name ?? "3D-Drucker";
      setIcon(e.ic, c.icon || "mdi:printer-3d");
      e.ic.classList.toggle("on", act);
      e.sub.textContent = m.status;
      e.sub.classList.toggle("er", bad);
      e.demo.hidden = !m.demo;
      e.li.hidden = c.show_light === false || m.light == null && !m.demo;
      e.li.classList.toggle("on", !!m.light);
      const units = m.units || [], aU = units.find((u) => u.slots.some((s) => s.act)) || units[0];
      const actSlot = aU?.slots.find((s) => s.act) || (m.ext?.act ? m.ext : null) || m.ext;
      const ams = c.ams === "show" || c.ams === "auto" && units.length > 0;
      g.classList.toggle("noams", !ams);
      g.classList.toggle("xs", !ams && !!m.ext);
      g.style.setProperty("--fc", actSlot?.c || "var(--dc)");
      e.svg.setAttribute("viewBox", ams ? "0 0 260 300" : "0 88 260 212");
      const wnSlot = ["empty", "tangle"].includes(m.fx);
      e.sl.forEach((x, i) => {
        const s = aU?.slots[i];
        const f = s ? s.empty ? 0 : s.rem == null ? 0.8 : s.rem / 100 : 0, hh = 16 + 32 * f, y = 46 - hh / 2;
        [x.fl, x.fcl].forEach((r) => {
          r.setAttribute("y", y.toFixed(1));
          r.setAttribute("height", hh.toFixed(1));
        });
        x.g.forEach((n) => {
          n.classList.toggle("act", !!s?.act);
          n.classList.toggle("emp", !s || !!s.empty);
          n.classList.toggle("wn", !!s?.act && wnSlot);
          n.style.setProperty("--sc", s?.c || "#777");
        });
        x.mt.textContent = s && !s.empty ? s.mat : "–";
      });
      e.unit.textContent = units.length > 1 ? aU.name.replace(/^AMS\s*/i, "") : "";
      const p = m.p != null ? Math.max(0, Math.min(100, m.p)) / 100 : 0;
      const showObj = ["print", "pause", "done", "cool", "error", "prep", "heat"].includes(cls) && (p > 0 || cls === "done");
      const pp = cls === "done" || cls === "cool" ? Math.max(p, showObj ? 1 : 0) : p;
      g.classList.toggle("has-obj", showObj && pp > 0);
      e.ocr.setAttribute("y", (PLATE - OBJ_H * pp).toFixed(1));
      e.ocr.setAttribute("height", (OBJ_H * pp).toFixed(1));
      const bedDown = ["idle", "off"].includes(cls) || ["done", "cool", "error"].includes(cls) && !showObj;
      e.bed.style.transform = bedDown ? "translateY(0)" : `translateY(${(-(1 - pp) * OBJ_H).toFixed(1)}px)`;
      const pct = m.p != null && (act || cls === "done") ? `${Math.round(m.p)}%` : "";
      e.tt.textContent = act ? cls === "heat" && m.noz != null ? `${Math.round(m.noz)}°` : pct || CTXT[cls] : cls === "done" ? "Fertig" : cls === "error" ? "Fehler" : cls === "cool" ? `${Math.round(m.noz ?? 0)}°` : cls === "off" ? "" : "Bereit";
      e.tt.style.fontSize = /^\d/.test(e.tt.textContent) ? "" : "7px";
      e.ts.textContent = act && m.rem != null ? `${fmtShort(m.rem)}${m.layer != null ? ` · ${m.layer}/${m.layers ?? "?"}` : ""}` : m.file ? m.file.slice(0, 15) : "";
      e.tfill.setAttribute("width", (26 * (act || cls === "done" ? p : 0)).toFixed(1));
      const sp = c.show_progress !== false && m.p != null && (act || cls === "done");
      e.pc.innerHTML = sp ? `${Math.round(m.p)}<small>%</small>` : "";
      e.pc.hidden = !sp;
      e.ph.textContent = c.show_stage !== false && m.stage ? m.stage : "";
      e.bar.hidden = !sp;
      if (sp) e.bari.style.width = `${m.p}%`;
      e.rm.textContent = c.show_remaining !== false && act && m.rem != null ? `noch ${fmtDur(m.rem)}` : "";
      e.en.textContent = c.show_end_time !== false && act && m.end != null && cls !== "pause" ? `fertig um ${this._clock(m.end)}` : "";
      const rows = [];
      const row = (ic, k, v) => rows.push(`<div class="kv"><ha-icon icon="${ic}"></ha-icon><span class="k">${esc(k)}</span><span class="v">${v}</span></div>`);
      const tmp = (v, t) => v == null ? "–" : `<b>${Math.round(v)}</b>${t ? ` / ${Math.round(t)}` : ""} °C`;
      if (c.show_layer !== false && m.layer != null && (act || cls === "done")) row("mdi:layers-triple-outline", "Schicht", `<b>${m.layer}</b> / ${m.layers ?? "?"}`);
      if (c.show_nozzle !== false && m.noz != null) row("mdi:printer-3d-nozzle-heat-outline", "Düse", tmp(m.noz, m.nozT));
      if (c.show_bed !== false && m.bed != null) row("mdi:radiator", "Bett", tmp(m.bed, m.bedT));
      if (c.show_file !== false && m.file) row("mdi:file-outline", "Datei", esc(m.file));
      const kh = rows.join("");
      if (this._kk !== kh) {
        this._kk = kh;
        e.kvs.innerHTML = kh;
      }
      this._amsList(m, ams);
      this._alerts(m);
      this._acts(m);
      this._tick();
    }
    _amsList(m, ams) {
      const c = this._c, us = [...ams ? m.units : [], ...m.ext ? [{ name: "Extern", slots: [m.ext], x: true }] : []];
      const wn = ["empty", "tangle"].includes(m.fx);
      const html = c.show_ams_list === false ? "" : us.map((u) => `<div class="au${u.x ? " x" : ""}"><span class="an">${esc(u.name)}</span><div class="ss">${u.slots.map((s) => {
        const r = s.empty ? 0 : s.rem;
        return `<div class="slot${s.act ? " act" : ""}${s.empty ? " emp" : ""}${s.act && wn ? " wn" : ""}" title="${esc(s.name)}" style="--c:${s.c || "#777"};--r:${r == null ? 100 : r}%"${s.id ? ` data-e="${esc(s.id)}"` : ""}>
<span class="sc"></span><span class="st"><b>${esc(s.empty ? "Leer" : s.mat || "–")}</b><small>${s.empty ? "" : r == null ? "?" : `${Math.round(r)} %`}</small></span></div>`;
      }).join("")}</div></div>`).join("");
      if (this._ak !== html) {
        this._ak = html;
        this._e.amsl.innerHTML = html;
        this._e.amsl.querySelectorAll(".slot[data-e]").forEach((el) => press(el, { tap: () => this._act({ entity: el.dataset.e }, "tap", true) }));
      }
    }
    _alerts(m) {
      const c = this._c;
      const html = c.show_message === false ? "" : m.msgs.map((x) => {
        const M = MSG[x.key] || MSG.warn;
        return `<div class="al ${x.lvl}"${x.ent ? ` data-e="${esc(x.ent)}"` : ""}><ha-icon icon="${M.icon}"></ha-icon><span>${esc(x.text || M.text)}</span>${x.code ? `<small>${esc(x.code)}</small>` : ""}</div>`;
      }).join("");
      if (this._alk !== html) {
        this._alk = html;
        this._e.als.innerHTML = html;
      }
      this._e.g.classList.toggle("err", m.msgs.some((x) => x.lvl === "error") && c.glow !== false);
    }
    _acts(m) {
      const c = this._c, b = this._ab, en = this._en || {}, cls = m.cls;
      const av = (k) => m.demo || !!en[k] && this._S(en[k]) && this._S(en[k]).state !== "unavailable";
      const run = ["print", "prep", "heat"].includes(cls);
      b.pause.hidden = !run || !av("pause");
      b.resume.hidden = cls !== "pause" || !av("resume");
      b.stop.hidden = !(run || cls === "pause") || !av("stop");
      this._e.acts.hidden = c.show_controls === false || Object.values(b).every((x) => x.hidden);
    }
    _do(k) {
      const c = this._c, id = this._en?.[k];
      if (k === "stop" && c.stop_confirm && !window.confirm(c.stop_confirm)) return;
      if (this._m?.demo) return;
      if (!id) return;
      Promise.resolve(this._h.callService(dom(id) === "button" ? "button" : dom(id), dom(id) === "button" ? "press" : "turn_on", { entity_id: id })).catch((err) => this._flash(`${{ pause: "Pause", resume: "Fortsetzen", stop: "Stopp" }[k]}: ${err?.message || err}`));
    }
    _light() {
      if (this._m?.demo) {
        this._dl = !(this._dl ?? true);
        this._update();
        return;
      }
      const id = this._m?.lightEnt;
      if (id) Promise.resolve(this._h.callService("light", "toggle", { entity_id: id })).catch((err) => this._flash(`Licht: ${err?.message || err}`));
    }
    _flash(msg) {
      clearTimeout(this._ft);
      const el = document.createElement("div");
      el.className = "al error";
      el.innerHTML = `<ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${esc(msg)}</span>`;
      this._e.als.prepend(el);
      this._alk = null;
      this._ft = setTimeout(() => this._update(), 8e3);
    }
    _clock(ms) {
      const h = this._h, d = new Date(ms), far = ms - Date.now() > 20 * 36e5;
      try {
        return new Intl.DateTimeFormat(langOf(h), { hour: "2-digit", minute: "2-digit", ...far ? { weekday: "short" } : {}, timeZone: tzOf(h) }).format(d);
      } catch {
        return d.toLocaleTimeString().slice(0, 5);
      }
    }
    // Animation nur, wenn sichtbar; Restzeit/Endzeit jede Minute neu
    _tick() {
      const vis = !!this._inView && !document.hidden && !this._quiet && this.isConnected;
      this._e?.g.classList.toggle("still", !vis);
      const run = vis && this._e && ["print", "prep", "heat"].includes(this._prev);
      if (run && !this._tm) this._tm = setInterval(() => this._update(), 6e4);
      if (!run && this._tm) {
        clearInterval(this._tm);
        this._tm = null;
      }
    }
    _act(o, kind, info) {
      return runAction(this, o, kind, info);
    }
  };
  define("drucker-card", NovaPrinterCard, { name: "Nova 3D-Drucker Card", description: "3D-Drucker (Bambu Lab) mit animierter Druckerzeichnung, AMS, Fortschritt, Temperaturen, Meldungen und Pause/Fortsetzen/Stopp.", documentationURL: docUrl("nova-3d-drucker-card") });
  var SE = (d) => ({ entity: { domain: d } });
  var PGEN = [{ name: "device", selector: { device: { filter: { integration: "bambu_lab" } } } }, g2({ name: "name", selector: T }, { name: "icon", selector: I })];
  var PENT = [
    g2({ name: "status", selector: SE("sensor") }, { name: "stage", selector: SE("sensor") }),
    g2({ name: "progress", selector: SE("sensor") }, { name: "file", selector: SE("sensor") }),
    g2({ name: "remaining", selector: SE("sensor") }, { name: "end_time", selector: SE("sensor") }),
    g2({ name: "layer", selector: SE("sensor") }, { name: "layers", selector: SE("sensor") }),
    g2({ name: "nozzle", selector: SE("sensor") }, { name: "nozzle_target", selector: SE("sensor") }),
    g2({ name: "bed", selector: SE("sensor") }, { name: "bed_target", selector: SE("sensor") }),
    g2({ name: "hms", selector: SE("binary_sensor") }, { name: "print_error", selector: SE("binary_sensor") }),
    g2({ name: "door", selector: SE("binary_sensor") }, { name: "online", selector: SE("binary_sensor") })
  ];
  var PCTL = [
    g2({ name: "pause", selector: SE(["button", "script"]) }, { name: "resume", selector: SE(["button", "script"]) }),
    g2({ name: "stop", selector: SE(["button", "script"]) }, { name: "light", selector: SE(["light", "switch"]) }),
    { name: "stop_confirm", selector: T }
  ];
  var PAMS = [
    sel("ams", [["auto", "Automatisch (nur wenn ein AMS gefunden wird)"], ["show", "Mit AMS"], ["hide", "Ohne AMS"]]),
    { name: "ams_trays", selector: { entity: { domain: "sensor", multiple: true } } },
    { name: "external_spool", selector: SE("sensor") }
  ];
  var PSHOW = [
    g2(...["progress", "remaining"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} } }))),
    g2(...["end_time", "layer"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} } }))),
    g2(...["nozzle", "bed"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} } }))),
    g2(...["file", "stage"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} } }))),
    g2(...["message", "ams_list"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} } }))),
    g2(...["controls", "light"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} } }))),
    { name: "show_display", selector: { boolean: {} } }
  ];
  var MKEYS = Object.keys(MSG);
  var PMSG = [];
  for (let i = 0; i < MKEYS.length; i += 2) PMSG.push(g2(...MKEYS.slice(i, i + 2).map((k) => ({ name: `msg_${k}`, selector: { boolean: {} } }))));
  var PLOOK = [g2(ROLE("color"), { name: "glow", selector: { boolean: {} } }), { name: "animation", selector: { boolean: {} } }];
  var PDEMO = [sel("demo", [["", "Aus"], ...DEMO_STATES]), sel("demo_message", [["", "Keine"], ...MKEYS.map((k) => [k, MSG[k].label])]), { name: "demo_ams", selector: { boolean: {} } }];
  var PACTS = [g2({ name: "tap_action", selector: A }, { name: "hold_action", selector: A })];
  var PLABELS = {
    ...BASE_LABELS,
    device: "Drucker (Bambu-Lab-Gerät)",
    status: "Druckstatus",
    stage: "Druckphase (Arbeitsschritt)",
    progress: "Fortschritt (%)",
    file: "Dateiname / Auftrag",
    remaining: "Restzeit",
    end_time: "Endzeit",
    layer: "Aktuelle Schicht",
    layers: "Schichten gesamt",
    nozzle: "Düse",
    nozzle_target: "Düse Ziel",
    bed: "Bett",
    bed_target: "Bett Ziel",
    hms: "HMS-Fehler",
    print_error: "Druckfehler",
    door: "Tür (falls vorhanden)",
    online: "Online",
    pause: "Pause",
    resume: "Fortsetzen",
    stop: "Stopp",
    light: "Kammerlicht",
    stop_confirm: "Rückfrage vor dem Stopp",
    ams: "AMS",
    ams_trays: "AMS-Slots",
    external_spool: "Externe Spule",
    color: "Farbe",
    glow: "Rahmen leuchtet beim Drucken",
    animation: "Animation (aus = Standbild)",
    demo: "Demo-Zustand",
    demo_message: "Demo-Meldung",
    demo_ams: "Demo mit AMS",
    show_progress: "Fortschritt",
    show_remaining: "Restzeit",
    show_end_time: "Endzeit",
    show_layer: "Schicht",
    show_nozzle: "Düsentemperatur",
    show_bed: "Betttemperatur",
    show_file: "Dateiname",
    show_stage: "Druckphase",
    show_message: "Meldungen",
    show_ams_list: "AMS-Slots als Liste",
    show_controls: "Knöpfe",
    show_light: "Licht-Knopf",
    show_display: "Display am Drucker",
    ...Object.fromEntries(MKEYS.map((k) => [`msg_${k}`, MSG[k].label]))
  };
  var PHELPERS = {
    device: "Füllt alle Entitäten unten automatisch aus. Leere Felder sucht die Karte selbst am Gerät",
    stage: "Steuert die Animationen der Druckphasen (Leveln, Wischen, Kalibrieren …)",
    ams_trays: "Leer = alle AMS-Einheiten am Drucker automatisch. Bis zu 4 Slots pro Einheit",
    ams: "Ohne AMS zeigt die Zeichnung die Spule am Drucker (externe Spule)",
    external_spool: "Leer = automatisch",
    stop_confirm: "Leer = ohne Rückfrage",
    door: "Nur Drucker mit Türsensor. Offen = Tür klappt in der Zeichnung auf",
    color: "Farbrolle aus dem Theme (Fortschritt, Knöpfe; das Objekt hat die Farbe des aktiven Filaments)",
    demo: "Zeigt Beispielwerte statt der echten Daten – zum Ausprobieren. Vor dem Speichern wieder auf „Aus“"
  };
  var NovaPrinterCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}.demo-btns{display:flex;gap:8px;flex-wrap:wrap}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap");
      const strip = (c) => {
        Object.entries(PDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        ["demo", "demo_message"].forEach((k) => !c[k] && delete c[k]);
        if (c.demo_ams === true) delete c.demo_ams;
        return c;
      };
      const hide = new Set([].concat(c0.hide_messages || []));
      const data = { ...PDEF, demo_ams: true, ...c0, ...Object.fromEntries(MKEYS.map((k) => [`msg_${k}`, !hide.has(k)])) };
      const form = (schema) => this._form(schema, data, (v) => {
        let c = merge(this._config, names(schema).filter((n) => !n.startsWith("msg_")), v);
        if (names(schema).some((n) => n.startsWith("msg_"))) {
          const hm = MKEYS.filter((k) => v[`msg_${k}`] === false);
          if (hm.length) c.hide_messages = hm;
          else delete c.hide_messages;
        }
        if (v.device !== void 0 && v.device !== this._config.device) {
          EKEYS.forEach((k) => delete c[k]);
          Object.assign(c, detect(this._hass, v.device));
          c = strip(c);
          this._emit(c);
          this._rebuild();
          return;
        }
        this._emit(strip(c));
      });
      const step = (k, list2, dir) => {
        const cur = this._config[k] || "", i = list2.indexOf(cur), n = list2[(i + dir + list2.length) % list2.length];
        const c = { ...this._config };
        if (n) c[k] = n;
        else delete c[k];
        if (k === "demo_message" && n && !c.demo) c.demo = "print";
        this._emit(c);
        this._rebuild();
      };
      const btn = (t, fn) => {
        const b = this._add(t, fn);
        b.querySelector("ha-icon").remove();
        return b;
      };
      w.append(
        this._section("general", "mdi:printer-3d", "Allgemein", (b) => b.append(form(PGEN))),
        this._section("entities", "mdi:format-list-bulleted", "Entitäten", (b) => {
          b.append(this._hint("Leer = automatisch vom gewählten Drucker. Nur ändern, wenn etwas falsch erkannt wird."), form(PENT), this._h4("Bedienung"), form(PCTL));
        }),
        this._section("ams", "mdi:tray-full", "AMS und Spulen", (b) => b.append(form(PAMS))),
        this._section("show", "mdi:eye-outline", "Anzeigen", (b) => b.append(form(PSHOW))),
        this._section("messages", "mdi:alert-circle-outline", "Meldungen", (b) => {
          b.append(this._hint("Ausgeschaltete Meldungen erscheinen weder als Hinweis noch als Animation. HMS-Fehler, Druckfehler und Druckphasen werden über die Liste in printer-messages.js zugeordnet; Unbekanntes landet bei „Unbekannte Meldungen“."), form(PMSG));
        }),
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(PLOOK))),
        this._section("demo", "mdi:play-box-outline", "Demo", (b) => {
          b.append(this._hint("Zum Durchklicken aller Zustände und Meldungen in der Vorschau. Vor dem Speichern wieder auf „Aus“ stellen."), form(PDEMO));
          const row = document.createElement("div");
          row.className = "demo-btns";
          const S = ["", ...DEMO_STATES.map((x) => x[0])], M = ["", ...MKEYS];
          row.append(btn("‹ Zustand", () => step("demo", S, -1)), btn("Zustand ›", () => step("demo", S, 1)), btn("‹ Meldung", () => step("demo_message", M, -1)), btn("Meldung ›", () => step("demo_message", M, 1)));
          b.append(row);
        }),
        this._section("actions", "mdi:gesture-tap", "Aktionen", (b) => b.append(form(PACTS)))
      );
    }
  };
  __publicField(NovaPrinterCardEditor, "labels", PLABELS);
  __publicField(NovaPrinterCardEditor, "helpers", PHELPERS);
  __publicField(NovaPrinterCardEditor, "openSections", ["general"]);
  define("drucker-card-editor", NovaPrinterCardEditor);
})();
