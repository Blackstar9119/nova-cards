/* Nova Cards v0.11.1 DEV (nur swipe, timer, clock, modular) – Testbuild, alle Karten als custom:nova-dev-*. Nicht veröffentlichen. */
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
.pills.flat{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,var(--nova-modular-button-width,60px)),1fr));gap:6px}
.pills.flat .pill{justify-content:center;border-radius:12px;padding:6px;min-height:40px;overflow:hidden}
.pills.flat .pill .t{overflow:hidden;text-overflow:ellipsis}
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
  var inPicker = (el2) => {
    for (let n = el2, i = 0; n && i < 80; i++) {
      if (n.localName === "hui-card-picker") return true;
      n = n.parentElement || n.getRootNode?.().host;
    }
    return false;
  };
  var watchVisible = (el2, cb) => {
    let inView = !("IntersectionObserver" in window), last;
    const upd = () => {
      const v = inView && !document.hidden && el2.isConnected;
      if (v !== last) {
        last = v;
        cb(v);
      }
    };
    const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => {
      inView = es[es.length - 1].isIntersecting;
      upd();
    }, { rootMargin: "100px" }) : null;
    io?.observe(el2);
    document.addEventListener("visibilitychange", upd);
    upd();
    return () => {
      io?.disconnect();
      document.removeEventListener("visibilitychange", upd);
      if (last) {
        last = false;
        cb(false);
      }
    };
  };

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
  var SCLASS = {
    temperature: "mdi:thermometer",
    humidity: "mdi:water-percent",
    battery: "mdi:battery",
    power: "mdi:flash",
    energy: "mdi:lightning-bolt",
    illuminance: "mdi:brightness-5",
    pressure: "mdi:gauge",
    atmospheric_pressure: "mdi:gauge",
    co2: "mdi:molecule-co2",
    carbon_dioxide: "mdi:molecule-co2",
    pm25: "mdi:blur",
    pm10: "mdi:blur",
    voltage: "mdi:sine-wave",
    current: "mdi:current-ac",
    duration: "mdi:timer-outline",
    timestamp: "mdi:clock-outline",
    date: "mdi:calendar",
    moisture: "mdi:water",
    precipitation: "mdi:weather-rainy",
    wind_speed: "mdi:weather-windy",
    gas: "mdi:meter-gas",
    water: "mdi:water",
    signal_strength: "mdi:wifi",
    volatile_organic_compounds: "mdi:air-filter",
    speed: "mdi:speedometer",
    weight: "mdi:weight"
  };
  var BCLASS = {
    window: ["mdi:window-closed", "mdi:window-open"],
    door: ["mdi:door-closed", "mdi:door-open"],
    garage_door: ["mdi:garage", "mdi:garage-open"],
    opening: ["mdi:square-outline", "mdi:square-rounded-outline"],
    motion: ["mdi:motion-sensor-off", "mdi:motion-sensor"],
    occupancy: ["mdi:home-outline", "mdi:home"],
    presence: ["mdi:home-outline", "mdi:home"],
    moisture: ["mdi:water-off", "mdi:water"],
    smoke: ["mdi:smoke-detector", "mdi:smoke-detector-alert"],
    battery: ["mdi:battery", "mdi:battery-outline"],
    problem: ["mdi:check-circle-outline", "mdi:alert-circle"],
    connectivity: ["mdi:close-network-outline", "mdi:check-network-outline"],
    power: ["mdi:power-plug-off", "mdi:power-plug"],
    plug: ["mdi:power-plug-off", "mdi:power-plug"],
    running: ["mdi:stop", "mdi:play"],
    lock: ["mdi:lock", "mdi:lock-open"]
  };
  var classIcon = (s, id) => {
    const dc = s?.attributes.device_class, d = dom(id);
    if (!dc) return null;
    if (d === "binary_sensor") return BCLASS[dc]?.[s.state === "on" ? 1 : 0] || null;
    return d === "sensor" || d === "number" || d === "input_number" ? SCLASS[dc] || null : null;
  };
  var iconOf = (h, o, fb) => {
    const s = h.states[o.entity];
    return o.icon || s?.attributes.icon || classIcon(s, o.entity) || DICON[dom(o.entity)] || fb;
  };
  var langOf = (h) => h.locale?.language || h.language || "de";
  var tzOf = (h) => h.locale?.time_zone === "server" ? h.config?.time_zone : void 0;
  var DUR_U = { ms: 1e-3, s: 1, min: 60, h: 3600, d: 86400 };
  var clockOf = (sec) => {
    const t = Math.max(0, Math.round(sec)), hh = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), ss = String(t % 60).padStart(2, "0");
    return hh ? `${hh}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
  };
  var idleState = (s) => !s || ["off", "unavailable", "unknown", ""].includes(s.state) || NUMRE.test(s.state) && +s.state <= 0;
  function valueOf(h, s, o) {
    if (!s) return "–";
    if (o.format === "clock" && NUMRE.test(s.state)) return clockOf(+s.state * (DUR_U[o.unit ?? s.attributes.unit_of_measurement] ?? 1));
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
      if (hassChanged(old, h, this._ids)) this._forms.forEach((f2) => {
        f2.hass = h;
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
      const f2 = this._reuse(`form:${JSON.stringify(schema)}`, () => {
        const f3 = document.createElement("ha-form");
        f3.schema = schema;
        f3.computeLabel = (s) => this.constructor.labels?.[s.name] ?? s.name;
        f3.computeHelper = (s) => this.constructor.helpers?.[s.name];
        f3.addEventListener("value-changed", (e) => {
          e.stopPropagation();
          f3.data = e.detail.value;
          f3._dk = JSON.stringify(f3.data);
          f3._cb(e.detail.value);
        });
        return f3;
      });
      if (f2.hass !== this._hass) f2.hass = this._hass;
      const dk = JSON.stringify(data);
      if (f2._dk !== dk) {
        f2.data = data;
        f2._dk = dk;
      }
      f2._cb = cb;
      this._forms.push(f2);
      return f2;
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

  // src/swipe.js
  var DEF = { dots: true, reset_after: 0, fill: false, stack_below: 500 };
  var SCSS = `${NOVA_VARS}${GRID_CSS}
