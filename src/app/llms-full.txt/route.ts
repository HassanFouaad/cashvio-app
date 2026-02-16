import { source } from '@/lib/docs-source';
import { siteConfig } from '@/config/site';

export const revalidate = false; // static at build time

export function GET() {
  const SITE_URL = siteConfig.url;
  const pages = source.getPages('en');

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

  for (const page of pages) {
    const docsPath = page.url.replace(/^\/(en|ar)/, '');

    lines.push(`## ${page.data.title}`);
    lines.push('');
    lines.push(`URL: ${SITE_URL}${docsPath}`);

    if (page.data.description) {
      lines.push(`Description: ${page.data.description}`);
    }

    lines.push('');

    // Access the raw MDX content
    const rawContent = page.data.raw;
    if (rawContent) {
      // Strip frontmatter (---...---) and render as plain markdown
      const contentWithoutFrontmatter = rawContent
        .replace(/^---[\s\S]*?---\s*/, '')
        .trim();
      lines.push(contentWithoutFrontmatter);
    }

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
