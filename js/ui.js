/**
 * FreshBite - UI Module
 * Toast notifications, modals, dark mode, navbar, back-to-top, loaders
 */

const UI = {

  // ── TOAST NOTIFICATIONS ───────────────────────────

  toastContainer: null,

  initToasts() {
    if (!document.getElementById('toast-container')) {
      const container = document.createElement('div');
      container.id = 'toast-container';
      container.className = 'toast-container';
      document.body.appendChild(container);
    }
    this.toastContainer = document.getElementById('toast-container');
  },

  /**
   * Show a toast notification
   * @param {string} message
   * @param {'success'|'error'|'warning'|'info'} type
   * @param {number} duration ms
   */
  toast(message, type = 'success', duration = 3000) {
    if (!this.toastContainer) this.initToasts();

    const icons = {
      success: 'bi-check-circle-fill',
      error: 'bi-x-circle-fill',
      warning: 'bi-exclamation-triangle-fill',
      info: 'bi-info-circle-fill',
    };

    const toast = document.createElement('div');
    toast.className = `toast toast-${type} toast-enter`;
    toast.innerHTML = `
      <i class="bi ${icons[type]} toast-icon"></i>
      <span class="toast-message">${message}</span>
      <button class="toast-close" onclick="this.parentElement.remove()">
        <i class="bi bi-x"></i>
      </button>
    `;

    this.toastContainer.appendChild(toast);

    // Trigger animation
    requestAnimationFrame(() => toast.classList.remove('toast-enter'));

    const timer = setTimeout(() => {
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    }, duration);

    toast.querySelector('.toast-close').addEventListener('click', () => {
      clearTimeout(timer);
      toast.classList.add('toast-exit');
      setTimeout(() => toast.remove(), 300);
    });
  },

  // ── LOADING OVERLAY ───────────────────────────────

  showLoader() {
    let loader = document.getElementById('page-loader');
    if (!loader) {
      loader = document.createElement('div');
      loader.id = 'page-loader';
      loader.innerHTML = `
        <div class="loader-inner">
          <div class="loader-logo">
            <span class="loader-brand">Fresh<span>Bite</span></span>
          </div>
          <div class="loader-dots">
            <span></span><span></span><span></span>
          </div>
        </div>
      `;
      document.body.appendChild(loader);
    }
    loader.classList.add('active');
  },

  hideLoader() {
    const loader = document.getElementById('page-loader');
    if (loader) {
      loader.classList.add('fade-out');
      setTimeout(() => { loader.classList.remove('active', 'fade-out'); }, 400);
    }
  },

  // ── SKELETON LOADING ──────────────────────────────

  skeletonCard() {
    return `
      <div class="skeleton-card">
        <div class="skeleton skeleton-img"></div>
        <div class="skeleton-body">
          <div class="skeleton skeleton-title"></div>
          <div class="skeleton skeleton-text"></div>
          <div class="skeleton skeleton-text short"></div>
        </div>
      </div>
    `;
  },

  showSkeletons(container, count = 6) {
    if (!container) return;
    container.innerHTML = Array(count).fill(this.skeletonCard()).join('');
  },

  // ── MODAL ─────────────────────────────────────────

  openModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.add('modal-open');
    document.body.classList.add('modal-active');
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
      if (e.target === modal) this.closeModal(modalId);
    }, { once: true });
  },

  closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    modal.classList.remove('modal-open');
    document.body.classList.remove('modal-active');
  },

  closeAllModals() {
    document.querySelectorAll('.modal.modal-open').forEach(m => {
      m.classList.remove('modal-open');
    });
    document.body.classList.remove('modal-active');
  },

  // ── ENHANCED EMPTY STATE (C2) ─────────────────────
  /** Reusable premium empty-state markup */
  renderEmptyState({ icon, title, text, ctaText, ctaHref, ctaAction }) {
    const cta = ctaAction
      ? `<button class="btn-primary empty-state-cta" onclick="${ctaAction}">${ctaText || 'Go Back'} <i class="bi bi-arrow-right"></i></button>`
      : `<a href="${ctaHref || '#'}" class="btn-primary empty-state-cta">${ctaText || 'Explore'} <i class="bi bi-arrow-right"></i></a>`;
    return `
      <div class="empty-state" style="padding:70px 24px;text-align:center;">
        <div class="empty-icon" style="font-size:4rem;">${icon || '📦'}</div>
        <h3 style="margin:18px 0 8px;font-size:1.3rem;">${title || 'Nothing here yet'}</h3>
        <p style="color:var(--text-muted);font-size:0.9rem;max-width:340px;margin:0 auto 22px;">${text || ''}</p>
        ${cta}
      </div>`;
  },

  // ── DARK MODE ──

  initDarkMode() {
    const isDark = Storage.getDarkMode();
    if (isDark) {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    const toggle = document.getElementById('dark-mode-toggle');
    if (toggle) {
      toggle.checked = isDark;
      toggle.addEventListener('change', () => this.toggleDarkMode());
    }

    // Also handle icon-based toggles
    document.querySelectorAll('.dark-mode-btn').forEach(btn => {
      btn.addEventListener('click', () => this.toggleDarkMode());
      this.updateDarkIcon(btn, isDark);
    });
  },

  toggleDarkMode() {
    const isDark = document.documentElement.getAttribute('data-theme') === 'dark';
    const newVal = !isDark;
    document.documentElement.setAttribute('data-theme', newVal ? 'dark' : 'light');
    Storage.setDarkMode(newVal);

    // Update all toggle inputs
    const toggle = document.getElementById('dark-mode-toggle');
    if (toggle) toggle.checked = newVal;

    // Update icon buttons
    document.querySelectorAll('.dark-mode-btn').forEach(btn => this.updateDarkIcon(btn, newVal));
    UI.toast(newVal ? '🌙 Dark mode on' : '☀️ Light mode on', 'info', 1500);
  },

  updateDarkIcon(btn, isDark) {
    btn.innerHTML = isDark
      ? '<i class="bi bi-sun-fill"></i>'
      : '<i class="bi bi-moon-stars-fill"></i>';
  },

  // ── STICKY NAVBAR ─────────────────────────────────

  initNavbar() {
    const navbar = document.getElementById('navbar');
    if (!navbar) return;

    let lastScroll = 0;

    const handleScroll = Utils.throttle(() => {
      const currentScroll = window.scrollY;
      if (currentScroll > 80) {
        navbar.classList.add('navbar-scrolled');
      } else {
        navbar.classList.remove('navbar-scrolled');
      }
      // Auto-hide on scroll down, show on scroll up
      if (currentScroll > lastScroll && currentScroll > 200) {
        navbar.classList.add('navbar-hidden');
      } else {
        navbar.classList.remove('navbar-hidden');
      }
      lastScroll = currentScroll;
    }, 50);

    window.addEventListener('scroll', handleScroll, { passive: true });

    // Mobile menu toggle
    const menuBtn = document.getElementById('mobile-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (menuBtn && mobileMenu) {
      menuBtn.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
        menuBtn.classList.toggle('active');
        document.body.classList.toggle('menu-open');
      });
      // Close on nav link click
      mobileMenu.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
          mobileMenu.classList.remove('open');
          menuBtn.classList.remove('active');
          document.body.classList.remove('menu-open');
        });
      });
    }
  },

  // ── BACK TO TOP ───────────────────────────────────

  initBackToTop() {
    const btn = document.getElementById('back-to-top');
    if (!btn) return;

    window.addEventListener('scroll', Utils.throttle(() => {
      if (window.scrollY > 400) {
        btn.classList.add('visible');
      } else {
        btn.classList.remove('visible');
      }
    }, 100), { passive: true });

    btn.addEventListener('click', () => {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  },

  // ── FLOATING CART BADGE ───────────────────────────

updateCartBadge(count) {
    document.querySelectorAll('.cart-badge').forEach(badge => {
      badge.textContent = count;
      badge.style.display = count > 0 ? 'flex' : 'none';
    });
    // Animate badge pop
    document.querySelectorAll('.cart-icon-wrap').forEach(wrap => {
      wrap.classList.remove('cart-pop');
      void wrap.offsetWidth;
      if (count > 0) wrap.classList.add('cart-pop');
    });
    // Refresh hover mini-cart if open
    if (this._miniCart && this._miniCart.style.visibility === 'visible') this.renderMiniCart();
  },

  // ── HOVER MINI-CART POPUP (B6) ────────────────────

  initMiniCartPopup() {
    const cartWraps = document.querySelectorAll('.cart-icon-wrap');
    if (!cartWraps.length || this._miniCart) return;

    const popup = document.createElement('div');
    popup.className = 'mini-cart-popup';
    popup.id = 'mini-cart-popup';
    popup.setAttribute('aria-label', 'Mini cart preview');
    document.body.appendChild(popup);
    this._miniCart = popup;

    // Build popup content
    this.renderMiniCart();

    let hideTimer;
    const showPopup = (anchor) => {
      clearTimeout(hideTimer);
      const items = Cart.getItems();
      if (!items.length) return;
      this.renderMiniCart();
      const rect = anchor.getBoundingClientRect();
      popup.style.top = (rect.bottom + 8) + 'px';
      popup.style.left = (rect.left - 220) + 'px';
      popup.style.visibility = 'visible';
      popup.style.opacity = '1';
      popup.style.transform = 'translateY(0)';
    };
    const hidePopup = () => {
      hideTimer = setTimeout(() => {
        popup.style.visibility = 'hidden';
        popup.style.opacity = '0';
        popup.style.transform = 'translateY(-8px)';
      }, 200);
    };

    cartWraps.forEach(wrap => {
      wrap.addEventListener('mouseenter', () => showPopup(wrap));
      wrap.addEventListener('mouseleave', hidePopup);
    });
    popup.addEventListener('mouseenter', () => clearTimeout(hideTimer));
    popup.addEventListener('mouseleave', hidePopup);
  },

  renderMiniCart() {
    const popup = this._miniCart;
    if (!popup) return;
    const items = Cart.getItems();
    if (!items.length) {
      popup.innerHTML = `
        <div class="mini-cart-popup-empty">
          <i class="bi bi-bag" style="font-size:2rem;opacity:0.3;display:block;margin-bottom:6px;"></i>
          <p style="font-size:0.85rem;">Your cart is empty</p>
        </div>`;
      return;
    }
    popup.innerHTML = `
      <div class="mini-cart-popup-header">
        <strong>Your Order</strong>
        <a href="cart.html" style="color:var(--primary);font-size:0.78rem;font-weight:600;">View Cart</a>
      </div>
      <div class="mini-cart-popup-items">
        ${items.slice(0, 3).map(i => `
          <div class="mini-cart-popup-item">
            <img src="${i.image}" alt="${i.name}" loading="lazy">
            <div class="mini-cart-popup-info">
              <span class="mini-cart-popup-name">${i.name}</span>
              <span class="mini-cart-popup-qty">×${i.quantity}</span>
            </div>
            <strong>${Utils.formatPrice(i.price * i.quantity)}</strong>
          </div>`).join('')}
        ${items.length > 3 ? `<div class="mini-cart-popup-more">+${items.length - 3} more item(s)</div>` : ''}
      </div>
      <div class="mini-cart-popup-footer">
        <span>Subtotal</span>
        <strong>${Utils.formatPrice(Cart.getSubtotal())}</strong>
      </div>
      <a href="cart.html" class="btn-checkout" style="width:100%;justify-content:center;font-size:0.85rem;padding:11px;">
        Proceed to Checkout <i class="bi bi-arrow-right"></i>
      </a>`;
  },

  // ── SEARCH SUGGESTIONS ────────────────────────────

  initSearchSuggestions(inputId, suggestionItems, onSelect) {
    const input = document.getElementById(inputId);
    if (!input) return;

    const dropdown = document.createElement('div');
    dropdown.className = 'search-dropdown';
    input.parentElement.style.position = 'relative';
    input.parentElement.appendChild(dropdown);

    const render = Utils.debounce((val) => {
      if (!val.trim()) { dropdown.innerHTML = ''; dropdown.classList.remove('open'); return; }

      const matches = suggestionItems
        .filter(item => item.name.toLowerCase().includes(val.toLowerCase()))
        .slice(0, 6);

      if (!matches.length) { dropdown.innerHTML = ''; dropdown.classList.remove('open'); return; }

      dropdown.innerHTML = matches.map(item => `
        <div class="suggestion-item" data-id="${item.id}">
          <i class="bi bi-search"></i>
          <span>${item.name}</span>
          ${item.category ? `<small>${item.category}</small>` : ''}
        </div>
      `).join('');
      dropdown.classList.add('open');

      dropdown.querySelectorAll('.suggestion-item').forEach(el => {
        el.addEventListener('click', () => {
          const found = matches.find(m => m.id == el.dataset.id);
          if (found) { input.value = found.name; onSelect(found); }
          dropdown.innerHTML = '';
          dropdown.classList.remove('open');
        });
      });
    }, 200);

    input.addEventListener('input', (e) => render(e.target.value));
    document.addEventListener('click', (e) => {
      if (!input.parentElement.contains(e.target)) {
        dropdown.innerHTML = '';
        dropdown.classList.remove('open');
      }
    });
  },

  // ── SCROLL ANIMATIONS ─────────────────────────────

  initScrollAnimations() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('in-view');
          observer.unobserve(entry.target);
        }
      });
    }, { threshold: 0.10, rootMargin: '0px 0px -30px 0px' });

    document.querySelectorAll('.animate-on-scroll:not(.in-view)').forEach(el => observer.observe(el));
  },

  // ── COUNTER ANIMATION ─────────────────────────────

  initCounters() {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el = entry.target;
          const target = parseInt(el.dataset.target || el.textContent.replace(/\D/g, ''), 10);
          Utils.animateCounter(el, target);
          observer.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    document.querySelectorAll('.counter-animate').forEach(el => observer.observe(el));
  },

  // ── AUTH NAV STATE ────────────────────────────────

  updateAuthNav() {
    const user = Storage.getUser();
    const guestLinks = document.querySelectorAll('.nav-guest');
    const authLinks = document.querySelectorAll('.nav-auth');
    const userAvatars = document.querySelectorAll('.nav-user-name');

    guestLinks.forEach(el => el.style.display = user ? 'none' : '');
    authLinks.forEach(el => el.style.display = user ? 'flex' : 'none');
    userAvatars.forEach(el => { if (user) el.textContent = user.name.split(' ')[0]; });
  },

  // ── INITIALISE ALL ────────────────────────────────

init() {
    this.initToasts();
    this.initDarkMode();
    this.initNavbar();
    this.initBackToTop();
    this.initScrollAnimations();
    this.initCounters();
    this.updateAuthNav();
    // Hover mini-cart only on desktop/touch-capable pointers
    if (window.matchMedia('(hover: hover) and (pointer: fine)').matches) {
      this.initMiniCartPopup();
    }

    // Ripple on all .btn-primary, .btn-secondary
    document.querySelectorAll('.btn-primary, .btn-secondary, .btn-outline').forEach(btn => {
      Utils.addRipple(btn);
    });

    // Page loader hide on load
    window.addEventListener('load', () => this.hideLoader());

    // Keyboard ESC closes modals
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') this.closeAllModals();
    });
  },
};
