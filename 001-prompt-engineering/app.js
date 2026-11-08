/**
 * CRAVELY - High-Conversion Chef-Crafted Food Delivery
 * Complete Interactive Application:
 * 1. Cart Drawer & Itemized Management
 * 2. Checkout Flow & Mock Payment
 * 3. Live Order Tracking & Route Map Simulation
 * 4. Dish Detail Editorial Inspection Modal
 * 5. Category Filtering, Favorites, Promo System & Toasts
 */

document.addEventListener('DOMContentLoaded', () => {
  'use strict';

  // =========================================================================
  // 1. CULINARY DISHES CATALOG DATA
  // =========================================================================
  const dishesData = {
    1: {
      id: 1,
      name: "Double Truffle Wagyu Smash",
      price: 16.50,
      category: "Artisan Burgers",
      categoryKey: "burgers",
      image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=800&q=80",
      rating: "4.92",
      reviewsCount: 42,
      kitchen: "SmashCraft Lab, SoMa",
      chef: "Chef Marcus Vance",
      headline: "Two smashed wagyu beef patties with extra crunch & black truffle glaze.",
      story: "Crafted with 45-day dry-aged American Wagyu beef seared at 700°F on vintage cast iron for maximum Maillard caramelization. Glazed with black winter truffle reduction, layered with melted Danish Havarti cheese, crisp grilled scallions, and quick-pickled shallots on a toasted, butter-brushed artisanal brioche bun.",
      pantry: "45-day dry-aged wagyu beef, Danish Havarti cheese, grilled scallions, quick-pickled shallots, black winter truffle glaze, sea salt crystals, brioche bun.",
      nutrition: { cal: 820, protein: "48g", carbs: "38g", fat: "52g" },
      dietary: ["Organic Beef", "Chef Signature", "High Protein", "Contains Dairy"]
    },
    2: {
      id: 2,
      name: "Artisan Margherita D.O.P.",
      price: 18.00,
      category: "Wood-Fired Pizza",
      categoryKey: "pizza",
      image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=800&q=80",
      rating: "4.95",
      reviewsCount: 61,
      kitchen: "Forno Antico, North Beach",
      chef: "Chef Elena Rossi",
      headline: "72-hour slow fermented sourdough with blistered leopard crust.",
      story: "Fermented for 3 days using wild yeast sourdough starter nurtured for 12 years. Baked in a custom 800°F Italian refractory brick oven for exactly 90 seconds. Topped with hand-crushed D.O.P. San Marzano tomatoes, fresh Campania buffalo mozzarella, fragrant Genovese sweet basil, and a generous drizzle of first cold-press Sicilian olive oil.",
      pantry: "San Marzano D.O.P. plum tomatoes, fresh buffalo mozzarella, 72-hr fermented wild sourdough, sweet Genovese basil, cold-pressed Sicilian olive oil, coarse Maldon sea salt.",
      nutrition: { cal: 680, protein: "28g", carbs: "74g", fat: "22g" },
      dietary: ["Vegetarian", "Sourdough Fermented", "D.O.P. Certified", "Zero Preservatives"]
    },
    3: {
      id: 3,
      name: "Rainbow Salmon Poke Bowl",
      price: 17.25,
      category: "Healthy Bowls",
      categoryKey: "bowls",
      image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
      rating: "4.88",
      reviewsCount: 38,
      kitchen: "Nalu Pacific Bowls, Marina",
      chef: "Chef Kai Tanaka",
      headline: "Wild-caught Alaskan salmon with Hass avocado & ponzu glaze.",
      story: "Sustainably caught Alaskan King salmon, cubed fresh every morning and lightly cured in yuzu citrus ponzu. Served atop warm seasoned forbidden black emperor rice, rich ripe Hass avocado, crisp organic edamame pods, quick-cured watermelon radish, and toasted black & white sesame seeds.",
      pantry: "Wild Alaskan king salmon, organic black forbidden rice, Hass avocado, steamed edamame, pickled watermelon radish, yuzu ponzu dressing, toasted sesame seeds, micro cilantro.",
      nutrition: { cal: 540, protein: "38g", carbs: "46g", fat: "18g" },
      dietary: ["Gluten-Free", "High Omega-3", "Wild Caught", "Dairy-Free"]
    },
    4: {
      id: 4,
      name: "Crispy Dragon Tempura Roll",
      price: 19.50,
      category: "Sushi & Asian",
      categoryKey: "asian",
      image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
      rating: "4.92",
      reviewsCount: 53,
      kitchen: "Kuroshio Omakase, Downtown",
      chef: "Chef Kenji Sato",
      headline: "Jumbo tiger prawn tempura wrapped in spicy bluefin tuna crown.",
      story: "Golden tempura jumbo tiger prawn rolled in seasoned Niigata koshihikari rice, wrapped with velvety slices of spicy sustainably ranched bluefin tuna. Glazed with 15-year aged house unagi kabayaki reduction and garnished with popping golden tobiko caviar and spicy scallions.",
      pantry: "Jumbo tiger prawns, spiced bluefin tuna, Koshihikari sushi rice, avocado slices, unagi kabayaki reduction, golden tobiko caviar, crispy panko flakes, Japanese nori seaweed.",
      nutrition: { cal: 490, protein: "24g", carbs: "52g", fat: "16g" },
      dietary: ["Chef Recommended", "Sustainable Seafood", "Contains Shellfish"]
    },
    5: {
      id: 5,
      name: "Basket of Crispy Wedges",
      price: 8.50,
      category: "Sides & Starters",
      categoryKey: "burgers",
      image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&w=800&q=80",
      rating: "4.96",
      reviewsCount: 36,
      kitchen: "SmashCraft Lab, SoMa",
      chef: "Chef Marcus Vance",
      headline: "Rustic hand-cut potato wedges dusted in smoked paprika & rosemary.",
      story: "Heritage Idaho Russet potatoes thick-cut by hand, parboiled in mineral water, triple-cooked in non-GMO sunflower oil for exceptional crunch, and tossed warm in smoked sweet Spanish paprika, fresh garden rosemary, Meyer lemon zest, and cracked tellicherry pepper.",
      pantry: "Russet potatoes, Kerrygold butter mist, fresh rosemary sprigs, Spanish sweet smoked paprika, lemon zest, cracked Tellicherry peppercorn, fine sea salt.",
      nutrition: { cal: 360, protein: "6g", carbs: "48g", fat: "16g" },
      dietary: ["100% Vegan Option", "Gluten-Free Friendly", "Hand-Cut Daily"]
    },
    6: {
      id: 6,
      name: "Valrhona Warm Lava Cake",
      price: 10.50,
      category: "Desserts",
      categoryKey: "desserts",
      image: "https://images.unsplash.com/photo-1551024709-8f23befc6f87?auto=format&fit=crop&w=800&q=80",
      rating: "4.97",
      reviewsCount: 49,
      kitchen: "Pâtisserie Céleste, Pacific Heights",
      chef: "Chef Chloé Laurent",
      headline: "70% dark Belgian cocoa fondant with warm molten core & mascarpone.",
      story: "Decadent individual chocolate cake made with single-origin Valrhona Guanaja 70% dark chocolate and European cultured butter. Baked to order so the outer cake is delicately spongy while the center flows into a rich, velvety molten chocolate ganache.",
      pantry: "Valrhona 70% dark chocolate, sweet cream butter, pasture-raised organic eggs, Madagascan bourbon vanilla, unrefined cane sugar, dust of powdered sugar.",
      nutrition: { cal: 440, protein: "7g", carbs: "42g", fat: "26g" },
      dietary: ["Vegetarian", "Valrhona Single Origin", "Contains Dairy & Eggs"]
    }
  };

  // =========================================================================
  // 2. CENTRAL APPLICATION STATE
  // =========================================================================
  const state = {
    cart: [], // Array of { id, name, price, quantity, image, notes }
    savedDishes: new Set(),
    activeCategory: 'all',
    selectedLocation: 'Downtown, SF',
    promoCode: null,
    promoDiscountRate: 0.20,
    selectedTip: 3.00,
    deliveryFeeThreshold: 25.00,
    deliveryFeeDefault: 2.50,
    activeOrder: null, // Holds active tracking order info
    modalDish: null,
    modalQuantity: 1
  };

  // =========================================================================
  // 3. DOM ELEMENT REFERENCES
  // =========================================================================
  // Header & Nav
  const header = document.getElementById('siteHeader');
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const mobileDrawer = document.getElementById('mobileDrawer');
  const headerCartBtn = document.getElementById('headerCartBtn');
  const cartCounter = document.getElementById('cartCounter');
  const locationSelector = document.getElementById('locationSelector');
  const currentLocationText = document.getElementById('currentLocationText');
  const mobileLocText = document.getElementById('mobileLocText');
  const btnGeolocate = document.getElementById('btnGeolocate');

  // Hero & Menu
  const filterTabs = document.querySelectorAll('.filter-tab');
  const foodCards = document.querySelectorAll('.food-card');
  const addToCartBtns = document.querySelectorAll('.btn-add-cart');
  const wishlistBtns = document.querySelectorAll('.btn-wishlist');

  // Floating Bar
  const floatingBar = document.getElementById('floatingOrderBar');
  const floatingCartCount = document.getElementById('floatingCartCount');
  const floatingTotalPrice = document.getElementById('floatingTotalPrice');
  const floatingOrderTitle = document.getElementById('floatingOrderTitle');
  const floatingOrderSub = document.getElementById('floatingOrderSub');
  const btnFloatingCheckout = document.getElementById('btnFloatingCheckout');

  // Cart Drawer
  const cartDrawer = document.getElementById('cartDrawer');
  const cartDrawerOverlay = document.getElementById('cartDrawerOverlay');
  const btnCartDrawerClose = document.getElementById('btnCartDrawerClose');
  const drawerCartCountBadge = document.getElementById('drawerCartCountBadge');
  const deliveryBannerText = document.getElementById('deliveryBannerText');
  const deliveryProgressFill = document.getElementById('deliveryProgressFill');
  const cartItemsList = document.getElementById('cartItemsList');
  const cartEmptyState = document.getElementById('cartEmptyState');
  const btnEmptyBrowse = document.getElementById('btnEmptyBrowse');
  const cartStepItems = document.getElementById('cartStepItems');
  const cartStepCheckout = document.getElementById('cartStepCheckout');
  const btnProceedToCheckout = document.getElementById('btnProceedToCheckout');
  const btnBackToCart = document.getElementById('btnBackToCart');

  // Cart Promo & Tip & Summary
  const cartPromoInput = document.getElementById('cartPromoInput');
  const btnApplyCartPromo = document.getElementById('btnApplyCartPromo');
  const btnQuickApplyCRAVE20 = document.getElementById('btnQuickApplyCRAVE20');
  const promoAppliedBadge = document.getElementById('promoAppliedBadge');
  const btnRemovePromo = document.getElementById('btnRemovePromo');
  const tipOptionsGroup = document.getElementById('tipOptionsGroup');
  const summarySubtotal = document.getElementById('summarySubtotal');
  const summaryDiscountRow = document.getElementById('summaryDiscountRow');
  const summaryDiscount = document.getElementById('summaryDiscount');
  const summaryDelivery = document.getElementById('summaryDelivery');
  const summaryTip = document.getElementById('summaryTip');
  const summaryTotal = document.getElementById('summaryTotal');
  const checkoutAddressInput = document.getElementById('checkoutAddress');
  const checkoutFinalAmount = document.getElementById('checkoutFinalAmount');
  const btnPlaceOrder = document.getElementById('btnPlaceOrder');
  const placeOrderText = document.getElementById('placeOrderText');
  const orderSpinner = document.getElementById('orderSpinner');

  // Dish Detail Modal
  const dishModalOverlay = document.getElementById('dishModalOverlay');
  const dishDetailModal = document.getElementById('dishDetailModal');
  const btnDishModalClose = document.getElementById('btnDishModalClose');
  const modalDishImg = document.getElementById('modalDishImg');
  const modalDishCategory = document.getElementById('modalDishCategory');
  const modalDishRating = document.getElementById('modalDishRating');
  const modalDishKitchen = document.getElementById('modalDishKitchen');
  const modalDishChef = document.getElementById('modalDishChef');
  const modalDishTitle = document.getElementById('modalDishTitle');
  const modalDishPrice = document.getElementById('modalDishPrice');
  const modalDishHeadline = document.getElementById('modalDishHeadline');
  const modalDishStory = document.getElementById('modalDishStory');
  const modalDietaryTags = document.getElementById('modalDietaryTags');
  const macroCal = document.getElementById('macroCal');
  const macroProtein = document.getElementById('macroProtein');
  const macroCarbs = document.getElementById('macroCarbs');
  const macroFat = document.getElementById('macroFat');
  const modalDishPantry = document.getElementById('modalDishPantry');
  const modalSpecialNotes = document.getElementById('modalSpecialNotes');
  const modalQtyMinus = document.getElementById('modalQtyMinus');
  const modalQtyCount = document.getElementById('modalQtyCount');
  const modalQtyPlus = document.getElementById('modalQtyPlus');
  const btnModalAddToCart = document.getElementById('btnModalAddToCart');
  const modalAddBtnText = document.getElementById('modalAddBtnText');

  // Live Tracker Modal
  const trackerModalOverlay = document.getElementById('trackerModalOverlay');
  const orderTrackerModal = document.getElementById('orderTrackerModal');
  const trackerOrderId = document.getElementById('trackerOrderId');
  const trackerEtaTimer = document.getElementById('trackerEtaTimer');
  const btnMinimizeTracker = document.getElementById('btnMinimizeTracker');
  const btnCloseTracker = document.getElementById('btnCloseTracker');
  const mapLiveStatusText = document.getElementById('mapLiveStatusText');
  const animatedCourierMarker = document.getElementById('animatedCourierMarker');
  const btnCallCourier = document.getElementById('btnCallCourier');
  const btnMsgCourier = document.getElementById('btnMsgCourier');
  const trackerReceiptTotal = document.getElementById('trackerReceiptTotal');
  const trackerReceiptItems = document.getElementById('trackerReceiptItems');
  const step1 = document.getElementById('step1');
  const step2 = document.getElementById('step2');
  const step3 = document.getElementById('step3');
  const step4 = document.getElementById('step4');

  // Minimized Floating Tracker Bar
  const minimizedTrackingBar = document.getElementById('minimizedTrackingBar');
  const minimizedOrderTitle = document.getElementById('minimizedOrderTitle');
  const minimizedOrderEta = document.getElementById('minimizedOrderEta');
  const btnMaximizeTracker = document.getElementById('btnMaximizeTracker');

  // Toast
  const toastNotification = document.getElementById('toastNotification');
  const toastTitle = document.getElementById('toastTitle');
  const toastMessage = document.getElementById('toastMessage');

  // Promo copy buttons
  const copyPromoBtn = document.getElementById('btnCopyPromo');
  const copyPromoCtaBtn = document.getElementById('btnCopyPromoCta');
  const faqItems = document.querySelectorAll('.faq-item');

  let toastTimeout;
  let orderCountdownInterval;
  let courierAnimFrame;

  // =========================================================================
  // 4. TOAST NOTIFICATION SYSTEM
  // =========================================================================
  function showToast(title, message) {
    if (!toastNotification) return;

    toastTitle.textContent = title;
    toastMessage.textContent = message;

    toastNotification.classList.add('show');

    clearTimeout(toastTimeout);
    toastTimeout = setTimeout(() => {
      toastNotification.classList.remove('show');
    }, 3400);
  }

  // =========================================================================
  // 5. STICKY HEADER & MOBILE DRAWER
  // =========================================================================
  window.addEventListener('scroll', () => {
    if (window.scrollY > 20) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  }, { passive: true });

  if (mobileMenuBtn && mobileDrawer) {
    mobileMenuBtn.addEventListener('click', () => {
      const isOpen = mobileDrawer.classList.toggle('open');
      mobileMenuBtn.classList.toggle('active', isOpen);
      mobileMenuBtn.setAttribute('aria-expanded', isOpen);
      mobileDrawer.setAttribute('aria-hidden', !isOpen);
    });

    const mobileLinks = mobileDrawer.querySelectorAll('a');
    mobileLinks.forEach(link => {
      link.addEventListener('click', () => {
        mobileDrawer.classList.remove('open');
        mobileMenuBtn.classList.remove('active');
        mobileMenuBtn.setAttribute('aria-expanded', 'false');
        mobileDrawer.setAttribute('aria-hidden', 'true');
      });
    });
  }

  // =========================================================================
  // 6. CATEGORY FILTERING
  // =========================================================================
  function setActiveCategory(category) {
    state.activeCategory = category;

    filterTabs.forEach(tab => {
      const isMatch = tab.dataset.category === category;
      tab.classList.toggle('active', isMatch);
      tab.setAttribute('aria-selected', isMatch);
    });

    foodCards.forEach(card => {
      const cardCategory = card.dataset.category;
      if (category === 'all' || cardCategory === category) {
        card.classList.remove('hidden');
        card.style.opacity = '0';
        card.style.transform = 'translateY(10px)';
        setTimeout(() => {
          card.style.transition = 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)';
          card.style.opacity = '1';
          card.style.transform = 'translateY(0)';
        }, 30);
      } else {
        card.classList.add('hidden');
      }
    });
  }

  filterTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      setActiveCategory(tab.dataset.category);
    });
  });

  window.filterAndScroll = (category) => {
    setActiveCategory(category);
    const menuSection = document.getElementById('menu');
    if (menuSection) {
      menuSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  // =========================================================================
  // 7. CART STATE & OPERATIONS
  // =========================================================================
  function calculateFinancials() {
    const subtotal = state.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const discount = state.promoCode === 'CRAVE20' ? subtotal * state.promoDiscountRate : 0;
    const isFreeDelivery = subtotal >= state.deliveryFeeThreshold;
    const deliveryFee = subtotal > 0 ? (isFreeDelivery ? 0 : state.deliveryFeeDefault) : 0;
    const tip = subtotal > 0 ? state.selectedTip : 0;
    const total = Math.max(0, subtotal - discount + deliveryFee + tip);

    return {
      subtotal,
      discount,
      isFreeDelivery,
      deliveryFee,
      tip,
      total,
      remainingForFreeDelivery: Math.max(0, state.deliveryFeeThreshold - subtotal)
    };
  }

  function updateCartDisplay() {
    const totalCount = state.cart.reduce((sum, item) => sum + item.quantity, 0);
    const { subtotal, discount, isFreeDelivery, deliveryFee, tip, total, remainingForFreeDelivery } = calculateFinancials();

    // 1. Header Counter
    if (cartCounter) {
      cartCounter.textContent = totalCount;
      cartCounter.classList.remove('bump');
      void cartCounter.offsetWidth;
      cartCounter.classList.add('bump');
    }

    // 2. Drawer Badge
    if (drawerCartCountBadge) {
      drawerCartCountBadge.textContent = `${totalCount} ${totalCount === 1 ? 'item' : 'items'}`;
    }

    // 3. Floating Bottom Pill
    if (floatingBar) {
      if (totalCount > 0) {
        floatingBar.classList.add('visible');
        if (floatingCartCount) floatingCartCount.textContent = totalCount;
        if (floatingTotalPrice) floatingTotalPrice.textContent = `$${total.toFixed(2)}`;
        if (floatingOrderTitle) floatingOrderTitle.textContent = `${totalCount} ${totalCount === 1 ? 'Dish' : 'Dishes'} in Tray`;
        const latest = state.cart[state.cart.length - 1];
        if (floatingOrderSub) floatingOrderSub.textContent = `Latest: ${latest.name}`;
      } else {
        floatingBar.classList.remove('visible');
      }
    }

    // 4. Free Delivery Banner in Drawer
    if (deliveryBannerText && deliveryProgressFill) {
      if (totalCount === 0) {
        deliveryBannerText.innerHTML = `<span>Add <strong>$${state.deliveryFeeThreshold.toFixed(2)}</strong> for <strong>FREE 20-Min Delivery</strong></span>`;
        deliveryProgressFill.style.width = '0%';
      } else if (isFreeDelivery) {
        deliveryBannerText.innerHTML = `<span>🎉 <strong>FREE 20-Min Delivery</strong> unlocked!</span>`;
        deliveryProgressFill.style.width = '100%';
      } else {
        const percent = Math.min(100, (subtotal / state.deliveryFeeThreshold) * 100);
        deliveryBannerText.innerHTML = `<span>Add <strong>$${remainingForFreeDelivery.toFixed(2)}</strong> more for <strong>FREE Delivery</strong></span>`;
        deliveryProgressFill.style.width = `${percent}%`;
      }
    }

    // 5. Drawer Items List Rendering
    if (cartItemsList && cartEmptyState) {
      if (state.cart.length === 0) {
        cartEmptyState.classList.remove('hidden');
        cartItemsList.innerHTML = '';
        if (btnProceedToCheckout) btnProceedToCheckout.disabled = true;
      } else {
        cartEmptyState.classList.add('hidden');
        if (btnProceedToCheckout) btnProceedToCheckout.disabled = false;

        cartItemsList.innerHTML = state.cart.map((item, index) => `
          <div class="cart-item-card" data-index="${index}">
            <img src="${item.image}" alt="${item.name}" class="cart-item-thumb" />
            <div class="cart-item-details">
              <h4 class="cart-item-name">${item.name}</h4>
              <div class="cart-item-price-unit">$${item.price.toFixed(2)} each</div>
              ${item.notes ? `<span class="cart-item-notes">Note: "${item.notes}"</span>` : ''}
              <div class="cart-item-actions">
                <div class="cart-qty-stepper">
                  <button type="button" class="cart-qty-btn btn-cart-minus" data-index="${index}" aria-label="Decrease">&minus;</button>
                  <span class="cart-qty-val">${item.quantity}</span>
                  <button type="button" class="cart-qty-btn btn-cart-plus" data-index="${index}" aria-label="Increase">&plus;</button>
                </div>
                <span class="cart-item-total">$${(item.price * item.quantity).toFixed(2)}</span>
                <button type="button" class="cart-item-remove btn-cart-del" data-index="${index}" title="Remove item">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M18 6 6 18"/><path d="m6 6 12 12"/></svg>
                </button>
              </div>
            </div>
          </div>
        `).join('');

        // Wire stepper and delete buttons
        cartItemsList.querySelectorAll('.btn-cart-minus').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index, 10);
            updateCartItemQuantity(idx, -1);
          });
        });

        cartItemsList.querySelectorAll('.btn-cart-plus').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index, 10);
            updateCartItemQuantity(idx, 1);
          });
        });

        cartItemsList.querySelectorAll('.btn-cart-del').forEach(btn => {
          btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const idx = parseInt(btn.dataset.index, 10);
            removeCartItem(idx);
          });
        });
      }
    }

    // 6. Summary Financial Table
    if (summarySubtotal) summarySubtotal.textContent = `$${subtotal.toFixed(2)}`;
    
    if (summaryDiscountRow && summaryDiscount) {
      if (discount > 0) {
        summaryDiscountRow.classList.remove('hidden');
        summaryDiscount.textContent = `-$${discount.toFixed(2)}`;
      } else {
        summaryDiscountRow.classList.add('hidden');
      }
    }

    if (summaryDelivery) {
      summaryDelivery.textContent = isFreeDelivery ? 'FREE ($0.00)' : `$${deliveryFee.toFixed(2)}`;
      summaryDelivery.style.color = isFreeDelivery ? 'var(--forest-green)' : 'inherit';
    }

    if (summaryTip) summaryTip.textContent = `$${tip.toFixed(2)}`;
    if (summaryTotal) summaryTotal.textContent = `$${total.toFixed(2)}`;
    if (checkoutFinalAmount) checkoutFinalAmount.textContent = `$${total.toFixed(2)}`;
  }

  function addItemToCart(dishIdOrName, price, quantity = 1, notes = '') {
    let dish = null;

    if (typeof dishIdOrName === 'number' || !isNaN(parseInt(dishIdOrName, 10))) {
      dish = dishesData[parseInt(dishIdOrName, 10)];
    }

    if (!dish) {
      // Find by name in catalog
      dish = Object.values(dishesData).find(d => d.name.toLowerCase() === String(dishIdOrName).toLowerCase());
    }

    const itemPrice = dish ? dish.price : parseFloat(price || 15.00);
    const itemName = dish ? dish.name : String(dishIdOrName);
    const itemImage = dish ? dish.image : 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=300&q=80';
    const itemId = dish ? dish.id : Math.floor(Math.random() * 1000);

    // Check if matching item already in cart (same id and same notes)
    const existingIndex = state.cart.findIndex(i => i.id === itemId && (i.notes || '') === (notes || ''));

    if (existingIndex > -1) {
      state.cart[existingIndex].quantity += quantity;
    } else {
      state.cart.push({
        id: itemId,
        name: itemName,
        price: itemPrice,
        quantity: quantity,
        image: itemImage,
        notes: notes
      });
    }

    updateCartDisplay();
    showToast('Added to Tray! 🍽️', `${itemName} (x${quantity}) placed in your delivery tray.`);
  }

  function updateCartItemQuantity(index, delta) {
    if (!state.cart[index]) return;
    state.cart[index].quantity += delta;
    if (state.cart[index].quantity <= 0) {
      const removedName = state.cart[index].name;
      state.cart.splice(index, 1);
      showToast('Item Removed', `${removedName} removed from tray.`);
    }
    updateCartDisplay();
  }

  function removeCartItem(index) {
    if (!state.cart[index]) return;
    const removedName = state.cart[index].name;
    state.cart.splice(index, 1);
    updateCartDisplay();
    showToast('Item Removed', `${removedName} removed from tray.`);
  }

  // =========================================================================
  // 8. CART DRAWER & CHECKOUT VIEW NAVIGATION
  // =========================================================================
  function openCartDrawer(step = 'items') {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.add('open');
    if (cartDrawer) cartDrawer.classList.add('open');
    document.body.classList.add('modal-open');
    if (cartDrawer) cartDrawer.setAttribute('aria-hidden', 'false');

    if (step === 'checkout') {
      showCheckoutStep();
    } else {
      showItemsStep();
    }
  }

  function closeCartDrawer() {
    if (cartDrawerOverlay) cartDrawerOverlay.classList.remove('open');
    if (cartDrawer) cartDrawer.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (cartDrawer) cartDrawer.setAttribute('aria-hidden', 'true');
  }

  function showItemsStep() {
    cartStepItems.classList.remove('hidden');
    cartStepCheckout.classList.add('hidden');
  }

  function showCheckoutStep() {
    if (state.cart.length === 0) {
      showToast('Tray is Empty', 'Add dishes to your tray before proceeding to checkout.');
      return;
    }
    cartStepItems.classList.add('hidden');
    cartStepCheckout.classList.remove('hidden');

    // Sync checkout address with selected location
    if (checkoutAddressInput) {
      checkoutAddressInput.value = `${state.selectedLocation}, San Francisco, CA`;
    }
  }

  if (headerCartBtn) {
    headerCartBtn.addEventListener('click', () => openCartDrawer('items'));
  }

  if (floatingBar) {
    floatingBar.addEventListener('click', (e) => {
      // If clicked anywhere on floating bar
      openCartDrawer('items');
    });
  }

  if (btnFloatingCheckout) {
    btnFloatingCheckout.addEventListener('click', (e) => {
      e.stopPropagation();
      openCartDrawer('checkout');
    });
  }

  if (btnCartDrawerClose) {
    btnCartDrawerClose.addEventListener('click', closeCartDrawer);
  }

  if (cartDrawerOverlay) {
    cartDrawerOverlay.addEventListener('click', closeCartDrawer);
  }

  if (btnProceedToCheckout) {
    btnProceedToCheckout.addEventListener('click', () => showCheckoutStep());
  }

  if (btnBackToCart) {
    btnBackToCart.addEventListener('click', () => showItemsStep());
  }

  if (btnEmptyBrowse) {
    btnEmptyBrowse.addEventListener('click', () => {
      closeCartDrawer();
      document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
    });
  }

  // Promo Code Application
  function applyPromoCode(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (cleanCode === 'CRAVE20') {
      state.promoCode = 'CRAVE20';
      if (promoAppliedBadge) promoAppliedBadge.classList.remove('hidden');
      if (cartPromoInput) cartPromoInput.value = 'CRAVE20';
      showToast('Coupon Applied! 🎉', 'Code CRAVE20 unlocked 20% off all chef dishes.');
    } else {
      showToast('Invalid Coupon Code', `"${cleanCode}" is not recognized. Try CRAVE20.`);
    }
    updateCartDisplay();
  }

  if (btnApplyCartPromo && cartPromoInput) {
    btnApplyCartPromo.addEventListener('click', () => {
      applyPromoCode(cartPromoInput.value);
    });
    cartPromoInput.addEventListener('keypress', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        applyPromoCode(cartPromoInput.value);
      }
    });
  }

  if (btnQuickApplyCRAVE20) {
    btnQuickApplyCRAVE20.addEventListener('click', () => {
      applyPromoCode('CRAVE20');
    });
  }

  if (btnRemovePromo) {
    btnRemovePromo.addEventListener('click', () => {
      state.promoCode = null;
      if (promoAppliedBadge) promoAppliedBadge.classList.add('hidden');
      if (cartPromoInput) cartPromoInput.value = '';
      showToast('Promo Removed', 'Discount code removed.');
      updateCartDisplay();
    });
  }

  // Tip Selection
  if (tipOptionsGroup) {
    const tipBtns = tipOptionsGroup.querySelectorAll('.tip-btn');
    tipBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        tipBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        state.selectedTip = parseFloat(btn.dataset.tip);
        updateCartDisplay();
      });
    });
  }

  // =========================================================================
  // 9. ORDER PLACEMENT & LIVE ORDER TRACKER
  // =========================================================================
  if (btnPlaceOrder) {
    btnPlaceOrder.addEventListener('click', () => {
      if (state.cart.length === 0) {
        showToast('Tray is Empty', 'Please select dishes from the menu ledger.');
        return;
      }

      // Start loading spinner state
      btnPlaceOrder.disabled = true;
      placeOrderText.textContent = 'Verifying with Kitchen...';
      orderSpinner.classList.remove('hidden');

      setTimeout(() => {
        placeOrderText.textContent = 'Locking Heated Thermal Pod #14...';
      }, 700);

      setTimeout(() => {
        // Create Order Object
        const orderIdNumber = Math.floor(1000 + Math.random() * 9000);
        const orderId = `#CRV-${orderIdNumber}`;
        const financials = calculateFinancials();

        const order = {
          orderId: orderId,
          items: [...state.cart],
          financials: financials,
          address: checkoutAddressInput ? checkoutAddressInput.value : state.selectedLocation,
          timestamp: new Date(),
          etaSeconds: 19 * 60 + 50 // 19m 50s
        };

        state.activeOrder = order;

        // Reset button state
        btnPlaceOrder.disabled = false;
        placeOrderText.textContent = 'Place 20-Min Order & Track';
        orderSpinner.classList.add('hidden');

        // Clear active cart & close drawer
        state.cart = [];
        updateCartDisplay();
        closeCartDrawer();

        // Launch Live Tracker Experience!
        startLiveOrderTracker(order);
        showToast('Order Fired to Kitchen! 🚀', `Order ${orderId} confirmed. Courier Marco assigned.`);
      }, 1500);
    });
  }

  function startLiveOrderTracker(order) {
    trackerModalOverlay.classList.add('open');
    orderTrackerModal.classList.add('open');
    document.body.classList.add('modal-open');

    if (trackerOrderId) trackerOrderId.textContent = order.orderId;
    if (minimizedOrderTitle) minimizedOrderTitle.textContent = `Order ${order.orderId} en route`;

    // Populate receipt details
    if (trackerReceiptTotal) trackerReceiptTotal.textContent = `$${order.financials.total.toFixed(2)}`;
    if (trackerReceiptItems) {
      trackerReceiptItems.innerHTML = `
        ${order.items.map(item => `
          <div class="receipt-item-row">
            <span>${item.quantity}x ${item.name}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
          </div>
        `).join('')}
        <div class="receipt-item-row" style="margin-top:6px; font-weight:700; border-top: 1px dashed var(--border-light); padding-top:6px;">
          <span>Total Charged (${order.financials.isFreeDelivery ? 'Free Delivery' : 'Express Delivery'} + Tip)</span>
          <span>$${order.financials.total.toFixed(2)}</span>
        </div>
        <div class="receipt-item-row" style="font-size:0.75rem; color:var(--text-muted)">
          <span>Delivering to: ${order.address}</span>
        </div>
      `;
    }

    // Reset Steps
    step1.className = 'tracker-step completed';
    step2.className = 'tracker-step active';
    step3.className = 'tracker-step';
    step4.className = 'tracker-step';

    // Countdown Timer logic
    clearInterval(orderCountdownInterval);
    let secondsLeft = order.etaSeconds;

    function updateTimerDisplay() {
      const mins = Math.floor(secondsLeft / 60);
      const secs = secondsLeft % 60;
      const formatted = `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
      if (trackerEtaTimer) trackerEtaTimer.textContent = formatted;
      if (minimizedOrderEta) minimizedOrderEta.textContent = `Arriving in ~${mins} mins`;

      // Update statuses over time
      if (secondsLeft < 19 * 60 + 20 && step2.classList.contains('active')) {
        step2.className = 'tracker-step completed';
        step2.querySelector('.step-marker').innerHTML = '&#10003;';
        step3.className = 'tracker-step active';
        step3.querySelector('.step-marker').innerHTML = '<span class="step-spinner"></span>';
        if (mapLiveStatusText) mapLiveStatusText.textContent = 'Induction pod sealed at 155°F · Courier dispatched';
      }

      if (secondsLeft < 18 * 60 + 30 && step3.classList.contains('active')) {
        step3.className = 'tracker-step completed';
        step3.querySelector('.step-marker').innerHTML = '&#10003;';
        step4.className = 'tracker-step active';
        step4.querySelector('.step-marker').innerHTML = '<span class="step-spinner"></span>';
        if (mapLiveStatusText) mapLiveStatusText.textContent = 'Marco is 0.4 miles away on Market St · Approaching drop';
      }

      if (secondsLeft <= 0) {
        clearInterval(orderCountdownInterval);
        step4.className = 'tracker-step completed';
        step4.querySelector('.step-marker').innerHTML = '&#10003;';
        if (trackerEtaTimer) trackerEtaTimer.textContent = 'ARRIVED';
        if (mapLiveStatusText) mapLiveStatusText.textContent = 'Ding dong! Food arrived hot at your doorstep!';
        showToast('Food Arrived! 🛎️', 'Courier Marco has arrived at your drop point.');
      }

      secondsLeft--;
    }

    updateTimerDisplay();
    orderCountdownInterval = setInterval(updateTimerDisplay, 1000);

    // Animate Courier Marker along map route
    animateMapCourier();
  }

  function animateMapCourier() {
    if (!animatedCourierMarker) return;
    let progress = 0.2;
    const pathPoints = [
      { x: 170, y: 350 },
      { x: 170, y: 300 },
      { x: 290, y: 230 },
      { x: 380, y: 185 },
      { x: 510, y: 115 },
      { x: 530, y: 125 }
    ];

    function step() {
      progress += 0.0007;
      if (progress > 0.95) progress = 0.95;

      const totalSegments = pathPoints.length - 1;
      const currentSegment = Math.min(Math.floor(progress * totalSegments), totalSegments - 1);
      const segmentProgress = (progress * totalSegments) - currentSegment;

      const p1 = pathPoints[currentSegment];
      const p2 = pathPoints[currentSegment + 1];

      const currentX = p1.x + (p2.x - p1.x) * segmentProgress;
      const currentY = p1.y + (p2.y - p1.y) * segmentProgress;

      animatedCourierMarker.setAttribute('transform', `translate(${currentX.toFixed(1)}, ${currentY.toFixed(1)})`);

      if (progress < 0.95) {
        courierAnimFrame = requestAnimationFrame(step);
      }
    }

    cancelAnimationFrame(courierAnimFrame);
    courierAnimFrame = requestAnimationFrame(step);
  }

  function minimizeTracker() {
    trackerModalOverlay.classList.remove('open');
    orderTrackerModal.classList.remove('open');
    document.body.classList.remove('modal-open');
    if (minimizedTrackingBar) minimizedTrackingBar.classList.remove('hidden');
    showToast('Tracking Minimized', 'Your live 20-min order is running in the background pill.');
  }

  function maximizeTracker() {
    if (minimizedTrackingBar) minimizedTrackingBar.classList.add('hidden');
    trackerModalOverlay.classList.add('open');
    orderTrackerModal.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeTracker() {
    minimizeTracker();
  }

  if (btnMinimizeTracker) btnMinimizeTracker.addEventListener('click', minimizeTracker);
  if (btnCloseTracker) btnCloseTracker.addEventListener('click', closeTracker);
  if (trackerModalOverlay) trackerModalOverlay.addEventListener('click', minimizeTracker);
  if (btnMaximizeTracker) btnMaximizeTracker.addEventListener('click', maximizeTracker);

  // Driver Call & Message
  if (btnCallCourier) {
    btnCallCourier.addEventListener('click', () => {
      showToast('Calling Marco Rossi 📞', 'Routing audio call via private Cravely driver dispatch...');
    });
  }

  if (btnMsgCourier) {
    btnMsgCourier.addEventListener('click', () => {
      const msg = prompt('Enter a message for courier Marco:', 'Please leave on doorstep table.');
      if (msg) {
        showToast('Message Sent 💬', `Sent to Marco: "${msg}"`);
      }
    });
  }

  // =========================================================================
  // 10. DISH DETAIL EDITORIAL INSPECTION MODAL
  // =========================================================================
  function openDishModal(dishId) {
    const dish = dishesData[dishId];
    if (!dish) return;

    state.modalDish = dish;
    state.modalQuantity = 1;

    // Populate Modal Content
    if (modalDishImg) {
      modalDishImg.src = dish.image;
      modalDishImg.alt = dish.name;
    }
    if (modalDishCategory) modalDishCategory.textContent = dish.category;
    if (modalDishRating) modalDishRating.textContent = `★ ${dish.rating} (${dish.reviewsCount} reviews)`;
    if (modalDishKitchen) modalDishKitchen.textContent = dish.kitchen;
    if (modalDishChef) modalDishChef.textContent = dish.chef;
    if (modalDishTitle) modalDishTitle.textContent = dish.name;
    if (modalDishPrice) modalDishPrice.textContent = `$${dish.price.toFixed(2)}`;
    if (modalDishHeadline) modalDishHeadline.textContent = dish.headline;
    if (modalDishStory) modalDishStory.textContent = dish.story;
    if (modalDishPantry) modalDishPantry.textContent = dish.pantry;

    // Nutrition macros
    if (macroCal) macroCal.textContent = dish.nutrition.cal;
    if (macroProtein) macroProtein.textContent = dish.nutrition.protein;
    if (macroCarbs) macroCarbs.textContent = dish.nutrition.carbs;
    if (macroFat) macroFat.textContent = dish.nutrition.fat;

    // Dietary Badges
    if (modalDietaryTags) {
      modalDietaryTags.innerHTML = dish.dietary.map(tag => `
        <span class="dietary-tag">${tag}</span>
      `).join('');
    }

    if (modalSpecialNotes) modalSpecialNotes.value = '';
    updateModalPriceButton();

    dishModalOverlay.classList.add('open');
    dishDetailModal.classList.add('open');
    document.body.classList.add('modal-open');
  }

  function closeDishModal() {
    if (dishModalOverlay) dishModalOverlay.classList.remove('open');
    if (dishDetailModal) dishDetailModal.classList.remove('open');
    document.body.classList.remove('modal-open');
    state.modalDish = null;
  }

  function updateModalPriceButton() {
    if (!state.modalDish) return;
    const total = state.modalDish.price * state.modalQuantity;
    if (modalQtyCount) modalQtyCount.textContent = state.modalQuantity;
    if (modalAddBtnText) modalAddBtnText.textContent = `Add to Tray • $${total.toFixed(2)}`;
  }

  if (modalQtyMinus) {
    modalQtyMinus.addEventListener('click', () => {
      if (state.modalQuantity > 1) {
        state.modalQuantity--;
        updateModalPriceButton();
      }
    });
  }

  if (modalQtyPlus) {
    modalQtyPlus.addEventListener('click', () => {
      state.modalQuantity++;
      updateModalPriceButton();
    });
  }

  if (btnModalAddToCart) {
    btnModalAddToCart.addEventListener('click', () => {
      if (!state.modalDish) return;
      const notes = modalSpecialNotes ? modalSpecialNotes.value.trim() : '';
      addItemToCart(state.modalDish.id, state.modalDish.price, state.modalQuantity, notes);
      closeDishModal();
      openCartDrawer('items');
    });
  }

  if (btnDishModalClose) btnDishModalClose.addEventListener('click', closeDishModal);
  if (dishModalOverlay) dishModalOverlay.addEventListener('click', closeDishModal);

  // Wire Food Card Clicks: Clicking anywhere on card opens modal unless clicking Add button or wishlist
  foodCards.forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.closest('.btn-add-cart') || e.target.closest('.btn-wishlist')) {
        return; // Handled separately
      }
      const id = parseInt(card.dataset.id, 10);
      if (id) {
        openDishModal(id);
      }
    });
  });

  // =========================================================================
  // 11. ADD TO CART & QUICK ADD HERO ACTIONS
  // =========================================================================
  addToCartBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const name = btn.dataset.name;
      const price = btn.dataset.price;
      addItemToCart(name, price, 1);

      const originalHTML = btn.innerHTML;
      btn.innerHTML = `<span>✓ Added</span>`;
      btn.style.backgroundColor = 'var(--forest-green)';
      btn.style.color = '#fff';

      setTimeout(() => {
        btn.innerHTML = originalHTML;
        btn.style.backgroundColor = '';
        btn.style.color = '';
      }, 1000);
    });
  });

  window.quickAddHero = (id, name, price) => {
    addItemToCart(id || name, price, 1);
  };

  // =========================================================================
  // 12. WISHLIST TOGGLE
  // =========================================================================
  wishlistBtns.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.stopPropagation();
      const card = btn.closest('.food-card');
      const id = card.dataset.id;
      const title = card.querySelector('.ledger-item-name').textContent;

      if (state.savedDishes.has(id)) {
        state.savedDishes.delete(id);
        btn.classList.remove('active');
        showToast('Removed from Favorites', `${title} removed.`);
      } else {
        state.savedDishes.add(id);
        btn.classList.add('active');
        showToast('Saved to Favorites! ❤️', `${title} saved to your culinary list.`);
      }
    });
  });

  // =========================================================================
  // 13. PROMO CODE CLIPBOARD COPY
  // =========================================================================
  function setupPromoCopy(buttonElement) {
    if (!buttonElement) return;
    buttonElement.addEventListener('click', async () => {
      const code = 'CRAVE20';
      try {
        await navigator.clipboard.writeText(code);
        showToast('Coupon Copied! 🎉', 'Code CRAVE20 saved. Enjoy 20% off your chef order.');
        
        const textSpan = buttonElement.querySelector('span');
        if (textSpan) {
          const originalText = textSpan.textContent;
          textSpan.textContent = 'Copied!';
          setTimeout(() => {
            textSpan.textContent = originalText;
          }, 2000);
        }
      } catch (err) {
        showToast('Coupon Active: CRAVE20', 'Applied 20% discount to your order.');
      }
    });
  }

  setupPromoCopy(copyPromoBtn);
  setupPromoCopy(copyPromoCtaBtn);

  // =========================================================================
  // 14. LOCATION SELECTOR QUICK TOGGLE & GEOLOCATION
  // =========================================================================
  const locations = [
    'Downtown, SF',
    'Mission District, SF',
    'Marina & Pacific Heights',
    'SoMa District, SF',
    'North Beach & Telegraph'
  ];
  let locIndex = 0;

  if (locationSelector && currentLocationText) {
    locationSelector.addEventListener('click', () => {
      locIndex = (locIndex + 1) % locations.length;
      state.selectedLocation = locations[locIndex];
      currentLocationText.textContent = state.selectedLocation;
      if (mobileLocText) mobileLocText.textContent = state.selectedLocation;
      
      const addrInput = document.getElementById('addressInput');
      if (addrInput) addrInput.value = state.selectedLocation;

      showToast('Delivery Zone Updated 📍', `Showing indie kitchens serving ${state.selectedLocation}`);
    });
  }

  if (btnGeolocate) {
    btnGeolocate.addEventListener('click', () => {
      btnGeolocate.style.transform = 'rotate(180deg)';
      setTimeout(() => {
        btnGeolocate.style.transform = '';
        state.selectedLocation = 'Market St & 4th, SF';
        if (currentLocationText) currentLocationText.textContent = state.selectedLocation;
        if (mobileLocText) mobileLocText.textContent = state.selectedLocation;
        const addrInput = document.getElementById('addressInput');
        if (addrInput) addrInput.value = state.selectedLocation;
        showToast('GPS Zone Pinned 🎯', 'Pinned Market St & 4th (18-20 min live dispatch)');
      }, 450);
    });
  }

  // =========================================================================
  // 15. FAQ ACCORDION
  // =========================================================================
  faqItems.forEach(item => {
    const questionBtn = item.querySelector('.faq-question');
    questionBtn.addEventListener('click', () => {
      const isActive = item.classList.contains('active');
      
      faqItems.forEach(otherItem => {
        otherItem.classList.remove('active');
        otherItem.querySelector('.faq-question').setAttribute('aria-expanded', 'false');
      });

      if (!isActive) {
        item.classList.add('active');
        questionBtn.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // =========================================================================
  // 16. GLOBAL FORM HANDLERS
  // =========================================================================
  window.handleFindFood = () => {
    const addr = document.getElementById('addressInput').value;
    showToast('Kitchens Loaded! 🍳', `Found 24 indie kitchens delivering to "${addr}" in under 20 mins.`);
    document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
  };

  window.handleCtaOrder = () => {
    const addr = document.getElementById('ctaAddressInput').value;
    showToast('Order Initialized 🚀', `20% discount code CRAVE20 applied for ${addr}!`);
    setTimeout(() => {
      document.getElementById('menu').scrollIntoView({ behavior: 'smooth' });
    }, 500);
  };

  window.handleNewsletter = () => {
    const email = document.getElementById('newsletterEmail').value;
    showToast('Joined the Tasting Club! 🍷', `Welcome! Secret drops will be delivered to ${email}.`);
    document.getElementById('newsletterEmail').value = '';
  };

  // Keyboard accessibility (Escape key closes open modals/drawers)
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (dishDetailModal && dishDetailModal.classList.contains('open')) closeDishModal();
      if (cartDrawer && cartDrawer.classList.contains('open')) closeCartDrawer();
      if (orderTrackerModal && orderTrackerModal.classList.contains('open')) minimizeTracker();
    }
  });

  // Initial cart display refresh
  updateCartDisplay();
});
