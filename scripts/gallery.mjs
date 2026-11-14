/* README-Galerie von nova-homeverse: jede Karte genau einmal als Kachel 600 × 450, Theme-Vergleich und Hero.
   Aufruf: npm run screenshots:gallery [-- --only room,chips] [-- --no-compare] [-- --no-hero] [-- --no-gallery] [-- --keep]
   Aufnahme aus HA Dev (Dashboard „Nova Showcase“, Konfiguration GALLERY in screenshots.config.mjs) mit:
     - fester Uhrzeit 18:30 (Uhr, Datum, Theme-Vergleich),
     - ruhigem, einfarbigem Dashboard-Hintergrund (statt Verlauf), damit die Kachel nahtlos ist,
     - Karte unverzerrt in der Kachel: passt sie hinein, mittig; sehr hohe Karten oben angeschnitten (sanft ausgeblendet);
       sehr flache Karten zusammen mit Nachbarkarten (stack), damit die Kachel nicht leer wirkt.
   Ergebnis: ../nova-homeverse/docs/images/gallery/<karte>.webp, themes/compare-<theme>.webp, themes/hero-blue.webp.
   Rohbilder (PNG, 2×) landen in screenshots/gallery/ (gitignored). Braucht .env mit HA_URL und HA_TOKEN. */
import {chromium} from 'playwright';
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, rmSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {CARDS, COMPARE, DASHBOARD, GALLERY, HERO, THEMES} from './screenshots.config.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const RAW = join(ROOT, 'screenshots/gallery');
let DOCS = join(ROOT, '../nova-homeverse/docs/images');
const WIDTH = 1280, HEIGHT = 900, PAD = 24, SETTLE = 2500;
const TILE = {w: 600, h: 450};                       // Ausgabe; aufgebaut wird in 2× (1200 × 900)
const TIME = '2026-11-14T18:30:00';                  // Demo-Uhrzeit (Ortszeit des Browsers)
// Ruhiger Hintergrund je Theme (Grundton der Dashboard-Hintergründe, ohne Verlauf)
const BG = {blau: '#172033', hell: '#e9ecf2', midnight: '#0c0d0f', velvet: '#ece4d8'};

const args = process.argv.slice(2);
const flag = n => args.includes(`--${n}`);
const opt = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const only = opt('only')?.split(',');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log(...a);
const problems = [];

