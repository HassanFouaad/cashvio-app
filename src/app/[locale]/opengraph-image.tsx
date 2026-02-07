import { ImageResponse } from 'next/og';
import { getTranslations } from 'next-intl/server';

export const runtime = 'edge';

export const alt = 'Cashvio - Business Operations & Commerce Platform';
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
  const t = await getTranslations({ locale, namespace: 'metadata' });

  const isArabic = locale === 'ar';
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
          backgroundColor: '#0f1219',
          backgroundImage:
            'radial-gradient(circle at 25% 25%, #1a2332 0%, transparent 50%), radial-gradient(circle at 75% 75%, #0d2818 0%, transparent 50%)',
          fontFamily: isArabic ? 'Arial, sans-serif' : 'Inter, sans-serif',
          padding: '60px 80px',
          position: 'relative',
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
            height: '6px',
            background: 'linear-gradient(90deg, #34d399, #10b981, #059669)',
            display: 'flex',
          }}
        />

        {/* Logo and brand */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '16px',
            marginBottom: '32px',
          }}
        >
          {/* Logo mark */}
          <div
            style={{
              width: '56px',
              height: '56px',
              borderRadius: '14px',
              background: 'linear-gradient(135deg, #34d399, #10b981)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '28px',
              fontWeight: 700,
              color: '#0f1219',
            }}
          >
            C
          </div>
          <span
            style={{
              fontSize: '36px',
              fontWeight: 700,
              color: '#ffffff',
              letterSpacing: '-0.5px',
            }}
          >
            {title}
          </span>
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: isArabic ? '28px' : '24px',
            color: '#34d399',
            fontWeight: 600,
            marginBottom: '20px',
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
            fontSize: isArabic ? '22px' : '20px',
            color: '#94a3b8',
            textAlign: 'center',
            lineHeight: 1.6,
            maxWidth: '800px',
          }}
        >
          {description}
        </div>

        {/* Feature pills */}
        <div
          style={{
            display: 'flex',
            gap: '12px',
            marginTop: '40px',
            flexWrap: 'wrap',
            justifyContent: 'center',
          }}
        >
          {(isArabic
            ? ['نقاط البيع', 'إدارة المخزون', 'تحليلات الأعمال', 'متعدد المتاجر']
            : ['POS System', 'Inventory', 'Analytics', 'Multi-Store']
          ).map((feature) => (
            <div
              key={feature}
              style={{
                padding: '8px 20px',
                borderRadius: '20px',
                backgroundColor: 'rgba(52, 211, 153, 0.1)',
                border: '1px solid rgba(52, 211, 153, 0.2)',
                color: '#34d399',
                fontSize: '16px',
                fontWeight: 500,
                display: 'flex',
              }}
            >
              {feature}
            </div>
          ))}
        </div>

        {/* Bottom bar */}
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: '#64748b',
            fontSize: '16px',
          }}
        >
          <span>cash-vio.com</span>
          <span style={{ color: '#334155' }}>|</span>
          <span>
            {isArabic ? 'ابدأ مجاناً' : 'Start Free'}
          </span>
        </div>
      </div>
    ),
    {
      ...size,
    }
  );
}
