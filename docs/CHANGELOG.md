# Changelog & Agent Task Log

This document records the modifications made to `salla-react-theme` based on the user's inspiration (`generic-store-astro` and `generic store-tailwindcss-final`). Any new agent working on this repository should append entries here.

---

## [Initial Setup & Inspiration Adaptation] - 2026-10-25

### 1. Toolchain & Dependencies
- Upgraded `@salla.sa/cli` from `3.2.4` to `3.2.63`.
- Verified toolchain via `salla theme doctor`: Node v23.4.0, pnpm v10.30.3, git.
- Initialized official Twilight React starter theme: `salla-react-theme`.

### 2. Assets & Typography
- Extracted and transferred `Dubai` font family (`Dubai-Regular`, `Dubai-Medium`, `Dubai-Bold`, `Dubai-Light`) from `docs/inspiration/generic store-tailwindcss-final` into `public/fonts/dubai/`.
- Copied hero background shapes and service icons into `public/images/hero/` and `public/images/service/`.
- Configured `@font-face` definitions in `app/styles/app.css` and bound `--font-main` and `--font-ar` to `Dubai`.

### 3. Design Tokens & Styling
- Updated `app/styles/01-settings/global.scss`:
  - Set default `--color-primary: #6c7fd8;` (Generic Store primary brand indigo).
  - Set `--color-primary-dark: #5a6cc8;`.
  - Set `--color-primary-reverse: #ffffff;`.
  - Set `--top-header-bg: #333e59;` (Deep navy top bar).
  - Set `--title-color: #3d4750;` and `--secondary-color: #3d4750;`.
  - Set `--color-text: #686e7d;` and `--main-text-color: #3d4750;`.
  - Set `--bg-gray: #f8f8fb;` (Soft lavender/gray section background).
  - Set `--s-radius: 10px;` (matching `$radius-10` from inspiration).

---

## [High-Fidelity Generic Store Completion & Salla Decoupling] - 2026-10-26

### 1. Deep Decoupling from Salla Demo Store Overrides
- **Color Override Prevention:** Injected an inline script in `app/routes/__root.tsx` with a `MutationObserver` on `document.documentElement.style` to lock `--color-primary: #6c7fd8 !important`, `--color-primary-dark: #5a6cc8 !important`, `--color-title: #3d4750 !important`, `--color-secondary: #3d4750 !important`, and `--top-header-bg: #333e59 !important`, preventing Salla demo store's inline `salla-theme-sync` from reverting colors to red (`#ed1c24`).
- **Brand Logo:** Decoupled `Header.tsx` brand logo from Salla demo store SVG (`salla.com/logo-wide-1.svg`) so it renders Generic Store's logo (`/images/logo.png`).
- **Contacts:** Added Generic Store phone (`+966 56 609 0989`) and email (`support@genericstore.com`) fallbacks to `HeaderTopnav.tsx`.

### 2. Full Product Card Architecture (`.gs-card` & `.s-product-card-vertical`)
- **Card Framing:** Square image container with `border: 1px solid #eeeeee`, `border-radius: 10px`, background `#fbfbfb`, and hover border `#c6cde9`.
- **Hover Micro-Interactions:** Image smoothly scales `transform: scale(1.08)` over `0.4s cubic-bezier(0.32, 0.72, 0, 1)`.
- **Glassmorphic Action Bar:** Built bottom-anchored hover action bar with `backdrop-filter: blur(4px)`, `background: rgba(255, 255, 255, 0.85)`, and `35px x 35px rounded-[10px]` icon buttons for Wishlist, Quick View, Compare, and Add to Cart. Added always-visible fallback for touch devices.
- **Rating Stars:** Standardized rating stars with filled state `#f4a263`.
- **Category & Subtitle:** Added category links with hover color `#6c7fd8` and subtitle fallbacks.
- **Interactive Swatches & Sizes:** Added rounded color swatches and size button chips with active states.

### 3. Hero Section (`.store-hero`)
- **Keyframe Leaf Animations:** Added `@keyframes rotaleLeaf` (5deg to -5deg rotation) and `@keyframes moveLeaf` (5px to -5px translation) to animate the 4 floating leaf shapes.
- **Hero Slider Fallback:** Added Generic Store fashion hero slides with women's and men's fashion visuals (`hero-1.png`, `hero-2.png`), bold 55px typography, Monsoon Sale badge, and Shop Now CTA.
- **Circular Visual Backdrop:** Added circular layered element (`#e0e3eb` with dashed outline) behind hero model.

### 4. Service / Features Block (`.store-services`)
- **Component Update:** Updated `app/components/home/StoreFeatures.tsx` to safely detect valid merchant data and fall back to the 4 Generic Store service cards:
  1. Fast & Secure Delivery (`/images/service/1.png`)
  2. Money back Guarantee (`/images/service/2.png`)
  3. 24 Hours Return Policy (`/images/service/3.png`)
  4. Quality Support (`/images/service/4.png`)
- **Card Styling:** `#f8f8fb` background, `10px` radius, `1px solid #eeeeee`, and hover lift `translateY(-4px)` with soft shadow.

