#!/usr/bin/env python3
"""
Generate styled article pages for the FJMK site from the FMJK Content bank.
Reads the real markdown written by the archer-2 profile and emits HTML.
"""
import os, re, html, json, sys

SRC  = r"C:\Users\User\hermes-work\FMJK Content"
SITE = r"C:\Users\User\hermes-work\fjmk\site"
OUT  = os.path.join(SITE, "journal")

# The six articles featured on the homepage journal grid.
PICKS = [
    ("01 Men's Health",        "erectile-dysfunction",       "Men's health"),
    ("05 General Medicine",    "hypertension",               "General medicine"),
    ("05 General Medicine",    "malaria",                    "General medicine"),
    ("03 Common Symptoms",     "chest-pain",                 "Common symptoms"),
    ("06 Children's Health",   "fever-in-children",          "Children's health"),
    ("09 Other High-Intent Topics", "choosing-a-hospital-nigeria", "High intent"),
]

TITLE_OVERRIDES = {
    "hypertension": "Hypertension: the condition that has no symptoms until it does",
    "malaria": "Malaria in Nigeria: symptoms, testing and treatment",
    "chest-pain": "Chest pain: when it is nothing and when it is an emergency",
    "fever-in-children": "Fever in children: what to watch and when to go in",
    "choosing-a-hospital-nigeria": "Choosing a hospital in Nigeria: what actually matters",
}

def slugify(t):
    t = re.sub(r'[^a-z0-9\s-]', '', t.lower())
    return re.sub(r'\s+', '-', t.strip())[:80]

def inline(t):
    """Inline markdown -> html."""
    t = html.escape(t, quote=False)
    t = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', t)
    t = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', t)
    t = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', t)
    return t

def md_to_html(md):
    """Convert the article body (markdown) to HTML. Stops at SEO metadata."""
    # cut the SEO metadata block
    md = re.split(r'\n---+\s*\n\s*##\s*SEO metadata', md)[0]
    md = re.split(r'\n##\s*SEO metadata', md)[0]

    lines = md.split('\n')
    out, i = [], 0
    while i < len(lines):
        ln = lines[i].rstrip()
        s = ln.strip()

        # list block
        if re.match(r'^[-*]\s+', s):
            items = []
            while i < len(lines) and re.match(r'^[-*]\s+', lines[i].strip()):
                items.append('<li>%s</li>' % inline(re.sub(r'^[-*]\s+', '', lines[i].strip())))
                i += 1
            out.append('<ul>' + ''.join(items) + '</ul>')
            continue
        if re.match(r'^\d+\.\s+', s):
            items = []
            while i < len(lines) and re.match(r'^\d+\.\s+', lines[i].strip()):
                items.append('<li>%s</li>' % inline(re.sub(r'^\d+\.\s+', '', lines[i].strip())))
                i += 1
            out.append('<ol>' + ''.join(items) + '</ol>')
            continue

        if not s:
            i += 1; continue

        if s.startswith('### '):
            out.append('<h3>%s</h3>' % inline(s[4:]))
        elif s.startswith('## '):
            h = s[3:].strip()
            # an "urgent" section becomes a callout
            if re.search(r'urgent care|emergency', h, re.I):
                # gather the section
                j = i + 1
                blk = []
                while j < len(lines) and not lines[j].strip().startswith('#'):
                    blk.append(lines[j]); j += 1
                inner = md_to_html('\n'.join(blk))
                out.append(
                    '<div class="urgent"><span class="mono">%s</span>%s</div>'
                    % (html.escape(h), inner))
                i = j; continue
            out.append('<h2>%s</h2>' % inline(h))
        elif s == '---':
            out.append('<hr>')
        elif s.startswith('> '):
            out.append('<blockquote>%s</blockquote>' % inline(s[2:]))
        elif re.match(r'^\*\*[^*]+\*\*$', s):
            out.append('<h3>%s</h3>' % inline(s.strip('*')))
        else:
            out.append('<p>%s</p>' % inline(s))
        i += 1
    return '\n'.join(out)

PAGE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — FJMK</title>
<meta name="description" content="{desc}">
<meta property="og:title" content="{title}">
<meta property="og:description" content="{desc}">
<meta property="og:type" content="article">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/system.css">
</head>
<body>
<header>
  <div class="nav">
    <a href="../index.html" class="brand">FJMK<i>.</i></a>
    <a href="../index.html#journal" class="back"><span>&larr;</span> The journal</a>
    <a href="../index.html#contact" class="cta">Start a project</a>
  </div>
</header>

