import type { Metadata } from "next";
import { setRequestLocale, getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n/routing";
import { PricingPlans } from "@/components/sections/pricing-plans";
import { AlsoFreeStrip, FaqSection, LedgerHero } from "@/components/marketing";
import { getPublicPlans } from "@/lib/http/server";
import { getWhatsAppLink } from "@/lib/utils/whatsapp";
import { PricingViewTracker, TrackedExternalLink } from "@/lib/analytics";
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

const faqKeys = ["q1", "q2", "q3", "q4", "q5", "q6"] as const;

export default async function PricingPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: "pricing" });
  const metaT = await getTranslations({
    locale,
    namespace: "metadata.pricing",
  });
  const whatsAppLink = getWhatsAppLink(t("whatsapp.prefill"));

  // Fetch plans from API (SSR) with Accept-Language header
  const plans = await getPublicPlans(undefined, locale);

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

      <PricingViewTracker />

      {/* Header Section */}
      <LedgerHero title={t("title")} subtitle={t("subtitle")} trackLocation="/pricing" />

      {/* Pricing Cards - SSR from API with fallback */}
      <section className="py-12 sm:py-16">
        <div className="container-wide">
          <PricingPlans plans={plans} locale={locale} />
        </div>
      </section>

      {/* WhatsApp lane — the channel Egyptian merchants actually prefer */}
      {whatsAppLink && (
        <section aria-label={t("whatsapp.title")} className="py-10 sm:py-12">
          <div className="container-wide">
            <div className="receipt-edge bg-card max-w-2xl mx-auto px-6 py-7 flex flex-col sm:flex-row items-center justify-between gap-5">
              <div className="text-center sm:text-start">
                <h2 className="text-lg font-semibold text-foreground">{t("whatsapp.title")}</h2>
                <p className="mt-1 text-sm text-muted-foreground">{t("whatsapp.subtitle")}</p>
              </div>
              <TrackedExternalLink
                href={whatsAppLink}
                trackLocation="pricing_page"
                trackKind="whatsapp"
                className="inline-flex items-center gap-2 h-11 px-6 rounded-lg bg-primary text-primary-foreground font-medium hover:bg-primary-dark transition-colors duration-200 shrink-0"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                </svg>
                {t("whatsapp.cta")}
              </TrackedExternalLink>
            </div>
          </div>
        </section>
      )}

      <AlsoFreeStrip locale={locale} />

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
