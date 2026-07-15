import type { Metadata } from 'next';
import { getTranslations, setRequestLocale } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { Badge } from '@/components/ui/badge';
import { ButtonLink } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
  openGraphDefaults,
  twitterDefaults,
  brand,
  social,
} from '@/config/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.arabicPos' });
  const typedLocale = locale as Locale;

  const arabicPosKeywords: Record<Locale, string[]> = {
    en: [
      'Arabic POS system',
      'Arabic point of sale',
      'RTL POS software',
      'best POS for Arabic',
      'bilingual POS system',
      'Arabic storefront',
      'MENA POS system',
      'ZATCA compliant POS',
      'Arabic e-invoicing',
      'Middle East POS',
      'Saudi Arabia POS',
      'UAE POS system',
      'Egypt POS system',
      'Kuwait POS system',
      'Arabic online store',
      'right to left POS',
      'Arabic retail software',
      'Mada payment POS',
      'KNET payment POS',
      'Arabic receipt printing',
      'bilingual receipt POS',
      'GCC POS system',
      'Arabic inventory management',
      'Cashvio Arabic POS',
      'Cashvio',
    ],
    ar: [
      'نظام نقاط بيع عربي',
      'نقاط البيع بالعربي',
      'أفضل نظام POS عربي',
      'كاشفيو',
      'كاشفيو نقاط البيع',
      'نظام نقاط بيع السعودية',
      'نظام نقاط بيع الإمارات',
      'نظام نقاط بيع مصر',
      'فوترة إلكترونية زاتكا',
      'متجر إلكتروني عربي',
      'نظام كاشير عربي',
      'برنامج نقاط بيع عربي',
      'نظام بيع من اليمين لليسار',
      'إيصالات عربية',
      'نظام بيع ثنائي اللغة',
      'نظام بيع الشرق الأوسط',
      'دفع مدى',
      'نظام بيع كي نت',
      'متجر الكتروني RTL',
      'برنامج كاشير للمتاجر',
    ],
  };

  return {
    title: t('title'),
    description: t('description'),
    keywords: arabicPosKeywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('/features/arabic-pos', typedLocale),
      languages: getAlternateUrls('/features/arabic-pos'),
    },
    openGraph: {
      ...openGraphDefaults,
      title: t('title'),
      description: t('description'),
      url: getCanonicalUrl('/features/arabic-pos', typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: getAlternateLocales(typedLocale),
    },
    facebook: {
      appId: social.facebook.appId,
    },
    twitter: {
      ...twitterDefaults,
      title: t('title'),
      description: t('description'),
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
        'max-video-preview': -1,
      },
    },
  };
}

const painPointIcons = {
  brokenLayouts: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z" />
    </svg>
  ),
  wrongDirection: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 21L3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
    </svg>
  ),
  poorTypography: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.98 8.223A10.477 10.477 0 001.934 12C3.226 16.338 7.244 19.5 12 19.5c.993 0 1.953-.138 2.863-.395M6.228 6.228A10.45 10.45 0 0112 4.5c4.756 0 8.773 3.162 10.065 7.498a10.523 10.523 0 01-4.293 5.774M6.228 6.228L3 3m3.228 3.228l3.65 3.65m7.894 7.894L21 21m-3.228-3.228l-3.65-3.65m0 0a3 3 0 10-4.243-4.243m4.242 4.242L9.88 9.88" />
    </svg>
  ),
  receiptsInvoices: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 14.25v-2.625a3.375 3.375 0 00-3.375-3.375h-1.5A1.125 1.125 0 0113.5 7.125v-1.5a3.375 3.375 0 00-3.375-3.375H8.25m0 12.75h7.5m-7.5 3H12M10.5 2.25H5.625c-.621 0-1.125.504-1.125 1.125v17.25c0 .621.504 1.125 1.125 1.125h12.75c.621 0 1.125-.504 1.125-1.125V11.25a9 9 0 00-9-9z" />
    </svg>
  ),
  noLocalPayments: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" />
    </svg>
  ),
  seoBlindSpot: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
    </svg>
  ),
};

