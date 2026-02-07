import { source } from '@/lib/docs-source';
import { createFromSource } from 'fumadocs-core/search/server';

export const revalidate = false;

export const { GET } = createFromSource(source, {
  localeMap: {
    en: { language: 'english' },
    ar: { language: 'arabic' },
  },
});
