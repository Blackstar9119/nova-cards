/* Echte Screenshots der Home-Assistant-Oberfläche für das Nova-Handbuch (nova-homeverse/docs):
   Marketplace, Integration hinzufügen, Nova-Panel, erstes Dashboard, erste Karte.
   Aufruf: npm run screenshots:ui [-- --only marketplace,panel] [-- --publish-only]
   Wie screenshots.mjs: .env mit HA_URL und HA_TOKEN im Repo-Root, Aufnahme als PNG nach screenshots/ui (gitignored),
   veröffentlicht als WebP nach <NOVA_DOCS>/ui (Standard: ../nova-homeverse/docs/images).
   Nichts wird dauerhaft verändert: Dialoge werden nur geöffnet und wieder geschlossen, nichts wird heruntergeladen
   oder eingerichtet. Ausnahme: das Beispiel-Dashboard „Mein Zuhause“ wird angelegt und am Ende wieder gelöscht,
   das globale Nova-Theme wird zurückgestellt. Die Entwicklungs-Ressource (nova-dev-cards.js) wird blockiert, damit
   die Kartenauswahl so aussieht wie bei normalen Nutzern.
   Ein rotes Rechteck markiert, wohin man klicken soll. */
import {chromium} from 'playwright';
import {execFileSync} from 'node:child_process';
import {existsSync, mkdirSync, readFileSync, rmSync} from 'node:fs';
import {dirname, join, resolve} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const OUT = join(ROOT, 'screenshots/ui');
const WIDTH = 1280, HEIGHT = 800, WEBP_Q = 82;
const DASH = {title: 'Mein Zuhause', url: 'mein-zuhause', icon: 'mdi:home-heart'};

const args = process.argv.slice(2);
const flag = n => args.includes(`--${n}`);
const opt = n => { const i = args.indexOf(`--${n}`); return i >= 0 ? args[i + 1] : undefined; };
const only = opt('only')?.split(',');
const sleep = ms => new Promise(r => setTimeout(r, ms));
const log = (...a) => console.log(...a);

