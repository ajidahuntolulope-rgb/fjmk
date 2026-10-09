#!/usr/bin/env python3
"""Build ALL FJMK journal pages from the agency content bank.

Supersedes gen_agency_journal.py (which only rendered one article).

Converts the marketing articles in `FMJK Agency Content/` into styled HTML
pages under `site/journal/`, stripping the internal SEO/production metadata
blocks and normalising the byline so it does not duplicate into the body.

Usage:  python gen_journal_all.py
"""
import html
import os
import re

SOURCE = r"C:\Users\User\hermes-work\FMJK Agency Content"
DEST = r"C:\Users\User\hermes-work\fjmk\site\journal"

# slug -> (folder, display category)
ARTICLES = [
    ("why-clinic-not-getting-patients-from-google", "08 Healthcare Marketing", "Healthcare marketing"),
    ("why-visitors-dont-book-appointments",         "03 Websites & Conversion", "Websites & conversion"),
    ("how-seo-works-hospitals-clinics",             "01 SEO",                   "SEO"),
    ("clinic-on-google-maps-guide",                 "05 Local Search",          "Local search"),
    ("reviews-and-patient-decisions",               "05 Local Search",          "Local search"),
    ("how-businesses-appear-in-chatgpt-answers-geo","02 GEO & AI Search",       "AI search"),
    ("entities-and-consistent-business-info",       "02 GEO & AI Search",       "AI search"),
    ("freshness-signals-in-ai-search",              "02 GEO & AI Search",       "AI search"),
    ("pages-every-clinic-website-needs",            "08 Healthcare Marketing",  "Healthcare marketing"),
    ("medical-content-and-trust",                   "08 Healthcare Marketing",  "Healthcare marketing"),
    ("website-cost-nigeria-2026",                   "10 Website Buying Guides", "Buying guide"),
]

AVAILABLE = {slug for slug, _, _ in ARTICLES}

AUTHOR_POOL = {
    "Oluwatobi Ajidahun": "OA",
}

# All agency articles carry a single byline.
BYLINE = "Oluwatobi Ajidahun"

RELATED = {
    "why-clinic-not-getting-patients-from-google": ["why-visitors-dont-book-appointments", "how-seo-works-hospitals-clinics", "clinic-on-google-maps-guide"],
    "why-visitors-dont-book-appointments":         ["why-clinic-not-getting-patients-from-google", "pages-every-clinic-website-needs", "website-cost-nigeria-2026"],
    "how-seo-works-hospitals-clinics":             ["clinic-on-google-maps-guide", "reviews-and-patient-decisions", "how-businesses-appear-in-chatgpt-answers-geo"],
    "clinic-on-google-maps-guide":                 ["reviews-and-patient-decisions", "how-seo-works-hospitals-clinics", "why-clinic-not-getting-patients-from-google"],
    "reviews-and-patient-decisions":               ["clinic-on-google-maps-guide", "why-clinic-not-getting-patients-from-google", "pages-every-clinic-website-needs"],
    "how-businesses-appear-in-chatgpt-answers-geo":["entities-and-consistent-business-info", "freshness-signals-in-ai-search", "how-seo-works-hospitals-clinics"],
    "entities-and-consistent-business-info":       ["how-businesses-appear-in-chatgpt-answers-geo", "freshness-signals-in-ai-search", "clinic-on-google-maps-guide"],
    "freshness-signals-in-ai-search":              ["how-businesses-appear-in-chatgpt-answers-geo", "entities-and-consistent-business-info", "reviews-and-patient-decisions"],
    "pages-every-clinic-website-needs":            ["why-visitors-dont-book-appointments", "website-cost-nigeria-2026", "medical-content-and-trust"],
    "medical-content-and-trust":                   ["pages-every-clinic-website-needs", "why-clinic-not-getting-patients-from-google", "reviews-and-patient-decisions"],
    "website-cost-nigeria-2026":                   ["pages-every-clinic-website-needs", "why-visitors-dont-book-appointments", "why-clinic-not-getting-patients-from-google"],
}

TITLES = {}


