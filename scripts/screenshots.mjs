/* Echte Screenshots aller Karten aus HA Dev (Dashboard „Nova Showcase“) für README und docs/.
   Aufruf: npm run screenshots [-- --only room,light] [-- --themes blau,hell] [-- --no-gif] [-- --no-editor]
           [-- --no-hero] [-- --hero] [-- --optimize] [-- --publish-only]
   Zwei Stufen:
     1. Aufnahme: alles (alle Themes, Zustände, Editoren, GIFs, Hero) als PNG/GIF nach screenshots/ (gitignored).
     2. Veröffentlichen: nur der schlanke Satz als WebP nach ../nova-integration/docs/images/ (Handbuch) – je Karte alle Zustände in
        Nova Blau, das Editor-Bild und bei animierten Karten ein animiertes WebP; dazu Hero (Blau) und Theme-Vergleich.
        „--publish-only“ macht nur diesen Schritt aus dem vorhandenen screenshots/.
   Braucht .env im Repo-Root (gitignored):
     HA_URL=http://192.168.178.84
     HA_TOKEN=<Long-Lived-Token>
   Werkzeuge: Playwright (devDependency), ffmpeg, gifsicle, webp (cwebp, img2webp), optional oxipng
   (brew install ffmpeg gifsicle webp oxipng).
   Das globale Nova-Theme und alle Demo-Entitäten, die das Skript umstellt, werden am Ende zurückgestellt. */
import {chromium} from 'playwright';
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, rmSync, writeFileSync, readdirSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';
import {CARDS, COMPARE, DASHBOARD, HERO, THEMES} from './screenshots.config.mjs';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'screenshots');       // kompletter Satz, gitignored
// Schlanker Satz (WebP) fürs Handbuch in nova-integration (Repo daneben), anders per NOVA_DOCS in der .env
let DOCS = join(ROOT, '../nova-integration/docs/images');
const WEBP_Q = 85;
const TMP = join(ROOT, 'scripts/.screenshots-tmp');
const WIDTH = 1280, HEIGHT = 900, PAD = 12;   // einheitliche Breite: Sections-Ansicht bei 1280 px
const SETTLE = 2500;                           // Animationen einschwingen lassen
const GIF_SECONDS = 4, GIF_FPS = 12, GIF_WIDTH = 480;

// ---------- Argumente und .env ----------
const args = process.argv.slice(2);
const flag = n => args.includes(`--${n}`);
const opt = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const only = opt('only')?.split(',');
const themeKeys = opt('themes')?.split(',') || Object.keys(THEMES);

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
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log(...a);
const problems = [];      // fehlende Karten, kaputte Seiten → am Ende melden, nicht faken
const written = [];

const problems0 = [];
// ---------- Veröffentlichen: schlanker Satz als WebP fürs Handbuch ----------
function publish(problems) {
  // Nur die eigenen Ordner leeren – ui/ gehört screenshots-ui.mjs
  for (const d of [...CARDS.map(c => c.card), 'themes']) rmSync(join(DOCS, d), {recursive: true, force: true});
  const done = [];
  const webp = (src, dst) => {
    if (!existsSync(src)) { problems.push(`Veröffentlichen: ${src.replace(ROOT + '/', '')} fehlt`); return; }
    mkdirSync(dirname(dst), {recursive: true});
    if (src.endsWith('.webp')) writeFileSync(dst, readFileSync(src));
    else execFileSync('cwebp', ['-quiet', '-q', String(WEBP_Q), '-m', '6', '-metadata', 'none', src, '-o', dst]);
    done.push(dst);
  };
  const blue = THEMES.blau;
  for (const c of CARDS) {
    const name = st => `${c.card}-${blue}-${st}`;
    for (const s of c.states) webp(join(OUT, c.card, name(s.state) + '.png'), join(DOCS, c.card, name(s.state) + '.webp'));
    webp(join(OUT, c.card, name('editor') + '.png'), join(DOCS, c.card, name('editor') + '.webp'));
    for (const g of [c.gif || []].flat())
      webp(join(OUT, c.card, name(g.state) + '-anim.webp'), join(DOCS, c.card, name(g.state) + '-anim.webp'));
  }
  webp(join(OUT, 'themes', `hero-${blue}.png`), join(DOCS, 'themes', `hero-${blue}.webp`));
  for (const k of Object.keys(COMPARE.sections))
    webp(join(OUT, 'themes', `compare-${THEMES[k]}.png`), join(DOCS, 'themes', `compare-${THEMES[k]}.webp`));
  const bytes = done.reduce((n, f) => n + readFileSync(f).length, 0);
  log(`\nVeröffentlicht: ${done.length} WebP in ${DOCS} (${(bytes / 1024 / 1024).toFixed(1)} MB).`);
}

