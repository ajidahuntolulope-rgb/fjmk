#!/usr/bin/env python3
"""Render FJMK's actual agency-marketing article in the shared editorial shell."""
import html
import os
import re

SRC = r"C:\Users\User\hermes-work\FMJK Agency Content\08 Healthcare Marketing\why-clinic-not-getting-patients-from-google.md"
SITE = r"C:\Users\User\hermes-work\fjmk\site"
OUT = os.path.join(SITE, "journal", "why-clinic-not-getting-patients-from-google.html")


def inline(text):
    text = html.escape(text, quote=False)
    text = re.sub(r'\[([^\]]+)\]\(([^)]+)\)', r'<a href="\2">\1</a>', text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<strong>\1</strong>', text)
    text = re.sub(r'(?<!\*)\*([^*]+)\*(?!\*)', r'<em>\1</em>', text)
    return text


def render_body(markdown):
    # Strip the editorial metadata block; keep article prose and its FAQs.
    markdown = re.split(r'\n---+\s*\n\s*\*\*Content metadata:', markdown, maxsplit=1)[0]
    lines = markdown.splitlines()
    out, i = [], 0
    while i < len(lines):
        s = lines[i].strip()
        if not s:
            i += 1
            continue
        if s.startswith('# '):
            i += 1
            continue
        if s.startswith('## '):
            out.append(f'<h2>{inline(s[3:])}</h2>')
            i += 1
            continue
        if s.startswith('### '):
            out.append(f'<h3>{inline(s[4:])}</h3>')
            i += 1
            continue
        if re.match(r'^[-*]\s+', s):
            items=[]
            while i < len(lines) and re.match(r'^[-*]\s+', lines[i].strip()):
                items.append(f'<li>{inline(re.sub(r"^[-*]\\s+", "", lines[i].strip()))}</li>')
                i += 1
            out.append('<ul>' + ''.join(items) + '</ul>')
            continue
        if re.match(r'^\d+\.\s+', s):
            items=[]
            while i < len(lines) and re.match(r'^\d+\.\s+', lines[i].strip()):
                item = re.sub(r'^\d+\.\s+', '', lines[i].strip())
                items.append(f'<li>{inline(item)}</li>')
                i += 1
            out.append('<ol>' + ''.join(items) + '</ol>')
            continue
        if s == '---':
            out.append('<hr>')
            i += 1
            continue
        # Bold question on its own line becomes a subheading, not a separate blank paragraph.
        if re.match(r'^\*\*.+\?\*\*$', s):
            out.append(f'<h3>{inline(s[2:-2])}</h3>')
            i += 1
            continue
        out.append(f'<p>{inline(s)}</p>')
        i += 1
    return '\n'.join(out)


def main():
    with open(SRC, encoding='utf-8') as f:
        md = f.read()
    title = re.search(r'^#\s+(.+)$', md, re.M).group(1).strip()
    title = title.replace(' (And Where the Leak Actually Is)', ' (And Where the Leak Is)')
    desc = 'Traffic without bookings is a conversion problem, not a traffic problem. Find where clinic websites lose enquiries and how to fix it.'
    body = render_body(md)
    page = f'''<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8"><meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{html.escape(title)} — FJMK</title>
<meta name="description" content="{html.escape(desc)}">
<meta property="og:title" content="{html.escape(title)}"><meta property="og:description" content="{html.escape(desc)}"><meta property="og:type" content="article">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/system.css">
</head>
<body>
<header><div class="nav"><a href="../index.html" class="brand">FJMK<i>.</i></a><a href="../index.html#journal" class="back">← Journal</a><a href="../index.html#contact" class="cta">Start a project</a></div></header>
<article><div class="wrap">
  <div class="a-head"><div class="eyebrow"><span class="mono">Healthcare marketing · Conversion</span></div><h1>{html.escape(title)}</h1>
    <div class="byline"><div class="av">TA</div><div><div class="nm">Tobi Adeyemi</div><div class="rl">FJMK · Healthcare marketing</div></div></div>
  </div>
  <div class="body">{body}</div>
  <div class="related"><div class="eyebrow"><span class="mono">Next step</span></div><p class="small">Want a practical review of your clinic's website? Tell us what you do and where you're based.</p><div style="margin-top:20px"><a class="nav cta" href="../index.html#contact">Get a website review →</a></div></div>
</div></article>
<footer><div class="wrap"><div class="ft"><a href="../index.html" class="brand">FJMK<i>.</i></a><p>Websites and online patient acquisition for clinics and hospitals.</p></div><div class="ft-bot"><span>© 2026 FJMK Agency · Lagos</span><span>Built for clinics only</span></div></div></footer>
</body></html>'''
    os.makedirs(os.path.dirname(OUT), exist_ok=True)
    with open(OUT, 'w', encoding='utf-8') as f:
        f.write(page)
    print(f'Wrote {OUT} ({len(page):,} bytes; {page.count("<h2>")} section headings; {page.count("<li>")} list items)')

if __name__ == '__main__':
    main()
