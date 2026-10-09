/* Axiom — shared behaviour for inner pages */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var burger = document.getElementById('burger'), nav = document.getElementById('nav');
  if (burger && nav){
    burger.addEventListener('click', function(){
      var on = nav.classList.toggle('on');
      burger.classList.toggle('on', on);
      burger.setAttribute('aria-expanded', on ? 'true' : 'false');
    });
    nav.querySelectorAll('a').forEach(function(a){
      a.addEventListener('click', function(){
        nav.classList.remove('on'); burger.classList.remove('on');
        burger.setAttribute('aria-expanded','false');
      });
    });
  }
  var rvs = document.querySelectorAll('.rv, .tstep');
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(en){
      en.forEach(function(e){
        if (e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); }
      });
    }, {threshold:.15, rootMargin:'0px 0px -6% 0px'});
    rvs.forEach(function(el, i){
      el.style.transitionDelay = (Math.min(i % 4, 3) * 80) + 'ms';
      io.observe(el);
    });
  } else { rvs.forEach(function(el){ el.classList.add('in'); }); }
  function count(el){
    var t = parseFloat(el.getAttribute('data-count'));
    var sfx = el.getAttribute('data-suffix') || '';
    if (reduce){ el.textContent = t + sfx; return; }
    var dur = 1400, t0 = null;
    function tick(ts){
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var v = t * (1 - Math.pow(1 - p, 4));
      el.textContent = (t % 1 === 0 ? Math.round(v) : v.toFixed(1)) + sfx;
      if (p < 1) requestAnimationFrame(tick); else el.textContent = t + sfx;
    }
    requestAnimationFrame(tick);
  }
  var cs = document.querySelectorAll('[data-count]');
  if (cs.length && 'IntersectionObserver' in window){
    var co = new IntersectionObserver(function(en){
      en.forEach(function(e){ if (e.isIntersecting){ count(e.target); co.unobserve(e.target); } });
    }, {threshold:.6});
    cs.forEach(function(el){ co.observe(el); });
  } else {
    cs.forEach(function(el){ el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix')||''); });
  }
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var href = this.getAttribute('href');
      if (href === '#'){ e.preventDefault(); return; }
      var t = document.querySelector(href);
      if (t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });
})();