const {url: HA, token: TOKEN} = env();   // liest auch NOVA_DOCS
if (flag('publish-only')) {
  publish(problems0);
  for (const p of problems0) log('  -', p);
  process.exit(problems0.length ? 2 : 0);
}

// ---------- Browser ----------
const browser = await chromium.launch();
const context = await browser.newContext({viewport: {width: WIDTH, height: HEIGHT}, deviceScaleFactor: 2, locale: 'de-DE',
  colorScheme: 'dark'});
// Anmeldung per Long-Lived-Token: das Frontend liest hassTokens aus dem localStorage
await context.addInitScript(([hassUrl, token]) => {
  try {
    localStorage.setItem('hassTokens', JSON.stringify({hassUrl, clientId: `${hassUrl}/`, access_token: token,
      token_type: 'Bearer', expires_in: 1e9, expires: Date.now() + 1e12, refresh_token: ''}));
    localStorage.setItem('dockedSidebar', '"docked"');
  } catch { /* egal */ }
}, [HA, TOKEN]);
const page = await context.newPage();
// Hart neu laden: Cache für alle Anfragen aus
const cdp = await context.newCDPSession(page);
await cdp.send('Network.setCacheDisabled', {cacheDisabled: true});
page.on('pageerror', e => log('  ! Seitenfehler:', e.message.split('\n')[0]));

const hass = (fn, arg) => page.evaluate(([f, a]) => {
  const h = document.querySelector('home-assistant')?.hass;
  if (!h) throw new Error('kein hass');
  return new Function('h', 'a', `return (${f})(h, a);`)(h, a);
}, [fn.toString(), arg]);

async function open(view, hash = '') {
  await page.goto(`${HA}/${DASHBOARD}/${view}${hash ? '#' + hash : ''}`, {waitUntil: 'load'});
  await page.waitForFunction(() => document.querySelector('home-assistant')?.hass?.connected !== false
    && document.querySelector('home-assistant')?.hass?.states, null, {timeout: 30000});
  await page.locator('hui-view').first().waitFor({timeout: 30000});
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(SETTLE);
  // Überschriften der Abschnitte ausblenden, damit im Rand um die Karte kein Text angeschnitten wird
  await page.evaluate(() => {
    const walk = n => { for (const el of n.querySelectorAll('*')) {
      if (el.localName === 'hui-heading-card') el.style.opacity = '0';
      if (el.shadowRoot) walk(el.shadowRoot);
    } };
    walk(document);
  });
}

