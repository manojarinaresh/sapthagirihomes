/* ============================================================
   SapthagiriHomes.com – Main JavaScript
   ============================================================ */

/* ---- Property counts per city (update these when listings are added) ---- */
const cityCounts = {
  tirupathi:   0,
  renigunta:   0,
  chandragiri: 0
};

function updateCityCounts() {
  const total = cityCounts.tirupathi + cityCounts.renigunta + cityCounts.chandragiri;
  const fmt = n => n === 0 ? '0 Properties' : n + '+ Properties';

  const tpt  = document.getElementById('city-count-tirupathi');
  const ren  = document.getElementById('city-count-renigunta');
  const chan = document.getElementById('city-count-chandragiri');
  const tot  = document.getElementById('total-listings-count');

  if (tpt)  tpt.textContent  = fmt(cityCounts.tirupathi);
  if (ren)  ren.textContent  = fmt(cityCounts.renigunta);
  if (chan) chan.textContent  = fmt(cityCounts.chandragiri);
  if (tot)  tot.textContent  = total === 0 ? '0' : total + '+';
}
document.addEventListener('DOMContentLoaded', updateCityCounts);

/* ---- Navbar scroll effect ---- */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => {
  if (window.scrollY > 50) {
    navbar && navbar.classList.add('scrolled');
  } else {
    navbar && navbar.classList.remove('scrolled');
  }
  // Scroll-to-top visibility
  const scrollBtn = document.getElementById('scrollTop');
  if (scrollBtn) {
    if (window.scrollY > 400) {
      scrollBtn.classList.add('visible');
    } else {
      scrollBtn.classList.remove('visible');
    }
  }
});

/* ---- Mobile nav toggle ---- */
function toggleNav() {
  const links = document.getElementById('navLinks');
  const ham   = document.getElementById('hamburger');
  if (links) links.classList.toggle('open');
  if (ham)   ham.classList.toggle('active');
}

/* ---- Scroll to top ---- */
function scrollToTop() {
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

/* ---- Hero search tab switching ---- */
let currentTab = 'buy';
function switchTab(btn, tab) {
  currentTab = tab;
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');

  const budgetSel = document.getElementById('budgetSelect');
  if (!budgetSel) return;
  // Both buy and sell use property sale budget ranges
  budgetSel.innerHTML = `
    <option value="">Budget</option>
    <option>Under ₹20 Lakhs</option>
    <option>₹20L – ₹40L</option>
    <option>₹40L – ₹60L</option>
    <option>₹60L – ₹80L</option>
    <option>₹80L – ₹1 Cr</option>
    <option>₹1Cr – ₹2Cr</option>
    <option>Above ₹2 Cr</option>`;
}

/* ---- Hero search ---- */
function doSearch() {
  const city    = document.getElementById('citySelect')   ? document.getElementById('citySelect').value   : '';
  const keyword = document.getElementById('searchInput')  ? document.getElementById('searchInput').value  : '';
  const budget  = document.getElementById('budgetSelect') ? document.getElementById('budgetSelect').value : '';

  if (!city && !keyword) {
    showToast('Please select a city or enter a location to search.', 'error');
    return;
  }
  const params = new URLSearchParams();
  if (currentTab) params.set('type', currentTab);
  if (city)       params.set('city', city);
  if (keyword)    params.set('q', keyword);
  if (budget)     params.set('budget', budget);
  window.location.href = 'properties.html?' + params.toString();
}

/* ---- Property filter tabs (homepage) ---- */
function filterProps(btn, type) {
  document.querySelectorAll('.filter-tab').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.prop-card').forEach(card => {
    if (type === 'all' || card.dataset.type === type) {
      card.style.display = '';
      card.style.animation = 'fadeIn 0.35s ease';
    } else {
      card.style.display = 'none';
    }
  });
}

