#!/usr/bin/env python3
"""Generate LUMEN sub-pages (services, about, journal, contact) in the shared shell.

Keeps the optical design language: light field, focus layer, spectral rules,
defocus-to-sharp reveals.
"""
import os

DEST = r"C:\Users\User\hermes-work\fjmk\samples\01-lumen-eye"

HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — LUMEN Eye Institute</title>
<meta name="description" content="{desc}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,300;12..96,400;12..96,500;12..96,600&family=Newsreader:ital,opsz,wght@0,6..72,200;0,6..72,300;1,6..72,200;1,6..72,300&family=Azeret+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/lumen.css">
</head>
<body>
<div class="field" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
<div class="grain" aria-hidden="true"></div>
<div class="focuslayer" id="focuslayer" aria-hidden="true"></div>

<header id="hdr">
  <div class="nav">
    <a href="index.html" class="brand"><span class="iris" aria-hidden="true"></span>Lumen</a>
    <ul class="navlinks" id="nav">
      <li><a href="services.html"{s_cur}>Services</a></li>
      <li><a href="about.html"{a_cur}>Institute</a></li>
      <li><a href="journal.html"{j_cur}>Journal</a></li>
      <li><a href="contact.html" class="nav-cta">Book assessment</a></li>
    </ul>
    <button class="burger" id="burger" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<div class="above">
"""

FOOT = """
</div><!-- /above -->

<footer>
  <div class="wrap">
    <div class="ft">
      <div class="ft-brand">
        <a href="index.html" class="brand"><span class="iris" aria-hidden="true"></span>Lumen</a>
        <p>A dedicated eye institute in Lagos. Refractive, cataract, retina and
          glaucoma care.</p>
      </div>
      <div class="ft">
        <h4>Services</h4>
        <ul>
          <li><a href="services.html#lasik">Refractive surgery</a></li>
          <li><a href="services.html#cataract">Cataract &amp; lens</a></li>
          <li><a href="services.html#retina">Retina &amp; macula</a></li>
          <li><a href="services.html#glaucoma">Glaucoma care</a></li>
        </ul>
      </div>
      <div class="ft">
        <h4>Institute</h4>
        <ul>
          <li><a href="about.html">About</a></li>
          <li><a href="journal.html">Journal</a></li>
          <li><a href="contact.html">Contact</a></li>
        </ul>
      </div>
      <div class="ft">
        <h4>Visit</h4>
        <ul>
          <li><a href="contact.html">Book assessment</a></li>
          <li><a href="contact.html">Opening hours</a></li>
          <li><a href="contact.html">Find us</a></li>
        </ul>
      </div>
    </div>
    <div class="ft-bot">
      <span>&copy; 2026 Lumen Eye Institute &middot; Lagos</span>
      <span>Information is general and does not replace advice from a qualified clinician</span>
    </div>
  </div>
</footer>

<script src="assets/js/lumen.js"></script>
</body>
</html>
"""


def page(title, desc, body, cur=""):
    flags = {
        "s_cur": ' aria-current="page"' if cur == "s" else "",
        "a_cur": ' aria-current="page"' if cur == "a" else "",
        "j_cur": ' aria-current="page"' if cur == "j" else "",
    }
    return HEAD.format(title=title, desc=desc, **flags) + body + FOOT


# ============================================================
# SERVICES
# ============================================================
SERVICES = """
<section style="padding-top:clamp(130px,17vw,220px)">
  <div class="wrap">
    <div class="rv" style="max-width:900px">
      <div class="eyebrow"><span class="mono">Services</span></div>
      <h1 class="h2">Everything we do<br>happens inside<br>a 24mm sphere.</h1>
      <p class="lead" style="margin-top:26px">Four disciplines. Each one is a
        different way of getting light to land correctly on the retina — or of
        stopping something from damaging it.</p>
    </div>
  </div>
</section>

<div class="spectrum"></div>

<section id="lasik">
  <div class="wrap">
    <div class="chart">
      <div class="chart-copy rv">
        <div class="eyebrow"><span class="mono">01 · Refractive</span></div>
        <h2 class="h2">Refractive<br>surgery.</h2>
      </div>
      <div class="rv">
        <p class="lead">In a myopic eye the cornea is too steep, so light focuses
          in front of the retina instead of on it. Refractive surgery reshapes the
          cornea to move that focal point back where it belongs.</p>
        <p class="lead" style="margin-top:20px">LASIK lifts a flap, ablates the
          stroma with an excimer laser, and lays the flap back. PRK skips the flap
          and works on the surface — slower to recover, but the right choice for
          thin or irregular corneas. ICL implants a lens and removes no tissue at
          all.</p>
        <div class="chart-facts">
          <div><span class="mono">Duration</span><p>About 15 minutes for both eyes.</p></div>
          <div><span class="mono">Anaesthesia</span><p>Topical drops. You are awake throughout.</p></div>
          <div><span class="mono">Recovery</span><p>Most people return to work the next day.</p></div>
          <div><span class="mono">Not suitable if</span><p>Thin cornea, unstable prescription, active dry eye, keratoconus.</p></div>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="spectrum"></div>

