# Project Handoff: Cravely Landing Page & Web App

## 1. Project Overview
**Cravely** is a responsive, high-conversion culinary web application and landing page for a boutique gourmet food delivery startup connecting indie neighborhood kitchens to customers with a guaranteed 20-minute delivery promise and zero hidden checkout fees.

The visual design is styled after an artisanal culinary magazine / cookbook (inspired by warm editorial palettes, generous border radii, hand-drawn food doodles, and line-leader recipe ledgers).

---

## 2. File Map & Architecture
All files are located in the project root: `C:\Users\gade0x\Desktop\project\gdg\`

| File | Purpose |
| :--- | :--- |
| [`index.html`](./index.html) | Semantic HTML5 structure with ARIA accessibility roles, slide-over cart drawer, checkout modal, live map tracking view, and dish detail inspection modal. |
| [`about.html`](./about.html) | Dedicated editorial brand manifesto & story page detailing Cravely's 20-min micro-hub model, resident partner chef guild, induction pod tech, and restaurant equity metrics. |
| [`style.css`](./style.css) | Custom CSS design system, CSS variables/tokens, 3-panel showcase, interactive drawer, live vector route map animation, dish inspection modal, about page layout, and responsive breakpoints. |
| [`app.js`](./app.js) | Production JavaScript handling dishes catalog, itemized cart state, promo coupons (`CRAVE20`), checkout flow, live courier GPS simulation with SVG map route, dish detail modal, and toast notifications. |
| [`handoff.md`](./handoff.md) | Complete session handoff and architectural documentation. |

---

## 3. Design Tokens & System

### Color Palette
* **Canvas Background:** `--bg-canvas: #FAF7F2` (Warm parchment / cream)
* **Surface Background:** `--bg-surface: #FFFFFF`
* **Deep Forest Green:** `--forest-green: #0E4334` (Anchor brand color, announcement bar, primary buttons, CTA banner, live dispatch)
* **Sunflower Yellow:** `--golden-yellow: #F5BE38` (Hero right panel, special tags, star ratings, courier vehicle badge)
* **Warm Terracotta / Coral:** `--terracotta: #D9532F` (Circular action buttons, search pins, wishlist active state, order CTA)
* **Text High Contrast:** `--text-primary: #19211C` (Espresso forest black)
* **Text Muted:** `--text-secondary: #58635B`, `--text-muted: #88938B`
* **Borders:** `--border-light: #E8E2D6`, `--border-subtle: #F1ECE2`

### Typography Pairing
* **Display & Editorial Headings:** `DM Serif Display` (Google Fonts) — used for the logo `Cravely.`, hero titles, section headlines, prices, and testimonial quotes.
* **UI & Body:** `Plus Jakarta Sans` (Google Fonts) — used for metadata, buttons, ingredient lists, cart steppers, and navigation.

### Radii & Geometry
* **Cards & Panels:** `--radius-card: 28px` (Organic, rounded silhouettes matching the reference design)
* **Pill Elements:** `--radius-pill: 9999px` (Buttons, tags, navigation pills, search inputs)
* **Circular Buttons:** `44px × 44px` with `50%` radius for action icon triggers.

---

## 4. Key Sections & Implemented Features

### 1. Header & Navigation
* **Announcement Bar:** Top notification with live delivery ETA (`21 Mins`) and one-click copyable promo code `CRAVE20`.
* **Sticky Blur Header:** Glassmorphic navigation with scroll elevation shadow.
* **Editorial Logo:** `Cravely.` in `DM Serif Display` with terracotta period dot.
* **Delivery Zone Picker:** Interactive location pill that toggles through SF neighborhoods (`Downtown`, `Mission`, `Marina`, `SoMa`, `North Beach`).
* **Search & Cart:** Circular search button, shopping cart counter with dynamic bump animation, and mobile hamburger drawer.

