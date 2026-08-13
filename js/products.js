/**
 * FreshBite - Products Module
 * Product detail page, customizations, nutrition, gallery
 */

const Products = {

  selectedCustomizations: [],
  quantity: 1,

  // ── INIT PRODUCT PAGE ─────────────────────────────

  initProductPage() {
    const id = parseInt(Utils.getParam('id'));
    const food = FOODS.find(f => f.id === id);
    if (!food) { window.location.href = 'restaurants.html'; return; }

Storage.addRecentlyViewed(food.id);
    this.renderProductDetail(food);
    this.renderRelatedItems(food);
    this.renderProductReviews(food);
    this.initCustomizations(food);
    this.initQuantitySelector(food);
    this.initGallery(food);
    this.initReviewForm(food);
  },

  // ── SUBMIT REVIEW (B8) ───────────────────────────

  initReviewForm(food) {
    const container = document.getElementById('write-review');
    const submitBtn = document.getElementById('submit-review-btn');
    if (!container) return;

    // Require login to review
    if (!Storage.getUser()) {
      container.innerHTML = `
        <div style="display:flex;align-items:center;justify-content:space-between;gap:12px;flex-wrap:wrap;">
          <div>
            <strong style="font-size:0.95rem;">Loved this dish?</strong>
            <p style="font-size:0.82rem;color:var(--text-muted);">Sign in to leave a review and help others.</p>
          </div>
          <a href="login.html?redirect=product.html?id=${food.id}" class="btn-outline btn-sm">Sign In to Review <i class="bi bi-arrow-right"></i></a>
        </div>`;
      return;
    }

    let selectedRating = 0;

    // Star rating interaction
    const stars = container.querySelectorAll('#review-rating-input button');
    const setStars = (val) => {
      stars.forEach((s, i) => {
        s.innerHTML = `<i class="bi bi-star${i < val ? '-fill' : ''}"></i>`;
        s.classList.toggle('active', i < val);
      });
    };

    stars.forEach(star => {
      star.addEventListener('click', () => {
        selectedRating = parseInt(star.dataset.rating);
        setStars(selectedRating);
      });
      star.addEventListener('mouseenter', () => setStars(parseInt(star.dataset.rating)));
      star.addEventListener('mouseleave', () => setStars(selectedRating));
    });

    // Submit
    submitBtn.addEventListener('click', () => {
      const comment = document.getElementById('review-comment').value.trim();
      if (!selectedRating) { UI.toast('Please select a star rating.', 'warning'); return; }
      if (!comment) { UI.toast('Please write a short comment.', 'warning'); return; }

      const user = Storage.getUser();
      const review = {
        id: Date.now(),
        restaurantId: food.restaurantId,
        foodId: food.id,
        userId: user.id || 'u_demo',
        userName: user.name,
        avatar: '',
        rating: selectedRating,
        comment,
        date: new Date().toISOString(),
        helpful: 0,
        orderedItems: [food.name],
      };

      // Save to a user reviews store
      const userReviews = Storage.get('freshbite_user_reviews', []);
      userReviews.unshift(review);
      Storage.set('freshbite_user_reviews', userReviews);

      // Clear form
      setStars(0);
      selectedRating = 0;
      document.getElementById('review-comment').value = '';

      UI.toast('Thank you! Your review has been posted. ⭐', 'success');
      // Re-render product reviews to include the new one
      this.renderProductReviews(food, true);
    });
  },

  // ── RENDER PRODUCT DETAIL ─────────────────────────

  renderProductDetail(food) {
    document.title = `${food.name} — FreshBite`;

    // Main image
    const mainImg = document.getElementById('product-main-img');
    if (mainImg) { mainImg.src = food.image; mainImg.alt = food.name; }

    // Text fields
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.innerHTML = val; };
    set('product-name', food.name);
    set('product-description', food.description);
    set('product-price', Utils.formatPrice(food.price));
    set('product-original-price', food.originalPrice > food.price ? `<span class="original-price">${Utils.formatPrice(food.originalPrice)}</span>` : '');

    // Badges
    set('product-veg-badge', Utils.vegBadge(food.isVeg, food.isVegan));
    set('product-spice', Utils.spiceHTML(food.spiceLevel));
    set('product-rating', `
      <div class="product-rating">
        ${Utils.renderStars(food.rating)}
        <span>${Utils.formatRating(food.rating)} (${food.reviewCount} reviews)</span>
      </div>
    `);

    // Special badges
    const badgeContainer = document.getElementById('product-badges');
    if (badgeContainer) {
      badgeContainer.innerHTML = [
        food.isBestSeller ? '<span class="badge-xl badge-bestseller">🏆 Best Seller</span>' : '',
        food.isChefSpecial ? '<span class="badge-xl badge-chef">👨‍🍳 Chef Special</span>' : '',
        food.isNew ? '<span class="badge-xl badge-new">✨ New</span>' : '',
        food.isGlutenFree ? '<span class="badge-xl badge-gluten">🌾 Gluten Free</span>' : '',
        food.isVegan ? '<span class="badge-xl badge-vegan">🌱 Vegan</span>' : '',
      ].join('');
    }

    // Discount %
    if (food.originalPrice > food.price) {
      const disc = Math.round((food.originalPrice - food.price) / food.originalPrice * 100);
      const discEl = document.getElementById('product-discount');
      if (discEl) { discEl.textContent = `${disc}% OFF`; discEl.style.display = ''; }
    }

    // Nutrition
    this.renderNutrition(food);

    // Ingredients
    const ingEl = document.getElementById('product-ingredients');
    if (ingEl && food.ingredients) {
      ingEl.innerHTML = food.ingredients.map(i => `<span class="ingredient-tag">${i}</span>`).join('');
    }

    // Restaurant link
    const restaurant = RESTAURANTS.find(r => r.id === food.restaurantId);
    const restLink = document.getElementById('product-restaurant-link');
    const restMenuLink = document.getElementById('product-restaurant-menu-link');
    const restBreadcrumb = document.getElementById('product-breadcrumb-restaurant');
    if (restaurant) {
      if (restLink) { restLink.href = `restaurant.html?id=${restaurant.id}`; restLink.textContent = restaurant.name; }
      if (restMenuLink) restMenuLink.href = `restaurant.html?id=${restaurant.id}`;
      if (restBreadcrumb) { restBreadcrumb.href = `restaurant.html?id=${restaurant.id}`; restBreadcrumb.textContent = restaurant.name; }
    }

    // Wishlist button
    const wishBtn = document.getElementById('product-wishlist-btn');
    if (wishBtn) {
      const inWishlist = Storage.isInWishlist(food.id);
      wishBtn.classList.toggle('active', inWishlist);
      wishBtn.innerHTML = `<i class="bi bi-heart${inWishlist ? '-fill' : ''}"></i> ${inWishlist ? 'Wishlisted' : 'Wishlist'}`;
      wishBtn.addEventListener('click', () => {
        const added = Storage.toggleWishlist(food.id);
        wishBtn.classList.toggle('active', added);
        wishBtn.innerHTML = `<i class="bi bi-heart${added ? '-fill' : ''}"></i> ${added ? 'Wishlisted' : 'Wishlist'}`;
        UI.toast(added ? 'Added to wishlist ❤️' : 'Removed from wishlist', added ? 'success' : 'info');
      });
    }
  },

  renderNutrition(food) {
    const container = document.getElementById('nutrition-container');
    if (!container) return;
    const facts = [
      { label: 'Calories', value: food.calories, unit: 'kcal', icon: '🔥' },
      { label: 'Protein', value: food.protein, unit: 'g', icon: '💪' },
      { label: 'Fat', value: food.fat, unit: 'g', icon: '🧈' },
      { label: 'Carbs', value: food.carbs, unit: 'g', icon: '🌾' },
    ];
    container.innerHTML = facts.map(f => `
      <div class="nutrition-item">
        <span class="nutrition-icon">${f.icon}</span>
        <span class="nutrition-value">${f.value}<small>${f.unit}</small></span>
        <span class="nutrition-label">${f.label}</span>
      </div>
    `).join('');
  },

  // ── GALLERY ───────────────────────────────────────

  initGallery(food) {
    // Generate multiple "gallery" images using different Unsplash crops
    const galleryImages = [
      food.image,
      food.image.replace('w=600', 'w=600&crop=entropy'),
      food.image.replace('w=600', 'w=600&crop=faces'),
      food.image.replace('q=80', 'q=90'),
    ];

    const thumbContainer = document.getElementById('product-gallery-thumbs');
    const mainImg = document.getElementById('product-main-img');

    if (!thumbContainer) return;

    thumbContainer.innerHTML = galleryImages.map((src, i) => `
      <button class="gallery-thumb ${i === 0 ? 'active' : ''}" data-src="${src}">
        <img src="${src}" alt="Product image ${i + 1}" loading="lazy">
      </button>
    `).join('');

    thumbContainer.querySelectorAll('.gallery-thumb').forEach(thumb => {
      thumb.addEventListener('click', () => {
        thumbContainer.querySelectorAll('.gallery-thumb').forEach(t => t.classList.remove('active'));
        thumb.classList.add('active');
        if (mainImg) {
          mainImg.style.opacity = '0';
          setTimeout(() => { mainImg.src = thumb.dataset.src; mainImg.style.opacity = '1'; }, 200);
        }
      });
    });
  },

  // ── CUSTOMIZATIONS ────────────────────────────────

  initCustomizations(food) {
    const container = document.getElementById('customizations-container');
    if (!container || !food.customizations?.length) return;

    container.innerHTML = `
      <h3 class="customize-title">Customize Your Order</h3>
      <div class="customize-options">
        ${food.customizations.map((option, i) => `
          <label class="customize-option">
            <input type="checkbox" value="${option}" data-idx="${i}">
            <span class="checkbox-custom"></span>
            <span class="option-label">${option}</span>
          </label>
        `).join('')}
      </div>
    `;

    container.querySelectorAll('input[type="checkbox"]').forEach(cb => {
      cb.addEventListener('change', () => {
        if (cb.checked) this.selectedCustomizations.push(cb.value);
        else this.selectedCustomizations = this.selectedCustomizations.filter(c => c !== cb.value);
      });
    });
  },

  // ── QUANTITY SELECTOR ─────────────────────────────

  initQuantitySelector(food) {
    const decBtn = document.getElementById('qty-dec');
    const incBtn = document.getElementById('qty-inc');
    const qtyDisplay = document.getElementById('qty-display');
    const addBtn = document.getElementById('add-to-cart-main');

    const updateQty = () => {
      if (qtyDisplay) qtyDisplay.textContent = this.quantity;
      if (addBtn) addBtn.querySelector('.btn-total-price').textContent = Utils.formatPrice(food.price * this.quantity);
      if (decBtn) decBtn.disabled = this.quantity <= 1;
    };

    if (decBtn) decBtn.addEventListener('click', () => {
      if (this.quantity > 1) { this.quantity--; updateQty(); }
    });

    if (incBtn) incBtn.addEventListener('click', () => {
      if (this.quantity < 20) { this.quantity++; updateQty(); }
    });

if (addBtn) {
      addBtn.addEventListener('click', () => {
        const result = Cart.addItem(food, this.quantity, this.selectedCustomizations);
        if (!result.success) {
          // Show premium conflict modal
          const modal = document.getElementById('conflict-modal');
          if (modal) {
            const restName = document.getElementById('conflict-restaurant-name');
            const newItem = document.getElementById('conflict-new-item');
            if (restName) restName.textContent = RESTAURANTS.find(r => r.id === result.conflictRestaurant)?.name || 'another restaurant';
            if (newItem) newItem.textContent = food.name;
            UI.openModal('conflict-modal');

            const clearBtn = document.getElementById('conflict-clear-btn');
            if (clearBtn) {
              clearBtn.onclick = () => {
                Cart.clear();
                Cart.addItem(food, this.quantity, this.selectedCustomizations);
                UI.closeModal('conflict-modal');
                UI.toast(`${food.name} × ${this.quantity} added to cart 🛒`, 'success');
                // Button feedback
                addBtn.classList.add('added');
                addBtn.querySelector('.btn-text').textContent = 'Added to Cart!';
                setTimeout(() => {
                  addBtn.classList.remove('added');
                  addBtn.querySelector('.btn-text').textContent = 'Add to Cart';
                }, 2000);
              };
            }
            return;
          }
          // Fallback if no modal
          if (confirm(result.message)) {
            Cart.clear();
            Cart.addItem(food, this.quantity, this.selectedCustomizations);
          }
        }
        UI.toast(`${food.name} × ${this.quantity} added to cart 🛒`, 'success');

        // Button feedback
        addBtn.classList.add('added');
        addBtn.querySelector('.btn-text').textContent = 'Added to Cart!';
        setTimeout(() => {
          addBtn.classList.remove('added');
          addBtn.querySelector('.btn-text').textContent = 'Add to Cart';
        }, 2000);
      });
    }

    updateQty();
  },

  // ── RELATED ITEMS ─────────────────────────────────

  renderRelatedItems(food) {
    const container = document.getElementById('related-items');
    if (!container) return;

    const related = FOODS.filter(f =>
      f.id !== food.id &&
      (f.restaurantId === food.restaurantId || f.category === food.category)
    ).slice(0, 4);

    if (!related.length) {
      const section = container.closest('section');
      if (section) section.style.display = 'none';
      return;
    }

    container.innerHTML = related.map(f => RestaurantModule.renderFoodCard(f)).join('');
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

    setTimeout(() => UI.initScrollAnimations(), 80);
  },

  // ── PRODUCT REVIEWS ───────────────────────────────

