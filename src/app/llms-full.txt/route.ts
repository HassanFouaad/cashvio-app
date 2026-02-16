import { readFileSync, readdirSync, statSync } from 'fs';
import { join, relative } from 'path';
import { source } from '@/lib/docs-source';
import { siteConfig } from '@/config/site';

export const revalidate = false; // static at build time

function collectMdxFiles(dir: string): string[] {
  const files: string[] = [];
  const entries = readdirSync(dir);

  for (const entry of entries) {
    const fullPath = join(dir, entry);
    const stat = statSync(fullPath);

    if (stat.isDirectory()) {
      files.push(...collectMdxFiles(fullPath));
    } else if (entry.endsWith('.mdx') && !entry.includes('.ar.')) {
      files.push(fullPath);
    }
  }

  return files;
}

export function GET() {
  const SITE_URL = siteConfig.url;
  const docsDir = join(process.cwd(), 'content', 'docs');

  const lines: string[] = [
    `# ${siteConfig.name} — Full Documentation`,
    '',
    `> ${siteConfig.description}`,
    '',
    `Cashvio is a complete business management platform for online and in-store operations. It provides product catalogue management, inventory control, multi-channel order processing, customer management, supplier & purchasing, analytics & reporting, team roles & permissions, and online storefront capabilities.`,
    '',
    '---',
    '',
  ];

  // Build a map from slug to Fumadocs page for URL/metadata
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

  // Read raw MDX files and pair with metadata
  const mdxFiles = collectMdxFiles(docsDir);

  for (const filePath of mdxFiles) {
    const rawContent = readFileSync(filePath, 'utf-8');

    // Extract frontmatter title/description
    const frontmatterMatch = rawContent.match(/^---\s*\n([\s\S]*?)\n---/);
    let title = '';
    let description = '';

    if (frontmatterMatch) {
      const fm = frontmatterMatch[1];
      const titleMatch = fm.match(/^title:\s*(.+)$/m);
      const descMatch = fm.match(/^description:\s*(.+)$/m);
      if (titleMatch) title = titleMatch[1].trim();
      if (descMatch) description = descMatch[1].trim();
    }

    // Derive the docs path from file path
    const relPath = relative(docsDir, filePath)
      .replace(/\\/g, '/')
      .replace(/\.mdx$/, '')
      .replace(/\/index$/, '');
    const docsPath = relPath === 'index' ? '/docs' : `/docs/${relPath}`;

    // Use Fumadocs metadata if available, fall back to frontmatter
    const meta = pageMap.get(docsPath);
    const pageTitle = meta?.title || title;
    const pageUrl = meta?.url || `${SITE_URL}${docsPath}`;
    const pageDesc = meta?.description || description;

    // Strip frontmatter from content
    const contentBody = rawContent
      .replace(/^---[\s\S]*?---\s*/, '')
      .replace(/<Callout[^>]*>/g, '> **Note:** ')
      .replace(/<\/Callout>/g, '')
      .trim();

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
