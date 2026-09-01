import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { ToolPageShell } from "@/features/tools/tool-page-shell";
import { VatCalculatorTool } from "@/features/tools/components";

interface Props {
  params: Promise<{ locale: string }>;
}

const vatKeywords: Record<Locale, string[]> = {
  en: [
    "VAT calculator Egypt",
    "Egypt 14% VAT calculator",
    "free VAT calculator",
    "value added tax calculator Egypt",
    "add VAT calculator",
    "extract VAT from price",
    "Cashvio",
  ],
  ar: [
    "حاسبة ضريبة القيمة المضافة",
    "حاسبة ضريبة القيمة المضافة مصر",
    "حاسبة ضريبة 14%",
    "حساب ضريبة القيمة المضافة",
    "حاسبة VAT مصر",
    "إضافة ضريبة على السعر",
    "كاشفيو",
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/tools/vat-calculator",
    namespace: "vatCalculator",
    keywords: vatKeywords,
  });
}

export default async function VatCalculatorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ToolPageShell
      locale={locale as Locale}
      namespace="vatCalculator"
      path="/tools/vat-calculator"
      tool={<VatCalculatorTool showAnswerBlock />}
    />
  );
}
