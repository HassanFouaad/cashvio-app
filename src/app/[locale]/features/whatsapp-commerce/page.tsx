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
    'WhatsApp order updates',
    'WhatsApp POS Egypt',
    'share receipt WhatsApp',
    'WhatsApp commerce',
    'order status WhatsApp',
    'كاشير واتساب',
    'Cashvio',
  ],
  ar: [
    'كاشير واتساب',
    'تحديثات طلبات واتساب',
    'إيصال واتساب',
    'بيع على واتساب',
    'مشاركة طلب واتساب',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/features/whatsapp-commerce',
    namespace: 'whatsappCommerce',
    keywords,
  });
}

export default async function WhatsappCommercePage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <FeatureLandingShell
      locale={locale as Locale}
      namespace="whatsappCommerce"
      path="/features/whatsapp-commerce"
      breadcrumbNameEn="WhatsApp Commerce"
      breadcrumbNameAr="البيع عبر واتساب"
    />
  );
}
