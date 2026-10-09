
const fs=require('fs'), path=require('path');
const {JSDOM}=require('jsdom');
const ROOT='C:/Users/User/hermes-work/fjmk/samples';
const f=path.join(ROOT,'12-script-pharmacy/index.html');
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
const w=dom.window,d=w.document;
for(const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)){
  if(m[1].trim()) try{ w.eval(m[1]); }catch(e){}
}

// what classes actually hold the rendered products?
const grid=d.querySelector('[class*="grid"],[class*="product"],[id*="product"],[id*="grid"]');
console.log('grid container:', grid ? grid.tagName+' .'+grid.className+' id='+grid.id : 'none');
if(grid){
  console.log('children:', grid.children.length);
  const kids=[...grid.children];
  console.log('first child class:', kids[0] && kids[0].className);
  console.log('first child text:', kids[0] && kids[0].textContent.trim().slice(0,90));
}

// count by any product-ish class across the doc
const all=[...d.querySelectorAll('*')].filter(e=>/product|item|card/i.test(e.className||''));
const byClass={};
for(const e of all){ byClass[e.className]=(byClass[e.className]||0)+1; }
console.log('\nproduct-ish class counts:');
for(const [k,v] of Object.entries(byClass).sort((a,b)=>b[1]-a[1]).slice(0,8)) console.log('  ',v,'x',k);

// prices present?
const prices=[...d.body.textContent.matchAll(/₦\s?([\d,]+)/g)].map(m=>m[1]);
console.log('\ndistinct prices rendered:', new Set(prices).size);
console.log('sample prices:', [...new Set(prices)].slice(0,8));

// test live search actually filters
const si=d.querySelector('input[type="search"],input[class*="search"],#search,input[type="text"]');
if(si){
  const before=(grid?grid.children.length:0);
  si.value='paracetamol';
  si.dispatchEvent(new w.Event('input',{bubbles:true}));
  setTimeout(()=>{
    const after=(grid?grid.children.length:0);
    console.log('\nSEARCH: '+before+' products -> '+after+' after typing "paracetamol"');
    console.log(after>0 && after<before ? '  \u2713 live search filters the grid' : '  \u2717 search did not filter');
    process.exit(0);
  },300);
} else { console.log('no search input found'); process.exit(0); }
