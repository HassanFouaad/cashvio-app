import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { ToolPageShell } from '@/features/tools/tool-page-shell';
import { InvoiceGeneratorTool } from '@/features/tools/components';

interface Props {
  params: Promise<{ locale: string }>;
}

const invoiceKeywords: Record<Locale, string[]> = {
  en: [
    'free invoice generator',
    'printable invoice maker',
    'free receipt maker',
    'bilingual invoice generator',
    'invoice generator Egypt',
    'make an invoice online free',
    'Cashvio',
  ],
  ar: [
    'عمل فاتورة',
    'عمل فاتورة مجاني',
    'مولد فواتير مجاني',
    'إنشاء فاتورة للطباعة',
    'عمل إيصال بيع',
    'فاتورة عربية وإنجليزية',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/tools/invoice-generator',
    namespace: 'invoiceGenerator',
    keywords: invoiceKeywords,
  });
}

export default async function InvoiceGeneratorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ToolPageShell
      locale={locale as Locale}
      namespace="invoiceGenerator"
      path="/tools/invoice-generator"
      tool={<InvoiceGeneratorTool />}
    />
  );
}
