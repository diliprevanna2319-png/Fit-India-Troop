/* =============================================================================
   FIT INDIA TROOP — app bootstrap
   Vanilla-JS core (always works) + progressive Lenis/GSAP enhancement.
   All content is hydrated from js/config.js.
   ============================================================================= */
import { CONFIG } from './config.js';
import { initHero } from './scene.js';

const $  = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
const el = (tag,cls,html)=>{ const n=document.createElement(tag); if(cls)n.className=cls; if(html!=null)n.innerHTML=html; return n; };

/* preload an image; set as background only if it exists, else keep placeholder */
function setBg(node, url){
  if(!node) return;
  node.classList.add('ph');
  const img = new Image();
  img.onload = ()=>{ node.style.backgroundImage=`url("${url}")`; node.classList.remove('ph'); };
  img.onerror = ()=>{};
  img.src = url;
}

/* =========================== LOADER =========================== */
function runLoader(){
  const loader=$('#loader'), fill=$('#loaderFill'), pct=$('#loaderPct');
  let p=0;
  const tick=setInterval(()=>{
    p += Math.random()*12 + 4;
    if(p>=100){ p=100; clearInterval(tick); finish(); }
    fill.style.width=p+'%'; pct.textContent=Math.floor(p);
  },130);
  function finish(){
    setTimeout(()=>{ loader.classList.add('done'); document.body.classList.remove('locked');
      window.dispatchEvent(new Event('firit:loaded'));
      if(location.hash){ const t=document.querySelector(location.hash); if(t) setTimeout(()=>t.scrollIntoView(),150); }
    }, 450);
  }
}

/* =========================== HYDRATE CONTENT =========================== */
function hydrate(){
  const C=CONFIG;

  /* contact links */
  const tel=n=>'tel:+91'+String(n).replace(/\D/g,'').replace(/^91/,'');
  $('#cAddress').textContent=C.contact.address; $('#cAddress').href=C.contact.mapLink;
  $('#cPhone1').textContent=C.contact.phonePrimary; $('#cPhone1').href=tel(C.contact.phonePrimary);
  $('#cPhone2').textContent=C.contact.phoneSecondary; $('#cPhone2').href=tel(C.contact.phoneSecondary);
  $('#cEmail').textContent=C.contact.email; $('#cEmail').href='mailto:'+C.contact.email;
  $('#cParking').textContent=C.contact.parking;
  $('#cWhats').href=`https://wa.me/${C.contact.whatsapp}?text=Hi%20Fit%20India%20Troop,%20I'd%20like%20to%20join!`;
  $('#cWhats').target='_blank';
  $('#cCall').href=tel(C.contact.phonePrimary);
  $('#mapOpen').href=C.contact.mapLink; $('#mapDir').href=C.contact.directions;
  $('#fMap').href=C.contact.mapLink;
  $('#mapFrame').src=C.contact.mapEmbed;
  $('#year').textContent=new Date().getFullYear();

  /* hours */
  $('#hoursList').append(...C.hours.map(h=>el('li',null,`<span>${h.day}</span><b>${h.time}</b>`)));

  /* socials */
  const socHTML=()=>{
    const s=C.social, out=[];
    if(s.instagram) out.push(`<a href="${s.instagram}" target="_blank" rel="noopener" aria-label="Instagram">◎</a>`);
    if(s.facebook)  out.push(`<a href="${s.facebook}" target="_blank" rel="noopener" aria-label="Facebook">f</a>`);
    if(s.youtube)   out.push(`<a href="${s.youtube}" target="_blank" rel="noopener" aria-label="YouTube">▶</a>`);
    return out.join('');
  };
  $('#socials').innerHTML=socHTML(); $('#socialsFoot').innerHTML=socHTML();

  /* words: hero rail + marquee */
  const mtrack=$('#marqueeTrack');
  const wordsSpan=w=>`<span>${w}</span>`;
  mtrack.innerHTML=[...C.words,...C.words].map(wordsSpan).join('');

  /* stats */
  $('#statsGrid').append(...C.stats.map(s=>{
    const n=el('div','stat',`<div class="stat__num" data-count="${s.value}" data-suffix="${s.suffix||''}">0</div><div class="stat__label">${s.label}</div>`);
    return n;
  }));

  /* why tiles */
  const why=[
    ['🏋️','Premium Equipment'],['🎓','Certified Trainers'],['🥊','CrossFit Training'],['🔥','Body Transformation'],['♨️','Sauna & Steam'],
    ['🤸','Functional Zone'],['📋','Personalised Plans'],['🎯','Personal Coaching'],['🤝','Friendly Community'],['💰','Affordable Plans']
  ];
  $('#whyGrid').append(...why.map(([i,t])=>el('div','tile reveal',`<div class="tile__ic">${i}</div><h4>${t}</h4>`)));

  /* programs */
  $('#programsGrid').append(...C.programs.map(p=>
    el('div','pcard reveal',`<div class="pcard__ic">${p.icon}</div><h4>${p.title}</h4><p>${p.desc}</p>`)));

  /* plans */
  $('#plansGrid').append(...C.plans.map(p=>{
    const n=el('div','plan reveal'+(p.popular?' plan--popular':''),
      `${p.popular?'<span class="plan__badge">Most Popular</span>':''}
       <div class="plan__name">${p.name}</div>
       <div class="plan__price">${p.price}</div>
       <div class="plan__per">${p.per||''}</div>
       <ul class="plan__perks">${p.perks.map(x=>`<li>${x}</li>`).join('')}</ul>
       <a href="#contact" class="btn ${p.popular?'btn--solid':'btn--ghost'} btn--full">Join Now</a>`);
    return n;
  }));
  $('#plansNote').textContent=C.planNote;
  $('#plansExtra').innerHTML='<span style="color:var(--grey)">Also available:</span>'+
    C.extraPlans.map(p=>`<span><b>${p.name}</b> — ${p.price}</span>`).join('');

  /* about + split images */
  setBg($('.about__img:not(.about__img--sm)'), C.images.aboutPrimary || C.gallery[0]);
  setBg($('.about__img--sm'), C.images.aboutSecondary || C.gallery[1]);
  $$('.split__img').forEach(s=>{ const i=+s.dataset.galleryIdx||0; setBg(s, C.gallery[i]); });

  /* stories carousel */
  buildStories(C.testimonials);

  /* gallery */
  buildGallery(C.gallery);

  /* faq */
  buildFaq(C.faq);
}

