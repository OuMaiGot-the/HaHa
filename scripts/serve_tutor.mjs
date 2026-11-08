// Optional LOCAL gateway. Not an internet deployment or authentication substitute.
import { createServer } from 'node:http';
import { readFile, realpath, stat } from 'node:fs/promises';
import { resolve, extname, sep } from 'node:path';
import { pathToFileURL } from 'node:url';
import { choose } from './tutor_provider.mjs';

export function tutorServer(root, { key = '', model = '', fetcher = fetch, limit = 60, now = Date.now } = {}) {
  let used = 0, start = now(), busy = false;
  const json = (res, code, value) => { res.writeHead(code, { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' }); res.end(JSON.stringify(value)); };
  return createServer(async (req, res) => {
    const port = req.socket.localPort, origin = `http://127.0.0.1:${port}`;
    if (req.headers.host !== `127.0.0.1:${port}` || req.socket.remoteAddress !== '127.0.0.1') { json(res, 403, { error: 'Local access only.' }); return; }
    const path = new URL(req.url, origin).pathname;
    if (path === '/api/tutor/status' && req.method === 'GET') { json(res, 200, { available: Boolean(key && model) }); return; }
    if (path === '/api/tutor/choose') {
      if (req.method !== 'POST' || req.headers.origin !== origin || req.headers['content-type'] !== 'application/json') { json(res, 403, { error: 'Same-origin JSON POST required.' }); return; }
      if (!key || !model) { json(res, 503, { error: 'Provider unavailable.' }); return; }
      if (now() - start >= 3600000) { start = now(); used = 0; }
      if (busy || used >= limit) { json(res, 429, { error: 'Request budget reached. Use authored teaching.' }); return; }
      busy = true;
      const controller = new AbortController();
      const timer = setTimeout(() => controller.abort(), 18000);
      req.setTimeout(5000, () => req.destroy());
      res.on('close', () => controller.abort());
      try {
        let bytes = 0;
        const parts = [];
        for await (const chunk of req) {
          bytes += chunk.length;
          if (bytes > 2048) { json(res, 413, { error: 'Request too large.' }); return; }
          parts.push(chunk);
        }
        // Count all admitted requests, including malformed requests. Never log their contents.
        used++;
        let value;
        try { value = JSON.parse(new TextDecoder('utf-8', { fatal: true }).decode(Buffer.concat(parts))); }
        catch { json(res, 400, { error: 'Invalid JSON.' }); return; }
        const { validateRequest } = await import('../app/tutor/teaching.mjs');
        try { validateRequest(value); } catch { json(res, 400, { error: 'Invalid request.' }); return; }
        const result = await choose(value, { key, model, fetcher, signal: controller.signal });
        if (!res.destroyed) json(res, 200, result);
      } catch { if (!res.destroyed) json(res, 502, { error: 'Teaching request failed. Use authored teaching.' }); }
      finally { clearTimeout(timer); busy = false; }
      return;
    }
    if (path.startsWith('/api/')) { json(res, 404, { error: 'Unknown endpoint.' }); return; }
    if (!['GET', 'HEAD'].includes(req.method)) { json(res, 405, { error: 'Read only.' }); return; }
    try {
      const base = await realpath(root);
      let target = resolve(base, '.' + decodeURIComponent(path));
      if ((await stat(target)).isDirectory()) target = resolve(target, 'index.html');
      target = await realpath(target);
      if (!target.startsWith(base + sep) || target.slice(base.length + 1).split(/[\\/]/).some(x => x.startsWith('.'))) throw Error();
      const types = { '.html': 'text/html', '.js': 'text/javascript', '.mjs': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };
      const mime = types[extname(target)];
      if (!mime) throw Error();
      const body = await readFile(target);
      res.writeHead(200, { 'Content-Type': mime, 'Cache-Control': 'no-store', 'X-Content-Type-Options': 'nosniff' });
      res.end(req.method === 'HEAD' ? undefined : body);
    } catch { json(res, 404, { error: 'Not found.' }); }
  });
}
if (process.argv[1] && import.meta.url === pathToFileURL(resolve(process.argv[1])).href) {
  const root = resolve(process.argv[2] || 'preview');
  const port = Number(process.env.TUTOR_PORT || 18770);
  const server = tutorServer(root, { key: process.env.OPENAI_API_KEY, model: process.env.OPENAI_TUTOR_MODEL });
  server.requestTimeout = 20000;
  server.listen(port, '127.0.0.1', () => console.log(`Tutor preview: http://127.0.0.1:${port}/tutor/ (AI ${process.env.OPENAI_API_KEY && process.env.OPENAI_TUTOR_MODEL ? 'configured' : 'off'})`));
}
