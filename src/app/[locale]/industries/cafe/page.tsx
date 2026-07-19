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
    'cafe POS system',
    'coffee shop POS',
    'free cafe POS Egypt',
    'juice bar POS',
    'POS for coffee shops',
    'cafe cashier software',
    'restaurant order statuses',
    'Cashvio',
  ],
  ar: [
    'كاشير كافيه',
    'برنامج كاشير كافيه',
    'نظام كاشير كوفي شوب',
    'كاشير كافيه مجاني',
    'برنامج محل عصائر',
    'كاشير مطاعم صغيرة',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/cafe',
    namespace: 'industryCafe',
    keywords,
  });
}

export default async function CafeIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryCafe"
      path="/industries/cafe"
    />
  );
}