/* =========================== STORIES CAROUSEL =========================== */
function buildStories(list){
  const track=$('#storiesTrack'), dots=$('#storiesDots');
  list.forEach((s,i)=>{
    const initials=s.name.split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
    const slide=el('div','story',
      `<div class="story__img story__img--initials">${initials}</div>
       <div><p class="story__q">“${s.quote}”</p>
       <div class="story__stars">★★★★★</div>
       <div class="story__meta"><b>${s.name}</b>${s.result}</div></div>`);
    track.append(slide);
    const d=el('button',i===0?'on':''); d.addEventListener('click',()=>go(i)); dots.append(d);
  });
  let idx=0, timer;
  const go=i=>{ idx=(i+list.length)%list.length; track.style.transform=`translateX(-${idx*100}%)`;
    $$('button',dots).forEach((b,k)=>b.classList.toggle('on',k===idx)); reset(); };
  const reset=()=>{ clearInterval(timer); timer=setInterval(()=>go(idx+1),5500); };
  reset();
}

/* =========================== GALLERY + LIGHTBOX =========================== */
function buildGallery(list){
  const grid=$('#galleryGrid'), lb=$('#lightbox'), lbImg=$('#lbImg');
  list.forEach((src,i)=>{
    const cell=el('div','gimg');
    const img=new Image(); img.loading='lazy'; img.decoding='async'; img.alt='Fit India Troop — gym gallery';
    img.onerror=()=>{ // graceful placeholder before real photos are added
      cell.style.height=(180+ (i*37)%160)+'px';
      cell.style.background='linear-gradient(135deg,#16161a,#1b1b20)';
      cell.innerHTML='<div style="display:grid;place-items:center;height:100%;color:#4a4a52;font-size:.8rem">📷 Photo '+(i+1)+'</div>';
    };
    img.onload=()=>{ cell.addEventListener('click',()=>{ lbImg.src=src; lb.classList.add('on'); document.body.classList.add('locked'); }); };
    img.src=src; cell.append(img); grid.append(cell);
  });
  const close=()=>{ lb.classList.remove('on'); document.body.classList.remove('locked'); };
  $('#lbClose').addEventListener('click',close);
  lb.addEventListener('click',e=>{ if(e.target===lb) close(); });
  addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
}

/* =========================== FAQ =========================== */
function buildFaq(list){
  const wrap=$('#faqList');
  list.forEach(f=>{
    const item=el('div','faq__item',
      `<button class="faq__q">${f.q}<i>+</i></button><div class="faq__a"><p>${f.a}</p></div>`);
    const a=$('.faq__a',item);
    $('.faq__q',item).addEventListener('click',()=>{
      const open=item.classList.contains('open');
      $$('.faq__item',wrap).forEach(o=>{ o.classList.remove('open'); $('.faq__a',o).style.maxHeight=null; });
      if(!open){ item.classList.add('open'); a.style.maxHeight=a.scrollHeight+'px'; }
    });
    wrap.append(item);
  });
}

