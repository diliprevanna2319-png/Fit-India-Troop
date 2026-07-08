/* =============================================================================
   FIT INDIA TROOP — app bootstrap
   Vanilla JS. All content is hydrated from js/config.js.
   Motion: transform/opacity only, IntersectionObserver reveals with stagger,
   soft hero parallax (desktop, motion-safe), no blocking loader.
   ============================================================================= */
import { CONFIG } from './config.js';

const $  = (s,c=document)=>c.querySelector(s);
const $$ = (s,c=document)=>[...c.querySelectorAll(s)];
const el = (tag,cls,html)=>{ const n=document.createElement(tag); if(cls)n.className=cls; if(html!=null)n.innerHTML=html; return n; };
const REDUCED = matchMedia('(prefers-reduced-motion: reduce)').matches;

/* preload an image; set as background only if it exists, else keep placeholder */
function setBg(node, url){
  if(!node) return;
  node.classList.add('ph');
  const img = new Image();
  img.onload = ()=>{ node.style.backgroundImage=`url("${url}")`; node.classList.remove('ph'); };
  img.onerror = ()=>{};
  img.src = url;
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

  /* socials (inline SVG icons) */
  const icons={
    instagram:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.9.1 1.2.1 1.8.2 2.2.4.6.2 1 .5 1.4.9.4.4.7.8.9 1.4.2.4.4 1 .4 2.2.1 1.3.1 1.7.1 4.9s0 3.6-.1 4.9c-.1 1.2-.2 1.8-.4 2.2a3.8 3.8 0 0 1-2.3 2.3c-.4.2-1 .4-2.2.4-1.3.1-1.7.1-4.9.1s-3.6 0-4.9-.1c-1.2-.1-1.8-.2-2.2-.4a3.8 3.8 0 0 1-2.3-2.3c-.2-.4-.4-1-.4-2.2C2.2 15.6 2.2 15.2 2.2 12s0-3.6.1-4.9c.1-1.2.2-1.8.4-2.2.2-.6.5-1 .9-1.4.4-.4.8-.7 1.4-.9.4-.2 1-.4 2.2-.4C8.4 2.2 8.8 2.2 12 2.2Zm0 1.8c-3.1 0-3.5 0-4.8.1-1.1.1-1.5.2-1.9.3-.5.2-.8.4-1.1.7-.3.3-.5.6-.7 1.1-.1.4-.3.8-.3 1.9-.1 1.3-.1 1.7-.1 4.8s0 3.5.1 4.8c.1 1.1.2 1.5.3 1.9.2.5.4.8.7 1.1.3.3.6.5 1.1.7.4.1.8.3 1.9.3 1.3.1 1.7.1 4.8.1s3.5 0 4.8-.1c1.1-.1 1.5-.2 1.9-.3.5-.2.8-.4 1.1-.7.3-.3.5-.6.7-1.1.1-.4.3-.8.3-1.9.1-1.3.1-1.7.1-4.8s0-3.5-.1-4.8c-.1-1.1-.2-1.5-.3-1.9a2 2 0 0 0-.7-1.1 2 2 0 0 0-1.1-.7c-.4-.1-.8-.3-1.9-.3-1.3-.1-1.7-.1-4.8-.1Zm0 3a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.8a3.2 3.2 0 1 0 0 6.4 3.2 3.2 0 0 0 0-6.4Zm5.2-3a1.2 1.2 0 1 1 0 2.4 1.2 1.2 0 0 1 0-2.4Z"/></svg>',
    facebook:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M13.5 21.9v-8.4h2.8l.4-3.3h-3.2V8.1c0-.9.3-1.6 1.7-1.6h1.7V3.6c-.3 0-1.3-.1-2.5-.1-2.5 0-4.2 1.5-4.2 4.3v2.4H7.4v3.3h2.8v8.4h3.3Z"/></svg>',
    youtube:'<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M21.6 7.2a2.5 2.5 0 0 0-1.8-1.8C18.3 5 12 5 12 5s-6.3 0-7.8.4A2.5 2.5 0 0 0 2.4 7.2 26 26 0 0 0 2 12a26 26 0 0 0 .4 4.8 2.5 2.5 0 0 0 1.8 1.8c1.5.4 7.8.4 7.8.4s6.3 0 7.8-.4a2.5 2.5 0 0 0 1.8-1.8A26 26 0 0 0 22 12a26 26 0 0 0-.4-4.8ZM10 15V9l5.2 3L10 15Z"/></svg>'
  };
  const socHTML=()=>{
    const s=C.social, out=[];
    if(s.instagram) out.push(`<a href="${s.instagram}" target="_blank" rel="noopener" aria-label="Instagram">${icons.instagram}</a>`);
    if(s.facebook)  out.push(`<a href="${s.facebook}" target="_blank" rel="noopener" aria-label="Facebook">${icons.facebook}</a>`);
    if(s.youtube)   out.push(`<a href="${s.youtube}" target="_blank" rel="noopener" aria-label="YouTube">${icons.youtube}</a>`);
    return out.join('');
  };
  $('#socials').innerHTML=socHTML(); $('#socialsFoot').innerHTML=socHTML();

  /* marquee */
  const mtrack=$('#marqueeTrack');
  mtrack.innerHTML=[...C.words,...C.words].map(w=>`<span>${w}</span>`).join('');

  /* stats */
  $('#statsGrid').append(...C.stats.map(s=>
    el('div','stat',`<div class="stat__num" data-count="${s.value}" data-suffix="${s.suffix||''}">0</div><div class="stat__label">${s.label}</div>`)));

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

  buildStories(C.testimonials);
  buildGallery(C.gallery);
  buildFaq(C.faq);
}

