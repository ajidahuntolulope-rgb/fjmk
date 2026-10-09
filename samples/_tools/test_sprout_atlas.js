
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
    }});
  const w=dom.window;
  let ran=0,err=null;
  for(const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
    if(!m[1].trim())continue;
    try{ w.eval(m[1]); ran++; }catch(e){ err=e.message; }
  }
  return {w,d:w.document,ran,err};
}
const out=[]; const ck=(n,c,d)=>out.push({n,ok:!!c,d:d||''});

// SPROUT
{
  const {w,d,ran,err}=boot(path.join(ROOT,'07-sprout-paeds/index.html'));
  ck('SPROUT - scripts execute',ran>0&&!err,err||ran+' script(s)');
  ck('SPROUT - 6 service cards',d.querySelectorAll('.scard').length===6,d.querySelectorAll('.scard').length+'');
  ck('SPROUT - vaccine timeline 6 rows',d.querySelectorAll('.vrow').length===6,d.querySelectorAll('.vrow').length+'');
  ck('SPROUT - growth chart present',!!d.getElementById('gchart'),'');
  ck('SPROUT - growth curve has 4 points',d.querySelectorAll('.gdot').length===4,d.querySelectorAll('.gdot').length+'');
  ck('SPROUT - 4 visit steps',d.querySelectorAll('.step').length===4,d.querySelectorAll('.step').length+'');
  ck('SPROUT - 3 testimonials',d.querySelectorAll('.q').length===3,d.querySelectorAll('.q').length+'');
  ck('SPROUT - 3 fee cards',d.querySelectorAll('.fee').length===3,d.querySelectorAll('.fee').length+'');
  ck('SPROUT - urgent notice',d.querySelectorAll('.urgent').length===1,'');
  ck('SPROUT - booking form',!!d.getElementById('sproutform'),'');
  ck('SPROUT - confetti shapes',d.querySelectorAll('.confetti i').length===6,d.querySelectorAll('.confetti i').length+'');
}

// ATLAS
{
  const {w,d,ran,err}=boot(path.join(ROOT,'11-atlas-medical-tourism/index.html'));
  ck('ATLAS - scripts execute',ran>0&&!err,err || ran+' script(s)');
  ck('ATLAS - flight map routes',d.querySelectorAll('.route').length===4,d.querySelectorAll('.route').length+'');
  ck('ATLAS - 4 boarding passes',d.querySelectorAll('.bp').length===4,d.querySelectorAll('.bp').length+'');
  ck('ATLAS - pass stubs present',d.querySelectorAll('.bp-stub').length===4,d.querySelectorAll('.bp-stub').length+'');
  ck('ATLAS - rubber stamp',d.querySelectorAll('.stamp-mark').length===1,'');
  ck('ATLAS - 6 process steps',d.querySelectorAll('.step').length===6,d.querySelectorAll('.step').length+'');
  ck('ATLAS - cost table rows',d.querySelectorAll('.ctable tbody tr').length===5,d.querySelectorAll('.ctable tbody tr').length+'');
  ck('ATLAS - 3 partner hospitals',d.querySelectorAll('.hcard').length===3,d.querySelectorAll('.hcard').length+'');
  ck('ATLAS - booking form',!!d.getElementById('atlasform'),'');
}

console.log('\n=== SPROUT + ATLAS FUNCTIONAL ===');
let pass=0;
for(const r of out){console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:''));if(r.ok)pass++;}
console.log('\n'+pass+'/'+out.length+' passed');
