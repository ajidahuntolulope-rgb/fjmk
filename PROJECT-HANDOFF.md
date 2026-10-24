# Project handoff

Last updated: 23 October 2026.

Production correction: FormSubmit still rejects Cloudflare-origin submissions
with HTTP 429, even after activation and origin-header correction. Production
now saves leads into private Workers KV `fjmk-audit-leads` (AUDIT_LEADS binding in
wrangler.jsonc, namespace ad12c070329a4bf48ececf1b43572b6f) before returning full
findings. Fields: email, public URL, score, grade, review count and creation date;
KV TTL is 30 days. No report or scanned HTML is stored. The browser sends the
FormSubmit notification after capture; notification failure does not lock a
successfully captured request. Leads remain accessible through the authenticated
Cloudflare KV API/dashboard, never a public listing endpoint. Privacy notice and
gate copy describe the storage and notification flow. If storage fails or the
production binding is missing, no full report is returned. Pages previews have no
production binding; local Node preview retains the direct provider fallback.
The diagnostic paragraphs below describe the superseded direct-email approach.

Report unlock diagnosis (23 October 2026): FormSubmit initially rejected the
inactive delivery alias. The user activated it, revealing a second issue: the
server-side fetch omitted Origin/Referer headers. Direct provider requests without
them fail ("Make sure you open this page through a web server"); the same request
with the FJMK origin and tools-page referer succeeds. The backend now supplies
those fixed headers. Lead failures use HTTP 424 JSON because Cloudflare replaced
the previous 502 response with an HTML gateway page. The browser also handles
non-JSON responses, blocks and rate limits. Logs contain only failure reasons,
without the submitted email/report. Regression check (offline, no email):
`node _tools/check-audit-lead.mjs`. It covers required origin headers, previews,
provider rejection/HTML/network failure and successful unlock. The user authorised
future functional test messages. Gmail access currently requires reauthentication;
provider acceptance does not establish receipt in the destination inbox.
The corrected handler was exercised with real network requests and provider
submission: HTTP 200, 13 checks, 93/A for the FJMK homepage. Offline regressions,
syntax, build, reference and SEO checks passed. Verify the exact deployed commit
and production unlock after publishing; inbox receipt is not yet verified.

## Current site

FJMK is a healthcare-focused creative studio with design/websites, motion/content,
practical AI, research/strategy and people/partnerships. Boutique visual direction,
cream #f4efe7, ink #1f1b17, terracotta #b5543a (text #9c4530), Newsreader + Manrope.
Contact: contact@drtolu.com. No new fjmk@drtolu.com mailbox was created.

Ten main pages: Home, Portfolio, Services, Resources, Blog, Research, Tools,
About, Contact, Privacy. Resources dropdown links writing, research and tools.
Portfolio dropdown links websites and motion. The Blog has six active, question-
led articles about healthcare digital practice. There are sixteen working
fictional website concepts. The sitemap has sixteen curated URLs: ten main pages
plus six selected articles.
Fictional sample sites remain usable via the portfolio but carry noindex,follow.

## Visual and content decisions

Home: original walking-woman photo with a transparent left-edge fade; Healthcare,
up to speed. No ticker, no screenshot collage in the hero. Consultation action and
60-second intro dialog. Infinite fan deck below; a single View the full portfolio
action. Illustrated pathways lead to websites, motion and AI systems.

About: all approved copy on the left, generated cream/terracotta alcove artwork
on the right. Circular photos for Tolu and Tobi; empty circle for Praise. A generated
portrait was rejected and is not published. Team has only three people. Do not
reintroduce the earlier six-person roster or competing point-of-view sections.

Portfolio: silent supplied hero film, no text overlay or Play film control; wide,
irregular website grid; sharp dental preview. Motion section is a dark, subtly
textured, continuously looping board with thin landscape frames and slim phones.
It pauses via its control, reduced-motion settings, or during playback, not hover.
Nine selected films: brand film, hero, FJMK Motion, FJMK - What we do, social,
Time to find/Time to book, Four Things That Are Killing Your Clinic Website
(Austin), Website breakdown (Haven Mind 30s), Children's Health Clinic Website Demo
(Sprout 39s tight). Other recordings/duplicate cuts are not in the manifest.
The hospital 171s video and poster were deleted from Git; do not restore them.

## Data flows and limitations

Project form submits JSON to the existing FormSubmit alias, then email. WhatsApp
link is prefilled from the brief. Failure/retry and success were tested with mocked
responses earlier; real mailbox delivery has NOT been tested in the redesign.
The live three-step UI was tested without sending an enquiry.

