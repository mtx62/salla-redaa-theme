import { lazy, Suspense, useEffect, useRef, useState, type CSSProperties } from 'react';
import { useQuery } from '@tanstack/react-query';
import type { ProductCardProps } from '@salla.sa/twilight-theme-engine/product';
import type { Product, ProductOption } from '@salla.sa/twilight-theme-engine/types';
import { product as productApi } from '@salla.sa/twilight-theme-engine/api/product';
import { Image, Link } from '@salla.sa/twilight-theme-engine/common';
import { useProduct } from '@salla.sa/twilight-theme-engine/hooks/useProduct';
import { useMoney } from '@salla.sa/twilight-theme-engine/hooks/useMoney';
import { useWishlist } from '@salla.sa/twilight-theme-engine/hooks/useWishlist';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import { SallaAddProductButton } from '@salla.sa/twilight-components-react/add-product-button';
import { ReferenceIcon } from '../common/ReferenceIcon';
import { useHydrated } from '../../hooks/useHydrated';
import { registerNativeBookingHook } from '../../lib/nativeBooking';
import { useProductCompare } from './ProductCompare';
import { ProductOverlay } from './ProductOverlay';

const QuickBuyForm = lazy(() => import('./AddToCartForm').then((module) => ({ default: module.AddToCartForm })));

export function ProductStars({ product }: { product: Product }) {
  const { t } = useTranslation();
  if (!(Number(product.rating?.count) > 0 && Number(product.rating?.stars) > 0)) return null;
  const stars = Math.min(5, Number(product.rating!.stars));
  return <span className="gs-card__rating" role="img" aria-label={`${t('blocks.card.rating', 'Rating')}: ${stars} / 5 (${product.rating!.count})`}>
    <span aria-hidden="true" className="gs-card__stars-empty">★★★★★</span>
    <span aria-hidden="true" className="gs-card__stars-filled" style={{ width: `${stars * 20}%` }}>★★★★★</span>
  </span>;
}

/** Only list facts supplied by the merchant; never infer materials from photographs. */
export function productFacts(product: Product): string[] {
  const facts: string[] = [];
  const weight = product.weight?.trim();
  if (weight) facts.push(weight);
  for (const option of product.options ?? []) {
    if (!/^(material|dimensions?|size|الخامة|المادة|المقاس|الأبعاد|الابعاد)$/i.test(option.name.trim())) continue;
    const values = [...new Set((option.details ?? option.values ?? []).map(value => value.name?.trim()).filter(Boolean))];
    if (values.length) facts.push(`${option.name}: ${values.slice(0, 3).join(' / ')}${values.length > 3 ? '…' : ''}`);
  }
  return facts.slice(0, 2);
}

export function ProductCardPrice({ product }: { product: Product }) {
  const { format } = useMoney();
  const { t } = useTranslation();
  const price = product.is_on_sale ? product.sale_price ?? product.price : product.starting_price ?? product.price;
  return <div className="gs-card__price">
    {product.starting_price != null && !product.is_on_sale && <small>{t('pages.products.starting_price', 'From')}</small>}
    <strong>{format(price, { currency: product.currency })}</strong>
    {product.is_on_sale && Number(product.regular_price) > Number(price) && <del>{format(product.regular_price, { currency: product.currency })}</del>}
  </div>;
}

/** The engine wishlist's server snapshot is unstable in 1.0.129. Mount its
 * browser subscription after hydration, retaining the same SSR button space. */
function WishlistAction({ productId }: { productId: number }) {
  const hydrated = useHydrated();
  const { t } = useTranslation();
  if (!hydrated) return <button type="button" disabled aria-label={t('pages.wishlist.toggle', 'Add or remove to wishlist')}><ReferenceIcon name="heart" /></button>;
  return <WishlistControl productId={productId} />;
}
function WishlistControl({ productId }: { productId: number }) {
  const wishlist = useWishlist();
  const { t } = useTranslation();
  const label = t('pages.wishlist.toggle', 'Add or remove to wishlist');
  return <button type="button" aria-label={label} title={label} aria-pressed={wishlist.has(productId)} data-id={productId} onClick={() => wishlist.toggle(productId)}><ReferenceIcon name="heart" /></button>;
}

