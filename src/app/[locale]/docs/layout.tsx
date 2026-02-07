import type { ReactNode } from 'react';
import { DocsLayout } from 'fumadocs-ui/layouts/docs';
import { RootProvider } from 'fumadocs-ui/provider/next';
import { source, i18n } from '@/lib/docs-source';
import { defineI18nUI } from 'fumadocs-ui/i18n';

const { provider } = defineI18nUI(i18n, {
  translations: {
    en: {
      displayName: 'English',
      search: 'Search documentation...',
      searchNoResult: 'No results found',
    },
    ar: {
      displayName: 'العربية',
      search: 'ابحث في الشرح...',
      searchNoResult: 'لا توجد نتائج',
      toc: 'في هذه الصفحة',
      tocNoHeadings: 'لا توجد عناوين',
      lastUpdate: 'آخر تحديث',
      chooseLanguage: 'اختر اللغة',
      nextPage: 'التالي',
      previousPage: 'السابق',
      chooseTheme: 'اختر المظهر',
      editOnGithub: 'تعديل على GitHub',
    },
  },
});

export default async function DocsLayoutWrapper({
  params,
  children,
}: {
  params: Promise<{ locale: string }>;
  children: ReactNode;
}) {
  const { locale } = await params;

  return (
    <RootProvider
      i18n={provider(locale)}
      theme={{
        enabled: false,
      }}
      search={{
        enabled: true,
      }}
    >
      <DocsLayout
        tree={source.pageTree[locale]}
        nav={{
          title: locale === 'ar' ? 'شرح كاشفيو' : 'Cashvio Docs',
        }}
        sidebar={{
          defaultOpenLevel: 1,
          collapsible: true,
        }}
      >
        {children}
      </DocsLayout>
    </RootProvider>
  );
}
