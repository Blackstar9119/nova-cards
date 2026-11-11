// Einträge einer todo-Liste live mitlesen (Einkauf, gespeicherte Notizen).
// HA-INTERN: WebSocket „todo/item/subscribe“ liefert die Einträge und jede Änderung daran (nutzt auch die
// Aufgabenlisten-Karte von HA). Klappt das nicht, werden die Einträge über den Dienst todo.get_items geholt –
// beim Start und bei jeder Zustandsänderung der Liste. In der Kartenauswahl wird nur einmal geholt (kein Abo).
import {inPicker} from './lifecycle.js';

export class TodoFeed {
  // onChange() wird nach jeder Änderung von items/err aufgerufen
  constructor(card, onChange) { this.card = card; this.onChange = onChange; this.id = null; this.items = null; this.err = null; }
  // Liste wechseln (null = keine)
  setEntity(id) {
    if (id === this.id) return;
    this.stop();
    this.id = id || null; this.items = null; this.err = null;
  }
  // Bei jedem hass-Update aufrufen: startet das Abo bzw. holt im Ersatzweg neu, wenn sich die Liste geändert hat
  update(h, old) {
    const id = this.id;
    if (!id || !h?.states[id]) return;
    if (this.fallback) { if (old?.states[id] !== h.states[id] || !this.items) this.fetch(h); return; }
    if (this.sub || !this.card.isConnected) return;
    if (inPicker(this.card)) { this.fallback = true; this.fetch(h); return; }
    this.sub = h.connection.subscribeMessage(m => {
      if (this.id !== id) return;
      this.items = Array.isArray(m?.items) ? m.items : [];
      this.err = null;
      this.onChange();
    }, {type: 'todo/item/subscribe', entity_id: id}).catch(err => {
      console.warn('[nova-cards] todo: Abo nicht möglich, hole Einträge über todo.get_items', id, err);
      this.sub = null; this.fallback = true; this.fetch(h);
      return null;
    });
  }
  stop() {
    const s = this.sub;
    this.sub = null; this.fallback = false;
    s?.then(u => typeof u === 'function' && u()).catch(() => {});
  }
  async fetch(h) {
    const id = this.id;
    if (!h || !id || !h.states[id]) return;
    const n = this._n = (this._n || 0) + 1;
    try {
      const res = await h.callService('todo', 'get_items', {}, {entity_id: id}, false, true);
      if (n !== this._n || id !== this.id) return;
      this.items = res?.response?.[id]?.items || [];
      this.err = null;
    } catch (err) { this.err = err?.message || 'Liste konnte nicht geladen werden'; }
    this.onChange();
  }
  call(h, service, data) { return h.callService('todo', service, data, {entity_id: this.id}); }
}
