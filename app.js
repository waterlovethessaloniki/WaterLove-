// ═══════════════════════════════════════════════════════
// Water Love - shared app.js (όλες οι σελίδες)
// ═══════════════════════════════════════════════════════

// ─── CONFIG ───
const GH_OWNER = 'waterlovethessaloniki';
const GH_REPO = 'WaterLove-';
const GALLERY_RAW = `https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/main/gallery-data.json`;
const PRODUCTS_RAW = `https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/main/products-data.json`;

const CAT_LABELS = {fish:'Ψάρια',marine:'Θαλάσσιο',tanks:'Ενυδρεία',plants:'Φυτά',accessories:'Αξεσουάρ',chemistry:'Χημεία',medicine:'Φαρμακευτικά',other:'Άλλο'};

let GALLERY = [];
let PRODUCTS = [];
let lbIndex = 0;

// ─── DATA LOADERS ───
async function loadGalleryData() {
  try {
    const res = await fetch(GALLERY_RAW + '?t=' + Date.now());
    if(!res.ok) return [];
    const d = await res.json();
    return Array.isArray(d) ? d : [];
  } catch(e){ return []; }
}
async function loadProductsData() {
  try {
    const res = await fetch(PRODUCTS_RAW + '?t=' + Date.now());
    if(!res.ok) return [];
    const d = await res.json();
    return Array.isArray(d) ? d : [];
  } catch(e){ return []; }
}

// ─── NAV (mobile) ───
function initNav() {
  const btn = document.getElementById('menuBtn');
  const nav = document.getElementById('navbar');
  if(btn && nav) {
    btn.onclick = () => {
      nav.classList.toggle('open');
      document.body.style.overflow = nav.classList.contains('open') ? 'hidden' : '';
    };
    nav.querySelectorAll('.nav-links a').forEach(a => {
      a.addEventListener('click', () => { nav.classList.remove('open'); document.body.style.overflow=''; });
    });
  }
}