function env() {
  const f = join(ROOT, '.env');
  const vars = {...process.env};
  if (existsSync(f)) for (const l of readFileSync(f, 'utf8').split('\n')) {
    const m = l.match(/^\s*([A-Z_]+)\s*=\s*(.*?)\s*$/);
    if (m) vars[m[1]] = m[2].replace(/^["']|["']$/g, '');
  }
  if (!vars.HA_URL || !vars.HA_TOKEN) { console.error('HA_URL und HA_TOKEN fehlen (.env im Repo-Root).'); process.exit(1); }
  return {url: vars.HA_URL.replace(/\/$/, ''), token: vars.HA_TOKEN, docs: vars.NOVA_DOCS};
}
const {url: HA, token: TOKEN, docs} = env();
const DOCS = join(resolve(ROOT, docs || '../nova-homeverse/docs/images'), 'ui');

const problems = [];
const shots = [];

function publish() {
  rmSync(DOCS, {recursive: true, force: true});
  mkdirSync(DOCS, {recursive: true});
  let bytes = 0, n = 0;
  for (const f of execFileSync('ls', [OUT]).toString().split('\n').filter(x => x.endsWith('.png'))) {
    const dst = join(DOCS, f.replace(/\.png$/, '.webp'));
    execFileSync('cwebp', ['-quiet', '-q', String(WEBP_Q), '-m', '6', '-metadata', 'none', join(OUT, f), '-o', dst]);
    bytes += readFileSync(dst).length; n++;
  }
  log(`Veröffentlicht: ${n} WebP nach ${DOCS} (${(bytes / 1024 / 1024).toFixed(1)} MB).`);
}
if (flag('publish-only')) { publish(); process.exit(0); }

mkdirSync(OUT, {recursive: true});
const browser = await chromium.launch();
const context = await browser.newContext({viewport: {width: WIDTH, height: HEIGHT}, deviceScaleFactor: 2, locale: 'de-DE',
  colorScheme: 'dark'});
await context.addInitScript(([hassUrl, token]) => {
  try {
    localStorage.setItem('hassTokens', JSON.stringify({hassUrl, clientId: `${hassUrl}/`, access_token: token,
      token_type: 'Bearer', expires_in: 1e9, expires: Date.now() + 1e12, refresh_token: ''}));
    localStorage.setItem('dockedSidebar', '"docked"');
  } catch { /* egal */ }
}, [HA, TOKEN]);
const page = await context.newPage();
await page.route('**/nova-dev-cards.js', r => r.abort());   // Dev-Karten sieht ein normaler Nutzer nicht
page.on('pageerror', e => log('  ! Seitenfehler:', e.message.split('\n')[0]));

const hass = (fn, arg) => page.evaluate(([f, a]) => {
  const h = document.querySelector('home-assistant')?.hass;
  if (!h) throw new Error('kein hass');
  return new Function('h', 'a', `return (${f})(h, a);`)(h, a);
}, [fn.toString(), arg]);

async function go(path) {
  await page.goto(HA + path, {waitUntil: 'load'});
  await page.waitForFunction(() => document.querySelector('home-assistant')?.hass?.states, null, {timeout: 30000});
  await page.waitForLoadState('networkidle').catch(() => {});
  await sleep(2500);
}
// Markierung: Rahmen um das Element, auf das man klicken soll. Wird nach der Aufnahme ins Bild gezeichnet
// (ein Overlay im DOM läge unter Dialogen, die HA in der obersten Ebene öffnet).
let marks = [];
async function mark(locator, pad = 6) {
  const b = await locator.boundingBox();
  if (!b) throw new Error('Markierung: Element nicht sichtbar');
  markBox(b.x - pad, b.y - pad, b.width + 2 * pad, b.height + 2 * pad);
}
const markBox = (x, y, w, h) => marks.push({x, y, w, h});
const unmark = () => { marks = []; };
// Erstes sichtbares Element eines Locators, dessen Mitte in einem Bereich liegt (für mehrdeutige Texte wie „Nova“)
async function within(locator, test) {
  for (const el of await locator.all()) {
    const b = await el.boundingBox().catch(() => null);
    if (b && b.width && test(b.x + b.width / 2, b.y + b.height / 2)) return el;
  }
  throw new Error('kein passendes sichtbares Element');
}
async function shot(name) {
  await page.mouse.move(WIDTH / 2, HEIGHT - 4);   // keine Tooltips vom letzten Klick
  await sleep(1200);
  const f = join(OUT, `${name}.png`);
  await page.screenshot({path: f});
  if (marks.length) {
    const s = 2;   // deviceScaleFactor
    const boxes = marks.map(m => [Math.round(m.x * s), Math.round(m.y * s), Math.round(m.w * s), Math.round(m.h * s)]);
    const vf = boxes.flatMap(([x, y, w, h]) => [
      `drawbox=x=${x - 4}:y=${y - 4}:w=${w + 8}:h=${h + 8}:color=0xff3b30@0.35:t=4`,
      `drawbox=x=${x}:y=${y}:w=${w}:h=${h}:color=0xff3b30:t=6`]).join(',');
    const tmp = f.replace(/\.png$/, '.tmp.png');
    execFileSync('ffmpeg', ['-loglevel', 'error', '-y', '-i', f, '-vf', vf, tmp]);
    execFileSync('mv', [tmp, f]);
  }
  shots.push(name);
  log('  ✓', name);
  await unmark();
}
async function step(name, fn) {
  try { await fn(); } catch (e) { problems.push(`${name}: ${e.message.split('\n')[0]}`); log('  ✗', name, e.message.split('\n')[0]); await unmark(); }
}

async function themeNow() {
  return page.evaluate(() => new Promise(res => {
    const c = document.querySelector('home-assistant').hass.connection;
    const t = setTimeout(() => res(undefined), 4000);
    c.subscribeMessage(m => { clearTimeout(t); res(m?.theme); }, {type: 'nova_homeverse/theme/subscribe'}).catch(() => res(undefined));
  }));
}
const setTheme = k => hass((h, t) => h.callWS({type: 'nova_homeverse/theme/set', theme: t}), k);
async function deleteDashboard() {
  await hass(async (h, u) => {
    const list = await h.callWS({type: 'lovelace/dashboards/list'});
    const d = list.find(x => x.url_path === u);
    if (d) await h.callWS({type: 'lovelace/dashboards/delete', dashboard_id: d.id});
  }, DASH.url);
}

const want = g => !only || only.includes(g);
await go('/config/dashboard');
const oldTheme = await themeNow();
log('Theme vorher:', oldTheme);
await deleteDashboard();   // Rest eines abgebrochenen Laufs, sonst steht es schon in der Seitenleiste

// ---------- Kapitel 2: Installation ----------
if (want('marketplace')) {
  log('Marketplace');
  await step('einstellungen', async () => {
    await go('/config/dashboard');
    await mark(page.getByText('Marketplace', {exact: true}).first(), 10);
    await shot('install-01-einstellungen');
  });
  await step('marketplace', async () => {
    await go('/marketplace/browse');
    await mark(page.getByRole('button', {name: /Über Link hinzufügen/}));
    await shot('install-02-marketplace');
  });
  await step('link', async () => {
    await page.getByRole('button', {name: /Über Link hinzufügen/}).click();
    await sleep(1500);
    await page.getByRole('textbox', {name: /GitHub-Link/}).fill('https://github.com/Blackstar9119/nova-homeverse');
    await sleep(500);
    await mark(page.getByRole('button', {name: 'Hinzufügen', exact: true}));
    await shot('install-03-link');
    await page.keyboard.press('Escape');   // nicht hinzufügen – ist schon drin
  });
  await step('suche', async () => {
    await go('/marketplace/browse');
    await page.getByPlaceholder(/durchsuchen/).fill('Nova');
    await sleep(1500);
    await mark(page.getByText('Nova Integration for Home Assistant').first(), 10);
    await shot('install-04-suche');
  });
  await step('repo', async () => {
    await page.getByText('Nova Integration for Home Assistant').first().click();
    await sleep(2500);
    const btn = page.getByRole('button', {name: /Herunterladen|Aktualisieren|Erneut herunterladen/}).first();
    if (await btn.count()) await mark(btn);
    await shot('install-05-nova');
  });
  await step('neustart', async () => {
    await go('/config/dashboard');
    const rep = page.getByText('Neustart für Nova erforderlich').first();
    if (!await rep.count()) throw new Error('kein ausstehender Neustart – Bild nur aufnehmbar, solange Nova auf einen Neustart wartet');
    await mark(rep, 10);
    await shot('install-06-reparatur');
    await rep.click();
    await sleep(1500);
    await mark(await within(page.getByRole('button', {name: 'Neu starten'}), () => true));
    await shot('install-07-neustart');
    await page.keyboard.press('Escape');   // nicht wirklich neu starten
  });
}

if (want('integration')) {
  log('Integration');
  await step('integrationen', async () => {
    // Suchfeld auf „Nova“: blendet die bei dir entdeckten Geräte (Namen, IP-Adressen) aus
    await go('/config/integrations/dashboard?search=Nova');
    await mark(page.getByRole('button', {name: 'Integration hinzufügen'}));
    await shot('install-08-integrationen');
  });
  await step('hinzufuegen', async () => {
    await page.getByRole('button', {name: 'Integration hinzufügen'}).click();
    await sleep(1500);
    await page.keyboard.type('Nova', {delay: 50});
    await sleep(1500);
    await mark(await within(page.getByText('Nova', {exact: true}), (x, y) => x < 900 && y > 200 && y < 300), 10);
    await shot('install-09-nova-suchen');
    await page.keyboard.press('Escape');   // Nova ist hier schon eingerichtet
  });
  await step('nova-homeverse', async () => {
    await go('/config/integrations/integration/nova');
    await mark(page.getByRole('button', {name: /Konfigurieren|Optionen/}).first());
    await shot('install-10-nova-homeverse');
  });
  await step('module', async () => {
    await page.getByRole('button', {name: /Konfigurieren|Optionen/}).first().click();
    await sleep(2000);
    await shot('install-11-module');
    await page.keyboard.press('Escape');   // nichts ändern
  });
}

// ---------- Kapitel 3: Erste Schritte ----------
if (want('panel')) {
  log('Nova-Panel');
  await step('panel', async () => {
    await go('/nova');
    await mark(await within(page.getByText('Nova', {exact: true}), x => x < 250), 8);
    await shot('start-01-panel');
  });
  await step('theme', async () => {
    await setTheme('midnight');
    await go('/nova');
    const blau = page.getByText('Blau', {exact: true}).first();
    await mark(blau, 40);
    await shot('start-02-theme');
    await blau.click();
    await sleep(2000);
    await shot('start-03-theme-blau');
  });
}

if (want('dashboard')) {
  log('Dashboard');
  await setTheme('blau');
  await step('dashboards', async () => {
    await go('/config/lovelace/dashboards');
    await mark(page.getByRole('button', {name: /Dashboard hinzufügen/}));
    await shot('start-04-dashboards');
  });
  await step('dashboard-art', async () => {
    await page.getByRole('button', {name: /Dashboard hinzufügen/}).click();
    await sleep(1500);
    await mark(page.getByText('Neues Dashboard von Grund auf').first(), 12);
    await shot('start-05-dashboard-art');
  });
  await step('dashboard-form', async () => {
    await page.getByText('Neues Dashboard von Grund auf').first().click();
    await sleep(1500);
    await page.getByRole('textbox', {name: /Titel/}).first().click()
      .catch(() => page.mouse.click(WIDTH / 2, 160));
    await page.keyboard.type(DASH.title, {delay: 30});
    await page.getByRole('combobox', {name: /Seitenleistensymbol/}).first().click()
      .catch(() => page.mouse.click(WIDTH / 2, 268));
    await sleep(500);
    await page.keyboard.type(DASH.icon, {delay: 30});
    await sleep(800);
    await page.keyboard.press('Enter');
    await page.getByText('Neues Dashboard hinzufügen').click();   // Liste schließen
    const create = page.getByRole('button', {name: 'Erstellen', exact: true}).last();
    log('    Erstellen:', await create.boundingBox());
    await mark(create);
    await shot('start-06-dashboard-anlegen');
    await create.click();
    await sleep(2000);
    await mark(page.locator('ha-sidebar').getByText(DASH.title).first(), 2);
    await shot('start-07-dashboard-seitenleiste');
  });
  await step('bearbeiten', async () => {
    await go(`/${DASH.url}`);
    await mark(page.getByRole('button', {name: /Dashboard bearbeiten/}).or(page.locator('ha-icon-button[slot]').last()).first(), 2);
    await shot('start-08-dashboard-leer');
  });
  await step('karte-plus', async () => {
    await go(`/${DASH.url}/0?edit=1`);
    // „+“ im ersten Abschnitt (leere Ansicht, immer an derselben Stelle)
    const plus = {x: 350, y: 405};
    markBox(plus.x - 46, plus.y - 28, 92, 56);
    await shot('start-09-bearbeiten');
    await page.mouse.click(plus.x, plus.y);
    await sleep(2000);
    await page.getByText('Nach Karte', {exact: true}).click();
    await sleep(1500);
    await page.getByPlaceholder('Karten durchsuchen').click();
    await page.keyboard.type('Nova', {delay: 50});
    await sleep(5000);
    await mark(page.getByPlaceholder('Karten durchsuchen'));
    await shot('start-10-kartenauswahl');
    await page.getByPlaceholder('Karten durchsuchen').fill('Nova Raum');
    await sleep(4000);
    const card = page.getByText('Nova Raum Card', {exact: true}).first();
    const b = await card.boundingBox();
    markBox(b.x - 20, b.y - 8, b.width + 40, 190);
    await shot('start-11-nova-raum');
    await page.mouse.click(b.x + b.width / 2, b.y + 100);
    await sleep(4000);
    await mark(page.getByRole('button', {name: 'Speichern'}));
    await shot('start-12-karten-editor');
    await page.getByRole('button', {name: 'Speichern'}).click();
    await sleep(2500);
    await mark(page.getByRole('button', {name: 'Fertig'}));
    await shot('start-13-gespeichert');
    await page.getByRole('button', {name: 'Fertig'}).click();
    await sleep(2500);
    await shot('start-14-fertig');
  });
  await deleteDashboard();
}

// ---------- Kapitel 4: Grundbegriffe ----------
if (want('begriffe')) {
  log('Grundbegriffe');
  await setTheme('blau');
  await step('dashboard', async () => {
    await go('/nova-showcase/raum');
    // Überschriften des Showcase sind Testnotizen, für Einsteiger nur verwirrend
    await page.evaluate(() => {
      const walk = n => { for (const el of n.querySelectorAll('*')) {
        if (el.localName === 'hui-heading-card') el.style.opacity = '0';
        if (el.shadowRoot) walk(el.shadowRoot);
      } };
      walk(document);
    });
    await shot('begriffe-01-dashboard');
  });
  await step('entitaeten', async () => {
    await go('/config/entities');
    await page.getByPlaceholder(/durchsuchen/).first().fill('nova_demo_wohnzimmer');
    await sleep(1500);
    await shot('begriffe-02-entitaeten');
  });
  await step('bereiche', async () => { await go('/config/areas/dashboard'); await shot('begriffe-03-bereiche'); });
}

if (oldTheme) await setTheme(oldTheme).catch(e => problems.push('Theme zurück: ' + e.message));
await browser.close();
publish();
if (problems.length) { log('\nProbleme:'); for (const p of problems) log(' -', p); process.exitCode = 2; }
