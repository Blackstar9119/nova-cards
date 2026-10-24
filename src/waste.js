import {define, docUrl} from './shared/define.js';
import {dom, esc, list, setIcon} from './shared/utils.js';
import {moreInfo} from './shared/actions.js';
import {press} from './shared/long-press.js';
import {NOVA_VARS, PANEL_CSS, EDITOR_CSS, EDITOR_ICON_CSS, EDITOR_LIST_CSS} from './shared/styles.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, I, sel, BASE_LABELS} from './shared/editor-schema.js';

/* ---------- Nova Müllkalender Card ---------- */
const WCSS = `
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

const WDEF = {title: 'Müllkalender', icon: 'mdi:trash-can-outline', layout: 'list', count: 5, days: 30, refresh: 60, hide_unmatched: false, show_header: true, glow: true};
// Vorschlag für neue Karten und den Editor-Button „Standard-Müllarten“ – danach frei änderbar
const WTYPES = [
  {match: 'Rest', name: 'Restmüll', icon: 'mdi:trash-can', color: 'grey'},
  {match: 'Papier, PPK', name: 'Papiertonne', icon: 'mdi:newspaper-variant-outline', color: 'blue'},
  {match: 'Gelb, Wertstoff, Verpackung', name: 'Gelber Sack', icon: 'mdi:recycle', color: 'yellow'},
  {match: 'Bio', name: 'Biotonne', icon: 'mdi:leaf', color: 'brown'},
  {match: 'Glas', name: 'Altglas', icon: 'mdi:bottle-wine-outline', color: 'green'},
];

const DAY = 864e5;
const ISO_DAY = /^\d{4}-\d{2}-\d{2}$/;
// Kalendertag als fortlaufende Zahl (unabhängig von Zeitzone und Sommerzeit)
const dayNum = s => Date.UTC(+s.slice(0, 4), +s.slice(5, 7) - 1, +s.slice(8, 10)) / DAY;
// Zeitzone wie im HA-Profil eingestellt: „Server“ = Zeitzone von HA, sonst die des Browsers
const tzOf = h => h.locale?.time_zone === 'server' ? h.config?.time_zone : undefined;
function ymdIn(d, tz) {
  try {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(d).map(x => [x.type, x.value]));
    return `${p.year}-${p.month}-${p.day}`;
  } catch { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
}
const langOf = h => h.locale?.language || h.language || 'de';
const calsOf = c => list(c.entities ?? c.entity).filter(id => dom(id) === 'calendar');

// Termin aus der Kalender-API: ganztägig = {date}, mit Uhrzeit = {dateTime}. Ende ganztägig ist exklusiv
function parseEvent(ev, cal, tz) {
  const raw = x => typeof x === 'string' ? x : x?.date || x?.dateTime;
  const s = raw(ev?.start), e = raw(ev?.end);
  if (!s) return null;
  const summary = String(ev.summary ?? '').trim();
  if (ISO_DAY.test(s)) {
    const sd = dayNum(s), ed = e && ISO_DAY.test(e) ? dayNum(e) : sd + 1;
    return {cal, summary, sd, ld: Math.max(sd, ed - 1), t: null};
  }
  const st = new Date(s);
  if (isNaN(st)) return null;
  const et = e ? new Date(e) : st, sd = dayNum(ymdIn(st, tz));
  // Ende genau um Mitternacht zählt nicht mehr zum Folgetag
  const ld = isNaN(et) || et <= st ? sd : dayNum(ymdIn(new Date(et - 1), tz));
  return {cal, summary, sd, ld: Math.max(sd, ld), t: +st};
}

// Erste passende Regel: Stichwort (mehrere mit Komma) im Termintitel, Groß/Klein egal
const ruleOf = (types, summary) => {
  const s = summary.toLowerCase();
  return types.find(r => list(r.match).some(k => s.includes(k.toLowerCase())));
};
// Farbe: Hex/rgb/hsl/var direkt, [r,g,b] aus dem Farbwähler, sonst HA-Farbname (blue → --blue-color)
const colorOf = v => {
  if (Array.isArray(v) && v.length >= 3) return `rgb(${v.slice(0, 3).map(Number).join(',')})`;
  if (!v || typeof v !== 'string') return '';
  return /^(#|rgb|hsl|var\(|color-mix)/i.test(v) ? v : `var(--${v}-color,${v})`;
};

class NovaWasteCard extends HTMLElement {
  static getConfigElement() { return document.createElement('nova-waste-card-editor'); }
  static getStubConfig(h) {
    const cal = Object.keys(h.states).find(id => id.startsWith('calendar.'));
    return {...(cal ? {entities: [cal]} : {}), types: WTYPES.map(t => ({...t}))};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    const n = (v, d, min, max) => Number.isFinite(+v) && v !== '' && v != null ? Math.min(max, Math.max(min, Math.round(+v))) : d;
    this._c = {...WDEF, ...c,
      count: n(c.count, WDEF.count, 1, 50), days: n(c.days, WDEF.days, 1, 366), refresh: n(c.refresh, WDEF.refresh, 5, 1440),
      types: [].concat(c.types || []).filter(t => t && typeof t === 'object' && list(t.match).length)};
    this._cals = calsOf(c);
    this._events = null; this._err = null; this._failed = []; this._key = null;
    this._fetched = false;
    if (this._h) { this._build(); this._load(); }
  }
  set hass(h) {
    this._h = h;
    if (!this._c) return;
    if (!this._e) this._build();
    if (!this._fetched) this._load();
    else this._render();
  }
  getCardSize() { return this._c?.layout === 'compact' ? 1 : 1 + (this._c?.count || 5); }
  getGridOptions() { return {columns: 6, rows: 'auto', min_columns: 3}; }
  connectedCallback() {
    clearInterval(this._tm);
    // Jede Minute: Tageswechsel (heute/morgen) und Aktualisierungsintervall prüfen
    this._tm = setInterval(() => this._tick(), 60000);
    if (this._e) this._tick();
  }
  disconnectedCallback() { clearInterval(this._tm); this._tm = null; }
  _today() { return dayNum(ymdIn(new Date(), tzOf(this._h))); }
  _tick() {
    if (!this._h || !this._c) return;
    const stale = Date.now() - (this._last || 0) >= this._c.refresh * 60000;
    const appeared = this._cals.some(id => this._h.states[id] && !this._asked?.includes(id));
    if (this._fetched && (stale || appeared || this._today() !== this._fday)) this._load();
    else this._render();
  }
  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${PANEL_CSS}${WCSS}</style><div class="g ws">
<div class="hd"><div class="ic"></div><div class="nm"><b></b><small></small></div></div>
<div class="body"></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {g: q('.g'), hd: q('.hd'), ic: q('.hd .ic'), name: q('.hd b'), sub: q('.hd small'), body: q('.body')};
    this._key = null;
  }
  // Termine aller Kalender über die offizielle REST-API holen (GET /api/calendars/<id>?start=&end=)
  async _load() {
    const h = this._h, c = this._c;
    if (!h || !c) return;
    this._fetched = true;
    const id = this._fid = (this._fid || 0) + 1, tz = tzOf(h);
    this._last = Date.now(); this._fday = this._today();
    const cals = this._asked = this._cals.filter(x => h.states[x]);
    if (!cals.length) { this._events = []; this._failed = []; this._err = null; this._render(); return; }
    // Etwas Puffer vorne, damit laufende mehrtägige Termine mitkommen; gefiltert wird nach Kalendertag
    const start = new Date(Date.now() - 2 * DAY).toISOString(), end = new Date(Date.now() + (c.days + 2) * DAY).toISOString();
    const qs = `?start=${encodeURIComponent(start)}&end=${encodeURIComponent(end)}`;
    const res = await Promise.allSettled(cals.map(cal => h.callApi('GET', `calendars/${cal}${qs}`)));
    if (id !== this._fid) return;
    const ok = [], failed = [];
    res.forEach((x, i) => {
      if (x.status === 'fulfilled' && Array.isArray(x.value)) ok.push(...x.value.map(ev => parseEvent(ev, cals[i], tz)).filter(Boolean));
      else { failed.push(cals[i]); console.warn('[nova-cards] Müllkalender: Termine nicht geladen', cals[i], x.reason); }
    });
    this._failed = failed;
    // Alles fehlgeschlagen: alte Termine behalten (falls vorhanden) und Fehler zeigen
    if (failed.length === cals.length) this._err = res[0].reason?.body?.message || res[0].reason?.message || 'Verbindung fehlgeschlagen';
    else { this._err = null; this._events = ok; }
    this._render();
  }
  // Anzeigbare Abholungen ab heute im eingestellten Zeitraum
  _items(today) {
    const c = this._c, seen = new Set(), out = [];
    for (const ev of this._events || []) {
      if (ev.ld < today || ev.sd > today + c.days) continue;
      const day = Math.max(ev.sd, today), rule = ruleOf(c.types, ev.summary);
      if (!rule && c.hide_unmatched) continue;
      const name = rule?.name || ev.summary || 'Abholung';
      // Gleiche Müllart am gleichen Tag (z. B. aus zwei Kalendern) nur einmal
      const k = `${day}|${name.toLowerCase()}`;
      if (seen.has(k)) continue;
      seen.add(k);
      out.push({day, d: day - today, name, icon: rule?.icon || c.icon, color: colorOf(rule?.color), t: ev.sd === day ? ev.t : null, cal: ev.cal});
    }
    return out.sort((a, b) => a.day - b.day || (a.t ?? -1) - (b.t ?? -1) || a.name.localeCompare(b.name));
  }
  _rel(d) { return d === 0 ? 'heute' : d === 1 ? 'morgen' : `in ${d} Tagen`; }
  _date(it) {
    const lang = langOf(this._h);
    let s;
    try { s = new Intl.DateTimeFormat(lang, {weekday: 'short', day: '2-digit', month: '2-digit', timeZone: 'UTC'}).format(new Date(it.day * DAY)); } catch { s = new Date(it.day * DAY).toISOString().slice(0, 10); }
    if (it.t != null) try { s += ' · ' + new Intl.DateTimeFormat(lang, {hour: '2-digit', minute: '2-digit', timeZone: tzOf(this._h)}).format(new Date(it.t)); } catch { /* ohne Uhrzeit */ }
    return s;
  }
  _render() {
    const h = this._h, c = this._c, e = this._e;
    if (!h || !e) return;
    const today = this._today(), found = this._cals.filter(id => h.states[id]);
    let msg = null, items = [];
    if (!this._cals.length) msg = ['info', 'mdi:calendar-alert', 'Kein Kalender gewählt – im Editor einen Kalender (calendar.*) auswählen.'];
    else if (!found.length) msg = ['error', 'mdi:calendar-remove', `Kalender nicht gefunden: ${this._cals.join(', ')}`];
    else if (this._err && !this._events) msg = ['error', 'mdi:alert-circle-outline', `Termine konnten nicht geladen werden: ${this._err}`];
    else if (!this._events) msg = ['', 'mdi:timer-sand', 'Termine werden geladen …'];
    else {
      items = this._items(today);
      if (!items.length) msg = ['', 'mdi:calendar-check-outline', c.hide_unmatched && this._events.length ? `Keine passenden Abholungen in den nächsten ${c.days} Tagen` : `Keine Abholungen in den nächsten ${c.days} Tagen`];
    }
    const compact = c.layout === 'compact';
    const shown = compact ? items.filter(it => it.day === items[0]?.day) : items.slice(0, c.count);
    const warn = [...this._cals.filter(id => !h.states[id]), ...this._failed].filter((x, i, a) => a.indexOf(x) === i);
    const key = JSON.stringify([msg, shown, warn, this._err && !!this._events, langOf(h), tzOf(h)]);
    if (key === this._key) return;
    this._key = key;

    const next = shown[0], due = next && next.d <= 1 ? next.color || 'var(--nv-accent)' : '';
    e.g.classList.toggle('due', !!due && c.glow !== false);
    e.g.style.setProperty('--due', due || 'transparent');
    e.hd.hidden = compact || c.show_header === false;
    e.hd.classList.toggle('due', !!due);
    setIcon(e.ic, c.icon);
    e.name.textContent = c.title;
    e.sub.textContent = next ? `Nächste Abholung ${this._rel(next.d)}` : '';
    e.sub.hidden = !next;

    const body = [];
    if (msg) {
      const m = document.createElement('div');
      m.className = msg[0] ? `al ${msg[0]}` : 'msg';
      m.innerHTML = `<ha-icon icon="${esc(msg[1])}"></ha-icon><span></span>`;
      m.lastChild.textContent = msg[2];
      body.push(m);
    } else if (compact) body.push(this._compact(shown));
    else {
      const rows = document.createElement('div');
      rows.className = 'rows';
      rows.append(...shown.map(it => this._row(it)));
      body.push(rows);
    }
    if (!msg && (warn.length || this._err)) {
      const m = document.createElement('div');
      m.className = 'als chips';
      m.innerHTML = '<div class="al error"><ha-icon icon="mdi:alert-circle-outline"></ha-icon><span></span></div>';
      m.querySelector('span').textContent = this._err ? 'Aktualisierung fehlgeschlagen – zeige letzten Stand' : `Nicht geladen: ${warn.join(', ')}`;
      body.push(m);
    }
    e.body.replaceChildren(...body);
  }
  _cls(d) { return d === 0 ? ' today' : d === 1 ? ' tomorrow' : ''; }
  _row(it) {
    const el = document.createElement('div');
    el.className = 'wr' + this._cls(it.d);
    if (it.color) el.style.setProperty('--c', it.color);
    el.innerHTML = '<div class="ic"></div><div class="nm"><b></b><small></small></div><span class="rel"></span>';
    setIcon(el.firstChild, it.icon);
    el.querySelector('b').textContent = it.name;
    el.querySelector('small').textContent = this._date(it);
    el.querySelector('.rel').textContent = this._rel(it.d);
    press(el, {tap: () => moreInfo(this, it.cal)});
    return el;
  }
  // Kompakt: nur der nächste Abholtag, mehrere Müllarten an dem Tag nebeneinander
  _compact(shown) {
    const it = shown[0], el = document.createElement('div');
    el.className = 'cp' + this._cls(it.d);
    el.innerHTML = '<div class="ics"></div><div class="nm"><b></b><small></small></div><span class="rel"></span>';
    el.firstChild.append(...shown.map(x => {
      const ic = document.createElement('div');
      ic.className = 'ic';
      if (x.color) ic.style.setProperty('--c', x.color);
      setIcon(ic, x.icon);
      return ic;
    }));
    el.querySelector('b').textContent = shown.map(x => x.name).join(' · ');
    el.querySelector('small').textContent = this._date(it);
    el.querySelector('.rel').textContent = this._rel(it.d);
    press(el, {tap: () => moreInfo(this, it.cal)});
    return el;
  }
}
define('nova-waste-card', NovaWasteCard, {name: 'Nova Müllkalender Card', description: 'Nächste Müllabholungen aus einem oder mehreren Kalendern – mit Müllart, Icon, Farbe, Datum und „heute / morgen / in X Tagen“.', documentationURL: docUrl('nova-müllkalender-card')});

/* ---------- Editor Müllkalender Card ---------- */
const WMAIN = [
  {name: 'entities', required: true, selector: {entity: {domain: 'calendar', multiple: true}}},
  g2({name: 'title', selector: T}, {name: 'icon', selector: I}),
  g2(sel('layout', [['list', 'Liste'], ['compact', 'Kompakt (nur nächster Termin)']]), {name: 'count', selector: {number: {min: 1, max: 20, mode: 'box'}}}),
  g2({name: 'days', selector: {number: {min: 1, max: 366, mode: 'box', unit_of_measurement: 'Tage'}}}, {name: 'refresh', selector: {number: {min: 5, max: 1440, mode: 'box', unit_of_measurement: 'min'}}}),
  g2({name: 'hide_unmatched', selector: {boolean: {}}}, {name: 'show_header', selector: {boolean: {}}}),
  {name: 'glow', selector: {boolean: {}}},
];
const WTYPE = [
  g2({name: 'match', required: true, selector: T}, {name: 'name', selector: T}),
  g2({name: 'icon', selector: I}, {name: 'color', selector: {ui_color: {}}}),
];
const WLABELS = {...BASE_LABELS, entities: 'Kalender', title: 'Überschrift', layout: 'Darstellung', count: 'Anzahl Termine',
  days: 'Zeitraum', refresh: 'Aktualisieren alle', hide_unmatched: 'Termine ohne passende Müllart ausblenden', show_header: 'Kopfzeile anzeigen',
  glow: 'Rahmen leuchtet bei Abholung heute/morgen', match: 'Stichwort im Termintitel', name: 'Anzeigename', color: 'Farbe'};
const WHELPERS = {
  entities: 'Ein oder mehrere Kalender, z. B. ein iCal-Abfallkalender',
  count: 'Nur bei Darstellung „Liste“',
  days: 'So weit im Voraus werden Termine geholt',
  icon: 'Leer = Icon der Karte',
  match: 'Groß/Klein egal, mehrere mit Komma: Papier, PPK',
  name: 'Leer = Termintitel',
  show_header: 'Bei „Kompakt“ immer aus',
};

class NovaWasteCardEditor extends NovaEditorBase {
  static labels = WLABELS;
  static helpers = WHELPERS;
  _ilabel(it, j) { return `${j + 1}. ${it.name || it.match || 'Neu: Müllart'}`; }
  _build() {
    const r = this.shadowRoot, c0 = this._config;
    r.innerHTML = `<style>${EDITOR_CSS}${EDITOR_ICON_CSS}${EDITOR_LIST_CSS}</style><div class="wrap"></div>`;
    const w = r.querySelector('.wrap');
    const strip = c => { Object.entries(WDEF).forEach(([k, x]) => c[k] === x && delete c[k]); delete c.entity; return c; };
    w.append(this._form(WMAIN, {...WDEF, ...c0, entities: calsOf(c0)}, v => this._emit(strip(merge(this._config, names(WMAIN), v)))));

    w.append(this._h3('Müllarten'));
    w.append(this._hint('Die erste Regel, deren Stichwort im Termintitel vorkommt, bestimmt Name, Icon und Farbe.'));
    this._itemList(w, 'types', WTYPE, {item: 'Müllart', icon: 'mdi:trash-can-outline'}, 'Müllart hinzufügen');
    if (!this._items('types').length) w.append(this._add('Standard-Müllarten einfügen', () => { this._setItems('types', WTYPES.map(t => ({...t}))); this._rebuild(); }));
  }
}
define('nova-waste-card-editor', NovaWasteCardEditor);
