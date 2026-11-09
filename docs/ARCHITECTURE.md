# Theme Architecture Guide & Agent Handover

> **Notice for Any AI Agent or Developer:**  
> This file is maintained continuously so that any agent or contributor can pick up the project without context loss or roadblocks. Always update this document whenever you introduce architectural changes, new components, or workflow conventions.

---

## 1. Project Overview
* **Theme Name:** `salla-react-theme`
* **Platform:** Salla E-Commerce (Salla Partners)
* **Theme Engine:** `@salla.sa/twilight-theme-engine` (Twilight React)
* **Framework:** **React 19** + **TanStack Start** (SSR at Edge) + **Vite 8**
* **Styling:** **Tailwind CSS 3.4** + **SCSS (ITCSS architecture)**
* **Design Inspiration:** `docs/inspiration/generic store-tailwindcss-final` (A modern, clean multi-category fashion/lifestyle storefront inspired by Generic Store).

---

## 2. Directory Structure & Key Files

```text
salla-react-theme/
├── docs/
│   ├── ARCHITECTURE.md          # This file: Core engine architecture & development rules
│   ├── DESIGN_SYSTEM.md         # Design tokens, color palette, typography & components
│   ├── CHANGELOG.md             # Running log of changes and implemented tasks
│   └── inspiration/
│       └── generic store-tailwindcss-final/ # HTML/CSS reference provided by the user
├── app/
│   ├── routes.ts                # Manifest of theme routes and route overrides
│   ├── router.tsx               # createRouter(), registerHomeComponents(), registerThemeHooks()
│   ├── routes/
│   │   ├── __root.tsx           # Hand-maintained root layout: TwilightProvider, head tags
│   │   ├── index.tsx            # Home page route
│   │   ├── cart.tsx             # Cart page route
│   │   └── ...                  # Other store routes (product, category, account, etc.)
│   ├── routeTree.gen.ts         # GENERATED automatically by TanStack Router. NEVER edit directly!
│   ├── components/
│   │   ├── layout/              # Header, Topnav, Footer, Navigation Drawer, Sheets
│   │   ├── home/                # Home sections: Sliders, Banners, Product Lists, etc.
│   │   ├── product/             # ProductCard, Gallery, AddToCartForm, ProductDetails
│   │   └── common/              # Shared UI components
│   ├── styles/
│   │   ├── app.css              # Tailwind imports, font faces, global custom properties
│   │   ├── app.scss             # ITCSS master stylesheet index
│   │   ├── 01-settings/         # Breakpoints, global CSS variables, tokens
│   │   ├── 02-generic/          # Reset, mixins, animations, RTL/LTR
│   │   ├── 03-elements/         # Buttons, form controls, radios
│   │   └── 04-components/       # Header, footer, product cards, home blocks, etc.
│   └── lib/                     # Utilities, helpers, booking hooks, route helpers
├── public/
│   ├── fonts/dubai/             # Dubai Arabic/Latin font family (Regular, Medium, Bold, Light)
│   └── images/                  # Decorative shapes (hero, service icons)
├── locales/
│   ├── ar.json                  # Arabic translations (RTL first)
│   └── en.json                  # English translations
├── tailwind.config.cjs          # Tailwind configuration, theme extensions
├── twilight.json                # Salla Theme Manifest (Merchant settings & Home blocks)
└── vite.config.ts               # Vite configuration with twilightReact()
```

---

## 3. Core Engine Principles ("Don't Fork the Engine")

1. **The Engine Owns the Infrastructure:**  
   `@salla.sa/twilight-theme-engine` handles cart operations, checkout transitions, authentication, multilingual routing, and server-side data fetching.
2. **What You Customize:**  
   Look & feel, layouts (`ThemeLayout`), custom home blocks (`registerHomeComponents`), component overrides (`registry.register` & `registry.override`), and merchant dashboard settings in `twilight.json`.
3. **Route Paths:**  
   Store routes must start with the locale parameter: `createFileRoute('/{-$locale}/path')`.
