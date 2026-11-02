/* Restricted maths parser: no eval, dynamic code, network or external dependencies. */
(function(root){
  'use strict';
  const EPS=1e-9;
  const clean=s=>String(s??'').toLowerCase().trim().replace(/[−–]/g,'-').replace(/[×·]/g,'*').replace(/÷/g,'/').replace(/⁻¹/g,'^-1').replace(/²/g,'^2').replace(/³/g,'^3').replace(/≥/g,'>=').replace(/≤/g,'<=').replace(/≠/g,'!=').replace(/∞/g,'infinity').replace(/√/g,'sqrt').replace(/\s+/g,'');
  const trim=a=>{a=a.slice();while(a.length>1&&Math.abs(a.at(-1))<1e-12)a.pop();if(a.length>33||a.some(v=>!Number.isFinite(v)))throw Error('Expression too large');return a};
  const add=(a,b,sign=1)=>trim(Array.from({length:Math.max(a.length,b.length)},(_,i)=>(a[i]||0)+sign*(b[i]||0)));
  const mul=(a,b)=>{if(a.length+b.length>34)throw Error('Expression too large');const c=Array(a.length+b.length-1).fill(0);a.forEach((v,i)=>b.forEach((w,j)=>c[i+j]+=v*w));return trim(c)};
  const zero=a=>a.every(v=>Math.abs(v)<1e-12),norm=a=>{a=trim(a);const k=a.at(-1);return zero(a)?[0]:a.map(v=>v/k)};
  const equal=(a,b)=>{const scale=Math.max(1,...a.map(Math.abs),...b.map(Math.abs));return add(a,b,-1).every(v=>Math.abs(v)<=EPS*scale)};
  const rem=(a,b)=>{a=trim(a);b=trim(b);for(let n=0;a.length>=b.length&&!zero(a)&&n<40;n++){const k=a.at(-1)/b.at(-1),d=a.length-b.length;a=add(a,Array(d).fill(0).concat(b.map(v=>v*k)),-1)}return a};
  const gcd=(a,b)=>{for(let i=0;!zero(b)&&i<40;i++){const r=rem(a,b);a=b;b=r}return norm(a)};
  const quotient=(a,b)=>{let out=Array(Math.max(1,a.length-b.length+1)).fill(0);a=trim(a);while(a.length>=b.length&&!zero(a)){const d=a.length-b.length,k=a.at(-1)/b.at(-1);out[d]=k;a=add(a,Array(d).fill(0).concat(b.map(v=>v*k)),-1)}return trim(out)};
  const squareFree=a=>{a=norm(a);if(a.length<2)return [1];const derivative=a.slice(1).map((v,i)=>v*(i+1));return norm(quotient(a,gcd(a,derivative)))};
  function parse(source,rootVariable=false){
    let s=clean(source).replace(/sqrt([xt]|\d+(?:\.\d+)?)/g,'sqrt($1)');
    const tokens=s.match(/(?:\d+(?:\.\d*)?|\.\d+)(?:e[+-]?\d+)?|sqrt|[xt()+*/^\-]/g)||[];
    if(tokens.join('')!==s||tokens.length>180)throw Error('Use numbers, x, t, brackets, + - * / ^ and sqrt');
    let i=0;const one=()=>({n:[1],d:[1]}),constant=v=>({n:[v],d:[1]});
    const op=(a,b,c)=>{if(c==='+')return{n:add(mul(a.n,b.d),mul(b.n,a.d)),d:mul(a.d,b.d)};if(c==='-')return{n:add(mul(a.n,b.d),mul(b.n,a.d),-1),d:mul(a.d,b.d)};if(c==='*')return{n:mul(a.n,b.n),d:mul(a.d,b.d)};if(zero(b.n))throw Error('Division by zero');return{n:mul(a.n,b.d),d:mul(a.d,b.n)}};
    function atom(){const t=tokens[i++];if(t==='('){const a=sum();if(tokens[i++]!==')')throw Error('Close the brackets');return a}if(t==='x'||t==='t')return{n:rootVariable?[0,0,1]:[0,1],d:[1]};if(t==='sqrt'){if(tokens[i++]!=='(')throw Error('Use sqrt(...)');if((tokens[i]==='x'||tokens[i]==='t')&&tokens[i+1]===')'){i+=2;if(!rootVariable)throw Error('Root mode required');return{n:[0,1],d:[1]}}const a=sum();if(tokens[i++]!==')'||a.n.length!==1||a.d.length!==1||a.n[0]/a.d[0]<0)throw Error('This square root needs review');return constant(Math.sqrt(a.n[0]/a.d[0]))}if(t===undefined||!Number.isFinite(Number(t)))throw Error('Check the expression');return constant(Number(t))}
    function power(){let a=atom();if(tokens[i]==='^'){i++;let sign=1;if(tokens[i]==='-'){sign=-1;i++}const n=Number(tokens[i++])*sign;if(n===0&&zero(a.n))throw Error('Zero to the zero power is undefined');if(!Number.isInteger(n)||Math.abs(n)>8)throw Error('Use a whole-number power up to 8');let b=one();for(let j=0;j<Math.abs(n);j++)b=op(b,a,'*');a=n<0?op(one(),b,'/'):b}return a}
    function unary(){if(tokens[i]==='+'){i++;return unary()}if(tokens[i]==='-'){i++;const a=unary();return{n:a.n.map(v=>-v),d:a.d}}return power()}
    function product(){let a=unary();while(i<tokens.length){const t=tokens[i];if(t==='*'||t==='/'){i++;a=op(a,unary(),t)}else if(t==='('||t==='sqrt'||t==='x'||t==='t'||/^\d|^\./.test(t)){a=op(a,unary(),'*')}else break}return a}
    function sum(){let a=product();while(tokens[i]==='+'||tokens[i]==='-'){const t=tokens[i++];a=op(a,product(),t)}return a}
    const result=sum();if(i!==tokens.length||zero(result.d))throw Error('Check the expression');return result;
  }
  function expressionMatch(a,b){const vars=s=>[...new Set((clean(s).replace(/sqrt/g,'').match(/[xt]/g)||[]))].sort().join('');if(vars(a)&&vars(b)&&vars(a)!==vars(b))return false;const rootA=/sqrt\(?[xt]\)?/.test(clean(a)),rootB=/sqrt\(?[xt]\)?/.test(clean(b));if(rootA!==rootB)return false;const rootMode=rootA||rootB;const left=parse(a,rootMode),right=parse(b,rootMode);return equal(mul(left.n,right.d),mul(right.n,left.d))&&equal(squareFree(left.d),squareFree(right.d));}
  function relation(s){s=clean(s).replace(/^non-negative/,'nonnegative').replace(/^(?:domain|range)(?:is|:|=)?/,'');if(['nonnegativerealnumbers','nonnegativereals'].includes(s))return'x>=0';s=s.replace(/^\{[xt]:([^}]+)\}$/,'$1');const interval=s.match(/^([[(])([^,]+),([^,]+)([)\]])$/);if(interval){const [,a,lo,hi,b]=interval;if(hi==='infinity')return'x'+(a==='['?'>=':'>')+lo;if(lo==='-infinity')return'x'+(b===']'?'<=':'<')+hi}const m=s.match(/^(.+?)(>=|<=|!=|>|<)(.+)$/);if(!m)return null;let [,a,op,b]=m;if(/^[xt]$/.test(b)&&!/[xt]/.test(a)){[a,b]=[b,a];op=({'>':'<','<':'>','>=':'<=','<=':'>=','!=':'!='})[op]}if(!/^[xt]$/.test(a))return null;try{const v=parse(b);if(v.n.length!==1||v.d.length!==1)return null;return a+op+(v.n[0]/v.d[0])}catch{return null}}
  function stripAssignment(s){const value=clean(s);if(/^[xyk]=.*[xt]/.test(value))throw Error('Give an expression, not an equation');return value.replace(/^(?:[fgh](?:\^-?1)?\([^)]*\)|[xy]|k)=/,'')}
  function compare(input,expected){const a=clean(input),b=clean(expected);if(a===b)return true;const ra=relation(a),rb=relation(b);if(rb)return ra===rb;if(ra)return false;
    const text=x=>x.replace(/[.!]$/,'');if(/^[a-z ]+$/.test(String(expected).trim().toLowerCase())&& !/^(?:sqrt|x|t)/.test(b))return text(a)===text(b);
    if(b.includes(',')){const set=x=>[...new Set(x.replace(/^[ab]=/,'').replace(/^\{|\}$/g,'').split(',').map(v=>{const p=parse(v);if(p.n.length!==1||p.d.length!==1)throw Error('Set values must be numbers');return p.n[0]/p.d[0]}))].sort((a,b)=>a-b);const aa=set(a),bb=set(b);return aa.length===bb.length&&aa.every((v,i)=>Math.abs(v-bb[i])<EPS)}
    return expressionMatch(stripAssignment(input),stripAssignment(expected));
  }
  function grade(input,answers){if(!String(input??'').trim())return{status:'blank',correct:false};let readable=false;for(const expected of answers){try{if(compare(input,expected))return{status:'correct',correct:true};readable=true}catch{}}
    return{status:readable?'incorrect':'unreadable',correct:false};
  }
  const api={grade,compare,parse};root.AppMarking=api;if(typeof module!=='undefined')module.exports=api;
})(typeof globalThis!=='undefined'?globalThis:this);
