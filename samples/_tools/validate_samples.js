// Validate every sample site: JS syntax, tag balance, links, IDs, alt text.
const fs = require('fs');
const path = require('path');
const vm = require('vm');

const ROOT = process.argv[2] || 'C:/Users/User/hermes-work/fjmk/samples';
const VOID = new Set(['area','base','br','col','embed','hr','img','input','link','meta',
  'param','source','track','wbr']);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else if (e.name.endsWith('.html')) out.push(p);
  }
  return out;
}

let fail = 0, pass = 0;
const bySite = {};

for (const p of walk(ROOT)) {
  const site = path.relative(ROOT, p).split(path.sep)[0];
  if (site.startsWith('_')) continue;
  const rel = path.relative(ROOT, p).replace(/\\/g, '/');
  const html = fs.readFileSync(p, 'utf8');
  const problems = [];

  // 1. inline JS syntax
  [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)]
    .forEach((m, i) => {
      if (!m[1].trim()) return;
      try { new vm.Script(m[1]); }
      catch (e) { problems.push(`JS error (inline #${i+1}): ${e.message}`); }
    });

  // 1b. external JS syntax
  [...html.matchAll(/<script[^>]*\bsrc="([^"]+)"/gi)].forEach(m => {
    const src = m[1];
    if (/^https?:/.test(src)) return;
    const f = path.resolve(path.dirname(p), src);
    if (!fs.existsSync(f)) { problems.push(`missing script ${src}`); return; }
    try { new vm.Script(fs.readFileSync(f, 'utf8')); }
    catch (e) { problems.push(`JS error in ${src}: ${e.message}`); }
  });

  // 2. tag balance
  const body = html.slice(Math.max(0, html.indexOf('<body')));
  for (const t of ['div','section','article','aside','main','header','footer','form',
                   'ul','ol','li','figure','nav','span','a','button','h1','h2','h3','p']) {
    if (VOID.has(t)) continue;
    const open = (body.match(new RegExp(`<${t}\\b`, 'gi')) || []).length;
    const close = (body.match(new RegExp(`</${t}>`, 'gi')) || []).length;
    if (open !== close) problems.push(`tag imbalance <${t}>: ${open}/${close}`);
  }

  // 3. links resolve — scan MARKUP only; script bodies contain template
  //    strings that look like hrefs and produce false positives.
  const markup = html.replace(/<script[\s\S]*?<\/script>/gi, '');
  for (const m of markup.matchAll(/(?:href|src)="([^"#][^"]*)"/gi)) {
    const u = m[1];
    if (/^(https?:|mailto:|tel:|data:|\/\/|#)/.test(u)) continue;
    const tgt = path.resolve(path.dirname(p), u.split('#')[0].split('?')[0]);
    if (!fs.existsSync(tgt)) problems.push(`broken link ${u}`);
  }

  // 4. in-page anchors
  const ids = new Set([...markup.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]));
  for (const m of markup.matchAll(/href="#([^"]+)"/g)) {
    if (!ids.has(m[1])) problems.push(`dangling anchor #${m[1]}`);
  }

  // 5. duplicate ids
  const idList = [...html.matchAll(/\bid="([^"]+)"/g)].map(m => m[1]);
  const dupes = [...new Set(idList.filter((v, i) => idList.indexOf(v) !== i))];
  if (dupes.length) problems.push(`duplicate id: ${dupes.join(', ')}`);

  // 6. img alt
  const noAlt = [...html.matchAll(/<img\b[^>]*>/gi)].filter(t => !/\balt=/.test(t[0]));
  if (noAlt.length) problems.push(`${noAlt.length} img without alt`);

  // 7. basics
  if (!/<title>/i.test(html)) problems.push('no <title>');
  if (!/name="viewport"/i.test(html)) problems.push('no viewport meta');

  bySite[site] = bySite[site] || {ok: 0, bad: 0};
  if (problems.length) {
    fail++; bySite[site].bad++;
    console.log(`\n✗ ${rel}`);
    problems.slice(0, 8).forEach(pr => console.log(`    - ${pr}`));
  } else {
    pass++; bySite[site].ok++;
  }
}

console.log('\n=== BY SITE ===');
for (const [s, c] of Object.entries(bySite).sort()) {
  console.log(`  ${c.bad ? '✗' : '✓'} ${s.padEnd(30)} ${c.ok} ok${c.bad ? `, ${c.bad} with issues` : ''}`);
}
console.log(`\n${pass}/${pass + fail} pages clean`);
