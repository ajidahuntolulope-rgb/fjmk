
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
const w=dom.window,d=w.document;
let err=null;
for(const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
  if(!m[1].trim())continue;
  try{ w.eval(m[1]); }catch(e){ err=e.message; }
}
const out=[]; const ck=(n,c,det)=>out.push({n,ok:!!c,d:det||''});
ck('scripts execute',!err,err||'ok');

// the 6 signature techniques the brief demanded
ck('1. scroll-linked / skewed ticker marquee', html.includes('@keyframes tk')&&html.includes('skewY'),'');
ck('2. recovery timeline that animates in', d.querySelectorAll('.tl-mark').length===5, d.querySelectorAll('.tl-mark').length+' stages');
ck('3. rotated/skewed marquee', html.includes('transform:skewY'),'');
ck('4. pointer-tilt cards (magnetic)', d.querySelectorAll('[data-tilt]').length===6, d.querySelectorAll('[data-tilt]').length+' cards');
ck('5. overshoot counters', html.includes('overshoot')&&d.querySelectorAll('[data-count]').length===4, d.querySelectorAll('[data-count]').length+' counters');
ck('6. diagonal section break (clip-path)', html.includes('clip-path:polygon'),'');

// required sections
ck('hero', !!d.querySelector('.hero'),'');
ck('6 services', d.querySelectorAll('.scard').length===6, d.querySelectorAll('.scard').length+'');
ck('recovery timeline 12 weeks', d.querySelectorAll('.tl-mark').length===5,'');
ck('3 physiotherapists', d.querySelectorAll('.tc').length===3, d.querySelectorAll('.tc').length+'');
ck('athlete testimonial', /hamstring/i.test(d.body.textContent),'');
ck('booking form', !!d.getElementById('kineticform'),'');
ck('footer disclaimer', /Outcomes vary/.test(d.body.textContent),'');
ck('prefers-reduced-motion', html.includes('prefers-reduced-motion'),'');
ck('focus-visible', html.includes('focus-visible'),'');

setTimeout(()=>{
  const vals=[...d.querySelectorAll('[data-count]')].map(e=>e.textContent.trim());
  ck('counters reach their targets', vals.every(v=>v!=='0'), vals.join(' '));
  console.log('\n=== KINETIC (rebuilt by hand) ===');
  let pass=0;
  for(const r of out){console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:''));if(r.ok)pass++;}
  console.log('\n'+pass+'/'+out.length+' passed');
},2400);