:host{display:block}
:host(.fill){height:100%}
.w{display:flex;flex-direction:column;gap:6px;min-height:0;color:var(--nv-fg);font-family:var(--ha-font-family-body,Roboto,sans-serif)}
.w.fill{height:100%}
.sc{display:flex;overflow-x:auto;overflow-y:hidden;scroll-snap-type:x mandatory;overscroll-behavior-x:contain;scrollbar-width:none;
-webkit-overflow-scrolling:touch;flex:1 1 auto;min-height:0;border-radius:var(--nv-radius)}
.sc::-webkit-scrollbar{display:none}
.sc.lock{overflow-x:hidden}
.pg{flex:0 0 100%;min-width:0;scroll-snap-align:start;scroll-snap-stop:always;display:flex;flex-direction:column;gap:12px;box-sizing:border-box}
.fill .pg{overflow-y:auto;scrollbar-width:none}.fill .pg::-webkit-scrollbar{display:none}
.fill .pg:not(.stack)>.rw{flex:1 1 auto;min-height:0;align-items:stretch}
.fill .pg:not(.stack)>.rw>.cell{display:grid;min-height:0}
.rw{gap:var(--nova-swipe-gap,8px)}
.cell>*{min-width:0}
.prev .cell.empty{min-height:72px;border:2px dashed var(--nv-box-border);border-radius:20px;display:flex;align-items:center;justify-content:center;font-size:12.5px;opacity:.7}
.prev .cell.empty::after{content:'Leerer Platz'}
.dots{display:flex;justify-content:center;align-items:center;gap:2px;flex:none;height:14px}
.dots[hidden]{display:none}
.dot{border:none;background:none;padding:4px 3px;margin:0;cursor:pointer;display:flex;-webkit-tap-highlight-color:transparent}
.dot i{display:block;width:6px;height:6px;border-radius:3px;background:var(--nv-fg);opacity:.35;transition:width .25s,opacity .25s,background-color .25s}
.dot.on i{width:16px;opacity:1;background:var(--nv-active)}
.dot:focus-visible{outline:none}.dot:focus-visible i{box-shadow:0 0 0 2px var(--nv-active)}
@media (prefers-reduced-motion:reduce){.dot i{transition:none}}`;
  var Page = class extends GridCard(Object) {
    constructor(card, rows) {
      super();
      this._card = card;
      this._rows = rows;
      this._body = document.createElement("div");
      this._body.className = "pg";
    }
    get _cfg() {
      return this._card._cfg;
    }
    get _h() {
      return this._card._h;
    }
    _handoff() {
      return this._card._prev;
    }
  };
  __publicField(Page, "gridKind", "swipe");
  var SLIDERS = /* @__PURE__ */ new Set(["HA-SLIDER", "HA-CONTROL-SLIDER", "MWC-SLIDER", "HA-SELECTOR-NUMBER"]);
  var grabsSwipe = (path) => {
    for (const n of path) {
      if (!(n instanceof Element)) continue;
      if (n.classList?.contains("sc")) return false;
      if (n.tagName === "INPUT" && n.type === "range" || n.getAttribute("role") === "slider" || SLIDERS.has(n.tagName)) return true;
      const ta = getComputedStyle(n).touchAction;
      if (ta === "none" || ta === "pan-y") return true;
    }
    return false;
  };
  var NovaSwipeCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("swipe-card-editor"));
    }
    static getStubConfig() {
      return { pages: [{ rows: [{ cells: [{ card: null }] }] }, { rows: [{ cells: [{ card: null }] }] }] };
    }
    constructor() {
      super();
      const r = this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${SCSS}</style><div class="w"><div class="sc"></div><div class="dots" role="tablist"></div></div>`;
      this._w = r.querySelector(".w");
      this._sc = r.querySelector(".sc");
      this._dots = r.querySelector(".dots");
      this._i = 0;
      this._pages = [];
      this._sc.addEventListener("scroll", () => {
        this._poke();
        if (this._raf) return;
        this._raf = requestAnimationFrame(() => {
          this._raf = 0;
          const w = this._sc.clientWidth;
          if (w) this._mark(Math.round(this._sc.scrollLeft / w));
        });
      }, { passive: true });
      const lock = (e) => {
        this._poke();
        if (!grabsSwipe(e.composedPath())) return;
        this._sc.classList.add("lock");
        const off = () => {
          this._sc.classList.remove("lock");
          ["pointerup", "pointercancel", "touchend", "touchcancel"].forEach((t) => window.removeEventListener(t, off, true));
        };
        ["pointerup", "pointercancel", "touchend", "touchcancel"].forEach((t) => window.addEventListener(t, off, true));
      };
      this._sc.addEventListener("pointerdown", lock, true);
      this._sc.addEventListener("touchstart", lock, { capture: true, passive: true });
      this._sc.addEventListener("keydown", () => this._poke());
      this._ro = new ResizeObserver(() => {
        this._pages.forEach((p) => p._stack());
        this.go(this._i, false);
      });
      this._onGoto = (e) => {
        if (this._prev) this.go(e.detail?.page ?? 0, false);
      };
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      if (c.pages != null && !Array.isArray(c.pages)) throw new Error("pages muss eine Liste von Seiten sein");
      this._cfg = { ...DEF, ...c };
      this._dirty = true;
      if (this.isConnected) this._render();
    }
    set hass(h) {
      this._h = h;
      if (!this._cfg) return;
      if (this._dirty && this.isConnected) this._render();
      this._pages.forEach((p) => p._cells().forEach((el2) => p._setHass(el2)));
    }
    getCardSize() {
      return Math.max(1, ...this._pages.map((p) => 3 * (p._rows.length || 1)));
    }
    getGridOptions() {
      return { columns: "full", rows: "auto" };
    }
    connectedCallback() {
      this._quiet = inPicker(this);
      this._detect();
      requestAnimationFrame(() => this._detect());
      this._ro.observe(this._sc);
      window.addEventListener("nova-swipe-goto", this._onGoto);
      if (this._dirty && this._cfg) this._render();
      this._poke();
    }
    disconnectedCallback() {
      this._ro.disconnect();
      window.removeEventListener("nova-swipe-goto", this._onGoto);
      clearTimeout(this._rt);
      this._rt = null;
      cancelAnimationFrame(this._raf);
      this._raf = 0;
      if (this._prev) this._pages.forEach((p) => p._handOffCells());
    }
    // Editor-Vorschau (Zellen übernehmen, Seite folgt dem Editor) bzw. Bearbeitungsmodus (leere Plätze zeigen)
    _detect() {
      let prev = false, edit = !!(this.preview || this.editMode);
      for (let n = this, i = 0; n && i < 80; i++) {
        if (PREV.has(n.tagName) || n.tagName?.includes("DIALOG")) {
          prev = true;
          break;
        }
        if (EDIT.has(n.tagName)) edit = true;
        n = n.parentElement || n.getRootNode?.().host;
      }
      this._prev = prev;
      this._w.classList.toggle("prev", prev || edit);
    }
    _render() {
      this._dirty = false;
      const c = this._cfg, list2 = Array.isArray(c.pages) && c.pages.length ? c.pages : [{ rows: [] }];
      this.classList.toggle("fill", !!c.fill);
      this._w.classList.toggle("fill", !!c.fill);
      const old = this._pages;
      if (this._prev) old.slice(list2.length).forEach((p) => p._handOffCells());
      this._pages = list2.map((pg, i) => {
        const rows = normRows(pg || {}), p = old[i] || new Page(this, rows);
        if (p._built && JSON.stringify(p._rows) === JSON.stringify(rows)) return p;
        p._rows = rows;
        p._built = true;
        p._grid();
        return p;
      });
      this._pages.forEach((p, i) => {
        p._body.setAttribute("aria-label", list2[i]?.name || `Seite ${i + 1}`);
        p._body.classList.toggle("eqh", !!c.equal_height);
      });
      this._sc.replaceChildren(...this._pages.map((p) => p._body));
      const n = this._pages.length;
      this._dots.hidden = c.dots === false || n < 2;
      this._dots.replaceChildren(...this._pages.map((_, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "dot";
        b.setAttribute("role", "tab");
        b.title = list2[i]?.name || `Seite ${i + 1}`;
        b.innerHTML = "<i></i>";
        b.addEventListener("click", () => this.go(i));
        b.addEventListener("keydown", (e) => {
          if (e.key === "ArrowRight") this.go(this._i + 1);
          if (e.key === "ArrowLeft") this.go(this._i - 1);
        });
        return b;
      }));
      this._i = Math.min(this._i, n - 1);
      this._mark(this._i, true);
      requestAnimationFrame(() => {
        this._pages.forEach((p) => p._stack());
        this.go(this._i, false);
      });
    }
    // Zu Seite i wischen (smooth = mit Animation, außer bei „Bewegung reduzieren“)
    go(i, smooth = true) {
      const n = this._pages.length;
      if (!n) return;
      i = Math.max(0, Math.min(n - 1, i));
      const w = this._sc.clientWidth;
      const calm = !smooth || matchMedia("(prefers-reduced-motion: reduce)").matches;
      if (w) this._sc.scrollTo({ left: i * w, behavior: calm ? "auto" : "smooth" });
      this._mark(i);
    }
    _mark(i, force) {
      if (i === this._i && !force) return;
      this._i = i;
      [...this._dots.children].forEach((d, k) => {
        d.classList.toggle("on", k === i);
        d.setAttribute("aria-selected", k === i);
      });
      this._pages.forEach((p, k) => p._body.setAttribute("aria-hidden", k !== i));
      this._poke();
    }
    // Nach X Sekunden ohne Bedienung zurück zur ersten Seite (ein einziger Zeitgeber, nicht in Vorschau/Kartenauswahl)
    _poke() {
      clearTimeout(this._rt);
      this._rt = null;
      const s = +this._cfg?.reset_after;
      if (!(s > 0) || this._i === 0 || this._quiet || this._prev || !this.isConnected) return;
      this._rt = setTimeout(() => {
        this._rt = null;
        this.go(0);
      }, s * 1e3);
    }
  };
  define("swipe-card", NovaSwipeCard, { name: "Nova Swipe Card", description: "Mehrere Seiten mit beliebigen Karten in einer Karte – zum Wischen, mit Seiten-Punkten. Ideal für kleine Displays.", documentationURL: docUrl("nova-swipe-card") });
  var S_PAGE = [g2({ name: "name", selector: T }, { name: "icon", selector: I })];
  var S_SWIPE = [
    g2({ name: "dots", selector: { boolean: {} } }, { name: "fill", selector: { boolean: {} } }),
    g2(
      { name: "reset_after", selector: { number: { min: 0, max: 600, step: 5, mode: "box", unit_of_measurement: "s" } } },
      { name: "stack_below", selector: { number: { min: 0, max: 1200, step: 10, mode: "box", unit_of_measurement: "px" } } }
    )
  ];
  var LABELS = {
    ...GRID_LABELS,
    name: "Name der Seite (optional)",
    icon: "Icon (optional)",
    dots: "Seiten-Punkte",
    fill: "Ganze Höhe ausfüllen",
    reset_after: "Zurück zu Seite 1 nach",
    stack_below: "Untereinander unter Breite"
  };
  var HELPERS = {
    ...GRID_HELPERS,
    name: "Nur für dich im Editor und als Hinweis an den Punkten.",
    fill: "Für Wand-Displays: Die Karte ist so hoch wie ihr Platz, die Karten einer Seite teilen sich die Höhe.",
    reset_after: "Sekunden ohne Bedienung, danach springt die Karte zur ersten Seite. 0 = aus.",
    stack_below: "Ist die Karte schmaler als dieser Wert, stehen die Karten einer Seite untereinander (0 = nie)."
  };
  var PCSS = `
.pgs{display:flex;flex-direction:column;gap:8px}
.pgb{display:flex;align-items:center;gap:6px;padding:8px 8px 8px 2px;border-radius:12px;border:1px solid var(--divider-color,#444);background:var(--secondary-background-color);cursor:pointer;user-select:none;-webkit-user-select:none;position:relative;outline:none}
.pgb:focus-visible{box-shadow:0 0 0 2px var(--primary-color)}
.pgb.sel{border-color:var(--primary-color);box-shadow:0 0 0 1px var(--primary-color)}
.pgb.lift{z-index:5;box-shadow:0 8px 24px rgba(0,0,0,.35);opacity:.92;cursor:grabbing}
.pgb.before{box-shadow:inset 0 4px 0 var(--primary-color)}.pgb.after{box-shadow:inset 0 -4px 0 var(--primary-color)}
.pgb .num{flex:none;width:26px;height:26px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px;font-weight:600;background:var(--primary-color);color:var(--text-primary-color,#fff)}
.pgb .pi{flex:none;color:var(--primary-color);display:flex}.pgb .pi:empty{display:none}`;
  var strip = (c) => {
    Object.keys(DEF).forEach((k) => {
      if (c[k] === DEF[k]) delete c[k];
    });
    return c;
  };
  var NovaSwipeCardEditor = class extends GridEditor(NovaEditorBase) {
    _list() {
      const p = this._config.pages;
      return Array.isArray(p) && p.length ? p.map((x) => ({ ...x || {} })) : [{ rows: [] }];
    }
    _cur() {
      const n = this._list().length;
      this._page = Math.max(0, Math.min(n - 1, this._page || 0));
      return this._page;
    }
    // Raster-Teil (GridEditor) arbeitet immer auf der gewählten Seite
    _rows() {
      return normRows(this._list()[this._cur()] || {});
    }
    _emitRows(rows, keep) {
      if (keep !== void 0) {
        this._sel = null;
        rows.forEach((r, ri) => r.cells.forEach((x, ci) => {
          if (x === keep) this._sel = [ri, ci];
        }));
      }
      const pages = this._list(), i = this._cur();
      pages[i] = { ...pages[i], rows: serRows(rows) };
      delete pages[i].cards;
      delete pages[i].columns;
      this._emit({ ...this._config, pages });
    }
    _setPages(pages, sel2) {
      if (sel2 != null) this._page = sel2;
      this._sel = null;
      this._emit({ ...this._config, pages });
      this._rebuild();
    }
    _show(i) {
      this._page = i;
      this._sel = null;
      window.dispatchEvent(new CustomEvent("nova-swipe-goto", { detail: { page: i } }));
      this._rebuild();
    }
    _onTemplate() {
      this._openSecs?.add("content");
    }
    _build() {
      const r = this.shadowRoot, i = this._cur(), pages = this._list();
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}${GRID_ED_CSS}${PCSS}</style><div class="wrap"></div>`;
      this._gridReset();
      const data = { ...DEF, ...this._config };
      requestAnimationFrame(() => window.dispatchEvent(new CustomEvent("nova-swipe-goto", { detail: { page: i } })));
      const label = (p, k) => p.name || `Seite ${k + 1}`;
      r.querySelector(".wrap").append(
        this._section("pages", "mdi:book-open-page-variant-outline", "Seiten", (b) => this._pagesBody(b, pages, i)),
        this._section("layout", "mdi:view-grid-outline", `Aufteilung: ${label(pages[i], i)}`, (b) => this._layoutBody(b)),
        this._section("content", "mdi:view-dashboard-edit-outline", `Karten: ${label(pages[i], i)}`, (b) => {
          b.append(this._form(S_PAGE, pages[i], (v) => {
            const ps = this._list(), k = this._cur();
            ps[k] = merge(ps[k], names(S_PAGE), v);
            this._emit({ ...this._config, pages: ps });
          }));
          this._contentBody(b);
        }),
        this._section("swipe", "mdi:gesture-swipe-horizontal", "Wischen und Anzeige", (b) => b.append(this._form(S_SWIPE, data, (v) => this._emit(strip(merge(this._config, names(S_SWIPE), v))))))
      );
    }
    _pagesBody(b, pages, cur) {
      b.append(this._hint("Jede Seite ist ein eigenes Raster aus Karten. Antippen wählt die Seite zum Bearbeiten (die Vorschau springt mit), am Griff ziehen sortiert."));
      const box = document.createElement("div");
      box.className = "pgs";
      this._pgEls = pages.map((p, k) => {
        const e = document.createElement("div");
        e.className = `pgb${k === cur ? " sel" : ""}`;
        e.tabIndex = 0;
        e.setAttribute("role", "button");
        e.innerHTML = '<span class="drag"><ha-icon icon="mdi:drag"></ha-icon></span><span class="num"></span><span class="pi"></span><span class="bl"><b></b><small></small></span>';
        e.querySelector(".num").textContent = k + 1;
        if (p.icon) e.querySelector(".pi").innerHTML = `<ha-icon icon="${p.icon.replace(/"/g, "")}"></ha-icon>`;
        const cards = normRows(p).flatMap((r) => r.cells).filter((x) => x.card);
        e.querySelector("b").textContent = p.name || `Seite ${k + 1}`;
        e.querySelector("small").textContent = cards.length ? `${cards.length} ${cards.length === 1 ? "Karte" : "Karten"}` : "Noch leer";
        const mv = (d) => {
          const ps = this._list();
          ps.splice(k + d, 0, ...ps.splice(k, 1));
          this._setPages(ps, cur === k ? k + d : cur === k + d ? k : cur);
        };
        e.append(
          this._btn("mdi:plus-box-outline", "Karte hinzufügen", () => this._addCard(k)),
          this._btn("mdi:arrow-up", "Nach vorne", () => mv(-1), k === 0),
          this._btn("mdi:arrow-down", "Nach hinten", () => mv(1), k === pages.length - 1),
          this._btn("mdi:content-copy", "Seite duplizieren", () => {
            const ps = this._list();
            ps.splice(k + 1, 0, JSON.parse(JSON.stringify(ps[k])));
            this._setPages(ps, k + 1);
          }),
          this._btn("mdi:delete-outline", "Seite löschen", () => {
            const ps = this._list();
            ps.splice(k, 1);
            this._setPages(ps.length ? ps : [{ rows: [] }], Math.min(cur, ps.length - 1));
          }, pages.length < 2)
        );
        const pick = () => {
          if (Date.now() - (this._pgDragged || 0) < 200) return;
          this._openSecs?.add("content");
          this._show(k);
        };
        e.addEventListener("click", (ev) => {
          ev.preventDefault();
          pick();
        });
        e.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            pick();
          }
        });
        this._pgDrag(e, e.querySelector(".drag"), k);
        box.append(e);
        return e;
      });
      b.append(box, this._add("Seite hinzufügen", () => {
        const ps = this._list();
        ps.push({ rows: [] });
        this._openSecs?.add("content");
        this._setPages(ps, ps.length - 1);
      }));
    }
    // „Karte hinzufügen“ an einer Seite: Kartenauswahl öffnen, die Karte kommt als neue Zeile unten auf die Seite
    _addCard(k) {
      this._page = k;
      this._sel = null;
      this._openSecs?.add("content");
      window.dispatchEvent(new CustomEvent("nova-swipe-goto", { detail: { page: k } }));
      const put = (card) => {
        const rs = this._rows(), x = { width: "auto", card: card ?? null };
        rs.push({ cells: [x] });
        this._picking = !card;
        this._yaml = false;
        this._emitRows(rs, x);
        this._rebuild();
      };
      if (!this._openPicker((c) => put(c))) put();
    }
    // Seiten per Ziehen sortieren (Maus und Touch, über Pointer Events)
    _pgDrag(e, grip, k) {
      e.addEventListener("pointerdown", (ev) => {
        if (ev.button !== 0) return;
        if (ev.pointerType !== "mouse" && !ev.composedPath().includes(grip)) return;
        const y0 = ev.clientY, x0 = ev.clientX;
        let on = false, to = null;
        const move = (m) => {
          if (!on) {
            if (Math.hypot(m.clientX - x0, m.clientY - y0) < 6) return;
            on = true;
            e.classList.add("lift");
          }
          m.preventDefault();
          e.style.transform = `translateY(${m.clientY - y0}px)`;
          this._pgEls.forEach((n) => n.classList.remove("before", "after"));
          to = null;
          this._pgEls.forEach((n, j) => {
            if (n === e) return;
            const rc = n.getBoundingClientRect();
            if (m.clientY >= rc.top && m.clientY <= rc.bottom) {
              const after = m.clientY > rc.top + rc.height / 2;
              n.classList.add(after ? "after" : "before");
              to = after ? j + 1 : j;
            }
          });
        };
        const stop = (drop) => {
          window.removeEventListener("pointermove", move);
          window.removeEventListener("pointerup", up);
          window.removeEventListener("pointercancel", cancel);
          if (!on) return;
          this._pgDragged = Date.now();
          if (!drop || to == null || to === k || to === k + 1) return this._rebuild();
          const ps = this._list(), cur = this._cur(), x = ps[k], selPage = ps[cur];
          ps.splice(k, 1);
          ps.splice(to > k ? to - 1 : to, 0, x);
          this._setPages(ps, ps.indexOf(selPage));
        };
        const up = () => stop(true), cancel = () => stop(false);
        window.addEventListener("pointermove", move, { passive: false });
        window.addEventListener("pointerup", up);
        window.addEventListener("pointercancel", cancel);
      });
    }
  };
  __publicField(NovaSwipeCardEditor, "gridWhere", "auf dieser Seite");
  __publicField(NovaSwipeCardEditor, "labels", LABELS);
  __publicField(NovaSwipeCardEditor, "helpers", HELPERS);
  __publicField(NovaSwipeCardEditor, "openSections", ["pages", "content"]);
  define("swipe-card-editor", NovaSwipeCardEditor);

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

  // src/shared/dial.js
  var f = (n) => +n.toFixed(2);
  var pt = (cx, cy, r, a) => [f(cx + r * Math.sin(a)), f(cy - r * Math.cos(a))];
  var ticks = (cx, cy, r, len = 5, big = 9) => {
    let s = "", m = "";
    for (let i = 0; i < 60; i++) {
      const a = i / 60 * Math.PI * 2, major = i % 5 === 0, [x1, y1] = pt(cx, cy, r, a), [x2, y2] = pt(cx, cy, r - (major ? big : len), a);
      if (major) m += `M${x1} ${y1}L${x2} ${y2}`;
      else s += `M${x1} ${y1}L${x2} ${y2}`;
    }
    return `<path class="tk" d="${s}"/><path class="tkm" d="${m}"/>`;
  };
  var dialDefs = (p, cx, cy, r) => `${sceneDefs(p)}
<radialGradient id="${p}-fc" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="${PAL.inner}"/><stop offset=".75" stop-color="${PAL.innerDark}"/><stop offset="1" stop-color="#05070a"/></radialGradient>
<clipPath id="${p}-gc"><circle cx="${cx}" cy="${cy}" r="${r - 9}"/></clipPath>`;
  var dialBody = (p, cx, cy, r, ring = 0) => `<ellipse class="s-shd" cx="${cx}" cy="${cy + r + 4}" rx="${f(r * 0.7)}" ry="3.5"/>
<circle class="s-body" cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}-bd)"/>
<circle class="s-sheen" cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}-sh)"/>
<path class="dl-edge" d="M${pt(cx, cy, r - 1, -1.1).join(" ")}A${r - 1} ${r - 1} 0 0 1 ${pt(cx, cy, r - 1, 1.1).join(" ")}"/>
<circle class="dl-bz" cx="${cx}" cy="${cy}" r="${r - 5}" stroke="url(#${p}-cr)"/>
<circle class="dl-fc" cx="${cx}" cy="${cy}" r="${r - 8}" fill="url(#${p}-fc)"/>
${ticks(cx, cy, r - 11)}
${ring ? `<circle class="dl-tr" cx="${cx}" cy="${cy}" r="${ring}"/><circle class="dl-arc" cx="${cx}" cy="${cy}" r="${ring}" transform="rotate(-90 ${cx} ${cy})" pathLength="1000"/>` : ""}`;
  var dialGlass = (p, cx, cy, r) => {
    const g = r - 9, [ax, ay] = pt(cx, cy, g - 4, -1.25), [bx, by] = pt(cx, cy, g - 4, -0.35);
    return `<circle class="s-glass" cx="${cx}" cy="${cy}" r="${g}" fill="url(#${p}-gl)"/>
<g clip-path="url(#${p}-gc)"><path class="s-refl" d="M${cx - g} ${cy - g * 0.2}L${cx - g * 0.2} ${cy - g}h${f(g * 0.35)}L${cx - g} ${cy + g * 0.15}z"/>
<path class="s-refl" d="M${cx - g * 0.7} ${cy + g * 0.55}L${cx + g * 0.55} ${cy - g * 0.7}h${f(g * 0.12)}L${cx - g * 0.58} ${cy + g * 0.67}z"/>
<g transform="rotate(25 ${cx} ${cy})"><rect class="s-gls" x="${cx - g - 18}" y="${cy - g - 20}" width="16" height="${2 * g + 40}" fill="url(#${p}-gs)"/></g></g>
<path class="dl-arcl" d="M${ax} ${ay}A${g - 4} ${g - 4} 0 0 1 ${bx} ${by}"/>`;
  };
  var crown = (p, cx, cy, r) => {
    const top = cy - r, grooves = [-6, -3, 0, 3, 6].map((x) => `M${cx + x} ${top - 16}v8`).join("");
    const pusher = (side, a) => `<g class="dl-push ${side}" transform="rotate(${a} ${cx} ${cy})"><rect class="s-part" x="${cx - 5}" y="${top - 9}" width="10" height="10" rx="2" fill="url(#${p}-pt)"/><rect class="dl-cap" x="${cx - 6.5}" y="${top - 12}" width="13" height="4" rx="1.5" fill="url(#${p}-cr)"/></g>`;
    return `${pusher("l", -40)}${pusher("r", 40)}
<rect class="s-part" x="${cx - 5}" y="${top - 8}" width="10" height="9" rx="1.5" fill="url(#${p}-pt)"/>
<g class="dl-crown"><rect class="dl-cr" x="${cx - 10}" y="${top - 19}" width="20" height="12" rx="3" fill="url(#${p}-cr)"/><path class="dl-grv" d="${grooves}"/></g>`;
  };
  var bellBadge = (right, bottom) => {
    const { x, y, r } = badgeAt(right, bottom);
    return `<g class="dl-bell"><circle class="dl-br" cx="${x}" cy="${y}" r="${r}"/><path class="dl-bk" transform="translate(${x - 6} ${y - 6.5}) scale(.5)" d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1z"/></g>`;
  };
  var DIAL_CSS = `${SCENE_CSS}
.scene .dl-edge{fill:none;stroke:#fff;stroke-opacity:.14;stroke-width:.7}
.scene .dl-bz{fill:none;stroke-width:4.4}
.scene .dl-fc{stroke:rgba(0,0,0,.6);stroke-width:1}
.scene .tk{stroke:#fff;stroke-opacity:.14;stroke-width:.6}.scene .tkm{stroke:#fff;stroke-opacity:.3;stroke-width:1.4;stroke-linecap:round}
.scene .dl-tr{fill:none;stroke:#fff;stroke-opacity:.06;stroke-width:6}
.scene .dl-arc{fill:none;stroke:var(--dc);stroke-width:6;stroke-linecap:round;stroke-dasharray:1000;stroke-dashoffset:calc(1000 - var(--p,0) * 1000);
filter:drop-shadow(0 0 2.5px var(--dc));transition:stroke-dashoffset 1s linear,opacity .4s}
.scene .dl-arcl{fill:none;stroke:#fff;stroke-opacity:.16;stroke-width:1.2;stroke-linecap:round}
.scene .dl-cr{stroke:rgba(255,255,255,.2);stroke-width:.5}.scene .dl-grv{stroke:#000;stroke-opacity:.3;stroke-width:.8}
.scene .dl-cap{stroke:rgba(255,255,255,.2);stroke-width:.4}
.scene .dl-push,.scene .dl-crown{transform-box:view-box}
.scene .dl-bell{opacity:0;transform-box:fill-box;transform-origin:center}
.scene .dl-br{fill:var(--dc);filter:drop-shadow(0 0 4px var(--dc))}.scene .dl-bk{fill:var(--dcfg,#fff)}
@media (prefers-reduced-motion:reduce){.scene *{animation:none!important;transition:none!important}}`;

  // src/timer.js
  var DEF2 = {
    presets: [1, 5, 10, 15],
    show_presets: true,
    show_custom: true,
    show_add: true,
    color: "accent-1",
    alarm_color: "accent-2",
    alarm_minutes: 10,
    layout: "full",
    animation: true,
    glow: true
  };
  var CX = 100;
  var CY = 112;
  var R = 80;
  var RING = 58;
  var parseDur = (v) => {
    if (v == null) return null;
    if (typeof v === "number") return v;
    const m = String(v).match(/^(?:(\d+)\s*days?,\s*)?(\d+):(\d{1,2})(?::(\d{1,2})(?:\.\d+)?)?$/);
    if (!m) return null;
    return (+m[1] || 0) * 86400 + +m[2] * 3600 + +m[3] * 60 + (+m[4] || 0);
  };
  var hms = (s) => `${Math.floor(s / 3600)}:${String(Math.floor(s / 60) % 60).padStart(2, "0")}:${String(s % 60).padStart(2, "0")}`;
  var fmtLeft = (s) => {
    s = Math.max(0, Math.ceil(s));
    const h = Math.floor(s / 3600), m = Math.floor(s / 60) % 60, x = String(s % 60).padStart(2, "0");
    return h ? `${h}:${String(m).padStart(2, "0")}:${x}` : `${m}:${x}`;
  };
  var presetSecs = (v) => list(v).map((x) => {
    const m = String(x).match(/^(\d+(?:[.,]\d+)?)\s*(s|sek|min|m|h|std)?$/i);
    if (!m) return null;
    const n = +m[1].replace(",", ".");
    const u = (m[2] || "min").toLowerCase();
    return Math.round(n * (u[0] === "s" ? 1 : u[0] === "h" ? 3600 : 60));
  }).filter((n) => n > 0).slice(0, 8);
  var presetLbl = (s) => s % 3600 === 0 ? `${s / 3600} h` : s % 60 === 0 ? `${s / 60}` : s > 60 ? fmtLeft(s) : `${s} s`;
  var ICON = { play: "mdi:play", pause: "mdi:pause", stop: "mdi:stop", plus: "mdi:plus", tune: "mdi:timer-edit-outline", ok: "mdi:check", again: "mdi:restart" };
  var TCSS = `${DIAL_CSS}
.g.tm{--dc:var(--tc);--dcfg:var(--tcfg);padding:14px;gap:10px;transition:box-shadow .4s}
${frameGlow(".g.tm.glow.st-active")}
.g.tm.alm{--dc:var(--ac);--dcfg:var(--acfg)}
.g.tm.glow.alm{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 2px var(--ac),0 0 24px color-mix(in srgb,var(--ac) 55%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.anim.glow.alm{animation:tm-frame 1.2s ease-in-out infinite}
.still{animation-play-state:paused!important}.still *{animation-play-state:paused!important}
.hd .nm small{font-variant-numeric:tabular-nums}
.bd{display:flex;flex-direction:column;gap:12px;align-items:stretch;flex:1;min-height:0}
.dial{position:relative;align-self:center;width:100%;max-width:var(--nova-timer-size,240px);aspect-ratio:1;flex:none}
.dial svg{display:block;width:100%;height:100%;overflow:visible}
.ro{position:absolute;left:50%;top:56%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;width:60%}
.ro .t{display:block;font-size:clamp(22px,calc(var(--dw,240px) * .16),46px);font-weight:600;letter-spacing:.01em;font-variant-numeric:tabular-nums;line-height:1.05;white-space:nowrap}
.ro .s{display:block;font-size:clamp(11px,calc(var(--dw,240px) * .05),14px);opacity:.65;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.st-idle .scene{opacity:.55}.st-idle .ro .t{opacity:.7}
.alm .scene{opacity:1}
.anim.st-paused .ro .t{animation:tm-blink 1.4s ease-in-out infinite}
.ctl{display:flex;flex-direction:column;gap:10px;justify-content:center;min-width:0}
.row2{display:flex;gap:8px;flex-wrap:wrap}
.bt2{flex:1 1 0;min-width:0;box-sizing:border-box;min-height:var(--nova-timer-button-height,52px);padding:0 8px;border-radius:16px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);
display:flex;align-items:center;justify-content:center;gap:6px;font-size:15px;font-weight:500;color:inherit;white-space:nowrap;overflow:hidden;transition:background-color .2s,transform .15s,box-shadow .2s}
.bt2 span{min-width:0;overflow:hidden;text-overflow:ellipsis}
.bt2 ha-icon{--mdc-icon-size:21px;flex:none}
.bt2:active{transform:scale(.95)}
/* Hauptknopf im Glas-Stil: nur leicht in der Kartenfarbe getönt, Icon in der Farbe – keine Vollfarbfläche */
.bt2.pri{background:color-mix(in srgb,var(--dc) 22%,var(--nv-chip));border-color:color-mix(in srgb,var(--dc) 55%,transparent)}
.bt2.pri ha-icon{color:var(--dc)}
.bt2.sel{border-color:color-mix(in srgb,var(--dc) 70%,transparent);background:color-mix(in srgb,var(--dc) 14%,var(--nv-chip))}
.pre{display:grid;grid-template-columns:repeat(var(--n,4),minmax(0,1fr));gap:8px}
.pre .bt2{font-size:16px;font-weight:600}
.cust{display:flex;flex-direction:column;gap:10px;padding:10px;border-radius:18px;background:var(--nv-box);border:1px solid var(--nv-box-border)}
.stps{display:grid;grid-template-columns:repeat(3,minmax(0,1fr));gap:8px}
.stp{display:flex;flex-direction:column;align-items:center;gap:4px}
.stp small{font-size:11.5px;opacity:.6;text-transform:uppercase;letter-spacing:.05em}
.stp .v{font-size:24px;font-weight:600;font-variant-numeric:tabular-nums;min-height:30px}
.stp .hb{width:100%;max-width:64px;height:40px;border-radius:12px}
.stp .hb ha-icon{--mdc-icon-size:22px}
.full .cbk{display:none}
/* Kompakt: Minuten und Sekunden nebeneinander als [−] 05 Min [+], gleiche Höhe wie Schnellwahl + Knöpfe */
.cmp .cust{padding:0;background:none;border:none}
.cmp .stps{grid-template-columns:repeat(2,minmax(0,1fr))}
.cmp .stp[data-k="h"]{display:none}
.cmp .stp{flex-direction:row;justify-content:space-between;gap:2px;padding:0 3px;min-width:0;border-radius:16px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);height:var(--nova-timer-button-height,52px);box-sizing:border-box}
.cmp .stp .mi{order:0}.cmp .stp .v{order:1;min-height:0;font-size:19px}.cmp .stp small{order:2;text-transform:none;letter-spacing:0;font-size:11px;margin-left:-1px}.cmp .stp .pl{order:3}
.cmp .stp .hb{width:34px;height:42px;flex:none;border-radius:12px}
.msg{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:16px;font-size:16px;font-weight:600;
background:color-mix(in srgb,var(--ac) 18%,var(--nv-chip));border:1px solid color-mix(in srgb,var(--ac) 50%,transparent)}
.msg ha-icon{color:var(--ac);--mdc-icon-size:26px}
.anim .msg ha-icon{animation:tm-ring 1.2s ease-in-out infinite;transform-origin:50% 10%}
.alm .dl-bell{opacity:1}
.anim.alm.fx .dl-bell{animation:tm-pop .45s ease-out both}
.anim.alm .dl-crown,.anim.alm .dl-push{animation:tm-press 1.2s ease-in-out infinite}
.anim.alm .rot{animation:tm-shake 1.2s ease-in-out infinite;transform-box:view-box;transform-origin:100px 112px}
.scene .snd path{fill:none;stroke:var(--ac);stroke-width:2;stroke-linecap:round;opacity:0}
.anim.alm .snd path{animation:tm-snd 1.2s ease-out infinite}.anim.alm .snd path:nth-child(2n){animation-delay:.25s}
.alm:not(.anim) .snd path{opacity:.7}
.st-active .dl-push.r{animation:none}
.prs .dl-push.r,.prs .dl-crown{animation:tm-press .35s ease-out}
.scene .tip{fill:#fff;filter:drop-shadow(0 0 3px var(--dc));opacity:0;transition:opacity .4s}
.st-active .scene .tip,.st-paused .scene .tip{opacity:1}
.scene .tipg{transition:transform 1s linear;transform-box:view-box;transform-origin:100px 112px}
.st-idle .scene .dl-arc{opacity:.35}
[hidden]{display:none!important}
/* Kompakt: kleine Stoppuhr links, Zeit daneben, Knöpfe rechts; Schnellwahl und eigene Zeit darunter über die ganze Breite */
.cmp .hd{display:none}
.cmp .bd{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;align-content:center;column-gap:14px;row-gap:10px}
.cmp .ctl{display:contents}
.cmp .dial{grid-column:1;grid-row:1;width:84px;max-width:84px}.cmp .ro{display:none}
.cmp .ct2{grid-column:2;grid-row:1;min-width:0}
.cmp .main{flex-wrap:nowrap}
.cmp .main,.cmp .msg,.cmp .pre,.cmp .cust{grid-column:1/-1}
.cmp .msg{display:none}
.ct2 .tt b{display:block;font-size:42px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.1}
.ct2 .tt small{display:block;font-size:12.5px;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ct2 .tt i{font-style:normal;opacity:.75}
.full .ct2{display:none}
.cmp.alm .tt b{color:var(--ac)}
@container (max-width:340px){.main.n3 .bt2 ha-icon{display:none}.bt2{font-size:14px}}
@container (max-width:260px){.main .bt2 span{display:none}.main .bt2 ha-icon{display:flex!important}}
@container (min-width:400px){.full .bd{flex-direction:row;align-items:center}.full .dial{width:46%;max-width:var(--nova-timer-size,260px)}.full .ctl{flex:1}}
/* Stoppuhr neben den Knöpfen, aber wenig Platz rechts: Hauptknöpfe untereinander, damit kein Text abgeschnitten wird */
@container (min-width:400px) and (max-width:560px){.full .main{flex-direction:column}.full .main .bt2{flex:none;width:100%}}
@keyframes tm-blink{0%,100%{opacity:1}50%{opacity:.35}}
@keyframes tm-ring{0%,60%,100%{transform:rotate(0)}10%,30%,50%{transform:rotate(-14deg)}20%,40%{transform:rotate(14deg)}}
@keyframes tm-shake{0%,60%,100%{transform:rotate(0)}10%,30%,50%{transform:rotate(-3deg)}20%,40%{transform:rotate(3deg)}}
@keyframes tm-press{0%,100%{transform:translateY(0)}20%{transform:translateY(3px)}}
@keyframes tm-snd{0%{opacity:0;transform:scale(.8)}30%{opacity:.85}100%{opacity:0;transform:scale(1.25)}}
@keyframes tm-pop{0%{transform:scale(0)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
@keyframes tm-frame{0%,100%{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 2px var(--ac),0 0 10px color-mix(in srgb,var(--ac) 30%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}50%{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 2px var(--ac),0 0 30px color-mix(in srgb,var(--ac) 75%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}}
@media (prefers-reduced-motion:reduce){.anim *,.anim{animation:none!important}}`;
  var SND = `<g class="snd" style="transform-box:view-box;transform-origin:100px 18px"><path d="M78 20a16 16 0 0 1 6-12"/><path d="M70 24a26 26 0 0 1 9-20"/><path d="M122 20a16 16 0 0 0-6-12"/><path d="M130 24a26 26 0 0 0-9-20"/></g>`;
  var SVG = `<svg viewBox="0 0 200 200" aria-hidden="true" class="scene"><defs>${dialDefs("t", CX, CY, R)}</defs>${SND}
<g class="rot">${crown("t", CX, CY, R)}${dialBody("t", CX, CY, R, RING)}
<g class="tipg"><circle class="tip" cx="${CX}" cy="${CY - RING}" r="3.2"/></g>
${dialGlass("t", CX, CY, R)}</g>${bellBadge(CX + R, CY + R)}</svg>`;
  var NovaTimerCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("timer-card-editor"));
    }
    static getStubConfig(h) {
      const t = Object.keys(h?.states || {}).find((id) => id.startsWith("timer."));
      return t ? { entity: t } : {};
    }
    constructor() {
      super();
      this._cust = { h: 0, m: 5, s: 0 };
      this._showCust = false;
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      if (c.entity && !String(c.entity).startsWith("timer.")) throw new Error("Bitte einen Timer-Helfer (timer.*) wählen");
      this._c = { ...DEF2, ...c };
      this._pre = presetSecs(this._c.presets);
      this._ids = [c.entity].filter(Boolean);
      this._key = null;
      if (this._e) this._layout();
      if (this._h) this._render();
    }
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._e) this._build();
      else if (this._key != null && !hassChanged(old, h, this._ids)) return;
      this._render();
    }
    connectedCallback() {
      this._quiet = inPicker(this);
      if (!this._e && this._c && this._h) this._build();
      this._stopVis?.();
      this._stopVis = watchVisible(this, (v) => {
        this._vis = v && !this._quiet;
        this._tick(true);
      });
    }
    disconnectedCallback() {
      this._stopVis?.();
      this._stopVis = null;
      this._vis = false;
      this._tick();
      this._ro?.disconnect();
      this._stopRep();
    }
    getCardSize() {
      return this._c?.layout === "compact" ? 2 : 5;
    }
    getGridOptions() {
      return this._c?.layout === "compact" ? { columns: 6, rows: "auto", min_columns: 4 } : { columns: 6, rows: "auto", min_columns: 4 };
    }
    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${TCSS}</style><div class="g tm">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<div class="bd"><div class="dial">${SVG}<div class="ro"><span class="t"></span><span class="s"></span></div></div>
