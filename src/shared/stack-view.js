// Zwei Ansichten in einer Karte (Liste ↔ Detail), die seitlich hineingleiten – Notiz und Einkauf.
// Die Karte behält dabei ihre Höhe (Detail scrollt in sich). Dazu runde Knöpfe und Löschen in zwei Schritten.

export const VIEW_CSS = `
.stage{position:relative;flex:1 1 0;min-height:var(--vh,240px);overflow:hidden;margin:0 calc(var(--nv-s2) * -1)}
.view{position:absolute;inset:0;display:flex;flex-direction:column;gap:var(--nv-s5);padding:0 var(--nv-s2);box-sizing:border-box;
transition:transform var(--nv-d5) var(--nv-ease),opacity var(--nv-d5) var(--nv-ease),visibility 0s linear var(--nv-d5)}
.view.main{transform:none}
.view.side{transform:translateX(104%);opacity:0;visibility:hidden}
.g.detail .view.main{transform:translateX(-28%);opacity:0;visibility:hidden}
.g.detail .view.side{transform:none;opacity:1;visibility:visible;transition-delay:0s}
.g:not(.detail) .view.main{visibility:visible;transition-delay:0s}
.scroll{flex:1 1 0;min-height:0;overflow-y:auto;overscroll-behavior:auto contain;scrollbar-width:thin;
-webkit-mask-image:linear-gradient(#000 calc(100% - 14px),transparent);mask-image:linear-gradient(#000 calc(100% - 14px),transparent);padding-bottom:var(--nv-s6)}
.rb{width:44px;height:44px;border-radius:50%;flex:none;display:flex;align-items:center;justify-content:center;padding:0;cursor:pointer;box-sizing:border-box;
border:1px solid var(--nv-box-border);background:var(--nv-chip);color:inherit;outline:none;-webkit-tap-highlight-color:transparent;
transition:background-color var(--nv-d2),color var(--nv-d2),border-color var(--nv-d2),transform var(--nv-d2) var(--nv-ease),opacity var(--nv-d2),box-shadow var(--nv-d3)}
.rb ha-icon{--mdc-icon-size:22px;transition:transform var(--nv-d4) var(--nv-ease)}
.rb:active:not([disabled]){transform:scale(var(--nv-press))}
.rb:focus-visible{box-shadow:var(--nv-focus)}
.rb[disabled]{opacity:.35;cursor:default}
.rb.sm{width:38px;height:38px}.rb.sm ha-icon{--mdc-icon-size:19px}
.rb.on{background:color-mix(in srgb,var(--nv-active) var(--nv-fill),var(--nv-chip));border-color:transparent;color:color-mix(in srgb,var(--nv-active-fg) var(--nv-fill-ink),var(--nv-fg));
box-shadow:0 0 14px color-mix(in srgb,color-mix(in srgb,var(--nv-active) 50%,transparent) var(--nv-glow),transparent),var(--nv-fill-edge)}
.rb.arm{border-color:color-mix(in srgb,var(--nv-error) 70%,transparent);background:color-mix(in srgb,var(--nv-error) 22%,transparent);color:var(--nv-error);animation:rb-shake var(--nv-d5) var(--nv-ease)}
.rb.plus ha-icon{transition:transform var(--nv-d5) var(--nv-ease)}
.rb.plus:active ha-icon{transform:rotate(90deg)}
.bar{display:flex;align-items:center;gap:var(--nv-s4);flex:none;min-width:0}
.bar .sp{flex:1;min-width:0}
.msg{display:flex;align-items:center;gap:var(--nv-s4);font-size:var(--nv-fs-6);opacity:.6;padding:var(--nv-s5) var(--nv-s2)}
.msg ha-icon{--mdc-icon-size:var(--nv-icon-md);flex:none}
.state{font-size:var(--nv-fs-3);opacity:.6;display:flex;align-items:center;gap:var(--nv-s2);white-space:nowrap;overflow:hidden;text-overflow:ellipsis}
.state ha-icon{--mdc-icon-size:14px}
.state.ok ha-icon{color:var(--nova-success-color,var(--nv-a4));animation:rb-pop var(--nv-d5) var(--nv-ease)}
@keyframes rb-in{from{opacity:0;transform:translateY(10px) scale(.98)}to{opacity:1;transform:none}}
@keyframes rb-pop{0%{transform:scale(.3)}60%{transform:scale(1.25)}100%{transform:scale(1)}}
@keyframes rb-shake{0%,100%{transform:none}25%{transform:translateX(-3px)}75%{transform:translateX(3px)}}
@media (prefers-reduced-motion:reduce){.view,.rb,.rb ha-icon{transition:none}.rb.arm,.state.ok ha-icon{animation:none}}`;

// Runder Knopf
export function roundBtn(icon, title, onTap, cls = '') {
  const b = document.createElement('button');
  b.type = 'button'; b.className = `rb ${cls}`.trim(); b.title = title; b.setAttribute('aria-label', title);
  b.innerHTML = `<ha-icon icon="${icon}"></ha-icon>`;
  b.addEventListener('click', e => { e.stopPropagation(); onTap(e); });
  return b;
}
export const setBtnIcon = (b, icon) => { const i = b.firstChild; if (i.getAttribute('icon') !== icon) i.setAttribute('icon', icon); };

// Löschen in zwei Schritten: erstes Antippen färbt rot, zweites (innerhalb von 3 s) führt aus
const ARM = 3000;
export function armButton(icon, title, onConfirm, cls = '') {
  let t;
  const b = roundBtn(icon, title, () => {
    if (!b.classList.contains('arm')) {
      b.classList.add('arm'); b.title = 'Nochmal tippen zum Bestätigen';
      setBtnIcon(b, 'mdi:delete-alert-outline');
      t = setTimeout(reset, ARM);
      return;
    }
    reset(); onConfirm();
  }, cls);
  const reset = () => { clearTimeout(t); b.classList.remove('arm'); b.title = title; setBtnIcon(b, icon); };
  b.reset = reset;
  return b;
}

// „vor 5 Min.“, „heute 14:03“, „gestern 09:12“, „3. Nov.“, „3. Nov. 2025“
export function ago(ts, now = Date.now()) {
  if (!ts) return '';
  const d = new Date(ts * 1000), s = (now - d) / 1000;
  if (s < 45) return 'gerade eben';
  if (s < 3600) return `vor ${Math.max(1, Math.round(s / 60))} Min.`;
  const day = x => new Date(x).setHours(0, 0, 0, 0), dd = (day(now) - day(d)) / 864e5;
  const hm = d.toLocaleTimeString('de-DE', {hour: '2-digit', minute: '2-digit'});
  if (dd === 0) return `heute ${hm}`;
  if (dd === 1) return `gestern ${hm}`;
  return d.toLocaleDateString('de-DE', {day: 'numeric', month: 'short', ...(d.getFullYear() !== new Date(now).getFullYear() ? {year: 'numeric'} : {})});
}
