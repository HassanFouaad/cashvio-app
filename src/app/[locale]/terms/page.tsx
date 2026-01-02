import type { Metadata } from 'next';
import { setRequestLocale, getTranslations } from 'next-intl/server';

import { siteConfig } from '@/config/site';

interface Props {
  params: Promise<{ locale: string }>;
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale } = await params;
  const t = await getTranslations({ locale, namespace: 'metadata.terms' });

  return {
    title: t('title'),
    description: t('description'),
    alternates: {
      canonical: `${siteConfig.url}/${locale}/terms`,
    },
  };
}

const sectionKeys = ['acceptance', 'services', 'accounts', 'payment', 'termination', 'liability', 'contact'] as const;

export default async function TermsPage({ params }: Props) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations({ locale, namespace: 'terms' });

  return (
    <article className="py-16 md:py-24">
      <div className="container-narrow">
        {/* Header */}
        <header className="mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4">
            {t('title')}
          </h1>
          <p className="text-muted-foreground">
            {t('lastUpdated')}
          </p>
        </header>

        {/* Intro */}
        <div className="prose prose-lg dark:prose-invert max-w-none mb-12">
          <p className="text-lg text-muted-foreground leading-relaxed">
            {t('intro')}
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-12">
          {sectionKeys.map((key) => (
            <section key={key}>
              <h2 className="text-2xl font-semibold text-foreground mb-4">
                {t(`sections.${key}.title`)}
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                {t(`sections.${key}.content`)}
              </p>
            </section>
          ))}
        </div>
      </div>
    </article>
  );
}

