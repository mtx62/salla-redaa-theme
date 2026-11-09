# Current Design System — Image Reference Refresh

The active direction comes from the two images added in `docs/inspiration/`:

- `8872bacf7d1e94658d79d972b38aa1be.jpg`: warm cream paper, orange display type, generous whitespace, rectangular photography and fine section rules.
- `bbe687878ea2919e64f7252ada0a4c1f.jpg`: soft peach, organic silhouettes, curved transitions and expressive hero scale.

The older Generic Store HTML remains an interaction reference. Its blue/gray palette and circular leaf hero are superseded by this direction.

## Color and typography

| Token | Default | Purpose |
| --- | --- | --- |
| Primary | `#c84b20` | Burnt orange actions, links, selected states |
| Primary dark | `#ab3813` | Hover/pressed fallback |
| Secondary / ink | `#493039` | Warm plum headings and strong text |
| Paper | `#fff9ed` | Continuous page surface |
| Deep paper / top strip | `#f4e8d6` | Tonal section and image backgrounds |
| Peach | `#efd0c0` | Organic hero silhouette |
| Muted text | `#79675d` | Secondary copy |
| Fine rule | `#dfcfbc` | Dividers and control borders |

Continue using the self-hosted Dubai family (400/500/700) for Arabic and Latin. Display headings use a balanced line wrap, 48–94px on desktop and 36–56px on mobile. Section titles are 28–44px; product card titles 19px desktop / 16px mobile. Do not add letter spacing to Arabic body copy.

## Presentation and implementation

`app/styles/04-components/inspiration-refresh.scss` owns the current presentation and loads after legacy component styles in both full and critical stylesheets. Shared default colors stay synchronized in `app.css`, `critical.scss` and `01-settings/global.scss`.

- Header: warm paper, 38px utility/announcement strip with live ticker and interactive contact chips, 88px main row with tactile pill search capsule (`⌘K`) and 44px circular action controls, and 52px elevated navigation with an accented "تصفح الأقسام" pill button. Search contains **no category selector** (strictly adhering to UI_DECISIONS.md). Categories open through the navigation drawer trigger.
- Hero: larger start-aligned copy; still-image slides use peach organic shapes, replacing the floating leaf images and dashed circle. Still photographs fill and are clipped into the organic silhouette, with a subtle peach backing and offset contour; do not restore rectangular contained images over the shape. Video slides retain full-cover playback behind readable white copy. Merchant title/subtitle color overrides remain honored. A shallow curved paper edge joins the hero to the page.
- Sections: warm continuous surface, generous vertical rhythm, large titles and a fine divider. No fabricated headings, claims or promotions.
- Products: portrait-leaning photography by default, 3px image corners, persistent wishlist heart at the top end, contextual quick view/compare/cart tray. Merchant image-ratio choices remain honored. Ratings, prices, swatches and sizes use real data.
- Category links: rectangular images with orange captions, inspired by the second image.
- Services: simple separated columns rather than bordered floating cards.
- Product detail: larger title, warm gallery surface, existing native options and live prices.
- Footer: warm paper layers with wave mask entrance, an architectural 4-pillar brand guarantees ribbon (Delivery, Guarantee, Exchange, Support), interactive contact chips, elevated social pills, and a dedicated scroll-to-top control. Merchant dark-footer choice remains available.

## Merchant settings and interaction

`theme_color_primary`, `theme_color_secondary` and `theme_top_header_bg` continue to control the merchant colors. The new defaults are declared in `twilight.json` and mirrored in the local preview. The top strip now defaults to light (`topnav_is_dark: false`); merchants can retain the dark variant.

Wishlist appears once per card and uses the public engine hook after hydration. Other actions appear on hover/focus and remain visible on touch. Preserve visible focus rings, overlay focus handling, disabled options and reduced-motion behavior. Existing merchant copy, logo and media are retained, so actual store imagery determines the final visual content.

## Wave language

Use flowing shallow wave transitions at hero, testimonial and light-footer boundaries. Inside static hero photographs, two translucent peach/accent waves are clipped by the existing organic mask. A tonal wave also sits behind the hero copy. Keep overlays away from the main subject and copy, pointer-transparent, static and responsive. `--store-wave-mask` is shared between these treatments.

## Shared panels and protected decisions

Submenus, account menus, dialog shells, quick view/comparison, bottom sheets and the navigation drawer use the same warm paper, ink text, warm borders and accent focus states. Panel radius is 8px and shadow is --store-panel-shadow. See [UI_DECISIONS.md](UI_DECISIONS.md) for explicit user decisions, especially the prohibition on restoring category selection inside search and the shared header icon geometry.

The 2026-10-31 header.png/footer.png experiment was rejected by the user and reverted. Keep the established header and footer described above.