// ---------- Zustand sichern / zurückstellen ----------
const touched = new Set(CARDS.flatMap(c => c.states.flatMap(s => (s.set || []).map(x => x.entity))));
let saved;
async function snapshot() {
  saved = await hass((h, ids) => {
    const r = {};
    for (const id of ids) { const s = h.states[id]; if (s) r[id] = {state: s.state, attributes: s.attributes}; }
    r.__theme = h.states['input_select.nova_theme']?.state;
    return r;
  }, [...touched]);
  // Theme aus der Integration (falls aktiv)
  saved.__novaTheme = await page.evaluate(() => new Promise(res => {
    const c = document.querySelector('home-assistant')?.hass?.connection;
    if (!c) return res(undefined);
    let unsub; const t = setTimeout(() => res(undefined), 3000);
    c.subscribeMessage(m => { clearTimeout(t); res(m?.theme); unsub?.then(u => u()); }, {type: 'nova/theme/subscribe'})
      .then(u => { unsub = Promise.resolve(u); }).catch(() => { clearTimeout(t); res(undefined); });
  }));
  log('Gesichert: Theme', saved.__novaTheme || saved.__theme, '+', Object.keys(saved).length - 2, 'Entitäten');
}
async function restore() {
  if (!saved) return;
  await setTheme(saved.__novaTheme || {'Nova Blau': 'blau', 'Nova Hell': 'hell', 'Nova Midnight': 'midnight',
    'Nova Velvet': 'velvet'}[saved.__theme] || 'blau').catch(e => log('  ! Theme zurück:', e.message));
  for (const [id, s] of Object.entries(saved)) {
    if (id.startsWith('__')) continue;
    const d = id.split('.')[0];
    const call = d === 'input_select' ? ['input_select', 'select_option', {option: s.state}]
      : d === 'timer' ? (s.state === 'idle' ? ['timer', 'cancel', {}] : null)
      : ['on', 'off'].includes(s.state) ? ['homeassistant', s.state === 'on' ? 'turn_on' : 'turn_off', {}] : null;
    if (call) await hass((h, [dom, svc, data, entity_id]) => h.callService(dom, svc, {...data, entity_id}), [...call, id])
      .catch(e => log('  ! zurück', id, e.message));
  }
  log('Demo-Zustand und Theme zurückgestellt.');
}

async function setTheme(key) {
  await hass(async (h, k) => {
    try { await h.callWS({type: 'nova/theme/set', theme: k}); return; } catch { /* ohne Integration: Helfer */ }
    const names = {blau: 'Nova Blau', hell: 'Nova Hell', midnight: 'Nova Midnight', velvet: 'Nova Velvet'};
    await h.callService('input_select', 'select_option', {option: names[k]}, {entity_id: 'input_select.nova_theme'});
  }, key);
  await sleep(800);
}

async function applySet(list = []) {
  for (const x of list) {
    const [dom, svc] = x.service.split('.');
    await hass((h, [d, s, data, entity_id]) => h.callService(d, s, {...(data || {}), entity_id}), [dom, svc, x.data, x.entity]);
  }
  if (list.length) await sleep(1500);
}

// ---------- Karten finden und aufnehmen ----------
const prefix = c => (c.dev ? 'nova-dev-' : 'nova-');
function cardLocator(c, s) {
  const type = prefix(c) + (s.type || c.type);
  // Abschnitte der Sections-Ansicht in Reihenfolge; Nova-Karte darin (Playwright durchsucht offene Shadow-Roots)
  return page.locator('hui-sections-view hui-section').nth(s.sec).locator(type).nth(s.idx || 0);
}

async function clipOf(loc) {
  await loc.scrollIntoViewIfNeeded({timeout: 5000});
  await sleep(600);
  const b = await loc.boundingBox();
  if (!b || b.width < 10 || b.height < 10) return null;
  const vp = page.viewportSize();
  // Karte höher als das Fenster: Fenster vergrößern
  if (b.height + 2 * PAD > vp.height) {
    await page.setViewportSize({width: WIDTH, height: Math.ceil(b.height + 4 * PAD + 120)});
    await sleep(800);
    await loc.scrollIntoViewIfNeeded();
    return clipOf(loc);
  }
  return {x: Math.max(0, b.x - PAD), y: Math.max(0, b.y - PAD), width: b.width + 2 * PAD, height: b.height + 2 * PAD};
}

