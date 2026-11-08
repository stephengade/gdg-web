# Product Requirements Document (PRD)
# Project: Cravely — Chef-Crafted Gourmet Food Delivery

**Document Version:** 2.0.0  
**Status:** Approved / Active Development  
**Target Market:** San Francisco, CA (Initial Launch Hub)  
**Primary Platform:** Responsive Web Application (Mobile-First Desktop & Handheld)  

---

## 1. Executive Summary & Vision

### 1.1 Product Vision
**Cravely** is an artisanal culinary delivery platform built to reconnect independent neighborhood kitchens with passionate food lovers. Designed with the aesthetics of an editorial culinary magazine and the logistics precision of a micro-hub express network, Cravely guarantees:
1. **Guaranteed 20-Minute Doorstep Delivery:** Hyper-local dispatch radii (<2.2 miles) coupled with dedicated electric cargo couriers.
2. **Active Heated Induction Thermal Pods:** Food locked at 155°F to ensure dishes arrive at the exact plating temperature and texture intended by the chef (zero soggy crusts or cold burgers).
3. **Radical Fee Transparency:** Flat $2.50 express delivery or $0 (free) for orders over $25. Zero hidden service fees, regulatory recovery markups, or dynamic surge pricing.
4. **Chef-First Economics:** Independent culinary creators retain 85%+ of order revenue, preserving the viability of indie gastronomy in high-rent urban centers.

### 1.2 The Problem Statement
The legacy food delivery aggregators (DoorDash, UberEats, Grubhub) have created a broken ecosystem:
* **For Diners:** Meals arrive 45–70 minutes after ordering, lukewarm, steamed soggy in nylon bags, and inflated by 25–40% in checkout junk fees.
* **For Independent Kitchens:** Aggregators impose 30–40% commission cuts, cannibalizing already razor-thin restaurant margins and reducing culinary art to commoditized fast food.
* **For Couriers:** Low base pay and algorithmic multi-order stacking force drivers to juggle 3–4 orders across disparate stops, compromising quality and customer satisfaction.

### 1.3 The Cravely Solution
Cravely dismantles the multi-stop aggregator model through:
* **Single-Flight Direct Delivery:** One courier transports one order directly to one customer. No route detours or multi-restaurant stacking.
* **Micro-Hub Geofencing:** Orders are strictly restricted to a 2.2-mile radius around partner kitchens, guaranteeing sub-12-minute transit times.
* **Artisanal Curation:** Strictly curated catalog of boutique independent kitchens, excluding multinational fast-food chains and industrial ghost kitchens.

---

## 2. Target Audience & User Personas

### Persona 1: "The Urban Gourmet" (Primary Consumer)
* **Demographics:** Age 26–45, urban professional living in high-density SF neighborhoods (SoMa, Mission, Downtown, Marina, Pacific Heights).
* **Behaviors:** Highly values culinary quality, provenance of ingredients, and craft preparation. Frustrated by cold, soggy food from existing delivery apps.
* **Needs:** Fast, dependable delivery during busy workdays or relaxing evenings; transparency on ingredients, allergens, and fees.

### Persona 2: "The Independent Artisan Chef" (Supply Partner)
* **Demographics:** Owner-operator or executive chef of a local boutique restaurant or specialty bakery.
* **Pain Points:** Wants to reach off-premise diners without sacrificing food integrity or paying extortionate aggregator commissions.
* **Needs:** A delivery partner that respects cooking temperatures, provides fair revenue share (85%+ retention), and presents dishes with editorial elegance.

### Persona 3: "The Dedicated Courier Guild" (Logistics Operator)
* **Demographics:** Full-time urban couriers riding high-torque electric cargo bikes.
* **Motivations:** Fair hourly wages, reliable equipment (heated induction thermal pods), and optimized single-drop routes avoiding car gridlock.

---

## 3. Core Product Features & Functional Requirements

### 3.1 Editorial Showcase & Hero Experience
* **3-Panel Interactive Showcase:**
  * **Panel 1 (Forest Green):** Featured Artisan Smash Burger with hand-drawn food doodles, cutout photography with ambient drop shadows, and direct "Order Burger" action.
  * **Panel 2 (Chef Kitchen Stream):** Live kitchen status pill (`18-22 min delivery`) and photography celebrating artisanal culinary craft.
  * **Panel 3 (Sunflower Yellow):** Wood-Fired Neapolitan Pizza with editorial serif title, line-art accents, and quick-add action.
* **Delivery Zone Picker:**
  * Top navigation pill allowing users to switch between San Francisco delivery zones (*Downtown, Mission District, Marina & Pacific Heights, SoMa, North Beach*).
* **GPS Geolocation Button:**
  * Instant geolocation simulation pinning the user's nearest micro-hub (e.g. `Market St & 4th, SF`) with one tap.
* **Real-Time Announcement Bar:**
  * Dynamic banner showcasing live average delivery ETA (`21 Mins`) and one-click copyable promo code `CRAVE20`.

