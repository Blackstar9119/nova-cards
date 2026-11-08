import {define, docUrl, tag} from './shared/define.js';
import {esc} from './shared/utils.js';
import {NOVA_VARS, SECTION_EDITOR_CSS} from './shared/styles.js';
import {inPicker, watchVisible} from './shared/lifecycle.js';
import {NovaEditorBase, names, merge} from './shared/editor-base.js';
import {g2, T, sel} from './shared/editor-schema.js';

/* ---------- Nova Recipe Book ----------
   Ein altes, abgegriffenes Kochbuch: Ledereinband, vergilbte Seiten, Handschrift. Tippen öffnet das Buch, Wischen blättert.
   Rezepte kommen aus der Nova-Integration (custom_components/nova, Modul „recipes“) und sind auf allen Geräten gleich:
   WebSocket nova/recipes/subscribe|save|delete|upload, Bilder per POST /api/nova/recipes/image nach /config/www/nova-recipes.
   Fehlt die Integration, steht im Buch ein freundlicher Hinweis, wie man sie einrichtet. */
const DEF = {title: 'Rezepte', subtitle: '', layout: 'auto', cover_color: 'brown', start_open: false, close_after: 0};
const COVERS = ['brown', 'red', 'green', 'blue'];
const OPEN_MS = 1100, TURN_MS = 800, PAGE_RATIO = .72;

// Schriften: Caveat (Handschrift) und EB Garamond, Latin-Subset als woff2. Sie liegen in der Nova-Integration und kommen
// von Home Assistant selbst (/nova/static/fonts) – nichts von fremden Servern, nichts im Haupt-Bundle. @font-face wird erst
// gesetzt, wenn ein Rezeptbuch eingehängt wird, und der Browser lädt eine Schrift erst, wenn Text in ihr erscheint.
// Ohne Integration greifen Georgia bzw. die Ersatzschriften. @font-face wirkt nur im Dokument, nicht im Shadow DOM.
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