const solutionIcons = {
  mirroredInterface: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0V12a9 9 0 01-9 9m0 0a9 9 0 01-9-9" />
    </svg>
  ),
  mixedContent: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 21l5.25-11.25L21 21m-9-3h7.5M3 5.621a48.474 48.474 0 016-.371m0 0c1.12 0 2.233.038 3.334.114M9 5.25V3m3.334 2.364C11.176 10.658 7.69 15.08 3 17.502m9.334-12.138c.896.061 1.785.147 2.666.257m-4.589 8.495a18.023 18.023 0 01-3.827-5.802" />
    </svg>
  ),
  arabicTypography: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
    </svg>
  ),
  instantSwitch: (
    <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M16.023 9.348h4.992v-.001M2.985 19.644v-4.992m0 0h4.992m-4.993 0l3.181 3.183a8.25 8.25 0 0013.803-3.7M4.031 9.865a8.25 8.25 0 0113.803-3.7l3.181 3.182" />
    </svg>
  ),
};

const posFeatureKeys = ['checkout', 'receipts', 'shifts', 'offline', 'hardware'] as const;
const storefrontFeatureKeys = ['rtlShopping', 'arabicSeo', 'bilingualCatalog', 'arabicNotifications', 'digitalReceipts'] as const;
const painPointKeys = ['brokenLayouts', 'wrongDirection', 'poorTypography', 'receiptsInvoices', 'noLocalPayments', 'seoBlindSpot'] as const;
const solutionKeys = ['mirroredInterface', 'mixedContent', 'arabicTypography', 'instantSwitch'] as const;

const comparisonRowKeys = ['rtlInterface', 'bilingualReceipts', , 'arabicSeo', 'arabicTypography', 'languageSwitching', 'arabicReports'] as const;
const faqKeys = ['q1', 'q2',  'q4', 'q5', 'q6',  'q8', 'q9', 'q10'] as const;
const statKeys = ['businesses', 'transactions', 'countries', 'uptime'] as const;

const posFeatureIcons: Record<string, React.ReactNode> = {
  checkout: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 3h1.386c.51 0 .955.343 1.087.835l.383 1.437M7.5 14.25a3 3 0 00-3 3h15.75m-12.75-3h11.218c1.121-2.3 2.1-4.684 2.924-7.138a60.114 60.114 0 00-16.536-1.84M7.5 14.25L5.106 5.272M6 20.25a.75.75 0 11-1.5 0 .75.75 0 011.5 0zm12.75 0a.75.75 0 11-1.5 0 .75.75 0 011.5 0z" /></svg>,
  receipts: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 002.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 00-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 00.75-.75 2.25 2.25 0 00-.1-.664m-5.8 0A2.251 2.251 0 0113.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25z" /></svg>,
  zatca: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z" /></svg>,
  shifts: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z" /></svg>,
  offline: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M8.288 15.038a5.25 5.25 0 017.424 0M5.106 11.856c3.807-3.808 9.98-3.808 13.788 0M1.924 8.674c5.565-5.565 14.587-5.565 20.152 0M12.53 18.22l-.53.53-.53-.53a.75.75 0 011.06 0z" /></svg>,
  hardware: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M6.72 13.829c-.24.03-.48.062-.72.096m.72-.096a42.415 42.415 0 0110.56 0m-10.56 0L6.34 18m10.94-4.171c.24.03.48.062.72.096m-.72-.096L17.66 18m0 0l.229 2.523a1.125 1.125 0 01-1.12 1.227H7.231c-.662 0-1.18-.568-1.12-1.227L6.34 18m11.318 0h1.091A2.25 2.25 0 0021 15.75V9.456c0-1.081-.768-2.015-1.837-2.175a48.055 48.055 0 00-1.913-.247M6.34 18H5.25A2.25 2.25 0 013 15.75V9.456c0-1.081.768-2.015 1.837-2.175a48.041 48.041 0 011.913-.247m10.5 0a48.536 48.536 0 00-10.5 0m10.5 0V3.375c0-.621-.504-1.125-1.125-1.125h-8.25c-.621 0-1.125.504-1.125 1.125v3.659M18 10.5h.008v.008H18V10.5zm-3 0h.008v.008H15V10.5z" /></svg>,
};