4. **Imports Convention:**  
   Always use narrow public subpath imports:
   * `@salla.sa/twilight-theme-engine/hooks/useStore`
   * `@salla.sa/twilight-theme-engine/product`
   * `@salla.sa/twilight-theme-engine/common`
   * `@salla.sa/twilight-components-react/<tag>` (e.g. `/slider`, `/notifications`, `/user-menu`)
5. **RTL Support:**  
   Arabic is the first-class language. Use logical CSS properties (`ms-*`, `ps-*`, `text-start`, `border-s-*`) instead of hardcoded left/right.

---

## 4. How to Develop & Test

* **Run Dev Server:**
  ```bash
  cd salla-react-theme
  salla theme dev
  ```
  *(Runs local Vite server with hot reload at `http://localhost:5173/`)*

* **Type Check:**
  ```bash
  pnpm typecheck
  ```

* **Verify Manifest (`twilight.json`):**
  ```bash
  pnpm check:manifest
  ```

* **Build Production Bundle:**
  ```bash
  pnpm build
  ```


## 5. Generic Store presentation layer (2026-10-26)

- `components/layout/Header.tsx` owns the default layout's three desktop rows; the drawer/search/cart/account integrations stay engine-backed. Lite layout and the existing mobile navigation remain supported.
- `components/layout/ThemeFooter.tsx` is a thin wrapper around the public engine Footer, styled in `04-components/footer.scss`. It is not an engine fork.
- `components/home/EnhancedSlider.tsx` owns the split hero; `04-components/storefront.scss` controls its responsive geometry and service cards. Import it in full CSS and home critical CSS together. Keep router placeholder heights aligned with `--store-hero-height`.
- `components/home/StoreFeatures.tsx` consumes merchant-authored features; it does not supply store-policy claims. Feature descriptions accept `description` and legacy `text`.
- Run tests with Node 24 or another supported current runtime. The installed jsdom/undici combination fails before React tests start under system Node 23. The desktop app's bundled Node runtime is available through `load_workspace_dependencies`.


## 6. Final HTML reference refresh (2026-10-26)

- The active reference is now `docs/inspiration/generic store-tailwindcss-final/`. It contains plain HTML, SCSS, compiled CSS and scripts rather than Astro sources. Its hero/service images and Dubai font files match the assets already copied into `public/`.
- HeaderTopnav renders contacts and store switchers; footer-menu links remain in the Footer. Search is a single field with no category selector. Only the navigation Categories trigger opens HeaderNav; see UI_DECISIONS.md (explicit user decision).
- ProductPage adds `store-product` / `store-product__details` presentation classes; ProductDetails labels the live price row with `store-product__price`. Existing product data, options, stock logic and hooks stay in their original components.
- TestimonialsCarousel sets its two decorative public image URLs through React's `style` prop. Avoid placing those URLs in the shared inline critical stylesheet: Vite 8's SSR public-asset transform failed for that combination. Other decoration rules remain in `storefront.scss`.
- `footer_is_dark` defaults to false in twilight.json; the local preview was aligned to that default for review. The dark variant remains styled and configurable.

## 7. Reference product cards and interactions (2026-10-26)

- `ProductCard.tsx` now owns its React markup. Register and override `product:card` in `router.tsx`; do not nest the engine card inside this override. Home blocks and engine lists resolve the same design. The old DOM hiding/portal insertion into engine card nodes has been removed.
- `reference-card.scss` owns card, quick-view and comparison styles; `storefront.scss` no longer duplicates those selectors. Card content uses real ratings, category, sale prices and option values. Unrated products show empty stars; products without color options have no fabricated swatches.
- Listing products may omit full options. Cards fetch `product.queries.detail(id)` on visibility for known option products, and on focus/hover or quick view. React Query shares cached details between repeated cards.
- `ProductOverlay` supplies focus restoration, focus containment, Escape/backdrop close and shared scroll locking. Quick view renders the existing `AddToCartForm`, including Salla option validation, attachments, quantities, booking and cart flow. `useProduct(initial, {isPreview})` keeps its price/stock current after option selection. Card swatches preview the option/image; purchase selections and validation live in the native form. Pass a cloned options array to the mutable widget and use its public `seedSelectedOptions` method for merchant defaults.
- `ProductCompareProvider`, mounted once by `ThemeLayout`, holds up to four products for the current storefront session. Its tray opens a real comparison table and removes selected products. Comparison is local presentation state; wishlist/cart remain Salla-backed.
- `ReferenceIcon` and `public/fonts/reference-icons.css` use the rounded icon font copied from the current reference. Static Dubai CSS is loaded in the document head so typography is available before deferred full CSS. Preserve the native web-component `[hidden]` state when styling slotted account triggers.
- The native cart summary's click is routed with the public `useNavigate('/cart')` hook so it opens the engine cart route in the local preview as well as production.
- Empty hero/testimonial blocks stay empty. CTA buttons require both merchant text and a destination; never add `#` actions or invented customer testimonials as defaults.

