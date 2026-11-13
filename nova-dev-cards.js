/* Nova Cards v0.12.0 DEV (nur shopping, note, recipe, recipe-book, theme-switch, navi, popup, area) – Testbuild, alle Karten als custom:nova-dev-*. Nicht veröffentlichen. */
(() => {
  var __defProp = Object.defineProperty;
  var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
  var __publicField = (obj, key, value) => __defNormalProp(obj, typeof key !== "symbol" ? key + "" : key, value);

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
    ["accent-ink", "accent-ink-color", "#f5b83d"],
    // Akzent als Schrift- oder Icon-Farbe direkt auf der Fläche (helle Themes: dunkler)
    ["active", "active-color", "#3d8bf5"],
    ["active-fg", "active-text-color", "#fff"],
    ["warn", "warning-color", "#7cc4ff"],
    ["error", "error-color", "#ff6b6b"],
    ["error-fg", "error-text-color", "#fff"],
    // Textfarben im formatierten Text (Notiz, Einkauf): Akzent und Wichtig – folgen den Theme-Farben
    ["text-accent", "text-accent-color", "var(--nv-accent-ink)"],
    ["text-warn", "text-warning-color", "var(--nv-error)"],
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
    // Farbrolle in Gerätezeichnungen (Leuchten auf dunklem Gehäuse) – Standard = die Rolle selbst, ein Theme kann sie aufhellen
    ["a1-dev", "accent-1-device", "var(--nv-a1)"],
    ["a2-dev", "accent-2-device", "var(--nv-a2)"],
    ["a3-dev", "accent-3-device", "var(--nv-a3)"],
    ["a4-dev", "accent-4-device", "var(--nv-a4)"],
    ["neutral-dev", "neutral-device", "var(--nv-neutral)"],
    // Standardfarbe der Kaffeemaschine (nur dort, nicht im Editor wählbar): Kupfer aus Akzent 3, Velvet eigenes Braun
    ["coffee", "coffee-color", "var(--nv-a3)"],
    ["coffee-fg", "coffee-color-text", "var(--nv-a3-fg)"],
    ["coffee-dev", "coffee-color-device", "var(--nv-a3-dev)"],
    // Uhr: Leuchtziffern nach Tageszeit, Radiowecker-Farben
    ["clock-night", "clock-night", "#4d6bff"],
    ["clock-morning", "clock-morning", "#ffb36b"],
    ["clock-noon", "clock-noon", "#f4f7ff"],
    ["led-red", "led-red", "#ff2414"],
    ["led-green", "led-green", "#39ff7a"],
    ["led-blue", "led-blue", "#3fa9ff"],
    ["led-amber", "led-amber", "#ffb000"],
    // Pop-up
    ["area-bg", "area-background", "var(--nv-bg)"],
    // Rahmen der Bereich Card (Midnight: schwarz, Karten darin grau)
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
    // Gefüllte Knöpfe (aktiv, primär): Anteil der Farbe an der Fläche (Rest = Chip-Glas), Anteil der Farbschrift (Rest = --nv-fg),
    // Lichtkante/Rand obendrauf; tint-ink = Anteil der Farbe an farbigen Icons auf Glasknöpfen
    ["fill", "button-fill", "100%"],
    ["fill-ink", "button-fill-text", "100%"],
    ["fill-edge", "button-edge", "0 0 0 transparent"],
    ["tint-ink", "button-tint-text", "100%"],
    // Stärke der Zustandsringe (Warnung, Fehler, aktiv)
    ["text-shadow", "text-shadow", "100%"],
    // Stärke der Schrift-Schatten über Bildern (Raumname, Media-Titel)
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
  var INK = "20,28,45";
  var MOKKA = "74,48,28";
  var THEMES = {
    blau: { name: "Nova Blau", vars: {} },
    hell: { name: "Nova Hell", vars: {
      bg: "linear-gradient(160deg,rgba(236,238,242,.94),rgba(225,228,233,.94))",
      border: `rgba(${INK},.1)`,
      fg: "#0e121a",
      chip: `rgba(${INK},.07)`,
      box: `rgba(${INK},.04)`,
      "box-border": `rgba(${INK},.08)`,
      tint: INK,
      shade: INK,
      scrim: "236,238,242",
      knob: "#fff",
      cut: "rgba(236,238,242,.9)",
      accent: "#f0b02e",
      "accent-fg": "#3a2a00",
      "accent-ink": "#8a5a00",
      active: "#1a66cc",
      "active-fg": "#fff",
      warn: "#0f65b8",
      error: "#c62f2f",
      "error-fg": "#fff",
      a1: "#1a66cc",
      a2: "#f0b02e",
      "a2-fg": "#3a2a00",
      a3: "#9a5f33",
      a4: "#2a7a46",
      neutral: "#5b6673",
      "clock-night": "#2f4fd6",
      "clock-morning": "#c4621a",
      "clock-noon": "#0e121a",
      "popup-bg": "linear-gradient(160deg,rgba(243,245,248,.97),rgba(232,235,240,.97))",
      "popup-base": "rgba(236,239,243,.97)",
      "popup-head": "rgba(226,230,236,.97)",
      "popup-backdrop": "rgba(30,38,55,.28)",
      "navi-popup-bg": "linear-gradient(160deg,rgba(243,245,248,.97),rgba(232,235,240,.97))",
      shadow: `0 1px 2px rgba(${INK},.06),0 6px 18px rgba(${INK},.08)`,
      edge: "inset 0 1px 0 rgba(255,255,255,.7)",
      "shadow-popup": `0 20px 60px rgba(${INK},.2)`,
      "shadow-knob": `0 1px 4px rgba(${INK},.3)`,
      glow: "0%",
      "text-shadow": "0%",
      blur: "12px",
      sat: "120%",
      "sat-2": "120%"
    }, navi: { border: `rgba(${INK},.12)`, chip: `rgba(${INK},.06)`, blur: "14px", warn: "#8a5a00" } },
    midnight: { name: "Nova Midnight", vars: {
      // Wie der Dark Mode von Apple: Seite schwarz, Karten #1c1c1e, Kacheln #2c2c2e, feine Linien, kein Glow, kein Blur.
      // Aktive Knöpfe sind getöntes Glas (Farbe 22 % über der Kachel, Rand und Lichtkante), Schrift darauf hell.
      bg: "#1c1c1e",
      border: "rgba(255,255,255,.06)",
      fg: "#e5e5ea",
      chip: "#2c2c2e",
      box: "#2c2c2e",
      "box-border": "rgba(255,255,255,.06)",
      knob: "#e5e5ea",
      cut: "rgba(28,28,30,.85)",
      accent: "#b08d57",
      "accent-fg": "#121214",
      "accent-ink": "#b08d57",
      active: "#6b8db5",
      "active-fg": "#121214",
      warn: "#7fa6c9",
      error: "#c86a6a",
      "error-fg": "#121214",
      a1: "#6b8db5",
      "a1-fg": "#121214",
      a2: "#b08d57",
      "a2-fg": "#121214",
      a3: "#ad805c",
      "a3-fg": "#121214",
      a4: "#5f9a72",
      "a4-fg": "#121214",
      neutral: "#8a929c",
      "neutral-fg": "#121214",
      "clock-night": "#5a6fb8",
      "clock-morning": "#c98a4e",
      "clock-noon": "#c7ccd6",
      "area-bg": "#000",
      "popup-bg": "#000",
      "popup-base": "#1c1c1e",
      "popup-head": "#2c2c2e",
      "popup-backdrop": "rgba(0,0,0,.72)",
      "navi-popup-bg": "#1c1c1e",
      shadow: "0 0 0 transparent",
      edge: "inset 0 1px 0 rgba(255,255,255,.05)",
      "shadow-popup": "0 0 0 1px rgba(255,255,255,.08)",
      glow: "0%",
      ring: "70%",
      blur: "0px",
      sat: "100%",
      "sat-2": "100%",
      fill: "22%",
      "fill-ink": "0%",
      "tint-ink": "0%",
      "fill-edge": "inset 0 1px 0 rgba(255,255,255,.12),inset 0 0 0 1px rgba(255,255,255,.1)"
    }, navi: { border: "rgba(255,255,255,.08)", chip: "#2c2c2e", blur: "0px", warn: "#b08d57" } },
    velvet: { name: "Nova Velvet", vars: {
      // Warm und edel: cremiges Beige, Espresso-Schrift, Gold und Cognac, weiche warme Schatten statt Glow
      bg: `linear-gradient(160deg,rgba(239,230,214,.94),rgba(230,218,198,.94))`,
      border: "rgba(90,62,40,.14)",
      fg: "#1a0f09",
      chip: `rgba(${MOKKA},.08)`,
      box: `rgba(${MOKKA},.05)`,
      "box-border": `rgba(${MOKKA},.1)`,
      tint: MOKKA,
      shade: MOKKA,
      scrim: "239,230,214",
      knob: "#fbf6ec",
      cut: "rgba(239,230,214,.9)",
      accent: "#b8935a",
      "accent-fg": "#1a0f09",
      "accent-ink": "#7a5a1e",
      active: "#7d4f24",
      "active-fg": "#fbf6ec",
      warn: "#7a4f00",
      error: "#a3322b",
      "error-fg": "#fbf6ec",
      a1: "#4a3226",
      "a1-fg": "#fbf6ec",
      "a1-dev": "#b8935a",
      // Espresso auf der Fläche, Gold auf den Geräten
      a2: "#b8935a",
      "a2-fg": "#1a0f09",
      a3: "#7a2f3a",
      "a3-fg": "#fbf6ec",
      coffee: "#8a5a33",
      "coffee-fg": "#fbf6ec",
      "coffee-dev": "#b07a48",
      // Kaffee warmes Braun statt Bordeaux
      a4: "#4f5f2a",
      "a4-fg": "#fbf6ec",
      neutral: "#62554c",
      "neutral-fg": "#fbf6ec",
      "clock-night": "#6b3a2a",
      "clock-morning": "#9a5a1e",
      "clock-noon": "#1a0f09",
      "popup-bg": "linear-gradient(160deg,rgba(243,236,223,.97),rgba(233,223,205,.97))",
      "popup-base": "rgba(243,236,223,.97)",
      "popup-head": "rgba(233,223,205,.97)",
      "popup-backdrop": "rgba(40,26,16,.32)",
      "navi-popup-bg": "linear-gradient(160deg,rgba(243,236,223,.97),rgba(233,223,205,.97))",
      shadow: `0 1px 2px rgba(${MOKKA},.08),0 8px 22px rgba(${MOKKA},.12)`,
      edge: "inset 0 1px 0 rgba(255,255,255,.6)",
      "shadow-popup": `0 20px 60px rgba(${MOKKA},.22)`,
      "shadow-knob": `0 1px 4px rgba(${MOKKA},.35)`,
      glow: "0%",
      "text-shadow": "0%",
      blur: "12px",
      sat: "115%",
      "sat-2": "115%"
    }, navi: { border: "rgba(90,62,40,.16)", chip: `rgba(${MOKKA},.06)`, blur: "14px", warn: "#7a5a1e" } }
  };
  var THEME_KEYS = Object.keys(THEMES);
  var NAVI = { border: "rgba(255,255,255,.16)", chip: "rgba(255,255,255,.1)", blur: "22px", warn: "#f5b83d" };
  var block = (sel2, over) => `${sel2}{${TOKENS.filter(([k]) => !over || k in over).map(([k, pub, v]) => `--nv-${k}:var(--nova-${pub},${over?.[k] ?? v})`).join(";")}}`;
  var themed = (navi) => Object.entries(THEMES).filter(([, t]) => Object.keys(t.vars).length).map(([k, t]) => block(`:host([nova-theme=${k}])`, navi ? { ...t.vars, ...t.navi } : t.vars)).join("");
  var NOVA_VARS = block(":host") + themed(false);
  var NAVI_VARS = block(":host", { ...Object.fromEntries(TOKENS.map(([k, , v]) => [k, v])), ...NAVI }) + themed(true);

  // src/shared/nova-store.js
  var subs = /* @__PURE__ */ new WeakMap();
  var STOP_DELAY = 5e3;
  var reason = (err) => err?.code === "unknown_command" || err?.code === "not_ready" ? "missing" : err?.code === "module_disabled" ? "disabled" : "failed";
  var MODULE_NAMES = { notes: "Notizen", shopping: "Einkauf", recipes: "Rezeptbuch", theme: "Theme" };
  var storeHint = (err, kind) => err === "missing" ? ["mdi:puzzle-plus-outline", "Die Nova-Integration fehlt. Im Marketplace „Nova“ installieren und unter Einstellungen → Geräte & Dienste hinzufügen."] : err === "disabled" ? ["mdi:toggle-switch-off-outline", `Das Modul „${MODULE_NAMES[kind] || kind}“ ist in den Optionen der Nova-Integration abgeschaltet.`] : ["mdi:alert-circle-outline", "Die Daten konnten nicht geladen werden."];
  function watch(hass, kind, card, onChange) {
    const conn = hass?.connection;
    if (!conn) return () => {
    };
    const all = subs.get(conn) || subs.set(conn, {}).get(conn);
    const s = all[kind] ||= { data: null, err: null, cards: /* @__PURE__ */ new Map(), unsub: null };
    clearTimeout(s.timer);
    s.cards.set(card, onChange);
    if (s.data || s.err) queueMicrotask(() => s.cards.get(card)?.(s.data, s.err));
    if (!s.unsub) {
      s.unsub = conn.subscribeMessage((d) => {
        s.data = d;
        s.err = null;
        s.cards.forEach((fn) => fn(d, null));
      }, { type: `nova/${kind}/subscribe` }).catch((err) => {
        s.err = reason(err);
        s.unsub = null;
        if (s.err !== "missing") console.warn(`[nova-cards] Nova-Integration: Abo ${kind} fehlgeschlagen`, err);
        s.cards.forEach((fn) => fn(s.data, s.err));
        return null;
      });
    }
    return () => {
      s.cards.delete(card);
      if (s.cards.size) return;
      clearTimeout(s.timer);
      s.timer = setTimeout(() => {
        if (s.cards.size) return;
        const u = s.unsub;
        s.unsub = null;
        s.data = null;
        s.err = null;
        u?.then((f) => typeof f === "function" && f()).catch(() => {
        });
      }, STOP_DELAY);
    };
  }
  var ws = (hass, type, data = {}) => hass.callWS({ type, ...data });
  var notes = {
    save: (hass, note) => ws(hass, "nova/notes/save", { note }).then((r) => r.note),
    remove: (hass, id) => ws(hass, "nova/notes/delete", { note_id: id })
  };
  var shop = {
    save: (hass, item) => ws(hass, "nova/shopping/item_save", { item }).then((r) => r.item),
    remove: (hass, id) => ws(hass, "nova/shopping/item_delete", { item_id: id }),
    clearDone: (hass) => ws(hass, "nova/shopping/clear_done"),
    reorder: (hass, ids) => ws(hass, "nova/shopping/reorder", { ids }),
    forget: (hass, key) => ws(hass, "nova/shopping/history_delete", { key }),
    saveStore: (hass, store) => ws(hass, "nova/shopping/store_save", { store }).then((r) => r.store),
    removeStore: (hass, id) => ws(hass, "nova/shopping/store_delete", { store_id: id }),
    setSync: (hass, entityId) => ws(hass, "nova/shopping/set_sync", { entity_id: entityId || null })
  };
  var recipes = {
    save: (hass, recipe) => ws(hass, "nova/recipes/save", { recipe }).then((r) => r.recipe),
    remove: (hass, id) => ws(hass, "nova/recipes/delete", { recipe_id: id }),
    // Zutaten auf die Einkaufsliste; servings rechnet um, only = Positionen der Zutaten
    toShopping: (hass, id, servings, only) => ws(hass, "nova/recipes/to_shopping", { recipe_id: id, ...servings ? { servings } : {}, ...only ? { only } : {} }).then((r) => r.added)
  };
  var theme = { set: (hass, key) => ws(hass, "nova/theme/set", { theme: key }) };
  var uploadImage = (hass, module, data) => ws(hass, "nova/image/upload", { module, data });
  var imageUrl = (hass, module, name) => {
    if (!name || !/^[a-f0-9]{32}\.(webp|jpg|png)$/.test(name)) return "";
    const path = `/local/nova/${module}/${name}`;
    return hass?.hassUrl ? hass.hassUrl(path) : path;
  };

  // src/shared/theme-store.js
  var live = /* @__PURE__ */ new WeakMap();
  var THEME_EVENT = "nova-theme-store";
  function integration(h) {
    const conn = h?.connection;
    if (!conn?.subscribeMessage) return null;
    let s = live.get(conn);
    if (!s) {
      live.set(conn, s = { key: void 0, ok: false });
      conn.subscribeMessage((m) => {
        s.ok = true;
        s.key = THEMES[m?.theme] ? m.theme : void 0;
        window.dispatchEvent(new CustomEvent(THEME_EVENT));
      }, { type: "nova/theme/subscribe" }).catch(() => {
      });
    }
    return s;
  }
  var STORE_ENTITY = "input_select.nova_theme";
  var ID = "nova_theme";
  var NAME = "Nova Theme";
  var ICON = "mdi:palette-outline";
  var options = () => THEME_KEYS.map((k) => THEMES[k].name);
  var keyOf = (v) => THEME_KEYS.find((k) => THEMES[k].name === v || k === v);
  var storeIds = () => [STORE_ENTITY];
  var readTheme = (h) => {
    const s = integration(h);
    return s?.ok && s.key || keyOf(h?.states?.[STORE_ENTITY]?.state);
  };
  var hasStore = (h) => !!integration(h)?.ok || !!h?.states?.[STORE_ENTITY];
  var canSetup = (h) => !!integration(h)?.ok || !!h?.user?.is_admin;
  var fail = (code, msg) => Object.assign(new Error(msg), { code });
  async function setup(h) {
    if (!canSetup(h)) throw fail("admin", "Das Theme kann erst ein Administrator einrichten.");
    const items = await h.callWS({ type: "input_select/list" }).catch(() => []);
    const it = items.find((i) => i.id === ID);
    if (!it) await h.callWS({ type: "input_select/create", name: NAME, icon: ICON, options: options() });
    else await h.callWS({
      type: "input_select/update",
      input_select_id: ID,
      name: it.name || NAME,
      icon: it.icon || ICON,
      options: [.../* @__PURE__ */ new Set([...it.options || [], ...options()])]
    });
  }
  async function setTheme(h, key) {
    const name = THEMES[key]?.name;
    if (!name) throw fail("failed", `Unbekanntes Theme: ${key}`);
    if (integration(h)?.ok) {
      try {
        await theme.set(h, key);
        return;
      } catch (e) {
        throw fail("failed", e?.message || "Theme konnte nicht gespeichert werden.");
      }
    }
    const st = h.states[STORE_ENTITY];
    if (!st || !st.attributes.options?.includes(name)) await setup(h);
    try {
      await h.callService("input_select", "select_option", { option: name }, { entity_id: STORE_ENTITY });
    } catch (e) {
      throw fail("failed", e?.message || "Theme konnte nicht gespeichert werden.");
    }
  }

  // src/shared/theme-apply.js
  var cards = /* @__PURE__ */ new Set();
  window.addEventListener(THEME_EVENT, () => cards.forEach(apply));
  var valid = (v) => {
    const k = String(v || "").trim().toLowerCase();
    return k && k !== "global" && THEMES[k] ? k : void 0;
  };
  function apply(el2) {
    const own = valid(el2._nvTheme);
    if (own) el2.style.setProperty("--nova-theme", own);
    else el2.style.removeProperty("--nova-theme");
    const t = own || el2._nvInh || readTheme(el2._nvHass) || "blau";
    if (t === "blau") {
      if (el2.hasAttribute("nova-theme")) el2.removeAttribute("nova-theme");
    } else if (el2.getAttribute("nova-theme") !== t) el2.setAttribute("nova-theme", t);
  }
  function inherit(el2) {
    cancelAnimationFrame(el2._nvRaf);
    el2._nvRaf = requestAnimationFrame(() => {
      const p = el2.parentElement || el2.getRootNode?.().host;
      el2._nvInh = p && el2.isConnected ? valid(getComputedStyle(p).getPropertyValue("--nova-theme")) : void 0;
      apply(el2);
    });
  }
  function themeable(cls) {
    const p = cls.prototype;
    if (p._nvThemed) return;
    p._nvThemed = true;
    const sc = p.setConfig;
    if (sc) p.setConfig = function(c) {
      this._nvTheme = c?.theme;
      apply(this);
      return sc.call(this, c);
    };
    const hd = Object.getOwnPropertyDescriptor(p, "hass");
    if (hd?.set) Object.defineProperty(p, "hass", { ...hd, set(h) {
      const o = this._nvHass;
      this._nvHass = h;
      if (o?.states?.[STORE_ENTITY] !== h?.states?.[STORE_ENTITY]) apply(this);
      if (o && (o.themes !== h?.themes || o.selectedTheme !== h?.selectedTheme)) inherit(this);
      hd.set.call(this, h);
    } });
    const cc = p.connectedCallback;
    p.connectedCallback = function() {
      cards.add(this);
      inherit(this);
      return cc?.call(this);
    };
    const dc = p.disconnectedCallback;
    p.disconnectedCallback = function() {
      cards.delete(this);
      return dc?.call(this);
    };
  }

  // src/shared/define.js
  var DEV = true;
  var tag = (name) => `${DEV ? "nova-dev-" : "nova-"}${name}`;
  var define = (name, cls, meta) => {
    const t = tag(name);
    if (meta) themeable(cls);
    if (!customElements.get(t)) customElements.define(t, cls);
    if (meta) {
      window.customCards = window.customCards || [];
      if (DEV) meta = { ...meta, name: `${meta.name} (Dev)` };
      if (!window.customCards.some((c) => c.type === t)) window.customCards.push({ type: t, preview: true, ...meta });
    }
  };
  var REPO = "https://github.com/Blackstar9119/nova-cards";
  var docUrl = (anchor2) => `${REPO}#${anchor2}`;

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
  var ROLES = { neutral: "neutral", "accent-1": "a1", "accent-2": "a2", "accent-3": "a3", "accent-4": "a4", coffee: "coffee" };
  var roleVars = (r) => {
    const k = ROLES[r] || ROLES.neutral;
    return { c: `var(--nv-${k})`, fg: `var(--nv-${k}-fg)`, dev: `var(--nv-${k}-dev)` };
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
.on>.ic{background:color-mix(in srgb,var(--nv-accent) var(--nv-fill),var(--nv-chip));color:color-mix(in srgb,var(--nv-accent-fg) var(--nv-fill-ink),var(--nv-fg));box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--nv-accent) 55%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
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
.pill.on{background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));color:color-mix(in srgb,var(--nv-active-fg) var(--nv-fill-ink),var(--nv-fg));border-color:transparent;box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
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
  var FIELD_CSS = `
.fld{box-sizing:border-box;width:100%;min-width:0;margin:0;border:1px solid var(--nv-box-border);background:var(--nv-box);color:var(--nv-fg);
font:inherit;font-size:var(--nv-fs-10);outline:none;-webkit-appearance:none;appearance:none;transition:border-color var(--nv-d2),box-shadow var(--nv-d2),background-color var(--nv-d2)}
.fld::placeholder{color:var(--nv-fg);opacity:.45}
.fld:focus{border-color:color-mix(in srgb,var(--nv-active) 75%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 22%,transparent) var(--nv-glow),transparent);background:color-mix(in srgb,var(--nv-box) 70%,rgba(var(--nv-tint),.06))}`;

  // src/shared/lifecycle.js
  var GLOBAL = ["entities", "devices", "areas", "floors", "localize", "locale", "language", "themes", "selectedTheme", "config", "user", "connected"];
  var ID2 = /^[a-z_]+\.[a-z0-9_]+$/;
  var entityIds = (o, out = /* @__PURE__ */ new Set()) => {
    if (typeof o === "string") {
      if (ID2.test(o)) out.add(o);
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
  var weakDevice = () => {
    const n = globalThis.navigator || {}, mem = n.deviceMemory, cpu = n.hardwareConcurrency;
    if (mem && mem <= 2) return true;
    if (cpu && cpu <= 2) return true;
    return /Android/.test(n.userAgent || "") && /; wv\)/.test(n.userAgent || "") && (!cpu || cpu <= 4);
  };

  // src/shared/state.js
  var OFF = /* @__PURE__ */ new Set(["off", "unavailable", "unknown", "idle", "docked", "standby", "closed", "paused", "not_home", "none", "ready"]);
  var isOn = (s) => !!s && !OFF.has(s.state);
  var DICON = { light: "mdi:lightbulb", switch: "mdi:power-socket-eu", fan: "mdi:fan", input_boolean: "mdi:toggle-switch-outline", button: "mdi:gesture-tap-button", input_button: "mdi:gesture-tap-button", script: "mdi:script-text-outline", scene: "mdi:palette", automation: "mdi:robot", climate: "mdi:thermostat", cover: "mdi:window-shutter", media_player: "mdi:speaker", number: "mdi:ray-vertex", input_number: "mdi:ray-vertex", select: "mdi:format-list-bulleted", binary_sensor: "mdi:checkbox-blank-circle-outline", sensor: "mdi:eye" };
  var fmtState = (h, s) => {
    try {
      if (h.formatEntityState) return h.formatEntityState(s);
      const u = s.attributes.unit_of_measurement;
      return NUMRE.test(s.state) ? haUnitJoin(h, fmtNum(h, s.state), u) : s.state + (u ? " " + u : "");
    } catch {
      return s.state;
    }
  };
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
  var DUR_U = { ms: 1e-3, s: 1, min: 60, h: 3600, d: 86400 };
  var clockOf = (sec) => {
    const t = Math.max(0, Math.round(sec)), hh = Math.floor(t / 3600), m = Math.floor(t % 3600 / 60), ss = String(t % 60).padStart(2, "0");
    return hh ? `${hh}:${String(m).padStart(2, "0")}:${ss}` : `${m}:${ss}`;
  };
  var NUM_LOCALE = { comma_decimal: "en-US", decimal_comma: "de", space_comma: "fr", system: void 0 };
  var fmtNum = (h, v, d) => {
    const n = +v, dd = d ?? decOf(v), f = h?.locale?.number_format;
    if (f === "none") return n.toFixed(dd);
    const loc = f && f in NUM_LOCALE ? NUM_LOCALE[f] : h?.locale?.language || h?.language;
    try {
      return new Intl.NumberFormat(loc, { minimumFractionDigits: dd, maximumFractionDigits: dd }).format(n);
    } catch {
      return n.toFixed(dd);
    }
  };
  var PCT_BLANK = ["cs", "de", "fi", "fr", "sk", "sv"];
  var haUnitJoin = (h, v, u) => {
    if (!u) return `${v}`;
    if (u === "°") return `${v}${u}`;
    if (u === "%") return PCT_BLANK.includes(String(h?.locale?.language || h?.language || "").split("-")[0]) ? `${v} %` : `${v}%`;
    return `${v} ${u}`;
  };
  function valueOf(h, s, o) {
    if (!s) return "–";
    if (o.format === "clock" && NUMRE.test(s.state)) return clockOf(+s.state * (DUR_U[o.unit ?? s.attributes.unit_of_measurement] ?? 1));
    if ((o.decimals != null || o.unit != null) && NUMRE.test(s.state)) {
      const n = fmtNum(h, s.state, o.decimals != null ? +o.decimals : void 0);
      return haUnitJoin(h, n, o.unit ?? s.attributes.unit_of_measurement);
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

  // src/shared/editor-base.js
  var THEME_FIELD = [sel("theme", [["global", "Global (wie alle Nova Cards)"], ...THEME_KEYS.map((k) => [k, THEMES[k].name])])];
  var COMMON_LABELS = { theme: "Theme dieser Karte" };
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
        this._themeSection();
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
        f2.computeLabel = (s) => this.constructor.labels?.[s.name] ?? COMMON_LABELS[s.name] ?? s.name;
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
    // Bereich „Theme“ am Ende jedes Karteneditors (abschalten mit static noTheme)
    _themeSection() {
      const w = !this.constructor.noTheme && this.shadowRoot.querySelector(".wrap");
      if (!w) return;
      w.append(this._section("theme", "mdi:palette-outline", "Theme", (b) => {
        b.append(this._hint("Global folgt dem Theme, das du mit dem Nova Themes Schalter für alle Geräte wählst. Ein festes Theme gilt nur für diese Karte (und Karten darin)."));
        b.append(this._form(THEME_FIELD, { theme: this._config.theme || "global" }, (v) => {
          const c = { ...this._config };
          if (!v.theme || v.theme === "global") delete c.theme;
          else c.theme = v.theme;
          this._emit(c);
        }));
      }));
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

  // src/shared/print-button.js
  var PRINT_CSS = `
.pb{--ok:var(--nova-success-color,var(--nv-a4));display:inline-flex;align-items:center;justify-content:center;gap:var(--nv-s4);flex:none;box-sizing:border-box;
height:44px;min-width:44px;padding:0;border-radius:var(--nv-r-pill);border:1px solid var(--nv-box-border);background:var(--nv-chip);color:inherit;
font:inherit;font-size:var(--nv-fs-7);font-weight:var(--nv-fw-medium);cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent;user-select:none;
transition:background-color var(--nv-d3),color var(--nv-d3),border-color var(--nv-d3),box-shadow var(--nv-d3),transform var(--nv-d2),opacity var(--nv-d3)}
.pb.pill{flex:1 1 auto;padding:0 18px;min-width:0}
.pb .pl{white-space:nowrap;overflow:hidden}
.pb ha-icon{--mdc-icon-size:22px;display:flex}
.pb:focus-visible{box-shadow:var(--nv-focus)}
.pb:active:not([disabled]){transform:scale(.94)}
.pb[disabled]{opacity:.4;cursor:default}
.pb.busy{pointer-events:none}
.pb.busy ha-icon{animation:pb-spin 1s linear infinite}
.pb.ok{border-color:color-mix(in srgb,var(--ok) 70%,transparent);background:color-mix(in srgb,var(--ok) 26%,transparent);
box-shadow:0 0 16px color-mix(in srgb,color-mix(in srgb,var(--ok) 45%,transparent) var(--nv-glow),transparent);opacity:1}
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
    let ok = true;
    try {
      await fn();
    } catch (e) {
      ok = false;
      console.warn("[nova-cards] Aktion fehlgeschlagen", key, e);
    }
    set(ok ? "ok" : "err");
    t[key] = setTimeout(() => set("idle"), FEEDBACK);
    return ok;
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

  // src/shared/rich-text.js
  var TAGS = {
    B: "b",
    STRONG: "b",
    I: "i",
    EM: "i",
    U: "u",
    S: "s",
    STRIKE: "s",
    DEL: "s",
    BR: "br",
    P: "p",
    DIV: "p",
    H3: "h3",
    UL: "ul",
    OL: "ul",
    LI: "li",
    SPAN: "span"
  };
  var ALLOW = { span: ["fs-s", "fs-l", "c-accent", "c-warn", "c-muted"], ul: ["check"], li: ["done"] };
  var DROP = /* @__PURE__ */ new Set(["SCRIPT", "STYLE", "IFRAME", "OBJECT", "EMBED", "TEMPLATE", "SVG", "MATH", "NOSCRIPT", "TEXTAREA", "SELECT", "HEAD", "TITLE"]);
  function sanitize(html) {
    if (!html) return "";
    const t = document.createElement("template");
    t.innerHTML = String(html);
    const walk = (node) => [...node.childNodes].map((n) => {
      if (n.nodeType === 3) return esc(n.data).replace(/&#39;/g, "'").replace(/&quot;/g, '"');
      if (n.nodeType !== 1 || DROP.has(n.nodeName)) return "";
      const name = TAGS[n.nodeName], inner = walk(n.content || n);
      if (name === "br") return "<br>";
      if (!name) return inner;
      const cls = [...new Set((n.getAttribute("class") || "").split(/\s+/).filter((c) => ALLOW[name]?.includes(c)))];
      if (name === "span" && !cls.length) return inner;
      return `<${name}${cls.length ? ` class="${cls.join(" ")}"` : ""}>${inner}</${name}>`;
    }).join("");
    return walk(t.content).replace(/<p>(<ul[^>]*>)/g, "$1").replace(/<\/ul><\/p>/g, "</ul>").replace(/<p><\/p>/g, "").replace(/^(<br>)+|(<br>)+$/g, "");
  }
  var isEmpty = (html) => !String(html || "").replace(/<[^>]*>/g, "").replace(/&nbsp;| |​/g, "").trim();
  function toPlain(html) {
    const t = document.createElement("template");
    t.innerHTML = sanitize(html);
    const out = [];
    let line = "";
    const flush = () => {
      out.push(line.replace(/\s+$/, ""));
      line = "";
    };
    const walk = (node, pre = "") => node.childNodes.forEach((n) => {
      if (n.nodeType === 3) {
        line += n.data.replace(/ /g, " ");
        return;
      }
      const tag2 = n.nodeName;
      if (tag2 === "BR") {
        flush();
        line = pre ? " ".repeat(pre.length) : "";
        return;
      }
      if (tag2 === "LI") {
        if (line.trim()) flush();
        const chk = n.parentNode?.classList?.contains("check");
        line = chk ? n.classList.contains("done") ? "[x] " : "[ ] " : "• ";
        walk(n, line);
        flush();
        return;
      }
      if (tag2 === "H3") {
        if (line.trim()) flush();
        line = "";
        const s = out.length;
        walk(n);
        flush();
        out[s] = (out[s] || "").toUpperCase();
        return;
      }
      if (tag2 === "P" || tag2 === "UL") {
        if (line.trim()) flush();
        walk(n, pre);
        if (line.trim() || tag2 === "P") flush();
        return;
      }
      walk(n, pre);
    });
    walk(t.content);
    if (line) flush();
    return out.join("\n").replace(/\n{3,}/g, "\n\n").trim();
  }
  var firstLine = (html) => toPlain(html).split("\n").map((s) => s.replace(/^(\[.?\]|•)\s*/, "").trim()).find(Boolean) || "";
  var RICH_CSS = `
.rt{line-height:1.5;overflow-wrap:anywhere;font-size:var(--nv-fs-9)}
.rt p,.rt h3,.rt ul{margin:0}
.rt h3{font-size:var(--nv-fs-10);font-weight:var(--nv-fw-heavy);letter-spacing:.01em;margin:var(--nv-s2) 0}
.rt .fs-s{font-size:var(--nv-fs-4)}.rt .fs-l{font-size:var(--nv-fd-1);line-height:1.25}
.rt .c-accent{color:var(--nv-text-accent)}.rt .c-warn{color:var(--nv-text-warn)}.rt .c-muted{opacity:.55}
.rt ul{padding-left:1.3em}
.rt ul.check{list-style:none;padding-left:0}
.rt ul.check li{position:relative;padding-left:30px;min-height:24px;transition:opacity var(--nv-d3)}
.rt ul.check li::before{content:'';position:absolute;left:0;top:.15em;width:18px;height:18px;border-radius:6px;box-sizing:border-box;
border:2px solid rgba(var(--nv-tint),.45);transition:background-color var(--nv-d3),border-color var(--nv-d3),box-shadow var(--nv-d3);cursor:pointer}
.rt ul.check li::after{content:'';position:absolute;left:6px;top:calc(.15em + 3px);width:5px;height:9px;border:solid var(--nv-active-fg);border-width:0 2.5px 2.5px 0;
transform:rotate(45deg) scale(0);transition:transform var(--nv-d3) var(--nv-ease);pointer-events:none}
.rt ul.check li.done::before{background:var(--nv-active);border-color:var(--nv-active);box-shadow:0 0 10px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent)}
.rt ul.check li.done::after{transform:rotate(45deg) scale(1)}
.rt ul.check li.done{text-decoration:line-through;opacity:.55}
.rte{outline:none;min-height:3em;cursor:text;-webkit-user-select:text;user-select:text}
.rte:empty::before{content:attr(data-ph);opacity:.45;pointer-events:none}
.tb{display:flex;gap:var(--nv-s1);align-items:center;padding:var(--nv-s2);border-radius:var(--nv-r-md);background:rgba(var(--nv-tint),.06);border:1px solid rgba(var(--nv-tint),.08);flex:none;
overflow-x:auto;scrollbar-width:none;overscroll-behavior-x:contain}
.tb::-webkit-scrollbar{display:none}
.tb.fade{-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 28px),transparent)}
.tb .sep{width:1px;flex:none;align-self:stretch;margin:var(--nv-s2) var(--nv-s1);background:rgba(var(--nv-tint),.14)}
.tb button{width:44px;height:44px;flex:none;border-radius:var(--nv-r-sm);border:0;background:transparent;color:inherit;display:flex;align-items:center;justify-content:center;
cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent;transition:background-color var(--nv-d2),color var(--nv-d2),transform var(--nv-d2)}
.tb button ha-icon{--mdc-icon-size:22px}
.tb button:active{transform:scale(var(--nv-press))}
.tb button.on{background:color-mix(in srgb,var(--nv-active) 28%,transparent);color:var(--nv-fg)}
.tb button:focus-visible{box-shadow:var(--nv-focus);outline:none}
.tb .dot{width:20px;height:20px;border-radius:50%;border:2px solid rgba(var(--nv-tint),.35);box-sizing:border-box}
.tb .dot.c-accent{background:var(--nv-text-accent)}.tb .dot.c-warn{background:var(--nv-text-warn)}.tb .dot.c-muted{background:rgba(var(--nv-tint),.35)}
.tb .dot.c-none{background:var(--nv-fg)}
@media (prefers-reduced-motion:reduce){.rt ul.check li,.rt ul.check li::before,.rt ul.check li::after{transition:none}}`;
  var SIZES = [["fs-s", "mdi:format-font-size-decrease", "Klein"], ["", "mdi:format-text", "Normal"], ["fs-l", "mdi:format-font-size-increase", "Groß"], ["h3", "mdi:format-header-1", "Überschrift"]];
  var COLORS = [["c-accent", "Akzent"], ["c-warn", "Wichtig"], ["c-muted", "Gedämpft"], ["", "Normal"]];
  function getRange(root) {
    try {
      if (root.getSelection) {
        const x = root.getSelection();
        return x?.rangeCount ? x.getRangeAt(0) : null;
      }
      const s = document.getSelection();
      if (s?.getComposedRanges) {
        let st;
        try {
          st = s.getComposedRanges({ shadowRoots: [root] })[0];
        } catch {
          st = s.getComposedRanges(root)[0];
        }
        if (!st) return null;
        const r = document.createRange();
        r.setStart(st.startContainer, st.startOffset);
        r.setEnd(st.endContainer, st.endOffset);
        return r;
      }
      return s?.rangeCount ? s.getRangeAt(0) : null;
    } catch {
      return null;
    }
  }
  var anchor = (root) => getRange(root)?.startContainer;
  var within = (rte, n) => n && (n === rte || rte.contains(n));
  var closest = (n, s, stop) => {
    for (let x = n?.nodeType === 1 ? n : n?.parentElement; x && x !== stop; x = x.parentElement) if (x.matches(s)) return x;
    return null;
  };
  function wrap(rte, root, group, cls) {
    const r = getRange(root);
    if (!r || !within(rte, r.commonAncestorContainer)) return;
    if (r.collapsed) {
      const n = r.startContainer;
      if (n.nodeType !== 3) return;
      const t = n.data, i = r.startOffset;
      let a = i, b = i;
      while (a > 0 && /\S/.test(t[a - 1])) a--;
      while (b < t.length && /\S/.test(t[b])) b++;
      if (a === b) return;
      r.setStart(n, a);
      r.setEnd(n, b);
    }
    const host = closest(r.commonAncestorContainer, "span", rte);
    if (host && host.textContent === r.toString()) {
      group.forEach((c) => c && host.classList.remove(c));
      if (cls) host.classList.add(cls);
      if (!host.classList.length) host.replaceWith(...host.childNodes);
      return;
    }
    const frag = r.extractContents();
    frag.querySelectorAll("span").forEach((sp) => {
      group.forEach((c) => c && sp.classList.remove(c));
      if (!sp.classList.length) sp.replaceWith(...sp.childNodes);
    });
    let node = frag;
    if (cls) {
      node = document.createElement("span");
      node.className = cls;
      node.append(frag);
    }
    const first = node === frag ? frag.firstChild : node, last = node === frag ? frag.lastChild : node;
    r.insertNode(node);
    if (first && last) {
      const nr = document.createRange();
      nr.setStartBefore(first);
      nr.setEndAfter(last);
      try {
        document.getSelection().setBaseAndExtent(nr.startContainer, nr.startOffset, nr.endContainer, nr.endOffset);
      } catch {
      }
    }
  }
  function richEditor({ placeholder = "", colors = true, onInput } = {}) {
    const el2 = document.createElement("div");
    el2.className = "rtw";
    el2.innerHTML = '<div class="tb" role="toolbar" aria-label="Formatierung"></div><div class="rt rte" contenteditable="true" spellcheck="true"></div>';
    const tb = el2.firstChild, rte = el2.lastChild;
    rte.dataset.ph = placeholder;
    const root = () => el2.getRootNode();
    const btns = {};
    const btn = (key, icon2, title, fn, inner) => {
      const b = document.createElement("button");
      b.type = "button";
      b.title = title;
      b.setAttribute("aria-label", title);
      b.innerHTML = inner || `<ha-icon icon="${icon2}"></ha-icon>`;
      b.addEventListener("pointerdown", (e) => e.preventDefault());
      b.addEventListener("mousedown", (e) => e.preventDefault());
      b.addEventListener("click", (e) => {
        e.preventDefault();
        e.stopPropagation();
        if (!within(rte, anchor(root()))) rte.focus();
        fn();
        changed();
      });
      btns[key] = b;
      tb.append(b);
      return b;
    };
    const sep = () => {
      const s = document.createElement("span");
      s.className = "sep";
      tb.append(s);
    };
    const exec = (c, v) => document.execCommand(c, false, v);
    btn("bold", "mdi:format-bold", "Fett", () => exec("bold"));
    btn("italic", "mdi:format-italic", "Kursiv", () => exec("italic"));
    btn("underline", "mdi:format-underline", "Unterstrichen", () => exec("underline"));
    btn("strikeThrough", "mdi:format-strikethrough-variant", "Durchgestrichen", () => exec("strikeThrough"));
    sep();
    SIZES.forEach(([k, icon2, title]) => btn(`size:${k}`, icon2, title, () => {
      const blk = closest(anchor(root()), "h3,p,li", rte);
      if (k === "h3") {
        exec("formatBlock", blk?.nodeName === "H3" ? "p" : "h3");
        return;
      }
      if (blk?.nodeName === "H3") exec("formatBlock", "p");
      wrap(rte, root(), ["fs-s", "fs-l"], k);
    }));
    sep();
    btn("list", "mdi:format-list-bulleted", "Aufzählung", () => {
      const ul = closest(anchor(root()), "ul", rte);
      if (ul?.classList.contains("check")) {
        ul.classList.remove("check");
        return;
      }
      exec("insertUnorderedList");
    });
    btn("check", "mdi:format-list-checks", "Checkliste", () => {
      let ul = closest(anchor(root()), "ul", rte);
      if (ul?.classList.contains("check")) {
        exec("insertUnorderedList");
        return;
      }
      if (!ul) {
        exec("insertUnorderedList");
        ul = closest(anchor(root()), "ul", rte);
      }
      ul?.classList.add("check");
    });
    if (colors) {
      sep();
      COLORS.forEach(([k, title]) => btn(`color:${k}`, "", `Farbe: ${title}`, () => wrap(rte, root(), COLORS.map((c) => c[0]), k), `<span class="dot ${k || "c-none"}"></span>`));
    }
    const paint = () => {
      const n = anchor(root());
      if (!within(rte, n)) return;
      ["bold", "italic", "underline", "strikeThrough"].forEach((k) => btns[k].classList.toggle("on", document.queryCommandState(k)));
      const h3 = !!closest(n, "h3", rte), sz = closest(n, "span.fs-s,span.fs-l", rte), ul = closest(n, "ul", rte), col = closest(n, "span.c-accent,span.c-warn,span.c-muted", rte);
      SIZES.forEach(([k]) => btns[`size:${k}`].classList.toggle("on", k === "h3" ? h3 : !h3 && (sz ? sz.classList.contains(k) : k === "")));
      btns.list.classList.toggle("on", !!ul && !ul.classList.contains("check"));
      btns.check.classList.toggle("on", !!ul?.classList.contains("check"));
      if (colors) COLORS.forEach(([k]) => btns[`color:${k}`].classList.toggle("on", col ? col.classList.contains(k) : k === ""));
    };
    const changed = () => {
      rte.querySelectorAll("ul.check li.done").forEach((li) => {
        if (!li.textContent.trim()) li.classList.remove("done");
      });
      paint();
      onInput?.(get());
    };
    const fade = () => tb.classList.toggle("fade", tb.scrollWidth - tb.clientWidth - tb.scrollLeft > 4);
    tb.addEventListener("scroll", fade, { passive: true });
    requestAnimationFrame(fade);
    const onSel = () => paint();
    rte.addEventListener("input", changed);
    rte.addEventListener("keyup", paint);
    rte.addEventListener("pointerup", paint);
    rte.addEventListener("focus", () => document.addEventListener("selectionchange", onSel));
    rte.addEventListener("blur", () => document.removeEventListener("selectionchange", onSel));
    rte.addEventListener("keydown", (e) => e.stopPropagation());
    rte.addEventListener("paste", (e) => {
      e.preventDefault();
      exec("insertText", e.clipboardData?.getData("text/plain") || "");
    });
    rte.addEventListener("drop", (e) => e.preventDefault());
    rte.addEventListener("click", (e) => {
      const li = closest(e.target, "ul.check > li", rte);
      if (li && e.clientX - li.getBoundingClientRect().left < 28) {
        li.classList.toggle("done");
        changed();
      }
    });
    const get = () => sanitize(rte.innerHTML);
    const set = (html) => {
      rte.innerHTML = sanitize(html);
      paint();
    };
    try {
      document.execCommand("defaultParagraphSeparator", false, "p");
    } catch {
    }
    return { el: el2, rte, tb, get, set, focus: () => rte.focus() };
  }
  function richView(el2, html, onToggle) {
    const clean = sanitize(html);
    if (el2._html !== clean) {
      el2._html = clean;
      el2.innerHTML = clean;
    }
    el2.classList.add("rt");
    if (onToggle && !el2._tog) {
      el2._tog = true;
      el2.addEventListener("click", (e) => {
        const li = closest(e.target, "ul.check > li", el2);
        if (!li) return;
        e.stopPropagation();
        li.classList.toggle("done");
        el2._html = sanitize(el2.innerHTML);
        el2._onToggle?.(el2._html);
      });
    }
    el2._onToggle = onToggle;
  }

  // src/shared/stack-view.js
  var VIEW_CSS = `
.stage{position:relative;flex:1 1 0;min-height:var(--vh,240px);overflow:hidden;overflow:clip;margin:0 calc(var(--nv-s2) * -1)}
.view{position:absolute;inset:0;display:flex;flex-direction:column;gap:var(--nv-s5);padding:0 var(--nv-s2);box-sizing:border-box;
transition:transform var(--nv-d5) var(--nv-ease),opacity var(--nv-d5) var(--nv-ease),visibility 0s linear var(--nv-d5)}
.view.main{transform:none}
.view.side{transform:translateX(104%);opacity:0;visibility:hidden}
.g.detail .view.main{transform:translateX(-28%);opacity:0;visibility:hidden}
.g.detail .view.side{transform:none;opacity:1;visibility:visible;transition-delay:0s}
.g:not(.detail) .view.main{visibility:visible;transition-delay:0s}
.scroll{flex:1 1 0;min-height:0;overflow-y:auto;overscroll-behavior:auto contain;scrollbar-width:thin;
-webkit-mask-image:linear-gradient(#000 calc(100% - 14px),transparent);mask-image:linear-gradient(#000 calc(100% - 14px),transparent);padding-bottom:var(--nv-s6)}
.rb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;box-sizing:border-box;
border:1px solid var(--nv-box-border);background:var(--nv-chip);color:inherit;outline:none;-webkit-tap-highlight-color:transparent;
transition:background-color var(--nv-d2),color var(--nv-d2),border-color var(--nv-d2),transform var(--nv-d2) var(--nv-ease),opacity var(--nv-d2),box-shadow var(--nv-d3)}
.rb ha-icon{--mdc-icon-size:22px;transition:transform var(--nv-d4) var(--nv-ease)}
.rb:active:not([disabled]){transform:scale(var(--nv-press))}
.rb:focus-visible{box-shadow:var(--nv-focus)}
.rb[disabled]{opacity:.35;cursor:default}
.rb.sm{width:38px;height:38px}.rb.sm ha-icon{--mdc-icon-size:19px}
.rb.on{background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));border-color:transparent;color:color-mix(in srgb,var(--nv-active-fg) var(--nv-fill-ink),var(--nv-fg));
box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
.rb.arm{border-color:color-mix(in srgb,var(--nv-error) 70%,transparent);background:color-mix(in srgb,var(--nv-error) 22%,transparent);color:var(--nv-error);animation:rb-shake var(--nv-d5) var(--nv-ease)}
.rb.plus ha-icon{transition:transform var(--nv-d5) var(--nv-ease)}
.rb.plus:active ha-icon{transform:rotate(90deg)}
.bar{display:flex;align-items:center;gap:var(--nv-s4);flex:none;min-width:0}
.bar .sp{flex:1;min-width:0}
.msg{display:flex;align-items:center;gap:var(--nv-s4);font-size:var(--nv-fs-6);opacity:.6;padding:var(--nv-s5) var(--nv-s2)}
.msg ha-icon{--mdc-icon-size:var(--nv-icon-md);flex:none}
.state{font-size:var(--nv-fs-3);opacity:.6;display:flex;align-items:center;gap:var(--nv-s2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.state ha-icon{--mdc-icon-size:14px}
.state.ok ha-icon{color:var(--nova-success-color,var(--nv-a4));animation:rb-pop var(--nv-d5) var(--nv-ease)}
@keyframes rb-in{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
@keyframes rb-pop{0%{transform:scale(.3)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
@keyframes rb-shake{0%,100%{transform:none}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
@media (prefers-reduced-motion:reduce){.view,.rb,.rb ha-icon{transition:none}.rb.arm,.state.ok ha-icon{animation:none}}`;
  function roundBtn(icon2, title, onTap, cls = "") {
    const b = document.createElement("button");
    b.type = "button";
    b.className = `rb ${cls}`.trim();
    b.title = title;
    b.setAttribute("aria-label", title);
    b.innerHTML = `<ha-icon icon="${icon2}"></ha-icon>`;
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      onTap(e);
    });
    return b;
  }
  var setBtnIcon = (b, icon2) => {
    const i = b.firstChild;
    if (i.getAttribute("icon") !== icon2) i.setAttribute("icon", icon2);
  };
  var ARM = 3e3;
  function armButton(icon2, title, onConfirm, cls = "") {
    let t;
    const b = roundBtn(icon2, title, () => {
      if (!b.classList.contains("arm")) {
        b.classList.add("arm");
        b.title = "Nochmal tippen zum Bestätigen";
        setBtnIcon(b, "mdi:delete-alert-outline");
        t = setTimeout(reset, ARM);
        return;
      }
      reset();
      onConfirm();
    }, cls);
    const reset = () => {
      clearTimeout(t);
      b.classList.remove("arm");
      b.title = title;
      setBtnIcon(b, icon2);
    };
    b.reset = reset;
    return b;
  }
  function ago(ts, now = Date.now()) {
    if (!ts) return "";
    const d = new Date(ts * 1e3), s = (now - d) / 1e3;
    if (s < 45) return "gerade eben";
    if (s < 3600) return `vor ${Math.max(1, Math.round(s / 60))} Min.`;
    const day = (x) => new Date(x).setHours(0, 0, 0, 0), dd = (day(now) - day(d)) / 864e5;
    const hm = d.toLocaleTimeString("de-DE", { hour: "2-digit", minute: "2-digit" });
    if (dd === 0) return `heute ${hm}`;
    if (dd === 1) return `gestern ${hm}`;
    return d.toLocaleDateString("de-DE", { day: "numeric", month: "short", ...d.getFullYear() !== new Date(now).getFullYear() ? { year: "numeric" } : {} });
  }

  // src/shared/media-picker.js
  var FOOD_ICONS = [
    "mdi:food-apple",
    "mdi:fruit-pear",
    "mdi:fruit-citrus",
    "mdi:fruit-cherries",
    "mdi:fruit-grapes",
    "mdi:fruit-pineapple",
    "mdi:fruit-watermelon",
    "mdi:carrot",
    "mdi:corn",
    "mdi:chili-hot",
    "mdi:mushroom-outline",
    "mdi:leaf",
    "mdi:sprout",
    "mdi:nutrition",
    "mdi:bread-slice",
    "mdi:baguette",
    "mdi:food-croissant",
    "mdi:muffin",
    "mdi:cupcake",
    "mdi:cake-variant",
    "mdi:cookie",
    "mdi:egg-outline",
    "mdi:cheese",
    "mdi:cup-water",
    "mdi:baby-bottle-outline",
    "mdi:ice-cream",
    "mdi:ice-pop",
    "mdi:candy",
    "mdi:fish",
    "mdi:food-drumstick",
    "mdi:food-steak",
    "mdi:sausage",
    "mdi:food-turkey",
    "mdi:food-hot-dog",
    "mdi:hamburger",
    "mdi:pizza",
    "mdi:pasta",
    "mdi:noodles",
    "mdi:rice",
    "mdi:barley",
    "mdi:peanut",
    "mdi:popcorn",
    "mdi:french-fries",
    "mdi:shaker-outline",
    "mdi:spoon-sugar",
    "mdi:soy-sauce",
    "mdi:pot-steam-outline",
    "mdi:bowl-mix-outline",
    "mdi:taco",
    "mdi:food-variant",
    "mdi:coffee",
    "mdi:tea",
    "mdi:water",
    "mdi:bottle-soda-classic-outline",
    "mdi:bottle-wine",
    "mdi:beer",
    "mdi:glass-cocktail",
    "mdi:paper-roll",
    "mdi:toothbrush-paste",
    "mdi:hand-wash-outline",
    "mdi:lotion-outline",
    "mdi:spray-bottle",
    "mdi:broom",
    "mdi:pill",
    "mdi:bandage",
    "mdi:lightbulb-outline",
    "mdi:battery-outline",
    "mdi:dog",
    "mdi:cat",
    "mdi:flower-tulip-outline",
    "mdi:package-variant-closed"
  ];
  var STORE_ICONS = [
    "mdi:store-outline",
    "mdi:storefront-outline",
    "mdi:cart-outline",
    "mdi:basket-outline",
    "mdi:shopping-outline",
    "mdi:food-apple-outline",
    "mdi:bread-slice-outline",
    "mdi:fish",
    "mdi:pill",
    "mdi:lipstick",
    "mdi:hammer-wrench",
    "mdi:flower-tulip-outline",
    "mdi:paw",
    "mdi:bottle-wine-outline",
    "mdi:sprout",
    "mdi:tshirt-crew-outline",
    "mdi:laptop",
    "mdi:gas-station-outline"
  ];
  var MAX = 384;
  var QUALITY = 0.8;
  async function compressImage(file, max = MAX) {
    let src;
    try {
      src = await createImageBitmap(file, { imageOrientation: "from-image" });
    } catch {
      src = await new Promise((ok, fail2) => {
        const i = new Image();
        i.onload = () => ok(i);
        i.onerror = fail2;
        i.src = URL.createObjectURL(file);
      });
    }
    const w = src.width || src.naturalWidth, h = src.height || src.naturalHeight, k = Math.min(1, max / Math.max(w, h));
    const cv = document.createElement("canvas");
    cv.width = Math.max(1, Math.round(w * k));
    cv.height = Math.max(1, Math.round(h * k));
    cv.getContext("2d").drawImage(src, 0, 0, cv.width, cv.height);
    src.close?.();
    let url = cv.toDataURL("image/webp", QUALITY);
    if (!url.startsWith("data:image/webp")) url = cv.toDataURL("image/jpeg", QUALITY);
    return url;
  }
  var PICK_MEDIA_CSS = `
.mp{display:flex;flex-direction:column;gap:var(--nv-s5)}
.mp .row1{display:flex;gap:var(--nv-s4);align-items:center}
.mp .pv{width:64px;height:64px;border-radius:var(--nv-r-md);flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);overflow:hidden;
border:1px solid var(--nv-box-border);transition:transform var(--nv-d3) var(--nv-ease)}
.mp .pv.pop{animation:mp-pop var(--nv-d5) var(--nv-ease)}
.mp .pv ha-icon{--mdc-icon-size:34px}.mp .pv img{width:100%;height:100%;object-fit:cover}
.mp .acts{display:flex;gap:var(--nv-s3);flex-wrap:wrap;flex:1;min-width:0}
.mp .act{height:44px;padding:0 var(--nv-s6);border-radius:var(--nv-r-pill);border:1px solid var(--nv-box-border);background:var(--nv-chip);color:inherit;font:inherit;
font-size:var(--nv-fs-6);display:inline-flex;align-items:center;gap:var(--nv-s3);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform var(--nv-d2)}
.mp .act:active{transform:scale(var(--nv-press))}
.mp .act ha-icon{--mdc-icon-size:20px}
.mp .act.busy ha-icon{animation:mp-spin 1s linear infinite}
.mp .srch{min-height:56px}
.mp .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(48px,1fr));gap:var(--nv-s2)}
.mp .grid button{height:48px;border-radius:var(--nv-r-sm);border:1px solid transparent;background:rgba(var(--nv-tint),.05);color:inherit;display:flex;align-items:center;
justify-content:center;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent;transition:background-color var(--nv-d2),border-color var(--nv-d2),transform var(--nv-d2)}
.mp .grid button:active{transform:scale(var(--nv-press))}
.mp .grid button.on{background:color-mix(in srgb,var(--nv-active) 28%,transparent);border-color:var(--nv-active)}
.mp .grid ha-icon{--mdc-icon-size:24px}
.mp .err{font-size:var(--nv-fs-4);color:var(--nv-error)}
.mp input[type=file]{display:none}
@keyframes mp-pop{0%{transform:scale(.6)}60%{transform:scale(1.12)}100%{transform:scale(1)}}
@keyframes mp-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.mp .pv.pop{animation:none}}`;
  function mediaPicker({ hass, module = "shopping", value = {}, icons = FOOD_ICONS, upload = true, search = true, fallback = "mdi:help", onChange }) {
    const el2 = document.createElement("div");
    el2.className = "mp";
    el2.innerHTML = `<div class="row1"><div class="pv"></div><div class="acts"></div></div><div class="srch"></div><div class="err" hidden></div><div class="grid"></div>
<input type="file" accept="image/*">`;
    const pv = el2.querySelector(".pv"), acts = el2.querySelector(".acts"), grid = el2.querySelector(".grid"), err = el2.querySelector(".err"), file = el2.querySelector("input"), srch = el2.querySelector(".srch");
    let cur2 = { icon: value.icon || null, image: value.image || null }, h = hass;
    const paint = (pop) => {
      pv.innerHTML = cur2.image ? `<img alt="" src="${imageUrl(h, module, cur2.image)}">` : `<ha-icon icon="${cur2.icon || fallback}"></ha-icon>`;
      if (pop) {
        pv.classList.remove("pop");
        void pv.offsetWidth;
        pv.classList.add("pop");
      }
      grid.querySelectorAll("button").forEach((b) => b.classList.toggle("on", !cur2.image && b.dataset.icon === cur2.icon));
      rm.hidden = !cur2.icon && !cur2.image;
      if (form) form.data = { icon: cur2.image ? "" : cur2.icon || "" };
    };
    const set = (v) => {
      cur2 = { icon: null, image: null, ...v };
      paint(true);
      onChange?.(cur2);
    };
    const act = (icon2, label, fn) => {
      const b = document.createElement("button");
      b.type = "button";
      b.className = "act";
      b.innerHTML = `<ha-icon icon="${icon2}"></ha-icon><span></span>`;
      b.lastChild.textContent = label;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        fn(b);
      });
      acts.append(b);
      return b;
    };
    if (upload) act("mdi:camera-plus-outline", "Eigenes Bild", () => file.click());
    const rm = act("mdi:close", "Entfernen", () => set({}));
    file.addEventListener("change", async () => {
      const f = file.files?.[0];
      file.value = "";
      if (!f) return;
      const b = acts.firstChild;
      b.classList.add("busy");
      b.firstChild.setAttribute("icon", "mdi:loading");
      err.hidden = true;
      try {
        const { image } = await uploadImage(h, module, await compressImage(f, module === "recipes" ? 960 : MAX));
        set({ image });
      } catch (e) {
        err.textContent = `Bild konnte nicht gespeichert werden: ${e?.message || e}`;
        err.hidden = false;
      } finally {
        b.classList.remove("busy");
        b.firstChild.setAttribute("icon", "mdi:camera-plus-outline");
      }
    });
    icons.forEach((ic) => {
      const b = document.createElement("button");
      b.type = "button";
      b.dataset.icon = ic;
      b.title = ic.slice(4);
      b.innerHTML = `<ha-icon icon="${ic}"></ha-icon>`;
      b.addEventListener("click", (e) => {
        e.stopPropagation();
        set({ icon: ic });
      });
      grid.append(b);
    });
    let form = null;
    if (search) loadForm().then(() => {
      if (customElements.get("ha-form")) {
        form = document.createElement("ha-form");
        form.schema = [{ name: "icon", selector: { icon: {} } }];
        form.computeLabel = () => "Icon suchen";
        form.hass = h;
        form.addEventListener("value-changed", (e) => {
          e.stopPropagation();
          const ic = e.detail.value?.icon;
          if (ic && ic !== cur2.icon) set({ icon: ic });
        });
      } else {
        form = document.createElement("input");
        form.className = "fld";
        form.placeholder = "mdi:…";
        form.style.cssText = "height:44px;border-radius:var(--nv-r-pill);padding:0 var(--nv-s8)";
        form.addEventListener("change", () => {
          const v = form.value.trim();
          if (/^[a-z0-9-]+:[a-z0-9-]+$/.test(v)) set({ icon: v });
        });
        Object.defineProperty(form, "data", { set: (d) => {
          form.value = d.icon || "";
        } });
      }
      srch.append(form);
      paint();
    });
    paint();
    el2.set = (v) => {
      cur2 = { icon: v?.icon || null, image: v?.image || null };
      paint(true);
    };
    el2.setHass = (x) => {
      h = x;
      if (form && "hass" in form) form.hass = x;
    };
    return el2;
  }

  // src/shopping.js
  var SCSS = `
.g.sh{gap:var(--nv-s5)}
.add{display:flex;gap:var(--nv-s4);align-items:center;flex:none}
.add .fld{height:44px;border-radius:var(--nv-r-pill);padding:0 var(--nv-s8)}
.form .sug{margin-top:calc(var(--nv-s3) * -1)}
.cta{height:48px;border-radius:var(--nv-r-pill);flex:none;width:100%;box-sizing:border-box;display:flex;align-items:center;justify-content:center;gap:var(--nv-s4);font:inherit;font-size:var(--nv-fs-8);font-weight:var(--nv-fw-bold);
cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent;color:inherit;border:1px solid color-mix(in srgb,var(--nv-active) 60%,transparent);background:color-mix(in srgb,var(--nv-active) 24%,var(--nv-chip));
box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 35%,transparent) var(--nv-glow),transparent);transition:transform var(--nv-d2) var(--nv-ease),opacity var(--nv-d3)}
.cta:active:not([disabled]){transform:scale(var(--nv-press))}
.cta:focus-visible{box-shadow:var(--nv-focus)}
.cta[disabled]{opacity:.4;cursor:default}
.cta ha-icon{--mdc-icon-size:22px}
.cta[hidden]{display:none}
.sug{display:flex;gap:var(--nv-s3);overflow-x:auto;flex:none;scrollbar-width:none;margin:0 calc(var(--nv-s2) * -1);padding:var(--nv-s1) var(--nv-s2);
-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 24px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 24px),transparent)}
.sug::-webkit-scrollbar{display:none}
.sug:empty{display:none}
.chip{display:inline-flex;align-items:center;gap:var(--nv-s3);height:38px;padding:0 var(--nv-s6) 0 var(--nv-s2);border-radius:var(--nv-r-pill);flex:none;cursor:pointer;
border:1px solid rgba(var(--nv-tint),.1);background:var(--nv-chip);color:inherit;font:inherit;font-size:var(--nv-fs-6);white-space:nowrap;-webkit-tap-highlight-color:transparent;
transition:transform var(--nv-d2) var(--nv-ease),background-color var(--nv-d2),border-color var(--nv-d2),opacity var(--nv-d3);animation:rb-in var(--nv-d4) var(--nv-ease) both;animation-delay:calc(var(--i,0) * 30ms)}
.chip:active{transform:scale(var(--nv-press))}
.chip.go{transform:translateY(14px) scale(.8);opacity:0}
.chip .th{width:30px;height:30px}
.chip.plain{padding:0 var(--nv-s6)}
.chip.on{background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));border-color:transparent;color:color-mix(in srgb,var(--nv-active-fg) var(--nv-fill-ink),var(--nv-fg));
box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
.chip ha-icon{--mdc-icon-size:18px}
.th{width:40px;height:40px;border-radius:var(--nv-r-sm);flex:none;display:flex;align-items:center;justify-content:center;background:rgba(var(--nv-tint),.08);overflow:hidden}
.th img{width:100%;height:100%;object-fit:cover}
.th ha-icon{--mdc-icon-size:22px}
.th.none ha-icon{opacity:.4}
.items{display:flex;flex-direction:column;gap:var(--nv-s3)}
.gh{display:flex;align-items:center;gap:var(--nv-s3);font-size:var(--nv-fs-3);font-weight:var(--nv-fw-bold);text-transform:uppercase;letter-spacing:var(--nv-caps);opacity:.7;
padding:var(--nv-s4) var(--nv-s2) 0;flex:none;min-height:24px}
.gh:first-child{padding-top:0}
.gh ha-icon{--mdc-icon-size:16px}
.gh .n{opacity:.7;font-weight:var(--nv-fw-medium)}
.gh.tap{cursor:pointer;-webkit-tap-highlight-color:transparent}
.gh .sp{flex:1}
.gh .chev{transition:transform var(--nv-d3) var(--nv-ease)}
.gh.open .chev{transform:rotate(180deg)}
.gh .rb{text-transform:none}
.it{display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s3) var(--nv-s3) var(--nv-s3) var(--nv-s5);border-radius:var(--nv-r-md);min-width:0;flex:none;min-height:52px;box-sizing:border-box;
background:rgba(var(--nv-tint),.05);border:1px solid rgba(var(--nv-tint),.07);transition:background-color var(--nv-d3),border-color var(--nv-d3),opacity var(--nv-d5),transform var(--nv-d5) var(--nv-ease)}
.it.new{animation:rb-in var(--nv-d5) var(--nv-ease) both}
.ckb{width:44px;height:44px;margin:-4px -8px -4px -10px;flex:none;display:flex;align-items:center;justify-content:center;border:0;background:transparent;color:inherit;padding:0;cursor:pointer;
border-radius:50%;-webkit-tap-highlight-color:transparent;outline:none}
.ckb:focus-visible .ck{box-shadow:var(--nv-focus)}
.ck{width:24px;height:24px;border-radius:50%;box-sizing:border-box;border:2px solid rgba(var(--nv-tint),.45);display:flex;align-items:center;justify-content:center;position:relative;
transition:background-color var(--nv-d3),border-color var(--nv-d3),box-shadow var(--nv-d3),transform var(--nv-d2) var(--nv-ease)}
.ckb:active .ck{transform:scale(.85)}
.ck ha-icon{--mdc-icon-size:16px;opacity:0;transform:scale(.3) rotate(-30deg);transition:opacity var(--nv-d2),transform var(--nv-d4) var(--nv-ease)}
.ck::after{content:'';position:absolute;inset:-2px;border-radius:50%;border:2px solid var(--nv-active);opacity:0;pointer-events:none}
.it.done .ck{background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));border-color:var(--nv-active);color:color-mix(in srgb,var(--nv-active-fg) var(--nv-fill-ink),var(--nv-fg));
box-shadow:0 0 12px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
.it.done .ck ha-icon{opacity:1;transform:none}
.it.tick .ck::after{animation:sh-ring var(--nv-d6) var(--nv-ease)}
.it.tick .ck{animation:rb-pop var(--nv-d5) var(--nv-ease)}
.it .tx{flex:1;min-width:0;cursor:pointer;align-self:stretch;display:flex;flex-direction:column;justify-content:center;-webkit-tap-highlight-color:transparent;outline:none;border-radius:var(--nv-r-xs)}
.it .tx:focus-visible{box-shadow:var(--nv-focus)}
.it .tx b{font-weight:var(--nv-fw-medium);font-size:var(--nv-fs-8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap;position:relative;align-self:flex-start;max-width:100%}
.it .tx b::after{content:'';position:absolute;left:0;top:52%;height:1.5px;width:100%;background:currentColor;transform:scaleX(0);transform-origin:left;transition:transform var(--nv-d5) var(--nv-ease)}
.it.done .tx b::after{transform:scaleX(1)}
.it .tx small{font-size:var(--nv-fs-3);opacity:.6;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.it.done .tx,.it.done .th{opacity:.5;transition:opacity var(--nv-d5)}
.it.leave{opacity:0;transform:translateY(8px) scale(.97)}
.qt{display:flex;align-items:center;flex:none;border-radius:var(--nv-r-pill);background:var(--nv-chip);border:1px solid rgba(var(--nv-tint),.08)}
.qt button{width:36px;height:40px;border:0;background:transparent;color:inherit;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;border-radius:var(--nv-r-pill);
-webkit-tap-highlight-color:transparent;outline:none;transition:transform var(--nv-d2) var(--nv-ease),background-color var(--nv-d2)}
.qt button:active{transform:scale(.8);background:rgba(var(--nv-tint),.12)}
.qt button:focus-visible{box-shadow:var(--nv-focus)}
.qt button ha-icon{--mdc-icon-size:18px}
.qt span{min-width:34px;text-align:center;font-size:var(--nv-fs-6);font-weight:var(--nv-fw-bold);white-space:nowrap;font-variant-numeric:tabular-nums}
.qt span.bump{animation:sh-bump var(--nv-d4) var(--nv-ease)}
.qt.lg button{width:48px;height:48px}.qt.lg span{min-width:64px;font-size:var(--nv-fs-10)}
.qv{flex:none;font-size:var(--nv-fs-5);opacity:.6;white-space:nowrap;padding-right:var(--nv-s4)}
.ft{display:flex;justify-content:flex-end;gap:var(--nv-s4);flex:none}
.form{display:flex;flex-direction:column;gap:var(--nv-s6);padding-bottom:var(--nv-s6)}
.form .ti{height:44px;border-radius:var(--nv-r-md);padding:0 var(--nv-s7);font-weight:var(--nv-fw-bold)}
.form .lb{font-size:var(--nv-fs-3);font-weight:var(--nv-fw-bold);opacity:.6;text-transform:uppercase;letter-spacing:var(--nv-caps);margin-bottom:calc(var(--nv-s3) * -1)}
.form .rowq{display:flex;align-items:center;gap:var(--nv-s4);flex-wrap:wrap}
.chips{display:flex;gap:var(--nv-s3);flex-wrap:wrap}
.chips .chip{animation:none;height:44px}
.sf{display:flex;flex-direction:column;gap:var(--nv-s4);padding:var(--nv-s5);border-radius:var(--nv-r-md);background:rgba(var(--nv-tint),.05);border:1px solid rgba(var(--nv-tint),.08);animation:rb-in var(--nv-d4) var(--nv-ease)}
.sf .fld{height:44px;border-radius:var(--nv-r-pill);padding:0 var(--nv-s8)}
.sf .bar{justify-content:flex-end}
.form .rte{min-height:72px;border-radius:var(--nv-r-md);padding:var(--nv-s5) var(--nv-s7);border:1px solid var(--nv-box-border);background:var(--nv-box);margin-top:var(--nv-s3);
transition:border-color var(--nv-d2),box-shadow var(--nv-d2)}
.form .rte:focus{border-color:color-mix(in srgb,var(--nv-active) 75%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 22%,transparent) var(--nv-glow),transparent)}
@keyframes sh-ring{0%{opacity:.9;transform:scale(1)}100%{opacity:0;transform:scale(2.1)}}
@keyframes sh-bump{0%{transform:scale(1)}40%{transform:scale(1.3)}100%{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.chip,.it.new,.sf,.it.tick .ck,.it.tick .ck::after,.qt span.bump{animation:none}.it,.ck,.ck ha-icon,.it .tx b::after{transition:none}}`;
  var SDEF = {
    name: "Einkaufsliste",
    icon: "mdi:cart-outline",
    placeholder: "Artikel hinzufügen …",
    show_header: true,
    group: true,
    show_images: true,
    show_completed: false,
    show_suggestions: true,
    height: 420,
    print_field: "text",
    ...PRINT_DEF
  };
  var HOLD = 750;
  var SAVE_MS = 700;
  var QTY_MS = 350;
  var STEP = { g: 50, ml: 50, kg: 0.5, l: 0.5 };
  var hkey = (s) => String(s || "").toLowerCase().split(/\s+/).filter(Boolean).join(" ");
  var num = (q) => String(Math.round((+q || 0) * 1e3) / 1e3).replace(".", ",");
  var qtyText = (it) => `${num(it.qty ?? 1)}${it.unit && it.unit !== "Stk" ? ` ${it.unit}` : ""}`;
  var NovaShoppingCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("shopping-card-editor"));
    }
    static getStubConfig(h) {
      const script = Object.keys(h.states).find((id) => /^script\..*einkauf.*druck/.test(id));
      return script ? { print_script: script } : {};
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      this._c = { ...SDEF, ...c };
      this._ids = [this._c.print_script].filter(Boolean);
      this._doneOpen = !!this._c.show_completed;
      if (this._e) this._apply();
    }
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._e) this._build();
      this._watch();
      this._picker?.setHass(h);
      this._spicker?.setHass(h);
      if (hassChanged(old, h, this._ids)) this._render();
    }
    getCardSize() {
      return 7;
    }
    getGridOptions() {
      return { columns: 6, rows: "auto", min_columns: 3 };
    }
    connectedCallback() {
      this._watch();
    }
    disconnectedCallback() {
      this._flush();
      this._flushQty();
      this._off?.();
      this._off = null;
      stopFeedback(this);
      clearTimeout(this._st);
      clearTimeout(this._okT);
      clearTimeout(this._ft);
      this._hold?.forEach((t) => clearTimeout(t));
      this._hold = /* @__PURE__ */ new Map();
      this._del?.reset();
    }
    _watch() {
      if (this._off || !this._h || !this.isConnected) return;
      this._off = watch(this._h, "shopping", this, (d, err) => {
        this._data = d;
        this._err = err;
        this._onData();
      });
    }
    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${FIELD_CSS}${PRINT_CSS}${VIEW_CSS}${RICH_CSS}${PICK_MEDIA_CSS}${SCSS}</style><div class="g sh">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<div class="stage"><div class="view main">
<form class="add"><input class="fld" type="text" enterkeyhint="done" autocomplete="off" maxlength="120"></form>
<div class="sug"></div><div class="scroll"><div class="items"></div></div><div class="ft"></div></div>
<div class="view side"><div class="bar"></div><div class="scroll"><div class="form"></div></div>
<button class="cta" type="button" hidden><ha-icon icon="mdi:plus"></ha-icon><span>Hinzufügen</span></button></div></div></div>`;
      const q = (s) => r.querySelector(s);
      const e = this._e = {
        g: q(".g"),
        hd: q(".hd"),
        ic: q(".hd .ic"),
        name: q(".hd b"),
        sub: q(".hd small"),
        form: q("form.add"),
        inp: q(".add input"),
        sug: q(".sug"),
        cta: q(".cta"),
        items: q(".items"),
        ft: q(".ft"),
        bar: q(".bar"),
        dform: q(".form")
      };
      this._hold = /* @__PURE__ */ new Map();
      this._seen = /* @__PURE__ */ new Set();
      this._qty = /* @__PURE__ */ new Map();
      this._pstate = "idle";
      e.ab = roundBtn("mdi:plus", "Artikel mit Details hinzufügen", () => this._openNew(), "plus");
      e.form.append(e.ab);
      e.form.addEventListener("submit", (ev) => {
        ev.preventDefault();
        this._add();
      });
      e.inp.addEventListener("input", () => this._renderSug());
      e.inp.addEventListener("keydown", (ev) => ev.stopPropagation());
      e.cta.addEventListener("click", () => this._addNew());
      this._pb = printButton(() => this._print());
      e.ft.append(this._pb);
      e.back = roundBtn("mdi:arrow-left", "Zurück zur Liste", () => this._close());
      e.state = document.createElement("div");
      e.state.className = "state sp";
      this._del = armButton("mdi:delete-outline", "Artikel löschen", () => this._remove());
      e.bar.append(e.back, e.state, this._del);
      this._apply();
    }
    _apply() {
      const c = this._c, e = this._e;
      e.hd.hidden = c.show_header === false;
      e.inp.placeholder = c.placeholder || "";
      e.g.style.setProperty("--vh", `${Math.max(200, +c.height || SDEF.height)}px`);
      this._key = this._skey = null;
      this._render();
    }
    /* ----- Daten ----- */
    _items() {
      return (this._data?.items || []).map((i) => this._qty.has(i.id) ? { ...i, qty: this._qty.get(i.id).qty } : i);
    }
    _store(id) {
      return this._data?.stores.find((s) => s.id === id);
    }
    _onData() {
      const d = this._data;
      if (d && this._c.entity && !d.sync_entity && !this._syncSet && this._h.states[this._c.entity]) {
        this._syncSet = true;
        shop.setSync(this._h, this._c.entity).catch((err) => console.warn("[nova-cards] Einkauf: todo-Abgleich nicht eingestellt", err));
      }
      if (this._cur?.id && d && !d.items.some((i) => i.id === this._cur.id)) {
        this._cur = null;
        this._e?.g.classList.remove("detail");
      }
      if (this._new && this._nsug && this._ti?.value) {
        this._nkey = null;
        this._suggest();
      }
      if (this._cur && this._e) this._paintStores();
      this._render();
    }
    _thumb(x, cls = "th") {
      const c = this._c, el2 = document.createElement("span");
      const img = c.show_images !== false && x.image ? imageUrl(this._h, "shopping", x.image) : "";
      el2.className = `${cls}${!img && !x.icon ? " none" : ""}`;
      if (img) {
        const i = document.createElement("img");
        i.alt = "";
        i.loading = "lazy";
        i.src = img;
        el2.append(i);
      } else {
        const i = document.createElement("ha-icon");
        i.setAttribute("icon", x.icon || "mdi:shopping-outline");
        el2.append(i);
      }
      return el2;
    }
    /* ----- Liste ----- */
    _render() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !c || !e) return;
      setIcon(e.ic, c.icon);
      e.name.textContent = c.name || SDEF.name;
      const all = this._items(), open = all.filter((i) => !i.done || this._hold.has(i.id)), done = all.filter((i) => i.done && !this._hold.has(i.id));
      const nOpen = all.filter((i) => !i.done).length;
      e.sub.textContent = this._err ? "" : !this._data ? "Wird geladen …" : nOpen ? `${nOpen} offen${done.length ? ` · ${done.length} erledigt` : ""}` : all.length ? "Alles erledigt" : "Liste ist leer";
      e.inp.disabled = e.ab.disabled = !this._data;
      let msg = null;
      if (this._err) msg = storeHint(this._err, "shopping");
      else if (!this._data) msg = ["mdi:timer-sand", "Wird geladen …"];
      else if (!all.length) msg = ["mdi:cart-check", "Nichts auf der Liste"];
      const groups = [];
      if (c.group !== false && this._data?.stores.length) {
        [...this._data.stores, null].forEach((s) => {
          const rows = open.filter((i) => s ? i.store === s.id : !this._store(i.store));
          if (rows.length) groups.push({ store: s, rows });
        });
      } else if (open.length) groups.push({ store: void 0, rows: open });
      const key = JSON.stringify([
        msg,
        groups.map((g) => [g.store?.id, g.store?.name, g.store?.icon, g.rows.map((r) => this._rk(r))]),
        done.map((r) => this._rk(r)),
        this._doneOpen,
        c.show_images,
        c.group,
        this._data?.stores.map((s) => [s.id, s.name])
      ]);
      if (key !== this._key) {
        this._key = key;
        const out = [];
        if (msg) {
          const m = document.createElement("div");
          m.className = "msg";
          m.innerHTML = "<ha-icon></ha-icon><span></span>";
          m.firstChild.setAttribute("icon", msg[0]);
          m.lastChild.textContent = msg[1];
          out.push(m);
        }
        groups.forEach((g) => {
          if (g.store !== void 0) out.push(this._head(g.store?.icon || "mdi:help-circle-outline", g.store?.name || "Ohne Geschäft", g.rows.filter((r) => !r.done).length));
          g.rows.forEach((r) => out.push(this._row(r, g.store === void 0)));
        });
        if (done.length) {
          const hd = this._head("mdi:check-all", "Erledigt", done.length);
          hd.classList.add("tap");
          hd.classList.toggle("open", this._doneOpen);
          hd.tabIndex = 0;
          hd.setAttribute("role", "button");
          hd.setAttribute("aria-expanded", this._doneOpen);
          const sp = document.createElement("span");
          sp.className = "sp";
          const chev = document.createElement("ha-icon");
          chev.className = "chev";
          chev.setAttribute("icon", "mdi:chevron-down");
          hd.append(sp);
          if (this._doneOpen) hd.append(armButton("mdi:delete-sweep-outline", "Erledigte löschen", () => shop.clearDone(this._h).catch((err) => console.warn("[nova-cards] Einkauf: Erledigte löschen fehlgeschlagen", err)), "sm"));
          hd.append(chev);
          const tog = () => {
            this._doneOpen = !this._doneOpen;
            this._render();
          };
          hd.addEventListener("click", tog);
          hd.addEventListener("keydown", (ev) => {
            if (ev.key === "Enter" || ev.key === " ") {
              ev.preventDefault();
              tog();
            }
          });
          out.push(hd);
          if (this._doneOpen) done.forEach((r) => out.push(this._row(r, true)));
        }
        e.items.replaceChildren(...out);
        this._bump = null;
      }
      e.ft.hidden = !c.print_script;
      printPaint(this._pb, c, this._pstate, nOpen > 0 && !!h.states[c.print_script]);
      this._renderSug();
      this._paintBar();
    }
    _rk(r) {
      return [r.id, r.name, r.qty, r.unit, r.store, r.icon, r.image, r.note, r.done, this._hold.has(r.id)];
    }
    _head(icon2, label, n) {
      const el2 = document.createElement("div");
      el2.className = "gh";
      el2.innerHTML = '<ha-icon></ha-icon><span></span><span class="n"></span>';
      el2.firstChild.setAttribute("icon", icon2);
      el2.children[1].textContent = label;
      el2.children[2].textContent = n;
      return el2;
    }
    _row(it, showStore) {
      const el2 = document.createElement("div"), held = this._hold.has(it.id);
      el2.className = `it${it.done ? " done" : ""}${held ? " tick" : ""}${this._seen.has(it.id) ? "" : " new"}`;
      this._seen.add(it.id);
      const ck = document.createElement("button");
      ck.type = "button";
      ck.className = "ckb";
      ck.setAttribute("role", "checkbox");
      ck.setAttribute("aria-checked", !!it.done);
      ck.setAttribute("aria-label", `${it.name} ${it.done ? "zurück auf die Liste" : "abhaken"}`);
      ck.innerHTML = '<span class="ck"><ha-icon icon="mdi:check-bold"></ha-icon></span>';
      ck.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._toggle(it, el2);
      });
      const tx = document.createElement("div");
      tx.className = "tx";
      const b = document.createElement("b");
      b.textContent = it.name;
      tx.append(b);
      const sub = [showStore && this._store(it.store)?.name, firstLine(it.note)].filter(Boolean).join(" · ");
      if (sub) {
        const sm = document.createElement("small");
        sm.textContent = sub;
        tx.append(sm);
      }
      press(tx, { tap: () => this._open(it) });
      tx.setAttribute("aria-label", `${it.name} bearbeiten`);
      el2.append(ck, this._thumb(it), tx);
      if (it.done) {
        const q = document.createElement("span");
        q.className = "qv";
        q.textContent = qtyText(it);
        el2.append(q);
      } else el2.append(this._stepper(it));
      return el2;
    }
    // Menge mit +/–; Schrittweite je Einheit
    _stepper(it, lg) {
      const el2 = document.createElement("div");
      el2.className = `qt${lg ? " lg" : ""}`;
      el2.innerHTML = '<button type="button" aria-label="Weniger"><ha-icon icon="mdi:minus"></ha-icon></button><span></span><button type="button" aria-label="Mehr"><ha-icon icon="mdi:plus"></ha-icon></button>';
      const sp = el2.children[1];
      sp.textContent = qtyText(it);
      if (this._bump === it.id) sp.classList.add("bump");
      [-1, 0, 1].forEach((dir, i) => dir && el2.children[i].addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._step(it.id, dir, sp);
      }));
      return el2;
    }
    _step(id, dir, sp) {
      const detail = this._cur?.id === id, cur2 = detail ? this._cur : this._items().find((i) => i.id === id);
      if (!cur2) return;
      const st = STEP[cur2.unit] || 1, q = Math.max(st, Math.round(((+cur2.qty || 0) + dir * st) * 1e3) / 1e3);
      if (q === cur2.qty) return;
      if (detail) {
        cur2.qty = q;
        this._touched?.add("qty");
        this._dirty();
        this._paintQty();
        return;
      }
      clearTimeout(this._qty.get(id)?.t);
      this._qty.set(id, { qty: q, t: setTimeout(() => this._flushQty(id), QTY_MS) });
      this._bump = id;
      this._key = null;
      sp.textContent = qtyText({ ...cur2, qty: q });
      sp.classList.remove("bump");
      void sp.offsetWidth;
      sp.classList.add("bump");
    }
    _flushQty(id) {
      (id ? [id] : [...this._qty?.keys() || []]).forEach((k) => {
        const x = this._qty.get(k);
        if (!x) return;
        clearTimeout(x.t);
        shop.save(this._h, { id: k, qty: x.qty }).catch((err) => console.warn("[nova-cards] Einkauf: Menge nicht gespeichert", err)).finally(() => {
          if (this._qty.get(k) === x) {
            this._qty.delete(k);
            this._render();
          }
        });
      });
    }
    // Abhaken: Häkchen springt auf, Name wird durchgestrichen, kurz danach wandert die Zeile zu „Erledigt“
    _toggle(it, el2) {
      const h = this._h;
      if (!h || this._hold.has(it.id)) return;
      const done = !it.done;
      if (done) {
        el2.classList.add("done", "tick");
        this._hold.set(it.id, setTimeout(() => {
          el2.classList.add("leave");
          setTimeout(() => {
            this._hold.delete(it.id);
            this._render();
          }, 280);
        }, HOLD));
      }
      shop.save(h, { id: it.id, done }).catch((err) => {
        console.warn("[nova-cards] Einkauf: Abhaken fehlgeschlagen", err);
        clearTimeout(this._hold.get(it.id));
        this._hold.delete(it.id);
        this._key = null;
        this._render();
      });
    }
    /* ----- Hinzufügen + Schnellauswahl ----- */
    // Schnelle Eingabe (Textfeld + Enter) und Schnellauswahl: direkt auf die Liste. Icon, Bild, Geschäft und Einheit
    // eines bekannten Artikels kennt die Integration
    _add(name) {
      const h = this._h, e = this._e, typed = name == null, v = String(typed ? e.inp.value : name).trim();
      if (!h || !v || !this._data) return;
      if (typed) e.inp.value = "";
      const twin = this._items().find((i) => !i.done && hkey(i.name) === hkey(v));
      const known = this._data.history.some((x) => x.key === hkey(v));
      const def = this._c.default_store && this._store(this._c.default_store) ? this._c.default_store : null;
      const item = twin ? { id: twin.id, qty: Math.round(((+twin.qty || 0) + (STEP[twin.unit] || 1)) * 1e3) / 1e3 } : { name: v, ...!known && def ? { store: def } : {} };
      if (twin) this._bump = twin.id;
      shop.save(h, item).catch((err) => {
        console.warn("[nova-cards] Einkauf: Hinzufügen fehlgeschlagen", err);
        if (typed && !e.inp.value) e.inp.value = v;
      });
      if (typed) e.inp.focus();
      this._skey = null;
      this._renderSug();
    }
    _renderSug() {
      const c = this._c, e = this._e, d = this._data;
      if (!e) return;
      const q = hkey(e.inp.value), onList = new Set(this._items().filter((i) => !i.done).map((i) => hkey(i.name)));
      const list2 = !d || c.show_suggestions === false ? [] : d.history.filter((x) => !onList.has(x.key) && (!q || x.key.includes(q))).sort((a, b) => q ? b.key.startsWith(q) - a.key.startsWith(q) || b.count - a.count : 0).slice(0, 12);
      const key = JSON.stringify([list2.map((x) => [x.key, x.icon, x.image]), c.show_images]);
      if (key === this._skey) return;
      this._skey = key;
      e.sug.replaceChildren(...list2.map((x, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chip";
        b.style.setProperty("--i", i);
        b.title = `${x.name} auf die Liste (lange drücken: aus den Vorschlägen entfernen)`;
        b.append(this._thumb(x), document.createTextNode(x.name));
        press(b, {
          tap: () => {
            b.classList.add("go");
            e.inp.value = "";
            this._add(x.name);
          },
          hold: () => {
            b.classList.add("go");
            shop.forget(this._h, x.key).catch(() => {
            });
          }
        });
        return b;
      }));
    }
    /* ----- Detail ----- */
    _open(it) {
      this._flush();
      this._cur = { ...it };
      this._new = false;
      this._touched = null;
      this._show();
    }
    // Neuer Artikel: dasselbe Formular, aber nichts wird gespeichert, bis „Hinzufügen“ getippt ist
    _openNew() {
      const c = this._c, e = this._e;
      if (!this._data) return;
      this._flush();
      this._cur = { id: null, name: "", qty: 1, unit: "Stk", store: c.default_store && this._store(c.default_store) ? c.default_store : null, icon: null, image: null, note: "" };
      this._new = true;
      this._touched = /* @__PURE__ */ new Set();
      this._busy = false;
      this._saved = null;
      const typed = e.inp.value.trim();
      this._cur.name = typed;
      e.inp.value = "";
      this._skey = null;
      this._show();
      if (typed) this._suggest();
      clearTimeout(this._ft);
      this._ft = setTimeout(() => this._new && this._ti?.focus({ preventScroll: true }), 320);
    }
    _show() {
      const e = this._e;
      this._buildForm();
      e.g.classList.add("detail");
      this._del.reset();
      this._del.hidden = this._new;
      e.cta.hidden = !this._new;
      e.back.title = this._new ? "Abbrechen" : "Zurück zur Liste";
      e.back.setAttribute("aria-label", e.back.title);
      this._paintBar();
      this._paintNew();
    }
    _close() {
      this._flush();
      this._flushQty();
      clearTimeout(this._ft);
      this._e.g.classList.remove("detail");
      this._cur = null;
      this._new = false;
      this._key = null;
      this._render();
    }
    _paintNew() {
      const e = this._e;
      if (this._new) e.cta.disabled = this._busy || !this._ti?.value.trim();
    }
    // Bekannte Artikel beim Tippen: Chips zum Übernehmen; passt der Name genau, kommen Icon/Bild, Geschäft und Einheit von selbst
    _suggest() {
      const d = this._data, q = hkey(this._ti.value);
      const list2 = !q || !d ? [] : d.history.filter((h) => h.key.includes(q)).sort((a, b) => b.key.startsWith(q) - a.key.startsWith(q) || (b.count || 0) - (a.count || 0)).slice(0, 6);
      const exact = list2.find((h) => h.key === q);
      if (exact) this._take(exact, false);
      const rest = list2.filter((h) => h !== exact), key = JSON.stringify(rest.map((h) => [h.key, h.icon, h.image]));
      if (key === this._nkey) return;
      this._nkey = key;
      this._nsug.replaceChildren(...rest.map((h, i) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = "chip";
        b.style.setProperty("--i", i);
        b.title = `${h.name} übernehmen`;
        b.append(this._thumb(h), document.createTextNode(h.name));
        b.addEventListener("click", () => {
          this._ti.value = h.name;
          this._take(h, true);
          this._suggest();
          this._paintNew();
        });
        return b;
      }));
    }
    // Vorschlag ins Formular; was schon von Hand gewählt wurde, bleibt (außer der Vorschlag wurde angetippt)
    _take(h, force) {
      const x = this._cur, t = this._touched;
      if ((force || !t.has("media")) && (h.icon || h.image)) {
        x.icon = h.icon || null;
        x.image = h.image || null;
        this._picker.set(x);
      }
      if ((force || !t.has("store")) && h.store && this._store(h.store)) x.store = h.store;
      if ((force || !t.has("unit")) && h.unit && h.unit !== x.unit) {
        if (!t.has("qty")) x.qty = (STEP[h.unit] || 1) === 50 ? 500 : 1;
        x.unit = h.unit;
      }
      this._paintQty();
      this._paintStores();
    }
    _addNew() {
      const x = this._cur, h = this._h, name = this._ti?.value.trim();
      if (!this._new || !x || !h || this._busy) return;
      if (!name) {
        this._ti.focus();
        return;
      }
      const note = this._rt.get();
      const twin = this._items().find((i) => !i.done && hkey(i.name) === hkey(name) && (i.unit || "Stk") === x.unit);
      const item = twin ? { id: twin.id, qty: Math.round(((+twin.qty || 0) + (+x.qty || 0)) * 1e3) / 1e3, ...note && !twin.note ? { note } : {} } : { name, qty: x.qty, unit: x.unit, store: x.store || null, icon: x.icon || null, image: x.image || null, note };
      this._busy = true;
      this._saved = null;
      this._paintNew();
      this._paintBar();
      shop.save(h, item).then(() => {
        this._busy = false;
        if (twin) this._bump = twin.id;
        if (this._new) this._close();
      }).catch((err) => {
        console.warn("[nova-cards] Einkauf: Hinzufügen fehlgeschlagen", err);
        this._busy = false;
        this._saved = "err";
        this._paintNew();
        this._paintBar();
      });
    }
    _buildForm() {
      const e = this._e, x = this._cur, f = e.dform;
      const lb = (t) => {
        const l = document.createElement("div");
        l.className = "lb";
        l.textContent = t;
        return l;
      };
      const ti = this._ti = document.createElement("input");
      ti.className = "fld ti";
      ti.type = "text";
      ti.maxLength = 120;
      ti.placeholder = "Name";
      ti.value = x.name || "";
      ti.autocomplete = "off";
      ti.addEventListener("input", () => {
        if (this._new) this._suggest();
        this._dirty();
      });
      ti.addEventListener("keydown", (ev) => {
        ev.stopPropagation();
        if (ev.key === "Enter") ti.blur();
      });
      const rowq = document.createElement("div");
      rowq.className = "rowq";
      this._qbox = document.createElement("div");
      this._units = document.createElement("div");
      this._units.className = "chips";
      rowq.append(this._qbox, this._units);
      this._stores = document.createElement("div");
      this._stores.className = "chips";
      this._sform = document.createElement("div");
      this._picker = mediaPicker({
        hass: this._h,
        module: "shopping",
        value: { icon: x.icon, image: x.image },
        fallback: "mdi:shopping-outline",
        onChange: (v) => {
          x.icon = v.icon;
          x.image = v.image;
          this._touched?.add("media");
          this._dirty();
        }
      });
      this._rt = richEditor({ placeholder: "Notiz zum Artikel …", onInput: () => this._dirty() });
      this._rt.set(x.note || "");
      this._nsug = document.createElement("div");
      this._nsug.className = "sug";
      this._nkey = null;
      f.replaceChildren(ti, ...this._new ? [this._nsug] : [], lb("Menge"), rowq, lb("Geschäft"), this._stores, this._sform, lb("Icon oder Bild"), this._picker, lb("Notiz"), this._rt.el);
      this._paintQty();
      this._paintStores();
      f.parentElement.scrollTop = 0;
    }
    _paintQty() {
      const x = this._cur;
      if (!x || !this._qbox) return;
      this._qbox.replaceChildren(this._stepper(x, true));
      this._units.replaceChildren(...(this._data?.units || ["Stk"]).map((u) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = `chip plain${x.unit === u ? " on" : ""}`;
        b.textContent = u;
        b.addEventListener("click", () => {
          if (x.unit === u) return;
          const was = STEP[x.unit] || 1, now = STEP[u] || 1;
          if (x.qty === was || x.qty === 1) x.qty = now === 50 ? 500 : 1;
          x.unit = u;
          this._touched?.add("unit");
          this._dirty();
          this._paintQty();
        });
        return b;
      }));
    }
    _paintStores() {
      const x = this._cur;
      if (!x || !this._stores) return;
      const chip = (s, label, icon2) => {
        const b = document.createElement("button");
        b.type = "button";
        b.className = `chip${icon2 ? "" : " plain"}${(s ? x.store === s.id : !this._store(x.store)) && s !== "new" ? " on" : ""}`;
        if (icon2) {
          const i = document.createElement("ha-icon");
          i.setAttribute("icon", icon2);
          i.style.marginLeft = "var(--nv-s4)";
          b.append(i);
        }
        b.append(document.createTextNode(label));
        return b;
      };
      const none = chip(null, "Keins");
      none.addEventListener("click", () => {
        x.store = null;
        this._touched?.add("store");
        this._dirty();
        this._paintStores();
      });
      const add = chip("new", "Neu", "mdi:plus");
      add.addEventListener("click", () => this._storeForm(null));
      this._stores.replaceChildren(none, ...(this._data?.stores || []).map((s) => {
        const b = chip(s, s.name, s.icon);
        b.title = `${s.name} (lange drücken: bearbeiten)`;
        press(b, { tap: () => {
          x.store = s.id;
          this._touched?.add("store");
          this._dirty();
          this._paintStores();
        }, hold: () => this._storeForm(s) });
        return b;
      }), add);
    }
    // Geschäft anlegen oder bearbeiten (Name + Icon), Löschen in zwei Schritten
    _storeForm(s) {
      const box = document.createElement("div");
      box.className = "sf";
      const inp = document.createElement("input");
      inp.className = "fld";
      inp.type = "text";
      inp.maxLength = 60;
      inp.placeholder = "Name des Geschäfts, z. B. Lidl";
      inp.value = s?.name || "";
      inp.addEventListener("keydown", (ev) => {
        ev.stopPropagation();
        if (ev.key === "Enter") {
          ev.preventDefault();
          save();
        }
      });
      let icon2 = s?.icon || "mdi:store-outline";
      this._spicker = mediaPicker({ hass: this._h, value: { icon: icon2 }, icons: STORE_ICONS, upload: false, fallback: "mdi:store-outline", onChange: (v) => {
        icon2 = v.icon || "mdi:store-outline";
      } });
      const bar = document.createElement("div");
      bar.className = "bar";
      const close = () => {
        this._sform.replaceChildren();
        this._spicker = null;
      };
      const save = () => {
        const name = inp.value.trim();
        if (!name) {
          inp.focus();
          return;
        }
        shop.saveStore(this._h, { ...s ? { id: s.id } : {}, name, icon: icon2 }).then((st) => {
          if (!s && this._cur) {
            this._cur.store = st.id;
            this._touched?.add("store");
            this._dirty();
          }
          this._paintStores();
        }).catch((err) => console.warn("[nova-cards] Einkauf: Geschäft nicht gespeichert", err));
        close();
      };
      if (s) bar.append(armButton("mdi:delete-outline", "Geschäft löschen", () => {
        shop.removeStore(this._h, s.id).catch(() => {
        });
        close();
      }));
      const sp = document.createElement("span");
      sp.className = "sp";
      bar.append(sp, roundBtn("mdi:close", "Abbrechen", close), roundBtn("mdi:check", "Speichern", save, "on"));
      box.append(inp, this._spicker, bar);
      this._sform.replaceChildren(box);
      inp.focus({ preventScroll: true });
      box.scrollIntoView({ block: "nearest", behavior: "smooth" });
    }
    _dirty() {
      if (this._new) {
        this._paintNew();
        return;
      }
      this._pending = true;
      clearTimeout(this._st);
      this._st = setTimeout(() => this._flush(), SAVE_MS);
      this._paintBar();
    }
    _flush() {
      clearTimeout(this._st);
      const x = this._cur, h = this._h;
      if (!x || !h || !this._pending || this._new) return;
      this._pending = false;
      const name = this._ti.value.trim() || x.name;
      x.name = name;
      x.note = this._rt.get();
      clearTimeout(this._qty.get(x.id)?.t);
      this._qty.delete(x.id);
      this._saving = (this._saving || 0) + 1;
      shop.save(h, { id: x.id, name, qty: x.qty, unit: x.unit, store: x.store || null, icon: x.icon || null, image: x.image || null, note: x.note }).then(() => {
        this._saved = "ok";
        clearTimeout(this._okT);
        this._okT = setTimeout(() => {
          this._saved = null;
          this._paintBar();
        }, 2500);
      }).catch((err) => {
        console.warn("[nova-cards] Einkauf: Speichern fehlgeschlagen", err);
        this._saved = "err";
      }).finally(() => {
        this._saving--;
        this._paintBar();
      });
      this._paintBar();
    }
    _paintBar() {
      const e = this._e;
      if (!e || !this._cur) return;
      const st = this._new ? this._saved === "err" ? ["mdi:alert-circle-outline", "Nicht gespeichert", "err"] : ["mdi:cart-plus", "Neuer Artikel", ""] : this._pending || this._saving ? ["mdi:cloud-sync-outline", "Speichert …", ""] : this._saved === "err" ? ["mdi:alert-circle-outline", "Nicht gespeichert", "err"] : this._saved === "ok" ? ["mdi:check-circle-outline", "Gespeichert", "ok"] : ["mdi:pencil-outline", "Artikel bearbeiten", ""];
      const k = st.join("|");
      if (e.state._k === k) return;
      e.state._k = k;
      e.state.className = `state sp ${st[2]}`;
      e.state.innerHTML = `<ha-icon icon="${st[0]}"></ha-icon><span></span>`;
      e.state.lastChild.textContent = st[1];
    }
    _remove() {
      const x = this._cur;
      if (!x) return;
      clearTimeout(this._st);
      this._pending = false;
      this._cur = null;
      this._e.g.classList.remove("detail");
      shop.remove(this._h, x.id).catch((err) => console.warn("[nova-cards] Einkauf: Löschen fehlgeschlagen", err));
      this._render();
    }
    /* ----- Drucken ----- */
    // Offene Artikel als Klartext, nach Geschäft gruppiert: „[ ] 2 l Milch“, Notiz eingerückt darunter
    _text() {
      const open = this._items().filter((i) => !i.done), stores = this._data?.stores || [], out = [];
      const line = (i) => {
        out.push(`[ ] ${i.qty === 1 && (!i.unit || i.unit === "Stk") ? "" : `${qtyText(i)} `}${i.name}`);
        toPlain(i.note).split("\n").filter(Boolean).forEach((l) => out.push(`    ${l}`));
      };
      if (this._c.group !== false && stores.length) {
        [...stores, null].forEach((s) => {
          const rows = open.filter((i) => s ? i.store === s.id : !this._store(i.store));
          if (!rows.length) return;
          if (out.length) out.push("");
          out.push((s?.name || "Sonstiges").toUpperCase());
          rows.forEach(line);
        });
      } else open.forEach(line);
      return out.join("\n");
    }
    _print() {
      const c = this._c;
      if (this._pstate === "busy") return;
      const open = this._items().filter((i) => !i.done);
      runPrint(
        this,
        this._h,
        c.print_script,
        {
          [c.print_field || "text"]: this._text(),
          items: open.map((i) => ({ name: i.name, qty: i.qty, unit: i.unit, store: this._store(i.store)?.name || "", note: toPlain(i.note) }))
        },
        (st) => {
          this._pstate = st;
          this._render();
        }
      );
    }
  };
  define("shopping-card", NovaShoppingCard, { name: "Nova Einkauf Card", description: "Einkaufsliste mit Menge, Einheit, Geschäft, Icon oder eigenem Bild und Notiz: nach Geschäft gruppiert, abhaken, zuletzt Gekauftes als Schnellauswahl, auf allen Geräten gleich (Nova-Integration), optional mit todo-Liste für Assist und Druck-Knopf.", documentationURL: docUrl("nova-einkauf-card") });
  var GEN = [
    g2({ name: "name", selector: T }, { name: "icon", selector: I }),
    { name: "show_header", selector: { boolean: {} } },
    { name: "placeholder", selector: T }
  ];
  var LIST = (stores) => [
    g2({ name: "group", selector: { boolean: {} } }, { name: "show_images", selector: { boolean: {} } }),
    g2({ name: "show_completed", selector: { boolean: {} } }, { name: "show_suggestions", selector: { boolean: {} } }),
    ...stores.length ? [sel("default_store", [["", "Keins"], ...stores.map((s) => [s.id, s.name])])] : [],
    { name: "height", selector: { number: { min: 200, max: 1e3, step: 10, mode: "box", unit_of_measurement: "px" } } }
  ];
  var SYNC = [{ name: "entity", selector: { entity: { domain: "todo" } } }];
  var PRINT = printSchema([{ name: "print_field", selector: T }]);
  var LABELS = {
    ...BASE_LABELS,
    ...PRINT_LABELS,
    name: "Titel der Karte",
    show_header: "Kopfzeile anzeigen",
    placeholder: "Platzhalter im Eingabefeld",
    group: "Nach Geschäft gruppieren",
    show_images: "Bilder anzeigen",
    show_completed: "Erledigte aufgeklappt",
    show_suggestions: "Schnellauswahl anzeigen",
    default_store: "Standard-Geschäft",
    height: "Mindesthöhe",
    entity: "todo-Liste zum Abgleichen",
    print_field: "Feldname im Skript"
  };
  var HELPERS = {
    ...PRINT_HELPERS,
    show_images: "Aus = statt eigener Bilder nur Icons.",
    show_completed: "Erledigte stehen unten und lassen sich in der Karte auf- und zuklappen.",
    show_suggestions: "Zuletzt gekaufte Artikel als Chips unter dem Eingabefeld.",
    default_store: "Für neue Artikel, die noch nie gekauft wurden.",
    height: "Im Raster füllt die Karte den Platz aus.",
    entity: "Optional, z. B. todo.shopping_list. Die Nova-Integration hält beide Listen gleich – so funktioniert „Setz Milch auf die Einkaufsliste“ weiter. Gilt für alle Einkauf-Karten.",
    print_field: "Unter diesem Namen bekommt das Skript die offene Liste als Klartext (Standard: text), zusätzlich „items“ als Liste."
  };
  var NovaShoppingCardEditor = class extends NovaEditorBase {
    set hass(h) {
      super.hass = h;
      if (!this._off && h && this.isConnected) this._off = watch(h, "shopping", this, (d) => {
        const k = JSON.stringify([d?.stores, d?.sync_entity]);
        if (k === this._sk) return;
        this._sk = k;
        this._shop = d;
        if (this._config) this._rebuild();
      });
    }
    disconnectedCallback() {
      super.disconnectedCallback();
      this._off?.();
      this._off = null;
    }
    _build() {
      const r = this.shadowRoot, c0 = this._config, d = this._shop;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), data = { ...SDEF, default_store: "", ...c0, ...d?.sync_entity ? { entity: d.sync_entity } : {} };
      const strip2 = (c) => {
        Object.entries(SDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        return c;
      };
      const form = (schema) => this._form(schema, data, (v) => this._emit(strip2(merge(this._config, names(schema), v))));
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(GEN))),
        this._section("list", "mdi:format-list-checks", "Liste", (b) => {
          if (d && !d.stores.length) b.append(this._hint("Geschäfte legst du in der Karte an: Artikel antippen → Geschäft → „Neu“. Danach lässt sich hier ein Standard-Geschäft wählen."));
          b.append(form(LIST(d?.stores || [])));
        }),
        this._section("sync", "mdi:sync", "Abgleich mit todo-Liste (Assist)", (b) => b.append(this._form(SYNC, data, (v) => {
          const id = v.entity || null;
          if (this._hass && (d?.sync_entity || null) !== id) shop.setSync(this._hass, id).catch((err) => console.warn("[nova-cards] Einkauf: todo-Abgleich nicht eingestellt", err));
          this._emit(strip2(merge(this._config, ["entity"], v)));
        }))),
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
.g.nt{gap:var(--nv-s5)}
.hd .rb{margin-left:auto}
.nl{display:flex;flex-direction:column;gap:var(--nv-s3)}
.nr{display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s5) var(--nv-s6) var(--nv-s5) var(--nv-s7);border-radius:var(--nv-r-md);flex:none;min-width:0;position:relative;
background:rgba(var(--nv-tint),.05);border:1px solid rgba(var(--nv-tint),.07);transition:background-color var(--nv-d3),border-color var(--nv-d3),transform var(--nv-d2) var(--nv-ease)}
.nr.new{animation:rb-in var(--nv-d5) var(--nv-ease) both;animation-delay:calc(var(--i,0) * 40ms)}
.nr:active{transform:scale(.985)}
.nr.pin{border-color:color-mix(in srgb,var(--nv-accent) 38%,transparent);background:color-mix(in srgb,var(--nv-accent) 9%,rgba(var(--nv-tint),.05))}
.nr .tx{flex:1;min-width:0}
.nr b{display:block;font-weight:var(--nv-fw-medium);font-size:var(--nv-fs-8);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.nr .pv{display:-webkit-box;-webkit-line-clamp:2;-webkit-box-orient:vertical;overflow:hidden;font-size:var(--nv-fs-4);opacity:.6;margin-top:var(--nv-s1);overflow-wrap:anywhere}
.nr time{font-size:var(--nv-fs-2);opacity:.5;white-space:nowrap;flex:none}
.nr .pi{--mdc-icon-size:16px;color:var(--nv-accent-ink);flex:none;transform:rotate(35deg)}
.nt.compact .nr{padding-top:var(--nv-s4);padding-bottom:var(--nv-s4)}
.nt.compact .nr .pv{display:none}
.more{align-self:center;border:0;background:transparent;color:inherit;font:inherit;font-size:var(--nv-fs-5);opacity:.7;padding:var(--nv-s4) var(--nv-s6);cursor:pointer;border-radius:var(--nv-r-pill);
display:inline-flex;align-items:center;gap:var(--nv-s2);-webkit-tap-highlight-color:transparent}
.more ha-icon{--mdc-icon-size:18px}
.more:focus-visible{box-shadow:var(--nv-focus);outline:none}
.ti{height:44px;border-radius:var(--nv-r-md);padding:0 var(--nv-s7);font-weight:var(--nv-fw-bold);flex:none}
.ed{flex:1 1 0;min-height:0;display:flex;flex-direction:column;gap:var(--nv-s4)}
.ed .rtw{flex:1 1 0;min-height:0;display:flex;flex-direction:column;gap:var(--nv-s4)}
.ed .rte{flex:1 1 0;min-height:0;overflow-y:auto;overscroll-behavior:auto contain;scrollbar-width:thin;border-radius:var(--nv-r-md);padding:var(--nv-s6) var(--nv-s7);
border:1px solid var(--nv-box-border);background:var(--nv-box);transition:border-color var(--nv-d2),box-shadow var(--nv-d2)}
.ed .rte:focus{border-color:color-mix(in srgb,var(--nv-active) 75%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 22%,transparent) var(--nv-glow),transparent)}
.bar .pb{width:44px;padding:0}
.rb.pinb.on ha-icon{transform:rotate(35deg)}
@media (prefers-reduced-motion:reduce){.nr.new{animation:none}}`;
  var NDEF = { name: "Notizen", icon: "mdi:note-multiple-outline", show_header: true, view: "full", max_notes: 0, height: 380, print_field: "text", ...PRINT_DEF };
  var SAVE_MS2 = 800;
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
      this._watch();
      if (hassChanged(old, h, this._ids)) this._render();
    }
    getCardSize() {
      return 6;
    }
    getGridOptions() {
      return { columns: 6, rows: "auto", min_columns: 3 };
    }
    connectedCallback() {
      this._watch();
    }
    disconnectedCallback() {
      this._flush();
      this._off?.();
      this._off = null;
      stopFeedback(this);
      clearTimeout(this._st);
      clearTimeout(this._okT);
      this._del?.reset();
    }
    _watch() {
      if (this._off || !this._h || !this.isConnected) return;
      this._off = watch(this._h, "notes", this, (d, err) => {
        this._data = d;
        this._err = err;
        this._onData();
      });
    }
    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${FIELD_CSS}${PRINT_CSS}${VIEW_CSS}${RICH_CSS}${NCSS}</style><div class="g nt">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<div class="stage"><div class="view main"><div class="scroll"><div class="nl"></div></div></div>
<div class="view side"><div class="bar"></div><input class="fld ti" type="text" placeholder="Titel" maxlength="200" enterkeyhint="next" autocomplete="off"><div class="ed"></div></div></div></div>`;
      const q = (s) => r.querySelector(s);
      const e = this._e = { g: q(".g"), hd: q(".hd"), ic: q(".hd .ic"), name: q(".hd b"), sub: q(".hd small"), nl: q(".nl"), bar: q(".bar"), ti: q(".ti"), ed: q(".ed") };
      this._pstate = "idle";
      this._all = false;
      this._seen = /* @__PURE__ */ new Set();
      e.add = roundBtn("mdi:plus", "Neue Notiz", () => this._open(null), "plus");
      e.hd.append(e.add);
      e.back = roundBtn("mdi:arrow-left", "Zurück zur Liste", () => this._close());
      e.state = document.createElement("div");
      e.state.className = "state sp";
      e.pin = roundBtn("mdi:pin-outline", "Anpinnen", () => this._togglePin(), "pinb");
      this._pb = printButton(() => this._print());
      this._del = armButton("mdi:delete-outline", "Löschen", () => this._remove());
      e.bar.append(e.back, e.state, e.pin, this._pb, this._del);
      this._rt = richEditor({ placeholder: "Notiz schreiben …", onInput: () => this._dirty() });
      e.ed.append(this._rt.el);
      e.ti.addEventListener("input", () => this._dirty());
      e.ti.addEventListener("keydown", (ev) => {
        ev.stopPropagation();
        if (ev.key === "Enter") {
          ev.preventDefault();
          this._rt.focus();
        }
      });
      this._apply();
    }
    _apply() {
      const c = this._c, e = this._e;
      e.hd.hidden = c.show_header === false;
      e.g.classList.toggle("compact", c.view === "compact");
      e.g.style.setProperty("--vh", `${Math.max(160, +c.height || NDEF.height)}px`);
      this._key = null;
      this._render();
    }
    _list() {
      return [...this._data?.notes || []].sort((a, b) => b.pinned - a.pinned || b.updated - a.updated);
    }
    _onData() {
      const cur2 = this._cur && this._data?.notes.find((n) => n.id === this._cur.id);
      if (this._cur?.id && this._data && !cur2) {
        this._cur = null;
        this._e?.g.classList.remove("detail");
      } else if (cur2 && !this._pending && !this._saving && cur2.updated !== this._cur.updated) {
        this._cur = { ...cur2 };
        this._fill();
      }
      this._render();
    }
    _render() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !c || !e) return;
      setIcon(e.ic, c.icon);
      e.name.textContent = c.name || NDEF.name;
      const list2 = this._list(), n = list2.length;
      e.sub.textContent = this._err ? "" : !this._data ? "Wird geladen …" : n ? `${n} ${n === 1 ? "Notiz" : "Notizen"}` : "Noch leer";
      e.add.disabled = !this._data;
      const max = Math.max(0, +c.max_notes || 0), cut = max && !this._all && n > max ? list2.slice(0, max) : list2;
      let msg = null;
      if (this._err) msg = storeHint(this._err, "notes");
      else if (!this._data) msg = ["mdi:timer-sand", "Wird geladen …"];
      else if (!n) msg = ["mdi:note-plus-outline", "Noch keine Notizen – mit + legst du die erste an."];
      const key = JSON.stringify([msg, cut.map((x) => [x.id, x.title, x.body, x.pinned, ago(x.updated)]), n, this._all, c.view]);
      if (key !== this._key) {
        this._key = key;
        if (msg) {
          const m = document.createElement("div");
          m.className = "msg";
          m.innerHTML = "<ha-icon></ha-icon><span></span>";
          m.firstChild.setAttribute("icon", msg[0]);
          m.lastChild.textContent = msg[1];
          e.nl.replaceChildren(m);
        } else {
          const rows = cut.map((x, i) => this._row(x, i));
          if (max && n > max) {
            const b = document.createElement("button");
            b.type = "button";
            b.className = "more";
            b.innerHTML = `<ha-icon icon="${this._all ? "mdi:chevron-up" : "mdi:chevron-down"}"></ha-icon><span></span>`;
            b.lastChild.textContent = this._all ? "Weniger anzeigen" : `${n - max} weitere anzeigen`;
            b.addEventListener("click", () => {
              this._all = !this._all;
              this._render();
            });
            rows.push(b);
          }
          e.nl.replaceChildren(...rows);
        }
      }
      this._paintBar();
    }
    _row(x, i) {
      const el2 = document.createElement("div");
      el2.className = `nr${x.pinned ? " pin" : ""}${this._seen.has(x.id) ? "" : " new"}`;
      this._seen.add(x.id);
      el2.style.setProperty("--i", Math.min(i, 8));
      el2.innerHTML = `${x.pinned ? '<ha-icon class="pi" icon="mdi:pin"></ha-icon>' : ""}<div class="tx"><b></b><div class="pv"></div></div><time></time>`;
      const lines = toPlain(x.body).split("\n").map((l) => l.replace(/^(\[.?\]|•)\s*/, "").trim()).filter(Boolean);
      el2.querySelector("b").textContent = x.title || lines[0] || "Ohne Titel";
      el2.querySelector(".pv").textContent = (x.title ? lines : lines.slice(1)).join(" · ");
      el2.querySelector("time").textContent = ago(x.updated);
      press(el2, { tap: () => this._open(x) });
      return el2;
    }
    /* ----- Detail ----- */
    _open(note) {
      if (!this._data) return;
      this._flush();
      this._cur = note ? { ...note } : { id: null, title: "", body: "", pinned: false, updated: 0 };
      this._fill();
      this._e.g.classList.add("detail");
      this._del.reset();
      this._paintBar();
      if (!note) setTimeout(() => this._e.ti.focus({ preventScroll: true }), 320);
    }
    _fill() {
      const e = this._e, x = this._cur;
      if (e.ti.value !== x.title) e.ti.value = x.title || "";
      this._rt.set(x.body || "");
    }
    _close() {
      this._flush();
      this._e.g.classList.remove("detail");
      this._cur = null;
      this._render();
    }
    _dirty() {
      this._pending = true;
      clearTimeout(this._st);
      this._st = setTimeout(() => this._flush(), SAVE_MS2);
      this._paintBar();
    }
    // Ausstehende Änderung jetzt speichern. Leere neue Notizen werden gar nicht erst angelegt.
    _flush(extra) {
      clearTimeout(this._st);
      const x = this._cur, h = this._h;
      if (!x || !h || !this._pending && !extra) return;
      this._pending = false;
      const title = this._e.ti.value.trim(), body = this._rt.get();
      if (!x.id && !title && isEmpty(body)) {
        this._paintBar();
        return;
      }
      Object.assign(x, { title, body }, extra);
      const send = { ...x.id ? { id: x.id } : {}, title, body, pinned: !!x.pinned };
      this._saving = (this._saving || 0) + 1;
      const run = this._chain = (this._chain || Promise.resolve()).then(() => notes.save(h, { ...send, ...x.id ? { id: x.id } : {} })).then((n) => {
        x.id = n.id;
        x.updated = n.updated;
        this._saved = "ok";
        clearTimeout(this._okT);
        this._okT = setTimeout(() => {
          this._saved = null;
          this._paintBar();
        }, 2500);
      }).catch((err) => {
        console.warn("[nova-cards] Notiz: Speichern fehlgeschlagen", err);
        this._saved = "err";
      }).finally(() => {
        this._saving--;
        if (this._chain === run) this._chain = null;
        this._paintBar();
      });
      this._paintBar();
    }
    _paintBar() {
      const e = this._e, x = this._cur, c = this._c, h = this._h;
      if (!e || !x) return;
      const st = this._pending || this._saving ? ["mdi:cloud-sync-outline", "Speichert …", ""] : this._saved === "err" ? ["mdi:alert-circle-outline", "Nicht gespeichert", "err"] : this._saved === "ok" ? ["mdi:check-circle-outline", "Gespeichert", "ok"] : x.updated ? ["mdi:clock-outline", `Geändert ${ago(x.updated)}`, ""] : ["mdi:pencil-outline", "Neue Notiz", ""];
      const k = st.join("|");
      if (e.state._k !== k) {
        e.state._k = k;
        e.state.className = `state sp ${st[2]}`;
        e.state.innerHTML = `<ha-icon icon="${st[0]}"></ha-icon><span></span>`;
        e.state.lastChild.textContent = st[1];
      }
      e.pin.classList.toggle("on", !!x.pinned);
      setBtnIcon(e.pin, x.pinned ? "mdi:pin" : "mdi:pin-outline");
      e.pin.title = x.pinned ? "Nicht mehr anpinnen" : "Anpinnen";
      const has = !!this._e.ti.value.trim() || !isEmpty(this._rt.get());
      this._pb.hidden = !c.print_script;
      paintBtn(
        this._pb,
        { icon: c.print_icon || PRINT_DEF.print_icon, label: c.print_label || PRINT_DEF.print_label, pill: false, busy: "Druckt …", ok: "Gedruckt", err: "Fehler" },
        this._pstate,
        has && !!h.states[c.print_script]
      );
      this._del.hidden = !x.id;
    }
    _togglePin() {
      const x = this._cur;
      if (!x) return;
      this._flush({ pinned: !x.pinned });
    }
    _remove() {
      const x = this._cur, h = this._h;
      if (!x?.id) return;
      clearTimeout(this._st);
      this._pending = false;
      this._cur = null;
      this._e.g.classList.remove("detail");
      notes.remove(h, x.id).catch((err) => console.warn("[nova-cards] Notiz: Löschen fehlgeschlagen", err));
      this._render();
    }
    // Titel + Text als Klartext ans Druck-Skript
    _print() {
      const c = this._c;
      if (this._pstate === "busy") return;
      const title = this._e.ti.value.trim(), body = toPlain(this._rt.get()), txt = [title, body].filter(Boolean).join("\n\n");
      if (!txt) return;
      runPrint(this, this._h, c.print_script, { [c.print_field || "text"]: txt }, (st) => {
        this._pstate = st;
        this._paintBar();
      });
    }
  };
  define("note-card", NovaNoteCard, { name: "Nova Notiz Card", description: "Notizen mit Titel und formatiertem Text (Fett, Listen, Checklisten): Liste und Detailansicht, anpinnen, auf allen Geräten gleich (Nova-Integration), mit Druck-Knopf z. B. für einen Bondrucker.", documentationURL: docUrl("nova-notiz-card") });
  var GEN2 = [
    g2({ name: "name", selector: T }, { name: "icon", selector: I }),
    { name: "show_header", selector: { boolean: {} } }
  ];
  var VIEW = [
    sel("view", [["full", "Voll (Titel, Vorschau, Datum)"], ["compact", "Kompakt (nur Titel und Datum)"]]),
    g2(
      { name: "max_notes", selector: { number: { min: 0, max: 50, step: 1, mode: "box" } } },
      { name: "height", selector: { number: { min: 160, max: 1e3, step: 10, mode: "box", unit_of_measurement: "px" } } }
    )
  ];
  var PRINT2 = printSchema([{ name: "print_field", selector: T }]).filter((f) => f.name !== "print_style");
  var LABELS2 = {
    ...BASE_LABELS,
    ...PRINT_LABELS,
    name: "Titel der Karte",
    show_header: "Kopfzeile anzeigen",
    view: "Ansicht der Liste",
    max_notes: "Max. sichtbare Notizen",
    height: "Mindesthöhe",
    print_field: "Feldname im Skript"
  };
  var HELPERS2 = {
    ...PRINT_HELPERS,
    max_notes: "0 = alle. Weitere Notizen lassen sich in der Karte aufklappen.",
    height: "Im Raster füllt die Karte den Platz aus.",
    print_field: "Unter diesem Namen bekommt das Skript Titel und Text als Klartext (Standard: text).",
    print_script: "Leer = kein Druck-Knopf. Der Knopf sitzt in der geöffneten Notiz."
  };
  var NovaNoteCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), data = { ...NDEF, ...c0 };
      const strip2 = (c) => {
        Object.entries(NDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        return c;
      };
      const form = (schema) => this._form(schema, data, (v) => this._emit(strip2(merge(this._config, names(schema), v))));
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(GEN2))),
        this._section("view", "mdi:view-list-outline", "Ansicht", (b) => b.append(form(VIEW))),
        this._section("print", "mdi:printer-pos", "Drucken", (b) => b.append(form(PRINT2)))
      );
    }
  };
  __publicField(NovaNoteCardEditor, "labels", LABELS2);
  __publicField(NovaNoteCardEditor, "helpers", HELPERS2);
  __publicField(NovaNoteCardEditor, "openSections", ["general"]);
  define("note-card-editor", NovaNoteCardEditor);

  // src/shared/recipe-util.js
  var num2 = (q) => String(Math.round((+q || 0) * 100) / 100).replace(".", ",");
  var amount = (ing, k = 1) => ing.qty == null ? ing.unit || "" : `${num2(ing.qty * k)}${ing.unit ? ` ${ing.unit}` : ""}`;
  var mins = (t) => t >= 60 ? `${Math.floor(t / 60)} Std${t % 60 ? ` ${t % 60} Min` : ""}` : `${t} Min`;
  var ingredientLine = (ing) => [amount(ing), ing.name].filter(Boolean).join(" ");
  function parseIngredient(line, units = []) {
    const s = String(line || "").trim();
    if (!s) return null;
    const m = /^(\d+(?:[.,]\d+)?)\s*(.*)$/.exec(s);
    if (!m || !m[2]) return { qty: null, unit: "", name: s };
    const [first, ...rest] = m[2].split(/\s+/);
    const unit = rest.length ? units.find((u) => u && u.toLowerCase() === first.toLowerCase()) : null;
    return { qty: parseFloat(m[1].replace(",", ".")), unit: unit || "", name: unit ? rest.join(" ") : m[2] };
  }

  // src/recipe.js
  var RCSS = `
.g.rc{gap:var(--nv-s5)}
.hd .rb{margin-left:auto}
.srch{height:44px;border-radius:var(--nv-r-pill);padding:0 var(--nv-s8);flex:none}
.tags{display:flex;gap:var(--nv-s3);overflow-x:auto;flex:none;scrollbar-width:none;margin:0 calc(var(--nv-s2) * -1);padding:var(--nv-s1) var(--nv-s2);
-webkit-mask-image:linear-gradient(90deg,#000 calc(100% - 24px),transparent);mask-image:linear-gradient(90deg,#000 calc(100% - 24px),transparent)}
.tags::-webkit-scrollbar{display:none}
.tags:empty{display:none}
.chip{display:inline-flex;align-items:center;gap:var(--nv-s2);height:38px;padding:0 var(--nv-s6);border-radius:var(--nv-r-pill);flex:none;cursor:pointer;
border:1px solid rgba(var(--nv-tint),.1);background:var(--nv-chip);color:inherit;font:inherit;font-size:var(--nv-fs-6);white-space:nowrap;-webkit-tap-highlight-color:transparent;
transition:transform var(--nv-d2) var(--nv-ease),background-color var(--nv-d2),border-color var(--nv-d2),box-shadow var(--nv-d2)}
.chip:active{transform:scale(var(--nv-press))}
.chip ha-icon{--mdc-icon-size:17px}
.chip.on{background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));border-color:transparent;color:color-mix(in srgb,var(--nv-active-fg) var(--nv-fill-ink),var(--nv-fg));
box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
.chip.ro{cursor:default;height:30px;font-size:var(--nv-fs-4);padding:0 var(--nv-s5)}
.rl{display:flex;flex-direction:column;gap:var(--nv-s3)}
.rc.grid .rl{display:grid;grid-template-columns:repeat(auto-fill,minmax(140px,1fr));gap:var(--nv-s4)}
.rr{display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s3);padding-right:var(--nv-s6);border-radius:var(--nv-r-md);min-width:0;position:relative;overflow:hidden;
background:rgba(var(--nv-tint),.05);border:1px solid rgba(var(--nv-tint),.07);transition:transform var(--nv-d2) var(--nv-ease),border-color var(--nv-d3)}
.rr.new{animation:rb-in var(--nv-d5) var(--nv-ease) both;animation-delay:calc(var(--i,0) * 40ms)}
.rr:active{transform:scale(.98)}
.rr .im{width:56px;height:56px;border-radius:var(--nv-r-sm);flex:none;display:flex;align-items:center;justify-content:center;background:rgba(var(--nv-tint),.08);overflow:hidden}
.rr .im img{width:100%;height:100%;object-fit:cover;transition:transform var(--nv-d6) var(--nv-ease)}
.rr .im ha-icon{--mdc-icon-size:26px;opacity:.5}
.rr .tx{flex:1;min-width:0}
.rr b{display:block;font-weight:var(--nv-fw-medium);font-size:var(--nv-fs-8);overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.rr small{display:flex;gap:var(--nv-s4);align-items:center;font-size:var(--nv-fs-3);opacity:.6;margin-top:var(--nv-s1);white-space:nowrap;overflow:hidden}
.rr small ha-icon{--mdc-icon-size:13px}
.rr small span{display:inline-flex;gap:var(--nv-s1);align-items:center}
.rr .fav{--mdc-icon-size:18px;color:var(--nv-error);flex:none}
.rc.grid .rr{flex-direction:column;align-items:stretch;padding:0;gap:0}
.rc.grid .rr .im{width:auto;height:auto;aspect-ratio:4/3;border-radius:0}
.rc.grid .rr .tx{padding:var(--nv-s4) var(--nv-s5) var(--nv-s5)}
.rc.grid .rr .fav{position:absolute;top:var(--nv-s4);right:var(--nv-s4);filter:drop-shadow(0 1px 2px rgba(var(--nv-shade),.6))}
.rd{display:flex;flex-direction:column;gap:var(--nv-s6);padding-bottom:var(--nv-s6)}
.hero{border-radius:var(--nv-r-md);overflow:hidden;aspect-ratio:16/9;flex:none;background:rgba(var(--nv-tint),.08);animation:rc-hero var(--nv-d6) var(--nv-ease)}
.hero img{width:100%;height:100%;object-fit:cover;display:block}
.rd h2{margin:0;font-size:var(--nv-fd-1);font-weight:var(--nv-fw-heavy);line-height:1.2;overflow-wrap:anywhere}
.meta{display:flex;gap:var(--nv-s3);flex-wrap:wrap}
.lb{font-size:var(--nv-fs-3);font-weight:var(--nv-fw-bold);opacity:.6;text-transform:uppercase;letter-spacing:var(--nv-caps);display:flex;align-items:center;gap:var(--nv-s4)}
.lb .sp{flex:1}
.qt{display:flex;align-items:center;flex:none;border-radius:var(--nv-r-pill);background:var(--nv-chip);border:1px solid rgba(var(--nv-tint),.08);text-transform:none;letter-spacing:0;opacity:1}
.qt button{width:44px;height:40px;border:0;background:transparent;color:inherit;display:flex;align-items:center;justify-content:center;cursor:pointer;padding:0;border-radius:var(--nv-r-pill);
-webkit-tap-highlight-color:transparent;outline:none;transition:transform var(--nv-d2) var(--nv-ease)}
.qt button:active{transform:scale(.8)}
.qt button:focus-visible{box-shadow:var(--nv-focus)}
.qt button ha-icon{--mdc-icon-size:18px}
.qt span{min-width:74px;text-align:center;font-size:var(--nv-fs-6);font-weight:var(--nv-fw-bold);white-space:nowrap}
.ing{display:flex;flex-direction:column}
.ig{display:flex;align-items:center;gap:var(--nv-s5);min-height:44px;border-top:1px solid rgba(var(--nv-tint),.08);cursor:pointer;-webkit-tap-highlight-color:transparent;outline:none}
.ig:first-child{border-top:0}
.ig:focus-visible{box-shadow:var(--nv-focus)}
.ig .ck{width:22px;height:22px;border-radius:50%;box-sizing:border-box;border:2px solid rgba(var(--nv-tint),.45);flex:none;display:flex;align-items:center;justify-content:center;
transition:background-color var(--nv-d3),border-color var(--nv-d3),transform var(--nv-d2) var(--nv-ease)}
.ig .ck ha-icon{--mdc-icon-size:15px;opacity:0;transform:scale(.3);transition:opacity var(--nv-d2),transform var(--nv-d4) var(--nv-ease)}
.ig.on .ck{background:var(--nv-active);border-color:var(--nv-active);color:var(--nv-active-fg)}
.ig.on .ck ha-icon{opacity:1;transform:none}
.ig .q{min-width:68px;font-weight:var(--nv-fw-bold);font-size:var(--nv-fs-7);font-variant-numeric:tabular-nums;white-space:nowrap}
.ig .q.bump{animation:rc-bump var(--nv-d4) var(--nv-ease)}
.ig .n{flex:1;min-width:0;font-size:var(--nv-fs-8);overflow-wrap:anywhere}
.ig:not(.on) .n,.ig:not(.on) .q{opacity:.5}
.tolist{align-self:stretch}
.tolist.pb.pill{flex:none;width:100%}
.form{display:flex;flex-direction:column;gap:var(--nv-s5);padding-bottom:var(--nv-s6)}
.form .fld{height:44px;border-radius:var(--nv-r-md);padding:0 var(--nv-s6)}
.form .ti{font-weight:var(--nv-fw-bold)}
.form .two{display:grid;grid-template-columns:1fr 1fr;gap:var(--nv-s4)}
.form label{display:flex;flex-direction:column;gap:var(--nv-s2);font-size:var(--nv-fs-3);opacity:.9;min-width:0}
.form label span{opacity:.65;font-weight:var(--nv-fw-bold);text-transform:uppercase;letter-spacing:var(--nv-caps)}
.ie{display:grid;grid-template-columns:64px 84px minmax(0,1fr) 40px;gap:var(--nv-s3);align-items:center}
.ie .fld{padding:0 var(--nv-s4);text-overflow:ellipsis}
.ie select.fld{padding-right:var(--nv-s1)}
.ie select option{color:initial}
.addi{align-self:flex-start}
.form .rte{min-height:120px;border-radius:var(--nv-r-md);padding:var(--nv-s5) var(--nv-s7);border:1px solid var(--nv-box-border);background:var(--nv-box);margin-top:var(--nv-s3);
transition:border-color var(--nv-d2),box-shadow var(--nv-d2)}
.form .rte:focus{border-color:color-mix(in srgb,var(--nv-active) 75%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 22%,transparent) var(--nv-glow),transparent)}
.rb.favb.on{background:color-mix(in srgb,var(--nv-error) 22%,var(--nv-chip));color:var(--nv-error);border-color:color-mix(in srgb,var(--nv-error) 55%,transparent);box-shadow:none}
.rb.favb.on ha-icon{animation:rb-pop var(--nv-d5) var(--nv-ease)}
.bar .pb{width:44px;padding:0}
@keyframes rc-hero{from{opacity:0;transform:scale(1.04)}to{opacity:1;transform:none}}
@keyframes rc-bump{0%{transform:scale(1)}40%{transform:scale(1.18)}100%{transform:scale(1)}}
@media (prefers-reduced-motion:reduce){.rr.new,.hero,.ig .q.bump,.rb.favb.on ha-icon{animation:none}}`;
  var RDEF = { name: "Rezepte", icon: "mdi:chef-hat", show_header: true, view: "list", show_search: true, height: 420, print_field: "text", ...PRINT_DEF };
  var SAVE_MS3 = 800;
  var NovaRecipeCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("recipe-card-editor"));
    }
    static getStubConfig() {
      return {};
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      this._c = { ...RDEF, ...c };
      this._ids = [this._c.print_script].filter(Boolean);
      if (this._e) this._apply();
    }
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (!this._c) return;
      if (!this._e) this._build();
      this._watch();
      this._picker?.setHass(h);
      if (hassChanged(old, h, this._ids)) this._render();
    }
    getCardSize() {
      return 8;
    }
    getGridOptions() {
      return { columns: 6, rows: "auto", min_columns: 3 };
    }
    connectedCallback() {
      this._watch();
    }
    disconnectedCallback() {
      this._flush();
      this._off?.();
      this._off = null;
      stopFeedback(this);
      clearTimeout(this._st);
      clearTimeout(this._okT);
      this._del?.reset();
    }
    _watch() {
      if (this._off || !this._h || !this.isConnected) return;
      this._off = watch(this._h, "recipes", this, (d, err) => {
        this._data = d;
        this._err = err;
        this._onData();
      });
    }
    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${FIELD_CSS}${PRINT_CSS}${VIEW_CSS}${RICH_CSS}${PICK_MEDIA_CSS}${RCSS}</style><div class="g rc">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<div class="stage"><div class="view main"><input class="fld srch" type="search" placeholder="Rezept suchen …" autocomplete="off" enterkeyhint="search">
