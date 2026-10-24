// Baut src/ zu nova-cards.js im Repo-Root (diese Datei lädt HACS). Version kommt aus package.json.
import {build} from 'esbuild';
import {readFileSync} from 'node:fs';

const {version} = JSON.parse(readFileSync(new URL('./package.json', import.meta.url)));

await build({
  entryPoints: ['src/index.js'],
  outfile: 'nova-cards.js',
  bundle: true,
  format: 'iife',
  target: 'es2021',
  charset: 'utf8',
  legalComments: 'none',
  define: {__VERSION__: JSON.stringify(version)},
  banner: {js: `/* Nova Cards v${version} | MIT | https://github.com/Blackstar9119/nova-cards
   Raum, Thermostat, Licht, Dock, Modular, Kamera, Media, Saugroboter, Müllkalender – alle als custom:nova-*.
   Erzeugt mit „npm run build“ aus src/ – diese Datei nicht direkt bearbeiten. */`},
  logLevel: 'info',
});
