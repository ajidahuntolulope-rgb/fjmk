# Project handoff

Last updated: 23 October 2026.

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
chooses to send its prefilled message. No Lagos comparison dataset exists, and
the report shows no composite healthcare score. The tool page uses a single
homepage input, an FJMK loading animation, an expandable findings report and a
print-to-PDF action. Its title and description target clinic website checks in
Lagos, Nigeria. Production verification after the latest release returned HTTP
200 for the Lagos University Teaching Hospital homepage and 13 checks (3 to
review, 9 good, 1 signal). PageSpeed returned a mobile snapshot of 70 performance,
75 accessibility, 83 SEO and 96 best practices. A reserved `.invalid` address was
rejected and the prior report cleared without creating a new one.
Research placeholder proposes a 50-site Lagos study; the proposed 100-site audit
benchmark is unbuilt. Do not present these as completed research.

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
- The six active `/journal/` destinations redirect to the new `/blog/` pages; the other parked legacy articles remain unchanged. The sitemap is already submitted in Search Console, so retain the existing property and entry rather than adding duplicates. Search Console crawl and indexing are not guaranteed.
