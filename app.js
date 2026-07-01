// ═══════════════════════════════════════════════════════
// Water Love - shared app.js (όλες οι σελίδες)
// ═══════════════════════════════════════════════════════

// ─── CONFIG ───
const GH_OWNER = 'waterlovethessaloniki';
const GH_REPO = 'WaterLove-';
const WORKER_URL = 'https://waterlove-worker.waterlovethessaloniki.workers.dev';
const PRODUCTS_RAW = `https://raw.githubusercontent.com/${GH_OWNER}/${GH_REPO}/main/products-data.json`;

const CAT_LABELS = {fish:'Ψάρια',marine:'Θαλάσσιο',tanks:'Ενυδρεία',plants:'Φυτά',accessories:'Αξεσουάρ',chemistry:'Χημεία',medicine:'Φαρμακευτικά',other:'Άλλο'};

// Fixed (known) product categories: canonical order + i18n keys for bilingual chip
// labels. Any category value NOT in this list is a custom one (created from admin)
// and is shown exactly as typed (single language).
const KNOWN_CATS = ['fish','marine','tanks','plants','accessories','chemistry','medicine'];
const CAT_I18N = {fish:'pr.catFish',marine:'pr.catMarine',tanks:'pr.catTanks',plants:'pr.catPlants',accessories:'pr.catAcc',chemistry:'pr.catChem',medicine:'pr.catMed'};

let PRODUCTS = [];
let PROD_CAT = 'all';
let FAQ_CAT = 'all';

