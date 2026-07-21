import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { FeatureLandingShell } from '@/features/features/feature-landing-shell';

interface Props {
  params: Promise<{ locale: string }>;
}

const keywords: Record<Locale, string[]> = {
  en: [
    'barcode POS',
    'barcode scanning POS',
    'USB barcode scanner cashier',
    'POS barcode checkout',
    'barcode inventory POS Egypt',
    'كاشير باركود',
    'Cashvio',
  ],
  ar: [
    'كاشير باركود',
    'مسح باركود نقطة بيع',
    'كاشير بباركود USB',
    'برنامج كاشير باركود',
    'بيع بالباركود',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/features/barcode-pos',
    namespace: 'barcodePos',
    keywords,
  });
}

export default async function BarcodePosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <FeatureLandingShell
      locale={locale as Locale}
      namespace="barcodePos"
      path="/features/barcode-pos"
      breadcrumbNameEn="Barcode POS"
      breadcrumbNameAr="كاشير بالباركود"
    />
  );
}
