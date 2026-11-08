/* Stile der Nova Uhr Card: Klappzahlen (flip), Leuchtziffern (glow) und Radiowecker (retro).
   Die analoge Uhr steht in clock.js (Zifferblatt aus shared/dial.js). Zeichenstil siehe docs/DESIGN.md. */
import {sceneDefs, PAL} from './shared/scene.js';

const f = n => +n.toFixed(2);

/* ---------- Klappzahlen ----------
   Jede Ziffer besteht aus vier Hälften: obere und untere feste Hälfte sowie zwei Klappen. Beim Wechsel klappt die
   obere Klappe (alte Ziffer) nach unten weg, danach fällt die untere Klappe (neue Ziffer) auf den Anschlag – zusammen 600 ms. */
export const flipDigit = () => '<span class="fd"><span class="h t"><b></b></span><span class="h b"><b></b></span><span class="h t fl"><b></b></span><span class="h b fl"><b></b></span><i class="pin"></i><i class="pin r"></i></span>';

// Ziffer setzen: animiert nur, wenn sich das Zeichen ändert und anim = true ist
export function flipSet(el, ch, anim) {
  const [t, b, ft, fb] = el.querySelectorAll('b');
  const old = el._ch;
  if (old === ch) return;
  el._ch = ch;
  clearTimeout(el._ft);
  if (!anim || old == null) { t.textContent = b.textContent = ft.textContent = fb.textContent = ch; el.classList.remove('go'); return; }
  // feste obere Hälfte zeigt sofort die neue Ziffer, die untere bleibt bis zum Aufschlag der Klappe alt
  t.textContent = ch; b.textContent = old; ft.textContent = old; fb.textContent = ch;
  el.classList.remove('go'); void el.offsetWidth; el.classList.add('go');
  el._ft = setTimeout(() => { b.textContent = ch; el.classList.remove('go'); }, 640);
}

export const FLIP_CSS = `
.flp{display:flex;align-items:center;justify-content:center;gap:.12em;font-size:clamp(34px,var(--nova-clock-size,19cqw),150px);line-height:1;font-weight:600;color:#eef1f6;font-variant-numeric:tabular-nums}
.flp .grp{display:flex;gap:.05em}.flp .grp.sec{font-size:.45em;align-self:flex-end;margin-left:.1em}
.flp .sep{display:flex;flex-direction:column;gap:.22em;padding:0 .02em}.flp .sep i{width:.1em;height:.1em;border-radius:50%;background:#fff;opacity:.35}
.flp .ap{font-size:.24em;font-weight:500;opacity:.7;align-self:flex-start;margin-left:.15em;letter-spacing:0}
.fd{position:relative;display:block;width:.7em;height:1.12em;border-radius:.08em;perspective:2.6em;
box-shadow:0 .04em .1em rgba(0,0,0,.45),0 0 0 .5px rgba(255,255,255,.12)}
.fd .h{position:absolute;left:0;right:0;height:50%;overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.fd .t{top:0;border-radius:.08em .08em 0 0;background:linear-gradient(180deg,${PAL.part},#2b313d)}
.fd .b{bottom:0;border-radius:0 0 .08em .08em;background:linear-gradient(180deg,#232833,${PAL.partDark})}
.fd .t::after{content:"";position:absolute;inset:0;background:linear-gradient(180deg,rgba(255,255,255,.08),transparent 40%)}
.fd b{position:absolute;left:0;right:0;height:200%;line-height:1.12em;text-align:center;font-weight:inherit;text-shadow:0 1px 2px rgba(0,0,0,.4)}
.fd .t b{top:0}.fd .b b{bottom:0}
/* Trennfuge in der Mitte und die Achsstifte links und rechts */
.fd::after{content:"";position:absolute;left:0;right:0;top:calc(50% - .012em);height:.024em;background:rgba(0,0,0,.65);box-shadow:0 .012em 0 rgba(255,255,255,.06);z-index:3}
.fd .pin{position:absolute;top:calc(50% - .05em);left:-.015em;width:.035em;height:.1em;border-radius:.02em;background:linear-gradient(90deg,${PAL.chromeDark},${PAL.chrome});z-index:4}.fd .pin.r{left:auto;right:-.015em;transform:scaleX(-1)}
.fd .fl{visibility:hidden;z-index:2}
.fd.go .t.fl{visibility:visible;transform-origin:50% 100%;animation:fl-t .3s cubic-bezier(.55,.06,.68,.19) forwards}
.fd.go .b.fl{visibility:visible;transform-origin:50% 0;animation:fl-b .3s .3s cubic-bezier(.22,.61,.36,1) both}
/* Schatten der fallenden Klappe auf der unteren Hälfte */
.fd .b:not(.fl)::after{content:"";position:absolute;inset:0;background:#000;opacity:0}
.fd.go .b:not(.fl)::after{animation:fl-sh .6s ease-out}
@keyframes fl-t{0%{transform:rotateX(0);filter:brightness(1)}100%{transform:rotateX(-90deg);filter:brightness(.55)}}
@keyframes fl-b{0%{transform:rotateX(90deg);filter:brightness(1.35)}80%{transform:rotateX(-7deg);filter:brightness(1)}100%{transform:rotateX(0)}}
@keyframes fl-sh{0%{opacity:0}45%{opacity:.35}100%{opacity:0}}
@media (prefers-reduced-motion:reduce){.fd *,.fd::after{animation:none!important}}`;