function env() {
  const f = join(ROOT, '.env');
  const vars = {...process.env};
  if (existsSync(f)) for (const l of readFileSync(f, 'utf8').split('\n')) {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  if (!vars.HA_URL || !vars.HA_TOKEN) { console.error('HA_URL und HA_TOKEN fehlen (.env im Repo-Root).'); process.exit(1); }
  if (vars.NOVA_DOCS) DOCS = resolve(ROOT, vars.NOVA_DOCS);
  return {url: vars.HA_URL.replace(/\/$/, ''), token: vars.HA_TOKEN};
}
const {url: HA, token: TOKEN} = env();

// ---------- Browser ----------
const browser = await chromium.launch();
const context = await browser.newContext({viewport: {width: WIDTH, height: HEIGHT}, deviceScaleFactor: 2, locale: 'de-DE',
  timezoneId: 'Europe/Berlin', colorScheme: 'dark'});
const login = ctx => ctx.addInitScript(([hassUrl, token]) => {
  try {
    localStorage.setItem('hassTokens', JSON.stringify({hassUrl, clientId: `${hassUrl}/`, access_token: token,
      token_type: 'Bearer', expires_in: 1e9, expires: Date.now() + 1e12, refresh_token: ''}));
    localStorage.setItem('dockedSidebar', '"docked"');
  } catch { /* egal */ }
}, [HA, TOKEN]);
await login(context);
await context.clock.setFixedTime(new Date(`${TIME}+01:00`));
const page = await context.newPage();
for (const p of [page]) {
  // Dev-Karten (Dev-Ressource) werden hier nicht gebraucht
  await p.route('**/nova-dev-cards.js*', r => r.abort());
  // Demo-Bilder (Kameras, Saugroboter-Karte) direkt aus /local laden: Die Bild-Entitäten auf HA Dev holen sie
  // über 127.0.0.1:8123 und scheitern, wenn HA auf einem anderen Port läuft
  await p.route('**/api/image_proxy/image.nova_demo_*', async r => {
    const name = r.request().url().match(/image\.nova_demo_([a-z_]+)/)[1];
    const file = {kamera_wohnzimmer: 'kamera-wohnzimmer.jpg', kamera_garten: 'kamera-garten.jpg',
      kamera_einfahrt: 'kamera-einfahrt.jpg', saugroboter_karte: 'saugroboter-karte.png'}[name];
    if (!file) return r.continue();
    r.fulfill({response: await r.fetch({url: `${HA}/local/nova-showcase/${file}`})});
  });
  p.on('pageerror', e => log('  ! Seitenfehler:', e.message.split('\n')[0]));
}

const hass = (fn, arg) => page.evaluate(([f, a]) => {
  const h = document.querySelector('home-assistant')?.hass;
  if (!h) throw new Error('kein hass');
  return new Function('h', 'a', `return (${f})(h, a);`)(h, a);
}, [fn.toString(), arg]);

let bg = BG.blau;
async function flatBackground() {
  // Einfarbiger Hintergrund: Variable am Dokument mit !important übersteuert den Verlauf aus backdrop.js
  await page.addStyleTag({content: `html{--lovelace-background:${bg} !important;--view-background:${bg} !important}`});
  await page.evaluate(c => document.documentElement.style.setProperty('--lovelace-background', c, 'important'), bg);
}

async function open(view, hash = '', {keepNavi = false} = {}) {
  await page.goto(`${HA}/${DASHBOARD}/${view}${hash ? '#' + hash : ''}`, {waitUntil: 'load'});
  await page.waitForFunction(() => document.querySelector('home-assistant')?.hass?.states, null, {timeout: 30000});
  await page.locator('hui-view').first().waitFor({timeout: 30000});
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(SETTLE);
  await flatBackground();
  await page.evaluate(keep => {
    const walk = n => { for (const el of n.querySelectorAll('*')) {
      if (el.localName === 'hui-heading-card') el.style.visibility = 'hidden';
      // Fest positionierte Navi-Leisten der Ansicht würden über hohe Karten fallen
      if (!keep && /^nova-(navi|dock)-card$/.test(el.localName)) el.style.display = 'none';
      if (el.shadowRoot) walk(el.shadowRoot);
    } };
    walk(document);
    // Kopfzeile von HA (Ansichts-Reiter) unsichtbar: sie bleibt beim Scrollen oben stehen und läge über hohen Karten
    const root = document.querySelector('home-assistant')?.shadowRoot?.querySelector('home-assistant-main')?.shadowRoot
      ?.querySelector('partial-panel-resolver ha-panel-lovelace')?.shadowRoot?.querySelector('hui-root')?.shadowRoot;
    for (const h of root?.querySelectorAll('.header, .toolbar, app-header') || []) h.style.visibility = 'hidden';
  }, keepNavi);
  await page.mouse.move(2, HEIGHT - 2);
  await sleep(500);
}

async function setTheme(key) {
  await hass(async (h, k) => { await h.callWS({type: 'nova_homeverse/theme/set', theme: k}); }, key);
  await sleep(800);
}
async function themeNow() {
  return page.evaluate(() => new Promise(res => {
    const c = document.querySelector('home-assistant')?.hass?.connection;
    let unsub; const t = setTimeout(() => res(undefined), 3000);
    c.subscribeMessage(m => { clearTimeout(t); res(m?.theme); unsub?.then(u => u()); }, {type: 'nova_homeverse/theme/subscribe'})
      .then(u => { unsub = Promise.resolve(u); }).catch(() => { clearTimeout(t); res(undefined); });
  }));
}
const call = (service, entity, data = {}) => hass((h, [s, e, d]) => {
  const [dom, svc] = s.split(".");
  return h.callService(dom, svc, e ? {...d, entity_id: e} : d);
}, [service, entity, data]);

// ---------- Aufnahme ----------
const cardType = (c, s) => 'nova-' + (s.type || c.type);
function cardLocator(c, s) {
  return page.locator('hui-sections-view hui-section').nth(s.sec).locator(cardType(c, s)).nth(s.idx || 0);
}
async function clipOf(loc, pad = PAD) {
  await loc.scrollIntoViewIfNeeded({timeout: 5000});
  await sleep(500);
  let b = await loc.boundingBox();
  if (!b || b.width < 10 || b.height < 10) return null;
  if (b.height + 2 * pad > page.viewportSize().height) {
    await page.setViewportSize({width: page.viewportSize().width, height: Math.ceil(b.height + 4 * pad + 120)});
    await sleep(800); await loc.scrollIntoViewIfNeeded(); await sleep(400);
    b = await loc.boundingBox();
  }
  return {x: Math.max(0, b.x - pad), y: Math.max(0, b.y - pad), width: b.width + 2 * pad, height: b.height + 2 * pad};
}
// Element im Schattenbaum der Karte (z. B. Leiste der Navi, Fenster des Pop-ups)
async function innerClip(loc, selector, pad = PAD) {
  const r = await loc.evaluate((el, sel) => {
    // mehrere Treffer (z. B. einzelne Chips): umschließendes Rechteck
    const bs = [...el.shadowRoot?.querySelectorAll(sel) || []].map(k => k.getBoundingClientRect()).filter(b => b.width);
    if (!bs.length) return null;
    const l = Math.min(...bs.map(b => b.left)), t = Math.min(...bs.map(b => b.top));
    const w = Math.max(...bs.map(b => b.right)) - l, h = Math.max(...bs.map(b => b.bottom)) - t;
    return w > 20 && {x: l, y: t, width: w, height: h};
  }, selector);
  return r && {x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad), width: r.width + 2 * pad, height: r.height + 2 * pad};
}

