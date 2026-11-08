import { test } from 'node:test';
import assert from 'node:assert/strict';
import { mkdtemp, writeFile, rm } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { join } from 'node:path';
import { once } from 'node:events';
import { MOVES, VERSION, authoredChoice, validateChoice, remoteChoice } from '../app/tutor/teaching.mjs';
import { ingest, readingSegment, Protocol } from '../app/tutor/core.mjs';
import { choose } from '../scripts/tutor_provider.mjs';
import { tutorServer } from '../scripts/serve_tutor.mjs';
import '../app/physics-notes/content.js';
import '../app/physics-notes/models.js';
const request = { version: VERSION, current: 'start', question: 'Where does energy go?' };
const envelope = value => ({ status: 'completed', output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: JSON.stringify(value) }] }] });
const fake = value => async () => new Response(JSON.stringify(value));

test('Every teaching move has real grounding, trusted visuals and exact-source board validation', () => {
  const lesson = globalThis.HahaPhysicsNotesContent.lessons.find(l => l.section === '8.3');
  assert.equal(new Set(MOVES.map(m => m.id)).size, MOVES.length);
  for (const move of MOVES) {
    for (const section of move.sections) assert(lesson.sections[section]?.text.en);
    if (move.visual) assert(lesson.visuals.some(v => v.kind === move.visual));
    const chunks = ingest(move.title, move.text), p = new Protocol('test', chunks);
    chunks.forEach((chunk, seq) => p.accept({ v: 1, session: 'test', seq, type: 'segment', ...readingSegment(chunk, seq) }));
    p.accept({ v: 1, session: 'test', seq: chunks.length, type: 'done', reason: 'complete' }); p.finish();
  }
  for (const q of [0, .25, .5, .75, 1]) {
    const state = globalThis.HahaPhysicsNotesModels.model('friction', q, 0);
    assert(state.rows.find(r => r.key === 'kinetic').value >= 0);
    assert(Math.abs(state.rows.find(r => r.key === 'kinetic').value + state.rows.find(r => r.key === 'internalEnergy').value - 1) < 1e-9);
  }
});
test('Authored routes clarify misconceptions and bound unsupported requests', () => {
  for (const [question, expected] of [['Why is the normal force smaller?', 'normal'], ['Energy was destroyed', 'energy'], ['Does less friction mean faster?', 'angle'], ['Only the block warms?', 'boundary'], ['Can kinetic energy go negative?', 'distance'], ['photosynthesis', 'unsupported']])
    assert.equal(authoredChoice(question).id, expected);
  assert.equal(authoredChoice('repeat', 'angle').id, 'angle');
  assert.equal(authoredChoice('next', 'summary').id, 'summary');
  assert.equal(authoredChoice('next', 'unsupported').id, 'summary');
  assert.throws(() => validateChoice({ move: 'angle', text: 'invented science' }));
  assert.throws(() => validateChoice({ move: '__proto__' }));
});
test('Provider is stateless, bounded and never accepts generated prose, refusal or incomplete output', async () => {
  let sent;
  const result = await choose(request, { key: 'synthetic-not-a-key', model: 'synthetic-model', fetcher: async (url, options) => {
    assert.equal(url, 'https://api.openai.com/v1/responses'); sent = JSON.parse(options.body); return new Response(JSON.stringify(envelope({ move: 'energy' })));
  } });
  assert.deepEqual(result, { move: 'energy' });
  assert.equal(sent.store, false); assert.equal(sent.text.format.strict, true);
  assert(!('previous_response_id' in sent)); assert(!('tools' in sent));
  for (const bad of [envelope({ move: 'bogus' }), envelope({ move: 'angle', text: '<script>' }), { status: 'incomplete', output: [] }, { status: 'completed', output: [{ type: 'message', role: 'assistant', content: [{ type: 'refusal' }] }] }])
    await assert.rejects(choose(request, { key: 'synthetic', model: 'synthetic', fetcher: fake(bad) }));
  await assert.rejects(choose({ ...request, transcript: 'synthetic' }, { key: 'synthetic', model: 'synthetic', fetcher: fake(envelope({ move: 'start' })) }));
  await assert.rejects(remoteChoice('energy', 'start', new AbortController().signal, fake({ move: 'energy', diagram: '<svg>' })));
  await assert.rejects(remoteChoice('energy', 'start', new AbortController().signal, async () => new Response('', { status: 503 })));
});
test('Local gateway blocks other origins, oversized requests, traversal and request-budget exhaustion', async () => {
  const root = await mkdtemp(join(tmpdir(), 'haha-tutor-'));
  await writeFile(join(root, 'index.html'), '<h1>Synthetic fixture</h1>');
  const server = tutorServer(root, { key: 'synthetic', model: 'synthetic', limit: 1, fetcher: fake(envelope({ move: 'normal' })) });
  server.listen(0, '127.0.0.1'); await once(server, 'listening');
  const origin = `http://127.0.0.1:${server.address().port}`;
  const post = (body, source = origin) => fetch(origin + '/api/tutor/choose', { method: 'POST', headers: { Origin: source, 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  try {
    assert.equal((await fetch(origin)).status, 200);
    assert.equal((await fetch(origin + '/%2e%2e%2fsecrets.json')).status, 404);
    assert.deepEqual(await (await fetch(origin + '/api/tutor/status')).json(), { available: true });
    assert.equal((await post(request, 'https://other.invalid')).status, 403);
    assert.equal((await post({ ...request, question: 'x'.repeat(3000) })).status, 413);
    const response = await post(request);
    assert.equal(response.status, 200); assert.deepEqual(await response.json(), { move: 'normal' });
    assert.equal((await post(request)).status, 429);
  } finally { server.closeAllConnections(); await new Promise(resolve => server.close(resolve)); await rm(root, { recursive: true, force: true }); }
});
