import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { ContactForm } from '@/components/forms/contact-form';
import { Card, CardContent } from '@/components/ui/card';
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
  brand,
  contact,
  urls,
} from '@/config/seo';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.contact' });
  const typedLocale = locale as Locale;

  return {
    title: `${t('title')} | ${brand.name}`,
    description: t('description'),
    keywords: keywords[typedLocale],
    alternates: {
      canonical: getCanonicalUrl('/contact', typedLocale),
      languages: getAlternateUrls('/contact'),
    },
    openGraph: {
      ...openGraphDefaults,
      title: `${t('title')} | ${brand.name}`,
      description: t('description'),
      url: getCanonicalUrl('/contact', typedLocale),
      locale: typedLocale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: getAlternateLocales(typedLocale),
    },
    twitter: {
      ...twitterDefaults,
      title: `${t('title')} | ${brand.name}`,
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

  // Schema.org structured data
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

      {/* Header */}
      <section className="py-10 sm:py-12 md:py-16 bg-gradient-hero">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl font-bold text-foreground mb-2 sm:mb-3">
              {t('title')}
            </h1>
            <p className="text-sm sm:text-base md:text-lg text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-10 sm:py-12 md:py-16">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8 lg:gap-10 max-w-5xl mx-auto">
            {/* Contact Form */}
            <Card className="overflow-hidden">
              <CardContent className="p-6 md:p-8">
                <ContactForm />
              </CardContent>
            </Card>

            {/* Contact Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-bold text-foreground mb-4">
                  {t('info.title')}
                </h2>
                <p className="text-muted-foreground">
                  {t('info.description')}
                </p>
              </div>

              <div className="space-y-6">
                {/* Email */}
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                    <svg
                      className="w-6 h-6 text-primary"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <rect width="20" height="16" x="2" y="4" rx="2" />
                      <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t('info.email')}
                    </h3>
                    <a
                      href={`mailto:${contact.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {contact.email}
                    </a>
                  </div>
                </div>


              
               

             
              </div>

              {/* Quick Help */}
              <Card className="bg-muted/50">
                <CardContent className="p-6">
                  <h3 className="font-semibold text-foreground mb-2">
                    {t('support.title')}
                  </h3>
                  <p className="text-sm text-muted-foreground mb-4">
                    {t('support.description')}
                  </p>
                  <div className="flex flex-col sm:flex-row gap-2">
                    <Link
                      href="/docs"
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      {t('support.docsLink')}
                    </Link>
                   
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}

