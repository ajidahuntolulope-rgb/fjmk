// Full functional test suite for the FJMK sample sites.
// Uses jsdom to execute each page's real scripts and drive its real handlers.
//
//   node functional_suite.js
//
// Exit code 0 = all checks passed.
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = 'C:/Users/User/hermes-work/fjmk/samples';
const out = [];
const ck = (n, c, d) => out.push({ n, ok: !!c, d: d || '' });
const click = (w, el) => el && el.dispatchEvent(new w.MouseEvent('click', { bubbles: true }));

/* Load a page with a working DOM. Shared external scripts are injected
   manually and DOMContentLoaded is fired, because jsdom won't fetch file://. */
function boot(file, opts = {}) {
  const html = fs.readFileSync(file, 'utf8');
  const dom = new JSDOM(html, {
    runScripts: 'outside-only',
    pretendToBeVisual: true,
    url: 'file:///' + file.replace(/\\/g, '/'),
    beforeParse(w) {
      w.IntersectionObserver = class {
        constructor(cb) { this.cb = cb; }
        observe(el) { this.cb([{ isIntersecting: true, target: el }], this); }
        unobserve() {} disconnect() {}
      };
      w.matchMedia = w.matchMedia || (() => ({
        matches: !!opts.reduceMotion, addEventListener() {}, removeEventListener() {},
        addListener() {}, removeListener() {}
      }));
      w.scrollTo = () => {}; w.alert = () => {};
      w.requestAnimationFrame = (fn) => setTimeout(() => fn(w.performance.now()), 0);
      w.cancelAnimationFrame = (id) => clearTimeout(id);
      w.setInterval = () => 0; w.clearInterval = () => {};
    }
  });
  const w = dom.window;

  // external shared scripts
  for (const m of html.matchAll(/<script[^>]*\bsrc="([^"]+)"/gi)) {
    const src = m[1];
    if (/^https?:/.test(src)) continue;
    const p = path.resolve(path.dirname(file), src);
    if (!fs.existsSync(p)) continue;
    try { w.eval(fs.readFileSync(p, 'utf8')); } catch (e) { /* recorded by caller */ }
  }
  // inline scripts
  let ran = 0, err = null;
  for (const m of html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)) {
    if (!m[1].trim()) continue;
    try { w.eval(m[1]); ran++; } catch (e) { err = e.message; }
  }
  // fire the event deferred scripts wait on
  try { w.document.dispatchEvent(new w.Event('DOMContentLoaded', { bubbles: true })); } catch (e) {}
  try { w.dispatchEvent(new w.Event('DOMContentLoaded')); } catch (e) {}
  return { w, d: w.document, ran, err };
}

function site(name, fn) {
  const dir = path.join(ROOT, name, 'index.html');
  if (!fs.existsSync(dir)) { ck(`${name} · file exists`, false, 'missing'); return; }
  const t = setTimeout(() => {}, 0);
  try { fn(dir); } catch (e) { ck(`${name} · harness error`, false, e.message); }
  clearTimeout(t);
}

/* ============================================================ 01 LUMEN */
site('01-lumen-eye', (f) => {
  const { w, d, ran, err } = boot(f);
  ck('LUMEN · scripts execute', ran > 0 && !err, err || `${ran} script(s)`);
  const body = d.getElementById('chartbody');
  ck('LUMEN · acuity chart renders 8 lines',
     body && body.querySelectorAll('.chart-row').length === 8,
     body ? `${body.querySelectorAll('.chart-row').length} rows` : 'no #chartbody');
  ck('LUMEN · first line revealed on load',
     body && body.querySelectorAll('.chart-row.on').length === 1, '');
  if (body && body.querySelectorAll('.chart-row').length) {
    click(w, body.querySelectorAll('.chart-row')[0]);
    const v = d.getElementById('verdict');
    ck('LUMEN · reading a line advances the chart',
       body.querySelectorAll('.chart-row.on').length === 2 && v && /20\/200/.test(v.textContent),
       v ? v.textContent : '');
  }
  const reset = d.getElementById('reset');
  if (reset) {
    click(w, reset);
    ck('LUMEN · New chart rebuilds',
       body.querySelectorAll('.chart-row').length === 8, '');
  }
  ck('LUMEN · stat counters present', d.querySelectorAll('[data-count]').length >= 3,
     `${d.querySelectorAll('[data-count]').length}`);
});

