import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { IndustryPageShell } from '@/features/industries/industry-page-shell';

interface Props {
  params: Promise<{ locale: string }>;
}

const keywords: Record<Locale, string[]> = {
  en: [
    'minimarket POS',
    'grocery store POS',
    'supermarket cashier software',
    'POS with barcode scanner',
    'credit sales tracking',
    'minimarket POS Egypt free',
    'small supermarket software',
    'Cashvio',
  ],
  ar: [
    'كاشير سوبر ماركت',
    'كاشير ميني ماركت',
    'برنامج سوبر ماركت',
    'برنامج بقالة',
    'كاشير بالباركود',
    'دفتر حساب العملاء',
    'برنامج ميني ماركت مجاني',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/minimarket',
    namespace: 'industryMinimarket',
    keywords,
  });
}

export default async function MinimarketIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryMinimarket"
      path="/industries/minimarket"
    />
  );
}
