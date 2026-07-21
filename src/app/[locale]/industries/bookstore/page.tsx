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
    'bookstore POS',
    'bookshop POS system',
    'free bookstore cashier',
    'bookstore inventory software',
    'POS for bookstores Egypt',
    'bookstore online store',
    'Cashvio',
  ],
  ar: [
    'كاشير مكتبة',
    'برنامج كاشير مكتبات',
    'كاشير محل كتب',
    'برنامج مكتبة مجاني',
    'كاشير مكتبات مصر',
    'متجر إلكتروني للكتب',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/bookstore',
    namespace: 'industryBookstore',
    keywords,
  });
}

export default async function BookstoreIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryBookstore"
      path="/industries/bookstore"
    />
  );
}