### 2. The 3-Panel Editorial Hero Showcase
* **Panel 1 (Forest Green `#0E4334`):** Hand-drawn food doodle sketch background, floating wagyu burger cutout with ambient shadow, serif title, white pill CTA (`Order Burger`), and terracotta circular action button.
* **Panel 2 (Chef Craft Photo):** Chef in kitchen with live kitchen stream status pill and `18-22 min delivery` badge.
* **Panel 3 (Sunflower Yellow `#F5BE38`):** Line-art pizza doodles, floating wood-fired pizza cutout, serif title (`Cheese and Spice on every Slice.`), white pill CTA (`Order Pizza`), and dark circular action button.
* **Address Search Bar:** Street address input with instant GPS geolocate button and "Find Kitchens" CTA.
* **Hero Stat Bar:** Key metrics (20-min guarantee, 45,000+ orders, 4.9/5 rating, $0 hidden fees).

### 3. Curated Menu Highlights (Editorial Recipe Ledger)
* **Category Filter Tabs:** Smooth filter buttons (`All Dishes`, `Artisan Burgers`, `Wood-Fired Pizza`, `Healthy Bowls`, `Sushi & Asian`, `Desserts`).
* **Line-Leader Headers:** Direct reference adaptation with dotted leaders: `Dish Title ──────── $Price`.
* **Cutout Thumbnails:** Square rounded thumbnails with interactive wishlist heart toggle.
* **Pantry Notes:** Itemized culinary ingredients breakdown (e.g., *"Pantry: 45-day dry aged beef, Havarti cheese..."*).
* **Card Actions:** "Add to Tray" button with visual feedback, rating badge, and review comment counts (`36 💬`).
* **Interactive Dish Inspection:** Clicking any dish card opens the **Dish Detail Editorial Modal**.

### 4. Interactive Cart Slide-Over Drawer
* **Drawer Navigation:** Opens seamlessly via header cart button, sticky floating bar, or checkout trigger.
* **Itemized Steppers:** Increment (`+`), decrement (`-`), and remove item capabilities with real-time subtotal re-calculation.
* **Free Delivery Progress Meter:** Dynamic progress bar showing how much more to add for $0 delivery (threshold: $25.00).
* **Promo Code Engine:** Quick-apply chip and input for `CRAVE20` granting 20% off all dishes with toast confirmation.
* **Courier & Kitchen Tip Selector:** Selectable tip options ($2, $3, $5, or None).
* **Transparent Ledger Breakdown:** Item subtotal, promo deduction, delivery fee, tip, and total due.

### 5. Checkout & Mock Payment Flow
* **Address & Drop Coordinates:** Pre-populated with user's active neighborhood or GPS location with editable apartment/buzzer and delivery note fields.
* **Thermal Pod Route Assurance:** Visual indicator confirming reservation of active induction pod #14 (sealed at 155°F).
* **Payment Selector:** Credit Card mock input (with card number, expiration, CVC) and Apple Pay 1-tap option.
* **Order Processing Animation:** Button enters loading state with real-time feedback ("Verifying with kitchen...", "Locking Heated Pod #14...").

### 6. Live Order Tracker & Map Simulation
* **Live Vector Route Map:** Beautiful SVG map of San Francisco (Market St, Mission St, SoMa, Embarcadero) featuring animated dashed gradient route glow.
* **Animated Courier Marker:** Electric scooter icon smoothly navigates along the route path toward the customer's doorstep.
* **Real-Time Countdown Timer:** Real-time second-by-second countdown from 19:50 with dynamic stage transitions.
* **4-Stage Culinary Timeline:**
  1. *Order Received* (Ticket printed)
  2. *Chef Crafting* (Active cooking)
  3. *Pod Induction Sealed* (155°F thermal lock)
  4. *Doorstep Drop* (Contactless handoff)
