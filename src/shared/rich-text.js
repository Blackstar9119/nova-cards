// Formatierter Text für Notiz und Einkauf: Leiste (Fett, Kursiv, Unterstrichen, Durchgestrichen, Größe, Aufzählung,
// Checkliste, Textfarbe aus dem Theme), Eingabefeld, Anzeige und Klartext für den Bondrucker.
// Gespeichert wird bereinigtes HTML aus einer festen Liste (siehe ALLOW). Dieselbe Liste filtert die Nova-Integration
// (custom_components/nova/sanitize.py) – beide Seiten bereinigen, nichts anderes kommt durch.
import {esc} from './utils.js';

const TAGS = {B: 'b', STRONG: 'b', I: 'i', EM: 'i', U: 'u', S: 's', STRIKE: 's', DEL: 's', BR: 'br', P: 'p', DIV: 'p', H3: 'h3',
  UL: 'ul', OL: 'ul', LI: 'li', SPAN: 'span'};
const ALLOW = {span: ['fs-s', 'fs-l', 'c-accent', 'c-warn', 'c-muted'], ul: ['check'], li: ['done']};
const DROP = new Set(['SCRIPT', 'STYLE', 'IFRAME', 'OBJECT', 'EMBED', 'TEMPLATE', 'SVG', 'MATH', 'NOSCRIPT', 'TEXTAREA', 'SELECT', 'HEAD', 'TITLE']);

