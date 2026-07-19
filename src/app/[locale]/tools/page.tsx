import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { LedgerHero, LedgerCta, ReceiptCard } from '@/components/marketing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
} from '@/config/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

const toolsKeywords: Record<Locale, string[]> = {
  en: [
    'free business tools',
    'free tools for merchants',
    'free barcode generator',
    'free QR code generator',
    'profit margin calculator',
    'free retail tools Egypt',
    'Cashvio free tools',
    'Cashvio',
  ],
  ar: [
    'أدوات مجانية للتجار',
    'أدوات مجانية للمحلات',
    'مولد باركود مجاني',
    'مولد QR مجاني',
    'حاسبة هامش الربح',
    'أدوات كاشفيو المجانية',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/tools',
    namespace: 'tools',
    keywords: toolsKeywords,
  });
}

const toolKeys = ['barcode', 'qr', 'margin'] as const;

const toolLinks: Record<(typeof toolKeys)[number], string> = {
  barcode: '/tools/barcode-generator',
  qr: '/tools/qr-code-generator',
  margin: '/tools/profit-margin-calculator',
};

export default async function ToolsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'tools' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.tools' });
  const tLedger = await getTranslations({ locale, namespace: 'ledger' });

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/tools' : '/ar/tools',
    title: metaT('title'),
    description: metaT('description'),
    type: 'CollectionPage',
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb(
    [
      { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
      { name: 'Free Tools', nameAr: 'أدوات مجانية', url: getCanonicalUrl('/tools', typedLocale) },
    ],
    typedLocale
  );

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }}
      />

      <LedgerHero
        eyebrow={t('badge')}
        title={t('hero.title')}
        titleHighlight={t('hero.titleHighlight')}
        subtitle={t('hero.subtitle')}
        stamp={t('freeStamp')}
      />

      <section aria-label={t('hero.title')} className="section-padding-sm">
        <div className="container-wide">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {toolKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={`${tLedger('item')} ${String(index + 1).padStart(2, '0')}`}
                value="0.00"
                title={t(`items.${key}.title`)}
                description={t(`items.${key}.description`)}
                footer={
                  <Link
                    href={toolLinks[key]}
                    className="inline-flex items-center gap-2 font-receipt text-sm text-primary hover:underline"
                  >
                    {t(`items.${key}.cta`)}
                    <span aria-hidden="true" className="rtl:-scale-x-100">-&gt;</span>
                  </Link>
                }
              />
            ))}
          </div>
        </div>
      </section>

      <LedgerCta
        title={t('cta.title')}
        subtitle={t('cta.subtitle')}
        primaryAction={{ label: t('cta.button'), href: registerLink }}
        note={t('cta.note')}
        stamp={t('freeStamp')}
      />
    </>
  );
}
