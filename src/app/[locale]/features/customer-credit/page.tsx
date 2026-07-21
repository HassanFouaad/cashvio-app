import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { FeatureLandingShell } from '@/features/features/feature-landing-shell';

interface Props {
  params: Promise<{ locale: string }>;
}

const keywords: Record<Locale, string[]> = {
  en: [
    'store credit POS',
    'customer credit book',
    'sell on account POS',
    'digital credit book Egypt',
    'customer balance software',
    'آجل POS',
    'Cashvio',
  ],
  ar: [
    'بيع آجل',
    'دفتر حساب العملاء',
    'رصيد عميل',
    'كاشير آجل',
    'دفتر ديون رقمي',
    'برنامج بيع بالآجل',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/features/customer-credit',
    namespace: 'customerCredit',
    keywords,
  });
}

export default async function CustomerCreditPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <FeatureLandingShell
      locale={locale as Locale}
      namespace="customerCredit"
      path="/features/customer-credit"
      breadcrumbNameEn="Customer Credit"
      breadcrumbNameAr="رصيد العملاء والآجل"
    />
  );
}
