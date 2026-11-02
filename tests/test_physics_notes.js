const assert=require('node:assert/strict');
const fs=require('node:fs');
const {lessons,reviews}=require('../app/physics-notes/content.js');
const {model}=require('../app/physics-notes/models.js');
assert.equal(lessons.length,15);assert.equal(new Set(lessons.map(l=>l.id)).size,15);
let visualCount=0;
function localized(value){assert.deepEqual(Object.keys(value).sort(),['en','ms','zh']);for(const text of Object.values(value))assert.equal(typeof text==='string'&&text.trim().length>0,true);}
for(const lesson of lessons){
 assert(fs.existsSync('content/'+lesson.id.replace(/^chapter-(\d+)-section-\d+-(\d+)$/,'chapter-$1/section-$1-$2')+'/package.json'));
 localized(lesson.title);localized(lesson.goal);assert.equal(lesson.sections.length,8);assert.equal(lesson.checks.length,2);assert(lesson.example.steps.length>=3);localized(lesson.example.situation);lesson.example.steps.forEach(localized);
 for(const section of lesson.sections){localized(section.title);localized(section.text);}
 for(const check of lesson.checks){localized(check.question);localized(check.answer);}
 for(const visual of lesson.visuals){visualCount++;assert(visual.sectionIndex>=0&&visual.sectionIndex<8);localized(visual.title);localized(visual.description);for(const q of [0,.1,.5,.9,1])for(const mode of [0,1]){const state=model(visual.kind,q,mode);for(const row of state.rows)if(typeof row.value==='number')assert(Number.isFinite(row.value));for(const point of state.points)point.forEach(n=>assert(Number.isFinite(n)));}}
}
assert.equal(visualCount,32);for(const chapter of ['1','8','9']){assert.equal(reviews[chapter].length,9);reviews[chapter].forEach(q=>{localized(q.question);localized(q.answer);});}
const get=(s,k)=>s.rows.find(r=>r.key===k).value;
const close=(a,b)=>assert(Math.abs(a-b)<1e-10,`${a} ≠ ${b}`);
for(let i=0;i<=100;i++){
 const q=i/100;
 for(const kind of ['energy','friction','energyGraph']){const s=model(kind,q);close(get(s,'kinetic')+(kind==='energy'?get(s,'potential'):get(s,'internalEnergy')),get(s,'totalEnergy'));assert(get(s,'kinetic')>=0);}
 const friction=model('friction',q);if(q>=.5){close(get(friction,'distance'),.5);assert.equal(get(friction,'state'),'stopped');}
 for(const mode of [0,1]){const c=model('collision',q,mode);close(get(c,'initialMomentum'),get(c,'totalMomentum'));if(mode)close(get(c,'initialKinetic'),get(c,'kinetic'));else{close(get(c,'velocityA'),get(c,'velocityB'));assert(get(c,'kinetic')<get(c,'initialKinetic'));}}
 const v=model('vectors',q),pxa=get(v,'pxA'),pya=get(v,'pyA'),pxb=get(v,'pxB'),pyb=get(v,'pyB');close(pxa+pxb,1);close(pya+pyb,0);close(pxa*pxb+pya*pyb,0);close(.5*(pxa**2+pya**2+pxb**2+pyb**2),.5);
 const impulse=model('impulseGraph',q);close(.5*get(impulse,'duration')*get(impulse,'peakForce'),get(impulse,'impulse'));
 const rocket=model('rocket',q);close(get(rocket,'rocketMass')+get(rocket,'exhaustMass'),4);close(get(rocket,'rocketMomentum')+get(rocket,'exhaustMomentum'),0);close(get(rocket,'rocketVelocity'),Math.log(4/get(rocket,'rocketMass')));
 const lab=model('frame',q,0),frame=model('frame',q,1);close(get(lab,'exhaustVelocity')-get(lab,'rocketVelocity'),get(frame,'exhaustVelocity'));
 const fragment=model('fragments',q),a=fragment.bodies[0],b=fragment.bodies[1],cm=fragment.bodies[2];close((a.x+b.x)/2,cm.x);close((a.y+b.y)/2,cm.y);close(get(fragment,'accelerationY'),-1);
 const com=model('com',q);close(get(com,'centerPosition'),(-get(com,'massA')+get(com,'massB'))/(get(com,'massA')+get(com,'massB')));
 const stretch=model('stretch',q);close(get(stretch,'centerDisplacement'),0);close(get(stretch,'actualWork'),get(stretch,'elasticEnergy'));
 const lift=model('lift',q);close(get(lift,'liftingPower')+get(lift,'gravityPower'),get(lift,'netPower'));close(get(lift,'energy'),1);
}
assert.equal(get(model('frame',1),'exhaustVelocity')>0,true,'Exhaust may move forward in lab frame');
assert.equal(get(model('stretch',1),'actualWork')>0,true,'Positive actual work with fixed center of mass');
assert.throws(()=>model('unknown'));assert.equal(model('energy',Infinity).q,0);
console.log('Physics notes: 15 multilingual lessons, 120 sections, 57 checks/review items, 32 visuals; independent conservation and limiting-case checks passed.');