<section id="cataract">
  <div class="wrap">
    <div class="chart">
      <div class="chart-copy rv">
        <div class="eyebrow"><span class="mono">02 · Lens</span></div>
        <h2 class="h2">Cataract<br>&amp; lens.</h2>
      </div>
      <div class="rv">
        <p class="lead">The lens inside your eye is a protein structure, and over
          decades those proteins clump. The lens goes cloudy. No drop, no diet and
          no exercise reverses it — the only treatment is to replace the lens.</p>
        <p class="lead" style="margin-top:20px">Phacoemulsification breaks the
          clouded lens up with ultrasound and removes it through a 2.2mm incision,
          then folds a new lens in. The incision seals itself.</p>
        <div class="chart-facts">
          <div><span class="mono">Standard lens</span><p>Corrects distance. You will likely still need reading glasses.</p></div>
          <div><span class="mono">Premium lens</span><p>Toric for astigmatism, or multifocal to reduce reading dependence.</p></div>
          <div><span class="mono">Our position</span><p>We will recommend the standard lens when a premium one will not help you.</p></div>
          <div><span class="mono">Duration</span><p>20–30 minutes per eye, usually two weeks apart.</p></div>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="spectrum"></div>

<section id="retina">
  <div class="wrap">
    <div class="chart">
      <div class="chart-copy rv">
        <div class="eyebrow"><span class="mono">03 · Retina</span></div>
        <h2 class="h2">Retina<br>&amp; macula.</h2>
      </div>
      <div class="rv">
        <p class="lead">The retina is a sheet of nerve tissue at the back of the
          eye, about 0.2mm thick, and it is where sight is actually recorded. The
          cornea and lens are just optics. Damage the retina and there is nothing
          downstream to compensate.</p>
        <p class="lead" style="margin-top:20px">Diabetic retinopathy is the
          fastest-growing cause of preventable blindness in Nigeria. It is silent
          for years, and by the time vision drops the changes are often
          irreversible. Annual screening is the entire game.</p>
        <div class="chart-facts">
          <div><span class="mono">We treat</span><p>Diabetic retinopathy, age-related macular degeneration, retinal detachment, macular holes.</p></div>
          <div><span class="mono">Tools</span><p>OCT imaging, fundus photography, intravitreal injection, laser photocoagulation.</p></div>
          <div><span class="mono">Screening</span><p>Annual dilated fundus exam for every diabetic patient, from diagnosis.</p></div>
          <div><span class="mono">Emergency</span><p>Sudden flashes, a curtain across your vision, or a shower of floaters — come in the same day.</p></div>
        </div>
      </div>
    </div>
  </div>
</section>

<div class="spectrum"></div>

<section id="glaucoma">
  <div class="wrap">
    <div class="chart">
      <div class="chart-copy rv">
        <div class="eyebrow"><span class="mono">04 · Glaucoma</span></div>
        <h2 class="h2">Glaucoma<br>care.</h2>
      </div>
      <div class="rv">
        <p class="lead">Glaucoma damages the optic nerve, usually because the
          pressure inside the eye is higher than the nerve can tolerate. It takes
          peripheral vision first — the edges — and it does so slowly enough that
          most people never notice until a large amount is gone.</p>
        <p class="lead" style="margin-top:20px">What is lost does not come back.
          That is the whole reason we monitor rather than treat once: the goal is
          to slow it, permanently, over decades.</p>
        <div class="chart-facts">
          <div><span class="mono">Detect</span><p>Intraocular pressure, optic disc imaging, visual field testing.</p></div>
          <div><span class="mono">Treat</span><p>Pressure-lowering drops, laser trabeculoplasty, filtration surgery where needed.</p></div>
          <div><span class="mono">Monitor</span><p>Fields every 6–12 months. The trend matters more than any single reading.</p></div>
          <div><span class="mono">Risk</span><p>Family history, age over 40, African ancestry, high myopia, diabetes.</p></div>
        </div>
      </div>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="cta rv">
      <div>
        <div class="eyebrow"><span class="mono">Not sure which</span></div>
        <h2 class="h2">Start with the<br>assessment.</h2>
        <p class="lead" style="margin-top:20px">You do not need to know which
          service you need. Ninety minutes of measurement tells us, and then we
          tell you.</p>
      </div>
      <div class="cta-actions">
        <a href="contact.html" class="btn btn-lit">Book the assessment <span class="ar">&rarr;</span></a>
        <a href="index.html" class="btn">Back to home</a>
        <span class="cta-note">Lagos &middot; Mon&ndash;Sat<br>Reply within one working day</span>
      </div>
    </div>
  </div>
