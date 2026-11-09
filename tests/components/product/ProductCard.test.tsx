import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, fireEvent, waitFor, screen } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import type { ReactNode } from 'react';
import type { Product } from '@salla.sa/twilight-theme-engine/types';
import { productFacts, ProductCard } from '../../../app/components/product/ProductCard';
import { ProductCompareProvider } from '../../../app/components/product/ProductCompare';

const state = vi.hoisted(() => ({ ids: [] as number[], fetch: vi.fn(), toggle: vi.fn(), wishlistCalls: 0 }));
vi.mock('@salla.sa/twilight-theme-engine/common', () => ({
  Link: ({ to, children, ...props }: { to: string; children: ReactNode }) => <a href={to} {...props}>{children}</a>,
  Image: ({ priority: _priority, ...props }: Record<string, unknown>) => <img {...props} />,
}));
vi.mock('@salla.sa/twilight-theme-engine/hooks/useWishlist', () => ({ useWishlist: () => { state.wishlistCalls++; return { has: (id: number) => state.ids.includes(id), toggle: state.toggle }; } }));
vi.mock('@salla.sa/twilight-theme-engine/hooks/useProduct', () => ({ useProduct: (product: Product) => ({ product }) }));
vi.mock('@salla.sa/twilight-theme-engine/hooks/useMoney', () => ({ useMoney: () => ({ format: (amount: number) => `${amount} SAR` }) }));
vi.mock('@salla.sa/twilight-theme-engine/providers', () => ({ useTwilight: () => ({ theme: { settings: {} } }) }));
vi.mock('@salla.sa/twilight-theme-engine/i18n', () => ({ useTranslation: () => ({ t: (_key: string, fallback: string) => fallback }) }));
vi.mock('@salla.sa/twilight-theme-engine/api/product', () => ({ product: { queries: { detail: (id: string) => ({ queryKey: ['detail', id], queryFn: () => state.fetch(id) }) } } }));
vi.mock('@salla.sa/twilight-components-react/add-product-button', () => ({ SallaAddProductButton: ({ productId, productStatus, children }: { productId: number; productStatus: string; children: ReactNode }) => <button data-testid="native-cart" data-id={productId} data-status={productStatus}>{children}</button> }));
vi.mock('../../../app/lib/nativeBooking', () => ({ registerNativeBookingHook: vi.fn() }));
vi.mock('../../../app/hooks/useScrollLock', () => ({ useScrollLock: vi.fn() }));
vi.mock('../../../app/components/product/AddToCartForm', () => ({ AddToCartForm: ({ product }: { product: Product }) => <form aria-label="Salla product options">{product.options?.flatMap((option) => option.details?.map((value) => <span key={value.id} data-selected={String(value.is_selected)}>{value.name}</span>))}</form> }));

const product = { id: 42, name: 'Cotton shirt', url: '/ar/shirt/p42', type: 'product', status: 'sale', currency: 'SAR', price: 100, image: { url: 'https://example.com/shirt.jpg' }, category: { name: 'Clothes', url: '/ar/clothes' }, rating: { stars: 4, count: 12 } } as Product;
const colors = [{ id: 10, name: 'Color', type: 'color', details: [{ id: 101, name: 'Blue', color: '#334455', image: 'https://example.com/blue.jpg' }, { id: 102, name: 'Red', color: '#ff0000', is_out: true }] }] as unknown as Product['options'];
function mount(children: ReactNode) {
  const client = new QueryClient({ defaultOptions: { queries: { retry: false, gcTime: 0 } } });
  return render(<QueryClientProvider client={client}><ProductCompareProvider>{children}</ProductCompareProvider></QueryClientProvider>);
}
beforeEach(() => { state.ids = []; state.wishlistCalls = 0; state.toggle.mockReset(); state.fetch.mockReset(); state.fetch.mockResolvedValue(product); });

