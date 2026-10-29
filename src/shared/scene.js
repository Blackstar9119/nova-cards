/* Nova-Zeichenstil für Gerätezeichnungen – Maßstab ist die 3D-Drucker-Zeichnung (siehe AGENTS.md, „Stil der Zeichnungen“).
   Hier stehen Farbpalette, Verläufe (Gehäuse, Glanz, Glas, Chrom, Innenraum), Glas-Spiegelung, Lichtstreifen und Rahmen-Glow.
   Verwendung: im <defs> der Zeichnung sceneDefs('x') einsetzen (Ids x-bd, x-sh …), SCENE_CSS ins Stylesheet der Karte,
   Elemente mit den Klassen s-… zeichnen und sweep() beim Reinscrollen aufrufen. */

// Farbpalette: Materialfarben der Zeichnungen. Wählbare Farben (Wasser, LEDs, Haken) kommen weiter aus den Farbrollen (--dc).
export const PAL = {
  bodyLight: '#3a4252', body: '#191d26',      // Gehäuse oben/unten (Theme: --nova-device-color-light / --nova-device-color)
  part: '#3b4252', partDark: '#20252f',       // Anbauteile: Schublade, Kopf, Display-Rahmen
  inner: '#2c3344', innerDark: '#10141b',     // Innenraum
  screen: '#0a0e14',                          // Display, Dichtung
  chrome: '#a3adbf', chromeMid: '#566074', chromeDark: '#232833',
  glass: '#a9c6ff', glassMid: '#5d7397', glassDark: '#0c111c',
  line: 'rgba(255,255,255,.18)',              // Kanten
};

// Verläufe mit Präfix p (Ids eindeutig je Zeichnung): bd Gehäuse, sh Seitenglanz, gl Glas, in Innenraum, pt Anbauteil,
// cr Chrom, gs Lichtstreifen
export const sceneDefs = p => `<linearGradient id="${p}-bd" x1="0" y1="0" x2="0" y2="1"><stop offset="0" class="s-sb1"/><stop offset="1" class="s-sb2"/></linearGradient>
<linearGradient id="${p}-sh" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity=".16"/><stop offset=".35" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".14"/></linearGradient>
<linearGradient id="${p}-gl" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${PAL.glass}" stop-opacity=".11"/><stop offset=".55" stop-color="${PAL.glassMid}" stop-opacity=".05"/><stop offset="1" stop-color="${PAL.glassDark}" stop-opacity=".38"/></linearGradient>
<linearGradient id="${p}-in" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PAL.inner}"/><stop offset="1" stop-color="${PAL.innerDark}"/></linearGradient>
<linearGradient id="${p}-pt" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${PAL.part}"/><stop offset="1" stop-color="${PAL.partDark}"/></linearGradient>
<linearGradient id="${p}-cr" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${PAL.chrome}"/><stop offset=".5" stop-color="${PAL.chromeMid}"/><stop offset="1" stop-color="${PAL.chromeDark}"/></linearGradient>
<linearGradient id="${p}-gs" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#fff" stop-opacity=".45"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></linearGradient>`;

// Grundklassen: s-shd Bodenschatten, s-body Gehäuse, s-sheen Seitenglanz, s-edge Lichtkante oben, s-part Anbauteil,
// s-glass Glasscheibe, s-refl Spiegelstreifen (im Glas-Clip), s-gls Lichtstreifen (läuft mit .sweep einmal durchs Glas),
// s-scr Display, s-tgl Display-Glanz. Der Lichtstreifen bewegt sich per translateX um --gx (Standard 70px).
export const SCENE_CSS = `
.scene{--sb1:var(--nova-device-color-light,${PAL.bodyLight});--sb2:var(--nova-device-color,${PAL.body})}
.scene .s-sb1{stop-color:var(--sb1)}.scene .s-sb2{stop-color:var(--sb2)}
.scene .s-shd{fill:#000;opacity:.35}
.scene .s-body{stroke:${PAL.line};stroke-width:.6;transition:stroke .4s}.scene .s-sheen{opacity:.4}.scene .s-edge{fill:#fff;opacity:.12}
.scene .s-part{stroke:rgba(255,255,255,.15);stroke-width:.5}
.scene .s-glass{stroke:rgba(255,255,255,.22);stroke-width:.7}.scene .s-refl{fill:#fff;opacity:.035}
.scene .s-gls{opacity:0;transform-box:view-box}
.sweep .scene .s-gls{animation:nv-glare .9s .1s ease-in-out both}
.scene .s-scr{fill:${PAL.screen};stroke:rgba(255,255,255,.18);stroke-width:.5}.scene .s-tgl{fill:#fff;opacity:.05}
.still .scene .s-gls{animation-play-state:paused!important}
@keyframes nv-glare{0%{opacity:0;transform:translateX(0)}15%{opacity:.7}85%{opacity:.7}100%{opacity:0;transform:translateX(var(--gx,70px))}}
@media (prefers-reduced-motion:reduce){.sweep .scene .s-gls{animation:none}}`;

// Rahmen-Glow der Karte, solange das Gerät arbeitet (sel = Selektor der Karte im aktiven Zustand)
export const frameGlow = sel => `${sel}{box-shadow:0 10px 30px rgba(0,0,0,.25),0 0 0 1px color-mix(in srgb,var(--dc) 45%,transparent),inset 0 1px 0 rgba(255,255,255,.12)}`;

// Lichtstreifen einmal durchs Glas schicken (beim Reinscrollen, bei „fertig“): Klasse neu setzen startet die Animation neu
export function sweep(el) {
  if (!el) return;
  el.classList.remove('sweep');
  void el.getBoundingClientRect();
  el.classList.add('sweep');
}

// Fertig-Haken-Badge: bei allen Geräten unten rechts – Mitte 20 Einheiten links und 38 über der unteren rechten Gehäuseecke,
// Radius 11,5. Die Maße gelten für 200 Einheiten Zeichnungsbreite; u = Maßstab für andere Raster (Drucker 260 breit: u = 1,3).
export const badgeAt = (right, bottom, u = 1) => ({x: right - 20 * u, y: bottom - 38 * u, r: 11.5 * u});