<div class="tags"></div><div class="scroll"><div class="rl"></div></div></div>
<div class="view side"><div class="bar"></div><div class="scroll"><div class="body"></div></div></div></div></div>`;
      const q = (s) => r.querySelector(s);
      const e = this._e = { g: q(".g"), hd: q(".hd"), ic: q(".hd .ic"), name: q(".hd b"), sub: q(".hd small"), srch: q(".srch"), tags: q(".tags"), rl: q(".rl"), bar: q(".bar"), body: q(".body") };
      this._seen = /* @__PURE__ */ new Set();
      this._pstate = "idle";
      this._lstate = "idle";
      this._tag = null;
      this._favOnly = false;
      e.add = roundBtn("mdi:plus", "Neues Rezept", () => this._edit(null), "plus");
      e.hd.append(e.add);
      e.srch.addEventListener("input", () => this._render());
      e.srch.addEventListener("keydown", (ev) => ev.stopPropagation());
      e.back = roundBtn("mdi:arrow-left", "Zurück", () => this._back());
      e.state = document.createElement("div");
      e.state.className = "state sp";
      e.fav = roundBtn("mdi:heart-outline", "Favorit", () => this._toggleFav(), "favb");
      e.edit = roundBtn("mdi:pencil-outline", "Bearbeiten", () => this._edit(this._cur));
      this._pb = printButton(() => this._print());
      this._del = armButton("mdi:delete-outline", "Rezept löschen", () => this._remove());
      e.bar.append(e.back, e.state, e.fav, e.edit, this._pb, this._del);
      this._apply();
    }
    _apply() {
      const c = this._c, e = this._e;
      e.hd.hidden = c.show_header === false;
      e.srch.hidden = c.show_search === false;
      e.g.classList.toggle("grid", c.view === "grid");
      e.g.style.setProperty("--vh", `${Math.max(240, +c.height || RDEF.height)}px`);
      this._key = null;
      this._render();
    }
    _onData() {
      const d = this._data, cur2 = this._cur?.id && d?.recipes.find((x) => x.id === this._cur.id);
      if (this._cur?.id && d && !cur2) {
        this._cur = null;
        this._mode = null;
        this._e?.g.classList.remove("detail");
      } else if (cur2 && this._mode === "read" && cur2.updated !== this._cur.updated) {
        this._cur = cur2;
        this._read();
      }
      this._render();
    }
    _img(x) {
      return x.image ? imageUrl(this._h, "recipes", x.image) : "";
    }
    /* ----- Liste ----- */
    _render() {
      const h = this._h, c = this._c, e = this._e;
      if (!h || !c || !e) return;
      setIcon(e.ic, c.icon);
      e.name.textContent = c.name || RDEF.name;
      const all = this._data?.recipes || [], n = all.length;
      e.sub.textContent = this._err ? "" : !this._data ? "Wird geladen …" : n ? `${n} ${n === 1 ? "Rezept" : "Rezepte"}` : "Noch leer";
      e.add.disabled = !this._data;
      const tags = [...new Set(all.flatMap((x) => x.tags || []))].sort((a, b) => a.localeCompare(b, "de"));
      if (this._tag && !tags.includes(this._tag)) this._tag = null;
      const q = e.srch.value.trim().toLowerCase();
      const list2 = all.filter((x) => (!this._favOnly || x.favorite) && (!this._tag || x.tags?.includes(this._tag)) && (!q || x.title.toLowerCase().includes(q) || x.tags?.some((t) => t.toLowerCase().includes(q)) || x.ingredients?.some((i) => i.name.toLowerCase().includes(q)))).sort((a, b) => b.favorite - a.favorite || a.title.localeCompare(b.title, "de"));
      let msg = null;
      if (this._err) msg = storeHint(this._err, "recipes");
      else if (!this._data) msg = ["mdi:timer-sand", "Wird geladen …"];
      else if (!n) msg = ["mdi:book-plus-outline", "Noch keine Rezepte – mit + legst du das erste an."];
      else if (!list2.length) msg = ["mdi:magnify-close", "Kein Rezept gefunden"];
      const key = JSON.stringify([msg, list2.map((x) => [x.id, x.title, x.image, x.time, x.servings, x.favorite]), tags, this._tag, this._favOnly, c.view]);
      if (key !== this._key) {
        this._key = key;
        const chip = (label, on, fn, icon2) => {
          const b = document.createElement("button");
          b.type = "button";
          b.className = `chip${on ? " on" : ""}`;
          if (icon2) {
            const i = document.createElement("ha-icon");
            i.setAttribute("icon", icon2);
            b.append(i);
          }
          b.append(document.createTextNode(label));
          b.addEventListener("click", fn);
          return b;
        };
        e.tags.replaceChildren(...n && (tags.length || all.some((x) => x.favorite)) ? [
          ...all.some((x) => x.favorite) ? [chip("Favoriten", this._favOnly, () => {
            this._favOnly = !this._favOnly;
            this._render();
          }, this._favOnly ? "mdi:heart" : "mdi:heart-outline")] : [],
          ...tags.map((t) => chip(t, this._tag === t, () => {
            this._tag = this._tag === t ? null : t;
            this._render();
          }))
        ] : []);
        if (msg) {
          const m = document.createElement("div");
          m.className = "msg";
          m.innerHTML = "<ha-icon></ha-icon><span></span>";
          m.firstChild.setAttribute("icon", msg[0]);
          m.lastChild.textContent = msg[1];
          e.rl.replaceChildren(m);
        } else e.rl.replaceChildren(...list2.map((x, i) => this._row(x, i)));
      }
      this._paintBar();
    }
    _row(x, i) {
      const el2 = document.createElement("div");
      el2.className = `rr${this._seen.has(x.id) ? "" : " new"}`;
      this._seen.add(x.id);
      el2.style.setProperty("--i", Math.min(i, 8));
      el2.innerHTML = `<div class="im"></div><div class="tx"><b></b><small></small></div>${x.favorite ? '<ha-icon class="fav" icon="mdi:heart"></ha-icon>' : ""}`;
      const im = el2.firstChild, src = this._img(x);
      if (src) {
        const g = document.createElement("img");
        g.alt = "";
        g.loading = "lazy";
        g.src = src;
        im.append(g);
      } else im.innerHTML = '<ha-icon icon="mdi:silverware-fork-knife"></ha-icon>';
      el2.querySelector("b").textContent = x.title;
      const sm = el2.querySelector("small");
      const meta = (icon2, t) => {
        const s = document.createElement("span");
        s.innerHTML = `<ha-icon icon="${icon2}"></ha-icon>`;
        s.append(document.createTextNode(t));
        sm.append(s);
      };
      if (x.time) meta("mdi:clock-outline", mins(x.time));
      meta("mdi:account-multiple-outline", `${x.servings}`);
      if (x.ingredients?.length) meta("mdi:format-list-bulleted", `${x.ingredients.length}`);
      press(el2, { tap: () => this._show(x) });
      return el2;
    }
    /* ----- Rezept lesen ----- */
    _show(x) {
      this._cur = x;
      this._servings = x.servings;
      this._pick = new Set((x.ingredients || []).map((_, i) => i));
      this._read();
      this._e.g.classList.add("detail");
    }
    _read() {
      const e = this._e, x = this._cur;
      this._mode = "read";
      this._picker = null;
      const body = document.createElement("div");
      body.className = "rd";
      const src = this._img(x);
      if (src) {
        const hero = document.createElement("div");
        hero.className = "hero";
        const g = document.createElement("img");
        g.alt = "";
        g.src = src;
        hero.append(g);
        body.append(hero);
      }
      const h2 = document.createElement("h2");
      h2.textContent = x.title;
      body.append(h2);
      const meta = document.createElement("div");
      meta.className = "meta";
      const ro = (t, icon2) => {
        const s = document.createElement("span");
        s.className = "chip ro";
        if (icon2) s.innerHTML = `<ha-icon icon="${icon2}"></ha-icon>`;
        s.append(document.createTextNode(t));
        meta.append(s);
      };
      if (x.time) ro(mins(x.time), "mdi:clock-outline");
      (x.tags || []).forEach((t) => ro(t));
      if (meta.childNodes.length) body.append(meta);
      if (x.ingredients?.length) {
        const lb = document.createElement("div");
        lb.className = "lb";
        lb.innerHTML = '<span>Zutaten</span><span class="sp"></span><div class="qt"><button type="button" aria-label="Weniger Portionen"><ha-icon icon="mdi:minus"></ha-icon></button><span></span><button type="button" aria-label="Mehr Portionen"><ha-icon icon="mdi:plus"></ha-icon></button></div>';
        const qt = lb.querySelector(".qt");
        this._sv = qt.children[1];
        qt.children[0].addEventListener("click", () => this._setServings(this._servings - 1));
        qt.children[2].addEventListener("click", () => this._setServings(this._servings + 1));
        this._ing = document.createElement("div");
        this._ing.className = "ing";
        this._lb = printButton(() => this._toList());
        this._lb.classList.add("tolist");
        body.append(lb, this._ing, this._lb);
        this._paintIng();
      }
      if (x.steps) {
        const lb = document.createElement("div");
        lb.className = "lb";
        lb.textContent = "Zubereitung";
        const st = document.createElement("div");
        richView(st, x.steps, () => {
        });
        body.append(lb, st);
      }
      e.body.replaceChildren(body);
      e.body.parentElement.scrollTop = 0;
      this._del.reset();
      this._paintBar();
    }
    _setServings(n) {
      n = Math.max(1, Math.min(99, n));
      if (n === this._servings) return;
      this._servings = n;
      this._paintIng(true);
    }
    _paintIng(bump) {
      const x = this._cur, k = this._servings / (x.servings || 1);
      this._sv.textContent = `${this._servings} ${this._servings === 1 ? "Portion" : "Portionen"}`;
      this._ing.replaceChildren(...x.ingredients.map((ing, i) => {
        const el2 = document.createElement("div");
        el2.className = `ig${this._pick.has(i) ? " on" : ""}`;
        el2.tabIndex = 0;
        el2.setAttribute("role", "checkbox");
        el2.setAttribute("aria-checked", this._pick.has(i));
        el2.innerHTML = `<span class="ck"><ha-icon icon="mdi:check-bold"></ha-icon></span><span class="q${bump && ing.qty != null ? " bump" : ""}"></span><span class="n"></span>`;
        el2.children[1].textContent = amount(ing, k);
        el2.children[2].textContent = ing.name;
        const tog = () => {
          if (this._pick.has(i)) this._pick.delete(i);
          else this._pick.add(i);
          el2.classList.toggle("on");
          el2.setAttribute("aria-checked", this._pick.has(i));
          this._paintList();
        };
        el2.addEventListener("click", tog);
        el2.addEventListener("keydown", (ev) => {
          if (ev.key === " " || ev.key === "Enter") {
            ev.preventDefault();
            tog();
          }
        });
        return el2;
      }));
      this._paintList();
    }
    _paintList() {
      const n = this._pick.size;
      paintBtn(this._lb, {
        icon: "mdi:cart-plus",
        label: n ? `${n} ${n === 1 ? "Zutat" : "Zutaten"} auf die Einkaufsliste` : "Keine Zutat gewählt",
        pill: true,
        busy: "Wird eingetragen …",
        ok: "Steht auf der Liste",
        err: "Einkauf nicht erreichbar"
      }, this._lstate, n > 0);
      this._lb.classList.add("tolist");
    }
    _toList() {
      const x = this._cur;
      if (!x || !this._pick.size || this._lstate === "busy") return;
      const only = this._pick.size === x.ingredients.length ? null : [...this._pick].sort((a, b) => a - b);
      runFeedback(this, "list", () => recipes.toShopping(this._h, x.id, this._servings, only), (st) => {
        this._lstate = st;
        if (this._mode === "read" && this._lb?.isConnected) this._paintList();
      });
    }
    _toggleFav() {
      const x = this._cur;
      if (!x?.id) return;
      this._cur = { ...x, favorite: !x.favorite };
      this._paintBar();
      recipes.save(this._h, { id: x.id, favorite: !x.favorite }).catch((err) => console.warn("[nova-cards] Rezept: Favorit nicht gespeichert", err));
    }
    _back() {
      if (this._mode === "edit") {
        this._flush();
        const saved2 = this._draft?.id && (this._data?.recipes.find((r) => r.id === this._draft.id) || this._draft);
        this._draft = null;
        if (saved2) {
          this._cur = saved2;
          this._servings = saved2.servings;
          this._pick = new Set((saved2.ingredients || []).map((_, i) => i));
          this._read();
          return;
        }
      }
      this._e.g.classList.remove("detail");
      this._cur = null;
      this._mode = null;
      this._key = null;
      this._render();
    }
    /* ----- Rezept bearbeiten ----- */
    _edit(x) {
      if (!this._data) return;
      const e = this._e, d = this._draft = x ? JSON.parse(JSON.stringify(x)) : { id: null, title: "", image: null, servings: 2, time: null, tags: [], ingredients: [], steps: "", favorite: false };
      this._mode = "edit";
      this._cur = d;
      const f = document.createElement("div");
      f.className = "form";
      const field = (label, el2) => {
        const l = document.createElement("label");
        const s = document.createElement("span");
        s.textContent = label;
        l.append(s, el2);
        return l;
      };
      const inp = (v, attrs = {}) => {
        const i = document.createElement("input");
        i.className = "fld";
        Object.assign(i, { type: "text", autocomplete: "off", ...attrs });
        i.value = v ?? "";
        i.addEventListener("keydown", (ev) => ev.stopPropagation());
        return i;
      };
      const ti = inp(d.title, { maxLength: 200, placeholder: "Name des Rezepts" });
      ti.classList.add("ti");
      ti.addEventListener("input", () => {
        d.title = ti.value;
        this._dirty();
      });
      const sv = inp(d.servings, { type: "number", min: 1, max: 99, inputMode: "numeric" });
      sv.addEventListener("input", () => {
        d.servings = Math.max(1, Math.min(99, Math.round(+sv.value) || 1));
        this._dirty();
      });
      const tm = inp(d.time, { type: "number", min: 0, max: 6e3, inputMode: "numeric", placeholder: "–" });
      tm.addEventListener("input", () => {
        d.time = tm.value === "" ? null : Math.max(0, Math.round(+tm.value) || 0);
        this._dirty();
      });
      const two = document.createElement("div");
      two.className = "two";
      two.append(field("Portionen", sv), field("Zeit in Minuten", tm));
      const tg = inp((d.tags || []).join(", "), { placeholder: "z. B. schnell, vegetarisch" });
      tg.addEventListener("input", () => {
        d.tags = tg.value.split(",").map((s) => s.trim()).filter(Boolean);
        this._dirty();
      });
      const lb = (t) => {
        const l = document.createElement("div");
        l.className = "lb";
        l.textContent = t;
        return l;
      };
      const ings = document.createElement("div");
      ings.className = "form";
      const units = this._data.units || [""];
      const row = (ing) => {
        const el2 = document.createElement("div");
        el2.className = "ie";
        const q = inp(ing.qty == null ? "" : String(ing.qty).replace(".", ","), { inputMode: "decimal", placeholder: "Menge" });
        q.setAttribute("aria-label", "Menge");
        q.addEventListener("input", () => {
          const v = parseFloat(q.value.replace(",", "."));
          ing.qty = Number.isFinite(v) ? v : null;
          this._dirty();
        });
        const u = document.createElement("select");
        u.className = "fld";
        u.setAttribute("aria-label", "Einheit");
        units.forEach((x2) => {
          const o = document.createElement("option");
          o.value = x2;
          o.textContent = x2 || "–";
          u.append(o);
        });
        u.value = ing.unit || "";
        u.addEventListener("change", () => {
          ing.unit = u.value;
          this._dirty();
        });
        const n = inp(ing.name, { maxLength: 120, placeholder: "Zutat" });
        n.setAttribute("aria-label", "Zutat");
        n.addEventListener("input", () => {
          ing.name = n.value;
          this._dirty();
        });
        n.addEventListener("keydown", (ev) => {
          if (ev.key === "Enter") {
            ev.preventDefault();
            if (el2 === ings.lastChild) addIng();
            else el2.nextSibling?.children[2].focus();
          }
        });
        const rm = roundBtn("mdi:close", "Zutat entfernen", () => {
          d.ingredients.splice(d.ingredients.indexOf(ing), 1);
          el2.remove();
          this._dirty();
        }, "sm");
        el2.append(q, u, n, rm);
        return el2;
      };
      const addIng = () => {
        const ing = { name: "", qty: null, unit: "" };
        d.ingredients.push(ing);
        const el2 = row(ing);
        ings.append(el2);
        el2.children[0].focus({ preventScroll: true });
        el2.scrollIntoView({ block: "nearest" });
      };
      d.ingredients.forEach((ing) => ings.append(row(ing)));
      const add = document.createElement("button");
      add.type = "button";
      add.className = "chip addi";
      add.innerHTML = '<ha-icon icon="mdi:plus"></ha-icon>Zutat';
      add.addEventListener("click", addIng);
      this._picker = mediaPicker({ hass: this._h, module: "recipes", value: { image: d.image }, icons: [], search: false, fallback: "mdi:image-outline", onChange: (v) => {
        d.image = v.image;
        this._dirty();
      } });
      this._rt = richEditor({ placeholder: "Schritt für Schritt …", onInput: () => {
        d.steps = this._rt.get();
        this._dirty();
      } });
      this._rt.set(d.steps || "");
      f.append(ti, two, field("Schlagwörter (mit Komma getrennt)", tg), lb("Bild"), this._picker, lb("Zutaten"), ings, add, lb("Zubereitung"), this._rt.el);
      e.body.replaceChildren(f);
      e.body.parentElement.scrollTop = 0;
      e.g.classList.add("detail");
      this._del.reset();
      this._paintBar();
      if (!x) setTimeout(() => ti.focus({ preventScroll: true }), 320);
    }
    _dirty() {
      this._pending = true;
      clearTimeout(this._st);
      this._st = setTimeout(() => this._flush(), SAVE_MS3);
      this._paintBar();
    }
    // Speichern; ein neues Rezept wird erst angelegt, wenn es einen Namen hat
    _flush() {
      clearTimeout(this._st);
      const d = this._draft, h = this._h;
      if (!d || !h || !this._pending) return;
      if (!d.title.trim()) {
        this._paintBar();
        return;
      }
      this._pending = false;
      this._saving = (this._saving || 0) + 1;
      const run = this._chain = (this._chain || Promise.resolve()).then(() => recipes.save(h, {
        ...d.id ? { id: d.id } : {},
        title: d.title.trim(),
        image: d.image || null,
        servings: d.servings,
        time: d.time,
        tags: d.tags,
        ingredients: d.ingredients.filter((i) => i.name.trim()).map((i) => ({ name: i.name.trim(), qty: i.qty, unit: i.unit || "" })),
        steps: d.steps
      })).then((rec) => {
        d.id = rec.id;
        d.updated = rec.updated;
        this._saved = "ok";
        clearTimeout(this._okT);
        this._okT = setTimeout(() => {
          this._saved = null;
          this._paintBar();
        }, 2500);
      }).catch((err) => {
        console.warn("[nova-cards] Rezept: Speichern fehlgeschlagen", err);
        this._saved = "err";
      }).finally(() => {
        this._saving--;
        if (this._chain === run) this._chain = null;
        this._paintBar();
      });
      this._paintBar();
    }
    _remove() {
      const x = this._cur;
      if (!x?.id) return;
      clearTimeout(this._st);
      this._pending = false;
      this._draft = null;
      this._cur = null;
      this._mode = null;
      this._e.g.classList.remove("detail");
      recipes.remove(this._h, x.id).catch((err) => console.warn("[nova-cards] Rezept: Löschen fehlgeschlagen", err));
      this._render();
    }
    _paintBar() {
      const e = this._e, x = this._cur, c = this._c, h = this._h;
      if (!e || !x) return;
      const edit = this._mode === "edit";
      const st = !edit ? ["", "", ""] : this._pending && !x.title.trim() ? ["mdi:form-textbox", "Name fehlt noch", ""] : this._pending || this._saving ? ["mdi:cloud-sync-outline", "Speichert …", ""] : this._saved === "err" ? ["mdi:alert-circle-outline", "Nicht gespeichert", "err"] : this._saved === "ok" ? ["mdi:check-circle-outline", "Gespeichert", "ok"] : ["mdi:pencil-outline", x.id ? "Rezept bearbeiten" : "Neues Rezept", ""];
      const k = st.join("|");
      if (e.state._k !== k) {
        e.state._k = k;
        e.state.className = `state sp ${st[2]}`;
        e.state.innerHTML = st[0] ? `<ha-icon icon="${st[0]}"></ha-icon><span></span>` : "";
        if (st[0]) e.state.lastChild.textContent = st[1];
      }
      e.fav.hidden = edit;
      e.edit.hidden = edit;
      this._del.hidden = !edit || !x.id;
      e.back.title = edit && x.id ? "Fertig" : "Zurück zur Liste";
      setBtnIcon(e.back, edit && x.id ? "mdi:check" : "mdi:arrow-left");
      e.fav.classList.toggle("on", !!x.favorite);
      setBtnIcon(e.fav, x.favorite ? "mdi:heart" : "mdi:heart-outline");
      this._pb.hidden = edit || !c.print_script;
      paintBtn(
        this._pb,
        { icon: c.print_icon || PRINT_DEF.print_icon, label: c.print_label || PRINT_DEF.print_label, pill: false, busy: "Druckt …", ok: "Gedruckt", err: "Fehler" },
        this._pstate,
        !!h.states[c.print_script]
      );
    }
    // Rezept als Klartext: Titel, Portionen/Zeit, Zutaten (umgerechnet), Zubereitung
    _print() {
      const c = this._c, x = this._cur;
      if (!x || this._pstate === "busy") return;
      const k = this._servings / (x.servings || 1), out = [x.title.toUpperCase(), [`${this._servings} ${this._servings === 1 ? "Portion" : "Portionen"}`, x.time ? mins(x.time) : ""].filter(Boolean).join(" · ")];
      if (x.ingredients?.length) out.push("", "ZUTATEN", ...x.ingredients.map((i) => `[ ] ${[amount(i, k), i.name].filter(Boolean).join(" ")}`));
      const steps = toPlain(x.steps);
      if (steps) out.push("", "ZUBEREITUNG", steps);
      runPrint(this, this._h, c.print_script, { [c.print_field || "text"]: out.join("\n") }, (st) => {
        this._pstate = st;
        this._paintBar();
      });
    }
  };
  define("recipe-card", NovaRecipeCard, { name: "Nova Rezeptliste", description: "Kompakte Rezeptliste mit Bild, Zutaten und Zubereitung: suchen, Schlagwörter, Favoriten, Portionen umrechnen und Zutaten mit einem Tipp auf die Einkaufsliste setzen. Auf allen Geräten gleich (Nova-Integration), mit Druck-Knopf.", documentationURL: docUrl("nova-rezeptliste") });
  var GEN3 = [
    g2({ name: "name", selector: T }, { name: "icon", selector: I }),
    { name: "show_header", selector: { boolean: {} } }
  ];
  var VIEW2 = [
    sel("view", [["list", "Liste (kleines Bild, eine Zeile je Rezept)"], ["grid", "Kacheln (großes Bild)"]]),
    g2({ name: "show_search", selector: { boolean: {} } }, { name: "height", selector: { number: { min: 240, max: 1200, step: 10, mode: "box", unit_of_measurement: "px" } } })
  ];
  var PRINT3 = printSchema([{ name: "print_field", selector: T }]).filter((f) => f.name !== "print_style");
  var LABELS3 = {
    ...BASE_LABELS,
    ...PRINT_LABELS,
    name: "Titel der Karte",
    show_header: "Kopfzeile anzeigen",
    view: "Ansicht der Liste",
    show_search: "Suchfeld anzeigen",
    height: "Mindesthöhe",
    print_field: "Feldname im Skript"
  };
  var HELPERS3 = {
    ...PRINT_HELPERS,
    height: "Im Raster füllt die Karte den Platz aus.",
    print_script: "Leer = kein Druck-Knopf. Der Knopf sitzt im geöffneten Rezept.",
    print_field: "Unter diesem Namen bekommt das Skript das Rezept als Klartext (Standard: text)."
  };
  var NovaRecipeCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot, c0 = this._config;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const w = r.querySelector(".wrap"), data = { ...RDEF, ...c0 };
      const strip2 = (c) => {
        Object.entries(RDEF).forEach(([k, x]) => c[k] === x && delete c[k]);
        return c;
      };
      const form = (schema) => this._form(schema, data, (v) => this._emit(strip2(merge(this._config, names(schema), v))));
      w.append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => b.append(form(GEN3))),
        this._section("view", "mdi:view-grid-outline", "Ansicht", (b) => b.append(form(VIEW2))),
        this._section("print", "mdi:printer-pos", "Drucken", (b) => b.append(form(PRINT3)))
      );
    }
  };
  __publicField(NovaRecipeCardEditor, "labels", LABELS3);
  __publicField(NovaRecipeCardEditor, "helpers", HELPERS3);
  __publicField(NovaRecipeCardEditor, "openSections", ["general"]);
  define("recipe-card-editor", NovaRecipeCardEditor);

  // src/recipe-book.js
  var DEF = { title: "Rezepte", subtitle: "", style: "old", layout: "auto", cover_color: "brown", start_open: false, close_after: 0, turn: "auto" };
  var NAV_H = 48;
  var Lite = { slow: null, bad: 0 };
  var COVERS = ["brown", "red", "green", "blue"];
  var STYLES = ["old", "modern", "fantasy"];
  var OPEN_MS = 1100;
  var TURN_MS = 800;
  var PAGE_RATIO = 0.72;
  var IMG_MAX = 960;
  var FONT_URL = "/nova/static/fonts";
  var fontsLoaded = false;
  var loadFonts = () => {
    if (fontsLoaded) return;
    fontsLoaded = true;
    const st = document.createElement("style");
    st.dataset.nova = "recipe-fonts";
    const ff = (fam, file, w, s = "normal") => `@font-face{font-family:'${fam}';src:url(${FONT_URL}/${file}.woff2?v=1) format('woff2');font-weight:${w};font-style:${s};font-display:swap}`;
    st.textContent = ff("Nova Hand", "nova-hand-400", 400) + ff("Nova Hand", "nova-hand-700", 700) + ff("Nova Serif", "nova-serif-400", 400) + ff("Nova Serif", "nova-serif-400-italic", 400, "italic");
    document.head.append(st);
  };
  var noise = (freq, oct, rgb, op, type = "fractalNoise", size = 220) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><filter id='n'><feTurbulence type='${type}' baseFrequency='${freq}' numOctaves='${oct}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} ${op} 0 0 0 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`)}")`;
  var PAPER_FIBER = noise(0.85, 3, [0.35, 0.24, 0.1], 0.55);
  var PAPER_CLOUD = noise(0.012, 3, [0.55, 0.38, 0.12], 0.5, "fractalNoise", 400);
  var LEATHER_GRAIN = noise(1.4, 2, [0, 0, 0], 0.9, "turbulence", 160);
  var LEATHER_MOTTLE = noise(0.02, 3, [0.95, 0.8, 0.6], 0.45, "fractalNoise", 420);
  var rnd = (seed) => () => {
    seed = seed + 1831565813 | 0;
    let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
    t ^= t + Math.imul(t ^ t >>> 7, 61 | t);
    return ((t ^ t >>> 14) >>> 0) / 4294967296;
  };
  var stains = (seed) => {
    const r = rnd(seed * 7919 + 13), out = [];
    if (r() < 0.55) {
      const x = 10 + r() * 80, y = 8 + r() * 84, s = 70 + r() * 70;
      out.push(`radial-gradient(circle ${s}px at ${x}% ${y}%,transparent 82%,rgba(122,74,24,.16) 88%,rgba(122,74,24,.05) 93%,transparent 97%)`);
    }
    const n = 2 + Math.floor(r() * 5);
    for (let i = 0; i < n; i++) {
      const x = r() * 100, y = r() * 100, s = 3 + r() * 9;
      out.push(`radial-gradient(circle ${s}px at ${x}% ${y}%,rgba(140,90,40,${(0.12 + r() * 0.14).toFixed(2)}),transparent)`);
    }
    if (r() < 0.35) {
      const x = r() * 100, y = r() * 100;
      out.push(`radial-gradient(ellipse 60px 34px at ${x}% ${y}%,rgba(160,110,40,.1),transparent 70%)`);
    }
    return out.join(",");
  };
  var BOOK_CSS = `
:host{display:block;height:100%;
--ink:var(--nova-book-ink,#3a2814);--paper:var(--nova-book-paper,#efe0bb);--leather:var(--nova-book-brown,#6b3b1e);--gold:var(--nova-book-gold,#c9a14a);
--f-hand:'Nova Hand','Segoe Script','Bradley Hand',cursive;--f-serif:'Nova Serif',Georgia,'Times New Roman',serif;--acc:#8a1f12;--acc2:#1f4f7a}
:host([cover=red]){--leather:var(--nova-book-red,#5e1a1d)}:host([cover=green]){--leather:var(--nova-book-green,#2e4630)}:host([cover=blue]){--leather:var(--nova-book-blue,#1f2c48)}
*{box-sizing:border-box}
.rb{position:relative;height:100%;min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;
font-family:var(--f-serif);color:var(--ink);-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
.stage{position:relative;perspective:2400px;perspective-origin:50% 40%}
.book{position:absolute;inset:0;transform-style:preserve-3d;transition:transform ${OPEN_MS}ms cubic-bezier(.45,.05,.25,1)}
/* Aufgeschlagen gehören waagrechte Wischgesten dem Buch (Nova Swipe Card blättert dann nicht mit), zugeklappt nicht */
.book.open{touch-action:pan-y}
.book.closed{transform:translateX(calc(var(--pw) * -.5))}
.book.single.closed,.book.single{transform:none}
/* Seitenblock: Papierkanten unten und rechts (Buchdicke) */
.block{position:absolute;top:0;bottom:0;right:0;width:var(--pw);border-radius:2px 6px 6px 2px;
background:repeating-linear-gradient(90deg,#e9dcb8 0 1px,#cdbb8f 1px 2px);box-shadow:3px 4px 0 -1px #bfae84,5px 7px 14px rgba(0,0,0,.45);transform:translate3d(4px,4px,-2px)}
.double .block.l{right:auto;left:0;transform:translate3d(-4px,4px,-2px);border-radius:6px 2px 2px 6px}
.single .block.l,.closed .block.l{display:none}
/* Seiten */
.pg,.face{position:absolute;top:0;bottom:0;width:var(--pw);overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.pg.r,.leaf{left:auto;right:0}.pg.l{left:0}
/* Feste Tiefen statt z-index (in 3D zählt nur die Tiefe): Einband innen -3, Buchschnitt -2, Seiten +1, Blatt +3, Einband zu +4.
   Keine zwei Flächen liegen gleich tief – sonst flackert es in Safari und schwachen WebViews (Z-Fighting). */
.pg{transform:translateZ(1px)}
.pg,.leaf .face{contain:layout paint}
.single .pg.r,.single .leaf{right:auto;left:0}
.single .pg.l{display:none}
.paper{background-color:var(--paper);background-image:var(--st),${PAPER_FIBER},${PAPER_CLOUD},
radial-gradient(ellipse at 50% 45%,transparent 55%,rgba(120,80,30,.22) 100%);background-size:auto,220px 220px,400px 400px,auto;
box-shadow:inset 0 0 0 1px rgba(110,80,40,.25),inset 0 0 30px rgba(140,95,40,.22)}
.pg.r.paper,.face.f.paper{border-radius:2px 6px 6px 2px}.pg.l.paper,.face.b.paper{border-radius:6px 2px 2px 6px}
/* Schatten am Falz */
.pg.r::before,.leaf .face.f::before{content:"";position:absolute;inset:0 auto 0 0;width:14%;background:linear-gradient(90deg,rgba(60,35,10,.28),rgba(60,35,10,.06) 45%,transparent);pointer-events:none;z-index:2}
.pg.l::before,.leaf .face.b::before{content:"";position:absolute;inset:0 0 0 auto;width:14%;background:linear-gradient(270deg,rgba(60,35,10,.3),rgba(60,35,10,.06) 45%,transparent);pointer-events:none;z-index:2}
.single .pg.r::before,.single .leaf .face.f::before{width:5%}
.in{position:absolute;inset:0;padding:calc(var(--pw) * .09) calc(var(--pw) * .1) calc(var(--pw) * .11);overflow-y:auto;overscroll-behavior:auto contain;scrollbar-width:none;
font-size:clamp(12px,calc(var(--pw) * .036),19px);line-height:1.45}
.in::-webkit-scrollbar{display:none}
.no{position:absolute;bottom:calc(var(--pw) * .035);left:0;right:0;text-align:center;font-style:italic;font-size:clamp(10px,calc(var(--pw) * .026),14px);opacity:.55;pointer-events:none}
.leaf{position:absolute;top:0;bottom:0;width:var(--pw);transform-style:preserve-3d;transform-origin:0 50%;z-index:5;pointer-events:none;will-change:transform;transform:translateZ(3px)}
.leaf .face{left:0}.leaf .face.b{transform:rotateY(180deg)}
.leaf .sh{position:absolute;inset:0;pointer-events:none;z-index:3;opacity:0}
.leaf.fwd{animation:turn-f ${TURN_MS}ms cubic-bezier(.4,.1,.3,1) both}.leaf.bwd{animation:turn-b ${TURN_MS}ms cubic-bezier(.4,.1,.3,1) both}
.leaf .face.f .sh{background:linear-gradient(90deg,rgba(0,0,0,.35),transparent 60%)}.leaf .face.b .sh{background:linear-gradient(270deg,rgba(0,0,0,.35),transparent 60%)}
.leaf.fwd .face.f .sh,.leaf.bwd .face.b .sh{animation:sh-in ${TURN_MS}ms ease-in both}.leaf.fwd .face.b .sh,.leaf.bwd .face.f .sh{animation:sh-out ${TURN_MS}ms ease-out both}
.single .leaf.fwd{animation-name:turn-sf}.single .leaf.bwd{animation-name:turn-sb}
/* Einzelseite: das Blatt blendet aus – die Deckkraft sitzt auf der Seite, nicht am Blatt (opacity am 3D-Blatt würde es flach drücken) */
.single .leaf.fwd .face.f{animation:fade-out ${TURN_MS}ms linear both}.single .leaf.bwd .face.f{animation:fade-out ${TURN_MS}ms linear reverse both}
/* Vorbereitet: Blatt steht schon fertig gezeichnet über der Seite, die Animation läuft erst danach los */
.leaf.prep,.leaf.prep *{animation-play-state:paused!important}
@keyframes turn-f{from{transform:translateZ(3px) rotateY(0)}to{transform:translateZ(3px) rotateY(-180deg)}}
@keyframes turn-b{from{transform:translateZ(3px) rotateY(-180deg)}to{transform:translateZ(3px) rotateY(0)}}
@keyframes turn-sf{from{transform:translateZ(3px) rotateY(0)}to{transform:translateZ(3px) rotateY(-160deg)}}
@keyframes turn-sb{from{transform:translateZ(3px) rotateY(-160deg)}to{transform:translateZ(3px) rotateY(0)}}
@keyframes fade-out{0%,70%{opacity:1}to{opacity:0}}
/* Einfaches Blättern für schwache Geräte (Echo Show, Kiosk-WebView): nur zwei flache Ebenen, die zum Falz hin schmaler werden und
   auf der anderen Seite wieder aufgehen – mit demselben Schatten. Kein 3D, kein preserve-3d. */
.book.lite .leaf{transform-style:flat;transform:translateZ(3px);animation:none;will-change:auto}
.book.lite .leaf .face{will-change:transform;backface-visibility:visible;-webkit-backface-visibility:visible}
.book.lite .leaf .face.f{transform-origin:0 50%}
.book.lite .leaf .face.b{left:calc(var(--pw) * -1);transform-origin:100% 50%}
.book.lite .leaf.fwd .face.f{animation:lt-a ${TURN_MS}ms linear both}.book.lite .leaf.fwd .face.b{animation:lt-b ${TURN_MS}ms linear both}
.book.lite .leaf.bwd .face.f{animation:lt-b ${TURN_MS}ms linear both}.book.lite .leaf.bwd .face.b{animation:lt-a ${TURN_MS}ms linear both}
.book.lite.single .leaf.fwd .face.f{animation:lt-s ${TURN_MS * 0.8}ms cubic-bezier(.5,0,.75,.5) both}.book.lite.single .leaf.bwd .face.f{animation:lt-s ${TURN_MS * 0.8}ms cubic-bezier(.5,0,.75,.5) reverse both}
@keyframes lt-a{0%{transform:scaleX(1);animation-timing-function:cubic-bezier(.45,0,.9,.55)}50%,to{transform:scaleX(0)}}
@keyframes lt-b{0%,50%{transform:scaleX(0);animation-timing-function:cubic-bezier(.1,.45,.55,1)}to{transform:scaleX(1)}}
@keyframes lt-s{from{transform:scaleX(1);opacity:1}75%{opacity:1}to{transform:scaleX(.08);opacity:0}}
@keyframes sh-in{from{opacity:0}to{opacity:1}}@keyframes sh-out{from{opacity:1}to{opacity:0}}
/* Einband */
.cover{position:absolute;top:-2%;bottom:-2%;right:-1.5%;width:calc(var(--pw) * 1.03);transform-style:preserve-3d;transform-origin:0 50%;z-index:8;transform:translateZ(4px) rotateY(0);
transition:transform ${OPEN_MS}ms cubic-bezier(.45,.05,.25,1)}
.single .cover{right:auto;left:0}
.cover .face{width:100%;top:0;bottom:0;left:0}.cover .face.b{transform:rotateY(180deg)}
.open .cover{transform:translateZ(-3px) rotateY(-180deg)}
.single.open .cover{transform:translateZ(-3px) rotateY(-160deg)}
/* ausblenden über die Seiten des Einbands – opacity am 3D-Einband selbst würde ihn mitten in der Drehung flach drücken */
.cover .face{transition:opacity .3s}.single.open .cover .face{opacity:0;transition:opacity .3s ${OPEN_MS * 0.7}ms}
.cover.gone{visibility:hidden}
.leather{border-radius:3px 10px 10px 3px;background-color:var(--leather);
background-image:radial-gradient(ellipse at 88% 6%,rgba(255,230,190,.32),transparent 22%),radial-gradient(ellipse at 92% 96%,rgba(255,225,180,.3),transparent 20%),
radial-gradient(ellipse at 30% 98%,rgba(255,220,170,.16),transparent 25%),radial-gradient(ellipse 40% 30% at 62% 40%,rgba(0,0,0,.18),transparent 70%),
radial-gradient(ellipse at 20% 15%,rgba(255,220,170,.1),transparent 30%),${LEATHER_MOTTLE},${LEATHER_GRAIN},
linear-gradient(100deg,rgba(0,0,0,.35),rgba(255,255,255,.06) 18%,rgba(0,0,0,.08) 60%,rgba(0,0,0,.3));
background-size:auto,auto,auto,auto,auto,420px 420px,160px 160px,auto;background-blend-mode:normal,normal,normal,normal,normal,soft-light,multiply,normal;
box-shadow:inset 0 0 0 1px rgba(0,0,0,.5),inset 0 0 40px rgba(0,0,0,.5),inset -3px 0 6px rgba(255,220,180,.12),6px 8px 22px rgba(0,0,0,.5)}
/* Rücken mit Bünden und abgegriffener Kante */
.spine{position:absolute;inset:0 auto 0 0;width:9%;border-radius:3px 0 0 3px;
background:linear-gradient(90deg,rgba(0,0,0,.45),rgba(255,230,190,.12) 40%,rgba(0,0,0,.35)),
repeating-linear-gradient(180deg,transparent 0 17%,rgba(0,0,0,.35) 17% 18%,rgba(255,220,170,.18) 18% 19%,transparent 19% 21%)}
.stitch{position:absolute;inset:6% 7% 6% 13%;border:2px dashed rgba(235,205,150,.35);border-radius:6px;box-shadow:0 0 0 1px rgba(0,0,0,.25),inset 0 0 0 1px rgba(0,0,0,.25)}
.emb{position:absolute;inset:0 0 0 9%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(var(--pw) * .03);text-align:center;padding:0 12%}
.emb .orn{width:56%;height:auto;opacity:.9}
.emb h1{margin:0;font-family:var(--f-serif);font-style:italic;font-weight:400;font-size:clamp(22px,calc(var(--pw) * .13),78px);line-height:1.05;
background:linear-gradient(170deg,#f3dc9a,var(--gold) 45%,#8a6424 70%,#d9b665);-webkit-background-clip:text;background-clip:text;color:transparent;
filter:drop-shadow(0 1px 0 rgba(0,0,0,.6)) drop-shadow(0 -1px 0 rgba(255,230,180,.15));opacity:.92}
.emb p{margin:0;font-family:var(--f-hand);font-size:clamp(14px,calc(var(--pw) * .06),34px);color:#e9cf93;opacity:.75;text-shadow:0 1px 0 rgba(0,0,0,.6)}
.emb .gold{fill:none;stroke:var(--gold);stroke-width:1.2;opacity:.85}
/* abgewetzte Ecken */
.wear{position:absolute;inset:0;border-radius:inherit;pointer-events:none;
background:radial-gradient(circle at 100% 0,rgba(240,210,170,.35),transparent 7%),radial-gradient(circle at 100% 100%,rgba(240,210,170,.32),transparent 7%),
linear-gradient(180deg,rgba(255,225,180,.12),transparent 3%,transparent 97%,rgba(255,225,180,.12));mix-blend-mode:screen}
.inside{background-color:#e7d6ae;background-image:var(--st),${PAPER_FIBER},radial-gradient(ellipse at 50% 50%,transparent 50%,rgba(110,70,20,.3)),
repeating-linear-gradient(45deg,rgba(120,80,30,.05) 0 6px,transparent 6px 12px);border-radius:10px 3px 3px 10px;
box-shadow:inset 0 0 0 8px var(--leather),inset 0 0 0 9px rgba(0,0,0,.4),inset 0 0 40px rgba(110,70,20,.35)}
.inside .ded{position:absolute;inset:18% 16%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:8px;
font-family:var(--f-hand);font-size:clamp(18px,calc(var(--pw) * .085),46px);transform:rotate(-3deg);opacity:.8}
.inside .ded small{font-size:.55em;opacity:.75}
.hit{position:absolute;inset:0;cursor:pointer;z-index:9}
/* Lesebändchen zum Schließen */
.ribbon{position:absolute;top:calc(100% - 6px);left:calc(var(--bw) / 2 + var(--pw) * .1);width:clamp(14px,calc(var(--pw) * .045),24px);height:calc(var(--tail) + 6px);z-index:7;transform:translateZ(5px);cursor:pointer;border:0;padding:0;
background:linear-gradient(90deg,#7c1d1d,#b03030 50%,#7c1d1d);clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%);box-shadow:0 2px 4px rgba(0,0,0,.4);
transition:opacity .4s;opacity:0;pointer-events:none}
.single .ribbon{left:12%}
.open .ribbon{opacity:1;pointer-events:auto;transition-delay:${OPEN_MS}ms}
/* Navigation unter dem Buch: Zurück, Inhalt, Weiter – groß genug für Wandpanels; Platz ist immer reserviert (Kartenhöhe bleibt gleich) */
.nav{position:relative;display:flex;align-items:center;justify-content:space-between;gap:8px;width:var(--bw);height:${NAV_H}px;margin-top:var(--tail);flex:none;
opacity:0;pointer-events:none;transition:opacity .35s}
.rb.isopen .nav{opacity:1;pointer-events:auto;transition-delay:${OPEN_MS * 0.6}ms}
.nb{min-width:${NAV_H}px;height:${NAV_H}px;display:inline-flex;align-items:center;justify-content:center;gap:.25em;padding:0 1em;border-radius:999px;cursor:pointer;
font-family:var(--f-hand);font-weight:700;font-size:20px;line-height:1;color:var(--ink);background-color:var(--paper);background-image:${PAPER_FIBER};background-size:220px 220px;
border:1.5px solid rgba(70,45,20,.45);box-shadow:inset 0 0 12px rgba(140,95,40,.2),0 2px 6px rgba(0,0,0,.35);transition:transform .15s,opacity .2s;-webkit-tap-highlight-color:transparent}
.nb ha-icon{--mdc-icon-size:24px;flex:none}
.nb:active:not([disabled]){transform:scale(.94)}
.nb[disabled]{opacity:.38;cursor:default;box-shadow:inset 0 0 12px rgba(140,95,40,.2)}
.nav.tight .nb.prev span,.nav.tight .nb.next span{display:none}
.nav.tight .nb.prev,.nav.tight .nb.next{padding:0}
/* Inhalt der Seiten */
h2{margin:0 0 .35em;font-family:var(--f-hand);font-weight:700;font-size:2.15em;line-height:1;color:var(--ink);transform:rotate(-1deg)}
h3{margin:1em 0 .3em;font-family:var(--f-hand);font-weight:700;font-size:1.45em;line-height:1;border-bottom:1px solid rgba(70,45,20,.3);padding-bottom:.15em}
h3:first-child{margin-top:0}
ul.ing{list-style:none;margin:0;padding:0}ul.ing li{padding:.12em 0 .12em 1.1em;position:relative;border-bottom:1px dotted rgba(70,45,20,.22)}
ul.ing li::before{content:"–";position:absolute;left:.1em;font-family:var(--f-hand);font-weight:700}
ol.st{list-style:none;margin:0;padding:0;counter-reset:s}ol.st li{counter-increment:s;position:relative;padding:.25em 0 .35em 2em}
ol.st li::before{content:counter(s);position:absolute;left:0;top:.05em;width:1.45em;height:1.45em;border:1.5px solid rgba(70,45,20,.55);border-radius:50%;
display:flex;align-items:center;justify-content:center;font-family:var(--f-hand);font-weight:700;font-size:1.05em;line-height:1;transform:rotate(-4deg)}
.toc h2{text-align:center;transform:none;margin-bottom:.6em}
.toc .it{display:flex;align-items:baseline;gap:.4em;width:100%;border:0;background:none;color:inherit;font:inherit;padding:.32em 0;cursor:pointer;text-align:left}
.toc .it .t{font-family:var(--f-hand);font-size:1.35em;line-height:1.1}
.toc .it .d{flex:1;border-bottom:2px dotted rgba(70,45,20,.35);transform:translateY(-.25em)}
.toc .it .n{font-style:italic;opacity:.75}
.toc .it:active .t{text-decoration:underline}
.msg{font-family:var(--f-hand);font-size:1.35em;line-height:1.25;text-align:center;margin:1em 0;opacity:.85}
.msg.hint{text-align:left;font-size:1.25em}.msg.hint ol{margin:.4em 0 0;padding-left:1.2em}.msg.hint code{font-family:inherit;background:rgba(120,80,30,.12);padding:0 .2em;border-radius:3px}
.act{display:flex;flex-wrap:wrap;gap:.5em;justify-content:center;margin-top:1.2em}
.btn{display:inline-flex;align-items:center;gap:.35em;border:1.5px solid rgba(70,45,20,.5);border-radius:999px;background:rgba(255,248,225,.35);color:var(--ink);
font-family:var(--f-hand);font-size:1.2em;font-weight:700;padding:.15em .8em .2em;cursor:pointer;line-height:1.2;transition:background-color .2s,transform .15s}
.btn ha-icon{--mdc-icon-size:1em}
.btn:active{transform:scale(.95)}.btn.warn{border-color:rgba(150,30,20,.7);color:#8a1f12;background:rgba(200,60,40,.12)}
.btn.ok{border-color:rgba(40,100,40,.6);color:#2e5e22}
.btn[disabled]{opacity:.45;cursor:default}.btn.ok[disabled],.btn.warn[disabled]{opacity:1}
.tools{display:flex;gap:.4em;justify-content:flex-end;margin-top:1.2em}
.tools .btn{font-size:1em;padding:.1em .6em}
/* eingeklebtes Foto mit Fotoecken */
.photo{position:relative;margin:.4em auto 1em;width:86%;padding:4%;background:#f7f1e3;box-shadow:0 2px 6px rgba(60,35,10,.35),0 0 0 1px rgba(0,0,0,.05);transform:rotate(-1.6deg)}
.photo img{-webkit-user-drag:none;pointer-events:none;display:block;width:100%;aspect-ratio:4/3;object-fit:cover;filter:sepia(.18) saturate(.9) contrast(.96)}
.photo i{position:absolute;width:16%;aspect-ratio:1;background:linear-gradient(135deg,#3a2a1c,#1b130c 60%,#3d2c1d);box-shadow:0 1px 1px rgba(0,0,0,.3)}
.photo i::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.18),transparent 40%);clip-path:inherit}
.photo i.tl{top:-2%;left:-2%;clip-path:polygon(0 0,100% 0,0 100%)}.photo i.tr{top:-2%;right:-2%;clip-path:polygon(0 0,100% 0,100% 100%)}
.photo i.bl{bottom:-2%;left:-2%;clip-path:polygon(0 0,100% 100%,0 100%)}.photo i.br{bottom:-2%;right:-2%;clip-path:polygon(100% 0,100% 100%,0 100%)}
/* Formular: Karteikarte über dem Buch */
.form{position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;background:rgba(20,12,4,.45);padding:12px;animation:fade .25s}
.form[hidden]{display:none}
@keyframes fade{from{opacity:0}}
.card{position:relative;width:min(640px,100%);max-height:100%;overflow-y:auto;overscroll-behavior:contain;border-radius:6px;padding:20px 22px 18px;
background-color:#f6ecd2;background-image:${PAPER_FIBER},repeating-linear-gradient(180deg,transparent 0 31px,rgba(80,110,160,.18) 31px 32px),
linear-gradient(90deg,transparent 46px,rgba(190,60,60,.3) 46px 47px,transparent 47px);box-shadow:0 12px 40px rgba(0,0,0,.5);transform:rotate(-.6deg);font-size:16px}
.card h2{font-size:2em}
.card label{display:block;font-family:var(--f-hand);font-weight:700;font-size:1.3em;margin:.6em 0 .15em}
.card input[type=text],.card textarea{width:100%;font:inherit;font-size:16px;color:var(--ink);background:rgba(255,255,255,.45);border:1px solid rgba(70,45,20,.35);border-radius:4px;
padding:.45em .6em;outline:none;-webkit-user-select:text;user-select:text}
.card textarea{min-height:7.5em;resize:vertical;line-height:1.45}
.card input:focus,.card textarea:focus{border-color:rgba(70,45,20,.8);box-shadow:0 0 0 3px rgba(150,100,40,.2)}
.card .pic{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.card .pic img{width:110px;height:82px;object-fit:cover;border:4px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3);transform:rotate(-2deg)}
.card .pic input[type=file]{display:none}
.card .row{display:flex;gap:10px;justify-content:flex-end;margin-top:1em;flex-wrap:wrap}
.card .err{color:#8a1f12;font-family:var(--f-hand);font-size:1.2em;min-height:1.2em;margin-top:.4em}
.card small{display:block;opacity:.65;font-style:italic}
@media (prefers-reduced-motion:reduce){.book,.cover,.cover .face,.leaf,.leaf .face,.leaf .sh{transition:none!important;animation-duration:1ms!important}}
.still .book,.still .cover,.still .cover .face{transition:none!important}
/* ----- Neu gegenüber dem ersten Buch: Angaben, Portionen, formatierte Zubereitung ----- */
.meta{margin:-.1em 0 .7em;font-style:italic;opacity:.7;font-size:.92em}
h3.zl{display:flex;align-items:flex-end;gap:.4em}
h3 .sv{margin-left:auto;display:inline-flex;align-items:center;gap:.35em;font-family:var(--f-serif);font-weight:400;font-style:italic;font-size:.62em;white-space:nowrap;transform:translateY(-.1em)}
.sb{width:30px;height:30px;border-radius:50%;border:1.5px solid rgba(70,45,20,.5);background:rgba(255,248,225,.35);color:var(--ink);font:inherit;font-style:normal;font-weight:700;font-size:16px;line-height:1;
cursor:pointer;padding:0;display:inline-flex;align-items:center;justify-content:center;transition:transform .15s}
.sb:active{transform:scale(.88)}
.sb[disabled]{opacity:.35;cursor:default}
ul.ing li .q{display:inline-block;margin-right:.35em;font-variant-numeric:tabular-nums}
ul.ing li .q[hidden]{display:none}
ul.ing li .q.bump{animation:q-bump .35s ease}
@keyframes q-bump{40%{transform:scale(1.25)}}
ol.st li p{margin:0}
.in .fs-s{font-size:.85em}.in .fs-l{font-size:1.2em}.in .c-accent{color:var(--acc2)}.in .c-warn{color:var(--acc)}.in .c-muted{opacity:.55}
.in u{text-decoration-thickness:1px;text-underline-offset:.15em}
/* Formular: Felder nebeneinander, Zubereitung mit Formatierungsleiste (Farben des Papiers statt Nova-Glas) */
.card{--nv-tint:70,45,20;--nv-fg:var(--ink);--nv-active:#7a4a1c;--nv-active-fg:#fff8e1;--nv-text-accent:var(--acc2);--nv-text-warn:var(--acc);--nv-glow:0%;color:var(--ink)}
.card .two{display:grid;grid-template-columns:1fr 1fr;gap:0 12px}
.card input[type=number]{width:100%;font:inherit;font-size:16px;color:var(--ink);background:rgba(255,255,255,.45);border:1px solid rgba(70,45,20,.35);border-radius:4px;padding:.45em .6em;outline:none}
.card .rte{min-height:7.5em;font-size:16px;color:var(--ink);background:rgba(255,255,255,.45);border:1px solid rgba(70,45,20,.35);border-radius:4px;padding:.45em .6em;outline:none;
-webkit-user-select:text;user-select:text;margin-top:6px}
.card .rte:focus{border-color:rgba(70,45,20,.8);box-shadow:0 0 0 3px rgba(150,100,40,.2)}
/* Beschläge und Siegel gibt es nur im Fantasy Book */
.fit,.sigil{display:none}

/* ===== Modern Book: schlicht, grau, ohne Gebrauchsspuren ===== */
:host([book=modern]) .nb{font-weight:600;font-size:15px;letter-spacing:.01em;background-image:none;border:1px solid rgba(0,0,0,.12);border-radius:14px;box-shadow:0 1px 3px rgba(0,0,0,.22)}
:host([book=modern]) .nb[disabled]{box-shadow:none}
:host([book=modern]){--f-hand:system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;--f-serif:var(--f-hand);--paper:#f3f3f1;--ink:#24272c;--gold:#d7dadf;--leather:#4a4e55;--acc:#b3261e;--acc2:#2b5c8a}
:host([book=modern][cover=red]){--leather:#6d4a4f}:host([book=modern][cover=green]){--leather:#4a5a52}:host([book=modern][cover=blue]){--leather:#44506a}
:host([book=modern]) .paper{background-image:none;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}
:host([book=modern]) .block{background:#e4e4e1;box-shadow:2px 3px 0 -1px #cfcfcb,4px 6px 14px rgba(0,0,0,.3)}
:host([book=modern]) .pg.r::before,:host([book=modern]) .leaf .face.f::before{background:linear-gradient(90deg,rgba(0,0,0,.14),rgba(0,0,0,.03) 45%,transparent)}
:host([book=modern]) .pg.l::before,:host([book=modern]) .leaf .face.b::before{background:linear-gradient(270deg,rgba(0,0,0,.14),rgba(0,0,0,.03) 45%,transparent)}
:host([book=modern]) .leather{border-radius:3px 8px 8px 3px;background-image:linear-gradient(100deg,rgba(0,0,0,.2),rgba(255,255,255,.06) 18%,rgba(0,0,0,.03) 60%,rgba(0,0,0,.16));background-size:auto;background-blend-mode:normal;
box-shadow:inset 0 0 0 1px rgba(0,0,0,.25),6px 8px 22px rgba(0,0,0,.35)}
:host([book=modern]) .spine{background:linear-gradient(90deg,rgba(0,0,0,.25),rgba(255,255,255,.07) 60%,rgba(0,0,0,.14))}
:host([book=modern]) .stitch,:host([book=modern]) .wear,:host([book=modern]) .emb .orn{display:none}
:host([book=modern]) .emb{align-items:flex-start;justify-content:flex-end;text-align:left;padding:0 10% 14%;gap:calc(var(--pw) * .015)}
:host([book=modern]) .emb h1{font-style:normal;font-weight:300;letter-spacing:-.01em;background:none;color:#f1f2f4;filter:none;opacity:1;font-size:clamp(20px,calc(var(--pw) * .11),64px)}
:host([book=modern]) .emb h1::after{content:"";display:block;width:2.2em;height:2px;background:currentColor;opacity:.5;margin-top:.35em}
:host([book=modern]) .emb p{color:#f1f2f4;opacity:.6;text-shadow:none;font-size:clamp(12px,calc(var(--pw) * .045),24px)}
:host([book=modern]) .inside{background-color:#e9e9e6;background-image:none;box-shadow:inset 0 0 0 8px var(--leather)}
:host([book=modern]) .inside .ded{transform:none;font-weight:300;opacity:.6}
:host([book=modern]) h2{transform:none;font-weight:600;font-size:1.7em;letter-spacing:-.01em;line-height:1.1;margin-bottom:.5em}
:host([book=modern]) h3{font-weight:600;font-size:.82em;text-transform:uppercase;letter-spacing:.08em;border-bottom-color:rgba(0,0,0,.12);padding-bottom:.45em;color:rgba(36,39,44,.6)}
:host([book=modern]) h3 .sv{font-style:normal;font-size:1.05em;text-transform:none;letter-spacing:0;color:var(--ink)}
:host([book=modern]) .sb{border:1px solid rgba(0,0,0,.18);background:rgba(0,0,0,.04);font-weight:400}
:host([book=modern]) ul.ing li{border-bottom:1px solid rgba(0,0,0,.07);padding-left:0}
:host([book=modern]) ul.ing li::before{content:none}
:host([book=modern]) ul.ing li .q{font-weight:600}
:host([book=modern]) ol.st li::before{transform:none;border:0;background:rgba(0,0,0,.08);font-weight:600;font-size:.8em;width:1.8em;height:1.8em}
:host([book=modern]) .toc h2{text-align:left}
:host([book=modern]) .toc .it .t{font-size:1.05em}
:host([book=modern]) .toc .it .d{border-bottom:1px solid rgba(0,0,0,.12)}
:host([book=modern]) .toc .it .n,:host([book=modern]) .no,:host([book=modern]) .meta{font-style:normal}
:host([book=modern]) .msg{font-size:1em;opacity:.65}
:host([book=modern]) .btn{font-size:.9em;font-weight:600;border:1px solid rgba(0,0,0,.2);background:rgba(0,0,0,.04);padding:.45em 1em}
:host([book=modern]) .tools .btn{font-size:.85em;padding:.4em .9em}
:host([book=modern]) .photo{transform:none;padding:0;background:none;box-shadow:none;width:100%}
:host([book=modern]) .photo img{filter:none;border-radius:8px}
:host([book=modern]) .photo i{display:none}
:host([book=modern]) .ribbon{background:#8b9099}
:host([book=modern]) .card{transform:none;background-color:#f6f6f4;background-image:none;border-radius:12px;--nv-tint:0,0,0;--nv-active:#4a4e55;--nv-active-fg:#fff}
:host([book=modern]) .card label{font-size:.85em;font-weight:600;opacity:.75}
:host([book=modern]) .card h2{font-size:1.4em}
:host([book=modern]) .card .pic img{transform:none;border:0;border-radius:6px}
:host([book=modern]) .card .err{font-size:.9em}

/* ===== Fantasy Book: Zauberbuch mit Beschlägen, Siegel und Pergament ===== */
:host([book=fantasy]){--f-hand:'Nova Serif',Georgia,'Times New Roman',serif;--paper:#e4d0a0;--ink:#2b1a0e;--gold:#e0b354;--leather:#3a2413;--acc:#8c1c13;--acc2:#3b2a7a}
:host([book=fantasy][cover=red]){--leather:#4a0f1c}:host([book=fantasy][cover=green]){--leather:#12352a}:host([book=fantasy][cover=blue]){--leather:#171c4a}
:host([book=fantasy]) .paper{box-shadow:inset 0 0 0 1px rgba(90,50,15,.35),inset 0 0 60px rgba(90,45,10,.45),inset 0 0 14px rgba(60,25,5,.35)}
:host([book=fantasy]) .leather{box-shadow:inset 0 0 0 1px rgba(0,0,0,.6),inset 0 0 60px rgba(0,0,0,.65),inset 0 0 0 5px rgba(224,179,84,.14),6px 8px 26px rgba(0,0,0,.6)}
:host([book=fantasy]) .stitch{inset:7% 8% 7% 14%;border:3px double rgba(224,179,84,.6);border-radius:3px;box-shadow:0 0 10px rgba(224,179,84,.18),inset 0 0 10px rgba(224,179,84,.1)}
:host([book=fantasy]) .cover .face.f{overflow:visible}
:host([book=fantasy]) .nb{font-family:var(--f-serif);font-variant:small-caps;letter-spacing:.04em;font-size:19px;color:var(--gold);background-color:var(--leather);
background-image:linear-gradient(180deg,rgba(255,230,190,.14),rgba(0,0,0,.25));border:1.5px solid var(--gold);text-shadow:0 1px 0 rgba(0,0,0,.6);
box-shadow:inset 0 0 0 1px rgba(0,0,0,.5),inset 0 0 10px rgba(0,0,0,.45),0 2px 6px rgba(0,0,0,.45)}
:host([book=fantasy]) .nb[disabled]{box-shadow:inset 0 0 0 1px rgba(0,0,0,.5)}
:host([book=fantasy]) .fit{display:block;position:absolute;width:17%;aspect-ratio:1;z-index:1;background:linear-gradient(135deg,#f6e2a6,var(--gold) 38%,#7a5a1e 72%,#c9a14a);filter:drop-shadow(0 1px 2px rgba(0,0,0,.7))}
:host([book=fantasy]) .fit::after{content:"";position:absolute;width:14%;aspect-ratio:1;border-radius:50%;background:radial-gradient(circle at 35% 30%,#fff3c8,#6b4d16 70%)}
:host([book=fantasy]) .fit.tr{top:-1%;right:-1%;clip-path:polygon(0 0,100% 0,100% 100%,72% 72%,62% 28%,28% 38%);border-radius:0 10px 0 0}
:host([book=fantasy]) .fit.br{bottom:-1%;right:-1%;clip-path:polygon(100% 0,100% 100%,0 100%,28% 62%,62% 72%,72% 28%);border-radius:0 0 10px 0}
:host([book=fantasy]) .fit.tl{top:-1%;left:9%;clip-path:polygon(0 0,100% 0,72% 38%,38% 28%,28% 72%,0 100%)}
:host([book=fantasy]) .fit.bl{bottom:-1%;left:9%;clip-path:polygon(0 0,28% 28%,38% 72%,72% 62%,100% 100%,0 100%)}
:host([book=fantasy]) .fit.tr::after{top:14%;right:14%}:host([book=fantasy]) .fit.br::after{bottom:14%;right:14%}
:host([book=fantasy]) .fit.tl::after{top:14%;left:14%}:host([book=fantasy]) .fit.bl::after{bottom:14%;left:14%}
:host([book=fantasy]) .sigil{display:block;width:34%;height:auto;overflow:visible;filter:drop-shadow(0 0 5px rgba(224,179,84,.45)) drop-shadow(0 1px 0 rgba(0,0,0,.7))}
:host([book=fantasy]) .sigil .gold{stroke-width:1.6}
:host([book=fantasy]) .sigil .gem{fill:var(--acc);stroke:var(--gold);stroke-width:1.2}
:host([book=fantasy]) .live .sigil{animation:sigil 4.5s ease-in-out infinite alternate}
@keyframes sigil{from{filter:drop-shadow(0 0 3px rgba(224,179,84,.3)) drop-shadow(0 1px 0 rgba(0,0,0,.7))}to{filter:drop-shadow(0 0 11px rgba(224,179,84,.75)) drop-shadow(0 1px 0 rgba(0,0,0,.7))}}
:host([book=fantasy]) .emb .orn:first-of-type{display:none}
:host([book=fantasy]) .emb h1{font-style:normal;font-variant:small-caps;letter-spacing:.06em;font-size:clamp(20px,calc(var(--pw) * .115),70px);
filter:drop-shadow(0 0 6px rgba(224,179,84,.45)) drop-shadow(0 1px 0 rgba(0,0,0,.7));opacity:1}
:host([book=fantasy]) .emb p{font-style:italic;font-size:clamp(13px,calc(var(--pw) * .05),28px);color:#e9cf93}
:host([book=fantasy]) .inside{background-color:#d8c38f}
:host([book=fantasy]) .inside .ded{transform:none;font-variant:small-caps;letter-spacing:.06em;font-size:clamp(16px,calc(var(--pw) * .07),40px)}
:host([book=fantasy]) .inside .ded small{font-variant:normal;font-style:italic;letter-spacing:0}
:host([book=fantasy]) h2{font-variant:small-caps;font-weight:400;letter-spacing:.04em;transform:none;font-size:1.8em;text-align:center;line-height:1.05}
:host([book=fantasy]) h2::first-letter{font-size:1.45em;color:var(--acc)}
:host([book=fantasy]) h2::after{content:"❦";display:block;font-size:.5em;opacity:.55;margin-top:.25em;letter-spacing:0}
:host([book=fantasy]) .toc h2::after{content:"✦  ❦  ✦"}
:host([book=fantasy]) h3{font-variant:small-caps;font-weight:400;letter-spacing:.08em;font-size:1.2em;border-bottom:3px double rgba(70,35,10,.4);padding-bottom:.25em}
:host([book=fantasy]) h3 .sv{font-variant:normal;letter-spacing:0;font-size:.75em}
:host([book=fantasy]) .meta{text-align:center}
:host([book=fantasy]) ul.ing li::before{content:"✦";font-size:.7em;top:.5em;color:var(--acc);font-weight:400}
:host([book=fantasy]) ol.st{counter-reset:s}
:host([book=fantasy]) ol.st li::before{content:counter(s,upper-roman);font-size:.8em;width:1.9em;height:1.9em;transform:none;border:1.5px solid rgba(110,70,15,.7);background:radial-gradient(circle at 40% 35%,rgba(224,179,84,.45),rgba(224,179,84,.1))}
:host([book=fantasy]) .toc .it .t{font-variant:small-caps;letter-spacing:.03em;font-size:1.12em}
:host([book=fantasy]) .msg{font-style:italic;font-size:1.1em}
:host([book=fantasy]) .btn{font-variant:small-caps;font-weight:400;letter-spacing:.05em;border-radius:4px;font-size:1em;border-color:rgba(110,70,15,.7);background:rgba(224,179,84,.18);padding:.3em .9em}
:host([book=fantasy]) .tools .btn{font-size:.9em}
:host([book=fantasy]) .sb{border-color:rgba(110,70,15,.7);background:rgba(224,179,84,.18)}
:host([book=fantasy]) .photo{background:#2a1a10;padding:2.5%;box-shadow:0 0 0 2px var(--gold),0 3px 8px rgba(0,0,0,.4);transform:rotate(.8deg)}
:host([book=fantasy]) .photo i{display:none}
:host([book=fantasy]) .photo img{filter:sepia(.35) saturate(.85)}
:host([book=fantasy]) .ribbon{background:linear-gradient(90deg,#3b1a5c,#6a35a0 50%,#3b1a5c)}
:host([book=fantasy]) .card{transform:none;background-color:#e4d0a0;background-image:${PAPER_FIBER};border-radius:3px;box-shadow:0 0 0 2px var(--gold),0 12px 40px rgba(0,0,0,.6);--nv-active:#6b4d16}
:host([book=fantasy]) .card label{font-variant:small-caps;font-weight:400;letter-spacing:.05em;font-size:1.05em}
:host([book=fantasy]) .card .err{font-style:italic;font-size:1em}
@media (prefers-reduced-motion:reduce){.live .sigil{animation:none!important}ul.ing li .q.bump{animation:none}}
`;
  var ORN = `<svg class="orn" viewBox="0 0 200 24" aria-hidden="true"><path class="gold" d="M4 12H78M122 12H196M84 12c4-8 12-8 16 0s12 8 16 0M84 12c4 8 12 8 16 0s12-8 16 0"/><circle cx="100" cy="12" r="2.2" fill="currentColor" class="gold"/></svg>`;
  var SIGIL = `<svg class="sigil" viewBox="0 0 100 100" aria-hidden="true"><circle class="gold" cx="50" cy="50" r="46"/><circle class="gold" cx="50" cy="50" r="39" stroke-dasharray="2 4"/>
<path class="gold" d="M50 8 59 41 92 50 59 59 50 92 41 59 8 50 41 41Z"/><path class="gold" d="M50 22 56 44 78 50 56 56 50 78 44 56 22 50 44 44Z" transform="rotate(45 50 50)"/><circle class="gem" cx="50" cy="50" r="7"/></svg>`;
  var FITS = '<i class="fit tl"></i><i class="fit tr"></i><i class="fit bl"></i><i class="fit br"></i>';
  function stepsHtml(html) {
    const t = document.createElement("template");
    t.innerHTML = sanitize(html || "");
    const out = [];
    let open = false;
    const li = (h) => {
      if (!h.replace(/<br\s*\/?>|&nbsp;|\s/g, "")) return;
      if (!open) {
        out.push('<ol class="st">');
        open = true;
      }
      out.push(`<li>${h}</li>`);
    };
    const close = () => {
      if (open) {
        out.push("</ol>");
        open = false;
      }
    };
    [...t.content.childNodes].forEach((n) => {
      if (n.nodeType === 3) {
        if (n.textContent.trim()) li(esc(n.textContent));
        return;
      }
      if (n.nodeType !== 1) return;
      if (n.localName === "h3") {
        close();
        out.push(`<h3>${n.innerHTML}</h3>`);
      } else if (n.localName === "ul") [...n.children].forEach((c) => li(c.innerHTML));
      else li(n.localName === "p" ? n.innerHTML : n.outerHTML);
    });
    close();
    return out.join("");
  }
  var NovaRecipeBookCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("recipe-book-card-editor"));
    }
    static getStubConfig() {
      return {};
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      const was = this._c;
      this._c = { ...DEF, ...c };
      this.setAttribute("cover", COVERS.includes(this._c.cover_color) ? this._c.cover_color : "brown");
      this.setAttribute("book", STYLES.includes(this._c.style) ? this._c.style : "old");
      if (this._e) {
        if (!was || was.title !== this._c.title || was.subtitle !== this._c.subtitle) this._coverText();
        if (this._vis && this._c.style !== "modern") loadFonts();
        this._resize(true);
      }
    }
    set hass(h) {
      this._h = h;
      if (!this._c) return;
      if (!this._e) this._build();
      this._watch();
    }
    getCardSize() {
      return 8;
    }
    getGridOptions() {
      return { columns: 12, rows: 8, min_columns: 6, min_rows: 5 };
    }
    connectedCallback() {
      this._quiet = inPicker(this);
      this._stopVis?.();
      this._stopVis = watchVisible(this, (v) => {
        this._vis = v;
        if (v && this._c?.style !== "modern") loadFonts();
        this._e?.rb.classList.toggle("live", v && !this._quiet);
      });
      if (!this._e && this._c && this._h) this._build();
      if (this._e) {
        this._ro?.observe(this);
        this._watch();
      }
    }
    disconnectedCallback() {
      this._ro?.disconnect();
      this._stopVis?.();
      this._stopVis = null;
      this._off?.();
      this._off = null;
      clearTimeout(this._idle);
      clearTimeout(this._tt);
      clearTimeout(this._delT);
      clearTimeout(this._ct);
    }
    /* ---------- Aufbau ---------- */
    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: "open" });
      r.innerHTML = `<style>${NOVA_VARS}${RICH_CSS}${BOOK_CSS}</style><div class="rb"><div class="stage"><div class="book closed">
<div class="block l"></div><div class="block r"></div>
<div class="pg l paper"><div class="in"></div><div class="no"></div></div><div class="pg r paper"><div class="in"></div><div class="no"></div></div>
<div class="cover"><div class="face f leather"><div class="spine"></div><div class="stitch"></div>${FITS}<div class="emb">${SIGIL}${ORN}<h1></h1><p></p>${ORN}</div><div class="wear"></div></div>
<div class="face b inside"><div class="ded"></div></div><div class="hit" role="button" aria-label="Buch öffnen"></div></div>
<button class="ribbon" aria-label="Buch schließen" title="Buch schließen"></button>
</div></div><nav class="nav" aria-label="Blättern"><button class="nb prev" aria-label="Zurück"><ha-icon icon="mdi:chevron-left"></ha-icon><span>Zurück</span></button>
<button class="nb toc"><ha-icon icon="mdi:format-list-bulleted"></ha-icon><span>Inhalt</span></button>
<button class="nb next" aria-label="Weiter"><span>Weiter</span><ha-icon icon="mdi:chevron-right"></ha-icon></button></nav><div class="form" hidden></div></div>`;
      const q = (s) => r.querySelector(s);
      this._e = {
        rb: q(".rb"),
        stage: q(".stage"),
        book: q(".book"),
        L: q(".pg.l"),
        R: q(".pg.r"),
        cover: q(".cover"),
        ded: q(".ded"),
        h1: q(".emb h1"),
        sub: q(".emb p"),
        form: q(".form"),
        nav: q(".nav"),
        prev: q(".nb.prev"),
        toc: q(".nb.toc"),
        next: q(".nb.next")
      };
      this._e.cover.style.setProperty("--st", stains(99));
      this._e.cover.querySelector(".inside").style.setProperty("--st", stains(98));
      this._e.rb.classList.toggle("live", !!this._vis && !this._quiet);
      this._sp = 0;
      this._open = false;
      this._serv = /* @__PURE__ */ new Map();
      this._coverText();
      q(".hit").addEventListener("click", () => this._setOpen(true));
      q(".ribbon").addEventListener("click", () => this._setOpen(false));
      this._e.prev.addEventListener("click", () => this._go(this._sp - 1));
      this._e.next.addEventListener("click", () => this._go(this._sp + 1));
      this._e.toc.addEventListener("click", () => this._go(0));
      this._gestures();
      this._ro = new ResizeObserver(() => this._resize());
      if (this.isConnected) this._ro.observe(this);
      if (this._c.start_open && !this._quiet) this._setOpen(true, false);
    }
    _coverText() {
      const c = this._c, e = this._e;
      e.h1.textContent = c.title || DEF.title;
      e.sub.textContent = c.subtitle || "";
      e.sub.hidden = !c.subtitle;
      e.ded.innerHTML = `<span>${esc(c.title || DEF.title)}</span>${c.subtitle ? `<small>${esc(c.subtitle)}</small>` : ""}`;
    }
    // Größe: Seite im Verhältnis 0,72, so groß wie der Platz erlaubt. Ohne feste Höhe (Masonry) ergibt sich die Höhe aus der Breite.
    _resize(force) {
      const e = this._e, c = this._c;
      if (!e) return;
      const W = this.clientWidth || 0, Hh = this.clientHeight || 0;
      if (!W) return;
      const auto = Hh < 150;
      const dbl = c.layout === "double" || c.layout !== "single" && W >= 560 && (auto || W / Math.max(Hh, 1) > 1.05);
      const pad = Math.max(10, W * 0.025);
      let pw = dbl ? (W - 2 * pad) / 2 : W - 2 * pad;
      const tail = (p) => Math.round(Math.min(40, Math.max(22, p * 0.08)));
      if (!auto) pw = Math.min(pw, (Hh - 2 * pad - NAV_H - tail(pw)) * PAGE_RATIO);
      pw = Math.max(120, Math.floor(pw));
      const tl = tail(pw);
      const ph = Math.floor(pw / PAGE_RATIO), bw = dbl ? 2 * pw : pw;
      if (auto) e.rb.style.height = `${ph + 2 * pad + NAV_H + tl}px`;
      else e.rb.style.removeProperty("height");
      e.rb.style.setProperty("--tail", `${tl}px`);
      e.nav.classList.toggle("tight", bw < 360);
      e.stage.style.width = `${bw}px`;
      e.stage.style.height = `${ph}px`;
      e.rb.style.setProperty("--pw", `${pw}px`);
      e.rb.style.setProperty("--bw", `${bw}px`);
      if (force || dbl !== this._dbl) {
        const spreads = this._spreads(this._dbl), cur2 = spreads[this._sp];
        this._dbl = dbl;
        e.book.classList.toggle("double", dbl);
        e.book.classList.toggle("single", !dbl);
        const ns = this._spreads(dbl), key = cur2 && (cur2.rid ?? cur2.key);
        const i = ns.findIndex((s) => (s.rid ?? s.key) === key);
        this._sp = i >= 0 ? i : Math.min(this._sp, ns.length - 1);
        this._paint();
      }
    }
    /* ---------- Daten ---------- */
    // Rezepte aus der Nova-Integration (ein Abo für alle Rezept-Karten); in der Kartenauswahl zwei Beispielrezepte
    _watch() {
      if (!this._h || !this.isConnected || !this._e) return;
      if (this._quiet) {
        if (!this._recipes) {
          this._recipes = DEMO;
          this._paint();
        }
        return;
      }
      if (this._off) return;
      this._off = watch(this._h, "recipes", this, (d, err) => {
        this._units = d?.units || this._units;
        this._setRecipes(d?.recipes, err);
      });
    }
    _setRecipes(list2, err) {
      const spreads = this._spreads(this._dbl), cur2 = spreads[this._sp], key = cur2 && (cur2.rid ?? cur2.key);
      this._err = list2 ? null : err || null;
      this._recipes = list2 ? [...list2].sort((a, b) => String(a.title).localeCompare(String(b.title), "de")) : err ? [] : null;
      const ns = this._spreads(this._dbl);
      if (this._jump) {
        const i = ns.findIndex((s) => s.rid === this._jump);
        if (i >= 0) {
          this._jump = null;
          this._sp = i;
        }
      } else {
        const i = ns.findIndex((s) => (s.rid ?? s.key) === key);
        this._sp = i >= 0 ? i : Math.max(0, Math.min(this._sp, ns.length - 1));
      }
      this._paint();
    }
    _servings(r) {
      return this._serv.get(r.id) || r.servings || 1;
    }
    /* ---------- Seiten ---------- */
    // Doppelseiten: [Vorsatz | Inhalt], dann je Rezept [Titel, Foto, Zutaten | Zubereitung]. Einzelseiten: Inhalt, dann je Rezept eine Seite.
    _spreads(dbl = this._dbl) {
      const rs = this._recipes || [];
      return dbl ? [{ key: "toc", L: { k: "end" }, R: { k: "toc", n: 1 } }, ...rs.map((r, i) => ({ rid: r.id, L: { k: "A", r, n: 2 * i + 2 }, R: { k: "B", r, n: 2 * i + 3 } }))] : [{ key: "toc", P: { k: "toc", n: 1 } }, ...rs.map((r, i) => ({ rid: r.id, P: { k: "R", r, n: i + 2 } }))];
    }
    _pageNo(i) {
      return this._dbl ? 2 * i + 2 : i + 2;
    }
    _paint() {
      const e = this._e;
      if (!e || this._dbl == null || this._turning) return;
      const s = this._spreads()[this._sp] || this._spreads()[0];
      this._navState(this._sp);
      if (this._dbl) {
        this._fill(e.L, s.L);
        this._fill(e.R, s.R);
        e.L.style.visibility = s.L.k === "end" ? "hidden" : "";
      } else this._fill(e.R, s.P);
    }
    // Seite füllen: Inhalt + Seitenzahl + eigene Flecken
    _fill(pg, d) {
      const inn = pg.querySelector(".in"), no = pg.querySelector(".no");
      const sig = JSON.stringify([d.k, d.r?.id, d.r?.updated, d.n, d.k === "toc" ? [this._recipes?.length, this._err, (this._recipes || []).map((r) => r.title)] : 0, this._dbl]);
      if (pg._sig === sig) return;
      pg._sig = sig;
      pg.style.setProperty("--st", stains(d.n || 0));
      inn.replaceChildren(this._content(d));
      inn.scrollTop = 0;
      no.textContent = d.n && d.k !== "end" ? `— ${d.n} —` : "";
    }
    _content(d) {
      const box = document.createElement("div");
      const r = d.r;
      if (d.k === "end") {
        box.className = "inside";
        return box;
      }
      if (d.k === "toc") {
        box.className = "toc";
        box.innerHTML = "<h2>Inhalt</h2>";
        const msg = (t) => {
          const m = document.createElement("div");
          m.className = "msg";
          m.textContent = t;
          box.append(m);
        };
        if (this._err) {
          msg(storeHint(this._err, "recipes")[1]);
          return box;
        }
        if (!this._recipes) {
          msg("Einen Moment, die Seiten werden geblättert …");
          return box;
        }
        if (!this._recipes.length) box.insertAdjacentHTML("beforeend", '<div class="msg">Noch keine Rezepte.<br>Trag das erste ein!</div>');
        this._recipes.forEach((x, i) => {
          const b = document.createElement("button");
          b.className = "it";
          b.innerHTML = '<span class="t"></span><span class="d"></span><span class="n"></span>';
          b.firstChild.textContent = x.title;
          b.lastChild.textContent = this._pageNo(i);
          b.addEventListener("click", (ev) => {
            ev.stopPropagation();
            this._go(i + 1);
          });
          box.append(b);
        });
        if (!this._quiet) {
          const act = document.createElement("div");
          act.className = "act";
          act.append(this._btn("mdi:plus", "Neues Rezept", () => this._edit(null)));
          box.append(act);
        }
        return box;
      }
      const src = r.image ? imageUrl(this._h, "recipes", r.image) : "", meta = [r.time ? mins(r.time) : "", ...r.tags || []].filter(Boolean).join(" · ");
      const head = () => `<h2>${esc(r.title)}</h2>${meta ? `<div class="meta">${esc(meta)}</div>` : ""}${src ? `<div class="photo"><img alt="" loading="lazy" src="${esc(src)}"><i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i></div>` : ""}`;
      const ing = () => r.ingredients?.length ? `<h3 class="zl"><span>Zutaten</span><span class="sv"><button class="sb" data-d="-1" aria-label="Weniger Portionen">−</button><span class="svn"></span><button class="sb" data-d="1" aria-label="Mehr Portionen">+</button></span></h3>
<ul class="ing">${r.ingredients.map(() => '<li><span class="q"></span><span class="nm"></span></li>').join("")}</ul>` : "";
      const steps = () => {
        const h = stepsHtml(r.steps);
        return h ? `${/^<h3/.test(h) ? "" : "<h3>Zubereitung</h3>"}${h}` : "";
      };
      if (d.k === "A") box.innerHTML = head() + ing();
      else if (d.k === "B") box.innerHTML = steps() || '<div class="msg">Ohne Anleitung – einfach drauflos kochen.</div>';
      else box.innerHTML = head() + ing() + steps();
      box.dataset.rid = r.id;
      box.querySelectorAll(".sb").forEach((b) => b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        this._step(r, +b.dataset.d);
      }));
      this._paintIng(box, r);
      if (d.k !== "A") box.append(this._tools(r));
      return box;
    }
    // Mengen einer Rezeptseite für die gewählten Portionen eintragen
    _paintIng(box, r, bump) {
      const n = this._servings(r), k = n / (r.servings || 1), lis = box.querySelectorAll("ul.ing li");
      (r.ingredients || []).forEach((x, i) => {
        const li = lis[i];
        if (!li) return;
        const q = li.firstChild;
        q.textContent = amount(x, k);
        q.hidden = x.qty == null && !x.unit;
        li.lastChild.textContent = x.name;
        if (bump && x.qty != null) {
          q.classList.remove("bump");
          void q.offsetWidth;
          q.classList.add("bump");
        }
      });
      const sv = box.querySelector(".svn");
      if (sv) sv.textContent = `${n} ${n === 1 ? "Portion" : "Portionen"}`;
      const [minus, plus] = box.querySelectorAll(".sb");
      if (minus) {
        minus.disabled = n <= 1;
        plus.disabled = n >= 99;
      }
    }
    // Portionen umrechnen – gilt, bis das Buch zugeklappt wird, und ändert das Rezept nicht
    _step(r, dir) {
      const n = Math.max(1, Math.min(99, this._servings(r) + dir));
      if (n === this._servings(r)) return;
      this._serv.set(r.id, n);
      this._poke();
      this.shadowRoot.querySelectorAll(".in > div").forEach((box) => {
        if (box.dataset.rid === r.id) this._paintIng(box, r, true);
      });
    }
    _btn(icon2, label, fn, cls = "") {
      const b = document.createElement("button");
      b.className = `btn ${cls}`;
      b.innerHTML = `<ha-icon icon="${icon2}"></ha-icon><span></span>`;
      b.lastChild.textContent = label;
      b.addEventListener("click", (ev) => {
        ev.stopPropagation();
        fn(b);
      });
      return b;
    }
    // Knöpfe unter einem Rezept: Zutaten auf die Einkaufsliste, Bearbeiten, Löschen (mit Rückfrage)
    _tools(r) {
      const w = document.createElement("div");
      if (this._quiet) return w;
      if (r.ingredients?.length) {
        const act = document.createElement("div");
        act.className = "act";
        act.append(this._btn("mdi:cart-plus", "Zutaten auf die Einkaufsliste", (b) => this._toList(r, b)));
        w.append(act);
      }
      const t = document.createElement("div");
      t.className = "tools";
      t.append(this._btn("mdi:pencil", "Bearbeiten", () => this._edit(r)), this._btn("mdi:delete-outline", "Löschen", (b) => this._del(r, b)));
      w.append(t);
      return w;
    }
    /* ---------- Öffnen, Blättern, Gesten ---------- */
    _setOpen(open, anim = true) {
      const e = this._e;
      if (!e || open === this._open || this._quiet && open) return;
      this._open = open;
      this._resize(true);
      e.book.classList.toggle("still", !anim);
      e.cover.classList.remove("gone");
      e.book.classList.toggle("open", open);
      e.book.classList.toggle("closed", !open);
      e.rb.classList.toggle("isopen", open);
      clearTimeout(this._ct);
      if (open && !this._dbl) this._ct = setTimeout(() => e.cover.classList.add("gone"), anim ? OPEN_MS : 0);
      if (!open) {
        this._sp = 0;
        this._serv.clear();
        this._ct = setTimeout(() => {
          [e.L, e.R].forEach((p) => {
            p._sig = null;
          });
          this._paint();
        }, anim ? OPEN_MS : 0);
      }
      this._poke();
    }
    // Nach close_after Sekunden ohne Bedienung wieder zuklappen
    _poke() {
      clearTimeout(this._idle);
      const s = +this._c.close_after;
      if (this._open && s > 0) this._idle = setTimeout(() => {
        if (this._e.form.hidden) this._setOpen(false);
        else this._poke();
      }, s * 1e3);
    }
    _navState(i) {
      const e = this._e, n = this._spreads().length;
      e.prev.disabled = i <= 0;
      e.toc.disabled = i <= 0;
      e.next.disabled = i >= n - 1;
    }
    // Einfaches Blättern? Option turn: auto (schwaches Gerät oder zu wenige Bilder pro Sekunde gemessen), 3d, simple
    _lite() {
      const t = this._c.turn;
      if (t === "simple") return true;
      if (t === "3d") return false;
      if (Lite.slow == null) {
        let v = null;
        try {
          v = localStorage.getItem("nova-book-lite");
        } catch (_) {
        }
        Lite.slow = v === "1" || weakDevice();
      }
      return Lite.slow;
    }
    // Bilder pro Sekunde beim 3D-Blättern messen: zweimal unter ~35 fps → ab dann einfach blättern (merkt sich das Gerät)
    _measure(leaf) {
      let n = 0, t0 = 0;
      const tick = (t) => {
        if (!leaf.isConnected || leaf.classList.contains("prep")) return;
        if (!t0) t0 = t;
        n++;
        if (t - t0 < TURN_MS - 40) requestAnimationFrame(tick);
        else done(t);
      };
      const done = (t) => {
        const fps = (n - 1) * 1e3 / Math.max(1, t - t0);
        if (fps >= 35) {
          Lite.bad = 0;
          return;
        }
        if (++Lite.bad < 2) return;
        Lite.slow = true;
        try {
          localStorage.setItem("nova-book-lite", "1");
        } catch (_) {
        }
      };
      requestAnimationFrame(tick);
    }
    _go(i) {
      const n = this._spreads().length;
      i = Math.max(0, Math.min(n - 1, i));
      if (i === this._sp || this._turning || !this._open) return;
      const reduce = window.matchMedia?.("(prefers-reduced-motion: reduce)").matches;
      const dir = i > this._sp ? 1 : -1, from = this._spreads()[this._sp], to = this._spreads()[i];
      this._poke();
      this._navState(i);
      if (reduce) {
        this._sp = i;
        this._paint();
        return;
      }
      const e = this._e, leaf = document.createElement("div"), lite = this._lite();
      leaf.className = `leaf prep ${dir > 0 ? "fwd" : "bwd"}`;
      leaf.innerHTML = '<div class="face f paper"><div class="in"></div><div class="no"></div><div class="sh"></div></div><div class="face b paper"><div class="in"></div><div class="no"></div><div class="sh"></div></div>';
      const [ff, fb] = leaf.querySelectorAll(".face");
      let under;
      if (this._dbl) {
        if (dir > 0) {
          this._fill(ff, from.R);
          this._fill(fb, to.L);
          under = () => this._fill(e.R, to.R);
        } else {
          this._fill(ff, to.R);
          this._fill(fb, from.L);
          under = () => {
            this._fill(e.L, to.L);
            e.L.style.visibility = to.L.k === "end" ? "hidden" : "";
          };
        }
      } else {
        if (dir > 0) {
          this._fill(ff, from.P);
          under = () => this._fill(e.R, to.P);
        } else this._fill(ff, to.P);
        fb.replaceChildren();
      }
      this._turning = true;
      e.book.classList.toggle("lite", lite);
      e.book.append(leaf);
      const raf = (f) => requestAnimationFrame(() => requestAnimationFrame(f));
      raf(() => {
        if (!leaf.isConnected) return;
        under?.();
        requestAnimationFrame(() => {
          if (!leaf.isConnected) return;
          leaf.classList.remove("prep");
          if (!lite && this._c.turn !== "3d") this._measure(leaf);
          this._tt = setTimeout(() => {
            this._turning = false;
            this._sp = i;
            this._paint();
            raf(() => leaf.remove());
          }, TURN_MS + 30);
        });
      });
    }
    _gestures() {
      const b = this._e.book;
      let x0 = null, y0 = 0, t0 = 0;
      b.addEventListener("pointerdown", (ev) => {
        if (!this._open || ev.button > 0) return;
        x0 = ev.clientX;
        y0 = ev.clientY;
        t0 = Date.now();
        this._poke();
      });
      const end = (ev) => {
        if (x0 == null) return;
        const dx = ev.clientX - x0, dy = ev.clientY - y0, dt = Date.now() - t0;
        x0 = null;
        if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3 && dt < 900) this._go(this._sp + (dx < 0 ? 1 : -1));
      };
      b.addEventListener("pointerup", end);
      b.addEventListener("pointercancel", () => {
        x0 = null;
      });
      b.addEventListener("dragstart", (ev) => ev.preventDefault());
      this.tabIndex = this.tabIndex >= 0 ? this.tabIndex : 0;
      this.addEventListener("keydown", (ev) => {
        if (!this._open || !this._e.form.hidden) return;
        if (ev.key === "ArrowRight") this._go(this._sp + 1);
        else if (ev.key === "ArrowLeft") this._go(this._sp - 1);
      });
    }
    /* ---------- Einkaufsliste ---------- */
    // Alle Zutaten für die gewählten Portionen auf die Nova-Einkaufsliste; was dort schon offen steht, wird in der Menge erhöht
    async _toList(r, b) {
      const h = this._h, label = b.lastChild;
      if (!h || b.disabled) return;
      b.disabled = true;
      label.textContent = "Wird eingetragen …";
      try {
        const n = await recipes.toShopping(h, r.id, this._servings(r));
        label.textContent = n ? `${n} ${n === 1 ? "Zutat" : "Zutaten"} eingetragen` : "Steht schon alles drauf";
        b.classList.add("ok");
      } catch (err) {
        console.warn("[nova-cards] Rezeptbuch: Einkaufsliste", err);
        label.textContent = err?.code === "module_disabled" ? "Einkauf ist abgeschaltet" : "Hat nicht geklappt";
        b.classList.add("warn");
      }
      setTimeout(() => {
        b.disabled = false;
        b.classList.remove("ok", "warn");
        label.textContent = "Zutaten auf die Einkaufsliste";
      }, 3500);
    }
    /* ---------- Bearbeiten, Löschen ---------- */
    _del(r, b) {
      const label = b.lastChild;
      if (!b.classList.contains("warn")) {
        b.classList.add("warn");
        label.textContent = "Wirklich löschen?";
        clearTimeout(this._delT);
        this._delT = setTimeout(() => {
          b.classList.remove("warn");
          label.textContent = "Löschen";
        }, 4e3);
        return;
      }
      clearTimeout(this._delT);
      b.disabled = true;
      recipes.remove(this._h, r.id).catch((err) => {
        console.warn("[nova-cards] Rezeptbuch: Löschen fehlgeschlagen", err);
        b.disabled = false;
        label.textContent = "Fehler – nochmal?";
      });
    }
    // Karteikarte über dem Buch: Titel, Portionen, Zeit, Schlagwörter, Bild, Zutaten (eine pro Zeile), Zubereitung mit Formatierung
    _edit(r) {
      if (this._err || !this._recipes) return;
      const f = this._e.form, st = { image: r?.image || null, data: null };
      f.innerHTML = `<form class="card" novalidate><h2>${r ? "Rezept bearbeiten" : "Neues Rezept"}</h2>
<label for="t">Titel</label><input id="t" type="text" maxlength="200" autocomplete="off" enterkeyhint="next">
<div class="two"><div><label for="p">Portionen</label><input id="p" type="number" min="1" max="99" inputmode="numeric"></div>
<div><label for="z">Zeit in Minuten</label><input id="z" type="number" min="0" max="6000" inputmode="numeric" placeholder="–"></div></div>
<label for="g">Schlagwörter</label><input id="g" type="text" autocomplete="off" placeholder="z. B. schnell, vegetarisch"><small>Mit Komma getrennt</small>
<label>Bild</label><div class="pic"><img alt="" hidden><button type="button" class="btn" data-a="pick"><ha-icon icon="mdi:camera-outline"></ha-icon><span>Foto wählen</span></button>
<button type="button" class="btn" data-a="clear" hidden><ha-icon icon="mdi:close"></ha-icon><span>Entfernen</span></button><input type="file" accept="image/*"></div>
<label for="i">Zutaten</label><textarea id="i" placeholder="250 g Mehl&#10;2 Eier&#10;1 Prise Salz"></textarea><small>Eine Zutat pro Zeile, Menge und Einheit vorn – dann lassen sich die Portionen umrechnen</small>
<label>Zubereitung</label><div class="steps"></div><small>Ein Absatz oder Listenpunkt je Schritt</small>
<div class="err"></div><div class="row"><button type="button" class="btn" data-a="cancel">Abbrechen</button><button type="submit" class="btn ok"><ha-icon icon="mdi:content-save-outline"></ha-icon><span>Speichern</span></button></div></form>`;
      const q = (s) => f.querySelector(s), img = q(".pic img"), file = q("input[type=file]"), clr = q("[data-a=clear]"), err = q(".err");
      const rt = richEditor({ placeholder: "Mehl und Eier verrühren …" });
      rt.set(r?.steps || "");
      q(".steps").append(rt.el);
      q("#t").value = r?.title || "";
      q("#p").value = r?.servings || 2;
      q("#z").value = r?.time ?? "";
      q("#g").value = (r?.tags || []).join(", ");
      q("#i").value = (r?.ingredients || []).map(ingredientLine).join("\n");
      const showPic = (src) => {
        img.hidden = !src;
        if (src) img.src = src;
        else img.removeAttribute("src");
        clr.hidden = !src;
      };
      showPic(st.image ? imageUrl(this._h, "recipes", st.image) : null);
      f.addEventListener("keydown", (ev) => ev.stopPropagation());
      f.addEventListener("pointerdown", (ev) => ev.stopPropagation());
      q("[data-a=pick]").addEventListener("click", () => file.click());
      clr.addEventListener("click", () => {
        st.image = null;
        st.data = null;
        showPic(null);
      });
      file.addEventListener("change", async () => {
        const fl = file.files?.[0];
        if (!fl) return;
        err.textContent = "";
        try {
          st.data = await compressImage(fl, IMG_MAX);
          st.image = null;
          showPic(st.data);
        } catch (x) {
          err.textContent = "Das Bild ließ sich nicht lesen.";
          console.warn(x);
        }
      });
      q("[data-a=cancel]").addEventListener("click", () => this._closeForm());
      q("form").addEventListener("submit", async (ev) => {
        ev.preventDefault();
        const title = q("#t").value.trim(), save = q("button[type=submit]");
        if (!title) {
          err.textContent = "Ein Titel fehlt noch.";
          q("#t").focus();
          return;
        }
        save.disabled = true;
        err.textContent = "";
        try {
          let image = st.image;
          if (st.data) image = (await uploadImage(this._h, "recipes", st.data)).image;
          const z = q("#z").value.trim();
          const recipe = {
            ...r ? { id: r.id } : {},
            title,
            image,
            servings: Math.max(1, Math.min(99, Math.round(+q("#p").value) || 2)),
            time: z === "" ? null : Math.max(0, Math.round(+z) || 0),
            tags: q("#g").value.split(",").map((x) => x.trim()).filter(Boolean),
            ingredients: q("#i").value.split("\n").map((x) => parseIngredient(x, this._units)).filter(Boolean),
            steps: rt.get()
          };
          const res = await recipes.save(this._h, recipe);
          if (!r && res?.id) this._jump = res.id;
          if (r) this._serv.delete(r.id);
          this._closeForm();
          if (this._jump) this._setRecipes(this._recipes);
        } catch (x) {
          console.warn("[nova-cards] Rezeptbuch: Speichern fehlgeschlagen", x);
          err.textContent = `Speichern hat nicht geklappt${x?.message ? `: ${x.message}` : ""}`;
          save.disabled = false;
        }
      });
      f.hidden = false;
      this._poke();
      if (!r) setTimeout(() => q("#t").focus(), 50);
    }
    _closeForm() {
      const f = this._e.form;
      f.hidden = true;
      f.replaceChildren();
      this._poke();
    }
  };
  var DEMO = [
    {
      id: "demo1",
      title: "Apfelkuchen",
      image: null,
      servings: 12,
      time: 75,
      tags: ["Backen"],
      ingredients: [{ qty: 200, unit: "g", name: "Mehl" }, { qty: 125, unit: "g", name: "Butter" }, { qty: 100, unit: "g", name: "Zucker" }, { qty: 1, unit: "", name: "Ei" }, { qty: 4, unit: "", name: "Äpfel" }],
      steps: "<p>Teig kneten</p><p>Äpfel schälen und schneiden</p><p>45 Minuten bei 180 °C backen</p>"
    },
    {
      id: "demo2",
      title: "Kartoffelsuppe",
      image: null,
      servings: 4,
      time: 40,
      tags: [],
      ingredients: [{ qty: 1, unit: "kg", name: "Kartoffeln" }, { qty: 1, unit: "", name: "Zwiebel" }, { qty: 1, unit: "l", name: "Brühe" }],
      steps: "<p>Kartoffeln würfeln</p><p>Alles 20 Minuten kochen</p><p>Pürieren</p>"
    }
  ];
  define("recipe-book-card", NovaRecipeBookCard, { name: "Nova Rezeptbuch", description: "Rezeptbuch zum Blättern in drei Stilen (altes Kochbuch, modern, Fantasy): Inhaltsverzeichnis, Rezepte mit Foto, Zutaten und Zubereitung, Portionen umrechnen, Zutaten auf die Einkaufsliste. Dieselben Rezepte wie in der Nova Rezeptliste (Nova-Integration).", documentationURL: docUrl("nova-rezeptbuch") });
  var S_BOOK = [
    g2({ name: "title", selector: T }, { name: "subtitle", selector: T }),
    g2(
      sel("style", [["old", "Old Book (altes Kochbuch)"], ["modern", "Modern Book (schlicht, grau)"], ["fantasy", "Fantasy Book (Zauberbuch)"]]),
      sel("cover_color", [["brown", "Braun"], ["red", "Rot"], ["green", "Grün"], ["blue", "Blau"]])
    )
  ];
  var S_USE = [
    sel("layout", [["auto", "Automatisch"], ["double", "Doppelseite"], ["single", "Einzelseite"]]),
    sel("turn", [["auto", "Automatisch"], ["3d", "3D"], ["simple", "Einfach (schwache Geräte)"]]),
    g2({ name: "start_open", selector: { boolean: {} } }, { name: "close_after", selector: { number: { min: 0, max: 3600, step: 10, mode: "box", unit_of_measurement: "s" } } })
  ];
  var LABELS4 = { title: "Titel auf dem Einband", subtitle: "Untertitel (optional)", style: "Stil", cover_color: "Einband", layout: "Seiten", start_open: "Aufgeschlagen starten", close_after: "Zuklappen nach", turn: "Blättern" };
  var HELPERS4 = {
    layout: "Automatisch: ab 560 px Breite als Doppelseite, schmaler als Einzelseite.",
    close_after: "0 = bleibt offen. Sonst klappt das Buch nach so vielen Sekunden ohne Bedienung zu.",
    subtitle: "Steht unter dem Titel, z. B. „von Oma Erna“.",
    cover_color: "Der Farbton passt sich dem Stil an (Leder, Leinen grau getönt, dunkles Zauberbuch).",
    style: "Alle Stile zeigen dieselben Rezepte – auch die Nova Rezeptliste.",
    turn: "Automatisch: 3D-Blättern, auf schwachen Geräten (z. B. Echo Show) oder wenn es ruckelt flaches Blättern mit Schatten."
  };
  var NovaRecipeBookCardEditor = class extends NovaEditorBase {
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      const data = () => ({ ...DEF, ...this._config });
      const form = (s) => this._form(s, data(), (v) => {
        const c = merge(this._config, names(s), v);
        Object.keys(DEF).forEach((k) => {
          if (c[k] === DEF[k]) delete c[k];
        });
        this._emit(c);
      });
      r.querySelector(".wrap").append(
        this._section("book", "mdi:book-open-page-variant-outline", "Buch", (b) => b.append(form(S_BOOK))),
        this._section("use", "mdi:gesture-swipe-horizontal", "Seiten und Verhalten", (b) => b.append(form(S_USE)))
      );
    }
  };
  __publicField(NovaRecipeBookCardEditor, "labels", LABELS4);
  __publicField(NovaRecipeBookCardEditor, "helpers", HELPERS4);
  __publicField(NovaRecipeBookCardEditor, "openSections", ["book"]);
  define("recipe-book-card-editor", NovaRecipeBookCardEditor);

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
.nchip{display:inline-flex;align-items:center;gap:var(--nv-s3);min-height:34px;box-sizing:border-box;padding:0 var(--nv-s6);border-radius:var(--nv-r-pill);flex:none;
background:var(--c,var(--nv-chip));color:var(--cf,inherit);border:1px solid var(--nv-box-border);font-size:var(--nv-fs-5);white-space:nowrap;
cursor:pointer;outline:none;-webkit-tap-highlight-color:transparent;user-select:none;transition:background-color var(--nv-d2),color var(--nv-d2),transform var(--nv-d2),opacity var(--nv-d2)}
.nchip.col{border-color:transparent;background:color-mix(in srgb,var(--c) var(--nv-fill),var(--nv-chip));color:color-mix(in srgb,var(--cf) var(--nv-fill-ink),var(--nv-fg));box-shadow:var(--nv-fill-edge)}
.nchip ha-icon{--mdc-icon-size:var(--nv-icon-sm);display:flex}.nchip img{width:16px;height:16px}
.nchip .ci:empty,.nchip .cn:empty,.nchip .cv:empty{display:none}
.nchip .cn:not(:empty)+.cv:not(:empty)::before{content:'· '}
.nchip:focus-visible{box-shadow:var(--nv-focus)}.nchip:active{transform:scale(.95)}
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
      ...btn ? [] : [{ name: "decimals", selector: { number: { min: 0, max: 4, mode: "box" } } }],
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
    state: "Nur anzeigen bei Zustand",
    decimals: "Nachkommastellen"
  };
  var CHIP_HELPERS = {
    color: "Leer = neutral.",
    state: "z. B. on, mehrere mit Komma. Leer = immer anzeigen. Bei Knöpfen bezieht es sich auf die gewählte Entität.",
    tap_action: "Bei Wert-Chips: leer = Details öffnen.",
    decimals: "Nur bei Zahlenwerten. Leer = wie in Home Assistant. Beispiel: 1 → 21,9 °C."
  };

  // src/theme-switch.js
  var DEF2 = { display: "button", name: "Theme", icon: "mdi:palette-outline" };
  var MSG = { admin: "Einmal als Admin umschalten", failed: "Hat nicht geklappt" };
  var CSS = `${NOVA_VARS}${PANEL_CSS}${NOVA_CHIPS_CSS}
:host([data-display=chip]){height:auto}:host([data-display=chip])::before{display:none}
.g.ts{flex-direction:row;align-items:center;justify-content:center}
.ts .hd{flex:1;min-width:0}
.ts .go{flex:none;opacity:.6}
.ts select{flex:none;max-width:55%;height:36px;box-sizing:border-box;padding:0 var(--nv-s7) 0 var(--nv-s6);border-radius:var(--nv-r-pill);
border:1px solid var(--nv-box-border);background:var(--nv-chip);color:var(--nv-fg);font:inherit;font-size:var(--nv-fs-6);cursor:pointer;outline:none}
.ts select:focus-visible{box-shadow:var(--nv-focus)}
.ts option{background:var(--nv-popup-base);color:var(--nv-fg)}
.ts.busy .ic,.nchip.busy{opacity:.6}
.nchips{display:flex}`;
  var NovaThemeSwitchCard = class extends HTMLElement {
    static getConfigElement() {
      return document.createElement(tag("theme-card-editor"));
    }
    static getStubConfig() {
      return { display: "button" };
    }
    setConfig(c) {
      if (!c || typeof c !== "object") throw new Error("Ungültige Konfiguration");
      if (c.display && !["chip", "button", "dropdown"].includes(c.display)) throw new Error("display: chip, button oder dropdown");
      this._c = { ...DEF2, ...c };
      this.dataset.display = this._c.display;
      this._built = false;
      if (this._h) this._render();
    }
    set hass(h) {
      const old = this._h;
      this._h = h;
      if (this._c && (!this._built || hassChanged(old, h, storeIds()))) this._render();
    }
    getCardSize() {
      return 1;
    }
    getGridOptions() {
      return this._c?.display === "chip" ? { columns: 3, rows: "auto" } : { columns: 6, rows: 1, min_rows: 1 };
    }
    _cur() {
      return this._want || readTheme(this._h) || "blau";
    }
    _next() {
      const i = THEME_KEYS.indexOf(this._cur());
      return THEME_KEYS[(i + 1) % THEME_KEYS.length];
    }
    async _pick(k) {
      if (!k || k === this._cur() || this._busy) return;
      this._want = k;
      this._busy = true;
      this._msg = "";
      this._render();
      try {
        await setTheme(this._h, k);
      } catch (e) {
        this._msg = MSG[e.code] || MSG.failed;
        console.warn("[nova-cards] Theme", e);
        clearTimeout(this._mt);
        this._mt = setTimeout(() => {
          this._msg = "";
          this._render();
        }, 5e3);
      }
      this._want = null;
      this._busy = false;
      this._render();
    }
    connectedCallback() {
      window.addEventListener(THEME_EVENT, this._onStore ||= () => this._c && this._h && this._render());
    }
    disconnectedCallback() {
      clearTimeout(this._mt);
      window.removeEventListener(THEME_EVENT, this._onStore);
    }
    _build() {
      const r = this.shadowRoot || this.attachShadow({ mode: "open" }), c = this._c;
      const nm = `<div class="nm"><b>${esc(c.name)}</b><small></small></div>`;
      r.innerHTML = `<style>${CSS}</style>${c.display === "chip" ? `<div class="nchips"><div class="nchip"><span class="ci"></span><span class="cn">${esc(c.name)}</span><span class="cv"></span></div></div>` : `<div class="g ts"><div class="hd"><div class="ic"></div>${nm}</div>${c.display === "dropdown" ? `<select aria-label="${esc(c.name)}">${THEME_KEYS.map((k) => `<option value="${k}">${esc(THEMES[k].name)}</option>`).join("")}</select>` : '<ha-icon class="go" icon="mdi:chevron-right"></ha-icon>'}</div>`}`;
      const hit = r.querySelector(c.display === "chip" ? ".nchip" : ".g");
      if (c.display === "dropdown") r.querySelector("select").addEventListener("change", (e) => this._pick(e.target.value));
      else press(hit, { tap: () => this._pick(this._next()) });
      if (c.display === "chip") hit.setAttribute("aria-label", `${c.name}: weiterschalten`);
      setIcon(r.querySelector(c.display === "chip" ? ".ci" : ".ic"), c.icon);
      this._built = true;
    }
    _render() {
      if (!this._built) this._build();
      const r = this.shadowRoot, k = this._cur(), name = THEMES[k].name;
      const msg = this._msg || (this._h && !hasStore(this._h) && !canSetup(this._h) ? MSG.admin : "");
      const txt = msg || name;
      const v = r.querySelector(".cv, small");
      if (v.textContent !== txt) v.textContent = txt;
      const s = r.querySelector("select");
      if (s && s.value !== k) s.value = k;
      r.querySelector(".nchip, .g").classList.toggle("busy", !!this._busy);
    }
  };
  define("theme-card", NovaThemeSwitchCard, { name: "Nova Themes Schalter", description: "Wählt das Nova-Theme (Blau, Hell …) für alle Nova Cards auf allen Geräten – als Chip, Button oder Dropdown. Richtet sich beim ersten Umschalten selbst ein.", documentationURL: docUrl("nova-themes-schalter") });
  var S_GEN = [
    sel("display", [["button", "Button (Antippen schaltet weiter)"], ["chip", "Chip (wie die Chips Card)"], ["dropdown", "Dropdown (Liste)"]]),
    g2({ name: "name", selector: T }, { name: "icon", selector: I })
  ];
  var LABELS5 = { display: "Darstellung", name: "Beschriftung", icon: "Icon" };
  var NovaThemeSwitchCardEditor = class extends NovaEditorBase {
    // der Schalter zeigt immer das globale Theme
    _build() {
      const r = this.shadowRoot;
      r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
      r.querySelector(".wrap").append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => {
          b.append(this._hint("Gilt für alle Nova Cards auf allen Geräten. Beim ersten Umschalten legt die Karte dafür selbst einen Helfer „Nova Theme“ an – das darf in Home Assistant nur ein Administrator, danach können alle umschalten."));
          b.append(this._form(S_GEN, { ...DEF2, ...this._config }, (v) => {
            const c = merge(this._config, names(S_GEN), v);
            Object.entries(DEF2).forEach(([k, x]) => {
              if (c[k] === x) delete c[k];
            });
            this._emit(c);
          }));
        })
      );
    }
  };
  __publicField(NovaThemeSwitchCardEditor, "labels", LABELS5);
  __publicField(NovaThemeSwitchCardEditor, "openSections", ["general"]);
  __publicField(NovaThemeSwitchCardEditor, "noTheme", true);
  define("theme-card-editor", NovaThemeSwitchCardEditor);

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
  var PCSS = `
:host{position:fixed;inset:0 var(--nv-pop-r,0px) 0 var(--nv-pop-l,0px);z-index:6;display:flex;align-items:center;justify-content:center;background:var(--nv-popup-backdrop);backdrop-filter:blur(var(--nv-blur-xs));-webkit-backdrop-filter:blur(var(--nv-blur-xs));animation:fi .2s}
.root{width:min(var(--nova-popup-width,1180px),96%);max-height:84vh;overflow-y:auto;overflow-x:hidden;-webkit-overflow-scrolling:touch;overscroll-behavior:contain;box-sizing:border-box;padding:var(--nv-s7);border-radius:28px;
background:var(--nv-navi-popup-bg);border:1px solid var(--nv-border);box-shadow:var(--nv-shadow-popup);color:var(--nv-fg);font-family:var(--nv-font);animation:up .28s var(--nv-ease)}
.hd{position:sticky;top:0;z-index:2;display:flex;align-items:center;gap:var(--nv-s5);margin-bottom:var(--nv-s7);padding:var(--nv-s3) var(--nv-s3) var(--nv-s3) var(--nv-s7);border-radius:var(--nv-r-pill);background:var(--nv-popup-head);backdrop-filter:blur(var(--nv-blur-lg));-webkit-backdrop-filter:blur(var(--nv-blur-lg))}
.tt{flex:1;min-width:0;font-weight:var(--nv-fw-bold);font-size:var(--nv-fs-9);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.x{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:rgba(var(--nv-tint),.14);cursor:pointer;flex:none}
ha-icon{--mdc-icon-size:var(--nv-icon-lg);display:flex}
.body{display:grid;grid-template-columns:repeat(auto-fill,minmax(var(--nova-popup-min-col,300px),1fr));gap:var(--nv-s6);align-items:start}
.body.one{grid-template-columns:1fr}
.empty{opacity:.6;font-size:var(--nv-fs-6);padding:var(--nv-s4)}
@media(max-width:600px){:host{align-items:flex-end}.root{width:100%;max-height:86vh;border-radius:28px 28px 0 0;padding:12px 12px calc(90px + env(safe-area-inset-bottom))}.body{grid-template-columns:1fr}}
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
  var DCSS = `
