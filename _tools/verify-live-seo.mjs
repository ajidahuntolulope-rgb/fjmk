const base = new URL(process.env.SEO_BASE_URL || "https://fjmk.drtolu.com");

function decodeXml(value) {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&apos;/g, "'");
}

async function fetchText(url, options = {}) {
  const response = await fetch(url, {
    redirect: "manual",
    signal: AbortSignal.timeout(15000),
    headers: { "User-Agent": "FJMK-SEO-Monitor/1.0" },
    ...options
  });
  return { response, text: await response.text() };
}

const robots = await fetchText(new URL("/robots.txt", base));
if (!robots.response.ok) throw new Error(`/robots.txt returned HTTP ${robots.response.status}`);
if (!robots.text.includes(new URL("/sitemap.xml", base).href)) {
  throw new Error("robots.txt does not identify the canonical sitemap URL");
}

const sitemap = await fetchText(new URL("/sitemap.xml", base));
if (!sitemap.response.ok) throw new Error(`/sitemap.xml returned HTTP ${sitemap.response.status}`);
const urls = [...sitemap.text.matchAll(/<loc>\s*([^<]+?)\s*<\/loc>/gi)]
  .map(match => decodeXml(match[1].trim()));
if (!urls.length) throw new Error("The sitemap contains no URLs");
if (new Set(urls).size !== urls.length) throw new Error("The sitemap contains duplicate URLs");

const parsed = urls.map(value => new URL(value));
if (parsed.some(url => url.origin !== base.origin)) {
  throw new Error("The sitemap contains a URL outside the production origin");
}
if (parsed.some(url => /\/journal(?:\/|$)/i.test(url.pathname))) {
  throw new Error("The sitemap includes a parked legacy /journal/ URL");
}

const failures = [];
let next = 0;
async function worker() {
  while (next < urls.length) {
    const index = next++;
    const url = urls[index];
    try {
      const { response, text } = await fetchText(url);
      if (response.status !== 200) {
        failures.push(`${url} returned HTTP ${response.status}`);
        continue;
      }
      const title = text.match(/<title\b[^>]*>(.*?)<\/title>/i)?.[1]?.trim();
      if (!title) failures.push(`${url} has no title element`);
      const canonicalTag = [...text.matchAll(/<link\b[^>]*>/gi)]
        .map(match => match[0])
        .find(tag => /\brel\s*=\s*["']canonical["']/i.test(tag));
      const canonical = canonicalTag?.match(/\bhref\s*=\s*["']([^"']+)["']/i)?.[1];
      if (canonical !== url) failures.push(`${url} has canonical ${canonical || "<missing>"}`);
      const robotsMeta = [...text.matchAll(/<meta\b[^>]*>/gi)]
        .map(match => match[0])
        .find(tag => /\bname\s*=\s*["']robots["']/i.test(tag));
      const robotsContent = robotsMeta?.match(/\bcontent\s*=\s*["']([^"']*)["']/i)?.[1] || "";
      if (/\bnoindex\b/i.test(robotsContent)) failures.push(`${url} is marked noindex`);
    } catch (error) {
      failures.push(`${url} failed: ${error.message}`);
    }
  }
}

await Promise.all(Array.from({ length: Math.min(4, urls.length) }, () => worker()));
if (failures.length) {
  for (const failure of failures) console.error(failure);
  throw new Error(`${failures.length} live SEO check(s) failed`);
}
console.log(`Live SEO check passed for ${urls.length} sitemap URLs at ${base.origin}.`);
