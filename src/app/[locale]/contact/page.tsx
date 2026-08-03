import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { type Locale } from '@/i18n/routing';
import { ContactForm } from '@/components/forms/contact-form';
import { buttonVariants } from '@/components/ui/button';
import { LedgerHero } from '@/components/marketing';
import { Link } from '@/i18n/navigation';
import { getWhatsAppLink } from '@/lib/utils/whatsapp';
import { TrackedExternalLink } from '@/lib/analytics';
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
  const whatsAppLink = getWhatsAppLink(t('info.whatsappPrefill'));

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
      <LedgerHero title={t('title')} subtitle={t('subtitle')} trackLocation="/contact" />

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

                {/* WhatsApp entry — the channel Egyptian merchants actually use */}
                {whatsAppLink && (
                  <div className="flex gap-4 py-5 border-b border-dashed border-ledger-line">
                    <span className="font-receipt text-sm text-primary pt-0.5 shrink-0 w-7" aria-hidden="true">
                      02
                    </span>
                    <div>
                      <h3 className="font-semibold text-foreground mb-1">{t('info.whatsapp')}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-3">
                        {t('info.whatsappDescription')}
                      </p>
                      <TrackedExternalLink
                        href={whatsAppLink}
                        trackLocation="contact_page"
                        trackKind="whatsapp"
                        className={buttonVariants({ variant: 'outline', size: 'md' })}
                      >
                        <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z" />
                        </svg>
                        {t('info.whatsappCta')}
                      </TrackedExternalLink>
                    </div>
                  </div>
                )}

                {/* Quick Help entry */}
                <div className="flex gap-4 py-5 border-b border-dashed border-ledger-line">
                  <span className="font-receipt text-sm text-primary pt-0.5 shrink-0 w-7" aria-hidden="true">
                    {whatsAppLink ? '03' : '02'}
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
