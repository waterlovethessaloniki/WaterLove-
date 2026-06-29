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

// ─── HERO SLIDESHOW ───
let heroIdx = 0, heroTimer;
function initHero() {
  const container = document.getElementById('heroSlides');
  const dotsContainer = document.getElementById('heroDots');
  if(!container) return;
  container.innerHTML = ''; dotsContainer.innerHTML = '';
  // Use gallery images; fall back to product images that have URLs
  let source = GALLERY.filter(g=>g.image_url);
  if(source.length === 0) source = PRODUCTS.filter(p=>p.image_url);
  const pick = source.slice(0, 6);
  if(pick.length === 0){ container.style.background = 'var(--navy)'; return; }
  pick.forEach((img,i) => {
    const slide = document.createElement('div');
    slide.className = 'hero-slide' + (i===0?' active':'');
    slide.style.backgroundImage = `url(${img.image_url})`;
    container.appendChild(slide);
    const dot = document.createElement('button');
    dot.className = 'hero-dot' + (i===0?' active':'');
    dot.setAttribute('aria-label', `Εικόνα ${i+1}`);
    dot.onclick = () => goHeroSlide(i);
    dotsContainer.appendChild(dot);
  });
  heroIdx = 0; clearInterval(heroTimer);
  heroTimer = setInterval(() => goHeroSlide((heroIdx+1) % pick.length), 5000);
}
function goHeroSlide(n) {
  const slides = document.querySelectorAll('.hero-slide');
  const dots = document.querySelectorAll('.hero-dot');
  slides.forEach(s=>s.classList.remove('active'));
  dots.forEach(d=>d.classList.remove('active'));
  if(slides[n]) slides[n].classList.add('active');
  if(dots[n]) dots[n].classList.add('active');
  heroIdx = n;
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
  const obs = new IntersectionObserver(entries => {
    entries.forEach(e => { if(e.isIntersecting){ e.target.classList.add('vis'); obs.unobserve(e.target); }});
  }, {threshold:0.1});
  document.querySelectorAll('.fade-up').forEach(el => obs.observe(el));
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
