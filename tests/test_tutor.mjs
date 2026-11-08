import assert from 'node:assert/strict';
import { ingest, retrieve, localStream, Protocol, Playback, decodeJSONL, readingSegment } from '../app/tutor/core.mjs';

const chunks = ingest('Synthetic notes', 'Balanced forces preserve velocity.\nUnbalanced forces change velocity.\nA graph relates two variables.');
assert.equal(chunks[1].line, 2);
assert.equal(retrieve(chunks, 'balanced').length, 1);
assert.deepEqual(retrieve(chunks, 'photosynthesis'), []);
assert.deepEqual(retrieve(chunks, 'teach me'), []);
assert.throws(() => ingest('empty', '   '));
assert.throws(() => ingest('big', 'a'.repeat(100001)));
assert.throws(() => ingest('binary', '%PDF fake'));
assert.throws(() => ingest('huge word', 'a'.repeat(61)));
assert.throws(() => ingest('many', 'a\n'.repeat(161)));
assert.throws(() => retrieve(chunks, 'a'.repeat(501)));
const long = ingest('long', ('original conceptual teaching material '.repeat(40)));
assert(long.every(c => c.text.length <= 200));
const abort = new AbortController();
const events = [];
for await (const event of localStream(chunks, 'balanced', 's1', abort.signal)) events.push(event);
assert.equal(events.length, 2);
const protocol = new Protocol('s1', chunks);
events.forEach(e => protocol.accept(e)); protocol.finish();
assert.throws(() => protocol.accept(events[1]));
assert.throws(() => new Protocol('s2', chunks).accept(events[0]));
assert.throws(() => new Protocol('s1', chunks).accept({ ...events[0], seq: 1 }));
assert.throws(() => new Protocol('s1', chunks).accept({ ...events[0], source: 'missing' }));
assert.throws(() => new Protocol('s1', chunks).accept({ ...events[0], text: 'Unsupported claim' }));
for (const action of [
  { kind: 'script', at: 0 },
  { kind: 'text', at: 0, x: 900, y: 30, text: 'Balanced' },
  { kind: 'text', at: 0, x: 30, y: 30, text: '<script>' },
  { kind: 'stroke', at: 0, points: [[0, 0], [Infinity, 1]] },
  { kind: 'text', at: -1, x: 30, y: 30, text: 'Balanced' }
]) assert.throws(() => new Protocol('s1', chunks).accept({ ...events[0], actions: [action] }));
assert.throws(() => new Protocol('s1', chunks).finish());
const empty = [];
for await (const event of localStream(chunks, 'unknown', 's3', abort.signal)) empty.push(event);
assert.equal(empty[0].reason, 'no-source');
new Protocol('s3', chunks).accept(empty[0]);
abort.abort();
for await (const event of localStream(chunks, 'balanced', 's4', abort.signal)) assert.fail('Aborted stream emitted an event');

const drawn = [];
const playback = new Playback(action => drawn.push(action));
const segment = readingSegment(chunks[0], 0);
const generation = playback.begin(segment);
playback.advance(generation, 0); assert.equal(drawn.length, 1);
playback.advance(generation, 0); assert.equal(drawn.length, 1);
playback.pause(); playback.advance(generation, segment.text.length); assert.equal(drawn.length, 1);
playback.resume(); playback.advance(generation, segment.text.length); assert.equal(drawn.length, segment.actions.length);
playback.cancel(); playback.advance(generation, 999); assert.equal(drawn.length, segment.actions.length);
const fresh = playback.begin(segment);
playback.advance(generation, 999); assert.equal(drawn.length, segment.actions.length);
playback.advance(fresh, 0); assert.equal(drawn.length, segment.actions.length + 1);

async function* bytes(text, size = 3) {
  const buffer = new TextEncoder().encode(text);
  for (let i = 0; i < buffer.length; i += size) yield buffer.slice(i, i + size);
}
const decoded = [];
const wire = events.map(e => JSON.stringify(e)).join('\n') + '\n';
for await (const event of decodeJSONL(bytes(wire), new AbortController().signal)) decoded.push(event);
assert.deepEqual(decoded, events);
const unicode = [];
for await (const event of decodeJSONL(bytes('{"text":"力 → é"}\n', 1), new AbortController().signal)) unicode.push(event);
assert.equal(unicode[0].text, '力 → é');
for (const bad of ['{"v":1}', '{oops}\n', 'x'.repeat(32001)]) {
  await assert.rejects(async () => { for await (const e of decodeJSONL(bytes(bad, 1000), new AbortController().signal)) void e; });
}
console.log('Tutor core: grounding, bounds, protocol, cancellation, pause, stale callbacks, fragmented UTF-8 transport passed.');

// Checkpoints are bounded, isolated snapshots and disappear with material/session reset.
const { Continuity, remaining } = await import('../app/tutor/continuity.mjs');
const memory = new Continuity();
const lesson = memory.begin('balanced', [segment]);
lesson.offset = 9; lesson.drawn.push(segment.actions[0]);
memory.checkpoint();
lesson.drawn.push(segment.actions[1]);
assert.equal(memory.resume().drawn.length, 1);
assert.equal(memory.active.offset, 9);
assert.equal(remaining({ text: 'Force arrows show direction.' }, 8).text, 'arrows show direction.');
assert.equal(remaining(segment, -1).text, segment.text);
assert.equal(remaining(segment, segment.text.length).text, '');
for (let i = 0; i < 5; i++) { memory.begin(String(i), [segment]); memory.checkpoint(); }
assert.equal(memory.bookmarks.length, 3);
assert.equal(memory.resume().topic, '4');
memory.complete(); assert.equal(memory.active, null);
memory.clear(); assert.equal(memory.resume(), null);
console.log('Tutor continuity: bounded snapshots, word-safe resume, completion and clear passed.');
