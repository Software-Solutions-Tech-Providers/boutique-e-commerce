# Kora & Loom — Master Design System & Architectural Reference

> **Snapshot Date:** November 2026  
> **Purpose:** Preserve all design tokens, brand colors, typography, layout rules, component anatomy, conversion psychology patterns, and reference architectures before major UI/layout overhauls.

---

## 1. Brand & Aesthetic Identity

- **Brand Name:** Kora & Loom
- **Domain / Tagline:** Handloom Sarees & Artisanal Boutique
- **Positioning:** Weaver-direct Indian handloom boutique engineered for elegance, transparency, and high-conversion e-commerce (Kanchipuram, Banarasi, Maheshwari, Chanderi, tailored blouses, temple jewellery).
- **Aesthetic Direction:** Warm artisanal luxury, editorial poise, clean whitespace, earthy parchment surfaces, deep forest green accents, refined classic typography.

---

## 2. Color Palette & Design Tokens

The application strictly adheres to a 10-color calibrated palette defined in `src/index.css` via Tailwind v4 `@theme` and inline classes.

### Primary Tokens (Tailwind v4 `@theme`)

| Token Name | Hex Code | RGB | CSS Variable | Semantic Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Canvas** | `#FAF9F6` | `rgb(250, 249, 246)` | `--color-canvas` | Main page background, warm off-white / parchment base |
| **Surface** | `#FFFFFF` | `rgb(255, 255, 255)` | `--color-surface` | Card surfaces, modal containers, dropdowns, inputs |
| **Linen** | `#F2EFE9` | `rgb(242, 239, 233)` | `--color-linen` | Secondary background, image placeholders, table headers, hover pill backgrounds |
| **Ink** | `#1C1917` | `rgb(28, 25, 23)` | `--color-ink` | Primary typography, headlines, active icons, dark buttons |
| **Muted** | `#57534E` | `rgb(87, 83, 78)` | `--color-muted` | Secondary body text, subcopy, breadcrumbs, unselected states |
| **Border** | `#E5E0D8` | `rgb(229, 224, 216)` | `--color-border` | Subtle dividing lines, container borders, input strokes |
| **Accent** | `#14532D` | `rgb(20, 83, 45)` | `--color-accent` | Primary brand CTA, green badge accents, free shipping bar, success indicators |
| **Accent Hover** | `#0F3F22` | `rgb(15, 63, 34)` | `--color-accent-hover` | Hover state for primary buttons and interactive accents |
| **Ochre** | `#B45309` | `rgb(180, 83, 9)` | `--color-ochre` | Festive highlights (Diwali), secondary tags, rating star tones, warning alerts |

### Auxiliary Tokens (Component Specific)

| Color Name | Hex Code | Usage |
| :--- | :--- | :--- |
| **Crimson / Ruby** | `#991B1B` | Active wishlist heart (`fill-[#991B1B] text-[#991B1B]`), validation error text |
| **Overlay Black** | `black/45` / `black/50` / `black/70` | Modal backdrops, cart drawer scrim, video preview backdrop |
| **Selection Highlight**| `#14532D`/15 | `selection:bg-[#14532D]/15 selection:text-[#14532D]` (configured in `index.html`) |

---

## 3. Typography Hierarchy & Font System

Configured via Google Fonts in `index.html` and mapped in `src/index.css`:

```html
<link href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:wght@500;600;700&family=Plus+Jakarta+Sans:wght@400;600&display=swap" rel="stylesheet" />
```

### Font Families

1. **Display / Serif:**
   - **Font:** `Cormorant Garamond`, Georgia, serif
   - **Tailwind Class:** `font-display`
   - **Base CSS Mapping:** `h1, h2, h3, .font-display { font-family: var(--font-display); }`
   - **Weights Loaded:** 500 (Medium), 600 (Semi-bold), 700 (Bold)
   - **Application:** Brand logo, page titles, section headlines, product card titles, modal titles.

2. **Body / Interface Sans:**
   - **Font:** `Plus Jakarta Sans`, -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif
   - **Tailwind Class:** `font-sans` (Default on `html`)
   - **Weights Loaded:** 400 (Regular), 600 (Semi-bold)
   - **Application:** Navigation, body paragraphs, buttons, forms, specs, prices, pills.

3. **Numeric Typography:**
   - **Class:** `tabular-nums` (`font-variant-numeric: tabular-nums`)
   - **Application:** Prices (₹), discount percentages, ratings, order numbers, timer/step counts.

### Typography Scale & Hierarchy Reference