/* =========================== STORIES CAROUSEL =========================== */
function buildStories(list){
  const track=$('#storiesTrack'), dots=$('#storiesDots'), viewport=$('.stories__viewport');
  list.forEach((s,i)=>{
    const initials=s.name.split(/\s+/).slice(0,2).map(w=>w[0]||'').join('').toUpperCase();
    const slide=el('div','story',
      `<div class="story__img story__img--initials" aria-hidden="true">${initials}</div>
       <div><p class="story__q">“${s.quote}”</p>
       <div class="story__stars" aria-label="5 star rating">★★★★★</div>
       <div class="story__meta"><b>${s.name}</b>${s.result}</div></div>`);
    track.append(slide);
    const d=el('button');
    d.setAttribute('aria-label',`Show story ${i+1}`);
    if(i===0) d.classList.add('on');
    d.addEventListener('click',()=>go(i));
    dots.append(d);
  });
  let idx=0, timer, paused=false;
  const go=i=>{ idx=(i+list.length)%list.length; track.style.transform=`translateX(-${idx*100}%)`;
    $$('button',dots).forEach((b,k)=>b.classList.toggle('on',k===idx)); reset(); };
  const reset=()=>{ clearInterval(timer);
    if(!REDUCED) timer=setInterval(()=>{ if(!paused && !document.hidden) go(idx+1); },6000); };
  /* pause on hover / focus so people can actually read */
  viewport.addEventListener('mouseenter',()=>paused=true);
  viewport.addEventListener('mouseleave',()=>paused=false);
  viewport.addEventListener('focusin',()=>paused=true);
  viewport.addEventListener('focusout',()=>paused=false);
  /* swipe support */
  let sx=null;
  viewport.addEventListener('pointerdown',e=>sx=e.clientX,{passive:true});
  viewport.addEventListener('pointerup',e=>{
    if(sx==null) return;
    const dx=e.clientX-sx; sx=null;
    if(Math.abs(dx)>40) go(idx+(dx<0?1:-1));
  },{passive:true});
  reset();
}

/* =========================== GALLERY + LIGHTBOX =========================== */
function buildGallery(list){
  const grid=$('#galleryGrid'), lb=$('#lightbox'), lbImg=$('#lbImg');
  list.forEach((src,i)=>{
    const cell=el('div','gimg');
    const img=new Image(); img.loading='lazy'; img.decoding='async';
    img.alt=`Fit India Troop gym in Tumakuru — photo ${i+1}`;
    img.onerror=()=>{ // graceful placeholder before real photos are added
      cell.style.height=(180+ (i*37)%160)+'px';
      cell.style.background='linear-gradient(135deg,#16161a,#1b1b20)';
      cell.innerHTML='<div style="display:grid;place-items:center;height:100%;color:#4a4a52;font-size:.8rem">📷 Photo '+(i+1)+'</div>';
    };
    img.onload=()=>{
      cell.setAttribute('role','button'); cell.tabIndex=0;
      cell.setAttribute('aria-label',`View gallery photo ${i+1}`);
      const open=()=>{ lbImg.src=src; lb.classList.add('on'); document.body.classList.add('locked'); $('#lbClose').focus(); };
      cell.addEventListener('click',open);
      cell.addEventListener('keydown',e=>{ if(e.key==='Enter'||e.key===' '){ e.preventDefault(); open(); } });
    };
    img.src=src; cell.append(img); grid.append(cell);
  });
  const close=()=>{ lb.classList.remove('on'); document.body.classList.remove('locked'); };
  $('#lbClose').addEventListener('click',close);
  lb.addEventListener('click',e=>{ if(e.target===lb) close(); });
  addEventListener('keydown',e=>{ if(e.key==='Escape') close(); });
}

