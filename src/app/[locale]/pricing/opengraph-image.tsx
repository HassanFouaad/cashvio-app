import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const runtime = 'edge';

export const alt = 'Cashvio Pricing - Simple, Transparent Plans';
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
  const t = await getTranslations({ locale, namespace: 'metadata.pricing' });

  const isArabic = locale === 'ar';
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
          backgroundColor: '#0f1219',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #1a2332 0%, transparent 50%), radial-gradient(circle at 75% 75%, #0d2818 0%, transparent 50%)',
          padding: '60px 80px',
          position: 'relative',
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
            background: 'linear-gradient(90deg, #34d399, #10b981, #059669)',
            display: 'flex',
          }}
        />

        {/* Brand */}
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
              background: 'linear-gradient(135deg, #34d399, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '22px',
              fontWeight: 700,
              color: '#0f1219',
            }}
          >
            C
          </div>
          <span style={{ fontSize: '28px', fontWeight: 700, color: '#ffffff' }}>
            Cashvio
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            fontSize: isArabic ? '44px' : '48px',
            fontWeight: 800,
            color: '#ffffff',
            textAlign: 'center',
            lineHeight: 1.2,
            marginBottom: '16px',
          }}
        >
          {title}
        </div>

        {/* Description */}
        <div
          style={{
            fontSize: '20px',
            color: '#94a3b8',
            textAlign: 'center',
            lineHeight: 1.5,
            maxWidth: '800px',
            marginBottom: '36px',
          }}
        >
          {description}
        </div>

        {/* Free badge */}
        <div
          style={{
            padding: '12px 32px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, rgba(52, 211, 153, 0.15), rgba(16, 185, 129, 0.1))',
            border: '2px solid rgba(52, 211, 153, 0.3)',
            color: '#34d399',
            fontSize: '22px',
            fontWeight: 700,
            display: 'flex',
          }}
        >
          {isArabic ? 'باقة مجانية للأبد متاحة' : 'Free Forever Plan Available'}
        </div>

        <div
          style={{
            position: 'absolute',
            bottom: '25px',
            color: '#64748b',
            fontSize: '14px',
            display: 'flex',
          }}
        >
          cash-vio.com/pricing
        </div>
      </div>
    ),
    { ...size }
  );
}