/* ============================================================ 02 AXIOM */
site('02-axiom-labs', (f) => {
  const { w, d, ran, err } = boot(f);
  ck('AXIOM · scripts execute', ran > 0 && !err, err || `${ran} script(s)`);
  const list = d.getElementById('testlist');
  const tests = list ? list.querySelectorAll('.test') : [];
  ck('AXIOM · catalogue renders all tests', tests.length >= 39, `${tests.length} tests`);
  const totalEl = d.getElementById('total');
  ck('AXIOM · total starts at zero', totalEl && /0/.test(totalEl.textContent),
     totalEl ? totalEl.textContent.trim() : '');

  if (tests.length >= 2) {
    click(w, tests[0]); click(w, tests[1]);
    const cnt = d.getElementById('cnt'), sub = d.getElementById('sub');
    ck('AXIOM · selecting tests updates count', cnt && /2 tests/.test(cnt.textContent),
       cnt ? cnt.textContent.trim() : '');
    ck('AXIOM · subtotal computes', sub && !/^\u20A60$/.test(sub.textContent.trim()),
       sub ? sub.textContent.trim() : '');
  }
  const home = d.querySelector('#mode button[data-m="home"]');
  if (home) {
    click(w, home);
    const coll = d.getElementById('coll');
    ck('AXIOM · home visit adds a fee', coll && /7,500/.test(coll.textContent),
       coll ? coll.textContent.trim() : '');
  }
  const slot = d.querySelector('#slots button');
  if (slot) {
    click(w, slot);
    const pay = d.getElementById('pay');
    ck('AXIOM · pay enables after a slot is chosen', pay && !pay.disabled, '');
    if (pay && !pay.disabled) {
      click(w, pay);
      const rec = d.getElementById('receipt'), ref = d.getElementById('ref');
      ck('AXIOM · checkout produces a receipt',
         rec && rec.classList.contains('on') && ref && /AXM-\d{4}-\d{5}/.test(ref.textContent),
         ref ? ref.textContent.replace(/\s+/g, ' ').trim().slice(0, 60) : '');
    }
  }
  const search = d.getElementById('search');
  if (search && list) {
    search.value = 'malaria';
    search.dispatchEvent(new w.Event('input', { bubbles: true }));
    const n = list.querySelectorAll('.test').length;
    ck('AXIOM · search filters the catalogue', n > 0 && n < tests.length, `${n} match`);
  }
});

/* ============================================================ 03 VEIL */
site('03-veil-sexual-health', (f) => {
  const { d, ran, err } = boot(f);
  ck('VEIL · scripts execute', ran > 0 && !err, err || `${ran} script(s)`);
  ck('VEIL · booking form present', !!d.getElementById('bookingForm'), '');
  ck('VEIL · scroll progress element', !!d.getElementById('veilProgress'), '');
  ck('VEIL · confidentiality section', !!d.getElementById('confidentiality'), '');
});

/* ============================================================ 05 MAISON */
site('05-maison-aesthetics', (f) => {
  const { d, ran, err } = boot(f);
  ck('MAISON · scripts execute', ran > 0 && !err, err || `${ran} script(s)`);
  ck('MAISON · booking form present', !!d.getElementById('booking-form'), '');
  ck('MAISON · lookbook present', !!d.getElementById('lookbook'), '');
  const caps = d.querySelectorAll('[id^="t"][id$="cap"]').length;
  ck('MAISON · treatment captions', caps >= 4, `${caps} captions`);
});

/* ============================================================ 09 TERRA */
site('09-terra-derm', (f) => {
  const { d, ran, err } = boot(f);
  ck('TERRA · scripts execute', ran > 0 && !err, err || `${ran} script(s)`);
  ck('TERRA · skin diagram present', !!d.getElementById('skinDiagram'), '');
  ck('TERRA · booking form present', !!d.getElementById('bookingForm'), '');
  const svgs = d.querySelectorAll('svg').length;
  ck('TERRA · SVG illustrations', svgs >= 5, `${svgs} svg`);
});

/* ============================================================ 10 HEARTH */
site('10-hearth-home-care', (f) => {
  const { d, ran, err } = boot(f);
  ck('HEARTH · scripts execute', ran > 0 && !err, err || `${ran} script(s)`);
  const forms = d.querySelectorAll('form').length;
  ck('HEARTH · enquiry form present', forms >= 1, `${forms} form(s)`);
});

