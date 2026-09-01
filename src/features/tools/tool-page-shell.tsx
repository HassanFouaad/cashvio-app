import type { ReactNode } from "react";
import { getTranslations } from "next-intl/server";

import { type Locale } from "@/i18n/routing";
import {
  LedgerHero,
  LedgerHeading,
  LedgerCta,
  ReceiptCard,
  FaqSection,
} from "@/components/marketing";
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  brand,
  urls,
} from "@/config/seo";

interface ToolPageShellProps {
  locale: Locale;
  /** Content namespace, e.g. "barcodeGenerator" (metadata under metadata.<ns>) */
  namespace: string;
  /** Path without locale prefix, e.g. "/tools/barcode-generator" */
  path: string;
  /** The interactive tool (client component) */
  tool: ReactNode;
}

const stepKeys = ["s1", "s2", "s3"] as const;
const pitchKeys = ["p1", "p2", "p3"] as const;
const faqKeys = ["q1", "q2", "q3"] as const;

/**
 * Shared layout for the free-tools pages: hero, the tool itself, a
 * how-to-use section, a Cashvio cross-sell strip, FAQ (with schema),
 * and the closing register CTA.
 */
export async function ToolPageShell({
  locale,
  namespace,
  path,
  tool,
}: ToolPageShellProps) {
  const t = await getTranslations({ locale, namespace });
  const metaT = await getTranslations({
    locale,
    namespace: `metadata.${namespace}`,
  });
  const tLedger = await getTranslations({ locale, namespace: "ledger" });
  const tTools = await getTranslations({ locale, namespace: "tools" });

  const registerLink = locale === "en" ? "/register" : "/ar/register";
  const toolsLink = locale === "en" ? "/tools" : "/ar/tools";
  const localizedPath = locale === "en" ? path : `/ar${path}`;
  const itemCode = (index: number): string =>
    `${tLedger("item")} ${String(index + 1).padStart(2, "0")}`;

  const webPageSchema = schemaTemplates.webPage({
    locale,
    path: localizedPath,
    title: metaT("title"),
    description: metaT("description"),
  });

  const breadcrumbSchema = schemaTemplates.breadcrumb(
    [
      { name: "Home", nameAr: "الرئيسية", url: getCanonicalUrl("", locale) },
      {
        name: "Free Tools",
        nameAr: "أدوات مجانية",
        url: getCanonicalUrl("/tools", locale),
      },
      { name: metaT("title"), url: getCanonicalUrl(path, locale) },
    ],
    locale,
  );

  const faqItems = faqKeys.map((key) => ({
    question: t(`faq.${key}.question`),
    answer: t(`faq.${key}.answer`),
  }));
  const faqSchema = schemaTemplates.faqPage(faqItems);

  // Free browser utility — helps rank for "free <tool>" queries
  const toolSchema = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    name: metaT("title"),
    description: metaT("description"),
    url: `${urls.site}${localizedPath}`,
    applicationCategory: "UtilitiesApplication",
    operatingSystem: "Any (Web-based)",
    isAccessibleForFree: true,
    offers: { "@type": "Offer", price: "0", priceCurrency: "EGP" },
    provider: { "@id": `${urls.site}/#organization` },
    inLanguage: ["en", "ar"],
    creator: { "@type": "Organization", name: brand.name, url: urls.site },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(faqSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(toolSchema) }}
      />

      <LedgerHero
        eyebrow={tTools("badge")}
        title={t("hero.title")}
        titleHighlight={t("hero.titleHighlight")}
        subtitle={t("hero.subtitle")}
        stamp={tTools("freeStamp")}
      />

      {/* The tool */}
      <section aria-label={metaT("title")} className="section-padding-sm">
        <div className="container-wide">{tool}</div>
      </section>

      {/* How to use */}
      <section
        aria-label={t("steps.title")}
        className="section-padding-sm ledger-rules border-y border-border"
      >
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger("no")} 01 · ${t("steps.badge")}`}
            title={t("steps.title")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {stepKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`steps.${key}.title`)}
                description={t(`steps.${key}.description`)}
              />
            ))}
          </div>
        </div>
      </section>

      {/* Cashvio cross-sell */}
      <section aria-label={t("pitch.title")} className="section-padding-sm">
        <div className="container-wide">
          <LedgerHeading
            eyebrow={`${tLedger("no")} 02 · ${t("pitch.badge")}`}
            title={t("pitch.title")}
            subtitle={t("pitch.subtitle")}
          />
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {pitchKeys.map((key, index) => (
              <ReceiptCard
                key={key}
                code={itemCode(index)}
                title={t(`pitch.${key}.title`)}
                description={t(`pitch.${key}.description`)}
              />
            ))}
          </div>
          <p className="mt-8">
            <a
              href={toolsLink}
              className="inline-flex items-center gap-2 font-receipt text-sm text-primary hover:underline"
            >
              {tTools("moreTools")}
              <span aria-hidden="true" className="rtl:-scale-x-100">
                -&gt;
              </span>
            </a>
          </p>
        </div>
      </section>

      <FaqSection title={t("faq.title")} items={faqItems} />

      <LedgerCta
        title={t("cta.title")}
        subtitle={t("cta.subtitle")}
        primaryAction={{ label: t("cta.button"), href: registerLink }}
        note={t("cta.note")}
        stamp={tTools("freeStamp")}
        trackLocation={path}
      />
    </>
  );
}
