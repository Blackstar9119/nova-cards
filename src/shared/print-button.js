// Druck-Knopf für Einkauf und Notiz: ruft ein Skript auf (z. B. für einen Bondrucker) und zeigt kurz, ob es geklappt hat.
// Das Skript wird als Dienst script.<name> aufgerufen – so wartet der Aufruf, bis das Skript fertig ist, und ein Fehler
// (Drucker aus, Papier leer …) kommt als Fehler zurück. Konfig: print_script, print_label, print_icon, print_style (round | pill).
import {g2, T, I, sel} from './editor-schema.js';

// Erfolg in der Grün-Rolle (Theme: --nova-success-color, sonst --nova-accent-4)
export const PRINT_CSS = `
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

export const PRINT_DEF = {print_icon: 'mdi:printer-pos', print_label: 'Drucken', print_style: 'pill'};
const FEEDBACK = 2500;

// Knopf anlegen; Inhalt und Zustand setzt printPaint()
export function printButton(onTap) {
  const b = document.createElement('button');
  b.type = 'button'; b.className = 'pb';
  b.innerHTML = '<ha-icon></ha-icon><span class="pl"></span>';
  b.addEventListener('click', e => { e.stopPropagation(); onTap(); });
  return b;
}

// Aussehen nach Konfig und Zustand (idle | busy | ok | err); enabled = es gibt etwas zu drucken
export function printPaint(b, c, state, enabled) {
  const pill = c.print_style !== 'round';
  const icon = {busy: 'mdi:loading', ok: 'mdi:check-bold', err: 'mdi:alert-circle-outline'}[state] || c.print_icon || PRINT_DEF.print_icon;
  const label = {busy: 'Druckt …', ok: 'Gedruckt', err: 'Fehler'}[state] || c.print_label || PRINT_DEF.print_label;
  b.className = `pb${pill ? ' pill' : ''}${state && state !== 'idle' ? ` ${state}` : ''}`;
  b.disabled = state === 'idle' && !enabled;
  const ic = b.firstChild;
  if (ic.getAttribute('icon') !== icon) ic.setAttribute('icon', icon);
  b.lastChild.textContent = pill ? label : '';
  b.title = label; b.setAttribute('aria-label', label);
}

// Skript ausführen und Zustand melden: set(state) wird mit busy, dann ok/err und nach kurzer Zeit idle aufgerufen.
// Liefert true bei Erfolg.
export async function runPrint(card, hass, script, data, set) {
  const name = String(script || '').replace(/^script\./, '');
  if (!name || !hass) return false;
  clearTimeout(card._pbT);
  set('busy');
  let ok = true;
  try { await hass.callService('script', name, data || {}); }
  catch (e) { ok = false; console.warn('[nova-cards] Drucken fehlgeschlagen', script, e); }
  set(ok ? 'ok' : 'err');
  card._pbT = setTimeout(() => set('idle'), FEEDBACK);
  return ok;
}

/* ---------- Editor ---------- */
export const printSchema = extra => [
  {name: 'print_script', selector: {entity: {domain: 'script'}}},
  ...(extra || []),
  g2({name: 'print_label', selector: T}, {name: 'print_icon', selector: I}),
  sel('print_style', [['pill', 'Länglich mit Text'], ['round', 'Klein und rund']]),
];
export const PRINT_LABELS = {print_script: 'Druck-Skript', print_label: 'Beschriftung', print_icon: 'Icon', print_style: 'Form des Knopfs'};
export const PRINT_HELPERS = {print_script: 'Leer = kein Druck-Knopf. Das Skript wird aufgerufen und die Karte wartet, bis es fertig ist.'};