// ═══════════════════════════════════════════════════════
// I18N (GR / EN language toggle) — pilot on index.html
// ═══════════════════════════════════════════════════════
// Values may contain inline markup; they are set via innerHTML.
// The 'el' dictionary must reproduce the original markup exactly so
// switching EN -> GR restores the page to its default appearance.
const I18N = {
  el: {
    'nav.home':'Αρχική','nav.about':'Σχετικά','nav.products':'Προϊόντα','nav.faq':'Συχνές Ερωτήσεις','nav.contact':'Επικοινωνία',
    'hero.subtitle':'«Η εμπειρία και η αγάπη κάνουν τη διαφορά»',
    'hero.trust2':'20+ χρόνια εμπειρία',
    'hero.trust3':'Κέντρο πόλης',
    'hero.ctaPrimary':'Επικοινωνήστε μαζί μας',
    'hero.ctaSecondary':'Δείτε τα προϊόντα',
    'hero.scroll':'Εξερευνήστε',
    'about.label':'Ποιοι είμαστε',
    'about.title':'Το Water Love ·<br><em>Εμπειρία που μιλάει</em>',
    'about.body':'Το Water Love είναι ο χώρος της Λαμπρινής Μπιζίκη · μιας επαγγελματία που συνδυάζει βαθιά γνώση με ειλικρινή διάθεση να βοηθήσει. Κάθε ερώτηση λαμβάνει πραγματική απάντηση. Κάθε επίσκεψη, μια ουσιαστική συμβουλή.',
    'about.stat1':'Χρόνια εμπειρίας',
    'about.stat2':'Google',
    'about.stat3':'Κέντρο Θεσσαλονίκης',
    'about.ctaPrimary':'Επικοινωνήστε μαζί μας',
    'about.btn':'Η ιστορία μας →',
    'about.badge':'✨ Ανακαινισμένο κατάστημα 2024',
    'rev.label':'Κριτικές',
    'rev.title':'Τι λένε οι πελάτες μας',
    'rev.rating':'Βαθμολογία 5/5 στο Google',
    'rev.btn':'Δείτε όλες τις κριτικές στο Google',
    'prod.label':'Τι θα βρείτε',
    'prod.title':'Ό,τι χρειάζεται <em>το ενυδρείο σας</em>',
    'prod.cat1Name':'Ψάρια','prod.cat1Desc':'Tropical, marine, goldfish',
    'prod.cat2Name':'Ενυδρεία','prod.cat2Desc':'Nano έως μεγάλα',
    'prod.cat3Name':'Ζωντανά Φυτά','prod.cat3Desc':'Επιλεγμένες ποικιλίες',
    'prod.cat4Name':'Χημεία Νερού','prod.cat4Desc':'Tests, conditioners',
    'prod.cat5Name':'Αξεσουάρ','prod.cat5Desc':'Φίλτρα, φωτισμός',
    'prod.cat6Name':'Φαρμακευτικά','prod.cat6Desc':'Θεραπείες & φάρμακα',
    'prod.btn':'Δείτε όλα τα προϊόντα →',
    'home.tilesLabel':'Κατηγορίες','home.tilesTitle':'Ψάξτε ανά <em>κατηγορία</em>',
    'home.tileFish':'Ψάρια','home.tileTanks':'Ενυδρεία','home.tilePlants':'Φυτά','home.tileAcc':'Αξεσουάρ',
    'hours.mon':'Δευτέρα','hours.tue':'Τρίτη','hours.wed':'Τετάρτη','hours.thu':'Πέμπτη','hours.fri':'Παρασκευή','hours.sat':'Σάββατο','hours.sun':'Κυριακή','hours.closed':'Κλειστά',
    'footer.tag':'Ενυδρεία · Ψάρια · Ζωντανά Φυτά · Αξεσουάρ · Θεσσαλονίκη',
    'footer.linkHome':'Αρχική','footer.linkAbout':'Σχετικά','footer.linkProducts':'Προϊόντα','footer.linkFaq':'FAQ','footer.linkContact':'Επικοινωνία',
    'footer.copy':'© 2026 Water Love · Λαμπρινή Μπιζίκη · Λεων. Ιασωνίδου 15, Θεσσαλονίκη · 6906 461 622',
    'bnav.home':'Αρχική','bnav.about':'Σχετικά','bnav.products':'Προϊόντα','bnav.faq':'FAQ','bnav.contact':'Επικοινωνία',
    // ── about.html ──
    'ab.heroTitle':'Η <em>Ιστορία μας</em>',
    'ab.heroSub':'Γνωρίστε τη Λαμπρινή και ανακαλύψτε γιατί το Water Love είναι κάτι παραπάνω από κατάστημα',
    'ab.portraitQuote':'"Η αγάπη για τα ψάρια ξεκινά από την πρώτη ματιά · κι έπειτα δεν σταματά ποτέ."',
    'ab.portraitAuthor':'Λαμπρινή Μπιζίκη · Ιδιοκτήτρια',
    'ab.badge':'<big>20</big>χρόνια εμπειρία',
    'ab.secLabel':'Σχετικά με εμάς',
    'ab.secTitle':'Λαμπρινή Μπιζίκη ·<br><em>Η ψυχή του Water Love</em>',
    'ab.p1':'Το Water Love ξεκίνησε πριν από δύο δεκαετίες από μια γυναίκα με αδυναμία στα ενυδρεία και στον κόσμο που ζει μέσα τους. Η Λαμπρινή Μπιζίκη δεν άνοιξε απλώς ένα κατάστημα · δημιούργησε έναν χώρο όπου κάθε ερώτηση βρίσκει απάντηση, κάθε αμφιβολία λύση.',
    'ab.p2':'Σε δύο δεκαετίες στο επάγγελμα, έχει βοηθήσει αρχάριους να φτιάξουν το πρώτο τους ενυδρείο και έμπειρους collectors να βρουν σπάνια είδη. Η εξυπηρέτησή της ξεχωρίζει γιατί συνδυάζει τεχνογνωσία με ειλικρίνεια · δίνει την απάντηση που χρειάζεσαι, όχι αυτή που θέλεις ν\' ακούσεις.',
    'ab.p3':'Το κατάστημα μόλις ανακαινίστηκε · ο χώρος άλλαξε, αλλά η φιλοσοφία παραμένει ίδια: προσωπική εξυπηρέτηση, ειλικρινής συμβουλή, αγάπη για κάθε υδρόβιο πλάσμα.',
    'ab.stat1':'<big>20+</big><small>Χρόνια στο επάγγελμα</small>',
    'ab.stat2':'<big>⭐ 5/5</big><small>Αξιολογήσεις Google</small>',
    'ab.stat3':'<big>630+</big><small>Facebook followers</small>',
    'ab.stat4':'<big>📍 Κέντρο</big><small>Θεσσαλονίκη</small>',
    'ab.reno':'Ανακαινισμένο κατάστημα · ελάτε να δείτε τον νέο μας χώρο!',
    'ab.reviewCite':'Αξιολογήσεις πελατών στο Google Maps · Λεων. Ιασωνίδου 15, Θεσσαλονίκη',
    'ab.contactBtn':'Επικοινωνήστε μαζί μας',
    // ── products.html ──
    'pr.heroTitle':'Τα <em>Προϊόντά μας</em>',
    'pr.heroSub':'Από ψάρια και φυτά μέχρι εξοπλισμό και φάρμακα · ό,τι χρειάζεται το ενυδρείο σας',
    'pr.catAll':'Όλα','pr.catFish':'🐠 Ψάρια','pr.catMarine':'🌊 Θαλάσσιο','pr.catTanks':'🪸 Ενυδρεία','pr.catPlants':'🌿 Φυτά','pr.catAcc':'⚙️ Αξεσουάρ','pr.catChem':'🧪 Χημεία','pr.catMed':'💊 Φαρμακευτικά',
    'prod.askBtn':'Ρωτήστε για αυτό →',
    'prod.empty':'Δεν υπάρχουν προϊόντα σε αυτή την κατηγορία',
    // ── faq.html ──
    'fq.heroTitle':'Συχνές <em>Ερωτήσεις</em>',
    'fq.heroSub':'Οι πιο συνηθισμένες απορίες για ψάρια, ενυδρεία και φυτά · με απαντήσεις από 20 χρόνια εμπειρίας',
    'fq.catAll':'Όλα','fq.catWater':'💧 Νερό & Χημεία','fq.catFish':'🐠 Ψάρια','fq.catPlants':'🌿 Φυτά','fq.catSetup':'🪸 Εγκατάσταση','fq.catHealth':'💊 Υγεία',
    'fq.notFound':'Δεν βρήκατε την απάντηση που ψάχνετε;',
    'fq.askBtn':'Ρωτήστε τη Λαμπρινή →',
    // ── contact.html ──
    'ct.heroTitle':'Βρείτε μας · <em>Μιλήστε μας</em>',
    'ct.heroSub':'Ζωντανά στο κατάστημα, στο τηλέφωνο ή online · είμαστε πάντα εδώ',
    'ct.secLabel':'Κανάλια επικοινωνίας',
    'ct.secTitle':'Ελάτε να <em>μιλήσουμε</em>',
    'ct.intro':'Η καλύτερη συμβουλή για το ενυδρείο σας είναι μια συζήτηση μακριά. Ρωτήστε μας για οτιδήποτε · αρχάριοι ή έμπειροι, είμαστε εδώ.',
    'ct.chPhone':'Καλέστε μας άμεσα',
    'ct.chFb':'Water Love · Στείλτε μήνυμα',
    'ct.chViber':'Στείλτε μας μήνυμα στο Viber',
    'ct.chMapsAddr':'Λεων. Ιασωνίδου 15',
    'ct.chMapsCity':'Θεσσαλονίκη 546 35 · Google Maps',
    'ct.mapInfo':'Λεων. Ιασωνίδου 15, Θεσσαλονίκη 546 35',
    // ── contact form ──
    'cf.secLabel':'Φόρμα επικοινωνίας',
    'cf.title':'Στείλτε μας μήνυμα',
    'cf.sub':'Συμπληρώστε τα στοιχεία σας και θα επικοινωνήσουμε μαζί σας το συντομότερο.',
    'cf.nameLabel':'Όνομα',
    'cf.namePh':'Το όνομά σας',
    'cf.phoneLabel':'Τηλέφωνο',
    'cf.phonePh':'π.χ. 69XXXXXXXX',
    'cf.interestLabel':'Τι σας ενδιαφέρει (προαιρετικό)',
    'cf.interestOpt0':'- Επιλέξτε -',
    'cf.interestFilter':'Φίλτρο',
    'cf.interestInstall':'Εγκατάσταση φίλτρου',
    'cf.interestNewTank':'Στήσιμο νέου ενυδρείου',
    'cf.interestProduct':'Κάποιο προϊόν',
    'cf.interestOther':'Άλλο',
    'cf.msgLabel':'Μήνυμα',
    'cf.msgPh':'Πείτε μας πώς μπορούμε να βοηθήσουμε...',
    'cf.submit':'Αποστολή μηνύματος',
    'cf.sending':'Αποστολή...',
    'cf.success':'Λάβαμε το μήνυμά σας, θα επικοινωνήσουμε σύντομα!',
    'cf.error':'Κάτι πήγε στραβά. Δοκιμάστε ξανά ή καλέστε μας στο 6906 461 622.',
    'cf.errRequired':'Συμπληρώστε όνομα, τηλέφωνο και μήνυμα.'
  },
  en: {
    'nav.home':'Home','nav.about':'About','nav.products':'Products','nav.faq':'FAQ','nav.contact':'Contact',
    'hero.subtitle':'"Experience and love make the difference"',
    'hero.trust2':'20+ years of experience',
    'hero.trust3':'City centre',
    'hero.ctaPrimary':'Get in touch',
    'hero.ctaSecondary':'Browse our products',
    'hero.scroll':'Explore',
    'about.label':'Who we are',
    'about.title':'Water Love ·<br><em>Experience that speaks</em>',
    'about.body':'Water Love is the space of Lambrini Biziki · a professional who blends deep knowledge with a genuine wish to help. Every question gets a real answer. Every visit, a piece of honest advice.',
    'about.stat1':'Years of experience',
    'about.stat2':'Google',
    'about.stat3':'Central Thessaloniki',
    'about.ctaPrimary':'Contact us',
    'about.btn':'Our story →',
    'about.badge':'✨ Renovated store, 2024',
    'rev.label':'Reviews',
    'rev.title':'What our customers say',
    'rev.rating':'5/5 rating on Google',
    'rev.btn':'See all reviews on Google',
    'prod.label':"What you'll find",
    'prod.title':'Everything <em>your aquarium</em> needs',
    'prod.cat1Name':'Fish','prod.cat1Desc':'Tropical, marine, goldfish',
    'prod.cat2Name':'Aquariums','prod.cat2Desc':'Nano to large',
    'prod.cat3Name':'Live Plants','prod.cat3Desc':'Selected varieties',
    'prod.cat4Name':'Water Chemistry','prod.cat4Desc':'Tests, conditioners',
    'prod.cat5Name':'Accessories','prod.cat5Desc':'Filters, lighting',
    'prod.cat6Name':'Medications','prod.cat6Desc':'Treatments & medicine',
    'prod.btn':'See all products →',
    'home.tilesLabel':'Categories','home.tilesTitle':'Browse by <em>category</em>',
    'home.tileFish':'Fish','home.tileTanks':'Aquariums','home.tilePlants':'Plants','home.tileAcc':'Accessories',
    'hours.mon':'Monday','hours.tue':'Tuesday','hours.wed':'Wednesday','hours.thu':'Thursday','hours.fri':'Friday','hours.sat':'Saturday','hours.sun':'Sunday','hours.closed':'Closed',
    'footer.tag':'Aquariums · Fish · Live Plants · Accessories · Thessaloniki',
    'footer.linkHome':'Home','footer.linkAbout':'About','footer.linkProducts':'Products','footer.linkFaq':'FAQ','footer.linkContact':'Contact',
    'footer.copy':'© 2026 Water Love · Lambrini Biziki · 15 Leon. Iasonidou St, Thessaloniki · 6906 461 622',
    'bnav.home':'Home','bnav.about':'About','bnav.products':'Products','bnav.faq':'FAQ','bnav.contact':'Contact',
    // ── about.html ──
    'ab.heroTitle':'Our <em>Story</em>',
    'ab.heroSub':'Meet Lambrini and discover why Water Love is so much more than a store',
    'ab.portraitQuote':'"Love for fish begins at first sight · and after that it never stops."',
    'ab.portraitAuthor':'Lambrini Biziki · Owner',
    'ab.badge':'<big>20</big>years of experience',
    'ab.secLabel':'About us',
    'ab.secTitle':'Lambrini Biziki ·<br><em>The soul of Water Love</em>',
    'ab.p1':'Water Love began two decades ago, started by a woman with a soft spot for aquariums and the world that lives inside them. Lambrini Biziki did not simply open a store · she created a place where every question finds an answer and every doubt a solution.',
    'ab.p2':'Over two decades in the trade, she has helped beginners set up their very first aquarium and seasoned collectors track down rare species. Her service stands out because it pairs real expertise with honesty · she gives you the answer you need, not the one you want to hear.',
    'ab.p3':'The store has just been renovated · the space has changed, but the philosophy stays the same: personal service, honest advice, and love for every aquatic creature.',
    'ab.stat1':'<big>20+</big><small>Years in the trade</small>',
    'ab.stat2':'<big>⭐ 5/5</big><small>Google reviews</small>',
    'ab.stat3':'<big>630+</big><small>Facebook followers</small>',
    'ab.stat4':'<big>📍 Central</big><small>Thessaloniki</small>',
    'ab.reno':'Newly renovated store · come and see our new space!',
    'ab.reviewCite':'Customer reviews on Google Maps · 15 Leon. Iasonidou St, Thessaloniki',
    'ab.contactBtn':'Get in touch',
    // ── products.html ──
    'pr.heroTitle':'Our <em>Products</em>',
    'pr.heroSub':'From fish and plants to equipment and medicine · everything your aquarium needs',
    'pr.catAll':'All','pr.catFish':'🐠 Fish','pr.catMarine':'🌊 Marine','pr.catTanks':'🪸 Aquariums','pr.catPlants':'🌿 Plants','pr.catAcc':'⚙️ Accessories','pr.catChem':'🧪 Chemistry','pr.catMed':'💊 Medications',
    'prod.askBtn':'Ask about this →',
    'prod.empty':'There are no products in this category yet',
    // ── faq.html ──
    'fq.heroTitle':'Frequently Asked <em>Questions</em>',
    'fq.heroSub':'The most common questions about fish, aquariums and plants · answered from 20 years of experience',
    'fq.catAll':'All','fq.catWater':'💧 Water & Chemistry','fq.catFish':'🐠 Fish','fq.catPlants':'🌿 Plants','fq.catSetup':'🪸 Setup','fq.catHealth':'💊 Health',
    'fq.notFound':'Didn\'t find the answer you were looking for?',
    'fq.askBtn':'Ask Lambrini →',
    // ── contact.html ──
    'ct.heroTitle':'Find us · <em>Talk to us</em>',
    'ct.heroSub':'In store, on the phone or online · we are always here',
    'ct.secLabel':'Ways to reach us',
    'ct.secTitle':'Let\'s <em>talk</em>',
    'ct.intro':'The best advice for your aquarium is just one conversation away. Ask us anything · beginners or experts, we are here for you.',
    'ct.chPhone':'Call us directly',
    'ct.chFb':'Water Love · Send a message',
    'ct.chViber':'Message us on Viber',
    'ct.chMapsAddr':'15 Leon. Iasonidou St',
    'ct.chMapsCity':'Thessaloniki 546 35 · Google Maps',
    'ct.mapInfo':'15 Leon. Iasonidou St, Thessaloniki 546 35',
    // ── contact form ──
    'cf.secLabel':'Contact form',
    'cf.title':'Send us a message',
    'cf.sub':'Fill in your details and we will get back to you as soon as possible.',
    'cf.nameLabel':'Name',
    'cf.namePh':'Your name',
    'cf.phoneLabel':'Phone',
    'cf.phonePh':'e.g. 69XXXXXXXX',
    'cf.interestLabel':"What you're interested in (optional)",
    'cf.interestOpt0':'- Select -',
    'cf.interestFilter':'Filter',
    'cf.interestInstall':'Filter installation',
    'cf.interestNewTank':'Setting up a new aquarium',
    'cf.interestProduct':'A product',
    'cf.interestOther':'Other',
    'cf.msgLabel':'Message',
    'cf.msgPh':'Tell us how we can help...',
    'cf.submit':'Send message',
    'cf.sending':'Sending...',
    'cf.success':'We received your message, we will contact you soon!',
    'cf.error':'Something went wrong. Please try again or call us at 6906 461 622.',
    'cf.errRequired':'Please fill in name, phone and message.'
  }
};