/* ---- How it works steps ---- */
function switchSteps(btn, id) {
  document.querySelectorAll('.step-tab').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.steps-container').forEach(c => c.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

/* ---- Testimonials (data-driven) ---- */
/* Add real customer reviews here — each object = one card.
   Leave the array empty and no reviews will be shown.
   Example entry:
   {
     initials: 'RK',
     color:    '#1a3c6e',
     name:     'Ravi Kumar',
     location: 'Bought in Tirupathi',
     stars:    5,
     text:     'Great experience finding a home here!'
   }
*/
const reviews = [
  // Add real reviews here
];

let currentSlide = 0;
let slideTimer   = null;

function buildStars(n) {
  let html = '';
  for (let i = 1; i <= 5; i++) {
    if (i <= n)           html += '<i class="fa fa-star"></i>';
    else if (i - n < 1)   html += '<i class="fa fa-star-half-alt"></i>';
    else                  html += '<i class="far fa-star"></i>';
  }
  return html;
}

function renderReviews() {
  const slider   = document.getElementById('testimonialsSlider');
  const controls = document.getElementById('sliderControls');
  const dotsEl   = document.getElementById('sliderDots');
  if (!slider) return;

  if (reviews.length === 0) {
    slider.innerHTML = '<p style="text-align:center;padding:3rem;color:#888;font-style:italic;">No reviews yet. Be the first to share your experience!</p>';
    if (controls) controls.style.display = 'none';
    return;
  }

  slider.innerHTML = reviews.map((r, i) => `
    <div class="testimony-card${i === 0 ? ' active' : ''}">
      <div class="stars">${buildStars(r.stars)}</div>
      <p>"${r.text}"</p>
      <div class="testimony-author">
        <div class="author-avatar" style="background:${r.color};">${r.initials}</div>
        <div>
          <strong>${r.name}</strong>
          <span>${r.location}</span>
        </div>
      </div>
    </div>`).join('');

  if (dotsEl) {
    dotsEl.innerHTML = reviews.map((_, i) =>
      `<span class="dot${i === 0 ? ' active' : ''}" onclick="goToSlide(${i})"></span>`
    ).join('');
  }

  if (controls) controls.style.display = reviews.length > 1 ? 'flex' : 'none';

  if (reviews.length > 1) {
    slideTimer = setInterval(nextSlide, 5000);
    slider.addEventListener('mouseenter', () => clearInterval(slideTimer));
    slider.addEventListener('mouseleave', () => { slideTimer = setInterval(nextSlide, 5000); });
  }
}

function updateSlider() {
  const cards = document.querySelectorAll('.testimony-card');
  const dots  = document.querySelectorAll('#sliderDots .dot');
  cards.forEach((s, i) => s.classList.toggle('active', i === currentSlide));
  dots.forEach((d, i)  => d.classList.toggle('active', i === currentSlide));
}
function nextSlide() {
  const cards = document.querySelectorAll('.testimony-card');
  currentSlide = (currentSlide + 1) % cards.length;
  updateSlider();
}
function prevSlide() {
  const cards = document.querySelectorAll('.testimony-card');
  currentSlide = (currentSlide - 1 + cards.length) % cards.length;
  updateSlider();
}
function goToSlide(idx) {
  currentSlide = idx;
  updateSlider();
}

document.addEventListener('DOMContentLoaded', renderReviews);

/* ---- EMI Calculator ---- */
function calcEMI() {
  const P = parseFloat(document.getElementById('loanAmt')      ?.value || 5000000);
  const r = parseFloat(document.getElementById('interestRate') ?.value || 8.5) / 12 / 100;
  const n = parseFloat(document.getElementById('tenureYrs')    ?.value || 20) * 12;

  const emi   = P * r * Math.pow(1 + r, n) / (Math.pow(1 + r, n) - 1);
  const total = emi * n;
  const interest = total - P;

  const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = formatINR(val); };
  const setRaw = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };

  set('emiResult', Math.round(emi));
  set('principalDisp', P);
  set('interestDisp', Math.round(interest));
  set('totalDisp', Math.round(total));

  const lv = document.getElementById('loanAmtVal');
  const rv = document.getElementById('rateVal');
  const tv = document.getElementById('tenureVal');
  if (lv) lv.textContent = formatINR(P);
  if (rv) rv.textContent = document.getElementById('interestRate')?.value;
  if (tv) tv.textContent = document.getElementById('tenureYrs')?.value;
}

function formatINR(num) {
  const n = Math.round(num);
  if (n >= 10000000) return (n / 10000000).toFixed(2).replace(/\.?0+$/, '') + ' Cr';
  if (n >= 100000)   return (n / 100000).toFixed(2).replace(/\.?0+$/, '') + ' L';
  if (n >= 1000)     return (n / 1000).toFixed(1).replace(/\.?0+$/, '') + 'K';
  return n.toLocaleString('en-IN');
}

function formatINRFull(num) {
  return Math.round(num).toLocaleString('en-IN');
}

/* ---- Stats counter animation ---- */
function animateCounter(el) {
  const target = parseInt(el.dataset.target, 10);
  const duration = 2000;
  const step = target / (duration / 16);
  let current = 0;
  const timer = setInterval(() => {
    current += step;
    if (current >= target) {
      current = target;
      clearInterval(timer);
    }
    el.textContent = Math.floor(current).toLocaleString('en-IN') + '+';
  }, 16);
}

