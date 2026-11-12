// Farben & Maße: alle Design-Tokens stehen in theme.js und werden hier nur weitergereicht
import {NOVA_VARS, NAVI_VARS} from './theme.js';
export {NOVA_VARS, NAVI_VARS};

// Farbrollen: Karten wählen nur eine Rolle, die Farbe selbst kommt aus den Variablen oben (Theme-fähig)
export const ROLES = {neutral: 'neutral', 'accent-1': 'a1', 'accent-2': 'a2', 'accent-3': 'a3', 'accent-4': 'a4'};
// Rolle → {c, fg, dev} als CSS-Variablen (dev = Farbe in Gerätezeichnungen); unbekannt/leer = neutral
export const roleVars = r => { const k = ROLES[r] || ROLES.neutral; return {c: `var(--nv-${k})`, fg: `var(--nv-${k}-fg)`, dev: `var(--nv-${k}-dev)`}; };

// Glas: Unschärfe und Hintergrund liegen auf einer eigenen, leeren Ebene (:host::before) hinter dem Kartenkasten .g.
// So muss Safari/WebKit die Unschärfe nicht bei jeder Animation im Inhalt neu rechnen. Der Kasten selbst darf weder
// opacity < 1, filter, transform, will-change noch isolation bekommen, sonst sieht ::before das Dashboard nicht mehr.
// Karten ohne Glas (z. B. Info im Box-Stil) setzen die Klasse nv-flat auf ihr Element, ausgegraute Karten (.g.na) zusätzlich nv-na.
const GLASS = `:host{position:relative}
:host::before{content:'';position:absolute;inset:0;border-radius:var(--nv-radius);background:var(--nv-bg);pointer-events:none;
backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat));-webkit-backdrop-filter:blur(var(--nv-blur)) saturate(var(--nv-sat))}
:host(.nv-flat)::before{display:none}
:host(.nv-na)::before{opacity:.4}`;

// Glas-Hintergrund für Raum, Thermostat, Licht
export const CARD_CSS = `${NOVA_VARS}
:host{display:block;height:100%}
${GLASS}
.g{height:100%;box-sizing:border-box;border-radius:var(--nv-radius);
border:1px solid var(--nv-border);box-shadow:var(--nv-shadow),var(--nv-edge);
color:var(--nv-fg);overflow:hidden;position:relative;font-family:var(--nv-font)}
ha-icon{--mdc-icon-size:var(--nv-icon-lg);display:flex}`;

// Gemeinsame Bausteine von Modular, Kamera, Media und Saugroboter
export const PANEL_CSS = `
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

// Editoren
export const EDITOR_CSS = `
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
export const EDITOR_ICON_CSS = `ha-icon{display:flex}`;
export const MAPROW_CSS = `.maprow{display:flex;gap:6px;align-items:center}.maprow ha-form{flex:1}`;
export const EDITOR_LIST_CSS = `
.adds{display:flex;flex-wrap:wrap;gap:8px}
details.item details.item>summary{background:none}
h4{margin:4px 0 0;font-size:13px;font-weight:600;opacity:.8}`;

// Editor-Stil des Pop-up-Editors: aufklappbare Bereiche (_section), Listen, Zwischenüberschriften – Grundlage aller Editoren
export const SECTION_EDITOR_CSS = `${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}`;

// Eingabefelder in Karten (Einkauf, Notiz): Glas-Feld, Fokus in Nova-Blau
export const FIELD_CSS = `
.fld{box-sizing:border-box;width:100%;min-width:0;margin:0;border:1px solid var(--nv-box-border);background:var(--nv-box);color:var(--nv-fg);
font:inherit;font-size:var(--nv-fs-10);outline:none;-webkit-appearance:none;appearance:none;transition:border-color var(--nv-d2),box-shadow var(--nv-d2),background-color var(--nv-d2)}
.fld::placeholder{color:var(--nv-fg);opacity:.45}
.fld:focus{border-color:color-mix(in srgb,var(--nv-active) 75%,transparent);box-shadow:0 0 0 3px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 22%,transparent) var(--nv-glow),transparent);background:color-mix(in srgb,var(--nv-box) 70%,rgba(var(--nv-tint),.06))}`;
