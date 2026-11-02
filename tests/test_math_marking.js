const assert=require('node:assert/strict'),fs=require('fs'),vm=require('vm'),M=require('../app/mathematics/core/marking.js');
for(const [a,b] of [['6/2','3'],['3(2x+1)+4','6x+7'],['(x+5)/3','x/3+5/3'],['{4,0,1}','{0,1,4}'],['[0,infinity)','x>=0'],['2+√10','2+sqrt10']])assert.equal(M.grade(a,[b]).correct,true,a);
// Domain restrictions must survive algebraic cancellation.
for(const [a,b] of [['x/x','1'],['(x^2-1)/(x-1)','x+1'],['sqrt(x^2)','x'],['x>0','x>=0'],['0^0','1'],['process.exit()','3'],['2^9999','3']])assert.equal(M.grade(a,[b]).correct,false,a);
assert.equal(M.grade('2+(',['3']).status,'unreadable');assert.equal(M.grade('',['3']).status,'blank');
const ctx={};vm.runInNewContext(fs.readFileSync('app/mathematics/data/functions.js','utf8')+';questions=[...practiceQuestionBanks.flat(),...practiceFinalQuestions];',ctx);
for(const q of ctx.questions)for(const p of q.parts||[q])for(const a of p.answers)assert(M.grade(a,p.answers).correct,q.id);
console.log('Math marking passed: supported equivalence, domain restrictions, unsafe/unsupported input and all authored alternatives.');

for(const answer of ['sqrt(x)','{1,2,3,4}','A','yes'])assert.equal(M.grade('2+(',[answer]).status,'unreadable',answer);
for(const q of ctx.questions)for(const p of q.parts||[q])assert.equal(M.grade('2+(',p.answers).status,'unreadable',q.id);
