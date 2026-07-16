import { env } from '@/config/env';

export const revalidate = false;

const COMMON_DISALLOW = [
  '/api/',
  '/_next/',
  '/private/',
  '/admin/',
  '/*.json$',
  '/cdn-cgi',
  '/thank-you',
  '/export/',
  '/*?*',
];

const AI_CRAWLERS = [
  'GPTBot',
  'ChatGPT-User',
  'ClaudeBot',
  'anthropic-ai',
  'Google-Extended',
  'PerplexityBot',
  'Bytespider',
  'CCBot',
  'cohere-ai',
];

export function GET(): Response {
  const SITE_URL = env.site.url;
  const disallowBlock = COMMON_DISALLOW.map((p) => `Disallow: ${p}`).join('\n');

  const content = [
    `# Robots.txt — ${SITE_URL}`,
    '#',
    '# This only affects the main marketing domain (e.g., cash-vio.com)',
    '# Subdomains (portal, api, console) have their own robots.txt with Disallow: /',
    '',
    '# Content Signals (IETF draft-romm-aipref-contentsignals)',
    '# https://contentsignals.org/',
    '#',
    '# search:   building a search index and providing search results',
    '# ai-input: inputting content into AI models (RAG, grounding, etc.)',
    '# ai-train: training or fine-tuning AI models',
    '',
    'User-Agent: *',
    'Content-Signal: ai-train=no, search=yes, ai-input=yes',
    'Allow: /',
    disallowBlock,
    '',
    '# AI crawlers — explicit access to docs and LLM resources',
    ...AI_CRAWLERS.map((ua) => `User-Agent: ${ua}`),
    'Content-Signal: ai-train=no, search=yes, ai-input=yes',
    'Allow: /',
    'Allow: /docs/',
    'Allow: /llms.txt',
    'Allow: /llms-full.txt',
    disallowBlock,
    '',
    `Sitemap: ${SITE_URL}/sitemap.xml`,
    `Host: ${SITE_URL}`,
    '',
  ].join('\n');

  return new Response(content, {
    headers: {
      'Content-Type': 'text/plain; charset=utf-8',
      'Cache-Control': 'public, max-age=86400, s-maxage=86400',
    },
  });
}
