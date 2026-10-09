#!/usr/bin/env python3
"""Build FJMK's six featured patient-education pages from the Archer2 article bank."""
import html
import os
import re

SOURCE = r"C:\Users\User\hermes-work\FMJK Content"
DEST = r"C:\Users\User\hermes-work\fjmk\site\journal"

# Published byline for every patient-education article.
BYLINE = "Dr Tolulope Ajidahun"
BYLINE_INITIALS = "TA"
ARTICLES = [
    ("01 Men's Health", "erectile-dysfunction", "Men's health"),
    ("05 General Medicine", "hypertension", "General medicine"),
    ("05 General Medicine", "malaria", "General medicine"),
    ("03 Common Symptoms", "chest-pain", "Common symptoms"),
    ("06 Children's Health", "fever-in-children", "Children's health"),
    ("09 Other High-Intent Topics", "choosing-a-hospital-nigeria", "High intent"),
    # Women's health set — linked from the specialist clinic page.
    ("02 Women's Health", "female-infertility", "Women's health"),
    ("02 Women's Health", "pcos", "Women's health"),
    ("02 Women's Health", "endometriosis", "Women's health"),
    ("02 Women's Health", "menopause", "Women's health"),
    ("02 Women's Health", "ivf-in-nigeria", "Women's health"),
    ("02 Women's Health", "antenatal-care-nigeria", "Pregnancy"),
]
AVAILABLE = {slug for _, slug, _ in ARTICLES}


def inline(text):
    text = html.escape(text, quote=False)

    def replace_link(match):
        label, target = match.group(1), match.group(2)
        stem = os.path.splitext(os.path.basename(target))[0]
        safe_label = match.group(1)
        if stem in AVAILABLE:
            return f'<a href="{html.escape(stem, quote=True)}.html">{safe_label}</a>'
        # Preserve references to articles not included in this small site build,
        # but don't make links that lead to missing files.
        return f'<span>{safe_label}</span>'

    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', replace_link, text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', text)
    return text


def article_title(md):
    match = re.search(r'^#\s+(.+)$', md, re.M)
    if not match:
        raise ValueError('Article has no H1 title')
    return match.group(1).strip()


def author_lines(md):
    """Return (display name, review line) for the byline block.

    The published byline is fixed to the reviewing clinician; the source files
    may carry a placeholder name.
    """
    review_match = re.search(
        r'^(Dr\.?\s+\w[\w\s]*?(?:is a doctor (?:who|and) reviews this content before it is published\.))$',
        md, re.M,
    )
    review = review_match.group(1).strip() if review_match else 'Reviewed before publication.'
    return BYLINE, review


def metadata(md):
    out = {}
    block = re.search(r'^##\s*SEO metadata\s*\n(.*)$', md, re.M | re.S)
    if not block:
        return out
    for raw in block.group(1).splitlines():
        line = raw.strip().lstrip('-').strip()
        if ':' in line:
            key, value = line.split(':', 1)
            out[key.strip().lower()] = value.strip()
    return out


def render_blocks(lines):
    out = []
    i = 0
    while i < len(lines):
        text = lines[i].strip()
        if not text or text.startswith('# '):
            i += 1
            continue
        if text.startswith('## '):
            heading = text[3:].strip()
            if re.search(r'urgent care|emergency', heading, re.I):
                section = []
                i += 1
                while i < len(lines) and not lines[i].strip().startswith('#'):
                    section.append(lines[i])
                    i += 1
                out.append('<div class="urgent"><span class="mono">' + html.escape(heading) + '</span>' + render_blocks(section) + '</div>')
                continue
            out.append('<h2>' + inline(heading) + '</h2>')
            i += 1
            continue
        if text.startswith('### '):
            out.append('<h3>' + inline(text[4:].strip()) + '</h3>')
            i += 1
            continue
        if re.match(r'^[-*]\s+', text):
            items = []
            while i < len(lines) and re.match(r'^[-*]\s+', lines[i].strip()):
                item = re.sub(r'^[-*]\s+', '', lines[i].strip())
                items.append('<li>' + inline(item) + '</li>')
                i += 1
            out.append('<ul>' + ''.join(items) + '</ul>')
            continue
        if re.match(r'^\d+\.\s+', text):
            items = []
            while i < len(lines) and re.match(r'^\d+\.\s+', lines[i].strip()):
                item = re.sub(r'^\d+\.\s+', '', lines[i].strip())
                items.append('<li>' + inline(item) + '</li>')
                i += 1
            out.append('<ol>' + ''.join(items) + '</ol>')
            continue
        if text == '---':
            out.append('<hr>')
        elif re.fullmatch(r'\*\*[^*]+\?\*\*', text):
            out.append('<h3>' + inline(text[2:-2]) + '</h3>')
        else:
            out.append('<p>' + inline(text) + '</p>')
        i += 1
    return '\n'.join(out)


