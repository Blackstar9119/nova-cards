// Icon oder eigenes Bild für Einkaufsartikel (und Geschäfte): Schnellauswahl Lebensmittel, MDI-Suche, Bild hochladen.
// Bilder werden vorm Hochladen verkleinert (längste Seite MAX px) und als WebP (Safari: JPEG) komprimiert.
import {loadForm} from './editor-base.js';
import {uploadImage, imageUrl} from './nova-store.js';

// Feste Auswahl, ohne Suche mit einem Tipp erreichbar
export const FOOD_ICONS = [
  'mdi:food-apple', 'mdi:fruit-pear', 'mdi:fruit-citrus', 'mdi:fruit-cherries', 'mdi:fruit-grapes', 'mdi:fruit-pineapple', 'mdi:fruit-watermelon',
  'mdi:carrot', 'mdi:corn', 'mdi:chili-hot', 'mdi:mushroom-outline', 'mdi:leaf', 'mdi:sprout', 'mdi:nutrition',
  'mdi:bread-slice', 'mdi:baguette', 'mdi:food-croissant', 'mdi:muffin', 'mdi:cupcake', 'mdi:cake-variant', 'mdi:cookie',
  'mdi:egg-outline', 'mdi:cheese', 'mdi:cup-water', 'mdi:baby-bottle-outline', 'mdi:ice-cream', 'mdi:ice-pop', 'mdi:candy',
  'mdi:fish', 'mdi:food-drumstick', 'mdi:food-steak', 'mdi:sausage', 'mdi:food-turkey', 'mdi:food-hot-dog', 'mdi:hamburger',
  'mdi:pizza', 'mdi:pasta', 'mdi:noodles', 'mdi:rice', 'mdi:barley', 'mdi:peanut', 'mdi:popcorn', 'mdi:french-fries',
  'mdi:shaker-outline', 'mdi:spoon-sugar', 'mdi:soy-sauce', 'mdi:pot-steam-outline', 'mdi:bowl-mix-outline', 'mdi:taco', 'mdi:food-variant',
  'mdi:coffee', 'mdi:tea', 'mdi:water', 'mdi:bottle-soda-classic-outline', 'mdi:bottle-wine', 'mdi:beer', 'mdi:glass-cocktail',
  'mdi:paper-roll', 'mdi:toothbrush-paste', 'mdi:hand-wash-outline', 'mdi:lotion-outline', 'mdi:spray-bottle', 'mdi:broom', 'mdi:pill',
  'mdi:bandage', 'mdi:lightbulb-outline', 'mdi:battery-outline', 'mdi:dog', 'mdi:cat', 'mdi:flower-tulip-outline', 'mdi:package-variant-closed'];

export const STORE_ICONS = ['mdi:store-outline', 'mdi:storefront-outline', 'mdi:cart-outline', 'mdi:basket-outline', 'mdi:shopping-outline',
  'mdi:food-apple-outline', 'mdi:bread-slice-outline', 'mdi:fish', 'mdi:pill', 'mdi:lipstick', 'mdi:hammer-wrench', 'mdi:flower-tulip-outline',
  'mdi:paw', 'mdi:bottle-wine-outline', 'mdi:sprout', 'mdi:tshirt-crew-outline', 'mdi:laptop', 'mdi:gas-station-outline'];

const MAX = 384, QUALITY = 0.8;

// Datei → kleine data-URL. createImageBitmap dreht Handyfotos richtig (EXIF), sonst über <img>
export async function compressImage(file, max = MAX) {
  let src;
  try { src = await createImageBitmap(file, {imageOrientation: 'from-image'}); } catch {
    src = await new Promise((ok, fail) => { const i = new Image(); i.onload = () => ok(i); i.onerror = fail; i.src = URL.createObjectURL(file); });
  }
  const w = src.width || src.naturalWidth, h = src.height || src.naturalHeight, k = Math.min(1, max / Math.max(w, h));
  const cv = document.createElement('canvas');
  cv.width = Math.max(1, Math.round(w * k)); cv.height = Math.max(1, Math.round(h * k));
  cv.getContext('2d').drawImage(src, 0, 0, cv.width, cv.height);
  src.close?.();
  let url = cv.toDataURL('image/webp', QUALITY);
  // Safari kann kein WebP schreiben und liefert dann PNG – JPEG ist dort deutlich kleiner
  if (!url.startsWith('data:image/webp')) url = cv.toDataURL('image/jpeg', QUALITY);
  return url;
}