:host{display:block;height:var(--nova-navi-space,var(--nova-dock-space,64px));transition:height var(--nv-d4) ease}
:host([media]){height:calc(var(--nova-navi-space,var(--nova-dock-space,64px)) + 62px)}
:host([side]){height:0}
ha-icon{--mdc-icon-size:22px;display:flex}
.wrap{position:fixed;left:50%;transform:translateX(-50%);z-index:7;display:flex;flex-direction:column;align-items:stretch;gap:var(--nv-s4);max-width:calc(100vw - 24px)}
.wrap.bottom{bottom:calc(14px + env(safe-area-inset-bottom))}.wrap.top{top:14px;flex-direction:column-reverse}
.wrap.side{top:50%;bottom:auto;left:14px;right:auto;transform:translateY(-50%);max-width:none;max-height:calc(100vh - 28px);flex-direction:column}
.wrap.side.right{left:auto;right:14px}
.wrap.inline{position:static;transform:none;margin:0 auto;width:max-content;max-width:100%}
.glass{background:var(--nv-bg);backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat-2));-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat-2));border:1px solid var(--nv-border);box-shadow:0 12px 36px rgba(var(--nv-shade),.4)}
.dk{position:relative;display:flex;border-radius:var(--nv-r-pill);max-width:100%;min-width:0;min-height:0}
.side .dk{flex-direction:column}
.dock{--g:8px;--o:6px;position:relative;z-index:1;flex:1 1 auto;min-width:0;min-height:0;margin:calc(-1 * var(--o));display:flex;align-items:center;gap:var(--g);padding:calc(8px + var(--o));border-radius:var(--nv-r-pill);overflow-x:auto;overflow-y:hidden;scrollbar-width:none;box-sizing:border-box;--a1:1;--a2:1;--md:to right}
.side .dock{flex-direction:column;overflow-x:hidden;overflow-y:auto;--md:to bottom}
.dock.fs{--a1:0}.dock.fe{--a2:0}
.dock.fs,.dock.fe{-webkit-mask-image:linear-gradient(var(--md),rgba(0,0,0,var(--a1)) var(--o),#000 calc(var(--o) + 22px),#000 calc(100% - var(--o) - 22px),rgba(0,0,0,var(--a2)) calc(100% - var(--o)));mask-image:linear-gradient(var(--md),rgba(0,0,0,var(--a1)) var(--o),#000 calc(var(--o) + 22px),#000 calc(100% - var(--o) - 22px),rgba(0,0,0,var(--a2)) calc(100% - var(--o)))}
.dock::-webkit-scrollbar{display:none}
.d{--s:var(--sz);z-index:1;width:var(--s);height:var(--s);box-sizing:border-box;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:var(--nv-fg);cursor:pointer;position:relative;transition:background-color var(--nv-d2),color var(--nv-d2),border-color var(--nv-d2),box-shadow var(--nv-d2),transform var(--nv-d2),opacity var(--nv-d2);-webkit-tap-highlight-color:transparent;outline:none;user-select:none;-webkit-user-select:none}
.d[hidden]{display:none}
.d:focus-visible{box-shadow:var(--nv-focus)}
.d:active{transform:scale(.9)}
.d.act{background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));box-shadow:0 0 16px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 60%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
/* Aktiver Eintrag: runde Markierung .hl gleitet unter die Buttons; Farbe nur übers Theme (--nova-navi-active-color), Standard Akzent 2.
   Animiert werden nur transform, opacity und max-width – schont schwache Tablets. */
.dk{--hc:var(--nova-navi-active-color,var(--nv-a2));--ease:cubic-bezier(.25,.8,.25,1)}
/* Glas der Leiste als eigene Ebene: gleitet beim Wechsel per transform auf die neue Breite (Blur bleibt unverändert) */
.dk>.bg{position:absolute;inset:0;border-radius:inherit;z-index:0;pointer-events:none;transform-origin:0 50%}
.hl{position:absolute;left:0;top:0;z-index:0;width:var(--sz);height:var(--sz);border-radius:50%;background:color-mix(in srgb,var(--hc) var(--nv-fill),var(--nv-chip));box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--hc) 50%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge);pointer-events:none;opacity:0;will-change:transform}
.hl.on{opacity:1}
.d.here{color:var(--nova-navi-active-text-color,color-mix(in srgb,var(--nv-a2-fg) var(--nv-fill-ink),var(--nv-fg)))}
/* Inaktiv-Farbe bleibt immer die Grundfarbe des Buttons; Gelb liegt als eigene Ebene darüber (unter dem Icon).
   So geht der alte Button direkt von Gelb zu Blau über, nie über transparent */
