import {define, docUrl, tag} from './shared/define.js';
import {esc} from './shared/utils.js';
import {NOVA_VARS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {inPicker, watchVisible, weakDevice} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, sel} from './shared/editor-schema.js';
import {watch, recipes as api, storeHint, imageUrl, uploadImage} from './shared/nova-store.js';
import {RICH_CSS, richEditor, sanitize} from './shared/rich-text.js';
import {compressImage} from './shared/media-picker.js';
import {amount, mins, parseIngredient} from './shared/recipe-util.js';

/* ---------- Nova Rezeptbuch ----------
   Ein Kochbuch zum Blättern: zugeklappt der Einband, Tippen schlägt es auf, Wischen blättert. Drei Stile (Option style):
   old = altes, abgegriffenes Kochbuch (Leder, vergilbte Seiten, Handschrift), modern = schlicht und grau, fantasy = Zauberbuch.
   Die Rezepte kommen aus der Nova-Integration (Modul „Rezeptbuch“) – dieselben wie in der Nova Rezeptliste.
   Portionen lassen sich je Rezept umrechnen, die Zutaten gehen umgerechnet auf die Nova-Einkaufsliste.
   Das Buch ist eine Zeichnung: Papier-, Leder- und Goldtöne sind Materialfarben und stehen hier, nicht in den Tokens. */
const DEF = {title: 'Rezepte', subtitle: '', style: 'old', layout: 'auto', cover_color: 'brown', start_open: false, close_after: 0, turn: 'auto'};
const NAV_H = 48;
// Gemessen einmal pro Seite: langsames Gerät → einfaches Blättern (gilt für alle Rezeptbücher)
const Lite = {slow: null, bad: 0};
const COVERS = ['brown', 'red', 'green', 'blue'], STYLES = ['old', 'modern', 'fantasy'];
const OPEN_MS = 1100, TURN_MS = 800, PAGE_RATIO = .72, IMG_MAX = 960;

// Schriften: Caveat (Handschrift) und EB Garamond, Latin-Subset als woff2. Sie liegen in der Nova-Integration und kommen
// von Home Assistant selbst (/nova/static/fonts) – nichts von fremden Servern, nichts im Haupt-Bundle. @font-face wird erst
// gesetzt, wenn ein Rezeptbuch zu sehen ist, und der Browser lädt eine Schrift erst, wenn Text in ihr erscheint.
// Liefert die Integration sie (noch) nicht, greifen die Ersatzschriften. @font-face wirkt nur im Dokument, nicht im Shadow DOM.
const FONT_URL = '/nova/static/fonts';
let fontsLoaded = false;
const loadFonts = () => {
  if (fontsLoaded) return;
  fontsLoaded = true;
  const st = document.createElement('style');
  st.dataset.nova = 'recipe-fonts';
  const ff = (fam, file, w, s = 'normal') => `@font-face{font-family:'${fam}';src:url(${FONT_URL}/${file}.woff2?v=1) format('woff2');font-weight:${w};font-style:${s};font-display:swap}`;
  st.textContent = ff('Nova Hand', 'nova-hand-400', 400) + ff('Nova Hand', 'nova-hand-700', 700) + ff('Nova Serif', 'nova-serif-400', 400) + ff('Nova Serif', 'nova-serif-400-italic', 400, 'italic');
  document.head.append(st);
};

// Rauschen als SVG (Papierfaser, Ledernarbung) – im Code erzeugt, nichts wird geladen
const noise = (freq, oct, rgb, op, type = 'fractalNoise', size = 220) => `url("data:image/svg+xml,${encodeURIComponent(`<svg xmlns='http://www.w3.org/2000/svg' width='${size}' height='${size}'><filter id='n'><feTurbulence type='${type}' baseFrequency='${freq}' numOctaves='${oct}' stitchTiles='stitch'/><feColorMatrix values='0 0 0 0 ${rgb[0]} 0 0 0 0 ${rgb[1]} 0 0 0 0 ${rgb[2]} ${op} 0 0 0 0'/></filter><rect width='100%' height='100%' filter='url(#n)'/></svg>`)}")`;
const PAPER_FIBER = noise(.85, 3, [.35, .24, .1], .55);
const PAPER_CLOUD = noise(.012, 3, [.55, .38, .12], .5, 'fractalNoise', 400);
const LEATHER_GRAIN = noise(1.4, 2, [0, 0, 0], .9, 'turbulence', 160);
const LEATHER_MOTTLE = noise(.02, 3, [.95, .8, .6], .45, 'fractalNoise', 420);

// Flecken je Seite (Kaffeeränder, Stockflecken) – zufällig, aber pro Seite immer gleich
const rnd = seed => () => { seed = (seed + 0x6D2B79F5) | 0; let t = Math.imul(seed ^ (seed >>> 15), 1 | seed); t ^= t + Math.imul(t ^ (t >>> 7), 61 | t); return ((t ^ (t >>> 14)) >>> 0) / 4294967296; };
const stains = seed => {
  const r = rnd(seed * 7919 + 13), out = [];
  if (r() < .55) { const x = 10 + r() * 80, y = 8 + r() * 84, s = 70 + r() * 70; out.push(`radial-gradient(circle ${s}px at ${x}% ${y}%,transparent 82%,rgba(122,74,24,.16) 88%,rgba(122,74,24,.05) 93%,transparent 97%)`); }
  const n = 2 + Math.floor(r() * 5);
  for (let i = 0; i < n; i++) { const x = r() * 100, y = r() * 100, s = 3 + r() * 9; out.push(`radial-gradient(circle ${s}px at ${x}% ${y}%,rgba(140,90,40,${(.12 + r() * .14).toFixed(2)}),transparent)`); }
  if (r() < .35) { const x = r() * 100, y = r() * 100; out.push(`radial-gradient(ellipse 60px 34px at ${x}% ${y}%,rgba(160,110,40,.1),transparent 70%)`); }
  return out.join(',');
};


