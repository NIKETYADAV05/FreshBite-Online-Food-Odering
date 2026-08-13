# 🍔 FreshBite — Premium Food Ordering Website

A complete, production-ready food delivery platform built with **HTML5, CSS3, and Vanilla JavaScript**. No frameworks, no backend, no database — just pure frontend excellence.

---

## 🚀 Quick Start

1. **Open the project folder**
2. **Double-click `index.html`** — that's it!
3. Or open with Live Server in VS Code for best experience

**No installation required.** Everything runs locally in the browser.

---

## ✨ Features

### 🍽️ **For Customers**
- Browse 8 hand-picked restaurants across 8 cuisines
- Advanced search & filtering (cuisine, rating, price, dietary)
- Real-time cart management with smart conflict resolution
- Multi-step checkout (address → delivery time → payment)
- Order history & tracking with timeline
- Wishlist & favorites
- Promo codes & coupons with auto-discount
- User profile with saved addresses
- Dark mode toggle
- Fully responsive (mobile, tablet, desktop)

### 🏪 **Restaurant Features**
- Stunning restaurant detail pages
- Dynamic menu with sticky category navigation
- Food detail pages with nutrition facts, ingredients, customizations
- Ratings & reviews system
- Real-time delivery time estimates
- Featured/Popular/Chef Special badges

### 🎨 **Design Highlights**
- **Premium UI**: Gradient backgrounds, glassmorphism, soft shadows
- **Smooth Animations**: Scroll reveals, hover lifts, fade-ins, skeleton loading
- **Micro-interactions**: Cart pop animation, ripple effects, toast notifications
- **Professional Typography**: Poppins + Nunito from Google Fonts
- **Color Theme**: `#FF6B35` (Primary Orange) with luxury secondary palette

---

## 📁 Project Structure

```
FreshBite/
├── index.html              # Home (hero, categories, featured, flash sale)
├── restaurants.html        # Restaurant listing (filters, sort, search)
├── restaurant.html         # Restaurant detail (menu, reviews, sticky nav)
├── product.html            # Food detail (gallery, nutrition, customize)
├── cart.html               # Shopping cart (items, coupon, summary)
├── checkout.html           # 3-step checkout + success modal
├── profile.html            # User dashboard (orders, wishlist, addresses)
├── login.html              # Split-screen login with social buttons
├── register.html           # Registration with password strength indicator
├── about.html              # About page (story, team, achievements, gallery)
├── contact.html            # Contact page (info cards, form, FAQ accordion)
│
├── css/
│   ├── style.css           # Root variables, reset, base components
│   ├── animations.css      # Keyframe animations & transitions
│   ├── components.css      # Page-specific component styles
│   └── responsive.css      # Mobile-first responsive breakpoints
│
├── js/
│   ├── data.js             # Mock data (8 restaurants, 23 foods, offers)
│   ├── storage.js          # LocalStorage helpers
│   ├── utils.js            # Pure utility functions
│   ├── ui.js               # UI components (toasts, modals, dark mode)
│   ├── auth.js             # Login/register/logout
│   ├── cart.js             # Cart operations & pricing logic
│   ├── restaurant.js       # Restaurant listing & detail
│   ├── products.js         # Product detail page logic
│   ├── checkout.js         # Multi-step checkout flow
│   └── app.js              # Main entry point & page router
│
└── assets/
    ├── images/             # (Placeholder — uses Unsplash CDN)
    └── icons/              # (Bootstrap Icons via CDN)
```

---

## 🎯 Tech Stack

| Layer | Technology |
|-------|------------|
| **HTML** | Semantic HTML5, ARIA labels, SEO meta tags |
| **CSS** | CSS3, CSS Variables, Flexbox, Grid, Animations |
| **JavaScript** | ES6+, Modules, LocalStorage, IntersectionObserver |
| **Icons** | Bootstrap Icons 1.11.3 |
| **Fonts** | Google Fonts (Poppins, Nunito) |
| **Images** | Unsplash API (CDN) |

**No external libraries.** Pure vanilla code.

