/* Nova Cards v0.10.1 DEV (nur weather, popup, dock) – Testbuild, alle Karten als custom:nova-dev-*. Nicht veröffentlichen. */
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
  var list = (v) => [].concat(v ?? []).flatMap((x) => String(x).split(",")).map((x) => x.trim()).filter(Boolean);
  var NUMRE = /^-?\d+(\.\d+)?$/;
  var toObj = (x) => typeof x === "string" ? { entity: x } : { ...x };
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
  var nameOf = (h, o) => o.name ?? h.states[o.entity]?.attributes.friendly_name ?? o.entity ?? "";
  var iconOf = (h, o, fb) => o.icon || h.states[o.entity]?.attributes.icon || DICON[dom(o.entity)] || fb;
  var langOf = (h) => h.locale?.language || h.language || "de";
  var tzOf = (h) => h.locale?.time_zone === "server" ? h.config?.time_zone : void 0;
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
--nv-neutral:var(--nova-neutral,#7b8794);--nv-neutral-fg:var(--nova-neutral-text,#fff)}`;
  var ROLES = { neutral: "neutral", "accent-1": "a1", "accent-2": "a2", "accent-3": "a3", "accent-4": "a4" };
  var roleVars = (r) => {
    const k = ROLES[r] || ROLES.neutral;
    return { c: `var(--nv-${k})`, fg: `var(--nv-${k}-fg)` };
  };
  var CARD_CSS = `${NOVA_VARS}
:host{display:block;height:100%}
.g{height:100%;box-sizing:border-box;border-radius:var(--nv-radius);background:var(--nv-bg);
backdrop-filter:blur(var(--nv-blur)) saturate(150%);-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(150%);
border:1px solid var(--nv-border);box-shadow:0 10px 30px rgba(0,0,0,.25),inset 0 1px 0 rgba(255,255,255,.12);
color:var(--nv-fg);overflow:hidden;position:relative;font-family:var(--ha-font-family-body,Roboto,sans-serif)}
ha-icon{--mdc-icon-size:20px;display:flex}`;
  var PANEL_CSS = `
:host{display:block;height:100%;container-type:inline-size}
.g{height:100%;box-sizing:border-box;border-radius:var(--nv-radius);background:var(--nv-bg);
backdrop-filter:blur(var(--nv-blur)) saturate(150%);-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(150%);
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
.ic{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);transition:all .25s}
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
.pill{padding:7px 12px;border-radius:999px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);font-size:12.5px;display:inline-flex;gap:6px;align-items:center;white-space:nowrap;transition:all .2s;min-width:0}
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
  var NovaEditorBase = class extends HTMLElement {
    constructor() {
      super();
      this.attachShadow({ mode: "open" });
      this._forms = [];
      this._open = /* @__PURE__ */ new Set();
    }
    set hass(h) {
      this._hass = h;
      this._forms.forEach((f) => {
        f.hass = h;
      });
    }
    setConfig(c) {
      const s = JSON.stringify(c);
      if (s === this._emitted) {
        this._config = c;
        return;
      }
      this._config = JSON.parse(s);
      this._onExternalConfig?.();
      this._rebuild();
    }
    async _rebuild() {
      const id = this._bid = (this._bid || 0) + 1;
      await loadForm();
      if (id === this._bid) {
        this._forms = [];
        this._build();
      }
    }
    _emit(c) {
      this._config = c;
      this._emitted = JSON.stringify(c);
      fire(this, "config-changed", { config: c });
    }
    _form(schema, data, cb) {
      const f = document.createElement("ha-form");
      f.hass = this._hass;
      f.schema = schema;
      f.data = data;
      f.computeLabel = (s) => this.constructor.labels?.[s.name] ?? s.name;
      f.computeHelper = (s) => this.constructor.helpers?.[s.name];
      f.addEventListener("value-changed", (e) => {
        e.stopPropagation();
        f.data = e.detail.value;
        cb(e.detail.value);
      });
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
    // Aufklapp-Eintrag; key merkt sich, ob er offen ist. Liefert [details, summary, body]
    _details(key, icon, label, btns) {
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
      return [d, s, body];
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
    _itemList(w, k, schema, m, addLabel, view = (it) => it) {
      const items = this._items(k), keys = names(schema);
      items.forEach((it, j) => {
        const [d, s, body] = this._details(`${k}.${j}`, it.icon || m.icon, this._ilabel(it, j, m), this._itemBtns(
          j,
          items.length,
          (dir) => this._moveItem(k, j, dir),
          () => {
            this._open = /* @__PURE__ */ new Set();
            this._setItems(k, this._items(k).filter((_, x) => x !== j));
            this._rebuild();
          }
        ));
        body.append(this._form(schema, view(it), (v) => {
          const arr = this._items(k);
          arr[j] = merge(arr[j], keys, v);
          this._setItems(k, arr);
          s.querySelector(".lbl").textContent = this._ilabel(arr[j], j, m);
        }));
        w.append(d);
      });
      w.append(this._add(addLabel, () => {
        const n = [...this._items(k), {}];
        this._open = /* @__PURE__ */ new Set([`${k}.${n.length - 1}`]);
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
  var ENT = { name: "entity", required: true, selector: { entity: {} } };
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

  // src/weather.js
  var WCSS = `
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
  var WDEF = {
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
        ...WDEF,
        ...c,
        details: [].concat(c.details ?? WDEF.details).filter((k) => DETAILS[k]),
        days: clamp(c.days, WDEF.days, 1, 14),
        hours: clamp(c.hours, WDEF.hours, 1, 72),
        hour_step: clamp(c.hour_step, WDEF.hour_step, 1, 12)
      };
      this._key = null;
      if (this._h) {
        this._sub();
        this._render();
      }
    }
    set hass(h) {
      this._h = h;
      if (!this._c) return;
      if (!this._e) this._build();
      this._sub();
      this._render();
    }
    connectedCallback() {
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
      const c = this._c || WDEF;
      return 2 + (c.show_clock || c.show_date ? 2 : 0) + (c.show_details !== false ? 1 : 0) + (c.show_daily !== false ? Math.ceil(c.days * 0.7) : 0) + (c.show_hourly ? 3 : 0);
    }
    getGridOptions() {
      return { columns: 6, rows: "auto", min_columns: 3 };
    }
    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${WCSS}</style><div class="g wt">
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
      const on = !!(c.show_clock || c.show_date) && this.isConnected;
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
        const p = h.connection.subscribeMessage(
          (ev) => {
            if (this._subKey === key) {
              this._fc[t] = ev?.forecast || [];
              this._render();
            }
          },
          { type: "weather/subscribe_forecast", forecast_type: t, entity_id: c.entity }
        );
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
      this._subs.forEach((p) => p.then((u) => typeof u === "function" && u()).catch(() => {
      }));
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
  var S_CUR = [
    { name: "entity", required: true, selector: { entity: { domain: "weather" } } },
    g2(BOOL("show_clock"), BOOL("show_date")),
    g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } }),
    g2({ name: "temperature_entity", selector: TSENS }, { name: "feels_like_entity", selector: TSENS }),
    g2(BOOL("show_name"), BOOL("show_feels_like")),
    g2(BOOL("show_high_low"), NUMB("decimals", 0, 2)),
    sel("color", [["auto", "Automatisch (nach Wetter)"], ["neutral", "Neutral"], ["accent-1", "Akzent 1"], ["accent-2", "Akzent 2"], ["accent-3", "Akzent 3"], ["accent-4", "Akzent 4"]])
  ];
  var S_DET = [
    g2(BOOL("show_details"), BOOL("label_details")),
    { name: "details", selector: { select: { multiple: true, mode: "list", options: Object.entries(DETAILS).map(([value, d]) => ({ value, label: d.label })) } } }
  ];
  var S_DAY = [g2(BOOL("show_daily"), NUMB("days", 1, 14, "Tage")), BOOL("daily_bar")];
  var S_HOUR = [
    g2(BOOL("show_hourly"), sel("hourly_layout", [["columns", "Spalten"], ["list", "Liste mit Balken"]])),
    g2(NUMB("hours", 1, 72, "h"), NUMB("hour_step", 1, 12, "h")),
    BOOL("hourly_graph")
  ];
  var S_ALL = [g2(BOOL("show_probability"), BOOL("show_precipitation")), g2(BOOL("show_titles"), BOOL("hourly_first"))];
  var S_ACT = [g2({ name: "tap_action", selector: A }, { name: "hold_action", selector: A })];
  var WLABELS = {
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
  var WHELPERS = {
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
      r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), data = { ...WDEF, ...c0 };
      const strip = (c) => {
        Object.entries(WDEF).forEach(([k, x]) => JSON.stringify(c[k]) === JSON.stringify(x) && delete c[k]);
        return c;
      };
      const form = (schema) => this._form(schema, data, (v) => this._emit(strip(merge(this._config, names(schema), v))));
      const s = this._hass?.states[c0.entity];
      const none = (t) => s && !hasF(s, FC[t]) ? [this._hint(`Diese Entität liefert keine ${FC_NAME[t]}.`)] : [];
      w.append(
        this._h3("Aktuelles Wetter"),
        form(S_CUR),
        this._h3("Zusatzwerte"),
        form(S_DET),
        this._h3("Tagesvorhersage"),
        ...none("daily"),
        form(S_DAY),
        this._h3("Stundenvorhersage"),
        ...none("hourly"),
        form(S_HOUR),
        this._h3("Vorhersage allgemein"),
        form(S_ALL),
        this._h3("Aktionen"),
        form(S_ACT)
      );
    }
    // Entität gewechselt → Hinweise zur Vorhersage neu aufbauen
    _emit(c) {
      const was = this._config?.entity;
      super._emit(c);
      if (c.entity !== was) this._rebuild();
    }
  };
  __publicField(NovaWeatherCardEditor, "labels", WLABELS);
  __publicField(NovaWeatherCardEditor, "helpers", WHELPERS);
  define("weather-card-editor", NovaWeatherCardEditor);

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

  // src/popup.js
  var DEF = { columns: 2, width: 720, stack_below: 500, info_layout: "wrap" };
  var toCell = (x) => !x || typeof x !== "object" ? { span: 1, card: null } : "card" in x || "span" in x ? { span: Math.max(1, +x.span || 1), card: x.card && typeof x.card === "object" ? x.card : null } : { span: 1, card: x };
  var normRows = (c) => {
    if (Array.isArray(c.rows)) return c.rows.map((r) => ({ cells: (Array.isArray(r) ? r : r?.cells || []).map(toCell) })).filter((r) => r.cells.length);
    if (Array.isArray(c.cards)) return c.cards.map((k) => ({ cells: [{ span: +c.columns || DEF.columns, card: k }] }));
    return [];
  };
  var serRows = (rows) => rows.filter((r) => r.cells.length).map((r) => ({ cells: r.cells.map((x) => x.span > 1 ? { span: x.span, card: x.card ?? null } : { card: x.card ?? null }) }));
  var helpersP;
  var helpers = () => helpersP ||= Promise.resolve().then(() => {
    if (typeof window.loadCardHelpers !== "function") throw new Error("loadCardHelpers nicht verfügbar");
    return window.loadCardHelpers();
  }).catch((e) => {
    helpersP = null;
    throw e;
  });
  var wait = (ms) => new Promise((r) => setTimeout(r, ms));
  var PCSS = `${NOVA_VARS}
:host{display:block;--pp-bg:var(--nova-popup-background,var(--primary-background-color,#111418));--pp-fg:var(--nova-popup-text-color,var(--primary-text-color,#fff));
--pp-r:var(--nova-popup-radius,28px);--pp-chip:color-mix(in srgb,var(--pp-fg) 9%,transparent);font-family:var(--ha-font-family-body,Roboto,sans-serif)}
:host(.live){display:contents}
ha-icon{--mdc-icon-size:20px;display:flex}
.ph{display:none;align-items:center;gap:10px;padding:10px 12px;border-radius:16px;border:1px dashed var(--divider-color,#666);color:var(--primary-text-color);font-size:13px}
:host(.edit) .ph{display:flex}
.ph .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}.ph small{opacity:.6}
.ph button{border:none;border-radius:999px;padding:6px 12px;background:var(--primary-color);color:var(--text-primary-color,#fff);font:inherit;cursor:pointer}
.pop{position:fixed;inset:0;z-index:var(--nova-popup-z-index,6);display:flex;align-items:center;justify-content:center}
.pop[hidden]{display:none}
.ov{position:absolute;inset:0;background:var(--nova-popup-backdrop,rgba(0,0,0,.45));backdrop-filter:blur(6px);-webkit-backdrop-filter:blur(6px);opacity:0;transition:opacity .22s}
.sh{position:relative;display:flex;flex-direction:column;box-sizing:border-box;width:min(var(--pw,720px),calc(100vw - 32px));max-height:min(86vh,1000px);
background:var(--pp-bg);color:var(--pp-fg);border-radius:var(--pp-r);border:1px solid color-mix(in srgb,var(--pp-fg) 10%,transparent);
box-shadow:0 24px 70px rgba(0,0,0,.45);overflow:hidden;opacity:0;transform:translateY(16px) scale(.98);transition:transform .24s cubic-bezier(.2,.8,.2,1),opacity .2s}
.pop.in .ov{opacity:1}.pop.in .sh{opacity:1;transform:none}
.grip{display:none;justify-content:center;padding:8px 0 2px;flex:none;touch-action:none}.grip i{width:40px;height:5px;border-radius:3px;background:currentColor;opacity:.3}
.hd{display:flex;align-items:center;gap:10px;padding:14px 12px 8px 18px;flex:none;touch-action:pan-x}
.hi:empty{display:none}.hi ha-icon{--mdc-icon-size:22px}
.tt{flex:1;min-width:0;font-weight:600;font-size:17px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.x{width:36px;height:36px;border-radius:50%;border:none;flex:none;display:flex;align-items:center;justify-content:center;background:var(--pp-chip);color:inherit;cursor:pointer;padding:0}
.x:active{transform:scale(.92)}
.info{display:flex;flex-wrap:wrap;gap:6px;padding:0 16px 10px;flex:none}
.info.scroll{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.info.scroll::-webkit-scrollbar{display:none}
.info[hidden]{display:none}
.chip{display:inline-flex;align-items:center;gap:6px;padding:6px 11px;border-radius:999px;background:var(--pp-chip);font-size:13px;white-space:nowrap;cursor:pointer;flex:none;outline:none;transition:background .2s}
.chip ha-icon{--mdc-icon-size:17px}.chip img{width:17px;height:17px}.chip:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
.chip .cn{opacity:.7}.chip .cn:empty{display:none}
.chip.al{background:color-mix(in srgb,var(--c) 22%,transparent);box-shadow:inset 0 0 0 1px color-mix(in srgb,var(--c) 55%,transparent)}.chip.al .ci{color:var(--c)}
.body{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;box-sizing:border-box;
padding:6px 16px calc(18px + env(safe-area-inset-bottom));display:grid;grid-template-columns:repeat(var(--cols,2),minmax(0,1fr));gap:12px;align-content:start}
.body.stack{grid-template-columns:minmax(0,1fr)}.body.stack>.cell{grid-column:auto!important}
.cell{min-width:0}
.cell.empty{min-height:0}
.pop.inline .cell.empty{min-height:72px;border:2px dashed color-mix(in srgb,var(--pp-fg) 25%,transparent);border-radius:16px;display:flex;align-items:center;justify-content:center;font-size:12.5px;opacity:.7}
.pop.inline .cell.empty::after{content:'Leerer Platz'}
.err{display:flex;gap:8px;align-items:flex-start;padding:12px;border-radius:16px;font-size:13px;color:var(--pp-fg);
background:color-mix(in srgb,var(--nv-error) 14%,transparent);border:1px solid color-mix(in srgb,var(--nv-error) 50%,transparent)}
.err ha-icon{color:var(--nv-error);flex:none}
.hint{font-size:13px;opacity:.7;padding:8px 2px;grid-column:1/-1}
@media(max-width:600px){
.pop{align-items:flex-end}
.sh{width:100vw;height:calc(100dvh - 40px - env(safe-area-inset-top));max-height:none;border-radius:var(--pp-r) var(--pp-r) 0 0;border-bottom:none;opacity:1;transform:translateY(100%)}
.grip{display:flex}.hd{padding-top:6px}
.body{padding-bottom:calc(88px + env(safe-area-inset-bottom))}}
.pop.inline{position:static;display:block}.pop.inline .ov,.pop.inline .grip{display:none}
.pop.inline .sh{width:auto;height:auto;max-height:none;opacity:1;transform:none;border-radius:var(--pp-r);box-shadow:none;border-bottom:1px solid color-mix(in srgb,var(--pp-fg) 10%,transparent)}
.pop.inline .body{overflow:visible;padding-bottom:16px}
@media(prefers-reduced-motion:reduce){.ov,.sh{transition:none}}`;
  var PREV = /* @__PURE__ */ new Set(["HUI-CARD-PREVIEW", "HUI-DIALOG-EDIT-CARD", "HUI-DIALOG-CREATE-CARD", "HUI-CARD-ELEMENT-EDITOR", "HUI-CARD-PICKER"]);
  var EDIT = /* @__PURE__ */ new Set(["HUI-CARD-OPTIONS", "HUI-CARD-EDIT-MODE"]);
  var NovaPopupCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("popup-card-editor"));
    }
    static getStubConfig() {
      return {
        hash: "pop-up",
        title: "Pop-up",
        icon: "mdi:card-multiple-outline",
        columns: 2,
        rows: [{ cells: [{ span: 2, card: null }] }, { cells: [{ card: null }, { card: null }] }]
      };
    }
    constructor() {
      super();
      const r = this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${PCSS}</style>
<div class="ph"><ha-icon icon="mdi:card-multiple-outline"></ha-icon><span class="t"></span><button type="button">Öffnen</button></div>
<div class="pop" hidden><div class="ov"></div><div class="sh" role="dialog" aria-modal="true">
<div class="grip"><i></i></div>
<div class="hd"><span class="hi"></span><span class="tt"></span><button type="button" class="x" aria-label="Schließen" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></button></div>
<div class="info" hidden></div><div class="body"></div></div></div>`;
      this._pop = r.querySelector(".pop");
      this._sh = r.querySelector(".sh");
      this._body = r.querySelector(".body");
      this._infoEl = r.querySelector(".info");
      this._mode = "live";
      r.querySelector(".x").addEventListener("click", () => this.close());
      r.querySelector(".ov").addEventListener("click", () => this.close());
      r.querySelector(".ov").addEventListener("touchmove", (e) => e.preventDefault(), { passive: false });
      r.querySelector(".ph button").addEventListener("click", (e) => {
        e.stopPropagation();
        openPopup(this._cfg?.hash);
      });
      this._sync = () => this._syncOpen();
      this._key = (e) => {
        if (e.key !== "Escape" || e.defaultPrevented) return;
        if (e.composedPath().some((n) => n.localName?.includes("dialog"))) return;
        this.close();
      };
      this._swipe();
      this._ro = new ResizeObserver(() => this._stack());
      this._ro.observe(this._body);
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      const old = this._cfg?.hash;
      this._cfg = { ...DEF, ...c, hash: cleanHash(c.hash), info: [].concat(c.info || []).map((x) => typeof x === "string" ? { entity: x } : x) };
      this._rows = normRows(c);
      this._cols = Math.min(4, Math.max(1, +this._cfg.columns || 2));
      if (this.isConnected && old !== this._cfg.hash) {
        this._unreg(old);
        this._reg();
      }
      this._head();
      this._dirty = true;
      if (this._isOpen || this._mode === "preview") this._grid();
      this._syncOpen();
    }
    set hass(h) {
      this._h = h;
      if (!this._isOpen && this._mode !== "preview") return;
      this._info();
      this._cells().forEach((el2) => this._setHass(el2));
    }
    getCardSize() {
      return this._mode === "live" ? 0 : 1;
    }
    getGridOptions() {
      return { columns: "full", rows: "auto" };
    }
    connectedCallback() {
      ["hashchange", "popstate", "location-changed"].forEach((ev) => window.addEventListener(ev, this._sync));
      this._detect();
      requestAnimationFrame(() => this._detect());
    }
    disconnectedCallback() {
      ["hashchange", "popstate", "location-changed"].forEach((ev) => window.removeEventListener(ev, this._sync));
      this._unreg(this._cfg?.hash);
      if (this._isOpen) this._hide(true);
    }
    _reg() {
      if (this._cfg?.hash && this._mode !== "preview") register(this._cfg.hash, this);
    }
    _unreg(h) {
      if (h) unregister(h, this);
    }
    _detect() {
      if (!this.isConnected) return;
      let m = this.preview || this.hasAttribute("preview") ? "preview" : this.editMode ? "edit" : "live";
      for (let n = this, i = 0; n && i < 60; i++) {
        if (EDIT.has(n.tagName)) {
          m = "edit";
          break;
        }
        if (PREV.has(n.tagName)) {
          m = "preview";
          break;
        }
        n = n.parentElement || n.getRootNode?.().host;
      }
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
      let y0 = 0, x0 = 0, dy = 0, t0 = 0, ok = false, drag = false;
      const mobile = () => matchMedia("(max-width:600px)").matches;
      sh.addEventListener("touchstart", (e) => {
        ok = this._isOpen && mobile() && e.touches.length === 1 && (!e.composedPath().includes(this._body) || this._body.scrollTop <= 0);
        if (!ok) return;
        y0 = e.touches[0].clientY;
        x0 = e.touches[0].clientX;
        dy = 0;
        t0 = Date.now();
        drag = false;
      }, { passive: true });
      sh.addEventListener("touchmove", (e) => {
        if (!ok) return;
        const d = e.touches[0].clientY - y0, dx = e.touches[0].clientX - x0;
        if (!drag) {
          if (Math.abs(d) < 8 && Math.abs(dx) < 8) return;
          if (d <= 0 || Math.abs(dx) > d) {
            ok = false;
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
          ok = false;
          return;
        }
        drag = false;
        ok = false;
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
      r.querySelector(".ph .t").innerHTML = `${esc(c.title || "Pop-up")} <small>${c.hash ? `#${esc(c.hash)}` : "kein Hash eingestellt"}</small>`;
      this._sh.style.setProperty("--pw", `${+c.width || DEF.width}px`);
      this._sh.setAttribute("aria-label", c.title || "Pop-up");
      this._body.style.setProperty("--cols", this._cols);
      this._infoEl.classList.toggle("scroll", c.info_layout === "scroll");
      this._chips = null;
      if (this._h) this._info();
    }
    _info() {
      const items = this._cfg.info, h = this._h, bar = this._infoEl;
      bar.hidden = !items.length;
      if (!this._chips || this._chips.length !== items.length) {
        bar.innerHTML = "";
        this._chips = items.map((o) => {
          const d = document.createElement("div");
          d.className = "chip";
          d.tabIndex = 0;
          d.setAttribute("role", "button");
          d.innerHTML = '<span class="ci"></span><span class="cn"></span><span class="cv"></span>';
          const open = () => o.entity && moreInfo(this, o.entity);
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
        const d = this._chips[i], s = h.states[o.entity];
        setIcon(d.querySelector(".ci"), iconOf(h, o, "mdi:information-outline"));
        d.querySelector(".cn").textContent = o.name || "";
        d.querySelector(".cv").textContent = s ? valueOf(h, s, o) : "Nicht gefunden";
        d.title = nameOf(h, o);
        const al = !!o.alert && alertHit({ state: o.alert_state, above: o.alert_above, below: o.alert_below }, s);
        d.classList.toggle("al", al);
        if (al) d.style.setProperty("--c", roleVars(o.alert_color || "accent-2").c);
      });
    }
    /* --- Raster --- */
    _cells() {
      return [...this._body.querySelectorAll(":scope>.cell>*")].filter((el2) => !el2.classList.contains("err"));
    }
    _setHass(el2) {
      if (!this._h) return;
      try {
        el2.hass = this._h;
      } catch (e) {
        console.warn("[nova-cards] Karte im Pop-up:", e);
      }
    }
    _stack() {
      this._body.classList.toggle("stack", this._body.clientWidth > 0 && this._body.clientWidth < (+this._cfg?.stack_below || 0));
    }
    _grid() {
      this._dirty = false;
      const old = this._pool || /* @__PURE__ */ new Map(), pool = /* @__PURE__ */ new Map(), list2 = [];
      this._rows.forEach((row) => row.cells.forEach((cell, i) => {
        const key = JSON.stringify(cell.card);
        let w = old.get(key)?.shift();
        if (!w) {
          w = document.createElement("div");
          w.className = "cell";
          if (cell.card) {
            this._mount(w, cell.card);
            w.addEventListener("ll-rebuild", (e) => {
              e.stopPropagation();
              this._mount(w, cell.card);
            });
          } else w.classList.add("empty");
        }
        w.style.gridColumn = `${i === 0 ? "1 / " : ""}span ${Math.min(cell.span || 1, this._cols)}`;
        (pool.get(key) || pool.set(key, []).get(key)).push(w);
        list2.push(w);
      }));
      this._pool = pool;
      if (!list2.length) {
        const p = document.createElement("div");
        p.className = "hint";
        p.textContent = "Noch keine Karten – im Editor eine Vorlage wählen und Karten einfügen.";
        list2.push(p);
      }
      this._body.replaceChildren(...list2);
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
  define("popup-card", NovaPopupCard, { name: "Nova Pop-up Card", description: "Pop-up mit beliebigen Karten, geöffnet per URL-Hash (z. B. #wohnzimmer) – vom Dock oder jeder Karte mit Navigations-Aktion.", documentationURL: docUrl("nova-pop-up-card") });
  var TEMPLATES = [
    { label: "Eine Karte groß", columns: 1, rows: [[1]] },
    { label: "Groß oben, zwei klein darunter", columns: 2, rows: [[2], [1, 1]] },
    { label: "Zwei nebeneinander", columns: 2, rows: [[1, 1]] },
    { label: "Raster 2×2", columns: 2, rows: [[1, 1], [1, 1]] },
    { label: "Drei nebeneinander", columns: 3, rows: [[1, 1, 1]] }
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
  var GENERAL = [
    { name: "hash", required: true, selector: T },
    g2({ name: "title", selector: T }, { name: "icon", selector: I }),
    g2(
      { name: "width", selector: { number: { min: 320, max: 1600, step: 10, mode: "box", unit_of_measurement: "px" } } },
      { name: "stack_below", selector: { number: { min: 0, max: 1200, step: 10, mode: "box", unit_of_measurement: "px" } } }
    )
  ];
  var HEAD = [sel("info_layout", [["wrap", "Umbrechen"], ["scroll", "Waagrecht scrollen"]])];
  var INFO = [
    ENT,
    NAMEICON,
    g2({ name: "decimals", selector: { number: { min: 0, max: 4, mode: "box" } } }, { name: "alert", selector: { boolean: {} } }),
    g2({ name: "alert_state", selector: T }, ROLE("alert_color")),
    g2(NUM("alert_above"), NUM("alert_below"))
  ];
  var COLS = [{ name: "columns", selector: { number: { min: 1, max: 4, mode: "slider" } } }];
  var LABELS = {
    hash: "Hash (ohne #)",
    title: "Titel",
    icon: "Icon",
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
    alert_below: "Achtung unter",
    columns: "Spalten"
  };
  var HELPERS = {
    hash: "Öffnet das Pop-up, wenn die Adresse auf #… endet. Beispiel: wohnzimmer → Navigations-Aktion auf #wohnzimmer.",
    stack_below: "Ist das Pop-up schmaler als dieser Wert, stehen alle Karten untereinander (0 = nie).",
    alert_state: "z. B. on oder open, mehrere mit Komma. Leer = an bzw. Problem (z. B. Fenster offen)."
  };
  var ED_CSS = `
details.item>.body{gap:12px}
.mini{display:flex;flex-direction:column}
.gap{height:10px;border-radius:4px}.gap.hot{background:var(--primary-color);opacity:.7}
.row{display:grid;gap:8px;border-radius:12px}
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
.more{border:1px dashed var(--divider-color,#444);border-radius:12px;background:none;color:var(--secondary-text-color);cursor:pointer;min-height:56px;display:flex;align-items:center;justify-content:center;padding:0}
.panel{border:1px solid var(--primary-color);border-radius:12px;padding:10px;display:flex;flex-direction:column;gap:10px;margin-top:8px}
.tools{display:flex;align-items:center;gap:2px;flex-wrap:wrap}.tools .w{font-size:12px;opacity:.75;padding:0 2px;min-width:52px;text-align:center}.tools .fill{flex:1}
.tpls{display:grid;grid-template-columns:repeat(auto-fill,minmax(96px,1fr));gap:8px}
.tpl{display:flex;flex-direction:column;gap:6px;align-items:center;padding:8px 6px;border-radius:12px;border:1px solid var(--divider-color,#444);background:none;color:inherit;cursor:pointer;font:inherit;font-size:11.5px;text-align:center}
.tpl:hover{border-color:var(--primary-color)}
.tp{display:grid;gap:3px;width:56px}.tp i{display:block;height:13px;border-radius:3px;background:var(--primary-color);opacity:.55}
.pick{max-height:460px;overflow:auto}
.plist{display:flex;flex-wrap:wrap;gap:6px}
.plist button{display:inline-flex;align-items:center;gap:6px;padding:6px 10px;border-radius:999px;border:1px solid var(--divider-color,#444);background:none;color:inherit;font:inherit;font-size:12.5px;cursor:pointer}
.plist button:hover{border-color:var(--primary-color)}.plist ha-icon{--mdc-icon-size:16px}
.search,textarea.json{width:100%;box-sizing:border-box;background:var(--card-background-color,transparent);color:inherit;border:1px solid var(--divider-color,#444);border-radius:8px;padding:8px;font:inherit}
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
  var NovaPopupCardEditor = class extends NovaEditorBase {
    set hass(h) {
      super.hass = h;
      [this._sub, this._pick].forEach((x) => {
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
    _rows() {
      return normRows(this._config);
    }
    _colsN() {
      return Math.min(4, Math.max(1, +this._config.columns || DEF.columns));
    }
    _emitRows(rows, keep) {
      const c = { ...this._config, rows: serRows(rows) };
      delete c.cards;
      if (keep !== void 0) {
        this._sel = null;
        rows.forEach((r, ri) => r.cells.forEach((x, ci) => {
          if (x === keep) this._sel = [ri, ci];
        }));
      }
      this._emit(c);
    }
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}${ED_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap");
      this._sub = this._pick = null;
      this._blocks = {};
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
      const f = this._form(GENERAL, data, (v) => {
        const c = merge(this._config, names(GENERAL), v);
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
      b.append(this._hint("Titel und Icon stehen unter „Allgemein“. Info-Entitäten erscheinen als kleine Chips unter dem Titel, Antippen öffnet die Details."));
      b.append(this._form(HEAD, { info_layout: DEF.info_layout, ...this._config }, (v) => {
        const c = merge(this._config, names(HEAD), v);
        if (c.info_layout === DEF.info_layout) delete c.info_layout;
        this._emit(c);
      }));
      this._itemList(b, "info", INFO, { item: "Info", icon: "mdi:information-outline" }, "Info-Entität hinzufügen");
      return d;
    }
    _secLayout() {
      const [d, b] = this._sec("sec.layout", "mdi:view-grid-outline", "Layout & Vorlage");
      b.append(this._form(COLS, { columns: this._colsN() }, (v) => {
        this._emit({ ...this._config, columns: v.columns || DEF.columns });
        this._rebuild();
      }));
      b.append(this._hint("Vorlage legt leere Plätze an. Vorhandene Karten wandern der Reihe nach hinein, übrige bleiben unten erhalten."));
      const g = el("div", "tpls");
      TEMPLATES.forEach((t) => {
        const btn = el("button", "tpl");
        btn.type = "button";
        btn.innerHTML = `<span class="tp" style="grid-template-columns:repeat(${t.columns},1fr)">${t.rows.map((row) => row.map((s) => `<i style="grid-column:span ${s}"></i>`).join("")).join("")}</span><span></span>`;
        btn.lastChild.textContent = t.label;
        btn.addEventListener("click", (e) => {
          e.preventDefault();
          this._template(t);
        });
        g.append(btn);
      });
      b.append(g);
      return d;
    }
    _template(t) {
      const left = this._rows().flatMap((r) => r.cells).filter((x) => x.card);
      const rows = t.rows.map((row) => ({ cells: row.map((span) => ({ span, card: left.shift()?.card ?? null })) }));
      left.forEach((x) => rows.push({ cells: [{ span: t.columns, card: x.card }] }));
      this._sel = null;
      this._secs.add("sec.content");
      this._emit({ ...this._config, columns: t.columns, rows: serRows(rows) });
      this._rebuild();
    }
    /* --- Inhalt: Miniatur des Rasters --- */
    _secContent() {
      const [d, b] = this._sec("sec.content", "mdi:view-dashboard-edit-outline", "Inhalt");
      const rows = this._rows(), cols = this._colsN();
      if (this._sel && !rows[this._sel[0]]?.cells[this._sel[1]]) this._sel = null;
      b.append(this._hint("So sieht das Raster im Pop-up aus. Antippen zum Bearbeiten, am Griff ziehen zum Verschieben (am PC geht auch der ganze Block)."));
      const mini = this._mini = el("div", "mini");
      rows.forEach((row, ri) => {
        mini.append(Object.assign(el("div", "gap"), { _i: ri }));
        const re = el("div", "row");
        re._r = ri;
        re.style.gridTemplateColumns = `repeat(${cols},minmax(0,1fr))`;
        row.cells.forEach((cell, ci) => re.append(this._block(cell, ri, ci, cols)));
        const used = row.cells.reduce((s, x) => s + Math.min(x.span, cols), 0) % cols;
        if (used) {
          const m = el("button", "more", '<ha-icon icon="mdi:plus"></ha-icon>');
          m.type = "button";
          m.title = "Platz in dieser Zeile hinzufügen";
          m.style.gridColumn = `span ${cols - used}`;
          m.addEventListener("click", (e) => {
            e.preventDefault();
            const rs = this._rows();
            const x = { span: 1, card: null };
            rs[ri].cells.push(x);
            this._picking = true;
            this._emitRows(rs, x);
            this._rebuild();
          });
          re.append(m);
        }
        mini.append(re);
        if (this._sel?.[0] === ri) mini.append(this._panel(rows, cols));
      });
      mini.append(Object.assign(el("div", "gap"), { _i: rows.length }));
      b.append(mini);
      b.append(this._add("Zeile hinzufügen", () => {
        const rs = this._rows(), x = { span: cols, card: null };
        rs.push({ cells: [x] });
        this._picking = true;
        this._emitRows(rs, x);
        this._rebuild();
      }));
      return d;
    }
    _block(cell, ri, ci, cols) {
      const b = el("div", "blk");
      b.tabIndex = 0;
      b.setAttribute("role", "button");
      b.style.gridColumn = `${ci === 0 ? "1 / " : ""}span ${Math.min(cell.span, cols)}`;
      b._r = ri;
      b._c = ci;
      const sel2 = this._sel?.[0] === ri && this._sel?.[1] === ci;
      b.classList.toggle("sel", sel2);
      const grip = el("span", "drag", '<ha-icon icon="mdi:drag"></ha-icon>');
      grip.title = "Ziehen zum Verschieben";
      if (!cell.card) {
        b.classList.add("slot");
        b.innerHTML = '<ha-icon icon="mdi:plus"></ha-icon><span>Karte hinzufügen</span>';
      } else {
        b.innerHTML = '<ha-icon class="bi"></ha-icon><span class="bl"><b></b><small></small></span><span class="sp"></span>';
        this._label(b, cell, cols);
      }
      b.prepend(grip);
      const toggle = () => {
        if (Date.now() - (this._dragged || 0) < 200) return;
        this._picking = !cell.card;
        this._yaml = false;
        this._sel = sel2 && cell.card ? null : [ri, ci];
        this._rebuild();
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
    _label(b, cell, cols) {
      const c = cell.card, t = cardTitle(this._hass, c), n = typeName(c.type);
      b.querySelector(".bi").setAttribute("icon", cardIcon(this._hass, c));
      b.querySelector("b").textContent = t || n;
      b.querySelector("small").textContent = t ? n : "";
      b.querySelector(".sp").textContent = cols > 1 ? `${Math.min(cell.span, cols)}/${cols}` : "";
    }
    /* --- Einstellungen des gewählten Blocks --- */
    _panel(rows, cols) {
      const [ri, ci] = this._sel, cell = rows[ri].cells[ci], p = el("div", "panel");
      const tools = el("div", "tools"), span = Math.min(cell.span, cols);
      const set = (fn) => {
        const rs = this._rows(), x = rs[ri].cells[ci];
        fn(rs, x);
      };
      tools.append(
        this._btn("mdi:arrow-collapse-horizontal", "Schmaler", () => set((rs, x) => {
          x.span = span - 1;
          this._emitRows(rs, x);
          this._rebuild();
        }), span <= 1),
        Object.assign(el("span", "w"), { textContent: `${span} von ${cols}`, title: "Spaltenbreite" }),
        this._btn("mdi:arrow-expand-horizontal", "Breiter", () => set((rs, x) => {
          x.span = span + 1;
          this._emitRows(rs, x);
          this._rebuild();
        }), span >= cols),
        el("span", "fill")
      );
      if (cell.card) tools.append(
        this._btn("mdi:pencil-outline", this._yaml ? "Grafischer Editor" : "Als YAML bearbeiten", () => {
          this._yaml = !this._yaml;
          this._picking = false;
          this._rebuild();
        }),
        this._btn("mdi:swap-horizontal", "Andere Karte wählen", () => {
          this._picking = !this._picking;
          this._rebuild();
        }),
        this._btn("mdi:content-copy", "Duplizieren", () => set((rs, x) => {
          const n = { span: x.span, card: clone(x.card) };
          rs[ri].cells.splice(ci + 1, 0, n);
          this._emitRows(rs, n);
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
      if (b && !b.classList.contains("slot")) this._label(b, x, this._colsN());
    }
    // HA-INTERN: hui-card-picker (Kartenauswahl von HA). Fehlt sie, gibt es eine eigene Liste.
    _picker(box, ri, ci) {
      box.append(this._hint("Karte auswählen – sie kommt in diesen Platz."));
      const host = el("div", "pick");
      const ha = !this._simple && customElements.get("hui-card-picker");
      let ok = false;
      if (ha) {
        try {
          const p = document.createElement("hui-card-picker");
          p.hass = this._hass;
          if (this._ll) p.lovelace = this._ll;
          p.addEventListener("config-changed", (e) => {
            e.stopPropagation();
            const c = e.detail?.config;
            if (c?.type) this._setCard(ri, ci, c, true);
          });
          host.append(p);
          this._pick = p;
          ok = true;
        } catch (e) {
          console.warn("[nova-cards] Kartenauswahl von HA nicht nutzbar", e);
          host.innerHTML = "";
        }
      }
      if (!ok) this._simplePicker(host, ri, ci);
      box.append(host);
      if (ha) {
        const l = el("button", "lnk");
        l.type = "button";
        l.textContent = this._simple ? "Kartenauswahl von Home Assistant zeigen" : "Einfache Liste zeigen";
        l.addEventListener("click", (e) => {
          e.preventDefault();
          this._simple = !this._simple;
          this._rebuild();
        });
        box.append(l);
      }
    }
    _simplePicker(host, ri, ci) {
      const q = el("input", "search");
      q.placeholder = "Karte suchen …";
      const list2 = el("div", "plist");
      const all = [
        ...customs().map((c) => ({ type: `custom:${c.type}`, name: (c.name || c.type).replace(/ \(Dev\)$/, ""), icon: "mdi:puzzle-outline" })),
        ...Object.entries(HA_CARDS).map(([type, [name, icon]]) => ({ type, name, icon }))
      ];
      const draw = () => {
        const s = q.value.trim().toLowerCase();
        list2.innerHTML = "";
        all.filter((x) => !s || x.name.toLowerCase().includes(s) || x.type.includes(s)).forEach((x) => {
          const b = el("button", "", `<ha-icon icon="${esc(x.icon)}"></ha-icon><span></span>`);
          b.type = "button";
          b.lastChild.textContent = x.name;
          b.addEventListener("click", async (e) => {
            e.preventDefault();
            this._setCard(ri, ci, await this._stub(x.type), true);
          });
          list2.append(b);
        });
      };
      q.addEventListener("input", draw);
      draw();
      host.append(q, list2);
    }
    // HA-INTERN: getStubConfig() der Kartenklasse (bei HA-Karten hui-<typ>-card). Klappt es nicht, nur {type}.
    async _stub(type) {
      const ents = Object.keys(this._hass?.states || {});
      try {
        const custom = type.startsWith("custom:"), name = custom ? type.slice(7) : `hui-${type}-card`;
        if (!custom) {
          try {
            (await helpers()).createCardElement({ type });
          } catch {
          }
        }
        await Promise.race([customElements.whenDefined(name), wait(2e3)]);
        const s = await customElements.get(name)?.getStubConfig?.(this._hass, ents, ents);
        return { ...s && typeof s === "object" ? s : {}, type };
      } catch {
        return { type };
      }
    }
    // HA-INTERN: hui-card-element-editor (Karteneditor von HA mit eigenem GUI/YAML-Umschalter). Fehler → YAML-Feld.
    _cardEditor(box, ri, ci) {
      const cfg = this._rows()[ri].cells[ci].card;
      try {
        const ed = document.createElement("hui-card-element-editor");
        ed.hass = this._hass;
        if (this._ll) ed.lovelace = this._ll;
        ed.value = cfg;
        ed.addEventListener("config-changed", (e) => {
          e.stopPropagation();
          const c = e.detail?.config;
          if (!e.detail?.error && c && typeof c === "object" && c.type) this._setCard(ri, ci, c, false);
        });
        ed.addEventListener("GUImode-changed", (e) => e.stopPropagation());
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
      const cfg = this._rows()[ri].cells[ci].card;
      const take = (v) => {
        if (v && typeof v === "object" && !Array.isArray(v) && v.type) {
          this._setCard(ri, ci, v, false);
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
      ta.value = JSON.stringify(cfg, null, 2);
      ta.spellcheck = false;
      ta.addEventListener("input", () => {
        let ok = false;
        try {
          ok = take(JSON.parse(ta.value));
        } catch {
        }
        ta.classList.toggle("bad", !ok);
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
      if (!t) for (const re of m.querySelectorAll(":scope>.row")) {
        if (!inR(re.getBoundingClientRect())) continue;
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
        const rows = m.querySelectorAll(":scope>.row");
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
  __publicField(NovaPopupCardEditor, "labels", LABELS);
  __publicField(NovaPopupCardEditor, "helpers", HELPERS);
  define("popup-card-editor", NovaPopupCardEditor);

  // src/dock.js
  var countOn = (h, group, ex) => (h.states[group]?.attributes.entity_id || []).filter((id) => !(ex || []).includes(id) && isOn(h.states[id])).length;
  var PCSS2 = `
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
      r.innerHTML = `<style>${DOCK_VARS}${PCSS2}</style><div class="root"><div class="hd"><ha-icon class="hi"></ha-icon><span class="tt"></span><div class="x" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></div></div><div class="body"></div></div>`;
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
      if (!this._cards.length) this._body.innerHTML = '<div class="empty">Noch keine Karten in diesem Popup – im Editor unter „Popup-Karten“ eintragen.</div>';
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
.d{width:var(--sz);height:var(--sz);border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:var(--nv-fg);cursor:pointer;position:relative;transition:all .2s;-webkit-tap-highlight-color:transparent;outline:none}
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
  var SRC = {};
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
      this._close();
      this._items = null;
      this._btns = null;
      this._built = false;
      this._cur = -1;
      if (this._h) this.hass = this._h;
    }
    set hass(h) {
      this._h = h;
      if (!this._cfg) return;
      if (!this._items) {
        if (this._cfg.items) this._items = this._cfg.items;
        else {
          this._loadSource();
          return;
        }
      }
      if (!this._built) this._build();
      if (this._pop) this._pop.hass = h;
      if (this._hp) this._hp.hass = h;
      this._update();
    }
    async _loadSource() {
      if (this._loading) return;
      this._loading = true;
      const k = this._cfg.source;
      SRC[k] = SRC[k] || this._h.callWS({ type: "lovelace/config", url_path: k === "default" ? null : k }).then(findDock).catch(() => null);
      const d = await SRC[k];
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
        const h = cleanHash(it.popup_hash);
        this._close();
        return curHash() === h ? closePopup(h) : this._openHash(h);
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
    // Nova Pop-up Card per Hash öffnen. Liegt sie nicht in der aktuellen Ansicht, holt das Dock ihre
    // Konfiguration aus dem Dashboard und zeigt sie selbst an – so geht es in jeder Ansicht.
    async _openHash(h) {
      openPopup(h);
      if (hasPopup(h) || !this._h) return;
      const cfg = await findPopup(this._h, h, this._cfg.source);
      if (!cfg || curHash() !== h || hasPopup(h) || !customElements.get(tag("popup-card"))) return;
      const key = JSON.stringify(cfg);
      if (this._hp?._cfgKey !== key) {
        this._hp?.remove();
        const p = document.createElement(tag("popup-card"));
        p._fallback = true;
        p._cfgKey = key;
        p.setConfig(cfg);
        this._hp = p;
      }
      this._hp.hass = this._h;
      if (!this._hp.isConnected) this.shadowRoot.appendChild(this._hp);
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
  var MAIN = [
    { type: "grid", name: "", schema: [
      { name: "position", selector: { select: { mode: "dropdown", options: [{ value: "bottom", label: "Unten" }, { value: "top", label: "Oben" }] } } },
      { name: "button_size", selector: { number: { min: 32, max: 72, step: 2, mode: "box", unit_of_measurement: "px" } } }
    ] },
    { name: "source", selector: { text: {} } }
  ];
  var ITEM = [
    { type: "grid", name: "", schema: [
      { name: "icon", required: true, selector: { icon: {} } },
      { name: "label", selector: { text: {} } }
    ] },
    { name: "tap_action", selector: { ui_action: {} } },
    { name: "popup_hash", selector: { select: { mode: "dropdown", custom_value: true, options: [] } } },
    { name: "popup_title", selector: { text: {} } },
    { name: "cards", selector: { object: {} } },
    { name: "badge", selector: { entity: {} } },
    { type: "grid", name: "", schema: [
      { name: "badge_count_of", selector: { entity: {} } },
      { name: "badge_show_number", selector: { boolean: {} } }
    ] },
    { name: "badge_exclude", selector: { entity: { multiple: true } } }
  ];
  var LABELS2 = {
    position: "Position",
    button_size: "Button-Größe",
    source: "Einträge aus anderem Dashboard übernehmen",
    icon: "Icon",
    label: "Name",
    tap_action: "Aktion beim Antippen",
    popup_title: "Popup-Titel",
    popup_hash: "Nova Pop-up öffnen",
    cards: "Popup-Karten (YAML-Liste)",
    badge: "Punkt, wenn diese Entität an ist",
    badge_count_of: "Zähler: Gruppe",
    badge_show_number: "Zahl statt Punkt",
    badge_exclude: "Beim Zählen ignorieren"
  };
  var HELPERS2 = {
    source: "Optional: URL-Pfad eines Dashboards (z. B. neues-zuhause). Dann gilt dessen Dock – praktisch für mehrere Dashboards mit gleicher Leiste.",
    popup_hash: "Öffnet die Nova Pop-up Card mit diesem Hash (Liste = Pop-ups in diesem Dashboard). Hat Vorrang vor Aktion und Popup-Karten.",
    cards: "Wenn gesetzt, öffnet der Button ein Popup mit diesen Karten (statt der Aktion). Beispiel: - type: tile, entity: light.flur",
    badge_count_of: "Zeigt Punkt/Zahl, wenn Mitglieder der Gruppe an sind (z. B. light.alle_lampen)"
  };
  var NovaDockCardEditor = class extends NovaEditorBase {
    // Pop-ups des Dashboards für die Auswahlliste einmal laden
    set hass(h) {
      super.hass = h;
      if (h && !this._hashes) {
        this._hashes = [];
        dashPopups(h, void 0, true).then((list2) => {
          this._hashes = list2;
          this._rebuild();
        });
      }
    }
    _schema() {
      const opts = [{ value: "", label: "– keins –" }, ...(this._hashes || []).map((p) => {
        const h = cleanHash(p.hash);
        return { value: h, label: `${p.title || h} (#${h})` };
      })];
      return ITEM.map((x) => x.name === "popup_hash" ? { ...x, selector: { select: { ...x.selector.select, options: opts } } } : x);
    }
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap");
      const main = { position: "bottom", button_size: 48, ...this._config };
      w.append(this._form(MAIN, main, (v) => {
        const c = merge(this._config, names(MAIN), v);
        if (c.position === "bottom") delete c.position;
        if (c.button_size === 48) delete c.button_size;
        const hadSrc = !!this._config.source;
        this._emit(c);
        if (hadSrc !== !!c.source) this._rebuild();
      }));
      if (this._config.source && !(this._config.items || []).length) w.append(this._hint("Einträge kommen aus dem anderen Dashboard. Eigene Einträge unten überschreiben das."));
      w.append(this._h3("Buttons"));
      const items = this._config.items || [];
      items.forEach((it, i) => w.append(this._item(it, i, items.length)));
      w.append(this._add("Button hinzufügen", () => {
        const n = [...items, { icon: "mdi:circle-outline" }];
        this._open = /* @__PURE__ */ new Set([n.length - 1]);
        this._emit({ ...this._config, items: n });
        this._rebuild();
      }));
    }
    _label(it, i) {
      return `${i + 1}. ${it.label || it.popup_title || (it.popup_hash ? `#${cleanHash(it.popup_hash)}` : "") || (Array.isArray(it.cards) ? "Popup" : it.tap_action?.navigation_path) || "Neuer Button"}`;
    }
    _item(it, i, n) {
      const [d, s, b] = this._details(i, it.icon || "mdi:circle-outline", this._label(it, i), this._itemBtns(i, n, (dir) => this._move(i, dir), () => this._remove(i)));
      const schema = this._schema();
      b.append(this._form(schema, it, (v) => {
        const list2 = [...this._config.items];
        const nx = merge(list2[i], names(schema), v);
        if (nx.popup_hash) nx.popup_hash = cleanHash(nx.popup_hash);
        if (!nx.popup_hash) delete nx.popup_hash;
        if (nx.cards && !Array.isArray(nx.cards)) nx.cards = [nx.cards];
        if (!nx.badge_show_number) delete nx.badge_show_number;
        list2[i] = nx;
        this._emit({ ...this._config, items: list2 });
        s.querySelector(".lbl").textContent = this._label(nx, i);
        s.querySelector("ha-icon").setAttribute("icon", nx.icon || "mdi:circle-outline");
      }));
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
  __publicField(NovaDockCardEditor, "labels", LABELS2);
  __publicField(NovaDockCardEditor, "helpers", HELPERS2);
  define("dock-card-editor", NovaDockCardEditor);
})();
