import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { ToolPageShell } from '@/features/tools/tool-page-shell';
import { QrGeneratorTool } from '@/features/tools/components';

interface Props {
  params: Promise<{ locale: string }>;
}

const qrKeywords: Record<Locale, string[]> = {
  en: [
    'free QR code generator',
    'QR code generator online',
    'QR code maker free',
    'QR code for my store',
    'WhatsApp QR code generator',
    'menu QR code generator',
    'download QR code PNG',
    'Cashvio',
  ],
  ar: [
    'مولد QR مجاني',
    'انشاء رمز QR اون لاين',
    'عمل باركود QR للمحل',
    'QR كود للواتساب',
    'QR كود للمنيو',
    'تحميل رمز QR PNG',
    'مولد كيو ار كود مجاني',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/tools/qr-code-generator',
    namespace: 'qrCodeGenerator',
    keywords: qrKeywords,
  });
}

export default async function QrCodeGeneratorPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <ToolPageShell
      locale={locale as Locale}
      namespace="qrCodeGenerator"
      path="/tools/qr-code-generator"
      tool={<QrGeneratorTool />}
    />
  );
}