const BOOK_CSS = `
:host{display:block;height:100%;
--ink:var(--nova-book-ink,#3a2814);--paper:var(--nova-book-paper,#efe0bb);--leather:var(--nova-book-brown,#6b3b1e);--gold:var(--nova-book-gold,#c9a14a);
--f-hand:'Nova Hand','Segoe Script','Bradley Hand',cursive;--f-serif:'Nova Serif',Georgia,'Times New Roman',serif;--acc:#8a1f12;--acc2:#1f4f7a}
:host([cover=red]){--leather:var(--nova-book-red,#5e1a1d)}:host([cover=green]){--leather:var(--nova-book-green,#2e4630)}:host([cover=blue]){--leather:var(--nova-book-blue,#1f2c48)}
*{box-sizing:border-box}
.rb{position:relative;height:100%;min-height:200px;display:flex;flex-direction:column;align-items:center;justify-content:center;overflow:hidden;
font-family:var(--f-serif);color:var(--ink);-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
.stage{position:relative;perspective:2400px;perspective-origin:50% 40%}
.book{position:absolute;inset:0;transform-style:preserve-3d;transition:transform ${OPEN_MS}ms cubic-bezier(.45,.05,.25,1)}
/* Aufgeschlagen gehören waagrechte Wischgesten dem Buch (Nova Swipe Card blättert dann nicht mit), zugeklappt nicht */
.book.open{touch-action:pan-y}
.book.closed{transform:translateX(calc(var(--pw) * -.5))}
.book.single.closed,.book.single{transform:none}
/* Seitenblock: Papierkanten unten und rechts (Buchdicke) */
.block{position:absolute;top:0;bottom:0;right:0;width:var(--pw);border-radius:2px 6px 6px 2px;
background:repeating-linear-gradient(90deg,#e9dcb8 0 1px,#cdbb8f 1px 2px);box-shadow:3px 4px 0 -1px #bfae84,5px 7px 14px rgba(0,0,0,.45);transform:translate3d(4px,4px,-2px)}
.double .block.l{right:auto;left:0;transform:translate3d(-4px,4px,-2px);border-radius:6px 2px 2px 6px}
/* Buchschnitt links erst, wenn dort Seiten liegen – auf der ersten Doppelseite liegt links nur der Einband (wie im echten Buch).
   visibility statt display: die Ebene bleibt bestehen und wird nicht neu aufgebaut. */
.single .block.l,.closed .block.l,.at0 .block.l{visibility:hidden}
/* Seiten */
.pg,.face{position:absolute;top:0;bottom:0;width:var(--pw);overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.pg.r,.leaf{left:auto;right:0}.pg.l{left:0}
/* Feste Tiefen statt z-index (in 3D zählt nur die Tiefe): Einband innen -3, Buchschnitt -2, Seiten +1, Blatt +3, Einband zu +4.
   Keine zwei Flächen liegen gleich tief – sonst flackert es in Safari und schwachen WebViews (Z-Fighting). */
.pg{transform:translateZ(1px)}
.pg,.leaf .face{contain:layout paint}
.single .pg.r,.single .leaf{right:auto;left:0}
.single .pg.l{display:none}
.paper{background-color:var(--paper);background-image:var(--st),${PAPER_FIBER},${PAPER_CLOUD},
radial-gradient(ellipse at 50% 45%,transparent 55%,rgba(120,80,30,.22) 100%);background-size:auto,220px 220px,400px 400px,auto;
box-shadow:inset 0 0 0 1px rgba(110,80,40,.25),inset 0 0 30px rgba(140,95,40,.22)}
.pg.r.paper,.face.f.paper{border-radius:2px 6px 6px 2px}.pg.l.paper,.face.b.paper{border-radius:6px 2px 2px 6px}
/* Schatten am Falz */
.pg.r::before,.leaf .face.f::before{content:"";position:absolute;inset:0 auto 0 0;width:14%;background:linear-gradient(90deg,rgba(60,35,10,.28),rgba(60,35,10,.06) 45%,transparent);pointer-events:none;z-index:2}
.pg.l::before,.leaf .face.b::before{content:"";position:absolute;inset:0 0 0 auto;width:14%;background:linear-gradient(270deg,rgba(60,35,10,.3),rgba(60,35,10,.06) 45%,transparent);pointer-events:none;z-index:2}
.single .pg.r::before,.single .leaf .face.f::before{width:5%}
.in{position:absolute;inset:0;padding:calc(var(--pw) * .09) calc(var(--pw) * .1) calc(var(--pw) * .11);overflow-y:auto;overscroll-behavior:auto contain;scrollbar-width:none;
font-size:clamp(12px,calc(var(--pw) * .036),19px);line-height:1.45}
.in::-webkit-scrollbar{display:none}
.mo{position:absolute;left:0;right:0;bottom:0;height:calc(var(--pw) * .2);z-index:3;display:flex;align-items:flex-end;justify-content:center;padding-bottom:calc(var(--pw) * .06);
background:linear-gradient(180deg,transparent,var(--paper) 70%);opacity:0;pointer-events:none;transition:opacity .25s;cursor:pointer;border-radius:inherit}
.mo::after{content:"";width:calc(var(--pw) * .05);aspect-ratio:1;border-right:2px solid currentColor;border-bottom:2px solid currentColor;transform:rotate(45deg);opacity:.55}
.mu{position:absolute;left:0;right:0;top:0;height:calc(var(--pw) * .16);z-index:3;display:flex;align-items:flex-start;justify-content:center;padding-top:calc(var(--pw) * .04);
background:linear-gradient(0deg,transparent,var(--paper) 70%);opacity:0;pointer-events:none;transition:opacity .25s;cursor:pointer;border-radius:inherit}
.mu::after{content:"";width:calc(var(--pw) * .05);aspect-ratio:1;border-left:2px solid currentColor;border-top:2px solid currentColor;transform:rotate(45deg);opacity:.55;margin-top:calc(var(--pw) * .02)}
.more .mo,.less .mu{opacity:1;pointer-events:auto}.more .no{opacity:0}
.no{position:absolute;bottom:calc(var(--pw) * .035);left:0;right:0;text-align:center;font-style:italic;font-size:clamp(10px,calc(var(--pw) * .026),14px);opacity:.55;pointer-events:none}
.leaf{position:absolute;top:0;bottom:0;width:var(--pw);transform-style:preserve-3d;transform-origin:0 50%;z-index:5;pointer-events:none;will-change:transform;transform:translateZ(3px)}
.leaf .face{left:0}.leaf .face.b{transform:rotateY(180deg)}
.leaf .sh{position:absolute;inset:0;pointer-events:none;z-index:3;opacity:0}
.leaf.fwd{animation:turn-f ${TURN_MS}ms cubic-bezier(.4,.1,.3,1) both}.leaf.bwd{animation:turn-b ${TURN_MS}ms cubic-bezier(.4,.1,.3,1) both}
.leaf .face.f .sh{background:linear-gradient(90deg,rgba(0,0,0,.35),transparent 60%)}.leaf .face.b .sh{background:linear-gradient(270deg,rgba(0,0,0,.35),transparent 60%)}
.leaf.fwd .face.f .sh,.leaf.bwd .face.b .sh{animation:sh-in ${TURN_MS}ms ease-in both}.leaf.fwd .face.b .sh,.leaf.bwd .face.f .sh{animation:sh-out ${TURN_MS}ms ease-out both}
.single .leaf.fwd{animation-name:turn-sf}.single .leaf.bwd{animation-name:turn-sb}
/* Einzelseite: das Blatt blendet aus – die Deckkraft sitzt auf der Seite, nicht am Blatt (opacity am 3D-Blatt würde es flach drücken) */
.single .leaf.fwd .face.f{animation:fade-out ${TURN_MS}ms linear both}.single .leaf.bwd .face.f{animation:fade-out ${TURN_MS}ms linear reverse both}
/* Vorbereitet: Blatt steht schon fertig gezeichnet über der Seite, die Animation läuft erst danach los */
.leaf.prep,.leaf.prep *{animation-play-state:paused!important}
@keyframes turn-f{from{transform:translateZ(3px) rotateY(0)}to{transform:translateZ(3px) rotateY(-180deg)}}
@keyframes turn-b{from{transform:translateZ(3px) rotateY(-180deg)}to{transform:translateZ(3px) rotateY(0)}}
@keyframes turn-sf{from{transform:translateZ(3px) rotateY(0)}to{transform:translateZ(3px) rotateY(-160deg)}}
@keyframes turn-sb{from{transform:translateZ(3px) rotateY(-160deg)}to{transform:translateZ(3px) rotateY(0)}}
@keyframes fade-out{0%,70%{opacity:1}to{opacity:0}}
/* Einfaches Blättern für schwache Geräte (Echo Show, Kiosk-WebView): nur zwei flache Ebenen, die zum Falz hin schmaler werden und
   auf der anderen Seite wieder aufgehen – mit demselben Schatten. Kein 3D, kein preserve-3d. */
.book.lite .leaf{transform-style:flat;transform:translateZ(3px);animation:none;will-change:auto}
.book.lite .leaf .face{will-change:transform;backface-visibility:visible;-webkit-backface-visibility:visible}
.book.lite .leaf .face.f{transform-origin:0 50%}
.book.lite .leaf .face.b{left:calc(var(--pw) * -1);transform-origin:100% 50%}
.book.lite .leaf.fwd .face.f{animation:lt-a ${TURN_MS}ms linear both}.book.lite .leaf.fwd .face.b{animation:lt-b ${TURN_MS}ms linear both}
.book.lite .leaf.bwd .face.f{animation:lt-b ${TURN_MS}ms linear both}.book.lite .leaf.bwd .face.b{animation:lt-a ${TURN_MS}ms linear both}
.book.lite.single .leaf.fwd .face.f{animation:lt-s ${TURN_MS * .8}ms cubic-bezier(.5,0,.75,.5) both}.book.lite.single .leaf.bwd .face.f{animation:lt-s ${TURN_MS * .8}ms cubic-bezier(.5,0,.75,.5) reverse both}
@keyframes lt-a{0%{transform:scaleX(1);animation-timing-function:cubic-bezier(.45,0,.9,.55)}50%,to{transform:scaleX(0)}}
@keyframes lt-b{0%,50%{transform:scaleX(0);animation-timing-function:cubic-bezier(.1,.45,.55,1)}to{transform:scaleX(1)}}
@keyframes lt-s{from{transform:scaleX(1);opacity:1}75%{opacity:1}to{transform:scaleX(.08);opacity:0}}
@keyframes sh-in{from{opacity:0}to{opacity:1}}@keyframes sh-out{from{opacity:1}to{opacity:0}}
/* Einband */
.cover{position:absolute;top:-2%;bottom:-2%;right:-1.5%;width:calc(var(--pw) * 1.03);transform-style:preserve-3d;transform-origin:0 50%;z-index:8;transform:translateZ(4px) rotateY(0);will-change:transform;
transition:transform ${OPEN_MS}ms cubic-bezier(.45,.05,.25,1)}
.single .cover{right:auto;left:0}
.cover .face{width:100%;top:0;bottom:0;left:0}.cover .face.b{transform:rotateY(180deg)}
.open .cover{transform:translateZ(-3px) rotateY(-180deg)}
.single.open .cover{transform:translateZ(-3px) rotateY(-160deg)}
/* ausblenden über die Seiten des Einbands – opacity am 3D-Einband selbst würde ihn mitten in der Drehung flach drücken */
.cover .face{transition:opacity .3s}.single.open .cover .face{opacity:0;transition:opacity .3s ${OPEN_MS * .7}ms}
.cover.gone{visibility:hidden}
.leather{border-radius:3px 10px 10px 3px;background-color:var(--leather);
background-image:radial-gradient(ellipse at 88% 6%,rgba(255,230,190,.32),transparent 22%),radial-gradient(ellipse at 92% 96%,rgba(255,225,180,.3),transparent 20%),
radial-gradient(ellipse at 30% 98%,rgba(255,220,170,.16),transparent 25%),radial-gradient(ellipse 40% 30% at 62% 40%,rgba(0,0,0,.18),transparent 70%),
radial-gradient(ellipse at 20% 15%,rgba(255,220,170,.1),transparent 30%),${LEATHER_MOTTLE},${LEATHER_GRAIN},
linear-gradient(100deg,rgba(0,0,0,.35),rgba(255,255,255,.06) 18%,rgba(0,0,0,.08) 60%,rgba(0,0,0,.3));
background-size:auto,auto,auto,auto,auto,420px 420px,160px 160px,auto;background-blend-mode:normal,normal,normal,normal,normal,soft-light,multiply,normal;
box-shadow:inset 0 0 0 1px rgba(0,0,0,.5),inset 0 0 40px rgba(0,0,0,.5),inset -3px 0 6px rgba(255,220,180,.12),6px 8px 22px rgba(0,0,0,.5)}
/* Rücken mit Bünden und abgegriffener Kante */
.spine{position:absolute;inset:0 auto 0 0;width:9%;border-radius:3px 0 0 3px;
background:linear-gradient(90deg,rgba(0,0,0,.45),rgba(255,230,190,.12) 40%,rgba(0,0,0,.35)),
repeating-linear-gradient(180deg,transparent 0 17%,rgba(0,0,0,.35) 17% 18%,rgba(255,220,170,.18) 18% 19%,transparent 19% 21%)}
.stitch{position:absolute;inset:6% 7% 6% 13%;border:2px dashed rgba(235,205,150,.35);border-radius:6px;box-shadow:0 0 0 1px rgba(0,0,0,.25),inset 0 0 0 1px rgba(0,0,0,.25)}
.emb{position:absolute;inset:0 0 0 9%;display:flex;flex-direction:column;align-items:center;justify-content:center;gap:calc(var(--pw) * .03);text-align:center;padding:0 12%}
.emb .orn{width:56%;height:auto;opacity:.9}
.emb h1{margin:0;font-family:var(--f-serif);font-style:italic;font-weight:400;font-size:clamp(22px,calc(var(--pw) * .13),78px);line-height:1.05;
background:linear-gradient(170deg,#f3dc9a,var(--gold) 45%,#8a6424 70%,#d9b665);-webkit-background-clip:text;background-clip:text;color:transparent;
filter:drop-shadow(0 1px 0 rgba(0,0,0,.6)) drop-shadow(0 -1px 0 rgba(255,230,180,.15));opacity:.92}
.emb p{margin:0;font-family:var(--f-hand);font-size:clamp(14px,calc(var(--pw) * .06),34px);color:#e9cf93;opacity:.75;text-shadow:0 1px 0 rgba(0,0,0,.6)}
.emb .gold{fill:none;stroke:var(--gold);stroke-width:1.2;opacity:.85}
/* abgewetzte Ecken */
.wear{position:absolute;inset:0;border-radius:inherit;pointer-events:none;
background:radial-gradient(circle at 100% 0,rgba(240,210,170,.35),transparent 7%),radial-gradient(circle at 100% 100%,rgba(240,210,170,.32),transparent 7%),
linear-gradient(180deg,rgba(255,225,180,.12),transparent 3%,transparent 97%,rgba(255,225,180,.12));mix-blend-mode:screen}
.inside{background-color:#e7d6ae;background-image:var(--st),${PAPER_FIBER},radial-gradient(ellipse at 50% 50%,transparent 50%,rgba(110,70,20,.3)),
repeating-linear-gradient(45deg,rgba(120,80,30,.05) 0 6px,transparent 6px 12px);border-radius:10px 3px 3px 10px;
box-shadow:inset 0 0 0 8px var(--leather),inset 0 0 0 9px rgba(0,0,0,.4),inset 0 0 40px rgba(110,70,20,.35)}
.inside .ded{position:absolute;inset:18% 16%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:8px;
font-family:var(--f-hand);font-size:clamp(18px,calc(var(--pw) * .085),46px);transform:rotate(-3deg);opacity:.8}
.inside .ded small{font-size:.55em;opacity:.75}
.hit{position:absolute;inset:0;cursor:pointer;z-index:9}
/* Lesebändchen zum Schließen */
.ribbon{position:absolute;top:calc(100% - 6px);left:calc(var(--bw) / 2 + var(--pw) * .1);width:clamp(14px,calc(var(--pw) * .045),24px);height:calc(var(--tail) + 6px);z-index:7;transform:translateZ(5px);cursor:pointer;border:0;padding:0;
background:linear-gradient(90deg,#7c1d1d,#b03030 50%,#7c1d1d);clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%);box-shadow:0 2px 4px rgba(0,0,0,.4);
transition:opacity .4s;opacity:0;pointer-events:none}
.single .ribbon{left:12%}
.open .ribbon{opacity:1;pointer-events:auto;transition-delay:${OPEN_MS}ms}
/* Navigation unter dem Buch: Zurück, Inhalt, Weiter – groß genug für Wandpanels; Platz ist immer reserviert (Kartenhöhe bleibt gleich) */
.nav{position:relative;display:flex;align-items:center;justify-content:space-between;gap:8px;width:var(--bw);height:${NAV_H}px;margin-top:var(--tail);flex:none;
opacity:0;pointer-events:none;transition:opacity .35s}
.rb.isopen .nav{opacity:1;pointer-events:auto;transition-delay:${OPEN_MS * .6}ms}
.nb{min-width:${NAV_H}px;height:${NAV_H}px;display:inline-flex;align-items:center;justify-content:center;gap:.25em;padding:0 1em;border-radius:999px;cursor:pointer;
font-family:var(--f-hand);font-weight:700;font-size:20px;line-height:1;color:var(--ink);background-color:var(--paper);background-image:${PAPER_FIBER};background-size:220px 220px;
border:1.5px solid rgba(70,45,20,.45);box-shadow:inset 0 0 12px rgba(140,95,40,.2),0 2px 6px rgba(0,0,0,.35);transition:transform .15s,opacity .2s;-webkit-tap-highlight-color:transparent}
.nb ha-icon{--mdc-icon-size:24px;flex:none}
.nb:active:not([disabled]){transform:scale(.94)}
.nb[disabled]{opacity:.38;cursor:default;box-shadow:inset 0 0 12px rgba(140,95,40,.2)}
.nav.tight .nb.prev span,.nav.tight .nb.next span{display:none}
.nav.tight .nb.prev,.nav.tight .nb.next{padding:0}
/* Inhalt der Seiten */
h2{margin:0 0 .35em;font-family:var(--f-hand);font-weight:700;font-size:2.15em;line-height:1;color:var(--ink);transform:rotate(-1deg)}
h3{margin:1em 0 .3em;font-family:var(--f-hand);font-weight:700;font-size:1.45em;line-height:1;border-bottom:1px solid rgba(70,45,20,.3);padding-bottom:.15em}
h3:first-child{margin-top:0}
ul.ing{list-style:none;margin:0;padding:0}ul.ing li{padding:.12em 0 .12em 1.1em;position:relative;border-bottom:1px dotted rgba(70,45,20,.22)}
ul.ing li::before{content:"–";position:absolute;left:.1em;font-family:var(--f-hand);font-weight:700}
ol.st{list-style:none;margin:0;padding:0;counter-reset:s}ol.st li{counter-increment:s;position:relative;padding:.25em 0 .35em 2em}
ol.st li::before{content:counter(s);position:absolute;left:0;top:.05em;width:1.45em;height:1.45em;border:1.5px solid rgba(70,45,20,.55);border-radius:50%;
display:flex;align-items:center;justify-content:center;font-family:var(--f-hand);font-weight:700;font-size:1.05em;line-height:1;transform:rotate(-4deg)}
.toc h2{text-align:center;transform:none;margin-bottom:.6em}
.toc .it{display:flex;align-items:baseline;gap:.4em;width:100%;border:0;background:none;color:inherit;font:inherit;padding:.32em 0;cursor:pointer;text-align:left}
.toc .it .t{font-family:var(--f-hand);font-size:1.35em;line-height:1.1}
.toc .it .d{flex:1;border-bottom:2px dotted rgba(70,45,20,.35);transform:translateY(-.25em)}
.toc .it .n{font-style:italic;opacity:.75}
.toc .it:active .t{text-decoration:underline}
.msg{font-family:var(--f-hand);font-size:1.35em;line-height:1.25;text-align:center;margin:1em 0;opacity:.85}
.msg.hint{text-align:left;font-size:1.25em}.msg.hint ol{margin:.4em 0 0;padding-left:1.2em}.msg.hint code{font-family:inherit;background:rgba(120,80,30,.12);padding:0 .2em;border-radius:3px}
.act{display:flex;flex-wrap:wrap;gap:.5em;justify-content:center;margin-top:1.2em}
.btn{display:inline-flex;align-items:center;gap:.35em;border:1.5px solid rgba(70,45,20,.5);border-radius:999px;background:rgba(255,248,225,.35);color:var(--ink);
font-family:var(--f-hand);font-size:1.2em;font-weight:700;padding:.15em .8em .2em;cursor:pointer;line-height:1.2;transition:background-color .2s,transform .15s}
.btn ha-icon{--mdc-icon-size:1em}
.btn:active{transform:scale(.95)}.btn.warn{border-color:rgba(150,30,20,.7);color:#8a1f12;background:rgba(200,60,40,.12)}
.btn.ok{border-color:rgba(40,100,40,.6);color:#2e5e22}
.btn[disabled]{opacity:.45;cursor:default}.btn.ok[disabled],.btn.warn[disabled]{opacity:1}
.tools{display:flex;gap:.4em;justify-content:flex-end;margin-top:1.2em}
.tools .btn{font-size:1em;padding:.1em .6em}
/* eingeklebtes Foto mit Fotoecken */
.photo{position:relative;margin:.4em auto 1em;width:86%;padding:4%;background:#f7f1e3;box-shadow:0 2px 6px rgba(60,35,10,.35),0 0 0 1px rgba(0,0,0,.05);transform:rotate(-1.6deg)}
.photo img{-webkit-user-drag:none;pointer-events:none;display:block;width:100%;aspect-ratio:4/3;object-fit:cover;filter:sepia(.18) saturate(.9) contrast(.96)}
.photo i{position:absolute;width:16%;aspect-ratio:1;background:linear-gradient(135deg,#3a2a1c,#1b130c 60%,#3d2c1d);box-shadow:0 1px 1px rgba(0,0,0,.3)}
.photo i::after{content:"";position:absolute;inset:0;background:linear-gradient(135deg,rgba(255,255,255,.18),transparent 40%);clip-path:inherit}
.photo i.tl{top:-2%;left:-2%;clip-path:polygon(0 0,100% 0,0 100%)}.photo i.tr{top:-2%;right:-2%;clip-path:polygon(0 0,100% 0,100% 100%)}
.photo i.bl{bottom:-2%;left:-2%;clip-path:polygon(0 0,100% 100%,0 100%)}.photo i.br{bottom:-2%;right:-2%;clip-path:polygon(100% 0,100% 100%,0 100%)}
/* Formular: Karteikarte über dem Buch */
.form{position:absolute;inset:0;z-index:20;display:flex;align-items:center;justify-content:center;background:rgba(20,12,4,.45);padding:12px;animation:fade .25s}
.form[hidden]{display:none}
@keyframes fade{from{opacity:0}}
.card{position:relative;width:min(640px,100%);max-height:100%;overflow-y:auto;overscroll-behavior:contain;border-radius:6px;padding:20px 22px 18px;
background-color:#f6ecd2;background-image:${PAPER_FIBER},repeating-linear-gradient(180deg,transparent 0 31px,rgba(80,110,160,.18) 31px 32px),
linear-gradient(90deg,transparent 46px,rgba(190,60,60,.3) 46px 47px,transparent 47px);box-shadow:0 12px 40px rgba(0,0,0,.5);transform:rotate(-.6deg);font-size:16px}
.card h2{font-size:2em}
.card label{display:block;font-family:var(--f-hand);font-weight:700;font-size:1.3em;margin:.6em 0 .15em}
.card input[type=text],.card textarea{width:100%;font:inherit;font-size:16px;color:var(--ink);background:rgba(255,255,255,.45);border:1px solid rgba(70,45,20,.35);border-radius:4px;
padding:.45em .6em;outline:none;-webkit-user-select:text;user-select:text}
.card textarea{min-height:7.5em;resize:vertical;line-height:1.45}
.card .ing{display:grid;grid-template-columns:4.6em 5.4em 1fr auto;gap:6px;align-items:center;margin-bottom:6px}
.card .ing input,.card .ing select{min-width:0}
.card .ing select{width:100%;font:inherit;font-size:16px;color:var(--ink);background:rgba(255,255,255,.45);border:1px solid rgba(70,45,20,.35);border-radius:4px;padding:.45em .3em;outline:none}
.card .ing .x{border:0;background:none;color:var(--ink);font-size:1.4em;line-height:1;width:1.6em;height:1.6em;cursor:pointer;opacity:.6}
.card .ing .x:hover{opacity:1}
.card input:focus,.card textarea:focus,.card select:focus{border-color:rgba(70,45,20,.8);box-shadow:0 0 0 3px rgba(150,100,40,.2)}
.card .pic{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.card .pic img{width:110px;height:82px;object-fit:cover;border:4px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3);transform:rotate(-2deg)}
.card .pic input[type=file]{display:none}
.card .row{display:flex;gap:10px;justify-content:flex-end;margin-top:1em;flex-wrap:wrap}
.card .err{color:#8a1f12;font-family:var(--f-hand);font-size:1.2em;min-height:1.2em;margin-top:.4em}
.card small{display:block;opacity:.65;font-style:italic}
@media (prefers-reduced-motion:reduce){.book,.cover,.cover .face,.leaf,.leaf .face,.leaf .sh{transition:none!important;animation-duration:1ms!important}}
.still .book,.still .cover,.still .cover .face{transition:none!important}
/* ----- Neu gegenüber dem ersten Buch: Angaben, Portionen, formatierte Zubereitung ----- */
.meta{margin:-.1em 0 .7em;font-style:italic;opacity:.7;font-size:.92em}
h3.zl{display:flex;align-items:flex-end;gap:.4em}
h3 .sv{margin-left:auto;display:inline-flex;align-items:center;gap:.35em;font-family:var(--f-serif);font-weight:400;font-style:italic;font-size:.62em;white-space:nowrap;transform:translateY(-.1em)}
.sb{width:30px;height:30px;border-radius:50%;border:1.5px solid rgba(70,45,20,.5);background:rgba(255,248,225,.35);color:var(--ink);font:inherit;font-style:normal;font-weight:700;font-size:16px;line-height:1;
cursor:pointer;padding:0;display:inline-flex;align-items:center;justify-content:center;transition:transform .15s}
.sb:active{transform:scale(.88)}
.sb[disabled]{opacity:.35;cursor:default}
ul.ing li .q{display:inline-block;margin-right:.35em;font-variant-numeric:tabular-nums}
ul.ing li .q[hidden]{display:none}
ul.ing li .q.bump{animation:q-bump .35s ease}
@keyframes q-bump{40%{transform:scale(1.25)}}
ol.st li p{margin:0}
.in .fs-s{font-size:.85em}.in .fs-l{font-size:1.2em}.in .c-accent{color:var(--acc2)}.in .c-warn{color:var(--acc)}.in .c-muted{opacity:.55}
.in u{text-decoration-thickness:1px;text-underline-offset:.15em}
/* Formular: Felder nebeneinander, Zubereitung mit Formatierungsleiste (Farben des Papiers statt Nova-Glas) */
.card{--nv-tint:70,45,20;--nv-fg:var(--ink);--nv-active:#7a4a1c;--nv-active-fg:#fff8e1;--nv-text-accent:var(--acc2);--nv-text-warn:var(--acc);--nv-glow:0%;color:var(--ink)}
.card .two{display:grid;grid-template-columns:1fr 1fr;gap:0 12px}
.card input[type=number]{width:100%;font:inherit;font-size:16px;color:var(--ink);background:rgba(255,255,255,.45);border:1px solid rgba(70,45,20,.35);border-radius:4px;padding:.45em .6em;outline:none}
.card .rte{min-height:7.5em;font-size:16px;color:var(--ink);background:rgba(255,255,255,.45);border:1px solid rgba(70,45,20,.35);border-radius:4px;padding:.45em .6em;outline:none;
-webkit-user-select:text;user-select:text;margin-top:6px}
.card .rte:focus{border-color:rgba(70,45,20,.8);box-shadow:0 0 0 3px rgba(150,100,40,.2)}
/* Kapitel-Zeile über dem Rezepttitel gibt es nur im Fantasy Book */
.chap{display:none}

/* ===== Modern Book: schlicht, grau, ohne Gebrauchsspuren ===== */
:host([book=modern]) .nb{font-weight:600;font-size:15px;letter-spacing:.01em;background-image:none;border:1px solid rgba(0,0,0,.12);border-radius:14px;box-shadow:0 1px 3px rgba(0,0,0,.22)}
:host([book=modern]) .nb[disabled]{box-shadow:none}
:host([book=modern]){--f-hand:system-ui,-apple-system,'Segoe UI',Roboto,'Helvetica Neue',sans-serif;--f-serif:var(--f-hand);--paper:#f3f3f1;--ink:#24272c;--gold:#d7dadf;--leather:#4a4e55;--acc:#b3261e;--acc2:#2b5c8a}
:host([book=modern][cover=red]){--leather:#6d4a4f}:host([book=modern][cover=green]){--leather:#4a5a52}:host([book=modern][cover=blue]){--leather:#44506a}
:host([book=modern]) .paper{background-image:none;box-shadow:inset 0 0 0 1px rgba(0,0,0,.08)}
:host([book=modern]) .block{background:#e4e4e1;box-shadow:2px 3px 0 -1px #cfcfcb,4px 6px 14px rgba(0,0,0,.3)}
:host([book=modern]) .pg.r::before,:host([book=modern]) .leaf .face.f::before{background:linear-gradient(90deg,rgba(0,0,0,.14),rgba(0,0,0,.03) 45%,transparent)}
:host([book=modern]) .pg.l::before,:host([book=modern]) .leaf .face.b::before{background:linear-gradient(270deg,rgba(0,0,0,.14),rgba(0,0,0,.03) 45%,transparent)}
:host([book=modern]) .leather{border-radius:3px 8px 8px 3px;background-image:linear-gradient(100deg,rgba(0,0,0,.2),rgba(255,255,255,.06) 18%,rgba(0,0,0,.03) 60%,rgba(0,0,0,.16));background-size:auto;background-blend-mode:normal;
box-shadow:inset 0 0 0 1px rgba(0,0,0,.25),6px 8px 22px rgba(0,0,0,.35)}
:host([book=modern]) .spine{background:linear-gradient(90deg,rgba(0,0,0,.25),rgba(255,255,255,.07) 60%,rgba(0,0,0,.14))}
:host([book=modern]) .stitch,:host([book=modern]) .wear,:host([book=modern]) .emb .orn{display:none}
:host([book=modern]) .emb{align-items:flex-start;justify-content:flex-end;text-align:left;padding:0 10% 14%;gap:calc(var(--pw) * .015)}
:host([book=modern]) .emb h1{font-style:normal;font-weight:300;letter-spacing:-.01em;background:none;color:#f1f2f4;filter:none;opacity:1;font-size:clamp(20px,calc(var(--pw) * .11),64px)}
:host([book=modern]) .emb h1::after{content:"";display:block;width:2.2em;height:2px;background:currentColor;opacity:.5;margin-top:.35em}
:host([book=modern]) .emb p{color:#f1f2f4;opacity:.6;text-shadow:none;font-size:clamp(12px,calc(var(--pw) * .045),24px)}
:host([book=modern]) .inside{background-color:#e9e9e6;background-image:none;box-shadow:inset 0 0 0 8px var(--leather)}
:host([book=modern]) .inside .ded{transform:none;font-weight:300;opacity:.6}
:host([book=modern]) h2{transform:none;font-weight:600;font-size:1.7em;letter-spacing:-.01em;line-height:1.1;margin-bottom:.5em}
:host([book=modern]) h3{font-weight:600;font-size:.82em;text-transform:uppercase;letter-spacing:.08em;border-bottom-color:rgba(0,0,0,.12);padding-bottom:.45em;color:rgba(36,39,44,.6)}
:host([book=modern]) h3 .sv{font-style:normal;font-size:1.05em;text-transform:none;letter-spacing:0;color:var(--ink)}
:host([book=modern]) .sb{border:1px solid rgba(0,0,0,.18);background:rgba(0,0,0,.04);font-weight:400}
:host([book=modern]) ul.ing li{border-bottom:1px solid rgba(0,0,0,.07);padding-left:0}
:host([book=modern]) ul.ing li::before{content:none}
:host([book=modern]) ul.ing li .q{font-weight:600}
:host([book=modern]) ol.st li::before{transform:none;border:0;background:rgba(0,0,0,.08);font-weight:600;font-size:.8em;width:1.8em;height:1.8em}
:host([book=modern]) .toc h2{text-align:left}
:host([book=modern]) .toc .it .t{font-size:1.05em}
:host([book=modern]) .toc .it .d{border-bottom:1px solid rgba(0,0,0,.12)}
:host([book=modern]) .toc .it .n,:host([book=modern]) .no,:host([book=modern]) .meta{font-style:normal}
:host([book=modern]) .msg{font-size:1em;opacity:.65}
:host([book=modern]) .btn{font-size:.9em;font-weight:600;border:1px solid rgba(0,0,0,.2);background:rgba(0,0,0,.04);padding:.45em 1em}
:host([book=modern]) .tools .btn{font-size:.85em;padding:.4em .9em}
:host([book=modern]) .photo{transform:none;padding:0;background:none;box-shadow:none;width:100%}
:host([book=modern]) .photo img{filter:none;border-radius:8px}
:host([book=modern]) .photo i{display:none}
:host([book=modern]) .ribbon{background:#8b9099}
:host([book=modern]) .card{transform:none;background-color:#f6f6f4;background-image:none;border-radius:12px;--nv-tint:0,0,0;--nv-active:#4a4e55;--nv-active-fg:#fff}
:host([book=modern]) .card label{font-size:.85em;font-weight:600;opacity:.75}
:host([book=modern]) .card h2{font-size:1.4em}
:host([book=modern]) .card .pic img{transform:none;border:0;border-radius:6px}
:host([book=modern]) .card .err{font-size:.9em}

/* ===== Fantasy Book: hochwertige Hardcover-Ausgabe – matter Einband, Goldfolie, Farbschnitt, sauberes Papier, Kapitel-Optik.
   Bewusst ohne Filter, Texturen und Dauer-Animationen (läuft auch auf dem Echo Show). ===== */


:host([book=fantasy]){--f-hand:'Nova Serif',Georgia,'Times New Roman',serif;--f-serif:'Nova Serif',Georgia,'Times New Roman',serif;--paper:#f6efdd;--ink:#2a2420}
:host([book=fantasy]) .paper,:host([book=fantasy]) .pg,:host([book=fantasy]) .face.paper{--st:none;background-image:none;background-color:var(--paper);box-shadow:inset 0 0 0 1px rgba(60,40,20,.07)}
:host([book=fantasy]) .pg.r::before,:host([book=fantasy]) .leaf .face.f::before{width:9%;background:linear-gradient(90deg,rgba(40,28,15,.16),rgba(40,28,15,.03) 45%,transparent)}
:host([book=fantasy]) .pg.l::before,:host([book=fantasy]) .leaf .face.b::before{width:9%;background:linear-gradient(270deg,rgba(40,28,15,.18),rgba(40,28,15,.03) 45%,transparent)}
:host([book=fantasy]) .block{background:var(--edge);box-shadow:inset 0 0 0 1px rgba(214,183,110,.3),2px 3px 0 -1px rgba(0,0,0,.4),4px 7px 14px rgba(0,0,0,.4);transform:translate3d(6px,6px,-2px)}
:host([book=fantasy]) .double .block.l{transform:translate3d(-6px,6px,-2px)}
:host([book=fantasy]) .leather{border-radius:2px 6px 6px 2px;background-color:var(--leather);background-image:linear-gradient(100deg,rgba(0,0,0,.3),rgba(255,255,255,.05) 11%,transparent 28%,rgba(0,0,0,.1));
background-size:auto;background-blend-mode:normal;box-shadow:inset 0 0 0 1px rgba(0,0,0,.45),5px 7px 18px rgba(0,0,0,.45)}
:host([book=fantasy]) .spine{width:7%;border-radius:2px 0 0 2px;background:linear-gradient(90deg,rgba(0,0,0,.4),rgba(255,255,255,.07) 55%,rgba(0,0,0,.3))}
:host([book=fantasy]) .wear{display:none}
:host([book=fantasy]) .emb{inset:0 0 0 7%}
:host([book=fantasy]) .emb h1{font-style:normal;font-weight:400;background:linear-gradient(180deg,#f3dfa6,var(--gold) 50%,#a9823a);-webkit-background-clip:text;background-clip:text;color:transparent;filter:none;opacity:1}
:host([book=fantasy]) .emb p{font-family:var(--f-serif);font-style:italic;color:var(--gold);opacity:.85;text-shadow:none}
:host([book=fantasy]) .emb .gold{stroke:var(--gold);opacity:1}
:host([book=fantasy]) .inside{background-color:var(--leather);background-image:var(--endpaper);box-shadow:inset 0 0 0 14px var(--leather),inset 0 0 0 15px rgba(214,183,110,.35),inset 0 0 0 1px rgba(0,0,0,.4)}
:host([book=fantasy]) .inside .ded{inset:30% 18%;transform:none;font-family:var(--f-serif);font-variant:small-caps;letter-spacing:.08em;font-size:clamp(15px,calc(var(--pw) * .06),30px);color:var(--ink);background:var(--paper);
box-shadow:0 0 0 1px var(--gold),0 0 0 4px var(--paper),0 0 0 5px var(--gold);opacity:1}
:host([book=fantasy]) .inside .ded small{font-variant:normal;font-style:italic;letter-spacing:0}
:host([book=fantasy]) h2{font-family:var(--f-serif);font-weight:400;transform:none;text-align:center;font-size:1.85em;line-height:1.12;margin-bottom:.25em}
:host([book=fantasy]) h2::first-letter{color:var(--acc)}
:host([book=fantasy]) .meta{text-align:center;font-style:italic;opacity:.65;padding-bottom:16px;background:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20120%2010%22%3E%3Cpath%20d%3D%22M2%205H50M70%205H118%22%20stroke%3D%22%239a8255%22%20stroke-width%3D%22.8%22%2F%3E%3Cpath%20d%3D%22M60%201l4%204-4%204-4-4z%22%20fill%3D%22%239a8255%22%2F%3E%3Ccircle%20cx%3D%2253%22%20cy%3D%225%22%20r%3D%221%22%20fill%3D%22%239a8255%22%2F%3E%3Ccircle%20cx%3D%2267%22%20cy%3D%225%22%20r%3D%221%22%20fill%3D%22%239a8255%22%2F%3E%3C%2Fsvg%3E") bottom center/46% 9px no-repeat}
:host([book=fantasy]) h3{font-family:var(--f-serif);font-weight:400;font-variant:small-caps;letter-spacing:.14em;font-size:1.08em;border:0;padding:0;margin:1.1em 0 .55em;color:var(--acc)}
:host([book=fantasy]) h3 .sv{font-variant:normal;letter-spacing:0;color:var(--ink);font-size:.8em}
:host([book=fantasy]) .sb{width:28px;height:28px;border:1px solid rgba(60,40,20,.3);background:transparent;font-weight:400;font-size:15px}
:host([book=fantasy]) ul.ing li{border-bottom:1px solid rgba(60,40,20,.09);padding-left:1em}
:host([book=fantasy]) ul.ing li::before{content:"◆";font-size:.45em;top:.85em;color:var(--acc);font-family:var(--f-serif)}
:host([book=fantasy]) ol.st li{padding-left:1.8em}
:host([book=fantasy]) ol.st li::before{content:counter(s);border:0;transform:none;font-family:var(--f-serif);font-weight:400;font-style:italic;font-size:1.15em;color:var(--acc);width:1.2em;justify-content:flex-start}
:host([book=fantasy]) .toc h2{font-variant:small-caps;letter-spacing:.12em;padding-bottom:18px;background:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20120%2010%22%3E%3Cpath%20d%3D%22M2%205H50M70%205H118%22%20stroke%3D%22%239a8255%22%20stroke-width%3D%22.8%22%2F%3E%3Cpath%20d%3D%22M60%201l4%204-4%204-4-4z%22%20fill%3D%22%239a8255%22%2F%3E%3Ccircle%20cx%3D%2253%22%20cy%3D%225%22%20r%3D%221%22%20fill%3D%22%239a8255%22%2F%3E%3Ccircle%20cx%3D%2267%22%20cy%3D%225%22%20r%3D%221%22%20fill%3D%22%239a8255%22%2F%3E%3C%2Fsvg%3E") bottom center/52% 9px no-repeat;margin-bottom:.8em}
:host([book=fantasy]) .toc .it .t{font-family:var(--f-serif);font-size:1.08em}
:host([book=fantasy]) .toc .it .d{border-bottom:1px dotted rgba(60,40,20,.35)}
:host([book=fantasy]) .toc .it .n{font-style:normal;opacity:.7}
:host([book=fantasy]) .no{font-style:normal;letter-spacing:.15em;opacity:.5}
:host([book=fantasy]) .msg{font-family:var(--f-serif);font-style:italic;font-size:1.05em;opacity:.7}
:host([book=fantasy]) .btn{font-family:var(--f-serif);font-weight:400;font-variant:small-caps;letter-spacing:.06em;font-size:1em;border:1px solid rgba(60,40,20,.3);background:transparent;padding:.3em 1em}
:host([book=fantasy]) .tools .btn{font-size:.85em}
:host([book=fantasy]) .photo{transform:none;padding:0;background:none;box-shadow:0 1px 5px rgba(0,0,0,.2);width:100%}:host([book=fantasy]) .photo i{display:none}:host([book=fantasy]) .photo img{filter:none}
:host([book=fantasy]) .ribbon{background:var(--rib);clip-path:polygon(0 0,100% 0,100% 100%,50% 84%,0 100%);box-shadow:none}
:host([book=fantasy]) .nb{font-family:var(--f-serif);font-variant:small-caps;letter-spacing:.07em;font-weight:400;font-size:19px;color:var(--gold);background-color:var(--leather);background-image:linear-gradient(180deg,rgba(255,255,255,.06),rgba(0,0,0,.15));
border:1px solid var(--gold);box-shadow:0 2px 6px rgba(0,0,0,.35)}

:host([book=fantasy]){--leather:#1b2338;--gold:#d6b76e;--acc:#7a5a1f;--rib:linear-gradient(90deg,#9c7a2e,#f1d68e 42%,#c9a24e 58%,#8a6a25);
--edge:linear-gradient(135deg,rgba(214,183,110,.22),rgba(214,183,110,.06) 50%,rgba(214,183,110,.2)),var(--leather);
--endpaper:repeating-linear-gradient(90deg,transparent 0 13px,rgba(214,183,110,.28) 13px 14px),repeating-linear-gradient(0deg,transparent 0 13px,rgba(214,183,110,.14) 13px 14px)}
:host([book=fantasy]) .stitch{display:block;inset:0 0 0 7%;border:0;border-radius:0;box-shadow:none;background:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20100%20140%22%20preserveAspectRatio%3D%22none%22%3E%3Cg%20fill%3D%22none%22%20stroke-width%3D%221.6%22%3E%3Cpath%20stroke%3D%22rgba(0%2C0%2C0%2C.45)%22%20d%3D%22M10%2010h80v120H10z%20M18%2018h64v104H18z%22%2F%3E%3Cpath%20stroke%3D%22rgba(255%2C255%2C255%2C.09)%22%20d%3D%22M10%2011h80v120H10z%20M18%2019h64v104H18z%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") center/100% 100% no-repeat}
:host([book=fantasy]) .emb .orn{display:none}
:host([book=fantasy]) .emb::before,:host([book=fantasy]) .emb::after{content:"";width:56%;aspect-ratio:200/60;flex:none;background:url("data:image/svg+xml,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20viewBox%3D%220%200%20200%2060%22%3E%3Cg%20fill%3D%22none%22%20stroke%3D%22%23d6b76e%22%20stroke-width%3D%221%22%3E%3Cpath%20d%3D%22M100%2058V2%22%2F%3E%3Cpath%20d%3D%22M100%2058L35.1%2037.0%22%2F%3E%3Cpath%20d%3D%22M100%2058L45.6%2022.8%22%2F%3E%3Cpath%20d%3D%22M100%2058L60.9%2011.6%22%2F%3E%3Cpath%20d%3D%22M100%2058L79.5%204.4%22%2F%3E%3Cpath%20d%3D%22M100%2058L100.0%202.0%22%2F%3E%3Cpath%20d%3D%22M100%2058L120.5%204.4%22%2F%3E%3Cpath%20d%3D%22M100%2058L139.1%2011.6%22%2F%3E%3Cpath%20d%3D%22M100%2058L154.4%2022.8%22%2F%3E%3Cpath%20d%3D%22M100%2058L164.9%2037.0%22%2F%3E%3Cpath%20d%3D%22M30%2058a70%2056%200%200%201%20140%200%22%2F%3E%3Cpath%20d%3D%22M52%2058a48%2038%200%200%201%2096%200%22%2F%3E%3Cpath%20d%3D%22M2%2058H198%22%2F%3E%3C%2Fg%3E%3C%2Fsvg%3E") center/contain no-repeat}
:host([book=fantasy]) .emb::before{order:-1;margin-bottom:calc(var(--pw) * .02)}:host([book=fantasy]) .emb::after{order:9;margin-top:calc(var(--pw) * .02);transform:scaleY(-1)}
:host([book=fantasy]) .emb h1{text-transform:uppercase;letter-spacing:.2em;text-indent:.2em;font-size:clamp(16px,calc(var(--pw) * .085),48px);padding:.45em 0;border-top:1px solid var(--gold);border-bottom:1px solid var(--gold)}
:host([book=fantasy]) .emb p{letter-spacing:.06em;text-indent:.06em}
:host([book=fantasy]) h2::first-letter{font-size:1.3em}

:host([book=fantasy][cover=brown]){--leather:#1b2338}:host([book=fantasy][cover=red]){--leather:#4b1622}:host([book=fantasy][cover=green]){--leather:#173229}:host([book=fantasy][cover=blue]){--leather:#1b2338}
:host([book=fantasy]) .chap{display:block;text-align:center;font-family:var(--f-serif);font-size:.62em;letter-spacing:.35em;text-transform:uppercase;color:var(--acc);margin:0 0 .9em}
:host([book=fantasy]) .card{transform:none;background-color:var(--paper);background-image:none;border-radius:4px;box-shadow:0 0 0 1px var(--gold),0 0 0 5px var(--paper),0 0 0 6px var(--gold),0 12px 40px rgba(0,0,0,.55);--nv-active:var(--leather);--nv-active-fg:var(--gold)}
:host([book=fantasy]) .card h2{font-variant:small-caps;letter-spacing:.06em}
:host([book=fantasy]) .card label{font-family:var(--f-serif);font-variant:small-caps;font-weight:400;letter-spacing:.1em;font-size:1em;color:var(--acc)}
:host([book=fantasy]) .card .err{font-style:italic;font-size:1em}
@media (prefers-reduced-motion:reduce){ul.ing li .q.bump{animation:none}}
`;

