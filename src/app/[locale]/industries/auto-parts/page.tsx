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
    'auto parts POS',
    'spare parts POS Egypt',
    'car parts cashier software',
    'free auto parts POS',
    'garage parts inventory',
    'قطع غيار POS',
    'Cashvio',
  ],
  ar: [
    'كاشير قطع غيار',
    'برنامج متجر قطع غيار',
    'كاشير قطع غيار سيارات',
    'كاشير قطع غيار مجاني',
    'برنامج مخزون ورشة',
    'كاشفيو',
    'برنامج محل قطع غيار',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/auto-parts',
    namespace: 'industryAutoParts',
    keywords,
  });
}

export default async function AutoPartsIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryAutoParts"
      path="/industries/auto-parts"
    />
  );
}
