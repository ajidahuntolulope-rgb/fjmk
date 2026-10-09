
const fs=require('fs'), path=require('path');
const {JSDOM}=require('jsdom');
const ROOT='C:/Users/User/hermes-work/fjmk/samples';
function load(f){
  const html=fs.readFileSync(f,'utf8');
  return new JSDOM(html,{runScripts:'dangerously',pretendToBeVisual:true,
    beforeParse(w){
      w.IntersectionObserver=class{constructor(cb){this.cb=cb}observe(e){this.cb([{isIntersecting:true,target:e}],this)}unobserve(){}disconnect(){}};
      w.matchMedia=w.matchMedia||(()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}}));
      w.scrollTo=()=>{}; w.alert=()=>{};
    }});
}
function ext(dom,f){
  const html=fs.readFileSync(f,'utf8'), w=dom.window;
  for(const m of html.matchAll(/<script[^>]*\bsrc="([^"]+)"/gi)){
    const s=m[1]; if(/^https?:/.test(s))continue;
    const p=path.resolve(path.dirname(f),s);
    if(fs.existsSync(p)){ try{ w.eval(fs.readFileSync(p,'utf8')); }catch(e){} }
  }
}
function inline(dom,f){
  const html=fs.readFileSync(f,'utf8'), w=dom.window;
  let ran=0,err=null;
  for(const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
    if(!m[1].trim())continue;
    try{ w.eval(m[1]); ran++; }catch(e){ err=e.message; }
  }
  return {ran,err};
}
const out=[];
const ck=(n,c,d)=>out.push({n,ok:!!c,d:d||''});

// SCRIPT PHARMACY
{
  const f=path.join(ROOT,'12-script-pharmacy/index.html');
  const dom=load(f); ext(dom,f);
  const {ran,err}=inline(dom,f);
  ck('SCRIPT - scripts execute',ran>0&&!err,err||ran+' script(s)');
  const d=dom.window.document;
  const grid=d.getElementById('product-grid');
  const prods=grid?grid.querySelectorAll('[data-id], .product, .prod').length:0;
  ck('SCRIPT - product grid rendered',prods>=18,prods+' products');
  const drawer=d.getElementById('basket-drawer');
  ck('SCRIPT - basket drawer exists',!!drawer,'');
  ck('SCRIPT - search input wired',!!d.getElementById('search-input'),'');
  ck('SCRIPT - checkout form exists',!!d.getElementById('checkout-form'),'');
  ck('SCRIPT - rx upload zone exists',!!d.getElementById('rx-upload-zone'),'');
}
// VEIL
{
  const f=path.join(ROOT,'03-veil-sexual-health/index.html');
  const dom=load(f); ext(dom,f);
  const {ran,err}=inline(dom,f);
  ck('VEIL - scripts execute',ran>0&&!err,err||ran+' script(s)');
  const d=dom.window.document;
  ck('VEIL - booking form present',!!d.getElementById('bookingForm'),'');
  ck('VEIL - scroll progress element',!!d.getElementById('veilProgress'),'');
}
// MAISON
{
  const f=path.join(ROOT,'05-maison-aesthetics/index.html');
  const dom=load(f); ext(dom,f);
  const {ran,err}=inline(dom,f);
  ck('MAISON - scripts execute',ran>0&&!err,err||ran+' script(s)');
  const d=dom.window.document;
  ck('MAISON - booking form present',!!d.getElementById('booking-form'),'');
  ck('MAISON - lookbook present',!!d.getElementById('lookbook'),'');
  ck('MAISON - treatment captions',d.querySelectorAll('[id^="t"][id$="cap"]').length>=4,
     d.querySelectorAll('[id^="t"][id$="cap"]').length+' captions');
}
// TERRA
{
  const f=path.join(ROOT,'09-terra-derm/index.html');
  const dom=load(f); ext(dom,f);
  const {ran,err}=inline(dom,f);
  ck('TERRA - scripts execute',ran>0&&!err,err||ran+' script(s)');
  const d=dom.window.document;
  ck('TERRA - skin diagram present',!!d.getElementById('skinDiagram'),'');
  ck('TERRA - booking form present',!!d.getElementById('bookingForm'),'');
  ck('TERRA - SVG illustrations',(d.querySelectorAll('svg').length)>=5,d.querySelectorAll('svg').length+' svg');
}
console.log('\n=== NEW PAGE FUNCTIONAL CHECKS ===');
let pass=0;
for(const r of out){ console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:'')); if(r.ok)pass++; }
console.log('\n'+pass+'/'+out.length+' passed');
