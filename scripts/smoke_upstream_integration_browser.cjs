const {chromium}=require('playwright'),assert=require('node:assert/strict');
(async()=>{
 const base=process.env.SITE_URL||'http://127.0.0.1:8765/',browser=await chromium.launch();
 try{for(const width of [390,1280]){
  const context=await browser.newContext({viewport:{width,height:900}}),page=await context.newPage(),errors=[];page.on('pageerror',e=>errors.push(e.message));
  await page.addInitScript(()=>{if(!localStorage.getItem('integration-seeded')){localStorage.setItem('integration-seeded','yes');localStorage.setItem('haha:math:v1:amFunctionsEvalAnswers','[0,1,2]');localStorage.setItem('haha:math:v1:amFunctionsEvalComplete','true');}});
  await page.goto(base+'mathematics/index.html');await page.locator('#next-lesson button').waitFor();
  assert.equal(await page.evaluate(()=>state.chapterEvalComplete),true,'previous completion is retained');assert.equal(await page.evaluate(()=>state.chapterEvalAnswers.length),9);assert.deepEqual(await page.evaluate(()=>JSON.parse(localStorage.getItem('haha:math:v1:amLegacyEvaluationV1')).answers),[0,1,2]);
  await page.locator('#next-lesson button').click();
  await page.locator('[data-note-plot="absolute"]').waitFor();assert.equal(await page.locator('.note-content-block table').count(),1,'authored mapping table renders semantically');
  await page.locator('[data-note-plot="absolute"] input').fill('-3');assert.match(await page.locator('[data-note-plot="absolute"] output').innerText(),/3/);
  await page.getByRole('button',{name:'3. Inverse functions',exact:true}).click();await page.locator('[data-note-plot="inverse"]').waitFor();
  await page.locator('[data-action="evaluation"]').click();await page.locator('[data-eval-question="0"][data-eval-choice="0"]').click();await page.getByRole('button',{name:'Home',exact:true}).click();await page.goBack();await page.locator('.evaluation-question').first().waitFor();assert.equal(await page.evaluate(()=>state.chapterEvalAnswers[0]),0,'Back preserves evaluation draft');await page.reload();await page.locator('.evaluation-question').first().waitFor();assert.equal(await page.evaluate(()=>state.chapterEvalAnswers[0]),0,'refresh preserves evaluation draft');
  await page.getByRole('button',{name:'Practice',exact:true}).click();await page.locator('[data-action="practiceRandom"]').first().click();
  const current=await page.evaluate(()=>({id:state.practiceSet[4].id,parts:practiceParts(state.practiceSet[4]).map(p=>p.answers[0])}));
  await page.locator('[data-practice-jump="4"]').click();const field=page.locator('[data-practice-answer="4,0"]');await field.fill('2+(');
  const before=await page.evaluate(()=>({attempts:state.attempts.reduce((a,b)=>a+b,0),balance:HahaManaModel.balance(HahaMana.get())}));
  await page.locator('[data-action="submitPracticeAnswers"]').click();await page.locator('.input-error').first().waitFor();
  assert.equal(await page.evaluate(()=>state.attempts.reduce((a,b)=>a+b,0)),before.attempts,'unreadable input is not a wrong attempt');assert.equal(await page.evaluate(()=>HahaManaModel.balance(HahaMana.get())),before.balance);
  await field.fill(current.parts[0]);await page.locator('.practice-question-card:visible .save-question').click();assert.equal(await page.evaluate(()=>state.savedQuestions.length),1);
  const practiceURL=page.url();await page.reload();await page.locator('[data-practice-answer="4,0"]').waitFor();assert.equal(await page.locator('[data-practice-answer="4,0"]').inputValue(),current.parts[0]);assert.equal(page.url(),practiceURL,'refresh keeps the question identity and view');
  await page.locator('[data-action="submitPracticeAnswers"]').click();await page.locator('.practice-result-item').first().waitFor();
  await page.locator('[data-action="newPracticeSet"]').click();await page.locator('[data-practice-answer]').first().waitFor();await page.goBack();await page.waitForFunction(()=>state.page==='practiceChapters');
  await page.getByRole('button',{name:'Saved questions',exact:true}).click();await page.locator('.saved-question').waitFor();
  assert.equal(await page.evaluate(()=>state.savedQuestions[0].question.id),current.id,'regeneration preserves the saved snapshot');
  for(let j=0;j<current.parts.length;j++)await page.locator('[data-saved-input="0,'+j+'"]').fill(current.parts[j]);
  await page.getByRole('button',{name:'Check saved answer',exact:true}).click();await page.getByRole('button',{name:'Try again',exact:true}).waitFor();
  assert.equal(await page.locator('.saved-question .correct-answer').count(),current.parts.length);
  await page.evaluate(()=>HahaMana.answer('maths','test:integration-barrier',false,false));const earned=await page.evaluate(()=>HahaManaModel.balance(HahaMana.get()));
  await page.getByRole('button',{name:'Try again',exact:true}).click();for(let j=0;j<current.parts.length;j++)await page.locator('[data-saved-input="0,'+j+'"]').fill(current.parts[j]);await page.getByRole('button',{name:'Check saved answer',exact:true}).click();
  await page.evaluate(()=>HahaMana.answer('maths','test:integration-barrier',false,false));assert.equal(await page.evaluate(()=>HahaManaModel.balance(HahaMana.get())),earned,'same saved question does not farm first-correct Mana');
  await page.locator('#savedFormFilter').selectOption('5');assert.equal(await page.locator('.saved-question').count(),0);await page.locator('#savedFormFilter').selectOption('4');assert.equal(await page.locator('.saved-question').count(),1);
  const fresh=await context.newPage();await fresh.goto(base+'mathematics/index.html');await fresh.locator('.journey-layout').waitFor();assert(await fresh.locator('.resume-work').isVisible());await fresh.close();
  assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);assert.deepEqual(errors,[]);await context.close();
 }console.log('Upstream integration browser passed: tables/graphs, unreadable input, saved snapshots/retries, refresh, stale-set Back, fresh sessions and Mana protection on phone/desktop.');}
 finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