<div class="ctl"><div class="ct2"><div class="tt"><b></b><small></small></div></div>
<div class="msg" hidden><ha-icon icon="mdi:bell-ring"></ha-icon><span>Zeit ist um!</span></div>
<div class="row2 main"></div><div class="pre"></div>
<div class="cust" hidden><div class="stps">${["h|Std", "m|Min", "s|Sek"].map((x) => {
        const [k, l] = x.split("|");
        return `<div class="stp" data-k="${k}"><small>${l}</small><div class="hb pl"><ha-icon icon="mdi:plus"></ha-icon></div><span class="v"></span><div class="hb mi"><ha-icon icon="mdi:minus"></ha-icon></div></div>`;
      }).join("")}</div>
<div class="row2"><div class="bt2 cbk"><ha-icon icon="mdi:close"></ha-icon><span>Zurück</span></div><div class="bt2 pri cgo"><ha-icon icon="mdi:play"></ha-icon><span>Starten</span></div></div></div>
</div></div></div>`;
      const q = (s) => r.querySelector(s);
      this._e = {
        g: q(".g"),
        hd: q(".hd"),
        ic: q(".hd .ic"),
        nm: q(".hd b"),
        sub: q(".hd small"),
        dial: q(".dial"),
        svg: q("svg"),
        t: q(".ro .t"),
        s: q(".ro .s"),
        tt: q(".ct2 b"),
        ts: q(".ct2 small"),
        msg: q(".msg"),
        main: q(".main"),
        pre: q(".pre"),
        cust: q(".cust"),
        tip: q(".tipg")
      };
      const act = () => ({ entity: this._c.entity, tap_action: this._c.tap_action, hold_action: this._c.hold_action });
      press(this._e.hd, { tap: () => runAction(this, act(), "tap", true), hold: () => runAction(this, act(), "hold") });
      press(this._e.dial, { tap: () => this._dialTap(), hold: () => runAction(this, act(), "hold") });
      r.querySelectorAll(".stp").forEach((st) => {
        const k = st.dataset.k;
        [[".pl", 1], [".mi", -1]].forEach(([s, d]) => this._rep(st.querySelector(s), () => this._step(k, d)));
      });
      press(q(".cbk"), { tap: () => {
        this._showCust = false;
        this._key = null;
        this._render();
      } });
      press(q(".cgo"), { tap: () => {
        const { h, m, s } = this._cust, sec = (this._c.layout === "compact" ? 0 : h) * 3600 + m * 60 + s;
        if (sec > 0) {
          this._showCust = false;
          this._start(sec);
        }
      } });
      if ("ResizeObserver" in window) {
        this._ro = new ResizeObserver((es) => {
          const w = es[0].contentRect.width;
          if (w) this._e.dial.style.setProperty("--dw", `${w}px`);
        });
        this._ro.observe(this._e.dial);
      }
      this._layout();
      this._key = null;
    }
    _layout() {
      const c = this._c, e = this._e, rv = roleVars(c.color), av = roleVars(c.alarm_color);
      e.g.style.cssText = `--tc:${rv.c};--tcfg:${rv.fg};--ac:${av.c};--acfg:${av.fg}`;
      e.g.classList.toggle("cmp", c.layout === "compact");
      e.g.classList.toggle("full", c.layout !== "compact");
      e.g.classList.toggle("glow", c.glow !== false);
      this._presetsKey = null;
    }
    _S() {
      return this._c.entity ? this._h?.states[this._c.entity] : null;
    }
    // Restzeit und Gesamtdauer aus dem Zustand des Helfers
    _calc() {
      const s = this._S();
      if (!s) return null;
      const a = s.attributes, total = parseDur(a.duration) || 0;
      let left = total;
      if (s.state === "active") left = a.finishes_at ? (Date.parse(a.finishes_at) - Date.now()) / 1e3 : parseDur(a.remaining) ?? total;
      else if (s.state === "paused") left = parseDur(a.remaining) ?? total;
      return { st: s.state, total, left: Math.max(0, left), fin: a.finishes_at };
    }
    // Abgelaufen? HA setzt nach dem Ablauf last_transition = finished; ohne das Attribut zählt der beobachtete Wechsel aktiv → bereit
    _alarm(s) {
      if (!s || s.state !== "idle") return false;
      const fin = s.attributes.last_transition ? s.attributes.last_transition === "finished" : this._sawFinish === s.last_changed;
      const age = (Date.now() - Date.parse(s.last_changed)) / 6e4, max = +this._c.alarm_minutes;
      return fin && this._dismissed !== s.last_changed && (!(max > 0) || age < max);
    }
    _render() {
      const c = this._c, e = this._e, h = this._h;
      if (!e || !h) return;
      const s = this._S();
      if (s && this._prevSt === "active" && s.state === "idle" && this._prevFin && Date.parse(this._prevFin) <= Date.now() + 2e3) this._sawFinish = s.last_changed;
      const fresh = s && this._prevSt && this._prevSt !== "idle" && s.state === "idle";
      this._prevSt = s?.state;
      this._prevFin = s?.attributes.finishes_at;
      const v = this._calc(), al = this._alarm(s), st = v?.st || "na";
      const key = JSON.stringify([s?.state, s?.last_changed, s?.attributes, al, this._showCust, c]);
      const changed = key !== this._key;
      this._key = key;
      if (changed) {
        e.g.classList.remove("st-active", "st-paused", "st-idle", "st-na");
        e.g.classList.add(`st-${st}`);
        if (al && !e.g.classList.contains("alm")) {
          e.g.classList.add("fx");
          if (c.animation !== false && this._vis) sweep(e.g);
        }
        if (!al) e.g.classList.remove("fx");
        e.g.classList.toggle("alm", al);
        e.g.classList.toggle("na", !s);
        const nm = s ? nameOf(h, { entity: c.entity, name: c.name }) : c.name || "Timer";
        e.nm.textContent = nm;
        this._nm = nm;
        e.ic.innerHTML = `<ha-icon icon="${esc(c.icon || s?.attributes.icon || "mdi:timer-outline")}"></ha-icon>`;
        e.ic.classList.toggle("on", st === "active" || al);
        e.hd.classList.toggle("on", st === "active" || al);
        e.msg.hidden = !al;
        e.msg.querySelector("span").textContent = c.alarm_text || "Zeit ist um!";
        this._buttons(st, al, v);
        if (fresh && !al) e.cust.hidden = !this._showCust;
      }
      this._time();
      this._tick();
    }
    // Zeit, Ring und Untertitel – läuft jede Sekunde, solange der Timer läuft
    _time() {
      const e = this._e, v = this._calc(), s = this._S(), al = this._alarm(s);
      if (!v) {
        e.t.textContent = "–:––";
        e.s.textContent = this._c.entity ? "Timer nicht gefunden" : "Timer-Helfer wählen";
        e.tt.textContent = "–:––";
        e.ts.textContent = e.s.textContent;
        e.sub.textContent = e.s.textContent;
        e.svg.style.setProperty("--p", 0);
        return;
      }
      const p = v.total ? v.left / v.total : 0, txt = al ? "0:00" : fmtLeft(v.st === "idle" ? v.total : v.left);
      let sub = "";
      if (al) sub = this._c.alarm_text || "Zeit ist um!";
      else if (v.st === "active") sub = `bis ${this._clock(v.fin ? new Date(v.fin) : new Date(Date.now() + v.left * 1e3))}`;
      else if (v.st === "paused") sub = "Pausiert";
      else sub = "Bereit";
      if (e.t.textContent !== txt) {
        e.t.textContent = txt;
        e.tt.textContent = txt;
      }
      const hs = al ? sub : { active: "Läuft", paused: "Pausiert" }[v.st] || "Bereit";
      if (e.s.textContent !== sub) e.s.textContent = sub;
      const ts = `${this._nm ? `${this._nm} · ` : ""}${sub}`;
      if (e.ts.textContent !== ts) e.ts.textContent = ts;
      if (e.sub.textContent !== hs) e.sub.textContent = hs;
      const pp = v.st === "idle" ? al ? 0 : 1 : p;
      e.svg.style.setProperty("--p", pp.toFixed(4));
      e.tip.style.transform = `rotate(${(pp * 360).toFixed(2)}deg)`;
    }
    _clock(d) {
      const h = this._h, o = { hour: "2-digit", minute: "2-digit", timeZone: tzOf(h) };
      try {
        return new Intl.DateTimeFormat(langOf(h), o).format(d);
      } catch {
        delete o.timeZone;
        return new Intl.DateTimeFormat(langOf(h), o).format(d);
      }
    }
    _buttons(st, al, v) {
      const c = this._c, e = this._e, b = [];
      const B = (cls, icon, label, fn) => b.push([cls, icon, label, fn]);
      if (!this._S()) {
      } else if (al) {
        B("pri", ICON.ok, "OK", () => this._dismiss());
        if (v?.total) B("", ICON.again, "Nochmal", () => {
          this._dismiss();
          this._start(v.total);
        });
      } else if (st === "active") {
        B("", ICON.pause, "Pause", () => this._svc("pause"));
        if (c.show_add !== false) B("", ICON.plus, "+1 Min", () => this._add(60));
        B("", ICON.stop, "Abbrechen", () => this._svc("cancel"));
      } else if (st === "paused") {
        B("pri", ICON.play, "Weiter", () => this._svc("start"));
        B("", ICON.stop, "Abbrechen", () => this._svc("cancel"));
      } else {
        B("pri", ICON.play, "Start", () => this._start(v?.total || 0));
        if (c.show_custom !== false) B(this._showCust ? "sel" : "", ICON.tune, "Eigene Zeit", () => {
          this._showCust = !this._showCust;
          this._key = null;
          this._render();
        });
      }
      e.main.innerHTML = "";
      e.main.classList.toggle("n3", b.length > 2);
      b.forEach(([cls, icon, label, fn]) => {
        const d = document.createElement("div");
        d.className = `bt2 ${cls}`;
        d.title = label;
        d.innerHTML = `<ha-icon icon="${icon}"></ha-icon><span>${esc(label)}</span>`;
        press(d, { tap: fn });
        e.main.append(d);
      });
      const idle = st === "idle" && !al && !!this._S();
      e.pre.hidden = !idle || this._showCust || c.show_presets === false || !this._pre.length;
      if (!e.pre.hidden) {
        const pk = JSON.stringify(this._pre);
        if (this._presetsKey !== pk) {
          this._presetsKey = pk;
          e.pre.style.setProperty("--n", Math.min(4, this._pre.length));
          e.pre.innerHTML = "";
          this._pre.forEach((sec) => {
            const d = document.createElement("div");
            d.className = "bt2";
            d.textContent = presetLbl(sec);
            d.title = `${sec % 60 ? presetLbl(sec) : sec / 60 + " Minuten"} starten`;
            press(d, { tap: () => this._start(sec) });
            e.pre.append(d);
          });
        }
      }
      e.cust.hidden = !(idle && this._showCust && c.show_custom !== false);
      e.main.hidden = c.layout === "compact" && !e.cust.hidden;
      if (!e.cust.hidden) this._custShow();
    }
    _dialTap() {
      const s = this._S();
      if (!s) return;
      if (this._alarm(s)) return this._dismiss();
      if (s.state === "active") return this._svc("pause");
      if (s.state === "paused") return this._svc("start");
      this._start(this._calc()?.total || 0);
    }
    _dismiss() {
      this._dismissed = this._S()?.last_changed;
      this._key = null;
      this._render();
    }
    _press() {
      const g = this._e.g;
      g.classList.remove("prs");
      void g.offsetWidth;
      g.classList.add("prs");
    }
    _svc(svc, data = {}) {
      if (!this._c.entity) return;
      this._press();
      return this._h.callService("timer", svc, { entity_id: this._c.entity, ...data });
    }
    _start(sec) {
      return sec > 0 ? this._svc("start", { duration: hms(Math.round(sec)) }) : this._svc("start");
    }
    // +1 Minute: timer.change (ab HA 2024.x); geht nicht über die eingestellte Dauer hinaus → dann neu starten mit Rest + 60 s
    async _add(sec) {
      const v = this._calc();
      try {
        await this._svc("change", { duration: hms(sec) });
      } catch (err) {
        console.warn("[nova-cards] Timer: +1 Min per Neustart", err);
        if (v) this._start(Math.round(v.left + sec));
      }
    }
    // Stepper: läuft am Ende rundherum (59 → 0); Sekunden in 5er-Schritten, kompakt ohne Stunden bis 180 Minuten
    _step(k, d) {
      const c = this._cust, n = { h: 24, m: this._c.layout === "compact" ? 181 : 60, s: 60 }[k], st = k === "s" ? 5 : 1;
      c[k] = ((Math.round(c[k] / st) * st + d * st) % n + n) % n;
      this._custShow();
    }
    _custShow() {
      this._e.cust.querySelectorAll(".stp").forEach((st) => {
        st.querySelector(".v").textContent = String(this._cust[st.dataset.k]).padStart(2, "0");
      });
    }
    // Taste mit Wiederholung beim Gedrückthalten (Stepper)
    _rep(el2, fn) {
      el2.tabIndex = 0;
      el2.setAttribute("role", "button");
      el2.classList.add("tap");
      el2.addEventListener("pointerdown", (ev) => {
        ev.preventDefault();
        fn();
        this._stopRep();
        this._rt = setTimeout(() => {
          this._ri = setInterval(fn, 110);
        }, 450);
      });
      ["pointerup", "pointerleave", "pointercancel"].forEach((t) => el2.addEventListener(t, () => this._stopRep()));
      el2.addEventListener("contextmenu", (ev) => ev.preventDefault());
      el2.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter" || ev.key === " ") {
          ev.preventDefault();
          fn();
        }
      });
    }
    _stopRep() {
      clearTimeout(this._rt);
      clearInterval(this._ri);
      this._rt = this._ri = null;
    }
    // Ein Takt pro Sekunde, nur wenn der Timer läuft (oder klingelt) und die Karte zu sehen ist
    _tick(cameIn) {
      const e = this._e;
      if (!e) return;
      const vis = !!this._vis, s = this._S(), al = this._alarm(s);
      e.g.classList.toggle("anim", vis && this._c.animation !== false);
      e.g.classList.toggle("still", !vis);
      if (cameIn && vis && !this._wasVis && this._c.animation !== false) sweep(e.g);
      this._wasVis = vis;
      const run = vis && (s?.state === "active" || al);
      if (run && !this._tm) this._tm = setInterval(() => {
        const s2 = this._S();
        if (s2?.state === "active") this._time();
        else if (!this._alarm(s2)) {
          this._key = null;
          this._render();
        }
      }, 1e3);
      if (!run && this._tm) {
        clearInterval(this._tm);
        this._tm = null;
      }
    }
  };
  define("timer-card", NovaTimerCard, { name: "Nova Timer Card", description: "Küchen-Timer über einen Timer-Helfer: Schnellwahl, eigene Zeit, Pause, +1 Minute, Abbrechen – auf allen Geräten synchron, mit Hinweis beim Ablauf.", documentationURL: docUrl("nova-timer-card") });
  var S_GEN = [
    { name: "entity", required: true, selector: { entity: { domain: "timer" } } },
    g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } })
  ];
  var S_START = [
    { name: "show_presets", selector: { boolean: {} } },
    { name: "presets", selector: T },
    { name: "show_custom", selector: { boolean: {} } },
    { name: "show_add", selector: { boolean: {} } }
  ];
  var S_ALARM = [
    { name: "alarm_text", selector: T },
    g2(ROLE("alarm_color"), { name: "alarm_minutes", selector: { number: { min: 0, max: 120, mode: "box", unit_of_measurement: "min" } } })
  ];
  var S_LOOK = [
    g2(sel("layout", [["full", "Groß (mit Stoppuhr)"], ["compact", "Kompakt"]]), ROLE("color")),
    g2({ name: "animation", selector: { boolean: {} } }, { name: "glow", selector: { boolean: {} } })
  ];
  var S_ACT = [{ name: "tap_action", selector: A }, { name: "hold_action", selector: A }];
  var LABELS2 = {
    entity: "Timer-Helfer",
    name: "Name",
    icon: "Icon",
    show_presets: "Schnellwahl-Knöpfe zeigen",
    presets: "Schnellwahl (Minuten, mit Komma)",
    show_custom: "Knopf „Eigene Zeit“ zeigen",
    show_add: "Knopf „+1 Min“ während der Timer läuft",
    alarm_text: "Text beim Ablauf",
    alarm_color: "Farbe beim Ablauf",
    alarm_minutes: "Hinweis anzeigen für",
    layout: "Darstellung",
    color: "Farbe",
    animation: "Animationen",
    glow: "Rahmen leuchtet, solange der Timer läuft",
    tap_action: "Kopfzeile antippen",
    hold_action: "Lange drücken"
  };
  var HELPERS2 = {
    entity: "Ein Timer-Helfer läuft in Home Assistant – alle Geräte zeigen dieselbe Zeit. Anlegen unter Einstellungen → Geräte & Dienste → Helfer → Timer.",
    presets: "z. B. „1, 5, 10, 15“. Auch „30s“ oder „1h“ geht. Höchstens 8.",
    alarm_text: "Leer = „Zeit ist um!“",
    alarm_minutes: "So lange klingelt die Karte nach dem Ablauf, wenn niemand „OK“ drückt. 0 = bis jemand bestätigt.",
    tap_action: "Leer = Details des Timers öffnen. Die Stoppuhr selbst startet, pausiert und setzt fort."
  };
  var NovaTimerCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const data = () => {
        const d = { ...DEF2, ...this._config };
        if (Array.isArray(d.presets)) d.presets = d.presets.join(", ");
        return d;
      };
      const form = (s) => this._form(s, data(), (v) => {
        const c = merge(this._config, names(s), v);
        if ("presets" in v) {
          const arr = list(v.presets).map((x) => /^\d+$/.test(x) ? +x : x);
          if (!arr.length || JSON.stringify(arr) === JSON.stringify(DEF2.presets)) delete c.presets;
          else c.presets = arr;
        }
        Object.keys(DEF2).forEach((k) => {
          if (k !== "presets" && c[k] === DEF2[k]) delete c[k];
        });
        this._emit(c);
      });
      const w = r.querySelector(".wrap");
      if (!Object.keys(this._hass?.states || {}).some((id) => id.startsWith("timer."))) w.append(this._hint("Noch kein Timer-Helfer vorhanden: Einstellungen → Geräte & Dienste → Helfer → „Helfer erstellen“ → Timer. Tipp: „Zustand wiederherstellen“ anhaken, dann übersteht der Timer auch einen Neustart von Home Assistant."));
      w.append(
        this._section("general", "mdi:timer-outline", "Timer", (b) => b.append(form(S_GEN))),
        this._section("start", "mdi:gesture-tap-button", "Schnellwahl und Knöpfe", (b) => b.append(form(S_START))),
        this._section("alarm", "mdi:bell-ring-outline", "Wenn die Zeit um ist", (b) => {
          b.append(form(S_ALARM), this._hint("Ton oder Ansage (z. B. auf dem Echo) per Automation: Auslöser „Ereignis“ timer.finished mit diesem Timer."));
        }),
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(S_LOOK))),
        this._section("actions", "mdi:gesture-tap", "Aktionen", (b) => b.append(form(S_ACT)))
      );
    }
  };
  __publicField(NovaTimerCardEditor, "labels", LABELS2);
  __publicField(NovaTimerCardEditor, "helpers", HELPERS2);
  __publicField(NovaTimerCardEditor, "openSections", ["general"]);
  define("timer-card-editor", NovaTimerCardEditor);

  // src/clock.js
  var DEF3 = { mode: "digital", show_seconds: false, show_weekday: true, show_date: true, date_format: "long", time_format: "auto", color: "accent-1", glass: true };
  var C = 100;
  var R2 = 92;
  var CCSS = `${DIAL_CSS}