/* =========================== REVEALS + COUNTERS =========================== */
function observers(){
  const io=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('in'); io.unobserve(e.target); } });
  },{ threshold:0.12, rootMargin:'0px 0px -8% 0px' });
  $$('.reveal').forEach(n=>io.observe(n));

  const cio=new IntersectionObserver((entries)=>{
    entries.forEach(e=>{ if(e.isIntersecting){ countUp(e.target); cio.unobserve(e.target); } });
  },{ threshold:0.5 });
  $$('[data-count]').forEach(n=>cio.observe(n));
}
function countUp(node){
  const target=+node.dataset.count, suffix=node.dataset.suffix||''; const dur=1600; const start=performance.now();
  const fmt=v=>v>=1000?Math.floor(v).toLocaleString('en-IN'):Math.floor(v);
  (function step(now){
    const p=Math.min((now-start)/dur,1); const ease=1-Math.pow(1-p,3);
    node.textContent=fmt(target*ease)+suffix;
    if(p<1) requestAnimationFrame(step); else node.textContent=fmt(target)+suffix;
  })(start);
}

/* =========================== HERO WORDS ROTATION =========================== */
function heroWords(){
  const node=$('#heroWords'); const words=CONFIG.words; let i=0;
  node.textContent=words[0];
  setInterval(()=>{ i=(i+1)%words.length; node.style.opacity=0;
    setTimeout(()=>{ node.textContent=words[i]; node.style.opacity=1; },300); },2400);
  node.style.transition='opacity .3s ease';
}

/* =========================== SMOOTH SCROLL + GSAP =========================== */
/* Loads Lenis + GSAP/ScrollTrigger (progressive). Returns { lenis, gsap, ST }. */
async function setupSmoothScroll(){
  let gsap=null, ST=null, lenis=null;
  try{
    gsap=(await import('https://esm.sh/gsap@3.12.5')).default;
    ST=(await import('https://esm.sh/gsap@3.12.5/ScrollTrigger')).default;
    gsap.registerPlugin(ST);
  }catch(e){ console.warn('GSAP unavailable — using CSS/IO fallbacks.'); }
  try{
    const Lenis=(await import('https://esm.sh/lenis@1.1.13')).default;
    lenis=new Lenis({ duration:1.15, easing:t=>Math.min(1,1.001-Math.pow(2,-10*t)), smoothWheel:true });
    if(gsap && ST){
      lenis.on('scroll', ST.update);
      gsap.ticker.add(t=>lenis.raf(t*1000));
      gsap.ticker.lagSmoothing(0);
    }else{
      const raf=t=>{ lenis.raf(t); requestAnimationFrame(raf); }; requestAnimationFrame(raf);
    }
  }catch(e){ /* native scroll fallback */ }
  return { lenis, gsap, ST };
}

/* nav scrolled state, progress bar, mobile toggle, smooth anchor links */
function navUI(lenis){
  const nav=$('#nav'), toggle=$('#navToggle'), links=$('#navLinks'), prog=$('#scrollProgress');
  const onScroll=()=>{
    nav.classList.toggle('scrolled', scrollY>40);
    const h=document.documentElement;
    prog.style.width=(h.scrollTop/(h.scrollHeight-h.clientHeight)*100)+'%';
  };
  addEventListener('scroll',onScroll,{passive:true}); onScroll();
  toggle.addEventListener('click',()=>{ links.classList.toggle('open'); toggle.classList.toggle('x'); });
  $$('#navLinks a').forEach(a=>a.addEventListener('click',()=>links.classList.remove('open')));
  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href'); if(id.length<2) return;
      const t=$(id); if(!t) return; e.preventDefault();
      if(lenis) lenis.scrollTo(t,{offset:-70}); else t.scrollIntoView({behavior:'smooth'});
    });
  });
}

/* =========================== SCROLL-DRIVEN HERO (LAT PULLDOWN) =========================== */
function setupHeroScroll(hero, {gsap, ST}){
  if(!hero) return;
  const heroEl=$('#hero');
  if(gsap && ST){
    ST.create({
      trigger:heroEl, start:'top top', end:'+=140%', pin:true, scrub:1,
      invalidateOnRefresh:true,
      onUpdate:self=>hero.setPulldown(self.progress),
    });
    // cinematic: hero copy drifts up + fades as the rep completes
    gsap.to('.hero__content', { opacity:0.12, y:-50, ease:'none',
      scrollTrigger:{ trigger:heroEl, start:'top top', end:'+=110%', scrub:1 } });
    gsap.to('.hero__scroll', { opacity:0, ease:'none',
      scrollTrigger:{ trigger:heroEl, start:'top top', end:'+=40%', scrub:true } });
  }else{
    // fallback: drive pulldown by how far the hero has scrolled past the top (no pin)
    const drive=()=>{ const r=heroEl.getBoundingClientRect();
      const p=Math.min(Math.max(-r.top/(r.height||innerHeight),0),1); hero.setPulldown(p); };
    addEventListener('scroll',drive,{passive:true}); drive();
  }
}

