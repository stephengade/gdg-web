# Design System & UI/UX Specifications
# Project: Cravely — Artisanal Food Delivery Platform

**Document Version:** 2.0.0  
**Design Lead:** Cravely Design Systems Group  
**Aesthetic Style:** Artisanal Culinary Magazine & Cookbook Publishing  

---

## 1. Design Philosophy & Aesthetic Principles

Cravely rejects the sterile, homogenized plastic aesthetic of mass-market delivery apps. Instead, the visual language draws inspiration from vintage gastronomic literature, high-end food journals (*Bon Appétit, Kinfolk, Food & Wine*), and neighborhood chalkboard menus:

1. **Warm Parchment Surfaces:** A warm, tactile canvas palette (`#FAF7F2`) reminiscent of heavy bond cookbook paper, avoiding harsh sterile `#FFFFFF` glare.
2. **Organic, Generous Geometry:** Soft, rounded silhouettes (`--radius-card: 28px`) reflecting natural culinary ingredients rather than rigid industrial tech boxes.
3. **Editorial Typography Pairing:** The timeless elegance of high-contrast display serif typography paired with crisp, clean geometric sans-serif for functional UI controls.
4. **Tactile Line-Leader Ledgers:** Traditional dotted menu leaders connecting dish names to prices (`Dish Name ──────── $Price`), celebrating culinary transparency.
5. **Humanized Micro-Interactions:** Subtle floating shadows, ambient food doodle sketches, animated pulses for thermal pods, and glowing route vectors.

---

## 2. Brand Identity & Logo Anatomy

```
  Cravely.
  └──┬───┘└──┬┘
     │       └── Signature Terracotta Dot (#D9532F)
     └────────── DM Serif Display 400 (Deep Forest Green #0E4334 or White #FFFFFF)
```

* **Wordmark:** Set in `DM Serif Display`, title-cased, terminated with a distinct warm terracotta circular period (`.`). The period symbolizes completion, culinary precision, and the final doorstep drop.
* **Tone of Voice:** Sophisticated yet approachable; passionate about ingredients; uncompromising on delivery speed and food integrity.

---

## 3. Design Tokens & CSS Variables

All design tokens are formalized in `style.css` under the root scope:

```css
:root {
  /* Canvas & Surfaces */
  --bg-canvas: #FAF7F2;          /* Warm parchment / cream base */
  --bg-surface: #FFFFFF;         /* Card surfaces & modal backgrounds */
  --bg-cream: #F3EFE6;           /* Subtle neutral accent / macro bars */
  --bg-subtle: #F6F3EB;          /* Dividers and line leaders */

  /* Signature Brand Palette */
  --forest-green: #0E4334;       /* Primary brand anchor, buttons, hero left */
  --forest-green-dark: #092F24;  /* Deep header text, dark cards */
  --forest-green-light: #165643; /* Hover states */
  --forest-green-soft: #E9F1EE;  /* Tag backgrounds, notification badges */

  --golden-yellow: #F5BE38;      /* Hero right panel, special tags, ratings */
  --golden-yellow-dark: #E0A61D; /* Hover & borders */
  --golden-yellow-soft: #FDF6E2; /* Free delivery meter, quote blocks */

  --terracotta: #D9532F;         /* Action buttons, pins, wishlist active */
  --terracotta-hover: #BF411F;   /* Primary button hover */
  --terracotta-soft: #FAEBE7;    /* Subtle terracotta tint */

  /* Typographic Contrast */
  --text-primary: #19211C;       /* Espresso forest black (high contrast) */
  --text-secondary: #58635B;     /* Muted body text */
  --text-muted: #88938B;         /* Secondary metadata, line leaders */
  --text-white: #FFFFFF;

  /* Borders & Dividers */
  --border-light: #E8E2D6;       /* Standard card & input borders */
  --border-subtle: #F1ECE2;      /* Soft separators */

  /* Tactile Shadows */
  --shadow-sm: 0 2px 8px rgba(24, 32, 27, 0.04);
  --shadow-md: 0 8px 24px -4px rgba(24, 32, 27, 0.08);
  --shadow-lg: 0 16px 36px -6px rgba(24, 32, 27, 0.12);
  --shadow-green: 0 10px 24px rgba(14, 67, 52, 0.22);
  --shadow-yellow: 0 10px 24px rgba(245, 190, 56, 0.28);
  --shadow-terracotta: 0 10px 24px rgba(217, 83, 47, 0.25);

  /* Geometry & Radii */
  --radius-sm: 8px;
  --radius-md: 16px;
  --radius-card: 28px;
  --radius-pill: 9999px;

  /* Typography */
  --font-serif: 'DM Serif Display', Georgia, serif;
  --font-sans: 'Plus Jakarta Sans', system-ui, -apple-system, sans-serif;
}
```

---

## 4. Typography Hierarchy & Scale