// ─── BUBBLES ───
function initBubbles() {
  const container = document.getElementById('bubbles');
  if(!container) return;
  for(let i=0;i<10;i++){
    const b = document.createElement('div');
    b.className = 'bubble';
    const s = 4 + Math.random()*10;
    b.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${8+Math.random()*10}s;animation-delay:${Math.random()*8}s`;
    container.appendChild(b);
  }
}

// ─── HERO (light, decorated) ───
let heroTimer;
function initHero() {
  const hero = document.querySelector('.hero');
  if(!hero) return;

  // Cross-fading photo backdrop: combine product + gallery image_urls.
  // If none exist, the light aqua gradient stays as fallback (no broken images).
  const photoLayer = document.getElementById('heroPhotos');
  if(photoLayer){
    photoLayer.innerHTML = '';
    const seen = new Set();
    const photos = [];
    [...PRODUCTS, ...GALLERY].forEach(x => {
      const url = x && x.image_url;
      if(url && !seen.has(url)){ seen.add(url); photos.push(url); }
    });
    const pick = photos.slice(0, 8);
    if(pick.length){
      pick.forEach((url,i) => {
        const slide = document.createElement('div');
        slide.className = 'hd-slide' + (i===0?' active':'');
        slide.style.backgroundImage = `url("${url}")`;
        photoLayer.appendChild(slide);
      });
      if(pick.length > 1){
        const slides = photoLayer.querySelectorAll('.hd-slide');
        let pi = 0;
        clearInterval(heroTimer);
        heroTimer = setInterval(() => {
          slides[pi].classList.remove('active');
          pi = (pi + 1) % slides.length;
          slides[pi].classList.add('active');
        }, 5000);
      }
    }
  }

  // Rising bubbles
  const bc = document.getElementById('heroBubbles');
  if(bc && !bc.childElementCount){
    for(let i=0;i<16;i++){
      const b = document.createElement('i');
      const s = 4 + Math.random()*13;
      b.style.cssText = `width:${s}px;height:${s}px;left:${Math.random()*100}%;animation-duration:${7+Math.random()*9}s;animation-delay:${Math.random()*9}s`;
      bc.appendChild(b);
    }
  }

  // Scroll cue jumps to the next section
  const cue = document.getElementById('heroScroll');
  if(cue){
    cue.onclick = () => {
      const top = Math.max(hero.offsetHeight - 1, window.innerHeight * 0.9);
      window.scrollTo({ top, behavior:'smooth' });
    };
  }
}

// ─── GALLERY RENDER ───
function galleryImages() {
  return GALLERY.filter(g=>g.image_url).map(g => ({ src:g.image_url, caption:g.caption||'' }));
}
function initHomeGallery() {
  const el = document.getElementById('homeGallery');
  if(!el) return;
  el.innerHTML = '';
  const imgs = galleryImages().slice(0,6);
  if(imgs.length===0){ el.innerHTML = '<p style="color:var(--text3);grid-column:1/-1;text-align:center">Σύντομα νέες φωτογραφίες</p>'; return; }
  imgs.forEach((img,idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.onclick = () => openLB(idx);
    item.innerHTML = `<img src="${img.src}" alt="${img.caption}" loading="lazy"/><div class="gallery-caption">${img.caption}</div>`;
    el.appendChild(item);
  });
}
function initAboutGallery() {
  const el = document.getElementById('aboutGallery');
  if(!el) return;
  el.innerHTML = '';
  const imgs = galleryImages();
  if(imgs.length===0){ el.innerHTML = '<p style="color:var(--text3);grid-column:1/-1;text-align:center">Σύντομα νέες φωτογραφίες</p>'; return; }
  imgs.forEach((img,idx) => {
    const item = document.createElement('div');
    item.className = 'gallery-item';
    item.onclick = () => openLB(idx);
    item.innerHTML = `<img src="${img.src}" alt="${img.caption}" loading="lazy"/><div class="gallery-caption">${img.caption}</div>`;
    el.appendChild(item);
  });
}

// ─── LIGHTBOX ───
function openLB(idx) {
  lbIndex = idx;
  const imgs = galleryImages();
  document.getElementById('lbImg').src = imgs[idx].src;
  document.getElementById('lightbox').classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeLB(e) {
  if(e && e.target !== document.getElementById('lightbox') && !e.target.classList.contains('lb-close')) return;
  document.getElementById('lightbox').classList.remove('open');
  document.body.style.overflow = '';
}
function lbNav(dir) {
  const imgs = galleryImages();
  lbIndex = (lbIndex + dir + imgs.length) % imgs.length;
  document.getElementById('lbImg').src = imgs[lbIndex].src;
}
document.addEventListener('keydown', e => {
  const lb = document.getElementById('lightbox');
  if(lb && lb.classList.contains('open')) {
    if(e.key==='ArrowLeft') lbNav(-1);
    if(e.key==='ArrowRight') lbNav(1);
    if(e.key==='Escape'){ lb.classList.remove('open'); document.body.style.overflow=''; }
  }
});

// ─── PRODUCTS RENDER ───
function renderProducts(cat) {
  const grid = document.getElementById('prodGrid');
  if(!grid) return;
  const filtered = cat==='all' ? PRODUCTS : PRODUCTS.filter(p=>p.category===cat);
  if(filtered.length===0){ grid.innerHTML='<p style="color:var(--text3);grid-column:1/-1;text-align:center;padding:2rem">Δεν υπάρχουν προϊόντα σε αυτή την κατηγορία</p>'; return; }
  grid.innerHTML = filtered.map(p => {
    const hasImg = p.image_url && p.image_url.length>0;
    const imgStyle = hasImg ? `background-image:url(${p.image_url});background-color:#C5E8E9` : `background:linear-gradient(135deg,#C5E8E9,#b8dfe0)`;
    const placeholder = hasImg ? '' : `<div style="position:absolute;inset:0;display:flex;align-items:center;justify-content:center;font-size:3rem;opacity:.4">${p.icon||'🐠'}</div>`;
    return `<div class="prod-card">
      <div class="prod-img" style="${imgStyle}">
        ${placeholder}
        <span class="prod-tag">${CAT_LABELS[p.category]||p.category}</span>
      </div>
      <div class="prod-body">
        <h3>${p.icon||''} ${p.name}</h3>
        <p>${p.desc||''}</p>
        <a href="contact.html" class="ask-btn">Ρωτήστε για αυτό →</a>
      </div>
    </div>`;
  }).join('');
}
function filterProds(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderProducts(cat);
}

