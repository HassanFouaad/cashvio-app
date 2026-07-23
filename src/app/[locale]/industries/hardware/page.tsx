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
    'hardware store POS',
    'tools shop POS',
    'free hardware cashier',
    'hardware store inventory',
    'POS for hardware shops Egypt',
    'builder supply POS',
    'Cashvio',
  ],
  ar: [
    'كاشير خردوات',
    'برنامج كاشير أدوات',
    'كاشير متجر أدوات مجاني',
    'برنامج خردوات',
    'كاشير متاجر خردوات مصر',
    'كاشفيو',
    'كاشير محل أدوات مجاني',
    'كاشير محلات خردوات مصر',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/hardware',
    namespace: 'industryHardware',
    keywords,
  });
}

export default async function HardwareIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryHardware"
      path="/industries/hardware"
    />
  );
}
