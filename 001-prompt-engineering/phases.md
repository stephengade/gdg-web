# Implementation Roadmap & Development Phases
# Project: Cravely — Chef-Crafted Gourmet Food Delivery

**Document Version:** 2.0.0  
**Current Phase:** Phase 2 Complete & Verified / Moving into Phase 3  
**Architecture:** Modern Vanilla Web Stack (HTML5, Modular CSS Tokens, ES6+ JS) $\rightarrow$ Full-Stack Realtime PWA  

---

## Roadmap Overview at a Glance

| Phase | Title | Focus Area | Status |
| :---: | :--- | :--- | :---: |
| **Phase 1** | **Foundation & Editorial Showcase** | Semantic design system, 3-panel showcase, recipe ledger | **Completed** |
| **Phase 2** | **Interactive App & Live Tracking** | Cart drawer, checkout, live SVG map tracking, about page | **Completed** |
| **Phase 3** | **Persistence, PWA & Sound Design** | LocalStorage, service workers, installability, audio haptics | **Next Up** |
| **Phase 4** | **Backend Architecture & WebSockets** | Node/Supabase API, Postgres schema, SMS OTP, Stripe | **Planned** |
| **Phase 5** | **Kitchen & Courier Portals** | Tablet KDS for chefs, mobile dispatch PWA for couriers | **Planned** |
| **Phase 6** | **Multi-Hub Scaling & Tasting Guild** | Multi-zone SF expansion, subscription loyalty, ML dispatch | **Future** |

---

## Phase 1: Foundation & Editorial Showcase (Completed)

### Objectives
Establish the core culinary editorial aesthetic, implement high-conversion landing page sections, and create a lightweight, responsive foundation.

### Deliverables
* [x] **Editorial Design System:**
  * Defined CSS root tokens for palette (`--bg-canvas: #FAF7F2`, `--forest-green: #0E4334`, `--golden-yellow: #F5BE38`, `--terracotta: #D9532F`).
  * Typography pairing: `DM Serif Display` for headings and `Plus Jakarta Sans` for body/UI.
  * Tactile elevation shadows, organic radii (`--radius-card: 28px`), and circular touch buttons.
* [x] **3-Panel Editorial Hero Showcase:**
  * Panel 1: Deep Forest Green card with food doodle sketch, floating Wagyu Smash Burger, and quick-order CTA.
  * Panel 2: Live kitchen streaming photo with active delivery badge (`18-22 min delivery`).
  * Panel 3: Sunflower Yellow card with line-art pizza doodles and floating Neapolitan Margherita.
  * Street address input bar with GPS geolocate button and social proof metrics bar.
* [x] **Curated Menu Highlights (Recipe Ledger):**
  * Dotted line-leader typography linking dish titles to prices (`Dish Name ──────── $Price`).
  * Category filter tabs (`All Dishes`, `Artisan Burgers`, `Wood-Fired Pizza`, `Healthy Bowls`, `Sushi & Asian`, `Desserts`) with zero-refresh filtering.
  * Dish thumbnails with interactive wishlist heart toggles and transparent pantry ingredient listings.
* [x] **Supporting Landing Sections:**
  * How It Works 3-step numbered cards detailing independent prep, direct routing, and thermal pods.
  * Customer testimonials grid featuring verified diner quotes, dishes ordered, and press badges (*TechCrunch, Eater SF, Bloomberg*).
  * 20% off order CTA banner, interactive accessible FAQ accordion, and 4-column footer.

### Acceptance Criteria Verification
* 100% responsive across desktop, tablet, and mobile devices.
* Lighthouse Performance score $\ge 95$.
* Zero external script dependencies.

---

## Phase 2: Interactive App Features, Live Tracking & About Page (Completed)

### Objectives
Transform the landing page into a fully functional interactive web application featuring itemized cart management, mock checkout, real-time live order dispatch tracking, rich dish inspection, and an editorial About page.

### Deliverables
* [x] **Slide-Over Cart Drawer (`#cartDrawer`):**
  * Slide-over container with dark blurred backdrop overlay.
  * Grouped cart items with thumbnail, title, price, notes, steppers (`-`, qty, `+`), and delete buttons.
  * Dynamic Free Delivery Progress Bar calculating distance to `$25.00` threshold.
  * Promo Code engine supporting `CRAVE20` with 20% discount deduction and toast feedback.
  * Courier & Kitchen tip selector (`$2.00`, `$3.00`, `$5.00`, `None`) and transparent ledger summary table.
* [x] **Checkout & Mock Payment Flow:**
  * Form for delivery coordinates (pre-filled with selected zone), buzzer instructions, and phone number.
  * Active induction pod `#14` reservation assurance card (155°F locked heat).
  * Payment method tabs (Credit Card with mock card fields and Apple Pay).
  * Animated order placement button with loading spinner state transitioning directly into tracking.
