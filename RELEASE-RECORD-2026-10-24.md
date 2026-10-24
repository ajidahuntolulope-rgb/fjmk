# FJMK Lagos clinic website article release record

Date: 24 October 2026 (Africa/Lagos)
Site: https://fjmk.drtolu.com
Release commits: `518325a` (article and site integration), `32795b0` (release documentation)

## What shipped

- Added **“How Many Clinics in Lagos Have a Website?”** at `/blog/how-many-lagos-clinics-have-a-website` as the seventh active blog article.
- Added a listing card to `/blog`, a canonical sitemap entry, and a Research-page link to the article.
- Updated `/research` and `/resources` so they no longer advertise a planned 50-site study. Updated the Research page metadata and the generator source so a future build preserves the correction.
- Used the existing FJMK blog layout, fonts, navigation, footer and article styling. Added the quick answer, article byline, canonical and social metadata, BlogPosting and breadcrumb structured data, area results, phone-screen results, internal links, and the audit CTA.
- Set the article author to Dr Tolulope Ajidahun (Physician) in visible copy and BlogPosting data. Kept the article on the FJMK domain.
- Kept evidence framing tied to public-search listings, not a Lagos census or verified count of facilities. The end note is one short section of two sentences. No patient user-testing results are claimed.

## Article figures and scope recorded

- Search-derived patient-facing sample: 388 grouped records from public searches, healthcare directories and search-surfaced map cards, after excluding two pharmaceutical manufacturers from the 390 grouped records.
- Public searches surfaced no website candidate for 316/388 records (81.4%). Three candidate pages passed an automated screen using at least two of provider name, address/nearby landmark and phone cues. Forty-two candidate sites remained unconfirmed.
- Area rates represent the share of grouped search records in each LGA for which a website candidate surfaced. Highest listed rates: Ikeja 28%, Ojo 25%, Surulere 21.7%; Epe 0%; Apapa 3.4%; Lagos Island 4%.
- Phone screen: 47 candidate-page rows rendered in a browser at 390 × 844 pixels, with 10 PASS, 28 PARTIAL and 9 FAIL. Two rows were pharmaceutical manufacturer sites. The check covered viewport setting, horizontal scrolling, text size, oversized images and tap-target size; it was not human usability testing.
- These figures do not establish that a provider has no website or that a candidate page belongs to that provider. The automated identity screen did not confirm ownership with clinics.

## Source files changed

- `_tools/lagos-clinic-website-gap-body.html` — durable article body source.
- `_tools/blog-articles.mjs` — article metadata, author and body registration.
- `_tools/build-studio-v1.mjs` — per-article Person authorship support and corrected Research page metadata.
- `_tools/resource-pages.mjs` — Research page now links to the article; Resources card no longer says the review is coming soon.
- `_tools/studio-content.json`, `blog.html`, `blog/how-many-lagos-clinics-have-a-website.html`, `resources.html`, `research.html` — generated site pages and card data.
- `sitemap.xml` — article URL added; 17 canonical URLs total.
- `CHANGELOG.md`, `PROJECT-HANDOFF.md` — release history and current handoff.

## Verification performed

- `node _tools/build-studio-v1.mjs` — generated ten main pages and seven blog articles.
- `node _tools/update-site-indexes.mjs` — generated a 17-URL sitemap.
- `node build.mjs` — completed successfully.
- `node _tools/verify-seo.mjs` — 17 unique sitemap URLs, 33 demo pages marked noindex, no errors.
- `node _tools/check-review-v2.mjs` — 385 references, no errors.
- `node --check _tools/blog-articles.mjs` and `node --check _tools/build-studio-v1.mjs` — passed.
- Browser at 390px verified `/blog/how-many-lagos-clinics-have-a-website`, `/blog` and `/research` with no horizontal overflow. Verified the article’s author, canonical, BlogPosting/BreadcrumbList JSON-LD, blog card, Research link and two-sentence end note.
- After deployment, requests with a browser user-agent returned HTTP 200 for the article, `/blog`, `/research`, `/resources` and `sitemap.xml`. Live source checks confirmed the canonical article URL, the Blog and Research links, 17 sitemap entries, and absence of the stale 50-site copy.

## Git and release status

- `518325a Publish Lagos clinic website findings on blog` — pushed to `main`; source is deployed and live-verified.
- `32795b0 Record live Lagos article release` — release notes pushed to `main`.
- Working tree was `main...origin/main` after release. Six unrelated pre-existing untracked files (`ASSETS.md`, `CLINIC-CHECKUP-EXTERNAL-TEST-LOG-2026-10-23.md`, `DESIGN-NOTES.md`, `_tools/cache-site-fonts.mjs`, `_tools/prepare-motion-library.py`, `_tools/test-clinic-checkup-sample.mjs`) were left untouched and were not included in these commits.