### 3.2 Curated Menu Highlights (Recipe Ledger)
* **Category Filtering:** Smooth, zero-page-reload filter tabs (`All Dishes`, `Artisan Burgers`, `Wood-Fired Pizza`, `Healthy Bowls`, `Sushi & Asian`, `Desserts`).
* **Line-Leader Typography:** Vintage editorial cookbook layout featuring dotted leaders linking dish names to prices: `Dish Name ──────── $Price`.
* **Pantry Notes & Transparency:** Full itemized ingredient listings detailing provenance (e.g. *45-day dry-aged beef, San Marzano D.O.P. tomatoes, Valrhona 70% dark chocolate*).
* **Interactive Wishlist Toggle:** Heart icon on each dish card to favorite/save items to local state with immediate toast confirmation.
* **Ratings & Reviews Counter:** Clear star ratings (e.g. `★ 4.95`) and verified diner review counters (`61 💬`).

### 3.3 Dish Detail Editorial Inspection Modal
* **Trigger:** Clicking any menu card (outside of direct Add or Favorite buttons).
* **Visual Presentation:** Two-column editorial modal featuring:
  * High-resolution dish photography with category and rating pills.
  * Indie kitchen name and creator chef attribution (e.g. *Chef Marcus Vance at SmashCraft Lab*).
  * In-depth culinary backstory and tasting profile.
  * Nutritional macro breakdown: Calories, Protein, Carbohydrates, and Healthy Fats.
  * Dietary and allergen certification tags (*Gluten-Free, Vegetarian, Organic, D.O.P. Certified*).
  * Itemized pantry ingredient list.
  * Special kitchen request input (e.g. *"extra sauce on the side"*).
  * Custom quantity stepper (`-`, count, `+`) with live-updating *"Add to Tray • $Price"* CTA button.

### 3.4 Interactive Slide-Over Cart Drawer (`#cartDrawer`)
* **Trigger:** Header cart button, bottom floating sticky pill, or hero action buttons.
* **Itemized Cart Stepper:** Real-time quantity adjustment (`-` decrement / remove, `+` increment) and one-tap trash deletion.
* **Free Delivery Threshold Meter:**
  * Dynamic visual progress bar tracking distance to free express delivery (Threshold: `$25.00`).
  * Shows remaining amount needed or unlocked celebration badge (`🎉 FREE 20-Min Delivery unlocked!`).
* **Promo Code Engine:**
  * Pre-populated one-tap suggestion chip for `CRAVE20` granting 20% off all food items.
  * Manual code input with validation, toast alerts, and a removable active discount tag.
* **Courier & Kitchen Tip Selector:** Selectable chips for `$2.00`, `$3.00` (default), `$5.00`, or `None`.
* **Transparent Ledger Financials:**
  * Items Subtotal
  * Promo Discount (20% reduction when active)
  * 20-Min Express Delivery Fee (`$2.50` or `FREE`)
  * Courier Thermal Tip
  * Total Estimated Charge
* **Cart State Resilience:** Full drawer empty-state illustration with quick-navigation back to the menu.

### 3.5 Seamless Checkout & Mock Payment Flow
* **View Transition:** Two-step slide-over workflow inside the cart drawer (`Step 1: Items` → `Step 2: Coordinates & Payment`) with back-navigation.
* **Delivery Coordinates Form:**
  * Pre-populated with user's selected neighborhood or geolocated street address.
  * Apartment, suite, and callbox buzzer code inputs.
  * Contact mobile phone number.
  * Drop-off instructions (e.g. *"Leave on doorstep table, do not knock"*).
* **Thermal Pod Reservation Assurance:**
  * Animated status badge confirming reservation of active induction pod `#14` (locked at 155°F).
* **Payment Method Tabs:**
  * Credit/Debit Card (card number with auto-formatting, expiry, CVC).
  * Apple Pay 1-tap integration.
* **Order Placement Experience:**
  * Primary action button with loading spinner state (`"Verifying with kitchen..."` → `"Locking Heated Pod #14..."`).
  * Auto-generates unique order ID (e.g. `#CRV-8942`), clears cart, and immediately launches the Live Tracking experience.

### 3.6 Live Order Tracking & Dispatch Map Simulation
* **Real-Time Countdown Timer:**
  * Second-by-second live countdown starting from `19:50` down to `00:00`.
* **SF Vector Route Map:**
  * Detailed SVG vector illustration of downtown San Francisco (Market St, Mission St, 4th St, 2nd St, Yerba Buena Gardens, SF Bay shoreline).
  * Glowing animated gradient route path with animated dashed movement.
  * Origin kitchen pin with chef hat icon (`🍳 KITCHEN DISPATCH`).
  * Destination customer pin (`📍 YOUR DOORSTEP`).
  * Real-time moving electric scooter marker (`🛵`) that animates along the street coordinates.
  * Floating dynamic status badge updating with distance and street maneuvers.
