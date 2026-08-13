/**
 * FreshBite - Main App Entry Point
 * Initialises the correct module based on current page
 */

document.addEventListener('DOMContentLoaded', () => {

  // Always run global UI init
  UI.init();
  Cart.syncBadge();

  // Detect current page
  const page = window.location.pathname.split('/').pop() || 'index.html';

  // ── HOME PAGE ─────────────────────────────────────
  if (page === 'index.html' || page === '') {
    initHomePage();
  }

  // ── RESTAURANT LISTING ────────────────────────────
  else if (page === 'restaurants.html') {
    RestaurantModule.initListingPage();
  }

  // ── RESTAURANT DETAIL ─────────────────────────────
  else if (page === 'restaurant.html') {
    RestaurantModule.initDetailPage();
  }

  // ── PRODUCT DETAIL ────────────────────────────────
  else if (page === 'product.html') {
    Products.initProductPage();
  }

  // ── CART ──────────────────────────────────────────
  else if (page === 'cart.html') {
    Cart.renderCartPage();
    Cart.initCouponInput();
    initCartPageExtras();
  }

  // ── CHECKOUT ──────────────────────────────────────
  else if (page === 'checkout.html') {
    if (!Auth.requireAuth()) return;
    Checkout.init();
  }

  // ── PROFILE / DASHBOARD ───────────────────────────
  else if (page === 'profile.html') {
    if (!Auth.requireAuth()) return;
    initProfilePage();
  }

  // ── LOGIN ─────────────────────────────────────────
  else if (page === 'login.html') {
    Auth.initLoginPage();
  }

  // ── REGISTER ──────────────────────────────────────
  else if (page === 'register.html') {
    Auth.initRegisterPage();
  }

  // ── ABOUT ─────────────────────────────────────────
  else if (page === 'about.html') {
    initAboutPage();
  }

  // ── CONTACT ───────────────────────────────────────
  else if (page === 'contact.html') {
    initContactPage();
  }

// Lazy load all images on every page
  Utils.initLazyLoad();

  // Mobile floating cart bar
  initFloatingCart();
});

// ====================================================
// MOBILE FLOATING CART BAR
// Shows a floating "View Cart" pill on mobile when the
// cart has items — improves checkout conversion on small screens
// ====================================================
function initFloatingCart() {
  // Only show on mobile (max 768px)
  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  if (!isMobile) return;

  // Hide on cart & checkout pages (cart page already shows the cart)
  const page = window.location.pathname.split('/').pop() || 'index.html';
  if (page === 'cart.html' || page === 'checkout.html') return;

  let bar = document.getElementById('mobile-cart-bar');
  if (!bar) {
    bar = document.createElement('a');
    bar.id = 'mobile-cart-bar';
    bar.className = 'floating-cart-mobile';
    bar.href = 'cart.html';
    bar.setAttribute('aria-label', 'View cart');
    document.body.appendChild(bar);
  }

  const updateBar = () => {
    const count = Cart.getCount();
    const subtotal = Cart.getSubtotal();
    const hasItems = count > 0;
    bar.style.display = hasItems ? 'flex' : 'none';
    if (hasItems) {
      bar.innerHTML = `
        <i class="bi bi-bag-fill" style="font-size:1.2rem;"></i>
        <span>View Cart</span>
        <span style="background:rgba(255,255,255,0.25);border-radius:var(--radius-full);padding:2px 10px;font-size:0.85rem;">${count} item${count > 1 ? 's' : ''}</span>
        <strong style="margin-left:auto;">${Utils.formatPrice(subtotal)}</strong>
      `;
    }
  };

  // Initial render
  updateBar();

  // Hook into cart badge sync so it stays in sync
  const origSync = Cart.syncBadge.bind(Cart);
  Cart.syncBadge = function() {
    origSync();
    updateBar();
  };
}

