const assert=require('node:assert/strict');require('../app/mathematics/core/mastery.js');const {create}=require('../app/mathematics/core/mastery-storage.js');
const activities=[{id:'one',topic:0},{id:'two',topic:1}];let seq=0;
const event=id=>({id:'e'+seq++,activityId:id,result:'correct',assisted:false,sessionId:'unused',timestamp:'2026-11-03T00:00:00Z',revealed:true});
(async()=>{
 const values=new Map(),storage={getItem:k=>values.has(k)?values.get(k):null,setItem:(k,v)=>values.set(k,v)};let lockQueue=Promise.resolve();const locks={request:(_name,fn)=>{const result=lockQueue.then(fn);lockQueue=result.catch(()=>{});return result;}};
 const a=create(storage,activities,{visit:'a',locks}),b=create(storage,activities,{visit:'b',locks});
 await Promise.all([a.recordMany([event('one')]),b.recordMany([event('two')])]);assert.equal(JSON.parse(values.get('amMasteryV1')).attempts.length,2,'serialized tabs preserve both attempts');a.refresh();assert.equal(a.get().attempts.length,2);
 const last=event('one');await a.recordMany([last]);await a.recordMany([last]);assert.equal(a.get().attempts.length,3,'submission ids are idempotent');assert.equal(a.get().attempts.at(-1).assisted,true);
 const c=create(storage,activities,{visit:'c'});c.expose(['two']);await c.recordMany([event('two')]);assert.equal(c.get().attempts.at(-1).assisted,true,'viewing worked solutions makes the next same-visit answer assisted');
 const corrupt=new Map([['amMasteryV1','{bad']]),warnings=[];const broken=create({getItem:k=>corrupt.get(k)??null,setItem:(k,v)=>corrupt.set(k,v)},activities,{visit:'broken',onWarning:m=>warnings.push(m)});await broken.recordMany([event('one')]);assert.equal(broken.get().attempts.length,1);assert.equal(corrupt.get('amMasteryV1'),'{bad');assert(warnings.length);
 const blocked=create({getItem(){throw Error('blocked');},setItem(){throw Error('blocked');}},activities,{visit:'blocked'});assert.equal(await blocked.recordMany([event('one')]),false);assert.equal(blocked.get().attempts.length,1);
 const quota=create({getItem:()=>null,setItem:()=>false},activities,{visit:'quota'});assert.equal(await quota.recordMany([event('one')]),false);assert.equal(quota.get().attempts.length,1);
 assert.equal(values.has('amFunctionsEvalComplete'),false);assert.equal(values.has('amMana'),false);assert.equal(values.size,1,'new evidence has its own key');
 console.log('Math mastery storage passed: concurrent tabs with locks, duplicate events, revealed solutions, corrupt/blocked/quota storage, memory fallback and legacy isolation.');
})().catch(e=>{console.error(e);process.exitCode=1;});
