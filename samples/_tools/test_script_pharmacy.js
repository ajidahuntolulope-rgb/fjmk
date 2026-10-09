
const fs=require('fs'), path=require('path');
const {JSDOM}=require('jsdom');
const f='C:/Users/User/hermes-work/fjmk/samples/12-script-pharmacy/index.html';
const html=fs.readFileSync(f,'utf8');

const dom=new JSDOM(html,{
  runScripts:'outside-only', pretendToBeVisual:true,
  url:'file:///'+f.replace(/\\/g,'/'),
  beforeParse(w){
    w.IntersectionObserver=class{constructor(cb){this.cb=cb}observe(e){this.cb([{isIntersecting:true,target:e}],this)}unobserve(){}disconnect(){}};
    w.matchMedia=w.matchMedia||(()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}}));
    w.scrollTo=()=>{}; w.alert=()=>{};
  }
});
const w=dom.window, d=w.document;

// load the external shared script, then fire the event it listens for
const js=fs.readFileSync(path.resolve(path.dirname(f),'assets/js/script.js'),'utf8');
let err=null;
try{ w.eval(js); }catch(e){ err=e.message; }

const out=[]; const ck=(n,c,det)=>out.push({n,ok:!!c,d:det||''});
ck('external script evaluates',!err,err||'ok');

// the script binds on DOMContentLoaded; fire it
try{ d.dispatchEvent(new w.Event('DOMContentLoaded',{bubbles:true})); }catch(e){}
try{ w.dispatchEvent(new w.Event('DOMContentLoaded')); }catch(e){}

setTimeout(()=>{
  const grid=d.getElementById('product-grid');
  const prods=grid?grid.querySelectorAll('[data-id]').length:0;
  ck('product grid renders products',prods>=18,prods+' products');

  if(prods){
    const first=grid.querySelector('[data-id]');
    const btn=first.querySelector('button');
    if(btn){
      btn.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
      const cnt=d.getElementById('basket-count');
      ck('add-to-basket updates count',cnt&&/[1-9]/.test(cnt.textContent),'count="'+(cnt?cnt.textContent.trim():'')+'"');
      const dt=d.getElementById('drawer-total');
      ck('drawer total updates',dt&&/\d/.test(dt.textContent),'total="'+(dt?dt.textContent.trim():'')+'"');
    } else ck('product has add button',false,'none');
  }
  const si=d.getElementById('search-input');
  if(si){
    si.value='paracetamol';
    si.dispatchEvent(new w.Event('input',{bubbles:true}));
    const after=grid.querySelectorAll('[data-id]').length;
    ck('search filters products',after>0&&after<prods,after+' after "paracetamol"');
  }
  console.log('\n=== SCRIPT PHARMACY ===');
  let pass=0;
  for(const r of out){console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:''));if(r.ok)pass++;}
  console.log('\n'+pass+'/'+out.length+' passed');
  process.exit(0);
},800);
