import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { siteConfig } from '@/config/site';
import { type Locale } from '@/i18n/routing';
import { Link } from '@/i18n/navigation';
import { Card, CardContent } from '@/components/ui/card';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.contact' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/contact`,
    },
  };
}

export default async function ContactPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'contact' });

  const contactSchema = {
    '@context': 'https://schema.org',
    '@type': 'ContactPage',
    name: t('title'),
    description: t('subtitle'),
    url: `${siteConfig.url}/${locale}/contact`,
    mainEntity: {
      '@type': 'Organization',
      name: siteConfig.name,
      email: siteConfig.contact.email,
      telephone: siteConfig.contact.phone,
      address: {
        '@type': 'PostalAddress',
        streetAddress: siteConfig.contact.address.street,
        addressLocality: siteConfig.contact.address.city,
        addressCountry: siteConfig.contact.address.country,
      },
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(contactSchema).replace(/</g, '\\u003c'),
        }}
      />

      {/* Header */}
      <section className="py-16 md:py-24 bg-gradient-hero">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
              {t('title')}
            </h1>
            <p className="text-lg text-muted-foreground">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Contact Content */}
      <section className="py-16 md:py-24">
        <div className="container-wide">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 max-w-5xl mx-auto">
            {/* Contact Form */}
            <Card>
              <CardContent className="p-6 md:p-8">
                <form className="space-y-6">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        {t('form.name')}
                      </label>
                      <input
                        type="text"
                        id="name"
                        name="name"
                        placeholder={t('form.namePlaceholder')}
                        className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        required
                      />
                    </div>
                    <div>
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-foreground mb-2"
                      >
                        {t('form.email')}
                      </label>
                      <input
                        type="email"
                        id="email"
                        name="email"
                        placeholder={t('form.emailPlaceholder')}
                        className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label
                      htmlFor="phone"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t('form.phone')}
                    </label>
                    <input
                      type="tel"
                      id="phone"
                      name="phone"
                      placeholder={t('form.phonePlaceholder')}
                      className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t('form.subject')}
                    </label>
                    <input
                      type="text"
                      id="subject"
                      name="subject"
                      placeholder={t('form.subjectPlaceholder')}
                      className="flex h-10 w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2"
                      required
                    />
                  </div>

                  <div>
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-foreground mb-2"
                    >
                      {t('form.message')}
                    </label>
                    <textarea
                      id="message"
                      name="message"
                      rows={5}
                      placeholder={t('form.messagePlaceholder')}
                      className="flex min-h-[120px] w-full rounded-lg border border-border bg-background px-3 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 resize-none"
                      required
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full h-11 px-6 inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg font-medium transition-all duration-200 bg-primary text-primary-foreground hover:bg-primary-dark focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary shadow-sm hover:shadow-md cursor-pointer"
                  >
                    {t('form.submit')}
                  </button>
                </form>
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
                      href={`mailto:${siteConfig.contact.email}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {siteConfig.contact.email}
                    </a>
                  </div>
                </div>

                {/* Phone */}
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
                      <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t('info.phone')}
                    </h3>
                    <a
                      href={`tel:${siteConfig.contact.phone}`}
                      className="text-muted-foreground hover:text-primary transition-colors"
                    >
                      {siteConfig.contact.phone}
                    </a>
                  </div>
                </div>

                {/* Address */}
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
                      <path d="M20 10c0 6-8 12-8 12s-8-6-8-12a8 8 0 0 1 16 0Z" />
                      <circle cx="12" cy="10" r="3" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t('info.address')}
                    </h3>
                    <p className="text-muted-foreground">
                      {siteConfig.contact.address.street}
                      <br />
                      {siteConfig.contact.address.city}
                      <br />
                      {siteConfig.contact.address.country}
                    </p>
                  </div>
                </div>

                {/* Hours */}
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
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  </div>
                  <div>
                    <h3 className="font-semibold text-foreground">
                      {t('info.hours')}
                    </h3>
                    <p className="text-muted-foreground">
                      {t('info.hoursValue')}
                    </p>
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
                    <a
                      href={siteConfig.links.support}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium rounded-lg border border-border hover:bg-muted transition-colors"
                    >
                      {t('support.supportLink')}
                    </a>
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

