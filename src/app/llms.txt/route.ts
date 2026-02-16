import { source } from '@/lib/docs-source';
import { siteConfig } from '@/config/site';

export const revalidate = false; // static at build time

export function GET() {
  const SITE_URL = siteConfig.url;
  const pages = source.getPages('en');

  const sections: Map<string, { title: string; description: string; url: string }[]> = new Map();

  for (const page of pages) {
    const docsPath = page.url.replace(/^\/(en|ar)/, '');
    const parts = docsPath.replace('/docs/', '').split('/');
    const section = parts.length > 1 ? parts[0] : 'overview';

    if (!sections.has(section)) {
      sections.set(section, []);
    }

    sections.get(section)!.push({
      title: page.data.title,
      description: page.data.description || '',
      url: `${SITE_URL}${docsPath}`,
    });
  }

  const lines: string[] = [
    `# ${siteConfig.name}`,
    '',
    `> ${siteConfig.description}`,
    '',
    `Cashvio is a complete business management platform for online and in-store operations. It provides product catalogue management, inventory control, multi-channel order processing, customer management, supplier & purchasing, analytics & reporting, team roles & permissions, and online storefront capabilities.`,
    '',
    `## Documentation`,
    '',
    `Full docs with all content inline: ${SITE_URL}/llms-full.txt`,
    '',
  ];

  for (const [section, pages] of sections) {
    const sectionTitle = section
      .split('-')
      .map(w => w.charAt(0).toUpperCase() + w.slice(1))
      .join(' ');

    lines.push(`### ${sectionTitle}`);
    lines.push('');

    for (const page of pages) {
      const desc = page.description ? `: ${page.description}` : '';
      lines.push(`- [${page.title}](${page.url})${desc}`);
    }

    lines.push('');
  }

  lines.push(`## Links`);
  lines.push('');
  lines.push(`- Website: ${SITE_URL}`);
  lines.push(`- Documentation: ${SITE_URL}/docs`);
  lines.push(`- Features: ${SITE_URL}/features`);
  lines.push(`- Pricing: ${SITE_URL}/pricing`);
  lines.push(`- Contact: ${SITE_URL}/contact`);
  lines.push('');

  const content = lines.join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