</section>
"""

# ============================================================
# ABOUT
# ============================================================
ABOUT = """
<section style="padding-top:clamp(130px,17vw,220px)">
  <div class="wrap">
    <div class="rv" style="max-width:940px">
      <div class="eyebrow"><span class="mono">The institute</span></div>
      <h1 class="h2">We only do<br>eyes. That is<br>the whole point.</h1>
      <p class="lead" style="margin-top:26px">Lumen opened in 2019 with two
        consulting rooms, one laser, and a conviction that a dedicated eye
        institute is a different thing from an eye department.</p>
    </div>
  </div>
</section>

<div class="spectrum"></div>

<section>
  <div class="wrap">
    <div class="chart">
      <div class="chart-copy rv">
        <div class="eyebrow"><span class="mono">Why dedicated</span></div>
        <h2 class="h2">Volume makes<br>you careful.</h2>
      </div>
      <div class="rv">
        <p class="lead">A general hospital treats eyes alongside a hundred other
          things. That is appropriate for a general hospital. But refractive
          surgery has a learning curve that never flattens, and surgeons who
          perform it weekly rather than yearly get better outcomes.</p>
        <p class="lead" style="margin-top:20px">Our four consultants do nothing
          else. The equipment is calibrated for eyes. The nursing team only
          preps eyes. The follow-up protocol is built for eyes.</p>
        <p class="lead" style="margin-top:20px">It also means we can afford to say
          no. About one in five people who come to us for LASIK should not have
          it. A general practice has every incentive to find something else to
          sell you. We would rather send you away with a clear explanation.</p>
      </div>
    </div>
  </div>
</section>

<div class="spectrum"></div>

<section>
  <div class="wrap">
    <div class="rv" style="max-width:760px">
      <div class="eyebrow"><span class="mono">By the numbers</span></div>
      <h2 class="h2">Where we are.</h2>
    </div>
    <div class="outcomes">
      <div class="oc rv"><span class="num" data-count="2019">0</span>
        <span class="lbl">Year opened</span></div>
      <div class="oc rv"><span class="num" data-count="4">0</span>
        <span class="lbl">Consultant<br>ophthalmologists</span></div>
      <div class="oc rv"><span class="num" data-count="4180" data-suffix="+">0</span>
        <span class="lbl">Refractive procedures</span></div>
      <div class="oc rv"><span class="num" data-count="3">0</span>
        <span class="lbl">Community screening<br>sites in Lagos</span></div>
    </div>
  </div>
</section>

<div class="spectrum"></div>

<section>
  <div class="wrap">
    <div class="rv" style="max-width:760px">
      <div class="eyebrow"><span class="mono">The team</span></div>
      <h2 class="h2">Who will<br>see you.</h2>
    </div>
    <div class="docs">
      <article class="doc rv">
        <div class="doc-portrait"><div class="sil"></div><span class="ini">AO</span></div>
        <div class="doc-body">
          <span class="role">Medical Director &middot; Refractive</span>
          <h3>Dr. Adaeze Okonkwo</h3>
          <p>Founded Lumen. Performs the majority of our LASIK and ICL work.
            Trained in refractive surgery in London and Chennai.</p>
          <div class="cred">MBBS &middot; FWACS &middot; FICO<br>4,000+ refractive cases</div>
        </div>
      </article>
      <article class="doc rv">
        <div class="doc-portrait"><div class="sil"></div><span class="ini">IB</span></div>
        <div class="doc-body">
          <span class="role">Consultant &middot; Vitreoretinal</span>
          <h3>Dr. Ifeanyi Balogun</h3>
          <p>Retina and vitreous. Runs our diabetic retinopathy screening
            programme across three Lagos LGA clinics.</p>
          <div class="cred">MBBS &middot; FMCOph<br>Vitreoretinal fellowship</div>
        </div>
      </article>
      <article class="doc rv">
        <div class="doc-portrait"><div class="sil"></div><span class="ini">FA</span></div>
        <div class="doc-body">
          <span class="role">Consultant &middot; Glaucoma</span>
          <h3>Dr. Fatima Aliyu</h3>
          <p>Glaucoma and anterior segment. Believes the most important tool in
            the room is a long conversation.</p>
          <div class="cred">MBBS &middot; FMCOph<br>Glaucoma fellowship</div>
        </div>
      </article>
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="quote rv">
      <blockquote>&ldquo;The eye is the only place in the body where you can look
        directly at a nerve and a blood vessel without cutting anything open.
        That is a privilege, and it comes with an obligation to look
        carefully.&rdquo;</blockquote>
      <div class="attr">Dr. Adaeze Okonkwo &middot; Medical Director</div>
    </div>
  </div>
</section>

<section style="padding-top:0">
  <div class="wrap">
    <div class="cta rv">
      <div>
        <div class="eyebrow"><span class="mono">Visit</span></div>
        <h2 class="h2">Come and<br>be measured.</h2>
        <p class="lead" style="margin-top:20px">The assessment is where every
          relationship here begins.</p>
      </div>
      <div class="cta-actions">
        <a href="contact.html" class="btn btn-lit">Book the assessment <span class="ar">&rarr;</span></a>
        <a href="services.html" class="btn">See all services</a>
        <span class="cta-note">Lagos &middot; Mon&ndash;Sat<br>Reply within one working day</span>
      </div>
    </div>
  </div>