* **4-Stage Culinary Timeline:**
  1. *Order Received* (Kitchen ticket printed)
  2. *Chef Crafting* (Active searing/baking)
  3. *Pod Induction Sealed* (155°F thermal cargo lock)
  4. *Doorstep Drop* (Contactless handoff)
* **Courier Profile Card:**
  * Driver avatar (Marco Rossi, 4.98 ★, 1,480 safe drops).
  * Vehicle badge: *Specialized Heated E-Cargo Bike*.
  * Working interactive *"Call"* and *"Message"* action triggers.
* **Collapsible Itemized Receipt:** Full breakdown of ordered items, amounts paid, payment method, and destination address.
* **Minimized Background Tracking Pill:**
  * Allows users to minimize the tracking modal into a floating bottom-left pill (`#minimizedTrackingBar`) to continue exploring the site while tracking live delivery progress.

### 3.7 Dedicated About & Manifesto Page (`about.html`)
* **The Cravely Manifesto:** Bold editorial mission explaining why corporate aggregator apps failed and how Cravely restores culinary integrity.
* **Impact Metrics Bar:** 85%+ chef retention, 19.4-min average drop, 155°F thermal lock, 42 SF kitchen partners.
* **The 24th Street Origin Story:** Narrative of co-founders Chef Mateo Cruz and urban logistics architect Liam Chen inventing the single-order induction pod model.
* **The Four Non-Negotiable Pillars:**
  1. *The 2.2-Mile Micro-Hub Radius*
  2. *Ceramic Induction Thermal Pods (155°F steam lock)*
  3. *Chef-First Fair Economics (15% commission cap)*
  4. *Direct-Flight Courier Guild (Zero multi-order stacking)*
* **Resident Chef Guild Spotlight:** Highlighting partner chefs Marcus Vance, Elena Rossi, Kai Tanaka, and Chloé Laurent with bios, specialties, and testimonials.
* **20-Minute Route Technology:** Detailed 4-step logistical sequence from synchronized firing to bike-lane routing.
* **Dual Conversion CTAs:** Action paths for diners to order and for independent kitchens to apply for guild membership.

---

## 4. Non-Functional Requirements

### 4.1 Performance & Speed
* **First Contentful Paint (FCP):** < 1.0 second on standard broadband.
* **Time to Interactive (TTI):** < 1.5 seconds.
* **Zero Bloat Dependency:** 100% vanilla HTML5, CSS3, and JavaScript with zero external runtime frameworks (no React/Vue overhead).
* **Asset Optimization:** Web-optimized imagery with progressive Unsplash query parameters (`&auto=format&fit=crop&q=80`) and native lazy loading.

### 4.2 Accessibility (WCAG 2.1 Level AA)
* **Color Contrast:** All body text meets minimum contrast ratio of 4.5:1 against parchment canvas (`#FAF7F2`) and white surfaces (`#FFFFFF`).
* **ARIA Semantics:** Proper roles (`role="dialog"`, `role="tablist"`, `aria-modal="true"`, `aria-expanded`, `aria-hidden`) on all interactive overlays, modals, accordions, and drawers.
* **Keyboard Navigation:** Full tab order navigation; `Escape` key closes all active modals, drawers, and overlays.
* **Touch Targets:** Minimum interactive button and icon hit targets of 44px × 44px for handheld mobile usability.

### 4.3 Browser & Responsive Compatibility
* **Supported Browsers:** Chrome, Safari, Edge, Firefox (latest 2 versions), iOS Safari, Android Chrome.
* **Responsive Breakpoints:**
  * Desktop / Ultrawide: `>= 1200px`
  * Laptop / Tablet Landscape: `992px – 1199px`
  * Tablet Portrait: `768px – 991px`
  * Mobile Handheld: `480px – 767px`
  * Small Phone: `< 480px`

### 4.4 Reliability & Error Handling
* **Graceful Degradation:** All JavaScript DOM handlers are guarded against null elements, ensuring cross-page resilience across `index.html` and `about.html`.
* **State Fallbacks:** Unknown or uncataloged dishes gracefully default to safe fallback images and prices without breaking cart calculations.

---

## 5. Success Metrics & Key Performance Indicators (KPIs)

| Metric | Target | Measurement Method |
| :--- | :--- | :--- |
| **Average Delivery Time** | $\le$ 20.0 Minutes | Courier dispatch timestamp to doorstep drop confirmation. |
| **Food Arrival Temperature** | $\ge$ 145°F | Digital thermal pod sensor logging upon delivery. |
| **Checkout Conversion Rate** | $\ge$ 8.5% | Unique landing page visitors to completed orders. |
| **Promo Code Utilization** | $\ge$ 40% | Orders utilizing welcome discount code `CRAVE20`. |
| **Cart Abandonment Rate** | $\le$ 25% | Users initiating cart drawer vs. completing checkout. |
| **Chef Retention Rate** | $\ge$ 95% | Month-over-month partner kitchens remaining active. |
| **Customer CSAT / NPS** | $\ge$ 72 NPS | Post-delivery 5-star rating and survey responses. |
