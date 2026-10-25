// Raster aus beliebigen Karten (Zeilen × Spalten) und Info-Chips – gemeinsam für Pop-up Card und Bereich Card.
import {esc, setIcon} from './utils.js';
import {iconOf, nameOf, valueOf, alertHit} from './state.js';
import {moreInfo} from './actions.js';
import {roleVars} from './styles.js';

/* ---------- Datenmodell ----------
   rows: [{cells: [{width: '1/2', card: {...}}, {card: null}]}]
   Jede Zeile ist eine Reihe von Spalten nebeneinander, jede Spalte enthält genau eine Karte (null = leerer Platz).
   width = Anteil an der Zeilenbreite (1/4 … voll), ohne Angabe teilen sich die Spalten den restlichen Platz. */
export const WIDTHS = [['auto', 'Auto'], ['1/4', '1/4'], ['1/3', '1/3'], ['1/2', '1/2'], ['2/3', '2/3'], ['3/4', '3/4'], ['1', 'Voll']];
export const FR = {'1/4': 1 / 4, '1/3': 1 / 3, '1/2': 1 / 2, '2/3': 2 / 3, '3/4': 3 / 4, '1': 1};
// Ältere Konfigurationen mit span/columns: nächstliegenden Anteil nehmen
const fracOf = v => Object.keys(FR).reduce((a, k) => Math.abs(FR[k] - v) < Math.abs(FR[a] - v) ? k : a, '1');
const toCell = (x, cols) => {
  if (!x || typeof x !== 'object') return {width: 'auto', card: null};
  if (!('card' in x || 'span' in x || 'width' in x)) return {width: 'auto', card: x};
  const old = +x.span > 1 ? fracOf(+x.span / cols) : 'auto';
  const width = FR[x.width] ? String(x.width) : old === '1' ? 'auto' : old;
  return {width, card: x.card && typeof x.card === 'object' ? x.card : null};
};
export const normRows = c => {
  const cols = Math.max(1, +c.columns || 2);
  if (Array.isArray(c.rows)) return c.rows.map(r => ({cells: (Array.isArray(r) ? r : r?.cells || []).map(x => toCell(x, cols))})).filter(r => r.cells.length);
  if (Array.isArray(c.cards)) return c.cards.map(k => ({cells: [{width: 'auto', card: k}]}));
  return [];
};
export const serRows = rows => rows.filter(r => r.cells.length).map(r => ({cells: r.cells.map(x => FR[x.width] ? {width: x.width, card: x.card ?? null} : {card: x.card ?? null})}));
// Spaltenbreite als flex-Angabe (gap = Abstand zwischen den Spalten in px)
export const flexOf = (w, gap) => FR[w] ? `0 0 calc(${FR[w]} * (100% + ${gap}px) - ${gap + 0.1}px)` : '1 1 0';

// HA-INTERN: window.loadCardHelpers() → createCardElement. Fehlt es, zeigt jede Zelle einen Fehler statt zu crashen.
let helpersP;
export const helpers = () => helpersP ||= Promise.resolve()
  .then(() => { if (typeof window.loadCardHelpers !== 'function') throw new Error('loadCardHelpers nicht verfügbar'); return window.loadCardHelpers(); })
  .catch(e => { helpersP = null; throw e; });

// HA-INTERN: Elementnamen der HA-Oberfläche, nur zum Erkennen der Editor-Vorschau bzw. des Bearbeitungsmodus –
// fehlen sie, gilt die Karte als normal eingebunden
export const PREV = new Set(['HUI-CARD-PREVIEW', 'HUI-DIALOG-EDIT-CARD', 'HUI-DIALOG-CREATE-CARD', 'HUI-CARD-ELEMENT-EDITOR', 'HUI-CARD-PICKER']);
export const EDIT = new Set(['HUI-CARD-OPTIONS', 'HUI-CARD-EDIT-MODE']);

// Vorschau im Karteneditor: HA erzeugt die Karte bei jeder Änderung neu. Die fertigen Zellen der alten Karte
// wandern kurz hierher und werden von der neuen übernommen, statt jede eingebettete Karte neu zu erzeugen.
// kind trennt die Kartentypen (Pop-up, Bereich).
const HANDOFF = new Map();
let handoffT;
export const handOff = (kind, pool) => {
  pool.forEach((ws, k) => { const key = `${kind}|${k}`; (HANDOFF.get(key) || HANDOFF.set(key, []).get(key)).push(...ws); });
  clearTimeout(handoffT);
  handoffT = setTimeout(() => HANDOFF.clear(), 3000);
};
const takeOver = (kind, k) => HANDOFF.get(`${kind}|${k}`)?.shift();

