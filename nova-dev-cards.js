/* Nova Cards v0.10.1b3 DEV (nur dock) – Testbuild, alle Karten als custom:nova-dev-*. Nicht veröffentlichen. */
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

  // src/shared/state.js
  var OFF = /* @__PURE__ */ new Set(["off", "unavailable", "unknown", "idle", "docked", "standby", "closed", "paused", "not_home", "none", "ready"]);
  var isOn = (s) => !!s && !OFF.has(s.state);

  // src/shared/actions.js
  var fire = (el, type, detail) => el.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  var moreInfo = (el, entityId) => fire(el, "hass-more-info", { entityId });
  var hassAction = (el, config, action) => fire(el, "hass-action", { config, action });
  var navigate = (p) => {
    history.pushState(null, "", p);
    window.dispatchEvent(new CustomEvent("location-changed", { detail: { replace: false } }));
  };

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
  var hassChanged = (prev2, next, ids) => {
    if (prev2 === next) return false;
    if (!prev2 || !next) return true;
    if (GLOBAL.some((k) => prev2[k] !== next[k])) return true;
    const a = prev2.states, b = next.states;
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
      const helpers = await window.loadCardHelpers();
      this._body.innerHTML = "";
      this._cards = (this._cfg.cards || []).map((cc) => {
        const el = helpers.createCardElement(cc);
        if (this._h) el.hass = this._h;
        this._body.appendChild(el);
        return el;
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
      this._update();
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
      const PREV = /* @__PURE__ */ new Set(["HUI-CARD-PICKER", "HUI-CARD-PREVIEW", "HUI-DIALOG-EDIT-CARD", "HUI-DIALOG-CREATE-CARD", "HUI-CARD-ELEMENT-EDITOR"]);
      let n = this;
      for (let i = 0; i < 40 && n; i++) {
        if (PREV.has(n.tagName)) return true;
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
    // Exakter Pfadvergleich: ohne Query/Hash, Schrägstrich am Ende egal
    _norm(p) {
      p = String(p || "").split(/[?#]/)[0].replace(/\/+$/, "") || "/";
      try {
        return decodeURI(p);
      } catch {
        return p;
      }
    }
    _update() {
      if (!this._btns || !this._h) return;
      const h = this._h, here = this._norm(location.pathname);
      this._items.forEach((it, i) => {
        const d = this._btns[i];
        if (!d) return;
        const p = this._path(it);
        d.classList.toggle("act", i === this._cur || !!it.popup_hash && curHash() === cleanHash(it.popup_hash));
        d.classList.toggle("here", !!p && this._norm(p) === here);
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
  var GEN = [{ name: "source", selector: { text: {} } }];
  var LOOK = [{ type: "grid", name: "", schema: [
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
          b.append(form(GEN));
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
        this._section("look", "mdi:palette-outline", "Aussehen", (b) => b.append(form(LOOK)))
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
})();
