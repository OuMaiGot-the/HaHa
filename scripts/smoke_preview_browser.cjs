#!/usr/bin/env node
// Browser-level regression smoke test for the generated learner bundle.
const { chromium } = require('playwright');
const fs = require('node:fs');
const assert = require('node:assert/strict');

(async () => {
  const base = process.env.PREVIEW_URL || 'http://127.0.0.1:8765/learn/chapter-9/section-9-1/';
  const pkg = JSON.parse(fs.readFileSync('preview/learn/chapter-9/section-9-1/content/package.json', 'utf8'));
  assert(pkg.activities.length > 0, 'Preview has no activities');
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.locator('.question').waitFor();
      assert.equal(await page.locator('.question').innerText(), pkg.activities[0].prompt.en);
      await page.locator('#hint').click();
      assert(await page.locator('.feedback').count() > 0, 'Hint did not appear');
      for (const locale of ['ms', 'zh', 'en']) {
        await page.locator('#locale').selectOption(locale);
        assert.equal(await page.locator('#locale').inputValue(), locale);
        assert(await page.locator('.question').innerText(), 'Question missing after language change');
      }
      // Skip through every activity, covering MCQ and each interactive renderer.
      for (let i = 0; i < pkg.activities.length; i++) {
        assert.equal(await page.locator('.question').count(), 1, 'Question not rendered at activity ' + i);
        await page.locator('#skip').click();
      }
      await page.locator('#restart').waitFor();
      await page.locator('#restart').click();
      await page.locator('.question').waitFor();
      assert.equal(await page.locator('.question').innerText(), pkg.activities[0].prompt.en);
      assert.deepEqual(errors, [], 'Browser JavaScript exceptions');
      await page.close();
    }
    // Verify answer evaluation, retry, and correct-answer progression on a real MCQ.
    const firstMcqIndex = pkg.activities.findIndex(activity => activity.type !== 'interactive');
    if (firstMcqIndex >= 0) {
      const activity = pkg.activities[firstMcqIndex];
      const correctId = activity.answerKey.correct;
      const wrong = activity.answerKey.options.find(option => option.id !== correctId);
      for (const theme of ['light', 'dark']) {
      const page = await browser.newPage();
      await page.addInitScript(theme => localStorage.setItem('haha:study:v1', JSON.stringify({ theme })), theme);
      await page.goto(base + '/?activity=' + encodeURIComponent(activity.id));
      await page.locator('.question').waitFor();
      if (wrong) {
        await page.locator('.choice[data-value="' + wrong.id + '"]').click();
        await page.locator('#check').click();
        assert.match(await page.locator('[role="status"]').innerText(), /Reconsider/);
        assert.equal(await page.locator('.feedback--incorrect').count(), 1);
        for (const selector of ['.feedback--incorrect', '.choice[aria-pressed="true"]', '#check']) {
          const rgb = await page.locator(selector).evaluate(el => getComputedStyle(el).borderLeftColor.match(/\d+/g).map(Number));
          assert(rgb[0] > rgb[1], theme + ': wrong answer must be red');
        }
        await page.locator('#check').click();
        assert.equal(await page.locator('[role="status"]').count(), 0, 'Retry did not reset feedback');
      }
      await page.locator('.choice[data-value="' + correctId + '"]').click();
      await page.locator('#check').click();
      assert.match(await page.locator('[role="status"]').innerText(), /That reasoning fits/);
      assert.equal(await page.locator('.feedback--incorrect').count(), 0);
      const green = await page.locator('.feedback--correct').evaluate(el => getComputedStyle(el).borderLeftColor.match(/\d+/g).map(Number));
      assert(green[1] > green[0], theme + ': correct answer remains green');
      await page.locator('#check').click();
      if (firstMcqIndex < pkg.activities.length - 1) {
        assert.equal(await page.locator('.question').innerText(), pkg.activities[firstMcqIndex + 1].prompt.en);
      } else {
        await page.locator('#restart').waitFor();
      }
      await page.close();
      }
    }
    // Deep links should open the requested activity rather than activity one.
    if (pkg.activities.length > 1) {
      const page = await browser.newPage();
      await page.goto(base + '/?activity=' + encodeURIComponent(pkg.activities[1].id));
      await page.locator('.question').waitFor();
      assert.equal(await page.locator('.question').innerText(), pkg.activities[1].prompt.en);
      await page.close();
    }
    console.log('Browser smoke checks passed: desktop, mobile, locales, hints, all activities, restart, deep link.');
  } finally {
    await browser.close();
  }
})().catch(error => { console.error(error); process.exitCode = 1; });
