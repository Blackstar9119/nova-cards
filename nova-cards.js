/* Nova Cards v0.10.1b1 | MIT | https://github.com/Blackstar9119/nova-cards
   Raum, Thermostat, Licht, Dock, Modular, Kamera, Media, Saugroboter, Müllkalender, Wetter, Pop-up, Bereich, Chips – alle als custom:nova-*.
   Erzeugt mit „npm run build“ aus src/ – diese Datei nicht direkt bearbeiten. */
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/shared/define.js
  var DEV = false;
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
  var list = (v) => [].concat(v ?? []).flatMap((x) => String(x).split(",")).map((x) => x.trim()).filter(Boolean);
  var NUMRE = /^-?\d+(\.\d+)?$/;
  var toObj = (x) => typeof x === "string" ? { entity: x } : { ...x };
  var stamp = (u, v) => u + (u.includes("?") ? "&" : "?") + "t=" + encodeURIComponent(v);
  var mapIcon = (map, ...keys) => {
    if (!map) return null;
    const m = Object.fromEntries(Object.entries(map).map(([k, v]) => [String(k).toLowerCase(), v]));
    for (const k of keys) if (k != null && m[String(k).toLowerCase()]) return m[String(k).toLowerCase()];
    return null;
  };
  var setIcon = (el2, ic) => {
    if (el2._ic === ic) return;
    el2._ic = ic;
    el2.innerHTML = isImg(ic) ? `<img src="${esc(ic)}" alt="">` : `<ha-icon icon="${esc(ic)}"></ha-icon>`;
  };
  function ymdIn(d, tz) {
    try {
      const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d).map((x) => [x.type, x.value]));
      return `${p.year}-${p.month}-${p.day}`;
    } catch {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
  }

  // src/shared/state.js
  var OFF = /* @__PURE__ */ new Set(["off", "unavailable", "unknown", "idle", "docked", "standby", "closed", "paused", "not_home", "none", "ready"]);
  var isOn = (s) => !!s && !OFF.has(s.state);
  var DICON = { light: "mdi:lightbulb", switch: "mdi:power-socket-eu", fan: "mdi:fan", input_boolean: "mdi:toggle-switch-outline", button: "mdi:gesture-tap-button", input_button: "mdi:gesture-tap-button", script: "mdi:script-text-outline", scene: "mdi:palette", automation: "mdi:robot", climate: "mdi:thermostat", cover: "mdi:window-shutter", media_player: "mdi:speaker", number: "mdi:ray-vertex", input_number: "mdi:ray-vertex", select: "mdi:format-list-bulleted", binary_sensor: "mdi:checkbox-blank-circle-outline", sensor: "mdi:eye" };
  var TOGGLE = ["light", "switch", "input_boolean", "fan", "cover", "group", "siren", "humidifier", "automation", "media_player", "valve"];
  var PRESS = { button: ["button", "press"], input_button: ["input_button", "press"], script: ["script", "turn_on"], scene: ["scene", "turn_on"] };
  var fmtState = (h, s) => {
    try {
      return h.formatEntityState ? h.formatEntityState(s) : s.state + (s.attributes.unit_of_measurement ? " " + s.attributes.unit_of_measurement : "");
    } catch {
      return s.state;
    }
  };
  var unitJoin = (v, u) => !u ? `${v}` : u.startsWith("°") ? `${v}${u}` : `${v} ${u}`;
  var decOf = (st) => (String(st).split(".")[1] || "").length;
  var nameOf = (h, o) => o.name ?? h.states[o.entity]?.attributes.friendly_name ?? o.entity ?? "";
  var iconOf = (h, o, fb) => o.icon || h.states[o.entity]?.attributes.icon || DICON[dom(o.entity)] || fb;
  var langOf = (h) => h.locale?.language || h.language || "de";
  var tzOf = (h) => h.locale?.time_zone === "server" ? h.config?.time_zone : void 0;
  var areaOf = (h, id) => {
    const e = h.entities?.[id];
    return e && (e.area_id || h.devices?.[e.device_id]?.area_id) || null;
  };
  var hasF = (s, f) => ((s?.attributes.supported_features || 0) & f) === f;
  function valueOf(h, s, o) {
    if (!s) return "–";
    if ((o.decimals != null || o.unit != null) && NUMRE.test(s.state)) {
      const n = o.decimals != null ? (+s.state).toFixed(o.decimals) : s.state;
      return unitJoin(n, o.unit ?? s.attributes.unit_of_measurement);
    }
    return fmtState(h, s);
  }
  function alertHit(a, s) {
    if (!s) return false;
    const v = s.state, n = parseFloat(v);
    if (a.state != null) return list(a.state).includes(v);
    if (a.state_not != null) return !["unavailable", "unknown"].includes(v) && !list(a.state_not).includes(v);
    if (a.above != null || a.below != null) return NUMRE.test(v) && (a.above == null || n > a.above) && (a.below == null || n < a.below);
    return ["on", "problem"].includes(v);
  }

  // src/shared/actions.js
  var fire = (el2, type, detail) => el2.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  var moreInfo = (el2, entityId) => fire(el2, "hass-more-info", { entityId });
  var hassAction = (el2, config, action) => fire(el2, "hass-action", { config, action });
  var navigate = (p) => {
    history.pushState(null, "", p);
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  };
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
  function press(el2, { tap, hold, holdMs = 500, isolate = false }) {
    let t, held = false;
    const clr = () => clearTimeout(t);
    el2.tabIndex = 0;
    el2.setAttribute("role", "button");
    el2.classList.add("tap");
    el2.addEventListener("pointerdown", () => {
      held = false;
      t = setTimeout(() => {
        held = true;
        hold && hold();
      }, holdMs);
    });
    el2.addEventListener("pointerup", (e) => {
      clr();
      if (!held && tap) tap();
      e.stopPropagation();
    });
    el2.addEventListener("pointerleave", clr);
    el2.addEventListener("pointercancel", clr);
    el2.addEventListener("contextmenu", (e) => e.preventDefault());
    if (isolate) el2.addEventListener("click", (e) => e.stopPropagation());
    el2.addEventListener("keydown", (e) => {
      if (e.key !== "Enter" && e.key !== " ") return;
      e.preventDefault();
      if (isolate) e.stopPropagation();
      tap && tap();
    });
  }

  // src/shared/styles.js
  var DOCK_VARS = `:host{
--nv-bg:var(--nova-background,linear-gradient(160deg,rgba(80,96,128,.55),rgba(22,27,42,.62)));
--nv-border:var(--nova-border-color,rgba(255,255,255,.16));
--nv-fg:var(--nova-text-color,#fff);
--nv-accent:var(--nova-accent-color,#f5b83d);
--nv-active:var(--nova-active-color,#3d8bf5);
--nv-chip:var(--nova-chip-color,rgba(255,255,255,.1));
--nv-blur:var(--nova-blur,22px)}`;
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
  var MAPROW_CSS = `.maprow{display:flex;gap:6px;align-items:center}.maprow ha-form{flex:1}`;
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
  var hassChanged = (prev2, next, ids) => {
    if (prev2 === next) return false;
    if (!prev2 || !next) return true;
    if (GLOBAL.some((k) => prev2[k] !== next[k])) return true;
    const a = prev2.states, b = next.states;
    if (a === b) return false;
    for (const id of ids || []) if (a?.[id] !== b?.[id]) return true;
    return false;
  };
  var inPicker = (el2) => {
    for (let n = el2, i = 0; n && i < 80; i++) {
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
  var merge = (base2, keys, val) => {
    const o = { ...base2 };
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
      const el2 = this._pool?.get(type)?.shift() || create();
      (this._keep.get(type) || this._keep.set(type, []).get(type)).push(el2);
      return el2;
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
            const cur2 = this._items(k)[j] || it;
            body.append(this._form(sch(cur2), view(cur2), (v) => {
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

  // src/shared/popup-hub.js
  var KEY = `__${tag("popups")}`;
  var popups = () => window[KEY] ||= /* @__PURE__ */ new Map();
  var register = (h, card) => {
    const m = popups();
    (m.get(h) || m.set(h, /* @__PURE__ */ new Set()).get(h)).add(card);
  };
  var unregister = (h, card) => {
    const s = popups().get(h);
    if (s) {
      s.delete(card);
      if (!s.size) popups().delete(h);
    }
  };
  var hasPopup = (h) => [...popups().get(h) || []].some((p) => !p._fallback && p.isConnected);
  var cleanHash = (h) => String(h ?? "").trim().replace(/^#+/, "").replace(/\s+/g, "-");
  var curHash = () => {
    const s = location.hash.slice(1);
    try {
      return decodeURIComponent(s);
    } catch {
      return s;
    }
  };
  var openPopup = (h) => {
    if (h && curHash() !== h) navigate(`#${encodeURIComponent(h)}`);
  };
  var prev = null;
  var cur = location.href;
  var track = () => {
    if (location.href !== cur) {
      prev = cur;
      cur = location.href;
    }
  };
  ["popstate", "hashchange", "location-changed"].forEach((ev) => window.addEventListener(ev, track));
  var base = (u) => {
    try {
      const x = new URL(u);
      return x.origin + x.pathname + x.search;
    } catch {
      return "";
    }
  };
  var cameByNav = () => {
    track();
    return !!prev && base(prev) === base(location.href) && !new URL(prev).hash;
  };
  var clearHash = (back) => {
    if (back) return history.back();
    history.replaceState(history.state, "", location.pathname + location.search);
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: true } }));
  };
  var closePopup = (h) => {
    const p = [...popups().get(h) || []].find((x) => x._isOpen);
    if (p) p.close();
    else if (curHash() === h) clearHash(false);
  };
  var locks = 0;
  var saved = null;
  var lockScroll = (on) => {
    const els = [document.documentElement, document.body];
    if (on && locks++ === 0) {
      saved = els.map((e) => e.style.overflow);
      els.forEach((e) => {
        e.style.overflow = "hidden";
      });
    }
    if (!on && locks > 0 && --locks === 0) els.forEach((e, i) => {
      e.style.overflow = saved?.[i] || "";
    });
  };
  var findPopups = (o, out = []) => {
    if (!o || typeof o !== "object") return out;
    if (o.type === `custom:${tag("popup-card")}` && o.hash) out.push(o);
    else Object.values(o).forEach((v) => findPopups(v, out));
    return out;
  };
  var dashPath = () => {
    const p = location.pathname.split("/")[1];
    return !p || p === "lovelace" ? null : p;
  };
  var CACHE = {};
  var dashPopups = (hass, path = dashPath(), fresh) => {
    const k = path ?? "", c = CACHE[k];
    if (c && !fresh && Date.now() - c.t < 15e3) return c.p;
    const p = Promise.resolve().then(() => hass.callWS({ type: "lovelace/config", url_path: path })).then((cfg) => findPopups(cfg)).catch(() => []);
    CACHE[k] = { t: Date.now(), p };
    return p;
  };
  var findPopup = async (hass, h, alt) => {
    const paths = [dashPath()];
    if (alt) paths.push(alt === "default" ? null : alt);
    for (const p of paths) {
      const hit = (await dashPopups(hass, p)).find((c) => cleanHash(c.hash) === h);
      if (hit) return hit;
    }
    return null;
  };
  var popupLabel = (c) => c.title || `#${cleanHash(c.hash)}`;
  var popupOptions = async (hass) => [
    { value: "", label: "– keins –" },
    ...(await dashPopups(hass, void 0, true)).map((c) => ({ value: cleanHash(c.hash), label: popupLabel(c) }))
  ];
  async function togglePopup(host, hass, h, alt) {
    if (curHash() === h) return closePopup(h);
    openPopup(h);
    if (hasPopup(h) || !hass) return;
    const cfg = await findPopup(hass, h, alt);
    if (!cfg || curHash() !== h || hasPopup(h) || !customElements.get(tag("popup-card"))) return;
    const key = JSON.stringify(cfg);
    if (host._hp?._cfgKey !== key) {
      host._hp?.remove();
      const p = document.createElement(tag("popup-card"));
      p._fallback = true;
      p._cfgKey = key;
      p.setConfig(cfg);
      host._hp = p;
    }
    host._hp.hass = hass;
    if (!host._hp.isConnected) host.shadowRoot.appendChild(host._hp);
  }

  // src/room.js
  var GEN = [{ type: "grid", name: "", schema: [{ name: "name", required: true, selector: { text: {} } }, { name: "icon", selector: { icon: {} } }] }];
  var VALUES = (c) => [
    { name: "temperature", selector: { entity: { domain: ["sensor", "climate"] } } },
    { name: "info", selector: { entity: {} } },
    ...c.info ? [{ type: "grid", name: "", schema: [{ name: "info_suffix", selector: { text: {} } }, { name: "info_round", selector: { boolean: {} } }] }] : [],
    { name: "windows", selector: { entity: { multiple: true, domain: "binary_sensor" } } },
    ...[].concat(c.windows || []).length ? [{ name: "window_icon", selector: { icon: {} } }] : []
  ];
  var LOOK = [{ name: "image", selector: { text: {} } }];
  var ACTIONS = [
    { name: "popup", selector: { select: { mode: "dropdown", custom_value: true, options: [] } } },
    { name: "tap_action", selector: { ui_action: {} } }
  ];
  var vis = (c) => `${!!c.info}|${!![].concat(c.windows || []).length}`;
  var B_MAIN = [
    { name: "entity", required: true, selector: { entity: {} } },
    { type: "grid", name: "", schema: [{ name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } }, { name: "name", selector: { text: {} } }] }
  ];
  var B_ACT = [{ name: "tap_action", selector: { ui_action: {} } }, { name: "hold_action", selector: { ui_action: {} } }];
  var B_ADV = [{ name: "state_entity", selector: { entity: {} } }, { name: "icon_entity", selector: { entity: {} } }];
  var ICON_MAP_ROW = [{ type: "grid", name: "", schema: [{ name: "state", selector: { text: {} } }, { name: "value", selector: { text: {} } }] }];
  var NovaRoomCardEditor = class extends NovaEditorBase {
    // icon_map je Button als bearbeitbare Zeilen (bleiben auch leer stehen)
    // Pop-ups des Dashboards für die Auswahlliste einmal laden
    set hass(h) {
      super.hass = h;
      if (h && !this._pops) {
        this._pops = [];
        popupOptions(h).then((o) => {
          this._pops = o;
          this._rebuild();
        });
      }
    }
    _actions() {
      const opts = this._pops?.length ? this._pops : [{ value: "", label: "– keins –" }];
      return ACTIONS.map((x) => x.name === "popup" ? { ...x, selector: { select: { ...x.selector.select, options: opts } } } : x);
    }
    _onExternalConfig() {
      this._maps = (this._config.buttons || []).map((b) => Object.entries(b.icon_map || {}));
    }
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}${MAPROW_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), c0 = this._config;
      const form = (schema) => this._form(schema, c0, (v) => {
        const c = merge(this._config, names(schema), v);
        if (c.popup) c.popup = cleanHash(c.popup);
        if (!c.popup) delete c.popup;
        this._emit(c);
        if (vis(c) !== vis(c0)) this._rebuild();
      });
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(GEN))),
        this._section("values", "mdi:thermometer", "Anzeige", (b) => b.append(form(VALUES(c0)))),
        this._section("buttons", "mdi:gesture-tap-button", "Buttons", (b) => {
          (this._config.buttons || []).forEach((x, i) => b.append(this._button(x, i)));
          b.append(this._add("Button hinzufügen", () => {
            const buttons = [...this._config.buttons || [], {}];
            this._maps.push([]);
            this._open.add(buttons.length - 1);
            this._emit({ ...this._config, buttons });
            this._rebuild();
          }));
        }),
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(LOOK))),
        this._section("actions", "mdi:gesture-tap", "Aktionen", (b) => b.append(form(this._actions())))
      );
    }
    _label(b, i) {
      const s = b.entity ? this._hass?.states[b.entity] : null;
      return `${i + 1}. ${b.name || s?.attributes.friendly_name || b.entity || "Neuer Button"}`;
    }
    _button(b, i) {
      const n = (this._config.buttons || []).length;
      const [d, s] = this._details(i, b.icon || "mdi:gesture-tap-button", this._label(b, i), this._itemBtns(i, n, (dir) => this._move(i, dir), () => this._remove(i)), (body) => {
        const form = (schema) => this._form(schema, b, (v) => {
          const buttons = [...this._config.buttons], old = buttons[i];
          buttons[i] = merge(old, names(schema), v);
          this._emit({ ...this._config, buttons });
          s.querySelector(".lbl").textContent = this._label(buttons[i], i);
          if (!!old.icon_entity !== !!buttons[i].icon_entity) this._rebuild();
        });
        body.append(form(B_MAIN), this._h4("Aktionen"), form(B_ACT), this._h4("Status und Icon"), form(B_ADV));
        if (b.icon_entity) body.append(this._mapEditor(i));
      });
      return d;
    }
    _mapEditor(i) {
      const box = document.createElement("div");
      box.innerHTML = '<p class="hint">Icon je Zustand der Icon-Entität. Wert: <code>mdi:…</code> oder Bild-URL (z. B. <code>/local/logos/netflix.svg</code>).</p>';
      const rows = this._maps[i] ||= [];
      rows.forEach(([state, value], j) => {
        const row = document.createElement("div");
        row.className = "maprow";
        row.append(
          this._form(ICON_MAP_ROW, { state, value }, (v) => {
            rows[j] = [v.state ?? "", v.value ?? ""];
            this._writeMap(i);
          }),
          this._btn("mdi:close", "Entfernen", () => {
            rows.splice(j, 1);
            this._writeMap(i);
            this._rebuild();
          })
        );
        box.append(row);
      });
      box.append(this._add("Zustand hinzufügen", () => {
        rows.push(["", ""]);
        this._rebuild();
      }));
      return box;
    }
    _writeMap(i) {
      const map = Object.fromEntries(this._maps[i].filter(([k, v]) => k && v)), buttons = [...this._config.buttons], b = { ...buttons[i] };
      if (Object.keys(map).length) b.icon_map = map;
      else delete b.icon_map;
      buttons[i] = b;
      this._emit({ ...this._config, buttons });
    }
    _move(i, dir) {
      const j = i + dir, buttons = [...this._config.buttons];
      [buttons[i], buttons[j]] = [buttons[j], buttons[i]];
      [this._maps[i], this._maps[j]] = [this._maps[j], this._maps[i]];
      this._open = /* @__PURE__ */ new Set([j]);
      this._emit({ ...this._config, buttons });
      this._rebuild();
    }
    _remove(i) {
      const buttons = this._config.buttons.filter((_, k) => k !== i);
      this._maps.splice(i, 1);
      this._open = /* @__PURE__ */ new Set();
      this._emit({ ...this._config, buttons });
      this._rebuild();
    }
  };
  __publicField(NovaRoomCardEditor, "labels", {
    name: "Name",
    icon: "Icon",
    temperature: "Temperatur (Sensor oder Thermostat)",
    windows: "Fenster & Türen",
    tap_action: "Aktion beim Antippen",
    popup: "Beim Antippen Nova Pop-up öffnen",
    hold_action: "Aktion bei langem Drücken",
    info: "Info-Entität (ersetzt Temperatur)",
    info_suffix: "Info-Suffix",
    info_round: "Info runden",
    image: "Hintergrundbild (URL)",
    window_icon: "Icon für offenes Fenster",
    entity: "Entität",
    state_entity: "Status-Entität",
    icon_entity: "Icon-Entität",
    state: "Zustand",
    value: "Icon oder Bild-URL"
  });
  __publicField(NovaRoomCardEditor, "helpers", {
    windows: "Offenes Fenster = farbiger Rahmen + Icon",
    popup: "Öffnet die gewählte Nova Pop-up Card (Liste = Pop-ups in diesem Dashboard). Hat Vorrang vor der Aktion beim Antippen.",
    state_entity: "Optional: bestimmt An/Aus-Anzeige statt der Entität selbst (z. B. TV-Bildschirmstatus)",
    icon_entity: "Optional: Icon wechselt je nach Zustand dieser Entität (z. B. aktuelle TV-App)",
    image: "z. B. /local/raeume/wohnzimmer.jpg"
  });
  __publicField(NovaRoomCardEditor, "openSections", ["general"]);
  define("room-card-editor", NovaRoomCardEditor);
  var TAG = "room-card";
  var TOGGLE_DOMAINS = ["light", "switch", "input_boolean", "fan", "cover", "group", "siren", "humidifier", "automation"];
  var PRESS_SERVICE = { scene: ["scene", "turn_on"], script: ["script", "turn_on"], button: ["button", "press"], input_button: ["input_button", "press"] };
  var STATELESS = ["button", "input_button", "script", "scene"];
  var DOMAIN_ICONS = { light: "mdi:lightbulb", switch: "mdi:power-socket-eu", fan: "mdi:fan", vacuum: "mdi:robot-vacuum", input_boolean: "mdi:toggle-switch-outline", media_player: "mdi:speaker", button: "mdi:gesture-tap-button", input_button: "mdi:gesture-tap-button", script: "mdi:script-text-outline", scene: "mdi:palette", climate: "mdi:thermostat", cover: "mdi:window-shutter", lock: "mdi:lock", sensor: "mdi:eye" };
  var ROOM_CSS = `
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
    if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
    const cfg = { glow_domains: ["light", "switch"], temperature_decimals: 1, ...c };
    if (!cfg.tap_action && cfg.navigation_path) cfg.tap_action = { action: "navigate", navigation_path: cfg.navigation_path };
    cfg.windows = [].concat(cfg.windows || []).filter(Boolean);
    cfg.buttons = (cfg.buttons || []).filter((b) => b && b.entity).map((b) => {
      const o = { ...b };
      if (!o.tap_action && o.action === "more-info") o.tap_action = { action: "more-info" };
      return o;
    });
    return cfg;
  }
  var NovaRoomCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag(`${TAG}-editor`));
    }
    // Erster Bereich mit Lampen: bis zu 4 Lampen + Temperatursensor
    static getStubConfig(h) {
      const ids = Object.keys(h.states);
      for (const area of Object.values(h.areas || {})) {
        const lights = ids.filter((id) => id.startsWith("light.") && areaOf(h, id) === area.area_id).slice(0, 4);
        if (!lights.length) continue;
        const temp = ids.find((id) => id.startsWith("sensor.") && areaOf(h, id) === area.area_id && h.states[id].attributes.device_class === "temperature");
        return { name: area.name, icon: area.icon || "mdi:home", ...temp ? { temperature: temp } : {}, buttons: lights.map((entity) => ({ entity })) };
      }
      return { name: "Wohnzimmer", icon: "mdi:sofa", buttons: [] };
    }
    setConfig(c) {
      this._c = normalize(c);
      this._ids = entityIds(this._c);
      this._built = false;
      if (this._h) {
        this._build();
        this._update();
      }
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
    getCardSize() {
      return 3;
    }
    getGridOptions() {
      return { columns: 12, rows: 3, min_rows: 2, min_columns: 6 };
    }
    _build() {
      if (!this._c) return;
      this._built = true;
      const c = this._c, r = this.shadowRoot || this.attachShadow({ mode: "open" }), tap = c.popup ? "popup" : c.tap_action?.action;
      r.innerHTML = `<style>${CARD_CSS}${ROOM_CSS}</style>
<div class="g room ${tap && tap !== "none" ? "click" : ""}">
  ${c.image ? `<div class="bg" style="background-image:url('${esc(c.image)}')"></div>` : ""}
  <ha-icon class="bgi" icon="${esc(c.icon || "mdi:home")}"></ha-icon>
  <div class="head"><span>${esc(c.name || "")}</span>${tap === "navigate" ? '<ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>' : ""}
    <span class="t"><ha-icon class="w" icon="${esc(c.window_icon || "mdi:window-open-variant")}"></ha-icon><span class="tv"></span></span></div>
  <div class="btns"></div>
</div>`;
      this._room = r.querySelector(".room");
      if (this._hp) r.appendChild(this._hp);
      this._tv = r.querySelector(".tv");
      const box = r.querySelector(".btns");
      this._room.addEventListener("click", () => {
        if (!tap || tap === "none") return;
        if (c.popup) return togglePopup(this, this._h, cleanHash(c.popup));
        hassAction(this, { entity: c.temperature || c.info, tap_action: c.tap_action }, "tap");
      });
      this._btns = c.buttons.map((b) => {
        const el2 = document.createElement("div");
        el2.className = "b";
        press(el2, { tap: () => this._tap(b), hold: () => this._hold(b), isolate: true });
        box.appendChild(el2);
        return [el2, b];
      });
    }
    _tap(b) {
      const a = b.tap_action;
      if (a && a.action && a.action !== "default") return hassAction(this, { entity: b.entity, tap_action: a }, "tap");
      const h = this._h, d = dom(b.entity), data = { entity_id: b.entity };
      if (PRESS_SERVICE[d]) return h.callService(...PRESS_SERVICE[d], data);
      if (d === "media_player") return h.callService("media_player", "toggle", data);
      if (TOGGLE_DOMAINS.includes(d)) return h.callService("homeassistant", "toggle", data);
      moreInfo(this, b.entity);
    }
    _hold(b) {
      if (b.hold_action?.action) return hassAction(this, { entity: b.entity, hold_action: b.hold_action }, "hold");
      moreInfo(this, b.entity);
    }
    _icon(b) {
      const h = this._h;
      if (b.icon_entity && b.icon_map) {
        const s = h.states[b.icon_entity], ic = s && b.icon_map[s.state];
        if (ic) return ic;
      }
      return b.icon || h.states[b.entity]?.attributes.icon || DOMAIN_ICONS[dom(b.entity)] || "mdi:power";
    }
    // Text oben rechts: Info-Entität oder Temperatur
    _info() {
      const h = this._h, c = this._c;
      if (c.info) {
        const s = h.states[c.info];
        if (!s) return "";
        const n = parseFloat(s.state);
        return (c.info_round && !isNaN(n) ? Math.round(n) : fmtState(h, s)) + (c.info_suffix || "");
      }
      const t = c.temperature && h.states[c.temperature], v = t ? t.attributes.current_temperature ?? t.state : null;
      return v !== null && !isNaN(parseFloat(v)) ? `${parseFloat(v).toFixed(c.temperature_decimals)}°` : "";
    }
    _update() {
      if (!this._h || !this._btns) return;
      const h = this._h, c = this._c;
      this._tv.textContent = this._info();
      this._room.classList.toggle("warn", c.windows.some((id) => h.states[id]?.state === "on"));
      let lit = false;
      for (const [el2, b] of this._btns) {
        const s = h.states[b.entity], d = dom(b.entity);
        const on = b.state_entity ? isOn(h.states[b.state_entity]) : isOn(s), glow = c.glow_domains.includes(d);
        el2.classList.toggle("na", !s || s.state === "unavailable");
        el2.classList.toggle("on", on && !STATELESS.includes(d));
        el2.classList.toggle("alt", !glow);
        if (on && glow) lit = true;
        setIcon(el2, this._icon(b));
        el2.title = b.name || s?.attributes.friendly_name || b.entity;
      }
      this._room.classList.toggle("lit", lit);
    }
  };
  define(TAG, NovaRoomCard, { name: "Nova Raum Card", description: "Raumkachel mit Temperatur, Fenster-Warnung und frei belegbaren Buttons.", documentationURL: docUrl("nova-raum-card") });

  // src/shared/sparkline.js
  var gradientId = 0;
  function sparkline(pts, { w = 300, h = 64, color = "var(--nv-accent)" } = {}) {
    if (!pts || pts.length < 2) return '<svg class="spk"></svg>';
    const t0 = pts[0][0], t1 = Math.max(pts[pts.length - 1][0], Date.now()), vals = pts.map((p) => p[1]);
    const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
    const d = "M" + pts.concat([[t1, pts[pts.length - 1][1]]]).map((p) => [(p[0] - t0) / (t1 - t0 || 1) * w, h - 6 - (p[1] - min) / range * (h - 14)]).map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L");
    const id = `nvg${++gradientId}`;
    return `<svg class="spk" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".45"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="${d}L${w},${h}L0,${h}Z" fill="url(#${id})"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
  }

  // src/thermostat.js
  var TAG2 = "thermostat-card";
  var MODE_NAMES = { off: "Aus", heat: "Heizen", auto: "Auto", cool: "Kühlen", heat_cool: "Heizen/Kühlen", dry: "Trocknen", fan_only: "Lüften" };
  var ACTION_NAMES = { heating: "heizt", cooling: "kühlt", idle: "Ziel erreicht", off: "aus", drying: "trocknet", fan: "lüftet", preheating: "heizt vor" };
  var MODE_ICONS = { off: "mdi:power", heat: "mdi:fire", auto: "mdi:thermostat-auto", cool: "mdi:snowflake", heat_cool: "mdi:sun-snowflake-variant", dry: "mdi:water-percent", fan_only: "mdi:fan" };
  var HISTORY = {};
  function history2(h, id, hours, onLoad) {
    const key = `${id}|${hours}`, hit = HISTORY[key];
    if (hit && (hit.loading || Date.now() - hit.t < 6e5)) return hit.data;
    HISTORY[key] = { t: Date.now(), data: hit?.data || null, loading: true };
    const start = new Date(Date.now() - hours * 36e5).toISOString();
    h.callApi("GET", `history/period/${start}?filter_entity_id=${id}&minimal_response&no_attributes`).then((res) => {
      const pts = (res[0] || []).map((x) => [new Date(x.last_changed).getTime(), parseFloat(x.state)]).filter((p) => !isNaN(p[1]));
      HISTORY[key] = { t: Date.now(), data: pts };
      onLoad && onLoad();
    }).catch(() => {
      HISTORY[key] = { t: Date.now(), data: [] };
    });
    return HISTORY[key].data;
  }
  var grid = (...schema) => ({ type: "grid", name: "", schema });
  var S_GEN = [
    { name: "entity", required: true, selector: { entity: { domain: "climate" } } },
    grid({ name: "name", selector: { text: {} } }, { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } })
  ];
  var S_SENS = [
    grid({ name: "sensor", selector: { entity: { domain: "sensor", device_class: "temperature" } } }, { name: "humidity", selector: { entity: { domain: "sensor", device_class: "humidity" } } }),
    { name: "windows", selector: { entity: { multiple: true, domain: "binary_sensor" } } }
  ];
  var S_CTRL = (h, c) => {
    const modes = h?.states[c.entity]?.attributes.hvac_modes || Object.keys(MODE_NAMES);
    return [
      grid({ name: "show_modes", selector: { boolean: {} } }, { name: "show_presets", selector: { boolean: {} } }),
      ...c.show_modes ? [{ name: "modes", selector: { select: { multiple: true, options: modes.map((m) => ({ value: m, label: MODE_NAMES[m] || m })) } } }] : [],
      { name: "step", selector: { number: { min: 0.1, max: 5, step: 0.1, mode: "box", unit_of_measurement: "°" } } }
    ];
  };
  var S_LOOK = (c) => [
    { name: "compact", selector: { boolean: {} } },
    grid({ name: "show_graph", selector: { boolean: {} } }, ...c.show_graph ? [{ name: "graph_hours", selector: { number: { min: 1, max: 168, mode: "box", unit_of_measurement: "h" } } }] : [])
  ];
  var S_ACT = [{ name: "tap_action", selector: { ui_action: {} } }];
  var VIS = ["entity", "show_modes", "show_graph"];
  var EDITOR_DEFAULTS = { show_graph: true, graph_hours: 24, show_modes: true, show_presets: false, compact: true };
  var NovaThermostatCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}${MAPROW_CSS}</style><div class="wrap"></div>`;
      const data = { ...EDITOR_DEFAULTS, ...this._config };
      const form = (schema) => this._form(schema, data, (v) => {
        const c = merge(this._config, names(schema), v);
        Object.entries(EDITOR_DEFAULTS).forEach(([k, x]) => c[k] === x && delete c[k]);
        this._emit(c);
      });
      r.querySelector(".wrap").append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(S_GEN))),
        this._section("sensors", "mdi:thermometer", "Sensoren", (b) => b.append(form(S_SENS))),
        this._section("control", "mdi:tune-variant", "Bedienung", (b) => b.append(form(S_CTRL(this._hass, data)))),
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(S_LOOK(data)))),
        this._section("actions", "mdi:gesture-tap", "Aktionen", (b) => b.append(form(S_ACT)))
      );
    }
    // Anderes Thermostat (Modi-Liste) oder Schalter für abhängige Felder → neu aufbauen
    _emit(c) {
      const was = { ...EDITOR_DEFAULTS, ...this._config }, now = { ...EDITOR_DEFAULTS, ...c };
      super._emit(c);
      if (VIS.some((k) => now[k] !== was[k])) this._rebuild();
    }
  };
  __publicField(NovaThermostatCardEditor, "labels", {
    entity: "Thermostat",
    name: "Name",
    icon: "Icon",
    sensor: "Raumsensor (optional, genauer als Thermostat)",
    windows: "Fenster & Türen",
    show_graph: "Verlauf anzeigen",
    graph_hours: "Verlauf (Stunden)",
    show_modes: "Modi anzeigen",
    show_presets: "Presets anzeigen",
    compact: "Kompakt",
    modes: "Nur diese Modi (leer = alle)",
    step: "Schrittweite",
    humidity: "Luftfeuchte-Sensor",
    tap_action: "Aktion beim Antippen des Kopfes"
  });
  __publicField(NovaThermostatCardEditor, "helpers", {
    sensor: "Für Anzeige und Verlauf. Ohne: Ist-Temperatur des Thermostats",
    step: "Leer = Wert vom Thermostat (meist 0,5°)"
  });
  __publicField(NovaThermostatCardEditor, "openSections", ["general"]);
  define("thermostat-card-editor", NovaThermostatCardEditor);
  var THERMO_CSS = `
.th{padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.th.warn{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-warn) 60%,transparent)}
.hd{display:flex;align-items:center;gap:10px;cursor:pointer}
.ic{width:38px;height:38px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);transition:background-color .3s,color .3s,border-color .3s,box-shadow .3s,transform .3s,opacity .3s}
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
  var COMPACT_CSS = `:host{container-type:inline-size}
.th{padding:10px 12px;gap:6px;min-width:0}.ic{width:30px;height:30px}.ic ha-icon{--mdc-icon-size:17px}.nm b{font-size:13px}.nm small{font-size:11px}
.cur{font-size:28px;white-space:nowrap}.hum{font-size:11px;margin-top:2px;white-space:nowrap}
.main{flex-wrap:wrap;row-gap:6px;min-width:0}
.stp{padding:3px;gap:6px;font-size:14px;flex:none}.stp span{min-width:44px}
.sb{width:30px;height:30px}.sb ha-icon{--mdc-icon-size:15px}.spk{height:32px}
.pills{gap:5px}.pill{padding:4px 9px;font-size:11.5px}.pill ha-icon{--mdc-icon-size:14px}
.hd{order:0}.modes{order:1}.presets{order:2}.main{order:3}.graph{order:4}
@container (max-width:260px){.th{padding:8px 10px}.cur{font-size:24px}.stp{gap:3px;font-size:13px}.stp span{min-width:38px}.sb{width:26px;height:26px}.pill{padding:3px 7px;font-size:11px}.hum{display:none}}`;
  function normalize2(c) {
    if (!c || !c.entity) throw new Error("entity (Thermostat) fehlt");
    return { show_graph: true, graph_hours: 24, show_modes: true, show_presets: false, ...c, windows: [].concat(c.windows || []).filter(Boolean) };
  }
  var NovaThermostatCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag(`${TAG2}-editor`));
    }
    static getStubConfig(h) {
      return { entity: Object.keys(h.states).find((id) => id.startsWith("climate.")) || "climate.wohnzimmer" };
    }
    setConfig(c) {
      this._c = normalize2(c);
      this._ids = entityIds(this._c);
      this._built = false;
      this._pend = null;
      if (this._h) {
        this._build();
        this._update();
      }
    }
    // Neu zeichnen nur, wenn sich eine Entität der Karte geändert hat
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._built) this._build();
      else if (!hassChanged(old, h, this._ids)) return;
      this._update();
    }
    getCardSize() {
      return 4;
    }
    getGridOptions() {
      return { columns: 9, rows: "auto", min_columns: 6 };
    }
    _build() {
      if (!this._c) return;
      this._built = true;
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${CARD_CSS}${THERMO_CSS}${this._c.compact === false ? "" : COMPACT_CSS}</style>
<div class="g th">
  <div class="hd"><div class="ic"><ha-icon></ha-icon></div><div class="nm"><b></b><small></small></div><ha-icon class="w" icon="mdi:window-open-variant"></ha-icon></div>
  <div class="main"><div><div class="cur">–</div><div class="hum"></div></div>
    <div class="stp"><div class="sb" data-v="-1"><ha-icon icon="mdi:minus"></ha-icon></div><span>–</span><div class="sb" data-v="1"><ha-icon icon="mdi:plus"></ha-icon></div></div></div>
  <div class="graph"></div>
  <div class="pills modes"></div>
  <div class="pills presets"></div>
</div>`;
      const q = (s) => r.querySelector(s);
      this._e = {
        card: q(".th"),
        ic: q(".ic"),
        icon: q(".ic ha-icon"),
        name: q(".nm b"),
        sub: q(".nm small"),
        cur: q(".cur"),
        hum: q(".hum"),
        stp: q(".stp"),
        tgt: q(".stp span"),
        graph: q(".graph"),
        modes: q(".modes"),
        presets: q(".presets")
      };
      this._sig = {};
      q(".hd").addEventListener("click", () => {
        const a = this._c.tap_action;
        if (a?.action && a.action !== "default") return hassAction(this, { entity: this._c.entity, tap_action: a }, "tap");
        moreInfo(this, this._c.entity);
      });
      r.querySelectorAll(".sb").forEach((b) => b.addEventListener("pointerup", (e) => {
        e.preventDefault();
        this._step(+b.dataset.v);
      }));
      q(".modes").addEventListener("click", (e) => {
        const m = e.composedPath().find((x) => x.dataset?.m)?.dataset.m;
        if (m) this._h.callService("climate", "set_hvac_mode", { entity_id: this._c.entity, hvac_mode: m });
      });
      q(".presets").addEventListener("click", (e) => {
        const p = e.composedPath().find((x) => x.dataset?.p)?.dataset.p;
        if (p) this._h.callService("climate", "set_preset_mode", { entity_id: this._c.entity, preset_mode: p });
      });
    }
    _stepSize(a) {
      return this._c.step || a.target_temp_step || 0.5;
    }
    // ± sammelt Klicks und sendet erst nach kurzer Pause (debounce)
    _step(dir) {
      const s = this._h.states[this._c.entity];
      if (!s) return;
      const a = s.attributes, st = this._stepSize(a), from = this._pend ?? (parseFloat(a.temperature) || 20);
      const t = Math.min(a.max_temp ?? 35, Math.max(a.min_temp ?? 5, Math.round((from + dir * st) / st) * st));
      this._pend = t;
      this._e.tgt.textContent = `${t.toFixed(1)}°`;
      this._e.stp.classList.add("pend");
      clearTimeout(this._tm);
      this._tm = setTimeout(() => {
        this._h.callService("climate", "set_temperature", { entity_id: this._c.entity, temperature: t }).catch((e) => console.warn("[nova-cards] Temperatur setzen fehlgeschlagen", e)).finally(() => setTimeout(() => {
          this._pend = null;
          this._e.stp.classList.remove("pend");
          this._update();
        }, 1500));
      }, this._c.debounce ?? 800);
    }
    _update() {
      if (!this._h || !this._e) return;
      const h = this._h, c = this._c, e = this._e, s = h.states[c.entity];
      e.card.classList.toggle("na", !s || s.state === "unavailable");
      this.classList.toggle("nv-na", !s || s.state === "unavailable");
      if (!s) {
        e.name.textContent = c.name || c.entity;
        e.sub.textContent = "nicht gefunden";
        return;
      }
      const a = s.attributes, act = a.hvac_action, heat = act === "heating" || act === "preheating", cool = act === "cooling";
      e.ic.classList.toggle("on", heat);
      e.ic.classList.toggle("cool", cool);
      e.icon.setAttribute("icon", c.icon || (heat ? "mdi:fire" : cool ? "mdi:snowflake" : "mdi:thermostat"));
      e.name.textContent = c.name || a.friendly_name || c.entity;
      e.sub.textContent = [MODE_NAMES[s.state] || s.state, act && act !== s.state ? ACTION_NAMES[act] || act : ""].filter(Boolean).join(" · ");
      e.card.classList.toggle("warn", c.windows.some((id) => h.states[id]?.state === "on"));
      const sensor = c.sensor && h.states[c.sensor];
      let cur2 = sensor ? parseFloat(sensor.state) : NaN;
      if (isNaN(cur2)) cur2 = parseFloat(a.current_temperature);
      e.cur.textContent = isNaN(cur2) ? "–" : `${cur2.toFixed(1)}°`;
      const hum = c.humidity ? parseFloat(h.states[c.humidity]?.state) : parseFloat(a.current_humidity);
      e.hum.textContent = isNaN(hum) ? "" : `${Math.round(hum)} % Luftfeuchte`;
      const noTarget = s.state === "off" || a.temperature == null;
      e.stp.style.display = noTarget && this._pend == null ? "none" : "";
      if (this._pend == null) e.tgt.textContent = a.temperature != null ? `${Number(a.temperature).toFixed(1)}°` : "–";
      if (c.show_graph) {
        const id = c.sensor || c.graph_entity, pts = id ? history2(h, id, c.graph_hours, () => this._update()) : null;
        const sig = pts ? `${pts.length}|${pts[pts.length - 1]?.[1]}` : "";
        if (this._sig.g !== sig) {
          this._sig.g = sig;
          e.graph.innerHTML = pts ? sparkline(pts) : "";
        }
      } else e.graph.innerHTML = "";
      const modes = (c.show_modes ? c.modes?.length ? c.modes.filter((m) => (a.hvac_modes || []).includes(m)) : a.hvac_modes || [] : []).map((m) => `<div class="pill ${s.state === m ? "on" : ""} ${m === "off" ? "off" : ""}" data-m="${esc(m)}"><ha-icon icon="${MODE_ICONS[m] || "mdi:thermostat"}"></ha-icon>${esc((c.mode_names || {})[m] || MODE_NAMES[m] || m)}</div>`).join("");
      if (this._sig.m !== modes) {
        this._sig.m = modes;
        e.modes.innerHTML = modes;
      }
      const presets = (c.show_presets ? a.preset_modes || [] : []).map((p) => `<div class="pill ${a.preset_mode === p ? "on" : ""}" data-p="${esc(p)}">${esc(p)}</div>`).join("");
      if (this._sig.p !== presets) {
        this._sig.p = presets;
        e.presets.innerHTML = presets;
      }
    }
  };
  define(TAG2, NovaThermostatCard, { name: "Nova Thermostat Card", description: "Thermostat mit Ist-/Solltemperatur, ± Stepper, Verlauf und Modi.", documentationURL: docUrl("nova-thermostat-card") });

  // src/light.js
  function hsToRgb(hue, sat) {
    const f = (n) => {
      const k = (n + hue / 60) % 6;
      return Math.round(255 * (1 - sat * Math.max(0, Math.min(k, 4 - k, 1))));
    };
    return [f(5), f(3), f(1)];
  }
  var rgbToHex = (rgb) => "#" + rgb.map((x) => x.toString(16).padStart(2, "0")).join("");
  var hexToRgb = (hex) => {
    const n = parseInt(hex.slice(1), 16);
    return [n >> 16 & 255, n >> 8 & 255, n & 255];
  };
  function kelvinToRgb(k) {
    const t = k / 100;
    const r = t <= 66 ? 255 : 329.7 * Math.pow(t - 60, -0.1332);
    const g = t <= 66 ? 99.47 * Math.log(t) - 161.12 : 288.12 * Math.pow(t - 60, -0.0755);
    const b = t >= 66 ? 255 : t <= 19 ? 0 : 138.52 * Math.log(t - 10) - 305.04;
    return [r, g, b].map((x) => Math.max(0, Math.min(255, Math.round(x))));
  }
  var COLOR_MODES = ["hs", "xy", "rgb", "rgbw", "rgbww"];
  var hasColor = (a) => (a.supported_color_modes || []).some((m) => COLOR_MODES.includes(m));
  var hasColorTemp = (a) => (a.supported_color_modes || []).includes("color_temp");
  var swatchCss = (v) => v.startsWith("k") ? rgbToHex(kelvinToRgb(+v.slice(1))) : v;
  var swatchService = (v) => v.startsWith("k") ? { color_temp_kelvin: +v.slice(1) } : { rgb_color: hexToRgb(v) };
  var COLOR_INPUT_CSS = `
:host{display:block}
.w{display:flex;flex-direction:column;gap:12px;padding:12px;border-radius:12px;background:var(--secondary-background-color)}
.disc{position:relative;width:min(240px,100%);aspect-ratio:1;align-self:center;border-radius:50%;touch-action:none;cursor:crosshair;
background:radial-gradient(closest-side,#fff,rgba(255,255,255,0)),conic-gradient(from 90deg,#f00,#ff0,#0f0,#0ff,#00f,#f0f,#f00);
box-shadow:0 2px 10px rgba(0,0,0,.3)}
.mk{position:absolute;width:24px;height:24px;margin:-12px 0 0 -12px;border-radius:50%;border:3px solid #fff;box-shadow:0 1px 5px rgba(0,0,0,.6);pointer-events:none;display:none}
.lbl{font-size:12px;opacity:.7}
.kt{-webkit-appearance:none;appearance:none;width:100%;height:24px;border-radius:12px;margin:0;outline:none;background:linear-gradient(90deg,#ffa94d,#fff1dc,#cfe3ff)}
.kt::-webkit-slider-thumb{-webkit-appearance:none;width:24px;height:24px;border-radius:50%;background:#fff;border:3px solid rgba(0,0,0,.3)}
.kt::-moz-range-thumb{width:24px;height:24px;border-radius:50%;background:#fff;border:3px solid rgba(0,0,0,.3)}
.row{display:flex;align-items:center;gap:10px}
.sw{width:36px;height:36px;border-radius:50%;flex:none;border:2px solid var(--divider-color,#888);background:transparent}
button{flex:1;display:flex;align-items:center;justify-content:center;gap:6px;padding:9px;border-radius:999px;border:none;background:var(--primary-color);color:var(--text-primary-color,#fff);font:inherit;font-weight:600;cursor:pointer}
button:disabled{opacity:.4;cursor:default}
ha-icon{--mdc-icon-size:18px;display:flex}`;
  var NovaColorInput = class extends HTMLElement {
    connectedCallback() {
      if (this._built) return;
      this._built = true;
      const kmin = +(this.getAttribute("kmin") || 2e3), kmax = +(this.getAttribute("kmax") || 6500), r = this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${COLOR_INPUT_CSS}</style><div class="w">
<div class="disc"><div class="mk"></div></div>
<div class="lbl">oder Weißton</div><input class="kt" type="range" min="${kmin}" max="${kmax}" step="100" value="${Math.round((kmin + kmax) / 200) * 100}">
<div class="row"><div class="sw"></div><button disabled><ha-icon icon="mdi:plus"></ha-icon>Als Knopf hinzufügen</button></div></div>`;
      const disc = r.querySelector(".disc"), mark = r.querySelector(".mk"), swatch = r.querySelector(".sw"), add = r.querySelector("button"), kelvin = r.querySelector(".kt");
      const pick = (v) => {
        this._v = v;
        swatch.style.background = swatchCss(v);
        add.disabled = false;
      };
      const fromPointer = (e) => {
        const b = disc.getBoundingClientRect(), rad = b.width / 2, x = e.clientX - b.left - rad, y = e.clientY - b.top - rad;
        const hue = (Math.atan2(y, x) * 180 / Math.PI + 360) % 360, sat = Math.min(1, Math.hypot(x, y) / rad), hex = rgbToHex(hsToRgb(hue, sat));
        Object.assign(mark.style, { display: "block", left: `${50 + Math.cos(hue * Math.PI / 180) * sat * 50}%`, top: `${50 + Math.sin(hue * Math.PI / 180) * sat * 50}%`, background: hex });
        pick(hex);
      };
      disc.addEventListener("pointerdown", (e) => {
        disc.setPointerCapture?.(e.pointerId);
        this._drag = true;
        fromPointer(e);
      });
      disc.addEventListener("pointermove", (e) => this._drag && fromPointer(e));
      disc.addEventListener("pointerup", (e) => {
        this._drag = false;
        fromPointer(e);
      });
      kelvin.addEventListener("input", () => {
        mark.style.display = "none";
        pick(`k${kelvin.value}`);
      });
      add.addEventListener("click", (e) => {
        e.preventDefault();
        if (this._v) this.dispatchEvent(new CustomEvent("color-add", { detail: { value: this._v } }));
      });
    }
  };
  define("color-input", NovaColorInput);
  var GEN2 = [
    { type: "grid", name: "", schema: [{ name: "title", selector: { text: {} } }, { name: "icon", selector: { icon: {} } }] },
    { name: "show_header", selector: { boolean: {} } }
  ];
  var SRC = (c) => [
    { name: "area", selector: { area: {} } },
    ...c.area ? [{ name: "exclude", selector: { entity: { multiple: true, domain: "light" } } }, { name: "hide_group_members", selector: { boolean: {} } }] : []
  ];
  var COLORS = [{ name: "show_colors", selector: { boolean: {} } }];
  var LOOK2 = [
    { type: "grid", name: "", schema: [{ name: "use_light_color", selector: { boolean: {} } }, { name: "show_all_off", selector: { boolean: {} } }] },
    { name: "strip_area_name", selector: { boolean: {} } }
  ];
  var vis2 = (c) => `${!!c.area}|${c.show_colors !== false}`;
  var LAMP = [
    { name: "entity", required: true, selector: { entity: { domain: "light" } } },
    { type: "grid", name: "", schema: [{ name: "name", selector: { text: {} } }, { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } }] }
  ];
  var LAMP_ACT = [{ name: "tap_action", selector: { ui_action: {} } }, { name: "hold_action", selector: { ui_action: {} } }];
  var EDITOR_DEFAULTS2 = { show_header: true, show_all_off: true, use_light_color: true, show_colors: true, hide_group_members: true, strip_area_name: true };
  var toLamp = (x) => typeof x === "string" ? { entity: x } : { ...x };
  var LIGHT_EDITOR_CSS = `
.dots{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.dot{position:relative;width:30px;height:30px;border-radius:50%;border:2px solid var(--divider-color,#888);box-sizing:border-box}
.dot button{position:absolute;top:-6px;right:-6px;width:18px;height:18px;padding:0;border-radius:50%;border:none;background:var(--error-color,#db4437);color:#fff;font:700 12px/18px sans-serif;cursor:pointer}`;
  var NovaLightCardEditor = class extends NovaEditorBase {
    setConfig(c) {
      if (JSON.stringify(c) !== this._emitted) super.setConfig(c);
    }
    _onExternalConfig() {
      const c = this._config;
      if (c.entity) {
        c.entities = [c.entity, ...c.entities || []];
        delete c.entity;
      }
      c.entities = (c.entities || []).map(toLamp);
      this._pickerOpen ||= /* @__PURE__ */ new Set();
    }
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}${MAPROW_CSS}${LIGHT_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), data = { ...EDITOR_DEFAULTS2, ...c0 }, was = vis2(c0);
      const form = (schema) => this._form(schema, data, (v) => {
        const c = merge(this._config, names(schema), v);
        this._emit(this._clean(c));
        if (vis2(c) !== was) this._rebuild();
      });
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(GEN2))),
        this._section("lamps", "mdi:lightbulb-group", "Lampen", (b) => {
          b.append(form(SRC(data)), this._hint("Genau eine Lampe (ohne Bereich) = Einzelkachel. Mehrere = Sammelkarte."));
          this._config.entities.forEach((l, i) => b.append(this._lamp(l, i)));
          b.append(this._add("Lampe hinzufügen", () => {
            const lamps = [...this._config.entities, { entity: "" }];
            this._open.add(lamps.length - 1);
            this._set(lamps);
            this._rebuild();
          }));
        }),
        this._section("colors", "mdi:palette-swatch", "Farbknöpfe", (b) => {
          b.append(form(COLORS));
          if (data.show_colors !== false) b.append(this._hint("Gelten für alle Lampen; eigene Farbknöpfe je Lampe stehen bei der Lampe."), this._colors("all", this._config.colors || [], (colors) => {
            this._emit(this._clean({ ...this._config, colors }));
            this._config.entities = this._internal;
          }));
        }),
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(LOOK2)))
      );
    }
    // Standardwerte und leere Farblisten weglassen, Lampen ohne Extras als reine Entity-ID
    _clean(c) {
      const out = { ...c };
      this._internal = (c.entities || []).map(toLamp);
      Object.entries(EDITOR_DEFAULTS2).forEach(([k, v]) => out[k] === v && delete out[k]);
      if (!out.colors?.length) delete out.colors;
      out.entities = this._internal.map((l) => {
        const o = { ...l };
        if (!o.colors?.length) delete o.colors;
        return Object.keys(o).length === 1 && o.entity ? o.entity : o;
      });
      return out;
    }
    _set(lamps) {
      this._emit(this._clean({ ...this._config, entities: lamps }));
      this._config.entities = this._internal;
    }
    _emit(c) {
      super._emit(c);
      this._config = { ...c, entities: this._internal || (c.entities || []).map(toLamp) };
    }
    _label(l, i) {
      const s = l.entity ? this._hass?.states[l.entity] : null;
      return `${i + 1}. ${l.name || s?.attributes.friendly_name || l.entity || "Neue Lampe"}`;
    }
    _lamp(l, i) {
      const n = this._config.entities.length;
      const keys = names(LAMP);
      const [d] = this._details(i, l.icon || "mdi:lightbulb", this._label(l, i), this._itemBtns(i, n, (dir) => this._move(i, dir), () => this._removeLamp(i)), (body, s) => this._lampBody(body, s, l, i, keys));
      return d;
    }
    _lampBody(body, s, l, i, keys) {
      body.append(this._form(LAMP, l, (v) => {
        const lamps = [...this._config.entities], old = lamps[i];
        lamps[i] = merge(old, keys, v);
        this._set(lamps);
        s.querySelector(".lbl").textContent = this._label(lamps[i], i);
        if (old.entity !== lamps[i].entity) this._rebuild();
      }));
      body.append(this._h4("Aktionen"), this._form(LAMP_ACT, l, (v) => {
        const lamps = [...this._config.entities];
        lamps[i] = merge(lamps[i], names(LAMP_ACT), v);
        this._set(lamps);
      }));
      body.append(this._h4("Farbknöpfe dieser Lampe"), this._colors(`l${i}`, l.colors || [], (colors) => {
        const lamps = [...this._config.entities];
        lamps[i] = { ...lamps[i], colors };
        this._set(lamps);
      }, l.entity));
    }
    // Farbknöpfe: Punkte mit ×, darunter die Farbscheibe zum Hinzufügen. key merkt sich, ob die Scheibe offen ist
    _colors(key, colors, onChange, entity) {
      const box = document.createElement("div");
      box.style.cssText = "display:flex;flex-direction:column;gap:10px";
      const dots = document.createElement("div");
      dots.className = "dots";
      colors.forEach((v, j) => {
        const dot = document.createElement("div");
        dot.className = "dot";
        dot.style.background = swatchCss(v);
        dot.title = v;
        const x = document.createElement("button");
        x.textContent = "×";
        x.title = "Entfernen";
        x.addEventListener("click", (e) => {
          e.preventDefault();
          onChange(colors.filter((_, k) => k !== j));
          this._rebuild();
        });
        dot.append(x);
        dots.append(dot);
      });
      if (!colors.length) {
        const empty2 = document.createElement("span");
        empty2.className = "hint";
        empty2.textContent = "Noch keine – Farbe wählen und hinzufügen.";
        dots.append(empty2);
      }
      const open = this._pickerOpen.has(key);
      box.append(dots, this._add(open ? "Farbscheibe schließen" : "Farbe hinzufügen", () => {
        open ? this._pickerOpen.delete(key) : this._pickerOpen.add(key);
        this._rebuild();
      }));
      if (open) {
        const a = entity && this._hass?.states[entity]?.attributes, picker = document.createElement(tag("color-input"));
        if (a?.min_color_temp_kelvin) picker.setAttribute("kmin", a.min_color_temp_kelvin);
        if (a?.max_color_temp_kelvin) picker.setAttribute("kmax", a.max_color_temp_kelvin);
        picker.addEventListener("color-add", (e) => {
          if (!colors.includes(e.detail.value)) onChange([...colors, e.detail.value]);
          this._rebuild();
        });
        box.append(picker);
      }
      return box;
    }
    _move(i, dir) {
      const j = i + dir, lamps = [...this._config.entities];
      [lamps[i], lamps[j]] = [lamps[j], lamps[i]];
      this._open = /* @__PURE__ */ new Set([j]);
      this._pickerOpen = /* @__PURE__ */ new Set();
      this._set(lamps);
      this._rebuild();
    }
    _removeLamp(i) {
      this._open = /* @__PURE__ */ new Set();
      this._pickerOpen = /* @__PURE__ */ new Set();
      this._set(this._config.entities.filter((_, k) => k !== i));
      this._rebuild();
    }
  };
  __publicField(NovaLightCardEditor, "labels", {
    title: "Titel",
    icon: "Icon",
    area: "Bereich (alle Lampen automatisch)",
    exclude: "Ausblenden (bei Bereich)",
    show_header: "Kopfzeile",
    show_all_off: "„Alle aus“-Knopf",
    use_light_color: "In Lichtfarbe leuchten",
    show_colors: "Farbknöpfe anzeigen",
    entity: "Lampe",
    name: "Name",
    tap_action: "Aktion beim Antippen",
    hold_action: "Aktion bei langem Drücken",
    hide_group_members: "Lampen einer Lichtgruppe ausblenden",
    strip_area_name: "Raumnamen aus Lampennamen entfernen"
  });
  __publicField(NovaLightCardEditor, "helpers", {
    area: "Optional. Neue Lampen im Bereich erscheinen von selbst",
    hide_group_members: "Ist eine Lichtgruppe (z. B. Deckenlampen) im Bereich, erscheint nur die Gruppe, nicht jede einzelne Lampe darin.",
    strip_area_name: "„Wohnzimmer Pilzlampe“ wird zu „Pilzlampe“. Eigene Namen bleiben, wie sie sind."
  });
  __publicField(NovaLightCardEditor, "openSections", ["general", "lamps"]);
  define("light-card-editor", NovaLightCardEditor);
  var TAG3 = "light-card";
  var LIGHT_CSS = `
:host{container-type:inline-size}
.lc{padding:12px;display:flex;flex-direction:column;gap:10px}
.hd{display:flex;align-items:center;gap:8px;font-weight:600;font-size:14px;padding:0 4px}
.hd ha-icon{--mdc-icon-size:18px;opacity:.8}.hd .cnt{opacity:.6;font-weight:500;font-size:12px}
.hd .all{margin-left:auto;padding:4px 10px;border-radius:999px;background:var(--nv-chip);font-size:11.5px;font-weight:500;cursor:pointer;display:none}
.hd .all.show{display:block}.hd .all:active{transform:scale(.94)}
.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--nova-light-min-width,150px),1fr));gap:8px}
.t{position:relative;border-radius:16px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);padding:10px;display:flex;flex-direction:column;gap:8px;overflow:hidden;transition:background .3s,box-shadow .3s;min-width:0}
.t.on{background:color-mix(in srgb,var(--lc,var(--nv-accent)) 22%,rgba(255,255,255,.08));box-shadow:0 0 18px color-mix(in srgb,var(--lc,var(--nv-accent)) 30%,transparent);border-color:color-mix(in srgb,var(--lc,var(--nv-accent)) 45%,transparent)}
.t.na{opacity:.35}
.top{display:flex;align-items:center;gap:8px;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}
.ic{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.12);transition:background-color .3s,color .3s,border-color .3s,box-shadow .3s,transform .3s,opacity .3s}
.ic ha-icon{--mdc-icon-size:18px}
.t.on .ic{background:var(--lc,var(--nv-accent));color:var(--nv-accent-fg);box-shadow:0 0 12px color-mix(in srgb,var(--lc,var(--nv-accent)) 60%,transparent)}
.top:active .ic{transform:scale(.9)}
.nm{flex:1;min-width:0}.nm b{display:block;font-size:13px;font-weight:500;overflow-wrap:anywhere;hyphens:auto;line-height:1.25}.nm small{display:block;font-size:11px;opacity:.6}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:22px;border-radius:11px;margin:0;outline:none;
background:linear-gradient(90deg,var(--lc,var(--nv-accent)) 0 var(--p,0%),rgba(255,255,255,.14) var(--p,0%) 100%)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:#fff;box-shadow:0 1px 4px rgba(0,0,0,.4)}
input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:#fff;border:none}
.t:not(.on) input[type=range]{opacity:.5}
.dots{display:flex;flex-wrap:wrap;gap:6px}.dots:empty{display:none}
.dot{width:24px;height:24px;border-radius:50%;cursor:pointer;border:2px solid rgba(255,255,255,.45);box-sizing:border-box;-webkit-tap-highlight-color:transparent}
.dot:active{transform:scale(.88)}
.single .lc,.lc.single{padding:0}.single .grid{display:block}
.single .t{border:none;border-radius:var(--nv-radius);background:transparent;padding:12px;height:100%;box-sizing:border-box}
@container (max-width:300px){.grid{grid-template-columns:1fr}}`;
  var entityOf = (x) => typeof x === "string" ? x : x?.entity;
  function normalize3(c) {
    if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
    const entities = [].concat(c.entity ? [c.entity] : [], c.entities || []).filter(entityOf).map(toLamp);
    if (!entities.length && !c.area) throw new Error("entities oder area angeben");
    return { show_all_off: true, show_header: true, ...c, entities };
  }
  var NovaLightCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag(`${TAG3}-editor`));
    }
    // Erster Bereich mit Lampen, sonst die ersten 4 Lampen
    static getStubConfig(h) {
      for (const area of Object.values(h.areas || {})) {
        if (Object.keys(h.states).filter((id) => id.startsWith("light.") && areaOf(h, id) === area.area_id).length) return { title: area.name, area: area.area_id };
      }
      return { entities: Object.keys(h.states).filter((id) => id.startsWith("light.")).slice(0, 4) };
    }
    setConfig(c) {
      this._c = normalize3(c);
      this._ids = entityIds(this._c);
      this._built = false;
      if (this._h) {
        this._build();
        this._update();
      }
    }
    set hass(h) {
      const prev2 = this._list, old = this._h;
      this._h = h;
      if (!this._c) return;
      if (this._built && !hassChanged(old, h, [...this._ids, ...prev2 || []])) return;
      const now = this._lights();
      if (!this._built || now.join() !== (prev2 || []).join()) this._build();
      this._update();
    }
    getCardSize() {
      return 1 + Math.ceil((this._list?.length || 2) / 2) * 2;
    }
    // Genau eine Lampe ohne Bereich = Einzelkachel
    get _single() {
      return this._c && !this._c.area && this._c.entities.length === 1;
    }
    getGridOptions() {
      return this._single ? { columns: 6, rows: "auto", min_columns: 3 } : { columns: 12, rows: "auto", min_columns: 4 };
    }
    // Eingetragene Lampen, dann sichtbare Lampen des Bereichs alphabetisch
    _lights() {
      const c = this._c, h = this._h, ids = c.entities.map((l) => l.entity);
      if (c.area && h) {
        const ex = new Set(c.exclude || []);
        Object.keys(h.states).filter((id) => id.startsWith("light.") && areaOf(h, id) === c.area && !ex.has(id) && !ids.includes(id)).filter((id) => {
          const e = h.entities?.[id];
          return !e || !e.hidden && !e.entity_category;
        }).sort((a, b) => (h.states[a].attributes.friendly_name || a).localeCompare(h.states[b].attributes.friendly_name || b)).forEach((id) => ids.push(id));
        if (c.hide_group_members !== false) {
          const mine = new Set(c.entities.map((l) => l.entity));
          const inGroup = new Set(ids.flatMap((id) => [].concat(h.states[id]?.attributes.entity_id || [])));
          return ids.filter((id) => mine.has(id) || !inGroup.has(id));
        }
      }
      return ids;
    }
    _build() {
      if (!this._c || !this._h) return;
      this._built = true;
      const c = this._c, h = this._h;
      this._list = this._lights();
      const r = this.shadowRoot || this.attachShadow({ mode: "open" }), title = c.title ?? (c.area ? h.areas?.[c.area]?.name : "") ?? "";
      r.innerHTML = `<style>${CARD_CSS}${LIGHT_CSS}</style>
<div class="g lc ${this._single ? "single" : ""}">
  ${!this._single && c.show_header && (title || c.show_all_off) ? `<div class="hd"><ha-icon icon="${esc(c.icon || "mdi:lightbulb-group")}"></ha-icon><span>${esc(title)}</span><span class="cnt"></span><div class="all">Alle aus</div></div>` : ""}
  <div class="grid"></div>
</div>`;
      this._cnt = r.querySelector(".cnt");
      this._all = r.querySelector(".all");
      this._all?.addEventListener("click", () => {
        const on = this._list.filter((id) => this._h.states[id]?.state === "on");
        if (on.length) this._h.callService("light", "turn_off", { entity_id: on });
      });
      const grid2 = r.querySelector(".grid"), byId = Object.fromEntries(c.entities.map((l) => [l.entity, l]));
      this._tiles = this._list.map((id) => {
        const o = byId[id] || { entity: id }, tile = document.createElement("div");
        tile.className = "t";
        tile.innerHTML = '<div class="top" tabindex="0" role="button"><div class="ic"><ha-icon></ha-icon></div><div class="nm"><b></b><small></small></div></div><input type="range" min="1" max="100"><div class="dots"></div>';
        const top = tile.querySelector(".top"), slider = tile.querySelector("input"), dots = tile.querySelector(".dots");
        dots.addEventListener("click", (e) => {
          const v = e.composedPath().find((x) => x.dataset?.c)?.dataset.c;
          if (v) this._h.callService("light", "turn_on", { entity_id: id, ...swatchService(v) });
        });
        press(top, {
          tap: () => o.tap_action?.action ? hassAction(this, { entity: id, tap_action: o.tap_action }, "tap") : this._h.callService("light", "toggle", { entity_id: id }),
          hold: () => o.hold_action?.action ? hassAction(this, { entity: id, hold_action: o.hold_action }, "hold") : moreInfo(this, id),
          isolate: true
        });
        slider.addEventListener("pointerdown", () => {
          tile._drag = true;
        });
        slider.addEventListener("input", () => tile.style.setProperty("--p", `${slider.value}%`));
        slider.addEventListener("change", () => {
          this._h.callService("light", "turn_on", { entity_id: id, brightness_pct: +slider.value });
          setTimeout(() => {
            tile._drag = false;
          }, 800);
        });
        grid2.appendChild(tile);
        return { id, o, t: tile, ic: tile.querySelector("ha-icon"), nm: tile.querySelector("b"), st: tile.querySelector("small"), sl: slider, dots };
      });
    }
    _update() {
      if (!this._h || !this._tiles) return;
      const h = this._h;
      let count = 0;
      for (const x of this._tiles) {
        const s = h.states[x.id], a = s?.attributes || {}, on = s?.state === "on", na = !s || s.state === "unavailable";
        if (on) count++;
        const dimmable = (a.supported_color_modes || []).some((m) => m !== "onoff"), pct = on ? Math.max(1, Math.round((a.brightness || 0) / 2.55)) : 0;
        x.t.classList.toggle("on", on);
        x.t.classList.toggle("na", na);
        x.ic.setAttribute("icon", x.o.icon || a.icon || (on ? "mdi:lightbulb-on" : "mdi:lightbulb-outline"));
        x.nm.textContent = x.o.name || this._strip(a.friendly_name || x.id, x.id);
        x.st.textContent = na ? "nicht erreichbar" : on ? dimmable ? `${pct} %` : "an" : "aus";
        const rgb = this._c.use_light_color !== false && on && a.rgb_color;
        if (rgb) x.t.style.setProperty("--lc", `rgb(${rgb.join(",")})`);
        else x.t.style.removeProperty("--lc");
        x.sl.style.display = dimmable && !na ? "" : "none";
        if (!x.t._drag) {
          x.sl.value = pct || 1;
          x.t.style.setProperty("--p", `${pct}%`);
        }
        const swatches = !na && (hasColor(a) || hasColorTemp(a)) && this._c.show_colors !== false ? [...x.o.colors || [], ...this._c.colors || []].filter((v, i, arr) => arr.indexOf(v) === i) : [];
        const sig = swatches.join();
        if (x.dots._sig !== sig) {
          x.dots._sig = sig;
          x.dots.innerHTML = swatches.map((v) => `<div class="dot" data-c="${esc(v)}" style="background:${esc(swatchCss(v))}"></div>`).join("");
        }
      }
      if (this._cnt) this._cnt.textContent = count ? `${count} an` : "";
      this._all?.classList.toggle("show", !!this._c.show_all_off && count > 0);
    }
    // Raumname vorne oder hinten weglassen: „Küche Decke“ → „Decke“. strip_prefix legt das Wort fest,
    // sonst Name des Bereichs der Lampe (bzw. der Karte) und der Titel; strip_area_name: false schaltet es ab.
    _strip(name, id) {
      const c = this._c, h = this._h;
      const words = c.strip_prefix != null ? [c.strip_prefix] : c.strip_area_name === false ? [] : [h.areas?.[areaOf(h, id) || c.area]?.name, h.areas?.[c.area]?.name, c.title];
      for (const w of words) {
        if (!w) continue;
        const n = name.toLowerCase(), p = w.toLowerCase();
        if (n.startsWith(p + " ") && name.length > w.length + 1) return name.slice(w.length + 1);
        if (n.endsWith(" " + p) && name.length > w.length + 1) return name.slice(0, -w.length - 1);
      }
      return name;
    }
  };
  define(TAG3, NovaLightCard, { name: "Nova Licht Card", description: "Lampen als Kacheln: Antippen schaltet, Regler dimmt, leuchtet in der Lichtfarbe.", documentationURL: docUrl("nova-licht-card") });

  // src/dock.js
  var countOn = (h, group, ex) => (h.states[group]?.attributes.entity_id || []).filter((id) => !(ex || []).includes(id) && isOn(h.states[id])).length;
  var PCSS = `
:host{position:fixed;inset:0;z-index:6;display:flex;align-items:center;justify-content:center;background:rgba(8,12,22,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:fi .2s}
.root{width:min(var(--nova-popup-width,1180px),96vw);max-height:84vh;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;box-sizing:border-box;padding:14px;border-radius:28px;
background:linear-gradient(160deg,rgba(92,110,148,.8),rgba(22,27,42,.9));border:1px solid var(--nv-border);box-shadow:0 20px 60px rgba(0,0,0,.45);color:var(--nv-fg);font-family:var(--ha-font-family-body,Roboto,sans-serif);animation:up .28s cubic-bezier(.2,.8,.2,1)}
.hd{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;margin-bottom:14px;padding:6px 6px 6px 14px;border-radius:999px;background:rgba(60,72,100,.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
.tt{flex:1;min-width:0;font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.x{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.14);cursor:pointer;flex:none}
ha-icon{--mdc-icon-size:20px;display:flex}
.body{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--nova-popup-min-col,300px),1fr));gap:12px;align-items:start}
.body.one{grid-template-columns:1fr}
.empty{opacity:.6;font-size:13px;padding:8px}
@media(max-width:600px){:host{align-items:flex-end}.root{width:100vw;max-height:86vh;border-radius:28px 28px 0 0;padding:12px 12px calc(90px + env(safe-area-inset-bottom))}.body{grid-template-columns:1fr}}
@keyframes up{from{transform:translateY(40px);opacity:0}}@keyframes fi{from{opacity:0}}`;
  var NovaDockPopup = class extends HTMLElement {
    constructor() {
      super();
      const r = this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${DOCK_VARS}${PCSS}</style><div class="root"><div class="hd"><ha-icon class="hi"></ha-icon><span class="tt"></span><div class="x" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></div></div><div class="body"></div></div>`;
      this._body = r.querySelector(".body");
      this._cards = [];
      r.querySelector(".x").addEventListener("click", () => this.onclose?.());
      this.addEventListener("click", (e) => {
        if (e.composedPath()[0] === this) this.onclose?.();
      });
    }
    set cfg(c) {
      this._cfg = c;
      const r = this.shadowRoot;
      r.querySelector(".tt").textContent = c.title || "";
      r.querySelector(".hi").setAttribute("icon", c.icon || "mdi:dots-horizontal");
      this._body.classList.toggle("one", (c.cards || []).length === 1);
      this._load();
    }
    async _load() {
      const helpers2 = await window.loadCardHelpers();
      this._body.innerHTML = "";
      this._cards = (this._cfg.cards || []).map((cc) => {
        const el2 = helpers2.createCardElement(cc);
        if (this._h) el2.hass = this._h;
        this._body.appendChild(el2);
        return el2;
      });
      if (!this._cards.length) this._body.innerHTML = '<div class="empty">Noch keine Karten in diesem Pop-up – im Dock-Editor unter „Einfaches Pop-up: Karten“ eintragen.</div>';
    }
    set hass(h) {
      this._h = h;
      this._cards.forEach((c) => {
        c.hass = h;
      });
    }
  };
  define("dock-popup", NovaDockPopup);
  var DCSS = `
:host{display:block;height:var(--nova-dock-space,64px)}
.dock.inline{max-width:100%}
ha-icon{--mdc-icon-size:22px;display:flex}
.dock{position:fixed;left:50%;transform:translateX(-50%);display:flex;gap:8px;padding:8px;border-radius:999px;background:var(--nv-bg);
backdrop-filter:blur(var(--nv-blur)) saturate(160%);-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(160%);border:1px solid var(--nv-border);
box-shadow:0 12px 36px rgba(0,0,0,.4);z-index:7;max-width:calc(100vw - 24px);overflow-x:auto;scrollbar-width:none;box-sizing:border-box}
.dock.bottom{bottom:calc(14px + env(safe-area-inset-bottom))}.dock.top{top:14px}
.dock::-webkit-scrollbar{display:none}
.dock.inline{position:static;transform:none;margin:0 auto;width:max-content}
.d{width:var(--sz);height:var(--sz);border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:var(--nv-fg);cursor:pointer;position:relative;transition:background-color .2s,color .2s,border-color .2s,box-shadow .2s,transform .2s,opacity .2s;-webkit-tap-highlight-color:transparent;outline:none}
.d:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
.d:active{transform:scale(.9)}
.d.act{background:var(--nv-active);box-shadow:0 0 16px color-mix(in srgb,var(--nv-active) 60%,transparent)}
.d.here{outline:2px solid rgba(255,255,255,.5)}
.d img{width:60%;height:60%;object-fit:contain}
.dot{position:absolute;top:14%;right:14%;width:8px;height:8px;border-radius:50%;background:var(--nv-accent);box-shadow:0 0 6px var(--nv-accent);display:none}
.d.bd .dot{display:block}
.num{position:absolute;top:2px;right:0;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:8px;background:var(--nv-accent);color:#3a2a00;font:700 10px/16px var(--ha-font-family-body,Roboto,sans-serif);text-align:center;display:none}
.d.bn .num{display:block}.d.bn .dot{display:none}
.empty{color:var(--nv-fg);opacity:.7;font-size:13px;padding:6px 12px}
@media(max-width:600px){.d{width:calc(var(--sz) * .875);height:calc(var(--sz) * .875)}.dock{gap:5px;padding:6px}}`;
  var SRC2 = {};
  var findDock = (o) => {
    if (!o || typeof o !== "object") return null;
    if ((o.type === `custom:${tag("dock-card")}` || o.type === "custom:nz-dock-card") && Array.isArray(o.items) && o.items.length) return o;
    for (const v of Object.values(o)) {
      const r = findDock(v);
      if (r) return r;
    }
    return null;
  };
  var NovaDockCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("dock-card-editor"));
    }
    static getStubConfig() {
      return { items: [
        { icon: "mdi:home", label: "Start", tap_action: { action: "navigate", navigation_path: location.pathname } },
        { icon: "mdi:lightbulb-group", label: "Licht", popup_title: "Licht", cards: [{ type: "markdown", content: "Hier deine Licht-Karten eintragen" }] }
      ] };
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      if (!c.items && !c.source) throw new Error("items oder source angeben");
      this._cfg = { position: "bottom", button_size: 48, ...c };
      this._ids = entityIds(c);
      this._close();
      this._items = null;
      this._btns = null;
      this._built = false;
      this._cur = -1;
      if (this._h) this.hass = this._h;
    }
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._cfg) return;
      if (this._pop) this._pop.hass = h;
      if (this._hp) this._hp.hass = h;
      if (!this._items) {
        if (this._cfg.items) this._items = this._cfg.items;
        else {
          this._loadSource();
          return;
        }
      }
      if (!this._built) this._build();
      else if (!hassChanged(old, h, this._watch(old))) return;
      this._update();
    }
    // Entitäten der Einträge, bei Zählern auch die Mitglieder der Gruppe
    _watch(h) {
      if (this._srcIds?.items !== this._items) this._srcIds = { items: this._items, ids: entityIds(this._items) };
      const ids = [...this._ids, ...this._srcIds.ids];
      (this._items || []).forEach((it) => {
        if (it.badge_count_of) ids.push(...h?.states[it.badge_count_of]?.attributes.entity_id || []);
      });
      return ids;
    }
    async _loadSource() {
      if (this._loading) return;
      this._loading = true;
      const k = this._cfg.source;
      SRC2[k] = SRC2[k] || this._h.callWS({ type: "lovelace/config", url_path: k === "default" ? null : k }).then(findDock).catch(() => null);
      const d = await SRC2[k];
      this._loading = false;
      this._items = d ? d.items : [];
      this._srcCfg = d || {};
      this.hass = this._h;
    }
    connectedCallback() {
      this._applyInline();
      requestAnimationFrame(() => this._applyInline());
      this._loc = () => this._update();
      window.addEventListener("location-changed", this._loc);
      window.addEventListener("popstate", this._loc);
      window.addEventListener("hashchange", this._loc);
    }
    disconnectedCallback() {
      window.removeEventListener("location-changed", this._loc);
      window.removeEventListener("popstate", this._loc);
      window.removeEventListener("hashchange", this._loc);
      this._close();
      if (this._hp) {
        this._hp.remove();
        this._hp = null;
      }
    }
    getCardSize() {
      return 1;
    }
    getGridOptions() {
      return { columns: "full", rows: 1 };
    }
    get _inline() {
      if (this.preview || this.editMode || this.hasAttribute("preview") || this._cfg?.inline) return true;
      const PREV2 = /* @__PURE__ */ new Set(["HUI-CARD-PICKER", "HUI-CARD-PREVIEW", "HUI-DIALOG-EDIT-CARD", "HUI-DIALOG-CREATE-CARD", "HUI-CARD-ELEMENT-EDITOR"]);
      let n = this;
      for (let i = 0; i < 40 && n; i++) {
        if (PREV2.has(n.tagName)) return true;
        n = n.parentElement || n.getRootNode?.().host;
      }
      return false;
    }
    _applyInline() {
      this.shadowRoot?.querySelector(".dock")?.classList.toggle("inline", this._inline);
    }
    _build() {
      this._built = true;
      const c = this._cfg, r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${DOCK_VARS}${DCSS}</style><div class="dock ${esc(c.position)} ${this._inline ? "inline" : ""}" style="--sz:${+c.button_size || 48}px"></div>`;
      const dock = r.querySelector(".dock");
      if (this._hp) r.appendChild(this._hp);
      if (!this._items.length) {
        dock.innerHTML = `<span class="empty">${c.source ? `Kein Dock in „${esc(c.source)}“ gefunden` : "Noch keine Einträge"}</span>`;
        this._btns = [];
        return;
      }
      this._btns = this._items.map((it, i) => {
        const d = document.createElement("div");
        d.className = "d";
        d.tabIndex = 0;
        d.setAttribute("role", "button");
        d.title = it.label || it.popup_title || "";
        const ic = it.icon || "mdi:circle-outline";
        d.innerHTML = `${isImg(ic) ? `<img src="${esc(ic)}" alt="">` : `<ha-icon icon="${esc(ic)}"></ha-icon>`}<span class="dot"></span><span class="num"></span>`;
        d.addEventListener("click", () => this._tap(i));
        d.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            this._tap(i);
          }
        });
        if (it.hold_action) {
          let t;
          d.addEventListener("pointerdown", () => {
            t = setTimeout(() => {
              d._held = true;
              hassAction(this, { entity: it.entity, hold_action: it.hold_action }, "hold");
            }, 500);
          });
          ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => d.addEventListener(ev, () => clearTimeout(t)));
        }
        dock.appendChild(d);
        return d;
      });
    }
    _path(it) {
      return it.tap_action?.action === "navigate" ? it.tap_action.navigation_path : it.navigation_path;
    }
    _update() {
      if (!this._btns || !this._h) return;
      const h = this._h;
      this._items.forEach((it, i) => {
        const d = this._btns[i];
        if (!d) return;
        const p = this._path(it);
        d.classList.toggle("act", i === this._cur || !!it.popup_hash && curHash() === cleanHash(it.popup_hash));
        d.classList.toggle("here", !!p && location.pathname === p);
        let n = 0, dot = false;
        if (it.badge_count_of) n = countOn(h, it.badge_count_of, it.badge_exclude);
        else if (it.badge) dot = isOn(h.states[it.badge]);
        const showNum = n > 0 && it.badge_show_number;
        d.classList.toggle("bd", dot || n > 0 && !showNum);
        d.classList.toggle("bn", showNum);
        if (showNum) d.querySelector(".num").textContent = n > 99 ? "99+" : n;
      });
    }
    _tap(i) {
      const it = this._items[i];
      if (this._btns[i]?._held) {
        this._btns[i]._held = false;
        return;
      }
      if (it.popup_hash) {
        this._close();
        return togglePopup(this, this._h, cleanHash(it.popup_hash), this._cfg.source);
      }
      if (this._cur === i) return this._close();
      this._close();
      if (Array.isArray(it.cards)) return this._openCards(i, it);
      if (typeof it.popup === "string" && customElements.get("nz-popup")) return this._openLegacy(i, it);
      if (it.tap_action && it.tap_action.action !== "none") return hassAction(this, { entity: it.entity, tap_action: it.tap_action }, "tap");
      if (it.navigation_path) return navigate(it.navigation_path);
      if (it.entity) moreInfo(this, it.entity);
    }
    _openCards(i, it) {
      const p = document.createElement(tag("dock-popup"));
      p.onclose = () => this._close();
      p.cfg = { title: it.popup_title || it.label || "", icon: it.icon, cards: it.cards };
      p.hass = this._h;
      this.shadowRoot.appendChild(p);
      this._opened(i, p);
    }
    _openLegacy(i, it) {
      const p = document.createElement("nz-popup");
      p.host = this;
      p.onclose = () => this._close();
      p.cfg = { weather: this._srcCfg?.weather || this._cfg.weather, ...it, title: it.title || it.label };
      document.body.appendChild(p);
      p.hass = this._h;
      this._opened(i, p);
    }
    _opened(i, p) {
      this._pop = p;
      this._cur = i;
      this._update();
      this._esc = (e) => {
        if (e.key === "Escape") this._close();
      };
      window.addEventListener("keydown", this._esc);
    }
    _close() {
      if (this._pop) {
        this._pop.remove();
        this._pop = null;
      }
      this._cur = -1;
      if (this._esc) window.removeEventListener("keydown", this._esc);
      this._update();
    }
  };
  define("dock-card", NovaDockCard, { name: "Nova Dock Card", description: "Schwebende Leiste unten mit Buttons: navigieren, Aktion auslösen oder Popup mit beliebigen Karten öffnen.", documentationURL: docUrl("nova-dock-card") });
  var GEN3 = [{ name: "source", selector: { text: {} } }];
  var LOOK3 = [{ type: "grid", name: "", schema: [
    { name: "position", selector: { select: { mode: "dropdown", options: [{ value: "bottom", label: "Unten" }, { value: "top", label: "Oben" }] } } },
    { name: "button_size", selector: { number: { min: 32, max: 72, step: 2, mode: "box", unit_of_measurement: "px" } } }
  ] }];
  var I_MAIN = [{ type: "grid", name: "", schema: [
    { name: "icon", required: true, selector: { icon: {} } },
    { name: "label", selector: { text: {} } }
  ] }];
  var I_TAP = (opts) => [
    { name: "popup_hash", selector: { select: { mode: "dropdown", custom_value: true, options: opts } } },
    { name: "tap_action", selector: { ui_action: {} } }
  ];
  var I_POP = [{ name: "popup_title", selector: { text: {} } }, { name: "cards", selector: { object: {} } }];
  var I_BADGE = (it) => [
    { name: "badge", selector: { entity: {} } },
    { name: "badge_count_of", selector: { entity: {} } },
    ...it.badge_count_of ? [{ name: "badge_show_number", selector: { boolean: {} } }, { name: "badge_exclude", selector: { entity: { multiple: true } } }] : []
  ];
  var LABELS = {
    position: "Position",
    button_size: "Button-Größe",
    source: "Einträge aus anderem Dashboard übernehmen",
    icon: "Icon",
    label: "Name",
    tap_action: "Aktion beim Antippen",
    popup_title: "Titel",
    popup_hash: "Nova Pop-up öffnen",
    cards: "Karten (YAML-Liste)",
    badge: "Punkt, wenn diese Entität an ist",
    badge_count_of: "Zähler: Gruppe",
    badge_show_number: "Zahl statt Punkt",
    badge_exclude: "Beim Zählen ignorieren"
  };
  var HELPERS = {
    source: "Optional: URL-Pfad eines Dashboards (z. B. neues-zuhause). Dann gilt dessen Dock – praktisch für mehrere Dashboards mit gleicher Leiste.",
    popup_hash: "Öffnet die Nova Pop-up Card mit diesem Hash (Liste = Pop-ups in diesem Dashboard). Hat Vorrang vor der Aktion und dem einfachen Pop-up.",
    cards: "Wenn gesetzt, öffnet der Button ein Pop-up mit diesen Karten (statt der Aktion). Beispiel: - type: tile, entity: light.flur",
    badge_count_of: "Zeigt Punkt/Zahl, wenn Mitglieder der Gruppe an sind (z. B. light.alle_lampen)"
  };
  var NovaDockCardEditor = class extends NovaEditorBase {
    // Pop-ups des Dashboards für die Auswahlliste einmal laden
    set hass(h) {
      super.hass = h;
      if (h && !this._hashes) {
        this._hashes = [];
        popupOptions(h).then((o) => {
          this._hashes = o;
          this._rebuild();
        });
      }
    }
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap");
      const data = { position: "bottom", button_size: 48, ...this._config };
      const form = (schema) => this._form(schema, data, (v) => {
        const c = merge(this._config, names(schema), v);
        if (c.position === "bottom") delete c.position;
        if (c.button_size === 48) delete c.button_size;
        const hadSrc = !!this._config.source;
        this._emit(c);
        if (hadSrc !== !!c.source) this._rebuild();
      });
      const items = this._config.items || [];
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => {
          b.append(form(GEN3));
          if (this._config.source && !items.length) b.append(this._hint("Einträge kommen aus dem anderen Dashboard. Eigene Buttons überschreiben das."));
        }),
        this._section("buttons", "mdi:dock-bottom", "Buttons", (b) => {
          items.forEach((it, i) => b.append(this._item(it, i, items.length)));
          b.append(this._add("Button hinzufügen", () => {
            const n = [...items, { icon: "mdi:circle-outline" }];
            this._open = /* @__PURE__ */ new Set([n.length - 1]);
            this._emit({ ...this._config, items: n });
            this._rebuild();
          }));
        }),
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(LOOK3)))
      );
    }
    _popName(h) {
      h = cleanHash(h);
      return this._hashes?.find((o) => o.value === h)?.label || `#${h}`;
    }
    _label(it, i) {
      return `${i + 1}. ${it.label || it.popup_title || (it.popup_hash ? this._popName(it.popup_hash) : "") || (Array.isArray(it.cards) ? "Einfaches Pop-up" : it.tap_action?.navigation_path) || "Neuer Button"}`;
    }
    _item(it, i, n) {
      const opts = this._hashes?.length ? this._hashes : [{ value: "", label: "– keins –" }];
      const [d, s] = this._details(i, it.icon || "mdi:circle-outline", this._label(it, i), this._itemBtns(i, n, (dir) => this._move(i, dir), () => this._remove(i)), (b) => {
        const form = (schema) => this._form(schema, it, (v) => {
          const list2 = [...this._config.items], old = list2[i];
          const nx = merge(old, names(schema), v);
          if (nx.popup_hash) nx.popup_hash = cleanHash(nx.popup_hash);
          if (!nx.popup_hash) delete nx.popup_hash;
          if (nx.cards && !Array.isArray(nx.cards)) nx.cards = [nx.cards];
          if (!nx.badge_show_number) delete nx.badge_show_number;
          list2[i] = nx;
          this._emit({ ...this._config, items: list2 });
          s.querySelector(".lbl").textContent = this._label(nx, i);
          s.querySelector("ha-icon").setAttribute("icon", nx.icon || "mdi:circle-outline");
          if (!!old.badge_count_of !== !!nx.badge_count_of) this._rebuild();
        });
        b.append(form(I_MAIN), this._h4("Beim Antippen"), form(I_TAP(opts)), this._h4("Einfaches Pop-up"), form(I_POP), this._h4("Punkt und Zähler"), form(I_BADGE(it)));
      });
      return d;
    }
    _move(i, dir) {
      const j = i + dir, list2 = [...this._config.items];
      [list2[i], list2[j]] = [list2[j], list2[i]];
      this._open = /* @__PURE__ */ new Set([j]);
      this._emit({ ...this._config, items: list2 });
      this._rebuild();
    }
    _remove(i) {
      this._open = /* @__PURE__ */ new Set();
      const list2 = this._config.items.filter((_, k) => k !== i);
      const c = { ...this._config };
      if (list2.length) c.items = list2;
      else delete c.items;
      if (!c.items && !c.source) c.items = [];
      this._emit(c);
      this._rebuild();
    }
  };
  __publicField(NovaDockCardEditor, "labels", LABELS);
  __publicField(NovaDockCardEditor, "helpers", HELPERS);
  __publicField(NovaDockCardEditor, "openSections", ["buttons"]);
  define("dock-card-editor", NovaDockCardEditor);

  // src/shared/editor-schema.js
  var g2 = (...schema) => ({ type: "grid", name: "", schema });
  var T = { text: {} };
  var I = { icon: {} };
  var A = { ui_action: {} };
  var ENT = { name: "entity", required: true, selector: { entity: {} } };
  var TITLE = { name: "title", selector: T };
  var COLS = { name: "columns", selector: { number: { min: 1, max: 4, mode: "slider" } } };
  var NUM = (n) => ({ name: n, selector: { number: { mode: "box", step: "any" } } });
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

  // src/modular.js
  var SLIDE = {
    number: { v: (s) => +s.state, r: (a) => [a.min ?? 0, a.max ?? 100, a.step ?? 1], set: (h, id, v) => h.callService("number", "set_value", { entity_id: id, value: v }) },
    input_number: { v: (s) => +s.state, r: (a) => [a.min ?? 0, a.max ?? 100, a.step ?? 1], set: (h, id, v) => h.callService("input_number", "set_value", { entity_id: id, value: v }) },
    light: {
      v: (s) => s.state === "on" ? Math.max(1, Math.round((s.attributes.brightness || 0) / 2.55)) : 0,
      r: () => [0, 100, 1],
      u: "%",
      set: (h, id, v) => v > 0 ? h.callService("light", "turn_on", { entity_id: id, brightness_pct: v }) : h.callService("light", "turn_off", { entity_id: id })
    },
    fan: { v: (s) => s.state === "on" ? s.attributes.percentage ?? 0 : 0, r: (a) => [0, 100, a.percentage_step || 1], u: "%", set: (h, id, v) => h.callService("fan", "set_percentage", { entity_id: id, percentage: Math.round(v) }) },
    cover: { v: (s) => s.attributes.current_position ?? 0, r: () => [0, 100, 1], u: "%", set: (h, id, v) => h.callService("cover", "set_cover_position", { entity_id: id, position: v }) },
    media_player: { v: (s) => Math.round((s.attributes.volume_level ?? 0) * 100), r: () => [0, 100, 1], u: "%", set: (h, id, v) => h.callService("media_player", "volume_set", { entity_id: id, volume_level: v / 100 }) },
    climate: { v: (s) => s.attributes.temperature ?? 0, r: (a) => [a.min_temp ?? 7, a.max_temp ?? 35, a.target_temp_step ?? 0.5], u: "°", set: (h, id, v) => h.callService("climate", "set_temperature", { entity_id: id, temperature: v }) },
    water_heater: { v: (s) => s.attributes.temperature ?? 0, r: (a) => [a.min_temp ?? 30, a.max_temp ?? 70, a.target_temp_step ?? 1], u: "°", set: (h, id, v) => h.callService("water_heater", "set_temperature", { entity_id: id, temperature: v }) }
  };
  var duration = (m) => m >= 60 ? `${Math.floor(m / 60)}:${String(Math.round(m % 60)).padStart(2, "0")} h` : `${m} min`;
  var ITEMS = { info: "entities", entities: "entities", sliders: "entities", buttons: "buttons", alerts: "alerts" };
  var normBlock = (b) => {
    const k = ITEMS[b.type];
    if (!k) return { ...b };
    const it = (b[k] || []).map((x) => typeof x === "string" ? { entity: x } : { ...x });
    return { ...b, [k]: it.filter((x) => k === "buttons" ? x.entity || x.tap_action : x.entity) };
  };
  var BLOCKS = {
    header(b, w) {
      const ent = b.status || b.active;
      const btn = b.button_icon || b.button_action?.action && b.button_action.action !== "none";
      w.innerHTML = `<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div><span class="pct"></span>${btn ? '<div class="hb"></div>' : ""}</div><div class="prog" hidden><i></i></div>`;
      const q = (s) => w.querySelector(s), hd = q(".hd"), ic = q(".ic"), sm = q("small"), pct = q(".pct"), pg = q(".prog"), pi = q(".prog i");
      q("b").textContent = b.name ?? "";
      press(ic, { tap: () => this._act({ entity: ent, tap_action: b.tap_action }, "tap", true), hold: () => this._act({ entity: ent, hold_action: b.hold_action }, "hold") });
      if (btn) {
        setIcon(q(".hb"), b.button_icon || "mdi:dots-horizontal");
        press(q(".hb"), { tap: () => this._act({ entity: ent, tap_action: b.button_action }, "tap", true) });
      }
      return (h) => {
        const s = b.status && h.states[b.status];
        const on = b.active ? isOn(h.states[b.active]) : isOn(s);
        if (!b.name && ent) q("b").textContent = h.states[ent]?.attributes.friendly_name || "";
        setIcon(ic, b.icon || s?.attributes.icon || "mdi:devices");
        hd.classList.toggle("on", on);
        sm.textContent = s ? fmtState(h, s) : b.active ? on ? "an" : "aus" : "";
        const pr = b.progress && h.states[b.progress], p = pr ? parseFloat(pr.state) : NaN;
        const show = !isNaN(p) && p > 0 && (on || p < 100);
        pg.hidden = !show;
        pct.textContent = show ? `${Math.round(p)} %` : "";
        if (show) pi.style.width = `${Math.min(100, p)}%`;
      };
    },
    info(b, w) {
      const chips = b.layout === "chips";
      const box = document.createElement("div");
      box.className = chips ? "pills" : "list";
      if (b.columns > 1) box.style.setProperty("--cols", b.columns);
      const els = b.entities.map((o) => {
        const el2 = document.createElement("div");
        el2.className = chips ? "pill" : "kv";
        el2.innerHTML = chips ? '<span class="i"></span><span class="t"></span>' : '<span class="i"></span><span class="k"></span><span class="v"></span>';
        press(el2, { tap: () => this._act(o, "tap", true), hold: () => this._act(o, "hold") });
        box.append(el2);
        return [el2, o];
      });
      w.append(box);
      return (h) => els.forEach(([el2, o]) => {
        const s = h.states[o.entity];
        el2.classList.toggle("na", !s || s.state === "unavailable");
        setIcon(el2.firstChild, iconOf(h, o, "mdi:information-outline"));
        const v = valueOf(h, s, o);
        if (chips) el2.lastChild.textContent = o.name === "" ? v : `${nameOf(h, o)} · ${v}`;
        else {
          el2.children[1].textContent = nameOf(h, o);
          el2.children[2].textContent = v;
        }
      });
    },
    entities(b, w) {
      const box = document.createElement("div");
      box.className = "list";
      if (b.columns > 1) box.style.setProperty("--cols", b.columns);
      const els = b.entities.map((o) => {
        const el2 = document.createElement("div");
        el2.className = "row";
        el2.innerHTML = `<div class="ic"></div><div class="nm"><b></b><small></small></div>${TOGGLE.includes(dom(o.entity)) ? '<div class="sw"></div>' : ""}`;
        press(el2, { tap: () => this._act(o, "tap"), hold: () => this._act(o, "hold") });
        box.append(el2);
        return [el2, o];
      });
      w.append(box);
      return (h) => els.forEach(([el2, o]) => {
        const s = h.states[o.entity];
        el2.classList.toggle("na", !s || s.state === "unavailable");
        el2.classList.toggle("on", isOn(s) && !PRESS[dom(o.entity)]);
        setIcon(el2.firstChild, iconOf(h, o, "mdi:power"));
        el2.querySelector("b").textContent = nameOf(h, o);
        el2.querySelector("small").textContent = s ? valueOf(h, s, o) : "nicht gefunden";
      });
    },
    sliders(b, w) {
      const els = b.entities.map((o) => {
        const el2 = document.createElement("div");
        el2.className = "sl";
        el2.innerHTML = '<div class="kv"><span class="i"></span><span class="k"></span><span class="v"></span></div><input type="range">';
        const top = el2.firstChild, inp = el2.lastChild, v = el2.querySelector(".v");
        press(top, { tap: () => this._act(o, "tap", true), hold: () => this._act(o, "hold") });
        const paint = () => {
          const mn = +inp.min, mx = +inp.max, n = +inp.value;
          inp.style.setProperty("--p", `${mx > mn ? (n - mn) / (mx - mn) * 100 : 0}%`);
          v.textContent = o.format === "duration" ? duration(n) : unitJoin(n.toFixed(decOf(inp.step)), el2._u);
        };
        inp.addEventListener("pointerdown", () => {
          el2._drag = true;
        });
        inp.addEventListener("input", () => {
          el2._drag = true;
          paint();
        });
        inp.addEventListener("change", () => {
          SLIDE[dom(o.entity)]?.set(this._h, o.entity, +inp.value);
          clearTimeout(el2._t);
          el2._t = setTimeout(() => {
            el2._drag = false;
          }, 1500);
        });
        w.append(el2);
        return { el: el2, o, inp, paint };
      });
      return (h) => els.forEach(({ el: el2, o, inp, paint }) => {
        const s = h.states[o.entity], D = SLIDE[dom(o.entity)];
        el2.classList.toggle("na", !s || !D || s.state === "unavailable");
        setIcon(el2.querySelector(".i"), iconOf(h, o, "mdi:tune-variant"));
        el2.querySelector(".k").textContent = nameOf(h, o);
        inp.disabled = !s || !D || s.state === "unavailable";
        if (!s || !D) {
          el2.querySelector(".v").textContent = s ? fmtState(h, s) : "–";
          return;
        }
        const [mn, mx, st] = D.r(s.attributes);
        inp.min = o.min ?? mn;
        inp.max = o.max ?? mx;
        inp.step = o.step ?? st;
        el2._u = o.unit ?? D.u ?? s.attributes.unit_of_measurement;
        if (!el2._drag) inp.value = D.v(s);
        paint();
      });
    },
    buttons(b, w) {
      const box = document.createElement("div");
      box.className = `pills${b.layout === "grid" ? " grid" : ""}`;
      const els = b.buttons.map((o) => {
        const el2 = document.createElement("div");
        el2.className = "pill";
        el2.innerHTML = '<span class="i"></span><span class="t"></span>';
        press(el2, { tap: () => this._act(o, "tap"), hold: () => this._act(o, "hold") });
        box.append(el2);
        return [el2, o];
      });
      w.append(box);
      return (h) => els.forEach(([el2, o]) => {
        const s = o.entity && h.states[o.entity];
        el2.classList.toggle("na", !!o.entity && (!s || s.state === "unavailable"));
        el2.classList.toggle("on", !!s && TOGGLE.includes(dom(o.entity)) && isOn(s));
        setIcon(el2.firstChild, iconOf(h, o, "mdi:gesture-tap-button"));
        el2.lastChild.textContent = o.name ?? (s?.attributes.friendly_name || "");
      });
    },
    alerts(b, w) {
      const box = document.createElement("div");
      box.className = `als${b.layout === "chips" ? " chips" : ""}`;
      const els = b.alerts.map((o) => {
        const el2 = document.createElement("div");
        el2.className = `al ${o.level || "warning"}`;
        el2.innerHTML = '<span class="i"></span><span class="t"></span>';
        press(el2, { tap: () => this._act(o, "tap", true), hold: () => this._act(o, "hold") });
        box.append(el2);
        return [el2, o];
      });
      w.append(box);
      return (h) => {
        let lvl = 0;
        els.forEach(([el2, o]) => {
          const s = h.states[o.entity], hit = alertHit(o, s);
          el2.hidden = !hit;
          if (!hit) return;
          lvl = Math.max(lvl, o.level === "error" ? 2 : o.level === "info" ? 0 : 1);
          setIcon(el2.firstChild, o.icon || (o.level === "error" ? "mdi:alert-octagon" : o.level === "info" ? "mdi:information" : "mdi:alert"));
          el2.lastChild.textContent = o.message ? o.message.replace("{state}", fmtState(h, s)) : `${nameOf(h, o)}: ${fmtState(h, s)}`;
        });
        w.hidden = !els.some(([el2]) => !el2.hidden);
        return b.glow === false ? 0 : lvl;
      };
    }
  };
  var NovaModularCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("modular-card-editor"));
    }
    static getStubConfig(h) {
      const ids = Object.keys(h.states);
      const sensor = ids.find((i) => i.startsWith("sensor.")), sw = ids.find((i) => i.startsWith("switch."));
      return { blocks: [
        { type: "header", name: "Gerät", icon: "mdi:devices", ...sensor ? { status: sensor } : {} },
        ...sw ? [{ type: "entities", entities: [{ entity: sw }] }] : []
      ] };
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      if (!Array.isArray(c.blocks)) throw new Error("blocks (Liste der Bausteine) fehlt");
      this._c = { ...c, blocks: c.blocks.filter((b) => b && BLOCKS[b.type]).map(normBlock) };
      this._ids = entityIds(this._c);
      this._built = false;
      if (this._h) {
        this._build();
        this._update();
      }
    }
    // Neu zeichnen nur, wenn sich eine Entität der Karte geändert hat
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._built) this._build();
      else if (!hassChanged(old, h, this._ids)) return;
      this._update();
    }
    getCardSize() {
      return 1 + (this._c?.blocks.length || 1);
    }
    getGridOptions() {
      return { columns: 12, rows: "auto", min_columns: 4 };
    }
    _build() {
      this._built = true;
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}</style><div class="g"></div>`;
      this._g = r.querySelector(".g");
      this._ups = this._c.blocks.map((b) => {
        const w = document.createElement("div");
        w.className = `blk ${b.type}`;
        if (b.title) {
          const t = document.createElement("div");
          t.className = "bt";
          t.textContent = b.title;
          w.append(t);
        }
        const up = BLOCKS[b.type].call(this, b, w);
        this._g.append(w);
        return up;
      });
    }
    _update() {
      if (!this._h || !this._ups) return;
      const lvl = Math.max(0, ...this._ups.map((up) => up(this._h) || 0));
      this._g.classList.toggle("warn", lvl === 1);
      this._g.classList.toggle("err", lvl === 2);
    }
    _act(o, kind, info) {
      return runAction(this, o, kind, info);
    }
  };
  define("modular-card", NovaModularCard, { name: "Nova Modular Card", description: "Frei zusammensetzbare Gerätekarte: Kopfzeile, Infos, Schalter, Regler, Aktionsbuttons und Warnungen.", documentationURL: docUrl("nova-modular-card") });
  var BM = {
    // parts: Einstellungen in Gruppen mit Zwischenüberschrift (sonst ein Formular aus schema)
    header: { label: "Kopfzeile", icon: "mdi:page-layout-header", parts: [
      [null, [g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "status" } }), { name: "status", selector: { entity: {} } }]],
      ["Aktiv und Fortschritt", [g2({ name: "active", selector: { entity: {} } }, { name: "progress", selector: { entity: { domain: ["sensor", "number", "input_number"] } } })]],
      ["Aktionen", [{ name: "tap_action", selector: A }]],
      ["Button rechts", [{ name: "button_icon", selector: I }, { name: "button_action", selector: A }]]
    ] },
    info: {
      label: "Info-Entitäten",
      icon: "mdi:information-outline",
      item: "Entität",
      plural: "Entitäten",
      defaults: { layout: "rows", columns: 1 },
      schema: [TITLE, g2(sel("layout", [["rows", "Liste"], ["chips", "Chips"]]), COLS)],
      items: [ENT, NAMEICON, g2({ name: "unit", selector: T }, { name: "decimals", selector: { number: { min: 0, max: 4, mode: "box" } } }), { name: "tap_action", selector: A }]
    },
    entities: {
      label: "Schalter & Entitäten",
      icon: "mdi:toggle-switch-outline",
      item: "Entität",
      plural: "Entitäten",
      defaults: { columns: 1 },
      schema: [TITLE, COLS],
      items: [ENT, NAMEICON, { name: "tap_action", selector: A }, { name: "hold_action", selector: A }, { name: "confirm", selector: T }]
    },
    sliders: {
      label: "Schieberegler",
      icon: "mdi:tune-variant",
      item: "Regler",
      plural: "Regler",
      schema: [TITLE],
      items: [
        { ...ENT, selector: { entity: { domain: Object.keys(SLIDE) } } },
        NAMEICON,
        g2(NUM("min"), NUM("max"), NUM("step")),
        g2({ name: "unit", selector: T }, sel("format", [["value", "Zahl"], ["duration", "Minuten → Std:Min"]]))
      ]
    },
    buttons: {
      label: "Aktionsbuttons",
      icon: "mdi:gesture-tap-button",
      item: "Button",
      plural: "Buttons",
      key: "buttons",
      defaults: { layout: "pills" },
      schema: [TITLE, sel("layout", [["pills", "Pillen"], ["grid", "Kacheln"]])],
      items: [NAMEICON, { name: "entity", selector: { entity: {} } }, { name: "tap_action", selector: A }, { name: "confirm", selector: T }]
    },
    alerts: {
      label: "Warnungen",
      icon: "mdi:alert-outline",
      item: "Warnung",
      plural: "Warnungen",
      key: "alerts",
      defaults: { layout: "list", glow: true },
      schema: [TITLE, g2(sel("layout", [["list", "Balken"], ["chips", "Badges"]]), { name: "glow", selector: { boolean: {} } })],
      items: [
        ENT,
        g2({ name: "state", selector: T }, { name: "state_not", selector: T }),
        g2(NUM("above"), NUM("below")),
        { name: "message", selector: T },
        g2({ name: "icon", selector: I }, sel("level", [["warning", "Warnung"], ["error", "Fehler"], ["info", "Hinweis"]]))
      ]
    }
  };
  var MHELPERS = {
    status: "Text unter dem Namen. Aus/Standby/Idle = inaktiv",
    active: "Optional: bestimmt, ob das Icon leuchtet (statt Status-Entität)",
    button_icon: "Button erscheint, sobald Icon oder Aktion gesetzt ist",
    unit: "Überschreibt die Einheit der Entität",
    confirm: "Optional: Text der Rückfrage vor dem Auslösen",
    state: "Mehrere mit Komma trennen. Ohne Bedingung: Warnung bei „on“ bzw. „problem“",
    message: "Leer = Name: Zustand. {state} wird ersetzt",
    min: "Leer = Werte der Entität"
  };
  var normItems = (b) => {
    const k = ITEMS[b.type];
    return k && Array.isArray(b[k]) ? { ...b, [k]: b[k].map((x) => typeof x === "string" ? { entity: x } : x) } : { ...b };
  };
  var NovaModularCardEditor = class extends NovaEditorBase {
    _blocks() {
      return (this._config.blocks || []).map(normItems);
    }
    _set(bl) {
      this._emit({ ...this._config, blocks: bl });
    }
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      r.querySelector(".wrap").append(this._section("blocks", "mdi:view-dashboard-outline", "Bausteine", (w) => this._blockList(w)));
    }
    _blockList(w) {
      const bl = this._blocks();
      w.append(this._hint("Frei kombinierbar – die Reihenfolge hier ist die Reihenfolge auf der Karte."));
      bl.forEach((b, i) => w.append(this._block(b, i, bl.length)));
      const adds = document.createElement("div");
      adds.className = "adds";
      Object.entries(BM).forEach(([type, m]) => {
        adds.append(this._add(m.label, () => {
          const k = BM[type].items && (m.key || "entities");
          const n = [...bl, { type, ...k ? { [k]: [{}] } : {} }];
          this._open = /* @__PURE__ */ new Set([`${n.length - 1}`, `${n.length - 1}.0`]);
          this._set(n);
          this._rebuild();
        }));
      });
      w.append(adds);
    }
    _blabel(b, i) {
      const m = BM[b.type];
      return `${i + 1}. ${m ? m.label : b.type}${b.title || b.name ? " · " + (b.title || b.name) : ""}`;
    }
    _block(b, i, n) {
      const m = BM[b.type];
      const [d] = this._details(
        `${i}`,
        m?.icon || "mdi:help-circle-outline",
        this._blabel(b, i),
        this._itemBtns(i, n, (dir) => this._move(null, i, dir), () => this._del(null, i)),
        (body, s) => this._blockBody(body, s, b, i, m)
      );
      return d;
    }
    _blockBody(body, s, b, i, m) {
      if (!m) {
        body.append(this._hint(`Unbekannter Baustein „${b.type}“ – nur per YAML bearbeitbar.`));
        return;
      }
      const def = m.defaults || {};
      (m.parts || [[null, m.schema]]).forEach(([title, schema]) => {
        if (title) body.append(this._h4(title));
        body.append(this._form(schema, { ...def, ...b }, (v) => {
          const bl = this._blocks(), nb = merge(bl[i], names(schema), v);
          Object.entries(def).forEach(([k, x]) => nb[k] === x && delete nb[k]);
          bl[i] = nb;
          this._set(bl);
          s.querySelector(".lbl").textContent = this._blabel(nb, i);
        }));
      });
      if (m.items) {
        const k = m.key || "entities", items = b[k] || [];
        body.append(this._h4(m.plural));
        items.forEach((it, j) => body.append(this._sub(i, j, it, items.length, m, k)));
        body.append(this._add(`${m.item} hinzufügen`, () => {
          const bl = this._blocks();
          bl[i] = { ...bl[i], [k]: [...bl[i][k] || [], {}] };
          this._open = /* @__PURE__ */ new Set([`${i}`, `${i}.${bl[i][k].length - 1}`]);
          this._set(bl);
          this._rebuild();
        }));
      }
    }
    _sub(i, j, it, n, m, k) {
      const keys = names(m.items);
      const [d] = this._details(
        `${i}.${j}`,
        it.icon || m.icon,
        this._ilabel(it, j, m),
        this._itemBtns(j, n, (dir) => this._move(i, j, dir), () => this._del(i, j)),
        (body, s) => body.append(this._form(m.items, it, (v) => {
          const bl = this._blocks(), arr = [...bl[i][k]];
          arr[j] = merge(arr[j], keys, v);
          bl[i] = { ...bl[i], [k]: arr };
          this._set(bl);
          s.querySelector(".lbl").textContent = this._ilabel(arr[j], j, m);
        }))
      );
      return d;
    }
    // i = null: Block verschieben/löschen, sonst Eintrag j in Block i
    _move(i, j, dir) {
      const bl = this._blocks(), t = j + dir;
      if (i === null) {
        [bl[j], bl[t]] = [bl[t], bl[j]];
        this._open = /* @__PURE__ */ new Set([`${t}`]);
      } else {
        const k = BM[bl[i].type].key || "entities", arr = [...bl[i][k]];
        [arr[j], arr[t]] = [arr[t], arr[j]];
        bl[i] = { ...bl[i], [k]: arr };
        this._open = /* @__PURE__ */ new Set([`${i}`, `${i}.${t}`]);
      }
      this._set(bl);
      this._rebuild();
    }
    _del(i, j) {
      const bl = this._blocks();
      if (i === null) {
        bl.splice(j, 1);
        this._open = /* @__PURE__ */ new Set();
      } else {
        const k = BM[bl[i].type].key || "entities";
        bl[i] = { ...bl[i], [k]: bl[i][k].filter((_, x) => x !== j) };
        this._open = /* @__PURE__ */ new Set([`${i}`]);
      }
      this._set(bl);
      this._rebuild();
    }
  };
  __publicField(NovaModularCardEditor, "labels", BASE_LABELS);
  __publicField(NovaModularCardEditor, "helpers", MHELPERS);
  __publicField(NovaModularCardEditor, "openSections", ["blocks"]);
  define("modular-card-editor", NovaModularCardEditor);

  // src/camera.js
  var CCSS = `
.g.cam{padding:12px;gap:10px}
.media{position:relative;border-radius:calc(var(--nv-radius) - 8px);overflow:hidden;background:rgba(0,0,0,.35);aspect-ratio:var(--ar,16/9);cursor:pointer;-webkit-tap-highlight-color:transparent}
.media>img,.media .live,.media .live>*{position:absolute;inset:0;width:100%;height:100%;display:block;object-fit:var(--fit,cover);border:none}
.media .live>*{--video-max-height:100%;--ha-card-border-radius:0;--ha-card-background:transparent}
.media .live:empty{display:none}
.media .ph{position:absolute;inset:0;display:flex;align-items:center;justify-content:center;opacity:.45}
.media .ph ha-icon{--mdc-icon-size:40px}
.ovl{position:absolute;display:flex;gap:6px;flex-wrap:wrap;z-index:2;pointer-events:none}
.ovl>*{pointer-events:auto}
.ovl.tl{top:8px;left:8px;right:40%}.ovl.tr{top:8px;right:8px;justify-content:flex-end;max-width:58%}
.ovl.bot{left:8px;right:8px;bottom:8px;justify-content:center}
.ovl .pill,.ovl .al{background:rgba(10,14,24,.55);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border-color:rgba(255,255,255,.14)}
.ovl .pill{padding:5px 10px;font-size:12px}
.ovl .pill.on{background:var(--nv-accent);color:var(--nv-accent-fg);box-shadow:none}
.ovl .al{background:color-mix(in srgb,var(--c) 55%,rgba(10,14,24,.6))}
.ovl .al ha-icon{color:inherit}
.cb{width:40px;height:40px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(10,14,24,.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.16)}
.cb.on{background:var(--nv-active);color:var(--nv-active-fg)}
.cb:active,.pill:active{transform:scale(.92)}
.dot{position:absolute;left:10px;bottom:10px;z-index:1;display:flex;align-items:center;gap:5px;font-size:10.5px;font-weight:700;letter-spacing:.06em;padding:3px 8px;border-radius:999px;background:rgba(10,14,24,.55)}
.dot::before{content:'';width:7px;height:7px;border-radius:50%;background:var(--nv-error)}
.has-ov .dot{display:none}
.x{display:none;position:absolute;top:10px;right:10px;z-index:3}
.media.fs{position:fixed;inset:0;z-index:9;border-radius:0;aspect-ratio:auto;background:#000}
.media.fs>img,.media.fs .live>*,.media:fullscreen>img,.media:fullscreen .live>*{object-fit:contain}
.media.fs .x,.media:fullscreen .x{display:flex}
.ptz{display:flex;align-items:center;gap:8px;z-index:2}
.ovl-ptz{position:absolute;right:10px;bottom:10px}
.ptz.below{justify-content:center}
.pad{width:var(--nova-camera-ptz-size,108px);aspect-ratio:1;border-radius:50%;display:grid;grid-template:repeat(3,1fr)/repeat(3,1fr);box-sizing:border-box;padding:4px;
background:rgba(10,14,24,.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.16)}
.below .pad{background:var(--nv-chip)}
.pad>i,.zm>i{font-style:normal;display:flex;align-items:center;justify-content:center;border-radius:50%;cursor:pointer;-webkit-tap-highlight-color:transparent;touch-action:none;transition:background .15s}
.pad>i ha-icon{--mdc-icon-size:26px}
.pad>[data-k=up]{grid-area:1/2}.pad>[data-k=left]{grid-area:2/1}.pad>[data-k=right]{grid-area:2/3}.pad>[data-k=down]{grid-area:3/2}
.pad>[data-k=home]{grid-area:2/2;background:rgba(255,255,255,.12);margin:4px}.pad>[data-k=home] ha-icon{--mdc-icon-size:18px}
.zm{display:flex;flex-direction:column;gap:8px}
.zm>i{width:36px;height:36px;background:rgba(10,14,24,.5);backdrop-filter:blur(10px);-webkit-backdrop-filter:blur(10px);border:1px solid rgba(255,255,255,.16)}
.below .zm>i{background:var(--nv-chip)}
.pad>i.act,.zm>i.act{background:var(--nv-active);color:var(--nv-active-fg)}
.has-ptz .ovl.bot{right:calc(var(--nova-camera-ptz-size,108px) + 64px);justify-content:flex-start}
@container (max-width:320px){.pad{--nova-camera-ptz-size:88px}}
.split{display:grid;gap:8px;grid-template-columns:repeat(2,minmax(0,1fr));--nova-camera-ptz-size:84px}
.split.row{grid-auto-flow:column;grid-template-columns:none;grid-auto-columns:minmax(0,1fr)}
.split.column{grid-template-columns:1fr}
.split>${tag("camera-card")}{display:block;min-width:0}
@container (max-width:420px){.split{grid-template-columns:1fr;grid-auto-flow:row}}
.g.bare{padding:0;background:none;border:none;box-shadow:none;backdrop-filter:none;-webkit-backdrop-filter:none;border-radius:0;overflow:visible}
.pill.lbl{font-weight:600}`;
  var RATIO = { "16:9": "16/9", "4:3": "4/3", "1:1": "1/1", "21:9": "21/9", "9:16": "9/16" };
  var CDEF = { aspect_ratio: "16:9", fit: "cover", image_action: "more-info", stream: "auto", refresh: 10, buttons_position: "overlay", show_header: true, ptz: "auto", ptz_position: "overlay", split_layout: "grid" };
  var CLISTS = ["buttons", "chips", "alerts", "split"];
  var hasCond = (o) => o.state != null || o.state_not != null || o.above != null || o.below != null;
  var PTZ_KEYS = ["up", "left", "right", "down", "home", "zoom_in", "zoom_out"];
  var PTZ_ICON = { up: "mdi:chevron-up", down: "mdi:chevron-down", left: "mdi:chevron-left", right: "mdi:chevron-right", home: "mdi:crosshairs-gps", zoom_in: "mdi:magnify-plus-outline", zoom_out: "mdi:magnify-minus-outline" };
  var PTZ_NAME = { up: "Hoch", down: "Runter", left: "Links", right: "Rechts", home: "Ausgangsposition", zoom_in: "Zoom +", zoom_out: "Zoom −" };
  var PTZ_ONVIF = { up: { tilt: "UP" }, down: { tilt: "DOWN" }, left: { pan: "LEFT" }, right: { pan: "RIGHT" }, zoom_in: { zoom: "ZOOM_IN" }, zoom_out: { zoom: "ZOOM_OUT" } };
  var PTZ_RE = [
    ["zoom_in", /zoom.?(in|rein|\+|nah)/],
    ["zoom_out", /zoom.?(out|raus|-|weg)/],
    ["left", /left|links/],
    ["right", /right|rechts/],
    ["down", /down|abw|runter|unten/],
    ["up", /up|aufw|hoch|oben/],
    ["home", /home|ausgang|zentr|center|mitte/]
  ];
  function ptzAuto(h, cam) {
    const dev = h?.entities?.[cam]?.device_id, m = {};
    if (!dev) return m;
    Object.values(h.entities).filter((e) => e.device_id === dev && dom(e.entity_id) === "button").forEach((e) => {
      const s = `${e.entity_id} ${e.translation_key || ""} ${h.states[e.entity_id]?.attributes.friendly_name || ""}`.toLowerCase();
      if (!/pan|tilt|zoom|ptz|schwenk|neig|move|beweg|dreh|home|ausgang/.test(s)) return;
      const hit = PTZ_RE.find(([, re]) => re.test(s));
      if (hit && !m[hit[0]]) m[hit[0]] = e.entity_id;
    });
    return m;
  }
  function ptzMap(h, c) {
    const p = c.ptz;
    if (p === "onvif") return dom(c.entity) === "camera" ? { ...PTZ_ONVIF, home: void 0 } : {};
    const m = p === "auto" || p === true ? ptzAuto(h, c.entity) : p && typeof p === "object" ? p : {};
    return Object.fromEntries(PTZ_KEYS.filter((k) => m[k]).map((k) => [k, m[k]]));
  }
  function repeat(el2, fn, ms = 450) {
    let t;
    const stop = () => {
      clearInterval(t);
      el2.classList.remove("act");
    };
    el2.classList.add("tap");
    el2.tabIndex = 0;
    el2.setAttribute("role", "button");
    el2.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      stop();
      el2.classList.add("act");
      fn();
      t = setInterval(fn, ms);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((n) => el2.addEventListener(n, stop));
    el2.addEventListener("click", (e) => e.stopPropagation());
    el2.addEventListener("contextmenu", (e) => e.preventDefault());
    el2.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        fn();
      }
    });
  }
  var camPre;
  var camStream = () => customElements.get("ha-camera-stream") ? Promise.resolve(true) : camPre ||= (async () => {
    try {
      (await window.loadCardHelpers()).createCardElement({ type: "picture-entity", entity: "camera.nova", camera_view: "live" });
    } catch {
    }
    return Promise.race([customElements.whenDefined("ha-camera-stream").then(() => true), new Promise((r) => setTimeout(() => r(false), 3e3))]);
  })();
  var NovaCameraCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("camera-card-editor"));
    }
    static getStubConfig(h) {
      const ids = Object.keys(h.states);
      return { entity: ids.find((i) => i.startsWith("camera.")) || ids.find((i) => i.startsWith("image.")) || "camera." };
    }
    constructor() {
      super();
      this._vis = false;
      this._onVis = () => this._sync();
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      if (!c.entity || !["camera", "image"].includes(dom(c.entity))) throw new Error("entity muss eine camera.* oder image.* Entität sein");
      this._c = { ...CDEF, ...c };
      CLISTS.forEach((k) => {
        this._c[k] = [].concat(c[k] || []).map(toObj).filter((o) => o.entity || o.tap_action);
      });
      this._ids = entityIds(this._c);
      this._built = false;
      this._stopLive();
      if (this._h) {
        this._build();
        this._update();
      }
    }
    // Neu zeichnen nur, wenn sich eine Entität der Karte (auch die gefundenen PTZ-Buttons) geändert hat
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      this._kids?.forEach((k) => {
        k.hass = h;
      });
      if (!this._built) this._build();
      else if (!hassChanged(old, h, [...this._ids, ...Object.values(this._ptz || {}).filter((v) => typeof v === "string")])) return;
      this._update();
    }
    getCardSize() {
      return 5 + (this._c?.split.length ? 3 : 0);
    }
    getGridOptions() {
      return { columns: 12, rows: "auto", min_columns: 4 };
    }
    connectedCallback() {
      this._quiet = inPicker(this);
      document.addEventListener("visibilitychange", this._onVis);
      if ("IntersectionObserver" in window) {
        this._io ||= new IntersectionObserver((es) => {
          this._vis = es[es.length - 1].isIntersecting;
          this._sync();
        }, { rootMargin: "100px" });
        this._io.observe(this);
      } else {
        this._vis = true;
        this._sync();
      }
    }
    disconnectedCallback() {
      document.removeEventListener("visibilitychange", this._onVis);
      this._io?.disconnect();
      this._vis = false;
      this._sync();
    }
    _build() {
      this._built = true;
      const c = this._c, r = this.shadowRoot || this.attachShadow({ mode: "open" });
      const hb = c.button_icon || c.button_action?.action && c.button_action.action !== "none";
      const ov = c.buttons_position !== "below";
      this._ptz = ptzMap(this._h, c);
      const pk = Object.keys(this._ptz), pov = c.ptz_position !== "below";
      this.classList.toggle("nv-flat", !!c.bare);
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${CCSS}</style><div class="g cam${c.bare ? " bare" : ""}">
${c.show_header !== false ? `<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${hb ? '<div class="hb"></div>' : ""}</div>` : ""}
<div class="media${ov && c.buttons.length ? " has-ov" : ""}${pk.length && pov ? " has-ptz" : ""}"><div class="ph"><ha-icon icon="mdi:cctv-off"></ha-icon></div><img class="still" alt=""><div class="live"></div>
<span class="dot" hidden>LIVE</span><div class="ovl tl"></div><div class="ovl tr"></div>${ov ? '<div class="ovl bot"></div>' : ""}<div class="cb x" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></div>${pk.length && pov ? '<div class="ptz ovl-ptz"></div>' : ""}</div>
${pk.length && !pov ? '<div class="ptz below"></div>' : ""}${!ov && c.buttons.length ? '<div class="pills below"></div>' : ""}</div>`;
      const q = (s) => r.querySelector(s);
      this._e = { g: q(".g"), hd: q(".hd"), ic: q(".hd .ic"), name: q(".hd b"), sub: q(".hd small"), media: q(".media"), still: q(".still"), live: q(".live"), ph: q(".ph"), dot: q(".dot") };
      const m = this._e.media;
      m.style.setProperty("--ar", RATIO[c.aspect_ratio] || String(c.aspect_ratio).replace(":", "/"));
      m.style.setProperty("--fit", c.fit === "contain" ? "contain" : "cover");
      this._e.still.addEventListener("load", () => {
        this._e.ph.hidden = true;
      });
      this._e.still.addEventListener("error", () => {
        this._e.ph.hidden = false;
      });
      if (this._e.hd) {
        press(this._e.ic, { tap: () => this._act({ entity: c.entity, tap_action: c.tap_action }, "tap", true), hold: () => this._act({ entity: c.entity, hold_action: c.hold_action }, "hold") });
        if (hb) {
          setIcon(q(".hb"), c.button_icon || "mdi:dots-horizontal");
          press(q(".hb"), { tap: () => this._act({ entity: c.status || c.entity, tap_action: c.button_action }, "tap", true) });
        }
      }
      m.addEventListener("click", (e) => {
        if (!e.composedPath().some((x) => x.classList?.contains("tap"))) this._tapImage();
      });
      press(q(".x"), { tap: () => this._fullscreen(false) });
      this._btns = c.buttons.map((o) => {
        const el2 = document.createElement("div");
        el2.className = ov ? "cb" : "pill";
        el2.innerHTML = ov ? '<span class="i"></span>' : '<span class="i"></span><span class="t"></span>';
        press(el2, { tap: () => this._act(o, "tap"), hold: () => this._act(o, "hold") });
        q(ov ? ".ovl.bot" : ".below").append(el2);
        return [el2, o];
      });
      this._chips = c.chips.map((o) => {
        const el2 = document.createElement("div");
        el2.className = "pill";
        el2.innerHTML = '<span class="i"></span><span class="t"></span>';
        press(el2, { tap: () => this._act(o, "tap", true) });
        q(".ovl.tl").append(el2);
        return [el2, o];
      });
      this._alerts = c.alerts.map((o) => {
        const el2 = document.createElement("div");
        el2.className = `al ${o.level || "warning"}`;
        el2.innerHTML = '<span class="i"></span><span class="t"></span>';
        press(el2, { tap: () => this._act(o, "tap", true) });
        q(".ovl.tr").append(el2);
        return [el2, o];
      });
      if (pk.length) {
        const box = q(".ptz"), dirs = pk.filter((k) => !k.startsWith("zoom")), zm = pk.filter((k) => k.startsWith("zoom"));
        const mk = (k) => {
          const el2 = document.createElement("i");
          el2.dataset.k = k;
          el2.title = PTZ_NAME[k];
          el2.innerHTML = `<ha-icon icon="${PTZ_ICON[k]}"></ha-icon>`;
          repeat(el2, () => this._ptzGo(k));
          return el2;
        };
        if (dirs.length) {
          const pad = document.createElement("div");
          pad.className = "pad";
          pad.append(...dirs.map(mk));
          box.append(pad);
        }
        if (zm.length) {
          const z = document.createElement("div");
          z.className = "zm";
          z.append(...zm.map(mk));
          box.append(z);
        }
        this._ptzEls = [...box.querySelectorAll("[data-k]")];
      } else this._ptzEls = [];
      const lbl = c.label ?? (c.split.length ? this._h.states[c.entity]?.attributes.friendly_name : null);
      if (lbl) {
        const l = document.createElement("div");
        l.className = "pill lbl";
        l.textContent = lbl;
        q(".ovl.tl").prepend(l);
      }
      this._kids = [];
      if (c.split.length) {
        const sp = document.createElement("div");
        sp.className = `split ${c.split_layout}`;
        m.before(sp);
        sp.append(m);
        this._kids = c.split.map((o) => {
          const k = document.createElement(tag("camera-card"));
          try {
            k.setConfig({
              entity: o.entity,
              bare: true,
              show_header: false,
              label: o.name ?? this._h.states[o.entity]?.attributes.friendly_name ?? o.entity,
              aspect_ratio: c.aspect_ratio,
              fit: c.fit,
              stream: c.stream,
              refresh: c.refresh,
              image_action: o.image_action || c.image_action,
              ptz: o.ptz === "off" ? false : o.ptz ?? "auto",
              ...o.ptz_onvif ? { ptz_onvif: o.ptz_onvif } : {}
            });
          } catch (e) {
            console.warn("[nova-cards] Splitscreen", o.entity, e.message);
            return null;
          }
          k.hass = this._h;
          sp.append(k);
          return k;
        }).filter(Boolean);
      }
      this._stillKey = null;
      this._sync();
    }
    _update() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !e) return;
      const s = h.states[c.entity], st = c.status && h.states[c.status];
      e.g.classList.toggle("na", !s || s.state === "unavailable");
      this.classList.toggle("nv-na", !s || s.state === "unavailable");
      if (e.hd) {
        e.name.textContent = c.name ?? s?.attributes.friendly_name ?? c.entity;
        setIcon(e.ic, c.icon || st?.attributes.icon || s?.attributes.icon || (dom(c.entity) === "image" ? "mdi:image" : "mdi:cctv"));
        e.sub.textContent = st ? fmtState(h, st) : !s ? "nicht gefunden" : this._mode ? "Live" : "";
        e.hd.classList.toggle("on", st ? isOn(st) : !!this._mode);
      }
      this._btns.forEach(([el2, o]) => {
        const bs = o.entity && h.states[o.entity];
        el2.classList.toggle("na", !!o.entity && (!bs || bs.state === "unavailable"));
        el2.classList.toggle("on", !!bs && TOGGLE.includes(dom(o.entity)) && isOn(bs));
        setIcon(el2.firstChild, iconOf(h, o, "mdi:gesture-tap-button"));
        el2.title = nameOf(h, o);
        if (el2.children[1]) el2.children[1].textContent = o.name ?? (bs?.attributes.friendly_name || "");
      });
      this._chips.forEach(([el2, o]) => {
        const cs = h.states[o.entity];
        el2.hidden = !cs || hasCond(o) && !alertHit(o, cs);
        if (el2.hidden) return;
        el2.classList.toggle("on", dom(o.entity) === "binary_sensor" && cs.state === "on");
        setIcon(el2.firstChild, iconOf(h, o, "mdi:information-outline"));
        const v = valueOf(h, cs, o);
        el2.lastChild.textContent = o.name ? `${o.name} · ${v}` : v;
      });
      let lvl = 0;
      this._alerts.forEach(([el2, o]) => {
        const as = h.states[o.entity], hit = alertHit(o, as);
        el2.hidden = !hit;
        if (!hit) return;
        lvl = Math.max(lvl, o.level === "error" ? 2 : o.level === "info" ? 0 : 1);
        setIcon(el2.firstChild, o.icon || (o.level === "error" ? "mdi:alert-octagon" : o.level === "info" ? "mdi:information" : "mdi:alert"));
        el2.lastChild.textContent = o.message ? o.message.replace("{state}", fmtState(h, as)) : `${nameOf(h, o)}: ${fmtState(h, as)}`;
      });
      this._ptzEls.forEach((el2) => {
        const v = this._ptz[el2.dataset.k];
        el2.classList.toggle("na", typeof v === "string" && (!h.states[v] || h.states[v].state === "unavailable"));
      });
      if (c.glow === false) lvl = 0;
      e.g.classList.toggle("warn", lvl === 1);
      e.g.classList.toggle("err", lvl === 2);
      if (dom(c.entity) === "image" && s && this._stillKey !== s.state) this._still();
      if (this._liveEl && "hass" in this._liveEl) this._liveEl.hass = h;
    }
    _ptzGo(k) {
      const v = this._ptz[k], c = this._c;
      if (this._c.ptz === "onvif") return this._h.callService("onvif", "ptz", { entity_id: c.entity, ...v, ...c.ptz_onvif || {} }).catch((e) => console.warn("[nova-cards] onvif.ptz", e));
      if (typeof v === "string") return this._act({ entity: v }, "tap");
      if (v?.action) return this._act({ entity: c.entity, tap_action: v }, "tap");
    }
    _still() {
      const s = this._h?.states[this._c.entity], p = s?.attributes.entity_picture;
      if (!p) return;
      this._stillKey = s.state;
      this._e.still.src = stamp(p, dom(this._c.entity) === "image" ? s.state : Date.now());
    }
    // Stream nur, wenn Karte sichtbar und Tab aktiv – sonst Standbild
    _sync() {
      if (!this._e || !this._h) return;
      const show = this._vis && !document.hidden && this.isConnected;
      const live = show && !this._quiet && dom(this._c.entity) === "camera" && this._c.stream !== "snapshot";
      if (live && !this._mode && !this._starting) this._startLive();
      if (!live) this._stopLive();
      clearInterval(this._tm);
      this._tm = null;
      if (show && dom(this._c.entity) === "camera" && !this._mode) {
        if (!this._e.still.src) this._still();
        if (this._c.refresh > 0 && !this._quiet) this._tm = setInterval(() => !this._mode && this._still(), this._c.refresh * 1e3);
      }
    }
    async _startLive() {
      const c = this._c, id = this._lid = (this._lid || 0) + 1;
      this._starting = true;
      let mode = c.stream;
      if (mode === "webrtc" && !customElements.get("webrtc-camera")) mode = "auto";
      if (mode === "auto") mode = await camStream() ? "ha" : "mjpeg";
      this._starting = false;
      if (id !== this._lid || !this._vis || document.hidden) return;
      const s = this._h.states[c.entity];
      if (!s) return;
      let el2;
      if (mode === "webrtc") {
        el2 = document.createElement("webrtc-camera");
        try {
          el2.setConfig({ entity: c.entity, ui: false, muted: true, ...c.webrtc || {} });
        } catch (e) {
          console.warn("[nova-cards] webrtc-camera", e);
        }
        el2.hass = this._h;
      } else if (mode === "ha") {
        el2 = document.createElement("ha-camera-stream");
        Object.assign(el2, { hass: this._h, stateObj: s, muted: true, controls: false, fitMode: c.fit === "contain" ? "contain" : "cover" });
      } else {
        const p = s.attributes.entity_picture;
        if (!p) return;
        el2 = document.createElement("img");
        el2.alt = "";
        el2.src = p.replace("/api/camera_proxy/", "/api/camera_proxy_stream/");
        el2.addEventListener("error", () => {
          if (this._liveEl !== el2) return;
          this._stopLive();
          this._retry = setTimeout(() => this._sync(), 1e4);
        });
      }
      this._mode = mode;
      this._liveEl = el2;
      this._e.live.replaceChildren(el2);
      this._e.dot.hidden = false;
      this._e.ph.hidden = true;
      this._sync();
      this._update();
    }
    _stopLive() {
      this._lid = (this._lid || 0) + 1;
      this._starting = false;
      clearTimeout(this._retry);
      if (!this._mode) return;
      if (this._liveEl?.tagName === "IMG") this._liveEl.src = "";
      this._liveEl = null;
      this._mode = null;
      if (this._e) {
        this._e.live.replaceChildren();
        this._e.dot.hidden = true;
        this._still();
        this._update();
      }
    }
    _tapImage() {
      const a = this._c.image_action;
      if (a === "none") return;
      if (a === "fullscreen") return this._fullscreen(!this._isFs());
      moreInfo(this, this._c.entity);
    }
    _isFs() {
      return this._e.media.classList.contains("fs") || this.shadowRoot.fullscreenElement === this._e.media;
    }
    _fullscreen(on) {
      const m = this._e.media;
      if (!on) {
        m.classList.remove("fs");
        if (document.fullscreenElement) document.exitFullscreen?.().catch(() => {
        });
        return;
      }
      const p = m.requestFullscreen?.();
      if (p?.catch) p.catch(() => m.classList.add("fs"));
      else if (!p) m.classList.add("fs");
    }
    _act(o, kind, info) {
      return runAction(this, o, kind, info);
    }
  };
  define("camera-card", NovaCameraCard, { name: "Nova Kamera Card", description: "Live-Bild von camera.* oder image.* mit Kopfzeile, rundem PTZ-Steuerkreuz, Splitscreen, frei belegbaren Buttons (Licht, Sirene …), Info-Chips und Warnungen.", documentationURL: docUrl("nova-kamera-card") });
  var C_GEN = [
    { name: "entity", required: true, selector: { entity: { domain: ["camera", "image"] } } },
    g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } }),
    { name: "status", selector: { entity: {} } },
    { name: "show_header", selector: { boolean: {} } }
  ];
  var C_IMG = [
    g2(sel("aspect_ratio", [["16:9", "16:9"], ["4:3", "4:3"], ["1:1", "1:1"]]), sel("fit", [["cover", "Füllen"], ["contain", "Ganzes Bild"]])),
    g2(
      sel("stream", [["auto", "Automatisch"], ["mjpeg", "MJPEG"], ["webrtc", "WebRTC-Karte"], ["snapshot", "Nur Standbild"]]),
      { name: "refresh", selector: { number: { min: 0, max: 300, mode: "box", unit_of_measurement: "s" } } }
    )
  ];
  var C_BTN = [sel("buttons_position", [["overlay", "Über dem Bild"], ["below", "Darunter"]])];
  var C_WARN = [{ name: "glow", selector: { boolean: {} } }];
  var C_SPLIT = [sel("split_layout", [["grid", "Raster (2 Spalten)"], ["row", "Nebeneinander"], ["column", "Untereinander"]])];
  var C_ACT = [
    { name: "tap_action", selector: A },
    sel("image_action", [["more-info", "Details (more-info)"], ["fullscreen", "Vollbild"], ["none", "Nichts"]])
  ];
  var C_HBTN = [g2({ name: "button_icon", selector: I }, { name: "button_action", selector: A })];
  var CPTZ = [g2(sel("ptz", [["auto", "Automatisch (Geräte-Buttons)"], ["manual", "Manuell"], ["onvif", "ONVIF"], ["off", "Aus"]]), sel("ptz_position", [["overlay", "Über dem Bild"], ["below", "Darunter"]]))];
  var PBTN = { entity: { domain: ["button", "input_button", "script", "scene"] } };
  var CPTZM = [
    g2({ name: "up", selector: PBTN }, { name: "down", selector: PBTN }),
    g2({ name: "left", selector: PBTN }, { name: "right", selector: PBTN }),
    { name: "home", selector: PBTN },
    g2({ name: "zoom_in", selector: PBTN }, { name: "zoom_out", selector: PBTN })
  ];
  var CM = {
    buttons: {
      label: "Steuer-Buttons",
      item: "Button",
      icon: "mdi:gesture-tap-button",
      items: [NAMEICON, { name: "entity", selector: { entity: {} } }, { name: "tap_action", selector: A }, { name: "hold_action", selector: A }, { name: "confirm", selector: T }]
    },
    chips: {
      label: "Info-Chips",
      item: "Chip",
      icon: "mdi:information-outline",
      items: [
        ENT,
        NAMEICON,
        g2({ name: "unit", selector: T }, { name: "decimals", selector: { number: { min: 0, max: 4, mode: "box" } } }),
        g2({ name: "state", selector: T }, { name: "state_not", selector: T }),
        g2(NUM("above"), NUM("below"))
      ]
    },
    split: {
      label: "Splitscreen (weitere Kameras)",
      item: "Kamera",
      icon: "mdi:view-split-vertical",
      items: [
        { name: "entity", required: true, selector: { entity: { domain: ["camera", "image"] } } },
        g2({ name: "name", selector: T }, sel("ptz", [["auto", "Automatisch"], ["onvif", "ONVIF"], ["off", "Aus"]]))
      ]
    },
    alerts: {
      label: "Warn-Badges",
      item: "Warnung",
      icon: "mdi:alert-outline",
      items: [
        ENT,
        g2({ name: "state", selector: T }, { name: "state_not", selector: T }),
        g2(NUM("above"), NUM("below")),
        { name: "message", selector: T },
        g2({ name: "icon", selector: I }, sel("level", [["warning", "Warnung"], ["error", "Fehler"], ["info", "Hinweis"]]))
      ]
    }
  };
  var CLABELS = {
    ...BASE_LABELS,
    status: "Status-Entität (optional)",
    show_header: "Kopfzeile anzeigen",
    glow: "Kartenrahmen bei Warnung einfärben",
    tap_action: "Aktion beim Antippen",
    aspect_ratio: "Seitenverhältnis",
    fit: "Bild einpassen",
    image_action: "Bild antippen",
    stream: "Live-Stream",
    refresh: "Standbild aktualisieren alle",
    buttons_position: "Buttons",
    state: "Bedingung: Zustand",
    state_not: "Bedingung: außer Zustand",
    above: "Bedingung: über",
    below: "Bedingung: unter",
    ptz: "Steuerkreuz",
    ptz_position: "Steuerkreuz-Position",
    split_layout: "Splitscreen-Anordnung",
    up: "Hoch (neigen)",
    down: "Runter (neigen)",
    left: "Links (schwenken)",
    right: "Rechts (schwenken)",
    home: "Mitte / Ausgangsposition",
    zoom_in: "Zoom +",
    zoom_out: "Zoom −"
  };
  var CHELPERS = {
    entity: "camera.* = Live-Stream, image.* = Bild (z. B. 3D-Drucker)",
    stream: "Automatisch = HA-Stream (HLS/WebRTC), sonst MJPEG. Läuft nur, solange die Karte sichtbar ist",
    refresh: "Nur ohne Live-Stream. 0 = aus",
    state: "Komma-Liste. Chips: leer = immer sichtbar · Warnungen: leer = bei „on“/„problem“",
    tap_action: "Gilt für das Icon oben. Standard: Details der Kamera",
    message: "Leer = Name: Zustand. {state} wird ersetzt",
    split_layout: "Schmale Karten stapeln automatisch",
    ptz: "Automatisch sucht Schwenk-/Neige-Buttons am Gerät der Kamera. Gedrückt halten = weiterfahren"
  };
  var NovaCameraCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), data = { ...CDEF, glow: true, ...c0 };
      const form = (schema) => this._form(schema, data, (v) => {
        const c = merge(this._config, names(schema), v);
        Object.entries(CDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        if (c.glow === true) delete c.glow;
        this._emit(c);
      });
      const list2 = (b, k) => {
        const m = CM[k];
        this._itemList(b, k, m.items, m, `${m.item} hinzufügen`);
      };
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(C_GEN))),
        this._section("image", "mdi:image-outline", "Bild und Stream", (b) => b.append(form(C_IMG))),
        this._section("ptz", "mdi:arrow-all", "Steuerkreuz", (b) => this._ptz(b)),
        this._section("buttons", CM.buttons.icon, CM.buttons.label, (b) => {
          b.append(form(C_BTN));
          list2(b, "buttons");
        }),
        this._section("info", "mdi:information-outline", "Infos und Warnungen", (b) => {
          b.append(this._h4(CM.chips.label));
          list2(b, "chips");
          b.append(this._h4(CM.alerts.label), form(C_WARN));
          list2(b, "alerts");
        }),
        this._section("split", CM.split.icon, CM.split.label, (b) => {
          if (this._items("split").length) b.append(form(C_SPLIT));
          list2(b, "split");
        }),
        this._section("actions", "mdi:gesture-tap", "Aktionen", (b) => b.append(form(C_ACT), this._h4("Button in der Kopfzeile"), form(C_HBTN)))
      );
    }
    // Steuerkreuz: Modus, bei „Manuell“ die Buttons, bei „Automatisch“ was gefunden wurde
    _ptz(w) {
      const p = this._config.ptz, mode = p === void 0 || p === true ? "auto" : p === false ? "off" : typeof p === "object" ? "manual" : p;
      w.append(this._form(CPTZ, { ptz: mode, ptz_position: this._config.ptz_position || "overlay" }, (v) => {
        const c = { ...this._config };
        if (v.ptz === "auto") delete c.ptz;
        else if (v.ptz === "off") c.ptz = false;
        else if (v.ptz === "manual") c.ptz = typeof p === "object" ? p : {};
        else c.ptz = v.ptz;
        if (v.ptz_position === "overlay") delete c.ptz_position;
        else c.ptz_position = v.ptz_position;
        this._emit(c);
        if (v.ptz !== mode) this._rebuild();
      }));
      if (mode === "manual") {
        w.append(this._form(CPTZM, { ...p }, (v) => {
          const o = Object.fromEntries(PTZ_KEYS.filter((k) => v[k]).map((k) => [k, v[k]]));
          this._emit({ ...this._config, ptz: o });
        }));
      } else if (mode === "auto") {
        const found = Object.keys(ptzAuto(this._hass, this._config.entity));
        w.append(this._hint(found.length ? `Gefunden: ${found.map((k) => PTZ_NAME[k]).join(", ")}` : "Keine Schwenk-/Neige-Buttons am Gerät gefunden – dann „Manuell“ wählen."));
      }
    }
  };
  __publicField(NovaCameraCardEditor, "labels", CLABELS);
  __publicField(NovaCameraCardEditor, "helpers", CHELPERS);
  __publicField(NovaCameraCardEditor, "openSections", ["general"]);
  define("camera-card-editor", NovaCameraCardEditor);

  // src/media.js
  var MPCSS = `
.g.mp{gap:12px;min-height:var(--nova-media-min-height,0)}
.g.mp.play{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-accent) 40%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.mp>*{position:relative;z-index:1}
.mp>.art{position:absolute;inset:0;z-index:0;background:center/cover no-repeat;opacity:0;transition:opacity .6s,filter .6s;pointer-events:none}
.mp.has-art>.art{opacity:var(--nova-media-artwork-opacity,.5)}
.mp.cover>.art{filter:blur(22px) saturate(140%);transform:scale(1.2)}
.mp:not(.play)>.art{filter:grayscale(.6)}.mp.cover:not(.play)>.art{filter:blur(22px) grayscale(.6)}
.mp>.shade{position:absolute;inset:0;z-index:0;background:linear-gradient(180deg,rgba(10,14,24,.05),rgba(10,14,24,.55));opacity:0;transition:opacity .6s;pointer-events:none}
.mp.has-art>.shade{opacity:1}
.mp .hd .ic img{width:26px;height:26px;border-radius:6px}
.hb.on{background:var(--nv-accent);color:var(--nv-accent-fg)}
.now{display:flex;align-items:center;gap:12px;min-width:0}
.thumb{width:72px;height:72px;flex:none;border-radius:14px;background:var(--nv-chip) center/cover no-repeat;box-shadow:0 4px 14px rgba(0,0,0,.35);display:none}
.mp.cover.has-art .thumb{display:block}
.tt{flex:1;min-width:0}.tt b,.tt span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;text-shadow:0 1px 4px rgba(0,0,0,.35)}
.tt b{font-size:17px;font-weight:600}.tt span{font-size:13px;opacity:.75;margin-top:2px}
.bar{display:flex;align-items:center;gap:8px;font-size:11px;opacity:.85;font-variant-numeric:tabular-nums}
.bar .tr{flex:1;height:6px;border-radius:3px;background:rgba(255,255,255,.14);overflow:hidden}
.bar.seek .tr{cursor:pointer}
.bar .tr i{display:block;height:100%;width:0;background:var(--nv-accent);border-radius:3px;transition:width 1s linear}
.ctl{display:flex;align-items:center;justify-content:center;gap:14px}
.ctl .cb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);transition:background-color .2s,color .2s,border-color .2s,box-shadow .2s,transform .2s,opacity .2s}
.ctl .cb ha-icon{--mdc-icon-size:24px}
.ctl .cb.pp{width:56px;height:56px;background:var(--nv-accent);color:var(--nv-accent-fg);border-color:transparent;box-shadow:0 0 16px color-mix(in srgb,var(--nv-accent) 45%,transparent)}
.ctl .cb.pp ha-icon{--mdc-icon-size:30px}
.cb:active{transform:scale(.9)}
.vol{display:flex;align-items:center;gap:10px}
.vol .cb{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip)}
.vol .cb ha-icon{--mdc-icon-size:18px}
.vol .cb.on{background:var(--nv-error);color:#fff}
.vol .v{min-width:38px;text-align:right;font-size:13px;font-weight:600}
.vol input{flex:1}
.vol .step{flex:1;display:flex;justify-content:center;gap:10px}
.src,.pls{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;margin:0 -2px;padding:2px}
.src::-webkit-scrollbar,.pls::-webkit-scrollbar{display:none}
.pls .pill.on{background:var(--nv-accent);color:var(--nv-accent-fg);box-shadow:none}
.pls .pill .eq{display:none;--mdc-icon-size:14px}.pls .pill.pl .eq{display:flex}
.mp.off .now,.mp.off .bar,.mp.off .ctl,.mp.off .vol,.mp.off .src{display:none}
@container (max-width:300px){.ctl{gap:8px}.ctl .cb{width:38px;height:38px}.ctl .cb.pp{width:48px;height:48px}.thumb{width:56px;height:56px}.tt b{font-size:15px}}`;
  var MF = { PAUSE: 1, SEEK: 2, VOL_SET: 4, MUTE: 8, PREV: 16, NEXT: 32, ON: 128, OFF: 256, VOL_STEP: 1024, SOURCE: 2048, STOP: 4096, PLAY: 16384 };
  var MDEF = { artwork: "background", show_progress: true, show_volume: true, show_mute: true, show_power: true, show_source: false, show_players: true, auto_switch: true };
  var clock = (t) => {
    t = Math.max(0, Math.floor(t || 0));
    const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), x = String(t % 60).padStart(2, "0");
    return h ? `${h}:${String(m).padStart(2, "0")}:${x}` : `${m}:${x}`;
  };
  var posOf = (s) => {
    const a = s.attributes;
    if (a.media_position == null) return null;
    const upd = a.media_position_updated_at ? Date.parse(a.media_position_updated_at) : NaN;
    return a.media_position + (s.state === "playing" && !isNaN(upd) ? (Date.now() - upd) / 1e3 : 0);
  };
  var MA_ON = ["playing", "paused", "buffering"];
  function maOf(h, id, ma) {
    if (ma === false || !id) return null;
    if (typeof ma === "string") return ma;
    if (h.entities?.[id]?.platform === "music_assistant") return null;
    const n = h.states[id]?.attributes.friendly_name;
    const hits = Object.values(h.entities || {}).map((e) => e.entity_id).filter((x) => x !== id && dom(x) === "media_player" && h.entities[x].platform === "music_assistant" && h.states[x]?.attributes.friendly_name === n);
    return hits.find((x) => x.startsWith(id)) || hits.find((x) => MA_ON.includes(h.states[x].state)) || hits[0] || null;
  }
  var cssUrl = (u) => `url("${String(u).replace(/["\\\n]/g, encodeURIComponent)}")`;
  var NovaMediaCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("media-card-editor"));
    }
    static getStubConfig(h) {
      const ids = Object.keys(h.states).filter((i) => i.startsWith("media_player."));
      return { entity: ids.find((i) => h.states[i].state === "playing") || ids[0] || "media_player." };
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      if (!c.entity || dom(c.entity) !== "media_player") throw new Error("entity muss eine media_player.* Entität sein");
      this._c = { ...MDEF, ...c, players: [].concat(c.players || []).map(toObj).filter((o) => dom(o.entity) === "media_player") };
      this._all = [{ entity: c.entity, name: c.name, icon: c.icon }, ...this._c.players];
      this._idx = 0;
      this._manual = false;
      this._ids = entityIds(this._c);
      this._built = false;
      if (this._h) {
        this._build();
        this._update();
      }
    }
    // Neu zeichnen nur, wenn sich ein Player (auch sein Music-Assistant-Zwilling) geändert hat
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._built) this._build();
      else if (!hassChanged(old, h, [...this._ids, ...(this._ma || []).filter(Boolean)])) return;
      this._update();
    }
    getCardSize() {
      return 4;
    }
    getGridOptions() {
      return { columns: 12, rows: "auto", min_columns: 4 };
    }
    // In der Kartenauswahl läuft der Fortschrittsbalken nicht im Sekundentakt
    connectedCallback() {
      this._quiet = inPicker(this);
      if (this._built) this._tick();
    }
    disconnectedCallback() {
      clearInterval(this._tm);
      this._tm = null;
    }
    get _p() {
      return this._all[this._idx];
    }
    // Spielt der Music-Assistant-Zwilling, kommen Anzeige und Steuerung von dort
    _eidOf(i) {
      const ma = this._ma?.[i], s = ma && this._h?.states[ma];
      return s && MA_ON.includes(s.state) ? ma : this._all[i].entity;
    }
    get _eid() {
      return this._eidOf(this._idx);
    }
    _build() {
      this._built = true;
      const c = this._c, r = this.shadowRoot || this.attachShadow({ mode: "open" });
      this._ma = this._all.map((o) => maOf(this._h, o.entity, o.music_assistant ?? c.music_assistant));
      const multi = this._all.length > 1 && c.show_players !== false;
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${MPCSS}</style><div class="g mp${c.artwork === "cover" ? " cover" : ""}">
${c.artwork !== "none" ? '<div class="art"></div><div class="shade"></div>' : ""}
${multi ? '<div class="pills pls"></div>' : ""}
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${c.show_power !== false ? '<div class="hb pw" title="Ein/Aus"><ha-icon icon="mdi:power"></ha-icon></div>' : ""}</div>
<div class="now"><div class="thumb"></div><div class="tt"><b></b><span></span></div></div>
${c.show_progress !== false ? '<div class="bar"><span class="a">0:00</span><div class="tr"><i></i></div><span class="b">0:00</span></div>' : ""}
<div class="ctl"><div class="cb pv" title="Zurück"><ha-icon icon="mdi:skip-previous"></ha-icon></div><div class="cb pp" title="Play/Pause"><ha-icon icon="mdi:play"></ha-icon></div><div class="cb nx" title="Weiter"><ha-icon icon="mdi:skip-next"></ha-icon></div></div>
${c.show_volume !== false || c.show_mute !== false ? `<div class="vol">${c.show_mute !== false ? '<div class="cb mu" title="Stumm"><ha-icon icon="mdi:volume-high"></ha-icon></div>' : ""}${c.show_volume !== false ? '<input type="range" min="0" max="100" step="1"><div class="step"><div class="cb vd" title="Leiser"><ha-icon icon="mdi:volume-minus"></ha-icon></div><div class="cb vu" title="Lauter"><ha-icon icon="mdi:volume-plus"></ha-icon></div></div><span class="v"></span>' : ""}</div>` : ""}
${c.show_source ? '<div class="pills src"></div>' : ""}</div>`;
      const q = (s) => r.querySelector(s);
      this._e = {
        g: q(".g"),
        art: q(".art"),
        thumb: q(".thumb"),
        pls: q(".pls"),
        ic: q(".hd .ic"),
        name: q(".hd b"),
        sub: q(".hd small"),
        pw: q(".pw"),
        title: q(".tt b"),
        artist: q(".tt span"),
        bar: q(".bar"),
        fill: q(".bar i"),
        ta: q(".bar .a"),
        tb: q(".bar .b"),
        pv: q(".pv"),
        pp: q(".pp"),
        nx: q(".nx"),
        mu: q(".mu"),
        vol: q(".vol input"),
        step: q(".vol .step"),
        vv: q(".vol .v"),
        src: q(".src")
      };
      const e = this._e, svc = (s, d = {}, id = this._eid) => this._h.callService("media_player", s, { entity_id: id, ...d });
      press(e.ic, { tap: () => this._act({ entity: this._eid, tap_action: c.tap_action }, "tap", true), hold: () => this._act({ entity: this._eid, hold_action: c.hold_action }, "hold") });
      if (e.pw) press(e.pw, { tap: () => {
        const id = this._p.entity, s = this._h.states[id], on = s && !["off", "standby"].includes(s.state);
        svc(!on ? "turn_on" : hasF(s, MF.OFF) ? "turn_off" : "toggle", {}, id);
      } });
      press(e.pp, { tap: () => svc(this._st()?.state === "playing" && !hasF(this._st(), MF.PAUSE) ? "media_stop" : "media_play_pause") });
      press(e.pv, { tap: () => svc("media_previous_track") });
      press(e.nx, { tap: () => svc("media_next_track") });
      if (e.mu) press(e.mu, { tap: () => svc("volume_mute", { is_volume_muted: !this._st()?.attributes.is_volume_muted }) });
      if (e.step) {
        press(e.step.children[0], { tap: () => svc("volume_down") });
        press(e.step.children[1], { tap: () => svc("volume_up") });
      }
      if (e.vol) {
        const show = () => {
          e.vol.style.setProperty("--p", `${e.vol.value}%`);
          e.vv.textContent = `${e.vol.value} %`;
        };
        e.vol.addEventListener("pointerdown", () => {
          this._drag = true;
        });
        e.vol.addEventListener("input", () => {
          this._drag = true;
          show();
        });
        e.vol.addEventListener("change", () => {
          this._drag = false;
          show();
          svc("volume_set", { volume_level: +e.vol.value / 100 });
        });
      }
      if (e.bar) e.bar.querySelector(".tr").addEventListener("click", (ev) => {
        const s = this._st(), d = s?.attributes.media_duration;
        if (!d || !hasF(s, MF.SEEK)) return;
        const b = ev.currentTarget.getBoundingClientRect();
        svc("media_seek", { seek_position: Math.round(Math.min(1, Math.max(0, (ev.clientX - b.left) / b.width)) * d) });
      });
      if (e.pls) this._chips = this._all.map((o, i) => {
        const el2 = document.createElement("div");
        el2.className = "pill";
        el2.innerHTML = '<span class="i"></span><span class="t"></span><ha-icon class="eq" icon="mdi:equalizer"></ha-icon>';
        press(el2, { tap: () => {
          this._idx = i;
          this._manual = true;
          this._srcKey = null;
          this._update();
        }, hold: () => moreInfo(this, o.entity) });
        e.pls.append(el2);
        return el2;
      });
      this._srcKey = null;
      this._tick();
    }
    _st() {
      return this._h?.states[this._eid];
    }
    _update() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !e) return;
      if (c.auto_switch !== false && !this._manual && this._all.length > 1 && h.states[this._eid]?.state !== "playing") {
        const i = this._all.findIndex((o, j) => h.states[this._eidOf(j)]?.state === "playing");
        if (i >= 0 && i !== this._idx) {
          this._idx = i;
          this._srcKey = null;
        }
      }
      const p = this._p, n = h.states[p.entity], s = h.states[this._eid], a = s?.attributes || {};
      const off2 = !s || ["off", "unavailable", "unknown", "standby"].includes(s.state), play = s?.state === "playing";
      e.g.classList.toggle("na", !s || s.state === "unavailable");
      this.classList.toggle("nv-na", !s || s.state === "unavailable");
      e.g.classList.toggle("off", off2);
      e.g.classList.toggle("play", play && c.glow !== false);
      const app = a.app_name || (a.app_id === "music_assistant" ? "Music Assistant" : a.source);
      const logo = mapIcon(c.icon_map, c.icon_entity && h.states[c.icon_entity]?.state, a.app_name, a.app_id, a.source, a.media_channel);
      e.name.textContent = p.name ?? n?.attributes.friendly_name ?? a.friendly_name ?? p.entity;
      e.sub.textContent = !s ? "nicht gefunden" : off2 ? fmtState(h, s) : [app, play ? null : fmtState(h, s)].filter(Boolean).join(" · ") || fmtState(h, s);
      setIcon(e.ic, logo || p.icon || a.icon || (a.device_class === "tv" ? "mdi:television" : a.device_class === "speaker" ? "mdi:speaker" : "mdi:cast"));
      e.ic.parentElement.classList.toggle("on", !off2);
      if (e.pw) {
        e.pw.classList.toggle("on", !off2);
        e.pw.hidden = !!n && !hasF(n, MF.ON) && !hasF(n, MF.OFF);
      }
      e.title.textContent = a.media_title || (off2 ? "" : app || fmtState(h, s));
      e.artist.textContent = [a.media_artist || a.media_series_title, a.media_album_name].filter(Boolean).join(" · ") || (a.media_title ? "" : a.media_channel || "");
      const pic = !off2 && c.artwork !== "none" ? a.entity_picture_local || a.entity_picture : null;
      if (pic !== this._pic) {
        this._pic = pic;
        if (e.art) e.art.style.backgroundImage = pic ? cssUrl(pic) : "";
        e.thumb.style.backgroundImage = pic ? cssUrl(pic) : "";
      }
      e.g.classList.toggle("has-art", !!pic);
      setIcon(e.pp, play ? hasF(s, MF.PAUSE) ? "mdi:pause" : "mdi:stop" : "mdi:play");
      e.pp.hidden = !!s && !hasF(s, MF.PAUSE) && !hasF(s, MF.PLAY) && !hasF(s, MF.STOP);
      e.pv.hidden = !hasF(s, MF.PREV);
      e.nx.hidden = !hasF(s, MF.NEXT);
      if (e.mu) {
        e.mu.hidden = !hasF(s, MF.MUTE);
        e.mu.classList.toggle("on", !!a.is_volume_muted);
        setIcon(e.mu, a.is_volume_muted ? "mdi:volume-off" : "mdi:volume-high");
      }
      if (e.vol) {
        const set = hasF(s, MF.VOL_SET) && a.volume_level != null;
        e.vol.hidden = e.vv.hidden = !set;
        e.step.hidden = set || !hasF(s, MF.VOL_STEP);
        if (set && !this._drag) {
          const v = Math.round(a.volume_level * 100);
          e.vol.value = v;
          e.vol.style.setProperty("--p", `${v}%`);
          e.vv.textContent = `${v} %`;
        }
      }
      const vb = e.vol?.parentElement;
      if (vb) vb.hidden = [...vb.children].every((x) => x.hidden);
      if (e.src) this._sources(n);
      this._chips?.forEach((el2, i) => {
        const o = this._all[i], ps = h.states[o.entity], pa = ps?.attributes || {};
        el2.classList.toggle("on", i === this._idx);
        el2.classList.toggle("pl", h.states[this._eidOf(i)]?.state === "playing");
        el2.classList.toggle("na", !ps || ps.state === "unavailable");
        setIcon(el2.firstChild, o.icon || pa.icon || (pa.device_class === "tv" ? "mdi:television" : "mdi:speaker"));
        el2.children[1].textContent = o.name ?? pa.friendly_name ?? o.entity;
      });
      this._progress();
      this._tick();
    }
    _sources(s) {
      const c = this._c, a = s?.attributes || {}, e = this._e;
      const only = list(c.sources), all = hasF(s, MF.SOURCE) ? a.source_list || [] : [];
      const srcs = only.length ? all.filter((x) => only.includes(x)) : all;
      const key = `${this._idx}|${srcs.join("\n")}`;
      if (key !== this._srcKey) {
        this._srcKey = key;
        e.src.replaceChildren(...srcs.map((x) => {
          const el2 = document.createElement("div");
          el2.className = "pill";
          el2.dataset.s = x;
          el2.innerHTML = '<span class="i"></span><span class="t"></span>';
          setIcon(el2.firstChild, mapIcon(c.icon_map, x) || "mdi:import");
          el2.lastChild.textContent = x;
          press(el2, { tap: () => this._h.callService("media_player", "select_source", { entity_id: this._p.entity, source: x }) });
          return el2;
        }));
      }
      e.src.hidden = !srcs.length;
      [...e.src.children].forEach((el2) => el2.classList.toggle("on", el2.dataset.s === a.source));
    }
    _progress() {
      const e = this._e, s = this._st();
      if (!e?.bar || !s) return;
      const d = s.attributes.media_duration, p = posOf(s);
      e.bar.hidden = !(d > 0) || p == null;
      if (e.bar.hidden) return;
      e.bar.classList.toggle("seek", hasF(s, MF.SEEK));
      e.fill.style.width = `${Math.min(100, p / d * 100)}%`;
      e.ta.textContent = clock(Math.min(p, d));
      e.tb.textContent = clock(d);
    }
    // Sekundentakt nur, solange etwas läuft und der Balken sichtbar ist
    _tick() {
      const run = this.isConnected && !this._quiet && this._e?.bar && this._st()?.state === "playing";
      if (run && !this._tm) this._tm = setInterval(() => this._progress(), 1e3);
      if (!run && this._tm) {
        clearInterval(this._tm);
        this._tm = null;
      }
    }
    _act(o, kind, info) {
      return runAction(this, o, kind, info);
    }
  };
  define("media-card", NovaMediaCard, { name: "Nova Media Card", description: "Media-Player mit Cover als Hintergrund, Titel, Interpret, App-Logo, Play/Pause, Vor/Zurück, Lautstärke, Stumm, Ein/Aus, Quellen und mehreren umschaltbaren Playern.", documentationURL: docUrl("nova-media-card") });
  var MP = { domain: ["media_player"] };
  var MPGEN = [
    { name: "entity", required: true, selector: { entity: MP } },
    g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } })
  ];
  var MPCTRL = (c) => [
    g2({ name: "show_progress", selector: { boolean: {} } }, { name: "show_power", selector: { boolean: {} } }),
    g2({ name: "show_volume", selector: { boolean: {} } }, { name: "show_mute", selector: { boolean: {} } }),
    { name: "show_source", selector: { boolean: {} } },
    ...c.show_source ? [{ name: "sources", selector: { text: { multiple: true } } }] : []
  ];
  var MPLOOK = [g2(sel("artwork", [["background", "Hintergrund"], ["cover", "Cover + unscharfer Hintergrund"], ["none", "Kein Cover"]]), { name: "glow", selector: { boolean: {} } })];
  var MPACT = [g2({ name: "tap_action", selector: A }, { name: "hold_action", selector: A })];
  var MPMA = [g2({ name: "ma_auto", selector: { boolean: {} } }, { name: "ma_entity", selector: { entity: { domain: "media_player", integration: "music_assistant" } } })];
  var MPPLAY = [g2({ name: "show_players", selector: { boolean: {} } }, { name: "auto_switch", selector: { boolean: {} } })];
  var MPITEM = [{ name: "entity", required: true, selector: { entity: MP } }, NAMEICON, { name: "music_assistant", selector: { entity: { domain: "media_player", integration: "music_assistant" } } }];
  var MPLOGO = [{ name: "icon_entity", selector: { entity: {} } }];
  var MPMAP = [g2({ name: "key", selector: T }, { name: "value", selector: T })];
  var MPLABELS = {
    ...BASE_LABELS,
    artwork: "Cover",
    glow: "Leuchten beim Abspielen",
    show_progress: "Fortschrittsbalken",
    show_power: "Ein/Aus-Button",
    show_volume: "Lautstärke-Regler",
    show_mute: "Stumm-Button",
    show_source: "Quellenauswahl",
    sources: "Nur diese Quellen zeigen",
    show_players: "Player-Umschalter anzeigen",
    auto_switch: "Automatisch zum spielenden Player",
    icon_entity: "Icon-Entität (optional)",
    ma_auto: "Automatisch suchen",
    ma_entity: "Oder fest: Music-Assistant-Player",
    music_assistant: "Music-Assistant-Player (optional)",
    key: "App / Quelle / Zustand",
    value: "Icon oder Bild-URL",
    tap_action: "Icon antippen",
    hold_action: "Icon lange drücken"
  };
  var MPHELPERS = {
    tap_action: "Standard: Details des Players",
    sources: "Leer = alle Quellen des Players. Genaue Namen wie in source_list",
    auto_switch: "Bis man selbst einen Player antippt",
    icon_entity: "Leer = App-Name bzw. Quelle des Players. Sonst zählt der Zustand dieser Entität (z. B. sensor.tv_app)",
    ma_auto: "Findet den Music-Assistant-Player mit gleichem Namen. Spielt der, kommen Titel, Cover und Steuerung von dort",
    music_assistant: "Leer = automatisch (wie oben eingestellt)",
    key: "z. B. Netflix oder music_assistant – Groß/Klein egal",
    value: "mdi:netflix oder /local/logos/netflix.svg"
  };
  var NovaMediaCardEditor = class extends NovaEditorBase {
    // Neue Konfig von außen: Logo-Zeilen neu einlesen
    _onExternalConfig() {
      this._map = null;
    }
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}${MAPROW_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), strip2 = (c) => {
        Object.entries(MDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        if (c.glow === true) delete c.glow;
        return c;
      };
      const data = { ...MDEF, glow: true, ...c0 };
      const form = (schema) => this._form(schema, data, (v) => {
        const c = strip2(merge(this._config, names(schema), v));
        this._emit(c);
        if (!!c.show_source !== !!c0.show_source) this._rebuild();
      });
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(MPGEN))),
        this._section("controls", "mdi:play-pause", "Bedienung", (b) => b.append(form(MPCTRL(data)))),
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(MPLOOK))),
        this._section("ma", "mdi:music", "Music Assistant", (b) => {
          const ma = c0.music_assistant;
          b.append(this._form(MPMA, { ma_auto: ma !== false, ma_entity: typeof ma === "string" ? ma : void 0 }, (v) => {
            const c = { ...this._config };
            if (v.ma_entity) c.music_assistant = v.ma_entity;
            else if (v.ma_auto === false) c.music_assistant = false;
            else delete c.music_assistant;
            this._emit(c);
          }));
        }),
        this._section("players", "mdi:speaker-multiple", "Weitere Player", (b) => {
          if (this._items("players").length) b.append(this._form(MPPLAY, data, (v) => this._emit(strip2({ ...this._config, ...v }))));
          this._itemList(b, "players", MPITEM, { item: "Player", icon: "mdi:speaker" }, "Player hinzufügen");
        }),
        this._section("logos", "mdi:application-outline", "App-Logos", (b) => this._logos(b, c0)),
        this._section("actions", "mdi:gesture-tap", "Aktionen", (b) => b.append(form(MPACT)))
      );
    }
    // App-Logos (icon_map): Zeilen bleiben im Editor, auch solange sie noch leer sind
    _logos(w, c0) {
      w.append(this._hint("Ersetzt das Icon oben und bei den Quellen durch ein Logo, passend zu App oder Quelle."), this._form(MPLOGO, c0, (v) => this._emit(merge(this._config, ["icon_entity"], v))));
      const map = this._map ||= Object.entries(c0.icon_map || {});
      const write = () => {
        const o = Object.fromEntries(map.filter(([k, v]) => k && v)), c = { ...this._config };
        if (Object.keys(o).length) c.icon_map = o;
        else delete c.icon_map;
        this._emit(c);
      };
      map.forEach(([k, v], j) => {
        const row = document.createElement("div");
        row.className = "maprow";
        row.append(
          this._form(MPMAP, { key: k, value: v }, (x) => {
            map[j] = [x.key ?? "", x.value ?? ""];
            write();
          }),
          this._btn("mdi:close", "Entfernen", () => {
            map.splice(j, 1);
            write();
            this._rebuild();
          })
        );
        w.append(row);
      });
      w.append(this._add("Logo hinzufügen", () => {
        map.push(["", ""]);
        this._rebuild();
      }));
    }
  };
  __publicField(NovaMediaCardEditor, "labels", MPLABELS);
  __publicField(NovaMediaCardEditor, "helpers", MPHELPERS);
  __publicField(NovaMediaCardEditor, "openSections", ["general"]);
  define("media-card-editor", NovaMediaCardEditor);

  // src/vacuum.js
  var VCSS = `
.g.vc.run{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-accent) 40%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.vc.run .hd .ic ha-icon{animation:nv-vc 2.4s ease-in-out infinite}
@keyframes nv-vc{0%,100%{transform:rotate(-8deg)}50%{transform:rotate(8deg)}}
.vc .hd small.er{color:var(--nv-error);opacity:1}
.bat{display:inline-flex;align-items:center;gap:4px;padding:6px 10px;border-radius:999px;background:var(--nv-chip);font-size:12.5px;font-weight:600;flex:none}
.bat ha-icon{--mdc-icon-size:17px}
.bat.low{background:color-mix(in srgb,var(--nv-error) 30%,transparent)}
.bat.chg ha-icon{color:var(--nv-accent)}
.vc>.main{display:contents}.vc .hd{order:0}.vc .mpnl{order:1}.vc>.main>:not(.hd){order:2}
.mpnl{display:flex;flex-direction:column;gap:8px;min-width:0}
.mpnl .bt{margin:0}
.map{position:relative;border-radius:calc(var(--nv-radius) - 8px);overflow:hidden;background:rgba(0,0,0,.25)}
.map.ar{aspect-ratio:var(--ar)}.map{max-height:var(--nv-map-max,280px)}
.map img{display:block;width:100%;height:auto;max-height:var(--nv-map-max,280px);object-fit:contain}
.map.ar img{height:100%;object-fit:contain}
.ctl{display:flex;align-items:center;justify-content:center;gap:14px}
.ctl .cb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);transition:background-color .2s,color .2s,border-color .2s,box-shadow .2s,transform .2s,opacity .2s}
.ctl .cb ha-icon{--mdc-icon-size:24px}
.ctl .cb.pp{width:56px;height:56px;background:var(--nv-accent);color:var(--nv-accent-fg);border-color:transparent;box-shadow:0 0 16px color-mix(in srgb,var(--nv-accent) 45%,transparent)}
.ctl .cb.pp ha-icon{--mdc-icon-size:30px}
.cb:active{transform:scale(.9)}
.ctl.pl{justify-content:flex-start;gap:7px;flex-wrap:wrap}
.fs .pill,.ctl.pl .pill{flex:none}
.rooms .pill{background:color-mix(in srgb,var(--nv-active) 45%,transparent);border-color:color-mix(in srgb,var(--nv-active) 60%,transparent)}
.rooms .pill.on{background:var(--nv-active);box-shadow:0 0 14px color-mix(in srgb,var(--nv-active) 50%,transparent)}
.rooms .pill.go{order:99;background:var(--nv-accent);color:var(--nv-accent-fg);border-color:transparent;box-shadow:none}
.vc .sws .list{row-gap:2px}
.rooms .pill.cur{box-shadow:0 0 0 2px var(--nv-accent),0 0 14px color-mix(in srgb,var(--nv-accent) 50%,transparent)}
.hd .all{flex:none}
.hd .all.on{background:var(--nv-active);color:var(--nv-active-fg);border-color:transparent}
.cons .kv{flex-wrap:wrap;row-gap:4px}
.cons .kv .cbar{flex-basis:100%;height:4px;border-radius:2px;background:rgba(255,255,255,.12);overflow:hidden}
.cons .kv .cbar i{display:block;height:100%;background:var(--nv-active);border-radius:2px}
.cons .warn .cbar i{background:var(--nv-warn)}.cons .warn .v{color:var(--nv-warn);opacity:1}
.cons .pill.warn{background:color-mix(in srgb,var(--nv-warn) 25%,transparent)}
.vc.narrow .ctl{gap:8px}.vc.narrow .ctl .cb{width:38px;height:38px}.vc.narrow .ctl .cb.pp{width:48px;height:48px}
:host{height:auto;container-type:normal}.g.vc{height:auto}
.g.vc.side{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:14px;align-items:stretch}
.vc.side>.main{display:flex;flex-direction:column;gap:12px;min-width:0;padding:12px;border-radius:calc(var(--nv-radius) - 6px);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.vc.side .mpnl{padding:12px;border-radius:calc(var(--nv-radius) - 6px);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.vc.side .map{flex:1;min-height:var(--nova-vacuum-map-min-height,240px);max-height:none;aspect-ratio:auto}
.vc.side .map img{position:absolute;inset:0;width:100%;height:100%;max-height:none;object-fit:contain}
.g.vc.auto.wide{display:grid;grid-template-columns:minmax(0,1fr) minmax(0,1.25fr);gap:14px;align-items:stretch}
.vc.auto.wide>.main{display:flex;flex-direction:column;gap:12px;min-width:0;padding:12px;border-radius:calc(var(--nv-radius) - 6px);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.vc.auto.wide .mpnl{padding:12px;border-radius:calc(var(--nv-radius) - 6px);background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.08)}
.vc.auto.wide .map{flex:1;min-height:var(--nova-vacuum-map-min-height,240px);max-height:none;aspect-ratio:auto}
.vc.auto.wide .map img{position:absolute;inset:0;width:100%;height:100%;max-height:none;object-fit:contain}
.scene{--rc:var(--nova-vacuum-robot-color,#3d4452);--sc:var(--nova-vacuum-station-color,#2f3542);--wc:var(--nova-vacuum-water-color,#6fb6f2);
position:relative;order:0;height:var(--nova-vacuum-scene-height,100px)}
.scene svg{display:block;width:100%;height:100%;overflow:visible}
.scene .cap{position:absolute;left:0;top:0;padding:4px 10px;border-radius:999px;background:var(--nv-chip);font-size:11px;font-weight:500;letter-spacing:.02em;opacity:.85}
.scene .cap:empty{display:none}
.sc .floor{fill:currentColor;opacity:.1}
.sc .trail{fill:var(--wc);opacity:0;transform-box:fill-box;transform-origin:left center}
.sc .shd{fill:#000;opacity:.3}
.sc .body{fill:url(#vgr);stroke:rgba(255,255,255,.14);stroke-width:.6}.sc .top{fill:rgba(255,255,255,.1)}.sc .bump{fill:rgba(0,0,0,.35)}
.sc .lid{fill:color-mix(in srgb,var(--rc) 55%,#000);stroke:rgba(255,255,255,.12);stroke-width:.5}.sc .lidl{fill:rgba(255,255,255,.25)}
.sc .mop{fill:var(--wc);opacity:0;transition:opacity .4s}
.sc .br line{stroke:rgba(255,255,255,.35);stroke-width:1;stroke-linecap:round}
.sc .br{transform-box:fill-box;transform-origin:center}
.sc .led{fill:var(--nv-active);opacity:.9}
.sc .bolt{fill:none;stroke:var(--nv-accent);stroke-width:1;stroke-linejoin:round;opacity:0}
.sc .err{opacity:0}.sc .err circle{fill:none;stroke:var(--nv-error);stroke-width:1.2}.sc .err rect,.sc .err .dot{fill:var(--nv-error);stroke:none}
.sc .dust circle{fill:currentColor;opacity:0}
.sc .ramp{fill:color-mix(in srgb,var(--sc) 80%,#000)}.sc .tower{fill:url(#vgs);stroke:rgba(255,255,255,.12);stroke-width:.6}.sc .seam{fill:rgba(0,0,0,.35)}
.sc .sled{fill:var(--nv-active);opacity:.35}
.sc .tank{fill:rgba(0,0,0,.4)}.sc .tkc{fill:var(--wc)}.sc .tkd{fill:#9a7a52}.sc .tkc,.sc .tkd{transition:all .6s}
.sc .tkc.low,.sc .tkd.low{fill:var(--nv-error);animation:vc-blink 1.6s infinite}
.sc .parts circle{fill:#b8a993;opacity:0}
.sc .duct,.sc .pipe{fill:rgba(0,0,0,.35);transition:fill .4s}.sc.empty .duct{fill:rgba(184,169,147,.6)}
.sc .bin{fill:rgba(0,0,0,.3)}.sc .bag{fill:#b8a993;opacity:.35;transform-box:fill-box;transform-origin:center bottom;transition:opacity .4s}
.sc.empty .bag{opacity:.75;animation:vc-bag .6s ease-in-out infinite alternate}
.sc.wash .pipe{fill:color-mix(in srgb,var(--wc) 45%,transparent)}.sc.wash .pipe:last-of-type{fill:rgba(154,122,82,.55)}
.sc .water ellipse,.sc .water circle{fill:var(--wc);opacity:0;transform-box:fill-box;transform-origin:center}
.sc .bubl circle{fill:none;stroke:color-mix(in srgb,var(--wc) 60%,#fff);stroke-width:.5}
.sc .heat path{fill:none;stroke:color-mix(in srgb,var(--nv-accent) 70%,#fff);stroke-width:1;stroke-linecap:round;opacity:0}
.sc .rob{transform:translateX(110px);transition:transform 1.4s ease-in-out}
.sc.docked .rob{transform:translateX(240px)}
.sc.cleaning .rob{animation:vc-drive 16s ease-in-out infinite}
.sc.returning .rob{animation:vc-home 6s ease-in-out infinite}
.sc.cleaning .br,.sc.returning .br{animation:vc-spin .35s linear infinite}
.sc.cleaning:not(.mopping) .dust circle{animation:vc-dust 1.2s linear infinite}
.sc .dust circle:nth-child(2),.sc .parts circle:nth-child(2),.sc .water ellipse:nth-child(2),.sc .heat path:nth-child(2){animation-delay:.4s}
.sc .dust circle:nth-child(3),.sc .parts circle:nth-child(3),.sc .water ellipse:nth-child(3),.sc .heat path:nth-child(3){animation-delay:.8s}
.sc.paused .led{animation:vc-blink 1.6s infinite}
.sc.error .rb{transform:rotate(-3deg);transform-box:fill-box;transform-origin:center bottom}
.sc.error .err{opacity:1;animation:vc-blink 1.6s infinite}.sc.error .led{fill:var(--nv-error);animation:vc-blink 1.6s infinite}
.sc.mop .mop{opacity:.9}
.sc.cleaning.mopping .trail{animation:vc-trail 16s ease-in-out infinite}
.sc.chg .bolt{animation:vc-pulse 3s ease-in-out infinite}.sc.chg .led{animation:vc-pulse 3s ease-in-out infinite}
.sc.empty .parts circle{animation:vc-suck .9s cubic-bezier(.5,0,1,1) infinite}
.sc .parts circle:nth-child(4){animation-delay:.2s}.sc .parts circle:nth-child(5){animation-delay:.6s}
.sc .parts circle:nth-child(2){--dx:-8px}.sc .parts circle:nth-child(3){--dx:10px}.sc .parts circle:nth-child(4){--dx:-14px}.sc .parts circle:nth-child(5){--dx:14px}
.sc.empty .stn,.sc.empty .rb{animation:vc-jit .09s linear infinite}
.sc.wash .water ellipse{animation:vc-wave 1.4s ease-in-out infinite}
.sc.wash .drops circle{animation:vc-drop 1.1s ease-in infinite}
.sc .dirt circle{fill:#9a7a52;opacity:0}.sc.wash .dirt circle{animation:vc-rise 1.1s ease-in infinite}
.sc .dirt circle:nth-child(2){animation-delay:.35s}.sc .dirt circle:nth-child(3){animation-delay:.7s}
.sc.wash .bubl circle{animation:vc-bubl 2s ease-out infinite}
.sc.wash .spl circle{animation:vc-spl .9s ease-out infinite}
.sc.wash .mop{opacity:1;animation:vc-scrub .35s ease-in-out infinite alternate}
.sc .drops circle:nth-child(2),.sc .bubl circle:nth-child(2),.sc .spl circle:nth-child(2){animation-delay:.35s}
.sc .drops circle:nth-child(3),.sc .bubl circle:nth-child(3),.sc .spl circle:nth-child(3){animation-delay:.7s}
.sc.dry .heat path{animation:vc-heat 2.4s ease-in-out infinite}
.sc.empty .sled,.sc.wash .sled,.sc.dry .sled{opacity:1;animation:vc-pulse 2s ease-in-out infinite}
.sc.empty .sled{fill:#b8a993}.sc.wash .sled{fill:var(--wc)}.sc.dry .sled{fill:var(--nv-accent)}
.sc:not(.has-tanks) :is(.tank,.tkc,.tkd,.pipe,.drops,.dirt,.bubl),.sc:not(.has-bag) :is(.bin,.bag,.duct,.parts){display:none}
.scene.still *,.vc.still .hd .ic ha-icon{animation-play-state:paused!important}
/* Eigene Ebene nur für die Szene, solange sie läuft: WebKit malt dann nur die Szene neu, nicht die ganze Karte */
.scene:not(.still)>svg{will-change:transform}
@media (prefers-reduced-motion:reduce){.scene *{animation:none!important}}
@keyframes vc-drive{0%,100%{transform:translateX(20px)}45%,50%{transform:translateX(150px)}}
@keyframes vc-home{0%{transform:translateX(90px)}85%,100%{transform:translateX(240px)}}
@keyframes vc-spin{to{transform:rotate(360deg)}}
@keyframes vc-blink{50%{opacity:.25}}
@keyframes vc-pulse{0%,100%{opacity:.3}50%{opacity:.95}}
@keyframes vc-dust{0%{opacity:0;transform:translateX(0)}30%{opacity:.35}100%{opacity:0;transform:translateX(12px)}}
@keyframes vc-suck{0%{opacity:0;transform:translate(0,0)}15%{opacity:.95}80%{opacity:.8;transform:translate(0,-18px)}100%{opacity:0;transform:translate(var(--dx,4px),-22px)}}
@keyframes vc-bag{from{transform:scale(1,.9)}to{transform:scale(1.03,1.08)}}
@keyframes vc-rise{0%{opacity:0;transform:translateY(0)}15%{opacity:.9}100%{opacity:.3;transform:translateY(-38px)}}
@keyframes vc-jit{0%,100%{transform:translateX(0)}50%{transform:translateX(.35px)}}
@keyframes vc-drop{0%{opacity:0;transform:translateY(0)}15%{opacity:.95}100%{opacity:.3;transform:translateY(38px)}}
@keyframes vc-bubl{0%{opacity:0;transform:translateY(0)}20%{opacity:.9}100%{opacity:0;transform:translateY(-30px)}}
@keyframes vc-spl{0%{opacity:0;transform:translate(0,0)}30%{opacity:.9}100%{opacity:0;transform:translate(2px,-7px)}}
@keyframes vc-scrub{from{transform:translateX(-1.5px)}to{transform:translateX(1.5px)}}
@keyframes vc-wave{0%,100%{opacity:0;transform:scaleX(.4)}50%{opacity:.8;transform:scaleX(1)}}
@keyframes vc-heat{0%{opacity:0;transform:translateY(6px)}40%{opacity:.75}100%{opacity:0;transform:translateY(-16px)}}
@keyframes vc-trail{0%{transform:scaleX(.2);opacity:.4}45%,90%{transform:scaleX(.76);opacity:.4}100%{transform:scaleX(.2);opacity:0}}`;
  var VF = { PAUSE: 4, STOP: 8, RETURN: 16, FAN: 32, LOCATE: 512, SPOT: 1024, START: 8192, AREA: 16384 };
  var VDEF = {
    map_max_height: 280,
    scene: true,
    scene_auto: true,
    station_type: "auto",
    layout: "auto",
    controls: "pills",
    battery_display: "status",
    rooms_title: "Raum reinigen",
    map_title: "Karte",
    glow: true,
    show_stop: true,
    show_return: true,
    show_locate: true,
    show_spot: false,
    show_fan_speed: true,
    map_aspect_ratio: "auto",
    map_refresh: 5,
    map_action: "more-info",
    segment_mode: "roborock",
    segment_repeat: 1,
    consumables_layout: "rows"
  };
  var VRUN = ["cleaning", "returning"];
  var VCTL = {
    start: ["mdi:play", "Start", 8192, "start"],
    pause: ["mdi:pause", "Pause", 4, "pause"],
    stop: ["mdi:stop", "Stopp", 8, "stop"],
    home: ["mdi:home-import-outline", "Zur Station", 16, "return_to_base"],
    locate: ["mdi:map-marker-question-outline", "Suchen", 512, "locate"],
    spot: ["mdi:target-variant", "Spot", 1024, "clean_spot"]
  };
  var vtitle = (t) => t === "-" || t === "" || t === false ? "" : t;
  var segId = (x) => NUMRE.test(x) ? +x : x;
  var fanName = (h, s, x) => {
    try {
      const t = h.formatEntityAttributeValue?.(s, "fan_speed", x);
      if (t && t !== x) return t;
    } catch {
    }
    const v = String(x).replace(/_/g, " ");
    return v.charAt(0).toUpperCase() + v.slice(1);
  };
  var SEG = {
    roborock: (id, s, n) => ["vacuum", "send_command", { entity_id: id, command: "app_segment_clean", params: [{ segments: s.map(segId), repeat: n }] }],
    valetudo: (id, s, n) => ["vacuum", "send_command", { entity_id: id, command: "segment_cleanup", params: { segment_ids: s.map(String), iterations: n, customOrder: true } }],
    dreame: (id, s, n) => ["dreame_vacuum", "vacuum_clean_segment", { entity_id: id, segments: s.map(segId), repeats: n }],
    xiaomi: (id, s) => ["xiaomi_miio", "vacuum_clean_segment", { entity_id: id, segments: s.map(segId) }]
  };
  var batIcon = (v, chg) => {
    if (v == null || isNaN(v)) return "mdi:battery-unknown";
    const t = Math.round(v / 10) * 10;
    if (chg) return t >= 100 ? "mdi:battery-charging-100" : t < 10 ? "mdi:battery-charging-outline" : `mdi:battery-charging-${t}`;
    return t >= 100 ? "mdi:battery" : t < 10 ? "mdi:battery-outline" : `mdi:battery-${t}`;
  };
  var batOf = (h, id) => {
    const dev = h.entities?.[id]?.device_id;
    if (!dev) return null;
    return Object.values(h.entities).find((e) => e.device_id === dev && dom(e.entity_id) === "sensor" && h.states[e.entity_id]?.attributes.device_class === "battery")?.entity_id || null;
  };
  var VSCENE = `<div class="scene sc"><svg viewBox="0 8 320 102" preserveAspectRatio="xMidYMax meet" aria-hidden="true">
<defs><linearGradient id="vgr" x1="0" y1="0" x2="0" y2="1"><stop offset="0" style="stop-color:color-mix(in srgb,var(--rc) 75%,#fff)"/><stop offset="1" style="stop-color:color-mix(in srgb,var(--rc) 70%,#000)"/></linearGradient>
<linearGradient id="vgs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" style="stop-color:color-mix(in srgb,var(--sc) 85%,#fff)"/><stop offset="1" style="stop-color:color-mix(in srgb,var(--sc) 80%,#000)"/></linearGradient>
<clipPath id="vtc"><rect x="293" y="22" width="22" height="30" rx="3"/></clipPath><clipPath id="vtd"><rect x="267" y="22" width="22" height="30" rx="3"/></clipPath></defs>
<rect class="floor" x="0" y="104" width="320" height="1"/><rect class="trail" x="10" y="104" width="230" height="1.6" rx=".8"/>
<g class="stn"><path class="ramp" d="M236 104 L246 98 L320 98 L320 104 Z"/><rect class="tower" x="262" y="12" width="58" height="86" rx="6"/>
<rect class="sled" x="282" y="15.5" width="18" height="1.4" rx=".7"/>
<rect class="tank" x="267" y="22" width="22" height="30" rx="3"/><rect class="tank" x="293" y="22" width="22" height="30" rx="3"/>
<rect class="tkd" clip-path="url(#vtd)" x="267" y="22" width="22" height="30"/><rect class="tkc" clip-path="url(#vtc)" x="293" y="22" width="22" height="30"/>
<rect class="bin" x="267" y="56" width="48" height="20" rx="3"/><rect class="bag" x="271" y="59" width="40" height="14" rx="5"/>
<rect class="duct" x="289.8" y="74" width="2.4" height="12" rx="1.2"/><rect class="pipe" x="316.2" y="50" width="1.6" height="40" rx=".8"/><rect class="pipe" x="264.2" y="50" width="1.6" height="40" rx=".8"/></g>
<g class="rob"><ellipse class="shd" cx="35" cy="104" rx="34" ry="2.4"/><g class="rb"><rect class="mop" x="8" y="99.5" width="54" height="2.5" rx="1.2"/>
<g transform="translate(5 101)"><g class="br"><line x1="-5" y1="0" x2="5" y2="0"/><line x1="0" y1="-1.6" x2="0" y2="1.6"/></g></g>
<rect class="body" x="0" y="86" width="70" height="14" rx="7"/><rect class="top" x="4" y="85" width="62" height="2.2" rx="1.1"/><rect class="bump" x="1" y="93" width="68" height=".8"/>
<rect class="lid" x="28" y="79" width="14" height="6.5" rx="2"/><rect class="lidl" x="30" y="81.2" width="10" height="1"/>
<rect class="led" x="56" y="89.5" width="9" height="1.4" rx=".7"/><g class="dust"><circle cx="-5" cy="102" r="1"/><circle cx="-10" cy="101" r=".8"/><circle cx="-15" cy="102.5" r=".9"/></g>
<path class="bolt" d="M13 66 l-4 7 h4 l-2 6 l6 -8 h-4 l2 -5 z"/><g class="err"><circle cx="35" cy="68" r="5.5"/><rect x="34.3" y="64.8" width="1.4" height="4" rx=".7"/><circle class="dot" cx="35" cy="70.9" r=".8"/></g></g></g>
<g class="parts"><circle cx="291" cy="88" r="1.4"/><circle cx="291" cy="88" r="1.1"/><circle cx="291" cy="88" r="1.3"/><circle cx="291" cy="88" r="1"/><circle cx="291" cy="88" r="1.2"/></g>
<g class="water"><ellipse cx="256" cy="104" rx="11" ry="1.6"/><ellipse cx="280" cy="104" rx="11" ry="1.6"/><ellipse cx="304" cy="104" rx="11" ry="1.6"/>
<g class="drops"><circle cx="317" cy="52" r="1.1"/><circle cx="317" cy="52" r="1"/><circle cx="317" cy="52" r="1.1"/></g>
<g class="dirt"><circle cx="265" cy="90" r="1.1"/><circle cx="265" cy="90" r="1"/><circle cx="265" cy="90" r="1.1"/></g>
<g class="bubl"><circle cx="274" cy="50" r=".9"/><circle cx="281" cy="50" r=".7"/><circle cx="277" cy="50" r=".8"/></g>
<g class="spl"><circle cx="250" cy="100" r=".9"/><circle cx="270" cy="99" r="1"/><circle cx="296" cy="100" r=".8"/></g></g>
<g class="heat"><path d="M249 84 q2 -4 0 -8 q-2 -4 0 -8"/><path d="M257 84 q2 -4 0 -8 q-2 -4 0 -8"/><path d="M304 86 q2 -4 0 -8 q-2 -4 0 -8"/></g>
</svg><div class="cap"></div></div>`;
  var VPAT = { empty: /empty|evacuat|dust_?collect|collect_?dust|absaug|entleer/i, wash: /wash|wasch|wäsch|self_?clean|rinse/i, dry: /dry|trock/i, mop: /mop|wisch|wipe/i, chg: /charg|lädt/i };
  var VSTATES = ["docked", "cleaning", "returning", "paused", "error", "idle"];
  var vact = (s) => !!s && !["unavailable", "unknown"].includes(s.state) && (NUMRE.test(s.state) ? +s.state > 0 : isOn(s));
  function vdevs(h, id) {
    const dev = h?.entities?.[id]?.device_id, D = h?.devices || {}, me = D[dev];
    if (!dev) return [];
    if (!me) return [dev];
    const idf = (d) => (d.identifiers || []).map((x) => String(Array.isArray(x) ? x[1] : x));
    const mine = idf(me), ce = me.config_entries || [];
    return Object.values(D).filter((d) => d.id === dev || d.via_device_id === dev || me.via_device_id === d.id || (d.config_entries || []).some((e) => ce.includes(e)) && (idf(d).some((x) => mine.some((m) => x !== m && x.startsWith(m))) || !!d.name && !!me.name && d.name.startsWith(me.name) && /^\s*(dock|station|base|ladestation|basis)\b/i.test(d.name.slice(me.name.length)))).map((d) => d.id);
  }
  var vents = (h, id) => {
    const ds = vdevs(h, id);
    return ds.length ? Object.values(h.entities).filter((e) => ds.includes(e.device_id) && e.entity_id !== id) : [];
  };
  function vauto(h, id) {
    const out = {};
    const ents = vents(h, id).filter((e) => !e.hidden);
    if (!ents.length) return out;
    const txt = (e) => `${e.translation_key || ""} ${e.entity_id}`;
    const find = (doms, re, not) => ents.find((e) => doms.includes(dom(e.entity_id)) && re.test(txt(e)) && !(not && not.test(txt(e))))?.entity_id;
    const ERR = /error|fehler|fault/;
    out.status = find(["sensor"], /^(vacuum_)?(status|state) |_(status|state)$/, /dock|station|base|error|fehler|fault/);
    out.station = find(["sensor"], /(dock|station|base)\w*_(status|state)|(status|state)\w*_(dock|station)/, ERR);
    out.mop_attached = find(["binary_sensor"], /mop\w*(attach|install)|(attach|install)\w*mop|mopp?_angebracht/);
    out.mop_mode = ents.find((e) => {
      if (dom(e.entity_id) !== "select") return false;
      const o = (h.states[e.entity_id]?.attributes.options || []).map(String);
      return o.some((x) => VPAT.mop.test(x)) && o.some((x) => !VPAT.mop.test(x));
    })?.entity_id;
    out.clean_water = find(["binary_sensor", "sensor"], /clean_?(water|box|tank)|fresh_?water|frischwasser/);
    out.dirty_water = find(["binary_sensor", "sensor"], /dirty_?(water|box|tank)|waste_?water|schmutzwasser/);
    out.drying = find(["sensor", "binary_sensor"], /dry|trockn/, ERR);
    out.charging = find(["binary_sensor"], /charg|ladestatus/);
    out.emptying = find(["binary_sensor"], /empty|entleer|absaug/);
    out.washing = find(["binary_sensor"], /wash|wasch|wäsch/);
    return Object.fromEntries(Object.entries(out).filter(([, v]) => v));
  }
  var VBAG = /empty|entleer|absaug|evacuat|dust_?(bag|bin|collect)|staubbeutel/;
  var VTANK = /mop_?wash|wash_?mop|moppw|wäsch|wash|self_?clean|clean_?(water|box|tank)|dirty_?(water|box|tank)|frischwasser|schmutzwasser|dry|trockn/;
  function vstation(h, id, c, auto) {
    if (["dock", "empty", "wash", "full"].includes(c.station_type)) return c.station_type;
    const t = h?.entities ? vents(h, id).map((e) => `${e.translation_key || ""} ${e.entity_id}`) : [];
    const has = (k) => c[k] !== false && !!(c[k] || c.scene_auto !== false && auto[k]);
    const bag = has("emptying") || c.scene_auto !== false && t.some((x) => VBAG.test(x));
    const tank = ["clean_water", "dirty_water", "washing", "drying"].some(has) || c.scene_auto !== false && t.some((x) => VTANK.test(x));
    return bag && tank ? "full" : bag ? "empty" : tank ? "wash" : "dock";
  }
  var VTOWER = { full: [262, 12, 58, 86, 282, 15.5, 18], wash: [262, 12, 58, 86, 282, 15.5, 18], empty: [262, 50, 58, 48, 282, 53, 18], dock: [292, 76, 28, 22, 299, 79.5, 14] };
  var NovaVacuumCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("vacuum-card-editor"));
    }
    static getStubConfig(h) {
      const ids = Object.keys(h.states).filter((i) => i.startsWith("vacuum."));
      return { entity: ids[0] || "vacuum." };
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      if (!c.entity || dom(c.entity) !== "vacuum") throw new Error("entity muss eine vacuum.* Entität sein");
      if (c.map && !["camera", "image"].includes(dom(c.map))) throw new Error("map muss eine camera.* oder image.* Entität sein");
      this._c = {
        ...VDEF,
        ...c,
        rooms: [].concat(c.rooms || []).map(toObj).filter((o) => o.name || o.icon || o.entity || o.segments != null || o.tap_action),
        consumables: [].concat(c.consumables || []).map(toObj).filter((o) => o.entity),
        switches: [].concat(c.switches || []).map(toObj).filter((o) => o.entity)
      };
      this._ids = entityIds(this._c);
      this._built = false;
      if (this._h) {
        this._build();
        this._update();
      }
    }
    // Neu zeichnen nur, wenn sich eine Entität der Karte (auch Akku und automatisch gefundene Station) geändert hat
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._built) this._build();
      else if (!hassChanged(old, h, [...this._ids, this._bat, ...Object.values(this._auto || {})])) return;
      this._update();
    }
    getCardSize() {
      return 3 + (this._c?.map ? 4 : 0) + Math.ceil(((this._c?.consumables.length || 0) + (this._c?.switches.length || 0)) / 2);
    }
    getGridOptions() {
      return { columns: 12, rows: "auto", min_columns: 4 };
    }
    connectedCallback() {
      this._quiet = inPicker(this);
      if (this._quiet) this._vis = false;
      if ("IntersectionObserver" in window) {
        this._io ||= new IntersectionObserver((es) => {
          this._vis = es[es.length - 1].isIntersecting && !this._quiet;
          this._tick();
        }, { rootMargin: "100px" });
        this._io.observe(this);
      } else this._vis = !this._quiet;
      if ("ResizeObserver" in window) {
        this._ro ||= new ResizeObserver((es) => this._width(Math.round(es[es.length - 1].contentRect.width)));
        this._ro.observe(this);
      }
      this._tick();
    }
    disconnectedCallback() {
      this._io?.disconnect();
      this._ro?.disconnect();
      this._vis = false;
      this._tick();
    }
    // Layout nach Kartenbreite – mit Puffer (ab 640 px daneben, erst unter 600 px wieder darunter), damit es nie hin- und herkippt
    _width(w) {
      const g = this._e?.g;
      if (!g || !w) return;
      const wide = g.classList.contains("wide") ? w >= 600 : w >= 640;
      g.classList.toggle("wide", wide);
      g.classList.toggle("narrow", w <= 300);
    }
    _build() {
      this._built = true;
      const c = this._c, r = this.shadowRoot || this.attachShadow({ mode: "open" });
      this._bat = c.battery || batOf(this._h, c.entity);
      const ar = String(c.map_aspect_ratio || "auto").replace(":", "/");
      const pills = c.controls !== "round", rt = vtitle(c.rooms_title), mt = vtitle(c.map_title);
      const lay = c.map ? ["side", "stack"].includes(c.layout) ? c.layout : "auto" : "stack";
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${VCSS}</style><div class="g vc ${lay}"><div class="main">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${c.all ? '<div class="pill all"><span class="i"></span><span class="t"></span></div>' : ""}<div class="bat" hidden><ha-icon></ha-icon><span></span></div></div>
${c.scene !== false ? VSCENE : ""}
${pills ? `<div class="ctl pl pills">${Object.entries(VCTL).map(([k, [ic, t]]) => `<div class="pill c-${k}"><ha-icon icon="${ic}"></ha-icon><span>${t}</span></div>`).join("")}</div>` : '<div class="ctl"><div class="cb sp" title="Spot"><ha-icon icon="mdi:target-variant"></ha-icon></div><div class="cb st" title="Stopp"><ha-icon icon="mdi:stop"></ha-icon></div><div class="cb pp" title="Start/Pause"><ha-icon icon="mdi:play"></ha-icon></div><div class="cb hm" title="Zur Station"><ha-icon icon="mdi:home-import-outline"></ha-icon></div><div class="cb lo" title="Suchen"><ha-icon icon="mdi:map-marker-question-outline"></ha-icon></div></div>'}
${c.show_fan_speed !== false ? '<div class="pills fs"></div>' : ""}
${c.rooms.length ? `<div class="blk rooms">${rt ? `<div class="bt">${esc(rt)}</div>` : ""}<div class="pills"></div></div>` : ""}
${c.switches.length ? '<div class="blk sws"></div>' : ""}
${c.consumables.length ? `<div class="blk cons"><div class="${c.consumables_layout === "chips" ? "pills" : "list"}"></div></div>` : ""}</div>
${c.map ? `<div class="mpnl">${mt ? `<div class="bt">${esc(mt)}</div>` : ""}<div class="map${ar !== "auto" ? " ar" : ""}" style="--ar:${esc(ar)};--nv-map-max:${c.map_max_height > 0 ? +c.map_max_height + "px" : "none"}"><img alt=""></div></div>` : ""}</div>`;
      const q = (s) => r.querySelector(s);
      this._e = {
        g: q(".g"),
        ic: q(".hd .ic"),
        name: q(".hd b"),
        sub: q(".hd small"),
        bat: q(".bat"),
        map: q(".map"),
        img: q(".map img"),
        pp: q(".pp"),
        st: q(".st"),
        hm: q(".hm"),
        lo: q(".lo"),
        sp: q(".sp"),
        fs: q(".fs"),
        rooms: q(".rooms .pills"),
        cons: q(".cons > div")
      };
      const e = this._e, svc = (s, d = {}) => this._h.callService("vacuum", s, { entity_id: c.entity, ...d });
      press(e.ic, { tap: () => this._act({ entity: c.entity, tap_action: c.tap_action }, "tap", true), hold: () => this._act({ entity: c.entity, hold_action: c.hold_action }, "hold") });
      this._allEl = q(".hd .all");
      if (this._allEl) press(this._allEl, { tap: () => this._act({ entity: c.all, confirm: c.all_confirm }, "tap"), hold: () => this._act({ entity: c.all }, "hold") });
      press(e.bat, { tap: () => this._bat && moreInfo(this, this._bat) });
      const start = () => {
        const p = this._picked();
        p.length && this._st()?.state !== "paused" ? this._clean(p) : svc("start");
      };
      if (pills) this._ctl = Object.entries(VCTL).map(([k, d]) => {
        const el2 = q(`.c-${k}`);
        press(el2, { tap: () => k === "start" ? start() : svc(d[3]) });
        return [k, el2, d];
      });
      else {
        press(e.pp, { tap: () => {
          const s = this._st();
          s?.state === "cleaning" ? svc(hasF(s, VF.PAUSE) ? "pause" : "stop") : start();
        } });
        press(e.st, { tap: () => svc("stop") });
        press(e.hm, { tap: () => svc("return_to_base") });
        press(e.lo, { tap: () => svc("locate") });
        press(e.sp, { tap: () => svc("clean_spot") });
      }
      const sw = q(".sws");
      this._swUp = sw ? BLOCKS.entities.call(this, { entities: c.switches, columns: c.switches_columns }, sw) : null;
      if (e.map) {
        press(e.map, { tap: () => this._mapTap(), hold: () => moreInfo(this, c.map) });
        e.img.addEventListener("load", () => {
          if (e.map.classList.contains("ar") || !e.img.naturalWidth) return;
          e.map.style.setProperty("--ar", `${e.img.naturalWidth}/${e.img.naturalHeight}`);
          e.map.classList.add("ar");
        });
      }
      this._sel = /* @__PURE__ */ new Set();
      if (e.rooms) {
        this._rooms = c.rooms.map((o, i) => {
          const el2 = document.createElement("div");
          el2.className = "pill";
          el2.innerHTML = '<span class="i"></span><span class="t"></span>';
          press(el2, { tap: () => {
            if (o.tap_action?.action || o.entity || !o.area && !list(o.segments).length) return this._act(o, "tap");
            this._sel.has(i) ? this._sel.delete(i) : this._sel.add(i);
            this._update();
          }, hold: () => this._act(o, "hold") });
          e.rooms.append(el2);
          return el2;
        });
        this._go = document.createElement("div");
        this._go.className = "pill go";
        this._go.innerHTML = '<ha-icon icon="mdi:play"></ha-icon><span class="t"></span>';
        press(this._go, { tap: () => this._clean(this._picked()) });
        e.rooms.append(this._go);
      }
      if (e.cons) {
        const chips = c.consumables_layout === "chips";
        this._cons = c.consumables.map((o) => {
          const el2 = document.createElement("div");
          el2.className = chips ? "pill" : "kv";
          el2.innerHTML = chips ? '<span class="i"></span><span class="t"></span>' : '<span class="i"></span><span class="k"></span><span class="v"></span><div class="cbar"><i></i></div>';
          press(el2, { tap: () => this._act(o, "tap", true), hold: () => this._act(o, "hold") });
          e.cons.append(el2);
          return [el2, o];
        });
      }
      this._auto = vauto(this._h, c.entity);
      e.sc = q(".scene");
      if (e.sc) {
        Object.assign(e, { cap: q(".scene .cap"), tkc: q(".tkc"), tkd: q(".tkd") });
        this._stType = vstation(this._h, c.entity, c, this._auto);
        const [x, y, w, hh, lx, ly, lw] = VTOWER[this._stType], tw = q(".tower"), led = q(".sled");
        Object.entries({ x, y, width: w, height: hh }).forEach(([k, v]) => tw.setAttribute(k, v));
        Object.entries({ x: lx, y: ly, width: lw }).forEach(([k, v]) => led.setAttribute(k, v));
      }
      this._fsKey = this._mapKey = null;
      this._width(Math.round(this.getBoundingClientRect().width));
      this._tick();
    }
    _st() {
      return this._h?.states[this._c.entity];
    }
    // Eingeplant: angetippt oder Raum-Entität an – nur Räume mit Bereich oder Segmenten; „Überall“ an = nichts (alles)
    _picked() {
      const c = this._c, h = this._h;
      if (c.all && isOn(h?.states[c.all])) return [];
      return c.rooms.map((o, i) => i).filter((i) => {
        const o = c.rooms[i], os = o.entity && h?.states[o.entity];
        return (o.area || list(o.segments).length) && (this._sel.has(i) || !!os && TOGGLE.includes(dom(o.entity)) && isOn(os));
      });
    }
    // Bereiche über vacuum.clean_area (HA-Bereiche, herstellerunabhängig), sonst Segmente je Integration
    _clean(idx) {
      const c = this._c, rooms = idx.map((i) => c.rooms[i]), ok2 = hasF(this._st(), VF.AREA);
      const byArea = (o) => ok2 && o.area;
      const areas = [...new Set(rooms.filter(byArea).map((o) => o.area))];
      const seg = rooms.filter((o) => !byArea(o)).flatMap((o) => list(o.segments)), fn = SEG[c.segment_mode];
      if (areas.length) this._h.callService("vacuum", "clean_area", { cleaning_area_id: areas }, { entity_id: c.entity });
      if (seg.length && fn) {
        const [d, s, data] = fn(c.entity, seg, Math.max(1, +c.segment_repeat || 1));
        this._h.callService(d, s, data);
      }
      this._sel.clear();
      this._update();
    }
    // Animation: liefert true bei Tank-Warnung
    _scene() {
      const e = this._e, h = this._h, c = this._c;
      if (!e.sc) return false;
      const s = this._st(), st = s?.state, a = s?.attributes || {}, bv = this._bv;
      const pick = (k) => c[k] === false ? null : c[k] || (c.scene_auto !== false ? this._auto[k] : null);
      const S = (k) => {
        const id = pick(k);
        return id ? h.states[id] : null;
      };
      const txt = [S("status"), S("station")].flatMap((x) => x ? [x.state, fmtState(h, x)] : []).concat(a.status || [], st || []).join(" ");
      const mm = S("mop_mode"), ma = S("mop_attached"), only = list(c.mop_states);
      const mopping = mm ? only.length ? only.includes(mm.state) : VPAT.mop.test(mm.state) && !/^(off|none|vacuum|aus)$/i.test(mm.state) : null;
      const attached = ma ? vact(ma) : !!(a.mop_attached ?? a.water_box_attached ?? mopping);
      const home = !["cleaning", "returning", "error"].includes(st);
      const empty2 = home && (vact(S("emptying")) || VPAT.empty.test(txt));
      const wash = home && !empty2 && (vact(S("washing")) || VPAT.wash.test(txt));
      const dry = home && !empty2 && !wash && (vact(S("drying")) || VPAT.dry.test(txt));
      const chg = home && !empty2 && !wash && !dry && (vact(S("charging")) || VPAT.chg.test(txt) || st === "docked" && bv < 100);
      const wet = attached && (mopping ?? true);
      const tank = (el2, x, ok2, bad) => {
        let p = 0.55, low = false;
        if (x && NUMRE.test(x.state)) p = Math.max(0, Math.min(100, +x.state)) / 100;
        else if (x && !["unavailable", "unknown"].includes(x.state)) {
          low = dom(x.entity_id) === "binary_sensor" ? x.state === "on" : /low|empty|leer|full|voll|lack|short|knapp|problem/i.test(x.state);
          p = low ? bad : ok2;
        }
        el2.setAttribute("y", 22 + 30 * (1 - p));
        el2.setAttribute("height", 30 * p);
        el2.classList.toggle("low", low);
        el2.style.opacity = x ? "" : ".35";
        return low;
      };
      const tk = this._stType === "full" || this._stType === "wash";
      const lowC = tk && tank(e.tkc, S("clean_water"), 0.75, 0.08), lowD = tk && tank(e.tkd, S("dirty_water"), 0.3, 0.95);
      const ty = this._stType;
      e.sc.className = ["scene", "sc", VSTATES.includes(st) ? st : "idle", (ty === "full" || ty === "empty") && "has-bag", (ty === "full" || ty === "wash") && "has-tanks", attached && "mop", wet && "mopping", empty2 && "empty", wash && "wash", dry && "dry", chg && "chg", this._vis === false && "still"].filter(Boolean).join(" ");
      e.cap.textContent = empty2 ? "Absaugen" : wash ? "Mopp wird gewaschen" : dry ? "Mopp trocknet" : st === "cleaning" ? wet ? "Saugt & wischt" : "Saugt" : lowC ? "Frischwasser leer" : lowD ? "Schmutzwasser voll" : chg ? bv >= 100 ? "Voll geladen" : "Lädt" : "";
      return lowC || lowD;
    }
    _mapTap() {
      const a = this._c.map_action;
      if (a === "none") return;
      if (a === "vacuum") return moreInfo(this, this._c.entity);
      moreInfo(this, this._c.map);
    }
    _update() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !e) return;
      const s = this._st(), a = s?.attributes || {}, st = s?.state;
      const run = VRUN.includes(st), err = st === "error";
      e.g.classList.toggle("na", !s || st === "unavailable");
      this.classList.toggle("nv-na", !s || st === "unavailable");
      e.g.classList.toggle("run", run && c.glow !== false);
      e.name.textContent = c.name ?? a.friendly_name ?? c.entity;
      const ss = c.status && h.states[c.status];
      const bs = this._bat && h.states[this._bat], bv = parseFloat(bs ? bs.state : a.battery_level), chg = st === "docked" && bv < 100;
      const bd = c.battery_display, btxt = bd === "status" && !isNaN(bv) ? `Akku ${Math.round(bv)} %` : null;
      e.sub.textContent = !s ? "nicht gefunden" : [ss ? fmtState(h, ss) : fmtState(h, s), !ss && a.fan_speed && run ? fanName(h, s, a.fan_speed) : null, btxt].filter(Boolean).join(" · ");
      e.sub.classList.toggle("er", err);
      setIcon(e.ic, c.icon || a.icon || "mdi:robot-vacuum");
      e.ic.parentElement.classList.toggle("on", run);
      e.bat.hidden = isNaN(bv) || bd !== "chip";
      if (!e.bat.hidden) {
        setIcon(e.bat.firstChild, batIcon(bv, chg));
        e.bat.lastChild.textContent = `${Math.round(bv)} %`;
        e.bat.classList.toggle("chg", chg);
        e.bat.classList.toggle("low", bv <= (c.battery_low ?? 20) && !chg);
      }
      if (this._ctl) {
        const show = { stop: c.show_stop !== false, home: c.show_return !== false, locate: c.show_locate !== false, spot: !!c.show_spot };
        const act = { cleaning: "start", paused: "pause", returning: "home", docked: "home" }[st];
        this._ctl.forEach(([k, el2, d]) => {
          el2.hidden = show[k] === false || !hasF(s, d[2]);
          el2.classList.toggle("on", k === act && k !== "home" || k === "home" && st === "returning");
        });
      } else {
        setIcon(e.pp, st === "cleaning" ? hasF(s, VF.PAUSE) ? "mdi:pause" : "mdi:stop" : "mdi:play");
        e.pp.title = st === "cleaning" ? "Pause" : "Start";
        e.pp.hidden = !!s && !hasF(s, VF.START) && !hasF(s, VF.PAUSE);
        e.st.hidden = c.show_stop === false || !hasF(s, VF.STOP) || !(run || st === "paused");
        e.hm.hidden = c.show_return === false || !hasF(s, VF.RETURN) || st === "docked";
        e.lo.hidden = c.show_locate === false || !hasF(s, VF.LOCATE);
        e.sp.hidden = !c.show_spot || !hasF(s, VF.SPOT);
      }
      this._swUp?.(h);
      if (e.fs) this._fans(s);
      const rs = c.room_sensor && h.states[c.room_sensor], cur2 = rs && !["unknown", "unavailable", ""].includes(rs.state) ? rs.state.toLowerCase() : null;
      if (this._allEl) {
        const as = h.states[c.all];
        this._allEl.classList.toggle("on", isOn(as));
        this._allEl.classList.toggle("na", !as || as.state === "unavailable");
        setIcon(this._allEl.firstChild, c.all_icon || as?.attributes.icon || "mdi:check-all");
        this._allEl.lastChild.textContent = c.all_name ?? "Überall";
      }
      this._rooms?.forEach((el2, i) => {
        const o = c.rooms[i], os = o.entity && h.states[o.entity];
        el2.classList.toggle("on", this._sel.has(i) || !!os && TOGGLE.includes(dom(o.entity)) && isOn(os));
        el2.classList.toggle("cur", !!cur2 && [o.name, o.area, o.area && h.areas?.[o.area]?.name, ...list(o.segments)].some((x) => x != null && String(x).toLowerCase() === cur2));
        el2.classList.toggle("na", !!o.entity && (!os || os.state === "unavailable"));
        setIcon(el2.firstChild, o.icon || os?.attributes.icon || "mdi:floor-plan");
        el2.lastChild.textContent = o.name ?? os?.attributes.friendly_name ?? (list(o.segments).join(", ") || "");
      });
      if (this._go) {
        const n = this._picked().length;
        this._go.hidden = !n;
        this._go.lastChild.textContent = `${n} ${n === 1 ? "Raum" : "Räume"} reinigen`;
      }
      let warn = false;
      this._cons?.forEach(([el2, o]) => {
        const cs = h.states[o.entity], n = cs ? parseFloat(cs.state) : NaN;
        const low = o.below != null && !isNaN(n) && n < o.below;
        warn ||= low;
        el2.classList.toggle("na", !cs || cs.state === "unavailable");
        el2.classList.toggle("warn", low);
        setIcon(el2.firstChild, iconOf(h, o, "mdi:wrench-clock"));
        const v = valueOf(h, cs, o);
        if (el2.classList.contains("pill")) {
          el2.lastChild.textContent = o.name === "" ? v : `${nameOf(h, o)} · ${v}`;
          return;
        }
        el2.children[1].textContent = nameOf(h, o);
        el2.children[2].textContent = v;
        const mx = o.max ?? ((o.unit ?? cs?.attributes.unit_of_measurement) === "%" ? 100 : null);
        el2.lastChild.hidden = !mx || isNaN(n);
        if (mx && !isNaN(n)) el2.lastChild.firstChild.style.width = `${Math.max(0, Math.min(100, n / mx * 100))}%`;
      });
      e.g.classList.toggle("err", err && c.glow !== false);
      this._bv = bv;
      if (this._scene()) warn = true;
      e.g.classList.toggle("warn", !err && warn && c.glow !== false);
      this._mapSync();
      this._tick();
    }
    _fans(s) {
      const c = this._c, a = s?.attributes || {}, e = this._e;
      const only = list(c.fan_speeds), all = hasF(s, VF.FAN) ? a.fan_speed_list || [] : [];
      const fs = only.length ? all.filter((x) => only.includes(x)) : all;
      const key = fs.join("\n");
      if (key !== this._fsKey) {
        this._fsKey = key;
        e.fs.replaceChildren(...fs.map((x) => {
          const el2 = document.createElement("div");
          el2.className = "pill";
          el2.dataset.s = x;
          el2.innerHTML = '<span class="i"></span><span class="t"></span>';
          setIcon(el2.firstChild, mapIcon(c.fan_speed_icons, x) || "mdi:fan");
          el2.lastChild.textContent = fanName(this._h, s, x);
          press(el2, { tap: () => this._h.callService("vacuum", "set_fan_speed", { entity_id: c.entity, fan_speed: x }) });
          return el2;
        }));
      }
      e.fs.hidden = !fs.length;
      [...e.fs.children].forEach((el2) => el2.classList.toggle("on", el2.dataset.s === a.fan_speed));
    }
    // image.* bei Zustandswechsel neu laden, camera.* im Takt, solange der Roboter fährt
    _mapSync(force) {
      const e = this._e, id = this._c.map, ms = id && this._h?.states[id], p = ms?.attributes.entity_picture;
      if (!e?.map) return;
      if (!this._mapKey) e.map.parentElement.hidden = !p;
      if (!p) return;
      const key = dom(id) === "image" ? `${p}|${ms.state}` : p;
      if (!force && key === this._mapKey) return;
      if (!this._vis && this._mapKey) return;
      this._mapKey = key;
      e.img.src = stamp(p, dom(id) === "image" ? ms.state : Date.now());
    }
    _tick() {
      this._e?.sc?.classList.toggle("still", this._vis === false);
      this._e?.g?.classList.toggle("still", this._vis === false);
      const c = this._c, run = this._vis && c?.map && dom(c.map) === "camera" && c.map_refresh > 0 && VRUN.includes(this._st()?.state);
      if (run && !this._tm) this._tm = setInterval(() => this._mapSync(true), c.map_refresh * 1e3);
      if (!run && this._tm) {
        clearInterval(this._tm);
        this._tm = null;
      }
      if (this._vis) this._mapSync();
    }
    _act(o, kind, info) {
      return runAction(this, o, kind, info);
    }
  };
  define("vacuum-card", NovaVacuumCard, { name: "Nova Saugroboter Card", description: "Saugroboter mit Status, Akku, Start/Pause/Stopp/Zur Station, Saugstärke, Karte daneben, Raumreinigung, Schaltern und Verbrauchsteilen.", documentationURL: docUrl("nova-saugroboter-card") });
  var VGEN = [
    { name: "entity", required: true, selector: { entity: { domain: ["vacuum"] } } },
    g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } }),
    { name: "status", selector: { entity: {} } }
  ];
  var VBAT = [
    { name: "battery", selector: { entity: { domain: ["sensor"], device_class: "battery" } } },
    g2({ name: "battery_low", selector: { number: { min: 0, max: 100, mode: "box", unit_of_measurement: "%" } } }, sel("battery_display", [["status", "Im Statustext"], ["chip", "Als Pille rechts"], ["none", "Aus"]]))
  ];
  var VCTRL = [
    sel("controls", [["pills", "Pillen mit Text"], ["round", "Runde Buttons"]]),
    g2({ name: "show_stop", selector: { boolean: {} } }, { name: "show_return", selector: { boolean: {} } }),
    g2({ name: "show_locate", selector: { boolean: {} } }, { name: "show_spot", selector: { boolean: {} } })
  ];
  var VLOOK = [sel("layout", [["auto", "Automatisch"], ["side", "Karte daneben"], ["stack", "Karte darüber"]]), { name: "glow", selector: { boolean: {} } }];
  var VACT = [g2({ name: "tap_action", selector: A }, { name: "hold_action", selector: A })];
  var VSCN = (c) => c.scene === false ? [{ name: "scene", selector: { boolean: {} } }] : [
    g2({ name: "scene", selector: { boolean: {} } }, { name: "scene_auto", selector: { boolean: {} } }),
    sel("station_type", [["auto", "Automatisch"], ["dock", "Nur Ladestation"], ["empty", "Absaugstation"], ["wash", "Waschstation (Tanks)"], ["full", "Komplett (Tanks + Staubbeutel)"]]),
    g2({ name: "mop_attached", selector: { entity: {} } }, { name: "mop_mode", selector: { entity: {} } }),
    { name: "mop_states", selector: { text: { multiple: true } } },
    g2({ name: "clean_water", selector: { entity: {} } }, { name: "dirty_water", selector: { entity: {} } }),
    g2({ name: "emptying", selector: { entity: {} } }, { name: "washing", selector: { entity: {} } }),
    g2({ name: "drying", selector: { entity: {} } }, { name: "charging", selector: { entity: {} } }),
    { name: "station", selector: { entity: {} } }
  ];
  var VFAN = (c) => [{ name: "show_fan_speed", selector: { boolean: {} } }, ...c.show_fan_speed === false ? [] : [{ name: "fan_speeds", selector: { text: { multiple: true } } }]];
  var VMAP = (c) => [
    g2({ name: "map", selector: { entity: { domain: ["camera", "image"] } } }, { name: "map_title", selector: T }),
    ...c.map ? VMAPX : []
  ];
  var VMAPX = [
    g2(
      sel("map_aspect_ratio", [["auto", "Automatisch"], ["1:1", "1:1"], ["4:3", "4:3"], ["16:9", "16:9"], ["3:4", "3:4"]]),
      { name: "map_refresh", selector: { number: { min: 0, max: 60, mode: "box", unit_of_measurement: "s" } } }
    ),
    g2(
      sel("map_action", [["more-info", "Karte groß öffnen"], ["vacuum", "Details des Roboters"], ["none", "Nichts"]]),
      { name: "map_max_height", selector: { number: { min: 0, max: 800, step: 10, mode: "box", unit_of_measurement: "px" } } }
    )
  ];
  var vvis = (c) => `${c.scene === false}|${c.show_fan_speed === false}|${!!c.map}`;
  var VSEG = [
    { name: "rooms_title", selector: T },
    g2({ name: "room_sensor", selector: { entity: { domain: ["sensor", "select", "input_select"] } } }, { name: "all", selector: { entity: {} } }),
    g2({ name: "all_name", selector: T }, { name: "all_icon", selector: I }),
    g2(
      sel("segment_mode", [["roborock", "Roborock"], ["valetudo", "Valetudo (MQTT)"], ["dreame", "Dreame (HACS)"], ["xiaomi", "Xiaomi Miio"]]),
      { name: "segment_repeat", selector: { number: { min: 1, max: 3, mode: "slider" } } }
    )
  ];
  var VROOM = [NAMEICON, g2({ name: "segments", selector: T }, { name: "area", selector: { area: {} } }), { name: "entity", selector: { entity: {} } }, { name: "tap_action", selector: A }, { name: "confirm", selector: T }];
  var VSWL = [{ name: "switches_columns", selector: { number: { min: 1, max: 3, mode: "slider" } } }];
  var VSW = [ENT, NAMEICON, { name: "tap_action", selector: A }, { name: "confirm", selector: T }];
  var VCONSL = [sel("consumables_layout", [["rows", "Liste"], ["chips", "Chips"]])];
  var VCONS = [ENT, NAMEICON, g2({ name: "unit", selector: T }, { name: "decimals", selector: { number: { min: 0, max: 4, mode: "box" } } }), g2(NUM("below"), NUM("max"))];
  var VLABELS = {
    ...BASE_LABELS,
    station_type: "Station",
    scene: "Animation anzeigen",
    scene_auto: "Entitäten automatisch suchen",
    mop_attached: "Mopp angebracht",
    mop_mode: "Reinigungsmodus (Wischen?)",
    mop_states: "Zustände, die „wischt“ bedeuten",
    clean_water: "Frischwassertank",
    dirty_water: "Schmutzwassertank",
    emptying: "Absaugen aktiv",
    washing: "Moppwäsche aktiv",
    drying: "Trocknung aktiv",
    charging: "Lädt",
    station: "Stations-Status",
    battery: "Akku-Sensor",
    battery_display: "Akku anzeigen",
    controls: "Steuerung",
    layout: "Layout",
    map_title: "Überschrift Karte",
    rooms_title: "Überschrift Räume",
    room_sensor: "Aktueller Raum (Sensor)",
    all: "„Überall“-Button: Entität",
    all_name: "„Überall“-Button: Text",
    all_icon: "„Überall“-Button: Icon",
    area: "Bereich",
    switches_columns: "Spalten",
    battery_low: "Akku niedrig ab",
    status: "Status-Entität (optional)",
    glow: "Leuchten beim Reinigen / bei Warnung",
    show_stop: "Stopp-Button",
    show_return: "Zur-Station-Button",
    show_locate: "Suchen-Button",
    show_spot: "Spot-Reinigung",
    show_fan_speed: "Saugstärke anzeigen",
    fan_speeds: "Nur diese Stufen zeigen",
    map: "Karte / Kamera",
    map_aspect_ratio: "Seitenverhältnis",
    map_max_height: "Max. Höhe (untereinander)",
    map_refresh: "Aktualisieren alle",
    map_action: "Karte antippen",
    segment_mode: "Integration",
    segment_repeat: "Durchgänge",
    segments: "Segment-IDs",
    consumables_layout: "Darstellung",
    below: "Warnen unter",
    max: "Maximum (für Balken)",
    tap_action: "Aktion beim Antippen",
    hold_action: "Aktion bei langem Drücken"
  };
  var VHELPERS = {
    station_type: "Automatisch = nach den Entitäten des Roboters (Absaugen → Staubbeutel, Wasser/Moppwäsche → Tanks)",
    scene_auto: "Sucht Mopp, Tanks, Absaugen, Waschen, Trocknen und Laden am Gerät des Roboters. Felder unten überschreiben das",
    mop_mode: "Select o. ä.: Zustand mit mop/wisch = wischt (z. B. vac_and_mop)",
    mop_states: "Optional, wenn die Erkennung nicht passt: genaue Zustände, z. B. vac_and_mop, mop",
    clean_water: "binary_sensor (an = leer), Füllstand in % oder Text",
    dirty_water: "binary_sensor (an = voll), Füllstand in % oder Text",
    drying: "An oder Zahl > 0 (z. B. Rest-Trocknungszeit) = trocknet",
    station: "Text-Sensor der Station; wird wie der Status nach Absaugen/Waschen/Trocknen durchsucht",
    battery: "Leer = Akku-Sensor am Gerät des Roboters automatisch",
    status: "Text unter dem Namen, z. B. sensor.robbi_status. Leer = Zustand des Roboters",
    tap_action: "Standard: Details des Roboters",
    fan_speeds: "Leer = alle Stufen des Roboters. Genaue Namen wie in fan_speed_list",
    map: "z. B. image.robbi_karte oder camera.robbi_map",
    layout: "Automatisch = Karte daneben, sobald die Karte breit genug ist (z. B. im Popup)",
    map_title: "„-“ = ohne Überschrift",
    rooms_title: "„-“ = ohne Überschrift",
    room_sensor: "Raum, in dem der Roboter gerade ist, bekommt einen gelben Ring (Vergleich mit Name, Bereich oder Segment)",
    all: "Optional, z. B. input_boolean.saugroboter_alles oder ein Skript – erscheint oben rechts",
    area: "Empfohlen: Reinigung über vacuum.clean_area (in den Roboter-Einstellungen Segmente den Bereichen zuordnen). Auch für „Aktueller Raum“",
    map_max_height: "Nur wenn die Karte über den Bedienelementen steht. 0 = ohne Grenze",
    map_refresh: "Nur camera.*: Takt beim Reinigen, 0 = aus. image.* lädt bei Änderung selbst neu",
    segment_mode: "Nur für Räume mit Segment-IDs statt Bereich",
    segments: "Nur, wenn die Integration keine Bereiche kann: Komma-Liste, z. B. 16, 17",
    entity: "Optional: input_boolean/Schalter = Raum einplanen (an = Start reinigt ihn), Skript/Button = direkt auslösen",
    confirm: "Optional: Rückfrage vor dem Auslösen (Aktion/Entität)",
    below: "Eintrag und Rahmen färben sich, wenn der Wert darunter liegt",
    max: "Leer = 100 bei %, sonst kein Balken"
  };
  var NovaVacuumCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), strip2 = (c) => {
        Object.entries(VDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        return c;
      };
      const data = { ...VDEF, ...c0 };
      const form = (schema) => this._form(schema, data, (v) => {
        const c = strip2(merge(this._config, names(schema), v));
        this._emit(c);
        if (vvis(c) !== vvis(c0)) this._rebuild();
      });
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(VGEN))),
        this._section("battery", "mdi:battery-60", "Akku", (b) => b.append(form(VBAT))),
        this._section("controls", "mdi:play-pause", "Bedienung", (b) => b.append(form(VCTRL), this._h4("Saugstärke"), form(VFAN(data)))),
        this._section("map", "mdi:map-outline", "Karte", (b) => b.append(form(VMAP(data)))),
        this._section("scene", "mdi:robot-vacuum", "Animation", (b) => {
          b.append(form(VSCN(data)));
          if (c0.scene !== false && this._hass) {
            const auto = vauto(this._hass, c0.entity), au = Object.entries(auto);
            const ST2 = { dock: "Nur Ladestation", empty: "Absaugstation", wash: "Waschstation", full: "Komplett" };
            b.append(this._hint(`Station: ${ST2[vstation(this._hass, c0.entity, data, auto)]}` + (au.length && c0.scene_auto !== false ? ` · Automatisch gefunden: ${au.map(([k, v]) => `${VLABELS[k] || k} = ${v}`).join(", ")}` : "")));
          }
        }),
        this._section("rooms", "mdi:floor-plan", "Räume", (b) => {
          b.append(this._hint("Je Raum einen HA-Bereich wählen: antippen plant ein, Start reinigt die eingeplanten Räume (vacuum.clean_area). Nichts eingeplant = alles."));
          if (this._items("rooms").length) b.append(form(VSEG));
          this._itemList(b, "rooms", VROOM, { item: "Raum", icon: "mdi:floor-plan" }, "Raum hinzufügen", (it) => ({ ...it, ...it.segments != null ? { segments: list(it.segments).join(", ") } : {} }));
        }),
        this._section("switches", "mdi:toggle-switch-outline", "Schalter", (b) => {
          b.append(this._hint("z. B. Staubentleerung, Moppwäsche, Mopp-Trocknung – Antippen schaltet bzw. löst aus."));
          if (this._items("switches").length) b.append(form(VSWL));
          this._itemList(b, "switches", VSW, { item: "Schalter", icon: "mdi:toggle-switch-outline" }, "Schalter hinzufügen");
        }),
        this._section("consumables", "mdi:wrench-clock", "Infos und Verbrauchsteile", (b) => {
          if (this._items("consumables").length) b.append(form(VCONSL));
          this._itemList(b, "consumables", VCONS, { item: "Verbrauchsteil", icon: "mdi:wrench-clock" }, "Verbrauchsteil hinzufügen");
        }),
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(VLOOK))),
        this._section("actions", "mdi:gesture-tap", "Aktionen", (b) => b.append(form(VACT)))
      );
    }
  };
  __publicField(NovaVacuumCardEditor, "labels", VLABELS);
  __publicField(NovaVacuumCardEditor, "helpers", VHELPERS);
  __publicField(NovaVacuumCardEditor, "openSections", ["general"]);
  define("vacuum-card-editor", NovaVacuumCardEditor);

  // src/waste.js
  var WCSS = `
.g.ws{gap:10px}
.g.ws.due{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--due) 60%,transparent),0 0 22px color-mix(in srgb,var(--due) 25%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.hd.due .ic{background:var(--due);color:var(--due-fg);box-shadow:0 0 14px color-mix(in srgb,var(--due) 55%,transparent)}
.rows{display:flex;flex-direction:column;gap:6px}
.wr{display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:16px;min-width:0;
background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07);transition:background .25s,border-color .25s}
.wr,.cp .ic{--c:var(--nv-neutral);--cf:var(--nv-neutral-fg)}
.wr .ic,.cp .ic{background:var(--c);color:var(--cf)}
.wr.today{background:color-mix(in srgb,var(--c) 26%,transparent);border-color:color-mix(in srgb,var(--c) 60%,transparent)}
.wr.today .ic{box-shadow:0 0 14px color-mix(in srgb,var(--c) 60%,transparent)}
.wr.tomorrow{background:color-mix(in srgb,var(--c) 13%,transparent);border-color:color-mix(in srgb,var(--c) 35%,transparent)}
.rel{flex:none;font-size:12px;font-weight:600;padding:4px 10px;border-radius:999px;background:var(--nv-chip);white-space:nowrap}
.today .rel,.cp.today .rel{background:var(--nv-accent);color:var(--nv-accent-fg)}
.tomorrow .rel,.cp.tomorrow .rel{background:color-mix(in srgb,var(--nv-accent) 30%,transparent)}
.wr:active{transform:scale(.98)}
.cp{display:flex;align-items:center;gap:12px;min-width:0}
.cp .ics{display:flex;flex:none}
.cp .ic{width:44px;height:44px;border:2px solid rgba(20,24,38,.6)}
.cp .ic+.ic{margin-left:-14px}
.cp .ic ha-icon{--mdc-icon-size:24px}
.cp .nm b{font-weight:600;font-size:15px}.cp .nm small{font-size:12px;opacity:.65}
.cp.today .ic{box-shadow:0 0 14px color-mix(in srgb,var(--c) 60%,transparent)}
.msg{display:flex;align-items:center;gap:8px;font-size:13px;opacity:.7;padding:4px 2px}
.msg ha-icon{--mdc-icon-size:18px}`;
  var WDEF = { title: "Müllkalender", icon: "mdi:trash-can-outline", layout: "list", count: 5, days: 30, hide_unmatched: false, show_header: true, glow: true };
  var WTYPES = [
    { match: "Rest", name: "Restmüll", icon: "mdi:trash-can", color: "neutral" },
    { match: "Papier, PPK", name: "Papiertonne", icon: "mdi:newspaper-variant-outline", color: "accent-1" },
    { match: "Gelb, Wertstoff, Verpackung", name: "Gelber Sack", icon: "mdi:recycle", color: "accent-2" },
    { match: "Bio", name: "Biotonne", icon: "mdi:leaf", color: "accent-3" },
    { match: "Glas", name: "Altglas", icon: "mdi:bottle-wine-outline", color: "accent-4" }
  ];
  var DAY = 864e5;
  var HOUR = 36e5;
  var ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
  var dayNum = (s) => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / DAY;
  var calsOf = (c) => list(c.entities ?? c.entity).filter((id) => dom(id) === "calendar");
  function parseEvent(ev, cal, tz) {
    const raw = (x) => typeof x === "string" ? x : x?.date || x?.dateTime;
    const s = raw(ev?.start), e = raw(ev?.end);
    if (!s) return null;
    const summary = String(ev.summary ?? "").trim();
    if (ISO_DAY.test(s)) {
      const sd2 = dayNum(s), ed = e && ISO_DAY.test(e) ? dayNum(e) : sd2 + 1;
      return { cal, summary, sd: sd2, ld: Math.max(sd2, ed - 1), t: null };
    }
    const st = new Date(s);
    if (isNaN(st)) return null;
    const et = e ? new Date(e) : st, sd = dayNum(ymdIn(st, tz));
    const ld = isNaN(et) || et <= st ? sd : dayNum(ymdIn(new Date(et - 1), tz));
    return { cal, summary, sd, ld: Math.max(sd, ld), t: +st };
  }
  var ruleOf = (types, summary) => {
    const s = summary.toLowerCase();
    return types.find((r) => list(r.match).some((k) => s.includes(k.toLowerCase())));
  };
  var NovaWasteCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("waste-card-editor"));
    }
    static getStubConfig(h) {
      const cal = Object.keys(h.states).find((id) => id.startsWith("calendar."));
      return { ...cal ? { entities: [cal] } : {}, types: WTYPES.map((t) => ({ ...t })) };
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      const n = (v, d, min, max) => Number.isFinite(+v) && v !== "" && v != null ? Math.min(max, Math.max(min, Math.round(+v))) : d;
      this._c = {
        ...WDEF,
        ...c,
        count: n(c.count, WDEF.count, 1, 50),
        days: n(c.days, WDEF.days, 1, 366),
        types: [].concat(c.types || []).filter((t) => t && typeof t === "object" && list(t.match).length)
      };
      this._cals = calsOf(c);
      this._events = null;
      this._err = null;
      this._failed = [];
      this._key = null;
      this._fetched = false;
      if (this._h) {
        this._build();
        this._load();
      }
    }
    // Neu zeichnen nur, wenn sich ein Kalender geändert hat
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._e) this._build();
      if (!this._fetched) this._load();
      else if (hassChanged(old, h, this._cals)) this._render();
    }
    getCardSize() {
      return this._c?.layout === "compact" ? 1 : 1 + (this._c?.count || 5);
    }
    getGridOptions() {
      return { columns: 6, rows: "auto", min_columns: 3 };
    }
    connectedCallback() {
      clearInterval(this._tm);
      if (inPicker(this)) return;
      this._tm = setInterval(() => this._tick(), 6e4);
      if (this._e) this._tick();
    }
    disconnectedCallback() {
      clearInterval(this._tm);
      this._tm = null;
    }
    _today() {
      return dayNum(ymdIn(/* @__PURE__ */ new Date(), tzOf(this._h)));
    }
    _tick() {
      if (!this._h || !this._c) return;
      const stale = Date.now() - (this._last || 0) >= HOUR;
      const appeared = this._cals.some((id) => this._h.states[id] && !this._asked?.includes(id));
      if (this._fetched && (stale || appeared || this._today() !== this._fday)) this._load();
      else this._render();
    }
    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${WCSS}</style><div class="g ws">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<div class="body"></div></div>`;
      const q = (s) => r.querySelector(s);
      this._e = { g: q(".g"), hd: q(".hd"), ic: q(".hd .ic"), name: q(".hd b"), sub: q(".hd small"), body: q(".body") };
      this._key = null;
    }
    // Termine aller Kalender über die offizielle REST-API holen (GET /api/calendars/<id>?start=&end=)
    async _load() {
      const h = this._h, c = this._c;
      if (!h || !c) return;
      this._fetched = true;
      const id = this._fid = (this._fid || 0) + 1, tz = tzOf(h);
      this._last = Date.now();
      this._fday = this._today();
      const cals = this._asked = this._cals.filter((x) => h.states[x]);
      if (!cals.length) {
        this._events = [];
        this._failed = [];
        this._err = null;
        this._render();
        return;
      }
      const start = new Date(Date.now() - 2 * DAY).toISOString(), end = new Date(Date.now() + (c.days + 2) * DAY).toISOString();
      const qs = `?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
      const res = await Promise.allSettled(cals.map((cal) => h.callApi("GET", `calendars/${cal}${qs}`)));
      if (id !== this._fid) return;
      const ok2 = [], failed = [];
      res.forEach((x, i) => {
        if (x.status === "fulfilled" && Array.isArray(x.value)) ok2.push(...x.value.map((ev) => parseEvent(ev, cals[i], tz)).filter(Boolean));
        else {
          failed.push(cals[i]);
          console.warn("[nova-cards] Müllkalender: Termine nicht geladen", cals[i], x.reason);
        }
      });
      this._failed = failed;
      if (failed.length === cals.length) this._err = res[0].reason?.body?.message || res[0].reason?.message || "Verbindung fehlgeschlagen";
      else {
        this._err = null;
        this._events = ok2;
      }
      this._render();
    }
    // Anzeigbare Abholungen ab heute im eingestellten Zeitraum
    _items(today) {
      const c = this._c, seen = /* @__PURE__ */ new Set(), out = [];
      for (const ev of this._events || []) {
        if (ev.ld < today || ev.sd > today + c.days) continue;
        const day = Math.max(ev.sd, today), rule = ruleOf(c.types, ev.summary);
        if (!rule && c.hide_unmatched) continue;
        const name = rule?.name || ev.summary || "Abholung";
        const k = `${day}|${name.toLowerCase()}`;
        if (seen.has(k)) continue;
        seen.add(k);
        out.push({ day, d: day - today, name, icon: rule?.icon || c.icon, color: roleVars(rule?.color), t: ev.sd === day ? ev.t : null, cal: ev.cal });
      }
      return out.sort((a, b) => a.day - b.day || (a.t ?? -1) - (b.t ?? -1) || a.name.localeCompare(b.name));
    }
    _rel(d) {
      return d === 0 ? "heute" : d === 1 ? "morgen" : `in ${d} Tagen`;
    }
    _date(it) {
      const lang = langOf(this._h);
      let s;
      try {
        s = new Intl.DateTimeFormat(lang, { weekday: "short", day: "2-digit", month: "2-digit", timeZone: "UTC" }).format(new Date(it.day * DAY));
      } catch {
        s = new Date(it.day * DAY).toISOString().slice(0, 10);
      }
      if (it.t != null) try {
        s += " · " + new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit", timeZone: tzOf(this._h) }).format(new Date(it.t));
      } catch {
      }
      return s;
    }
    _render() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !e) return;
      const today = this._today(), found = this._cals.filter((id) => h.states[id]);
      let msg = null, items = [];
      if (!this._cals.length) msg = ["info", "mdi:calendar-alert", "Kein Kalender gewählt – im Editor einen Kalender (calendar.*) auswählen."];
      else if (!found.length) msg = ["error", "mdi:calendar-remove", `Kalender nicht gefunden: ${this._cals.join(", ")}`];
      else if (this._err && !this._events) msg = ["error", "mdi:alert-circle-outline", `Termine konnten nicht geladen werden: ${this._err}`];
      else if (!this._events) msg = ["", "mdi:timer-sand", "Termine werden geladen …"];
      else {
        items = this._items(today);
        if (!items.length) msg = ["", "mdi:calendar-check-outline", c.hide_unmatched && this._events.length ? `Keine passenden Abholungen in den nächsten ${c.days} Tagen` : `Keine Abholungen in den nächsten ${c.days} Tagen`];
      }
      const compact = c.layout === "compact";
      const shown = compact ? items.filter((it) => it.day === items[0]?.day) : items.slice(0, c.count);
      const warn = [...this._cals.filter((id) => !h.states[id]), ...this._failed].filter((x, i, a) => a.indexOf(x) === i);
      const key = JSON.stringify([msg, shown, warn, this._err && !!this._events, langOf(h), tzOf(h)]);
      if (key === this._key) return;
      this._key = key;
      const next = shown[0], due = next && next.d <= 1 ? next.color : null;
      e.g.classList.toggle("due", !!due && c.glow !== false);
      e.g.style.setProperty("--due", due?.c || "transparent");
      e.g.style.setProperty("--due-fg", due?.fg || "inherit");
      e.hd.hidden = compact || c.show_header === false;
      e.hd.classList.toggle("due", !!due);
      setIcon(e.ic, c.icon);
      e.name.textContent = c.title;
      e.sub.textContent = next ? `Nächste Abholung ${this._rel(next.d)}` : "";
      e.sub.hidden = !next;
      const body = [];
      if (msg) {
        const m = document.createElement("div");
        m.className = msg[0] ? `al ${msg[0]}` : "msg";
        m.innerHTML = `<ha-icon icon="${esc(msg[1])}"></ha-icon><span></span>`;
        m.lastChild.textContent = msg[2];
        body.push(m);
      } else if (compact) body.push(this._compact(shown));
      else {
        const rows = document.createElement("div");
        rows.className = "rows";
        rows.append(...shown.map((it) => this._row(it)));
        body.push(rows);
      }
      if (!msg && (warn.length || this._err)) {
        const m = document.createElement("div");
        m.className = "als chips";
        m.innerHTML = '<div class="al error"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span></span></div>';
        m.querySelector("span").textContent = this._err ? "Aktualisierung fehlgeschlagen – zeige letzten Stand" : `Nicht geladen: ${warn.join(", ")}`;
        body.push(m);
      }
      e.body.replaceChildren(...body);
    }
    _paint(el2, v) {
      el2.style.setProperty("--c", v.c);
      el2.style.setProperty("--cf", v.fg);
    }
    _cls(d) {
      return d === 0 ? " today" : d === 1 ? " tomorrow" : "";
    }
    _row(it) {
      const el2 = document.createElement("div");
      el2.className = "wr" + this._cls(it.d);
      this._paint(el2, it.color);
      el2.innerHTML = '<div class="ic"></div><div class="nm"><b></b><small></small></div><span class="rel"></span>';
      setIcon(el2.firstChild, it.icon);
      el2.querySelector("b").textContent = it.name;
      el2.querySelector("small").textContent = this._date(it);
      el2.querySelector(".rel").textContent = this._rel(it.d);
      press(el2, { tap: () => moreInfo(this, it.cal) });
      return el2;
    }
    // Kompakt: nur der nächste Abholtag, mehrere Müllarten an dem Tag nebeneinander
    _compact(shown) {
      const it = shown[0], el2 = document.createElement("div");
      el2.className = "cp" + this._cls(it.d);
      el2.innerHTML = '<div class="ics"></div><div class="nm"><b></b><small></small></div><span class="rel"></span>';
      el2.firstChild.append(...shown.map((x) => {
        const ic = document.createElement("div");
        ic.className = "ic";
        this._paint(ic, x.color);
        setIcon(ic, x.icon);
        return ic;
      }));
      el2.querySelector("b").textContent = shown.map((x) => x.name).join(" · ");
      el2.querySelector("small").textContent = this._date(it);
      el2.querySelector(".rel").textContent = this._rel(it.d);
      press(el2, { tap: () => moreInfo(this, it.cal) });
      return el2;
    }
  };
  define("waste-card", NovaWasteCard, { name: "Nova Müllkalender Card", description: "Nächste Müllabholungen aus einem oder mehreren Kalendern – mit Müllart, Icon, Farbe, Datum und „heute / morgen / in X Tagen“.", documentationURL: docUrl("nova-müllkalender-card") });
  var WGEN = [
    { name: "entities", required: true, selector: { entity: { domain: "calendar", multiple: true } } },
    g2({ name: "title", selector: T }, { name: "icon", selector: I })
  ];
  var WDATES = (c) => [
    g2(sel("layout", [["list", "Liste"], ["compact", "Kompakt (nur nächster Termin)"]]), { name: "days", selector: { number: { min: 1, max: 366, mode: "box", unit_of_measurement: "Tage" } } }),
    ...c.layout === "compact" ? [] : [g2({ name: "count", selector: { number: { min: 1, max: 20, mode: "box" } } }, { name: "show_header", selector: { boolean: {} } })],
    { name: "hide_unmatched", selector: { boolean: {} } }
  ];
  var WLOOK = [{ name: "glow", selector: { boolean: {} } }];
  var WTYPE = [
    g2({ name: "match", required: true, selector: T }, { name: "name", selector: T }),
    g2({ name: "icon", selector: I }, ROLE("color"))
  ];
  var WLABELS = {
    ...BASE_LABELS,
    entities: "Kalender",
    title: "Überschrift",
    layout: "Darstellung",
    count: "Anzahl Termine",
    days: "Zeitraum",
    hide_unmatched: "Termine ohne passende Müllart ausblenden",
    show_header: "Kopfzeile anzeigen",
    glow: "Rahmen leuchtet bei Abholung heute/morgen",
    match: "Stichwort im Termintitel",
    name: "Anzeigename",
    color: "Farbrolle"
  };
  var WHELPERS = {
    entities: "Ein oder mehrere Kalender, z. B. ein iCal-Abfallkalender",
    days: "So weit im Voraus werden Termine geholt",
    icon: "Leer = Icon der Karte",
    match: "Groß/Klein egal, mehrere mit Komma: Papier, PPK",
    name: "Leer = Termintitel",
    color: "Farben kommen aus dem Theme (--nova-accent-1 … 4, --nova-neutral)"
  };
  var NovaWasteCardEditor = class extends NovaEditorBase {
    _ilabel(it, j) {
      return `${j + 1}. ${it.name || it.match || "Neu: Müllart"}`;
    }
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), data = { ...WDEF, ...c0, entities: calsOf(c0) };
      const strip2 = (c) => {
        if (c.entities === void 0 && c.entity !== void 0) c.entities = calsOf(c);
        Object.entries(WDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        delete c.entity;
        delete c.refresh;
        return c;
      };
      const form = (schema) => this._form(schema, data, (v) => this._emit(strip2(merge(this._config, names(schema), v))));
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(WGEN))),
        this._section("dates", "mdi:calendar-clock", "Termine", (b) => b.append(form(WDATES(data)))),
        this._section("types", "mdi:trash-can-outline", "Müllarten", (b) => {
          b.append(this._hint("Die erste Regel, deren Stichwort im Termintitel vorkommt, bestimmt Name, Icon und Farbe."));
          this._itemList(b, "types", WTYPE, { item: "Müllart", icon: "mdi:trash-can-outline" }, "Müllart hinzufügen");
          if (!this._items("types").length) b.append(this._add("Standard-Müllarten einfügen", () => {
            this._setItems("types", WTYPES.map((t) => ({ ...t })));
            this._rebuild();
          }));
        }),
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(WLOOK)))
      );
    }
    // Darstellung geändert → Termin-Felder neu aufbauen
    _emit(c) {
      const was = this._config;
      super._emit(c);
      if (c.layout !== was?.layout) this._rebuild();
    }
  };
  __publicField(NovaWasteCardEditor, "labels", WLABELS);
  __publicField(NovaWasteCardEditor, "helpers", WHELPERS);
  __publicField(NovaWasteCardEditor, "openSections", ["general"]);
  define("waste-card-editor", NovaWasteCardEditor);

  // src/weather.js
  var WCSS2 = `
.g.wt{gap:14px}
.clk{text-align:center;padding:2px 0 12px;border-bottom:1px solid rgba(255,255,255,.1)}
.clk .dt{font-size:14px;opacity:.75;margin-top:2px}
.clk .tm{font-size:64px;font-weight:300;letter-spacing:-.04em;line-height:1.05;font-variant-numeric:tabular-nums}
.cur{display:flex;align-items:center;gap:14px;min-width:0;border-radius:18px}
.cur .ic{width:64px;height:64px;background:var(--c);color:var(--cf);box-shadow:0 0 22px color-mix(in srgb,var(--c) 45%,transparent)}
.cur .ic ha-icon{--mdc-icon-size:36px}.cur .ic img{width:40px;height:40px}
.cur:active .ic{transform:scale(.94)}
.tx{flex:1;min-width:0;display:flex;flex-direction:column;gap:3px}
.tx .t{font-size:38px;font-weight:600;line-height:1;letter-spacing:-.02em;white-space:nowrap}
.tx b,.tx small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.tx b{font-weight:500;font-size:14.5px}.tx small{font-size:12px;opacity:.65}
.pills.det .pill{cursor:default}
.pill .lb{opacity:.65}
.fc{display:flex;flex-direction:column;gap:14px}
.sec{display:flex;flex-direction:column;gap:2px;padding-top:12px;border-top:1px solid rgba(255,255,255,.1)}
.sec>.bt{margin-bottom:6px}
.wi{--c:var(--nv-neutral);color:var(--c)}
.day{display:grid;grid-template-columns:minmax(42px,auto) 22px 34px minmax(30px,1fr) 34px;align-items:center;gap:8px;font-size:13px;padding:5px 0}
.day.pp{grid-template-columns:minmax(42px,auto) 22px 34px minmax(30px,1fr) 34px 54px}
.day.nb{grid-template-columns:minmax(42px,1fr) 22px 34px 34px}
.day.nb.pp{grid-template-columns:minmax(42px,1fr) 22px 34px 34px 54px}
.day .wi{--mdc-icon-size:20px}
.day .d{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.day .lo{opacity:.6}.day .lo,.day .hi{text-align:right}.day .hi{font-weight:600}
.day .p{text-align:right;font-size:12px;opacity:.7;white-space:nowrap}
.rb{height:6px;border-radius:3px;background:rgba(255,255,255,.12);position:relative}
.rb i{position:absolute;top:0;bottom:0;border-radius:3px;background:linear-gradient(90deg,var(--nv-a1),var(--nv-a2))}
.spk{width:100%;height:48px;display:block;margin-bottom:6px}
.hcols{display:grid;grid-template-columns:repeat(var(--n),minmax(0,1fr));text-align:center}
.hcols>div{display:flex;flex-direction:column;align-items:center;gap:4px;font-size:12px;min-width:0}
.hcols .wi{--mdc-icon-size:20px}.hcols b{font-size:13px}.hcols small{opacity:.6;white-space:nowrap}
.hr{display:grid;grid-template-columns:44px 20px 36px 1fr 40px;align-items:center;gap:8px;font-size:12.5px;padding:4px 0}
.hr .wi{--mdc-icon-size:18px}.hr .p{text-align:right;opacity:.7}
.hr .rb{height:8px;border-radius:4px}
.hr .dot{position:absolute;top:-3px;width:14px;height:14px;border-radius:50%;background:#fff;transform:translateX(-50%);box-shadow:0 1px 4px rgba(0,0,0,.4)}
.fmsg{display:flex;align-items:center;gap:8px;font-size:12.5px;opacity:.7;padding:4px 0}
.fmsg.err{color:var(--nv-error);opacity:1}
.fmsg ha-icon{--mdc-icon-size:18px}
@container (max-width:280px){.clk .tm{font-size:48px}.tx .t{font-size:32px}.cur .ic{width:54px;height:54px}.cur .ic ha-icon{--mdc-icon-size:30px}
.day,.day.pp{grid-template-columns:minmax(36px,auto) 20px 30px minmax(20px,1fr) 30px}.day .p{display:none}}`;
  var CICON = {
    "clear-night": "mdi:weather-night",
    cloudy: "mdi:weather-cloudy",
    exceptional: "mdi:alert-circle-outline",
    fog: "mdi:weather-fog",
    hail: "mdi:weather-hail",
    lightning: "mdi:weather-lightning",
    "lightning-rainy": "mdi:weather-lightning-rainy",
    partlycloudy: "mdi:weather-partly-cloudy",
    pouring: "mdi:weather-pouring",
    rainy: "mdi:weather-rainy",
    snowy: "mdi:weather-snowy",
    "snowy-rainy": "mdi:weather-snowy-rainy",
    sunny: "mdi:weather-sunny",
    windy: "mdi:weather-windy",
    "windy-variant": "mdi:weather-windy-variant"
  };
  var NIGHT = { partlycloudy: "mdi:weather-night-partly-cloudy", sunny: "mdi:weather-night" };
  var condIcon = (cond, night) => night && NIGHT[cond] || CICON[cond] || "mdi:weather-cloudy";
  var CROLE = {
    sunny: "accent-2",
    partlycloudy: "accent-2",
    "clear-night": "accent-1",
    rainy: "accent-1",
    pouring: "accent-1",
    snowy: "accent-1",
    "snowy-rainy": "accent-1",
    hail: "accent-1",
    lightning: "accent-2",
    "lightning-rainy": "accent-2",
    exceptional: "accent-3"
  };
  var DETAILS = {
    humidity: { label: "Luftfeuchte", icon: "mdi:water-percent", attr: "humidity", unit: "%", dec: 0 },
    wind: { label: "Wind", icon: "mdi:weather-windy", attr: "wind_speed", unitAttr: "wind_speed_unit", dec: 0, dir: true },
    wind_gust: { label: "Böen", icon: "mdi:weather-windy-variant", attr: "wind_gust_speed", unitAttr: "wind_speed_unit", dec: 0 },
    pressure: { label: "Luftdruck", icon: "mdi:gauge", attr: "pressure", unitAttr: "pressure_unit", dec: 0 },
    uv_index: { label: "UV-Index", icon: "mdi:white-balance-sunny", attr: "uv_index", dec: 1 },
    cloud_coverage: { label: "Bewölkung", icon: "mdi:cloud-percent-outline", attr: "cloud_coverage", unit: "%", dec: 0 },
    dew_point: { label: "Taupunkt", icon: "mdi:thermometer-water", attr: "dew_point", unitAttr: "temperature_unit", dec: 1 },
    visibility: { label: "Sichtweite", icon: "mdi:eye-outline", attr: "visibility", unitAttr: "visibility_unit", dec: 1 },
    ozone: { label: "Ozon", icon: "mdi:molecule", attr: "ozone", dec: 0 }
  };
  var DIRS = ["N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW"];
  var dirOf = (b) => {
    const n = parseFloat(b);
    return Number.isFinite(n) ? DIRS[Math.round((n % 360 + 360) % 360 / 22.5) % 16] : typeof b === "string" ? b : "";
  };
  var FC = { daily: 1, hourly: 2 };
  var FC_NAME = { daily: "Tagesvorhersage", hourly: "Stundenvorhersage" };
  var WDEF2 = {
    show_clock: false,
    show_date: false,
    show_name: true,
    show_feels_like: true,
    show_high_low: true,
    show_details: true,
    details: ["humidity", "wind", "pressure"],
    color: "auto",
    label_details: false,
    show_daily: true,
    days: 7,
    daily_bar: true,
    show_hourly: false,
    hours: 24,
    hour_step: 3,
    hourly_layout: "columns",
    hourly_graph: true,
    hourly_first: false,
    show_probability: true,
    show_precipitation: true,
    show_titles: true
  };
  var off = (p) => {
    if (p._off) return;
    p._off = true;
    p.then((u) => typeof u === "function" && u()).catch(() => {
    });
  };
  var isNum = (v) => v !== "" && v != null && Number.isFinite(+v);
  var clamp = (v, d, min, max) => isNum(v) ? Math.min(max, Math.max(min, Math.round(+v))) : d;
  var NovaWeatherCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("weather-card-editor"));
    }
    static getStubConfig(h) {
      const w = Object.keys(h.states).find((id) => id.startsWith("weather."));
      return w ? { entity: w } : {};
    }
    constructor() {
      super();
      this._subs = [];
      this._fc = {};
      this._fcErr = {};
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      this._c = {
        ...WDEF2,
        ...c,
        details: [].concat(c.details ?? WDEF2.details).filter((k) => DETAILS[k]),
        days: clamp(c.days, WDEF2.days, 1, 14),
        hours: clamp(c.hours, WDEF2.hours, 1, 72),
        hour_step: clamp(c.hour_step, WDEF2.hour_step, 1, 12)
      };
      this._ids = [...entityIds(c), "sun.sun"];
      this._key = null;
      if (this._h) {
        this._sub();
        this._render();
      }
    }
    // Neu zeichnen nur, wenn sich die Wetter-Entität, ein Sensor der Karte oder die Sonne geändert hat
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._e) this._build();
      else if (this._key != null && !hassChanged(old, h, this._ids)) return;
      this._sub();
      this._render();
    }
    // In der Kartenauswahl: Uhr ohne Takt, Vorhersage nur einmal holen
    connectedCallback() {
      this._quiet = inPicker(this);
      if (this._h && this._c) {
        if (!this._e) this._build();
        this._sub();
        this._render();
      }
    }
    disconnectedCallback() {
      this._unsub();
      clearInterval(this._tm);
      this._tm = null;
    }
    getCardSize() {
      const c = this._c || WDEF2;
      return 2 + (c.show_clock || c.show_date ? 2 : 0) + (c.show_details !== false ? 1 : 0) + (c.show_daily !== false ? Math.ceil(c.days * 0.7) : 0) + (c.show_hourly ? 3 : 0);
    }
    getGridOptions() {
      return { columns: 6, rows: "auto", min_columns: 3 };
    }
    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${WCSS2}</style><div class="g wt">
<div class="clk"><div class="tm"></div><div class="dt"></div></div>
<div class="bt"></div>
<div class="cur"><div class="ic"></div><div class="tx"><span class="t"></span><b></b><small></small></div></div>
<div class="pills det"></div><div class="fc"></div><div class="msg"></div></div>`;
      const q = (s) => r.querySelector(s);
      this._e = { g: q(".g"), clk: q(".clk"), dt: q(".clk .dt"), tm: q(".clk .tm"), bt: q(".bt"), cur: q(".cur"), ic: q(".cur .ic"), t: q(".t"), cd: q(".tx b"), fl: q(".tx small"), det: q(".det"), fc: q(".fc"), msg: q(".msg") };
      const c = () => ({ entity: this._c.entity, tap_action: this._c.tap_action, hold_action: this._c.hold_action });
      press(this._e.cur, { tap: () => runAction(this, c(), "tap", true), hold: () => runAction(this, c(), "hold") });
      this._key = null;
    }
    // Uhr und Datum wie im HA-Profil (Sprache, Zeitzone); läuft nur, solange die Karte angezeigt wird
    _clock() {
      const c = this._c, e = this._e, h = this._h;
      if (!e || !h) return;
      const on = !!(c.show_clock || c.show_date) && this.isConnected && !this._quiet;
      if (on && !this._tm) this._tm = setInterval(() => this._clock(), 1e4);
      if (!on && this._tm) {
        clearInterval(this._tm);
        this._tm = null;
      }
      e.clk.hidden = !(c.show_clock || c.show_date);
      if (e.clk.hidden) return;
      const now = /* @__PURE__ */ new Date(), lang = langOf(h), tz = tzOf(h);
      const fmt = (o) => {
        try {
          return new Intl.DateTimeFormat(lang, { ...o, timeZone: tz }).format(now);
        } catch {
          return new Intl.DateTimeFormat(lang, o).format(now);
        }
      };
      e.dt.hidden = !c.show_date;
      e.tm.hidden = !c.show_clock;
      if (c.show_date) e.dt.textContent = fmt({ weekday: "long", day: "numeric", month: "long" });
      if (c.show_clock) e.tm.textContent = fmt({ hour: "2-digit", minute: "2-digit" });
    }
    /* Vorhersage: weather/subscribe_forecast, je Art (täglich/stündlich) ein Abo, nur solange die Karte angezeigt wird */
    _needs() {
      const c = this._c;
      return [c.show_daily !== false || c.show_high_low !== false ? "daily" : null, c.show_hourly ? "hourly" : null].filter(Boolean);
    }
    _sub() {
      const h = this._h, c = this._c;
      if (!h?.connection || !c || !this.isConnected) return;
      const s = c.entity && h.states[c.entity];
      const types = s ? this._needs().filter((t) => hasF(s, FC[t])) : [];
      const key = JSON.stringify([c.entity, types]);
      if (key === this._subKey) return;
      this._unsub();
      this._subKey = key;
      types.forEach((t) => {
        const p = h.connection.subscribeMessage((ev) => {
          if (this._subKey !== key) return;
          this._fc[t] = ev?.forecast || [];
          this._render();
          if (this._quiet) off(p);
        }, { type: "weather/subscribe_forecast", forecast_type: t, entity_id: c.entity });
        p.catch((err) => {
          if (this._subKey !== key) return;
          this._fcErr[t] = err?.message || err?.code || "unbekannter Fehler";
          console.warn("[nova-cards] Wetter: Vorhersage nicht geladen", c.entity, t, err);
          this._render();
        });
        this._subs.push(p);
      });
    }
    _unsub() {
      this._subs.forEach(off);
      this._subs = [];
      this._fc = {};
      this._fcErr = {};
      this._subKey = null;
    }
    // Zahl mit Komma nach Sprache aus dem HA-Profil; dec = max. Nachkommastellen, fixed = immer genau dec
    _num(v, dec, fixed) {
      try {
        return new Intl.NumberFormat(langOf(this._h), { maximumFractionDigits: dec, minimumFractionDigits: fixed ? dec : 0, useGrouping: false }).format(+v);
      } catch {
        return String(v);
      }
    }
    // Temperatur: eigener Sensor (optional), sonst Attribut der Wetter-Entität
    _temp(ent, s, attr) {
      const h = this._h, c = this._c, dec = c.decimals ?? 1, fx = c.decimals != null, o = ent && h.states[ent];
      if (ent) return o && isNum(o.state) ? unitJoin(this._num(o.state, dec, fx), o.attributes.unit_of_measurement || s?.attributes.temperature_unit) : null;
      const v = s?.attributes[attr];
      return isNum(v) ? unitJoin(this._num(v, dec, fx), s.attributes.temperature_unit) : null;
    }
    _deg(v) {
      return isNum(v) ? `${this._num(v, 0)}°` : "–";
    }
    _role(cond) {
      const c = this._c.color;
      return c === "auto" || !c ? CROLE[cond] || "neutral" : c;
    }
    _icon(s) {
      if (this._c.icon) return this._c.icon;
      return condIcon(s.state, this._h.states["sun.sun"]?.state === "below_horizon");
    }
    _details(s) {
      return this._c.details.map((k) => {
        const d = DETAILS[k], v = s.attributes[d.attr];
        if (!isNum(v)) return null;
        let val = unitJoin(this._num(v, d.dec), d.unit ?? s.attributes[d.unitAttr]);
        if (d.dir && s.attributes.wind_bearing != null) val += ` ${dirOf(s.attributes.wind_bearing)}`;
        return { k, icon: d.icon, label: d.label, val };
      }).filter(Boolean);
    }
    // Regenwahrscheinlichkeit / Niederschlag eines Vorhersage-Eintrags, je nach Einstellung
    _rain(x, s) {
      const c = this._c, out = [];
      if (c.show_probability !== false && isNum(x.precipitation_probability)) out.push(`${this._num(x.precipitation_probability, 0)} %`);
      if (c.show_precipitation !== false && isNum(x.precipitation) && +x.precipitation > 0) out.push(unitJoin(this._num(x.precipitation, 1), s.attributes.precipitation_unit || "mm"));
      return out.join(" · ");
    }
    // Zustand einer Vorhersage-Art: {list} oder {msg: [Icon, Text], err}
    _fcState(t, s) {
      if (!hasF(s, FC[t])) return { msg: ["mdi:weather-cloudy-alert", `${s.attributes.friendly_name || this._c.entity} liefert keine ${FC_NAME[t]}`] };
      if (this._fcErr[t]) return { msg: ["mdi:alert-circle-outline", `${FC_NAME[t]} konnte nicht geladen werden: ${this._fcErr[t]}`], err: true };
      if (!this._fc[t]) return { msg: ["mdi:timer-sand", `${FC_NAME[t]} wird geladen …`] };
      if (!this._fc[t].length) return { msg: ["mdi:weather-cloudy-alert", `Keine ${FC_NAME[t]} vorhanden`] };
      return { list: this._fc[t] };
    }
    _dailyView(s, tz, lang) {
      const st = this._fcState("daily", s);
      if (!st.list) return st;
      const today = ymdIn(/* @__PURE__ */ new Date(), tz);
      const days = st.list.slice(0, this._c.days).map((x) => {
        const d = new Date(x.datetime);
        let label;
        if (ymdIn(d, tz) === today) label = "Heute";
        else try {
          label = new Intl.DateTimeFormat(lang, { weekday: "short", timeZone: tz }).format(d);
        } catch {
          label = String(x.datetime).slice(5, 10);
        }
        const hi = isNum(x.temperature) ? +x.temperature : null, lo = isNum(x.templow) ? +x.templow : hi;
        return { label, icon: condIcon(x.condition), role: this._role(x.condition), hi, lo, rain: this._rain(x, s) };
      });
      const vals = days.flatMap((x) => [x.lo, x.hi]).filter((v) => v != null);
      return { days, min: Math.min(...vals), max: Math.max(...vals) };
    }
    _hourlyView(s, tz, lang) {
      const st = this._fcState("hourly", s);
      if (!st.list) return st;
      const c = this._c, list2 = st.list.slice(0, c.hours);
      const hours = list2.filter((_, i) => i % c.hour_step === 0).map((x) => {
        let label;
        try {
          label = new Intl.DateTimeFormat(lang, { hour: "2-digit", minute: "2-digit", timeZone: tz }).format(new Date(x.datetime));
        } catch {
          label = String(x.datetime).slice(11, 16);
        }
        return { label, icon: condIcon(x.condition, x.is_daytime === false), role: this._role(x.condition), t: isNum(x.temperature) ? +x.temperature : null, rain: this._rain(x, s) };
      });
      const pts = c.hourly_graph !== false ? list2.filter((x) => isNum(x.temperature)).map((x) => [new Date(x.datetime).getTime(), +x.temperature]) : null;
      const ts = hours.map((x) => x.t).filter((v) => v != null);
      return { hours, pts, min: Math.min(...ts), max: Math.max(...ts) };
    }
    _render() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !e) return;
      this._clock();
      const s = c.entity && h.states[c.entity];
      let msg = null;
      if (!c.entity) msg = ["info", "mdi:weather-cloudy-alert", "Keine Wetter-Entität gewählt – im Editor eine weather.*-Entität auswählen."];
      else if (!s) msg = ["error", "mdi:alert-circle-outline", `Entität nicht gefunden: ${c.entity}`];
      const na = !!s && ["unavailable", "unknown"].includes(s.state);
      const lang = langOf(h), tz = tzOf(h);
      let view = { msg };
      if (!msg) {
        const daily = (c.show_daily !== false || c.show_high_low !== false) && !na ? this._dailyView(s, tz, lang) : null;
        const today = daily?.days?.[0]?.label === "Heute" ? daily.days[0] : null;
        view = {
          name: nameOf(h, c),
          icon: this._icon(s),
          cond: na ? "Nicht verfügbar" : fmtState(h, s),
          t: this._temp(c.temperature_entity, s, "temperature"),
          fl: c.show_feels_like !== false ? this._temp(c.feels_like_entity, s, "apparent_temperature") : null,
          hl: c.show_high_low !== false && today ? `↑ ${this._deg(today.hi)}  ↓ ${this._deg(today.lo)}` : null,
          det: c.show_details !== false && !na ? this._details(s) : [],
          role: this._role(s.state),
          na,
          daily: c.show_daily !== false ? daily : null,
          hourly: c.show_hourly && !na ? this._hourlyView(s, tz, lang) : null
        };
      }
      const key = JSON.stringify([view, c.show_name, c.label_details, c.daily_bar, c.hourly_layout, c.hourly_first, c.show_titles, c.hours]);
      if (key === this._key) return;
      this._key = key;
      e.msg.hidden = !msg;
      e.cur.hidden = !!msg;
      e.det.hidden = true;
      e.bt.hidden = true;
      e.fc.hidden = true;
      if (msg) {
        e.msg.className = `al ${msg[0]}`;
        e.msg.innerHTML = `<ha-icon icon="${esc(msg[1])}"></ha-icon><span></span>`;
        e.msg.lastChild.textContent = msg[2];
        return;
      }
      e.bt.hidden = c.show_name === false || !view.name;
      e.bt.textContent = view.name;
      const rv = roleVars(view.role);
      e.cur.style.setProperty("--c", rv.c);
      e.cur.style.setProperty("--cf", rv.fg);
      e.cur.classList.toggle("na", view.na);
      setIcon(e.ic, view.icon);
      e.t.textContent = view.t ?? "–";
      e.cd.textContent = view.cond;
      const sub = [view.fl && `Gefühlt ${view.fl}`, view.hl].filter(Boolean).join("  ·  ");
      e.fl.textContent = sub;
      e.fl.hidden = !sub;
      e.det.hidden = !view.det.length;
      e.det.replaceChildren(...view.det.map((d) => {
        const p = document.createElement("div");
        p.className = "pill";
        p.title = d.label;
        p.innerHTML = `<ha-icon icon="${esc(d.icon)}"></ha-icon>${c.label_details ? '<span class="lb"></span>' : ""}<span class="v"></span>`;
        if (c.label_details) p.querySelector(".lb").textContent = d.label;
        p.querySelector(".v").textContent = d.val;
        return p;
      }));
      const secs = [view.daily && this._dailyHtml(view.daily), view.hourly && this._hourlyHtml(view.hourly)];
      if (c.hourly_first) secs.reverse();
      e.fc.innerHTML = secs.filter(Boolean).join("");
      e.fc.hidden = !e.fc.innerHTML;
    }
    _title(t) {
      return this._c.show_titles !== false ? `<div class="bt">${esc(t)}</div>` : "";
    }
    _fmsg(m) {
      return `<div class="fmsg${m.err ? " err" : ""}"><ha-icon icon="${esc(m.msg[0])}"></ha-icon><span>${esc(m.msg[1])}</span></div>`;
    }
    _wi(icon, role) {
      return `<ha-icon class="wi" icon="${esc(icon)}" style="--c:${roleVars(role).c}"></ha-icon>`;
    }
    _dailyHtml(v) {
      const c = this._c;
      if (!v.days) return `<div class="sec">${this._title(FC_NAME.daily)}${this._fmsg(v)}</div>`;
      const bar = c.daily_bar !== false, rain = v.days.some((x) => x.rain), rg = v.max - v.min || 1;
      const rows = v.days.map((x) => {
        const l = ((x.lo ?? v.min) - v.min) / rg * 100, w = Math.max(4, ((x.hi ?? v.max) - (x.lo ?? v.min)) / rg * 100);
        return `<div class="day${bar ? "" : " nb"}${rain ? " pp" : ""}"><span class="d">${esc(x.label)}</span>${this._wi(x.icon, x.role)}<span class="lo">${this._deg(x.lo)}</span>${bar ? `<div class="rb"><i style="left:${Math.min(96, l).toFixed(1)}%;width:${Math.min(100 - Math.min(96, l), w).toFixed(1)}%"></i></div>` : ""}<span class="hi">${this._deg(x.hi)}</span>${rain ? `<span class="p">${esc(x.rain)}</span>` : ""}</div>`;
      }).join("");
      return `<div class="sec">${this._title(v.days.length === 1 ? "Heute" : `Nächste ${v.days.length} Tage`)}${rows}</div>`;
    }
    _hourlyHtml(v) {
      const c = this._c;
      if (!v.hours) return `<div class="sec">${this._title(FC_NAME.hourly)}${this._fmsg(v)}</div>`;
      const title = this._title(`Nächste ${c.hours} Stunden`), graph = v.pts ? sparkline(v.pts, { h: 48 }) : "";
      if (c.hourly_layout === "list") {
        const rg = v.max - v.min || 1;
        const rows = v.hours.map((x) => `<div class="hr"><span>${esc(x.label)}</span>${this._wi(x.icon, x.role)}<span>${this._deg(x.t)}</span><div class="rb">${x.t != null ? `<div class="dot" style="left:${(8 + (x.t - v.min) / rg * 84).toFixed(1)}%"></div>` : ""}</div><span class="p">${esc(x.rain)}</span></div>`).join("");
        return `<div class="sec">${title}${graph}${rows}</div>`;
      }
      const cols = v.hours.map((x) => `<div><small>${esc(x.label)}</small>${this._wi(x.icon, x.role)}<b>${this._deg(x.t)}</b>${x.rain ? `<small>${esc(x.rain)}</small>` : ""}</div>`).join("");
      return `<div class="sec">${title}${graph}<div class="hcols" style="--n:${v.hours.length}">${cols}</div></div>`;
    }
  };
  define("weather-card", NovaWeatherCard, { name: "Nova Wetter Card", description: "Aktuelles Wetter einer weather.*-Entität mit Tages- und Stundenvorhersage – Icon, Temperatur, Zustand, Max/Min, Regen und Werte wie Luftfeuchte, Wind und Luftdruck.", documentationURL: docUrl("nova-wetter-card") });
  var TSENS = { entity: { domain: "sensor", device_class: "temperature" } };
  var BOOL = (n) => ({ name: n, selector: { boolean: {} } });
  var NUMB = (n, min, max, unit) => ({ name: n, selector: { number: { min, max, mode: "box", ...unit ? { unit_of_measurement: unit } : {} } } });
  var S_GEN2 = [
    { name: "entity", required: true, selector: { entity: { domain: "weather" } } },
    g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } }),
    BOOL("show_name"),
    g2(BOOL("show_clock"), BOOL("show_date"))
  ];
  var S_CUR = (c) => [
    { name: "temperature_entity", selector: TSENS },
    g2(BOOL("show_feels_like"), BOOL("show_high_low")),
    ...c.show_feels_like !== false ? [{ name: "feels_like_entity", selector: TSENS }] : [],
    NUMB("decimals", 0, 2)
  ];
  var S_DET = (c) => [
    BOOL("show_details"),
    ...c.show_details !== false ? [
      BOOL("label_details"),
      { name: "details", selector: { select: { multiple: true, mode: "list", options: Object.entries(DETAILS).map(([value, d]) => ({ value, label: d.label })) } } }
    ] : []
  ];
  var S_DAY = (c) => [BOOL("show_daily"), ...c.show_daily !== false ? [g2(NUMB("days", 1, 14, "Tage"), BOOL("daily_bar"))] : []];
  var S_HOUR = (c) => [
    BOOL("show_hourly"),
    ...c.show_hourly ? [
      g2(sel("hourly_layout", [["columns", "Spalten"], ["list", "Liste mit Balken"]]), BOOL("hourly_graph")),
      g2(NUMB("hours", 1, 72, "h"), NUMB("hour_step", 1, 12, "h"))
    ] : []
  ];
  var S_RAIN = [g2(BOOL("show_probability"), BOOL("show_precipitation"))];
  var S_LOOK2 = (c) => [
    sel("color", [["auto", "Automatisch (nach Wetter)"], ["neutral", "Neutral"], ["accent-1", "Akzent 1"], ["accent-2", "Akzent 2"], ["accent-3", "Akzent 3"], ["accent-4", "Akzent 4"]]),
    ...c.show_daily !== false || c.show_hourly ? [g2(BOOL("show_titles"), ...c.show_daily !== false && c.show_hourly ? [BOOL("hourly_first")] : [])] : []
  ];
  var S_ACT2 = [g2({ name: "tap_action", selector: A }, { name: "hold_action", selector: A })];
  var VIS2 = ["entity", "show_feels_like", "show_details", "show_daily", "show_hourly"];
  var WLABELS2 = {
    ...BASE_LABELS,
    entity: "Wetter-Entität",
    show_clock: "Uhr anzeigen",
    show_date: "Datum anzeigen",
    name: "Name",
    temperature_entity: "Temperatur-Sensor (optional)",
    feels_like_entity: "Sensor gefühlte Temperatur (optional)",
    show_name: "Name anzeigen",
    show_feels_like: "Gefühlte Temperatur anzeigen",
    show_high_low: "Max/Min von heute anzeigen",
    color: "Farbrolle Icons",
    decimals: "Nachkommastellen Temperatur",
    show_details: "Zusatzwerte anzeigen",
    label_details: "Zusatzwerte beschriften",
    details: "Zusatzwerte",
    show_daily: "Tagesvorhersage anzeigen",
    days: "Anzahl Tage",
    daily_bar: "Temperatur-Balken",
    show_hourly: "Stundenvorhersage anzeigen",
    hourly_layout: "Darstellung",
    hours: "Zeitraum",
    hour_step: "Abstand",
    hourly_graph: "Temperaturkurve",
    show_probability: "Regenwahrscheinlichkeit",
    show_precipitation: "Niederschlagsmenge",
    show_titles: "Überschriften",
    hourly_first: "Stunden vor Tagen"
  };
  var WHELPERS2 = {
    icon: "Leer = Icon passend zum Wetter",
    show_clock: "Große Uhr über dem Wetter",
    temperature_entity: "Leer = Temperatur der Wetter-Entität",
    feels_like_entity: "Leer = Attribut „apparent_temperature“, falls die Wetter-Entität es liefert",
    color: "Farben kommen aus dem Theme (--nova-accent-1 … 4, --nova-neutral); „Automatisch“ färbt jedes Icon nach seinem Wetter",
    decimals: "Leer = bis zu 1 Nachkommastelle",
    details: "Werte, die die Wetter-Entität nicht liefert, werden ausgelassen",
    show_high_low: "Aus der Tagesvorhersage",
    hour_step: "Jede wievielte Stunde angezeigt wird",
    show_probability: "Nur wenn die Vorhersage sie liefert",
    tap_action: "Standard: Details der Wetter-Entität"
  };
  var NovaWeatherCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), data = { ...WDEF2, ...c0 };
      const strip2 = (c) => {
        Object.entries(WDEF2).forEach(([k, x]) => JSON.stringify(c[k]) === JSON.stringify(x) && delete c[k]);
        return c;
      };
      const form = (schema) => this._form(schema, data, (v) => this._emit(strip2(merge(this._config, names(schema), v))));
      const s = this._hass?.states[c0.entity];
      const none = (t) => s && !hasF(s, FC[t]) ? [this._hint(`Diese Entität liefert keine ${FC_NAME[t]}.`)] : [];
      const fc = data.show_daily !== false || data.show_hourly;
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(S_GEN2))),
        this._section("current", "mdi:weather-partly-cloudy", "Aktuelles Wetter", (b) => b.append(form(S_CUR(data)))),
        this._section("details", "mdi:water-percent", "Zusatzwerte", (b) => b.append(form(S_DET(data)))),
        this._section("forecast", "mdi:calendar-week", "Vorhersage", (b) => {
          b.append(this._h4(FC_NAME.daily), ...none("daily"), form(S_DAY(data)), this._h4(FC_NAME.hourly), ...none("hourly"), form(S_HOUR(data)));
          if (fc) b.append(this._h4("Regen"), form(S_RAIN));
        }),
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(S_LOOK2(data)))),
        this._section("actions", "mdi:gesture-tap", "Aktionen", (b) => b.append(form(S_ACT2)))
      );
    }
    // Entität oder ein Schalter für abhängige Felder geändert → Bereiche neu aufbauen (Felder werden weiterverwendet)
    _emit(c) {
      const was = this._config;
      super._emit(c);
      if (VIS2.some((k) => c[k] !== was?.[k])) this._rebuild();
    }
  };
  __publicField(NovaWeatherCardEditor, "labels", WLABELS2);
  __publicField(NovaWeatherCardEditor, "helpers", WHELPERS2);
  __publicField(NovaWeatherCardEditor, "openSections", ["general"]);
  define("weather-card-editor", NovaWeatherCardEditor);

  // src/shared/card-grid.js
  var WIDTHS = [["auto", "Auto"], ["1/4", "1/4"], ["1/3", "1/3"], ["1/2", "1/2"], ["2/3", "2/3"], ["3/4", "3/4"], ["1", "Voll"]];
  var FR = { "1/4": 1 / 4, "1/3": 1 / 3, "1/2": 1 / 2, "2/3": 2 / 3, "3/4": 3 / 4, "1": 1 };
  var fracOf = (v) => Object.keys(FR).reduce((a, k) => Math.abs(FR[k] - v) < Math.abs(FR[a] - v) ? k : a, "1");
  var toCell = (x, cols) => {
    if (!x || typeof x !== "object") return { width: "auto", card: null };
    if (!("card" in x || "span" in x || "width" in x)) return { width: "auto", card: x };
    const old = +x.span > 1 ? fracOf(+x.span / cols) : "auto";
    const width = FR[x.width] ? String(x.width) : old === "1" ? "auto" : old;
    return { width, card: x.card && typeof x.card === "object" ? x.card : null };
  };
  var normRows = (c) => {
    const cols = Math.max(1, +c.columns || 2);
    if (Array.isArray(c.rows)) return c.rows.map((r) => ({ cells: (Array.isArray(r) ? r : r?.cells || []).map((x) => toCell(x, cols)) })).filter((r) => r.cells.length);
    if (Array.isArray(c.cards)) return c.cards.map((k) => ({ cells: [{ width: "auto", card: k }] }));
    return [];
  };
  var serRows = (rows) => rows.filter((r) => r.cells.length).map((r) => ({ cells: r.cells.map((x) => FR[x.width] ? { width: x.width, card: x.card ?? null } : { card: x.card ?? null }) }));
  var flexOf = (w, gap) => FR[w] ? `0 0 calc(${FR[w]} * (100% + ${gap}px) - ${gap + 0.1}px)` : "1 1 0";
  var helpersP;
  var helpers = () => helpersP ||= Promise.resolve().then(() => {
    if (typeof window.loadCardHelpers !== "function") throw new Error("loadCardHelpers nicht verfügbar");
    return window.loadCardHelpers();
  }).catch((e) => {
    helpersP = null;
    throw e;
  });
  var PREV = /* @__PURE__ */ new Set(["HUI-CARD-PREVIEW", "HUI-DIALOG-EDIT-CARD", "HUI-DIALOG-CREATE-CARD", "HUI-CARD-ELEMENT-EDITOR", "HUI-CARD-PICKER"]);
  var EDIT = /* @__PURE__ */ new Set(["HUI-CARD-OPTIONS", "HUI-CARD-EDIT-MODE"]);
  var HANDOFF = /* @__PURE__ */ new Map();
  var handoffT;
  var handOff = (kind, pool) => {
    pool.forEach((ws, k) => {
      const key = `${kind}|${k}`;
      (HANDOFF.get(key) || HANDOFF.set(key, []).get(key)).push(...ws);
    });
    clearTimeout(handoffT);
    handoffT = setTimeout(() => HANDOFF.clear(), 3e3);
  };
  var takeOver = (kind, k) => HANDOFF.get(`${kind}|${k}`)?.shift();
  var GRID_CSS = `
.rw{display:flex;flex-wrap:wrap;gap:12px;flex:none;align-items:flex-start}
.eqh .rw{align-items:stretch}.eqh .rw>.cell{display:grid}
.rw>.cell.auto{min-width:min(100%,140px)}
.stack .rw>.cell{flex:1 1 100%!important}
.cell{min-width:0}
.cell.empty{min-height:0}
.err{display:flex;gap:8px;align-items:flex-start;padding:12px 14px;border-radius:20px;font-size:13px;
background:color-mix(in srgb,var(--nv-error) 18%,transparent);border:1px solid color-mix(in srgb,var(--nv-error) 50%,transparent)}
.err ha-icon{color:var(--nv-error);flex:none}
.hint{font-size:13px;opacity:.7;padding:8px 2px}`;
  var CHIP_CSS = `
.info{display:flex;flex-wrap:wrap;gap:7px;flex:none}
.info.scroll{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.info.scroll::-webkit-scrollbar{display:none}
.info[hidden]{display:none}
.chip{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;background:var(--nv-chip);border:1px solid var(--nv-box-border);font-size:12.5px;white-space:nowrap;cursor:pointer;flex:none;outline:none;transition:background-color .2s,color .2s,border-color .2s,box-shadow .2s,transform .2s,opacity .2s}
.chip ha-icon{--mdc-icon-size:16px}.chip img{width:16px;height:16px}.chip:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}.chip:active{transform:scale(.95)}
.chip .cn:empty{display:none}.chip .cn:not(:empty)::after{content:' ·'}
.chip.al{background:var(--c);color:var(--cf);border-color:transparent;box-shadow:0 0 14px color-mix(in srgb,var(--c) 45%,transparent)}`;
  function renderChips(card, bar, items, h) {
    bar.hidden = !items.length;
    const key = JSON.stringify(items);
    if (bar._key !== key) {
      bar._key = key;
      bar.innerHTML = "";
      bar._chips = items.map((o) => {
        const d = document.createElement("div");
        d.className = "chip";
        d.tabIndex = 0;
        d.setAttribute("role", "button");
        d.innerHTML = '<span class="ci"></span><span class="cn"></span><span class="cv"></span>';
        const open = () => o.entity && moreInfo(card, o.entity);
        d.addEventListener("click", open);
        d.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            open();
          }
        });
        bar.appendChild(d);
        return d;
      });
    }
    items.forEach((o, i) => {
      const d = bar._chips[i], s = h.states[o.entity];
      setIcon(d.querySelector(".ci"), iconOf(h, o, "mdi:information-outline"));
      d.querySelector(".cn").textContent = o.name || "";
      d.querySelector(".cv").textContent = s ? valueOf(h, s, o) : "Nicht gefunden";
      d.title = nameOf(h, o);
      const al = !!o.alert && alertHit({ state: o.alert_state, above: o.alert_above, below: o.alert_below }, s);
      d.classList.toggle("al", al);
      if (al) {
        const v = roleVars(o.alert_color || "accent-2");
        d.style.setProperty("--c", v.c);
        d.style.setProperty("--cf", v.fg);
      }
    });
  }
  var GridCard = (Base) => class extends Base {
    _cells() {
      return [...this._body.querySelectorAll(":scope>.rw>.cell>*")].filter((el2) => !el2.classList.contains("err"));
    }
    _setHass(el2) {
      if (!this._h) return;
      try {
        el2.hass = this._h;
      } catch (e) {
        console.warn("[nova-cards] Karte im Raster:", e);
      }
    }
    _stack() {
      this._body.classList.toggle("stack", this._body.clientWidth > 0 && this._body.clientWidth < (+this._cfg?.stack_below || 0));
    }
    // Zellen an die Nachfolgerin weitergeben (aus disconnectedCallback)
    _handOffCells() {
      if (this._pool) {
        handOff(this.constructor.gridKind, this._pool);
        this._pool = null;
        this._dirty = true;
      }
    }
    _grid() {
      this._dirty = false;
      const old = this._pool || /* @__PURE__ */ new Map(), pool = /* @__PURE__ */ new Map(), list2 = [], kind = this.constructor.gridKind;
      this._rows.forEach((row) => {
        const rw = document.createElement("div");
        rw.className = "rw";
        list2.push(rw);
        row.cells.forEach((cell) => {
          const key = JSON.stringify(cell.card);
          let w = old.get(key)?.shift() || (this._handoff() ? takeOver(kind, key) : null);
          if (!w) {
            w = document.createElement("div");
            w.className = "cell";
            w._card = cell.card;
            w._owner = this;
            if (cell.card) {
              this._mount(w, cell.card);
              w.addEventListener("ll-rebuild", (e) => {
                e.stopPropagation();
                w._owner._mount(w, w._card);
              });
            } else w.classList.add("empty");
          } else if (w._owner !== this) {
            w._owner = this;
            w.querySelectorAll(":scope>*").forEach((el2) => this._setHass(el2));
          }
          w.style.flex = flexOf(cell.width, 12);
          w.classList.toggle("auto", !FR[cell.width]);
          (pool.get(key) || pool.set(key, []).get(key)).push(w);
          rw.append(w);
        });
      });
      this._pool = pool;
      if (!list2.length) {
        const p = document.createElement("div");
        p.className = "hint";
        p.textContent = "Noch keine Karten – im Editor eine Vorlage wählen und Karten einfügen.";
        list2.push(p);
      }
      this._body.replaceChildren(...list2);
      this._body.classList.toggle("eqh", !!this._cfg?.equal_height);
      this._stack();
    }
    // Fehler einer Karte bleiben in ihrer Zelle
    async _mount(w, cfg) {
      const id = w._id = (w._id || 0) + 1;
      let el2;
      try {
        if (!cfg.type) throw new Error("Kartentyp (type) fehlt");
        el2 = (await helpers()).createCardElement(cfg);
      } catch (e) {
        el2 = document.createElement("div");
        el2.className = "err";
        el2.innerHTML = `<ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>Karte konnte nicht geladen werden: ${esc(e?.message || e)}</span>`;
      }
      if (id !== w._id) return;
      this._setHass(el2);
      w.replaceChildren(el2);
    }
  };

  // src/shared/card-grid-editor.js
  var wait = (ms) => new Promise((r) => setTimeout(r, ms));
  var haEdP;
  var HA_ED = ["hui-card-picker", "hui-card-element-editor"];
  var loadHaEditors = () => HA_ED.every((n) => customElements.get(n)) ? Promise.resolve() : haEdP ||= (async () => {
    try {
      (await helpers()).createCardElement({ type: "vertical-stack", cards: [] });
      await Promise.race([customElements.whenDefined("hui-vertical-stack-card"), wait(3e3)]);
      await customElements.get("hui-vertical-stack-card")?.getConfigElement?.();
    } catch (e) {
      console.warn("[nova-cards] Kartenauswahl von HA nicht vorgeladen", e);
    }
    await Promise.race([Promise.all(HA_ED.map((n) => customElements.whenDefined(n))), wait(3e3)]);
  })();
  var A2 = "auto";
  var TEMPLATES = [
    { label: "Eine Karte groß", rows: [[A2]] },
    { label: "Groß oben, zwei klein darunter", rows: [[A2], [A2, A2]] },
    { label: "Zwei nebeneinander", rows: [[A2, A2]] },
    { label: "Raster 2×2", rows: [[A2, A2], [A2, A2]] },
    { label: "Drei nebeneinander", rows: [[A2, A2, A2]] },
    { label: "Breit und schmal", rows: [["2/3", "1/3"]] }
  ];
  var HA_CARDS = {
    tile: ["Kachel", "mdi:card-outline"],
    entities: ["Entitäten", "mdi:format-list-bulleted"],
    button: ["Button", "mdi:gesture-tap-button"],
    markdown: ["Text", "mdi:text"],
    "weather-forecast": ["Wetter", "mdi:weather-partly-cloudy"],
    thermostat: ["Thermostat", "mdi:thermostat"],
    light: ["Licht", "mdi:lightbulb"],
    glance: ["Überblick", "mdi:eye"],
    "history-graph": ["Verlauf", "mdi:chart-line"],
    "statistics-graph": ["Statistik", "mdi:chart-bar"],
    sensor: ["Sensor", "mdi:eye"],
    gauge: ["Anzeige", "mdi:gauge"],
    "media-control": ["Medien", "mdi:play-circle-outline"],
    "picture-entity": ["Bild (Entität)", "mdi:image"],
    "picture-glance": ["Bild mit Symbolen", "mdi:image-area"],
    area: ["Bereich", "mdi:sofa"],
    map: ["Karte", "mdi:map"],
    calendar: ["Kalender", "mdi:calendar"],
    "alarm-panel": ["Alarm", "mdi:shield-home"],
    humidifier: ["Luftbefeuchter", "mdi:air-humidifier"],
    heading: ["Überschrift", "mdi:format-header-1"],
    iframe: ["Webseite", "mdi:web"],
    "vertical-stack": ["Stapel vertikal", "mdi:view-sequential"],
    "horizontal-stack": ["Stapel horizontal", "mdi:view-column"],
    grid: ["Raster", "mdi:view-grid"]
  };
  var customs = () => (window.customCards || []).filter((c) => c?.type);
  var typeName = (type) => {
    if (!type) return "Unbekannt";
    if (type.startsWith("custom:")) {
      const t = type.slice(7), m = customs().find((c) => c.type === t);
      return m?.name?.replace(/ \(Dev\)$/, "") || t;
    }
    return HA_CARDS[type]?.[0] || type;
  };
  var cardTitle = (h, c) => c.title || c.name || c.heading || c.entity && (h?.states[c.entity]?.attributes.friendly_name || c.entity) || "";
  var cardIcon = (h, c) => c.icon || (c.entity && h ? iconOf(h, { entity: c.entity }, "") : "") || HA_CARDS[c.type]?.[1] || "mdi:card-outline";
  var INFO = [
    ENT,
    NAMEICON,
    g2({ name: "decimals", selector: { number: { min: 0, max: 4, mode: "box" } } }, { name: "alert", selector: { boolean: {} } }),
    g2({ name: "alert_state", selector: T }, ROLE("alert_color")),
    g2(NUM("alert_above"), NUM("alert_below"))
  ];
  var EQH = [{ name: "equal_height", selector: { boolean: {} } }];
  var GRID_LABELS = { equal_height: "Gleiche Höhe pro Reihe" };
  var GRID_HELPERS = { equal_height: "Streckt alle Karten einer Zeile auf die Höhe der höchsten. Aus = jede Karte so hoch wie ihr Inhalt." };
  var GRID_ED_CSS = `
details.item>.body{gap:12px}
.mini{display:flex;flex-direction:column}
.gap{height:10px;border-radius:4px}.gap.hot{background:var(--primary-color);opacity:.7}
.rowb{display:flex;flex-direction:column;gap:6px}
.rh{display:flex;align-items:center;gap:2px;font-size:12px;font-weight:500;opacity:.8}.rh .fill{flex:1}
.row{display:flex;flex-wrap:wrap;gap:8px;border-radius:12px}
.row.hot{outline:2px dashed var(--primary-color);outline-offset:3px}
.blk{min-height:56px;box-sizing:border-box;border-radius:12px;border:1px solid var(--divider-color,#444);background:var(--secondary-background-color);
display:flex;align-items:center;gap:6px;padding:8px 10px 8px 2px;cursor:pointer;user-select:none;-webkit-user-select:none;min-width:0;position:relative;outline:none}
.blk:focus-visible{box-shadow:0 0 0 2px var(--primary-color)}
.blk.sel{border-color:var(--primary-color);box-shadow:0 0 0 1px var(--primary-color)}
.blk.lift{z-index:5;box-shadow:0 8px 24px rgba(0,0,0,.35);opacity:.92;cursor:grabbing}
.blk.before{box-shadow:inset 4px 0 0 var(--primary-color)}.blk.after{box-shadow:inset -4px 0 0 var(--primary-color)}
.drag{touch-action:none;cursor:grab;opacity:.5;padding:6px 2px;display:flex;flex:none}
.blk .bi{flex:none;color:var(--primary-color)}
.bl{flex:1;min-width:0}.bl b,.bl small{display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.bl b{font-weight:500;font-size:13px}.bl small{font-size:11px;opacity:.65}
.sp{font-size:10.5px;opacity:.55;flex:none}
.blk.slot{border-style:dashed;justify-content:center;color:var(--primary-color);flex-direction:column;gap:2px;padding:10px;min-height:72px;font-size:12.5px;background:none}
.blk.slot ha-icon{--mdc-icon-size:30px}
.blk.slot .drag{position:absolute;left:2px;top:50%;transform:translateY(-50%)}
.blk.slot.hot{background:color-mix(in srgb,var(--primary-color) 14%,transparent)}
.rowb>.add{align-self:flex-start;margin:0}
.wd{display:flex;flex-wrap:wrap;gap:4px;align-items:center}.wd>span{font-size:12px;opacity:.75;margin-right:4px}
.wd button{border:1px solid var(--divider-color,#444);border-radius:999px;background:none;color:inherit;font:inherit;font-size:12px;padding:4px 10px;cursor:pointer}
.wd button.on{border-color:var(--primary-color);background:var(--primary-color);color:var(--text-primary-color,#fff)}
.panel{border:1px solid var(--primary-color);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:10px;margin-top:8px}
.tools{display:flex;align-items:center;gap:2px;flex-wrap:wrap}.tools .w{font-size:12px;opacity:.75;padding:0 2px;min-width:52px;text-align:center}.tools .fill{flex:1}
.tpls{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px}
.tpl{display:flex;flex-direction:column;gap:6px;align-items:center;padding:8px 6px;border-radius:12px;border:1px solid var(--divider-color,#444);background:none;color:inherit;cursor:pointer;font:inherit;font-size:11.5px;text-align:center}
.tpl:hover{border-color:var(--primary-color)}
.tp{display:flex;flex-direction:column;gap:3px;width:56px}.tp>span{display:flex;gap:3px}.tp i{display:block;height:13px;border-radius:3px;background:var(--primary-color);opacity:.55}
textarea.json{width:100%;box-sizing:border-box;background:var(--card-background-color,transparent);color:inherit;border:1px solid var(--divider-color,#444);border-radius:8px;padding:8px;font:inherit}
textarea.json{min-height:200px;font-family:monospace;font-size:12px}
textarea.bad{border-color:var(--error-color,#db4437)}
.lnk{background:none;border:none;color:var(--primary-color);cursor:pointer;font:inherit;font-size:12px;padding:0;align-self:flex-start}`;
  var el = (t, cls, html) => {
    const e = document.createElement(t);
    if (cls) e.className = cls;
    if (html != null) e.innerHTML = html;
    return e;
  };
  var clone = (o) => o == null ? o : JSON.parse(JSON.stringify(o));
  var canPick = () => !!(customElements.get("ha-dialog") && customElements.get("hui-card-picker"));
  var PICK_CSS = `
ha-dialog{--dialog-content-padding:0}
@media(min-width:451px) and (min-height:501px){ha-dialog{--ha-dialog-min-height:min(900px,80vh);--ha-dialog-max-height:var(--ha-dialog-min-height)}}
ha-dialog::part(body){overflow:hidden}
.body{display:flex;flex-direction:column;flex:1;min-height:0;height:100%}
hui-card-picker{flex:1;min-height:0}`;
  var GridEditor = (Base) => class extends Base {
    set hass(h) {
      const old = this._hass;
      super.hass = h;
      if (hassChanged(old, h, this._ids)) [this._sub, this._pick, this._dlgPick].forEach((x) => {
        if (x) try {
          x.hass = h;
        } catch {
        }
      });
    }
    // HA reicht dem Editor die Dashboard-Konfiguration (für Kartenauswahl und Karteneditor)
    set lovelace(l) {
      this._ll = l;
    }
    get lovelace() {
      return this._ll;
    }
    async _rebuild() {
      await loadHaEditors();
      return super._rebuild();
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this._dlg?.close();
    }
    _rows() {
      return normRows(this._config);
    }
    _emitRows(rows, keep) {
      const c = { ...this._config, rows: serRows(rows) };
      delete c.cards;
      delete c.columns;
      if (keep !== void 0) {
        this._sel = null;
        rows.forEach((r, ri) => r.cells.forEach((x, ci) => {
          if (x === keep) this._sel = [ri, ci];
        }));
      }
      this._emit(c);
    }
    _gridReset() {
      this._sub = this._pick = null;
      this._blocks = {};
    }
    _layoutBody(b) {
      b.append(this._form(EQH, { equal_height: !!this._config.equal_height }, (v) => {
        const c = { ...this._config };
        if (v.equal_height) c.equal_height = true;
        else delete c.equal_height;
        this._emit(c);
      }));
      b.append(this._hint("Vorlage legt leere Plätze an. Vorhandene Karten wandern der Reihe nach hinein, übrige bleiben unten erhalten."));
      const g = el("div", "tpls");
      TEMPLATES.forEach((t) => {
        const btn = el("button", "tpl");
        btn.type = "button";
        btn.innerHTML = `<span class="tp">${t.rows.map((row) => `<span>${row.map((w) => `<i style="flex:${flexOf(w, 3)}"></i>`).join("")}</span>`).join("")}</span><span></span>`;
        btn.lastChild.textContent = t.label;
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this._template(t);
        });
        g.append(btn);
      });
      b.append(g);
    }
    _template(t) {
      const left = this._rows().flatMap((r) => r.cells).filter((x) => x.card);
      const rows = t.rows.map((row) => ({ cells: row.map((width) => ({ width, card: left.shift()?.card ?? null })) }));
      left.forEach((x) => rows.push({ cells: [{ width: "auto", card: x.card }] }));
      this._sel = null;
      this._onTemplate?.();
      this._emitRows(rows);
      this._rebuild();
    }
    /* --- Inhalt: Miniatur des Rasters --- */
    _contentBody(b) {
      const rows = this._rows();
      if (this._sel && !rows[this._sel[0]]?.cells[this._sel[1]]) this._sel = null;
      b.append(this._hint(`So sieht das Raster ${this.constructor.gridWhere || "in der Karte"} aus. Spalten einer Zeile stehen nebeneinander. Antippen zum Bearbeiten, am Griff ziehen zum Verschieben (am PC geht auch der ganze Block).`));
      const mini = this._mini = el("div", "mini");
      const insert = (fn, card) => {
        const rs = this._rows(), x = { width: "auto", card: card ?? null };
        fn(rs, x);
        this._picking = !card;
        this._yaml = false;
        this._emitRows(rs, x);
        this._rebuild();
      };
      const add = (fn) => {
        if (!this._openPicker((c) => insert(fn, c))) insert(fn);
      };
      const addCell = (ri) => add((rs, x) => {
        rs[ri].cells.forEach((k) => {
          if (k.width === "1") k.width = "auto";
        });
        rs[ri].cells.push(x);
      });
      const rowOp = (fn) => {
        const rs = this._rows(), keep = this._sel ? rs[this._sel[0]]?.cells[this._sel[1]] : void 0;
        fn(rs);
        this._emitRows(rs, keep ?? null);
        this._rebuild();
      };
      rows.forEach((row, ri) => {
        mini.append(Object.assign(el("div", "gap"), { _i: ri }));
        const rb = el("div", "rowb");
        rb._r = ri;
        const rh = el("div", "rh");
        rh.append(
          Object.assign(el("span"), { textContent: `Zeile ${ri + 1}` }),
          el("span", "fill"),
          this._btn("mdi:arrow-up", "Zeile nach oben", () => rowOp((rs) => rs.splice(ri - 1, 0, ...rs.splice(ri, 1))), ri === 0),
          this._btn("mdi:arrow-down", "Zeile nach unten", () => rowOp((rs) => rs.splice(ri + 1, 0, ...rs.splice(ri, 1))), ri === rows.length - 1),
          this._btn("mdi:delete-outline", "Zeile löschen", () => rowOp((rs) => rs.splice(ri, 1)))
        );
        const re = el("div", "row");
        re._r = ri;
        row.cells.forEach((cell, ci) => re.append(this._block(cell, ri, ci)));
        rb.append(rh, re);
        if (this._sel?.[0] === ri) rb.append(this._panel(rows));
        rb.append(this._add("Spalte hinzufügen", () => addCell(ri)));
        mini.append(rb);
      });
      mini.append(Object.assign(el("div", "gap"), { _i: rows.length }));
      b.append(mini);
      b.append(this._add("Zeile hinzufügen", () => add((rs, x) => rs.push({ cells: [x] }))));
    }
    _block(cell, ri, ci) {
      const b = el("div", "blk");
      b.tabIndex = 0;
      b.setAttribute("role", "button");
      b.style.flex = flexOf(cell.width, 8);
      if (!FR[cell.width]) b.style.minWidth = "min(100%,110px)";
      b._r = ri;
      b._c = ci;
      const sel2 = this._sel?.[0] === ri && this._sel?.[1] === ci;
      b.classList.toggle("sel", sel2);
      const grip = el("span", "drag", '<ha-icon icon="mdi:drag"></ha-icon>');
      grip.title = "Ziehen zum Verschieben";
      if (!cell.card) {
        b.classList.add("slot");
        b.innerHTML = '<ha-icon icon="mdi:plus"></ha-icon><span>Karte wählen</span>';
      } else {
        b.innerHTML = '<ha-icon class="bi"></ha-icon><span class="bl"><b></b><small></small></span><span class="sp"></span>';
        this._label(b, cell);
      }
      b.prepend(grip);
      const toggle = () => {
        if (Date.now() - (this._dragged || 0) < 200) return;
        this._picking = !cell.card;
        this._yaml = false;
        this._sel = sel2 && cell.card ? null : [ri, ci];
        this._rebuild();
        if (!cell.card) this._pickFor(ri, ci);
      };
      b.addEventListener("click", (e) => {
        e.preventDefault();
        toggle();
      });
      b.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          toggle();
        }
      });
      this._dragInit(b, grip);
      this._blocks[`${ri}.${ci}`] = b;
      return b;
    }
    _label(b, cell) {
      const c = cell.card, t = cardTitle(this._hass, c), n = typeName(c.type);
      b.querySelector(".bi").setAttribute("icon", cardIcon(this._hass, c));
      b.querySelector("b").textContent = t || n;
      b.querySelector("small").textContent = t ? n : "";
      b.querySelector(".sp").textContent = FR[cell.width] && cell.width !== "1" ? cell.width : "";
    }
    /* --- Einstellungen des gewählten Blocks --- */
    _panel(rows) {
      const [ri, ci] = this._sel, cell = rows[ri].cells[ci], n = rows[ri].cells.length, p = el("div", "panel");
      const set = (fn) => {
        const rs = this._rows(), x = rs[ri].cells[ci];
        fn(rs, x);
      };
      const wd = el("div", "wd");
      wd.append(Object.assign(el("span"), { textContent: "Breite:" }));
      WIDTHS.forEach(([v, l]) => {
        const bt = el("button", v === (FR[cell.width] ? cell.width : "auto") ? "on" : "");
        bt.type = "button";
        bt.textContent = l;
        bt.title = v === "auto" ? "Teilt sich den freien Platz mit den anderen Spalten" : v === "1" ? "Ganze Zeilenbreite" : `${l} der Zeilenbreite`;
        bt.addEventListener("click", (e) => {
          e.preventDefault();
          set((rs, x) => {
            x.width = v;
            this._emitRows(rs, x);
            this._rebuild();
          });
        });
        wd.append(bt);
      });
      p.append(wd);
      const tools = el("div", "tools");
      const mv = (dir) => set((rs, x) => {
        rs[ri].cells.splice(ci, 1);
        rs[ri].cells.splice(ci + dir, 0, x);
        this._emitRows(rs, x);
        this._rebuild();
      });
      tools.append(
        this._btn("mdi:arrow-left", "Nach links", () => mv(-1), ci === 0),
        this._btn("mdi:arrow-right", "Nach rechts", () => mv(1), ci >= n - 1),
        el("span", "fill")
      );
      if (cell.card) tools.append(
        this._btn("mdi:pencil-outline", this._yaml ? "Grafischer Editor" : "Als YAML bearbeiten", () => {
          this._yaml = !this._yaml;
          this._picking = false;
          this._rebuild();
        }),
        this._btn("mdi:swap-horizontal", "Andere Karte wählen", () => {
          if (!this._pickFor(ri, ci)) {
            this._picking = !this._picking;
            this._rebuild();
          }
        }),
        this._btn("mdi:content-copy", "Duplizieren", () => set((rs, x) => {
          const k = { width: x.width, card: clone(x.card) };
          rs[ri].cells.splice(ci + 1, 0, k);
          this._emitRows(rs, k);
          this._rebuild();
        }))
      );
      tools.append(
        this._btn("mdi:delete-outline", "Löschen", () => set((rs) => {
          rs[ri].cells.splice(ci, 1);
          this._sel = null;
          this._emitRows(rs);
          this._rebuild();
        })),
        this._btn("mdi:chevron-up", "Zuklappen", () => {
          this._sel = null;
          this._rebuild();
        })
      );
      p.append(tools);
      const box = el("div", "body");
      box.style.padding = "0";
      p.append(box);
      if (!cell.card || this._picking) this._picker(box, ri, ci);
      else if (this._yaml || !customElements.get("hui-card-element-editor")) this._yamlEd(box, ri, ci, !this._yaml);
      else this._cardEditor(box, ri, ci);
      return p;
    }
    _setCard(ri, ci, card, rebuild) {
      const rs = this._rows(), x = rs[ri]?.cells[ci];
      if (!x) return;
      x.card = card;
      this._emitRows(rs, x);
      if (rebuild) {
        this._picking = false;
        this._yaml = false;
        this._rebuild();
        return;
      }
      const b = this._blocks[`${ri}.${ci}`];
      if (b && !b.classList.contains("slot")) this._label(b, x);
    }
    // Leerer Platz: Kartenauswahl im eigenen Fenster öffnen. Ohne Kartenauswahl von HA die Karte als YAML eintragen.
    _picker(box, ri, ci) {
      if (canPick()) {
        box.append(this._hint("Die Kartenauswahl öffnet sich in einem eigenen Fenster. Die gewählte Karte kommt in diesen Platz."));
        box.append(this._add("Karte wählen", () => this._pickFor(ri, ci)));
        return;
      }
      box.append(this._hint("Die Kartenauswahl von Home Assistant ist hier nicht verfügbar. Karte als YAML eintragen (z. B. type: tile) und übernehmen."));
      let pending = null;
      this._yamlField(box, null, (v) => {
        pending = v;
      });
      box.append(this._add("Übernehmen", () => {
        if (pending) this._setCard(ri, ci, pending, true);
      }));
    }
    _pickFor(ri, ci) {
      return this._openPicker((c) => this._setCard(ri, ci, c, true));
    }
    // HA-INTERN: ha-dialog (Dialogfenster von HA, aufgebaut wie „Karte hinzufügen“ in einer Ansicht) mit hui-card-picker
    // (Kartenauswahl mit Suche und Vorschaubildern, geladen über loadHaEditors()). done(karte) nur bei Auswahl,
    // Schließen/Abbrechen ändert nichts. Fehlt eins der Elemente → false, dann bleibt der YAML-Weg im Block.
    _openPicker(done) {
      if (!canPick()) return false;
      this._dlg?.close();
      const host = document.createElement("div");
      try {
        const r = host.attachShadow({ mode: "open" });
        r.innerHTML = `<style>${PICK_CSS}</style><ha-dialog width="large" flexcontent header-title="Karte wählen"><div class="body"></div>
<ha-dialog-footer slot="footer"></ha-dialog-footer></ha-dialog>`;
        const d = r.querySelector("ha-dialog"), p = document.createElement("hui-card-picker");
        const cancel = document.createElement(customElements.get("ha-button") ? "ha-button" : "button");
        cancel.slot = "secondaryAction";
        cancel.setAttribute("appearance", "plain");
        cancel.textContent = "Abbrechen";
        r.querySelector("ha-dialog-footer").append(cancel);
        p.hass = this._hass;
        if (this._ll) p.lovelace = this._ll;
        p.setAttribute("hide-clipboard", "");
        r.querySelector(".body").append(p);
        let taken = false, gone = false;
        const shut = () => {
          d.open = false;
        };
        const end = () => {
          if (gone) return;
          gone = true;
          host.remove();
          if (this._dlg?.host === host) this._dlg = this._dlgPick = null;
        };
        cancel.addEventListener("click", shut);
        p.addEventListener("config-changed", (e) => {
          e.stopPropagation();
          const c = e.detail?.config;
          if (!c?.type || taken) return;
          taken = true;
          shut();
          done(c);
        });
        d.addEventListener("closed", (e) => {
          if (e.target === d) end();
        });
        host.addEventListener("keydown", (e) => e.stopPropagation());
        document.body.append(host);
        this._dlg = { host, close: () => {
          shut();
          setTimeout(end, 400);
        } };
        this._dlgPick = p;
        d.open = true;
        return true;
      } catch (e) {
        console.warn("[nova-cards] Kartenauswahl-Fenster von HA nicht nutzbar", e);
        host.remove();
        this._dlg = this._dlgPick = null;
        return false;
      }
    }
    // HA-INTERN: hui-card-element-editor (Karteneditor von HA mit eigenem GUI/YAML-Umschalter). Fehler → YAML-Feld.
    _cardEditor(box, ri, ci) {
      const cfg = this._rows()[ri].cells[ci].card;
      try {
        const ed = this._reuse(`card-editor:${ri}.${ci}`, () => {
          const ed2 = document.createElement("hui-card-element-editor");
          ed2.addEventListener("config-changed", (e) => {
            e.stopPropagation();
            const c = e.detail?.config;
            if (!e.detail?.error && c && typeof c === "object" && c.type) ed2._cb(c);
          });
          ed2.addEventListener("GUImode-changed", (e) => e.stopPropagation());
          return ed2;
        });
        ed._cb = (c) => this._setCard(ri, ci, c, false);
        ed.hass = this._hass;
        if (this._ll) ed.lovelace = this._ll;
        ed.value = cfg;
        box.append(ed);
        this._sub = ed;
      } catch (e) {
        console.warn("[nova-cards] Karteneditor von HA nicht nutzbar", e);
        box.innerHTML = "";
        this._yamlEd(box, ri, ci, true);
      }
    }
    // HA-INTERN: ha-yaml-editor. Fehlt er, ein Textfeld im JSON-Format (JSON ist auch gültiges YAML).
    _yamlEd(box, ri, ci, auto) {
      if (auto) box.append(this._hint("Der grafische Editor ist hier nicht verfügbar – Karte direkt als YAML bearbeiten."));
      this._yamlField(box, this._rows()[ri].cells[ci].card, (v) => this._setCard(ri, ci, v, false));
    }
    // YAML-Feld für eine Kartenkonfiguration; cb bekommt nur gültige Karten (mit type)
    _yamlField(box, cfg, cb) {
      const take = (v) => {
        if (v && typeof v === "object" && !Array.isArray(v) && v.type) {
          cb(v);
          return true;
        }
        return false;
      };
      if (customElements.get("ha-yaml-editor")) {
        try {
          const y = document.createElement("ha-yaml-editor");
          y.hass = this._hass;
          y.defaultValue = cfg;
          y.addEventListener("value-changed", (e) => {
            e.stopPropagation();
            if (e.detail?.isValid !== false) take(e.detail?.value);
          });
          box.append(y);
          this._sub = y;
          return;
        } catch (e) {
          console.warn("[nova-cards] YAML-Editor von HA nicht nutzbar", e);
        }
      }
      const ta = el("textarea", "json");
      ta.value = JSON.stringify(cfg || { type: "" }, null, 2);
      ta.spellcheck = false;
      ta.addEventListener("input", () => {
        let ok2 = false;
        try {
          ok2 = take(JSON.parse(ta.value));
        } catch {
        }
        ta.classList.toggle("bad", !ok2);
      });
      box.append(this._hint("JSON-Format, „type“ ist Pflicht."), ta);
    }
    /* --- Drag-and-drop (Maus und Touch, über Pointer Events) --- */
    _dragInit(b, grip) {
      b.addEventListener("pointerdown", (e) => {
        if (e.button !== 0) return;
        if (e.pointerType !== "mouse" && !e.composedPath().includes(grip)) return;
        const x0 = e.clientX, y0 = e.clientY;
        let on = false;
        const move = (ev) => {
          if (!on) {
            if (Math.hypot(ev.clientX - x0, ev.clientY - y0) < 6) return;
            on = true;
            b.classList.add("lift");
          }
          ev.preventDefault();
          b.style.transform = `translate(${ev.clientX - x0}px,${ev.clientY - y0}px)`;
          this._over(ev.clientX, ev.clientY, b);
        };
        const stop = (drop) => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          window.removeEventListener("pointercancel", cancel);
          if (!on) return;
          this._dragged = Date.now();
          const t = drop ? this._drop : null;
          this._drop = null;
          if (t) this._move(b._r, b._c, t);
          else this._rebuild();
        };
        const up = () => stop(true), cancel = () => stop(false);
        window.addEventListener("pointermove", move, { passive: false });
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", cancel);
      });
    }
    // Ziel unter dem Zeiger: Lücke zwischen Zeilen (neue Zeile), leerer Platz oder vor/hinter einem Block
    _over(x, y, src) {
      const m = this._mini;
      m.querySelectorAll(".hot,.before,.after").forEach((n) => n.classList.remove("hot", "before", "after"));
      const inR = (r, pad = 0) => x >= r.left && x <= r.right && y >= r.top - pad && y <= r.bottom + pad;
      let t = null;
      for (const g of m.querySelectorAll(":scope>.gap")) if (inR(g.getBoundingClientRect(), 4)) {
        t = { kind: "row", i: g._i, el: g };
        break;
      }
      if (!t) for (const rb of m.querySelectorAll(":scope>.rowb")) {
        if (!inR(rb.getBoundingClientRect())) continue;
        const re = rb.querySelector(":scope>.row");
        const blks = [...re.querySelectorAll(":scope>.blk")].filter((n) => n !== src);
        const hit = blks.find((n) => inR(n.getBoundingClientRect()));
        if (hit?.classList.contains("slot")) t = { kind: "slot", r: hit._r, c: hit._c, el: hit, cls: "hot" };
        else if (hit) {
          const rc = hit.getBoundingClientRect(), after = x > rc.left + rc.width / 2;
          t = { kind: "cell", r: hit._r, c: hit._c + (after ? 1 : 0), el: hit, cls: after ? "after" : "before" };
        } else t = { kind: "cell", r: re._r, c: re.querySelectorAll(":scope>.blk").length, el: re };
        break;
      }
      if (!t) {
        const rows = m.querySelectorAll(":scope>.rowb");
        if (rows.length && y < rows[0].getBoundingClientRect().top) t = { kind: "row", i: 0 };
        else if (rows.length && y > rows[rows.length - 1].getBoundingClientRect().bottom) t = { kind: "row", i: rows.length };
      }
      if (t?.el) t.el.classList.add(t.cls || "hot");
      this._drop = t;
    }
    _move(r, c, t) {
      const rs = this._rows(), x = rs[r]?.cells[c], selCell = this._sel ? rs[this._sel[0]]?.cells[this._sel[1]] : null;
      if (!x) return this._rebuild();
      const GONE = {};
      if (t.kind === "slot") {
        if (t.r === r && t.c === c) return this._rebuild();
        rs[t.r].cells[t.c] = x;
        rs[r].cells[c] = GONE;
      } else if (t.kind === "cell") {
        if (t.r === r && (t.c === c || t.c === c + 1)) return this._rebuild();
        rs[r].cells[c] = GONE;
        rs[t.r].cells.splice(t.c, 0, x);
      } else {
        rs[r].cells[c] = GONE;
        rs.splice(t.i, 0, { cells: [x] });
      }
      rs.forEach((row) => {
        row.cells = row.cells.filter((k) => k !== GONE);
      });
      this._emitRows(rs.filter((row) => row.cells.length), selCell ?? null);
      this._rebuild();
    }
  };

  // src/popup.js
  var DEF = { width: 1180, stack_below: 500, info_layout: "wrap" };
  var PCSS2 = `${NOVA_VARS}${GRID_CSS}${CHIP_CSS}
:host{display:block;font-family:var(--ha-font-family-body,Roboto,sans-serif)}
:host(.live){display:contents}
ha-icon{--mdc-icon-size:20px;display:flex}
.ph{display:none;align-items:center;gap:10px;padding:10px 12px;border-radius:16px;border:1px dashed var(--divider-color,#666);color:var(--primary-text-color);font-size:13px}
:host(.edit) .ph{display:flex}
.ph .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pop{position:fixed;inset:0;z-index:var(--nova-popup-z-index,6);display:flex;align-items:center;justify-content:center}
.pop[hidden]{display:none}
.ov{position:absolute;inset:0;background:var(--nv-popup-backdrop);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;transition:opacity .22s}
.sh{position:relative;display:flex;flex-direction:column;box-sizing:border-box;width:min(var(--pw,1180px),96vw);max-height:88vh;
background:var(--nv-popup-bg);color:var(--nv-fg);border-radius:var(--nv-popup-r);border:1px solid var(--nv-border);
box-shadow:0 20px 60px rgba(0,0,0,.45);overflow:hidden;opacity:0;transform:translateY(40px);transition:transform .26s cubic-bezier(.2,.8,.2,1),opacity .2s}
.sh.tint{background:linear-gradient(160deg,color-mix(in srgb,var(--tc) 55%,var(--nv-popup-base)),var(--nv-popup-base))}
.pop.in .ov{opacity:1}.pop.in .sh{opacity:1;transform:none}
.grip{display:none;justify-content:center;padding:8px 0 0;flex:none;touch-action:none}.grip i{width:40px;height:5px;border-radius:3px;background:currentColor;opacity:.35}
.hd{display:flex;align-items:center;gap:10px;margin:14px 14px 10px;padding:6px 6px 6px 14px;border-radius:999px;flex:none;touch-action:pan-x;
background:var(--nv-popup-head);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
.hi:empty{display:none}
.tt{flex:1 1 auto;min-width:min(30%,120px);font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.bdg{display:flex;gap:6px;flex:0 1 auto;min-width:0;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.bdg::-webkit-scrollbar{display:none}.bdg:empty{display:none}
.bd{display:inline-flex;align-items:center;gap:5px;flex:none;padding:5px 10px;border-radius:999px;background:var(--c,var(--nv-chip));color:var(--cf,inherit);font-size:12px;white-space:nowrap;cursor:pointer;outline:none}
.bd ha-icon{--mdc-icon-size:15px}.bd img{width:15px;height:15px}.bd:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}.bd:active{transform:scale(.95)}
.bd .bn:empty,.bd .bv:empty{display:none}.bd .bn:not(:empty)+.bv:not(:empty)::before{content:'· '}
.bd[hidden]{display:none}
.x{width:36px;height:36px;border-radius:50%;border:none;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:inherit;cursor:pointer;padding:0}
.x:active{transform:scale(.92)}
.info{padding:0 14px 12px}
.body{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;box-sizing:border-box;
padding:0 14px calc(16px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:12px}
.pop.inline .cell.empty{min-height:72px;border:2px dashed var(--nv-box-border);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:12.5px;opacity:.7}
.pop.inline .cell.empty::after{content:'Leerer Platz'}
@media(max-width:600px){
.pop{align-items:flex-end}
.bd .bn{display:none}.bd .bv::before{content:none!important}.bd{padding:5px 8px}
.sh{width:100vw;height:88vh;max-height:none;border-radius:var(--nv-popup-r) var(--nv-popup-r) 0 0;border-bottom:none;opacity:1;transform:translateY(100%)}
.grip{display:flex}.hd{margin:8px 12px 10px}.info{padding:0 12px 10px}
.body{padding:0 12px calc(88px + env(safe-area-inset-bottom))}}
.pop.inline{position:static;display:block}.pop.inline .ov,.pop.inline .grip{display:none}
.pop.inline .sh{width:auto;height:auto;max-height:none;opacity:1;transform:none;border-radius:var(--nv-popup-r);box-shadow:none;border-bottom:1px solid var(--nv-border)}
.pop.inline .body{overflow:visible;padding-bottom:14px}
@media(prefers-reduced-motion:reduce){.ov,.sh{transition:none}}`;
  var NovaPopupCard = class extends GridCard(HTMLElement) {
    static getConfigElement() {
      return document.createElement(tag("popup-card-editor"));
    }
    static getStubConfig() {
      return { hash: "neu", rows: [{ cells: [{ card: null }] }, { cells: [{ card: null }, { card: null }] }] };
    }
    constructor() {
      super();
      const r = this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${PCSS2}</style>
<div class="ph"><ha-icon icon="mdi:card-multiple-outline"></ha-icon><span class="t"></span></div>
<div class="pop" hidden><div class="ov"></div><div class="sh" role="dialog" aria-modal="true">
<div class="grip"><i></i></div>
<div class="hd"><span class="hi"></span><span class="tt"></span><div class="bdg"></div><button type="button" class="x" aria-label="Schließen" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></button></div>
<div class="info" hidden></div><div class="body"></div></div></div>`;
      this._pop = r.querySelector(".pop");
      this._sh = r.querySelector(".sh");
      this._body = r.querySelector(".body");
      this._infoEl = r.querySelector(".info");
      this._bdgEl = r.querySelector(".bdg");
      this._mode = "live";
      r.querySelector(".x").addEventListener("click", () => this.close());
      r.querySelector(".ov").addEventListener("click", () => this.close());
      r.querySelector(".ov").addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
      this._sync = () => this._syncOpen();
      this._key = (e) => {
        if (e.key !== "Escape" || e.defaultPrevented) return;
        if (e.composedPath().some((n) => n.localName?.includes("dialog"))) return;
        this.close();
      };
      this._swipe();
      this._ro = new ResizeObserver(() => this._stack());
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      const old = this._cfg?.hash;
      this._cfg = {
        ...DEF,
        ...c,
        hash: cleanHash(c.hash),
        info: [].concat(c.info || []).map((x) => typeof x === "string" ? { entity: x } : x),
        badges: [].concat(c.badges || []).map((x) => typeof x === "string" ? { entity: x } : x).filter((x) => x?.entity)
      };
      this._rows = normRows(c);
      this._ids = entityIds([this._cfg.info, this._cfg.badges]);
      if (this.isConnected && old !== this._cfg.hash) {
        this._unreg(old);
        this._reg();
      }
      this._head();
      this._dirty = true;
      if (this._isOpen || this._mode === "preview") this._grid();
      this._syncOpen();
    }
    // Die eingebetteten Karten bekommen jedes Update (sie filtern selbst), Kopfzeile und Info-Leiste nur bei eigenen Änderungen
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._isOpen && this._mode !== "preview") return;
      if (old === h || hassChanged(old, h, this._ids)) this._info();
      this._cells().forEach((el2) => this._setHass(el2));
    }
    getCardSize() {
      return this._mode === "live" ? 0 : 1;
    }
    getGridOptions() {
      return { columns: "full", rows: "auto" };
    }
    connectedCallback() {
      this._ro.observe(this._body);
      ["hashchange", "popstate", "location-changed"].forEach((ev) => window.addEventListener(ev, this._sync));
      this._detect();
      requestAnimationFrame(() => this._detect());
    }
    disconnectedCallback() {
      ["hashchange", "popstate", "location-changed"].forEach((ev) => window.removeEventListener(ev, this._sync));
      this._ro.disconnect();
      this._unreg(this._cfg?.hash);
      if (this._isOpen) this._hide(true);
      if (this._mode === "preview") this._handOffCells();
    }
    _reg() {
      if (this._cfg?.hash && this._mode !== "preview") register(this._cfg.hash, this);
    }
    _unreg(h) {
      if (h) unregister(h, this);
    }
    _detect() {
      if (!this.isConnected) return;
      let inDialog = false, inEdit = !!(this.preview || this.hasAttribute("preview") || this.editMode);
      for (let n = this, i = 0; n && i < 80; i++) {
        if (PREV.has(n.tagName) || n.tagName?.includes("DIALOG")) {
          inDialog = true;
          break;
        }
        if (EDIT.has(n.tagName)) inEdit = true;
        n = n.parentElement || n.getRootNode?.().host;
      }
      let m = inDialog ? "preview" : inEdit ? "edit" : "live";
      if (this._fallback) m = "live";
      const was = this._mode;
      this._mode = m;
      ["live", "edit", "preview"].forEach((k) => this.classList.toggle(k, k === m));
      this._pop.classList.toggle("inline", m === "preview");
      this._unreg(this._cfg?.hash);
      this._reg();
      if (m === "preview") {
        if (this._isOpen) this._hide(true);
        this._pop.hidden = false;
        if (this._dirty) this._grid();
        if (this._h) this.hass = this._h;
      } else if (was === "preview") this._pop.hidden = true;
      this._syncOpen();
    }
    /* --- Öffnen & Schließen --- */
    _syncOpen() {
      if (!this._cfg || this._mode === "preview") return;
      const want = this.isConnected && !!this._cfg.hash && curHash() === this._cfg.hash;
      if (want && !this._isOpen) this._show();
      else if (!want && this._isOpen) this._hide();
    }
    _show() {
      if (this._fallback && hasPopup(this._cfg.hash)) return;
      this._isOpen = true;
      this._back = cameByNav();
      clearTimeout(this._ht);
      this._pop.hidden = false;
      this._sh.style.transform = "";
      lockScroll(true);
      if (this._dirty) this._grid();
      if (this._h) this.hass = this._h;
      this._body.scrollTop = 0;
      window.addEventListener("keydown", this._key);
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (this._isOpen) this._pop.classList.add("in");
      }));
    }
    _hide(now) {
      this._isOpen = false;
      this._pop.classList.remove("in");
      this._sh.style.transform = "";
      lockScroll(false);
      window.removeEventListener("keydown", this._key);
      clearTimeout(this._ht);
      if (now) this._pop.hidden = this._mode !== "preview";
      else this._ht = setTimeout(() => {
        if (!this._isOpen && this._mode !== "preview") this._pop.hidden = true;
      }, 260);
    }
    // Schließen = Hash entfernen; das eigentliche Ausblenden folgt über _syncOpen
    close() {
      if (!this._isOpen) return;
      if (curHash() === this._cfg.hash) clearHash(this._back);
      else this._hide();
    }
    // Nach unten wischen (Handy): auf Griff/Kopfzeile immer, im Inhalt nur, wenn er ganz oben steht
    _swipe() {
      const sh = this._sh;
      let y0 = 0, x0 = 0, dy = 0, t0 = 0, ok2 = false, drag = false;
      const mobile = () => matchMedia("(max-width:600px)").matches;
      sh.addEventListener("touchstart", (e) => {
        ok2 = this._isOpen && mobile() && e.touches.length === 1 && (!e.composedPath().includes(this._body) || this._body.scrollTop <= 0);
        if (!ok2) return;
        y0 = e.touches[0].clientY;
        x0 = e.touches[0].clientX;
        dy = 0;
        t0 = Date.now();
        drag = false;
      }, { passive: true });
      sh.addEventListener("touchmove", (e) => {
        if (!ok2) return;
        const d = e.touches[0].clientY - y0, dx = e.touches[0].clientX - x0;
        if (!drag) {
          if (Math.abs(d) < 8 && Math.abs(dx) < 8) return;
          if (d <= 0 || Math.abs(dx) > d) {
            ok2 = false;
            return;
          }
          drag = true;
          sh.style.transition = "none";
        }
        dy = Math.max(0, d);
        e.preventDefault();
        sh.style.transform = `translateY(${dy}px)`;
      }, { passive: false });
      const end = () => {
        if (!drag) {
          ok2 = false;
          return;
        }
        drag = false;
        ok2 = false;
        sh.style.transition = "";
        if (dy > 120 || dy / Math.max(1, Date.now() - t0) > 0.6) this.close();
        else sh.style.transform = "";
      };
      sh.addEventListener("touchend", end);
      sh.addEventListener("touchcancel", end);
    }
    /* --- Kopfzeile --- */
    _head() {
      const c = this._cfg, r = this.shadowRoot;
      r.querySelector(".tt").textContent = c.title || "";
      const hi = r.querySelector(".hi");
      if (c.icon) setIcon(hi, c.icon);
      else {
        hi.innerHTML = "";
        hi._ic = null;
      }
      r.querySelector(".ph .t").textContent = c.title || (c.hash ? `#${c.hash}` : "Kein Hash eingestellt");
      r.querySelector(".ph ha-icon").setAttribute("icon", c.icon || "mdi:card-multiple-outline");
      this._sh.style.setProperty("--pw", `${+c.width || DEF.width}px`);
      const tint = c.tint || c.color;
      this._sh.classList.toggle("tint", !!tint);
      if (tint) this._sh.style.setProperty("--tc", roleVars(tint).c);
      if (c.title || c.hash) this._sh.setAttribute("aria-label", c.title || c.hash);
      else this._sh.removeAttribute("aria-label");
      this._infoEl.classList.toggle("scroll", c.info_layout === "scroll");
      this._bds = null;
      if (this._h) this._info();
    }
    // Badges in der Kopfzeile: optional nur bei bestimmtem Zustand, Farbe aus den Farbrollen
    _badges() {
      const items = this._cfg.badges, h = this._h, bar = this._bdgEl;
      if (!this._bds || this._bds.length !== items.length) {
        bar.innerHTML = "";
        this._bds = items.map((o) => {
          const d = document.createElement("div");
          d.className = "bd";
          d.tabIndex = 0;
          d.setAttribute("role", "button");
          d.innerHTML = '<span class="ci"></span><span class="bn"></span><span class="bv"></span>';
          if (o.color) {
            const v = roleVars(o.color);
            d.style.setProperty("--c", v.c);
            d.style.setProperty("--cf", v.fg);
          }
          const open = () => moreInfo(this, o.entity);
          d.addEventListener("click", (e) => {
            e.stopPropagation();
            open();
          });
          d.addEventListener("keydown", (e) => {
            if (e.key === "Enter" || e.key === " ") {
              e.preventDefault();
              open();
            }
          });
          bar.appendChild(d);
          return d;
        });
      }
      items.forEach((o, i) => {
        const d = this._bds[i], s = h.states[o.entity];
        d.hidden = !s || o.state != null && o.state !== "" && !list(o.state).includes(s.state);
        if (d.hidden) return;
        setIcon(d.querySelector(".ci"), iconOf(h, o, "mdi:information-outline"));
        d.querySelector(".bn").textContent = o.name || "";
        d.querySelector(".bv").textContent = o.show_state === false ? "" : valueOf(h, s, o);
        d.title = `${nameOf(h, o)}: ${valueOf(h, s, o)}`;
      });
    }
    _info() {
      this._badges();
      renderChips(this, this._infoEl, this._cfg.info, this._h);
    }
    /* --- Raster (GridCard) --- */
    _handoff() {
      return this._mode === "preview";
    }
  };
  __publicField(NovaPopupCard, "gridKind", "popup");
  define("popup-card", NovaPopupCard, { name: "Nova Pop-up Card", description: "Pop-up mit beliebigen Karten, geöffnet per URL-Hash (z. B. #wohnzimmer) – vom Dock oder jeder Karte mit Navigations-Aktion.", documentationURL: docUrl("nova-pop-up-card") });
  var GENERAL = [
    { name: "hash", required: true, selector: T },
    g2({ name: "title", selector: T }, { name: "icon", selector: I }),
    ROLE("tint"),
    g2(
      { name: "width", selector: { number: { min: 320, max: 1600, step: 10, mode: "box", unit_of_measurement: "px" } } },
      { name: "stack_below", selector: { number: { min: 0, max: 1200, step: 10, mode: "box", unit_of_measurement: "px" } } }
    )
  ];
  var BADGE = [
    ENT,
    NAMEICON,
    g2({ name: "show_state", selector: { boolean: {} } }, ROLE("color")),
    { name: "state", selector: T }
  ];
  var HEAD = [sel("info_layout", [["wrap", "Umbrechen"], ["scroll", "Waagrecht scrollen"]])];
  var LABELS2 = {
    ...GRID_LABELS,
    hash: "Hash (ohne #)",
    title: "Titel",
    icon: "Icon",
    tint: "Farbton (leer = Nova-Glas)",
    color: "Farbe",
    show_state: "Zustand anzeigen",
    state: "Nur anzeigen bei Zustand",
    width: "Max. Breite (Desktop)",
    stack_below: "Untereinander unter Breite",
    info_layout: "Info-Leiste bei vielen Einträgen",
    entity: "Entität",
    name: "Eigener Name (optional)",
    decimals: "Nachkommastellen",
    alert: "Bei Achtung hervorheben",
    alert_state: "Achtung bei Zustand",
    alert_color: "Farbe",
    alert_above: "Achtung über",
    alert_below: "Achtung unter"
  };
  var HELPERS2 = {
    ...GRID_HELPERS,
    hash: "Öffnet das Pop-up, wenn die Adresse auf #… endet. Beispiel: wohnzimmer → Navigations-Aktion auf #wohnzimmer.",
    title: "Steht mit dem Icon oben im Pop-up und in den Auswahllisten von Dock und Raum-Karte.",
    stack_below: "Ist das Pop-up schmaler als dieser Wert, stehen alle Karten untereinander (0 = nie).",
    state: "Optional, z. B. on (Fenster offen). Mehrere mit Komma. Leer = immer anzeigen.",
    color: "Leer = neutral.",
    alert_state: "z. B. on oder open, mehrere mit Komma. Leer = an bzw. Problem (z. B. Fenster offen)."
  };
  var NovaPopupCardEditor = class extends GridEditor(NovaEditorBase) {
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}${GRID_ED_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap");
      this._gridReset();
      if (!this._init) {
        this._init = true;
        this._secs = /* @__PURE__ */ new Set([this._config.hash ? "sec.content" : "sec.general"]);
      }
      this._secs.forEach((k) => this._open.add(k));
      w.append(this._secGeneral(), this._secHead(), this._secLayout(), this._secContent());
    }
    _sec(key, icon, label) {
      const [d, , b] = this._details(key, icon, label, []);
      d.addEventListener("toggle", () => {
        if (d.open) this._secs.add(key);
        else this._secs.delete(key);
      });
      return [d, b];
    }
    _secGeneral() {
      const [d, b] = this._sec("sec.general", "mdi:cog-outline", "Allgemein");
      const data = { ...this._config };
      delete data.rows;
      delete data.info;
      delete data.badges;
      if (data.color && !data.tint) data.tint = data.color;
      const f = this._form(GENERAL, data, (v) => {
        const c = merge(this._config, names(GENERAL), v);
        delete c.color;
        if (v.hash != null) {
          const h = cleanHash(v.hash);
          if (h !== v.hash) f.data = { ...v, hash: h };
          if (h) c.hash = h;
          else delete c.hash;
        }
        this._emit(c);
      });
      b.append(f);
      if (!this._config.hash) b.append(this._hint("Ohne Hash lässt sich das Pop-up nicht öffnen."));
      return d;
    }
    _secHead() {
      const [d, b] = this._sec("sec.header", "mdi:information-outline", "Kopfzeile & Info-Leiste");
      b.append(this._hint("Titel und Icon stehen unter „Allgemein“. Badges sitzen in der Kopfzeile, Info-Entitäten als Chips darunter. Antippen öffnet die Details."));
      b.append(this._form(HEAD, { info_layout: DEF.info_layout, ...this._config }, (v) => {
        const c = merge(this._config, names(HEAD), v);
        if (c.info_layout === DEF.info_layout) delete c.info_layout;
        this._emit(c);
      }));
      b.append(Object.assign(document.createElement("h4"), { textContent: "Badges" }));
      b.append(this._hint("Kleine Anzeigen rechts neben dem Titel. Auf schmalen Bildschirmen nur Icon und Zustand, bei Platzmangel waagrecht scrollbar."));
      this._itemList(b, "badges", BADGE, { item: "Badge", icon: "mdi:label-outline" }, "Badge hinzufügen", (it) => ({ show_state: true, ...it }));
      b.append(Object.assign(document.createElement("h4"), { textContent: "Info-Leiste" }));
      this._itemList(b, "info", INFO, { item: "Info", icon: "mdi:information-outline" }, "Info-Entität hinzufügen");
      return d;
    }
    _secLayout() {
      const [d, b] = this._sec("sec.layout", "mdi:view-grid-outline", "Layout & Vorlage");
      this._layoutBody(b);
      return d;
    }
    _onTemplate() {
      this._secs.add("sec.content");
    }
    _secContent() {
      const [d, b] = this._sec("sec.content", "mdi:view-dashboard-edit-outline", "Inhalt");
      this._contentBody(b);
      return d;
    }
  };
  __publicField(NovaPopupCardEditor, "gridWhere", "im Pop-up");
  __publicField(NovaPopupCardEditor, "labels", LABELS2);
  __publicField(NovaPopupCardEditor, "helpers", HELPERS2);
  define("popup-card-editor", NovaPopupCardEditor);

  // src/shared/chips.js
  var CHIP_TYPES = [["value", "Wert (zeigt den Zustand)"], ["button", "Knopf (führt eine Aktion aus)"]];
  var CHIP_PRESETS = {
    lights_off: {
      label: "Alle Lichter im Raum aus",
      icon: "mdi:lightbulb-off-outline",
      need: "area",
      run: (card, ctx) => card._h.callService("light", "turn_off", {}, { area_id: ctx.area })
    }
  };
  var normChips = (arr) => [].concat(arr || []).map((x) => typeof x === "string" ? { entity: x } : x).filter((x) => x && typeof x === "object").map((x) => ({ type: "value", ...x })).filter((x) => x.type === "button" ? CHIP_PRESETS[x.preset] || x.tap_action?.action : x.entity);
  var NOVA_CHIPS_CSS = `
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
  function renderNovaChips(card, box, items, h, ctx = {}) {
    const key = JSON.stringify(items);
    if (box._key !== key) {
      box._key = key;
      box._els = items.map((o) => {
        const d = document.createElement("div");
        d.className = "nchip";
        d.tabIndex = 0;
        d.setAttribute("role", "button");
        d.innerHTML = '<span class="ci"></span><span class="cn"></span><span class="cv"></span>';
        if (o.color) {
          const v = roleVars(o.color);
          d.style.setProperty("--c", v.c);
          d.style.setProperty("--cf", v.fg);
          d.classList.add("col");
        }
        const run = () => chipTap(card, o, ctx);
        d.addEventListener("click", (e) => {
          e.stopPropagation();
          run();
        });
        d.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            run();
          }
        });
        return d;
      });
      box.replaceChildren(...box._els);
    }
    items.forEach((o, i) => {
      const d = box._els[i], s = o.entity && h.states[o.entity], pre = CHIP_PRESETS[o.preset];
      d.hidden = !!o.state && o.state !== "" && !(s && list(o.state).includes(s.state));
      if (d.hidden) return;
      const val = o.type !== "button";
      setIcon(d.querySelector(".ci"), o.icon || (val ? o.entity ? iconOf(h, o, "mdi:information-outline") : "" : pre?.icon || ""));
      d.querySelector(".cn").textContent = o.name ?? (val ? "" : pre?.label || "");
      d.querySelector(".cv").textContent = val ? s ? valueOf(h, s, o) : "Nicht gefunden" : "";
      d.classList.toggle("na", val && (!s || s.state === "unavailable"));
      d.title = o.name || (val && s ? s.attributes.friendly_name || o.entity : pre?.label || "");
    });
  }
  function chipTap(card, o, ctx) {
    const pre = o.type === "button" && CHIP_PRESETS[o.preset];
    if (pre) {
      if (!pre.need || ctx[pre.need]) pre.run(card, ctx);
      return;
    }
    if (o.tap_action?.action) return hassAction(card, { entity: o.entity, tap_action: o.tap_action }, "tap");
    if (o.type !== "button" && o.entity) moreInfo(card, o.entity);
  }
  var chipSchema = (o, ctx = {}) => {
    const btn = o.type === "button";
    const presets = Object.entries(CHIP_PRESETS).filter(([, p]) => !p.need || ctx[p.need]);
    return [
      sel("type", CHIP_TYPES),
      ...btn ? [] : [ENT],
      NAMEICON,
      ROLE("color"),
      ...btn && presets.length ? [sel("preset", [["custom", "Eigene Aktion"], ...presets.map(([k, p]) => [k, p.label])])] : [],
      ...btn && CHIP_PRESETS[o.preset] ? [] : [{ name: "tap_action", selector: A }],
      ...btn ? [{ name: "entity", selector: { entity: {} } }] : [],
      { name: "state", selector: T }
    ];
  };
  var chipView = (o) => ({ type: "value", ...o, ...o.type === "button" ? { preset: o.preset || "custom" } : {} });
  var CHIP_LABELS = {
    type: "Art",
    entity: "Entität",
    name: "Name",
    icon: "Icon",
    color: "Farbe",
    preset: "Aktion",
    tap_action: "Aktion beim Antippen",
    state: "Nur anzeigen bei Zustand"
  };
  var CHIP_HELPERS = {
    color: "Leer = neutral.",
    state: "z. B. on, mehrere mit Komma. Leer = immer anzeigen. Bei Knöpfen bezieht es sich auf die gewählte Entität.",
    tap_action: "Bei Wert-Chips: leer = Details öffnen."
  };

  // src/area.js
  var DEF2 = { stack_below: 500, chips_layout: "wrap" };
  var ACSS = `${CARD_CSS}${GRID_CSS}${NOVA_CHIPS_CSS}
:host{height:auto}
:host(.tint)::before{background:linear-gradient(160deg,color-mix(in srgb,var(--tc) 45%,transparent),transparent 75%),var(--nv-bg)}
.g{height:auto;display:flex;flex-direction:column;gap:12px;padding:14px}
.hd{display:flex;align-items:center;gap:10px;padding:6px;border-radius:999px;background:var(--nv-chip)}
.hd.nb{padding-left:14px}
.hi{display:flex}.hi:empty{display:none}
.tt{flex:1 1 auto;min-width:0;font-weight:600;font-size:15px;overflow-wrap:anywhere}
.x{width:36px;height:36px;border-radius:50%;border:none;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:inherit;cursor:pointer;padding:0}
.x:active{transform:scale(.92)}
.x:focus-visible{outline:none;box-shadow:0 0 0 2px var(--nv-active)}
.x[hidden]{display:none}
.hd .nchips{flex:0 1 auto;justify-content:flex-end}
.hd .nchip{min-height:36px}
.body{display:flex;flex-direction:column;gap:12px}
.cell>*{min-width:0}
.prev .cell.empty{min-height:72px;border:2px dashed var(--nv-box-border);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:12.5px;opacity:.7}
.prev .cell.empty::after{content:'Leerer Platz'}
@media(max-width:600px){.g{padding:12px}.hd .nchip .ci:not(:empty)~.cn{display:none}.hd .nchip .ci:not(:empty)~.cv::before{content:none}}`;
  var NovaAreaCard = class extends GridCard(HTMLElement) {
    static getConfigElement() {
      return document.createElement(tag("area-card-editor"));
    }
    static getStubConfig(h) {
      const area = Object.keys(h?.areas || {})[0];
      return { ...area ? { area } : {}, rows: [{ cells: [{ card: null }, { card: null }] }] };
    }
    constructor() {
      super();
      const r = this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${ACSS}</style>
<div class="g"><div class="hd"><button type="button" class="x bk" aria-label="Zurück" title="Zurück"><ha-icon icon="mdi:arrow-left"></ha-icon></button>
<span class="hi"></span><span class="tt"></span><div class="nchips"></div></div>
<div class="body"></div></div>`;
      const q = (s) => r.querySelector(s);
      this._g = q(".g");
      this._hd = q(".hd");
      this._bk = q(".bk");
      this._body = q(".body");
      this._chips = q(".nchips");
      this._bk.addEventListener("click", () => this._back());
      this._ro = new ResizeObserver(() => this._stack());
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      this._cfg = { ...DEF2, ...c, chips: normChips(c.chips) };
      this._ids = entityIds(this._cfg.chips);
      this._rows = normRows(c);
      this._dirty = true;
      if (this.isConnected) this._grid();
      if (this._h) this._render();
    }
    // Die eingebetteten Karten bekommen jedes Update (sie filtern selbst), die Kopfzeile nur bei eigenen Änderungen
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._cfg) return;
      if (hassChanged(old, h, this._ids)) this._render();
      this._cells().forEach((el2) => this._setHass(el2));
    }
    getCardSize() {
      return 2 + 3 * (this._rows?.length || 0);
    }
    getGridOptions() {
      return { columns: "full", rows: "auto" };
    }
    connectedCallback() {
      this._ro.observe(this._body);
      this._detect();
      requestAnimationFrame(() => this._detect());
      if (this._dirty && this._cfg) this._grid();
    }
    disconnectedCallback() {
      this._ro.disconnect();
      if (this._prev) this._handOffCells();
    }
    // Editor-Vorschau (Zellen übernehmen) bzw. Bearbeitungsmodus (leere Plätze zeigen)
    _detect() {
      let prev2 = false, edit = !!(this.preview || this.editMode);
      for (let n = this, i = 0; n && i < 80; i++) {
        if (PREV.has(n.tagName) || n.tagName?.includes("DIALOG")) {
          prev2 = true;
          break;
        }
        if (EDIT.has(n.tagName)) edit = true;
        n = n.parentElement || n.getRootNode?.().host;
      }
      this._prev = prev2;
      this._g.classList.toggle("prev", prev2 || edit);
    }
    _handoff() {
      return this._prev;
    }
    _back() {
      const a = this._cfg.back_action;
      if (!a?.action) return history.back();
      hassAction(this, { tap_action: a }, "tap");
    }
    _render() {
      const h = this._h, c = this._cfg, ar = h.areas?.[c.area];
      const r = this.shadowRoot, noBack = c.back_action?.action === "none";
      this._bk.hidden = noBack;
      this._hd.classList.toggle("nb", noBack);
      r.querySelector(".tt").textContent = c.name || ar?.name || (c.area ? c.area : "Keine Area gewählt");
      setIcon(r.querySelector(".hi"), c.icon || ar?.icon || "mdi:texture-box");
      const tint = c.tint;
      this.classList.toggle("tint", !!tint);
      if (tint) this.style.setProperty("--tc", roleVars(tint).c);
      else this.style.removeProperty("--tc");
      this._chips.classList.toggle("scroll", c.chips_layout === "scroll");
      renderNovaChips(this, this._chips, c.chips, h, { area: c.area });
    }
  };
  __publicField(NovaAreaCard, "gridKind", "area");
  define("area-card", NovaAreaCard, { name: "Nova Bereich Card", description: "Raumansicht als Glasrahmen: Kopfzeile mit Zurück, Icon, Raumname und Chips, darunter beliebige Karten in Zeilen und Spalten.", documentationURL: docUrl("nova-bereich-card") });
  var S_GEN3 = (icon) => [
    { name: "area", selector: { area: {} } },
    g2({ name: "name", selector: T }, { name: "icon", selector: { icon: icon ? { placeholder: icon } : {} } }),
    { name: "back_action", selector: A },
    g2(ROLE("tint"), { name: "stack_below", selector: { number: { min: 0, max: 1200, step: 10, mode: "box", unit_of_measurement: "px" } } })
  ];
  var S_CHIPS = [sel("chips_layout", [["wrap", "Umbrechen"], ["scroll", "Waagrecht scrollen"]])];
  var LABELS3 = {
    ...CHIP_LABELS,
    ...GRID_LABELS,
    area: "Area",
    name: "Name",
    icon: "Icon",
    back_action: "Zurück-Knopf: Aktion",
    tint: "Farbton (leer = Nova-Glas)",
    stack_below: "Untereinander unter Breite",
    chips_layout: "Bei vielen Chips"
  };
  var HELPERS3 = {
    ...CHIP_HELPERS,
    ...GRID_HELPERS,
    back_action: "Ohne Angabe geht es eine Seite zurück. „Keine Aktion“ blendet den Knopf aus.",
    stack_below: "Ist die Karte schmaler als dieser Wert, stehen alle Karten untereinander (0 = nie)."
  };
  var strip = (c) => {
    Object.keys(DEF2).forEach((k) => {
      if (c[k] === DEF2[k]) delete c[k];
    });
    return c;
  };
  var NovaAreaCardEditor = class extends GridEditor(NovaEditorBase) {
    // Area-Icon hängt an hass – beim ersten hass einmal neu aufbauen
    set hass(h) {
      const first = !this._hass;
      super.hass = h;
      if (first && h && this._config) this._rebuild();
    }
    _onTemplate() {
      this._openSecs?.add("content");
    }
    _build() {
      const r = this.shadowRoot, c = this._config, h = this._hass;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}${GRID_ED_CSS}</style><div class="wrap"></div>`;
      this._gridReset();
      const data = { ...DEF2, ...c };
      const form = (sch) => this._form(sch, data, (v) => this._emit(strip(merge(this._config, names(sch), v))));
      r.querySelector(".wrap").append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => {
          const sch = S_GEN3(h?.areas?.[c.area]?.icon);
          b.append(
            this._form(sch, data, (v) => {
              const n = strip(merge(this._config, names(sch), v));
              const re = n.area !== this._config.area;
              this._emit(n);
              if (re) this._rebuild();
            }),
            this._hint("Name und Icon leer = wie in der Area.")
          );
        }),
        this._section("chips", "mdi:label-multiple-outline", "Chips in der Kopfzeile", (b) => {
          b.append(this._hint("Rechts neben dem Raumnamen. Wert-Chips zeigen den Zustand einer Entität, Knopf-Chips führen eine Aktion aus (z. B. „Alle Lichter im Raum aus“, Szene, Skript). Auf dem Handy zeigen Chips mit Icon nur das Icon bzw. Icon und Wert."));
          this._itemList(b, "chips", (o) => chipSchema(o, { area: !!this._config.area }), { item: "Chip", icon: "mdi:label-outline" }, "Chip hinzufügen", chipView);
          b.append(form(S_CHIPS));
        }),
        this._section("layout", "mdi:view-grid-outline", "Layout & Vorlage", (b) => this._layoutBody(b)),
        this._section("content", "mdi:view-dashboard-edit-outline", "Inhalt", (b) => this._contentBody(b))
      );
    }
  };
  __publicField(NovaAreaCardEditor, "gridWhere", "in der Karte");
  __publicField(NovaAreaCardEditor, "labels", LABELS3);
  __publicField(NovaAreaCardEditor, "helpers", HELPERS3);
  __publicField(NovaAreaCardEditor, "openSections", ["general"]);
  define("area-card-editor", NovaAreaCardEditor);

  // src/chips.js
  var DEF3 = { layout: "wrap" };
  var CSS = `${NOVA_VARS}${NOVA_CHIPS_CSS}
:host{display:block;color:var(--nv-fg);font-family:var(--ha-font-family-body,Roboto,sans-serif)}
.nchips:empty{display:flex;min-height:34px}
.hint{font-size:13px;opacity:.7;padding:8px 2px}`;
  var NovaChipsCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("chips-card-editor"));
    }
    static getStubConfig(h) {
      const t = Object.keys(h?.states || {}).find((id) => h.states[id].attributes.device_class === "temperature");
      return { chips: t ? [{ type: "value", entity: t }] : [] };
    }
    constructor() {
      super();
      const r = this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${CSS}</style><div class="nchips"></div>`;
      this._box = r.querySelector(".nchips");
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      this._cfg = { ...DEF3, ...c, chips: normChips(c.chips) };
      this._ids = entityIds(this._cfg.chips);
      this._box.classList.toggle("scroll", this._cfg.layout === "scroll");
      if (this._h) this._render();
    }
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (this._cfg && hassChanged(old, h, this._ids)) this._render();
    }
    getCardSize() {
      return 1;
    }
    getGridOptions() {
      return { columns: "full", rows: "auto" };
    }
    _render() {
      renderNovaChips(this, this._box, this._cfg.chips, this._h, { area: this._cfg.area });
    }
  };
  define("chips-card", NovaChipsCard, { name: "Nova Chips Card", description: "Eine Reihe frei belegbarer Chips: Werte von Entitäten oder Knöpfe mit Aktion, z. B. „Alle Lichter im Raum aus“.", documentationURL: docUrl("nova-chips-card") });
  var S_GEN4 = [
    { name: "area", selector: { area: {} } },
    sel("layout", [["wrap", "Umbrechen"], ["scroll", "Waagrecht scrollen"]])
  ];
  var LABELS4 = { ...CHIP_LABELS, area: "Area (für „Alle Lichter im Raum aus“)", layout: "Bei vielen Chips" };
  var HELPERS4 = { ...CHIP_HELPERS, area: "Nur nötig für die Schnellauswahl „Alle Lichter im Raum aus“." };
  var NovaChipsCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      r.querySelector(".wrap").append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(this._form(S_GEN4, { ...DEF3, ...this._config }, (v) => {
          const c = merge(this._config, names(S_GEN4), v);
          if (c.layout === DEF3.layout) delete c.layout;
          this._emit(c);
          if (!!c.area !== !!this._built) this._rebuild();
        }))),
        this._section("chips", "mdi:label-multiple-outline", "Chips", (b) => {
          b.append(this._hint("Wert-Chips zeigen den Zustand einer Entität, Knopf-Chips führen eine Aktion aus (Szene, Skript, Dienst …). „Alle Lichter im Raum aus“ gibt es, sobald unter „Allgemein“ eine Area gewählt ist."));
          this._itemList(b, "chips", (o) => chipSchema(o, { area: !!this._config.area }), { item: "Chip", icon: "mdi:label-outline" }, "Chip hinzufügen", chipView);
        })
      );
      this._built = !!this._config.area;
    }
  };
  __publicField(NovaChipsCardEditor, "labels", LABELS4);
  __publicField(NovaChipsCardEditor, "helpers", HELPERS4);
  __publicField(NovaChipsCardEditor, "openSections", ["chips"]);
  define("chips-card-editor", NovaChipsCardEditor);

  // src/appliance.js
  var TYPES = {
    washer: { label: "Waschmaschine", icon: "mdi:washing-machine", color: "accent-1", run: "Wäscht", alt: "Schleudert", door: "Tür offen", phase: ["spin", "spinning", "schleudern"] },
    dishwasher: { label: "Spülmaschine", icon: "mdi:dishwasher", color: "accent-1", run: "Spült", door: "Tür offen", phase: [] },
    airfryer: { label: "Airfryer", icon: "mdi:toaster-oven", color: "accent-2", run: "Gart", heat: "Heizt vor", door: "Schublade offen", phase: [] },
    coffee: { label: "Kaffeemaschine", icon: "mdi:coffee-maker-outline", color: "accent-3", run: "Läuft", alt: "Brüht", door: "Tür offen", phase: ["brew", "brewing", "brühen"] },
    generic: { label: "Gerät", icon: "mdi:power-plug-outline", color: "accent-1", run: "Läuft", door: "Tür offen", phase: [] }
  };
  var typeOf = (c) => TYPES[c.device_type] ? c.device_type : "generic";
  var STATES = {
    run: ["run", "running", "on", "cooking", "brewing", "starting", "ending", "anti_wrinkle", "washing", "rinsing", "spinning", "drying", "aborting", "in_use", "programmed_running"],
    pause: ["pause", "paused", "user_paused"],
    wait: ["delayedstart", "delayed_start", "delay_wait", "scheduled", "waiting_to_start"],
    done: ["finished", "finish", "done", "complete", "completed", "clean", "end", "programme_ended"],
    err: ["error", "fault", "failure", "actionrequired", "action_required", "interrupted"],
    prep: ["setting", "programming", "selecting", "adjusting"],
    heat: ["heating", "preheating", "preheat", "heat_up"],
    warm: ["maintain", "keep_warm", "keepwarm", "warming"],
    ready: ["ready", "idle", "standby", "mainmenu"]
  };
  var SORDER = ["err", "pause", "wait", "done", "prep", "heat", "warm", "run", "ready"];
  var ACT = ["run", "pause", "wait", "heat", "warm"];
  var isAct = (cls) => ACT.includes(cls);
  var SKEY = { run: "running_states", pause: "paused_states", wait: "waiting_states", done: "finished_states", err: "error_states", prep: "prep_states", heat: "heat_states", warm: "warm_states", ready: "ready_states" };
  var TKEY = { run: "text_running", pause: "text_paused", wait: "text_waiting", done: "text_finished", err: "text_error", prep: "text_prep", heat: "text_heat", warm: "text_warm", ready: "text_ready", off: "text_off" };
  var TXT = { pause: "Pausiert", wait: "Startet später", done: "Fertig", err: "Störung", prep: "Wird eingestellt", heat: "Heizt auf", warm: "Hält warm", ready: "Bereit", off: "Aus" };
  var BAD = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", ""]);
  var ok = (s) => !!s && !BAD.has(s.state);
  var GDEF = { layout: "full", animation: true, glow: true, hide_when_off: false, start_at: "none" };
  var nice = (raw, t) => t === raw && /_/.test(raw) ? raw.replace(/_/g, " ").replace(/^./, (x) => x.toUpperCase()) : t;
  var fmtOpt = (h, s, o) => {
    let t = o;
    try {
      if (h.formatEntityState) t = h.formatEntityState(s, o);
    } catch {
    }
    return nice(o, t);
  };
  var SECS = { s: 1, sec: 1, min: 60, m: 60, h: 3600, d: 86400 };
  var isDur = (s) => !!s && (SECS[s.attributes.unit_of_measurement] != null || s.attributes.device_class === "duration");
  function secsOf(s) {
    if (!ok(s)) return null;
    const v = String(s.state);
    if (/^\d+:\d{2}(:\d{2})?$/.test(v)) {
      const p = v.split(":").map(Number);
      return p[0] * 3600 + p[1] * 60 + (p[2] || 0);
    }
    if (NUMRE.test(v)) {
      const u = s.attributes.unit_of_measurement;
      return +v * (SECS[u] ?? (s.attributes.device_class === "duration" ? 1 : 60));
    }
    const t = Date.parse(v);
    return isNaN(t) ? null : Math.max(0, (t - Date.now()) / 1e3);
  }
  var fmtDur = (sec) => {
    const m = Math.max(0, Math.round(sec / 60));
    return m < 1 ? "< 1 min" : m < 60 ? `${m} min` : `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")} h`;
  };
  var SA = '<div class="ct sa"><div class="kv"><ha-icon icon="mdi:clock-start"></ha-icon><span class="k">Starten um</span><input type="time" aria-label="Startzeit"><div class="pill now">Sofort</div></div><div class="sah"></div></div>';
  var IC = { start: "mdi:play", pause: "mdi:pause", resume: "mdi:play-pause", stop: "mdi:stop" };
  var DONE = '<g class="done"><circle class="dr" cx="80" cy="82" r="10"/><circle class="dc" cx="80" cy="82" r="10"/><path class="dk" d="M75.5 82 l3 3 l6 -6.5"/></g>';
  var SV = {
    washer: `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="nvw"><circle cx="50" cy="58" r="21"/></clipPath></defs>
<rect class="bd" x="12" y="6" width="76" height="88" rx="10"/><line class="sep" x1="12" y1="22" x2="88" y2="22"/>
<rect class="dw" x="19" y="11" width="18" height="6" rx="2"/><circle class="kn" cx="64" cy="14" r="3.6"/><circle class="led" cx="78" cy="14" r="2"/>
<circle class="door" cx="50" cy="58" r="27"/><circle class="gl" cx="50" cy="58" r="21"/>
<g clip-path="url(#nvw)"><g class="wl"><g class="wv"><path class="wt" d="M0 64 q6.25 -3 12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 V100 H0 Z"/></g></g>
<g class="drum"><circle class="dm" cx="50" cy="58" r="17"/><rect class="lf" x="48.5" y="41" width="3" height="5" rx="1.2"/><rect class="lf" x="48.5" y="41" width="3" height="5" rx="1.2" transform="rotate(120 50 58)"/><rect class="lf" x="48.5" y="41" width="3" height="5" rx="1.2" transform="rotate(240 50 58)"/>
<path class="cl" d="M40 64 q5 -6 10 -1 q4 4 9 -1 q2 6 -5 8 q-8 2 -14 -6 Z"/><path class="cl c2" d="M44 48 q6 -3 10 1 q-2 5 -7 4 q-4 -1 -3 -5 Z"/></g></g>
<path class="sh" d="M35 47 a19 19 0 0 1 11 -8"/>${DONE}</svg>`,
    dishwasher: `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="nvd"><rect x="22" y="26" width="56" height="60" rx="5"/></clipPath></defs>
<rect class="bd" x="14" y="6" width="72" height="88" rx="9"/><line class="sep" x1="14" y1="20" x2="86" y2="20"/>
<rect class="hd2" x="38" y="11" width="24" height="3.5" rx="1.75"/><circle class="led" cx="78" cy="13" r="2"/>
<rect class="gl" x="22" y="26" width="56" height="60" rx="5"/>
<g clip-path="url(#nvd)"><rect class="mist" x="22" y="26" width="56" height="60"/>
<line class="rk" x1="24" y1="50" x2="76" y2="50"/><line class="rk" x1="24" y1="76" x2="76" y2="76"/>
<rect class="pl" x="30" y="36" width="5" height="14" rx="2.5"/><rect class="pl" x="38" y="34" width="5" height="16" rx="2.5"/><rect class="pl" x="46" y="36" width="5" height="14" rx="2.5"/><rect class="pl" x="58" y="40" width="12" height="10" rx="3"/>
<rect class="pl" x="30" y="60" width="5" height="16" rx="2.5"/><rect class="pl" x="38" y="58" width="5" height="18" rx="2.5"/><rect class="pl" x="56" y="62" width="14" height="14" rx="3"/>
<g class="drops"><circle cx="34" cy="80" r="1.3"/><circle cx="44" cy="80" r="1.1"/><circle cx="50" cy="80" r="1.4"/><circle cx="57" cy="80" r="1.1"/><circle cx="66" cy="80" r="1.3"/><circle cx="40" cy="80" r="1"/></g>
<g class="arm"><rect x="30" y="81" width="40" height="2.4" rx="1.2"/><circle cx="50" cy="82.2" r="2.4"/></g></g>${DONE}</svg>`,
    airfryer: `<svg viewBox="0 0 100 100" aria-hidden="true"><g class="heat"><path d="M38 12 q3 -4 0 -8"/><path d="M50 12 q3 -4 0 -8"/><path d="M62 12 q3 -4 0 -8"/></g>
<g class="puff"><path d="M36 64 q3 -4 0 -8 q-3 -4 0 -8"/><path d="M50 64 q3 -4 0 -8 q-3 -4 0 -8"/><path d="M64 64 q3 -4 0 -8 q-3 -4 0 -8"/></g>
<rect class="bd" x="18" y="16" width="64" height="76" rx="15"/><circle class="gl" cx="50" cy="35" r="12"/>
<g class="fr"><rect x="41" y="39" width="3" height="7" rx="1" transform="rotate(-20 42.5 42.5)"/><rect x="46" y="40" width="3" height="7" rx="1" transform="rotate(10 47.5 43.5)"/><rect x="51" y="39" width="3" height="7" rx="1" transform="rotate(-8 52.5 42.5)"/><rect x="56" y="40" width="3" height="6" rx="1" transform="rotate(22 57.5 43)"/></g>
<g class="fan"><path d="M50 35 q-2 -8 3 -10 q2 5 -3 10 Z"/><path d="M50 35 q8 -2 10 3 q-5 2 -10 -3 Z"/><path d="M50 35 q2 8 -3 10 q-2 -5 3 -10 Z"/><path d="M50 35 q-8 2 -10 -3 q5 -2 10 3 Z"/><circle cx="50" cy="35" r="1.6"/></g>
<rect class="disp" x="40" y="52" width="20" height="6" rx="2"/><g class="drw"><rect class="dw" x="22" y="63" width="56" height="25" rx="9"/><rect class="hd2" x="38" y="73" width="24" height="5" rx="2.5"/></g>${DONE}</svg>`,
    coffee: `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="nvc"><path d="M32 64 h22 v12 a7 7 0 0 1 -7 7 h-8 a7 7 0 0 1 -7 -7 Z"/></clipPath></defs>
<rect class="bd" x="58" y="8" width="24" height="80" rx="6"/><rect class="bd" x="18" y="8" width="48" height="22" rx="6"/><rect class="bd" x="18" y="86" width="64" height="7" rx="3"/>
<rect class="dw" x="37" y="30" width="12" height="6" rx="2"/><circle class="led" cx="27" cy="19" r="2"/><circle class="kn" cx="70" cy="22" r="3.6"/>
<line class="flow" x1="43" y1="37" x2="43" y2="80"/>
<g clip-path="url(#nvc)"><rect class="cf" x="30" y="64" width="26" height="22"/></g>
<path class="cup" d="M32 64 h22 v12 a7 7 0 0 1 -7 7 h-8 a7 7 0 0 1 -7 -7 Z"/><path class="cup" d="M54 68 h3 a4 4 0 0 1 0 8 h-3"/>
<g class="steam"><path d="M37 60 q3 -4 0 -8 q-3 -4 0 -8"/><path d="M43 60 q3 -4 0 -8 q-3 -4 0 -8"/><path d="M49 60 q3 -4 0 -8 q-3 -4 0 -8"/></g>${DONE}</svg>`,
    generic: `<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="pulse" cx="50" cy="50" r="30"/><circle class="bd" cx="50" cy="50" r="26"/>
<path class="pw" d="M41 40 a14 14 0 1 0 18 0"/><line class="pw" x1="50" y1="33" x2="50" y2="48"/>${DONE}</svg>`
  };
  var scene = (t) => `<div class="scene">${SV[t]}</div>`;
  var DCSS2 = `
.g.dv{--dc:var(--nv-a1);--dc-fg:var(--nv-a1-fg)}
.g.dv.glow.st-run,.g.dv.glow.st-heat{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--dc) 45%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.dv .on>.ic,.dv .hd .ic.on{background:var(--dc);color:var(--dc-fg);box-shadow:0 0 14px color-mix(in srgb,var(--dc) 55%,transparent)}
.dv .hd small.er{color:var(--nv-error);opacity:1}
.dv .hb.pw.on{background:var(--dc);color:var(--dc-fg)}
.mid{display:flex;gap:14px;align-items:center;min-width:0}
.scene{flex:none;width:92px;height:92px;color:var(--nv-fg)}
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
.scene .sh{fill:none;stroke:#fff;stroke-opacity:.25;stroke-width:1.6;stroke-linecap:round}
.scene .wt{fill:var(--dc);fill-opacity:.45}
.scene .wl{transition:transform .8s}
.scene .dm{fill:none;stroke:currentColor;stroke-opacity:.3;stroke-width:1.2;stroke-dasharray:3 3}
.scene .lf{fill:currentColor;fill-opacity:.35}.scene .cl{fill:currentColor;fill-opacity:.32}.scene .cl.c2{fill-opacity:.22}
.scene .drum,.scene .fan{transform-box:view-box}
.scene .drum{transform-origin:50px 58px}.scene .fan{transform-origin:50px 35px}
.scene .mist{fill:var(--dc);opacity:0}
.scene .pl{fill:currentColor;fill-opacity:.22}
.scene .drops circle{fill:var(--dc);opacity:0}
.scene .arm{fill:currentColor;fill-opacity:.4;transform-box:view-box;transform-origin:50px 82px}
.scene .fan path,.scene .fan circle{fill:currentColor;fill-opacity:.4}
.scene .heat path,.scene .steam path{fill:none;stroke:var(--dc);stroke-width:1.6;stroke-linecap:round;opacity:0}
.scene .steam path{stroke:currentColor;stroke-opacity:.6}
.scene .disp{fill:currentColor;fill-opacity:.16}
.st-run .scene .disp{fill:var(--dc);fill-opacity:.7}
.scene .cup{fill:none;stroke:currentColor;stroke-opacity:.55;stroke-width:1.6;stroke-linejoin:round}
.scene .cf{fill:var(--dc);fill-opacity:.75;transform-box:fill-box;transform-origin:center bottom;transform:scaleY(.15)}
.scene .flow{stroke:var(--dc);stroke-width:2.4;stroke-linecap:round;stroke-dasharray:4 3;opacity:0}
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
.anim.st-run.alt .w-washer .drum{animation:dv-spin .55s linear infinite}
.st-run.alt .w-washer .wl{transform:translateY(12px)}
.anim.st-run .w-dishwasher .arm{animation:dv-arm 1.6s ease-in-out infinite alternate}
.anim.st-run .w-dishwasher .drops circle{animation:dv-drop 1.4s ease-out infinite}
.anim.st-run .w-dishwasher .mist{animation:dv-mist 3.2s ease-in-out infinite}
.scene .fr rect{fill:color-mix(in srgb,var(--dc) var(--pp,0%),currentColor);fill-opacity:calc(.3 + var(--pf,0) * .55)}
.scene .puff path{fill:none;stroke:currentColor;stroke-opacity:.6;stroke-width:1.6;stroke-linecap:round;opacity:0}
.scene .drw{transform-box:view-box;transition:transform .5s ease}
.dopen .w-airfryer .drw{transform:translateY(9px)}
.st-run .w-airfryer .gl{fill:color-mix(in srgb,var(--dc) 30%,rgba(0,0,0,.28))}
.st-prep .scene .disp,.st-pause .w-airfryer .disp{fill:var(--dc);fill-opacity:.7}
.anim.st-prep .w-airfryer .disp,.anim.st-pause .w-airfryer .disp{animation:dv-blink 1.4s ease-in-out infinite}
.anim.st-pause .w-airfryer .fan{animation:dv-spindown 2.6s cubic-bezier(.15,.7,.35,1) both}
.anim.st-run .w-airfryer .gl{animation:dv-gl 3s ease-in-out infinite}
.anim.st-run.last .w-airfryer .gl{animation-duration:.8s}
.anim.st-done.fx .w-airfryer .puff path{animation:dv-steam 1.8s ease-out 2 both}
.anim.st-done.fx .w-airfryer .drw{animation:dv-jolt .6s .1s ease-out both}
.anim.st-run .w-airfryer .fan{animation:dv-spin 1s linear infinite}
.anim.st-run .w-airfryer .heat path{animation:dv-heat 2.2s ease-out infinite}
.anim.st-run.alt .w-airfryer .fan{animation-duration:3s}
.anim.st-run.alt .w-airfryer .heat path{animation:dv-glow 3.6s ease-in-out infinite}
.anim.st-run.alt .w-airfryer .disp{animation:dv-glow 3.6s ease-in-out infinite}
.anim.st-run .w-coffee .steam path{animation:dv-steam 3s ease-out infinite}
.anim.st-run.alt .w-coffee .steam path{animation:none}
.st-run.alt .w-coffee .flow{opacity:.9}
.anim.st-run.alt .w-coffee .flow{animation:dv-flow .5s linear infinite}
.anim.st-run.alt .w-coffee .cf{animation:dv-fill 9s ease-out both}
.st-run:not(.alt) .w-coffee .cf,.st-done .w-coffee .cf{transform:none}
.anim.st-run .w-generic .pulse{animation:dv-pulse 2.6s ease-out infinite}
.scene .drops circle:nth-child(2),.scene .heat path:nth-child(2),.scene .steam path:nth-child(2),.scene .puff path:nth-child(2){animation-delay:.5s}
.scene .drops circle:nth-child(3),.scene .heat path:nth-child(3),.scene .steam path:nth-child(3),.scene .puff path:nth-child(3){animation-delay:1s}
.scene .drops circle:nth-child(4){animation-delay:.25s}.scene .drops circle:nth-child(5){animation-delay:.75s}.scene .drops circle:nth-child(6){animation-delay:1.15s}
.scene .drops circle:nth-child(odd){--dx:-6px}.scene .drops circle:nth-child(even){--dx:6px}
/* Unsichtbar (außerhalb des Bildschirms, Tab im Hintergrund, Kartenauswahl): alles steht */
.still .scene *{animation-play-state:paused!important}
.anim.st-run:not(.still) .scene>svg{will-change:transform}
@media (prefers-reduced-motion:reduce){.scene *{animation:none!important}}
@keyframes dv-tumble{0%{transform:rotate(0)}40%{transform:rotate(220deg)}50%{transform:rotate(220deg)}90%,100%{transform:rotate(0)}}
@keyframes dv-spin{to{transform:rotate(360deg)}}
@keyframes dv-wave{to{transform:translateX(-25px)}}
@keyframes dv-arm{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}
@keyframes dv-drop{0%{opacity:0;transform:translate(0,0)}20%{opacity:.9}100%{opacity:0;transform:translate(var(--dx,0),-46px)}}
@keyframes dv-mist{0%,100%{opacity:.04}50%{opacity:.16}}
@keyframes dv-heat{0%{opacity:0;transform:translateY(4px)}40%{opacity:.85}100%{opacity:0;transform:translateY(-8px)}}
@keyframes dv-glow{0%,100%{opacity:.25}50%{opacity:.8}}
@keyframes dv-blink{0%,100%{fill-opacity:.7}50%{fill-opacity:.15}}
@keyframes dv-gl{0%,100%{fill-opacity:.7}50%{fill-opacity:1}}
@keyframes dv-spindown{from{transform:rotate(0)}to{transform:rotate(400deg)}}
@keyframes dv-jolt{0%,100%{transform:translateY(0)}35%{transform:translateY(6px)}65%{transform:translateY(-1px)}}
@keyframes dv-steam{0%{opacity:0;transform:translateY(4px)}35%{opacity:.6}100%{opacity:0;transform:translateY(-12px)}}
@keyframes dv-flow{to{stroke-dashoffset:-7}}
@keyframes dv-fill{from{transform:scaleY(.15)}to{transform:scaleY(1)}}
@keyframes dv-pulse{0%{opacity:.7;transform:scale(.85)}100%{opacity:0;transform:scale(1.25)}}
@keyframes dv-pop{0%{opacity:0;transform:scale(.4)}70%{opacity:1;transform:scale(1.12)}100%{opacity:1;transform:scale(1)}}
@keyframes dv-check{from{stroke-dashoffset:16}to{stroke-dashoffset:0}}
@keyframes dv-ring{0%{opacity:.8;transform:scale(1)}100%{opacity:0;transform:scale(2.2)}}
.scene .done{transform-box:fill-box;transform-origin:center}
@container (max-width:300px){.scene{width:72px;height:72px}.pg{font-size:16px}.ab span{display:none}}`;
  var NovaApplianceCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("geraet-card-editor"));
    }
    static getStubConfig() {
      return { device_type: "washer" };
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      if (c.device_type && !TYPES[c.device_type]) throw new Error("device_type muss washer, dishwasher, airfryer, coffee oder generic sein");
      this._c = { ...GDEF, ...c, controls: [].concat(c.controls || []).map(toObj).filter((o) => o.entity), hints: [].concat(c.hints || []).map(toObj).filter((o) => o.entity) };
      this._ids = entityIds(this._c);
      this._built = false;
      this._pend = {};
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
    // Bearbeitungsmodus: ausgeblendete Karte trotzdem zeigen, sonst findet man sie nicht wieder
    set preview(v) {
      this._pv = v;
      this._update();
    }
    get preview() {
      return this._pv;
    }
    set editMode(v) {
      this._em = v;
      this._update();
    }
    get editMode() {
      return this._em;
    }
    getCardSize() {
      return this._c?.layout === "compact" ? 1 : 3 + Math.ceil((this._c?.controls.length || 0) / 2);
    }
    getGridOptions() {
      return this._c?.layout === "compact" ? { columns: 6, rows: "auto", min_columns: 3 } : { columns: 12, rows: "auto", min_columns: 4 };
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
      Object.values(this._pend || {}).forEach((p) => clearTimeout(p.t));
      clearTimeout(this._ft);
    }
    _S(id) {
      return id ? this._h?.states[id] : null;
    }
    // Zustandsgruppe (SORDER) oder off
    _cls() {
      const c = this._c, s = this._S(c.entity);
      if (!s) return "off";
      const v = String(s.state).toLowerCase();
      if (["binary_sensor", "switch", "input_boolean"].includes(dom(c.entity)) && !c.running_states) return v === "on" ? "run" : "off";
      for (const k of SORDER) {
        const own = c[SKEY[k]] != null ? list(c[SKEY[k]]).map((x) => x.toLowerCase()) : STATES[k];
        if (own.includes(v)) return k;
      }
      return "off";
    }
    _build() {
      this._built = true;
      const c = this._c, t = typeOf(c), r = this.shadowRoot || this.attachShadow({ mode: "open" }), cmp = c.layout === "compact";
      const rv = roleVars(c.color || TYPES[t].color);
      const anim = c.animation !== false && !cmp;
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${DCSS2}:host([hidden]){display:none}</style>
<div class="g dv t-${t}${cmp ? " cmp" : ""}${anim ? " anim" : ""}${c.glow !== false ? " glow" : ""}" style="--dc:${rv.c};--dc-fg:${rv.fg}">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${cmp ? '<span class="rmc"></span>' : ""}${c.power ? '<div class="hb pw" title="Ein/Aus"><ha-icon icon="mdi:power"></ha-icon></div>' : ""}</div>
${cmp ? '<div class="bar" hidden><i></i></div>' : `<div class="mid"><div class="w-${t}">${scene(t)}</div><div class="inf"><div class="pg"></div><div class="ph" hidden></div><div class="bar" hidden><i></i></div><div class="tm"><span class="rm"></span><span class="en"></span></div></div></div>
<div class="ctls"></div>${c.start_at === "home_connect" && c.start ? SA : ""}<div class="acts"></div>`}<div class="als"></div></div>`;
      const q = (s) => r.querySelector(s);
      this._e = {
        g: q(".g"),
        ic: q(".hd .ic"),
        name: q(".hd b"),
        sub: q(".hd small"),
        pw: q(".pw"),
        pg: q(".pg"),
        ph: q(".ph"),
        bar: q(".bar"),
        bari: q(".bar i"),
        rm: q(".rm") || q(".rmc"),
        en: q(".en"),
        ctls: q(".ctls"),
        acts: q(".acts"),
        als: q(".als"),
        sa: q(".sa"),
        sat: q(".sa input"),
        san: q(".sa .now"),
        sah: q(".sa .sah")
      };
      const e = this._e;
      press(e.ic, { tap: () => this._act({ entity: c.entity, tap_action: c.tap_action }, "tap", true), hold: () => this._act({ entity: c.entity, hold_action: c.hold_action }, "hold") });
      if (cmp) press(e.name.parentElement, { tap: () => this._act({ entity: c.entity, tap_action: c.tap_action }, "tap", true), hold: () => this._act({ entity: c.entity, hold_action: c.hold_action }, "hold") });
      if (e.pw) press(e.pw, { tap: () => this._call(dom(c.power) === "input_boolean" ? "input_boolean" : "switch", "toggle", c.power, {}, "Ein/Aus") });
      if (e.ctls) this._ctl = c.controls.map((o) => this._mkCtl(o));
      if (e.sa) {
        e.sat.addEventListener("change", () => {
          this._at = e.sat.value || null;
          this._update();
        });
        press(e.san, { tap: () => {
          this._at = null;
          this._update();
        }, isolate: true });
      }
      if (e.acts) {
        this._ab = {};
        ["start", "pause", "resume", "stop"].forEach((k) => {
          const el2 = document.createElement("div");
          el2.className = `ab a-${k}${k === "start" ? " pri" : ""}`;
          el2.innerHTML = `<ha-icon icon="${IC[k]}"></ha-icon><span></span>`;
          el2.hidden = true;
          press(el2, { tap: () => this._do(k), hold: () => c[k] && this._act({ entity: c[k] }, "hold") });
          e.acts.append(el2);
          this._ab[k] = el2;
        });
      }
      this._prev = null;
      this._tick();
    }
    // Regler: select = Pillen bzw. aufklappbar, number = Plus/Minus oder Schieber, Schalter = Kippschalter
    _mkCtl(o) {
      const el2 = document.createElement("div"), d = dom(o.entity);
      el2.className = "ct";
      const S = () => this._S(o.entity), up = { o, el: el2 };
      if (d === "select" || d === "input_select") {
        el2.innerHTML = '<div class="kv"><span class="i"></span><span class="k"></span><span class="v"></span><ha-icon class="cv" icon="mdi:chevron-down"></ha-icon></div><div class="pills"></div>';
        up.kind = "sel";
        up.pills = el2.querySelector(".pills");
        press(el2.firstChild, { tap: () => {
          if (up.mode !== "list") return;
          el2.classList.toggle("open");
          up.pills.hidden = !el2.classList.contains("open");
        }, hold: () => this._act(o, "hold") });
      } else if (d === "number" || d === "input_number") {
        const sl = o.display === "slider";
        el2.innerHTML = `<div class="kv"><span class="i"></span><span class="k"></span>${sl ? '<span class="v"></span>' : '<div class="stp"><div class="hb mi"><ha-icon icon="mdi:minus"></ha-icon></div><span class="v"></span><div class="hb pl"><ha-icon icon="mdi:plus"></ha-icon></div></div>'}</div>${sl ? '<input type="range">' : ""}`;
        up.kind = "num";
        const step = (dir) => {
          const s = S();
          if (!ok(s)) return;
          const a = s.attributes, st = +o.step || +a.step || 1, cur2 = this._pend[o.entity]?.v ?? +s.state;
          const mn = a.min != null ? +a.min : -Infinity, mx = a.max != null ? +a.max : Infinity;
          this._setNum(o, Math.min(mx, Math.max(mn, Math.round((cur2 + dir * st) / st) * st)));
        };
        if (sl) {
          up.rng = el2.querySelector("input");
          up.rng.addEventListener("input", () => this._setNum(o, +up.rng.value));
        } else {
          press(el2.querySelector(".mi"), { tap: () => step(-1), isolate: true });
          press(el2.querySelector(".pl"), { tap: () => step(1), isolate: true });
        }
        press(el2.querySelector(".k"), { tap: () => this._act(o, "tap", true), hold: () => this._act(o, "hold") });
      } else if (["switch", "input_boolean"].includes(d)) {
        el2.innerHTML = '<div class="row"><span class="i"></span><span class="k" style="flex:1"></span><div class="sw"></div></div>';
        up.kind = "sw";
        press(el2.firstChild, { tap: () => this._call(d, "toggle", o.entity, {}, o.name || "Schalter"), hold: () => this._act(o, "hold") });
      } else {
        el2.innerHTML = '<div class="kv"><span class="i"></span><span class="k"></span><span class="v"></span></div>';
        up.kind = "val";
        press(el2.firstChild, { tap: () => this._act(o, "tap", true), hold: () => this._act(o, "hold") });
      }
      this._e.ctls.append(el2);
      return up;
    }
    // Zahlen gesammelt setzen: erst nach kurzer Pause wird der Dienst aufgerufen
    _setNum(o, v) {
      const p = this._pend[o.entity] ||= {};
      p.v = v;
      clearTimeout(p.t);
      p.t = setTimeout(() => {
        delete this._pend[o.entity];
        this._call(dom(o.entity), "set_value", o.entity, { value: v }, o.name || "Wert");
      }, 700);
      this._update();
    }
    _call(d, s, id, data, what) {
      return Promise.resolve(this._h.callService(d, s, { entity_id: id, ...data })).catch((err) => this._flash(`${what}: ${err?.message || err}`));
    }
    // Fehler beim Auslösen sichtbar in der Karte zeigen (8 s)
    _flash(msg) {
      this._msg = msg;
      clearTimeout(this._ft);
      this._ft = setTimeout(() => {
        this._msg = null;
        this._update();
      }, 8e3);
      this._update();
    }
    // Start über ein Select (Home Connect: „Aktives Programm“ setzen) – taugt nicht zum Fortsetzen
    _selStart() {
      return ["select", "input_select"].includes(dom(this._c.start));
    }
    // Fortsetzen über den Start-Knopf (z. B. Philips) – nur wenn im Editor eingeschaltet und keine eigene Fortsetzen-Entität
    _resStart() {
      const c = this._c;
      return !!c.resume_with_start && !c.resume && !!c.start && !this._selStart();
    }
    // „Starten um“ → Startzeitpunkt und „Fertig in“ (s) = Zeit bis zum Start + Programmdauer, auf volle Minuten
    _atCalc() {
      const c = this._c;
      if (!this._at || c.start_at !== "home_connect") return null;
      const [H, M] = this._at.split(":").map(Number), now = /* @__PURE__ */ new Date(), start = new Date(now);
      start.setHours(H, M, 0, 0);
      if (start <= now) start.setDate(start.getDate() + 1);
      const ds = this._S(c.duration), dur = secsOf(ds);
      if (!dur) return { start, err: "Programmdauer unbekannt (Editor → Programm und Zeit → Gesamtdauer)" };
      const fin = Math.ceil((start - now) / 6e4) * 60 + Math.round(dur / 60) * 60, max = dom(c.duration) === "number" && ds.attributes.max ? +ds.attributes.max : 86400;
      if (fin > max) return { start, err: `Start zu spät: die Maschine erlaubt höchstens ${fmtDur(max)} bis zum Programmende` };
      return { start, fin, end: now.getTime() + fin * 1e3 };
    }
    _startBlock() {
      const c = this._c, s = this._S(c.start), rs = this._S(c.remote_start);
      if (!c.start) return null;
      const at = this._atCalc();
      if (at?.err) return at.err;
      if (at && !this._h.entities?.[c.start]?.device_id) return "Starten um: Gerät der Start-Entität nicht gefunden";
      if (c.remote_start && rs && rs.state !== "on") return c.remote_start_text || "Fernstart ist aus – an der Maschine aktivieren";
      if (!s || s.state === "unavailable") return "Start gerade nicht möglich (Entität nicht verfügbar)";
      if (this._selStart()) {
        if (!c.start_option) return "Start: Programm-Quelle fehlt (Editor → Bedienung)";
        const o = this._S(c.start_option);
        if (!ok(o)) return "Erst ein Programm wählen";
        if (!(s.attributes.options || []).includes(o.state)) return `Programm „${fmtOpt(this._h, o, o.state)}“ kann nicht gestartet werden`;
      }
      return null;
    }
    _do(k) {
      const c = this._c, id = c[k] || (k === "resume" && this._resStart() ? c.start : null), d = dom(id);
      if (!id) return;
      if (k === "start" && this._startBlock()) return;
      const conf = k === "start" ? c.start_confirm : k === "stop" ? c.stop_confirm : null;
      if (conf && !window.confirm(conf)) return;
      const what = { start: c.start_name || "Start", pause: "Pause", resume: "Fortsetzen", stop: "Stopp" }[k];
      const at = k === "start" && this._atCalc();
      if (at) {
        const fin = at.fin;
        this._at = null;
        return Promise.resolve(this._h.callService("home_connect", "start_selected_program", { device_id: this._h.entities[c.start].device_id, b_s_h_common_option_finish_in_relative: fin })).catch((err) => this._flash(`${what}: ${err?.message || err}`)).finally(() => this._update());
      }
      if (d === "select" || d === "input_select") return this._call(d, "select_option", id, { option: this._S(c.start_option)?.state }, what);
      if (d === "button" || d === "input_button") return this._call(d, "press", id, {}, what);
      if (d === "script" || d === "scene") return this._call(d, "turn_on", id, {}, what);
      if (d === "switch" || d === "input_boolean") return this._call(d, k === "stop" || k === "pause" ? "turn_off" : "turn_on", id, {}, what);
      this._flash(`${what}: ${id} kann nicht ausgelöst werden`);
    }
    // Restzeit in s und Endzeitpunkt (ms)
    _time(cls) {
      const c = this._c, es = this._S(c.end_time), rs = this._S(c.remaining);
      let end = null, rem = null;
      if (ok(es)) {
        const t = Date.parse(es.state);
        if (!isNaN(t)) end = t;
      }
      const r0 = secsOf(rs);
      if (r0 != null) {
        if (cls === "pause") rem = r0;
        else if (end == null) end = Date.parse(rs.last_changed) + r0 * 1e3;
      }
      if (end != null && rem == null) rem = Math.max(0, (end - Date.now()) / 1e3);
      if (cls === "pause" && rem != null && end != null) end = Date.now() + rem * 1e3;
      return { rem, end };
    }
    _progress(cls, rem) {
      const c = this._c, ps = this._S(c.progress);
      if (cls === "done") return 100;
      if (ok(ps) && NUMRE.test(ps.state)) return Math.max(0, Math.min(100, +ps.state));
      const tot = secsOf(this._S(c.duration));
      if (tot > 0 && rem != null) return Math.max(0, Math.min(100, (1 - rem / tot) * 100));
      return null;
    }
    _update() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !e) return;
      const t = typeOf(c), TY = TYPES[t], s = this._S(c.entity), cls = this._cls(), act = isAct(cls);
      const na = !!c.entity && (!s || s.state === "unavailable");
      if (this._prev && this._prev !== cls) this._fx = cls === "done";
      if (cls !== "done") this._fx = false;
      this._prev = cls;
      const ph = this._S(c.phase || c.entity), phs = c.phase_states != null ? list(c.phase_states) : TY.phase;
      const alt = cls === "run" && !!ph && phs.map((x) => x.toLowerCase()).includes(String(ph.state).toLowerCase());
      [...SORDER, "off"].forEach((k) => e.g.classList.toggle(`st-${k}`, k === cls));
      e.g.classList.toggle("alt", alt);
      e.g.classList.toggle("fx", !!this._fx);
      e.g.classList.toggle("na", na);
      const dr = this._S(c.door);
      e.g.classList.toggle("dopen", !!dr && ["on", "open", "opened"].includes(dr.state));
      this.classList.toggle("nv-na", na);
      const hide = !!c.hide_when_off && ["off", "done", "ready"].includes(cls) && !this._pv && !this._em && !this.hasAttribute("preview");
      if (this.hidden !== hide) {
        this.hidden = hide;
        this.dispatchEvent(new CustomEvent("card-visibility-changed", { bubbles: true, composed: true, detail: { value: !hide } }));
      }
      e.name.textContent = c.name ?? s?.attributes.friendly_name ?? TY.label;
      setIcon(e.ic, c.icon || TY.icon);
      e.ic.classList.toggle("on", act);
      const raw = s ? fmtState(h, s) : "";
      const own = c[TKEY[cls]];
      const def = cls === "run" ? alt && TY.alt || TY.run : TY[cls] || TXT[cls];
      const stx = !c.entity ? "Status-Entität im Editor wählen" : na ? "Nicht verfügbar" : own || (raw === s.state && def ? def : nice(s.state, raw));
      e.sub.textContent = stx;
      e.sub.classList.toggle("er", cls === "err");
      if (e.pw) {
        const p2 = this._S(c.power);
        e.pw.classList.toggle("on", p2?.state === "on");
        e.pw.classList.toggle("na", !p2 || p2.state === "unavailable");
      }
      const pgS = [this._S(c.program), this._S(c.start_option)].find((x) => ok(x) && x.state !== "off");
      const pg = pgS ? nice(pgS.state, fmtState(h, pgS)) : "";
      const { rem, end } = act ? this._time(cls) : { rem: null, end: null };
      const p = act || cls === "done" ? this._progress(cls, rem) : null;
      e.bar.hidden = p == null;
      const pf = cls === "done" ? 1 : act && p != null ? p / 100 : 0;
      e.g.style.setProperty("--pf", pf.toFixed(2));
      e.g.style.setProperty("--pp", `${Math.round(pf * 70)}%`);
      e.g.classList.toggle("last", cls === "run" && rem != null && rem <= 60);
      if (p != null) e.bari.style.width = `${p}%`;
      if (c.layout === "compact") {
        e.ic.style.setProperty("--p", `${p ?? 0}%`);
        e.sub.textContent = [pg && act ? pg : stx, p != null && act ? `${Math.round(p)} %` : ""].filter(Boolean).join(" · ");
        e.rm.textContent = rem != null ? fmtDur(rem) : "";
      } else {
        e.pg.textContent = pg || stx;
        const phx = c.phase && ok(ph) ? nice(ph.state, fmtState(h, ph)) : "";
        e.ph.hidden = !phx;
        e.ph.textContent = phx;
        e.rm.textContent = rem != null && cls !== "wait" ? `noch ${fmtDur(rem)}` : p != null && act ? `${Math.round(p)} %` : "";
        e.en.textContent = end != null ? `fertig um ${this._clock(end)}` : "";
        this._ctlUp(act);
        this._actUp(cls);
      }
      this._alerts(cls, stx);
      this._tick();
    }
    _clock(ms) {
      const h = this._h, d = new Date(ms), far = ms - Date.now() > 20 * 36e5;
      try {
        return new Intl.DateTimeFormat(langOf(h), { hour: "2-digit", minute: "2-digit", ...far ? { weekday: "short" } : {}, timeZone: tzOf(h) }).format(d);
      } catch {
        return d.toLocaleTimeString().slice(0, 5);
      }
    }
    _ctlUp(act) {
      const h = this._h;
      (this._ctl || []).forEach((u) => {
        const { o, el: el2 } = u, s = this._S(o.entity), a = s?.attributes || {};
        el2.hidden = o.show === "idle" ? act : o.show === "running" ? !act : false;
        el2.classList.toggle("na", !s || s.state === "unavailable");
        const ic = el2.querySelector(".i");
        if (ic) setIcon(ic, iconOf(h, o, "mdi:tune"));
        el2.querySelector(".k").textContent = o.name ?? a.friendly_name ?? o.entity;
        const v = el2.querySelector(".v");
        if (u.kind === "sel") {
          const opts = (a.options || []).map(String), cur2 = ok(s) ? s.state : null;
          u.mode = o.display === "pills" || o.display === "list" ? o.display : opts.length <= 5 ? "pills" : "list";
          el2.querySelector(".cv").hidden = u.mode !== "list";
          if (u.mode === "pills") u.pills.hidden = false;
          else u.pills.hidden = !el2.classList.contains("open");
          v.textContent = cur2 != null ? fmtOpt(h, s, cur2) : "–";
          v.hidden = u.mode === "pills";
          const key = opts.join("|");
          if (u.key !== key) {
            u.key = key;
            u.pills.replaceChildren(...opts.map((x) => {
              const p = document.createElement("div");
              p.className = "pill";
              p.dataset.o = x;
              press(p, { tap: () => {
                this._call(dom(o.entity), "select_option", o.entity, { option: x }, o.name || "Auswahl");
                if (u.mode === "list") {
                  el2.classList.remove("open");
                  u.pills.hidden = true;
                }
              }, isolate: true });
              return p;
            }));
          }
          [...u.pills.children].forEach((p) => {
            p.textContent = fmtOpt(h, s, p.dataset.o);
            p.classList.toggle("on", p.dataset.o === cur2);
          });
        } else if (u.kind === "num") {
          const pv = this._pend[o.entity]?.v, n = pv ?? (ok(s) ? +s.state : null);
          v.textContent = n == null ? "–" : isDur(s) ? fmtDur(n * (SECS[a.unit_of_measurement] || 1)) : valueOf(h, { ...s, state: String(n) }, o);
          if (u.rng) {
            Object.assign(u.rng, { min: a.min ?? 0, max: a.max ?? 100, step: o.step || a.step || 1 });
            if (n != null && pv == null) u.rng.value = n;
            u.rng.style.setProperty("--p", `${((n ?? 0) - (a.min ?? 0)) / ((a.max ?? 100) - (a.min ?? 0) || 1) * 100}%`);
          }
        } else if (u.kind === "sw") el2.firstChild.classList.toggle("on", s?.state === "on");
        else v.textContent = valueOf(h, s, o);
      });
    }
    // Knöpfe nur mit eingetragener, verfügbarer Entität; Start vor dem Lauf, Pause/Fortsetzen/Stopp währenddessen
    _actUp(cls) {
      const c = this._c, b = this._ab, av = (k) => !!c[k] && this._S(c[k]) && this._S(c[k]).state !== "unavailable";
      if (!b) return;
      const act = isAct(cls), blk = this._startBlock();
      b.start.hidden = act || !c.start;
      b.start.classList.toggle("dis", !!blk);
      const at = this._atCalc();
      b.start.lastChild.textContent = at && !at.err ? `${c.start_name || "Start"} um ${this._clock(at.start.getTime())}` : c.start_name || "Start";
      const e = this._e;
      if (e.sa) {
        e.sa.hidden = act;
        if (e.sat !== this.shadowRoot.activeElement) e.sat.value = this._at || "";
        e.san.classList.toggle("on", !this._at);
        e.sah.textContent = at && !at.err ? `Fertig ca. ${this._clock(at.end)} · „Fertig in“ ${fmtDur(at.fin)}` : "";
      }
      b.pause.hidden = cls !== "run" || !av("pause");
      b.resume.hidden = cls !== "pause" || !(av("resume") || this._resStart() && av("start"));
      b.stop.hidden = !act || !av("stop");
      ["pause", "resume", "stop"].forEach((k) => {
        b[k].lastChild.textContent = { pause: "Pause", resume: "Fortsetzen", stop: "Stopp" }[k];
      });
      this._e.acts.hidden = Object.values(b).every((x) => x.hidden);
    }
    _alerts(cls, stx) {
      const c = this._c, h = this._h, TY = TYPES[typeOf(c)], out = [];
      const add = (lvl, ic, msg) => out.push(`<div class="al ${lvl}"><ha-icon icon="${esc(ic)}"></ha-icon><span>${esc(msg)}</span></div>`);
      if (this._msg) add("error", "mdi:alert-circle-outline", this._msg);
      if (cls === "err") add("error", "mdi:alert-circle-outline", stx);
      const cn = this._S(c.connection);
      if (c.connection && (!cn || ["off", "unavailable", "disconnected"].includes(cn.state))) add("error", "mdi:wifi-off", c.connection_text || "Keine Verbindung zum Gerät");
      const blk = c.layout !== "compact" && !isAct(cls) ? this._startBlock() : null;
      if (blk) add("warning", "mdi:play-circle-outline", blk);
      const dr = this._S(c.door);
      if (dr && ["on", "open", "opened"].includes(dr.state)) add("info", "mdi:door-open", c.door_text || TY.door);
      c.hints.forEach((a) => {
        const s = this._S(a.entity);
        if (alertHit(a, s)) add(["error", "info"].includes(a.level) ? a.level : "warning", a.icon || s?.attributes.icon || "mdi:information-outline", a.message || `${a.name ?? s.attributes.friendly_name ?? a.entity}: ${fmtState(h, s)}`);
      });
      const html = out.join("");
      if (this._alKey !== html) {
        this._alKey = html;
        this._e.als.innerHTML = html;
      }
      this._e.g.classList.toggle("err", cls === "err" && c.glow !== false);
    }
    // Sichtbarkeit: Animation und Countdown nur, wenn die Karte zu sehen und der Tab offen ist
    _tick() {
      const vis3 = !!this._inView && !document.hidden && !this._quiet && this.isConnected;
      this._e?.g.classList.toggle("still", !vis3);
      const run = vis3 && this._e && ["run", "wait"].includes(this._prev) && (this._c.end_time || this._c.remaining);
      if (run && !this._tm) this._tm = setInterval(() => this._update(), 3e4);
      if (!run && this._tm) {
        clearInterval(this._tm);
        this._tm = null;
      }
    }
    _act(o, kind, info) {
      return runAction(this, o, kind, info);
    }
  };
  define("geraet-card", NovaApplianceCard, { name: "Nova Gerät Card", description: "Haushaltsgerät (Waschmaschine, Spülmaschine, Airfryer, Kaffeemaschine …) mit Status, Programm, Fortschritt, Restzeit, Reglern und Start/Pause/Stopp.", documentationURL: docUrl("nova-gerät-card") });
  var ST = { entity: {} };
  var BTN = { entity: { domain: ["button", "input_button", "script", "scene", "switch", "input_boolean"] } };
  var GGEN = [
    sel("device_type", Object.entries(TYPES).map(([k, v]) => [k, k === "generic" ? "Allgemein" : v.label])),
    g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } }),
    { name: "entity", selector: ST },
    { name: "power", selector: { entity: { domain: ["switch", "input_boolean"] } } }
  ];
  var GPROG = (t) => [
    { name: "program", selector: ST },
    g2({ name: "progress", selector: { entity: { domain: ["sensor", "number", "input_number"] } } }, { name: "duration", selector: ST }),
    g2({ name: "remaining", selector: ST }, { name: "end_time", selector: ST }),
    { name: "phase", selector: ST },
    ...TYPES[t].alt ? [{ name: "phase_states", selector: { text: { multiple: true } }, context: { t } }] : []
  ];
  var GCTL = (it) => {
    const d = dom(it.entity);
    return [
      { name: "entity", required: true, selector: { entity: { domain: ["select", "input_select", "number", "input_number", "switch", "input_boolean", "sensor"] } } },
      NAMEICON,
      ...d === "select" || d === "input_select" ? [sel("display", [["auto", "Automatisch"], ["pills", "Alle Optionen als Pillen"], ["list", "Aufklappen"]])] : [],
      ...d === "number" || d === "input_number" ? [g2(sel("display", [["buttons", "Plus / Minus"], ["slider", "Schieber"]]), NUM("step"))] : [],
      sel("show", [["always", "Immer"], ["idle", "Nur vor dem Start"], ["running", "Nur während des Laufs"]])
    ];
  };
  var GACT = (c) => [
    g2({ name: "start", selector: { entity: { domain: [...BTN.entity.domain, "select", "input_select"] } } }, { name: "start_name", selector: T }),
    ...["select", "input_select"].includes(dom(c.start)) ? [{ name: "start_option", selector: { entity: { domain: ["select", "input_select", "sensor", "input_text"] } } }] : [],
    g2({ name: "pause", selector: BTN }, { name: "resume", selector: BTN }),
    ...!c.resume && !["select", "input_select"].includes(dom(c.start)) ? [{ name: "resume_with_start", selector: { boolean: {} } }] : [],
    { name: "stop", selector: BTN },
    g2({ name: "start_confirm", selector: T }, { name: "stop_confirm", selector: T }),
    sel("start_at", [["none", "Aus"], ["home_connect", "Home Connect (rechnet in „Fertig in“ um)"]])
  ];
  var GINFO = [
    g2({ name: "remote_start", selector: ST }, { name: "remote_start_text", selector: T }),
    g2({ name: "door", selector: ST }, { name: "door_text", selector: T }),
    g2({ name: "connection", selector: ST }, { name: "connection_text", selector: T })
  ];
  var GHINT = [
    { name: "entity", required: true, selector: ST },
    g2({ name: "message", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } }),
    g2({ name: "state", selector: T }, { name: "state_not", selector: T }),
    g2(NUM("above"), NUM("below")),
    sel("level", [["warning", "Warnung"], ["error", "Fehler"], ["info", "Info"]])
  ];
  var GSTATE = [
    { name: "running_states", selector: { text: { multiple: true } } },
    g2({ name: "paused_states", selector: { text: { multiple: true } } }, { name: "waiting_states", selector: { text: { multiple: true } } }),
    g2({ name: "finished_states", selector: { text: { multiple: true } } }, { name: "error_states", selector: { text: { multiple: true } } }),
    g2({ name: "prep_states", selector: { text: { multiple: true } } }, { name: "ready_states", selector: { text: { multiple: true } } }),
    g2({ name: "heat_states", selector: { text: { multiple: true } } }, { name: "warm_states", selector: { text: { multiple: true } } })
  ];
  var GTEXT = [
    g2({ name: "text_running", selector: T }, { name: "text_paused", selector: T }),
    g2({ name: "text_waiting", selector: T }, { name: "text_finished", selector: T }),
    g2({ name: "text_error", selector: T }, { name: "text_off", selector: T }),
    g2({ name: "text_prep", selector: T }, { name: "text_ready", selector: T }),
    g2({ name: "text_heat", selector: T }, { name: "text_warm", selector: T })
  ];
  var GLOOK = [
    sel("layout", [["full", "Voll"], ["compact", "Kompakt (läuft gerade)"]]),
    g2({ name: "hide_when_off", selector: { boolean: {} } }, { name: "animation", selector: { boolean: {} } }),
    g2(ROLE("color"), { name: "glow", selector: { boolean: {} } })
  ];
  var GACTS = [g2({ name: "tap_action", selector: A }, { name: "hold_action", selector: A })];
  var PHASE_LBL = { washer: "Zustände „schleudert“ (schnelle Trommel)", coffee: "Zustände „brüht“ (Kaffee läuft in die Tasse)" };
  var GLABELS = {
    ...BASE_LABELS,
    device_type: "Gerätetyp",
    entity: "Status",
    power: "Ein/Aus-Schalter",
    program: "Programm",
    progress: "Fortschritt (%)",
    duration: "Gesamtdauer",
    remaining: "Restzeit",
    end_time: "Endzeit",
    phase: "Phase (optional)",
    phase_states: "Sonder-Zustände",
    display: "Darstellung",
    step: "Schrittweite",
    show: "Anzeigen",
    start: "Start",
    start_name: "Text auf dem Start-Knopf",
    start_option: "Programm für den Start",
    pause: "Pause",
    resume: "Fortsetzen",
    resume_with_start: "Fortsetzen nutzt Start-Knopf",
    stop: "Stopp",
    start_confirm: "Rückfrage vor dem Start",
    start_at: "„Starten um“ (Uhrzeit wählen)",
    stop_confirm: "Rückfrage vor dem Stopp",
    remote_start: "Fernstart erlaubt",
    remote_start_text: "Hinweis, wenn Fernstart aus",
    door: "Tür / Schublade",
    door_text: "Hinweis, wenn offen",
    connection: "Verbindung",
    connection_text: "Hinweis ohne Verbindung",
    message: "Meldung",
    level: "Stufe",
    running_states: "Zustände „läuft“",
    paused_states: "Zustände „pausiert“",
    waiting_states: "Zustände „startet später“",
    finished_states: "Zustände „fertig“",
    error_states: "Zustände „Störung“",
    prep_states: "Zustände „wird eingestellt“",
    text_prep: "Text „wird eingestellt“",
    ready_states: "Zustände „bereit“",
    heat_states: "Zustände „heizt auf“",
    warm_states: "Zustände „hält warm“",
    text_ready: "Text „bereit“",
    text_heat: "Text „heizt auf“",
    text_warm: "Text „hält warm“",
    text_running: "Text „läuft“",
    text_paused: "Text „pausiert“",
    text_waiting: "Text „startet später“",
    text_finished: "Text „fertig“",
    text_error: "Text „Störung“",
    text_off: "Text „aus“",
    layout: "Darstellung",
    hide_when_off: "Ausblenden, wenn aus, bereit oder fertig",
    animation: "Animation (aus = Standbild)",
    color: "Farbe",
    glow: "Rahmen leuchtet beim Laufen"
  };
  var GHELPERS = {
    device_type: "Bestimmt nur Symbol, Texte, Standardfarbe und Animation",
    entity: "Betriebszustand, z. B. sensor.waschmaschine_betriebszustand – auch binary_sensor (an = läuft)",
    power: "Optional: runder Knopf oben rechts",
    program: "Laufendes Programm (Select oder Sensor). Leer bzw. ohne Wert = Programm für den Start",
    progress: "Leer = aus Restzeit und Gesamtdauer berechnet",
    duration: "Für den Fortschritt ohne Fortschritts-Sensor und für „Starten um“ (Programmdauer vor dem Start)",
    remaining: "Sensor mit s/min/h oder H:MM. Endzeit wird daraus berechnet",
    end_time: "Zeitpunkt-Sensor. Restzeit wird daraus berechnet",
    phase: "Leer = Status. Steuert die Sonder-Animation und wird unter dem Programm angezeigt",
    phase_states: "Leer = Vorschlag zum Gerätetyp",
    show: "z. B. Temperatur und Schleudern nur vor dem Start",
    step: "Leer = Schritt der Entität (bei „Fertig in“ in Sekunden z. B. 1800 = 30 min)",
    start: "Button, Skript, Schalter – oder ein Select wie „Aktives Programm“ bei Home Connect",
    start_at: "Startzeit in der Karte wählen. Braucht die Gesamtdauer (Programm und Zeit), z. B. number.…_beenden_in_relativ – Home Connect meldet dort vor dem Start die Programmdauer",
    start_option: "Dessen Wert wird beim Start gesetzt, z. B. select.waschmaschine_ausgewahltes_programm",
    start_name: "Leer = „Start“",
    resume: "Leer = kein Fortsetzen-Knopf, außer „Fortsetzen nutzt Start-Knopf“ ist an",
    resume_with_start: "Bei Pause erscheint „Fortsetzen“ und drückt den Start-Knopf (z. B. Philips Airfryer). Nicht bei Start über ein Select",
    remote_start: "z. B. binary_sensor.waschmaschine_fernstart – aus = Start ausgegraut mit Hinweis",
    door: "Hinweis, wenn an bzw. open",
    connection: "Hinweis, wenn aus bzw. nicht verfügbar",
    running_states: "Leer = übliche Rohzustände (run, running, cooking …). Genaue Zustände der Status-Entität",
    prep_states: "Gerät wird gerade eingestellt (z. B. Airfryer „setting“). Leer = setting, programming …",
    ready_states: "An, aber nichts läuft. Leer = ready, idle, standby, mainmenu. Alles Unbekannte gilt als „aus“",
    heat_states: "Leer = heating, preheating, preheat. Ruhiges Glühen statt Lauf-Animation",
    warm_states: "Leer = maintain (Philips), keep_warm, warming. Schwaches Glühen",
    text_running: "Leer = Übersetzung von HA, sonst Text zum Gerätetyp",
    hide_when_off: "Gut für die Startseite: Karte nur, solange etwas läuft. Im Bearbeitungsmodus bleibt sie sichtbar",
    color: "Farbrolle aus dem Theme (Fortschritt, Start-Knopf, Animation)",
    message: "Leer = Name: Zustand",
    state: "Hinweis bei diesem Zustand (mehrere mit Komma)",
    state_not: "Hinweis bei jedem Zustand außer diesem, z. B. 0 bei einem Fehlercode"
  };
  var gvis = (c) => `${typeOf(c)}|${["select", "input_select"].includes(dom(c.start))}|${!c.resume}`;
  var NovaApplianceCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot, c0 = this._config, t = typeOf(c0);
      GLABELS.phase_states = PHASE_LBL[t] || "Sonder-Zustände";
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap");
      const strip2 = (c) => {
        Object.entries(GDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        if (c.color === TYPES[typeOf(c)].color) delete c.color;
        return c;
      };
      const data = { ...GDEF, color: TYPES[t].color, ...c0 };
      const form = (schema) => this._form(schema, data, (v) => {
        const c = strip2(merge(this._config, names(schema), v));
        this._emit(c);
        if (gvis(c) !== gvis(c0)) this._rebuild();
      });
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(GGEN))),
        this._section("program", "mdi:progress-clock", "Programm und Zeit", (b) => b.append(form(GPROG(t)))),
        this._section("controls", "mdi:tune-variant", "Regler", (b) => {
          b.append(this._hint("Einstellungen vor dem Start, z. B. Programm, Temperatur, Schleudern, „Fertig in“, Kochzeit. Select = Auswahl, Zahl = Plus/Minus, Schalter = Kippschalter."));
          this._itemList(b, "controls", GCTL, { item: "Regler", icon: "mdi:tune" }, "Regler hinzufügen");
        }),
        this._section("buttons", "mdi:play-pause", "Bedienung", (b) => {
          b.append(this._hint("Knöpfe erscheinen nur, wenn eine Entität eingetragen und verfügbar ist: Start vor dem Lauf, Pause/Fortsetzen/Stopp währenddessen."));
          b.append(form(GACT(data)));
        }),
        this._section("hints", "mdi:alert-circle-outline", "Hinweise", (b) => {
          b.append(form(GINFO), this._h4("Weitere Hinweise"), this._hint("z. B. Fehlercode (Warnen außer bei 0), Wartung fällig, Nachfüllen."));
          this._itemList(b, "hints", GHINT, { item: "Hinweis", icon: "mdi:information-outline" }, "Hinweis hinzufügen");
        }),
        this._section("states", "mdi:state-machine", "Zustände und Texte", (b) => {
          b.append(this._hint("Nur nötig, wenn die Karte den Zustand falsch einordnet. Zustände so eintragen, wie sie in den Entwicklerwerkzeugen stehen."));
          b.append(form(GSTATE), this._h4("Texte"), form(GTEXT));
        }),
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(GLOOK))),
        this._section("actions", "mdi:gesture-tap", "Aktionen", (b) => b.append(form(GACTS)))
      );
    }
  };
  __publicField(NovaApplianceCardEditor, "labels", GLABELS);
  __publicField(NovaApplianceCardEditor, "helpers", GHELPERS);
  __publicField(NovaApplianceCardEditor, "openSections", ["general"]);
  define("geraet-card-editor", NovaApplianceCardEditor);

  // src/index.js
  console.info(`%c NOVA-CARDS %c v${"0.10.1b1"} `, "color:#3a2a00;background:#f5b83d;font-weight:700;border-radius:4px 0 0 4px", "color:#fff;background:#1b2134;border-radius:0 4px 4px 0");
})();
