// Prüft, dass im Karten-CSS keine festen Farben stehen – alles kommt aus den Tokens in src/shared/theme.js.
// Aufruf: „npm run check“. Erlaubt bleiben: Materialfarben von Zeichnungen (fill/stroke/stop-color und SVG-Attribute),
// Masken (mask-image, Schwarz = sichtbar), Rückfallwerte für HA-Variablen (var(--divider-color,#444)) und Editor-Stylesheets.
import {readFileSync, readdirSync} from 'node:fs';

const EDITOR = /^(?:export )?const (?:\w*EDITOR\w*|COLOR_INPUT_CSS|GRID_ED_CSS|PICK_CSS|MAPROW_CSS) = `/;
const SCENE = ['fill', 'stroke', 'stop-color', 'flood-color'];
const files = [...readdirSync('src').filter(f => f.endsWith('.js') && f !== 'index.js').map(f => `src/${f}`),
  ...readdirSync('src/shared').filter(f => f.endsWith('.js') && f !== 'theme.js').map(f => `src/shared/${f}`)];
// Editor-Stylesheets in Kartendateien, die nicht am Namen zu erkennen sind
const SKIP = {'src/swipe.js': ['PCSS']};

let bad = 0;
for (const f of files) {
  const lines = readFileSync(f, 'utf8').split('\n');
  let editor = false;
  lines.forEach((line, i) => {
    const start = /^(?:export )?const (\w+) = /.exec(line);
    if (start) editor = EDITOR.test(line) || (SKIP[f] || []).includes(start[1]);
    if (editor) return;
    for (const m of line.matchAll(/#(?:[0-9a-fA-F]{3,4}|[0-9a-fA-F]{6}|[0-9a-fA-F]{8})\b|rgba?\(\d[^)]*\)/g)) {
      const before = line.slice(0, m.index);
      if (/=["']?$/.test(before) || /["'] *$/.test(before) && !/:\s*$/.test(before)) continue;      // SVG-Attribut oder JS-Wert (Zeichnung, Palette)
      const decl = before.slice(Math.max(before.lastIndexOf(';'), before.lastIndexOf('{'), before.lastIndexOf('"')) + 1);
      const prop = decl.includes(':') ? decl.split(':')[0].trim() : '';
      if (!prop) continue;                                                // kein CSS (z. B. Text, Kommentar, Tabelle)
      if (SCENE.includes(prop) || prop.includes('mask')) continue;
      if (/var\(--(?!nv-|nova-)[\w-]+,\s*$/.test(before)) continue;       // Rückfallwert einer HA-Variable
      if (/color-mix\([^;]*$/.test(decl) && SCENE.some(p => decl.startsWith(p))) continue;
      console.error(`${f}:${i + 1}  ${prop}: ${m[0]}`);
      bad++;
    }
  });
}
if (bad) { console.error(`\n${bad} feste Farbe(n) im Karten-CSS – bitte ein Token aus src/shared/theme.js verwenden.`); process.exit(1); }
console.info('Keine festen Farben im Karten-CSS.');