// ====================================================
// HOME PAGE INIT
// ====================================================
function initHomePage() {
  renderHeroBanner();
  renderCategorySlider();
  renderFeaturedRestaurants();
  renderPopularFoods();
  renderTodaySpecials();
  renderOfferBanners();
  renderTestimonials();
  renderRecentlyViewed();
  renderFavRestaurants();
  initHeroSearch();
  initFlashSaleCountdown();
}

// ── RECENTLY VIEWED (B4) ───────────────────────────
function renderRecentlyViewed() {
  const container = document.getElementById('recently-viewed');
  if (!container) return;
const recentlyIds = Storage.getRecentlyViewed();
  const items = recentlyIds.map(id => FOODS.find(f => f.id === id)).filter(Boolean);
  const section = container.closest('.section');
  if (!items.length || items.length < 1) {
    if (section) section.style.display = 'none';
    return;
  }
  if (section) section.style.removeProperty('display');
  container.innerHTML = items.slice(0, 4).map(f => RestaurantModule.renderFoodCard(f)).join('');
  Cart.initAddToCartButtons();
  setTimeout(() => UI.initScrollAnimations(), 80);
}

// ── FAVOURITE RESTAURANTS (B5) ─────────────────────
function renderFavRestaurants() {
  const container = document.getElementById('fav-restaurants');
  if (!container) return;
const favIds = Storage.getFavoriteRestaurants();
  const favs = RESTAURANTS.filter(r => favIds.includes(r.id));
  const section = container.closest('.section');
  if (!favs.length) {
    if (section) section.style.display = 'none';
    return;
  }
  if (section) section.style.removeProperty('display');
  container.innerHTML = favs.map(r => RestaurantModule.renderCard(r)).join('');
  setTimeout(() => UI.initScrollAnimations(), 80);
}

function renderHeroBanner() {
  const heroSlider = document.getElementById('hero-slider');
  if (!heroSlider) return;

  let currentSlide = 0;
  const slides = BANNER_OFFERS;

  heroSlider.innerHTML = slides.map((slide, i) => `
    <div class="hero-slide ${i === 0 ? 'active' : ''}" style="background:${slide.gradient}">
      <div class="hero-slide-content">
        <span class="hero-badge animate-on-scroll">🔥 Limited Time Offer</span>
        <h1 class="hero-title animate-on-scroll">${slide.title}</h1>
        <p class="hero-subtitle animate-on-scroll">${slide.subtitle}</p>
        <p class="hero-desc animate-on-scroll">${slide.description}</p>
        <div class="hero-cta animate-on-scroll">
          <a href="restaurants.html" class="btn-primary btn-hero">${slide.cta} <i class="bi bi-arrow-right"></i></a>
          ${slide.code ? `<button class="btn-copy-code" onclick="Utils.copyToClipboard('${slide.code}').then(()=>UI.toast('Code ${slide.code} copied!','success'))">
            <i class="bi bi-clipboard"></i> ${slide.code}</button>` : ''}
        </div>
      </div>
      <div class="hero-slide-img">
        <img src="${slide.image}" alt="${slide.title}" loading="eager" class="hero-food-img">
        <div class="hero-float-card">
          <span class="float-emoji">🛵</span>
          <div><strong>Fast Delivery</strong><br><small>In 25–40 min</small></div>
        </div>
      </div>
    </div>
  `).join('');

  // Dots
  const dotsEl = document.getElementById('hero-dots');
  if (dotsEl) {
    dotsEl.innerHTML = slides.map((_, i) => `<button class="hero-dot ${i === 0 ? 'active' : ''}" data-idx="${i}"></button>`).join('');
    dotsEl.querySelectorAll('.hero-dot').forEach(dot => {
      dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.idx)));
    });
  }

  function goToSlide(idx) {
    heroSlider.querySelectorAll('.hero-slide').forEach((s, i) => s.classList.toggle('active', i === idx));
    dotsEl?.querySelectorAll('.hero-dot').forEach((d, i) => d.classList.toggle('active', i === idx));
    currentSlide = idx;
  }

  // Auto-advance
  const autoPlay = setInterval(() => goToSlide((currentSlide + 1) % slides.length), 5000);

  document.getElementById('hero-prev')?.addEventListener('click', () => {
    clearInterval(autoPlay);
    goToSlide((currentSlide - 1 + slides.length) % slides.length);
  });
  document.getElementById('hero-next')?.addEventListener('click', () => {
    clearInterval(autoPlay);
    goToSlide((currentSlide + 1) % slides.length);
  });
}

