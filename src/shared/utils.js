export const esc = s => String(s ?? '').replace(/[&<>"']/g, c => ({'&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'})[c]);
export const dom = id => String(id || '').split('.')[0];
export const isImg = s => typeof s === 'string' && /^(\/|https?:|data:image)/.test(s);
// "a, b" oder ['a', 'b'] → ['a', 'b']
export const list = v => [].concat(v ?? []).flatMap(x => String(x).split(',')).map(x => x.trim()).filter(Boolean);
export const NUMRE = /^-?\d+(\.\d+)?$/;
// Kurzschreibweise "- sensor.x" als Objekt
export const toObj = x => typeof x === 'string' ? {entity: x} : {...x};
// Cache-Buster für Bild-URLs
export const stamp = (u, v) => u + (u.includes('?') ? '&' : '?') + 't=' + encodeURIComponent(v);
// icon_map: Schlüssel ohne Groß/Klein, z. B. {netflix: /local/logos/netflix.svg}
export const mapIcon = (map, ...keys) => {
  if (!map) return null;
  const m = Object.fromEntries(Object.entries(map).map(([k, v]) => [String(k).toLowerCase(), v]));
  for (const k of keys) if (k != null && m[String(k).toLowerCase()]) return m[String(k).toLowerCase()];
  return null;
};
// Icon oder Bild in ein Element setzen (nur bei Änderung)
export const setIcon = (el, ic) => { if (el._ic === ic) return; el._ic = ic; el.innerHTML = isImg(ic) ? `<img src="${esc(ic)}" alt="">` : `<ha-icon icon="${esc(ic)}"></ha-icon>`; };
// Kalendertag „JJJJ-MM-TT“ eines Zeitpunkts in Zeitzone tz (undefined = Browser)
export function ymdIn(d, tz) {
  try {
    const p = Object.fromEntries(new Intl.DateTimeFormat('en-CA', {timeZone: tz, year: 'numeric', month: '2-digit', day: '2-digit'}).formatToParts(d).map(x => [x.type, x.value]));
    return `${p.year}-${p.month}-${p.day}`;
  } catch { return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`; }
}
