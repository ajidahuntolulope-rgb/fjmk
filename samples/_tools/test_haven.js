
const fs=require('fs');
const {JSDOM}=require('jsdom');
const f='C:/Users/User/hermes-work/fjmk/samples/06-haven-mind/index.html';
const html=fs.readFileSync(f,'utf8');
const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,
  url:'file:///'+f.replace(/\\/g,'/'),
  beforeParse(w){
    w.IntersectionObserver=class{constructor(cb){this.cb=cb}observe(e){this.cb([{isIntersecting:true,target:e}],this)}unobserve(){}disconnect(){}};
    w.matchMedia=w.matchMedia||(()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}}));
    w.scrollTo=()=>{}; w.alert=()=>{};
    // FIX: pass performance.now() so the rAF clock matches the page clock
    w.requestAnimationFrame=(fn)=>setTimeout(()=>fn(w.performance.now()),16);
    w.cancelAnimationFrame=(id)=>clearTimeout(id);
  }});
const w=dom.window,d=w.document;
let err=null;
for(const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
  if(!m[1].trim())continue;
  try{ w.eval(m[1]); }catch(e){ err=e.message; }
}
const out=[]; const ck=(n,c,det)=>out.push({n,ok:!!c,d:det||''});
ck('scripts execute',!err,err||'ok');

const count=d.getElementById('bwcount');
const phase=d.getElementById('bwphase');
const startBtn=d.getElementById('bwstart');
const cycles=d.getElementById('bwcycles');

startBtn.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));

// sample the countdown at ~1.2s into a 4s inhale -> should read 3
setTimeout(()=>{
  const c=count.textContent;
  ck('countdown reads 3 at ~1.2s of a 4s inhale', c==='3', 'count="'+c+'"');
  ck('still in inhale phase at 1.2s', /Breathe in/.test(phase.textContent),
     'phase="'+phase.textContent.trim()+'"');
}, 1200);

// at ~5.5s we are 1.5s into the 7s hold -> should read 6
setTimeout(()=>{
  ck('advanced to Hold by 5.5s', /Hold/.test(phase.textContent), 'phase="'+phase.textContent.trim()+'"');
  const c=count.textContent;
  ck('hold countdown reads 6 at ~1.5s of 7s', c==='6', 'count="'+c+'"');
}, 5500);

// full cycle is 4+7+8=19s; by 20s we should have completed 1 cycle
setTimeout(()=>{
  ck('completed at least one full cycle by 20s', /[1-9]/.test(cycles.textContent),
     'cycles="'+cycles.textContent.trim()+'"');
  console.log('\n=== HAVEN BREATHING WIDGET (faithful clock) ===');
  let pass=0;
  for(const r of out){console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:''));if(r.ok)pass++;}
  console.log('\n'+pass+'/'+out.length+' passed');
  process.exit(0);
}, 20500);
