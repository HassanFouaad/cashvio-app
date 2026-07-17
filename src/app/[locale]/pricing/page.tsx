import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n/routing";
import { PricingPlans } from "@/components/sections/pricing-plans";
import { IconTile, FaqSection } from "@/components/marketing";
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
      <section className="hero-wash border-b border-border py-12 sm:py-16">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-3xl sm:text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
              {t("title")}
            </h1>
            <p className="text-base sm:text-lg text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
      </section>

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

      {/* Money Back Guarantee */}
      <section className="py-10 sm:py-12 bg-muted/40 border-y border-border">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4 text-center md:text-start">
            <IconTile size="lg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </IconTile>
            <div>
              <h2 className="text-base sm:text-lg font-semibold text-foreground">
                {t("guarantee.title")}
              </h2>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t("guarantee.description")}
              </p>
            </div>
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
