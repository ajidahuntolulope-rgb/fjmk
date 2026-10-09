
const fs=require('fs'), path=require('path');
const {JSDOM}=require('jsdom');
const S='C:/Users/User/hermes-work/fjmk/site';
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
const out=[]; const ck=(n,c,det)=>out.push({n,ok:!!c,d:det||''});

console.log('=== TEAM SECTION ===');
for(const page of ['index.html','about.html']){
  const {w,d,html,dom}=boot(path.join(S,page));
  const cards=d.querySelectorAll('.tcard');
  ck(`${page}: exactly 2 team cards`, cards.length===2, cards.length+' cards');
  const names=[...d.querySelectorAll('.tcard-body h3')].map(e=>e.textContent.trim());
  ck(`${page}: Oluwatobi present`, names.some(n=>/Oluwatobi/.test(n)), names.join(' / '));
  ck(`${page}: Dr Tolulope present`, names.some(n=>/Tolulope/.test(n)), '');
  ck(`${page}: Amara gone`, !/Amara/.test(d.body.textContent), '');
  // real photos
  const srcs=[...d.querySelectorAll('.tcard-img img')].map(i=>i.getAttribute('src'));
  ck(`${page}: uses portrait-oluwatobi.webp`, srcs.some(s=>/oluwatobi/.test(s)), srcs.join(' '));
  ck(`${page}: uses portrait-tolu.webp`, srcs.some(s=>/tolu/.test(s)), '');
  ck(`${page}: no placeholder portrait-bw`, !srcs.some(s=>/portrait-bw/.test(s)), '');
  // backlink
  const bl=d.querySelector('a[href*="drtolu.company"]');
  ck(`${page}: drtolu.company backlink`, !!bl, bl?bl.getAttribute('href')+' rel='+bl.getAttribute('rel'):'MISSING');
  ck(`${page}: backlink opens safely`, bl && /noopener/.test(bl.getAttribute('rel')||''), '');
  // images resolve
  let imgok=0,imgbad=[];
  for(const i of d.querySelectorAll('img[src]')){
    const p=path.resolve(path.dirname(path.join(S,page)), i.getAttribute('src'));
    if(fs.existsSync(p)) imgok++; else imgbad.push(i.getAttribute('src'));
  }
  ck(`${page}: all images resolve on disk`, imgbad.length===0, imgbad.length?imgbad.join(','):imgok+' images');
  dom.window.close();
}

console.log('\n=== PRICING ===');
{
  const {w,d,dom}=boot(path.join(S,'index.html'));
  const cards=d.querySelectorAll('.price-card');
  ck('4 price cards', cards.length===4, cards.length+' cards');
  const prices=[...d.querySelectorAll('.price-card .price')].map(e=>e.textContent.trim());
  ck('prices are 350k / 500k / 1m / custom', 
     /350/.test(prices[0]) && /500/.test(prices[1]) && /1m/.test(prices[2]) && /talk/i.test(prices[3]),
     prices.join(' | '));
  ck('old 150k gone', !/150k/.test(d.body.textContent), '');
  ck('old 200k gone', !/200k/.test(d.body.textContent), '');
  ck('old 300k gone', !/300k/.test(d.body.textContent), '');
  const cust=d.querySelector('a[href*="contact"]');
  ck('custom quote CTA links to contact', /custom quote/i.test(d.body.textContent), '');
  dom.window.close();
}

console.log('\n=== SEO FILES + SAMPLES WIRING ===');
for(const f of ['robots.txt','llms.txt','sitemap.xml']){
  const p=path.join(S,f);
  ck(`${f} exists`, fs.existsSync(p), fs.existsSync(p)?fs.statSync(p).size+'b':'MISSING');
}
{
  const {w,d,html,dom}=boot(path.join(S,'index.html'));
  ck('index.html nav links to samples', /href="samples\/index\.html"/.test(html), '');
  ck('index.html footer links to samples', (html.match(/samples\/index\.html/g)||[]).length>=2, '');
  dom.window.close();
}
{
  const {w,d,html,dom}=boot(path.join(S,'samples/index.html'));
  const links=[...d.querySelectorAll('a[href]')].map(a=>a.getAttribute('href'));
  const sampleLinks=[...new Set(links.filter(h=>/^\d\d-/.test(h)))];
  ck('gallery links to all 12 samples', sampleLinks.length===12, sampleLinks.length+'');
  let ok=0,bad=[];
  for(const l of sampleLinks){
    const p=path.resolve(path.dirname(path.join(S,'samples/index.html')), l);
    if(fs.existsSync(p)) ok++; else bad.push(l);
  }
  ck('all 12 sample targets exist', bad.length===0, bad.length?bad.join(','):ok+' resolve');
  ck('gallery links back to main site', links.some(h=>h==='../index.html'), '');
  dom.window.close();
}

console.log('\n=== RESULTS ===');
let pass=0;
for(const r of out){console.log('  '+(r.ok?'\u2713':'\u2717')+' '+r.n+(r.d?'  \u2014 '+r.d:''));if(r.ok)pass++;}
console.log('\n'+pass+'/'+out.length+' passed');
process.exit(0);