const CSS = `
:host{display:block;height:100%;
--ink:var(--nv-book-ink);--paper:var(--nv-book-paper);--leather:var(--nv-book-brown);--gold:var(--nv-book-gold)}
:host([cover=red]){--leather:var(--nv-book-red)}:host([cover=green]){--leather:var(--nv-book-green)}:host([cover=blue]){--leather:var(--nv-book-blue)}
*{box-sizing:border-box}
.rb{position:relative;height:100%;min-height:200px;display:flex;align-items:center;justify-content:center;overflow:hidden;
font-family:'Nova Serif',Georgia,'Times New Roman',serif;color:var(--ink);-webkit-tap-highlight-color:transparent;user-select:none;-webkit-user-select:none}
.stage{position:relative;perspective:2400px;perspective-origin:50% 40%}
.book{position:absolute;inset:0;transform-style:preserve-3d;transition:transform ${OPEN_MS}ms cubic-bezier(.45,.05,.25,1)}
/* Aufgeschlagen gehören waagrechte Wischgesten dem Buch (Nova Swipe Card blättert dann nicht mit), zugeklappt nicht */
.book.open{touch-action:pan-y}
.book.closed{transform:translateX(calc(var(--pw) * -.5))}
.book.single.closed,.book.single{transform:none}
/* Seitenblock: Papierkanten unten und rechts (Buchdicke) */
.block{position:absolute;top:0;bottom:0;right:0;width:var(--pw);border-radius:2px 6px 6px 2px;
background:repeating-linear-gradient(90deg,#e9dcb8 0 1px,#cdbb8f 1px 2px);box-shadow:3px 4px 0 -1px #bfae84,5px 7px 14px rgba(0,0,0,.45);transform:translate(4px,4px)}
.double .block.l{right:auto;left:0;transform:translate(-4px,4px);border-radius:6px 2px 2px 6px}
.single .block.l,.closed .block.l{display:none}
/* Seiten */
.pg,.face{position:absolute;top:0;bottom:0;width:var(--pw);overflow:hidden;backface-visibility:hidden;-webkit-backface-visibility:hidden}
.pg.r,.leaf{left:auto;right:0}.pg.l{left:0}
/* Seiten minimal vor dem aufgeklappten Einband, das Blatt beim Umblättern vor den Seiten (in 3D zählt die Tiefe, nicht z-index) */
.open .pg{transform:translateZ(1px)}
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
.in{position:absolute;inset:0;padding:calc(var(--pw) * .09) calc(var(--pw) * .1) calc(var(--pw) * .11);overflow-y:auto;overscroll-behavior:contain;scrollbar-width:none;
font-size:clamp(12px,calc(var(--pw) * .036),19px);line-height:1.45}
.in::-webkit-scrollbar{display:none}
.no{position:absolute;bottom:calc(var(--pw) * .035);left:0;right:0;text-align:center;font-style:italic;font-size:clamp(10px,calc(var(--pw) * .026),14px);opacity:.55;pointer-events:none}
.leaf{position:absolute;top:0;bottom:0;width:var(--pw);transform-style:preserve-3d;transform-origin:0 50%;z-index:5;pointer-events:none}
.leaf .face{left:0}.leaf .face.b{transform:rotateY(180deg)}
.leaf .sh{position:absolute;inset:0;pointer-events:none;z-index:3;opacity:0}
.leaf.fwd{animation:turn-f ${TURN_MS}ms cubic-bezier(.4,.1,.3,1) forwards}.leaf.bwd{animation:turn-b ${TURN_MS}ms cubic-bezier(.4,.1,.3,1) forwards}
.leaf .face.f .sh{background:linear-gradient(90deg,rgba(0,0,0,.35),transparent 60%)}.leaf .face.b .sh{background:linear-gradient(270deg,rgba(0,0,0,.35),transparent 60%)}
.leaf.fwd .face.f .sh,.leaf.bwd .face.b .sh{animation:sh-in ${TURN_MS}ms ease-in forwards}.leaf.fwd .face.b .sh,.leaf.bwd .face.f .sh{animation:sh-out ${TURN_MS}ms ease-out forwards}
.single .leaf.fwd{animation-name:turn-sf}.single .leaf.bwd{animation-name:turn-sb}
@keyframes turn-f{from{transform:translateZ(2px) rotateY(0)}50%{transform:translateZ(2px) rotateY(-90deg) skewY(-1.5deg)}to{transform:translateZ(2px) rotateY(-180deg)}}
@keyframes turn-b{from{transform:translateZ(2px) rotateY(-180deg)}50%{transform:translateZ(2px) rotateY(-90deg) skewY(1.5deg)}to{transform:translateZ(2px) rotateY(0)}}
@keyframes turn-sf{from{transform:translateZ(2px) rotateY(0);opacity:1}70%{opacity:1}to{transform:translateZ(2px) rotateY(-160deg);opacity:0}}
@keyframes turn-sb{from{transform:translateZ(2px) rotateY(-160deg);opacity:0}30%{opacity:1}to{transform:translateZ(2px) rotateY(0);opacity:1}}
@keyframes sh-in{from{opacity:0}to{opacity:1}}@keyframes sh-out{from{opacity:1}to{opacity:0}}
/* Einband */
.cover{position:absolute;top:-2%;bottom:-2%;right:-1.5%;width:calc(var(--pw) * 1.03);transform-style:preserve-3d;transform-origin:0 50%;z-index:8;
transition:transform ${OPEN_MS}ms cubic-bezier(.45,.05,.25,1)}
.single .cover{right:auto;left:0}
.cover .face{width:100%;top:0;bottom:0;left:0}.cover .face.b{transform:rotateY(180deg)}
.open .cover{transform:rotateY(-180deg)}
.single.open .cover{transform:rotateY(-160deg);opacity:0;transition:transform ${OPEN_MS}ms cubic-bezier(.45,.05,.25,1),opacity .3s ${OPEN_MS * .7}ms}
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
.emb h1{margin:0;font-family:'Nova Serif',Georgia,serif;font-style:italic;font-weight:400;font-size:clamp(22px,calc(var(--pw) * .13),78px);line-height:1.05;
background:linear-gradient(170deg,#f3dc9a,var(--gold) 45%,#8a6424 70%,#d9b665);-webkit-background-clip:text;background-clip:text;color:transparent;
filter:drop-shadow(0 1px 0 rgba(0,0,0,.6)) drop-shadow(0 -1px 0 rgba(255,230,180,.15));opacity:.92}
.emb p{margin:0;font-family:'Nova Hand',cursive;font-size:clamp(14px,calc(var(--pw) * .06),34px);color:#e9cf93;opacity:.75;text-shadow:0 1px 0 rgba(0,0,0,.6)}
.emb .gold{fill:none;stroke:var(--gold);stroke-width:1.2;opacity:.85}
/* abgewetzte Ecken */
.wear{position:absolute;inset:0;border-radius:inherit;pointer-events:none;
background:radial-gradient(circle at 100% 0,rgba(240,210,170,.35),transparent 7%),radial-gradient(circle at 100% 100%,rgba(240,210,170,.32),transparent 7%),
linear-gradient(180deg,rgba(255,225,180,.12),transparent 3%,transparent 97%,rgba(255,225,180,.12));mix-blend-mode:screen}
.inside{background-color:#e7d6ae;background-image:var(--st),${PAPER_FIBER},radial-gradient(ellipse at 50% 50%,transparent 50%,rgba(110,70,20,.3)),
repeating-linear-gradient(45deg,rgba(120,80,30,.05) 0 6px,transparent 6px 12px);border-radius:10px 3px 3px 10px;
box-shadow:inset 0 0 0 8px var(--leather),inset 0 0 0 9px rgba(0,0,0,.4),inset 0 0 40px rgba(110,70,20,.35)}
.inside .ded{position:absolute;inset:18% 16%;display:flex;flex-direction:column;align-items:center;justify-content:center;text-align:center;gap:8px;
font-family:'Nova Hand',cursive;font-size:clamp(18px,calc(var(--pw) * .085),46px);transform:rotate(-3deg);opacity:.8}
.inside .ded small{font-size:.55em;opacity:.75}
.hit{position:absolute;inset:0;cursor:pointer;z-index:9}
/* Lesebändchen zum Schließen */
.ribbon{position:absolute;top:calc(100% - 6px);left:calc(var(--bw) / 2 + var(--pw) * .1);width:clamp(14px,calc(var(--pw) * .045),24px);height:clamp(34px,calc(var(--pw) * .1),60px);z-index:7;transform:translateZ(3px);cursor:pointer;border:0;padding:0;
background:linear-gradient(90deg,#7c1d1d,#b03030 50%,#7c1d1d);clip-path:polygon(0 0,100% 0,100% 100%,50% 82%,0 100%);box-shadow:0 2px 4px rgba(0,0,0,.4);
transition:opacity .4s;opacity:0;pointer-events:none}
.single .ribbon{left:12%}
.open .ribbon{opacity:1;pointer-events:auto;transition-delay:${OPEN_MS}ms}
/* Inhalt der Seiten */
h2{margin:0 0 .35em;font-family:'Nova Hand',cursive;font-weight:700;font-size:2.15em;line-height:1;color:var(--ink);transform:rotate(-1deg)}
h3{margin:1em 0 .3em;font-family:'Nova Hand',cursive;font-weight:700;font-size:1.45em;line-height:1;border-bottom:1px solid rgba(70,45,20,.3);padding-bottom:.15em}
h3:first-child{margin-top:0}
ul.ing{list-style:none;margin:0;padding:0}ul.ing li{padding:.12em 0 .12em 1.1em;position:relative;border-bottom:1px dotted rgba(70,45,20,.22)}
ul.ing li::before{content:"–";position:absolute;left:.1em;font-family:'Nova Hand',cursive;font-weight:700}
ol.st{list-style:none;margin:0;padding:0;counter-reset:s}ol.st li{counter-increment:s;position:relative;padding:.25em 0 .35em 2em}
ol.st li::before{content:counter(s);position:absolute;left:0;top:.05em;width:1.45em;height:1.45em;border:1.5px solid rgba(70,45,20,.55);border-radius:50%;
display:flex;align-items:center;justify-content:center;font-family:'Nova Hand',cursive;font-weight:700;font-size:1.05em;line-height:1;transform:rotate(-4deg)}
.toc h2{text-align:center;transform:none;margin-bottom:.6em}
.toc .it{display:flex;align-items:baseline;gap:.4em;width:100%;border:0;background:none;color:inherit;font:inherit;padding:.32em 0;cursor:pointer;text-align:left}
.toc .it .t{font-family:'Nova Hand',cursive;font-size:1.35em;line-height:1.1}
.toc .it .d{flex:1;border-bottom:2px dotted rgba(70,45,20,.35);transform:translateY(-.25em)}
.toc .it .n{font-style:italic;opacity:.75}
.toc .it:active .t{text-decoration:underline}
.msg{font-family:'Nova Hand',cursive;font-size:1.35em;line-height:1.25;text-align:center;margin:1em 0;opacity:.85}
.msg.hint{text-align:left;font-size:1.25em}.msg.hint ol{margin:.4em 0 0;padding-left:1.2em}.msg.hint code{font-family:inherit;background:rgba(120,80,30,.12);padding:0 .2em;border-radius:3px}
.act{display:flex;flex-wrap:wrap;gap:.5em;justify-content:center;margin-top:1.2em}
.btn{display:inline-flex;align-items:center;gap:.35em;border:1.5px solid rgba(70,45,20,.5);border-radius:999px;background:rgba(255,248,225,.35);color:var(--ink);
font-family:'Nova Hand',cursive;font-size:1.2em;font-weight:700;padding:.15em .8em .2em;cursor:pointer;line-height:1.2;transition:background-color .2s,transform .15s}
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
.card label{display:block;font-family:'Nova Hand',cursive;font-weight:700;font-size:1.3em;margin:.6em 0 .15em}
.card input[type=text],.card textarea{width:100%;font:inherit;font-size:16px;color:var(--ink);background:rgba(255,255,255,.45);border:1px solid rgba(70,45,20,.35);border-radius:4px;
padding:.45em .6em;outline:none;-webkit-user-select:text;user-select:text}
.card textarea{min-height:7.5em;resize:vertical;line-height:1.45}
.card input:focus,.card textarea:focus{border-color:rgba(70,45,20,.8);box-shadow:0 0 0 3px rgba(150,100,40,.2)}
.card .pic{display:flex;align-items:center;gap:12px;flex-wrap:wrap}
.card .pic img{width:110px;height:82px;object-fit:cover;border:4px solid #fff;box-shadow:0 1px 4px rgba(0,0,0,.3);transform:rotate(-2deg)}
.card .pic input[type=file]{display:none}
.card .row{display:flex;gap:10px;justify-content:flex-end;margin-top:1em;flex-wrap:wrap}
.card .err{color:#8a1f12;font-family:'Nova Hand',cursive;font-size:1.2em;min-height:1.2em;margin-top:.4em}
.card small{display:block;opacity:.65;font-style:italic}
@media (prefers-reduced-motion:reduce){.book,.cover,.leaf,.leaf .sh{transition:none!important;animation-duration:1ms!important}}
.still .book,.still .cover{transition:none!important}`;