| Style / Element | Font Family | Size | Weight | Line Height | Usage |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Display 1 (Hero Title)** | `DM Serif Display` | 3.2rem – 3.8rem | 400 | 1.15 | Main hero headlines, manifesto header |
| **Heading 1 (Section Titles)**| `DM Serif Display` | 2.4rem – 2.8rem | 400 | 1.20 | Section headers (`Today’s Top Kitchens`) |
| **Heading 2 (Card Titles)** | `DM Serif Display` | 1.35rem – 1.6rem | 400 | 1.25 | Dish titles, modal headers, pillar titles |
| **Price Badges** | `DM Serif Display` | 1.4rem – 1.8rem | 400 | 1.00 | Food ledger prices, checkout totals |
| **UI Primary / Buttons** | `Plus Jakarta Sans` | 0.95rem – 1.0rem | 700 / 800 | 1.20 | CTA buttons, filter tabs, checkout triggers |
| **Body Text** | `Plus Jakarta Sans` | 0.92rem – 1.0rem | 400 / 500 | 1.65 | Descriptions, chef stories, pantry notes |
| **Micro Copy & Badges** | `Plus Jakarta Sans` | 0.72rem – 0.82rem| 700 / 800 | 1.30 | Dietary tags, ETA badges, macro labels |

---

## 5. UI Component Specifications

### 5.1 Sticky Blur Header & Navigation Bar
* **Glassmorphism Backdrop:** `backdrop-filter: blur(12px)` with dynamic elevation shadow on scroll (`.site-header.scrolled`).
* **Delivery Zone Pill (`#locationSelector`):**
  * Icon: Terracotta map pin SVG.
  * Label: Selected SF neighborhood (`Downtown, SF`, `Mission District`, `SoMa`, etc.).
  * Micro-Interaction: Smooth neighborhood rotation with toast confirmation on click.
* **Shopping Cart Trigger Button (`#headerCartBtn`):**
  * Circular pill containing bag icon and dynamic counter (`#cartCounter`).
  * CSS Bump Animation: Scale keyframe (`scale(1.25)` → `scale(1.0)`) whenever an item is added.

### 5.2 The 3-Panel Editorial Hero Showcase
* **Layout:** Asymmetric 3-column grid (`1.15fr 0.9fr 1.15fr`).
* **Panel 1 (Left - Forest Green `#0E4334`):**
  * Hand-drawn organic sketch doodles in background with subtle opacity (`0.06`).
  * Floating cutout Wagyu Smash Burger with ambient multi-layer drop shadow (`float-subtle` animation).
  * White pill CTA (`Order Burger`) paired with terracotta circular icon button (`+`).
* **Panel 2 (Center - Chef Kitchen Craft):**
  * Vertical culinary photography showcasing chef plating dishes on-demand.
  * Live status pill: Glowing green dot + `18-22 min delivery` guarantee.
* **Panel 3 (Right - Sunflower Yellow `#F5BE38`):**
  * Line-art pizza sketch doodle backdrop.
  * Floating cutout Neapolitan Pizza (`float-subtle-alt` animation).
  * Dark circular icon button for instant dish dispatch.
* **Street Address Finder Bar:**
  * Embedded pill input with terracotta map pin, street address input, GPS geolocate button (with spin animation), and primary "Find Kitchens" CTA.

### 5.3 Curated Menu Highlights (Recipe Ledger)
* **Pill Category Bar:** Horizontal scrollable/flex container with active indicator pills (`active` state uses Forest Green fill with white text).
* **Ledger Card Anatomy:**
  * **Header:** Dish title in serif, followed by a responsive dotted line leader (`.ledger-line-leader`), ending with the price.
  * **Cutout Thumbnail:** 90px × 90px square thumbnail with `16px` border radius and an interactive wishlist heart toggle button (`.btn-wishlist`).
  * **Headline & Pantry:** Italicized culinary summary + bold **Pantry:** ingredient provenance notes.
  * **Footer:** "Add to Tray" button with visual feedback (`✓ Added`), star rating badge, and review counter (`💬`).
  * **Card Hover:** Subtle elevation lift (`translateY(-4px)`) and pointer cursor indicating click-to-open inspection modal.

### 5.4 Slide-Over Cart Drawer (`#cartDrawer`)
* **Overlay:** 65% opacity dark backdrop with `8px` gaussian blur (`#cartDrawerOverlay`).
* **Width:** Fixed 480px on desktop; 100% full-screen on mobile viewports.
* **Header:** Tray title, item counter badge, and circular close button (`&times;`).
* **Free Delivery Meter:** Dynamic gold-to-green gradient progress track calculating distance to `$25.00` free express delivery.
* **Item Card:** Dish image thumbnail, title, price, custom notes, stepper (`-`, qty, `+`), line total, and trash delete button.
* **Promo Code Module:** Input field + Apply button, one-click `CRAVE20` suggestion chip, and removable applied discount pill.
* **Tip Selector:** 4-column grid of pill buttons (`$2.00`, `$3.00` active, `$5.00`, `None`).
* **Summary Table:** High-contrast breakdown lines for Subtotal, Promo Discount (red/terracotta), Delivery Fee (green for free), Tip, and Grand Total.

