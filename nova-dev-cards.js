/* Nova Cards v0.11.1 DEV (nur swipe, timer, clock, modular, appliance, shopping, note, area, navi, popup) – Testbuild, alle Karten als custom:nova-dev-*. Nicht veröffentlichen. */
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
  var FIELD_CSS = `
.fld{box-sizing:border-box;width:100%;min-width:0;margin:0;border:1px solid var(--nv-box-border);background:var(--nv-box);color:var(--nv-fg);
font:inherit;font-size:16px;outline:none;-webkit-appearance:none;appearance:none;transition:border-color .2s,box-shadow .2s,background-color .2s}
.fld::placeholder{color:var(--nv-fg);opacity:.45}
.fld:focus{border-color:color-mix(in srgb,var(--nv-active) 75%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,var(--nv-active) 22%,transparent);background:color-mix(in srgb,var(--nv-box) 70%,rgba(255,255,255,.06))}`;

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
  var fitLabels = (root, sel2, collapse) => root?.querySelectorAll(sel2).forEach((k) => {
    if (collapse) k.style.display = "";
    const cut = k.offsetParent !== null && k.scrollWidth > k.clientWidth + 1;
    if (collapse) k.style.display = cut ? "none" : "";
    else k.style.visibility = cut ? "hidden" : "";
    const p = k.parentElement;
    if (cut) p.title = k.textContent;
    else if (p.title === k.textContent) p.removeAttribute("title");
  });

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

  // src/swipe.js
  var DEF = { dots: true, reset_after: 0, fill: false, fit_screen: false, margin: 0, stack_below: 500 };
  var SCSS = `${NOVA_VARS}${GRID_CSS}
:host{display:block;box-sizing:border-box}
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
        this._fit();
        this._pages.forEach((p) => p._stack());
        this.go(this._i, false);
      });
      this._onResize = () => this._fit();
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
      if (DEV && !window.__novaVp && h.callService) {
        window.__novaVp = 1;
        setTimeout(() => h.callService("system_log", "write", { message: `Nova Dev Swipe: Fenster ${innerWidth}×${innerHeight} px, DPR ${devicePixelRatio}, Karte ${Math.round(this.getBoundingClientRect().height)} px hoch`, level: "warning", logger: "nova_cards.dev" })?.catch?.(() => {
        }), 3e3);
      }
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
      window.addEventListener("resize", this._onResize);
      window.addEventListener("nova-swipe-goto", this._onGoto);
      if (this._dirty && this._cfg) this._render();
      this._poke();
    }
    disconnectedCallback() {
      this._ro.disconnect();
      window.removeEventListener("resize", this._onResize);
      window.removeEventListener("nova-swipe-goto", this._onGoto);
      clearTimeout(this._rt);
      this._rt = null;
      cancelAnimationFrame(this._raf);
      this._raf = 0;
      if (this._prev) this._pages.forEach((p) => p._handOffCells());
    }
    // Editor-Vorschau (Zellen übernehmen, Seite folgt dem Editor) bzw. Bearbeitungsmodus (leere Plätze zeigen)
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
      this._w.classList.toggle("prev", prev2 || edit);
    }
    _render() {
      this._dirty = false;
      const c = this._cfg, list2 = Array.isArray(c.pages) && c.pages.length ? c.pages : [{ rows: [] }];
      const fill = !!c.fill || !!c.fit_screen;
      this.classList.toggle("fill", fill);
      this._w.classList.toggle("fill", fill);
      const m = Math.max(0, +c.margin || 0);
      if (m) this.style.padding = `${m}px`;
      else this.style.removeProperty("padding");
      this._fit();
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
    // Bis zum unteren Bildschirmrand: Höhe = sichtbares Fenster minus Abstand oben, minus 8 px unten
    // (mit Rand steckt der Abstand unten schon im Rand).
    // Unabhängig davon, ob der Browser 100vh/100dvh richtig kennt (z. B. Silk auf dem Echo Show) – innerHeight stimmt immer.
    _fit() {
      if (!this._cfg?.fit_screen) {
        if (this._fitH) {
          this._fitH = 0;
          this.style.removeProperty("height");
        }
        return;
      }
      const top = this.getBoundingClientRect().top + (window.scrollY || 0);
      const hgt = Math.max(160, Math.floor(window.innerHeight - Math.max(0, top) - (+this._cfg.margin > 0 ? 0 : 8)));
      if (hgt !== this._fitH) {
        this._fitH = hgt;
        this.style.height = `${hgt}px`;
      }
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
    g2({ name: "fit_screen", selector: { boolean: {} } }, { name: "margin", selector: { number: { min: 0, max: 48, step: 2, mode: "box", unit_of_measurement: "px" } } }),
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
    fit_screen: "Bis zum unteren Bildschirmrand",
    margin: "Rand",
    reset_after: "Zurück zu Seite 1 nach",
    stack_below: "Untereinander unter Breite"
  };
  var HELPERS = {
    ...GRID_HELPERS,
    name: "Nur für dich im Editor und als Hinweis an den Punkten.",
    fit_screen: "Für Wand-Displays wie den Echo Show: Die Karte endet genau am unteren Rand des sichtbaren Fensters, auch wenn der Browser die Höhe falsch meldet. Schließt „Ganze Höhe ausfüllen“ ein.",
    margin: "Luft rundherum. In einer Panel-Ansicht reichen 8 px, damit die Karten nicht am Fensterrand kleben.",
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
    _pagesBody(b, pages, cur2) {
      b.append(this._hint("Jede Seite ist ein eigenes Raster aus Karten. Antippen wählt die Seite zum Bearbeiten (die Vorschau springt mit), am Griff ziehen sortiert."));
      const box = document.createElement("div");
      box.className = "pgs";
      this._pgEls = pages.map((p, k) => {
        const e = document.createElement("div");
        e.className = `pgb${k === cur2 ? " sel" : ""}`;
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
          this._setPages(ps, cur2 === k ? k + d : cur2 === k + d ? k : cur2);
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
            this._setPages(ps.length ? ps : [{ rows: [] }], Math.min(cur2, ps.length - 1));
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
          const ps = this._list(), cur2 = this._cur(), x = ps[k], selPage = ps[cur2];
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
/* Außerhalb der Animation zusätzlich unsichtbar: manche Browser (Echo Show) zeigen den geparkten Streifen sonst als hellen Balken neben dem Glas */
.scene .s-gls{opacity:0;visibility:hidden;transform-box:view-box}
.sweep .scene .s-gls{animation:nv-glare .9s .1s ease-in-out both}
.scene .s-scr{fill:${PAL.screen};stroke:rgba(255,255,255,.18);stroke-width:.5}.scene .s-tgl{fill:#fff;opacity:.05}
.still .scene .s-gls{animation-play-state:paused!important}
@keyframes nv-glare{0%{opacity:0;visibility:visible;transform:translateX(0)}15%{opacity:.7}85%{opacity:.7}99%{opacity:0;visibility:visible}100%{opacity:0;visibility:hidden;transform:translateX(var(--gx,70px))}}
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
    const top = cy - r, grooves = [-12, -9, -6, -3, 0, 3, 6, 9, 12].map((x) => `M${cx + x} ${top - 16}v8`).join("");
    const pusher = (side, a) => `<g class="dl-push ${side}" transform="rotate(${a} ${cx} ${cy})"><rect class="s-part" x="${cx - 5}" y="${top - 9}" width="10" height="10" rx="2" fill="url(#${p}-pt)"/><rect class="dl-cap" x="${cx - 6.5}" y="${top - 12}" width="13" height="4" rx="1.5" fill="url(#${p}-cr)"/></g>`;
    return `${pusher("l", -40)}${pusher("r", 40)}
