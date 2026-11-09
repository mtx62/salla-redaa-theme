# Storefront UI decisions — 2026-10-27

These decisions reflect explicit user requests. Read this with DESIGN_SYSTEM.md before changing header, menu or dialog presentation.

## Search has no category selector

**Do not restore a category selector inside the header search.** Remove its markup rather than hiding it at a breakpoint. The search field has one purpose: open native Salla search. Categories have their dedicated navigation/drawer trigger (`.site-header__categories`).

The removed `.site-header__search-category` must not return from older HTML references, historical changelog entries, upstream starter updates or screenshots. There are no remaining CSS rules for it. Header.test.tsx verifies its absence and the continued presence of the navigation category trigger.

## Header icons are one family and one control system

- ReferenceIcon supplies the local rounded icon family for guest account, cart and search; do not mix the engine's fallback cart icon with a custom account icon.
- Account and cart share a 44px circular control, 22px icon, 1px warm border, the same ink color and hover/focus treatment. The cart count sits outside the circle without changing the icon's center.
- Guests get exactly one custom login slot. Signed-in customers use the native user-menu avatar, sized inside the same control. Never mount custom trigger and login slots together.
- Keep responsive visibility rules: do not expose hidden native fallback slots or mobile-only controls.

## Panels belong to the same design system

Submenus, account menus, native modal shells, theme quick view/comparison, navigation drawer and bottom sheets use warm paper, ink text, warm dividers and the merchant accent. Panel corners use --store-panel-radius (8px), with a restrained plum-tinted shadow. Hover states use deep paper. Close controls use the same bordered circular language as the header. Backdrops use one warm translucent tone.

Preserve existing positioning, menu overflow measurement, nested-panel placement, focus containment, Escape/backdrop dismissal, scroll locking, RTL and native validation. Styling must not replace Salla workflows.

Salla authentication content is hosted in a cross-origin accounts.salla.com iframe. The theme controls its outer modal shell and close/backdrop styling; the provider owns the iframe's internal form. Do not recreate the authentication form or inject styles into that iframe.

## Source of truth

- Header markup: app/components/layout/Header.tsx
- Current presentation: app/styles/04-components/inspiration-refresh.scss
- Native menu geometry: app/styles/04-components/header.scss
- Shared theme overlay behavior: app/components/product/ProductOverlay.tsx
- Design palette and references: docs/DESIGN_SYSTEM.md

Validate search opening, the category drawer, guest login, cart routing, submenu hover/keyboard access and dialog open/close after changes.

## Preserve the established header and footer — 2026-10-28

The user rejected the oversized store-name footer, added contact sign-off, pill search and enlarged header/navigation. Retain the previous component hierarchy, proportions and all merchant data. Improvements must follow the established design tokens and preserve descriptions, contact details, links, apps, social, trust/tax and payments. Do not replace the footer with a reduced brand composition or introduce a new visual direction without a specific request.


## Product page surfaces and image viewer — 2026-10-31

The user requested removal of unrelated gray/white blocks around the brand, repeated price, gifting tile and product options. These belong to the continuous paper surface. Controls retain warm borders and an accent focus/selected state. Show the main details price once; only the floating mobile purchase bar repeats it for context while buying. Keep that fixed bar opaque. The browser image lightbox uses the same paper and circular control treatment as the theme; retain image/video navigation and the native-app gallery bridge.


## Absent ratings — 2026-11-01

The user does not want decorative empty stars or a no-reviews label. Omit the rating row in cards, quick view and product details unless both rating.stars and rating.count are positive. A comment count alone does not prove that a star rating exists. Keep actual customer comments. This supersedes the earlier suggestion to show no-reviews text.

## Search dialog and JoyParty inspiration — 2026-11-01

Per user request on 2026-11-01:
1. **Search dialog restored:** The user requested the original, clean search dialog from before. All artificial theme color overrides (`var(--store-paper)` tinting) on `.s-search-modal` have been removed, restoring Salla's crisp native white search modal with clean contrast and chips. Do not re-tint the search modal.
2. **Floating capsule header and island footer:** The header and footer layout is inspired by the newly provided `docs/inspiration/header.png` (floating white capsule island with rounded orange search button tab and peach circular social pills) and `docs/inspiration/footer.png` (floating white island card with 28px rounded corners, airy 4-column structure, and centered copyright outside the card).