const observerOptions = { threshold: 0.3, rootMargin: '0px 0px -50px 0px' };
const counterObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      animateCounter(entry.target);
      counterObserver.unobserve(entry.target);
    }
  });
}, observerOptions);
document.querySelectorAll('.counter').forEach(el => counterObserver.observe(el));

/* ---- Scroll reveal animations ---- */
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity   = '1';
      entry.target.style.transform = 'translateY(0)';
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.1 });

document.querySelectorAll('.prop-card, .service-card, .step-item, .why-card, .type-card, .city-card').forEach(el => {
  el.style.opacity   = '0';
  el.style.transform = 'translateY(30px)';
  el.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
  revealObserver.observe(el);
});

/* ---- Wishlist / Heart toggle ---- */
function toggleWishlist(btn) {
  const icon = btn.querySelector('i');
  if (!icon) return;
  if (icon.classList.contains('fa-regular')) {
    icon.classList.replace('fa-regular', 'fa-solid');
    btn.classList.add('active');
    showToast('<i class="fa fa-heart"></i> Property saved to wishlist!', 'success');
  } else {
    icon.classList.replace('fa-solid', 'fa-regular');
    btn.classList.remove('active');
    showToast('Removed from wishlist.', '');
  }
}

/* ---- Modal functions ---- */
function openModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.add('open');
  document.body.style.overflow = 'hidden';
}
function closeModal(id) {
  const el = document.getElementById(id);
  if (el) el.classList.remove('open');
  document.body.style.overflow = '';
}
function closeModalOutside(event, id) {
  if (event.target.classList.contains('modal-overlay')) closeModal(id);
}

/* Modal tabs */
function switchModalTab(btn, id) {
  btn.closest('.modal').querySelectorAll('.modal-tab').forEach(t => t.classList.remove('active'));
  btn.closest('.modal').querySelectorAll('.modal-body').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  const el = document.getElementById(id);
  if (el) el.classList.add('active');
}

/* ---- Login / Register handlers ---- */
function handleLogin(e) {
  e.preventDefault();
  showToast('<i class="fa fa-check-circle"></i> Login successful! Welcome back.', 'success');
  closeModal('login-modal');
}
function handleRegister(e) {
  e.preventDefault();
  showToast('<i class="fa fa-check-circle"></i> Registration successful! Welcome to SapthagiriHomes.', 'success');
  closeModal('login-modal');
}

/* ---- Newsletter ---- */
function subscribeNewsletter(e) {
  e.preventDefault();
  const input = e.target.querySelector('input[type="email"]');
  if (input) {
    showToast('<i class="fa fa-paper-plane"></i> You have successfully subscribed to our newsletter!', 'success');
    input.value = '';
  }
}

/* ---- Toast notification ---- */
let toastTimer;
function showToast(msg, type = '') {
  let toast = document.querySelector('.toast');
  if (!toast) {
    toast = document.createElement('div');
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.innerHTML = msg;
  toast.className = 'toast' + (type ? ' ' + type : '');
  clearTimeout(toastTimer);
  setTimeout(() => toast.classList.add('show'), 10);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 4000);
}

/* ---- Properties page: Filter chips ---- */
document.querySelectorAll('.filter-chip').forEach(chip => {
  chip.addEventListener('click', function() {
    const group = this.closest('.filter-chips');
    if (group) {
      group.querySelectorAll('.filter-chip').forEach(c => c.classList.remove('active'));
    }
    this.classList.toggle('active');
  });
});

/* ---- Properties page: view toggle ---- */
document.querySelectorAll('.view-btn').forEach(btn => {
  btn.addEventListener('click', function() {
    document.querySelectorAll('.view-btn').forEach(b => b.classList.remove('active'));
    this.classList.add('active');
    const grid = document.getElementById('propsListGrid');
    if (!grid) return;
    if (this.dataset.view === 'list') {
      grid.classList.add('list-view');
    } else {
      grid.classList.remove('list-view');
    }
  });
});

/* ---- Post Property: step navigation ---- */
let currentPostStep = 1;
const totalPostSteps = 4;