// Zierlinie für den Einband (Goldprägung)
const ORN = `<svg class="orn" viewBox="0 0 200 24" aria-hidden="true"><path class="gold" d="M4 12H78M122 12H196M84 12c4-8 12-8 16 0s12 8 16 0M84 12c4 8 12 8 16 0s12-8 16 0"/><circle cx="100" cy="12" r="2.2" fill="currentColor" class="gold"/></svg>`;

class NovaRecipeBookCard extends HTMLElement {
  static getConfigElement() { return document.createElement(tag('recipe-book-card-editor')); }
  static getStubConfig(h) {
    const ids = Object.keys(h?.states || {});
    const todo = ids.find(id => /^todo\..*einkauf/.test(id)) || ids.find(id => id === 'todo.shopping_list');
    return todo ? {shopping_list: todo} : {};
  }
  setConfig(c) {
    if (!c || typeof c !== 'object') throw new Error('Ungültige Konfiguration');
    const was = this._c;
    this._c = {...DEF, ...c};
    this.setAttribute('cover', COVERS.includes(this._c.cover_color) ? this._c.cover_color : 'brown');
    if (this._e) {
      if (!was || was.title !== this._c.title || was.subtitle !== this._c.subtitle) this._coverText();
      this._resize(true);
    }
  }
  set hass(h) {
    const old = this._h;
    this._h = h;
    if (!this._c) return;
    if (!this._e) this._build();
    if (!old || old.connection !== h.connection || old.config?.components !== h.config?.components) this._subscribe();
  }
  getCardSize() { return 8; }
  getGridOptions() { return {columns: 12, rows: 8, min_columns: 6, min_rows: 5}; }
  connectedCallback() {
    this._quiet = inPicker(this);
    // Schriften erst, wenn das Buch wirklich zu sehen ist (z. B. nicht auf einer anderen Seite der Swipe Card)
    this._stopVis?.();
    this._stopVis = watchVisible(this, v => { if (v) { loadFonts(); this._stopVis?.(); this._stopVis = null; } });
    if (!this._e && this._c && this._h) this._build();
    if (this._e) { this._ro?.observe(this); this._subscribe(); }
  }
  disconnectedCallback() {
    this._ro?.disconnect();
    this._stopVis?.(); this._stopVis = null;
    this._unsub?.then?.(u => typeof u === 'function' && u()).catch(() => {});
    this._unsub = null; this._subKey = null;
    clearTimeout(this._idle); clearTimeout(this._tt); clearTimeout(this._delT); clearTimeout(this._retry);
  }

