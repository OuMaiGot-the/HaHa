// Native disclosures and links retain keyboard support and work without JavaScript.
document.addEventListener('click',event=>{
  document.querySelectorAll('.subject-switch[open]').forEach(menu=>{if(!menu.contains(event.target)||event.target.closest('a'))menu.open=false;});
});
document.addEventListener('keydown',event=>{
  if(event.key!=='Escape')return;
  document.querySelectorAll('.subject-switch[open]').forEach(menu=>{menu.open=false;menu.querySelector('summary').focus();});
});