function initHeroSearch() {
  const form = document.getElementById('hero-search-form');
  const input = document.getElementById('hero-search-input');
  if (!form || !input) return;

  UI.initSearchSuggestions('hero-search-input',
    [...FOODS.map(f => ({ id: f.id, name: f.name, category: f.category, type: 'food' })),
     ...RESTAURANTS.map(r => ({ id: r.id, name: r.name, category: r.cuisine.join(', '), type: 'restaurant' }))],
    (item) => {
      if (item.type === 'restaurant') window.location.href = `restaurant.html?id=${item.id}`;
      else window.location.href = `product.html?id=${item.id}`;
    }
  );

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const q = input.value.trim();
    if (q) window.location.href = `restaurants.html?search=${encodeURIComponent(q)}`;
  });
}

function renderCategorySlider() {
  const container = document.getElementById('category-slider');
  if (!container) return;
  container.innerHTML = CATEGORIES.map(cat => `
    <a href="restaurants.html?cuisine=${encodeURIComponent(cat.name)}" class="category-card animate-on-scroll">
      <div class="category-img-wrap">
        <img src="${cat.image}" alt="${cat.name}" loading="lazy">
        <div class="category-overlay"></div>
      </div>
      <span class="category-icon">${cat.icon}</span>
      <span class="category-name">${cat.name}</span>
      <span class="category-count">${cat.count}+ places</span>
    </a>
  `).join('');
}

function renderFeaturedRestaurants() {
  const container = document.getElementById('featured-restaurants');
  if (!container) return;
  const featured = RESTAURANTS.filter(r => r.isFeatured).slice(0, 4);
  container.innerHTML = featured.map(r => RestaurantModule.renderCard(r)).join('');
  setTimeout(() => UI.initScrollAnimations(), 80);
}

function renderPopularFoods() {
  const container = document.getElementById('popular-foods');
  if (!container) return;
  const popular = Utils.shuffle(FOODS.filter(f => f.isBestSeller)).slice(0, 8);
  container.innerHTML = (popular.length ? popular : FOODS.slice(0, 8)).map(f => RestaurantModule.renderFoodCard(f)).join('');
  Cart.initAddToCartButtons();
  setTimeout(() => UI.initScrollAnimations(), 80);
}

function renderTodaySpecials() {
  const container = document.getElementById('today-specials');
  if (!container) return;
  const specials = FOODS.filter(f => f.isChefSpecial).slice(0, 4);
  if (!specials.length) return;
  container.innerHTML = specials.map(food => `
    <div class="special-card animate-on-scroll">
      <a href="product.html?id=${food.id}" class="special-card-img-link">
        <div style="position:relative;overflow:hidden;">
          <img src="${food.image}" alt="${food.name}" loading="lazy" class="special-card-img">
          <div class="special-label"><i class="bi bi-fire"></i> Today's Special</div>
        </div>
      </a>
      <div class="special-card-body">
        ${Utils.vegBadge(food.isVeg, food.isVegan)}
        <a href="product.html?id=${food.id}"><h4>${food.name}</h4></a>
        <p>${Utils.truncate(food.description, 65)}</p>
        <div class="special-footer">
          <span class="food-price">${Utils.formatPrice(food.price)}</span>
          <button class="btn-add-to-cart add-to-cart-btn" data-food-id="${food.id}">
            <i class="bi bi-plus"></i> Add
          </button>
        </div>
      </div>
    </div>
  `).join('');
  Cart.initAddToCartButtons();
  setTimeout(() => UI.initScrollAnimations(), 80);
}

