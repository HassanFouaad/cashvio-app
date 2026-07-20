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
    'supermarket POS',
    'grocery POS Egypt',
    'supermarket cashier software',
    'free supermarket POS',
    'POS for grocery store',
    'barcode POS supermarket',
    'Cashvio',
  ],
  ar: [
    'كاشير سوبر ماركت',
    'كاشير بقالة',
    'برنامج كاشير سوبر ماركت',
    'نظام كاشير بقالة',
    'كاشير سوبر ماركت مجاني',
    'برنامج بقالة مصر',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/supermarket',
    namespace: 'industrySupermarket',
    keywords,
  });
}

export default async function SupermarketIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industrySupermarket"
      path="/industries/supermarket"
    />
  );
}
