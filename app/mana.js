(function(root){
  'use strict';
  const KEY='haha:mana:v1';
  const items=Object.freeze([
    Object.freeze({id:'forest',price:30}),Object.freeze({id:'ocean',price:60}),Object.freeze({id:'gold',price:90})
  ]);
  const fresh=()=>({version:1,ledger:[],activities:{},sets:{},equipped:''});
  const balance=s=>s.ledger.reduce((n,t)=>n+t.amount,0);
  const owned=(s,id)=>s.ledger.some(t=>t.kind==='purchase'&&t.item===id);
  const safeKey=k=>typeof k==='string'&&k.length>0&&k.length<=500&&!['__proto__','constructor','prototype'].includes(k);
  function valid(s){
    if(!s||s.version!==1||!Array.isArray(s.ledger)||!s.activities||Array.isArray(s.activities)||typeof s.activities!=='object'||!s.sets||typeof s.sets!=='object'||Array.isArray(s.sets))return false;
    const ids=new Set();let migrated=0;
    for(const t of s.ledger){
      if(!t||!safeKey(t.id)||ids.has(t.id)||!Number.isSafeInteger(t.amount)||!Number.isFinite(Date.parse(t.at))||!['first','review','set','migration','purchase'].includes(t.kind))return false;
      ids.add(t.id);
      if(t.kind==='purchase'){if(!items.some(x=>x.id===t.item&&t.amount===-x.price))return false;}
      else if(t.kind==='migration'){if(++migrated>1||t.amount<0||t.amount>1000000000)return false;}
      else if(!['physics','maths'].includes(t.subject)||!({first:[3,5],review:[2],set:[5]}[t.kind]||[]).includes(t.amount))return false;
    }
    if(!Number.isSafeInteger(balance(s))||balance(s)<0)return false;
    for(const [k,a] of Object.entries(s.activities))if(!safeKey(k)||!a||typeof a.support!=='boolean'||(a.earned!==null&&!Number.isFinite(Date.parse(a.earned)))||(a.review!==null&&!Number.isFinite(Date.parse(a.review))))return false;
    for(const [k,v] of Object.entries(s.sets))if(!safeKey(k)||v!==true)return false;
    return s.equipped===''||(items.some(x=>x.id===s.equipped)&&owned(s,s.equipped));
  }
  function reduce(input,event){
    if(!valid(input))return {state:input,error:'corrupt',amount:0};
    const s=JSON.parse(JSON.stringify(input));
    if(!event||!Number.isFinite(Date.parse(event.at)))return {state:input,error:'event',amount:0};
    let tx=null;
    if(event.kind==='migration'){
      if(s.ledger.some(t=>t.kind==='migration'))return {state:s,amount:0};
      const amount=Number.isSafeInteger(event.amount)&&event.amount>=0&&event.amount<=1000000000?event.amount:0;
      tx={id:'migration:maths',kind:'migration',amount,at:event.at};
    }else if(event.kind==='answer'){
      if(!['physics','maths'].includes(event.subject)||!safeKey(event.activity)||typeof event.correct!=='boolean'||typeof event.assisted!=='boolean')return {state:input,error:'event',amount:0};
      const k=event.subject+':'+event.activity;
      const a=s.activities[k]||{support:false,earned:null,review:null};
      if(!event.correct||event.assisted)a.support=true;
      if(event.correct&&!a.earned){
        a.earned=event.at;
        tx={id:'first:'+k,kind:'first',subject:event.subject,activity:event.activity,amount:a.support?3:5,at:event.at};
      }else if(event.correct&&a.earned){
        // A later local calendar day, with seven elapsed days between paid reviews.
        const day=d=>{const x=new Date(d);return [x.getFullYear(),x.getMonth(),x.getDate()].join('-');};
        if(Date.parse(event.at)>Date.parse(a.earned)&&day(event.at)!==day(a.earned)&&(!a.review||Date.parse(event.at)-Date.parse(a.review)>=7*86400000)){
          a.review=event.at;tx={id:'review:'+k+':'+event.at,kind:'review',subject:event.subject,activity:event.activity,amount:2,at:event.at};
        }
      }
      s.activities[k]=a;
    }else if(event.kind==='set'){
      if(!['physics','maths'].includes(event.subject)||event.allAttempted!==true)return {state:input,amount:0};
      const d=new Date(event.at),k=event.subject+':'+d.getFullYear()+'-'+d.getMonth()+'-'+d.getDate();
      if(!s.sets[k]){s.sets[k]=true;tx={id:'set:'+k,kind:'set',subject:event.subject,amount:5,at:event.at};}
    }else if(event.kind==='purchase'){
      const item=items.find(x=>x.id===event.item);
      if(!item)return {state:input,error:'item',amount:0};
      if(owned(s,item.id))return {state:s,amount:0};
      if(balance(s)<item.price)return {state:input,error:'funds',amount:0};
      tx={id:'purchase:'+item.id,kind:'purchase',item:item.id,amount:-item.price,at:event.at};s.equipped=item.id;
    }else if(event.kind==='equip'){
      if(event.item!==''&&!owned(s,event.item))return {state:input,error:'item',amount:0};
      s.equipped=event.item;
    }else return {state:input,error:'event',amount:0};
    if(tx&&!s.ledger.some(t=>t.id===tx.id))s.ledger.push(tx);
    return {state:s,amount:tx?.amount||0,transaction:tx};
  }
  const api={KEY,items,fresh,valid,balance,owned,reduce};
  if(typeof module!=='undefined'&&module.exports)module.exports=api;
  root.HahaManaModel=api;
})(typeof globalThis!=='undefined'?globalThis:this);
