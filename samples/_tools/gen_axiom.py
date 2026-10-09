#!/usr/bin/env python3
"""Generate Axiom Diagnostics sub-pages: tests, home-collection, results, about."""
import os

DEST = r"C:\Users\User\hermes-work\fjmk\samples\02-axiom-labs"

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — Axiom Diagnostics</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Instrument+Sans:ital,wght@0,400;0,500;0,600;1,400&family=IBM+Plex+Mono:wght@300;400;500;600&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/axiom.css">
<style>
.page-head{{padding:clamp(44px,5.6vw,84px) 0 clamp(26px,3.4vw,46px);border-bottom:1px solid var(--hair)}}
.page-head h1{{font-family:var(--sans);font-weight:600;line-height:.98;letter-spacing:-.042em;
  font-size:clamp(2.2rem,5.4vw,4.6rem);max-width:18ch;margin-bottom:24px}}
.prose{{max-width:760px}}
.prose h2{{font-weight:600;font-size:clamp(1.3rem,2.3vw,1.9rem);letter-spacing:-.03em;
  line-height:1.1;margin:clamp(34px,4vw,52px) 0 16px}}
.prose h3{{font-weight:600;font-size:1.05rem;letter-spacing:-.02em;margin:26px 0 10px}}
.prose p{{font-size:1rem;line-height:1.78;color:var(--ink-2);margin-bottom:18px}}
.prose ul{{margin:0 0 20px 0;padding-left:20px}}
.prose li{{font-size:.98rem;line-height:1.72;color:var(--ink-2);margin-bottom:9px}}
.prose li::marker{{color:var(--assay)}}
.prose strong{{font-weight:600;color:var(--ink)}}
.ctable{{width:100%;border:1px solid var(--hair);border-collapse:collapse;margin:clamp(24px,3vw,40px) 0;
  font-size:.9rem;background:var(--panel)}}
.ctable th,.ctable td{{padding:12px 16px;text-align:left;border-bottom:1px solid var(--hair-2)}}
.ctable th{{font-family:var(--mono);font-size:.55rem;letter-spacing:.12em;text-transform:uppercase;
  color:var(--muted);background:var(--panel-2);font-weight:500;border-bottom:1px solid var(--hair)}}
.ctable td.num{{font-family:var(--mono);font-variant-numeric:tabular-nums;white-space:nowrap}}
.ctable tr:last-child td{{border-bottom:0}}
.ctable .grp{{font-family:var(--mono);font-size:.5rem;letter-spacing:.1em;text-transform:uppercase;
  color:var(--assay-dim);background:var(--assay-wash);padding:2px 6px;border-radius:2px}}
.fg{{margin-bottom:20px}}
.fg label{{display:block;font-family:var(--mono);font-size:.56rem;letter-spacing:.13em;
  text-transform:uppercase;color:var(--muted);margin-bottom:8px}}
.fg input,.fg select,.fg textarea{{width:100%;border:1px solid var(--hair);background:var(--bg);
  padding:11px 13px;border-radius:2px;font-family:var(--sans);font-size:.94rem;color:var(--ink);
  transition:border-color .25s,background .25s}}