// Zierlinie für den Einband (Goldprägung)
const ORN = `<svg class="orn" viewBox="0 0 200 24" aria-hidden="true"><path class="gold" d="M4 12H78M122 12H196M84 12c4-8 12-8 16 0s12 8 16 0M84 12c4 8 12 8 16 0s12-8 16 0"/><circle cx="100" cy="12" r="2.2" fill="currentColor" class="gold"/></svg>`;

// Zubereitung (bereinigtes HTML aus der Formatierungsleiste) als nummerierte Schritte: jeder Absatz und jeder Listenpunkt ein Schritt,
// Überschriften bleiben Überschriften. Fett, Kursiv, Größen und Farben bleiben erhalten.
// Kapitelnummer als römische Zahl (Fantasy Book)
const roman = n => {
  if (!(n > 0)) return '';
  let out = '';
  for (const [v, t] of [[1000, 'M'], [900, 'CM'], [500, 'D'], [400, 'CD'], [100, 'C'], [90, 'XC'], [50, 'L'], [40, 'XL'], [10, 'X'], [9, 'IX'], [5, 'V'], [4, 'IV'], [1, 'I']]) while (n >= v) { out += t; n -= v; }
  return out;
};
function stepsHtml(html) {
  const t = document.createElement('template');
  t.innerHTML = sanitize(html || '');
  const out = [];
  let open = false;
  const li = h => { if (!h.replace(/<br\s*\/?>|&nbsp;|\s/g, '')) return; if (!open) { out.push('<ol class="st">'); open = true; } out.push(`<li>${h}</li>`); };
  const close = () => { if (open) { out.push('</ol>'); open = false; } };
  [...t.content.childNodes].forEach(n => {
    if (n.nodeType === 3) { if (n.textContent.trim()) li(esc(n.textContent)); return; }
    if (n.nodeType !== 1) return;
    if (n.localName === 'h3') { close(); out.push(`<h3>${n.innerHTML}</h3>`); }
    else if (n.localName === 'ul') [...n.children].forEach(c => li(c.innerHTML));
    else li(n.localName === 'p' ? n.innerHTML : n.outerHTML);
  });
  close();
  return out.join('');
}

class NovaRecipeBookCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('recipe-book-card-editor')); }
  static getStubConfig() { return {}; }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    const was = this._c;
    this._c = {...DEF, ...c};
    this.setAttribute('cover', COVERS.includes(this._c.cover_color) ? this._c.cover_color : 'brown');
    this.setAttribute('book', STYLES.includes(this._c.style) ? this._c.style : 'old');
    if (this._e) {
      if (!was || was.title !== this._c.title || was.subtitle !== this._c.subtitle) this._coverText();
      if (this._vis && this._c.style !== 'modern') loadFonts();
      this._resize(true);
    }
  }
  set hass(h) {
    this._h = h;
    if (!this._c) return;
    if (!this._e) this._build();
    this._watch();
  }
  getCardSize() { return 8; }
  getGridOptions() { return {columns: 12, rows: 8, min_columns: 6, min_rows: 5}; }
  connectedCallback() {
    this._quiet = inPicker(this);
    // Schriften erst, wenn das Buch wirklich zu sehen ist (z. B. nicht auf einer anderen Seite der Swipe Card);
    // das Siegel des Fantasy Book glimmt nur, solange das Buch im Bild ist
    this._stopVis?.();
    this._stopVis = watchVisible(this, v => {
      this._vis = v;
      if (v && this._c?.style !== 'modern') loadFonts();
      this._e?.rb.classList.toggle('live', v && !this._quiet);
    });
    if (!this._e && this._c && this._h) this._build();
    if (this._e) { this._ro?.observe(this); this._watch(); }
  }
  disconnectedCallback() {
    this._ro?.disconnect();
    this._stopVis?.(); this._stopVis = null;
    this._off?.(); this._off = null;
    clearTimeout(this._idle); clearTimeout(this._tt); clearTimeout(this._delT); clearTimeout(this._ct);
  }

  /* ---------- Aufbau ---------- */
  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${RICH_CSS}${BOOK_CSS}</style><div class="rb"><div class="stage"><div class="book closed">