/* ---------- Leuchtziffern ----------
   Farbe folgt dem Sonnenstand: vor Sonnenaufgang Nachtblau → morgens warm → mittags weiß → abends wieder tiefblau.
   Die Farben kommen aus dem Theme (--nv-clock-*), gemischt wird mit color-mix – der Übergang läuft per transition fließend. */
const mix = (a, b, t) => { t = Math.min(1, Math.max(0, t)); return `color-mix(in srgb,var(--nv-clock-${a}) ${f((1 - t) * 100)}%,var(--nv-clock-${b}))`; };
export function glowColor(elev, rising) {
  if (elev == null || isNaN(elev)) return null;
  if (rising) return elev < 0 ? mix('night', 'morning', (elev + 10) / 10) : elev < 10 ? 'var(--nv-clock-morning)' : mix('morning', 'noon', (elev - 10) / 25);
  return elev > 34 ? 'var(--nv-clock-noon)' : mix('noon', 'night', (34 - elev) / 40);
}
// Ohne sun.sun: Sonnenstand grob aus der Uhrzeit schätzen (6 Uhr Aufgang, 12 Uhr Höchststand, 18 Uhr Untergang)
export const sunGuess = hour => ({elev: 45 * Math.sin(Math.PI * (hour - 6) / 12), rising: hour < 12});

export const GLOW_CSS = `
.tm.glow{font-weight:200;letter-spacing:-.02em;font-size:clamp(40px,var(--nova-clock-size,27cqw),190px);color:var(--gc);
text-shadow:0 0 .04em var(--gc),0 0 .18em color-mix(in srgb,var(--gc) 55%,transparent),0 0 .5em color-mix(in srgb,var(--gc) 30%,transparent);transition:color 90s linear,text-shadow 90s linear}
.tm.glow .sc,.tm.glow .ap{opacity:.75}
.tm.glow .cl{opacity:.8}`;

/* ---------- Radiowecker ----------
   Sieben-Segment-Ziffern als SVG. Segmente: a oben, b rechts oben, c rechts unten, d unten, e links unten, f links oben, g Mitte.
   Ausgeschaltete Segmente bleiben mit 8 % Deckkraft sichtbar, wie bei einer echten LED-Anzeige. */