export const PICK_MEDIA_CSS = `
.mp{display:flex;flex-direction:column;gap:var(--nv-s5)}
.mp .row1{display:flex;gap:var(--nv-s4);align-items:center}
.mp .pv{width:64px;height:64px;border-radius:var(--nv-r-md);flex:none;display:flex;align-items:center;justify-content:center;background:var(--nv-chip);overflow:hidden;
border:1px solid var(--nv-box-border);transition:transform var(--nv-d3) var(--nv-ease)}
.mp .pv.pop{animation:mp-pop var(--nv-d5) var(--nv-ease)}
.mp .pv ha-icon{--mdc-icon-size:34px}.mp .pv img{width:100%;height:100%;object-fit:cover}
.mp .acts{display:flex;gap:var(--nv-s3);flex-wrap:wrap;flex:1;min-width:0}
.mp .act{height:44px;padding:0 var(--nv-s6);border-radius:var(--nv-r-pill);border:1px solid var(--nv-box-border);background:var(--nv-chip);color:inherit;font:inherit;
font-size:var(--nv-fs-6);display:inline-flex;align-items:center;gap:var(--nv-s3);cursor:pointer;-webkit-tap-highlight-color:transparent;transition:transform var(--nv-d2)}
.mp .act:active{transform:scale(var(--nv-press))}
.mp .act ha-icon{--mdc-icon-size:20px}
.mp .act.busy ha-icon{animation:mp-spin 1s linear infinite}
.mp .srch{min-height:56px}
.mp .grid{display:grid;grid-template-columns:repeat(auto-fill,minmax(48px,1fr));gap:var(--nv-s2)}
.mp .grid button{height:48px;border-radius:var(--nv-r-sm);border:1px solid transparent;background:rgba(var(--nv-tint),.05);color:inherit;display:flex;align-items:center;
justify-content:center;cursor:pointer;padding:0;-webkit-tap-highlight-color:transparent;transition:background-color var(--nv-d2),border-color var(--nv-d2),transform var(--nv-d2)}
.mp .grid button:active{transform:scale(var(--nv-press))}
.mp .grid button.on{background:color-mix(in srgb,var(--nv-active) 28%,transparent);border-color:var(--nv-active)}
.mp .grid ha-icon{--mdc-icon-size:24px}
.mp .err{font-size:var(--nv-fs-4);color:var(--nv-error)}
.mp input[type=file]{display:none}
@keyframes mp-pop{0%{transform:scale(.6)}60%{transform:scale(1.12)}100%{transform:scale(1)}}
@keyframes mp-spin{to{transform:rotate(360deg)}}
@media (prefers-reduced-motion:reduce){.mp .pv.pop{animation:none}}`;

