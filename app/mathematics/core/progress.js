(function(root){
 'use strict';
 const key=(form,subject,chapter)=>`${form}:${subject}:${chapter}`;
 const parts=q=>q.parts||[{label:'',prompt:q.ask,marks:q.marks,subtopic:q.subtopic,answers:q.answers,worked:q.worked}];
 function counts(set,drafts){let answeredParts=0,totalParts=0,answeredQuestions=0;set.forEach((q,i)=>{const ps=parts(q);let complete=true;ps.forEach((_,j)=>{totalParts++;if(String(drafts[i]?.[j]||'').trim())answeredParts++;else complete=false});if(complete)answeredQuestions++});return{answeredParts,totalParts,answeredQuestions,totalQuestions:set.length}}
 function axis(value){if(value<=1)return 1;const raw=Math.max(1,value/2),power=10**Math.floor(Math.log10(raw));return [1,2,5,10].find(n=>n*power>=raw)*power*2}
 const api={key,parts,counts,axis};root.AppProgress=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
