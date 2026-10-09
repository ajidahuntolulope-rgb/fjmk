
const fs=require('fs'), path=require('path');
const {JSDOM}=require('jsdom');
const ROOT='C:/Users/User/hermes-work/fjmk/samples';
function boot(f,inlineAssets){
  let html=fs.readFileSync(f,'utf8');
  const dir=path.dirname(f);
  // inline external css/js so jsdom exercises the real behaviour
  if(inlineAssets){
    html=html.replace(/<link[^>]*href="([^"]+\.css)"[^>]*>/gi,(m,href)=>{
      const p=path.resolve(dir,href);
      return fs.existsSync(p)?'<style>'+fs.readFileSync(p,'utf8')+'</style>':m;
    });
    html=html.replace(/<script[^>]*src="([^"]+\.js)"[^>]*><\/script>/gi,(m,src)=>{
      const p=path.resolve(dir,src);
      return fs.existsSync(p)?'<script>'+fs.readFileSync(p,'utf8')+'</script>':m;
    });
  }
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
  const w=dom.window;
  let err=null,ran=0;
  for(const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
    if(!m[1].trim())continue;
    try{ w.eval(m[1]); ran++; }catch(e){ if(!err) err=e.message; }
  }
  return {html,w,d:w.document,ran,err,dom};
}
const out=[]; const ck=(n,c,det)=>out.push({n,ok:!!c,d:det||''});

/* ---- TERRA re-check ---- */
{
  const {html,d,err,dom}=boot(path.join(ROOT,'09-terra-derm/index.html'));
  ck('TERRA 1. feTurbulence + feDisplacementMap', html.includes('feTurbulence')&&html.includes('feDisplacementMap'),'');
  ck('TERRA displacement filter wired to blobs', html.includes('filter:url(#organic-edge)')&&html.includes('id="organic-edge"'),'');
  ck('TERRA no JS errors', !err, err||'ok');
  dom.window.close();
}

/* ---- 12 SCRIPT PHARMACY (2 pages, shared assets) ---- */
{
  const f=path.join(ROOT,'12-script-pharmacy/index.html');
  const {html,w,d,err,dom}=boot(f,true);
  ck('SCRIPT index: no JS errors', !err, err||'ok');
  const txt=d.body.textContent;
  const cards=d.querySelectorAll('[class*="product"],[class*="card"]');
  ck('SCRIPT index: 18+ products rendered', cards.length>=18, cards.length+' product nodes');
  ck('SCRIPT index: live search input', !!d.querySelector('input[type="search"],input[type="text"][class*="search"],#search'),'');
  ck('SCRIPT index: category filters', d.querySelectorAll('[class*="filter"] button,[data-filter]').length>=3,
     d.querySelectorAll('[class*="filter"] button,[data-filter]').length+' filters');
  ck('SCRIPT index: sort controls', /sort/i.test(html),'');
  ck('SCRIPT index: basket / total', /total|basket|cart/i.test(txt),'');
  ck('SCRIPT index: prescription upload', !!d.querySelector('input[type="file"]'),'');
  ck('SCRIPT index: delivery section', /deliver/i.test(txt),'');
  ck('SCRIPT index: Rx policy section', /prescription/i.test(txt),'');
  ck('SCRIPT index: pharmacist verification', /pharmacist/i.test(txt),'');
  ck('SCRIPT index: footer disclaimer', /valid prescription|pharmacist review|not a substitute/i.test(txt),'');
  ck('SCRIPT index: link to subscriptions', !!d.querySelector('a[href*="subscriptions"]'),'');
  dom.window.close();
}
{
  const f=path.join(ROOT,'12-script-pharmacy/subscriptions.html');
  const {html,d,err,dom}=boot(f,true);
  ck('SCRIPT subs: no JS errors', !err, err||'ok');
  const txt=d.body.textContent;
  ck('SCRIPT subs: 5 conditions', /hypertension/i.test(txt)&&/diabetes/i.test(txt)&&/asthma/i.test(txt)&&/thyroid/i.test(txt)&&/epilepsy/i.test(txt),'');
  ck('SCRIPT subs: pricing tiers', d.querySelectorAll('[class*="tier"],[class*="plan"],[class*="price"]').length>=3,
     d.querySelectorAll('[class*="tier"],[class*="plan"],[class*="price"]').length+' tiers');
  ck('SCRIPT subs: refill process', /refill/i.test(txt),'');
  ck('SCRIPT subs: signup form', d.querySelectorAll('form').length>=1, d.querySelectorAll('form').length+' form(s)');
  ck('SCRIPT subs: link back to shop', !!d.querySelector('a[href*="index"]'),'');
  dom.window.close();
}

/* ---- shared assets exist ---- */
for(const rel of ['12-script-pharmacy/assets/css/script.css','12-script-pharmacy/assets/js/script.js']){
  const p=path.join(ROOT,rel);
  ck('SHARED asset: '+rel.split('/').pop(), fs.existsSync(p) && fs.statSync(p).size>1000,
     fs.existsSync(p)?fs.statSync(p).size+' bytes':'MISSING');
}

console.log('\n=== TERRA FIX + SCRIPT PHARMACY (subagent-built) ===');
let pass=0;
for(const r of out){console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:''));if(r.ok)pass++;}
console.log('\n'+pass+'/'+out.length+' passed');
process.exit(0);
