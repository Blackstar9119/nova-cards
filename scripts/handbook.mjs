/* Editor-Bilder für die Rezepte im Handbuch (nova-integration/docs/de/karten/*.md).
   Aufruf: npm run screenshots:handbook [-- --only geraet,uhr] [-- --list geraet-card,clock-card]

   Je Rezept aus scripts/handbook.config.mjs: Karte in die Ansicht „handbuch“ des Showcase-Dashboards auf HA Dev legen,
   im Bearbeiten-Modus den Editor öffnen, die genannten Bereiche aufklappen, die wichtigen Felder rot umrahmen und den
   Dialog fotografieren. Ergebnis: docs/images/<ordner>/<ordner>-blue-howto-<id>.webp. Gespeichert wird nichts an der Karte.
   --list zeigt für Kartentypen alle Bereiche und Felder (Feldname = Konfig-Schlüssel), als Hilfe beim Schreiben der Rezepte.

   .env im Repo-Root: HA_URL, HA_TOKEN (nur HA Dev). */
import {chromium} from 'playwright';
import {execFileSync} from 'node:child_process';
import {mkdirSync, readFileSync, rmSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {LIST_STUBS, RECIPES} from './handbook.config.mjs';
import {DASHBOARD} from './screenshots.config.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const DOCS = join(ROOT, '../nova-integration/docs/images');
const RAW = join(ROOT, 'screenshots/handbook');
const VIEW = 'handbuch';
const WIDTH = 1280, HEIGHT = 1400, SETTLE = 2500;
const RED = '#e5484d';

const args = process.argv.slice(2);
const opt = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? (args[i + 1] || '').split(',').filter(Boolean) : null; };
const only = opt('only'), list = opt('list');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log(...a);

const env = Object.fromEntries(readFileSync(join(ROOT, '.env'), 'utf8').split('\n').filter(l => l.includes('='))
  .map(l => [l.slice(0, l.indexOf('=')).trim(), l.slice(l.indexOf('=') + 1).trim()]));
const HA = env.HA_URL?.replace(/\/$/, ''), TOKEN = env.HA_TOKEN;
if (!HA || !TOKEN) { console.error('HA_URL und HA_TOKEN fehlen (.env im Repo-Root).'); process.exit(1); }

const browser = await chromium.launch();
const context = await browser.newContext({viewport: {width: WIDTH, height: HEIGHT}, deviceScaleFactor: 2, locale: 'de-DE',
  timezoneId: 'Europe/Berlin', colorScheme: 'dark'});
await context.addInitScript(([u, t]) => {
  localStorage.setItem('hassTokens', JSON.stringify({hassUrl: u, clientId: u + '/', access_token: t, token_type: 'Bearer',
    expires_in: 1e8, refresh_token: '', expires: Date.now() + 1e10}));
  localStorage.setItem('dockedSidebar', '"docked"');
}, [HA, TOKEN]);
// Demo-Uhrzeit wie in der README-Galerie
await context.clock.setFixedTime(new Date('2026-11-14T18:30:00+01:00'));
const page = await context.newPage();
await page.route('**/nova-dev-cards.js*', r => r.abort());
// Demo-Bilder direkt aus /local (die Bild-Entitäten auf HA Dev holen sie über 127.0.0.1:8123 und scheitern)
await page.route('**/api/image_proxy/image.nova_demo_*', async r => {
  const name = r.request().url().match(/image\.nova_demo_([a-z_]+)/)[1];
  const file = {kamera_wohnzimmer: 'kamera-wohnzimmer.jpg', kamera_garten: 'kamera-garten.jpg', kamera_einfahrt: 'kamera-einfahrt.jpg',
    saugroboter_karte: 'saugroboter-karte.png'}[name];
  if (!file) return r.continue();
  r.fulfill({response: await r.fetch({url: `${HA}/local/nova-showcase/${file}`})});
});
const problems = [];

const hass = (fn, arg) => page.evaluate(([f, a]) => {
  const h = document.querySelector('home-assistant')?.hass;
  if (!h) throw new Error('kein hass');
  return new Function('h', 'a', `return (${f})(h, a);`)(h, a);
}, [fn.toString(), arg]);

