import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { ToolPageShell } from '@/features/tools/tool-page-shell';
import { PriceTagGeneratorTool } from '@/features/tools/components';

interface Props {
  params: Promise<{ locale: string }>;
}

const priceTagKeywords: Record<Locale, string[]> = {
  en: [
    'free price tag generator',
    'printable shelf labels A4',
    'product price label maker',
    'barcode price tag printer',
    'shelf tag template free',
    'print price labels PDF',
    'free price tag generator Egypt',
    'Cashvio',
  ],
  ar: [
    'مولد ملصقات أسعار مجاني',
    'طباعة بطاقات أسعار A4',
    'ملصقات رف للمنتجات',
    'تاج سعر مع باركود',
    'قوالب ملصقات أسعار',
    'طباعة ليبل سعر',
    'برنامج ملصقات أسعار مجاني',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/tools/price-tag-generator',
    namespace: 'priceTagGenerator',
    keywords: priceTagKeywords,
  });
}

export default async function PriceTagGeneratorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ToolPageShell
      locale={locale as Locale}
      namespace="priceTagGenerator"
      path="/tools/price-tag-generator"
      tool={<PriceTagGeneratorTool />}
    />
  );
}
