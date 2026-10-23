# Project handoff

Last updated: 23 October 2026.

## Current site

FJMK is a healthcare-focused creative studio with design/websites, motion/content,
practical AI, research/strategy and people/partnerships. Boutique visual direction,
cream #f4efe7, ink #1f1b17, terracotta #b5543a (text #9c4530), Newsreader + Manrope.
Contact: contact@drtolu.com. No new fjmk@drtolu.com mailbox was created.

Ten main pages: Home, Portfolio, Services, Resources, Blog, Research, Tools,
About, Contact, Privacy. Resources dropdown links writing, research and tools.
Portfolio dropdown links websites and motion. Six curated blog posts retain their
original article bodies. There are sixteen working fictional website concepts.
The sitemap has sixteen indexable URLs: ten main pages plus six selected articles.
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

The audit tool displays clearly labelled fixed example findings. The entered URL
stays in the current browser page. No actual scan or comparison dataset exists.
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

## Next work, not completed

- Supply Praise's real portrait.
- Verify actual enquiry delivery with an authorised test.
- Collect real research and benchmark data before implementing the audit backend.
- Full editorial/SEO review of legacy articles, fictional sample content and links.
- Search Console ownership/submission and field Core Web Vitals are not verified.
- No claim that a privacy page, robots.txt, schema or llms.txt guarantees rankings.

Local DESIGN-NOTES.md contains older iteration history but is not required by a
fresh checkout. This file and AGENTS.md are the shared, current handoff.
