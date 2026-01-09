import { getTranslations, getLocale } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { type Locale } from '@/i18n/routing';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  getAlternateUrls,
  urls,
} from '@/config/seo';

export default async function NotFound() {
  const t = await getTranslations('errors.notFound');
  const locale = await getLocale() as Locale;

  // Schema.org structured data for 404 page
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: '404 - Page Not Found',
    description: 'The requested page could not be found.',
    image: {
      '@type': 'ImageObject',
      url: `${urls.site}/assets/logo-light.png`,
      width: 512,
      height: 512,
    },
    inLanguage: locale === 'ar' ? 'ar-EG' : 'en-US',
  };

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', url: getCanonicalUrl('', locale) },
    { name: '404', url: getCanonicalUrl('/404', locale) },
  ]);

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
      <div className="flex flex-col items-center justify-center min-h-[60vh] py-16 px-4">
        <div className="text-center max-w-md">
          {/* 404 Icon */}
          <div className="w-24 h-24 mx-auto mb-8 rounded-full bg-muted flex items-center justify-center">
            <svg
              className="w-12 h-12 text-muted-foreground"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="m15 9-6 6" />
              <path d="m9 9 6 6" />
            </svg>
          </div>

          {/* Title */}
          <h1 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h1>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8">
            {t('description')}
          </p>

          {/* CTA */}
          <Link href="/" className={cn(buttonVariants({ size: 'lg' }))}>
            {t('backHome')}
          </Link>
        </div>
      </div>
    </>
  );
}
