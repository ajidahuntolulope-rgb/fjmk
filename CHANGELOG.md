# Changelog

## 23 October 2026

- Split FJMK from the personal portfolio into its own repo and Cloudflare Pages
  site. Retained concept sites and deep redirects.
- Copied source brand assets, videos and licensed fonts into a local-only library;
  optimised selected production assets. Main fonts and videos are self-hosted.
- Rebuilt Home, Portfolio, Services, Resources, Blog, Research, Tools, About and
  Contact. Added real concept previews, fan gallery and irregular portfolio grid.
- Iterated About using user references, preserving approved copy and three-person
  team. Rejected generated face removed; Praise's portrait circle left empty.
- Built three-step enquiry flow with email delivery integration and WhatsApp.
- Added Resources with curated blog, upcoming research and clearly labelled audit
  demo. No invented findings or benchmark rankings.
- Curated nine motion films, renamed them, removed hospital walkthrough from Git,
  added continuously moving framed board, fullscreen dialog and autoplay hero.
- Added cache-versioned CSS/JS and a sharp dental preview.
- Added root AGENTS.md and PROJECT-HANDOFF.md for continuity across agents.
- Added privacy notice and footer contact/privacy links, strengthened truthful
  structured data, simplified robots.txt and regenerated the canonical sitemap.
- Marked fictional demo sites noindex,follow and excluded them from the sitemap.
- Submitted the current subdomain sitemap in Search Console; Google processed it
  successfully and discovered 16 URLs. The homepage live test passed, but the
  homepage indexing request failed: Search Console could not connect to its
  reCAPTCHA service and showed a "try again later" error.
- Found 16 live, self-canonical legacy article pages outside the sitemap, including
  eight with no internal links. No indexability changes were made pending review.
- Ran `node _tools/verify-seo.mjs`; all 16 sitemap URLs and 33 noindex demo pages
  passed the project checker.

### SEO follow-up

- Updated the Search Console record: a later user-supplied screenshot confirms the
  homepage indexing request was added to Google's priority crawl queue. The URL
  still showed "URL is not on Google" in that screenshot, so indexing is not
  confirmed. Do not repeat the same request.
- Rechecked Search Console directly: the sitemap is still Success with 16
  discovered URLs. The Performance report filtered to the FJMK hostname shows 0
  clicks and 0 impressions for its available dates, 17-21 October; Core Web
  Vitals still has no field data.
- The user confirmed the legacy articles outside the 16-URL sitemap are parked;
  they remain outside this SEO scope.
- Replaced generic titles on the ten main pages with unique, descriptive titles
  aligned to each page and FJMK's healthcare focus. No visible copy or design
  changed.
- Changed internal links in the six selected journal articles from `.html`
  variants to clean routes. The parked article destinations were not edited.
- Added `SEO-PLAN.md` with the current baseline, source assessment and prioritized
  Search Console, content and distribution plan.
- Rebuilt the static site. `node _tools/verify-seo.mjs` passed with 16 unique
  sitemap URLs and 33 noindex demo pages; `node _tools/check-review-v2.mjs`
  passed with 382 references and no errors.

Refer to Git history for exact implementation and release commits. Historical
notes are not permission to overwrite current user decisions.
