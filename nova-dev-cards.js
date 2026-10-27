/* Nova Cards v0.10.1b1 DEV (nur remote) – Testbuild, alle Karten als custom:nova-dev-*. Nicht veröffentlichen. */
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
      play_pause: "PlayPause",
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
    netflix: ["Netflix", "mdi:netflix", "com.netflix.ninja"],
    youtube: ["YouTube", "mdi:youtube", "com.google.android.youtube.tv"],
    prime: ["Prime Video", "mdi:filmstrip-box-multiple", "com.amazon.amazonvideo.livingroom"],
    disney: ["Disney+", "mdi:castle", "com.disney.disneyplus"],
    appletv: ["Apple TV", "mdi:apple", "com.apple.atve.androidtv.appletv"],
    spotify: ["Spotify", "mdi:spotify", "com.spotify.tv.android"],
    ytmusic: ["YouTube Music", "mdi:music-circle", "com.google.android.youtube.tvmusic"],
    plex: ["Plex", "mdi:plex", "com.plexapp.android"],
    kodi: ["Kodi", "mdi:kodi", "org.xbmc.kodi"],
    twitch: ["Twitch", "mdi:twitch", "tv.twitch.android.app"],
    dazn: ["DAZN", "mdi:soccer", "com.dazn"],
    playstore: ["Play Store", "mdi:google-play", "com.android.vending"],
    settings: ["Einstellungen", "mdi:cog-outline", "com.android.tv.settings"]
  };
  var appOf = (a) => {
    const p = APPS[a.preset] || [];
    return { ...a, name: a.name ?? p[0], icon: a.icon || p[1] || "mdi:application-outline", app: a.app || p[2] };
  };
  var RDEF = { layout: "dpad", show_power: true, show_nav: true, show_media: true, show_volume: true, show_channels: false };
  var platformOf = (h, c) => c.platform && c.platform !== "auto" ? c.platform : h?.entities?.[c.entity]?.platform in KEYMAPS ? h.entities[c.entity].platform : dom(c.entity) === "media_player" ? "androidtv" : "androidtv_remote";
  var playerOf = (h, c) => {
    if (c.media_player) return c.media_player;
    if (dom(c.entity) === "media_player") return c.entity;
    const dev = h?.entities?.[c.entity]?.device_id;
    return dev && Object.values(h.entities).find((e) => e.device_id === dev && dom(e.entity_id) === "media_player" && h.states[e.entity_id])?.entity_id || null;
  };
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
      if (!this._built || old?.entities !== h.entities && (platformOf(h, this._c) !== this._plat || playerOf(h, this._c) !== this._mp)) this._build();
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
${c.show_volume !== false ? row(["vol_down", "mute", "vol_up"]) : ""}
${c.show_channels ? row(["ch_down", "input", "ch_up"]) : ""}
${btns.length ? '<div class="pills grid btns"></div>' : ""}
${this._apps.length ? '<div class="pills grid apps"></div>' : ""}</div>`;
      const q = (s) => r.querySelector(s);
      this._e = { g: q(".g"), ic: q(".hd .ic"), name: q(".hd b"), sub: q(".hd small"), pw: q(".pw") };
      press(this._e.ic, { tap: () => runAction(this, { entity: c.entity, tap_action: c.tap_action }, "tap", true), hold: () => runAction(this, { entity: c.entity, hold_action: c.hold_action }, "hold") });
      if (this._e.pw) press(this._e.pw, { tap: () => this._key("power") });
      r.querySelectorAll("[data-k]").forEach((el) => this._rep(el, el.dataset.k));
      const tp = q(".tp");
      if (tp) this._touch(tp);
      const pill = (o, fn) => {
        const el = document.createElement("div");
        el.className = "pill";
        el.innerHTML = '<span class="i"></span><span class="t"></span>';
        setIcon(el.firstChild, o.icon || "mdi:gesture-tap-button");
        el.lastChild.textContent = o.name ?? "";
        press(el, { tap: fn });
        return el;
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
    _rep(el, k) {
      let t, iv;
      const stop = () => {
        clearTimeout(t);
        clearInterval(iv);
        t = iv = null;
        el.classList.remove("hit");
      };
      this._stops.add(stop);
      el.tabIndex = 0;
      el.setAttribute("role", "button");
      el.classList.add("tap");
      el.addEventListener("pointerdown", (e) => {
        e.preventDefault();
        stop();
        el.classList.add("hit");
        this._key(k);
        if (REPEAT.has(k)) t = setTimeout(() => {
          iv = setInterval(() => this._key(k, true), 160);
        }, 450);
      });
      ["pointerup", "pointerleave", "pointercancel"].forEach((x) => el.addEventListener(x, stop));
      el.addEventListener("contextmenu", (e) => e.preventDefault());
      el.addEventListener("keydown", (e) => {
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
      this._send(this._cmd(k));
    }
    _button(b) {
      fire(this, "haptic", "light");
      if (b.tap_action?.action && b.tap_action.action !== "default") return runAction(this, { tap_action: b.tap_action }, "tap");
      this._send(b.command);
    }
    // App öffnen: Android TV Remote über Paketname/Deep-Link, sonst über die Quelle des Players
    _launch(a) {
      const c = this._c, h = this._h;
      fire(this, "haptic", "light");
      if (a.tap_action?.action && a.tap_action.action !== "default") return runAction(this, { tap_action: a.tap_action }, "tap");
      const id = a.app || a.name;
      if (!id) return;
      if (dom(c.entity) === "remote" && (this._plat === "androidtv_remote" || !this._mp)) return h.callService("remote", "turn_on", { entity_id: c.entity, activity: id });
      h.callService("media_player", "select_source", { entity_id: this._mp || c.entity, source: id });
    }
    _update() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !e) return;
      const s = h.states[c.entity], m = this._mp && h.states[this._mp];
      const na = !s || s.state === "unavailable";
      const off = na || ["off", "standby"].includes(s.state) || m && ["off", "standby"].includes(m.state);
      this.classList.toggle("nv-na", na);
      e.g.classList.toggle("na", na);
      e.g.classList.toggle("off", !!off);
      const cur = currentApp(h, c, this._mp), hit = this._apps.find((a) => same(a.app, cur) || same(a.name, cur) || same(a.name, m?.attributes.app_name));
      e.name.textContent = c.name ?? s?.attributes.friendly_name ?? m?.attributes.friendly_name ?? c.entity;
      e.sub.textContent = !s ? "nicht gefunden" : off ? fmtState(h, m && !na ? m : s) : hit?.name || m?.attributes.app_name || cur || fmtState(h, s);
      setIcon(e.ic, c.icon || !off && hit?.icon || (m?.attributes.device_class === "tv" ? "mdi:television" : "mdi:remote-tv"));
      e.ic.parentElement.classList.toggle("on", !off);
      e.pw?.classList.toggle("on", !off);
      this._pills.forEach((el, i) => el.classList.toggle("on", !off && this._apps[i] === hit));
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
    { name: "show_channels", selector: { boolean: {} } },
    { name: "volume_entity", selector: { entity: { domain: "media_player" } } }
  ];
  var RACT = [g2({ name: "tap_action", selector: A }, { name: "hold_action", selector: A })];
  var RAPP = [
    sel("preset", [["", "Eigene App"], ...Object.entries(APPS).map(([k, [n]]) => [k, n])]),
    g2({ name: "name", selector: T }, { name: "icon", selector: I }),
    { name: "app", selector: T },
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
    show_channels: "Kanäle und Eingang",
    volume_entity: "Lautstärke über anderen Player (optional)",
    preset: "Vorlage",
    app: "App (Paketname, Deep-Link oder Quelle)",
    command: "Befehl",
    tap_action: "Aktion beim Antippen",
    hold_action: "Aktion bei langem Drücken"
  };
  var RHELPERS = {
    platform: "Bestimmt die Tastenbefehle. Automatisch = nach Integration der Entität",
    media_player: "Leer = automatisch (Player am selben Gerät). Liefert Zustand und laufende App",
    volume_entity: "z. B. Fernseher oder AV-Receiver, wenn die Box die Lautstärke nicht selbst regelt",
    app: "Android TV: Paketname (com.netflix.ninja) oder Deep-Link (https://www.youtube.com). Andere Geräte: Name der Quelle. Leer = aus der Vorlage",
    command: "Befehl für remote.send_command, mehrere mit Komma (z. B. DPAD_DOWN, DPAD_CENTER)",
    tap_action: "Optional statt App bzw. Befehl, z. B. ein Skript"
  };
  var NovaRemoteCardEditor = class extends NovaEditorBase {
    _ilabel(it, j, m) {
      return `${j + 1}. ${it.name || APPS[it.preset]?.[0] || it.app || it.command || `Neu: ${m.item}`}`;
    }
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), strip = (c) => {
        Object.entries(RDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        if (c.platform === "auto") delete c.platform;
        return c;
      };
      const data = { ...RDEF, platform: "auto", ...c0 };
      const form = (schema) => this._form(schema, data, (v) => this._emit(strip(merge(this._config, names(schema), v))));
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
      const h = this._hass, c = this._config, cur = h && c.entity && currentApp(h, c, playerOf(h, c));
      const apps = this._items("apps").map(appOf);
      if (cur && !apps.some((a) => same(a.app, cur) || same(a.name, cur))) {
        b.append(this._hint(`Gerade läuft: ${cur}`), this._add("Laufende App übernehmen", () => {
          const preset = Object.keys(APPS).find((k) => same(APPS[k][2], cur) || same(APPS[k][0], cur));
          const n = [...this._items("apps"), preset ? { preset } : { name: cur.split(".").pop(), app: cur }];
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
      b.append(this._hint("Nur ausfüllen, wenn eine Taste anders belegt sein soll. Mehrere Befehle mit Komma."));
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
})();