  /* ---------- Aufbau ---------- */
  _build() {
    const r = this.shadowRoot || this.attachShadow({mode: 'open'});
    r.innerHTML = `<style>${NOVA_VARS}${CSS}</style><div class="rb"><div class="stage"><div class="book closed">
<div class="block l"></div><div class="block r"></div>
<div class="pg l paper"><div class="in"></div><div class="no"></div></div><div class="pg r paper"><div class="in"></div><div class="no"></div></div>
<div class="cover"><div class="face f leather"><div class="spine"></div><div class="stitch"></div><div class="emb">${ORN}<h1></h1><p></p>${ORN}</div><div class="wear"></div></div>
<div class="face b inside"><div class="ded"></div></div><div class="hit" role="button" aria-label="Buch öffnen"></div></div>
<button class="ribbon" aria-label="Buch schließen" title="Buch schließen"></button>
</div></div><div class="form" hidden></div></div>`;
    const q = s => r.querySelector(s);
    this._e = {rb: q('.rb'), stage: q('.stage'), book: q('.book'), L: q('.pg.l'), R: q('.pg.r'), cover: q('.cover'), ded: q('.ded'), h1: q('.emb h1'), sub: q('.emb p'), form: q('.form')};
    this._e.cover.style.setProperty('--st', stains(99));
    this._e.cover.querySelector('.inside').style.setProperty('--st', stains(98));
    this._sp = 0; this._open = false;
    this._coverText();
    q('.hit').addEventListener('click', () => this._setOpen(true));
    q('.ribbon').addEventListener('click', () => this._setOpen(false));
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
    let dbl = c.layout === 'double' || (c.layout !== 'single' && W >= 560 && (auto || W / Math.max(Hh, 1) > 1.05));
    const pad = Math.max(10, W * .025);
    let pw = dbl ? (W - 2 * pad) / 2 : W - 2 * pad;
    if (!auto) pw = Math.min(pw, (Hh - 2 * pad) * PAGE_RATIO);
    pw = Math.max(120, Math.floor(pw));
    const ph = Math.floor(pw / PAGE_RATIO), bw = dbl ? 2 * pw : pw;
    if (auto) e.rb.style.height = `${ph + 2 * pad}px`; else e.rb.style.removeProperty('height');
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
  }

