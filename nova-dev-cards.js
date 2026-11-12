/* Nova Cards v0.12.0 DEV (nur timer) – Testbuild, alle Karten als custom:nova-dev-*. Nicht veröffentlichen. */
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
  var list = (v) => [].concat(v ?? []).flatMap((x) => String(x).split(",")).map((x) => x.trim()).filter(Boolean);
  var toObj = (x) => typeof x === "string" ? { entity: x } : { ...x };
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
  var TOGGLE = ["light", "switch", "input_boolean", "fan", "cover", "group", "siren", "humidifier", "automation", "media_player", "valve"];
  var PRESS = { button: ["button", "press"], input_button: ["input_button", "press"], script: ["script", "turn_on"], scene: ["scene", "turn_on"] };
  var nameOf = (h, o) => o.name ?? h.states[o.entity]?.attributes.friendly_name ?? o.entity ?? "";
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

  // src/shared/theme.js
  var TOKENS = [
    // Flächen und Text
    ["bg", "background", "linear-gradient(160deg,rgba(80,96,128,.55),rgba(22,27,42,.62))"],
    ["border", "border-color", "rgba(255,255,255,.14)"],
    ["fg", "text-color", "#fff"],
    ["chip", "chip-color", "rgba(255,255,255,.13)"],
    ["box", "box-background", "rgba(255,255,255,.09)"],
    ["box-border", "box-border-color", "rgba(255,255,255,.1)"],
    // Farb-Grundtöne als R,G,B – verwendet als rgba(var(--nv-tint),.12): Deckkraft steht an der Stelle, der Ton kommt vom Theme
    ["tint", "tint", "255,255,255"],
    // Aufheller der Oberfläche: Linien, Schienen, Flächen (helle Themes: dunkle Tinte)
    ["shade", "shade", "0,0,0"],
    // Schattenfarbe der Oberfläche
    ["scrim", "scrim", "10,14,24"],
    // Abdunklung über Bildern (Kamera, Media)
    ["hi", "device-light", "255,255,255"],
    // Licht in Zeichnungen (Kanten, Glanz) – kippt in keinem Theme
    ["lo", "device-dark", "0,0,0"],
    // Schatten in Zeichnungen
    ["knob", "knob-color", "#fff"],
    // Griff von Regler und Schalter
    ["stage", "stage-color", "#000"],
    // Fläche hinter Vollbild-Video
    ["cut", "cutout-color", "rgba(20,24,38,.6)"],
    // Rand um Icons, die auf einer Farbfläche sitzen (Müllkalender)
    // Akzente und Farbrollen
    ["accent", "accent-color", "#f5b83d"],
    ["accent-fg", "accent-text-color", "#3a2a00"],
    ["active", "active-color", "#3d8bf5"],
    ["active-fg", "active-text-color", "#fff"],
    ["warn", "warning-color", "#7cc4ff"],
    ["error", "error-color", "#ff6b6b"],
    ["error-fg", "error-text-color", "#fff"],
    ["a1", "accent-1", "#3d8bf5"],
    ["a1-fg", "accent-1-text", "#fff"],
    ["a2", "accent-2", "#f5b83d"],
    ["a2-fg", "accent-2-text", "#3a2a00"],
    ["a3", "accent-3", "#b5794a"],
    ["a3-fg", "accent-3-text", "#fff"],
    ["a4", "accent-4", "#4caf6a"],
    ["a4-fg", "accent-4-text", "#fff"],
    ["neutral", "neutral", "#7b8794"],
    ["neutral-fg", "neutral-text", "#fff"],
    // Uhr: Leuchtziffern nach Tageszeit, Radiowecker-Farben
    ["clock-night", "clock-night", "#4d6bff"],
    ["clock-morning", "clock-morning", "#ffb36b"],
    ["clock-noon", "clock-noon", "#f4f7ff"],
    ["led-red", "led-red", "#ff2414"],
    ["led-green", "led-green", "#39ff7a"],
    ["led-blue", "led-blue", "#3fa9ff"],
    ["led-amber", "led-amber", "#ffb000"],
    // Pop-up
    ["popup-bg", "popup-background", "linear-gradient(160deg,rgba(92,110,148,.78),rgba(22,27,42,.88))"],
    ["popup-base", "popup-base-color", "rgba(22,27,42,.88)"],
    ["popup-head", "popup-header-color", "rgba(60,72,100,.85)"],
    ["popup-backdrop", "popup-backdrop", "rgba(8,12,22,.5)"],
    ["navi-popup-bg", "navi-popup-background", "linear-gradient(160deg,rgba(92,110,148,.8),rgba(22,27,42,.9))"],
    // Radien
    ["radius", "radius", "24px"],
    ["popup-r", "popup-radius", "28px"],
    ["r-lg", "radius-lg", "20px"],
    ["r-md", "radius-md", "16px"],
    ["r-sm", "radius-sm", "12px"],
    ["r-xs", "radius-xs", "4px"],
    ["r-pill", "radius-pill", "999px"],
    // Schatten, Glow, Ringe
    ["shadow", "shadow-card", "0 10px 30px rgba(0,0,0,.25)"],
    ["edge", "edge", "inset 0 1px 0 rgba(255,255,255,.12)"],
    ["shadow-popup", "shadow-popup", "0 20px 60px rgba(0,0,0,.45)"],
    ["shadow-knob", "shadow-knob", "0 1px 4px rgba(0,0,0,.4)"],
    ["focus", "focus-ring", "0 0 0 2px var(--nv-active)"],
    ["glow", "glow", "100%"],
    // Stärke aller Glows: 100 % = wie gezeichnet, 0 % = aus
    ["ring", "ring", "100%"],
    // Stärke der Zustandsringe (Warnung, Fehler, aktiv)
    // Blur
    ["blur", "blur", "20px"],
    ["blur-xs", "blur-xs", "8px"],
    ["blur-sm", "blur-sm", "10px"],
    ["blur-lg", "blur-lg", "16px"],
    ["sat", "saturate", "150%"],
    ["sat-2", "saturate-strong", "160%"],
    // Schrift
    ["font", "font", "var(--ha-font-family-body,Roboto,sans-serif)"],
    ["fs-1", "font-size-1", "10.5px"],
    ["fs-2", "font-size-2", "11px"],
    ["fs-3", "font-size-3", "11.5px"],
    ["fs-4", "font-size-4", "12px"],
    ["fs-5", "font-size-5", "12.5px"],
    ["fs-6", "font-size-6", "13px"],
    ["fs-7", "font-size-7", "13.5px"],
    ["fs-8", "font-size-8", "14px"],
    ["fs-9", "font-size-9", "15px"],
    ["fs-10", "font-size-10", "16px"],
    ["fd-1", "font-display-1", "24px"],
    ["fd-2", "font-display-2", "28px"],
    ["fd-3", "font-display-3", "32px"],
    ["fd-4", "font-display-4", "40px"],
    ["fd-5", "font-display-5", "48px"],
    ["fw-light", "font-weight-light", "300"],
    ["fw-medium", "font-weight-medium", "500"],
    ["fw-bold", "font-weight-bold", "600"],
    ["fw-heavy", "font-weight-heavy", "700"],
    ["caps", "tracking-caps", ".05em"],
    ["icon-sm", "icon-sm", "16px"],
    ["icon-md", "icon-md", "18px"],
    ["icon-lg", "icon-lg", "20px"],
    ["icon-xl", "icon-xl", "24px"],
    // Abstände
    ["s1", "space-1", "2px"],
    ["s2", "space-2", "4px"],
    ["s3", "space-3", "6px"],
    ["s4", "space-4", "8px"],
    ["s5", "space-5", "10px"],
    ["s6", "space-6", "12px"],
    ["s7", "space-7", "14px"],
    ["s8", "space-8", "16px"],
    ["pad", "card-padding", "14px 16px"],
    // Zeiten (nur Übergänge der Oberfläche – die Choreografie der Zeichnungen bleibt in der jeweiligen Szene)
    ["d1", "dur-1", ".15s"],
    ["d2", "dur-2", ".2s"],
    ["d3", "dur-3", ".25s"],
    ["d4", "dur-4", ".3s"],
    ["d5", "dur-5", ".4s"],
    ["d6", "dur-6", ".6s"],
    ["d7", "dur-7", "1s"],
    ["ease", "ease", "cubic-bezier(.2,.8,.2,1)"],
    ["ease-soft", "ease-soft", "cubic-bezier(.3,.7,.3,1)"],
    ["press", "press-scale", ".92"],
    ["sweep", "sweep-dur", ".9s"]
  ];
  var NAVI = { border: "rgba(255,255,255,.16)", chip: "rgba(255,255,255,.1)", blur: "22px", warn: "#f5b83d" };
  var block = (sel2, over) => `${sel2}{${TOKENS.filter(([k]) => !over || k in over).map(([k, pub, v]) => `--nv-${k}:var(--nova-${pub},${over?.[k] ?? v})`).join(";")}}`;
  var NOVA_VARS = block(":host");
  var NAVI_VARS = block(":host", { ...Object.fromEntries(TOKENS.map(([k, , v]) => [k, v])), ...NAVI });

  // src/shared/styles.js
  var ROLES = { neutral: "neutral", "accent-1": "a1", "accent-2": "a2", "accent-3": "a3", "accent-4": "a4" };
  var roleVars = (r) => {
    const k = ROLES[r] || ROLES.neutral;
    return { c: `var(--nv-${k})`, fg: `var(--nv-${k}-fg)` };
  };
  var GLASS = `:host{position:relative}
:host::before{content:'';position:absolute;inset:0;border-radius:var(--nv-radius);background:var(--nv-bg);pointer-events:none;
backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat));-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat))}
:host(.nv-flat)::before{display:none}
:host(.nv-na)::before{opacity:.4}`;
  var CARD_CSS = `${NOVA_VARS}
:host{display:block;height:100%}
${GLASS}
.g{height:100%;box-sizing:border-box;border-radius:var(--nv-radius);
border:1px solid var(--nv-border);box-shadow:var(--nv-shadow),var(--nv-edge);
color:var(--nv-fg);overflow:hidden;position:relative;font-family:var(--nv-font)}
ha-icon{--mdc-icon-size:var(--nv-icon-lg);display:flex}`;
  var PANEL_CSS = `
:host{display:block;height:100%;container-type:inline-size}
${GLASS}
.g{height:100%;box-sizing:border-box;border-radius:var(--nv-radius);
border:1px solid var(--nv-border);box-shadow:var(--nv-shadow),var(--nv-edge);
color:var(--nv-fg);overflow:hidden;position:relative;font-family:var(--nv-font);
padding:var(--nv-pad);display:flex;flex-direction:column;gap:var(--nv-s6);transition:box-shadow var(--nv-d5)}
.g.warn{box-shadow:var(--nv-shadow),0 0 0 1px color-mix(in srgb,color-mix(in srgb,var(--nv-warn) 60%,transparent) var(--nv-ring),transparent),var(--nv-edge)}
.g.err{box-shadow:var(--nv-shadow),0 0 0 1px color-mix(in srgb,color-mix(in srgb,var(--nv-error) 70%,transparent) var(--nv-ring),transparent),var(--nv-edge)}
ha-icon{--mdc-icon-size:var(--nv-icon-lg);display:flex}
img{object-fit:contain}
.blk[hidden],[hidden]{display:none!important}
.bt{font-size:var(--nv-fs-3);font-weight:var(--nv-fw-bold);opacity:.6;text-transform:uppercase;letter-spacing:var(--nv-caps);margin-bottom:var(--nv-s2)}
.tap{cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}
.tap:focus-visible{box-shadow:var(--nv-focus)}
.na{opacity:.4}
.ic{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);transition:background-color var(--nv-d3),color var(--nv-d3),border-color var(--nv-d3),box-shadow var(--nv-d3),transform var(--nv-d3),opacity var(--nv-d3)}
.ic ha-icon{--mdc-icon-size:var(--nv-icon-md)}.ic img{width:20px;height:20px}
.on>.ic{background:var(--nv-accent);color:var(--nv-accent-fg);box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--nv-accent) 55%,transparent) var(--nv-glow),transparent)}
.nm{flex:1;min-width:0}.nm b,.nm small{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nm b{font-weight:var(--nv-fw-medium);font-size:var(--nv-fs-7)}.nm small{font-size:var(--nv-fs-3);opacity:.6}
.hd{display:flex;align-items:center;gap:var(--nv-s5)}
.hd .ic{width:44px;height:44px}.hd .ic ha-icon{--mdc-icon-size:var(--nv-icon-xl)}.hd .ic img{width:26px;height:26px}
.hd .nm b{font-weight:var(--nv-fw-bold);font-size:var(--nv-fs-9)}.hd .nm small{font-size:var(--nv-fs-4);opacity:.65}
.pct{font-weight:var(--nv-fw-bold);font-size:var(--nv-fs-8)}
.hb{width:36px;height:36px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip)}
.hb:active,.hd .ic:active,.pill:active,.row:active .ic{transform:scale(var(--nv-press))}
.prog{height:6px;border-radius:3px;background:rgba(var(--nv-tint),.12);overflow:hidden;margin-top:var(--nv-s5)}
.prog i{display:block;height:100%;width:0;background:var(--nv-accent);border-radius:3px;transition:width var(--nv-d7)}
.list{display:grid;grid-template-columns:repeat(var(--cols,1),minmax(0,1fr));column-gap:var(--nv-s7)}
.kv{display:flex;align-items:center;gap:var(--nv-s4);font-size:var(--nv-fs-6);padding:7px 0;border-top:1px solid rgba(var(--nv-tint),.08);min-width:0}
.kv ha-icon{--mdc-icon-size:17px;opacity:.7}.kv img{width:17px;height:17px}
.kv .k{flex:1;min-width:0;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.kv .v{opacity:.8;text-align:right;white-space:nowrap}
.pills{display:flex;flex-wrap:wrap;gap:7px}
.pill{padding:7px var(--nv-s6);border-radius:var(--nv-r-pill);background:var(--nv-chip);border:1px solid rgba(var(--nv-tint),.08);font-size:var(--nv-fs-5);display:inline-flex;gap:var(--nv-s3);align-items:center;white-space:nowrap;transition:background-color var(--nv-d2),color var(--nv-d2),border-color var(--nv-d2),box-shadow var(--nv-d2),transform var(--nv-d2),opacity var(--nv-d2);min-width:0}
.pill ha-icon{--mdc-icon-size:var(--nv-icon-sm)}.pill img{width:16px;height:16px}
.pill.on{background:var(--nv-active);color:var(--nv-active-fg);border-color:transparent;box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent)}
.pills.grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--nova-modular-button-width,104px),1fr));gap:var(--nv-s4)}
.pills.grid .pill{flex-direction:column;justify-content:center;border-radius:var(--nv-r-md);padding:var(--nv-s5) var(--nv-s4);white-space:normal;text-align:center}
.pills.grid .pill ha-icon{--mdc-icon-size:22px}.pills.grid .pill img{width:22px;height:22px}
.pills.flat{display:grid;grid-template-columns:repeat(auto-fit,minmax(min(100%,var(--nova-modular-button-width,60px)),1fr));gap:var(--nv-s3)}
.pills.flat .pill{justify-content:center;border-radius:var(--nv-r-sm);padding:var(--nv-s3);min-height:40px;overflow:hidden}
.pills.flat .pill .t{overflow:hidden;text-overflow:ellipsis}
.row{display:flex;align-items:center;gap:var(--nv-s5);padding:5px 0;min-width:0}
.sw{width:38px;height:22px;border-radius:11px;background:rgba(var(--nv-tint),.18);position:relative;flex:none;transition:background var(--nv-d3)}
.sw::after{content:'';position:absolute;top:3px;left:3px;width:16px;height:16px;border-radius:50%;background:var(--nv-knob);transition:transform var(--nv-d3)}
.row.on .sw{background:var(--nv-active)}.row.on .sw::after{transform:translateX(16px)}
.sl{display:flex;flex-direction:column;gap:var(--nv-s3);padding:var(--nv-s3) 0}
.sl .kv{border:none;padding:0}
.sl .v{font-weight:var(--nv-fw-bold);opacity:1}
input[type=range]{-webkit-appearance:none;appearance:none;width:100%;height:22px;border-radius:11px;margin:0;outline:none;
background:linear-gradient(90deg,var(--nv-accent) 0 var(--p,0%),rgba(var(--nv-tint),.14) var(--p,0%) 100%)}
input[type=range]::-webkit-slider-thumb{-webkit-appearance:none;width:22px;height:22px;border-radius:50%;background:var(--nv-knob);box-shadow:var(--nv-shadow-knob)}
input[type=range]::-moz-range-thumb{width:22px;height:22px;border-radius:50%;background:var(--nv-knob);border:none}
.als{display:flex;flex-direction:column;gap:var(--nv-s3)}.als.chips{flex-direction:row;flex-wrap:wrap}
.al{--c:var(--nv-warn);display:flex;align-items:center;gap:var(--nv-s4);padding:var(--nv-s4) var(--nv-s6);border-radius:14px;font-size:var(--nv-fs-6);
background:color-mix(in srgb,var(--c) 18%,transparent);border:1px solid color-mix(in srgb,var(--c) 45%,transparent)}
.al.error{--c:var(--nv-error)}.al.info{--c:var(--nv-active)}
.al ha-icon{color:var(--c);--mdc-icon-size:var(--nv-icon-md)}
.chips .al{border-radius:var(--nv-r-pill);padding:5px var(--nv-s5);font-size:var(--nv-fs-4)}
@container (max-width:280px){.list{grid-template-columns:1fr}.g{padding:var(--nv-s6)}}`;
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
  var watchVisible = (el, cb) => {
    let inView = !("IntersectionObserver" in window), last;
    const upd = () => {
      const v = inView && !document.hidden && el.isConnected;
      if (v !== last) {
        last = v;
        cb(v);
      }
    };
    const io = "IntersectionObserver" in window ? new IntersectionObserver((es) => {
      inView = es[es.length - 1].isIntersecting;
      upd();
    }, { rootMargin: "100px" }) : null;
    io?.observe(el);
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
      const el = this._pool?.get(type)?.shift() || create();
      (this._keep.get(type) || this._keep.set(type, []).get(type)).push(el);
      return el;
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
  var sel = (n, opts) => ({ name: n, selector: { select: { mode: "dropdown", options: opts.map(([value, label]) => ({ value, label })) } } });
  var ROLE = (n) => sel(n, [["neutral", "Neutral"], ["accent-1", "Akzent 1"], ["accent-2", "Akzent 2"], ["accent-3", "Akzent 3"], ["accent-4", "Akzent 4"]]);
  var NAMEICON = g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } });

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
    line: "rgba(255,255,255,.18)",
    // Kanten
    flap: "#eef1f6",
    flapMid: "#2b313d",
    // Klappzahlen der Uhr: Ziffern, Mitte der Klappe
    robot: "#3d4452",
    station: "#2f3542",
    water: "#6fb6f2"
    // Saugroboter, Station, Wassertank (Theme: --nova-vacuum-…-color)
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
.scene .s-shd{fill:rgb(var(--nv-lo));opacity:.35}
.scene .s-body{stroke:${PAL.line};stroke-width:.6;transition:stroke var(--nv-d5)}.scene .s-sheen{opacity:.4}.scene .s-edge{fill:rgb(var(--nv-hi));opacity:.12}
.scene .s-part{stroke:rgba(var(--nv-hi),.15);stroke-width:.5}
.scene .s-glass{stroke:rgba(var(--nv-hi),.22);stroke-width:.7}.scene .s-refl{fill:rgb(var(--nv-hi));opacity:.035}
/* Außerhalb der Animation zusätzlich unsichtbar: manche Browser (Echo Show) zeigen den geparkten Streifen sonst als hellen Balken neben dem Glas */
.scene .s-gls{opacity:0;visibility:hidden;transform-box:view-box}
.sweep .scene .s-gls{animation:nv-glare var(--nv-sweep) .1s ease-in-out both}
.scene .s-scr{fill:${PAL.screen};stroke:rgba(var(--nv-hi),.18);stroke-width:.5}.scene .s-tgl{fill:rgb(var(--nv-hi));opacity:.05}
.still .scene .s-gls{animation-play-state:paused!important}
@keyframes nv-glare{0%{opacity:0;visibility:visible;transform:translateX(0)}15%{opacity:.7}85%{opacity:.7}99%{opacity:0;visibility:visible}100%{opacity:0;visibility:hidden;transform:translateX(var(--gx,70px))}}
@media (prefers-reduced-motion:reduce){.sweep .scene .s-gls{animation:none}}`;
  var frameGlow = (sel2) => `${sel2}{box-shadow:var(--nv-shadow),0 0 0 1px color-mix(in srgb,color-mix(in srgb,var(--dc) 45%,transparent) var(--nv-ring),transparent),var(--nv-edge)}`;
  function sweep(el) {
    if (!el) return;
    el.classList.remove("sweep");
    void el.getBoundingClientRect();
    el.classList.add("sweep");
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
.scene .dl-edge{fill:none;stroke:rgb(var(--nv-hi));stroke-opacity:.14;stroke-width:.7}
.scene .dl-bz{fill:none;stroke-width:4.4}
.scene .dl-fc{stroke:rgba(var(--nv-lo),.6);stroke-width:1}
.scene .tk{stroke:rgb(var(--nv-hi));stroke-opacity:.14;stroke-width:.6}.scene .tkm{stroke:rgb(var(--nv-hi));stroke-opacity:.3;stroke-width:1.4;stroke-linecap:round}
.scene .dl-tr{fill:none;stroke:rgb(var(--nv-hi));stroke-opacity:.06;stroke-width:6}
.scene .dl-arc{fill:none;stroke:var(--dc);stroke-width:6;stroke-linecap:round;stroke-dasharray:1000;stroke-dashoffset:calc(1000 - var(--p,0) * 1000);
filter:drop-shadow(0 0 2.5px var(--dc));transition:stroke-dashoffset var(--nv-d7) linear,opacity var(--nv-d5)}
.scene .dl-arcl{fill:none;stroke:rgb(var(--nv-hi));stroke-opacity:.16;stroke-width:1.2;stroke-linecap:round}
.scene .dl-cr{stroke:rgba(var(--nv-hi),.2);stroke-width:.5}.scene .dl-grv{stroke:rgb(var(--nv-lo));stroke-opacity:.3;stroke-width:.8}
.scene .dl-cap{stroke:rgba(var(--nv-hi),.2);stroke-width:.4}
.scene .dl-push,.scene .dl-crown{transform-box:view-box}
/* Unsichtbares mit Leuchten (drop-shadow) zusätzlich per visibility weg – manche Browser (Echo Show) malen den Schatten sonst als Fleck */
.scene .dl-bell{opacity:0;visibility:hidden;transform-box:fill-box;transform-origin:center}
.scene .dl-br{fill:var(--dc);filter:drop-shadow(0 0 4px var(--dc))}.scene .dl-bk{fill:var(--dcfg,rgb(var(--nv-hi)))}
@media (prefers-reduced-motion:reduce){.scene *{animation:none!important;transition:none!important}}`;

  // src/timer.js
  var DEF = {
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
    return h ? `${h}:${String(m).padStart(2, "0")}` : `${m}:${x}`;
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
.g.tm{--dc:var(--tc);--dcfg:var(--tcfg);padding:var(--nv-s7);gap:var(--nv-s5);transition:box-shadow var(--nv-d5)}
${frameGlow(".g.tm.glow.st-active")}
.g.tm.alm{--dc:var(--ac);--dcfg:var(--acfg)}
.g.tm.glow.alm{box-shadow:var(--nv-shadow),0 0 0 2px var(--ac),0 0 24px color-mix(in srgb,color-mix(in srgb,var(--ac) 55%,transparent) var(--nv-glow),transparent),var(--nv-edge)}
.anim.glow.alm{animation:tm-frame 1.2s ease-in-out infinite}
.still{animation-play-state:paused!important}.still *{animation-play-state:paused!important}
.hd .nm small{font-variant-numeric:tabular-nums}
.bd{display:flex;flex-direction:column;gap:var(--nv-s6);align-items:stretch;flex:1;min-height:0}
.dial{position:relative;align-self:center;width:100%;max-width:var(--nova-timer-size,240px);aspect-ratio:1;flex:none}
.dial svg{display:block;width:100%;height:100%;overflow:visible}
.ro{position:absolute;left:50%;top:56%;transform:translate(-50%,-50%);text-align:center;pointer-events:none;width:60%}
.ro .t{display:block;font-size:clamp(22px,calc(var(--dw,240px) * .16),46px);font-weight:var(--nv-fw-bold);letter-spacing:.01em;font-variant-numeric:tabular-nums;line-height:1.05;white-space:nowrap}
.ro .s{display:block;font-size:clamp(11px,calc(var(--dw,240px) * .05),14px);opacity:.65;margin-top:3px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.st-idle .scene{opacity:.55}.st-idle .ro .t{opacity:.7}
.alm .scene{opacity:1}
.anim.st-paused .ro .t{animation:tm-blink 1.4s ease-in-out infinite}
.ctl{display:flex;flex-direction:column;gap:var(--nv-s5);justify-content:center;min-width:0}
.row2{display:flex;gap:var(--nv-s4);flex-wrap:wrap}
.bt2{flex:1 1 0;min-width:0;box-sizing:border-box;min-height:var(--nova-timer-button-height,52px);padding:0 var(--nv-s4);border-radius:var(--nv-r-md);background:var(--nv-chip);border:1px solid rgba(var(--nv-tint),.08);
display:flex;align-items:center;justify-content:center;gap:var(--nv-s3);font-size:var(--nv-fs-9);font-weight:var(--nv-fw-medium);color:inherit;white-space:nowrap;overflow:hidden;transition:background-color var(--nv-d2),transform var(--nv-d1),box-shadow var(--nv-d2)}
.bt2 span{min-width:0;overflow:hidden;text-overflow:ellipsis}
.bt2 ha-icon{--mdc-icon-size:21px;flex:none}
.bt2:active{transform:scale(.95)}
/* Hauptknopf im Glas-Stil: nur leicht in der Kartenfarbe getönt, Icon in der Farbe – keine Vollfarbfläche */
.bt2.pri{background:color-mix(in srgb,var(--dc) 22%,var(--nv-chip));border-color:color-mix(in srgb,var(--dc) 55%,transparent)}
.bt2.pri ha-icon{color:var(--dc)}
/* Nur-Icon-Knöpfe in „Eigene Zeit“: Icon hell, sonst verschwindet z. B. das Häkchen auf dem getönten Knopf */
.cust .bt2.pri ha-icon{color:inherit}
.bt2.sel{border-color:color-mix(in srgb,var(--dc) 70%,transparent);background:color-mix(in srgb,var(--dc) 14%,var(--nv-chip))}
.pre{display:grid;grid-template-columns:repeat(var(--n,4),minmax(0,1fr));gap:var(--nv-s4)}
.pre .bt2{font-size:var(--nv-fs-10);font-weight:var(--nv-fw-bold)}
.zone{position:relative;display:flex;flex-direction:column;gap:var(--nv-s5);justify-content:center;min-width:0}
/* Eigene Zeit liegt über Start/Schnellwahl (die bleiben unsichtbar stehen) – die Karte wird nie höher oder niedriger */
.zone.op>.main,.zone.op>.pre{visibility:hidden}
.cust{position:absolute;inset:0;display:flex;flex-direction:column;gap:var(--nv-s5);justify-content:center;min-height:0}
.cust.sc{display:grid;grid-template-columns:minmax(0,1fr) minmax(84px,40%);grid-template-rows:minmax(0,1fr) auto;gap:var(--nv-s5)}
.cust:not(.sc) .scl,.cust:not(.sc) .rd,.cust.sc .stps{display:none}
.cust.sc .rd{grid-column:1;grid-row:1}.cust.sc .row2{grid-column:1;grid-row:2;flex-wrap:nowrap}.cust.sc .scl{grid-column:2;grid-row:1/3}
/* Tuner-Skala: Striche wandern beim Ziehen (nur transform), die Marke in der Mitte zeigt die Zeit */
.rd{display:flex;align-items:center;justify-content:center;min-width:0;min-height:0;contain:strict}
.rd b{font-size:clamp(26px,10cqw,52px);font-weight:var(--nv-fw-bold);font-variant-numeric:tabular-nums;line-height:1;white-space:nowrap}
.rd.in b{cursor:text}
.rd input{width:100%;max-width:6.5em;box-sizing:border-box;font:inherit;font-size:clamp(20px,7cqw,36px);font-weight:var(--nv-fw-bold);text-align:center;color:inherit;background:var(--nv-chip);border:1px solid color-mix(in srgb,var(--dc) 60%,transparent);border-radius:var(--nv-r-sm);padding:var(--nv-s3);outline:none}
.scl{position:relative;overflow:hidden;min-height:0;border-radius:var(--nv-r-md);background:var(--nv-chip);border:1px solid rgba(var(--nv-tint),.08);touch-action:none;cursor:grab;outline:none;user-select:none;-webkit-user-select:none;
contain:strict}
/* Abdunkeln oben/unten als feste Ebene darüber – eine Maske müsste bei jeder Bewegung neu gerechnet werden (ruckelt auf schwachen Geräten) */
.scl::before,.scl::after{content:'';position:absolute;left:0;right:0;height:26%;z-index:1;pointer-events:none}
.scl::before{top:0;background:linear-gradient(rgba(var(--nv-shade),.35),transparent)}.scl::after{bottom:0;background:linear-gradient(transparent,rgba(var(--nv-shade),.35))}
.scl:focus-visible{border-color:color-mix(in srgb,var(--dc) 70%,transparent)}
.scl .str{position:absolute;left:0;right:0;top:0;height:0;will-change:transform}
.scl .str.snap{transition:transform .22s cubic-bezier(.2,.8,.3,1)}
.scene .dl-gv{transform-box:view-box}
.scl i{position:absolute;left:10px;width:16%;height:1.5px;margin-top:-.75px;background:rgba(var(--nv-tint),.2)}
.scl i.m{width:34%;background:rgba(var(--nv-tint),.5)}
.scl b{position:absolute;left:calc(10px + 34% + 8px);height:16px;margin-top:-8px;line-height:16px;font-size:var(--nv-fs-6);font-weight:var(--nv-fw-bold);opacity:.7;font-variant-numeric:tabular-nums;white-space:nowrap}
.scl .mk{z-index:2;position:absolute;left:0;right:0;top:50%;height:2px;margin-top:-1px;background:var(--dc);box-shadow:0 0 8px color-mix(in srgb,color-mix(in srgb,var(--dc) 60%,transparent) var(--nv-glow),transparent);pointer-events:none}
.scl .mk::before{content:'';position:absolute;left:0;top:-5px;border:6px solid transparent;border-left:7px solid var(--dc);border-right:0}
/* Eigene Zeit: je Einheit [−] 05 Min [+] nebeneinander, so hoch wie Schnellwahl + Knöpfe – die Karte wächst nicht */
.stps{display:flex;gap:var(--nv-s4)}
.stp{flex:1 1 0;display:flex;align-items:center;justify-content:space-between;gap:var(--nv-s1);padding:0 3px;min-width:0;border-radius:var(--nv-r-md);background:var(--nv-chip);border:1px solid rgba(var(--nv-tint),.08);height:var(--nova-timer-button-height,52px);box-sizing:border-box}
.stp .mi{order:0}.stp .v{order:1;flex:1;text-align:right;font-size:19px;font-weight:var(--nv-fw-bold);font-variant-numeric:tabular-nums}.stp small{order:2;flex:1;text-align:left;font-size:var(--nv-fs-2);opacity:.6;margin-left:var(--nv-s2)}.stp .pl{order:3}
.stp .hb{width:34px;height:42px;flex:none;border-radius:var(--nv-r-sm)}
.stp .hb ha-icon{--mdc-icon-size:22px}
.msg{display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s6) var(--nv-s7);border-radius:var(--nv-r-md);font-size:var(--nv-fs-10);font-weight:var(--nv-fw-bold);
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
.scene .tip{fill:rgb(var(--nv-hi));filter:drop-shadow(0 0 3px var(--dc));opacity:0;visibility:hidden;transition:opacity var(--nv-d5),visibility 0s var(--nv-d5)}
.st-active .scene .tip,.st-paused .scene .tip{opacity:1;visibility:visible;transition:opacity var(--nv-d5)}
.scene .tipg{transition:transform var(--nv-d7) linear;transform-box:view-box;transform-origin:100px 112px}
.st-idle .scene .dl-arc{opacity:.35}
[hidden]{display:none!important}
/* Kompakt: kleine Stoppuhr links, Zeit daneben, Knöpfe rechts; Schnellwahl und eigene Zeit darunter über die ganze Breite */
.cmp .hd{display:none}
.cmp .bd{display:grid;grid-template-columns:auto minmax(0,1fr);align-items:center;align-content:center;column-gap:var(--nv-s7);row-gap:var(--nv-s5)}
.cmp .ctl{display:contents}
.cmp .dial{grid-column:1;grid-row:1;width:84px;max-width:84px}.cmp .ro{display:none}
.cmp .ct2{grid-column:2;grid-row:1;min-width:0}
.cmp .main{flex-wrap:nowrap}
.cmp .zone,.cmp .msg{grid-column:1/-1}
.cmp .zone{min-height:calc(2 * var(--nova-timer-button-height,52px) + 10px)}
.cmp .msg{display:none}
.ct2 .tt b{display:block;font-size:42px;font-weight:var(--nv-fw-bold);font-variant-numeric:tabular-nums;line-height:1.1}
.ct2 .tt small{display:block;font-size:var(--nv-fs-5);opacity:.7;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.ct2 .tt i{font-style:normal;opacity:.75}
.full .ct2{display:none}
.cmp.alm .tt b{color:var(--ac)}
@container (max-width:340px){.main.n3 .bt2 ha-icon{display:none}.bt2{font-size:var(--nv-fs-8)}}
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
@keyframes tm-frame{0%,100%{box-shadow:var(--nv-shadow),0 0 0 2px var(--ac),0 0 10px color-mix(in srgb,color-mix(in srgb,var(--ac) 30%,transparent) var(--nv-glow),transparent),var(--nv-edge)}50%{box-shadow:var(--nv-shadow),0 0 0 2px var(--ac),0 0 30px color-mix(in srgb,color-mix(in srgb,var(--ac) 75%,transparent) var(--nv-glow),transparent),var(--nv-edge)}}
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
      this._c = { ...DEF, ...c };
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
          if (this._showCust) this._custFrom(v?.total || 0);
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
    _svc(svc, data = {}, quiet = false) {
      if (!this._c.entity) return;
      this._press();
      return quiet ? this._h.callService("timer", svc, { entity_id: this._c.entity, ...data }, void 0, false) : this._h.callService("timer", svc, { entity_id: this._c.entity, ...data });
    }
    _start(sec) {
      this._armed = 0;
      return sec > 0 ? this._svc("start", { duration: hms(Math.round(sec)) }) : this._svc("start");
    }
    // +1 Minute: timer.change geht nicht über die eingestellte Dauer hinaus → dann gleich neu starten mit Rest + 60 s
    // (pausiert bleibt pausiert). Keine Fehlermeldung von HA.
    async _add(sec) {
      const v = this._calc();
      const restart = async () => {
        if (!v) return;
        await this._start(Math.round(v.left + sec));
        if (v.st === "paused") await this._svc("pause");
      };
      if (v && v.left + sec > v.total) return restart();
      try {
        await this._svc("change", { duration: hms(sec) }, true);
      } catch (err) {
        console.warn("[nova-cards] Timer: +1 Min per Neustart", err);
        restart();
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
      const t = Math.max(0, Math.round(sec)), u = this._units(), H = u.includes("h"), M = u.includes("m"), S = u.includes("s");
      const c = { h: 0, m: 0, s: 0 };
      if (H) c.h = Math.min(this._max("h"), M || S ? Math.floor(t / 3600) : Math.round(t / 3600));
      if (M) c.m = Math.min(this._max("m"), Math.floor((H ? t % 3600 : t) / 60) + (S ? 0 : Math.round(t % 60 / 60)));
      if (S) c.s = Math.min(this._max("s"), Math.round((M ? t % 60 : H ? t % 3600 : t) / 5) * 5);
      if (!c.h && !c.m && !c.s) {
        if (M) c.m = 5;
        else if (H) c.h = 1;
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
    _rep(el, fn) {
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      el.classList.add("tap");
      el.addEventListener("pointerdown", (ev) => {
        ev.preventDefault();
        fn();
        this._stopRep();
        this._rt = setTimeout(() => {
          this._ri = setInterval(fn, 110);
        }, 450);
      });
      ["pointerup", "pointerleave", "pointercancel"].forEach((t) => el.addEventListener(t, () => this._stopRep()));
      el.addEventListener("contextmenu", (ev) => ev.preventDefault());
      el.addEventListener("keydown", (ev) => {
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
      const e = this._e, txt = fmtLeft(this._sec);
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
          const A2 = window.AudioContext || window.webkitAudioContext;
          if (A2) try {
            this._ac = new A2();
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
      const fin = (ok) => {
        if (done) return;
        done = true;
        const t = ok ? parseIn(inp.value) : 0;
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
  var LABELS = {
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
  var HELPERS = {
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
        const d = { ...DEF, ...this._config };
        if (Array.isArray(d.presets)) d.presets = d.presets.join(", ");
        return d;
      };
      const form = (s) => this._form(s, data(), (v) => {
        const c = merge(this._config, names(s), v);
        if ("presets" in v) {
          const arr = list(v.presets).map((x) => /^\d+$/.test(x) ? +x : x);
          if (!arr.length || JSON.stringify(arr) === JSON.stringify(DEF.presets)) delete c.presets;
          else c.presets = arr;
        }
        Object.keys(DEF).forEach((k) => {
          if (k !== "presets" && c[k] === DEF[k]) delete c[k];
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
  __publicField(NovaTimerCardEditor, "labels", LABELS);
  __publicField(NovaTimerCardEditor, "helpers", HELPERS);
  __publicField(NovaTimerCardEditor, "openSections", ["general"]);
  define("timer-card-editor", NovaTimerCardEditor);
})();
