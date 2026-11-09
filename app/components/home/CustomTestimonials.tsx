import { memo } from 'react';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { TestimonialsCarousel, type TestimonialItem } from '../common';

export interface CustomTestimonialsProps {
  data: {
    items?: TestimonialItem[];
    title?: string;
    description?: string;
    position?: number;
    [key: string]: unknown;
  };
}

/**
 * `custom-testimonials` home block — reviews matching generic store-tailwindcss-final.
 */
export const CustomTestimonials = memo(function CustomTestimonials({
  data,
}: CustomTestimonialsProps) {
  const { t } = useTranslation();
  const rawItems = data?.items;
  const hasValidItems =
    Array.isArray(rawItems) &&
    rawItems.length > 0 &&
    typeof rawItems[0] === 'object' &&
    Boolean(
      rawItems[0]?.name ||
      rawItems[0]?.text ||
      (rawItems[0] as Record<string, unknown>)?.['items.name'] ||
      (rawItems[0] as Record<string, unknown>)?.['items.text']
    );

  const items: TestimonialItem[] = hasValidItems
    ? rawItems.map((item) => ({
        name: (item.name || (item['items.name'] as string) || '') as string,
        avatar: (item.avatar || (item['items.avatar'] as string) || undefined) as string,
        stars: Number(item.stars ?? item['items.stars'] ?? 0),
        text: (item.text || (item['items.text'] as string) || '') as string,
      }))
    : [];

  if (!items.length) return null;

  return (
    <TestimonialsCarousel
      items={items}
      title={data.title || t('blocks.home.testimonials', 'Customer reviews')}
      description={data.description}
    />
  );
});
