import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { ContactForm } from '@/components/forms/contact-form';
import { buttonVariants } from '@/components/ui/button';
import { LedgerHero } from '@/components/marketing';
import { Link } from '@/i18n/navigation';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  getAlternateLocales,
  keywords,
  openGraphDefaults,
  twitterDefaults,
  contact,
  social,
} from '@/config/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.contact' });
  const typedLocale = locale as Locale;

  return {
    title: `${t('title')}`,
    description: t('description'),
    keywords: keywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('/contact', typedLocale),
      languages: getAlternateUrls('/contact'),
    },
    openGraph: {
      ...openGraphDefaults,
      title: `${t('title')}`,
      description: t('description'),
      url: getCanonicalUrl('/contact', typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: getAlternateLocales(typedLocale),
    },
    facebook: {
      appId: social.facebook.appId,
    },
    twitter: {
      ...twitterDefaults,
      title: `${t('title')}`,
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

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);
  const typedLocale = locale as Locale;

  const t = await getTranslations({ locale, namespace: 'contact' });
  const metaT = await getTranslations({ locale, namespace: 'metadata.contact' });

  const webPageSchema = schemaTemplates.webPage({
    locale: typedLocale,
    path: typedLocale === 'en' ? '/contact' : `/ar/contact`,
    title: metaT('title'),
    description: metaT('description'),
    type: 'ContactPage',
  });

  const contactSchema = schemaTemplates.contactPage();

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', nameAr: 'الرئيسية', url: getCanonicalUrl('', typedLocale) },
    { name: metaT('title'), url: getCanonicalUrl('/contact', typedLocale) },
  ], typedLocale);

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(webPageSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(contactSchema) }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: serializeSchema(breadcrumbSchema) }}
      />

      {/* Hero */}
      <LedgerHero title={t('title')} subtitle={t('subtitle')} />

      {/* Contact Content */}
      <section className="section-padding-sm">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
            {/* Message slip */}
            <div className="receipt-edge bg-card px-6 py-8 md:px-8">
              <div className="flex items-baseline justify-between gap-3">
                <span className="mono-label text-muted-foreground">{t('slipTitle')}</span>
                <span className="font-receipt text-[11px] text-muted-foreground" aria-hidden="true">
                  {t('slipNumber')}
                </span>
              </div>
              <div className="tear-line my-5" aria-hidden="true" />
              <ContactForm />
            </div>

            {/* Contact Info as ledger entries */}
            <div className="space-y-8">
              <div>
                <h2 className="text-xl sm:text-2xl font-semibold text-foreground mb-3">
                  {t('info.title')}
                </h2>
                <p className="text-sm sm:text-base text-muted-foreground leading-relaxed">
                  {t('info.description')}
                </p>
              </div>

              <div className="border-t border-dashed border-ledger-line">
                {/* Email entry */}
                <div className="flex gap-4 py-5 border-b border-dashed border-ledger-line">
                  <span className="font-receipt text-sm text-primary pt-0.5 shrink-0 w-7" aria-hidden="true">
                    01
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t('info.email')}</h3>
                    <a
                      href={`mailto:${contact.email}`}
                      className="font-receipt text-sm text-muted-foreground hover:text-primary transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>

                {/* Quick Help entry */}
                <div className="flex gap-4 py-5 border-b border-dashed border-ledger-line">
                  <span className="font-receipt text-sm text-primary pt-0.5 shrink-0 w-7" aria-hidden="true">
                    02
                  </span>
                  <div>
                    <h3 className="font-semibold text-foreground mb-1">{t('support.title')}</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed mb-4">
                      {t('support.description')}
                    </p>
                    <Link href="/docs" className={buttonVariants({ variant: 'outline', size: 'md' })}>
                      {t('support.docsLink')}
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
