import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';

export interface DocsLlmSection {
  key: string;
  title: string;
  pageSlugs: string[];
}

interface DocsMetaJson {
  title?: string;
  pages: string[];
}

/**
 * Onboarding-first docs tree used by llms.txt / llms-full.txt.
 * Mirrors content/docs/meta.json section order and labels.
 */
export function loadDocsLlmSections(docsDir: string = join(process.cwd(), 'content', 'docs')): DocsLlmSection[] {
  const rootMeta = JSON.parse(readFileSync(join(docsDir, 'meta.json'), 'utf-8')) as DocsMetaJson;
  const sections: DocsLlmSection[] = [];
  let pendingTitle: string | null = null;

  for (const entry of rootMeta.pages) {
    if (entry === 'index') {
      sections.push({
        key: 'overview',
        title: 'Overview',
        pageSlugs: ['index'],
      });
      continue;
    }

    if (entry.startsWith('---') && entry.endsWith('---')) {
      pendingTitle = entry.slice(3, -3).trim();
      continue;
    }

    if (entry.startsWith('...')) {
      const folder = entry.slice(3);
      const sectionMetaPath = join(docsDir, folder, 'meta.json');
      const sectionMeta = JSON.parse(readFileSync(sectionMetaPath, 'utf-8')) as DocsMetaJson;
      sections.push({
        key: folder,
        title: pendingTitle || folder,
        pageSlugs: sectionMeta.pages.filter((slug) => !slug.startsWith('---')),
      });
      pendingTitle = null;
      continue;
    }

    // Root-level page (e.g. changelog)
    sections.push({
      key: entry,
      title: pendingTitle || entry,
      pageSlugs: [entry],
    });
    pendingTitle = null;
  }

  return sections;
}

export function docsPathFromRelPath(relPath: string): string {
  const normalized = relPath.replace(/\\/g, '/').replace(/\.mdx$/, '').replace(/\/index$/, '');
  return normalized === 'index' ? '/docs' : `/docs/${normalized}`;
}

export function collectEnglishMdxFiles(docsDir: string): string[] {
  const files: string[] = [];
  const entries = readdirSync(docsDir);

  for (const entry of entries) {
    const fullPath = join(docsDir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...collectEnglishMdxFiles(fullPath));
    } else if (entry.endsWith('.mdx') && !entry.includes('.ar.')) {
      files.push(fullPath);
    }
  }

  return files;
}

export function mdxRelPath(docsDir: string, filePath: string): string {
  return relative(docsDir, filePath).replace(/\\/g, '/');
}

/** Sort English MDX files to match the sidebar / onboarding tree. */
export function sortMdxFilesByDocsTree(docsDir: string, files: string[]): string[] {
  const sections = loadDocsLlmSections(docsDir);
  const order = new Map<string, number>();
  let index = 0;

  for (const section of sections) {
    for (const slug of section.pageSlugs) {
      const rel =
        section.key === 'overview' || section.key === slug
          ? `${slug}.mdx`
          : `${section.key}/${slug}.mdx`;
      order.set(rel, index);
      index += 1;
    }
  }

  return [...files].sort((a, b) => {
    const relA = mdxRelPath(docsDir, a);
    const relB = mdxRelPath(docsDir, b);
    const orderA = order.get(relA) ?? Number.MAX_SAFE_INTEGER;
    const orderB = order.get(relB) ?? Number.MAX_SAFE_INTEGER;
    if (orderA !== orderB) return orderA - orderB;
    return relA.localeCompare(relB);
  });
}

/** Strip Fumadocs JSX so LLM full dumps stay plain markdown. */
export function stripMdxComponents(rawContent: string): string {
  return rawContent
    .replace(/^---[\s\S]*?---\s*/, '')
    .replace(/<Callout[^>]*>/g, '> **Note:** ')
    .replace(/<\/Callout>/g, '')
    .replace(/<\/?Cards>/g, '')
    .replace(/<Card\b[^>]*\/>/g, '')
    .replace(/<Card\b[^>]*>[\s\S]*?<\/Card>/g, '')
    .replace(/<\/?Steps>/g, '')
    .replace(/<\/?Step\b[^>]*>/g, '')
    .replace(/\n{3,}/g, '\n\n')
    .trim();
}

export function parseMdxFrontmatter(rawContent: string): {
  title: string;
  description: string;
} {
  const frontmatterMatch = rawContent.match(/^---\s*\n([\s\S]*?)\n---/);
  let title = '';
  let description = '';

  if (frontmatterMatch) {
    const fm = frontmatterMatch[1];
    const titleMatch = fm.match(/^title:\s*(.+)$/m);
    const descMatch = fm.match(/^description:\s*(.+)$/m);
    if (titleMatch) title = titleMatch[1].trim().replace(/^["']|["']$/g, '');
    if (descMatch) description = descMatch[1].trim().replace(/^["']|["']$/g, '');
  }

  return { title, description };
}
