# Agent guide: FJMK

Read this file and `PROJECT-HANDOFF.md` before changing the site. The latest user
instruction overrides historical notes. Keep work concise, direct and reviewable.

## Identity and scope

- Independent healthcare studio: hospitals, clinics, pharmacies; Lagos first.
- Brand: FJMK. Tagline: Keep Up. Do not narrow it to only website development.
- Team: Tolu / Team lead; Tobi / Creative director; Praise / Marketing.
- Use only supplied real portraits. Praise has an empty circle, not an AI face.
- Concept brands, testimonials and statistics are fictional, not client results.
- No public prices, invented clients, outcomes, credentials or business addresses.
- Preserve the cream / ink / terracotta palette, Newsreader and Manrope.
- Do not rewrite approved copy or redesign unrelated sections during a small fix.

## Repository and deployment

This repo is independent of the personal portfolio in `../tolu-editorial`.
GitHub: ajidahuntolulope-rgb/fjmk. Production: https://fjmk.drtolu.com/.
Cloudflare Pages project `fjmk`, branch `main`, build `node build.mjs`, output
`dist/`. A push to main publishes automatically. Push only when authorised by the
user. Do not create a second deployment/project or change DNS for ordinary edits.
Do not change the personal portfolio while working on this repo without scope.

## Source of truth

- `_tools/build-studio-v1.mjs`: main page templates, navigation/footer, metadata,
  organisation/webpage schema, team, portfolio and contact markup.
- `_tools/resource-pages.mjs`: Resources, Research and Tools.
- `_tools/privacy-page.mjs`: privacy notice; keep it aligned with actual data flows.
- `assets/css/studio-v1.css`: shared styles. Historical overrides exist; inspect
  the final applicable rules before adding conflicting CSS.
- `assets/js/studio-v1.js`: menu, gallery, videos/full-window player, contact form,
  local audit demo. The final motion-board function controls continuous movement.
- `_tools/motion-content.json`: selected motion videos, nine original entries.
- `_tools/update-site-indexes.mjs`: sitemap and llms.txt.
- `work/` and `samples/`: working fictional concept sites. Preserve noindex,follow.

Generated root HTML is committed because Pages builds from it. Edit templates,
then regenerate; do not fix only generated HTML. CSS/JS hashes are added to their
URLs by the template generator, so run it AFTER CSS/JS changes to update caches.

```powershell
node _tools/build-studio-v1.mjs
node _tools/update-site-indexes.mjs
node build.mjs
node _tools/check-review-v2.mjs
node _tools/preview.mjs
```

Preview uses port 3220; reuse an existing process instead of starting duplicates.
The preview handles clean URLs, redirects, real 404s and video byte ranges.

## Assets and sensitive material

`studio-library/` is local, ignored and NOT shipped. It contains originals,
strategy, references and font packages. Preserve originals. Optimised selected
files belong in `assets/`. Never add keys, tokens, private notes, raw screenshot
PNGs, source libraries or generated people to the deployment. Explicitly stage
files; inspect `git diff --cached --name-only` before committing. README, agent
instructions and tooling are excluded by the build allowlist, not by robots.txt.
The removed hospital walkthrough must not return to the public repo/gallery.

## Interaction requirements

Motion board: slow infinite horizontal movement at 19.8px/s, no hover/focus pause.
Explicit pause control and reduced-motion preference remain supported. Pause while
the full-window player is open. The loop has duplicated DOM cards, not duplicate
manifest entries. All films open a full-window dialog; native fullscreen is a
best-effort enhancement. Keep phone bezels slim and landscape borders thin.
Hero film autoplays muted, loops, resumes when visible, and has no Play film button.

Contact: three steps; keep the existing FormSubmit delivery alias and WhatsApp
number unless instructed. Do not send test messages without authorisation.
The audit is a local-only demo, not a live scan. No real Lagos benchmark exists.
Research remains coming soon; do not manufacture findings or sample sizes.

## Verification and release

- Build, JS syntax and reference checker must pass. Checker exits nonzero on error.
- Inspect changed UI in the browser, at phone and desktop widths. Check runtime
  behavior, not just markup. For animation, measure movement over time and test
  pause/resume and playback. Screenshot the actual LIVE result after release.
- Main metadata: unique title/description, canonical, valid JSON-LD and footer.
- Sitemap contains only indexable, canonical pages; no demos, redirects or 404s.
  Do not block demos in robots.txt: crawlers need to read their noindex tags.
- Treat llms.txt as an informational summary, not a promise of AI ranking.
- On authorised release, push main, confirm Cloudflare deployment success for that
  exact commit, then verify fjmk.drtolu.com. Do not equate a push with a live release.
- Record decisions and completed changes in PROJECT-HANDOFF.md / CHANGELOG.md.
  Never claim a test, email delivery, performance score or ranking not measured.

SEO verification: run node _tools/verify-seo.mjs after regenerating the site.
