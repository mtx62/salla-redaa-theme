# Generic Store reference review — 2026-10-26

Reference: `docs/inspiration/generic store-tailwindcss-final/index.html` and its assets/SCSS.
Preview: `http://localhost:5173/dev-vgckq3fssfhjewwi/ar`.

## Geometry and typography

Measured at a 1440px viewport in the browser:

| Element | Reference | Theme | Result |
| --- | --- | --- | --- |
| Desktop top strip | 40px | 40px | Matched |
| Desktop logo/search row | 88px | 88px | Matched |
| Desktop navigation row | 56px | 56px | Matched |
| Wide header container | 1320px | 1320px | Matched |
| Segmented search | 600 × 48px | 600 × 48px | Matched |
| Desktop hero height | 720px | 720px | Matched |
| Product image | Square, 10px radius, 1px border | Same | Matched |
| Product title | 15px, weight 600 | Same | Matched |
| Product actions | Four rounded icon controls, 35px | Same on desktop; 32px on small screens | Adapted for touch |

Dubai font and the rounded reference icon font are local assets. The product card is React markup owned by the theme; it no longer rearranges or hides nodes in the engine card. At a 390px viewport, document width remained 390px with no horizontal overflow. The mobile header has a logo/category row and a full-width search row.

Store logo, product photos, texts, prices, options and page blocks remain merchant data. The reference's example fashion inventory, promotions and customer testimonials are not substituted into the live store. Consequently content and section lengths differ from the static reference.

## Interactions

| Interaction | Verification |
| --- | --- |
| Search | Opens the Salla search dialog with its search input and trending data. |
| Navigation category trigger | Opens the controlled theme navigation drawer; close works. The search category selector was explicitly removed; do not restore it (see UI_DECISIONS.md). |
| Guest account | Opens the real Salla login modal. No credentials or OTP were submitted. |
| Header cart | Routes to the locale-aware local cart page using the public engine navigation hook. |
| Wishlist | Public engine hook, numeric product IDs; SSR placeholder avoids the engine 1.0.129 unstable server snapshot. Covered by interaction and SSR regression tests. |
| Product colors | Real detail data loads for option products; selectable color controls and disabled unavailable values render on the actual preview products. |
| Quick view | Loads full product data and the existing Salla options/add-to-cart form, including attachments and quantity. Escape/close and retry paths covered by tests. |
| Comparison | Adding two real preview products opens a table with their names, prices, categories, availability and review state. Removal/close covered by tests. |
| Simple add to cart | Native Salla button succeeds; real success toast and a one-item cart summary were observed. |

## Remaining preview issue: cart session after navigation

The complete cart journey is **not verified as passing**. After successful native addition, navigating to the cart in this local demo preview returns an empty cart. A temporary development-only diagnostic called the SDK's own cart details API after SDK readiness; it also returned a cart with zero items. The diagnostic code has been removed. The theme does not replace the SDK session, manufacture cart items, or cache a previous cart as if it were current.

CartPage now waits for `whenSallaReady` before querying the cart ID, and subscribes through `onSallaEvent` so early hydration cannot skip subscriptions. A regression test covers the readiness race. These fixes did not resolve the observed session loss after navigation; the demo/SDK session path needs further investigation or verification in the connected storefront environment.

## Automated verification

- Production build: passed.
- TypeScript: passed.
- Tests: 442 passed in 54 files.
- Manifest: 0 errors, 0 warnings.
- `git diff --check`: passed.

Use supported Node 24 for these checks. Dependency sourcemap/performance warnings remain build-tool warnings, not failed checks.

Final native-options check (2026-10-27): card color/image preview and the native purchase form are independent. The form loads all required options from Salla and validates them there. The options widget receives cloned data and seeds merchant defaults after mounting; its mutation cannot alter the product-query cache.

Live native-form verification: selecting the black variant on the preview chair retained its checked radio state and changed the quick-view price from SAR 115 to SAR 230 through `useProduct`. Saved desktop card, desktop header, mobile header and quick-view screenshots in the task visualization output. Restored the browser viewport after responsive testing.

## Header and panel consistency — 2026-10-27

Account/cart verified at 44×44px, 22px icons. Search category markup and CSS are absent; category navigation remains in its independent drawer trigger. Native search opens with its query input and suggestions. Keyboard focus opens the desktop submenu. Theme quick view and native login open/close with warm panel shells. The Salla-hosted authentication iframe retains provider styling. See UI_DECISIONS.md for the protected decisions.
