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
    'bakery POS',
    'bakery POS Egypt',
    'pastry shop POS',
    'free bakery cashier',
    'bakery inventory software',
    'POS for bakeries',
    'Cashvio',
  ],
  ar: [
    'كاشير مخبز',
    'كاشير حلواني',
    'برنامج كاشير مخابز',
    'نظام كاشير حلوانيات',
    'كاشير مخبز مجاني',
    'برنامج مخبز مصر',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/bakery',
    namespace: 'industryBakery',
    keywords,
  });
}

export default async function BakeryIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryBakery"
      path="/industries/bakery"
    />
  );
}
