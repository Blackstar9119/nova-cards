/* Nova Cards v0.10.0 | MIT | https://github.com/Blackstar9119/nova-cards
   Raum, Thermostat, Licht, Dock, Modular, Kamera, Media, Saugroboter, Müllkalender – alle als custom:nova-*.
   Erzeugt mit „npm run build“ aus src/ – diese Datei nicht direkt bearbeiten. */
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

  // src/shared/define.js
  var define = (tag, cls, meta) => {
    if (!customElements.get(tag)) customElements.define(tag, cls);
    if (meta) {
      window.customCards = window.customCards || [];
      if (!window.customCards.some((c) => c.type === tag)) window.customCards.push({ type: tag, preview: true, ...meta });
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
  var setIcon = (el, ic) => {
    if (el._ic === ic) return;
    el._ic = ic;
    el.innerHTML = isImg(ic) ? `<img src="${esc(ic)}" alt="">` : `<ha-icon icon="${esc(ic)}"></ha-icon>`;
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
  var iconOf = (h, o, fb) => o.icon || h.states[o.entity]?.attributes.icon || DICON[dom(o.entity)] || fb;
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
  var fire = (el, type, detail) => el.dispatchEvent(new CustomEvent(type, { detail, bubbles: true, composed: true }));
  var moreInfo = (el, entityId) => fire(el, "hass-more-info", { entityId });
  var hassAction = (el, config, action) => fire(el, "hass-action", { config, action });
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
--nv-blur:var(--nova-blur,20px)}`;
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
  var MAPROW_CSS = `.maprow{display:flex;gap:6px;align-items:center}.maprow ha-form{flex:1}`;
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
  var merge = (base, keys, val) => {
    const o = { ...base };
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
    _form(schema2, data, cb) {
      const f = document.createElement("ha-form");
      f.hass = this._hass;
      f.schema = schema2;
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
    _itemList(w, k, schema2, m, addLabel, view = (it) => it) {
      const items = this._items(k), keys = names(schema2);
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
        body.append(this._form(schema2, view(it), (v) => {
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

  // src/room.js
  var MAIN = [
    { type: "grid", name: "", schema: [{ name: "name", required: true, selector: { text: {} } }, { name: "icon", selector: { icon: {} } }] },
    { name: "temperature", selector: { entity: { domain: ["sensor", "climate"] } } },
    { name: "windows", selector: { entity: { multiple: true, domain: "binary_sensor" } } },
    { name: "tap_action", selector: { ui_action: {} } }
  ];
  var ADVANCED = [
    { name: "info", selector: { entity: {} } },
    { type: "grid", name: "", schema: [{ name: "info_suffix", selector: { text: {} } }, { name: "info_round", selector: { boolean: {} } }] },
    { name: "image", selector: { text: {} } },
    { name: "window_icon", selector: { icon: {} } }
  ];
  var BUTTON = [
    { name: "entity", required: true, selector: { entity: {} } },
    { type: "grid", name: "", schema: [{ name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } }, { name: "name", selector: { text: {} } }] },
    { name: "state_entity", selector: { entity: {} } },
    { name: "tap_action", selector: { ui_action: {} } },
    { name: "hold_action", selector: { ui_action: {} } },
    { name: "icon_entity", selector: { entity: {} } }
  ];
  var ICON_MAP_ROW = [{ type: "grid", name: "", schema: [{ name: "state", selector: { text: {} } }, { name: "value", selector: { text: {} } }] }];
  var NovaRoomCardEditor = class extends NovaEditorBase {
    // icon_map je Button als bearbeitbare Zeilen (bleiben auch leer stehen)
    _onExternalConfig() {
      this._maps = (this._config.buttons || []).map((b) => Object.entries(b.icon_map || {}));
    }
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${EDITOR_CSS}${MAPROW_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), save = (schema2) => (v) => this._emit(merge(this._config, names(schema2), v));
      w.append(this._form(MAIN, this._config, save(MAIN)));
      w.append(this._h3("Buttons"));
      (this._config.buttons || []).forEach((b, i) => w.append(this._button(b, i)));
      w.append(this._add("Button hinzufügen", () => {
        const buttons = [...this._config.buttons || [], {}];
        this._maps.push([]);
        this._open.add(buttons.length - 1);
        this._emit({ ...this._config, buttons });
        this._rebuild();
      }));
      const adv = document.createElement("details");
      adv.className = "item";
      adv.innerHTML = '<summary><ha-icon icon="mdi:cog-outline"></ha-icon><span class="lbl">Erweitert</span></summary><div class="body"></div>';
      adv.querySelector(".body").append(this._form(ADVANCED, this._config, save(ADVANCED)));
      w.append(adv);
    }
    _label(b, i) {
      const s = b.entity ? this._hass?.states[b.entity] : null;
      return `${i + 1}. ${b.name || s?.attributes.friendly_name || b.entity || "Neuer Button"}`;
    }
    _button(b, i) {
      const n = (this._config.buttons || []).length;
      const [d, s, body] = this._details(i, b.icon || "mdi:gesture-tap-button", this._label(b, i), this._itemBtns(i, n, (dir) => this._move(i, dir), () => this._remove(i)));
      body.append(this._form(BUTTON, b, (v) => {
        const buttons = [...this._config.buttons], old = buttons[i];
        buttons[i] = merge(old, names(BUTTON), v);
        this._emit({ ...this._config, buttons });
        s.querySelector(".lbl").textContent = this._label(buttons[i], i);
        if (!!old.icon_entity !== !!buttons[i].icon_entity) this._rebuild();
      }));
      if (b.icon_entity) body.append(this._mapEditor(i));
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
    state_entity: "Optional: bestimmt An/Aus-Anzeige statt der Entität selbst (z. B. TV-Bildschirmstatus)",
    icon_entity: "Optional: Icon wechselt je nach Zustand dieser Entität (z. B. aktuelle TV-App)",
    image: "z. B. /local/raeume/wohnzimmer.jpg"
  });
  define("nova-room-card-editor", NovaRoomCardEditor);
  var TAG = "nova-room-card";
  var TOGGLE_DOMAINS = ["light", "switch", "input_boolean", "fan", "cover", "group", "siren", "humidifier", "automation"];
  var PRESS_SERVICE = { scene: ["scene", "turn_on"], script: ["script", "turn_on"], button: ["button", "press"], input_button: ["input_button", "press"] };
  var STATELESS = ["button", "input_button", "script", "scene"];
  var DOMAIN_ICONS = { light: "mdi:lightbulb", switch: "mdi:power-socket-eu", fan: "mdi:fan", vacuum: "mdi:robot-vacuum", input_boolean: "mdi:toggle-switch-outline", media_player: "mdi:speaker", button: "mdi:gesture-tap-button", input_button: "mdi:gesture-tap-button", script: "mdi:script-text-outline", scene: "mdi:palette", climate: "mdi:thermostat", cover: "mdi:window-shutter", lock: "mdi:lock", sensor: "mdi:eye" };
  var ROOM_CSS = `
.room{display:flex;flex-direction:column;justify-content:space-between;padding:14px 16px;min-height:var(--nova-room-min-height,168px);transition:box-shadow .4s}
.room.click{cursor:pointer}
.bg{position:absolute;inset:0;background-size:cover;background-position:center;opacity:.45;filter:grayscale(.7);transition:all .5s}
.bgi{position:absolute;right:-14px;top:4px;--mdc-icon-size:130px;opacity:.07;transition:all .5s}
.room.lit .bgi{opacity:.18;color:var(--nv-accent)}.room.lit .bg{opacity:.85;filter:none}
.room.lit{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-accent) 40%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.room.warn{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-warn) 60%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.head{display:flex;align-items:center;gap:2px;position:relative;font-weight:600;font-size:15px;text-shadow:0 1px 4px rgba(0,0,0,.4)}
.head .chev{--mdc-icon-size:18px;opacity:.6}
.t{margin-left:auto;font-weight:500;font-size:13px;opacity:.85;display:flex;gap:8px;align-items:center}
.w{display:none;--mdc-icon-size:16px;color:var(--nv-warn)}.room.warn .w{display:flex}
.btns{display:flex;gap:9px;flex-wrap:wrap;position:relative}
.b{width:44px;height:44px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);border:1px solid rgba(255,255,255,.1);transition:all .25s;cursor:pointer;-webkit-tap-highlight-color:transparent;user-select:none;outline:none}
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
      return document.createElement(`${TAG}-editor`);
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
      this._built = false;
      if (this._h) {
        this._build();
        this._update();
      }
    }
    set hass(h) {
      this._h = h;
      if (!this._built) this._build();
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
      const c = this._c, r = this.shadowRoot || this.attachShadow({ mode: "open" }), tap = c.tap_action?.action;
      r.innerHTML = `<style>${CARD_CSS}${ROOM_CSS}</style>
<div class="g room ${tap && tap !== "none" ? "click" : ""}">
  ${c.image ? `<div class="bg" style="background-image:url('${esc(c.image)}')"></div>` : ""}
  <ha-icon class="bgi" icon="${esc(c.icon || "mdi:home")}"></ha-icon>
  <div class="head"><span>${esc(c.name || "")}</span>${tap === "navigate" ? '<ha-icon class="chev" icon="mdi:chevron-right"></ha-icon>' : ""}
    <span class="t"><ha-icon class="w" icon="${esc(c.window_icon || "mdi:window-open-variant")}"></ha-icon><span class="tv"></span></span></div>
  <div class="btns"></div>
</div>`;
      this._room = r.querySelector(".room");
      this._tv = r.querySelector(".tv");
      const box = r.querySelector(".btns");
      this._room.addEventListener("click", () => {
        if (!tap || tap === "none") return;
        hassAction(this, { entity: c.temperature || c.info, tap_action: c.tap_action }, "tap");
      });
      this._btns = c.buttons.map((b) => {
        const el = document.createElement("div");
        el.className = "b";
        press(el, { tap: () => this._tap(b), hold: () => this._hold(b), isolate: true });
        box.appendChild(el);
        return [el, b];
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
      for (const [el, b] of this._btns) {
        const s = h.states[b.entity], d = dom(b.entity);
        const on = b.state_entity ? isOn(h.states[b.state_entity]) : isOn(s), glow = c.glow_domains.includes(d);
        el.classList.toggle("na", !s || s.state === "unavailable");
        el.classList.toggle("on", on && !STATELESS.includes(d));
        el.classList.toggle("alt", !glow);
        if (on && glow) lit = true;
        setIcon(el, this._icon(b));
        el.title = b.name || s?.attributes.friendly_name || b.entity;
      }
      this._room.classList.toggle("lit", lit);
    }
  };
  define(TAG, NovaRoomCard, { name: "Nova Raum Card", description: "Raumkachel mit Temperatur, Fenster-Warnung und frei belegbaren Buttons.", documentationURL: docUrl("nova-raum-card") });

  // src/thermostat.js
  var TAG2 = "nova-thermostat-card";
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
  var gradientId = 0;
  function sparkline(pts, { w = 300, h = 64, color = "var(--nv-accent)" } = {}) {
    if (!pts || pts.length < 2) return '<svg class="spk"></svg>';
    const t0 = pts[0][0], t1 = Math.max(pts[pts.length - 1][0], Date.now()), vals = pts.map((p) => p[1]);
    const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
    const d = "M" + pts.concat([[t1, pts[pts.length - 1][1]]]).map((p) => [(p[0] - t0) / (t1 - t0 || 1) * w, h - 6 - (p[1] - min) / range * (h - 14)]).map((p) => p[0].toFixed(1) + "," + p[1].toFixed(1)).join("L");
    const id = `nvg${++gradientId}`;
    return `<svg class="spk" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".45"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="${d}L${w},${h}L0,${h}Z" fill="url(#${id})"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
  }
  var schema = (h, entity) => {
    const modes = h?.states[entity]?.attributes.hvac_modes || Object.keys(MODE_NAMES);
    return [
      { name: "entity", required: true, selector: { entity: { domain: "climate" } } },
      { type: "grid", name: "", schema: [{ name: "name", selector: { text: {} } }, { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } }] },
      { name: "sensor", selector: { entity: { domain: "sensor", device_class: "temperature" } } },
      { name: "windows", selector: { entity: { multiple: true, domain: "binary_sensor" } } },
      { type: "grid", name: "", schema: [{ name: "show_graph", selector: { boolean: {} } }, { name: "graph_hours", selector: { number: { min: 1, max: 168, mode: "box", unit_of_measurement: "h" } } }] },
      { type: "grid", name: "", schema: [{ name: "show_modes", selector: { boolean: {} } }, { name: "show_presets", selector: { boolean: {} } }] },
      { name: "compact", selector: { boolean: {} } },
      { name: "modes", selector: { select: { multiple: true, options: modes.map((m) => ({ value: m, label: MODE_NAMES[m] || m })) } } },
      { type: "grid", name: "", schema: [{ name: "step", selector: { number: { min: 0.1, max: 5, step: 0.1, mode: "box", unit_of_measurement: "°" } } }, { name: "humidity", selector: { entity: { domain: "sensor", device_class: "humidity" } } }] },
      { name: "tap_action", selector: { ui_action: {} } }
    ];
  };
  var EDITOR_DEFAULTS = { show_graph: true, graph_hours: 24, show_modes: true, show_presets: false, compact: true };
  var NovaThermostatCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${EDITOR_CSS}${MAPROW_CSS}</style><div class="wrap"></div>`;
      const s = schema(this._hass, this._config.entity), keys = names(s);
      r.querySelector(".wrap").append(this._form(s, { ...EDITOR_DEFAULTS, ...this._config }, (v) => {
        const prev = this._config.entity, c = merge(this._config, keys, v);
        Object.entries(EDITOR_DEFAULTS).forEach(([k, x]) => c[k] === x && delete c[k]);
        this._emit(c);
        if (c.entity !== prev) this._rebuild();
      }));
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
  define("nova-thermostat-card-editor", NovaThermostatCardEditor);
  var THERMO_CSS = `
.th{padding:14px 16px;display:flex;flex-direction:column;gap:10px}
.th.warn{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--nv-warn) 60%,transparent)}
.hd{display:flex;align-items:center;gap:10px;cursor:pointer}
.ic{width:38px;height:38px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);transition:all .3s}
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
      return document.createElement(`${TAG2}-editor`);
    }
    static getStubConfig(h) {
      return { entity: Object.keys(h.states).find((id) => id.startsWith("climate.")) || "climate.wohnzimmer" };
    }
    setConfig(c) {
      this._c = normalize2(c);
      this._built = false;
      this._pend = null;
      if (this._h) {
        this._build();
        this._update();
      }
    }
    set hass(h) {
      this._h = h;
      if (!this._built) this._build();
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
      let cur = sensor ? parseFloat(sensor.state) : NaN;
      if (isNaN(cur)) cur = parseFloat(a.current_temperature);
      e.cur.textContent = isNaN(cur) ? "–" : `${cur.toFixed(1)}°`;
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
  define("nova-color-input", NovaColorInput);
  var MAIN2 = [
    { type: "grid", name: "", schema: [{ name: "title", selector: { text: {} } }, { name: "icon", selector: { icon: {} } }] },
    { name: "area", selector: { area: {} } },
    { name: "exclude", selector: { entity: { multiple: true, domain: "light" } } },
    { type: "grid", name: "", schema: [{ name: "show_header", selector: { boolean: {} } }, { name: "show_all_off", selector: { boolean: {} } }, { name: "use_light_color", selector: { boolean: {} } }, { name: "show_colors", selector: { boolean: {} } }] }
  ];
  var LAMP = [
    { name: "entity", required: true, selector: { entity: { domain: "light" } } },
    { type: "grid", name: "", schema: [{ name: "name", selector: { text: {} } }, { name: "icon", selector: { icon: {} }, context: { icon_entity: "entity" } }] },
    { name: "tap_action", selector: { ui_action: {} } },
    { name: "hold_action", selector: { ui_action: {} } }
  ];
  var EDITOR_DEFAULTS2 = { show_header: true, show_all_off: true, use_light_color: true, show_colors: true };
  var toLamp = (x) => typeof x === "string" ? { entity: x } : { ...x };
  var LIGHT_EDITOR_CSS = `
.dots{display:flex;flex-wrap:wrap;gap:8px;align-items:center}
.dot{position:relative;width:30px;height:30px;border-radius:50%;border:2px solid var(--divider-color,#888);box-sizing:border-box}
.dot button{position:absolute;top:-6px;right:-6px;width:18px;height:18px;padding:0;border-radius:50%;border:none;background:var(--error-color,#db4437);color:#fff;font:700 12px/18px sans-serif;cursor:pointer}
.sub{font-size:13px;font-weight:600;margin:4px 0 0}`;
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
      const r = this.shadowRoot;
      r.innerHTML = `<style>${EDITOR_CSS}${MAPROW_CSS}${LIGHT_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), keys = names(MAIN2);
      w.append(this._form(MAIN2, { ...EDITOR_DEFAULTS2, ...this._config }, (v) => this._emit(this._clean(merge(this._config, keys, v)))));
      w.append(this._h3("Lampen"), this._hint("Genau eine Lampe (ohne Bereich) = Einzelkachel. Mehrere = Sammelkarte."));
      this._config.entities.forEach((l, i) => w.append(this._lamp(l, i)));
      w.append(this._add("Lampe hinzufügen", () => {
        const lamps = [...this._config.entities, { entity: "" }];
        this._open.add(lamps.length - 1);
        this._set(lamps);
        this._rebuild();
      }));
      w.append(this._h3("Farbknöpfe für alle Lampen"), this._colors("all", this._config.colors || [], (colors) => {
        this._emit(this._clean({ ...this._config, colors }));
        this._config.entities = this._internal;
      }));
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
      const [d, s, body] = this._details(i, l.icon || "mdi:lightbulb", this._label(l, i), this._itemBtns(i, n, (dir) => this._move(i, dir), () => this._removeLamp(i)));
      const keys = names(LAMP);
      body.append(this._form(LAMP, l, (v) => {
        const lamps = [...this._config.entities], old = lamps[i];
        lamps[i] = merge(old, keys, v);
        this._set(lamps);
        s.querySelector(".lbl").textContent = this._label(lamps[i], i);
        if (old.entity !== lamps[i].entity) this._rebuild();
      }));
      const sub = document.createElement("div");
      sub.className = "sub";
      sub.textContent = "Farbknöpfe dieser Lampe";
      body.append(sub, this._colors(`l${i}`, l.colors || [], (colors) => {
        const lamps = [...this._config.entities];
        lamps[i] = { ...lamps[i], colors };
        this._set(lamps);
      }, l.entity));
      return d;
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
        const a = entity && this._hass?.states[entity]?.attributes, picker = document.createElement("nova-color-input");
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
    hold_action: "Aktion bei langem Drücken"
  });
  __publicField(NovaLightCardEditor, "helpers", { area: "Optional. Neue Lampen im Bereich erscheinen von selbst" });
  define("nova-light-card-editor", NovaLightCardEditor);
  var TAG3 = "nova-light-card";
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
.ic{width:34px;height:34px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:rgba(255,255,255,.12);transition:all .3s}
.ic ha-icon{--mdc-icon-size:18px}
.t.on .ic{background:var(--lc,var(--nv-accent));color:var(--nv-accent-fg);box-shadow:0 0 12px color-mix(in srgb,var(--lc,var(--nv-accent)) 60%,transparent)}
.top:active .ic{transform:scale(.9)}
.nm{flex:1;min-width:0}.nm b{display:block;font-size:13px;font-weight:500;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}.nm small{display:block;font-size:11px;opacity:.6}
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
      return document.createElement(`${TAG3}-editor`);
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
      this._built = false;
      if (this._h) {
        this._build();
        this._update();
      }
    }
    set hass(h) {
      const prev = this._list;
      this._h = h;
      if (!this._c) return;
      const now = this._lights();
      if (!this._built || now.join() !== (prev || []).join()) this._build();
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
      const grid = r.querySelector(".grid"), byId = Object.fromEntries(c.entities.map((l) => [l.entity, l]));
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
        grid.appendChild(tile);
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
        x.nm.textContent = x.o.name || this._strip(a.friendly_name || x.id);
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
    // Raumname vorne weglassen: „Küche Decke“ → „Decke“
    _strip(name) {
      const p = this._c.strip_prefix ?? this._c.title ?? (this._c.area ? this._h.areas?.[this._c.area]?.name : "");
      return p && name.toLowerCase().startsWith(p.toLowerCase() + " ") ? name.slice(p.length + 1) : name;
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
      const helpers = await window.loadCardHelpers();
      this._body.innerHTML = "";
      this._cards = (this._cfg.cards || []).map((cc) => {
        const el = helpers.createCardElement(cc);
        if (this._h) el.hass = this._h;
        this._body.appendChild(el);
        return el;
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
  define("nova-dock-popup", NovaDockPopup);
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
    if ((o.type === "custom:nova-dock-card" || o.type === "custom:nz-dock-card") && Array.isArray(o.items) && o.items.length) return o;
    for (const v of Object.values(o)) {
      const r = findDock(v);
      if (r) return r;
    }
    return null;
  };
  var NovaDockCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement("nova-dock-card-editor");
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
    }
    disconnectedCallback() {
      window.removeEventListener("location-changed", this._loc);
      window.removeEventListener("popstate", this._loc);
      this._close();
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
        d.classList.toggle("act", i === this._cur);
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
      if (this._cur === i) return this._close();
      this._close();
      if (Array.isArray(it.cards)) return this._openCards(i, it);
      if (typeof it.popup === "string" && customElements.get("nz-popup")) return this._openLegacy(i, it);
      if (it.tap_action && it.tap_action.action !== "none") return hassAction(this, { entity: it.entity, tap_action: it.tap_action }, "tap");
      if (it.navigation_path) return navigate(it.navigation_path);
      if (it.entity) moreInfo(this, it.entity);
    }
    _openCards(i, it) {
      const p = document.createElement("nova-dock-popup");
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
  define("nova-dock-card", NovaDockCard, { name: "Nova Dock Card", description: "Schwebende Leiste unten mit Buttons: navigieren, Aktion auslösen oder Popup mit beliebigen Karten öffnen.", documentationURL: docUrl("nova-dock-card") });
  var MAIN3 = [
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
    { name: "popup_title", selector: { text: {} } },
    { name: "cards", selector: { object: {} } },
    { name: "badge", selector: { entity: {} } },
    { type: "grid", name: "", schema: [
      { name: "badge_count_of", selector: { entity: {} } },
      { name: "badge_show_number", selector: { boolean: {} } }
    ] },
    { name: "badge_exclude", selector: { entity: { multiple: true } } }
  ];
  var LABELS = {
    position: "Position",
    button_size: "Button-Größe",
    source: "Einträge aus anderem Dashboard übernehmen",
    icon: "Icon",
    label: "Name",
    tap_action: "Aktion beim Antippen",
    popup_title: "Popup-Titel",
    cards: "Popup-Karten (YAML-Liste)",
    badge: "Punkt, wenn diese Entität an ist",
    badge_count_of: "Zähler: Gruppe",
    badge_show_number: "Zahl statt Punkt",
    badge_exclude: "Beim Zählen ignorieren"
  };
  var HELPERS = {
    source: "Optional: URL-Pfad eines Dashboards (z. B. neues-zuhause). Dann gilt dessen Dock – praktisch für mehrere Dashboards mit gleicher Leiste.",
    cards: "Wenn gesetzt, öffnet der Button ein Popup mit diesen Karten (statt der Aktion). Beispiel: - type: tile, entity: light.flur",
    badge_count_of: "Zeigt Punkt/Zahl, wenn Mitglieder der Gruppe an sind (z. B. light.alle_lampen)"
  };
  var NovaDockCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap");
      const main = { position: "bottom", button_size: 48, ...this._config };
      w.append(this._form(MAIN3, main, (v) => {
        const c = merge(this._config, names(MAIN3), v);
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
      return `${i + 1}. ${it.label || it.popup_title || (Array.isArray(it.cards) ? "Popup" : it.tap_action?.navigation_path) || "Neuer Button"}`;
    }
    _item(it, i, n) {
      const [d, s, b] = this._details(i, it.icon || "mdi:circle-outline", this._label(it, i), this._itemBtns(i, n, (dir) => this._move(i, dir), () => this._remove(i)));
      b.append(this._form(ITEM, it, (v) => {
        const list2 = [...this._config.items];
        const nx = merge(list2[i], names(ITEM), v);
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
  __publicField(NovaDockCardEditor, "labels", LABELS);
  __publicField(NovaDockCardEditor, "helpers", HELPERS);
  define("nova-dock-card-editor", NovaDockCardEditor);

  // src/shared/editor-schema.js
  var g2 = (...schema2) => ({ type: "grid", name: "", schema: schema2 });
  var T = { text: {} };
  var I = { icon: {} };
  var A = { ui_action: {} };
  var ENT = { name: "entity", required: true, selector: { entity: {} } };
  var TITLE = { name: "title", selector: T };
  var COLS = { name: "columns", selector: { number: { min: 1, max: 4, mode: "slider" } } };
  var NUM = (n) => ({ name: n, selector: { number: { mode: "box", step: "any" } } });
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
        const el = document.createElement("div");
        el.className = chips ? "pill" : "kv";
        el.innerHTML = chips ? '<span class="i"></span><span class="t"></span>' : '<span class="i"></span><span class="k"></span><span class="v"></span>';
        press(el, { tap: () => this._act(o, "tap", true), hold: () => this._act(o, "hold") });
        box.append(el);
        return [el, o];
      });
      w.append(box);
      return (h) => els.forEach(([el, o]) => {
        const s = h.states[o.entity];
        el.classList.toggle("na", !s || s.state === "unavailable");
        setIcon(el.firstChild, iconOf(h, o, "mdi:information-outline"));
        const v = valueOf(h, s, o);
        if (chips) el.lastChild.textContent = o.name === "" ? v : `${nameOf(h, o)} · ${v}`;
        else {
          el.children[1].textContent = nameOf(h, o);
          el.children[2].textContent = v;
        }
      });
    },
    entities(b, w) {
      const box = document.createElement("div");
      box.className = "list";
      if (b.columns > 1) box.style.setProperty("--cols", b.columns);
      const els = b.entities.map((o) => {
        const el = document.createElement("div");
        el.className = "row";
        el.innerHTML = `<div class="ic"></div><div class="nm"><b></b><small></small></div>${TOGGLE.includes(dom(o.entity)) ? '<div class="sw"></div>' : ""}`;
        press(el, { tap: () => this._act(o, "tap"), hold: () => this._act(o, "hold") });
        box.append(el);
        return [el, o];
      });
      w.append(box);
      return (h) => els.forEach(([el, o]) => {
        const s = h.states[o.entity];
        el.classList.toggle("na", !s || s.state === "unavailable");
        el.classList.toggle("on", isOn(s) && !PRESS[dom(o.entity)]);
        setIcon(el.firstChild, iconOf(h, o, "mdi:power"));
        el.querySelector("b").textContent = nameOf(h, o);
        el.querySelector("small").textContent = s ? valueOf(h, s, o) : "nicht gefunden";
      });
    },
    sliders(b, w) {
      const els = b.entities.map((o) => {
        const el = document.createElement("div");
        el.className = "sl";
        el.innerHTML = '<div class="kv"><span class="i"></span><span class="k"></span><span class="v"></span></div><input type="range">';
        const top = el.firstChild, inp = el.lastChild, v = el.querySelector(".v");
        press(top, { tap: () => this._act(o, "tap", true), hold: () => this._act(o, "hold") });
        const paint = () => {
          const mn = +inp.min, mx = +inp.max, n = +inp.value;
          inp.style.setProperty("--p", `${mx > mn ? (n - mn) / (mx - mn) * 100 : 0}%`);
          v.textContent = o.format === "duration" ? duration(n) : unitJoin(n.toFixed(decOf(inp.step)), el._u);
        };
        inp.addEventListener("pointerdown", () => {
          el._drag = true;
        });
        inp.addEventListener("input", () => {
          el._drag = true;
          paint();
        });
        inp.addEventListener("change", () => {
          SLIDE[dom(o.entity)]?.set(this._h, o.entity, +inp.value);
          clearTimeout(el._t);
          el._t = setTimeout(() => {
            el._drag = false;
          }, 1500);
        });
        w.append(el);
        return { el, o, inp, paint };
      });
      return (h) => els.forEach(({ el, o, inp, paint }) => {
        const s = h.states[o.entity], D = SLIDE[dom(o.entity)];
        el.classList.toggle("na", !s || !D || s.state === "unavailable");
        setIcon(el.querySelector(".i"), iconOf(h, o, "mdi:tune-variant"));
        el.querySelector(".k").textContent = nameOf(h, o);
        inp.disabled = !s || !D || s.state === "unavailable";
        if (!s || !D) {
          el.querySelector(".v").textContent = s ? fmtState(h, s) : "–";
          return;
        }
        const [mn, mx, st] = D.r(s.attributes);
        inp.min = o.min ?? mn;
        inp.max = o.max ?? mx;
        inp.step = o.step ?? st;
        el._u = o.unit ?? D.u ?? s.attributes.unit_of_measurement;
        if (!el._drag) inp.value = D.v(s);
        paint();
      });
    },
    buttons(b, w) {
      const box = document.createElement("div");
      box.className = `pills${b.layout === "grid" ? " grid" : ""}`;
      const els = b.buttons.map((o) => {
        const el = document.createElement("div");
        el.className = "pill";
        el.innerHTML = '<span class="i"></span><span class="t"></span>';
        press(el, { tap: () => this._act(o, "tap"), hold: () => this._act(o, "hold") });
        box.append(el);
        return [el, o];
      });
      w.append(box);
      return (h) => els.forEach(([el, o]) => {
        const s = o.entity && h.states[o.entity];
        el.classList.toggle("na", !!o.entity && (!s || s.state === "unavailable"));
        el.classList.toggle("on", !!s && TOGGLE.includes(dom(o.entity)) && isOn(s));
        setIcon(el.firstChild, iconOf(h, o, "mdi:gesture-tap-button"));
        el.lastChild.textContent = o.name ?? (s?.attributes.friendly_name || "");
      });
    },
    alerts(b, w) {
      const box = document.createElement("div");
      box.className = `als${b.layout === "chips" ? " chips" : ""}`;
      const els = b.alerts.map((o) => {
        const el = document.createElement("div");
        el.className = `al ${o.level || "warning"}`;
        el.innerHTML = '<span class="i"></span><span class="t"></span>';
        press(el, { tap: () => this._act(o, "tap", true), hold: () => this._act(o, "hold") });
        box.append(el);
        return [el, o];
      });
      w.append(box);
      return (h) => {
        let lvl = 0;
        els.forEach(([el, o]) => {
          const s = h.states[o.entity], hit = alertHit(o, s);
          el.hidden = !hit;
          if (!hit) return;
          lvl = Math.max(lvl, o.level === "error" ? 2 : o.level === "info" ? 0 : 1);
          setIcon(el.firstChild, o.icon || (o.level === "error" ? "mdi:alert-octagon" : o.level === "info" ? "mdi:information" : "mdi:alert"));
          el.lastChild.textContent = o.message ? o.message.replace("{state}", fmtState(h, s)) : `${nameOf(h, o)}: ${fmtState(h, s)}`;
        });
        w.hidden = !els.some(([el]) => !el.hidden);
        return b.glow === false ? 0 : lvl;
      };
    }
  };
  var NovaModularCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement("nova-modular-card-editor");
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
      this._built = false;
      if (this._h) {
        this._build();
        this._update();
      }
    }
    set hass(h) {
      this._h = h;
      if (!this._c) return;
      if (!this._built) this._build();
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
  define("nova-modular-card", NovaModularCard, { name: "Nova Modular Card", description: "Frei zusammensetzbare Gerätekarte: Kopfzeile, Infos, Schalter, Regler, Aktionsbuttons und Warnungen.", documentationURL: docUrl("nova-modular-card") });
  var BM = {
    header: { label: "Kopfzeile", icon: "mdi:page-layout-header", schema: [
      g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "status" } }),
      { name: "status", selector: { entity: {} } },
      g2({ name: "active", selector: { entity: {} } }, { name: "progress", selector: { entity: { domain: ["sensor", "number", "input_number"] } } }),
      { name: "tap_action", selector: A },
      { name: "button_icon", selector: I },
      { name: "button_action", selector: A }
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
      r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), bl = this._blocks();
      w.append(this._h3("Bausteine"), this._hint("Frei kombinierbar – die Reihenfolge hier ist die Reihenfolge auf der Karte."));
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
      const [d, s, body] = this._details(
        `${i}`,
        m?.icon || "mdi:help-circle-outline",
        this._blabel(b, i),
        this._itemBtns(i, n, (dir) => this._move(null, i, dir), () => this._del(null, i))
      );
      if (!m) {
        body.append(this._hint(`Unbekannter Baustein „${b.type}“ – nur per YAML bearbeitbar.`));
        return d;
      }
      const keys = names(m.schema), def = m.defaults || {};
      body.append(this._form(m.schema, { ...def, ...b }, (v) => {
        const bl = this._blocks(), nb = merge(bl[i], keys, v);
        Object.entries(def).forEach(([k, x]) => nb[k] === x && delete nb[k]);
        bl[i] = nb;
        this._set(bl);
        s.querySelector(".lbl").textContent = this._blabel(nb, i);
      }));
      if (m.items) {
        const k = m.key || "entities", items = b[k] || [];
        const h = document.createElement("h4");
        h.textContent = m.plural;
        body.append(h);
        items.forEach((it, j) => body.append(this._sub(i, j, it, items.length, m, k)));
        body.append(this._add(`${m.item} hinzufügen`, () => {
          const bl = this._blocks();
          bl[i] = { ...bl[i], [k]: [...bl[i][k] || [], {}] };
          this._open = /* @__PURE__ */ new Set([`${i}`, `${i}.${bl[i][k].length - 1}`]);
          this._set(bl);
          this._rebuild();
        }));
      }
      return d;
    }
    _sub(i, j, it, n, m, k) {
      const [d, s, body] = this._details(
        `${i}.${j}`,
        it.icon || m.icon,
        this._ilabel(it, j, m),
        this._itemBtns(j, n, (dir) => this._move(i, j, dir), () => this._del(i, j))
      );
      const keys = names(m.items);
      body.append(this._form(m.items, it, (v) => {
        const bl = this._blocks(), arr = [...bl[i][k]];
        arr[j] = merge(arr[j], keys, v);
        bl[i] = { ...bl[i], [k]: arr };
        this._set(bl);
        s.querySelector(".lbl").textContent = this._ilabel(arr[j], j, m);
      }));
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
  define("nova-modular-card-editor", NovaModularCardEditor);

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
.split>nova-camera-card{display:block;min-width:0}
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
  function repeat(el, fn, ms = 450) {
    let t;
    const stop = () => {
      clearInterval(t);
      el.classList.remove("act");
    };
    el.classList.add("tap");
    el.tabIndex = 0;
    el.setAttribute("role", "button");
    el.addEventListener("pointerdown", (e) => {
      e.preventDefault();
      e.stopPropagation();
      stop();
      el.classList.add("act");
      fn();
      t = setInterval(fn, ms);
    });
    ["pointerup", "pointerleave", "pointercancel"].forEach((n) => el.addEventListener(n, stop));
    el.addEventListener("click", (e) => e.stopPropagation());
    el.addEventListener("contextmenu", (e) => e.preventDefault());
    el.addEventListener("keydown", (e) => {
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
      return document.createElement("nova-camera-card-editor");
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
      this._built = false;
      this._stopLive();
      if (this._h) {
        this._build();
        this._update();
      }
    }
    set hass(h) {
      this._h = h;
      if (!this._c) return;
      if (!this._built) this._build();
      this._update();
    }
    getCardSize() {
      return 5 + (this._c?.split.length ? 3 : 0);
    }
    getGridOptions() {
      return { columns: 12, rows: "auto", min_columns: 4 };
    }
    connectedCallback() {
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
        const el = document.createElement("div");
        el.className = ov ? "cb" : "pill";
        el.innerHTML = ov ? '<span class="i"></span>' : '<span class="i"></span><span class="t"></span>';
        press(el, { tap: () => this._act(o, "tap"), hold: () => this._act(o, "hold") });
        q(ov ? ".ovl.bot" : ".below").append(el);
        return [el, o];
      });
      this._chips = c.chips.map((o) => {
        const el = document.createElement("div");
        el.className = "pill";
        el.innerHTML = '<span class="i"></span><span class="t"></span>';
        press(el, { tap: () => this._act(o, "tap", true) });
        q(".ovl.tl").append(el);
        return [el, o];
      });
      this._alerts = c.alerts.map((o) => {
        const el = document.createElement("div");
        el.className = `al ${o.level || "warning"}`;
        el.innerHTML = '<span class="i"></span><span class="t"></span>';
        press(el, { tap: () => this._act(o, "tap", true) });
        q(".ovl.tr").append(el);
        return [el, o];
      });
      if (pk.length) {
        const box = q(".ptz"), dirs = pk.filter((k) => !k.startsWith("zoom")), zm = pk.filter((k) => k.startsWith("zoom"));
        const mk = (k) => {
          const el = document.createElement("i");
          el.dataset.k = k;
          el.title = PTZ_NAME[k];
          el.innerHTML = `<ha-icon icon="${PTZ_ICON[k]}"></ha-icon>`;
          repeat(el, () => this._ptzGo(k));
          return el;
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
          const k = document.createElement("nova-camera-card");
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
      if (e.hd) {
        e.name.textContent = c.name ?? s?.attributes.friendly_name ?? c.entity;
        setIcon(e.ic, c.icon || st?.attributes.icon || s?.attributes.icon || (dom(c.entity) === "image" ? "mdi:image" : "mdi:cctv"));
        e.sub.textContent = st ? fmtState(h, st) : !s ? "nicht gefunden" : this._mode ? "Live" : "";
        e.hd.classList.toggle("on", st ? isOn(st) : !!this._mode);
      }
      this._btns.forEach(([el, o]) => {
        const bs = o.entity && h.states[o.entity];
        el.classList.toggle("na", !!o.entity && (!bs || bs.state === "unavailable"));
        el.classList.toggle("on", !!bs && TOGGLE.includes(dom(o.entity)) && isOn(bs));
        setIcon(el.firstChild, iconOf(h, o, "mdi:gesture-tap-button"));
        el.title = nameOf(h, o);
        if (el.children[1]) el.children[1].textContent = o.name ?? (bs?.attributes.friendly_name || "");
      });
      this._chips.forEach(([el, o]) => {
        const cs = h.states[o.entity];
        el.hidden = !cs || hasCond(o) && !alertHit(o, cs);
        if (el.hidden) return;
        el.classList.toggle("on", dom(o.entity) === "binary_sensor" && cs.state === "on");
        setIcon(el.firstChild, iconOf(h, o, "mdi:information-outline"));
        const v = valueOf(h, cs, o);
        el.lastChild.textContent = o.name ? `${o.name} · ${v}` : v;
      });
      let lvl = 0;
      this._alerts.forEach(([el, o]) => {
        const as = h.states[o.entity], hit = alertHit(o, as);
        el.hidden = !hit;
        if (!hit) return;
        lvl = Math.max(lvl, o.level === "error" ? 2 : o.level === "info" ? 0 : 1);
        setIcon(el.firstChild, o.icon || (o.level === "error" ? "mdi:alert-octagon" : o.level === "info" ? "mdi:information" : "mdi:alert"));
        el.lastChild.textContent = o.message ? o.message.replace("{state}", fmtState(h, as)) : `${nameOf(h, o)}: ${fmtState(h, as)}`;
      });
      this._ptzEls.forEach((el) => {
        const v = this._ptz[el.dataset.k];
        el.classList.toggle("na", typeof v === "string" && (!h.states[v] || h.states[v].state === "unavailable"));
      });
      if (c.glow === false) lvl = 0;
      e.g.classList.toggle("warn", lvl === 1);
      e.g.classList.toggle("err", lvl === 2);
      if (dom(c.entity) === "image" && s && this._stillKey !== s.state) this._still();
      if (this._liveEl && "hass" in this._liveEl) this._liveEl.hass = h;
      this._kids.forEach((k) => {
        k.hass = h;
      });
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
      const live = show && dom(this._c.entity) === "camera" && this._c.stream !== "snapshot";
      if (live && !this._mode && !this._starting) this._startLive();
      if (!live) this._stopLive();
      clearInterval(this._tm);
      this._tm = null;
      if (show && dom(this._c.entity) === "camera" && !this._mode) {
        if (!this._e.still.src) this._still();
        if (this._c.refresh > 0) this._tm = setInterval(() => !this._mode && this._still(), this._c.refresh * 1e3);
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
      let el;
      if (mode === "webrtc") {
        el = document.createElement("webrtc-camera");
        try {
          el.setConfig({ entity: c.entity, ui: false, muted: true, ...c.webrtc || {} });
        } catch (e) {
          console.warn("[nova-cards] webrtc-camera", e);
        }
        el.hass = this._h;
      } else if (mode === "ha") {
        el = document.createElement("ha-camera-stream");
        Object.assign(el, { hass: this._h, stateObj: s, muted: true, controls: false, fitMode: c.fit === "contain" ? "contain" : "cover" });
      } else {
        const p = s.attributes.entity_picture;
        if (!p) return;
        el = document.createElement("img");
        el.alt = "";
        el.src = p.replace("/api/camera_proxy/", "/api/camera_proxy_stream/");
        el.addEventListener("error", () => {
          if (this._liveEl !== el) return;
          this._stopLive();
          this._retry = setTimeout(() => this._sync(), 1e4);
        });
      }
      this._mode = mode;
      this._liveEl = el;
      this._e.live.replaceChildren(el);
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
  define("nova-camera-card", NovaCameraCard, { name: "Nova Kamera Card", description: "Live-Bild von camera.* oder image.* mit Kopfzeile, rundem PTZ-Steuerkreuz, Splitscreen, frei belegbaren Buttons (Licht, Sirene …), Info-Chips und Warnungen.", documentationURL: docUrl("nova-kamera-card") });
  var CMAIN = [
    { name: "entity", required: true, selector: { entity: { domain: ["camera", "image"] } } },
    g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } }),
    { name: "status", selector: { entity: {} } },
    g2({ name: "show_header", selector: { boolean: {} } }, { name: "glow", selector: { boolean: {} } }),
    { name: "tap_action", selector: A },
    g2({ name: "button_icon", selector: I }, { name: "button_action", selector: A }),
    g2(sel("aspect_ratio", [["16:9", "16:9"], ["4:3", "4:3"], ["1:1", "1:1"]]), sel("fit", [["cover", "Füllen"], ["contain", "Ganzes Bild"]])),
    g2(
      sel("image_action", [["more-info", "Details (more-info)"], ["fullscreen", "Vollbild"], ["none", "Nichts"]]),
      sel("stream", [["auto", "Automatisch"], ["mjpeg", "MJPEG"], ["webrtc", "WebRTC-Karte"], ["snapshot", "Nur Standbild"]])
    ),
    g2({ name: "refresh", selector: { number: { min: 0, max: 300, mode: "box", unit_of_measurement: "s" } } }, sel("buttons_position", [["overlay", "Über dem Bild"], ["below", "Darunter"]]))
  ];
  CMAIN.push(sel("split_layout", [["grid", "Raster (2 Spalten)"], ["row", "Nebeneinander"], ["column", "Untereinander"]]));
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
    split_layout: "Nur mit weiteren Kameras unter „Splitscreen“. Schmale Karten stapeln automatisch",
    ptz: "Automatisch sucht Schwenk-/Neige-Buttons am Gerät der Kamera. Gedrückt halten = weiterfahren"
  };
  var NovaCameraCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap");
      w.append(this._form(CMAIN, { ...CDEF, glow: true, ...this._config }, (v) => {
        const c = merge(this._config, names(CMAIN), v);
        Object.entries(CDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        if (c.glow === true) delete c.glow;
        this._emit(c);
      }));
      w.append(this._h3("Steuerkreuz (Schwenken / Neigen)"));
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
      Object.entries(CM).forEach(([k, m]) => {
        w.append(this._h3(m.label));
        this._itemList(w, k, m.items, m, `${m.item} hinzufügen`);
      });
    }
  };
  __publicField(NovaCameraCardEditor, "labels", CLABELS);
  __publicField(NovaCameraCardEditor, "helpers", CHELPERS);
  define("nova-camera-card-editor", NovaCameraCardEditor);

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
.ctl .cb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);transition:all .2s}
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
      return document.createElement("nova-media-card-editor");
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
      this._built = false;
      if (this._h) {
        this._build();
        this._update();
      }
    }
    set hass(h) {
      this._h = h;
      if (!this._c) return;
      if (!this._built) this._build();
      this._update();
    }
    getCardSize() {
      return 4;
    }
    getGridOptions() {
      return { columns: 12, rows: "auto", min_columns: 4 };
    }
    connectedCallback() {
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
        const el = document.createElement("div");
        el.className = "pill";
        el.innerHTML = '<span class="i"></span><span class="t"></span><ha-icon class="eq" icon="mdi:equalizer"></ha-icon>';
        press(el, { tap: () => {
          this._idx = i;
          this._manual = true;
          this._srcKey = null;
          this._update();
        }, hold: () => moreInfo(this, o.entity) });
        e.pls.append(el);
        return el;
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
      const off = !s || ["off", "unavailable", "unknown", "standby"].includes(s.state), play = s?.state === "playing";
      e.g.classList.toggle("na", !s || s.state === "unavailable");
      e.g.classList.toggle("off", off);
      e.g.classList.toggle("play", play && c.glow !== false);
      const app = a.app_name || (a.app_id === "music_assistant" ? "Music Assistant" : a.source);
      const logo = mapIcon(c.icon_map, c.icon_entity && h.states[c.icon_entity]?.state, a.app_name, a.app_id, a.source, a.media_channel);
      e.name.textContent = p.name ?? n?.attributes.friendly_name ?? a.friendly_name ?? p.entity;
      e.sub.textContent = !s ? "nicht gefunden" : off ? fmtState(h, s) : [app, play ? null : fmtState(h, s)].filter(Boolean).join(" · ") || fmtState(h, s);
      setIcon(e.ic, logo || p.icon || a.icon || (a.device_class === "tv" ? "mdi:television" : a.device_class === "speaker" ? "mdi:speaker" : "mdi:cast"));
      e.ic.parentElement.classList.toggle("on", !off);
      if (e.pw) {
        e.pw.classList.toggle("on", !off);
        e.pw.hidden = !!n && !hasF(n, MF.ON) && !hasF(n, MF.OFF);
      }
      e.title.textContent = a.media_title || (off ? "" : app || fmtState(h, s));
      e.artist.textContent = [a.media_artist || a.media_series_title, a.media_album_name].filter(Boolean).join(" · ") || (a.media_title ? "" : a.media_channel || "");
      const pic = !off && c.artwork !== "none" ? a.entity_picture_local || a.entity_picture : null;
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
      this._chips?.forEach((el, i) => {
        const o = this._all[i], ps = h.states[o.entity], pa = ps?.attributes || {};
        el.classList.toggle("on", i === this._idx);
        el.classList.toggle("pl", h.states[this._eidOf(i)]?.state === "playing");
        el.classList.toggle("na", !ps || ps.state === "unavailable");
        setIcon(el.firstChild, o.icon || pa.icon || (pa.device_class === "tv" ? "mdi:television" : "mdi:speaker"));
        el.children[1].textContent = o.name ?? pa.friendly_name ?? o.entity;
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
          const el = document.createElement("div");
          el.className = "pill";
          el.dataset.s = x;
          el.innerHTML = '<span class="i"></span><span class="t"></span>';
          setIcon(el.firstChild, mapIcon(c.icon_map, x) || "mdi:import");
          el.lastChild.textContent = x;
          press(el, { tap: () => this._h.callService("media_player", "select_source", { entity_id: this._p.entity, source: x }) });
          return el;
        }));
      }
      e.src.hidden = !srcs.length;
      [...e.src.children].forEach((el) => el.classList.toggle("on", el.dataset.s === a.source));
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
      const run = this.isConnected && this._e?.bar && this._st()?.state === "playing";
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
  define("nova-media-card", NovaMediaCard, { name: "Nova Media Card", description: "Media-Player mit Cover als Hintergrund, Titel, Interpret, App-Logo, Play/Pause, Vor/Zurück, Lautstärke, Stumm, Ein/Aus, Quellen und mehreren umschaltbaren Playern.", documentationURL: docUrl("nova-media-card") });
  var MP = { domain: ["media_player"] };
  var MPMAIN = [
    { name: "entity", required: true, selector: { entity: MP } },
    g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } }),
    g2({ name: "tap_action", selector: A }, { name: "hold_action", selector: A }),
    g2(sel("artwork", [["background", "Hintergrund"], ["cover", "Cover + unscharfer Hintergrund"], ["none", "Kein Cover"]]), { name: "glow", selector: { boolean: {} } }),
    g2({ name: "show_progress", selector: { boolean: {} } }, { name: "show_power", selector: { boolean: {} } }),
    g2({ name: "show_volume", selector: { boolean: {} } }, { name: "show_mute", selector: { boolean: {} } }),
    { name: "show_source", selector: { boolean: {} } },
    { name: "sources", selector: { text: { multiple: true } } }
  ];
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
      r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}${MAPROW_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), strip = (c) => {
        Object.entries(MDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        if (c.glow === true) delete c.glow;
        return c;
      };
      w.append(this._form(MPMAIN, { ...MDEF, glow: true, ...c0 }, (v) => this._emit(strip(merge(this._config, names(MPMAIN), v)))));
      w.append(this._h3("Music Assistant"));
      const ma = c0.music_assistant;
      w.append(this._form(MPMA, { ma_auto: ma !== false, ma_entity: typeof ma === "string" ? ma : void 0 }, (v) => {
        const c = { ...this._config };
        if (v.ma_entity) c.music_assistant = v.ma_entity;
        else if (v.ma_auto === false) c.music_assistant = false;
        else delete c.music_assistant;
        this._emit(c);
      }));
      w.append(this._h3("Weitere Player (umschaltbar)"));
      if (this._items("players").length) w.append(this._form(MPPLAY, { ...MDEF, ...c0 }, (v) => this._emit(strip({ ...this._config, ...v }))));
      this._itemList(w, "players", MPITEM, { item: "Player", icon: "mdi:speaker" }, "Player hinzufügen");
      w.append(this._h3("App-Logos (icon_map)"));
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
  define("nova-media-card-editor", NovaMediaCardEditor);

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
.ctl .cb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);border:1px solid rgba(255,255,255,.08);transition:all .2s}
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
.scene.still *{animation-play-state:paused!important}
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
      return document.createElement("nova-vacuum-card-editor");
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
      this._built = false;
      if (this._h) {
        this._build();
        this._update();
      }
    }
    set hass(h) {
      this._h = h;
      if (!this._c) return;
      if (!this._built) this._build();
      this._update();
    }
    getCardSize() {
      return 3 + (this._c?.map ? 4 : 0) + Math.ceil(((this._c?.consumables.length || 0) + (this._c?.switches.length || 0)) / 2);
    }
    getGridOptions() {
      return { columns: 12, rows: "auto", min_columns: 4 };
    }
    connectedCallback() {
      if ("IntersectionObserver" in window) {
        this._io ||= new IntersectionObserver((es) => {
          this._vis = es[es.length - 1].isIntersecting;
          this._tick();
        }, { rootMargin: "100px" });
        this._io.observe(this);
      } else this._vis = true;
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
        const el = q(`.c-${k}`);
        press(el, { tap: () => k === "start" ? start() : svc(d[3]) });
        return [k, el, d];
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
          const el = document.createElement("div");
          el.className = "pill";
          el.innerHTML = '<span class="i"></span><span class="t"></span>';
          press(el, { tap: () => {
            if (o.tap_action?.action || o.entity || !o.area && !list(o.segments).length) return this._act(o, "tap");
            this._sel.has(i) ? this._sel.delete(i) : this._sel.add(i);
            this._update();
          }, hold: () => this._act(o, "hold") });
          e.rooms.append(el);
          return el;
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
          const el = document.createElement("div");
          el.className = chips ? "pill" : "kv";
          el.innerHTML = chips ? '<span class="i"></span><span class="t"></span>' : '<span class="i"></span><span class="k"></span><span class="v"></span><div class="cbar"><i></i></div>';
          press(el, { tap: () => this._act(o, "tap", true), hold: () => this._act(o, "hold") });
          e.cons.append(el);
          return [el, o];
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
      const c = this._c, rooms = idx.map((i) => c.rooms[i]), ok = hasF(this._st(), VF.AREA);
      const byArea = (o) => ok && o.area;
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
      const tank = (el, x, ok, bad) => {
        let p = 0.55, low = false;
        if (x && NUMRE.test(x.state)) p = Math.max(0, Math.min(100, +x.state)) / 100;
        else if (x && !["unavailable", "unknown"].includes(x.state)) {
          low = dom(x.entity_id) === "binary_sensor" ? x.state === "on" : /low|empty|leer|full|voll|lack|short|knapp|problem/i.test(x.state);
          p = low ? bad : ok;
        }
        el.setAttribute("y", 22 + 30 * (1 - p));
        el.setAttribute("height", 30 * p);
        el.classList.toggle("low", low);
        el.style.opacity = x ? "" : ".35";
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
        this._ctl.forEach(([k, el, d]) => {
          el.hidden = show[k] === false || !hasF(s, d[2]);
          el.classList.toggle("on", k === act && k !== "home" || k === "home" && st === "returning");
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
      const rs = c.room_sensor && h.states[c.room_sensor], cur = rs && !["unknown", "unavailable", ""].includes(rs.state) ? rs.state.toLowerCase() : null;
      if (this._allEl) {
        const as = h.states[c.all];
        this._allEl.classList.toggle("on", isOn(as));
        this._allEl.classList.toggle("na", !as || as.state === "unavailable");
        setIcon(this._allEl.firstChild, c.all_icon || as?.attributes.icon || "mdi:check-all");
        this._allEl.lastChild.textContent = c.all_name ?? "Überall";
      }
      this._rooms?.forEach((el, i) => {
        const o = c.rooms[i], os = o.entity && h.states[o.entity];
        el.classList.toggle("on", this._sel.has(i) || !!os && TOGGLE.includes(dom(o.entity)) && isOn(os));
        el.classList.toggle("cur", !!cur && [o.name, o.area, o.area && h.areas?.[o.area]?.name, ...list(o.segments)].some((x) => x != null && String(x).toLowerCase() === cur));
        el.classList.toggle("na", !!o.entity && (!os || os.state === "unavailable"));
        setIcon(el.firstChild, o.icon || os?.attributes.icon || "mdi:floor-plan");
        el.lastChild.textContent = o.name ?? os?.attributes.friendly_name ?? (list(o.segments).join(", ") || "");
      });
      if (this._go) {
        const n = this._picked().length;
        this._go.hidden = !n;
        this._go.lastChild.textContent = `${n} ${n === 1 ? "Raum" : "Räume"} reinigen`;
      }
      let warn = false;
      this._cons?.forEach(([el, o]) => {
        const cs = h.states[o.entity], n = cs ? parseFloat(cs.state) : NaN;
        const low = o.below != null && !isNaN(n) && n < o.below;
        warn ||= low;
        el.classList.toggle("na", !cs || cs.state === "unavailable");
        el.classList.toggle("warn", low);
        setIcon(el.firstChild, iconOf(h, o, "mdi:wrench-clock"));
        const v = valueOf(h, cs, o);
        if (el.classList.contains("pill")) {
          el.lastChild.textContent = o.name === "" ? v : `${nameOf(h, o)} · ${v}`;
          return;
        }
        el.children[1].textContent = nameOf(h, o);
        el.children[2].textContent = v;
        const mx = o.max ?? ((o.unit ?? cs?.attributes.unit_of_measurement) === "%" ? 100 : null);
        el.lastChild.hidden = !mx || isNaN(n);
        if (mx && !isNaN(n)) el.lastChild.firstChild.style.width = `${Math.max(0, Math.min(100, n / mx * 100))}%`;
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
          const el = document.createElement("div");
          el.className = "pill";
          el.dataset.s = x;
          el.innerHTML = '<span class="i"></span><span class="t"></span>';
          setIcon(el.firstChild, mapIcon(c.fan_speed_icons, x) || "mdi:fan");
          el.lastChild.textContent = fanName(this._h, s, x);
          press(el, { tap: () => this._h.callService("vacuum", "set_fan_speed", { entity_id: c.entity, fan_speed: x }) });
          return el;
        }));
      }
      e.fs.hidden = !fs.length;
      [...e.fs.children].forEach((el) => el.classList.toggle("on", el.dataset.s === a.fan_speed));
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
  define("nova-vacuum-card", NovaVacuumCard, { name: "Nova Saugroboter Card", description: "Saugroboter mit Status, Akku, Start/Pause/Stopp/Zur Station, Saugstärke, Karte daneben, Raumreinigung, Schaltern und Verbrauchsteilen.", documentationURL: docUrl("nova-saugroboter-card") });
  var VMAIN = [
    { name: "entity", required: true, selector: { entity: { domain: ["vacuum"] } } },
    g2({ name: "name", selector: T }, { name: "icon", selector: I, context: { icon_entity: "entity" } }),
    g2({ name: "battery", selector: { entity: { domain: ["sensor"], device_class: "battery" } } }, { name: "battery_low", selector: { number: { min: 0, max: 100, mode: "box", unit_of_measurement: "%" } } }),
    g2({ name: "status", selector: { entity: {} } }, sel("battery_display", [["status", "Im Statustext"], ["chip", "Als Pille rechts"], ["none", "Aus"]])),
    g2({ name: "tap_action", selector: A }, { name: "hold_action", selector: A }),
    g2(sel("controls", [["pills", "Pillen mit Text"], ["round", "Runde Buttons"]]), sel("layout", [["auto", "Automatisch"], ["side", "Karte daneben"], ["stack", "Karte darüber"]])),
    { name: "glow", selector: { boolean: {} } },
    g2({ name: "show_stop", selector: { boolean: {} } }, { name: "show_return", selector: { boolean: {} } }),
    g2({ name: "show_locate", selector: { boolean: {} } }, { name: "show_spot", selector: { boolean: {} } })
  ];
  var VSCN = [
    g2({ name: "scene", selector: { boolean: {} } }, { name: "scene_auto", selector: { boolean: {} } }),
    sel("station_type", [["auto", "Automatisch"], ["dock", "Nur Ladestation"], ["empty", "Absaugstation"], ["wash", "Waschstation (Tanks)"], ["full", "Komplett (Tanks + Staubbeutel)"]]),
    g2({ name: "mop_attached", selector: { entity: {} } }, { name: "mop_mode", selector: { entity: {} } }),
    { name: "mop_states", selector: { text: { multiple: true } } },
    g2({ name: "clean_water", selector: { entity: {} } }, { name: "dirty_water", selector: { entity: {} } }),
    g2({ name: "emptying", selector: { entity: {} } }, { name: "washing", selector: { entity: {} } }),
    g2({ name: "drying", selector: { entity: {} } }, { name: "charging", selector: { entity: {} } }),
    { name: "station", selector: { entity: {} } }
  ];
  var VFAN = [{ name: "show_fan_speed", selector: { boolean: {} } }, { name: "fan_speeds", selector: { text: { multiple: true } } }];
  var VMAP = [
    g2({ name: "map", selector: { entity: { domain: ["camera", "image"] } } }, { name: "map_title", selector: T }),
    g2(
      sel("map_aspect_ratio", [["auto", "Automatisch"], ["1:1", "1:1"], ["4:3", "4:3"], ["16:9", "16:9"], ["3:4", "3:4"]]),
      { name: "map_refresh", selector: { number: { min: 0, max: 60, mode: "box", unit_of_measurement: "s" } } }
    ),
    g2(
      sel("map_action", [["more-info", "Karte groß öffnen"], ["vacuum", "Details des Roboters"], ["none", "Nichts"]]),
      { name: "map_max_height", selector: { number: { min: 0, max: 800, step: 10, mode: "box", unit_of_measurement: "px" } } }
    )
  ];
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
      r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), strip = (c) => {
        Object.entries(VDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        return c;
      };
      const sec = (schema2, title) => {
        if (title) w.append(this._h3(title));
        w.append(this._form(schema2, { ...VDEF, ...c0 }, (v) => this._emit(strip(merge(this._config, names(schema2), v)))));
      };
      sec(VMAIN);
      sec(VFAN, "Saugstärke");
      sec(VMAP, "Karte");
      sec(VSCN, "Animation");
      if (c0.scene !== false && this._hass) {
        const auto = vauto(this._hass, c0.entity), au = Object.entries(auto);
        const ST = { dock: "Nur Ladestation", empty: "Absaugstation", wash: "Waschstation", full: "Komplett" };
        w.append(this._hint(`Station: ${ST[vstation(this._hass, c0.entity, { ...VDEF, ...c0 }, auto)]}` + (au.length && c0.scene_auto !== false ? ` · Automatisch gefunden: ${au.map(([k, v]) => `${VLABELS[k] || k} = ${v}`).join(", ")}` : "")));
      }
      w.append(this._h3("Räume"));
      w.append(this._hint("Je Raum einen HA-Bereich wählen: antippen plant ein, Start reinigt die eingeplanten Räume (vacuum.clean_area). Nichts eingeplant = alles."));
      if (this._items("rooms").length) w.append(this._form(VSEG, { ...VDEF, ...c0 }, (v) => this._emit(strip(merge(this._config, names(VSEG), v)))));
      this._itemList(w, "rooms", VROOM, { item: "Raum", icon: "mdi:floor-plan" }, "Raum hinzufügen", (it) => ({ ...it, ...it.segments != null ? { segments: list(it.segments).join(", ") } : {} }));
      w.append(this._h3("Schalter"));
      w.append(this._hint("z. B. Staubentleerung, Moppwäsche, Mopp-Trocknung – Antippen schaltet bzw. löst aus."));
      if (this._items("switches").length) sec(VSWL);
      this._itemList(w, "switches", VSW, { item: "Schalter", icon: "mdi:toggle-switch-outline" }, "Schalter hinzufügen");
      w.append(this._h3("Infos & Verbrauchsteile"));
      if (this._items("consumables").length) sec(VCONSL);
      this._itemList(w, "consumables", VCONS, { item: "Verbrauchsteil", icon: "mdi:wrench-clock" }, "Verbrauchsteil hinzufügen");
    }
  };
  __publicField(NovaVacuumCardEditor, "labels", VLABELS);
  __publicField(NovaVacuumCardEditor, "helpers", VHELPERS);
  define("nova-vacuum-card-editor", NovaVacuumCardEditor);

  // src/waste.js
  var WCSS = `
.g.ws{gap:10px}
.g.ws.due{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--due) 60%,transparent),0 0 22px color-mix(in srgb,var(--due) 25%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}
.hd.due .ic{background:var(--due);color:#fff;box-shadow:0 0 14px color-mix(in srgb,var(--due) 55%,transparent)}
.rows{display:flex;flex-direction:column;gap:6px}
.wr{--c:var(--nova-waste-color,rgba(255,255,255,.22));display:flex;align-items:center;gap:10px;padding:8px 10px;border-radius:16px;min-width:0;
background:rgba(255,255,255,.05);border:1px solid rgba(255,255,255,.07);transition:background .25s,border-color .25s}
.wr .ic,.cp .ic{background:var(--c);color:#fff;text-shadow:0 1px 2px rgba(0,0,0,.3)}
.wr.today{background:color-mix(in srgb,var(--c) 26%,transparent);border-color:color-mix(in srgb,var(--c) 60%,transparent)}
.wr.today .ic{box-shadow:0 0 14px color-mix(in srgb,var(--c) 60%,transparent)}
.wr.tomorrow{background:color-mix(in srgb,var(--c) 13%,transparent);border-color:color-mix(in srgb,var(--c) 35%,transparent)}
.rel{flex:none;font-size:12px;font-weight:600;padding:4px 10px;border-radius:999px;background:var(--nv-chip);white-space:nowrap}
.today .rel,.cp.today .rel{background:var(--nv-accent);color:var(--nv-accent-fg)}
.tomorrow .rel,.cp.tomorrow .rel{background:color-mix(in srgb,var(--nv-accent) 30%,transparent)}
.wr:active{transform:scale(.98)}
.cp{display:flex;align-items:center;gap:12px;min-width:0}
.cp .ics{display:flex;flex:none}
.cp .ic{--c:var(--nova-waste-color,rgba(255,255,255,.22));width:44px;height:44px;border:2px solid rgba(20,24,38,.6)}
.cp .ic+.ic{margin-left:-14px}
.cp .ic ha-icon{--mdc-icon-size:24px}
.cp .nm b{font-weight:600;font-size:15px}.cp .nm small{font-size:12px;opacity:.65}
.cp.today .ic{box-shadow:0 0 14px color-mix(in srgb,var(--c) 60%,transparent)}
.msg{display:flex;align-items:center;gap:8px;font-size:13px;opacity:.7;padding:4px 2px}
.msg ha-icon{--mdc-icon-size:18px}`;
  var WDEF = { title: "Müllkalender", icon: "mdi:trash-can-outline", layout: "list", count: 5, days: 30, refresh: 60, hide_unmatched: false, show_header: true, glow: true };
  var WTYPES = [
    { match: "Rest", name: "Restmüll", icon: "mdi:trash-can", color: "grey" },
    { match: "Papier, PPK", name: "Papiertonne", icon: "mdi:newspaper-variant-outline", color: "blue" },
    { match: "Gelb, Wertstoff, Verpackung", name: "Gelber Sack", icon: "mdi:recycle", color: "yellow" },
    { match: "Bio", name: "Biotonne", icon: "mdi:leaf", color: "brown" },
    { match: "Glas", name: "Altglas", icon: "mdi:bottle-wine-outline", color: "green" }
  ];
  var DAY = 864e5;
  var ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
  var dayNum = (s) => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / DAY;
  var tzOf = (h) => h.locale?.time_zone === "server" ? h.config?.time_zone : void 0;
  function ymdIn(d, tz) {
    try {
      const p = Object.fromEntries(new Intl.DateTimeFormat("en-CA", { timeZone: tz, year: "numeric", month: "2-digit", day: "2-digit" }).formatToParts(d).map((x) => [x.type, x.value]));
      return `${p.year}-${p.month}-${p.day}`;
    } catch {
      return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`;
    }
  }
  var langOf = (h) => h.locale?.language || h.language || "de";
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
  var colorOf = (v) => {
    if (Array.isArray(v) && v.length >= 3) return `rgb(${v.slice(0, 3).map(Number).join(",")})`;
    if (!v || typeof v !== "string") return "";
    return /^(#|rgb|hsl|var\(|color-mix)/i.test(v) ? v : `var(--${v}-color,${v})`;
  };
  var NovaWasteCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement("nova-waste-card-editor");
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
        refresh: n(c.refresh, WDEF.refresh, 5, 1440),
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
    set hass(h) {
      this._h = h;
      if (!this._c) return;
      if (!this._e) this._build();
      if (!this._fetched) this._load();
      else this._render();
    }
    getCardSize() {
      return this._c?.layout === "compact" ? 1 : 1 + (this._c?.count || 5);
    }
    getGridOptions() {
      return { columns: 6, rows: "auto", min_columns: 3 };
    }
    connectedCallback() {
      clearInterval(this._tm);
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
      const stale = Date.now() - (this._last || 0) >= this._c.refresh * 6e4;
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
      const ok = [], failed = [];
      res.forEach((x, i) => {
        if (x.status === "fulfilled" && Array.isArray(x.value)) ok.push(...x.value.map((ev) => parseEvent(ev, cals[i], tz)).filter(Boolean));
        else {
          failed.push(cals[i]);
          console.warn("[nova-cards] Müllkalender: Termine nicht geladen", cals[i], x.reason);
        }
      });
      this._failed = failed;
      if (failed.length === cals.length) this._err = res[0].reason?.body?.message || res[0].reason?.message || "Verbindung fehlgeschlagen";
      else {
        this._err = null;
        this._events = ok;
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
        out.push({ day, d: day - today, name, icon: rule?.icon || c.icon, color: colorOf(rule?.color), t: ev.sd === day ? ev.t : null, cal: ev.cal });
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
      const next = shown[0], due = next && next.d <= 1 ? next.color || "var(--nv-accent)" : "";
      e.g.classList.toggle("due", !!due && c.glow !== false);
      e.g.style.setProperty("--due", due || "transparent");
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
    _cls(d) {
      return d === 0 ? " today" : d === 1 ? " tomorrow" : "";
    }
    _row(it) {
      const el = document.createElement("div");
      el.className = "wr" + this._cls(it.d);
      if (it.color) el.style.setProperty("--c", it.color);
      el.innerHTML = '<div class="ic"></div><div class="nm"><b></b><small></small></div><span class="rel"></span>';
      setIcon(el.firstChild, it.icon);
      el.querySelector("b").textContent = it.name;
      el.querySelector("small").textContent = this._date(it);
      el.querySelector(".rel").textContent = this._rel(it.d);
      press(el, { tap: () => moreInfo(this, it.cal) });
      return el;
    }
    // Kompakt: nur der nächste Abholtag, mehrere Müllarten an dem Tag nebeneinander
    _compact(shown) {
      const it = shown[0], el = document.createElement("div");
      el.className = "cp" + this._cls(it.d);
      el.innerHTML = '<div class="ics"></div><div class="nm"><b></b><small></small></div><span class="rel"></span>';
      el.firstChild.append(...shown.map((x) => {
        const ic = document.createElement("div");
        ic.className = "ic";
        if (x.color) ic.style.setProperty("--c", x.color);
        setIcon(ic, x.icon);
        return ic;
      }));
      el.querySelector("b").textContent = shown.map((x) => x.name).join(" · ");
      el.querySelector("small").textContent = this._date(it);
      el.querySelector(".rel").textContent = this._rel(it.d);
      press(el, { tap: () => moreInfo(this, it.cal) });
      return el;
    }
  };
  define("nova-waste-card", NovaWasteCard, { name: "Nova Müllkalender Card", description: "Nächste Müllabholungen aus einem oder mehreren Kalendern – mit Müllart, Icon, Farbe, Datum und „heute / morgen / in X Tagen“.", documentationURL: docUrl("nova-müllkalender-card") });
  var WMAIN = [
    { name: "entities", required: true, selector: { entity: { domain: "calendar", multiple: true } } },
    g2({ name: "title", selector: T }, { name: "icon", selector: I }),
    g2(sel("layout", [["list", "Liste"], ["compact", "Kompakt (nur nächster Termin)"]]), { name: "count", selector: { number: { min: 1, max: 20, mode: "box" } } }),
    g2({ name: "days", selector: { number: { min: 1, max: 366, mode: "box", unit_of_measurement: "Tage" } } }, { name: "refresh", selector: { number: { min: 5, max: 1440, mode: "box", unit_of_measurement: "min" } } }),
    g2({ name: "hide_unmatched", selector: { boolean: {} } }, { name: "show_header", selector: { boolean: {} } }),
    { name: "glow", selector: { boolean: {} } }
  ];
  var WTYPE = [
    g2({ name: "match", required: true, selector: T }, { name: "name", selector: T }),
    g2({ name: "icon", selector: I }, { name: "color", selector: { ui_color: {} } })
  ];
  var WLABELS = {
    ...BASE_LABELS,
    entities: "Kalender",
    title: "Überschrift",
    layout: "Darstellung",
    count: "Anzahl Termine",
    days: "Zeitraum",
    refresh: "Aktualisieren alle",
    hide_unmatched: "Termine ohne passende Müllart ausblenden",
    show_header: "Kopfzeile anzeigen",
    glow: "Rahmen leuchtet bei Abholung heute/morgen",
    match: "Stichwort im Termintitel",
    name: "Anzeigename",
    color: "Farbe"
  };
  var WHELPERS = {
    entities: "Ein oder mehrere Kalender, z. B. ein iCal-Abfallkalender",
    count: "Nur bei Darstellung „Liste“",
    days: "So weit im Voraus werden Termine geholt",
    icon: "Leer = Icon der Karte",
    match: "Groß/Klein egal, mehrere mit Komma: Papier, PPK",
    name: "Leer = Termintitel",
    show_header: "Bei „Kompakt“ immer aus"
  };
  var NovaWasteCardEditor = class extends NovaEditorBase {
    _ilabel(it, j) {
      return `${j + 1}. ${it.name || it.match || "Neu: Müllart"}`;
    }
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap");
      const strip = (c) => {
        Object.entries(WDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        delete c.entity;
        return c;
      };
      w.append(this._form(WMAIN, { ...WDEF, ...c0, entities: calsOf(c0) }, (v) => this._emit(strip(merge(this._config, names(WMAIN), v)))));
      w.append(this._h3("Müllarten"));
      w.append(this._hint("Die erste Regel, deren Stichwort im Termintitel vorkommt, bestimmt Name, Icon und Farbe."));
      this._itemList(w, "types", WTYPE, { item: "Müllart", icon: "mdi:trash-can-outline" }, "Müllart hinzufügen");
      if (!this._items("types").length) w.append(this._add("Standard-Müllarten einfügen", () => {
        this._setItems("types", WTYPES.map((t) => ({ ...t })));
        this._rebuild();
      }));
    }
  };
  __publicField(NovaWasteCardEditor, "labels", WLABELS);
  __publicField(NovaWasteCardEditor, "helpers", WHELPERS);
  define("nova-waste-card-editor", NovaWasteCardEditor);

  // src/index.js
  console.info(`%c NOVA-CARDS %c v${"0.10.0"} `, "color:#3a2a00;background:#f5b83d;font-weight:700;border-radius:4px 0 0 4px", "color:#fff;background:#1b2134;border-radius:0 4px 4px 0");
})();