### 5.5 Checkout & Payment Step
* **Form Inputs:** Rounded pill fields with inset icons (map pin, buzzer, phone).
* **Thermal Pod Assurance Box:** Soft forest green callout with pulsating green dot confirming reservation of induction pod `#14` (locked at 155°F).
* **Payment Selector:** Interactive radio card tabs for Credit Card and Apple Pay.
* **Mock Card Container:** 16-digit card number field with Mastercard/Visa SVG logo, MM/YY expiry, and CVC.
* **Action Button:** Full-width Terracotta CTA with inline CSS spinner (`.spinner-inline`) for payment processing state.

### 5.6 Dish Detail Editorial Inspection Modal
* **Geometry:** Floating centered modal (`max-width: 860px`, `border-radius: 28px`), two-column magazine spread.
* **Left Media Column:** Large high-res dish photography, category tag, star rating, and "Crafted by Indie Kitchen" attribution card with chef avatar.
* **Right Editorial Column:**
  * Serif dish title and price.
  * Tasting profile story & culinary technique description.
  * Dietary tags pill group (*Gluten-Free, Vegetarian, Organic, etc.*).
  * Macro Nutritional Row: 4-cell table for Calories, Protein, Carbs, and Fats.
  * Pantry Ingredients callout box with golden accent border.
  * Special kitchen request input.
  * Stepper + Primary "Add to Tray • $Total" button.

### 5.7 Live Order Tracker & Route Map Simulation
* **Header:** Status badge with pulsating live green dot, Order ID (e.g. `#CRV-8942`), and 20-Min Promise pill.
* **ETA Banner:** Large serif countdown timer (`19:48`) and thermal pod temperature pill (`154°F Locked`).
* **SVG Vector Map:**
  * Clean vector aesthetic featuring the San Francisco bay shoreline, Market St and Mission St grid thoroughfares, 4th St, and Yerba Buena Gardens.
  * Gradient glowing route line with animated dash keyframe (`routeDash`).
  * Origin Kitchen marker with pulsing radar animation.
  * Destination Doorstep marker with red target ping.
  * Animated Scooter Courier marker (`🛵`) interpolating across coordinate segments.
  * Floating status badge: *"Courier Marco is 1.1 miles away • Moving northeast"*.
* **4-Step Timeline:** Step markers transitioning from numbers to checkmarks (`✓`) and active spinners (`.step-spinner`).
* **Courier Card:** Avatar badge (`MR`), name, vehicle description, and working interactive *"Call"* and *"Message"* triggers.
* **Minimized Pill (`#minimizedTrackingBar`):** Floating pill in the bottom-left corner with live dot pulse, order status, and "View Map" trigger.

---

## 6. Keyframe Animations & Micro-Interactions

```css
/* Animated Dash on Vector Route */
@keyframes routeDash {
  to { stroke-dashoffset: -18; }
}

/* Pulsing Wave on Map Markers */
@keyframes pulseScale {
  0% { transform: scale(0.9); opacity: 0.4; }
  50% { transform: scale(1.35); opacity: 0.1; }
  100% { transform: scale(0.9); opacity: 0.4; }
}

/* Live Dispatch Glow Dot */
@keyframes liveDotGlow {
  0% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0.8); }
  70% { transform: scale(1); box-shadow: 0 0 0 7px rgba(46, 204, 113, 0); }
  100% { transform: scale(0.9); box-shadow: 0 0 0 0 rgba(46, 204, 113, 0); }
}

/* Thermal Pod Induction Glow */
@keyframes thermalPulse {
  0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(39, 174, 96, 0.7); }
  70% { transform: scale(1); box-shadow: 0 0 0 6px rgba(39, 174, 96, 0); }
  100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(39, 174, 96, 0); }
}

/* Cart Counter Bump */
@keyframes cartBump {
  0% { transform: scale(1); }
  30% { transform: scale(1.3); }
  60% { transform: scale(0.95); }
  100% { transform: scale(1); }
}
```

---

## 7. Responsive Breakpoint Guidelines

### Desktop (> 1200px)
* Max container width: `1200px`.
* Hero showcase: Full 3-panel side-by-side layout.
* Menu ledger: 2-column card grid.
* Dish detail modal: Side-by-side 360px media + editorial layout.

### Tablet (768px – 1199px)
* Hero showcase: Stacked or condensed 2-panel view.
* Menu ledger: 1-column full-width cards.
* Chef guild grid: 2-column layout.
* Cart drawer: Width capped at `440px`.

### Mobile Handheld (< 768px)
* Announcement bar: Hidden to preserve vertical fold space.
* Desktop navigation: Hidden; replaced by full-height sliding mobile drawer (`.mobile-drawer`).
* Search bar: Stacks address input and geolocate button vertically.
* Dish detail modal: Stacks media column on top of editorial content.
* Floating Order Bar: Stretches full-width across bottom with 16px margins.
* Minimized Tracking Pill: Anchors to bottom with mobile-optimized tap target.