### 5. Custom Testimonials (`.s-block--custom-testimonials`)
- **Component Update:** Updated `app/components/home/CustomTestimonials.tsx` to provide Generic Store customer reviews when unpopulated:
  - Wilson Matheu (Manager) with `/images/testimonials/u-1.jpg`
  - Maria Davidson (CEO) with `/images/testimonials/u-2.jpg`
  - John Deo (Manager) with `/images/testimonials/u-3.jpg`
- **Card & Avatar:** Avatar sized at `60px x 60px rounded-[10px]`, 5 stars in `#f4a263`, white card on `#f8f8fb` ambient background with wave graphics (`bg-1.png`, `bg-2.png`).

### 6. Section Titles
- Highlighted keyword `span` in `FixedProducts.tsx` and `ProductsSlider.tsx` using `formatTitle()` to color the last word in `--color-primary: #6c7fd8`.

### 7. Verification
- `pnpm typecheck`: Clean (0 errors).
- `pnpm check:manifest`: Clean (0 errors, 0 warnings).
- `pnpm build`: Both client and SSR production environments built successfully.
- Vitest unit tests for styles passed.
- Live server on `http://localhost:5173/` verified with all new classes and assets.

---

## [Dynamic Salla Dashboard Compatibility & Search Redundancy Removal] - 2026-10-26

### 1. Removal of Duplicate "فئات المنتجات" Dropdown
- Removed `.site-header__search-category` button inside the desktop search input in `app/components/layout/Header.tsx`.
- The main navigation bar already includes a dedicated category drawer button (`.site-header__category-btn` with grid/apps icon) that displays the entire category tree. Eliminating the duplicate button inside the search field simplifies the UI into a clean, modern single-field search bar.
- Refactored `.site-header__desktop-search` in `app/styles/04-components/header.scss` to unify padding, border-radius, and focus states.

### 2. 100% Dynamic Theme Control Panel Customization
- **Non-blocking Color System:** Removed `MutationObserver` locks and CSS `!important` declarations from `:root` in `app/styles/app.css`, `app/styles/critical.scss`, and `app/routes/__root.tsx`.
- **Dynamic Color Settings:** Bound `theme.settings.theme_color_primary`, `theme_color_secondary`, and `theme_top_header_bg` reactively in `app/components/layout/ThemeLayout.tsx`. Added them to `twilight.json` `settings` so merchants can customize all theme colors directly from Salla's visual theme customizer.
- **Dynamic Store Logo:** Updated `app/components/layout/Header.tsx` to prioritize `theme.settings.header_custom_logo` > `store.logo` > fallback `/images/logo.png`.
- **Hero Slider Dynamic Images:** Removed URL filtering on `salla.network` in `app/components/home/EnhancedSlider.tsx`. Merchant-uploaded banners, slide titles, subtitles, and CTA buttons from the dashboard now render with full fidelity.
- **Dynamic Store Features:**
  - Added `home.store-features` component definition and collection schema into `twilight.json` with fields for `features.title`, `features.description`, and `features.icon`.
  - Updated `StoreFeatures.tsx` to normalize collection properties and seamlessly render merchant-created service items.
  - Registered `store-features` and `home.store-features` in `app/router.tsx`.
- **Dynamic Testimonials:** Updated `app/components/home/CustomTestimonials.tsx` to normalize collection fields (`items.name`, `items.avatar`, `items.stars`, `items.text`), rendering merchant reviews when configured.

### 3. Verification & Compliance
- `pnpm check:manifest --strict`: `✓ twilight.json: 0 error(s), 0 warning(s)`.
- `pnpm typecheck`: `tsc --noEmit` clean with 0 errors.
- `pnpm build`: Both client bundle and SSR bundle built successfully.
- Barrel exports updated for `ReferenceIcon`, `ProductCompareProvider`, and `ProductOverlay` complying with Twilight lazy-loading best practices.

---

## [Modern Luxury E-Commerce Overhaul] - 2026-10-26

### 1. Ultra-Modern Header & Announcement Bar
- **Announcement Ticker:** Upgraded `HeaderTopnav.tsx` to feature a centered promotional badge (`✨ عرض حصري: شحن مجاني لكافة الطلبات فوق 199 ر.س`) alongside dynamic store switchers and contact actions.
- **Glassmorphic Navigation Header:** Enhanced `.site-header__bar` with backdrop blur (`16px`) and smooth elevation on scroll.
- **Full-Pill Search Bar:** Redesigned desktop search with pill shape (`rounded-full`), `#f8fafc` surface, smooth focus ring, and keyboard shortcut badge (`⌘K`).
- **Circular Floating Actions:** Modernized `.header-action` to 44px circular pills with smooth dark hover inversion (`bg-slate-900 text-white -translate-y-0.5 shadow-md`).

