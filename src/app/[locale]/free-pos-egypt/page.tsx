import type { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { buildPageMetadata } from '@/lib/seo/page-metadata';
import { IndustryPageShell } from '@/features/industries/industry-page-shell';

interface Props {
  params: Promise<{ locale: string }>;
}

const keywords: Record<Locale, string[]> = {
  en: [
    'free POS Egypt',
    'free cashier Egypt',
    'free POS system Egypt',
    'كاشير مجاني مصر',
    'POS software price Egypt',
    'free Arabic POS Egypt',
    'EGP free POS',
    'Cashvio',
  ],
  ar: [
    'كاشير مجاني مصر',
    'برنامج كاشير مجاني مصر',
    'نظام نقاط بيع مجاني مصر',
    'أسعار برنامج كاشير في مصر',
    'كاشير مجاني بالجنيه',
    'برنامج كاشير عربي مصر',
    'كاشفيو',
  ],
};

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  return buildPageMetadata({
    locale,
    path: '/free-pos-egypt',
    namespace: 'freePosEgypt',
    keywords,
  });
}

export default async function FreePosEgyptPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  return (
    <IndustryPageShell
      locale={locale as Locale}
      namespace="freePosEgypt"
      path="/free-pos-egypt"
    />
  );
}
