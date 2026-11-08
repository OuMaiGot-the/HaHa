import { test } from 'node:test';
import assert from 'node:assert/strict';
import { tutorAPI, pilotWorker, DAILY_LIMIT } from '../server/tutor-worker.mjs';
import { VERSION } from '../app/tutor/teaching.mjs';
const origin = 'https://synthetic-pilot.chatgpt.site';
const headers = { 'oai-authenticated-user-id': 'synthetic-id', 'oai-authenticated-user-email': 'synthetic@example.invalid' };
const body = { version: VERSION, current: 'start', question: 'Why is the normal force smaller?' };
function request(path = '/api/tutor/choose', options = {}) {
  return new Request(origin + path, { method: 'POST', body: JSON.stringify(body), ...options,
    headers: { ...headers, Origin: origin, 'Content-Type': 'application/json', ...options.headers } });
}
function database() {
  let count = 0;
  return { prepare(sql) { return { sql, bind(...args) { return { sql, args }; } }; },
    async batch(queries) {
      assert.equal(queries.length, 2);
      assert.equal(queries[1].args[1], DAILY_LIMIT);
      const used = count < DAILY_LIMIT ? ++count : null;
      return [{ success: true, results: [] }, { success: true, results: used ? [{ used }] : [] }];
    }, get used() { return count; } };
}
const provider = value => async () => new Response(JSON.stringify({ status: 'completed', output: [{ type: 'message', role: 'assistant', content: [{ type: 'output_text', text: JSON.stringify(value) }] }] }));
const environment = () => ({ OPENAI_API_KEY: 'synthetic-not-a-key', OPENAI_TUTOR_MODEL: 'synthetic-model', DB: database() });

test('Private API requires trusted identity, exact HTTPS host, same origin and bounded JSON', async () => {
  const env = environment(); let calls = 0;
  const fetcher = async () => { calls++; throw Error('Must not call provider.'); };
  for (const [req, status] of [
    [request(undefined, { headers: { 'oai-authenticated-user-id': '' } }), 401],
    [request(undefined, { headers: { Origin: 'https://other.invalid' } }), 403],
    [request(undefined, { headers: { 'sec-fetch-site': 'cross-site' } }), 403],
    [request(undefined, { headers: { 'Content-Type': 'text/plain' } }), 415],
    [request(undefined, { body: JSON.stringify({ ...body, uploadedNotes: 'synthetic' }) }), 400],
    [request(undefined, { body: JSON.stringify({ ...body, question: 'x'.repeat(3000) }) }), 413],
    [request(undefined, { body: '{broken' }), 400]
  ]) assert.equal((await tutorAPI(req, env, { origin, fetcher })).status, status);
  assert.equal((await tutorAPI(request(), env, { origin: 'https://other.invalid', fetcher })).status, 403);
  assert.equal((await tutorAPI(request(), {}, { origin, fetcher })).status, 503);
  assert.equal(calls, 0); assert.equal(env.DB.used, 0);
});
test('Shared budget admits only thirty provider calls and remains charged on failures', async () => {
  const env = environment(); let calls = 0;
  const fetcher = async (...args) => { calls++; return provider({ move: 'normal' })(...args); };
  const result = await Promise.all(Array.from({ length: 40 }, () => tutorAPI(request(), env, { origin, fetcher })));
  assert.equal(result.filter(r => r.status === 200).length, 30);
  assert.equal(result.filter(r => r.status === 429).length, 10); assert.equal(calls, 30);
  assert.deepEqual(await result[0].json(), { move: 'normal' });
  const broken = environment();
  assert.equal((await tutorAPI(request(), broken, { origin, fetcher: async () => { throw Error('synthetic upstream failure'); } })).status, 502);
  assert.equal(broken.DB.used, 1);
});
test('Budget outages, missing setup and invalid provider choices fail closed without leaking details', async () => {
  const env = environment();
  env.DB.batch = async () => { throw Error('synthetic private connection detail'); };
  const response = await tutorAPI(request(), env, { origin, fetcher: async () => { assert.fail('Budget must authorize first'); } });
  assert.equal(response.status, 503); assert(!(await response.text()).includes('private connection'));
  const bad = await tutorAPI(request(), environment(), { origin, fetcher: provider({ move: 'normal', text: 'untrusted' }) });
  assert.equal(bad.status, 502); assert(!(await bad.text()).includes('untrusted'));
  const status = await tutorAPI(request('/api/tutor/status', { method: 'GET', body: undefined }), {}, { origin });
  assert.deepEqual(await status.json(), { available: false, reason: 'setup-required', version: VERSION, dailyLimit: 30 });
  assert.equal(status.headers.get('Cache-Control'), 'no-store');
});
test('Private assets require identity and have no external asset or arbitrary-path fallback', async () => {
  const worker = pilotWorker({ '/tutor/': { body: '<h1>Synthetic fixture</h1>', type: 'text/html' } }, origin);
  const anonymous = await worker.fetch(new Request(origin + '/'), {});
  assert.equal(anonymous.status, 302); assert.equal(new URL(anonymous.headers.get('location')).origin, origin);
  const signedIn = await worker.fetch(new Request(origin + '/', { headers }), {});
  assert.equal(signedIn.status, 200); assert.match(await signedIn.text(), /Synthetic fixture/);
  assert.equal((await worker.fetch(new Request(origin + '/.env', { headers }), {})).status, 404);
  assert.equal((await worker.fetch(new Request(origin + '/', { method: 'POST', headers }), {})).status, 405);
});