// Auswahl bauen. value = {icon, image}; onChange({icon, image}). icons = Schnellauswahl; upload = Bild erlauben;
// module = Ordner der Bilder (shopping | recipes).
export function mediaPicker({hass, module = 'shopping', value = {}, icons = FOOD_ICONS, upload = true, search = true, fallback = 'mdi:help', onChange}) {
  const el = document.createElement('div');
  el.className = 'mp';
  el.innerHTML = `<div class="row1"><div class="pv"></div><div class="acts"></div></div><div class="srch"></div><div class="err" hidden></div><div class="grid"></div>
<input type="file" accept="image/*">`;
  const pv = el.querySelector('.pv'), acts = el.querySelector('.acts'), grid = el.querySelector('.grid'), err = el.querySelector('.err'),
    file = el.querySelector('input'), srch = el.querySelector('.srch');
  let cur = {icon: value.icon || null, image: value.image || null}, h = hass;
  const paint = pop => {
    pv.innerHTML = cur.image ? `<img alt="" src="${imageUrl(h, module, cur.image)}">` : `<ha-icon icon="${cur.icon || fallback}"></ha-icon>`;
    if (pop) { pv.classList.remove('pop'); void pv.offsetWidth; pv.classList.add('pop'); }
    grid.querySelectorAll('button').forEach(b => b.classList.toggle('on', !cur.image && b.dataset.icon === cur.icon));
    rm.hidden = !cur.icon && !cur.image;
    if (form) form.data = {icon: cur.image ? '' : cur.icon || ''};
  };
  const set = v => { cur = {icon: null, image: null, ...v}; paint(true); onChange?.(cur); };
  const act = (icon, label, fn) => {
    const b = document.createElement('button');
    b.type = 'button'; b.className = 'act';
    b.innerHTML = `<ha-icon icon="${icon}"></ha-icon><span></span>`;
    b.lastChild.textContent = label;
    b.addEventListener('click', e => { e.stopPropagation(); fn(b); });
    acts.append(b);
    return b;
  };
  if (upload) act('mdi:camera-plus-outline', 'Eigenes Bild', () => file.click());
  const rm = act('mdi:close', 'Entfernen', () => set({}));
  file.addEventListener('change', async () => {
    const f = file.files?.[0];
    file.value = '';
    if (!f) return;
    const b = acts.firstChild;
    b.classList.add('busy'); b.firstChild.setAttribute('icon', 'mdi:loading'); err.hidden = true;
    try {
      const {image} = await uploadImage(h, module, await compressImage(f, module === 'recipes' ? 960 : MAX));
      set({image});
    } catch (e) {
      err.textContent = `Bild konnte nicht gespeichert werden: ${e?.message || e}`; err.hidden = false;
    } finally { b.classList.remove('busy'); b.firstChild.setAttribute('icon', 'mdi:camera-plus-outline'); }
  });
  icons.forEach(ic => {
    const b = document.createElement('button');
    b.type = 'button'; b.dataset.icon = ic; b.title = ic.slice(4);
    b.innerHTML = `<ha-icon icon="${ic}"></ha-icon>`;
    b.addEventListener('click', e => { e.stopPropagation(); set({icon: ic}); });
    grid.append(b);
  });
  // Suche über alle MDI-Icons: Icon-Auswahl von HA (ha-form mit icon-Selector).
  // HA-INTERN: ha-form wird über loadForm() nachgeladen; fehlt es, gibt es ein Textfeld für „mdi:…“.
  let form = null;
  if (search) loadForm().then(() => {
    if (customElements.get('ha-form')) {
      form = document.createElement('ha-form');
      form.schema = [{name: 'icon', selector: {icon: {}}}];
      form.computeLabel = () => 'Icon suchen';
      form.hass = h;
      form.addEventListener('value-changed', e => { e.stopPropagation(); const ic = e.detail.value?.icon; if (ic && ic !== cur.icon) set({icon: ic}); });
    } else {
      form = document.createElement('input');
      form.className = 'fld'; form.placeholder = 'mdi:…'; form.style.cssText = 'height:44px;border-radius:var(--nv-r-pill);padding:0 var(--nv-s8)';
      form.addEventListener('change', () => { const v = form.value.trim(); if (/^[a-z0-9-]+:[a-z0-9-]+$/.test(v)) set({icon: v}); });
      Object.defineProperty(form, 'data', {set: d => { form.value = d.icon || ''; }});
    }
    srch.append(form);
    paint();
  });
  paint();
  // Wert von außen setzen (z. B. Vorschlag für einen bekannten Artikel), ohne onChange
  el.set = v => { cur = {icon: v?.icon || null, image: v?.image || null}; paint(true); };
  el.setHass = x => { h = x; if (form && 'hass' in form) form.hass = x; };
  return el;
}
