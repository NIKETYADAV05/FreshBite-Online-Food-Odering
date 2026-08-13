/**
 * FreshBite - Storage Module
 * All LocalStorage operations centralized here
 */

const Storage = {
  // Keys
  KEYS: {
    CART: 'freshbite_cart',
    USER: 'freshbite_user',
    WISHLIST: 'freshbite_wishlist',
    ORDERS: 'freshbite_orders',
    RECENTLY_VIEWED: 'freshbite_recently_viewed',
    DARK_MODE: 'freshbite_dark_mode',
    ADDRESSES: 'freshbite_addresses',
    USERS_DB: 'freshbite_users_db',
    PROMO_USED: 'freshbite_promo_used',
    FAVORITE_RESTAURANTS: 'freshbite_fav_restaurants',
  },

  // Generic get
  get(key, fallback = null) {
    try {
      const val = localStorage.getItem(key);
      return val ? JSON.parse(val) : fallback;
    } catch (e) {
      console.error(`Storage.get error for key "${key}":`, e);
      return fallback;
    }
  },

  // Generic set
  set(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
      return true;
    } catch (e) {
      console.error(`Storage.set error for key "${key}":`, e);
      return false;
    }
  },

  // Remove key
  remove(key) {
    try {
      localStorage.removeItem(key);
      return true;
    } catch (e) {
      return false;
    }
  },

  // ── CART ──────────────────────────────────────────
  getCart() { return this.get(this.KEYS.CART, []); },
  setCart(cart) { return this.set(this.KEYS.CART, cart); },
  clearCart() { return this.remove(this.KEYS.CART); },

  // ── USER ──────────────────────────────────────────
  getUser() { return this.get(this.KEYS.USER, null); },
  setUser(user) { return this.set(this.KEYS.USER, user); },
  clearUser() { return this.remove(this.KEYS.USER); },

  // ── USERS DB (registered users) ───────────────────
  getUsersDB() { return this.get(this.KEYS.USERS_DB, []); },
  addUserToDB(user) {
    const users = this.getUsersDB();
    users.push(user);
    return this.set(this.KEYS.USERS_DB, users);
  },
  findUserByEmail(email) {
    return this.getUsersDB().find(u => u.email.toLowerCase() === email.toLowerCase()) || null;
  },

  // ── WISHLIST ──────────────────────────────────────
  getWishlist() { return this.get(this.KEYS.WISHLIST, []); },
  setWishlist(list) { return this.set(this.KEYS.WISHLIST, list); },
  toggleWishlist(foodId) {
    const list = this.getWishlist();
    const idx = list.indexOf(foodId);
    if (idx === -1) { list.push(foodId); }
    else { list.splice(idx, 1); }
    this.setWishlist(list);
    return idx === -1; // true = added
  },
  isInWishlist(foodId) { return this.getWishlist().includes(foodId); },

  // ── FAVORITE RESTAURANTS ──────────────────────────
  getFavoriteRestaurants() { return this.get(this.KEYS.FAVORITE_RESTAURANTS, []); },
  toggleFavoriteRestaurant(restaurantId) {
    const list = this.getFavoriteRestaurants();
    const idx = list.indexOf(restaurantId);
    if (idx === -1) { list.push(restaurantId); }
    else { list.splice(idx, 1); }
    this.set(this.KEYS.FAVORITE_RESTAURANTS, list);
    return idx === -1;
  },
  isFavoriteRestaurant(restaurantId) { return this.getFavoriteRestaurants().includes(restaurantId); },

  // ── ORDERS ────────────────────────────────────────
  getOrders() { return this.get(this.KEYS.ORDERS, []); },
  addOrder(order) {
    const orders = this.getOrders();
    orders.unshift(order); // newest first
    return this.set(this.KEYS.ORDERS, orders);
  },

  // ── RECENTLY VIEWED ───────────────────────────────
  getRecentlyViewed() { return this.get(this.KEYS.RECENTLY_VIEWED, []); },
  addRecentlyViewed(foodId) {
    let list = this.getRecentlyViewed();
    list = list.filter(id => id !== foodId);
    list.unshift(foodId);
    list = list.slice(0, 12); // keep last 12
    this.set(this.KEYS.RECENTLY_VIEWED, list);
  },

  // ── ADDRESSES ─────────────────────────────────────
  getAddresses() { return this.get(this.KEYS.ADDRESSES, []); },
  addAddress(address) {
    const addrs = this.getAddresses();
    address.id = Date.now();
    addrs.push(address);
    return this.set(this.KEYS.ADDRESSES, addrs);
  },
  removeAddress(id) {
    const addrs = this.getAddresses().filter(a => a.id !== id);
    return this.set(this.KEYS.ADDRESSES, addrs);
  },
  setDefaultAddress(id) {
    const addrs = this.getAddresses().map(a => ({ ...a, isDefault: a.id === id }));
    return this.set(this.KEYS.ADDRESSES, addrs);
  },

  // ── DARK MODE ─────────────────────────────────────
  getDarkMode() { return this.get(this.KEYS.DARK_MODE, false); },
  setDarkMode(val) { return this.set(this.KEYS.DARK_MODE, val); },

  // ── PROMO CODES ───────────────────────────────────
  getUsedPromos() { return this.get(this.KEYS.PROMO_USED, []); },
  markPromoUsed(code) {
    const used = this.getUsedPromos();
    if (!used.includes(code)) { used.push(code); this.set(this.KEYS.PROMO_USED, used); }
  },
  isPromoUsed(code) { return this.getUsedPromos().includes(code); },
};
