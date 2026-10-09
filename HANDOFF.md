# FJMK — Session Handoff

_Last updated: 2026-10-09_

## What this session produced

Two deliverables:

1. **The FJMK agency site completed and repaired** (`fjmk/site/`) — multi-page
   restructure, 4 work landing pages with distinct design systems, 23 journal
   pages, 3-step WhatsApp contact flow, bylines set.
2. **A 12-site sample portfolio** (`fjmk/samples/`) — 28 pages, each a different
   design system, with working interactive components. Built as a sales tool.

Plus two strategy documents: `SEO-STRATEGY.md` and `TARGET-MARKET.md`.

---

## Part 1 — The agency site (`fjmk/site/`)

### Structure
```
site/
  index.html      homepage — hero, problem, system, services, packages,
                  work grid, proof, clinics, team, journal, education, CTA
  about.html      studio story, 6 SVG values, process, team
  blog.html       journal index — 11 agency articles + category filter
  contact.html    3-step WhatsApp flow + email form
  work/
    index.html    work index (case rows, hover reveal)
    dental.html   design system A — teal, Fraunces/Inter, custom cursor
    family-clinic.html  B — sage/terracotta, Lora/Nunito, organic blobs
    diagnostics.html    C — dark navy, JetBrains Mono, animated SVG charts
    specialist.html     D — forest green/gold, Cormorant, slow parallax
  journal/        23 article pages (11 agency + 12 health)
  assets/         css/system.css + 7 webp images
```

### Bylines (set 2026-10-09)
- **Agency articles →** Oluwatobi Ajidahun (initials `OA`)
- **Health articles →** Dr Tolulope Ajidahun (initials `TA`)
- The `FMJK Agency Content` source .md files still carry old placeholder author
  names. The generators override the display byline, so the site is correct — but
  any agent writing new pages straight from those .md files will pull the old names.

### Contact flow
- **WhatsApp:** `2348145580220` (08145580220)
- 3 steps: practice type → main problem → WhatsApp opens with a pre-filled message
- Email form sends to `hopequasher@gmail.com`, assembled in JS so it never
  appears in rendered markup. **Do not print it on the site.**

### Verified
```
node _tools/validate_site.js     → 32/32 pages clean
```
Checks JS syntax, tag balance, anchors, duplicate IDs, alt text, leaked address.

### Regenerating
```bash
cd C:/Users/User/hermes-work/fjmk/_tools
python gen_journal_all.py    # 11 agency articles
python gen_journal_site.py   # 12 health articles
node validate_site.js
```

---

## Part 2 — The sample portfolio (`fjmk/samples/`)

**Open `samples/index.html`** for the gallery. Each card previews its site's real
palette and typography.

### The twelve

| # | Site | Movement | Signature interactive piece |
|---|---|---|---|
| 01 | LUMEN Eye Institute | Optical / light refraction | **Working Snellen acuity chart** + cursor-driven focus aperture |
| 02 | Axiom Diagnostics | Instrument panel | **Booking engine** — 247 tests, live total, home/centre, receipt |
| 03 | Veil Sexual Health | Midnight / veiled | Clip-path reveals emerging from darkness |
| 04 | Kinetic Physiotherapy | Kinetic / body in motion | Recovery timeline, magnetic tilt, overshoot counters |
| 05 | Maison Aesthetics | Luxury editorial | Asymmetric magazine grid, lookbook |
| 06 | Haven Mental Health | Organic / breathing | **Working 4-7-8 breathing widget** |
| 07 | Sprout Children's | Neo-Memphis / playful | Animated growth chart, vaccine timeline |
| 08 | Axis Orthopaedic | Structural / blueprint | **Interactive SVG anatomy** — click a region, read the spec |
| 09 | Terra Dermatology | Botanical / macro | Animated skin-layers cross-section |
| 10 | Hearth Home Nursing | Humanist / handcrafted | Day-in-the-life timeline |
| 11 | Atlas Medical Tourism | Collage / passport | Animated flight paths, boarding-pass cards |
| 12 | Script Pharmacy | Swiss commerce | **Working shop** — 48 products, search, basket, checkout |

### Design diversity is enforced, not hoped for
```bash
cd samples/_tools
node diversity_check.js
```
Fails if any two sites share a font pairing or 3+ palette colours.
**Current: 12 unique font pairings, zero palette collisions.**

### Validation
```bash
cd samples/_tools
node validate_samples.js     # static: 28/28 clean
node functional_suite.js     # functional: 44/44 passed
node diversity_check.js      # 12 sites, all distinct
```

`functional_suite.js` loads each page into a real DOM (jsdom), executes its actual
scripts and fires its actual handlers. It verifies the LUMEN chart advances when a
line is read, that Axiom's subtotal computes to ₦56,500 and produces a receipt,
and that Script's basket updates on add-to-basket.

### Regenerating the multi-page samples
```bash
cd samples/_tools
python gen_lumen.py    # 01 — services, about, journal, contact + 6 articles
python gen_axiom.py    # 02 — tests, home-collection, results, about
```

---

## Strategy documents

- **`fjmk/SEO-STRATEGY.md`** — how clients get found. Key insight: for a clinic,
  the Google Business Profile matters more than the website for local ranking.
  Includes the content model, AI-search section, and the licensable
  patient-education library as a product line.
- **`fjmk/TARGET-MARKET.md`** — ranked target list with deal sizes. Tier 1: IVF,
  diagnostics, aesthetics, dental, eye clinics. Six of the twelve samples land
  directly on these targets.

Research source material:
- `nigeria-business-landscape-report.md` (37KB, 60+ cited sources)
- `research/award-winning-design-techniques.md` (42KB, code-level techniques)

---

## Lessons / Pitfalls

- **The free model (`meituan/longcat-2.5-preview:free`) loops on long HTML
  writes.** It killed 5 subagent builds this session. Keep delegated writes small
  (one page, under ~55KB) or build large pages directly. A failed child that
  wrote nothing costs nothing; one that looped mid-write costs the whole attempt.
- **Never let an agent write medical content from scratch.** A subagent invented
  six unreviewed medical articles instead of using the reviewed bank. Medical copy
  must always come from `FMJK Content/`, never from a model's imagination.
- **`---` is overloaded** in the agency .md files — it is both a section divider
  and the metadata separator. Only cut metadata at a rule whose *following text*
  contains metadata fields, or whole articles get truncated.
- **Health .md files carry a standalone review line** that duplicates the byline.
  Strip it in the body pass or it renders twice.
- **jsdom needs the clocks to match.** If you stub `requestAnimationFrame` to pass
  `Date.now()` while the page reads `performance.now()`, timed animations appear
  broken when they are fine. Pass `w.performance.now()`.
- **The browser tool was unavailable this session** (cloud auth failed, local
  Chrome profile locked). All verification was done with static + jsdom analysis.
  A visual pass in a real browser is still worth doing.

## Known placeholders (user will replace — do not chase)
- Fictional client names across both the agency site and the samples
- `hello@ikejadental.example` style addresses, `+234 (0) 123 456 7890`
- All imagery is AI-generated texture or CSS/SVG — no real photography