### 2. High-Impact Hero Elevation
- **Removal of Legacy Elements:** Stripped outdated floating cartoon leaves (`rotaleLeaf`, `moveLeaf`) and dashed border circles.
- **Floating Glassmorphic Badge:** Added elegant pill badge with sparkling indicator (`✨`) and clean typography.
- **Display Typography:** Upgraded headline to bold 2026 editorial display typography (`clamp(34px, 4.5vw, 56px)`, tracking `-0.02em`).
- **Modern Pill CTA:** Elevated "Shop Now" button into a pill button with directional arrow transition and ambient shadow glow.
- **Ambient Glow Backdrop:** Replaced dashed ring with smooth radial gradient blur (`rgba(108,127,216,0.22)`).
- **Modern Slider Controls:** Replaced rectangular bullets with expandable pill pagination (`w-8` on active slide) and frosted glass circular nav arrows.

### 3. Contemporary Product Card Architecture
- **Card Framing:** Modernized `.gs-card` to 20px rounded corners, `#f1f5f9` ultra-fine border, and 16px rounded viewport with cinematic hover zoom (`1.06`).
- **Floating Frosted Glass Actions:** Stacked circular frosted-glass buttons (`36px x 36px`) for Wishlist and Quick View at top-end with smooth hover scale.
- **Sale & Discount Badges:** Frosted glass pill badge with bold typography and discount percentage pill (`-20%`) beside price.
- **Quick Add Action Bar:** Built sliding modern action bar (`rounded-xl`, high-contrast dark slate hover to primary) with full mobile/touch responsiveness.
- **Ratings & Meta:** Modern star ratings with numerical score badge (`★ 4.9`).

### 4. Interactive Squircle Service Features & Verified Testimonials
- **Store Features (`StoreFeatures.tsx`):** Modernized to 20px rounded gradient cards with squircle icon badge (`60px x 60px rounded-[18px]`), interactive scale expansion, and lift effect.
- **Customer Reviews (`CustomTestimonials.tsx`):** Modernized to 22px rounded cards with emerald verified buyer badge (`✓ مشتري موثق`), clean avatars, and warm amber stars.

### 5. Verification
- `pnpm check:manifest --strict`: Clean (0 errors, 0 warnings).
- `pnpm typecheck`: Clean (0 errors).
- `pnpm build`: Clean (built in 4.98s).
- Live server on `http://localhost:5173/` active with 200 OK.

---

## [Restoration of Loved Inspiration Design & Dynamic Control Harmonization] - 2026-10-26

Per user request ("لا رجع الديزاين اللي قبل كان احلى"), completely reverted the visual styling and component markup back to the beloved `generic store-tailwindcss-final` aesthetic, while strictly preserving all dynamic dashboard settings and performance optimizations.

### 1. Visual & Layout Restoration
- **Hero Section (`EnhancedSlider.tsx`, `storefront.scss`):**
  - Restored the 4 floating animated leaves (`rotaleLeaf`, `moveLeaf` keyframes) with exact CSS translation and rotation animations.
  - Restored the dashed circular visual backdrop (`.store-hero__shape` with `#e0e3eb` fill and dashed ring) behind the hero model.
  - Restored the original eyebrow, typography, and rectangular pill CTA.
- **Product Card (`ProductCard.tsx`, `storefront.scss`, `product.scss`):**
  - Restored 10px corner radius (`$radius-10` / `rounded-[10px]`) on product cards and product image containers.
  - Restored the bottom-anchored 4-button action bar (`.gs-card__actions`: Wishlist, Quick View, Compare, Add to Cart) with `35px x 35px rounded-[10px]` icon buttons.
  - Restored original rating stars (`ProductStars`) and standard price display (`ProductCardPrice`).
- **Store Features (`StoreFeatures.tsx`, `storefront.scss`):**
  - Restored clean 4-card service items with `#f8f8fb` background and 10px rounded corners.
- **Testimonials (`TestimonialsCarousel.tsx`, `storefront.scss`):**
  - Restored original 10px testimonial cards without the modern verified buyer badge.
- **Header & Navigation (`Header.tsx`, `HeaderTopnav.tsx`, `header.scss`):**
  - Removed redundant "فئات المنتجات" button from the desktop search input (the dedicated square categories drawer trigger remains in the navbar).
  - Restored 10px rounded action buttons (`.header-action` with `rounded-[10px] bg-[#f8f8fb] border border-[#eee]`).
  - Restored clean topnav layout with contact information and currency/language switchers.

### 2. Preserved Platform & Dynamic Dashboard Bindings
- **Dynamic Twilight Settings:** All merchant customization settings in `twilight.json` (`theme_color_primary`, `theme_color_secondary`, `theme_top_header_bg`, `header_custom_logo`, `home.store-features`) remain fully dynamic and reactive.
- **Zero Style Locks:** Zero `!important` locks or DOM mutation observers interfering with Salla theme editor.
- **Icon Rendering:** Kept dynamic font-icon support (`<i className="sicon-...">`) ensuring icon font glyphs render seamlessly across features and navigation.

### 3. Verification & Build
- `pnpm check:manifest --strict`: 0 errors, 0 warnings.
- `pnpm typecheck`: Clean (0 errors).
- `pnpm build`: Client and SSR bundles built successfully.


