/**
 * FreshBite - Restaurant Module
 * Restaurant listing, filtering, sorting, detail page
 */

const RestaurantModule = {

  currentFilters: {
    search: '',
    cuisine: '',
    rating: 0,
    price: '',
    vegOnly: false,
    sort: 'popularity',
    open: false,
  },

  // ── RENDER RESTAURANT CARD ────────────────────────

  renderCard(restaurant) {
    const isFav = Storage.isFavoriteRestaurant(restaurant.id);
    const ratingColor = Utils.ratingColor(restaurant.rating);
    const hasOffer = !!restaurant.offer;

    return `
      <article class="restaurant-card animate-on-scroll" data-id="${restaurant.id}">
        <a href="restaurant.html?id=${restaurant.id}" class="card-link" aria-label="View ${restaurant.name}">
          <div class="card-img-wrap">
            <img src="${restaurant.coverImage}" alt="${restaurant.name}" loading="lazy" class="card-cover">
            <div class="card-img-overlay">
              ${restaurant.isFeatured ? '<span class="badge-featured">Featured</span>' : ''}
              ${!restaurant.isOpen ? '<div class="closed-overlay"><span>Currently Closed</span></div>' : ''}
              ${hasOffer ? `<div class="offer-strip"><i class="bi bi-tag-fill"></i> ${restaurant.offer}</div>` : ''}
            </div>
            <div class="card-logo">
              <img src="${restaurant.logo}" alt="${restaurant.name} logo" loading="lazy">
            </div>
          </div>
          <div class="card-body">
            <div class="card-header-row">
              <h3 class="card-title">${restaurant.name}</h3>
              <button class="fav-btn ${isFav ? 'active' : ''}" data-id="${restaurant.id}"
                aria-label="${isFav ? 'Remove from favourites' : 'Add to favourites'}"
                onclick="event.preventDefault(); RestaurantModule.toggleFav(this, ${restaurant.id})">
                <i class="bi bi-heart${isFav ? '-fill' : ''}"></i>
              </button>
            </div>
            <p class="card-cuisine">${restaurant.cuisine.join(' · ')}</p>
            <div class="card-meta">
              <span class="rating-badge" style="background:${ratingColor}">
                <i class="bi bi-star-fill"></i> ${Utils.formatRating(restaurant.rating)}
                <span class="rating-count">(${restaurant.reviewCount}+)</span>
              </span>
              <span class="meta-dot"></span>
              <span class="delivery-time"><i class="bi bi-clock"></i> ${restaurant.deliveryTime} min</span>
              <span class="meta-dot"></span>
              <span class="delivery-fee">
                ${restaurant.deliveryFee === 0 ? '<span class="free-delivery">Free Delivery</span>' : Utils.formatPrice(restaurant.deliveryFee) + ' delivery'}
              </span>
            </div>
            <div class="card-footer-row">
              <span class="price-range">${restaurant.priceRange} for two</span>
              <div class="card-tags">
                ${restaurant.tags.map(t => `<span class="tag">${t}</span>`).join('')}
                ${restaurant.isVeg ? '<span class="tag tag-veg">Pure Veg</span>' : ''}
              </div>
            </div>
          </div>
        </a>
      </article>
    `;
  },

  // ── TOGGLE FAVOURITE ──────────────────────────────

  toggleFav(btn, restaurantId) {
    const added = Storage.toggleFavoriteRestaurant(restaurantId);
    btn.classList.toggle('active', added);
    btn.innerHTML = `<i class="bi bi-heart${added ? '-fill' : ''}"></i>`;
    UI.toast(added ? 'Added to favourites ❤️' : 'Removed from favourites', added ? 'success' : 'info', 1500);
  },

  // ── FILTER + SORT LOGIC ───────────────────────────

  applyFilters(restaurants) {
    const f = this.currentFilters;
    let result = [...restaurants];

    if (f.search) {
      const q = f.search.toLowerCase();
      result = result.filter(r =>
        r.name.toLowerCase().includes(q) ||
        r.cuisine.some(c => c.toLowerCase().includes(q))
      );
    }
    if (f.cuisine) result = result.filter(r => r.cuisine.some(c => c.toLowerCase() === f.cuisine.toLowerCase()));
    if (f.rating) result = result.filter(r => r.rating >= f.rating);
    if (f.price) result = result.filter(r => r.priceRange === f.price);
    if (f.vegOnly) result = result.filter(r => r.isVeg);
    if (f.open) result = result.filter(r => r.isOpen);

    // Sort
    switch (f.sort) {
      case 'rating': result.sort((a, b) => b.rating - a.rating); break;
      case 'delivery': result.sort((a, b) => parseInt(a.deliveryTime) - parseInt(b.deliveryTime)); break;
      case 'price_low': result.sort((a, b) => a.priceRange.length - b.priceRange.length); break;
      case 'newest': result.sort((a, b) => b.id - a.id); break;
      default: // popularity - featured first, then by reviewCount
        result.sort((a, b) => (b.isFeatured ? 1 : 0) - (a.isFeatured ? 1 : 0) || b.reviewCount - a.reviewCount);
    }

    return result;
  },

  // ── RENDER LISTING PAGE ───────────────────────────

  renderListing() {
    const grid = document.getElementById('restaurants-grid');
    const countEl = document.getElementById('results-count');
    if (!grid) return;

    const filtered = this.applyFilters(RESTAURANTS);

    if (countEl) countEl.textContent = `${filtered.length} restaurant${filtered.length !== 1 ? 's' : ''} found`;

if (!filtered.length) {
      grid.innerHTML = `<div style="grid-column:1/-1;">` + UI.renderEmptyState({
        icon: '🍽️',
        title: 'No restaurants found',
        text: 'Try adjusting your filters or search term to find more places to eat.',
        ctaText: 'Reset Filters',
        ctaAction: 'RestaurantModule.resetFilters()',
      }) + `</div>`;
      return;
    }

    grid.innerHTML = filtered.map(r => this.renderCard(r)).join('');
    setTimeout(() => UI.initScrollAnimations(), 80);
  },

  resetFilters() {
    this.currentFilters = { search: '', cuisine: '', rating: 0, price: '', vegOnly: false, sort: 'popularity', open: false };
    document.querySelectorAll('.filter-chip.active').forEach(c => c.classList.remove('active'));
    const searchInput = document.getElementById('restaurant-search');
    if (searchInput) searchInput.value = '';
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) sortSelect.value = 'popularity';
    this.renderListing();
  },

  // ── INIT LISTING PAGE ─────────────────────────────

