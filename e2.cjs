const fs = require('fs');

const p = 'index.html';
let html = fs.readFileSync(p, 'utf8');
// Normalize CRLF -> LF so multi-line replacements match
html = html.replace(/\r\n/g, '\n');

let fails = 0;
function rep(oldS, newS, label) {
  const n = html.split(oldS).length - 1;
  if (n === 0) { console.log(`MISS (${label})`); fails++; return; }
  html = html.split(oldS).join(newS);
  console.log(`ok  (${label}) x${n}`);
}

rep(
`        <img src="assets/img/hero-walk.webp"
             alt="A woman in cream linen and rust trousers walking past a weathered plaster wall"
             width="720" height="601" fetchpriority="high">`,
`        <img src="assets/img/design/01-lumen-eye.jpg"
             alt="Lumen Eye Institute — a clinic website designed and built by FJMK"
             width="800" height="500" fetchpriority="high">`,
'hero img');

rep(
`          <span class="mono">Fig. 01</span>
          <span class="mono n">Lagos / NG</span>`,
`          <span class="mono">Fig. 01</span>
          <span class="mono n">Lumen Eye · Lagos</span>`,
'hero caption');

rep(
`        <img src="assets/img/still-life.webp"
             alt="A quiet sunlit threshold: weathered plaster, a glazed doorway, linen and warm wood"
             width="1344" height="768" loading="lazy">`,
`        <img src="assets/img/design/05-maison-aesthetics.jpg"
             alt="Maison Aesthetics — a clinic website designed and built by FJMK"
             width="800" height="500" loading="lazy">`,
'problem img');

rep(
`          <img src="assets/img/stationery.webp"
               alt="Studio flat-lay of printed ledger sheets, a brass plate and matte black packaging"
               width="1376" height="768" loading="lazy">`,
`          <img src="assets/img/work/ikeja-dental.svg"
               alt="Ikeja Dental Studio — website preview"
               width="1376" height="768" loading="lazy">`,
'work dental');

rep(
`          <img src="assets/img/editorial-street.webp"
               alt="A woman in a cream knit cardigan leaning against a weathered shutter"
               width="1152" height="2048" loading="lazy">`,
`          <img src="assets/img/work/shomolu-family.svg"
               alt="Shomolu Family Clinic — website preview"
               width="1376" height="768" loading="lazy">`,
'work family');

rep(
`          <img src="assets/img/pattern-grid.webp"
               alt="A grid of 2x2 cell motifs in bone white and brass on a dark ground"
               width="1376" height="768" loading="lazy">`,
`          <img src="assets/img/work/meridian-diagnostics.svg"
               alt="Meridian Diagnostics — website preview"
               width="1376" height="768" loading="lazy">`,
'work diagnostics');

rep(
`          <img src="assets/img/texture-terracotta.webp"
               alt="Terracotta linen cloth in soft folds, lit from the left"
               width="1152" height="1024" loading="lazy">`,
`          <img src="assets/img/work/lekki-fertility.svg"
               alt="Lekki Fertility & Women's — website preview"
               width="1376" height="768" loading="lazy">`,
'work specialist');

rep(
`<p class="small" style="margin-top:20px;max-width:52ch">This is not a blog
          and it is not the journal above. It is a working asset that ships inside
          your site: 169 reviewed articles across nine clinical categories, with
          four included in a Growth build.</p>`,
`<p class="small" style="margin-top:20px;max-width:52ch">It is a working asset
          that ships inside your site: 169 reviewed articles across nine clinical
          categories, with four included in a Growth build.</p>`,
'copy trim');

fs.writeFileSync(p, html, 'utf8');
console.log(fails === 0 ? '\nALL 8 EDITS APPLIED' : `\n${fails} MISSES remaining`);