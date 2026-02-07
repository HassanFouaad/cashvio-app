import type { Metadata } from 'next';
import { source } from '@/lib/docs-source';
import {
  DocsPage,
  DocsBody,
  DocsDescription,
  DocsTitle,
} from 'fumadocs-ui/page';
import defaultMdxComponents from 'fumadocs-ui/mdx';
import { notFound } from 'next/navigation';
import { siteConfig } from '@/config/site';

export default async function Page(props: {
  params: Promise<{ slug?: string[]; locale: string }>;
}) {
  const params = await props.params;
  const page = source.getPage(params.slug, params.locale);
  if (!page) notFound();

  const MDX = page.data.body;

  return (
    <DocsPage
      toc={page.data.toc}
      full={page.data.full}
    >
      <DocsTitle>{page.data.title}</DocsTitle>
      <DocsDescription>{page.data.description}</DocsDescription>
      <DocsBody>
        <MDX components={{ ...defaultMdxComponents }} />
      </DocsBody>
    </DocsPage>
  );
}

export function generateStaticParams() {
  return source.generateParams('slug', 'locale');
}

export async function generateMetadata(props: {
  params: Promise<{ slug?: string[]; locale: string }>;
}): Promise<Metadata> {
  const params = await props.params;
  const page = source.getPage(params.slug, params.locale);
  if (!page) notFound();

  const SITE_URL = siteConfig.url;
  const docsPath = page.url.replace(/^\/(en|ar)/, '');
  const locale = params.locale;

  return {
    title: page.data.title,
    description: page.data.description,
    alternates: {
      canonical: locale === 'en' ? `${SITE_URL}${docsPath}` : `${SITE_URL}/${locale}${docsPath}`,
      languages: {
        'x-default': `${SITE_URL}${docsPath}`,
        'en': `${SITE_URL}${docsPath}`,
        'ar': `${SITE_URL}/ar${docsPath}`,
      },
    },
    openGraph: {
      title: page.data.title,
      description: page.data.description,
      type: 'article',
      locale: locale === 'ar' ? 'ar_EG' : 'en_US',
      alternateLocale: locale === 'ar' ? ['en_US'] : ['ar_EG'],
      url: locale === 'en' ? `${SITE_URL}${docsPath}` : `${SITE_URL}/${locale}${docsPath}`,
      siteName: siteConfig.name,
    },
    twitter: {
      card: 'summary',
      title: page.data.title,
      description: page.data.description,
    },
    robots: {
      index: true,
      follow: true,
      googleBot: {
        index: true,
        follow: true,
        'max-snippet': -1,
        'max-image-preview': 'large',
      },
    },
  };
}