:host{container-type:inline-size}
.g.ck{--dc:var(--kc);padding:14px 16px;gap:6px;justify-content:center;align-items:center;text-align:center}
.g.ck.flat{background:none;border-color:transparent;box-shadow:none}
.nm{font-size:12.5px;font-weight:600;opacity:.6;text-transform:uppercase;letter-spacing:.06em}
.tm{font-weight:300;font-variant-numeric:tabular-nums;line-height:1.05;letter-spacing:-.04em;white-space:nowrap;font-size:clamp(34px,var(--nova-clock-size,24cqw),160px)}
.tm .sc{font-size:.42em;opacity:.6;margin-left:.08em;font-weight:400}
.tm .ap{font-size:.3em;opacity:.65;margin-left:.15em;font-weight:500;letter-spacing:0}
.dt{font-size:clamp(13px,5cqw,22px);opacity:.75;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;max-width:100%}
.ana{width:100%;max-width:var(--nova-clock-size,240px);aspect-ratio:1}
.ana svg{display:block;width:100%;height:100%}
.scene .hd,.scene .md{fill:url(#k-cr);stroke:rgba(0,0,0,.35);stroke-width:.5}
.scene .sd{fill:var(--kc);filter:drop-shadow(0 0 2px var(--kc))}
.scene .cap{fill:url(#k-cr);stroke:rgba(255,255,255,.25);stroke-width:.4}.scene .cap2{fill:var(--kc)}
.scene .hsh{fill:#000;opacity:.25}
[hidden]{display:none!important}
@container (min-width:420px){.g.ck.row{flex-direction:row;gap:20px;text-align:left}.row .ana{width:45%}.row .inf{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 14px;font-size:clamp(12px,4.2cqw,17px);opacity:.75;font-variant-numeric:tabular-nums;white-space:nowrap}
.inf span{display:inline-flex;align-items:center;gap:4px}.inf i{display:inline-flex;opacity:.8}.inf ha-icon{--mdc-icon-size:1.1em}.inf img{width:1.1em;height:1.1em}.inf b{font-weight:400}
.row .inf{justify-content:flex-start}
.txt{display:flex;flex-direction:column;gap:6px;align-items:flex-start;flex:1}.row .tm{font-size:clamp(28px,var(--nova-clock-size,12cqw),100px)}.row .dt{font-size:clamp(12px,3.6cqw,22px)}}
.inf{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 14px;font-size:clamp(12px,4.2cqw,17px);opacity:.75;font-variant-numeric:tabular-nums;white-space:nowrap}
.inf span{display:inline-flex;align-items:center;gap:4px}.inf i{display:inline-flex;opacity:.8}.inf ha-icon{--mdc-icon-size:1.1em}.inf img{width:1.1em;height:1.1em}.inf b{font-weight:400}
.row .inf{justify-content:flex-start}
.txt{display:flex;flex-direction:column;gap:6px;align-items:center;min-width:0;max-width:100%}`;
  var hand = (cls, w, len, back) => `<path class="${cls}" d="M${C - w / 2} ${C + back} L${C - w / 2 + 0.4} ${C - len} Q${C} ${C - len - w / 2} ${C + w / 2 - 0.4} ${C - len} L${C + w / 2} ${C + back} Z"/>`;
  var SVG2 = `<svg viewBox="0 0 200 200" aria-hidden="true" class="scene"><defs>${dialDefs("k", C, C, R2)}</defs>${dialBody("k", C, C, R2)}
<g class="hh"><g transform="translate(1.2 1.6)" class="hsh">${hand("", 6, 44, 10)}</g>${hand("hd", 6, 44, 10)}</g>
<g class="mh"><g transform="translate(1.2 1.6)" class="hsh">${hand("", 4.2, 64, 12)}</g>${hand("md", 4.2, 64, 12)}</g>
<g class="sh">${hand("sd", 1.6, 70, 18)}<circle class="sd" cx="${C}" cy="${C + 14}" r="3"/></g>
<circle class="cap" cx="${C}" cy="${C}" r="5"/><circle class="cap2" cx="${C}" cy="${C}" r="1.8"/>
${dialGlass("k", C, C, R2)}</svg>`;
  var NovaClockCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("clock-card-editor"));
    }
    static getStubConfig() {
      return {};
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      this._c = { ...DEF3, ...c };
      this._ents = (Array.isArray(c.entities) ? c.entities : []).map((x) => typeof x === "string" ? { entity: x } : { ...x }).filter((x) => x.entity);
      this._ids = this._ents.map((x) => x.entity);
      this._fmtKey = null;
      if (this._e) {
        this._layout();
        this._draw();
        this._vals();
        this._plan();
      }
    }
    // Nur Sprache, Zeitformat und Zeitzone aus hass sind wichtig – Zustände nicht
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._e) {
        this._build();
        this._draw();
        this._vals();
        this._plan();
        return;
      }
      if (!old || old.locale !== h.locale || old.config !== h.config || old.language !== h.language) {
        this._fmtKey = null;
        this._draw();
      }
      if (this._ents.length && hassChanged(old, h, this._ids)) this._vals();
    }
    connectedCallback() {
      this._quiet = inPicker(this);
      if (!this._e && this._c && this._h) this._build();
      this._stopVis?.();
      this._stopVis = watchVisible(this, (v) => {
        const was = this._vis;
        this._vis = v && !this._quiet;
        if (this._vis && !was && this._c?.mode === "analog" && this._c.animation !== false) sweep(this._e?.g);
        this._draw();
        this._plan();
      });
    }
    disconnectedCallback() {
      this._stopVis?.();
      this._stopVis = null;
      this._vis = false;
      clearTimeout(this._t);
      this._t = null;
    }
    getCardSize() {
      return this._c?.mode === "analog" ? 4 : 2;
    }
    getGridOptions() {
      return { columns: 6, rows: "auto", min_columns: 3 };
    }
    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${CCSS}</style><div class="g ck"><div class="ana">${SVG2}</div>
<div class="txt"><div class="nm"></div><div class="tm"></div><div class="dt"></div><div class="inf"></div></div></div>`;
      const q = (s) => r.querySelector(s);
      this._e = { g: q(".g"), ana: q(".ana"), nm: q(".nm"), tm: q(".tm"), dt: q(".dt"), inf: q(".inf"), hh: q(".hh"), mh: q(".mh"), sh: q(".sh") };
      const act = () => ({ tap_action: this._c.tap_action, hold_action: this._c.hold_action });
      press(this._e.g, { tap: () => runAction(this, act(), "tap", true), hold: () => runAction(this, act(), "hold") });
      this._layout();
    }
    _layout() {
      const c = this._c, e = this._e, rv = roleVars(c.color), an = c.mode === "analog";
      e.g.style.setProperty("--kc", rv.c);
      e.ana.hidden = !an;
      e.tm.hidden = an && !c.analog_digital;
      e.g.classList.toggle("flat", c.glass === false);
      this.classList.toggle("nv-flat", c.glass === false);
      e.nm.hidden = !c.name;
      e.nm.textContent = c.name || "";
      e.inf.hidden = !this._ents.length;
      e.inf.replaceChildren(...this._ents.map(() => {
        const sp = document.createElement("span");
        sp.innerHTML = "<i></i><b></b>";
        return sp;
      }));
      e.g.classList.toggle("row", an && !!(c.show_date || c.show_weekday || c.analog_digital || c.name || this._ents.length));
    }
    // Werte-Zeile: nur neu schreiben, wenn sich eine der Entitäten ändert
    _vals() {
      const e = this._e, h = this._h;
      if (!e || !h || !this._ents.length) return;
      this._ents.forEach((o, i) => {
        const sp = e.inf.children[i], s = h.states[o.entity];
        if (!sp) return;
        setIcon(sp.firstChild, iconOf(h, o, "mdi:information-outline"));
        sp.lastChild.textContent = valueOf(h, s, o);
        sp.title = o.name ?? s?.attributes.friendly_name ?? o.entity;
      });
    }
    // Formatierer nur neu bauen, wenn sich Sprache/Zeitzone/Optionen ändern
    _fmts() {
      const h = this._h, c = this._c, lang = langOf(h), tz = tzOf(h), tf = c.time_format === "auto" ? h?.locale?.time_format : c.time_format;
      const key = JSON.stringify([lang, tz, tf, c.date_format, c.show_seconds]);
      if (key === this._fmtKey) return this._f;
      this._fmtKey = key;
      const mk = (o) => {
        try {
          return new Intl.DateTimeFormat(lang, { ...o, timeZone: tz });
        } catch {
          return new Intl.DateTimeFormat(lang, o);
        }
      };
      const h12 = tf === "12" ? true : tf === "24" ? false : void 0;
      const time = mk({ hour: "2-digit", minute: "2-digit", second: "2-digit", ...h12 != null ? { hour12: h12 } : {} });
      const DF = { long: { day: "numeric", month: "long" }, short: { day: "numeric", month: "short" }, numeric: { day: "2-digit", month: "2-digit", year: "numeric" } };
      this._f = { time, wd: mk({ weekday: "long" }), date: mk(DF[c.date_format] || DF.long) };
      return this._f;
    }
    _draw() {
      const e = this._e, c = this._c;
      if (!e || !this._h) return;
      const f2 = this._fmts(), now = /* @__PURE__ */ new Date();
      const p = Object.fromEntries(f2.time.formatToParts(now).map((x) => [x.type, x.value]));
      if (!e.tm.hidden) {
        const html = `${esc(p.hour)}<span class="cl">:</span>${esc(p.minute)}${c.show_seconds ? `<span class="sc">${esc(p.second)}</span>` : ""}${p.dayPeriod ? `<span class="ap">${esc(p.dayPeriod)}</span>` : ""}`;
        if (this._tmH !== html) {
          this._tmH = html;
          e.tm.innerHTML = html;
        }
      }
      const wd = c.show_weekday ? f2.wd.format(now) : "", dt = c.show_date ? f2.date.format(now) : "";
      const dh = [wd && esc(wd), dt && esc(dt)].filter(Boolean).join(", ");
      e.dt.hidden = !dh;
      if (this._dtH !== dh) {
        this._dtH = dh;
        e.dt.innerHTML = dh;
      }
      if (!e.ana.hidden) {
        const h24 = +p.hour % 12, mm = +p.minute, ss = +p.second;
        e.hh.setAttribute("transform", `rotate(${((h24 + mm / 60) * 30).toFixed(2)} ${C} ${C})`);
        e.mh.setAttribute("transform", `rotate(${((mm + (c.show_seconds ? ss / 60 : 0)) * 6).toFixed(2)} ${C} ${C})`);
        e.sh.style.display = c.show_seconds ? "" : "none";
        if (c.show_seconds) e.sh.setAttribute("transform", `rotate(${ss * 6} ${C} ${C})`);
      }
    }
    // Ein Zeitgeber: zum nächsten Sekunden- (mit Sekunden) bzw. Minutenwechsel; nur sichtbar und nicht in der Kartenauswahl
    _plan() {
      clearTimeout(this._t);
      this._t = null;
      if (!this._vis || !this._e) return;
      const step = this._c.show_seconds ? 1e3 : 6e4, now = Date.now();
      this._t = setTimeout(() => {
        this._t = null;
        this._draw();
        this._plan();
      }, step - now % step + 15);
    }
  };
  define("clock-card", NovaClockCard, { name: "Nova Uhr Card", description: "Uhrzeit digital oder analog im Nova-Stil, wahlweise mit Sekunden, Wochentag und Datum.", documentationURL: docUrl("nova-uhr-card") });
  var S_GEN2 = [
    sel("mode", [["digital", "Digital"], ["analog", "Analog (Zifferblatt)"]]),
    { name: "name", selector: T }
  ];
  var S_SHOW = (c) => [
    g2({ name: "show_seconds", selector: { boolean: {} } }, ...c.mode === "analog" ? [{ name: "analog_digital", selector: { boolean: {} } }] : []),
    g2({ name: "show_weekday", selector: { boolean: {} } }, { name: "show_date", selector: { boolean: {} } }),
    { name: "entities", selector: { entity: { multiple: true, domain: ["sensor", "binary_sensor", "input_number", "number", "input_text", "input_select"] } } },
    g2(sel("date_format", [["long", "2. November"], ["short", "2. Nov."], ["numeric", "02.11.2026"]]), sel("time_format", [["auto", "Wie im Profil"], ["24", "24 Stunden"], ["12", "12 Stunden (AM/PM)"]]))
  ];
  var S_LOOK2 = [g2(ROLE("color"), { name: "glass", selector: { boolean: {} } })];
  var S_ACT2 = [{ name: "tap_action", selector: A }, { name: "hold_action", selector: A }];
  var LABELS3 = {
    mode: "Art der Uhr",
    name: "Überschrift (optional)",
    show_seconds: "Sekunden",
    analog_digital: "Zusätzlich digitale Zeit",
    show_weekday: "Wochentag",
    show_date: "Datum",
    date_format: "Datumsformat",
    time_format: "Zeitformat",
    color: "Akzentfarbe",
    glass: "Glas-Hintergrund",
    tap_action: "Aktion beim Antippen",
    hold_action: "Aktion bei langem Drücken",
    entities: "Werte unter der Uhr"
  };
  var HELPERS3 = {
    show_seconds: "Sekunden kosten etwas mehr Akku/Leistung – auf alten Tablets lieber aus.",
    color: "Sekundenzeiger der analogen Uhr. Die Farben selbst kommen aus dem Theme.",
    glass: "Aus = Uhr ohne Kartenhintergrund, z. B. direkt auf dem Dashboard-Bild.",
    entities: "Optional: z. B. Temperatur und Luftfeuchte – erscheinen klein in einer Zeile unter der Uhrzeit."
  };
  var NovaClockCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const data = () => ({ ...DEF3, ...this._config });
      const form = (s) => this._form(s, data(), (v) => {
        const was = this._config.mode, c = merge(this._config, names(s), v);
        Object.keys(DEF3).forEach((k) => {
          if (c[k] === DEF3[k]) delete c[k];
        });
        this._emit(c);
        if ((c.mode || DEF3.mode) !== (was || DEF3.mode)) this._rebuild();
      });
      r.querySelector(".wrap").append(
        this._section("general", "mdi:clock-outline", "Uhr", (b) => b.append(form(S_GEN2))),
        this._section("show", "mdi:calendar-today", "Anzeige", (b) => b.append(form(S_SHOW(data())))),
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(S_LOOK2))),
        this._section("actions", "mdi:gesture-tap", "Aktionen", (b) => b.append(form(S_ACT2)))
      );
    }
  };
  __publicField(NovaClockCardEditor, "labels", LABELS3);
  __publicField(NovaClockCardEditor, "helpers", HELPERS3);
  __publicField(NovaClockCardEditor, "openSections", ["general", "show"]);
  define("clock-card-editor", NovaClockCardEditor);

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
      return (h) => {
        let shown = 0;
        els.forEach(([el2, o]) => {
          const off = !!o.hide_idle && idleState(h.states[o.entity]);
          el2.style.display = off ? "none" : "";
          shown += !off;
        });
        w.style.display = shown ? "" : "none";
        els.forEach(([el2, o]) => {
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
      };
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
      box.className = `pills${b.layout === "grid" ? " grid" : b.layout === "flat" ? " flat" : ""}`;
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
      const z = +this._c.size;
      if (z > 0 && z !== 100) this._g.style.zoom = z / 100;
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
      items: [
        ENT,
        NAMEICON,
        g2({ name: "unit", selector: T }, { name: "decimals", selector: { number: { min: 0, max: 4, mode: "box" } } }),
        g2(sel("format", [["value", "Wie die Entität"], ["clock", "Dauer als Uhr (m:ss)"]]), { name: "hide_idle", selector: { boolean: {} } }),
        { name: "tap_action", selector: A }
      ]
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
      schema: [TITLE, sel("layout", [["pills", "Pillen"], ["flat", "Flache Leiste"], ["grid", "Kacheln"]])],
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
  var MLOOK = [{ name: "size", selector: { number: { min: 50, max: 250, step: 10, mode: "slider", unit_of_measurement: "%" } } }];
  var MHELPERS = {
    size: "Skaliert die ganze Karte, z. B. 150 % für Wandpanels. Standard 100 %",
    status: "Text unter dem Namen. Aus/Standby/Idle = inaktiv",
    active: "Optional: bestimmt, ob das Icon leuchtet (statt Status-Entität)",
    button_icon: "Button erscheint, sobald Icon oder Aktion gesetzt ist",
    unit: "Überschreibt die Einheit der Entität",
    confirm: "Optional: Text der Rückfrage vor dem Auslösen",
    state: "Mehrere mit Komma trennen. Ohne Bedingung: Warnung bei „on“ bzw. „problem“",
    message: "Leer = Name: Zustand. {state} wird ersetzt",
    min: "Leer = Werte der Entität",
    hide_idle: "Zeile nur zeigen, solange der Wert nicht 0 bzw. aus ist – z. B. Restzeit nur während das Gerät läuft"
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
      r.querySelector(".wrap").append(
        this._section("blocks", "mdi:view-dashboard-outline", "Bausteine", (w) => this._blockList(w)),
        this._section("look", "mdi:palette-outline", "Aussehen", (w) => w.append(this._form(MLOOK, { size: 100, ...this._config }, (v) => {
          const n = merge(this._config, ["size"], v);
          if (n.size === 100) delete n.size;
          this._emit(n);
        })))
      );
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
  __publicField(NovaModularCardEditor, "labels", { ...BASE_LABELS, size: "Größe", hide_idle: "Bei 0 / aus ausblenden" });
  __publicField(NovaModularCardEditor, "helpers", MHELPERS);
  __publicField(NovaModularCardEditor, "openSections", ["blocks"]);
  define("modular-card-editor", NovaModularCardEditor);
})();
