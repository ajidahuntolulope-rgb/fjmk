# FJMK

Healthcare-focused studio website. Production: https://fjmk.drtolu.com/

## Build and preview

```powershell
node build.mjs
node _tools/preview.mjs
```

Preview: http://127.0.0.1:3220/

Cloudflare Pages builds `main` with `node build.mjs` and publishes `dist/`.

## Editing

- Main page templates: `_tools/build-studio-v1.mjs`
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

Nine primary pages: Home, Portfolio, Services, Resources, Blog, Research,
Tools, About and Contact. The portfolio includes sixteen fictional healthcare
website concepts and a motion collection. Sample claims and figures are part
of fictional demonstrations, not FJMK client results.

The audit is a labelled interactive demo. It does not scan the submitted address
or provide a real Lagos benchmark. Research is marked coming soon.

Current team: Tolu (Team lead), Tobi (Creative director), Praise (Marketing).
Praise's portrait space is empty until a real photo is supplied.

Main brand fonts and production assets are self-hosted. The local
`studio-library/` contains source assets and internal working material; it is
ignored by Git and excluded from the deployment. Build output, raw preview
captures, local notes and credentials must not be published.
