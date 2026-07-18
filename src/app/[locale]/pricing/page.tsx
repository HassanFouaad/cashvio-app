import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n/routing";
import { PricingPlans } from "@/components/sections/pricing-plans";
import { FaqSection, LedgerHero, ReceiptStamp } from "@/components/marketing";
import { getPublicPlans } from "@/lib/http/server";
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
  getProductGroupSchema,
  keywords,
  openGraphDefaults,
  twitterDefaults,
  social,
} from "@/config/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.pricing" });
  const typedLocale = locale as Locale;

  return {
    title: `${t("title")}`,
    description: t("description"),
    keywords: keywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl("/pricing", typedLocale),
      languages: getAlternateUrls("/pricing"),
    },
    openGraph: {
      ...openGraphDefaults,
      title: `${t("title")}`,
      description: t("description"),
      url: getCanonicalUrl("/pricing", typedLocale),
      locale: typedLocale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: getAlternateLocales(typedLocale),
    },
    facebook: {
      appId: social.facebook.appId,
    },
    twitter: {
      ...twitterDefaults,
      title: `${t("title")}`,
      description: t("description"),
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

const planKeys = ["starter", "professional", "enterprise"] as const;
const faqKeys = ["q1", "q2", "q3", "q4"] as const;

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: "pricing" });
  const metaT = await getTranslations({
    locale,
    namespace: "metadata.pricing",
  });

  // Fetch plans from API (SSR) with Accept-Language header
  const plans = await getPublicPlans(undefined, locale);

  // Build fallback plans from translations
  const fallbackPlans = planKeys.map((key) => ({
    key,
    name: t(`${key}.name`),
    description: t(`${key}.description`),
    price: t(`${key}.price`),
    features: t.raw(`${key}.features`) as string[],
  }));

  // Schema.org structured data - Enhanced for SEO 2026
  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === "en" ? "/pricing" : `/ar/pricing`,
    title: metaT("title"),
    description: metaT("description"),
  });

  const faqSchema = schemaTemplates.faqPage(
    faqKeys.map((key) => ({
      question: t(`faq.${key}.question`),
      answer: t(`faq.${key}.answer`),
    }))
  );

  // ProductGroup schema with localized plan descriptions
  const productGroupSchema = getProductGroupSchema(plans);

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: "Home", nameAr: "الرئيسية", url: getCanonicalUrl("", typedLocale) },
    { name: metaT("title"), url: getCanonicalUrl("/pricing", typedLocale) },
  ], typedLocale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(productGroupSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }}
      />

      {/* Header Section */}
      <LedgerHero title={t("title")} subtitle={t("subtitle")} />

      {/* Pricing Cards - SSR from API with fallback */}
      <section className="py-12 sm:py-16">
        <div className="container-wide">
          <PricingPlans
            plans={plans}
            fallbackPlans={fallbackPlans}
            locale={locale}
          />
        </div>
      </section>

      {/* Money Back Guarantee — a stamped ledger note */}
      <section className="py-10 sm:py-12 ledger-rules border-y border-border">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-center gap-5 md:gap-8 text-center md:text-start">
            <ReceiptStamp>{t("guarantee.title")}</ReceiptStamp>
            <p className="text-sm sm:text-base text-muted-foreground max-w-xl">
              {t("guarantee.description")}
            </p>
          </div>
        </div>
      </section>

      <FaqSection
        title={t("faq.title")}
        items={faqKeys.map((key) => ({
          question: t(`faq.${key}.question`),
          answer: t(`faq.${key}.answer`),
        }))}
      />
    </>
  );
}
