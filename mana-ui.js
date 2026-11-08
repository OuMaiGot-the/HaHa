(function(){
 'use strict';
 const M=window.HahaManaModel;if(!M)return;
 const copy={
 en:{wallet:'Mana wallet',balance:'Available Mana',local:'Shared by both subjects in this browser. No account or cross-device sync.',rules:'How to earn Mana',rule:'First correct: +5 without hints, or +3 after hints or a mistake. Correct review on a later day: +2, at most once every seven days per activity. Finish a practice set with every question attempted: +5 per subject per day. Hints are free; wrong answers never cost Mana. Mana does not measure mastery.',shop:'Cosmetic shop',history:'Transaction history',none:'No transactions yet. Try a lesson or practice set.',close:'Close wallet',buy:'Unlock',equip:'Use',active:'In use',default:'Use original appearance',confirm:'Confirm purchase',cancel:'Cancel',funds:'Not enough Mana. Keep learning and come back later.',corrupt:'Mana is unavailable because its saved data could not be read. Your learning remains available.',storage:'Mana could not be saved. Your balance has not been changed.',locks:'Purchases need a browser that supports safe tab locking.',first:'First correct answer',review:'Later-day review',set:'Practice set attempted',migration:'Existing Maths Mana carried over',purchase:'Cosmetic purchase',physics:'Physics',maths:'Mathematics',forest:'Forest accent',ocean:'Ocean accent',gold:'Golden frame',owned:'Owned',more:'Show more transactions',earned:'Mana earned',empty:'Cosmetics only. Learning, hints and explanations stay free.',wait:'Saving…'},
 ms:{wallet:'Dompet Mana',balance:'Mana tersedia',local:'Dikongsi kedua-dua subjek dalam pelayar ini. Tiada akaun atau penyegerakan peranti.',rules:'Cara memperoleh Mana',rule:'Jawapan betul pertama: +5 tanpa petunjuk, atau +3 selepas petunjuk atau kesilapan. Ulang kaji betul pada hari lain: +2, sekali setiap tujuh hari bagi setiap aktiviti. Cuba semua soalan dalam set latihan: +5 bagi setiap subjek sehari. Petunjuk percuma; jawapan salah tidak menolak Mana. Mana bukan ukuran penguasaan.',shop:'Kedai kosmetik',history:'Sejarah transaksi',none:'Belum ada transaksi. Cuba pelajaran atau latihan.',close:'Tutup dompet',buy:'Buka',equip:'Guna',active:'Sedang digunakan',default:'Guna rupa asal',confirm:'Sahkan pembelian',cancel:'Batal',funds:'Mana tidak mencukupi. Teruskan belajar dan kembali kemudian.',corrupt:'Data Mana tidak dapat dibaca. Pembelajaran masih tersedia.',storage:'Mana tidak dapat disimpan. Baki tidak berubah.',locks:'Pembelian memerlukan pelayar yang menyokong kunci tab selamat.',first:'Jawapan betul pertama',review:'Ulang kaji pada hari lain',set:'Semua soalan set dicuba',migration:'Mana Matematik terdahulu dipindahkan',purchase:'Pembelian kosmetik',physics:'Fizik',maths:'Matematik',forest:'Aksen hutan',ocean:'Aksen lautan',gold:'Bingkai emas',owned:'Dimiliki',more:'Lihat lagi transaksi',earned:'Mana diperoleh',empty:'Kosmetik sahaja. Pelajaran, petunjuk dan penjelasan kekal percuma.',wait:'Menyimpan…'},
 zh:{wallet:'Mana 钱包',balance:'可用 Mana',local:'两个科目共享此浏览器中的余额。尚无账号或跨设备同步。',rules:'如何获得 Mana',rule:'首次答对：无提示 +5，使用提示或答错后 +3。在之后的日期复习答对：+2，每项活动每七天最多一次。尝试练习组的所有问题：每科每天 +5。提示免费，答错不扣分。Mana 不代表掌握程度。',shop:'装饰商店',history:'交易记录',none:'暂无交易。开始课程或练习吧。',close:'关闭钱包',buy:'解锁',equip:'使用',active:'使用中',default:'使用原始外观',confirm:'确认购买',cancel:'取消',funds:'Mana 不足，继续学习后再来。',corrupt:'无法读取 Mana 数据，学习功能仍可使用。',storage:'无法保存 Mana，余额未改变。',locks:'购买需要支持安全标签锁定的浏览器。',first:'首次答对',review:'隔日复习',set:'已尝试整组练习',migration:'转入原有数学 Mana',purchase:'购买装饰',physics:'物理',maths:'数学',forest:'森林装饰',ocean:'海洋装饰',gold:'金色边框',owned:'已拥有',more:'显示更多交易',earned:'获得 Mana',empty:'仅限装饰。课程、提示和解释始终免费。',wait:'保存中…'}
 };
 const locale=()=>document.documentElement.lang.startsWith('ms')?'ms':document.documentElement.lang.startsWith('zh')?'zh':'en';
 const t=k=>copy[locale()][k]||k;
 const el=(tag,text,cls)=>{const x=document.createElement(tag);if(text!==undefined)x.textContent=text;if(cls)x.className=cls;return x;};
 const action=(text,fn)=>{const b=el('button',text);b.type='button';b.onclick=fn;return b;};
 let queue=Promise.resolve(),error='',dialog,launcher,notice,selected='',limit=20,pending=false,returnFocus;
 function read(){const raw=localStorage.getItem(M.KEY);if(raw===null)return M.fresh();let s;try{s=JSON.parse(raw);}catch(_){throw Error('corrupt');}if(!M.valid(s))throw Error('corrupt');return s;}
 function get(){try{return read();}catch(_){return null;}}
 function refresh(){const s=get();if(launcher){launcher.textContent=s?'Mana '+M.balance(s):'Mana —';launcher.setAttribute('aria-label',t('wallet')+(s?' · '+M.balance(s):''));}if(document.body)document.body.dataset.manaCosmetic=s?.equipped||'';}
 function announce(text){if(!notice){notice=el('div',undefined,'mana-notice');notice.id='mana-notice';notice.setAttribute('role','status');document.body.append(notice);}notice.textContent=text;notice.hidden=false;clearTimeout(announce.timer);announce.timer=setTimeout(()=>{notice.hidden=true;},6500);}
 function transact(event){
  const work=()=>{try{const r=M.reduce(read(),{...event,at:event.at||new Date().toISOString()});if(r.error){error=r.error;return r;}localStorage.setItem(M.KEY,JSON.stringify(r.state));error='';refresh();window.dispatchEvent(new Event('haha:mana'));if(r.amount>0&&event.kind!=='migration')announce('+'+r.amount+' '+t('earned'));return r;}catch(e){error=e.message==='corrupt'?'corrupt':'storage';refresh();return {error,amount:0};}};
  const run=()=>navigator.locks?.request?navigator.locks.request(M.KEY,work):work();
  const result=queue.then(run,run);queue=result.catch(()=>{});return result;
 }
 async function initialise(){
  let amount=0;try{const raw=localStorage.getItem('haha:math:v1:amMana')??localStorage.getItem('haha:math:v1:amSparks');const n=JSON.parse(raw??'0');if(Number.isSafeInteger(n)&&n>=0)amount=n;}catch(_){}
  await transact({kind:'migration',amount});refresh();
 }
 const ready=initialise();
 async function answer(subject,activity,correct,assisted=false){await ready;return transact({kind:'answer',subject,activity,correct:!!correct,assisted:!!assisted});}
 async function completeSet(subject,allAttempted){await ready;return transact({kind:'set',subject,allAttempted:!!allAttempted});}
 async function purchase(item){await ready;if(!navigator.locks?.request){error='locks';return {error,amount:0};}return transact({kind:'purchase',item});}
 function render(){
  if(!dialog)return;
  const s=get();dialog.replaceChildren();const head=el('div',undefined,'mana-dialog-head');const h=el('h2',t('wallet'));h.id='mana-title';head.append(h,action(t('close'),()=>dialog.close()));dialog.append(head);
  const msg=el('p',error?t(error):'','mana-message');msg.setAttribute('role','status');dialog.append(msg);
  if(!s){msg.textContent=t(error||'corrupt');return;}
  dialog.append(el('strong',t('balance')+': '+M.balance(s),'mana-balance'),el('p',t('local')));
  const rules=el('details');rules.append(el('summary',t('rules')),el('p',t('rule')));dialog.append(rules);
  dialog.append(el('h3',t('shop')),el('p',t('empty')));
  const shop=el('div',undefined,'mana-shop');
  for(const item of M.items){const card=el('article',undefined,'mana-item');card.dataset.preview=item.id;card.append(el('div','h.','mana-preview'),el('h4',t(item.id)),el('p',M.owned(s,item.id)?t('owned'):item.price+' Mana'));
   const b=action(M.owned(s,item.id)?(s.equipped===item.id?t('active'):t('equip')):t('buy'),async()=>{
    const current=get();if(current&&M.owned(current,item.id)){await transact({kind:'equip',item:item.id});render();}
    else{selected=item.id;render();dialog.querySelector('[data-mana-confirm]')?.focus();}
   });b.disabled=pending||s.equipped===item.id;card.append(b);shop.append(card);}
  dialog.append(shop,action(t('default'),async()=>{await transact({kind:'equip',item:''});render();}));
  if(selected){const item=M.items.find(x=>x.id===selected),confirm=el('section',undefined,'mana-confirm');confirm.append(el('h3',t('confirm')),el('p',t(item.id)+' · '+item.price+' Mana'));
   const buy=action(pending?t('wait'):t('confirm'),async()=>{if(pending)return;pending=true;render();const r=await purchase(item.id);pending=false;if(!r.error)selected='';render();dialog.querySelector('.mana-message')?.setAttribute('tabindex','-1');dialog.querySelector('.mana-message')?.focus();});buy.dataset.manaConfirm='';buy.disabled=pending;confirm.append(buy,action(t('cancel'),()=>{selected='';render();}));dialog.append(confirm);}
  dialog.append(el('h3',t('history')));const list=el('ol',undefined,'mana-history');
  const visible=s.ledger.filter(row=>row.kind!=='migration'||row.amount>0);
  for(const row of visible.slice().reverse().slice(0,limit)){const entry=el('li');entry.append(el('strong',(row.amount>0?'+':'')+row.amount+' Mana'),el('span',t(row.kind)+(row.kind==='first'&&row.amount===3?' · '+({en:'with hints or after a mistake',ms:'dengan petunjuk atau selepas kesilapan',zh:'使用提示或答错后'}[locale()]):'')+(row.subject?' · '+t(row.subject):'')+(row.item?' · '+t(row.item):'')),el('time',new Date(row.at).toLocaleString(locale())));list.append(entry);}
  if(!visible.length)list.append(el('li',t('none')));dialog.append(list);if(visible.length>limit)dialog.append(action(t('more'),()=>{limit+=20;render();}));
 }
 function open(){returnFocus=document.activeElement;selected='';limit=20;if(!dialog){dialog=el('dialog',undefined,'mana-dialog');dialog.setAttribute('aria-labelledby','mana-title');dialog.addEventListener('close',()=>returnFocus?.focus?.());document.body.append(dialog);}render();if(!dialog.open)dialog.showModal();}
 function mount(){if(launcher?.isConnected){refresh();return;}launcher=action('Mana …',open);launcher.className='mana-trigger';launcher.setAttribute('aria-haspopup','dialog');(document.querySelector('.subject-header-actions')||document.querySelector('.app-header,.topbar')||document.body).append(launcher);refresh();}
 window.HahaMana={ready,answer,completeSet,purchase,get,open,mount};
 window.addEventListener('storage',event=>{if(event.key===M.KEY){refresh();if(dialog?.open)render();}});
 window.addEventListener('haha:mana',()=>{refresh();if(dialog?.open&&!pending)render();});
 new MutationObserver(refresh).observe(document.documentElement,{attributes:true,attributeFilter:['lang']});
 if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',mount);else mount();
 ready.then(refresh);
})();