renderProductReviews(food, includeUser = false) {
    const container = document.getElementById('product-reviews');
    if (!container) return;

    // Merge static reviews + any user-submitted reviews for this product
    const userReviews = Storage.get('freshbite_user_reviews', [])
      .filter(r => r.foodId === food.id)
      .map(r => ({ ...r, avatar: '', isUser: true }));

    let reviews = [...REVIEWS.filter(r => r.restaurantId === food.restaurantId)];
    if (includeUser) reviews = [...userReviews, ...reviews];

    if (!reviews.length) { container.innerHTML = '<p class="no-reviews">No reviews yet. Be the first to review!</p>'; return; }
    reviews = reviews.slice(0, 5);

container.innerHTML = reviews.map(r => `
      <div class="review-card animate-on-scroll">
        <div class="review-header">
          ${r.avatar
            ? `<img src="${r.avatar}" alt="${r.userName}" class="review-avatar" loading="lazy">`
            : `<div class="review-avatar review-avatar-init" style="background:${Utils.avatarColor(r.userName)}">${Utils.getInitials(r.userName)}</div>`}
          <div class="review-meta">
            <strong>${r.userName} ${r.isUser ? '<span class="review-user-badge">You</span>' : ''}</strong>
            <span class="review-date">${Utils.formatDate(r.date)}</span>
          </div>
          <div class="review-stars">${Utils.renderStars(r.rating)}</div>
        </div>
        <p class="review-text">"${r.comment}"</p>
      </div>
    `).join('');
  },
};