function renderOfferBanners() {
  const container = document.getElementById('offers-container');
  if (!container) return;
  const activeOffers = OFFERS.filter(o => o.isActive).slice(0, 3);
  container.innerHTML = activeOffers.map(offer => `
    <div class="offer-banner-card animate-on-scroll">
      <div class="offer-banner-left">
        <span class="offer-big-text">${offer.type === 'percent' ? offer.discount + '% OFF' : offer.type === 'flat' ? '₹' + offer.discount + ' OFF' : 'FREE DELIVERY'}</span>
        <p>${offer.description}</p>
        <p class="offer-min">Min. order ${Utils.formatPrice(offer.minOrder)}</p>
      </div>
      <div class="offer-banner-right">
        <span class="offer-code-badge">${offer.code}</span>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          <button class="btn-copy-offer" onclick="Utils.copyToClipboard('${offer.code}').then(()=>UI.toast('Code ${offer.code} copied! 📋','success'))">
            <i class="bi bi-clipboard"></i> Copy
          </button>
          <a href="restaurants.html" class="btn-use-offer">Use Now</a>
        </div>
      </div>
    </div>
  `).join('');
  setTimeout(() => UI.initScrollAnimations(), 80);
}

function renderTestimonials() {
  const container = document.getElementById('testimonials-slider');
  if (!container) return;
  container.innerHTML = TESTIMONIALS.map(t => `
    <div class="testimonial-card animate-on-scroll">
      <div class="testimonial-stars">${Utils.renderStars(t.rating)}</div>
      <p class="testimonial-text">"${t.text}"</p>
      <div class="testimonial-author">
        <img src="${t.avatar}" alt="${t.name}" loading="lazy" class="testimonial-avatar">
        <div>
          <strong>${t.name}</strong>
          <span>${t.role} · ${t.city}</span>
        </div>
      </div>
    </div>
  `).join('');
}

function initFlashSaleCountdown() {
  const timerEl = document.getElementById('flash-sale-timer');
  if (!timerEl) return;
  // Set sale end to next midnight
  const endTime = new Date();
  endTime.setHours(23, 59, 59, 0);

  const update = () => {
    const diff = endTime - Date.now();
    if (diff <= 0) { timerEl.textContent = 'Sale Ended'; return; }
    const h = Math.floor(diff / 3600000);
    const m = Math.floor((diff % 3600000) / 60000);
    const s = Math.floor((diff % 60000) / 1000);
    timerEl.innerHTML = `
      <span class="timer-unit"><span class="timer-num">${String(h).padStart(2,'0')}</span><span class="timer-label">hrs</span></span>
      <span class="timer-sep">:</span>
      <span class="timer-unit"><span class="timer-num">${String(m).padStart(2,'0')}</span><span class="timer-label">min</span></span>
      <span class="timer-sep">:</span>
      <span class="timer-unit"><span class="timer-num">${String(s).padStart(2,'0')}</span><span class="timer-label">sec</span></span>
    `;
  };
  update();
  setInterval(update, 1000);
}

// ====================================================
// CART PAGE EXTRAS
// ====================================================
function initCartPageExtras() {
  // Continue shopping
  document.getElementById('continue-shopping-btn')?.addEventListener('click', () => {
    window.location.href = 'restaurants.html';
  });
  // Checkout button
  document.getElementById('checkout-btn')?.addEventListener('click', () => {
    if (!Storage.getUser()) { window.location.href = 'login.html?redirect=checkout.html'; return; }
    window.location.href = 'checkout.html';
  });
  // Clear cart button
  document.getElementById('clear-cart-btn')?.addEventListener('click', () => {
    if (Cart.clear(true)) { Cart.renderCartPage(); UI.toast('Cart cleared', 'info'); }
  });

  updateFreeDeliveryBar();
}

