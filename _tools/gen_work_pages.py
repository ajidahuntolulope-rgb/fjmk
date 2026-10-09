#!/usr/bin/env python3
"""Generate four distinct clinic-site examples linked from the FJMK homepage."""
import html, os

OUT = r"C:\Users\User\hermes-work\fjmk\site\work"

SITES = [
    {
        "slug":"dental", "name":"Ikeja Dental Studio", "type":"Dental care · Ikeja, Lagos",
        "tag":"Good care. Clear answers.", "title":"A healthier smile starts with a simple conversation.",
        "desc":"Thoughtful dental care for every age, with clear advice, careful treatment and a team that takes time to listen.",
        "services":[("General dentistry","Check-ups, cleaning and practical advice for keeping teeth healthy."),("Restorative care","Careful treatment planning for fillings, crowns and everyday dental concerns."),("Smile care","Discuss cosmetic options and decide what feels right for you.")],
        "image":"../assets/img/stationery.webp", "alt":"Warm neutral studio materials, stationery and detailed paper textures",
        "class":"dental", "initials":"ID", "open":"Mon–Fri, 8:30am–5pm · Saturday by appointment",
        "address":"Ikeja, Lagos", "promise":"Care that takes the time to explain.",
        "feature":"Your first visit, made simpler.", "copy":"Tell us what brings you in. Our front desk will help you find a suitable time and explain what to expect at your first appointment.",
        "phone":"+234 (0) 123 456 7890", "email":"hello@ikejadental.example"
    },
    {
        "slug":"family-clinic", "name":"Shomolu Family Clinic", "type":"Family medicine · Shomolu, Lagos",
        "tag":"Care for every chapter.", "title":"A local clinic for the questions you bring home.",
        "desc":"Family-focused medical care, clear information and a simple way to ask the clinic about your next visit.",
        "services":[("General consultations","Time to talk through what is worrying you and discuss next steps."),("Children’s health","Friendly, age-appropriate care for common childhood concerns."),("Preventive health","Routine checks and practical conversations about staying well.")],
        "image":"../assets/img/editorial-street.webp", "alt":"A relaxed portrait in cream knitwear against a city shutter",
        "class":"family", "initials":"SF", "open":"Mon–Sat, 8am–6pm",
        "address":"Shomolu, Lagos", "promise":"Familiar faces. Clear next steps.",
        "feature":"Start with a conversation.", "copy":"Let us know what kind of appointment you need and when you are available. Our team can help you arrange a visit.",
        "phone":"+234 (0) 123 456 7890", "email":"care@shomolufamily.example"
    },
    {
        "slug":"diagnostics", "name":"Meridian Diagnostics", "type":"Diagnostics & laboratory services · Lagos",
        "tag":"Know what to expect.", "title":"Testing, explained before you arrive.",
        "desc":"A straightforward guide to common laboratory services, preparing for a test and asking about sample collection.",
        "services":[("Routine blood tests","Ask about common blood tests and any preparation that may be needed."),("Wellness panels","Explore general screening panels and what to ask your clinician."),("Home sample request","Contact the team to ask whether home collection is available in your area.")],
        "image":"../assets/img/pattern-grid.webp", "alt":"A restrained architectural grid pattern in dark tones and warm neutral lines",
        "class":"diagnostics", "initials":"MD", "open":"Mon–Sat, 7:30am–5pm",
        "address":"Lagos, Nigeria", "promise":"Clear information, careful handling.",
        "feature":"Need to prepare for a test? Ask us first.", "copy":"Some tests need preparation. Contact our team with the test name and we will explain the next steps. For results, follow up with your healthcare professional.",
        "phone":"+234 (0) 123 456 7890", "email":"hello@meridiandiagnostics.example"
    },
    {
        "slug":"specialist", "name":"Lekki Fertility & Women's Clinic", "type":"Women's health · Lekki, Lagos",
        "tag":"Private care. Your pace.", "title":"Space to ask. Time to understand.",
        "desc":"A private, respectful place to ask questions about reproductive health and discuss the right next step with a clinician.",
        "services":[("Fertility consultations","A confidential appointment to discuss your questions, history and options."),("Women's health","Support for a range of reproductive and hormonal health concerns."),("Second opinions","Bring your questions and records for a considered conversation.")],
        "image":"../assets/img/texture-terracotta.webp", "alt":"A warm terracotta textile texture with natural folds and soft light",
        "class":"specialist", "initials":"LW", "open":"Mon–Fri, 9am–5pm · By appointment",
        "address":"Lekki, Lagos", "promise":"Thoughtful care, without the rush.",
        "feature":"Your conversation stays private.", "copy":"You can ask our team about an appointment or the right service before sharing any medical details. We will help you find a suitable next step.",
        "phone":"+234 (0) 123 456 7890", "email":"hello@lekkifertility.example"
    }
]