<rect class="s-part" x="${cx - 5}" y="${top - 8}" width="10" height="9" rx="1.5" fill="url(#${p}-pt)"/>
<g class="dl-crown"><rect class="dl-cr" x="${cx - 10}" y="${top - 19}" width="20" height="12" rx="3" fill="url(#${p}-cr)"/><clipPath id="${p}-cc"><rect x="${cx - 7.5}" y="${top - 19}" width="15" height="12"/></clipPath><g clip-path="url(#${p}-cc)"><g class="dl-gv"><path class="dl-grv" d="${grooves}"/></g></g></g>`;
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
/* Unsichtbares mit Leuchten (drop-shadow) zusätzlich per visibility weg – manche Browser (Echo Show) malen den Schatten sonst als Fleck */
.scene .dl-bell{opacity:0;visibility:hidden;transform-box:fill-box;transform-origin:center}
.scene .dl-br{fill:var(--dc);filter:drop-shadow(0 0 4px var(--dc))}.scene .dl-bk{fill:var(--dcfg,#fff)}
@media (prefers-reduced-motion:reduce){.scene *{animation:none!important;transition:none!important}}`;

  // src/timer.js
  var DEF2 = {
    presets: [1, 5, 10, 15],
    show_presets: true,
    show_custom: true,
    custom_units: "auto",
    custom_picker: "scale",
    scale_max: 180,
    scale_speed: "normal",
    click_sound: true,
    custom_input: true,
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
  var SP = 10;
  var SPEED = { slow: { k: 0.8, max: 1, fr: 0.94 }, normal: { k: 1.5, max: 2, fr: 0.955 }, fast: { k: 3, max: 4, fr: 0.965 } };
  var parseIn = (x) => {
    const p = String(x).trim().replace(",", ":").split(/[:.\s]+/).filter(Boolean).map(Number);
    if (!p.length || p.some((n) => !Number.isFinite(n) || n < 0)) return 0;
    return Math.round(p.length === 1 ? p[0] * 60 : p.length === 2 ? p[0] * 60 + p[1] : p[0] * 3600 + p[1] * 60 + p[2]);
  };
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
/* Nur-Icon-Knöpfe in „Eigene Zeit“: Icon hell, sonst verschwindet z. B. das Häkchen auf dem getönten Knopf */
.cust .bt2.pri ha-icon{color:inherit}
.bt2.sel{border-color:color-mix(in srgb,var(--dc) 70%,transparent);background:color-mix(in srgb,var(--dc) 14%,var(--nv-chip))}
.pre{display:grid;grid-template-columns:repeat(var(--n,4),minmax(0,1fr));gap:8px}
.pre .bt2{font-size:16px;font-weight:600}
.zone{position:relative;display:flex;flex-direction:column;gap:10px;justify-content:center;min-width:0}
/* Eigene Zeit liegt über Start/Schnellwahl (die bleiben unsichtbar stehen) – die Karte wird nie höher oder niedriger */
.zone.op>.main,.zone.op>.pre{visibility:hidden}
.cust{position:absolute;inset:0;display:flex;flex-direction:column;gap:10px;justify-content:center;min-height:0}
.cust.sc{display:grid;grid-template-columns:minmax(0,1fr) minmax(84px,40%);grid-template-rows:minmax(0,1fr) auto;gap:10px}
.cust:not(.sc) .scl,.cust:not(.sc) .rd,.cust.sc .stps{display:none}
.cust.sc .rd{grid-column:1;grid-row:1}.cust.sc .row2{grid-column:1;grid-row:2;flex-wrap:nowrap}.cust.sc .scl{grid-column:2;grid-row:1/3}
/* Tuner-Skala: Striche wandern beim Ziehen (nur transform), die Marke in der Mitte zeigt die Zeit */
.rd{display:flex;align-items:center;justify-content:center;min-width:0;min-height:0;contain:strict}
.rd b{font-size:clamp(26px,10cqw,52px);font-weight:600;font-variant-numeric:tabular-nums;line-height:1;white-space:nowrap}
.rd.in b{cursor:text}
.rd input{width:100%;max-width:6.5em;box-sizing:border-box;font:inherit;font-size:clamp(20px,7cqw,36px);font-weight:600;text-align:center;color:inherit;background:var(--nv-chip);border:1px solid color-mix(in srgb,var(--dc) 60%,transparent);border-radius:12px;padding:6px;outline:none}
.scl{position:relative;overflow:hidden;min-height:0;border-radius:16px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);touch-action:none;cursor:grab;outline:none;user-select:none;-webkit-user-select:none;
contain:strict}
/* Abdunkeln oben/unten als feste Ebene darüber – eine Maske müsste bei jeder Bewegung neu gerechnet werden (ruckelt auf schwachen Geräten) */
.scl::before,.scl::after{content:'';position:absolute;left:0;right:0;height:26%;z-index:1;pointer-events:none}
.scl::before{top:0;background:linear-gradient(rgba(0,0,0,.35),transparent)}.scl::after{bottom:0;background:linear-gradient(transparent,rgba(0,0,0,.35))}
.scl:focus-visible{border-color:color-mix(in srgb,var(--dc) 70%,transparent)}
.scl .str{position:absolute;left:0;right:0;top:0;height:0;will-change:transform}
.scl .str.snap{transition:transform .22s cubic-bezier(.2,.8,.3,1)}
.scene .dl-gv{transform-box:view-box}
.scl i{position:absolute;left:10px;width:16%;height:1.5px;margin-top:-.75px;background:rgba(255,255,255,.2)}
.scl i.m{width:34%;background:rgba(255,255,255,.5)}
.scl b{position:absolute;left:calc(10px + 34% + 8px);height:16px;margin-top:-8px;line-height:16px;font-size:13px;font-weight:600;opacity:.7;font-variant-numeric:tabular-nums;white-space:nowrap}
.scl .mk{z-index:2;position:absolute;left:0;right:0;top:50%;height:2px;margin-top:-1px;background:var(--dc);box-shadow:0 0 8px color-mix(in srgb,var(--dc) 60%,transparent);pointer-events:none}
.scl .mk::before{content:'';position:absolute;left:0;top:-5px;border:6px solid transparent;border-left:7px solid var(--dc);border-right:0}
/* Eigene Zeit: je Einheit [−] 05 Min [+] nebeneinander, so hoch wie Schnellwahl + Knöpfe – die Karte wächst nicht */
.stps{display:flex;gap:8px}
.stp{flex:1 1 0;display:flex;align-items:center;justify-content:space-between;gap:2px;padding:0 3px;min-width:0;border-radius:16px;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);height:var(--nova-timer-button-height,52px);box-sizing:border-box}
.stp .mi{order:0}.stp .v{order:1;flex:1;text-align:right;font-size:19px;font-weight:600;font-variant-numeric:tabular-nums}.stp small{order:2;flex:1;text-align:left;font-size:11px;opacity:.6;margin-left:4px}.stp .pl{order:3}
.stp .hb{width:34px;height:42px;flex:none;border-radius:12px}
.stp .hb ha-icon{--mdc-icon-size:22px}
.msg{display:flex;align-items:center;gap:10px;padding:12px 14px;border-radius:16px;font-size:16px;font-weight:600;
background:color-mix(in srgb,var(--ac) 18%,var(--nv-chip));border:1px solid color-mix(in srgb,var(--ac) 50%,transparent)}
.msg ha-icon{color:var(--ac);--mdc-icon-size:26px}
.anim .msg ha-icon{animation:tm-ring 1.2s ease-in-out infinite;transform-origin:50% 10%}
.alm .dl-bell{opacity:1;visibility:visible}
.anim.alm.fx .dl-bell{animation:tm-pop .45s ease-out both}
.anim.alm .dl-crown,.anim.alm .dl-push{animation:tm-press 1.2s ease-in-out infinite}
.anim.alm .rot{animation:tm-shake 1.2s ease-in-out infinite;transform-box:view-box;transform-origin:100px 112px}
.scene .snd path{fill:none;stroke:var(--ac);stroke-width:2;stroke-linecap:round;opacity:0}
.anim.alm .snd path{animation:tm-snd 1.2s ease-out infinite}.anim.alm .snd path:nth-child(2n){animation-delay:.25s}
.alm:not(.anim) .snd path{opacity:.7}
.st-active .dl-push.r{animation:none}
.prs .dl-push.r,.prs .dl-crown{animation:tm-press .35s ease-out}
.scene .tip{fill:#fff;filter:drop-shadow(0 0 3px var(--dc));opacity:0;visibility:hidden;transition:opacity .4s,visibility 0s .4s}
.st-active .scene .tip,.st-paused .scene .tip{opacity:1;visibility:visible;transition:opacity .4s}
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
.cmp .zone,.cmp .msg{grid-column:1/-1}
.cmp .zone{min-height:calc(2 * var(--nova-timer-button-height,52px) + 10px)}
.cmp .msg{display:none}
.ct2 .tt b{display:block;font-size:42px;font-weight:600;font-variant-numeric:tabular-nums;line-height:1.1}
.ct2 .tt small{display:block;font-size:12.5px;opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ct2 .tt i{font-style:normal;opacity:.75}
.full .ct2{display:none}
.cmp.alm .tt b{color:var(--ac)}
@container (max-width:340px){.main.n3 .bt2 ha-icon{display:none}.bt2{font-size:14px}}
@container (max-width:260px){.main .bt2 span{display:none}.main .bt2 ha-icon{display:flex!important}}
@container (min-width:400px){.full .bd{flex-direction:row;align-items:center}.full .dial{width:46%;max-width:var(--nova-timer-size,260px)}.full .ctl{flex:1;align-self:stretch}.full .zone{flex:1}}
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
      else if (this._ro && this._e) {
        this._ro.observe(this._e.dial);
        this._ro.observe(this._e.g);
      }
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
      this._stopFling();
      this._ac?.close?.().catch(() => {
      });
      this._ac = null;
      this._clk = null;
      this._drag = false;
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
<div class="zone"><div class="row2 main"></div><div class="pre"></div>
<div class="cust" hidden><div class="rd"><b></b></div><div class="scl" tabindex="0" role="slider" aria-label="Eigene Zeit"><div class="str"></div><div class="mk"></div></div><div class="stps">${["h|Std", "m|Min", "s|Sek"].map((x) => {
        const [k, l] = x.split("|");
        return `<div class="stp" data-k="${k}"><small>${l}</small><div class="hb pl"><ha-icon icon="mdi:plus"></ha-icon></div><span class="v"></span><div class="hb mi"><ha-icon icon="mdi:minus"></ha-icon></div></div>`;
      }).join("")}</div>
<div class="row2"><div class="bt2 cbk"><ha-icon icon="mdi:close"></ha-icon><span>Zurück</span></div><div class="bt2 pri cgo"><ha-icon icon="mdi:check"></ha-icon><span>Übernehmen</span></div></div></div></div>
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
        gv: q(".dl-gv"),
        zone: q(".zone"),
        rd: q(".rd"),
        scl: q(".scl"),
        str: q(".str"),
        tip: q(".tipg")
      };
      this._scaleInit();
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
        const { h, m, s } = this._cust, u = this._units(), sec = this._scale() ? this._sec : (u.includes("h") ? h : 0) * 3600 + m * 60 + (u.includes("s") ? s : 0);
        if (sec > 0) {
          this._armed = sec;
          this._showCust = false;
          this._key = null;
          this._render();
        }
      } });
      if ("ResizeObserver" in window) {
        this._ro = new ResizeObserver((es) => {
          es.forEach((x) => {
            if (x.target === this._e.dial && x.contentRect.width) this._e.dial.style.setProperty("--dw", `${x.contentRect.width}px`);
          });
          this._fitBtn();
          if (this._scale() && !this._e.cust.hidden) this._scaleTo(this._sec, false);
        });
        this._ro.observe(this._e.dial);
        this._ro.observe(this._e.g);
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
      if (s.state === "idle" && this._armed > 0) return { st: s.state, total: this._armed, left: this._armed, fin: a.finishes_at };
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
      const B = (cls, icon2, label, fn) => b.push([cls, icon2, label, fn]);
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
          if (this._showCust) this._custFrom(v?.total || 0);
          this._key = null;
          this._render();
        });
      }
      e.main.innerHTML = "";
      e.main.classList.toggle("n3", b.length > 2);
      b.forEach(([cls, icon2, label, fn]) => {
        const d = document.createElement("div");
        d.className = `bt2 ${cls}`;
        d.title = label;
        d.innerHTML = `<ha-icon icon="${icon2}"></ha-icon><span>${esc(label)}</span>`;
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
      e.zone.classList.toggle("op", !e.cust.hidden);
      if (!e.cust.hidden) this._custShow();
      this._fitBtn();
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
      this._armed = 0;
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
    // Einheiten der eigenen Zeit: auto = groß Std/Min/Sek, kompakt Min/Sek; sonst jede Kombination aus h, m, s (z. B. „hm“, „s“)
    _units() {
      const u = String(this._c.custom_units || "auto"), l = u === "auto" ? "" : ["h", "m", "s"].filter((k) => u.includes(k)).join("");
      return [...l || (this._c.layout === "compact" ? "ms" : "hms")];
    }
    // Größter Wert je Feld: die kleinste gewählte Einheit nimmt den Rest auf (nur Minuten → bis 180, nur Sekunden → bis 59:55)
    _max(k) {
      const u = this._units();
      if (k === "h") return u.length === 1 ? 24 : 23;
      if (k === "m") return u.includes("h") ? 59 : 180;
      return u.includes("m") ? 55 : 3595;
    }
    _step(k, d) {
      const c = this._cust, st = k === "s" ? 5 : 1, n = this._max(k) + st;
      c[k] = ((Math.round(c[k] / st) * st + d * st) % n + n) % n;
      this._custShow();
    }
    // Auswahl beginnt mit der eingestellten Zeit (5:00 → 0 Std, 5 Min, 0 Sek); fehlt eine größere Einheit, zählt ihr Teil in der nächstkleineren
    _custFrom(sec) {
      if (this._scale()) {
        this._sec = sec > 0 ? Math.min(sec, this._vals.at(-1)) : 300;
        return;
      }
      const t = Math.max(0, Math.round(sec)), u = this._units(), H2 = u.includes("h"), M = u.includes("m"), S = u.includes("s");
      const c = { h: 0, m: 0, s: 0 };
      if (H2) c.h = Math.min(this._max("h"), M || S ? Math.floor(t / 3600) : Math.round(t / 3600));
      if (M) c.m = Math.min(this._max("m"), Math.floor((H2 ? t % 3600 : t) / 60) + (S ? 0 : Math.round(t % 60 / 60)));
      if (S) c.s = Math.min(this._max("s"), Math.round((M ? t % 60 : H2 ? t % 3600 : t) / 5) * 5);
      if (!c.h && !c.m && !c.s) {
        if (M) c.m = 5;
        else if (H2) c.h = 1;
        else c.s = 30;
      }
      this._cust = c;
    }
    // Knopf-Texte, die nicht passen, weglassen – der Knopf zeigt dann nur sein Icon (nie „Überne…“)
    _fitBtn() {
      if (this._e) fitLabels(this.shadowRoot, ".bt2 > span", true);
    }
    _custShow() {
      const e = this._e, sc = this._scale();
      e.cust.classList.toggle("sc", sc);
      if (sc) {
        this._scaleBuild();
        e.rd.classList.toggle("in", this._c.custom_input !== false);
        requestAnimationFrame(() => this._scaleTo(this._sec, false));
        return;
      }
      const u = this._units();
      this._e.cust.querySelectorAll(".stp").forEach((st) => {
        st.hidden = !u.includes(st.dataset.k);
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
    /* ---------- Eigene Zeit als Tuner-Skala ----------
       Senkrechte Skala, mit dem Finger hoch/runter ziehen. Raster: bis 5 Min 15 s, bis 15 Min 30 s, bis 60 Min 1 Min, darüber 5 Min.
       Schnelles Wischen läuft mit Schwung aus und rastet dann ein. Pro Raster ein leiser Klick (und Vibration, wo es geht).
       Pro Bild wird nur transform gesetzt – nichts wird neu gezeichnet. */
    _scale() {
      return this._c?.custom_picker !== "buttons";
    }
    get _vals() {
      const max = Math.max(5, Math.min(1440, +this._c?.scale_max || 180)) * 60;
      if (this._valsFor === max) return this._valsC;
      const v = [];
      for (let t = 15; t <= Math.min(300, max); t += 15) v.push(t);
      for (let t = 330; t <= Math.min(900, max); t += 30) v.push(t);
      for (let t = 960; t <= Math.min(3600, max); t += 60) v.push(t);
      for (let t = 3900; t <= max; t += 300) v.push(t);
      this._valsFor = max;
      this._valsC = v;
      return v;
    }
    _scaleBuild() {
      const vals = this._vals, key = vals.length + "|" + vals.at(-1);
      if (this._strKey === key) return;
      this._strKey = key;
      const LBL = /* @__PURE__ */ new Set([1, 2, 3, 4, 5, 10, 15, 20, 30, 45, 60, 90, 120, 150, 180, 240, 300, 360, 480, 600, 720, 900, 1080, 1260, 1440]);
      this._e.str.innerHTML = vals.map((t, i) => {
        const y = i * SP, maj = t <= 900 ? t % 60 === 0 : t <= 3600 ? t % 300 === 0 : t % 900 === 0, min = t / 60;
        return `<i${maj ? ' class="m"' : ""} style="top:${y}px"></i>${maj && LBL.has(min) ? `<b style="top:${y}px">${min}</b>` : ""}`;
      }).join("");
    }
    _fmt(t) {
      const h = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), s = t % 60, p = (n) => String(n).padStart(2, "0");
      return h ? `${h}:${p(m)}:${p(s)}` : `${m}:${p(s)}`;
    }
    _idxOf(t) {
      const v = this._vals;
      let b = 0;
      v.forEach((x, i) => {
        if (Math.abs(x - t) < Math.abs(v[b] - t)) b = i;
      });
      return b;
    }
    // Höhe nur beim Öffnen/Anfassen messen – nie während der Bewegung (kein erzwungenes Layout pro Bild)
    _mid(fresh) {
      if (fresh || !this._midC) this._midC = (this._e.scl.clientHeight || 0) / 2;
      return this._midC;
    }
    _offOf(i) {
      return this._mid() - i * SP;
    }
    _clampOff(o) {
      return Math.max(this._offOf(this._vals.length - 1), Math.min(this._offOf(0), o));
    }
    _move(o, snap) {
      this._off = o;
      const s = this._e.str;
      s.classList.toggle("snap", !!snap);
      s.style.transform = `translate3d(0,${o}px,0)`;
      const gv = this._e.gv;
      if (gv) gv.style.transform = `translateX(${(o * 0.12 % 3 + 3) % 3}px)`;
    }
    // Raster unter der Marke prüfen: neue Zeit, Klick
    _hit(o) {
      const i = Math.max(0, Math.min(this._vals.length - 1, Math.round((this._mid() - o) / SP)));
      if (i === this._idx) return;
      this._idx = i;
      this._sec = this._vals[i];
      this._showSec();
      this._click();
    }
    _showSec() {
      const e = this._e, txt = this._fmt(this._sec);
      const b = e.rd.querySelector("b");
      if (b) b.textContent = txt;
      e.scl.setAttribute("aria-valuetext", txt);
      if (this._c.layout === "compact") e.tt.textContent = txt;
      else e.t.textContent = txt;
    }
    // Zeit setzen und Skala dorthin stellen (exakte Werte aus dem Zahlenfeld bleiben exakt, die Skala zeigt das nächste Raster)
    _scaleTo(t, snap) {
      if (!this._e) return;
      this._mid(true);
      this._sec = t;
      this._idx = this._idxOf(t);
      this._move(this._offOf(this._idx), snap);
      this._showSec();
    }
    _snap() {
      this._stopFling();
      const i = Math.max(0, Math.min(this._vals.length - 1, Math.round((this._mid() - this._off) / SP)));
      this._idx = -1;
      this._move(this._offOf(i), true);
      this._hit(this._offOf(i));
    }
    // Schwung beenden – setzt auch den Zustand zurück, sonst würde jedes Ziehen danach als Antippen (ein Schritt) zählen
    _stopFling() {
      if (this._raf) cancelAnimationFrame(this._raf);
      this._raf = 0;
      this._fling = false;
    }
    // Leiser Klick: sehr kurzer Ton über Web Audio (der Echo kann nicht vibrieren), dazu Vibration, wo vorhanden
    _click() {
      if (this._c.click_sound === false || !this._drag) return;
      const now = performance.now();
      if (now - (this._lastClick || 0) < (this._fling ? 45 : 28)) return;
      this._lastClick = now;
      try {
        navigator.vibrate?.(6);
      } catch (e) {
      }
      const ac = this._ac;
      if (!ac || ac.state === "closed") return;
      try {
        if (!this._clk) {
          const n = Math.round(ac.sampleRate * 5e-3), buf = ac.createBuffer(1, n, ac.sampleRate), d = buf.getChannelData(0);
          for (let i = 0; i < n; i++) d[i] = Math.sin(i / ac.sampleRate * 2 * Math.PI * 2100) * Math.pow(1 - i / n, 3) * 0.12;
          this._clk = buf;
        }
        const src = ac.createBufferSource();
        src.buffer = this._clk;
        src.connect(ac.destination);
        src.start();
      } catch (e) {
      }
    }
    _scaleInit() {
      const e = this._e, sc = e.scl;
      let y0 = 0, ly = 0, lt = 0, moved = false, pts = [], want = null, frame = 0;
      const flush = () => {
        frame = 0;
        if (want == null) return;
        this._move(want, false);
        this._hit(want);
      };
      sc.addEventListener("pointerdown", (ev) => {
        if (ev.button > 0) return;
        ev.preventDefault();
        ev.stopPropagation();
        if (this._c.click_sound !== false && !this._ac) {
          const A3 = window.AudioContext || window.webkitAudioContext;
          if (A3) try {
            this._ac = new A3();
          } catch (x) {
            this._ac = null;
          }
        }
        this._ac?.resume?.().catch(() => {
        });
        this._stopFling();
        this._fling = false;
        sc.setPointerCapture?.(ev.pointerId);
        this._mid(true);
        this._drag = true;
        moved = false;
        y0 = ly = ev.clientY;
        lt = ev.timeStamp;
        want = this._off ?? this._offOf(this._idx || 0);
        pts = [[ev.timeStamp, want]];
        this._move(want, false);
        sc.focus({ preventScroll: true });
      });
      sc.addEventListener("pointermove", (ev) => {
        if (!this._drag || this._fling) return;
        if (!moved && Math.abs(ev.clientY - y0) > 4) moved = true;
        if (!moved) return;
        const dy = ev.clientY - ly, dt = Math.max(1, ev.timeStamp - lt), sp = Math.abs(dy) / dt;
        ly = ev.clientY;
        lt = ev.timeStamp;
        const S = SPEED[this._c.scale_speed] || SPEED.normal, gain = 1 + Math.min(S.max, Math.max(0, sp - 0.15) * S.k);
        want = this._clampOff(want + dy * gain);
        pts.push([ev.timeStamp, want]);
        if (pts.length > 8) pts.shift();
        if (!frame) frame = requestAnimationFrame(flush);
      });
      const up = (ev) => {
        if (!this._drag) return;
        if (!moved && ev.type !== "pointerup") {
          this._drag = false;
          return;
        }
        if (!moved) {
          const r = sc.getBoundingClientRect(), i = Math.max(0, Math.min(this._vals.length - 1, this._idx + (ev.clientY < r.top + r.height / 2 ? -1 : 1)));
          this._move(this._offOf(i), true);
          this._hit(this._offOf(i));
          this._drag = false;
          return;
        }
        if (frame) {
          cancelAnimationFrame(frame);
          flush();
        }
        const last = pts.at(-1), first = pts.find((p) => last[0] - p[0] <= 100) || pts[0];
        let v = last[0] > first[0] ? (last[1] - first[1]) / (last[0] - first[0]) : 0;
        const calm = matchMedia("(prefers-reduced-motion: reduce)").matches;
        if (ev.timeStamp - last[0] > 120) v = 0;
        if (calm || Math.abs(v) < 0.2 || ev.type === "pointercancel") {
          this._snap();
          this._drag = false;
          return;
        }
        let t0 = performance.now();
        this._fling = true;
        const step = (now) => {
          const dt = Math.min(40, now - t0);
          t0 = now;
          let o = this._off + v * dt;
          const c = this._clampOff(o);
          if (c !== o) {
            o = c;
            v = 0;
          }
          v *= Math.pow((SPEED[this._c.scale_speed] || SPEED.normal).fr, dt / 16);
          this._move(o, false);
          this._hit(o);
          if (Math.abs(v) > 0.05) this._raf = requestAnimationFrame(step);
          else {
            this._raf = 0;
            this._fling = false;
            this._snap();
            this._drag = false;
          }
        };
        this._raf = requestAnimationFrame(step);
      };
      sc.addEventListener("pointerup", up);
      sc.addEventListener("pointercancel", up);
      sc.addEventListener("lostpointercapture", (ev) => {
        if (this._drag && !this._fling) up(ev);
      });
      ["touchstart", "touchmove"].forEach((t) => sc.addEventListener(t, (ev) => ev.stopPropagation(), { passive: true }));
      sc.addEventListener("wheel", (ev) => {
        ev.preventDefault();
        this._drag = true;
        this._nudge(ev.deltaY > 0 ? 1 : -1);
        this._drag = false;
      }, { passive: false });
      sc.addEventListener("keydown", (ev) => {
        const d = { ArrowDown: 1, ArrowUp: -1, PageDown: 5, PageUp: -5 }[ev.key];
        if (d) {
          ev.preventDefault();
          this._drag = true;
          this._nudge(d);
          this._drag = false;
        }
      });
      press(e.rd, { tap: () => this._typeIn() });
    }
    _nudge(d) {
      this._stopFling();
      const i = Math.max(0, Math.min(this._vals.length - 1, this._idx + d));
      this._move(this._offOf(i), true);
      this._hit(this._offOf(i));
    }
    _typeIn() {
      const rd = this._e.rd;
      if (this._c.custom_input === false || rd.querySelector("input")) return;
      const inp = document.createElement("input");
      inp.type = "text";
      inp.inputMode = "numeric";
      inp.value = this._fmt(this._sec);
      inp.setAttribute("aria-label", "Zeit eintippen (Minuten oder m:ss)");
      rd.replaceChildren(inp);
      inp.focus();
      inp.select();
      let done = false;
      const fin = (ok2) => {
        if (done) return;
        done = true;
        const t = ok2 ? parseIn(inp.value) : 0;
        rd.replaceChildren(document.createElement("b"));
        if (t > 0) this._scaleTo(Math.min(t, 86399), true);
        else this._showSec();
      };
      inp.addEventListener("keydown", (ev) => {
        if (ev.key === "Enter") fin(true);
        if (ev.key === "Escape") fin(false);
      });
      inp.addEventListener("blur", () => fin(true));
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
    g2({ name: "show_custom", selector: { boolean: {} } }, sel("custom_picker", [["scale", "Skala zum Ziehen"], ["buttons", "Plus / Minus"]])),
    g2({ name: "scale_max", selector: { number: { min: 5, max: 1440, step: 5, mode: "box", unit_of_measurement: "min" } } }, { name: "click_sound", selector: { boolean: {} } }),
    g2(sel("scale_speed", [["slow", "Langsam"], ["normal", "Normal"], ["fast", "Schnell"]]), { name: "custom_input", selector: { boolean: {} } }),
    sel("custom_units", [["auto", "Automatisch"], ["h", "Nur Stunden"], ["m", "Nur Minuten"], ["s", "Nur Sekunden"], ["hm", "Stunden und Minuten"], ["ms", "Minuten und Sekunden"], ["hms", "Stunden, Minuten, Sekunden"]]),
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
    custom_picker: "Eigene Zeit einstellen mit",
    scale_max: "Skala bis",
    scale_speed: "Tempo der Skala",
    click_sound: "Klick-Geräusch beim Drehen",
    custom_input: "Zeit antippen = eintippen",
    custom_units: "Plus / Minus in",
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
    custom_picker: "Skala: wie ein Radio-Tuner hoch und runter ziehen, schnelles Wischen läuft mit Schwung aus. Raster bis 5 Min 15 Sekunden, bis 15 Min 30 Sekunden, bis 60 Min 1 Minute, darüber 5 Minuten.",
    scale_speed: "Wie weit schnelles Ziehen und Wischen die Skala dreht. Langsames Ziehen bleibt immer fein.",
    click_sound: "Leiser Klick pro Raster (und Vibration, wo das Gerät es kann).",
    custom_input: "Antippen der großen Zeit öffnet ein Zahlenfeld: „5“ = 5 Minuten, „5:30“, „1:05:00“.",
    custom_units: "Nur für Plus / Minus. Automatisch = groß Stunden/Minuten/Sekunden, kompakt Minuten/Sekunden. Gibt es keine größere Einheit, geht die kleinere weiter: „Nur Minuten“ bis 180, „Nur Sekunden“ bis 59:55.",
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
@container (min-width:420px){.g.ck.row{flex-direction:row;gap:20px;text-align:left}.row .ana{width:45%}
.txt{display:flex;flex-direction:column;gap:6px;align-items:flex-start;flex:1}.row .tm{font-size:clamp(28px,var(--nova-clock-size,12cqw),100px)}.row .dt{font-size:clamp(12px,3.6cqw,22px)}.row .inf{font-size:clamp(14px,var(--nova-clock-info-size,4.4cqw),26px)}}
.inf{display:flex;flex-wrap:wrap;justify-content:center;gap:4px 16px;font-size:clamp(14px,var(--nova-clock-info-size,7.5cqw),26px);opacity:.85;font-variant-numeric:tabular-nums;white-space:nowrap}
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
    entities: "Optional: z. B. Temperatur und Luftfeuchte – erscheinen in einer Zeile unter der Uhrzeit."
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

  // src/appliance.js
  var TYPES = {
    washer: { label: "Waschmaschine", icon: "mdi:washing-machine", color: "accent-1", run: "Wäscht", alt: "Schleudert", door: "Tür offen", phase: ["spin", "spinning", "schleudern"], anims: ["detergent", "softener"], dview: true },
    dishwasher: { label: "Spülmaschine", icon: "mdi:dishwasher", color: "accent-1", run: "Spült", alt: "Trocknet", door: "Tür offen", phase: ["drying", "dry", "trocknen", "ending"], dview: true },
    airfryer: { label: "Airfryer", icon: "mdi:toaster-oven", color: "accent-1", run: "Gart", heat: "Heizt vor", door: "Schublade offen", phase: [], dview: true },
    coffee: { label: "Kaffeemaschine", icon: "mdi:coffee-maker-outline", color: "accent-1", run: "Brüht", door: "Tür offen", phase: [], anims: ["tank", "beans", "descale"], drink: true },
    feeder: { label: "Futterautomat", icon: "mdi:bowl-mix-outline", color: "accent-1", run: "Füttert", door: "Deckel offen", phase: [], anims: ["food"], level: true, feed: true, mode: true, lvl: ["Füllstand", "Futter ausreichend", "Wenig Futter"], pick: "Portion" },
    fountain: { label: "Trinkbrunnen", icon: "mdi:fountain", color: "accent-1", run: "Läuft", door: "Deckel offen", phase: [], anims: ["water", "filter"], level: true, nodone: true, mode: true, lvl: ["Wasserstand", "Wasser ok", "Wasser fehlt"], binEmpty: true, filter: true },
    generic: { label: "Gerät", icon: "mdi:power-plug-outline", color: "accent-1", run: "Läuft", door: "Tür offen", phase: [] }
  };
  var typeOf = (c) => TYPES[c.device_type] ? c.device_type : "generic";
  var HANIM = {
    tank: ["Wassertank", "Wassertank leer", "mdi:cup-water"],
    beans: ["Bohnen", "Bohnen nachfüllen", "mdi:coffee-outline"],
    descale: ["Entkalken", "Entkalken", "mdi:water-alert-outline"],
    detergent: ["Waschmittel", "Waschmittel leer", "mdi:bottle-tonic-outline"],
    softener: ["Weichspüler", "Weichspüler leer", "mdi:bottle-tonic-plus-outline"],
    food: ["Futter leer", "Futter nachfüllen", "mdi:food-off"],
    water: ["Wasser niedrig", "Wasser nachfüllen", "mdi:water-alert-outline"],
    filter: ["Filter", "Filter wechseln", "mdi:air-filter"],
    warning: ["Allgemeine Warnung", "", "mdi:alert-outline"]
  };
  var animsOf = (t) => [...TYPES[t].anims || [], "warning"];
  var STATES = {
    run: ["run", "running", "on", "cooking", "brewing", "feeding", "dispensing", "starting", "ending", "anti_wrinkle", "washing", "rinsing", "spinning", "drying", "aborting", "in_use", "programmed_running"],
    pause: ["pause", "paused", "user_paused"],
    wait: ["delayedstart", "delayed_start", "delay_wait", "scheduled", "waiting_to_start"],
    done: ["finished", "finish", "done", "complete", "completed", "clean", "end", "programme_ended"],
    err: ["error", "fault", "failure", "actionrequired", "action_required", "interrupted"],
    prep: ["setting", "programming", "selecting", "adjusting"],
    heat: ["heating", "preheating", "preheat", "heat_up"],
    warm: ["maintain", "keep_warm", "keepwarm", "warming"],
    ready: ["ready", "idle", "standby", "mainmenu", "online"]
  };
  var SORDER = ["err", "pause", "wait", "done", "prep", "heat", "warm", "run", "ready"];
  var ACT = ["run", "pause", "wait", "heat", "warm"];
  var isAct = (cls) => ACT.includes(cls);
  var SKEY = { run: "running_states", pause: "paused_states", wait: "waiting_states", done: "finished_states", err: "error_states", prep: "prep_states", heat: "heat_states", warm: "warm_states", ready: "ready_states" };
  var TKEY = { run: "text_running", pause: "text_paused", wait: "text_waiting", done: "text_finished", err: "text_error", prep: "text_prep", heat: "text_heat", warm: "text_warm", ready: "text_ready", off: "text_off" };
  var TXT = { pause: "Pausiert", wait: "Startet später", done: "Fertig", err: "Störung", prep: "Wird eingestellt", heat: "Heizt auf", warm: "Hält warm", ready: "Bereit", off: "Aus" };
  var BAD = /* @__PURE__ */ new Set(["unavailable", "unknown", "none", ""]);
  var ok = (s) => !!s && !BAD.has(s.state);
  var GDEF = { controls_columns: "1", controls_labels: "auto", layout: "full", animation: true, glow: true, hide_when_off: false, start_at: "none", window: true, door_anim: true };
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
  var PICK = '<div class="ct pk"><div class="kv"><ha-icon icon="mdi:tune-variant"></ha-icon><span class="k"></span><div class="stp"><div class="hb mi"><ha-icon icon="mdi:minus"></ha-icon></div><span class="v"></span><div class="hb pl"><ha-icon icon="mdi:plus"></ha-icon></div></div></div></div>';
  var IC = { start: "mdi:play", pause: "mdi:pause", resume: "mdi:play-pause", stop: "mdi:stop" };
  function levelOf(s, empty2) {
    if (!ok(s)) return null;
    const v = String(s.state).toLowerCase();
    if (NUMRE.test(v)) return Math.max(0, Math.min(1, +v / 100));
    return ["on", "low", "niedrig"].includes(v) ? empty2 ? 0 : 0.12 : ["empty", "leer"].includes(v) ? 0 : null;
  }
  function levelText(s, L) {
    if (!ok(s)) return null;
    const v = String(s.state).toLowerCase();
    if (NUMRE.test(v)) return `${Math.round(+v)} %`;
    return ["on", "low", "niedrig", "empty", "leer"].includes(v) ? L[2] : ["off", "ok", "normal", "full", "voll"].includes(v) ? L[1] : null;
  }
  var DRINKS = [
    ["water", /hot water|hei(ß|ss)wasser|\btee\b|\btea\b/, "Wasser"],
    ["lm", /latte macchiato/, "Latte M."],
    ["latte", /latte|milchkaffee|caf(e|é) au lait|con leche/, "Latte"],
    ["cappu", /cappuccino|flat white|cortado|macchiato/, "Cappuccino"],
    ["milk", /milk|milch/, "Milch"],
    ["espresso", /espresso|ristretto|doppio/, "Espresso"],
    ["coffee", /^/, "Kaffee"]
  ];
  var drinkOf = (txt) => DRINKS.find((d) => d[1].test(txt.toLowerCase().replace(/_/g, " ")));
  var MILK = /* @__PURE__ */ new Set(["cappu", "latte", "lm", "milk"]);
  var CK = {
    espresso: ["#2e1a10", "#9a6436", "#d9c4a4"],
    coffee: ["#4a2c19", "#b07a48", "#e8dccb"],
    cappu: ["#6b4329", "#b07a48", "#efe6d8"],
    latte: ["#9a6c47", "#c49a6c", "#f1e9dd"],
    lm: ["#7a4e2e", "#c49a6c", "#f3ece2"],
    milk: ["#ece3d4", "#f3ece2", "#f6f1ea"],
    water: ["#a9c6e8", "#a9c6e8", "#a9c6e8"]
  };
  var FEED_MS = 8e3;
  var WARN = '<g class="wn"><circle class="wt3" cx="22" cy="20" r="11.5"/><rect class="wx" x="20.5" y="12.6" width="3" height="9.6" rx="1.5"/><circle class="wx2" cx="22" cy="26.4" r="1.8"/></g>';
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
  var qArm = (y, w) => `<g class="qarm" style="transform-origin:100px ${y + 1.1}px"><rect x="${100 - w}" y="${y}" width="${w * 2}" height="2.2" rx="1.1" fill="url(#d-cr)"/>${[-0.8, -0.45, 0.45, 0.8].map((f2) => `<circle class="qnz" cx="${100 + f2 * w}" cy="${y + 1.1}" r=".55"/>`).join("")}</g><circle class="qhub" cx="100" cy="${y + 1.1}" r="2.8" fill="url(#d-cr)"/>`;
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
  function kibble(x0, x1, y1, top, rMin, rMax, seed) {
    let q = seed;
    const rnd = () => (q = q * 16807 % 2147483647) / 2147483647, out = [];
    for (let y = Math.min(...[x0, (x0 + x1) / 2, x1].map(top)) - 2; y < y1 + 3; y += 2.6 + rMax * 0.55) {
      for (let x = x0 - 1 + rnd() * 2.5; x < x1 + 2; x += rMax * 1.25 + rnd() * rMax * 0.6) {
        const r = rMin + rnd() * (rMax - rMin), cx = x + (rnd() - 0.5) * 1.6, cy = y + (rnd() - 0.5) * 1.8;
        if (cy < top(cx) + r * 0.2 || rnd() < 0.1) continue;
        const k = 1 + Math.floor(rnd() * 5), a = Array.from({ length: 4 }, () => r * (0.82 + rnd() * 0.36)), f2 = (n) => n.toFixed(1);
        out.push(`<g class="kbl k${k}" transform="rotate(${Math.round(rnd() * 180)} ${f2(cx)} ${f2(cy)})"><path d="M${f2(cx - a[0])} ${f2(cy)}Q${f2(cx - a[0])} ${f2(cy - a[1])} ${f2(cx)} ${f2(cy - a[1])}Q${f2(cx + a[2])} ${f2(cy - a[1])} ${f2(cx + a[2])} ${f2(cy)}Q${f2(cx + a[2])} ${f2(cy + a[3])} ${f2(cx)} ${f2(cy + a[3])}Q${f2(cx - a[0])} ${f2(cy + a[3])} ${f2(cx - a[0])} ${f2(cy)}Z"/><ellipse cx="${f2(cx - r * 0.3)}" cy="${f2(cy - r * 0.38)}" rx="${f2(r * 0.38)}" ry="${f2(r * 0.24)}"/></g>`);
      }
    }
    return out.join("");
  }
  var KIB_BIN = kibble(64, 136, 124, (x) => 45 + 2.4 * Math.sin((x - 64) / 9), 2.2, 3.6, 7);
  var KIB_BOWL = kibble(62, 138, 178, (x) => 174.5 - 15 * Math.max(0, 1 - ((x - 100) / 38) ** 2), 1.7, 2.7, 11);
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

${doneAt(170, 189)}${WARN}</svg>`,
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
${doneAt(170, 189)}${WARN}</svg>`,
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
${doneAt(162, 172)}${WARN}</svg>`,
    // Kaffeevollautomat im Nova-Zeichenstil: oben Bohnenbehälter-Deckel, Bedienfeld mit Display und Status-LED, Nische mit
    // Chrom-Auslauf, Glastasse (bei Latte Macchiato hohes Glas) auf der Tropfschale, Wassertank aus Glas seitlich rechts
    coffee: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${sceneDefs("c")}
<radialGradient id="c-lt" cx=".5" cy="0" r="1"><stop offset="0" class="c-lc" stop-opacity=".55"/><stop offset="1" class="c-lc" stop-opacity="0"/></radialGradient>
<radialGradient id="c-vg" cx=".5" cy=".4" r=".8"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
<linearGradient id="c-wa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="c-lc" stop-opacity=".55"/><stop offset="1" class="c-lc" stop-opacity=".28"/></linearGradient>
<linearGradient id="c-lm" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="c-f"/><stop offset=".18" class="c-f"/><stop offset=".26" class="c-c"/><stop offset=".4" class="c-c"/><stop offset=".56" class="c-m"/><stop offset="1" class="c-m"/></linearGradient>
<filter id="c-bl" x="-100%" y="-40%" width="300%" height="180%"><feGaussianBlur stdDeviation="1.2"/></filter>
<clipPath id="c-cc"><path d="M78.5 124 h31 v25 a8.5 8.5 0 0 1 -8.5 8.5 h-14 a8.5 8.5 0 0 1 -8.5 -8.5 Z"/></clipPath>
<clipPath id="c-gc"><path d="M85 97 h22 l-1.5 57.5 a3 3 0 0 1 -3 3 h-13 a3 3 0 0 1 -3 -3 Z"/></clipPath>
<clipPath id="c-tc"><rect x="151" y="44" width="16" height="131" rx="3"/></clipPath><clipPath id="c-nc"><path d="M58 76 q0 -8 8 -8 h56 q8 0 8 8 V178 H58 Z"/></clipPath></defs>
<ellipse class="s-shd" cx="102" cy="193" rx="70" ry="4.5"/><rect class="cft" x="46" y="186" width="14" height="5" rx="1.5"/><rect class="cft" x="128" y="186" width="14" height="5" rx="1.5"/>
<rect class="s-part" x="149" y="36" width="20" height="9" rx="3" fill="url(#c-pt)"/>
<g clip-path="url(#c-tc)"><rect x="151" y="44" width="16" height="131" fill="url(#c-in)"/><g class="ctw"><rect x="151" y="84" width="16" height="96" fill="url(#c-wa)"/><rect class="ctws" x="151" y="84" width="16" height="1"/></g>
<path class="s-refl" d="M152.5 44 h3 v131 h-3 z"/><g transform="rotate(12 159 110)"><rect class="s-gls" x="128" y="30" width="10" height="160" fill="url(#c-gs)"/></g></g>
<rect class="tk s-glass" x="151" y="44" width="16" height="131" rx="3" fill="url(#c-gl)"/><path class="ctm" d="M163 70 h2.6 M163 100 h2.6 M163 130 h2.6 M163 160 h2.6"/>
<rect class="s-part" x="149" y="173" width="20" height="7" rx="2.5" fill="url(#c-pt)"/>
<path class="bn s-part" d="M50 23 v-5 a5 5 0 0 1 5 -5 h40 a5 5 0 0 1 5 5 v5 Z" fill="url(#c-pt)"/><rect class="cbh" x="54" y="14" width="42" height=".8" rx=".4"/>
<rect class="s-body" x="36" y="22" width="114" height="166" rx="10" fill="url(#c-bd)"/><rect class="s-sheen" x="36" y="22" width="114" height="166" rx="10" fill="url(#c-sh)"/>
<rect class="s-edge" x="42" y="23" width="102" height="1.2" rx=".6"/>
<rect class="s-part" x="46" y="31" width="96" height="28" rx="4" fill="url(#c-pt)"/><rect class="s-scr cscr" x="50" y="35" width="68" height="16" rx="2"/>
<text class="ctx" x="84" y="46"></text><path class="s-tgl" d="M52 35.5 h12 l-5 15 h-7 z"/>
<g class="ctb"><rect x="52" y="54" width="7" height="1.8" rx=".9"/><rect x="62" y="54" width="7" height="1.8" rx=".9"/><rect x="72" y="54" width="7" height="1.8" rx=".9"/><rect x="82" y="54" width="7" height="1.8" rx=".9"/></g>
<circle class="led" cx="130" cy="40" r="1.8"/><path class="dp" d="M130 45.6 c1.6 2.4 2.4 3.6 2.4 4.8 a2.4 2.4 0 0 1 -4.8 0 c0 -1.2 .8 -2.4 2.4 -4.8 Z"/>
<path d="M58 76 q0 -8 8 -8 h56 q8 0 8 8 V178 H58 Z" fill="url(#c-in)"/><g clip-path="url(#c-nc)"><rect class="cnl" x="58" y="68" width="72" height="70" fill="url(#c-lt)"/><rect x="58" y="68" width="72" height="110" fill="url(#c-vg)"/></g>
<path class="cnr" d="M58 76 q0 -8 8 -8 h56 q8 0 8 8 V178 H58 Z"/>
<rect class="cspb" x="78" y="64" width="32" height="14" rx="3.5" fill="url(#c-cr)"/><rect class="csph" x="81" y="65" width="26" height=".8" rx=".4"/>
<rect class="cnz" x="85" y="77" width="6" height="5" rx="1.6" fill="url(#c-cr)"/><rect class="cnz" x="97" y="77" width="6" height="5" rx="1.6" fill="url(#c-cr)"/>
<rect class="s-part" x="56" y="160" width="76" height="20" rx="3.5" fill="url(#c-pt)"/><rect class="cgr" x="58" y="157.6" width="72" height="3.4" rx="1.2" fill="url(#c-cr)"/>
<path class="cgs" d="M61 159.3 h66"/><rect class="cth" x="60" y="163.4" width="68" height=".7"/><rect class="ctf" x="88" y="171" width="12" height="3" rx="1.5"/>
<g class="flow"><line x1="88" y1="82" x2="88" y2="157"/><line x1="100" y1="82" x2="100" y2="157"/></g>
<g class="ccup"><g clip-path="url(#c-cc)"><g class="cfl"><rect class="cfc" x="76" y="124" width="36" height="36"/><rect class="cfr" x="76" y="124" width="36" height="2.2"/><rect class="cff" x="76" y="124" width="36" height="9"/></g></g>
<path class="s-glass" d="M76 124 h36 v26 a10 10 0 0 1 -10 10 h-16 a10 10 0 0 1 -10 -10 Z" fill="url(#c-gl)"/><path class="chd" d="M112 130 h3 a6.5 6.5 0 0 1 0 13 h-3.4"/>
<path class="s-refl" d="M79 126 h4 v23 h-4 z"/><ellipse class="crim" cx="94" cy="124" rx="18" ry="1.5"/></g>
<g class="cgls"><g clip-path="url(#c-gc)"><g class="cfl g"><rect x="83" y="97" width="26" height="61" fill="url(#c-lm)"/><rect class="cff" x="83" y="97" width="26" height="11"/></g></g>
<path class="s-glass" d="M83 96 h26 l-1.6 60 a4 4 0 0 1 -4 4 h-14.8 a4 4 0 0 1 -4 -4 Z" fill="url(#c-gl)"/><path class="s-refl" d="M86 98 h3 l-1 56 h-3 z"/><ellipse class="crim" cx="96" cy="96" rx="13" ry="1.2"/></g>
<g class="csteam" filter="url(#c-bl)"><path d="M87 120 c-3 -5 3 -8 0 -13 c-2 -3 1 -6 0 -9"/><path d="M95 120 c3 -5 -3 -8 0 -13 c2 -3 -1 -6 0 -9"/><path d="M103 120 c-3 -5 3 -8 0 -13 c-2 -3 1 -6 0 -9"/></g>
${doneAt(150, 188)}${WARN}</svg>`,
    // Futterautomat im Nova-Zeichenstil: Säule mit Deckel, Sichtfenster mit Trockenfutter (Füllstand), Status-LED, Ausgabeschacht
    // mit Chromlippe, davor ein Edelstahlnapf
    feeder: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${sceneDefs("f")}

<linearGradient id="f-ps" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".14"/><stop offset=".2" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".5"/></linearGradient>
<radialGradient id="f-vg" cx=".5" cy=".4" r=".8"><stop offset=".6" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".3"/></radialGradient>
<radialGradient id="f-lt" cx=".5" cy="0" r="1"><stop offset="0" class="f-lc" stop-opacity=".8"/><stop offset="1" class="f-lc" stop-opacity="0"/></radialGradient>
<clipPath id="f-wc"><rect x="66" y="40" width="68" height="74" rx="8"/></clipPath><clipPath id="f-bc"><path d="M61 172 a39 5.2 0 0 0 78 0 V150 H61 Z"/></clipPath></defs>
<ellipse class="s-shd" cx="100" cy="193" rx="66" ry="4.5"/><rect class="fft" x="62" y="176" width="12" height="4" rx="1.5"/><rect class="fft" x="126" y="176" width="12" height="4" rx="1.5"/>
<rect class="s-body" x="54" y="24" width="92" height="154" rx="14" fill="url(#f-bd)"/><rect class="s-sheen" x="54" y="24" width="92" height="154" rx="14" fill="url(#f-sh)"/>
<path class="s-part" d="M50 32 v-6 q0 -12 14 -12 h72 q14 0 14 12 v6 Z" fill="url(#f-pt)"/><rect class="s-edge" x="62" y="15" width="76" height="1.2" rx=".6"/><rect class="fsep" x="50" y="31.6" width="100" height=".8"/>
<rect class="fwf" x="63.6" y="37.6" width="72.8" height="78.8" rx="10"/>
<g clip-path="url(#f-wc)"><rect x="66" y="40" width="68" height="74" fill="url(#f-in)"/>
<g class="fpl"><path class="fk0" d="M64 58 q9 -3 18 0 t18 0 t18 0 t18 0 V126 H64 Z"/>${KIB_BIN}</g>
<rect x="66" y="40" width="68" height="74" fill="url(#f-vg)"/><path class="s-refl" d="M76 40 h16 l-26 50 v-24 z"/><path class="s-refl" d="M102 40 h5 l-41 74 v-10 z"/>
<g transform="rotate(18 100 77)"><rect class="s-gls" x="40" y="20" width="14" height="120" fill="url(#f-gs)"/></g></g>
<rect class="s-glass" x="66" y="40" width="68" height="74" rx="8" fill="url(#f-gl)"/><path class="fmk" d="M128 52 h3.6 M128 70 h3.6 M128 88 h3.6 M128 104 h3.6"/>
<circle class="fring" cx="100" cy="128" r="5.4"/><circle class="led fled" cx="100" cy="128" r="2.4"/>
<rect class="ftb" x="76" y="127" width="10" height="2" rx="1"/><rect class="ftb" x="114" y="127" width="10" height="2" rx="1"/>
<path class="fch" d="M84 142 q0 -4 4 -4 h24 q4 0 4 4 v14 h-32 Z"/><rect class="fchl" x="86" y="139" width="28" height="16" fill="url(#f-lt)"/>
<g class="fdrop">${[[97, 1, 0], [102.4, 2, 0.3], [99.2, 3, 0.55], [103.6, 1, 0.8], [96, 2, 1.05]].map(([x, k, d]) => `<ellipse class="fk${k}" cx="${x}" cy="160" rx="1.9" ry="1.7" style="animation-delay:${d}s"/>`).join("")}</g>
<rect class="flip" x="80" y="155" width="40" height="4.4" rx="2" fill="url(#f-cr)"/>
<path class="fbo" d="M58 172 L65 186 Q66.5 189 70 189 H130 Q133.5 189 135 186 L142 172 Z" fill="url(#f-cr)"/><ellipse class="fbi" cx="100" cy="172" rx="39.4" ry="5.4"/>
<g clip-path="url(#f-bc)"><g class="fbw"><path class="fk0" d="M66 177 q6 -12 22 -14 q12 -1.4 24 0 q16 2 22 14 Z"/>${KIB_BOWL}</g></g>
<ellipse class="fbr" cx="100" cy="172" rx="42" ry="6.5"/><path class="fbh" d="M64.5 178 l3.6 7.4"/>
${doneAt(146, 189)}${WARN}</svg>`,
    // Trinkbrunnen im Nova-Zeichenstil (Vorbild Petkit Eversweet): flacher runder Zylinder, oben breite Trinkschale mit kleinem
    // Sprudel in der Mitte, vorne Sichtfenster für den Wasserstand (MAX/MIN), Sockel mit Status-LED und kleinem Filter-Symbol
    fountain: `<svg viewBox="0 0 200 200" aria-hidden="true"><defs>${sceneDefs("b")}
<linearGradient id="b-wa" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="b-wc" stop-opacity=".85"/><stop offset="1" class="b-wc" stop-opacity=".5"/></linearGradient>
<radialGradient id="b-ds" cx=".5" cy=".45" r=".55"><stop offset="0" class="b-wc" stop-opacity=".7"/><stop offset=".7" class="b-wc" stop-opacity=".38"/><stop offset="1" class="b-wc" stop-opacity=".2"/></radialGradient>
<linearGradient id="b-cy" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#000" stop-opacity=".35"/><stop offset=".22" stop-color="#fff" stop-opacity=".1"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset=".85" stop-color="#000" stop-opacity=".25"/><stop offset="1" stop-color="#000" stop-opacity=".45"/></linearGradient>
<filter id="b-bl" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation=".6"/></filter>
<clipPath id="b-dc"><ellipse cx="100" cy="75" rx="51" ry="8"/></clipPath><clipPath id="b-wc"><rect x="95.5" y="100" width="9" height="42" rx="4.5"/></clipPath></defs>
<ellipse class="s-shd" cx="100" cy="190" rx="72" ry="5"/><rect class="bft" x="56" y="181" width="14" height="5" rx="2"/><rect class="bft" x="130" y="181" width="14" height="5" rx="2"/>
<path class="s-body" d="M34 72 V172 a66 11 0 0 0 132 0 V72 Z" fill="url(#b-bd)"/><path d="M34 72 V172 a66 11 0 0 0 132 0 V72 Z" fill="url(#b-cy)"/>
<path class="s-part" d="M34 160 a66 11 0 0 0 132 0 V172 a66 11 0 0 1 -132 0 Z" fill="url(#b-pt)"/><path class="bsep" d="M34 160 a66 11 0 0 0 132 0"/><path class="bsh" d="M35 161.4 a65 11 0 0 0 130 0"/>
<rect class="bwf" x="93.6" y="98" width="12.8" height="46" rx="6.4"/>
<g clip-path="url(#b-wc)"><rect x="95.5" y="100" width="9" height="42" fill="url(#b-in)"/><g class="bwl"><rect x="95.5" y="100" width="9" height="44" fill="url(#b-wa)"/><rect class="bws" x="95.5" y="100" width="9" height=".9"/></g>
<rect class="s-refl" x="96.4" y="100" width="2" height="42"/><g transform="rotate(14 100 127)"><rect class="s-gls" x="70" y="88" width="8" height="80" fill="url(#b-gs)"/></g></g>
<rect class="s-glass" x="95.5" y="100" width="9" height="42" rx="4.5" fill="url(#b-gl)"/><path class="bmk" d="M106.8 104 h2.4 M106.8 138 h2.4"/>
<ellipse class="btop" cx="100" cy="72" rx="66" ry="12" fill="url(#b-pt)"/><path class="s-edge" d="M44 66 a62 9 0 0 1 112 0 a62 10.4 0 0 0 -112 0 Z"/>
<ellipse class="brec" cx="100" cy="74" rx="57" ry="9.6"/><ellipse class="bdish" cx="100" cy="75" rx="51" ry="8" fill="url(#b-ds)"/>
<g clip-path="url(#b-dc)"><g class="brip"><ellipse cx="100" cy="75" rx="9" ry="1.4"/><ellipse cx="100" cy="75" rx="9" ry="1.4" style="animation-delay:1.1s"/><ellipse cx="100" cy="75" rx="9" ry="1.4" style="animation-delay:2.2s"/></g>
<path class="s-refl" d="M62 70 q20 -3 34 -2 l-6 4 q-14 0 -28 3 z"/></g>
<ellipse class="bflow" cx="100" cy="75" rx="51" ry="8"/><ellipse class="bdr" cx="100" cy="74" rx="57" ry="9.6"/>
<rect class="s-part" x="146" y="64.6" width="9" height="3.4" rx="1.2" fill="url(#b-pt)"/>
<ellipse class="bnz" cx="100" cy="75" rx="5" ry="1.8" fill="url(#b-cr)"/><path class="bdome" d="M95 75 q5 -6 10 0 Z"/><g class="bjet"><path d="M98.4 74 Q99.2 62 99.5 55 h1 Q100.8 62 101.6 74 Z"/><ellipse cx="100" cy="55" rx="2.2" ry="1.3"/></g><path class="bdhl" d="M99.4 72 q.2 -8 .5 -14"/>
<g class="bdrop">${[[-9, 18, 0], [8, 18, 0.3], [-5, 19, 0.6], [11, 17, 0.9], [-12, 17, 1.2], [4, 19, 1.5]].map(([dx, dy, d]) => `<circle cx="100" cy="55.5" r="${dx % 2 ? 0.8 : 1}" style="--dx:${dx}px;--dy:${dy}px;animation-delay:${d}s"/>`).join("")}</g>
<g class="bfi"><rect x="98.3" y="148.4" width="3.4" height="1.4" rx=".5"/><rect x="97.2" y="149.8" width="5.6" height="7.6" rx="1.4"/><path d="M97.2 152.3 h5.6 M97.2 154.9 h5.6"/></g><circle class="led" cx="100" cy="163.6" r="1.5"/>
${WARN}</svg>`,
    generic: `<svg viewBox="0 0 100 100" aria-hidden="true"><circle class="pulse" cx="50" cy="50" r="30"/><circle class="bd" cx="50" cy="50" r="26"/>
<path class="pw" d="M41 40 a14 14 0 1 0 18 0"/><line class="pw" x1="50" y1="33" x2="50" y2="48"/>${DONE}<g transform="scale(.5)">${WARN}</g></svg>`
  };
  var scene = (t) => `<div class="scene">${SV[t]}</div>`;
  var DCSS = `
.g.dv{--dc:var(--nv-a1);--dc-fg:var(--nv-a1-fg);--fc:var(--nova-filter-color,var(--nv-a2))}
${frameGlow(".g.dv.glow.st-run,.g.dv.glow.st-heat")}
.g.dv.glow.t-feeder.st-ready{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--dc) 25%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.g.dv.glow.t-feeder.st-run{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--dc) 65%,transparent),0 0 22px color-mix(in srgb,var(--dc) 35%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
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
.ctls.c2{display:grid;grid-template-columns:repeat(2,minmax(0,1fr));column-gap:16px}
.ctls.c2 .stp{gap:4px}.ctls.c2 .stp .v{min-width:52px}
.ct .row .hb.go{width:32px;height:32px}
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
.dv .al[data-e]{cursor:pointer}.dv .al .alr{margin-left:auto;flex:none;padding:5px 12px;border-radius:12px;background:rgba(255,255,255,.16);font-weight:600;cursor:pointer}.dv .al .alr:active{transform:scale(.95)}
.pk .hb.dis{opacity:.35;pointer-events:none}.dv .al.hit{background:color-mix(in srgb,var(--c) 32%,transparent);font-weight:600}
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
.scene .heat path{fill:none;stroke:var(--dc);stroke-width:1.6;stroke-linecap:round;opacity:0}
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
.scene .kd{fill:rgba(0,0,0,.3);stroke:currentColor;stroke-opacity:.18;stroke-width:1}
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
.scene .wn{--wc:var(--nv-error)}
.scene .wt3{fill:var(--wc);stroke:rgba(0,0,0,.25);stroke-width:.5;filter:drop-shadow(0 0 4px color-mix(in srgb,var(--wc) 50%,transparent))}.scene .wx,.scene .wx2{fill:#fff}
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
.h-detergent .w-washer .dw,.h-softener .w-washer .dw{fill:var(--nv-warn);fill-opacity:.95}
.anim.h-detergent .w-washer .dw,.anim.h-softener .w-washer .dw{animation:dv-blinko 1.3s ease-in-out infinite}
/* Kaffeevollautomat im Nova-Zeichenstil (Maßstab 3D-Drucker, Grundteile aus shared/scene.js); Getränkefarben --cc/--cr/--cm aus der Karte */
.w-coffee{--gx:70px}
.w-coffee .cft{fill:#0d1016}.w-coffee .c-lc{stop-color:var(--dc)}
.w-coffee .c-f{stop-color:var(--cm,#f3ece2)}.w-coffee .c-c{stop-color:var(--cc,#7a4e2e)}.w-coffee .c-m{stop-color:color-mix(in srgb,var(--cm,#f3ece2) 82%,var(--cc,#7a4e2e))}
.w-coffee .ctw{transform-box:view-box;transition:transform .8s}.w-coffee .ctws{fill:#fff;opacity:.35}
.w-coffee .tk{transition:stroke .3s}.w-coffee .ctm{fill:none;stroke:#fff;stroke-opacity:.25;stroke-width:.6}
.w-coffee .cbh{fill:#fff;opacity:.14}.w-coffee .ctb rect{fill:#fff;opacity:.14}
.w-coffee .cscr{transition:fill .6s}
.w-coffee .ctx{font:600 8.4px Roboto,system-ui,sans-serif;fill:#fff;text-anchor:middle}
.w-coffee .dp{fill:#fff;opacity:.2}
.w-coffee .cnr{fill:none;stroke:#000;stroke-opacity:.45;stroke-width:1}.w-coffee .cnl{opacity:0;transition:opacity .6s}
.w-coffee .cspb,.w-coffee .cnz{stroke:rgba(0,0,0,.4);stroke-width:.4}.w-coffee .csph{fill:#fff;opacity:.35}
.w-coffee .cgr{stroke:rgba(0,0,0,.35);stroke-width:.4}.w-coffee .cgs{fill:none;stroke:#0b0e13;stroke-width:1.2;stroke-dasharray:3 1.6}
.w-coffee .cth{fill:#fff;opacity:.1}.w-coffee .ctf{fill:#0b0e13}
.w-coffee .flow line{stroke:var(--cc,#4a2c19);stroke-width:1.6;stroke-linecap:round;stroke-dasharray:5 2.5;opacity:0;transition:opacity .3s}
.w-coffee .cfc{fill:var(--cc,#4a2c19)}.w-coffee .cfr{fill:var(--cr,#b07a48)}
.w-coffee .cff{fill:var(--cm,#efe6d8);transform-box:fill-box;transform-origin:center top;transform:scaleY(var(--mf,0))}
.w-coffee .cfl{--ch:34px;transform:translateY(calc((1 - var(--cl,0)) * var(--ch)));transition:transform 1s}.w-coffee .cfl.g{--ch:61px}
.k-water .w-coffee .cfc{opacity:.45}.k-water .w-coffee .cfr{display:none}.k-milk .w-coffee .cfr{opacity:.4}
.w-coffee .chd{fill:none;stroke:#fff;stroke-opacity:.3;stroke-width:1.6}.w-coffee .crim{fill:none;stroke:#fff;stroke-opacity:.28;stroke-width:.6}
.w-coffee .cgls{display:none}.k-lm .w-coffee .cgls{display:inline}.k-lm .w-coffee .ccup,.k-lm .w-coffee .csteam{display:none}
.w-coffee .csteam path{fill:none;stroke:#d7dfec;stroke-width:2;stroke-linecap:round;opacity:0;transform-box:fill-box;transform-origin:center bottom}
.st-off .w-coffee .ctx{display:none}
.st-ready .w-coffee .cscr,.st-done .w-coffee .cscr,.st-prep .w-coffee .cscr{fill:color-mix(in srgb,var(--dc) 12%,${PAL.screen})}
.st-run .w-coffee .cscr,.st-heat .w-coffee .cscr,.st-pause .w-coffee .cscr,.st-warm .w-coffee .cscr{fill:color-mix(in srgb,var(--dc) 20%,${PAL.screen})}
.st-ready .w-coffee .cnl{opacity:.22}.st-run .w-coffee .cnl{opacity:.85}.st-done .w-coffee .cnl,.st-pause .w-coffee .cnl{opacity:.4}
.st-heat .w-coffee .cscr{stroke:var(--dc);stroke-opacity:.8}.anim.st-heat .w-coffee .cscr{animation:dv-stk 2.6s ease-in-out infinite}
.anim.st-pause .w-coffee .ctx{animation:dv-blinko 1.4s ease-in-out infinite}
/* Brüht: zwei Strahlen, Tasse füllt sich (nach Fortschritt, sonst in 9 s), bei Milchgetränken wächst der Schaum, Dampf steigt */
.st-run .w-coffee .flow line{opacity:.95}
.anim.st-run .w-coffee .flow line{animation:dv-flow .5s linear infinite}
.anim.st-run:not(.cprog) .w-coffee .cfl{animation:dv-cfill 9s ease-out both}
.anim.st-run.milk:not(.cprog) .w-coffee .cff{animation:dv-foam 9s ease-out both}
.anim.st-run .w-coffee .csteam path,.anim.st-done .w-coffee .csteam path{animation:dv-hz 3.6s ease-out infinite}
.anim.st-done .w-coffee .csteam path{animation-duration:4.4s}
.w-coffee .csteam path:nth-child(2){animation-delay:1.2s}.w-coffee .csteam path:nth-child(3){animation-delay:2.4s}
/* Störung: Display rot; Wassertank leer: Tank leer und blinkt rot; Bohnen/Entkalken: Deckel bzw. Tropfen in der Warnfarbe */
.st-err .w-coffee .cscr{stroke:var(--nv-error);stroke-opacity:.9}.st-err .w-coffee .ctx{fill:var(--nv-error)}
.h-tank .w-coffee .ctw{transform:translateY(86px)}.h-tank .w-coffee .tk{stroke:var(--nv-error);stroke-opacity:1;stroke-width:1.2}
.h-beans .w-coffee .bn{fill:var(--nv-warn)}.h-descale .w-coffee .dp{fill:var(--nv-warn);opacity:1}
.anim.h-tank .w-coffee .tk,.anim.h-beans .w-coffee .bn,.anim.h-descale .w-coffee .dp{animation:dv-blinko 1.3s ease-in-out infinite}
@media (prefers-reduced-motion:reduce){.st-run:not(.cprog) .w-coffee .cfl{--cl:.6}.st-run.milk:not(.cprog) .w-coffee .cff{--mf:.5}}
/* Futterautomat im Nova-Zeichenstil: Vorrat im Fenster --fl, Napf --fb */
.w-feeder{--gx:80px}
.w-feeder .fft{fill:#0d1016}.w-feeder .fsep{fill:#000;opacity:.3}
.w-feeder .fk0{fill:#1d120a;opacity:.6}
.w-feeder .kbl path{stroke:#000;stroke-opacity:.45;stroke-width:.45}.w-feeder .kbl ellipse{fill:#fff;opacity:.18}
.w-feeder .k1 path,.w-feeder .fk1{fill:#c4844a}.w-feeder .k2 path,.w-feeder .fk2{fill:#9c6232}.w-feeder .k3 path,.w-feeder .fk3{fill:#dba468}.w-feeder .k4 path{fill:#b0723e}.w-feeder .k5 path{fill:#7e4f28}
.w-feeder .fwf{fill:#0b0e13;stroke:rgba(255,255,255,.08);stroke-width:.5}
.w-feeder .fpl{transform:translateY(calc((1 - var(--fl,.7)) * 80px));transition:transform .8s}
.h-food .w-feeder .fpl,.empty .w-feeder .fpl{--fl:0}
.w-feeder .fmk{fill:none;stroke:#fff;stroke-opacity:.3;stroke-width:.7}
.w-feeder .fring{fill:#07090d;stroke:rgba(255,255,255,.15);stroke-width:.5}.w-feeder .ftb{fill:#fff;opacity:.14}
.w-feeder .fch{fill:#05070a;stroke:rgba(255,255,255,.08);stroke-width:.5}
.w-feeder .f-lc{stop-color:var(--dc)}.w-feeder .fchl{opacity:0;transition:opacity .6s}
.w-feeder .flip,.w-feeder .fbo{stroke:rgba(0,0,0,.4);stroke-width:.4}
.w-feeder .fdrop ellipse{opacity:0}
.w-feeder .fbi{fill:#151921}.w-feeder .fbr{fill:none;stroke:#fff;stroke-opacity:.35;stroke-width:.8}
.w-feeder .fbh{fill:none;stroke:#fff;stroke-opacity:.3;stroke-width:1.4;stroke-linecap:round}
.w-feeder .fbw{transform:translateY(calc((1 - var(--fb,.2)) * 15px));transition:transform 1s}
/* Füttert: Licht im Schacht, Brocken fallen in den Napf, der Napf füllt sich; fertig = voller Napf */
.st-run .w-feeder .fchl{opacity:.75}
.anim.st-run .w-feeder .fdrop ellipse{animation:dv-kib .9s ease-in infinite}
.st-run .w-feeder .fbw,.st-done .w-feeder .fbw{--fb:1}
.anim.st-run .w-feeder .fbw{animation:dv-fbowl 8s ease-out both}
.anim.st-run .w-feeder .fled{animation:dv-blinko 1.4s ease-in-out infinite}
/* Futter leer / Störung: Fenster leer, LED blinkt rot */
.g.dv.empty .w-feeder .fled,.g.dv.h-food .w-feeder .fled,.g.dv.st-err .w-feeder .fled{fill:var(--nv-error);fill-opacity:1}
.anim.empty .w-feeder .fled,.anim.h-food .w-feeder .fled,.anim.st-err .w-feeder .fled{animation:dv-blinko 1s ease-in-out infinite}
.empty .scene .wn,.low .scene .wn{display:inline}
/* Trinkbrunnen im Nova-Zeichenstil: Wasserstand im Sichtfenster --wl, läuft nie „fertig“ */
.w-fountain{--gx:40px}
.w-fountain .b-wc{stop-color:var(--dc)}
.w-fountain .bft{fill:#0d1016}.w-fountain .bsep{fill:none;stroke:#000;stroke-opacity:.45;stroke-width:.8}.w-fountain .bsh{fill:none;stroke:#fff;stroke-opacity:.08;stroke-width:.6}
.w-fountain .bwf{fill:#07090d;stroke:rgba(255,255,255,.1);stroke-width:.5}.w-fountain .bmk{fill:none;stroke:#fff;stroke-opacity:.35;stroke-width:.6}
.w-fountain .bwl{transform:translateY(calc((1 - var(--wl,.8)) * 40px));transition:transform .8s}.h-water .w-fountain .bwl{--wl:.12}
.w-fountain .bws{fill:#fff;opacity:.5}
.w-fountain .btop{stroke:rgba(255,255,255,.18);stroke-width:.5}.w-fountain .brec{fill:#0b0e13}
.w-fountain .bdr{fill:none;stroke:#fff;stroke-opacity:.14;stroke-width:.6}
.w-fountain .bdish{transition:opacity .6s}.st-off .w-fountain .bdish,.st-pause .w-fountain .bdish{opacity:.6}
.w-fountain .bnz{stroke:rgba(0,0,0,.4);stroke-width:.3}
.w-fountain .brip ellipse{fill:none;stroke:#fff;stroke-opacity:.45;stroke-width:.5;opacity:0;transform-box:fill-box;transform-origin:center}
.w-fountain .bflow{fill:none;stroke:#fff;stroke-opacity:0;stroke-width:.7;stroke-dasharray:3 5;transition:stroke-opacity .6s}
.w-fountain .bdome{fill:var(--dc);fill-opacity:.65;opacity:0;transform-box:fill-box;transform-origin:center bottom;transition:opacity .4s}
.w-fountain .bdhl{fill:none;stroke:#fff;stroke-opacity:.35;stroke-width:.6;stroke-linecap:round;opacity:0;transition:opacity .4s}
.w-fountain .bdrop circle{fill:var(--dc);opacity:0}
.w-fountain .bjet{fill:var(--dc);fill-opacity:.7;opacity:0;transform-box:fill-box;transform-origin:center bottom;transition:opacity .4s}
.w-fountain .bfi{transform-box:fill-box;transform-origin:center}
/* Modus-LED: ruhiges Leuchten in der Modusfarbe, kein Blinken */
.dv .w-fountain .led{fill:#5b6372;fill-opacity:.5;transition:fill .4s,fill-opacity .4s}
.m-normal.dv .w-fountain .led,.m-smart.dv .w-fountain .led{fill:var(--mc);fill-opacity:1;filter:drop-shadow(0 0 1.6px var(--mc))}
.m-normal{--mc:var(--nova-mode-normal-color,var(--nv-a1))}.m-smart{--mc:var(--nova-mode-smart-color,var(--nv-a4))}
.m-normal.dv .w-feeder .fled,.m-smart.dv .w-feeder .fled{fill:var(--mc);fill-opacity:1;filter:drop-shadow(0 0 1.6px var(--mc))}
.w-fountain .bfi rect,.w-fountain .bfi path{fill:none;stroke:#fff;stroke-opacity:.3;stroke-width:.8;stroke-linejoin:round}
/* Läuft: kleiner Sprudel wippt, Ringe laufen über die Schale, das Wasser fließt sanft über den Rand ab; aus/Pause = Wasser steht */
.st-run .w-fountain .bdome,.st-run .w-fountain .bdhl,.st-run .w-fountain .bjet{opacity:1}.st-run .w-fountain .bflow{stroke-opacity:.35}
.anim.st-run .w-fountain .bdome{animation:dv-bob 2.4s ease-in-out infinite}
.anim.st-run .w-fountain .bjet{animation:dv-jet2 1.8s ease-in-out infinite}
.anim.st-run .w-fountain .brip ellipse{animation:dv-rip 3.3s ease-out infinite}
.anim.st-run .w-fountain .bdrop circle{animation:dv-bdrop 1.8s cubic-bezier(.3,.1,.6,1) infinite}
.anim.st-run .w-fountain .bflow{animation:dv-bflow 6s linear infinite}
/* Wasser niedrig: Stand im Fenster sinkt, Ausrufezeichen; Filter wechseln: Filter-Symbol pulsiert (--nova-filter-color, Standard Akzent 2) */
.h-water .scene .wn{display:inline}
.st-err .w-fountain .bdome,.st-err .w-fountain .bdhl{opacity:0}
.h-filter .w-fountain .bfi rect,.h-filter .w-fountain .bfi path{stroke:var(--fc);stroke-opacity:1;stroke-width:1;filter:drop-shadow(0 0 1.5px var(--fc))}
.anim.h-filter .w-fountain .bfi{animation:dv-fpulse 1.6s ease-in-out infinite}
.anim.st-run .w-generic .pulse{animation:dv-pulse 2.6s ease-out infinite}
.scene .drops circle:nth-child(2),.scene .heat path:nth-child(2),.scene .puff path:nth-child(2){animation-delay:.5s}
.scene .drops circle:nth-child(3),.scene .heat path:nth-child(3),.scene .puff path:nth-child(3){animation-delay:1s}
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
@keyframes dv-cfill{from{transform:translateY(var(--ch))}to{transform:translateY(0)}}
@keyframes dv-foam{0%,45%{transform:scaleY(0)}100%{transform:scaleY(1)}}
@keyframes dv-kib{0%{opacity:0;transform:translateY(-2px)}15%,80%{opacity:1}100%{opacity:0;transform:translateY(12px)}}
@keyframes dv-fbowl{from{transform:translateY(15px)}to{transform:translateY(0)}}
@keyframes dv-bob{0%,100%{transform:scaleY(1)}50%{transform:scaleY(1.2)}}
@keyframes dv-rip{0%{opacity:.6;transform:scale(.4)}100%{opacity:0;transform:scale(4.2)}}
@keyframes dv-bdrop{0%{opacity:0;transform:translate(0,0)}15%{opacity:.95}35%{transform:translate(calc(var(--dx,0) * .4),-4px)}90%{opacity:.8}100%{opacity:0;transform:translate(var(--dx,0),var(--dy,6px))}}
@keyframes dv-jet2{0%,100%{transform:scaleY(1)}50%{transform:scaleY(.86)}}
@keyframes dv-bflow{to{stroke-dashoffset:-64}}
@keyframes dv-fpulse{0%,100%{opacity:1;transform:scale(1)}50%{opacity:.35;transform:scale(1.18)}}
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
      if (c.device_type && !TYPES[c.device_type]) throw new Error("device_type muss washer, dishwasher, airfryer, coffee, feeder, fountain oder generic sein");
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
      if ("ResizeObserver" in window) {
        this._ro ||= new ResizeObserver(() => this._fitLbl());
        this._ro.observe(this);
      }
      if (this._fat && this._e) this._update();
    }
    disconnectedCallback() {
      document.removeEventListener("visibilitychange", this._onVis);
      this._io?.disconnect();
      this._ro?.disconnect();
      this._inView = false;
      this._tick();
      Object.values(this._pend || {}).forEach((p) => clearTimeout(p.t));
      clearTimeout(this._ft);
      clearTimeout(this._fdt);
    }
    _S(id) {
      return id ? this._h?.states[id] : null;
    }
    // Zustandsgruppe (SORDER) oder off
    _cls() {
      const k = this._cls0(), c = this._c, pw = this._S(c.power);
      return k === "off" && TYPES[typeOf(c)].nodone && pw?.state === "on" ? "run" : k;
    }
    _cls0() {
      const c = this._c, s = this._S(c.entity), fd = this._feed();
      if (fd) return fd;
      if (!s) return "off";
      const v = String(s.state).toLowerCase();
      if (["binary_sensor", "switch", "input_boolean"].includes(dom(c.entity)) && !c.running_states) return v === "on" ? "run" : "off";
      for (const k of SORDER) {
        const own = c[SKEY[k]] != null ? list(c[SKEY[k]]).map((x) => x.toLowerCase()) : STATES[k];
        if (own.includes(v)) return k === "done" && TYPES[typeOf(c)].nodone ? "off" : k;
      }
      return "off";
    }
    // Futterautomat ohne „füttert“-Zustand: steigt der Zähler „Fütterungen“, kurz „läuft“ (Animation), danach eine Weile „fertig“
    _feed() {
      const c = this._c;
      if (!TYPES[typeOf(c)].feed || !c.feed_count) return null;
      const s = this._S(c.feed_count), v = ok(s) && NUMRE.test(s.state) ? +s.state : null;
      if (v != null) {
        if (this._fc != null && v > this._fc) this._fat = Date.now();
        this._fc = v;
      }
      if (!this._fat) return null;
      const dt = Date.now() - this._fat, end = FEED_MS + Math.max(0, +(c.feed_done_minutes ?? 10) || 0) * 6e4;
      clearTimeout(this._fdt);
      if (dt >= end) {
        this._fat = 0;
        return null;
      }
      this._fdt = setTimeout(() => this._update(), (dt < FEED_MS ? FEED_MS : end) - dt + 50);
      return dt < FEED_MS ? "run" : "done";
    }
    _build() {
      this._built = true;
      const c = this._c, t = typeOf(c), r = this.shadowRoot || this.attachShadow({ mode: "open" }), cmp = c.layout === "compact";
      const rv = roleVars(c.color || TYPES[t].color);
      const anim = c.animation !== false && !cmp;
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${SCENE_CSS}${DCSS}:host([hidden]){display:none}</style>
<div class="g dv t-${t}${c.window === false ? " nowin" : ""}${cmp ? " cmp" : ""}${anim ? " anim" : ""}${c.glow !== false ? " glow" : ""}" style="--dc:${rv.c};--dc-fg:${rv.fg};--hc:${roleVars(c.heat_color || "accent-2").c}">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div>${cmp ? '<span class="rmc"></span>' : ""}${c.power ? '<div class="hb pw" title="Ein/Aus"><ha-icon icon="mdi:power"></ha-icon></div>' : ""}</div>
${cmp ? '<div class="bar" hidden><i></i></div>' : `<div class="mid"><div class="w-${t}">${scene(t)}</div><div class="inf"><div class="pg"></div><div class="ph" hidden></div><div class="bar" hidden><i></i></div><div class="tm"><span class="rm"></span><span class="en"></span></div></div></div>
<div class="ctls"></div>${c.start_at === "home_connect" && c.start ? SA : ""}${["select", "input_select"].includes(dom(c.start)) && !c.start_option ? PICK : ""}<div class="acts"></div>`}<div class="als"></div></div>`;
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
        cx: q(".ctx"),
        en: q(".en"),
        ctls: q(".ctls"),
        acts: q(".acts"),
        als: q(".als"),
        sa: q(".sa"),
        sat: q(".sa input"),
        san: q(".sa .now"),
        sah: q(".sa .sah"),
        pk: q(".pk"),
        pkv: q(".pk .v"),
        pkk: q(".pk .k")
      };
      const e = this._e;
      press(e.ic, { tap: () => this._act({ entity: c.entity, tap_action: c.tap_action }, "tap", true), hold: () => this._act({ entity: c.entity, hold_action: c.hold_action }, "hold") });
      if (cmp) press(e.name.parentElement, { tap: () => this._act({ entity: c.entity, tap_action: c.tap_action }, "tap", true), hold: () => this._act({ entity: c.entity, hold_action: c.hold_action }, "hold") });
      e.als.addEventListener("click", (ev) => {
        const r2 = ev.target.closest?.(".alr");
        if (r2) {
          const id = r2.dataset.r, d = dom(id);
          return this._call(d, ["button", "input_button"].includes(d) ? "press" : ["script", "scene"].includes(d) ? "turn_on" : "turn_off", id, {}, r2.textContent);
        }
        const el2 = ev.target.closest?.(".al[data-e]");
        if (el2) this._act({ entity: el2.dataset.e }, "tap", true);
      });
      if (e.pw) press(e.pw, { tap: () => this._call(dom(c.power) === "input_boolean" ? "input_boolean" : "switch", "toggle", c.power, {}, "Ein/Aus") });
      if (e.ctls) {
        e.ctls.classList.toggle("c2", String(c.controls_columns) === "2");
        this._ctl = c.controls.map((o) => this._mkCtl(o));
      }
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
      if (e.pk) {
        press(e.pk.querySelector(".mi"), { tap: () => this._pick(-1), isolate: true });
        press(e.pk.querySelector(".pl"), { tap: () => this._pick(1), isolate: true });
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
      } else if (["button", "input_button", "script", "scene"].includes(d)) {
        el2.innerHTML = '<div class="row"><span class="i"></span><span class="k" style="flex:1"></span><div class="hb go"><ha-icon icon="mdi:play"></ha-icon></div></div>';
        up.kind = "btn";
        press(el2.firstChild, { tap: () => this._call(d, d.endsWith("button") ? "press" : "turn_on", o.entity, {}, o.name || "Knopf"), hold: () => this._act(o, "hold") });
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
    // Optionen des Start-Selects ohne leere Einträge; gewählte Option (in der Karte gemerkt, sonst der aktuelle Wert bzw. die erste)
    _pickOpts() {
      return (this._S(this._c.start)?.attributes.options || []).filter((x) => x !== "" && x != null);
    }
    _picked() {
      const o = this._pickOpts(), cur2 = this._S(this._c.start)?.state;
      return o.includes(this._pk) ? this._pk : o.includes(cur2) ? cur2 : o[0];
    }
    _pick(d) {
      const o = this._pickOpts(), i = o.indexOf(this._picked());
      if (!o.length) return;
      this._pk = o[Math.max(0, Math.min(o.length - 1, i + d))];
      this._update();
    }
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
      const [H2, M] = this._at.split(":").map(Number), now = /* @__PURE__ */ new Date(), start = new Date(now);
      start.setHours(H2, M, 0, 0);
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
      if (this._selStart() && !c.start_option) return this._picked() ? null : "Start: keine Auswahl möglich";
      if (this._selStart()) {
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
      if (d === "select" || d === "input_select") return this._call(d, "select_option", id, { option: c.start_option ? this._S(c.start_option)?.state : this._picked() }, what);
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
      const stx = !c.entity ? "Status-Entität im Editor wählen" : na ? "Nicht verfügbar" : own || (["ready", "heat", "warm"].includes(cls) || TY.nodone || raw === s.state && def ? def : nice(s.state, raw));
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
        const f2 = r > 0 && tot > 0 ? Math.min(1, r / tot) : null;
        e.g.classList.toggle("kring", f2 != null);
        e.kp.style.strokeDashoffset = String(100 - (f2 ?? 0) * 100);
        if (e.kt) e.kt.textContent = r > 0 ? fmtDisp(r) : "";
      }
      if (e.wd) e.wd.textContent = cls === "done" ? "End" : cls === "off" ? "" : rem != null ? fmtDisp(rem) : "– –";
      if (TY.drink) this._coffee(cls, p, TY);
      if (TY.mode) {
        const m = this._S(c.mode), v = ok(m) ? String(m.state).toLowerCase() : "";
        const md = cls === "off" ? "off" : !ok(m) ? cls === "run" ? "normal" : "off" : /smart|intelligen|auto|eco|spar/.test(v) ? "smart" : ["off", "aus", "standby"].includes(v) ? "off" : "normal";
        ["normal", "smart", "off"].forEach((k) => e.g.classList.toggle(`m-${k}`, k === md));
      }
      if (TY.level) {
        const lv = levelOf(this._S(c.fill_level), TY.binEmpty);
        e.g.style.setProperty(t === "feeder" ? "--fl" : "--wl", lv == null ? "" : lv.toFixed(2));
        e.g.classList.toggle("empty", lv === 0);
        e.g.classList.toggle("low", lv != null && lv > 0 && lv <= 0.2);
      }
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
        const md = TY.filter ? this._S(c.mode) : null;
        const mt = ok(md) ? nice(md.state, fmtState(h, md)).replace(/^./, (x) => x.toUpperCase()) : null;
        const lt = mt ?? (TY.lvl ? levelText(this._S(c.fill_level), TY.lvl) : null);
        e.pg.textContent = TY.lvl ? lt ?? "" : pg || stx;
        const pu = this._S(c.entity), pon = ok(pu) && pu.state === "on";
        const phx = mt ? cls === "off" ? "" : pon ? "Pumpe läuft" : "Pumpe pausiert" : lt ? TY.lvl[0] : c.phase && ok(ph) ? nice(ph.state, fmtState(h, ph)) : "";
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
        else if (u.kind === "btn") return;
        else v.textContent = valueOf(h, s, o);
      });
      this._fitLbl();
    }
    // Regler-Namen, die nicht passen, ausblenden statt abschneiden (nur Icon + Wert)
    // „Nur Icons“: Namen immer weg (stehen dann im Tooltip)
    _fitLbl() {
      const box = this._e?.ctls;
      if (!box) return;
      if (this._c?.controls_labels === "icon") box.querySelectorAll(".ct .kv .k, .ct .row .k").forEach((k) => {
        k.style.display = "none";
        k.parentElement.title = k.textContent;
      });
      else {
        box.querySelectorAll(".ct .kv .k, .ct .row .k").forEach((k) => {
          if (k.style.display === "none") k.style.display = "";
        });
        fitLabels(box, ".ct .kv .k, .ct .row .k");
      }
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
      if (e.pk) {
        const v = this._picked(), o = this._pickOpts(), i = o.indexOf(v), s = this._S(c.start);
        e.pk.hidden = act || !v;
        e.pkk.textContent = c.start_option_name || TYPES[typeOf(c)].pick || "Auswahl";
        const g = v && /(\d+(?:[.,]\d+)?)\s*g\b/i.exec(v);
        e.pkv.textContent = g ? `${g[1]} g` : v && s ? fmtOpt(this._h, s, v) : "";
        e.pk.querySelector(".mi").classList.toggle("dis", i <= 0);
        e.pk.querySelector(".pl").classList.toggle("dis", i >= o.length - 1);
      }
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
    // Kaffee: Getränk aus „Getränk“, Programm oder Start-Programm → Farben, Tasse/Glas, Milchschaum, Füllung, Display-Text
    _coffee(cls, p, TY) {
      const c = this._c, g = this._e.g, src = [c.drink, c.program, c.start_option].map((x) => this._S(x)).find((x) => ok(x) && x.state !== "off");
      const D = drinkOf(src ? `${src.state} ${fmtState(this._h, src)}` : ""), k = D[0], col = CK[k], milk = MILK.has(k);
      DRINKS.forEach(([x]) => g.classList.toggle(`k-${x}`, x === k));
      ["--cc", "--cr", "--cm"].forEach((v, i) => g.style.setProperty(v, col[i]));
      g.classList.toggle("milk", milk);
      const prog = cls === "run" && p != null, f2 = cls === "done" ? 1 : prog ? p / 100 : 0;
      g.classList.toggle("cprog", prog);
      g.style.setProperty("--cl", f2.toFixed(2));
      g.style.setProperty("--mf", milk ? Math.max(0, Math.min(1, (f2 - 0.45) / 0.55)).toFixed(2) : "0");
      if (this._e.cx) this._e.cx.textContent = { off: "", err: "Störung", done: "Fertig", heat: "Heizt auf", warm: "Warm", wait: "Später" }[cls] ?? (src ? D[2] : cls === "run" ? TY.run : "Bereit");
    }
    _alerts(cls, stx) {
      const c = this._c, h = this._h, t = typeOf(c), TY = TYPES[t], g = this._e.g, out = [], on = /* @__PURE__ */ new Set();
      const add = (lvl, ic, msg, e, hit, r) => out.push(`<div class="al ${lvl}${hit ? " hit" : ""}"${e ? ` data-e="${esc(e)}"` : ""}><ha-icon icon="${esc(ic)}"></ha-icon><span>${esc(msg)}</span>${r && ok(this._S(r.id)) || r && dom(r.id) === "button" ? `<span class="alr" data-r="${esc(r.id)}">${esc(r.name)}</span>` : ""}</div>`);
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
        const an = can.includes(a.anim) ? a.anim : null, H2 = HANIM[an];
        if (an) on.add(an);
        const fd = an === "filter" ? this._S(c.filter_days) : null, fdn = ok(fd) && NUMRE.test(fd.state) ? Math.round(+fd.state) : null;
        const fx = fdn != null ? `noch ${fdn} ${fdn === 1 ? "Tag" : "Tage"}` : "";
        add(
          ["error", "info"].includes(a.level) ? a.level : "warning",
          a.icon || (H2 && an !== "warning" ? H2[2] : s?.attributes.icon) || "mdi:information-outline",
          [a.message || H2 && H2[1] || `${a.name ?? s.attributes.friendly_name ?? a.entity}: ${fmtState(h, s)}`, fx].filter(Boolean).join(" · "),
          a.entity,
          !!an,
          a.reset && { id: a.reset, name: a.reset_name || "Zurücksetzen" }
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
      const vis = !!this._inView && !document.hidden && !this._quiet && this.isConnected;
      this._e?.g.classList.toggle("still", !vis);
      if (vis && !this._vis && this._c.animation !== false) sweep(this._e?.g);
      this._vis = vis;
      const run = vis && this._e && ["run", "wait"].includes(this._prev) && (this._c.end_time || this._c.remaining);
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
  define("geraet-card", NovaApplianceCard, { name: "Nova Gerät Card", description: "Haushaltsgerät (Waschmaschine, Spülmaschine, Airfryer, Kaffeemaschine, Futterautomat, Trinkbrunnen …) mit Status, Programm, Fortschritt, Restzeit, Reglern und Start/Pause/Stopp.", documentationURL: docUrl("nova-gerät-card") });
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
    ...TYPES[t].drink ? [{ name: "drink", selector: ST }] : [],
    ...TYPES[t].level ? [{ name: "fill_level", selector: { entity: { domain: ["sensor", "binary_sensor", "number", "input_number"] } } }] : [],
    ...TYPES[t].filter ? [g2({ name: "filter", selector: { entity: { domain: ["sensor", "number", "input_number"] } } }, { name: "filter_days", selector: { entity: { domain: ["sensor", "number", "input_number"] } } })] : [],
    ...TYPES[t].mode ? [{ name: "mode", selector: { entity: { domain: ["select", "input_select", "sensor", "switch", "input_boolean"] } } }] : [],
    ...TYPES[t].feed ? [g2({ name: "feed_count", selector: { entity: { domain: ["sensor", "counter", "number", "input_number"] } } }, NUM("feed_done_minutes"))] : [],
    g2({ name: "progress", selector: { entity: { domain: ["sensor", "number", "input_number"] } } }, { name: "duration", selector: ST }),
    g2({ name: "remaining", selector: ST }, { name: "end_time", selector: ST }),
    { name: "phase", selector: ST },
    ...TYPES[t].alt ? [{ name: "phase_states", selector: { text: { multiple: true } }, context: { t } }] : []
  ];
  var GCTL = (it) => {
    const d = dom(it.entity);
    return [
      { name: "entity", required: true, selector: { entity: { domain: ["select", "input_select", "number", "input_number", "switch", "input_boolean", "sensor", "button", "input_button", "script", "scene"] } } },
      NAMEICON,
      ...d === "select" || d === "input_select" ? [sel("display", [["auto", "Automatisch"], ["pills", "Alle Optionen als Pillen"], ["list", "Aufklappen"]])] : [],
      ...d === "number" || d === "input_number" ? [g2(sel("display", [["buttons", "Plus / Minus"], ["slider", "Schieber"]]), NUM("step"))] : [],
      sel("show", [["always", "Immer"], ["idle", "Nur vor dem Start"], ["running", "Nur während des Laufs"]])
    ];
  };
  var GCOLS = [g2(sel("controls_columns", [["1", "Untereinander"], ["2", "Zwei nebeneinander"]]), sel("controls_labels", [["auto", "Icon und Name"], ["icon", "Nur Icons"]]))];
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
    ...TYPES[t].dview ? [{ name: "door_anim", selector: { boolean: {} } }] : [],
    g2({ name: "connection", selector: ST }, { name: "connection_text", selector: T })
  ];
  var GHINT = (t) => [
    { name: "entity", required: true, selector: ST },
    sel("anim", [["none", "Keine"], ...animsOf(t).map((k) => [k, HANIM[k][0]])]),
    g2({ name: "message", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } }),
    g2({ name: "state", selector: T }, { name: "state_not", selector: T }),
    g2(NUM("above"), NUM("below")),
    sel("level", [["warning", "Warnung"], ["error", "Fehler"], ["info", "Info"]]),
    g2({ name: "reset", selector: BTN }, { name: "reset_name", selector: T })
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
  var PHASE_LBL = { dishwasher: "Zustände „trocknet“ (Dampf statt Sprüharm)", washer: "Zustände „schleudert“ (schnelle Trommel)" };
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
    drink: "Getränk (optional)",
    fill_level: "Füllstand",
    feed_count: "Fütterungen (Zähler)",
    mode: "Modus (LED)",
    filter: "Filter (%)",
    filter_days: "Filter: Resttage",
    feed_done_minutes: "„Fertig“ zeigen (Minuten)",
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
    reset: "Reset-Knopf im Hinweis",
    reset_name: "Text auf dem Reset-Knopf",
    start_option_name: "Name der Auswahl",
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
    controls_columns: "Anordnung der Regler",
    controls_labels: "Beschriftung der Regler",
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
    drink: "Leer = Programm. Erkennt Espresso, Kaffee, Cappuccino, Latte (Macchiato), Milch, Heißwasser – Kaffeefarbe, Milchschaum und Glas passen sich an",
    fill_level: "Prozent-Sensor (Vorrat bzw. Wasser im Bild) oder binary_sensor „niedrig“ (an = niedrig). 0 % = leer",
    filter: "Erscheint im Hinweis „Filter wechseln“, z. B. sensor.…_filter_percent",
    filter_days: "„noch N Tage“ im Hinweis „Filter wechseln“, z. B. sensor.…_filter_days_remaining",
    mode: "z. B. select.trinkbrunnen_modus. LED: Smart grün, aus grau, sonst (Normal) blau. Leer = LED folgt dem Zustand. Farben per Theme: --nova-mode-normal-color / --nova-mode-smart-color",
    feed_count: "Für Geräte ohne Zustand „füttert“, z. B. sensor.futterautomat_times_dispensed: steigt der Wert, zeigt die Karte die Fütterung",
    feed_done_minutes: "So lange bleibt nach einer Fütterung „Fertig“ mit vollem Napf stehen. Leer = 10",
    duration: "Für den Fortschritt ohne Fortschritts-Sensor und für „Starten um“ (Programmdauer vor dem Start)",
    remaining: "Sensor mit s/min/h oder H:MM. Endzeit wird daraus berechnet",
    end_time: "Zeitpunkt-Sensor. Restzeit wird daraus berechnet",
    phase: "Leer = Status. Steuert die Sonder-Animation und wird unter dem Programm angezeigt",
    phase_states: "Leer = Vorschlag zum Gerätetyp",
    controls_labels: "Nur Icons spart Platz auf kleinen Displays. Bei „Icon und Name“ fällt der Name nur weg, wenn er nicht passt.",
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
    reset: "z. B. button.…_reset_filter – erscheint rechts im Hinweis. Schalter werden ausgeschaltet",
    start_option_name: "Leer = „Portion“ (Futterautomat) bzw. „Auswahl“",
    state_not: "Hinweis bei jedem Zustand außer diesem, z. B. 0 bei einem Fehlercode"
  };
  var gvis = (c) => `${typeOf(c)}|${["select", "input_select"].includes(dom(c.start))}|${!c.resume}`;
  var NovaApplianceCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot, c0 = this._config, t = typeOf(c0);
      GLABELS.phase_states = PHASE_LBL[t] || "Sonder-Zustände";
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap");
      const strip3 = (c) => {
        Object.entries(GDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        if (c.color === TYPES[typeOf(c)].color) delete c.color;
        return c;
      };
      const data = { ...GDEF, color: TYPES[t].color, ...c0 };
      const form = (schema) => this._form(schema, data, (v) => {
        const c = strip3(merge(this._config, names(schema), v));
        this._emit(c);
        if (gvis(c) !== gvis(c0)) this._rebuild();
      });
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(GGEN))),
        this._section("program", "mdi:progress-clock", "Programm und Zeit", (b) => b.append(form(GPROG(t)))),
        this._section("controls", "mdi:tune-variant", "Regler", (b) => {
          b.append(this._hint("Einstellungen vor dem Start, z. B. Programm, Temperatur, Schleudern, „Fertig in“, Kochzeit. Select = Auswahl, Zahl = Plus/Minus, Schalter = Kippschalter, Button/Skript = Knopf zum Auslösen (z. B. Warmhalten)."));
          this._itemList(b, "controls", GCTL, { item: "Regler", icon: "mdi:tune" }, "Regler hinzufügen");
          b.append(form(GCOLS));
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

  // src/shared/todo.js
  var TodoFeed = class {
    // onChange() wird nach jeder Änderung von items/err aufgerufen
    constructor(card, onChange) {
      this.card = card;
      this.onChange = onChange;
      this.id = null;
      this.items = null;
      this.err = null;
    }
    // Liste wechseln (null = keine)
    setEntity(id) {
      if (id === this.id) return;
      this.stop();
      this.id = id || null;
      this.items = null;
      this.err = null;
    }
    // Bei jedem hass-Update aufrufen: startet das Abo bzw. holt im Ersatzweg neu, wenn sich die Liste geändert hat
    update(h, old) {
      const id = this.id;
      if (!id || !h?.states[id]) return;
      if (this.fallback) {
        if (old?.states[id] !== h.states[id] || !this.items) this.fetch(h);
        return;
      }
      if (this.sub || !this.card.isConnected) return;
      if (inPicker(this.card)) {
        this.fallback = true;
        this.fetch(h);
        return;
      }
      this.sub = h.connection.subscribeMessage((m) => {
        if (this.id !== id) return;
        this.items = Array.isArray(m?.items) ? m.items : [];
        this.err = null;
        this.onChange();
      }, { type: "todo/item/subscribe", entity_id: id }).catch((err) => {
        console.warn("[nova-cards] todo: Abo nicht möglich, hole Einträge über todo.get_items", id, err);
        this.sub = null;
        this.fallback = true;
        this.fetch(h);
        return null;
      });
    }
    stop() {
      const s = this.sub;
      this.sub = null;
      this.fallback = false;
      s?.then((u) => typeof u === "function" && u()).catch(() => {
      });
    }
    async fetch(h) {
      const id = this.id;
      if (!h || !id || !h.states[id]) return;
      const n = this._n = (this._n || 0) + 1;
      try {
        const res = await h.callService("todo", "get_items", {}, { entity_id: id }, false, true);
        if (n !== this._n || id !== this.id) return;
        this.items = res?.response?.[id]?.items || [];
        this.err = null;
      } catch (err) {
        this.err = err?.message || "Liste konnte nicht geladen werden";
      }
      this.onChange();
    }
    call(h, service, data) {
      return h.callService("todo", service, data, { entity_id: this.id });
    }
  };

  // src/shared/print-button.js
  var PRINT_CSS = `
.pb{--ok:var(--nova-success-color,var(--nv-a4));display:inline-flex;align-items:center;justify-content:center;gap:8px;flex:none;box-sizing:border-box;
height:44px;min-width:44px;padding:0;border-radius:999px;border:1px solid var(--nv-box-border);background:var(--nv-chip);color:inherit;
font:inherit;font-size:13.5px;font-weight:500;cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent;user-select:none;
transition:background-color .25s,color .25s,border-color .25s,box-shadow .25s,transform .2s,opacity .25s}
.pb.pill{flex:1 1 auto;padding:0 18px;min-width:0}
.pb .pl{white-space:nowrap;overflow:hidden}
.pb ha-icon{--mdc-icon-size:22px;display:flex}
.pb:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
.pb:active:not([disabled]){transform:scale(.94)}
.pb[disabled]{opacity:.4;cursor:default}
.pb.busy{pointer-events:none}
.pb.busy ha-icon{animation:pb-spin 1s linear infinite}
.pb.ok{border-color:color-mix(in srgb,var(--ok) 70%,transparent);background:color-mix(in srgb,var(--ok) 26%,transparent);
box-shadow:0 0 16px color-mix(in srgb,var(--ok) 45%,transparent);opacity:1}
.pb.ok ha-icon{color:var(--ok);animation:pb-pop .35s ease-out}
.pb.err{border-color:color-mix(in srgb,var(--nv-error) 70%,transparent);background:color-mix(in srgb,var(--nv-error) 22%,transparent);opacity:1}
.pb.err ha-icon{color:var(--nv-error)}
@keyframes pb-spin{to{transform:rotate(360deg)}}
@keyframes pb-pop{0%{transform:scale(.4)}70%{transform:scale(1.2)}100%{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.pb.busy ha-icon,.pb.ok ha-icon{animation:none}}
@container (max-width:220px){.pb.pill .pl{display:none}.pb.pill{padding:0}}`;
  var PRINT_DEF = { print_icon: "mdi:printer-pos", print_label: "Drucken", print_style: "pill" };
  var FEEDBACK = 2500;
  function printButton(onTap) {
    const b = document.createElement("button");
    b.type = "button";
    b.className = "pb";
    b.innerHTML = '<ha-icon></ha-icon><span class="pl"></span>';
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      onTap();
    });
    return b;
  }
  function paintBtn(b, look, state, enabled) {
    const icon2 = { busy: "mdi:loading", ok: "mdi:check-bold", err: "mdi:alert-circle-outline" }[state] || look.icon;
    const label = state && state !== "idle" && look[state] || look.label;
    b.className = `pb${look.pill ? " pill" : ""}${state && state !== "idle" ? ` ${state}` : ""}`;
    b.disabled = (!state || state === "idle") && !enabled;
    const ic = b.firstChild;
    if (ic.getAttribute("icon") !== icon2) ic.setAttribute("icon", icon2);
    b.lastChild.textContent = look.pill ? label : "";
    b.title = label;
    b.setAttribute("aria-label", label);
  }
  var printPaint = (b, c, state, enabled) => paintBtn(b, {
    icon: c.print_icon || PRINT_DEF.print_icon,
    label: c.print_label || PRINT_DEF.print_label,
    pill: c.print_style !== "round",
    busy: "Druckt …",
    ok: "Gedruckt",
    err: "Fehler"
  }, state, enabled);
  async function runFeedback(card, key, fn, set) {
    const t = card._pbTs ||= {};
    clearTimeout(t[key]);
    set("busy");
    let ok2 = true;
    try {
      await fn();
    } catch (e) {
      ok2 = false;
      console.warn("[nova-cards] Aktion fehlgeschlagen", key, e);
    }
    set(ok2 ? "ok" : "err");
    t[key] = setTimeout(() => set("idle"), FEEDBACK);
    return ok2;
  }
  var stopFeedback = (card) => Object.values(card._pbTs || {}).forEach(clearTimeout);
  async function runPrint(card, hass, script, data, set, key = "") {
    const name = String(script || "").replace(/^script\./, "");
    if (!name || !hass) return false;
    return runFeedback(card, `print:${name}:${key}`, () => hass.callService("script", name, data || {}), set);
  }
  var printSchema = (extra) => [
    { name: "print_script", selector: { entity: { domain: "script" } } },
    ...extra || [],
    g2({ name: "print_label", selector: T }, { name: "print_icon", selector: I }),
    sel("print_style", [["pill", "Länglich mit Text"], ["round", "Klein und rund"]])
  ];
  var PRINT_LABELS = { print_script: "Druck-Skript", print_label: "Beschriftung", print_icon: "Icon", print_style: "Form des Knopfs" };
  var PRINT_HELPERS = { print_script: "Leer = kein Druck-Knopf. Das Skript wird aufgerufen und die Karte wartet, bis es fertig ist." };

  // src/shopping.js
  var SCSS2 = `
.g.sh{gap:10px}
.add{display:flex;gap:8px;align-items:center;flex:none}
.add .fld{height:44px;border-radius:999px;padding:0 16px}
.ab{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;
border:1px solid var(--nv-box-border);background:var(--nv-chip);color:inherit;outline:none;-webkit-tap-highlight-color:transparent;
transition:background-color .2s,color .2s,border-color .2s,transform .2s,opacity .2s}
.ab ha-icon{--mdc-icon-size:22px}
.ab:not([disabled]){color:var(--nv-active);border-color:color-mix(in srgb,var(--nv-active) 45%,transparent)}
.ab[disabled]{opacity:.4;cursor:default}
.ab:active:not([disabled]){transform:scale(.92)}
.ab:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
.items{flex:1 1 0;min-height:var(--lh,200px);overflow-y:auto;overscroll-behavior:contain;display:flex;flex-direction:column;gap:6px;
scrollbar-width:thin;margin:0 -4px;padding:0 4px;-webkit-mask-image:linear-gradient(#000 calc(100% - 14px),transparent);mask-image:linear-gradient(#000 calc(100% - 14px),transparent);padding-bottom:10px}
.it{display:flex;align-items:center;gap:12px;padding:10px 12px;border-radius:16px;min-width:0;flex:none;
background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07);transition:background-color .25s,border-color .25s,opacity .4s}
.it:active{transform:scale(.985)}
.ck{width:22px;height:22px;border-radius:50%;flex:none;box-sizing:border-box;border:2px solid rgba(255,255,255,.45);display:flex;align-items:center;justify-content:center;
transition:background-color .25s,border-color .25s,box-shadow .25s}
.ck ha-icon{--mdc-icon-size:15px;opacity:0;transform:scale(.4);transition:opacity .2s,transform .25s}
.it .tx{flex:1;min-width:0;font-size:14px;overflow-wrap:anywhere;transition:opacity .25s}
.it .tx small{display:block;font-size:11.5px;opacity:.6;margin-top:2px}
.it.done .ck{background:var(--nv-active);border-color:var(--nv-active);color:var(--nv-active-fg);box-shadow:0 0 12px color-mix(in srgb,var(--nv-active) 50%,transparent)}
.it.done .ck ha-icon{opacity:1;transform:scale(1)}
.it.done .tx{text-decoration:line-through;opacity:.5}
.it.leave{opacity:.35}
.msg{display:flex;align-items:center;gap:8px;font-size:13px;opacity:.6;padding:10px 4px}
.msg ha-icon{--mdc-icon-size:18px}
.ft{display:flex;justify-content:flex-end;gap:8px;flex:none}
.ft[hidden]{display:none}
@media (prefers-reduced-motion:reduce){.it,.ck,.ck ha-icon,.it .tx{transition:none}}`;
  var SDEF = { icon: "mdi:cart-outline", placeholder: "Neuer Eintrag …", show_header: true, show_completed: false, height: 200, ...PRINT_DEF };
  var LEAVE = 900;
  var NovaShoppingCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("shopping-card-editor"));
    }
    static getStubConfig(h) {
      const ids = Object.keys(h.states);
      const todo = ids.find((id) => /^todo\..*einkauf/.test(id)) || ids.find((id) => id === "todo.shopping_list") || ids.find((id) => id.startsWith("todo."));
      const script = ids.find((id) => /^script\..*einkauf.*druck/.test(id));
      return { ...todo ? { entity: todo } : {}, ...script ? { print_script: script } : {} };
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      this._c = { ...SDEF, ...c };
      (this._feed ||= new TodoFeed(this, () => this._render())).setEntity(this._c.entity);
      this._ids = [this._c.entity, this._c.print_script].filter(Boolean);
      if (this._e) this._apply();
      if (this._h) this._feed.update(this._h);
    }
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._e) this._build();
      this._feed.update(h, old);
      if (hassChanged(old, h, this._ids)) this._render();
    }
    getCardSize() {
      return 5;
    }
    getGridOptions() {
      return { columns: 6, rows: "auto", min_columns: 3 };
    }
    connectedCallback() {
      if (this._h && this._c) this._feed.update(this._h);
    }
    disconnectedCallback() {
      this._feed?.stop();
      stopFeedback(this);
      this._leaving?.forEach((x) => clearTimeout(x.t));
      this._leaving = /* @__PURE__ */ new Map();
    }
    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${FIELD_CSS}${PRINT_CSS}${SCSS2}</style><div class="g sh">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<form class="add"><input class="fld" type="text" enterkeyhint="done" autocomplete="off"><button class="ab" type="submit" title="Hinzufügen" aria-label="Hinzufügen"><ha-icon icon="mdi:plus"></ha-icon></button></form>
<div class="items"></div><div class="ft"></div></div>`;
      const q = (s) => r.querySelector(s);
      this._e = { g: q(".g"), hd: q(".hd"), ic: q(".hd .ic"), name: q(".hd b"), sub: q(".hd small"), form: q("form"), inp: q("input"), ab: q(".ab"), items: q(".items"), ft: q(".ft") };
      this._leaving = /* @__PURE__ */ new Map();
      this._pstate = "idle";
      const e = this._e;
      e.form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        this._add();
      });
      e.inp.addEventListener("input", () => {
        e.ab.disabled = !e.inp.value.trim();
      });
      e.inp.addEventListener("keydown", (ev) => ev.stopPropagation());
      press(e.ic, { tap: () => this._c.entity && moreInfo(this, this._c.entity) });
      this._pb = printButton(() => this._print());
      e.ft.append(this._pb);
      this._apply();
    }
    _apply() {
      const c = this._c, e = this._e;
      e.hd.hidden = c.show_header === false;
      e.inp.placeholder = c.placeholder || "";
      e.ab.disabled = !e.inp.value.trim();
      e.g.style.setProperty("--lh", `${Math.max(60, +c.height || SDEF.height)}px`);
      this._render();
    }
    _open() {
      return (this._feed.items || []).filter((i) => i.status === "needs_action");
    }
    _render() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !c || !e) return;
      const s = c.entity && h.states[c.entity];
      setIcon(e.ic, c.icon);
      e.name.textContent = c.name || s?.attributes.friendly_name || "Einkaufsliste";
      const open = this._open(), n = open.filter((i) => !this._leaving.has(i.uid)).length;
      e.sub.textContent = !s ? "" : this._feed.items ? n ? `${n} offen` : "Alles erledigt" : "Wird geladen …";
      e.inp.disabled = !s;
      let msg = null;
      if (!c.entity) msg = ["mdi:format-list-checks", "Keine Liste gewählt – im Editor eine todo-Entität auswählen."];
      else if (!s) msg = ["mdi:alert-circle-outline", `Liste nicht gefunden: ${c.entity}`];
      else if (this._feed.err && !this._feed.items) msg = ["mdi:alert-circle-outline", this._feed.err];
      else if (!this._feed.items) msg = ["mdi:timer-sand", "Wird geladen …"];
      const rows = [...open.map((i) => ({ ...i, done: this._leaving.has(i.uid) }))];
      this._leaving.forEach((x, uid) => {
        if (!rows.some((r) => r.uid === uid)) rows.push({ ...x.item, done: true, leave: true });
      });
      if (c.show_completed) rows.push(...(this._feed.items || []).filter((i) => i.status === "completed" && !this._leaving.has(i.uid)).map((i) => ({ ...i, done: true })));
      if (!msg && !rows.length) msg = ["mdi:cart-check", "Nichts auf der Liste"];
      const key = JSON.stringify([msg, rows.map((r) => [r.uid, r.summary, r.description, r.done, r.leave])]);
      if (key !== this._key) {
        this._key = key;
        if (msg) {
          const m = document.createElement("div");
          m.className = "msg";
          m.innerHTML = `<ha-icon></ha-icon><span></span>`;
          m.firstChild.setAttribute("icon", msg[0]);
          m.lastChild.textContent = msg[1];
          e.items.replaceChildren(m);
        } else e.items.replaceChildren(...rows.map((r) => this._row(r)));
      }
      e.ft.hidden = !c.print_script;
      printPaint(this._pb, c, this._pstate, !!s && n > 0 && !!h.states[c.print_script]);
    }
    _row(it) {
      const el2 = document.createElement("div");
      el2.className = `it${it.done ? " done" : ""}${it.leave ? " leave" : ""}`;
      el2.innerHTML = '<span class="ck"><ha-icon icon="mdi:check-bold"></ha-icon></span><span class="tx"></span>';
      const tx = el2.lastChild;
      tx.textContent = it.summary;
      if (it.description) {
        const sm = document.createElement("small");
        sm.textContent = it.description;
        tx.append(sm);
      }
      el2.setAttribute("aria-checked", it.done ? "true" : "false");
      press(el2, { tap: () => this._toggle(it, el2) });
      el2.setAttribute("role", "checkbox");
      return el2;
    }
    _toggle(it, el2) {
      const h = this._h, id = this._c.entity;
      if (!h || !id || it.leave) return;
      if (it.status === "needs_action" && !this._leaving.has(it.uid)) {
        el2.classList.add("done");
        const t = setTimeout(() => {
          this._leaving.delete(it.uid);
          this._render();
        }, LEAVE);
        this._leaving.set(it.uid, { item: it, t });
        h.callService("todo", "update_item", { item: it.uid, status: "completed" }, { entity_id: id }).catch((err) => {
          console.warn("[nova-cards] Einkauf: Abhaken fehlgeschlagen", err);
          clearTimeout(t);
          this._leaving.delete(it.uid);
          this._render();
        });
        this._render();
      } else if (it.status === "completed") {
        h.callService("todo", "update_item", { item: it.uid, status: "needs_action" }, { entity_id: id });
      }
    }
    _add() {
      const h = this._h, id = this._c.entity, e = this._e, v = e.inp.value.trim();
      if (!h || !id || !v) return;
      e.inp.value = "";
      e.ab.disabled = true;
      h.callService("todo", "add_item", { item: v }, { entity_id: id }).catch((err) => {
        console.warn("[nova-cards] Einkauf: Hinzufügen fehlgeschlagen", err);
        if (!e.inp.value) {
          e.inp.value = v;
          e.ab.disabled = false;
        }
      });
      e.inp.focus();
    }
    _print() {
      runPrint(this, this._h, this._c.print_script, {}, (st) => {
        this._pstate = st;
        this._render();
      });
    }
  };
  define("shopping-card", NovaShoppingCard, { name: "Nova Einkauf Card", description: "Einkaufsliste aus einer todo-Liste: Einträge direkt in der Karte hinzufügen, offene Punkte abhaken und die Liste per Skript drucken (z. B. auf einem Bondrucker).", documentationURL: docUrl("nova-einkauf-card") });
  var GEN = [
    { name: "entity", required: true, selector: { entity: { domain: "todo" } } },
    g2({ name: "name", selector: T }, { name: "icon", selector: I }),
    { name: "show_header", selector: { boolean: {} } }
  ];
  var LIST = [
    { name: "placeholder", selector: T },
    { name: "show_completed", selector: { boolean: {} } },
    { name: "height", selector: { number: { min: 60, max: 1e3, step: 10, mode: "box", unit_of_measurement: "px" } } }
  ];
  var PRINT = printSchema();
  var LABELS4 = {
    ...BASE_LABELS,
    ...PRINT_LABELS,
    entity: "Einkaufsliste (todo)",
    name: "Name",
    show_header: "Kopfzeile anzeigen",
    placeholder: "Platzhalter im Eingabefeld",
    show_completed: "Erledigte Einträge anzeigen",
    height: "Mindesthöhe der Liste"
  };
  var HELPERS4 = {
    ...PRINT_HELPERS,
    name: "Leer = Name der Liste",
    show_completed: "Erledigte stehen durchgestrichen unten, Antippen holt sie zurück.",
    height: "So hoch ist die Liste mindestens; mehr Einträge lassen sich scrollen. Im Raster füllt die Liste den Platz aus."
  };
  var NovaShoppingCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), data = { ...SDEF, ...c0 };
      const strip3 = (c) => {
        Object.entries(SDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        return c;
      };
      const form = (schema) => this._form(schema, data, (v) => this._emit(strip3(merge(this._config, names(schema), v))));
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(GEN))),
        this._section("list", "mdi:format-list-checks", "Liste", (b) => b.append(form(LIST))),
        this._section("print", "mdi:printer-pos", "Drucken", (b) => b.append(form(PRINT)))
      );
    }
  };
  __publicField(NovaShoppingCardEditor, "labels", LABELS4);
  __publicField(NovaShoppingCardEditor, "helpers", HELPERS4);
  __publicField(NovaShoppingCardEditor, "openSections", ["general"]);
  define("shopping-card-editor", NovaShoppingCardEditor);

  // src/note.js
  var NCSS = `
.g.nt{gap:10px}
.fld.ta{flex:1 1 0;min-height:var(--th,180px);resize:none;border-radius:18px;padding:14px 16px;line-height:1.5;
overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;white-space:pre-wrap}
.ft{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex:none;container-type:inline-size;width:100%}
.ft[hidden]{display:none}
.cnt{flex:1;min-width:0;font-size:12px;opacity:.55;white-space:nowrap;overflow:hidden}
.ft .pb.pill{flex:0 1 auto;min-width:44px}
.ft.wide .cnt{display:none}.ft.wide .pb.pill{flex:1 1 0}
.cl,.nb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;
border:1px solid var(--nv-box-border);background:var(--nv-chip);color:inherit;outline:none;-webkit-tap-highlight-color:transparent;
transition:opacity .2s,transform .2s,background-color .2s,border-color .2s,color .2s}
.cl ha-icon{--mdc-icon-size:20px}
.cl[disabled]{opacity:.35;cursor:default}
.cl:active:not([disabled]),.nb:active{transform:scale(.92)}
.cl:focus-visible,.nb:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
@container (max-width:420px){.cnt{display:none}}
@container (max-width:330px){.ft .pb.pill .pl{display:none}.ft .pb.pill{padding:0;flex:0 0 44px}}
.ns{flex:1 1 0;min-height:var(--nh,180px);display:flex;flex-direction:column;gap:6px}
.ns[hidden]{display:none}
.ns .bt{margin:2px 2px 0}
.nl{flex:1 1 0;min-height:0;overflow-y:auto;overscroll-behavior:contain;display:flex;flex-direction:column;gap:6px;scrollbar-width:thin;
margin:0 -4px;padding:0 4px 10px;-webkit-mask-image:linear-gradient(#000 calc(100% - 14px),transparent);mask-image:linear-gradient(#000 calc(100% - 14px),transparent)}
.nr{display:flex;align-items:center;gap:10px;padding:8px 8px 8px 14px;border-radius:16px;flex:none;min-width:0;
background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07)}
.nr .tx{flex:1;min-width:0}
.nr b{display:block;font-weight:500;font-size:14px;overflow-wrap:anywhere}
.nr small{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:12px;opacity:.6;margin-top:2px;white-space:pre-line;overflow-wrap:anywhere}
.nr .pb,.nr .nb{width:38px;height:38px;min-width:38px}
.nr .pb ha-icon,.nr .nb ha-icon{--mdc-icon-size:19px}
.nb.arm{border-color:color-mix(in srgb,var(--nv-error) 70%,transparent);background:color-mix(in srgb,var(--nv-error) 22%,transparent);color:var(--nv-error)}
.msg{display:flex;align-items:center;gap:8px;font-size:13px;opacity:.6;padding:8px 4px}
.msg ha-icon{--mdc-icon-size:18px}`;
  var NDEF = {
    name: "Notiz",
    icon: "mdi:note-edit-outline",
    placeholder: "Notiz schreiben …",
    show_header: true,
    show_clear: true,
    clear_after_print: true,
    clear_after_save: true,
    height: 180,
    notes_height: 180,
    print_field: "text",
    ...PRINT_DEF
  };
  var STORE = "nova-note:";
  var SHORT = 60;
  var ARM = 3e3;
  var shortOf = (txt) => {
    const line = txt.split("\n").map((s) => s.trim()).find(Boolean) || "";
    if (line.length <= SHORT) return line;
    const cut = line.slice(0, SHORT), sp = cut.lastIndexOf(" ");
    return `${(sp > SHORT / 2 ? cut.slice(0, sp) : cut).trimEnd()} …`;
  };
  var textOf = (it) => (it.description || it.summary || "").replace(/\s+$/, "");
  var NovaNoteCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("note-card-editor"));
    }
    static getStubConfig(h) {
      const ids = Object.keys(h.states);
      const script = ids.find((id) => /^script\..*notiz.*druck/.test(id)), notes = ids.find((id) => /^todo\..*notiz/.test(id));
      return { ...script ? { print_script: script } : {}, ...notes ? { notes_entity: notes } : {} };
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      this._c = { ...NDEF, ...c };
      (this._feed ||= new TodoFeed(this, () => this._render())).setEntity(this._c.notes_entity);
      this._ids = [this._c.print_script, this._c.notes_entity].filter(Boolean);
      if (this._e) this._apply();
      if (this._h) this._feed.update(this._h);
    }
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._e) this._build();
      this._feed.update(h, old);
      if (hassChanged(old, h, this._ids)) this._render();
    }
    getCardSize() {
      return this._c?.notes_entity ? 8 : 4;
    }
    getGridOptions() {
      return { columns: 6, rows: "auto", min_columns: 3 };
    }
    connectedCallback() {
      if (this._h && this._c) this._feed.update(this._h);
    }
    disconnectedCallback() {
      this._feed?.stop();
      stopFeedback(this);
      clearTimeout(this._st);
      clearTimeout(this._armT);
      this._armed = null;
      this._save();
    }
    // Entwurf je Karte (Name + Skript), nur in diesem Browser
    _key() {
      return `${STORE}${this._c.storage_key || `${this._c.print_script || ""}|${this._c.name || ""}`}`;
    }
    _load() {
      try {
        return localStorage.getItem(this._key()) || "";
      } catch {
        return "";
      }
    }
    _save() {
      if (!this._e) return;
      const v = this._e.ta.value;
      try {
        if (v) localStorage.setItem(this._key(), v);
        else localStorage.removeItem(this._key());
      } catch {
      }
    }
    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${FIELD_CSS}${PRINT_CSS}${NCSS}</style><div class="g nt">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<textarea class="fld ta" spellcheck="true"></textarea>
<div class="ft"><span class="cnt"></span><button class="cl" type="button" title="Leeren" aria-label="Leeren"><ha-icon icon="mdi:eraser"></ha-icon></button></div>
<div class="ns"><div class="bt">Gespeichert</div><div class="nl"></div></div></div>`;
      const q = (s) => r.querySelector(s);
      this._e = {
        g: q(".g"),
        hd: q(".hd"),
        ic: q(".hd .ic"),
        name: q(".hd b"),
        sub: q(".hd small"),
        ta: q("textarea"),
        ft: q(".ft"),
        cnt: q(".cnt"),
        cl: q(".cl"),
        ns: q(".ns"),
        nt: q(".ns .bt"),
        nl: q(".nl")
      };
      const e = this._e;
      this._pstate = "idle";
      this._sstate = "idle";
      this._nstate = {};
      e.ta.value = this._load();
      e.ta.addEventListener("input", () => {
        this._render();
        clearTimeout(this._st);
        this._st = setTimeout(() => this._save(), 400);
      });
      e.ta.addEventListener("keydown", (ev) => {
        ev.stopPropagation();
        if (ev.key === "Enter" && (ev.ctrlKey || ev.metaKey)) {
          ev.preventDefault();
          this._print();
        }
      });
      e.cl.addEventListener("click", () => {
        e.ta.value = "";
        this._save();
        this._render();
        e.ta.focus();
      });
      this._sb = printButton(() => this._store());
      this._pb = printButton(() => this._print());
      e.ft.append(this._sb, this._pb);
      this._apply();
    }
    _apply() {
      const c = this._c, e = this._e;
      e.hd.hidden = c.show_header === false;
      e.ta.placeholder = c.placeholder || "";
      e.g.style.setProperty("--th", `${Math.max(60, +c.height || NDEF.height)}px`);
      e.g.style.setProperty("--nh", `${Math.max(60, +c.notes_height || NDEF.notes_height)}px`);
      if (!e.ta.value) e.ta.value = this._load();
      this._key2 = null;
      this._render();
    }
    _render() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !c || !e) return;
      setIcon(e.ic, c.icon);
      e.name.textContent = c.name || NDEF.name;
      const txt = e.ta.value, n = txt.trim().length, lines = txt ? txt.split("\n").length : 0;
      const missing = c.print_script && !h.states[c.print_script];
      const notes = c.notes_entity && h.states[c.notes_entity];
      const saved2 = this._feed.items?.filter((i) => i.status !== "completed") || [];
      e.sub.textContent = missing ? `Skript nicht gefunden: ${c.print_script}` : n ? "Bereit" : notes ? `${saved2.length} gespeichert` : "Leer";
      e.cnt.textContent = n ? `${txt.length} Zeichen · ${lines} ${lines === 1 ? "Zeile" : "Zeilen"}` : "";
      e.cl.hidden = c.show_clear === false;
      e.cl.disabled = !txt;
      const pill = c.print_style !== "round";
      this._pb.hidden = !c.print_script;
      this._sb.hidden = !c.notes_entity;
      e.ft.hidden = !c.print_script && !c.notes_entity && c.show_clear === false;
      printPaint(this._pb, c, this._pstate, n > 0 && !missing);
      paintBtn(this._sb, { icon: "mdi:content-save-outline", label: "Speichern", pill, busy: "Speichert …", ok: "Gespeichert", err: "Fehler" }, this._sstate, n > 0 && !!notes);
      e.ft.classList.toggle("wide", pill && c.show_clear === false);
      this._renderNotes(saved2, notes, missing);
    }
    // Gespeicherte Notizen, neueste oben (todo.add_item hängt hinten an)
    _renderNotes(saved2, notes, missing) {
      const c = this._c, e = this._e;
      e.ns.hidden = !c.notes_entity;
      if (!c.notes_entity) return;
      let msg = null;
      if (!notes) msg = ["mdi:alert-circle-outline", `Liste nicht gefunden: ${c.notes_entity}`];
      else if (this._feed.err && !this._feed.items) msg = ["mdi:alert-circle-outline", this._feed.err];
      else if (!this._feed.items) msg = ["mdi:timer-sand", "Wird geladen …"];
      else if (!saved2.length) msg = ["mdi:note-outline", "Noch keine Notizen gespeichert"];
      const rows = [...saved2].reverse();
      e.nt.textContent = rows.length ? `Gespeichert · ${rows.length}` : "Gespeichert";
      const key = JSON.stringify([msg, rows.map((r) => [r.uid, r.summary, r.description, this._nstate[r.uid], this._armed === r.uid]), !!c.print_script, missing, c.print_icon]);
      if (key === this._key2) return;
      this._key2 = key;
      if (msg) {
        const m = document.createElement("div");
        m.className = "msg";
        m.innerHTML = "<ha-icon></ha-icon><span></span>";
        m.firstChild.setAttribute("icon", msg[0]);
        m.lastChild.textContent = msg[1];
        e.nl.replaceChildren(m);
        return;
      }
      e.nl.replaceChildren(...rows.map((it) => this._noteRow(it, missing)));
    }
    _noteRow(it, missing) {
      const c = this._c, el2 = document.createElement("div");
      el2.className = "nr";
      el2.innerHTML = '<div class="tx"><b></b><small></small></div>';
      el2.querySelector("b").textContent = it.summary;
      const sm = el2.querySelector("small"), full = textOf(it), rest = full.startsWith(it.summary.replace(/ …$/, "")) ? full.slice(it.summary.replace(/ …$/, "").length).trim() : full;
      sm.textContent = it.description ? rest : "";
      sm.hidden = !sm.textContent;
      if (c.print_script) {
        const pb = printButton(() => this._printNote(it));
        paintBtn(pb, { icon: c.print_icon || PRINT_DEF.print_icon, label: "Drucken", pill: false, busy: "Druckt …", ok: "Gedruckt", err: "Fehler" }, this._nstate[it.uid], !missing);
        el2.append(pb);
      }
      const del = document.createElement("button");
      del.type = "button";
      const armed = this._armed === it.uid;
      del.className = `nb${armed ? " arm" : ""}`;
      del.title = armed ? "Nochmal tippen zum Löschen" : "Löschen";
      del.setAttribute("aria-label", del.title);
      del.innerHTML = `<ha-icon icon="${armed ? "mdi:delete-alert-outline" : "mdi:delete-outline"}"></ha-icon>`;
      del.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._delete(it);
      });
      el2.append(del);
      return el2;
    }
    async _print() {
      const c = this._c, e = this._e, txt = e.ta.value.replace(/\s+$/, "");
      if (!txt.trim() || this._pstate === "busy") return;
      const ok2 = await runPrint(this, this._h, c.print_script, { [c.print_field || "text"]: txt }, (st) => {
        this._pstate = st;
        this._render();
      });
      if (ok2 && c.clear_after_print !== false && e.ta.value.replace(/\s+$/, "") === txt) {
        e.ta.value = "";
        this._save();
        this._render();
      }
    }
    _printNote(it) {
      const c = this._c, txt = textOf(it);
      if (!txt || this._nstate[it.uid] === "busy") return;
      runPrint(this, this._h, c.print_script, { [c.print_field || "text"]: txt }, (st) => {
        if (st === "idle") delete this._nstate[it.uid];
        else this._nstate[it.uid] = st;
        this._render();
      }, it.uid);
    }
    async _store() {
      const c = this._c, e = this._e, h = this._h, txt = e.ta.value.replace(/\s+$/, "").replace(/^\s*\n/, "");
      if (!txt.trim() || !c.notes_entity || this._sstate === "busy") return;
      const summary = shortOf(txt), data = { item: summary, ...txt !== summary ? { description: txt } : {} };
      const ok2 = await runFeedback(this, "save", () => this._feed.call(h, "add_item", data), (st) => {
        this._sstate = st;
        this._render();
      });
      if (ok2 && c.clear_after_save !== false && e.ta.value.replace(/\s+$/, "").replace(/^\s*\n/, "") === txt) {
        e.ta.value = "";
        this._save();
        this._render();
      }
    }
    // Löschen in zwei Schritten: erstes Antippen färbt den Knopf rot, zweites (innerhalb von 3 s) löscht
    _delete(it) {
      clearTimeout(this._armT);
      if (this._armed !== it.uid) {
        this._armed = it.uid;
        this._armT = setTimeout(() => {
          this._armed = null;
          this._render();
        }, ARM);
        this._render();
        return;
      }
      this._armed = null;
      this._feed.call(this._h, "remove_item", { item: [it.uid] }).catch((err) => console.warn("[nova-cards] Notiz: Löschen fehlgeschlagen", err));
      this._render();
    }
  };
  define("note-card", NovaNoteCard, { name: "Nova Notiz Card", description: "Mehrzeiliges Notizfeld mit Druck-Knopf (z. B. für einen Bondrucker); Notizen lassen sich in einer todo-Liste speichern und später wieder drucken oder löschen.", documentationURL: docUrl("nova-notiz-card") });
  var H = (n) => ({ name: n, selector: { number: { min: 60, max: 1e3, step: 10, mode: "box", unit_of_measurement: "px" } } });
  var GEN2 = [
    g2({ name: "name", selector: T }, { name: "icon", selector: I }),
    { name: "show_header", selector: { boolean: {} } },
    { name: "placeholder", selector: T },
    g2({ name: "show_clear", selector: { boolean: {} } }, H("height"))
  ];
  var NOTES = [
    { name: "notes_entity", selector: { entity: { domain: "todo" } } },
    g2(H("notes_height"), { name: "clear_after_save", selector: { boolean: {} } })
  ];
  var PRINT2 = printSchema([g2({ name: "print_field", selector: T }, { name: "clear_after_print", selector: { boolean: {} } })]);
  var LABELS5 = {
    ...BASE_LABELS,
    ...PRINT_LABELS,
    name: "Name",
    show_header: "Kopfzeile anzeigen",
    placeholder: "Platzhalter im Textfeld",
    show_clear: "Knopf „Leeren“",
    height: "Mindesthöhe des Textfelds",
    print_field: "Feldname im Skript",
    clear_after_print: "Nach dem Druck leeren",
    notes_entity: "Liste für gespeicherte Notizen (todo)",
    notes_height: "Mindesthöhe der Liste",
    clear_after_save: "Nach dem Speichern leeren"
  };
  var HELPERS5 = {
    ...PRINT_HELPERS,
    print_field: "Unter diesem Namen bekommt das Skript den Text (Standard: text).",
    height: "Im Raster füllt das Textfeld den Platz aus.",
    notes_entity: "Leer = ohne Speichern. Z. B. eine lokale To-do-Liste „Notizen“. Erste Zeile = Titel, ganzer Text in der Beschreibung."
  };
  var NovaNoteCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), data = { ...NDEF, ...c0 };
      const strip3 = (c) => {
        Object.entries(NDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        return c;
      };
      const form = (schema) => this._form(schema, data, (v) => this._emit(strip3(merge(this._config, names(schema), v))));
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(GEN2))),
        this._section("notes", "mdi:note-multiple-outline", "Gespeicherte Notizen", (b) => b.append(form(NOTES))),
        this._section("print", "mdi:printer-pos", "Drucken", (b) => b.append(form(PRINT2)))
      );
    }
  };
  __publicField(NovaNoteCardEditor, "labels", LABELS5);
  __publicField(NovaNoteCardEditor, "helpers", HELPERS5);
  __publicField(NovaNoteCardEditor, "openSections", ["general"]);
  define("note-card-editor", NovaNoteCardEditor);

  // src/shared/marquee.js
  var MARQUEE_CSS = `
.mq{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.mq>.mqi{display:inline}
.mq.run{text-overflow:clip;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 6px,#000 calc(100% - 14px),transparent);mask-image:linear-gradient(90deg,transparent 0,#000 6px,#000 calc(100% - 14px),transparent)}
.mq.run>.mqi{display:inline-block;padding-left:4px;animation:nv-mq var(--mqd,8s) ease-in-out infinite alternate;will-change:transform}
@keyframes nv-mq{0%,18%{transform:translateX(0)}82%,100%{transform:translateX(var(--mqx,0))}}
@media(prefers-reduced-motion:reduce){.mq.run{text-overflow:ellipsis;-webkit-mask-image:none;mask-image:none}.mq.run>.mqi{display:inline;padding-left:0;animation:none}}`;
  var SPEED2 = 28;
  var MIN = 5;
  var marquee = (el2, text, still = false) => {
    if (!el2) return;
    el2.classList.add("mq");
    let span = el2.querySelector(":scope>.mqi");
    if (!span) {
      el2.textContent = "";
      span = document.createElement("span");
      span.className = "mqi";
      el2.appendChild(span);
    }
    if (span.textContent !== text) span.textContent = text;
    el2._mqStill = still;
    if (!el2._mqRo && typeof ResizeObserver !== "undefined") {
      el2._mqRo = new ResizeObserver(() => fit(el2));
      el2._mqRo.observe(el2);
    }
    fit(el2);
  };
  var fit = (el2) => {
    const span = el2.querySelector(":scope>.mqi");
    if (!span) return;
    el2.classList.remove("run");
    const over = span.getBoundingClientRect().width - el2.clientWidth;
    if (el2._mqStill || !el2.isConnected || el2.clientWidth <= 0 || over <= 1) return;
    const dist = Math.ceil(over) + 18;
    el2.style.setProperty("--mqx", `-${dist}px`);
    el2.style.setProperty("--mqd", `${Math.max(MIN, dist / SPEED2 / 0.64).toFixed(1)}s`);
    el2.classList.add("run");
  };
  var stopMarquee = (el2) => {
    if (!el2?._mqRo) return;
    el2._mqRo.disconnect();
    el2._mqRo = null;
    el2.classList.remove("run");
  };

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
  var DEF4 = { stack_below: 500, chips_layout: "wrap" };
  var ACSS = `${CARD_CSS}${GRID_CSS}${NOVA_CHIPS_CSS}${MARQUEE_CSS}
:host{height:auto}
:host(.tint)::before{background:linear-gradient(160deg,color-mix(in srgb,var(--tc) 45%,transparent),transparent 75%),var(--nv-bg)}
.g{height:auto;display:flex;flex-direction:column;gap:12px;padding:14px}
.hd{display:flex;align-items:center;gap:10px;padding:6px;border-radius:999px;background:var(--nv-chip)}
.hd.nb{padding-left:14px}
.hi{display:flex}.hi:empty{display:none}
.tt{flex:1 1 auto;min-width:min(35%,110px);font-weight:600;font-size:15px}
.x{width:36px;height:36px;border-radius:50%;border:none;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:inherit;cursor:pointer;padding:0}
.x:active{transform:scale(.92)}
.x:focus-visible{outline:none;box-shadow:0 0 0 2px var(--nv-active)}
.x[hidden]{display:none}
.hd .nchips{flex:0 1 auto;justify-content:flex-end}
.hd .nchip{min-height:36px}
.body{display:flex;flex-direction:column;gap:12px}
/* Ohne Karten nur die Kopfzeile (z. B. als Titelleiste mit Zurück); im Editor bleibt der Hinweis sichtbar */
.g:not(.prev) .body:has(>.hint:only-child){display:none}
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
      this._cfg = { ...DEF4, ...c, chips: normChips(c.chips) };
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
      const tt = this.shadowRoot?.querySelector(".tt");
      if (tt?.firstElementChild) marquee(tt, tt.textContent, inPicker(this));
    }
    disconnectedCallback() {
      this._ro.disconnect();
      stopMarquee(this.shadowRoot?.querySelector(".tt"));
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
      marquee(r.querySelector(".tt"), c.name || ar?.name || (c.area ? c.area : "Keine Area gewählt"), inPicker(this));
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
  var LABELS6 = {
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
  var HELPERS6 = {
    ...CHIP_HELPERS,
    ...GRID_HELPERS,
    back_action: "Ohne Angabe geht es eine Seite zurück. „Keine Aktion“ blendet den Knopf aus.",
    stack_below: "Ist die Karte schmaler als dieser Wert, stehen alle Karten untereinander (0 = nie)."
  };
  var strip2 = (c) => {
    Object.keys(DEF4).forEach((k) => {
      if (c[k] === DEF4[k]) delete c[k];
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
      const data = { ...DEF4, ...c };
      const form = (sch) => this._form(sch, data, (v) => this._emit(strip2(merge(this._config, names(sch), v))));
      r.querySelector(".wrap").append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => {
          const sch = S_GEN3(h?.areas?.[c.area]?.icon);
          b.append(
            this._form(sch, data, (v) => {
              const n = strip2(merge(this._config, names(sch), v));
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
  __publicField(NovaAreaCardEditor, "labels", LABELS6);
  __publicField(NovaAreaCardEditor, "helpers", HELPERS6);
  __publicField(NovaAreaCardEditor, "openSections", ["general"]);
  define("area-card-editor", NovaAreaCardEditor);

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
  var panelEl = () => document.querySelector("home-assistant")?.shadowRoot?.querySelector("home-assistant-main")?.shadowRoot?.querySelector("partial-panel-resolver");
  var followContent = (el2) => {
    const p = panelEl();
    const set = () => {
      const b = p?.isConnected ? p.getBoundingClientRect() : null;
      const l = b ? Math.max(0, Math.round(b.left)) : 0, r = b ? Math.max(0, Math.round(innerWidth - b.right)) : 0;
      el2.style.setProperty("--nv-pop-l", `${l}px`);
      el2.style.setProperty("--nv-pop-r", `${r}px`);
    };
    set();
    const ro = p ? new ResizeObserver(set) : null;
    ro?.observe(p);
    addEventListener("resize", set);
    return () => {
      ro?.disconnect();
      removeEventListener("resize", set);
    };
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

  // src/navi.js
  var countOn = (h, group, ex) => (h.states[group]?.attributes.entity_id || []).filter((id) => !(ex || []).includes(id) && isOn(h.states[id])).length;
  var PCSS2 = `
:host{position:fixed;inset:0 var(--nv-pop-r,0px) 0 var(--nv-pop-l,0px);z-index:6;display:flex;align-items:center;justify-content:center;background:rgba(8,12,22,.5);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);animation:fi .2s}
.root{width:min(var(--nova-popup-width,1180px),96%);max-height:84vh;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;box-sizing:border-box;padding:14px;border-radius:28px;
background:linear-gradient(160deg,rgba(92,110,148,.8),rgba(22,27,42,.9));border:1px solid var(--nv-border);box-shadow:0 20px 60px rgba(0,0,0,.45);color:var(--nv-fg);font-family:var(--ha-font-family-body,Roboto,sans-serif);animation:up .28s cubic-bezier(.2,.8,.2,1)}
.hd{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:10px;margin-bottom:14px;padding:6px 6px 6px 14px;border-radius:999px;background:rgba(60,72,100,.85);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
.tt{flex:1;min-width:0;font-weight:600;font-size:15px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.x{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.14);cursor:pointer;flex:none}
ha-icon{--mdc-icon-size:20px;display:flex}
.body{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--nova-popup-min-col,300px),1fr));gap:12px;align-items:start}
.body.one{grid-template-columns:1fr}
.empty{opacity:.6;font-size:13px;padding:8px}
@media(max-width:600px){:host{align-items:flex-end}.root{width:100%;max-height:86vh;border-radius:28px 28px 0 0;padding:12px 12px calc(90px + env(safe-area-inset-bottom))}.body{grid-template-columns:1fr}}
@keyframes up{from{transform:translateY(40px);opacity:0}}@keyframes fi{from{opacity:0}}`;
  var NovaNaviPopup = class extends HTMLElement {
    constructor() {
      super();
      const r = this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NAVI_VARS}${PCSS2}</style><div class="root"><div class="hd"><ha-icon class="hi"></ha-icon><span class="tt"></span><div class="x" title="Schließen"><ha-icon icon="mdi:close"></ha-icon></div></div><div class="body"></div></div>`;
      this._body = r.querySelector(".body");
      this._cards = [];
      r.querySelector(".x").addEventListener("click", () => this.onclose?.());
      this.addEventListener("click", (e) => {
        if (e.composedPath()[0] === this) this.onclose?.();
      });
    }
    connectedCallback() {
      this._unfollow?.();
      this._unfollow = followContent(this);
    }
    disconnectedCallback() {
      this._unfollow?.();
      this._unfollow = null;
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
  var DCSS2 = `
:host{display:block;height:var(--nova-navi-space,var(--nova-dock-space,64px));transition:height .3s ease}
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
.mbw{display:grid;grid-template-rows:0fr;margin-bottom:-8px;opacity:0;transform:translateY(14px);pointer-events:none;transition:grid-template-rows var(--mbd) ease,margin var(--mbd) ease,opacity var(--mbd) ease,transform var(--mbd) cubic-bezier(.2,.8,.2,1)}
.mbw.on{grid-template-rows:1fr;margin-bottom:0;opacity:1;transform:none;pointer-events:auto}
.top .mbw{margin-bottom:0;margin-top:-8px;transform:translateY(-14px)}.top .mbw.on{margin-top:0;transform:none}
.side .mbw{transform:translateX(-14px)}.side.right .mbw{transform:translateX(14px)}.side .mbw.on{transform:none}
.mbi{min-height:0;overflow:hidden;display:flex;justify-content:center}.mbw.open .mbi{overflow:visible}
.mb{display:flex;align-items:center;gap:10px;padding:6px 6px 6px 6px;border-radius:999px;width:min(340px,calc(100vw - 24px));box-sizing:border-box;color:var(--nv-fg);font-family:var(--ha-font-family-body,Roboto,sans-serif)}
.mb .art{width:40px;height:40px;flex:none;border-radius:50%;background:var(--nv-chip) center/cover no-repeat;display:flex;align-items:center;justify-content:center;cursor:pointer}
.mb .art.pic ha-icon{display:none}
.mb .tx{flex:1;min-width:0;cursor:pointer}
.mb .tx b,.mb .tx span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mb .tx b{font-size:13px;font-weight:600}.mb .tx span{font-size:11px;opacity:.7}
.mb .tx span.warn{opacity:1;color:var(--nova-warning-color,#f5b83d)}
.mb .pp,.mb .sp{flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent;outline:none;transition:transform .15s}
.mb .pp{width:40px;height:40px;background:var(--nv-active);color:var(--nv-active-fg)}
.mb .sp{width:32px;height:32px;background:var(--nv-chip);color:var(--nv-fg);opacity:.85}.mb .sp ha-icon{--mdc-icon-size:18px}
.mb .sp[hidden]{display:none}
.mb .pp:active,.mb .sp:active{transform:scale(.9)}
.mb .pp:focus-visible,.mb .sp:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
.side .mb{width:auto;flex-direction:column;padding:6px;border-radius:28px}
.side .mb .tx{display:none}
.mi .tt{display:flex;flex-direction:column;min-width:0;line-height:1.25}.mi .tt span{font-size:12px;opacity:.7;overflow:hidden;text-overflow:ellipsis;max-width:220px}
.mi .ic.pic{background:var(--nv-chip) center/cover no-repeat}.mi .ic.pic ha-icon{display:none}
@media(prefers-reduced-motion:reduce){.mbw{transition:none}}
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
  var SRC = {};
  var TYPES2 = ["navi-card", "dock-card"];
  var findNavi = (o) => {
    if (!o || typeof o !== "object") return null;
    if ((TYPES2.some((t) => o.type === `custom:${tag(t)}`) || o.type === "custom:nz-dock-card") && Array.isArray(o.items) && o.items.length) return o;
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
  var SEL = /* @__PURE__ */ new Map();
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
      SRC[k] = SRC[k] || this._h.callWS({ type: "lovelace/config", url_path: k === "default" ? null : k }).then(findNavi).catch(() => null);
      const d = await SRC[k];
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
      this._closePlayers();
      clearTimeout(this._mpt);
      clearTimeout(this._wt);
      clearTimeout(this._pend?.t);
      this._pend = null;
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
      this._closePlayers();
      if (this._shown) this._shown = `${this._shown.split("|")[0]}|neu`;
      this._update();
    }
    _build() {
      this._built = true;
      const c = this._cfg, r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NAVI_VARS}${DCSS2}</style><div class="wrap ${this._inline ? "inline" : ""} ${{ true: "cmp", false: "nocmp" }[this._opt("compact")] || ""}" style="--sz:${+c.button_size || 48}px;--dur:${this._dur}ms;--mbd:${this._opt("animation") === false ? 0 : 300}ms"><div class="mbw"><div class="mbi"><div class="mb glass"><div class="art"><ha-icon icon="mdi:music"></ha-icon></div><div class="tx"><b></b><span></span></div><div class="sp" role="button" tabindex="0" title="Lautsprecher wählen" hidden><ha-icon icon="mdi:speaker"></ha-icon></div><div class="pp" role="button" tabindex="0" title="Play/Pause"><ha-icon></ha-icon></div></div></div></div><div class="dk"><div class="dock"><div class="hl"></div></div><div class="bg glass"></div></div></div>`;
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
      this._mbw = r.querySelector(".mbw");
      this._mbw.addEventListener("transitionend", (e) => {
        if (e.target === this._mbw && e.propertyName === "grid-template-rows") this._mbw.classList.toggle("open", this._mbw.classList.contains("on"));
      });
      const info = () => this._mp && moreInfo(this, this._mp);
      this._mb.querySelector(".tx").addEventListener("click", info);
      this._mb.querySelector(".art").addEventListener("click", info);
      const key = (el2, fn) => {
        el2.addEventListener("click", fn);
        el2.addEventListener("keydown", (e) => {
          if (e.key === "Enter" || e.key === " ") {
            e.preventDefault();
            fn();
          }
        });
      };
      key(this._mb.querySelector(".pp"), () => this._play());
      key(this._mb.querySelector(".sp"), () => this._pm ? this._closePlayers() : this._openPlayers());
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
      const f2 = { bg: rect(this._bg), hl: rect(this._hl), hlOn: this._hl.classList.contains("on"), b: btns.map(rect) };
      const oldNm = btns.map((d) => d._nm).find((n) => n.classList.contains("on") && !n.hidden);
      const fn = oldNm && { r: rect(oldNm), t: oldNm.textContent, o: +getComputedStyle(oldNm).opacity };
      this._stop();
      this._apply(cur2, lbl, false);
      const o = this._origin(), l = { bg: rect(this._bg), b: btns.map(rect) }, newNm = btns[cur2]?._nm.classList.contains("on") ? btns[cur2]._nm : null;
      btns.forEach((d, k) => {
        if (!d.hidden && f2.b[k].width) d.style.transform = `translate(${f2.b[k].left - l.b[k].left}px,${f2.b[k].top - l.b[k].top}px)`;
      });
      if (l.bg.width) this._bg.style.transform = `translate(${f2.bg.left - l.bg.left}px,${f2.bg.top - l.bg.top}px) scale(${f2.bg.width / l.bg.width},${f2.bg.height / l.bg.height})`;
      if (f2.hlOn) this._hl.style.transform = `translate(${f2.hl.left - o.x}px,${f2.hl.top - o.y}px)`;
      else this._pillTo(cur2, false);
      if (newNm) {
        newNm.style.opacity = "0";
        newNm.style.transform = `translate(${f2.b[cur2].left - l.b[cur2].left - 12}px,0)`;
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
          g.style.transform = `translate(${g._dx + (ob >= 0 ? l.b[ob].left - f2.b[ob].left : 0) - 8}px,${g._dy}px)`;
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
    // Media-Leiste. Gezeigt wird sie nur, solange ein Player wirklich etwas abspielt; ein pausierter bleibt noch
    // paused_timeout Minuten (an last_changed gemessen). Angezeigt wird der Player, der spielt – bei mehreren der zuletzt
    // gestartete –, außer man hat über den Lautsprecher-Knopf selbst einen gewählt
    get _players() {
      return [].concat(this._cfg.media_players ?? this._srcCfg?.media_players ?? []).flatMap((x) => typeof x === "string" ? list(x) : [x]).map(toObj).filter((p) => typeof p.entity === "string" && p.entity);
    }
    get _pauseMs() {
      const v = Number(this._opt("paused_timeout"));
      return (Number.isFinite(v) && v >= 0 ? v : 10) * 6e4;
    }
    // Läuft der Player (true), ist er pausiert und noch in der Frist (Zahl = Ablaufzeitpunkt) oder läuft nicht (false)?
    _live(s) {
      if (!s || !s.attributes.media_title || !MEDIA_ON.includes(s.state)) return false;
      if (s.state === "playing") return true;
      const until = Date.parse(s.last_changed) + this._pauseMs;
      return until > Date.now() ? until : false;
    }
    _media() {
      const mb = this._mb;
      if (!mb || !this._h) return;
      const ps = this._players, h = this._h, key = ps.map((p) => p.entity).join("|");
      const live = ps.map((p) => ({ ...p, s: h.states[p.entity] })).map((p) => ({ ...p, l: this._live(p.s) })).filter((p) => p.l);
      const t = (p) => Date.parse(p.s.last_changed) || 0;
      const playing = live.filter((p) => p.l === true).sort((x, y) => t(y) - t(x));
      const pick = SEL.get(key);
      const manual = pick && ps.find((p) => p.entity === pick.id) && !playing.some((p) => p.entity !== pick.id && t(p) > pick.at) && (live.some((p) => p.entity === pick.id) || Date.now() - pick.at < this._pauseMs);
      let cur2 = manual ? ps.find((p) => p.entity === pick.id) : playing[0] || live.sort((x, y) => t(y) - t(x))[0] || null;
      const show = !!live.length || !!this._opt("media_always") && !!ps.length;
      if (!cur2 && show) cur2 = ps[0];
      clearTimeout(this._mpt);
      const next = Math.min(...live.filter((p) => p.l !== true).map((p) => p.l));
      if (Number.isFinite(next)) this._mpt = setTimeout(() => this._media(), next - Date.now() + 50);
      this._mbw.classList.toggle("on", show);
      if (!show) this._mbw.classList.remove("open");
      this.toggleAttribute("media", show && !this._side && !this._inline);
      mb.querySelector(".sp").hidden = ps.length < 2;
      this._mp = show ? cur2.entity : null;
      if (!show) {
        this._closePlayers();
        return;
      }
      const s = h.states[cur2.entity], a = s?.attributes || {}, pic = a.entity_picture_local || a.entity_picture, art = mb.querySelector(".art");
      if (art._pic !== pic) {
        art._pic = pic;
        art.style.backgroundImage = pic ? `url(${JSON.stringify(pic)})` : "";
        art.classList.toggle("pic", !!pic);
      }
      const name = cur2.name || a.friendly_name || cur2.entity;
      mb.querySelector("b").textContent = a.media_title || name;
      const ps0 = this._pend && h.states[this._pend.id];
      if (ps0 && (ps0.state !== this._pend.st || ps0.last_changed !== this._pend.lc)) {
        clearTimeout(this._pend.t);
        this._pend = null;
      }
      const warn = this._warn && this._warn.id === cur2.entity && this._warn.until > Date.now();
      const sub = mb.querySelector(".tx span");
      sub.classList.toggle("warn", warn);
      sub.textContent = warn ? "Lautsprecher reagiert nicht" : [a.media_artist || a.app_name, a.media_title ? name : ""].filter(Boolean).join(" · ") || (s ? fmtState(h, s) : "");
      mb.querySelector(".pp ha-icon").setAttribute("icon", s?.state === "playing" ? "mdi:pause" : "mdi:play");
      if (this._pm) this._fillPlayers();
    }
    // Play/Pause über media_play_pause; meldet der Player nach 3 s keine Änderung, kurzer Hinweis in der Leiste
    _play() {
      const id = this._mp, s = id && this._h.states[id];
      if (!s) return;
      if (this._haptic) haptic();
      clearTimeout(this._pend?.t);
      this._pend = { id, st: s.state, lc: s.last_changed, t: setTimeout(() => {
        const n = this._h?.states[id];
        if (this._pend?.id === id && n && n.state === this._pend.st && n.last_changed === this._pend.lc) {
          this._warn = { id, until: Date.now() + 3e3 };
          clearTimeout(this._wt);
          this._wt = setTimeout(() => this._media(), 3050);
        }
        this._pend = null;
        this._media();
      }, 3e3) };
      this._warn = null;
      this._h.callService("media_player", "media_play_pause", { entity_id: id }).catch(() => {
        this._warn = { id, until: Date.now() + 3e3 };
        this._media();
      });
    }
    // Auswahl der Lautsprecher (Nova-Menü über dem Knopf)
    _openPlayers() {
      this._close();
      const m = document.createElement("div");
      m.className = "menu glass";
      m.setAttribute("role", "menu");
      this.shadowRoot.appendChild(m);
      this._pm = m;
      this._fillPlayers();
      const b = this._mb.querySelector(".sp");
      this._place(m, b);
      this._pout = (e) => {
        const p = e.composedPath();
        if (!p.includes(m) && !p.includes(b)) this._closePlayers();
      };
      this._pesc = (e) => {
        if (e.key === "Escape") this._closePlayers();
      };
      window.addEventListener("pointerdown", this._pout, true);
      window.addEventListener("keydown", this._pesc);
      m.querySelector(".mi")?.focus({ preventScroll: true });
    }
    _fillPlayers() {
      const m = this._pm, h = this._h, key = this._players.map((p) => p.entity).join("|");
      const st = (s) => !s || ["off", "unavailable", "unknown", "standby"].includes(s.state) ? "aus" : s.state === "playing" ? "spielt" : s.state === "paused" ? "pausiert" : fmtState(h, s);
      m.replaceChildren(...this._players.map((p) => {
        const s = h.states[p.entity], a = s?.attributes || {}, pic = a.entity_picture_local || a.entity_picture;
        const e = document.createElement("div");
        e.className = "mi";
        e.tabIndex = 0;
        e.setAttribute("role", "menuitemradio");
        e.classList.toggle("here", p.entity === this._mp);
        e.setAttribute("aria-checked", String(p.entity === this._mp));
        e.innerHTML = `<span class="ic"><ha-icon icon="${s?.state === "playing" ? "mdi:speaker-play" : "mdi:speaker"}"></ha-icon></span><span class="tt"><b></b><span></span></span>`;
        if (pic && s?.attributes.media_title) {
          const ic = e.querySelector(".ic");
          ic.classList.add("pic");
          ic.style.backgroundImage = `url(${JSON.stringify(pic)})`;
        }
        e.querySelector("b").textContent = p.name || a.friendly_name || p.entity;
        e.querySelector(".tt span").textContent = [st(s), MEDIA_ON.includes(s?.state) ? a.media_title : ""].filter(Boolean).join(" · ");
        const go = () => {
          if (this._haptic) haptic();
          SEL.set(key, { id: p.entity, at: Date.now() });
          this._closePlayers();
          this._media();
        };
        e.addEventListener("click", go);
        e.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter" || ev.key === " ") {
            ev.preventDefault();
            go();
          }
        });
        return e;
      }));
    }
    _closePlayers() {
      if (!this._pm) return;
      this._pm.remove();
      this._pm = null;
      window.removeEventListener("pointerdown", this._pout, true);
      window.removeEventListener("keydown", this._pesc);
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
      const r = b.getBoundingClientRect(), W = innerWidth, H2 = innerHeight, g = 10, side = this._side;
      const w = m.offsetWidth, ht = m.offsetHeight, clamp = (v, max) => Math.max(8, Math.min(v, max - 8));
      if (side) {
        m.style.left = `${side === "right" ? r.left - g - w : r.right + g}px`;
        m.style.top = `${clamp(r.top + r.height / 2 - ht / 2, H2 - ht)}px`;
      } else {
        m.style.left = `${clamp(r.left + r.width / 2 - w / 2, W - w)}px`;
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
  var LOOK = (c) => [
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
  var MEDIA = [g2({ name: "paused_timeout", selector: { number: { min: 0, max: 240, step: 1, mode: "box", unit_of_measurement: "min" } } }, { name: "media_always", selector: { boolean: {} } })];
  var MPLAYER = [g2({ name: "entity", required: true, selector: { entity: { filter: { domain: "media_player" } } } }, { name: "name", selector: { text: {} } })];
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
  var LABELS7 = {
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
    paused_timeout: "Pausiert noch zeigen für",
    entity: "Media-Player",
    name: "Name",
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
  var HELPERS7 = {
    source: "Optional: URL-Pfad eines Dashboards (z. B. neues-zuhause). Dann gilt dessen Navi – praktisch für mehrere Ansichten oder Dashboards mit gleicher Leiste.",
    sidebar: "Ab der eingestellten Breite steht die Leiste senkrecht am Rand, darunter unten bzw. oben.",
    animation: "Markierung und Name gleiten beim Viewwechsel vom alten zum neuen Eintrag. Bei „Bewegung reduzieren“ im System immer aus.",
    active_label: "Rechts neben dem runden Button der aktuellen Ansicht steht sein Name (nicht in der Seitenleiste).",
    compact: "Kleinere Buttons und Abstände. Automatisch: auf Bildschirmen bis 600 px Breite.",
    haptic: "Kurzes Vibrieren beim Antippen (HA-App, Android-Browser, Fully Kiosk).",
    media_players: "Zeigt über der Leiste den laufenden Player mit Play/Pause. Leer = keine Media-Leiste.",
    paused_timeout: "So lange bleibt die Leiste nach einer Pause noch stehen (Standard 10 min, 0 = sofort ausblenden).",
    media_always: "Alte Verhaltensweise: Leiste immer zeigen, auch wenn nichts läuft (dann der erste Player).",
    name: "Leer = Name der Entität. Erscheint in der Lautsprecher-Auswahl.",
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
      const data = { position: "bottom", button_size: 48, sidebar: "", active_label: true, animation: true, animation_duration: 280, paused_timeout: 10, ...this._config, compact: { true: "on", false: "off" }[this._config.compact] || "" };
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
        if (c.paused_timeout == null || c.paused_timeout === "" || +c.paused_timeout === 10) delete c.paused_timeout;
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
        this._section("look", "mdi:palette-outline", "Layout und Aussehen", (b) => b.append(form(LOOK(data)))),
        this._section("media", "mdi:music-circle-outline", "Media-Leiste", (b) => {
          b.append(this._hint("Die Leiste erscheint nur, solange ein Player etwas abspielt. Bei mehreren Playern wechselt der Lautsprecher-Knopf neben Play das Gerät."));
          this._itemList(b, "media_players", MPLAYER, { item: "Player", icon: "mdi:speaker" }, "Player hinzufügen");
          b.append(form(MEDIA));
        })
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
  __publicField(NovaNaviCardEditor, "labels", LABELS7);
  __publicField(NovaNaviCardEditor, "helpers", HELPERS7);
  __publicField(NovaNaviCardEditor, "openSections", ["buttons"]);
  define("navi-card-editor", NovaNaviCardEditor);

  // src/popup.js
  var DEF5 = { width: 1180, stack_below: 500, info_layout: "wrap" };
  var PCSS3 = `${NOVA_VARS}${GRID_CSS}${CHIP_CSS}
:host{display:block;font-family:var(--ha-font-family-body,Roboto,sans-serif)}
:host(.live){display:contents}
ha-icon{--mdc-icon-size:20px;display:flex}
.ph{display:none;align-items:center;gap:10px;padding:10px 12px;border-radius:16px;border:1px dashed var(--divider-color,#666);color:var(--primary-text-color);font-size:13px}
:host(.edit) .ph{display:flex}
.ph .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pop{position:fixed;inset:0 var(--nv-pop-r,0px) 0 var(--nv-pop-l,0px);z-index:var(--nova-popup-z-index,6);display:flex;align-items:center;justify-content:center}
.pop[hidden]{display:none}
.ov{position:absolute;inset:0;background:var(--nv-popup-backdrop);backdrop-filter:blur(8px);-webkit-backdrop-filter:blur(8px);opacity:0;transition:opacity .22s}
.sh{position:relative;display:flex;flex-direction:column;box-sizing:border-box;width:min(var(--pw,1180px),96%);max-height:88vh;
background:var(--nv-popup-bg);color:var(--nv-fg);border-radius:var(--nv-popup-r);border:1px solid var(--nv-border);
box-shadow:0 20px 60px rgba(0,0,0,.45);overflow:hidden;opacity:0;transform:translateY(40px);transition:transform .26s cubic-bezier(.2,.8,.2,1),opacity .2s}
.sh.tint{background:linear-gradient(160deg,color-mix(in srgb,var(--tc) 55%,var(--nv-popup-base)),var(--nv-popup-base))}
.pop.in .ov{opacity:1}.pop.in .sh{opacity:1;transform:none}
.grip{display:none;justify-content:center;padding:8px 0 0;flex:none;touch-action:none}.grip i{width:40px;height:5px;border-radius:3px;background:currentColor;opacity:.35}
.hd{display:flex;align-items:center;gap:10px;margin:14px 14px 10px;padding:6px 6px 6px 14px;border-radius:999px;flex:none;touch-action:pan-x;
background:var(--nv-popup-head);backdrop-filter:blur(16px);-webkit-backdrop-filter:blur(16px)}
.hi:empty{display:none}
.tt{flex:1 1 auto;min-width:min(30%,120px);font-weight:600;font-size:15px}${MARQUEE_CSS}
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
.sh{width:100%;height:88vh;max-height:none;border-radius:var(--nv-popup-r) var(--nv-popup-r) 0 0;border-bottom:none;opacity:1;transform:translateY(100%)}
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
      r.innerHTML = `<style>${PCSS3}</style>
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
        ...DEF5,
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
      const tt = this.shadowRoot?.querySelector(".tt");
      if (tt?.firstElementChild) marquee(tt, tt.textContent, inPicker(this));
    }
    disconnectedCallback() {
      ["hashchange", "popstate", "location-changed"].forEach((ev) => window.removeEventListener(ev, this._sync));
      this._ro.disconnect();
      stopMarquee(this.shadowRoot?.querySelector(".tt"));
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
      this._unfollow?.();
      this._unfollow = followContent(this._pop);
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
      this._unfollow?.();
      this._unfollow = null;
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
      marquee(r.querySelector(".tt"), c.title || "", inPicker(this));
      const hi = r.querySelector(".hi");
      if (c.icon) setIcon(hi, c.icon);
      else {
        hi.innerHTML = "";
        hi._ic = null;
      }
      r.querySelector(".ph .t").textContent = c.title || (c.hash ? `#${c.hash}` : "Kein Hash eingestellt");
      r.querySelector(".ph ha-icon").setAttribute("icon", c.icon || "mdi:card-multiple-outline");
      this._sh.style.setProperty("--pw", `${+c.width || DEF5.width}px`);
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
  var LABELS8 = {
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
  var HELPERS8 = {
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
      const f2 = this._form(GENERAL, data, (v) => {
        const c = merge(this._config, names(GENERAL), v);
        delete c.color;
        if (v.hash != null) {
          const h = cleanHash(v.hash);
          if (h !== v.hash) f2.data = { ...v, hash: h };
          if (h) c.hash = h;
          else delete c.hash;
        }
        this._emit(c);
      });
      b.append(f2);
      if (!this._config.hash) b.append(this._hint("Ohne Hash lässt sich das Pop-up nicht öffnen."));
      return d;
    }
    _secHead() {
      const [d, b] = this._sec("sec.header", "mdi:information-outline", "Kopfzeile & Info-Leiste");
      b.append(this._hint("Titel und Icon stehen unter „Allgemein“. Badges sitzen in der Kopfzeile, Info-Entitäten als Chips darunter. Antippen öffnet die Details."));
      b.append(this._form(HEAD, { info_layout: DEF5.info_layout, ...this._config }, (v) => {
        const c = merge(this._config, names(HEAD), v);
        if (c.info_layout === DEF5.info_layout) delete c.info_layout;
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
  __publicField(NovaPopupCardEditor, "labels", LABELS8);
  __publicField(NovaPopupCardEditor, "helpers", HELPERS8);
  define("popup-card-editor", NovaPopupCardEditor);
})();
