(() => {
  const reduced = matchMedia('(prefers-reduced-motion: reduce)');
  const menu = document.querySelector('.menu-toggle');
  const navigation = document.querySelector('#navigation');
  function closeMenu() {navigation?.classList.remove('open');menu?.setAttribute('aria-expanded','false');menu?.setAttribute('aria-label','Open menu');}
  menu?.addEventListener('click',() => {const open=navigation.classList.toggle('open');menu.setAttribute('aria-expanded',String(open));menu.setAttribute('aria-label',open?'Close menu':'Open menu');});
  document.addEventListener('keydown',e=>{if(e.key==='Escape'){closeMenu();}});
  navigation?.querySelectorAll('a').forEach(a=>a.addEventListener('click',closeMenu));

  document.querySelectorAll('[data-film]').forEach(container=>{
    const video=container.querySelector('video'),control=container.querySelector('button');
    const update=()=>{if(!control)return;control.firstChild.textContent=video.paused?'Play film ':'Pause ';control.lastElementChild.textContent=video.paused?'▷':'Ⅱ';control.setAttribute('aria-label',video.paused?'Play film':'Pause film');};
    if(reduced.matches)video.pause();
    video.addEventListener('play',update);video.addEventListener('pause',update);video.addEventListener('ended',update);
    control?.addEventListener('click',()=>{if(video.paused){video.play().catch(()=>{control.firstChild.textContent='Try playing again ';});}else video.pause();});
    update();
    if('IntersectionObserver' in window){new IntersectionObserver(entries=>{for(const entry of entries)if(!entry.isIntersecting)video.pause();else if(video.autoplay&&!reduced.matches)video.play().catch(()=>{});},{threshold:0}).observe(video);}
  });

  const fan = document.querySelector('[data-fan]');
  const toggle = document.querySelector('[data-carousel-toggle]');
  let automatic = !reduced.matches;
  const updateToggle = () => {
    if (!toggle) return;
    toggle.textContent = automatic ? 'Pause gallery' : 'Play gallery';
    toggle.setAttribute('aria-label', automatic ? 'Pause moving gallery' : 'Play moving gallery');
  };
  toggle?.addEventListener('click', () => { automatic = !automatic; updateToggle(); });
  updateToggle();
  if (fan) {
    const cards = [...fan.querySelectorAll('[data-fan-index]')];
    const slots = [...fan.querySelectorAll('[data-fan-slot]')];
    const total = cards.length;
    const title = document.querySelector('[data-fan-title]');
    const category = document.querySelector('[data-fan-category]');
    const open = document.querySelector('[data-fan-open]');
    const count = document.querySelector('[data-fan-count]');
    const wrap = n => ((n % total) + total) % total;
    let position = 0, velocity = 0, width = 480, spread = 215, target = null;
    let dragging = null, hovered = false, focused = false, visible = false;
    let active = -1, lastFrame = 0, autoClock = 0, suppressClickUntil = 0;
    const entrance = { value: reduced.matches ? 1 : 0 };
    let entered = reduced.matches;
    const metadata = cards.map(card => ({
      title: card.querySelector('img').alt.replace(' concept website preview', ''),
      image: card.querySelector('img').getAttribute('src'),
      href: card.getAttribute('href'),
    }));
    const categories = ['Eye care','Diagnostics','Sexual health','Physiotherapy','Aesthetics','Mental health','Paediatrics','Orthopaedics','Dermatology','Home care','Medical travel','Pharmacy','Dental care','Family medicine','Diagnostics','Specialist care'];
    function metrics() {
      const available = fan.clientWidth;
      width = available < 480 ? Math.min(248, available * .67) : available < 800 ? 370 : 480;
      spread = width * .49;
      fan.style.setProperty('--fan-width', width + 'px');
      fan.style.setProperty('--fan-height', width * .69 + 'px');
      slots.forEach((slot, i) => {
        const side = i === 0 ? -1 : 1;
        slot.style.width = width * .56 + 'px';
        slot.style.height = width * .69 * .56 + 'px';
        slot.style.marginLeft = -width * .56 / 2 + 'px';
        slot.style.marginTop = -width * .69 * .56 / 2 + 'px';
        slot.style.transform = 'translateX(' + side * 2 * spread + 'px) rotate(' + side * 10 + 'deg)';
      });
    }
    function render() {
      const selected = wrap(Math.round(position));
      if (selected !== active) {
        active = selected;
        title.textContent = metadata[selected].title;
        category.textContent = categories[selected] + ' · Concept website';
        if(open) open.href = metadata[selected].href;
        if(open) open.setAttribute('aria-label', 'Open ' + metadata[selected].title + ' concept website');
        count.textContent = String(selected + 1).padStart(2, '0') + ' / ' + total;
      }
      cards.forEach((card, i) => {
        let offset = i - position;
        while (offset > total / 2) offset -= total;
        while (offset < -total / 2) offset += total;
        const distance = Math.abs(offset), ghost = distance >= 2;
        const opacity = distance > 3 ? 0 : ghost ? Math.max(0, 3 - distance) : 1;
        const progress = entrance.value;
        const scale = .3 + (Math.max(.4, 1 - distance * .22) - .3) * progress;
        card.style.transform = 'translate3d(' + offset * spread * progress + 'px,' + distance * distance * 4 * progress + 'px,0) rotate(' + offset * 5 * progress + 'deg) scale(' + scale + ')';
        card.style.opacity = opacity * progress;
        card.style.zIndex = ghost ? 0 : Math.round((3 - distance) * 10);
        card.style.pointerEvents = ghost || distance > 2 ? 'none' : 'auto';
        card.tabIndex = i === selected ? 0 : -1;
        card.setAttribute('aria-hidden', String(distance >= 2));
        card.querySelector('.fan-image').style.opacity = ghost ? 0 : 1;
        card.querySelector('.fan-ghost').style.opacity = ghost ? 1 : 0;
        card.querySelector('.fan-accent').style.opacity = ghost ? 0 : Math.max(0, 1 - distance * 2.5);
        card.querySelector('.fan-shade').style.opacity = Math.min(.35, distance / 2 * .35);
        card.style.boxShadow = ghost ? 'none' : '0 20px 45px -24px #1f1b1766, 0 4px 12px #1f1b1710';
      });
      [wrap(Math.floor(position) - 2), wrap(Math.ceil(position) + 2)].forEach((index, i) => {
        const image = slots[i].querySelector('img');
        if (image.getAttribute('src') !== metadata[index].image) image.src = metadata[index].image;
        slots[i].style.opacity = entrance.value;
      });
    }
    function moveBy(amount) {
      target = Math.round(target ?? position) + amount;
      if(reduced.matches){position=target;target=null;}
      velocity = 0; autoClock = 0;
      render();
    }
    document.querySelector('[data-fan-prev]').addEventListener('click', () => moveBy(-1));
    document.querySelector('[data-fan-next]').addEventListener('click', () => moveBy(1));
    fan.addEventListener('keydown', event => {
      if (event.key !== 'ArrowRight' && event.key !== 'ArrowLeft') return;
      event.preventDefault(); moveBy(event.key === 'ArrowRight' ? 1 : -1);
    });
    fan.addEventListener('pointerdown', event => {
      if (event.button !== 0) return;
      dragging = { x: event.clientX, y: event.clientY, last: event.clientX, time: performance.now(), axis: null, id: event.pointerId };
      velocity = 0; autoClock = 0; target = null;
    });
    fan.addEventListener('pointermove', event => {
      if (!dragging || dragging.id !== event.pointerId) return;
      const dx = event.clientX - dragging.x, dy = event.clientY - dragging.y;
      if (!dragging.axis && Math.hypot(dx, dy) > 8) {
        dragging.axis = Math.abs(dx) > Math.abs(dy) * 1.2 ? 'x' : 'y';
        if (dragging.axis === 'x') fan.setPointerCapture(event.pointerId);
      }
      if (dragging.axis !== 'x') return;
      const now = performance.now(), delta = event.clientX - dragging.last, dt = Math.max(8, now - dragging.time);
      const sensitivity = 1.55 / width;
      position -= delta * sensitivity;
      velocity = Math.max(-.8, Math.min(.8, -delta * sensitivity / dt * 16));
      dragging.last = event.clientX; dragging.time = now;
      fan.classList.add('dragging');
      event.preventDefault(); render();
    });
    function release(event) {
      if (!dragging) return;
      if (dragging.axis === 'x') suppressClickUntil = performance.now() + 250;
      if (fan.hasPointerCapture(event.pointerId)) fan.releasePointerCapture(event.pointerId);
      velocity *= 1.1; dragging = null; fan.classList.remove('dragging');
      if (reduced.matches) { position = Math.round(position); velocity = 0; render(); }
    }
    fan.addEventListener('pointerup', release);
    fan.addEventListener('pointercancel', release);
    window.addEventListener('pointerup', event => { if (dragging) release(event); });
    fan.addEventListener('click', event => { if (performance.now() < suppressClickUntil) {event.preventDefault();event.stopPropagation();} }, true);
    fan.addEventListener('dragstart', event => event.preventDefault());
    fan.addEventListener('wheel', event => {
      if (!(Math.abs(event.deltaX) > Math.abs(event.deltaY) || event.shiftKey)) return;
      const delta = Math.abs(event.deltaX) > Math.abs(event.deltaY) ? event.deltaX : event.deltaY;
      event.preventDefault(); position += delta * .003; velocity = delta * .001; autoClock = 0; target = null;
      if (reduced.matches) { position = Math.round(position); velocity = 0; }
      render();
    }, { passive: false });
    fan.addEventListener('pointerenter', () => hovered = true);
    fan.addEventListener('pointerleave', () => hovered = false);
    fan.addEventListener('focusin', () => focused = true);
    fan.addEventListener('focusout', () => focused = false);
    new IntersectionObserver(entries => {
      visible = entries[0].isIntersecting;
      if (visible && !entered) {
        entered = true;
        if (window.gsap) gsap.to(entrance, {value:1,duration:1,ease:'power3.out'});
        else entrance.value = 1;
      }
    }, { threshold: .1 }).observe(fan);
    function tick(time) {
      const elapsed = Math.min(40, time - (lastFrame || time)); lastFrame = time;
      if (visible && !document.hidden) {
        if (!dragging) {
          const factor = elapsed / 16.67;
          if(target !== null){
            velocity += (target-position)*.075*factor;
            velocity *= Math.pow(.72,factor);
            position += velocity*factor;
            if(Math.abs(target-position)<.002&&Math.abs(velocity)<.002){position=target;target=null;velocity=0;}
          }else{
          position += velocity * factor;
          velocity *= Math.pow(.92, factor);
          if (Math.abs(velocity) < .15) {
            velocity += (Math.round(position) - position) * .08 * factor;
            velocity *= Math.pow(.75, factor);
          }
          if (Math.abs(velocity) < .0005) { velocity = 0; if (Math.abs(Math.round(position) - position) < .01) position = Math.round(position); }
          }
          if (automatic && !reduced.matches && !hovered && !focused) {
            autoClock += elapsed;
            if (autoClock > 4800) { target=Math.round(position)+1; velocity=0; autoClock = 0; }
          }
        }
        render();
      }
      requestAnimationFrame(tick);
    }
    window.addEventListener('resize', () => { metrics(); render(); });
    metrics(); render(); requestAnimationFrame(tick);
  }

  const mosaicImage=document.querySelector('.tile-a img');
  if(mosaicImage&&window.gsap){const tiles=[['01-lumen-eye','Lumen Eye'],['05-maison-aesthetics','Maison'],['06-haven-mind','Haven Mind'],['02-axiom-labs','Axiom Labs']];let tile=0;setInterval(()=>{if(reduced.matches||!pageMotion||document.hidden||scrollY>innerHeight)return;tile=(tile+1)%tiles.length;const next=new Image();next.onload=()=>{gsap.to(mosaicImage,{opacity:0,duration:.35,onComplete:()=>{mosaicImage.src=next.src;mosaicImage.alt=tiles[tile][1]+' concept website';gsap.to(mosaicImage,{opacity:1,duration:.6});}});};next.src='/assets/previews/'+tiles[tile][0]+'.webp';},6500);}
  reduced.addEventListener('change',()=>{if(reduced.matches){automatic=false;updateToggle();document.querySelectorAll('video').forEach(v=>v.pause());}});
  document.querySelectorAll('.portfolio-grid .project-card').forEach(card=>{
    const screen=card.querySelector('.project-screen');
    card.addEventListener('pointermove',event=>{if(reduced.matches||event.pointerType==='touch')return;const box=card.getBoundingClientRect();const x=(event.clientX-box.left)/box.width-.5,y=(event.clientY-box.top)/box.height-.5;screen.style.setProperty('--tilt-x',-y*4+'deg');screen.style.setProperty('--tilt-y',x*5+'deg');});
    card.addEventListener('pointerleave',()=>{screen.style.setProperty('--tilt-x','0deg');screen.style.setProperty('--tilt-y','0deg');});
  });

  if(window.gsap&&window.ScrollTrigger){
    gsap.registerPlugin(ScrollTrigger);
    const mm=gsap.matchMedia();
    mm.add('(prefers-reduced-motion: no-preference)',()=>{
      if(document.querySelector('.hero')){
        gsap.from('.hero-copy > *',{y:14,duration:.6,stagger:.07,ease:'power2.out'});

      }
      gsap.utils.toArray('.portfolio-grid .project-card').forEach((el,i)=>gsap.from(el,{y:35,opacity:.2,scale:.97,duration:.75,ease:'power2.out',scrollTrigger:{trigger:el,start:'top 94%',once:true},delay:(i%3)*.06}));
      gsap.utils.toArray('.service-row,.blog-row,.about-story,.team-grid article').forEach(el=>gsap.from(el,{y:20,opacity:.4,duration:.65,scrollTrigger:{trigger:el,start:'top 95%',once:true}}));
    });
  }

  const form=document.querySelector('#project-form');
  let step=0,sector='',goals=[];
  const formSteps=form?[...form.querySelectorAll('[data-step]')]:[];
  const whatsapp=document.querySelector('[data-whatsapp]');
  function updateWhatsApp(){if(!form||!whatsapp)return;const data=new FormData(form);const lines=['Hello FJMK. I would like to discuss a project.',sector?'Organisation type: '+sector:'',goals.length?'Goal: '+goals.join(', '):'',data.get('message')?'Brief: '+data.get('message'):'',data.get('name')?'Name: '+data.get('name'):'',data.get('organisation')?'Organisation: '+data.get('organisation'):''].filter(Boolean);whatsapp.href='https://wa.me/2348145580220?text='+encodeURIComponent(lines.join('\n\n'));}
  function showStep(next){step=next;formSteps.forEach((el,i)=>el.hidden=i!==step);form.querySelectorAll('.form-progress li').forEach((el,i)=>{if(i===step)el.setAttribute('aria-current','step');else el.removeAttribute('aria-current');el.classList.toggle('complete',i<step);});form.querySelector('[data-back]').hidden=step===0;form.querySelector('[data-next]').hidden=step===2;form.querySelector('[type="submit"]').hidden=step!==2;form.querySelector('.step-summary').textContent=[sector,goals.join(' · ')].filter(Boolean).join(' / ');formSteps[step].querySelector('h2').focus({preventScroll:true});updateWhatsApp();}
  form?.querySelectorAll('[data-sector]').forEach(button=>button.addEventListener('click',()=>{sector=button.dataset.sector;form.querySelectorAll('[data-sector]').forEach(b=>b.setAttribute('aria-pressed',String(b===button)));formSteps[0].querySelector('.step-error').textContent='';updateWhatsApp();}));
  form?.querySelectorAll('[data-goal]').forEach(button=>button.addEventListener('click',()=>{const value=button.dataset.goal;goals=goals.includes(value)?goals.filter(x=>x!==value):[...goals,value];button.setAttribute('aria-pressed',String(goals.includes(value)));formSteps[1].querySelector('.step-error').textContent='';updateWhatsApp();}));
  form?.querySelector('[data-next]').addEventListener('click',()=>{if(step===0&&!sector){formSteps[0].querySelector('.step-error').textContent='Choose your organisation type to continue.';return;}if(step===1&&!goals.length){formSteps[1].querySelector('.step-error').textContent='Choose at least one goal to continue.';return;}showStep(Math.min(step+1,2));});
  form?.querySelector('[data-back]').addEventListener('click',()=>showStep(Math.max(step-1,0)));
  form?.addEventListener('input',updateWhatsApp);
  form?.addEventListener('submit',async event=>{
    event.preventDefault();const status=document.querySelector('#form-status'),button=form.querySelector('button[type="submit"]');
    if(step!==2||!sector||!goals.length)return;
    if(!form.reportValidity())return;
    const fields=new FormData(form);if(fields.get('hp_check_a1')){status.textContent='Thanks. Your brief has been received.';return;}
    button.disabled=true;status.textContent='Sending your brief…';
    const abort=new AbortController(),timer=setTimeout(()=>abort.abort(),15000);
    try{
      const response=await fetch('https://formsubmit.co/ajax/de23c2fcc84d70e0fdcf09a669c34494',{method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},signal:abort.signal,body:JSON.stringify({name:fields.get('name'),email:fields.get('email'),organisation:fields.get('organisation'),phone:fields.get('phone'),organisation_type:sector,goals:goals.join(', '),message:fields.get('message'),_subject:'FJMK project enquiry',_captcha:'false'})});
      const result=await response.json();if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Delivery failed');
      status.textContent='Brief received. Thank you. We’ll be in touch.';form.reset();sector='';goals=[];form.querySelectorAll('.choice').forEach(b=>b.setAttribute('aria-pressed','false'));showStep(0);
    }catch{status.textContent='Your brief couldn’t be sent. Your words are still here. Try again, or use email or WhatsApp.';}
    finally{clearTimeout(timer);button.disabled=false;}
  });
})();