const SEG = {0: 'abcdef', 1: 'bc', 2: 'abged', 3: 'abgcd', 4: 'fgbc', 5: 'afgcd', 6: 'afgedc', 7: 'abc', 8: 'abcdefg', 9: 'abcdfg', ' ': ''};
const W = 34, H = 64, T = 8, G = 1.2;
// Segment als Sechseck entlang der Mittellinie (x1,y1)→(x2,y2)
const segPath = (x1, y1, x2, y2) => {
  const hz = y1 === y2, h = T / 2;
  if (hz) { const a = x1 + G, b = x2 - G; return `M${a} ${y1}L${a + h} ${y1 - h}H${b - h}L${b} ${y1}L${b - h} ${y1 + h}H${a + h}Z`; }
  const a = y1 + G, b = y2 - G; return `M${x1} ${a}L${x1 + h} ${a + h}V${b - h}L${x1} ${b}L${x1 - h} ${b - h}V${a + h}Z`;
};
const SEGS = {a: [0, 0, W, 0], b: [W, 0, W, H / 2], c: [W, H / 2, W, H], d: [0, H, W, H], e: [0, H / 2, 0, H], f: [0, 0, 0, H / 2], g: [0, H / 2, W, H / 2]};
// Eine Ziffer an Position x,y (leicht kursiv wie echte Anzeigen), Maßstab s. Jedes Segment ist ein Balken mit schräg
// abgeschnittenen Enden (Sechseck), keine Schrift.
const digit = (x, y, s = 1) => `<g class="dg" transform="translate(${x} ${y}) scale(${s}) skewX(-6)">${Object.entries(SEGS).map(([k, p]) => `<path class="sg" data-s="${k}" d="${segPath(...p)}"/>`).join('')}</g>`;