// Fest positionierte Leiste der Karte (Nova Navi): die Karte selbst ist nur ein Platzhalter
async function fixedClip(loc, pad = PAD) {
  const r = await loc.evaluate(el => {
    for (const k of el.shadowRoot?.querySelectorAll('*') || []) {
      if (getComputedStyle(k).position !== 'fixed') continue;
      const b = k.getBoundingClientRect();
      if (b.width > 40 && b.height > 20) return {x: b.left, y: b.top, width: b.width, height: b.height};
    }
    return null;
  });
  return r && {x: Math.max(0, r.x - pad), y: Math.max(0, r.y - pad), width: r.width + 2 * pad,
    height: Math.min(r.height + 2 * pad, HEIGHT - Math.max(0, r.y - pad))};
}

async function capture(c, s, file, vw = WIDTH) {
  await page.setViewportSize({width: vw, height: HEIGHT});
  for (const x of s.set || []) await call(x.service, x.entity, x.data);
  if (s.set?.length) await sleep(1500);
  await open(c.view, s.hash, {keepNavi: !!s.fixed});
  const loc = cardLocator(c, s);
  if (s.hash) {
    await sleep(1500);
    // Pop-up: nur das Fenster, ohne den unscharfen Hintergrund dahinter
    const pop = page.locator(cardType(c, s)).first();
    await pop.evaluate(el => {
      const ov = el.shadowRoot?.querySelector('.ov'); if (ov) ov.style.display = 'none';
      const v = document.querySelector('home-assistant')?.shadowRoot?.querySelector('home-assistant-main')?.shadowRoot
        ?.querySelector('partial-panel-resolver ha-panel-lovelace')?.shadowRoot?.querySelector('hui-root')?.shadowRoot
        ?.querySelector('hui-view-container, #view');
      // Abschnitte hinter dem Pop-up ausblenden (das Pop-up selbst ist fest positioniert und bleibt sichtbar)
      if (v) for (const sec of v.querySelectorAll?.('hui-section') || []) if (!sec.contains(el)) sec.style.visibility = 'hidden';
    });
    await sleep(600);
    const clip = await innerClip(pop, s.inner || '.sh');
    if (!clip) { problems.push(`${c.card}: Pop-up-Fenster nicht gefunden`); return false; }
    await page.screenshot({path: file, clip, animations: 'allow'});
    return true;
  }
  if (!await loc.count()) { problems.push(`${c.card}/${s.state}: Karte nicht gefunden („${c.view}“, Abschnitt ${s.sec})`); return false; }
  const clip = s.fixed ? await fixedClip(loc) : s.inner ? await innerClip(loc, s.inner) : await clipOf(loc);
  if (!clip) { problems.push(`${c.card}/${s.state}: Karte leer`); return false; }
  await page.screenshot({path: file, clip, animations: 'allow'});
  return true;
}

