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
    'restaurant POS Egypt',
    'restaurant POS system',
    'free restaurant POS',
    'restaurant cashier software',
    'POS for restaurants Egypt',
    'food service POS',
    'Cashvio',
  ],
  ar: [
    'كاشير مطعم',
    'برنامج كاشير مطعم',
    'نظام كاشير مطاعم',
    'كاشير مطعم مجاني',
    'برنامج نقاط بيع مطاعم',
    'كاشير مطاعم مصر',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/restaurant',
    namespace: 'industryRestaurant',
    keywords,
  });
}

export default async function RestaurantIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryRestaurant"
      path="/industries/restaurant"
    />
  );
}