async function load(path) {
  await page.goto(`${HA}/${path}`, {waitUntil: 'load'});
  await page.waitForFunction(() => document.querySelector('home-assistant')?.hass?.states, null, {timeout: 30000});
}

// Ansicht „handbuch“: ein Abschnitt je Karte (nur in HA Dev)
async function writeView(cards) {
  await hass(async (h, [dash, view, cards]) => {
    const c = await h.callWS({type: 'lovelace/config', url_path: dash});
    c.views = c.views.filter(v => v.path !== view);
    c.views.push({title: 'Handbuch', path: view, icon: 'mdi:book-education-outline', type: 'sections', max_columns: 4,
      sections: cards.map(card => ({type: 'grid', column_span: 2, cards: [{grid_options: {columns: 'full'}, ...card}]}))});
    await h.callWS({type: 'lovelace/config/save', url_path: dash, config: c});
  }, [DASHBOARD, VIEW, cards]);
}

// Editor der Karte in Abschnitt i öffnen
async function openEditor(i, tag) {
  await load(`${DASHBOARD}/${VIEW}?edit=1`);
  await page.locator('hui-view').first().waitFor({timeout: 30000});
  await sleep(SETTLE);
  const card = page.locator('hui-sections-view hui-section').nth(i).locator(tag).first();
  await card.scrollIntoViewIfNeeded();
  await sleep(300);
  const b = await card.boundingBox();
  if (!b) throw new Error(`${tag} in Abschnitt ${i} nicht sichtbar`);
  await page.mouse.click(b.x + b.width / 2, Math.min(b.y + 30, HEIGHT - 40));
  await page.locator(`${tag}-editor`).first().waitFor({timeout: 15000});
  await sleep(1800);
}

