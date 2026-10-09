/* ============================================================
   LUMEN — shared behaviour for inner pages
   Header, mobile nav, reveal, counters, focus layer, anchors.
   ============================================================ */
(function(){
  'use strict';
  var reduce = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  /* ---------- header ---------- */
  var hdr = document.getElementById('hdr');
  if (hdr){
    var onScroll = function(){ hdr.classList.toggle('solid', window.scrollY > 30); };
    onScroll(); addEventListener('scroll', onScroll, {passive:true});
  }

  /* ---------- mobile nav ---------- */
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

  /* ---------- focus layer ---------- */
  var layer = document.getElementById('focuslayer');
  if (layer){
    if (!reduce && window.matchMedia('(pointer:fine)').matches){
      var tx=50, ty=40, cx=50, cy=40, rAF=null;
      document.addEventListener('pointermove', function(e){
        tx = (e.clientX / innerWidth) * 100;
        ty = (e.clientY / innerHeight) * 100;
        if (!rAF) rAF = requestAnimationFrame(step);
      }, {passive:true});
      function step(){
        cx += (tx - cx) * 0.14;
        cy += (ty - cy) * 0.14;
        layer.style.setProperty('--mx', cx.toFixed(2) + '%');
        layer.style.setProperty('--my', cy.toFixed(2) + '%');
        rAF = (Math.abs(tx-cx) > 0.05 || Math.abs(ty-cy) > 0.05)
          ? requestAnimationFrame(step) : null;
      }
      layer.style.setProperty('--lens','17%');
      setTimeout(function(){ layer.style.setProperty('--lens','13%'); }, 900);
    } else {
      layer.style.display = 'none';
    }
  }

  /* ---------- reveal ---------- */
  var rvs = document.querySelectorAll('.rv');
  if ('IntersectionObserver' in window && !reduce){
    var io = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){ en.target.classList.add('in'); io.unobserve(en.target); }
      });
    }, {threshold:0.12, rootMargin:'0px 0px -8% 0px'});
    rvs.forEach(function(el, i){
      el.style.transitionDelay = (Math.min(i % 3, 2) * 90) + 'ms';
      io.observe(el);
    });
  } else {
    rvs.forEach(function(el){ el.classList.add('in'); });
  }

  /* ---------- counters ---------- */
  function animateCount(el){
    var target = parseFloat(el.getAttribute('data-count'));
    var suffix = el.getAttribute('data-suffix') || '';
    if (reduce){ el.textContent = target + suffix; return; }
    var dur = 1500, t0 = null;
    function tick(ts){
      if (!t0) t0 = ts;
      var p = Math.min((ts - t0) / dur, 1);
      var eased = 1 - Math.pow(1 - p, 4);
      var val = target * eased;
      el.textContent = (target % 1 === 0 ? Math.round(val) : val.toFixed(1)) + suffix;
      if (p < 1) requestAnimationFrame(tick);
      else el.textContent = target + suffix;
    }
    requestAnimationFrame(tick);
  }
  var counters = document.querySelectorAll('[data-count]');
  if (counters.length && 'IntersectionObserver' in window){
    var cio = new IntersectionObserver(function(entries){
      entries.forEach(function(en){
        if (en.isIntersecting){ animateCount(en.target); cio.unobserve(en.target); }
      });
    }, {threshold:0.5});
    counters.forEach(function(el){ cio.observe(el); });
  } else {
    counters.forEach(function(el){
      el.textContent = el.getAttribute('data-count') + (el.getAttribute('data-suffix')||'');
    });
  }

  /* ---------- smooth in-page anchors ---------- */
  document.querySelectorAll('a[href^="#"]').forEach(function(a){
    a.addEventListener('click', function(e){
      var href = this.getAttribute('href');
      if (href === '#'){ e.preventDefault(); return; }
      var t = document.querySelector(href);
      if (t){ e.preventDefault(); t.scrollIntoView({behavior:'smooth', block:'start'}); }
    });
  });
})();
