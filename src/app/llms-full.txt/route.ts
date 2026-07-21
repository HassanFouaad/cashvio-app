import { readFileSync } from 'fs';
import { join } from 'path';

import { siteConfig } from '@/config/site';
import { source } from '@/lib/docs-source';
import {
  collectEnglishMdxFiles,
  docsPathFromRelPath,
  parseMdxFrontmatter,
  sortMdxFilesByDocsTree,
  stripMdxComponents,
} from '@/lib/docs-llm';

export const revalidate = false; // static at build time

export function GET() {
  const SITE_URL = siteConfig.url;
  const docsDir = join(process.cwd(), 'content', 'docs');

  const lines: string[] = [
    `# ${siteConfig.name}: Full Documentation`,
    '',
    `> ${siteConfig.description}`,
    '',
    `Cashvio is a complete business management platform for online and in-store operations. It provides a free POS (free cashier), a free online store, product catalogue management, inventory control, multi-channel order processing, customer management, supplier & purchasing, analytics & reporting, team roles & permissions, and online storefront capabilities.`,
    '',
    `Docs are ordered for merchant onboarding: getting started, stores, catalogue, inventory, sales, customers, returns, suppliers, online store, marketing, then team, reports, settings, integrations, and calculations.`,
    '',
    `Index only (titles and URLs): ${SITE_URL}/llms.txt`,
    `Arabic HTML docs: ${SITE_URL}/ar/docs`,
    '',
    '---',
    '',
  ];

  const pageMap = new Map<string, { url: string; title: string; description: string }>();
  const pages = source.getPages('en');
  for (const page of pages) {
    const docsPath = page.url.replace(/^\/(en|ar)/, '');
    pageMap.set(docsPath, {
      url: `${SITE_URL}${docsPath}`,
      title: page.data.title,
      description: page.data.description || '',
    });
  }

  const mdxFiles = sortMdxFilesByDocsTree(docsDir, collectEnglishMdxFiles(docsDir));

  for (const filePath of mdxFiles) {
    const rawContent = readFileSync(filePath, 'utf-8');
    const { title, description } = parseMdxFrontmatter(rawContent);

    const relPath = filePath
      .slice(docsDir.length + 1)
      .replace(/\\/g, '/')
      .replace(/\.mdx$/, '');
    const docsPath = docsPathFromRelPath(relPath);

    const meta = pageMap.get(docsPath);
    const pageTitle = meta?.title || title;
    const pageUrl = meta?.url || `${SITE_URL}${docsPath}`;
    const pageDesc = meta?.description || description;
    const contentBody = stripMdxComponents(rawContent);

    lines.push(`## ${pageTitle}`);
    lines.push('');
    lines.push(`URL: ${pageUrl}`);
    if (pageDesc) {
      lines.push(`Description: ${pageDesc}`);
    }
    lines.push('');
    lines.push(contentBody);
    lines.push('');
    lines.push('---');
    lines.push('');
  }

  const content = lines.join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
