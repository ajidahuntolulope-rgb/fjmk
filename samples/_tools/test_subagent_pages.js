
const fs=require('fs'), path=require('path');
const {JSDOM}=require('jsdom');
const ROOT='C:/Users/User/hermes-work/fjmk/samples';
function boot(f){
  const html=fs.readFileSync(f,'utf8');
  const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,
    url:'file:///'+f.replace(/\\/g,'/'),
    beforeParse(w){
      w.IntersectionObserver=class{constructor(cb){this.cb=cb}observe(e){this.cb([{isIntersecting:true,target:e}],this)}unobserve(){}disconnect(){}};
      w.matchMedia=w.matchMedia||(()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}}));
      w.scrollTo=()=>{}; w.alert=()=>{};
      w.requestAnimationFrame=(fn)=>setTimeout(()=>fn(w.performance.now()),16);
      w.cancelAnimationFrame=(id)=>clearTimeout(id);
      // neutralise interval loops so jsdom can exit
      w.setInterval=()=>0; w.clearInterval=()=>{};
      w.getComputedStyle=w.getComputedStyle||(()=>({getPropertyValue:()=>''}));
    }});
  const w=dom.window;
  let err=null,ran=0;
  for(const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
    if(!m[1].trim())continue;
    try{ w.eval(m[1]); ran++; }catch(e){ if(!err) err=e.message; }
  }
  return {html,w,d:w.document,ran,err,dom};
}
const out=[]; const ck=(n,c,det)=>out.push({n,ok:!!c,d:det||''});

{
  const {html,w,d,ran,err,dom}=boot(path.join(ROOT,'03-veil-sexual-health/index.html'));
  ck('VEIL scripts execute', ran>0 && !err, err||ran+' script(s)');
  ck('VEIL 1. masked hero reveal (clip-path)', html.includes('clip-path'), '');
  ck('VEIL 2. custom cursor orb', /cursor/i.test(html), '');
  ck('VEIL 3. scroll veil progress line', /veilProgress|progress/i.test(html), '');
  ck('VEIL 4. hover mask reveal', html.includes('mask')||html.includes('clip-path'), '');
  ck('VEIL 5. animated grain (feTurbulence)', html.includes('feTurbulence'), '');
  const txt=d.body.textContent;
  ck('VEIL 6 treatment areas', d.querySelectorAll('[class*="card"],[class*="treat"]').length>=6,
     d.querySelectorAll('[class*="card"],[class*="treat"]').length+' cards');
  ck('VEIL confidentiality/trust section', /confidential|privacy|discreet/i.test(txt), '');
  ck('VEIL testing process steps', d.querySelectorAll('[class*="step"]').length>=4,
     d.querySelectorAll('[class*="step"]').length+' steps');
  ck('VEIL anonymous testimonial', /Client,\s*\d/i.test(txt), '');
  ck('VEIL booking form', d.querySelectorAll('form').length>=1, d.querySelectorAll('form').length+' form(s)');
  ck('VEIL footer disclaimer', /not a substitute|medical advice|emergency/i.test(txt), '');
  ck('VEIL prefers-reduced-motion', html.includes('prefers-reduced-motion'), '');
  ck('VEIL focus-visible', html.includes('focus-visible'), '');
  ck('VEIL responsive breakpoints', /max-width:\s*\d{3}px/.test(html), '');
  dom.window.close();
}

{
  const {html,w,d,ran,err,dom}=boot(path.join(ROOT,'05-maison-aesthetics/index.html'));
  ck('MAISON scripts execute', ran>0 && !err, err||ran+' script(s)');
  ck('MAISON 1. asymmetric editorial grid', html.includes('grid-column'), '');
  ck('MAISON 2. numbered plates/figures', /Plate|Fig\.|N[ºo]\s*\d/i.test(d.body.textContent), '');
  ck('MAISON 3. clip-path/mask image reveal', html.includes('clip-path')||html.includes('mask'), '');
  ck('MAISON 4. word-by-word reveal', /\.w\b/.test(html)||html.includes('wordReveal'), '');
  ck('MAISON 5. scroll-snap lookbook', html.includes('scroll-snap'), '');
  ck('MAISON 6. hover-reveal cards', html.includes(':hover'), '');
  ck('MAISON pricing present', /from\s*[₦N]/i.test(d.body.textContent), '');
  ck('MAISON booking form', d.querySelectorAll('form').length>=1, d.querySelectorAll('form').length+' form(s)');
  ck('MAISON disclaimer', /results vary|consultation/i.test(d.body.textContent), '');
  ck('MAISON prefers-reduced-motion', html.includes('prefers-reduced-motion'), '');
  ck('MAISON focus-visible', html.includes('focus-visible'), '');
  ck('MAISON responsive breakpoints', /max-width:\s*\d{3}px/.test(html), '');
  dom.window.close();
}

console.log('\n=== INDEPENDENT VERIFICATION OF SUBAGENT-BUILT PAGES ===');
let pass=0;
for(const r of out){console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:''));if(r.ok)pass++;}
console.log('\n'+pass+'/'+out.length+' passed');
process.exit(0);
