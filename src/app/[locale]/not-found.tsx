import type { Metadata } from 'next';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/navigation';
import { buttonVariants } from '@/components/ui/button';
import { cn } from '@/lib/utils/cn';
import { type Locale } from '@/i18n/routing';
import {
  schemaTemplates,
  serializeSchema,
  getCanonicalUrl,
  urls,
  brand,
} from '@/config/seo';

// Metadata for 404 page
export const metadata: Metadata = {
  title: `404 - Page Not Found | ${brand.name}`,
  description: 'The page you are looking for could not be found.',
  robots: {
    index: false, // Don't index 404 pages
    follow: true,
  },
};

export default async function NotFound() {
  // Try to get locale from URL, fallback to 'en'
  let locale: Locale = 'en';
  try {
    const { getLocale } = await import('next-intl/server');
    locale = (await getLocale()) as Locale;
  } catch (error) {
    // If we can't get locale, use English as default
    locale = 'en';
  }

  const t = await getTranslations({ locale, namespace: 'errors.notFound' });

  // Schema.org structured data for 404 page
  const webPageSchema = {
    '@context': 'https://schema.org',
    '@type': 'WebPage',
    name: t('title'),
    description: t('description'),
    image: {
      '@type': 'ImageObject',
      url: `${urls.site}/assets/logo-light.png`,
      width: 512,
      height: 512,
    },
    inLanguage: locale === 'ar' ? 'ar-EG' : 'en-US',
    isPartOf: {
      '@id': `${urls.site}/#website`,
    },
  };

  const breadcrumbSchema = schemaTemplates.breadcrumb([
    { name: 'Home', url: getCanonicalUrl('', locale) },
    { name: '404', url: '#' },
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
      
      <div className="flex flex-col items-center justify-center min-h-[70vh] py-16 px-4">
        <div className="text-center max-w-2xl">
          {/* 404 Large Number */}
          <div className="mb-8">
            <h1 className="text-[150px] md:text-[200px] font-bold text-primary/20 leading-none select-none">
              404
            </h1>
          </div>

          {/* Error Icon */}
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-destructive/10 flex items-center justify-center">
            <svg
              className="w-10 h-10 text-destructive"
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
          <h2 className="text-3xl md:text-4xl font-bold text-foreground mb-4">
            {t('title')}
          </h2>

          {/* Description */}
          <p className="text-lg text-muted-foreground mb-8 max-w-md mx-auto">
            {t('description')}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/" 
              className={cn(buttonVariants({ size: 'lg', variant: 'primary' }))}
            >
              {t('backHome')}
            </Link>
            <Link 
              href="/contact" 
              className={cn(buttonVariants({ size: 'lg', variant: 'outline' }))}
            >
              {t('contactSupport') || 'Contact Support'}
            </Link>
          </div>

          {/* Helpful Links */}
          <div className="mt-12 pt-8 border-t border-border">
            <p className="text-sm text-muted-foreground mb-4">
              {locale === 'ar' ? 'ربما تبحث عن:' : 'You might be looking for:'}
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Link 
                href="/features" 
                className="text-sm text-primary hover:underline"
              >
                {locale === 'ar' ? 'الميزات' : 'Features'}
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link 
                href="/pricing" 
                className="text-sm text-primary hover:underline"
              >
                {locale === 'ar' ? 'الأسعار' : 'Pricing'}
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link 
                href="/docs" 
                className="text-sm text-primary hover:underline"
              >
                {locale === 'ar' ? 'الوثائق' : 'Documentation'}
              </Link>
              <span className="text-muted-foreground">•</span>
              <Link 
                href="/register" 
                className="text-sm text-primary hover:underline"
              >
                {locale === 'ar' ? 'التسجيل' : 'Register'}
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
