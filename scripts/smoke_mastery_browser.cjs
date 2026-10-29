const { chromium } = require('playwright');
const assert = require('node:assert/strict');
const fs = require('node:fs');
(async () => {
  const browser = await chromium.launch();
  const base = process.env.SITE_URL || 'http://127.0.0.1:8765/';
  const catalog = JSON.parse(fs.readFileSync('preview/catalog.json','utf8'));
  const lesson = catalog[0];
  const pkg = JSON.parse(fs.readFileSync('preview/'+lesson.url.replace('index.html','content/package.json'),'utf8'));
  const activity = pkg.activities.find(a=>a.type === 'mcq');
  const lessonUrl = new URL(lesson.url,base).href+'?activity='+encodeURIComponent(activity.id);
  try {
    for (const width of [1280,390]) {
      const page = await browser.newPage({viewport:{width,height:844}});
      const errors=[]; page.on('pageerror',e=>errors.push(e.message));
      await page.goto(lessonUrl);
      await page.locator('.choice').first().waitFor();
      const wrong = activity.answerKey.options.find(o=>o.id!==activity.answerKey.correct);
      await page.locator('.choice[data-value="'+wrong.id+'"]').click();
      await page.locator('#check').click();
      let saved=await page.evaluate(id=>JSON.parse(localStorage.getItem('haha:progress:v1:'+id)),lesson.id);
      assert.equal(saved.attempts[0].result,'incorrect','capture at check before next');
      await page.locator('#check').click();
      await page.locator('.choice[data-value="'+activity.answerKey.correct+'"]').click();
      await page.locator('#check').click();
      saved=await page.evaluate(id=>JSON.parse(localStorage.getItem('haha:progress:v1:'+id)),lesson.id);
      assert.equal(saved.attempts[1].assisted,true,'retry remains assisted');
      assert.equal(saved.independent.length,0);
      await page.reload(); await page.locator('.choice').first().waitFor();
      await page.locator('.choice[data-value="'+activity.answerKey.correct+'"]').click();
      await page.locator('#check').click();
      saved=await page.evaluate(id=>JSON.parse(localStorage.getItem('haha:progress:v1:'+id)),lesson.id);
      assert.equal(saved.attempts[0].result,'incorrect'); assert.equal(saved.independent.length,1);
      await page.goto(base + "#learn"); await page.locator('.mastery-dashboard').waitFor();
      for (const locale of ['en','ms','zh']) {
        await page.locator('#locale').selectOption(locale);
        assert.equal(await page.locator('html').getAttribute('lang'),locale);
        assert(await page.locator('article h3').first().innerText());
        assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,'no mobile overflow');
      }
      await page.locator('#locale').selectOption('en');
      await page.locator('article summary').first().focus();
      await page.keyboard.press('Enter');
      assert.equal(await page.locator('article details').first().getAttribute('open'),'');
      const downloadPromise=page.waitForEvent('download');
      await page.getByRole('button',{name:'Export device progress'}).click();
      assert.equal((await downloadPromise).suggestedFilename(),'haha-device-progress.json');
      await page.getByRole('button',{name:'Clear device progress'}).click();
      assert.equal(await page.locator('.recommendation h2').innerText(),'Start learning');
      await page.evaluate(id=>localStorage.setItem('haha:progress:v1:'+id,'{bad'),lesson.id);
      await page.reload(); await page.locator('.recommendation').waitFor();
      assert.deepEqual(errors,[]);
      await page.close();
    }
    const blocked=await browser.newPage();
    await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw new Error('blocked');}}));
    await blocked.goto(lessonUrl); await blocked.locator('.choice').first().waitFor();
    await blocked.locator('.choice[data-value="'+activity.answerKey.correct+'"]').click();
    await blocked.locator('#check').click(); assert(await blocked.locator('[role="status"]').count());
    await blocked.goto(base); await blocked.locator('.mastery-dashboard').waitFor();
    await blocked.close();
    console.log('Mastery browser tests passed: desktop/mobile, first failure, assisted retry, independent revisit, reload, locales, export, reset, malformed/blocked storage.');
  } finally {await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
