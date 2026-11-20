import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest): NextResponse {
  const { pathname } = request.nextUrl;

  // Skip i18n middleware for export routes - they handle locale internally
  // via cookies/headers, not URL segments
  if (pathname.startsWith('/export')) {
    return NextResponse.next();
  }

  // Markdown content negotiation for AI agents
  const acceptHeader = request.headers.get('accept') || '';
  if (acceptHeader.includes('text/markdown')) {
    return NextResponse.rewrite(new URL('/api/markdown', request.url));
  }
  
  // Let next-intl distinguish public locale URLs from its internal rewrites.
  // Eagerly redirecting every /en pathname also redirects the root's rewrite.
  const response = intlMiddleware(request);

  // Sync cv_language cookie with NEXT_LOCALE if present
  // This ensures cross-subdomain language preference is respected
  const cvLanguage = request.cookies.get('cv_language')?.value;
  const nextLocale = request.cookies.get('NEXT_LOCALE')?.value;
  
  // If cv_language exists but NEXT_LOCALE doesn't match, sync them
  if (cvLanguage && cvLanguage !== nextLocale && (cvLanguage === 'en' || cvLanguage === 'ar')) {
    // Set NEXT_LOCALE cookie to match cv_language
    response.cookies.set('NEXT_LOCALE', cvLanguage, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: 'lax',
    });
    
  }

  // Preserve permanent canonicalization only when next-intl actually returns
  // a redirect for a public English-prefixed URL, never for a rewrite response.
  if (
    (pathname === '/en' || pathname.startsWith('/en/')) &&
    response.status >= 300 && response.status < 400 &&
    response.headers.has('location')
  ) {
    return new NextResponse(null, { status: 301, headers: response.headers });
  }
  return response;
}

export const config = {
  // Match all pathnames except for API routes, static files, etc.
  matcher: [
    // Match all pathnames except for
    // - api (API routes)
    // - _next (Next.js internals)
    // - _vercel (Vercel internals)
    // - Static files with extensions
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};

