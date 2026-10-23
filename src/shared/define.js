// Element registrieren und (mit meta) in der Kartenauswahl von HA anzeigen
export const define = (tag, cls, meta) => {
  if (!customElements.get(tag)) customElements.define(tag, cls);
  if (meta) {
    window.customCards = window.customCards || [];
    if (!window.customCards.some(c => c.type === tag)) window.customCards.push({type: tag, preview: true, ...meta});
  }
};

const REPO = 'https://github.com/Blackstar9119/nova-cards';
export const docUrl = anchor => `${REPO}#${anchor}`;
