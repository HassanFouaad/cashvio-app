import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { ToolPageShell } from '@/features/tools/tool-page-shell';
import { MarginCalculatorTool } from '@/features/tools/components';

interface Props {
  params: Promise<{ locale: string }>;
}

const marginKeywords: Record<Locale, string[]> = {
  en: [
    'profit margin calculator',
    'free margin calculator',
    'markup calculator',
    'selling price calculator',
    'gross margin calculator',
    'retail pricing calculator',
    'profit calculator for small business',
    'Cashvio',
  ],
  ar: [
    'حاسبة هامش الربح',
    'حساب هامش الربح',
    'حاسبة الربح للتجار',
    'حساب سعر البيع',
    'حاسبة نسبة الربح',
    'حساب المكسب في التجارة',
    'حاسبة تسعير المنتجات',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/tools/profit-margin-calculator',
    namespace: 'marginCalculator',
    keywords: marginKeywords,
  });
}

export default async function ProfitMarginCalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ToolPageShell
      locale={locale as Locale}
      namespace="marginCalculator"
      path="/tools/profit-margin-calculator"
      tool={<MarginCalculatorTool />}
    />
  );
}
