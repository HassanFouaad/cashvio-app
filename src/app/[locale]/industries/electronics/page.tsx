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
    'electronics store POS',
    'appliance shop POS',
    'free electronics cashier',
    'electronics inventory software',
    'POS for electronics Egypt',
    'home electronics POS',
    'Cashvio',
  ],
  ar: [
    'كاشير إلكترونيات',
    'برنامج كاشير أجهزة',
    'كاشير متجر إلكترونيات مجاني',
    'كاشير محل إلكترونيات مجاني',
    'برنامج أجهزة منزلية',
    'كاشير إلكترونيات مصر',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/electronics',
    namespace: 'industryElectronics',
    keywords,
  });
}

export default async function ElectronicsIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryElectronics"
      path="/industries/electronics"
    />
  );
}
