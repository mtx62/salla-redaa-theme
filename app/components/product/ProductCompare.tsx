import { createContext, useContext, useState, type ReactNode } from 'react';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { Link } from '@salla.sa/twilight-theme-engine/common';
import { useMoney } from '@salla.sa/twilight-theme-engine/hooks/useMoney';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { ProductOverlay } from './ProductOverlay';
import { ReferenceIcon } from '../common/ReferenceIcon';

const CompareContext = createContext<{ products: Product[]; toggle: (product: Product) => void }>({ products: [], toggle: () => {} });
export const useProductCompare = () => useContext(CompareContext);

export function ProductCompareProvider({ children }: { children: ReactNode }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [open, setOpen] = useState(false);
  const [limitReached, setLimitReached] = useState(false);
  const { t } = useTranslation();
  const toggle = (product: Product) => {
    const exists = products.some((item) => Number(item.id) === Number(product.id));
    setLimitReached(!exists && products.length >= 4);
    setProducts((items) => exists ? items.filter((item) => Number(item.id) !== Number(product.id)) : items.length < 4 ? [...items, product] : items);
  };
  return (
    <CompareContext.Provider value={{ products, toggle }}>
      {children}
      {products.length > 0 && (
        <aside className="gs-compare-tray" aria-label={t('blocks.card.compare', 'Compare products')}>
          <div className="gs-compare-tray__items">
            {products.map((item) => <button type="button" key={item.id} onClick={() => toggle(item)} aria-label={`${t('blocks.card.remove_compare', 'Remove from comparison')}: ${item.name}`}><img src={item.image?.url} alt="" width={36} height={36} /><ReferenceIcon name="cross" /></button>)}
          </div>
          <button type="button" className="gs-action-primary" onClick={() => setOpen(true)}>{t('blocks.card.compare', 'Compare products')} ({products.length})</button>
          {limitReached && <p role="status">{t('blocks.card.compare_limit', 'Compare up to four products')}</p>}
        </aside>
      )}
      {open && <ProductOverlay title={t('blocks.card.compare', 'Compare products')} onClose={() => setOpen(false)}><CompareTable products={products} /></ProductOverlay>}
    </CompareContext.Provider>
  );
}

function CompareTable({ products }: { products: Product[] }) {
  const { t } = useTranslation();
  const { format } = useMoney();
  const rows = [
    { label: t('blocks.card.price', 'Price'), value: (p: Product) => format(p.is_on_sale ? p.sale_price ?? p.price : p.starting_price ?? p.price, { currency: p.currency }) },
    { label: t('blocks.card.rating', 'Rating'), value: (p: Product) => p.rating?.count ? `${p.rating.stars} / 5 (${p.rating.count})` : t('blocks.card.no_reviews', 'No reviews yet') },
    { label: t('common.titles.categories', 'Categories'), value: (p: Product) => p.category?.name || '—' },
    { label: t('blocks.card.availability', 'Availability'), value: (p: Product) => p.is_out_of_stock ? t('pages.products.out_of_stock', 'Out of stock') : t('blocks.product.in_stock', 'In stock') },
  ];
  return <div className="gs-compare-content"><h2>{t('blocks.card.compare', 'Compare products')}</h2><div className="gs-compare-scroll"><table><thead><tr><th scope="col">{t('blocks.card.details', 'Details')}</th>{products.map((p) => <th scope="col" key={p.id}><img src={p.image?.url} alt="" width={140} height={140} /><Link to={p.url}>{p.name}</Link></th>)}</tr></thead><tbody>{rows.map((row) => <tr key={row.label}><th scope="row">{row.label}</th>{products.map((p) => <td key={p.id}>{row.value(p)}</td>)}</tr>)}</tbody></table></div></div>;
}
