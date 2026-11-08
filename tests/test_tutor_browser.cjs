// Synthetic-only browser integration. Start an isolated local static server.
const assert = require('node:assert/strict');
const { spawn } = require('node:child_process');
const path = require('node:path');
const { chromium } = require('playwright');
const root = path.resolve(__dirname, '..');
const url = 'http://127.0.0.1:18769/app/tutor/';
const delay = ms => new Promise(resolve => setTimeout(resolve, ms));

(async () => {
  const server = spawn('python', ['-m', 'http.server', '18769', '--bind', '127.0.0.1'], { cwd: root, stdio: 'ignore', windowsHide: true });
  let browser;
  try {
    let ready = false;
    for (let i = 0; i < 50; i++) {
      try { if ((await fetch(url)).ok) { ready = true; break; } } catch {}
      await delay(100);
    }
    assert(ready, 'Local test server did not start');
    browser = await chromium.launch({ headless: true });
    const page = await browser.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));
    await page.addInitScript(() => {
      let current, timer, paused = false;
      window.SpeechSynthesisUtterance = class { constructor(text) { this.text = text; } };
      const fake = {
        speak(utterance) {
          current = utterance; paused = false;
          if (window.tutorSpeechMode === 'error') { setTimeout(() => utterance.onerror?.(), 40); return; }
          let index = 0, started = false;
          timer = setInterval(() => {
            if (paused) return;
            if (!started) { started = true; utterance.onstart?.(); }
            if (window.tutorSpeechMode !== 'phrase') utterance.onboundary?.({ charIndex: index });
            index += 4;
            if (index > utterance.text.length) { clearInterval(timer); utterance.onend?.(); }
          }, 35);
        },
        pause() { paused = true; }, resume() { paused = false; },
        cancel() {
          clearInterval(timer);
          const stale = current;
          // Simulate a browser callback arriving after cancel.
          setTimeout(() => { stale?.onboundary?.({ charIndex: 10000 }); stale?.onend?.(); stale?.onerror?.(); }, 80);
          current = undefined;
        }
      };
      Object.defineProperty(window, 'speechSynthesis', { value: fake });
    });
    await page.addInitScript(() => {
      window.micInstances = [];
      window.SpeechRecognition = class {
        constructor() { window.micInstances.push(this); }
        start() { this.onaudiostart?.(); }
        abort() { this.aborted = true; this.onend?.(); }
        result(text, final = true) { const result = [{ transcript: text }]; result.isFinal = final; this.onresult?.({ resultIndex: 0, results: [result] }); }
      };
      window.micPermission = { state: 'prompt' };
      navigator.permissions.query = async () => window.micPermission;
    });
    await page.goto(url);
    await page.locator('#voice').uncheck();
    assert(await page.locator('#start').isDisabled());
    await page.locator('#sample').click();
    assert(!(await page.locator('#start').isDisabled()));
    await page.locator('#question').fill('photosynthesis'); await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelector('#status').textContent.startsWith('No matching source'));
    assert.equal(await page.locator('#board > *').count(), 0);

    await page.locator('#upload').setInputFiles({ name: 'synthetic.txt', mimeType: 'text/plain', buffer: Buffer.from('Force arrows show direction.') });
    await page.waitForFunction(() => document.querySelector('#material').textContent.startsWith('synthetic.txt:'));
    await page.locator('#question').fill('force'); await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelectorAll('#board text').length > 0);
    await page.locator('#pause').click();
    const pausedCount = await page.locator('#board > *').count(); await delay(250);
    assert.equal(await page.locator('#board > *').count(), pausedCount);
    await page.locator('#pause').click();
    await page.waitForFunction(() => document.querySelector('#status').textContent.startsWith('Finished reading'));
    assert.equal(await page.locator('#board text').count(), 4);
    assert.equal(await page.locator('#board polyline').count(), 1);
    assert.match(await page.locator('#sources').textContent(), /synthetic.txt, line 1/);

    await page.locator('#voice').check(); await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelectorAll('#board text').length >= 2);
    await page.locator('#pause').click();
    const speechPaused = await page.locator('#board > *').count(); await delay(180);
    assert.equal(await page.locator('#board > *').count(), speechPaused);
    await page.locator('#pause').click();
    await page.waitForFunction(() => document.querySelector('#status').textContent.startsWith('Finished reading'));
    assert.match(await page.locator('#timing').textContent(), /First speech: \d+ ms/);

    await page.evaluate(() => { window.tutorSpeechMode = 'phrase'; });
    await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelectorAll('#board text').length === 1);
    await delay(100); assert.equal(await page.locator('#board text').count(), 1);
    await page.waitForFunction(() => document.querySelector('#status').textContent.startsWith('Finished reading'));
    assert.equal(await page.locator('#board text').count(), 4);
    await page.evaluate(() => { window.tutorSpeechMode = 'error'; });
    await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelector('#status').textContent.startsWith('Browser speech failed'));
    assert(!(await page.locator('#start').isDisabled()));
    await page.evaluate(() => { window.tutorSpeechMode = 'word'; });

    await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelectorAll('#board text').length > 0);
    await page.locator('#stop').click();
    const stoppedCount = await page.locator('#board > *').count(); await delay(300);
    assert.equal(await page.locator('#board > *').count(), stoppedCount);
    await page.locator('#clear').click(); await delay(180);
    assert.equal(await page.locator('#board > *').count(), 0);
    assert.equal(await page.locator('#sources > *').count(), 0);
    assert(await page.locator('#start').isDisabled());
    assert.equal(await page.evaluate(() => localStorage.length), 0);

    await page.locator('#upload').setInputFiles({ name: 'bad.pdf', mimeType: 'application/pdf', buffer: Buffer.from('%PDF synthetic') });
    await page.waitForFunction(() => document.querySelector('#material').textContent.includes('PDF uploads are not supported'));
    assert(await page.locator('#start').isDisabled());

    await page.locator('#upload').setInputFiles({ name: 'markup.txt', mimeType: 'text/plain', buffer: Buffer.from('<img src=x onerror=alert(1)>') });
    await page.waitForFunction(() => document.querySelector('#material').textContent.startsWith('markup.txt:'));
    await page.locator('#voice').uncheck(); await page.locator('#question').fill('img'); await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelector('#status').textContent.startsWith('Finished reading'));
    assert.equal(await page.locator('#sources img').count(), 0);
    assert.match(await page.locator('#sources').textContent(), /<img/);

    await page.locator('#sample').click(); await page.locator('#question').fill('balanced'); await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelector('#status').textContent.startsWith('Finished reading'));

    // Interrupt one grounded topic, ask another, then restore its exact board checkpoint.
    await page.locator('#voice').check();
    await page.locator('#question').fill('balanced'); await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelectorAll('#board text').length >= 3);
    await page.locator('#stop').click();
    const checkpointMarks = await page.locator('#board text').allTextContents();
    await page.locator('#question').fill('diagram'); await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelector('#status').textContent.startsWith('Finished reading'));
    assert(await page.locator('#resume-lesson').isEnabled());
    await page.locator('#resume-lesson').click();
    assert.deepEqual((await page.locator('#board text').allTextContents()).slice(0, checkpointMarks.length), checkpointMarks);
    await page.waitForFunction(() => document.querySelector('#status').textContent.startsWith('Finished reading'));
    assert.match(await page.locator('#sources').textContent(), /Balanced forces/);
    const completedWords = await page.locator('#board text').allTextContents();
    const expectedWords = await page.locator('#sources li').evaluateAll(items => items.flatMap(item => item.textContent.split(']: ')[1].split(/\s+/)));
    assert.deepEqual(completedWords, expectedWords, 'Resume draws each source word exactly once');
    assert(!(await page.locator('#resume-lesson').isEnabled()));

    await page.setViewportSize({ width: 390, height: 844 });
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'Mobile page overflows');
    assert(await page.locator('#board').evaluate(svg => svg.getScreenCTM().a >= 0.99), 'Mobile board text shrinks below its intended size');
    // One shared lesson: typing does not interrupt; submitted text and voice do.
    await page.locator('#voice').check();
    await page.locator('#question').fill('balanced'); await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelectorAll('#board text').length > 1);
    await page.locator('#question').fill('continue');
    assert(!(await page.locator('#stop').isDisabled()));
    await page.locator('#start').click();
    assert.match(await page.locator('#conversation').textContent(), /Student \(text\): continue/);
    assert.equal(await page.evaluate(() => window.micInstances.length), 0, 'No unauthorized mic start');
    await page.locator('#mic').click();
    await page.waitForFunction(() => document.querySelector('#mic-status').textContent === 'Microphone listening');
    await page.evaluate(() => window.micInstances.at(-1).result('balanced', false));
    assert(await page.locator('#stop').isDisabled(), 'Interim speech interrupts playback');
    await page.locator('#question').fill('my unsent draft');
    await page.evaluate(() => window.micInstances.at(-1).result('unbalanced forces'));
    assert.equal(await page.locator('#question').inputValue(), 'my unsent draft', 'Voice preserves typed draft');
    await page.waitForFunction(() => document.querySelector('#conversation').textContent.includes('Student (voice): unbalanced forces'));
    await page.locator('#mic').click();
    const turns = await page.locator('#conversation li').count();
    await page.evaluate(() => window.micInstances.at(-1).result('late speech'));
    assert.equal(await page.locator('#conversation li').count(), turns);
    assert.equal(await page.evaluate(() => localStorage.getItem('yoon.tutor.mic-muted')), 'true');
    await page.reload();
    assert.equal(await page.evaluate(() => window.micInstances.length), 0, 'Saved mute honored');
    await page.locator('#mic').click();
    await page.evaluate(() => { window.micPermission.state = 'denied'; window.micPermission.onchange(); });
    assert.match(await page.locator('#mic-status').textContent(), /permission withdrawn/);
    await page.locator('#mic').click();
    await page.evaluate(() => window.micInstances.at(-1).onerror({ error: 'not-allowed' }));
    assert.match(await page.locator('#mic-status').textContent(), /not-allowed/);
    await page.locator('#mic').click();
    await page.evaluate(() => { const mic = window.micInstances.at(-1); mic.onerror({error: 'no-speech'}); mic.onend(); });
    await page.waitForFunction(() => document.querySelector('#mic-status').textContent === 'Microphone listening');
    await page.locator('#mic').click();
    await page.locator('#mic').click();
    await page.locator('#end-session').click();
    assert.equal(await page.locator('#conversation li').count(), 0);
    assert(await page.evaluate(() => window.micInstances.at(-1).aborted));
    const dock = await page.locator('.dock').boundingBox();
    assert(Math.abs(dock.y + dock.height - 844) < 2, 'Composer fixed to viewport bottom');
    await page.setViewportSize({width: 390, height: 320});
    const inputBox = await page.locator('#question').boundingBox();
    assert(inputBox.y >= 0 && inputBox.y + inputBox.height <= 320, 'Composer visible on short viewport');
    await page.setViewportSize({width: 390, height: 844});
    await page.evaluate(() => { localStorage.setItem('yoon.tutor.mic-muted', 'false'); });
    await page.addInitScript(() => { window.micPermission.state = 'granted'; });
    await page.reload();
    await page.waitForFunction(() => document.querySelector('#mic-status').textContent === 'Microphone listening');
    await page.locator('#end-session').click();
    await page.addInitScript(() => { window.SpeechRecognition = undefined; window.webkitSpeechRecognition = undefined; });
    await page.reload();
    assert.match(await page.locator('#mic-status').textContent(), /unavailable/);
    await page.locator('#sample').click();
    await page.locator('#voice').uncheck();
    await page.locator('#question').fill('force'); await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelectorAll('#board text').length > 0);
    await page.locator('#stop').click();
    if (process.env.TUTOR_SCREENSHOT) await page.screenshot({ path: process.env.TUTOR_SCREENSHOT, fullPage: true });
    // Teaching uses authored material and trusted models, with the original reader still available.
    await page.locator('#friction').click();
    await page.waitForFunction(() => document.querySelector('#teaching-title').textContent === 'Follow the energy');
    assert(await page.locator('[data-physics-visual="E5"]').isVisible());
    assert(await page.locator('#ai-selection').isDisabled(), 'Static preview must not advertise live AI');
    await page.locator('[data-move="angle"]').click();
    await page.waitForFunction(() => document.querySelector('#teaching-title').textContent === 'Less friction does not decide the speed');
    await page.waitForFunction(() => document.querySelectorAll('#board text').length > 0);
    await page.locator('#stop').click();
    await page.locator('#question').fill('photosynthesis'); await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelector('#teaching-title').textContent === 'Stay within this lesson');
    assert.equal(await page.locator('#teaching-visual > *').count(), 0);
    await page.locator('#resume-lesson').click();
    await page.waitForFunction(() => document.querySelector('#teaching-title').textContent === 'Less friction does not decide the speed');
    assert(await page.locator('[data-physics-visual="E6"]').isVisible(), 'Resume restores the interrupted topic model');
    assert(await page.evaluate(() => document.documentElement.scrollWidth <= innerWidth), 'No page-width overflow on mobile');
    await page.locator('#clear').click();
    assert(!(await page.locator('#teaching-panel').isVisible()));
    assert.equal(await page.locator('#teaching-visual > *').count(), 0);
    // No provider call: synthetic route verifies remote choice hydration and rejects extra output.
    await page.route('**/api/tutor/status', route => route.fulfill({ json: { available: true } }));
    await page.reload(); await page.locator('#voice').uncheck();
    await page.locator('#friction').click();
    await page.waitForFunction(() => !document.querySelector('#ai-selection').disabled);
    await page.locator('#ai-selection').check();
    await page.route('**/api/tutor/choose', route => {
      const body = route.request().postDataJSON();
      assert.deepEqual(Object.keys(body).sort(), ['current', 'question', 'version']);
      return route.fulfill({ json: { move: 'normal' } });
    });
    await page.locator('#question').fill('Please clarify the support force'); await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelector('#teaching-title').textContent === 'Why the normal force matters');
    await page.route('**/api/tutor/choose', route => route.fulfill({ json: { move: 'normal', text: 'Untrusted generated prose' } }));
    await page.locator('#start').click();
    await page.waitForFunction(() => document.querySelector('#status').textContent === 'Invalid teaching choice.');
    assert(!(await page.locator('#conversation').textContent()).includes('Untrusted generated prose'));
    await page.locator('#end-session').click();
    assert.deepEqual(errors, []);
    console.log('Tutor browser: upload/refusal, silent progression, word/phrase speech callbacks, speech errors, pause/resume, stop/stale callbacks, clear, literal markup, in-memory conversation, microphone permissions/mute/revocation/stale results and fixed mobile composer passed. Speech is simulated.');
  } finally {
    await browser?.close(); server.kill();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
