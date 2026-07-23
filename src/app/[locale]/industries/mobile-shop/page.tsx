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
    'mobile shop POS',
    'phone store POS Egypt',
    'mobile accessories POS',
    'free mobile shop cashier',
    'IMEI inventory POS',
    'electronics shop POS',
    'Cashvio',
  ],
  ar: [
    'برنامج متجر موبايلات',
    'كاشير متجر موبايلات',
    'كاشير اكسسوارات موبايل',
    'برنامج متجر موبايلات مجاني',
    'كاشير متاجر موبايل مصر',
    'إدارة مخزون موبايلات',
    'كاشفيو',
    'برنامج محل موبايلات',
    'كاشير محل موبايلات',
    'برنامج محل موبايلات مجاني',
    'كاشير محلات موبايل مصر',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/mobile-shop',
    namespace: 'industryMobileShop',
    keywords,
  });
}

export default async function MobileShopIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryMobileShop"
      path="/industries/mobile-shop"
    />
  );
}
