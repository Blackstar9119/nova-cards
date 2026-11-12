/* ---------- Laufschrift für zu lange Namen ----------
   Passt ein Text nicht in sein Feld, läuft er langsam einmal ganz durch, wartet kurz und läuft zurück (hin und her,
   ohne Sprung). Passt er, steht er still. Bei „Bewegung reduzieren“ und in der Kartenauswahl bleibt es bei „…“.
   Gemessen wird per ResizeObserver, also auch, wenn ein Pop-up erst später sichtbar wird oder sich die Breite ändert. */

export const MARQUEE_CSS = `
.mq{display:block;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.mq>.mqi{display:inline}
.mq.run{text-overflow:clip;-webkit-mask-image:linear-gradient(90deg,transparent 0,#000 6px,#000 calc(100% - 14px),transparent);mask-image:linear-gradient(90deg,transparent 0,#000 6px,#000 calc(100% - 14px),transparent)}
.mq.run>.mqi{display:inline-block;padding-left:var(--nv-s2);animation:nv-mq var(--mqd,8s) ease-in-out infinite alternate;will-change:transform}
@keyframes nv-mq{0%,18%{transform:translateX(0)}82%,100%{transform:translateX(var(--mqx,0))}}
@media(prefers-reduced-motion:reduce){.mq.run{text-overflow:ellipsis;-webkit-mask-image:none;mask-image:none}.mq.run>.mqi{display:inline;padding-left:0;animation:none}}`;

// Geschwindigkeit in px/s und Mindestdauer einer Richtung (inklusive der Pausen an den Enden)
const SPEED = 28, MIN = 5;

// Text in el setzen und bei Bedarf laufen lassen. still = nie laufen (z. B. Vorschau in der Kartenauswahl).
export const marquee = (el, text, still = false) => {
  if (!el) return;
  el.classList.add('mq');
  let span = el.querySelector(':scope>.mqi');
  if (!span) { el.textContent = ''; span = document.createElement('span'); span.className = 'mqi'; el.appendChild(span); }
  if (span.textContent !== text) span.textContent = text;
  el._mqStill = still;
  if (!el._mqRo && typeof ResizeObserver !== 'undefined') {
    el._mqRo = new ResizeObserver(() => fit(el));
    el._mqRo.observe(el);
  }
  fit(el);
};

// Prüfen, ob der Text überläuft, und Weg sowie Dauer der Animation setzen
const fit = el => {
  const span = el.querySelector(':scope>.mqi');
  if (!span) return;
  el.classList.remove('run');
  const over = span.getBoundingClientRect().width - el.clientWidth;
  if (el._mqStill || !el.isConnected || el.clientWidth <= 0 || over <= 1) return;
  const dist = Math.ceil(over) + 18;
  el.style.setProperty('--mqx', `-${dist}px`);
  // 64 % der Zeit läuft der Text, je 18 % steht er an den Enden
  el.style.setProperty('--mqd', `${Math.max(MIN, dist / SPEED / 0.64).toFixed(1)}s`);
  el.classList.add('run');
};

// Beobachter beenden (aus disconnectedCallback)
export const stopMarquee = el => {
  if (!el?._mqRo) return;
  el._mqRo.disconnect();
  el._mqRo = null;
  el.classList.remove('run');
};