.d::before{content:'';position:absolute;inset:0;z-index:-1;border-radius:50%;background:color-mix(in srgb,var(--hc) var(--nv-fill),var(--nv-chip));box-shadow:var(--nv-fill-edge);opacity:0;pointer-events:none}
.d.lit::before{opacity:1}
/* Während einer Animation: nur transform und opacity, gleiche Dauer und Kurve für alle Teile */
.run .d,.run .d::before,.run .nm,.run+.bg,.run .hl,.run .ghost{transition:transform var(--dur) var(--ease),opacity var(--dur) var(--ease),color var(--dur) var(--ease)}
/* Messen und Startlage setzen: ohne Übergang */
.hold .d,.hold .d::before,.hold .nm,.hold+.bg,.hold .hl{transition:none!important}
.ghost{position:absolute;left:0;top:0;z-index:1;pointer-events:none;white-space:nowrap;color:var(--nv-fg);font:600 14px/1.2 var(--ha-font-family-body,Roboto,sans-serif)}
.d img{width:calc(var(--s) * .6);height:calc(var(--s) * .6);object-fit:contain}
.nm{flex:none;z-index:1;max-width:0;overflow:hidden;white-space:nowrap;opacity:0;margin-left:calc(-1 * var(--g));color:var(--nv-fg);font:600 14px/1.2 var(--ha-font-family-body,Roboto,sans-serif)}
.nm.on{max-width:180px;opacity:1;margin-left:0;padding-right:var(--nv-s3)}
.nm[hidden],.side .nm{display:none}
@media(prefers-reduced-motion:reduce){.dock,.dock *{transition:none!important}}
.dot{position:absolute;top:14%;right:14%;width:8px;height:8px;border-radius:50%;background:var(--bc,var(--nv-accent));box-shadow:0 0 6px var(--bc,var(--nv-accent));display:none}
.d.bd .dot{display:block}
.num{position:absolute;top:2px;right:0;min-width:16px;height:16px;padding:0 var(--nv-s2);box-sizing:border-box;border-radius:8px;background:var(--bc,var(--nv-accent));color:var(--bfg,var(--nv-accent-fg));font:700 10px/16px var(--ha-font-family-body,Roboto,sans-serif);text-align:center;display:none}
.d.bn .num{display:block}.d.bn .dot{display:none}
.empty{color:var(--nv-fg);opacity:.7;font-size:var(--nv-fs-6);padding:var(--nv-s3) var(--nv-s6)}
.mbw{display:grid;grid-template-rows:0fr;margin-bottom:-8px;opacity:0;transform:translateY(14px);pointer-events:none;transition:grid-template-rows var(--mbd) ease,margin var(--mbd) ease,opacity var(--mbd) ease,transform var(--mbd) var(--nv-ease)}
.mbw.on{grid-template-rows:1fr;margin-bottom:0;opacity:1;transform:none;pointer-events:auto}
.top .mbw{margin-bottom:0;margin-top:-8px;transform:translateY(-14px)}.top .mbw.on{margin-top:0;transform:none}
.side .mbw{transform:translateX(-14px)}.side.right .mbw{transform:translateX(14px)}.side .mbw.on{transform:none}
.mbi{min-height:0;overflow:hidden;display:flex;justify-content:center}.mbw.open .mbi{overflow:visible}
.mb{display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s3) var(--nv-s3) var(--nv-s3) var(--nv-s3);border-radius:var(--nv-r-pill);width:min(340px,calc(100vw - 24px));box-sizing:border-box;color:var(--nv-fg);font-family:var(--nv-font)}
.mb .art{width:40px;height:40px;flex:none;border-radius:50%;background:var(--nv-chip) center/cover no-repeat;display:flex;align-items:center;justify-content:center;cursor:pointer}
.mb .art.pic ha-icon{display:none}
.mb .tx{flex:1;min-width:0;cursor:pointer}
.mb .tx b,.mb .tx span{display:block;white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.mb .tx b{font-size:var(--nv-fs-6);font-weight:var(--nv-fw-bold)}.mb .tx span{font-size:var(--nv-fs-2);opacity:.7}
.mb .tx span.warn{opacity:1;color:var(--nv-warn)}
.mb .pp,.mb .sp{flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;cursor:pointer;-webkit-tap-highlight-color:transparent;outline:none;transition:transform var(--nv-d1)}
.mb .pp{width:40px;height:40px;background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));color:color-mix(in srgb,var(--nv-active-fg) var(--nv-fill-ink),var(--nv-fg));box-shadow:var(--nv-fill-edge)}
.mb .sp{width:32px;height:32px;background:var(--nv-chip);color:var(--nv-fg);opacity:.85}.mb .sp ha-icon{--mdc-icon-size:var(--nv-icon-md)}
.mb .sp[hidden]{display:none}
.mb .pp:active,.mb .sp:active{transform:scale(.9)}
.mb .pp:focus-visible,.mb .sp:focus-visible{box-shadow:var(--nv-focus)}
.side .mb{width:auto;flex-direction:column;padding:var(--nv-s3);border-radius:28px}
.side .mb .tx{display:none}
.mi .tt{display:flex;flex-direction:column;min-width:0;line-height:1.25}.mi .tt span{font-size:var(--nv-fs-4);opacity:.7;overflow:hidden;text-overflow:ellipsis;max-width:220px}
.mi .ic.pic{background:var(--nv-chip) center/cover no-repeat}.mi .ic.pic ha-icon{display:none}
@media(prefers-reduced-motion:reduce){.mbw{transition:none}}
.menu{position:fixed;z-index:8;display:flex;flex-direction:column;gap:var(--nv-s2);padding:var(--nv-s3);border-radius:22px;min-width:180px;max-width:calc(100vw - 16px);max-height:60vh;overflow-y:auto;box-sizing:border-box;color:var(--nv-fg);font-family:var(--nv-font);animation:mi .16s ease-out}
.mi{display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s4) var(--nv-s7) var(--nv-s4) var(--nv-s4);border-radius:var(--nv-r-pill);cursor:pointer;font-size:var(--nv-fs-8);white-space:nowrap;-webkit-tap-highlight-color:transparent;outline:none}
.mi[hidden]{display:none}
.mi:hover,.mi:focus-visible{background:var(--nv-chip)}
.mi.here{background:var(--nv-chip);box-shadow:inset 0 0 0 1px rgba(var(--nv-tint),.4)}
.mi .ic{width:32px;height:32px;flex:none;border-radius:50%;display:flex;align-items:center;justify-content:center;background:var(--nv-chip)}
.mi .ic img{width:60%;height:60%;object-fit:contain}
.mi ha-icon{--mdc-icon-size:var(--nv-icon-md)}
@keyframes mi{from{opacity:0;transform:scale(.96)}}
/* Kompakt (schmale Bildschirme automatisch, oder per compact: true): kleinere Buttons und Abstände, Name nur am aktiven Eintrag */
@media(max-width:600px){.wrap:not(.nocmp) .d,.wrap:not(.nocmp) .hl{--s:calc(var(--sz) * .875)}.wrap:not(.nocmp) .hl{width:var(--s);height:var(--s)}.wrap:not(.nocmp) .dock{--g:5px;padding:calc(6px + var(--o))}.wrap:not(.nocmp) .nm,.wrap:not(.nocmp) .ghost{font-size:var(--nv-fs-6)}}
.cmp .d,.cmp .hl{--s:calc(var(--sz) * .875)}.cmp .hl{width:var(--s);height:var(--s)}.cmp .dock{--g:5px;padding:calc(6px + var(--o))}.cmp .nm,.cmp .ghost{font-size:var(--nv-fs-6)}`;
  var SRC = {};
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
      r.innerHTML = `<style>${NAVI_VARS}${DCSS}</style><div class="wrap ${this._inline ? "inline" : ""} ${{ true: "cmp", false: "nocmp" }[this._opt("compact")] || ""}" style="--sz:${+c.button_size || 48}px;--dur:${this._dur}ms;--mbd:${this._opt("animation") === false ? 0 : 300}ms"><div class="mbw"><div class="mbi"><div class="mb glass"><div class="art"><ha-icon icon="mdi:music"></ha-icon></div><div class="tx"><b></b><span></span></div><div class="sp" role="button" tabindex="0" title="Lautsprecher wählen" hidden><ha-icon icon="mdi:speaker"></ha-icon></div><div class="pp" role="button" tabindex="0" title="Play/Pause"><ha-icon></ha-icon></div></div></div></div><div class="dk"><div class="dock"><div class="hl"></div></div><div class="bg glass"></div></div></div>`;
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
      const live2 = ps.map((p) => ({ ...p, s: h.states[p.entity] })).map((p) => ({ ...p, l: this._live(p.s) })).filter((p) => p.l);
      const t = (p) => Date.parse(p.s.last_changed) || 0;
      const playing = live2.filter((p) => p.l === true).sort((x, y) => t(y) - t(x));
      const pick = SEL.get(key);
      const manual = pick && ps.find((p) => p.entity === pick.id) && !playing.some((p) => p.entity !== pick.id && t(p) > pick.at) && (live2.some((p) => p.entity === pick.id) || Date.now() - pick.at < this._pauseMs);
      let cur2 = manual ? ps.find((p) => p.entity === pick.id) : playing[0] || live2.sort((x, y) => t(y) - t(x))[0] || null;
      const show = !!live2.length || !!this._opt("media_always") && !!ps.length;
      if (!cur2 && show) cur2 = ps[0];
      clearTimeout(this._mpt);
      const next = Math.min(...live2.filter((p) => p.l !== true).map((p) => p.l));
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
      const r = b.getBoundingClientRect(), W = innerWidth, H = innerHeight, g = 10, side = this._side;
      const w = m.offsetWidth, ht = m.offsetHeight, clamp = (v, max) => Math.max(8, Math.min(v, max - 8));
      if (side) {
        m.style.left = `${side === "right" ? r.left - g - w : r.right + g}px`;
        m.style.top = `${clamp(r.top + r.height / 2 - ht / 2, H - ht)}px`;
      } else {
        m.style.left = `${clamp(r.left + r.width / 2 - w / 2, W - w)}px`;
        m.style.top = `${this._cfg.position === "top" ? r.bottom + g : r.top - g - ht}px`;
      }
    }
    _openCards(i, it) {
      const p = document.createElement(tag("navi-popup"));
      p.onclose = () => this._close();
      p.cfg = { title: it.popup_title || it.label || "", icon: it.icon, cards: it.cards };
      if (this.hasAttribute("nova-theme")) p.setAttribute("nova-theme", this.getAttribute("nova-theme"));
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
  var GEN4 = [{ name: "source", selector: { text: {} } }];
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
  var LABELS6 = {
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
  var HELPERS5 = {
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
          b.append(form(GEN4));
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
      const subs2 = this._config.items[i].menu || [], out = [];
      const setSubs = (arr) => {
        const it = { ...this._config.items[i] };
        if (arr.length) it.menu = arr;
        else delete it.menu;
        this._setItem(i, it);
      };
      if (!subs2.length) out.push(this._hint("Mit Einträgen öffnet der Button beim Antippen ein kleines Menü."));
      subs2.forEach((sub, j) => {
        const key = `m${i}.${j}`, lbl = (x) => `${j + 1}. ${x.label || pathOf(x) || x.popup_hash || "Neuer Eintrag"}`;
        const [d] = this._details(key, sub.icon || "mdi:circle-outline", lbl(sub), this._itemBtns(j, subs2.length, (dir) => {
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
  __publicField(NovaNaviCardEditor, "labels", LABELS6);
  __publicField(NovaNaviCardEditor, "helpers", HELPERS5);
  __publicField(NovaNaviCardEditor, "openSections", ["buttons"]);
  define("navi-card-editor", NovaNaviCardEditor);

  // src/shared/marquee.js
  var MARQUEE_CSS = `
