/**
 * FreshBite - Application Data
 * All static data: restaurants, foods, categories, offers, reviews
 */

// ==================== CATEGORIES ====================
const CATEGORIES = [
  { id: 1, name: 'Pizza', icon: '🍕', image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?w=200&q=80', count: 48 },
  { id: 2, name: 'Burgers', icon: '🍔', image: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=200&q=80', count: 35 },
  { id: 3, name: 'Sushi', icon: '🍣', image: 'https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=200&q=80', count: 22 },
  { id: 4, name: 'Indian', icon: '🍛', image: 'https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=200&q=80', count: 60 },
  { id: 5, name: 'Chinese', icon: '🍜', image: 'https://images.unsplash.com/photo-1563245372-f21724e3856d?w=200&q=80', count: 41 },
  { id: 6, name: 'Desserts', icon: '🍰', image: 'https://images.unsplash.com/photo-1551024601-bec78aea704b?w=200&q=80', count: 29 },
  { id: 7, name: 'Healthy', icon: '🥗', image: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=200&q=80', count: 18 },
  { id: 8, name: 'Mexican', icon: '🌮', image: 'https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=200&q=80', count: 27 },
  { id: 9, name: 'Drinks', icon: '🥤', image: 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=200&q=80', count: 33 },
  { id: 10, name: 'Pasta', icon: '🍝', image: 'https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=200&q=80', count: 21 },
];


// ==================== RESTAURANTS ====================
const RESTAURANTS = [
  {
    id: 1,
    name: "The Pizza Palace",
    logo: "https://images.unsplash.com/photo-1571997478779-2adcbbe9ab2f?w=80&q=80",
    coverImage: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=800&q=80",
    cuisine: ["Pizza", "Italian", "Pasta"],
    rating: 4.8,
    reviewCount: 1240,
    deliveryTime: "25-35",
    deliveryFee: 29,
    minOrder: 199,
    priceRange: "$$",
    isOpen: true,
    isFeatured: true,
    isVeg: false,
    tags: ["Best Seller", "Top Rated"],
    offer: "20% off on orders above ₹499",
    offerCode: "PIZZA20",
    address: "12 Marina Drive, Food Court",
    lat: 19.076,
    lng: 72.877,
    description: "Authentic Italian pizzas baked in wood-fired ovens. Premium ingredients, crispy crust, and legendary flavors since 1998.",
    categories: ["Recommended", "Starters", "Pizzas", "Pasta", "Desserts", "Drinks"],
  },
  {
    id: 2,
    name: "Burger Barn",
    logo: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=80&q=80",
    coverImage: "https://images.unsplash.com/photo-1561758033-d89a9ad46330?w=800&q=80",
    cuisine: ["Burgers", "American", "Sides"],
    rating: 4.6,
    reviewCount: 980,
    deliveryTime: "20-30",
    deliveryFee: 19,
    minOrder: 149,
    priceRange: "$",
    isOpen: true,
    isFeatured: true,
    isVeg: false,
    tags: ["Fast Delivery", "Popular"],
    offer: "Buy 1 Get 1 Free",
    offerCode: "BOGO",
    address: "5 Liberty Square, Central Zone",
    lat: 19.082,
    lng: 72.883,
    description: "Juicy, hand-crafted burgers stacked with premium toppings. From classic beef to vegan, we've got your craving covered.",
    categories: ["Recommended", "Burgers", "Sides", "Drinks", "Desserts"],
  },
  {
    id: 3,
    name: "Sakura Sushi Bar",
    logo: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?w=80&q=80",
coverImage: "https://images.unsplash.com/photo-1553621042-f6e147245754?w=800&q=80",
    cuisine: ["Sushi", "Japanese", "Asian"],
    rating: 4.9,
    reviewCount: 756,
    deliveryTime: "35-50",
    deliveryFee: 49,
    minOrder: 399,
    priceRange: "$$$",
    isOpen: true,
    isFeatured: true,
    isVeg: false,
    tags: ["Premium", "Chef Special"],
    offer: "Free Miso Soup on ₹599+",
    offerCode: "MISO",
    address: "88 Zen Garden Lane, Uptown",
    lat: 19.091,
    lng: 72.869,
    description: "Master chef Kenji's authentic Japanese sushi crafted with freshest ingredients flown in daily. A true Tokyo experience.",
    categories: ["Recommended", "Nigiri", "Rolls", "Sashimi", "Ramen", "Drinks"],
  },
  {
    id: 4,
    name: "Spice Garden",
    logo: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=80&q=80",
    coverImage: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=800&q=80",
    cuisine: ["Indian", "North Indian", "Biryani"],
    rating: 4.7,
    reviewCount: 2100,
    deliveryTime: "30-45",
    deliveryFee: 0,
    minOrder: 249,
    priceRange: "$$",
    isOpen: true,
    isFeatured: false,
    isVeg: false,
    tags: ["Free Delivery", "Best Biryani"],
    offer: "Free delivery on all orders",
    offerCode: "FREEDEL",
    address: "23 Spice Market Road, Old Town",
    lat: 19.065,
    lng: 72.891,
    description: "Authentic flavors from the heart of India. Family recipes passed down through generations, made with love and spices.",
    categories: ["Recommended", "Starters", "Curries", "Biryani", "Breads", "Desserts", "Drinks"],
  },
  {
    id: 5,
    name: "Dragon Palace",
    logo: "https://images.unsplash.com/photo-1563245372-f21724e3856d?w=80&q=80",
    coverImage: "https://images.unsplash.com/photo-1569050467447-ce54b3bbc37d?w=800&q=80",
    cuisine: ["Chinese", "Dim Sum", "Noodles"],
    rating: 4.5,
    reviewCount: 1450,
    deliveryTime: "25-40",
    deliveryFee: 29,
    minOrder: 199,
    priceRange: "$$",
    isOpen: false,
    isFeatured: false,
    isVeg: false,
    tags: ["Dim Sum Expert"],
    offer: "15% off on weekdays",
    offerCode: "WEEKDAY15",
    address: "6 Golden Dragon Street, Chinatown",
    lat: 19.073,
    lng: 72.856,
    description: "Handcrafted dim sum and traditional Chinese dishes. Over 80 menu items crafted by award-winning chefs.",
    categories: ["Recommended", "Dim Sum", "Noodles", "Rice", "Soups", "Desserts"],
  },
  {
    id: 6,
    name: "Sweet Tooth Bakery",
    logo: "https://images.unsplash.com/photo-1551024601-bec78aea704b?w=80&q=80",
    coverImage: "https://images.unsplash.com/photo-1486427944299-d1955d23e34d?w=800&q=80",
    cuisine: ["Desserts", "Cakes", "Pastries"],
    rating: 4.8,
    reviewCount: 890,
    deliveryTime: "20-35",
    deliveryFee: 39,
    minOrder: 299,
    priceRange: "$$",
    isOpen: true,
    isFeatured: true,
    isVeg: true,
    tags: ["Pure Veg", "Artisan"],
    offer: "10% off on first order",
    offerCode: "SWEET10",
    address: "45 Confectionery Lane, Sweet District",
    lat: 19.085,
    lng: 72.875,
    description: "Artisan pastries, decadent cakes, and freshly baked goods. Everything made from scratch with Belgian chocolate and imported ingredients.",
    categories: ["Recommended", "Cakes", "Pastries", "Ice Cream", "Cookies", "Drinks"],
  },
  {
    id: 7,
    name: "Green Bowl",
    logo: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=80&q=80",
    coverImage: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=800&q=80",
    cuisine: ["Healthy", "Salads", "Vegan"],
    rating: 4.6,
    reviewCount: 620,
    deliveryTime: "20-30",
    deliveryFee: 19,
    minOrder: 199,
    priceRange: "$$",
    isOpen: true,
    isFeatured: false,
    isVeg: true,
    tags: ["Vegan", "Gluten Free"],
    offer: "Free smoothie on ₹499+",
    offerCode: "SMOOTHIE",
    address: "9 Wellness Way, Health Hub",
    lat: 19.089,
    lng: 72.862,
    description: "Nutrient-packed salads, grain bowls, and plant-based meals. Fuel your body with goodness, guilt-free.",
    categories: ["Recommended", "Salads", "Bowls", "Wraps", "Smoothies", "Juices"],
  },
  {
    id: 8,
    name: "Taco Fiesta",
    logo: "https://images.unsplash.com/photo-1565299585323-38d6b0865b47?w=80&q=80",
    coverImage: "https://images.unsplash.com/photo-1552332386-f8dd00dc2f85?w=800&q=80",
    cuisine: ["Mexican", "Tacos", "Burritos"],
    rating: 4.4,
    reviewCount: 760,
    deliveryTime: "25-35",
    deliveryFee: 29,
    minOrder: 149,
    priceRange: "$",
    isOpen: true,
    isFeatured: false,
    isVeg: false,
    tags: ["Spicy", "Street Food"],
    offer: "Taco Tuesday - 30% off",
    offerCode: "TACOTUESDAY",
    address: "22 Fiesta Street, West End",
    lat: 19.071,
    lng: 72.879,
    description: "Authentic Mexican street tacos, loaded burritos, and zesty quesadillas. Every bite is a fiesta!",
    categories: ["Recommended", "Tacos", "Burritos", "Quesadillas", "Nachos", "Drinks"],
  },
];


// ==================== FOODS ====================
const FOODS = [
  // Pizza Palace (restaurantId: 1)
  { id: 101, restaurantId: 1, name: "Margherita Classic", category: "Pizzas", subcategory: "Recommended", price: 349, originalPrice: 449, image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=600&q=80", description: "Fresh mozzarella, San Marzano tomatoes, hand-tossed dough, basil leaves. A timeless Italian classic.", isVeg: true, isVegan: false, isGlutenFree: false, spiceLevel: 0, calories: 720, protein: 28, fat: 22, carbs: 96, rating: 4.8, reviewCount: 342, isBestSeller: true, isChefSpecial: false, isNew: false, customizations: ["Extra Cheese +₹50", "Extra Basil +₹20", "Thin Crust", "Thick Crust"], ingredients: ["Mozzarella", "Tomato Sauce", "Basil", "Olive Oil", "Pizza Dough"] },
  { id: 102, restaurantId: 1, name: "BBQ Chicken Pizza", category: "Pizzas", subcategory: "Recommended", price: 499, originalPrice: 599, image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=600&q=80", description: "Smoked BBQ chicken, red onions, bell peppers, cheddar cheese, and tangy BBQ sauce.", isVeg: false, isVegan: false, isGlutenFree: false, spiceLevel: 2, calories: 890, protein: 42, fat: 32, carbs: 98, rating: 4.7, reviewCount: 289, isBestSeller: true, isChefSpecial: true, isNew: false, customizations: ["Extra Chicken +₹80", "Extra Cheese +₹50", "Spicy Sauce +₹30"], ingredients: ["BBQ Chicken", "Cheddar", "Bell Peppers", "Red Onion", "BBQ Sauce"] },
  { id: 103, restaurantId: 1, name: "Truffle Mushroom Pizza", category: "Pizzas", subcategory: "Chef Special", price: 599, originalPrice: 699, image: "https://images.unsplash.com/photo-1534308983496-4fabb1a015ee?w=600&q=80", description: "Black truffle oil, wild mushrooms, parmesan, arugula. Our most luxurious pizza.", isVeg: true, isVegan: false, isGlutenFree: false, spiceLevel: 0, calories: 810, protein: 24, fat: 38, carbs: 89, rating: 4.9, reviewCount: 156, isBestSeller: false, isChefSpecial: true, isNew: false, customizations: ["Extra Truffle Oil +₹100", "Extra Mushrooms +₹60"], ingredients: ["Truffle Oil", "Wild Mushrooms", "Parmesan", "Arugula", "Cream Sauce"] },
  { id: 104, restaurantId: 1, name: "Bruschetta", category: "Starters", subcategory: "Starters", price: 199, originalPrice: 249, image: "https://images.unsplash.com/photo-1572695157366-5e585ab2b69f?w=600&q=80", description: "Toasted baguette slices topped with fresh tomatoes, garlic, basil, and olive oil.", isVeg: true, isVegan: true, isGlutenFree: false, spiceLevel: 0, calories: 340, protein: 8, fat: 12, carbs: 48, rating: 4.5, reviewCount: 210, isBestSeller: false, isChefSpecial: false, isNew: false, customizations: ["Add Parmesan +₹40"], ingredients: ["Baguette", "Tomatoes", "Garlic", "Basil", "Olive Oil"] },
  { id: 105, restaurantId: 1, name: "Penne Arrabbiata", category: "Pasta", subcategory: "Pasta", price: 329, originalPrice: 399, image: "https://images.unsplash.com/photo-1555949258-eb67b1ef0ceb?w=600&q=80", description: "Al dente penne in a fiery tomato sauce with garlic, chili flakes, and fresh herbs.", isVeg: true, isVegan: true, isGlutenFree: false, spiceLevel: 3, calories: 680, protein: 18, fat: 14, carbs: 112, rating: 4.6, reviewCount: 178, isBestSeller: false, isChefSpecial: false, isNew: false, customizations: ["Add Chicken +₹80", "Add Prawns +₹120", "Extra Spicy"], ingredients: ["Penne", "Tomatoes", "Garlic", "Chili", "Herbs"] },
  { id: 106, restaurantId: 1, name: "Tiramisu", category: "Desserts", subcategory: "Desserts", price: 249, originalPrice: 299, image: "https://images.unsplash.com/photo-1571877227200-a0d98ea607e9?w=600&q=80", description: "Classic Italian tiramisu with mascarpone, espresso-soaked ladyfingers, and cocoa dust.", isVeg: true, isVegan: false, isGlutenFree: false, spiceLevel: 0, calories: 480, protein: 9, fat: 26, carbs: 52, rating: 4.9, reviewCount: 267, isBestSeller: true, isChefSpecial: true, isNew: false, customizations: [], ingredients: ["Mascarpone", "Espresso", "Ladyfingers", "Cocoa", "Eggs"] },

  // Burger Barn (restaurantId: 2)
  { id: 201, restaurantId: 2, name: "The Classic Smash Burger", category: "Burgers", subcategory: "Recommended", price: 299, originalPrice: 349, image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=600&q=80", description: "Double smash patty, american cheese, secret sauce, pickles, on a toasted brioche bun.", isVeg: false, isVegan: false, isGlutenFree: false, spiceLevel: 1, calories: 780, protein: 46, fat: 38, carbs: 68, rating: 4.8, reviewCount: 456, isBestSeller: true, isChefSpecial: false, isNew: false, customizations: ["Extra Patty +₹80", "Extra Cheese +₹40", "Add Bacon +₹60", "No Pickles"], ingredients: ["Beef Patty", "American Cheese", "Secret Sauce", "Pickles", "Brioche Bun"] },
  { id: 202, restaurantId: 2, name: "Crispy Chicken Burger", category: "Burgers", subcategory: "Recommended", price: 279, originalPrice: 329, image: "https://images.unsplash.com/photo-1606755962773-d324e0a13086?w=600&q=80", description: "Crispy fried chicken, coleslaw, jalapeños, sriracha mayo on a sesame bun.", isVeg: false, isVegan: false, isGlutenFree: false, spiceLevel: 2, calories: 720, protein: 38, fat: 32, carbs: 72, rating: 4.7, reviewCount: 312, isBestSeller: true, isChefSpecial: false, isNew: false, customizations: ["Extra Chicken +₹60", "No Jalapeños", "Extra Sriracha"], ingredients: ["Fried Chicken", "Coleslaw", "Jalapeños", "Sriracha Mayo", "Sesame Bun"] },
  { id: 203, restaurantId: 2, name: "Veggie Supreme Burger", category: "Burgers", subcategory: "Burgers", price: 249, originalPrice: 299, image: "https://images.unsplash.com/photo-1520072959219-c595dc870360?w=600&q=80", description: "Crispy veggie patty, avocado, tomato, lettuce, chipotle mayo, cheddar.", isVeg: true, isVegan: false, isGlutenFree: false, spiceLevel: 1, calories: 620, protein: 18, fat: 28, carbs: 78, rating: 4.5, reviewCount: 198, isBestSeller: false, isChefSpecial: false, isNew: true, customizations: ["Vegan Option +₹0", "Extra Avocado +₹50", "No Cheese"], ingredients: ["Veggie Patty", "Avocado", "Tomato", "Lettuce", "Chipotle Mayo"] },
  { id: 204, restaurantId: 2, name: "Loaded Fries", category: "Sides", subcategory: "Sides", price: 179, originalPrice: 219, image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=600&q=80", description: "Crispy golden fries topped with cheese sauce, jalapeños, sour cream, and chives.", isVeg: true, isVegan: false, isGlutenFree: true, spiceLevel: 2, calories: 560, protein: 10, fat: 28, carbs: 68, rating: 4.6, reviewCount: 289, isBestSeller: false, isChefSpecial: false, isNew: false, customizations: ["Add Bacon Bits +₹50", "Extra Cheese Sauce +₹30"], ingredients: ["Potatoes", "Cheese Sauce", "Jalapeños", "Sour Cream", "Chives"] },

// Sakura Sushi Bar (restaurantId: 3)
  { id: 301, restaurantId: 3, name: "Dragon Roll", category: "Rolls", subcategory: "Recommended", price: 549, originalPrice: 649, image: "https://images.unsplash.com/photo-1563612116625-3012372fccce?w=600&q=80", description: "Shrimp tempura, cucumber, topped with avocado, unagi sauce, sesame seeds.", isVeg: false, isVegan: false, isGlutenFree: false, spiceLevel: 1, calories: 520, protein: 24, fat: 18, carbs: 68, rating: 4.9, reviewCount: 312, isBestSeller: true, isChefSpecial: true, isNew: false, customizations: ["Add Spicy Mayo +₹30"], ingredients: ["Shrimp Tempura", "Cucumber", "Avocado", "Unagi Sauce", "Rice"] },
{ id: 302, restaurantId: 3, name: "Salmon Nigiri (6 pcs)", category: "Nigiri", subcategory: "Nigiri", price: 449, originalPrice: 499, image: "https://images.unsplash.com/photo-1535140728325-a4d3707eee61?w=600&q=80", description: "Fresh Atlantic salmon over seasoned sushi rice. Served with ginger and wasabi.", isVeg: false, isVegan: false, isGlutenFree: true, spiceLevel: 0, calories: 380, protein: 28, fat: 12, carbs: 44, rating: 4.8, reviewCount: 198, isBestSeller: false, isChefSpecial: false, isNew: false, customizations: ["Extra Wasabi", "Extra Ginger"], ingredients: ["Atlantic Salmon", "Sushi Rice", "Nori", "Wasabi", "Pickled Ginger"] },
  { id: 303, restaurantId: 3, name: "Tuna Sashimi (8 pcs)", category: "Sashimi", subcategory: "Sashimi", price: 599, originalPrice: 699, image: "https://images.unsplash.com/photo-1579584425555-c3ce17fd4351?w=600&q=80", description: "Premium bluefin tuna, thinly sliced. Pure ocean flavor.", isVeg: false, isVegan: false, isGlutenFree: true, spiceLevel: 0, calories: 290, protein: 46, fat: 8, carbs: 2, rating: 4.9, reviewCount: 145, isBestSeller: false, isChefSpecial: true, isNew: false, customizations: ["Extra Soy Sauce", "Extra Wasabi"], ingredients: ["Bluefin Tuna", "Shiso Leaf", "Daikon Radish"] },

  // Spice Garden (restaurantId: 4)
  { id: 401, restaurantId: 4, name: "Chicken Biryani", category: "Biryani", subcategory: "Recommended", price: 329, originalPrice: 399, image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=600&q=80", description: "Dum-cooked basmati rice with tender chicken, saffron, fried onions, and aromatic spices.", isVeg: false, isVegan: false, isGlutenFree: true, spiceLevel: 3, calories: 820, protein: 48, fat: 26, carbs: 98, rating: 4.9, reviewCount: 892, isBestSeller: true, isChefSpecial: true, isNew: false, customizations: ["Extra Raita +₹30", "Extra Gravy +₹40"], ingredients: ["Basmati Rice", "Chicken", "Saffron", "Fried Onions", "Whole Spices"] },
  { id: 402, restaurantId: 4, name: "Paneer Butter Masala", category: "Curries", subcategory: "Recommended", price: 279, originalPrice: 329, image: "https://images.unsplash.com/photo-1604908176997-125f25cc6f3d?w=600&q=80", description: "Soft cottage cheese cubes in a rich, creamy tomato-based gravy with butter and spices.", isVeg: true, isVegan: false, isGlutenFree: true, spiceLevel: 1, calories: 580, protein: 22, fat: 36, carbs: 42, rating: 4.7, reviewCount: 654, isBestSeller: true, isChefSpecial: false, isNew: false, customizations: ["Extra Paneer +₹60", "Less Spicy", "More Gravy"], ingredients: ["Paneer", "Tomatoes", "Cream", "Butter", "Spices"] },
  { id: 403, restaurantId: 4, name: "Dal Makhani", category: "Curries", subcategory: "Curries", price: 229, originalPrice: 279, image: "https://images.unsplash.com/photo-1546833998-877b37c2e5c6?w=600&q=80", description: "Slow-cooked black lentils simmered overnight with butter and cream. A punjabi staple.", isVeg: true, isVegan: false, isGlutenFree: true, spiceLevel: 1, calories: 460, protein: 18, fat: 22, carbs: 52, rating: 4.8, reviewCount: 478, isBestSeller: false, isChefSpecial: false, isNew: false, customizations: ["Extra Butter +₹20", "Extra Cream +₹30"], ingredients: ["Black Lentils", "Kidney Beans", "Butter", "Cream", "Tomatoes"] },
  { id: 404, restaurantId: 4, name: "Butter Naan", category: "Breads", subcategory: "Breads", price: 69, originalPrice: 89, image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?w=600&q=80", description: "Soft, fluffy naan brushed with fresh butter, baked in a clay tandoor oven.", isVeg: true, isVegan: false, isGlutenFree: false, spiceLevel: 0, calories: 280, protein: 8, fat: 8, carbs: 44, rating: 4.6, reviewCount: 820, isBestSeller: false, isChefSpecial: false, isNew: false, customizations: ["Garlic Naan +₹20", "Stuffed Naan +₹40"], ingredients: ["Flour", "Butter", "Yeast", "Salt"] },
{ id: 405, restaurantId: 4, name: "Gulab Jamun", category: "Desserts", subcategory: "Desserts", price: 129, originalPrice: 149, image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=600&q=80", description: "Soft khoya dumplings soaked in rose-flavored sugar syrup. Served warm.", isVeg: true, isVegan: false, isGlutenFree: false, spiceLevel: 0, calories: 380, protein: 6, fat: 14, carbs: 58, rating: 4.7, reviewCount: 340, isBestSeller: true, isChefSpecial: false, isNew: false, customizations: ["With Ice Cream +₹80"], ingredients: ["Khoya", "Sugar Syrup", "Rose Water", "Cardamom"] },

  // Sweet Tooth Bakery (restaurantId: 6)
  { id: 601, restaurantId: 6, name: "Red Velvet Cake Slice", category: "Cakes", subcategory: "Recommended", price: 199, originalPrice: 249, image: "https://images.unsplash.com/photo-1586985289688-ca3cf47d3e6e?w=600&q=80", description: "Moist red velvet cake layered with cream cheese frosting. A bakery classic.", isVeg: true, isVegan: false, isGlutenFree: false, spiceLevel: 0, calories: 450, protein: 6, fat: 22, carbs: 58, rating: 4.9, reviewCount: 412, isBestSeller: true, isChefSpecial: false, isNew: false, customizations: ["Extra Frosting +₹30"], ingredients: ["Red Velvet Sponge", "Cream Cheese", "Buttermilk", "Cocoa"] },
  { id: 602, restaurantId: 6, name: "Belgian Chocolate Truffle", category: "Cakes", subcategory: "Cakes", price: 229, originalPrice: 279, image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&q=80", description: "Dark Belgian chocolate ganache on a moist chocolate sponge. Intensely rich.", isVeg: true, isVegan: false, isGlutenFree: false, spiceLevel: 0, calories: 520, protein: 7, fat: 32, carbs: 54, rating: 4.8, reviewCount: 298, isBestSeller: true, isChefSpecial: true, isNew: false, customizations: ["Add Gold Leaf +₹80"], ingredients: ["Belgian Chocolate", "Ganache", "Chocolate Sponge", "Cream"] },
  { id: 603, restaurantId: 6, name: "Strawberry Cheesecake", category: "Cakes", subcategory: "Cakes", price: 219, originalPrice: 269, image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=600&q=80", description: "New York-style cheesecake with fresh strawberry compote on a buttery graham crust.", isVeg: true, isVegan: false, isGlutenFree: false, spiceLevel: 0, calories: 480, protein: 8, fat: 28, carbs: 50, rating: 4.7, reviewCount: 234, isBestSeller: false, isChefSpecial: false, isNew: false, customizations: ["Extra Strawberries +₹40"], ingredients: ["Cream Cheese", "Strawberries", "Graham Crust", "Sour Cream"] },

  // Green Bowl (restaurantId: 7)
  { id: 701, restaurantId: 7, name: "Mediterranean Power Bowl", category: "Bowls", subcategory: "Recommended", price: 349, originalPrice: 399, image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=600&q=80", description: "Quinoa, roasted chickpeas, falafel, hummus, tabbouleh, tahini dressing. Protein-packed.", isVeg: true, isVegan: true, isGlutenFree: true, spiceLevel: 0, calories: 520, protein: 22, fat: 18, carbs: 64, rating: 4.7, reviewCount: 189, isBestSeller: true, isChefSpecial: true, isNew: false, customizations: ["Add Halloumi +₹60", "Extra Hummus +₹30"], ingredients: ["Quinoa", "Chickpeas", "Falafel", "Hummus", "Tahini"] },
  { id: 702, restaurantId: 7, name: "Avocado Toast", category: "Salads", subcategory: "Recommended", price: 249, originalPrice: 299, image: "https://images.unsplash.com/photo-1482049016688-2d3e1b311543?w=600&q=80", description: "Smashed avocado on sourdough, cherry tomatoes, feta, microgreens, everything bagel spice.", isVeg: true, isVegan: false, isGlutenFree: false, spiceLevel: 0, calories: 420, protein: 12, fat: 24, carbs: 40, rating: 4.6, reviewCount: 156, isBestSeller: false, isChefSpecial: false, isNew: false, customizations: ["Add Poached Egg +₹40", "No Feta (Vegan)"], ingredients: ["Sourdough", "Avocado", "Cherry Tomatoes", "Feta", "Microgreens"] },
];


// ==================== OFFERS ====================
const OFFERS = [
  { id: 1, code: "FRESH50", discount: 50, type: "flat", minOrder: 299, maxDiscount: 50, description: "Flat ₹50 off on your first order", validTill: "2026-12-31", isActive: true },
  { id: 2, code: "SAVE20", discount: 20, type: "percent", minOrder: 499, maxDiscount: 100, description: "20% off up to ₹100", validTill: "2026-12-31", isActive: true },
  { id: 3, code: "FREEDEL", discount: 0, type: "freeDelivery", minOrder: 249, maxDiscount: 0, description: "Free delivery on your order", validTill: "2026-12-31", isActive: true },
  { id: 4, code: "WELCOME30", discount: 30, type: "percent", minOrder: 199, maxDiscount: 150, description: "30% off for new users up to ₹150", validTill: "2026-12-31", isActive: true },
  { id: 5, code: "BOGO", discount: 0, type: "bogo", minOrder: 398, maxDiscount: 200, description: "Buy 1 Get 1 on selected items", validTill: "2026-12-31", isActive: true },
];

// ==================== REVIEWS ====================
const REVIEWS = [
{ id: 1, restaurantId: 1, userId: "u1", userName: "Priya Sharma", avatar: "https://images.unsplash.com/photo-1554151228-14d9def656e4?w=80&q=80", rating: 5, comment: "Absolutely amazing pizza! The truffle mushroom pizza is out of this world. Fast delivery and still hot when it arrived.", date: "2026-07-15", helpful: 24, orderedItems: ["Truffle Mushroom Pizza", "Tiramisu"] },
  { id: 2, restaurantId: 1, userId: "u2", userName: "Rahul Mehta", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", rating: 4, comment: "Great pizza, arrived on time. The BBQ Chicken pizza is my absolute favourite! Will order again.", date: "2026-07-10", helpful: 18, orderedItems: ["BBQ Chicken Pizza"] },
  { id: 3, restaurantId: 2, userId: "u3", userName: "Ananya Kapoor", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80", rating: 5, comment: "Best burgers in the city! The smash burger is incredible. I dream about those loaded fries.", date: "2026-07-20", helpful: 32, orderedItems: ["Classic Smash Burger", "Loaded Fries"] },
  { id: 4, restaurantId: 3, userId: "u4", userName: "Karan Johar", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&q=80", rating: 5, comment: "Sakura is a gem! The dragon roll is perfection. Freshest ingredients and the presentation is beautiful.", date: "2026-07-18", helpful: 28, orderedItems: ["Dragon Roll", "Salmon Nigiri"] },
  { id: 5, restaurantId: 4, userId: "u5", userName: "Meena Patel", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80", rating: 5, comment: "Authentic flavors! The biryani reminds me of home cooking. Dal makhani is buttery perfection.", date: "2026-07-22", helpful: 45, orderedItems: ["Chicken Biryani", "Dal Makhani"] },
  { id: 6, restaurantId: 6, userId: "u6", userName: "Deepa Iyer", avatar: "https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=80&q=80", rating: 5, comment: "The red velvet cake is sensational! Super fresh, delivered in beautiful packaging. Perfect for gifting.", date: "2026-07-25", helpful: 38, orderedItems: ["Red Velvet Cake", "Belgian Chocolate Truffle"] },
];

// ==================== TESTIMONIALS ====================
const TESTIMONIALS = [
  { id: 1, name: "Arjun Singh", role: "Food Blogger", avatar: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=80&q=80", text: "FreshBite has completely changed how I order food. The quality of restaurants and seamless experience is unmatched. I order 4-5 times a week!", rating: 5, city: "Mumbai" },
  { id: 2, name: "Sneha Gupta", role: "Nutritionist", avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=80&q=80", text: "Love that FreshBite has healthy options! I can find calorie info, filter vegan options, and the food is always fresh. Finally, guilt-free delivery!", rating: 5, city: "Delhi" },
  { id: 3, name: "Vikram Nair", role: "Software Engineer", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&q=80", text: "The fastest delivery and the UI is so clean and intuitive. I've never had an issue with an order. FreshBite is the only app I use now.", rating: 5, city: "Bangalore" },
  { id: 4, name: "Pooja Malhotra", role: "Designer", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&q=80", text: "Finally a food app that looks and feels premium. The deals are amazing and the restaurant selection is top-notch. Highly recommend!", rating: 5, city: "Pune" },
];

// ==================== BANNER OFFERS ====================
const BANNER_OFFERS = [
  { id: 1, title: "50% OFF", subtitle: "On Your First Order", description: "Use code FRESH50", image: "https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=1200&q=80", cta: "Order Now", code: "FRESH50", gradient: "linear-gradient(135deg, #FF6B35, #FF8E53)" },
  { id: 2, title: "Free Delivery", subtitle: "On All Weekend Orders", description: "No minimum order required Sat & Sun", image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?w=1200&q=80", cta: "Explore Restaurants", code: "WEEKEND", gradient: "linear-gradient(135deg, #6C5CE7, #a29bfe)" },
  { id: 3, title: "New Restaurants", subtitle: "Explore What's New", description: "Fresh restaurants added every week", image: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=80", cta: "Discover Now", code: null, gradient: "linear-gradient(135deg, #00b894, #00cec9)" },
];

// Export all data
if (typeof module !== 'undefined') {
  module.exports = { CATEGORIES, RESTAURANTS, FOODS, OFFERS, REVIEWS, TESTIMONIALS, BANNER_OFFERS };
}