// HTML auf die erlaubte Teilmenge bringen. <template> führt nichts aus und lädt keine Bilder.
export function sanitize(html) {
  if (!html) return '';
  const t = document.createElement('template');
  t.innerHTML = String(html);
  const walk = node => [...node.childNodes].map(n => {
    if (n.nodeType === 3) return esc(n.data).replace(/&#39;/g, "'").replace(/&quot;/g, '"');
    if (n.nodeType !== 1 || DROP.has(n.nodeName)) return '';
    const name = TAGS[n.nodeName], inner = walk(n.content || n);
    if (name === 'br') return '<br>';
    if (!name) return inner;
    const cls = [...new Set((n.getAttribute('class') || '').split(/\s+/).filter(c => ALLOW[name]?.includes(c)))];
    if (name === 'span' && !cls.length) return inner;
    return `<${name}${cls.length ? ` class="${cls.join(' ')}"` : ''}>${inner}</${name}>`;
  }).join('');
  return walk(t.content).replace(/^(<br>)+|(<br>)+$/g, '');
}
export const isEmpty = html => !String(html || '').replace(/<[^>]*>/g, '').replace(/&nbsp;| |​/g, '').trim();

// Klartext für Bondrucker (ESC/POS mag kein HTML): Überschrift GROSS, • Aufzählung, [ ]/[x] Checkliste
export function toPlain(html) {
  const t = document.createElement('template');
  t.innerHTML = sanitize(html);
  const out = [];
  let line = '';
  const flush = () => { out.push(line.replace(/\s+$/, '')); line = ''; };
  const walk = (node, pre = '') => node.childNodes.forEach(n => {
    if (n.nodeType === 3) { line += n.data.replace(/ /g, ' '); return; }
    const tag = n.nodeName;
    if (tag === 'BR') { flush(); line = pre ? ' '.repeat(pre.length) : ''; return; }
    if (tag === 'LI') {
      if (line.trim()) flush();
      const chk = n.parentNode?.classList?.contains('check');
      line = chk ? (n.classList.contains('done') ? '[x] ' : '[ ] ') : '• ';
      walk(n, line); flush(); return;
    }
    if (tag === 'H3') { if (line.trim()) flush(); line = ''; const s = out.length; walk(n); flush(); out[s] = (out[s] || '').toUpperCase(); return; }
    if (tag === 'P' || tag === 'UL') { if (line.trim()) flush(); walk(n, pre); if (line.trim() || tag === 'P') flush(); return; }
    walk(n, pre);
  });
  walk(t.content);
  if (line) flush();
  return out.join('\n').replace(/\n{3,}/g, '\n\n').trim();
}
// Erste Textzeile (Vorschau in Listen)
export const firstLine = html => toPlain(html).split('\n').map(s => s.replace(/^(\[.?\]|•)\s*/, '').trim()).find(Boolean) || '';

// Anzeige und Eingabefeld teilen sich diese Regeln (.rt)
export const RICH_CSS = `
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
.tb{display:flex;gap:var(--nv-s2);flex-wrap:wrap;align-items:center;padding:var(--nv-s2);border-radius:var(--nv-r-md);background:rgba(var(--nv-tint),.06);border:1px solid rgba(var(--nv-tint),.08)}
.tb .sep{width:1px;align-self:stretch;margin:var(--nv-s2) var(--nv-s1);background:rgba(var(--nv-tint),.14)}
.tb button{width:44px;height:44px;border-radius:var(--nv-r-sm);border:0;background:transparent;color:inherit;display:flex;align-items:center;justify-content:center;
cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent;transition:background-color var(--nv-d2),color var(--nv-d2),transform var(--nv-d2)}
.tb button ha-icon{--mdc-icon-size:22px}
.tb button:active{transform:scale(var(--nv-press))}
.tb button.on{background:color-mix(in srgb,var(--nv-active) 28%,transparent);color:var(--nv-fg)}
.tb button:focus-visible{box-shadow:var(--nv-focus);outline:none}
.tb .dot{width:20px;height:20px;border-radius:50%;border:2px solid rgba(var(--nv-tint),.35);box-sizing:border-box}
.tb .dot.c-accent{background:var(--nv-text-accent)}.tb .dot.c-warn{background:var(--nv-text-warn)}.tb .dot.c-muted{background:rgba(var(--nv-tint),.35)}
.tb .dot.c-none{background:var(--nv-fg)}
@media (prefers-reduced-motion:reduce){.rt ul.check li,.rt ul.check li::before,.rt ul.check li::after{transition:none}}`;

// Knöpfe der Leiste: [key, icon, Titel]; Gruppen durch '|'
const SIZES = [['fs-s', 'mdi:format-font-size-decrease', 'Klein'], ['', 'mdi:format-text', 'Normal'], ['fs-l', 'mdi:format-font-size-increase', 'Groß'], ['h3', 'mdi:format-header-1', 'Überschrift']];
const COLORS = [['c-accent', 'Akzent'], ['c-warn', 'Wichtig'], ['c-muted', 'Gedämpft'], ['', 'Normal']];

const sel = root => (root.getSelection ? root.getSelection() : document.getSelection());
const within = (rte, n) => n && (n === rte || rte.contains(n));
const closest = (n, s, stop) => { for (let x = n?.nodeType === 1 ? n : n?.parentElement; x && x !== stop; x = x.parentElement) if (x.matches(s)) return x; return null; };

// Auswahl in eine span mit Klasse aus der Gruppe packen (cls leer = Gruppe entfernen)
function wrap(rte, root, group, cls) {
  const s = sel(root);
  if (!s?.rangeCount) return;
  const r = s.getRangeAt(0);
  if (!within(rte, r.commonAncestorContainer)) return;
  if (r.collapsed) {
    // ohne Auswahl: ganzes Wort unter dem Cursor
    const n = r.startContainer;
    if (n.nodeType !== 3) return;
    const t = n.data, i = r.startOffset;
    let a = i, b = i;
    while (a > 0 && /\S/.test(t[a - 1])) a--;
    while (b < t.length && /\S/.test(t[b])) b++;
    if (a === b) return;
    r.setStart(n, a); r.setEnd(n, b);
  }
  // span mit genau dieser Auswahl? Dann nur Klasse tauschen
  const host = closest(r.commonAncestorContainer, 'span', rte);
  if (host && host.textContent === r.toString()) {
    group.forEach(c => c && host.classList.remove(c));
    if (cls) host.classList.add(cls);
    if (!host.classList.length) host.replaceWith(...host.childNodes);
    return;
  }
  const frag = r.extractContents();
  frag.querySelectorAll('span').forEach(sp => {
    group.forEach(c => c && sp.classList.remove(c));
    if (!sp.classList.length) sp.replaceWith(...sp.childNodes);
  });
  let node = frag;
  if (cls) { node = document.createElement('span'); node.className = cls; node.append(frag); }
  const first = node === frag ? frag.firstChild : node, last = node === frag ? frag.lastChild : node;
  r.insertNode(node);
  if (first && last) { const nr = document.createRange(); nr.setStartBefore(first); nr.setEndAfter(last); s.removeAllRanges(); s.addRange(nr); }
}

// Eingabefeld + Leiste. onInput(html) bei jeder Änderung (bereinigt). Liefert {el, rte, tb, get, set, focus}.
export function richEditor({placeholder = '', colors = true, onInput} = {}) {
  const el = document.createElement('div');
  el.className = 'rtw';
  el.innerHTML = '<div class="tb" role="toolbar" aria-label="Formatierung"></div><div class="rt rte" contenteditable="true" spellcheck="true"></div>';
  const tb = el.firstChild, rte = el.lastChild;
  rte.dataset.ph = placeholder;
  const root = () => el.getRootNode();
  const btns = {};
  const btn = (key, icon, title, fn, inner) => {
    const b = document.createElement('button');
    b.type = 'button'; b.title = title; b.setAttribute('aria-label', title);
    b.innerHTML = inner || `<ha-icon icon="${icon}"></ha-icon>`;
    // pointerdown ohne Fokuswechsel, sonst ist die Auswahl im Textfeld weg
    b.addEventListener('pointerdown', e => e.preventDefault());
    b.addEventListener('mousedown', e => e.preventDefault());
    b.addEventListener('click', e => { e.preventDefault(); e.stopPropagation(); if (!within(rte, sel(root())?.anchorNode)) rte.focus(); fn(); changed(); });
    btns[key] = b;
    tb.append(b);
    return b;
  };
  const sep = () => { const s = document.createElement('span'); s.className = 'sep'; tb.append(s); };
  const exec = (c, v) => document.execCommand(c, false, v);
  btn('bold', 'mdi:format-bold', 'Fett', () => exec('bold'));
  btn('italic', 'mdi:format-italic', 'Kursiv', () => exec('italic'));
  btn('underline', 'mdi:format-underline', 'Unterstrichen', () => exec('underline'));
  btn('strikeThrough', 'mdi:format-strikethrough-variant', 'Durchgestrichen', () => exec('strikeThrough'));
  sep();
  // Größe: ein Knopf, der durch Klein → Normal → Groß → Überschrift schaltet, wäre fummelig; vier Knöpfe sind auf Touch schneller
  SIZES.forEach(([k, icon, title]) => btn(`size:${k}`, icon, title, () => {
    const blk = closest(sel(root())?.anchorNode, 'h3,p,li', rte);
    if (k === 'h3') { exec('formatBlock', blk?.nodeName === 'H3' ? 'p' : 'h3'); return; }
    if (blk?.nodeName === 'H3') exec('formatBlock', 'p');
    wrap(rte, root(), ['fs-s', 'fs-l'], k);
  }));
  sep();
  btn('list', 'mdi:format-list-bulleted', 'Aufzählung', () => {
    const ul = closest(sel(root())?.anchorNode, 'ul', rte);
    if (ul?.classList.contains('check')) { ul.classList.remove('check'); return; }
    exec('insertUnorderedList');
  });
  btn('check', 'mdi:format-list-checks', 'Checkliste', () => {
    let ul = closest(sel(root())?.anchorNode, 'ul', rte);
    if (ul?.classList.contains('check')) { exec('insertUnorderedList'); return; }
    if (!ul) { exec('insertUnorderedList'); ul = closest(sel(root())?.anchorNode, 'ul', rte); }
    ul?.classList.add('check');
  });
  if (colors) {
    sep();
    COLORS.forEach(([k, title]) => btn(`color:${k}`, '', `Farbe: ${title}`, () => wrap(rte, root(), COLORS.map(c => c[0]), k), `<span class="dot ${k || 'c-none'}"></span>`));
  }
  // Knopfzustände zur aktuellen Auswahl
  const paint = () => {
    const s = sel(root()), n = s?.anchorNode;
    if (!within(rte, n)) return;
    ['bold', 'italic', 'underline', 'strikeThrough'].forEach(k => btns[k].classList.toggle('on', document.queryCommandState(k)));
    const h3 = !!closest(n, 'h3', rte), sz = closest(n, 'span.fs-s,span.fs-l', rte), ul = closest(n, 'ul', rte), col = closest(n, 'span.c-accent,span.c-warn,span.c-muted', rte);
    SIZES.forEach(([k]) => btns[`size:${k}`].classList.toggle('on', k === 'h3' ? h3 : !h3 && (sz ? sz.classList.contains(k) : k === '')));
    btns.list.classList.toggle('on', !!ul && !ul.classList.contains('check'));
    btns.check.classList.toggle('on', !!ul?.classList.contains('check'));
    if (colors) COLORS.forEach(([k]) => btns[`color:${k}`].classList.toggle('on', col ? col.classList.contains(k) : k === ''));
  };
  const changed = () => {
    // leere Zeile nach Enter in der Checkliste übernimmt sonst „erledigt“
    rte.querySelectorAll('ul.check li.done').forEach(li => { if (!li.textContent.trim()) li.classList.remove('done'); });
    paint();
    onInput?.(get());
  };
  const onSel = () => paint();
  rte.addEventListener('input', changed);
  rte.addEventListener('keyup', paint);
  rte.addEventListener('pointerup', paint);
  rte.addEventListener('focus', () => document.addEventListener('selectionchange', onSel));
  rte.addEventListener('blur', () => document.removeEventListener('selectionchange', onSel));
  // HA-Tastenkürzel (z. B. „e“, „c“) nicht auslösen
  rte.addEventListener('keydown', e => e.stopPropagation());
  // Einfügen nur als Text – fremdes HTML kommt nicht ins Feld
  rte.addEventListener('paste', e => { e.preventDefault(); exec('insertText', e.clipboardData?.getData('text/plain') || ''); });
  rte.addEventListener('drop', e => e.preventDefault());
  // Kästchen der Checkliste antippen = abhaken
  rte.addEventListener('click', e => {
    const li = closest(e.target, 'ul.check > li', rte);
    if (li && e.clientX - li.getBoundingClientRect().left < 28) { li.classList.toggle('done'); changed(); }
  });
  const get = () => sanitize(rte.innerHTML);
  const set = html => { rte.innerHTML = sanitize(html); paint(); };
  try { document.execCommand('defaultParagraphSeparator', false, 'p'); } catch { /* ältere Browser */ }
  return {el, rte, tb, get, set, focus: () => rte.focus()};
}

// Fertigen Text anzeigen; mit onToggle lassen sich Checklisten-Punkte direkt abhaken (liefert neues HTML)
export function richView(el, html, onToggle) {
  const clean = sanitize(html);
  if (el._html !== clean) { el._html = clean; el.innerHTML = clean; }
  el.classList.add('rt');
  if (onToggle && !el._tog) {
    el._tog = true;
    el.addEventListener('click', e => {
      const li = closest(e.target, 'ul.check > li', el);
      if (!li) return;
      e.stopPropagation();
      li.classList.toggle('done');
      el._html = sanitize(el.innerHTML);
      el._onToggle?.(el._html);
    });
  }
  el._onToggle = onToggle;
}
