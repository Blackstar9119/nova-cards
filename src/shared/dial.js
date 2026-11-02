/* Runde Zeichnungen im Nova-Zeichenstil (siehe AGENTS.md, „Stil der Zeichnungen“): Gehäuse, Chromring, Zifferblatt
   mit Teilstrichen, Fortschrittsring und Glas. Genutzt von Timer (Stoppuhr mit Krone und Drückern) und Uhr (analog).
   Alle Maße gelten für viewBox 0 0 200 200; Mitte cx/cy, Gehäuseradius r. */
import {sceneDefs, SCENE_CSS, PAL, badgeAt} from './scene.js';

const f = n => +n.toFixed(2);
const pt = (cx, cy, r, a) => [f(cx + r * Math.sin(a)), f(cy - r * Math.cos(a))];

// Teilstriche: 60 Stück, jeder fünfte länger (Klasse tk = klein, tkm = groß)
export const ticks = (cx, cy, r, len = 5, big = 9) => {
  let s = '', m = '';
  for (let i = 0; i < 60; i++) {
    const a = i / 60 * Math.PI * 2, major = i % 5 === 0, [x1, y1] = pt(cx, cy, r, a), [x2, y2] = pt(cx, cy, r - (major ? big : len), a);
    if (major) m += `M${x1} ${y1}L${x2} ${y2}`; else s += `M${x1} ${y1}L${x2} ${y2}`;
  }
  return `<path class="tk" d="${s}"/><path class="tkm" d="${m}"/>`;
};

// Verläufe der Zeichnung (Präfix p): sceneDefs + Zifferblatt mit Vignette + Glas-Clip
export const dialDefs = (p, cx, cy, r) => `${sceneDefs(p)}
<radialGradient id="${p}-fc" cx=".5" cy=".42" r=".6"><stop offset="0" stop-color="${PAL.inner}"/><stop offset=".75" stop-color="${PAL.innerDark}"/><stop offset="1" stop-color="#05070a"/></radialGradient>
<clipPath id="${p}-gc"><circle cx="${cx}" cy="${cy}" r="${r - 9}"/></clipPath>`;

// Gehäuse, Chromring, Zifferblatt, Teilstriche. ring = Radius des Fortschrittsrings (0 = keiner)
export const dialBody = (p, cx, cy, r, ring = 0) => `<ellipse class="s-shd" cx="${cx}" cy="${cy + r + 4}" rx="${f(r * .7)}" ry="3.5"/>
<circle class="s-body" cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}-bd)"/>
<circle class="s-sheen" cx="${cx}" cy="${cy}" r="${r}" fill="url(#${p}-sh)"/>
<path class="dl-edge" d="M${pt(cx, cy, r - 1, -1.1).join(' ')}A${r - 1} ${r - 1} 0 0 1 ${pt(cx, cy, r - 1, 1.1).join(' ')}"/>
<circle class="dl-bz" cx="${cx}" cy="${cy}" r="${r - 5}" stroke="url(#${p}-cr)"/>
<circle class="dl-fc" cx="${cx}" cy="${cy}" r="${r - 8}" fill="url(#${p}-fc)"/>
${ticks(cx, cy, r - 11)}
${ring ? `<circle class="dl-tr" cx="${cx}" cy="${cy}" r="${ring}"/><circle class="dl-arc" cx="${cx}" cy="${cy}" r="${ring}" transform="rotate(-90 ${cx} ${cy})" pathLength="1000"/>` : ''}`;

// Glas mit dezenter Spiegelung, Lichtbogen oben links und Lichtstreifen (läuft mit sweep() einmal durch)
export const dialGlass = (p, cx, cy, r) => {
  const g = r - 9, [ax, ay] = pt(cx, cy, g - 4, -1.25), [bx, by] = pt(cx, cy, g - 4, -.35);
  return `<circle class="s-glass" cx="${cx}" cy="${cy}" r="${g}" fill="url(#${p}-gl)"/>
<g clip-path="url(#${p}-gc)"><path class="s-refl" d="M${cx - g} ${cy - g * .2}L${cx - g * .2} ${cy - g}h${f(g * .35)}L${cx - g} ${cy + g * .15}z"/>
<path class="s-refl" d="M${cx - g * .7} ${cy + g * .55}L${cx + g * .55} ${cy - g * .7}h${f(g * .12)}L${cx - g * .58} ${cy + g * .67}z"/>
<g transform="rotate(25 ${cx} ${cy})"><rect class="s-gls" x="${cx - g - 18}" y="${cy - g - 20}" width="16" height="${2 * g + 40}" fill="url(#${p}-gs)"/></g></g>
<path class="dl-arcl" d="M${ax} ${ay}A${g - 4} ${g - 4} 0 0 1 ${bx} ${by}"/>`;
};