* [x] **Live Order Tracker & Map Simulation:**
  * Real-time second-by-second countdown timer starting at `19:50`.
  * Animated SVG vector map of San Francisco (Market St, Mission St, SoMa, Embarcadero) featuring a glowing dashed route.
  * Animated courier scooter icon (`🛵`) moving smoothly along the route from kitchen to customer doorstep.
  * 4-stage culinary timeline (*Order Received* $\rightarrow$ *Chef Crafting* $\rightarrow$ *Pod Induction Sealed* $\rightarrow$ *Doorstep Drop*).
  * Courier profile card for Marco Rossi with working "Call" and "Message" interactive triggers.
  * Minimized floating tracking pill (`#minimizedTrackingBar`) allowing background tracking while browsing.
* [x] **Dish Detail Editorial Inspection Modal:**
  * Click-to-inspect on any menu ledger card.
  * Rich culinary backstory, indie kitchen origin, and chef attribution.
  * Macro nutritional stats (Calories, Protein, Carbs, Fats) and dietary tags (*Gluten-Free, Vegetarian, Organic*).
  * Special kitchen requests input and quantity stepper with dynamic CTA button.
* [x] **Dedicated About & Manifesto Page (`about.html`):**
  * The Cravely Manifesto explaining the failure of corporate aggregators and our artisanal mission.
  * 4 Impact Metrics bar (85%+ chef retention, 19.4-min average drop, 155°F pod lock, 42 SF kitchen partners).
  * The 24th Street origin story of Chef Mateo Cruz and urban logistics engineer Liam Chen.
  * The Four Non-Negotiable Pillars and Resident Chef Guild spotlight (Vance, Rossi, Tanaka, Laurent).
  * 20-minute route technology sequence and dual conversion CTAs for diners and indie restaurateurs.
* [x] **Unified State & Navigation:**
  * Full synchronization of cart drawer, location selector, and toast notifications across both `index.html` and `about.html`.

### Acceptance Criteria Verification
* Cart subtotal, discounts, tips, and totals calculate with mathematical precision.
* Live map animation runs smoothly at 60 FPS without layout thrashing.
* Keyboard accessibility (`Escape` key closes all modals/drawers).

---

## Phase 3: Client Persistence, PWA & Sound Design (Next Up)

### Objectives
Add persistence across page reloads, enable offline installation via Progressive Web App (PWA) standards, and introduce subtle culinary audio feedback.

### Key Deliverables
1. **LocalStorage State Hydration:**
   * Automatically persist `state.cart`, `state.savedDishes`, and `state.activeOrder` to browser `localStorage`.
   * Restore cart quantities and active delivery tracking seamlessly upon page refresh or return visits.
2. **Progressive Web App (PWA) Manifest & Service Worker:**
   * Create `manifest.json` with app icons (192px, 512px, maskable), brand colors (`#0E4334`), and standalone display mode.
   * Register lightweight service worker (`sw.js`) for caching static assets (`index.html`, `about.html`, `style.css`, `app.js`, typography).
   * Prompt user with an editorial "Install Cravely App" floating pill for one-tap mobile home screen installation.
3. **Culinary Sound Design & Audio Haptics:**
   * Synthesize or include subtle, high-taste audio cues using the Web Audio API:
     * *Plating Click:* Gentle wooden chime when a dish is added to the tray.
     * *Pod Lock:* Deep resonant hum when an order is placed and the thermal pod is sealed.
     * *Doorbell Chime:* Welcoming doorbell tone when the live courier countdown reaches `00:00`.
   * Add a discreet global mute toggle in the footer/header.
4. **Enhanced Dietary Filters:**
   * Multi-select filter pills on the menu ledger: *Vegetarian*, *Vegan*, *Gluten-Free*, *Dairy-Free*, *High-Protein*.

---

## Phase 4: Backend API, Realtime WebSockets & Database Architecture (Planned)

### Objectives
Transition from client-side simulation to a secure, production-grade cloud backend supporting live order creation, database persistence, realtime driver GPS streaming, and Stripe payment processing.

### Technical Stack & Architecture
* **Server Runtime:** Node.js / TypeScript with Fastify or Supabase Edge Functions.
* **Database:** PostgreSQL (hosted via Supabase or Railway) with PostGIS extension for geo-spatial distance queries.
* **Realtime Protocol:** WebSockets (Socket.io or Supabase Realtime) for sub-second driver GPS coordinate broadcasting.
* **Authentication:** Passwordless SMS OTP verification (Twilio Verify) for rapid, frictionless mobile checkout.
* **Payment Gateway:** Stripe Payment Intents API & Apple Pay Web SDK.

### Database Entity Relationship Schema (PostgreSQL)