## [Reference fidelity and real storefront actions] - 2026-10-26

- Compared the current HTML reference with the live theme at desktop and mobile sizes. Aligned the desktop header's 40/88/56px rows, 1320px container, 600×48px segmented search, rounded reference icons, and Dubai typography.
- Replaced the product-card engine wrapper with theme-owned markup registered through the supported `product:card` registry. Added real ratings, discounted prices, full-detail color/option enrichment, selectable swatches, and a hover/focus action tray with touch visibility.
- Connected wishlist to the engine hook, quick view to full product data and Salla's existing product form, and comparison to a four-item local comparison tray/table. Quick view keeps live price/stock with `useProduct` and leaves purchase selection/validation with the native form.
- Fixed duplicate account icons caused by overriding `[hidden]`; guest account opens the real login modal. Fixed header cart navigation through the engine's public navigation hook. Kept search, category drawer and store switchers connected to their existing Salla integrations.
- Removed duplicate card CSS, dead fallback hero links, invented fallback reviews and false five-star defaults. Kept merchant-authored content and store branding.
- Added regression coverage for actual ratings/prices, wishlist IDs, simple/option/sold-out cart paths, swatch selection/unavailable colors, failed-detail retry, quick-view close and comparison/removal. Updated home-block tests for the intended empty/content states.
- Validation: production build, TypeScript, manifest validation (0 errors / 0 warnings), and 442 tests in 54 files passed.

- Final interaction follow-up: CartPage waits for `whenSallaReady` before reading the current cart ID, and uses `onSallaEvent` for subscriptions that remain valid when hydration precedes SDK loading. Added a readiness regression test. Matched the wide storefront container to 1320px with 12px gutters and restored the reference desktop hero height of 720px.

- Added an SSR regression test for the deferred wishlist subscription and preserved native booking integration for the new card/quick-view markup. Matched the mobile header to the reference logo/category row plus a full-width search row; adjusted desktop contact/search font sizes to 15px/16px.

- Added `REFERENCE_QA.md` with measured reference/theme geometry, interaction evidence and the remaining cart-session issue. Native cart addition succeeds, but after navigation the local preview and the SDK's own details call return zero items. This end-to-end cart journey is not marked passing. Removed all temporary cart diagnostics.

## [Native options verification] - 2026-10-27

- Isolated the mutable Salla options widget from cached React product data using a cloned array and the documented `seedSelectedOptions` method after mounting. Added an ordering/cache-isolation regression test. Card swatches preview color/image; required purchase choices are made inside the native quick-view form. No unsupported constructor workaround or dependency patch was added.

- Final browser verification: native black-color selection remained checked and the quick-view price updated from 115 to 230 SAR. Saved final visual evidence and restored the temporary viewport override. Final checks: build / TypeScript / 442 tests passed; manifest remains at 0 errors and 0 warnings. Cart session after navigation remains an explicitly documented preview issue.

## [Video background and product page repairs] - 2026-10-27

- Video hero slides now fill the complete slide, with merchant copy above a readable overlay. Static-image slides keep the split circular reference design. Posters/reduced-motion fallbacks preserve the same video-slide geometry. YouTube frames and uploaded videos pause when out of view; flattened `slides.video` data is recognized.
- Removed ProductGallery's manual remove/reinsert DOM effect; the slider remounts through its React key when product identity changes.
- Moved the product-page wishlist subscription behind a stable hydration placeholder and connected both gallery/title hearts to the public wishlist hook. Removed the full-page fallback navigation from the gallery back button.
- ProductDetails now receives the same live product as AddToCartForm. Verified the selected black variant updates both displayed prices from 115 to 230 SAR. Simplified conflicting layout utilities and kept gallery/details aligned in the reference grid.
- Added regression coverage for full-slide video composition, React-owned gallery navigation, wishlist SSR output and live variant data shared by details/form.
- Upstream sync: fetched official `SallaApp/theme-raed-react` HEAD `575b51e370d66603e83eb266b15ccf4a5c11aa63` into a temporary checkout and compared it with the initial scaffold. No component changes required importing; upstream specifies engine ^1.0.132. Also compared published `@salla.sa/theme-raed@1.0.63`: scaffold differences are package identity only. Updated the theme engine from installed 1.0.129 to the latest published 1.0.133, preserving theme customizations and recording the lockfile. No remote was attached to the user checkout.
- Verification after upgrade: production build and typecheck pass; 445 tests across 55 files pass. Live gallery next-slide and lightbox work; mobile product layout measures 390px content in a 390px viewport.
- Upstream references: https://github.com/SallaApp/theme-raed-react and https://docs.salla.dev/twilight/react/local-development/create-a-theme .

## [Warm editorial design from new image references] - 2026-10-27

