// Functional test of the interactive components, against a real DOM (jsdom).
// This actually executes each page's inline scripts and drives the handlers.
const fs = require('fs');
const path = require('path');
const { JSDOM } = require('jsdom');

const ROOT = 'C:/Users/User/hermes-work/fjmk/samples';

const results = [];
function check(name, cond, detail) {
  results.push({ name, ok: !!cond, detail: detail || '' });
}

function load(file) {
  const html = fs.readFileSync(file, 'utf8');
  return new JSDOM(html, {
    runScripts: 'dangerously',
    pretendToBeVisual: true,
    beforeParse(win) {
      win.IntersectionObserver = class {
        constructor(cb) { this.cb = cb; }
        observe(el) { this.cb([{ isIntersecting: true, target: el }], this); }
        unobserve() {} disconnect() {}
      };
      win.matchMedia = win.matchMedia || (() => ({
        matches: false, addEventListener() {}, removeEventListener() {}, addListener() {}, removeListener() {}
      }));
      win.scrollTo = () => {};
      win.alert = () => {};
    }
  });
}

function runInline(dom, file) {
  const html = fs.readFileSync(file, 'utf8');
  const win = dom.window;
  const scripts = [...html.matchAll(/<script\b(?![^>]*\bsrc=)[^>]*>([\s\S]*?)<\/script>/gi)].map(m => m[1]);
  let ran = 0, err = null;
  for (const code of scripts) {
    if (!code.trim()) continue;
    try { win.eval(code); ran++; }
    catch (e) { err = e.message; }
  }
  return { ran, err };
}

function loadExternal(dom, file) {
  const html = fs.readFileSync(file, 'utf8');
  const win = dom.window;
  for (const m of html.matchAll(/<script[^>]*\bsrc="([^"]+)"/gi)) {
    const src = m[1];
    if (/^https?:/.test(src)) continue;
    const f = path.resolve(path.dirname(file), src);
    if (!fs.existsSync(f)) continue;
    try { win.eval(fs.readFileSync(f, 'utf8')); } catch (e) {}
  }
}

const click = (dom, el) => el && el.dispatchEvent(new dom.window.MouseEvent('click', { bubbles: true }));

// ---------------------------------------------------------------- LUMEN
{
  const f = path.join(ROOT, '01-lumen-eye/index.html');
  const dom = load(f);
  loadExternal(dom, f);
  const { ran, err } = runInline(dom, f);
  check('LUMEN - scripts execute without error', ran > 0 && !err, err || ran + ' inline script(s)');

  const d = dom.window.document;
  const body = d.getElementById('chartbody');
  const rows = body ? body.querySelectorAll('.chart-row') : [];
  check('LUMEN - acuity chart renders 8 lines', rows.length === 8, rows.length + ' rows');
  check('LUMEN - first line revealed on load',
        body && body.querySelectorAll('.chart-row.on').length === 1,
        body ? body.querySelectorAll('.chart-row.on').length + ' visible' : '');

  if (rows.length) {
    click(dom, rows[0]);
    const v = d.getElementById('verdict');
    const nowVisible = body.querySelectorAll('.chart-row.on').length;
    check('LUMEN - reading a line advances the chart',
          nowVisible === 2 && v && /20\/200/.test(v.textContent),
          'visible=' + nowVisible + ' verdict="' + (v ? v.textContent : '') + '"');
  }
  const reset = d.getElementById('reset');
  if (reset) {
    click(dom, reset);
    check('LUMEN - New chart rebuilds', body.querySelectorAll('.chart-row').length === 8,
          body.querySelectorAll('.chart-row').length + ' rows after reset');
  }
  check('LUMEN - stat counters present', d.querySelectorAll('[data-count]').length >= 3,
        d.querySelectorAll('[data-count]').length + ' counters');
}

// ---------------------------------------------------------------- AXIOM
{
  const f = path.join(ROOT, '02-axiom-labs/index.html');
  const dom = load(f);
  loadExternal(dom, f);
  const { ran, err } = runInline(dom, f);
  check('AXIOM - scripts execute without error', ran > 0 && !err, err || ran + ' inline script(s)');

  const d = dom.window.document;
  const list = d.getElementById('testlist');
  const tests = list ? list.querySelectorAll('.test') : [];
  check('AXIOM - catalogue renders all tests', tests.length >= 39, tests.length + ' tests');

  const totalEl = d.getElementById('total');
  check('AXIOM - total starts at zero', totalEl && /0/.test(totalEl.textContent),
        totalEl ? totalEl.textContent.trim() : 'missing');

  if (tests.length >= 2) {
    click(dom, tests[0]);
    click(dom, tests[1]);
    const cnt = d.getElementById('cnt'), sub = d.getElementById('sub');
    check('AXIOM - selecting tests updates the count', cnt && /2 tests/.test(cnt.textContent),
          cnt ? cnt.textContent.trim() : '');
    check('AXIOM - subtotal computes', sub && !/^\u20A60$/.test(sub.textContent.trim()),
          sub ? sub.textContent.trim() : '');
  }

  const modeHome = d.querySelector('#mode button[data-m="home"]');
  if (modeHome) {
    click(dom, modeHome);
    const coll = d.getElementById('coll');
    check('AXIOM - home visit adds a fee', coll && /7,500/.test(coll.textContent),
          coll ? coll.textContent.trim() : '');
  }

  const slot = d.querySelector('#slots button');
  if (slot) {
    click(dom, slot);
    const pay = d.getElementById('pay');
    check('AXIOM - pay enables once a slot is chosen', pay && !pay.disabled,
          pay ? 'disabled=' + pay.disabled : '');
    if (pay && !pay.disabled) {
      click(dom, pay);
      const rec = d.getElementById('receipt'), ref = d.getElementById('ref');
      check('AXIOM - checkout produces a receipt',
            rec && rec.classList.contains('on') && ref && /AXM-\d{4}-\d{5}/.test(ref.textContent),
            ref ? ref.textContent.replace(/\s+/g, ' ').trim().slice(0, 70) : '');
    }
  }

  const search = d.getElementById('search');
  if (search) {
    search.value = 'malaria';
    search.dispatchEvent(new dom.window.Event('input', { bubbles: true }));
    const filtered = list.querySelectorAll('.test').length;
    check('AXIOM - search filters the catalogue', filtered > 0 && filtered < tests.length,
          filtered + ' match "malaria"');
  }
}

// ---------------------------------------------------------------- AXIOM tests page
{
  const f = path.join(ROOT, '02-axiom-labs/tests.html');
  const dom = load(f);
  loadExternal(dom, f);
  const { err } = runInline(dom, f);
  const rows = dom.window.document.getElementById('rows');
  const n = rows ? rows.querySelectorAll('tr').length : 0;
  check('AXIOM tests.html - price table populated', n >= 39 && !err,
        n + ' rows' + (err ? ' ERR:' + err : ''));
}

console.log('\n=== FUNCTIONAL CHECKS ===');
let pass = 0;
for (const r of results) {
  console.log('  ' + (r.ok ? '\u2713' : '\u2717') + ' ' + r.name + (r.detail ? '  \u2014 ' + r.detail : ''));
  if (r.ok) pass++;
}
console.log('\n' + pass + '/' + results.length + ' checks passed');
process.exit(pass === results.length ? 0 : 1);
