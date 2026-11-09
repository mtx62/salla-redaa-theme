import { describe, it, expect, vi } from 'vitest';
import { render } from '@testing-library/react';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { ProductPage } from '../../../app/components/product/ProductPage';
const live = vi.hoisted(() => ({ product: undefined as Product | undefined }));
vi.mock('@salla.sa/twilight-theme-engine/hooks/useProduct', () => ({ useProduct: (initial: Product) => ({ product: live.product ?? initial }) }));
vi.mock('@salla.sa/twilight-theme-engine/hooks/useComments', () => ({ useComments: () => ({ commentsKey: 1 }) }));
vi.mock('@salla.sa/twilight-theme-engine/providers', () => ({ useTwilight: () => ({ theme: { settings: {} }, store: { settings: {} } }) }));
vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));
vi.mock('@salla.sa/twilight-theme-engine/hooks', () => ({ HookSlot: () => null }));
vi.mock('@salla.sa/twilight-theme-engine/common', () => ({ Breadcrumb: () => null, RenderWhenVisible: () => null }));
vi.mock('@salla.sa/twilight-theme-engine/home', () => ({ PageBlocks: () => null }));
vi.mock('@salla.sa/twilight-components-react/quick-order', () => ({ SallaQuickOrder: () => null }));
vi.mock('@salla.sa/twilight-components-react/offer', () => ({ SallaOffer: () => null }));
vi.mock('@salla.sa/twilight-components-react/comments', () => ({ SallaComments: () => null }));
vi.mock('../../../app/components/common/BlockHookSlot', () => ({ BlockHookSlot: () => null }));
vi.mock('../../../app/components/home/ProductsSlider', () => ({ ProductsSlider: () => null }));
vi.mock('../../../app/components/product/ProductGallery', () => ({ ProductGallery: () => null }));
vi.mock('../../../app/components/product/ProductDetails', () => ({ ProductDetails: ({ product }: { product: Product }) => <div data-testid="details">{product.price} {product.is_out_of_stock ? 'Unavailable' : 'Available'}</div> }));
vi.mock('../../../app/components/product/AddToCartForm', () => ({ AddToCartForm: ({ product }: { product: Product }) => <div data-testid="purchase-form">{product.price}</div> }));

describe('ProductPage live variant', () => {
  it('keeps the header price and availability synchronized with the purchase form', () => {
    const initial = { id: 1, price: 115, is_out_of_stock: false } as Product;
    live.product = { ...initial, price: 230, is_out_of_stock: true };
    const { getByTestId } = render(<ProductPage product={initial} page={{} as never} />);
    expect(getByTestId('details').textContent).toBe('230 Unavailable');
    expect(getByTestId('purchase-form').textContent).toBe('230');
  });
});
