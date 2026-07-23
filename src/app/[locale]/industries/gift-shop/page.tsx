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
    'gift shop POS',
    'flower shop POS',
    'free gift store cashier',
    'florist POS Egypt',
    'gift shop inventory',
    'POS for gift shops',
    'Cashvio',
  ],
  ar: [
    'كاشير هدايا',
    'كاشير متجر ورد',
    'برنامج كاشير هدايا وورد',
    'كاشير متجر هدايا مجاني',
    'برنامج متجر ورد مصر',
    'كاشفيو',
    'كاشير محل ورد',
    'كاشير محل هدايا مجاني',
    'برنامج محل ورد مصر',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/gift-shop',
    namespace: 'industryGiftShop',
    keywords,
  });
}

export default async function GiftShopIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryGiftShop"
      path="/industries/gift-shop"
    />
  );
}