/* =========================== PREMIUM SCROLL EFFECTS =========================== */
function setupParallax({gsap, ST}){
  if(!gsap || !ST) return;
  // subtle depth parallax on section imagery
  $$('.split__img').forEach(img=>{
    gsap.fromTo(img,{ y:50 },{ y:-50, ease:'none',
      scrollTrigger:{ trigger:img.closest('.split')||img, start:'top bottom', end:'bottom top', scrub:true } });
  });
  // soft scale-in on cards/plans as they enter (complements the CSS reveal)
  ['.pcard','.plan','.tile','.gimg'].forEach(sel=>{
    gsap.utils.toArray(sel).forEach(n=>{
      gsap.from(n,{ scale:0.94, ease:'power2.out', duration:.6,
        scrollTrigger:{ trigger:n, start:'top 92%', toggleActions:'play none none none' } });
    });
  });
  ST.refresh();
}

/* lightweight 3D tilt micro-interaction (desktop only) */
function setupTilt(){
  if(matchMedia('(hover:none)').matches) return;
  $$('.plan, .pcard').forEach(card=>{
    card.style.transformStyle='preserve-3d';
    card.addEventListener('pointermove',e=>{
      const r=card.getBoundingClientRect();
      const rx=((e.clientY-r.top)/r.height-0.5)*-6, ry=((e.clientX-r.left)/r.width-0.5)*6;
      card.style.transform=`perspective(700px) rotateX(${rx}deg) rotateY(${ry}deg) translateY(-6px)`;
    });
    card.addEventListener('pointerleave',()=>{ card.style.transform=''; });
  });
}

/* =========================== CURSOR GLOW =========================== */
function cursorGlow(){
  const g=$('#cursorGlow'); if(matchMedia('(hover:none)').matches){ g.remove(); return; }
  let x=innerWidth/2,y=innerHeight/2,tx=x,ty=y;
  addEventListener('mousemove',e=>{ tx=e.clientX; ty=e.clientY; },{passive:true});
  (function anim(){ x+=(tx-x)*0.12; y+=(ty-y)*0.12; g.style.transform=`translate(${x}px,${y}px) translate(-50%,-50%)`; requestAnimationFrame(anim); })();
}

/* =========================== CONTACT FORM =========================== */
function contactForm(){
  const form=$('#contactForm'); if(!form) return;
  const show=(field,msg)=>{ const f=field.closest('.field'); f.classList.toggle('err',!!msg); $('small',f).textContent=msg||''; };
  form.addEventListener('submit',e=>{
    e.preventDefault(); let ok=true;
    const name=form.name, phone=form.phone, email=form.email;
    if(!name.value.trim()){ show(name,'Please enter your name'); ok=false; } else show(name,'');
    if(!/^[0-9+\-\s]{7,15}$/.test(phone.value.trim())){ show(phone,'Enter a valid phone number'); ok=false; } else show(phone,'');
    if(!/^\S+@\S+\.\S+$/.test(email.value.trim())){ show(email,'Enter a valid email'); ok=false; } else show(email,'');
    if(!ok) return;
    $('#formSuccess').classList.add('show'); form.reset();
    setTimeout(()=>$('#formSuccess').classList.remove('show'),6000);
  });
}

/* =========================== BOOT =========================== */
(async function boot(){
  document.body.classList.add('locked');
  hydrate();
  runLoader();
  observers();
  heroWords();
  cursorGlow();
  contactForm();
  setupTilt();

  const libs = await setupSmoothScroll();      // Lenis + GSAP/ScrollTrigger
  navUI(libs.lenis);
  setupParallax(libs);

  const hero = await initHero($('#heroCanvas')); // 3D lat-pulldown rig
  setupHeroScroll(hero, libs);

  // recompute pinned/parallax positions once fonts, layout & loader settle
  const refresh=()=>{ libs.ST && libs.ST.refresh(); };
  window.addEventListener('firit:loaded', ()=>setTimeout(refresh,100));
  window.addEventListener('load', ()=>setTimeout(refresh,300));
})();
