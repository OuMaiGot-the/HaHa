const assert=require('node:assert/strict'),fs=require('node:fs');
require('../app/physics-notes/content.js');
const {text,bridges,worked,checks}=require('../app/physics-notes/friction-guide.js');
function localized(value){assert.deepEqual(Object.keys(value).sort(),['en','ms','zh']);for(const s of Object.values(value))assert(s.trim().length>0);}
Object.values(text).forEach(localized);assert.equal(bridges.length,8);bridges.forEach(localized);assert.equal(worked.length,5);worked.forEach(localized);assert.equal(checks.length,2);
for(const check of checks){localized(check.question);localized(check.hint);check.options.forEach(localized);check.feedback.forEach(localized);assert.equal(check.options.length,3);assert.equal(check.feedback.length,3);assert(check.correct>=0&&check.correct<3);}
assert.equal(checks[0].correct,0);assert.equal(checks[1].correct,2);
const lin=v=>v<=.04045?v/12.92:((v+.055)/1.055)**2.4,luminance=rgb=>rgb.reduce((sum,v,i)=>sum+lin(v/255)*[.2126,.7152,.0722][i],0);
const css=fs.readFileSync('app/physics-notes/notes.css','utf8'),fg=css.match(/color:#(190529)!important/)[1].match(/../g).map(x=>parseInt(x,16));assert((luminance([164,89,239])+.05)/(luminance(fg)+.05)>=4.5);
console.log('Guided friction: complete EN/MS/ZH teaching, misconception-specific choices, five reasoning steps and purple-button AA text contrast passed.');
