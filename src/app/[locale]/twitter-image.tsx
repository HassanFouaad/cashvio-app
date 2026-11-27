import { ImageResponse } from 'next/og';
import { brandColors } from '@/config/theme';
import { OgBrandMark } from '@/lib/og-brand-mark';
import { getTranslations } from 'next-intl/server';

import { loadArabicOgFonts } from '@/lib/og-fonts';

export const runtime = 'edge';

export const alt = 'Cashvio - Business Operations & Commerce Platform';
export const size = {
  width: 1200,
  height: 600,
};
export const contentType = 'image/png';

export default async function XCardImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const isArabic = locale === 'ar';
  const fonts = isArabic ? await loadArabicOgFonts() : undefined;
  const title = t('siteName');
  const description = t('siteDescription');

  return new ImageResponse(
    (
      <div
        style={{
          height: '100%',
          width: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: brandColors.dark,
          padding: '50px 80px',
          position: 'relative',
          ...(isArabic ? { fontFamily: 'Tajawal' } : {}),
        }}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        {/* Top accent line */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '5px',
            background: brandColors.saffron,
            display: 'flex',
          }}
        />

        {/* Logo and brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '14px',
            marginBottom: '28px',
          }}
        >
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: '12px',
              background: brandColors.saffron,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '24px',
              fontWeight: 700,
              color: brandColors.dark,
            }}
          >
            <OgBrandMark />
          </div>
          <span
            style={{
              fontSize: '32px',
              fontWeight: 700,
              color: brandColors.cream,
            }}
          >
            {title}
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: isArabic ? '24px' : '22px',
            color: brandColors.saffron,
            fontWeight: 600,
            marginBottom: '16px',
            textAlign: 'center',
          }}
        >
          {isArabic
            ? 'منصة إدارة العمليات التجارية'
            : 'Business Operations & Commerce Platform'}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '18px',
            color: brandColors.darkMuted,
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: '750px',
          }}
        >
          {description}
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: 'flex',
            gap: '10px',
            marginTop: '32px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {(isArabic
            ? ['نقاط البيع', 'إدارة المخزون', 'تحليلات', 'متعدد المتاجر']
            : ['POS System', 'Inventory', 'Analytics', 'Multi-Store']
          ).map((feature) => (
            <div
              key={feature}
              style={{
                padding: '6px 16px',
                borderRadius: '16px',
                backgroundColor: 'rgba(52, 211, 153, 0.1)',
                border: '1px solid rgba(52, 211, 153, 0.2)',
                color: brandColors.saffron,
                fontSize: '14px',
                fontWeight: 500,
                display: 'flex',
              }}
            >
              {feature}
            </div>
          ))}
        </div>        {/* Bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: '24px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: brandColors.darkMuted,
            fontSize: '14px',
          }}
        >
          cash-vio.com
        </div>
      </div>
    ),
    {
      ...size,
      ...(fonts ? { fonts } : {}),
    }
  );
}
