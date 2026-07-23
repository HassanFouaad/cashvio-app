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
    'furniture store POS',
    'furniture POS Egypt',
    'home furniture cashier',
    'free furniture POS',
    'furniture shop software',
    'كاشير أثاث',
    'Cashvio',
  ],
  ar: [
    'كاشير أثاث',
    'برنامج متجر أثاث',
    'كاشير مفروشات',
    'كاشير أثاث مجاني',
    'برنامج بيع أثاث منزلي',
    'كاشفيو',
    'برنامج محل أثاث',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/furniture',
    namespace: 'industryFurniture',
    keywords,
  });
}

export default async function FurnitureIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryFurniture"
      path="/industries/furniture"
    />
  );
}