</section>
"""

# ============================================================
# JOURNAL
# ============================================================
ARTICLES = [
    ("Refractive", "Why one in five people who want LASIK should not have it",
     "The screening matters more than the laser. What we look for, and why we turn people away.",
     "lasik-screening"),
    ("Retina", "Diabetic retinopathy is silent for years. That is the problem.",
     "By the time vision drops, the changes are usually permanent. Annual screening is the whole game.",
     "diabetic-retinopathy-screening"),
    ("Glaucoma", "Glaucoma takes the edges first",
     "Why peripheral vision goes unnoticed, what field testing actually measures, and why the trend beats any single reading.",
     "glaucoma-peripheral-vision"),
    ("Cataract", "Standard lens or premium lens? An honest answer",
     "Premium intraocular lenses are genuinely better for some eyes. For others they are an expensive upgrade that changes nothing.",
     "standard-vs-premium-lens"),
    ("Children", "Screen time and short sight in children",
     "Myopia is rising in Nigerian cities. What the evidence actually supports, and what is marketing.",
     "myopia-children-screen-time"),
    ("Emergency", "Flashes, floaters and curtains: when to come in today",
     "The symptoms of a retinal tear are specific and time-critical. Learn the three that mean same-day.",
     "retinal-tear-warning-signs"),
]

JOURNAL = """
<section style="padding-top:clamp(130px,17vw,220px)">
  <div class="wrap">
    <div class="rv" style="max-width:900px">
      <div class="eyebrow"><span class="mono">Journal</span></div>
      <h1 class="h2">Written by the<br>people who<br>operate.</h1>
      <p class="lead" style="margin-top:26px">No content team. Every piece here is
        written or reviewed by one of our four consultants, and it says what we
        would say to you in the room.</p>
    </div>
  </div>
</section>

<div class="spectrum"></div>

<section>
  <div class="wrap">
    <div class="svc-list">
""" + "\n".join(
    f"""      <a class="svc rv" href="journal-{slug}.html">
        <span class="idx">{i:02d}</span>
        <div><h3>{title}</h3><span class="tagline">{cat}</span></div>
        <p>{blurb}</p>
        <span class="go">Read <span class="ar">&rarr;</span></span>
      </a>"""
    for i, (cat, title, blurb, slug) in enumerate(ARTICLES, 1)
) + """
    </div>
  </div>
</section>

<section>
  <div class="wrap">
    <div class="cta rv">
      <div>
        <div class="eyebrow"><span class="mono">Questions</span></div>
        <h2 class="h2">Ask us<br>directly.</h2>
        <p class="lead" style="margin-top:20px">If something here raises a
          question about your own eyes, the assessment answers it properly.</p>
      </div>
      <div class="cta-actions">
        <a href="contact.html" class="btn btn-lit">Book the assessment <span class="ar">&rarr;</span></a>
        <a href="services.html" class="btn">See all services</a>
        <span class="cta-note">Lagos &middot; Mon&ndash;Sat<br>Reply within one working day</span>
      </div>
    </div>
  </div>
</section>
"""

# ============================================================
# CONTACT
# ============================================================
CONTACT = """
<section style="padding-top:clamp(130px,17vw,220px)">
  <div class="wrap">
    <div class="rv" style="max-width:900px">
      <div class="eyebrow"><span class="mono">Book</span></div>
      <h1 class="h2">Ninety minutes<br>to know for<br>certain.</h1>
      <p class="lead" style="margin-top:26px">Tell us a little and we will call you
        to arrange the assessment. No deposit, no obligation to proceed with
        anything.</p>
    </div>
  </div>
</section>

<div class="spectrum"></div>

