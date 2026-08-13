/**
 * FreshBite - Utility Functions
 * Pure helper functions used across the app
 */

const Utils = {

  // ── FORMAT ────────────────────────────────────────

  /** Format price as ₹XXX */
  formatPrice(amount) {
    return `₹${Number(amount).toLocaleString('en-IN')}`;
  },

  /** Format rating to 1 decimal */
  formatRating(rating) {
    return Number(rating).toFixed(1);
  },

  /** Render filled/half/empty stars */
  renderStars(rating, max = 5) {
    let html = '';
    for (let i = 1; i <= max; i++) {
      if (i <= Math.floor(rating)) html += '<i class="bi bi-star-fill star-filled"></i>';
      else if (i - 0.5 <= rating) html += '<i class="bi bi-star-half star-filled"></i>';
      else html += '<i class="bi bi-star star-empty"></i>';
    }
    return html;
  },

  /** Format a date string to readable format */
  formatDate(dateStr) {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateStr).toLocaleDateString('en-IN', options);
  },

  /** Relative time (e.g., "2 hours ago") */
  timeAgo(dateStr) {
    const diff = Date.now() - new Date(dateStr).getTime();
    const mins = Math.floor(diff / 60000);
    if (mins < 1) return 'Just now';
    if (mins < 60) return `${mins} min ago`;
    const hrs = Math.floor(mins / 60);
    if (hrs < 24) return `${hrs}hr ago`;
    const days = Math.floor(hrs / 24);
    return `${days}d ago`;
  },

  /** Format delivery time range */
  formatDelivery(time) {
    return `${time} mins`;
  },

  // ── GENERATE ──────────────────────────────────────

  /** Generate unique order ID */
  generateOrderId() {
    return 'FB' + Date.now().toString(36).toUpperCase() + Math.random().toString(36).slice(2, 5).toUpperCase();
  },

  /** Generate random avatar color from name */
  avatarColor(name = '') {
    const colors = ['#FF6B35','#6C5CE7','#00b894','#0984e3','#e17055','#fd79a8','#00cec9'];
    let hash = 0;
    for (const c of name) hash += c.charCodeAt(0);
    return colors[hash % colors.length];
  },

  /** Get initials from name */
  getInitials(name = '') {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  },

  // ── DOM ───────────────────────────────────────────

  /** Query selector shorthand */
  $(selector, context = document) {
    return context.querySelector(selector);
  },

  /** Query all shorthand */
  $$(selector, context = document) {
    return [...context.querySelectorAll(selector)];
  },

  /** Show element */
  show(el) {
    if (el) el.style.display = '';
  },

  /** Hide element */
  hide(el) {
    if (el) el.style.display = 'none';
  },

  /** Toggle class */
  toggleClass(el, cls) {
    if (el) el.classList.toggle(cls);
  },

  /** Smooth scroll to element */
  scrollTo(selector) {
    const el = document.querySelector(selector);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
  },

  /** Get URL param */
  getParam(name) {
    return new URLSearchParams(window.location.search).get(name);
  },

  /** Set URL param without reload */
  setParam(name, value) {
    const url = new URL(window.location.href);
    url.searchParams.set(name, value);
    history.replaceState(null, '', url.toString());
  },

  // ── VALIDATION ────────────────────────────────────

  isValidEmail(email) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  },

  isValidPhone(phone) {
    return /^[6-9]\d{9}$/.test(phone.replace(/\s/g, ''));
  },

  isValidPassword(pass) {
    return pass.length >= 6;
  },

  // ── DEBOUNCE / THROTTLE ───────────────────────────

  debounce(fn, delay = 300) {
    let timer;
    return (...args) => {
      clearTimeout(timer);
      timer = setTimeout(() => fn(...args), delay);
    };
  },

  throttle(fn, limit = 100) {
    let last = 0;
    return (...args) => {
      const now = Date.now();
      if (now - last >= limit) { last = now; fn(...args); }
    };
  },

  // ── MISC ──────────────────────────────────────────

  /** Clamp value between min and max */
  clamp(val, min, max) {
    return Math.min(Math.max(val, min), max);
  },

  /** Shuffle array */
  shuffle(arr) {
    return [...arr].sort(() => Math.random() - 0.5);
  },

  /** Unique array by key */
  uniqueBy(arr, key) {
    return arr.filter((item, idx, self) => idx === self.findIndex(t => t[key] === item[key]));
  },

  /** Capitalize first letter */
  capitalize(str) {
    return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
  },

  /** Truncate string */
  truncate(str, len = 80) {
    return str.length > len ? str.slice(0, len) + '…' : str;
  },

  /** Copy text to clipboard */
  async copyToClipboard(text) {
    try {
      await navigator.clipboard.writeText(text);
      return true;
    } catch {
      return false;
    }
  },

  /** Spice level label */
  spiceLabel(level) {
    const labels = ['No Spice', 'Mild', 'Medium', 'Hot', 'Extra Hot'];
    return labels[level] || 'Unknown';
  },

  /** Spice level HTML badges */
  spiceHTML(level) {
    if (!level) return '<span class="badge badge-no-spice">No Spice</span>';
    const chilis = '🌶️'.repeat(level);
    const labels = ['', 'Mild', 'Medium', 'Hot', 'Extra Hot'];
    return `<span class="badge badge-spice">${chilis} ${labels[level]}</span>`;
  },

  /** Veg/non-veg indicator */
  vegBadge(isVeg, isVegan) {
    if (isVegan) return '<span class="veg-indicator vegan" title="Vegan"><span class="dot"></span> Vegan</span>';
    if (isVeg) return '<span class="veg-indicator veg" title="Vegetarian"><span class="dot"></span></span>';
    return '<span class="veg-indicator nonveg" title="Non-Vegetarian"><span class="dot"></span></span>';
  },

  /** Rating badge color */
  ratingColor(rating) {
    if (rating >= 4.5) return '#2ECC71';
    if (rating >= 4.0) return '#27ae60';
    if (rating >= 3.5) return '#f39c12';
    return '#e74c3c';
  },

  /** Lazy load images via IntersectionObserver */
  initLazyLoad() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const img = entry.target;
          if (img.dataset.src) {
            img.src = img.dataset.src;
            img.classList.add('loaded');
            observer.unobserve(img);
          }
        }
      });
    }, { rootMargin: '100px' });

    document.querySelectorAll('img[data-src]').forEach(img => observer.observe(img));
  },

  /** Add ripple effect to button */
  addRipple(btn) {
    btn.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.classList.add('ripple');
      const rect = this.getBoundingClientRect();
      ripple.style.left = `${e.clientX - rect.left}px`;
      ripple.style.top = `${e.clientY - rect.top}px`;
      this.appendChild(ripple);
      setTimeout(() => ripple.remove(), 600);
    });
  },

  /** Animate counter from 0 to target */
  animateCounter(el, target, duration = 1500) {
    let start = 0;
    const step = (timestamp) => {
      if (!start) start = timestamp;
      const progress = Math.min((timestamp - start) / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.floor(eased * target).toLocaleString('en-IN');
      if (progress < 1) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  },
};
