
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

// KINETIC
{
  const {w,d,ran,err}=boot(path.join(ROOT,'04-kinetic-physio/index.html'));
  ck('KINETIC - scripts execute',ran>0&&!err,err||ran+' script(s)');
  const svc=d.getElementById('svcgrid');
  ck('KINETIC - service cards present',svc&&svc.querySelectorAll('.scard').length===6,
     svc?svc.querySelectorAll('.scard').length+' cards':'');
  ck('KINETIC - tilt cards wired',d.querySelectorAll('[data-tilt]').length===6,
     d.querySelectorAll('[data-tilt]').length+'');
  ck('KINETIC - recovery timeline',!!d.getElementById('tl'),'');
  ck('KINETIC - timeline has 5 marks',d.querySelectorAll('.tl-mark').length===5,
     d.querySelectorAll('.tl-mark').length+'');
  ck('KINETIC - outcome counters',d.querySelectorAll('[data-count]').length===4,
     d.querySelectorAll('[data-count]').length+'');
  ck('KINETIC - booking form',!!d.getElementById('kineticform'),'');
  // counters should have been driven by the stubbed IO
  const first=d.querySelector('[data-count]');
  ck('KINETIC - counter animated past 0',first&&first.textContent!=='0','val="'+(first?first.textContent:'')+'"');
}

// AXIS
{
  const {w,d,ran,err}=boot(path.join(ROOT,'08-axis-ortho/index.html'));
  ck('AXIS - scripts execute',ran>0&&!err,err||ran+' script(s)');
  const regions=d.querySelectorAll('.region');
  ck('AXIS - interactive regions present',regions.length>=5,regions.length+' regions');
  const roTitle=d.getElementById('ro-title');
  const roPart=d.getElementById('ro-part');
  ck('AXIS - readout starts empty',/Select a region/i.test(roTitle.textContent),'');
  // click the spine region
  const spine=d.querySelector('.region[data-region="spine"]');
  if(spine){
    spine.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
    ck('AXIS - clicking spine updates readout',
       /Spine/i.test(roTitle.textContent)&&/REGION 01/i.test(roPart.textContent),
       'title="'+roTitle.textContent.trim()+'" part="'+roPart.textContent.trim()+'"');
    ck('AXIS - spine marks itself active',spine.classList.contains('on'),'');
    const specs=d.getElementById('ro-specs');
    ck('AXIS - spec table populated',specs&&specs.querySelectorAll('div').length>=4,
       specs?specs.querySelectorAll('div').length+' specs':'');
  }
  // click knee
  const knee=d.querySelector('.region[data-region="knee"]');
  if(knee){
    knee.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
    ck('AXIS - switching region updates readout',/Knee/i.test(roTitle.textContent),
       'title="'+roTitle.textContent.trim()+'"');
    ck('AXIS - previous region deselected',!spine.classList.contains('on'),'');
  }
  ck('AXIS - outcome bars present',d.querySelectorAll('.bar[data-w]').length===6,
     d.querySelectorAll('.bar[data-w]').length+'');
  ck('AXIS - procedure datasheets',d.querySelectorAll('.sheet-row').length===5,
     d.querySelectorAll('.sheet-row').length+'');
  ck('AXIS - booking form',!!d.getElementById('axisform'),'');
}

console.log('\n=== KINETIC + AXIS FUNCTIONAL ===');
let pass=0;
for(const r of out){console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:''));if(r.ok)pass++;}
console.log('\n'+pass+'/'+out.length+' passed');
