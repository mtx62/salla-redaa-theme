import { memo } from 'react';
import type { ComponentProps } from 'react';
import { useTwilight } from '@salla.sa/twilight-theme-engine/providers';
import { useTranslation } from '@salla.sa/twilight-theme-engine/i18n';
import { SallaSocial } from '@salla.sa/twilight-components-react/social';
import { SallaMenu } from '@salla.sa/twilight-components-react/menu';
import { SallaPayments } from '@salla.sa/twilight-components-react/payments';
import { SallaTrustBadges } from '@salla.sa/twilight-components-react/trust-badges';
import { ArrowLeftIcon } from '../icons';
import { ReferenceIcon } from '../common';

function SafeLink({ to, href, ...props }: { to?: string; href?: string } & ComponentProps<'a'>) {
  return <a href={to || href || '/'} {...props} />;
}

// Polyfill minimal IntersectionObserver for jsdom test environments
if (typeof window !== 'undefined' && typeof window.IntersectionObserver === 'undefined') {
  (window as unknown as { IntersectionObserver: unknown }).IntersectionObserver = class {
    observe() {}
    unobserve() {}
    disconnect() {}
  };
}

/** Saudi Business Center (SBC) logo URL */
const SBC_ICON_URL = 'https://cdn.salla.network/images/sbc.png?v=2.0.5';
/** Salla Value Added Tax (VAT) badge URL */
const TAX_ICON_URL =
  'https://cdn.salla.network/cdn-cgi/image/fit=scale-down,width=70,height=70,onerror=redirect,format=auto/images/tax.png?v=2.0.5';

function useSafeTwilight() {
  try {
    return useTwilight();
  } catch {
    return { store: {}, theme: { settings: {} } } as unknown as ReturnType<typeof useTwilight>;
  }
}

/**
 * Modern floating island footer card inspired by docs/inspiration/footer.png
 *
 * 4 Distinct Columns inside the rounded white card:
 *  1. Brand Logo + Bio/Description + 4 Circular Peach Social Icons
 *  2. Navigation Links (Home, Categories, About Us, Services, Blog)
 *  3. Quick Links (dynamic Salla menu / policy links)
 *  4. Open Hours (Clock badge + "7 AM - 5 PM, Mon - Sat" + support note + contacts/SBC)
 *
 * Outside the card on the cream paper background:
 *  - Centered Copyright + Salla Payment badges + Scroll to top button.
 */