<article>
  <div class="wrap">
    <div class="a-head">
      <div class="eyebrow"><span class="mono">{cat}</span></div>
      <h1>{title}</h1>
      <div class="byline">
        <div class="av">DT</div>
        <div>
          <div class="nm">Written by Dr. Tolu</div>
          <div class="rl">Reviewed before publication · FJMK editorial</div>
        </div>
      </div>
    </div>
    <div class="body">
{body}
    </div>

    <div class="meta">
      <span class="mono" style="color:var(--muted)">Production notes</span>
      <dl style="margin-top:16px">
        <dt>Primary keyword</dt><dd>{kw}</dd>
        <dt>Search intent</dt><dd>{intent}</dd>
        <dt>Meta title</dt><dd>{metatitle}</dd>
        <dt>Slug</dt><dd>{slug}</dd>
        <dt>Source</dt><dd>FJMK patient-education library · {cat}</dd>
      </dl>
    </div>

    <div class="related">
      <div class="eyebrow"><span class="mono">More from the library</span></div>
      <div class="rel-grid">
{related}
      </div>
    </div>
  </div>
</article>

<footer>
  <div class="wrap">
    <div class="ft">
      <a href="../index.html" class="brand">FJMK<i>.</i></a>
      <p>Patient education written for clinics and hospitals, reviewed by a doctor
         before it is published.</p>
    </div>
    <div class="ft-bot">
      <span>&copy; 2026 FJMK Agency &middot; Lagos</span>
      <span>Built for clinics only</span>
    </div>
  </div>
</footer>
</body>
</html>
"""

def parse_meta(md):
    """Pull the SEO metadata block if present."""
    m = re.search(r'##\s*SEO metadata\s*\n(.*)$', md, re.S)
    meta = {"kw":"", "intent":"informational", "metatitle":"", "slug":""}
    if m:
        blk = m.group(1)
        for line in blk.split('\n'):
            line = line.strip().lstrip('-').strip()
            if line.lower().startswith('primary keyword'):
                meta["kw"] = line.split(':',1)[-1].strip()
            elif line.lower().startswith('search intent'):
                meta["intent"] = line.split(':',1)[-1].strip()
            elif line.lower().startswith('meta title'):
                meta["metatitle"] = line.split(':',1)[-1].strip()
            elif line.lower().startswith('suggested slug'):
                meta["slug"] = line.split(':',1)[-1].strip()
    return meta

def first_para(md):
    body = md.split('\n')
    buf = []
    started = False
    for ln in body:
        s = ln.strip()
        if not started:
            if s.startswith('#'):
                continue
            if s.lower().startswith('written by') or 'is a doctor' in s.lower():
                continue
            if s:
                started = True; buf.append(s)
        else:
            if not s:
                break
            buf.append(s)
    return ' '.join(buf)

def main():
    os.makedirs(OUT, exist_ok=True)
    made = []
    for folder, slug, cat in PICKS:
        path = os.path.join(SRC, folder, slug + ".md")
        if not os.path.exists(path):
            print("MISSING:", path); continue
        md = open(path, encoding='utf-8').read()

        # title
        tm = re.match(r'#\s*(.+)', md)
        title = TITLE_OVERRIDES.get(slug) or (tm.group(1).strip() if tm else slug)

        meta = parse_meta(md)
        body = md_to_html(md)
        desc = first_para(md)[:158].rsplit(' ',1)[0] + '.'

        # related: the other picks
        rel = []
        for f2, s2, c2 in PICKS:
            if s2 == slug: continue
            p2 = os.path.join(SRC, f2, s2 + ".md")
            if not os.path.exists(p2): continue
            m2 = open(p2, encoding='utf-8').read()
            t2 = TITLE_OVERRIDES.get(s2) or (re.match(r'#\s*(.+)', m2).group(1).strip())
            rel.append((c2, t2, s2))
        rel = rel[:3]
        rel_html = '\n'.join(
            '        <a class="rel" href="%s.html"><span class="mono">%s</span>'
            '<h3>%s</h3></a>' % (s, html.escape(c), html.escape(t))
            for c, t, s in rel)

        page = PAGE.format(
            title=html.escape(title), desc=html.escape(desc), cat=html.escape(cat),
            body=body, kw=html.escape(meta["kw"] or slug.replace('-',' ')),
            intent=html.escape(meta["intent"]), metatitle=html.escape(meta["metatitle"] or title),
            slug=html.escape(meta["slug"] or slug), related=rel_html)

        dst = os.path.join(OUT, slug + ".html")
        open(dst, "w", encoding="utf-8").write(page)
        made.append((slug, len(page), len(re.findall(r'<h2', body))))
        print(f"  {slug:34s} {len(page)//1024:4d}KB  {len(re.findall(r'<h2', body))} sections")

    print(f"\nGenerated {len(made)} article pages -> {OUT}")
    return made

if __name__ == "__main__":
    main()
