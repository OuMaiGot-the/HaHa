const assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const M=require('../app/mana.js');
function session(storage,locks){
 const context={HahaManaModel:M,localStorage:storage,navigator:{locks},document:{readyState:'loading',documentElement:{lang:'en'},body:{dataset:{}},addEventListener(){}},MutationObserver:class{observe(){}},Event:class{},setTimeout:()=>0,clearTimeout(){}};
 context.window=context;context.addEventListener=()=>{};context.dispatchEvent=()=>{};
 vm.runInNewContext(fs.readFileSync('app/mana-ui.js','utf8'),context);
 return context.HahaMana;
}
(async()=>{
 const map=new Map([['haha:math:v1:amMana','50']]);let fail=false;
 const storage={getItem:k=>map.get(k)??null,setItem:(k,v)=>{if(fail)throw Error('quota');map.set(k,v);}};
 let tail=Promise.resolve();const locks={request:(_name,fn)=>{const r=tail.then(fn);tail=r.catch(()=>{});return r;}};
 const a=session(storage,locks),b=session(storage,locks);await Promise.all([a.ready,b.ready]);
 assert.equal(M.balance(a.get()),50);assert.equal(a.get().ledger.filter(t=>t.kind==='migration').length,1);
 assert.equal(map.get('haha:math:v1:amMana'),'50','legacy source preserved');
 await Promise.all([a.answer('physics','one',true),b.answer('maths','two',true)]);assert.equal(M.balance(a.get()),60,'no lost concurrent rewards');
 await Promise.all([a.answer('physics','same',true),b.answer('physics','same',true)]);assert.equal(M.balance(a.get()),65,'duplicate tab checks pay once');
 const purchases=await Promise.all([a.purchase('forest'),b.purchase('ocean')]);assert.equal(purchases.filter(r=>r.error==='funds').length,1);assert.equal(M.balance(a.get()),35,'concurrent purchases cannot overspend');
 await Promise.all([a.purchase('forest'),b.purchase('forest')]);assert.equal(M.balance(a.get()),35,'double-click cannot charge again');
 fail=true;const result=await a.answer('physics','unwritten',true);assert.equal(result.error,'storage');assert.equal(M.balance(a.get()),35,'no fake success after write failure');fail=false;
 map.set(M.KEY,'bad-json');const original=map.get(M.KEY);assert.equal((await a.answer('physics','broken',true)).error,'corrupt');assert.equal(map.get(M.KEY),original,'corrupt wallet is preserved, not reset');
 const unavailable=session({getItem(){throw Error('blocked')},setItem(){throw Error('blocked')}},locks);await unavailable.ready;assert.equal(unavailable.get(),null);
 const noLocks=session({getItem:()=>null,setItem(){}},null);await noLocks.ready;assert.equal((await noLocks.purchase('forest')).error,'locks');
 console.log('Mana storage passed: migration once, legacy preserved, concurrent rewards and purchases, duplicate clicks, write failure, corrupt/blocked storage and safe unsupported-browser purchasing.');
})().catch(e=>{console.error(e);process.exitCode=1;});