<div class="block l"></div><div class="block r"></div>
<div class="pg l paper"><div class="in"></div><div class="mu" aria-hidden="true"></div><div class="mo" aria-hidden="true"></div><div class="no"></div></div><div class="pg r paper"><div class="in"></div><div class="mu" aria-hidden="true"></div><div class="mo" aria-hidden="true"></div><div class="no"></div></div>
<div class="cover"><div class="face f leather"><div class="spine"></div><div class="stitch"></div><div class="emb">${ORN}<h1></h1><p></p>${ORN}</div><div class="wear"></div></div>
<div class="face b inside"><div class="ded"></div></div><div class="hit" role="button" aria-label="Buch öffnen"></div></div>
<button class="ribbon" aria-label="Buch schließen" title="Buch schließen"></button>
</div></div><nav class="nav" aria-label="Blättern"><button class="nb prev" aria-label="Zurück"><ha-icon icon="mdi:chevron-left"></ha-icon><span>Zurück</span></button>
<button class="nb toc"><ha-icon icon="mdi:format-list-bulleted"></ha-icon><span>Inhalt</span></button>
<button class="nb next" aria-label="Weiter"><span>Weiter</span><ha-icon icon="mdi:chevron-right"></ha-icon></button></nav><div class="form" hidden></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {rb: q('.rb'), stage: q('.stage'), book: q('.book'), L: q('.pg.l'), R: q('.pg.r'), cover: q('.cover'), ded: q('.ded'), h1: q('.emb h1'), sub: q('.emb p'), form: q('.form'),
      nav: q('.nav'), prev: q('.nb.prev'), toc: q('.nb.toc'), next: q('.nb.next')};
    this._e.cover.style.setProperty('--st', stains(99));
    this._e.cover.querySelector('.inside').style.setProperty('--st', stains(98));
    this._e.rb.classList.toggle('live', !!this._vis && !this._quiet);
    this._sp = 0; this._open = false; this._serv = new Map();
    this._coverText();
    q('.hit').addEventListener('click', () => this._setOpen(true));
    q('.ribbon').addEventListener('click', () => this._setOpen(false));
    [this._e.L, this._e.R].forEach(pg => {
      pg.querySelector('.in').addEventListener('scroll', () => this._over(pg), {passive: true});
      // Antippen der Hinweise scrollt ein Stück weiter bzw. zurück
      const by = k => ev => { ev.stopPropagation(); const i = pg.querySelector('.in'); i.scrollBy({top: i.clientHeight * .7 * k, behavior: 'smooth'}); };
      pg.querySelector('.mo').addEventListener('click', by(1));
      pg.querySelector('.mu').addEventListener('click', by(-1));
    });
    this._e.prev.addEventListener('click', () => this._go(this._sp - 1));
    this._e.next.addEventListener('click', () => this._go(this._sp + 1));
    this._e.toc.addEventListener('click', () => this._go(0));
    this._gestures();
    this._ro = new ResizeObserver(() => this._resize());
    if (this.isConnected) this._ro.observe(this);
    if (this._c.start_open && !this._quiet) this._setOpen(true, false);
  }
  _coverText() {
    const c = this._c, e = this._e;
    e.h1.textContent = c.title || DEF.title;
    e.sub.textContent = c.subtitle || '';
    e.sub.hidden = !c.subtitle;
    e.ded.innerHTML = `<span>${esc(c.title || DEF.title)}</span>${c.subtitle ? `<small>${esc(c.subtitle)}</small>` : ''}`;
  }
  // Größe: Seite im Verhältnis 0,72, so groß wie der Platz erlaubt. Ohne feste Höhe (Masonry) ergibt sich die Höhe aus der Breite.
  _resize(force) {
    const e = this._e, c = this._c;
    if (!e) return;
    const W = this.clientWidth || 0, Hh = this.clientHeight || 0;
    if (!W) return;
    const auto = Hh < 150;
    // unter dem Buch: Ende des Lesebändchens, darunter die Navigation – immer reserviert, damit die Höhe gleich bleibt
    const dbl = c.layout === 'double' || (c.layout !== 'single' && W >= 560 && (auto || W / Math.max(Hh, 1) > 1.05));
    const pad = Math.max(10, W * .025);
    let pw = dbl ? (W - 2 * pad) / 2 : W - 2 * pad;
    const tail = p => Math.round(Math.min(40, Math.max(22, p * .08)));
    if (!auto) pw = Math.min(pw, (Hh - 2 * pad - NAV_H - tail(pw)) * PAGE_RATIO);
    pw = Math.max(120, Math.floor(pw));
    const tl = tail(pw);
    const ph = Math.floor(pw / PAGE_RATIO), bw = dbl ? 2 * pw : pw;
    if (auto) e.rb.style.height = `${ph + 2 * pad + NAV_H + tl}px`; else e.rb.style.removeProperty('height');
    e.rb.style.setProperty('--tail', `${tl}px`);
    // schmal: Zurück/Weiter nur als Pfeil (Beschriftung lieber weglassen als abschneiden)
    e.nav.classList.toggle('tight', bw < 360);
    e.stage.style.width = `${bw}px`; e.stage.style.height = `${ph}px`;
    e.rb.style.setProperty('--pw', `${pw}px`); e.rb.style.setProperty('--bw', `${bw}px`);
    if (force || dbl !== this._dbl) {
      const spreads = this._spreads(this._dbl), cur = spreads[this._sp];
      this._dbl = dbl;
      e.book.classList.toggle('double', dbl); e.book.classList.toggle('single', !dbl);
      // gleiche Stelle im Buch behalten, wenn zwischen Doppel- und Einzelseite gewechselt wird
      const ns = this._spreads(dbl), key = cur && (cur.rid ?? cur.key);
      const i = ns.findIndex(s => (s.rid ?? s.key) === key);
      this._sp = i >= 0 ? i : Math.min(this._sp, ns.length - 1);
      this._paint();
    }
    requestAnimationFrame(() => { if (this._e) [this._e.L, this._e.R].forEach(pg => this._over(pg, true)); });
  }

  /* ---------- Daten ---------- */
  // Rezepte aus der Nova-Integration (ein Abo für alle Rezept-Karten); in der Kartenauswahl zwei Beispielrezepte
  _watch() {
    if (!this._h || !this.isConnected || !this._e) return;
    if (this._quiet) { if (!this._recipes) { this._recipes = DEMO; this._paint(); } return; }
    if (this._off) return;
    this._off = watch(this._h, 'recipes', this, (d, err) => { this._units = d?.units || this._units; this._setRecipes(d?.recipes, err); });
  }
  _setRecipes(list, err) {
    const spreads = this._spreads(this._dbl), cur = spreads[this._sp], key = cur && (cur.rid ?? cur.key);
    this._err = list ? null : err || null;
    // Im Buch stehen die Rezepte nach dem Alphabet
    this._recipes = list ? [...list].sort((a, b) => String(a.title).localeCompare(String(b.title), 'de')) : err ? [] : null;
    // Nach dem Speichern eines neuen Rezepts dorthin blättern, sonst auf derselben Seite bleiben
    const ns = this._spreads(this._dbl);
    if (this._jump) {
      const i = ns.findIndex(s => s.rid === this._jump);
      if (i >= 0) { this._jump = null; this._sp = i; }
    } else {
      const i = ns.findIndex(s => (s.rid ?? s.key) === key);
      this._sp = i >= 0 ? i : Math.max(0, Math.min(this._sp, ns.length - 1));
    }
    this._paint();
  }
  _servings(r) { return this._serv.get(r.id) || r.servings || 1; }

  /* ---------- Seiten ---------- */
  // Doppelseiten: [Vorsatz | Inhalt], dann je Rezept [Titel, Foto, Zutaten | Zubereitung]. Einzelseiten: Inhalt, dann je Rezept eine Seite.
  _spreads(dbl = this._dbl) {
    const rs = this._recipes || [];
    return dbl ? [{key: 'toc', L: {k: 'end'}, R: {k: 'toc', n: 1}}, ...rs.map((r, i) => ({rid: r.id, L: {k: 'A', r, n: 2 * i + 2}, R: {k: 'B', r, n: 2 * i + 3}}))]
      : [{key: 'toc', P: {k: 'toc', n: 1}}, ...rs.map((r, i) => ({rid: r.id, P: {k: 'R', r, n: i + 2}}))];
  }
  _pageNo(i) { return this._dbl ? 2 * i + 2 : i + 2; }
  _paint() {
    const e = this._e;
    if (!e || this._dbl == null || this._turning) return;
    const s = this._spreads()[this._sp] || this._spreads()[0];
    this._navState(this._sp);
    e.book.classList.toggle('at0', this._sp === 0);
    if (this._dbl) { this._fill(e.L, s.L); this._fill(e.R, s.R); e.L.style.visibility = s.L.k === 'end' ? 'hidden' : ''; }
    else this._fill(e.R, s.P);
  }
  // Seite füllen: Inhalt + Seitenzahl + eigene Flecken
  _fill(pg, d) {
    const inn = pg.querySelector('.in'), no = pg.querySelector('.no');
    const sig = JSON.stringify([d.k, d.r?.id, d.r?.updated, d.n, d.k === 'toc' ? [this._recipes?.length, this._err, (this._recipes || []).map(r => r.title)] : 0, this._dbl]);
    if (pg._sig === sig) return;
    pg._sig = sig;
    pg.style.setProperty('--st', stains(d.n || 0));
    inn.replaceChildren(this._content(d));
    inn.scrollTop = 0;
    // Hinweis „geht weiter“ prüfen, sobald die Seite steht und sobald Bilder geladen sind
    if (pg.classList.contains('pg')) {
      requestAnimationFrame(() => this._over(pg, true));
      inn.querySelectorAll('img').forEach(i => i.addEventListener('load', () => this._over(pg, true), {once: true}));
    }
    no.textContent = d.n && d.k !== 'end' ? `— ${d.n} —` : '';
  }
  // Passt der Inhalt nicht auf die Seite, zeigt unten ein Verlauf mit Pfeil, dass es weitergeht (verschwindet am Ende),
  // und oben einer mit Pfeil nach oben, sobald man weitergescrollt hat
  // Vorher: Foto so weit verkleinern, dass alles auf die Seite passt (höchstens bis auf ein Viertel der Seitenhöhe)
  // (nur auf der Doppelseite: dort steht links Titel, Foto und Zutaten; die Einzelseite scrollt ohnehin)
  _over(pg, fit) {
    const i = pg.querySelector('.in'), img = fit && this._dbl && i.querySelector('.photo img');
    if (img && img.complete) {
      img.style.removeProperty('height');
      const extra = i.scrollHeight - i.clientHeight, h = img.clientHeight;
      if (extra > 0 && h) img.style.height = `${Math.max(i.clientHeight * .25, h - extra - 2)}px`;
    }
    pg.classList.toggle('more', i.scrollHeight - i.scrollTop - i.clientHeight > 6);
    pg.classList.toggle('less', i.scrollTop > 6);
  }
  _content(d) {
    const box = document.createElement('div');
    const r = d.r;
    if (d.k === 'end') { box.className = 'inside'; return box; }
    if (d.k === 'toc') {
      box.className = 'toc';
      box.innerHTML = '<h2>Inhalt</h2>';
      const msg = t => { const m = document.createElement('div'); m.className = 'msg'; m.textContent = t; box.append(m); };
      if (this._err) { msg(storeHint(this._err, 'recipes')[1]); return box; }
      if (!this._recipes) { msg('Einen Moment, die Seiten werden geblättert …'); return box; }
      if (!this._recipes.length) box.insertAdjacentHTML('beforeend', '<div class="msg">Noch keine Rezepte.<br>Trag das erste ein!</div>');
      this._recipes.forEach((x, i) => {
        const b = document.createElement('button');
        b.className = 'it';
        b.innerHTML = '<span class="t"></span><span class="d"></span><span class="n"></span>';
        b.firstChild.textContent = x.title;
        b.lastChild.textContent = this._pageNo(i);
        b.addEventListener('click', ev => { ev.stopPropagation(); this._go(i + 1); });
        box.append(b);
      });
      if (!this._quiet) {
        const act = document.createElement('div');
        act.className = 'act';
        act.append(this._btn('mdi:plus', 'Neues Rezept', () => this._edit(null)));
        box.append(act);
      }
      return box;
    }
    const src = r.image ? imageUrl(this._h, 'recipes', r.image) : '', meta = [r.time ? mins(r.time) : '', ...(r.tags || [])].filter(Boolean).join(' · ');
    const head = () => `<div class="chap">Kapitel ${roman((this._recipes || []).indexOf(r) + 1)}</div><h2>${esc(r.title)}</h2>${meta ? `<div class="meta">${esc(meta)}</div>` : ''}`;
    const photo = () => src ? `<div class="photo"><img alt="" loading="lazy" src="${esc(src)}"><i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i></div>` : '';
    const ing = () => r.ingredients?.length ? `<h3 class="zl"><span>Zutaten</span><span class="sv"><button class="sb" data-d="-1" aria-label="Weniger Portionen">−</button><span class="svn"></span><button class="sb" data-d="1" aria-label="Mehr Portionen">+</button></span></h3>
<ul class="ing">${r.ingredients.map(() => '<li><span class="q"></span><span class="nm"></span></li>').join('')}</ul>` : '';
    const steps = () => { const h = stepsHtml(r.steps); return h ? `${/^<h3/.test(h) ? '' : '<h3>Zubereitung</h3>'}${h}` : ''; };
    if (d.k === 'A') box.innerHTML = head() + photo() + ing();
    else if (d.k === 'B') box.innerHTML = steps() || '<div class="msg">Ohne Anleitung – einfach drauflos kochen.</div>';
    else box.innerHTML = head() + photo() + ing() + steps();
    box.dataset.rid = r.id;
    box.querySelectorAll('.sb').forEach(b => b.addEventListener('click', ev => { ev.stopPropagation(); this._step(r, +b.dataset.d); }));
    this._paintIng(box, r);
    if (d.k !== 'A') box.append(this._tools(r));
    return box;
  }
  // Mengen einer Rezeptseite für die gewählten Portionen eintragen
  _paintIng(box, r, bump) {
    const n = this._servings(r), k = n / (r.servings || 1), lis = box.querySelectorAll('ul.ing li');
    (r.ingredients || []).forEach((x, i) => {
      const li = lis[i];
      if (!li) return;
      const q = li.firstChild;
      q.textContent = amount(x, k); q.hidden = x.qty == null && !x.unit;
      li.lastChild.textContent = x.name;
      if (bump && x.qty != null) { q.classList.remove('bump'); void q.offsetWidth; q.classList.add('bump'); }
    });
    const sv = box.querySelector('.svn');
    if (sv) sv.textContent = `${n} ${n === 1 ? 'Portion' : 'Portionen'}`;
    const [minus, plus] = box.querySelectorAll('.sb');
    if (minus) { minus.disabled = n <= 1; plus.disabled = n >= 99; }
  }
  // Portionen umrechnen – gilt, bis das Buch zugeklappt wird, und ändert das Rezept nicht
  _step(r, dir) {
    const n = Math.max(1, Math.min(99, this._servings(r) + dir));
    if (n === this._servings(r)) return;
    this._serv.set(r.id, n);
    this._poke();
    this.shadowRoot.querySelectorAll('.in > div').forEach(box => { if (box.dataset.rid === r.id) this._paintIng(box, r, true); });
  }
  _btn(icon, label, fn, cls = '') {
    const b = document.createElement('button');
    b.className = `btn ${cls}`;
    b.innerHTML = `<ha-icon icon="${icon}"></ha-icon><span></span>`;
    b.lastChild.textContent = label;
    b.addEventListener('click', ev => { ev.stopPropagation(); fn(b); });
    return b;
  }
  // Knöpfe unter einem Rezept: Zutaten auf die Einkaufsliste, Bearbeiten, Löschen (mit Rückfrage)
  _tools(r) {
    const w = document.createElement('div');
    if (this._quiet) return w;
    if (r.ingredients?.length) {
      const act = document.createElement('div');
      act.className = 'act';
      act.append(this._btn('mdi:cart-plus', 'Zutaten auf die Einkaufsliste', b => this._toList(r, b)));
      w.append(act);
    }
    const t = document.createElement('div');
    t.className = 'tools';
    t.append(this._btn('mdi:pencil', 'Bearbeiten', () => this._edit(r)), this._btn('mdi:delete-outline', 'Löschen', b => this._del(r, b)));
    w.append(t);
    return w;
  }

  /* ---------- Öffnen, Blättern, Gesten ---------- */
  // Vor dem Aufklappen: Seiten fertig setzen, Schriften und Bilder laden – höchstens 800 ms, dann geht es trotzdem los.
  // So ist beim Aufklappen alles schon gezeichnet und nichts wird während der Bewegung neu gesetzt.
  async _ready() {
    const r = this.shadowRoot, wait = [];
    if (this._c.style !== 'modern' && document.fonts?.load) {
      loadFonts();
      wait.push(...['400 16px "Nova Hand"', '700 16px "Nova Hand"', '400 16px "Nova Serif"', 'italic 400 16px "Nova Serif"'].map(f => document.fonts.load(f).catch(() => null)));
    }
    r.querySelectorAll('.pg img, .cover img').forEach(i => wait.push(i.decode?.().catch(() => null)));
    await Promise.race([Promise.all(wait), new Promise(res => setTimeout(res, 800))]);
  }
  _setOpen(open, anim = true, ready = false) {
    const e = this._e;
    if (!e || open === this._open || this._quiet && open) return;
    if (open && anim && !ready) {
      if (this._prep) return;
      this._prep = true;
      this._resize(true);
      // zwei Bilder warten: Seiten sind gezeichnet (unter dem Einband), dann klappt der Deckel in einem Zug auf
      this._ready().then(() => requestAnimationFrame(() => requestAnimationFrame(() => { this._prep = false; this._setOpen(true, true, true); })));
      return;
    }
    this._open = open;
    this._resize(true);
    e.book.classList.toggle('still', !anim);
    e.cover.classList.remove('gone');
    e.book.classList.toggle('open', open);
    e.book.classList.toggle('closed', !open);
    e.rb.classList.toggle('isopen', open);
    clearTimeout(this._ct);
    // Einzelseite: der Einband klappt ganz weg und wird danach ausgeblendet
    if (open && !this._dbl) this._ct = setTimeout(() => e.cover.classList.add('gone'), anim ? OPEN_MS : 0);
    if (!open) { this._sp = 0; this._serv.clear(); this._ct = setTimeout(() => { [e.L, e.R].forEach(p => { p._sig = null; }); this._paint(); }, anim ? OPEN_MS : 0); }
    this._poke();
  }
  // Nach close_after Sekunden ohne Bedienung wieder zuklappen
  _poke() {
    clearTimeout(this._idle);
    const s = +this._c.close_after;
    if (this._open && s > 0) this._idle = setTimeout(() => { if (this._e.form.hidden) this._setOpen(false); else this._poke(); }, s * 1000);
  }
  _navState(i) {
    const e = this._e, n = this._spreads().length;
    e.prev.disabled = i <= 0; e.toc.disabled = i <= 0; e.next.disabled = i >= n - 1;
  }
  // Einfaches Blättern? Option turn: auto (schwaches Gerät oder zu wenige Bilder pro Sekunde gemessen), 3d, simple
  _lite() {
    const t = this._c.turn;
    if (t === 'simple') return true;
    if (t === '3d') return false;
    if (Lite.slow == null) { let v = null; try { v = localStorage.getItem('nova-book-lite'); } catch (_) { /* egal */ } Lite.slow = v === '1' || weakDevice(); }
    return Lite.slow;
  }
  // Bilder pro Sekunde beim 3D-Blättern messen: zweimal unter ~35 fps → ab dann einfach blättern (merkt sich das Gerät)
  _measure(leaf) {
    let n = 0, t0 = 0;
    const tick = t => { if (!leaf.isConnected || leaf.classList.contains('prep')) return; if (!t0) t0 = t; n++; if (t - t0 < TURN_MS - 40) requestAnimationFrame(tick); else done(t); };
    const done = t => {
      const fps = (n - 1) * 1000 / Math.max(1, t - t0);
      if (fps >= 35) { Lite.bad = 0; return; }
      if (++Lite.bad < 2) return;
      Lite.slow = true;
      try { localStorage.setItem('nova-book-lite', '1'); } catch (_) { /* egal */ }
    };
    requestAnimationFrame(tick);
  }
  _go(i) {
    const n = this._spreads().length;
    i = Math.max(0, Math.min(n - 1, i));
    if (i === this._sp || this._turning || !this._open) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const dir = i > this._sp ? 1 : -1, from = this._spreads()[this._sp], to = this._spreads()[i];
    this._poke();
    this._navState(i);
    if (reduce) { this._sp = i; this._paint(); return; }
    const e = this._e, leaf = document.createElement('div'), lite = this._lite();
    // Das Blatt ist eine fertige Seite (Papier, Rahmen, Falz, Inhalt) und bewegt sich als Ganzes
    leaf.className = `leaf prep ${dir > 0 ? 'fwd' : 'bwd'}`;
    leaf.innerHTML = '<div class="face f paper"><div class="in"></div><div class="no"></div><div class="sh"></div></div><div class="face b paper"><div class="in"></div><div class="no"></div><div class="sh"></div></div>';
    const [ff, fb] = leaf.querySelectorAll('.face');
    let under;
    if (this._dbl) {
      // vorwärts: Blatt zeigt vorne die alte rechte, hinten die neue linke Seite; darunter rechts kommt die neue rechte
      if (dir > 0) { this._fill(ff, from.R); this._fill(fb, to.L); under = () => this._fill(e.R, to.R); }
      else { this._fill(ff, to.R); this._fill(fb, from.L); under = () => { this._fill(e.L, to.L); e.L.style.visibility = to.L.k === 'end' ? 'hidden' : ''; e.book.classList.toggle('at0', i === 0); }; }
    } else {
      if (dir > 0) { this._fill(ff, from.P); under = () => this._fill(e.R, to.P); } else this._fill(ff, to.P);
      fb.replaceChildren();
    }
    this._turning = true;
    e.book.classList.toggle('lite', lite);
    // 1. Blatt angehalten in Startstellung zeichnen (deckt die Seite darunter genau ab)
    // 2. erst dann die Seite darunter tauschen – so blitzt nichts und während der Bewegung wird nichts neu gesetzt
    // 3. Bewegung starten (nur transform/opacity)
    e.book.append(leaf);
    const raf = f => requestAnimationFrame(() => requestAnimationFrame(f));
    raf(() => {
      if (!leaf.isConnected) return;
      under?.();
      requestAnimationFrame(() => {
        if (!leaf.isConnected) return;
        leaf.classList.remove('prep');
        if (!lite && this._c.turn !== '3d') this._measure(leaf);
        this._tt = setTimeout(() => {
          // erst die Seite unter dem Blatt fertig machen, dann das Blatt wegnehmen
          this._turning = false; this._sp = i; this._paint();
          raf(() => leaf.remove());
        }, TURN_MS + 30);
      });
    });
  }
  _gestures() {
    const b = this._e.book;
    let x0 = null, y0 = 0, t0 = 0;
    b.addEventListener('pointerdown', ev => { if (!this._open || ev.button > 0) return; x0 = ev.clientX; y0 = ev.clientY; t0 = Date.now(); this._poke(); });
    const end = ev => {
      if (x0 == null) return;
      const dx = ev.clientX - x0, dy = ev.clientY - y0, dt = Date.now() - t0;
      x0 = null;
      if (Math.abs(dx) > 40 && Math.abs(dx) > Math.abs(dy) * 1.3 && dt < 900) this._go(this._sp + (dx < 0 ? 1 : -1));
    };
    b.addEventListener('pointerup', end);
    b.addEventListener('pointercancel', () => { x0 = null; });
    // Bilder nicht ziehen lassen – sonst bricht der Browser die Wischgeste ab
    b.addEventListener('dragstart', ev => ev.preventDefault());
    // Tastatur: Pfeile blättern
    this.tabIndex = this.tabIndex >= 0 ? this.tabIndex : 0;
    this.addEventListener('keydown', ev => {
      if (!this._open || !this._e.form.hidden) return;
      if (ev.key === 'ArrowRight') this._go(this._sp + 1); else if (ev.key === 'ArrowLeft') this._go(this._sp - 1);
    });
  }

  /* ---------- Einkaufsliste ---------- */
  // Alle Zutaten für die gewählten Portionen auf die Nova-Einkaufsliste; was dort schon offen steht, wird in der Menge erhöht
  async _toList(r, b) {
    const h = this._h, label = b.lastChild;
    if (!h || b.disabled) return;
    b.disabled = true;
    label.textContent = 'Wird eingetragen …';
    try {
      const n = await api.toShopping(h, r.id, this._servings(r));
      label.textContent = n ? `${n} ${n === 1 ? 'Zutat' : 'Zutaten'} eingetragen` : 'Steht schon alles drauf';
      b.classList.add('ok');
    } catch (err) {
      console.warn('[nova-cards] Rezeptbuch: Einkaufsliste', err);
      label.textContent = err?.code === 'module_disabled' ? 'Einkauf ist abgeschaltet' : 'Hat nicht geklappt';
      b.classList.add('warn');
    }
    setTimeout(() => { b.disabled = false; b.classList.remove('ok', 'warn'); label.textContent = 'Zutaten auf die Einkaufsliste'; }, 3500);
  }

  /* ---------- Bearbeiten, Löschen ---------- */
  _del(r, b) {
    const label = b.lastChild;
    if (!b.classList.contains('warn')) {
      b.classList.add('warn'); label.textContent = 'Wirklich löschen?';
      clearTimeout(this._delT);
      this._delT = setTimeout(() => { b.classList.remove('warn'); label.textContent = 'Löschen'; }, 4000);
      return;
    }
    clearTimeout(this._delT);
    b.disabled = true;
    api.remove(this._h, r.id).catch(err => {
      console.warn('[nova-cards] Rezeptbuch: Löschen fehlgeschlagen', err);
      b.disabled = false; label.textContent = 'Fehler – nochmal?';
    });
  }
  // Karteikarte über dem Buch: Titel, Portionen, Zeit, Schlagwörter, Bild, Zutaten (eine pro Zeile), Zubereitung mit Formatierung
  _edit(r) {
    if (this._err || !this._recipes) return;
    const f = this._e.form, st = {image: r?.image || null, data: null};
    f.innerHTML = `<form class="card" novalidate><h2>${r ? 'Rezept bearbeiten' : 'Neues Rezept'}</h2>
<label for="t">Titel</label><input id="t" type="text" maxlength="200" autocomplete="off" enterkeyhint="next">
<div class="two"><div><label for="p">Portionen</label><input id="p" type="number" min="1" max="99" inputmode="numeric"></div>
<div><label for="z">Zeit in Minuten</label><input id="z" type="number" min="0" max="6000" inputmode="numeric" placeholder="–"></div></div>
<label for="g">Schlagwörter</label><input id="g" type="text" autocomplete="off" placeholder="z. B. schnell, vegetarisch"><small>Mit Komma getrennt</small>
<label>Bild</label><div class="pic"><img alt="" hidden><button type="button" class="btn" data-a="pick"><ha-icon icon="mdi:camera-outline"></ha-icon><span>Foto wählen</span></button>
<button type="button" class="btn" data-a="clear" hidden><ha-icon icon="mdi:close"></ha-icon><span>Entfernen</span></button><input type="file" accept="image/*"></div>
<label>Zutaten</label><div class="ings"></div><button type="button" class="btn" data-a="add"><ha-icon icon="mdi:plus"></ha-icon><span>Zutat</span></button>
<small>Menge und Einheit getrennt – dann lassen sich die Portionen umrechnen. Mehrere Zeilen („250 g Mehl“) lassen sich auch einfügen.</small>
<label>Zubereitung</label><div class="steps"></div><small>Ein Absatz oder Listenpunkt je Schritt</small>
<div class="err"></div><div class="row"><button type="button" class="btn" data-a="cancel">Abbrechen</button><button type="submit" class="btn ok"><ha-icon icon="mdi:content-save-outline"></ha-icon><span>Speichern</span></button></div></form>`;
    const q = s => f.querySelector(s), img = q('.pic img'), file = q('input[type=file]'), clr = q('[data-a=clear]'), err = q('.err');
    const rt = richEditor({placeholder: 'Mehl und Eier verrühren …'});
    rt.set(r?.steps || '');
    q('.steps').append(rt.el);
    q('#t').value = r?.title || '';
    q('#p').value = r?.servings || 2;
    q('#z').value = r?.time ?? '';
    q('#g').value = (r?.tags || []).join(', ');
    // Zutaten als Zeilen: Menge | Einheit (Liste der Integration) | Zutat | Entfernen
    const ings = q('.ings'), units = this._units?.length ? this._units : [''];
    const row = (ing = {qty: null, unit: '', name: ''}, after = null) => {
      const el = document.createElement('div'); el.className = 'ing';
      const opts = [...new Set([...units, ing.unit || ''])].map(u => `<option value="${esc(u)}">${esc(u || '–')}</option>`).join('');
      el.innerHTML = `<input type="text" class="qty" inputmode="decimal" placeholder="Menge" aria-label="Menge" autocomplete="off"><select aria-label="Einheit">${opts}</select>
<input type="text" class="nm" maxlength="120" placeholder="Zutat" aria-label="Zutat" autocomplete="off" enterkeyhint="next"><button type="button" class="x" aria-label="Zutat entfernen">×</button>`;
      const [qt, un, nm] = el.querySelectorAll('input,select');
      qt.value = ing.qty == null ? '' : String(ing.qty).replace('.', ',');
      un.value = ing.unit || ''; nm.value = ing.name || '';
      el.querySelector('.x').addEventListener('click', () => { el.remove(); if (!ings.children.length) row(); });
      // Enter springt in die nächste Zeile bzw. legt eine neue an
      nm.addEventListener('keydown', ev => { if (ev.key !== 'Enter') return; ev.preventDefault(); (el.nextElementSibling || row()).querySelector('.qty').focus(); });
      // Mehrere Zeilen einfügen („250 g Mehl“ …) legt je Zeile eine Zutat an
      nm.addEventListener('paste', ev => {
        const t = ev.clipboardData?.getData('text') || '';
        if (!t.includes('\n')) return;
        ev.preventDefault();
        let at = el;
        t.split('\n').map(x => parseIngredient(x, units)).filter(Boolean).forEach((x, k) => {
          if (k === 0 && !qt.value && !nm.value) { qt.value = x.qty == null ? '' : String(x.qty).replace('.', ','); un.value = x.unit; nm.value = x.name; }
          else at = row(x, at);
        });
      });
      if (after) after.after(el); else ings.append(el);
      return el;
    };
    (r?.ingredients?.length ? r.ingredients : [undefined]).forEach(x => row(x));
    q('[data-a=add]').addEventListener('click', () => row().querySelector('.qty').focus());
    const showPic = src => { img.hidden = !src; if (src) img.src = src; else img.removeAttribute('src'); clr.hidden = !src; };
    showPic(st.image ? imageUrl(this._h, 'recipes', st.image) : null);
    // Tippen im Formular soll keine Tastenkürzel von HA oder das Blättern auslösen
    f.addEventListener('keydown', ev => ev.stopPropagation());
    f.addEventListener('pointerdown', ev => ev.stopPropagation());
    q('[data-a=pick]').addEventListener('click', () => file.click());
    clr.addEventListener('click', () => { st.image = null; st.data = null; showPic(null); });
    file.addEventListener('change', async () => {
      const fl = file.files?.[0];
      if (!fl) return;
      err.textContent = '';
      // Bild vor dem Hochladen verkleinern (längste Seite 960 px)
      try { st.data = await compressImage(fl, IMG_MAX); st.image = null; showPic(st.data); } catch (x) { err.textContent = 'Das Bild ließ sich nicht lesen.'; console.warn(x); }
    });
    q('[data-a=cancel]').addEventListener('click', () => this._closeForm());
    q('form').addEventListener('submit', async ev => {
      ev.preventDefault();
      const title = q('#t').value.trim(), save = q('button[type=submit]');
      if (!title) { err.textContent = 'Ein Titel fehlt noch.'; q('#t').focus(); return; }
      save.disabled = true; err.textContent = '';
      try {
        let image = st.image;
        if (st.data) image = (await uploadImage(this._h, 'recipes', st.data)).image;
        const z = q('#z').value.trim();
        const recipe = {...(r ? {id: r.id} : {}), title, image, servings: Math.max(1, Math.min(99, Math.round(+q('#p').value) || 2)), time: z === '' ? null : Math.max(0, Math.round(+z) || 0),
          tags: q('#g').value.split(',').map(x => x.trim()).filter(Boolean),
          ingredients: [...ings.children].map(el => {
            const [qt, un, nm] = el.querySelectorAll('input,select'), v = parseFloat(qt.value.replace(',', '.'));
            return nm.value.trim() ? {name: nm.value.trim(), qty: Number.isFinite(v) ? v : null, unit: un.value} : null;
          }).filter(Boolean), steps: rt.get()};
        const res = await api.save(this._h, recipe);
        if (!r && res?.id) this._jump = res.id;
        if (r) this._serv.delete(r.id);
        this._closeForm();
        if (this._jump) this._setRecipes(this._recipes);
      } catch (x) {
        console.warn('[nova-cards] Rezeptbuch: Speichern fehlgeschlagen', x);
        err.textContent = `Speichern hat nicht geklappt${x?.message ? `: ${x.message}` : ''}`;
        save.disabled = false;
      }
    });
    f.hidden = false;
    this._poke();
    if (!r) setTimeout(() => q('#t').focus(), 50);
  }
  _closeForm() { const f = this._e.form; f.hidden = true; f.replaceChildren(); this._poke(); }
}

