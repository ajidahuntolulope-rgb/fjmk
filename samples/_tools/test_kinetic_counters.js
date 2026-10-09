
const fs=require('fs'), path=require('path');
const {JSDOM}=require('jsdom');
const f='C:/Users/User/hermes-work/fjmk/samples/04-kinetic-physio/index.html';
const html=fs.readFileSync(f,'utf8');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,
  url:'file:///'+f.replace(/\\/g,'/'),
  beforeParse(w){
    w.IntersectionObserver=class{constructor(cb){this.cb=cb}observe(e){this.cb([{isIntersecting:true,target:e}],this)}unobserve(){}disconnect(){}};
    w.matchMedia=w.matchMedia||(()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}}));
    w.scrollTo=()=>{}; w.alert=()=>{};
    w.requestAnimationFrame=(fn)=>setTimeout(()=>fn(w.performance.now()),16);
    w.cancelAnimationFrame=(id)=>clearTimeout(id);
  }});
const w=dom.window;
for(const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
  if(!m[1].trim())continue;
  try{ w.eval(m[1]); }catch(e){}
}
const d=w.document;
const out=[]; const ck=(n,c,det)=>out.push({n,ok:!!c,d:det||''});
// give the counters time to finish their 1.6s animation
setTimeout(()=>{
  const els=[...d.querySelectorAll('[data-count]')];
  const vals=els.map(e=>e.textContent.trim());
  ck('KINETIC - all 4 counters finished animating',
     vals.every(v=>v!=='0'&&/\d/.test(v)), 'vals='+JSON.stringify(vals));
  ck('KINETIC - first counter reached target 94%',/94%/.test(vals[0]||''), 'first="'+vals[0]+'"');
  ck('KINETIC - last counter reached target 12%',/12%/.test(vals[3]||''), 'last="'+vals[3]+'"');
  console.log('\n=== KINETIC COUNTERS (after animation) ===');
  let pass=0;
  for(const r of out){console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:''));if(r.ok)pass++;}
  console.log('\n'+pass+'/'+out.length+' passed');
}, 2600);