// ─── FAQ RENDER ───
function renderFaq(cat) {
  const list = document.getElementById('faqList');
  if(!list || typeof FAQS==='undefined') return;
  const filtered = cat==='all' ? FAQS : FAQS.filter(f=>f.cat===cat);
  list.innerHTML = filtered.map((f,i) => `
    <div class="faq-item" id="faq-${i}">
      <button class="faq-q" onclick="toggleFaq('faq-${i}')">
        <span>${f.q}</span><span class="arrow">▼</span>
      </button>
      <div class="faq-a">
        <p>${f.a}</p>
        ${f.tip?`<div class="fish-tip"><span>💡</span><span><strong>Tip:</strong> ${f.tip}</div>`:''}
      </div>
    </div>`).join('');
}
function toggleFaq(id){ document.getElementById(id).classList.toggle('open'); }
function filterFaq(cat, btn) {
  document.querySelectorAll('.faq-cat').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  renderFaq(cat);
}

// ─── HOURS TODAY ───
function highlightToday() {
  const d = new Date().getDay();
  const map = {0:'hSun',1:'hMon',2:'hTue',3:'hWed',4:'hThu',5:'hFri',6:'hSat'};
  const el = document.getElementById(map[d]);
  if(el) el.classList.add('h-today');
}

// ─── FADE-UP ───
function initFadeUp() {
  const els = document.querySelectorAll('.fade-up');
  if(!els.length) return;
  if(!('IntersectionObserver' in window)) {
    els.forEach(el => el.classList.add('vis'));
    return;
  }
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); }});
  }, {threshold:0, rootMargin:'0px 0px -6% 0px'});
  els.forEach(el => obs.observe(el));

  // Bulletproof fallback: reveal anything in/near the viewport on scroll,
  // so nothing can ever get stuck invisible (especially tall blocks on mobile).
  function revealVisible() {
    let remaining = 0;
    document.querySelectorAll('.fade-up:not(.vis)').forEach(el => {
      const r = el.getBoundingClientRect();
      // Reveal if any part is near the viewport, OR the element is taller than
      // the viewport and already overlaps it (its top is above the bottom edge).
      const inView = r.top < window.innerHeight + 120 && r.bottom > -120;
      const tallOverlap = r.top < window.innerHeight && r.bottom > 0;
      if(inView || tallOverlap) el.classList.add('vis');
      else remaining++;
    });
    if(remaining === 0) window.removeEventListener('scroll', onScroll);
  }
  let ticking = false;
  function onScroll(){ if(!ticking){ ticking=true; requestAnimationFrame(()=>{ revealVisible(); ticking=false; }); } }
  window.addEventListener('scroll', onScroll, {passive:true});
  revealVisible();
  // Final safety net after load settles
  setTimeout(revealVisible, 1500);
}

// ─── PAGE INIT (καλείται από κάθε σελίδα) ───
async function initPage(opts={}) {
  initNav();
  initBubbles();
  highlightToday();
  initFadeUp();
  if(opts.faq) renderFaq('all');
  // Load remote data as needed
  const needGallery = opts.hero || opts.homeGallery || opts.aboutGallery;
  const needProducts = opts.products || opts.hero;
  if(needGallery) GALLERY = await loadGalleryData();
  if(needProducts) PRODUCTS = await loadProductsData();
  if(opts.hero) initHero();
  if(opts.homeGallery) initHomeGallery();
  if(opts.aboutGallery) initAboutGallery();
  if(opts.products) renderProducts('all');
}
