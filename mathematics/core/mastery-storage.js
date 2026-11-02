(function(root){
  'use strict';
  function create(storage,activities,{visit,onWarning=()=>{},onChange=()=>{},locks}={}){
    const M=root.MathMastery,key='amMasteryV1',exposed=new Set();let memory=M.fresh(),queue=Promise.resolve(),protectedData=false;
    function read(){
      try{const raw=storage.getItem(key);if(raw===null)return M.fresh();const value=JSON.parse(raw);
        if(value?.version!==1||!Array.isArray(value.attempts))throw Error('unsupported');
        return {version:1,attempts:M.rows(value,activities)};
      }catch(_){protectedData=true;onWarning('Previous Maths mastery data could not be read. It is preserved; new mastery evidence will stay in this tab.');return M.fresh();}
    }
    memory=read();
    function expose(ids){ids.forEach(id=>exposed.add(id));}
    function recordMany(batch){
      const events=batch.map(e=>({...e,sessionId:visit,assisted:e.assisted===true||exposed.has(e.activityId)}));
      memory=M.append(memory,events,activities);expose(events.filter(e=>e.revealed).map(e=>e.activityId));
      const run=async()=>{
        const persist=()=>{
          memory=M.append(read(),memory.attempts,activities);
          if(protectedData)return false;
          try{if(storage.setItem(key,JSON.stringify(memory))===false)throw Error('write');return true;}
          catch(_){onWarning('Your latest Maths mastery evidence could not be saved. Keep this tab open to continue.');return false;}
        };
        const saved=locks?.request?await locks.request('haha-maths-mastery-v1',persist):persist();onChange();return saved;
      };
      const result=queue.then(run,run);queue=result.catch(()=>{});return result;
    }
    function refresh(){memory=M.append(read(),memory.attempts,activities);onChange();}
    return {get:()=>JSON.parse(JSON.stringify(memory)),recordMany,expose,refresh,ready:()=>queue};
  }
  root.MathMasteryStorage={create};if(typeof module!=='undefined')module.exports={create};
})(typeof globalThis!=='undefined'?globalThis:this);
