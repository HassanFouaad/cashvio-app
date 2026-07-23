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
    'stationery POS',
    'office supplies POS Egypt',
    'school supplies cashier',
    'free stationery POS',
    'stationery store software',
    'مكتبة POS',
    'Cashvio',
  ],
  ar: [
    'كاشير مكتبة',
    'برنامج متجر أدوات مكتبية',
    'كاشير مستلزمات مدرسية',
    'كاشير مكتبة مجاني',
    'برنامج كاشير مكتبة',
    'كاشفيو',
    'برنامج محل أدوات مكتبية',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/stationery',
    namespace: 'industryStationery',
    keywords,
  });
}

export default async function StationeryIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryStationery"
      path="/industries/stationery"
    />
  );
}
