// Windows portable offline tutor. No account keys, env files, cloud calls or global installs.
import { spawn, spawnSync } from 'node:child_process';
import { createHash, randomBytes } from 'node:crypto';
import { createReadStream } from 'node:fs';
import { mkdtemp, writeFile, unlink, rmdir } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import { resolve, join, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import { createServer } from 'node:net';
import { tutorServer } from './serve_tutor.mjs';

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const proof = resolve(root, '../integration-artifacts/free-ai-proof');
const args = process.argv.slice(2);
function option(name, fallback) {
  const index = args.indexOf(name);
  if (index < 0) return fallback;
  if (!args[index + 1] || args[index + 1].startsWith('--')) throw Error(`Missing value for ${name}.`);
  return args[index + 1];
}
const runtime = resolve(option('--runtime', join(proof, 'runtime/llama-server.exe')));
const modelFile = resolve(option('--model-file', join(proof, 'qwen2.5-1.5b-instruct-q4_k_m.gguf')));
const port = Number(option('--port', '18773')), modelPort = Number(option('--model-port', '18778'));
const expected = {
  runtime: '75e1099fec4b0e2c0ddd90813653a6a70638b79c6f6d38bf3103c85d7312e89e',
  model: '6a1a2eb6d15622bf3c96857206351ba97e1af16c30d7a74ee38970e434e9407e'
};
async function digest(path) {
  const hash = createHash('sha256');
  for await (const chunk of createReadStream(path)) hash.update(chunk);
  return hash.digest('hex');
}
async function checkPort(value) {
  if (!Number.isInteger(value) || value < 1024 || value > 65535) throw Error('Choose a port between 1024 and 65535.');
  await new Promise((accept, reject) => {
    const probe = createServer(); probe.once('error', () => reject(Error(`Port ${value} is already in use.`)));
    probe.listen(value, '127.0.0.1', () => probe.close(accept));
  });
}
let child, server, tokenPath, temporary, cleaning = false;
async function cleanup() {
  if (cleaning) return;
  cleaning = true;
  server?.closeAllConnections(); server?.close();
  if (child?.pid && child.exitCode === null) {
    const stopped = new Promise(resolve => child.once('exit', resolve));
    child.kill(); await stopped;
  }
  if (tokenPath) await unlink(tokenPath).catch(() => {});
  // Non-recursive: only remove the generated credential directory if it is empty.
  if (temporary) await rmdir(temporary).catch(() => {});
}
process.once('SIGINT', () => cleanup().then(() => process.exit(0)));
process.once('SIGTERM', () => cleanup().then(() => process.exit(0)));
try {
  if (process.platform !== 'win32') throw Error('This pinned portable launcher currently supports Windows only.');
  if (port === modelPort) throw Error('The website and model need different ports.');
  await checkPort(port); await checkPort(modelPort);
  console.log('Checking the portable runtime and model…');
  if (await digest(runtime) !== expected.runtime || await digest(modelFile) !== expected.model)
    throw Error('The portable files do not match the verified version. See docs/LOCAL_TUTOR.md for the exact downloads.');
  const site = await mkdtemp(join(tmpdir(), 'haha-local-site-'));
  const built = spawnSync('python', [join(root, 'scripts/build_catalog_release.py'), site, '--include-tutor-lab'], { cwd: root, windowsHide: true, stdio: 'pipe' });
  if (built.status !== 0) throw Error('Could not build the local learning app. Check that Python and the project are available.');
  temporary = await mkdtemp(join(tmpdir(), 'haha-model-session-'));
  tokenPath = join(temporary, 'access.key');
  const token = randomBytes(32).toString('hex');
  await writeFile(tokenPath, token, { flag: 'wx', mode: 0o600 });
  const alias = 'haha-local-' + randomBytes(8).toString('hex');
  child = spawn(runtime, ['-m', modelFile, '--host', '127.0.0.1', '--port', String(modelPort), '-t', '6', '-c', '4096', '-ngl', '0', '--offline', '-np', '1', '--api-key-file', tokenPath, '--alias', alias, '--no-webui', '--log-disable'],
    { cwd: root, windowsHide: true, stdio: 'ignore' });
  let childError = false;
  child.once('error', () => { childError = true; });
  const origin = `http://127.0.0.1:${modelPort}`;
  let ready = false;
  for (let attempt = 0; attempt < 120; attempt++) {
    if (childError || child.exitCode !== null) throw Error('The offline model could not start.');
    try {
      const response = await fetch(origin + '/v1/models', { headers: { Authorization: `Bearer ${token}` }, redirect: 'error', signal: AbortSignal.timeout(500) });
      const data = response.ok ? await response.json() : null;
      if (data?.data?.some(model => model.id === alias)) { ready = true; break; }
    } catch { /* Wait for the owned local model to become ready. */ }
    await new Promise(resolve => setTimeout(resolve, 500));
  }
  if (!ready) throw Error('The offline model did not become ready within one minute.');
  server = tutorServer(site, { local: { endpoint: origin + '/v1/chat/completions', model: alias, token, isReady: () => !childError && child.exitCode === null }, shutdown: cleanup });
  server.requestTimeout = 35000;
  await new Promise((accept, reject) => { server.once('error', reject); server.listen(port, '127.0.0.1', accept); });
  console.log(`Local HaHa tutor: http://127.0.0.1:${port}/tutor/`);
  console.log('Offline CPU model ready. No API credits or account key are used. Press Ctrl+C to stop.');
} catch (error) {
  console.error(error.code === 'ENOENT' ? 'Portable model/runtime not found. See docs/LOCAL_TUTOR.md.' : error.message);
  await cleanup(); process.exitCode = 1;
}
