const {chromium}=require('playwright'),assert=require('node:assert/strict'),fs=require('node:fs');
(async()=>{
 const base=process.env.SITE_URL||'http://127.0.0.1:8765/';
 const lesson=JSON.parse(fs.readFileSync('preview/catalog.json','utf8'))[0];
 const pkg=JSON.parse(fs.readFileSync('preview/'+lesson.url.replace('index.html','content/package.json'),'utf8'));
 const browser=await chromium.launch();
 const value=p=>p.evaluate(()=>window.HahaMana.ready.then(()=>HahaManaModel.balance(HahaMana.get())));
 const waitValue=(p,n)=>p.waitForFunction(n=>window.HahaMana&&HahaManaModel.balance(HahaMana.get())===n,n);
 try{
  for(const width of [390,1280]){
   const context=await browser.newContext({viewport:{width,height:900}}),errors=[];
   context.on('page',p=>p.on('pageerror',e=>errors.push(e.message)));
   const page=await context.newPage();
   await page.addInitScript(()=>{if(!localStorage.getItem('mana-test-seeded')){localStorage.setItem('haha:math:v1:amMana','130');localStorage.setItem('mana-test-seeded','yes');}});
   await page.goto(base+'#subjects');await page.locator('.mana-trigger').waitFor();assert.equal(await value(page),130);
   await page.locator('.mana-trigger').click();await page.locator('.mana-dialog').waitFor();
   await page.locator('[data-preview="forest"] button').click();assert.equal(await value(page),130,'confirmation precedes spending');
   await page.locator('[data-mana-confirm]').click();await page.waitForFunction(()=>document.body.dataset.manaCosmetic==='forest');assert.equal(await value(page),100);
   await page.getByRole('button',{name:'Close wallet',exact:true}).click();await page.reload();assert.equal(await value(page),100,'migration does not repeat');
   const other=await context.newPage();await other.goto(base+'#subjects');await other.locator('.mana-trigger').waitFor();await other.evaluate(()=>HahaMana.ready);
   const results=await Promise.all([page.evaluate(()=>HahaMana.purchase('ocean')),other.evaluate(()=>HahaMana.purchase('gold'))]);
   assert.equal(results.filter(r=>r.error==='funds').length,1,'concurrent tabs cannot overspend');assert((await value(page))>=0);
   assert.equal(await value(page),await value(other));await other.close();
   const before=await value(page);
   const a=pkg.activities[0],wrong=a.answerKey.options.find(x=>x.id!==a.answerKey.correct);
   await page.goto(base+lesson.url+'?activity='+encodeURIComponent(a.id));await page.locator('.choice').first().waitFor();
   await page.locator('.choice[data-value="'+wrong.id+'"]').click();await page.locator('#check').click();assert.equal(await value(page),before);
   await page.locator('#check').click();await page.locator('.choice[data-value="'+a.answerKey.correct+'"]').click();await page.locator('#check').click();
   await waitValue(page,before+3);assert.equal(await value(page),before+3,'correcting a mistake earns three');
   await page.reload();await page.locator('.choice').first().waitFor();await page.locator('.choice[data-value="'+a.answerKey.correct+'"]').click();await page.locator('#check').click();assert.equal(await value(page),before+3,'repeat check pays nothing');
   const two=pkg.activities.filter(x=>x.answerKey?.options).slice(0,2);await page.goto(base+lesson.url+'?practice='+encodeURIComponent(two.map(x=>x.id).join(',')));
   for(const q of two){await page.locator('.choice[data-value="'+q.answerKey.correct+'"]').click();await page.locator('#check').click();await page.locator('#check').click();}
   await page.locator('.session-review').waitFor();await waitValue(page,before+13);assert.equal(await value(page),before+13,'one new answer plus the once-daily set bonus');
   const afterPhysics=await value(page);
   await page.goto(base+'mathematics/index.html');await page.locator('#next-lesson button').click();await page.locator('.checkpoint-card [data-correct="true"]').first().click();
   await waitValue(page,afterPhysics+5);assert.equal(await value(page),afterPhysics+5);assert.equal(await page.evaluate(()=>localStorage.getItem('haha:math:v1:amMana')),'130','legacy balance remains untouched');
   await page.getByRole('button',{name:'Practice',exact:true}).click();
   
   await page.locator('[data-action="practiceRandom"]').first().click();
   for(let i=0;i<5;i++){const jump=page.locator('[data-practice-jump="'+i+'"]');if(await jump.count())await jump.click();const inputs=page.locator('[data-practice-answer^="'+i+',"]');for(const input of await inputs.all())await input.fill('999999');}
   const beforeSet=await value(page);await page.locator('[data-action="submitPracticeAnswers"]').click();await page.locator('.practice-result-item').first().waitFor();await waitValue(page,beforeSet+5);assert.equal(await value(page),beforeSet+5,'attempting all questions earns the daily bonus, even with mistakes');
   await page.locator('.mana-trigger').click();assert(await page.locator('.mana-history').innerText());assert.equal(await page.evaluate(()=>document.documentElement.scrollWidth<=innerWidth),true);
   await page.getByRole('button',{name:'Close wallet',exact:true}).click();
   assert.deepEqual(errors,[]);await context.close();
  }
  const blocked=await browser.newPage();await blocked.addInitScript(()=>Object.defineProperty(window,'localStorage',{get(){throw Error('blocked')}}));await blocked.goto(base);await blocked.locator('.mana-trigger').click();assert.match(await blocked.locator('.mana-message').innerText(),/could not be saved/);await blocked.close();
  const corrupt=await browser.newPage();await corrupt.addInitScript(()=>localStorage.setItem('haha:mana:v1','broken'));await corrupt.goto(base);await corrupt.locator('.mana-trigger').click();assert.match(await corrupt.locator('.mana-message').innerText(),/could not be read/);assert.equal(await corrupt.evaluate(()=>localStorage.getItem('haha:mana:v1')),'broken');await corrupt.close();
  console.log('Mana browser passed: migration, purchase confirmation, cosmetics, concurrent tabs, wrong/correct/repeat rewards, both subjects, set bonuses, history, phone/desktop and blocked/corrupt storage.');
 }finally{await browser.close();}
})().catch(e=>{console.error(e);process.exitCode=1;});
