// Präfix aller Elemente: „nova-“, im Dev-Build „nova-dev-“ (setzt build.mjs), damit beide Versionen nebeneinander laufen
import {themeable} from './theme-apply.js';

export const DEV = __DEV__;
export const tag = name => `${DEV ? 'nova-dev-' : 'nova-'}${name}`;

// Element registrieren und (mit meta) in der Kartenauswahl von HA anzeigen; name ohne Präfix, z. B. 'dock-card'
export const define = (name, cls, meta) => {
  const t = tag(name);
  // Karten (mit meta) bekommen das Nova-Theme: Option theme, Theme-Variable nova-theme, globaler Speicher
  if (meta) themeable(cls);
  if (!customElements.get(t)) customElements.define(t, cls);
  if (meta) {
    window.customCards = window.customCards || [];
    if (DEV) meta = {...meta, name: `${meta.name} (Dev)`};
    if (!window.customCards.some(c => c.type === t)) window.customCards.push({type: t, preview: true, ...meta});
  }
};

// Hilfe-Link im Karteneditor („?“): Seite der Karte im Nova-Handbuch (nova-integration/docs)
const HANDBUCH = 'https://github.com/Blackstar9119/nova-integration/blob/main/docs/de/karten';
export const docUrl = page => `${HANDBUCH}/${page}.md`;
