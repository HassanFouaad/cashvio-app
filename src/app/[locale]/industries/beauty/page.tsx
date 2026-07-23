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
    'cosmetics store POS',
    'beauty shop POS Egypt',
    'cosmetics cashier software',
    'free beauty store POS',
    'makeup shop inventory POS',
    'POS for cosmetics store',
    'Cashvio',
  ],
  ar: [
    'كاشير متجر كوزمتكس',
    'كاشير متجر تجميل',
    'برنامج كاشير كوزمتكس',
    'نظام كاشير مستحضرات تجميل',
    'كاشير كوزمتكس مجاني',
    'برنامج متجر تجميل مصر',
    'كاشفيو',
    'كاشير محل كوزمتكس',
    'كاشير محل تجميل',
    'برنامج محل تجميل مصر',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/beauty',
    namespace: 'industryBeauty',
    keywords,
  });
}

export default async function BeautyIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryBeauty"
      path="/industries/beauty"
    />
  );
}
