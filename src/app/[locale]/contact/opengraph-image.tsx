import { ImageResponse } from 'next/og';
import { brandColors } from '@/config/theme';
import { OgBrandMark } from '@/lib/og-brand-mark';
import { getTranslations } from 'next-intl/server';

import { loadArabicOgFonts } from '@/lib/og-fonts';

export const runtime = 'edge';

export const alt = 'Contact Cashvio - Get in Touch';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default async function OGImage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.contact' });

  const isArabic = locale === 'ar';
  const fonts = isArabic ? await loadArabicOgFonts() : undefined;
  const title = t('title');
  const description = t('description');

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
          padding: '60px 80px',
          position: 'relative',
        ...(isArabic ? { fontFamily: 'Tajawal' } : {}),
        }}
        dir={isArabic ? 'rtl' : 'ltr'}
      >
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: '6px',
            background: brandColors.saffron,
            display: 'flex',
          }}
        />

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '12px',
            marginBottom: '24px',
          }}
        >
          <div
            style={{
              width: '44px',
              height: '44px',
              borderRadius: '12px',
              background: brandColors.saffron,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 700,
              color: brandColors.dark,
            }}
          >
            <OgBrandMark />
          </div>
          <span style={{ fontSize: '28px', fontWeight: 700, color: brandColors.cream }}>
            Cashvio
          </span>
        </div>

        <div
          style={{
            fontSize: isArabic ? '44px' : '48px',
            fontWeight: 800,
            color: brandColors.cream,
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}
        >
          {title}
        </div>

        <div
          style={{
            fontSize: '20px',
            color: brandColors.darkMuted,
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: '800px',
          }}
        >
          {description}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '25px',
            color: brandColors.darkMuted,
            fontSize: '14px',
            display: 'flex',
          }}
        >
          cash-vio.com/contact
        </div>
      </div>
    ),
    { ...size, ...(fonts ? { fonts } : {}) }
  );
}
