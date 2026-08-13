/**
 * FreshBite - Checkout Module
 * Multi-step checkout: Address → Time → Payment → Confirm
 */

const Checkout = {
  currentStep: 1,
  totalSteps: 3,
  selectedAddress: null,
  selectedTime: 'asap',
  selectedPayment: 'cod',
  appliedCoupon: null,

  init() {
    if (!Cart.getCount()) { window.location.href = 'cart.html'; return; }
    this.renderOrderSummary();
    this.renderAddressStep();
    this.renderTimeStep();
    this.renderPaymentStep();
    this.bindStepNavigation();
    this.showStep(1);
  },

  showStep(step) {
    this.currentStep = step;
    document.querySelectorAll('.checkout-step-panel').forEach((el, i) => {
      el.classList.toggle('active', i + 1 === step);
    });
    document.querySelectorAll('.step-indicator').forEach((el, i) => {
      el.classList.remove('active', 'done');
      if (i + 1 < step) el.classList.add('done');
      else if (i + 1 === step) el.classList.add('active');
    });
    const nextBtn = document.getElementById('checkout-next-btn');
    const backBtn = document.getElementById('checkout-back-btn');
    if (nextBtn) {
      if (step === this.totalSteps) {
        nextBtn.innerHTML = '<i class="bi bi-bag-check-fill"></i> Place Order';
        nextBtn.classList.add('place-order-pulse');
      } else {
        nextBtn.innerHTML = 'Continue <i class="bi bi-arrow-right"></i>';
        nextBtn.classList.remove('place-order-pulse');
      }
    }
    if (backBtn) backBtn.style.display = step > 1 ? '' : 'none';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  },

  bindStepNavigation() {
    document.getElementById('checkout-next-btn')?.addEventListener('click', () => {
      if (!this.validateStep(this.currentStep)) return;
      if (this.currentStep === this.totalSteps) this.placeOrder();
      else this.showStep(this.currentStep + 1);
    });
    document.getElementById('checkout-back-btn')?.addEventListener('click', () => {
      if (this.currentStep > 1) this.showStep(this.currentStep - 1);
    });
  },

validateStep(step) {
    if (step === 1 && !this.selectedAddress) {
      UI.toast('Please select a delivery address.', 'error'); return false;
    }
    if (step === 2 && !this.selectedTime) {
      UI.toast('Please select a delivery time.', 'error'); return false;
    }
    if (step === 3 && !this.validatePayment()) {
      return false;
    }
    return true;
  },

  // ── STEP 3: PAYMENT VALIDATION ────────────────────

  validatePayment() {
    const method = this.selectedPayment;

    if (method === 'card') {
      const cardNum = document.getElementById('card-number');
      const expiry = document.querySelector('#card-form input[placeholder="MM/YY"]');
      const cvv = document.querySelector('#card-form input[placeholder="•••"]');
      const name = document.querySelector('#card-form input[placeholder="John Doe"]');

      const digits = (cardNum?.value || '').replace(/\s/g, '');
      if (digits.length < 12) { UI.toast('Please enter a valid card number.', 'error'); return false; }
      if (!/^(0[1-9]|1[0-2])\/\d{2}$/.test(expiry?.value || '')) { UI.toast('Please enter a valid expiry (MM/YY).', 'error'); return false; }
      if (!/^\d{3,4}$/.test(cvv?.value || '')) { UI.toast('Please enter a valid CVV.', 'error'); return false; }
      if (!(name?.value || '').trim()) { UI.toast('Please enter the name on card.', 'error'); return false; }
    }

    if (method === 'upi') {
      const upiInput = document.querySelector('#upi-form input');
      const val = (upiInput?.value || '').trim();
      if (!val) { UI.toast('Please enter your UPI ID.', 'error'); return false; }
      if (!/^[\w.\-]{2,}@[a-zA-Z]{2,}$/.test(val)) { UI.toast('Please enter a valid UPI ID (e.g. name@upi).', 'error'); return false; }
    }

    return true;
  },

  // ── STEP 1: ADDRESS ───────────────────────────────

  renderAddressStep() {
    const container = document.getElementById('address-step');
    if (!container) return;

    const savedAddresses = [
      { id: 'addr1', label: 'Home', icon: 'bi-house-fill', address: '12, Sunshine Apartments, MG Road', city: 'Mumbai', pincode: '400001', isDefault: true },
      { id: 'addr2', label: 'Work', icon: 'bi-briefcase-fill', address: '5th Floor, Tech Park, Bandra Kurla Complex', city: 'Mumbai', pincode: '400051', isDefault: false },
      ...Storage.getAddresses(),
    ];

    this.selectedAddress = savedAddresses.find(a => a.isDefault) || savedAddresses[0];

    container.innerHTML = `
      <div class="address-list" id="address-list">
        ${savedAddresses.map(addr => this.renderAddressCard(addr)).join('')}
      </div>
      <button class="btn-add-address" id="add-addr-toggle">
        <i class="bi bi-plus-circle"></i> Add New Address
      </button>
      <div id="new-addr-form" class="new-addr-form" style="display:none">
        <h4>New Address</h4>
        <div class="form-row">
          <div class="form-group"><label>Full Name</label><input type="text" id="na-name" placeholder="John Doe" class="form-control"></div>
          <div class="form-group"><label>Phone</label><input type="tel" id="na-phone" placeholder="9876543210" class="form-control"></div>
        </div>
        <div class="form-group"><label>Address Line 1</label><input type="text" id="na-addr1" placeholder="Flat/House No, Building Name, Street" class="form-control"></div>
        <div class="form-group"><label>Address Line 2</label><input type="text" id="na-addr2" placeholder="Area, Landmark" class="form-control"></div>
        <div class="form-row">
          <div class="form-group"><label>City</label><input type="text" id="na-city" placeholder="Mumbai" class="form-control"></div>
          <div class="form-group"><label>Pincode</label><input type="text" id="na-pin" placeholder="400001" class="form-control"></div>
        </div>
        <div class="form-group">
          <label>Address Type</label>
          <div class="addr-type-group">
            <label class="addr-type-btn"><input type="radio" name="addr-type" value="Home" checked> <i class="bi bi-house"></i> Home</label>
            <label class="addr-type-btn"><input type="radio" name="addr-type" value="Work"> <i class="bi bi-briefcase"></i> Work</label>
            <label class="addr-type-btn"><input type="radio" name="addr-type" value="Other"> <i class="bi bi-geo-alt"></i> Other</label>
          </div>
        </div>
        <button class="btn-save-addr" id="save-addr-btn"><i class="bi bi-check-lg"></i> Save Address</button>
      </div>
    `;

    // Bind address card selection
    container.querySelectorAll('.address-card').forEach(card => {
      card.addEventListener('click', () => {
        container.querySelectorAll('.address-card').forEach(c => c.classList.remove('selected'));
        card.classList.add('selected');
        this.selectedAddress = savedAddresses.find(a => a.id === card.dataset.id);
      });
    });

    // Toggle add form
    document.getElementById('add-addr-toggle')?.addEventListener('click', () => {
      const form = document.getElementById('new-addr-form');
      form.style.display = form.style.display === 'none' ? '' : 'none';
    });

    // Save new address
    document.getElementById('save-addr-btn')?.addEventListener('click', () => {
      const name = document.getElementById('na-name').value.trim();
      const addr1 = document.getElementById('na-addr1').value.trim();
      const city = document.getElementById('na-city').value.trim();
      const pin = document.getElementById('na-pin').value.trim();
      const type = document.querySelector('input[name="addr-type"]:checked')?.value || 'Home';
      if (!name || !addr1 || !city || !pin) { UI.toast('Please fill all required fields.', 'error'); return; }
      const newAddr = { id: 'new_' + Date.now(), label: type, icon: type === 'Home' ? 'bi-house-fill' : type === 'Work' ? 'bi-briefcase-fill' : 'bi-geo-alt-fill', address: addr1, city, pincode: pin, isDefault: false };
      Storage.addAddress(newAddr);
      this.selectedAddress = newAddr;
      UI.toast('Address saved!', 'success');
      document.getElementById('new-addr-form').style.display = 'none';
      // Re-render
      this.renderAddressStep();
    });
  },

  renderAddressCard(addr) {
    return `
      <div class="address-card ${addr.isDefault ? 'selected' : ''}" data-id="${addr.id}">
        <div class="addr-card-icon"><i class="bi ${addr.icon || 'bi-geo-alt-fill'}"></i></div>
        <div class="addr-card-body">
          <div class="addr-card-label">${addr.label} ${addr.isDefault ? '<span class="default-tag">Default</span>' : ''}</div>
          <p class="addr-card-text">${addr.address}</p>
          <p class="addr-card-city">${addr.city}, ${addr.pincode}</p>
        </div>
        <div class="addr-select-dot"><i class="bi bi-check-circle-fill"></i></div>
      </div>`;
  },

  // ── STEP 2: DELIVERY TIME ─────────────────────────

  renderTimeStep() {
    const container = document.getElementById('time-step');
    if (!container) return;
    const slots = [
      { id: 'asap', label: 'ASAP', sublabel: '25–40 min', icon: '⚡' },
      { id: 'slot1', label: '12:00 PM – 1:00 PM', sublabel: 'Today', icon: '🕛' },
      { id: 'slot2', label: '1:00 PM – 2:00 PM', sublabel: 'Today', icon: '🕐' },
      { id: 'slot3', label: '7:00 PM – 8:00 PM', sublabel: 'Today', icon: '🕖' },
      { id: 'slot4', label: '8:00 PM – 9:00 PM', sublabel: 'Today', icon: '🕗' },
    ];
    container.innerHTML = `
      <h3 class="step-section-title"><i class="bi bi-clock"></i> Choose Delivery Time</h3>
      <div class="time-slots">
        ${slots.map(s => `
          <label class="time-slot-card ${s.id === 'asap' ? 'selected' : ''}">
            <input type="radio" name="delivery-time" value="${s.id}" ${s.id === 'asap' ? 'checked' : ''}>
            <span class="slot-icon">${s.icon}</span>
            <div class="slot-info">
              <span class="slot-label">${s.label}</span>
              <span class="slot-sub">${s.sublabel}</span>
            </div>
            <span class="slot-check"><i class="bi bi-check-circle-fill"></i></span>
          </label>
        `).join('')}
      </div>
      <div class="delivery-instructions">
        <label class="form-label"><i class="bi bi-chat-text"></i> Delivery Instructions (optional)</label>
        <textarea id="delivery-instructions" class="form-control" rows="2"
          placeholder="E.g. Leave at door, Ring bell, Call on arrival..."></textarea>
      </div>`;
    container.querySelectorAll('input[name="delivery-time"]').forEach(radio => {
      radio.addEventListener('change', () => {
        container.querySelectorAll('.time-slot-card').forEach(c => c.classList.remove('selected'));
        radio.closest('.time-slot-card').classList.add('selected');
        this.selectedTime = radio.value;
      });
    });
  },

  // ── STEP 3: PAYMENT ───────────────────────────────

  renderPaymentStep() {
    const container = document.getElementById('payment-step');
    if (!container) return;
    const methods = [
      { id: 'cod', label: 'Cash on Delivery', icon: 'bi-cash-stack', sub: 'Pay when your order arrives' },
      { id: 'upi', label: 'UPI / GPay / PhonePe', icon: 'bi-phone-fill', sub: 'Instant payment via UPI' },
      { id: 'card', label: 'Credit / Debit Card', icon: 'bi-credit-card-2-front-fill', sub: 'Visa, Mastercard, RuPay' },
      { id: 'wallet', label: 'FreshBite Wallet', icon: 'bi-wallet2', sub: 'Balance: ₹0.00' },
    ];
    container.innerHTML = `
      <h3 class="step-section-title"><i class="bi bi-shield-check"></i> Payment Method</h3>
      <div class="payment-methods">
        ${methods.map(m => `
          <label class="payment-card ${m.id === 'cod' ? 'selected' : ''}">
            <input type="radio" name="payment" value="${m.id}" ${m.id === 'cod' ? 'checked' : ''}>
            <i class="bi ${m.icon} payment-icon"></i>
            <div class="payment-info">
              <span class="payment-label">${m.label}</span>
              <span class="payment-sub">${m.sub}</span>
            </div>
            <span class="payment-check"><i class="bi bi-check-circle-fill"></i></span>
          </label>
        `).join('')}
      </div>
      <div id="card-form" class="card-form" style="display:none">
        <div class="form-group"><label>Card Number</label>
          <input type="text" class="form-control" placeholder="1234 5678 9012 3456" maxlength="19" id="card-number">
        </div>
        <div class="form-row">
          <div class="form-group"><label>Expiry</label><input type="text" class="form-control" placeholder="MM/YY" maxlength="5"></div>
          <div class="form-group"><label>CVV</label><input type="password" class="form-control" placeholder="•••" maxlength="3"></div>
        </div>
        <div class="form-group"><label>Name on Card</label><input type="text" class="form-control" placeholder="John Doe"></div>
      </div>
      <div id="upi-form" class="upi-form" style="display:none">
        <div class="form-group"><label>UPI ID</label>
          <input type="text" class="form-control" placeholder="yourname@upi">
        </div>
        <div class="upi-apps">
          ${['GPay','PhonePe','Paytm','BHIM'].map(app => `<button class="upi-app-btn" type="button">${app}</button>`).join('')}
        </div>
      </div>
      <div class="secure-badge"><i class="bi bi-shield-lock-fill"></i> 100% Secure & Encrypted Payments</div>`;

    // Card number formatting
    document.getElementById('card-number')?.addEventListener('input', (e) => {
      e.target.value = e.target.value.replace(/\D/g, '').replace(/(.{4})/g, '$1 ').trim().slice(0, 19);
    });

    container.querySelectorAll('input[name="payment"]').forEach(radio => {
      radio.addEventListener('change', () => {
        container.querySelectorAll('.payment-card').forEach(c => c.classList.remove('selected'));
        radio.closest('.payment-card').classList.add('selected');
        this.selectedPayment = radio.value;
        document.getElementById('card-form').style.display = radio.value === 'card' ? '' : 'none';
        document.getElementById('upi-form').style.display = radio.value === 'upi' ? '' : 'none';
      });
    });
  },

  // ── ORDER SUMMARY SIDEBAR ─────────────────────────

  renderOrderSummary() {
    const container = document.getElementById('checkout-order-summary');
    if (!container) return;
    const items = Cart.getItems();
    const restaurant = RESTAURANTS.find(r => r.id === items[0]?.restaurantId);
    const summary = Cart.getPriceSummary(this.appliedCoupon);

    container.innerHTML = `
      <div class="summary-restaurant">
        ${restaurant ? `<img src="${restaurant.logo}" alt="${restaurant.name}" class="summary-rest-logo">
        <span class="summary-rest-name">${restaurant.name}</span>` : ''}
      </div>
      <div class="summary-items">
        ${items.map(item => `
          <div class="summary-item">
            <span class="summary-item-name">${item.name} <span class="summary-qty">×${item.quantity}</span></span>
            <span class="summary-item-price">${Utils.formatPrice(item.price * item.quantity)}</span>
          </div>`).join('')}
      </div>
      <div class="summary-divider"></div>
      <div class="summary-coupon">
        <input type="text" id="checkout-coupon" class="form-control coupon-input" placeholder="Promo code">
        <button id="apply-checkout-coupon" class="btn-apply-coupon">Apply</button>
      </div>
      <div id="checkout-coupon-msg" class="coupon-message"></div>
      <div class="summary-divider"></div>
      <div class="price-breakdown">
        <div class="price-row"><span>Subtotal</span><span id="co-subtotal">${Utils.formatPrice(summary.subtotal)}</span></div>
        <div class="price-row"><span>Delivery</span><span id="co-delivery">${summary.delivery === 0 ? 'FREE 🎉' : Utils.formatPrice(summary.delivery)}</span></div>
        <div class="price-row"><span>GST (5%)</span><span id="co-tax">${Utils.formatPrice(summary.tax)}</span></div>
        ${summary.discount > 0 ? `<div class="price-row discount-row"><span>Discount</span><span id="co-discount" class="discount-amt">-${Utils.formatPrice(summary.discount)}</span></div>` : ''}
      </div>
      <div class="summary-total">
        <span>Total</span>
        <span id="co-total" class="total-price">${Utils.formatPrice(summary.total)}</span>
      </div>
      ${summary.savings > 0 ? `<div class="savings-badge">🎉 You save ${Utils.formatPrice(summary.savings)} on this order!</div>` : ''}
    `;

    // Coupon
    document.getElementById('apply-checkout-coupon')?.addEventListener('click', () => {
      const code = document.getElementById('checkout-coupon').value.trim().toUpperCase();
      if (!code) { UI.toast('Enter a coupon code.', 'warning'); return; }
      const result = Cart.applyCoupon(code);
      const msgEl = document.getElementById('checkout-coupon-msg');
      if (msgEl) { msgEl.textContent = result.message; msgEl.className = `coupon-message ${result.success ? 'success' : 'error'}`; }
      if (result.success) { this.appliedCoupon = code; this.renderOrderSummary(); UI.toast(`Coupon applied! Saving ${Utils.formatPrice(result.discount)} 🎉`, 'success'); }
      else UI.toast(result.message, 'error');
    });
  },

  // ── PLACE ORDER ───────────────────────────────────

  placeOrder() {
    const user = Storage.getUser();
    if (!user) { window.location.href = 'login.html?redirect=checkout.html'; return; }

    const items = Cart.getItems();
    const summary = Cart.getPriceSummary(this.appliedCoupon);
    const restaurant = RESTAURANTS.find(r => r.id === items[0]?.restaurantId);

    const order = {
      id: Utils.generateOrderId(),
      date: new Date().toISOString(),
      userId: user.id,
      restaurant: { id: restaurant?.id, name: restaurant?.name, logo: restaurant?.logo },
      items: items.map(i => ({ name: i.name, quantity: i.quantity, price: i.price })),
      address: this.selectedAddress,
      deliveryTime: this.selectedTime,
      payment: this.selectedPayment,
      coupon: this.appliedCoupon,
      ...summary,
      status: 'confirmed',
      estimatedDelivery: new Date(Date.now() + 35 * 60000).toISOString(),
      timeline: [
        { label: 'Order Placed', time: new Date().toISOString(), done: true },
        { label: 'Confirmed by Restaurant', time: null, done: false },
        { label: 'Being Prepared', time: null, done: false },
        { label: 'Out for Delivery', time: null, done: false },
        { label: 'Delivered', time: null, done: false },
      ],
    };

    Storage.addOrder(order);
    Cart.clear();

    // Show success modal
    this.showOrderSuccess(order);
  },

  showOrderSuccess(order) {
    const modal = document.getElementById('order-success-modal');
    if (modal) {
      document.getElementById('success-order-id').textContent = order.id;
      document.getElementById('success-total').textContent = Utils.formatPrice(order.total);
      document.getElementById('success-delivery-time').textContent = '30–40 minutes';
      UI.openModal('order-success-modal');
    } else {
      // Fallback: redirect to profile with order
      window.location.href = `profile.html?tab=orders&order=${order.id}`;
    }
  },
};