The /tools check makes one live request to a public page, follows up to five
public redirects and reads up to 1.2 MB of initial HTML plus response headers.
It reports signals for availability, HTTPS, patient contact routes, location
text, mobile viewport, image alt attributes, search metadata, forms, external
script references and selected browser security headers. It does not execute
JavaScript, crawl the site, test form submissions, run Lighthouse or axe, or
establish accessibility, security or legal compliance. FJMK does not store
reports. Cloudflare resolves and requests the target page, and the target site
may log the request. When configured, the validated final URL is also sent to
Google PageSpeed Insights for an emulated mobile Lighthouse run. Its lab scores
can vary, are not field measurements from Lagos users and do not establish WCAG
compliance. The WhatsApp action is optional and sends nothing until the visitor
chooses to send its prefilled message. No Lagos comparison dataset exists. The
latest local audit source shows a weighted homepage score and grade, a short
summary and up to three color-coded highlights. Full findings are returned only
after a valid email request is sent through FormSubmit, then can be saved as a
PDF from the browser. These changes have not been deployed or live-verified. The
result counts and finding cards use distinct colors and
plain-text status labels. Site action buttons and contact routes have visible
borders with terracotta hover and pressed states. The footer no longer includes
the Pause motion toggle; reduced-motion preferences remain respected. The current
tool title and description target health website audits for healthcare organisations.
color-coded report release was verified against the Lagos University Teaching
Hospital homepage and returned HTTP 200 with 13 checks (3 to
review, 9 good, 1 signal). PageSpeed returned a mobile snapshot of 67 performance,
75 accessibility, 83 SEO and 96 best practices. A reserved `.invalid` address was
rejected and the prior report cleared without creating a new one.
The current local score uses the existing priority values as weights: priority 1
gets four points, priority 2 three, priority 3 two and priority 4 one. Good checks
earn points, review flags do not, and information-only checks are excluded. Grade
bands are A (90–100), B (80–89), C (70–79), D (60–69) and F (below 60). Any
unresolved priority 1 finding caps the score at 59. Optional PageSpeed lab scores
remain separate because they can vary and may be unavailable. Health-site
eligibility is a lightweight homepage-text heuristic, not a trained classifier;
unclear or blocked pages may be rejected. The report request performs a fresh
scan and submits the lead before returning full details, so findings may shift
from the preview. FormSubmit activation and required origin headers were corrected;
see the diagnosis above. The user has authorised functional test messages.

The published Lagos healthcare website article reports search-derived website availability and technical phone-viewport checks from public listings. Treat it as an exploratory search sample, not a census or provider-confirmed website count.

Privacy is an operational notice for current hosting, enquiry, messaging and demo
flows, not a claim of regulatory certification. Recheck it when analytics,
processors, retention practices or actual audit functionality change. Never ask
people to submit patient records through the general project form.

## Deployment history and operating notes

Independent Cloudflare Pages deployment; personal portfolio migration was handled
separately. Root repo is C:/Users/User/Claude Code Folder/fjmk on this laptop.
Account 5272e056781cf6c14196d153867e7128, Pages project fjmk.
The project auto-builds main from GitHub, node build.mjs, dist.

Relevant production commits before this documentation/SEO pass:
- 9f92add: full agency redesign, Resources and contact flow; generated face removed.
- be93292: curated motion manifest, framed loop; hospital video deleted.
- 3c2d180: hero autoplay/resume, no hero button, 10% speed increase, cache hashes,
  recaptured dental preview, slim frames and click-to-fullscreen behavior.
- b9e9600: full-window dialog fallback where native fullscreen is unavailable.
- 13afe5a: clean phone clipping within handset shell.

Live checks at that release confirmed autoplay, no hero button, board movement
and full-window player open/close. Browser fullscreen itself was unavailable in
the embedded browser, so the full-window dialog is required. Existing responsive
checks covered 320, 390, 768, 1169 and 1440px; inspect new changes again as needed.

## Google Search Console and SEO status (23 October 2026)

- The existing `sc-domain:drtolu.com` property is accessible. Its ownership
  verification method was not inspected. Submitted
  `https://fjmk.drtolu.com/sitemap.xml` on 23 October; Search Console processed it
  successfully, last read it the same day and discovered 16 URLs, with no videos.
- Live checks returned 200 for the FJMK homepage, `robots.txt` and `sitemap.xml`;
  robots.txt allows crawling and references the current sitemap.
- The homepage URL Inspection initially said it was unknown to Google. Its live
  test passed: available to Google, can be indexed, and a video was detected.
  The first request failed with a reCAPTCHA connection error; a later user-
  supplied screenshot confirmed a successful request, as recorded below.
- The two older submitted sitemap URLs, `https://drtolu.com/fjmk` and its
  trailing-slash version, are HTML pages, not sitemaps. Each reports an error and
  zero discovered pages. Leave these entries unchanged for now.
