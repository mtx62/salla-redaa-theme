# Twilight weekly compatibility review — 2026-10-30

Reviewed the Salla Partners email dated 2026-10-29 against the official changelog:
https://docs.salla.dev/888746f0

All five releases (2.0.304, 2.0.310, 2.0.311, 2.0.312, 2.0.314) explicitly require no developer action. They are SDK/component release identifiers, not versions of the React theme-engine npm package. Do not set an npm engine version or a CDN override to 2.0.314 based on this email.

## Applied changes

- Updated `@salla.sa/twilight-theme-engine` from installed 1.0.133 to 1.0.139.
- Updated `@salla.sa/twilight-components-react` from installed 3.0.12 to 3.0.17.
- Updated pnpm-lock.yaml. Retained unrelated work already present in the checkout.
- Compared the shipped tailwind source copies between engine 1.0.133 and 1.0.139: ProductListPage, useAppliedFilters, CartPage, ProductPage, ProductDetails, ProductGallery and AddToCartForm are byte-identical. No manual fork merge was needed.
- Engine 1.0.139 recognizes `page::view` / `route::changed` listeners in its snippet compatibility analysis. Kept navigation and snippet lifecycle engine-owned.

## Compatibility assessment

| Release | Theme evidence and decision |
| --- | --- |
| 2.0.314 | AddToCartForm uses the public SallaMultipleBundleProduct wrapper. No theme-specific bundle-section height override was found. Keep accordion behavior provider-owned. Mobile expansion still needs live-store verification. |
| 2.0.312 | CartPage waits for SDK readiness and obtains the current cart via cart.queries.currentId(); the engine delegates to salla.cart.api.getCurrentCartId(). No custom guest-cart creation path was found. Retain SDK ownership; do not add an additional cart-creation request. |
| 2.0.311 | The custom listing uses ItemsList and useAppliedFilters, not the affected component's category-filter implementation. Both filtered queries and infinite-scroll requests retain source.type/source.value. Sorting preserves existing URL query parameters. No compensating category/search patch is required from the source review. |
| 2.0.310 | Router comes from the public engine createRouter and dispatches route::changed. The SDK derives page::view from that event. No theme-owned one-time page snippet or visitor-ID tracker was found. Do not manually redispatch page::view, add another tracker or bypass consent. |
| 2.0.310 / 2.0.304 | Free-shipping copy and icon ordering remain with Salla components. No theme-owned English fallback text or free-shipping-tag icon ordering override was found. |

Official event behavior: https://docs.salla.dev/twilight/react/recipes/run-app-code-on-a-page
`page::view` replays the current page for late subscribers and follows client navigation; a new filter or sort on the same page is not a new page view.

## Verification

- Before upgrade: 28 targeted cart, AddToCartForm and search-query tests passed.
- After upgrade: `pnpm test` — 55 files / 450 tests passed.
- `pnpm build` — passed, including generated route output.
- `pnpm typecheck` — passed after build.
- Existing build output still has theme best-practice and chunk/dynamic-import warnings; package installation reports OpenTelemetry peer-range warnings. These are not reported as resolved by this task.

## Limits and live acceptance checklist

No live storefront browser test or deployment was performed. Unit tests mock SDK boundaries and cannot verify provider-side cart concurrency, cross-browser attribution or cookie-consent behavior.

The engine's fallback SDK release remains 2.14.584; store-provided settings can select a different SDK. No VITE_TWILIGHT_URL or VITE_TWILIGHT_VERSION override was found in local .env files. The weekly 2.0.x release labels cannot safely be translated to an arbitrary 2.14.x CDN pin. The effective SDK on the actual store must be inspected before claiming every provider fix is active there.

On the store, check:
1. Existing guest cart survives reload and simultaneous add-to-cart operations.
2. Search query remains while applying category filters and sorting; pagination stays within those results.
3. Long bundle content expands fully on mobile.
4. An app snippet subscribing late to page::view receives the current page, then one event for each real navigation, without a second manual dispatcher.
5. Free-shipping icon precedes its label in Arabic and English; fallback English copy is readable.
6. Attribution remains consistent across in-app/external browsers and respects the store's consent choices.