// Vorschau in der Kartenauswahl: zwei Beispielrezepte, keine Verbindung zur Integration
const DEMO = [
  {id: 'demo1', title: 'Apfelkuchen', image: null, servings: 12, time: 75, tags: ['Backen'], ingredients: [{qty: 200, unit: 'g', name: 'Mehl'}, {qty: 125, unit: 'g', name: 'Butter'}, {qty: 100, unit: 'g', name: 'Zucker'}, {qty: 1, unit: '', name: 'Ei'}, {qty: 4, unit: '', name: 'Äpfel'}],
    steps: '<p>Teig kneten</p><p>Äpfel schälen und schneiden</p><p>45 Minuten bei 180 °C backen</p>'},
  {id: 'demo2', title: 'Kartoffelsuppe', image: null, servings: 4, time: 40, tags: [], ingredients: [{qty: 1, unit: 'kg', name: 'Kartoffeln'}, {qty: 1, unit: '', name: 'Zwiebel'}, {qty: 1, unit: 'l', name: 'Brühe'}],
    steps: '<p>Kartoffeln würfeln</p><p>Alles 20 Minuten kochen</p><p>Pürieren</p>'},
];

define('recipe-book-card', NovaRecipeBookCard, {name: 'Nova Rezeptbuch', description: 'Rezeptbuch zum Blättern in drei Stilen (altes Kochbuch, modern, Fantasy): Inhaltsverzeichnis, Rezepte mit Foto, Zutaten und Zubereitung, Portionen umrechnen, Zutaten auf die Einkaufsliste. Dieselben Rezepte wie in der Nova Rezeptliste (Nova-Integration).', documentationURL: docUrl('nova-rezeptbuch')});