<section>
  <div class="wrap">
    <div class="chart">
      <div class="chart-copy rv">
        <div class="eyebrow"><span class="mono">Details</span></div>
        <h2 class="h2">Where<br>we are.</h2>
        <div class="chart-facts" style="margin-top:34px">
          <div><span class="mono">Clinic</span><p>Lumen Eye Institute<br>Victoria Island, Lagos</p></div>
          <div><span class="mono">Hours</span><p>Mon&ndash;Fri 8:00&ndash;17:00<br>Sat 9:00&ndash;14:00</p></div>
          <div><span class="mono">Assessment</span><p>Allow 90 minutes. Bring sunglasses &mdash; your pupils will be dilated.</p></div>
          <div><span class="mono">Bring</span><p>Any existing glasses or lens prescription, and your HMO card if you have one.</p></div>
          <div><span class="mono">Emergency</span><p>Sudden vision loss, flashes, or a curtain across your vision &mdash; call and come in the same day.</p></div>
        </div>
      </div>

      <div class="chart-card rv">
        <div class="chart-bar">
          <span class="mono">Assessment request</span>
          <span class="lit mono"><i></i>Monitored</span>
        </div>
        <form id="lumenform" style="padding:clamp(24px,3.4vw,44px)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:18px">
            <div class="fg">
              <label for="nm">Full name</label>
              <input id="nm" name="nm" type="text" placeholder="Chidinma Eze" required>
            </div>
            <div class="fg">
              <label for="ph">Phone</label>
              <input id="ph" name="ph" type="tel" placeholder="0803 000 0000" required>
            </div>
          </div>
          <div class="fg">
            <label for="em">Email</label>
            <input id="em" name="em" type="email" placeholder="you@example.com">
          </div>
          <div class="fg">
            <label for="why">What brings you in?</label>
            <select id="why" name="why">
              <option value="">Select&hellip;</option>
              <option>Considering LASIK or refractive surgery</option>
              <option>Cataract &mdash; my vision is going cloudy</option>
              <option>Glaucoma monitoring or second opinion</option>
              <option>Diabetic eye screening</option>
              <option>Sudden change in vision</option>
              <option>General eye examination</option>
            </select>
          </div>
          <div class="fg">
            <label for="ms">Anything we should know?</label>
            <textarea id="ms" name="ms" placeholder="I wear -4.50 in both eyes and have done for eleven years. I have heard my corneas might be thin."></textarea>
          </div>
          <p id="fnote" class="small" style="margin-top:14px" aria-live="polite"></p>
          <button type="submit" class="btn btn-lit" style="width:100%;justify-content:center;margin-top:8px">
            Send request <span class="ar">&rarr;</span>
          </button>
        </form>
      </div>
    </div>
  </div>
</section>
"""

# Contact-page form styles (added to the shared sheet, appended here)
FORM_CSS = """
<style>
.fg{margin-bottom:20px}
.fg label{display:block;font-family:var(--mono);font-size:.56rem;letter-spacing:.18em;
  text-transform:uppercase;color:var(--mist-dim);margin-bottom:9px}
.fg input,.fg select,.fg textarea{width:100%;background:transparent;border:0;
  border-bottom:1px solid var(--edge);padding:11px 0;font-family:var(--display);
  font-size:.95rem;font-weight:300;color:var(--white);transition:border-color .3s}
.fg textarea{resize:vertical;min-height:96px;line-height:1.6}
.fg select{appearance:none;cursor:pointer;
  background-image:linear-gradient(45deg,transparent 50%,var(--mist-dim) 50%),
                   linear-gradient(135deg,var(--mist-dim) 50%,transparent 50%);
  background-position:calc(100% - 12px) 19px,calc(100% - 7px) 19px;
  background-size:5px 5px,5px 5px;background-repeat:no-repeat}
