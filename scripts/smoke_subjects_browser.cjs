const {chromium}=require('playwright');
const assert=require('node:assert/strict');
const fs=require('node:fs');
(async()=>{
 const base=process.env.SITE_URL||'http://127.0.0.1:8765/';
 const browser=await chromium.launch();
 const lesson=JSON.parse(fs.readFileSync('preview/catalog.json','utf8'))[0];
 try{
  for(const width of[1280,390]){
   const page=await browser.newPage({viewport:{width,height:900}}),errors=[];page.on('pageerror',e=>errors.push(e.message));
   await page.goto(base);await page.locator('.subject-grid').waitFor();assert.equal(await page.locator('.subject-card').count(),2);
   for(const locale of['ms','zh','en']){await page.locator('#locale').selectOption(locale);assert(await page.locator('#physics-entrance').isVisible());assert(await page.locator('#maths-entrance').isVisible());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));}
   const physicsSentinel=JSON.stringify({completed:[lesson.activityMetadata[0].id],independent:[lesson.activityMetadata[0].id]});
   await page.evaluate(({id,value})=>localStorage.setItem('haha:progress:v1:'+id,value),{id:lesson.id,value:physicsSentinel});
   await page.locator('#physics-entrance').click();await page.locator('.home-actions').waitFor();await page.getByRole('link',{name:'Subjects',exact:true}).click();await page.locator('#maths-entrance').click();await page.locator('.math-home-grid').waitFor();
   assert.equal(await page.getByRole('button',{name:'Friends',exact:true}).count(),0);
   await page.getByRole('button',{name:'Open maths learning →',exact:true}).click();await page.locator('[data-action="form"][data-form="4"]').click();await page.locator('[data-action="startLearning"]').first().click();await page.locator('#startLearningButton').click();
   await page.locator('#labX').waitFor();assert.equal(await page.locator('.note-section').count(),3);
   await page.locator('#labX').fill('3');assert.equal(await page.locator('#labOutput').innerText(),'7');
   const first=page.locator('.checkpoint-card').first();await first.locator('[data-correct="false"]').first().click();assert(await first.locator('.answer-incorrect').count());assert.match(await first.locator('[role="status"]').innerText(),/Not quite/);
   await page.locator('#mathTheme').selectOption('dark');await page.locator('#mathReadingSize').selectOption('large');assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   await page.locator('[data-action="evaluation"]').click();await page.locator('.evaluation-question').first().waitFor();
   for(const[q,a]of[[0,1],[1,0],[2,0]])await page.locator('[data-eval-question="'+q+'"][data-eval-choice="'+a+'"]').click();
   await page.getByRole('button',{name:'Submit and see results →',exact:true}).click();await page.locator('.evaluation-results').waitFor();assert.match(await page.locator('.evaluation-score-count').innerText(),/0\s*\/\s*3/);assert.equal(await page.locator('.wrong-answer').count(),3);
   assert.equal(await page.evaluate(()=>JSON.parse(localStorage.getItem('haha:math:v1:amFunctionsEvalComplete'))),true);
   await page.reload();await page.locator('.math-home-grid').waitFor();assert.equal(await page.locator('body').getAttribute('data-theme'),'dark');
   await page.getByRole('button',{name:'Start maths practice →',exact:true}).click();await page.locator('[data-action="practiceSubject"][data-form="4"]').click();

   const start=page.locator('[data-action="practiceRandom"]');if(await start.count())await start.first().click();else await page.locator('[data-action="practiceChapter"]').first().click();
   await page.locator('[data-practice-answer]').first().waitFor();assert.equal(await page.locator('.practice-question-card').count()||await page.locator('.practice-question').count(),5);
   await page.locator('[data-practice-answer]').first().fill('not-a-valid-answer');
   await page.locator('[data-action="submitPracticeAnswers"]').click();await page.locator('.practice-result-item').first().waitFor();assert.equal(await page.locator('.practice-result-item').count(),5);assert(await page.locator('.wrong-answer').count());
   assert.equal(await page.evaluate(id=>localStorage.getItem('haha:progress:v1:'+id),lesson.id),physicsSentinel);
   const before=await page.evaluate(()=>localStorage.getItem('haha:math:v1:addmathLabV2Attempts'));assert(before);
   await page.locator('.subject-return').click();await page.locator('#physics-entrance').waitFor();
   await page.goto(base+'#learn');await page.getByRole('button',{name:'Clear device progress',exact:true}).click();assert.equal(await page.evaluate(()=>localStorage.getItem('haha:math:v1:addmathLabV2Attempts')),before);
   assert.equal(await page.evaluate(()=>Object.keys(localStorage).filter(k=>k.startsWith('am')||k.startsWith('addmathLab')).length),0);
   await page.goto(base+'mathematics/index.html');await page.locator('.math-home-grid').waitFor();await page.getByRole('button',{name:'View maths progress →',exact:true}).click();assert(await page.locator('#app').innerText());assert(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth));
   assert.deepEqual(errors,[]);await page.close();
  }
  const blocked=await browser.newPage();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked')}}));await blocked.goto(base+'mathematics/index.html');await blocked.locator('.math-home-grid').waitFor();await blocked.getByRole('button',{name:'Open maths learning →',exact:true}).click();await blocked.getByRole('heading',{name:'Choose your form',exact:true}).waitFor();await blocked.close();
  console.log('Subjects browser passed: chooser, both subjects, all math notes, function lab, error feedback, evaluation, practice, reload, namespace isolation, themes, mobile and blocked storage.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
