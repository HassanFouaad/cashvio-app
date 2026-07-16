import { NodeHtmlMarkdown } from 'node-html-markdown';

interface MarkdownConversionResult {
  markdown: string;
  tokens: number;
  originalTokens: number;
}

interface Frontmatter {
  title?: string;
  description?: string;
  image?: string;
}

const ELEMENTS_TO_STRIP = [
  'script',
  'style',
  'nav',
  'header',
  'footer',
  'aside',
  'noscript',
  'iframe',
  'svg',
  'form',
  'button',
];

function extractMetaContent(
  html: string,
  attr: 'name' | 'property',
  value: string,
): string | undefined {
  const patterns = [
    new RegExp(
      `<meta[^>]+${attr}=["']${value}["'][^>]+content=["']([^"']+)["']`,
      'i',
    ),
    new RegExp(
      `<meta[^>]+content=["']([^"']+)["'][^>]+${attr}=["']${value}["']`,
      'i',
    ),
  ];

  for (const pattern of patterns) {
    const match = html.match(pattern);
    if (match) return match[1].trim();
  }
  return undefined;
}

function extractFrontmatter(html: string): Frontmatter {
  const fm: Frontmatter = {};

  const titleMatch = html.match(/<title[^>]*>([^<]*)<\/title>/i);
  fm.title = titleMatch?.[1]?.trim();
  if (!fm.title) {
    fm.title = extractMetaContent(html, 'property', 'og:title');
  }

  fm.description = extractMetaContent(html, 'name', 'description');
  if (!fm.description) {
    fm.description = extractMetaContent(html, 'property', 'og:description');
  }

  fm.image = extractMetaContent(html, 'property', 'og:image');

  return fm;
}

function extractJsonLd(html: string): string[] {
  const blocks: string[] = [];
  const regex =
    /<script[^>]+type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let match;
  while ((match = regex.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(match[1].trim());
      blocks.push(JSON.stringify(parsed));
    } catch {
      // skip invalid JSON-LD
    }
  }
  return blocks;
}

function stripNonContentHtml(html: string): string {
  let cleaned = html;

  for (const tag of ELEMENTS_TO_STRIP) {
    cleaned = cleaned.replace(
      new RegExp(`<${tag}[\\s\\S]*?<\\/${tag}>`, 'gi'),
      '',
    );
    cleaned = cleaned.replace(new RegExp(`<${tag}[^>]*\\/>`, 'gi'), '');
  }

  cleaned = cleaned.replace(/<head[\s\S]*?<\/head>/gi, '');

  const mainMatch = cleaned.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
  if (mainMatch) return mainMatch[1];

  const articleMatch = cleaned.match(/<article[^>]*>([\s\S]*?)<\/article>/i);
  if (articleMatch) return articleMatch[1];

  const bodyMatch = cleaned.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  if (bodyMatch) return bodyMatch[1];

  return cleaned;
}

function escapeYamlValue(value: string): string {
  if (/[:#{}[\],&*?|>!%@`]/.test(value) || value.includes('"')) {
    return `"${value.replace(/\\/g, '\\\\').replace(/"/g, '\\"')}"`;
  }
  return value;
}

function estimateTokens(text: string): number {
  const words = text.split(/\s+/).filter(Boolean);
  return Math.ceil(words.length * 1.3);
}

export function convertHtmlToMarkdown(html: string): MarkdownConversionResult {
  const originalTokens = estimateTokens(html);
  const frontmatter = extractFrontmatter(html);
  const jsonLd = extractJsonLd(html);
  const contentHtml = stripNonContentHtml(html);

  const nhm = new NodeHtmlMarkdown({
    maxConsecutiveNewlines: 2,
    useLinkReferenceDefinitions: false,
  });

  const body = nhm.translate(contentHtml).trim();

  const parts: string[] = [];

  const fmEntries = Object.entries(frontmatter).filter(
    (entry): entry is [string, string] => typeof entry[1] === 'string',
  );
  if (fmEntries.length > 0) {
    parts.push('---');
    for (const [key, value] of fmEntries) {
      parts.push(`${key}: ${escapeYamlValue(value)}`);
    }
    parts.push('---');
    parts.push('');
  }

  parts.push(body);

  if (jsonLd.length > 0) {
    parts.push('');
    parts.push('```json');
    parts.push(jsonLd.join('\n'));
    parts.push('```');
  }

  const markdown = parts.join('\n');

  return {
    markdown,
    tokens: estimateTokens(markdown),
    originalTokens,
  };
}
