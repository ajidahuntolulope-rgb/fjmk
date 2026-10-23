# FJMK

Healthcare-focused studio website. Production: https://fjmk.drtolu.com/

Read `AGENTS.md` for agent instructions, `PROJECT-HANDOFF.md` for current decisions
and known gaps, and `CHANGELOG.md` for the work log.

## Build and preview

```powershell
node build.mjs
node _tools/preview.mjs
```

Preview: http://127.0.0.1:3220/

Cloudflare Pages builds `main` with `node build.mjs` and publishes `dist/`.

## Editing

- Main page templates: `_tools/build-studio-v1.mjs`
- Privacy notice: `_tools/privacy-page.mjs`
- Resources, research and audit demo: `_tools/resource-pages.mjs`
- Shared styles: `assets/css/studio-v1.css`
- Shared interactions: `assets/js/studio-v1.js`
- Motion collection: `_tools/motion-content.json`

After editing templates, run:

```powershell
node _tools/build-studio-v1.mjs
node _tools/update-site-indexes.mjs
node build.mjs
```

Ten primary pages: Home, Portfolio, Services, Resources, Blog, Research,
Tools, About, Contact and Privacy. The portfolio includes sixteen fictional healthcare
website concepts and a motion collection. Sample claims and figures are part
of fictional demonstrations, not FJMK client results.

The clinic check at `/tools` scans one public homepage and returns observable
signals plus an optional Google PageSpeed mobile Lighthouse snapshot. It does
not establish legal compliance or provide a Lagos benchmark. For local
PageSpeed results, add `GOOGLE_PAGESPEED_API_KEY` to ignored `.dev.vars`.
Research is marked coming soon.

Current team: Tolu (Team lead), Tobi (Creative director), Praise (Marketing).
Praise's portrait space is empty until a real photo is supplied.

Main brand fonts and production assets are self-hosted. The local
`studio-library/` contains source assets and internal working material; it is
ignored by Git and excluded from the deployment. Build output, raw preview
captures, local notes and credentials must not be published.

SEO: sixteen canonical URLs in sitemap.xml. Fictional demo pages use noindex,follow
and are excluded from the sitemap. robots.txt allows crawling, including AI agents.
No indexing or ranking guarantee is implied.