def read_source(folder, slug):
    with open(os.path.join(SOURCE, folder, slug + ".md"), encoding="utf-8") as fh:
        return fh.read()


def strip_metadata(md):
    """Drop the internal metadata block, keeping the article prose intact.

    Articles use `---` both as a section divider AND as the metadata separator,
    so we only cut at a rule whose following ~250 chars actually contain metadata
    fields. Some articles omit the rule entirely and start the block with
    `**Content metadata:**` or a bare `Author:` line.
    """
    cut = None

    # Case A: a rule followed (soon) by metadata fields.
    for m in re.finditer(r"\n-{3,}[ \t]*\n", md):
        after = md[m.end():m.end() + 250]
        if re.search(r"Author|Content metadata|Primary keyword|Content status|Meta title", after):
            cut = m.start()
            break

    # Case B: no usable rule — cut at an explicit metadata header.
    if cut is None:
        m = re.search(r"\n\*{0,2}Content metadata:\*{0,2}\s*\n", md)
        if m:
            cut = m.start()
        else:
            m = re.search(r"\n\*{0,2}Author(?: status)?:\*{0,2}", md)
            if m:
                cut = m.start()

    return md[:cut] if cut is not None else md


def field(md, name):
    for pat in (r"^\*\*" + re.escape(name) + r":\*\*\s*(.+)$",
                r"^" + re.escape(name) + r":\s*(.+)$"):
        m = re.search(pat, md, re.M)
        if m:
            return m.group(1).strip()
    return ""


def h1(md):
    m = re.search(r"^#\s+(.+)$", md, re.M)
    return m.group(1).strip() if m else ""


def inline(text):
    text = html.escape(text, quote=False)

    def link(m):
        label, target = m.group(1), m.group(2)
        stem = os.path.splitext(os.path.basename(target))[0]
        if stem in AVAILABLE:
            return '<a href="%s.html">%s</a>' % (html.escape(stem, quote=True), label)
        return "<span>%s</span>" % label

    text = re.sub(r"\[([^\]]+)\]\(([^)]+)\)", link, text)
    text = re.sub(r"\*\*([^*]+)\*\*", r"<strong>\1</strong>", text)
    text = re.sub(r"(?<!\*)\*([^*]+)\*(?!\*)", r"<em>\1</em>", text)
    return text


def render_blocks(lines):
    out, i = [], 0
    while i < len(lines):
        text = lines[i].strip()

        if not text or text.startswith("# ") or re.fullmatch(r"-{3,}", text):
            i += 1
            continue

        if text.startswith("### "):
            out.append("<h3>%s</h3>" % inline(text[4:].strip()))
            i += 1
            continue

        if text.startswith("## "):
            heading = text[3:].strip()
            if re.search(r"frequently asked|\bfaq\b", heading, re.I):
                i += 1
                continue
            out.append("<h2>%s</h2>" % inline(heading))
            i += 1
            continue

        if re.match(r"^[-*]\s+", text):
            items = []
            while i < len(lines) and re.match(r"^[-*]\s+", lines[i].strip()):
                items.append("<li>%s</li>" % inline(re.sub(r"^[-*]\s+", "", lines[i].strip())))
                i += 1
            out.append("<ul>%s</ul>" % "".join(items))
            continue

        if re.match(r"^\d+\.\s+", text):
            items = []
            while i < len(lines) and re.match(r"^\d+\.\s+", lines[i].strip()):
                items.append("<li>%s</li>" % inline(re.sub(r"^\d+\.\s+", "", lines[i].strip())))
                i += 1
            out.append("<ol>%s</ol>" % "".join(items))
            continue

        if re.fullmatch(r"\*\*[^*]+\?\*\*", text):
            out.append("<h3>%s</h3>" % inline(text[2:-2]))
            i += 1
            continue

        out.append("<p>%s</p>" % inline(text))
        i += 1
    return "\n".join(out)


