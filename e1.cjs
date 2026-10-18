const fs = require('fs');
const path = require('path');

const ROOT = '.';
let fails = 0;

function edit(file, pairs) {
  const p = path.join(ROOT, file);
  let html = fs.readFileSync(p, 'utf8');
  for (const [oldS, newS, label] of pairs) {
    const n = html.split(oldS).length - 1;
    if (n === 0) { console.log(`MISS (${label}): ${file}`); fails++; continue; }
    html = html.split(oldS).join(newS);
    console.log(`ok  (${label}) x${n}: ${file}`);
  }
  fs.writeFileSync(p, html, 'utf8');
}

/* ---------- 1. Work-card SVG site mockups ---------- */
function workSvg(name, slug, accent) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1376 768" role="img" aria-labelledby="t">
<title id="t">${name} — website preview</title>
<rect width="1376" height="768" fill="#F4EFE7"/>
<rect width="1376" height="64" fill="#FFFFFF"/>
<circle cx="36" cy="32" r="7" fill="#E76B62"/><circle cx="62" cy="32" r="7" fill="#E8B24C"/><circle cx="88" cy="32" r="7" fill="#5FA85C"/>
<text x="122" y="38" font-family="Helvetica, Arial, sans-serif" font-size="19" letter-spacing="1" fill="#8A8175">fjmk.build/${slug}</text>
<rect x="0" y="64" width="1376" height="56" fill="#FFFDF8"/>
<rect x="64" y="84" width="150" height="16" rx="2" fill="#181614"/>
<rect x="1230" y="78" width="82" height="26" rx="2" fill="#181614"/>
<rect x="64" y="170" width="700" height="54" rx="3" fill="#181614"/>
<rect x="64" y="236" width="460" height="26" rx="3" fill="${accent}"/>
<rect x="64" y="274" width="640" height="14" rx="3" fill="#D8D0C0"/>
<rect x="64" y="298" width="600" height="14" rx="3" fill="#D8D0C0"/>
<rect x="64" y="322" width="560" height="14" rx="3" fill="#D8D0C0"/>
<rect x="64" y="372" width="200" height="48" rx="2" fill="${accent}"/>
<rect x="788" y="170" width="524" height="360" rx="4" fill="${accent}" opacity="0.16"/>
<rect x="788" y="170" width="524" height="360" rx="4" fill="none" stroke="${accent}" stroke-opacity="0.5"/>
<rect x="820" y="200" width="460" height="92" rx="3" fill="${accent}" opacity="0.45"/>
<rect x="820" y="310" width="330" height="16" rx="3" fill="#181614"/>
<rect x="820" y="338" width="420" height="12" rx="3" fill="#C9C0AC"/>
<rect x="820" y="360" width="400" height="12" rx="3" fill="#C9C0AC"/>
<rect x="64" y="470" width="620" height="16" rx="3" fill="#181614"/>
<rect x="64" y="498" width="700" height="12" rx="3" fill="#C9C0AC"/>
<rect x="64" y="520" width="660" height="12" rx="3" fill="#C9C0AC"/>
<rect x="64" y="600" width="1248" height="120" rx="4" fill="#FFFFFF" stroke="#E6DFD0"/>
<rect x="1100" y="640" width="120" height="40" rx="2" fill="#181614"/>
</svg>`;
}

const WORK = [
  { name: 'Ikeja Dental Studio', slug: 'ikeja-dental', accent: '#A9573F' },
  { name: 'Shomolu Family Clinic', slug: 'shomolu-family', accent: '#5F7F4E' },
  { name: 'Meridian Diagnostics', slug: 'meridian-diagnostics', accent: '#3E68B0' },
  { name: "Lekki Fertility & Women's", slug: 'lekki-fertility', accent: '#8A5B7E' },
];
for (const w of WORK) {
  fs.writeFileSync(path.join(ROOT, `assets/img/work/${w.slug}.svg`), workSvg(w.name, w.slug, w.accent), 'utf8');
}
console.log('wrote 4 work SVGs');

/* ---------- 2. Brand assets copied are already in place; favicons to pages ---------- */
for (const f of ['index.html', 'about.html', 'blog.html', 'contact.html']) {
  const p = path.join(ROOT, f);
  let html = fs.readFileSync(p, 'utf8');
  if (!html.includes('brand/favicon.png')) {
    html = html.replace(
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>',
      '<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>\n<link rel="icon" type="image/png" href="assets/img/brand/favicon.png">\n<link rel="apple-touch-icon" href="assets/img/brand/favicon.png">'
    );
    fs.writeFileSync(p, html, 'utf8');
    console.log('favicon added:', f);
  } else { console.log('favicon already present:', f); }
}

/* ---------- 3. index.html content edits ---------- */
edit('index.html', [
  // Hero tagline (his words, verbatim)
  [`<h1 class="d1">We fill<br>your <em>schedule.</em></h1>`,
   `<h1 class="d1">Your patients<br>deserve to <em>find you.</em></h1>`, 'tagline'],

  // Hero figure: real build instead of the placeholder photo
  [`        <img src="assets/img/hero-walk.webp"
             alt="A woman in cream linen and rust trousers walking past a weathered plaster wall"
             width="720" height="601" fetchpriority="high">`,
   `        <img src="assets/img/design/01-lumen-eye.jpg"
             alt="Lumen Eye Institute — a clinic website designed and built by FJMK"
             width="800" height="500" fetchpriority="high">`, 'hero img'],
  [`          <span class="mono">Fig. 01</span>
          <span class="mono n">Lagos / NG</span>`,
   `          <span class="mono">Fig. 01</span>
          <span class="mono n">Lumen Eye · Lagos</span>`, 'hero caption'],

  // Problem figure: another real build
  [`        <img src="assets/img/still-life.webp"
             alt="A quiet sunlit threshold: weathered plaster, a glazed doorway, linen and warm wood"
             width="1344" height="768" loading="lazy">`,
   `        <img src="assets/img/design/05-maison-aesthetics.jpg"
             alt="Maison Aesthetics — a clinic website designed and built by FJMK"
             width="800" height="500" loading="lazy">`, 'problem img'],

  // Four stages: numbers -> brand icons
  [`<span class="n">01</span>`,
   `<span class="n"><img src="assets/img/brand/fjmk-icon-attract.svg" alt="" width="20" height="20" style="display:block"></span>`, 'icon attract'],
  [`<span class="n">02</span>`,
   `<span class="n"><img src="assets/img/brand/fjmk-icon-convert.svg" alt="" width="20" height="20" style="display:block"></span>`, 'icon convert'],
  [`<span class="n">03</span>`,
   `<span class="n"><img src="assets/img/brand/fjmk-icon-book.svg" alt="" width="20" height="20" style="display:block"></span>`, 'icon book'],
  [`<span class="n">04</span>`,
   `<span class="n"><img src="assets/img/brand/fjmk-icon-return.svg" alt="" width="20" height="20" style="display:block"></span>`, 'icon return'],

  // Work cards: placeholder textures -> tailored site-mock SVGs
  [`          <img src="assets/img/stationery.webp"
               alt="Studio flat-lay of printed ledger sheets, a brass plate and matte black packaging"
               width="1376" height="768" loading="lazy">`,
   `          <img src="assets/img/work/ikeja-dental.svg"
               alt="Ikeja Dental Studio — website preview"
               width="1376" height="768" loading="lazy">`, 'work dental'],
  [`          <img src="assets/img/editorial-street.webp"
               alt="A woman in a cream knit cardigan leaning against a weathered shutter"
               width="1152" height="2048" loading="lazy">`,
   `          <img src="assets/img/work/shomolu-family.svg"
               alt="Shomolu Family Clinic — website preview"
               width="1376" height="768" loading="lazy">`, 'work family'],
  [`          <img src="assets/img/pattern-grid.webp"
               alt="A grid of 2x2 cell motifs in bone white and brass on a dark ground"
               width="1376" height="768" loading="lazy">`,
   `          <img src="assets/img/work/meridian-diagnostics.svg"
               alt="Meridian Diagnostics — website preview"
               width="1376" height="768" loading="lazy">`, 'work diagnostics'],
  [`          <img src="assets/img/texture-terracotta.webp"
               alt="Terracotta linen cloth in soft folds, lit from the left"
               width="1152" height="1024" loading="lazy">`,
   `          <img src="assets/img/work/lekki-fertility.svg"
               alt="Lekki Fertility & Women's — website preview"
               width="1376" height="768" loading="lazy">`, 'work specialist'],

  // Nav + footer brand: text -> logo
  [`<a href="#top" class="brand"><b>FJMK</b><i>.</i></a>`,
   `<a href="#top" class="brand"><img src="assets/img/brand/fjmk-logo.svg" alt="FJMK — Websites for clinics" width="132" height="45"></a>`, 'brand logo'],

  // Redundant copy trim in the patient-education section
  [`<p class="small" style="margin-top:20px;max-width:52ch">This is not a blog
          and it is not the journal above. It is a working asset that ships inside
          your site: 169 reviewed articles across nine clinical categories, with
          four included in a Growth build.</p>`,
   `<p class="small" style="margin-top:20px;max-width:52ch">It is a working asset
          that ships inside your site: 169 reviewed articles across nine clinical
          categories, with four included in a Growth build.</p>`, 'copy trim'],
]);

/* ---------- 4. Remove the whole Studio/team section ---------- */
{
  const p = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  const start = html.indexOf('<!-- ============ TEAM ============ -->');
  const end = html.indexOf('<!-- ============ JOURNAL');
  if (start !== -1 && end !== -1 && end > start) {
    html = html.slice(0, start) + html.slice(end);
    fs.writeFileSync(p, html, 'utf8');
    console.log('ok  (team section removed)');
  } else {
    console.log('MISS (team section boundaries):', start, end);
    fails++;
  }
}

/* ---------- 5. Logo CSS ---------- */
{
  const p = path.join(ROOT, 'index.html');
  let html = fs.readFileSync(p, 'utf8');
  if (!html.includes('.brand img')) {
    html = html.replace(
      '.brand i{color:var(--terra);font-style:normal}',
      '.brand i{color:var(--terra);font-style:normal}\n.brand img{display:block;height:30px;width:auto}'
    );
    fs.writeFileSync(p, html, 'utf8');
    console.log('ok  (brand img css)');
  }
}

console.log(fails === 0 ? '\nALL EDITS APPLIED' : `\n${fails} MISSES — fix manually`);