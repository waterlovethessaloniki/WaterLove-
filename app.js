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

// ═══════════════════════════════════════════════════════
// I18N (GR / EN language toggle) — pilot on index.html
// ═══════════════════════════════════════════════════════
// Values may contain inline markup; they are set via innerHTML.
// The 'el' dictionary must reproduce the original markup exactly so
// switching EN -> GR restores the page to its default appearance.
const I18N = {
  el: {
    'nav.home':'Αρχική','nav.about':'Σχετικά','nav.products':'Προϊόντα','nav.faq':'Συχνές Ερωτήσεις','nav.contact':'Επικοινωνία',
    'hero.tagline':'Κάθε ενυδρείο έχει τη δική του ζωή',
    'hero.subtitle':'Είκοσι χρόνια αγάπη για τον υδρόβιο κόσμο, στο κέντρο της Θεσσαλονίκης. Ελάτε να μιλήσουμε με την <strong>Λαμπρινή</strong> και να φτιάξουμε μαζί το ενυδρείο των ονείρων σας.',
    'hero.trust2':'20+ χρόνια εμπειρία',
    'hero.trust3':'Κέντρο πόλης',
    'hero.ctaPrimary':'Επικοινωνήστε μαζί μας',
    'hero.ctaSecondary':'Δείτε τα προϊόντα',
    'hero.scroll':'Εξερευνήστε',
    'about.label':'Ποιοι είμαστε',
    'about.title':'Το Water Love ·<br><em>Εμπειρία που μιλάει</em>',
    'about.body':'Το Water Love είναι ο χώρος της Λαμπρινής Μπιζίκη · μιας επαγγελματία που συνδυάζει βαθιά γνώση με ειλικρινή διάθεση να βοηθήσει. Κάθε ερώτηση λαμβάνει πραγματική απάντηση. Κάθε επίσκεψη, μια ουσιαστική συμβουλή.',
    'about.stat1':'Χρόνια εμπειρίας',
    'about.btn':'Η ιστορία μας →',
    'about.quote':'"Κάθε ψάρι, κάθε φυτό, κάθε ενυδρείο έχει την ιστορία του. Είμαι εδώ για να σας βοηθήσω να τη γράψετε."',
    'about.quoteAuthor':'· Λαμπρινή Μπιζίκη, Ιδιοκτήτρια',
    'about.badge':'✨ Ανακαινισμένο κατάστημα 2024',
    'prod.label':'Τι θα βρείτε',
    'prod.title':'Ό,τι χρειάζεται <em>το ενυδρείο σας</em>',
    'prod.cat1Name':'Ψάρια','prod.cat1Desc':'Tropical, marine, goldfish',
    'prod.cat2Name':'Ενυδρεία','prod.cat2Desc':'Nano έως μεγάλα',
    'prod.cat3Name':'Ζωντανά Φυτά','prod.cat3Desc':'Επιλεγμένες ποικιλίες',
    'prod.cat4Name':'Χημεία Νερού','prod.cat4Desc':'Tests, conditioners',
    'prod.cat5Name':'Αξεσουάρ','prod.cat5Desc':'Φίλτρα, φωτισμός',
    'prod.cat6Name':'Φαρμακευτικά','prod.cat6Desc':'Θεραπείες & φάρμακα',
    'prod.btn':'Δείτε όλα τα προϊόντα →',
    'gal.label':'Φωτογραφίες',
    'gal.title':'Από <em>το κατάστημά μας</em>',
    'gal.btn':'Δείτε περισσότερα →',
    'hours.mon':'Δευτέρα','hours.tue':'Τρίτη','hours.wed':'Τετάρτη','hours.thu':'Πέμπτη','hours.fri':'Παρασκευή','hours.sat':'Σάββατο','hours.sun':'Κυριακή','hours.closed':'Κλειστά',
    'footer.tag':'Ενυδρεία · Ψάρια · Ζωντανά Φυτά · Αξεσουάρ · Θεσσαλονίκη',
    'footer.linkHome':'Αρχική','footer.linkAbout':'Σχετικά','footer.linkProducts':'Προϊόντα','footer.linkFaq':'FAQ','footer.linkContact':'Επικοινωνία',
    'footer.copy':'© 2026 Water Love · Λαμπρινή Μπιζίκη · Λεων. Ιασωνίδου 15, Θεσσαλονίκη · 6906 461 622',
    'bnav.home':'Αρχική','bnav.about':'Σχετικά','bnav.products':'Προϊόντα','bnav.faq':'FAQ','bnav.contact':'Επικοινωνία'
  },
  en: {
    'nav.home':'Home','nav.about':'About','nav.products':'Products','nav.faq':'FAQ','nav.contact':'Contact',
    'hero.tagline':'Every aquarium has a life of its own',
    'hero.subtitle':'Twenty years of love for the underwater world, in the heart of Thessaloniki. Come talk with <strong>Lambrini</strong> and let us build the aquarium of your dreams together.',
    'hero.trust2':'20+ years of experience',
    'hero.trust3':'City centre',
    'hero.ctaPrimary':'Get in touch',
    'hero.ctaSecondary':'Browse our products',
    'hero.scroll':'Explore',
    'about.label':'Who we are',
    'about.title':'Water Love ·<br><em>Experience that speaks</em>',
    'about.body':'Water Love is the space of Lambrini Biziki · a professional who blends deep knowledge with a genuine wish to help. Every question gets a real answer. Every visit, a piece of honest advice.',
    'about.stat1':'Years of experience',
    'about.btn':'Our story →',
    'about.quote':'"Every fish, every plant, every aquarium has its own story. I am here to help you write it."',
    'about.quoteAuthor':'· Lambrini Biziki, Owner',
    'about.badge':'✨ Renovated store, 2024',
    'prod.label':"What you'll find",
    'prod.title':'Everything <em>your aquarium</em> needs',
    'prod.cat1Name':'Fish','prod.cat1Desc':'Tropical, marine, goldfish',
    'prod.cat2Name':'Aquariums','prod.cat2Desc':'Nano to large',
    'prod.cat3Name':'Live Plants','prod.cat3Desc':'Selected varieties',
    'prod.cat4Name':'Water Chemistry','prod.cat4Desc':'Tests, conditioners',
    'prod.cat5Name':'Accessories','prod.cat5Desc':'Filters, lighting',
    'prod.cat6Name':'Medications','prod.cat6Desc':'Treatments & medicine',
    'prod.btn':'See all products →',
    'gal.label':'Photos',
    'gal.title':'From <em>our store</em>',
    'gal.btn':'See more →',
    'hours.mon':'Monday','hours.tue':'Tuesday','hours.wed':'Wednesday','hours.thu':'Thursday','hours.fri':'Friday','hours.sat':'Saturday','hours.sun':'Sunday','hours.closed':'Closed',
    'footer.tag':'Aquariums · Fish · Live Plants · Accessories · Thessaloniki',
    'footer.linkHome':'Home','footer.linkAbout':'About','footer.linkProducts':'Products','footer.linkFaq':'FAQ','footer.linkContact':'Contact',
    'footer.copy':'© 2026 Water Love · Lambrini Biziki · 15 Leon. Iasonidou St, Thessaloniki · 6906 461 622',
    'bnav.home':'Home','bnav.about':'About','bnav.products':'Products','bnav.faq':'FAQ','bnav.contact':'Contact'
  }
};

let CURRENT_LANG = 'el';

// Persistence: a first-party cookie (wl_lang). No Storage API needed, and it
// carries the choice across pages for the whole site. Falls back silently to
// the in-memory CURRENT_LANG if cookies are disabled.
function saveLangCookie(v){ try{ document.cookie = 'wl_lang=' + v + ';path=/;max-age=31536000;samesite=lax'; }catch(e){} }
function readLangCookie(){ try{ const m = document.cookie.match(/(?:^|;\s*)wl_lang=(el|en)\b/); return m ? m[1] : null; }catch(e){ return null; } }

function setLang(lang) {
  if(lang !== 'en') lang = 'el';
  CURRENT_LANG = lang;
  document.documentElement.lang = (lang === 'en') ? 'en' : 'el';
  const dict = I18N[lang] || {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(dict[key] != null) el.innerHTML = dict[key];
  });
  document.querySelectorAll('.ls-opt').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-setlang') === lang);
  });
  saveLangCookie(lang);
}

function initLang() {
  document.querySelectorAll('.ls-opt').forEach(b => {
    b.addEventListener('click', () => setLang(b.getAttribute('data-setlang')));
  });
  setLang(readLangCookie() || 'el');
}

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
  initLang();
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