TEMPLATE = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{meta_title} — FJMK</title>
<meta name="description" content="{description}">
<meta property="og:title" content="{og_title}">
<meta property="og:description" content="{description}">
<meta property="og:type" content="article">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/system.css">
</head>
<body>
<header><div class="nav">
  <a href="../index.html" class="brand">FJMK<i>.</i></a>
  <a href="../blog.html" class="back">&larr; The journal</a>
  <a href="../contact.html" class="cta">Start a project</a>
</div></header>
<main><article><div class="wrap">
  <div class="a-head">
    <div class="eyebrow"><span class="mono">{category}</span></div>
    <h1>{title}</h1>
    <div class="byline">
      <div class="av">{initials}</div>
      <div><div class="nm">{author}</div>
      <div class="rl">FJMK &middot; {category}</div></div>
    </div>
  </div>
  <div class="body">
{body}
  </div>
  <div class="meta">
    <dl>
      <dt>Reading time</dt><dd>{read_min} minutes</dd>
      <dt>Category</dt><dd>{category}</dd>
      <dt>Published</dt><dd>2026</dd>
    </dl>
  </div>
  <div class="related">
    <div class="eyebrow"><span class="mono">Keep reading</span></div>
    <div class="rel-grid">
{related}
    </div>
    <div style="margin-top:34px">
      <div class="eyebrow"><span class="mono">Work with us</span></div>
      <p class="small">Want a practical review of your clinic's website? Tell us
        what you do and where you are based.</p>
      <div style="margin-top:20px">
        <a class="cta" href="../contact.html">Start a project &rarr;</a>
      </div>
    </div>
  </div>
</div></article></main>
<footer><div class="wrap">
  <div class="ft">
    <a href="../index.html" class="brand">FJMK<i>.</i></a>
    <p>Websites and online patient acquisition for clinics and hospitals.</p>
  </div>
  <div class="ft-bot">
    <span>&copy; 2026 FJMK Agency &middot; Lagos</span>
    <span>Built for clinics only</span>
  </div>
</div></footer>
</body></html>"""


def build():
    os.makedirs(DEST, exist_ok=True)

    # First pass: collect titles for cross-linking.
    for slug, folder, _ in ARTICLES:
        TITLES[slug] = h1(read_source(folder, slug))

    written = []
    for slug, folder, category in ARTICLES:
        md = read_source(folder, slug)
        title = TITLES[slug]
        author = BYLINE
        meta_title = field(md, "Meta title") or title
        description = field(md, "Meta description") or ""
        read_min = max(1, round(len(md.split()) / 220))

        body_md = strip_metadata(md)
        body_md = re.sub(r"^#\s+.+$", "", body_md, count=1, flags=re.M)
        body_md = re.sub(r"^\*\*By .+?\*\*\s*$", "", body_md, count=1, flags=re.M)
        body_md = re.sub(r"^By .+?$", "", body_md, count=1, flags=re.M)
        body = render_blocks(body_md.splitlines())

        rel_html = []
        for rslug in RELATED.get(slug, []):
            rtitle = TITLES.get(rslug)
            if rtitle:
                rel_html.append(
                    '<a class="rel" href="%s.html"><span class="mono">Read next</span>'
                    "<h3>%s</h3></a>" % (rslug, html.escape(rtitle))
                )

        page = TEMPLATE.format(
            meta_title=html.escape(meta_title, quote=True),
            description=html.escape(description, quote=True),
            og_title=html.escape(title, quote=True),
            title=html.escape(title),
            category=html.escape(category),
            author=html.escape(author),
            initials=AUTHOR_POOL.get(author, "TA"),
            read_min=read_min,
            body=body,
            related="\n".join(rel_html),
        )

        with open(os.path.join(DEST, slug + ".html"), "w", encoding="utf-8") as fh:
            fh.write(page)
        written.append((slug, len(page), read_min, page.count("<h2>"), page.count("<li>")))

    print("%-48s %9s %6s %4s %5s" % ("SLUG", "BYTES", "READ", "H2", "LI"))
    for slug, size, rm, h2, li in written:
        print("%-48s %9s %5dm %4d %5d" % (slug, f"{size:,}", rm, h2, li))
    print("\nGenerated %d journal pages in %s" % (len(written), DEST))


if __name__ == "__main__":
    build()