// Gehäuse mit Snooze-Taste, Front, Anzeigefenster mit Glas. sec = Sekunden klein rechts unten
export function retroSvg(sec) {
  const pad = 22, step = W + 16, colon = 22, sw = sec ? 2 * 21 + 10 : 0;
  const dispW = 4 * step - 16 + colon + sw + 2 * pad, dispH = H + 2 * pad - 6;
  const bw = dispW + 36, bh = dispH + 44, X = 18, Y = 26, vw = bw, vh = bh + 16;
  const xs = [0, step, 2 * step + colon, 3 * step + colon].map(v => X + pad + 6 + v), dy = Y + (dispH - H) / 2;
  const cx = X + pad + 6 + 2 * step - 16 / 2 + colon / 2 - 2;
  const secX = xs[3] + step + 4;
  return `<svg class="scene rt-svg" viewBox="0 0 ${vw} ${vh}" aria-hidden="true"><defs>${sceneDefs('r')}
<filter id="r-led" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="1.6" result="b"/><feMerge><feMergeNode in="b"/><feMergeNode in="SourceGraphic"/></feMerge></filter>
<radialGradient id="r-vg" cx=".5" cy=".5" r=".75"><stop offset=".55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity=".55"/></radialGradient>
<clipPath id="r-gc"><rect x="${X}" y="${Y}" width="${dispW}" height="${dispH}" rx="3"/></clipPath></defs>
<ellipse class="s-shd" cx="${vw / 2}" cy="${bh + 12}" rx="${f(bw * .42)}" ry="4"/>
<rect class="s-part" x="${f(bw * .3)}" y="4" width="${f(bw * .4)}" height="8" rx="2" fill="url(#r-pt)"/><rect x="${f(bw * .3 + 2)}" y="5" width="${f(bw * .4 - 4)}" height=".6" fill="#fff" opacity=".18"/>
<rect class="s-body" x="0" y="10" width="${bw}" height="${bh}" rx="9" fill="url(#r-bd)"/><rect class="s-sheen" x="0" y="10" width="${bw}" height="${bh}" rx="9" fill="url(#r-sh)"/>
<rect class="s-edge" x="9" y="10.4" width="${bw - 18}" height=".7" rx=".35"/>
<rect class="s-part" x="${X - 6}" y="${Y - 6}" width="${dispW + 12}" height="${dispH + 12}" rx="3" fill="url(#r-pt)"/>
<rect class="rt-scr" x="${X}" y="${Y}" width="${dispW}" height="${dispH}" rx="3"/><rect x="${X}" y="${Y}" width="${dispW}" height="${dispH}" rx="3" fill="url(#r-vg)"/>
${['off', 'on'].map(l => `<g class="rt-${l}"${l === 'on' ? ' filter="url(#r-led)"' : ''}>${xs.map(x => digit(x, dy)).join('')}
<g class="rt-col"><circle cx="${cx}" cy="${dy + H * .3}" r="3.6"/><circle cx="${cx}" cy="${dy + H * .7}" r="3.6"/></g>
${sec ? digit(secX, dy + H * .5, .5) + digit(secX + 21, dy + H * .5, .5) : ''}
<circle class="rt-pm" cx="${X + 11}" cy="${dy + 4}" r="2.6"/></g>`).join('')}
<rect class="s-glass" x="${X}" y="${Y}" width="${dispW}" height="${dispH}" rx="3" fill="url(#r-gl)"/>
<g clip-path="url(#r-gc)"><path class="s-refl" d="M${X} ${Y + dispH * .7}L${X + dispW * .3} ${Y}h${f(dispW * .08)}L${X} ${Y + dispH}z"/><path class="s-refl" d="M${X + dispW * .45} ${Y + dispH}L${X + dispW * .75} ${Y}h${f(dispW * .03)}L${X + dispW * .48} ${Y + dispH}z"/>
<g transform="rotate(18 ${X + dispW / 2} ${Y + dispH / 2})"><rect class="s-gls" x="${X - 30}" y="${Y - 40}" width="22" height="${dispH + 80}" fill="url(#r-gs)"/></g></g>
<g opacity=".2" stroke="#fff" stroke-width=".6">${[0, 1, 2, 3, 4].map(i => `<path d="M${bw - 60 + i * 9} ${Y + dispH + 14}v8"/>`).join('')}</g>
<circle class="s-part" cx="${X + 8}" cy="${Y + dispH + 18}" r="4" fill="url(#r-cr)"/><circle class="s-part" cx="${X + 22}" cy="${Y + dispH + 18}" r="4" fill="url(#r-cr)"/>
<rect class="s-part" x="14" y="${bh + 9}" width="16" height="4" rx="1.5" fill="url(#r-pt)"/><rect class="s-part" x="${bw - 30}" y="${bh + 9}" width="16" height="4" rx="1.5" fill="url(#r-pt)"/>
</svg>`;
}
// Ziffern setzen: chars = Zeichen der vier Hauptziffern (+ zwei Sekunden), pm = PM-Punkt leuchtet,
// h12 = 12-Stunden-Anzeige (nur dann gibt es den PM-Punkt überhaupt, bei 24 h ist er ganz weg)
export function retroSet(svg, chars, pm, h12) {
  svg.querySelectorAll('.rt-on .dg').forEach((g, i) => {
    const on = SEG[chars[i]] ?? '';
    if (g._ch === chars[i]) return;
    g._ch = chars[i];
    g.querySelectorAll('.sg').forEach(p => p.classList.toggle('on', on.includes(p.dataset.s)));
  });
  svg.querySelectorAll('.rt-pm').forEach(c => { c.style.display = h12 ? '' : 'none'; });
  svg.querySelector('.rt-on .rt-pm')?.classList.toggle('on', !!pm);
}
export const RETRO_COLORS = ['red', 'green', 'blue', 'amber'];
export const RETRO_CSS = `
.rt{width:100%;max-width:var(--nova-clock-size,520px)}.rt svg{display:block;width:100%;height:auto}
.rt{--led:var(--nv-led-red)}.rt.green{--led:var(--nv-led-green)}.rt.blue{--led:var(--nv-led-blue)}.rt.amber{--led:var(--nv-led-amber)}
/* Ziffernfläche: fast schwarz hinter dunkler Plexiglasscheibe, ganz leicht in der LED-Farbe getönt */
.scene .rt-scr{fill:color-mix(in srgb,var(--led) 4%,#030303);stroke:rgba(255,255,255,.16);stroke-width:.5}
/* Untere Ebene: alle Segmente mit 8 % („88:88“ zu erahnen), obere Ebene: nur leuchtende Segmente mit Glow */
.scene .rt-off .sg,.scene .rt-off circle{fill:var(--led);opacity:.08}
.scene .rt-on .sg,.scene .rt-on .rt-pm{fill:var(--led);opacity:0;transition:opacity .12s}
.scene .rt-on .sg.on,.scene .rt-on .rt-pm.on{opacity:1}
.scene .rt-on .rt-col circle{fill:var(--led)}
.anim .scene .rt-on .rt-col{animation:rt-blink 1s steps(1,end) infinite}
@keyframes rt-blink{50%{opacity:0}}
@media (prefers-reduced-motion:reduce){.scene .rt-col{animation:none!important}}`;