- Reviewed both newly supplied JPGs in docs/inspiration and applied the existing-project redesign skill. Combined the cream/orange editorial reference with the peach reference's organic hero geometry.
- Added a shared presentation stylesheet for warm surfaces, larger Dubai headings, compact header/search, image categories, fine section rules, product page and footer. Included it in full and critical CSS to avoid a first-paint design jump.
- Updated merchant color defaults and the local preview; kept native actions, settings and merchant content. The top strip defaults to light.
- Moved the single native wishlist control to a persistent image-corner heart; kept quick view, compare, options and add-to-cart in the contextual tray. Removed obsolete floating hero leaf images.
- Full test suite: 445 tests in 55 files pass. Manifest validation: zero errors/warnings. Production build passes.
- Live QA after restarting Vite with fresh dependency optimization: fixed-products renders normally (no TwilightProvider error); quick view opens and closes with the native purchase form. Confirmed one wishlist heart per card, 1440px/390px viewports without horizontal overflow, readable white video copy and 30px mobile product titles. Final build, typecheck and manifest validation pass.
- Local dev is running on IPv4 loopback (`pnpm dev --host 127.0.0.1`) after the browser could not reach the IPv6-only listener.

## [Hero playback, scrolling and single account control] - 2026-10-27

- Fixed an SSR hero poster that could remain above the initialized slider when afterInit was missed. Actual slide image loading, uploaded-video playing and YouTube playing now also trigger the React-owned poster handover. The loading poster no longer intercepts slider gestures or page scrolling; its CTA stays usable.
- Header supplies the custom login slot only for guests. Logged-in customers use the native menu avatar, eliminating simultaneous custom trigger/login controls and retaining the actual profile photo.
- Added regression tests for missed-init image and video handover, and guest/authenticated account control ownership. All 449 tests across 55 files pass. Live QA: YouTube reports playing with poster absent, next/previous switch 1/2 ↔ 2/2, wheel scrolling over the hero moves the page to 455px, and only one visible login button remains.

## [Integrated organic hero photography] - 2026-10-27

- Still-image hero slides now clip the photograph into the organic silhouette itself with cover sizing, rather than placing a contained rectangular photograph above a separate shape. Retained a subtle peach backing and offset contour for depth. The same mask applies on mobile; video slides keep their full-cover background.

## [Wave transitions and internal tonal layers] - 2026-10-27

- Added flowing section edges to hero slides, both edges of the testimonials band and the light footer transition, following the user's clarification that waves should also separate sections.
- Static hero images include two clipped translucent wave layers in peach and the merchant accent. Added a subtle tonal wave inside the static hero background. Decorative layers stay pointer-transparent and use CSS masks without editing merchant image files.
- Mobile uses shallower section waves and the same clipped image treatment.
- Verification: production build and typecheck pass. Restarted the local dev server after an interrupted preview stream before visual review.

## [Consistent header controls, menus and dialogs] - 2026-10-27

- Removed the search category button and all obsolete CSS for it; retained the independent navigation category trigger. Added regression coverage to prevent reintroducing the removed selector.
- Unified account/cart as 44px circular controls with 22px rounded icons, warm border/ink colors and matching hover feedback. Native signed-in avatars remain owned by Salla.
- Applied shared warm panel tokens to desktop submenus, account menus, native modal shells, quick view/comparison, drawer and sheets. Kept native positioning, focus and close behavior. Cross-origin authentication form content remains Salla-owned.
- Created UI_DECISIONS.md and linked it from AGENTS.md, ARCHITECTURE.md and DESIGN_SYSTEM.md. Corrected the old architecture/QA descriptions that still described a search category segment.
- Live verification: account/cart both measure 44×44px with 22px icons; submenu keyboard access works, quick view and native login shells open/close, and native search opens with its input/trending data. Search inner surfaces and suggestions now use the same warm palette instead of white/gray. Full suite: 450 tests pass; production build and typecheck pass.

## [Distinctive branded header and footer] - 2026-10-28

- Default header now pairs the actual logo/store name, a warm single-field pill search, matching account/cart controls and an accented navigation Categories button. No category selector was restored inside search.
- Added a large store-name sign-off and merchant phone/email contact action above the maintained public engine Footer. Refined footer column proportions, social controls and wave entry. Preserved centered/dark footer variants and existing native data/widgets/hooks.
- Added Arabic/English sign-off translations and regression coverage for actual phone/email links and the no-contact case.
- Fixed mobile horizontal overflow from the hidden desktop cart wrapper and account host while retaining the native account menu for bottom navigation.
- Verification: 453 tests across 56 files pass; production build and typecheck pass. Live review at 390px and 1440px confirms no horizontal overflow, working store-name navigation and native tax-certificate dialog open/close behavior.

## [Restore established header and footer] - 2026-10-28

- Reverted the rejected branded-frame experiment: removed the oversized store-name/contact sign-off and extra stylesheet; restored the previous header search, row sizes, logo presentation and navigation trigger.
- Retained the native engine Footer and its full merchant data/widgets, previous wave treatment, shared icon/panel styling and the protected search-category removal.
- Updated UI_DECISIONS and corrected architecture/design documentation so the rejected direction is not treated as the standard.
- Verification: production build, typecheck and all 450 tests pass. Live footer review confirms description, phone/email, social links, tax/trust details, merchant links, apps and payments remain present; header main row is restored to 84px.


