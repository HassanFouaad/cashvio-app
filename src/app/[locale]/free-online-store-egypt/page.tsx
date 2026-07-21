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
    'free online store Egypt',
    'free ecommerce Egypt',
    'متجر إلكتروني مجاني مصر',
    'free online shop Egypt EGP',
    'free storefront Arabic Egypt',
    'no commission online store Egypt',
    'Cashvio',
  ],
  ar: [
    'متجر إلكتروني مجاني مصر',
    'متجر أونلاين مجاني مصر',
    'عمل متجر إلكتروني مجاني',
    'متجر إلكتروني بدون عمولة',
    'متجر إلكتروني بالجنيه',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/free-online-store-egypt',
    namespace: 'freeOnlineStoreEgypt',
    keywords,
  });
}

export default async function FreeOnlineStoreEgyptPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="freeOnlineStoreEgypt"
      path="/free-online-store-egypt"
    />
  );
}
