import { NextRequest } from 'next/server';
import { convertHtmlToMarkdown } from '@/lib/html-to-markdown';

export const dynamic = 'force-dynamic';

export async function GET(request: NextRequest): Promise<Response> {
  const url = new URL(request.url);
  const path = url.searchParams.get('path');

  if (!path) {
    return new Response('Missing path parameter', { status: 400 });
  }

  try {
    const protocol = request.headers.get('x-forwarded-proto') || 'http';
    const host = request.headers.get('host') || 'localhost:3005';
    const origin = `${protocol}://${host}`;
    const targetUrl = `${origin}${path}`;

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

    if (!htmlResponse.headers.has('content-signal')) {
      responseHeaders.set(
        'content-signal',
        'ai-train=yes, search=yes, ai-input=yes',
      );
    } else {
      responseHeaders.set(
        'content-signal',
        htmlResponse.headers.get('content-signal')!,
      );
    }

    return new Response(markdown, { headers: responseHeaders });
  } catch {
    return new Response('Internal server error', { status: 500 });
  }
}
