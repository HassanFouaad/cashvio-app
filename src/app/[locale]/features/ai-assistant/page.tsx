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
    'AI assistant for retail',
    'POS chat assistant',
    'retail inventory questions',
    'shop management AI',
    'Cashvio assistant',
    'Arabic POS assistant',
    'store analytics chat',
  ],
  ar: [
    'مساعد ذكي للمحلات',
    'ذكاء اصطناعي POS',
    'أسئلة المخزون',
    'مساعد كاشفيو',
    'تحليلات المبيعات بالذكاء الاصطناعي',
    'مساعد عربي للتجارة',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/features/ai-assistant',
    namespace: 'aiAssistant',
    keywords,
  });
}

export default async function AiAssistantPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <FeatureLandingShell
      locale={locale as Locale}
      namespace="aiAssistant"
      path="/features/ai-assistant"
      breadcrumbNameEn="AI Assistant"
      breadcrumbNameAr="المساعد الذكي"
    />
  );
}
