// Flächen-Sparkline als SVG; liegt der letzte Punkt vor „jetzt“, wird die Linie bis jetzt verlängert
let gradientId = 0;
export function sparkline(pts, {w = 300, h = 64, color = 'var(--nv-accent)'} = {}) {
  if (!pts || pts.length < 2) return '<svg class="spk"></svg>';
  const t0 = pts[0][0], t1 = Math.max(pts[pts.length - 1][0], Date.now()), vals = pts.map(p => p[1]);
  const min = Math.min(...vals), max = Math.max(...vals), range = max - min || 1;
  const d = 'M' + pts.concat([[t1, pts[pts.length - 1][1]]])
    .map(p => [(p[0] - t0) / (t1 - t0 || 1) * w, h - 6 - (p[1] - min) / range * (h - 14)])
    .map(p => p[0].toFixed(1) + ',' + p[1].toFixed(1)).join('L');
  const id = `nvg${++gradientId}`;
  return `<svg class="spk" viewBox="0 0 ${w} ${h}" preserveAspectRatio="none"><defs><linearGradient id="${id}" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${color}" stop-opacity=".45"/><stop offset="1" stop-color="${color}" stop-opacity="0"/></linearGradient></defs><path d="${d}L${w},${h}L0,${h}Z" fill="url(#${id})"/><path d="${d}" fill="none" stroke="${color}" stroke-width="2" vector-effect="non-scaling-stroke"/></svg>`;
}