// ---------- Kachel bauen (im Browser, 2×, dann auf 600 × 450 verkleinert) ----------
const comp = await (await browser.newContext({viewport: {width: TILE.w, height: TILE.h}, deviceScaleFactor: 2})).newPage();
async function tile(files, mode, out, {w = TILE.w, h = TILE.h, color = BG.blau} = {}) {
  const imgs = files.map(f => `data:image/png;base64,${readFileSync(f).toString('base64')}`);
  await comp.setViewportSize({width: w, height: h});
  await comp.setContent(`<html><body style="margin:0;width:${w}px;height:${h}px;overflow:hidden;background:${color}">
    <div id="t" style="position:relative;width:${w}px;height:${h}px;display:flex;flex-direction:column;align-items:center;
      justify-content:${mode === 'top' ? 'flex-start' : 'center'};gap:0;box-sizing:border-box;padding:${mode === 'top' ? '6px 0 0' : '0'}">
      ${imgs.map(s => `<img src="${s}" style="display:block;flex:none">`).join('')}
    </div></body></html>`);
  await comp.evaluate(async ({mode, w, h}) => {
    const imgs = [...document.images];
    await Promise.all(imgs.map(i => i.decode()));
    const dpr = 2;
    const nat = imgs.map(i => ({w: i.naturalWidth / dpr, h: i.naturalHeight / dpr}));
    const W = Math.max(...nat.map(n => n.w)), H = nat.reduce((a, n) => a + n.h, 0);
    // Rand der Kachel: die Aufnahmen bringen schon 24 px Hintergrund mit
    const room = {w: w - 8, h: h - 8};
    let k = Math.min(room.w / W, room.h / H, 1.6);
    if (mode === 'top') k = Math.min(room.w * 0.86 / W, 1.6);   // hohe Karte: Breite füllen, unten anschneiden
    imgs.forEach((i, n) => { i.style.width = `${nat[n].w * k}px`; i.style.height = `${nat[n].h * k}px`; });
    if (mode === 'top') {
      const t = document.getElementById('t');
      t.style.webkitMaskImage = t.style.maskImage = `linear-gradient(to bottom, #000 0, #000 ${h - 70}px, transparent ${h - 6}px)`;
    }
  }, {mode, w, h});
  const png = out.replace(/\.webp$/, '.png');
  await comp.screenshot({path: png});
  mkdirSync(dirname(out), {recursive: true});
  execFileSync('cwebp', ['-quiet', '-q', '88', '-m', '6', '-sharp_yuv', '-resize', String(w), String(h), '-metadata', 'none', png, '-o', out]);
}

// Beispiel-Artikel für die Einkaufsliste (werden nach der Aufnahme wieder gelöscht)
async function addItems(items) {
  const ids = [];
  for (const it of [...items].reverse()) {
    const r = await hass((h, item) => h.callWS({type: 'nova_homeverse/shopping/item_save', item}), it);
    if (r?.id) ids.push(r.id); else if (r?.item?.id) ids.push(r.item.id);
  }
  await sleep(800);
  return ids;
}