---

## 🧪 Data Architecture

All data is stored in **LocalStorage** with structured JSON:

```javascript
// Cart Structure
{
  foodId: 101,
  restaurantId: 1,
  name: "Margherita Pizza",
  price: 349,
  quantity: 2,
  customizations: ["Extra Cheese", "Thin Crust"]
}

// User Structure
{
  id: "u_1234567890",
  name: "Rahul Sharma",
  email: "rahul@example.com",
  phone: "9876543210",
  joinDate: "2026-08-07T00:00:00.000Z"
}

// Order Structure
{
  id: "FBXYZ123",
  date: "2026-08-07T12:34:56.000Z",
  restaurant: { id: 1, name: "Pizza Palace" },
  items: [...],
  address: {...},
  subtotal: 698,
  delivery: 29,
  tax: 35,
  discount: 50,
  total: 712,
  status: "confirmed",
  timeline: [...]
}
```

---

## 🔥 Key Features Deep Dive

### **1. Smart Cart Conflict Resolution**
When adding items from a different restaurant, users get a modal:
- "Your cart has items from Restaurant A"
- Options: Keep current cart OR clear and start fresh

### **2. Dynamic Pricing Engine**
```javascript
// Real-time calculation
Subtotal = Σ(price × quantity)
Delivery Fee = ₹29 (FREE if subtotal ≥ ₹499)
GST = 5% of subtotal
Discount = Coupon/offer discount
Total = Subtotal + Delivery + GST - Discount
```

### **3. Multi-Step Checkout**
- **Step 1**: Select/add delivery address (with saved addresses)
- **Step 2**: Choose delivery time (ASAP or scheduled slots)
- **Step 3**: Select payment method (COD, UPI, Card, Wallet)
- **Success Modal**: Order ID, tracking timeline, estimated delivery

### **4. Dark Mode**
- Toggle in navbar
- Persists across sessions (LocalStorage)
- Smooth transitions on all components
- Separate color palette for dark theme

### **5. Search & Filters**
**Restaurants Page:**
- Search by name/cuisine
- Filter: Open Now, Veg Only, Rating (4.5+, 4.0+), Price ($, $$, $$$), Cuisine
- Sort: Popularity, Rating, Delivery Time, Price, Newest

**Menu Search:**
- Real-time search within restaurant menu
- Debounced for performance

### **6. Animations**
- **Scroll Reveal**: Cards fade-up when entering viewport
- **Skeleton Loading**: Shimmer placeholders while data loads
- **Micro-interactions**: Button ripples, cart pop, hover lifts
- **Page Transitions**: Smooth fade-ins on navigation

---

## 📱 Responsive Breakpoints

```css
/* Mobile First Approach */
Base: 320px+           /* Mobile phones */
Tablet: 768px+         /* Tablets */
Laptop: 1024px+        /* Small laptops */
Desktop: 1280px+       /* Large screens */
```

**All components are fully responsive** with:
- Mobile hamburger menu
- Stacked layouts on mobile
- Touch-friendly buttons
- Optimized images

---

## 🎨 Design System

### **Colors**
```css
Primary:        #FF6B35  /* Vibrant Orange */
Secondary:      #FFF8F0  /* Warm Cream */
Dark:           #2D1B12  /* Rich Brown */
Success:        #2ECC71  /* Fresh Green */
Danger:         #E74C3C  /* Alert Red */
```

### **Typography**
- **Headings**: Poppins (Bold, 700-900)
- **Body**: Poppins (Regular, 400-600)
- **Secondary**: Nunito (for subtitles)

### **Spacing Scale**
```
4px, 8px, 12px, 16px, 24px, 32px, 48px, 64px, 80px
```

### **Border Radius**
```css
--radius-sm:  8px
--radius-md:  14px
--radius-lg:  20px
--radius-xl:  28px
--radius-full: 9999px
```

---

## 🚦 How It Works

