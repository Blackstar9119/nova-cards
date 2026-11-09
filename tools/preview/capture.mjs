#!/usr/bin/env node
// Erzeugt Screenshots (PNG) und GIFs aller Nova Cards – lokal, ohne Home Assistant.
//   npm run preview:capture                 alles (veröffentlicht + Dev)
//   npm run preview:capture -- --only vacuum-card,waste-card
//   npm run preview:capture -- --no-dev     nur veröffentlichte Karten
// Veröffentlicht = Karten in origin/main (Dev-Build-Marker __DEV__=false), Ausgabe docs/images/
// Dev = Karten, die in main fehlen (Arbeitsbaum + andere Branches), Ausgabe docs/images/dev/
// Karten werden zur Laufzeit über die customElements-/customCards-Registrierung in src/ gefunden, nicht über eine feste Liste.
import {build} from 'esbuild';
import {chromium} from 'playwright';
import {execFileSync, spawnSync} from 'node:child_process';
import {createServer} from 'node:http';
import {mkdirSync, mkdtempSync, readFileSync, writeFileSync, existsSync, statSync, readdirSync, renameSync, rmSync, createReadStream, symlinkSync} from 'node:fs';
import {tmpdir} from 'node:os';
import {join, extname, resolve, dirname} from 'node:path';
import {fileURLToPath} from 'node:url';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '../..');
const OUT = join(ROOT, 'docs/images'), DIST = join(ROOT, 'dist');
const args = process.argv.slice(2);
const flag = n => args.includes(n);
const only = (args.find(a => a.startsWith('--only='))?.slice(7) || (args.includes('--only') ? args[args.indexOf('--only') + 1] : '')).split(',').filter(Boolean);
const git = (...a) => execFileSync('git', a, {cwd: ROOT, encoding: 'utf8', maxBuffer: 1 << 26, stdio: ['ignore', 'pipe', 'ignore']}).trim();
const version = JSON.parse(readFileSync(join(ROOT, 'package.json'))).version;
const MAIN = existsSync(join(ROOT, '.git')) && (() => { try { git('rev-parse', '--verify', 'origin/main'); return 'origin/main'; } catch { return 'main'; } })();

mkdirSync(DIST, {recursive: true});

// ---- Bundles bauen -------------------------------------------------------------------------
async function bundle(srcRoot, outfile, dev) {
  await build({
    entryPoints: [join(srcRoot, 'src/index.js')], outfile, bundle: true, format: 'iife', target: 'es2021', charset: 'utf8', logLevel: 'silent',
    define: {__VERSION__: JSON.stringify(version), __DEV__: JSON.stringify(dev)}, nodePaths: [join(ROOT, 'node_modules')],
  });
}
// Quelltext eines Git-Stands in ein Temp-Verzeichnis exportieren (ohne den Arbeitsbaum anzufassen)
function exportRef(ref) {
  const dir = mkdtempSync(join(tmpdir(), 'nova-prev-'));
  execFileSync('sh', ['-c', `git archive ${ref} src | tar -x -C "${dir}"`], {cwd: ROOT});
  return dir;
}
async function iconBundle() {
  await build({entryPoints: [join(ROOT, 'tools/preview/icons.js')], outfile: join(ROOT, 'tools/preview/icons.bundle.js'), bundle: true, format: 'esm', logLevel: 'silent', minify: true});
}

