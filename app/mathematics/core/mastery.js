(function(root){
  'use strict';
  const parts=q=>q.parts||[{prompt:q.ask,subtopic:q.subtopic}];
  function catalog(banks,finals,evaluation,materials,checks){
    const list=[];
    for(const q of [...banks.flat(),...finals])parts(q).forEach((p,j)=>list.push({id:'practice:'+q.id+':'+j,questionId:q.id,topic:p.subtopic,source:'practice',prompt:p.prompt}));
    const evaluationTopics=[0,1,2,0,0,1,1,2,2];
    evaluation.forEach((q,i)=>list.push({id:'evaluation:v2:'+i,topic:evaluationTopics[i],source:'evaluation',prompt:q.question}));
    checks.forEach((q,i)=>list.push({id:'checkpoint:'+i,topic:i,source:'checkpoint',prompt:q.question}));
    materials.forEach((m,i)=>m.parts.forEach((p,j)=>{if(p.check)list.push({id:'checkpoint:expanded:'+i+':'+j,topic:i,source:'checkpoint',prompt:p.check.question});}));
    return list.filter(a=>[0,1,2].includes(a.topic));
  }
  const fresh=()=>({version:1,attempts:[]});
  function rows(record,activities){
    const known=new Set(activities.map(a=>a.id)),seen=new Set();
    return (Array.isArray(record?.attempts)?record.attempts:[]).filter(a=>{
      if(!a||typeof a.id!=='string'||!a.id||a.id.length>240||seen.has(a.id)||!known.has(a.activityId)||!['correct','incorrect','skip'].includes(a.result)||typeof a.assisted!=='boolean'||typeof a.sessionId!=='string'||!a.sessionId||typeof a.timestamp!=='string'||!Number.isFinite(Date.parse(a.timestamp)))return false;
      seen.add(a.id);return true;
    }).map(a=>({id:a.id,activityId:a.activityId,result:a.result,assisted:a.assisted,sessionId:a.sessionId,timestamp:a.timestamp,revealed:a.revealed===true}));
  }
  function append(record,batch,activities){
    const attempts=rows(record,activities),seen=new Set(attempts.map(a=>a.id));
    for(const a of rows({attempts:batch},activities)){
      if(seen.has(a.id))continue;
      const repeated=attempts.some(p=>p.activityId===a.activityId&&p.sessionId===a.sessionId&&(p.revealed||p.result!=='skip'));
      attempts.push({...a,assisted:a.assisted||repeated});seen.add(a.id);
    }
    return {version:1,attempts};
  }
  function evidence(record,activities){
    const attempts=rows(record,activities);
    return activities.map(activity=>{
      const history=attempts.filter(a=>a.activityId===activity.id),graded=history.filter(a=>a.result!=='skip'),first=graded[0],last=graded.at(-1);
      const independent=graded.some(a=>a.result==='correct'&&!a.assisted),success=graded.some(a=>a.result==='correct');
      const lastMistake=graded.findLastIndex(a=>a.result==='incorrect'),recovery=graded.slice(lastMistake+1);
      const recoveredIndependently=recovery.some(a=>a.result==='correct'&&!a.assisted),recovered=recovery.some(a=>a.result==='correct');
      const credit=last?.result==='incorrect'?0:lastMistake<0&&first?.result==='correct'&&!first.assisted?1:recoveredIndependently?.7:recovered?.35:0;
      return {activity,history,first,last,independent,success,credit};
    });
  }
  function score(record,activities){
    const es=evidence(record,activities),checked=es.filter(e=>e.first).length,total=es.length;
    const percent=total?Math.round(100*es.reduce((s,e)=>s+e.credit,0)/total):0;
    const level=percent>=90&&checked===total&&total?'Mastered':percent>=70?'Proficient':percent>=30?'Developing':'Starting';
    const attempts=rows(record,activities);
    return {percent,level,total,checked,attempts:attempts.filter(a=>a.result!=='skip').length,skips:attempts.filter(a=>a.result==='skip').length,firstCorrect:es.filter(e=>e.first?.result==='correct'&&!e.first.assisted).length,independent:es.filter(e=>e.independent).length,assisted:es.filter(e=>e.success&&!e.independent).length,needsReview:es.filter(e=>e.last?.result==='incorrect'||e.last?.assisted).length};
  }
  function recommend(record,activities){
    const es=evidence(record,activities),scores=[0,1,2].map(t=>score(record,activities.filter(a=>a.topic===t)));
    const rank=e=>e.last?.result==='incorrect'?0:e.last?.assisted?1:!e.first?2:e.credit<1?3:4;
    const ordered=es.map((e,index)=>({e,index})).sort((a,b)=>rank(a.e)-rank(b.e)||scores[a.e.activity.topic].percent-scores[b.e.activity.topic].percent||a.index-b.index);
    if(!ordered.length)return null;
    const e=ordered[0].e,reason=['mistake','assisted','new','recovery','maintain'][rank(e)];
    return {topic:e.activity.topic,activityId:e.activity.id,reason,prompt:e.activity.prompt};
  }
  function select(record,activities,bank,topic,count=5){
    const es=evidence(record,activities),priority=q=>{
      const e=es.find(e=>e.activity.id==='practice:'+q.id+':0');
      return e?.last?.result==='incorrect'?0:!e?.first?1:e.last.assisted?2:3;
    };
    return bank.filter(q=>q.subtopic===topic).map((q,i)=>({q,i})).sort((a,b)=>priority(a.q)-priority(b.q)||a.i-b.i).slice(0,count).map(x=>x.q);
  }
  const api={catalog,fresh,rows,append,evidence,score,recommend,select};root.MathMastery=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