.fg input:focus,.fg select:focus,.fg textarea:focus{outline:0;border-color:var(--cyan)}
.fg input::placeholder,.fg textarea::placeholder{color:rgba(233,240,255,.22)}
.fg option{background:var(--deep);color:var(--white)}
@media(max-width:720px){form > div[style*="grid-template-columns:1fr 1fr"]{grid-template-columns:1fr !important}}
</style>
"""

CONTACT_FORM_JS = """
<script>
(function(){
  var f = document.getElementById('lumenform');
  if (!f) return;
  var INBOX = 'hello' + String.fromCharCode(64) + 'lumeneye.example';
  f.addEventListener('submit', function(e){
    e.preventDefault();
    var note = document.getElementById('fnote');
    var nm = f.elements.nm.value.trim(), ph = f.elements.ph.value.trim();
    if (!nm){ f.elements.nm.focus(); note.textContent = 'Please add your name.'; return; }
    if (!ph){ f.elements.ph.focus(); note.textContent = 'Please add a phone number.'; return; }
    var subject = encodeURIComponent('Sight assessment request — ' + nm);
    var lines = [
      'Name: ' + nm,
      'Phone: ' + ph,
      'Email: ' + f.elements.em.value.trim(),
      'Reason: ' + f.elements.why.value,
      '',
      f.elements.ms.value.trim()
    ];
    note.textContent = 'Opening your email app with the request ready to send.';
    window.location.href = 'mailto:' + INBOX + '?subject=' + subject +
      '&body=' + encodeURIComponent(lines.join('\\n'));
  });
})();
</script>
"""

# ============================================================
# JOURNAL ARTICLE PAGES
# ============================================================
ART_BODY = {
 "lasik-screening": [
  ("Why screening decides the outcome", "The laser is not the variable. Modern excimer platforms are all excellent. What separates a good result from a bad one is whether the right patient was put under it. Screening is where refractive surgery is won or lost, and it happens before the laser is switched on."),
  ("The cornea has to be thick enough", "LASIK removes tissue from the stroma. Remove too much and the cornea weakens structurally, which can lead to ectasia — a progressive thinning that is the single worst complication in refractive surgery. We measure corneal thickness with pachymetry and map its shape with topography. If the residual bed under the flap would be under 250 microns, we do not do LASIK. We offer PRK or ICL instead, or we do nothing."),
  ("Keratoconus hides in plain sight", "Keratoconus is a progressive thinning disorder where the cornea becomes cone-shaped. It is more common than most people assume, and in its early stages it can look almost normal on a basic exam. Operating on an undetected keratoconic eye is one of the few ways to do real harm. Topographic screening catches it, and we screen every single patient."),
  ("A prescription that will not sit still", "If your prescription is still changing, the surgery will fix today's number and nothing else. We want stability — generally no more than 0.50 dioptres of change over two years. A young patient with a moving prescription is a patient we would rather monitor than operate on."),
  ("Dry eye is not a small thing", "Refractive surgery temporarily reduces corneal sensation, which reduces tear production. In a patient who already has significant dry eye, that can turn a manageable annoyance into a persistent problem. We measure tear film before we consider operating, and we treat dry eye first where it is present."),
  ("The honest summary", "Roughly one in five people who come to us wanting LASIK leave without it. Some are better served by PRK or an implantable lens. Some need their dry eye treated first. Some should simply stay in glasses, and we tell them so plainly, because a pair of glasses is a far better outcome than a damaged cornea."),
 ],
 "diabetic-retinopathy-screening": [
  ("The retina does not complain", "Diabetic retinopathy is damage to the small blood vessels of the retina caused by sustained high blood glucose. In its early stages it causes no symptoms at all. The vessels weaken, leak, and eventually bleed or grow fragile new branches. By the time a patient notices blurring, the retina has often already sustained damage that treatment can slow but not reverse."),
  ("Why Nigeria is behind on this", "Screening rates for diabetic retinopathy in Nigeria are low, and the reasons are practical rather than clinical. Many patients see a physician for their diabetes but never see an eye specialist, because nobody referred them. Annual dilated fundus examination is standard of care internationally. It should be standard here too, and it frequently is not."),
  ("What the examination involves", "Dilating drops widen the pupil so the retina can be photographed and examined directly. Optical coherence tomography gives a cross-sectional scan of the retinal layers, which catches macular oedema — swelling at the centre of vision — long before it shows up in a visual acuity test. The whole thing takes about half an hour, and your vision is blurry for a few hours afterwards."),
  ("Treatment, when it is needed", "Focal laser photocoagulation seals leaking vessels. Panretinal photocoagulation treats the fragile new vessels of proliferative disease. Intravitreal injections deliver anti-VEGF drugs directly into the eye to reduce macular swelling. All of these slow progression. None of them restore vision that has already been lost, which is the reason screening beats treatment."),
  ("How often", "For most patients with diabetes and no retinopathy, annually. If retinopathy is present, the interval shortens to every three to six months depending on severity. Pregnancy accelerates diabetic eye disease, so pregnant patients need assessment early and often."),
  ("What you can control", "Blood glucose, blood pressure and lipids. Tight control reduces the risk of retinopathy progression substantially. It does not eliminate the need for screening, but it changes what screening finds."),
 ],
 "glaucoma-peripheral-vision": [
  ("It starts at the edges", "Glaucoma damages the optic nerve, typically in the context of raised intraocular pressure. The fibres that die first are the ones serving peripheral vision, and they die slowly and painlessly. Patients do not notice because the brain fills in the gaps from the other eye and from memory. By the time central vision is threatened, a large proportion of the nerve may already be gone."),
  ("Why a pressure reading is not enough", "Intraocular pressure is a risk factor, not a diagnosis. Some people develop glaucoma at pressures considered normal, and many people with high pressure never develop it. That is why assessment involves the optic disc — imaged and compared over time — and visual field testing, which maps where you can actually see."),
  ("Field testing and the trend", "Perimetry asks you to respond to lights appearing at various points in your peripheral vision. A single field test is noisy: everyone has bad days, and the test has real variability. What matters is the trend across several tests over years. A slow decline is the signal, and it can only be seen if testing happens consistently."),
  ("The part that cannot be reversed", "Nerve fibres that have died do not regenerate. Every treatment for glaucoma is aimed at slowing further loss. This is why the disease is monitored for decades rather than treated once, and why missing appointments is the most common way patients lose vision they did not have to lose."),
  ("Treatment", "Prostaglandin analogue drops are usually first-line, reducing pressure by improving outflow. Laser trabeculoplasty is an increasingly common alternative or addition. Where drops and laser are insufficient, filtration surgery creates a new drainage pathway. Each step has trade-offs and we discuss them rather than prescribe them."),
  ("Who should be screened", "Anyone over 40 should have a baseline assessment, and earlier if there is a family history. African ancestry, high myopia, diabetes and long-term steroid use all raise risk. If a parent has glaucoma, you should be assessed well before you have symptoms, because by definition symptoms arrive late."),
 ],
 "standard-vs-premium-lens": [
  ("What the lens does", "A monofocal intraocular lens has a single focal point, set for distance. You will see well far away and need reading glasses for close work. That is the standard lens, and it is what most cataract surgery worldwide uses."),
  ("Where premium lenses help", "A toric lens corrects astigmatism, which is a genuine benefit for patients who have significant corneal astigmatism — without it, distance vision remains blurred even after a successful operation. A multifocal or extended-depth-of-focus lens splits light across two or more focal points to reduce dependence on reading glasses."),
  ("Where they do not", "Multifocal lenses trade contrast sensitivity and can produce halos and glare around lights at night. For a patient who drives at night, has macular disease, or has a retinal condition, that trade is often a bad one. A premium lens in the wrong eye is an expensive downgrade, and we will say so."),
  ("The honest recommendation", "We ask what you actually do with your eyes. If you drive at night and read on a tablet, an extended-depth lens may suit you well. If you have early macular change, a monofocal is safer. If you have significant astigmatism, a toric lens is not a luxury — it is the correct lens for your eye."),
  ("What it costs and why", "Premium lenses cost more because the manufacturing is more complex and the pre-operative measurements must be more precise. That is a real difference. But a higher price does not make a lens better for every eye, and any clinic that presents premium as simply the better option is not giving you a recommendation, it is giving you a price list."),
  ("The conversation", "This decision is made with you, not for you. We will show you your measurements, explain what each option would mean for your particular eyes, and tell you plainly when the standard lens is the right answer."),
 ],
 "myopia-children-screen-time": [
  ("What is happening", "Myopia — short sight — is rising sharply in urban populations, and Nigeria is following the pattern seen in East Asia over recent decades. The eye grows too long, so light focuses in front of the retina. It is not simply that more children are being tested. The prevalence is genuinely increasing."),
  ("What the evidence supports", "Two factors have the strongest support. First, time outdoors: children who spend more time outside in daylight have lower rates of myopia progression, and the effect appears to be about light intensity rather than activity. Second, near work: prolonged close focusing, especially at very short distances, is associated with progression."),
  ("What the evidence does not support", "The claim that screens specifically cause myopia is weaker than it is usually stated. The problem with screens is often the distance and duration — held close, for hours — rather than the screen itself. Reading a book at 20cm for three hours has much the same effect. Banning tablets while permitting the same near-work pattern changes little."),
  ("Why progression matters", "High myopia is not just thick glasses. It raises lifetime risk of retinal detachment, macular degeneration, glaucoma and cataract. Slowing progression in childhood reduces those risks for the rest of the patient's life, which is why it is worth taking seriously rather than simply updating the prescription each year."),
  ("What can be done", "Atropine eye drops at low concentration slow progression in many children. Orthokeratology and specially designed spectacle lenses have evidence supporting them. Outdoor time is the cheapest intervention with the best evidence base. The right combination depends on the child's age, prescription and rate of change."),
  ("What to do", "If your child is squinting at the board, sitting close to the television, or has a family history of high myopia, get a proper cycloplegic refraction. Bring them outside. And treat the annual eye test as something that matters, not a formality."),
 ],
 "retinal-tear-warning-signs": [
  ("The three symptoms that matter", "Flashes of light, especially at the edge of vision. A sudden shower of new floaters, particularly if it looks like soot or a swarm. A shadow or curtain coming across part of your vision from one side. Any of these means a retinal tear or detachment until proven otherwise, and all three warrant being seen the same day."),
  ("Why flashes happen", "The vitreous gel that fills the eye shrinks with age and separates from the retina. Usually this is harmless. But where the vitreous is abnormally adherent, it can pull a tear in the retina as it separates. The pull stimulates the retina mechanically, which the brain interprets as light — that is the flash."),
  ("Why floaters appear", "When a tear happens, retinal pigment cells and blood escape into the vitreous. Those cells cast shadows on the retina, and you perceive them as new floaters. A sudden burst of them, especially with flashes, is a classic presentation of an acute tear."),
  ("Why the curtain is urgent", "Once fluid passes through a tear and lifts the retina off the back wall of the eye, the detached portion stops working. You perceive this as a shadow that does not move with your eye, often described as a curtain. Detachment involving the macula — the centre of vision — has a substantially worse visual prognosis, and the difference is often measured in hours to a couple of days."),
  ("What treatment involves", "A tear without detachment can often be sealed with laser retinopexy or cryotherapy in clinic, which is quick and prevents progression. A detachment requires surgery — pneumatic retinopexy, scleral buckle, or vitrectomy depending on the configuration. The earlier it is done, the better the outcome."),
  ("What not to do", "Do not wait to see whether it settles. Do not assume it is a migraine because you have had migraines. Do not drive yourself if the vision is affected in a way that worries you. Ring, describe the symptoms, and come in."),
 ],
}

ART_HEAD = """<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>{title} — LUMEN Journal</title>
<meta name="description" content="{blurb}">
<link rel="preconnect" href="https://fonts.googleapis.com">
<link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
<link href="https://fonts.googleapis.com/css2?family=Bricolage+Grotesque:opsz,wght@12..96,200;12..96,300;12..96,400;12..96,500&family=Newsreader:ital,opsz,wght@0,6..72,200;0,6..72,300;1,6..72,200;1,6..72,300&family=Azeret+Mono:wght@300;400;500&display=swap" rel="stylesheet">
<link rel="stylesheet" href="assets/css/lumen.css">
<style>
.art-head{{padding:clamp(130px,16vw,210px) 0 clamp(30px,4vw,54px)}}
.art-head h1{{font-family:var(--display);font-weight:200;
  font-size:clamp(2rem,5.4vw,4.6rem);line-height:1.02;letter-spacing:-.04em;
  max-width:16ch;margin:22px 0 26px}}