// ── FREE DELIVERY PROGRESS BAR (B7) ────────────────
function updateFreeDeliveryBar() {
  const fill = document.getElementById('free-delivery-fill');
  const marker = document.getElementById('free-delivery-marker');
  const msg = document.getElementById('delivery-strip-msg');
  if (!fill) return;

  const subtotal = Cart.getSubtotal();
  const threshold = Cart.FREE_DELIVERY_THRESHOLD;
  const remaining = threshold - subtotal;
  const pct = Math.min(100, Math.round(subtotal / threshold * 100));

  // Animate fill width
  requestAnimationFrame(() => { fill.style.width = pct + '%'; });

  if (remaining <= 0) {
    if (msg) msg.innerHTML = '🎉 You have <strong>FREE delivery</strong> on this order!';
    fill.classList.add('complete');
    if (marker) marker.style.left = '100%';
  } else {
    fill.classList.remove('complete');
    if (msg) msg.innerHTML = `You're <strong>₹${remaining}</strong> away from FREE delivery! 🛵`;
    if (marker) marker.style.left = pct + '%';
  }
}

// ====================================================
// PROFILE PAGE INIT
// ====================================================
function initProfilePage() {
  const user = Storage.getUser();
  if (!user) return;

  // Populate profile info
  const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
  setEl('profile-name', user.name);
  setEl('profile-email', user.email);
  setEl('profile-phone', user.phone || 'Not set');
  setEl('profile-join', 'Member since ' + Utils.formatDate(user.joinDate || new Date().toISOString()));

  const avatarEl = document.getElementById('profile-avatar');
  if (avatarEl) {
    avatarEl.style.background = Utils.avatarColor(user.name);
    avatarEl.textContent = Utils.getInitials(user.name);
  }

// Pre-fill edit profile fields on load (reuse the `user` from above)
  if (user) {
    const editEmail = document.getElementById('edit-email');
    const editName = document.getElementById('edit-name');
    const editPhone = document.getElementById('edit-phone');
    if (editEmail) editEmail.value = user.email;
    if (editName) editName.value = user.name;
    if (editPhone) editPhone.value = user.phone || '';
  }

  // Tab switching
  document.querySelectorAll('.profile-tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.profile-tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.profile-tab-panel').forEach(p => p.classList.remove('active'));
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + btn.dataset.tab);
      if (panel) panel.classList.add('active');
    });
  });

  // Active tab from URL param
  const tab = Utils.getParam('tab');
  if (tab) document.querySelector(`[data-tab="${tab}"]`)?.click();

  // Render orders
  renderOrderHistory();
  // Render wishlist
  renderWishlistTab();
  // Render addresses
  renderAddressesTab();

  // Edit profile form
  document.getElementById('edit-profile-form')?.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('edit-name').value.trim();
    const phone = document.getElementById('edit-phone').value.trim();
    if (!name) { UI.toast('Name cannot be empty.', 'error'); return; }
    const result = Auth.updateProfile({ name, phone });
    if (result.success) {
      setEl('profile-name', result.user.name);
      UI.toast('Profile updated successfully!', 'success');
    }
  });

  // Logout
  document.getElementById('logout-btn')?.addEventListener('click', () => Auth.logout());
  document.getElementById('logout-btn-settings')?.addEventListener('click', () => Auth.logout());
}

