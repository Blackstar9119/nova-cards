/* Nova Cards v0.11.0b5 DEV – Testbuild, alle Karten als custom:nova-dev-*. Nicht veröffentlichen. */
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
  var NAVI_VARS = `:host{
--nv-bg:var(--nova-background,linear-gradient(160deg,rgba(80,96,128,.55),rgba(22,27,42,.62)));
--nv-border:var(--nova-border-color,rgba(255,255,255,.16));
--nv-fg:var(--nova-text-color,#fff);
--nv-accent:var(--nova-accent-color,#f5b83d);
--nv-active:var(--nova-active-color,#3d8bf5);
--nv-chip:var(--nova-chip-color,rgba(255,255,255,.1));
--nv-blur:var(--nova-blur,22px);
--nv-active-fg:var(--nova-active-text-color,#fff);
--nv-a1:var(--nova-accent-1,#3d8bf5);--nv-a1-fg:var(--nova-accent-1-text,#fff);
--nv-a2:var(--nova-accent-2,#f5b83d);--nv-a2-fg:var(--nova-accent-2-text,#3a2a00);
--nv-a3:var(--nova-accent-3,#b5794a);--nv-a3-fg:var(--nova-accent-3-text,#fff);
--nv-a4:var(--nova-accent-4,#4caf6a);--nv-a4-fg:var(--nova-accent-4-text,#fff);
--nv-neutral:var(--nova-neutral,#7b8794);--nv-neutral-fg:var(--nova-neutral-text,#fff)}`;
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
    _btn(icon2, title, fn, dis) {
      const b = document.createElement("button");
      b.className = "ib";
      b.title = title;
      b.disabled = !!dis;
      b.innerHTML = `<ha-icon icon="${icon2}"></ha-icon>`;
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
    _details(key, icon2, label, btns, fill) {
      const d = document.createElement("details");
      d.className = "item";
      d.open = this._open.has(key);
      d.addEventListener("toggle", (e) => {
        e.stopPropagation();
        d.open ? this._open.add(key) : this._open.delete(key);
      });
      const s = document.createElement("summary");
      s.innerHTML = `<ha-icon icon="${esc(icon2)}"></ha-icon><span class="lbl"></span>`;
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
    _section(key, icon2, label, fill) {
      const open = this._openSecs ||= new Set(this.constructor.openSections || []), k = `sec.${key}`;
      if (open.has(key)) this._open.add(k);
      else this._open.delete(k);
      const [d] = this._details(k, icon2, label, [], fill);
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

  // src/navi.js
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
  var NovaNaviPopup = class extends HTMLElement {
    constructor() {
      super();
      const r = this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NAVI_VARS}${PCSS}</style><div class="root"><div class="hd"><ha-icon class="hi"></ha-icon><span class="tt"></span><div class="x" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></div></div><div class="body"></div></div>`;
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
      if (!this._cards.length) this._body.innerHTML = '<div class="empty">Noch keine Karten in diesem Pop-up – im Navi-Editor unter „Einfaches Pop-up: Karten“ eintragen.</div>';
    }
    set hass(h) {
      this._h = h;
      this._cards.forEach((c) => {
        c.hass = h;
      });
    }
  };
  define("navi-popup", NovaNaviPopup);
  var DCSS = `
:host{display:block;height:var(--nova-navi-space,var(--nova-dock-space,64px))}
:host([media]){height:calc(var(--nova-navi-space,var(--nova-dock-space,64px)) + 62px)}
:host([side]){height:0}
ha-icon{--mdc-icon-size:22px;display:flex}
.wrap{position:fixed;left:50%;transform:translateX(-50%);z-index:7;display:flex;flex-direction:column;align-items:stretch;gap:8px;max-width:calc(100vw - 24px)}
.wrap.bottom{bottom:calc(14px + env(safe-area-inset-bottom))}.wrap.top{top:14px;flex-direction:column-reverse}
.wrap.side{top:50%;bottom:auto;left:14px;right:auto;transform:translateY(-50%);max-width:none;max-height:calc(100vh - 28px);flex-direction:column}
.wrap.side.right{left:auto;right:14px}
.wrap.inline{position:static;transform:none;margin:0 auto;width:max-content;max-width:100%}
.glass{background:var(--nv-bg);backdrop-filter:blur(var(--nv-blur)) saturate(160%);-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(160%);border:1px solid var(--nv-border);box-shadow:0 12px 36px rgba(0,0,0,.4)}
.dk{position:relative;display:flex;border-radius:999px;max-width:100%;min-width:0;min-height:0}
.side .dk{flex-direction:column}
.dock{--g:8px;--o:6px;position:relative;z-index:1;flex:1 1 auto;min-width:0;min-height:0;margin:calc(-1 * var(--o));display:flex;align-items:center;gap:var(--g);padding:calc(8px + var(--o));border-radius:999px;overflow-x:auto;overflow-y:hidden;scrollbar-width:none;box-sizing:border-box;--a1:1;--a2:1;--md:to right}
.side .dock{flex-direction:column;overflow-x:hidden;overflow-y:auto;--md:to bottom}
.dock.fs{--a1:0}.dock.fe{--a2:0}
.dock.fs,.dock.fe{-webkit-mask-image:linear-gradient(var(--md),rgba(0,0,0,var(--a1)) var(--o),#000 calc(var(--o) + 22px),#000 calc(100% - var(--o) - 22px),rgba(0,0,0,var(--a2)) calc(100% - var(--o)));mask-image:linear-gradient(var(--md),rgba(0,0,0,var(--a1)) var(--o),#000 calc(var(--o) + 22px),#000 calc(100% - var(--o) - 22px),rgba(0,0,0,var(--a2)) calc(100% - var(--o)))}
.dock::-webkit-scrollbar{display:none}
.d{--s:var(--sz);z-index:1;width:var(--s);height:var(--s);box-sizing:border-box;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:var(--nv-fg);cursor:pointer;position:relative;transition:background-color .2s,color .2s,border-color .2s,box-shadow .2s,transform .2s,opacity .2s;-webkit-tap-highlight-color:transparent;outline:none;user-select:none;-webkit-user-select:none}
.d[hidden]{display:none}
.d:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
.d:active{transform:scale(.9)}
.d.act{background:var(--nv-active);box-shadow:0 0 16px color-mix(in srgb,var(--nv-active) 60%,transparent)}
/* Aktiver Eintrag: runde Markierung .hl gleitet unter die Buttons; Farbe nur übers Theme (--nova-navi-active-color), Standard Akzent 2.
   Animiert werden nur transform, opacity und max-width – schont schwache Tablets. */
.dk{--hc:var(--nova-navi-active-color,var(--nv-a2));--ease:cubic-bezier(.25,.8,.25,1)}
/* Glas der Leiste als eigene Ebene: gleitet beim Wechsel per transform auf die neue Breite (Blur bleibt unverändert) */
.dk>.bg{position:absolute;inset:0;border-radius:inherit;z-index:0;pointer-events:none;transform-origin:0 50%}
.hl{position:absolute;left:0;top:0;z-index:0;width:var(--sz);height:var(--sz);border-radius:50%;background:var(--hc);box-shadow:0 0 14px color-mix(in srgb,var(--hc) 50%,transparent);pointer-events:none;opacity:0;will-change:transform}
.hl.on{opacity:1}
.d.here{color:var(--nova-navi-active-text-color,var(--nv-a2-fg))}
/* Inaktiv-Farbe bleibt immer die Grundfarbe des Buttons; Gelb liegt als eigene Ebene darüber (unter dem Icon).
   So geht der alte Button direkt von Gelb zu Blau über, nie über transparent */
.d::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:50%;background:var(--hc);opacity:0;pointer-events:none}
.d.lit::before{opacity:1}
/* Während einer Animation: nur transform und opacity, gleiche Dauer und Kurve für alle Teile */
.run .d,.run .d::before,.run .nm,.run+.bg,.run .hl,.run .ghost{transition:transform var(--dur) var(--ease),opacity var(--dur) var(--ease),color var(--dur) var(--ease)}
/* Messen und Startlage setzen: ohne Übergang */
.hold .d,.hold .d::before,.hold .nm,.hold+.bg,.hold .hl{transition:none!important}
.ghost{position:absolute;left:0;top:0;z-index:1;pointer-events:none;white-space:nowrap;color:var(--nv-fg);font:600 14px/1.2 var(--ha-font-family-body,Roboto,sans-serif)}
.d img{width:calc(var(--s) * .6);height:calc(var(--s) * .6);object-fit:contain}
.nm{flex:none;z-index:1;max-width:0;overflow:hidden;white-space:nowrap;opacity:0;margin-left:calc(-1 * var(--g));color:var(--nv-fg);font:600 14px/1.2 var(--ha-font-family-body,Roboto,sans-serif)}
.nm.on{max-width:180px;opacity:1;margin-left:0;padding-right:6px}
.nm[hidden],.side .nm{display:none}
@media(prefers-reduced-motion:reduce){.dock,.dock *{transition:none!important}}
.dot{position:absolute;top:14%;right:14%;width:8px;height:8px;border-radius:50%;background:var(--bc,var(--nv-accent));box-shadow:0 0 6px var(--bc,var(--nv-accent));display:none}
.d.bd .dot{display:block}
.num{position:absolute;top:2px;right:0;min-width:16px;height:16px;padding:0 4px;box-sizing:border-box;border-radius:8px;background:var(--bc,var(--nv-accent));color:var(--bfg,#3a2a00);font:700 10px/16px var(--ha-font-family-body,Roboto,sans-serif);text-align:center;display:none}
.d.bn .num{display:block}.d.bn .dot{display:none}
.empty{color:var(--nv-fg);opacity:.7;font-size:13px;padding:6px 12px}
.mb{display:flex;align-items:center;gap:10px;padding:6px 6px 6px 6px;border-radius:999px;align-self:center;width:min(340px,calc(100vw - 24px));box-sizing:border-box;color:var(--nv-fg);font-family:var(--ha-font-family-body,Roboto,sans-serif)}
.mb[hidden]{display:none}
.mb .art{width:40px;height:40px;flex:none;border-radius:50%;background:var(--nv-chip) center/cover no-repeat;display:flex;align-items:center;justify-content:center}
.mb .art.pic ha-icon{display:none}
.mb .tx{flex:1;min-width:0;cursor:pointer}
.mb .tx b,.mb .tx span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mb .tx b{font-size:13px;font-weight:600}.mb .tx span{font-size:11px;opacity:.7}
.mb .pp{width:40px;height:40px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nv-active);color:var(--nv-active-fg);cursor:pointer;-webkit-tap-highlight-color:transparent}
.mb .pp:active{transform:scale(.9)}
.side .mb{width:auto;flex-direction:column;padding:6px;border-radius:28px}
.side .mb .tx{display:none}
.menu{position:fixed;z-index:8;display:flex;flex-direction:column;gap:4px;padding:6px;border-radius:22px;min-width:180px;max-width:calc(100vw - 16px);max-height:60vh;overflow-y:auto;box-sizing:border-box;color:var(--nv-fg);font-family:var(--ha-font-family-body,Roboto,sans-serif);animation:mi .16s ease-out}
.mi{display:flex;align-items:center;gap:10px;padding:8px 14px 8px 8px;border-radius:999px;cursor:pointer;font-size:14px;white-space:nowrap;-webkit-tap-highlight-color:transparent;outline:none}
.mi[hidden]{display:none}
.mi:hover,.mi:focus-visible{background:var(--nv-chip)}
.mi.here{background:var(--nv-chip);box-shadow:inset 0 0 0 1px rgba(255,255,255,.4)}
.mi .ic{width:32px;height:32px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nv-chip)}
.mi .ic img{width:60%;height:60%;object-fit:contain}
.mi ha-icon{--mdc-icon-size:18px}
@keyframes mi{from{opacity:0;transform:scale(.96)}}
/* Kompakt (schmale Bildschirme automatisch, oder per compact: true): kleinere Buttons und Abstände, Name nur am aktiven Eintrag */
@media(max-width:600px){.wrap:not(.nocmp) .d,.wrap:not(.nocmp) .hl{--s:calc(var(--sz) * .875)}.wrap:not(.nocmp) .hl{width:var(--s);height:var(--s)}.wrap:not(.nocmp) .dock{--g:5px;padding:calc(6px + var(--o))}.wrap:not(.nocmp) .nm,.wrap:not(.nocmp) .ghost{font-size:13px}}
.cmp .d,.cmp .hl{--s:calc(var(--sz) * .875)}.cmp .hl{width:var(--s);height:var(--s)}.cmp .dock{--g:5px;padding:calc(6px + var(--o))}.cmp .nm,.cmp .ghost{font-size:13px}`;
  var SRC2 = {};
  var TYPES = ["navi-card", "dock-card"];
  var findNavi = (o) => {
    if (!o || typeof o !== "object") return null;
    if ((TYPES.some((t) => o.type === `custom:${tag(t)}`) || o.type === "custom:nz-dock-card") && Array.isArray(o.items) && o.items.length) return o;
    for (const v of Object.values(o)) {
      const r = findNavi(v);
      if (r) return r;
    }
    return null;
  };
  var normPath = (p) => {
    p = String(p || "").split(/[?#]/)[0].replace(/\/+$/, "") || "/";
    try {
      return decodeURI(p);
    } catch {
      return p;
    }
  };
  var pathOf = (it) => it.tap_action?.action === "navigate" ? it.tap_action.navigation_path : it.navigation_path;
  var icon = (ic) => isImg(ic) ? `<img src="${esc(ic)}" alt="">` : `<ha-icon icon="${esc(ic)}"></ha-icon>`;
  var haptic = () => {
    window.dispatchEvent(new CustomEvent("haptic", { detail: "light" }));
    if (!window.externalApp && !window.webkit?.messageHandlers?.externalBus) try {
      navigator.vibrate?.(12);
    } catch {
    }
  };
  var visible = (h, it) => {
    if (list(it.visible_users).length && !list(it.visible_users).includes(h.user?.id)) return false;
    if (!it.visible_entity) return true;
    const s = h.states[it.visible_entity];
    const cond = { state: it.visible_state, state_not: it.visible_state_not, above: it.visible_above, below: it.visible_below };
    return Object.values(cond).some((v) => v != null) ? alertHit(cond, s) : isOn(s);
  };
  var MEDIA_ON = ["playing", "paused"];
  var LAST = /* @__PURE__ */ new Map();
  var REDUCED = window.matchMedia?.("(prefers-reduced-motion: reduce)");
  var NovaNaviCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("navi-card-editor"));
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
      this._watchSide();
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
    // Entitäten der Einträge (auch im Untermenü) und Media-Player, bei Zählern auch die Mitglieder der Gruppe
    _watch(h) {
      if (this._srcIds?.items !== this._items) this._srcIds = { items: this._items, ids: entityIds([this._items, this._srcCfg?.media_players]) };
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
      SRC2[k] = SRC2[k] || this._h.callWS({ type: "lovelace/config", url_path: k === "default" ? null : k }).then(findNavi).catch(() => null);
      const d = await SRC2[k];
      this._loading = false;
      this._items = d ? d.items : [];
      this._srcCfg = d || {};
      this.hass = this._h;
    }
    connectedCallback() {
      this._applyInline();
      requestAnimationFrame(() => this._applyInline());
      this._loc = () => {
        if (this._menu) this._close();
        this._update();
      };
      window.addEventListener("location-changed", this._loc);
      window.addEventListener("popstate", this._loc);
      window.addEventListener("hashchange", this._loc);
      this._watchSide();
      this._shown = null;
      this._update();
    }
    disconnectedCallback() {
      window.removeEventListener("location-changed", this._loc);
      window.removeEventListener("popstate", this._loc);
      window.removeEventListener("hashchange", this._loc);
      this._mq?.removeEventListener("change", this._mqf);
      this._mq = null;
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
      this.shadowRoot?.querySelector(".wrap")?.classList.toggle("inline", this._inline);
    }
    // Seitenleiste ab einer Mindestbreite (z. B. Tablet quer, PC), darunter Leiste unten bzw. oben
    _watchSide() {
      this._mq?.removeEventListener("change", this._mqf);
      this._mq = null;
      const c = this._cfg;
      if (!c || !this.isConnected || !["left", "right"].includes(c.sidebar)) return this._applySide();
      this._mq = window.matchMedia(`(min-width: ${+c.sidebar_min_width || 1024}px)`);
      this._mqf = () => this._applySide();
      this._mq.addEventListener("change", this._mqf);
      this._applySide();
    }
    get _side() {
      return this._mq?.matches ? this._cfg.sidebar : null;
    }
    _applySide() {
      const w = this.shadowRoot?.querySelector(".wrap"), s = this._side;
      this.toggleAttribute("side", !!s && !this._inline);
      if (!w) return;
      w.classList.toggle("side", !!s);
      w.classList.toggle("right", s === "right");
      w.classList.toggle(this._cfg.position === "top" ? "top" : "bottom", !s);
      if (this._menu) this._close();
      if (this._shown) this._shown = `${this._shown.split("|")[0]}|neu`;
      this._update();
    }
    _build() {
      this._built = true;
      const c = this._cfg, r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NAVI_VARS}${DCSS}</style><div class="wrap ${this._inline ? "inline" : ""} ${{ true: "cmp", false: "nocmp" }[this._opt("compact")] || ""}" style="--sz:${+c.button_size || 48}px;--dur:${this._dur}ms"><div class="mb glass" hidden><div class="art"><ha-icon icon="mdi:music"></ha-icon></div><div class="tx"><b></b><span></span></div><div class="pp" role="button" tabindex="0"><ha-icon></ha-icon></div></div><div class="dk"><div class="dock"><div class="hl"></div></div><div class="bg glass"></div></div></div>`;
      const dock = r.querySelector(".dock");
      this._dock = dock;
      this._bg = r.querySelector(".dk>.bg");
      this._hl = dock.firstChild;
      this._shown = null;
      dock.addEventListener("scroll", () => {
        const rec = LAST.get(this._key);
        if (rec) rec.sl = [dock.scrollLeft, dock.scrollTop];
        this._edges();
      }, { passive: true });
      this._mb = r.querySelector(".mb");
      this._mb.querySelector(".tx").addEventListener("click", () => this._mp && moreInfo(this, this._mp));
      const pp = this._mb.querySelector(".pp");
      const play = () => {
        if (!this._mp) return;
        if (this._haptic) haptic();
        this._h.callService("media_player", "media_play_pause", { entity_id: this._mp });
      };
      pp.addEventListener("click", play);
      pp.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          play();
        }
      });
      this._applySide();
      if (this._hp) r.appendChild(this._hp);
      if (!this._items.length) {
        this._dock = null;
        dock.innerHTML = `<span class="empty">${c.source ? `Kein Navi in „${esc(c.source)}“ gefunden` : "Noch keine Einträge"}</span>`;
        this._btns = [];
        return;
      }
      this._btns = this._items.map((it, i) => {
        const d = document.createElement("div");
        d.className = "d";
        d.tabIndex = 0;
        d.setAttribute("role", "button");
        d.title = it.label || it.popup_title || "";
        d.innerHTML = `${icon(it.icon || "mdi:circle-outline")}<span class="dot"></span><span class="num"></span>`;
        this._bind(d, it, (kind) => this._run(i, kind));
        d._nm = document.createElement("span");
        d._nm.className = "nm";
        dock.append(d, d._nm);
        return d;
      });
    }
    get _haptic() {
      return !!(this._cfg.haptic ?? this._srcCfg?.haptic);
    }
    // Antippen, doppelt antippen (wartet kurz auf den zweiten Tipp) und lange drücken
    _bind(el2, it, run) {
      let t, wait2;
      const hold = it.hold_action && it.hold_action.action !== "none", dbl = it.double_tap_action && it.double_tap_action.action !== "none";
      if (hold) {
        el2.addEventListener("pointerdown", () => {
          el2._held = false;
          clearTimeout(t);
          t = setTimeout(() => {
            el2._held = true;
            run("hold");
          }, 500);
        });
        ["pointerup", "pointerleave", "pointercancel"].forEach((ev) => el2.addEventListener(ev, () => clearTimeout(t)));
        el2.addEventListener("contextmenu", (e) => e.preventDefault());
      }
      el2.addEventListener("click", () => {
        if (el2._held) {
          el2._held = false;
          return;
        }
        if (!dbl) return run("tap");
        if (wait2) {
          clearTimeout(wait2);
          wait2 = null;
          return run("double_tap");
        }
        wait2 = setTimeout(() => {
          wait2 = null;
          run("tap");
        }, 250);
      });
      el2.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          run("tap");
        }
      });
    }
    _update() {
      if (!this._btns || !this._h) return;
      const h = this._h, here = normPath(location.pathname);
      const isHere = (it) => {
        const p = pathOf(it);
        return !!p && normPath(p) === here;
      };
      let cur2 = -1;
      this._items.forEach((it, i) => {
        const d = this._btns[i];
        if (!d) return;
        d.hidden = d._nm.hidden = !visible(h, it);
        d.classList.toggle("act", i === this._cur || !!it.popup_hash && curHash() === cleanHash(it.popup_hash));
        const hit = isHere(it) ? it : Array.isArray(it.menu) && it.menu.find(isHere) || null;
        if (hit && cur2 < 0 && !d.hidden) cur2 = i;
        d._nm.textContent = hit && hit.label || it.label || "";
        this._badge(d, it);
      });
      this._setActive(cur2);
      this._menu?.querySelectorAll(".mi").forEach((m) => {
        m.hidden = !visible(h, m._it);
        m.classList.toggle("here", isHere(m._it));
      });
      this._media();
    }
    _opt(k) {
      return this._cfg[k] ?? this._srcCfg?.[k];
    }
    get _dur() {
      const v = +this._opt("animation_duration");
      return v > 0 ? v : 280;
    }
    get _key() {
      return (this._items || []).map(pathOf).join("|");
    }
    // Aktiven Eintrag zeigen: Markierung und Name. Wechselt er, gleitet alles vom alten Zustand (auch aus der
    // vorherigen Karte, siehe LAST) zum neuen – erst Endlage messen, dann im Ausgangszustand starten (FLIP)
    _setActive(cur2) {
      const dock = this._dock;
      if (!dock) return;
      const lbl = this._opt("active_label") !== false && !this._side, lay = this._btns.map((d) => (d.hidden ? 0 : 1) + d._nm.textContent).join(",");
      const sig = `${cur2}|${lbl}|${this._side}|${this._dur}|${lay}`;
      if (this._shown === sig) return;
      const rec = LAST.get(this._key), fresh = rec && Date.now() - rec.t < 1500;
      const from = this._shown != null ? +this._shown.split("|")[0] : !rec ? -1 : rec.i !== cur2 ? rec.i : fresh && !rec.played ? rec.from : cur2;
      const first = this._shown == null;
      this._shown = sig;
      if (!rec || rec.i !== cur2) LAST.set(this._key, { i: cur2, from, t: Date.now(), sl: rec?.sl });
      const anim = this._opt("animation") !== false && !REDUCED?.matches && this.isConnected && !inPicker(this) && from !== cur2;
      if (first && rec?.sl) [dock.scrollLeft, dock.scrollTop] = rec.sl;
      if (anim && first) {
        this._apply(from, lbl);
        this._pillTo(from, from >= 0);
      }
      if (!anim) {
        this._jump(cur2, lbl);
        return this._reveal(cur2, false);
      }
      const go = () => {
        if (this._shown === sig) this._flip(cur2, lbl, sig);
      };
      requestAnimationFrame(() => document.fonts?.status === "loaded" ? go() : document.fonts.ready.then(go));
    }
    // Klassen für aktiven Eintrag i setzen (ohne Animation)
    _apply(i, lbl, lit = true) {
      this._btns.forEach((d, k) => {
        d.classList.toggle("here", k === i);
        d._nm.classList.toggle("on", k === i && lbl && !!d._nm.textContent);
      });
      if (lit) this._lit(i);
    }
    // Gelbe Ebene auf Button i (beim Wechsel gleichzeitig mit der Markierung übergeblendet)
    _lit(i) {
      this._btns.forEach((d, k) => d.classList.toggle("lit", k === i));
    }
    // Aktiven Eintrag (samt Name) in die Mitte des Scroll-Bereichs holen, wenn die Leiste nicht ganz passt.
    // Mit den Maßen aus dem Layout (ohne transforms); Pille und Buttons scrollen als Inhalt einfach mit
    // Weicher Rand nur dort, wo noch mehr zum Scrollen ist
    _edges() {
      const d = this._dock;
      if (!d) return;
      const v = !!this._side, x = v ? d.scrollTop : d.scrollLeft, max = v ? d.scrollHeight - d.clientHeight : d.scrollWidth - d.clientWidth;
      d.classList.toggle("fs", x > 1);
      d.classList.toggle("fe", x < max - 1);
    }
    _reveal(i, smooth, l) {
      this._edges();
      const dock = this._dock, d = this._btns[i];
      if (!dock || !d || dock.scrollWidth <= dock.clientWidth && dock.scrollHeight <= dock.clientHeight) return;
      const o = this._origin(), b = l || d.getBoundingClientRect(), nm = d._nm.classList.contains("on") ? d._nm.offsetWidth : 0;
      const left = b.left - o.x + (b.width + nm) / 2 - dock.clientWidth / 2, top = b.top - o.y + b.height / 2 - dock.clientHeight / 2;
      const x = this._side ? dock.scrollLeft : Math.max(0, left), y = this._side ? Math.max(0, top) : dock.scrollTop;
      if (Math.abs(x - dock.scrollLeft) < 1 && Math.abs(y - dock.scrollTop) < 1) return;
      dock.scrollTo({ left: x, top: y, behavior: smooth ? "smooth" : "auto" });
      const rec = LAST.get(this._key);
      if (rec) rec.sl = [x, y];
    }
    // Ursprung der absolut positionierten Ebenen (Innenkante der Leiste)
    _origin() {
      const r = this._dock.getBoundingClientRect();
      return { x: r.left + this._dock.clientLeft - this._dock.scrollLeft, y: r.top + this._dock.clientTop - this._dock.scrollTop };
    }
    _pillTo(i, show) {
      const d = this._btns[i], o = this._origin();
      if (d) {
        const b = d.getBoundingClientRect();
        this._hl.style.transform = `translate(${b.left - o.x}px,${b.top - o.y}px)`;
      }
      this._hl.classList.toggle("on", !!show && i >= 0);
    }
    _stop() {
      clearTimeout(this._ft);
      this._ghost?.remove();
      this._ghost = null;
      this._dock.classList.remove("run");
      this._dock.classList.add("hold");
      [this._bg, ...this._btns, ...this._btns.map((d) => d._nm)].forEach((e) => {
        e.style.transform = "";
        e.style.opacity = "";
      });
    }
    // Ohne Animation direkt in den Endzustand
    _jump(cur2, lbl) {
      this._stop();
      this._apply(cur2, lbl);
      this._pillTo(cur2, true);
      this._release();
    }
    // Nach dem Zeichnen wieder normale Übergänge (z. B. Drücken)
    _release() {
      const dock = this._dock;
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (dock === this._dock && !dock.classList.contains("run")) dock.classList.remove("hold");
      }));
    }
    // FLIP: aktuelle (sichtbare) Lage merken, Endlage einmal messen, dann per transform/opacity vom Alten zum Neuen gleiten.
    // Pro Frame wird nichts neu berechnet; bei schnellem Mehrfachwechsel startet die nächste Animation von der aktuellen Zwischenlage
    _flip(cur2, lbl, sig) {
      const dock = this._dock, btns = this._btns;
      const rect = (e) => e.getBoundingClientRect();
      const f = { bg: rect(this._bg), hl: rect(this._hl), hlOn: this._hl.classList.contains("on"), b: btns.map(rect) };
      const oldNm = btns.map((d) => d._nm).find((n) => n.classList.contains("on") && !n.hidden);
      const fn = oldNm && { r: rect(oldNm), t: oldNm.textContent, o: +getComputedStyle(oldNm).opacity };
      this._stop();
      this._apply(cur2, lbl, false);
      const o = this._origin(), l = { bg: rect(this._bg), b: btns.map(rect) }, newNm = btns[cur2]?._nm.classList.contains("on") ? btns[cur2]._nm : null;
      btns.forEach((d, k) => {
        if (!d.hidden && f.b[k].width) d.style.transform = `translate(${f.b[k].left - l.b[k].left}px,${f.b[k].top - l.b[k].top}px)`;
      });
      if (l.bg.width) this._bg.style.transform = `translate(${f.bg.left - l.bg.left}px,${f.bg.top - l.bg.top}px) scale(${f.bg.width / l.bg.width},${f.bg.height / l.bg.height})`;
      if (f.hlOn) this._hl.style.transform = `translate(${f.hl.left - o.x}px,${f.hl.top - o.y}px)`;
      else this._pillTo(cur2, false);
      if (newNm) {
        newNm.style.opacity = "0";
        newNm.style.transform = `translate(${f.b[cur2].left - l.b[cur2].left - 12}px,0)`;
      }
      if (fn) {
        const g = this._ghost = document.createElement("span");
        g.className = "ghost";
        g.textContent = fn.t;
        g.style.opacity = fn.o;
        g.style.transform = `translate(${fn.r.left - o.x}px,${fn.r.top - o.y}px)`;
        dock.appendChild(g);
        g._dx = fn.r.left - o.x;
        g._dy = fn.r.top - o.y;
      }
      requestAnimationFrame(() => requestAnimationFrame(() => {
        if (this._shown !== sig) return;
        const rec = LAST.get(this._key);
        if (rec && rec.i === cur2 && this.isConnected) rec.played = true;
        dock.classList.remove("hold");
        dock.classList.add("run");
        this._lit(cur2);
        this._reveal(cur2, true, l.b[cur2]);
        btns.forEach((d) => {
          d.style.transform = "";
        });
        this._bg.style.transform = "";
        if (l.b[cur2]) this._hl.style.transform = `translate(${l.b[cur2].left - o.x}px,${l.b[cur2].top - o.y}px)`;
        this._hl.classList.toggle("on", cur2 >= 0);
        if (newNm) {
          newNm.style.opacity = "";
          newNm.style.transform = "";
        }
        const g = this._ghost, ob = fn && btns.findIndex((d) => d._nm === oldNm);
        if (g) {
          g.style.opacity = "0";
          g.style.transform = `translate(${g._dx + (ob >= 0 ? l.b[ob].left - f.b[ob].left : 0) - 8}px,${g._dy}px)`;
        }
        this._ft = setTimeout(() => {
          if (this._shown === sig) {
            this._stop();
            this._release();
          }
        }, this._dur + 60);
      }));
    }
    // Punkt oder Zahl; Farbe als Farbrolle, bei erfüllter Bedingung eine zweite Farbrolle
    _badge(d, it) {
      const h = this._h, s = it.badge && h.states[it.badge];
      let n = 0, dot = false;
      if (it.badge_count_of) n = countOn(h, it.badge_count_of, it.badge_exclude);
      else if (s && it.badge_show_number && NUMRE.test(s.state)) n = Math.round(+s.state);
      else if (s) dot = isOn(s);
      const showNum = n > 0 && it.badge_show_number;
      d.classList.toggle("bd", dot || n > 0 && !showNum);
      d.classList.toggle("bn", showNum);
      if (showNum) d.querySelector(".num").textContent = n > 99 ? "99+" : n;
      const cond = { state: it.badge_alert_state, state_not: it.badge_alert_state_not, above: it.badge_alert_above, below: it.badge_alert_below };
      const alert = it.badge_alert_color && Object.values(cond).some((v) => v != null) && alertHit(cond, h.states[it.badge || it.badge_count_of]);
      const role = alert ? it.badge_alert_color : it.badge_color;
      if (role) {
        const v = roleVars(role);
        d.style.setProperty("--bc", v.c);
        d.style.setProperty("--bfg", v.fg);
      } else {
        d.style.removeProperty("--bc");
        d.style.removeProperty("--bfg");
      }
    }
    // Media-Leiste: spielt ein Player, wird er gezeigt, sonst ein pausierter (oder auf Wunsch immer der erste)
    _media() {
      const mb = this._mb, ids = list(this._cfg.media_players ?? this._srcCfg?.media_players);
      if (!mb) return;
      const ss = ids.map((id) => this._h.states[id]).filter(Boolean);
      const s = ss.find((x) => x.state === "playing") || ss.find((x) => MEDIA_ON.includes(x.state)) || (this._cfg.media_always ?? this._srcCfg?.media_always ? ss[0] : null);
      mb.hidden = !s;
      this.toggleAttribute("media", !!s && !this._side && !this._inline);
      this._mp = s?.entity_id || null;
      if (!s) return;
      const a = s.attributes, pic = a.entity_picture_local || a.entity_picture, art = mb.querySelector(".art");
      if (art._pic !== pic) {
        art._pic = pic;
        art.style.backgroundImage = pic ? `url(${JSON.stringify(pic)})` : "";
        art.classList.toggle("pic", !!pic);
      }
      mb.querySelector("b").textContent = a.media_title || a.friendly_name || s.entity_id;
      mb.querySelector(".tx span").textContent = a.media_artist || a.app_name || (MEDIA_ON.includes(s.state) ? a.friendly_name || "" : fmtState(this._h, s));
      mb.querySelector(".pp ha-icon").setAttribute("icon", s.state === "playing" ? "mdi:pause" : "mdi:play");
    }
    _run(i, kind) {
      const it = this._items[i];
      if (this._haptic) haptic();
      if (kind !== "tap") return hassAction(this, { entity: it.entity, [`${kind}_action`]: it[`${kind}_action`] }, kind);
      if (it.popup_hash) {
        this._close();
        return togglePopup(this, this._h, cleanHash(it.popup_hash), this._cfg.source);
      }
      if (this._cur === i) return this._close();
      this._close();
      if (Array.isArray(it.menu) && it.menu.length) return this._openMenu(i, it);
      if (Array.isArray(it.cards)) return this._openCards(i, it);
      if (typeof it.popup === "string" && customElements.get("nz-popup")) return this._openLegacy(i, it);
      this._act(it);
    }
    // Aktion eines Eintrags ohne eigenes Pop-up (auch für Einträge im Untermenü)
    _act(it) {
      if (it.popup_hash) return togglePopup(this, this._h, cleanHash(it.popup_hash), this._cfg.source);
      if (it.tap_action && it.tap_action.action !== "none") return hassAction(this, { entity: it.entity, tap_action: it.tap_action }, "tap");
      if (it.navigation_path) return navigate(it.navigation_path);
      if (it.entity) moreInfo(this, it.entity);
    }
    // Kleines Menü am Button mit weiteren Einträgen
    _openMenu(i, it) {
      const m = document.createElement("div");
      m.className = "menu glass";
      m.setAttribute("role", "menu");
      it.menu.forEach((sub) => {
        const e = document.createElement("div");
        e.className = "mi";
        e.tabIndex = 0;
        e.setAttribute("role", "menuitem");
        e._it = sub;
        e.innerHTML = `<span class="ic">${icon(sub.icon || "mdi:circle-outline")}</span><span class="lb"></span>`;
        e.querySelector(".lb").textContent = sub.label || pathOf(sub) || sub.popup_hash || sub.entity || "";
        this._bind(e, sub, (kind) => {
          if (this._haptic) haptic();
          this._close();
          if (kind === "tap") this._act(sub);
          else hassAction(this, { entity: sub.entity, [`${kind}_action`]: sub[`${kind}_action`] }, kind);
        });
        m.appendChild(e);
      });
      this.shadowRoot.appendChild(m);
      this._menu = m;
      this._place(m, this._btns[i]);
      this._opened(i, m);
      this._out = (e) => {
        const p = e.composedPath();
        if (!p.includes(m) && !p.includes(this._btns[i])) this._close();
      };
      window.addEventListener("pointerdown", this._out, true);
      m.querySelector(".mi:not([hidden])")?.focus({ preventScroll: true });
    }
    // Menü neben dem Button: über der Leiste unten, darunter oben, daneben als Seitenleiste
    _place(m, b) {
      const r = b.getBoundingClientRect(), W = innerWidth, H = innerHeight, g = 10, side = this._side;
      const w = m.offsetWidth, ht = m.offsetHeight, clamp2 = (v, max) => Math.max(8, Math.min(v, max - 8));
      if (side) {
        m.style.left = `${side === "right" ? r.left - g - w : r.right + g}px`;
        m.style.top = `${clamp2(r.top + r.height / 2 - ht / 2, H - ht)}px`;
      } else {
        m.style.left = `${clamp2(r.left + r.width / 2 - w / 2, W - w)}px`;
        m.style.top = `${this._cfg.position === "top" ? r.bottom + g : r.top - g - ht}px`;
      }
    }
    _openCards(i, it) {
      const p = document.createElement(tag("navi-popup"));
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
      this._menu = null;
      this._cur = -1;
      if (this._esc) window.removeEventListener("keydown", this._esc);
      if (this._out) {
        window.removeEventListener("pointerdown", this._out, true);
        this._out = null;
      }
      this._update();
    }
  };
  define("navi-card", NovaNaviCard, { name: "Nova Navi", description: "Navigationsleiste unten, oben oder als Seitenleiste: navigieren, Aktionen, Untermenüs, Pop-ups, Badges und eine kleine Media-Leiste.", documentationURL: docUrl("nova-navi") });
  define("dock-card", class NovaDockCard extends NovaNaviCard {
  });
  var GEN3 = [{ name: "source", selector: { text: {} } }];
  var LOOK3 = (c) => [
    g2(
      { name: "position", selector: { select: { mode: "dropdown", options: [{ value: "bottom", label: "Unten" }, { value: "top", label: "Oben" }] } } },
      { name: "button_size", selector: { number: { min: 32, max: 72, step: 2, mode: "box", unit_of_measurement: "px" } } }
    ),
    g2(
      sel("sidebar", [["", "Nie"], ["left", "Links"], ["right", "Rechts"]]),
      ...c.sidebar ? [{ name: "sidebar_min_width", selector: { number: { min: 480, max: 2560, step: 10, mode: "box", unit_of_measurement: "px" } } }] : []
    ),
    g2({ name: "active_label", selector: { boolean: {} } }, sel("compact", [["", "Automatisch (schmale Bildschirme)"], ["on", "Immer"], ["off", "Nie"]])),
    g2({ name: "animation", selector: { boolean: {} } }, ...c.animation !== false ? [{ name: "animation_duration", selector: { number: { min: 100, max: 1500, step: 10, mode: "box", unit_of_measurement: "ms" } } }] : []),
    { name: "haptic", selector: { boolean: {} } }
  ];
  var MEDIA = [{ name: "media_players", selector: { entity: { multiple: true, filter: { domain: "media_player" } } } }, { name: "media_always", selector: { boolean: {} } }];
  var I_MAIN = [g2({ name: "icon", required: true, selector: { icon: {} } }, { name: "label", selector: { text: {} } })];
  var I_TAP = (opts) => [
    { name: "popup_hash", selector: { select: { mode: "dropdown", custom_value: true, options: opts } } },
    { name: "tap_action", selector: { ui_action: {} } }
  ];
  var I_MORE = [{ name: "hold_action", selector: { ui_action: {} } }, { name: "double_tap_action", selector: { ui_action: {} } }];
  var I_POP = [{ name: "popup_title", selector: { text: {} } }, { name: "cards", selector: { object: {} } }];
  var COND = (p) => [
    g2({ name: `${p}_state`, selector: { text: {} } }, { name: `${p}_state_not`, selector: { text: {} } }),
    g2({ name: `${p}_above`, selector: { number: { mode: "box", step: "any" } } }, { name: `${p}_below`, selector: { number: { mode: "box", step: "any" } } })
  ];
  var I_VIS = (it, users) => [
    { name: "visible_users", selector: { select: { multiple: true, mode: "list", options: users } } },
    { name: "visible_entity", selector: { entity: {} } },
    ...it.visible_entity ? COND("visible") : []
  ];
  var I_BADGE = (it) => [
    g2({ name: "badge", selector: { entity: {} } }, { name: "badge_count_of", selector: { entity: {} } }),
    ...it.badge || it.badge_count_of ? [{ name: "badge_show_number", selector: { boolean: {} } }] : [],
    ...it.badge_count_of ? [{ name: "badge_exclude", selector: { entity: { multiple: true } } }] : [],
    g2(ROLE("badge_color"), ROLE("badge_alert_color")),
    ...it.badge_alert_color && (it.badge || it.badge_count_of) ? COND("badge_alert") : []
  ];
  var S_MAIN = (opts) => [...I_MAIN, ...I_TAP(opts)];
  var LABELS = {
    position: "Position (Handy, schmale Bildschirme)",
    button_size: "Button-Größe",
    source: "Einträge aus anderem Dashboard übernehmen",
    sidebar: "Seitenleiste auf breiten Bildschirmen",
    sidebar_min_width: "Seitenleiste ab Breite",
    haptic: "Haptisches Feedback",
    active_label: "Namen neben dem aktiven Icon zeigen",
    compact: "Kompakte Leiste",
    animation: "Wechsel animieren",
    animation_duration: "Dauer der Animation",
    media_players: "Media-Player",
    media_always: "Auch zeigen, wenn nichts läuft",
    icon: "Icon",
    label: "Name",
    tap_action: "Aktion beim Antippen",
    hold_action: "Aktion bei langem Drücken",
    double_tap_action: "Aktion bei Doppeltippen",
    popup_title: "Titel",
    popup_hash: "Nova Pop-up öffnen",
    cards: "Karten (YAML-Liste)",
    visible_users: "Nur für diese Benutzer",
    visible_entity: "Nur zeigen abhängig von Entität",
    visible_state: "Zustand ist",
    visible_state_not: "Zustand ist nicht",
    visible_above: "Wert über",
    visible_below: "Wert unter",
    badge: "Badge-Entität",
    badge_count_of: "Zähler: Gruppe",
    badge_show_number: "Zahl statt Punkt",
    badge_exclude: "Beim Zählen ignorieren",
    badge_color: "Badge-Farbe",
    badge_alert_color: "Farbe bei Bedingung",
    badge_alert_state: "Zustand ist",
    badge_alert_state_not: "Zustand ist nicht",
    badge_alert_above: "Wert über",
    badge_alert_below: "Wert unter"
  };
  var HELPERS = {
    source: "Optional: URL-Pfad eines Dashboards (z. B. neues-zuhause). Dann gilt dessen Navi – praktisch für mehrere Ansichten oder Dashboards mit gleicher Leiste.",
    sidebar: "Ab der eingestellten Breite steht die Leiste senkrecht am Rand, darunter unten bzw. oben.",
    animation: "Markierung und Name gleiten beim Viewwechsel vom alten zum neuen Eintrag. Bei „Bewegung reduzieren“ im System immer aus.",
    active_label: "Rechts neben dem runden Button der aktuellen Ansicht steht sein Name (nicht in der Seitenleiste).",
    compact: "Kleinere Buttons und Abstände. Automatisch: auf Bildschirmen bis 600 px Breite.",
    haptic: "Kurzes Vibrieren beim Antippen (HA-App, Android-Browser, Fully Kiosk).",
    media_players: "Zeigt über der Leiste den laufenden Player mit Play/Pause. Leer = keine Media-Leiste.",
    popup_hash: "Öffnet die Nova Pop-up Card mit diesem Hash (Liste = Pop-ups in diesem Dashboard). Hat Vorrang vor der Aktion, dem Untermenü und dem einfachen Pop-up.",
    cards: "Wenn gesetzt, öffnet der Button ein Pop-up mit diesen Karten (statt der Aktion). Beispiel: - type: tile, entity: light.flur",
    visible_users: "Leer = für alle sichtbar.",
    visible_entity: "Ohne Bedingung: sichtbar, wenn die Entität an ist.",
    badge: "Punkt, wenn die Entität an ist; mit „Zahl statt Punkt“ ihr Zahlenwert (z. B. Anzahl offener Fenster).",
    badge_count_of: "Zeigt Punkt/Zahl, wenn Mitglieder der Gruppe an sind (z. B. light.alle_lampen)",
    badge_color: "Leer = Akzentfarbe des Themes.",
    badge_alert_color: "Gilt, wenn die Bedingung darunter auf die Badge-Entität zutrifft."
  };
  var NovaNaviCardEditor = class extends NovaEditorBase {
    // Pop-ups des Dashboards und Benutzer für die Auswahllisten einmal laden
    set hass(h) {
      super.hass = h;
      if (h && !this._hashes) {
        this._hashes = [];
        popupOptions(h).then((o) => {
          this._hashes = o;
          this._rebuild();
        });
      }
      if (h && !this._users) {
        const me = h.user ? [{ value: h.user.id, label: h.user.name }] : [];
        this._users = me;
        h.callWS({ type: "config/auth/list" }).then((us) => {
          const l = us.filter((u) => !u.system_generated).map((u) => ({ value: u.id, label: u.name || u.username || u.id }));
          if (l.length) {
            this._users = l;
            this._rebuild();
          }
        }).catch(() => {
        });
      }
    }
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap");
      const data = { position: "bottom", button_size: 48, sidebar: "", active_label: true, animation: true, animation_duration: 280, ...this._config, compact: { true: "on", false: "off" }[this._config.compact] || "" };
      const form = (schema) => this._form(schema, data, (v) => {
        const c = merge(this._config, names(schema), v);
        if (c.position === "bottom") delete c.position;
        if (c.button_size === 48) delete c.button_size;
        if (!c.sidebar) {
          delete c.sidebar;
          delete c.sidebar_min_width;
        }
        if (!c.haptic) delete c.haptic;
        if (c.active_label !== false) delete c.active_label;
        if (c.compact === "on" || c.compact === "off") c.compact = c.compact === "on";
        else delete c.compact;
        if (c.animation !== false) delete c.animation;
        if (c.animation === false || c.animation_duration === 280) delete c.animation_duration;
        if (!c.media_always) delete c.media_always;
        const re = !!this._config.source !== !!c.source || !!this._config.sidebar !== !!c.sidebar || this._config.animation !== false !== (c.animation !== false);
        this._emit(c);
        if (re) this._rebuild();
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
        this._section("look", "mdi:palette-outline", "Layout und Aussehen", (b) => b.append(form(LOOK3(data)))),
        this._section("media", "mdi:music-circle-outline", "Media-Leiste", (b) => b.append(form(MEDIA)))
      );
    }
    get _opts() {
      return this._hashes?.length ? this._hashes : [{ value: "", label: "– keins –" }];
    }
    _popName(h) {
      h = cleanHash(h);
      return this._hashes?.find((o) => o.value === h)?.label || `#${h}`;
    }
    _label(it, i) {
      return `${i + 1}. ${it.label || it.popup_title || (it.popup_hash ? this._popName(it.popup_hash) : "") || (it.menu?.length ? "Untermenü" : "") || (Array.isArray(it.cards) ? "Einfaches Pop-up" : pathOf(it)) || "Neuer Button"}`;
    }
    // Formular für einen Teil eines Eintrags; ändert sich dadurch das Schema (Felder ein-/ausblenden), wird neu aufgebaut
    _part(get, set, schema, onChange) {
      const cur2 = get();
      return this._form(schema(cur2), cur2, (v) => {
        const old = get(), was = JSON.stringify(schema(old));
        const nx = merge(old, names(schema(old)), v);
        if (nx.popup_hash) nx.popup_hash = cleanHash(nx.popup_hash);
        if (!nx.popup_hash) delete nx.popup_hash;
        if (nx.cards && !Array.isArray(nx.cards)) nx.cards = [nx.cards];
        if (!nx.badge_show_number) delete nx.badge_show_number;
        set(nx);
        onChange?.(nx);
        if (JSON.stringify(schema(nx)) !== was) this._rebuild();
      });
    }
    _setItem(i, nx) {
      const list2 = [...this._config.items];
      list2[i] = nx;
      this._emit({ ...this._config, items: list2 });
    }
    _item(it, i, n) {
      const [d, s] = this._details(i, it.icon || "mdi:circle-outline", this._label(it, i), this._itemBtns(i, n, (dir) => this._move(i, dir), () => this._remove(i)), (b) => {
        const get = () => this._config.items[i], set = (nx) => this._setItem(i, nx);
        const part = (sch) => this._part(get, set, typeof sch === "function" ? sch : () => sch, (nx) => {
          s.querySelector(".lbl").textContent = this._label(nx, i);
          s.querySelector("ha-icon").setAttribute("icon", nx.icon || "mdi:circle-outline");
        });
        b.append(
          part(I_MAIN),
          this._h4("Beim Antippen"),
          part(I_TAP(this._opts)),
          this._h4("Lange drücken und Doppeltippen"),
          part(I_MORE),
          this._h4("Untermenü"),
          ...this._menuList(i),
          this._h4("Einfaches Pop-up"),
          part(I_POP),
          this._h4("Sichtbarkeit"),
          part((cur2) => I_VIS(cur2, this._users || [])),
          this._h4("Badge"),
          part(I_BADGE)
        );
      });
      return d;
    }
    // Einträge des Untermenüs: Antippen des Buttons öffnet dann das Menü statt der Aktion
    _menuList(i) {
      const subs = this._config.items[i].menu || [], out = [];
      const setSubs = (arr) => {
        const it = { ...this._config.items[i] };
        if (arr.length) it.menu = arr;
        else delete it.menu;
        this._setItem(i, it);
      };
      if (!subs.length) out.push(this._hint("Mit Einträgen öffnet der Button beim Antippen ein kleines Menü."));
      subs.forEach((sub, j) => {
        const key = `m${i}.${j}`, lbl = (x) => `${j + 1}. ${x.label || pathOf(x) || x.popup_hash || "Neuer Eintrag"}`;
        const [d] = this._details(key, sub.icon || "mdi:circle-outline", lbl(sub), this._itemBtns(j, subs.length, (dir) => {
          const arr = [...this._config.items[i].menu], t = j + dir;
          [arr[j], arr[t]] = [arr[t], arr[j]];
          this._open = /* @__PURE__ */ new Set([i, `m${i}.${t}`]);
          setSubs(arr);
          this._rebuild();
        }, () => {
          this._open = /* @__PURE__ */ new Set([i]);
          setSubs(this._config.items[i].menu.filter((_, x) => x !== j));
          this._rebuild();
        }), (b, s) => {
          const get = () => this._config.items[i].menu[j];
          const set = (nx) => {
            const arr = [...this._config.items[i].menu];
            arr[j] = nx;
            setSubs(arr);
          };
          const part = (sch) => this._part(get, set, sch, (nx) => {
            s.querySelector(".lbl").textContent = lbl(nx);
            s.querySelector("ha-icon").setAttribute("icon", nx.icon || "mdi:circle-outline");
          });
          b.append(part(() => S_MAIN(this._opts)), part(() => I_MORE), part((cur2) => I_VIS(cur2, this._users || [])));
        });
        out.push(d);
      });
      out.push(this._add("Menü-Eintrag hinzufügen", () => {
        const arr = [...this._config.items[i].menu || [], { icon: "mdi:circle-outline" }];
        this._open = /* @__PURE__ */ new Set([i, `m${i}.${arr.length - 1}`]);
        setSubs(arr);
        this._rebuild();
      }));
      return out;
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
  __publicField(NovaNaviCardEditor, "labels", LABELS);
  __publicField(NovaNaviCardEditor, "helpers", HELPERS);
  __publicField(NovaNaviCardEditor, "openSections", ["buttons"]);
  define("navi-card-editor", NovaNaviCardEditor);

  // src/modular.js
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
      const c = this._c, rooms = idx.map((i) => c.rooms[i]), ok3 = hasF(this._st(), VF.AREA);
      const byArea = (o) => ok3 && o.area;
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
      const tank = (el2, x, ok3, bad) => {
        let p = 0.55, low = false;
        if (x && NUMRE.test(x.state)) p = Math.max(0, Math.min(100, +x.state)) / 100;
        else if (x && !["unavailable", "unknown"].includes(x.state)) {
          low = dom(x.entity_id) === "binary_sensor" ? x.state === "on" : /low|empty|leer|full|voll|lack|short|knapp|problem/i.test(x.state);
          p = low ? bad : ok3;
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
      const ok3 = [], failed = [];
      res.forEach((x, i) => {
        if (x.status === "fulfilled" && Array.isArray(x.value)) ok3.push(...x.value.map((ev) => parseEvent(ev, cals[i], tz)).filter(Boolean));
        else {
          failed.push(cals[i]);
          console.warn("[nova-cards] Müllkalender: Termine nicht geladen", cals[i], x.reason);
        }
      });
      this._failed = failed;
      if (failed.length === cals.length) this._err = res[0].reason?.body?.message || res[0].reason?.message || "Verbindung fehlgeschlagen";
      else {
        this._err = null;
        this._events = ok3;
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
    _wi(icon2, role) {
      return `<ha-icon class="wi" icon="${esc(icon2)}" style="--c:${roleVars(role).c}"></ha-icon>`;
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
        let ok3 = false;
        try {
          ok3 = take(JSON.parse(ta.value));
        } catch {
        }
        ta.classList.toggle("bad", !ok3);
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
      let y0 = 0, x0 = 0, dy = 0, t0 = 0, ok3 = false, drag = false;
      const mobile = () => matchMedia("(max-width:600px)").matches;
      sh.addEventListener("touchstart", (e) => {
        ok3 = this._isOpen && mobile() && e.touches.length === 1 && (!e.composedPath().includes(this._body) || this._body.scrollTop <= 0);
        if (!ok3) return;
        y0 = e.touches[0].clientY;
        x0 = e.touches[0].clientX;
        dy = 0;
        t0 = Date.now();
        drag = false;
      }, { passive: true });
      sh.addEventListener("touchmove", (e) => {
        if (!ok3) return;
        const d = e.touches[0].clientY - y0, dx = e.touches[0].clientX - x0;
        if (!drag) {
          if (Math.abs(d) < 8 && Math.abs(dx) < 8) return;
          if (d <= 0 || Math.abs(dx) > d) {
            ok3 = false;
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
          ok3 = false;
          return;
        }
        drag = false;
        ok3 = false;
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
  define("popup-card", NovaPopupCard, { name: "Nova Pop-up Card", description: "Pop-up mit beliebigen Karten, geöffnet per URL-Hash (z. B. #wohnzimmer) – von Nova Navi oder jeder Karte mit Navigations-Aktion.", documentationURL: docUrl("nova-pop-up-card") });
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
    title: "Steht mit dem Icon oben im Pop-up und in den Auswahllisten von Nova Navi und Raum-Karte.",
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
    _sec(key, icon2, label) {
      const [d, , b] = this._details(key, icon2, label, []);
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
  var S_GEN3 = (icon2) => [
    { name: "area", selector: { area: {} } },
    g2({ name: "name", selector: T }, { name: "icon", selector: { icon: icon2 ? { placeholder: icon2 } : {} } }),
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

  // src/shared/scene.js
  var PAL = {
    bodyLight: "#3a4252",
    body: "#191d26",
    // Gehäuse oben/unten (Theme: --nova-device-color-light / --nova-device-color)
    part: "#3b4252",
    partDark: "#20252f",
    // Anbauteile: Schublade, Kopf, Display-Rahmen
    inner: "#2c3344",
    innerDark: "#10141b",
    // Innenraum
    screen: "#0a0e14",
    // Display, Dichtung
    chrome: "#a3adbf",
    chromeMid: "#566074",
    chromeDark: "#232833",
    glass: "#a9c6ff",
    glassMid: "#5d7397",
    glassDark: "#0c111c",
    line: "rgba(255,255,255,.18)"
    // Kanten
  };
  var sceneDefs = (p) => `<linearGradient id="${p}-bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="s-sb1"/><stop offset="1" class="s-sb2"/></linearGradient>
<linearGradient id="${p}-sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
<linearGradient id="${p}-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${PAL.glass}" stop-opacity=".11"/><stop offset=".55" stop-color="${PAL.glassMid}" stop-opacity=".05"/><stop offset="1" stop-color="${PAL.glassDark}" stop-opacity=".38"/></linearGradient>
<linearGradient id="${p}-in" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PAL.inner}"/><stop offset="1" stop-color="${PAL.innerDark}"/></linearGradient>
<linearGradient id="${p}-pt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PAL.part}"/><stop offset="1" stop-color="${PAL.partDark}"/></linearGradient>
<linearGradient id="${p}-cr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${PAL.chrome}"/><stop offset=".5" stop-color="${PAL.chromeMid}"/><stop offset="1" stop-color="${PAL.chromeDark}"/></linearGradient>
<linearGradient id="${p}-gs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;
  var SCENE_CSS = `
.scene{--sb1:var(--nova-device-color-light,${PAL.bodyLight});--sb2:var(--nova-device-color,${PAL.body})}
.scene .s-sb1{stop-color:var(--sb1)}.scene .s-sb2{stop-color:var(--sb2)}
.scene .s-shd{fill:#000;opacity:.35}
.scene .s-body{stroke:${PAL.line};stroke-width:.6;transition:stroke .4s}.scene .s-sheen{opacity:.4}.scene .s-edge{fill:#fff;opacity:.12}
.scene .s-part{stroke:rgba(255,255,255,.15);stroke-width:.5}
.scene .s-glass{stroke:rgba(255,255,255,.22);stroke-width:.7}.scene .s-refl{fill:#fff;opacity:.035}
.scene .s-gls{opacity:0;transform-box:view-box}
.sweep .scene .s-gls{animation:nv-glare .9s .1s ease-in-out both}
.scene .s-scr{fill:${PAL.screen};stroke:rgba(255,255,255,.18);stroke-width:.5}.scene .s-tgl{fill:#fff;opacity:.05}
.still .scene .s-gls{animation-play-state:paused!important}
@keyframes nv-glare{0%{opacity:0;transform:translateX(0)}15%{opacity:.7}85%{opacity:.7}100%{opacity:0;transform:translateX(var(--gx,70px))}}
@media (prefers-reduced-motion:reduce){.sweep .scene .s-gls{animation:none}}`;
  var frameGlow = (sel2) => `${sel2}{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--dc) 45%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}`;
  function sweep(el2) {
    if (!el2) return;
    el2.classList.remove("sweep");
    void el2.getBoundingClientRect();
    el2.classList.add("sweep");
  }
  var badgeAt = (right, bottom, u = 1) => ({ x: right - 20 * u, y: bottom - 38 * u, r: 11.5 * u });

  // src/appliance.js
  var TYPES2 = {
    washer: { label: "Waschmaschine", icon: "mdi:washing-machine", color: "accent-1", run: "Wäscht", alt: "Schleudert", door: "Tür offen", phase: ["spin", "spinning", "schleudern"], anims: ["detergent", "softener"], dview: true },
    dishwasher: { label: "Spülmaschine", icon: "mdi:dishwasher", color: "accent-1", run: "Spült", alt: "Trocknet", door: "Tür offen", phase: ["drying", "dry", "trocknen", "ending"], dview: true },
    airfryer: { label: "Airfryer", icon: "mdi:toaster-oven", color: "accent-1", run: "Gart", heat: "Heizt vor", door: "Schublade offen", phase: [], dview: true },
    coffee: { label: "Kaffeemaschine", icon: "mdi:coffee-maker-outline", color: "accent-3", run: "Läuft", alt: "Brüht", door: "Tür offen", phase: ["brew", "brewing", "brühen"], anims: ["tank", "beans", "descale"] },
    generic: { label: "Gerät", icon: "mdi:power-plug-outline", color: "accent-1", run: "Läuft", door: "Tür offen", phase: [] }
  };
  var typeOf = (c) => TYPES2[c.device_type] ? c.device_type : "generic";
  var HANIM = {
    tank: ["Wassertank", "Wassertank leer", "mdi:cup-water"],
    beans: ["Bohnen", "Bohnen nachfüllen", "mdi:coffee-outline"],
    descale: ["Entkalken", "Entkalken", "mdi:water-alert-outline"],
    detergent: ["Waschmittel", "Waschmittel leer", "mdi:bottle-tonic-outline"],
    softener: ["Weichspüler", "Weichspüler leer", "mdi:bottle-tonic-plus-outline"],
    warning: ["Allgemeine Warnung", "", "mdi:alert-outline"]
  };
  var animsOf = (t) => [...TYPES2[t].anims || [], "warning"];
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
  var GDEF = { layout: "full", animation: true, glow: true, hide_when_off: false, start_at: "none", window: true, door_anim: true };
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
  var fmtDisp = (sec) => sec < 60 ? `${Math.ceil(sec)}"` : sec < 3600 ? `${Math.ceil(sec / 60)}'` : ((m) => `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")}`)(Math.ceil(sec / 60));
  var fmtDur = (sec) => {
    const m = Math.max(0, Math.round(sec / 60));
    return m < 1 ? "< 1 min" : m < 60 ? `${m} min` : `${Math.floor(m / 60)}:${String(m % 60).padStart(2, "0")} h`;
  };
  var SA = '<div class="ct sa"><div class="kv"><ha-icon icon="mdi:clock-start"></ha-icon><span class="k">Starten um</span><input type="time" aria-label="Startzeit"><div class="pill now">Sofort</div></div><div class="sah"></div></div>';
  var IC = { start: "mdi:play", pause: "mdi:pause", resume: "mdi:play-pause", stop: "mdi:stop" };
  var WARN = '<g class="wn"><path class="wt3" d="M14 3 l10 17 h-20 Z"/><line class="wx" x1="14" y1="9" x2="14" y2="14"/><circle class="wx2" cx="14" cy="17" r="1.1"/></g>';
  var DONE = '<g class="done"><circle class="dr" cx="80" cy="82" r="10"/><circle class="dc" cx="80" cy="82" r="10"/><path class="dk" d="M75.5 82 l3 3 l6 -6.5"/></g>';
  var doneAt = (right, bottom) => {
    const b = badgeAt(right, bottom), s = b.r / 10;
    return `<g transform="translate(${+(b.x - 80 * s).toFixed(2)} ${+(b.y - 82 * s).toFixed(2)}) scale(${s})">${DONE}</g>`;
  };
  var AX = (y) => 47.5 - (y - 27) / 127 * 9;
  var ABODY = "M55 20 H145 Q152 20 152.5 27 L161.5 154 Q163 172 143 172 H57 Q37 172 38.5 154 L47.5 27 Q48 20 55 20 Z";
  var ADRW = `M${AX(93).toFixed(2)} 93 H${(200 - AX(93)).toFixed(2)} L${(200 - AX(158)).toFixed(2)} 158 Q${(200 - AX(158)).toFixed(2)} 162 157 162 H43 Q${AX(158).toFixed(2)} 162 ${AX(158).toFixed(2)} 158 Z`;
  var ACOIL = `M66 104.5 ${Array.from({ length: 11 }, () => "q1.6 -2.6 3.2 0 t3.2 0").join(" ")}`;
  var WDOOR = `<circle class="rng" cx="100" cy="114" r="44" stroke="url(#w-cr)"/><circle class="rgo" cx="100" cy="114" r="46"/><circle class="blk" cx="100" cy="114" r="39"/>
<circle class="s-glass" cx="100" cy="114" r="36" fill="url(#w-gl)"/>
<g clip-path="url(#w-ci)"><path class="s-refl" d="M80 78 h22 l-40 62 v-32 z"/><path class="s-refl" d="M112 78 h6 l-56 86 v-12 z"/>
<g transform="rotate(22 100 114)"><rect class="s-gls" x="38" y="56" width="16" height="116" fill="url(#w-gs)"/></g></g>
<path class="sh" d="M71 102 a30 30 0 0 1 17 -18"/><rect class="hdl" x="140.6" y="106" width="3.6" height="16" rx="1.8"/>`;
  var QTILT = "M31 64 H169 L166 176.4 H34 Z M44 84 H156 L154 166 H46 Z";
  var QDOOR = "M34 40 H166 V176.4 H34 Z M50 64 H150 a4 4 0 0 1 4 4 V160 a4 4 0 0 1 -4 4 H50 a4 4 0 0 1 -4 -4 V68 a4 4 0 0 1 4 -4 Z";
  var qWine = (x) => `<path class="qgl" d="M${x - 5} 104 Q${x - 5.4} 94 ${x - 0.8} 91.5 V85.4 h1.6 V91.5 Q${x + 5.4} 94 ${x + 5} 104 Z"/><rect class="qgl" x="${x - 4.4}" y="84.4" width="8.8" height="1.2" rx=".6"/><path class="qgh" d="M${x - 3.6} 101.6 Q${x - 3.9} 96 ${x - 1.8} 93.6"/>`;
  var qTumb = (x) => `<path class="qgl" d="M${x - 4} 104 L${x - 3.2} 91 h6.4 L${x + 4} 104 Z"/><path class="qgh" d="M${x - 2.6} 102 L${x - 2} 93"/>`;
  var qCup = (x, c) => `<path class="qcup${c ? " c2" : ""}" d="M${x - 5} 104 v-9.5 a2 2 0 0 1 2 -2 h6 a2 2 0 0 1 2 2 v9.5 Z"/><path class="qcuh" d="M${x + 5} 95.6 h1.4 a2.5 2.5 0 0 1 0 5 h-1.4"/><path class="qgh" d="M${x - 3.4} 102 v-7"/>`;
  var qWire = (y1, y2) => `<path class="qwire" d="${Array.from({ length: 19 }, (_, i) => `M${46 + i * 6} ${y1} V${y2}`).join(" ")}"/><rect class="qrl" x="45" y="${y2 - 0.6}" width="110" height="1.4" rx=".7"/><rect class="qrl t" x="45" y="${y1 - 0.4}" width="110" height=".9" rx=".45"/><circle class="qrol" cx="47" cy="${y2 + 1.6}" r="1.6"/><circle class="qrol" cx="153" cy="${y2 + 1.6}" r="1.6"/>`;
  var qArm = (y, w) => `<g class="qarm" style="transform-origin:100px ${y + 1.1}px"><rect x="${100 - w}" y="${y}" width="${w * 2}" height="2.2" rx="1.1" fill="url(#d-cr)"/>${[-0.8, -0.45, 0.45, 0.8].map((f) => `<circle class="qnz" cx="${100 + f * w}" cy="${y + 1.1}" r=".55"/>`).join("")}</g><circle class="qhub" cx="100" cy="${y + 1.1}" r="2.8" fill="url(#d-cr)"/>`;
  var qJets = (y, xs) => `<g class="qjet">${xs.map((x, i) => `<circle cx="${x}" cy="${y}" r="${i % 2 ? 1 : 1.3}" style="--dx:${x < 100 ? -4 : 4}px;animation-delay:${(i * 0.27).toFixed(2)}s"/>`).join("")}</g>`;
  var QIN = `<g class="qtop"><path class="qcut" d="M58 37.4 h18 M82 36.6 h16 M118 37.4 h20"/><ellipse class="qcuts" cx="76.6" cy="37.4" rx="2.2" ry="1.2"/><path class="qcutk" d="M98 36.6 h6 q-1 1.4 -6 1.2 Z"/>${qWire(33, 40.5)}</g>
<g class="qup">${[58, 70].map(qWine).join("")}${qTumb(82)}${qCup(96)}${qCup(110, 1)}${qTumb(124)}${[136, 146].map(qWine).join("")}${qWire(88, 104.5)}</g>
${qJets(108, [74, 84, 92, 108, 116, 126])}${qArm(109, 30)}
<g class="qlo">${[56, 61.5, 67, 72.5, 78, 83.5].map((x, i) => `<ellipse class="qpl${i === 2 ? " c2" : ""}" cx="${x}" cy="140" rx="2.4" ry="${i % 3 === 1 ? 16 : 15}" transform="rotate(-9 ${x} 140)"/><path class="qph" d="M${x - 0.9} 128 v9" transform="rotate(-9 ${x} 140)"/>`).join("")}
${[94, 100.5].map((x) => `<ellipse class="qpl" cx="${x}" cy="138" rx="2.8" ry="18" transform="rotate(-6 ${x} 138)"/><path class="qph" d="M${x - 1} 124 v10" transform="rotate(-6 ${x} 138)"/>`).join("")}
<path class="qcut" d="M127 125 v13 M130.5 124 v14 M134 126 v12 M140 125 v13 M143.5 123.6 v14.4 M147 125 v13"/>
<ellipse class="qcuts" cx="127" cy="124" rx="1.4" ry="2.2"/><ellipse class="qcuts" cx="140" cy="124" rx="1.4" ry="2.2"/><path class="qcutf" d="M129.6 121 v3 M130.5 120.6 v3.4 M131.4 121 v3 M142.6 120.4 v3.2 M143.5 120 v3.6 M144.4 120.4 v3.2"/>
<path class="qcutk" d="M134 126 v-6.4 q1.4 1.6 1.2 6.4 Z M147 125 v-6.4 q1.4 1.6 1.2 6.4 Z"/>
<rect class="s-part" x="122" y="134" width="30" height="21" rx="1.6" fill="url(#d-pt)"/><rect x="123" y="135" width="28" height="19" rx="1.2" fill="url(#d-pf)"/>
${qWire(138, 156.5)}</g>
${qJets(161, [70, 80, 90, 110, 120, 130])}${qArm(162, 34)}<ellipse class="qsmp" cx="100" cy="171" rx="9" ry="2"/>
<g class="qstm">${[66, 90, 112, 136].map((x, i) => `<path d="M${x} 150 q3 -6 0 -12 q-3 -6 0 -12 q3 -6 0 -12" style="animation-delay:${(i * 0.8).toFixed(1)}s"/>`).join("")}</g>`;
  var QFOG = Array.from({ length: 46 }, (_, i) => {
    const x = 49 + i * 37 % 103, y = 67 + i * 53 % 94;
    return `<circle cx="${x}" cy="${y}" r="${(0.35 + i % 4 * 0.18).toFixed(2)}"/>`;
  }).join("");
  var SV = {
    washer: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${sceneDefs("w")}
<radialGradient id="w-dr" cx=".42" cy=".35" r=".75"><stop offset="0" stop-color="#5a6479"/><stop offset=".6" stop-color="#2c3342"/><stop offset="1" stop-color="#141821"/></radialGradient>
<linearGradient id="w-pd" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8d98ac"/><stop offset="1" stop-color="#3a4252"/></linearGradient>
<radialGradient id="w-vg"><stop offset=".62" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
<radialGradient id="w-lt" cx=".5" cy="0" r=".9"><stop offset="0" class="w-lc" stop-opacity=".5"/><stop offset="1" class="w-lc" stop-opacity="0"/></radialGradient>
<linearGradient id="w-wa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="w-lc" stop-opacity=".6"/><stop offset="1" class="w-lc" stop-opacity=".25"/></linearGradient>
<pattern id="w-pf" width="4.5" height="4.5" patternUnits="userSpaceOnUse"><circle cx="2.25" cy="2.25" r=".7" fill="#000" fill-opacity=".35"/></pattern>
<radialGradient id="w-gb" cx=".35" cy=".3" r=".8"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".45" stop-color="#fff" stop-opacity=".03"/><stop offset="1" stop-color="#000" stop-opacity=".2"/></radialGradient>
<clipPath id="w-ci"><circle cx="100" cy="114" r="36"/></clipPath></defs>
<ellipse class="s-shd" cx="100" cy="193" rx="74" ry="4.5"/><rect class="ft" x="40" y="186" width="14" height="5" rx="1.5"/><rect class="ft" x="146" y="186" width="14" height="5" rx="1.5"/>
<rect class="s-body" x="30" y="12" width="140" height="177" rx="9" fill="url(#w-bd)"/><rect class="s-sheen" x="30" y="12" width="140" height="177" rx="9" fill="url(#w-sh)"/>
<rect class="s-edge" x="35" y="13" width="130" height="1.2" rx=".6"/>
<rect class="psep" x="30" y="47.5" width="140" height=".8"/><rect class="psh" x="30" y="48.3" width="140" height=".6"/><rect class="psep" x="30" y="181" width="140" height=".8"/>
<rect class="dw s-part" x="37" y="19" width="40" height="22" rx="3" fill="url(#w-pt)"/><rect class="dwh" x="39" y="19.8" width="36" height=".9" rx=".45"/>
<rect class="lbl" x="42" y="23.5" width="8" height="1.3" rx=".65"/><rect class="lbl" x="53" y="23.5" width="8" height="1.3" rx=".65"/><rect class="lbl" x="64" y="23.5" width="6" height="1.3" rx=".65"/><rect class="dwg" x="43" y="34.5" width="28" height="2.6" rx="1.3"/>
<g class="pdots">${[-135, -108, -81, -54, -27, 0, 27, 54, 81, 108, 135].map((a) => `<circle${a === -54 ? ' class="on"' : ""} cx="${(99 + 13 * Math.sin(a * Math.PI / 180)).toFixed(2)}" cy="${(30 - 13 * Math.cos(a * Math.PI / 180)).toFixed(2)}" r=".95"/>`).join("")}</g>
<circle class="kr" cx="99" cy="30" r="9" fill="url(#w-cr)"/><circle class="s-part" cx="99" cy="30" r="7.2" fill="url(#w-pt)"/><rect class="ki" x="98.4" y="23.6" width="1.2" height="4.2" rx=".6" transform="rotate(-54 99 30)"/>
<rect class="s-part" x="121" y="19" width="41" height="22" rx="3" fill="url(#w-pt)"/><rect class="s-scr" x="123.5" y="21.5" width="36" height="13" rx="1.8"/>
<text class="wdt" x="144" y="31.4"></text><g class="lk"><rect x="126.6" y="26.6" width="4.6" height="3.8" rx=".8"/><path d="M127.7 26.6 v-1.1 a1.2 1.2 0 0 1 2.4 0 v1.1"/></g>
<path class="s-tgl" d="M125 22 h9 l-4 12 h-6 z"/><g class="tb"><rect x="124" y="37" width="6" height="1.8" rx=".9"/><rect x="133" y="37" width="6" height="1.8" rx=".9"/><rect x="142" y="37" width="6" height="1.8" rx=".9"/><rect x="151" y="37" width="8" height="1.8" rx=".9"/></g>
<circle class="led" cx="166" cy="30" r="1.3"/>
<rect class="s-part" x="49" y="96" width="7" height="9" rx="1.5" fill="url(#w-pt)"/><rect class="s-part" x="49" y="123" width="7" height="9" rx="1.5" fill="url(#w-pt)"/>
<circle class="fl" cx="148" cy="168" r="9.5"/><path class="flh" d="M139.6 163.5 a9.5 9.5 0 0 1 8.4 -5"/><rect class="dwg" x="145" y="160.5" width="6" height="1.4" rx=".7"/>
<circle class="gsk" cx="100" cy="114" r="41"/><circle class="gsm" cx="100" cy="114" r="38.6"/><circle class="gsf" cx="100" cy="114" r="37.4"/><circle class="gsh" cx="100" cy="114" r="40.2"/>
<g clip-path="url(#w-ci)"><circle cx="100" cy="114" r="36" fill="url(#w-dr)"/>
<g class="drum"><circle cx="100" cy="114" r="34" fill="url(#w-pf)"/><circle class="drm" cx="100" cy="114" r="22"/>
${[0, 120, 240].map((a) => `<g class="pdl" transform="rotate(${a} 100 114)"><path d="M93 78.6 Q100 77.6 107 78.6 L103.2 93 Q100 94.6 96.8 93 Z" fill="url(#w-pd)"/><path class="pdh" d="M94.6 79.4 L97.6 92 h-.9 L93.6 79.6 Z"/></g>`).join("")}
<path class="cl" d="M76 128 q8 -10 18 -3 q8 5 16 -2 q5 10 -8 14 q-14 4 -26 -9 Z"/><path class="cl c2" d="M90 100 q8 -5 15 1 q-3 7 -10 6 q-6 -1 -5 -7 Z"/>
<circle class="hub" cx="100" cy="114" r="6" fill="url(#w-cr)"/><circle class="hbc" cx="100" cy="114" r="2.4"/><circle class="spn" cx="100" cy="114" r="27"/></g>
<rect class="dlt" x="64" y="78" width="72" height="50" fill="url(#w-lt)"/>
<g class="wl"><g class="wv2"><path d="M25 121 q6.25 -2.5 12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 V160 H25 Z" fill="url(#w-wa)" opacity=".5"/></g>
<g class="wv"><path d="M50 124 q6.25 -3.5 12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 t12.5 0 V160 H50 Z" fill="url(#w-wa)"/></g></g>
<circle cx="100" cy="114" r="36" fill="url(#w-vg)"/></g>
<rect class="hng s-part" x="45" y="101" width="13" height="26" rx="3" fill="url(#w-pt)"/><g class="pd"><circle class="pdt" cx="105" cy="114" r="44"/>${WDOOR}<circle class="pgb" cx="100" cy="114" r="36" fill="url(#w-gb)"/></g>

${doneAt(170, 189)}<g transform="translate(4 2) scale(1.3)">${WARN}</g></svg>`,
    // Spülmaschine (Vorbild Siemens Unterbau): Bedienleiste mit Display, Edelstahlfront mit Rauchglas-Fenster, Körbe mit
    // Gläsern, Tassen, Tellern und Besteck, zwei Sprüharme; Tür offen = Klappe nach unten, Körbe frei
    dishwasher: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${sceneDefs("d")}
<linearGradient id="d-pn" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#1c212b"/><stop offset="1" stop-color="#0a0d12"/></linearGradient>
<linearGradient id="d-bb" x1="0" y1="0" x2="1" y2="0"><stop offset=".18" stop-color="#fff" stop-opacity="0"/><stop offset=".34" stop-color="#fff" stop-opacity=".05"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset=".72" stop-color="#fff" stop-opacity=".03"/><stop offset=".86" stop-color="#fff" stop-opacity="0"/></linearGradient>
<radialGradient id="d-vg" cx=".5" cy=".45" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
<radialGradient id="d-lt" cx=".5" cy="0" r="1"><stop offset="0" class="q-lc" stop-opacity=".36"/><stop offset="1" class="q-lc" stop-opacity="0"/></radialGradient>
<pattern id="d-pf" width="3.4" height="3.4" patternUnits="userSpaceOnUse"><circle cx="1.7" cy="1.7" r=".75" fill="#000" fill-opacity=".45"/></pattern>
<clipPath id="d-tc"><rect x="40" y="18" width="120" height="158"/></clipPath><clipPath id="d-tw"><path d="M44 84 H156 L154 166 H46 Z"/></clipPath><filter id="d-bl" x="-60%" y="-120%" width="220%" height="340%"><feGaussianBlur stdDeviation="2.4"/></filter><clipPath id="d-wc"><rect x="46" y="64" width="108" height="100" rx="4"/></clipPath></defs>
<ellipse class="s-shd" cx="100" cy="192" rx="72" ry="4.5"/>
<rect class="s-body" x="34" y="14" width="132" height="175" rx="9" fill="url(#d-bd)"/><rect class="s-sheen" x="34" y="14" width="132" height="175" rx="9" fill="url(#d-sh)"/>
<rect class="qplin" x="38" y="177" width="124" height="11" rx="1.5"/>${[0, 1, 2, 3, 4, 5, 6, 7, 8].map((i) => `<rect class="qvent" x="${70 + i * 7}" y="181" width="4" height="3" rx="1"/>`).join("")}
<g clip-path="url(#d-tc)"><rect x="40" y="18" width="120" height="158" fill="url(#d-in)"/>
<path class="qrail" d="M44.5 20 V172 M155.5 20 V172"/><rect class="s-part" x="95" y="19" width="10" height="3.6" rx="1.2" fill="url(#d-pt)"/>
${QIN}<rect class="qdlt" x="40" y="18" width="120" height="158" fill="url(#d-lt)"/><rect x="40" y="18" width="120" height="158" fill="url(#d-vg)"/></g>
<g class="qgap"><rect x="40" y="40" width="120" height="24" fill="url(#d-lt)" opacity=".55"/><path class="qwire" d="${Array.from({ length: 19 }, (_, i) => `M${46 + i * 6} 50 V56.6`).join(" ")}"/><rect class="qrl" x="45" y="56" width="110" height="1.4" rx=".7"/>
<rect class="qgl" x="54" y="51.6" width="8.8" height="1.2" rx=".6"/><rect class="qgl" x="66" y="51.6" width="8.8" height="1.2" rx=".6"/><path class="qcup" d="M92 60 v-6 a2 2 0 0 1 2 -2 h6 a2 2 0 0 1 2 2 v6 Z"/><path class="qcup c2" d="M106 60 v-6 a2 2 0 0 1 2 -2 h6 a2 2 0 0 1 2 2 v6 Z"/><rect class="qgl" x="132" y="51.6" width="8.8" height="1.2" rx=".6"/></g>
<g class="qfront"><path class="s-body" fill-rule="evenodd" fill="url(#d-bd)" d="${QDOOR}"/><path class="s-sheen" fill-rule="evenodd" fill="url(#d-sh)" d="${QDOOR}"/><path fill-rule="evenodd" fill="url(#d-bb)" d="${QDOOR}"/>
<rect class="s-part" x="66" y="46" width="4" height="5" rx="1" fill="url(#d-pt)"/><rect class="s-part" x="130" y="46" width="4" height="5" rx="1" fill="url(#d-pt)"/>
<rect class="qhdl" x="62" y="48" width="76" height="3.4" rx="1.7" fill="url(#d-cr)"/><rect class="qhdh" x="64" y="48.4" width="72" height=".8" rx=".4"/>
<rect class="qwin" x="44.6" y="62.6" width="110.8" height="102.8" rx="5"/>
<rect class="qtint" x="46" y="64" width="108" height="100" rx="4"/>
<g clip-path="url(#d-wc)"><rect class="qmist" x="46" y="64" width="108" height="100"/><g class="qfog">${QFOG}</g>
<path class="s-refl" d="M60 64 h26 l-40 70 v-38 z"/><path class="s-refl" d="M98 64 h7 l-59 100 v-12 z"/>
<g transform="rotate(18 100 114)"><rect class="s-gls" x="20" y="40" width="18" height="150" fill="url(#d-gs)"/></g></g>
<rect class="s-glass" x="46" y="64" width="108" height="100" rx="4" fill="url(#d-gl)"/></g>
<g class="qtilt"><path class="qtop" d="M32.6 61.2 H167.4 L169 64 H31 Z"/><path class="s-body" fill-rule="evenodd" fill="url(#d-bd)" d="${QTILT}"/><path class="s-sheen" fill-rule="evenodd" fill="url(#d-sh)" d="${QTILT}"/><path fill-rule="evenodd" fill="url(#d-bb)" d="${QTILT}"/>
<rect class="s-part" x="65.6" y="67" width="4" height="4.2" rx="1" fill="url(#d-pt)"/><rect class="s-part" x="130.4" y="67" width="4" height="4.2" rx="1" fill="url(#d-pt)"/>
<rect class="qhdl" x="61.4" y="68.6" width="77.2" height="3" rx="1.5" fill="url(#d-cr)"/><rect class="qhdh" x="63.4" y="69" width="73.2" height=".7" rx=".35"/>
<path class="qwin" d="M42.6 82.6 H157.4 L155.4 167.4 H44.6 Z"/><path class="qtint" d="M44 84 H156 L154 166 H46 Z"/>
<g clip-path="url(#d-tw)"><path class="s-refl" d="M58 84 h26 l-38 62 v-34 z"/><path class="s-refl" d="M96 84 h7 l-57 82 v-11 z"/></g>
<path class="s-glass" d="M44 84 H156 L154 166 H46 Z" fill="url(#d-gl)"/></g>
<g class="qsteam" filter="url(#d-bl)"><ellipse cx="44" cy="60" rx="7" ry="3.6" style="--sx:-18px;--sy:-16px"/><ellipse cx="100" cy="61" rx="9" ry="3.4" style="--sx:4px;--sy:-9px;animation-delay:.9s"/><ellipse cx="156" cy="60" rx="7" ry="3.6" style="--sx:18px;--sy:-16px;animation-delay:1.8s"/></g>
<g class="qpanel"><path class="qpan" d="M43 14 H157 a9 9 0 0 1 9 9 V40 H34 V23 a9 9 0 0 1 9 -9 Z" fill="url(#d-pn)"/><rect class="s-edge" x="40" y="15" width="120" height="1.2" rx=".6"/>
<rect class="qsep" x="34" y="40" width="132" height=".8"/><rect class="qsh" x="34" y="40.8" width="132" height=".6"/>
<circle class="qpw" cx="44" cy="25" r="2.2"/><path class="qpwl" d="M44 21.8 v2.4"/>
${[52, 59, 66, 73].map((x, i) => `<rect class="qlbl" x="${x}" y="24.2" width="${i % 2 ? 4 : 5}" height="1.2" rx=".6"/><rect class="qsel${i === 0 ? " on" : ""}" x="${x - 0.5}" y="31" width="6" height="1.1" rx=".55"/>`).join("")}
${[124, 131, 138, 145].map((x, i) => `<rect class="qlbl" x="${x}" y="24.2" width="${i % 2 ? 5 : 4}" height="1.2" rx=".6"/><rect class="qsel" x="${x - 0.5}" y="31" width="6" height="1.1" rx=".55"/>`).join("")}
<circle class="led" cx="157" cy="25" r="1.4"/>
<rect class="s-part" x="80" y="16.5" width="40" height="28" rx="2.5" fill="url(#d-pt)"/><rect class="s-scr" x="83.5" y="19.5" width="33" height="13" rx="1.6"/>
<text class="wdt" x="102.6" y="29.2"></text><g class="lk"><rect x="86.2" y="25.2" width="4.2" height="3.4" rx=".7"/><path d="M87.2 25.2 v-1 a1.1 1.1 0 0 1 2.2 0 v1"/></g>
<path class="s-tgl" d="M85 20 h8 l-4 12 h-5 z"/><g class="qtb"><rect x="85" y="36.5" width="6" height="1.6" rx=".8"/><rect x="94" y="36.5" width="6" height="1.6" rx=".8"/><rect x="103" y="36.5" width="6" height="1.6" rx=".8"/><rect x="112" y="36.5" width="4" height="1.6" rx=".8"/></g></g>
${doneAt(170, 189)}<g transform="translate(4 2) scale(1.3)">${WARN}</g></svg>`,
    // Airfryer im Nova-Zeichenstil (Vorbild Philips Essential): nach unten breiter werdendes Gehäuse, oben Touchfeld mit rundem
    // Display (Restzeit-Ring wie eine Eieruhr, Haken bei fertig), Fuge, Schublade mit Rauchglas-Fenster (Heizspirale, Korb,
    // Pommes) und senkrechtem Griff
    airfryer: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${sceneDefs("a")}
<radialGradient id="a-vg" cx=".5" cy=".4" r=".8"><stop offset=".5" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".6"/></radialGradient>
<radialGradient id="a-lt" cx=".5" cy="0" r="1"><stop offset="0" class="a-lc" stop-opacity=".7"/><stop offset="1" class="a-lc" stop-opacity="0"/></radialGradient>
<filter id="a-bl" x="-60%" y="-120%" width="220%" height="340%"><feGaussianBlur stdDeviation="2.4"/></filter>
<filter id="a-hb" x="-100%" y="-40%" width="300%" height="180%"><feGaussianBlur stdDeviation="1.3"/></filter>
<filter id="a-cb" x="-20%" y="-300%" width="140%" height="700%"><feGaussianBlur stdDeviation="1.6"/></filter>
<clipPath id="a-wc"><rect x="64" y="99" width="72" height="32" rx="6"/></clipPath><clipPath id="a-pc"><rect x="68" y="32" width="64" height="44" rx="5"/></clipPath><clipPath id="a-bc"><path d="${ABODY}"/></clipPath>
<linearGradient id="a-gb" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".09"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient></defs>
<g class="ahz" filter="url(#a-hb)"><path d="M84 19 c-3 -4 3 -7 0 -11 c-2 -3 1 -5 0 -8"/><path d="M100 19 c3 -4 -3 -7 0 -11 c2 -3 -1 -5 0 -8"/><path d="M116 19 c-3 -4 3 -7 0 -11 c-2 -3 1 -5 0 -8"/></g>
<g class="afb"><ellipse class="s-shd" cx="100" cy="177" rx="66" ry="4.5"/><rect class="aft" x="52" y="171" width="14" height="5" rx="1.5"/><rect class="aft" x="134" y="171" width="14" height="5" rx="1.5"/>
<path class="s-body" d="${ABODY}" fill="url(#a-bd)"/><path class="s-sheen" d="${ABODY}" fill="url(#a-sh)"/>
<g clip-path="url(#a-bc)"><rect class="agb" x="52" y="20" width="14" height="152" fill="url(#a-gb)" transform="skewX(-4)"/><path class="s-refl" d="M118 20 h12 l-34 72 h-12 z"/><path class="s-refl" d="M136 20 h5 l-34 72 h-5 z"/></g>
<rect class="s-edge" x="58" y="21" width="84" height="1.2" rx=".6"/><rect class="abase" x="40" y="162" width="120" height=".8"/><rect class="ahl" x="41" y="162.8" width="118" height=".6"/>
<rect class="apn" x="68" y="32" width="64" height="44" rx="5"/><rect x="68" y="32" width="64" height="44" rx="5" fill="url(#a-gl)"/>
<g class="atc"><path d="M76.6 42.2 a3.2 3.2 0 1 0 2.8 0 M78 40.6 v3"/><path d="M75 64 h6"/><path d="M119 64 h6 M122 61 v6"/><path d="M122 40.4 v4.6 M120.7 45.6 a1.8 1.8 0 1 0 2.6 0"/></g>
<circle class="adr" cx="100" cy="54" r="15"/><circle class="kr" cx="100" cy="54" r="11.5"/><circle class="kp" cx="100" cy="54" r="11.5" pathLength="100" transform="rotate(-90 100 54)"/>
<text class="kt" x="100" y="57.4"></text><path class="akc" d="M94.6 54.4 l3.6 3.6 l7 -7.4"/>
<g clip-path="url(#a-pc)"><path class="s-tgl" d="M70 32 h30 l-14 44 h-16 z"/><path class="s-refl" d="M106 32 h6 l-14 44 h-6 z"/><rect class="apnh" x="70" y="32.6" width="60" height=".7" rx=".35"/></g>
<rect class="psep" x="${AX(92) + 0.5}" y="91.6" width="${200 - 2 * AX(92) - 1}" height=".8"/>
<path class="aop" d="${ADRW}"/><path class="aol" d="${ADRW}" fill="url(#a-lt)"/>
<rect class="asg" x="${AX(92) + 4}" y="91" width="${200 - 2 * AX(92) - 8}" height="2" rx="1"/></g>
<g class="drw"><ellipse class="adsh" cx="100" cy="167" rx="58" ry="3.4"/>
<path class="s-body" d="${ADRW}" fill="url(#a-bd)"/><path class="s-sheen" d="${ADRW}" fill="url(#a-sh)"/>
<rect class="ade" x="${AX(93) + 3}" y="93.6" width="${200 - 2 * AX(93) - 6}" height=".8" rx=".4"/>
<g class="awin"><rect class="awf" x="61.6" y="96.6" width="76.8" height="36.8" rx="8"/>
<g clip-path="url(#a-wc)"><rect x="64" y="99" width="72" height="32" fill="url(#a-in)"/><rect class="aglo" x="64" y="99" width="72" height="32" fill="url(#a-lt)"/>
<path class="acl" d="${ACOIL}"/><path class="acg" filter="url(#a-cb)" d="${ACOIL}"/>
<rect class="abr" x="65" y="114" width="70" height="1.6" rx=".8"/><path class="amsh" d="${Array.from({ length: 17 }, (_, i) => `M${68 + i * 4} 116 V131`).join(" ")}"/>
<g class="fr"><line x1="70" y1="129" x2="79" y2="122"/><line x1="81" y1="130" x2="92" y2="124"/><line x1="96" y1="128.5" x2="103" y2="120.5"/><line x1="107" y1="130" x2="119" y2="125"/><line x1="121" y1="129" x2="129" y2="122.5"/><line x1="86" y1="123" x2="95" y2="118.5"/></g>
<rect x="64" y="99" width="72" height="32" fill="url(#a-vg)"/>
<path class="s-refl" d="M74 99 h16 l-22 32 h-5 v-12 z"/><path class="s-refl" d="M98 99 h5 l-22 32 h-5 z"/>
<g transform="rotate(18 100 115)"><rect class="s-gls" x="44" y="80" width="16" height="70" fill="url(#a-gs)"/></g></g>
<rect class="s-glass" x="64" y="99" width="72" height="32" rx="6" fill="url(#a-gl)"/></g>
<rect class="ahr" x="92.5" y="140" width="17" height="22" rx="6"/><rect class="s-part" x="91" y="138" width="18" height="22" rx="6" fill="url(#a-pt)"/><rect class="ahh" x="92.6" y="140" width="1.2" height="18" rx=".6"/></g>
<g class="apuff" filter="url(#a-bl)"><ellipse cx="72" cy="94" rx="8" ry="3.6" style="--sx:-10px;--sy:-22px"/><ellipse cx="100" cy="92" rx="10" ry="3.8" style="--sx:2px;--sy:-26px;animation-delay:.25s"/><ellipse cx="128" cy="94" rx="8" ry="3.6" style="--sx:10px;--sy:-22px;animation-delay:.5s"/></g>
${doneAt(162, 172)}<g transform="translate(4 2) scale(1.3)">${WARN}</g></svg>`,
    // Kaffeevollautomat (Vorbild Siemens EQ): Bohnenfach oben, Bedienfeld, mittiger Auslauf mit Tasse, Wassertank seitlich
    coffee: `<svg viewBox="0 0 100 100" aria-hidden="true"><defs><clipPath id="nvc"><path d="M41 66 h18 v10 a6 6 0 0 1 -6 6 h-6 a6 6 0 0 1 -6 -6 Z"/></clipPath><clipPath id="nvt"><rect x="80" y="26" width="7" height="50" rx="2.5"/></clipPath></defs>
<path class="bn" d="M28 12.5 q11 -9 22 0 Z"/>
<rect class="bd" x="16" y="12" width="64" height="82" rx="9"/>
<rect class="tk" x="80" y="26" width="7" height="50" rx="2.5"/><g clip-path="url(#nvt)"><rect class="tw" x="80" y="38" width="7" height="40"/></g>
<rect class="pnl" x="23" y="18" width="50" height="11" rx="3"/><circle class="led" cx="29" cy="23.5" r="1.8"/><rect class="kx" x="34" y="21.5" width="18" height="4" rx="2"/>
<path class="dp" d="M65 19.5 c2 3 3 4.5 3 6 a3 3 0 0 1 -6 0 c0 -1.5 1 -3 3 -6 Z"/>
<rect class="sp" x="38" y="34" width="24" height="7" rx="2.5"/><rect class="sp" x="43.5" y="41" width="4" height="3" rx="1"/><rect class="sp" x="52.5" y="41" width="4" height="3" rx="1"/>
<line class="flow" x1="45.5" y1="44" x2="45.5" y2="80"/><line class="flow" x1="54.5" y1="44" x2="54.5" y2="80"/>
<g clip-path="url(#nvc)"><rect class="cf" x="39" y="66" width="22" height="18"/></g>
<path class="cup" d="M41 66 h18 v10 a6 6 0 0 1 -6 6 h-6 a6 6 0 0 1 -6 -6 Z"/><path class="cup" d="M59 69 h2.5 a3.5 3.5 0 0 1 0 7 h-2.5"/>
<rect class="tray" x="28" y="85" width="44" height="4" rx="2"/>
<g class="steam"><path d="M45 63 q3 -4 0 -8 q-3 -4 0 -8"/><path d="M50 63 q3 -4 0 -8 q-3 -4 0 -8"/><path d="M55 63 q3 -4 0 -8 q-3 -4 0 -8"/></g>${DONE}${WARN}</svg>`,
    generic: `<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="pulse" cx="50" cy="50" r="30"/><circle class="bd" cx="50" cy="50" r="26"/>
<path class="pw" d="M41 40 a14 14 0 1 0 18 0"/><line class="pw" x1="50" y1="33" x2="50" y2="48"/>${DONE}${WARN}</svg>`
  };
  var scene = (t) => `<div class="scene">${SV[t]}</div>`;
  var DCSS2 = `
.g.dv{--dc:var(--nv-a1);--dc-fg:var(--nv-a1-fg)}
${frameGlow(".g.dv.glow.st-run,.g.dv.glow.st-heat")}
.dv .on>.ic,.dv .hd .ic.on{background:var(--dc);color:var(--dc-fg);box-shadow:0 0 14px color-mix(in srgb,var(--dc) 55%,transparent)}
.dv .hd small.er{color:var(--nv-error);opacity:1}
.dv .hb.pw.on{background:var(--dc);color:var(--dc-fg)}
.mid{display:flex;gap:14px;align-items:center;min-width:0}
.scene{flex:none;width:144px;height:144px;color:var(--nv-fg)}
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
.dv .al[data-e]{cursor:pointer}.dv .al.hit{background:color-mix(in srgb,var(--c) 32%,transparent);font-weight:600}
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
.scene .wt{fill:var(--dc);fill-opacity:.45}
.scene .wl{transition:transform .8s}
.scene .dm{fill:none;stroke:currentColor;stroke-opacity:.3;stroke-width:1.2;stroke-dasharray:3 3}
.scene .lf{fill:currentColor;fill-opacity:.35}.scene .cl{fill:currentColor;fill-opacity:.32}.scene .cl.c2{fill-opacity:.22}
.scene .mist{fill:var(--dc);opacity:0}
.scene .pl{fill:currentColor;fill-opacity:.22}
.scene .drops circle{fill:var(--dc);opacity:0}
.scene .arm{fill:currentColor;fill-opacity:.4;transform-box:view-box;transform-origin:50px 82px}
.scene .drum{transform-box:view-box;transform-origin:50px 58px}
.scene .heat path,.scene .steam path{fill:none;stroke:var(--dc);stroke-width:1.6;stroke-linecap:round;opacity:0}
.scene .steam path{stroke:currentColor;stroke-opacity:.6}
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
.anim.st-run .w-washer .wv2{animation:dv-wave 3.4s linear infinite reverse}
.anim.st-run.alt .w-washer .drum{animation:dv-spin .55s linear infinite}
.st-run.alt .w-washer .wl{transform:translateY(22px)}
.st-run.alt .w-washer .spn{stroke-opacity:.1}.st-run.alt .w-washer .pdl{opacity:.55}
.st-run .w-washer .dlt,.st-pause .w-washer .dlt{opacity:1}
.anim.st-pause .w-washer .wdt{animation:dv-blinko 1.4s ease-in-out infinite}
.scene .fr line{stroke:color-mix(in srgb,var(--dc) var(--pp,0%),currentColor);stroke-opacity:calc(.35 + var(--pf,0) * .5);stroke-width:3.2;stroke-linecap:round}
.scene .puff path{fill:none;stroke:currentColor;stroke-opacity:.6;stroke-width:1.6;stroke-linecap:round;opacity:0}
/* Airfryer */
.scene .kr{fill:none;stroke:currentColor;stroke-opacity:.18;stroke-width:2.2}
.scene .kp{fill:none;stroke:var(--dc);stroke-width:2.2;stroke-linecap:round;stroke-dasharray:100;stroke-dashoffset:100;opacity:0;transition:stroke-dashoffset 1s}
.kring .w-airfryer .kp{opacity:1}
.scene .kt{fill:var(--dc);font:700 6px system-ui,sans-serif;text-anchor:middle}
.scene .kbn{fill:currentColor;fill-opacity:.3}
.scene .ash{fill:rgba(0,0,0,.3)}.scene .dsh{opacity:0;transition:opacity .6s}.dopen .w-airfryer .dsh{opacity:1}
.scene .gap{fill:rgba(0,0,0,.42)}.scene .ahs{fill:rgba(0,0,0,.35)}
.scene .dhl{fill:none;stroke:currentColor;stroke-opacity:.35;stroke-width:1.2;stroke-linecap:round}
.scene .ahd{fill:currentColor;fill-opacity:.5;stroke:currentColor;stroke-opacity:.7;stroke-width:1}
.scene .kd,.scene .pnl{fill:rgba(0,0,0,.3);stroke:currentColor;stroke-opacity:.18;stroke-width:1}
.scene .kb{fill:currentColor;fill-opacity:.14;stroke:currentColor;stroke-opacity:.32;stroke-width:1}
.scene .opn{fill:rgba(0,0,0,.55);stroke:currentColor;stroke-opacity:.2;stroke-width:1}
.w-airfryer .dw{fill:currentColor;fill-opacity:.2;stroke:currentColor;stroke-opacity:.45;stroke-width:1.2}
.scene .afb{transform-box:view-box;transform-origin:0 0;transition:transform .6s ease}
.scene .kx{fill:currentColor;fill-opacity:.15}
.st-ready .scene .kx{fill:var(--dc);fill-opacity:.45}
.st-run .scene .kx,.st-prep .scene .kx,.st-heat .scene .kx,.st-warm .scene .kx,.st-pause .scene .kx,.st-wait .scene .kx{fill:var(--dc);fill-opacity:.85}
.scene .wg{fill:rgba(0,0,0,.28);stroke:currentColor;stroke-opacity:.2;stroke-width:1}
.scene .glo{fill:var(--dc);opacity:0;transition:opacity .6s}
.scene .drw{transform-box:view-box;transform-origin:0 0;transition:transform .6s ease}
/* Airfryer im Nova-Zeichenstil (Maßstab 3D-Drucker, Grundteile aus shared/scene.js) */
.w-airfryer{--gx:90px}
.w-airfryer .aft{fill:#0d1016}
.w-airfryer .ahl,.w-airfryer .ade{fill:#fff;opacity:.12}.w-airfryer .abase{fill:#000;opacity:.35}
.w-airfryer .apn{fill:#05070a;stroke:rgba(255,255,255,.14);stroke-width:.5}.w-airfryer .albl{fill:#fff;opacity:.16}
.w-airfryer .adr{fill:${PAL.screen};stroke:rgba(255,255,255,.18);stroke-width:.6}
.w-airfryer .kr{stroke:#fff;stroke-opacity:.1;stroke-width:1.8}.w-airfryer .kp{stroke-width:1.8}
.w-airfryer .kt{fill:#fff;font:600 8px Roboto,system-ui,sans-serif}
.w-airfryer .akc{fill:none;stroke:var(--dc);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:16;opacity:0}
.w-airfryer .atc path{fill:none;stroke:#fff;stroke-opacity:.12;stroke-width:1;stroke-linecap:round;transition:stroke .6s,stroke-opacity .6s}
.w-airfryer .apnh{fill:#fff;opacity:.14}.w-airfryer .agb{opacity:1}
.st-run .w-airfryer .atc path,.st-heat .w-airfryer .atc path,.st-warm .w-airfryer .atc path,.st-pause .w-airfryer .atc path,.st-prep .w-airfryer .atc path{stroke:var(--dc);stroke-opacity:.75;filter:drop-shadow(0 0 1.5px var(--dc))}
.st-ready .w-airfryer .atc path,.st-done .w-airfryer .atc path{stroke-opacity:.3}
.st-off .w-airfryer .atc path{stroke-opacity:.06}
.w-airfryer .psep{fill:#000;opacity:.3}.w-airfryer .psh{fill:#fff;opacity:.06}
.w-airfryer .aop{fill:#07090d}.w-airfryer .aol{opacity:0;transition:opacity .6s}.w-airfryer .a-lc{stop-color:var(--hc)}
.w-airfryer .asg{fill:var(--hc);opacity:0;filter:blur(1px);transition:opacity .6s}
.w-airfryer .drw,.w-airfryer .afb{transform-box:view-box;transform-origin:0 0;transition:transform .8s cubic-bezier(.3,.7,.3,1)}
.w-airfryer .adsh{fill:#000;opacity:0;transition:opacity .6s}
.w-airfryer .awf{fill:#0b0e13;stroke:rgba(255,255,255,.08);stroke-width:.5}
.w-airfryer .aglo{opacity:0;transition:opacity .6s}
.w-airfryer .acl{fill:none;stroke:#3a404c;stroke-width:1.4;stroke-linecap:round}
.w-airfryer .acg{fill:none;stroke:var(--hc);stroke-width:2.4;stroke-linecap:round;opacity:0;transition:opacity .8s}
.w-airfryer .abr{fill:#fff;opacity:.14}.w-airfryer .amsh{fill:none;stroke:#000;stroke-opacity:.3;stroke-width:.5}
.w-airfryer .fr line{stroke:color-mix(in srgb,var(--hc) var(--pp,0%),currentColor);stroke-width:3.4;stroke-opacity:calc(.55 + var(--pf,0) * .4)}
.w-airfryer .ahr{fill:#000;opacity:.35}.w-airfryer .ahh{fill:#fff;opacity:.16}
.w-airfryer .ahz path{fill:none;stroke:#d7dfec;stroke-width:2.2;stroke-linecap:round;opacity:0;transform-box:fill-box;transform-origin:center bottom}
.w-airfryer .apuff ellipse{fill:#c9d4e3;opacity:0;transform-box:fill-box;transform-origin:center}
/* Gart/heizt/hält warm: Heizspirale glüht in der Kartenfarbe, Fenster leicht beleuchtet, Hitzefahnen aus dem Luftauslass */
.st-run .w-airfryer .acg{opacity:.9}.st-run .w-airfryer .acl{stroke:color-mix(in srgb,var(--hc) 70%,#3a404c)}
.st-heat .w-airfryer .acg{opacity:.6}.st-warm .w-airfryer .acg{opacity:.3}.st-pause .w-airfryer .acg{opacity:.15}
.st-run .w-airfryer .aglo{opacity:.4}.st-heat .w-airfryer .aglo{opacity:.22}.st-warm .w-airfryer .aglo{opacity:.16}.st-pause .w-airfryer .aglo{opacity:.12}
.st-run .w-airfryer .asg{opacity:.65}.nowin.st-heat .w-airfryer .asg,.nowin.st-warm .w-airfryer .asg{opacity:.3}
.anim.st-run .w-airfryer .acg{animation:dv-coil 3.2s ease-in-out infinite}
.anim.st-run .w-airfryer .aglo{animation:dv-wglo 3.2s ease-in-out infinite}
.anim.st-heat .w-airfryer .acg{animation:dv-coil 2.6s ease-in-out infinite}
.anim.st-run .w-airfryer .ahz path{animation:dv-hz 3.6s ease-out infinite}
.anim.st-run .w-airfryer .ahz path:nth-child(2){animation-delay:1.2s}.anim.st-run .w-airfryer .ahz path:nth-child(3){animation-delay:2.4s}
.anim.st-run.last .w-airfryer .acg,.anim.st-run.last .w-airfryer .kp{animation:dv-glo .8s ease-in-out infinite}
.nowin .w-airfryer .awin{display:none}
.st-heat .w-airfryer .kr{stroke:var(--dc);stroke-opacity:.8}
.anim.st-heat .w-airfryer .kr{animation:dv-stk 2.6s ease-in-out infinite}
.anim.st-prep .scene .kx,.anim.st-prep .w-airfryer .kt,.anim.st-pause .w-airfryer .kp,.anim.st-pause .w-airfryer .kt{animation:dv-blinko 1.4s ease-in-out infinite}
/* Fertig: Schublade gleitet ein Stück nach vorne und bleibt dort, Haken im Display, beim Wechsel ein Dampfstoß aus dem Korb */
.st-done .w-airfryer .drw{transform:translate(-6px,-1px) scale(1.06)}
.st-done .w-airfryer .adsh{opacity:.35}.st-done .w-airfryer .aol{opacity:.25}
.st-off .w-airfryer .kt,.st-off .w-airfryer .kp{display:none}
.st-done .w-airfryer .kt{display:none}.st-done .w-airfryer .akc{opacity:1}
.anim.st-done.fx .w-airfryer .akc{animation:dv-check .5s .3s ease-out both}
.anim.st-done.fx .w-airfryer .apuff ellipse{animation:dv-apuff 2.4s .5s ease-out 1 both}
/* Schublade offen (Sensor): herausgenommen und verkleinert neben dem Gerät, im Gehäuse bleibt die leere Öffnung */
.dopen .w-airfryer .afb{transform:translate(-8px,32px) scale(.8)}
.dopen .w-airfryer .drw{transform:translate(92px,74px) scale(.62)}
.dopen .w-airfryer .adsh{opacity:.4}.dopen .w-airfryer .apuff,.dopen .w-airfryer .ahz{display:none}
@media (prefers-reduced-motion:reduce){.w-airfryer .drw,.w-airfryer .afb{transition:none}}
/* Waschmaschine im Nova-Zeichenstil (Maßstab 3D-Drucker, Grundteile aus shared/scene.js) */
.w-washer{--gx:100px}
.w-washer .ft,.w-washer .dwg{fill:#0d1016}
.w-washer .psep{fill:#000;opacity:.3}.w-washer .psh{fill:#fff;opacity:.06}
.w-washer .dwh{fill:#fff;opacity:.14}.w-washer .lbl{fill:#fff;opacity:.18}
.w-washer .pdots circle{fill:#fff;opacity:.25}.w-washer .pdots .on{fill:var(--dc);opacity:1}
.w-washer .kr{stroke:rgba(0,0,0,.4);stroke-width:.5}.w-washer .ki{fill:#fff;opacity:.85}
.w-washer .wdt{font:600 9px Roboto,system-ui,sans-serif;fill:#fff;text-anchor:middle}
.w-washer .tb rect{fill:#fff;opacity:.14}
.w-washer .gsk{fill:#07090d;stroke:rgba(255,255,255,.08);stroke-width:.6}
.w-washer .drum{transform-origin:100px 114px}
.w-washer .drm{fill:none;stroke:#000;stroke-opacity:.25;stroke-width:1}
.w-washer .pdl path{stroke:rgba(0,0,0,.35);stroke-width:.4}.w-washer .pdl .pdh{fill:#fff;opacity:.2;stroke:none}
.w-washer .cl{fill:#8f99ad;fill-opacity:.55}.w-washer .cl.c2{fill:color-mix(in srgb,var(--dc) 55%,#c9d1de);fill-opacity:.5}
.w-washer .hub{stroke:rgba(0,0,0,.4);stroke-width:.4}.w-washer .hbc{fill:#141821}
.w-washer .spn{fill:none;stroke:#cfd8e8;stroke-opacity:0;stroke-width:12;transition:stroke-opacity .4s}
.w-washer .w-lc{stop-color:var(--dc)}.w-washer .dlt{opacity:0;transition:opacity .6s}
.w-washer .rng{fill:none;stroke-width:4}.w-washer .rgo{fill:none;stroke:rgba(255,255,255,.25);stroke-width:.6}
.w-washer .blk{fill:none;stroke:#0b0e13;stroke-width:6}
.w-washer .sh{fill:none;stroke:#fff;stroke-opacity:.16;stroke-width:1.6;stroke-linecap:round}
.w-washer .hdl{fill:#0b0e13;opacity:.7}
.w-washer .fl{fill:none;stroke:#000;stroke-opacity:.35;stroke-width:.8}.w-washer .flh{fill:none;stroke:#fff;stroke-opacity:.08;stroke-width:.8}
.w-washer .pd{transform-box:view-box;transform-origin:54px 114px;transition:transform .6s ease}
.w-washer .scene .lk{stroke:#fff;stroke-opacity:.85;stroke-width:.7}.w-washer .scene .lk rect{fill:#fff}
.st-off .w-washer .wdt,.st-off .w-washer .pdots .on{display:none}
/* Spülmaschine im Nova-Zeichenstil (Maßstab 3D-Drucker, Grundteile aus shared/scene.js) */
.w-dishwasher{--gx:150px}
.w-dishwasher .qplin{fill:#0d1016}.w-dishwasher .qvent{fill:#000;opacity:.45}
.w-dishwasher .qrail{fill:none;stroke:#fff;stroke-opacity:.07;stroke-width:1.2}
.w-dishwasher .qgl{fill:${PAL.glass};fill-opacity:.1;stroke:#fff;stroke-opacity:.38;stroke-width:.5}
.w-dishwasher .qgh{fill:none;stroke:#fff;stroke-opacity:.42;stroke-width:.6;stroke-linecap:round}
.w-dishwasher .qcup{fill:#8f99ad;fill-opacity:.55;stroke:rgba(0,0,0,.35);stroke-width:.4}
.w-dishwasher .qcup.c2,.w-dishwasher .qpl.c2{fill:color-mix(in srgb,var(--dc) 55%,#c9d1de);fill-opacity:.5}
.w-dishwasher .qcuh{fill:none;stroke:#8f99ad;stroke-opacity:.55;stroke-width:1}
.w-dishwasher .qpl{fill:#c9d1de;fill-opacity:.42;stroke:#fff;stroke-opacity:.22;stroke-width:.4}
.w-dishwasher .qph{fill:none;stroke:#fff;stroke-opacity:.3;stroke-width:.5;stroke-linecap:round}
.w-dishwasher .qcut{fill:none;stroke:${PAL.chrome};stroke-width:1;stroke-linecap:round}
.w-dishwasher .qcuts{fill:${PAL.chrome}}.w-dishwasher .qcutf{fill:none;stroke:${PAL.chrome};stroke-width:.45;stroke-linecap:round}.w-dishwasher .qcutk{fill:${PAL.chromeMid}}
.w-dishwasher .qwire{fill:none;stroke:#fff;stroke-opacity:.2;stroke-width:.45}
.w-dishwasher .qrl{fill:${PAL.chromeMid}}.w-dishwasher .qrl.t{opacity:.7}.w-dishwasher .qrol{fill:#0b0e13;stroke:#fff;stroke-opacity:.18;stroke-width:.4}
.w-dishwasher .qarm{transform-box:view-box}.w-dishwasher .qnz{fill:#0b0e13}.w-dishwasher .qhub{stroke:rgba(0,0,0,.4);stroke-width:.4}
.w-dishwasher .qsmp{fill:#0b0e13;stroke:#fff;stroke-opacity:.12;stroke-width:.4}
.w-dishwasher .qjet circle{fill:var(--dc);opacity:0}
.w-dishwasher .qstm path{fill:none;stroke:#fff;stroke-opacity:.5;stroke-width:1.4;stroke-linecap:round;opacity:0}
.w-dishwasher .q-lc{stop-color:var(--dc)}.w-dishwasher .qdlt{opacity:0;transition:opacity .6s}
.w-dishwasher .qmist{fill:var(--dc);opacity:0;transition:opacity .6s}
.w-dishwasher .qfog circle{fill:#fff;opacity:0;transition:opacity 1.2s}
.w-dishwasher .qtint{fill:#05070b;opacity:.42;transition:opacity .6s}
.w-dishwasher .qwin{fill:none;stroke:#07090d;stroke-width:2.4}
.w-dishwasher .qpan{stroke:rgba(255,255,255,.1);stroke-width:.5}
.w-dishwasher .qsep{fill:#000;opacity:.3}.w-dishwasher .qsh{fill:#fff;opacity:.06}
.w-dishwasher .qlbl{fill:#fff;opacity:.2}.w-dishwasher .qsel{fill:#fff;opacity:.12}.w-dishwasher .qsel.on{fill:var(--dc);opacity:.9}
.w-dishwasher .qpw{fill:none;stroke:#fff;stroke-opacity:.25;stroke-width:.6}.w-dishwasher .qpwl{stroke:#fff;stroke-opacity:.25;stroke-width:.6;stroke-linecap:round}
.w-dishwasher .qtb rect{fill:#fff;opacity:.14}
.w-dishwasher .qhdl{stroke:rgba(0,0,0,.4);stroke-width:.4}.w-dishwasher .qhdh{fill:#fff;opacity:.35}
.w-dishwasher .wdt{font:600 8.4px Roboto,system-ui,sans-serif;fill:#fff;text-anchor:middle}
.w-dishwasher .scene .lk{stroke:#fff;stroke-opacity:.85;stroke-width:.65}.w-dishwasher .scene .lk rect{fill:#fff}
.dlock .w-dishwasher .lk,.st-run .w-dishwasher .lk,.st-pause .w-dishwasher .lk{display:inline}
.st-off .w-dishwasher .wdt,.st-off .w-dishwasher .qsel.on{display:none}
.st-off .w-dishwasher .qtint{opacity:.62}
.w-dishwasher .qfront{transition:opacity .4s}.w-dishwasher .qtilt,.w-dishwasher .qgap,.w-dishwasher .qsteam{opacity:0;transition:opacity .4s}
.w-dishwasher .qtop{fill:#5d6779;opacity:.85}.w-dishwasher .qtilt path{stroke-linejoin:round}
.w-dishwasher .qsteam ellipse{fill:#c9d4e3;opacity:0;transform-box:fill-box;transform-origin:center}
/* Läuft: Innenlicht, Sprüharme drehen, Wasserstrahlen und Nebel hinter der Scheibe, Beschlag */
.st-run .w-dishwasher .qdlt,.st-pause .w-dishwasher .qdlt{opacity:1}
.st-run .w-dishwasher .qtint,.st-pause .w-dishwasher .qtint{opacity:.28}
.st-run .w-dishwasher .qfog circle{opacity:.22}.st-run.alt .w-dishwasher .qfog circle{opacity:.3}
.anim.st-run:not(.alt) .w-dishwasher .qarm{animation:dv-sarm 1.4s linear infinite}
.anim.st-run:not(.alt) .w-dishwasher .qjet circle{animation:dv-jet 1.1s ease-out infinite}
.anim.st-run:not(.alt) .w-dishwasher .qmist{animation:dv-mist 3.2s ease-in-out infinite}
.anim.st-pause .w-dishwasher .wdt{animation:dv-blinko 1.4s ease-in-out infinite}
/* Trocknet: Arme stehen, Dampf steigt langsam auf */
.st-run.alt .w-dishwasher .qdlt{opacity:.45}
.anim.st-run.alt .w-dishwasher .qstm path{animation:dv-steam 3.2s ease-out infinite}
/* Tür offen: nur angekippt, oben ein Spalt mit Korb und leichtem Innenlicht, Dampf steigt aus dem Spalt, Bedienleiste bleibt */
.dopen .w-dishwasher .qfront{opacity:0}
.dopen .w-dishwasher .qtilt,.dopen .w-dishwasher .qgap,.dopen .w-dishwasher .qsteam{opacity:1}
.dopen .w-dishwasher .qdlt{opacity:.35}.dopen .w-dishwasher .qjet,.dopen .w-dishwasher .qstm,.dopen .w-dishwasher .qmist{opacity:0}
.dopen .w-dishwasher .qarm{animation:none!important}
.dopen .w-dishwasher .wdt,.dopen .w-dishwasher .lk{display:none}
.anim.dopen .w-dishwasher .qsteam ellipse{animation:dv-puff 2.8s ease-in-out infinite}
/* Hinweise im Bild (Farben aus dem Theme: --nova-warning-color / --nova-error-color) */
.scene .wn{display:none;transform-box:fill-box;transform-origin:center}
.scene .wn{--wc:var(--nv-warn)}.st-err .scene .wn{--wc:var(--nv-error)}
.scene .wt3{fill:var(--wc);fill-opacity:.25;stroke:var(--wc);stroke-width:1.8;stroke-linejoin:round}.scene .wx{stroke:var(--wc);stroke-width:2.2;stroke-linecap:round}.scene .wx2{fill:var(--wc)}
.h-warning .scene .wn,.st-err .scene .wn{display:inline}
.anim.h-warning .scene .wn,.anim.st-err .scene .wn{animation:dv-pop2 1.6s ease-in-out infinite}
/* Tür offen: Bullauge ca. 30° angelehnt (verkürzt, Seitenkante, gewölbtes Glas), Scharnierblock, Manschette, Trommel ohne Wasser */
.w-washer .pdt{fill:none;stroke:#1a1e27;stroke-width:4.4;opacity:0;transition:opacity .3s}
.w-washer .pgb{opacity:0;transition:opacity .4s}.w-washer .hng{opacity:0;transition:opacity .3s}
.w-washer .gsm{fill:none;stroke:#5d6573;stroke-width:4.6}.w-washer .gsf{fill:none;stroke:#000;stroke-opacity:.35;stroke-width:.6}.w-washer .gsh{fill:none;stroke:#fff;stroke-opacity:.12;stroke-width:.6}
.dopen .w-washer .pd{transform:scale(.8,1.03)}
.dopen .w-washer .pdt,.dopen .w-washer .pgb,.dopen .w-washer .hng{opacity:1}
.dopen .w-washer .wl,.dopen .w-washer .dlt{opacity:0}
.w-washer .wl{transition:transform .8s,opacity .5s}
.scene .lk{display:none;fill:none;stroke:currentColor;stroke-opacity:.8;stroke-width:1.4}.scene .lk rect{fill:currentColor;fill-opacity:.8;stroke:none}
.dlock .w-washer .lk{display:inline}
.scene .dd{transform-box:view-box;transition:transform .5s ease}
.h-detergent .w-washer .dw,.h-softener .w-washer .dw,.h-beans .w-coffee .bn,.h-descale .w-coffee .dp{fill:var(--nv-warn);fill-opacity:.95}
.h-tank .w-coffee .tw{transform:translateY(40px)}.h-tank .w-coffee .tk{stroke:var(--nv-warn);stroke-opacity:1;stroke-width:1.4}
.anim.h-detergent .w-washer .dw,.anim.h-softener .w-washer .dw,.anim.h-tank .w-coffee .tk,.anim.h-beans .w-coffee .bn,.anim.h-descale .w-coffee .dp{animation:dv-blinko 1.3s ease-in-out infinite}
/* Kaffeevollautomat */
.scene .bn{fill:currentColor;fill-opacity:.16;stroke:currentColor;stroke-opacity:.28;stroke-width:1.2}
.scene .tk{fill:rgba(0,0,0,.22);stroke:currentColor;stroke-opacity:.3;stroke-width:1}
.scene .tw{fill:currentColor;fill-opacity:.3;transform-box:view-box;transition:transform .8s}
.scene .dp{fill:currentColor;fill-opacity:.15}
.scene .sp,.scene .tray{fill:currentColor;fill-opacity:.24}
.st-heat .w-coffee .pnl{stroke:var(--dc);stroke-opacity:.8}
.anim.st-heat .w-coffee .pnl{animation:dv-stk 2.6s ease-in-out infinite}
.anim.st-run .w-coffee .steam path,.anim.st-done.fx .w-coffee .steam path{animation:dv-steam 3s ease-out infinite}
.anim.st-done.fx .w-coffee .steam path{animation-iteration-count:2}
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
@keyframes dv-sarm{0%{transform:scaleX(1)}25%{transform:scaleX(.08)}50%{transform:scaleX(-1)}75%{transform:scaleX(.08)}100%{transform:scaleX(1)}}
@keyframes dv-puff{0%{opacity:0;transform:translate(0,0) scale(.6) rotate(0)}30%{opacity:.32}70%{opacity:.18}100%{opacity:0;transform:translate(var(--sx),var(--sy)) scale(1.5) rotate(14deg)}}
@keyframes dv-jet{0%{opacity:0;transform:translate(0,0)}20%{opacity:.85}100%{opacity:0;transform:translate(var(--dx,0),-20px)}}
@keyframes dv-wave{to{transform:translateX(-25px)}}
@keyframes dv-arm{from{transform:rotate(-7deg)}to{transform:rotate(7deg)}}
@keyframes dv-drop{0%{opacity:0;transform:translate(0,0)}20%{opacity:.9}100%{opacity:0;transform:translate(var(--dx,0),-46px)}}
@keyframes dv-mist{0%,100%{opacity:.04}50%{opacity:.16}}
@keyframes dv-heat{0%{opacity:0;transform:translateY(4px)}40%{opacity:.85}100%{opacity:0;transform:translateY(-8px)}}
@keyframes dv-glow{0%,100%{opacity:.25}50%{opacity:.8}}
@keyframes dv-stk{0%,100%{stroke-opacity:.25}50%{stroke-opacity:.95}}
@keyframes dv-coil{0%,100%{opacity:.6}50%{opacity:1}}
@keyframes dv-wglo{0%,100%{opacity:.3}50%{opacity:.5}}
@keyframes dv-hz{0%{opacity:0;transform:translateY(4px) scaleY(.6)}30%{opacity:.45}100%{opacity:0;transform:translateY(-10px) scaleY(1.2)}}
@keyframes dv-apuff{0%{opacity:0;transform:translate(0,0) scale(.6)}25%{opacity:.6}100%{opacity:0;transform:translate(var(--sx),var(--sy)) scale(1.8)}}
@keyframes dv-glo{0%,100%{opacity:.18}50%{opacity:.5}}
@keyframes dv-blinko{0%,100%{opacity:1}50%{opacity:.2}}
@keyframes dv-pop2{0%,100%{transform:scale(1)}50%{transform:scale(1.15)}}
@keyframes dv-blink{0%,100%{fill-opacity:.7}50%{fill-opacity:.15}}
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
      if (c.device_type && !TYPES2[c.device_type]) throw new Error("device_type muss washer, dishwasher, airfryer, coffee oder generic sein");
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
      const rv = roleVars(c.color || TYPES2[t].color);
      const anim = c.animation !== false && !cmp;
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${SCENE_CSS}${DCSS2}:host([hidden]){display:none}</style>
<div class="g dv t-${t}${c.window === false ? " nowin" : ""}${cmp ? " cmp" : ""}${anim ? " anim" : ""}${c.glow !== false ? " glow" : ""}" style="--dc:${rv.c};--dc-fg:${rv.fg};--hc:${roleVars(c.heat_color || "accent-2").c}">
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
        kp: q(".kp"),
        kt: q(".kt"),
        wd: q(".wdt"),
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
      e.als.addEventListener("click", (ev) => {
        const el2 = ev.target.closest?.(".al[data-e]");
        if (el2) this._act({ entity: el2.dataset.e }, "tap", true);
      });
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
          if (cur2 < mn || cur2 > mx) return this._setNum(o, isFinite(mn) ? mn : mx);
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
      const t = typeOf(c), TY = TYPES2[t], s = this._S(c.entity), cls = this._cls(), act = isAct(cls);
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
      const stx = !c.entity ? "Status-Entität im Editor wählen" : na ? "Nicht verfügbar" : own || (["ready", "heat", "warm"].includes(cls) || raw === s.state && def ? def : nice(s.state, raw));
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
      if (e.kp) {
        const r = secsOf(this._S(c.remaining)), tot = secsOf(this._S(c.duration));
        const f = r > 0 && tot > 0 ? Math.min(1, r / tot) : null;
        e.g.classList.toggle("kring", f != null);
        e.kp.style.strokeDashoffset = String(100 - (f ?? 0) * 100);
        if (e.kt) e.kt.textContent = r > 0 ? fmtDisp(r) : "";
      }
      if (e.wd) e.wd.textContent = cls === "done" ? "End" : cls === "off" ? "" : rem != null ? fmtDisp(rem) : "– –";
      if (this._fx && !this._sw) {
        this._sw = true;
        sweep(e.g);
      }
      if (!this._fx) this._sw = false;
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
          const pv = this._pend[o.entity]?.v, raw = pv ?? (ok(s) ? +s.state : null), bad = raw != null && pv == null && (a.min != null && raw < a.min || a.max != null && raw > a.max);
          const n = bad ? null : raw;
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
      const c = this._c, h = this._h, t = typeOf(c), TY = TYPES2[t], g = this._e.g, out = [], on = /* @__PURE__ */ new Set();
      const add = (lvl, ic, msg, e, hit) => out.push(`<div class="al ${lvl}${hit ? " hit" : ""}"${e ? ` data-e="${esc(e)}"` : ""}><ha-icon icon="${esc(ic)}"></ha-icon><span>${esc(msg)}</span></div>`);
      if (this._msg) add("error", "mdi:alert-circle-outline", this._msg);
      if (cls === "err") add("error", "mdi:alert-circle-outline", stx, c.entity, true);
      const cn = this._S(c.connection);
      if (c.connection && (!cn || ["off", "unavailable", "disconnected"].includes(cn.state))) add("error", "mdi:wifi-off", c.connection_text || "Keine Verbindung zum Gerät", c.connection);
      const blk = c.layout !== "compact" && !isAct(cls) ? this._startBlock() : null;
      if (blk) add("warning", "mdi:play-circle-outline", blk);
      const dr = this._S(c.door), dv = c.door_anim !== false && TY.dview;
      const open = !!dr && ["on", "open", "opened"].includes(dr.state);
      if (open) add("info", "mdi:door-open", c.door_text || TY.door, c.door, dv);
      g.classList.toggle("dopen", open && dv);
      g.classList.toggle("dlock", !!dr && dr.state === "locked" && dv);
      const can = animsOf(t);
      c.hints.forEach((a) => {
        const s = this._S(a.entity);
        if (!alertHit(a, s)) return;
        const an = can.includes(a.anim) ? a.anim : null, H = HANIM[an];
        if (an) on.add(an);
        add(
          ["error", "info"].includes(a.level) ? a.level : "warning",
          a.icon || (H && an !== "warning" ? H[2] : s?.attributes.icon) || "mdi:information-outline",
          a.message || H && H[1] || `${a.name ?? s.attributes.friendly_name ?? a.entity}: ${fmtState(h, s)}`,
          a.entity,
          !!an
        );
      });
      Object.keys(HANIM).forEach((k) => g.classList.toggle(`h-${k}`, on.has(k)));
      const html = out.join("");
      if (this._alKey !== html) {
        this._alKey = html;
        this._e.als.innerHTML = html;
      }
      g.classList.toggle("err", cls === "err" && c.glow !== false);
    }
    // Sichtbarkeit: Animation und Countdown nur, wenn die Karte zu sehen und der Tab offen ist
    _tick() {
      const vis3 = !!this._inView && !document.hidden && !this._quiet && this.isConnected;
      this._e?.g.classList.toggle("still", !vis3);
      if (vis3 && !this._vis && this._c.animation !== false) sweep(this._e?.g);
      this._vis = vis3;
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
    sel("device_type", Object.entries(TYPES2).map(([k, v]) => [k, k === "generic" ? "Allgemein" : v.label])),
    g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } }),
    { name: "entity", selector: ST },
    { name: "power", selector: { entity: { domain: ["switch", "input_boolean"] } } }
  ];
  var GPROG = (t) => [
    { name: "program", selector: ST },
    g2({ name: "progress", selector: { entity: { domain: ["sensor", "number", "input_number"] } } }, { name: "duration", selector: ST }),
    g2({ name: "remaining", selector: ST }, { name: "end_time", selector: ST }),
    { name: "phase", selector: ST },
    ...TYPES2[t].alt ? [{ name: "phase_states", selector: { text: { multiple: true } }, context: { t } }] : []
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
  var GINFO = (t) => [
    g2({ name: "remote_start", selector: ST }, { name: "remote_start_text", selector: T }),
    g2({ name: "door", selector: ST }, { name: "door_text", selector: T }),
    ...TYPES2[t].dview ? [{ name: "door_anim", selector: { boolean: {} } }] : [],
    g2({ name: "connection", selector: ST }, { name: "connection_text", selector: T })
  ];
  var GHINT = (t) => [
    { name: "entity", required: true, selector: ST },
    sel("anim", [["none", "Keine"], ...animsOf(t).map((k) => [k, HANIM[k][0]])]),
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
  var GLOOK = (t) => [
    sel("layout", [["full", "Voll"], ["compact", "Kompakt (läuft gerade)"]]),
    g2({ name: "hide_when_off", selector: { boolean: {} } }, { name: "animation", selector: { boolean: {} } }),
    g2(ROLE("color"), { name: "glow", selector: { boolean: {} } }),
    ...t === "airfryer" ? [g2(ROLE("heat_color"), { name: "window", selector: { boolean: {} } })] : []
  ];
  var GACTS = [g2({ name: "tap_action", selector: A }, { name: "hold_action", selector: A })];
  var PHASE_LBL = { dishwasher: "Zustände „trocknet“ (Dampf statt Sprüharm)", washer: "Zustände „schleudert“ (schnelle Trommel)", coffee: "Zustände „brüht“ (Kaffee läuft in die Tasse)" };
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
    door_anim: "Tür im Bild zeigen",
    anim: "Animation im Bild",
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
    glow: "Rahmen leuchtet beim Laufen",
    window: "Sichtfenster",
    heat_color: "Glühfarbe (Heizspirale)"
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
    door_anim: "Offen = Tür bzw. Schublade im Bild offen, „locked“ = Schloss am Bullauge",
    anim: "Was im Gerätebild passiert, solange der Hinweis aktiv ist. Ohne eigene Meldung erscheint ein passender Text",
    connection: "Hinweis, wenn aus bzw. nicht verfügbar",
    running_states: "Leer = übliche Rohzustände (run, running, cooking …). Genaue Zustände der Status-Entität",
    prep_states: "Gerät wird gerade eingestellt (z. B. Airfryer „setting“). Leer = setting, programming …",
    ready_states: "An, aber nichts läuft. Leer = ready, idle, standby, mainmenu. Alles Unbekannte gilt als „aus“",
    heat_states: "Leer = heating, preheating, preheat. Ruhiges Glühen statt Lauf-Animation",
    warm_states: "Leer = maintain (Philips), keep_warm, warming. Schwaches Glühen",
    text_running: "Leer = Übersetzung von HA, sonst Text zum Gerätetyp",
    heat_color: "Farbe von Heizspirale, Fenster-Licht und Fuge beim Garen (Standard: Akzent 2)",
    window: "Aus = Gerät ohne Fenster: Hitze steigt oben auf, der Knopfring zeigt alles an",
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
        if (c.color === TYPES2[typeOf(c)].color) delete c.color;
        return c;
      };
      const data = { ...GDEF, color: TYPES2[t].color, ...c0 };
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
          b.append(form(GINFO(t)), this._h4("Weitere Hinweise"), this._hint("z. B. Fehlercode (Warnen außer bei 0), Wartung fällig, Nachfüllen."));
          this._itemList(b, "hints", GHINT(t), { item: "Hinweis", icon: "mdi:information-outline" }, "Hinweis hinzufügen");
        }),
        this._section("states", "mdi:state-machine", "Zustände und Texte", (b) => {
          b.append(this._hint("Nur nötig, wenn die Karte den Zustand falsch einordnet. Zustände so eintragen, wie sie in den Entwicklerwerkzeugen stehen."));
          b.append(form(GSTATE), this._h4("Texte"), form(GTEXT));
        }),
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(GLOOK(t)))),
        this._section("actions", "mdi:gesture-tap", "Aktionen", (b) => b.append(form(GACTS)))
      );
    }
  };
  __publicField(NovaApplianceCardEditor, "labels", GLABELS);
  __publicField(NovaApplianceCardEditor, "helpers", GHELPERS);
  __publicField(NovaApplianceCardEditor, "openSections", ["general"]);
  define("geraet-card-editor", NovaApplianceCardEditor);

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
    stop: ["button", ["stop", "druckvorgang_beenden"]]
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
    const fans = ents.filter((e) => dom(e.entity_id) === "fan").map((e) => e.entity_id).sort();
    if (fans.length) out.fans = fans;
    const cam = ents.find((e) => ["image", "camera"].includes(dom(e.entity_id)) && (/(kamera|camera)$/.test(e.entity_id) || /camera/.test(e.translation_key || "")));
    if (cam) out.camera = cam.entity_id;
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
    show_fans: true,
    camera_mode: "always",
    show_switches: true,
    stop_confirm: "Druck wirklich abbrechen?"
  };
  var CLS = ["off", "idle", "heat", "prep", "print", "pause", "done", "error", "cool"];
  var CTXT = { off: "Aus", idle: "Bereit", heat: "Heizt auf", prep: "Bereitet vor", print: "Druckt", pause: "Pausiert", done: "Fertig", error: "Fehler", cool: "Kühlt ab" };
  var BAD2 = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", ""]);
  var ok2 = (s) => !!s && !BAD2.has(s.state);
  var num = (s) => ok2(s) && NUMRE.test(s.state) ? +s.state : null;
  var SECS2 = { s: 1, sec: 1, min: 60, m: 60, h: 3600, d: 86400 };
  var fmtDur2 = (sec) => {
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
  var SLOTX = [72, 108, 144, 180];
  var SPOOL = SLOTX.map((x, i) => `<g class="sl s${i}"><clipPath id="psc${i}"><rect class="fcl" x="${x - 11.8}" y="59" width="23.6" height="32" rx="3"/></clipPath>
<rect class="fg" x="${x - 15}" y="57" width="3.2" height="34" rx="1.4"/><rect class="fg" x="${x + 11.8}" y="57" width="3.2" height="34" rx="1.4"/>
<rect class="fg" x="${x - 12}" y="71" width="24" height="8" rx="2"/><rect class="fl" x="${x - 11.8}" y="59" width="23.6" height="32" rx="3"/>
<g clip-path="url(#psc${i})"><rect class="cy" x="${x - 12}" y="55" width="24" height="40"/><rect class="wnd" x="${x - 12}" y="55" width="24" height="40"/><rect class="rot" x="${x - 12}" y="50" width="24" height="6"/></g>
<g class="sw"><path d="M${x} 62 l6 10.5 h-12 z"/><rect x="${x - 0.6}" y="65.5" width="1.2" height="3.6" rx=".6"/><circle cx="${x}" cy="70.4" r=".7"/></g></g>`).join("");
  var FEED = SLOTX.map((x, i) => `<g class="sl s${i}"><rect class="fd" x="${x - 4}" y="91" width="8" height="2.4" rx="1.2"/><text class="mt" x="${x}" y="100.5"></text>
<rect class="sled" x="${x - 7}" y="104.5" width="14" height="2" rx="1"/></g>`).join("");
  var SCENE = `<svg viewBox="0 0 260 300" aria-hidden="true"><defs>
<linearGradient id="pbd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="sb1"/><stop offset="1" class="sb2"/></linearGradient>
<linearGradient id="psh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
<linearGradient id="pgl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#a9c6ff" stop-opacity=".11"/><stop offset=".55" stop-color="#5d7397" stop-opacity=".05"/><stop offset="1" stop-color="#0c111c" stop-opacity=".38"/></linearGradient>
<linearGradient id="pin" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2c3344"/><stop offset="1" stop-color="#10141b"/></linearGradient>
<radialGradient id="plt" cx=".5" cy="0" r=".9"><stop offset="0" stop-color="#fff6e4" stop-opacity=".5"/><stop offset="1" stop-color="#fff6e4" stop-opacity="0"/></radialGradient>
<radialGradient id="pgw"><stop offset="0" stop-color="#ffc061" stop-opacity=".95"/><stop offset=".4" stop-color="#ff8a2a" stop-opacity=".5"/><stop offset="1" stop-color="#ff7a1a" stop-opacity="0"/></radialGradient>
<linearGradient id="pdm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#9fb6d8" stop-opacity=".3"/><stop offset=".6" stop-color="#3a4660" stop-opacity=".35"/><stop offset="1" stop-color="#141821" stop-opacity=".55"/></linearGradient>
<linearGradient id="pcy" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".4"/><stop offset=".3" stop-color="#fff" stop-opacity="0"/><stop offset=".75" stop-color="#000" stop-opacity=".1"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>
<linearGradient id="prt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".35"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="pob" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".38" stop-color="#fff" stop-opacity=".28"/><stop offset=".55" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".4"/></linearGradient>
<linearGradient id="pgs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>
<linearGradient id="phd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3b4252"/><stop offset="1" stop-color="#20252f"/></linearGradient>
<pattern id="pwn" width="3" height="60" patternUnits="userSpaceOnUse"><rect width=".6" height="60" fill="#000" fill-opacity=".12"/></pattern><pattern id="ply" width="6" height="2" patternUnits="userSpaceOnUse"><rect width="6" height=".9" fill="#000" fill-opacity=".2"/></pattern>
<clipPath id="pci"><rect x="46" y="136" width="160" height="146" rx="4"/></clipPath>
<clipPath id="poc"><rect class="ocr" x="90" y="${PLATE - OBJ_H}" width="70" height="${OBJ_H}"/></clipPath>
<clipPath id="pvs"><path d="M107 232 C 103 218, 116 208, 113 198 L113 188 L133 188 L133 198 C 130 208, 143 218, 139 232 Z"/></clipPath>
</defs>
<ellipse class="shd" cx="128" cy="294" rx="104" ry="5"/>
<g class="xsp"><path class="tube" d="M196 116 C 210 104, 228 128, 228 152"/><path class="fil" d="M196 116 C 210 104, 228 128, 228 152"/>
<circle class="xf" cx="228" cy="190" r="32"/><circle class="xw" cx="228" cy="190" r="26"/><circle class="xc" cx="228" cy="190" r="26"/><circle class="xh" cx="228" cy="190" r="9"/></g>
<g class="ams"><path class="tube" d="M204 95 C 230 95, 232 119, 210 129"/><path class="fil" d="M204 95 C 230 95, 232 119, 210 129"/></g>
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
<rect class="handle" x="196" y="192" width="3" height="34" rx="1.5"/></g>
<circle class="stled" cx="203" cy="126" r="1.5"/>
<g class="top"><rect class="lid" x="38" y="112" width="176" height="5" rx="2.5"/>
<g class="ams">${SPOOL}<rect class="dome" x="48" y="51" width="156" height="42" rx="16"/><path class="dhl" d="M64 53 h40 l-30 36 h-14 z"/>
<rect class="abase" x="46" y="87" width="160" height="24" rx="7"/>${FEED}<text class="unit" x="201" y="108"></text></g></g>
<g class="tab"><ellipse class="dsh" cx="70" cy="146" rx="28" ry="2.4"/>
<path class="tbz" d="M42 116 h56 a4 4 0 0 1 4 4 l-1.5 20 a4 4 0 0 1 -4 3.6 h-53 a4 4 0 0 1 -4 -3.6 l-1.5 -20 a4 4 0 0 1 4 -4 z"/>
<rect class="tbh" x="44" y="116.8" width="52" height="1" rx=".5"/><rect class="tsc" x="45" y="119.5" width="50" height="20" rx="2.5"/>
<text class="tt" x="48.5" y="132.5"></text><rect class="tbar" x="70" y="125" width="22.5" height="2" rx="1"/><rect class="tfill" x="70" y="125" width="0" height="2" rx="1"/>
<text class="ts" x="70" y="133.5"></text><path class="tgl" d="M47 120 h14 l-6 19 h-8 z"/></g>
<g class="bpos"><g class="bdg"><circle class="bc" r="9.5"/>
<path class="b-ok" d="M-4.2 0.2 l2.9 2.9 l5.6 -6"/>
<g class="b-wn"><path d="M0 -5.6 l5.6 9.7 h-11.2 z"/><rect x="-.65" y="-2.4" width="1.3" height="3.6" rx=".65"/><circle cx="0" cy="2.6" r=".8"/></g>
<g class="b-tp"><rect x="-1.6" y="-6" width="3.2" height="8" rx="1.6"/><circle cx="0" cy="3.4" r="2.8"/></g>
<g class="b-fn"><circle r="1.6"/><path d="M0 -1.6 C -1 -5 3 -6.5 3.2 -3.6 Z M1.4 .8 C 4.8 1.6 4.2 5.6 1.6 4.6 Z M-1.4 .8 C -4.6 2 -6.4 -1.6 -3.8 -2.8 Z"/></g></g></g>
</svg>`;
  var PCSS3 = `
.g.pr{--dc:var(--nv-a1);--dc-fg:var(--nv-a1-fg);--fc:var(--dc);
--sb1:var(--nova-printer-color-light,#3a4252);--sb2:var(--nova-printer-color,#191d26)}
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
.kvs .fi .k{flex:none}.kvs .fi .v{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis}
.xtra{display:flex;flex-direction:column;gap:10px}.xtra:empty{display:none}
.xtra .fans{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:14px}
.xtra .row{cursor:pointer}.xtra .row .ic{width:34px;height:34px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);flex:none}
.xtra .row.on .ic{background:var(--dc);color:var(--dc-fg)}.xtra .row .nm{flex:1;min-width:0;display:flex;flex-direction:column;line-height:1.25}
.xtra .row b,.xtra .row small{white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.xtra .row b{font-weight:600;font-size:13px}.xtra .row small{opacity:.65;font-size:11.5px}
.xtra .na{opacity:.45}
@container (max-width:340px){.xtra .fans{grid-template-columns:1fr}}
.cam{border-radius:16px;overflow:hidden;background:rgba(0,0,0,.3);cursor:pointer}.cam[hidden]{display:none}
.cam img{display:block;width:100%;height:auto}
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
.scene .body{fill:url(#pbd);stroke:rgba(255,255,255,.18);stroke-width:.6;transition:stroke .4s}.scene .sheen{fill:url(#psh);opacity:.4}.scene .edge{fill:#fff;opacity:.12}
.scene .vents rect{fill:rgba(0,0,0,.35)}
.scene .inner{fill:url(#pin)}.scene .lightc{fill:url(#plt);opacity:0;transition:opacity .5s}.scene .led{fill:#fff6e4;opacity:0;transition:opacity .5s}
.scene .dim{fill:#05070a;opacity:.4;transition:opacity .5s}
.lit .scene .lightc,.lit .scene .led{opacity:1}.lit .scene .dim{opacity:0}
.scene .zrod{fill:#4a5265}.scene .chute{fill:#3a4152}
.scene .carr{fill:#2f3644}.scene .plate{fill:#b38c52}.scene .plateh{fill:#e2c08b}
.scene .pheat{fill:#ff7a1a;opacity:0}
.scene .ob{fill:var(--fc)}.scene .oly{fill:url(#ply)}.scene .osh{fill:url(#pob)}.scene .gls{fill:url(#pgs);opacity:0}
.scene .obj{display:none;transform-box:view-box;transform-origin:123px 232px;transition:transform .6s}.has-obj .scene .obj{display:inline}
.scene .bed{transition:transform 1.2s ease}
.scene .fresh{fill:color-mix(in srgb,var(--fc) 50%,#fff);opacity:0}
.scene .cal rect{fill:var(--fc);opacity:0;transform-box:fill-box;transform-origin:left center}
.scene .dots circle{fill:var(--dc);opacity:0}
.scene .spag{fill:none;stroke:var(--fc);stroke-width:1.3;stroke-linecap:round;opacity:0;stroke-dasharray:240;stroke-dashoffset:240}
.scene .rail{fill:#59627a}.scene .railh{fill:rgba(255,255,255,.25)}.scene .blk{fill:#3a4252}
.scene .tube{fill:none;stroke:rgba(235,240,250,.4);stroke-width:2.6;stroke-linecap:round}
.scene .fil{fill:none;stroke:var(--fc);stroke-width:1.1;stroke-linecap:round;stroke-dasharray:4 3;opacity:.9}
.scene .head{transform-box:view-box;transition:transform 1s ease}.scene .hz{transform-box:view-box}
.scene .hd{fill:url(#phd);stroke:rgba(255,255,255,.15);stroke-width:.5}.scene .hdt{fill:rgba(255,255,255,.14)}
.scene .fan{fill:#161a22;stroke:rgba(255,255,255,.12);stroke-width:.5}.scene .bl ellipse{fill:#4a5366}.scene .hub{fill:#2b313e}
.scene .bl{transform-box:view-box;transform-origin:123px 163px}
.scene .heater{fill:#8e949c}.scene .nz{fill:#d0a24f;transition:fill .3s}
.scene .glow{fill:url(#pgw);opacity:0;transition:opacity .6s}
.scene .beam{fill:var(--nv-error);opacity:0}
.scene .wisp path{fill:none;stroke:#bfe3ff;stroke-width:1.3;stroke-linecap:round;opacity:0}
.scene .tint{fill:var(--nv-error);opacity:0;transition:opacity .5s}
.scene .door{transform-box:view-box;transform-origin:46px 209px;transition:transform .8s ease}
.scene .glass{fill:url(#pgl);stroke:rgba(255,255,255,.22);stroke-width:.7}.scene .refl{fill:#fff;opacity:.035}
.scene .dedge{fill:#5a5f67;opacity:0}
.scene .handle{fill:rgba(255,255,255,.3)}
.scene .stled{fill:#4caf6a;opacity:.3}
.scene .top{transform-box:view-box;transform-origin:216px 116px;transition:transform .8s ease}
.scene .lid{fill:url(#pgl);stroke:rgba(255,255,255,.25);stroke-width:.6}
.scene .dome{fill:url(#pdm);stroke:rgba(255,255,255,.22);stroke-width:.6}.scene .dhl{fill:#fff;opacity:.08}

.scene .abase{fill:url(#pbd);stroke:rgba(255,255,255,.14);stroke-width:.6}
.scene .fg{fill:#1a1e27;stroke:rgba(255,255,255,.12);stroke-width:.4}

.scene .fl{fill:var(--sc,#777);transition:opacity .4s}.scene .wnd{fill:url(#pwn)}.scene .cy{fill:url(#pcy)}.scene .rot{fill:url(#prt);opacity:0;transform-box:view-box}
.scene .sl.emp .fl,.scene .sl.emp .cy{opacity:0}
.scene .sw{display:none}.scene .sw path{fill:var(--nv-warn);stroke:#000;stroke-opacity:.3;stroke-width:.4}.scene .sw rect,.scene .sw circle{fill:#1b1d20}
.scene .sl.wn .sw{display:inline}
.scene .mt{font:500 5px Roboto,system-ui,sans-serif;fill:rgba(255,255,255,.75);text-anchor:middle}
.scene .sled{fill:rgba(255,255,255,.18)}.scene .sl.act .sled{fill:var(--dc)}
.scene .fd{fill:#0d1016}
.scene .unit{font:600 6px Roboto,system-ui,sans-serif;fill:rgba(255,255,255,.55);text-anchor:end}
.scene .xf{fill:#1d2025}.scene .xw{fill:var(--fc)}.scene .xc{fill:url(#pcy);opacity:.6}.scene .xh{fill:#3a3f47}
.scene .tbz{fill:url(#phd);stroke:rgba(255,255,255,.18);stroke-width:.6}.scene .tbh{fill:rgba(255,255,255,.18)}.scene .tsc{fill:#0a0e14;stroke:rgba(255,255,255,.18);stroke-width:.5}.scene .dsh{fill:#000;opacity:.35}
.scene .tt{font:600 8px Roboto,system-ui,sans-serif;fill:#fff}.scene .ts{font:400 4px Roboto,system-ui,sans-serif;fill:rgba(255,255,255,.65)}
.scene .tbar{fill:rgba(255,255,255,.15)}.scene .tfill{fill:var(--dc)}.scene .tgl{fill:#fff;opacity:.05}
.nodisp .scene .tab{display:none}
.scene .bdg{opacity:0;transition:opacity .3s}.scene .bdg>*{display:none}
.scene .bc{fill:var(--bc,var(--dc));stroke:rgba(0,0,0,.25);stroke-width:.5}
.scene .b-ok{fill:none;stroke:var(--dc-fg);stroke-width:2;stroke-linecap:round;stroke-linejoin:round;stroke-dasharray:14}
.scene .b-wn path{fill:#fff}.scene .b-wn rect,.scene .b-wn circle{fill:var(--bc)}
.scene .b-tp,.scene .b-fn{fill:#fff}
.scene .bdg{transform-box:fill-box;transform-origin:center}
/* Badge-Stelle: Warnungen oben links im Innenraum, Fertig-Haken unten rechts nach der gemeinsamen Regel badgeAt() aus
   shared/scene.js (Gehäuseecke 216/292, u = 1,3 → Mitte 190/242,6, Radius 15). Eigene Kopie, solange die Drucker-Card scene.js nicht nutzt. */
.scene .bpos{transform:translate(74px,172px)}.b-ok .scene .bpos{transform:translate(190px,242.6px) scale(1.574)}
.b-ok .scene .bdg,.b-wn .scene .bdg,.b-tp .scene .bdg,.b-fn .scene .bdg{opacity:1}
.b-ok .scene .bc,.b-ok .scene .b-ok,.b-wn .scene .bc,.b-wn .scene .b-wn,.b-tp .scene .bc,.b-tp .scene .b-tp,.b-fn .scene .bc,.b-fn .scene .b-fn{display:inline}
.b-wn .scene,.b-tp .scene,.b-fn .scene{--bc:var(--nv-warn)}.bad .scene{--bc:var(--nv-error)}
.noams .scene .ams{display:none}.scene .xsp{display:none}.noams.xs .scene .xsp{display:inline}
/* Grundzustände */
.st-off .scene>svg{opacity:.55;transition:opacity .4s}.st-off .scene .tab .tsc{fill:#08090b}.st-off .scene .tab text,.st-off .scene .tbar,.st-off .scene .tfill{display:none}
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
.st-done .scene .gls{opacity:.7}.anim.st-done .scene .gls{animation:pr-glare .9s .1s ease-in-out both}
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
@keyframes pr-pop{0%{transform:scale(.3)}70%{transform:scale(1.15)}100%{transform:scale(1)}}
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
      this._fans = c.show_fans === false ? [] : [].concat(c.fans?.length ? c.fans : this._det.fans || []);
      this._sws = c.show_switches === false ? [] : [].concat(c.switches || []);
      return { e: out, dev };
    }
    _build() {
      this._built = true;
      const c = this._c, r = this.shadowRoot || this.attachShadow({ mode: "open" }), rv = roleVars(c.color);
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${PCSS3}</style>
<div class="g pr${c.animation !== false ? " anim" : ""}${c.glow !== false ? " glow" : ""}${c.show_display === false ? " nodisp" : ""}" style="--dc:${rv.c};--dc-fg:${rv.fg}">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div><span class="demo" hidden>Demo</span><div class="hb li" hidden title="Kammerlicht"><ha-icon icon="mdi:lightbulb-outline"></ha-icon></div></div>
<div class="mid"><div class="scene">${SCENE}</div><div class="inf"><div class="big"><span class="pc"></span><span class="ph"></span></div><div class="bar"><i></i></div>
<div class="tm"><span class="rm"></span><span class="en"></span></div><div class="kvs"></div></div></div>
<div class="cam" hidden><img alt=""></div><div class="amsl"></div><div class="als"></div><div class="acts"></div><div class="xtra"></div></div>`;
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
        xtra: q(".xtra"),
        als: q(".als"),
        acts: q(".acts"),
        svg: q(".scene svg"),
        bed: q(".bed"),
        ocr: q(".ocr"),
        tt: q(".tt"),
        ts: q(".ts"),
        tfill: q(".tfill"),
        unit: q(".unit"),
        cam: q(".cam"),
        img: q(".cam img"),
        sl: [0, 1, 2, 3].map((i) => ({ g: r.querySelectorAll(`.sl.s${i}`), fl: q(`.s${i} .fl`), fcl: q(`.s${i} .fcl`), mt: q(`.s${i} .mt`) }))
      };
      const e = this._e;
      press(e.ic, { tap: () => this._act({ entity: this._en?.status, tap_action: c.tap_action }, "tap", true), hold: () => this._act({ entity: this._en?.status, hold_action: c.hold_action }, "hold") });
      press(e.li, { tap: () => this._light(), isolate: true });
      press(e.cam, { tap: () => this._act({ entity: c.camera }, "tap", true) });
      e.img.addEventListener("error", () => {
        e.cam.hidden = true;
        this._camErr = e.img.getAttribute("src");
      });
      e.img.addEventListener("load", () => {
        if (this._camSrc === e.img.getAttribute("src")) e.cam.hidden = false;
      });
      e.als.addEventListener("click", (ev) => {
        const el2 = ev.target.closest?.(".al[data-e]");
        if (el2) this._act({ entity: el2.dataset.e }, "tap", true);
      });
      this._ab = {};
      [["pause", "mdi:pause", "Pause"], ["resume", "mdi:play", "Fortsetzen"], ["stop", "mdi:stop", "Stopp"]].forEach(([k, ic, t]) => {
        const el2 = document.createElement("div");
        el2.className = `ab a-${k}${k === "resume" ? " pri" : ""}`;
        el2.innerHTML = `<ha-icon icon="${ic}"></ha-icon><span>${t}</span>`;
        el2.hidden = true;
        press(el2, { tap: () => this._do(k) });
        e.acts.append(el2);
        this._ab[k] = el2;
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
      this._ids = new Set([...entityIds(c), ...Object.values(en).filter(Boolean), ...this._fans, ...this._sws, c.camera].filter(Boolean));
      const S = (k) => this._S(en[k]);
      const st = S("status"), raw = String(st?.state || "").toLowerCase(), stg = S("stage"), sv = ok2(stg) ? stg.state : null;
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
      if (r0 != null) rem = r0 * (SECS2[rs.attributes.unit_of_measurement] ?? 60);
      if (ok2(es)) {
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
        file: ok2(S("file")) ? S("file").state : "",
        status: st ? cls === "off" && !ok2(st) ? "Nicht verfügbar" : fmtState(h, st) : "Drucker im Editor wählen",
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
      e.svg.setAttribute("viewBox", ams ? "0 44 260 256" : "0 106 260 194");
      const wnSlot = ["empty", "tangle"].includes(m.fx);
      e.sl.forEach((x, i) => {
        const s = aU?.slots[i];
        const f = s ? s.empty ? 0 : s.rem == null ? 0.8 : s.rem / 100 : 0, hh = 12 + 20 * f, y = 75 - hh / 2;
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
      this._cam(cls);
      const sp = c.show_progress !== false && m.p != null && (act || cls === "done");
      e.pc.innerHTML = sp ? `${Math.round(m.p)}<small>%</small>` : "";
      e.pc.hidden = !sp;
      e.ph.textContent = c.show_stage !== false && m.stage ? m.stage : "";
      e.bar.hidden = !sp;
      if (sp) e.bari.style.width = `${m.p}%`;
      e.rm.textContent = c.show_remaining !== false && act && m.rem != null ? `noch ${fmtDur2(m.rem)}` : "";
      e.en.textContent = c.show_end_time !== false && act && m.end != null && cls !== "pause" ? `fertig um ${this._clock(m.end)}` : "";
      const rows = [];
      const row = (ic, k, v, x = "") => rows.push(`<div class="kv${x}"><ha-icon icon="${ic}"></ha-icon><span class="k">${esc(k)}</span><span class="v">${v}</span></div>`);
      const tmp = (v, t) => v == null ? "–" : `<b>${Math.round(v)}</b>${t ? ` / ${Math.round(t)}` : ""} °C`;
      if (c.show_layer !== false && m.layer != null && (act || cls === "done")) row("mdi:layers-triple-outline", "Schicht", `<b>${m.layer}</b> / ${m.layers ?? "?"}`);
      if (c.show_nozzle !== false && m.noz != null) row("mdi:printer-3d-nozzle-heat-outline", "Düse", tmp(m.noz, m.nozT));
      if (c.show_bed !== false && m.bed != null) row("mdi:radiator", "Bett", tmp(m.bed, m.bedT));
      if (c.show_file !== false && m.file) row("mdi:file-outline", "Datei", esc(m.file), " fi");
      const kh = rows.join("");
      if (this._kk !== kh) {
        this._kk = kh;
        e.kvs.innerHTML = kh;
      }
      this._amsList(m, ams);
      this._alerts(m);
      this._acts(m);
      this._xtra();
      this._tick();
    }
    // Kamerabild unter der Zeichnung: immer oder nur beim Drucken, nicht verfügbar = ausgeblendet
    _cam(cls) {
      const c = this._c, e = this._e, s = this._S(c.camera), pic = s?.attributes.entity_picture;
      const want = !!c.camera && !c.demo && ok2(s) && !!pic && (c.camera_mode !== "printing" || ["print", "prep", "heat", "pause"].includes(cls));
      const live = want && dom(c.camera) === "camera";
      if (!want) {
        e.cam.hidden = true;
        e.img.removeAttribute("src");
        this._camSrc = null;
      } else {
        const src = `${pic}${pic.includes("?") ? "&" : "?"}_=${live ? this._camT || 0 : encodeURIComponent(s.state)}`;
        if (src !== this._camSrc) {
          this._camSrc = src;
          e.img.src = src;
        }
        if (this._camErr === src) e.cam.hidden = true;
      }
      this._camLive = live;
    }
    _amsList(m, ams) {
      const c = this._c, us = [...ams ? m.units : [], ...m.ext ? [{ name: "Extern", slots: [m.ext], x: true }] : []];
      const wn = ["empty", "tangle"].includes(m.fx);
      const html = c.show_ams_list === false ? "" : us.map((u) => `<div class="au${u.x ? " x" : ""}"><span class="an">${esc(u.name)}</span><div class="ss">${u.slots.map((s) => {
        const r = s.empty ? 0 : s.rem;
        return `<div class="slot${s.act ? " act" : ""}${s.empty ? " emp" : ""}${s.act && wn ? " wn" : ""}" title="${esc(s.name)}" style="--c:${s.c || "#777"};--r:${r == null ? 100 : r}%"${s.id ? ` data-e="${esc(s.id)}"` : ""}>
<span class="sc"></span><span class="st"><b>${esc(s.empty ? "Leer" : s.mat || "–")}</b><small>${s.empty ? "" : r == null ? esc(s.name !== s.mat ? s.name : "") : `${Math.round(r)} %`}</small></span></div>`;
      }).join("")}</div></div>`).join("");
      if (this._ak !== html) {
        this._ak = html;
        this._e.amsl.innerHTML = html;
        this._e.amsl.querySelectorAll(".slot[data-e]").forEach((el2) => press(el2, { tap: () => this._act({ entity: el2.dataset.e }, "tap", true) }));
      }
    }
    // Lüfter (Regler) und weitere Schalter unter der Zeichnung
    _xtra() {
      const short = (h2, id) => {
        const n = nameOf(h2, { entity: id }), d = h2.devices?.[h2.entities?.[id]?.device_id], dn = d?.name_by_user || d?.name;
        return dn && n.startsWith(`${dn} `) ? n.slice(dn.length + 1) : n;
      };
      const h = this._h, fans = this._c.demo ? [] : this._fans || [], sws = this._c.demo ? [] : this._sws || [], key = `${fans}|${sws}`;
      if (this._xk !== key) {
        this._xk = key;
        const box = this._e.xtra;
        box.textContent = "";
        this._xu = [];
        if (fans.length) {
          const sec = document.createElement("div");
          sec.innerHTML = '<div class="bt">Lüfter</div><div class="fans"></div>';
          fans.forEach((id) => {
            const el2 = document.createElement("div");
            el2.className = "sl";
            el2.innerHTML = '<div class="kv"><ha-icon></ha-icon><span class="k"></span><span class="v"></span></div><input type="range" min="0" max="100">';
            const inp = el2.lastChild, v = el2.querySelector(".v"), D = SLIDE.fan;
            press(el2.firstChild, { tap: () => this._act({ entity: id }, "tap", true) });
            const paint = () => {
              inp.style.setProperty("--p", `${+inp.value}%`);
              v.textContent = `${Math.round(+inp.value)} %`;
            };
            inp.addEventListener("input", () => {
              el2._drag = true;
              paint();
            });
            inp.addEventListener("change", () => {
              D.set(this._h, id, +inp.value);
              clearTimeout(el2._t);
              el2._t = setTimeout(() => {
                el2._drag = false;
              }, 1500);
            });
            sec.lastChild.append(el2);
            this._xu.push((h2) => {
              const s = h2.states[id], na = !s || s.state === "unavailable";
              el2.classList.toggle("na", na);
              inp.disabled = na;
              el2.querySelector("ha-icon").icon = iconOf(h2, { entity: id }, "mdi:fan");
              el2.querySelector(".k").textContent = short(h2, id);
              if (!s) {
                v.textContent = "–";
                return;
              }
              inp.step = D.r(s.attributes)[2];
              if (!el2._drag) inp.value = D.v(s);
              paint();
            });
          });
          box.append(sec);
        }
        if (sws.length) {
          const sec = document.createElement("div");
          sec.innerHTML = '<div class="bt">Schalter</div><div class="list" style="--cols:2"></div>';
          sws.forEach((id) => {
            const el2 = document.createElement("div");
            el2.className = "row";
            el2.innerHTML = `<div class="ic"><ha-icon></ha-icon></div><div class="nm"><b></b><small></small></div>${TOGGLE.includes(dom(id)) ? '<div class="sw"></div>' : ""}`;
            press(el2, { tap: () => this._act({ entity: id }, "tap"), hold: () => this._act({ entity: id }, "hold") });
            sec.lastChild.append(el2);
            this._xu.push((h2) => {
              const s = h2.states[id];
              el2.classList.toggle("na", !s || s.state === "unavailable");
              el2.classList.toggle("on", isOn(s));
              el2.querySelector("ha-icon").icon = iconOf(h2, { entity: id }, "mdi:toggle-switch-outline");
              el2.querySelector("b").textContent = short(h2, id);
              el2.querySelector("small").textContent = s ? valueOf(h2, s, { entity: id }) : "nicht gefunden";
            });
          });
          box.append(sec);
        }
      }
      this._xu.forEach((u) => u(h));
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
      const el2 = document.createElement("div");
      el2.className = "al error";
      el2.innerHTML = `<ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>${esc(msg)}</span>`;
      this._e.als.prepend(el2);
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
      const vis3 = !!this._inView && !document.hidden && !this._quiet && this.isConnected;
      this._e?.g.classList.toggle("still", !vis3);
      const run = vis3 && this._e && ["print", "prep", "heat"].includes(this._prev);
      if (run && !this._tm) this._tm = setInterval(() => this._update(), 6e4);
      if (!run && this._tm) {
        clearInterval(this._tm);
        this._tm = null;
      }
      const cam = vis3 && this._e && this._camLive;
      if (cam && !this._ct) this._ct = setInterval(() => {
        this._camT = Date.now();
        this._cam(this._prev);
      }, 1e4);
      if (!cam && this._ct) {
        clearInterval(this._ct);
        this._ct = null;
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
  var PCAM = [{ name: "camera", selector: { entity: { domain: ["camera", "image"] } } }, sel("camera_mode", [["always", "Kamera immer"], ["printing", "Kamera nur beim Drucken"]])];
  var PXTRA = [{ name: "fans", selector: { entity: { domain: "fan", multiple: true } } }, { name: "switches", selector: { entity: { multiple: true } } }];
  var PSHOW = [
    g2(...["progress", "remaining"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} } }))),
    g2(...["end_time", "layer"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} } }))),
    g2(...["nozzle", "bed"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} } }))),
    g2(...["file", "stage"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} } }))),
    g2(...["message", "ams_list"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} } }))),
    g2(...["controls", "light"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} } }))),
    g2(...["fans", "switches"].map((k) => ({ name: `show_${k}`, selector: { boolean: {} } }))),
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
    show_fans: "Lüfter",
    show_switches: "Schalter",
    camera: "Kamera",
    camera_mode: "Kamerabild zeigen",
    fans: "Lüfter (Regler)",
    switches: "Weitere Schalter und Werte",
    ...Object.fromEntries(MKEYS.map((k) => [`msg_${k}`, MSG[k].label]))
  };
  var PHELPERS = {
    device: "Füllt alle Entitäten unten automatisch aus. Leere Felder sucht die Karte selbst am Gerät",
    stage: "Steuert die Animationen der Druckphasen (Leveln, Wischen, Kalibrieren …)",
    ams_trays: "Leer = alle AMS-Einheiten am Drucker automatisch. Bis zu 4 Slots pro Einheit",
    ams: "Ohne AMS zeigt die Zeichnung die Spule am Drucker (externe Spule)",
    external_spool: "Leer = automatisch",
    camera: "Kamera- oder Bild-Entität. Das Bild steht unter der Zeichnung, antippen öffnet es groß. Nicht verfügbar = ausgeblendet",
    fans: "Leer = alle Lüfter des Druckers automatisch",
    switches: "Z. B. Kamera, Zeitraffer oder WLAN-Signal. Schalter lassen sich antippen, andere Werte öffnen die Details",
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
      const strip2 = (c) => {
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
          [...EKEYS, "fans", "camera"].forEach((k) => delete c[k]);
          Object.assign(c, detect(this._hass, v.device));
          c = strip2(c);
          this._emit(c);
          this._rebuild();
          return;
        }
        this._emit(strip2(c));
      });
      const step = (k, list2, dir) => {
        const cur2 = this._config[k] || "", i = list2.indexOf(cur2), n = list2[(i + dir + list2.length) % list2.length];
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
        this._section("cam", "mdi:cctv", "Kamera", (b) => b.append(form(PCAM))),
        this._section("xtra", "mdi:fan", "Lüfter und Schalter", (b) => b.append(form(PXTRA))),
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

  // src/remote.js
  var RCSS = `
.g.rc{gap:14px;align-items:stretch}
.rc .ic img{border-radius:6px}
.hb.on{background:var(--nv-accent);color:var(--nv-accent-fg)}
.cb{width:46px;height:46px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);transition:background-color .15s,transform .15s}
.cb ha-icon{--mdc-icon-size:22px}
.cb:active,.cb.hit{transform:scale(.9);background:color-mix(in srgb,var(--nv-active) 40%,var(--nv-chip))}
.row3{display:flex;justify-content:space-around;align-items:center;gap:10px}
.pad{position:relative;width:min(230px,72cqw);aspect-ratio:1;margin:2px auto;border-radius:50%;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);box-shadow:inset 0 1px 0 rgba(255,255,255,.1),0 6px 18px rgba(0,0,0,.18)}
.pad .k{position:absolute;width:32%;height:32%;display:flex;align-items:center;justify-content:center;border-radius:50%;transition:background-color .15s,transform .15s}
.pad .k ha-icon{--mdc-icon-size:30px;opacity:.85}
.pad .k:active,.pad .k.hit{background:rgba(255,255,255,.12)}
.pad .up{top:2%;left:34%}.pad .down{bottom:2%;left:34%}.pad .left{left:2%;top:34%}.pad .right{right:2%;top:34%}
.pad .ok{left:29%;top:29%;width:42%;height:42%;background:var(--nv-accent);color:var(--nv-accent-fg);font-weight:700;font-size:15px;letter-spacing:.04em;box-shadow:0 0 18px color-mix(in srgb,var(--nv-accent) 45%,transparent)}
.pad .ok:active,.pad .ok.hit{transform:scale(.93);background:var(--nv-accent)}
.tp{position:relative;height:min(230px,62cqw);border-radius:22px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);touch-action:none;display:flex;align-items:center;justify-content:center;cursor:pointer;user-select:none;-webkit-user-select:none;overflow:hidden}
.tp>ha-icon{--mdc-icon-size:42px;opacity:.25;transition:opacity .2s,transform .2s}
.tp.hit>ha-icon{opacity:.6;transform:scale(1.15)}
.tp .ok{position:absolute;inset:0;background:radial-gradient(circle,color-mix(in srgb,var(--nv-accent) 35%,transparent),transparent 60%);opacity:0;transition:opacity .25s;pointer-events:none}
.tp.ok-hit .ok{opacity:1}
.apps .pill.on{background:var(--nv-accent);color:var(--nv-accent-fg);border-color:transparent;box-shadow:0 0 14px color-mix(in srgb,var(--nv-accent) 45%,transparent)}
.rc.off .pad,.rc.off .tp{opacity:.55}
.vol{display:flex;align-items:center;gap:12px}
.vol input{flex:1;height:30px;border-radius:15px;touch-action:none}
.vol input::-webkit-slider-thumb{width:30px;height:30px}.vol input::-moz-range-thumb{width:30px;height:30px}
.vol .v{min-width:40px;text-align:right;font-size:13px;font-weight:600;font-variant-numeric:tabular-nums}
.vol .cb.on{background:var(--nv-error);color:#fff}
.vs{position:relative;height:64px;border-radius:20px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);touch-action:none;display:flex;align-items:center;justify-content:space-between;padding:0 18px;cursor:pointer;user-select:none;-webkit-user-select:none;overflow:hidden}
.vs ha-icon{--mdc-icon-size:24px;opacity:.6;transition:opacity .15s,transform .15s}
.vs .mid{display:flex;flex-direction:column;align-items:center;gap:2px;font-size:12px;opacity:.7}
.vs .mid b{font-size:15px;font-variant-numeric:tabular-nums}
.vs.up .pl,.vs.down .mi{opacity:1;transform:scale(1.25)}
.vs.muted .mid{color:var(--nv-error);opacity:1}
@container (max-width:280px){.cb{width:40px;height:40px}}`;
  var KEYS = ["up", "down", "left", "right", "ok", "back", "home", "menu", "play_pause", "rewind", "forward", "vol_down", "mute", "vol_up", "ch_down", "input", "ch_up", "power"];
  var KEYLABELS = {
    up: "Hoch",
    down: "Runter",
    left: "Links",
    right: "Rechts",
    ok: "OK",
    back: "Zurück",
    home: "Home",
    menu: "Menü",
    play_pause: "Play/Pause",
    rewind: "Zurückspulen",
    forward: "Vorspulen",
    vol_down: "Leiser",
    mute: "Stumm",
    vol_up: "Lauter",
    ch_down: "Kanal runter",
    input: "Eingang",
    ch_up: "Kanal hoch",
    power: "Ein/Aus"
  };
  var KEYICONS = {
    up: "mdi:chevron-up",
    down: "mdi:chevron-down",
    left: "mdi:chevron-left",
    right: "mdi:chevron-right",
    back: "mdi:arrow-left",
    home: "mdi:home-outline",
    menu: "mdi:menu",
    play_pause: "mdi:play-pause",
    rewind: "mdi:rewind",
    forward: "mdi:fast-forward",
    vol_down: "mdi:volume-minus",
    mute: "mdi:volume-off",
    vol_up: "mdi:volume-plus",
    ch_down: "mdi:minus",
    input: "mdi:import",
    ch_up: "mdi:plus"
  };
  var REPEAT = /* @__PURE__ */ new Set(["up", "down", "left", "right", "vol_down", "vol_up", "ch_down", "ch_up", "rewind", "forward"]);
  var KEYMAPS = {
    androidtv_remote: {
      up: "DPAD_UP",
      down: "DPAD_DOWN",
      left: "DPAD_LEFT",
      right: "DPAD_RIGHT",
      ok: "DPAD_CENTER",
      back: "BACK",
      home: "HOME",
      menu: "MENU",
      play_pause: "MEDIA_PLAY_PAUSE",
      rewind: "MEDIA_REWIND",
      forward: "MEDIA_FAST_FORWARD",
      vol_up: "VOLUME_UP",
      vol_down: "VOLUME_DOWN",
      mute: "VOLUME_MUTE",
      ch_up: "CHANNEL_UP",
      ch_down: "CHANNEL_DOWN",
      input: "TV_INPUT"
    },
    androidtv: {
      up: "UP",
      down: "DOWN",
      left: "LEFT",
      right: "RIGHT",
      ok: "CENTER",
      back: "BACK",
      home: "HOME",
      menu: "MENU",
      play_pause: "input keyevent 85",
      rewind: "input keyevent 89",
      forward: "input keyevent 90",
      vol_up: "input keyevent 24",
      vol_down: "input keyevent 25",
      mute: "input keyevent 164",
      ch_up: "input keyevent 166",
      ch_down: "input keyevent 167",
      input: "input keyevent 178"
    },
    philips_js: {
      up: "CursorUp",
      down: "CursorDown",
      left: "CursorLeft",
      right: "CursorRight",
      ok: "Confirm",
      back: "Back",
      home: "Home",
      menu: "Options",
      play_pause: "Pause|Play",
      rewind: "Rewind",
      forward: "FastForward",
      vol_up: "VolumeUp",
      vol_down: "VolumeDown",
      mute: "Mute",
      ch_up: "ChannelStepUp",
      ch_down: "ChannelStepDown",
      input: "Source"
    },
    apple_tv: {
      up: "up",
      down: "down",
      left: "left",
      right: "right",
      ok: "select",
      back: "menu",
      home: "home",
      menu: "top_menu",
      play_pause: "play_pause",
      rewind: "skip_backward",
      forward: "skip_forward",
      vol_up: "volume_up",
      vol_down: "volume_down"
    },
    roku: {
      up: "up",
      down: "down",
      left: "left",
      right: "right",
      ok: "select",
      back: "back",
      home: "home",
      menu: "info",
      play_pause: "play",
      rewind: "reverse",
      forward: "forward",
      vol_up: "volume_up",
      vol_down: "volume_down",
      mute: "volume_mute",
      ch_up: "channel_up",
      ch_down: "channel_down"
    },
    samsungtv: {
      up: "KEY_UP",
      down: "KEY_DOWN",
      left: "KEY_LEFT",
      right: "KEY_RIGHT",
      ok: "KEY_ENTER",
      back: "KEY_RETURN",
      home: "KEY_HOME",
      menu: "KEY_MENU",
      play_pause: "KEY_PLAY",
      rewind: "KEY_REWIND",
      forward: "KEY_FF",
      vol_up: "KEY_VOLUP",
      vol_down: "KEY_VOLDOWN",
      mute: "KEY_MUTE",
      ch_up: "KEY_CHUP",
      ch_down: "KEY_CHDOWN",
      input: "KEY_SOURCE"
    }
  };
  var PLATFORMS = [
    ["androidtv_remote", "Android TV / Google TV (Android TV Remote)"],
    ["androidtv", "Fire TV / Android TV (ADB)"],
    ["philips_js", "Philips TV"],
    ["apple_tv", "Apple TV"],
    ["roku", "Roku"],
    ["samsungtv", "Samsung TV"]
  ];
  var APPS = {
    netflix: ["Netflix", "mdi:netflix", "com.netflix.ninja", "https://www.netflix.com/title"],
    youtube: ["YouTube", "mdi:youtube", "com.google.android.youtube.tv", "https://www.youtube.com"],
    prime: ["Prime Video", "mdi:filmstrip-box-multiple", "com.amazon.amazonvideo.livingroom", "https://app.primevideo.com"],
    disney: ["Disney+", "mdi:castle", "com.disney.disneyplus", "https://www.disneyplus.com"],
    appletv: ["Apple TV", "mdi:apple", "com.apple.atve.androidtv.appletv", "https://tv.apple.com"],
    spotify: ["Spotify", "mdi:spotify", "com.spotify.tv.android", "spotify://"],
    ytmusic: ["YouTube Music", "mdi:music-circle", "com.google.android.youtube.tvmusic", "https://music.youtube.com"],
    plex: ["Plex", "mdi:plex", "com.plexapp.android", "plex://"],
    kodi: ["Kodi", "mdi:kodi", "org.xbmc.kodi"],
    twitch: ["Twitch", "mdi:twitch", "tv.twitch.android.app", "twitch://home"],
    dazn: ["DAZN", "mdi:soccer", "com.dazn", "https://www.dazn.com"],
    playstore: ["Play Store", "mdi:google-play", "com.android.vending"],
    settings: ["Einstellungen", "mdi:cog-outline", "com.android.tv.settings"]
  };
  var appOf = (a) => {
    const p = APPS[a.preset] || [];
    return { ...a, name: a.name ?? p[0], icon: a.icon || p[1] || "mdi:application-outline", pkg: a.package || p[2], link: p[3] };
  };
  var isApp = (a, cur2) => same(a.app, cur2) || same(a.pkg, cur2) || same(a.name, cur2);
  var RDEF = { layout: "dpad", show_power: true, show_nav: true, show_media: true, show_volume: true, volume_mode: "buttons", show_channels: false };
  var platformOf = (h, c) => c.platform && c.platform !== "auto" ? c.platform : h?.entities?.[c.entity]?.platform in KEYMAPS ? h.entities[c.entity].platform : dom(c.entity) === "media_player" ? "androidtv" : "androidtv_remote";
  var playerOf = (h, c) => {
    if (c.media_player) return c.media_player;
    if (dom(c.entity) === "media_player") return c.entity;
    const dev = h?.entities?.[c.entity]?.device_id;
    return dev && Object.values(h.entities).find((e) => e.device_id === dev && dom(e.entity_id) === "media_player" && h.states[e.entity_id])?.entity_id || null;
  };
  var volOf = (h, c, mp) => [c.volume_entity, mp].find((id) => id && h?.states[id]?.attributes.supported_features & 4) || null;
  var currentApp = (h, c, mp) => {
    const r = h.states[c.entity]?.attributes || {}, m = mp && h.states[mp]?.attributes || {};
    return r.current_activity || m.app_id || m.app_name || m.source || null;
  };
  var same = (a, b) => !!a && !!b && String(a).toLowerCase() === String(b).toLowerCase();
  var NovaRemoteCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("remote-card-editor"));
    }
    static getStubConfig(h) {
      const ids = Object.keys(h.states).filter((i) => dom(i) === "remote");
      const id = ids.find((i) => h.entities?.[i]?.platform === "androidtv_remote" && h.states[i].state === "on") || ids.find((i) => h.entities?.[i]?.platform === "androidtv_remote") || ids[0] || Object.keys(h.states).find((i) => h.entities?.[i]?.platform === "androidtv") || "remote.";
      return { entity: id, apps: [{ preset: "netflix" }, { preset: "youtube" }, { preset: "prime" }, { preset: "disney" }] };
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      if (!["remote", "media_player"].includes(dom(c.entity))) throw new Error("entity muss eine remote.* oder media_player.* Entität sein");
      this._c = { ...RDEF, ...c };
      this._ids = entityIds(this._c);
      this._built = false;
      if (this._h) {
        this._build();
        this._update();
      }
    }
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._built || old?.entities !== h.entities && (platformOf(h, this._c) !== this._plat || playerOf(h, this._c) !== this._mp) || this._c.volume_mode === "slider" && !this._vp && volOf(h, this._c, this._mp)) this._build();
      else if (!hassChanged(old, h, [...this._ids, this._mp].filter(Boolean))) return;
      this._update();
    }
    getCardSize() {
      return 7;
    }
    getGridOptions() {
      return { columns: 6, rows: "auto", min_columns: 4 };
    }
    disconnectedCallback() {
      this._stops?.forEach((f) => f());
    }
    _build() {
      this._built = true;
      this._stops?.forEach((f) => f());
      const c = this._c, r = this.shadowRoot || this.attachShadow({ mode: "open" });
      this._plat = platformOf(this._h, c);
      this._mp = playerOf(this._h, c);
      this._stops = /* @__PURE__ */ new Set();
      this._vp = c.volume_mode === "slider" ? volOf(this._h, c, this._mp) : null;
      this._vi = c.volume_entity || this._mp;
      const k = (id) => this._has(id) ? `<div class="cb" data-k="${id}" title="${KEYLABELS[id]}"><ha-icon icon="${KEYICONS[id]}"></ha-icon></div>` : "";
      const row = (ids) => {
        const h = ids.map(k).join("");
        return h ? `<div class="row3">${h}</div>` : "";
      };
      const pad = c.layout === "touchpad" ? '<div class="tp" title="Wischen = Richtung, Tippen = OK"><span class="ok"></span><ha-icon icon="mdi:gesture-swipe"></ha-icon></div>' : `<div class="pad">${["up", "left", "right", "down"].map((x) => `<div class="k ${x}" data-k="${x}" title="${KEYLABELS[x]}"><ha-icon icon="${KEYICONS[x]}"></ha-icon></div>`).join("")}<div class="k ok" data-k="ok" title="OK">OK</div></div>`;
      this._apps = [].concat(c.apps || []).map(appOf);
      const btns = [].concat(c.buttons || []);
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${RCSS}</style><div class="g rc">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${c.show_power !== false ? '<div class="hb pw" title="Ein/Aus"><ha-icon icon="mdi:power"></ha-icon></div>' : ""}</div>
${pad}
${c.show_nav !== false ? row(["back", "home", "menu"]) : ""}
${c.show_media !== false ? row(["rewind", "play_pause", "forward"]) : ""}
${c.show_volume === false ? "" : c.volume_mode === "swipe" ? '<div class="vs" title="Wischen: rechts/oben lauter, links/unten leiser · Tippen: stumm"><ha-icon class="mi" icon="mdi:volume-minus"></ha-icon><div class="mid"><b></b><span>Lautstärke</span></div><ha-icon class="pl" icon="mdi:volume-plus"></ha-icon></div>' : this._vp ? `<div class="vol">${k("mute")}<input type="range" min="0" max="100" step="1" aria-label="Lautstärke"><span class="v"></span></div>` : row(["vol_down", "mute", "vol_up"])}
${c.show_channels ? row(["ch_down", "input", "ch_up"]) : ""}
${btns.length ? '<div class="pills grid btns"></div>' : ""}
${this._apps.length ? '<div class="pills grid apps"></div>' : ""}</div>`;
      const q = (s) => r.querySelector(s);
      this._e = { g: q(".g"), ic: q(".hd .ic"), name: q(".hd b"), sub: q(".hd small"), pw: q(".pw") };
      press(this._e.ic, { tap: () => runAction(this, { entity: c.entity, tap_action: c.tap_action }, "tap", true), hold: () => runAction(this, { entity: c.entity, hold_action: c.hold_action }, "hold") });
      if (this._e.pw) press(this._e.pw, { tap: () => this._key("power") });
      r.querySelectorAll("[data-k]").forEach((el2) => this._rep(el2, el2.dataset.k));
      const vol = q(".vol input");
      if (vol) {
        const show = () => {
          vol.style.setProperty("--p", `${vol.value}%`);
          q(".vol .v").textContent = `${vol.value} %`;
        };
        vol.addEventListener("pointerdown", () => {
          this._drag = true;
        });
        vol.addEventListener("input", () => {
          this._drag = true;
          show();
        });
        vol.addEventListener("change", () => {
          this._drag = false;
          show();
          this._h.callService("media_player", "volume_set", { entity_id: this._vp, volume_level: +vol.value / 100 });
        });
        this._e.vol = vol;
        this._e.vv = q(".vol .v");
        this._e.mu = q(".vol [data-k=mute]");
      }
      const vs = q(".vs");
      if (vs) this._swipeVol(vs);
      const tp = q(".tp");
      if (tp) this._touch(tp);
      const pill = (o, fn) => {
        const el2 = document.createElement("div");
        el2.className = "pill";
        el2.innerHTML = '<span class="i"></span><span class="t"></span>';
        setIcon(el2.firstChild, o.icon || "mdi:gesture-tap-button");
        el2.lastChild.textContent = o.name ?? "";
        press(el2, { tap: fn });
        return el2;
      };
      q(".btns")?.append(...btns.map((b) => pill(b, () => this._button(b))));
      this._pills = this._apps.map((a) => pill(a, () => this._launch(a)));
      q(".apps")?.append(...this._pills);
    }
    // Befehl einer Taste: eigene Belegung vor Standard der Integration
    _cmd(k) {
      return this._c.keys?.[k] || KEYMAPS[this._plat]?.[k];
    }
    _has(k) {
      return !!this._cmd(k) || this._c.volume_entity && ["vol_up", "vol_down", "mute"].includes(k);
    }
    // Taste sofort beim Drücken senden, beim Festhalten wiederholen
    _rep(el2, k) {
      let t, iv;
      const stop = () => {
        clearTimeout(t);
        clearInterval(iv);
        t = iv = null;
        el2.classList.remove("hit");
      };
      this._stops.add(stop);
      el2.tabIndex = 0;
      el2.setAttribute("role", "button");
      el2.classList.add("tap");
      el2.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        stop();
        el2.classList.add("hit");
        this._key(k);
        if (REPEAT.has(k)) t = setTimeout(() => {
          iv = setInterval(() => this._key(k, true), 160);
        }, 450);
      });
      ["pointerup", "pointerleave", "pointercancel"].forEach((x) => el2.addEventListener(x, stop));
      el2.addEventListener("contextmenu", (e) => e.preventDefault());
      el2.addEventListener("keydown", (e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          this._key(k);
        }
      });
    }
    // Touchpad: Wischen = Richtung (alle 40 px ein Schritt), Tippen = OK
    _touch(tp) {
      let sx = null, sy, moved, ft;
      const flash = (cls) => {
        tp.classList.add(cls);
        clearTimeout(ft);
        ft = setTimeout(() => tp.classList.remove("hit", "ok-hit"), 180);
      };
      this._stops.add(() => clearTimeout(ft));
      tp.tabIndex = 0;
      tp.addEventListener("pointerdown", (e) => {
        sx = e.clientX;
        sy = e.clientY;
        moved = false;
        tp.setPointerCapture?.(e.pointerId);
      });
      tp.addEventListener("pointermove", (e) => {
        if (sx == null) return;
        const dx = e.clientX - sx, dy = e.clientY - sy;
        if (Math.hypot(dx, dy) < 40) return;
        this._key(Math.abs(dx) > Math.abs(dy) ? dx > 0 ? "right" : "left" : dy > 0 ? "down" : "up");
        flash("hit");
        sx = e.clientX;
        sy = e.clientY;
        moved = true;
      });
      tp.addEventListener("pointerup", () => {
        if (sx != null && !moved) {
          this._key("ok");
          flash("ok-hit");
        }
        sx = null;
      });
      tp.addEventListener("pointercancel", () => {
        sx = null;
      });
      tp.addEventListener("keydown", (e) => {
        const k = { ArrowUp: "up", ArrowDown: "down", ArrowLeft: "left", ArrowRight: "right", Enter: "ok", " ": "ok" }[e.key];
        if (k) {
          e.preventDefault();
          this._key(k);
        }
      });
    }
    // Wischfläche Lautstärke: alle 22 px ein Schritt (rechts/oben lauter), Tippen = stumm
    _swipeVol(el2) {
      let sx = null, sy, moved, ft;
      this._stops.add(() => clearTimeout(ft));
      this._e.vs = el2;
      this._e.vsv = el2.querySelector(".mid b");
      el2.tabIndex = 0;
      el2.addEventListener("pointerdown", (e) => {
        sx = e.clientX;
        sy = e.clientY;
        moved = false;
        el2.setPointerCapture?.(e.pointerId);
      });
      el2.addEventListener("pointermove", (e) => {
        if (sx == null) return;
        const d = e.clientX - sx - (e.clientY - sy);
        if (Math.abs(d) < 22) return;
        const up = d > 0;
        this._key(up ? "vol_up" : "vol_down", moved);
        el2.classList.remove("up", "down");
        el2.classList.add(up ? "up" : "down");
        clearTimeout(ft);
        ft = setTimeout(() => el2.classList.remove("up", "down"), 200);
        sx = e.clientX;
        sy = e.clientY;
        moved = true;
      });
      el2.addEventListener("pointerup", () => {
        if (sx != null && !moved) this._key("mute");
        sx = null;
      });
      el2.addEventListener("pointercancel", () => {
        sx = null;
      });
      el2.addEventListener("contextmenu", (e) => e.preventDefault());
      el2.addEventListener("keydown", (e) => {
        const k = { ArrowUp: "vol_up", ArrowRight: "vol_up", ArrowDown: "vol_down", ArrowLeft: "vol_down", Enter: "mute", " ": "mute" }[e.key];
        if (k) {
          e.preventDefault();
          this._key(k);
        }
      });
    }
    _send(cmd) {
      const c = this._c, cmds = list(cmd);
      if (!cmds.length) return;
      if (this._plat === "androidtv" && dom(c.entity) === "media_player") cmds.forEach((x) => this._h.callService("androidtv", "adb_command", { entity_id: c.entity, command: x }));
      else this._h.callService("remote", "send_command", { entity_id: c.entity, command: cmds });
    }
    _key(k, quiet) {
      const c = this._c, h = this._h;
      if (!h) return;
      if (!quiet) fire(this, "haptic", "light");
      if (k === "power" && !c.keys?.power) {
        const s = h.states[c.entity], on = s && !["off", "standby", "unavailable", "unknown"].includes(s.state);
        return h.callService(dom(c.entity), on ? "turn_off" : "turn_on", { entity_id: c.entity });
      }
      const v = c.volume_entity;
      if (v && !c.keys?.[k] && ["vol_up", "vol_down", "mute"].includes(k)) {
        return k === "mute" ? h.callService("media_player", "volume_mute", { entity_id: v, is_volume_muted: !h.states[v]?.attributes.is_volume_muted }) : h.callService("media_player", k === "vol_up" ? "volume_up" : "volume_down", { entity_id: v });
      }
      this._send(this._alt(k, this._cmd(k)));
    }
    // „A|B“: abwechselnd A und B senden (z. B. Philips kennt kein PlayPause, nur Pause und Play)
    _alt(k, cmd) {
      const p = String(cmd || "").split("|");
      if (p.length < 2) return cmd;
      const alt = this._altIdx ||= {}, i = alt[k] || 0;
      alt[k] = (i + 1) % p.length;
      return p[i].trim();
    }
    _button(b) {
      fire(this, "haptic", "light");
      if (b.tap_action?.action && b.tap_action.action !== "default") return runAction(this, { tap_action: b.tap_action }, "tap");
      this._send(this._alt(`b:${b.name}:${b.command}`, b.command));
    }
    // App öffnen: Android TV Remote über Paketname/Deep-Link, sonst über die Quelle des Players
    _launch(a) {
      const c = this._c, h = this._h;
      fire(this, "haptic", "light");
      if (a.tap_action?.action && a.tap_action.action !== "default") return runAction(this, { tap_action: a.tap_action }, "tap");
      if (dom(c.entity) === "remote" && (this._plat === "androidtv_remote" || !this._mp)) {
        const id2 = a.app || a.link || a.pkg;
        return id2 && h.callService("remote", "turn_on", { entity_id: c.entity, activity: id2 });
      }
      const id = a.app || (this._plat === "androidtv" ? a.pkg : null) || a.name;
      if (id) h.callService("media_player", "select_source", { entity_id: this._mp || c.entity, source: id });
    }
    _update() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !e) return;
      const s = h.states[c.entity], m = this._mp && h.states[this._mp];
      const na = !s || s.state === "unavailable";
      const off2 = na || ["off", "standby"].includes(s.state) || m && ["off", "standby"].includes(m.state);
      this.classList.toggle("nv-na", na);
      e.g.classList.toggle("na", na);
      e.g.classList.toggle("off", !!off2);
      const cur2 = currentApp(h, c, this._mp), hit = this._apps.find((a) => isApp(a, cur2) || same(a.name, m?.attributes.app_name));
      e.name.textContent = c.name ?? s?.attributes.friendly_name ?? m?.attributes.friendly_name ?? c.entity;
      e.sub.textContent = !s ? "nicht gefunden" : off2 ? fmtState(h, m && !na ? m : s) : hit?.name || m?.attributes.app_name || cur2 || fmtState(h, s);
      setIcon(e.ic, c.icon || !off2 && hit?.icon || (m?.attributes.device_class === "tv" ? "mdi:television" : "mdi:remote-tv"));
      e.ic.parentElement.classList.toggle("on", !off2);
      e.pw?.classList.toggle("on", !off2);
      this._pills.forEach((el2, i) => el2.classList.toggle("on", !off2 && this._apps[i] === hit));
      if (e.vs) {
        const a = this._vi && h.states[this._vi]?.attributes || {};
        e.vsv.textContent = a.volume_level != null ? `${Math.round(a.volume_level * 100)} %` : "";
        e.vs.classList.toggle("muted", !!a.is_volume_muted);
      }
      const va = this._vp && h.states[this._vp]?.attributes;
      if (e.vol && va) {
        if (!this._drag && va.volume_level != null) {
          const v = Math.round(va.volume_level * 100);
          e.vol.value = v;
          e.vol.style.setProperty("--p", `${v}%`);
          e.vv.textContent = `${v} %`;
        }
        e.mu?.classList.toggle("on", !!va.is_volume_muted);
      }
    }
  };
  define("remote-card", NovaRemoteCard, { name: "Nova Fernbedienung", description: "Fernbedienung für Fernseher und Streaming-Boxen (Android TV/Google TV, Fire TV, Philips, Apple TV, Roku, Samsung): Steuerkreuz oder Touchpad, Medien, Lautstärke und Apps.", documentationURL: docUrl("nova-fernbedienung") });
  var RGEN = [
    { name: "entity", required: true, selector: { entity: { domain: ["remote", "media_player"] } } },
    g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } }),
    g2(sel("platform", [["auto", "Automatisch"], ...PLATFORMS]), { name: "media_player", selector: { entity: { domain: "media_player" } } })
  ];
  var RCTRL = [
    sel("layout", [["dpad", "Steuerkreuz"], ["touchpad", "Touchpad (wischen)"]]),
    g2({ name: "show_power", selector: { boolean: {} } }, { name: "show_nav", selector: { boolean: {} } }),
    g2({ name: "show_media", selector: { boolean: {} } }, { name: "show_volume", selector: { boolean: {} } }),
    sel("volume_mode", [["buttons", "Tasten (− / +)"], ["swipe", "Wischen (in Schritten)"], ["slider", "Schieberegler"]]),
    { name: "show_channels", selector: { boolean: {} } },
    { name: "volume_entity", selector: { entity: { domain: "media_player" } } }
  ];
  var RACT = [g2({ name: "tap_action", selector: A }, { name: "hold_action", selector: A })];
  var RAPP = [
    sel("preset", [["", "Eigene App"], ...Object.entries(APPS).map(([k, [n]]) => [k, n])]),
    g2({ name: "name", selector: T }, { name: "icon", selector: I }),
    { name: "app", selector: T },
    { name: "package", selector: T },
    { name: "tap_action", selector: A }
  ];
  var RBTN = [g2({ name: "name", selector: T }, { name: "icon", selector: I }), { name: "command", selector: T }, { name: "tap_action", selector: A }];
  var RKEYS = [g2(...KEYS.map((k) => ({ name: k, selector: T })))];
  var RLABELS = {
    ...BASE_LABELS,
    ...KEYLABELS,
    entity: "Fernbedienung (remote.* oder ADB-Player)",
    platform: "Gerätetyp",
    media_player: "Media-Player (optional)",
    layout: "Bedienfeld",
    show_power: "Ein/Aus-Button",
    show_nav: "Zurück / Home / Menü",
    show_media: "Medientasten",
    show_volume: "Lautstärke",
    volume_mode: "Lautstärke als",
    show_channels: "Kanäle und Eingang",
    volume_entity: "Lautstärke über anderen Player (optional)",
    preset: "Vorlage",
    app: "App-Link oder Quelle",
    package: "Paketname",
    command: "Befehl",
    tap_action: "Aktion beim Antippen",
    hold_action: "Aktion bei langem Drücken"
  };
  var RHELPERS = {
    platform: "Bestimmt die Tastenbefehle. Automatisch = nach Integration der Entität",
    media_player: "Leer = automatisch (Player am selben Gerät). Liefert Zustand und laufende App",
    volume_mode: "Schieberegler braucht einen Player mit einstellbarer Lautstärke (hier oder unter „Lautstärke über anderen Player“), sonst bleibt es bei den Tasten",
    volume_entity: "z. B. Fernseher oder AV-Receiver, wenn die Box die Lautstärke nicht selbst regelt",
    app: "Android TV: Link, mit dem die App startet (z. B. https://www.youtube.com). Andere Geräte: Name der Quelle. Leer = aus der Vorlage",
    package: "Erkennt die laufende App (z. B. com.netflix.ninja). Ohne Link wird damit gestartet – das lehnen manche Boxen ab",
    command: "Befehl für remote.send_command, mehrere nacheinander mit Komma (z. B. DPAD_DOWN, DPAD_CENTER), abwechselnd mit | (z. B. Pause|Play)",
    tap_action: "Optional statt App bzw. Befehl, z. B. ein Skript"
  };
  var NovaRemoteCardEditor = class extends NovaEditorBase {
    _ilabel(it, j, m) {
      return `${j + 1}. ${it.name || APPS[it.preset]?.[0] || it.app || it.package || it.command || `Neu: ${m.item}`}`;
    }
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), strip2 = (c) => {
        Object.entries(RDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        if (c.platform === "auto") delete c.platform;
        return c;
      };
      const data = { ...RDEF, platform: "auto", ...c0 };
      const form = (schema) => this._form(schema, data, (v) => this._emit(strip2(merge(this._config, names(schema), v))));
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(RGEN))),
        this._section("controls", "mdi:remote-tv", "Bedienung", (b) => b.append(form(RCTRL))),
        this._section("apps", "mdi:apps", "Apps", (b) => this._appList(b)),
        this._section("buttons", "mdi:gesture-tap-button", "Eigene Tasten", (b) => this._itemList(b, "buttons", RBTN, { item: "Taste", icon: "mdi:gesture-tap-button" }, "Taste hinzufügen")),
        this._section("keys", "mdi:keyboard-outline", "Tastenbelegung", (b) => this._keys(b)),
        this._section("actions", "mdi:gesture-tap", "Aktionen", (b) => b.append(form(RACT)))
      );
    }
    _appList(b) {
      const h = this._hass, c = this._config, cur2 = h && c.entity && currentApp(h, c, playerOf(h, c));
      const apps = this._items("apps").map(appOf);
      if (cur2 && cur2.includes(".") && !apps.some((a) => isApp(a, cur2))) {
        b.append(this._hint(`Gerade läuft: ${cur2}. Startet die App danach nicht, unter „App-Link“ einen Link eintragen.`), this._add("Laufende App übernehmen", () => {
          const preset = Object.keys(APPS).find((k) => same(APPS[k][2], cur2) || same(APPS[k][0], cur2));
          const n = [...this._items("apps"), preset ? { preset } : { name: cur2.split(".").pop(), package: cur2 }];
          this._open = new Set([...this._open].filter((x) => x.startsWith("sec.")).concat(`apps.${n.length - 1}`));
          this._setItems("apps", n);
          this._rebuild();
        }));
      }
      this._itemList(b, "apps", RAPP, { item: "App", icon: "mdi:application-outline" }, "App hinzufügen", (it) => ({ preset: "", ...it }));
    }
    // Eigene Tastenbelegung: leer = Standard der Integration (steht als Hilfetext darunter)
    _keys(b) {
      const plat = platformOf(this._hass, this._config), map = KEYMAPS[plat] || {};
      b.append(this._hint("Nur ausfüllen, wenn eine Taste anders belegt sein soll. Mehrere Befehle nacheinander mit Komma, abwechselnd bei jedem Druck mit | (z. B. Pause|Play)."));
      const f = this._form(RKEYS, { ...this._config.keys }, (v) => {
        const keys = Object.fromEntries(KEYS.filter((k) => v[k]).map((k) => [k, v[k]])), c = { ...this._config };
        if (Object.keys(keys).length) c.keys = keys;
        else delete c.keys;
        this._emit(c);
      });
      f.computeHelper = (s) => s.name === "power" ? "Standard: Ein/Aus der Entität" : `Standard: ${map[s.name] || "– (ausgeblendet)"}`;
      b.append(f);
    }
  };
  __publicField(NovaRemoteCardEditor, "labels", RLABELS);
  __publicField(NovaRemoteCardEditor, "helpers", RHELPERS);
  __publicField(NovaRemoteCardEditor, "openSections", ["general"]);
  define("remote-card-editor", NovaRemoteCardEditor);

  // src/index.js
  console.info(`%c NOVA-CARDS %c v${"0.11.0b5"} `, "color:#3a2a00;background:#f5b83d;font-weight:700;border-radius:4px 0 0 4px", "color:#fff;background:#1b2134;border-radius:0 4px 4px 0");
})();
