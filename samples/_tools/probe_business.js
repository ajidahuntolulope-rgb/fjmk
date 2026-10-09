
const fs=require('fs'), path=require('path');
const {JSDOM}=require('jsdom');
const B='C:/Users/User/hermes-work/fjmk';
function boot(f){
  const html=fs.readFileSync(f,'utf8');
  const dom=new JSDOM(html,{runScripts:'outside-only',pretendToBeVisual:true,
    url:'file:///'+f.replace(/\\/g,'/'),
    beforeParse(w){
      w.IntersectionObserver=class{constructor(cb){this.cb=cb}observe(e){this.cb([{isIntersecting:true,target:e}],this)}unobserve(){}disconnect(){}};
      w.matchMedia=w.matchMedia||(()=>({matches:false,addEventListener(){},removeEventListener(){},addListener(){},removeListener(){}}));
      w.scrollTo=()=>{}; w.alert=()=>{}; w.open=()=>({});
      w.requestAnimationFrame=(fn)=>setTimeout(()=>fn(w.performance.now()),16);
      w.setInterval=()=>0; w.clearInterval=()=>{};
    }});
  const w=dom.window;
  for(const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
    if(m[1].trim()) try{ w.eval(m[1]); }catch(e){}
  }
  w.document.dispatchEvent(new w.Event('DOMContentLoaded',{bubbles:true}));
  return {w,d:w.document,html,dom};
}

console.log('=== AGENCY SITE: CONTACT FLOW ===');
{
  const {w,d,html,dom}=boot(path.join(B,'site/contact.html'));
  // walk the 3-step flow
  const steps=[...d.querySelectorAll('[class*="opt"],[data-step],[class*="choice"]')];
  console.log('  choice buttons found:', steps.length);
  console.log('  WA number in JS:', /2348145580220/.test(html));
  console.log('  builds wa.me url in JS:', /wa\.me/.test(html));
  console.log('  pre-fills message:', /encodeURIComponent/.test(html));
  // click first choice if present
  const first=d.querySelector('[class*="opt"],[data-step]');
  if(first){
    first.dispatchEvent(new w.MouseEvent('click',{bubbles:true}));
    console.log('  after clicking a choice, page has next-step marker:',
      /step|next|q2/i.test(d.body.innerHTML));
  }
  console.log('  contact form exists:', !!d.querySelector('form'));
  dom.window.close();
}

console.log('\n=== SAMPLES GALLERY ===');
{
  const f=path.join(B,'samples/index.html');
  const {w,d,html,dom}=boot(f);
  const links=[...d.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'));
  const sampleLinks=links.filter(h=>/0\d-|1\d-/.test(h));
  console.log('  links to sample sites:', sampleLinks.length);
  console.log('  sample dirs referenced:', new Set(sampleLinks.map(h=>h.split('/')[0])).size);
  // do the targets exist on disk?
  let ok=0, missing=[];
  for(const h of new Set(sampleLinks)){
    const p=path.resolve(path.dirname(f),h);
    if(fs.existsSync(p)) ok++; else missing.push(h);
  }
  console.log('  link targets that exist on disk:', ok);
  console.log('  broken:', missing.length? missing : 'none');
  dom.window.close();
}
process.exit(0);
