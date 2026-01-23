import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n/routing";
import { PricingPlans } from "@/components/sections/pricing-plans";
import { getPublicPlans } from "@/lib/http/server";
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
  keywords,
  openGraphDefaults,
  twitterDefaults,
  brand,
} from "@/config/seo";

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: "metadata.pricing" });
  const typedLocale = locale as Locale;

  return {
    title: `${t("title")} | ${brand.name}`,
    description: t("description"),
    keywords: keywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl("/pricing", typedLocale),
      languages: getAlternateUrls("/pricing"),
    },
    openGraph: {
      ...openGraphDefaults,
      title: `${t("title")} | ${brand.name}`,
      description: t("description"),
      url: getCanonicalUrl("/pricing", typedLocale),
      locale: typedLocale === "ar" ? "ar_EG" : "en_US",
      alternateLocale: getAlternateLocales(typedLocale),
    },
    twitter: {
      ...twitterDefaults,
      title: `${t("title")} | ${brand.name}`,
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

  // Schema.org structured data
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

  const pricingSchema = schemaTemplates.pricingPage([
    { name: "Starter", price: 29, description: t("starter.description") },
    {
      name: "Professional",
      price: 79,
      description: t("professional.description"),
    },
    {
      name: "Enterprise",
      price: 199,
      description: t("enterprise.description"),
    },
  ]);

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: "Home", url: getCanonicalUrl("", typedLocale) },
    { name: metaT("title"), url: getCanonicalUrl("/pricing", typedLocale) },
  ]);

  console.log("Plans", plans);

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
        dangerouslySetInnerHTML={{ __html: serializeSchema(pricingSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }}
      />

      {/* Header Section */}
      <section className="py-10 sm:py-12 md:py-16 bg-gradient-hero">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3">
              {t("title")}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">{t("subtitle")}</p>
          </div>
        </div>
      </section>

      {/* Pricing Cards - SSR from API with fallback */}
      <section className="py-8 sm:py-12 md:py-16 -mt-4 sm:-mt-6 md:-mt-8">
        <div className="container-wide">
          <PricingPlans
            plans={plans}
            fallbackPlans={fallbackPlans}
            locale={locale}
          />
        </div>
      </section>

      {/* Money Back Guarantee */}
      <section className="py-8 sm:py-10 md:py-12 bg-muted/30">
        <div className="container-wide">
          <div className="flex flex-col md:flex-row items-center justify-center gap-3 md:gap-4 text-center md:text-left">
            <div className="w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
              <svg
                className="w-6 h-6 sm:w-7 sm:h-7 md:w-8 md:h-8 text-primary"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>
            <div>
              <h3 className="text-base sm:text-lg md:text-xl font-semibold text-foreground">
                {t("guarantee.title")}
              </h3>
              <p className="text-sm sm:text-base text-muted-foreground">
                {t("guarantee.description")}
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-10 sm:py-12 md:py-16 lg:py-20">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto">
            <h2 className="text-xl sm:text-2xl md:text-3xl font-bold text-center text-foreground mb-6 sm:mb-8 md:mb-10">
              {t("faq.title")}
            </h2>

            <div className="space-y-4">
              {faqKeys.map((key) => (
                <details
                  key={key}
                  className="group rounded-lg border border-border bg-card p-4"
                >
                  <summary className="flex cursor-pointer items-center justify-between font-medium text-foreground">
                    {t(`faq.${key}.question`)}
                    <svg
                      className="w-5 h-5 text-muted-foreground transition-transform group-open:rotate-180"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="m6 9 6 6 6-6" />
                    </svg>
                  </summary>
                  <p className="mt-4 text-muted-foreground">
                    {t(`faq.${key}.answer`)}
                  </p>
                </details>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