function nextPostStep() {
  const currentForm = document.querySelector(`.post-form-step[data-step="${currentPostStep}"]`);
  if (currentForm && !validateStep(currentForm)) return;
  if (currentPostStep < totalPostSteps) {
    goToPostStep(currentPostStep + 1);
  }
}
function prevPostStep() {
  if (currentPostStep > 1) goToPostStep(currentPostStep - 1);
}
function goToPostStep(step) {
  document.querySelectorAll('.post-form-step').forEach(s => s.classList.remove('active'));
  document.querySelectorAll('.post-step').forEach((s, i) => {
    s.classList.remove('active', 'completed');
    if (i + 1 < step)  s.classList.add('completed');
    if (i + 1 === step) s.classList.add('active');
  });
  const target = document.querySelector(`.post-form-step[data-step="${step}"]`);
  if (target) target.classList.add('active');
  currentPostStep = step;
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

function validateStep(form) {
  const required = form.querySelectorAll('[required]');
  let valid = true;
  required.forEach(el => {
    if (!el.value.trim()) {
      el.style.borderColor = 'var(--danger)';
      valid = false;
    } else {
      el.style.borderColor = '';
    }
  });
  if (!valid) showToast('<i class="fa fa-exclamation-circle"></i> Please fill in all required fields.', 'error');
  return valid;
}

/* ---- Post Property: amenity toggle ---- */
document.querySelectorAll('.amenity-item').forEach(item => {
  item.addEventListener('click', function() {
    this.classList.toggle('selected');
  });
});

/* ---- Post Property: upload drag & drop ---- */
document.querySelectorAll('.upload-area').forEach(area => {
  area.addEventListener('dragover', e => {
    e.preventDefault();
    area.style.borderColor = 'var(--primary)';
    area.style.background = 'rgba(26,60,110,0.05)';
  });
  area.addEventListener('dragleave', () => {
    area.style.borderColor = '';
    area.style.background = '';
  });
  area.addEventListener('drop', e => {
    e.preventDefault();
    area.style.borderColor = '';
    area.style.background = '';
    const files = e.dataTransfer.files;
    if (files.length) {
      showToast(`<i class="fa fa-check-circle"></i> ${files.length} file(s) selected for upload.`, 'success');
    }
  });
  area.addEventListener('click', () => {
    const input = document.createElement('input');
    input.type = 'file';
    input.multiple = true;
    input.accept = 'image/*';
    input.onchange = () => {
      if (input.files.length) {
        showToast(`<i class="fa fa-check-circle"></i> ${input.files.length} photo(s) selected.`, 'success');
      }
    };
    input.click();
  });
});

/* ---- Contact form ---- */
const contactForm = document.getElementById('contactForm');
if (contactForm) {
  contactForm.addEventListener('submit', function(e) {
    e.preventDefault();
    showToast('<i class="fa fa-check-circle"></i> Message sent! We\'ll get back to you within 24 hours.', 'success');
    this.reset();
  });
}

/* ---- Smooth scroll for anchor links ---- */
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      e.preventDefault();
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

/* ---- Close mobile nav on outside click ---- */
document.addEventListener('click', function(e) {
  const navLinks = document.getElementById('navLinks');
  const hamburger = document.getElementById('hamburger');
  if (navLinks && navLinks.classList.contains('open')) {
    if (!navLinks.contains(e.target) && !hamburger.contains(e.target)) {
      navLinks.classList.remove('open');
      hamburger.classList.remove('active');
    }
  }
});

/* ---- Keyboard accessibility: close modals with Escape ---- */
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') {
    document.querySelectorAll('.modal-overlay.open').forEach(modal => {
      closeModal(modal.id);
    });
    const navLinks = document.getElementById('navLinks');
    if (navLinks && navLinks.classList.contains('open')) {
      navLinks.classList.remove('open');
      document.getElementById('hamburger')?.classList.remove('active');
    }
  }
});

/* ---- Init on DOM ready ---- */
document.addEventListener('DOMContentLoaded', function() {
  calcEMI();
  updateSlider();

  // URL param-based filters on properties page
  const params = new URLSearchParams(window.location.search);
  const typeParam = params.get('type');
  const cityParam = params.get('city');

  if (typeParam) {
    const tabMap = { buy: 0, rent: 1, pg: 2, commercial: 3, new: 4 };
    const tabIdx = tabMap[typeParam] ?? 0;
    const tabs = document.querySelectorAll('.filter-chip[data-filter-type]');
    if (tabs[tabIdx]) tabs[tabIdx].click();
  }
  if (cityParam) {
    const cityEl = document.getElementById('pageCity');
    if (cityEl) cityEl.textContent = cityParam;
  }

  // Animate hero text
  const heroH1 = document.querySelector('.hero-content h1');
  if (heroH1) {
    heroH1.style.animation = 'slideUp 0.7s ease forwards';
  }
});
