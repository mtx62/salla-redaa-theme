import { useWishlist } from '@salla.sa/twilight-theme-engine/hooks/useWishlist';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { useHydrated } from '../../hooks/useHydrated';
import { WishlistHeartButton } from './WishlistHeartButton';

interface Props { productId: number; gallery?: boolean }

/** Keep the engine's browser wishlist subscription out of the hydration pass. */
export function ProductWishlistButton(props: Props) {
  const hydrated = useHydrated();
  return hydrated ? <ConnectedWishlist {...props} /> : <WishlistView {...props} disabled />;
}

function ConnectedWishlist(props: Props) {
  const wishlist = useWishlist();
  return <WishlistView {...props} added={wishlist.has(props.productId)} onClick={() => { void wishlist.toggle(props.productId); }} />;
}

function WishlistView({ productId, gallery, added = false, disabled = false, onClick = () => {} }: Props & { added?: boolean; disabled?: boolean; onClick?: () => void }) {
  const { t } = useTranslation();
  const label = t('pages.products.add_to_wishlist', 'Add to wishlist');
  const state = added ? 'is-added' : 'not-added';
  if (gallery) return <button type="button" className={`product-gallery__bar-btn btn--wishlist ${state}`} data-id={productId} disabled={disabled} aria-label={label} aria-pressed={added} onClick={onClick}><i className="sicon-heart" aria-hidden="true" /></button>;
  return <WishlistHeartButton productId={productId} className={`btn--wishlist animated hidden sm:inline-flex ${state}`} onClick={onClick} ariaLabel={label} disabled={disabled} pressed={added} />;
}