```sql
-- Kitchen Supply Partners
CREATE TABLE kitchens (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(120) NOT NULL,
  slug VARCHAR(120) UNIQUE NOT NULL,
  neighborhood VARCHAR(80) NOT NULL,
  chef_name VARCHAR(120) NOT NULL,
  street_address TEXT NOT NULL,
  location GEOGRAPHY(POINT, 4326) NOT NULL,
  commission_rate NUMERIC(4,2) DEFAULT 0.15,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Dishes Catalog
CREATE TABLE dishes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  kitchen_id UUID REFERENCES kitchens(id) ON DELETE CASCADE,
  name VARCHAR(140) NOT NULL,
  headline TEXT,
  story TEXT,
  pantry_ingredients TEXT,
  price NUMERIC(6,2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  calories INT,
  protein_g INT,
  carbs_g INT,
  fat_g INT,
  dietary_tags TEXT[],
  image_url TEXT NOT NULL,
  is_sold_out BOOLEAN DEFAULT FALSE
);

-- Courier Guild
CREATE TABLE couriers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  phone VARCHAR(20) NOT NULL,
  vehicle_type VARCHAR(50) DEFAULT 'Electric Cargo Bike',
  rating NUMERIC(3,2) DEFAULT 4.98,
  total_deliveries INT DEFAULT 0,
  active_pod_id VARCHAR(30),
  current_location GEOGRAPHY(POINT, 4326),
  is_online BOOLEAN DEFAULT FALSE
);

-- Customer Orders
CREATE TABLE orders (
  id VARCHAR(20) PRIMARY KEY, -- e.g. #CRV-8942
  user_phone VARCHAR(20) NOT NULL,
  kitchen_id UUID REFERENCES kitchens(id),
  courier_id UUID REFERENCES couriers(id),
  items JSONB NOT NULL,
  subtotal NUMERIC(7,2) NOT NULL,
  discount_amount NUMERIC(7,2) DEFAULT 0.00,
  delivery_fee NUMERIC(5,2) DEFAULT 2.50,
  tip_amount NUMERIC(5,2) DEFAULT 3.00,
  total_charged NUMERIC(7,2) NOT NULL,
  status VARCHAR(30) DEFAULT 'received', -- received, cooking, sealed, en_route, delivered
  delivery_address TEXT NOT NULL,
  dropoff_location GEOGRAPHY(POINT, 4326),
  pod_temperature_f INT DEFAULT 155,
  estimated_delivery_at TIMESTAMPTZ,
  delivered_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW()
);
```

---

## Phase 5: Kitchen Partner Portal (`/kitchen`) & Courier App (`/courier`) (Planned)

### Objectives
Build dedicated, high-efficiency operational interfaces for the two supply-side user groups: the chefs preparing the food and the couriers transporting it.

### Deliverables
* **Kitchen Partner Display System (`/kitchen`):**
  * Tablet-optimized, grease-resistant high-contrast interface designed for busy restaurant pass stations.
  * Audio chime and visual ticket animation when a new Cravely order fires.
  * One-tap actions:
    * `Accept Ticket` (auto-calculates prep time based on current kitchen load).
    * `Seal in Induction Dock` (triggers courier dispatch alert when 3 minutes out).
    * `86 Dish` (instantly marks dish as sold out on the public menu).
  * Daily revenue and earnings summary proving the 85%+ retention payout.
* **Courier Guild Mobile Interface (`/courier`):**
  * Lightweight mobile PWA tailored for handlebar-mounted smartphones on electric cargo bikes.
  * High-visibility dark mode interface with large touch buttons operable with cycling gloves.
  * Turn-by-turn routing prioritized for San Francisco dedicated bike lanes.
  * Bluetooth / IoT integration with thermal pod temperature sensors: alerts courier if pod temperature drops below 150°F.
  * One-tap contactless doorstep drop: camera integration for photo proof of delivery.

---

## Phase 6: Multi-Hub Scaling, Loyalty Guild & Algorithmic Dispatch (Future)

### Objectives
Scale Cravely from the initial San Francisco Downtown/Mission micro-hub to a multi-hub network covering the entire SF Bay Area and launch the customer subscription program.

### Deliverables
* **Multi-Hub Geofencing Expansion:**
  * Launch micro-hubs in Oakland (Rockridge/Grand Lake), Berkeley (Gourmet Ghetto), and San Jose (Downtown).
  * Automatic geolocation routing matching diners to their specific neighborhood micro-hub.
* **The "Cravely Tasting Guild" Membership:**
  * `$9.99/month` or `$99/year` subscription tier.
  * Benefits:
    * Unlimited $0 delivery on all orders over $15.
    * Secret Friday Chef Tasting Drops: Exclusive experimental off-menu dishes limited to 50 portions per hub.
    * Priority 15-minute dispatch window during peak dinner hours.
* **Predictive Courier Prepositioning & ML Dispatch:**
  * Machine learning model forecasting dish prep velocity by day of week, weather, and neighborhood events.
  * Prepositioning electric cargo couriers near high-volume kitchens *before* orders are fired, shaving an additional 3–4 minutes off total delivery time while preserving the strict single-flight delivery guarantee.
