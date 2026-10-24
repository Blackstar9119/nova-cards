// Baut src/ zu nova-cards.js im Repo-Root (diese Datei lädt HACS). Version kommt aus package.json.
// Dev-Build: „npm run dev [-- karte]“ → dev/nova-dev-cards.js, alle Elemente heißen nova-dev-* statt nova-*.
// Mit Karte (Dateiname in src/ ohne .js, z. B. waste) wird nur diese Karte gebaut – nötig, wenn der Build über 128 KB liegt.
import {build} from 'esbuild';
import {readFileSync, statSync, existsSync} from 'node:fs';

const {version} = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));
const [mode, card] = process.argv.slice(2);
const dev = mode === '--dev';
const LIMIT = 128 * 1024;

if (card && !existsSync(`src/${card}.js`)) {
  console.error(`Karte „${card}“ nicht gefunden – erwartet wird eine Datei src/${card}.js`);
  process.exit(1);
}

const outfile = dev ? 'dev/nova-dev-cards.js' : 'nova-cards.js';
const entry = card ? `src/${card}.js` : 'src/index.js';

await build({
  entryPoints: [entry],
  outfile,
  bundle: true,
  format: 'iife',
  target: 'es2021',
  charset: 'utf8',
  legalComments: 'none',
  define: {__VERSION__: JSON.stringify(version), __DEV__: JSON.stringify(dev)},
  banner: {js: dev
    ? `/* Nova Cards v${version} DEV${card ? ` (nur ${card})` : ''} – Testbuild, alle Karten als custom:nova-dev-*. Nicht veröffentlichen. */`
    : `/* Nova Cards v${version} | MIT | https://github.com/Blackstar9119/nova-cards
   Raum, Thermostat, Licht, Dock, Modular, Kamera, Media, Saugroboter, Müllkalender – alle als custom:nova-*.
   Erzeugt mit „npm run build“ aus src/ – diese Datei nicht direkt bearbeiten. */`},
  logLevel: 'info',
});

if (dev) {
  const size = statSync(outfile).size;
  const kb = (size / 1024).toFixed(1);
  if (size > LIMIT) {
    console.error(`Dev-Build ist ${kb} KB groß – über 128 KB passt nicht als Inline-Ressource. Nur eine Karte bauen: npm run dev -- <karte>`);
    process.exit(2);
  }
  console.info(`Dev-Build: ${kb} KB, passt als Inline-Ressource.`);
}
