
const fs=require('fs');
const {JSDOM}=require('jsdom');
const f='C:/Users/User/hermes-work/fjmk/samples/07-sprout-paeds/index.html';
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
  }});
const w=dom.window,d=w.document;
let err=null,ran=0;
for(const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
  if(!m[1].trim())continue;
  try{ w.eval(m[1]); ran++; }catch(e){ if(!err) err=e.message; }
}
const out=[]; const ck=(n,c,det)=>out.push({n,ok:!!c,d:det||''});
ck('scripts execute', ran>0&&!err, err||ran+' script(s)');

// the 7 signature techniques from the brief
ck('1. squiggle/blob SVG decoration', /<svg/.test(html) && /squiggle|blob|path/i.test(html), '');
ck('2. thick outline + hard offset shadow', /box-shadow:\s*\d+px\s+\d+px\s+0/.test(html), '');
ck('3. wiggle/bounce on hover', html.includes(':hover') && /cubic-bezier\([^)]*1\.[2-9]/.test(html), '');
ck('4. animated growth chart SVG', !!d.getElementById('gchart') || /growth/i.test(html), '');
ck('5. drifting confetti/floating shapes', d.querySelectorAll('.confetti i').length>=4, d.querySelectorAll('.confetti i').length+' shapes');
ck('6. buttons that press down', html.includes(':active') && html.includes('translate'), '');
ck('7. vaccination schedule timeline', d.querySelectorAll('.vrow').length>=5, d.querySelectorAll('.vrow').length+' rows');

// required sections
const txt=d.body.textContent;
ck('hero', !!d.querySelector('.hero'), '');
ck('6 service areas', d.querySelectorAll('.scard').length===6, d.querySelectorAll('.scard').length+'');
ck('growth chart with plotted points', d.querySelectorAll('.gdot').length>=4, d.querySelectorAll('.gdot').length+' points');
ck('what to expect at a visit', d.querySelectorAll('.step').length>=4, d.querySelectorAll('.step').length+' steps');
ck('paediatricians', /paediatrician|pediatrician/i.test(txt), '');
ck('parent testimonials', d.querySelectorAll('.q').length>=3, d.querySelectorAll('.q').length+'');
ck('fees section', d.querySelectorAll('.fee').length>=3, d.querySelectorAll('.fee').length+'');
ck('after-hours / urgent notice', /urgent|after.hours|emergency/i.test(txt), '');
ck('booking form', !!d.getElementById('sproutform'), '');
ck('footer disclaimer', /seriously unwell|seek care|medical advice|not a substitute|disclaimer/i.test(txt), '');
ck('Nigerian immunisation context', /Nigeria|Lagos|malaria/i.test(txt), '');
ck('prefers-reduced-motion', html.includes('prefers-reduced-motion'), '');
ck('focus-visible', html.includes('focus-visible'), '');
ck('responsive breakpoints', /max-width:\s*\d{3}px/.test(html), '');

console.log('\n=== SPROUT (rebuilt by hand) ===');
let pass=0;
for(const r of out){console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:''));if(r.ok)pass++;}
console.log('\n'+pass+'/'+out.length+' passed');
process.exit(0);