/* ---------- Editor ---------- */
const S_BOOK = [
  g2({name: 'title', selector: T}, {name: 'subtitle', selector: T}),
  g2(sel('style', [['old', 'Old Book (altes Kochbuch)'], ['modern', 'Modern Book (schlicht, grau)'], ['fantasy', 'Fantasy Book (Zauberbuch)']]),
    sel('cover_color', [['brown', 'Standard des Stils'], ['red', 'Rot'], ['green', 'Grün'], ['blue', 'Blau']])),
];
const S_USE = [
  sel('layout', [['auto', 'Automatisch'], ['double', 'Doppelseite'], ['single', 'Einzelseite']]),
  sel('turn', [['auto', 'Automatisch'], ['3d', '3D'], ['simple', 'Einfach (schwache Geräte)']]),
  g2({name: 'start_open', selector: {boolean: {}}}, {name: 'close_after', selector: {number: {min: 0, max: 3600, step: 10, mode: 'box', unit_of_measurement: 's'}}}),
];
const LABELS = {title: 'Titel auf dem Einband', subtitle: 'Untertitel (optional)', style: 'Stil', cover_color: 'Einband', layout: 'Seiten', start_open: 'Aufgeschlagen starten', close_after: 'Zuklappen nach', turn: 'Blättern'};
const HELPERS = {layout: 'Automatisch: ab 560 px Breite als Doppelseite, schmaler als Einzelseite.', close_after: '0 = bleibt offen. Sonst klappt das Buch nach so vielen Sekunden ohne Bedienung zu.',
  subtitle: 'Steht unter dem Titel, z. B. „von Oma Erna“.', cover_color: 'Standard: Old Book braunes Leder, Modern Book grau, Fantasy Book nachtblau. Rot, Grün und Blau sind je Stil passend abgetönt.',
  style: 'Alle Stile zeigen dieselben Rezepte – auch die Nova Rezeptliste.',
  turn: 'Automatisch: 3D-Blättern, auf schwachen Geräten (z. B. Echo Show) oder wenn es ruckelt flaches Blättern mit Schatten.'};

class NovaRecipeBookCardEditor extends NovaEditorBase {
  static labels = LABELS;
  static helpers = HELPERS;
  static openSections = ['book'];
  _build() {
    const r = this.shadowRoot;
    r.innerHTML = `<style>${SECTION_EDITOR_CSS}</style><div class="wrap"></div>`;
    const data = () => ({...DEF, ...this._config});
    const form = s => this._form(s, data(), v => {
      const c = merge(this._config, names(s), v);
      Object.keys(DEF).forEach(k => { if (c[k] === DEF[k]) delete c[k]; });
      this._emit(c);
    });
    r.querySelector('.wrap').append(
      this._section('book', 'mdi:book-open-page-variant-outline', 'Buch', b => b.append(form(S_BOOK))),
      this._section('use', 'mdi:gesture-swipe-horizontal', 'Seiten und Verhalten', b => b.append(form(S_USE))));
  }
}
define('recipe-book-card-editor', NovaRecipeBookCardEditor);