- The 16 October domain-wide indexing snapshot showed 4 indexed and 8 not indexed;
  all four indexed examples were on `drtolu.com`, not the FJMK subdomain. Core Web
  Vitals had no data. These counts do not describe FJMK alone.
- In the current Search Console Performance report, filtering page URLs to
  `https://fjmk.drtolu.com/` returns 0 clicks and 0 impressions for the available
  three-month view (chart dates 17-21 October). Treat this as an empty starting
  baseline, not a content-quality signal. Core Web Vitals still has no field data.
- `node _tools/verify-seo.mjs` passed: 16 unique sitemap URLs and 33 demo pages
  marked noindex.
- A later user-supplied URL Inspection screenshot supersedes the failed request
  recorded earlier: it still showed "URL is not on Google", but confirmed
  "Indexing requested" and that the URL was added to Google's priority crawl
  queue. This is a queued request, not confirmation of indexing. Do not resubmit
  the same URL to try to change its queue position.
- Ten main-page title tags were made descriptive of their page and healthcare
  focus. Six selected journal articles now link to clean URLs rather than `.html`
  variants that redirect. No visual design or approved page copy changed. See
  `SEO-PLAN.md` for the assessment, rationale and next steps.
- There are 17 article files outside the selected sitemap. One URL redirects to
  `/services`; the other 16 return 200, are self-canonical and have no noindex
  directive. The user has confirmed these legacy articles are parked. Keep them
  outside the active sitemap and do not revise their content, indexability or
  redirects unless the user reopens that scope.
- The older submitted sitemap entries `https://drtolu.com/fjmk` and its
  trailing-slash version are HTML pages in the parent-domain property, not the
  FJMK sitemap. Both report errors and zero discovered URLs; the FJMK subdomain
  sitemap is a separate successful entry with 16 discovered URLs.

## Next work, not completed

- Supply Praise's real portrait.
- Verify actual enquiry delivery with an authorised test.
- Production rate limiting is configured at the Cloudflare zone level because
  Pages Functions do not support the Workers Rate Limit binding. The current
  WAF rule matches POST requests to `fjmk.drtolu.com/api/audit` and
  `/api/pagespeed`, blocks after five requests in ten seconds per source IP and
  Cloudflare location, and applies for ten seconds. It is approximate and does
  not emulate a strict global quota. The local preview does not enforce the
  Cloudflare edge rule. Verify the rule in Cloudflare if the production setup is
  changed.
- `GOOGLE_PAGESPEED_API_KEY` is configured as a Cloudflare Pages production
  secret. Local development reads the same variable from ignored `.dev.vars`.
  Keep the key server-side and out of Git. Scores remain separate lab signals.
- Consider rendered-page axe-core checks as a later service decision.
- Collect real research and benchmark data before adding any Lagos comparison.
- After normal crawl time, recheck the homepage in URL Inspection and review
  Page indexing and Performance reports filtered to `fjmk.drtolu.com`. Do not
  resubmit the same indexing request. Check Core Web Vitals if field data appears.
- No claim that a privacy page, robots.txt, schema or llms.txt guarantees rankings.

Local DESIGN-NOTES.md contains older iteration history but is not required by a
fresh checkout. This file and AGENTS.md are the shared, current handoff.

## Blog SEO refresh (23 October 2026)

- The six active Blog cards now target question-led articles at `/blog/{slug}`. The old active `/journal/{slug}` routes and `.html` forms redirect to their new canonical pages. Parked legacy article files remain outside the sitemap and unchanged.
- Each new article is static HTML using the approved FJMK fonts, cream/ink/terracotta design, shared header and footer. Each has a direct answer near the top, unique title/description/canonical, BlogPosting and breadcrumb JSON-LD, and authoritative source links where relevant.
- Keyword research is qualitative because Search Console has no useful query baseline and no paid keyword-volume tool is connected. See `BLOG-SEO-RESEARCH.md`; it records the intent hypotheses, search-result scan, source review and FJMK editorial position. Do not report estimated search volume or guaranteed rankings.
- Build and local clean-route/redirect checks passed. SEO verifier: 16 unique sitemap URLs and 33 demos marked noindex. Reference checker: 382 references, no errors.
- The 2026 Lagos healthcare website article is published at `/blog/how-many-lagos-clinics-have-a-website`; the Blog index now has seven active articles. Its 388-record sample is search-derived, and 47 candidate page rows were checked in a 390 × 844 browser viewport; neither result is a census or human usability study.
- `/research` now links to the published article instead of describing a planned 50-site study. The generator source, metadata, blog listing and sitemap are aligned; the sitemap now contains 17 canonical URLs.
- Verified live after commit `518325a`: the article, `/blog`, `/research` and `sitemap.xml` returned HTTP 200. The article’s canonical URL, blog card, research link and sitemap entry all appear live; the stale 50-site copy is absent.