| Level | Size Class | Weight | Font Family | Example Usage |
| :--- | :--- | :--- | :--- | :--- |
| **Display Hero** | `text-4xl sm:text-5xl` | `font-semibold` (600) | `font-display` | Homepage Hero banner headline |
| **Section Heading (H1/H2)** | `text-3xl sm:text-4xl` | `font-semibold` (600) | `font-display` | "Shop by Collection", PDP Title, Checkout Title |
| **Card / Modal Heading** | `text-xl sm:text-2xl` | `font-semibold` (600) | `font-display` | Collection titles, Drawer heading, Size guide |
| **Product Card Title** | `text-lg` | `font-semibold` (600) | `font-display` | Saree name on cards (`line-clamp-2`) |
| **Eyebrow / Subhead** | `text-xs` | `font-semibold` (600) | `font-sans` | `uppercase tracking-widest text-[#14532D]` |
| **Body Primary** | `text-sm sm:text-base` | `font-normal` (400) | `font-sans` | Editorial descriptions, paragraphs, policy text |
| **Body Secondary** | `text-xs sm:text-sm` | `font-normal` (400) | `font-sans` | Metadata, breadcrumbs, helper subcopy (`text-[#57534E]`) |
| **Micro Labels** | `text-[10px] / text-[11px]` | `font-semibold` (600) | `font-sans` | Badges, image slot tags, counter badges |

---

## 4. Spacing, Radii, Shadows & Animation Metrics

### Radii Hierarchy

- `rounded` (4px): Small icon buttons, inline badges
- `rounded-md` (6px): Primary buttons, input fields, navigation pills, search box
- `rounded-lg` (8px): Product cards, accordions, policy cards, form containers
- `rounded-xl` (12px): Hero container, campaign banner containers, large feature modules
- `rounded-full` (9999px): Wishlist floating round buttons, progress bars, status dots

### Elevation (Shadows)

- `shadow-sm`: Wishlist floating action button
- `shadow-md`: Search dropdown bar, product card hover state
- `shadow-lg`: Sticky bottom bar, browse abandonment strip, toasts
- `shadow-2xl`: Cart slide-over drawer, modal overlays

### Motion & Transitions

- **Custom Curve:** `.ease-settle` -> `cubic-bezier(0.16, 1, 0.3, 1)`
- **Hover Micro-interaction:** `transition-all duration-200 ease-settle hover:-translate-y-0.5 hover:shadow-md`
- **Image Hover Swap:** `transition-opacity duration-300 group-hover:opacity-0` and `group-hover:opacity-100`
- **Reduced Motion Support:** Configured in `src/index.css` under `@media (prefers-reduced-motion: reduce)`

---

## 5. Layout Containers & Grid System

- **Site Container:** `mx-auto max-w-7xl px-4 sm:px-6`
- **Focus Pages (Checkout / Support):** `max-w-6xl`
- **Consultation / Quiz:** `max-w-5xl`
- **Search & Cart Drawer:** `max-w-4xl` (Search container) / `max-w-md` (Cart slide-over)
- **Product Card Aspect Ratios:**
  - Saree Catalog Card: `aspect-[3/4]` (portrait drape presentation)
  - Collection Entry Card: `aspect-[4/3]` (horizontal editorial banner)
  - Video Preview Modal: `aspect-video` (16:9)

---

## 6. Core Component Blueprints

### Header (`src/components/layout/Header.tsx`)
- Top Announcement Bar: `bg-[#14532D] text-white text-xs h-9` with dismiss action and Diwali edit link.
- Main Nav: `h-16 bg-[#FAF9F6]/95 backdrop-blur-sm border-b border-[#E5E0D8]`
- Brand Logo: Cormorant Garamond 24px bold tracking-tight.
- Nav Items: Collections, Diwali Edit, Saree Finder, Offers, Support.
- Action Cluster: Search toggle, Wishlist (with numeric badge), Orders/Account, Bag button (`bg-[#14532D]`).

### Product Card (`src/components/common/ProductCard.tsx`)
- Container: `bg-white border border-[#E5E0D8] rounded-lg overflow-hidden`
- Dual Image Swap on Hover (Front drape -> Secondary pleats/zari view)
- Top-Right Floating Wishlist Pill: Round `bg-white/90 shadow-sm`
- Tag Pill: Bottom-left `bg-white/95 px-2.5 py-1 text-[11px] font-semibold`
- Meta Row: Weave + Star Rating + SKU
- Price Block: Current price in bold, struck-through MRP, green savings percentage (`% off`)
- Quick Add Button: `bg-[#14532D]` with ShoppingBag icon

### Product Detail Page (`src/pages/ProductDetailPage.tsx`)
- Adheres to the top-to-bottom conversion architecture from `E-commerce_Strategies__1__88bc0fba.pdf`:
  1. Title, Price, One-line benefit, Star ratings **above the fold**.
  2. 4-Slot Purposeful Gallery:
     - Slot 1: Product Showcase
     - Slot 2: Draped in Use
     - Slot 3: Scale & Pleats
     - Slot 4: Weave Detail (with 18s/22s video preview)
  3. Buy Box Zone: Immediate delivery pin-code estimate, 7-day returns, payment options.
  4. Discount Ladder module ("Buy More – Save More").
  5. Reviews immediately beneath the purchase section.
  6. Sticky bottom bar when scrolling away from buy button.