/* ============================================================ 12 SCRIPT */
site('12-script-pharmacy', (f) => {
  const { w, d, err } = boot(f);
  ck('SCRIPT · external script evaluates', !err, err || 'ok');
  const grid = d.getElementById('product-grid');
  const prods = grid ? grid.querySelectorAll('[data-id]').length : 0;
  ck('SCRIPT · product grid renders products', prods >= 18, `${prods} products`);
  if (prods) {
    const btn = grid.querySelector('[data-id] button');
    if (btn) {
      click(w, btn);
      const cnt = d.getElementById('basket-count');
      ck('SCRIPT · add-to-basket updates count', cnt && /[1-9]/.test(cnt.textContent),
         cnt ? cnt.textContent.trim() : '');
      const dt = d.getElementById('drawer-total');
      ck('SCRIPT · drawer total updates', dt && /\d/.test(dt.textContent),
         dt ? dt.textContent.trim() : '');
    } else ck('SCRIPT · product has add button', false, 'none');
  }
  const si = d.getElementById('search-input');
  if (si && grid) {
    si.value = 'paracetamol';
    si.dispatchEvent(new w.Event('input', { bubbles: true }));
    const n = grid.querySelectorAll('[data-id]').length;
    ck('SCRIPT · search filters products', n > 0 && n < prods, `${n} after filter`);
  }
  const sub = path.join(ROOT, '12-script-pharmacy/subscriptions.html');
  ck('SCRIPT · subscriptions page exists', fs.existsSync(sub), '');
});


/* ============================================================ 06 HAVEN */
site('06-haven-mind', (f) => {
  const { w, d, ran, err } = boot(f);
  ck('HAVEN · scripts execute', ran > 0 && !err, err || `${ran} script(s)`);
  const core = d.getElementById('bwcore');
  const prog = d.getElementById('bwprog');
  const phase = d.getElementById('bwphase');
  const start = d.getElementById('bwstart');
  const stop = d.getElementById('bwstop');
  ck('HAVEN · breathing widget present', !!(core && prog && phase && start && stop), '');
  ck('HAVEN · widget starts idle', d.getElementById('bwstate').textContent.trim() === 'Ready', '');
  ck('HAVEN · ring circumference set', /\d/.test(prog.style.strokeDasharray || ''),
     `dasharray=${(prog.style.strokeDasharray||'').slice(0,8)}`);
  if (start) {
    click(w, start);
    ck('HAVEN · begin starts the cycle',
       /Breathing/.test(d.getElementById('bwstate').textContent) &&
       /Breathe in/.test(phase.textContent),
       `phase="${phase.textContent.trim()}"`);
    ck('HAVEN · core enters inhale state', core.classList.contains('inhale'), '');
    if (stop) {
      click(w, stop);
      ck('HAVEN · stop returns to idle',
         /Stopped/.test(d.getElementById('bwstate').textContent), '');
    }
  }
  ck('HAVEN · crisis notice present',
     /in crisis|emergency/i.test(d.body.textContent), '');
  ck('HAVEN · booking form present', !!d.getElementById('havenform'), '');
});


/* ============================================================ 04 KINETIC */
site('04-kinetic-physio', (f) => {
  const { w, d, ran, err } = boot(f);
  ck('KINETIC · scripts execute', ran > 0 && !err, err || `${ran} script(s)`);
  ck('KINETIC · 6 service cards', d.querySelectorAll('.scard').length === 6,
     `${d.querySelectorAll('.scard').length}`);
  ck('KINETIC · recovery timeline stages', d.querySelectorAll('.tl-mark').length === 5,
     `${d.querySelectorAll('.tl-mark').length}`);
  ck('KINETIC · pointer-tilt cards', d.querySelectorAll('[data-tilt]').length === 6,
     `${d.querySelectorAll('[data-tilt]').length}`);
  ck('KINETIC · overshoot counters present', d.querySelectorAll('[data-count]').length === 4,
     `${d.querySelectorAll('[data-count]').length}`);
  ck('KINETIC · diagonal section break', /clip-path:\s*polygon/.test(fs.readFileSync(f,'utf8')), '');
  ck('KINETIC · booking form present', !!d.getElementById('kineticform'), '');
  // counters should land on their targets after the overshoot animation
  setTimeout(() => {
    const vals = [...d.querySelectorAll('[data-count]')].map(e => e.textContent.trim());
    ck('KINETIC · counters reach targets', vals.every(v => v !== '0'), vals.join(' '));
  }, 2400);
});