// An intentional click opens the introduction with sound; Escape closes it.
(() => {
 const dialog=document.querySelector('#intro-dialog'),opener=document.querySelector('.intro-open');
 if(dialog&&opener){const video=dialog.querySelector('video');opener.addEventListener('click',()=>{dialog.showModal();video.play().catch(()=>{});});dialog.querySelector('.dialog-close').addEventListener('click',()=>dialog.close());dialog.addEventListener('close',()=>{video.pause();opener.focus();});dialog.addEventListener('click',e=>{if(e.target===dialog){const r=dialog.getBoundingClientRect();if(e.clientX<r.left||e.clientX>r.right||e.clientY<r.top||e.clientY>r.bottom)dialog.close();}});}
 document.querySelectorAll('.sound-control').forEach(button=>{const video=document.getElementById(button.getAttribute('aria-controls'));const sync=()=>{button.textContent=video.muted?'Sound on ↗':'Mute sound';button.setAttribute('aria-label',video.muted?'Turn sound on':'Mute film');button.setAttribute('aria-pressed',String(!video.muted));};button.addEventListener('click',()=>{video.muted=!video.muted;sync();});video.addEventListener('volumechange',sync);sync();});
})();

// Resources navigation and live clinic website checkup.
(() => {
 const menus=[...document.querySelectorAll('.resource-menu')];
 menus.forEach(menu=>menu.addEventListener('toggle',()=>{if(menu.open)menus.forEach(other=>{if(other!==menu)other.open=false;});}));
 document.querySelectorAll('.resource-dropdown a').forEach(a=>a.addEventListener('click',()=>menus.forEach(m=>m.open=false)));
 document.addEventListener('click',e=>menus.forEach(m=>{if(!m.contains(e.target))m.open=false;}));
 document.addEventListener('keydown',e=>{if(e.key==='Escape')menus.forEach(m=>{if(m.open){m.open=false;m.querySelector('summary').focus();}});});
 const rail=document.querySelector('.motion-rail');
 if(rail){const move=direction=>rail.scrollBy({left:direction*rail.clientWidth*.8,behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'});document.querySelector('[data-motion-prev]').addEventListener('click',()=>move(-1));document.querySelector('[data-motion-next]').addEventListener('click',()=>move(1));rail.addEventListener('keydown',e=>{if(e.target===rail&&['ArrowLeft','ArrowRight'].includes(e.key)){e.preventDefault();move(e.key==='ArrowRight'?1:-1);}});const videos=[...rail.querySelectorAll('video')];videos.forEach(v=>v.addEventListener('play',()=>{videos.forEach(other=>{if(other!==v)other.pause();});document.querySelectorAll('video[autoplay]').forEach(other=>other.pause());}));if('IntersectionObserver' in window){const observer=new IntersectionObserver(entries=>entries.forEach(e=>{if(!e.isIntersecting)e.target.pause();}),{threshold:.1});videos.forEach(v=>observer.observe(v));}}
})();
(()=>{const rail=document.querySelector('.motion-rail');if(!rail)return;let paused=false,last=0,remainder=0;const reduce=matchMedia('(prefers-reduced-motion:reduce)');const button=document.querySelector('[data-board-pause]');button?.addEventListener('click',()=>{paused=!paused;button.textContent=paused?'▷':'Ⅱ';button.setAttribute('aria-label',paused?'Resume moving films':'Pause moving films');});const originals=[...rail.children];for(const card of originals){const copy=card.cloneNode(true);copy.dataset.boardCopy='';rail.append(copy);}const videos=[...rail.querySelectorAll('video')];const player=document.createElement('dialog');player.className='motion-player';player.setAttribute('aria-label','Fullscreen film player');player.innerHTML='<button type="button" aria-label="Close film">Close ×</button><video controls playsinline></video>';document.body.append(player);const fullVideo=player.querySelector('video');player.querySelector('button').addEventListener('click',()=>player.close());player.addEventListener('close',()=>{fullVideo.pause();fullVideo.removeAttribute('src');fullVideo.load();});const expand=v=>{v.pause();fullVideo.src=v.currentSrc||v.querySelector('source').src;player.showModal();fullVideo.play().catch(()=>{});if(player.requestFullscreen)player.requestFullscreen().catch(()=>{});};videos.forEach(v=>{v.addEventListener('click',()=>{v.play().catch(()=>{});expand(v);});v.addEventListener('play',()=>{videos.forEach(o=>{if(o!==v)o.pause();});});});rail.addEventListener('fullscreenchange',()=>{if(!document.fullscreenElement)videos.forEach(v=>v.pause());});function tick(t){const dt=Math.min(80,t-last||0);last=t;if(!paused&&!player.open&&!document.hidden&&!reduce.matches&&!videos.some(v=>!v.paused)){remainder+=dt*.0198;const step=Math.floor(remainder);remainder-=step;rail.scrollLeft+=step;const edge=rail.querySelector('[data-board-copy]').offsetLeft-originals[0].offsetLeft;if(edge>0&&rail.scrollLeft>=edge)rail.scrollLeft-=edge;}requestAnimationFrame(tick);}requestAnimationFrame(tick);})();

// Run the health-only homepage audit and unlock full findings after email capture.
(() => {
 const form=document.querySelector('#clinic-audit-form');
 if(!form)return;
 const input=form.querySelector('#clinic-audit-url');
 const button=form.querySelector('button[type="submit"]');
 const status=document.querySelector('#clinic-audit-status');
 const progress=document.querySelector('#clinic-audit-progress');
 const report=document.querySelector('#clinic-audit-report');
 const gateForm=document.querySelector('#clinic-report-email');
 const gateButton=gateForm.querySelector('button[type="submit"]');
 const gateInput=gateForm.querySelector('input[type="email"]');
 const gateStatus=document.querySelector('#clinic-report-gate-status');
 const unlockedMessage=report.querySelector('[data-report-unlocked]');
 const fullReport=report.querySelector('[data-full-report]');
 const findings=document.querySelector('#clinic-audit-findings');
 const printButton=document.querySelector('[data-report-print]');
 const defaultTitle=document.title;
 let activeUrl='';
 let pageSpeedController;
 function setStatus(node,message,error){node.hidden=false;node.textContent=message;node.classList.toggle('is-error',Boolean(error));}
 async function readAuditResponse(response){
  if(response.status===429)throw new Error('Too many requests. Wait 15 seconds, then try again.');
  if(response.status===403)throw new Error('The request was blocked. Wait a moment, refresh this page, then try again.');
  let data;
  try{data=await response.json();}catch{
   throw new Error('The report service returned an unexpected response. Wait a moment, refresh this page, then try again.');
  }
  if(!data||typeof data!=='object'||Array.isArray(data))throw new Error('The report service is temporarily unavailable. Please try again shortly.');
  if(!response.ok)throw new Error(typeof data.error==='string'?data.error:'The report service is temporarily unavailable. Please try again shortly.');
  return data;
 }
 async function notifyAuditLead(email,data){
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),10000);
  try{
   const response=await fetch('https://formsubmit.co/ajax/de23c2fcc84d70e0fdcf09a669c34494',{
    method:'POST',headers:{'Content-Type':'application/json','Accept':'application/json'},signal:controller.signal,
    body:JSON.stringify({name:'Health website audit report request',email,_replyto:email,
     _url:'https://fjmk.drtolu.com/tools',website:data.finalUrl,score:data.score.value+'/100',
     grade:data.score.grade,review_items:data.reviewCount,_subject:'FJMK health website audit report request',_captcha:'false'})
   });
   const result=await response.json();
   if(!response.ok||!(result.success===true||result.success==='true'))throw new Error('Notification rejected');
  }catch{
   // The lead is already saved server-side. Email notification cannot revoke
   // access to a report after successful capture.
   console.warn('Audit email notification unavailable; the request was saved.');
  }finally{clearTimeout(timer);}
 }
 function element(tag,className,text){const node=document.createElement(tag);if(className)node.className=className;if(text!==undefined)node.textContent=text;return node;}
 function renderScore(score){
  const card=report.querySelector('[data-score-card]');
  card.className='clinic-score-card clinic-score-card--'+String(score.grade||'F').toLowerCase();
  card.querySelector('[data-score-value]').textContent=String(score.value);
  card.querySelector('[data-score-grade]').textContent=score.grade;
  card.querySelector('[data-score-label]').textContent=score.label;
  card.querySelector('[data-score-method]').textContent=score.method;
  report.querySelector('[data-score-formula]').textContent=score.formula;
  report.querySelector('[data-score-limitation]').textContent=score.limitation;
  card.querySelector('.clinic-score-result').setAttribute('aria-label','Score '+score.value+' out of 100, grade '+score.grade+'. '+score.label);
 }
 function renderHighlights(highlights){
  const list=report.querySelector('[data-preview-highlights]');
  list.replaceChildren();
  highlights.forEach(highlight=>{
   const item=element('li','clinic-preview-item clinic-preview-item--'+highlight.status);
   const heading=element('div','clinic-preview-item-head');
   heading.append(element('span','clinic-preview-category',highlight.category),element('span','checkup-state checkup-state--'+highlight.status,highlight.status==='review'?'To review':'Looks good'));
   item.append(heading,element('h4','',highlight.title),element('p','',highlight.summary));
   list.append(item);
  });
 }
 function renderPreview(data){
  const host=new URL(data.finalUrl).hostname;
  document.title=host+' health website audit | FJMK';
  report.querySelector('[data-report-host]').textContent=host;
  const link=report.querySelector('[data-report-url]');
  link.href=data.finalUrl;
  link.textContent=data.finalUrl;
  report.querySelector('[data-report-date]').textContent=new Date(data.fetchedAt).toLocaleString('en-NG',{dateStyle:'medium',timeStyle:'short'});
  report.querySelector('[data-report-summary]').textContent=data.summary;
  renderScore(data.score);
  renderHighlights(data.highlights);
  fullReport.hidden=true;
  gateForm.hidden=false;
  gateStatus.hidden=true;
  gateInput.value='';
  unlockedMessage.hidden=true;
  report.hidden=false;
  status.hidden=true;
  report.focus({preventScroll:true});
  report.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
 }
 function findingCard(check){
  const article=element('details','checkup-finding checkup-finding--'+check.status);
  article.open=check.status==='review';
  const header=element('summary','checkup-finding-summaryline');
  const title=element('span','checkup-finding-title',check.title);
  const state=element('span','checkup-state checkup-state--'+check.status,check.status==='review'?'To review':check.status==='good'?'Looks good':'Signal only');
  header.append(title,state,element('span','checkup-finding-summary',check.summary));
  article.append(header);
  const detail=element('div','checkup-finding-detail');
  const next=element('p','checkup-next-step');
  next.append(element('strong','','Next step: '),document.createTextNode(check.nextStep));
  detail.append(next);
  const evidence=element('details','checkup-evidence-details');
  evidence.append(element('summary','','Evidence'),element('p','checkup-evidence',check.evidence));
  detail.append(evidence);
  article.append(detail);
  return article;
 }
 function renderPageSpeed(snapshot){
  const panel=report.querySelector('[data-lighthouse]');
  const message=panel.querySelector('[data-lighthouse-status]');
  const scores=panel.querySelector('[data-lighthouse-scores]');
  const metrics=panel.querySelector('[data-lighthouse-metrics]');
  scores.replaceChildren();
  metrics.replaceChildren();
  panel.hidden=false;
  if(!snapshot||snapshot.status==='not_configured'){
   message.textContent='Mobile snapshot not configured.';
   return;
  }
  if(snapshot.status==='pending'){
   message.textContent='Running the mobile lab check…';
   return;
  }
  if(snapshot.status!=='available'){
   message.textContent='Mobile snapshot unavailable. Homepage checks are complete.';
   return;
  }
  message.textContent='Mobile lab snapshot · '+new Date(snapshot.fetchedAt).toLocaleString('en-NG',{dateStyle:'medium',timeStyle:'short'});
  const labels=[['performance','Performance'],['accessibility','Accessibility signal'],['seo','SEO'],['bestPractices','Best practices']];
  labels.forEach(([key,label])=>{
   const value=snapshot.scores?.[key];
   if(!Number.isFinite(value))return;
   const card=element('div','checkup-lighthouse-score');
   card.append(element('span','',label),element('strong','',String(value)),element('small','','/ 100'));
   scores.append(card);
  });
  const metricLabels=[['lcp','Largest contentful paint'],['cls','Layout shift'],['tbt','Blocking time'],['fcp','First contentful paint']];
  metricLabels.forEach(([key,label])=>{
   const value=snapshot.metrics?.[key];
   if(!value)return;
   const item=element('div','');
   item.append(element('dt','',label),element('dd','',value));
   metrics.append(item);
  });
 }
 async function loadPageSpeed(url){
  pageSpeedController?.abort();
  pageSpeedController=new AbortController();
  const controller=pageSpeedController;
  const timer=setTimeout(()=>controller.abort(),80000);
  try{
   const response=await fetch('/api/pagespeed',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url}),signal:controller.signal});
   const data=await readAuditResponse(response);
   if(!response.ok){
    renderPageSpeed({status:response.status===503&&/not configured/i.test(data.error||'')?'not_configured':'unavailable'});
    return;
   }
   renderPageSpeed(data.pageSpeed);
  }catch{
   renderPageSpeed({status:'unavailable'});
  }finally{
   clearTimeout(timer);
  }
 }
 function renderFullReport(data){
  pageSpeedController?.abort();
  const host=new URL(data.finalUrl).hostname;
  document.title=host+' health website audit | FJMK';
  report.querySelector('[data-report-host]').textContent=host;
  const link=report.querySelector('[data-report-url]');
  link.href=data.finalUrl;
  link.textContent=data.finalUrl;
  report.querySelector('[data-report-date]').textContent=new Date(data.fetchedAt).toLocaleString('en-NG',{dateStyle:'medium',timeStyle:'short'});
  report.querySelector('[data-report-summary]').textContent=data.summary;
  renderHighlights(data.highlights);
  report.querySelector('[data-report-response]').textContent='HTTP '+data.responseStatus;
  report.querySelector('[data-report-time]').textContent=data.responseTimeMs+' ms';
  renderScore(data.score);
  const reviewCount=Number(data.reviewCount)||0;
  const goodCount=data.checks.filter(check=>check.status==='good').length;
  const infoCount=data.checks.filter(check=>check.status==='info').length;
  report.querySelector('[data-full-report-summary]').textContent=reviewCount
   ? reviewCount+' item'+(reviewCount===1?'':'s')+' to review across '+data.checks.length+' checks.'
   : 'No automatic review flags across '+data.checks.length+' checks.';
  report.querySelector('[data-report-review-count]').textContent=String(reviewCount);
  report.querySelector('[data-report-good-count]').textContent=String(goodCount);
  report.querySelector('[data-report-info-count]').textContent=String(infoCount);
  renderPageSpeed(data.pageSpeed);
  findings.replaceChildren();
  const sorted=[...data.checks].sort((a,b)=>(a.priority||3)-(b.priority||3));
  const groups=new Map();
  sorted.forEach(check=>{
   if(!groups.has(check.category)){
    const section=element('section','checkup-group');
    section.append(element('h5','',check.category));
    const list=element('div','checkup-finding-list');
    section.append(list);
    groups.set(check.category,list);
    findings.append(section);
   }
   groups.get(check.category).append(findingCard(check));
  });
  const topFindings=sorted.filter(check=>check.status==='review').slice(0,3);
  const message=[
   'Hello FJMK. I ran the health website audit.',
   'Website: '+data.finalUrl,
   topFindings.length?'Could you help me prioritise these findings: '+topFindings.map(check=>check.title).join('; ')+'?':'The automated audit did not flag items for review. Could you help me review this website and the route patients use to contact the organisation?'
  ].join('\n');
  const whatsapp=report.querySelector('[data-report-whatsapp]');
  whatsapp.href='https://wa.me/2348145580220?text='+encodeURIComponent(message);
  whatsapp.querySelector('[data-report-whatsapp-label]').textContent=topFindings.length?'Get help prioritising these findings':'Talk through your website';
  report.querySelector('#clinic-checks-title').textContent='Checks · '+data.checks.length;
  fullReport.hidden=false;
  gateForm.hidden=true;
  gateStatus.hidden=true;
  unlockedMessage.textContent='Your email request was received. The detailed report is ready below.';
  unlockedMessage.hidden=false;
  fullReport.focus({preventScroll:true});
  fullReport.scrollIntoView({behavior:matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth',block:'start'});
  if(data.pageSpeed?.status==='pending')loadPageSpeed(data.finalUrl);
 }
 form.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!form.reportValidity())return;
  const raw=input.value.trim();
  const normalized=/^[a-z][a-z\d+.-]*:/i.test(raw)?raw:'https://'+raw;
  try{
   const parsed=new URL(normalized);
   if(!['https:','http:'].includes(parsed.protocol))throw new Error();
  }catch{
   input.setCustomValidity('Enter a public website address, such as clinicname.com.');
   input.reportValidity();
   return;
  }
  input.setCustomValidity('');
  activeUrl=normalized;
  report.hidden=true;
  document.title=defaultTitle;
  const submitLabel=button.innerHTML;
  form.setAttribute('aria-busy','true');
  progress.hidden=false;
  button.disabled=true;
  button.textContent='Checking…';
  setStatus(status,'Reading the public homepage and checking its health-related signals…',false);
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),28000);
  try{
   const response=await fetch('/api/audit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:activeUrl,mode:'preview'}),signal:controller.signal});
   const data=await readAuditResponse(response);
   if(!response.ok)throw new Error(data.error||'The audit could not be completed.');
   renderPreview(data);
  }catch(error){
   const message=error.name==='AbortError'?'The audit took too long. Try again in a moment.':error.message||'The website could not be checked. Try again shortly.';
   setStatus(status,message,true);
  }finally{
   clearTimeout(timer);
   form.removeAttribute('aria-busy');
   progress.hidden=true;
   button.disabled=false;
   button.innerHTML=submitLabel;
  }
 });
 gateForm.addEventListener('submit',async event=>{
  event.preventDefault();
  if(!gateForm.reportValidity())return;
  const email=gateInput.value.trim();
  const submitLabel=gateButton.innerHTML;
  const controller=new AbortController();
  const timer=setTimeout(()=>controller.abort(),32000);
  gateForm.setAttribute('aria-busy','true');
  gateButton.disabled=true;
  gateButton.textContent='Preparing report…';
  gateStatus.hidden=true;
  setStatus(gateStatus,'Sending your email request and preparing the detailed report…',false);
  try{
   const response=await fetch('/api/audit',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({url:activeUrl,mode:'report',email}),signal:controller.signal});
   const data=await readAuditResponse(response);
   if(!response.ok)throw new Error(data.error||'The detailed report could not be prepared.');
   renderFullReport(data);
   if(data.leadNotification==='browser')void notifyAuditLead(email,data);
  }catch(error){
   const message=error.name==='AbortError'?'This took too long. Try again shortly.':error.message||'The report request could not be completed. Try again shortly.';
   setStatus(gateStatus,message,true);
  }finally{
   clearTimeout(timer);
   gateForm.removeAttribute('aria-busy');
   gateButton.disabled=false;
   gateButton.innerHTML=submitLabel;
  }
 });
 input.addEventListener('input',()=>input.setCustomValidity(''));
 printButton?.addEventListener('click',()=>window.print());
 window.addEventListener('afterprint',()=>{document.title=defaultTitle;});
})();