  /* ---------- Daten ---------- */
  // HA-INTERN-frei: nur dokumentierte WebSocket-Wege (subscribeMessage/callWS) zu den eigenen Befehlen der Integration
  _subscribe() {
    const h = this._h;
    if (!h || !this.isConnected || !this._e) return;
    if (this._quiet) { this._recipes = DEMO; this._missing = false; this._paint(); return; }
    const has = h.config?.components?.includes?.('nova');
    const key = `${has}|${h.connection ? 1 : 0}`;
    if (key === this._subKey) return;
    this._subKey = key;
    this._unsub?.then?.(u => typeof u === 'function' && u()).catch(() => {});
    this._unsub = null;
    if (!has) { this._missing = true; this._recipes = []; this._paint(); return; }
    this._missing = false;
    this._unsub = h.connection.subscribeMessage(m => this._setRecipes(m?.recipes), {type: 'nova/recipes/subscribe'}).catch(err => {
      console.warn('[nova-cards] Rezeptbuch: Abo nicht möglich, lade Liste einmal', err);
      return h.callWS({type: 'nova/recipes/list'}).then(m => this._setRecipes(m?.recipes)).catch(e2 => {
        console.warn('[nova-cards] Rezeptbuch: Nova-Integration antwortet nicht', e2);
        this._missing = true; this._recipes = []; this._paint();
      }).then(() => null);
    });
  }
  _setRecipes(list) {
    // null = Integration wurde entladen: Hinweis zeigen und in 10 s neu verbinden (z. B. nach Neuladen der Integration)
    if (list == null) {
      this._missing = true; this._recipes = []; this._paint();
      clearTimeout(this._retry);
      this._retry = setTimeout(() => { this._subKey = null; this._subscribe(); }, 10000);
      return;
    }
    const spreads = this._spreads(this._dbl), cur = spreads[this._sp], key = cur && (cur.rid ?? cur.key);
    this._recipes = Array.isArray(list) ? list : [];
    this._missing = false;
    // Nach dem Speichern eines neuen Rezepts dorthin blättern, sonst auf derselben Seite bleiben
    const ns = this._spreads(this._dbl);
    if (this._jump) {
      const i = ns.findIndex(s => s.rid === this._jump);
      if (i >= 0) { this._jump = null; this._sp = i; }
    } else {
      const i = ns.findIndex(s => (s.rid ?? s.key) === key);
      this._sp = i >= 0 ? i : Math.min(this._sp, ns.length - 1);
    }
    this._paint();
  }

