import type { Metadata } from "next";
import { setRequestLocale } from "next-intl/server";

import { type Locale } from "@/i18n/routing";
import { buildPageMetadata } from "@/lib/seo/page-metadata";
import { ToolPageShell } from "@/features/tools/tool-page-shell";
import { DeadStockReportTool } from "@/features/tools/components";

interface Props {
  params: Promise<{ locale: string }>;
}

const deadStockKeywords: Record<Locale, string[]> = {
  en: [
    "dead stock report template",
    "slow moving inventory report",
    "aging stock analysis",
    "inventory aging report Egypt",
    "stock aging calculator",
    "dead stock template free",
    "non-moving inventory report",
    "stock aging analysis",
    "Cashvio",
  ],
  ar: [
    "تقرير المخزون الراكد",
    "نموذج تقرير المخزون الراكد",
    "تحليل المخزون البطيء",
    "تقرير أعمار المخزون",
    "حساب المخزون الراكد",
    "قالب مخزون راكد مجاني",
    "تقرير البضاعة الراكدة",
    "كاشفيو",
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: "/tools/dead-stock-report",
    namespace: "deadStockReport",
    keywords: deadStockKeywords,
  });
}

export default async function DeadStockReportPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ToolPageShell
      locale={locale as Locale}
      namespace="deadStockReport"
      path="/tools/dead-stock-report"
      tool={<DeadStockReportTool />}
    />
  );
}