CSS = '''
:root{--paper:#f3efe7;--ink:#1d1c19;--muted:#71695e;--terra:#a9573f;--rule:rgba(29,28,25,.15);--serif:'Instrument Serif',Georgia,serif;--sans:'Manrope',Arial,sans-serif;--mono:'JetBrains Mono',monospace}
*{box-sizing:border-box}html{scroll-behavior:smooth}body{margin:0;background:var(--paper);color:var(--ink);font-family:var(--sans);line-height:1.6;-webkit-font-smoothing:antialiased}a{color:inherit;text-decoration:none}.top{position:sticky;top:0;z-index:5;background:rgba(243,239,231,.92);backdrop-filter:blur(12px);border-bottom:1px solid var(--rule)}.nav{height:66px;max-width:1320px;padding:0 5vw;margin:auto;display:flex;align-items:center;justify-content:space-between}.wordmark{font:1.5rem var(--serif);letter-spacing:-.03em}.wordmark b{font-weight:400}.back,.navcta,.eyebrow,.btn,.footnote{font:500 .65rem var(--mono);letter-spacing:.13em;text-transform:uppercase}.back{color:var(--muted)}.back:hover{color:var(--terra)}.navcta{border:1px solid var(--ink);padding:10px 14px}.wrap{max-width:1320px;margin:auto;padding:0 5vw}.hero{padding:clamp(50px,8vw,110px) 0 64px;display:grid;grid-template-columns:1.03fr .97fr;gap:6vw;align-items:center}.eyebrow{color:var(--terra);display:flex;align-items:center;gap:12px}.eyebrow:before{content:'';width:30px;height:1px;background:var(--terra)}h1,h2,h3,p{margin-top:0}.hero h1{font:400 clamp(3.4rem,7.3vw,7.7rem)/.92 var(--serif);letter-spacing:-.035em;max-width:9ch;margin:24px 0}.intro{font-size:clamp(1rem,1.25vw,1.13rem);font-weight:300;line-height:1.75;color:#524c43;max-width:48ch}.btn{display:inline-flex;align-items:center;gap:12px;background:var(--ink);color:var(--paper);padding:15px 20px;margin-top:22px;transition:background .25s,transform .25s}.btn:hover{background:var(--terra);transform:translateY(-2px)}.hero-img{height:clamp(370px,52vw,650px);width:100%;object-fit:cover;object-position:center 35%}.hero-note{font: .62rem var(--mono);letter-spacing:.14em;color:var(--muted);margin-top:12px;text-transform:uppercase}.facts{display:flex;gap:30px;flex-wrap:wrap;border-top:1px solid var(--rule);margin-top:38px;padding-top:20px}.facts span{font: .62rem var(--mono);letter-spacing:.1em;text-transform:uppercase;color:var(--muted)}.facts b{font:1rem var(--serif);color:var(--ink);display:block;margin-top:4px}.band{background:#e8e2d7;padding:clamp(46px,7vw,90px) 0}.section{padding:clamp(60px,8vw,112px) 0}.section h2{font:400 clamp(2.3rem,5vw,4.7rem)/.98 var(--serif);letter-spacing:-.025em;margin:15px 0 25px}.split{display:grid;grid-template-columns:.85fr 1.15fr;gap:8vw;align-items:start}.largecopy{font:400 clamp(1.4rem,2.6vw,2.4rem)/1.23 var(--serif)}.services{display:grid;grid-template-columns:repeat(3,1fr);gap:1px;background:var(--rule);border:1px solid var(--rule);margin-top:35px}.service{background:var(--paper);padding:28px;min-height:190px;display:flex;flex-direction:column}.service .num{font: .62rem var(--mono);color:var(--terra);letter-spacing:.14em}.service h3{font:400 1.6rem/1.05 var(--serif);margin: auto 0 10px}.service p{font-weight:300;color:var(--muted);font-size:.88rem;margin-bottom:0}.callout{background:#e8e2d7;padding:clamp(30px,5vw,64px);display:grid;grid-template-columns:.8fr 1.2fr;gap:7vw;align-items:center}.callout h2{font:400 clamp(2rem,4.3vw,3.6rem)/1 var(--serif);margin:12px 0}.callout p{font-weight:300;color:#514a42}.info{display:grid;grid-template-columns:repeat(3,1fr);border-top:1px solid var(--rule);border-bottom:1px solid var(--rule);margin-top:35px}.info div{padding:23px 18px 23px 0}.info div+div{border-left:1px solid var(--rule);padding-left:22px}.info .label{font: .61rem var(--mono);letter-spacing:.12em;color:var(--muted);text-transform:uppercase}.info strong{display:block;font-weight:400;margin-top:8px}.final{padding:clamp(60px,9vw,120px) 0;text-align:center}.final h2{font:400 clamp(2.8rem,6.8vw,6rem)/.95 var(--serif);letter-spacing:-.03em;max-width:11ch;margin:18px auto}.final p{max-width:46ch;margin:0 auto;color:var(--muted);font-weight:300}.final .btn{margin-top:26px}.foot{background:#1d1c19;color:rgba(243,239,231,.8);padding:35px 0 22px}.footrow{display:flex;justify-content:space-between;gap:20px;flex-wrap:wrap;align-items:center}.foot .back{color:rgba(243,239,231,.6)}.footnote{font-size:.58rem;color:rgba(243,239,231,.4);margin-top:22px}.notice{font-size:.78rem;color:var(--muted);margin-top:10px}.dental{--terra:#97523e}.family{--terra:#64755e;--paper:#f2f0e7}.diagnostics{--terra:#5f7275;--paper:#efeee9}.specialist{--terra:#9b624a;--paper:#f5eee7}
@media(max-width:760px){.hero{grid-template-columns:1fr;gap:34px;padding-top:54px}.hero h1{max-width:11ch}.hero-img{height:95vw;max-height:560px}.split,.callout{grid-template-columns:1fr;gap:24px}.services{grid-template-columns:1fr}.service{min-height:155px}.info{grid-template-columns:1fr}.info div+div{border-left:0;border-top:1px solid var(--rule);padding-left:0}.nav{padding:0 20px}.wrap{padding:0 20px}.navcta{padding:9px 10px}.back{font-size:.58rem}}
@media(prefers-reduced-motion:reduce){html{scroll-behavior:auto}*,*:before,*:after{transition:none!important}}
'''

