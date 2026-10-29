#!/usr/bin/env node
// Verify the complete published lesson catalog on desktop and mobile.
const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const catalog = JSON.parse(fs.readFileSync('preview/catalog.json', 'utf8'));
  assert(catalog.length >= 15, 'Expected at least 15 published lessons');
  const base = process.env.SITE_URL || 'http://127.0.0.1:8765/';
  const browser = await chromium.launch({ headless: true });
  try {
    for (const viewport of [{ width: 1280, height: 800 }, { width: 390, height: 844 }]) {
      const page = await browser.newPage({ viewport });
      const errors = [];
      const badResponses = [];
      page.on('pageerror', e => errors.push(e.message));
      page.on('response', r => { if (r.status() >= 400) badResponses.push(r.url() + ': ' + r.status()); });
      await page.goto(base + "#learn", { waitUntil: 'networkidle' });
      await page.locator('#chapters .grid a').first().waitFor();
      assert.equal(await page.locator('#chapters .grid a').count(), catalog.length, 'Catalog link count');
      await page.evaluate(() => localStorage.clear());
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('.recommendation').count(), 1, 'Recommendation panel exists');
      assert.equal(await page.locator('.recommendation h2').innerText(), 'Start learning', 'Fresh learners receive a starting suggestion');
      const firstLesson = catalog[0];
      await page.evaluate((lesson) => {
        localStorage.setItem('haha:progress:v1:' + lesson.id, JSON.stringify({
          completed: [lesson.activityMetadata[0].id],
          independent: [],
          updatedAt: new Date().toISOString()
        }));
      }, firstLesson);
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('.recommendation h2').innerText(), 'Review with confidence', 'Assisted completion triggers review');
      assert.match(await page.locator('.recommendation a').getAttribute('href'), /learn\//, 'Recommendation targets a lesson');
      await page.evaluate((lesson) => {
        localStorage.setItem('haha:progress:v1:' + lesson.id, JSON.stringify({
          completed: [lesson.activityMetadata[0].id],
          independent: [lesson.activityMetadata[0].id]
        }));
      }, firstLesson);
      await page.reload({ waitUntil: 'networkidle' });
      assert.equal(await page.locator('.recommendation h2').innerText(), 'Continue learning', 'Partial independent progress triggers continuation');
      await page.evaluate((lesson) => localStorage.removeItem('haha:progress:v1:' + lesson.id), firstLesson);
      await page.reload({ waitUntil: 'networkidle' });

      for (const lesson of catalog) {
        const url = new URL(lesson.url, base).href;
        const response = await page.goto(url, { waitUntil: 'networkidle' });
        assert.equal(response.status(), 200, lesson.id + ' failed to load');
        await page.locator('.question').waitFor();
        const pkg = JSON.parse(fs.readFileSync('preview/' + lesson.url.replace(/index\.html$/, 'content/package.json'), 'utf8'));
        assert.equal((await page.locator('.question').innerText()).replace(/\s+/g, ' ').trim(), pkg.activities[0].prompt.en.replace(/\s+/g, ' ').trim(), lesson.id);
        await page.locator('#locale').selectOption('ms');
        assert(await page.locator('.question').innerText(), lesson.id + ' missing Malay question');
        await page.locator('#locale').selectOption('zh');
        assert(await page.locator('.question').innerText(), lesson.id + ' missing Chinese question');
        await page.locator('#locale').selectOption('en');
        assert(await page.locator('.question').innerText(), lesson.id + ' missing English question');
        assert(await page.locator('#skip').isVisible(), lesson.id + ' missing skip');
      }
      assert.deepEqual(errors, [], 'JavaScript exceptions');
      assert.deepEqual(badResponses, [], 'HTTP errors');
      await page.close();
    }
    console.log('Catalog smoke passed: ' + catalog.length + ' lessons, desktop and mobile, three languages.');
  } finally { await browser.close(); }
})().catch(e => { console.error(e); process.exitCode = 1; });