function renderOrderHistory() {
  const container = document.getElementById('tab-orders');
  if (!container) return;
const orders = Storage.getOrders();
  if (!orders.length) {
    container.innerHTML = UI.renderEmptyState({
      icon: '📦',
      title: 'No orders yet',
      text: 'Your order history will appear here once you place your first order.',
      ctaText: 'Start Ordering',
      ctaHref: 'restaurants.html',
    });
    return;
  }
container.innerHTML = orders.map(order => {
    const canCancel = ['confirmed', 'preparing'].includes(order.status);
    return `
    <div class="order-card" data-order-id="${order.id}">
      <div class="order-card-header">
        <div class="order-restaurant">
          ${order.restaurant?.logo ? `<img src="${order.restaurant.logo}" alt="" class="order-rest-logo">` : ''}
          <div>
            <strong>${order.restaurant?.name || 'Restaurant'}</strong>
            <span class="order-date">${Utils.formatDate(order.date)}</span>
          </div>
        </div>
        <span class="order-status-badge status-${order.status}">${OrderStatusLabel(order.status)}</span>
      </div>
      <div class="order-items-list">
        ${order.items?.slice(0, 3).map(i => `<span>${i.name} ×${i.quantity}</span>`).join('<span class="separator">·</span>')}
        ${order.items?.length > 3 ? `<span>+${order.items.length - 3} more</span>` : ''}
      </div>
      <div class="order-card-footer">
        <span class="order-total">${Utils.formatPrice(order.total)}</span>
        <span class="order-id">Order #${order.id}</span>
        <div style="display:flex;gap:8px;flex-wrap:wrap;">
          ${canCancel ? `<button class="btn-reorder btn-cancel-order" onclick="cancelOrder('${order.id}')">
            <i class="bi bi-x-circle"></i> Cancel
          </button>` : ''}
<button class="btn-reorder" onclick="reorder('${order.id}')">
            <i class="bi bi-arrow-repeat"></i> Reorder
          </button>
        </div>
      </div>
      <div class="order-timeline">
        ${order.timeline.map(t => `
          <div class="timeline-step ${t.done ? 'done' : ''}">
            <div class="timeline-dot"></div>
            <span>${t.label}</span>
          </div>`).join('')}
      </div>
    </div>
  `;
  }).join('');

  // Auto-advance live order tracking
  startOrderTracking();
}

function OrderStatusLabel(status) {
  const labels = {
    confirmed: 'Confirmed',
    preparing: 'Preparing',
    on_the_way: 'On the Way',
    delivered: 'Delivered',
    cancelled: 'Cancelled',
  };
  return labels[status] || Utils.capitalize(status);
}

// ── LIVE ORDER TRACKING ────────────────────────────
// Simulates the order progressing through statuses over time

function startOrderTracking() {
  if (window._orderTrackingStarted) return;
  window._orderTrackingStarted = true;

  setInterval(() => {
    const orders = Storage.getOrders();
    let changed = false;

    const updated = orders.map(order => {
      if (!['confirmed', 'preparing', 'on_the_way'].includes(order.status)) return order;

      // Advance based on elapsed time since order placed
      const elapsed = Date.now() - new Date(order.date).getTime();
      const statuses = ['confirmed', 'preparing', 'on_the_way', 'delivered'];
      const idx = statuses.indexOf(order.status);

      // ~45s per stage
      if (elapsed > (idx + 1) * 45000 && idx < statuses.length - 1) {
        const newStatus = statuses[idx + 1];
        order.status = newStatus;
        order.timeline = order.timeline.map((t, i) => ({ ...t, done: i <= idx + 1 }));
        order.timeline[idx + 1].time = new Date().toISOString();
        changed = true;
        if (newStatus === 'delivered') UI.toast('Your order has been delivered! 🎉', 'success', 3000);
        else if (newStatus === 'on_the_way') UI.toast('Your order is on the way! 🛵', 'info', 2500);
      }
      return order;
    });

    if (changed) {
      Storage.set(Storage.KEYS.ORDERS, updated);
      // Re-render only the timeline sections to avoid full re-render flicker
      document.querySelectorAll('.order-card').forEach(card => {
        const order = updated.find(o => o.id === card.dataset.orderId);
        if (!order) return;
        const badge = card.querySelector('.order-status-badge');
        if (badge) { badge.textContent = OrderStatusLabel(order.status); badge.className = `order-status-badge status-${order.status}`; }
        const steps = card.querySelectorAll('.timeline-step');
        order.timeline.forEach((t, i) => {
          if (steps[i]) steps[i].classList.toggle('done', t.done);
        });
      });
    }
  }, 5000);
}

// ── CANCEL ORDER ───────────────────────────────────