// Stoppuhr-Teile oben: Krone mit Riffeln und zwei Drücker (Klassen dl-crown, dl-push l/r für die Drück-Animation)
export const crown = (p, cx, cy, r) => {
  const top = cy - r, grooves = [-6, -3, 0, 3, 6].map(x => `M${cx + x} ${top - 16}v8`).join('');
  const pusher = (side, a) => `<g class="dl-push ${side}" transform="rotate(${a} ${cx} ${cy})"><rect class="s-part" x="${cx - 5}" y="${top - 9}" width="10" height="10" rx="2" fill="url(#${p}-pt)"/><rect class="dl-cap" x="${cx - 6.5}" y="${top - 12}" width="13" height="4" rx="1.5" fill="url(#${p}-cr)"/></g>`;
  return `${pusher('l', -40)}${pusher('r', 40)}
<rect class="s-part" x="${cx - 5}" y="${top - 8}" width="10" height="9" rx="1.5" fill="url(#${p}-pt)"/>
<g class="dl-crown"><rect class="dl-cr" x="${cx - 10}" y="${top - 19}" width="20" height="12" rx="3" fill="url(#${p}-cr)"/><path class="dl-grv" d="${grooves}"/></g>`;
};

// Glocke als Badge (Timer abgelaufen) an der gemeinsamen Badge-Stelle unten rechts
export const bellBadge = (right, bottom) => {
  const {x, y, r} = badgeAt(right, bottom);
  return `<g class="dl-bell"><circle class="dl-br" cx="${x}" cy="${y}" r="${r}"/><path class="dl-bk" transform="translate(${x - 6} ${y - 6.5}) scale(.5)" d="M12 22a2 2 0 0 0 2-2h-4a2 2 0 0 0 2 2zm6-6v-5c0-3.07-1.64-5.64-4.5-6.32V4a1.5 1.5 0 0 0-3 0v.68C7.63 5.36 6 7.92 6 11v5l-2 2v1h16v-1z"/></g>`;
};

export const DIAL_CSS = `${SCENE_CSS}
.scene .dl-edge{fill:none;stroke:#fff;stroke-opacity:.14;stroke-width:.7}
.scene .dl-bz{fill:none;stroke-width:4.4}
.scene .dl-fc{stroke:rgba(0,0,0,.6);stroke-width:1}
.scene .tk{stroke:#fff;stroke-opacity:.14;stroke-width:.6}.scene .tkm{stroke:#fff;stroke-opacity:.3;stroke-width:1.4;stroke-linecap:round}
.scene .dl-tr{fill:none;stroke:#fff;stroke-opacity:.06;stroke-width:6}
.scene .dl-arc{fill:none;stroke:var(--dc);stroke-width:6;stroke-linecap:round;stroke-dasharray:1000;stroke-dashoffset:calc(1000 - var(--p,0) * 1000);
filter:drop-shadow(0 0 2.5px var(--dc));transition:stroke-dashoffset 1s linear,opacity .4s}
.scene .dl-arcl{fill:none;stroke:#fff;stroke-opacity:.16;stroke-width:1.2;stroke-linecap:round}
.scene .dl-cr{stroke:rgba(255,255,255,.2);stroke-width:.5}.scene .dl-grv{stroke:#000;stroke-opacity:.3;stroke-width:.8}
.scene .dl-cap{stroke:rgba(255,255,255,.2);stroke-width:.4}
.scene .dl-push,.scene .dl-crown{transform-box:view-box}
.scene .dl-bell{opacity:0;transform-box:fill-box;transform-origin:center}
.scene .dl-br{fill:var(--dc);filter:drop-shadow(0 0 4px var(--dc))}.scene .dl-bk{fill:var(--dcfg,#fff)}
@media (prefers-reduced-motion:reduce){.scene *{animation:none!important;transition:none!important}}`;