/** Only expose real option values. Never make up swatches for products without colors. */
export function cardChoices(options: ProductOption[] = []) {
  return options.filter((option) => ['color', 'thumbnail', 'radio', 'select', 'single-option'].includes(option.type)).map((option) => ({
    id: option.id,
    name: option.name,
    type: option.type,
    values: (option.details ?? option.values ?? []).map((value) => {
      const detail = value as typeof value & { color?: string; option_value?: string; is_out?: boolean; image_url?: string };
      const candidate = detail.color || detail.option_value || detail.image || '';
      return {
        id: value.id,
        name: value.name,
        color: /^#(?:[0-9a-f]{3}|[0-9a-f]{4}|[0-9a-f]{6}|[0-9a-f]{8})$/i.test(candidate) ? candidate : undefined,
        image: /^https?:\/\//.test(detail.image_url || detail.image || '') ? detail.image_url || detail.image : undefined,
        unavailable: Boolean(detail.is_out),
      };
    }),
  })).filter((option) => option.values.length);
}

/** Reference-owned markup; all store actions go through the public Salla APIs. */
export function ProductCard({ product, layout = 'vertical', className = '', withoutAddButton, imagePriority, sizes, withQuantity }: ProductCardProps) {
  const { t } = useTranslation();
  const { theme } = useTwilight();
  const compare = useProductCompare();
  const root = useRef<HTMLElement>(null);
  const [enrich, setEnrich] = useState(false);
  const [quickView, setQuickView] = useState(false);
  const [selection, setSelection] = useState<Record<number, number>>({});
  const [previewImage, setPreviewImage] = useState<string>();
  const query = useQuery({ ...productApi.queries.detail(String(product.id)), enabled: enrich || quickView, staleTime: 300_000 });
  const detail = !query.isPlaceholderData ? query.data : undefined;
  const current = detail || product;
  const choices = cardChoices(current.options);
  const inCompare = compare.products.some((item) => Number(item.id) === Number(product.id));
  useEffect(() => { registerNativeBookingHook(); }, []);
  useEffect(() => {
    if (!product.has_options || product.options?.length || !root.current || typeof IntersectionObserver === 'undefined') return;
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setEnrich(true); observer.disconnect(); }
    }, { rootMargin: '120px' });
    observer.observe(root.current);
    return () => observer.disconnect();
  }, [product.id, product.has_options, product.options?.length]);
  const openQuickView = () => { setEnrich(true); setQuickView(true); };
  const requiresForm = Boolean(current.has_options || current.options?.length || ['booking', 'donating', 'financial_support', 'group_products'].includes(current.type) || current.can_add_note || current.can_upload_file || current.has_custom_form);
  const status = current.is_out_of_stock && theme?.settings?.notify_when_available_in_card !== false ? 'out-and-notify' : current.status;
  const badge = typeof current.preorder?.label === 'string' ? current.preorder.label : current.promotion_title;
  return <>
    <article ref={root} className={`gs-card gs-card--${layout} ${className}`} onMouseEnter={() => setEnrich(true)} onFocus={() => setEnrich(true)}>
      <div className="gs-card__image">
        <Link to={product.url} className="gs-card__image-link" aria-label={product.name}>
          <Image src={previewImage || current.image?.url} alt={current.image?.alt || product.name} width={600} height={600} sizes={sizes || '(min-width: 1200px) 320px, (min-width: 640px) 33vw, 50vw'} priority={imagePriority} className="gs-card__photo" />
        </Link>
        {badge && <span className="gs-card__badge">{badge}</span>}
        {withQuantity && current.quantity != null && current.quantity > 0 && <span className="gs-card__quantity">{t('pages.products.remained', 'Remaining')}: {current.quantity}</span>}
        <div className="gs-card__save"><WishlistAction productId={Number(product.id)} /></div>
        <div className="gs-card__actions">
          <button type="button" aria-label={t('blocks.card.quick_view', 'Quick view')} title={t('blocks.card.quick_view', 'Quick view')} onClick={openQuickView}><ReferenceIcon name="eye" /></button>
          <button type="button" aria-label={t('blocks.card.compare', 'Compare products')} title={t('blocks.card.compare', 'Compare products')} aria-pressed={inCompare} onClick={() => compare.toggle(current)}><ReferenceIcon name="arrows-repeat" /></button>
          {!withoutAddButton && (requiresForm ? <button type="button" aria-label={t('blocks.card.choose_options', 'Choose options')} title={t('blocks.card.choose_options', 'Choose options')} onClick={openQuickView}><ReferenceIcon name="shopping-basket" /></button> :
            <SallaAddProductButton productId={product.id} productStatus={status} productType={product.type} hasPreOrder={product.has_preorder_campaign} fill="outline" className="gs-card__add" aria-label={t('pages.products.add_to_cart', 'Add to cart')}>
              <ReferenceIcon name="shopping-basket" /><span className="sr-only">{current.is_out_of_stock ? t('blocks.card.notify', 'Notify me') : t('pages.products.add_to_cart', 'Add to cart')}</span>
            </SallaAddProductButton>)}
        </div>
      </div>
      <div className="gs-card__content">
        <div className="gs-card__meta">
          {current.category?.name ? (
            <Link to={current.category.url || product.url}>{current.category.name}</Link>
          ) : (
            <span>{current.subtitle || ''}</span>
          )}
          <ProductStars product={current} />
        </div>
        <h3><Link to={product.url}>{product.name}</Link></h3>
        {!current.donation?.can_donate && <ProductCardPrice product={current} />}
        {productFacts(current).length > 0 && <ul className="gs-card__facts">{productFacts(current).map(fact => <li key={fact}>{fact}</li>)}</ul>}
        {choices.length > 0 && <div className="gs-card__choices">{choices.slice(0, 2).map((option) => <div key={option.id} className="gs-card__option" role="group" aria-label={option.name}>
          {option.values.slice(0, 6).map((value) => <button key={value.id} type="button" className={value.color ? 'gs-card__swatch' : 'gs-card__size'} style={value.color ? { '--swatch-color': value.color } as CSSProperties : undefined} disabled={value.unavailable} aria-label={`${option.name}: ${value.name}`} title={value.name} aria-pressed={selection[option.id] === value.id} onClick={() => { setSelection((values) => ({ ...values, [option.id]: value.id })); if (value.image) setPreviewImage(value.image); }}>
            {value.color ? <span /> : value.name}
          </button>)}
        </div>)}</div>}
      </div>
    </article>
    {quickView && <ProductOverlay title={t('blocks.card.quick_view', 'Quick view')} onClose={() => setQuickView(false)} className="gs-quick-view">
      <QuickView product={current} detailReady={Boolean(detail)} pending={query.isPending || query.isFetching} error={query.isError} retry={() => { void query.refetch(); }} />
    </ProductOverlay>}
  </>;
}

