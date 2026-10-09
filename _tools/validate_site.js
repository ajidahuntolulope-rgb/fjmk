// Static validation of the FJMK site: JS syntax, tag balance, anchor targets,
// duplicate IDs, and required nav wiring.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const SITE = 'C:/Users/User/hermes-work/fjmk/site';

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta',
  'param','source','track','wbr']);

let fail = 0;
const pages = walk(SITE);

for (const p of pages) {
  const rel = path.relative(SITE, p).replace(/\\/g, '/');
  const html = fs.readFileSync(p, 'utf8');
  const problems = [];

  // ---- 1. JS syntax ----
  const scripts = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script>/gi)];
  scripts.forEach((m, i) => {
    try { new vm.Script(m[1]); }
    catch (e) { problems.push(`JS syntax error in script #${i + 1}: ${e.message}`); }
  });

  // ---- 2. Tag balance for block elements ----
  const body = html.slice(html.indexOf('<body'));
  for (const tag of ['div', 'section', 'article', 'aside', 'main', 'header', 'footer', 'form', 'ul', 'ol', 'li', 'figure', 'nav']) {
    if (VOID.has(tag)) continue;
    const open = (body.match(new RegExp(`<${tag}\\b`, 'gi')) || []).length;
    const close = (body.match(new RegExp(`</${tag}>`, 'gi')) || []).length;
    if (open !== close) problems.push(`tag imbalance <${tag}>: ${open} open / ${close} close`);
  }

  // ---- 3. In-page anchors resolve ----
  const ids = new Set([...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const m of html.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.has(m[1])) problems.push(`dangling anchor href="#${m[1]}"`);
  }

  // ---- 4. Duplicate IDs ----
  const idList = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  const dupes = idList.filter((v, i) => idList.indexOf(v) !== i);
  if (dupes.length) problems.push(`duplicate id(s): ${[...new Set(dupes)].join(', ')}`);

  // ---- 5. Images have alt ----
  const imgs = [...html.matchAll(/<img\b[^>]*>/gi)];
  const noAlt = imgs.filter(t => !/\balt=/.test(t[0]));
  if (noAlt.length) problems.push(`${noAlt.length} <img> without alt`);

  // ---- 6. Required nav present ----
  // Inner pages (journal, work) legitimately use a back-link nav instead.
  if (!/class="navlinks"/.test(html) && !/class="back"/.test(html)) {
    problems.push('no navigation (neither .navlinks nor .back)');
  }
  if (!/<footer/.test(html)) problems.push('no <footer>');

  // ---- 7. Meta ----
  if (!/<meta\s+name="viewport"/i.test(html)) problems.push('no viewport meta');
  if (!/<title>/i.test(html)) problems.push('no <title>');

  // ---- 8. Agency contact details must not leak onto the site ----
  if (/hello@fjmk\.agency/.test(html)) problems.push('still contains hello@fjmk.agency');

  // ---- 9. Email must never be rendered in markup (script only) ----
  const markupOnly = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  if (/hopequasher/i.test(markupOnly)) problems.push('inbox address leaks into rendered markup');

  if (problems.length) {
    fail++;
    console.log(`\n✗ ${rel}`);
    for (const pr of problems) console.log(`    - ${pr}`);
  } else {
    console.log(`✓ ${rel}`);
  }
}

console.log(`\n${pages.length - fail}/${pages.length} pages clean`);
process.exit(fail ? 1 : 0);