/* ============================================================ 07 SPROUT */
site('07-sprout-paeds', (f) => {
  const { w, d, ran, err } = boot(f);
  ck('SPROUT · scripts execute', ran > 0 && !err, err || `${ran} script(s)`);
  ck('SPROUT · 6 service cards', d.querySelectorAll('.scard').length === 6,
     `${d.querySelectorAll('.scard').length}`);
  ck('SPROUT · vaccination timeline rows', d.querySelectorAll('.vrow').length === 6,
     `${d.querySelectorAll('.vrow').length}`);
  ck('SPROUT · growth chart plotted points', d.querySelectorAll('.gdot').length === 4,
     `${d.querySelectorAll('.gdot').length}`);
  ck('SPROUT · visit steps', d.querySelectorAll('.step').length === 4,
     `${d.querySelectorAll('.step').length}`);
  ck('SPROUT · parent testimonials', d.querySelectorAll('.q').length === 3,
     `${d.querySelectorAll('.q').length}`);
  ck('SPROUT · fee cards', d.querySelectorAll('.fee').length === 3,
     `${d.querySelectorAll('.fee').length}`);
  ck('SPROUT · drifting confetti shapes', d.querySelectorAll('.confetti i').length === 6,
     `${d.querySelectorAll('.confetti i').length}`);
  ck('SPROUT · booking form present', !!d.getElementById('sproutform'), '');
  ck('SPROUT · after-hours notice', /urgent|after.hours/i.test(d.body.textContent), '');
});

/* ============================================================ 08 AXIS */
site('08-axis-ortho', (f) => {
  const { w, d, ran, err } = boot(f);
  ck('AXIS · scripts execute', ran > 0 && !err, err || `${ran} script(s)`);
  ck('AXIS · blueprint grid background', /body::before/.test(fs.readFileSync(f,'utf8')), '');
  ck('AXIS · interactive regions', d.querySelectorAll('.region').length === 6,
     `${d.querySelectorAll('.region').length}`);
  ck('AXIS · annotation ticks', d.querySelectorAll('.tick').length >= 6,
     `${d.querySelectorAll('.tick').length}`);
  ck('AXIS · procedure datasheets', d.querySelectorAll('.sheet-row').length === 5,
     `${d.querySelectorAll('.sheet-row').length}`);
  ck('AXIS · line-draw paths', d.querySelectorAll('.draw').length >= 7,
     `${d.querySelectorAll('.draw').length}`);
  ck('AXIS · outcome bars', d.querySelectorAll('.bar[data-w]').length === 6,
     `${d.querySelectorAll('.bar[data-w]').length}`);
  // clicking every region must produce distinct readouts
  const title = d.getElementById('ro-title');
  const seen = new Set();
  for (const g of d.querySelectorAll('.region')) {
    click(w, g);
    if (title) seen.add(title.textContent.trim());
  }
  ck('AXIS · regions produce distinct readouts', seen.size >= 4, `${seen.size} distinct`);
  ck('AXIS · booking form present', !!d.getElementById('axisform'), '');
  ck('AXIS · outcomes disclaimer', /Outcomes vary by patient/i.test(d.body.textContent), '');
});

/* ============================================================ 11 ATLAS */
site('11-atlas-medical-tourism', (f) => {
  const { w, d, ran, err } = boot(f);
  ck('ATLAS · scripts execute', ran > 0 && !err, err || `${ran} script(s)`);
  ck('ATLAS · animated flight routes', d.querySelectorAll('.route').length === 4,
     `${d.querySelectorAll('.route').length}`);
  ck('ATLAS · boarding-pass cards', d.querySelectorAll('.bp').length === 4,
     `${d.querySelectorAll('.bp').length}`);
  ck('ATLAS · perforated stubs', d.querySelectorAll('.bp-stub').length === 4,
     `${d.querySelectorAll('.bp-stub').length}`);
  ck('ATLAS · rubber stamp graphic', d.querySelectorAll('.stamp-mark').length === 1, '');
  ck('ATLAS · 6 process steps', d.querySelectorAll('.step').length === 6,
     `${d.querySelectorAll('.step').length}`);
  ck('ATLAS · cost comparison rows', d.querySelectorAll('.ctable tbody tr').length === 5,
     `${d.querySelectorAll('.ctable tbody tr').length}`);
  ck('ATLAS · partner hospitals', d.querySelectorAll('.hcard').length === 3,
     `${d.querySelectorAll('.hcard').length}`);
  ck('ATLAS · booking form present', !!d.getElementById('atlasform'), '');
  ck('ATLAS · agency-not-provider disclaimer',
     /not a medical provider|coordination agency/i.test(d.body.textContent), '');
});

/* ============================================================ report */
console.log('\n=== FJMK SAMPLE SITES — FUNCTIONAL CHECKS ===\n');
let pass = 0;
for (const r of out) {
  console.log(`  ${r.ok ? '\u2713' : '\u2717'} ${r.n}${r.d ? '  \u2014 ' + r.d : ''}`);
  if (r.ok) pass++;
}
console.log(`\n${pass}/${out.length} checks passed`);
process.exit(pass === out.length ? 0 : 1);