* **Courier Profile Card:** Courier Marco Rossi (4.98 ★, 1,480 safe drops) with working "Call" and "Message" interactive triggers.
* **Collapsible Receipt Accordion:** Full line-item breakdown of the placed order.
* **Minimized Background Tracking Pill:** Floating bottom bar allowing users to continue browsing while keeping track of their delivery ETA and re-opening the map with one click.

### 7. Dish Detail Editorial Inspection Modal
* **Full Culinary Story:** High-resolution photography, kitchen origin, chef attribution, and flavor profile description.
* **Macro Nutritional Stats:** Calories, Protein, Carbs, and Healthy Fats.
* **Dietary & Allergen Badges:** Badges for Gluten-Free, Vegetarian, Organic, D.O.P. Certified, etc.
* **Special Kitchen Instructions:** Input field for custom preparation notes.
* **Quantity Controls & Direct Add to Tray:** Custom stepper with live total price calculation.

### 8. Order CTA Banner, FAQ & Footer
* Forest green promo card with 20% off welcome headline.
* Interactive accessible expand/collapse FAQ items.
* 4-column footer with brand backstory, menu links, company links, and newsletter signup.

### 9. Dedicated About & Manifesto Page (`about.html`)
* **Hero Manifesto & Impact Metrics:** 85%+ chef retention, 19.4-min average drop, 155°F pod lock, 42 SF kitchen partners.
* **Mission District Origin Story:** Editorial spread chronicling founders Chef Mateo Cruz and urban logistics architect Liam Chen solving the cold delivery crisis.
* **The Four Non-Negotiable Pillars:** 2.2-mile micro-hub radius, ceramic induction heating pods, chef equity (capped 15% fee), and direct-flight single-order couriers.
* **Resident Chef Guild Spotlight:** Profiles, specialties, and quotes for Chef Marcus Vance, Chef Elena Rossi, Chef Kai Tanaka, and Chef Chloé Laurent.
* **20-Minute Route Technology:** Clockwork choreography from synchronized order firing to SF bike-lane fast tracking.
* **Dual Diner & Chef Partnership CTAs:** Clear conversion paths for food lovers to order and independent kitchens to apply.
* **Unified Cart & Tracking:** Full integration with `app.js` and `style.css` so cart drawers and toasts work identically across both pages.

---

## 5. State Management & Catalog in `app.js`

| State / Data | Description |
| :--- | :--- |
| `dishesData` | Catalog of 6 gourmet dishes with IDs, names, prices, categories, images, chef bios, pantry lists, macros, and dietary tags. |
| `state.cart` | Array of `{ id, name, price, quantity, image, notes }`. |
| `state.activeOrder` | Active order object `{ orderId, items, financials, address, timestamp, etaSeconds }`. |
| `calculateFinancials()` | Calculates subtotal, 20% discount (if `CRAVE20`), delivery fee ($2.50 or Free over $25), tip, and total. |
| `updateCartDisplay()` | Synchronizes header badge, floating bar, drawer list, delivery progress bar, and summary breakdown table. |
| `openCartDrawer(step)` | Opens slide-over drawer to `'items'` or `'checkout'` step. |
| `startLiveOrderTracker(order)` | Initializes SVG courier animation, 20-min countdown timer, and status timeline. |
| `openDishModal(id)` | Populates and presents the Dish Detail Modal for a specific dish. |
| `setupPromoCopy(...)` | Copies `CRAVE20` to the clipboard with toast feedback. |

---

## 6. Suggested Next Steps for Future Sessions
1. **Real-time Backend & WebSocket Dispatch:** Hook up order creation and driver GPS coordinates to a live backend (e.g. Node.js WebSocket or Supabase Realtime).
2. **Persistent LocalStorage:** Persist cart items, saved favorites, and active order tracking state across browser reloads.
3. **Sound Effects & Audio Haptics:** Add subtle culinary chime audio effects for "Order Placed", "Pod Sealed", and "Courier Arrived".
4. **Kitchen Partner Portal:** Create a `/kitchen` chef dashboard view for independent kitchen operators to accept and stamp outgoing tickets.