## [Twilight weekly compatibility] - 2026-10-30

- Reviewed the 2026-10-29 Salla weekly email and official releases 2.0.304–2.0.314; all require no developer action.
- Updated installed engine 1.0.133 → 1.0.139 and React components 3.0.12 → 3.0.17; refreshed the lockfile. No unrelated dependency upgrade was requested.
- Compared seven relevant shipped source files: no product/cart/listing fork changes needed. Kept guest-cart creation, tracking, page events, bundle behavior and free-shipping content provider-owned.
- Validation: build and typecheck passed; 55 test files / 450 tests passed. Existing package/build warnings remain. No deployment or live-store verification performed.
- Details and live acceptance checklist: [TWILIGHT_WEEKLY_2026-10-29.md](TWILIGHT_WEEKLY_2026-10-29.md). The effective storefront SDK is settings-dependent; weekly release numbers were not used as a speculative CDN pin.


## [Product surfaces and gallery presentation] - 2026-10-31

- Removed the hard-coded white utility from StickyProductBar. Product form sections, provider option wrappers and gifting tiles now share the paper page surface; form fields and quantity controls use the paper/ink/divider tokens.
- Brand-logo wrappers are transparent; multiply blending removes the white raster-logo rectangle on the warm page. Product photographs retain their original pixels.
- Hide the duplicate live price in the normal purchase row, retaining it in the fixed mobile purchase bar. The floating bar keeps an opaque paper background, border and panel shadow so content cannot show through it. Price calculation and stock/quantity behavior are unchanged.
- Retained fsLightbox and the native-app gallery path. The browser viewer now uses paper, warm borders, circular controls, media safe insets, and an explicitly positioned LTR counter separated from toolbar controls in RTL.
- Verification: production build and TypeScript passed; all 55 test files / 450 tests passed. Browser inspection covered chair product p95914169, color-option product p73203761 and the 390px mobile sticky-bar breakpoint. No purchase was submitted.


## [Header and footer image-reference refinement] - 2026-10-31

- Used docs/inspiration/header.png and footer.png as visual references: broad pill search, independent navigation row, airy footer columns and circular social controls. Kept existing merchant colors, logo, data and public engine components.
- Preserved the top utility contacts, language/currency/branch controls, guest/authenticated account behavior, cart, search modal, main menu and category drawer. The navigation category trigger now has a visible label; search still has no category selector.
- Preserved the native footer including description, contacts, seven demo-store links, four social links, app buttons, tax/SBC/trust details, copyright/hooks and six payment badges. Footer columns reflow on mobile; centered/dark merchant variants remain supported. The native isHeader contacts widget had display:none on mobile; a footer-scoped rule now exposes those contacts.
- No newsletter form was fabricated: the reference's visual spacing was adapted to the real app-download section and current merchant data.
- Build/typecheck passed; 55 test files / 450 tests passed. Browser reviewed at 1440px and 390px, search modal opened successfully, no horizontal document overflow. No deployment performed.


## [Revert header/footer image-reference refinement] - 2026-10-31

- User preferred the previous design. Removed only the CSS block introduced by the preceding header/footer refinement and restored the category trigger's sr-only label.
- Restored the prior search shape, header dimensions, footer columns, social styling and wave boundary. The reference files remain available but the rejected experiment is not the active design.
- Preserved the earlier product-surface/lightbox fixes and Salla dependency upgrades.


## [Shared purchase-form surfaces and quick-view details action] - 2026-11-01

- Root cause: product surface rules were scoped to body .store-product, while ProductOverlay portals quick view into document.body. Native option/gifting markup therefore reverted to provider white defaults.
- Moved purchase-surface, field, quantity, gifting and duplicate-price styling onto the reusable .product-form itself; brand artwork remains scoped to product details. The existing product-page-only mobile floating-bar rule stays intact. This covers page, quick view and future uses of the shared AddToCartForm without a separate visual patch per container.
- Styled View full details as a full-width, 48px-minimum outlined navigation action with a direction-aware icon and focus ring. Retained the engine Link and native destination, supporting normal link semantics.
- Verified the exact reported product p1303461379 from its brand listing: quick view shows color options, four diagram thumbnails, a paper-colored select and transparent gifting tile. Inspected computed styles; the details link is 50px tall. Clicked it and reached the correct local product route; overlay closed on navigation. No purchase submitted.
- Production build/typecheck passed; 55 files / 450 tests passed. Header/footer rollback remains intact.


## [Product experience and reviews refresh] - 2026-11-01

