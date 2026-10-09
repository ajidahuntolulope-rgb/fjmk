
const fs=require('fs'), path=require('path');
const {JSDOM}=require('jsdom');
const ROOT='C:/Users/User/hermes-work/fjmk/samples';
function boot(f){
  const dir=path.dirname(f);
  let html=fs.readFileSync(f,'utf8');
  html=html.replace(/<link[^>]*href="([^"]+\.css)"[^>]*>/gi,(m,href)=>{
    const p=path.resolve(dir,href);
    return fs.existsSync(p)?'<style>'+fs.readFileSync(p,'utf8')+'</style>':m;
  });
  html=html.replace(/<script[^>]*src="([^"]+\.js)"[^>]*><\/script>/gi,(m,src)=>{
    const p=path.resolve(dir,src);
    return fs.existsSync(p)?'<script>'+fs.readFileSync(p,'utf8')+'</script>':m;
  });
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
  for(const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
    if(m[1].trim()) try{ w.eval(m[1]); }catch(e){}
  }
  // KEY: jsdom already finished loading, so fire the event the page waits for
  w.document.dispatchEvent(new w.Event('DOMContentLoaded',{bubbles:true}));
  return {html,w,d:w.document,dom};
}
const out=[]; const ck=(n,c,det)=>out.push({n,ok:!!c,d:det||''});

{
  const {html,w,d,dom}=boot(path.join(ROOT,'12-script-pharmacy/index.html'));
  const grid=d.getElementById('product-grid');
  ck('SCRIPT index: grid exists', !!grid,'');
  ck('SCRIPT index: 24 products render', grid && grid.children.length===24,
     grid?grid.children.length+' products':'no grid');
  const txt=d.body.textContent;
  const prices=new Set([...txt.matchAll(/₦\s?([\d,]+)/g)].map(m=>m[1]));
  ck('SCRIPT index: prices rendered', prices.size>=15, prices.size+' distinct prices');
  ck('SCRIPT index: Rx flag shown', /Rx|prescription/i.test(txt),'');

  // live search
  const si=d.querySelector('input[type="search"],input[class*="search"],#search');
  if(si){
    const before=grid.children.length;
    si.value='paracetamol';
    si.dispatchEvent(new w.Event('input',{bubbles:true}));
    const after=grid.children.length;
    ck('SCRIPT index: live search filters', after>0 && after<before, before+' -> '+after);
    si.value=''; si.dispatchEvent(new w.Event('input',{bubbles:true}));
    ck('SCRIPT index: clearing search restores', grid.children.length===24, grid.children.length+'');
  } else ck('SCRIPT index: live search filters', false, 'no search input');

  // category filter
  const fb=d.querySelector('[data-filter]');
  if(fb){
    fb.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
    ck('SCRIPT index: category filter works', grid.children.length>0 && grid.children.length<24,
       grid.children.length+' after filter');
  }

  // add to basket
  const add=d.querySelector('[data-add],[class*="add"],button[class*="add"]');
  if(add){
    add.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
    const badge=d.querySelector('[class*="count"],[class*="badge"],[class*="total"]');
    ck('SCRIPT index: add-to-basket updates state',
       /1/.test((badge&&badge.textContent)||''), (badge&&badge.textContent.trim())||'no badge');
  }
  dom.window.close();
}

{
  const {html,w,d,dom}=boot(path.join(ROOT,'12-script-pharmacy/subscriptions.html'));
  ck('SCRIPT subs: page loads', d.body.textContent.length>2000, d.body.textContent.length+' chars');
  dom.window.close();
}

console.log('\n=== SCRIPT PHARMACY (with DOMContentLoaded fired) ===');
let pass=0;
for(const r of out){console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:''));if(r.ok)pass++;}
console.log('\n'+pass+'/'+out.length+' passed');
process.exit(0);
