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

### Clinic website checkup

- Replaced the fixed audit example with a live one-page check for public clinic
  websites. The report covers homepage response, HTTPS, contact links, location
  signals, mobile viewport, image alt attributes, search metadata, form
  destinations, external script references and selected security headers.
- Added a Cloudflare Pages Function for POST /api/audit and limited Function
  routing to /api/* in the generated Pages routes manifest. Local preview uses
  the same scan core.
- Kept the report free and ungated, with print-to-PDF and an optional WhatsApp
  handoff. No scan reports are stored, no composite score is shown and no Lagos
  benchmark is claimed.
- Added an optional Google PageSpeed Insights mobile Lighthouse snapshot with
  performance, accessibility, SEO and best-practices scores plus lab metrics.
  It runs as a separate request so the direct homepage report appears first.
  The report keeps those scores separate from direct findings and labels them
  as emulated results, not WCAG or Lagos field measurements.
- The PageSpeed key is server-side only: set `GOOGLE_PAGESPEED_API_KEY` as a
  Cloudflare Pages secret in production or in the ignored local `.dev.vars` file.
  The earlier keyless request returned HTTP 429; an unavailable API now leaves
  the direct homepage report intact.
- Configured an approximate Cloudflare zone WAF limit for POST requests to the
  live checkup endpoints (five requests per ten seconds per source IP and edge
  location, ten-second block) after verifying Pages Functions do not support
  the Workers Rate Limit binding. Removed the unsupported Wrangler binding and
  its fail-closed handler dependency after production verification.

### Blog SEO refresh

- Reviewed search intent and competitor results qualitatively. Search Console still has no useful FJMK query baseline, so no search volumes or ranking gains are claimed. Added the query map and source review to `BLOG-SEO-RESEARCH.md`.
- Normalized CSS and JavaScript line endings before generating cache-version hashes so Windows builds and Linux deployments emit the same page metadata.
- Reframed the six active blog cards as direct questions and wrote six original answers around FJMK's healthcare discovery-to-contact perspective. Kept commercial website-design terms on the Services page.
- Added static article pages under `/blog/` using the approved FJMK fonts, palette, header and footer. Added canonical URLs, Article and breadcrumb structured data, visible first-paragraph answers, source links, and the six pages to the curated sitemap.
- Added 301 redirects from the six former active `/journal/` routes, including `.html` variants. Parked legacy article files were not changed.
- Build, SEO verifier (16 unique sitemap URLs; 33 demos noindex), reference checker (382 references, no errors), local clean routes and old-route redirects passed. Search demand remains a hypothesis until Search Console and buyer conversations provide evidence.

### Clinic website check tool UX (23 October 2026)

- Simplified the approved `/tools` page into a focused clinic and hospital homepage check, preserving the FJMK visual system. Added an animated FJMK loader, a report with expandable evidence, and a print-to-PDF action.
- Updated the page title and description for clinic website checks in Lagos, Nigeria.
- Local browser check of the public Lagos University Teaching Hospital homepage returned HTTP 200 and 13 checks: 3 to review, 8 good, and 2 signals. The mobile PageSpeed snapshot completed with scores of 71 performance, 75 accessibility, 83 SEO and 96 best practices; lab scores can vary.
- A reserved `.invalid` address was rejected before a report was produced.
