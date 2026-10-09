# FJMK

The web studio for clinics and hospitals — Lagos, Nigeria.

This repository is the whole business: the agency site, the design range we show
prospects, and the content libraries behind both.

## Layout

```
index.html      agency homepage
about.html      studio, team, process
work/           four client builds (dental, family medicine, diagnostics, specialist)
blog.html       the journal index
journal/        23 articles — 11 agency, 12 patient education
contact.html    three-step enquiry flow, opens WhatsApp
samples/        twelve complete clinic websites + gallery (the design range)
assets/         css and images
robots.txt      crawler rules — AI crawlers explicitly allowed
llms.txt        summary for AI assistants
sitemap.xml     60 URLs
_tools/         generators and validators (not published)
```

## The design range

`samples/` holds twelve complete clinic websites, each on its own design system,
typography and palette. The rule is enforced in code — no two sites may share a
font pairing or three or more palette colours:

```bash
cd _samples-src-fjmk/samples/_tools   # working copy with tooling
node diversity_check.js
node validate_samples.js
node functional_suite.js
```

Current state: 12 unique font pairings, no palette collisions, 81/81 functional
checks passing.

## Content

Two libraries, kept outside this repo:

- **Agency content** — articles about websites, local search and clinic marketing
- **Patient education** — reviewed clinical articles, published under a named
  medical reviewer

Medical copy is never written from scratch. It comes from the reviewed library.

## Deploy

Static HTML. No build step, no framework, no dependencies. Serve the repository
root as-is — `index.html` is the entry point. GitHub Pages is enabled for this
repo.

## Contact

WhatsApp is the enquiry channel: the contact flow assembles a message and opens
it directly.
