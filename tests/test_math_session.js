const assert=require('node:assert/strict'),S=require('../app/mathematics/core/session.js'),C=require('../app/mathematics/core/content.js');
const q={id:'one',context:'Question',ask:'Example',answers:['x+1']};
const state={page:'practice',history:[],form:4,subject:'Additional Mathematics',practiceSet:[q],practiceDrafts:[['x + 1']],practiceAnswers:[],practiceSubmitted:false,practiceSessionId:'set-1',practiceIndex:0,chapterEvalAnswers:Array(9).fill(null)};
const snapshot=S.capture(state),restored={};assert(S.valid(snapshot));assert(S.restore(restored,snapshot,[q],9));assert.equal(restored.practiceDrafts[0][0],'x + 1');restored.practiceDrafts[0][0]='changed';assert.equal(snapshot.practiceDrafts[0][0],'x + 1');
assert.equal(S.parse('#practiceResults/old','set-1').page,'practiceChapters');assert.equal(S.parse('#practice/set-1','set-1').page,'practice');assert.equal(S.url(state),'#practice/set-1');assert.equal(S.parse('#notes/2','set-1').noteIndex,2);
assert.equal(S.restore({},snapshot,[],9),false);assert.equal(S.valid({...snapshot,practiceSet:[{parts:{}}]}),false);assert.equal(S.restore({},null,[q],9),false);
assert.equal(S.valid({...snapshot,history:[{page:'__proto__'}]}),false);
assert.equal(C.prose('<strong>Domain</strong><br><th scope="col">Input</th>'),'<strong>Domain</strong><br><th scope="col">Input</th>');
assert(!C.prose('<script>alert(1)</script><img src=x onerror=alert(1)>').includes('<script>'));assert(!C.prose('<strong onclick="bad()">bad</strong>').includes('<strong onclick'));
console.log('Math session tests passed: snapshots, stale identity, malformed data, routes and safe prose.');

assert.equal(S.valid({...snapshot,practiceHints:{bad:true}}),false);assert.equal(S.valid({...snapshot,practiceFocusTopic:9}),false);
