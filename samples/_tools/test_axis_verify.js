
const fs=require('fs'), path=require('path');
const {JSDOM}=require('jsdom');
const f='C:/Users/User/hermes-work/fjmk/samples/08-axis-ortho/index.html';
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

ck('1. blueprint grid background',html.includes('body::before')&&html.includes('background-size'),'');
ck('2. annotation ticks on figure',d.querySelectorAll('.tick').length>=6,d.querySelectorAll('.tick').length+' ticks');
ck('3. interactive regions',d.querySelectorAll('.region').length===6,d.querySelectorAll('.region').length+' regions');
ck('4. procedure spec datasheets',d.querySelectorAll('.sheet-row').length===5,d.querySelectorAll('.sheet-row').length+' datasheets');
ck('5. scroll-triggered line draw',d.querySelectorAll('.draw').length>=7,d.querySelectorAll('.draw').length+' animated paths');
ck('6. outcome bars / dimension data',d.querySelectorAll('.bar[data-w]').length===6,d.querySelectorAll('.bar[data-w]').length+' bars');

const title=d.getElementById('ro-title');
const seen=new Set();
for(const g of d.querySelectorAll('.region')){
  g.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
  seen.add(title.textContent.trim());
}
ck('clicking regions produces distinct readouts',seen.size>=4,seen.size+' distinct');

setTimeout(()=>{
  const widths=[...d.querySelectorAll('.bar[data-w]')].map(b=>b.style.width);
  ck('outcome bars animate to values',widths.every(x=>/%$/.test(x)),widths.join(' '));
  ck('booking form present',!!d.getElementById('axisform'),'');
  ck('footer disclaimer',/Outcomes vary by patient/.test(d.body.textContent),'');
  ck('prefers-reduced-motion',html.includes('prefers-reduced-motion'),'');
  ck('focus-visible states',html.includes('focus-visible'),'');
  console.log('\n=== AXIS (rebuilt by hand) ===');
  let pass=0;
  for(const r of out){console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:''));if(r.ok)pass++;}
  console.log('\n'+pass+'/'+out.length+' passed');
},1200);