// Fest positionierte Leiste in der Karte (Nova Navi unten/oben): die Karte selbst ist nur ein Platzhalter
async function fixedClip(loc) {
  const r = await loc.evaluate(el => {
    for (const k of el.shadowRoot?.querySelectorAll('*') || []) {
      if (getComputedStyle(k).position !== 'fixed') continue;
      const b = k.getBoundingClientRect();
      if (b.width > 40 && b.height > 20) return {x: b.left, y: b.top, width: b.width, height: b.height};
    }
    return null;
  });
  return r && {x: Math.max(0, r.x - PAD), y: Math.max(0, r.y - PAD), width: r.width + 2 * PAD,
    height: Math.min(r.height + 2 * PAD, HEIGHT - Math.max(0, r.y - PAD))};
}

// Inhaltsbereich (ohne Seitenleiste und Kopfzeile)
async function contentClip() {
  return page.evaluate(() => {
    const main = document.querySelector('home-assistant')?.shadowRoot?.querySelector('home-assistant-main');
    const ppr = main?.shadowRoot?.querySelector('partial-panel-resolver');
    const r = ppr?.getBoundingClientRect();
    const root = ppr?.querySelector('ha-panel-lovelace')?.shadowRoot?.querySelector('hui-root');
    const head = root?.shadowRoot?.querySelector('.header, .toolbar, app-header');
    const top = head ? head.getBoundingClientRect().bottom : (r?.top || 0);
    return r && {x: r.left, y: top, width: r.width, height: window.innerHeight - top};
  });
}

function out(card, theme, state, ext = 'png') {
  const dir = join(OUT, card);
  mkdirSync(dir, {recursive: true});
  return join(dir, `${card}-${theme}-${state}.${ext}`);
}

async function shoot(file, clip) {
  await page.screenshot({path: file, clip, animations: 'allow'});
  written.push(file);
  log('  ✓', file.replace(ROOT + '/', ''));
}

async function captureState(c, s, theme) {
  await page.setViewportSize({width: WIDTH, height: HEIGHT});
  await applySet(s.set);
  await open(c.view, s.hash);
  if (s.area === 'view') {
    if (s.hash) await sleep(1200);
    return shoot(out(c.card, THEMES[theme], s.state), await contentClip());
  }
  const loc = cardLocator(c, s);
  if (!await loc.count()) { problems.push(`${c.card}/${s.state}: Karte ${prefix(c)}${s.type || c.type} in „${c.view}“ Abschnitt ${s.sec} nicht gefunden`); return; }
  const clip = s.fixed ? await fixedClip(loc) : await clipOf(loc);
  if (!clip) { problems.push(`${c.card}/${s.state}: Karte ist leer oder unsichtbar („${c.view}“, Abschnitt ${s.sec})`); return; }
  await shoot(out(c.card, THEMES[theme], s.state), clip);
}