### **Page Initialization**
```javascript
// app.js detects current page and initializes correct module
if (page === 'index.html') initHomePage();
if (page === 'restaurants.html') RestaurantModule.initListingPage();
if (page === 'cart.html') { Cart.renderCartPage(); Cart.initCouponInput(); }
```

### **Cart Flow**
```
Browse → Add to Cart → Cart Page → Apply Coupon → Checkout → Order Success
```

### **LocalStorage Keys**
```javascript
freshbite_cart          // Cart items
freshbite_user          // Logged-in user
freshbite_wishlist      // Wishlisted food IDs
freshbite_orders        // Order history
freshbite_addresses     // Saved addresses
freshbite_dark_mode     // Dark mode preference
freshbite_users_db      // Registered users
```

---

## 🧩 Modular Architecture

Each JS module is **self-contained** with clear responsibilities:

| Module | Responsibility |
|--------|---------------|
| `data.js` | Static mock data (restaurants, foods, offers) |
| `storage.js` | LocalStorage CRUD operations |
| `utils.js` | Pure functions (format, validate, DOM helpers) |
| `ui.js` | UI components (toasts, modals, dark mode, navbar) |
| `auth.js` | Authentication logic (login, register, logout) |
| `cart.js` | Cart state management & pricing |
| `restaurant.js` | Restaurant listing, filtering, detail pages |
| `products.js` | Product detail page (gallery, nutrition, customize) |
| `checkout.js` | Multi-step checkout flow |
| `app.js` | Page router & initialization |

---

## 🎓 Educational Value

Perfect for learning:
- ✅ Modern CSS techniques (Grid, Flexbox, Variables, Animations)
- ✅ Vanilla JavaScript ES6+ (no jQuery)
- ✅ LocalStorage for client-side persistence
- ✅ Modular JavaScript architecture
- ✅ Responsive design patterns
- ✅ Accessibility (ARIA labels, semantic HTML)
- ✅ Performance optimization (lazy loading, debouncing)
- ✅ State management without frameworks

---

## 🐛 Testing Checklist

### **Core Flows**
- [ ] Register → Login → Browse → Add to Cart → Checkout → Place Order
- [ ] Apply coupon codes (FRESH50, SAVE20, FREEDEL)
- [ ] Cart conflict when adding from different restaurant
- [ ] Wishlist add/remove
- [ ] Profile tabs (orders, wishlist, addresses, edit)
- [ ] Dark mode toggle

### **Edge Cases**
- [ ] Empty cart state
- [ ] Empty wishlist state
- [ ] No orders in history
- [ ] Invalid coupon code
- [ ] Checkout without login (redirects to login)
- [ ] Password strength indicator
- [ ] Form validation on login/register

### **Responsive**
- [ ] Mobile hamburger menu
- [ ] Tablet layout (2-column grids)
- [ ] Desktop layout (full navigation)
- [ ] Cart on mobile (stacked layout)
- [ ] Checkout steps on mobile

---

## 🔮 Future Enhancements

**If adding a backend:**
- Connect to real restaurant APIs
- Payment gateway integration (Stripe, Razorpay)
- Real-time order tracking with WebSockets
- Push notifications
- Email confirmations
- User authentication with JWT
- Restaurant admin dashboard

**Additional Features:**
- Voice search
- AR food preview
- Allergen filters
- Calorie tracker
- Group ordering
- Scheduled orders
- Loyalty points program

---

## 📝 Credits

**Built for**: Web Development Internship Project  
**Design**: Inspired by Uber Eats, Swiggy, Zomato, DoorDash  
**Images**: [Unsplash](https://unsplash.com) (food photography)  
**Icons**: [Bootstrap Icons](https://icons.getbootstrap.com)  
**Fonts**: [Google Fonts](https://fonts.google.com) (Poppins, Nunito)

---

## 📜 License

This is an educational project. Feel free to use, modify, and learn from the code.

---

## 🙌 Acknowledgments

Created with ❤️ for food lovers everywhere. Bon appétit! 🍕🍔🍣

---

**⭐ If you found this helpful, star the project!**
#   F r e s h B i t e - O n l i n e - F o o d - O d e r i n g  
 