// Design-diversity enforcement for the sample collection.
// Fails if any two sites share a font pairing, or share 3+ palette colours.
//
//   node diversity_check.js
//
// Exit 0 = every site is visually distinct.
const fs = require('fs');
const path = require('path');

const ROOT = 'C:/Users/User/hermes-work/fjmk/samples';

// colours that carry no identity — every site may use them
const UNIVERSAL = new Set([
  '#ffffff', '#fff', '#000000', '#000',
  '#1a1a1a', '#0a0a0a', '#111111', '#fafafa', '#f5f5f5'
]);

function walk(dir, out = []) {
  for (const e of fs.readdirSync(dir, { withFileTypes: true })) {
    const p = path.join(dir, e.name);
    if (e.isDirectory()) walk(p, out);
    else out.push(p);
  }
  return out;
}

const sites = fs.readdirSync(ROOT, { withFileTypes: true })
  .filter(e => e.isDirectory() && !e.name.startsWith('_'))
  .map(e => e.name)
  .sort();

const info = {};

for (const site of sites) {
  const dir = path.join(ROOT, site);
  const files = walk(dir).filter(f => /\.(html|css)$/.test(f));
  if (!files.length) continue;

  let text = '';
  for (const f of files) text += fs.readFileSync(f, 'utf8');

  const fonts = [...new Set([...text.matchAll(/family=([A-Za-z+0-9]+)/g)].map(m => m[1]))]
    .sort();

  const colours = new Set(
    [...text.matchAll(/#[0-9a-fA-F]{6}/g)]
      .map(m => m[0].toLowerCase())
      .filter(c => !UNIVERSAL.has(c))
  );

  if (fonts.length) info[site] = { fonts, colours };
}

const names = Object.keys(info);
let fail = 0;

console.log('\n=== FONT PAIRINGS ===');
for (const n of names) {
  console.log(`  ${n.padEnd(28)} ${info[n].fonts.join(' + ')}`);
}

console.log('\n=== FONT COLLISIONS ===');
let fontCollision = 0;
for (let i = 0; i < names.length; i++) {
  for (let j = i + 1; j < names.length; j++) {
    const a = info[names[i]].fonts, b = info[names[j]].fonts;
    // a collision is identical sets, or one containing the other entirely
    const same = a.length === b.length && a.every(f => b.includes(f));
    const subset = a.every(f => b.includes(f)) || b.every(f => a.includes(f));
    if (same || subset) {
      console.log(`  ✗ ${names[i]}  ~  ${names[j]}   (${a.join(',')})`);
      fontCollision++;
    }
  }
}
if (!fontCollision) console.log('  ✓ none — every pairing is unique');
else fail++;

console.log('\n=== PALETTE COLLISIONS (3+ shared non-universal colours) ===');
let palCollision = 0;
for (let i = 0; i < names.length; i++) {
  for (let j = i + 1; j < names.length; j++) {
    const a = info[names[i]].colours, b = info[names[j]].colours;
    const shared = [...a].filter(c => b.has(c));
    if (shared.length >= 3) {
      console.log(`  ✗ ${names[i]}  ~  ${names[j]}   ${shared.length} shared: ${shared.join(' ')}`);
      palCollision++;
    }
  }
}
if (!palCollision) console.log('  ✓ none — every palette is distinct');
else fail++;

console.log(`\n${names.length} sites checked — ${fail ? 'FAILED' : 'all distinct'}`);
process.exit(fail ? 1 : 0);
