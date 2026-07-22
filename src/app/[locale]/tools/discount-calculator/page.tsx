import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { ToolPageShell } from '@/features/tools/tool-page-shell';
import { DiscountCalculatorTool } from '@/features/tools/components';

interface Props {
  params: Promise<{ locale: string }>;
}

const discountKeywords: Record<Locale, string[]> = {
  en: [
    'free discount calculator',
    'percentage off calculator',
    'sale price calculator',
    'discount percentage calculator',
    'how much is 20 percent off',
    'coupon discount calculator',
    'free discount calculator Egypt',
    'Cashvio',
  ],
  ar: [
    'حاسبة الخصم مجانا',
    'حاسبة نسبة الخصم',
    'احسب سعر بعد الخصم',
    'حاسبة التخفيضات',
    'كام بعد خصم ٢٠٪',
    'حاسبة كوبون الخصم',
    'برنامج خصومات مجاني',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/tools/discount-calculator',
    namespace: 'discountCalculator',
    keywords: discountKeywords,
  });
}

export default async function DiscountCalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ToolPageShell
      locale={locale as Locale}
      namespace="discountCalculator"
      path="/tools/discount-calculator"
      tool={<DiscountCalculatorTool />}
    />
  );
}
