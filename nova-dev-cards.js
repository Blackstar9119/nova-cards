/* Nova Cards v0.11.1 DEV (nur shopping, note) – Testbuild, alle Karten als custom:nova-dev-*. Nicht veröffentlichen. */
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
  var isImg = (s) => typeof s === "string" && /^(\/|https?:|data:image)/.test(s);
  var toObj = (x) => typeof x === "string" ? { entity: x } : { ...x };
  var setIcon = (el, ic) => {
    if (el._ic === ic) return;
    el._ic = ic;
    el.innerHTML = isImg(ic) ? `<img src="${esc(ic)}" alt="">` : `<ha-icon icon="${esc(ic)}"></ha-icon>`;
  };

  // src/shared/actions.js
  var fire = (el, type, detail) => el.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  var moreInfo = (el, entityId) => fire(el, "hass-more-info", { entityId });

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
  var FIELD_CSS = `
.fld{box-sizing:border-box;width:100%;min-width:0;margin:0;border:1px solid var(--nv-box-border);background:var(--nv-box);color:var(--nv-fg);
font:inherit;font-size:14px;outline:none;-webkit-appearance:none;appearance:none;transition:border-color .2s,box-shadow .2s,background-color .2s}
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
  function printPaint(b, c, state, enabled) {
    const pill = c.print_style !== "round";
    const icon = { busy: "mdi:loading", ok: "mdi:check-bold", err: "mdi:alert-circle-outline" }[state] || c.print_icon || PRINT_DEF.print_icon;
    const label = { busy: "Druckt …", ok: "Gedruckt", err: "Fehler" }[state] || c.print_label || PRINT_DEF.print_label;
    b.className = `pb${pill ? " pill" : ""}${state && state !== "idle" ? ` ${state}` : ""}`;
    b.disabled = state === "idle" && !enabled;
    const ic = b.firstChild;
    if (ic.getAttribute("icon") !== icon) ic.setAttribute("icon", icon);
    b.lastChild.textContent = pill ? label : "";
    b.title = label;
    b.setAttribute("aria-label", label);
  }
  async function runPrint(card, hass, script, data, set) {
    const name = String(script || "").replace(/^script\./, "");
    if (!name || !hass) return false;
    clearTimeout(card._pbT);
    set("busy");
    let ok = true;
    try {
      await hass.callService("script", name, data || {});
    } catch (e) {
      ok = false;
      console.warn("[nova-cards] Drucken fehlgeschlagen", script, e);
    }
    set(ok ? "ok" : "err");
    card._pbT = setTimeout(() => set("idle"), FEEDBACK);
    return ok;
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
  var SCSS = `
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
      const old = this._c?.entity;
      this._c = { ...SDEF, ...c };
      if (old !== this._c.entity) {
        this._unsub();
        this._items = null;
        this._err = null;
      }
      this._ids = [this._c.entity, this._c.print_script].filter(Boolean);
      if (this._e) this._apply();
      if (this._h) this._start();
    }
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._e) this._build();
      this._start();
      if (this._fallback && old?.states[this._c.entity] !== h.states[this._c.entity]) this._fetch();
      if (hassChanged(old, h, this._ids)) this._render();
    }
    getCardSize() {
      return 5;
    }
    getGridOptions() {
      return { columns: 6, rows: "auto", min_columns: 3 };
    }
    connectedCallback() {
      if (this._h && this._c) this._start();
    }
    disconnectedCallback() {
      this._unsub();
      clearTimeout(this._pbT);
      this._leaving?.forEach((x) => clearTimeout(x.t));
      this._leaving = /* @__PURE__ */ new Map();
    }
    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${FIELD_CSS}${PRINT_CSS}${SCSS}</style><div class="g sh">
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
    // Einträge abonnieren (einmal je Liste); in der Kartenauswahl nur einmal holen
    _start() {
      const c = this._c, h = this._h;
      if (!c?.entity || !h?.states[c.entity] || this._sub || this._fallback || !this.isConnected) return;
      if (inPicker(this)) {
        this._fallback = true;
        this._fetch();
        return;
      }
      const id = c.entity;
      this._sub = h.connection.subscribeMessage((m) => {
        if (this._c?.entity !== id) return;
        this._items = Array.isArray(m?.items) ? m.items : [];
        this._err = null;
        this._render();
      }, { type: "todo/item/subscribe", entity_id: id }).catch((err) => {
        console.warn("[nova-cards] Einkauf: Abo nicht möglich, hole Einträge über todo.get_items", err);
        this._sub = null;
        this._fallback = true;
        this._fetch();
        return null;
      });
    }
    _unsub() {
      const s = this._sub;
      this._sub = null;
      this._fallback = false;
      s?.then((u) => typeof u === "function" && u()).catch(() => {
      });
    }
    async _fetch() {
      const h = this._h, id = this._c?.entity;
      if (!h || !id || !h.states[id]) return;
      const n = this._fid = (this._fid || 0) + 1;
      try {
        const res = await h.callService("todo", "get_items", {}, { entity_id: id }, false, true);
        if (n !== this._fid) return;
        this._items = res?.response?.[id]?.items || [];
        this._err = null;
      } catch (err) {
        this._err = err?.message || "Liste konnte nicht geladen werden";
      }
      this._render();
    }
    _open() {
      return (this._items || []).filter((i) => i.status === "needs_action");
    }
    _render() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !c || !e) return;
      const s = c.entity && h.states[c.entity];
      setIcon(e.ic, c.icon);
      e.name.textContent = c.name || s?.attributes.friendly_name || "Einkaufsliste";
      const open = this._open(), n = open.filter((i) => !this._leaving.has(i.uid)).length;
      e.sub.textContent = !s ? "" : this._items ? n ? `${n} offen` : "Alles erledigt" : "Wird geladen …";
      e.inp.disabled = !s;
      let msg = null;
      if (!c.entity) msg = ["mdi:format-list-checks", "Keine Liste gewählt – im Editor eine todo-Entität auswählen."];
      else if (!s) msg = ["mdi:alert-circle-outline", `Liste nicht gefunden: ${c.entity}`];
      else if (this._err && !this._items) msg = ["mdi:alert-circle-outline", this._err];
      else if (!this._items) msg = ["mdi:timer-sand", "Wird geladen …"];
      const rows = [...open.map((i) => ({ ...i, done: this._leaving.has(i.uid) }))];
      this._leaving.forEach((x, uid) => {
        if (!rows.some((r) => r.uid === uid)) rows.push({ ...x.item, done: true, leave: true });
      });
      if (c.show_completed) rows.push(...(this._items || []).filter((i) => i.status === "completed" && !this._leaving.has(i.uid)).map((i) => ({ ...i, done: true })));
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
      const el = document.createElement("div");
      el.className = `it${it.done ? " done" : ""}${it.leave ? " leave" : ""}`;
      el.innerHTML = '<span class="ck"><ha-icon icon="mdi:check-bold"></ha-icon></span><span class="tx"></span>';
      const tx = el.lastChild;
      tx.textContent = it.summary;
      if (it.description) {
        const sm = document.createElement("small");
        sm.textContent = it.description;
        tx.append(sm);
      }
      el.setAttribute("aria-checked", it.done ? "true" : "false");
      press(el, { tap: () => this._toggle(it, el) });
      el.setAttribute("role", "checkbox");
      return el;
    }
    _toggle(it, el) {
      const h = this._h, id = this._c.entity;
      if (!h || !id || it.leave) return;
      if (it.status === "needs_action" && !this._leaving.has(it.uid)) {
        el.classList.add("done");
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
  var LABELS = {
    ...BASE_LABELS,
    ...PRINT_LABELS,
    entity: "Einkaufsliste (todo)",
    name: "Name",
    show_header: "Kopfzeile anzeigen",
    placeholder: "Platzhalter im Eingabefeld",
    show_completed: "Erledigte Einträge anzeigen",
    height: "Mindesthöhe der Liste"
  };
  var HELPERS = {
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
      const strip = (c) => {
        Object.entries(SDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        return c;
      };
      const form = (schema) => this._form(schema, data, (v) => this._emit(strip(merge(this._config, names(schema), v))));
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(GEN))),
        this._section("list", "mdi:format-list-checks", "Liste", (b) => b.append(form(LIST))),
        this._section("print", "mdi:printer-pos", "Drucken", (b) => b.append(form(PRINT)))
      );
    }
  };
  __publicField(NovaShoppingCardEditor, "labels", LABELS);
  __publicField(NovaShoppingCardEditor, "helpers", HELPERS);
  __publicField(NovaShoppingCardEditor, "openSections", ["general"]);
  define("shopping-card-editor", NovaShoppingCardEditor);

  // src/note.js
  var NCSS = `
.g.nt{gap:10px}
.fld.ta{flex:1 1 0;min-height:var(--th,180px);resize:none;border-radius:18px;padding:14px 16px;line-height:1.5;font-size:15px;
overflow-y:auto;overscroll-behavior:contain;scrollbar-width:thin;white-space:pre-wrap}
.ft{display:flex;align-items:center;justify-content:flex-end;gap:8px;flex:none}
.cnt{flex:1;min-width:0;font-size:12px;opacity:.55;white-space:nowrap;overflow:hidden}
.ft .pb.pill{flex:0 1 auto;min-width:44px}
.ft.wide .cnt{display:none}.ft.wide .pb.pill{flex:1 1 auto}
.cl{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;
border:1px solid var(--nv-box-border);background:var(--nv-chip);color:inherit;outline:none;-webkit-tap-highlight-color:transparent;transition:opacity .2s,transform .2s}
.cl ha-icon{--mdc-icon-size:20px}
.cl[disabled]{opacity:.35;cursor:default}
.cl:active:not([disabled]){transform:scale(.92)}
.cl:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}
@container (max-width:260px){.cnt{display:none}}`;
  var NDEF = {
    name: "Notiz",
    icon: "mdi:note-edit-outline",
    placeholder: "Notiz schreiben …",
    show_header: true,
    show_clear: true,
    clear_after_print: true,
    height: 180,
    print_field: "text",
    ...PRINT_DEF
  };
  var STORE = "nova-note:";
  var NovaNoteCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("note-card-editor"));
    }
    static getStubConfig(h) {
      const script = Object.keys(h.states).find((id) => /^script\..*notiz.*druck/.test(id));
      return script ? { print_script: script } : {};
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      this._c = { ...NDEF, ...c };
      this._ids = [this._c.print_script].filter(Boolean);
      if (this._e) this._apply();
    }
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._e) this._build();
      if (hassChanged(old, h, this._ids)) this._render();
    }
    getCardSize() {
      return 4;
    }
    getGridOptions() {
      return { columns: 6, rows: "auto", min_columns: 3 };
    }
    disconnectedCallback() {
      clearTimeout(this._pbT);
      clearTimeout(this._st);
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
<div class="ft"><span class="cnt"></span><button class="cl" type="button" title="Leeren" aria-label="Leeren"><ha-icon icon="mdi:eraser"></ha-icon></button></div></div>`;
      const q = (s) => r.querySelector(s);
      this._e = { g: q(".g"), hd: q(".hd"), ic: q(".hd .ic"), name: q(".hd b"), sub: q(".hd small"), ta: q("textarea"), ft: q(".ft"), cnt: q(".cnt"), cl: q(".cl") };
      const e = this._e;
      this._pstate = "idle";
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
      this._pb = printButton(() => this._print());
      e.ft.append(this._pb);
      this._apply();
    }
    _apply() {
      const c = this._c, e = this._e;
      e.hd.hidden = c.show_header === false;
      e.ta.placeholder = c.placeholder || "";
      e.g.style.setProperty("--th", `${Math.max(60, +c.height || NDEF.height)}px`);
      if (!e.ta.value) e.ta.value = this._load();
      this._render();
    }
    _render() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !c || !e) return;
      setIcon(e.ic, c.icon);
      e.name.textContent = c.name || NDEF.name;
      const txt = e.ta.value, n = txt.trim().length, lines = txt ? txt.split("\n").length : 0;
      const missing = c.print_script && !h.states[c.print_script];
      e.sub.textContent = missing ? `Skript nicht gefunden: ${c.print_script}` : n ? "Bereit zum Drucken" : "Leer";
      e.cnt.textContent = n ? `${txt.length} Zeichen · ${lines} ${lines === 1 ? "Zeile" : "Zeilen"}` : "";
      e.cl.hidden = c.show_clear === false;
      e.cl.disabled = !txt;
      this._pb.hidden = !c.print_script;
      e.ft.hidden = !c.print_script && c.show_clear === false;
      printPaint(this._pb, c, this._pstate, n > 0 && !missing);
      e.ft.classList.toggle("wide", c.print_style !== "round" && c.show_clear === false);
    }
    async _print() {
      const c = this._c, e = this._e, txt = e.ta.value.replace(/\s+$/, "");
      if (!txt.trim() || this._pstate === "busy") return;
      const ok = await runPrint(this, this._h, c.print_script, { [c.print_field || "text"]: txt }, (st) => {
        this._pstate = st;
        this._render();
      });
      if (ok && c.clear_after_print !== false && e.ta.value.replace(/\s+$/, "") === txt) {
        e.ta.value = "";
        this._save();
        this._render();
      }
    }
  };
  define("note-card", NovaNoteCard, { name: "Nova Notiz Card", description: "Mehrzeiliges Notizfeld mit Druck-Knopf: gibt den Text an ein Skript weiter (z. B. für einen Bondrucker) und leert das Feld danach.", documentationURL: docUrl("nova-notiz-card") });
  var GEN2 = [
    g2({ name: "name", selector: T }, { name: "icon", selector: I }),
    { name: "show_header", selector: { boolean: {} } },
    { name: "placeholder", selector: T },
    g2({ name: "show_clear", selector: { boolean: {} } }, { name: "height", selector: { number: { min: 60, max: 1e3, step: 10, mode: "box", unit_of_measurement: "px" } } })
  ];
  var PRINT2 = printSchema([g2({ name: "print_field", selector: T }, { name: "clear_after_print", selector: { boolean: {} } })]);
  var LABELS2 = {
    ...BASE_LABELS,
    ...PRINT_LABELS,
    name: "Name",
    show_header: "Kopfzeile anzeigen",
    placeholder: "Platzhalter im Textfeld",
    show_clear: "Knopf „Leeren“",
    height: "Mindesthöhe des Textfelds",
    print_field: "Feldname im Skript",
    clear_after_print: "Nach dem Druck leeren"
  };
  var HELPERS2 = {
    ...PRINT_HELPERS,
    print_field: "Unter diesem Namen bekommt das Skript den Text (Standard: text).",
    height: "Im Raster füllt das Textfeld den Platz aus."
  };
  var NovaNoteCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), data = { ...NDEF, ...c0 };
      const strip = (c) => {
        Object.entries(NDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        return c;
      };
      const form = (schema) => this._form(schema, data, (v) => this._emit(strip(merge(this._config, names(schema), v))));
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(GEN2))),
        this._section("print", "mdi:printer-pos", "Drucken", (b) => b.append(form(PRINT2)))
      );
    }
  };
  __publicField(NovaNoteCardEditor, "labels", LABELS2);
  __publicField(NovaNoteCardEditor, "helpers", HELPERS2);
  __publicField(NovaNoteCardEditor, "openSections", ["general"]);
  define("note-card-editor", NovaNoteCardEditor);
})();
