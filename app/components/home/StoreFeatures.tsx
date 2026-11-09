import { memo } from 'react';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';

export interface StoreFeatureItem {
  title?: string;
  description?: string;
  text?: string;
  icon?: string;
  [key: string]: unknown;
}

export interface StoreFeaturesProps {
  data?: { features?: StoreFeatureItem[]; [key: string]: unknown };
}

/** Generic Store service features (Matches generic store-tailwindcss-final). */
export const StoreFeatures = memo(function StoreFeatures({ data }: StoreFeaturesProps) {
  const { locale } = useTranslation();
  const isAr = locale === 'ar';

  const defaultFeatures: StoreFeatureItem[] = isAr
    ? [
        {
          title: 'توصيل سريع وآمن',
          description: 'توصيل مجاني للطلبات المؤهلة',
          icon: '/images/service/1.png',
        },
        {
          title: 'ضمان استرجاع الأموال',
          description: 'سياسة إرجاع خلال 15 يوماً',
          icon: '/images/service/2.png',
        },
        {
          title: 'استبدال واسترجاع سهل',
          description: 'خدمة سريعة وموثوقة',
          icon: '/images/service/3.png',
        },
        {
          title: 'دعم فني متميز',
          description: 'خدمة عملاء على مدار 24 ساعة',
          icon: '/images/service/4.png',
        },
      ]
    : [
        {
          title: 'Fast & Secure Delivery',
          description: 'Free home delivery',
          icon: '/images/service/1.png',
        },
        {
          title: 'Money back Guarantee',
          description: 'With 15-day money policy',
          icon: '/images/service/2.png',
        },
        {
          title: '24 Hours Return Policy',
          description: 'Quick return policy',
          icon: '/images/service/3.png',
        },
        {
          title: 'Quality Support',
          description: '24/7 live support',
          icon: '/images/service/4.png',
        },
      ];

  const rawFeatures = data?.features;
  const hasValidFeatures =
    Array.isArray(rawFeatures) &&
    rawFeatures.length > 0 &&
    typeof rawFeatures[0] === 'object' &&
    Boolean(rawFeatures[0]?.title || (rawFeatures[0] as Record<string, unknown>)?.['features.title']);

  const features: StoreFeatureItem[] = hasValidFeatures
    ? rawFeatures.map((item, index: number) => ({
        title: (item.title || (item['features.title'] as string) || '') as string,
        description: (item.description || item.text || (item['features.description'] as string) || '') as string,
        icon: (item.icon || (item['features.icon'] as string) || `/images/service/${(index % 4) + 1}.png`) as string,
      }))
    : defaultFeatures;

  return (
    <section className="section-service py-[50px] max-[1199px]:py-[35px]">
      <div className="container">
        <div className="store-services">
          {features.map((item, index) => (
            <div key={`${item.title || index}`} className="store-services__item">
              <div className="store-services__icon">
                {item.icon && !/^(https?:\/\/|\/)/.test(item.icon) ? (
                  <i className={item.icon} aria-hidden="true" />
                ) : (
                  <img
                    src={item.icon || `/images/service/${(index % 4) + 1}.png`}
                    alt={item.title || ''}
                    width={48}
                    height={48}
                    loading="lazy"
                  />
                )}
              </div>
              {item.title && <h3>{item.title}</h3>}
              {(item.description || item.text) && <p>{item.description || item.text}</p>}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
});
