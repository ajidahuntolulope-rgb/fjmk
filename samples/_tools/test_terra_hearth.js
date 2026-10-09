
const fs=require('fs'), path=require('path');
const {JSDOM}=require('jsdom');
const ROOT='C:/Users/User/hermes-work/fjmk/samples';
function boot(f,extra){
  const html=fs.readFileSync(f,'utf8');
  const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,
    url:'file:///'+f.replace(/\\/g,'/'),
    beforeParse(w){
      w.IntersectionObserver=class{constructor(cb){this.cb=cb}observe(e){this.cb([{isIntersecting:true,target:e}],this)}unobserve(){}disconnect(){}};
      w.matchMedia=w.matchMedia||(()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}}));
      w.scrollTo=()=>{}; w.alert=()=>{};
      w.requestAnimationFrame=(fn)=>setTimeout(()=>fn(w.performance.now()),16);
      w.cancelAnimationFrame=(id)=>clearTimeout(id);
      w.setInterval=()=>0; w.clearInterval=()=>{};
      if(extra) extra(w);
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

/* ---- 09 TERRA ---- */
{
  const {html,w,d,ran,err,dom}=boot(path.join(ROOT,'09-terra-derm/index.html'));
  ck('TERRA scripts execute', ran>0&&!err, err||ran+' script(s)');
  ck('TERRA 1. feTurbulence+feDisplacementMap texture',
     html.includes('feTurbulence')&&html.includes('feDisplacementMap'),'');
  ck('TERRA 2. morphing blobs (8-value radius)',
     /border-radius:[^;]*\/[^;]*/.test(html)&&html.includes('@keyframes'),'');
  ck('TERRA 3. hand-drawn SVG draw-on', html.includes('stroke-dashoffset'),'');
  ck('TERRA 4. skin-layers diagram (epi/dermis/hypo)',
     /epidermis/i.test(html)&&/dermis/i.test(html)&&/hypodermis/i.test(html),'');
  ck('TERRA 5. textured hover states', html.includes(':hover')&&(html.includes('mask')||html.includes('blend-mode')),'');
  ck('TERRA 6. slow organic reveals', html.includes('IntersectionObserver'),'');
  const txt=d.body.textContent;
  ck('TERRA 8 conditions', d.querySelectorAll('[class*="cond"],[class*="card"]').length>=8,
     d.querySelectorAll('[class*="cond"],[class*="card"]').length+' cards');
  ck('TERRA 5 treatments', /topical/i.test(txt)&&/phototherapy/i.test(txt)&&/laser/i.test(txt)&&/peel/i.test(txt),'');
  ck('TERRA 3 dermatologists', d.querySelectorAll('[class*="doc"],[class*="team"] > *').length>=3,
     d.querySelectorAll('[class*="doc"],[class*="team"] > *').length+' nodes');
  ck('TERRA ethics / realistic expectations', /realistic|no fake|melanin|expectation/i.test(txt),'');
  ck('TERRA fees', /fee|price|from\s*[₦N]/i.test(txt),'');
  ck('TERRA booking form', d.querySelectorAll('form').length>=1, d.querySelectorAll('form').length+' form(s)');
  ck('TERRA footer disclaimer', /not a substitute|medical advice|diagnos/i.test(txt),'');
  ck('TERRA prefers-reduced-motion', html.includes('prefers-reduced-motion'),'');
  ck('TERRA focus-visible', html.includes('focus-visible'),'');
  ck('TERRA <=380px', /max-width:\s*(3[0-9][0-9]|480)px/.test(html),'');
  dom.window.close();
}

/* ---- 10 HEARTH ---- */
{
  const {html,w,d,ran,err,dom}=boot(path.join(ROOT,'10-hearth-home-care/index.html'));
  ck('HEARTH scripts execute', ran>0&&!err, err||ran+' script(s)');
  ck('HEARTH 1. layered soft shadows', /box-shadow:[^;]*,[^;]*,/.test(html),'');
  ck('HEARTH 2. hand-drawn SVG draw-on', html.includes('stroke-dashoffset'),'');
  ck('HEARTH 3. day-in-life timeline', /timeline|day in the life|07:00|8:00/i.test(html),'');
  ck('HEARTH 4. drifting gradient washes', html.includes('@keyframes')&&/gradient/i.test(html),'');
  ck('HEARTH 5. hover lifts', html.includes(':hover')&&html.includes('translateY'),'');
  ck('HEARTH 6. handwritten annotations (Caveat)', html.includes('Caveat'),'');
  ck('HEARTH 7. testimonial notes', d.querySelectorAll('[class*="note"],[class*="testi"]').length>=3,
     d.querySelectorAll('[class*="note"],[class*="testi"]').length+' notes');
  const txt=d.body.textContent;
  ck('HEARTH 7 services', /live-in|post-surgical|companionship|dementia|palliative|physiotherapy|respite/i.test(txt),'');
  ck('HEARTH vetting / trust section', /vet|background check|training|supervis/i.test(txt),'');
  ck('HEARTH 4 pricing tiers', /daily|weekly|monthly|live-in/i.test(txt),'');
  ck('HEARTH 4 testimonials', d.querySelectorAll('[class*="note"],[class*="testi"]').length>=3,'');
  ck('HEARTH booking form', d.querySelectorAll('form').length>=1, d.querySelectorAll('form').length+' form(s)');
  ck('HEARTH emergency notice', /emergency|urgent/i.test(txt),'');
  ck('HEARTH diaspora/guilt addressed', /diaspora|abroad|guilt|arranging care/i.test(txt),'');
  ck('HEARTH prefers-reduced-motion', html.includes('prefers-reduced-motion'),'');
  ck('HEARTH focus-visible', html.includes('focus-visible'),'');
  ck('HEARTH <=380px', /max-width:\s*(3[0-9][0-9]|480)px/.test(html),'');
  dom.window.close();
}

console.log('\n=== TERRA + HEARTH (subagent-built) ===');
let pass=0;
for(const r of out){console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:''));if(r.ok)pass++;}
console.log('\n'+pass+'/'+out.length+' passed');
process.exit(0);