- Applied the five approved proposals: persistent dialog header/close button with an independently scrolling body; one horizontal thumbnail strip on mobile; a native details/summary gifting disclosure; a visible no-reviews label for unrated cards; up to two real merchant facts from weight/material/size/dimension options. Missing attributes stay absent.
- Restyled provider-backed comments/reviews in product-experience.scss: section introduction, warm review cards, author/date hierarchy, helpful controls, comment form, native sort/filter toolbar and a two-column ratings-summary treatment when provider data/settings permit it.
- Kept all original Salla permissions, posting, rating summary calculation, attachments, replies, verified-purchase filtering and pagination. No fabricated score or rating distribution; products with comments but no rating summary do not get a fake aggregate.
- Added Arabic/English translation keys; feature styles load in full and product-critical CSS. Header/footer design remains the previously approved one.
- Validation: production build and typecheck passed; 452 tests / 55 files passed, including two new tests guarding genuine merchant facts. Browser verification uses product p73203761 (eight real comments) and p1303461379 (nine images and required options). No comment, review, helpful vote or purchase submitted.

- Final browser checks: verified-purchases filter returned a valid empty state and other sort options remained usable; mobile quick-view close stayed at y≈57px after scrolling its body 577px, thumbnails remained nowrap with internal horizontal scrolling, gift disclosure expanded, closing returned focus to its trigger. No horizontal document overflow at 390px/1440px.
- Fixed the provider summary host's inherited grid-row span to prevent blank space when aggregate data is absent. Final build passed after this CSS adjustment. Screenshots: salla-reviews-modern.jpg and salla-quickview-experience.jpg in the task visualization directory.


## [Omit absent star ratings] - 2026-11-01

- User requested no empty-star UI and no no-reviews text. Cards and quick view now render no rating row unless both a positive actual rating and a positive rating count exist. ProductDetails uses the same eligibility rule.
- Removed the unused unrated text style. Actual customer comments and their native functionality remain available; real nonzero ratings still render when supplied by Salla.
- Expanded the rating regression cases to cover missing data, zero ratings and comment counts without a star score.

---

## [Modern Distinctive Header & Footer Layout Arrangement] - 2026-11-01

Per user request ("اللاي اوت حق الهيدر والفوتر ماهو مميز او خارج المألوف، جرب تسويلي ترتيب لاي اوت حديث وجميل وبرضو لاتخرج خارج نمط التصميم"), elevated the structural and visual layout of both Header and Footer while strictly adhering to the warm editorial design system (`--store-paper`, `--store-paper-deep`, `--store-ink`, `--color-primary`, `--store-line`, Dubai font):

### 1. Distinctive Modern Header Layout
- **Top Utility & Announcement Ribbon (`HeaderTopnav.tsx`):**
  - Added an elegant centered live value ticker (`✨ شحن وتوصيل سريع لكافة المناطق | منتجات أصلية ومضمونة 100%`) with pulsing indicator and integrated bullet delivery tag.
  - Formatted phone and email contacts as interactive chips with micro-icons and clean hover states.
  - Enhanced currency/language/branch switchers with subtle hover micro-interactions.
- **Main Header Bar (`Header.tsx`, `inspiration-refresh.scss`):**
  - Upgraded the desktop search bar into a tactile, floating **modern capsule (pill)** (`rounded-full`, soft `var(--store-paper-deep)` background, fine border, burnt orange search icon, and `⌘K` keyboard shortcut badge). Zero category dropdown inside search (strictly adhering to `UI_DECISIONS.md`).
  - Added frosted glass backdrop blur and ambient elevation when scrolled (`is-scrolled`).
  - Preserved 44px circular controls for Account, Scope, and Cart with floating count badge.
- **Navigation Row & Categories Discovery:**
  - Upgraded the categories trigger from an anonymous icon into a prominent, branded **"تصفح الأقسام" (Browse Categories)** pill button with icon, label, and chevron caret.
  - Modernized main menu links with animated burnt orange micro-underline indicators on hover.

### 2. Modern Architectural Footer Layout
- **Wave Mask Entrance:** Added top wave transition (`.store-footer__wave-divider`) with `--store-wave-mask` connecting page sections seamlessly to the footer.
- **Brand Value Pillars Bar (`ThemeFooter.tsx`):**
  - Introduced an architectural 4-pillar ribbon on `var(--store-paper-deep)` with local service icons: Fast & Secure Delivery, Money-Back Guarantee, Easy Exchange, and 24/7 Support.
- **Enhanced Salla Engine Footer:**
  - Harmonized the Salla native footer with `var(--store-paper-deep)` background and warm paper cards.
  - Styled footer contacts as interactive pill chips.
  - Styled social links as 38px circular rounded buttons with brand hover elevation.
  - Refined links menu with an accent underline on headings and hover indent on links.
  - Neatly aligned payments and copyright, adding a dedicated **"العودة للأعلى" (Scroll to Top)** button.

### 3. Verification & Automated Tests
- `pnpm check:manifest --strict`: 0 errors, 0 warnings.
- `pnpm typecheck`: Clean (0 errors).
- `pnpm build`: Client and SSR bundles built successfully.
- Vitest suite: All **55 test files and 454 tests passed** cleanly.

---

## [JoyParty Header & Footer Image Adaptation & Search Dialog Restoration] - 2026-11-01