initListingPage() {
    // Show skeleton loading while the grid "loads" (C1)
    const gridEl = document.getElementById('restaurants-grid');
    if (gridEl) UI.showSkeletons(gridEl, 4);

    // Search
    const searchInput = document.getElementById('restaurant-search');
    if (searchInput) {
      searchInput.addEventListener('input', Utils.debounce((e) => {
        this.currentFilters.search = e.target.value;
        this.renderListing();
      }, 300));

      // Search suggestions dropdown
      UI.initSearchSuggestions('restaurant-search',
        RESTAURANTS.map(r => ({ id: r.id, name: r.name, category: r.cuisine[0], type: 'restaurant' })),
        (item) => { window.location.href = `restaurant.html?id=${item.id}`; }
      );
    }

    // Filter chips (cuisine, rating, etc.)
    document.querySelectorAll('.filter-chip').forEach(chip => {
      chip.addEventListener('click', () => {
        const filterType = chip.dataset.filter;
        const filterValue = chip.dataset.value;

        if (filterType === 'veg') {
          this.currentFilters.vegOnly = !this.currentFilters.vegOnly;
          chip.classList.toggle('active');
        } else if (filterType === 'open') {
          this.currentFilters.open = !this.currentFilters.open;
          chip.classList.toggle('active');
        } else if (filterType === 'rating') {
          const val = parseFloat(filterValue);
          if (this.currentFilters.rating === val) {
            this.currentFilters.rating = 0;
            chip.classList.remove('active');
          } else {
            document.querySelectorAll('[data-filter="rating"]').forEach(c => c.classList.remove('active'));
            this.currentFilters.rating = val;
            chip.classList.add('active');
          }
        } else if (filterType === 'price') {
          if (this.currentFilters.price === filterValue) {
            this.currentFilters.price = '';
            chip.classList.remove('active');
          } else {
            document.querySelectorAll('[data-filter="price"]').forEach(c => c.classList.remove('active'));
            this.currentFilters.price = filterValue;
            chip.classList.add('active');
          }
        } else if (filterType === 'cuisine') {
          if (this.currentFilters.cuisine === filterValue) {
            this.currentFilters.cuisine = '';
            chip.classList.remove('active');
          } else {
            document.querySelectorAll('[data-filter="cuisine"]').forEach(c => c.classList.remove('active'));
            this.currentFilters.cuisine = filterValue;
            chip.classList.add('active');
          }
        }
        this.renderListing();
      });
    });

    // Sort select
    const sortSelect = document.getElementById('sort-select');
    if (sortSelect) {
      sortSelect.addEventListener('change', () => {
        this.currentFilters.sort = sortSelect.value;
        this.renderListing();
      });
    }

    // Delay initial render so skeleton shows briefly (C1)
    setTimeout(() => this.renderListing(), 450);
  },

  // ── RENDER DETAIL PAGE ────────────────────────────