function QuickView({ product: initialProduct, detailReady, pending, error, retry }: { product: Product; detailReady: boolean; pending: boolean; error: boolean; retry: () => void }) {
  const { t } = useTranslation();
  const { product } = useProduct(initialProduct, { isPreview: !detailReady });
  const [imageIndex, setImageIndex] = useState(0);
  const images = product.images?.length ? product.images.filter((image) => image.url) : [product.image];
  // The form keeps Salla's own option validation, prices, stock and booking flow.

  return <div className="gs-quick-view__grid">
    <div className="gs-quick-view__gallery">
      <img src={images[imageIndex]?.url || product.image?.url} alt={product.name} width={600} height={600} />
      {images.length > 1 && <div className="gs-quick-view__thumbs">{images.map((image, index) => <button type="button" key={image.id || image.url} aria-label={`${t('blocks.home.slider_page', 'Slide')} ${index + 1}`} aria-pressed={index === imageIndex} onClick={() => setImageIndex(index)}><img src={image.url} alt="" width={60} height={60} /></button>)}</div>}
    </div>
    <div className="gs-quick-view__details">
      <h2>{product.name}</h2><ProductStars product={product} /><ProductCardPrice product={product} />
      {error ? <div role="alert"><p>{t('blocks.card.load_error', 'Could not load product options')}</p><button type="button" className="gs-action-primary" onClick={retry}>{t('blocks.card.retry', 'Try again')}</button></div> : !detailReady || pending ? <p role="status">{t('blocks.card.loading', 'Loading product…')}</p> : <Suspense fallback={<p role="status">{t('blocks.card.loading', 'Loading product…')}</p>}><QuickBuyForm product={product} stickyAddToCart={false} /></Suspense>}
      <Link className="gs-quick-view__link" to={product.url}>{t('blocks.card.full_details', 'View full details')}<ReferenceIcon name="angle-small-right" aria-hidden="true" /></Link>
    </div>
  </div>;
}