Per user request ("ضفت لك تصاميم هيدر وفوتر استوحي منهم، وبعدين الدايلوق حق السيرش اللي قبل كان احلى رجعه"), adapted the visual language from the newly provided references `docs/inspiration/header.png` and `docs/inspiration/footer.png`, and restored the clean native Salla search dialog:

### 1. Header Inspired by `docs/inspiration/header.png`
- **Floating Capsule Island Bar:** Main bar styled as a floating white rounded capsule island (`rounded-full`, `#ffffff`, gentle elevation shadow `box-shadow: 0 10px 35px rgba(73, 48, 57, 0.07)`, fine subtle border).
- **Accented Search Tab Button:** Styled the search field as the vibrant burnt orange capsule tab from `header.png` with a white magnifying glass icon and translucent shortcut badge.
- **Top Bar Alignment:** Rendered direct support contacts on the start side, and peach circular social media pills on the end side matching the top bar in `header.png`.
- **Navigation Underline:** Active and hovered menu items carry the burnt orange indicator underline.

### 2. Footer Inspired by `docs/inspiration/footer.png`
- **Floating Island Footer Card:** Housed the 4-column footer inside a large, rounded white floating card (`border-radius: 28px`, `#ffffff`, `box-shadow: 0 20px 50px rgba(73, 48, 57, 0.07)`).
- **Airy 4-Column Layout:** Brand column with descriptive bio and circular peach social buttons (`w-9 h-9 bg-[#fdeee7] text-[var(--color-primary)]`), clean navigation and quick link columns, and open hours / contact details.
- **Exterior Copyright & Controls:** Centered copyright note and clean payment tiles sit outside on the warm cream page background, alongside the smooth scroll-to-top control.

### 3. Search Dialog Restoration
- Completely removed the artificial theme overrides on `.s-search-modal` from `inspiration-refresh.scss`.
- Fully restored the native Salla search dialog with its crisp white surfaces, clean categories chips, and high-contrast typography that the user preferred.

### 4. Verification
- `pnpm check:manifest --strict`: 0 errors, 0 warnings.
- `pnpm typecheck`: Clean (0 errors).
- `pnpm build`: Both Client and SSR bundles built successfully in 5.23s.
- `pnpm test`: All **55 test files / 454 tests pass** (100%).

---

## [Strict Dimension & Element Order Layout Alignment (`header.png` & `footer.png`)] - 2026-11-01

Per user directive ("مو نفس اللاي اوت اللي ارسلته! سوي نفس اللاي اوت بالابعاد بكل شي بالعناصر"), completely restructured the component geometry, element positioning, and visual hierarchy to match the exact references:

### 1. Header Layout Alignment (`docs/inspiration/header.png`)
- **Single Unified Floating Capsule:** Eliminated the secondary row beneath the capsule. The main navigation menu (`HeaderMainMenu`) now sits directly in the center of the white floating pill capsule (`.site-header__bar-inner`), between the Brand Logo on the start side and the User/Cart/Search actions on the end side.
- **Accented Search Tab Button:** Integrated the orange pill tab button (`.site-header__search-tab`) at the far end of the floating capsule with white search icon and smooth interactive hover effects.
- **Top Utility Row:**
  - Start: Support headset/handshake icon + "Need Any Support" in bold plum ink + underlined contact/phone link in burnt orange.
  - End: Store switchers (Language, Branch, Currency) separated by vertical dividers + 4 circular peach social badges (`w-8 h-8 rounded-full bg-[#fdeee7] text-primary`).

### 2. Footer Layout Alignment (`docs/inspiration/footer.png`)
- **Large Floating Card Island:** Wrapped inside a pure white rounded container (`rounded-[28px]`, `border border-[#dfcfbc]/70`, `box-shadow: 0 16px 45px rgba(73, 48, 57, 0.07)`).
- **Exact 4-Column Interior Grid:**
  - **Column 1 (Brand & Social):** Store Logo + 2-3 line store bio description + 4 circular peach social icons (`w-9 h-9 rounded-full bg-[#fdeee7] text-primary`).
  - **Column 2 (Navigation):** Bold plum "Navigation" heading + clean vertical list of primary store routes (Home, Products, Testimonials, Blog).
  - **Column 3 (Quick Link):** Bold plum "Quick Link" heading + dynamic Salla footer menu & policy links (Privacy, Terms, Returns, FAQ).
  - **Column 4 (Open Hours):** Bold plum "Open Hours" heading + Clock badge ("7 AM - 5 PM, Mon - Sat") + customer assistance note + phone/email + Saudi Business Center (SBC) certificate & VAT registration.
- **Exterior Page Bottom Strip:** Single-line centered copyright note (`© 2024 {store.name}. All rights reserved`), official Salla payment icons (`<SallaPayments />`), and a floating pill scroll-to-top button.

### 3. Verification & Compliance
- `pnpm check:manifest --strict`: 0 errors, 0 warnings.
- `pnpm typecheck`: Clean (0 errors).
- `pnpm build`: Client & SSR bundles built in 5.09s with zero errors.
- `pnpm test`: All **55 test files and 454 tests passed** (100%).