initDetailPage() {
    const id = parseInt(Utils.getParam('id'));
    const restaurant = RESTAURANTS.find(r => r.id === id);
    if (!restaurant) { window.location.href = 'restaurants.html'; return; }

    // Show skeleton loading for menu grid (C1)
    const menuContainer = document.getElementById('menu-container');
    if (menuContainer) UI.showSkeletons(menuContainer, 4);

    // Set cover and info
    this.renderDetailHeader(restaurant);

    // Render menu (after brief skeleton delay)
    const foods = FOODS.filter(f => f.restaurantId === restaurant.id);
    setTimeout(() => this.renderMenu(foods, restaurant), 450);

    // Render reviews
    const reviews = REVIEWS.filter(r => r.restaurantId === restaurant.id);
    this.renderRestaurantReviews(reviews);

    // Sticky category nav
    this.initStickyMenu(restaurant.categories);

    // Menu search
    const menuSearch = document.getElementById('menu-search');
    if (menuSearch) {
      menuSearch.addEventListener('input', Utils.debounce((e) => {
        this.filterMenu(foods, e.target.value);
      }, 250));
    }
  },

renderDetailHeader(restaurant) {
    const cover = document.getElementById('restaurant-cover');
    if (cover) cover.src = restaurant.coverImage;

    // Set restaurant logo
    const logo = document.getElementById('restaurant-logo');
    if (logo) {
      logo.src = restaurant.logo;
      logo.alt = `${restaurant.name} logo`;
    }

    const setEl = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    const setHTML = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
    setEl('restaurant-name', restaurant.name);
    setEl('restaurant-cuisine', restaurant.cuisine.join(' · '));
    setHTML('restaurant-address', `<i class="bi bi-geo-alt"></i> ${restaurant.address}`);
    setEl('restaurant-delivery-time', `${restaurant.deliveryTime} min`);
    setEl('restaurant-fee', restaurant.deliveryFee === 0 ? 'Free Delivery' : Utils.formatPrice(restaurant.deliveryFee));
    setEl('restaurant-min-order', `Min. ${Utils.formatPrice(restaurant.minOrder)}`);

    const ratingEl = document.getElementById('restaurant-rating');
    if (ratingEl) {
      ratingEl.innerHTML = `
        <span class="rating-badge-lg" style="background:${Utils.ratingColor(restaurant.rating)}">
          <i class="bi bi-star-fill"></i> ${Utils.formatRating(restaurant.rating)}
        </span>
        <span class="review-count">${restaurant.reviewCount}+ Reviews</span>
      `;
    }

    const statusEl = document.getElementById('restaurant-status');
    if (statusEl) {
      statusEl.textContent = restaurant.isOpen ? 'Open Now' : 'Currently Closed';
      statusEl.className = `status-badge ${restaurant.isOpen ? 'open' : 'closed'}`;
    }

    const offerEl = document.getElementById('restaurant-offer');
    if (offerEl && restaurant.offer) {
      offerEl.innerHTML = `<i class="bi bi-tag-fill"></i> ${restaurant.offer} — <strong>${restaurant.offerCode}</strong>`;
      offerEl.style.display = '';
    }

    // Page title
    document.title = `${restaurant.name} — FreshBite`;

    // Fav button
    const favBtn = document.getElementById('detail-fav-btn');
    if (favBtn) {
      const isFav = Storage.isFavoriteRestaurant(restaurant.id);
      favBtn.classList.toggle('active', isFav);
      favBtn.innerHTML = `<i class="bi bi-heart${isFav ? '-fill' : ''}"></i> ${isFav ? 'Saved' : 'Save'}`;
      favBtn.addEventListener('click', () => this.toggleFav(favBtn, restaurant.id));
    }
  },

  renderMenu(foods, restaurant) {
    const container = document.getElementById('menu-container');
    if (!container) return;

    const grouped = {};

    // Always show Recommended first
    const recommended = foods.filter(f => f.isBestSeller || f.isChefSpecial).slice(0, 6);
    if (recommended.length) grouped['Recommended'] = recommended;

    // Then by categories
    (restaurant.categories || []).forEach(cat => {
      if (cat === 'Recommended') return; // already added
      const catFoods = foods.filter(f => f.category === cat || f.subcategory === cat);
      if (catFoods.length) grouped[cat] = catFoods;
    });

    container.innerHTML = Object.entries(grouped).map(([cat, items]) => `
      <section class="menu-section" id="menu-${cat.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g,'')}">
        <h2 class="menu-category-title">${cat}
          <span class="menu-count">${items.length} item${items.length !== 1 ? 's' : ''}</span>
        </h2>
        <div class="menu-grid">
          ${items.map(food => this.renderFoodCard(food)).join('')}
        </div>
      </section>
    `).join('');

    // Bind add-to-cart
    Cart.initAddToCartButtons();

    // Wishlist buttons
    container.querySelectorAll('.wishlist-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        e.stopPropagation();
        const foodId = parseInt(btn.dataset.id);
        const added = Storage.toggleWishlist(foodId);
        btn.classList.toggle('active', added);
        btn.innerHTML = `<i class="bi bi-heart${added ? '-fill' : ''}"></i>`;
        UI.toast(added ? 'Added to wishlist ❤️' : 'Removed from wishlist', added ? 'success' : 'info', 1500);
      });
    });

    // Trigger scroll animations
    setTimeout(() => UI.initScrollAnimations(), 100);
  },

  renderFoodCard(food) {
    const inWishlist = Storage.isInWishlist(food.id);
    const cartCount = Cart.getItems().filter(i => i.foodId === food.id).reduce((s, i) => s + i.quantity, 0);
    return `
      <div class="food-card animate-on-scroll">
        <a href="product.html?id=${food.id}" class="food-card-img-link">
          <div class="food-card-img-wrap">
            <img src="${food.image}" alt="${food.name}" loading="lazy" class="food-card-img">
            ${food.isBestSeller ? '<span class="badge-bestseller">🏆 Best Seller</span>' : ''}
            ${food.isChefSpecial ? '<span class="badge-chef">👨‍🍳 Chef Special</span>' : ''}
            ${food.isNew ? '<span class="badge-new">✨ New</span>' : ''}
          </div>
        </a>
        <div class="food-card-body">
          <div class="food-card-header">
            ${Utils.vegBadge(food.isVeg, food.isVegan)}
            <button class="wishlist-btn ${inWishlist ? 'active' : ''}" data-id="${food.id}" aria-label="Wishlist">
              <i class="bi bi-heart${inWishlist ? '-fill' : ''}"></i>
            </button>
          </div>
          <a href="product.html?id=${food.id}">
            <h4 class="food-card-name">${food.name}</h4>
          </a>
          <p class="food-card-desc">${Utils.truncate(food.description, 72)}</p>
          <div class="food-card-footer">
            <div class="food-price-group">
              <span class="food-price">${Utils.formatPrice(food.price)}</span>
              ${food.originalPrice > food.price ? `<span class="food-original-price">${Utils.formatPrice(food.originalPrice)}</span>` : ''}
            </div>
            <div class="food-rating">
              <i class="bi bi-star-fill" style="color:#f39c12"></i> ${Utils.formatRating(food.rating)}
            </div>
          </div>
          <button class="btn-add-to-cart add-to-cart-btn ${cartCount > 0 ? 'in-cart' : ''}"
            data-food-id="${food.id}" aria-label="Add ${food.name} to cart">
            ${cartCount > 0 ? `<i class="bi bi-check-lg"></i> Added (${cartCount})` : '<i class="bi bi-plus"></i> Add'}
          </button>
        </div>
      </div>
    `;
  },

  filterMenu(foods, query) {
    const container = document.getElementById('menu-container');
    if (!container) return;
    if (!query.trim()) {
      const restaurant = RESTAURANTS.find(r => r.id === foods[0]?.restaurantId);
      if (restaurant) this.renderMenu(foods, restaurant);
      return;
    }

    const matched = foods.filter(f =>
      f.name.toLowerCase().includes(query.toLowerCase()) ||
      f.description.toLowerCase().includes(query.toLowerCase()) ||
      f.category.toLowerCase().includes(query.toLowerCase())
    );

    if (!matched.length) {
      container.innerHTML = `
        <div class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No items found</h3>
          <p>Try a different search term</p>
        </div>`;
      return;
    }
    container.innerHTML = `
      <section class="menu-section">
        <h2 class="menu-category-title">Search Results <span class="menu-count">${matched.length}</span></h2>
        <div class="menu-grid">${matched.map(f => this.renderFoodCard(f)).join('')}</div>
      </section>`;
    Cart.initAddToCartButtons();
    setTimeout(() => UI.initScrollAnimations(), 80);
  },

  initStickyMenu(categories) {
    const nav = document.getElementById('sticky-menu-nav');
    if (!nav) return;

    const sanitize = (s) => s.replace(/\s+/g, '-').replace(/[^a-zA-Z0-9-]/g, '');

    nav.innerHTML = categories.map(cat => `
      <button class="menu-nav-btn" data-target="menu-${sanitize(cat)}">${cat}</button>
    `).join('');

    nav.querySelectorAll('.menu-nav-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const target = document.getElementById(btn.dataset.target);
        if (target) {
          const offset = document.querySelector('.sticky-menu-nav')?.offsetHeight || 60;
          const top = target.getBoundingClientRect().top + window.scrollY - (70 + offset);
          window.scrollTo({ top, behavior: 'smooth' });
        }
      });
    });

    // Highlight active category on scroll
    const sections = document.querySelectorAll('.menu-section');
    if (!sections.length) return;

    const navBtns = nav.querySelectorAll('.menu-nav-btn');

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          navBtns.forEach(btn => btn.classList.remove('active'));
          const idx = [...sections].indexOf(entry.target);
          if (navBtns[idx]) navBtns[idx].classList.add('active');
        }
      });
    }, { rootMargin: '-100px 0px -60% 0px' });

    sections.forEach(s => observer.observe(s));
  },

  renderRestaurantReviews(reviews) {
    const container = document.getElementById('reviews-container');
    if (!container) return;
    if (!reviews.length) { container.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>'; return; }
    container.innerHTML = reviews.map(r => `
      <div class="review-card animate-on-scroll">
        <div class="review-header">
          <img src="${r.avatar}" alt="${r.userName}" class="review-avatar" loading="lazy">
          <div class="review-meta">
            <strong>${r.userName}</strong>
            <span class="review-date">${Utils.formatDate(r.date)}</span>
          </div>
          <div class="review-stars">${Utils.renderStars(r.rating)}</div>
        </div>
        <p class="review-text">"${r.comment}"</p>
        ${r.orderedItems?.length ? `<p class="review-items">Ordered: ${r.orderedItems.join(', ')}</p>` : ''}
        <button class="helpful-btn"><i class="bi bi-hand-thumbs-up"></i> Helpful (${r.helpful})</button>
      </div>
    `).join('');
  },
};