const storefrontFeatureIcons: Record<string, React.ReactNode> = {
  rtlShopping: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M13.5 21v-7.5a.75.75 0 01.75-.75h3a.75.75 0 01.75.75V21m-4.5 0H2.36m11.14 0H18m0 0h3.64m-1.39 0V9.349m-16.5 11.65V9.35m0 0a3.001 3.001 0 003.75-.615A2.993 2.993 0 009.75 9.75c.896 0 1.7-.393 2.25-1.016a2.993 2.993 0 002.25 1.016c.896 0 1.7-.393 2.25-1.016a3.001 3.001 0 003.75.614m-16.5 0a3.004 3.004 0 01-.621-4.72L4.318 3.44A1.5 1.5 0 015.378 3h13.243a1.5 1.5 0 011.06.44l1.19 1.189a3 3 0 01-.621 4.72m-13.5 8.65h3.75a.75.75 0 00.75-.75V13.5a.75.75 0 00-.75-.75H6.75a.75.75 0 00-.75.75v3.15c0 .415.336.75.75.75z" /></svg>,
  arabicSeo: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M3.75 3v11.25A2.25 2.25 0 006 16.5h2.25M3.75 3h-1.5m1.5 0h16.5m0 0h1.5m-1.5 0v11.25A2.25 2.25 0 0118 16.5h-2.25m-7.5 0h7.5m-7.5 0l-1 3m8.5-3l1 3m0 0l.5 1.5m-.5-1.5h-9.5m0 0l-.5 1.5M9 11.25v1.5M12 9v3.75m3-6v6" /></svg>,
  localPayments: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M2.25 8.25h19.5M2.25 9h19.5m-16.5 5.25h6m-6 2.25h3m-3.75 3h15a2.25 2.25 0 002.25-2.25V6.75A2.25 2.25 0 0019.5 4.5h-15a2.25 2.25 0 00-2.25 2.25v10.5A2.25 2.25 0 004.5 19.5z" /></svg>,
  bilingualCatalog: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25" /></svg>,
  arabicNotifications: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M14.857 17.082a23.848 23.848 0 005.454-1.31A8.967 8.967 0 0118 9.75v-.7V9A6 6 0 006 9v.75a8.967 8.967 0 01-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 01-5.714 0m5.714 0a3 3 0 11-5.714 0" /></svg>,
  digitalReceipts: <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1.5}><path strokeLinecap="round" strokeLinejoin="round" d="M7.217 10.907a2.25 2.25 0 100 2.186m0-2.186c.18.324.283.696.283 1.093s-.103.77-.283 1.093m0-2.186l9.566-5.314m-9.566 7.5l9.566 5.314m0 0a2.25 2.25 0 103.935 2.186 2.25 2.25 0 00-3.935-2.186zm0-12.814a2.25 2.25 0 103.933-2.185 2.25 2.25 0 00-3.933 2.185z" /></svg>,
};

const posAccentColors = [
  'border-l-emerald-500 hover:shadow-emerald-500/10',
  'border-l-teal-500 hover:shadow-teal-500/10',
  'border-l-cyan-500 hover:shadow-cyan-500/10',
  'border-l-sky-500 hover:shadow-sky-500/10',
  'border-l-emerald-400 hover:shadow-emerald-400/10',
  'border-l-teal-400 hover:shadow-teal-400/10',
];

const storefrontAccentColors = [
  'border-l-purple-500 hover:shadow-purple-500/10',
  'border-l-violet-500 hover:shadow-violet-500/10',
  'border-l-fuchsia-500 hover:shadow-fuchsia-500/10',
  'border-l-pink-500 hover:shadow-pink-500/10',
  'border-l-purple-400 hover:shadow-purple-400/10',
  'border-l-violet-400 hover:shadow-violet-400/10',
];

const marketFlags: Record<string, string> = {
  ksa: '🇸🇦',
  uae: '🇦🇪',
  egypt: '🇪🇬',
  kuwait: '🇰🇼',
  gcc: '🌍',
};