// ---------- Ablauf ----------
mkdirSync(RAW, {recursive: true});
const byCard = Object.fromEntries(CARDS.map(c => [c.card, c]));
let before;
try {
  await open(HERO.view);
  before = await themeNow();
  await setTheme('blau');
  bg = BG.blau;

  for (const g of flag("no-gallery") ? [] : GALLERY.filter(x => !only || only.includes(x.card))) {
    const c = byCard[g.card];
    const shots = [];
    const demo = g.demoItems ? await addItems(g.demoItems) : [];
    for (const [n, part] of (g.parts || [{}]).entries()) {
      const cc = part.card ? byCard[part.card] : c;
      const s = {...cc.states.find(x => x.state === (part.state || g.state)), ...part.over, ...(n ? {} : g.over)};
      const file = join(RAW, `${g.card}-${n}.png`);
      if (await capture(cc, s, file, g.vw)) shots.push(file);
    }
    for (const id of demo) await hass((h, i) => h.callWS({type: 'nova_homeverse/shopping/item_delete', item_id: i}), id);
    if (shots.length !== (g.parts || [{}]).length) continue;
    await tile(shots, g.mode || 'fit', join(DOCS, 'gallery', `${g.card}.webp`));
    log('  ✓ gallery/' + g.card + '.webp');
  }

  if (!flag('no-hero') && !only) {
    await page.setViewportSize({width: HERO.vw, height: HEIGHT});
    await open(HERO.view);
    const loc = page.locator('hui-sections-view hui-section').nth(HERO.sec);
    const clip = await clipOf(loc, 12);
    const f = join(RAW, 'hero.png');
    await page.screenshot({path: f, clip});
    await tile([f], 'fit', join(DOCS, 'themes', 'hero-blue.webp'), {w: HERO.w, h: HERO.h});
    await page.setViewportSize({width: WIDTH, height: HEIGHT});
    log('  ✓ themes/hero-blue.webp');
  }

  if (!flag('no-compare') && !only) {
    // Theme-Vergleich: Lichter neutralweiß (warmweiß färbt Midnight bräunlich), Zustand vorher sichern und danach
    // wiederherstellen; je Theme auf seinem eigenen ruhigen Hintergrund
    const lights = COMPARE.lights || [];
    await call('scene.create', null, {scene_id: 'nova_galerie_vorher', snapshot_entities: lights});
    for (const l of lights) await call('light.turn_on', l, {color_temp_kelvin: COMPARE.kelvin, brightness_pct: 70});
    await sleep(800);
    try {
      for (const [k, sec] of Object.entries(COMPARE.sections)) {
        await setTheme(k);
        bg = BG[k];
        await open(COMPARE.view);
        const loc = page.locator('hui-sections-view hui-section').nth(sec);
        const clip = await clipOf(loc, 16);
        if (!clip) { problems.push(`Theme-Vergleich ${k}: Abschnitt leer`); continue; }
        const f = join(RAW, `compare-${k}.png`);
        await page.screenshot({path: f, clip});
        await tile([f], 'fit', join(DOCS, 'themes', `compare-${THEMES[k]}.webp`), {w: 600, h: 380, color: BG[k]});
        log(`  ✓ themes/compare-${THEMES[k]}.webp`);
      }
    } finally {
      await call('scene.turn_on', 'scene.nova_galerie_vorher');
    }
  }
} finally {
  if (before) await setTheme(before).catch(e => log('! Theme zurück:', e.message));
  await browser.close();
  if (!flag('keep')) for (const f of ['png']) execFileSync('find', [join(DOCS, 'gallery'), join(DOCS, 'themes'), '-name', `*.${f}`, '-delete']);
}
if (problems.length) { log(`\n${problems.length} Probleme:`); for (const p of problems) log('  -', p); process.exitCode = 2; }