.mq{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.mq>.mqi{display:inline}
.mq.run{text-overflow:clip;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 6px,#000 calc(100% - 14px),transparent);mask-image:linear-gradient(90deg,transparent 0,#000 6px,#000 calc(100% - 14px),transparent)}
.mq.run>.mqi{display:inline-block;padding-left:var(--nv-s2);animation:nv-mq var(--mqd,8s) ease-in-out infinite alternate;will-change:transform}
@keyframes nv-mq{0%,18%{transform:translateX(0)}82%,100%{transform:translateX(var(--mqx,0))}}
@media(prefers-reduced-motion:reduce){.mq.run{text-overflow:ellipsis;-webkit-mask-image:none;mask-image:none}.mq.run>.mqi{display:inline;padding-left:0;animation:none}}`;
  var SPEED = 28;
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
    el2.style.setProperty("--mqd", `${Math.max(MIN, dist / SPEED / 0.64).toFixed(1)}s`);
    el2.classList.add("run");
  };
  var stopMarquee = (el2) => {
    if (!el2?._mqRo) return;
    el2._mqRo.disconnect();
    el2._mqRo = null;
    el2.classList.remove("run");
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
    pool.forEach((ws2, k) => {
      const key = `${kind}|${k}`;
      (HANDOFF.get(key) || HANDOFF.set(key, []).get(key)).push(...ws2);
    });
    clearTimeout(handoffT);
    handoffT = setTimeout(() => HANDOFF.clear(), 3e3);
  };
  var takeOver = (kind, k) => HANDOFF.get(`${kind}|${k}`)?.shift();
  var GRID_CSS = `
.rw{display:flex;flex-wrap:wrap;gap:var(--nv-s6);flex:none;align-items:flex-start}
.eqh .rw{align-items:stretch}.eqh .rw>.cell{display:grid}
.rw>.cell.auto{min-width:min(100%,140px)}
.stack .rw>.cell{flex:1 1 100%!important}
.cell{min-width:0}
.cell.empty{min-height:0}
.err{display:flex;gap:var(--nv-s4);align-items:flex-start;padding:var(--nv-s6) var(--nv-s7);border-radius:var(--nv-r-lg);font-size:var(--nv-fs-6);
background:color-mix(in srgb,var(--nv-error) 18%,transparent);border:1px solid color-mix(in srgb,var(--nv-error) 50%,transparent)}
.err ha-icon{color:var(--nv-error);flex:none}
.hint{font-size:var(--nv-fs-6);opacity:.7;padding:var(--nv-s4) var(--nv-s1)}`;
  var CHIP_CSS = `
.info{display:flex;flex-wrap:wrap;gap:7px;flex:none}
.info.scroll{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.info.scroll::-webkit-scrollbar{display:none}
.info[hidden]{display:none}
.chip{display:inline-flex;align-items:center;gap:var(--nv-s3);padding:7px var(--nv-s6);border-radius:var(--nv-r-pill);background:var(--nv-chip);border:1px solid var(--nv-box-border);font-size:var(--nv-fs-5);white-space:nowrap;cursor:pointer;flex:none;outline:none;transition:background-color var(--nv-d2),color var(--nv-d2),border-color var(--nv-d2),box-shadow var(--nv-d2),transform var(--nv-d2),opacity var(--nv-d2)}
.chip ha-icon{--mdc-icon-size:var(--nv-icon-sm)}.chip img{width:16px;height:16px}.chip:focus-visible{box-shadow:var(--nv-focus)}.chip:active{transform:scale(.95)}
.chip .cn:empty{display:none}.chip .cn:not(:empty)::after{content:' ·'}
.chip.al{background:color-mix(in srgb,var(--c) var(--nv-fill),var(--nv-chip));color:color-mix(in srgb,var(--cf) var(--nv-fill-ink),var(--nv-fg));border-color:transparent;box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--c) 45%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}`;
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

  // src/popup.js
  var DEF3 = { width: 1180, stack_below: 500, info_layout: "wrap", info_position: "header" };
  var PCSS2 = `${NOVA_VARS}${GRID_CSS}${CHIP_CSS}
:host{display:block;font-family:var(--nv-font)}
:host(.live){display:contents}
ha-icon{--mdc-icon-size:var(--nv-icon-lg);display:flex}
.ph{display:none;align-items:center;gap:var(--nv-s5);padding:var(--nv-s5) var(--nv-s6);border-radius:var(--nv-r-md);border:1px dashed var(--divider-color,#666);color:var(--primary-text-color);font-size:var(--nv-fs-6)}
:host(.edit) .ph{display:flex}
.ph .t{flex:1;min-width:0;overflow:hidden;text-overflow:ellipsis;white-space:nowrap}
.pop{position:fixed;inset:0 var(--nv-pop-r,0px) 0 var(--nv-pop-l,0px);z-index:var(--nova-popup-z-index,6);display:flex;align-items:center;justify-content:center}
.pop[hidden]{display:none}
.ov{position:absolute;inset:0;background:var(--nv-popup-backdrop);backdrop-filter:blur(var(--nv-blur-xs));-webkit-backdrop-filter:blur(var(--nv-blur-xs));opacity:0;transition:opacity .22s}
.sh{position:relative;display:flex;flex-direction:column;box-sizing:border-box;width:min(var(--pw,1180px),96%);max-height:88vh;
background:var(--nv-popup-bg);color:var(--nv-fg);border-radius:var(--nv-popup-r);border:1px solid var(--nv-border);
box-shadow:var(--nv-shadow-popup);overflow:hidden;opacity:0;transform:translateY(40px);transition:transform .26s var(--nv-ease),opacity var(--nv-d2)}
.sh.tint{background:linear-gradient(160deg,color-mix(in srgb,var(--tc) 55%,var(--nv-popup-base)),var(--nv-popup-base))}
.pop.in .ov{opacity:1}.pop.in .sh{opacity:1;transform:none}
.grip{display:none;justify-content:center;padding:var(--nv-s4) 0 0;flex:none;touch-action:none}.grip i{width:40px;height:5px;border-radius:3px;background:currentColor;opacity:.35}
.hd{display:flex;align-items:center;gap:var(--nv-s5);margin:var(--nv-s7) var(--nv-s7) var(--nv-s5);padding:var(--nv-s3) var(--nv-s3) var(--nv-s3) var(--nv-s7);border-radius:var(--nv-r-pill);flex:none;touch-action:pan-x;
background:var(--nv-popup-head);backdrop-filter:blur(var(--nv-blur-lg));-webkit-backdrop-filter:blur(var(--nv-blur-lg))}
.hi:empty{display:none}
.tt{flex:1 1 auto;min-width:min(30%,120px);font-weight:var(--nv-fw-bold);font-size:var(--nv-fs-9)}${MARQUEE_CSS}
.bdg{display:flex;gap:var(--nv-s3);flex:0 1 auto;min-width:0;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.bdg::-webkit-scrollbar{display:none}.bdg:empty{display:none}
.bd{display:inline-flex;align-items:center;gap:5px;flex:none;padding:5px var(--nv-s5);border-radius:var(--nv-r-pill);background:var(--c,var(--nv-chip));color:var(--cf,inherit);font-size:var(--nv-fs-4);white-space:nowrap;cursor:pointer;outline:none}
.bd ha-icon{--mdc-icon-size:15px}.bd img{width:15px;height:15px}.bd:focus-visible{box-shadow:var(--nv-focus)}.bd:active{transform:scale(.95)}
.bd .bn:empty,.bd .bv:empty{display:none}.bd .bn:not(:empty)+.bv:not(:empty)::before{content:'· '}
.bd[hidden]{display:none}
.x{width:36px;height:36px;border-radius:50%;border:none;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:inherit;cursor:pointer;padding:0}
.x:active{transform:scale(var(--nv-press))}
.info{padding:0 var(--nv-s7) var(--nv-s6)}
/* Info-Chips in der Kopfzeile (info_position: header): rechtsbündig vor dem X, gleiche Höhe wie das X, bei Platzmangel waagrecht scrollbar */
.hd .info{padding:0;flex:0 1 auto;min-width:0;flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.hd .info::-webkit-scrollbar{display:none}
.hd .chip{min-height:36px;box-sizing:border-box;padding:0 var(--nv-s6)}
/* Chips haben Vorrang: der Titel nimmt nur den Rest (bis zu seiner Mindestbreite, dann Laufschrift) */
.hd:has(>.info:not([hidden])) .tt{flex:1 1 0;min-width:min(24%,88px)}
.body{flex:1;min-height:0;overflow-y:auto;overflow-x:hidden;overscroll-behavior:contain;-webkit-overflow-scrolling:touch;box-sizing:border-box;
padding:0 14px calc(16px + env(safe-area-inset-bottom));display:flex;flex-direction:column;gap:var(--nv-s6)}
.pop.inline .cell.empty{min-height:72px;border:2px dashed var(--nv-box-border);border-radius:var(--nv-r-lg);display:flex;align-items:center;justify-content:center;font-size:var(--nv-fs-5);opacity:.7}
.pop.inline .cell.empty::after{content:'Leerer Platz'}
@media(max-width:600px){
.pop{align-items:flex-end}
.bd .bn{display:none}.bd .bv::before{content:none!important}.bd{padding:5px var(--nv-s4)}
.sh{width:100%;height:88vh;max-height:none;border-radius:var(--nv-popup-r) var(--nv-popup-r) 0 0;border-bottom:none;opacity:1;transform:translateY(100%)}
.grip{display:flex}.hd{margin:var(--nv-s4) var(--nv-s6) var(--nv-s5)}.info{padding:0 var(--nv-s6) var(--nv-s5)}.hd .info{padding:0}
.hd .chip{padding:0 var(--nv-s5)}.hd .chip .ci:not(:empty)~.cn{display:none}.hd .chip .ci:not(:empty)~.cv::before{content:none}
.body{padding:0 12px calc(88px + env(safe-area-inset-bottom))}}
.pop.inline{position:static;display:block}.pop.inline .ov,.pop.inline .grip{display:none}
.pop.inline .sh{width:auto;height:auto;max-height:none;opacity:1;transform:none;border-radius:var(--nv-popup-r);box-shadow:none;border-bottom:1px solid var(--nv-border)}
.pop.inline .body{overflow:visible;padding-bottom:var(--nv-s7)}
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
        ...DEF3,
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
      marquee(r.querySelector(".tt"), c.title || "", inPicker(this));
      const hi = r.querySelector(".hi");
      if (c.icon) setIcon(hi, c.icon);
      else {
        hi.innerHTML = "";
        hi._ic = null;
      }
      r.querySelector(".ph .t").textContent = c.title || (c.hash ? `#${c.hash}` : "Kein Hash eingestellt");
      r.querySelector(".ph ha-icon").setAttribute("icon", c.icon || "mdi:card-multiple-outline");
      this._sh.style.setProperty("--pw", `${+c.width || DEF3.width}px`);
      const tint = c.tint || c.color;
      this._sh.classList.toggle("tint", !!tint);
      if (tint) this._sh.style.setProperty("--tc", roleVars(tint).c);
      if (c.title || c.hash) this._sh.setAttribute("aria-label", c.title || c.hash);
      else this._sh.removeAttribute("aria-label");
      const inHead = (c.info_position || DEF3.info_position) !== "below", x = r.querySelector(".hd .x");
      if (inHead && this._infoEl.parentNode !== x.parentNode) x.before(this._infoEl);
      else if (!inHead && this._infoEl.parentNode === x.parentNode) r.querySelector(".hd").after(this._infoEl);
      this._infoEl.classList.toggle("scroll", !inHead && c.info_layout === "scroll");
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
  var HEAD = (c) => [
    sel("info_position", [["header", "In der Kopfzeile"], ["below", "Eigene Zeile darunter"]]),
    ...(c.info_position || DEF3.info_position) === "below" ? [sel("info_layout", [["wrap", "Umbrechen"], ["scroll", "Waagrecht scrollen"]])] : []
  ];
  var LABELS7 = {
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
    info_position: "Info-Chips anzeigen",
    entity: "Entität",
    name: "Eigener Name (optional)",
    decimals: "Nachkommastellen",
    alert: "Bei Achtung hervorheben",
    alert_state: "Achtung bei Zustand",
    alert_color: "Farbe",
    alert_above: "Achtung über",
    alert_below: "Achtung unter"
  };
  var HELPERS6 = {
    ...GRID_HELPERS,
    hash: "Öffnet das Pop-up, wenn die Adresse auf #… endet. Beispiel: wohnzimmer → Navigations-Aktion auf #wohnzimmer.",
    info_position: "In der Kopfzeile: rechts vor dem X, bei wenig Platz waagrecht scrollbar. Darunter: eigene Zeile wie früher.",
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
      b.append(this._hint("Titel und Icon stehen unter „Allgemein“. Badges und Info-Chips sitzen in der Kopfzeile (oder die Info-Chips als eigene Zeile darunter). Antippen öffnet die Details."));
      const head = HEAD(this._config);
      b.append(this._form(head, { info_layout: DEF3.info_layout, info_position: DEF3.info_position, ...this._config }, (v) => {
        const c = merge(this._config, names(head), v);
        if (c.info_layout === DEF3.info_layout) delete c.info_layout;
        if (c.info_position === DEF3.info_position) delete c.info_position;
        const re = (c.info_position || DEF3.info_position) !== (this._config.info_position || DEF3.info_position);
        this._emit(c);
        if (re) this._rebuild();
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
  __publicField(NovaPopupCardEditor, "labels", LABELS7);
  __publicField(NovaPopupCardEditor, "helpers", HELPERS6);
  define("popup-card-editor", NovaPopupCardEditor);

  // src/area.js
  var DEF4 = { stack_below: 500, chips_layout: "wrap" };
  var ACSS = `${CARD_CSS}${GRID_CSS}${NOVA_CHIPS_CSS}${MARQUEE_CSS}
:host{height:auto}
:host::before{background:var(--nv-area-bg)}
:host(.tint)::before{background:linear-gradient(160deg,color-mix(in srgb,var(--tc) 45%,transparent),transparent 75%),var(--nv-area-bg)}
.g{height:auto;display:flex;flex-direction:column;gap:var(--nv-s6);padding:var(--nv-s7)}
.hd{display:flex;align-items:center;gap:var(--nv-s5);padding:var(--nv-s3);border-radius:var(--nv-r-pill);background:var(--nv-chip)}
.hd.nb{padding-left:var(--nv-s7)}
.hi{display:flex}.hi:empty{display:none}
.tt{flex:1 1 auto;min-width:min(35%,110px);font-weight:var(--nv-fw-bold);font-size:var(--nv-fs-9)}
.x{width:36px;height:36px;border-radius:50%;border:none;flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);color:inherit;cursor:pointer;padding:0}
.x:active{transform:scale(var(--nv-press))}
.x:focus-visible{outline:none;box-shadow:var(--nv-focus)}
.x[hidden]{display:none}
.hd .nchips{flex:0 1 auto;justify-content:flex-end}
.hd .nchip{min-height:36px}
.body{display:flex;flex-direction:column;gap:var(--nv-s6)}
/* Ohne Karten nur die Kopfzeile (z. B. als Titelleiste mit Zurück); im Editor bleibt der Hinweis sichtbar */
.g:not(.prev) .body:has(>.hint:only-child){display:none}
.cell>*{min-width:0}
.prev .cell.empty{min-height:72px;border:2px dashed var(--nv-box-border);border-radius:var(--nv-r-lg);display:flex;align-items:center;justify-content:center;font-size:var(--nv-fs-5);opacity:.7}
.prev .cell.empty::after{content:'Leerer Platz'}
@media(max-width:600px){.g{padding:var(--nv-s6)}.hd .nchip .ci:not(:empty)~.cn{display:none}.hd .nchip .ci:not(:empty)~.cv::before{content:none}}`;
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
  var S_GEN2 = (icon2) => [
    { name: "area", selector: { area: {} } },
    g2({ name: "name", selector: T }, { name: "icon", selector: { icon: icon2 ? { placeholder: icon2 } : {} } }),
    { name: "back_action", selector: A },
    g2(ROLE("tint"), { name: "stack_below", selector: { number: { min: 0, max: 1200, step: 10, mode: "box", unit_of_measurement: "px" } } })
  ];
  var S_CHIPS = [sel("chips_layout", [["wrap", "Umbrechen"], ["scroll", "Waagrecht scrollen"]])];
  var LABELS8 = {
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
  var HELPERS7 = {
    ...CHIP_HELPERS,
    ...GRID_HELPERS,
    back_action: "Ohne Angabe geht es eine Seite zurück. „Keine Aktion“ blendet den Knopf aus.",
    stack_below: "Ist die Karte schmaler als dieser Wert, stehen alle Karten untereinander (0 = nie)."
  };
  var strip = (c) => {
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
      const form = (sch) => this._form(sch, data, (v) => this._emit(strip(merge(this._config, names(sch), v))));
      r.querySelector(".wrap").append(
        this._section("general", "mdi:cog-outline", "Allgemein", (b) => {
          const sch = S_GEN2(h?.areas?.[c.area]?.icon);
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
  __publicField(NovaAreaCardEditor, "labels", LABELS8);
  __publicField(NovaAreaCardEditor, "helpers", HELPERS7);
  __publicField(NovaAreaCardEditor, "openSections", ["general"]);
  define("area-card-editor", NovaAreaCardEditor);
})();
