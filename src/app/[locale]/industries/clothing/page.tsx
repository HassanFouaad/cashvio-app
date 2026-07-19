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
    'clothing store POS',
    'boutique POS system',
    'fashion retail POS',
    'POS with sizes and colors',
    'clothing shop cashier software',
    'barcode labels for clothes',
    'free boutique POS Egypt',
    'Cashvio',
  ],
  ar: [
    'كاشير محل ملابس',
    'برنامج محل ملابس',
    'نظام كاشير بوتيك',
    'برنامج مبيعات ملابس بالمقاسات',
    'باركود ملابس',
    'كاشير محلات ملابس مجاني',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/clothing',
    namespace: 'industryClothing',
    keywords,
  });
}

export default async function ClothingIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryClothing"
      path="/industries/clothing"
    />
  );
}