// Im Editor: Bereiche auf/zu, Einträge aufklappen, Felder suchen. Läuft im Browser.
const inEditor = (tag, task) => page.evaluate(([tag, task, RED]) => {
  const deep = (n, f, out = []) => { for (const el of n.querySelectorAll('*')) { if (f(el)) out.push(el); if (el.shadowRoot) deep(el.shadowRoot, f, out); } return out; };
  const ed = deep(document, e => e.localName === `${tag}-editor`)[0];
  if (!ed) return {error: 'Editor fehlt'};
  const r = ed.shadowRoot;
  const label = d => d.querySelector(':scope > summary .lbl, :scope > summary')?.textContent.trim() || '';
  if (task.kind === 'list') {
    const secs = [...r.querySelectorAll('details.sec')];
    secs.forEach(d => { d.open = true; });
    return {pending: true};
  }
  if (task.kind === 'dump') {
    const L = ed.constructor.labels || {};
    return [...r.querySelectorAll('details.sec')].map(d => ({sec: label(d),
      fields: deep(d, e => e.localName === 'ha-selector' && e.schema?.name).map(e => `${e.schema.name}${L[e.schema.name] ? ` (${L[e.schema.name]})` : ''}`),
      items: [...d.querySelectorAll('details:not(.sec)')].map(label)}));
  }
  if (task.kind === 'open') {
    const want = task.open || [];
    for (const d of r.querySelectorAll('details.sec')) d.open = want.includes(label(d));
    const missing = want.filter(w => ![...r.querySelectorAll('details.sec')].some(d => label(d) === w));
    return {missing, have: missing.length ? [...r.querySelectorAll('details.sec')].map(label) : []};
  }
  if (task.kind === 'items') {
    const missing = [];
    for (const w of task.items || []) {
      const d = [...r.querySelectorAll('details:not(.sec)')].find(x => label(x).startsWith(w));
      if (d) d.open = true; else missing.push(w);
    }
    return {missing, have: missing.length ? [...r.querySelectorAll('details:not(.sec)')].map(label) : []};
  }
  if (task.kind === 'mark') {
    document.querySelectorAll('.nova-hb-mark').forEach(x => x.remove());
    const hits = [], missing = [];
    for (const m of task.mark || []) {
      let el;
      if (typeof m === 'string') el = deep(r, e => e.localName === 'ha-selector' && e.schema?.name === m && e.getBoundingClientRect().height > 0)[0];
      else if (m.text) el = deep(r, e => [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim() === m.text && e.getBoundingClientRect().height > 0)[0];
      else if (m.section) el = [...r.querySelectorAll('details.sec')].find(d => label(d) === m.section)?.querySelector('summary');
      else if (m.item) el = [...r.querySelectorAll('details:not(.sec)')].find(d => label(d).startsWith(m.item))?.querySelector('summary');
      if (m.text && el) el = el.closest('button, ha-button, mwc-button, summary, label, .add, .btn') || el;
      if (el) hits.push(el); else missing.push(typeof m === 'string' ? m : JSON.stringify(m));
    }
    if (task.scroll && hits[0]) hits[0].scrollIntoView({block: 'center'});
    return {missing, count: hits.length, pending: true};
  }
  if (task.kind === 'draw') {
    // Rahmen erst nach dem Scrollen zeichnen (feste Position im Fenster)
    const L = [];
    for (const m of task.mark || []) {
      let el;
      if (typeof m === 'string') el = deep(r, e => e.localName === 'ha-selector' && e.schema?.name === m && e.getBoundingClientRect().height > 0)[0];
      else if (m.text) { el = deep(r, e => [...e.childNodes].filter(n => n.nodeType === 3).map(n => n.textContent).join('').trim() === m.text && e.getBoundingClientRect().height > 0)[0];
        if (el) el = el.closest('button, ha-button, mwc-button, summary, label, .add, .btn') || el; }
      else if (m.section) el = [...r.querySelectorAll('details.sec')].find(d => label(d) === m.section)?.querySelector('summary');
      else if (m.item) el = [...r.querySelectorAll('details:not(.sec)')].find(d => label(d).startsWith(m.item))?.querySelector('summary');
      if (!el) continue;
      const b = el.getBoundingClientRect();
      const box = document.createElement('div');
      box.className = 'nova-hb-mark';
      Object.assign(box.style, {position: 'fixed', left: `${b.left - 5}px`, top: `${b.top - 5}px`, width: `${b.width + 10}px`,
        height: `${b.height + 10}px`, border: `3px solid ${RED}`, borderRadius: '10px', zIndex: 2147483647, pointerEvents: 'none',
        boxShadow: '0 0 0 2px rgba(0,0,0,.35)', boxSizing: 'border-box'});
      // Der Dialog liegt in der obersten Ebene (top layer) – Rahmen deshalb in den Dialog selbst hängen
      const host = (() => { const d = document.querySelector('home-assistant')?.shadowRoot?.querySelector('hui-dialog-edit-card');
        const find = n => { for (const x of n.querySelectorAll('*')) { if (x.localName === 'dialog') return x; if (x.shadowRoot) { const f = find(x.shadowRoot); if (f) return f; } } return null; };
        return (d?.shadowRoot && find(d.shadowRoot)) || document.body; })();
      const o = host.getBoundingClientRect(), fixedOk = host === document.body;
      if (!fixedOk) Object.assign(box.style, {position: 'absolute', left: `${b.left - o.left - 5 - host.clientLeft}px`, top: `${b.top - o.top - 5 - host.clientTop + host.scrollTop}px`});
      host.append(box);
      L.push(1);
    }
    return {drawn: L.length};
  }
}, [tag, task, RED]);

// Rechteck des Dialogs „Karte bearbeiten“
const dialogBox = () => page.evaluate(() => {
  const d = document.querySelector('home-assistant')?.shadowRoot?.querySelector('hui-dialog-edit-card');
  const find = n => { for (const el of n.querySelectorAll('*')) {
    if (el.localName === 'dialog' || el.classList?.contains('mdc-dialog__surface')) {
      const r = el.getBoundingClientRect(); if (r.width > 200 && r.height > 200) return r;
    }
    if (el.shadowRoot) { const r = find(el.shadowRoot); if (r) return r; }
  } return null; };
  const r = d?.shadowRoot && find(d.shadowRoot);
  return r && {x: r.left, y: r.top, width: r.width, height: r.height};
});

async function closeEditor() {
  await inEditor('x', {kind: 'none'}).catch(() => {});
  await page.keyboard.press('Escape');
  await sleep(500);
}

try {
  await load(`${DASHBOARD}/0`);
  if (list) {
    // Bereiche und Felder ausgeben
    // Karten ohne Entität zeichnen sich teils nicht – dann die Konfig aus dem ersten Rezept nehmen
    const stub = t => RECIPES.find(r => r.card === t)?.config || LIST_STUBS[t] || {};
    await writeView(list.map(t => ({type: `custom:nova-${t}`, ...stub(t)})));
    for (const [i, t] of list.entries()) {
      try { await openEditor(i, `nova-${t}`); } catch (e) { log(`\n### ${t}: ${e.message.split('\n')[0]}`); continue; }
      await inEditor(`nova-${t}`, {kind: 'list'});
      await sleep(1500);
      const d = await inEditor(`nova-${t}`, {kind: 'dump'});
      log(`\n### ${t}`);
      for (const s of d) log(`- ${s.sec}: ${s.fields.join(', ')}${s.items.length ? ` | Einträge: ${s.items.join(', ')}` : ''}`);
      await closeEditor();
    }
  } else {
    const todo = RECIPES.filter(r => !only || only.includes(r.page));
    rmSync(RAW, {recursive: true, force: true});
    mkdirSync(RAW, {recursive: true});
    await writeView(todo.map(r => ({type: `custom:nova-${r.card}`, ...r.config})));
    for (const [i, r] of todo.entries()) {
      const tag = `nova-${r.card}`, name = `${r.img}-blue-howto-${r.id}`;
      try {
        await openEditor(i, tag);
        // Nacheinander aufklappen: Inhalte (auch weitere Bereiche) entstehen erst beim Öffnen
        let res;
        for (let n = 1; n <= r.open.length; n++) {
          res = await inEditor(tag, {kind: 'open', open: r.open.slice(0, n)});
          await sleep(700);
        }
        if (res?.missing?.length) problems.push(`${name}: Bereich fehlt: ${res.missing.join(', ')} (da: ${res.have.join(' | ')})`);
        for (const it of r.items || []) {
          res = await inEditor(tag, {kind: 'items', items: [it]});
          if (res.missing?.length) problems.push(`${name}: Eintrag fehlt: ${res.missing.join(', ')} (da: ${res.have.join(' | ')})`);
          await sleep(700);
        }
        res = await inEditor(tag, {kind: 'mark', mark: r.mark, scroll: true});
        if (res.missing?.length) problems.push(`${name}: Feld fehlt: ${res.missing.join(', ')}`);
        await sleep(600);
        await inEditor(tag, {kind: 'draw', mark: r.mark});
        await sleep(200);
        const box = await dialogBox();
        if (!box) { problems.push(`${name}: Dialog nicht gefunden`); await closeEditor(); continue; }
        const png = join(RAW, `${name}.png`);
        const clip = {x: box.x, y: box.y, width: box.width, height: Math.min(box.height, HEIGHT - box.y)};
        await page.screenshot({path: png, clip});
        mkdirSync(join(DOCS, r.img), {recursive: true});
        execFileSync('cwebp', ['-quiet', '-q', '84', '-m', '6', '-resize', String(Math.min(1400, Math.round(clip.width * 1.4))), '0',
          '-metadata', 'none', png, '-o', join(DOCS, r.img, `${name}.webp`)]);
        log(`  ✓ ${r.img}/${name}.webp`);
        await closeEditor();
      } catch (e) {
        problems.push(`${name}: ${e.message.split('\n')[0]}`);
        await closeEditor().catch(() => {});
      }
    }
  }
} finally {
  await browser.close();
}
if (problems.length) { log(`\n${problems.length} Probleme:`); for (const p of problems) log('  -', p); process.exitCode = 2; }
