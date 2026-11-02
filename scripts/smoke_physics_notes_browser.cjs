const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{const browser=await chromium.launch(),base=process.env.SITE_URL||'http://127.0.0.1:8765/';
try{for(const width of [390,1280]){const context=await browser.newContext({viewport:{width,height:900},reducedMotion:'reduce'}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));await page.goto(base);const catalog=await(await page.request.get(base+'catalog.json')).json();
for(const locale of ['en','ms','zh']){
 await page.locator('#locale').selectOption(locale);
 for(const lesson of catalog){await page.goto(base+'#lesson/'+lesson.id);const notes=page.locator('[data-physics-notes="'+lesson.id+'"]');await notes.waitFor();assert.equal(await notes.getAttribute('lang'),locale);assert.equal(await notes.locator('.teaching-section').count(),11);assert.equal(await notes.locator('[data-note-answer]').count(),11);
  const before=await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k!=='haha:study:preferences:v1')));
  for(const figure of await notes.locator('[data-physics-visual]').all()){
   await figure.locator('button.reveal').click();await figure.locator('dl').waitFor();const slider=figure.locator('input[type=range]');if(await slider.count()){await slider.fill('100');await slider.focus();await page.keyboard.press('ArrowLeft');}
   const select=figure.locator('select');if(await select.count())await select.selectOption('1');assert(await figure.locator('dd').count()>0);
   const reset=figure.locator('button').last();await reset.click();assert.equal(await figure.locator('dl').isVisible(),false);
  }
  const check=notes.locator('[data-note-answer]').first();await check.locator('summary').focus();await page.keyboard.press('Enter');assert.equal(await check.getAttribute('open'),'');
  assert.deepEqual(await page.evaluate(()=>Object.fromEntries(Object.entries(localStorage).filter(([k])=>k!=='haha:study:preferences:v1'))),before,'Reading/checking notes cannot alter learning evidence or Mana');
  await notes.locator('.notes-toc a').first().click();assert.equal(await page.locator('#physics-part-0').evaluate(el=>el===document.activeElement),true);
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true,lesson.id+' overflow '+locale);
 }
}
await page.reload();await page.locator('[data-physics-notes]').waitFor();await page.goBack();assert.deepEqual(errors,[]);await context.close();}
console.log('Physics notes browser passed: all 15 lessons × 3 languages × phone/desktop, visuals, keyboard checks, reset, deep links, no storage mutation, no overflow.');}
finally{await browser.close();}})().catch(e=>{console.error(e);process.exitCode=1;});
