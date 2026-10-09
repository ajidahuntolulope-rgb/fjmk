# FJMK Sample Sites — Design Movements

Twelve clinic websites, twelve deliberately different design systems. Built as
range cards: they exist to show the width of what FJMK can build, not as a menu.

**Open `index.html` in this folder** for the gallery view.

---

## Why twelve different systems

A two-chair dental practice and a fertility clinic should not look like each
other. Neither should the sites we show them. When a prospect clicks through
these, the intended reaction is *"they can build the thing I actually need"* —
which only works if the sites visibly disagree with each other.

**Hard rule for this collection: no two sites share a palette, a type pairing,
or a layout logic.** Recolouring one template twelve times would defeat the
entire purpose.

---

## The twelve

| # | Site | Movement | Palette | Type | Signature |
|---|---|---|---|---|---|
| 01 | **LUMEN Eye Institute** | Optical / Light refraction | Void black + prism spectral | Bricolage Grotesque / Newsreader | Working Snellen acuity chart; pointer-driven focus aperture that sharpens the page |
| 02 | **Axiom Diagnostics** | Instrument panel / Clinical | Lab white + assay green | Instrument Sans / IBM Plex Mono | Live booking engine — 247 tests, running total, home/centre toggle, slots, receipt |
| 03 | **Veil Sexual Health** | Midnight / Veiled | Black plum + magenta-rose | Playfair / grotesque | Content emerges from darkness via CSS masks and clip-paths |
| 04 | **Kinetic Physiotherapy** | Kinetic / Body in motion | Bone white + acid lime | Condensed grotesque | Scroll-linked horizontal type, magnetic tilt, animated recovery timeline |
| 05 | **Maison Aesthetics** | Luxury editorial | Bone + brushed bronze | Cormorant / spaced caps | Asymmetric magazine grid, numbered figure captions, horizontal lookbook |
| 06 | **Haven Mental Health** | Organic / Breathing | Sage + sand | Fraunces / Source Serif | Working guided-breathing widget; morphing blobs; feTurbulence texture |
| 07 | **Sprout Children's** | Neo-Memphis / Playful | Primary brights | Chunky rounded | Hard offset shadows, wiggle-on-hover, animated growth chart, squiggle SVG |
| 08 | **Axis Orthopaedic** | Structural / Blueprint | Blueprint blue + red | Swiss grotesque / mono | Interactive SVG joint diagram, annotation callouts, procedure datasheets |
| 09 | **Terra Dermatology** | Botanical / Macro | Bark + clay + olive | Bitter / Work Sans | Animated skin-layers cross-section, feDisplacementMap paper texture |
| 10 | **Hearth Home Nursing** | Humanist / Handcrafted | Oat + clay pink + sage | Warm serif / script | Layered soft shadows, sketchy SVG, day-in-the-life timeline |
| 11 | **Atlas Medical Journeys** | Collage / Atlas | Navy + parchment + stamp red | Archivo Black / Courier | Animated flight paths, boarding-pass cards, rubber stamps, parallax collage |
| 12 | **Script Pharmacy** | Swiss commerce | White + black + orange | Inter / IBM Plex Mono | Working product grid: live search, sort, basket drawer, simulated checkout |

---

## Technical notes

**Everything is hand-written HTML, CSS and JavaScript.** No WordPress, no page
builder, no framework, no build step, no plugin stack.

This is not a stylistic preference — it is the product. A typical WordPress
clinic site ships 2–4MB of JavaScript. These ship almost none, which is why they
load fast on a phone on Nigerian mobile data. That is a genuine, defensible
advantage and worth stating plainly to clients.

**Shared assets where it makes sense.** The multi-page sites (01, 02, 12) factor
their design system into `assets/css/*.css` and behaviour into
`assets/js/*.js`. The single-page sites keep everything inline so each file is a
self-contained artifact.

**Accessibility baseline across all twelve:**
- `prefers-reduced-motion` respected (all animation disabled, content still visible)
- Real `:focus-visible` states
- Responsive down to 380px
- Semantic landmarks and labelled controls

---

## Design-diversity rule (verified)

The collection is only useful if the sites visibly disagree with each other, so
this is enforced, not hoped for:

```bash
node diversity_check.js
```

It fails if any two sites share a font pairing, or if any two share three or more
palette colours (ignoring universal black/white). Current state: **12 unique font
pairings, no palette collisions.**

| # | Site | Display / body fonts |
|---|---|---|
| 01 | LUMEN Eye Institute | Bricolage Grotesque / Newsreader |
| 02 | Axiom Diagnostics | Instrument Sans / IBM Plex Mono |
| 03 | Veil Sexual Health | Playfair Display / Inter |
| 04 | Kinetic Physiotherapy | Archivo Black / Archivo / Space Mono |
| 05 | Maison Aesthetics | Cormorant Garamond / Jost |
| 06 | Haven Mental Health | Fraunces / Source Serif 4 |
| 07 | Sprout Children's | Baloo 2 / Nunito |
| 08 | Axis Orthopaedic | Inter Tight / IBM Plex Mono |
| 09 | Terra Dermatology | Bitter / Work Sans |
| 10 | Hearth Home Nursing | Gelasio / Karla / Caveat |
| 11 | Atlas Medical Journeys | Bebas Neue / Archivo / IBM Plex Mono |
| 12 | Script Pharmacy | Inter / IBM Plex Mono |

## Validation

Two suites, both must be clean:

```bash
cd _tools
node validate_samples.js    # static: syntax, links, anchors, IDs, alt text
node functional_suite.js    # functional: executes the real scripts in a DOM
```

`validate_samples.js` checks every page for inline and external JS syntax, tag
balance, broken links, dangling in-page anchors, duplicate IDs, missing `alt`
attributes, and missing title/viewport.

`functional_suite.js` loads each page into jsdom, executes its real scripts, and
drives its real event handlers. It verifies, among other things, that the LUMEN
acuity chart advances when a line is read, that the Axiom booking engine computes
a correct subtotal and produces a receipt, and that the Script pharmacy basket
updates on add-to-basket. **35/35 checks pass.**

These suites caught real bugs that static validation could not — a duplicate
`id` attribute, and a `mailto` handler pointing at a domain that did not exist.

---

## Regenerating the multi-page sites

```bash
cd _tools
python gen_lumen.py    # 01 — services, about, journal, contact + 6 articles
python gen_axiom.py    # 02 — tests, home-collection, results, about
```

Both read their shared CSS/JS from the site's own `assets/` folder, so run them
after editing `index.html` to keep the shared sheet in sync.

---

## Adding a new sample

1. Pick a design movement that is **not already in the table above**.
2. Fix the palette, the type pairing and the layout logic *before* writing markup.
   Deciding these while writing is how sites end up looking alike.
3. Build it, then add an entry to the `SAMPLES` array in `samples/index.html`
   with its real palette so the gallery card previews it accurately.
4. Run the validator.