/* =========================== FAQ (accessible accordion) =========================== */
function buildFaq(list){
  const wrap=$('#faqList');
  list.forEach((f,i)=>{
    const item=el('div','faq__item',
      `<button class="faq__q" aria-expanded="false" aria-controls="faqA${i}" id="faqQ${i}">${f.q}<i aria-hidden="true">+</i></button>
       <div class="faq__a" id="faqA${i}" role="region" aria-labelledby="faqQ${i}"><p>${f.a}</p></div>`);
    const a=$('.faq__a',item), q=$('.faq__q',item);
    q.addEventListener('click',()=>{
      const open=item.classList.contains('open');
      $$('.faq__item',wrap).forEach(o=>{ o.classList.remove('open');
        $('.faq__a',o).style.maxHeight=null; $('.faq__q',o).setAttribute('aria-expanded','false'); });
      if(!open){ item.classList.add('open'); a.style.maxHeight=a.scrollHeight+'px'; q.setAttribute('aria-expanded','true'); }
    });
    wrap.append(item);
  });
}

/* =========================== REVEALS + STAGGER + COUNTERS =========================== */
function observers(){
  /* index-based stagger inside card grids */
  ['#statsGrid','#whyGrid','#programsGrid','#plansGrid'].forEach(sel=>{
    $$(`${sel} > *`).forEach((n,i)=>n.style.setProperty('--stagger', String(Math.min(i%10,7))));
  });

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
  const target=+node.dataset.count, suffix=node.dataset.suffix||'';
  const fmt=v=>v>=1000?Math.floor(v).toLocaleString('en-IN'):Math.floor(v);
  if(REDUCED){ node.textContent=fmt(target)+suffix; return; }
  const dur=1400, start=performance.now();
  (function step(now){
    const p=Math.min((now-start)/dur,1); const ease=1-Math.pow(1-p,3);
    node.textContent=fmt(target*ease)+suffix;
    if(p<1) requestAnimationFrame(step); else node.textContent=fmt(target)+suffix;
  })(start);
}

/* =========================== HERO =========================== */
function hero(){
  /* decorative word rail: slow, gentle crossfade */
  const node=$('#heroWords'); const words=CONFIG.words; let i=0;
  node.textContent=words[0];
  if(!REDUCED){
    setInterval(()=>{ i=(i+1)%words.length; node.style.opacity=0;
      setTimeout(()=>{ node.textContent=words[i]; node.style.opacity=1; },600); },5000);
  }
  /* soft parallax on the hero background — desktop pointers only, motion-safe */
  const bg=$('.hero__bg'), heroEl=$('#hero');
  if(!REDUCED && matchMedia('(hover:hover) and (min-width:769px)').matches){
    let ticking=false;
    addEventListener('scroll',()=>{
      if(ticking) return; ticking=true;
      requestAnimationFrame(()=>{
        const y=scrollY;
        if(y<heroEl.offsetHeight) bg.style.transform=`scale(1.045) translate3d(0,${y*0.12}px,0)`;
        ticking=false;
      });
    },{passive:true});
  }
  /* entrance choreography */
  requestAnimationFrame(()=>requestAnimationFrame(()=>document.body.classList.add('is-ready')));
}

/* =========================== NAV: scrolled state, progress, scrollspy, mobile =========================== */
function navUI(){
  const nav=$('#nav'), toggle=$('#navToggle'), links=$('#navLinks'), prog=$('#scrollProgress');
  const onScroll=()=>{
    nav.classList.toggle('scrolled', scrollY>40);
    const h=document.documentElement;
    prog.style.transform=`scaleX(${h.scrollTop/(h.scrollHeight-h.clientHeight)||0})`;
  };
  addEventListener('scroll',onScroll,{passive:true}); onScroll();

  const setMenu=open=>{
    links.classList.toggle('open',open); toggle.classList.toggle('x',open);
    toggle.setAttribute('aria-expanded',String(open));
    document.body.classList.toggle('locked',open);
  };
  toggle.addEventListener('click',()=>setMenu(!links.classList.contains('open')));
  $$('#navLinks a').forEach(a=>a.addEventListener('click',()=>setMenu(false)));
  addEventListener('keydown',e=>{ if(e.key==='Escape') setMenu(false); });

  $$('a[href^="#"]').forEach(a=>{
    a.addEventListener('click',e=>{
      const id=a.getAttribute('href'); if(id.length<2) return;
      const t=$(id); if(!t) return; e.preventDefault();
      t.scrollIntoView({behavior:REDUCED?'auto':'smooth'});
    });
  });

  /* scrollspy — highlight the nav link of the section in view */
  const navAnchors=$$('#navLinks a');
  const byId=Object.fromEntries(navAnchors.map(a=>[a.getAttribute('href').slice(1),a]));
  const spy=new IntersectionObserver(entries=>{
    entries.forEach(e=>{
      if(e.isIntersecting){
        navAnchors.forEach(a=>a.classList.remove('active'));
        byId[e.target.id]?.classList.add('active');
      }
    });
  },{ rootMargin:'-35% 0px -55% 0px' });
  Object.keys(byId).forEach(id=>{ const s=document.getElementById(id); if(s) spy.observe(s); });
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
(function boot(){
  hydrate();
  observers();
  hero();
  navUI();
  contactForm();
})();