.art-meta{{display:flex;flex-wrap:wrap;gap:10px 26px;padding:18px 0;
  border-top:1px solid var(--edge);border-bottom:1px solid var(--edge)}}
.art-meta .mono{{color:var(--mist-dim)}}
.art-body{{max-width:720px;padding-bottom:clamp(50px,7vw,110px)}}
.art-body h2{{font-family:var(--display);font-weight:300;
  font-size:clamp(1.4rem,2.6vw,2.2rem);line-height:1.1;letter-spacing:-.03em;
  margin:clamp(38px,4.6vw,60px) 0 18px}}
.art-body p{{font-size:1.04rem;line-height:1.82;color:var(--mist);
  font-weight:300;margin-bottom:22px}}
.art-body p:first-of-type{{font-size:1.16rem;color:var(--white)}}
</style>
</head>
<body>
<div class="field" aria-hidden="true"><i></i><i></i><i></i><i></i></div>
<div class="grain" aria-hidden="true"></div>
<div class="focuslayer" id="focuslayer" aria-hidden="true"></div>

<header id="hdr">
  <div class="nav">
    <a href="index.html" class="brand"><span class="iris" aria-hidden="true"></span>Lumen</a>
    <ul class="navlinks" id="nav">
      <li><a href="services.html">Services</a></li>
      <li><a href="about.html">Institute</a></li>
      <li><a href="journal.html">Journal</a></li>
      <li><a href="contact.html" class="nav-cta">Book assessment</a></li>
    </ul>
    <button class="burger" id="burger" aria-label="Menu" aria-expanded="false">
      <span></span><span></span><span></span>
    </button>
  </div>