PAGE = '''<!doctype html><html lang="en" class="{class}"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>{name} — Patient-centred care</title><meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com"><link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Serif:ital@0;1&family=Manrope:wght@300;400;500;600&family=JetBrains+Mono:wght@400;500&display=swap" rel="stylesheet">
<style>{css}</style></head><body>
<header class="top"><div class="nav"><a href="../index.html" class="wordmark"><b>{name}</b></a><a class="back" href="../index.html#work">← FJMK studio</a><a class="navcta" href="#contact">Ask about a visit</a></div></header>
<main>
<section class="hero wrap"><div><div class="eyebrow">{type}</div><h1>{title}</h1><p class="intro">{desc}</p><a class="btn" href="#contact">Make an enquiry <span>→</span></a><div class="facts"><div><span>Location</span><b>{address}</b></div><div><span>Appointments</span><b>By request</b></div></div></div><div><img class="hero-img" src="{image}" alt="{alt}" width="1200" height="1000"><div class="hero-note">{tag}</div></div></section>
<section class="band"><div class="wrap split"><div><div class="eyebrow">A considered approach</div><h2 class="section" style="padding:18px 0 0;margin:0;font:400 clamp(2.3rem,5vw,4.7rem)/.98 var(--serif);letter-spacing:-.025em">{promise}</h2></div><p class="largecopy">Good care begins with being heard. We make it easier to understand what the clinic offers, ask a question and arrange a conversation.</p></div></section>
<section class="section wrap"><div class="eyebrow">Services</div><h2>Care, clearly explained.</h2><p class="intro">A starting point for a conversation with our team. A clinician can advise on your individual situation.</p><div class="services">{services}</div></section>
<section class="section wrap" id="contact"><div class="callout"><div><div class="eyebrow">Get in touch</div><h2>{feature}</h2></div><div><p>{copy}</p><div class="info"><div><span class="label">Call</span><strong><a href="tel:{tel}">{phone}</a></strong></div><div><span class="label">Email</span><strong><a href="mailto:{email}">{email}</a></strong></div><div><span class="label">Hours</span><strong>{open}</strong></div></div><p class="notice">Please do not send private medical information by email.</p></div></div></section>
<section class="final wrap"><div class="eyebrow" style="justify-content:center">A good first step</div><h2>Ask us what to expect.</h2><p>Our team can help you find the right service and arrange an appointment.</p><a class="btn" href="mailto:{email}?subject=Appointment%20enquiry">Email the clinic →</a></section>
</main><footer class="foot"><div class="wrap"><div class="footrow"><a href="../index.html" class="wordmark" style="color:var(--paper)">FJMK<span style="color:var(--terra)">.</span></a><span class="back">{name} · {address}</span></div><div class="footnote">© 2026 {name} · Information on this site is general and does not replace advice from a qualified healthcare professional.</div></div></footer></body></html>'''


def main():
    os.makedirs(OUT, exist_ok=True)
    for item in SITES:
        services = ''.join(f'<article class="service"><span class="num">{i:02d}</span><h3>{html.escape(title)}</h3><p>{html.escape(copy)}</p></article>' for i, (title, copy) in enumerate(item['services'], 1))
        data = dict(item, css=CSS, services=services, tel='2340123456789')
        page = PAGE.format(**{k:html.escape(str(v), quote=True) if k not in ('css','services') else v for k,v in data.items()})
        path = os.path.join(OUT, item['slug'] + '.html')
        with open(path, 'w', encoding='utf-8') as f:
            f.write(page)
        print(f'{item["slug"]}.html: {len(page):,} bytes, {len(item["services"])} service cards')
    print(f'Generated {len(SITES)} clinic concept pages in {OUT}')

if __name__ == '__main__':
    main()