let CURRENT_LANG = 'el';

// Persistence: a first-party cookie (wl_lang). No Storage API needed, and it
// carries the choice across pages for the whole site. Falls back silently to
// the in-memory CURRENT_LANG if cookies are disabled.
function saveLangCookie(v){ try{ document.cookie = 'wl_lang=' + v + ';path=/;max-age=31536000;samesite=lax'; }catch(e){} }
function readLangCookie(){ try{ const m = document.cookie.match(/(?:^|;\s*)wl_lang=(el|en)\b/); return m ? m[1] : null; }catch(e){ return null; } }

// Translate a single key for strings built inside JS render functions
// (product cards, etc.). Falls back to Greek, then the key.
function t(key){ const d = I18N[CURRENT_LANG]; return (d && d[key] != null) ? d[key] : (I18N.el[key] != null ? I18N.el[key] : key); }

function setLang(lang) {
  if(lang !== 'en') lang = 'el';
  CURRENT_LANG = lang;
  document.documentElement.lang = (lang === 'en') ? 'en' : 'el';
  const dict = I18N[lang] || {};
  document.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    if(dict[key] != null) el.innerHTML = dict[key];
  });
  // Placeholder attributes (inputs/textareas) translate separately from innerHTML.
  document.querySelectorAll('[data-i18n-ph]').forEach(el => {
    const key = el.getAttribute('data-i18n-ph');
    if(dict[key] != null) el.setAttribute('placeholder', dict[key]);
  });
  document.querySelectorAll('.ls-opt').forEach(b => {
    b.classList.toggle('active', b.getAttribute('data-setlang') === lang);
  });
  // Re-render JS-built lists so their translatable chrome follows the language.
  if(document.getElementById('faqList') && typeof FAQS !== 'undefined') renderFaq(FAQ_CAT);
  if(document.getElementById('prodGrid')){ renderProductCats(); renderProducts(PROD_CAT); }
  saveLangCookie(lang);
}

