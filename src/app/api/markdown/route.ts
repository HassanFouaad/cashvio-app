import { NextRequest } from 'next/server';
import { convertHtmlToMarkdown } from '@/lib/html-to-markdown';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<Response> {
  const originalPath = request.nextUrl.pathname + request.nextUrl.search;

  try {
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3005';
    const targetUrl = `${protocol}://${host}${originalPath}`;

    const htmlResponse = await fetch(targetUrl, {
      headers: {
        Accept: 'text/html',
        Cookie: request.headers.get('cookie') || '',
      },
    });

    if (!htmlResponse.ok) {
      return new Response('Page not found', { status: htmlResponse.status });
    }

    const html = await htmlResponse.text();
    const { markdown, tokens, originalTokens } = convertHtmlToMarkdown(html);

    const responseHeaders = new Headers();
    responseHeaders.set('Content-Type', 'text/markdown; charset=utf-8');
    responseHeaders.set('Vary', 'Accept');
    responseHeaders.set('x-markdown-tokens', tokens.toString());
    responseHeaders.set('x-original-tokens', originalTokens.toString());
    responseHeaders.set(
      'Cache-Control',
      htmlResponse.headers.get('cache-control') ||
        'public, max-age=3600, s-maxage=3600',
    );

    const contentSignal = htmlResponse.headers.get('content-signal');
    responseHeaders.set(
      'content-signal',
      contentSignal || 'ai-train=yes, search=yes, ai-input=yes',
    );

    return new Response(markdown, { headers: responseHeaders });
  } catch {
    return new Response('Internal server error', { status: 500 });
  }
}