// ---- Static-Server -----------------------------------------------------------------------
const MIME = {'.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.json': 'application/json', '.svg': 'image/svg+xml'};
const server = createServer((req, res) => {
  const p = resolve(ROOT, '.' + decodeURIComponent(req.url.split('?')[0]));
  if (!p.startsWith(ROOT) || !existsSync(p) || !statSync(p).isFile()) { res.writeHead(404); return res.end(); }
  res.writeHead(200, {'content-type': MIME[extname(p)] || 'application/octet-stream'});
  createReadStream(p).pipe(res);
});
await new Promise(r => server.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${server.address().port}`;

// ---- Quellen bestimmen -------------------------------------------------------------------
await iconBundle();
const sets = [{label: 'published', dev: false, prefix: 'nova-', file: 'dist/published.js', dir: 'docs/images', src: MAIN}];
const devSources = [];
if (!flag('--no-dev')) {
  // Arbeitsbaum zuerst, danach alle anderen Branches (lokal + origin) – erster Fund einer Karte gewinnt
  devSources.push({name: 'Arbeitsbaum', root: ROOT});
  const branches = [...new Set(git('for-each-ref', '--format=%(refname:short)', 'refs/heads', 'refs/remotes/origin').split('\n')
    .map(b => b.replace(/^origin\//, '')).filter(b => b && b !== 'HEAD' && b !== 'origin' && b !== 'main'))];
  for (const b of branches) {
    const ref = (() => { try { git('rev-parse', '--verify', `refs/heads/${b}`); return b; } catch { return `origin/${b}`; } })();
    try { if (git('ls-tree', '--name-only', ref, 'src/index.js')) devSources.push({name: b, ref}); } catch { /* Branch ohne src/ */ }
  }
}

const browser = await chromium.launch();
const results = {published: [], dev: [], failed: [], skipped: []};
const pubBases = new Set();

async function loadSet(set) {
  const out = join(ROOT, set.file);
  let tmp;
  try {
    if (set.root) await bundle(set.root, out, set.dev);
    else { tmp = exportRef(set.src || set.ref); await bundle(tmp, out, set.dev); }
  } catch (e) { return {error: e.message.split('\n')[0]}; }
  finally { if (tmp) rmSync(tmp, {recursive: true, force: true}); }
  const ctx = await browser.newContext({viewport: {width: 1400, height: 900}, deviceScaleFactor: 2, colorScheme: 'dark', recordVideo: undefined});
  const page = await ctx.newPage();
  const errs = [];
  page.on('pageerror', e => errs.push(e.message));
  await page.goto(`${base}/tools/preview/index.html?bundle=/${set.file}&prefix=${set.prefix}`);
  try { await page.waitForFunction('window.__ready === true', null, {timeout: 20000}); }
  catch { await ctx.close(); return {error: 'Vorschauseite wurde nicht fertig: ' + (errs[0] || 'Timeout')}; }
  return {ctx, page};
}

async function gif(set, slotId, outPath) {
  // Neuer Kontext mit Videoaufnahme, nur diese Karte sichtbar
  const dir = mkdtempSync(join(tmpdir(), 'nova-vid-'));
  const ctx = await browser.newContext({viewport: {width: 760, height: 900}, deviceScaleFactor: 1, colorScheme: 'dark', recordVideo: {dir, size: {width: 760, height: 900}}});
  const page = await ctx.newPage();
  await page.goto(`${base}/tools/preview/index.html?bundle=/${set.file}&prefix=${set.prefix}`);
  await page.waitForFunction('window.__ready === true');
  const box = await page.evaluate(id => {
    document.querySelectorAll('.slot').forEach(s => { if (s.dataset.id !== id) s.style.display = 'none'; });
    const r = document.querySelector(`.slot[data-id="${id}"]`).firstElementChild.getBoundingClientRect();
    return {x: r.x, y: r.y, w: r.width, h: r.height};
  }, slotId);
  await page.waitForTimeout(4000);
  await ctx.close();
  const video = readdirSync(dir).find(f => f.endsWith('.webm'));
  const crop = `crop=${Math.ceil(box.w) & ~1}:${Math.ceil(box.h) & ~1}:${Math.floor(box.x)}:${Math.floor(box.y)}`;
  const vf = `${crop},fps=15,scale='min(600,iw)':-1:flags=lanczos`;
  const pal = join(dir, 'pal.png');
  spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(dir, video), '-vf', `${vf},palettegen=stats_mode=diff`, pal]);
  const r = spawnSync('ffmpeg', ['-y', '-loglevel', 'error', '-i', join(dir, video), '-i', pal, '-lavfi', `${vf}[x];[x][1:v]paletteuse=dither=bayer:bayer_scale=4`, '-loop', '0', outPath]);
  rmSync(dir, {recursive: true, force: true});
  return r.status === 0 && existsSync(outPath) && statSync(outPath).size > 0;
}

async function capture(set, kind, handled) {
  const loaded = await loadSet(set);
  if (loaded.error) { results.failed.push(`${set.label}: ${loaded.error}`); return; }
  const {ctx, page} = loaded;
  const slots = await page.evaluate('window.__slots');
  const outDir = join(ROOT, set.dir);
  mkdirSync(outDir, {recursive: true});
  for (const s of slots) {
    if (kind === 'dev' && (pubBases.has(s.base) || handled.has(s.base))) continue;
    if (only.length && !only.includes(s.base) && !only.includes(s.id)) continue;
    const label = `${s.id}${kind === 'dev' ? ` [${set.label}]` : ''}`;
    if (s.base === 'popup-card') { results.skipped.push(`${label}: Overlay (öffnet per URL-Hash), hat keine eigene Fläche zum Fotografieren`); continue; }
    if (s.error) { results.failed.push(`${label}: ${s.error}`); continue; }
    const sel = `.slot[data-id="${s.id}"] > *`;
    try {
      await page.waitForTimeout(400);
      await page.locator(sel).first().screenshot({path: join(outDir, `${s.id}.png`), animations: 'allow'});
      const ok = statSync(join(outDir, `${s.id}.png`)).size > 0;
      let g = '';
      if (ok && s.anim) g = (await gif(set, s.id, join(outDir, `${s.id}.gif`))) ? ' + GIF' : ' (GIF fehlgeschlagen)';
      (kind === 'dev' ? results.dev : results.published).push(label + g + (s.stub ? ' (Stub-Konfig, keine Beispiel-Config hinterlegt)' : ''));
    } catch (e) { results.failed.push(`${label}: ${e.message.split('\n')[0]}`); }
  }
  // Alle Basiskarten dieser Quelle merken
  slots.forEach(s => (kind === 'published' ? pubBases : handled).add(s.base));
  await ctx.close();
}

// Veröffentlicht
await capture(sets[0], 'published', new Set());
// Dev: Arbeitsbaum + Branches
const handled = new Set();
for (const d of devSources) {
  const set = {label: d.name, dev: true, prefix: 'nova-dev-', file: `dist/dev-${d.name.replace(/[^\w.-]/g, '_')}.js`, dir: 'docs/images/dev', root: d.root, src: undefined, ref: d.ref};
  await capture(set, 'dev', handled);
}

await browser.close();
server.close();
console.log('\nVeröffentlicht (docs/images/):\n' + (results.published.map(x => '  ✓ ' + x).join('\n') || '  –'));
console.log('\nDev (docs/images/dev/):\n' + (results.dev.map(x => '  ✓ ' + x).join('\n') || '  –'));
if (results.skipped.length) console.log('\nBewusst übersprungen:\n' + results.skipped.map(x => '  – ' + x).join('\n'));
if (results.failed.length) console.log('\nNicht erfasst:\n' + results.failed.map(x => '  ✗ ' + x).join('\n'));