</header>

<div class="above">
<section class="art-head">
  <div class="wrap">
    <div class="eyebrow"><span class="mono">{cat}</span></div>
    <h1>{title}</h1>
    <div class="art-meta">
      <span class="mono">Lumen Eye Institute</span>
      <span class="mono">&middot;</span>
      <span class="mono">Reviewed by our consultants</span>
      <span class="mono">&middot;</span>
      <span class="mono">2026</span>
    </div>
  </div>
</section>
<section style="padding-top:0">
  <div class="wrap">
    <div class="art-body rv">
{body}
      <div style="margin-top:44px;padding-top:30px;border-top:1px solid var(--edge)">
        <p class="small">This article is general information about eye conditions
          and does not replace an examination. If you have symptoms, book an
          assessment.</p>
        <a href="contact.html" class="btn btn-lit" style="margin-top:22px">Book an assessment <span class="ar">&rarr;</span></a>
      </div>
    </div>
  </div>
</section>
"""


def build_articles():
    written = []
    for cat, title, blurb, slug in ARTICLES:
        blocks = ART_BODY.get(slug, [])
        body = "\n".join(
            f"      <h2>{h}</h2>\n      <p>{p}</p>" for h, p in blocks
        )
        html = ART_HEAD.format(title=title, blurb=blurb, cat=cat, body=body)
        html += FOOT
        with open(os.path.join(DEST, f"journal-{slug}.html"), "w", encoding="utf-8") as fh:
            fh.write(html)
        written.append(f"journal-{slug}.html")
    return written


def build():
    pages = [
        ("services.html", page("Services", "Refractive surgery, cataract, retina and glaucoma care at LUMEN Eye Institute, Lagos.", SERVICES, "s")),
        ("about.html", page("The Institute", "LUMEN is a dedicated eye institute in Lagos. Four consultant ophthalmologists, one discipline.", ABOUT, "a")),
        ("journal.html", page("Journal", "Eye health writing by the consultants at LUMEN Eye Institute.", JOURNAL, "j")),
        ("contact.html", page("Book", "Book a sight assessment at LUMEN Eye Institute, Lagos.", CONTACT + FORM_CSS + CONTACT_FORM_JS)),
    ]
    for name, content in pages:
        with open(os.path.join(DEST, name), "w", encoding="utf-8") as fh:
            fh.write(content)
        print(f"  {name:22s} {len(content):>7,} bytes")
    arts = build_articles()
    for a in arts:
        print(f"  {a:22s} written")
    print(f"\nLUMEN: {len(pages)} pages + {len(arts)} articles")


if __name__ == "__main__":
    build()