TEMPLATE = '''<!doctype html>
<html lang="en"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>{meta_title} — FJMK</title>
<meta name="description" content="{description}">
<meta property="og:title" content="{meta_title}"><meta property="og:description" content="{description}"><meta property="og:type" content="article">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/system.css">
</head><body>
<header><div class="nav"><a href="../index.html" class="brand">FJMK<i>.</i></a><a href="../blog.html" class="back">← The journal</a><a href="../contact.html" class="cta">Start a project</a></div></header>
<main><article><div class="wrap">
<div class="a-head"><div class="eyebrow"><span class="mono">{category}</span></div><h1>{title}</h1>
<div class="byline"><div class="av">{initials}</div><div><div class="nm">{author}</div><div class="rl">{review}</div></div></div></div>
<div class="body">{body}</div>
<div class="related"><div class="eyebrow"><span class="mono">Patient education for your clinic</span></div><p class="small">A useful clinic website answers the questions patients already have. We can help you plan a clear, well-structured patient-education library.</p><div style="margin-top:20px"><a class="cta" href="../contact.html">Talk to FJMK →</a></div></div>
</div></article></main>
<footer><div class="wrap"><div class="ft"><a href="../index.html" class="brand">FJMK<i>.</i></a><p>Websites and patient-education content for clinics and hospitals.</p></div><div class="ft-bot"><span>© 2026 FJMK Agency · Lagos</span><span>Built for clinics only</span></div></div></footer>
</body></html>'''


def build():
    os.makedirs(DEST, exist_ok=True)
    for folder, slug, category in ARTICLES:
        source = os.path.join(SOURCE, folder, slug + '.md')
        if not os.path.isfile(source):
            raise FileNotFoundError(source)
        with open(source, encoding='utf-8') as f:
            md = f.read()
        title = article_title(md)
        author, review = author_lines(md)
        meta = metadata(md)
        # The public article keeps the source's medical prose and review statement,
        # but not the internal SEO/production notes.
        body_source = re.split(r'^##\s*SEO metadata\s*$', md, maxsplit=1, flags=re.M)[0]
        body_source = re.sub(r'^Written by .+\n+', '', body_source, count=1, flags=re.M)
        # Strip the standalone review line so it does not duplicate the byline.
        body_source = re.sub(
            r'^Dr\.?\s+\w[\w\s]*?is a doctor (?:who|and) reviews this content before it is published\.\n+',
            '', body_source, count=1, flags=re.M)
        description = meta.get('meta description', '')
        meta_title = meta.get('meta title', title)
        page = TEMPLATE.format(
            title=html.escape(title, quote=True),
            meta_title=html.escape(meta_title, quote=True),
            description=html.escape(description, quote=True),
            category=html.escape(category, quote=True),
            author=html.escape(author, quote=True),
            review=html.escape(review, quote=True),
            initials=BYLINE_INITIALS,
            body=render_blocks(body_source.splitlines())
        )
        target = os.path.join(DEST, slug + '.html')
        with open(target, 'w', encoding='utf-8') as f:
            f.write(page)
        print(f'{slug}.html | {len(page):,} bytes | {page.count("<h2>")} sections | {page.count("<li>")} list entries')
    print(f'Generated {len(ARTICLES)} articles from source library.')

if __name__ == '__main__':
    build()
