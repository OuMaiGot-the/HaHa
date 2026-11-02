(function(root){
 'use strict';
 const escape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
 // Only semantic formatting used by the pinned authored notes is admitted.
 const prose=value=>escape(value).replace(/&lt;(\/?)(br|strong|em|table|caption|thead|tbody|tr|th|td|ul|ol|li|sup|sub)\s*\/?&gt;/gi,(_,slash,tag)=>'<'+slash+tag.toLowerCase()+'>').replace(/&lt;th scope=&quot;(col|row)&quot;&gt;/gi,'<th scope="$1">');
 const api={escape,prose};root.AppContent=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