// Grafischer Editor: Bearbeiten-Modus, Karte anklicken → HA-Dialog „Karte bearbeiten“, Bild vom Dialog, dann abbrechen
async function captureEditor(c) {
  const s = c.editor || c.states.find(x => x.sec !== undefined);
  if (!s) { problems.push(`${c.card}/editor: keine Karte im Showcase für den Editor`); return; }
  await page.setViewportSize({width: WIDTH, height: HEIGHT});
  await page.goto(`${HA}/${DASHBOARD}/${c.view}?edit=1`, {waitUntil: 'load'});
  await page.locator('hui-view').first().waitFor({timeout: 30000});
  await sleep(SETTLE);
  const card = cardLocator(c, s);
  if (!await card.count()) { problems.push(`${c.card}/editor: Karte im Bearbeiten-Modus nicht gefunden`); return; }
  await card.scrollIntoViewIfNeeded();
  await sleep(400);
  // Im Bearbeiten-Modus fängt hui-card-edit-mode die Klicks ab – Klick auf die Kartenmitte öffnet den Dialog
  const bb = await card.boundingBox();
  await page.mouse.click(bb.x + bb.width / 2, Math.max(bb.y + 20, Math.min(bb.y + bb.height / 2, HEIGHT - 40)));
  const editor = page.locator(prefix(c) + (s.type || c.type) + '-editor').first();
  try { await editor.waitFor({timeout: 15000}); } catch {
    problems.push(`${c.card}/editor: Editor ${prefix(c)}${s.type || c.type}-editor öffnet nicht`);
    await page.keyboard.press('Escape'); return;
  }
  await sleep(2000);
  // Ganzer Dialog „Karte bearbeiten“ (Editor links, Vorschau rechts): das <dialog> im Schattenbaum von ha-dialog/wa-dialog
  const box = await page.evaluate(() => {
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
  if (!box) { problems.push(`${c.card}/editor: Dialog nicht gefunden`); await page.keyboard.press('Escape'); return; }
  await shoot(out(c.card, THEMES.blau, 'editor'), {x: Math.max(0, box.x - PAD), y: Math.max(0, box.y - PAD),
    width: box.width + 2 * PAD, height: Math.min(box.height + 2 * PAD, HEIGHT - Math.max(0, box.y - PAD))});
  // Abbrechen, nichts speichern
  await page.keyboard.press('Escape');
  await sleep(600);
}

// Animation: Einzelbilder aus dem Bildausschnitt (1×) → animiertes WebP (img2webp, fürs Repo) und GIF (ffmpeg mit
// Palette, gifsicle; nur im kompletten Satz)
async function captureGif(c, s, before) {
  await page.setViewportSize({width: WIDTH, height: HEIGHT});
  await applySet(s.set);
  const g = s.gif || {};
  const hashFirst = s.area === 'view' && s.hash;
  await open(c.view, hashFirst ? '' : s.hash);
  let clip;
  if (s.area === 'view' || g.area === 'view') clip = await contentClip();
  else { const loc = cardLocator(c, s); if (!await loc.count()) return; clip = s.fixed ? await fixedClip(loc) : await clipOf(loc); }
  if (!clip) return;
  const dir = join(TMP, `${c.card}-${s.state}`);
  rmSync(dir, {recursive: true, force: true}); mkdirSync(dir, {recursive: true});
  const n = GIF_SECONDS * GIF_FPS, t0 = Date.now();
  let opened = false;
  for (let i = 0; i < n; i++) {
    if (hashFirst && !opened && i === 3) { opened = true; await page.evaluate(h => { location.hash = h; }, s.hash); }
    if (g.click && !opened && i === 3) { opened = true; await cardLocator(c, s).locator(g.click).first().click(); }
    await page.screenshot({path: join(dir, `f${String(i).padStart(3, '0')}.png`), clip, scale: 'css', animations: 'allow'});
    const wait = t0 + (i + 1) * (1000 / GIF_FPS) - Date.now();
    if (wait > 0) await sleep(wait);
  }
  const real = n / ((Date.now() - t0) / 1000);   // tatsächliche Bildrate (Aufnahme kann langsamer sein)
  const file = out(c.card, THEMES.blau, s.state, 'gif');
  const scale = `fps=${Math.min(GIF_FPS, real).toFixed(2)},scale=${Math.min(GIF_WIDTH, Math.round(clip.width))}:-1:flags=lanczos`;
  execFileSync('ffmpeg', ['-y', '-loglevel', 'error', '-framerate', real.toFixed(2), '-i', join(dir, 'f%03d.png'),
    '-vf', `${scale},split[a][b];[a]palettegen=max_colors=128:stats_mode=diff[p];[b][p]paletteuse=dither=bayer:bayer_scale=4:diff_mode=rectangle`,
    '-loop', '0', file]);
  const frames = readdirSync(dir).filter(f => f.endsWith('.png')).sort().map(f => join(dir, f));
  const anim = out(c.card, THEMES.blau, s.state + '-anim', 'webp');
  execFileSync('img2webp', ['-loop', '0', '-lossy', '-q', '75', '-m', '6', '-d', String(Math.round(1000 / real)), ...frames, '-o', anim]);
  rmSync(dir, {recursive: true, force: true});
  written.push(file);
  log('  ✓', file.replace(ROOT + '/', ''), '+ WebP', `(${real.toFixed(1)} fps)`);
}

// ---------- Ablauf ----------
const cards = CARDS.filter(c => !only || only.includes(c.card));
try {
  await open(HERO.view);
  await snapshot();
  // Dev-Ansichten: kommen die Dev-Karten überhaupt an?
  const devLoaded = await page.evaluate(() => !!customElements.get('nova-dev-area-card'));
  if (!devLoaded && cards.some(c => c.dev)) problems.push('Dev-Build (nova-dev-*) ist in HA Dev nicht geladen');

  for (const theme of themeKeys) {
    log(`\n=== Theme ${theme} ===`);
    await setTheme(theme);
    if (!flag('no-hero') && (!only || flag('hero'))) {
      await page.setViewportSize({width: WIDTH, height: HEIGHT});
      await open(HERO.view);
      mkdirSync(join(OUT, 'themes'), {recursive: true});
      await shoot(join(OUT, 'themes', `hero-${THEMES[theme]}.png`), await contentClip());
      // Theme-Vergleich: Abschnitt mit fest eingestelltem Theme (unabhängig vom globalen) – nur einmal nötig
      if (theme === themeKeys[0]) {
        await open(COMPARE.view);
        for (const [k, sec] of Object.entries(COMPARE.sections)) {
          const loc = page.locator('hui-sections-view hui-section').nth(sec);
          const clip = await clipOf(loc);
          if (clip) await shoot(join(OUT, 'themes', `compare-${THEMES[k]}.png`), clip);
          else problems.push(`Theme-Vergleich ${k}: Abschnitt ${sec} leer`);
        }
      }
    }
    for (const c of cards) {
      log(`- ${c.card}`);
      for (const s of c.states) {
        try { await captureState(c, s, theme); }
        catch (e) { problems.push(`${c.card}/${s.state}/${theme}: ${e.message.split('\n')[0]}`); }
      }
    }
  }

  await setTheme('blau');
  if (!flag('no-editor')) {
    log('\n=== Editoren ===');
    for (const c of cards) {
      try { await captureEditor(c); } catch (e) { problems.push(`${c.card}/editor: ${e.message.split('\n')[0]}`); await page.keyboard.press('Escape').catch(() => {}); }
    }
  }
  if (!flag('no-gif')) {
    log('\n=== GIFs ===');
    for (const c of cards) for (const g of [c.gif || []].flat()) {
      const s = {...c.states.find(x => x.state === g.state), gif: g};
      try { await captureGif(c, s); } catch (e) { problems.push(`${c.card}/${g.state}.gif: ${e.message.split('\n')[0]}`); }
    }
  }
} finally {
  await restore().catch(e => log('! Zurückstellen fehlgeschlagen:', e.message));
  await browser.close();
  rmSync(TMP, {recursive: true, force: true});
}

// ---------- Optimieren (kompletter Satz) ----------
const pngs = written.filter(f => f.endsWith('.png')), gifs = written.filter(f => f.endsWith('.gif'));
for (const g of gifs) execFileSync('gifsicle', ['-O3', '--lossy=60', '--colors', '128', '-b', g]);
if (flag('optimize')) {
  log(`\nOptimiere ${pngs.length} PNG …`);
  for (let i = 0; i < pngs.length; i += 40) execFileSync('oxipng', ['-o', '3', '--strip', 'safe', '-q', ...pngs.slice(i, i + 40)]);
}
log(`\nAufgenommen: ${written.length} Bilder in screenshots/.`);
publish(problems);
if (problems.length) {
  log(`\n${problems.length} Probleme (nicht gefaket):`);
  for (const p of problems) log('  -', p);
  process.exitCode = 2;
}
