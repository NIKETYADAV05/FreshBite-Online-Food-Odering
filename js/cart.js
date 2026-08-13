/**
 * FreshBite - Cart Module
 * Add, remove, update quantities, coupon, pricing
 */

const Cart = {

  DELIVERY_FEE: 29,
  TAX_RATE: 0.05, // 5% GST
  FREE_DELIVERY_THRESHOLD: 499,

  // ── GETTERS ───────────────────────────────────────

  getItems() { return Storage.getCart(); },

  getCount() {
    return this.getItems().reduce((sum, item) => sum + item.quantity, 0);
  },

  getRestaurantId() {
    const items = this.getItems();
    return items.length ? items[0].restaurantId : null;
  },

  // ── ADD / REMOVE ──────────────────────────────────

  addItem(food, quantity = 1, customizations = []) {
    const cart = this.getItems();

    // Check if adding from different restaurant
    if (cart.length && cart[0].restaurantId !== food.restaurantId) {
      return {
        success: false,
        conflictRestaurant: cart[0].restaurantId,
        message: 'Your cart has items from another restaurant. Clear cart to add this item?'
      };
    }

    const existingIdx = cart.findIndex(item => item.foodId === food.id && JSON.stringify(item.customizations) === JSON.stringify(customizations));

    if (existingIdx !== -1) {
      cart[existingIdx].quantity = Utils.clamp(cart[existingIdx].quantity + quantity, 1, 20);
    } else {
      cart.push({
        foodId: food.id,
        restaurantId: food.restaurantId,
        name: food.name,
        price: food.price,
        image: food.image,
        isVeg: food.isVeg,
        quantity,
        customizations,
      });
    }

    Storage.setCart(cart);
    this.syncBadge();
    return { success: true };
  },

  removeItem(foodId) {
    const cart = this.getItems().filter(item => item.foodId !== foodId);
    Storage.setCart(cart);
    this.syncBadge();
  },

  updateQuantity(foodId, quantity) {
    let cart = this.getItems();
    if (quantity <= 0) {
      cart = cart.filter(item => item.foodId !== foodId);
    } else {
      const idx = cart.findIndex(item => item.foodId === foodId);
      if (idx !== -1) cart[idx].quantity = Utils.clamp(quantity, 1, 20);
    }
    Storage.setCart(cart);
    this.syncBadge();
  },

  clear(showConfirm = false) {
    if (showConfirm && !confirm('Clear your cart? This cannot be undone.')) return false;
    Storage.clearCart();
    this.syncBadge();
    return true;
  },

  // ── PRICING ───────────────────────────────────────

  getSubtotal() {
    return this.getItems().reduce((sum, item) => sum + item.price * item.quantity, 0);
  },

  getDeliveryFee(subtotal) {
    return subtotal >= this.FREE_DELIVERY_THRESHOLD ? 0 : this.DELIVERY_FEE;
  },

  getTax(subtotal) {
    return Math.round(subtotal * this.TAX_RATE);
  },

  getDiscount(couponCode) {
    if (!couponCode) return 0;
    const offer = OFFERS.find(o => o.code.toUpperCase() === couponCode.toUpperCase() && o.isActive);
    if (!offer) return 0;

    const subtotal = this.getSubtotal();
    if (subtotal < offer.minOrder) return 0;

    if (offer.type === 'flat') return Math.min(offer.discount, offer.maxDiscount);
    if (offer.type === 'percent') return Math.min(Math.round(subtotal * offer.discount / 100), offer.maxDiscount);
    if (offer.type === 'freeDelivery') return this.DELIVERY_FEE; // rebate delivery fee
    return 0;
  },

  getTotal(couponCode = null) {
    const subtotal = this.getSubtotal();
    const delivery = this.getDeliveryFee(subtotal);
    const tax = this.getTax(subtotal);
    const discount = this.getDiscount(couponCode);
    return Math.max(0, subtotal + delivery + tax - discount);
  },

  getPriceSummary(couponCode = null) {
    const subtotal = this.getSubtotal();
    const deliveryFull = this.DELIVERY_FEE;
    const delivery = this.getDeliveryFee(subtotal);
    const tax = this.getTax(subtotal);
    const discount = this.getDiscount(couponCode);
    const total = Math.max(0, subtotal + delivery + tax - discount);
    // Savings = discount + any free delivery benefit
    const freeDeliverySaving = (subtotal >= this.FREE_DELIVERY_THRESHOLD) ? deliveryFull : 0;
    const savings = discount + freeDeliverySaving;
    return { subtotal, delivery, tax, discount, total, savings };
  },

  // ── COUPON ────────────────────────────────────────

  applyCoupon(code) {
    const offer = OFFERS.find(o => o.code.toUpperCase() === code.toUpperCase() && o.isActive);
    if (!offer) return { success: false, message: 'Invalid coupon code.' };

    const subtotal = this.getSubtotal();
    if (subtotal < offer.minOrder) {
      return { success: false, message: `Minimum order ₹${offer.minOrder} required for this code.` };
    }

    const discount = this.getDiscount(code);
    return { success: true, discount, message: `${offer.description} — saving ₹${discount}!`, offer };
  },

  // ── SYNC UI ───────────────────────────────────────

  syncBadge() {
    UI.updateCartBadge(this.getCount());
  },

  // ── RENDER CART PAGE ──────────────────────────────

  renderCartPage() {
    const container = document.getElementById('cart-items-container');
    const emptyState = document.getElementById('cart-empty');
    const cartContent = document.getElementById('cart-content');
    if (!container) return;

    const items = this.getItems();

    if (!items.length) {
      if (emptyState) emptyState.style.display = '';
      if (cartContent) cartContent.style.display = 'none';
      return;
    }

    if (emptyState) emptyState.style.display = 'none';
    if (cartContent) cartContent.style.display = '';

    // Get restaurant info
    const restaurant = RESTAURANTS.find(r => r.id === items[0].restaurantId);
    const restaurantEl = document.getElementById('cart-restaurant-name');
    if (restaurantEl && restaurant) restaurantEl.textContent = restaurant.name;

    container.innerHTML = items.map(item => this.renderCartItem(item)).join('');

    // Bind quantity controls
    container.querySelectorAll('.qty-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const foodId = parseInt(btn.dataset.id);
        const action = btn.dataset.action;
        const current = this.getItems().find(i => i.foodId === foodId)?.quantity || 0;
        this.updateQuantity(foodId, action === 'inc' ? current + 1 : current - 1);
        this.renderCartPage();
        this.updatePriceSummary();
        UI.toast(action === 'inc' ? 'Item added' : current - 1 === 0 ? 'Item removed' : 'Item removed', 'success', 1000);
      });
    });

    // Remove buttons
    container.querySelectorAll('.remove-item-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const foodId = parseInt(btn.dataset.id);
        this.removeItem(foodId);
        this.renderCartPage();
        this.updatePriceSummary();
        UI.toast('Item removed from cart', 'info', 1500);
      });
    });

    // Wishlist from cart
    container.querySelectorAll('.cart-wishlist-btn').forEach(btn => {
      btn.addEventListener('click', () => {
        const foodId = parseInt(btn.dataset.id);
        const added = Storage.toggleWishlist(foodId);
        btn.innerHTML = added ? '<i class="bi bi-heart-fill"></i>' : '<i class="bi bi-heart"></i>';
        UI.toast(added ? 'Added to wishlist ❤️' : 'Removed from wishlist', added ? 'success' : 'info', 1500);
      });
    });

    this.updatePriceSummary();
  },

  renderCartItem(item) {
    const inWishlist = Storage.isInWishlist(item.foodId);
    return `
      <div class="cart-item" data-id="${item.foodId}">
        <div class="cart-item-img">
          <img src="${item.image}" alt="${item.name}" loading="lazy">
          ${item.isVeg ? '<span class="veg-dot veg"></span>' : '<span class="veg-dot nonveg"></span>'}
        </div>
        <div class="cart-item-info">
          <h4 class="cart-item-name">${item.name}</h4>
          ${item.customizations?.length ? `<p class="cart-item-custom">${item.customizations.join(', ')}</p>` : ''}
          <p class="cart-item-price">${Utils.formatPrice(item.price)}</p>
        </div>
        <div class="cart-item-actions">
          <button class="cart-wishlist-btn" data-id="${item.foodId}" title="Save for later">
            <i class="bi bi-heart${inWishlist ? '-fill' : ''}"></i>
          </button>
          <div class="qty-control">
            <button class="qty-btn qty-dec" data-id="${item.foodId}" data-action="dec">
              <i class="bi bi-dash"></i>
            </button>
            <span class="qty-value">${item.quantity}</span>
            <button class="qty-btn qty-inc" data-id="${item.foodId}" data-action="inc">
              <i class="bi bi-plus"></i>
            </button>
          </div>
          <p class="cart-item-total">${Utils.formatPrice(item.price * item.quantity)}</p>
          <button class="remove-item-btn" data-id="${item.foodId}" title="Remove">
            <i class="bi bi-trash3"></i>
          </button>
        </div>
      </div>
    `;
  },

  updatePriceSummary(couponCode = null) {
    const appliedEl = document.getElementById('applied-coupon');
    const code = couponCode || appliedEl?.dataset?.code || null;
    const summary = this.getPriceSummary(code);

    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    set('summary-subtotal', Utils.formatPrice(summary.subtotal));
    set('summary-delivery', summary.delivery === 0 ? 'FREE 🎉' : Utils.formatPrice(summary.delivery));
    set('summary-tax', Utils.formatPrice(summary.tax));
    set('summary-discount', summary.discount > 0 ? `-${Utils.formatPrice(summary.discount)}` : '—');
    set('summary-total', Utils.formatPrice(summary.total));

    // Show/hide discount row
    const discountRow = document.getElementById('discount-row');
    if (discountRow) discountRow.style.display = summary.discount > 0 ? '' : 'none';

    // Savings badge
    const savingsEl = document.getElementById('summary-savings');
    if (savingsEl) {
      savingsEl.style.display = summary.savings > 0 ? '' : 'none';
      if (summary.savings > 0) savingsEl.textContent = `You save ${Utils.formatPrice(summary.savings)} on this order!`;
    }

    // Update checkout button amount if present
    const checkoutAmtEl = document.querySelector('.checkout-btn-amount');
    if (checkoutAmtEl) checkoutAmtEl.textContent = Utils.formatPrice(summary.total);
  },

  initCouponInput() {
    const input = document.getElementById('coupon-input');
    const applyBtn = document.getElementById('apply-coupon-btn');
    const couponMsg = document.getElementById('coupon-message');
    const appliedEl = document.getElementById('applied-coupon');

    if (!applyBtn) return;

    applyBtn.addEventListener('click', () => {
      const code = input?.value.trim().toUpperCase();
      if (!code) { UI.toast('Enter a coupon code first.', 'warning'); return; }

      const result = this.applyCoupon(code);
      if (!result.success) {
        if (couponMsg) { couponMsg.textContent = result.message; couponMsg.className = 'coupon-message error'; }
        UI.toast(result.message, 'error');
        return;
      }

      if (couponMsg) { couponMsg.textContent = result.message; couponMsg.className = 'coupon-message success'; }
      if (appliedEl) {
        appliedEl.dataset.code = code;
        appliedEl.style.display = 'flex';
        const codeText = appliedEl.querySelector('.code-text');
        if (codeText) codeText.textContent = code;
      }
      if (input) input.value = '';
      this.updatePriceSummary(code);
      UI.toast(`Coupon applied! You save ${Utils.formatPrice(result.discount)} 🎉`, 'success');
    });

    // Remove coupon
    const removeBtn = document.getElementById('remove-coupon-btn');
    if (removeBtn) {
      removeBtn.addEventListener('click', () => {
        if (appliedEl) { appliedEl.dataset.code = ''; appliedEl.style.display = 'none'; }
        if (couponMsg) { couponMsg.textContent = ''; couponMsg.className = 'coupon-message'; }
        this.updatePriceSummary(null);
        UI.toast('Coupon removed.', 'info');
      });
    }
  },

  // ── ADD TO CART BUTTON ────────────────────────────

  initAddToCartButtons() {
    document.querySelectorAll('.add-to-cart-btn').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        const foodId = parseInt(btn.dataset.foodId);
        const food = FOODS.find(f => f.id === foodId);
        if (!food) return;

        const result = this.addItem(food);

        if (!result.success) {
          // Show conflict modal
          const modal = document.getElementById('conflict-modal');
          if (modal) {
            document.getElementById('conflict-restaurant-name').textContent =
              RESTAURANTS.find(r => r.id === result.conflictRestaurant)?.name || 'another restaurant';
            document.getElementById('conflict-new-item').textContent = food.name;
            UI.openModal('conflict-modal');

            document.getElementById('conflict-clear-btn').onclick = () => {
              this.clear();
              this.addItem(food);
              UI.closeModal('conflict-modal');
              this.syncBadge();
              UI.toast(`${food.name} added to cart 🛒`, 'success');
            };
          } else {
            if (confirm(result.message)) {
              this.clear();
              this.addItem(food);
              UI.toast(`${food.name} added to cart 🛒`, 'success');
            }
          }
          return;
        }

        // Animate button
        btn.classList.add('added');
        btn.innerHTML = '<i class="bi bi-check-lg"></i> Added';
        setTimeout(() => {
          btn.classList.remove('added');
          btn.innerHTML = '<i class="bi bi-plus"></i> Add';
        }, 1500);

        UI.toast(`${food.name} added to cart 🛒`, 'success');
      });
    });
  },
};