- Wishlist buttons render a stable disabled placeholder through SSR/hydration, then mount the public engine wishlist hook. Engine 1.0.133 still returns a fresh server snapshot array; keep this browser subscription out of the server-rendered card. The native booking hook also recognizes `.gs-card` / `.gs-quick-view`.
- CartPage gates `cart.queries.currentId()` on `whenSallaReady`, subscribes through `onSallaEvent`, and invalidates both current ID and detail after mutations. This avoids resolving an absent SDK as an empty cart.

## 8. Video hero and product page fixes (2026-10-27)

- `EnhancedSlider` selects presentation per slide: `.store-hero--video` uses a full-cover media layer and overlay copy; non-video slides retain the split circle. Keep this geometry for posters and reduced-motion rendering too. The overlay respects `without_overlay`.
- `ProductWishlistButton` supplies the product page's title/gallery hearts. Like the card's wishlist control, it mounts the engine subscription only after hydration and renders a matching disabled placeholder during SSR.
- ProductGallery uses a keyed `SallaSlider` rather than physically moving a React-owned custom element. ProductDetails and AddToCartForm both consume `useProduct`'s live product, so variant price/availability remain consistent.

## 9. New image-reference presentation (2026-10-27)

- Current art direction is documented in DESIGN_SYSTEM.md and comes from the two top-level JPG references in `docs/inspiration/`, superseding the old blue/gray defaults.
- `04-components/inspiration-refresh.scss` loads last in full, home-critical and product-critical styles. Keep its shared tokens aligned across loading phases. It uses merchant primary/secondary colors rather than freezing the accent in component CSS.
- ProductCard renders its one wishlist control in `.gs-card__save` over the image; the existing contextual tray retains quick view, compare and cart. Do not duplicate the wishlist subscription when changing the tray.
- Still-image hero decoration now uses CSS organic silhouettes. Video playback, merchant color overrides and reduced-motion posters retain the same implementation.

## 10. Hero handover and account ownership (2026-10-27)

- EnhancedSlider's SSR poster is removed by afterInit **or** the first real slide media becoming ready. YouTube's playing state and the file video's playing event also release it. Never rely exclusively on a client web component's one-time init event, which can precede listener attachment. The poster is pointer-transparent except for its CTA.
- Header uses public useUser to supply only a guest login slot; authenticated avatars and menu triggers are owned by SallaUserMenu. Do not mount both login-btn and trigger slots simultaneously.

## 11. Header and panel consistency (2026-10-27)

Read UI_DECISIONS.md before editing the header or panels. The search category selector is removed from markup and CSS and must not be restored. Account/cart share --store-control-size and --store-control-icon. Submenus, native modal shells and theme overlays share warm panel tokens in inspiration-refresh.scss, without changing native interaction contracts. The authentication iframe remains provider-owned.



## Product experience refinement — 2026-11-01

ProductOverlay owns a fixed header and focus-contained scrolling body; children must not assume they are direct dialog descendants. product-experience.scss is loaded by full and product critical styles. AddToCartForm owns the native gifting disclosure. ProductCard.productFacts exposes only provided weight or named material/dimension/size options. ProductPage keeps SallaComments as the review authority, inside a translated product-reviews section; styling does not replace SDK data, permissions, sorting or pagination.