export default async function ArabicPosPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'arabicPos' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.arabicPos' });

  const registerLink = typedLocale === 'en' ? '/register' : '/ar/register';
  const pricingLink = typedLocale === 'en' ? '/pricing' : '/ar/pricing';
  const featuresLink = typedLocale === 'en' ? '/features' : '/ar/features';

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/features/arabic-pos' : '/ar/features/arabic-pos',
    title: metaT('title'),
    description: metaT('description'),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: 'Features', nameAr: 'المميزات', url: getCanonicalUrl('/features', typedLocale) },
    { name: 'Arabic POS & Storefront', nameAr: 'نقاط البيع العربية', url: getCanonicalUrl('/features/arabic-pos', typedLocale) },
  ], typedLocale);

  const faqSchema = schemaTemplates.faqPage(
    faqKeys.map((key) => ({
      question: t(`faq.${key}.question`),
      answer: t(`faq.${key}.answer`),
    }))
  );

  const softwareAppSchema = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: `${brand.name} Arabic POS`,
    alternateName: ['كاشفيو نقاط البيع العربية', 'Cashvio Arabic Point of Sale'],
    applicationCategory: 'BusinessApplication',
    applicationSubCategory: 'Point of Sale Software',
    operatingSystem: 'Web, iOS, Android',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
      description: 'Free forever plan available',
    },
    featureList: [
      'Native Arabic RTL interface',
      'Bilingual Arabic-English receipts',
      'ZATCA e-invoicing compliance',
      'MENA payment integrations (Mada, KNET, Tabby, Tamara)',
      'Per-user language preference',
      'Arabic storefront with SEO',
      'Offline POS capability',
      'Arabic thermal receipt printing',
    ],
    inLanguage: ['ar', 'en'],
    availableLanguage: [
      { '@type': 'Language', name: 'Arabic', alternateName: 'ar' },
      { '@type': 'Language', name: 'English', alternateName: 'en' },
    ],
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      reviewCount: '500',
      bestRating: '5',
      worstRating: '1',
    },
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(faqSchema) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: serializeSchema(softwareAppSchema) }} />

      {/* ===== HERO ===== */}
      <section aria-label="Hero" className="relative overflow-hidden section-padding">
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[70%] rounded-full bg-primary/[0.04] blur-[100px]" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[40%] h-[50%] rounded-full bg-purple-500/[0.03] blur-[80px]" />
          <div className="absolute top-[30%] left-[40%] w-[30%] h-[40%] rounded-full bg-amber-400/[0.03] blur-[90px]" />
        </div>
        <div className="container-wide">
          <div className="text-center max-w-4xl mx-auto">
            <Badge className="mb-4 sm:mb-5 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">
              {t('hero.badge')}
            </Badge>
            <h1 className="animate-fade-up text-3xl sm:text-4xl md:text-5xl lg:text-[3.5rem] tracking-tight text-foreground mb-5 sm:mb-6 leading-[1.15]">
              <span className="font-normal">{t('hero.title')}</span>{' '}
              <span className="font-bold text-primary">{t('hero.titleHighlight')}</span>
            </h1>
            <p className="animate-fade-up animate-delay-100 text-base sm:text-lg md:text-xl text-muted-foreground leading-relaxed mb-8 sm:mb-10 max-w-3xl mx-auto">
              {t('hero.subtitle')}
            </p>
            <div className="animate-fade-up animate-delay-200 flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
              <ButtonLink
                size="xl"
                href={registerLink}
                className="group w-full sm:w-auto text-sm sm:text-base rounded-2xl shadow-lg shadow-primary/20 hover:shadow-xl hover:shadow-primary/30 transition-all duration-300"
              >
                <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
                {t('hero.cta')}
              </ButtonLink>
              <ButtonLink
                variant="outline"
                size="xl"
                href={featuresLink}
                className="w-full sm:w-auto text-sm sm:text-base rounded-2xl"
              >
                {t('hero.secondaryCta')}
              </ButtonLink>
            </div>
          
          </div>
        </div>
      </section>

      {/* ===== STATS ===== */}
    

      {/* ===== THE PROBLEM ===== */}
      <section aria-label="The Problem" className="section-padding">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge variant="destructive" className="mb-4 sm:mb-5 text-xs sm:text-sm rounded-full px-3.5 py-1.5">
              {t('problem.badge')}
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t('problem.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              {t('problem.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {painPointKeys.map((key) => (
              <div
                key={key}
                className="group relative rounded-2xl bg-card border border-destructive/20 p-5 sm:p-6 hover:shadow-lg hover:border-destructive/40 transition-all duration-300"
              >
                <div className="w-11 h-11 rounded-xl bg-destructive/10 text-destructive flex items-center justify-center mb-4">
                  {painPointIcons[key]}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">
                  {t(`problem.painPoints.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`problem.painPoints.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== THE SOLUTION ===== */}
      <section aria-label="Our Solution" className="section-padding bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge className="mb-4 sm:mb-5 bg-primary/10 text-primary border-primary/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">
              {t('solution.badge')}
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t('solution.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              {t('solution.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6 max-w-4xl mx-auto">
            {solutionKeys.map((key) => (
              <div
                key={key}
                className="group flex items-start gap-4 p-6 sm:p-8 rounded-2xl bg-card border border-primary/20 hover:shadow-xl hover:border-primary/40 hover:-translate-y-0.5 transition-all duration-300"
              >
                <div className="w-12 h-12 rounded-xl bg-primary/10 text-primary flex items-center justify-center flex-shrink-0 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {solutionIcons[key]}
                </div>
                <div>
                  <h3 className="text-base sm:text-lg font-semibold text-foreground mb-2">
                    {t(`solution.points.${key}.title`)}
                  </h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`solution.points.${key}.description`)}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== POS FEATURES ===== */}
      <section aria-label="POS Features" className="section-padding">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge className="mb-4 sm:mb-5 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">
              {t('pos.badge')}
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t('pos.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              {t('pos.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {posFeatureKeys.map((key, i) => (
              <div
                key={key}
                className={cn(
                  'group relative rounded-2xl bg-card border border-border/60 border-l-4 p-5 sm:p-6',
                  'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300',
                  posAccentColors[i]
                )}
              >
                <div className="w-11 h-11 rounded-xl bg-primary/10 text-primary flex items-center justify-center mb-4 group-hover:bg-primary group-hover:text-primary-foreground transition-colors duration-300">
                  {posFeatureIcons[key]}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">
                  {t(`pos.features.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`pos.features.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== STOREFRONT FEATURES ===== */}
      <section aria-label="Storefront Features" className="section-padding bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <Badge className="mb-4 sm:mb-5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border-purple-500/20 text-xs sm:text-sm rounded-full px-3.5 py-1.5">
              {t('storefront.badge')}
            </Badge>
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t('storefront.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              {t('storefront.subtitle')}
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
            {storefrontFeatureKeys.map((key, i) => (
              <div
                key={key}
                className={cn(
                  'group relative rounded-2xl bg-card border border-border/60 border-l-4 p-5 sm:p-6',
                  'hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300',
                  storefrontAccentColors[i]
                )}
              >
                <div className="w-11 h-11 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400 flex items-center justify-center mb-4 group-hover:bg-purple-500 group-hover:text-white transition-colors duration-300">
                  {storefrontFeatureIcons[key]}
                </div>
                <h3 className="text-base sm:text-lg font-semibold text-foreground mb-1.5">
                  {t(`storefront.features.${key}.title`)}
                </h3>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  {t(`storefront.features.${key}.description`)}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ===== REGIONAL MARKETS ===== */}
    

      {/* ===== COMPARISON TABLE ===== */}
      <section aria-label="Comparison" className="section-padding bg-muted/20">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t('comparison.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              {t('comparison.subtitle')}
            </p>
          </div>
          <div className="max-w-4xl mx-auto overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr className="border-b border-border">
                  <th className="text-start p-3 sm:p-4 text-sm font-semibold text-muted-foreground w-[40%]">
                    {t('comparison.headers.feature')}
                  </th>
                  <th className="text-start p-3 sm:p-4 text-sm font-semibold text-primary w-[30%]">
                    {t('comparison.headers.cashvio')}
                  </th>
                  <th className="text-start p-3 sm:p-4 text-sm font-semibold text-muted-foreground w-[30%]">
                    {t('comparison.headers.others')}
                  </th>
                </tr>
              </thead>
              <tbody>
                {comparisonRowKeys.map((key, i) => (
                  <tr key={key} className={cn('border-b border-border/50', i % 2 === 0 && 'bg-card/50')}>
                    <td className="p-3 sm:p-4 text-sm font-medium text-foreground">
                      {t(`comparison.rows.${key}.feature`)}
                    </td>
                    <td className="p-3 sm:p-4 text-sm text-foreground">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-primary flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t(`comparison.rows.${key}.cashvio`)}
                      </div>
                    </td>
                    <td className="p-3 sm:p-4 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <svg className="w-5 h-5 text-destructive/60 flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 9.75l4.5 4.5m0-4.5l-4.5 4.5M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        {t(`comparison.rows.${key}.others`)}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== FAQ ===== */}
      <section aria-label="FAQ" className="section-padding">
        <div className="container-wide">
          <div className="text-center max-w-3xl mx-auto mb-10 sm:mb-14">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground mb-3">
              {t('faq.title')}
            </h2>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              {t('faq.subtitle')}
            </p>
          </div>
          <div className="max-w-3xl mx-auto space-y-4">
            {faqKeys.map((key) => (
              <details
                key={key}
                className="group rounded-2xl bg-card border border-border/60 hover:border-primary/30 transition-colors duration-200"
              >
                <summary className="cursor-pointer list-none p-5 sm:p-6 flex items-center justify-between gap-4">
                  <h3 className="text-sm sm:text-base font-semibold text-foreground">
                    {t(`faq.${key}.question`)}
                  </h3>
                  <svg
                    className="w-5 h-5 text-muted-foreground flex-shrink-0 group-open:rotate-180 transition-transform duration-200"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19.5 8.25l-7.5 7.5-7.5-7.5" />
                  </svg>
                </summary>
                <div className="px-5 sm:px-6 pb-5 sm:pb-6 -mt-1">
                  <p className="text-sm text-muted-foreground leading-relaxed">
                    {t(`faq.${key}.answer`)}
                  </p>
                </div>
              </details>
            ))}
          </div>
        </div>
      </section>

      {/* ===== CTA ===== */}
      <section aria-label="Call to action" className="section-padding-sm">
        <div className="container-wide">
          <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-emerald-600 via-teal-600 to-emerald-700 p-8 sm:p-10 md:p-14 lg:p-20 text-center">
            <div className="absolute top-0 left-0 w-64 h-64 bg-white/5 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute bottom-0 right-0 w-80 h-80 bg-white/5 rounded-full blur-3xl translate-x-1/3 translate-y-1/3" />
            <div className="relative z-10 max-w-2xl mx-auto">
              <h2 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-4 leading-tight">
                {t('cta.title')}
              </h2>
              <p className="text-base sm:text-lg md:text-xl text-white/80 mb-8 max-w-xl mx-auto">
                {t('cta.subtitle')}
              </p>
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <ButtonLink
                  size="xl"
                  className="bg-white text-emerald-700 hover:bg-white/90 shadow-glow-lg rounded-2xl text-sm sm:text-base font-semibold"
                  href={registerLink}
                >
                  <svg className="w-4 h-4 sm:w-5 sm:h-5 mr-1.5" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                  {t('cta.button')}
                </ButtonLink>
                <ButtonLink
                  variant="outline"
                  size="lg"
                  className="border-white/30 text-white hover:bg-white/10 rounded-2xl font-semibold"
                  href={pricingLink}
                >
                  {t('cta.secondaryButton')}
                </ButtonLink>
              </div>
              <p className="mt-6 text-sm text-white/60">
                {t('cta.note')}
              </p>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