### Cart Drawer (`src/components/cart/CartDrawer.tsx`)
- Slide-over sheet (`fixed inset-0 z-50 flex justify-end`).
- Free Express Shipping Bar: Progress meter to ₹2,500 threshold (`bg-[#14532D]`).
- Promo Code Input with instant feedback (`DIWALI10` for 10% off).
- WhatsApp Cart Recovery phone capture.
- Cross-sell recommendations (Accessories, Blouses, Care kit).

### Checkout Page (`src/pages/CheckoutPage.tsx`)
- Guest checkout by default (no forced registration).
- Minimal form fields (Name, Phone, Address, City, 6-digit Pincode).
- Payment Options: UPI (instant QR/ID), Card, Cash on Delivery (COD).
- 110% store credit offset option.
- Zero surprise fees.

---

## 7. Conversion Strategy & Business Rules

*(Extracted from `public/assets/aistudio/E-commerce_Strategies__1__88bc0fba.pdf`)*

1. **Free Shipping Threshold:** Orders above ₹2,500 ship free; below ₹2,500 has a flat ₹120 fee shown upfront.
2. **Discount Ladder Structure:**
   - Buy 1: Standard price
   - Buy 2: Save ₹100 – ₹500
   - Buy 3: "Best Value" + Free Shipping
   - Buy 4: Maximum savings tier
3. **Autoship / Subscription:** Useful for consumable saree care items (`silk-care-kit` @ ₹450/month).
4. **10 Revenue-Boosting Retention Loops Implemented:**
   - Back-in-stock alerts (`BackInStockModal.tsx`)
   - WhatsApp cart recovery (`CartDrawer.tsx`)
   - Browse abandonment gentle floating strip (`BrowseAbandonmentStrip.tsx`)
   - Saree finder consultation quiz (`QuizPage.tsx`)
   - 110% store credit exchange rather than cash refund (`AccountPage.tsx`)
   - Post-purchase upsell (`OrderConfirmationPage.tsx`)
   - Reorder reminders for saree care
   - Delivery-based pincode tracking (`DeliveryEstimator.tsx`)
   - Post-purchase review and survey ratings
   - Dedicated festive landing page (`CampaignPage.tsx` at `/campaign/diwali`)

---

## 8. Reference Benchmark Sites

*(From `public/assets/aistudio/Reference_websites_23632d30.txt`)*

1. **Madras Sarees** (`https://madrassarees.com/`)
2. **Vastranand** (`https://www.vastranand.in/`)
3. **Lakshmi Boutique** (`https://lakshmiboutique.co.in/`)
4. **Dancing Cow** (`https://dancingcow.in/`)
5. **Kriya Boutique** (`https://kriyaboutique.com/`)
6. **Soulflower** (`https://www.soulflower.in/`)

---

## 9. Full Route Map & Inventory

| Route Path | Page Component | Key UI Responsibilities |
| :--- | :--- | :--- |
| `/` | `HomePage` | Single-focus hero, collection cards, bestseller tabs, testimonials |
| `/collections` | `CollectionPage` | Full catalog, sidebar filters (category, occasion, price), search, pagination |
| `/collections/:slug` | `CollectionPage` | Filtered collection view (silks, cotton-linen, blouses-jewellery, under-1500) |
| `/product/:id` | `ProductDetailPage` | Conversion-first PDP, 4 image slots, video modal, discount ladder, pincode check |
| `/campaign/diwali` | `CampaignPage` | Dedicated ad landing page, single focus, DIWALI10 code, 24h dispatch guarantee |
| `/quiz` | `QuizPage` | 30s 3-step consultative quiz recommending top 3 matches |
| `/offers` | `OffersPage` | Transparent quantity discount breakdown & bundle savings calculation |
| `/checkout` | `CheckoutPage` | Frictionless guest checkout, delivery calculator, UPI/COD/Card options |
| `/order-confirmation/:id` | `OrderConfirmationPage` | Order summary, 4-stage live tracking strip, post-purchase upsell, feedback survey |
| `/account` | `AccountPage` | Customer hub, active orders, tracking, 110% store credit exchange modal |
| `/wishlist` | `WishlistPage` | Saved shortlist grid, quick add to bag |
| `/support` | `SupportPage` | Plain-language return, shipping & COD policies, stylist contact desk |

---

## 10. Image Asset Catalog

All local high-resolution editorial assets are placed in `src/assets/images/`:
- `hero_kanchipuram_editorial_1795082278166.jpg`: Hero banner courtyard drape
- `product_emerald_drape_1795082277045.jpg`: Emerald Kanchipuram drape
- `product_banarasi_crimson_1795082277292.jpg`: Crimson Banarasi Katan silk
- `product_ivory_linen_1795082277269.jpg`: Chanderi ivory linen weave
- `product_maheshwari_ochre_1795082277630.jpg`: Maheshwari ochre rose weave
- `detail_zari_weave_1795082278018.jpg`: Macro close-up antique gold zari weave
- `product_blouse_jewellery_1795082278000.jpg`: Kalamkari blouse & temple jewellery
- `product_festive_diwali_1795082278294.jpg`: Diwali festive silk showcase with brass diyas

*(SafeImage component provides graceful SVG/placeholder fallback if any image URL fails to load).*
