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
    'jewelry store POS',
    'jewellery POS system',
    'free jewelry cashier',
    'gold shop POS Egypt',
    'jewelry inventory software',
    'POS for jewelry stores',
    'Cashvio',
  ],
  ar: [
    'كاشير مجوهرات',
    'برنامج كاشير ذهب',
    'كاشير محل ذهب مجاني',
    'برنامج مجوهرات',
    'كاشير محلات ذهب مصر',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/jewelry',
    namespace: 'industryJewelry',
    keywords,
  });
}

export default async function JewelryIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryJewelry"
      path="/industries/jewelry"
    />
  );
}