function cancelOrder(orderId) {
  const orders = Storage.getOrders();
  const order = orders.find(o => o.id === orderId);
  if (!order) return;
  if (!['confirmed', 'preparing'].includes(order.status)) {
    UI.toast('This order can no longer be cancelled.', 'error');
    return;
  }

  // Show reason modal
  UI.openModal('cancel-order-modal');
  const cancelBtn = document.getElementById('cancel-order-confirm');
  if (cancelBtn) {
    cancelBtn.onclick = () => {
      const reason = document.getElementById('cancel-reason')?.value || 'Other';
      order.status = 'cancelled';
      order.cancelReason = reason;
      order.timeline = order.timeline.map(t => ({ ...t, done: false }));
      Storage.set(Storage.KEYS.ORDERS, orders);
      UI.closeModal('cancel-order-modal');
      renderOrderHistory();
      UI.toast('Order cancelled.', 'info');
    };
  }
}

function reorder(orderId) {
  const order = Storage.getOrders().find(o => o.id === orderId);
  if (!order) return;
  Cart.clear();
  order.items.forEach(item => {
    const food = FOODS.find(f => f.name === item.name);
    if (food) Cart.addItem(food, item.quantity);
  });
  UI.toast('Items added to cart! 🛒', 'success');
  setTimeout(() => window.location.href = 'cart.html', 800);
}

function renderWishlistTab() {
  const container = document.getElementById('tab-wishlist');
  if (!container) return;
  const wishlistIds = Storage.getWishlist();
const items = wishlistIds.map(id => FOODS.find(f => f.id === id)).filter(Boolean);
  if (!items.length) {
    container.innerHTML = UI.renderEmptyState({
      icon: '❤️',
      title: 'Your wishlist is empty',
      text: 'Save your favourite dishes for later and they will show up here.',
      ctaText: 'Browse Restaurants',
      ctaHref: 'restaurants.html',
    });
    return;
  }
  container.innerHTML = `<div class="wishlist-grid">${items.map(f => RestaurantModule.renderFoodCard(f)).join('')}</div>`;
  Cart.initAddToCartButtons();
}

function renderAddressesTab() {
  const container = document.getElementById('tab-addresses');
  if (!container) return;
  const addresses = Storage.getAddresses();
  const all = addresses.map(a => ({ ...a, icon: a.icon || 'bi-geo-alt-fill' }));

  // Put the default address first
  all.sort((a, b) => (b.isDefault ? 1 : 0) - (a.isDefault ? 1 : 0));

  container.innerHTML = `
    <div class="address-grid-profile">
      ${all.map(addr => `
        <div class="address-profile-card">
          <div class="addr-card-top">
            <i class="bi ${addr.icon} addr-icon"></i>
            <div class="addr-body">
              <strong>${addr.label} ${addr.isDefault ? '<span class="default-tag">Default</span>' : ''}</strong>
              <p>${addr.address}</p>
              <p>${addr.city}, ${addr.pincode}</p>
            </div>
          </div>
          <div class="addr-card-actions">
            ${addr.isDefault ? '' : `<button class="btn-addr-action" onclick="setDefaultAddress('${addr.id}')"><i class="bi bi-check-circle"></i> Set Default</button>`}
            <button class="btn-addr-action" onclick="removeAddress('${addr.id}')"><i class="bi bi-trash3"></i> Delete</button>
          </div>
        </div>`).join('')}
    </div>
    <button class="btn-add-address-profile" onclick="UI.openModal('address-form-modal')"><i class="bi bi-plus"></i> Add New Address</button>
  `;

  // Ensure the address form modal exists
  ensureAddressFormModal();
}

function setDefaultAddress(id) {
  Storage.setDefaultAddress(id);
  renderAddressesTab();
  UI.toast('Default address updated.', 'success');
}

function removeAddress(id) {
  // Confirm deletion
  UI.openModal('confirm-addr-modal');
  const confirmBtn = document.getElementById('confirm-addr-yes');
  if (confirmBtn) {
    confirmBtn.onclick = () => {
      Storage.removeAddress(id);
      UI.closeModal('confirm-addr-modal');
      renderAddressesTab();
      UI.toast('Address removed.', 'info');
    };
  }
}

