// Baut src/ zu nova-cards.js im Repo-Root (diese Datei lädt HACS). Version kommt aus package.json.
// Dev-Build: „npm run dev [-- karte]“ → dev/nova-dev-cards.js, alle Elemente heißen nova-dev-* statt nova-*.
// Mit Karte (Dateiname in src/ ohne .js, z. B. waste) wird nur diese Karte gebaut – nötig, wenn der Build über 128 KB liegt.
// Mehrere Karten mit Komma, z. B. „npm run dev -- popup,navi“.
// Integration: „npm run integration [-- <pfad>]“ baut alle Karten (verkleinert) für die Nova-Integration, Version aus deren
// manifest.json. Standard-Pfad ist ../nova-integration; gibt es ihn, landet die Datei direkt in custom_components/nova/static/,
// sonst in integration/nova-cards.js (gitignored) zum Kopieren.
import {build} from 'esbuild';
import {readFileSync, statSync, existsSync, mkdirSync} from 'node:fs';

const [mode, card] = process.argv.slice(2);
const dev = mode === '--dev';
// Nova-Panel: eigene Datei für die Integration (nova-integration: custom_components/nova/static/nova-panel.js)
const panel = mode === '--panel';
// Karten für die Nova-Integration: gemeinsame Version mit ihr, ausgeliefert unter /nova/static/nova-cards.js
const integration = mode === '--integration';
const intDir = integration ? (card || '../nova-integration') : '';
const manifest = `${intDir}/custom_components/nova/manifest.json`;
if (integration && !existsSync(manifest)) {
  console.error(`Nova-Integration nicht gefunden – erwartet wird ${manifest} (Pfad angeben: npm run integration -- <pfad>)`);
  process.exit(1);
}
const {version} = JSON.parse(readFileSync(integration ? manifest : new URL('./package.json', import.meta.url)));
const LIMIT = 128 * 1024;

const cards = card && !integration ? card.split(',').map(s => s.trim()).filter(Boolean) : [];
for (const k of cards) if (!existsSync(`src/${k}.js`)) {
  console.error(`Karte „${k}“ nicht gefunden – erwartet wird eine Datei src/${k}.js`);
  process.exit(1);
}

const outfile = panel ? 'panel/nova-panel.js' : dev ? 'dev/nova-dev-cards.js'
  : integration ? `${intDir}/custom_components/nova/static/nova-cards.js` : 'nova-cards.js';
if (integration) mkdirSync(`${intDir}/custom_components/nova/static`, {recursive: true});

await build({
  ...(cards.length > 1
    ? {stdin: {contents: cards.map(k => `import './src/${k}.js';`).join('\n'), resolveDir: '.', sourcefile: 'dev-auswahl.js'}}
    // Voller Build über main.js: lädt die Karten nur einmal, auch wenn Integration und alte Ressource beide da sind
    : {entryPoints: [panel ? 'src/panel.js' : cards.length ? `src/${cards[0]}.js` : 'src/main.js']}),
  outfile,
  bundle: true,
  format: 'iife',
  target: 'es2021',
  charset: 'utf8',
  legalComments: 'none',
  define: {__VERSION__: JSON.stringify(version), __DEV__: JSON.stringify(dev), __SOURCE__: JSON.stringify(integration ? 'integration' : 'resource')},
  minify: panel || integration,
  banner: {js: panel
    ? `/* Nova-Panel v${version} | MIT | https://github.com/Blackstar9119/nova-cards – erzeugt mit „npm run panel“ aus src/panel.js, nicht direkt bearbeiten. */`
    : integration
    ? `/* Nova Cards v${version} | MIT | https://github.com/Blackstar9119/nova-cards – Karten der Nova-Integration, erzeugt mit „npm run integration“ aus src/, nicht direkt bearbeiten. */`
    : dev
    ? `/* Nova Cards v${version} DEV${card ? ` (nur ${cards.join(', ')})` : ''} – Testbuild, alle Karten als custom:nova-dev-*. Nicht veröffentlichen. */`
    : `/* Nova Cards v${version} | MIT | https://github.com/Blackstar9119/nova-cards
   Raum, Thermostat, Licht, Navi, Modular, Kamera, Media, Saugroboter, Müllkalender, Wetter, Pop-up, Bereich, Swipe, Chips, Gerät, 3D-Drucker, Fernbedienung, Timer, Uhr, Einkauf, Notiz, Rezeptliste, Rezeptbuch – alle als custom:nova-*.
   Erzeugt mit „npm run build“ aus src/ – diese Datei nicht direkt bearbeiten. */`},
  logLevel: 'info',
});

if (dev) {
  // Der Dev-Build wird über jsDelivr geladen – die 128-KB-Grenze gilt nur noch für Inline-Ressourcen
  const kb = (statSync(outfile).size / 1024).toFixed(1);
  console.info(`Dev-Build: ${kb} KB${statSync(outfile).size > LIMIT ? ' (zu groß für eine Inline-Ressource, über jsDelivr kein Problem)' : ''}.`);
}

if (integration) {
  const kb = n => (n / 1024).toFixed(0);
  console.info(`Karten für die Nova-Integration v${version}: ${outfile} (${kb(statSync(outfile).size)} KB).`);
}
