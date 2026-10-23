import fs from 'node:fs';
import path from 'node:path';

// Publish only site assets, never repository files or internal generators.
const output = path.resolve('dist');
fs.rmSync(output, { recursive: true, force: true });
fs.mkdirSync(output);
for (const entry of ['index.html', 'about.html', 'blog.html', 'resources.html', 'research.html', 'tools.html', 'contact.html', 'portfolio.html', 'services.html', '_redirects',
  'assets', 'journal', 'work', 'samples', 'robots.txt', 'llms.txt',
  'sitemap.xml', '404.html']) {
  fs.cpSync(entry, path.join(output, entry), {
    recursive: true,
    filter: source => !path.basename(source).startsWith('.') && !source.endsWith('.md') &&
      !(source.includes(path.join('assets','previews') + path.sep) && /\.(png|jpg)$/.test(source)),
  });
}
console.log('FJMK static site built in dist/');