function ensureAddressFormModal() {
  if (document.getElementById('address-form-modal')) return;
  const modal = document.createElement('div');
  modal.className = 'modal';
  modal.id = 'address-form-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  modal.setAttribute('aria-labelledby', 'addr-form-title');
  modal.innerHTML = `
    <div class="modal-content">
      <button class="modal-close" onclick="UI.closeModal('address-form-modal')"><i class="bi bi-x-lg"></i></button>
      <h3 id="addr-form-title">Add New Address</h3>
      <div id="addr-form-body">
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">Label</label>
            <div class="addr-type-group">
              <label class="addr-type-btn"><input type="radio" name="addr-form-type" value="Home" checked> <i class="bi bi-house"></i> Home</label>
              <label class="addr-type-btn"><input type="radio" name="addr-form-type" value="Work"> <i class="bi bi-briefcase"></i> Work</label>
              <label class="addr-type-btn"><input type="radio" name="addr-form-type" value="Other"> <i class="bi bi-geo-alt"></i> Other</label>
            </div>
          </div>
        </div>
        <div class="form-group">
          <label class="form-label">Full Address</label>
          <input type="text" id="addr-form-address" class="form-control" placeholder="Flat/House No, Building, Street, Landmark">
        </div>
        <div class="form-row">
          <div class="form-group">
            <label class="form-label">City</label>
            <input type="text" id="addr-form-city" class="form-control" placeholder="Mumbai">
          </div>
          <div class="form-group">
            <label class="form-label">Pincode</label>
            <input type="text" id="addr-form-pin" class="form-control" placeholder="400001" maxlength="6">
          </div>
        </div>
        <div style="display:flex;gap:10px;margin-top:20px;justify-content:flex-end;">
          <button class="btn-secondary" onclick="UI.closeModal('address-form-modal')">Cancel</button>
          <button class="btn-primary" id="addr-form-save"><i class="bi bi-check-lg"></i> Save Address</button>
        </div>
      </div>
    </div>
  `;
  document.body.appendChild(modal);

  // Save handler
  document.getElementById('addr-form-save').addEventListener('click', () => {
    const type = document.querySelector('input[name="addr-form-type"]:checked')?.value || 'Home';
    const address = document.getElementById('addr-form-address').value.trim();
    const city = document.getElementById('addr-form-city').value.trim();
    const pin = document.getElementById('addr-form-pin').value.trim();

    if (!address || !city || !pin) { UI.toast('Please fill in all required fields.', 'error'); return; }
    if (!/^\d{6}$/.test(pin)) { UI.toast('Please enter a valid 6-digit pincode.', 'error'); return; }

    const iconMap = { Home: 'bi-house-fill', Work: 'bi-briefcase-fill', Other: 'bi-geo-alt-fill' };
    Storage.addAddress({ label: type, icon: iconMap[type] || 'bi-geo-alt-fill', address, city, pincode: pin, isDefault: false });
    UI.closeModal('address-form-modal');
    renderAddressesTab();
    UI.toast('Address saved! 🏠', 'success');
  });
}

// ====================================================
// ABOUT PAGE
// ====================================================
function initAboutPage() {
  UI.initCounters();
}

// ====================================================
// CONTACT PAGE
// ====================================================
function initContactPage() {
  const form = document.getElementById('contact-form');
  if (!form) return;
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    UI.toast('Message sent! We\'ll get back to you within 24 hours. 📧', 'success', 4000);
    form.reset();
  });

  // FAQ accordion
  document.querySelectorAll('.faq-question').forEach(btn => {
    btn.addEventListener('click', () => {
      const item = btn.closest('.faq-item');
      const isOpen = item.classList.contains('open');
      document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('open'));
      if (!isOpen) item.classList.add('open');
    });
  });
}
