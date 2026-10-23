// Antippen / lange drücken (500 ms) mit Tastatur-Bedienung.
// isolate: Klick und Taste nicht an umgebende Elemente weitergeben (z. B. Buttons in einer antippbaren Raumkachel)
export function press(el, {tap, hold, holdMs = 500, isolate = false}) {
  let t, held = false;
  const clr = () => clearTimeout(t);
  el.tabIndex = 0; el.setAttribute('role', 'button'); el.classList.add('tap');
  el.addEventListener('pointerdown', () => { held = false; t = setTimeout(() => { held = true; hold && hold(); }, holdMs); });
  el.addEventListener('pointerup', e => { clr(); if (!held && tap) tap(); e.stopPropagation(); });
  el.addEventListener('pointerleave', clr);
  el.addEventListener('pointercancel', clr);
  el.addEventListener('contextmenu', e => e.preventDefault());
  if (isolate) el.addEventListener('click', e => e.stopPropagation());
  el.addEventListener('keydown', e => {
    if (e.key !== 'Enter' && e.key !== ' ') return;
    e.preventDefault();
    if (isolate) e.stopPropagation();
    tap && tap();
  });
}