  /* ---------- Seiten ---------- */
  // Doppelseiten: [Vorsatz | Inhalt], dann je Rezept [Titel, Foto, Zutaten | Anleitung]. Einzelseiten: Inhalt, dann je Rezept eine Seite.
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
    if (this._dbl) { this._fill(e.L, s.L); this._fill(e.R, s.R); e.L.style.visibility = s.L.k === 'end' ? 'hidden' : ''; }
    else this._fill(e.R, s.P);
  }
  // Seite füllen: Inhalt + Seitenzahl + eigene Flecken
  _fill(pg, d) {
    const inn = pg.querySelector('.in'), no = pg.querySelector('.no');
    const sig = JSON.stringify([d.k, d.r?.id, d.r?.updated, d.n, d.k === 'toc' ? [this._recipes?.length, this._missing, (this._recipes || []).map(r => r.title)] : 0, this._dbl]);
    if (pg._sig === sig) return;
    pg._sig = sig;
    pg.style.setProperty('--st', stains(d.n || 0));
    inn.replaceChildren(this._content(d));
    inn.scrollTop = 0;
    no.textContent = d.n && d.k !== 'end' ? `— ${d.n} —` : '';
  }
  _content(d) {
    const box = document.createElement('div');
    const r = d.r;
    if (d.k === 'end') { box.className = 'inside'; return box; }
    if (d.k === 'toc') {
      box.className = 'toc';
      box.innerHTML = '<h2>Inhalt</h2>';
      if (this._missing) {
        box.insertAdjacentHTML('beforeend', `<div class="msg hint">Hier fehlt noch die Nova-Integration – ohne sie kann das Buch keine Rezepte aufbewahren.
<ol><li>Ordner <code>custom_components/nova</code> aus dem Nova-Cards-Repository nach <code>/config/custom_components/</code> kopieren</li>
<li>Home Assistant neu starten</li><li>Einstellungen → Geräte &amp; Dienste → Integration hinzufügen → „Nova“</li></ol></div>`);
        return box;
      }
      if (!this._recipes) { box.insertAdjacentHTML('beforeend', '<div class="msg">Einen Moment, die Seiten werden geblättert …</div>'); return box; }
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
      const act = document.createElement('div');
      act.className = 'act';
      act.append(this._btn('mdi:plus', 'Neues Rezept', () => this._edit(null)));
      box.append(act);
      return box;
    }
    const head = () => `<h2>${esc(r.title)}</h2>${r.image ? `<div class="photo"><img alt="" loading="lazy" src="${esc(r.image)}"><i class="tl"></i><i class="tr"></i><i class="bl"></i><i class="br"></i></div>` : ''}`;
    const ing = () => r.ingredients?.length ? `<h3>Zutaten</h3><ul class="ing">${r.ingredients.map(x => `<li>${esc(x)}</li>`).join('')}</ul>` : '';
    const steps = () => r.steps?.length ? `<h3>Zubereitung</h3><ol class="st">${r.steps.map(x => `<li>${esc(x)}</li>`).join('')}</ol>` : '';
    if (d.k === 'A') box.innerHTML = head() + ing();
    else if (d.k === 'B') box.innerHTML = steps() || '<div class="msg">Ohne Anleitung – einfach drauflos kochen.</div>';
    else box.innerHTML = head() + ing() + steps();
    if (d.k !== 'A') box.append(this._tools(r));
    return box;
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
    if (this._c.shopping_list && r.ingredients?.length) {
      const act = document.createElement('div');
      act.className = 'act';
      act.append(this._btn('mdi:cart-plus', 'Zutaten auf Einkaufsliste', b => this._toList(r, b)));
      w.append(act);
    }
    if (this._quiet) return w;
    const t = document.createElement('div');
    t.className = 'tools';
    t.append(this._btn('mdi:pencil', 'Bearbeiten', () => this._edit(r)), this._btn('mdi:delete-outline', 'Löschen', b => this._del(r, b)));
    w.append(t);
    return w;
  }

  /* ---------- Öffnen, Blättern, Gesten ---------- */
  _setOpen(open, anim = true) {
    const e = this._e;
    if (!e || open === this._open || this._quiet && open) return;
    this._open = open;
    this._resize(true);
    e.book.classList.toggle('still', !anim);
    e.cover.classList.remove('gone');
    e.book.classList.toggle('open', open);
    e.book.classList.toggle('closed', !open);
    clearTimeout(this._ct);
    // Einzelseite: der Einband klappt ganz weg und wird danach ausgeblendet
    if (open && !this._dbl) this._ct = setTimeout(() => e.cover.classList.add('gone'), anim ? OPEN_MS : 0);
    if (!open) { this._sp = 0; setTimeout(() => this._paint(), anim ? OPEN_MS : 0); }
    this._poke();
  }
  // Nach close_after Sekunden ohne Bedienung wieder zuklappen
  _poke() {
    clearTimeout(this._idle);
    const s = +this._c.close_after;
    if (this._open && s > 0) this._idle = setTimeout(() => { if (this._e.form.hidden) this._setOpen(false); else this._poke(); }, s * 1000);
  }
  _go(i) {
    const n = this._spreads().length;
    i = Math.max(0, Math.min(n - 1, i));
    if (i === this._sp || this._turning || !this._open) return;
    const reduce = window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
    const dir = i > this._sp ? 1 : -1, from = this._spreads()[this._sp], to = this._spreads()[i];
    this._poke();
    if (reduce) { this._sp = i; this._paint(); return; }
    const e = this._e, leaf = document.createElement('div');
    leaf.className = 'leaf';
    leaf.innerHTML = '<div class="face f paper"><div class="in"></div><div class="no"></div><div class="sh"></div></div><div class="face b paper"><div class="in"></div><div class="no"></div><div class="sh"></div></div>';
    const [ff, fb] = leaf.querySelectorAll('.face');
    if (this._dbl) {
      // vorwärts: Blatt zeigt vorne die alte rechte, hinten die neue linke Seite; darunter rechts schon die neue rechte
      if (dir > 0) { this._fill(ff, from.R); this._fill(fb, to.L); this._fill(e.R, to.R); }
      else { this._fill(ff, to.R); this._fill(fb, from.L); this._fill(e.L, to.L); e.L.style.visibility = to.L.k === 'end' ? 'hidden' : ''; }
    } else {
      if (dir > 0) { this._fill(ff, from.P); this._fill(e.R, to.P); } else { this._fill(ff, to.P); this._fill(e.R, from.P); }
      fb.replaceChildren();
    }
    this._turning = true;
    leaf.classList.add(dir > 0 ? 'fwd' : 'bwd');
    e.book.append(leaf);
    this._tt = setTimeout(() => { leaf.remove(); this._turning = false; this._sp = i; this._paint(); }, TURN_MS + 30);
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
  async _toList(r, b) {
    const h = this._h, id = this._c.shopping_list, label = b.lastChild;
    if (!h || !id || b.disabled) return;
    b.disabled = true;
    label.textContent = 'Wird eingetragen …';
    try {
      // Was schon offen auf der Liste steht, nicht doppelt eintragen
      let open = new Set();
      try {
        const res = await h.callService('todo', 'get_items', {status: ['needs_action']}, {entity_id: id}, false, true);
        open = new Set((res?.response?.[id]?.items || []).map(x => String(x.summary).trim().toLowerCase()));
      } catch { /* ältere HA ohne Antwort – dann alles eintragen */ }
      const add = r.ingredients.filter(x => !open.has(x.trim().toLowerCase()));
      for (const x of add) await h.callService('todo', 'add_item', {item: x}, {entity_id: id});
      label.textContent = add.length ? `${add.length} ${add.length === 1 ? 'Zutat' : 'Zutaten'} eingetragen` : 'Steht schon alles drauf';
      b.classList.add('ok');
    } catch (err) {
      console.warn('[nova-cards] Rezeptbuch: Einkaufsliste', err);
      label.textContent = 'Hat nicht geklappt';
      b.classList.add('warn');
    }
    setTimeout(() => { b.disabled = false; b.classList.remove('ok', 'warn'); label.textContent = 'Zutaten auf Einkaufsliste'; }, 3500);
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
    this._h.callWS({type: 'nova/recipes/delete', recipe_id: r.id}).catch(err => {
      console.warn('[nova-cards] Rezeptbuch: Löschen fehlgeschlagen', err);
      b.disabled = false; label.textContent = 'Fehler – nochmal?';
    });
  }
  _edit(r) {
    if (this._missing) return;
    const f = this._e.form, st = {image: r?.image || null, file: null};
    f.innerHTML = `<form class="card" novalidate><h2>${r ? 'Rezept bearbeiten' : 'Neues Rezept'}</h2>
<label for="t">Titel</label><input id="t" type="text" maxlength="200" autocomplete="off" enterkeyhint="next">
<label>Bild</label><div class="pic"><img alt="" hidden><button type="button" class="btn" data-a="pick"><ha-icon icon="mdi:camera-outline"></ha-icon><span>Foto wählen</span></button>
<button type="button" class="btn" data-a="clear" hidden><ha-icon icon="mdi:close"></ha-icon><span>Entfernen</span></button><input type="file" accept="image/*"></div>
<label for="i">Zutaten</label><textarea id="i" placeholder="250 g Mehl&#10;2 Eier&#10;1 Prise Salz"></textarea><small>Eine Zutat pro Zeile</small>
<label for="s">Anleitung</label><textarea id="s" placeholder="Mehl und Eier verrühren&#10;30 Minuten ruhen lassen"></textarea><small>Ein Schritt pro Zeile</small>
<div class="err"></div><div class="row"><button type="button" class="btn" data-a="cancel">Abbrechen</button><button type="submit" class="btn ok"><ha-icon icon="mdi:content-save-outline"></ha-icon><span>Speichern</span></button></div></form>`;
    const q = s => f.querySelector(s), img = q('.pic img'), file = q('input[type=file]'), clr = q('[data-a=clear]'), err = q('.err');
    q('#t').value = r?.title || '';
    q('#i').value = (r?.ingredients || []).join('\n');
    q('#s').value = (r?.steps || []).join('\n');
    const showPic = src => { img.hidden = !src; if (src) img.src = src; else img.removeAttribute('src'); clr.hidden = !src; };
    showPic(st.image);
    // Tippen im Formular soll keine Tastenkürzel von HA oder das Blättern auslösen
    f.addEventListener('keydown', ev => ev.stopPropagation());
    f.addEventListener('pointerdown', ev => ev.stopPropagation());
    q('[data-a=pick]').addEventListener('click', () => file.click());
    clr.addEventListener('click', () => { st.image = null; st.file = null; showPic(null); });
    file.addEventListener('change', async () => {
      const fl = file.files?.[0];
      if (!fl) return;
      err.textContent = '';
      try { st.file = await shrink(fl); st.image = null; showPic(URL.createObjectURL(st.file)); } catch (x) { err.textContent = 'Das Bild ließ sich nicht lesen.'; console.warn(x); }
    });
    q('[data-a=cancel]').addEventListener('click', () => this._closeForm());
    q('form').addEventListener('submit', async ev => {
      ev.preventDefault();
      const title = q('#t').value.trim(), save = q('button[type=submit]');
      if (!title) { err.textContent = 'Ein Titel fehlt noch.'; q('#t').focus(); return; }
      save.disabled = true; err.textContent = '';
      try {
        let image = st.image;
        if (st.file) image = await this._upload(st.file);
        const lines = v => v.split('\n').map(x => x.trim()).filter(Boolean);
        const recipe = {...(r ? {id: r.id} : {}), title, image, ingredients: lines(q('#i').value), steps: lines(q('#s').value)};
        const res = await this._h.callWS({type: 'nova/recipes/save', recipe});
        if (!r && res?.recipe?.id) this._jump = res.recipe.id;
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
  // Bild hochladen: HTTP mit Anmeldung (hass.fetchWithAuth), sonst über WebSocket als Base64
  async _upload(blob) {
    const h = this._h;
    // HA-INTERN: hass.fetchWithAuth (vom HA-Frontend für eigene Uploads genutzt). Fehlt es, geht das Bild über WebSocket.
    if (typeof h.fetchWithAuth === 'function') {
      try {
        const res = await h.fetchWithAuth('/api/nova/recipes/image', {method: 'POST', body: blob, headers: {'Content-Type': blob.type || 'image/jpeg'}});
        const j = await res.json().catch(() => ({}));
        if (res.ok && j.url) return j.url;
        throw new Error(j.message || `HTTP ${res.status}`);
      } catch (x) { console.warn('[nova-cards] Rezeptbuch: HTTP-Upload fehlgeschlagen, versuche WebSocket', x); }
    }
    const data = await new Promise((ok, no) => { const fr = new FileReader(); fr.onload = () => ok(String(fr.result)); fr.onerror = no; fr.readAsDataURL(blob); });
    const res = await h.callWS({type: 'nova/recipes/upload', data, content_type: blob.type || 'image/jpeg'});
    return res.url;
  }
}

// Bild verkleinern (längste Seite 1600 px, JPEG): spart Platz und macht den Upload auch über WebSocket möglich
async function shrink(file, max = 1600) {
  let src;
  try { src = await createImageBitmap(file, {imageOrientation: 'from-image'}); } catch {
    src = await new Promise((ok, no) => { const im = new Image(); im.onload = () => ok(im); im.onerror = no; im.src = URL.createObjectURL(file); });
  }
  const w = src.width, hgt = src.height, s = Math.min(1, max / Math.max(w, hgt));
  const cv = document.createElement('canvas');
  cv.width = Math.round(w * s); cv.height = Math.round(hgt * s);
  cv.getContext('2d').drawImage(src, 0, 0, cv.width, cv.height);
  return new Promise((ok, no) => cv.toBlob(b => b ? ok(b) : no(new Error('toBlob')), 'image/jpeg', .85));
}

// Vorschau in der Kartenauswahl: zwei Beispielrezepte, keine Verbindung zur Integration
const DEMO = [
  {id: 'demo1', title: 'Apfelkuchen', image: null, ingredients: ['200 g Mehl', '125 g Butter', '100 g Zucker', '1 Ei', '4 Äpfel'], steps: ['Teig kneten', 'Äpfel schälen und schneiden', '45 Minuten bei 180 °C backen']},
  {id: 'demo2', title: 'Kartoffelsuppe', image: null, ingredients: ['1 kg Kartoffeln', '1 Zwiebel', '1 l Brühe'], steps: ['Kartoffeln würfeln', 'Alles 20 Minuten kochen', 'Pürieren']},
];

define('recipe-book-card', NovaRecipeBookCard, {name: 'Nova Recipe Book', description: 'Rezeptbuch im Stil eines alten Kochbuchs: Inhaltsverzeichnis, Rezepte mit Foto, Zutaten und Anleitung, Blättern per Wischen. Rezepte werden über die Nova-Integration in Home Assistant gespeichert.', documentationURL: docUrl('nova-recipe-book')});

/* ---------- Editor ---------- */
const S_BOOK = [
  g2({name: 'title', selector: T}, {name: 'subtitle', selector: T}),
  g2(sel('cover_color', [['brown', 'Braunes Leder'], ['red', 'Bordeaux'], ['green', 'Dunkelgrün'], ['blue', 'Nachtblau']]), sel('layout', [['auto', 'Automatisch'], ['double', 'Doppelseite'], ['single', 'Einzelseite']])),
  g2({name: 'start_open', selector: {boolean: {}}}, {name: 'close_after', selector: {number: {min: 0, max: 3600, step: 10, mode: 'box', unit_of_measurement: 's'}}}),
];
const S_LIST = [{name: 'shopping_list', selector: {entity: {domain: 'todo'}}}];
const LABELS = {title: 'Titel auf dem Einband', subtitle: 'Untertitel (optional)', cover_color: 'Einband', layout: 'Seiten', start_open: 'Aufgeschlagen starten',
  close_after: 'Zuklappen nach', shopping_list: 'Einkaufsliste (todo)'};
const HELPERS = {layout: 'Automatisch: ab 560 px Breite als Doppelseite, schmaler als Einzelseite.', close_after: '0 = bleibt offen. Sonst klappt das Buch nach so vielen Sekunden ohne Bedienung zu.',
  shopping_list: 'Optional: Unter jedem Rezept erscheint „Zutaten auf Einkaufsliste“. Was schon offen auf der Liste steht, wird nicht doppelt eingetragen.',
  subtitle: 'Steht in Handschrift unter dem Titel, z. B. „von Oma Erna“.'};

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
      this._section('list', 'mdi:cart-outline', 'Einkaufsliste', b => b.append(form(S_LIST))));
  }
}
define('recipe-book-card-editor', NovaRecipeBookCardEditor);
