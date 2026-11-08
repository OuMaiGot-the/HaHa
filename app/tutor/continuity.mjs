// Page-memory checkpoints only. Never serialize lesson material or conversation.
export class Continuity {
  constructor() { this.clear(); }
  clear() { this.active = null; this.bookmarks = []; }
  begin(topic, segments) {
    this.active = { topic, segments, index: 0, offset: -1, drawn: [], references: [] };
    return this.active;
  }
  checkpoint() {
    if (!this.active || this.active.index >= this.active.segments.length) return;
    this.bookmarks.push(structuredClone(this.active));
    if (this.bookmarks.length > 3) this.bookmarks.shift();
    this.active = null;
  }
  resume() { this.active = this.bookmarks.pop() || null; return this.active; }
  complete() { this.active = null; }
}

// Replay the current word to avoid skipping a partially spoken word. Drawn actions retain their original offsets.
export function remaining(segment, offset) {
  const next = [...segment.text.matchAll(/\S+/g)].find(word => word.index + word[0].length > offset);
  const start = offset < 0 ? 0 : next?.index ?? segment.text.length;
  return { text: segment.text.slice(start), start };
}
