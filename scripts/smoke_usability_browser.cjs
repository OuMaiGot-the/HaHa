const {chromium}=require('playwright');
const assert=require('node:assert/strict');
(async()=>{
 const base=process.env.SITE_URL||'http://127.0.0.1:8765/';
 const browser=await chromium.launch();
 try {
  for(const width of [390,1280]) {
   const page=await browser.newPage({viewport:{width,height:900}}),errors=[];
   page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base+'#subjects');await page.locator('#physics-entrance').click();
   const next=page.locator('#next-lesson');await next.waitFor();
   assert((await next.boundingBox()).y<700,'next lesson is near the top');
   assert(await next.locator('h2').innerText());await next.locator('a').click();
   const radios=page.getByRole('radio');await radios.first().waitFor();
   await radios.first().press('ArrowDown');assert.equal(await radios.nth(1).getAttribute('aria-checked'),'true');
   assert.equal(await radios.nth(1).getAttribute('tabindex'),'0');
   await page.getByRole('button',{name:'Check answer',exact:true}).click();
   await page.getByRole('link',{name:'Back to study space'}).click();
   await page.getByRole('link',{name:'Progress',exact:true}).click();
   await page.locator('.attempt-summary').waitFor();assert.match(await page.locator('.attempt-summary').innerText(),/: 1$/);
   assert.equal(await page.getByRole('button',{name:'Clear device progress',exact:true}).isVisible(),false);
   await page.getByRole('link',{name:'Subjects',exact:true}).click();
   await page.locator('#maths-entrance').click();await page.locator('#next-lesson button').click();
   assert.equal(await page.locator('.note-section').count(),1);
   await page.getByRole('button',{name:'Next topic →',exact:true}).click();
   assert.equal(await page.locator('#app h1').innerText(),'Composite functions');
   assert.equal(await page.locator('.note-section').count(),1);
   await page.getByRole('button',{name:'Next topic →',exact:true}).click();
   assert.equal(await page.locator('#app h1').innerText(),'Inverse functions');
   await page.getByRole('button',{name:'← Previous topic',exact:true}).click();
   assert.equal(await page.locator('#app h1').innerText(),'Composite functions');
   assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   assert.deepEqual(errors,[]);await page.close();
  }
  console.log('Usability browser passed: prominent lesson actions, keyboard radio selection, checked-attempt summary, separated data controls, one-topic Maths, next/previous, phone/desktop.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