describe('Reference product card', () => {
  it('keeps the wishlist browser subscription out of server rendering', () => {
    const client = new QueryClient();
    const html = renderToString(<QueryClientProvider client={client}><ProductCard product={product} /></QueryClientProvider>);
    expect(html).toContain('disabled');
    expect(state.wishlistCalls).toBe(0);
  });
  it('renders actual ratings and discounted prices', () => {
    mount(<ProductCard product={{ ...product, is_on_sale: true, sale_price: 75, regular_price: 100 }} />);
    expect(screen.getByRole('img', { name: 'Rating: 4 / 5 (12)' })).toBeTruthy();
    expect(screen.getByText('75 SAR')).toBeTruthy();
    expect(screen.getByText('100 SAR').tagName).toBe('DEL');
  });
  it.each([undefined, { stars: 0, count: 0 }, { stars: 0, count: 8 }])('omits rating UI when no actual rating exists (%j)', (rating) => {
    const { container } = mount(<ProductCard product={{ ...product, rating }} />);
    expect(screen.queryByText('No reviews yet')).toBeNull();
    expect(container.querySelector('.gs-card__rating')).toBeNull();
    expect(container.querySelector('.gs-card__stars-filled')).toBeNull();
    expect(container.querySelector('.gs-card__choices')).toBeNull();
  });
  it('uses numeric IDs for the real wishlist and marks saved products', () => {
    state.ids = [42];
    mount(<ProductCard product={{ ...product, id: '42' } as unknown as Product} />);
    const button = screen.getByRole('button', { name: 'Add or remove to wishlist' });
    expect(button.getAttribute('aria-pressed')).toBe('true');
    fireEvent.click(button);
    expect(state.toggle).toHaveBeenCalledWith(42);
  });
  it('uses the native Salla cart button for simple products', () => {
    mount(<ProductCard product={product} />);
    expect(screen.getByTestId('native-cart').getAttribute('data-id')).toBe('42');
    expect(screen.getByTestId('native-cart').getAttribute('data-status')).toBe('sale');
  });
  it('offers the notify flow for sold out products', () => {
    mount(<ProductCard product={{ ...product, is_out_of_stock: true, status: 'out' }} />);
    expect(screen.getByTestId('native-cart').getAttribute('data-status')).toBe('out-and-notify');
  });
  it('loads full options on interaction, previews real colors and keeps unavailable values disabled', async () => {
    state.fetch.mockResolvedValue({ ...product, has_options: true, options: colors });
    mount(<ProductCard product={{ ...product, has_options: true }} />);
    fireEvent.mouseEnter(screen.getByRole('article'));
    const blue = await screen.findByRole('button', { name: 'Color: Blue' });
    fireEvent.click(blue);
    expect(blue.getAttribute('aria-pressed')).toBe('true');
    expect(screen.getByAltText('Cotton shirt').getAttribute('src')).toBe('https://example.com/blue.jpg');
    expect((screen.getByRole('button', { name: 'Color: Red' }) as HTMLButtonElement).disabled).toBe(true);
    fireEvent.click(screen.getByRole('button', { name: 'Choose options' }));
    const form = await screen.findByRole('form', { name: 'Salla product options' });
    expect(form.textContent).toContain('Blue');
    fireEvent.keyDown(document, { key: 'Escape' });
    await waitFor(() => expect(screen.queryByRole('dialog')).toBeNull());
  });
  it('shows a retry action when product details fail', async () => {
    state.fetch.mockRejectedValueOnce(new Error('Offline')).mockResolvedValue(product);
    mount(<ProductCard product={product} />);
    fireEvent.click(screen.getByRole('button', { name: 'Quick view' }));
    expect(await screen.findByRole('alert')).toBeTruthy();
    fireEvent.click(screen.getByRole('button', { name: 'Try again' }));
    expect(await screen.findByRole('form', { name: 'Salla product options' })).toBeTruthy();
  });
  it('compares two products and removes them through the tray', () => {
    mount(<><ProductCard product={product} /><ProductCard product={{ ...product, id: 43, name: 'Linen shirt', price: 120 }} /></>);
    const compare = screen.getAllByRole('button', { name: 'Compare products', exact: true });
    fireEvent.click(compare[0]); fireEvent.click(compare[1]);
    fireEvent.click(screen.getByRole('button', { name: 'Compare products (2)' }));
    expect(screen.getByRole('table').textContent).toContain('Linen shirt');
    expect(screen.getByRole('table').textContent).toContain('120 SAR');
    fireEvent.click(screen.getByRole('button', { name: 'Close' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove from comparison: Cotton shirt' }));
    fireEvent.click(screen.getByRole('button', { name: 'Remove from comparison: Linen shirt' }));
    expect(screen.queryByRole('complementary')).toBeNull();
  });
  it('honors withoutAddButton while retaining other actions', () => {
    mount(<ProductCard product={product} withoutAddButton />);
    expect(screen.queryByTestId('native-cart')).toBeNull();
    expect(screen.getByRole('button', { name: 'Quick view' })).toBeTruthy();
  });
});


describe('merchant product facts', () => {
  it('does not invent missing attributes', () => {
    expect(productFacts({ options: [] } as unknown as Product)).toEqual([]);
  });
  it('shows actual material options and weight without treating colors as materials', () => {
    expect(productFacts({ weight: '2 kg', options: [
      { name: 'Color', details: [{ name: 'Red' }] },
      { name: 'الخامة', details: [{ name: 'خشب' }, { name: 'معدن' }] },
    ] } as unknown as Product)).toEqual(['2 kg', 'الخامة: خشب / معدن']);
  });
});