function initLang() {
  document.querySelectorAll('.ls-opt').forEach(b => {
    b.addEventListener('click', () => setLang(b.getAttribute('data-setlang')));
  });
  setLang(readLangCookie() || 'el');
}

// ─── DATA LOADERS ───
async function loadProductsData() {
  // Prefer the Worker read: it fetches via the GitHub API server-side, so it is
  // always fresh (the raw.githubusercontent.com CDN ignores ?t= and serves stale
  // data for ~5 min after a write). Fall back to the raw URL on any Worker error
  // so a transient failure never blanks the product list.
  try {
    const res = await fetch(WORKER_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ action: 'read', target: 'products' })
    });
    if(res.ok) {
      const d = await res.json();
      if(d && d.success && Array.isArray(d.data)) return d.data;
    }
  } catch(e){ /* fall through to raw */ }
  try {
    const res = await fetch(PRODUCTS_RAW + '?t=' + Date.now());
    if(!res.ok) return [];
    const d = await res.json();
    return Array.isArray(d) ? d : [];
  } catch(e){ return []; }
}

// ─── CONTACT FORM (lead capture) ───
// Posts a new inquiry to the Worker (target:'inquiries', action:'add'). The
// Worker reads inquiries-data.json fresh, appends the item and writes it back,
// the same read-fresh-then-add flow products use. Stored fields stay stable
// (interest value is always the Greek label) so the Greek-only admin reads clean.
function initContactForm() {
  const form = document.getElementById('contactForm');
  if(!form) return;
  const statusEl = document.getElementById('cfStatus');
  const btn = document.getElementById('cfSubmit');
  function setStatus(type, key){
    if(!statusEl) return;
    statusEl.textContent = t(key);
    statusEl.className = 'cf-status show ' + type;
  }
  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('cfName').value.trim();
    const phone = document.getElementById('cfPhone').value.trim();
    const interest = document.getElementById('cfInterest').value;
    const message = document.getElementById('cfMessage').value.trim();
    if(!name || !phone || !message){ setStatus('error', 'cf.errRequired'); return; }
    btn.disabled = true;
    const restore = t('cf.submit');
    btn.textContent = t('cf.sending');
    if(statusEl) statusEl.className = 'cf-status';
    const item = {
      id: 'inq_' + Date.now() + '_' + Math.random().toString(36).slice(2,7),
      name, phone, interest, message,
      timestamp: new Date().toISOString(),
    };
    try {
      const res = await fetch(WORKER_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ target: 'inquiries', action: 'add', item }),
      });
      const data = await res.json().catch(() => ({}));
      if(!res.ok || data.error) throw new Error(data.error || data.detail || 'Worker error');
      form.reset();
      setStatus('success', 'cf.success');
    } catch(err) {
      setStatus('error', 'cf.error');
    } finally {
      btn.disabled = false;
      btn.textContent = restore;
    }
  });
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

  // Cross-fading photo backdrop: product image_urls only.
  // If none exist, the light aqua gradient stays as fallback (no broken images).
  const photoLayer = document.getElementById('heroPhotos');
  if(photoLayer){
    photoLayer.innerHTML = '';
    const seen = new Set();
    const photos = [];
    PRODUCTS.forEach(x => {
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

// ─── HOME · WHO WE ARE VISUAL ───
// Fill the right-column visual with the first available product photo (fresh
// from PRODUCTS). If none exists, keep the aqua gradient + fish placeholder so
// no broken image ever shows.
function initAboutVisual() {
  const v = document.getElementById('whoVisual');
  if(!v) return;
  const hit = PRODUCTS.find(p => p && p.image_url && p.image_url.length > 0);
  if(hit){
    v.style.backgroundImage = `url("${hit.image_url}")`;
    v.classList.add('has-photo');
  } else {
    v.style.backgroundImage = '';
    v.classList.remove('has-photo');
  }
}

// ─── HOME CATEGORY TILES ───
// Fill each homepage tile with the first product photo found in its category
// (fresh from PRODUCTS). Categories without a product photo keep the gradient
// placeholder (via the .placeholder class) so no broken image ever shows.
function initCategoryTiles() {
  const grid = document.getElementById('catTiles');
  if(!grid) return;
  grid.querySelectorAll('.cat-tile').forEach(tile => {
    const cat = tile.getAttribute('data-cat');
    const bg = tile.querySelector('.ct-bg');
    if(!bg) return;
    const hit = PRODUCTS.find(p => p.category === cat && p.image_url && p.image_url.length > 0);
    if(hit){
      bg.style.backgroundImage = `url("${hit.image_url}")`;
      bg.classList.remove('placeholder');
    } else {
      bg.style.backgroundImage = '';
      bg.classList.add('placeholder');
    }
  });
}

// Read a ?cat= filter from the URL and return it only if it is a real category
// (fixed or custom, discovered in PRODUCTS). Anything else falls back to 'all'.
function getUrlCat() {
  try {
    const c = new URLSearchParams(location.search).get('cat');
    if(c && productCategories().includes(c)) return c;
  } catch(e){}
  return 'all';
}

// ─── PRODUCTS RENDER ───
// Chip label: bilingual for known categories, raw text for custom ones.
function catLabel(cat) {
  return CAT_I18N[cat] ? t(CAT_I18N[cat]) : cat;
}
// The category list powering the filter chips: the fixed known set (always shown)
// followed by any custom categories discovered in the product data, first-seen order.
function productCategories() {
  const custom = [];
  PRODUCTS.forEach(p => {
    const c = p.category;
    if(c && !KNOWN_CATS.includes(c) && !custom.includes(c)) custom.push(c);
  });
  return [...KNOWN_CATS, ...custom];
}
// Build the filter chips from data instead of hardcoded HTML, so admin-created
// categories appear automatically. Uses textContent + listeners (no HTML injection).
function renderProductCats() {
  const wrap = document.getElementById('prodCats');
  if(!wrap) return;
  wrap.innerHTML = '';
  const make = (cat, label) => {
    const b = document.createElement('button');
    b.className = 'cat-btn' + (PROD_CAT === cat ? ' active' : '');
    b.textContent = label;
    b.addEventListener('click', () => filterProds(cat, b));
    wrap.appendChild(b);
  };
  make('all', t('pr.catAll'));
  productCategories().forEach(cat => make(cat, catLabel(cat)));
}
function renderProducts(cat) {
  const grid = document.getElementById('prodGrid');
  if(!grid) return;
  PROD_CAT = cat;
  const filtered = cat==='all' ? PRODUCTS : PRODUCTS.filter(p=>p.category===cat);
  if(filtered.length===0){ grid.innerHTML=`<p style="color:var(--text3);grid-column:1/-1;text-align:center;padding:2rem">${t('prod.empty')}</p>`; return; }
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
        <a href="contact.html" class="ask-btn">${t('prod.askBtn')}</a>
      </div>
    </div>`;
  }).join('');
}
function filterProds(cat, btn) {
  document.querySelectorAll('.cat-btn').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  PROD_CAT = cat;
  renderProducts(cat);
}

// ─── FAQ RENDER ───
function renderFaq(cat) {
  const list = document.getElementById('faqList');
  if(!list || typeof FAQS==='undefined') return;
  FAQ_CAT = cat;
  const L = CURRENT_LANG;
  const pick = (v) => (v && typeof v === 'object') ? (v[L] != null ? v[L] : v.el) : v;
  const filtered = cat==='all' ? FAQS : FAQS.filter(f=>f.cat===cat);
  list.innerHTML = filtered.map((f,i) => {
    const q = pick(f.q), a = pick(f.a), tip = pick(f.tip);
    return `
    <div class="faq-item" id="faq-${i}">
      <button class="faq-q" onclick="toggleFaq('faq-${i}')">
        <span>${q}</span><span class="arrow">▼</span>
      </button>
      <div class="faq-a">
        <p>${a}</p>
        ${tip?`<div class="fish-tip"><span>💡</span><span><strong>Tip:</strong> ${tip}</div>`:''}
      </div>
    </div>`;
  }).join('');
}
function toggleFaq(id){ document.getElementById(id).classList.toggle('open'); }
function filterFaq(cat, btn) {
  document.querySelectorAll('.faq-cat').forEach(b=>b.classList.remove('active'));
  if(btn) btn.classList.add('active');
  FAQ_CAT = cat;
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

// ─── HOME CATEGORY CARDS: staggered scroll-reveal ───
function initHomeCats() {
  const grid = document.getElementById('home-cats-grid');
  if(!grid) return;
  const reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion:reduce)').matches;
  // Reduced motion or no observer support: just show the cards, no animation.
  if(reduce || !('IntersectionObserver' in window)) { grid.classList.add('revealed'); return; }
  const obs = new IntersectionObserver((entries, o) => {
    entries.forEach(e => { if(e.isIntersecting){ grid.classList.add('revealed'); o.disconnect(); }});
  }, {threshold:0.12});
  // Fires immediately if the strip is already in view on load, otherwise on scroll-in.
  obs.observe(grid);
}

// ─── PAGE INIT (καλείται από κάθε σελίδα) ───
async function initPage(opts={}) {
  initNav();
  initLang();
  initBubbles();
  highlightToday();
  initFadeUp();
  initHomeCats();
  if(opts.faq) renderFaq('all');
  if(opts.contact) initContactForm();
  // Load remote data as needed
  const needProducts = opts.products || opts.hero;
  if(needProducts) PRODUCTS = await loadProductsData();
  if(opts.hero){ initHero(); initCategoryTiles(); initAboutVisual(); }
  if(opts.products){
    // Honour a ?cat= deep link from the homepage tiles: pre-select the matching
    // chip and show only that category, exactly as a chip click would.
    PROD_CAT = getUrlCat();
    renderProductCats();
    renderProducts(PROD_CAT);
  }
}
