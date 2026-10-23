# FJMK SEO assessment and plan

Updated 23 October 2026

## Objective and scope

Earn qualified enquiries from hospitals, clinics and pharmacies, with Lagos as the starting market. Healthcare website work is the strongest search entry point today; this is a channel priority, not a change to FJMK's broader positioning or approved design.

This plan covers the 16 URLs in the current sitemap: ten main pages and six selected journal articles. The user has confirmed the other legacy articles are parked. They remain outside the sitemap and are excluded from this audit; no legacy copy, indexability, redirect or destination changes are proposed.

## Current position

- Search Console processed `https://fjmk.drtolu.com/sitemap.xml` and discovered 16 URLs. The sitemap is separate from the older `drtolu.com/fjmk` entries, which are HTML pages in the parent-domain property.
- The supplied URL Inspection screenshot still says **URL is not on Google**, but confirms **Indexing requested** and that the homepage was added to Google's priority crawl queue. The live URL test had passed earlier. A queued request is not an indexing result; do not submit it again to try to move it up the queue.
- The accessible property is `sc-domain:drtolu.com`, so its totals include the parent site and subdomains. Filter pages to `fjmk.drtolu.com` before drawing conclusions. The earlier 4-indexed / 8-not-indexed snapshot was domain-wide, not an FJMK count.
- The local SEO verifier passes: 16 unique sitemap URLs, correct canonicals and metadata, and 33 fictional demo pages marked `noindex,follow`. The main pages use Organization and WebPage JSON-LD; the selected articles use BlogPosting and BreadcrumbList. This confirms the project's checks, not eligibility for or display of a Google rich result.
- The ten main-page titles were too generic to explain the page or healthcare focus. They now use distinct, descriptive titles. The six selected articles already have descriptive titles and summaries. No visible page copy or visual design was changed.
- Selected-article internal links previously used `.html` variants that Cloudflare redirects to clean URLs. Those links now point directly to the clean routes. The destinations and article text are unchanged.
- With the Performance report filtered to `https://fjmk.drtolu.com/`, the current three-month view returns 0 clicks and 0 impressions. Its chart only contains dates 17-21 October 2026. Record this as an empty starting baseline, not evidence about content quality. Core Web Vitals field data is still unavailable.

## What the supplied guides support

**Google Search Central** is the primary source for technical and content decisions: make useful pages accessible, use clear titles and snippets, connect important pages with crawlable links, and keep facts accurate. Sitemaps help discovery but do not guarantee crawling or indexing. Google's current guidance says the same SEO fundamentals apply to AI Overviews and AI Mode; there are no extra AI-specific technical requirements or special schema to add. It also cautions against chasing word counts, keyword repetition or other mechanical targets.

**LinkedIn's 2026 guide** is useful as a channel hypothesis: publish around a small set of real expertise areas, use LinkedIn to distribute and discuss stronger owned content, activate credible people, and learn from patterns over time. Its citation-share figures, follower thresholds and weekly cadence are LinkedIn/Meltwater/Semrush observations, not Google rules or expected results for FJMK. Treat them as test ideas, not KPIs.

**Microsoft Advertising's AEO/GEO guide** is written for retailers. Its advice to keep facts consistent and verifiable transfers well; product feeds, Merchant Center, inventory fields and Product/Offer schema do not fit FJMK's services.

## Prioritized plan

| Priority | Work | Completion signal |
|---|---|---|
| 1. Indexing follow-up | After normal crawl time, inspect the homepage and the other priority URLs in Search Console. Review each URL's status/reason, and the sitemap report. Filter the domain property to the FJMK hostname. Do not repeat the same indexing request. | Homepage status changes, or a specific indexing reason is identified and addressed. Google says recrawling can take days to weeks and does not guarantee inclusion. |
| 2. Establish a baseline | In Performance, filter pages to `https://fjmk.drtolu.com/`, set country to Nigeria, and compare 28-day periods once enough data appears. Review queries and pages together; separate brand searches from service searches. | A dated baseline of impressions, clicks, CTR, top queries and top landing pages. Do not treat average position alone as success. |
| 3. Validate search intent | Treat these as hypotheses until Search Console and buyer conversations support them: healthcare website design for clinics and hospitals; healthcare digital services in Lagos/Nigeria; clinic website trust and enquiry paths; local discovery and reputation. Map each topic to one existing page before creating more content. | No competing page targets the same primary intent; new pages answer a confirmed buyer question. |
| 4. Run a small LinkedIn pilot | Start with one focused theme: how healthcare websites help people understand services and take the next step. Use an existing or newly researched site article as the source, then publish two supporting LinkedIn posts from the company and a real subject expert, linking to the FJMK page. Review engagement and site visits after a month; do not adopt the guide's high-frequency cadence by default. | Useful buyer questions and qualified site visits inform the next article. LinkedIn engagement is a leading signal, not proof of AI citation or revenue. |
| 5. Build trust from real evidence | Use real team expertise, sources, clear authorship and any approved client evidence. Keep fictional concepts clearly labelled as concepts. Seek relevant interviews, partnerships or contributed coverage only where FJMK has a defensible point of view. | Every claim can be traced to a real source or experience; no invented outcomes, clients or reviews. |

## Guardrails

- Keep the cream, ink and terracotta design, approved visible copy, and broad FJMK positioning.
- Keep the sitemap curated to the current 16 URLs. Do not bring the parked legacy articles back into the active plan.
- Do not add product/catalog schema, FAQ schema for AI visibility, extra AI text files, or an address-based local-business entity without a factual need. Keep `llms.txt` as an informational summary only.
- Do not promise indexing, rankings, AI citations or lead growth from title changes, structured data, LinkedIn cadence or a sitemap submission.
- If location needs stronger on-page support later, propose one factual Lagos line for the existing Services page for copy approval. Do not invent an office address or change the design.

## Source notes

- User-supplied: Google Search Central, “SEO Starter Guide: The Basics” (pasted text); LinkedIn, *Unlocking AI Search Visibility: The B2B Marketer's Guide to LinkedIn* (2026); Microsoft Advertising, *From Discovery to Influence: A Guide to AEO and GEO*.
- Google Search Central: [AI features and your website](https://developers.google.com/search/docs/appearance/ai-features), [Ask Google to recrawl your URLs](https://developers.google.com/search/docs/crawling-indexing/ask-google-to-recrawl), [Sitemaps overview](https://developers.google.com/search/docs/crawling-indexing/sitemaps/overview), and [Using Search Console and Google Analytics data for SEO](https://developers.google.com/search/docs/monitor-debug/google-analytics-search-console).
