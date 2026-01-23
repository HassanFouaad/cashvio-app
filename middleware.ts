import createMiddleware from 'next-intl/middleware';
import { NextRequest, NextResponse } from 'next/server';
import { routing } from './src/i18n/routing';

const intlMiddleware = createMiddleware(routing);

export default function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  
  // 1. Redirect /en/* to /* (English is default, no prefix needed)
  // This fixes Google Search Console "Page with redirect" errors
  if (pathname.startsWith('/en/') || pathname === '/en') {
    const newPath = pathname === '/en' ? '/' : pathname.replace(/^\/en/, '');
    const url = request.nextUrl.clone();
    url.pathname = newPath;
    
    // 301 Permanent redirect
    return NextResponse.redirect(url, { status: 301 });
  }
  
  // 2. Handle trailing slashes (optional - normalize URLs)
  // Uncomment if you want to enforce no trailing slashes
  // if (pathname !== '/' && pathname.endsWith('/')) {
  //   const url = request.nextUrl.clone();
  //   url.pathname = pathname.slice(0, -1);
  //   return NextResponse.redirect(url, { status: 301 });
  // }
  
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

