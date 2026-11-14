// Gemeinsames der Rezept-Karten (Nova Rezeptliste und Nova Rezeptbuch): Mengen und Zeiten als Text, Zutaten aus einer Textzeile.

export const num = q => String(Math.round((+q || 0) * 100) / 100).replace('.', ',');
// „250 g“, „3“, „1 Prise“ – k rechnet auf andere Portionen um
export const amount = (ing, k = 1) => ing.qty == null ? (ing.unit || '') : `${num(ing.qty * k)}${ing.unit ? ` ${ing.unit}` : ''}`;
export const mins = t => t >= 60 ? `${Math.floor(t / 60)} Std${t % 60 ? ` ${t % 60} Min` : ''}` : `${t} Min`;

// Zutat als eine Zeile („250 g Mehl“) und zurück. Einheit nur, wenn sie die Integration kennt (units) – sonst gehört das Wort zum Namen.
export const ingredientLine = ing => [amount(ing), ing.name].filter(Boolean).join(' ');
export function parseIngredient(line, units = []) {
  const s = String(line || '').trim();
  if (!s) return null;
  const m = /^(\d+(?:[.,]\d+)?)\s*(.*)$/.exec(s);
  if (!m || !m[2]) return {qty: null, unit: '', name: s};
  const [first, ...rest] = m[2].split(/\s+/);
  const unit = rest.length ? units.find(u => u && u.toLowerCase() === first.toLowerCase()) : null;
  return {qty: parseFloat(m[1].replace(',', '.')), unit: unit || '', name: unit ? rest.join(' ') : m[2]};
}

// Rezept-Import per Link: Kurzname der Quelle („chefkoch.de“) und Meldungen zu den Fehlercodes der Integration
export const sourceHost = url => {
  if (typeof url !== 'string' || !/^https?:\/\//i.test(url)) return '';
  try { return new URL(url).hostname.replace(/^www\./, ''); } catch { return ''; }
};
export const IMPORT_ERR = {
  invalid_url: 'Das ist kein gültiger Link.',
  fetch_failed: 'Die Seite ist gerade nicht erreichbar.',
  blocked: 'Die Seite lässt sich nicht abrufen (gesperrt oder im eigenen Netz).',
  too_large: 'Die Seite ist zu groß zum Einlesen.',
  module_disabled: 'Das Rezept-Modul ist in Nova abgeschaltet.',
};
export const importError = x => IMPORT_ERR[x?.code] || (x?.code === 'unknown_command' ? 'Dafür braucht es eine neuere Version von Nova Homeverse.' : 'Das hat nicht geklappt. Später nochmal versuchen?');
