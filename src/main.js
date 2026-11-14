// Einstieg des vollen Builds (nova-cards.js für den Marketplace und für die Nova-Integration).
// Die Karten dürfen nur einmal laufen: Liefert die Nova-Integration sie schon aus und ist zusätzlich noch die alte
// Dashboard-Ressource nova-cards.js eingetragen, lädt die zweite Kopie nichts und sagt nur Bescheid.
// Der Dev-Build (nova-dev-*) hat einen eigenen Schlüssel und läuft weiter daneben.
const KEY = __DEV__ ? '__novaDevCards' : '__novaCards';
const SOURCE = __SOURCE__;
const first = window[KEY];

if (first) {
  const via = src => (src === 'integration' ? 'Nova Homeverse' : 'eine Dashboard-Ressource');
  console.warn(
    `Nova Cards sind doppelt eingebunden: v${first.version} über ${via(first.source)} und v${__VERSION__} über ${via(SOURCE)}. ` +
    'Es läuft nur die erste.' +
    ([first.source, SOURCE].includes('integration')
      ? ' Die alte Ressource nova-cards.js kann weg: Marketplace → Nova Cards → Entfernen.'
      : ''),
  );
} else {
  window[KEY] = {version: __VERSION__, source: SOURCE};
  import('./index.js');
}
