// Deployed only behind Sites' private access and trusted identity headers.
import { choose } from '../scripts/tutor_provider.mjs';
import { VERSION, validateRequest } from '../app/tutor/teaching.mjs';

const MAX_REQUEST = 2048;
export const DAILY_LIMIT = 30;
export const ROLL_OVER_SQL = `INSERT INTO tutor_budget (slot, day, used) VALUES (1, ?, 0)
  ON CONFLICT(slot) DO UPDATE SET day=excluded.day, used=0 WHERE tutor_budget.day < excluded.day`;
export const RESERVE_SQL = 'UPDATE tutor_budget SET used=used+1 WHERE slot=1 AND day=? AND used<? RETURNING used';
export function json(status, value) {
  return new Response(JSON.stringify(value), { status, headers: {
    'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'no-store',
    'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'no-referrer'
  } });
}
function identity(request) {
  // Dispatch authenticates these headers. Never accept browser-supplied identity on another host.
  return Boolean(request.headers.get('oai-authenticated-user-id') && request.headers.get('oai-authenticated-user-email'));
}
async function boundedJSON(request, signal) {
  if (Number(request.headers.get('content-length')) > MAX_REQUEST) throw Object.assign(Error(), { status: 413 });
  if (!request.body) throw Object.assign(Error(), { status: 400 });
  const reader = request.body.getReader(), parts = [];
  let size = 0;
  const abort = () => { reader.cancel().catch(() => {}); };
  signal.addEventListener('abort', abort, { once: true });
  try {
    while (true) {
      if (signal.aborted) throw Object.assign(Error(), { status: 504 });
      const { done, value } = await reader.read();
      if (signal.aborted) throw Object.assign(Error(), { status: 504 });
      if (done) break;
      size += value.byteLength;
      if (size > MAX_REQUEST) { await reader.cancel(); throw Object.assign(Error(), { status: 413 }); }
      parts.push(value);
    }
    const body = new Uint8Array(size); let offset = 0;
    for (const part of parts) { body.set(part, offset); offset += part.byteLength; }
    return validateRequest(JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(body)));
  } finally { signal.removeEventListener('abort', abort); reader.releaseLock(); }
}
export async function reserveBudget(db, day) {
  // A transaction admits at most DAILY_LIMIT calls across concurrent Worker isolates.
  // Single global row: no user identifier, transcript, event trail or growing history.
  const result = await db.batch([
    db.prepare(ROLL_OVER_SQL).bind(day),
    db.prepare(RESERVE_SQL).bind(day, DAILY_LIMIT)
  ]);
  if (!Array.isArray(result) || result.length !== 2 || result.some(r => !r.success)) throw Error('Budget unavailable.');
  return result[1].results?.length === 1;
}
export async function tutorAPI(request, env, { origin, now = Date.now, fetcher = fetch } = {}) {
  const url = new URL(request.url);
  if (!origin || url.origin !== origin || url.protocol !== 'https:') return json(403, { error: 'Unsupported host.' });
  if (!identity(request)) return json(401, { error: 'Sign in to use the protected pilot.', signIn: '/signin-with-chatgpt?return_to=%2Ftutor%2F' });
  const ready = Boolean(env.OPENAI_API_KEY && env.OPENAI_TUTOR_MODEL && env.DB);
  if (url.pathname === '/api/tutor/status' && request.method === 'GET')
    return json(200, { available: ready, reason: ready ? 'ready' : 'setup-required', version: VERSION, dailyLimit: DAILY_LIMIT });
  if (url.pathname !== '/api/tutor/choose') return json(404, { error: 'Unknown endpoint.' });
  if (request.method !== 'POST') return json(405, { error: 'POST required.' });
  if (request.headers.get('origin') !== origin || (request.headers.get('sec-fetch-site') && request.headers.get('sec-fetch-site') !== 'same-origin'))
    return json(403, { error: 'Same-origin request required.' });
  if (request.headers.get('content-type')?.split(';')[0].trim().toLowerCase() !== 'application/json') return json(415, { error: 'JSON required.' });
  if (!ready) return json(503, { error: 'AI setup is incomplete. Use authored teaching.' });
  const controller = new AbortController(), timer = setTimeout(() => controller.abort(), 18000);
  const disconnect = () => controller.abort();
  request.signal.addEventListener('abort', disconnect, { once: true });
  if (request.signal.aborted) controller.abort();
  try {
    let value;
    try { value = await boundedJSON(request, controller.signal); }
    catch (error) { return json(error.status || 400, { error: 'Invalid or incomplete teaching request.' }); }
    let admitted;
    try { admitted = await reserveBudget(env.DB, new Date(now()).toISOString().slice(0, 10)); }
    catch { return json(503, { error: 'Request budget unavailable. Use authored teaching.' }); }
    if (!admitted) return json(429, { error: 'Daily pilot limit reached. Use authored teaching.' });
    if (controller.signal.aborted) return json(504, { error: 'Teaching request timed out.' });
    try {
      const result = await choose(value, { key: env.OPENAI_API_KEY, model: env.OPENAI_TUTOR_MODEL, fetcher, signal: controller.signal });
      return json(200, result);
    } catch { return json(controller.signal.aborted ? 504 : 502, { error: 'AI selection failed. Use authored teaching.' }); }
  } finally { clearTimeout(timer); request.signal.removeEventListener('abort', disconnect); }
}

// Asset map is supplied by the deterministic build; no filesystem/network asset fallback.
export function pilotWorker(assets, origin) {
  return { async fetch(request, env) {
    const url = new URL(request.url);
    if (url.origin !== origin) return json(403, { error: 'Unsupported host.' });
    if (url.pathname.startsWith('/api/')) return tutorAPI(request, env, { origin });
    if (!identity(request)) return Response.redirect(origin + '/signin-with-chatgpt?return_to=%2Ftutor%2F', 302);
    if (!['GET', 'HEAD'].includes(request.method)) return json(405, { error: 'Read only.' });
    const path = url.pathname === '/' ? '/tutor/' : url.pathname;
    const asset = assets[path];
    if (!asset) return json(404, { error: 'Not found.' });
    return new Response(request.method === 'HEAD' ? null : asset.body, { headers: {
      'Content-Type': asset.type, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff',
      'Referrer-Policy': 'no-referrer', 'Permissions-Policy': 'camera=(), geolocation=(), microphone=(self)'
    } });
  } };
}