// Raster und Chips in der Karte
export const GRID_CSS = `
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
export const CHIP_CSS = `
.info{display:flex;flex-wrap:wrap;gap:7px;flex:none}
.info.scroll{flex-wrap:nowrap;overflow-x:auto;scrollbar-width:none;-webkit-overflow-scrolling:touch}.info.scroll::-webkit-scrollbar{display:none}
.info[hidden]{display:none}
.chip{display:inline-flex;align-items:center;gap:6px;padding:7px 12px;border-radius:999px;background:var(--nv-chip);border:1px solid var(--nv-box-border);font-size:12.5px;white-space:nowrap;cursor:pointer;flex:none;outline:none;transition:background-color .2s,color .2s,border-color .2s,box-shadow .2s,transform .2s,opacity .2s}
.chip ha-icon{--mdc-icon-size:16px}.chip img{width:16px;height:16px}.chip:focus-visible{box-shadow:0 0 0 2px var(--nv-active)}.chip:active{transform:scale(.95)}
.chip .cn:empty{display:none}.chip .cn:not(:empty)::after{content:' ·'}
.chip.al{background:var(--c);color:var(--cf);border-color:transparent;box-shadow:0 0 14px color-mix(in srgb,var(--c) 45%,transparent)}`;

// Info-Chips in bar: Icon, optional Name, Wert; Antippen öffnet die Details, Hervorheben bei Achtung mit Farbrolle.
// Die Chips werden nur neu angelegt, wenn sich die Einträge ändern.
export function renderChips(card, bar, items, h) {
  bar.hidden = !items.length;
  const key = JSON.stringify(items);
  if (bar._key !== key) {
    bar._key = key;
    bar.innerHTML = '';
    bar._chips = items.map(o => {
      const d = document.createElement('div');
      d.className = 'chip'; d.tabIndex = 0; d.setAttribute('role', 'button');
      d.innerHTML = '<span class="ci"></span><span class="cn"></span><span class="cv"></span>';
      const open = () => o.entity && moreInfo(card, o.entity);
      d.addEventListener('click', open);
      d.addEventListener('keydown', e => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); open(); } });
      bar.appendChild(d);
      return d;
    });
  }
  items.forEach((o, i) => {
    const d = bar._chips[i], s = h.states[o.entity];
    setIcon(d.querySelector('.ci'), iconOf(h, o, 'mdi:information-outline'));
    d.querySelector('.cn').textContent = o.name || '';
    d.querySelector('.cv').textContent = s ? valueOf(h, s, o) : 'Nicht gefunden';
    d.title = nameOf(h, o);
    const al = !!o.alert && alertHit({state: o.alert_state, above: o.alert_above, below: o.alert_below}, s);
    d.classList.toggle('al', al);
    if (al) { const v = roleVars(o.alert_color || 'accent-2'); d.style.setProperty('--c', v.c); d.style.setProperty('--cf', v.fg); }
  });
}

// Raster-Teil einer Karte. Die Karte stellt bereit: _body (Container), _rows (normRows), _h, _cfg.stack_below, _cfg.equal_height,
// static gridKind (für die Übergabe in der Vorschau) und _handoff() (true = Zellen einer Vorgängerin übernehmen).
export const GridCard = Base => class extends Base {
  _cells() { return [...this._body.querySelectorAll(':scope>.rw>.cell>*')].filter(el => !el.classList.contains('err')); }
  _setHass(el) { if (!this._h) return; try { el.hass = this._h; } catch (e) { console.warn('[nova-cards] Karte im Raster:', e); } }
  _stack() { this._body.classList.toggle('stack', this._body.clientWidth > 0 && this._body.clientWidth < (+this._cfg?.stack_below || 0)); }
  // Zellen an die Nachfolgerin weitergeben (aus disconnectedCallback)
  _handOffCells() { if (this._pool) { handOff(this.constructor.gridKind, this._pool); this._pool = null; this._dirty = true; } }
  _grid() {
    this._dirty = false;
    // Zellen mit unveränderter Karte weiterverwenden – die Vorschau flackert dann nicht bei jeder Eingabe
    const old = this._pool || new Map(), pool = new Map(), list = [], kind = this.constructor.gridKind;
    this._rows.forEach(row => { const rw = document.createElement('div'); rw.className = 'rw'; list.push(rw); row.cells.forEach(cell => {
      const key = JSON.stringify(cell.card);
      let w = old.get(key)?.shift() || (this._handoff() ? takeOver(kind, key) : null);
      if (!w) {
        w = document.createElement('div');
        w.className = 'cell';
        w._card = cell.card;
        w._owner = this;
        if (cell.card) { this._mount(w, cell.card); w.addEventListener('ll-rebuild', e => { e.stopPropagation(); w._owner._mount(w, w._card); }); }
        else w.classList.add('empty');
      } else if (w._owner !== this) { w._owner = this; w.querySelectorAll(':scope>*').forEach(el => this._setHass(el)); }
      w.style.flex = flexOf(cell.width, 12);
      w.classList.toggle('auto', !FR[cell.width]);
      (pool.get(key) || pool.set(key, []).get(key)).push(w);
      rw.append(w);
    }); });
    this._pool = pool;
    if (!list.length) {
      const p = document.createElement('div');
      p.className = 'hint';
      p.textContent = 'Noch keine Karten – im Editor eine Vorlage wählen und Karten einfügen.';
      list.push(p);
    }
    this._body.replaceChildren(...list);
    // Gleiche Höhe pro Reihe nur auf Wunsch – sonst wird z. B. eine kurze Karte neben einer hohen leer gestreckt
    this._body.classList.toggle('eqh', !!this._cfg?.equal_height);
    this._stack();
  }
  // Fehler einer Karte bleiben in ihrer Zelle
  async _mount(w, cfg) {
    const id = w._id = (w._id || 0) + 1;
    let el;
    try {
      if (!cfg.type) throw new Error('Kartentyp (type) fehlt');
      el = (await helpers()).createCardElement(cfg);
    } catch (e) {
      el = document.createElement('div');
      el.className = 'err';
      el.innerHTML = `<ha-icon icon="mdi:alert-circle-outline"></ha-icon><span>Karte konnte nicht geladen werden: ${esc(e?.message || e)}</span>`;
    }
    if (id !== w._id) return;
    this._setHass(el);
    w.replaceChildren(el);
  }
};
