// Provider-neutral tutor transport and deterministic, local source-reading adapter.
export const LIMITS = Object.freeze({ bytes: 100000, chunks: 160, words: 36, events: 12 });
const words = text => text.toLocaleLowerCase().match(/[\p{L}\p{N}]+/gu) || [];
const stop = new Set('a an the is are of to in on for and or me teach explain about what how does do'.split(' '));

export function ingest(name, text) {
  if (typeof text !== 'string' || new TextEncoder().encode(text).length > LIMITS.bytes) throw Error('Notes must be at most 100 KB.');
  if (text.includes('\u0000') || text.startsWith('%PDF')) throw Error('Use UTF-8 original text notes; PDF extraction is not available.');
  const chunks = [];
  text.replace(/\r\n?/g, '\n').split('\n').forEach((line, index) => {
    const tokens = line.trim().split(/\s+/).filter(Boolean);
    for (let i = 0; i < tokens.length;) {
      if (chunks.length >= LIMITS.chunks) throw Error('Notes contain too many sections; upload a shorter topic.');
      const part = [];
      while (i < tokens.length && part.length < LIMITS.words && (!part.length || [...part, tokens[i]].join(' ').length <= 200)) {
        if (tokens[i].length > 60) throw Error('A word is too long to display; use short original teaching notes.');
        part.push(tokens[i++]);
      }
      const content = part.join(' ');
      chunks.push(Object.freeze({ id: `note-${chunks.length + 1}`, name: name.slice(0, 120), line: index + 1, text: content }));
    }
  });
  if (!chunks.length) throw Error('These notes are empty.');
  return Object.freeze(chunks);
}

export function retrieve(chunks, question) {
  if (question.length > 500) throw Error('Keep the topic under 500 characters.');
  const terms = [...new Set(words(question).filter(w => !stop.has(w)))];
  if (!terms.length) return [];
  return chunks.map((chunk, index) => {
    const bag = new Set(words(chunk.text));
    return { chunk, index, score: terms.filter(w => bag.has(w)).length / terms.length };
  }).filter(item => item.score >= 0.5).sort((a, b) => b.score - a.score || a.index - b.index).slice(0, 3).map(item => item.chunk);
}

export function readingSegment(chunk, row) {
  const actions = [];
  const tokens = [...chunk.text.matchAll(/\S+/g)];
  let x = 30, y = 55 + row * 145;
  for (const token of tokens) {
    const width = Math.min(640, token[0].length * 9 + 9);
    if (x + width > 710) { x = 30; y += 27; }
    actions.push({ kind: 'text', at: token.index, x, y, text: token[0] });
    x += width;
  }
  // A progressive underline is a navigation mark, never an inferred scientific diagram.
  actions.push({ kind: 'stroke', at: chunk.text.length, points: [[30, y + 10], [Math.max(45, x - 9), y + 10]] });
  return { source: chunk.id, text: chunk.text, actions };
}

export async function* localStream(chunks, question, session, signal) {
  const matches = retrieve(chunks, question);
  let seq = 0;
  for (const [row, chunk] of matches.entries()) {
    if (signal.aborted) return;
    yield { v: 1, session, seq: seq++, type: 'segment', ...readingSegment(chunk, row) };
  }
  if (!signal.aborted) yield { v: 1, session, seq, type: 'done', reason: matches.length ? 'complete' : 'no-source' };
}

export class Protocol {
  constructor(session, chunks) { this.session = session; this.sources = new Map(chunks.map(c => [c.id, c])); this.next = 0; this.done = false; }
  accept(event) {
    const fail = () => { throw Error('Invalid tutor stream. Playback stopped.'); };
    if (!event || this.done || event.v !== 1 || event.session !== this.session || event.seq !== this.next || this.next >= LIMITS.events) fail();
    if (event.type === 'done') {
      if (!['complete', 'no-source'].includes(event.reason)) fail();
      if ((event.reason === 'no-source') !== (this.next === 0)) fail();
      this.done = true;
    } else if (event.type === 'segment') {
      const source = this.sources.get(event.source);
      // This increment permits source reading only. A model adapter needs a separate semantic safety gate.
      if (!source || event.text !== source.text || !Array.isArray(event.actions) || event.actions.length > 80) fail();
      let previous = -1;
      for (const action of event.actions) {
        if (!Number.isInteger(action.at) || action.at < previous || action.at > event.text.length) fail();
        previous = action.at;
        const coord = (n, max) => Number.isFinite(n) && n >= 0 && n <= max;
        if (action.kind === 'text') {
          if (typeof action.text !== 'string' || action.text.length > 120 || !coord(action.x, 740) || !coord(action.y, 500)) fail();
          if (!event.text.slice(action.at).startsWith(action.text)) fail();
        } else if (action.kind === 'stroke') {
          if (!Array.isArray(action.points) || action.points.length < 2 || action.points.length > 100 || !action.points.every(p => Array.isArray(p) && p.length === 2 && coord(p[0], 740) && coord(p[1], 500))) fail();
        } else fail();
      }
    } else fail();
    this.next++;
    return event;
  }
  finish() { if (!this.done) throw Error('Tutor stream ended before completion.'); }
}

// Accept byte chunks from a future authenticated service without assuming network chunk boundaries.
export async function* decodeJSONL(bytes, signal) {
  const decoder = new TextDecoder('utf-8', { fatal: true });
  let pending = '';
  for await (const chunk of bytes) {
    if (signal.aborted) return;
    pending += decoder.decode(chunk, { stream: true });
    let end;
    while ((end = pending.indexOf('\n')) !== -1) {
      if (end > 32000) throw Error('Tutor event exceeds size limit.');
      const line = pending.slice(0, end); pending = pending.slice(end + 1);
      if (line.trim()) yield JSON.parse(line);
    }
    if (pending.length > 32000) throw Error('Tutor event exceeds size limit.');
  }
  pending += decoder.decode();
  if (pending.trim()) throw Error('Truncated tutor event.');
}

export class Playback {
  constructor(draw) { this.draw = draw; this.generation = 0; this.paused = false; this.offset = -1; }
  begin(segment) { this.segment = segment; this.cursor = 0; this.offset = -1; return ++this.generation; }
  advance(generation, offset) {
    if (generation !== this.generation || this.paused || !this.segment) return;
    this.offset = Math.max(this.offset, offset);
    while (this.cursor < this.segment.actions.length && this.segment.actions[this.cursor].at <= this.offset) this.draw(this.segment.actions[this.cursor++]);
  }
  pause() { this.paused = true; }
  resume() { this.paused = false; }
  cancel() { ++this.generation; this.segment = null; this.paused = false; }
}
