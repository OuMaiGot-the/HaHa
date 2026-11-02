(()=>{
  'use strict';
  const selector='button,input[type=button],input[type=submit],input[type=reset],[role=button],a.primary,a.btn-primary,a.btn-secondary,a.action,a.settings-shortcut,a.study-back,.lesson-card>a,nav a,#navigation a,summary';
  const sculpture='.phyphy-trigger,.lesson-node,.path-node-summary';
  let scheduled=false;
  function surface(element){
    for(let current=element;current;current=current.parentElement){
      const colour=getComputedStyle(current).backgroundColor;
      if(colour!=='transparent'&&colour!=='rgba(0, 0, 0, 0)')return colour;
    }
    return '#ffffff';
  }
  function decorate(){
    scheduled=false;
    document.querySelectorAll(selector).forEach(element=>{
      if(element.matches(sculpture)){
        if(!element.classList.contains('tactile-sculpture'))element.classList.add('tactile-sculpture');return;
      }
      if(!element.classList.contains('tactile-button'))element.classList.add('tactile-button');
      const colour=surface(element);
      const parts=colour.match(/[\d.]+/g)?.map(Number)||[255,255,255];
      const light=(parts[0]*.2126+parts[1]*.7152+parts[2]*.0722)/255;
      const lip=`color-mix(in srgb, ${colour} ${light>.9?82:76}%, #000)`;
      if(element.style.getPropertyValue('--tactile-lip')!==lip)element.style.setProperty('--tactile-lip',lip);
    });
  }
  function schedule(){if(!scheduled){scheduled=true;requestAnimationFrame(decorate);}}
  function init(){
    document.body.dataset.buttonSubject=location.pathname.includes('/mathematics')?'maths':'physics';
    decorate();
    new MutationObserver(schedule).observe(document.body,{subtree:true,childList:true,attributes:true,attributeFilter:['class','style','disabled','aria-disabled','aria-pressed','aria-checked','aria-current','data-theme','data-palette','data-mana-cosmetic']});
    document.addEventListener('keydown',event=>{
      if(event.repeat||!['Enter',' '].includes(event.key))return;
      const button=event.target.closest('.tactile-button');
      if(button&&!button.disabled&&button.getAttribute('aria-disabled')!=='true')button.classList.add('is-key-pressed');
    });
    const release=()=>document.querySelectorAll('.is-key-pressed').forEach(button=>button.classList.remove('is-key-pressed'));
    document.addEventListener('keyup',release);window.addEventListener('blur',release);
    document.addEventListener('focusout',release);
  }
  if(document.readyState==='loading')document.addEventListener('DOMContentLoaded',init,{once:true});else init();
})();
