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
    'pharmacy POS',
    'pharmacy POS Egypt',
    'pharmacy cashier software',
    'free pharmacy POS',
    'drugstore POS system',
    'pharmacy inventory POS',
    'Cashvio',
  ],
  ar: [
    'برنامج صيدلية',
    'كاشير صيدلية',
    'نظام كاشير صيدليات',
    'برنامج صيدلية مجاني',
    'كاشير صيدلية مصر',
    'إدارة مخزون صيدلية',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/pharmacy',
    namespace: 'industryPharmacy',
    keywords,
  });
}

export default async function PharmacyIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryPharmacy"
      path="/industries/pharmacy"
    />
  );
}
