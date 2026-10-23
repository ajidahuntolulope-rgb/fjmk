import fs from 'node:fs';
import path from 'node:path';

// Publish only site assets, never repository files or internal generators.
const output = path.resolve('dist');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output);
for (const entry of ['index.html', 'about.html', 'blog.html', 'contact.html',
  'assets', 'journal', 'work', 'samples', 'robots.txt', 'llms.txt',
  'sitemap.xml', '404.html']) {
  fs.cpSync(entry, path.join(output, entry), { recursive: true });
}
console.log('FJMK static site built in dist/');