.fg textarea{{resize:vertical;min-height:96px;line-height:1.6}}
.fg input:focus,.fg select:focus,.fg textarea:focus{{outline:0;border-color:var(--assay);background:var(--panel)}}
.fg input::placeholder,.fg textarea::placeholder{{color:#A6B0AA}}
.f2{{display:grid;grid-template-columns:1fr 1fr;gap:18px}}
.panelbox{{border:1px solid var(--hair);background:var(--panel);border-radius:3px;
  padding:clamp(22px,3vw,42px)}}
@media(max-width:720px){{.f2{{grid-template-columns:1fr}}}}
</style>
</head>
<body>
<div class="above">
<header>
  <div class="nav">
    <a href="index.html" class="brand"><span class="mark" aria-hidden="true"></span>Axiom</a>
    <ul class="navlinks" id="nav">
      <li><a href="tests.html"{t_cur}>Tests</a></li>
      <li><a href="home-collection.html"{h_cur}>Home collection</a></li>
      <li><a href="results.html"{r_cur}>Results</a></li>
      <li><a href="about.html"{a_cur}>About</a></li>
      <li><a href="index.html#book" class="nav-cta">Book a test</a></li>
    </ul>
    <button class="burger" id="burger" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>
"""

FOOT = """
<footer>
  <div class="wrap">
    <div class="ft">
      <div class="ft-brand">
        <a href="index.html" class="brand"><span class="mark" aria-hidden="true"></span>Axiom</a>
        <p>Accredited diagnostic laboratory services across Lagos. Home collection,
          same-day results, published prices.</p>
      </div>
      <div class="ft">
        <h4>Services</h4>
        <ul>
          <li><a href="tests.html">Test catalogue</a></li>
          <li><a href="home-collection.html">Home collection</a></li>
          <li><a href="results.html">Results portal</a></li>
          <li><a href="tests.html">Wellness panels</a></li>
        </ul>
      </div>
      <div class="ft">
        <h4>Company</h4>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="about.html">Accreditation</a></li>
          <li><a href="about.html">Centres</a></li>
        </ul>
      </div>
      <div class="ft">
        <h4>Book</h4>
        <ul>
          <li><a href="index.html#book">Book a test</a></li>
          <li><a href="home-collection.html">Request a home visit</a></li>
          <li><a href="results.html">Access my results</a></li>
        </ul>
      </div>
    </div>
    <div class="ft-bot">
      <span>&copy; 2026 Axiom Diagnostics &middot; Lagos</span>
      <span>Results must be interpreted by a qualified clinician</span>
    </div>
  </div>
</footer>
</div>
<script src="assets/js/axiom.js"></script>
</body>
</html>
"""


def page(title, desc, body, cur=""):
    flags = {k: (' aria-current="page"' if cur == k[0] else "") for k in
             ("t_cur", "h_cur", "r_cur", "a_cur")}
    return HEAD.format(title=title, desc=desc, **flags) + body + FOOT


# ------------------------------------------------------------------ TESTS
TESTS = """
<section class="page-head">
  <div class="wrap">
    <div class="eyebrow"><span class="mono">Catalogue</span></div>
    <h1>Every test we run,<br>with the price on it.</h1>
    <p class="lead">247 accredited tests. Fixed prices, published turnaround times,
      and a reference range on every result. Nothing here requires a phone call to
      find out what it costs.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <table class="ctable">
      <thead>
        <tr><th>Code</th><th>Test</th><th>Category</th><th>Turnaround</th><th>Price</th></tr>
      </thead>
      <tbody id="rows"></tbody>
    </table>
    <p class="small" style="margin-top:16px">Prices include sample collection at any
      Axiom centre. Home collection adds &#8358;7,500. Prices shown are illustrative
      for this demonstration.</p>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="cta rv">
      <div>
        <div class="eyebrow"><span class="mono">Ready</span></div>
        <h2 class="h2">Build a panel<br>and pay online.</h2>
        <p class="lead" style="margin-top:18px">Select as many tests as you need,
          choose a slot, and a phlebotomist comes to you or you visit a centre.</p>
      </div>
      <div class="cta-actions">
        <a href="index.html#book" class="btn btn-p">Book a test <span class="ar">&rarr;</span></a>
        <a href="home-collection.html" class="btn">Home collection</a>
      </div>
    </div>
  </div>
</section>
"""

TESTS_JS = """
<script>
(function(){
  var TESTS = [
    {c:'AXM-P01', n:'Complete Metabolic Panel', g:'Panels', t:'12h', p:42000},
    {c:'AXM-P02', n:'Full Blood Count + Differential', g:'Panels', t:'4h', p:14500},
    {c:'AXM-P03', n:'Lipid Profile', g:'Panels', t:'8h', p:18500},
    {c:'AXM-P04', n:'Thyroid Function Panel', g:'Panels', t:'24h', p:34000},
    {c:'AXM-P05', n:'Liver Function Panel', g:'Panels', t:'10h', p:26500},
    {c:'AXM-P06', n:'Executive Wellness Panel', g:'Panels', t:'24h', p:98000},
    {c:'AXM-P07', n:'Antenatal Profile', g:'Panels', t:'12h', p:39500},
    {c:'AXM-P08', n:'Diabetes Monitoring Panel', g:'Panels', t:'12h', p:31500},
    {c:'AXM-H01', n:'Haemoglobin', g:'Haematology', t:'2h', p:6500},
    {c:'AXM-H02', n:'Erythrocyte Sedimentation Rate', g:'Haematology', t:'3h', p:7800},
    {c:'AXM-H03', n:'Blood Group & Rhesus', g:'Haematology', t:'3h', p:8200},
    {c:'AXM-H04', n:'Genotype (Hb Electrophoresis)', g:'Haematology', t:'8h', p:12500},
    {c:'AXM-H05', n:'Coagulation Profile', g:'Haematology', t:'6h', p:24000},
    {c:'AXM-C01', n:'Fasting Blood Glucose', g:'Chemistry', t:'2h', p:6800},
    {c:'AXM-C02', n:'HbA1c', g:'Chemistry', t:'8h', p:17500},
    {c:'AXM-C03', n:'Urea & Electrolytes', g:'Chemistry', t:'6h', p:15900},
    {c:'AXM-C04', n:'Serum Creatinine', g:'Chemistry', t:'4h', p:8500},
    {c:'AXM-C05', n:'Uric Acid', g:'Chemistry', t:'5h', p:9200},
    {c:'AXM-C06', n:'Serum Calcium', g:'Chemistry', t:'5h', p:9600},
    {c:'AXM-R01', n:'Testosterone (Total)', g:'Hormones', t:'24h', p:28000},
    {c:'AXM-R02', n:'Oestradiol', g:'Hormones', t:'24h', p:29500},
    {c:'AXM-R03', n:'Prolactin', g:'Hormones', t:'24h', p:26500},
    {c:'AXM-R04', n:'FSH & LH', g:'Hormones', t:'24h', p:41000},
    {c:'AXM-R05', n:'Progesterone', g:'Hormones', t:'24h', p:27500},
    {c:'AXM-R06', n:'Vitamin D (25-OH)', g:'Hormones', t:'48h', p:38500},
    {c:'AXM-I01', n:'Malaria Parasite (RDT)', g:'Infections', t:'30m', p:4500},
    {c:'AXM-I02', n:'Malaria Parasite (Microscopy)', g:'Infections', t:'3h', p:6200},
    {c:'AXM-I03', n:'Widal Test', g:'Infections', t:'5h', p:8900},
    {c:'AXM-I04', n:'Hepatitis B Surface Antigen', g:'Infections', t:'6h', p:11200},
    {c:'AXM-I05', n:'Hepatitis C Antibody', g:'Infections', t:'6h', p:11800},
    {c:'AXM-I06', n:'HIV 1 & 2 Screening', g:'Infections', t:'3h', p:10500},
    {c:'AXM-I07', n:'Urine Culture & Sensitivity', g:'Infections', t:'48h', p:21500},
    {c:'AXM-I08', n:'Stool Culture & Sensitivity', g:'Infections', t:'48h', p:20500},
    {c:'AXM-W01', n:'Prostate Specific Antigen', g:'Wellness', t:'12h', p:24500},
    {c:'AXM-W02', n:'CA-125', g:'Wellness', t:'48h', p:36000},
    {c:'AXM-W03', n:'Ferritin & Iron Studies', g:'Wellness', t:'24h', p:32000},
    {c:'AXM-W04', n:'Vitamin B12 & Folate', g:'Wellness', t:'24h', p:34500},
    {c:'AXM-W05', n:'Urinalysis (Dipstick + Micro)', g:'Wellness', t:'2h', p:7200},
    {c:'AXM-W06', n:'H. pylori Antigen (Stool)', g:'Wellness', t:'24h', p:19800}
  ];
  var body = document.getElementById('rows');
  body.innerHTML = TESTS.map(function(t){
    return '<tr><td class="num">' + t.c + '</td>' +
      '<td>' + t.n + '</td>' +
      '<td><span class="grp">' + t.g + '</span></td>' +
      '<td class="num">' + t.t + '</td>' +
      '<td class="num">&#8358;' + t.p.toLocaleString('en-NG') + '</td></tr>';
  }).join('');
})();
</script>
"""

# ------------------------------------------------------------------ HOME COLLECTION
HOME = """
<section class="page-head">
  <div class="wrap">
    <div class="eyebrow"><span class="mono">Home collection</span></div>
    <h1>We come to you.<br>In a two-hour<br>window.</h1>
    <p class="lead">Twelve phlebotomists on the road across Lagos, six days a week.
      You get a named collector, a photo before they arrive, and a two-hour window
      rather than a whole-day promise.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="grid3">
      <article class="card rv">
        <span class="n">01</span>
        <h3 class="h3">You book a slot</h3>
        <p>Pick a two-hour window that suits you. Morning slots fill fastest, so
          book a day ahead if you can.</p>
      </article>
      <article class="card rv">
        <span class="n">02</span>
        <h3 class="h3">You meet your collector</h3>
        <p>You receive the name and photograph of the phlebotomist assigned to you,
          along with an arrival estimate.</p>
      </article>
      <article class="card rv">
        <span class="n">03</span>
        <h3 class="h3">Results, same as the lab</h3>
        <p>Samples go straight to the same analysers. Turnaround is identical to
          visiting a centre.</p>
      </article>
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="prose">
      <h2>What a home visit costs</h2>
      <p>A flat <strong>&#8358;7,500</strong> per visit anywhere in our Lagos
        coverage area, added to the price of your tests. No distance surcharge
        within the zone, no per-test fee, no separate handling charge.</p>

      <h2>Where we go</h2>
      <p>We currently cover the mainland and island zones below. If you are just
        outside, contact us — we often can, and we will tell you honestly if the
        sample will be compromised by travel time.</p>

      <table class="ctable">
        <thead><tr><th>Zone</th><th>Areas</th><th>Visit fee</th></tr></thead>
        <tbody>
          <tr><td>Island</td><td>Victoria Island, Ikoyi, Lekki Phase 1, Oniru</td>
            <td class="num">&#8358;7,500</td></tr>
          <tr><td>Mainland North</td><td>Ikeja, Yaba, Surulere, Maryland, Ogba</td>
            <td class="num">&#8358;7,500</td></tr>
          <tr><td>Mainland South</td><td>Shomolu, Gbagada, Ikorodu Road, Ajah</td>
            <td class="num">&#8358;7,500</td></tr>
          <tr><td>Extended</td><td>Festac, Amuwo, Agege, Alimosho</td>
            <td class="num">&#8358;9,000</td></tr>
        </tbody>
      </table>

      <h2>What to expect</h2>
      <ul>
        <li>Your collector carries a cold chain box and single-use, sealed
          consumables opened in front of you.</li>
        <li>Most collections take ten minutes. Fasting tests need you to have fasted
          for eight hours — water is fine.</li>
        <li>If a sample is compromised in transit we re-collect at no cost. It
          happens rarely and it is our problem, not yours.</li>
        <li>You will receive a receipt and a tracking reference by SMS before the
          collector leaves.</li>
      </ul>

      <h2>Who this is for</h2>
      <p>People with a chronic condition who need regular monitoring and cannot
        keep taking half a day off work. Parents of small children, where a trip to
        a lab is its own ordeal. Elderly patients for whom a journey across Lagos is
        genuinely difficult. Anyone who would rather not sit in a waiting room.</p>
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="panelbox">
      <div class="eyebrow"><span class="mono">Request a home visit</span></div>
      <h2 class="h2" style="margin-bottom:12px">Book a collection.</h2>
      <p class="lead" style="margin-bottom:26px">Tell us where you are and what you
        need. We will confirm your window by SMS.</p>
      <form id="hcform" novalidate>
        <div class="f2">
          <div class="fg">
            <label for="nm">Full name</label>
            <input id="nm" name="nm" type="text" placeholder="Chidinma Eze" required>
          </div>
          <div class="fg">
            <label for="ph">Phone</label>
            <input id="ph" name="ph" type="tel" placeholder="0803 000 0000" required>
          </div>
        </div>
        <div class="f2">
          <div class="fg">
            <label for="zone">Zone</label>
            <select id="zone" name="zone">
              <option value="">Select&hellip;</option>
              <option>Island &mdash; VI, Ikoyi, Lekki, Oniru</option>
              <option>Mainland North &mdash; Ikeja, Yaba, Surulere</option>
              <option>Mainland South &mdash; Shomolu, Gbagada, Ajah</option>
              <option>Extended &mdash; Festac, Amuwo, Agege</option>
            </select>
          </div>
          <div class="fg">
            <label for="slot">Preferred window</label>
            <select id="slot" name="slot">
              <option value="">Select&hellip;</option>
              <option>07:00 &ndash; 09:00</option>
              <option>09:00 &ndash; 11:00</option>
              <option>11:00 &ndash; 13:00</option>
              <option>13:00 &ndash; 15:00</option>
              <option>15:00 &ndash; 17:00</option>
            </select>
          </div>
        </div>
        <div class="fg">
          <label for="ms">What do you need collected?</label>
          <textarea id="ms" name="ms" placeholder="Full blood count and lipid profile. Fasting."></textarea>
        </div>
        <p id="hcnote" class="small" aria-live="polite" style="margin-bottom:14px"></p>
        <button type="submit" class="pay" style="max-width:280px">Request collection <span class="ar">&rarr;</span></button>
      </form>
    </div>
  </div>
</section>
"""

HC_JS = """
<script>
(function(){
  var f = document.getElementById('hcform');
  if (!f) return;
  var INBOX = 'collection' + String.fromCharCode(64) + 'axiomlabs.example';
  f.addEventListener('submit', function(e){
    e.preventDefault();
    var note = document.getElementById('hcnote');
    var nm = f.elements.nm.value.trim(), ph = f.elements.ph.value.trim();
    if (!nm){ f.elements.nm.focus(); note.textContent = 'Please add your name.'; return; }
    if (!ph){ f.elements.ph.focus(); note.textContent = 'Please add a phone number.'; return; }
    var ref = 'AXM-HC-' + String(Math.floor(Math.random()*90000)+10000);
    note.textContent = 'Request received. Reference ' + ref +
      ' — we will confirm your window by SMS.';
    note.style.color = 'var(--assay-dim)';
  });
})();
</script>
"""

# ------------------------------------------------------------------ RESULTS
RESULTS = """
<section class="page-head">
  <div class="wrap">
    <div class="eyebrow"><span class="mono">Results portal</span></div>
    <h1>Your results,<br>with a range<br>beside every number.</h1>
    <p class="lead">No unlabelled decimals. Every analyte carries its reference
      range, a plain flag, and a short note explaining what it means.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="report" style="margin-top:0">
      <div class="report-head">
        <div class="who">
          <b>Complete Metabolic Panel</b>
          <span>REF &middot; AXM-2026-04417 &middot; 12 Mar 2026</span>
        </div>
        <div class="status"><i></i>Released</div>
      </div>
      <div class="rrow head">
        <span>Analyte</span><span>Result</span><span>Reference</span><span>Flag</span>
      </div>
      <div class="rrow">
        <span class="t">Fasting glucose</span><span class="v">5.4 mmol/L</span>
        <span class="rng">3.9 &ndash; 5.5</span>
        <span><span class="flag norm">Normal</span></span>
      </div>
      <div class="rrow">
        <span class="t">Total cholesterol</span><span class="v">6.1 mmol/L</span>
        <span class="rng">&lt; 5.2</span>
        <span><span class="flag high">Above range</span></span>
      </div>
      <div class="rrow">
        <span class="t">LDL cholesterol</span><span class="v">4.0 mmol/L</span>
        <span class="rng">&lt; 3.4</span>
        <span><span class="flag high">Above range</span></span>
      </div>
      <div class="rrow">
        <span class="t">Alanine aminotransferase</span><span class="v">48 U/L</span>
        <span class="rng">10 &ndash; 49</span>
        <span><span class="flag bord">Borderline</span></span>
      </div>
      <div class="rrow">
        <span class="t">Creatinine</span><span class="v">82 &micro;mol/L</span>
        <span class="rng">62 &ndash; 106</span>
        <span><span class="flag norm">Normal</span></span>
      </div>
      <div class="rrow">
        <span class="t">Haemoglobin</span><span class="v">14.2 g/dL</span>
        <span class="rng">13.0 &ndash; 17.0</span>
        <span><span class="flag norm">Normal</span></span>
      </div>
    </div>
    <p class="small" style="margin-top:14px">Illustrative report. Values shown are
      examples, not a real patient record.</p>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="prose">
      <h2>How to read a flag</h2>
      <p><strong>Normal</strong> means the result sits inside the reference range
        for that analyte. <strong>Borderline</strong> means it is close to the edge
        and worth watching over time rather than acting on immediately.
        <strong>Above</strong> or <strong>below range</strong> means it falls outside
        — which is a prompt for a conversation with your clinician, not a diagnosis
        in itself.</p>

      <h2>What a reference range actually is</h2>
      <p>A reference range is built by measuring a large population of apparently
        healthy people and taking the central 95%. That means, by construction, one
        in twenty healthy people falls outside it on any given test. A single
        out-of-range value is common and often means nothing. A pattern across
        several results over time is what matters.</p>

      <h2>Why we publish the range</h2>
      <p>Because a result without its range is not information. "Cholesterol 6.1" is
        a number. "Cholesterol 6.1 against a target of under 5.2" is a fact you can
        act on. Most lab reports make you look the range up yourself. We put it on
        the line.</p>

      <h2>Sharing with your doctor</h2>
      <p>Every report is released to your nominated clinician at the same moment it
        is released to you, by email, with the full data set. If you would rather
        your doctor saw it first, that is a setting on your account.</p>
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="panelbox">
      <div class="eyebrow"><span class="mono">Access</span></div>
      <h2 class="h2" style="margin-bottom:12px">Look up a result.</h2>
      <p class="lead" style="margin-bottom:26px">Enter the reference from your
        receipt and the phone number you booked with.</p>
      <form id="rform" novalidate>
        <div class="f2">
          <div class="fg">
            <label for="ref">Booking reference</label>
            <input id="ref" name="ref" type="text" placeholder="AXM-2026-04417" required>
          </div>
          <div class="fg">
            <label for="ph">Phone number</label>
            <input id="ph" name="ph" type="tel" placeholder="0803 000 0000" required>
          </div>
        </div>
        <p id="rnote" class="small" aria-live="polite" style="margin-bottom:14px"></p>
        <button type="submit" class="pay" style="max-width:260px">Find my result <span class="ar">&rarr;</span></button>
      </form>
    </div>
  </div>
</section>
"""

RESULTS_JS = """
<script>
(function(){
  var f = document.getElementById('rform');
  if (!f) return;
  f.addEventListener('submit', function(e){
    e.preventDefault();
    var note = document.getElementById('rnote');
    var ref = f.elements.ref.value.trim(), ph = f.elements.ph.value.trim();
    if (!ref || !ph){
      note.textContent = 'Enter both the reference and your phone number.';
      note.style.color = 'var(--crit)';
      return;
    }
    note.textContent = 'This is a demonstration portal — no real records are held here.';
    note.style.color = 'var(--muted)';
  });
})();
</script>
"""

# ------------------------------------------------------------------ ABOUT
ABOUT = """
<section class="page-head">
  <div class="wrap">
    <div class="eyebrow"><span class="mono">About Axiom</span></div>
    <h1>A lab built around<br>the person waiting<br>for the result.</h1>
    <p class="lead">Most diagnostics businesses are designed around the clinician
      who orders the test. We built ours around the patient who has to wait for it,
      understand it, and act on it.</p>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="prose">
      <h2>Why we publish prices</h2>
      <p>The Nigerian diagnostics market largely runs on quoted pricing. You ask
        what a test costs, and the answer depends on who you asked. We think that is
        a bad way to run a laboratory, and it is a particularly bad way to run one
        that people visit when they are worried.</p>
      <p>Every test we offer has a fixed, published price. It is the same price for
        everyone, it is visible before you commit, and it does not change when you
        arrive.</p>

      <h2>Why we publish reference ranges</h2>
      <p>Because a number without its range is not a result, it is a puzzle. We put
        the range on the same line as the value, flag it plainly, and write a short
        note explaining what the flag means.</p>

      <h2>Accreditation and quality</h2>
      <p>Our laboratory operates to ISO 15189-aligned quality management
        principles. We participate in external quality assessment schemes for
        haematology, clinical chemistry and serology, and our concordance on those
        panels is 99.4%. Internal quality control runs on every analyser every
        morning before patient samples are loaded.</p>
      <p>We publish that number because it is the only meaningful measure of whether
        a laboratory can be trusted with your sample. Any lab can claim accuracy.
        EQA participation is the evidence.</p>

      <h2>Our centres</h2>
      <table class="ctable">
        <thead><tr><th>Centre</th><th>Address</th><th>Hours</th></tr></thead>
        <tbody>
          <tr><td>Victoria Island</td><td>Adeola Odeku Street, VI</td>
            <td class="num">Mon&ndash;Sat 07:00&ndash;18:00</td></tr>
          <tr><td>Ikeja</td><td>Allen Avenue, Ikeja</td>
            <td class="num">Mon&ndash;Sat 07:00&ndash;18:00</td></tr>
          <tr><td>Lekki</td><td>Admiralty Way, Lekki Phase 1</td>
            <td class="num">Mon&ndash;Sat 08:00&ndash;17:00</td></tr>
        </tbody>
      </table>

      <h2>What we are not</h2>
      <p>We are a laboratory. We do not diagnose, we do not prescribe, and we do not
        interpret results for you — that is your clinician's role and it is a
        different skill from running an assay well. What we do is produce a reliable
        number and explain it clearly enough that your doctor can use it.</p>

      <h2>The team</h2>
      <h3>Dr. Ngozi Adeyemi &mdash; Laboratory Director</h3>
      <p>Chemical pathologist. Fifteen years in clinical laboratory medicine, and
        the reason our quality control protocol is as strict as it is.</p>
      <h3>Emeka Nwosu &mdash; Head of Operations</h3>
      <p>Runs the home collection fleet and the centre network. If a collector is
        late, this is the person who hears about it.</p>
      <h3>Dr. Sadiq Bello &mdash; Clinical Liaison</h3>
      <p>Works with referring clinicians on test selection and turnaround
        expectations. The person who calls a doctor when a result needs a
        conversation.</p>
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="trust">
      <div><span class="n num" data-count="247">0</span>
        <span class="l">Accredited tests</span></div>
      <div><span class="n num" data-count="99" data-suffix=".4%">0</span>
        <span class="l">EQA concordance</span></div>
      <div><span class="n num" data-count="3">0</span>
        <span class="l">Collection centres</span></div>
      <div><span class="n num" data-count="12">0</span>
        <span class="l">Home phlebotomists</span></div>
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="cta rv">
      <div>
        <div class="eyebrow"><span class="mono">Start</span></div>
        <h2 class="h2">Book a test<br>or a home visit.</h2>
        <p class="lead" style="margin-top:18px">Fixed prices, published turnaround,
          results you can read.</p>
      </div>
      <div class="cta-actions">
        <a href="index.html#book" class="btn btn-p">Book a test <span class="ar">&rarr;</span></a>
        <a href="tests.html" class="btn">Browse the catalogue</a>
      </div>
    </div>
  </div>
</section>
"""


def build():
    pages = [
        ("tests.html", page("Test Catalogue", "247 accredited diagnostic tests with published prices and turnaround times.", TESTS + TESTS_JS, "t")),
        ("home-collection.html", page("Home Collection", "Home sample collection across Lagos in a two-hour window.", HOME + HC_JS, "h")),
        ("results.html", page("Results Portal", "Read your diagnostic results with reference ranges and plain flags.", RESULTS + RESULTS_JS, "r")),
        ("about.html", page("About", "Axiom Diagnostics: published prices, published ranges, ISO 15189-aligned quality management.", ABOUT, "a")),
    ]
    for name, content in pages:
        with open(os.path.join(DEST, name), "w", encoding="utf-8") as fh:
            fh.write(content)
        print(f"  {name:24s} {len(content):>7,} bytes")


if __name__ == "__main__":
    build()
