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
    'optics POS',
    'optical shop POS Egypt',
    'eyewear cashier software',
    'free optics POS',
    'sunglasses store POS',
    'كاشير نظارات',
    'Cashvio',
  ],
  ar: [
    'كاشير نظارات',
    'برنامج متجر بصريات',
    'كاشير متجر نظارات',
    'كاشير نظارات مجاني',
    'برنامج كاشير بصريات',
    'كاشفيو',
    'برنامج محل بصريات',
    'كاشير محل نظارات',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/industries/optics',
    namespace: 'industryOptics',
    keywords,
  });
}

export default async function OpticsIndustryPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="industryOptics"
      path="/industries/optics"
    />
  );
}