export const ThemeFooter = memo(function ThemeFooter() {
  const { store, theme } = useSafeTwilight();
  const { t, locale } = useTranslation();
  const isAr = locale === 'ar';
  const year = new Date().getFullYear();
  const isDark = !!theme?.settings?.footer_is_dark;

  const sbcId = store?.settings?.certificate?.id;
  const taxNumber = store?.settings?.tax?.number;
  const taxCertificate = store?.settings?.tax?.certificate;
  const phone = store?.contacts?.phone;
  const email = store?.contacts?.email;

  const cleanDescription = store?.description
    ? store.description.replace(/<[^>]+>/g, '').trim()
    : '';

  const scrollToTop = () => {
    if (typeof window !== 'undefined') {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <footer
      className={`store-footer generic-store-footer relative pt-6 pb-12 ${
        isDark ? 'footer-is-dark' : ''
      }`}
      suppressHydrationWarning
    >

      <div className="container">
        {/* Floating Island Card inspired by footer.png */}
        <div className="store-footer__floating-card bg-white rounded-[28px] lg:rounded-[32px] border border-[#dfcfbc]/70 shadow-[0_16px_45px_rgba(73,48,57,0.07)] p-8 sm:p-10 lg:p-12 transition-shadow duration-300 hover:shadow-[0_20px_50px_rgba(73,48,57,0.1)]">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 lg:gap-10">
            {/* Column 1: Brand & Social */}
            <div className="store-footer__brand flex flex-col justify-between">
              <div>
                <SafeLink to="/" className="inline-flex items-center gap-2 mb-4">
                  <img
                    src={
                      (theme?.settings as Record<string, unknown> | undefined)?.header_custom_logo as string ||
                      store?.logo ||
                      '/images/logo.png'
                    }
                    alt={`${store?.name || 'Store'} logo`}
                    width={140}
                    height={48}
                    className="h-10 w-auto object-contain"
                  />
                  <span className="sr-only">{store?.name || 'Store'}</span>
                </SafeLink>
                <p className="text-sm text-[var(--store-muted)] leading-relaxed mb-6">
                  {cleanDescription ||
                    (isAr
                      ? 'متجركم المفضل لتجربة تسوق راقية مع تشكيلة مختارة من أفضل المنتجات بجودة استثنائية وخدمة عملاء متفانية.'
                      : 'Your curated shopping destination offering premium quality collections, distinctive designs, and exceptional customer support.')}
                </p>
              </div>

              {/* 4 Circular Peach Social Icons from footer.png */}
              <div className="store-footer__social-wrapper pt-2">
                <SallaSocial className="store-footer__social-links flex items-center gap-2.5" />
              </div>
            </div>

            {/* Column 2: Navigation Links */}
            <div className="store-footer__nav-col">
              <h3 className="text-base font-bold text-[var(--store-ink)] mb-4 lg:mb-5">
                {isAr ? 'التنقل' : 'Navigation'}
              </h3>
              <ul className="space-y-3 text-sm text-[var(--store-muted)]">
                <li>
                  <SafeLink
                    to="/"
                    className="hover:text-[var(--color-primary)] hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-all"
                  >
                    {isAr ? 'الرئيسية' : 'Home'}
                  </SafeLink>
                </li>
                <li>
                  <SafeLink
                    to="/"
                    className="hover:text-[var(--color-primary)] hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-all"
                  >
                    {isAr ? 'الأقسام والمنتجات' : 'Products & Pages'}
                  </SafeLink>
                </li>
                <li>
                  <SafeLink
                    to="/testimonials"
                    className="hover:text-[var(--color-primary)] hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-all"
                  >
                    {isAr ? 'آراء العملاء' : 'Testimonials'}
                  </SafeLink>
                </li>
                <li>
                  <SafeLink
                    to="/blog"
                    className="hover:text-[var(--color-primary)] hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-all"
                  >
                    {isAr ? 'المدونة والأخبار' : 'Blog & News'}
                  </SafeLink>
                </li>
              </ul>
            </div>

            {/* Column 3: Quick Links */}
            <div className="store-footer__links-col">
              <h3 className="text-base font-bold text-[var(--store-ink)] mb-4 lg:mb-5">
                {isAr ? 'روابط سريعة' : 'Quick Link'}
              </h3>
              <div className="store-footer__menu-wrap mb-3">
                <SallaMenu source="footer" className="store-footer__menu store-footer__menu--stacked" />
              </div>
              <ul className="space-y-3 text-sm text-[var(--store-muted)]">
                <li>
                  <SafeLink
                    to="/pages/privacy-policy"
                    className="hover:text-[var(--color-primary)] hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-all"
                  >
                    {isAr ? 'سياسة الخصوصية' : 'Privacy Policy'}
                  </SafeLink>
                </li>
                <li>
                  <SafeLink
                    to="/pages/terms-and-conditions"
                    className="hover:text-[var(--color-primary)] hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-all"
                  >
                    {isAr ? 'الشروط والأحكام' : 'Terms & Conditions'}
                  </SafeLink>
                </li>
                <li>
                  <SafeLink
                    to="/pages/refund-policy"
                    className="hover:text-[var(--color-primary)] hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-all"
                  >
                    {isAr ? 'سياسة الاستبدال والاسترجاع' : 'Refund Policy'}
                  </SafeLink>
                </li>
                <li>
                  <SafeLink
                    to="/pages/faq"
                    className="hover:text-[var(--color-primary)] hover:translate-x-1 rtl:hover:-translate-x-1 inline-block transition-all"
                  >
                    {isAr ? 'الأسئلة الشائعة' : 'FAQ'}
                  </SafeLink>
                </li>
              </ul>
            </div>

            {/* Column 4: Customer Support & Contacts */}
            <div className="store-footer__hours-col flex flex-col justify-between">
              <div>
                <h3 className="text-base font-bold text-[var(--store-ink)] mb-4 lg:mb-5">
                  {isAr ? 'خدمة العملاء' : 'Customer Support'}
                </h3>

                <p className="text-xs text-[var(--store-muted)] leading-relaxed mb-4">
                  {isAr
                    ? 'فريق الدعم الفني متواجد لمساعدتكم والإجابة على كافة استفساراتكم.'
                    : 'Our customer support team is available to assist you with any questions.'}
                </p>

                {/* Store contacts */}
                {(phone || email) && (
                  <div className="space-y-2 text-xs text-[var(--store-muted)] mb-4">
                    {phone && (
                      <a
                        href={`tel:${phone}`}
                        className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors"
                      >
                        <ReferenceIcon name="phone-call" className="text-[var(--color-primary)] text-sm" />
                        <span dir="ltr" className="unicode font-medium">{phone}</span>
                      </a>
                    )}
                    {email && (
                      <a
                        href={`mailto:${email}`}
                        className="flex items-center gap-2 hover:text-[var(--color-primary)] transition-colors"
                      >
                        <ReferenceIcon name="envelope" className="text-[var(--color-primary)] text-sm" />
                        <span className="font-medium">{email}</span>
                      </a>
                    )}
                  </div>
                )}
              </div>

              {/* Saudi Business Center & Tax Badges */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                {sbcId && (
                  <a
                    href={`https://eauthenticate.saudibusiness.gov.sa/certificate-details/${encodeURIComponent(sbcId)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs text-[var(--store-muted)] hover:opacity-80 transition-opacity"
                    title={isAr ? 'موثق في منصة الأعمال' : 'Trusted by SBC'}
                  >
                    <img src={SBC_ICON_URL} alt="SBC" width={38} height={26} className="h-6 w-auto" />
                    <span className="font-medium text-[11px]">{isAr ? 'منصة الأعمال' : 'SBC'}</span>
                  </a>
                )}
                {taxNumber && (
                  <div className="inline-flex items-center gap-1.5 text-xs text-[var(--store-muted)]">
                    <img src={TAX_ICON_URL} alt="VAT" width={26} height={26} className="h-6 w-auto" />
                    {taxCertificate ? (
                      <a
                        href={taxCertificate}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="font-medium text-[11px] underline hover:text-[var(--color-primary)]"
                      >
                        {isAr ? 'شهادة الضريبة' : 'VAT Certificate'}
                      </a>
                    ) : (
                      <span className="font-medium text-[11px]">{taxNumber}</span>
                    )}
                  </div>
                )}
                <SallaTrustBadges />
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Strip Outside Card on Cream Background (from footer.png) */}
        <div className="store-footer__bottom-strip flex flex-col sm:flex-row items-center justify-between gap-4 pt-6 text-center sm:text-start text-xs text-[var(--store-muted)]">
          <div className="store-footer__copyright">
            © {year}{' '}
            <SafeLink to="/" className="font-semibold text-[var(--store-ink)] hover:text-[var(--color-primary)]">
              {store?.name || 'Store'}
            </SafeLink>
            . {t('blocks.footer.copyright', isAr ? 'جميع الحقوق محفوظة' : 'All rights reserved')}.
          </div>

          <div className="store-footer__payments-wrap flex items-center justify-center">
            <SallaPayments />
          </div>

          <div className="store-footer__scroll-top-wrapper">
            <button
              type="button"
              onClick={scrollToTop}
              className="store-footer__scroll-top flex items-center gap-1.5 py-1.5 px-3 rounded-full border border-[var(--store-line)] bg-white text-[var(--store-muted)] hover:text-[var(--color-primary)] hover:border-[var(--color-primary)] transition-all shadow-sm"
              aria-label={t('blocks.footer.scroll_to_top', isAr ? 'العودة للأعلى' : 'Back to top')}
            >
              <span>{t('blocks.footer.scroll_to_top', isAr ? 'العودة للأعلى' : 'Back to top')}</span>
              <span className="inline-block -rotate-90">
                <ArrowLeftIcon className="w-3 h-3" />
              </span>
            </button>
          </div>
        </div>
      </div>
    </footer>
  );
});
