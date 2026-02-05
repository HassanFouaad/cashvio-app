import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Skip i18n middleware for export routes - they handle locale internally
  // via cookies/headers, not URL segments
  if (pathname.startsWith('/export')) {
    return NextResponse.next();
  }
  
  // 1. Redirect /en/* to /* (English is default, no prefix needed)
  // This fixes Google Search Console "Page with redirect" errors
  if (pathname.startsWith('/en/') || pathname === '/en') {
    const newPath = pathname === '/en' ? '/' : pathname.replace(/^\/en/, '');
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    
    // 301 Permanent redirect
    return NextResponse.redirect(url, { status: 301 });
  }
  
  // 2. Sync cv_language cookie with NEXT_LOCALE if present
  // This ensures cross-subdomain language preference is respected
  const cvLanguage = request.cookies.get('cv_language')?.value;
  const nextLocale = request.cookies.get('NEXT_LOCALE')?.value;
  
  // If cv_language exists but NEXT_LOCALE doesn't match, sync them
  if (cvLanguage && cvLanguage !== nextLocale && (cvLanguage === 'en' || cvLanguage === 'ar')) {
    const response = intlMiddleware(request);
    
    // Set NEXT_LOCALE cookie to match cv_language
    response.cookies.set('NEXT_LOCALE', cvLanguage, {
      path: '/',
      maxAge: 365 * 24 * 60 * 60, // 1 year
      sameSite: 'lax',
    });
    
    return response;
  }
  
  // 3. Run next-intl middleware for locale detection and routing
  return intlMiddleware(request);
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

