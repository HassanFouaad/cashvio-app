import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { ToolPageShell } from '@/features/tools/tool-page-shell';
import { BarcodeGeneratorTool } from '@/features/tools/components';

interface Props {
  params: Promise<{ locale: string }>;
}

const barcodeKeywords: Record<Locale, string[]> = {
  en: [
    'free barcode generator',
    'barcode generator online',
    'Code 128 barcode generator',
    'EAN-13 barcode generator',
    'product barcode generator',
    'barcode maker free download PNG',
    'free barcode generator Egypt',
    'Cashvio',
  ],
  ar: [
    'مولد باركود مجاني',
    'انشاء باركود اون لاين',
    'عمل باركود للمنتجات',
    'مولد باركود Code 128',
    'باركود EAN-13',
    'تحميل باركود PNG',
    'برنامج باركود مجاني',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/tools/barcode-generator',
    namespace: 'barcodeGenerator',
    keywords: barcodeKeywords,
  });
}

export default async function BarcodeGeneratorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ToolPageShell
      locale={locale as Locale}
      namespace="barcodeGenerator"
      path="/tools/barcode-generator"
      tool={<BarcodeGeneratorTool />}
    />
  );
}
